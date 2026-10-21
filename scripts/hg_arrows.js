// HG_pptFMT の矢印記号（パーツ集の4×4）を自由図形で描く共通部品（2026-10-22）
// 元の書式の写真から形と比率を写し取ったもの。どのスクリプトからも hgArrow(...) で呼ぶ。
//
//   種類 kind        見た目（右向き）                                  tone 'accent'          tone 'gray'
//   'double'         太い「＞」を2つ重ねる（後ろ＝グレー、前＝紺）         グレー＋紺             グレー＋グレー
//   'triStroke'      グレーの塗りの三角に、細い「＞」の線を重ねる           三角グレー＋線は紺     三角グレー＋線グレー
//   'circle'         丸の中に白抜きの細い「＞」                           紺の丸                 グレーの丸
//   'line'           細い「＞」の線1本                                   紺                     淡いグレー
//   'lineDouble'     細い「＞」の線2本                                   紺                     淡いグレー
// dir: 'r'（右向き）／'d'（下向き）。下向きは二重の矢羽（double）と三角＋線（triStroke）だけで使う（丸・線は右向きだけ）。
// x, y は左上、size は右向きのときの高さ（下向きのときは幅）。返り値は描いた幅（下向きは高さ）。
const NAVY = '000F78', GRAY = '7F7F7F', LIGHT = 'CCCCCC', WHITE = 'FFFFFF';

function hgArrow(pres, s, kind, x, y, size, opt = {}) {
  const dir = opt.dir || 'r', tone = opt.tone || 'accent';
  if (dir === 'd' && !['double', 'triStroke'].includes(kind)) throw new Error('下向きは double か triStroke だけ: ' + kind);
  const h = size;
  // 右向きの局所座標（幅 bw × 高さ h）で多角形を定義し、下向きなら縦横を入れ替える
  const put = (pts, ox, oy, bw, bh, style) => {
    const P = dir === 'd' ? pts.map(p => (p.close ? p : { x: p.y, y: p.x })) : pts;
    const [px, py, w, hh] = dir === 'd' ? [x + oy, y + ox, bh, bw] : [x + ox, y + oy, bw, bh];
    s.addShape(pres.shapes.CUSTOM_GEOMETRY, Object.assign({ x: px, y: py, w, h: hh, points: P }, style));
  };
  const solid = color => ({ fill: { color }, line: { type: 'none' } });
  const stroke = (color, width) => ({ fill: { type: 'none' }, line: { color, width, cap: 'round' } });
  // 太い「＞」：幅 0.55h、線の太さは幅の半分
  const thick = (ox, oy, hh, color) => { const w = 0.66 * hh, t = 0.46 * w; put([{ x: 0, y: 0 }, { x: t, y: 0 }, { x: w, y: hh / 2 }, { x: t, y: hh }, { x: 0, y: hh }, { x: w - t, y: hh / 2 }, { close: true }], ox, oy, w, hh, solid(color)); return w; };
  // 塗りの三角：細長く（幅は高さの半分、長辺を長く）
  const tri = (ox, oy, hh, color) => { const w = 0.5 * hh; put([{ x: 0, y: 0 }, { x: w, y: hh / 2 }, { x: 0, y: hh }, { close: true }], ox, oy, w, hh, solid(color)); return w; };
  // 細い「＞」の線：幅 0.45h
  const line = (ox, oy, hh, color, width) => { const w = 0.45 * hh; put([{ x: 0, y: 0 }, { x: w, y: hh / 2 }, { x: 0, y: hh }], ox, oy, w, hh, stroke(color, width)); return w; };

  if (kind === 'double') {
    const bh = 0.9 * h, w = thick(0, (h - bh) / 2, bh, GRAY);   // 後ろ（グレー）は少し小さく
    const fw = thick(0.66 * w, 0, h, tone === 'accent' ? NAVY : GRAY);
    return 0.66 * w + fw;
  }
  if (kind === 'triStroke') {
    const th = 0.88 * h, w = tri(0, (h - th) / 2, th, GRAY);
    const lh = 0.82 * h, lw = line(0.75 * w, (h - lh) / 2, lh, tone === 'accent' ? NAVY : GRAY, Math.max(1.75, h * 6.5));
    return 0.75 * w + lw;
  }
  if (kind === 'circle') return hgCircle(pres, s, x, y, h, opt);
  if (kind === 'line') return line(0, 0, h, tone === 'accent' ? NAVY : LIGHT, Math.max(1.25, h * 4.5));
  if (kind === 'lineDouble') {
    const c = tone === 'accent' ? NAVY : LIGHT, wd = Math.max(1.25, h * 4.5);
    const w = line(0, 0, h, c, wd); line(0.34 * w, 0, h, c, wd);
    return 1.34 * w;
  }
  throw new Error('unknown kind ' + kind);
}

// 丸の矢印は丸（向きに関係なし）＋中の白い線だけ向きが変わるので、別に描く
function hgCircle(pres, s, x, y, d, opt = {}) {
  const dir = opt.dir || 'r', color = (opt.tone || 'accent') === 'accent' ? NAVY : GRAY;
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color }, line: { type: 'none' } });
  const lh = 0.56 * d, lw = 0.42 * lh;
  const pts = [{ x: 0, y: 0 }, { x: lw, y: lh / 2 }, { x: 0, y: lh }];
  const P = dir === 'd' ? pts.map(p => ({ x: p.y, y: p.x })) : pts;
  const [w, h] = dir === 'd' ? [lh, lw] : [lw, lh];
  s.addShape(pres.shapes.CUSTOM_GEOMETRY, { x: x + (d - w) / 2 + (dir === 'd' ? 0 : d * 0.03), y: y + (d - h) / 2 + (dir === 'd' ? d * 0.03 : 0), w, h, points: P, fill: { type: 'none' }, line: { color: WHITE, width: Math.max(1.0, d * 3.6), cap: 'round' } });
  return d;
}

module.exports = { hgArrow, hgCircle };
