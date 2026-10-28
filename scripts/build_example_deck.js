// 通しの完成例：架空の地方鉄道「みなと鉄道」の運営形態の見直し（24枚）
// 路線・数値はすべて架空。数値は互いに整合するよう設計し、計算値は検算済み（docs/example-calc.md 参照）。
module.exports = function ({ pres, frame, txt, line, rect, head, rowRule, bullets, chartBase, C, readout, PANEL_W }) {
  const { F, NAVY, BLACK, G1, G2, G3, G4, G5, WHITE, L, R, W, BODY_Y, BLUE5 } = C;
  const SRC = '注）路線・数値はすべて架空の完成例\n出所）架空のデータを基に作成';
  const OPT = (src) => ({ sticker: '架空の例', rawNotes: true, source: src === undefined ? SRC : src });
  const N = (type, ev, memo) => `完成例（架空）\n使用した型：${type}\nエビデンスID：${ev}${memo ? '\n' + memo : ''}`;
  const arrow = (s, x, y, w, h, color, width) => s.addShape(pres.shapes.LINE, { x, y, w, h, line: { color: color || G2, width: width || 1, endArrowType: 'triangle' } });
  const cell = (t, o) => ({ text: t, options: Object.assign({ fontFace: F, fontSize: 14, valign: 'middle', color: BLACK }, o) });
  const bottom = (c, w) => [{ type: 'none' }, { type: 'none' }, { pt: w || 0.75, color: c || G4 }, { type: 'none' }];
  const none = [{ type: 'none' }, { type: 'none' }, { type: 'none' }, { type: 'none' }];
  const box = (s, x, y, w, h, t, key, o) => { rect(s, x, y, w, h, { line: { color: key ? NAVY : G3, width: key ? 1.5 : 0.75 } }); txt(s, t, Object.assign({ x: x + 0.12, y, w: w - 0.24, h, valign: 'middle', align: 'center', bold: key, color: key ? NAVY : BLACK }, o || {})); };
  const CH = ['1　現状：利用と沿線の変化', '2　課題：収支悪化の構造', '3　打ち手：運営形態の選択', '4　実行計画とご判断いただきたい事項'];

  const divider = (idx, msg) => {
    const s = frame('EX', '目次', msg, null, null, N('P02（章扉）', '―'), OPT(''));
    CH.forEach((t, i) => {
      const y = 1.9 + i * 1.05, cur = i === idx;
      txt(s, String(i + 1).padStart(2, '0'), { x: L + 0.3, y, w: 0.8, h: 0.6, fontSize: 22, bold: true, fontFace: 'Arial', color: cur ? NAVY : G3, valign: 'middle' });
      txt(s, t.slice(2), { x: L + 1.3, y, w: 8.5, h: 0.6, fontSize: 18, bold: cur, color: cur ? NAVY : G2, valign: 'middle' });
      line(s, L + 0.3, y + 0.82, W - 0.6, 0, G4, 0.75);
    });
  };

  // ---------- 部扉 ----------
  {
    const s = pres.addSlide();
    txt(s, '完成例', { x: 0.8, y: 2.2, w: 9, h: 0.5, fontSize: 18, color: G1 });
    txt(s, '架空の地方鉄道「みなと鉄道」の運営形態の見直し', { x: 0.8, y: 2.75, w: 9.5, h: 0.8, fontSize: 28, bold: true, color: NAVY });
    line(s, 0.8, 3.7, 9.2, 0, G3, 0.75);
    txt(s, '型の見本を組み合わせて、表紙から判断事項までを通した24枚の完成例。\nメッセージラインのつながり、章の切り替え、エグゼクティブサマリーと本文の対応を確かめるための手本として使う。\n路線・数値はすべて架空。数値は互いに整合するよう設計している。', { x: 0.8, y: 3.9, w: 9.4, h: 1.6, fontSize: 14, color: G1 });
    s.addNotes('使用した型：P02（部扉）\n完成例の部扉。案件で使う場合は削除する。');
  }

  // ---------- E01 表紙 ----------
  {
    const s = pres.addSlide();
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 2.3, w: 0.07, h: 1.5, fill: { color: NAVY }, line: { type: 'none' } });
    txt(s, 'みなと鉄道の持続可能な運営形態について', { x: 1.05, y: 2.3, w: 9, h: 0.9, fontSize: 28, bold: true, color: NAVY });
    txt(s, '上下分離への移行に関する検討結果（最終報告）', { x: 1.05, y: 3.2, w: 9, h: 0.5, fontSize: 18 });
    txt(s, '2026年10月\nみなと鉄道沿線地域公共交通活性化協議会　事務局', { x: 1.05, y: 5.2, w: 9, h: 0.8, fontSize: 14, color: G1 });
    txt(s, '架空の例', { x: R - 1.05, y: 0.4, w: 1.05, h: 0.26, fontSize: 11, color: G1, align: 'center', valign: 'middle', line: { color: G3, width: 0.75 } });
    s.addNotes(N('表紙', '―'));
  }

  // ---------- E02 エグゼクティブサマリー ----------
  {
    const s = frame('EX', '00　エグゼクティブサマリー', 'みなと鉄道の赤字は10年で2.5倍の年5.2億円に拡大した。上下分離に移行すれば、自治体の実質負担は年2.2億円に抑えられる', null, null,
      N('P01 エグゼクティブサマリー', 'E-01〜E-12（各章の根拠）'), OPT('注）赤字は営業損失（2024年度決算）\n出所）みなと鉄道「決算書」（各年度）を基に作成（架空の完成例）'));
    const rows = [['現状', '輸送人員は10年で25%減り、年158万人となった', '通学の減少が大きく、沿線人口は2050年までに3割減る見通し'],
      ['課題', '赤字は10年で3.1億円増え、年5.2億円に拡大した', '増加分の6割は運賃収入の減少。黒字化には輸送人員1.6倍が必要'],
      ['打ち手', '3案のうち上下分離が、負担と利便性の両面で最も優れる', '自治体の実質負担は年2.2億円で、現行の補填の3分の1にとどまる']];
    let y = 1.66;
    rows.forEach(([k, a, b], i) => {
      txt(s, k, { x: L, y: y + 0.06, w: 1.1, h: 0.34, bold: true, color: G1 });
      txt(s, a, { x: L + 1.3, y: y + 0.06, w: W - 1.3, h: 0.34, bold: true });
      txt(s, b, { x: L + 1.3, y: y + 0.46, w: W - 1.3, h: 0.34, color: G1 });
      if (i < rows.length - 1) rowRule(s, L, y + 1.15, W);
      y += 1.27;
    });
    line(s, L, y + 0.05, W, 0, NAVY, 1.5);
    txt(s, '提言', { x: L, y: y + 0.23, w: 1.1, h: 0.32, bold: true, color: NAVY });
    txt(s, '上下分離（案B）を基本方針とし、2026年度に法定協議会を設けて実施計画を策定する。2028年4月の移行を目指し、並行して増収策で鉄道会社の収支を黒字にする', { x: L + 1.3, y: y + 0.23, w: W - 1.3, h: 1.0, bold: true, color: NAVY });
  }

  // ---------- E03 全体マップ ----------
  {
    const s = frame('EX', '0　全体像', '本報告は「どの運営形態を選ぶべきか」に4章で答える。結論を左右するのは第3章の運営形態の比較であり、ここに最も紙幅を割く', '本報告の構成', null,
      N('P34 全体マップ', '―'), OPT(''));
    const data = [['章', '答える問い', '主な分析', 'ページ'].map((h, j) => cell(h, { bold: true, align: j === 3 ? 'center' : 'left', border: bottom(G2, 1) }))]
      .concat([['1　現状', '利用と沿線はどう変わったか', '輸送人員・利用者構成・人口推計・住民アンケート', '5–9'], ['2　課題', 'なぜ赤字が拡大したか', '要因分解・費用比較・計算ロジック・感度分析', '10–14'], ['3　打ち手', 'どの運営形態を選ぶべきか', '3案の評価・上下分離の仕組み・負担比較・増収策', '15–19'], ['4　実行計画', 'いつ何を決め、何をするか', 'ロードマップ・効果・リスク・判断事項', '20–24']]
        .map((r, i) => r.map((c, j) => cell(c, { align: j === 3 ? 'center' : 'left', bold: i === 2 && j < 2, color: i === 2 ? NAVY : BLACK, fontFace: j === 3 ? 'Arial' : F, border: i < 3 ? bottom() : none }))));
    s.addTable(data, { x: L, y: 2.15, w: W, colW: [1.9, 3.3, W - 6.4, 1.2], rowH: [0.45, 1.0, 1.0, 1.0, 1.0] });
  }

  // ---------- E04 調査の概要 ----------
  {
    const s = frame('EX', '0　全体像', '結論は、ヒアリング32件、住民アンケート1,200件、10年分の運行・決算データの3つの調査に基づき、定量と定性の両面で裏付けている', '調査の概要', null,
      N('P49 調査の土台', 'E-00'), OPT('出所）関係者ヒアリング（2026年4〜6月、32件）、沿線住民アンケート（2026年5月）を基に作成（架空の完成例）'));
    const lw = 1.3, cw = (W - lw - 0.6) / 3;
    [['関係者ヒアリング', '32', '件', '沿線3市・県・事業者・学校・利用者団体', '2026年4〜6月', '第2章・第3章', false], ['沿線住民アンケート', '1,200', '件', '無作為抽出の3,000人に郵送', '2026年5月、回収率40%', '第1章（存続の意向）', true], ['運行・決算データ', '10', '年分', '駅別乗降・定期券種別・費目別決算', '2014〜2024年度', '第1章・第2章', false]].forEach(([n, v, u, who, when, used, key], i) => {
      const x = L + lw + i * (cw + 0.3);
      head(s, x, 2.08, cw, n, { key });
      txt(s, [{ text: v, options: { fontSize: 40, bold: true, fontFace: 'Arial', color: key ? NAVY : BLACK } }, { text: ' ' + u, options: { fontSize: 16, color: G1 } }], { x, y: 2.55, w: cw, h: 1.0, valign: 'middle' });
      [who, when, used].forEach((t, j) => txt(s, t, { x, y: 3.85 + j * 0.85, w: cw, h: 0.7, valign: 'middle', bold: key && j === 2, color: key && j === 2 ? NAVY : BLACK }));
    });
    ['対象', '時期', '使った章'].forEach((k, j) => { txt(s, k, { x: L, y: 3.85 + j * 0.85, w: lw - 0.1, h: 0.7, valign: 'middle', bold: true, color: G1 }); rowRule(s, L, 3.78 + j * 0.85, W); });
  }

  // ---------- 第1章 ----------
  divider(0, '第1章では、利用と沿線の変化を示す。輸送人員は減り続けているが、住民の約7割は存続を望んでおり、廃止は選択肢になりにくい');

  // E06 輸送人員の推移
  {
    const s = frame('EX', CH[0], '輸送人員は10年で25%減り、2024年度は158万人となった。2020年度の落ち込みから回復しつつあるが、減少は構造的である', '輸送人員の推移', '（万人、2014–2024年度）',
      N('P03 縦棒の時系列＋CAGR', 'E-01（運行データ）', '検算：158÷210＝0.752（25%減）、年平均−2.8%'), OPT('注）輸送人員は定期・定期外の合計。2020年度は感染症の影響を含む\n出所）みなと鉄道「鉄道統計年報」提出資料（各年度）を基に作成（架空の完成例）'));
    const labels = ['2014', '2016', '2018', '2020', '2022', '2024'];
    s.addChart(pres.charts.BAR, [{ name: '過去', labels, values: [210, 198, 186, 131, 152, 0] }, { name: '直近', labels, values: [0, 0, 0, 0, 0, 158] }],
      Object.assign({}, chartBase, { x: L, y: 2.15, w: W - PANEL_W - 0.25, h: 4.5, barDir: 'col', barGrouping: 'stacked', barGapWidthPct: 40, chartColors: [G3, NAVY], showValue: true, dataLabelPosition: 'inEnd', dataLabelColor: WHITE, dataLabelFormatCode: '#,##0;;', valAxisMinVal: 0, valAxisMaxVal: 240 }));
    arrow(s, L + 0.9, 2.6, 5.2, 0, NAVY, 1.25);
    txt(s, '年平均 −2.8%（10年で−25%）', { x: L + 1.2, y: 2.2, w: 4.6, h: 0.32, bold: true, color: NAVY, align: 'center', fontSize: 12 });
    readout(s, [['10年で52万人減った（−25%）', '2014年度の210万人から2024年度は158万人へ。年平均で2.8%ずつ減っている'],
      ['感染症前の水準には戻らない', '2020年度の131万人から持ち直したが、2024年度の158万人は2018年度（186万人）を15%下回る']]);
  }

  // E07 利用者構成
  {
    const s = frame('EX', CH[0], '通学の比率は10年で6ポイント下がり、通院・買物と観光が増えた。少子化で通学は今後も減るため、日中の利用を伸ばす転換が要る', '目的別の利用者構成', '（%、2014年度と2024年度）',
      N('P05 100%積上げ', 'E-02（定期券種別データ・アンケート）'), OPT('注）利用目的は駅での聞き取り調査（各年度10月の平日）\n出所）みなと鉄道 利用実態調査を基に作成（架空の完成例）'));
    const labels = ['2014年度', '2024年度'];
    s.addChart(pres.charts.BAR, [{ name: '通学', labels, values: [52, 46] }, { name: '通勤', labels, values: [30, 28] }, { name: '通院・買物', labels, values: [12, 16] }, { name: '観光', labels, values: [6, 10] }],
      Object.assign({}, chartBase, { x: L, y: 2.1, w: 4.4, h: 4.55, barDir: 'col', barGrouping: 'percentStacked', barGapWidthPct: 40, chartColors: [NAVY, '7F7F7F', 'CCCCCC', 'E0EEF8'], showValue: true, dataLabelPosition: 'ctr', dataLabelColor: WHITE }));
    [['観光', 2.45, false], ['通院・買物', 2.95, false], ['通勤', 3.75, false], ['通学', 5.15, true]].forEach(([n, y, key]) => txt(s, n, { x: L + 4.5, y, w: 1.25, h: 0.3, bold: key, color: key ? NAVY : BLACK, fontSize: 12 }));
    txt(s, '−6pt', { x: L + 5.8, y: 5.15, w: 0.8, h: 0.3, bold: true, color: NAVY, fontFace: 'Arial', fontSize: 12 });
    txt(s, '＋4pt', { x: L + 5.8, y: 2.45, w: 0.8, h: 0.3, color: G1, fontFace: 'Arial', fontSize: 12 });
    txt(s, '＋4pt', { x: L + 5.8, y: 2.95, w: 0.8, h: 0.3, color: G1, fontFace: 'Arial', fontSize: 12 });
    readout(s, [['通学は10年で6pt下がった', '通学の利用は2014年度の109万人から2024年度は73万人へ。沿線の高校生の減少による'],
      ['日中の通院・買物と観光が伸びた', '通院・買物も観光も＋4pt。日中の便を増やせば、さらに伸ばせる余地がある']]);
  }

  // E08 シナリオ
  {
    const s = frame('EX', CH[0], '輸送人員は基本シナリオでも2045年度に118万人まで減り、楽観シナリオでも1割以上減る。利用の自然回復には期待できない', null, null,
      N('P27 シナリオ比較', 'E-03（将来人口推計）・E-01'), OPT('注）路線・数値はすべて架空の完成例。2025年度は推計の起点\n出所）架空の将来人口推計を基に作成'));
    const lw = 6.0;
    head(s, L, BODY_Y, lw, '輸送人員の見通し（万人、2025–2045年度（予測））');
    const labels = ['2025', '2030', '2035', '2040', '2045'];
    s.addChart(pres.charts.LINE, [{ name: '楽観', labels, values: [158, 154, 150, 145, 140] }, { name: '基本', labels, values: [158, 148, 138, 128, 118] }, { name: '悲観', labels, values: [158, 142, 126, 110, 95] }],
      Object.assign({}, chartBase, { x: L, y: 2.05, w: lw - 0.9, h: 4.55, chartColors: [G3, NAVY, G2], lineSize: 2, lineDataSymbol: 'none', valAxisHidden: false, valAxisLabelFontSize: 12, valAxisLabelColor: G1, valAxisLineShow: false, valAxisMinVal: 80, valAxisMaxVal: 170 }));
    txt(s, '楽観 140', { x: L + lw - 0.95, y: 2.75, w: 1.0, h: 0.3, color: G1 });
    txt(s, '基本 118', { x: L + lw - 0.95, y: 3.75, w: 1.0, h: 0.3, bold: true, color: NAVY });
    txt(s, '悲観 95', { x: L + lw - 0.95, y: 4.8, w: 1.0, h: 0.3, color: G1 });
    const rx = L + lw + 0.3, rw = R - rx;
    head(s, rx, BODY_Y, rw, '各シナリオの前提（2045年度）');
    const data = [[cell('', { border: bottom(G2, 1) }), cell('沿線人口', { bold: true, align: 'center', border: bottom(G2, 1) }), cell('利用率', { bold: true, align: 'center', border: bottom(G2, 1) })]]
      .concat([['楽観', '−20%', '＋2pt'], ['基本', '−25%', '±0pt'], ['悲観', '−30%', '−2pt']].map((r, i) => r.map((c, j) => cell(c, { align: j === 0 ? 'left' : 'center', fontFace: j === 0 ? F : 'Arial', bold: i === 1, color: i === 1 ? NAVY : BLACK, border: i < 2 ? bottom() : none }))));
    s.addTable(data, { x: rx, y: 2.15, w: rw, colW: [1.0, (rw - 1.0) / 2, (rw - 1.0) / 2], rowH: [0.5, 0.7, 0.7, 0.7] });
    rowRule(s, rx, 4.95, rw);
    txt(s, '沿線人口は2020年の8.4万人から、2045年に6.3万人へ減る（基本）', { x: rx, y: 5.1, w: rw, h: 0.7 });
  }

  // E09 アンケート
  {
    const s = frame('EX', CH[0], '沿線住民の68%が存続を望み、10〜20代と70代以上では7割を超える。日常の足として必要とする層が明確で、廃止は合意を得にくい', '「みなと鉄道は存続すべきだと思うか」への回答', '（%、n＝1,200、2026年5月）',
      N('P18 アンケート結果', 'E-04（沿線住民アンケート）', '検算：全体 41＋27＝68%'), OPT('注）設問「みなと鉄道を今後も残すべきだと思いますか」。無回答を除く\n出所）沿線住民アンケート（2026年5月、n＝1,200）を基に作成（架空の完成例）'));
    const labels = ['全体', '10〜20代', '30〜40代', '50〜60代', '70代以上'].reverse();
    s.addChart(pres.charts.BAR, [
      { name: 'そう思う', labels, values: [41, 48, 35, 37, 45].reverse() }, { name: 'ややそう思う', labels, values: [27, 22, 27, 28, 29].reverse() },
      { name: 'どちらでもない', labels, values: [18, 16, 22, 20, 15].reverse() }, { name: 'そう思わない', labels, values: [14, 14, 16, 15, 11].reverse() },
    ], Object.assign({}, chartBase, { x: L, y: 2.5, w: W - PANEL_W - 0.25, h: 4.15, barDir: 'bar', barGrouping: 'percentStacked', barGapWidthPct: 40, chartColors: [NAVY, '7F7F7F', 'CCCCCC', 'E0EEF8'], showValue: true, dataLabelPosition: 'ctr', dataLabelColor: WHITE }));
    [['そう思う', NAVY], ['ややそう思う', '7F7F7F'], ['どちらでもない', 'CCCCCC'], ['そう思わない', 'E0EEF8']].forEach(([n, c], i) => { const x = L + 0.75 + i * 1.5; s.addShape(pres.shapes.RECTANGLE, { x, y: 2.17, w: 0.18, h: 0.18, fill: { color: c }, line: { type: 'none' } }); txt(s, n, { x: x + 0.24, y: 2.11, w: 1.3, h: 0.3, color: i === 0 ? NAVY : BLACK, bold: i === 0, fontSize: 12 }); });
    readout(s, [['存続を望むのは68%', '「そう思う」41%と「ややそう思う」27%の計。「そう思わない」は14%にとどまる'],
      ['10〜20代と70代以上は7割以上', '通学と通院で日常的に使う層。この2つの層の足を確保できるかが、合意の前提になる']]);
  }

  // ---------- 第2章 ----------
  divider(1, '第2章では、赤字が10年で2.5倍に拡大した要因を示す。主因は運賃収入の減少であり、費用削減だけでは黒字化できない');

  // E11 ウォーターフォール
  {
    const s = frame('EX', CH[1], '赤字は10年で3.1億円増えて年5.2億円となり、増加分の6割は運賃収入の減少による。修繕費も0.8億円増え、施設の老朽化が重い', '営業損失の増減要因', '（億円、2014年度→2024年度）',
      N('P06 ウォーターフォール', 'E-05（費目別決算）', '検算：2.1＋1.9＋0.8＋0.5＋0.2−0.3＝5.2、1.9÷3.1＝61%'), OPT('注）営業損失の増減を費目別に分解。運賃収入の減少は損失の増加要因として表示\n出所）みなと鉄道「決算書」（2014・2024年度）を基に作成（架空の完成例）'));
    const items = [['2014年度\n赤字', 2.1, 'total'], ['運賃収入\nの減少', 1.9, 'key'], ['修繕費\nの増加', 0.8, 'n'], ['動力費\nの増加', 0.5, 'n'], ['人件費\nの増加', 0.2, 'n'], ['その他', -0.3, 'n'], ['2024年度\n赤字', 5.2, 'total']];
    const x0 = L + 0.2, bw = 0.95, gap = 0.42, base = 6.0, scale = 0.62;
    let level = 0;
    items.forEach(([name, v, kind], i) => {
      const x = x0 + i * (bw + gap);
      let top, h;
      if (kind === 'total') { top = base - v * scale; h = v * scale; level = v; } else { const nl = level + v; top = base - Math.max(level, nl) * scale; h = Math.abs(v) * scale; level = nl; }
      s.addShape(pres.shapes.RECTANGLE, { x, y: top, w: bw, h, fill: { color: kind === 'total' ? G2 : kind === 'key' ? NAVY : G3 }, line: { type: 'none' } });
      const lbl = kind === 'total' ? v.toFixed(1) : (v > 0 ? '＋' + v.toFixed(1) : '−' + Math.abs(v).toFixed(1));
      txt(s, lbl, { x, y: top - 0.32, w: bw, h: 0.28, align: 'center', fontFace: 'Arial', bold: kind === 'key', color: kind === 'key' ? NAVY : BLACK });
      txt(s, name, { x: x - 0.15, y: base + 0.08, w: bw + 0.3, h: 0.6, align: 'center' });
      if (i < items.length - 1) s.addShape(pres.shapes.LINE, { x: x + bw, y: base - level * scale, w: gap, h: 0, line: { color: G3, width: 0.5, dashType: 'dash' } });
    });
    line(s, L, base, W, 0, G3, 0.75);
  }

  // E12 大型数値の対比
  {
    const s = frame('EX', CH[1], '1人当たりの営業費用は937円で、同規模の地方鉄道の平均620円の1.5倍に達する。利用の減少に費用の削減が追いついていない', null, null,
      N('P38 大型数値の対比', 'E-05・E-06（同規模事業者の公表決算）', '検算：14.8億円÷158万人＝937円、937÷620＝1.51。内訳 6.9億÷158万＝437、3.2億÷158万＝203、残り297。差 107＋83＝190（317の60%）'), OPT('注）1人当たり営業費用＝営業費用÷輸送人員。平均は営業距離20〜40kmの10社\n出所）国土交通省「鉄道統計年報」（2024年度）を基に作成（架空の完成例）'));
    const cw = (W - 1.2) / 2;
    [['みなと鉄道', '937', [['人件費', '437'], ['修繕費', '203'], ['その他（減価償却・動力ほか）', '297']], true], ['同規模10社の平均', '620', [['人件費', '330'], ['修繕費', '120'], ['その他（減価償却・動力ほか）', '170']], false]].forEach(([n, v, br, key], i) => {
      const x = L + i * (cw + 1.2);
      head(s, x, BODY_Y + 0.05, cw, n, { key, align: 'center' });
      txt(s, [{ text: v, options: { fontSize: 54, bold: true, color: key ? NAVY : G2 } }, { text: '  円／人', options: { fontSize: 16, color: G1 } }], { x, y: 2.15, w: cw, h: 1.3, align: 'center', valign: 'middle', fontFace: 'Arial' });
      txt(s, '内訳', { x, y: 3.65, w: cw, h: 0.3, bold: true, color: G1 });
      rowRule(s, x, 4.02, cw);
      br.forEach(([k, b], j) => {
        txt(s, k, { x, y: 4.12 + j * 0.5, w: cw - 1.1, h: 0.42, valign: 'middle' });
        txt(s, b + ' 円', { x: x + cw - 1.1, y: 4.12 + j * 0.5, w: 1.1, h: 0.42, valign: 'middle', align: 'right', fontFace: 'Arial', bold: key && j < 2, color: key && j < 2 ? NAVY : BLACK });
      });
    });
    txt(s, '×1.5', { x: L + cw, y: 2.45, w: 1.2, h: 0.6, align: 'center', valign: 'middle', fontSize: 22, bold: true, color: NAVY, fontFace: 'Arial' });
    rowRule(s, L, 5.75, W);
    txt(s, '差317円の6割は人件費と修繕費（＋107円、＋83円）による', { x: L, y: 5.85, w: W, h: 0.35, bold: true, color: NAVY, align: 'center' });
    txt(s, '補足：1人当たり営業費用＝営業費用÷輸送人員（2024年度）。平均は営業距離20〜40kmの10社の単純平均', { x: L, y: 6.3, w: W, h: 0.3, fontSize: 11, color: G1, align: 'center' });
  }

  // E13 計算ロジック
  {
    const s = frame('EX', CH[1], '赤字5.2億円は、運賃収入8.1億円が費用14.8億円を大きく下回るためである。黒字化には輸送人員を現在の1.6倍に増やす必要がある', '収支の計算ロジック', '（2024年度）',
      N('P29 計算ロジック', 'E-05', '検算：9.6−14.8＝−5.2、158万人×513円＝8.1億円、5.2億円÷513円＝101万人、(158＋101)÷158＝1.64'), OPT('注）平均運賃＝運賃収入÷輸送人員\n出所）みなと鉄道「決算書」（2024年度）を基に作成（架空の完成例）'));
    const bx = (x, y, w, name, val, key) => { rect(s, x, y, w, 1.0, { line: { color: key ? NAVY : G2, width: key ? 1.75 : 0.75 } }); txt(s, name, { x: x + 0.1, y: y + 0.1, w: w - 0.2, h: 0.32, align: 'center', color: key ? NAVY : G1, bold: key }); txt(s, val, { x: x + 0.1, y: y + 0.45, w: w - 0.2, h: 0.45, align: 'center', fontSize: 18, bold: true, color: key ? NAVY : BLACK }); };
    const op = (x, y, t) => txt(s, t, { x, y, w: 0.45, h: 1.0, align: 'center', valign: 'middle', fontSize: 20, bold: true, color: G1 });
    bx(L, 2.2, 1.9, '営業損失', '−5.2億円', false); op(L + 1.9, 2.2, '＝');
    bx(L + 2.35, 2.2, 1.9, '営業収益', '9.6億円', false); op(L + 4.25, 2.2, '−');
    bx(L + 4.7, 2.2, 1.9, '営業費用', '14.8億円', false);
    line(s, L + 3.3, 3.2, 0, 0.45, G3, 0.75); line(s, L + 1.0, 3.65, 3.6, 0, G3, 0.75);
    bx(L, 3.95, 1.55, '輸送人員', '158万人', true); op(L + 1.55, 3.95, '×'); bx(L + 2.0, 3.95, 1.55, '平均運賃', '513円', false); op(L + 3.55, 3.95, '＋'); bx(L + 4.0, 3.95, 1.4, '運輸雑収', '1.5億円', false);
    [L + 0.78, L + 2.78, L + 4.7].forEach(x => line(s, x, 3.65, 0, 0.3, G3, 0.75));
    line(s, L + 5.65, 3.2, 0, 0.45, G3, 0.75);
    const fx = L + 5.7;
    txt(s, '費用の内訳', { x: fx + 0.2, y: 3.75, w: R - fx - 0.2, h: 0.3, bold: true, color: G1 });
    [['人件費', '6.9'], ['修繕費', '3.2'], ['減価償却費', '2.1'], ['動力費', '1.4'], ['その他', '1.2']].forEach(([n, v], i) => { txt(s, n, { x: fx + 0.2, y: 4.1 + i * 0.36, w: 2.2, h: 0.32 }); txt(s, v + '億円', { x: R - 1.4, y: 4.1 + i * 0.36, w: 1.4, h: 0.32, align: 'right', fontFace: 'Arial' }); });
    txt(s, '黒字化に必要な輸送人員：＋101万人（現在の1.6倍）', { x: L, y: 6.15, w: 6.5, h: 0.35, bold: true, color: NAVY });
  }

  // E14 感度分析
  {
    const s = frame('EX', CH[1], '収支を最も左右するのは輸送人員で、10%の変動で0.8億円動く。人件費も0.7億円と大きく、利用の維持と要員の見直しを同時に進める', '各前提が10%変動したときの営業損益の変化', '（億円、基本ケース＝−5.2億円）',
      N('P28 感度分析', 'E-05', '検算：運賃収入8.1×10%＝0.81、人件費6.9×10%＝0.69、修繕費3.2×10%＝0.32、減価償却2.1×10%＝0.21、動力費1.4×10%＝0.14'), OPT('注）各前提を基本ケース（営業損失5.2億円）から±10%動かし、他は固定\n出所）みなと鉄道「決算書」（2024年度）を基に試算（架空の完成例）'));
    const items = [['輸送人員', 0.81, true], ['人件費', 0.69, false], ['修繕費', 0.32, false], ['減価償却費', 0.21, false], ['動力費', 0.14, false]];
    const cx = L + 2.6 + (W - 2.6) / 2, sc = 3.5, top = 2.3;
    txt(s, '悪化', { x: cx - 2.4, y: 2.08, w: 2.2, h: 0.28, align: 'right', color: G1 });
    txt(s, '改善', { x: cx + 0.2, y: 2.08, w: 2.2, h: 0.28, color: G1 });
    items.forEach(([n, v, key], i) => {
      const y = top + 0.2 + i * 0.82;
      txt(s, n, { x: L, y, w: 2.4, h: 0.5, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      s.addShape(pres.shapes.RECTANGLE, { x: cx - v * sc, y: y + 0.07, w: v * sc, h: 0.36, fill: { color: key ? NAVY : G3 }, line: { type: 'none' } });
      s.addShape(pres.shapes.RECTANGLE, { x: cx, y: y + 0.07, w: v * sc, h: 0.36, fill: { color: key ? NAVY : G3 }, line: { type: 'none' } });
      txt(s, '−' + v.toFixed(2), { x: cx - v * sc - 0.8, y, w: 0.75, h: 0.5, align: 'right', valign: 'middle', fontFace: 'Arial', bold: key, color: key ? NAVY : BLACK });
      txt(s, '＋' + v.toFixed(2), { x: cx + v * sc + 0.05, y, w: 0.8, h: 0.5, valign: 'middle', fontFace: 'Arial', bold: key, color: key ? NAVY : BLACK });
    });
    line(s, cx, top + 0.05, 0, 4.25, G2, 1);
    txt(s, '基本ケース −5.2', { x: cx - 1.0, y: top + 4.35, w: 2.0, h: 0.3, align: 'center', color: G1 });
    txt(s, '補足：輸送人員の変動は運賃収入に比例すると仮定', { x: L, y: 6.45, w: 6, h: 0.3, fontSize: 11, color: G1 });
  }

  // ---------- 第3章 ----------
  divider(2, '第3章では、3つの運営形態を比べ、上下分離を推奨する理由を示す。上下分離は自治体の実質負担が最も小さく、鉄道の利便性も保てる');

  // E16 選択肢の評価
  {
    const s = frame('EX', CH[2], '上下分離は4基準のうち公的負担・利便性・持続性の3つで最も高い。実現性の課題である3市の負担割合は、協議会の調整で解決できる', '運営形態の3案の評価', '（●高　◑中　○低）',
      N('P16 評価表', 'E-07（案別の試算）・E-08（ヒアリング）'), OPT('注）路線・数値はすべて架空の完成例。公的負担は2030年度の自治体の実質負担で評価\n出所）架空のデータを基に作成'));
    const headr = ['評価基準', '案A　現行維持\n（赤字を補填）', '案B　上下分離\n（推奨）', '案C　BRT転換'];
    const rows = [['公的負担の小ささ', '○', '●', '●'], ['利便性（速さ・定時性）', '●', '●', '◑'], ['実現性（合意・手続き）', '●', '◑', '○'], ['将来の持続性', '○', '●', '◑']];
    const data = [headr.map((h, i) => cell(h, { bold: true, align: 'center', color: i === 2 ? NAVY : BLACK, border: bottom(G2, 1) }))]
      .concat(rows.map((r, ri) => r.map((c, i) => cell(c, { fontSize: i === 0 ? 14 : 22, align: i === 0 ? 'left' : 'center', bold: i === 0, color: i === 0 ? BLACK : (i === 2 ? NAVY : G2), border: ri < rows.length - 1 ? bottom() : none }))));
    s.addTable(data, { x: L, y: 2.17, w: W, colW: [3.0, 2.4, 2.4, W - 7.8], rowH: [0.8, 0.9, 0.9, 0.9, 0.9] });
    s.addShape(pres.shapes.RECTANGLE, { x: L + 5.4, y: 2.12, w: 2.4, h: 4.5, fill: { type: 'none' }, line: { color: NAVY, width: 1.5 } });
  }

  // E17 上下分離の仕組み
  {
    const s = frame('EX', CH[2], '上下分離では県と3市が線路・駅を保有し、会社は運行に専念する。施設の費用5.3億円が自治体に移り、会社は使用料1.0億円を払う', '上下分離の仕組み', '（2028年度以降）',
      N('P12 ポンチ絵', 'E-07', '検算：施設費用＝修繕費3.2＋減価償却費2.1＝5.3億円'), OPT('注）国の補助は施設費用と使用料の差額の2分の1と仮定\n出所）国土交通省「鉄道事業再構築事業」の制度資料を基に作成（架空の完成例）'));
    const node = (x, y, label, sub, key) => {
      s.addShape(pres.shapes.OVAL, { x, y, w: 1.15, h: 1.15, fill: { color: WHITE }, line: { color: key ? NAVY : G2, width: key ? 2 : 1 } });
      txt(s, sub, { x: x - 0.4, y: y + 0.38, w: 1.95, h: 0.4, align: 'center', fontSize: 11, color: G2 });
      txt(s, label, { x: x - 0.7, y: y + 1.2, w: 2.55, h: 0.34, align: 'center', bold: true, color: key ? NAVY : BLACK });
    };
    node(L + 0.9, 2.35, '国', '補助', false);
    node(L + 4.3, 2.35, '県・沿線3市', '施設を保有', true);
    node(L + 7.8, 2.35, 'みなと鉄道', '運行に専念', false);
    node(L + 7.8, 4.85, '利用者', '', false);
    const lab = (x, y, t, key) => txt(s, t, { x, y, w: 2.6, h: 0.34, align: 'center', bold: key, color: key ? NAVY : G1 });
    arrow(s, L + 2.1, 2.92, 2.15, 0, G2, 1.25); lab(L + 1.9, 2.5, '補助 2.1億円', false);
    arrow(s, L + 5.5, 2.75, 2.25, 0, NAVY, 1.75); lab(L + 5.3, 2.33, '線路・駅を貸す', true);
    arrow(s, L + 7.75, 3.15, -2.2, 0, G2, 1.25); lab(L + 5.3, 3.22, '線路使用料 1.0億円', false);
    arrow(s, L + 8.37, 3.55, 0, 1.25, G2, 1.25); txt(s, '運行', { x: L + 8.55, y: 3.95, w: 1.0, h: 0.3, color: G1 });
    txt(s, '施設の費用 5.3億円を負担', { x: L + 3.2, y: 4.0, w: 3.4, h: 0.34, align: 'center', bold: true, color: NAVY });
    txt(s, '自治体の実質負担＝5.3−1.0−2.1＝2.2億円／年', { x: L, y: 5.6, w: 6.6, h: 0.35, bold: true, color: NAVY });
    txt(s, '補足：国の補助は施設費用の差額の2分の1と仮定', { x: L, y: 6.0, w: 6.6, h: 0.3, fontSize: 11, color: G1 });
  }

  // E18 公的負担の比較
  {
    const s = frame('EX', CH[2], '2030年度の自治体の実質負担は、現行維持の6.3億円に対し上下分離は2.2億円と最も小さい。BRT転換より鉄道の利便性も保てる', '自治体の実質負担の比較', '（億円／年、2030年度推計）',
      N('P04 降順の横棒', 'E-07', '検算：案B 5.3−1.0−2.1＝2.2、案A 2030年度の赤字見込み6.3'), OPT('注）実質負担＝自治体の支出−国の補助。2030年度の試算\n出所）みなと市・沿線3市の試算を基に作成（架空の完成例）'));
    const labels = ['案A　現行維持', '案C　BRT転換', '案B　上下分離'].reverse();
    const v = [6.3, 2.4, 2.2].reverse();
    s.addChart(pres.charts.BAR, [{ name: 'その他', labels, values: v.map((x, i) => i === 0 ? 0 : x) }, { name: '推奨', labels, values: v.map((x, i) => i === 0 ? x : 0) }],
      Object.assign({}, chartBase, { x: L, y: 2.15, w: 7.2, h: 3.9, barDir: 'bar', barGrouping: 'stacked', barGapWidthPct: 40, chartColors: [G3, NAVY], showValue: true, dataLabelPosition: 'inEnd', dataLabelColor: WHITE, dataLabelFormatCode: '0.0;;', valAxisMinVal: 0, valAxisMaxVal: 7 }));
    txt(s, '現行維持の約3分の1', { x: L + 7.5, y: 4.95, w: 2.7, h: 0.35, bold: true, color: NAVY });
    txt(s, '−4.1億円／年', { x: L + 7.5, y: 5.3, w: 2.7, h: 0.5, fontSize: 20, bold: true, color: NAVY, fontFace: 'Arial' });
  }

  // E19 増収策
  {
    const s = frame('EX', CH[2], '5つの増収策で年1.0億円の増収が見込め、上下分離後の会社の収支は0.9億円の赤字から黒字に転じる。最大は運賃改定の0.4億円である', '増収策ごとの効果', '（億円／年、2030年度）',
      N('P37 打ち手の効果表', 'E-09（増収策の試算）', '検算：0.40＋0.30＋0.15＋0.10＋0.05＝1.00、会社収支 −5.2＋5.3−1.0＝−0.9 → −0.9＋1.0＝＋0.1'), OPT('注）増収額は2030年度の年額。施策の間の重複は除いた\n出所）みなと鉄道 増収策の検討資料を基に作成（架空の完成例）'));
    const rows = [['運賃の5%改定', 0.40, '2028年度', '中'], ['観光列車と周遊券', 0.30, '2027年度', '中'], ['通学定期の家族割', 0.15, '2027年度', '高'], ['駅のパーク＆ライド', 0.10, '2028年度', '高'], ['沿線企業の通勤定期', 0.05, '2027年度', '高']];
    const data = [['増収策', '効果', '効果の大きさ', '開始', '確度'].map((h, j) => cell(h, { bold: true, align: j === 0 ? 'left' : 'center', border: bottom(G2, 1) }))]
      .concat(rows.map((r, i) => [cell(r[0], { bold: i === 0, color: i === 0 ? NAVY : BLACK, border: bottom() }), cell(r[1].toFixed(2), { align: 'center', fontFace: 'Arial', bold: i === 0, color: i === 0 ? NAVY : BLACK, border: bottom() }), cell('', { border: bottom() }), cell(r[2], { align: 'center', border: bottom() }), cell(r[3], { align: 'center', border: bottom() })]))
      .concat([[cell('合計', { bold: true, border: none }), cell('1.00', { align: 'center', fontFace: 'Arial', bold: true, border: none }), cell('', { border: none }), cell('', { border: none }), cell('', { border: none })]]);
    s.addTable(data, { x: L, y: 2.1, w: W, colW: [2.9, 1.1, 3.5, 1.5, W - 9.0], rowH: [0.45, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6] });
    rows.forEach((r, i) => s.addShape(pres.shapes.RECTANGLE, { x: L + 4.05, y: 2.55 + i * 0.6 + 0.17, w: r[1] * 7.5, h: 0.26, fill: { color: i === 0 ? NAVY : G3 }, line: { type: 'none' } }));
  }

  // ---------- 第4章 ----------
  divider(3, '第4章では、2028年4月の移行までの工程・効果・リスクと判断事項を示す。最初の判断点は2027年3月の協議会での合意である');

  // E21 ロードマップ
  {
    const s = frame('EX', CH[3], '移行は3段階で進め、2028年4月に上下分離へ移る。2027年3月の協議会で3市の負担割合に合意できれば、国の認定申請に進める', '上下分離への移行ロードマップ', '（2026–2028年度）',
      N('P13 プロセス／ロードマップ', 'E-10（手続きの所要期間）'), OPT('注）◆は判断の時期\n出所）沿線地域公共交通活性化協議会 事務局資料を基に作成（架空の完成例）'));
    const ph = [['計画をつくる', '2026年度', ['法定協議会を設置', '再構築実施計画を策定'], '3市の負担割合に合意', '県・沿線3市'], ['移行を準備する', '2027年度', ['国の認定を申請', '施設の譲渡契約を締結'], '国の認定を得る', '県・みなと鉄道'], ['移行する', '2028年4月〜', ['上下分離で運行開始', '増収策を本格実施'], '会社の収支が黒字', 'みなと鉄道']];
    const lw = 1.55, gx = L + lw, pw = (W - lw - 0.3) / 3, chw = (W - lw + 0.2) / 3, top = 2.12;
    const rowsY = [top + 0.85, top + 1.45, top + 2.6, top + 3.35];
    ['期間', '主な取組', '次へ進む条件', '担い手'].forEach((k, j) => { txt(s, k, { x: L, y: rowsY[j], w: lw - 0.1, h: j === 1 ? 1.0 : 0.6, valign: 'middle', bold: true, color: G1 }); if (j < 3) rowRule(s, L, rowsY[j + 1] - 0.08, W); });
    ph.forEach((p, i) => {
      const x = gx + i * (pw + 0.15), cur = i === 0;
      s.addShape(i === 0 ? pres.shapes.PENTAGON : pres.shapes.CHEVRON, { x: gx + i * (chw - 0.1), y: top, w: chw, h: 0.62, fill: { color: cur ? NAVY : G3 }, line: { type: 'none' } });
      txt(s, '段階' + (i + 1) + '　' + p[0], { x: gx + i * (chw - 0.1) + 0.3, y: top, w: chw - 0.6, h: 0.62, bold: true, color: cur ? WHITE : BLACK, valign: 'middle' });
      txt(s, p[1], { x: x + 0.1, y: rowsY[0], w: pw - 0.2, h: 0.6, valign: 'middle', color: G1 });
      bullets(s, p[2], { x: x + 0.1, y: rowsY[1] + 0.05, w: pw - 0.2, h: 1.0 });
      txt(s, p[3], { x: x + 0.1, y: rowsY[2], w: pw - (i === 0 ? 0.6 : 0.2), h: 0.6, valign: 'middle', bold: cur, color: cur ? NAVY : BLACK });
      txt(s, p[4], { x: x + 0.1, y: rowsY[3], w: pw - 0.2, h: 0.6, valign: 'middle' });
    });
    s.addShape(pres.shapes.DIAMOND, { x: gx + pw - 0.37, y: rowsY[2] + 0.13, w: 0.34, h: 0.34, fill: { color: NAVY }, line: { type: 'none' } });
    txt(s, '判断点：2027年3月の協議会で負担割合に合意できれば、国の認定申請に進む', { x: gx, y: top + 4.15, w: W - lw, h: 0.35, bold: true, color: NAVY });
  }

  // E22 効果（KPI）
  {
    const s = frame('EX', CH[3], '上下分離と増収策で、2030年度に自治体の実質負担は年4.1億円減り、会社の収支は黒字に転じる。運行本数も1日44本を維持できる', '施策実行後の効果', '（2030年度、現行維持との比較）',
      N('P20 数値ハイライト', 'E-07・E-09', '検算：6.3−2.2＝4.1、会社収支 −0.9＋1.0＝＋0.1'), OPT('注）現行維持との比較。輸送人員は基本シナリオ\n出所）みなと市・沿線3市の試算を基に作成（架空の完成例）'));
    const k = [['自治体の実質負担', '−4.1', '億円／年', true, '6.3 → 2.2億円', '上下分離と国の補助による'], ['会社の営業収支', '＋0.1', '億円／年', false, '−5.2 → ＋0.1億円', '施設費用の移管と増収策による'], ['運行本数', '44', '本／日', false, '44 → 44本', '現行の本数を維持する前提'], ['輸送人員', '＋4%', '（2030年度）', false, '148 → 154万人', '基本シナリオとの比較']];
    const cw = W / 4;
    k.forEach(([n, v, u, key, sub, basis], i) => {
      const x = L + i * cw;
      if (i > 0) line(s, x, 2.15, 0, 4.3, G4, 0.75);
      txt(s, n, { x: x + 0.1, y: 2.15, w: cw - 0.2, h: 0.35, align: 'center', bold: true, color: key ? NAVY : BLACK });
      txt(s, v, { x: x + 0.1, y: 2.65, w: cw - 0.2, h: 0.9, align: 'center', valign: 'middle', fontSize: 32, bold: true, fontFace: 'Arial', color: key ? NAVY : BLACK });
      txt(s, u, { x: x + 0.1, y: 3.6, w: cw - 0.2, h: 0.32, align: 'center', color: G1 });
      rowRule(s, x + 0.25, 4.15, cw - 0.5);
      txt(s, '現行→実行後', { x: x + 0.1, y: 4.3, w: cw - 0.2, h: 0.3, fontSize: 11, align: 'center', color: G1 });
      txt(s, sub, { x: x + 0.1, y: 4.62, w: cw - 0.2, h: 0.6, align: 'center', fontSize: 14, bold: key, color: key ? NAVY : BLACK });
      txt(s, '補足：' + basis, { x: x + 0.15, y: 5.4, w: cw - 0.3, h: 0.8, align: 'center', fontSize: 11, color: G1 });
    });
  }

  // E23 リスク
  {
    const s = frame('EX', CH[3], '最大のリスクは国の補助が得られないことで、その場合は実質負担が4.3億円に増える。2026年度中に国と協議し、認定の見通しを確かめる', '主なリスクと対応', '（影響度：●大　◑中　○小）',
      N('P30 リスク一覧', 'E-07・E-08', '検算：補助なしの実質負担＝5.3−1.0＝4.3'), OPT('注）影響額は2030年度の自治体の実質負担への影響\n出所）事務局の試算を基に作成（架空の完成例）'));
    const rows = [['国の補助が得られない', '2026年度末までに認定の見通しが立たない', '●', '国と事前協議を重ね、計画を補強する'], ['沿線3市の負担割合で合意できない', '2027年1月の幹事会で案がまとまらない', '◑', '県が調整案を示す'], ['運賃改定に利用者が反発する', 'パブリックコメントで反対が過半', '◑', '通学定期の家族割と同時に実施'], ['修繕費が想定を上回る', '橋りょう点検で大規模補修が必要と判明', '◑', '補修計画を前倒しで精査する']];
    const data = [['リスク', '兆候（何を見るか）', '影響度', '対応'].map((h, j) => cell(h, { bold: true, align: j === 2 ? 'center' : 'left', border: bottom(G2, 1) }))]
      .concat(rows.map((r, i) => r.map((c, j) => cell(c, { align: j === 2 ? 'center' : 'left', fontSize: j === 2 ? 20 : 14, bold: i === 0 && j !== 2, color: i === 0 ? NAVY : (j === 2 ? G2 : BLACK), border: i < rows.length - 1 ? bottom() : none }))));
    s.addTable(data, { x: L, y: 2.1, w: W, colW: [3.0, 3.3, 1.0, W - 7.3], rowH: [0.5, 1.0, 1.0, 1.0, 1.0] });
  }

  // E24 意思決定
  {
    const s = frame('EX', '4　ご判断いただきたい事項', '本日は、上下分離を基本方針とし、2026年度に協議会を設けることをご判断いただきたい。決定すれば2028年4月の移行に間に合う', null, null,
      N('P32 意思決定ページ', 'E-07・E-10'), OPT(''));
    s.addShape(pres.shapes.RECTANGLE, { x: L, y: BODY_Y, w: W - 1.2, h: 0.75, fill: { color: BLUE5 }, line: { type: 'none' } });
    txt(s, '決めていただきたいこと', { x: L + 0.2, y: BODY_Y, w: 2.6, h: 0.75, valign: 'middle', bold: true, color: NAVY });
    txt(s, '上下分離（案B）を基本方針とし、2026年6月に法定協議会を設置すること', { x: L + 2.9, y: BODY_Y, w: W - 4.3, h: 0.75, valign: 'middle', bold: true, color: NAVY });
    const lw = 5.6;
    head(s, L, 2.55, lw, '選択肢');
    [['案A　現行維持', '実質負担 6.3億円', '利便性 高', false], ['案B　上下分離', '実質負担 2.2億円', '利便性 高', true], ['案C　BRT転換', '実質負担 2.4億円', '利便性 中', false]].forEach(([n, a, b, key], i) => {
      const y = 3.05 + i * 1.05;
      txt(s, n, { x: L + 0.12, y, w: 2.0, h: 0.85, valign: 'middle', bold: true, color: key ? NAVY : BLACK });
      txt(s, a, { x: L + 2.15, y, w: 2.0, h: 0.85, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      txt(s, b, { x: L + 4.2, y, w: lw - 4.2, h: 0.85, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      if (i < 2) rowRule(s, L, y + 0.95, lw);
    });
    s.addShape(pres.shapes.RECTANGLE, { x: L, y: 4.02, w: lw, h: 1.0, fill: { type: 'none' }, line: { color: NAVY, width: 1.5 } });
    const rx = L + lw + 0.4, rw = R - rx;
    head(s, rx, 2.55, rw, '判断の前提');
    bullets(s, ['国の補助は施設費用差額の2分の1', '線路使用料は年1.0億円', '負担割合は協議会で決める'], { x: rx, y: 3.05, w: rw, h: 1.3 });
    head(s, rx, 4.55, rw, '決定後の動き');
    txt(s, '2026年6月　法定協議会を設置\n2027年3月　負担割合を合意\n2028年4月　上下分離で運行開始', { x: rx, y: 5.05, w: rw, h: 1.3 });
  }
};
