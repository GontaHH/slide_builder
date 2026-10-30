// 矢印と印の共通部品（2026-10-30）。公開資料 MCK04 の描き方に合わせたもの：
//   流れの矢印      細い線（1pt）＋小さな塗りの三角の頭（MCK04-p5 の収束する線、p21 の推移）
//   強調の矢印      太い線（4.5pt）＋大きな三角の頭。1枚に1本（MCK04-p21）
//   差の矢印        基準の線から下（上）へ降りる細い矢印＋「−17%」（MCK04-p5・p26）
//   段の区切り      区切り線の上に置く、白い丸に細い「＞」（MCK04-p5 の A→B→アウトプット）
//   比較の印        塗りの丸に白抜きの「↔」（MCK04-p21 の日本型↔欧米型）
//   記号の丸        白い丸に文字（Ⓐ Ⓑ の代わり、MCK04-p5）、塗りの丸に白抜きの番号（MCK04-p21・p26）
//   因果の三角      グレーの塗りの細い三角（左右の間の強い因果）
// 色の決まり：既定は文字色（3F3F3F）とグレー。紺（opt.key）は、その1枚で本当に強調する1つにだけ使う。
const NAVY = '000F78', INK = '3F3F3F', GRAY = '7F7F7F', LIGHT = 'CCCCCC', WHITE = 'FFFFFF';

const solid = (color) => ({ fill: { color }, line: { type: 'none' } });

// 点の列（インチの絶対座標）から自由図形を置く
function poly(pres, s, pts, style) {
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const x = Math.min(...xs), y = Math.min(...ys);
  const w = Math.max(Math.max(...xs) - x, 0.01), h = Math.max(Math.max(...ys) - y, 0.01);
  s.addShape(pres.shapes.CUSTOM_GEOMETRY, Object.assign({ x, y, w, h, points: pts.map(([px, py]) => ({ x: px - x, y: py - y })).concat([{ close: true }]) }, style));
}
// 2点を結ぶ線（斜めも可）
function seg(pres, s, x1, y1, x2, y2, color, width, dash) {
  s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), flipH: x2 < x1, flipV: y2 < y1,
    line: Object.assign({ color, width }, dash ? { dashType: 'dash' } : {}) });
}
// 三角の頭：先端 (tx, ty)、向き（ラジアン）、長さ len、幅 wid
function head(pres, s, tx, ty, ang, len, wid, color) {
  const bx = tx - len * Math.cos(ang), by = ty - len * Math.sin(ang), nx = -Math.sin(ang) * wid / 2, ny = Math.cos(ang) * wid / 2;
  poly(pres, s, [[tx, ty], [bx + nx, by + ny], [bx - nx, by - ny]], solid(color));
}

// 流れの矢印。opt: key（紺）, width, dash, both（両向き）, color
function flow(pres, s, x1, y1, x2, y2, opt = {}) {
  const color = opt.color || (opt.key ? NAVY : GRAY), width = opt.width || 1;
  const ang = Math.atan2(y2 - y1, x2 - x1), len = opt.len || 0.11 + width * 0.01, wid = opt.wid || 0.09 + width * 0.01;
  const sx = opt.both ? x1 + len * Math.cos(ang) : x1, sy = opt.both ? y1 + len * Math.sin(ang) : y1;
  seg(pres, s, sx, sy, x2 - len * Math.cos(ang) * 0.9, y2 - len * Math.sin(ang) * 0.9, color, width, opt.dash);
  head(pres, s, x2, y2, ang, len, wid, color);
  if (opt.both) head(pres, s, x1, y1, ang + Math.PI, len, wid, color);
}

// 強調の矢印（太い線＋大きな頭）。1枚に1本。opt.key で紺、既定は文字色
function bold(pres, s, x1, y1, x2, y2, opt = {}) {
  const color = opt.color || (opt.key ? NAVY : INK), width = opt.width || 4.5;
  const ang = Math.atan2(y2 - y1, x2 - x1), len = 0.24, wid = 0.24;
  seg(pres, s, x1, y1, x2 - len * Math.cos(ang) * 0.85, y2 - len * Math.sin(ang) * 0.85, color, width);
  head(pres, s, x2, y2, ang, len, wid, color);
}

// 差の矢印：基準の高さ y0 から y1 へ、x の位置で縦に降りる。label を右に（太字）
// opt.from：基準の線を左へ伸ばす始点の x（棒の上端から引く細線）
function drop(pres, s, x, y0, y1, label, opt = {}) {
  const color = opt.key ? NAVY : INK;
  if (opt.from !== undefined) seg(pres, s, opt.from, y0, x + 0.12, y0, color, 0.75);
  seg(pres, s, x - 0.1, y1, x + 0.1, y1, color, 0.75);
  flow(pres, s, x, y0, x, y1, { color, width: 1 });
  if (label) s.addText(label, { x: x + 0.15, y: Math.min(y0, y1) + Math.abs(y1 - y0) / 2 - 0.17, w: 1.0, h: 0.34, fontFace: 'Arial', fontSize: 12, bold: true, color, margin: 0, valign: 'middle' });
}

// 段の区切り：中心 (cx, cy)、直径 d。白い丸に細い「＞」（下向きは dir:'d'）
function step(pres, s, cx, cy, d, opt = {}) {
  const color = opt.key ? NAVY : INK;
  s.addShape(pres.shapes.OVAL, { x: cx - d / 2, y: cy - d / 2, w: d, h: d, fill: { color: WHITE }, line: { color, width: 0.75 } });
  const a = d * 0.16, b = d * 0.26;
  const P = opt.dir === 'd' ? [[cx - b, cy - a], [cx, cy + a], [cx + b, cy - a]] : [[cx - a, cy - b], [cx + a, cy], [cx - a, cy + b]];
  seg(pres, s, P[0][0], P[0][1], P[1][0], P[1][1], color, 1);
  seg(pres, s, P[1][0], P[1][1], P[2][0], P[2][1], color, 1);
}

// 比較の印：塗りの丸に白抜きの「↔」
function compare(pres, s, cx, cy, d, opt = {}) {
  const color = opt.key ? NAVY : INK;
  s.addShape(pres.shapes.OVAL, Object.assign({ x: cx - d / 2, y: cy - d / 2, w: d, h: d }, solid(color)));
  flow(pres, s, cx - d * 0.3, cy, cx + d * 0.3, cy, { color: WHITE, width: 1, both: true, len: d * 0.17, wid: d * 0.22 });
}

// 記号の丸：白い丸に文字（outline）か、塗りの丸に白抜きの文字（fill）
function badge(pres, s, cx, cy, d, t, opt = {}) {
  const color = opt.key ? NAVY : INK, filled = opt.fill !== false && !opt.outline;
  s.addShape(pres.shapes.OVAL, { x: cx - d / 2, y: cy - d / 2, w: d, h: d, fill: { color: filled ? color : WHITE }, line: filled ? { type: 'none' } : { color, width: 0.75 } });
  s.addText(String(t), { x: cx - d / 2, y: cy - d / 2, w: d, h: d, fontFace: 'Arial', fontSize: opt.fontSize || 12, bold: true, color: filled ? WHITE : color, align: 'center', valign: 'middle', margin: 0 });
}

// 因果の三角：グレーの塗りの細い三角（左上 x, y、高さ h）。opt.dir:'d' で下向き
function cause(pres, s, x, y, h, opt = {}) {
  const color = opt.key ? NAVY : LIGHT, w = h * 0.55;
  poly(pres, s, opt.dir === 'd' ? [[x, y], [x + h, y], [x + h / 2, y + w]] : [[x, y], [x + w, y + h / 2], [x, y + h]], solid(color));
  return opt.dir === 'd' ? w : w;
}

// 合流：左の複数の点 starts（[[x, y], ...]）から1点 (mx, my) に集め、(x2, my) へ矢印
function merge(pres, s, starts, mx, my, x2, opt = {}) {
  const color = opt.key ? NAVY : GRAY;
  starts.forEach(([x, y]) => seg(pres, s, x, y, mx, my, color, 1));
  flow(pres, s, mx, my, x2, my, { color });
}

module.exports = { flow, bold, drop, step, compare, badge, cause, merge, seg, poly, NAVY, INK, GRAY, LIGHT };
