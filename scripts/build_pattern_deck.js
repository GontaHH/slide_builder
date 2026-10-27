// パターン見本デッキ生成（consulting-slide-builder 規定準拠）
// 2026-10-22：見本の値を【】の空欄から架空の値に置き換え、器を「見出し＋線」に統一（rules/slide-rules.md H 章）
const pptxgen = require('pptxgenjs');
const path = require('path');
const OUT = process.argv[2] || 'pattern-deck.pptx';
const { iconQueue } = require('./icons.js');

const pres = new pptxgen();
pres.defineLayout({ name: 'A4_NRI', width: 10.833, height: 7.5 });
pres.layout = 'A4_NRI';
pres.title = 'パターン見本デッキ';
pres.theme = { headFontFace: 'Yu Gothic UI', bodyFontFace: 'Yu Gothic UI' };
const ICON = iconQueue(pres);

const F = 'Yu Gothic UI';
// 指定色（rules/slide-rules.md B-3）。BLACK・G1 は文字色（63 63 63）、G2＝Gray2、G3・G4＝Gray1、G5＝Blue4、BLUE5＝注目の面
const NAVY = '000F78', BLACK = '3F3F3F', G1 = '3F3F3F', G2 = '7F7F7F', G3 = 'CCCCCC', G4 = 'CCCCCC', G5 = 'E0EEF8', WHITE = 'FFFFFF', BLUE5 = 'C1DDF1';
// ガイド線（rules/slide-rules.md B-1）。PowerPoint の表示と同じく、スライドの中心からの距離（cm）で持つ
// ①スライドタイトルの上端 横+8.80 ②ボディの上端 横+5.40 ③左端 縦−13.20 ④右端 縦+13.20 ⑤中心 縦0
const SLIDE_W = 10.833, SLIDE_H = 7.5, CM = 1 / 2.54;
const GUIDE = { titleTop: 8.80, bodyTop: 5.40, left: -13.20, right: 13.20, center: 0 };
const L = SLIDE_W / 2 + GUIDE.left * CM, R = SLIDE_W / 2 + GUIDE.right * CM, W = R - L;   // ③〜④（左右の余白0.56cm）
const TOP = SLIDE_H / 2 - GUIDE.titleTop * CM;                                            // ①（上から0.725cm）
const BODY_Y = SLIDE_H / 2 - GUIDE.bodyTop * CM, BODY_B = 6.75;                         // ②（上から4.125cm）

// 線の階層（rules H-2）：上位の線ほど濃く太く。スライドタイトルの線 ≧ 見出しの線 ≧ 行の線
const RULE = {
  title: { color: BLACK, width: 1.25 },   // スライドタイトル（何のデータか）の下：全幅
  head: { color: G2, width: 1.0 },        // 列・欄の見出しの下
  key: { color: BLACK, width: 1.25 },     // 結論側の見出しの下：太さで区別し、紺は使わない（紺は本体の1か所だけ、G-6）
  row: { color: G3, width: 0.75 },        // 行の区切り（最終行の下には引かない）
};

let pageNo = 0;
let REFS = {};
try { REFS = require(path.join(__dirname, '..', 'patterns', 'refs.json')); } catch (e) { REFS = {}; }
function txt(s, text, o) {
  s.addText(text, Object.assign({ isTextBox: true, fontFace: F, fontSize: 14, color: BLACK, margin: 0, valign: 'top' }, o));
}
function line(s, x, y, w, h, color, width, extra) {
  s.addShape(pres.shapes.LINE, Object.assign({ x, y, w, h, line: { color: color || G3, width: width || 0.75 } }, extra || {}));
}
function rect(s, x, y, w, h, o) {
  s.addShape(pres.shapes.RECTANGLE, Object.assign({ x, y, w, h, fill: { color: WHITE }, line: { color: G3, width: 0.75 } }, o));
}
// 欄の見出し：14pt太字＋下に見出しの線（key＝結論側は文字色の太い線。紺にしない、G-6）。箱で囲まず、見出しと線で器を作る（H-1）
function head(s, x, y, w, t, o = {}) {
  txt(s, t, Object.assign({ x, y, w, h: 0.32, bold: true, color: BLACK, align: o.align || 'left', valign: 'bottom' }, o.text || {}));
  const r = o.key ? RULE.key : RULE.head;
  line(s, x, y + 0.38, w, 0, r.color, r.width);
}
function rowRule(s, x, y, w) { line(s, x, y, w, 0, RULE.row.color, RULE.row.width); }
// 箇条書き：記号は本文に打たず、段落の書式（buChar）で付ける（H-6）
function bullets(s, items, o) {
  const runs = items.map(t => {
    const it = typeof t === 'string' ? { text: t } : t;
    return { text: it.text, options: Object.assign({ bullet: { code: '2022', indent: 14 }, paraSpaceAfter: 4 }, it.options || {}) };
  });
  s.addText(runs, Object.assign({ isTextBox: true, fontFace: F, fontSize: 14, color: BLACK, margin: 0, valign: 'top' }, o));
}

// 本文スライドの共通フレーム
function frame(id, chapter, message, slideTitle, unit, notes, opts = {}) {
  const s = pres.addSlide();
  pageNo++;
  // メッセージブロック：紺の縦バー＋章名＋2行メッセージ
  s.addShape(pres.shapes.RECTANGLE, { x: L, y: TOP, w: 0.055, h: 1.02, fill: { color: NAVY }, line: { type: 'none' } });
  txt(s, chapter, { x: L + 0.16, y: TOP, w: W - 0.16, h: 0.24, fontSize: 11, color: G1 });
  txt(s, message, { x: L + 0.16, y: TOP + 0.26, w: W - 0.16, h: 0.76, fontSize: 20, bold: false, color: NAVY, valign: 'middle', lineSpacingMultiple: 1.0 });   // メッセージは太字にしない（B-2）
  line(s, L, TOP + 1.17, W, 0, G3, 0.75);
  // スライドタイトル（14pt太字＋単位・期間11pt、下に全幅のタイトルの線）
  if (slideTitle) {
    const t = [{ text: slideTitle, options: { bold: true, fontSize: 14 } }];
    if (unit) t.push({ text: '　' + unit, options: { fontSize: 11, color: G1 } });
    txt(s, t, { x: L, y: BODY_Y, w: opts.titleW || W - 1.3, h: 0.3, valign: 'bottom' });
    line(s, L, BODY_Y + 0.36, opts.titleW || W, 0, RULE.title.color, RULE.title.width);
  }
  // 見本ステッカー（右上。本番では「試算」「暫定」等に差し替えるか削除）
  txt(s, opts.sticker || '見本', { x: R - (opts.sticker ? 1.05 : 0.75), y: BODY_Y + 0.02, w: opts.sticker ? 1.05 : 0.75, h: 0.26, fontSize: 11, color: G1, align: 'center', valign: 'middle', line: { color: G3, width: 0.75 } });
  // 注記・出所・ページ番号
  txt(s, opts.source || '注）名称・数値はすべて架空の見本。実際の資料ではエビデンスExcelの値に差し替える\n出所）みなと市「バス路線別輸送実績」（2026年3月）を基に作成（架空の出所）', { x: L, y: 6.86, w: 8.6, h: 0.42, fontSize: 9, color: G1 });
  txt(s, String(pageNo), { x: R - 0.5, y: 7.08, w: 0.5, h: 0.2, fontSize: 9, color: G1, align: 'right' });
  s.addNotes(opts.rawNotes ? notes : `パターンID：${id}\n${notes}\n参考ページID：${(REFS[id] || []).join('、') || '未登録（slide-reference-library で収集後に追記）'}（画像はPCの参照ライブラリ/pages/）`);
  return s;
}

const chartBase = {
  catAxisLabelFontFace: 'Arial', valAxisLabelFontFace: 'Arial', dataLabelFontFace: 'Arial',
  catAxisLabelFontSize: 12, dataLabelFontSize: 12,   // 図の文字は12pt（B-2）
  barGapWidthPct: 40,   // 棒の隙間は棒の幅の0.4倍（docs/reference-measurements.md）
  catAxisLabelColor: BLACK, dataLabelColor: BLACK,
  valAxisHidden: true, valAxisLabelColor: BLACK, valAxisLineColor: G3, valGridLine: { style: 'none' }, catGridLine: { style: 'none' },
  catAxisLineShow: true, catAxisLineColor: G3, showLegend: false,
};
const num = (o) => Object.assign({ fontFace: 'Arial', fontSize: 12 }, o);   // 図の中の数値は12pt（B-2）
const tri = (s, x, y, w, h, color) => require('./hg_arrows.js').hgArrow(pres, s, 'triStroke', x, y, Math.min(w, h) * 1.25, { tone: color === NAVY ? 'accent' : 'gray' });

// ---------- 表紙 ----------
{
  const s = pres.addSlide();
  pageNo++;
  txt(s, 'パターン見本デッキ', { x: 0.8, y: 2.4, w: 9, h: 0.8, fontSize: 32, bold: true, color: NAVY });
  txt(s, 'consulting-slide-builder 用　80の型（P01〜P80）＋記号集・アイコン集・テンプレート集＋通しの完成例', { x: 0.8, y: 3.25, w: 9.2, h: 0.55, fontSize: 16, color: BLACK });
  txt(s, '使い方：伝えたいことを先に決め、合う型を選んで中身を差し替える。各スライドのノートに、パターンID・使う場面・差し替える箇所を記載。\n名称・数値はすべて架空の見本（架空の「みなと市」のバス事業など）。成果物に残さないこと。', { x: 0.8, y: 4.1, w: 9.2, h: 0.9, fontSize: 14, color: G1 });
  line(s, 0.8, 3.85, 9.2, 0, G3, 0.75);
  s.addNotes('表紙。案件で使う際は、このファイルを案件名で別名保存し、最後に見本スライドを削除する。');
}

// ---------- P01 エグゼクティブサマリー ----------
{
  const s = frame('P01', '00　エグゼクティブサマリー', 'みなと市のバス事業は利用減で年4.2億円の赤字にある。支線の予約型交通への転換と幹線の増便を組み合わせ、2030年度までに赤字を半減すべきである', null, null,
    '使う場面：デッキ冒頭。各章のメッセージラインを太字1行＋根拠の数字1行に要約し、最後の提言だけを紺にする。行は本文の章と1対1に対応させる。\n差し替え：章ごとの結論文・根拠の数字・提言。\n作法：提言は塗りの箱で囲まず、紺の線と紺の文字で立てる（塗りに枠線を重ねない）。');
  const rows = [
    ['現状', '利用者は10年で30%減り、赤字は年4.2億円に拡大した', '根拠：年間利用者数 412万人→290万人、赤字 1.8億円→4.2億円（2015→2025年度）'],
    ['課題', '赤字の7割は、利用の少ない支線12路線で生じている', '根拠：路線別収支の分解で、支線の赤字は2.9億円'],
    ['打ち手', '支線の予約型交通への転換が、効果と実現性の両面で最も優れる', '根拠：4つの選択肢を4基準で評価し、4基準中3基準で最上位'],
  ];
  const top = 1.66, rh = 1.27;
  rows.forEach((r, i) => {
    const y = top + i * rh;
    txt(s, r[0], { x: L, y: y + 0.06, w: 1.1, h: 0.32, bold: true, color: G1 });
    txt(s, r[1], { x: L + 1.3, y: y + 0.06, w: W - 1.3, h: 0.34, bold: true });
    txt(s, r[2], { x: L + 1.3, y: y + 0.46, w: W - 1.3, h: 0.34, color: G1 });
    if (i < rows.length - 1) rowRule(s, L, y + rh - 0.12, W);
  });
  const py = top + 3 * rh + 0.05;
  line(s, L, py, W, 0, NAVY, 1.5);
  txt(s, '提言', { x: L, y: py + 0.18, w: 1.1, h: 0.32, bold: true, color: NAVY });
  txt(s, '支線12路線を2027年度から順次予約型交通に転換し、浮いた運転士で幹線を1時間3本に増やす。初年度に推進室を設け、収支と利用者数を四半期ごとに管理する', { x: L + 1.3, y: py + 0.18, w: W - 1.3, h: 1.0, bold: true, color: NAVY });
}

// ---------- P02 目次・章扉 ----------
{
  const s = frame('P02', '目次', '本資料はバス事業の赤字にどう対処するかに答えるため、現状・課題・打ち手・実行計画の順に示す。本章では赤字が膨らむ要因を明らかにする', null, null,
    '使う場面：目次、各章の扉。当該章だけ紺・太字、他はグレー。目次は1列で並べる。\n差し替え：章名。');
  const items = ['現状：バスの利用と収支の推移', '課題：赤字が膨らむ要因', '打ち手：選択肢の評価', '実行計画：転換の手順と体制', '参考資料'];
  let y = 1.85;
  items.forEach((t, i) => {
    const cur = i === 1;
    txt(s, String(i + 1).padStart(2, '0'), { x: L + 0.3, y, w: 0.7, h: 0.5, fontSize: 20, bold: true, color: cur ? NAVY : G3, fontFace: 'Arial', valign: 'middle' });
    txt(s, t, { x: L + 1.2, y, w: 8, h: 0.5, fontSize: 16, bold: cur, color: cur ? NAVY : G2, valign: 'middle' });
    if (i < items.length - 1) rowRule(s, L + 0.3, y + 0.7, W - 0.6);
    y += 0.9;
  });
}

// ---------- P03 縦棒の時系列＋CAGR ----------
{
  const s = frame('P03', '1　現状', '予約型交通の利用者数は運行区域を広げた2019年度以降に年6.7%で増え、6.5万人に達した。支線の転換先として需要を受け止められる水準にある', '予約型交通の年間利用者数の推移', '（万人、2015–2025年度）',
    '使う場面：時系列の増減を示す。期間が少ない（〜10本）場合。言いたい期間の棒だけ紺、成長率を紺の注釈で1つだけ。\n差し替え：系列データ（グラフ用シート）、成長率の値と範囲、見出し。');
  const labels = ['2015', '2017', '2019', '2021', '2023', '2025'];
  s.addChart(pres.charts.BAR, [
    { name: '区域拡大前', labels, values: [3.8, 4.1, 4.4, 0, 0, 0] },
    { name: '区域拡大後', labels, values: [0, 0, 0, 5.0, 5.7, 6.5] },
  ], Object.assign({}, chartBase, { x: L, y: 2.55, w: W, h: 4.15, barDir: 'col', barGrouping: 'stacked', barGapWidthPct: 40, chartColors: [G3, NAVY], showValue: true, dataLabelPosition: 'inEnd', dataLabelColor: WHITE, dataLabelFormatCode: '0.0;;' }));
  s.addShape(pres.shapes.LINE, { x: 5.6, y: 2.5, w: 3.8, h: -0.0, line: { color: NAVY, width: 1.25, endArrowType: 'triangle' } });
  txt(s, '年平均 ＋6.7%（2019→2025年度）', { x: 5.3, y: 2.08, w: 4.4, h: 0.32, fontSize: 14, bold: true, color: NAVY, align: 'center' });
}

// ---------- P04 降順の横棒比較 ----------
{
  const s = frame('P04', '1　現状', 'みなと市の住民1人当たりのバス利用は年14回で、類似8市の中で5位にとどまる。上位3市との差は運行本数で説明でき、増便の余地が大きい', '住民1人当たりの年間バス利用回数', '（回、類似8市、2025年度）',
    '使う場面：大小・順位の比較。必ず降順。注目対象だけ紺、他はグレー。\n差し替え：項目名と値（降順に並べ替える）、注目対象の位置。');
  const labels = ['A市', 'B市', 'C市', 'D市', 'みなと市', 'F市', 'G市', 'H市'].reverse();
  const v = [26, 23, 21, 17, 14, 12, 10, 8].reverse();
  s.addChart(pres.charts.BAR, [
    { name: 'その他', labels, values: v.map((x, i) => labels[i] === 'みなと市' ? 0 : x) },
    { name: '対象', labels, values: v.map((x, i) => labels[i] === 'みなと市' ? x : 0) },
  ], Object.assign({}, chartBase, { x: L, y: 2.05, w: 7.2, h: 4.65, barDir: 'bar', barGrouping: 'stacked', barGapWidthPct: 40, chartColors: [G3, NAVY], showValue: true, dataLabelPosition: 'inEnd', dataLabelColor: WHITE, dataLabelFormatCode: '#,##0;;' }));
  txt(s, '上位3市の平均より\n9回少ない（23回→14回）', { x: 7.9, y: 4.6, w: 2.6, h: 0.7, fontSize: 14, bold: true, color: NAVY });
}

// ---------- P05 100%積上げ ----------
{
  const s = frame('P05', '1　現状', 'バス利用者に占める通院目的の割合は、10年で15%から32%へ17ポイント上がった。今後の路線は、病院への接続を軸に組み立てる必要がある', '目的別のバス利用者の構成比', '（%、2015・2020・2025年度）',
    '使う場面：構成の変化。系列は5つ以内、グレーの濃淡で塗り分け、注目の1系列だけ紺。系列名は凡例でなく右端に直接書く。\n差し替え：系列名・値、注目系列。');
  const labels = ['2015', '2020', '2025'];
  s.addChart(pres.charts.BAR, [
    { name: '通学', labels, values: [40, 35, 28] },
    { name: '買物', labels, values: [35, 33, 30] },
    { name: '通院', labels, values: [15, 22, 32] },
    { name: 'その他', labels, values: [10, 10, 10] },
  ], Object.assign({}, chartBase, { x: L, y: 2.05, w: 7.6, h: 4.65, barDir: 'col', barGrouping: 'percentStacked', barGapWidthPct: 40, chartColors: ['7F7F7F', 'CCCCCC', NAVY, 'E0EEF8'], showValue: true, dataLabelPosition: 'ctr', dataLabelColor: WHITE }));
  const names = [['その他', 2.55], ['通院', 3.35], ['買物', 4.45], ['通学', 5.6]];
  names.forEach(([n, y]) => txt(s, n, { x: 8.05, y, w: 1.0, h: 0.3, fontSize: 14, color: n === '通院' ? NAVY : BLACK, bold: n === '通院' }));
  txt(s, '＋17pt', num({ x: 8.95, y: 3.35, w: 1.5, h: 0.3, fontSize: 14, bold: true, color: NAVY }));
}

// ---------- P06 ウォーターフォール（図形で作図） ----------
{
  const s = frame('P06', '2　課題', '年間利用者数は10年で412万人から290万人に減り、減少の約8割は人口減少による。人口が減り続ける以上、路線網の維持だけを目標にはできない', '年間利用者数の増減要因', '（万人、2015→2025年度）',
    '使う場面：増減の要因分解。始点・終点はGray2、要因はGray1、最大要因だけ紺。増減は「＋」「−」で示し、赤緑で塗り分けない。棒は図形で作図（編集可能）。要因の下に「全体の増減に占める割合」を丸の印で並べると、どの要因が効いているかが数字で読める（MCK04-p13）。割合の合計は100%になるよう検算する。\n差し替え：要因名・値・割合。棒の高さは値に比例させて調整する。');
  const items = [['2015年度', 412, 'total'], ['人口減少', -96, 'key'], ['通学の\n減少', -31, 'n'], ['通院の\n増加', 18, 'n'], ['その他', -13, 'n'], ['2025年度', 290, 'total']];
  const x0 = L + 0.3, bw = 1.05, gap = 0.55, base = 5.45, scale = 0.0075, net = items[items.length - 1][1] - items[0][1];
  let level = 0;
  items.forEach((it, i) => {
    const [name, v, kind] = it;
    const x = x0 + i * (bw + gap);
    let top, h;
    if (kind === 'total') { top = base - v * scale; h = v * scale; level = v; }
    else { const nl = level + v; top = base - Math.max(level, nl) * scale; h = Math.abs(v) * scale; level = nl; }
    const col = kind === 'total' ? G2 : kind === 'key' ? NAVY : G3;
    s.addShape(pres.shapes.RECTANGLE, { x, y: top, w: bw, h, fill: { color: col }, line: { type: 'none' } });
    const lbl = kind === 'total' ? String(v) : (v > 0 ? '＋' + v : '−' + Math.abs(v));
    txt(s, lbl, num({ x, y: top - 0.32, w: bw, h: 0.28, fontSize: 14, bold: kind === 'key', color: kind === 'key' ? NAVY : BLACK, align: 'center' }));
    txt(s, name, { x: x - 0.1, y: base + 0.08, w: bw + 0.2, h: 0.6, fontSize: 14, align: 'center' });
    if (i < items.length - 1) line(s, x + bw, base - level * scale, gap, 0, G3, 0.5, { line: { color: G3, width: 0.5, dashType: 'dash' } });
    if (kind !== 'total') {
      const share = Math.round(100 * v / net), bx = x + bw / 2 - 0.4, by = base + 0.75;
      s.addShape(pres.shapes.OVAL, { x: bx, y: by, w: 0.8, h: 0.34, fill: { color: kind === 'key' ? NAVY : G2 }, line: { type: 'none' } });
      txt(s, (share < 0 ? '−' : '') + Math.abs(share) + '%', num({ x: bx, y: by, w: 0.8, h: 0.34, fontSize: 14, bold: true, color: WHITE, align: 'center', valign: 'middle' }));
    }
  });
  txt(s, '減少に占める割合', { x: x0 - 0.1, y: base + 0.75, w: 1.6, h: 0.34, fontSize: 14, bold: true, valign: 'middle' });
  line(s, L, base, W, 0, G3, 0.75);
}

// ---------- P07 マリメッコ（図形で作図） ----------
{
  const s = frame('P07', '1　現状', '沿線の移動の45%を占める通院で、みなとバスの分担率は15%にとどまる。最も大きな移動目的での存在感の低さが、利用減の根本にある', '目的別の移動回数と交通手段の分担率', '（幅＝移動回数の構成比、高さ＝分担率、2025年度）',
    '使う場面：規模と構成の両方が議論に必要なときだけ使う。片方だけなら棒グラフで足りる。\n差し替え：区分の幅（規模比）と分担率。対象の区画だけ紺。');
  const segs = [['通院', 0.45, [0.35, 0.25, 0.15, 0.25]], ['通学', 0.3, [0.2, 0.3, 0.3, 0.2]], ['買物', 0.25, [0.4, 0.2, 0.25, 0.15]]];
  const X = L + 1.3, Y = 2.15, TW = W - 2.8, TH = 4.0;
  let x = X;
  const cols = [G2, G3, NAVY, G5];
  segs.forEach(([n, wr, shares]) => {
    const w = TW * wr; let y = Y;
    shares.forEach((sh, j) => {
      const h = TH * sh;
      s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: cols[j] }, line: { color: WHITE, width: 1.5 } });
      txt(s, Math.round(sh * 100) + '%', num({ x, y, w, h, fontSize: 14, align: 'center', valign: 'middle', color: j === 2 || j === 0 ? WHITE : BLACK, bold: j === 2 }));
      y += h;
    });
    txt(s, n + '（' + Math.round(wr * 100) + '%）', { x, y: Y + TH + 0.08, w, h: 0.32, fontSize: 14, align: 'center' });
    x += w;
  });
  ['自家用車', '家族の送迎', 'みなとバス', 'タクシー'].forEach((n, j) => {
    const yy = Y + TH * [0.17, 0.47, 0.67, 0.88][j] - 0.15;
    txt(s, n, { x: X + TW + 0.12, y: yy, w: 1.35, h: 0.3, fontSize: 14, color: j === 2 ? NAVY : BLACK, bold: j === 2 });
  });
}

// ---------- P08 散布図 ----------
{
  const s = frame('P08', '2　課題', '運行本数と1人当たりの利用回数には強い正の相関があり、みなと市は同規模の市より利用が少ない。本数を増やせば、利用も底上げできる', '人口当たりの運行本数と1人当たりの年間利用回数', '（n＝11市、2025年度）',
    '使う場面：2変数の関係。注目点だけ紺、他はグレー。軸の名前と単位を必ず書く。\n差し替え：X・Yの値、注目点。');
  const xs = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  const ys = [8, 12, 11, 16, 17, 21, 19, 25, 24, 28];
  s.addChart(pres.charts.SCATTER, [
    { name: 'X', values: xs.concat([32]) },
    { name: '類似市', values: ys.concat([null]) },
    { name: 'みなと市', values: xs.map(() => null).concat([14]) },
  ], Object.assign({}, chartBase, { x: L, y: 2.05, w: 7.6, h: 4.6, valAxisHidden: false, valAxisLabelFontSize: 12, valAxisLabelColor: G1, valAxisLineShow: false, valAxisMinVal: 0, valAxisMaxVal: 30, chartColors: [G3, NAVY], lineSize: 0, lineDataSymbolSize: 11, catAxisLabelColor: G1 }));
  txt(s, 'みなと市\n同規模の市より\n年5回少ない', { x: 8.0, y: 3.55, w: 2.5, h: 1.0, fontSize: 14, bold: true, color: NAVY });
  txt(s, '縦軸：1人当たり年間利用回数（回）\n横軸：人口千人当たりの1日運行本数（本）', { x: 8.0, y: 5.55, w: 2.5, h: 0.9, fontSize: 11, color: G1 });
}

// ---------- P09 折れ線（複数系列） ----------
{
  const s = frame('P09', '1　現状', 'みなと市のバス利用は2015年以降一貫して減り、2025年には全国平均を26ポイント下回った。他市並みに戻すには、路線網の構造から見直す必要がある', '1人当たりバス利用回数の推移', '（2015年＝100、2015–2025年）',
    '使う場面：長い期間の推移、複数系列（3本まで）。対象だけ紺、他はグレー。凡例を使わず線の端に系列名を直接書く。\n差し替え：系列データ、系列名。');
  const labels = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];
  s.addChart(pres.charts.LINE, [
    { name: '全国', labels, values: [100, 101, 102, 102, 103, 99, 100, 101, 102, 103, 104] },
    { name: '類似市', labels, values: [100, 99, 99, 98, 98, 95, 95, 96, 96, 96, 97] },
    { name: 'みなと市', labels, values: [100, 97, 95, 92, 90, 85, 84, 83, 81, 80, 78] },
  ], Object.assign({}, chartBase, { x: L, y: 2.05, w: 8.2, h: 4.6, chartColors: [G3, G2, NAVY], lineSize: 2, lineDataSymbol: 'none', valAxisHidden: false, valAxisLabelFontSize: 12, valAxisLabelColor: G1, valAxisLineShow: false, valAxisMinVal: 70, valAxisMaxVal: 110 }));
  txt(s, '全国', { x: 8.6, y: 2.55, w: 1.8, h: 0.3, fontSize: 14, color: G1 });
  txt(s, '類似市', { x: 8.6, y: 3.25, w: 1.8, h: 0.3, fontSize: 14, color: G1 });
  txt(s, 'みなと市\n全国との差 −26pt', { x: 8.6, y: 4.55, w: 1.9, h: 0.65, fontSize: 14, bold: true, color: NAVY });
}

// ---------- P10 チャート＋キーメッセージ欄 ----------
{
  const s = frame('P10', '1　現状', '幹線の運賃収入の伸びは2021年度以降に年0.8%まで鈍った。鈍化の原因は運転士の不足と家族の送迎の増加であり、いずれも市単独では解消できない', '幹線の運賃収入の推移', '（億円、2015–2025年度）',
    '使う場面：チャートから読み取るべき点が2〜3ある場合。チャート上の番号とキーメッセージ欄の番号を同じ図形のバッジで対応させる。\n差し替え：チャートデータ、読み取り3点。');
  const labels = ['2015', '2017', '2019', '2021', '2023', '2025'];
  s.addChart(pres.charts.BAR, [{ name: '値', labels, values: [5.0, 5.6, 6.1, 6.3, 6.4, 6.5] }],
    Object.assign({}, chartBase, { x: L, y: 2.5, w: 6.0, h: 4.2, barDir: 'col', barGapWidthPct: 40, chartColors: [G3], showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0.0' }));
  const mk = (n, x, y, navy) => { s.addShape(pres.shapes.OVAL, { x, y, w: 0.32, h: 0.32, fill: { color: navy ? NAVY : WHITE }, line: { color: NAVY, width: 1 } }); txt(s, String(n), num({ x, y, w: 0.32, h: 0.32, fontSize: 12, bold: true, color: navy ? WHITE : NAVY, align: 'center', valign: 'middle' })); };
  mk(1, 3.58, 2.1, true); mk(2, 4.53, 2.1, false); mk(3, 5.47, 2.1, false);
  const X = 6.75; let y = 2.15;
  [['伸び率の鈍化', '2021年度以降の伸びは年0.8%（それまでは年5.1%）'], ['運転士の不足', '必要数の15%が欠員で、増便ができない'], ['家族の送迎の増加', '通院の移動の25%を家族の送迎が担う']].forEach((k, i) => {
    mk(i + 1, X, y, i === 0);
    txt(s, k[0], { x: X + 0.45, y: y - 0.02, w: 3.3, h: 0.32, fontSize: 14, bold: true, color: i === 0 ? NAVY : BLACK });
    txt(s, k[1], { x: X + 0.45, y: y + 0.36, w: 3.3, h: 0.62, fontSize: 14 });
    if (i < 2) rowRule(s, X, y + 1.2, R - X);
    y += 1.45;
  });
}

// ---------- P11 左右比較（2エクジビット） ----------
{
  const s = frame('P11', '3　打ち手', '市とバス会社が予約受付や運行管理を別々に担い、重複する費用が年6,800万円生じている。窓口と管理を一元化すれば、重複の8割を削減できる', null, null,
    '使う場面：Before/After、現状とあるべき姿、定量と定性など2つのエクジビットを並べる場合。必ず左右に並べ、上下に積まない。左右の見出しの線の高さと、行の高さ・上端をそろえる。結論側（右）だけ紺。\n差し替え：左右の見出しと中身。\n作法：項目を箱で囲まない。行の区切りは細い線、左右の対応は同じ行の高さで示す（H-1）。');
  const lw = 4.7, rx = L + lw + 0.6, rw = R - rx, top = BODY_Y, rh = 1.05, y0 = top + 0.6;
  head(s, L, top, lw, '現状：業務別の重複費用（万円／年）');
  head(s, rx, top, rw, '一元化後の姿', { key: true });
  const rows = [['予約受付', 2900, '市とバス会社の窓口を予約センターに統合', '−2,600'], ['運行管理', 2100, '配車と運転士の管理をバス会社に一本化', '−1,900'], ['問合せ対応', 1200, '問合せも予約センターで一括して受ける', '−900'], ['広報', 600, '市の広報誌に集約（費用は現状維持）', '±0']];
  const bx = L + 1.55, sc = 0.00085;
  rows.forEach(([n, v, d, cut], i) => {
    const y = y0 + i * rh, key = i === 0;
    txt(s, n, { x: L, y, w: 1.45, h: rh - 0.2, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
    s.addShape(pres.shapes.RECTANGLE, { x: bx, y: y + (rh - 0.2) / 2 - 0.15, w: v * sc, h: 0.3, fill: { color: key ? NAVY : G3 }, line: { type: 'none' } });
    txt(s, v.toLocaleString(), num({ x: bx + v * sc + 0.08, y, w: 0.8, h: rh - 0.2, valign: 'middle', bold: key, color: key ? NAVY : BLACK }));
    txt(s, d, { x: rx, y, w: rw - 1.0, h: rh - 0.2, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
    txt(s, cut, num({ x: R - 0.95, y, w: 0.95, h: rh - 0.2, valign: 'middle', align: 'right', bold: key, color: key ? NAVY : BLACK }));
    if (i < rows.length - 1) { rowRule(s, L, y + rh - 0.1, lw); rowRule(s, rx, y + rh - 0.1, rw); }
  });
  tri(s, L + lw + 0.14, y0 + 1.75, 0.34, 0.26, G2);
  txt(s, '合計　6,800', num({ x: L, y: y0 + 4 * rh - 0.02, w: lw, h: 0.32, bold: true }));
  txt(s, '削減　−5,400（79%）', num({ x: rx, y: y0 + 4 * rh - 0.02, w: rw, h: 0.32, bold: true, color: NAVY, align: 'right' }));
}

// ---------- P12 ポンチ絵（関係図） ----------
{
  const s = frame('P12', '3　打ち手', '新しい仕組みでは予約センターが市と交通事業者の間に入り、予約と委託料の流れを一本化する。利用者は1つの窓口で、すべての便を予約できる', '新しい仕組みの全体像', null,
    '使う場面：関係者の関係、お金・モノ・情報の流れ。要素は6つ以内、各12字以内。変化する箇所だけ紺。アイコンは templates/icons/ の線画（アイコン集を参照）を使い、紺にするのは変化する主体だけ。\n差し替え：主体名、矢印のラベル。');
  const node = (x, y, label, navy, ic) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: 1.1, h: 1.1, fill: { color: WHITE }, line: { color: navy ? NAVY : G3, width: navy ? 2 : 1 } });
    ICON.icon(s, ic, x + 0.25, y + 0.25, 0.6, navy ? NAVY : G2);
    txt(s, label, { x: x - 0.6, y: y + 1.18, w: 2.3, h: 0.32, fontSize: 14, bold: navy, color: navy ? NAVY : BLACK, align: 'center' });
  };
  node(1.0, 2.9, 'みなと市', false, 'building-2');
  node(4.85, 2.4, '予約センター', true, 'network');
  node(8.7, 2.9, '交通事業者', false, 'bus');
  node(4.85, 5.0, '利用者', false, 'users');
  const arr = (x, y, w, h, c, lbl, lx, ly) => { s.addShape(pres.shapes.LINE, { x, y, w, h, line: { color: c, width: c === NAVY ? 1.75 : 1, endArrowType: 'triangle' } }); txt(s, lbl, { x: lx, y: ly, w: 2.0, h: 0.3, fontSize: 14, color: c === NAVY ? NAVY : G1, align: 'center', bold: c === NAVY }); };
  arr(2.2, 3.4, 2.55, -0.35, NAVY, '委託料', 2.45, 2.75);
  arr(6.05, 3.05, 2.55, 0.35, NAVY, '予約データ', 6.3, 2.75);
  arr(5.4, 4.5, 0, 0.45, G2, '予約', 5.55, 4.55);
}

// ---------- P13 プロセス／ロードマップ ----------
{
  const s = frame('P13', '4　実行計画', '転換は2地区での検証から始め、2030年度に全支線で予約型交通に移る。最初の判断点は2027年度末で、利用者の8割が使い続ければ拡大に移る', '実行ロードマップ', '（2027〜2030年度）',
    '使う場面：手順、スケジュール、段階的な実行。段階を矢羽で列見出しにし、左の行見出し（期間・取組・判断の基準・担い手）で中身を並べる。今回決める段階・判断点だけ紺。判断点は◆で示す。\n差し替え：フェーズ名・期間・主な取組・判断の基準・担い手。\n作法：矢羽の下に別内容を積まず、矢羽と1対1の列で書く（下半分を空けない）。');
  const lw = 1.55, gx = L + lw, pw = (W - lw - 0.3) / 3, top = 2.12, chw = (W - lw + 0.2) / 3;
  const ph = [['検証', '2027年度', ['2地区で予約型を試行', '利用と費用を測る'], '継続利用率 80%以上', 'みなと市・バス会社'],
    ['拡大', '2028〜29年度', ['支線を6路線ずつ転換', '運転士を幹線へ再配置'], '1便当たり乗車 2.0人以上', 'バス会社・予約センター'],
    ['本格展開', '2030年度〜', ['全12支線で運行', '収支を自立させる'], '赤字 2.1億円以下', '予約センター']];
  const rowsY = [top + 0.85, top + 1.45, top + 2.7, top + 3.55];
  ['期間', '主な取組', '判断の基準', '担い手'].forEach((k, j) => {
    txt(s, k, { x: L, y: rowsY[j], w: lw - 0.1, h: j === 1 ? 1.05 : 0.6, valign: 'middle', bold: true, color: G1 });
    if (j < 3) rowRule(s, L, rowsY[j + 1] - 0.08, W);
  });
  ph.forEach((p, i) => {
    const x = gx + i * (pw + 0.15), cur = i === 0;
    s.addShape(i === 0 ? pres.shapes.PENTAGON : pres.shapes.CHEVRON, { x: gx + i * (chw - 0.1), y: top, w: chw, h: 0.62, fill: { color: cur ? NAVY : G3 }, line: { type: 'none' } });
    txt(s, p[0], { x: gx + i * (chw - 0.1) + 0.3, y: top, w: chw - 0.6, h: 0.62, fontSize: 14, bold: true, color: cur ? WHITE : BLACK, valign: 'middle' });
    txt(s, p[1], num({ x: x + 0.1, y: rowsY[0], w: pw - 0.2, h: 0.6, valign: 'middle', color: G1 }));
    bullets(s, p[2], { x: x + 0.1, y: rowsY[1] + 0.05, w: pw - 0.2, h: 1.05 });
    txt(s, p[3], { x: x + 0.1, y: rowsY[2], w: pw - (i === 0 ? 0.6 : 0.2), h: 0.75, valign: 'middle', bold: cur, color: cur ? NAVY : BLACK });
    txt(s, p[4], { x: x + 0.1, y: rowsY[3], w: pw - 0.2, h: 0.6, valign: 'middle' });
  });
  const dx = gx + pw - 0.2;
  s.addShape(pres.shapes.DIAMOND, { x: dx - 0.17, y: rowsY[2] + 0.2, w: 0.34, h: 0.34, fill: { color: NAVY }, line: { type: 'none' } });
  txt(s, '判断点：2027年度末に、継続利用率で拡大の可否を決める', { x: gx, y: top + 4.35, w: W - lw, h: 0.35, bold: true, color: NAVY });
}

// ---------- P14 ロジックツリー ----------
{
  const s = frame('P14', '2　課題', '運賃収入の減少1.1億円のうち8割は、利用者数の減少で説明できる。中でも通学定期の減少の寄与が最も大きく、対策の優先度が最も高い', '運賃収入の減少の要因分解', '（億円、2015→2025年度）',
    '使う場面：要因の分解、論点整理。左から右へ。演算子（×＋）を明記。効いている枝だけ紺。線は交差させず、曲がりは1回まで。\n差し替え：各ノードの名前・値。');
  const box = (x, y, w, t, navy) => { rect(s, x, y, w, 0.62, { line: { color: navy ? NAVY : G2, width: navy ? 1.75 : 0.75 } }); txt(s, t, { x: x + 0.1, y, w: w - 0.2, h: 0.62, fontSize: 14, align: 'center', valign: 'middle', bold: navy, color: navy ? NAVY : BLACK }); };
  box(L, 3.75, 2.3, '運賃収入 −1.1', false);
  box(3.4, 2.65, 2.4, '利用者数 −0.9', true);
  box(3.4, 4.85, 2.4, '単価 −0.2', false);
  txt(s, '×', { x: 4.35, y: 3.95, w: 0.5, h: 0.4, fontSize: 16, bold: true, color: G1, align: 'center' });
  box(6.9, 2.1, 3.6, '通学定期の減少 −0.5', true);
  box(6.9, 2.95, 3.6, '高齢者の外出減 −0.4', false);
  box(6.9, 4.5, 3.6, '割引の拡大 −0.15', false);
  box(6.9, 5.45, 3.6, '乗継ぎ割引 −0.05', false);
  const conn = (x1, y1, x2, y2, c) => { line(s, x1, y1, (x2 - x1) / 2, 0, c, 1); line(s, x1 + (x2 - x1) / 2, Math.min(y1, y2), 0, Math.abs(y2 - y1), c, 1); line(s, x1 + (x2 - x1) / 2, y2, (x2 - x1) / 2, 0, c, 1); };
  conn(L + 2.3, 4.06, 3.4, 2.96, NAVY); conn(L + 2.3, 4.06, 3.4, 5.16, G3);
  conn(5.8, 2.96, 6.9, 2.41, NAVY); conn(5.8, 2.96, 6.9, 3.26, G3);
  conn(5.8, 5.16, 6.9, 4.81, G3); conn(5.8, 5.16, 6.9, 5.76, G3);
}

// ---------- P15 2x2マトリクス ----------
{
  const s = frame('P15', '3　打ち手', '検討した打ち手のうち効果も実現性も高いのは、支線の予約型交通への転換と幹線の増便である。まずこの2つに資源を集中し、残りは中期の課題とする', '打ち手の優先順位', '（縦軸：赤字の削減効果、横軸：2年以内の実現性）',
    '使う場面：2軸での優先順位付け、ポジショニング。軸の名前と両端の意味、4つの象限それぞれの「どうするか」を書く。推奨象限だけ紺。\n差し替え：軸の名前、項目と位置。');
  const X = L + 1.0, Y = 2.15, S = 4.3, Wd = 7.4;
  s.addShape(pres.shapes.RECTANGLE, { x: X + Wd / 2, y: Y, w: Wd / 2, h: S / 2, fill: { color: BLUE5 }, line: { type: 'none' } });
  line(s, X, Y + S / 2, Wd, 0, G2, 1); line(s, X + Wd / 2, Y, 0, S, G2, 1);
  txt(s, '効果 大', { x: L, y: Y, w: 0.95, h: 0.3, fontSize: 14, color: G1 });
  txt(s, '効果 小', { x: L, y: Y + S - 0.3, w: 0.95, h: 0.3, fontSize: 14, color: G1 });
  txt(s, '実現性 低', { x: X, y: Y + S + 0.08, w: 1.5, h: 0.3, fontSize: 14, color: G1 });
  txt(s, '実現性 高', { x: X + Wd - 1.5, y: Y + S + 0.08, w: 1.5, h: 0.3, fontSize: 14, color: G1, align: 'right' });
  txt(s, '最優先で着手', { x: X + Wd / 2 + 0.15, y: Y + 0.1, w: 3, h: 0.3, fontSize: 14, bold: true, color: NAVY });
  txt(s, '中期で準備', { x: X + 0.15, y: Y + 0.1, w: 3, h: 0.3, fontSize: 14, color: G1 });
  txt(s, '見送り', { x: X + 0.15, y: Y + S - 0.4, w: 3, h: 0.3, fontSize: 14, color: G1 });
  txt(s, '手が空けば実施', { x: X + Wd / 2 + 0.15, y: Y + S - 0.4, w: 3, h: 0.3, fontSize: 14, color: G1 });
  const dot = (x, y, l, navy) => { s.addShape(pres.shapes.OVAL, { x, y, w: 0.2, h: 0.2, fill: { color: navy ? NAVY : G2 }, line: { type: 'none' } }); txt(s, l, { x: x + 0.27, y: y - 0.06, w: 2.2, h: 0.3, fontSize: 14, bold: navy, color: navy ? NAVY : BLACK }); };
  dot(X + 4.6, Y + 0.7, '支線の予約型転換', true); dot(X + 4.0, Y + 1.35, '幹線の増便', true);
  dot(X + 0.6, Y + 0.75, '自動運転の導入', false); dot(X + 1.4, Y + 1.55, '企業送迎との統合', false);
  dot(X + 4.4, Y + 2.95, '運賃の見直し', false); dot(X + 0.7, Y + 3.25, '車両の小型化', false);
}

// ---------- P16 評価表 ----------
{
  const s = frame('P16', '3　打ち手', '4つの選択肢を4基準で評価すると、予約型交通への転換が効果・費用・実現性で最も高い。リスク面の弱点は段階導入で補えるため、転換を推奨する', '支線の扱いの選択肢の評価', '（●高　◑中　○低）',
    '使う場面：選択肢・事例の構造的な比較。評価はハーベイボール（グレー）。推奨する列だけ紺の細枠。表は4列4行程度まで。使った段階はすべて凡例で定義する。\n差し替え：選択肢名・基準・評価。評価基準は注記で定義する。');
  const head2 = ['評価基準', '現状維持', '予約型へ転換（推奨）', '路線の廃止', '民間へ委託'];
  const rows = [['効果', '○', '●', '◑', '◑'], ['費用', '○', '●', '●', '◑'], ['実現性', '●', '●', '○', '◑'], ['リスク', '●', '◑', '○', '◑']];
  const opt = (t, o) => ({ text: t, options: Object.assign({ fontFace: F, fontSize: 14, align: 'center', valign: 'middle', color: BLACK }, o) });
  const data = [head2.map((h, i) => opt(h, { bold: true, color: i === 2 ? NAVY : BLACK, border: [{ type: 'none' }, { type: 'none' }, { pt: 1, color: G2 }, { type: 'none' }] }))]
    .concat(rows.map((r, ri) => r.map((c, i) => opt(c, { fontSize: i === 0 ? 14 : 22, color: i === 0 ? BLACK : (i === 2 ? NAVY : G2), bold: i === 0, align: i === 0 ? 'left' : 'center', border: [{ type: 'none' }, { type: 'none' }, ri < rows.length - 1 ? { pt: 0.75, color: G4 } : { type: 'none' }, { type: 'none' }] }))));
  s.addTable(data, { x: L, y: 2.2, w: W, colW: [2.0, 2.0, 2.4, 2.0, W - 8.4], rowH: [0.55, 0.95, 0.95, 0.95, 0.95] });
  s.addShape(pres.shapes.RECTANGLE, { x: L + 4.0, y: 2.15, w: 2.4, h: 4.4, fill: { type: 'none' }, line: { color: NAVY, width: 1.5 } });
}

// ---------- P17 事例紹介 ----------
{
  const s = frame('P17', '3　打ち手', 'A町は支線を予約型交通に切り替え、3年で利用者数を38%増やした。成功の鍵は病院と商業施設を乗降地点に組み込んだことで、みなと市でも再現できる', '事例：A町の予約型交通（人口2.8万人）', '（2022年度〜）',
    '使う場面：先行事例の紹介。左に概要（背景・取組・体制・成功の鍵）、右に成果の数値。事例は「誰が作ったか・扱う規模・範囲・使っている人数」を入れる。成果の数値だけ紺。\n差し替え：事例の各項目、成果の数値。');
  const lw = 5.9; let y = 2.15;
  [['背景', '路線バス4路線の利用が10年で半減した'], ['取組', '4路線を予約型交通に切り替え、乗降地点を120か所に増やした'], ['体制', '町が運行を委託し、地元のタクシー2社が運行を担う'], ['成功の鍵', '運行前に病院と商業施設を乗降地点に組み込んだ']].forEach(([k, v], i) => {
    txt(s, k, { x: L, y, w: 1.3, h: 0.7, fontSize: 14, bold: true, color: G1, valign: 'middle' });
    txt(s, v, { x: L + 1.4, y, w: lw - 1.4, h: 0.7, fontSize: 14, valign: 'middle', bold: i === 3 });
    if (i < 3) rowRule(s, L, y + 0.92, lw);
    y += 1.1;
  });
  const rx = L + lw + 0.5, rw = R - rx;
  head(s, rx, 2.05, rw, '成果（2021→2024年度）', { key: true });
  txt(s, '年間利用者数', { x: rx, y: 2.75, w: rw, h: 0.3, fontSize: 14, color: G1 });
  txt(s, '＋38%', num({ x: rx, y: 3.1, w: rw, h: 0.8, fontSize: 36, bold: true, color: NAVY }));
  txt(s, '1.9万人 → 2.6万人', num({ x: rx, y: 3.95, w: rw, h: 0.3, fontSize: 14, color: G1 }));
  rowRule(s, rx, 4.55, rw);
  txt(s, '1便当たりの運行費用', { x: rx, y: 4.75, w: rw, h: 0.3, fontSize: 14, color: G1 });
  txt(s, '−24%', num({ x: rx, y: 5.1, w: rw, h: 0.6, fontSize: 28, bold: true, color: BLACK }));
  txt(s, '8,300円 → 6,300円', num({ x: rx, y: 5.75, w: rw, h: 0.3, fontSize: 14, color: G1 }));
}

// ---------- P18 アンケート結果 ----------
{
  const s = frame('P18', '1　現状', '住民の72%がバスの存続を望み、70代以上では77%に達する。存続の是非より、どう維持するかを議論すべき段階にある', 'バスを今後も残すべきと思うか', '（%、n＝1,200、2026年5月）',
    '使う場面：アンケート結果。属性別の行を横の100%積上げで。設問文・n数・調査時期を必ず記載。注目の回答だけ紺。凡例はグラフの上に1行で置く。\n差し替え：属性・回答割合・設問文。');
  const labels = ['全体', '10〜20代', '30〜40代', '50〜60代', '70代以上'].reverse();
  s.addChart(pres.charts.BAR, [
    { name: 'そう思う', labels, values: [52, 40, 44, 50, 55].reverse() },
    { name: 'ややそう思う', labels, values: [20, 22, 25, 22, 22].reverse() },
    { name: 'どちらでもない', labels, values: [15, 20, 17, 16, 13].reverse() },
    { name: 'そう思わない', labels, values: [13, 18, 14, 12, 10].reverse() },
  ], Object.assign({}, chartBase, { x: L, y: 2.5, w: W, h: 4.15, barDir: 'bar', barGrouping: 'percentStacked', barGapWidthPct: 40, chartColors: [NAVY, '7F7F7F', 'CCCCCC', 'E0EEF8'], showValue: true, dataLabelPosition: 'ctr', dataLabelColor: WHITE }));
  const lg = [['そう思う', NAVY], ['ややそう思う', '7F7F7F'], ['どちらでもない', 'CCCCCC'], ['そう思わない', 'E0EEF8']];
  lg.forEach(([n, c], i) => { const x = L + 1.6 + i * 2.1; s.addShape(pres.shapes.RECTANGLE, { x, y: 2.17, w: 0.2, h: 0.2, fill: { color: c }, line: { type: 'none' } }); txt(s, n, { x: x + 0.28, y: 2.12, w: 1.7, h: 0.3, fontSize: 14, color: i === 0 ? NAVY : BLACK, bold: i === 0 }); });
}

// ---------- P19 提言 ----------
{
  const s = frame('P19', '4　提言', '赤字の半減に向け、収入・費用・体制の3領域で施策を提言する。効果の大きい予約型への転換と運転士の再配置は、2027年度に着手する必要がある', '提言の全体像', null,
    '使う場面：提言。グループに分け、番号を振って他ページから参照できるようにする。各施策は動詞で終える。実行時期を付ける。最優先の施策だけ紺。\n差し替え：領域・施策・時期。');
  const groups = [['1　収入を増やす', [['1-1', '幹線を1時間3本に増やす', '2028年度', false], ['1-2', '通院向けの定額乗車券を出す', '2028年度', false]]],
    ['2　費用を抑える', [['2-1', '支線12路線を予約型交通に転換する', '2027年度', true], ['2-2', '運転士を支線から幹線へ再配置する', '2027年度', true], ['2-3', '車両の更新を小型車に切り替える', '2029年度', false]]],
    ['3　体制を整える', [['3-1', '市に交通の推進室を設ける', '2027年度', false], ['3-2', '収支と利用者数を四半期ごとに管理する', '2027年度', false]]]];
  head(s, L, 2.1, W - 1.4, '施策');
  head(s, R - 1.3, 2.1, 1.3, '着手時期', { align: 'right' });
  let y = 2.62;
  groups.forEach(([g, items], gi) => {
    txt(s, g, { x: L, y, w: 2.6, h: 0.4, fontSize: 14, bold: true, valign: 'middle' });
    items.forEach(([n, t, when, key]) => {
      txt(s, n, num({ x: L + 2.7, y, w: 0.6, h: 0.4, fontSize: 14, bold: true, color: key ? NAVY : G1, valign: 'middle' }));
      txt(s, t, { x: L + 3.35, y, w: 5.2, h: 0.4, fontSize: 14, bold: key, color: key ? NAVY : BLACK, valign: 'middle' });
      txt(s, when, num({ x: R - 1.3, y, w: 1.3, h: 0.4, fontSize: 14, color: key ? NAVY : G1, bold: key, align: 'right', valign: 'middle' }));
      y += 0.52;
    });
    if (gi < groups.length - 1) rowRule(s, L, y - 0.04, W);
    y += 0.12;
  });
}

// ---------- P20 数値ハイライト ----------
{
  const s = frame('P20', '4　実行計画', '施策をすべて実行すると、2030年度の収支は年2.1億円改善し、利用者数も18%増える。収支の改善が最も大きく、事業の自立が視野に入る', '施策実行後の効果', '（2030年度時点、2025年度比）',
    '使う場面：主要な数値の並び（KPI）。3〜4個まで。最も言いたい数値だけ紺。各数値に「現状→目標」と算定の前提を添え、下半分を空けない。\n差し替え：指標名・数値・現状と目標・前提。');
  const k = [['収支', '＋2.1', '億円／年', '−4.2 → −2.1億円', '予約型への転換と幹線の増便の効果を合算', true],
    ['利用者数', '＋18', '%', '290 → 342万人', '幹線の増便による利用の増加を含む', false],
    ['CO₂排出量', '−1,200', 't／年', '5,400 → 4,200t', '車両の小型化と走行距離の短縮による', false],
    ['運転士の余力', '＋14', '人', '欠員15% → 充足', '支線から幹線への再配置による', false]];
  const cw = W / 4;
  k.forEach(([n, v, u, ft, basis, key], i) => {
    const x = L + i * cw;
    if (i > 0) line(s, x, 2.15, 0, 4.3, G4, 0.75);
    txt(s, n, { x: x + 0.15, y: 2.15, w: cw - 0.3, h: 0.35, fontSize: 14, bold: true, color: key ? NAVY : BLACK, align: 'center' });
    txt(s, v, num({ x: x + 0.1, y: 2.65, w: cw - 0.2, h: 0.9, fontSize: 32, bold: true, color: key ? NAVY : BLACK, align: 'center', valign: 'middle' }));
    txt(s, u, { x: x + 0.15, y: 3.6, w: cw - 0.3, h: 0.32, fontSize: 14, color: G1, align: 'center' });
    rowRule(s, x + 0.25, 4.15, cw - 0.5);
    txt(s, '現状 → 目標', { x: x + 0.15, y: 4.3, w: cw - 0.3, h: 0.3, fontSize: 11, color: G1, align: 'center' });
    txt(s, ft, num({ x: x + 0.1, y: 4.62, w: cw - 0.2, h: 0.35, fontSize: 14, bold: key, color: key ? NAVY : BLACK, align: 'center' }));
    txt(s, '補足：' + basis, { x: x + 0.15, y: 5.25, w: cw - 0.3, h: 0.9, fontSize: 11, color: G1, align: 'center' });
  });
}

const CTX = { pres, frame, txt, line, rect, head, rowRule, bullets, RULE, chartBase, icon: ICON.icon, C: { F, NAVY, BLACK, G1, G2, G3, G4, G5, WHITE, BLUE5, L, R, W, BODY_Y, TOP } };
require('./build_pattern_deck_more.js')(CTX);
require('./build_pattern_deck_more2.js')(CTX);
require('./build_pattern_deck_more3.js')(CTX);
require('./build_pattern_deck_more4.js')(CTX);
require('./build_pattern_deck_more5.js')(CTX);
require('./build_symbol_icon_sheets.js')(CTX);
require('./build_template_sheets.js')(CTX);
require('./build_example_deck.js')(CTX);

// データラベルの色を系列ごとに決め直す（G-5：濃い塗りの内側は白、淡い塗りと棒の外側は黒）
// pptxgenjs はラベル色をグラフ全体で1色しか指定できないため、書き出し後に系列単位で直す
const DARK = ['000F78', '7F7F7F', '3C64AA', '3F3F3F'];
function fixLabelColors(xml) {
  const stacked = /<c:grouping val="(stacked|percentStacked)"\/>/.test(xml);
  return xml.replace(/<c:ser>[\s\S]*?<\/c:ser>/g, ser => {
    const fill = ser.match(/<c:spPr><a:solidFill><a:srgbClr val="([0-9A-Fa-f]{6})"/);
    if (!fill || !/<c:dLbls>[\s\S]*<c:showVal val="1"\/>/.test(ser)) return ser;
    const pos = ser.match(/<c:dLblPos val="(\w+)"\/>/);
    const inside = pos ? ['ctr', 'inEnd', 'inBase'].includes(pos[1]) : stacked;
    const color = inside && DARK.includes(fill[1].toUpperCase()) ? WHITE : BLACK;
    return ser.replace(/(<c:dLbls>[\s\S]*?<a:defRPr[^>]*><a:solidFill><a:srgbClr val=")[0-9A-Fa-f]{6}/, `$1${color}`);
  });
}

ICON.flush()
  .then(() => pres.write({ outputType: 'nodebuffer' }))
  .then(buf => require('jszip').loadAsync(buf))
  .then(async zip => {
    for (const name of Object.keys(zip.files).filter(n => /^ppt\/charts\/chart\d+\.xml$/.test(n))) {
      zip.file(name, fixLabelColors(await zip.file(name).async('string')));
    }
    // スライドマスターにガイド線を入れる（scripts/add_guides.py と同じ値。単位は 1/8pt＝1インチの576分の1）
    const g = [['horz', GUIDE.titleTop], ['horz', GUIDE.bodyTop], ['vert', GUIDE.left], ['vert', GUIDE.right], ['vert', GUIDE.center]].map(([o, cm], i) => {
      const inch = o === 'horz' ? SLIDE_H / 2 - cm * CM : SLIDE_W / 2 + cm * CM;
      return `<p15:guide id="${i + 1}"${o === 'horz' ? ' orient="horz"' : ''} pos="${Math.round(inch * 576)}" userDrawn="1"><p15:clr><a:srgbClr val="F26B43"/></p15:clr></p15:guide>`;
    }).join('');
    const ext = `<p:extLst><p:ext uri="{27BBF7A9-308A-43DC-89C8-2F10F3537804}"><p15:sldGuideLst xmlns:p15="http://schemas.microsoft.com/office/powerpoint/2012/main">${g}</p15:sldGuideLst></p:ext></p:extLst>`;
    const mname = 'ppt/slideMasters/slideMaster1.xml';
    zip.file(mname, (await zip.file(mname).async('string')).replace('</p:sldMaster>', ext + '</p:sldMaster>'));
    await require('fs').promises.writeFile(OUT, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
    // 本体の紺を主役の1か所に絞る（G-6）。読み取り・見出し・番号の紺は文字色に、ほかの紺の塗りは Gray2 にする
    require('child_process').execFileSync('python3', [path.join(__dirname, 'one_navy.py'), OUT], { stdio: 'inherit' });
    console.log('written', OUT);
  });
