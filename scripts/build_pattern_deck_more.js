// 追加の型 P21〜P33（2026-10 追加）
// Jinba consulting-pptx-skill の型カタログ（62型）と外資系コンサルの公開資料の作法を参考に、
// 既存20型で不足していた「構造で通す」「進め方・計画」「提示・締め」「数字で証明（シナリオ・感度）」を補う。
module.exports = function ({ pres, frame, txt, line, rect, chartBase, C }) {
  const { F, NAVY, BLACK, G1, G2, G3, G4, G5, WHITE, L, R, W, BODY_Y, BLUE5 } = C;
  const tri = (s, x, y, w, h, color) => s.addShape(pres.shapes.ISOSCELES_TRIANGLE, { x, y, w, h, rotate: 90, fill: { color: color || G2 }, line: { type: 'none' } });
  const arrow = (s, x, y, w, h, color, width) => s.addShape(pres.shapes.LINE, { x, y, w, h, line: { color: color || G2, width: width || 1, endArrowType: 'triangle' } });
  const cell = (t, o) => ({ text: t, options: Object.assign({ fontFace: F, fontSize: 14, valign: 'middle', color: BLACK, }, o) });
  const bottom = (c, w) => [{ type: 'none' }, { type: 'none' }, { pt: w || 0.5, color: c || G4 }, { type: 'none' }];

  // ---------- P21 前提→帰結（左に図、右に読み取り） ----------
  {
    const s = frame('P21', '2　課題', '【指標】の減少分の大半は【区分X】で生じている。対策の対象を【区分X】に絞れば、限られた予算でも十分な効果を出せる', null, null,
      '使う場面：左の図（前提）から、右の読み取り（帰結）を導く。強い因果があるときだけ中央にグレーの三角を1つ置く。右の項目は左の図のどこの話かを番号で対応させる。\n差し替え：左の図、右の読み取り3点。');
    const lw = 4.9;
    txt(s, '【指標】の区分別の増減', { x: L, y: BODY_Y, w: lw, h: 0.3, bold: true });
    line(s, L, BODY_Y + 0.34, lw, 0, G3, 0.5);
    const labels = ['区分X', '区分Y', '区分Z', 'その他'];
    s.addChart(pres.charts.BAR, [
      { name: 'その他', labels, values: [0, 6, 3, 2] },
      { name: '注目', labels, values: [28, 0, 0, 0] },
    ], Object.assign({}, chartBase, { x: L, y: 2.1, w: lw, h: 4.4, barDir: 'bar', barGrouping: 'stacked', barGapWidthPct: 50, chartColors: [G3, NAVY], showValue: true, dataLabelPosition: 'inEnd', dataLabelColor: WHITE, dataLabelFormatCode: '#,##0;;', catAxisOrientation: 'maxMin' }));
    tri(s, L + lw + 0.12, 3.9, 0.45, 0.32, G2);
    const rx = L + lw + 0.75, rw = R - rx;
    txt(s, '読み取り', { x: rx, y: BODY_Y, w: rw, h: 0.3, bold: true });
    line(s, rx, BODY_Y + 0.34, rw, 0, G3, 0.5);
    [['減少の【数値】割は区分X', '区分Xだけで【数値B】の減少'], ['区分Y・Zは横ばい', '対策を急ぐ必要は小さい'], ['対象を区分Xに絞る', '予算【数値C】で効果が見込める']].forEach(([h, b], i) => {
      const y = 2.15 + i * 1.45;
      txt(s, String(i + 1), { x: rx, y, w: 0.3, h: 0.32, bold: true, color: i === 0 ? NAVY : G1, fontFace: 'Arial' });
      txt(s, h, { x: rx + 0.35, y, w: rw - 0.35, h: 0.32, bold: true, color: i === 0 ? NAVY : BLACK });
      txt(s, b, { x: rx + 0.35, y: y + 0.38, w: rw - 0.35, h: 0.6 });
      line(s, rx, y + 1.18, rw, 0, G4, 0.75);
    });
  }

  // ---------- P22 SCR（状況・課題・解決） ----------
  {
    const s = frame('P22', '0　全体像', '【対象】を支えてきた【前提】は、【変化】により崩れつつある。【解決策】へ転換すれば、【期間】で【数値A】の改善が見込める', null, null,
      '使う場面：冒頭やエグゼクティブサマリーの前で、話の骨格を3段で示す。課題は「未達の原因」だけを書き、解決は課題と1対1で対応させる。解決の列だけ紺。\n差し替え：各段の見出しと根拠2点。');
    const cw = (W - 0.6) / 3;
    [['状況', 'これまでの前提', ['【前提1】により需要が安定', '【前提2】で費用を賄えた']], ['課題', '前提が崩れた原因', ['【変化1】で需要が【数値】減少', '【変化2】で費用が【数値】増加']], ['解決', 'とるべき打ち手', ['【打ち手1】で需要を補う', '【打ち手2】で費用を抑える']]].forEach(([k, sub, items], i) => {
      const x = L + i * (cw + 0.3), key = i === 2;
      txt(s, k, { x, y: BODY_Y, w: cw, h: 0.4, fontSize: 18, bold: true, color: key ? NAVY : BLACK });
      txt(s, sub, { x, y: BODY_Y + 0.42, w: cw, h: 0.3, color: G1 });
      line(s, x, BODY_Y + 0.8, cw, 0, key ? NAVY : G3, key ? 1.5 : 0.75);
      items.forEach((t, j) => {
        const y = 2.65 + j * 1.6;
        rect(s, x, y, cw, 1.25, { line: { color: key ? NAVY : G3, width: key ? 1.25 : 0.75 } });
        txt(s, t, { x: x + 0.2, y, w: cw - 0.4, h: 1.25, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      });
      if (i < 2) tri(s, x + cw + 0.04, 3.95, 0.24, 0.2, G3);
    });
  }

  // ---------- P23 課題と打ち手の対応 ----------
  {
    const s = frame('P23', '3　打ち手', '3つの課題にはそれぞれ対応する打ち手がある。効果が最も大きい【打ち手A】に、他の2つより先に資源を集中して着手すべきである', null, null,
      '使う場面：課題と打ち手を1対1で対応させる。打ち手のない課題、課題のない打ち手を作らない。最優先の組だけ紺。\n差し替え：課題3つ、打ち手3つ、効果の目安。');
    const cw = 3.7, gx = L + cw + 1.0;
    [['課題', L], ['打ち手', gx]].forEach(([h, x], i) => { txt(s, h, { x, y: BODY_Y, w: cw, h: 0.3, bold: true }); line(s, x, BODY_Y + 0.34, cw, 0, G3, 0.5); });
    txt(s, '効果', { x: R - 1.6, y: BODY_Y, w: 0.7, h: 0.3, bold: true, align: 'right' });
    [['1　【課題1】で需要が減少', '【打ち手A】で新たな需要を取り込む', '大'], ['2　【課題2】で費用が増加', '【打ち手B】で業務を共同化する', '中'], ['3　【課題3】で担い手が不足', '【打ち手C】で外部人材を活用する', '中']].forEach(([a, b, e], i) => {
      const y = 2.2 + i * 1.5, key = i === 0;
      rect(s, L, y, cw, 1.05, { line: { color: key ? NAVY : G3, width: key ? 1.25 : 0.75 } });
      txt(s, a, { x: L + 0.2, y, w: cw - 0.4, h: 1.05, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      arrow(s, L + cw + 0.1, y + 0.52, 0.8, 0, key ? NAVY : G2, key ? 1.75 : 1);
      rect(s, gx, y, cw, 1.05, { line: { color: key ? NAVY : G3, width: key ? 1.25 : 0.75 } });
      txt(s, b, { x: gx + 0.2, y, w: cw - 0.4, h: 1.05, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      txt(s, e, { x: R - 1.6, y, w: 0.7, h: 1.05, valign: 'middle', align: 'right', fontSize: 18, bold: true, color: key ? NAVY : G1 });
    });
  }

  // ---------- P24 矢羽（プロセス・変遷） ----------
  {
    const s = frame('P24', '4　実行計画', '導入は5工程で進め、利用者に影響が出るのは工程4からである。工程3までに【準備事項】を終えることが、計画どおり進む条件となる', '導入の工程', '（【期間】）',
      '使う場面：工程・手順・変遷を左から右へ。4〜6工程。今回決める工程・最も重要な工程だけ紺。各工程の下に、何をするか・誰がするかを2行以内で書く。\n差し替え：工程名、内容、担当、期間。');
    const n = 5, cw = (W + 0.15 * (n - 1)) / n;
    ['現状把握', '設計', '準備', '試行', '本格運用'].forEach((t, i) => {
      const x = L + i * (cw - 0.15), key = i === 3;
      s.addShape(i === 0 ? pres.shapes.PENTAGON : pres.shapes.CHEVRON, { x, y: 2.15, w: cw, h: 0.75, fill: { color: key ? NAVY : WHITE }, line: { color: key ? NAVY : G2, width: 1 } });
      txt(s, String(i + 1) + '　' + t, { x: x + 0.3, y: 2.15, w: cw - 0.55, h: 0.75, bold: true, color: key ? WHITE : BLACK, valign: 'middle' });
      txt(s, ['【期間】', '【期間】', '【期間】', '【期間】', '【時期】〜'][i], { x: x + 0.1, y: 3.05, w: cw - 0.3, h: 0.3, color: G1 });
      txt(s, ['利用実態を調べる', '運用ルールを決める', '設備と人を用意する', '一部地域で試す', '全域に広げる'][i], { x: x + 0.1, y: 3.5, w: cw - 0.3, h: 0.65, bold: key, color: key ? NAVY : BLACK });
      txt(s, '担当：【主体】', { x: x + 0.1, y: 4.3, w: cw - 0.3, h: 0.3, color: G1 });
    });
    line(s, L, 4.85, W, 0, G4, 0.75);
    txt(s, '工程4の開始条件：【条件1】と【条件2】を満たすこと', { x: L, y: 5.05, w: W, h: 0.35, bold: true, color: NAVY });
  }

  // ---------- P25 ガントチャート ----------
  {
    const s = frame('P25', '4　実行計画', '全体の完了時期は最も長い【作業B】で決まる。【作業B】に着手する【時期】までに予算を確定できるかが、計画の成否を分ける', 'スケジュール', '（【年度】）',
      '使う場面：作業ごとの期間と順序。全体の完了時期を決める作業（クリティカルパス）だけ紺。節目は◆で示す。作業は8行程度まで。\n差し替え：作業名、開始・終了月、節目。');
    const months = ['4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '1月', '2月', '3月'];
    const lx = L, lw = 2.8, gx = L + lw, gw = W - lw, mw = gw / 12;
    months.forEach((m, i) => { txt(s, m, { x: gx + i * mw, y: 2.1, w: mw, h: 0.3, align: 'center', color: G1 }); if (i > 0) line(s, gx + i * mw, 2.45, 0, 3.9, G5, 0.75); });
    line(s, L, 2.45, W, 0, G3, 0.75);
    const tasks = [['作業A　現状調査', 0, 3, false], ['作業B　システム整備', 2, 10, true], ['作業C　関係者協議', 1, 6, false], ['作業D　規程の改定', 5, 8, false], ['作業E　試行運用', 8, 11, false], ['作業F　効果検証', 10, 12, false]];
    tasks.forEach(([t, a, b, key], i) => {
      const y = 2.6 + i * 0.62;
      txt(s, t, { x: lx, y, w: lw - 0.1, h: 0.4, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      s.addShape(pres.shapes.RECTANGLE, { x: gx + a * mw + 0.03, y: y + 0.08, w: (b - a) * mw - 0.06, h: 0.26, fill: { color: key ? NAVY : G3 }, line: { type: 'none' } });
      line(s, L, y + 0.52, W, 0, G5, 0.5);
    });
    [[6, '協議の合意'], [12, '本格運用の判断']].forEach(([m, t], i) => {
      const x = gx + m * mw;
      s.addShape(pres.shapes.DIAMOND, { x: x - 0.14, y: 6.38, w: 0.28, h: 0.28, fill: { color: i === 1 ? NAVY : G2 }, line: { type: 'none' } });
      txt(s, t, { x: x - 1.6, y: 6.4, w: 1.4, h: 0.3, align: 'right', bold: i === 1, color: i === 1 ? NAVY : BLACK });
    });
  }

  // ---------- P26 スイムレーン（業務フロー） ----------
  {
    const s = frame('P26', '2　課題', '現在の手続きは完了までに平均【数値A】日かかり、遅れの大半は【主体B】での確認待ちで生じている。ここが改善の焦点となる', '現在の手続きの流れ', '（導入前の現状）',
      '使う場面：複数の主体にまたがる業務の流れ。行＝主体（レーン）、左から右へ時間。導入前の現状に提案物を混ぜない。問題の工程だけ紺。\n差し替え：レーン名、工程、矢印。');
    const lanes = ['利用者', '【主体A】', '【主体B】'], lh = 1.45, top = 2.1, lx = L + 1.5, lw = W - 1.5;
    lanes.forEach((n, i) => {
      const y = top + i * lh;
      if (i % 2 === 0) s.addShape(pres.shapes.RECTANGLE, { x: L, y, w: W, h: lh, fill: { color: G5 }, line: { type: 'none' } });
      txt(s, n, { x: L + 0.1, y, w: 1.3, h: lh, bold: true, valign: 'middle' });
      line(s, L, y + lh, W, 0, G3, 0.5);
    });
    line(s, L, top, W, 0, G3, 0.5);
    line(s, lx, top, 0, lh * 3, G3, 0.5);
    const bw = 1.5, bh = 0.7;
    const steps = [[0, 0, '申請', false], [1, 1, '受付', false], [2, 2, '内容の確認', true], [1, 3, '補正の依頼', false], [0, 4, '書類の再提出', false], [2, 5, '承認', false]];
    const pos = steps.map(([lane, col]) => ({ x: lx + 0.15 + col * 1.4, y: top + lane * lh + (lh - bh) / 2 }));
    steps.forEach(([lane, col, t, key], i) => {
      const p = pos[i];
      rect(s, p.x, p.y, bw - 0.25, bh, { line: { color: key ? NAVY : G2, width: key ? 1.75 : 0.75 } });
      txt(s, t, { x: p.x + 0.05, y: p.y, w: bw - 0.35, h: bh, align: 'center', valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      if (i < steps.length - 1) {
        const q = pos[i + 1], x1 = p.x + bw - 0.25, y1 = p.y + bh / 2, y2 = q.y + bh / 2;
        if (Math.abs(y2 - y1) < 0.01) arrow(s, x1, y1, q.x - x1, 0, G2, 1);
        else { line(s, x1, y1, (q.x - x1) / 2, 0, G2, 1); line(s, x1 + (q.x - x1) / 2, Math.min(y1, y2), 0, Math.abs(y2 - y1), G2, 1); arrow(s, x1 + (q.x - x1) / 2, y2, (q.x - x1) / 2, 0, G2, 1); }
      }
    });
    txt(s, '確認待ち 平均【数値B】日', { x: pos[2].x - 0.3, y: pos[2].y + bh + 0.04, w: 2.6, h: 0.3, bold: true, color: NAVY });
  }

  // ---------- P27 シナリオ比較（線＋前提） ----------
  {
    const s = frame('P27', '1　現状', '【指標】は基本シナリオでも【年度】に【数値A】まで減る。どのシナリオでも維持ラインを下回り、現行体制の見直しは避けられない', null, null,
      '使う場面：将来の見通しに幅がある場合。左にシナリオ別の推移、右に各シナリオの前提。基本シナリオだけ紺、他はグレー。見通しの期間は「（予測）」と明記。\n差し替え：シナリオの値、前提、維持ライン。');
    const lw = 5.9;
    txt(s, [{ text: '【指標】の見通し', options: { bold: true } }, { text: '　（【単位】、【年度】〜【年度】（予測））', options: { fontSize: 11, color: G1 } }], { x: L, y: BODY_Y, w: lw, h: 0.3 });
    line(s, L, BODY_Y + 0.34, lw, 0, G3, 0.5);
    const labels = ['2025', '2030', '2035', '2040', '2045', '2050'];
    s.addChart(pres.charts.LINE, [
      { name: '楽観', labels, values: [100, 97, 94, 91, 88, 86] },
      { name: '基本', labels, values: [100, 93, 86, 79, 72, 66] },
      { name: '悲観', labels, values: [100, 89, 78, 68, 59, 50] },
    ], Object.assign({}, chartBase, { x: L, y: 2.05, w: lw - 0.9, h: 4.55, chartColors: [G3, NAVY, G2], lineSize: 2, lineDataSymbol: 'none', valAxisHidden: false, valAxisLabelFontSize: 14, valAxisLabelColor: G1, valAxisLineShow: false, valAxisMinVal: 40, valAxisMaxVal: 110 }));
    txt(s, '楽観', { x: L + lw - 0.85, y: 2.75, w: 0.85, h: 0.3, color: G1 });
    txt(s, '基本', { x: L + lw - 0.85, y: 3.65, w: 0.85, h: 0.3, bold: true, color: NAVY });
    txt(s, '悲観', { x: L + lw - 0.85, y: 4.55, w: 0.85, h: 0.3, color: G1 });
    const rx = L + lw + 0.3, rw = R - rx;
    txt(s, '各シナリオの前提', { x: rx, y: BODY_Y, w: rw, h: 0.3, bold: true });
    line(s, rx, BODY_Y + 0.34, rw, 0, G3, 0.5);
    const data = [[cell('', { border: bottom(G2, 1) }), cell('人口', { bold: true, align: 'center', border: bottom(G2, 1) }), cell('利用率', { bold: true, align: 'center', border: bottom(G2, 1) })]]
      .concat([['楽観', '−【X】%', '＋【Y】pt'], ['基本', '−【X】%', '±0pt'], ['悲観', '−【X】%', '−【Y】pt']].map((r, i) => r.map((c, j) => cell(c, { align: j === 0 ? 'left' : 'center', bold: i === 1, color: i === 1 ? NAVY : BLACK, border: bottom() }))));
    s.addTable(data, { x: rx, y: 2.15, w: rw, colW: [1.0, (rw - 1.0) / 2, (rw - 1.0) / 2], rowH: [0.5, 0.7, 0.7, 0.7] });
    txt(s, '現行体制の維持には【指標】【数値C】以上が必要', { x: rx, y: 5.0, w: rw, h: 0.7, bold: true, color: NAVY });
  }

  // ---------- P28 感度分析（トルネード） ----------
  {
    const s = frame('P28', '3　打ち手', '収支を最も左右する前提は【前提X】で、±10%の変動で収支が【数値A】動く。本格投資の前に【前提X】を試行で確かめるべきである', '前提が±10%変動したときの収支の変化', '（【単位】、基本ケース＝【数値】）',
      '使う場面：どの前提が結論を左右するかを示す。影響の大きい順に上から並べる。最も影響の大きい前提だけ紺。基本ケースの値を中央線で示す。\n差し替え：前提名、下振れ・上振れの値。');
    const items = [['【前提X】（利用者数）', 42, 38, true], ['【前提Y】（単価）', 25, 25, false], ['【前提Z】（人件費）', 18, 15, false], ['【前提W】（設備費）', 10, 9, false], ['その他', 5, 4, false]];
    const cx = L + 2.9 + (W - 2.9) / 2, sc = 0.07, top = 2.25;
    txt(s, '下振れ', { x: cx - 2.4, y: 2.0 - 0.05, w: 2.2, h: 0.28, align: 'right', color: G1 });
    txt(s, '上振れ', { x: cx + 0.2, y: 2.0 - 0.05, w: 2.2, h: 0.28, color: G1 });
    items.forEach(([n, lo, hi, key], i) => {
      const y = top + 0.25 + i * 0.82;
      txt(s, n, { x: L, y, w: 2.8, h: 0.5, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      s.addShape(pres.shapes.RECTANGLE, { x: cx - lo * sc, y: y + 0.07, w: lo * sc, h: 0.36, fill: { color: key ? NAVY : G3 }, line: { type: 'none' } });
      s.addShape(pres.shapes.RECTANGLE, { x: cx, y: y + 0.07, w: hi * sc, h: 0.36, fill: { color: key ? NAVY : G3 }, line: { type: 'none' } });
      txt(s, '−' + lo, { x: cx - lo * sc - 0.75, y, w: 0.7, h: 0.5, align: 'right', valign: 'middle', fontFace: 'Arial', bold: key, color: key ? NAVY : BLACK });
      txt(s, '＋' + hi, { x: cx + hi * sc + 0.05, y, w: 0.7, h: 0.5, valign: 'middle', fontFace: 'Arial', bold: key, color: key ? NAVY : BLACK });
    });
    line(s, cx, top + 0.1, 0, 4.25, G2, 1);
    txt(s, '基本ケース', { x: cx - 0.8, y: top + 4.4, w: 1.6, h: 0.3, align: 'center', color: G1 });
  }

  // ---------- P29 計算ロジック（ドライバーの式） ----------
  {
    const s = frame('P29', '3　打ち手', '収支の赤字【数値A】は、利用者数×単価で決まる収入が費用を下回るためである。黒字化には利用者数を【数値C】増やす必要がある', '収支の計算ロジック', '（【単位】、【年度】）',
      '使う場面：結論の数字がどの数字の掛け算・足し算で決まるかを示す。演算子（＝×−＋）を明記し、各箱に値を書く。動かすべきドライバーだけ紺。\n差し替え：各ドライバーの名前と値、演算子。');
    const box = (x, y, w, name, val, key) => {
      rect(s, x, y, w, 1.0, { line: { color: key ? NAVY : G2, width: key ? 1.75 : 0.75 } });
      txt(s, name, { x: x + 0.1, y: y + 0.1, w: w - 0.2, h: 0.32, align: 'center', color: key ? NAVY : G1, bold: key });
      txt(s, val, { x: x + 0.1, y: y + 0.45, w: w - 0.2, h: 0.45, align: 'center', fontSize: 18, bold: true, color: key ? NAVY : BLACK });
    };
    const op = (x, y, t) => txt(s, t, { x, y, w: 0.5, h: 1.0, align: 'center', valign: 'middle', fontSize: 20, bold: true, color: G1 });
    const bw = 2.0;
    box(L, 2.3, bw, '収支', '−【数値A】', false); op(L + bw, 2.3, '＝');
    box(L + bw + 0.5, 2.3, bw, '収入', '【数値】', false); op(L + 2 * bw + 0.5, 2.3, '−');
    box(L + 2 * bw + 1.0, 2.3, bw, '費用', '【数値】', false);
    const x2 = L + bw + 0.5;
    line(s, x2 + bw / 2, 3.3, 0, 0.5, G3, 0.75);
    box(L + 0.6, 3.8 + 0.2, bw, '利用者数', '【数値】人', true); op(L + 0.6 + bw, 4.0, '×');
    box(L + 1.1 + bw, 4.0, bw, '単価', '【数値】円', false);
    line(s, L + 0.6 + bw / 2, 3.8, (L + 1.1 + bw + bw / 2) - (L + 0.6 + bw / 2), 0, G3, 0.75);
    line(s, L + 0.6 + bw / 2, 3.8, 0, 0.2, G3, 0.75); line(s, L + 1.1 + bw + bw / 2, 3.8, 0, 0.2, G3, 0.75);
    const x3 = L + 2 * bw + 1.0;
    line(s, x3 + bw / 2, 3.3, 0, 0.5, G3, 0.75);
    box(x3 + 0.3, 4.0, 1.6, '人件費', '【数値】', false); op(x3 + 1.9, 4.0, '＋');
    box(x3 + 2.4, 4.0, 1.6, '設備費', '【数値】', false);
    line(s, x3 + 1.1, 3.8, 2.4, 0, G3, 0.75); line(s, x3 + 1.1, 3.8, 0, 0.2, G3, 0.75); line(s, x3 + 3.5, 3.8, 0, 0.2, G3, 0.75);
    txt(s, '黒字化に必要な利用者数：＋【数値C】人（単価据え置きの場合）', { x: L, y: 5.5, w: W, h: 0.35, bold: true, color: NAVY });
  }

  // ---------- P30 リスク一覧 ----------
  {
    const s = frame('P30', '4　実行計画', '最も影響が大きいリスクは【リスク1】である。兆候を【時期】から毎月確認し、発生時はすぐ【打ち手】に切り替えられるよう備える', '主なリスクと対応', '（影響度：●大　◑中　○小）',
      '使う場面：リスク・兆候・打ち手を一覧で示す。影響度の大きい順に並べる。最も影響の大きいリスクの行だけ紺。\n差し替え：リスク、兆候（何を見れば分かるか）、影響度、打ち手。');
    const head = ['リスク', '兆候（何を見るか）', '影響度', '打ち手'];
    const rows = [['【リスク1】利用者が想定を下回る', '月次の利用者数が計画比90%未満', '●', '【打ち手1】に切り替える'], ['【リスク2】費用が膨らむ', '四半期の費用が予算比110%超', '◑', '【打ち手2】で調達を見直す'], ['【リスク3】関係者の合意が遅れる', '協議の開催が計画から1か月遅延', '◑', '【主体】から働きかける'], ['【リスク4】担い手が集まらない', '応募数が募集枠の半数未満', '○', '外部委託で補う']];
    const data = [head.map((h, j) => cell(h, { bold: true, align: j === 2 ? 'center' : 'left', border: bottom(G2, 1) }))]
      .concat(rows.map((r, i) => r.map((c, j) => cell(c, { align: j === 2 ? 'center' : 'left', fontSize: j === 2 ? 20 : 14, bold: i === 0 && j !== 2, color: i === 0 ? NAVY : (j === 2 ? G2 : BLACK), border: bottom() }))));
    s.addTable(data, { x: L, y: 2.1, w: W, colW: [3.3, 3.1, 1.0, W - 7.4], rowH: [0.5, 0.95, 0.95, 0.95, 0.95] });
  }

  // ---------- P31 ヒートマップ表 ----------
  {
    const s = frame('P31', '1　現状', '【地域C】は需要・採算・担い手のいずれも弱く、課題が集中している。支援の優先順位は【地域C】を最上位に置くべきである', '地域別・観点別の状況', '（色が濃いほど課題が大きい、【年度】）',
      '使う場面：多数の項目×観点の強弱を一覧で示す。濃淡はグレー3段階、最も言いたい行（または列）だけ紺の枠で囲む。凡例で濃淡の意味を書く。\n差し替え：行・列の名前、各セルの水準（1〜3）。');
    const cols = ['需要', '採算', '担い手', '設備', '連携'];
    const rows = [['地域A', [1, 1, 2, 1, 1]], ['地域B', [2, 1, 1, 2, 1]], ['地域C', [3, 3, 3, 2, 2]], ['地域D', [1, 2, 1, 1, 2]], ['地域E', [2, 2, 1, 3, 1]], ['地域F', [1, 1, 2, 2, 1]]];
    const shade = { 1: G5, 2: G3, 3: G2 }, lx = L, lw = 1.8, cw = 1.25, top = 2.15, rh = 0.62;
    cols.forEach((c, j) => txt(s, c, { x: lx + lw + j * cw, y: top, w: cw, h: 0.35, align: 'center', bold: true }));
    rows.forEach(([n, v], i) => {
      const y = top + 0.45 + i * rh, key = i === 2;
      txt(s, n, { x: lx, y, w: lw - 0.1, h: rh - 0.06, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      v.forEach((lv, j) => s.addShape(pres.shapes.RECTANGLE, { x: lx + lw + j * cw + 0.03, y: y + 0.03, w: cw - 0.06, h: rh - 0.06, fill: { color: shade[lv] }, line: { type: 'none' } }));
    });
    s.addShape(pres.shapes.RECTANGLE, { x: lx - 0.05, y: top + 0.45 + 2 * rh - 0.02, w: lw + 5 * cw + 0.1, h: rh + 0.04, fill: { type: 'none' }, line: { color: NAVY, width: 1.75 } });
    const gx = lx + lw + 5 * cw + 0.5;
    [['課題 大', G2], ['課題 中', G3], ['課題 小', G5]].forEach(([t, c], i) => {
      s.addShape(pres.shapes.RECTANGLE, { x: gx, y: top + 0.5 + i * 0.5, w: 0.35, h: 0.3, fill: { color: c }, line: { type: 'none' } });
      txt(s, t, { x: gx + 0.45, y: top + 0.47 + i * 0.5, w: 1.6, h: 0.35, color: G1 });
    });
    txt(s, '【地域C】は5観点中3観点で課題が大きい', { x: gx, y: 4.6, w: R - gx, h: 0.95, bold: true, color: NAVY });
  }

  // ---------- P32 意思決定ページ ----------
  {
    const s = frame('P32', '5　ご判断いただきたい事項', '本日は【論点】について【案B】の採用をご判断いただきたい。【案B】は費用と効果の釣り合いが最も良く、【年度】に効果が出る', null, null,
      '使う場面：会議で判断を求める。決めてほしいこと・選択肢と推奨・判断に必要な前提・決めた後の動きを1枚に。推奨案と「決めてほしいこと」だけ紺。依頼や合意事項がない資料では使わない。\n差し替え：論点、案、推奨理由、前提、期限。');
    s.addShape(pres.shapes.RECTANGLE, { x: L, y: BODY_Y, w: W - 0.9, h: 0.75, fill: { color: BLUE5 }, line: { color: NAVY, width: 1.25 } });
    txt(s, '決めていただきたいこと', { x: L + 0.2, y: BODY_Y, w: 2.6, h: 0.75, valign: 'middle', bold: true, color: NAVY });
    txt(s, '【論点】について、【案B】を採用し、【時期】に着手すること', { x: L + 2.9, y: BODY_Y, w: W - 4.0, h: 0.75, valign: 'middle', bold: true, color: NAVY });
    const lw = 5.6;
    txt(s, '選択肢', { x: L, y: 2.55, w: lw, h: 0.3, bold: true }); line(s, L, 2.89, lw, 0, G3, 0.5);
    [['案A', '【内容】', '費用 小／効果 小', false], ['案B（推奨）', '【内容】', '費用 中／効果 大', true], ['案C', '【内容】', '費用 大／効果 大', false]].forEach(([n, d, e, key], i) => {
      const y = 3.0 + i * 0.95;
      txt(s, n, { x: L, y, w: 1.6, h: 0.75, valign: 'middle', bold: true, color: key ? NAVY : BLACK });
      txt(s, d, { x: L + 1.65, y, w: 1.7, h: 0.75, valign: 'middle', color: key ? NAVY : BLACK });
      txt(s, e, { x: L + 3.4, y, w: lw - 3.4, h: 0.75, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      line(s, L, y + 0.85, lw, 0, G4, 0.75);
    });
    s.addShape(pres.shapes.RECTANGLE, { x: L - 0.05, y: 3.95, w: lw + 0.1, h: 0.85, fill: { type: 'none' }, line: { color: NAVY, width: 1.5 } });
    const rx = L + lw + 0.4, rw = R - rx;
    txt(s, '判断の前提', { x: rx, y: 2.55, w: rw, h: 0.3, bold: true }); line(s, rx, 2.89, rw, 0, G3, 0.5);
    txt(s, '・予算の上限は【数値】\n・【条件】が満たされること\n・効果の算定方法は参考資料p.【X】', { x: rx, y: 3.0, w: rw, h: 1.3 });
    txt(s, '決定後の動き', { x: rx, y: 4.45, w: rw, h: 0.3, bold: true }); line(s, rx, 4.79, rw, 0, G3, 0.5);
    txt(s, '【時期】　体制の立ち上げ\n【時期】　試行の開始\n【時期】　効果の中間報告', { x: rx, y: 4.9, w: rw, h: 1.3 });
  }

  // ---------- P33 小図の並列（スモールマルチプル） ----------
  {
    const s = frame('P33', '1　現状', '【指標】が減り続けているのは4地域中【地域C】だけで、他は横ばいか増加である。【地域C】に固有の要因を特定する必要がある', '地域別の【指標】の推移', '（【単位】、2015–2025年度、縦軸はすべて同じ目盛り）',
      '使う場面：同じ図法・同じ目盛りで、切り口違い（地域・事業・顧客層）を並べて比べる。目盛りは必ずそろえる。注目の1枚だけ紺、他はグレー。\n差し替え：各小図のデータと見出し。');
    const labels = ['15', '17', '19', '21', '23', '25'];
    const sets = [['地域A', [60, 62, 61, 63, 64, 66], false], ['地域B', [55, 54, 56, 55, 57, 58], false], ['地域C', [70, 64, 58, 52, 47, 41], true], ['地域D', [40, 41, 43, 46, 49, 52], false]];
    const cw = (W - 0.6) / 4;
    sets.forEach(([n, v, key], i) => {
      const x = L + i * (cw + 0.2);
      txt(s, n, { x, y: 2.15, w: cw, h: 0.32, align: 'center', bold: true, color: key ? NAVY : BLACK });
      s.addChart(pres.charts.BAR, [{ name: n, labels, values: v }], Object.assign({}, chartBase, { x, y: 2.55, w: cw, h: 3.6, barDir: 'col', barGapWidthPct: 50, chartColors: [key ? NAVY : G3], showValue: false, valAxisMinVal: 0, valAxisMaxVal: 80, catAxisLabelFontSize: 14 }));
      txt(s, (v[5] - v[0] >= 0 ? '＋' : '−') + Math.abs(v[5] - v[0]), { x, y: 6.2, w: cw, h: 0.35, align: 'center', fontFace: 'Arial', bold: true, color: key ? NAVY : G1 });
    });
  }
};
