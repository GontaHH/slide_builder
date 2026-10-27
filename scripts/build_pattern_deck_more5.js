// 追加の型 P79〜P80（2026-10-27 追加・第5弾）
// 公開資料 MCK04（マッキンゼー「日本の脱炭素化への道筋」GX推進小委員会 2022年）で繰り返し使われていた2つの見せ方を、
// 本スキルの規定（指定色・紺1点・14pt以上・見出し＋線の器）で作り直したもの。図・文言・数値は写していない。
// 見本の値はすべて架空（みなと市のバス事業）。
module.exports = function ({ pres, frame, txt, line, head, rowRule, icon, C }) {
  const { NAVY, BLACK, G1, G2, G3, WHITE, L, R, W, BODY_Y } = C;
  const num = (o) => Object.assign({ fontFace: 'Arial', fontSize: 12 }, o);   // 図の中の数値は12pt（B-2）
  const bar = (s, x, y, w, h, color) => s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color }, line: { type: 'none' } });

  // ---------- P79 行そろえの小図＋読み取り列 ----------
  {
    const s = frame('P79', '1　現状', '4地区のうち東部だけが利用者と運賃収入の両方で大きく減った。他の3地区は運賃改定で減収を補えており、東部は別の要因で落ち込んだ', null, null,
      '使う場面：同じ2〜3つの指標を、地区・部門などの行ごとに並べて比べ、行ごとの読み取りを右に添えるとき。行の見出し（アイコン＋名前）、指標ごとの小さな棒の列、読み取りの列を、行の区切り線でそろえる。公開資料（MCK04-p10・p11・p12）に多い構成。注目の1行だけ紺。\n差し替え：行（地区）、指標、値、読み取り。\n作法：指標の列ごとに基準線（0）と目盛りの縮尺をそろえ、値は棒の先に直接書く。読み取りは1行につき2行以内で、図の値と食い違うことを書かない。', { source: '注）2020→2025年度の増減率。運賃は2023年4月に全地区で一律10%改定。名称・数値はすべて架空の見本\n出所）みなと市「バス路線別輸送実績」（2026年3月）を基に作成（架空の出所）' });
    const rows = [['東部', 'person-standing', -24, -18, '高齢化で通院の利用が減り、運賃改定でも収入を補えなかった', true],
      ['北部', 'school', -6, 4, '通学の減少を、運賃改定による増収が上回った'],
      ['中央部', 'store', -3, 6, '商業施設の新設で買物の利用が下げ止まった'],
      ['西部', 'house', -8, 1, '人口減少の分だけ減ったが、収入はほぼ横ばい']];
    const lw = 1.85, cw = 1.75, c1 = L + lw, c2 = c1 + cw + 0.2, tx = c2 + cw + 0.35, tw = R - tx, top = BODY_Y, rh = 1.08, y0 = top + 0.62;
    const sc = 0.85 / 24, z1 = c1 + cw * 0.62, z2 = c2 + cw * 0.62;
    head(s, c1, top, cw, '利用者数（%）');
    head(s, c2, top, cw, '運賃収入（%）');
    head(s, tx, top, tw, '読み取り', { key: true });
    rows.forEach(([n, ic, a, b, t, key], i) => {
      const y = y0 + i * rh, cy = y + rh / 2;
      icon(s, ic, L + 0.02, cy - 0.24, 0.48, key ? NAVY : G2);
      txt(s, n, { x: L + 0.6, y, w: lw - 0.65, h: rh, valign: 'middle', bold: true, color: key ? NAVY : BLACK });
      [[z1, a], [z2, b]].forEach(([z, v]) => {
        const w = Math.abs(v) * sc, x = v < 0 ? z - w : z;
        bar(s, x, cy - 0.17, w, 0.34, key ? NAVY : G3);
        const lbl = (v > 0 ? '+' : '−') + Math.abs(v);
        txt(s, lbl, num({ x: v < 0 ? x - 0.65 : x + w + 0.05, y: cy - 0.17, w: 0.6, h: 0.34, valign: 'middle', align: v < 0 ? 'right' : 'left', bold: key, color: key ? NAVY : BLACK }));
      });
      txt(s, t, { x: tx, y, w: tw, h: rh, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      if (i < rows.length - 1) rowRule(s, L, y + rh, W);
    });
    line(s, z1, y0, 0, rows.length * rh, G2, 0.75);
    line(s, z2, y0, 0, rows.length * rh, G2, 0.75);
  }

  // ---------- P80 コストカーブ（幅＝量、高さ＝単価） ----------
  {
    const s = frame('P80', '3　打ち手', '目標の1,800トンは、燃料費の節約で費用を回収できる策だけで届く。それ以上の削減は単価が急に上がり、燃料電池バスは1トン5.8万円かかる', 'CO2削減策のコストカーブ', '（幅＝削減量 t、高さ＝1t当たり費用 千円、2030年度）',
      '使う場面：多数の打ち手を「どれだけ減らせるか（量）」と「1単位当たりいくらか（単価）」の両方で比べ、安い順に積み上げて、目標までに必要な打ち手と費用を示すとき。排出削減のコストカーブ（MACC）として公開資料（MCK04-p7・p15・p16）に多い。単価の安い順に左から並べ、棒の幅を量、高さを単価にする。\n差し替え：打ち手、削減量、単価、目標の位置。\n作法：0の線を必ず引き、0より下（費用が戻る打ち手）と上を分ける。目標の位置は縦の点線で示す。ラベルは棒の上下に引き出し線で付け、主な打ち手だけに絞る。棒の色は打ち手の種類で塗り分けず、注目の打ち手だけ紺。');
    const items = [['エコドライブ研修', 400, -18], ['車庫のLED化', 150, -12], ['ハイブリッドバス', 700, -6], ['屋根置き太陽光', 550, -2], ['EVバス（短距離）', 600, 4], ['再エネ電力の購入', 450, 9], ['EVバス（長距離）', 380, 21], ['燃料電池バス', 260, 58]];
    const gx = L + 0.75, gw = W - 1.0, total = items.reduce((a, it) => a + it[1], 0), xs = gw / total;
    const zeroY = 4.75, ys = 0.034, axTop = BODY_Y + 0.75;
    txt(s, '千円／t', num({ x: L, y: axTop - 0.3, w: 0.9, h: 0.28, fontSize: 11, color: G1 }));
    [60, 40, 20, 0, -20].forEach(v => txt(s, String(v), num({ x: L, y: zeroY - v * ys - 0.14, w: 0.6, h: 0.28, align: 'right', fontSize: 12, color: G1 })));
    const LEVEL = [0, 2, 1, 0, 2, 0, 0], SHIFT = [0, 0, 0, 0, 0, 0, -0.55];
    let x = gx;
    items.forEach(([n, q, c], i) => {
      const w = q * xs, key = i === items.length - 1, h = Math.abs(c) * ys, y = c >= 0 ? zeroY - h : zeroY;
      bar(s, x + 0.01, y, w - 0.02, h, key ? NAVY : (c < 0 ? G2 : G3));
      // ラベル：最後の（最も高い）打ち手は棒の左に、他は引き出し線で上下に段をずらして置く
      if (key) txt(s, n, { x: x - 2.1, y, w: 2.0, h: 0.32, align: 'right', bold: true, color: NAVY });
      else {
        const up = c >= 0, lv = LEVEL[i], ly = up ? y - 0.62 - lv * 0.32 : y + h + 0.1 + lv * 0.32;
        line(s, x + w / 2, up ? ly + 0.3 : y + h, 0, up ? y - ly - 0.3 : ly - y - h, G2, 0.5);
        txt(s, n, { x: x + w / 2 - 1.0 + SHIFT[i], y: ly, w: 2.0, h: 0.3, align: 'center' });
      }
      x += w;
    });
    line(s, gx, zeroY, gw, 0, G2, 1);
    const tgx = gx + 1800 * xs;
    s.addShape(pres.shapes.LINE, { x: tgx, y: axTop, w: 0, h: 6.25 - axTop, line: { color: BLACK, width: 1, dashType: 'dash' } });
    txt(s, '2030年の目標　1,800t', { x: tgx + 0.08, y: axTop - 0.05, w: 2.4, h: 0.3, bold: true });
    line(s, gx, 6.42, gw, 0, G3, 0.75);
    [0, 1000, 2000, 3000].forEach(v => { line(s, gx + v * xs, 6.42, 0, 0.06, G2, 0.75); txt(s, v.toLocaleString(), num({ x: gx + v * xs - 0.4, y: 6.5, w: 0.8, h: 0.26, align: 'center', fontSize: 12, color: G1 })); });
    txt(s, '累計の年間削減量（t-CO2）', { x: R - 3.0, y: 6.08, w: 3.0, h: 0.3, align: 'right', color: G1 });
  }
};
