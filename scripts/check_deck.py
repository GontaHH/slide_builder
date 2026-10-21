import sys, re
from pptx import Presentation
from lxml import etree

# 指定色（rules/slide-rules.md B-3）：Navy・Blue1〜5・Gray1〜2・White・文字色・反対色
PALETTE = {"000F78", "3C64AA", "83A0D3", "72DFF0", "E0EEF8", "C1DDF1", "CCCCCC", "7F7F7F", "FFFFFF", "3F3F3F", "D73232"}
ACCENT_RED = "D73232"
PLACEHOLDER = re.compile(r"◯◯|○○|〇〇|XX|ＸＸ|ダミー|見本|lorem|TBD|テキストを入力|【(?!要確認)[^】]{1,15}】")
SMALL_OK = ("注", "出所", "（", "(", "縦軸", "横軸", "【補足", "補足", "※")

DARK = {"000F78", "7F7F7F", "3C64AA", "3F3F3F"}
CNS = {"c": "http://schemas.openxmlformats.org/drawingml/2006/chart", "a": "http://schemas.openxmlformats.org/drawingml/2006/main"}

def zen_len(t):
    """全角換算の字数（半角英数・記号は0.55字）。2行に収まるかの目安に使う。"""
    return sum(0.55 if ord(c) < 0x2000 else 1 for c in t)

def label_contrast(chart_part):
    """グラフのデータラベルの色と系列の塗りの対比を点検する（濃い塗りの内側ラベルは白、淡い塗りは黒）。"""
    root = etree.fromstring(chart_part.blob)
    bad = []
    for ser in root.iter("{%s}ser" % CNS["c"]):
        fill = ser.find("c:spPr/a:solidFill/a:srgbClr", CNS)
        d = ser.find("c:dLbls", CNS)
        if fill is None or d is None or d.find("c:showVal", CNS) is None or d.find("c:showVal", CNS).get("val") != "1":
            continue
        pos = d.find("c:dLblPos", CNS)
        if pos is None:
            pos = ser.getparent().find("c:dLbls/c:dLblPos", CNS)
        if pos is None:
            g = ser.getparent().find("c:grouping", CNS)
            inside = g is not None and g.get("val") in ("stacked", "percentStacked")
        else:
            inside = pos.get("val") in ("ctr", "inEnd", "inBase")
        clr = d.find(".//c:txPr//a:defRPr/a:solidFill/a:srgbClr", CNS)
        lc = (clr.get("val") if clr is not None else "000000").upper()
        fc = fill.get("val").upper()
        if inside and fc in DARK and lc != "FFFFFF": bad.append(f"濃い塗り#{fc}に#{lc}のラベル")
        if (not inside or fc not in DARK) and lc == "FFFFFF": bad.append(f"淡い塗り・外側に白ラベル（#{fc}）")
    return bad

def main(path, sample=False):
    prs = Presentation(path)
    H = prs.slide_height
    fails, warns = [], []
    for i, s in enumerate(prs.slides, 1):
        xml = etree.tostring(s._element).decode()
        # 色：パレット外
        for c in set(re.findall(r'srgbClr val="([0-9A-Fa-f]{6})"', xml)):
            c = c.upper()
            if c == ACCENT_RED: warns.append((i, "反対色(#D73232)を使用：悪化・未達そのものがメッセージか確認"))
            if c not in PALETTE: fails.append((i, f"パレット外の色 #{c}"))
        # 装飾
        if 'prst="roundRect"' in xml: fails.append((i, "角丸四角形"))
        if "outerShdw" in xml or "gradFill" in xml or "sp3d" in xml: fails.append((i, "影・グラデーション・3D"))
        msg, body_chars = None, 0
        for sh in s.shapes:
            if getattr(sh, "has_chart", False) and sh.has_chart:
                for b in label_contrast(sh.chart.part): fails.append((i, f"データラベルの対比：{b}"))
            if not sh.has_text_frame: continue
            t = sh.text_frame.text.strip()
            if not t: continue
            top = (sh.top or 0) / H
            if not sample and PLACEHOLDER.search(t): fails.append((i, f"仮の文字が残存：{t[:20]}"))
            if "【要確認】" in t: warns.append((i, "【要確認】が残存"))
            sizes = [r.font.size.pt for p in sh.text_frame.paragraphs for r in p.runs if r.font.size]
            if sizes and max(sizes) >= 19.5 and top < 0.2: msg = t.replace("\n", ""); continue
            zone_ok = top > 0.88 or top < 0.08 or t.startswith(SMALL_OK) or len(t) <= 8
            bad = [r for p in sh.text_frame.paragraphs for r in p.runs
                   if r.font.size and r.font.size.pt < 14 and r.text.strip() and not r.text.strip().startswith(SMALL_OK)]
            if bad and not zone_ok:
                fails.append((i, f"14pt未満（{bad[0].font.size.pt:g}pt）：{bad[0].text.strip()[:20]}"))
            if 0.25 < top < 0.9 and not t.startswith(("注", "出所")): body_chars += len(t)
        if i > 1 and msg:
            n = len(msg)
            if n < 55: warns.append((i, f"メッセージが短い（{n}字）：2行を埋めているか"))
            if n > 80: fails.append((i, f"メッセージが長い（{n}字）：3行になる恐れ"))
            elif zen_len(msg) > 69: warns.append((i, f"メッセージが全角換算{zen_len(msg):.0f}字：3行になる恐れ（66字以内が目安）"))
            if re.match(r"^(この|その|これ|それ)", msg): fails.append((i, "メッセージが他ページを指示語で参照"))
            if re.match(r"^[^。]{1,12}[：:]", msg): fails.append((i, "メッセージに「見出し：」の前置き"))
            if re.search(r"(です|ます)。?$", msg): fails.append((i, "メッセージが「です・ます」調"))
        if body_chars > 200: warns.append((i, f"本体の文字が多い（約{body_chars}字）"))
        notes = s.notes_slide.notes_text_frame.text if s.has_notes_slide else ""
        if i > 1 and not re.search(r"E-?\d|エビデンス|P\d\d", notes): warns.append((i, "ノートにエビデンスID・パターンIDなし"))
    for tag, items in (("FAIL", fails), ("WARN", warns)):
        for p, m in items: print(f"{tag}  p{p:02d}  {m}")
    print(f"--- FAIL {len(fails)} / WARN {len(warns)}")
    return 1 if fails else 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1], "--sample" in sys.argv))