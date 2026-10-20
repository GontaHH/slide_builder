// パターン見本デッキ生成（consulting-slide-builder 規定準拠）
const pptxgen = require('pptxgenjs');
const path = require('path');
const OUT = process.argv[2] || 'pattern-deck.pptx';

const pres = new pptxgen();
pres.defineLayout({ name: 'A4_NRI', width: 10.833, height: 7.5 });
pres.layout = 'A4_NRI';
pres.title = 'パターン見本デッキ';
pres.theme = { headFontFace: 'Yu Gothic UI', bodyFontFace: 'Yu Gothic UI' };

const F = 'Yu Gothic UI';
const NAVY = '000F78', BLACK = '000000', G1 = '595959', G2 = '7F7F7F', G3 = 'BFBFBF', G4 = 'E7E6E6', G5 = 'F2F2F2', WHITE = 'FFFFFF';
const L = 0.315, R = 10.833 - 0.315, W = R - L;           // 左右余白0.8cm
const BODY_Y = 1.55, BODY_B = 6.75;

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

// 本文スライドの共通フレーム
function frame(id, chapter, message, slideTitle, unit, notes, opts = {}) {
  const s = pres.addSlide();
  pageNo++;
  // メッセージブロック：紺の縦バー＋章名＋2行メッセージ
  s.addShape(pres.shapes.RECTANGLE, { x: L, y: 0.28, w: 0.055, h: 1.0, fill: { color: NAVY }, line: { type: 'none' } });
  txt(s, chapter, { x: L + 0.16, y: 0.26, w: W - 0.16, h: 0.24, fontSize: 11, color: G1 });
  txt(s, message, { x: L + 0.16, y: 0.52, w: W - 0.16, h: 0.76, fontSize: 20, bold: true, color: NAVY, valign: 'middle', lineSpacingMultiple: 1.0 });
  line(s, L, 1.40, W, 0, G3, 0.75);
  // スライドタイトル（14pt太字＋細線）
  if (slideTitle) {
    const t = [{ text: slideTitle, options: { bold: true, fontSize: 14 } }];
    if (unit) t.push({ text: '　' + unit, options: { fontSize: 11, color: G1 } });
    txt(s, t, { x: L, y: BODY_Y, w: opts.titleW || W - 1.3, h: 0.3 });
    line(s, L, BODY_Y + 0.34, opts.titleW || W, 0, G3, 0.5);
  }
  // 見本ステッカー
  txt(s, opts.sticker || '見本', { x: R - (opts.sticker ? 1.05 : 0.75), y: BODY_Y, w: opts.sticker ? 1.05 : 0.75, h: 0.26, fontSize: 11, color: G1, align: 'center', valign: 'middle', line: { color: G3, width: 0.75 } });
  // 注記・出所・ページ番号
  txt(s, opts.source || '注）ダミー値による見本。実際の資料ではエビデンスExcelの値に差し替える\n出所）【発行主体】「【資料名】」（【発行年月】）', { x: L, y: 6.86, w: 8.6, h: 0.42, fontSize: 9, color: G1 });
  txt(s, String(pageNo), { x: R - 0.5, y: 7.08, w: 0.5, h: 0.2, fontSize: 9, color: G1, align: 'right' });
  s.addNotes(opts.rawNotes ? notes : `パターンID：${id}\n${notes}\n参考ページID：${(REFS[id] || []).join('、') || '未登録（slide-reference-library で収集後に追記）'}（画像はPCの参照ライブラリ/pages/）`);
  return s;
}

const MSG = '【対象】の【指標】は【期間】で【数値A】増加し、【比較対象】の【数値B】倍に達した。【示唆：だから何をすべきか】を早期に検討すべき局面にある';
const chartBase = {
  catAxisLabelFontFace: 'Arial', valAxisLabelFontFace: 'Arial', dataLabelFontFace: 'Arial',
  catAxisLabelFontSize: 14, dataLabelFontSize: 14, catAxisLabelColor: BLACK, dataLabelColor: BLACK,
  valAxisHidden: true, valGridLine: { style: 'none' }, catGridLine: { style: 'none' },
  catAxisLineShow: true, catAxisLineColor: G3, showLegend: false,
};

// ---------- 表紙 ----------
{
  const s = pres.addSlide();
  pageNo++;
  txt(s, 'パターン見本デッキ', { x: 0.8, y: 2.4, w: 9, h: 0.8, fontSize: 32, bold: true, color: NAVY });
  txt(s, 'consulting-slide-builder 用　55の型（P01〜P55）＋通しの完成例', { x: 0.8, y: 3.3, w: 9, h: 0.4, fontSize: 16, color: BLACK });
  txt(s, '使い方：この見本を複製し、中身だけを差し替えてスライドを作る。各スライドのノートに、パターンID・使う場面・差し替える箇所を記載。\n数値は全てダミー値。成果物に残さないこと。', { x: 0.8, y: 4.1, w: 9.2, h: 0.9, fontSize: 14, color: G1 });
  line(s, 0.8, 3.85, 9.2, 0, G3, 0.75);
  s.addNotes('表紙。案件で使う際は、このファイルを案件名で別名保存し、最後に見本スライドを削除する。');
}

// ---------- P01 エグゼクティブサマリー ----------
{
  const s = frame('P01', '00　エグゼクティブサマリー', '【対象】は【課題】により【期間】で【数値A】が不足する。【打ち手A】と【打ち手B】を組み合わせ、【時期】までに【目標】を達成すべきである', null, null,
    '使う場面：デッキ冒頭。各章のメッセージラインを1行に要約し、根拠の数字を添える。最後の提言だけを紺にする。\n差し替え：章ごとの結論文・根拠の数字・提言。');
  const rows = [
    ['現状', '【対象】の【指標】は10年で【数値A】減少し、全国平均を下回る', '根拠：【指標】【数値】（【年度】）'],
    ['課題', '減少の主因は【要因X】であり、【要因Y】の影響は限定的である', '根拠：要因分解で【要因X】が全体の【数値】%'],
    ['打ち手', '【打ち手A】は効果と実現性の両面で最も優先度が高い', '根拠：評価表で4基準中3基準が最上位'],
  ];
  let y = 1.65;
  rows.forEach((r, i) => {
    txt(s, r[0], { x: L, y, w: 1.1, h: 0.62, fontSize: 14, bold: true, color: G1 });
    txt(s, r[1], { x: L + 1.25, y, w: W - 1.25, h: 0.32, fontSize: 14, bold: true });
    txt(s, r[2], { x: L + 1.25, y: y + 0.34, w: W - 1.25, h: 0.3, fontSize: 14, color: G1 });
    line(s, L, y + 0.82, W, 0, G4, 0.75);
    y += 1.0;
  });
  s.addShape(pres.shapes.RECTANGLE, { x: L, y: y + 0.15, w: W, h: 1.35, fill: { color: NAVY, transparency: 90 }, line: { color: NAVY, width: 1.5 } });
  txt(s, '提言', { x: L + 0.2, y: y + 0.3, w: 1.0, h: 0.3, fontSize: 14, bold: true, color: NAVY });
  txt(s, '【打ち手A】を【時期】までに実行し、並行して【打ち手B】の検証に着手する。\n初年度は【体制】を立ち上げ、【KPI】で進捗を管理する', { x: L + 1.25, y: y + 0.3, w: W - 1.45, h: 1.0, fontSize: 14, bold: true, color: NAVY });
}

// ---------- P02 目次・章扉 ----------
{
  const s = frame('P02', '目次', '本資料は【問い】に答えるため、現状・課題・打ち手・実行計画の順に検討結果を示す。本章では【章の要点】を明らかにし、次章の打ち手の前提とする', null, null,
    '使う場面：目次、各章の扉。当該章だけ紺・太字、他はグレー。\n差し替え：章名。');
  const items = ['現状：【対象】を取り巻く環境', '課題：【指標】悪化の要因', '打ち手：選択肢の評価', '実行計画：ロードマップと体制', '参考資料'];
  let y = 1.85;
  items.forEach((t, i) => {
    const cur = i === 1;
    txt(s, String(i + 1).padStart(2, '0'), { x: L + 0.3, y, w: 0.7, h: 0.5, fontSize: 20, bold: true, color: cur ? NAVY : G3, fontFace: 'Arial', valign: 'middle' });
    txt(s, t, { x: L + 1.2, y, w: 8, h: 0.5, fontSize: 16, bold: cur, color: cur ? NAVY : G2, valign: 'middle' });
    line(s, L + 0.3, y + 0.7, W - 0.6, 0, G4, 0.75);
    y += 0.9;
  });
}

// ---------- P03 縦棒の時系列＋CAGR ----------
{
  const s = frame('P03', '1　現状', MSG, '【対象】の【指標】の推移', '（【単位】、2015–2025年度）',
    '使う場面：時系列の増減を示す。期間が少ない（〜10本）場合。言いたい期間の棒だけ紺、CAGRを紺の注釈で。\n差し替え：系列データ（グラフ用シート）、CAGRの値と範囲、見出し。');
  const labels = ['2015', '2017', '2019', '2021', '2023', '2025'];
  s.addChart(pres.charts.BAR, [
    { name: '過去', labels, values: [100, 108, 115, 0, 0, 0] },
    { name: '直近', labels, values: [0, 0, 0, 132, 150, 170] },
  ], Object.assign({}, chartBase, { x: L, y: 2.15, w: W, h: 4.5, barDir: 'col', barGrouping: 'stacked', barGapWidthPct: 60, chartColors: [G3, NAVY], showValue: true, dataLabelPosition: 'inEnd', dataLabelColor: WHITE, dataLabelFormatCode: '#,##0;;' }));
  // CAGR注釈
  s.addShape(pres.shapes.LINE, { x: 5.6, y: 2.55, w: 3.8, h: -0.0, line: { color: NAVY, width: 1.25, endArrowType: 'triangle' } });
  txt(s, 'CAGR ＋【X】%', { x: 6.4, y: 2.15, w: 2.4, h: 0.32, fontSize: 14, bold: true, color: NAVY, align: 'center' });
}

// ---------- P04 降順の横棒比較 ----------
{
  const s = frame('P04', '1　現状', '【対象】の【指標】は8地域中【順位】位で、上位地域の【数値A】割にとどまる。上位との差は【要因】で説明でき、改善余地が大きい', '地域別の【指標】', '（【単位】、【年度】）',
    '使う場面：大小・順位の比較。必ず降順。注目対象だけ紺、他はグレー。\n差し替え：項目名と値（降順に並べ替える）、注目対象の位置。');
  const labels = ['地域A', '地域B', '地域C', '地域D', '【対象】', '地域F', '地域G', '地域H'].reverse();
  const v = [180, 165, 150, 140, 120, 110, 95, 80].reverse();
  s.addChart(pres.charts.BAR, [
    { name: 'その他', labels, values: v.map((x, i) => labels[i] === '【対象】' ? 0 : x) },
    { name: '対象', labels, values: v.map((x, i) => labels[i] === '【対象】' ? x : 0) },
  ], Object.assign({}, chartBase, { x: L, y: 2.05, w: 7.2, h: 4.65, barDir: 'bar', barGrouping: 'stacked', barGapWidthPct: 45, chartColors: [G3, NAVY], showValue: true, dataLabelPosition: 'inEnd', dataLabelColor: WHITE, dataLabelFormatCode: '#,##0;;' }));
  txt(s, '上位地域との差は\n【数値】ポイント', { x: 7.9, y: 4.6, w: 2.5, h: 0.7, fontSize: 14, bold: true, color: NAVY });
  line(s, 7.75, 4.95, 0.12, 0, NAVY, 1.25);
}

// ---------- P05 100%積上げ ----------
{
  const s = frame('P05', '1　現状', '【対象】の構成比は【期間】で大きく変わり、【区分C】の比率が【数値A】ポイント上昇した。今後の需要は【区分C】を軸に組み立てる必要がある', '【指標】の構成比の変化', '（%、【年度】）',
    '使う場面：構成の変化。系列は5つ以内、グレーの濃淡で塗り分け、注目の1系列だけ紺。\n差し替え：系列名・値、注目系列。');
  const labels = ['2015', '2020', '2025'];
  s.addChart(pres.charts.BAR, [
    { name: '区分A', labels, values: [40, 35, 28] },
    { name: '区分B', labels, values: [35, 33, 30] },
    { name: '区分C', labels, values: [15, 22, 32] },
    { name: 'その他', labels, values: [10, 10, 10] },
  ], Object.assign({}, chartBase, { x: L, y: 2.05, w: 7.6, h: 4.65, barDir: 'col', barGrouping: 'percentStacked', barGapWidthPct: 70, chartColors: ['595959', '7F7F7F', NAVY, 'A6A6A6'], showValue: true, dataLabelPosition: 'ctr', dataLabelColor: WHITE }));
  // 直接ラベル（凡例の代わり）
  const names = [['その他', 2.55], ['区分C', 3.35], ['区分B', 4.45], ['区分A', 5.6]];
  names.forEach(([n, y]) => txt(s, n, { x: 8.05, y, w: 1.2, h: 0.3, fontSize: 14, color: n === '区分C' ? NAVY : BLACK, bold: n === '区分C' }));
  txt(s, '＋【数値A】pt', { x: 8.95, y: 3.35, w: 1.6, h: 0.3, fontSize: 14, bold: true, color: NAVY });
}

// ---------- P06 ウォーターフォール（図形で作図） ----------
{
  const s = frame('P06', '2　課題', '【指標】は【期間】で【数値A】減少し、その約【数値B】割は【要因X】による。【要因X】への対策なしに【指標】を回復させることはできない', '【指標】の増減要因', '（【単位】、【期間】）',
    '使う場面：増減の要因分解。始点・終点は濃いグレー、要因は中間のグレー、最大要因だけ紺。棒は図形で作図（編集可能）。\n差し替え：要因名・値。棒の高さは値に比例させて調整する。');
  const items = [['【年度】\n実績', 100, 'total'], ['要因X', -30, 'key'], ['要因Y', -8, 'n'], ['要因Z', 6, 'n'], ['その他', -3, 'n'], ['【年度】\n実績', 65, 'total']];
  const x0 = L + 0.3, bw = 1.05, gap = 0.55, base = 6.0, scale = 0.034;
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
    txt(s, lbl, { x, y: top - 0.32, w: bw, h: 0.28, fontSize: 14, bold: kind === 'key', color: kind === 'key' ? NAVY : BLACK, align: 'center', fontFace: 'Arial' });
    txt(s, name, { x: x - 0.1, y: base + 0.08, w: bw + 0.2, h: 0.55, fontSize: 14, align: 'center' });
    if (i < items.length - 1) line(s, x + bw, base - level * scale, gap, 0, G3, 0.5, { line: { color: G3, width: 0.5, dashType: 'dash' } });
  });
  line(s, L, base, W, 0, G3, 0.75);
}

// ---------- P07 マリメッコ（図形で作図） ----------
{
  const s = frame('P07', '1　現状', '【市場】の【数値A】割を占める最大セグメントで、【当社】のシェアは【数値B】%にとどまる。ここでの存在感の低さが成長の制約となっている', 'セグメント別の市場規模とプレイヤーシェア', '（幅＝市場規模、高さ＝シェア、【年度】）',
    '使う場面：規模と構成の両方が議論に必要なときだけ使う。片方だけなら棒グラフで足りる。\n差し替え：セグメントの幅（規模比）とシェア。【当社】の区画だけ紺。');
  const segs = [['セグメントA', 0.45, [0.35, 0.25, 0.15, 0.25]], ['セグメントB', 0.3, [0.2, 0.3, 0.3, 0.2]], ['セグメントC', 0.25, [0.4, 0.2, 0.25, 0.15]]];
  const X = L + 1.3, Y = 2.15, TW = W - 2.6, TH = 4.1;
  let x = X;
  const cols = [G2, G3, NAVY, G4];
  segs.forEach(([n, wr, shares]) => {
    const w = TW * wr; let y = Y;
    shares.forEach((sh, j) => {
      const h = TH * sh;
      s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: cols[j] }, line: { color: WHITE, width: 1.5 } });
      txt(s, Math.round(sh * 100) + '%', { x, y, w, h, fontSize: 14, align: 'center', valign: 'middle', color: j === 2 || j === 0 ? WHITE : BLACK, fontFace: 'Arial', bold: j === 2 });
      y += h;
    });
    txt(s, n + '\n（規模' + Math.round(wr * 100) + '%）', { x, y: Y + TH + 0.08, w, h: 0.5, fontSize: 14, align: 'center' });
    x += w;
  });
  ['企業X', '企業Y', '【当社】', 'その他'].forEach((n, j) => {
    const yy = Y + TH * [0.17, 0.47, 0.67, 0.88][j] - 0.15;
    txt(s, n, { x: X + TW + 0.12, y: yy, w: 1.2, h: 0.3, fontSize: 14, color: j === 2 ? NAVY : BLACK, bold: j === 2 });
  });
}

// ---------- P08 散布図 ----------
{
  const s = frame('P08', '2　課題', '【指標X】と【指標Y】には正の相関があり、【対象】は同規模の自治体より【指標Y】が低い。【指標X】を改善すれば【指標Y】も底上げできる', '【指標X】と【指標Y】の関係', '（【単位】、n＝【数値】、【年度】）',
    '使う場面：2変数の関係。平均線で象限を切り、注目点だけ紺。\n差し替え：X・Yの値、平均線の位置、注目点。');
  const xs = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  const ys = [22, 30, 28, 40, 42, 50, 47, 60, 58, 66];
  s.addChart(pres.charts.SCATTER, [
    { name: 'X', values: xs.concat([32]) },
    { name: 'その他', values: ys.concat([null]) },
    { name: '【対象】', values: xs.map(() => null).concat([30]) },
  ], Object.assign({}, chartBase, { x: L, y: 2.05, w: 7.6, h: 4.6, valAxisHidden: false, valAxisLabelFontSize: 14, valAxisLabelColor: G1, valAxisLineShow: false, chartColors: [G3, NAVY], lineSize: 0, lineDataSymbolSize: 11, catAxisLabelColor: G1 }));
  txt(s, '【対象】\n平均より【数値A】低い', { x: 8.0, y: 3.6, w: 2.5, h: 0.7, fontSize: 14, bold: true, color: NAVY });
  txt(s, '縦軸：【指標Y】\n横軸：【指標X】', { x: 8.0, y: 5.7, w: 2.5, h: 0.6, fontSize: 11, color: G1 });
}

// ---------- P09 折れ線（複数系列） ----------
{
  const s = frame('P09', '1　現状', '【対象】の【指標】は2015年以降一貫して低下し、比較対象との差は【数値A】ポイントに拡大した。他地域並みの水準へ戻すには構造的な対策が要る', '【指標】の推移（地域比較）', '（【単位】、2015–2025年）',
    '使う場面：長い期間の推移、複数系列（3本まで）。対象だけ紺、他はグレー。凡例を使わず線の端に系列名を直接書く。\n差し替え：系列データ、系列名。');
  const labels = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];
  s.addChart(pres.charts.LINE, [
    { name: '全国', labels, values: [100, 101, 102, 102, 103, 99, 100, 101, 102, 103, 104] },
    { name: '類似地域', labels, values: [100, 99, 99, 98, 98, 95, 95, 96, 96, 96, 97] },
    { name: '【対象】', labels, values: [100, 97, 95, 92, 90, 85, 84, 83, 81, 80, 78] },
  ], Object.assign({}, chartBase, { x: L, y: 2.05, w: 8.2, h: 4.6, chartColors: [G3, G2, NAVY], lineSize: 2, lineDataSymbol: 'none', valAxisHidden: false, valAxisLabelFontSize: 14, valAxisLabelColor: G1, valAxisLineShow: false, valAxisMinVal: 70, valAxisMaxVal: 110 }));
  txt(s, '全国', { x: 8.6, y: 2.55, w: 1.8, h: 0.3, fontSize: 14, color: G1 });
  txt(s, '類似地域', { x: 8.6, y: 3.25, w: 1.8, h: 0.3, fontSize: 14, color: G1 });
  txt(s, '【対象】\n差は【数値A】pt', { x: 8.6, y: 4.55, w: 1.9, h: 0.65, fontSize: 14, bold: true, color: NAVY });
}

// ---------- P10 チャート＋キーメッセージ欄 ----------
{
  const s = frame('P10', '1　現状', '【指標】の伸びは【期間】で鈍化し、その背景には3つの構造的な要因がある。いずれも【対象】単独では解消が難しく、関係者との連携が欠かせない', '【指標】の推移', '（【単位】、2015–2025年度）',
    '使う場面：チャートから読み取るべき点が2〜3ある場合。チャート上の番号とキーメッセージ欄の番号を対応させる。\n差し替え：チャートデータ、読み取り3点。');
  const labels = ['2015', '2017', '2019', '2021', '2023', '2025'];
  s.addChart(pres.charts.BAR, [{ name: '値', labels, values: [100, 112, 121, 126, 128, 129] }],
    Object.assign({}, chartBase, { x: L, y: 2.05, w: 6.0, h: 4.6, barDir: 'col', barGapWidthPct: 60, chartColors: [G3], showValue: true, dataLabelPosition: 'outEnd' }));
  const mk = (n, x, y, navy) => { s.addShape(pres.shapes.OVAL, { x, y, w: 0.32, h: 0.32, fill: { color: navy ? NAVY : WHITE }, line: { color: NAVY, width: 1 } }); txt(s, String(n), { x, y, w: 0.32, h: 0.32, fontSize: 12, bold: true, color: navy ? WHITE : NAVY, align: 'center', valign: 'middle', fontFace: 'Arial' }); };
  mk(1, 3.3, 2.75, true); mk(2, 4.25, 2.55, false); mk(3, 5.2, 2.45, false);
  const X = 6.75; let y = 2.15;
  [['伸び率の鈍化', '2021年度以降の伸びは年【数値】%に低下'], ['【要因2】', '【要因2】の影響で需要の伸びが頭打ち'], ['【要因3】', '供給側の制約で回復が遅れている']].forEach((k, i) => {
    mk(i + 1, X, y, i === 0);
    txt(s, k[0], { x: X + 0.45, y: y - 0.02, w: 3.3, h: 0.32, fontSize: 14, bold: true, color: i === 0 ? NAVY : BLACK });
    txt(s, k[1], { x: X + 0.45, y: y + 0.35, w: 3.3, h: 0.62, fontSize: 14 });
    line(s, X, y + 1.2, R - X, 0, G4, 0.75);
    y += 1.45;
  });
}

// ---------- P11 左右比較（2エクジビット） ----------
{
  const s = frame('P11', '3　打ち手', '現状は【主体A】と【主体B】が個別に【業務】を担い、重複コストが年【数値A】生じている。機能を統合すれば重複は解消し、【効果】が見込める', null, null,
    '使う場面：Before/After、現状とあるべき姿、定量と定性など2つのエクジビットを並べる場合。必ず左右に並べ、上下に積まない。結論側（右）だけ紺。\n差し替え：左右の見出しと中身。');
  const half = (W - 0.4) / 2;
  [['現状', false], ['あるべき姿', true]].forEach(([h, right], i) => {
    const x = L + i * (half + 0.4);
    txt(s, h, { x, y: BODY_Y, w: half, h: 0.3, fontSize: 14, bold: true, color: right ? NAVY : BLACK });
    line(s, x, BODY_Y + 0.34, half, 0, right ? NAVY : G3, right ? 1.25 : 0.5);
    const items = right ? ['【機能】を【主体C】に一元化', '重複コストを年【数値A】削減', '意思決定が【数値】日短縮'] : ['【主体A】【主体B】が個別に運用', '同じ【業務】を二重に実施', '調整に年【数値】日を要する'];
    items.forEach((t, j) => {
      const y = 2.25 + j * 1.35;
      rect(s, x, y, half, 1.05, { line: { color: right && j === 1 ? NAVY : G3, width: right && j === 1 ? 1.5 : 0.75 } });
      txt(s, t, { x: x + 0.25, y, w: half - 0.5, h: 1.05, fontSize: 14, valign: 'middle', bold: right && j === 1, color: right && j === 1 ? NAVY : BLACK });
    });
  });
}

// ---------- P12 ポンチ絵（関係図） ----------
{
  const s = frame('P12', '3　打ち手', '新たな仕組みでは【主体C】が【主体A】と【主体B】の間に入り、資金とデータの流れを一本化する。これにより利用者の負担が大きく減る', '新しい仕組みの全体像', null,
    '使う場面：関係者の関係、お金・モノ・情報の流れ。要素は6つ以内、各12字以内。変化する箇所だけ紺。アイコンはPowerPointの「アイコン」で単色の線画に差し替える。\n差し替え：主体名、矢印のラベル。');
  const node = (x, y, label, navy) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: 1.1, h: 1.1, fill: { color: WHITE }, line: { color: navy ? NAVY : G2, width: navy ? 2 : 1 } });
    txt(s, 'アイコン', { x, y: y + 0.4, w: 1.1, h: 0.3, fontSize: 11, color: G3, align: 'center' });
    txt(s, label, { x: x - 0.5, y: y + 1.18, w: 2.1, h: 0.32, fontSize: 14, bold: navy, color: navy ? NAVY : BLACK, align: 'center' });
  };
  node(1.0, 2.9, '【主体A】', false);
  node(4.85, 2.4, '【主体C】', true);
  node(8.7, 2.9, '【主体B】', false);
  node(4.85, 5.0, '利用者', false);
  const arr = (x, y, w, h, c, lbl, lx, ly) => { s.addShape(pres.shapes.LINE, { x, y, w, h, line: { color: c, width: c === NAVY ? 1.75 : 1, endArrowType: 'triangle' } }); txt(s, lbl, { x: lx, y: ly, w: 2.0, h: 0.3, fontSize: 14, color: c === NAVY ? NAVY : G1, align: 'center', bold: c === NAVY }); };
  arr(2.2, 3.4, 2.55, -0.35, NAVY, 'データ', 2.45, 2.75);
  arr(6.05, 3.05, 2.55, 0.35, NAVY, '資金', 6.3, 2.75);
  arr(5.4, 4.5, 0, 0.45, G2, 'サービス', 5.55, 4.55);
}

// ---------- P13 プロセス／ロードマップ ----------
{
  const s = frame('P13', '4　実行計画', '取組は3段階で進め、【年度】までに【目標】を達成する。最初の判断点は【時期】の【判断事項】であり、ここで【条件】を満たせば本格展開に移る', '実行ロードマップ', '（【年度】〜【年度】）',
    '使う場面：手順、スケジュール、段階的な実行。今回決める段階・判断点だけ紺。判断点は◆で示す。\n差し替え：フェーズ名・期間・主な取組・判断点。');
  const ph = [['フェーズ1　検証', '【年度】', ['実証範囲の決定', '効果の測定']], ['フェーズ2　拡大', '【年度】', ['対象を【数値】に拡大', '体制の整備']], ['フェーズ3　本格展開', '【年度】〜', ['全域で運用', '収支の自立化']]];
  const pw = (W - 0.3) / 3;
  ph.forEach((p, i) => {
    const x = L + i * (pw + 0.15), cur = i === 0;
    s.addShape(pres.shapes.CHEVRON, { x, y: 2.15, w: pw, h: 0.7, fill: { color: cur ? NAVY : WHITE }, line: { color: cur ? NAVY : G2, width: 1 } });
    txt(s, p[0], { x: x + 0.35, y: 2.15, w: pw - 0.6, h: 0.7, fontSize: 14, bold: true, color: cur ? WHITE : BLACK, valign: 'middle' });
    txt(s, p[1], { x, y: 3.0, w: pw, h: 0.3, fontSize: 14, color: G1, align: 'center', fontFace: F });
    p[2].forEach((t, j) => txt(s, '・' + t, { x: x + 0.2, y: 3.55 + j * 0.45, w: pw - 0.3, h: 0.35, fontSize: 14 }));
  });
  const dx = L + pw + 0.02;
  s.addShape(pres.shapes.DIAMOND, { x: dx - 0.17, y: 4.85, w: 0.34, h: 0.34, fill: { color: NAVY }, line: { type: 'none' } });
  txt(s, '判断点：【時期】\n【条件】を満たせば拡大へ', { x: dx + 0.3, y: 4.75, w: 3.5, h: 0.65, fontSize: 14, bold: true, color: NAVY });
  line(s, L, 5.02, W, 0, G3, 0.75);
}

// ---------- P14 ロジックツリー ----------
{
  const s = frame('P14', '2　課題', '【指標】の低下の【数値A】割は利用者数の減少で説明できる。中でも【要因X】の寄与が最も大きく、対策の優先度が最も高い要因である', '【指標】の要因分解', null,
    '使う場面：要因の分解、論点整理。左から右へ。演算子（×＋）を明記。効いている枝だけ紺。\n差し替え：各ノードの名前・値。');
  const box = (x, y, w, t, navy) => { rect(s, x, y, w, 0.62, { line: { color: navy ? NAVY : G2, width: navy ? 1.75 : 0.75 } }); txt(s, t, { x: x + 0.1, y, w: w - 0.2, h: 0.62, fontSize: 14, align: 'center', valign: 'middle', bold: navy, color: navy ? NAVY : BLACK }); };
  box(L, 3.75, 2.0, '【指標】', false);
  box(3.4, 2.65, 2.2, '利用者数', true);
  box(3.4, 4.85, 2.2, '単価', false);
  txt(s, '×', { x: 4.25, y: 3.95, w: 0.5, h: 0.4, fontSize: 16, bold: true, color: G1, align: 'center' });
  box(6.9, 2.0, 3.6, '【要因X】（寄与【数値】%）', true);
  box(6.9, 2.95, 3.6, '【要因Y】（寄与【数値】%）', false);
  box(6.9, 4.5, 3.6, '【要因Z】', false);
  box(6.9, 5.45, 3.6, '【要因W】', false);
  const conn = (x1, y1, x2, y2, c) => { line(s, x1, y1, (x2 - x1) / 2, 0, c, 1); line(s, x1 + (x2 - x1) / 2, Math.min(y1, y2), 0, Math.abs(y2 - y1), c, 1); line(s, x1 + (x2 - x1) / 2, y2, (x2 - x1) / 2, 0, c, 1); };
  conn(L + 2.0, 4.06, 3.4, 2.96, NAVY); conn(L + 2.0, 4.06, 3.4, 5.16, G3);
  conn(5.6, 2.96, 6.9, 2.31, NAVY); conn(5.6, 2.96, 6.9, 3.26, G3);
  conn(5.6, 5.16, 6.9, 4.81, G3); conn(5.6, 5.16, 6.9, 5.76, G3);
}

// ---------- P15 2x2マトリクス ----------
{
  const s = frame('P15', '3　打ち手', '6つの打ち手のうち、効果も実現性も高いのは【打ち手A】と【打ち手B】である。まずこの2つに資源を集中し、残りは中期の検討課題とする', '打ち手の優先順位', '（縦軸：効果、横軸：実現性）',
    '使う場面：2軸での優先順位付け、ポジショニング。軸の定義と各象限の意味を明記。推奨象限だけ紺。\n差し替え：軸の名前、項目と位置。');
  const X = L + 1.0, Y = 2.15, S = 4.3, Wd = 7.4;
  s.addShape(pres.shapes.RECTANGLE, { x: X + Wd / 2, y: Y, w: Wd / 2, h: S / 2, fill: { color: NAVY, transparency: 90 }, line: { type: 'none' } });
  line(s, X, Y + S / 2, Wd, 0, G2, 1); line(s, X + Wd / 2, Y, 0, S, G2, 1);
  txt(s, '効果 大', { x: L, y: Y, w: 0.95, h: 0.3, fontSize: 14, color: G1 });
  txt(s, '効果 小', { x: L, y: Y + S - 0.3, w: 0.95, h: 0.3, fontSize: 14, color: G1 });
  txt(s, '実現性 低', { x: X, y: Y + S + 0.08, w: 1.5, h: 0.3, fontSize: 14, color: G1 });
  txt(s, '実現性 高', { x: X + Wd - 1.5, y: Y + S + 0.08, w: 1.5, h: 0.3, fontSize: 14, color: G1, align: 'right' });
  txt(s, '最優先で着手', { x: X + Wd / 2 + 0.15, y: Y + 0.1, w: 3, h: 0.3, fontSize: 14, bold: true, color: NAVY });
  txt(s, '中期で検討', { x: X + 0.15, y: Y + 0.1, w: 3, h: 0.3, fontSize: 14, color: G1 });
  const dot = (x, y, l, navy) => { s.addShape(pres.shapes.OVAL, { x, y, w: 0.2, h: 0.2, fill: { color: navy ? NAVY : G2 }, line: { type: 'none' } }); txt(s, l, { x: x + 0.27, y: y - 0.06, w: 1.6, h: 0.3, fontSize: 14, bold: navy, color: navy ? NAVY : BLACK }); };
  dot(X + 5.2, Y + 0.7, '【打ち手A】', true); dot(X + 4.4, Y + 1.4, '【打ち手B】', true);
  dot(X + 1.2, Y + 0.9, '【打ち手C】', false); dot(X + 2.0, Y + 1.6, '【打ち手D】', false);
  dot(X + 5.0, Y + 3.0, '【打ち手E】', false); dot(X + 1.0, Y + 3.3, '【打ち手F】', false);
}

// ---------- P16 評価表 ----------
{
  const s = frame('P16', '3　打ち手', '4つの選択肢を4基準で評価すると、【案B】が効果・費用・実現性で最も高い。リスク面の弱点は【対策】で補えるため、【案B】を推奨する', '選択肢の評価', '（●高　◑中　○低）',
    '使う場面：選択肢・事例の構造的な比較。評価はハーベイボール（グレー）。推奨する列だけ紺の細枠。表は4列4行程度まで。\n差し替え：選択肢名・基準・評価。評価基準は注記で定義する。');
  const head = ['評価基準', '【案A】', '【案B】（推奨）', '【案C】', '【案D】'];
  const rows = [['効果', '◑', '●', '◑', '○'], ['費用', '○', '●', '◑', '●'], ['実現性', '◑', '●', '○', '◑'], ['リスク', '●', '◑', '◑', '○']];
  const opt = (t, o) => ({ text: t, options: Object.assign({ fontFace: F, fontSize: 14, align: 'center', valign: 'middle', color: BLACK }, o) });
  const data = [head.map((h, i) => opt(h, { bold: true, color: i === 2 ? NAVY : BLACK, border: [{ type: 'none' }, { type: 'none' }, { pt: 1, color: G2 }, { type: 'none' }] }))]
    .concat(rows.map(r => r.map((c, i) => opt(c, { fontSize: i === 0 ? 14 : 22, color: i === 0 ? BLACK : (i === 2 ? NAVY : G2), bold: i === 0, align: i === 0 ? 'left' : 'center', border: [{ type: 'none' }, { type: 'none' }, { pt: 0.5, color: G4 }, { type: 'none' }] }))));
  s.addTable(data, { x: L, y: 2.1, w: W, colW: [2.2, 2.0, 2.2, 2.0, 1.803], rowH: [0.55, 0.95, 0.95, 0.95, 0.95] });
  s.addShape(pres.shapes.RECTANGLE, { x: L + 4.2, y: 2.05, w: 2.2, h: 4.4, fill: { type: 'none' }, line: { color: NAVY, width: 1.5 } });
}

// ---------- P17 事例紹介 ----------
{
  const s = frame('P17', '3　打ち手', '【事例地域】では【取組】により【期間】で【指標】を【数値A】改善した。成功の鍵は【要因】であり、【対象】でも同じ条件を整えれば再現できる', '事例：【事例名】', '（【事例地域】、【年度】〜）',
    '使う場面：先行事例の紹介。左に概要（取組・体制）、右に成果の数値。成果の数値だけ紺。\n差し替え：事例の各項目、成果の数値。');
  const lw = 5.9; let y = 2.15;
  [['背景', '【背景】により【課題】が深刻化'], ['取組', '【取組1】と【取組2】を同時に実施'], ['体制', '【主体A】が主導し【主体B】が協力'], ['成功の鍵', '【要因】を初期に整えたこと']].forEach(([k, v]) => {
    txt(s, k, { x: L, y, w: 1.3, h: 0.6, fontSize: 14, bold: true, color: G1 });
    txt(s, v, { x: L + 1.4, y, w: lw - 1.4, h: 0.6, fontSize: 14 });
    line(s, L, y + 0.85, lw, 0, G4, 0.75);
    y += 1.05;
  });
  const rx = L + lw + 0.5, rw = R - rx;
  txt(s, '成果', { x: rx, y: 2.15, w: rw, h: 0.3, fontSize: 14, bold: true });
  line(s, rx, 2.5, rw, 0, G3, 0.5);
  txt(s, '【指標】', { x: rx, y: 2.75, w: rw, h: 0.3, fontSize: 14, color: G1 });
  txt(s, '＋【数値A】%', { x: rx, y: 3.1, w: rw, h: 0.8, fontSize: 36, bold: true, color: NAVY, fontFace: F });
  txt(s, '【期間】での改善幅', { x: rx, y: 3.95, w: rw, h: 0.3, fontSize: 14, color: G1 });
  txt(s, '【副次的な成果】', { x: rx, y: 4.75, w: rw, h: 0.3, fontSize: 14, color: G1 });
  txt(s, '【数値B】', { x: rx, y: 5.1, w: rw, h: 0.6, fontSize: 28, bold: true, color: BLACK, fontFace: F });
}

// ---------- P18 アンケート結果 ----------
{
  const s = frame('P18', '1　現状', '利用者の【数値A】割が【サービス】の継続を望んでおり、特に【属性】では【数値B】%に達する。継続の是非より、維持の方法を議論すべき段階にある', '【サービス】を継続すべきと思うか', '（%、n＝【数値】、【調査時期】）',
    '使う場面：アンケート結果。属性別の行を横の100%積上げで。設問文・n数・調査時期を必ず記載。注目の回答だけ紺。\n差し替え：属性・回答割合・設問文。');
  const labels = ['全体', '10〜20代', '30〜40代', '50〜60代', '70代以上'].reverse();
  s.addChart(pres.charts.BAR, [
    { name: 'そう思う', labels, values: [52, 48, 41, 38, 45].reverse() },
    { name: 'ややそう思う', labels, values: [20, 22, 25, 24, 22].reverse() },
    { name: 'どちらでもない', labels, values: [15, 16, 18, 20, 17].reverse() },
    { name: 'そう思わない', labels, values: [13, 14, 16, 18, 16].reverse() },
  ], Object.assign({}, chartBase, { x: L, y: 2.45, w: W, h: 4.2, barDir: 'bar', barGrouping: 'percentStacked', barGapWidthPct: 45, chartColors: [NAVY, '595959', '7F7F7F', 'A6A6A6'], showValue: true, dataLabelPosition: 'ctr', dataLabelColor: WHITE }));
  const lg = [['そう思う', NAVY], ['ややそう思う', '595959'], ['どちらでもない', '7F7F7F'], ['そう思わない', 'A6A6A6']];
  lg.forEach(([n, c], i) => { const x = L + 1.6 + i * 2.25; s.addShape(pres.shapes.RECTANGLE, { x, y: 2.07, w: 0.2, h: 0.2, fill: { color: c }, line: { type: 'none' } }); txt(s, n, { x: x + 0.28, y: 2.02, w: 1.9, h: 0.3, fontSize: 14, color: i === 0 ? NAVY : BLACK, bold: i === 0 }); });
}

// ---------- P19 提言 ----------
{
  const s = frame('P19', '4　提言', '【目標】の達成に向け、収入・費用・体制の3領域で7つの施策を提言する。うち効果の大きい1-1と2-1は【時期】までに着手する必要がある', '提言の全体像', null,
    '使う場面：提言。グループに分け、番号を振って他ページから参照できるようにする。各施策は動詞で終える。実行時期を付ける。最優先の施策だけ紺。\n差し替え：領域・施策・時期。');
  const groups = [['1　収入を増やす', [['1-1', '【対象】向けの新サービスを導入する', '【年度】', true], ['1-2', '料金体系を見直す', '【年度】', false]]],
    ['2　費用を抑える', [['2-1', '【業務】を共同化する', '【年度】', true], ['2-2', '設備更新の優先順位を見直す', '【年度】', false], ['2-3', '調達方法を変える', '【年度】', false]]],
    ['3　体制を整える', [['3-1', '推進組織を立ち上げる', '【年度】', false], ['3-2', 'KPIで進捗を管理する', '【年度】', false]]]];
  txt(s, '着手時期', { x: R - 1.3, y: 2.0, w: 1.3, h: 0.3, fontSize: 11, color: G1, align: 'right' });
  let y = 2.35;
  groups.forEach(([g, items]) => {
    txt(s, g, { x: L, y, w: 2.6, h: 0.35, fontSize: 14, bold: true });
    items.forEach(([n, t, when, key]) => {
      txt(s, n, { x: L + 2.7, y, w: 0.6, h: 0.35, fontSize: 14, bold: true, color: key ? NAVY : G1, fontFace: 'Arial' });
      txt(s, t, { x: L + 3.35, y, w: 5.2, h: 0.35, fontSize: 14, bold: key, color: key ? NAVY : BLACK });
      txt(s, when, { x: R - 1.3, y, w: 1.3, h: 0.35, fontSize: 14, color: G1, align: 'right' });
      y += 0.5;
    });
    line(s, L, y - 0.05, W, 0, G4, 0.75);
    y += 0.12;
  });
}

// ---------- P20 数値ハイライト ----------
{
  const s = frame('P20', '4　実行計画', '施策を全て実行すると【年度】には収支が年【数値A】改善し、利用者数も【数値B】%増える。収支の改善が最も大きく、事業の自立化が視野に入る', '施策実行後の効果（【年度】時点）', null,
    '使う場面：主要な数値の並び（KPI）。3〜4個まで。最も言いたい数値だけ紺、他は黒。\n差し替え：指標名・数値・補足。');
  const k = [['収支', '＋【数値A】', '億円／年', true], ['利用者数', '＋【数値B】', '%', false], ['CO₂排出量', '−【数値C】', 't／年', false], ['担い手', '＋【数値D】', '人', false]];
  const cw = W / 4;
  k.forEach(([n, v, u, key], i) => {
    const x = L + i * cw;
    if (i > 0) line(s, x, 2.3, 0, 3.4, G4, 0.75);
    txt(s, n, { x: x + 0.15, y: 2.4, w: cw - 0.3, h: 0.35, fontSize: 14, color: G1, align: 'center' });
    txt(s, v, { x: x + 0.1, y: 3.0, w: cw - 0.2, h: 1.0, fontSize: 26, bold: true, color: key ? NAVY : BLACK, align: 'center', valign: 'middle' });
    txt(s, u, { x: x + 0.15, y: 4.05, w: cw - 0.3, h: 0.35, fontSize: 14, color: G1, align: 'center' });
    txt(s, '【補足：算定の前提】', { x: x + 0.15, y: 4.8, w: cw - 0.3, h: 0.6, fontSize: 11, color: G1, align: 'center' });
  });
}

const CTX = { pres, frame, txt, line, rect, chartBase, C: { F, NAVY, BLACK, G1, G2, G3, G4, G5, WHITE, L, R, W, BODY_Y } };
require('./build_pattern_deck_more.js')(CTX);
require('./build_pattern_deck_more2.js')(CTX);
require('./build_example_deck.js')(CTX);

pres.writeFile({ fileName: OUT }).then(f => console.log('written', f));
