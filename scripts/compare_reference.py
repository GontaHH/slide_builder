"""手本（公開資料のPDF）と自分のデッキ（PDF）の版面を、同じ物差しで測って比べる（rules/slide-rules.md I-5）。

    python3 scripts/compare_reference.py 手本.pdf 自分.pdf [--ref-pages 5,6,7] [--own-pages 2-80] [--detail]

1ページごとに次の7つを測り、項目ごとに「手本のページの分布」と「自分のページの分布」がどれだけ重なるかを
1−KS距離（2つの累積分布の差の最大値）で0〜1の点数にする。手本どうしを比べると100%になる。7項目の平均を類似度とする。
フォント・色そのものは比べない（本リポジトリの規定で手本と変えているため）。--detail では、手本の中央値から遠いページを挙げる。

手本どうしでも、ページを半分に分けて比べると類似度は100%にならない（ページごとのばらつきと枚数の少なさのため。MCK04で約8割）。
そこで、手本のページを無作為に2つに分けて比べた類似度（20回の平均）を「手本どうしの類似度」とし、
自分の類似度をそれで割った値を「達成度」として示す（達成度100%＝手本どうしと同じくらい似ている）。

  fig    本体の面積のうち、図（塗り・線・曲線）が占める割合
  chars  本体の文字数
  sizes  本体で使っている文字の大きさの種類（段差の数）
  nums   本体の文字のうち数字の割合（データの密度）
  onfig  本体の文字のうち、図の上か図のすぐ脇にある文字の割合（ラベルを図に直接書いているか）
  note   注記・出所の文字数
  fills  本体の塗りの色の数
"""
import sys, re, statistics as st
import pdfplumber

FEATURES = ["fig", "chars", "sizes", "nums", "onfig", "note", "fills"]
GX, GY = 96, 54


def _range(spec, n):
    out = []
    for part in spec.split(","):
        if "-" in part:
            a, b = part.split("-"); out += list(range(int(a), int(b) + 1))
        elif part:
            out.append(int(part))
    return [p for p in out if 1 <= p <= n]


def measure(page):
    W, H = page.width, page.height
    words = page.extract_words(extra_attrs=["size"])
    rules = [l for l in page.lines if abs(l["top"] - l["bottom"]) < 1.5 and (l["x1"] - l["x0"]) > 0.6 * W and l["top"] < 0.32 * H]
    top = min((l["top"] for l in rules), default=0.18 * H) + 2
    small = [w for w in words if w["size"] <= 9.6 and w["top"] > 0.85 * H]
    bottom = min((w["top"] for w in small), default=0.93 * H) - 2
    bh = max(bottom - top, 1)
    # 図の面積：塗りのある矩形・曲線・短い線を格子に塗る
    mask = [[False] * GX for _ in range(GY)]
    fills = set()

    def paint(x0, y0, x1, y1):
        if y1 < top or y0 > bottom: return
        y0, y1 = max(y0, top), min(y1, bottom)
        for gy in range(int((y0 - top) / bh * GY), min(GY, int((y1 - top) / bh * GY) + 1)):
            for gx in range(max(0, int(x0 / W * GX)), min(GX, int(x1 / W * GX) + 1)):
                mask[gy][gx] = True

    for r in page.rects:
        col = r.get("non_stroking_color")
        white = col in (None, (1,), (1, 1, 1), [1, 1, 1], (1.0, 1.0, 1.0), [1.0], (0, 0, 0, 0))
        if (r["width"] > 0.92 * W and r["height"] > 0.3 * H): continue          # 背景の全面
        if r.get("fill") and not white:
            paint(r["x0"], r["top"], r["x1"], r["bottom"])
            if top <= r["top"] < bottom: fills.add(str(col))
        elif r.get("stroke"):
            paint(r["x0"], r["top"], r["x1"], r["bottom"])
    for c in page.curves:
        if (c["x1"] - c["x0"]) >= 0.92 * W and (c["bottom"] - c["top"]) > 0.3 * H: continue
        paint(c["x0"], c["top"], c["x1"], c["bottom"])
        col = c.get("non_stroking_color")
        if c.get("fill") and col not in (None, (1,), (1, 1, 1), [1, 1, 1], (1.0, 1.0, 1.0), [1.0]) and top <= c["top"] < bottom:
            fills.add(str(col))
    for l in page.lines:
        if (l["x1"] - l["x0"]) < 0.6 * W: paint(l["x0"] - 1, l["top"] - 1, l["x1"] + 1, l["bottom"] + 1)
    cells = sum(sum(r) for r in mask)
    fig = cells / (GX * GY)
    body = [w for w in words if top <= w["top"] < bottom]
    txt = "".join(w["text"] for w in body)
    chars = len(txt)
    sizes = len({round(w["size"]) for w in body if len(w["text"]) >= 1}) if body else 0
    nums = sum(ch.isdigit() for ch in txt) / chars if chars else 0

    def near(w):
        cx, cy = (w["x0"] + w["x1"]) / 2, (w["top"] + w["bottom"]) / 2
        gx, gy = int(cx / W * GX), int((cy - top) / bh * GY)
        return any(0 <= gy + dy < GY and 0 <= gx + dx < GX and mask[gy + dy][gx + dx] for dy in (-2, -1, 0, 1, 2) for dx in (-3, -2, -1, 0, 1, 2, 3))

    onfig = sum(len(w["text"]) for w in body if near(w)) / chars if chars else 0
    note = sum(len(w["text"]) for w in words if w["top"] >= bottom and w["size"] <= 9.6)
    return dict(fig=fig, chars=chars, sizes=sizes, nums=nums, onfig=onfig, note=note, fills=len(fills))


def ks(a, b):
    """2つの標本の累積分布の差の最大値（0＝同じ分布、1＝重ならない）。"""
    xs = sorted(set(a) | set(b))
    fa = lambda x: sum(v <= x for v in a) / len(a)
    fb = lambda x: sum(v <= x for v in b) / len(b)
    return max(abs(fa(x) - fb(x)) for x in xs) if xs else 0.0


def profile(pdf, pages):
    return {p: measure(pdf.pages[p - 1]) for p in pages}


def score(v, ref):
    vals = sorted(ref)
    m = st.median(vals)
    q1, q3 = vals[len(vals) // 4], vals[(3 * len(vals)) // 4]
    r = max(1.5 * (q3 - q1), 0.15 * abs(m), 1e-6)
    return max(0.0, 1 - abs(v - m) / r)


def main(argv):
    ref_pdf, own_pdf = pdfplumber.open(argv[1]), pdfplumber.open(argv[2])
    opt = lambda k, d: argv[argv.index(k) + 1] if k in argv else d
    rp = _range(opt("--ref-pages", f"1-{len(ref_pdf.pages)}"), len(ref_pdf.pages))
    op = _range(opt("--own-pages", f"2-{len(own_pdf.pages)}"), len(own_pdf.pages))
    ref, own = profile(ref_pdf, rp), profile(own_pdf, op)
    refv = {f: [ref[p][f] for p in rp] for f in FEATURES}
    print("項目     手本の中央値   自分の中央値   分布の重なり")
    total = []
    for f in FEATURES:
        ov = 1 - ks([own[p][f] for p in op], refv[f])
        total.append(ov)
        print(f"{f:6s} {st.median(refv[f]):12.2f} {st.median([own[p][f] for p in op]):12.2f}   {ov:.0%}")
    pages = {p: st.mean(score(own[p][f], refv[f]) for f in FEATURES) for p in op}
    raw = st.mean(total)
    import random
    base = []
    for seed in range(20):
        rnd = random.Random(seed); pp = rp[:]; rnd.shuffle(pp); a, b = pp[: len(pp) // 2], pp[len(pp) // 2:]
        base.append(st.mean(1 - ks([ref[p][f] for p in a], [ref[p][f] for p in b]) for f in FEATURES))
    bl = st.mean(base)
    print(f"--- 類似度 {raw:.1%}（手本{len(rp)}ページ・自分{len(op)}ページ）／手本どうしの類似度 {bl:.1%}／達成度 {min(raw / bl, 1):.1%}")
    if "--detail" in argv:
        for p, s in sorted(pages.items(), key=lambda kv: kv[1])[:25]:
            d = own[p]
            print(f"p{p:03d} {s:.0%}  " + "  ".join(f"{f}={d[f]:.2f}" if isinstance(d[f], float) else f"{f}={d[f]}" for f in FEATURES))


if __name__ == "__main__":
    main(sys.argv)
