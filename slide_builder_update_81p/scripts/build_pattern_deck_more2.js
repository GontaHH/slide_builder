// 追加の型 P34〜P53（2026-10 追加・第2弾）
// 外資系コンサルの公開資料（経産省委託調査報告書など）に多い見せ方と、Jinba 型カタログの残りの型を、本スキルの規定で作り直したもの。
module.exports = function ({ pres, frame, txt, line, rect, chartBase, C }) {
  const { F, NAVY, BLACK, G1, G2, G3, G4, G5, WHITE, L, R, W, BODY_Y } = C;
  const arrow = (s, x, y, w, h, color, width) => s.addShape(pres.shapes.LINE, { x, y, w, h, line: { color: color || G2, width: width || 1, endArrowType: 'triangle' } });
  const tri = (s, x, y, w, h, color) => s.addShape(pres.shapes.ISOSCELES_TRIANGLE, { x, y, w, h, rotate: 90, fill: { color: color || G2 }, line: { type: 'none' } });
  const cell = (t, o) => ({ text: t, options: Object.assign({ fontFace: F, fontSize: 14, valign: 'middle', color: BLACK }, o) });
  const bottom = (c, w) => [{ type: 'none' }, { type: 'none' }, { pt: w || 0.5, color: c || G4 }, { type: 'none' }];
  const head = (s, x, y, w, t, key) => { txt(s, t, { x, y, w, h: 0.3, bold: true, color: key ? NAVY : BLACK }); line(s, x, y + 0.34, w, 0, key ? NAVY : G3, key ? 1.25 : 0.5); };
  const box = (s, x, y, w, h, t, key, o) => { rect(s, x, y, w, h, { line: { color: key ? NAVY : G3, width: key ? 1.5 : 0.75 } }); txt(s, t, Object.assign({ x: x + 0.15, y, w: w - 0.3, h, valign: 'middle', align: 'center', bold: key, color: key ? NAVY : BLACK }, o || {})); };

  // ---------- P34 全体マップ ----------
  {
    const s = frame('P34', '0　全体像', '本資料は4つの論点に、論点ごとに現状・課題・打ち手の順で答える。最も重要なのは論点3の【論点名】であり、第3章で詳しく扱う', '本資料の全体マップ', null,
      '使う場面：本文が11枚以上の資料の冒頭で、論点と章の対応を一望させる。後続ページの章名トラッカーと同じ番号・言葉を使う。最重要の論点だけ紺。\n差し替え：論点、章、ページ範囲。');
    const cols = ['現状', '課題', '打ち手'], lw = 3.2, cw = (W - lw) / 3;
    cols.forEach((c, j) => txt(s, c, { x: L + lw + j * cw, y: 2.1, w: cw, h: 0.3, bold: true, align: 'center', color: G1 }));
    line(s, L, 2.45, W, 0, G2, 1);
    [['論点1　【論点名】', 'p.4–6', 'p.7–8', 'p.9'], ['論点2　【論点名】', 'p.10–11', 'p.12', 'p.13'], ['論点3　【論点名】', 'p.14–16', 'p.17–19', 'p.20–22'], ['論点4　【論点名】', 'p.23', 'p.24', 'p.25']].forEach((r, i) => {
      const y = 2.6 + i * 0.95, key = i === 2;
      if (key) s.addShape(pres.shapes.RECTANGLE, { x: L, y: y - 0.08, w: W, h: 0.8, fill: { color: NAVY, transparency: 90 }, line: { type: 'none' } });
      txt(s, r[0], { x: L + 0.1, y, w: lw - 0.2, h: 0.64, valign: 'middle', bold: true, color: key ? NAVY : BLACK });
      r.slice(1).forEach((p, j) => txt(s, p, { x: L + lw + j * cw, y, w: cw, h: 0.64, align: 'center', valign: 'middle', fontFace: 'Arial', color: key ? NAVY : BLACK, bold: key }));
      line(s, L, y + 0.8, W, 0, G4, 0.75);
    });
  }

  // ---------- P35 イシューツリー（論点分解＋確かめ方） ----------
  {
    const s = frame('P35', '0　全体像', '「【問い】」には需要・費用・体制の3つを確かめれば答えられる。答えを最も左右するのは需要であり、調査の資源をここに厚く配分する', '論点の分解と確かめ方', null,
      '使う場面：問いを「答えを決める要素」で分解し、各論点の確かめ方（分析・データ）を右列に置く。進め方の順番ではなく答えの構造で分ける。答えを最も左右する論点だけ紺。\n差し替え：問い、サブ論点、確かめ方。');
    box(s, L, 3.55, 2.3, 1.0, '【問い】\n◯◯すべきか', false);
    const subs = [['需要は維持できるか', '人口推計×利用率でシナリオ試算', true], ['費用は賄えるか', '費目別の10年推移と単価比較', false], ['担い手を確保できるか', '関係者ヒアリング（20件）', false]];
    subs.forEach(([q, how, key], i) => {
      const y = 2.15 + i * 1.5;
      box(s, L + 3.0, y, 3.2, 1.0, q, key);
      line(s, L + 2.3, 4.05, 0.35, 0, G3, 0.75); line(s, L + 2.65, 2.65, 0, 3.0, G3, 0.75); line(s, L + 2.65, y + 0.5, 0.35, 0, key ? NAVY : G3, key ? 1.25 : 0.75);
      txt(s, how, { x: L + 6.5, y, w: W - 6.5, h: 1.0, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      line(s, L + 6.5, y + 1.15, W - 6.5, 0, G4, 0.75);
    });
    txt(s, '確かめ方', { x: L + 6.5, y: BODY_Y, w: 2, h: 0.3, bold: true, color: G1 });
  }

  // ---------- P36 現状と目指す姿（ギャップ表） ----------
  {
    const s = frame('P36', '3　打ち手', '3つの観点すべてで目指す姿との差があり、最も大きいのは【観点2】の【数値A】である。この差を埋める打ち手を最優先で講じるべきである', '現状と目指す姿の差', '（【年度】時点）',
      '使う場面：観点ごとに現状・目指す姿・差を並べ、打ち手の必要性を示す。差の列を設け、最も大きい差だけ紺。\n差し替え：観点、現状値、目標値、差。');
    const data = [['観点', '現状', '目指す姿（【年度】）', '差'].map((h, j) => cell(h, { bold: true, align: j === 0 ? 'left' : 'center', border: bottom(G2, 1) }))]
      .concat([['【観点1】', '【数値】', '【数値】', '＋【数値】'], ['【観点2】', '【数値】', '【数値】', '＋【数値A】'], ['【観点3】', '【数値】', '【数値】', '−【数値】']].map((r, i) => r.map((c, j) => cell(c, { align: j === 0 ? 'left' : 'center', fontSize: j === 3 ? 18 : 14, bold: i === 1 && j === 3, color: i === 1 && j === 3 ? NAVY : BLACK, border: bottom() }))));
    s.addTable(data, { x: L, y: 2.15, w: W, colW: [3.0, 2.2, 2.6, W - 7.8], rowH: [0.5, 1.1, 1.1, 1.1] });
  }

  // ---------- P37 打ち手の効果表 ----------
  {
    const s = frame('P37', '3　打ち手', '5つの打ち手で年【数値A】の収支改善が見込め、その半分以上を【打ち手1】が占める。【打ち手1】の実現性が全体の成否を決める', '打ち手ごとの効果と時期', '（【単位】／年、【年度】時点）',
      '使う場面：打ち手ごとの効果額・着手時期・確度を一覧にする。効果の大きい順に並べ、合計を最下行に置く。最大の打ち手だけ紺。合計は検算する。\n差し替え：打ち手、効果、時期、確度。');
    const rows = [['【打ち手1】', '2.4', '【年度】', '中'], ['【打ち手2】', '0.9', '【年度】', '高'], ['【打ち手3】', '0.6', '【年度】', '高'], ['【打ち手4】', '0.3', '【年度】', '中'], ['【打ち手5】', '0.2', '【年度】', '低']];
    const data = [['打ち手', '効果', '効果の大きさ', '着手', '確度'].map((h, j) => cell(h, { bold: true, align: j === 0 ? 'left' : 'center', border: bottom(G2, 1) }))]
      .concat(rows.map((r, i) => [cell(r[0], { bold: i === 0, color: i === 0 ? NAVY : BLACK, border: bottom() }), cell(r[1], { align: 'center', fontFace: 'Arial', bold: i === 0, color: i === 0 ? NAVY : BLACK, border: bottom() }), cell('', { border: bottom() }), cell(r[2], { align: 'center', border: bottom() }), cell(r[3], { align: 'center', border: bottom() })]))
      .concat([[cell('合計', { bold: true, border: bottom(G2, 1) }), cell('4.4', { align: 'center', fontFace: 'Arial', bold: true, border: bottom(G2, 1) }), cell('', { border: bottom(G2, 1) }), cell('', { border: bottom(G2, 1) }), cell('', { border: bottom(G2, 1) })]]);
    s.addTable(data, { x: L, y: 2.1, w: W, colW: [2.8, 1.1, 3.6, 1.4, W - 8.9], rowH: [0.45, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6] });
    rows.forEach((r, i) => s.addShape(pres.shapes.RECTANGLE, { x: L + 3.95, y: 2.55 + i * 0.6 + 0.17, w: parseFloat(r[1]) * 1.3, h: 0.26, fill: { color: i === 0 ? NAVY : G3 }, line: { type: 'none' } }));
  }

  // ---------- P38 大型数値の対比 ----------
  {
    const s = frame('P38', '1　現状', '【対象】の1人当たり費用は【比較対象】の【数値A】倍で、差は10年で倍に広がった。規模では説明できず、運営方法に原因がある', null, null,
      '使う場面：2つの数値の対比だけで主張が伝わる場合。数値は大きく、算定の前提は補足（11pt）に書く。言いたい側の数値だけ紺。\n差し替え：2つの数値、単位、前提。');
    const cw = (W - 1.2) / 2;
    [['【対象】', '【数値】', '円／人', true], ['【比較対象】の平均', '【数値】', '円／人', false]].forEach(([n, v, u, key], i) => {
      const x = L + i * (cw + 1.2);
      txt(s, n, { x, y: 2.2, w: cw, h: 0.35, align: 'center', bold: true, color: key ? NAVY : BLACK });
      line(s, x, 2.62, cw, 0, key ? NAVY : G3, key ? 1.25 : 0.5);
      txt(s, v, { x, y: 2.9, w: cw, h: 1.3, align: 'center', valign: 'middle', fontSize: 54, bold: true, color: key ? NAVY : G2, fontFace: 'Arial' });
      txt(s, u, { x, y: 4.25, w: cw, h: 0.35, align: 'center', color: G1 });
    });
    txt(s, '×【数値A】', { x: L + cw, y: 3.25, w: 1.2, h: 0.6, align: 'center', valign: 'middle', fontSize: 20, bold: true, color: NAVY });
    txt(s, '補足：1人当たり費用＝年間費用÷利用者数。【年度】決算ベース', { x: L, y: 5.2, w: W, h: 0.3, fontSize: 11, color: G1, align: 'center' });
  }

  // ---------- P39 ドットマトリクス（割合） ----------
  {
    const s = frame('P39', '1　現状', '利用者の10人に3人は代わりの移動手段を持たず、多くは高校生と高齢者である。この層には生活の前提であり、単純な廃止は選べない', '代わりの移動手段がない利用者の割合', '（%、n＝【数値】、【調査時期】）',
      '使う場面：割合を「100人中◯人」で直感的に示す。100個の点で表し、該当する点だけ紺。割合が1桁や90%台なら棒グラフの方がよい。\n差し替え：割合、設問、内訳の読み取り。');
    const n = 30, X = L + 0.4, Y = 2.25, gap = 0.36;
    for (let i = 0; i < 100; i++) {
      const r = Math.floor(i / 10), c = i % 10;
      s.addShape(pres.shapes.OVAL, { x: X + c * gap, y: Y + r * gap, w: 0.24, h: 0.24, fill: { color: i < n ? NAVY : G4 }, line: { type: 'none' } });
    }
    const rx = X + 10 * gap + 0.6;
    txt(s, '30%', { x: rx, y: 2.3, w: 3.5, h: 1.0, fontSize: 44, bold: true, color: NAVY, fontFace: 'Arial' });
    txt(s, '代わりの手段がない', { x: rx, y: 3.3, w: 4.2, h: 0.35, bold: true, color: NAVY });
    line(s, rx, 3.85, R - rx, 0, G4, 0.75);
    txt(s, 'うち高校生　【数値】%\nうち70歳以上　【数値】%', { x: rx, y: 4.0, w: R - rx, h: 0.8 });
  }

  // ---------- P40 比例円の対比 ----------
  {
    const s = frame('P40', '1　現状', '【市場】は【年度】までに約3倍の【数値B】に拡大し、拡大分の大半を【区分X】が占める見込みである。参入の好機は今後5年にある', '【市場】の規模', '（【単位】、【年度】と【年度】（予測））',
      '使う場面：規模の違いを面積で印象づける。円の面積を値に比例させる（直径ではない）。比較は2〜3個まで。正確な比較が必要なら棒グラフを使う。\n差し替え：値（面積比で直径を計算）、ラベル。');
    const v1 = 100, v2 = 300, k = 0.17;
    const d1 = Math.sqrt(v1) * k, d2 = Math.sqrt(v2) * k;
    const by = 5.6;
    s.addShape(pres.shapes.OVAL, { x: L + 1.6, y: by - d1, w: d1, h: d1, fill: { color: G3 }, line: { type: 'none' } });
    s.addShape(pres.shapes.OVAL, { x: L + 5.0, y: by - d2, w: d2, h: d2, fill: { color: NAVY }, line: { type: 'none' } });
    txt(s, '【年度】\n【数値A】', { x: L + 1.6 - 0.6, y: by + 0.1, w: d1 + 1.2, h: 0.65, align: 'center' });
    txt(s, '【年度】（予測）\n【数値B】', { x: L + 5.0 - 0.3, y: by + 0.1, w: d2 + 0.6, h: 0.65, align: 'center', bold: true, color: NAVY });
    arrow(s, L + 1.6 + d1 + 0.2, by - d1 / 2, 5.0 - 1.6 - d1 - 0.4, 0, G2, 1.25);
    txt(s, '約3倍', { x: L + 2.9, y: by - d1 / 2 - 0.45, w: 1.4, h: 0.35, align: 'center', bold: true, color: NAVY });
  }

  // ---------- P41 積み上げ縦棒（総量と内訳） ----------
  {
    const s = frame('P41', '1　現状', '【指標】は10年で【数値A】増えたが、増加分のほぼすべては【区分C】による。他の区分は横ばいで、成長は1区分に依存している', '【指標】の区分別の推移', '（【単位】、2015–2025年度）',
      '使う場面：総量の推移と内訳の両方を示す。棒の上に合計値、系列名は右端に直接書く。注目の系列だけ紺。構成比だけを言いたいなら100%積上げ（P05）を使う。\n差し替え：系列データ、合計、系列名。');
    const labels = ['2015', '2017', '2019', '2021', '2023', '2025'];
    const A = [40, 41, 40, 41, 40, 41], B = [30, 30, 31, 30, 31, 30], Cc = [10, 16, 24, 33, 41, 49];
    s.addChart(pres.charts.BAR, [{ name: '区分A', labels, values: A }, { name: '区分B', labels, values: B }, { name: '区分C', labels, values: Cc }],
      Object.assign({}, chartBase, { x: L, y: 2.15, w: 8.0, h: 4.5, barDir: 'col', barGrouping: 'stacked', barGapWidthPct: 60, chartColors: [G2, G3, NAVY], showValue: true, dataLabelPosition: 'ctr', dataLabelColor: WHITE }));
    txt(s, '区分C', { x: L + 8.15, y: 2.75, w: 1.5, h: 0.3, bold: true, color: NAVY });
    txt(s, '区分B', { x: L + 8.15, y: 4.05, w: 1.5, h: 0.3 });
    txt(s, '区分A', { x: L + 8.15, y: 5.25, w: 1.5, h: 0.3 });
    txt(s, '合計 80 → 120', { x: L + 8.15, y: 2.2, w: 2.1, h: 0.3, fontSize: 14, color: G1 });
  }

  // ---------- P42 柱＋土台（戦略の構造） ----------
  {
    const s = frame('P42', '4　提言', '目指す姿は3つの柱と2つの土台で実現する。最も効果が大きいのは【柱1】であり、【土台1】が整わなければどの柱も機能しない', '戦略の全体像', null,
      '使う場面：目指す姿・柱（施策群）・土台（共通基盤）の関係を示す。屋根の箱は使わず、線と文字で構造を表す。最重要の柱と、前提となる土台だけ紺。\n差し替え：目指す姿、柱、土台。');
    txt(s, '目指す姿：【目指す姿を1文で】', { x: L, y: 2.1, w: W, h: 0.5, align: 'center', bold: true, fontSize: 16 });
    line(s, L, 2.75, W, 0, G2, 1.25);
    const pw = (W - 0.6) / 3;
    [['柱1', '【柱1の名前】', '・【施策】\n・【施策】', true], ['柱2', '【柱2の名前】', '・【施策】\n・【施策】', false], ['柱3', '【柱3の名前】', '・【施策】\n・【施策】', false]].forEach(([k, n, d, key], i) => {
      const x = L + i * (pw + 0.3);
      line(s, x, 2.95, 0, 2.3, key ? NAVY : G3, key ? 2 : 1);
      txt(s, k, { x: x + 0.2, y: 3.0, w: pw - 0.3, h: 0.3, color: key ? NAVY : G1, bold: true });
      txt(s, n, { x: x + 0.2, y: 3.35, w: pw - 0.3, h: 0.4, bold: true, color: key ? NAVY : BLACK });
      txt(s, d, { x: x + 0.2, y: 3.85, w: pw - 0.3, h: 1.2 });
    });
    line(s, L, 5.4, W, 0, G2, 1.25);
    [['土台1　【データ基盤】', true], ['土台2　【人材・体制】', false]].forEach(([t, key], i) => {
      const x = L + i * (W / 2);
      txt(s, t, { x, y: 5.55, w: W / 2 - 0.2, h: 0.45, align: 'center', valign: 'middle', bold: true, color: key ? NAVY : BLACK });
    });
    line(s, L + W / 2, 5.5, 0, 0.55, G3, 0.75);
  }

  // ---------- P43 プロセス×観点の行列 ----------
  {
    const s = frame('P43', '2　課題', '5工程を3観点で点検すると、課題は「受付」と「確認」に集中している。両工程の手作業を減らせば、処理時間を半分にできる', '工程別・観点別の課題', null,
      '使う場面：工程（列）×観点（行）で課題を一覧にする。課題のあるセルだけ短く書き、集中している工程の列を紺の枠で囲む。\n差し替え：工程、観点、課題の短文。');
    const procs = ['申込', '受付', '確認', '承認', '通知'], obs = ['時間', '品質', '費用'];
    const lw = 1.4, cw = (W - lw) / 5, top = 2.15, rh = 1.15;
    procs.forEach((p, j) => s.addShape(pres.shapes.CHEVRON, { x: L + lw + j * cw, y: top, w: cw + 0.05, h: 0.5, fill: { color: WHITE }, line: { color: j === 1 || j === 2 ? NAVY : G2, width: 1 } }));
    procs.forEach((p, j) => txt(s, p, { x: L + lw + j * cw + 0.2, y: top, w: cw - 0.3, h: 0.5, align: 'center', valign: 'middle', bold: true, color: j === 1 || j === 2 ? NAVY : BLACK }));
    const cells = { '0-1': '入力に平均20分', '0-2': '差戻しで3日待ち', '1-2': '誤り率8%', '2-1': '紙の転記が残る', '1-4': '' };
    obs.forEach((o, i) => {
      const y = top + 0.7 + i * rh;
      txt(s, o, { x: L, y, w: lw - 0.1, h: rh, valign: 'middle', bold: true, color: G1 });
      line(s, L, y + rh, W, 0, G4, 0.75);
      procs.forEach((p, j) => { const t = cells[i + '-' + j]; if (t) txt(s, t, { x: L + lw + j * cw + 0.1, y, w: cw - 0.2, h: rh, align: 'center', valign: 'middle', color: j === 1 || j === 2 ? NAVY : BLACK }); });
    });
    s.addShape(pres.shapes.RECTANGLE, { x: L + lw + cw, y: top - 0.05, w: 2 * cw, h: 0.75 + 3 * rh, fill: { type: 'none' }, line: { color: NAVY, width: 1.5 } });
  }

  // ---------- P44 時系列マトリクス（年×施策） ----------
  {
    const s = frame('P44', '4　実行計画', '施策は3年で段階的に広げ、2年目の【施策B】開始が3年目の目標達成の鍵となる。初年度は基盤づくりに集中し、成果を急がない', '年度別の取組', '（【年度】〜【年度】）',
      '使う場面：施策（行）×年度（列）で、いつ何をするかを示す。ガント（P25）より粗い計画向け。各セルは短い動詞句。鍵になるセルだけ紺。\n差し替え：施策、年度、取組。');
    const yrs = ['1年目', '2年目', '3年目'], lw = 2.6, cw = (W - lw) / 3, top = 2.15, rh = 1.05;
    yrs.forEach((y, j) => txt(s, y, { x: L + lw + j * cw, y: top, w: cw, h: 0.35, align: 'center', bold: true }));
    line(s, L, top + 0.42, W, 0, G2, 1);
    [['【施策A】', '試行する', '対象を広げる', '全域で実施'], ['【施策B】', '準備する', '開始する', '定着させる'], ['【施策C】', '―', '検討する', '試行する'], ['体制', '推進室を設ける', '人員を増やす', '自走させる']].forEach((r, i) => {
      const y = top + 0.55 + i * rh;
      txt(s, r[0], { x: L, y, w: lw - 0.1, h: rh - 0.1, valign: 'middle', bold: true });
      r.slice(1).forEach((c, j) => { const key = i === 1 && j === 1; if (c !== '―') box(s, L + lw + j * cw + 0.08, y + 0.12, cw - 0.16, rh - 0.34, c, key); else txt(s, '―', { x: L + lw + j * cw, y, w: cw, h: rh - 0.1, align: 'center', valign: 'middle', color: G3 }); });
    });
  }

  // ---------- P45 循環サイクル ----------
  {
    const s = frame('P45', '3　打ち手', '利用者が増えるほど便数と収入が増え、さらに利用者が増える好循環を作れる。最初の1年は起点の【起点】に投資を集中すべきである', '利用拡大の好循環', null,
      '使う場面：要素が互いに強め合う（または弱め合う）循環を示す。要素は4〜5個。循環の起点だけ紺。悪循環の場合は「断ち切る点」を紺にする。\n差し替え：要素名、起点。');
    const cx = L + W / 2 - 1.2, cy = 4.15, rr = 1.55;
    const items = [['【起点】\n便数を増やす', true], ['待ち時間が減る', false], ['利用者が増える', false], ['運賃収入が増える', false]];
    const pts = items.map((_, i) => { const a = -Math.PI / 2 + i * Math.PI / 2; return [cx + rr * 1.5 * Math.cos(a), cy + rr * Math.sin(a)]; });
    items.forEach(([t, key], i) => box(s, pts[i][0] - 1.1, pts[i][1] - 0.4, 2.2, 0.8, t, key));
    arrow(s, pts[0][0] + 1.15, pts[0][1] + 0.1, pts[1][0] - pts[0][0] - 1.1, pts[1][1] - pts[0][1] - 0.5, G2, 1.25);
    arrow(s, pts[1][0] - 0.2, pts[1][1] + 0.45, pts[2][0] - pts[1][0] + 1.3, pts[2][1] - pts[1][1] - 0.85, G2, 1.25);
    arrow(s, pts[2][0] - 1.15, pts[2][1] - 0.1, pts[3][0] - pts[2][0] + 1.1, pts[3][1] - pts[2][1] + 0.5, G2, 1.25);
    arrow(s, pts[3][0] + 0.2, pts[3][1] - 0.45, pts[0][0] - pts[3][0] - 1.3, pts[0][1] - pts[3][1] + 0.85, G2, 1.25);
    txt(s, '投資を集中する点', { x: R - 2.6, y: 2.35, w: 2.6, h: 0.3, bold: true, color: NAVY });
    txt(s, '便数を1時間2本から3本へ\n（年【数値】の追加費用）', { x: R - 2.6, y: 2.7, w: 2.6, h: 0.7 });
  }

  // ---------- P46 バリューチェーン ----------
  {
    const s = frame('P46', '1　現状', '【業界】の付加価値の半分は下流の「運営・保守」で生まれるが、【対象】の事業は「製造」に偏る。下流への展開が収益改善の鍵となる', '【業界】のバリューチェーンと付加価値の配分', '（%、【年度】）',
      '使う場面：業界の機能の連なりと、どこで価値（利益・費用）が生まれるかを示す。各段の下に値を置く。注目の段だけ紺。\n差し替え：段の名前、配分、自社の位置。');
    const st = [['企画', 8], ['設計', 12], ['製造', 20], ['販売', 10], ['運営・保守', 50]];
    const n = st.length, cw = (W + 0.15 * (n - 1)) / n;
    st.forEach(([t, v], i) => {
      const x = L + i * (cw - 0.15), key = i === 4;
      s.addShape(i === 0 ? pres.shapes.PENTAGON : pres.shapes.CHEVRON, { x, y: 2.2, w: cw, h: 0.75, fill: { color: key ? NAVY : WHITE }, line: { color: key ? NAVY : G2, width: 1 } });
      txt(s, t, { x: x + 0.3, y: 2.2, w: cw - 0.55, h: 0.75, align: 'center', valign: 'middle', bold: true, color: key ? WHITE : BLACK });
      txt(s, v + '%', { x: x + 0.1, y: 3.2, w: cw - 0.3, h: 0.6, align: 'center', fontSize: 24, bold: true, fontFace: 'Arial', color: key ? NAVY : G1 });
      s.addShape(pres.shapes.RECTANGLE, { x: x + cw / 2 - 0.35, y: 5.9 - v * 0.035, w: 0.5, h: v * 0.035, fill: { color: key ? NAVY : G3 }, line: { type: 'none' } });
    });
    line(s, L, 5.9, W, 0, G3, 0.75);
    txt(s, '【対象】の事業', { x: L + 2 * (cw - 0.15), y: 6.0, w: cw - 0.3, h: 0.3, align: 'center', color: G1 });
  }

  // ---------- P47 分岐と判断（デシジョンツリー） ----------
  {
    const s = frame('P47', '3　打ち手', '【時期】の需要調査で、道は2つに分かれる。利用率30%以上なら拡大し、未満なら縮小して代替手段に移行する判断を1年以内に下す', '判断の分岐', null,
      '使う場面：条件によって取るべき道が分かれることを示す。分岐の条件は数値の閾値で書く。今の時点で最も起こりやすい道、または推奨の道だけ紺。\n差し替え：判断点、条件、それぞれの道と時期。');
    s.addShape(pres.shapes.DIAMOND, { x: L + 0.2, y: 3.45, w: 1.9, h: 1.3, fill: { color: WHITE }, line: { color: G2, width: 1 } });
    txt(s, '需要調査\n【時期】', { x: L + 0.2, y: 3.45, w: 1.9, h: 1.3, align: 'center', valign: 'middle', bold: true });
    [['利用率 30%以上', '拡大する', '便数を1.5倍に増やし、対象地域を広げる', true, 2.3], ['利用率 30%未満', '縮小して移行する', 'デマンド交通に置き換え、費用を4割削減', false, 4.95]].forEach(([cond, way, d, key, y]) => {
      line(s, L + 2.1, 4.1, 0.6, 0, G3, 1); line(s, L + 2.7, Math.min(4.1, y + 0.55), 0, Math.abs(y + 0.55 - 4.1), G3, 1);
      arrow(s, L + 2.7, y + 0.55, 0.5, 0, key ? NAVY : G2, key ? 1.5 : 1);
      txt(s, cond, { x: L + 2.75, y: y + 0.12, w: 2.3, h: 0.3, color: G1, fontSize: 14 });
      box(s, L + 5.2, y, 2.2, 1.1, way, key);
      txt(s, d, { x: L + 7.6, y, w: W - 7.6, h: 1.1, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
    });
  }

  // ---------- P48 外部動向の根拠グリッド ----------
  {
    const s = frame('P48', '1　現状', '4つの外部動向はいずれも従来の事業モデルの前提を弱める方向に働く。中でも【動向1】の影響が最も大きく、5年以内に顕在化する', '事業環境の主な変化', null,
      '使う場面：外部動向（政策・技術・社会・競争）を4つ並べ、それぞれに数字1つと出所を添える。最も影響の大きい動向だけ紺。\n差し替え：動向、数字、出所。');
    const cw = (W - 0.3) / 2, ch = 2.15;
    [['政策', '【動向1】', '【数値】', '2030年までに◯◯を義務化', true], ['技術', '【動向2】', '【数値】', '導入費用が5年で半減', false], ['社会', '【動向3】', '【数値】', '担い手が10年で3割減', false], ['競争', '【動向4】', '【数値】', '新規参入が年【数値】社', false]].forEach(([k, t, v, d, key], i) => {
      const x = L + (i % 2) * (cw + 0.3), y = 2.1 + Math.floor(i / 2) * (ch + 0.2);
      rect(s, x, y, cw, ch, { line: { color: key ? NAVY : G3, width: key ? 1.5 : 0.75 } });
      txt(s, k, { x: x + 0.2, y: y + 0.15, w: 1.0, h: 0.3, color: G1 });
      txt(s, t, { x: x + 0.2, y: y + 0.5, w: cw - 2.2, h: 0.4, bold: true, color: key ? NAVY : BLACK });
      txt(s, v, { x: x + cw - 2.0, y: y + 0.3, w: 1.8, h: 0.8, align: 'right', fontSize: 28, bold: true, color: key ? NAVY : BLACK, fontFace: 'Arial' });
      txt(s, d, { x: x + 0.2, y: y + 1.15, w: cw - 0.4, h: 0.4 });
      txt(s, '出所）【発行主体】「【資料名】」（【年】）', { x: x + 0.2, y: y + 1.65, w: cw - 0.4, h: 0.3, fontSize: 9, color: G1 });
    });
  }

  // ---------- P49 調査の土台 ----------
  {
    const s = frame('P49', '0　全体像', '本資料の結論は、ヒアリング32件、アンケート1,200件、10年分の運行データの3つの調査に基づき、定量と定性の両面で裏付けている', '調査の概要', null,
      '使う場面：冒頭で、結論がどの調査に基づくかを示し、信頼性を担保する。件数・期間・対象を数字で書く。最も重い調査だけ紺。\n差し替え：調査名、件数、期間、対象。');
    const cw = (W - 0.6) / 3;
    [['関係者ヒアリング', '32', '件', '自治体・事業者・利用者団体\n【時期】実施', false], ['利用者アンケート', '1,200', '件', '沿線住民（無作為抽出）\n【時期】実施、回収率【数値】%', true], ['運行データ分析', '10', '年分', '駅別・時間帯別の乗降データ\n【年度】〜【年度】', false]].forEach(([n, v, u, d, key], i) => {
      const x = L + i * (cw + 0.3);
      head(s, x, 2.15, cw, n, key);
      txt(s, [{ text: v, options: { fontSize: 40, bold: true, fontFace: 'Arial', color: key ? NAVY : BLACK } }, { text: ' ' + u, options: { fontSize: 16, color: G1 } }], { x, y: 2.75, w: cw, h: 1.0, valign: 'middle' });
      txt(s, d, { x, y: 3.95, w: cw, h: 1.0 });
    });
  }

  // ---------- P50 進捗ダッシュボード ----------
  {
    const s = frame('P50', '4　実行計画', '6つの取組のうち4つは計画どおりだが、【取組C】は3か月遅れ、年度内の完了が難しい。追加の人員配置を本日決めていただきたい', '取組の進捗', '（【年月】時点）',
      '使う場面：定例報告で、取組ごとの状態を一覧にする。状態は記号と言葉で示し、信号色（赤黄緑）は使わない。遅れている取組の行だけ紺。\n差し替え：取組、状態、進捗率、次の打ち手。');
    const data = [['取組', '状態', '進捗', 'コメント'].map((h, j) => cell(h, { bold: true, align: j === 1 || j === 2 ? 'center' : 'left', border: bottom(G2, 1) }))]
      .concat([['【取組A】', '○ 順調', '80%', '予定どおり【月】に完了'], ['【取組B】', '○ 順調', '60%', '―'], ['【取組C】', '× 遅延', '25%', '3か月遅れ。人員2名の追加が必要'], ['【取組D】', '○ 順調', '50%', '―'], ['【取組E】', '△ 注意', '40%', '関係者の合意待ち（【月】見込み）'], ['【取組F】', '○ 順調', '30%', '―']].map((r, i) => r.map((c, j) => cell(c, { align: j === 1 || j === 2 ? 'center' : 'left', bold: i === 2, color: i === 2 ? NAVY : BLACK, fontFace: j === 2 ? 'Arial' : F, border: bottom() }))));
    s.addTable(data, { x: L, y: 2.1, w: W, colW: [2.4, 1.6, 1.3, W - 5.3], rowH: [0.45, 0.66, 0.66, 0.66, 0.66, 0.66, 0.66] });
  }

  // ---------- P51 画面＋番号付き手順 ----------
  {
    const s = frame('P51', '3　打ち手', '新しい申請は3つの操作で完了し、所要時間は紙の申請の20分から5分に短くなる。最も時間を減らすのは、操作2の自動入力である', '申請画面の操作手順', null,
      '使う場面：画面操作の説明。左に画面（スクリーンショットをそのまま）、右に番号付きの手順。画面上の番号と手順の番号を対応させる。最重要の操作だけ紺。個人情報はぼかす。\n差し替え：画面画像、手順。');
    const sw = 5.2;
    rect(s, L, 2.15, sw, 4.3, { fill: { color: G5 }, line: { color: G3, width: 0.75 } });
    txt(s, '【画面のスクリーンショット】', { x: L, y: 3.95, w: sw, h: 0.4, align: 'center', color: G2 });
    const mk = (n, x, y, key) => { s.addShape(pres.shapes.OVAL, { x, y, w: 0.36, h: 0.36, fill: { color: key ? NAVY : WHITE }, line: { color: NAVY, width: 1 } }); txt(s, String(n), { x, y, w: 0.36, h: 0.36, align: 'center', valign: 'middle', bold: true, color: key ? WHITE : NAVY, fontFace: 'Arial' }); };
    mk(1, L + 0.4, 2.5, false); mk(2, L + 2.6, 3.3, true); mk(3, L + 4.3, 5.7, false);
    const rx = L + sw + 0.4, rw = R - rx;
    [['利用者番号を入力する', '番号は通知書の右上に記載'], ['「自動入力」を押す', '住所・氏名が登録情報から入る（約15分短縮）'], ['内容を確認して送信する', '控えがメールで届く']].forEach(([h, d], i) => {
      const y = 2.2 + i * 1.4, key = i === 1;
      mk(i + 1, rx, y, key);
      txt(s, h, { x: rx + 0.5, y: y - 0.02, w: rw - 0.5, h: 0.4, bold: true, color: key ? NAVY : BLACK });
      txt(s, d, { x: rx + 0.5, y: y + 0.42, w: rw - 0.5, h: 0.6 });
      line(s, rx, y + 1.15, rw, 0, G4, 0.75);
    });
  }

  // ---------- P52 ベン図（重なり） ----------
  {
    const s = frame('P52', '2　課題', '支援が必要な【数値A】世帯のうち、3つの条件が重なる【数値B】世帯が最も支援を要する。まずこの層に絞って支援を始めるべきである', '支援が必要な世帯の重なり', '（世帯、【年度】）',
      '使う場面：複数の条件の重なりを示す。円は3つまで。円は塗らずに線で描き、重なりの中心（または注目の領域）だけ紺。各領域に数を書く。\n差し替え：条件名、各領域の数。');
    const cx = L + 3.2, cy = 4.1, r = 1.35;
    [[cx - 0.75, cy - 0.55, '高齢単身'], [cx + 0.75, cy - 0.55, '移動手段なし'], [cx, cy + 0.65, '低所得']].forEach(([x, y, t], i) => {
      s.addShape(pres.shapes.OVAL, { x: x - r, y: y - r, w: 2 * r, h: 2 * r, fill: { type: 'none' }, line: { color: G2, width: 1.25 } });
      const lx = i === 0 ? x - r - 1.6 : i === 1 ? x + r + 0.1 : x - 0.9;
      const ly = i === 2 ? y + r + 0.05 : y - r + 0.1;
      txt(s, t, { x: lx, y: ly, w: 1.8, h: 0.3, bold: true, align: i === 0 ? 'right' : i === 1 ? 'left' : 'center' });
    });
    s.addShape(pres.shapes.OVAL, { x: cx - 0.35, y: cy - 0.35, w: 0.7, h: 0.7, fill: { color: NAVY }, line: { type: 'none' } });
    txt(s, '【B】', { x: cx - 0.45, y: cy - 0.2, w: 0.9, h: 0.4, align: 'center', bold: true, color: WHITE });
    const rx = L + 6.7;
    txt(s, '3条件すべてに当たる世帯', { x: rx, y: 2.6, w: R - rx, h: 0.35, bold: true, color: NAVY });
    txt(s, '【数値B】世帯', { x: rx, y: 3.0, w: R - rx, h: 0.7, fontSize: 28, bold: true, color: NAVY });
    line(s, rx, 3.85, R - rx, 0, G4, 0.75);
    txt(s, '支援が必要な世帯全体\n【数値A】世帯', { x: rx, y: 4.0, w: R - rx, h: 0.8 });
  }

  // ---------- P53 現場の声（ヒアリングの引用） ----------
  {
    const s = frame('P53', '2　課題', '立場の異なる関係者が共通して「【論点】」を最大の不安に挙げた。数字に表れにくいこの不安への手当てが、合意形成の前提となる', 'ヒアリングで聞かれた声', '（ヒアリング32件より抜粋）',
      '使う場面：定量データを補う定性の根拠。発言は「」で短く引用し、発言者は属性で示す（個人名は出さない）。主張を最も端的に表す発言だけ紺。\n差し替え：発言、属性。');
    [['「【発言1：主張を最も端的に表す声】」', '沿線自治体 交通政策担当', true], ['「【発言2】」', '地元事業者 経営者', false], ['「【発言3】」', '利用者団体 代表', false]].forEach(([q, who, key], i) => {
      const y = 2.2 + i * 1.45;
      line(s, L, y, 0, 1.05, key ? NAVY : G3, key ? 3 : 1.5);
      txt(s, q, { x: L + 0.3, y, w: W - 0.3, h: 0.6, fontSize: key ? 16 : 14, bold: key, color: key ? NAVY : BLACK, valign: 'middle' });
      txt(s, who, { x: L + 0.3, y: y + 0.65, w: W - 0.3, h: 0.35, color: G1 });
    });
  }
  // ---------- P54 図＋右側の示唆帯 ----------
  {
    const s = frame('P54', '1　現状', '【指標】は【属性】ほど低く、最も低い層では全体の半分にとどまる。数字の背景には【理由】があり、支援は最も低い層から始めるべきである', '属性別の【指標】', '（%、n＝【数値】、【調査時期】）',
      '使う場面：左に定量の図、右端の淡いグレーの縦帯に「現場の声」や「示唆」を集約する。公開資料（MCK02-p9、MCK02-p58、MCK03-p21）に多い構成。帯の中の結論の一文だけ紺。\n差し替え：図のデータ、帯の声・示唆。');
    const labels = ['全体', '属性A', '属性B', '属性C', '属性D'].reverse();
    const v = [62, 70, 64, 55, 31].reverse();
    s.addChart(pres.charts.BAR, [{ name: 'その他', labels, values: v.map((x, i) => i === 0 ? 0 : x) }, { name: '注目', labels, values: v.map((x, i) => i === 0 ? x : 0) }],
      Object.assign({}, chartBase, { x: L, y: 2.1, w: 6.2, h: 4.5, barDir: 'bar', barGrouping: 'stacked', barGapWidthPct: 50, chartColors: [G3, NAVY], showValue: true, dataLabelPosition: 'inEnd', dataLabelColor: WHITE, dataLabelFormatCode: '#,##0;;', valAxisMinVal: 0, valAxisMaxVal: 100 }));
    const bx = L + 6.5, bw = R - bx;
    s.addShape(pres.shapes.RECTANGLE, { x: bx, y: 2.1, w: bw, h: 4.5, fill: { color: G5 }, line: { type: 'none' } });
    txt(s, '現場の声', { x: bx + 0.2, y: 2.25, w: bw - 0.4, h: 0.3, bold: true, color: G1 });
    txt(s, '「【声1】」\n「【声2】」', { x: bx + 0.2, y: 2.65, w: bw - 0.4, h: 1.5 });
    line(s, bx + 0.2, 4.35, bw - 0.4, 0, G3, 0.75);
    txt(s, '示唆', { x: bx + 0.2, y: 4.5, w: bw - 0.4, h: 0.3, bold: true, color: G1 });
    txt(s, '【属性D】から支援を始め、【理由】を取り除く', { x: bx + 0.2, y: 4.9, w: bw - 0.4, h: 1.2, bold: true, color: NAVY });
  }

  // ---------- P55 表内ミニバー ----------
  {
    const s = frame('P55', '1　現状', '8つの指標のうち6つで【対象】は平均を下回り、特に【指標3】は平均の半分にとどまる。弱みは【領域】に集中しており、ここを優先して改善する', '指標別の比較', '（比較対象の平均＝100、【年度】）',
      '使う場面：表のまま数値の大小も見せたいとき、数値の横に小さな横棒を入れ、基準値（平均＝100など）を縦の点線で示す。公開資料（MCK03-p42、MCK03-p38）に見られる表とグラフの折衷。最も弱い（強い）行だけ紺。\n差し替え：指標名、指数、基準線の位置。');
    const rows = [['【指標1】', 112], ['【指標2】', 95], ['【指標3】', 50], ['【指標4】', 88], ['【指標5】', 104], ['【指標6】', 76], ['【指標7】', 91], ['【指標8】', 83]];
    const top = 2.1, rh = 0.47, nx = L, nw = 3.0, vx = L + 3.1, vw = 1.0, bx = L + 4.3, scale = 0.035;
    txt(s, '指標', { x: nx, y: top, w: nw, h: 0.35, bold: true });
    txt(s, '指数', { x: vx, y: top, w: vw, h: 0.35, bold: true, align: 'right' });
    line(s, L, top + 0.42, W, 0, G2, 1);
    rows.forEach(([n, v], i) => {
      const y = top + 0.5 + i * rh, key = v === 50;
      txt(s, n, { x: nx, y, w: nw, h: rh, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      txt(s, String(v), { x: vx, y, w: vw, h: rh, valign: 'middle', align: 'right', fontFace: 'Arial', bold: key, color: key ? NAVY : BLACK });
      s.addShape(pres.shapes.RECTANGLE, { x: bx, y: y + 0.13, w: v * scale, h: rh - 0.26, fill: { color: key ? NAVY : G3 }, line: { type: 'none' } });
      line(s, L, y + rh, W, 0, G4, 0.5);
    });
    s.addShape(pres.shapes.LINE, { x: bx + 100 * scale, y: top + 0.45, w: 0, h: rows.length * rh + 0.1, line: { color: G1, width: 1, dashType: 'dash' } });
    txt(s, '平均＝100', { x: bx + 100 * scale - 0.6, y: top + 0.5 + rows.length * rh + 0.1, w: 1.2, h: 0.3, align: 'center', color: G1 });
  }
};
