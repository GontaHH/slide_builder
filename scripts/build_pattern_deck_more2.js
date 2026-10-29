// 追加の型 P34〜P55（2026-10 追加・第2弾）
// 外資系コンサルの公開資料（経産省委託調査報告書など）に多い見せ方と、Jinba 型カタログの残りの型を、本スキルの規定で作り直したもの。
// 2026-10-22：見本の値を架空の値（みなと市のバス事業）にし、箱で囲んだ器を「見出し＋線」に改めた（P44・P48）。下半分が空いた型（P38・P39・P49）に中身を足した。
module.exports = function ({ pres, frame, txt, line, rect, head, rowRule, bullets, chartBase, readout, PANEL_W, band, C }) {
  const { F, NAVY, BLACK, G1, G2, G3, G4, G5, WHITE, L, R, W, BODY_Y, BLUE5 } = C;
  const arrow = (s, x, y, w, h, color, width) => s.addShape(pres.shapes.LINE, { x, y, w, h, line: { color: color || G2, width: width || 1, endArrowType: 'triangle' } });
  const tri = (s, x, y, w, h, color) => require('./hg_arrows.js').hgArrow(pres, s, 'triStroke', x, y, Math.min(w, h) * 1.25, { tone: color === NAVY ? 'accent' : 'gray' });
  const cell = (t, o) => ({ text: t, options: Object.assign({ fontFace: F, fontSize: 14, valign: 'middle', color: BLACK }, o) });
  const bottom = (c, w) => [{ type: 'none' }, { type: 'none' }, { pt: w || 0.75, color: c || G4 }, { type: 'none' }];
  const none = [{ type: 'none' }, { type: 'none' }, { type: 'none' }, { type: 'none' }];
  const num = (o) => Object.assign({ fontFace: 'Arial', fontSize: 12 }, o);   // 図の中の数値は12pt（B-2）
  const box = (s, x, y, w, h, t, key, o) => { rect(s, x, y, w, h, { line: { color: key ? NAVY : G3, width: key ? 1.5 : 0.75 } }); txt(s, t, Object.assign({ x: x + 0.15, y, w: w - 0.3, h, valign: 'middle', align: 'center', bold: key, color: key ? NAVY : BLACK }, o || {})); };

  // ---------- P34 全体マップ ----------
  {
    const s = frame('P34', '0　全体像', '本資料は4つの論点に、論点ごとに現状・課題・打ち手の順で答える。最も重要なのは論点3の支線の扱いであり、第3章で詳しく扱う', '本資料の全体マップ', null,
      '使う場面：本文が11枚以上の資料の冒頭で、論点と章の対応を一望させる。後続ページの章名トラッカーと同じ番号・言葉を使う。最重要の論点だけ紺。\n差し替え：論点、章、ページ範囲。');
    const cols = ['現状', '課題', '打ち手'], lw = 3.6, cw = (W - lw) / 3;
    txt(s, '論点', { x: L, y: 2.1, w: lw, h: 0.3, bold: true });
    cols.forEach((c, j) => txt(s, c, { x: L + lw + j * cw, y: 2.1, w: cw, h: 0.3, bold: true, align: 'center' }));
    line(s, L, 2.48, W, 0, G2, 1);
    [['論点1　利用はどこまで減るか', 'p.4–6', 'p.7–8', 'p.9'], ['論点2　赤字の原因はどこにあるか', 'p.10–11', 'p.12', 'p.13'], ['論点3　支線をどう扱うか', 'p.14–16', 'p.17–19', 'p.20–22'], ['論点4　誰がどう運営するか', 'p.23', 'p.24', 'p.25']].forEach((r, i) => {
      const y = 2.62 + i * 0.95, key = i === 2;
      if (key) s.addShape(pres.shapes.RECTANGLE, { x: L, y: y - 0.08, w: W, h: 0.8, fill: { color: BLUE5 }, line: { type: 'none' } });
      txt(s, r[0], { x: L + 0.1, y, w: lw - 0.2, h: 0.64, valign: 'middle', bold: true, color: key ? NAVY : BLACK });
      r.slice(1).forEach((p, j) => txt(s, p, num({ x: L + lw + j * cw, y, w: cw, h: 0.64, align: 'center', valign: 'middle', color: key ? NAVY : BLACK, bold: key })));
      if (i < 3) rowRule(s, L, y + 0.8, W);
    });
    txt(s, '注）網かけは最も重要な論点', { x: L, y: 6.45, w: W, h: 0.3, fontSize: 11, color: G1 });
  }

  // ---------- P35 イシューツリー（論点分解＋確かめ方） ----------
  {
    const s = frame('P35', '0　全体像', '「支線を残すべきか」には需要・費用・担い手の3つを確かめれば答えられる。答えを最も左右するのは需要であり、調査の資源をここに厚く配分する', '論点の分解と確かめ方', null,
      '使う場面：問いを「答えを決める要素」で分解し、各論点の確かめ方（分析・データ）を右列に置く。進め方の順番ではなく答えの構造で分ける。答えを最も左右する論点だけ紺。\n差し替え：問い、サブ論点、確かめ方。');
    box(s, L, 3.9, 2.3, 1.0, '支線を\n残すべきか', false);
    const subs = [['需要は維持できるか', '人口推計×利用率で2050年までを試算', true], ['費用は賄えるか', '費目別の10年推移と他市の単価を比較', false], ['担い手を確保できるか', '事業者と運転士へのヒアリング（20件）', false]];
    head(s, L + 3.0, 2.1, 3.2, '答えを決める論点');
    head(s, L + 6.5, 2.1, W - 6.5, '確かめ方');
    subs.forEach(([q, how, key], i) => {
      const y = 2.6 + i * 1.3;
      box(s, L + 3.0, y, 3.2, 1.0, q, key);
      line(s, L + 2.3, 4.4, 0.35, 0, G3, 0.75); line(s, L + 2.65, 3.1, 0, 2.6, G3, 0.75); line(s, L + 2.65, y + 0.5, 0.35, 0, key ? NAVY : G3, key ? 1.25 : 0.75);
      txt(s, how, { x: L + 6.5, y, w: W - 6.5, h: 1.0, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      if (i < 2) rowRule(s, L + 6.5, y + 1.15, W - 6.5);
    });
  }

  // ---------- P36 現状と目指す姿（ギャップ表） ----------
  {
    const s = frame('P36', '3　打ち手', '3つの観点すべてで目指す姿との差があり、最も大きいのは1便当たりの乗車人数の差である。この差を埋める打ち手を最優先で講じるべきである', '現状と目指す姿の差', '（2025年度時点、目指す姿は2030年度）',
      '使う場面：観点ごとに現状・目指す姿・差を並べ、打ち手の必要性を示す。差の列を設け、最も大きい差だけ紺。\n差し替え：観点、現状値、目標値、差。');
    const data = [['観点', '現状', '目指す姿', '差'].map((h, j) => cell(h, { bold: true, align: j === 0 ? 'left' : 'center', border: bottom(G2, 1) }))]
      .concat([['1便当たりの乗車人数（人）', '1.2', '2.0', '＋0.8（＋67%）'], ['運賃で賄う費用の割合（%）', '61', '80', '＋19pt'], ['運転士の欠員（人）', '15', '0', '−15']].map((r, i, a) => r.map((c, j) => cell(c, { align: j === 0 ? 'left' : 'center', fontFace: j === 0 ? F : 'Arial', fontSize: j === 3 ? 18 : 14, bold: i === 0 && j === 3, color: i === 0 && j === 3 ? NAVY : BLACK, border: i < a.length - 1 ? bottom() : none }))));
    s.addTable(data, { x: L, y: 2.15, w: W, colW: [3.6, 1.8, 1.8, W - 7.2], rowH: [0.5, 1.2, 1.2, 1.2] });
  }

  // ---------- P37 打ち手の効果表 ----------
  {
    const s = frame('P37', '3　打ち手', '5つの打ち手で年2.4億円の収支改善が見込め、その6割を予約型交通への転換が占める。転換の実現性が、全体の成否を決める', '打ち手ごとの効果と時期', '（億円／年、2030年度時点）',
      '使う場面：打ち手ごとの効果額・着手時期・確度を一覧にする。効果の大きい順に並べ、合計を最下行に置く。最大の打ち手だけ紺。合計は検算する。\n差し替え：打ち手、効果、時期、確度。');
    const rows = [['支線の予約型交通への転換', '1.5', '2027年度', '中'], ['運転士の再配置', '0.4', '2027年度', '高'], ['予約センターの一本化', '0.3', '2028年度', '高'], ['通院向け定額乗車券', '0.1', '2028年度', '中'], ['車両の小型化', '0.1', '2029年度', '低']];
    const data = [['打ち手', '効果', '効果の大きさ', '着手', '確度'].map((h, j) => cell(h, { bold: true, align: j === 0 ? 'left' : 'center', border: bottom(G2, 1) }))]
      .concat(rows.map((r, i) => [cell(r[0], { bold: i === 0, color: i === 0 ? NAVY : BLACK, border: bottom() }), cell(r[1], { align: 'center', fontFace: 'Arial', bold: i === 0, color: i === 0 ? NAVY : BLACK, border: bottom() }), cell('', { border: bottom() }), cell(r[2], { align: 'center', border: bottom() }), cell(r[3], { align: 'center', border: bottom() })]))
      .concat([[cell('合計', { bold: true, border: none }), cell('2.4', { align: 'center', fontFace: 'Arial', bold: true, border: none }), cell('', { border: none }), cell('', { border: none }), cell('', { border: none })]]);
    s.addTable(data, { x: L, y: 2.1, w: W, colW: [3.3, 1.0, 3.2, 1.4, W - 8.9], rowH: [0.45, 0.66, 0.66, 0.66, 0.66, 0.66, 0.66] });
    rows.forEach((r, i) => s.addShape(pres.shapes.RECTANGLE, { x: L + 4.45, y: 2.55 + i * 0.66 + 0.2, w: parseFloat(r[1]) * 1.9, h: 0.26, fill: { color: i === 0 ? NAVY : G3 }, line: { type: 'none' } }));
  }

  // ---------- P38 大型数値の対比 ----------
  {
    const s = frame('P38', '1　現状', 'みなと市の利用者1人当たりの運行費用は類似市の1.6倍で、差は10年で倍に広がった。規模では説明できず、運営方法に原因がある', null, null,
      '使う場面：2つの数値の対比だけで主張が伝わる場合。数値は大きく、算定の前提と内訳を下に添える。言いたい側の数値だけ紺。\n差し替え：2つの数値、単位、内訳、前提。\n作法：数値の下を空けない。比べる2つの数値の内訳を同じ行立てで並べ、差がどこにあるかを示す。');
    const cw = (W - 1.2) / 2;
    const sides = [['みなと市', '369', [['人件費', '255'], ['車両・燃料', '114']], true], ['類似市の平均', '231', [['人件費', '152'], ['車両・燃料', '79']], false]];
    sides.forEach(([n, v, br, key], i) => {
      const x = L + i * (cw + 1.2);
      head(s, x, BODY_Y + 0.05, cw, n, { key, align: 'center' });
      txt(s, [{ text: v, options: { fontSize: 54, bold: true, color: key ? NAVY : G2 } }, { text: '  円／人', options: { fontSize: 16, color: G1 } }], num({ x, y: 2.15, w: cw, h: 1.3, align: 'center', valign: 'middle' }));
      txt(s, '内訳', { x, y: 3.65, w: cw, h: 0.3, fontSize: 14, bold: true, color: G1 });
      rowRule(s, x, 4.02, cw);
      br.forEach(([k, b], j) => {
        const y = 4.12 + j * 0.55;
        txt(s, k, { x, y, w: cw - 1.2, h: 0.45, valign: 'middle' });
        txt(s, b + ' 円', num({ x: x + cw - 1.2, y, w: 1.2, h: 0.45, valign: 'middle', align: 'right', bold: key && j === 0, color: key && j === 0 ? NAVY : BLACK }));
      });
    });
    txt(s, '×1.6', num({ x: L + cw, y: 2.45, w: 1.2, h: 0.6, align: 'center', valign: 'middle', fontSize: 22, bold: true, color: NAVY }));
    rowRule(s, L, 5.45, W);
    txt(s, '差の7割は人件費（運転士1人当たりの乗客数の少なさ）による', { x: L, y: 5.6, w: W, h: 0.35, bold: true, color: NAVY, align: 'center' });
    txt(s, '補足：1人当たり運行費用＝年間運行費用÷年間利用者数。2025年度決算ベース', { x: L, y: 6.1, w: W, h: 0.3, fontSize: 11, color: G1, align: 'center' });
  }

  // ---------- P39 ドットマトリクス（割合） ----------
  {
    const s = frame('P39', '1　現状', '利用者の10人に3人は代わりの移動手段を持たず、その多くは高校生と高齢者である。この層には生活の前提であり、単純な廃止は選べない', '代わりの移動手段がない利用者の割合', '（%、n＝1,200、2026年5月）',
      '使う場面：割合を「100人中◯人」で直感的に示す。100個の点で表し、該当する点だけ紺。割合が1桁や90%台なら棒グラフの方がよい。右に内訳を添えて下を空けない。\n差し替え：割合、設問、内訳の読み取り。');
    const n = 30, X = L + 0.3, Y = 2.2, gap = 0.42;
    for (let i = 0; i < 100; i++) {
      const r = Math.floor(i / 10), c = i % 10;
      s.addShape(pres.shapes.OVAL, { x: X + c * gap, y: Y + r * gap, w: 0.28, h: 0.28, fill: { color: i < n ? NAVY : G4 }, line: { type: 'none' } });
    }
    const rx = X + 10 * gap + 0.5, rw = R - rx;
    txt(s, '30%', num({ x: rx, y: 2.1, w: 3.5, h: 0.95, fontSize: 44, bold: true, color: NAVY }));
    txt(s, '代わりの移動手段がない', { x: rx, y: 3.05, w: rw, h: 0.35, bold: true, color: NAVY });
    head(s, rx, 3.6, rw, '30%の内訳（利用者全体に対する割合）');
    [['高校生', '12%'], ['70歳以上', '11%'], ['その他（通院・障害など）', '7%']].forEach(([k, v], j) => {
      const y = 4.15 + j * 0.62;
      txt(s, k, { x: rx, y, w: rw - 1.0, h: 0.5, valign: 'middle' });
      txt(s, v, num({ x: R - 1.0, y, w: 1.0, h: 0.5, valign: 'middle', align: 'right', bold: j === 0 }));
      if (j < 2) rowRule(s, rx, y + 0.56, rw);
    });
  }

  // ---------- P40 比例円の対比 ----------
  {
    const s = frame('P40', '1　現状', '市内の予約型交通の需要は2035年度までに約3倍の45万回に増え、増加分の大半を通院が占める見込みである。転換の好機は今後5年にある', '予約型交通の年間需要', '（万回、2025年度と2035年度（予測））',
      '使う場面：規模の違いを面積で印象づける。円の面積を値に比例させる（直径ではない）。比較は2〜3個まで。正確な比較が必要なら棒グラフを使う。\n差し替え：値（面積比で直径を計算）、ラベル。');
    const v1 = 100, v2 = 300, k = 0.17;
    const d1 = Math.sqrt(v1) * k, d2 = Math.sqrt(v2) * k;
    const by = 5.6;
    s.addShape(pres.shapes.OVAL, { x: L + 1.6, y: by - d1, w: d1, h: d1, fill: { color: G3 }, line: { type: 'none' } });
    s.addShape(pres.shapes.OVAL, { x: L + 5.0, y: by - d2, w: d2, h: d2, fill: { color: NAVY }, line: { type: 'none' } });
    txt(s, '2025年度\n15万回', { x: L + 1.6 - 0.6, y: by + 0.1, w: d1 + 1.2, h: 0.65, align: 'center' });
    txt(s, '2035年度（予測）\n45万回', { x: L + 5.0 - 0.3, y: by + 0.1, w: d2 + 0.6, h: 0.65, align: 'center', bold: true, color: NAVY });
    arrow(s, L + 1.6 + d1 + 0.2, by - d1 / 2, 5.0 - 1.6 - d1 - 0.4, 0, G2, 1.25);
    txt(s, '約3倍', { x: L + 2.9, y: by - d1 / 2 - 0.45, w: 1.4, h: 0.35, align: 'center', bold: true, color: NAVY });
    const rx = L + 8.2, rw = R - rx;
    head(s, rx, 2.15, rw, '増加分30万回の内訳');
    [['通院', '19万回'], ['買物', '7万回'], ['その他', '4万回']].forEach(([a, b], j) => {
      const y = 2.7 + j * 0.6;
      txt(s, a, { x: rx, y, w: rw - 1.1, h: 0.45, valign: 'middle', bold: j === 0, color: j === 0 ? NAVY : BLACK });
      txt(s, b, num({ x: R - 1.1, y, w: 1.1, h: 0.45, valign: 'middle', align: 'right', bold: j === 0, color: j === 0 ? NAVY : BLACK }));
      if (j < 2) rowRule(s, rx, y + 0.53, rw);
    });
  }

  // ---------- P41 積み上げ縦棒（総量と内訳） ----------
  {
    const s = frame('P41', '1　現状', '高齢者向けの移動支援の費用は10年で4億円増えたが、増加分のほぼすべては通院の送迎による。他の区分は横ばいで、増加は1区分に集中している', '高齢者向け移動支援の費用の推移', '（千万円、2015–2025年度）',
      '使う場面：総量の推移と内訳の両方を示す。棒の上に合計値、系列名は右端に直接書く。注目の系列だけ紺。構成比だけを言いたいなら100%積上げ（P05）を使う。\n差し替え：系列データ、合計、系列名。');
    const labels = ['2015', '2017', '2019', '2021', '2023', '2025'];
    const A = [40, 41, 40, 41, 40, 41], B = [30, 30, 31, 30, 31, 30], Cc = [10, 16, 24, 33, 41, 49];
    s.addChart(pres.charts.BAR, [{ name: '買物の支援', labels, values: A }, { name: '外出の付添い', labels, values: B }, { name: '通院の送迎', labels, values: Cc }],
      Object.assign({}, chartBase, { x: L, y: 2.45, w: 5.4, h: 4.2, barDir: 'col', barGrouping: 'stacked', barGapWidthPct: 40, chartColors: [G2, G3, NAVY], showValue: true, dataLabelPosition: 'ctr', dataLabelColor: WHITE }));
    txt(s, '通院の送迎', { x: L + 5.5, y: 3.05, w: 1.3, h: 0.3, bold: true, color: NAVY, fontSize: 12 });
    txt(s, '外出の付添い', { x: L + 5.5, y: 4.25, w: 1.3, h: 0.3, fontSize: 12 });
    txt(s, '買物の支援', { x: L + 5.5, y: 5.35, w: 1.3, h: 0.3, fontSize: 12 });
    txt(s, '合計 80 → 120', num({ x: L, y: 2.1, w: 5.4, h: 0.3, align: 'center', color: G1 }));
    readout(s, [['10年で4億円増え、12億円になった', '増加の40千万円のうち39千万円が通院の送迎による。買物の支援と外出の付添いは横ばい'],
      ['通院の送迎は5倍になった', '10千万円から49千万円へ。予約型交通に置き換えると、送迎の費用の半分を減らせる見込み（試算）']]);
  }

  // ---------- P42 柱＋土台（戦略の構造） ----------
  {
    const s = frame('P42', '4　提言', '目指す姿は3つの柱と2つの土台で実現する。最も効果が大きいのは支線の転換であり、予約データの基盤が整わなければどの柱も機能しない', '戦略の全体像', null,
      '使う場面：目指す姿・柱（施策群）・土台（共通基盤）の関係を示す。屋根の箱は使わず、線と文字で構造を表す。最重要の柱と、前提となる土台だけ紺。\n差し替え：目指す姿、柱、土台。');
    txt(s, '目指す姿：2030年度までに赤字を半減し、通院と通学の足を守る', { x: L, y: 2.1, w: W, h: 0.5, align: 'center', bold: true, fontSize: 16 });
    line(s, L, 2.75, W, 0, G2, 1.25);
    const pw = (W - 0.6) / 3;
    [['柱1', '支線を転換する', ['12路線を予約型交通に', '乗降地点を病院に置く'], true], ['柱2', '幹線を強くする', ['1時間3本に増やす', '乗継ぎを30分以内に'], false], ['柱3', '収入を増やす', ['通院の定額乗車券', '企業の送迎と統合'], false]].forEach(([k, n, d, key], i) => {
      const x = L + i * (pw + 0.3);
      line(s, x, 2.95, 0, 2.3, key ? NAVY : G3, key ? 2 : 1);
      txt(s, k, { x: x + 0.2, y: 3.0, w: pw - 0.3, h: 0.3, color: key ? NAVY : G1, bold: true });
      txt(s, n, { x: x + 0.2, y: 3.35, w: pw - 0.3, h: 0.4, bold: true, color: key ? NAVY : BLACK });
      bullets(s, d, { x: x + 0.2, y: 3.9, w: pw - 0.3, h: 1.2 });
    });
    line(s, L, 5.4, W, 0, G2, 1.25);
    [['土台1　予約と乗降のデータ基盤', true], ['土台2　推進室と運転士の確保', false]].forEach(([t, key], i) => {
      const x = L + i * (W / 2);
      txt(s, t, { x, y: 5.55, w: W / 2 - 0.2, h: 0.45, align: 'center', valign: 'middle', bold: true, color: key ? NAVY : BLACK });
    });
    line(s, L + W / 2, 5.5, 0, 0.55, G3, 0.75);
  }

  // ---------- P43 プロセス×観点の行列 ----------
  {
    const s = frame('P43', '2　課題', '利用登録の5工程を3観点で点検すると、課題は受付と確認の2工程に集中している。両工程の手作業を減らせば、処理時間を半分にできる', '工程別・観点別の課題', '（2025年度）',
      '使う場面：工程（列）×観点（行）で課題を一覧にする。課題のあるセルだけ短く書き、集中している工程の列を紺の枠で囲む。\n差し替え：工程、観点、課題の短文。');
    const procs = ['申込', '受付', '確認', '登録', '通知'], obs = ['時間', '品質', '費用'];
    const lw = 1.4, cw = (W - lw) / 5, top = 2.15, rh = 1.15;
    procs.forEach((p, j) => s.addShape(j === 0 ? pres.shapes.PENTAGON : pres.shapes.CHEVRON, { x: L + lw + j * cw, y: top, w: j < 4 ? cw + 0.05 : cw, h: 0.5, fill: { color: j === 1 || j === 2 ? NAVY : G3 }, line: { type: 'none' } }));
    procs.forEach((p, j) => txt(s, p, { x: L + lw + j * cw + 0.2, y: top, w: cw - 0.3, h: 0.5, align: 'center', valign: 'middle', bold: true, color: j === 1 || j === 2 ? WHITE : BLACK }));
    const cells = { '0-1': '入力に平均20分', '0-2': '差戻しで3日待ち', '1-2': '誤り率8%', '2-1': '紙の転記が残る', '0-4': '郵送で2日', '2-0': '―' };
    obs.forEach((o, i) => {
      const y = top + 0.7 + i * rh;
      txt(s, o, { x: L, y, w: lw - 0.1, h: rh, valign: 'middle', bold: true, color: G1 });
      if (i < obs.length - 1) rowRule(s, L, y + rh, W);
      procs.forEach((p, j) => { const t = cells[i + '-' + j]; if (t) txt(s, t, { x: L + lw + j * cw + 0.1, y, w: cw - 0.2, h: rh, align: 'center', valign: 'middle', color: j === 1 || j === 2 ? NAVY : BLACK, bold: j === 1 || j === 2 }); });
    });
    s.addShape(pres.shapes.RECTANGLE, { x: L + lw + cw, y: top + 0.6, w: 2 * cw, h: 3 * rh + 0.15, fill: { type: 'none' }, line: { color: NAVY, width: 1.5 } });
  }

  // ---------- P44 時系列マトリクス（年×施策） ----------
  {
    const s = frame('P44', '4　実行計画', '施策は3年で段階的に広げ、2年目の運転士の再配置が3年目の目標達成の鍵となる。初年度は基盤づくりに集中し、成果を急がない', '年度別の取組', '（2027〜2029年度）',
      '使う場面：施策（行）×年度（列）で、いつ何をするかを示す。ガント（P25）より粗い計画向け。各セルは短い動詞句。鍵になるセルだけ淡い紺の面で立てる。\n差し替え：施策、年度、取組。\n作法：セルを1つずつ箱で囲まない。行の線と列の点線で区切り、立てるのは1か所だけ（H-1・H-4）。');
    const yrs = ['2027年度', '2028年度', '2029年度'], lw = 2.8, cw = (W - lw) / 3, top = 2.15, rh = 0.93;
    txt(s, '施策', { x: L, y: top, w: lw, h: 0.35, bold: true });
    yrs.forEach((y, j) => txt(s, y, num({ x: L + lw + j * cw, y: top, w: cw, h: 0.35, align: 'center', bold: true })));
    line(s, L, top + 0.42, W, 0, G2, 1);
    const rows = [['支線の予約型転換', '2地区で試行する', '6路線に広げる', '全12路線に広げる'], ['運転士の再配置', '配置計画を作る', '10人を幹線に移す', '幹線を1時間3本に'], ['予約センター', '―', '窓口を一本化する', '問合せも集約する'], ['推進体制', '推進室を設ける', '人員を2人増やす', '収支を自立させる']];
    rows.forEach((r, i) => {
      const y = top + 0.5 + i * rh;
      txt(s, r[0], { x: L, y, w: lw - 0.1, h: rh - 0.1, valign: 'middle', bold: true });
      r.slice(1).forEach((c, j) => {
        const key = i === 1 && j === 1, x = L + lw + j * cw;
        if (key) s.addShape(pres.shapes.RECTANGLE, { x: x + 0.04, y: y + 0.06, w: cw - 0.08, h: rh - 0.2, fill: { color: BLUE5 }, line: { type: 'none' } });
        txt(s, c, { x: x + 0.1, y, w: cw - 0.2, h: rh - 0.1, align: 'center', valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      });
      if (i < rows.length - 1) rowRule(s, L, y + rh - 0.03, W);
    });
    [1, 2].forEach(j => line(s, L + lw + j * cw, top + 0.5, 0, rows.length * rh - 0.1, G3, 0.75, { line: { color: G3, width: 0.75, dashType: 'sysDot' } }));
    txt(s, '注）網かけは3年目の目標達成の鍵になる取組', { x: L, y: top + 0.6 + rows.length * rh, w: W, h: 0.3, fontSize: 11, color: G1 });
  }

  // ---------- P45 循環サイクル ----------
  {
    const s = frame('P45', '3　打ち手', '便数が増えるほど利用者と収入が増え、さらに便数を増やせる好循環を作れる。最初の1年は、起点となる幹線の増便に投資を集中すべきである', '利用拡大の好循環', null,
      '使う場面：要素が互いに強め合う（または弱め合う）循環を示す。要素は4〜5個。循環の起点だけ紺。悪循環の場合は「断ち切る点」を紺にする。\n差し替え：要素名、起点。');
    const cx = L + W / 2 - 1.2, cy = 4.15, rr = 1.55;
    const items = [['起点：幹線の\n便数を増やす', true], ['待ち時間が減る', false], ['利用者が増える', false], ['運賃収入が増える', false]];
    const pts = items.map((_, i) => { const a = -Math.PI / 2 + i * Math.PI / 2; return [cx + rr * 1.5 * Math.cos(a), cy + rr * Math.sin(a)]; });
    items.forEach(([t, key], i) => box(s, pts[i][0] - 1.1, pts[i][1] - 0.4, 2.2, 0.8, t, key));
    arrow(s, pts[0][0] + 1.15, pts[0][1] + 0.1, pts[1][0] - pts[0][0] - 1.1, pts[1][1] - pts[0][1] - 0.5, G2, 1.25);
    arrow(s, pts[1][0] - 0.2, pts[1][1] + 0.45, pts[2][0] - pts[1][0] + 1.3, pts[2][1] - pts[1][1] - 0.85, G2, 1.25);
    arrow(s, pts[2][0] - 1.15, pts[2][1] - 0.1, pts[3][0] - pts[2][0] + 1.1, pts[3][1] - pts[2][1] + 0.5, G2, 1.25);
    arrow(s, pts[3][0] + 0.2, pts[3][1] - 0.45, pts[0][0] - pts[3][0] - 1.3, pts[0][1] - pts[3][1] + 0.85, G2, 1.25);
    const rx = R - 2.6;
    head(s, rx, 2.15, 2.6, '投資を集中する点', { key: true });
    txt(s, '幹線を1時間2本から3本へ増やす（年3,600万円の追加費用）', { x: rx, y: 2.7, w: 2.6, h: 1.2 });
  }

  // ---------- P46 バリューチェーン ----------
  {
    const s = frame('P46', '1　現状', '地域交通の付加価値の半分は下流の運行管理と予約で生まれるが、市内の事業者は車両の運行に偏る。下流への展開が収益改善の鍵となる', '地域交通の機能別の付加価値の配分', '（%、2025年度）',
      '使う場面：業界の機能の連なりと、どこで価値（利益・費用）が生まれるかを示す。各段の下に値を置く。注目の段だけ紺。\n差し替え：段の名前、配分、自社の位置。');
    const st = [['路線の計画', 8], ['車両の調達', 12], ['車両の運行', 20], ['案内・販売', 10], ['運行管理・予約', 50]];
    const n = st.length, cw = (W + 0.15 * (n - 1)) / n;
    st.forEach(([t, v], i) => {
      const x = L + i * (cw - 0.15), key = i === 4;
      s.addShape(i === 0 ? pres.shapes.PENTAGON : pres.shapes.CHEVRON, { x, y: 2.2, w: cw, h: 0.75, fill: { color: key ? NAVY : G3 }, line: { type: 'none' } });
      txt(s, t, { x: x + 0.3, y: 2.2, w: cw - 0.55, h: 0.75, align: 'center', valign: 'middle', bold: true, color: key ? WHITE : BLACK });
      txt(s, v + '%', num({ x: x + 0.1, y: 3.2, w: cw - 0.3, h: 0.6, align: 'center', fontSize: 24, bold: true, color: key ? NAVY : G1 }));
      s.addShape(pres.shapes.RECTANGLE, { x: x + cw / 2 - 0.35, y: 5.9 - v * 0.035, w: 0.5, h: v * 0.035, fill: { color: key ? NAVY : G3 }, line: { type: 'none' } });
    });
    line(s, L, 5.9, W, 0, G3, 0.75);
    txt(s, '市内事業者の主な事業', { x: L + 2 * (cw - 0.15) - 0.2, y: 6.0, w: cw + 0.1, h: 0.3, align: 'center', color: G1 });
  }

  // ---------- P47 分岐と判断（デシジョンツリー） ----------
  {
    const s = frame('P47', '3　打ち手', '2027年度末の試行の結果で、道は2つに分かれる。継続利用率80%以上なら全支線に広げ、未満なら対象を通院に絞って運行区域を縮める', '判断の分岐', null,
      '使う場面：条件によって取るべき道が分かれることを示す。分岐の条件は数値の閾値で書く。今の時点で最も起こりやすい道、または推奨の道だけ紺。\n差し替え：判断点、条件、それぞれの道と時期。');
    s.addShape(pres.shapes.DIAMOND, { x: L + 0.2, y: 3.45, w: 1.9, h: 1.3, fill: { color: WHITE }, line: { color: G2, width: 1 } });
    txt(s, '試行の結果\n2027年度末', { x: L + 0.2, y: 3.45, w: 1.9, h: 1.3, align: 'center', valign: 'middle', bold: true });
    [['継続利用率 80%以上', '全支線に広げる', '2030年度までに12路線を転換し、運転士を幹線へ移す', true, 2.3], ['継続利用率 80%未満', '対象を絞る', '通院の時間帯に絞って運行し、費用を4割抑える', false, 4.95]].forEach(([cond, way, d, key, y]) => {
      line(s, L + 2.1, 4.1, 0.6, 0, G3, 1); line(s, L + 2.7, Math.min(4.1, y + 0.55), 0, Math.abs(y + 0.55 - 4.1), G3, 1);
      arrow(s, L + 2.7, y + 0.55, 0.5, 0, key ? NAVY : G2, key ? 1.5 : 1);
      txt(s, cond, { x: L + 2.75, y: y + 0.08, w: 2.4, h: 0.3, color: G1, fontSize: 14 });
      box(s, L + 5.2, y, 2.2, 1.1, way, key);
      txt(s, d, { x: L + 7.6, y, w: W - 7.6, h: 1.1, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
    });
  }

  // ---------- P48 外部動向の根拠グリッド ----------
  {
    const s = frame('P48', '1　現状', '4つの外部動向はいずれも、運転士と定時便に頼る今の運行の前提を弱める方向に働く。中でも運転士の不足の影響が最も大きく、5年以内に表面化する', '事業環境の主な変化', null,
      '使う場面：外部動向（政策・技術・社会・競争）を4つ並べ、それぞれに数字1つと出所を添える。最も影響の大きい動向だけ紺。\n差し替え：動向、数字、出所。\n作法：4つの枠を箱で囲まない。各欄を「区分＋見出しの線」で始め、数字・説明・出所を同じ位置にそろえる（H-1）。');
    const cw = (W - 0.5) / 2, ch = 2.15;
    [['社会', '運転士が足りなくなる', '−3割', '大型二種免許の保有者は10年で3割減る', '国の運転免許統計を基に推計', true], ['政策', '運転時間の上限が厳しくなる', '年3,300時間', '2024年度から運転士の拘束時間に上限', '改正後の基準による', false],
      ['技術', '予約型の配車システムが安くなる', '−50%', '導入費用は5年で半分になった', '事業者3社への聞き取り', false], ['競争', '病院・商業施設の送迎が増える', '年12路線', '市内で新たに始まった送迎の数', '市の届出の集計', false]].forEach(([k, t, v, d, src, key], i) => {
      const x = L + (i % 2) * (cw + 0.5), y = 2.1 + Math.floor(i / 2) * (ch + 0.25);
      head(s, x, y, cw, k + '　' + t, { key });
      if (key) band(s, x, y + 0.45, cw, ch - 0.45);
      txt(s, v, num({ x, y: y + 0.55, w: cw, h: 0.75, fontSize: 30, bold: true, color: key ? NAVY : BLACK }));
      txt(s, d, { x, y: y + 1.35, w: cw, h: 0.35 });
      txt(s, '出所）' + src + '（架空）', { x, y: y + 1.75, w: cw, h: 0.28, fontSize: 9, color: G1 });
    });
  }

  // ---------- P49 調査の土台 ----------
  {
    const s = frame('P49', '0　全体像', '本資料の結論は、ヒアリング32件、アンケート1,200件、10年分の運行データの3つの調査に基づき、定量と定性の両面で裏付けている', '調査の概要', null,
      '使う場面：冒頭で、結論がどの調査に基づくかを示し、信頼性を担保する。件数・期間・対象を数字で書き、各調査を本資料のどこで使ったかを添える。最も重い調査だけ紺。\n差し替え：調査名、件数、期間、対象、使った箇所。\n作法：数字の下を空けない。対象・時期・使った章を行見出しで並べる。');
    const lw = 1.3, cw = (W - lw - 0.6) / 3;
    const cols = [['関係者ヒアリング', '32', '件', '自治体・事業者・利用者団体', '2026年4〜6月', '第2章（課題）', false], ['利用者アンケート', '1,200', '件', '沿線住民（無作為抽出3,000人）', '2026年5月、回収率40%', '第1章・第3章', true], ['運行データ分析', '10', '年分', '路線別・時間帯別の乗降データ', '2015〜2025年度', '第1章（現状）', false]];
    cols.forEach(([n, v, u, who, when, used, key], i) => {
      const x = L + lw + i * (cw + 0.3);
      head(s, x, 2.08, cw, n, { key });
      txt(s, [{ text: v, options: { fontSize: 40, bold: true, fontFace: 'Arial', color: key ? NAVY : BLACK } }, { text: ' ' + u, options: { fontSize: 16, color: G1 } }], { x, y: 2.55, w: cw, h: 1.0, valign: 'middle' });
      [who, when, used].forEach((t, j) => txt(s, t, { x, y: 3.85 + j * 0.85, w: cw, h: 0.7, valign: 'middle', bold: key && j === 2, color: key && j === 2 ? NAVY : BLACK }));
    });
    ['対象', '時期', '使った章'].forEach((k, j) => {
      txt(s, k, { x: L, y: 3.85 + j * 0.85, w: lw - 0.1, h: 0.7, valign: 'middle', bold: true, color: G1 });
      rowRule(s, L, 3.78 + j * 0.85, W);
    });
  }

  // ---------- P50 進捗ダッシュボード ----------
  {
    const s = frame('P50', '4　実行計画', '6つの取組のうち4つは計画どおりだが、予約システムの整備は3か月遅れ、年度内の完了が難しい。追加の人員配置を本日決めていただきたい', '取組の進捗', '（2026年9月末時点）',
      '使う場面：定例報告で、取組ごとの状態を一覧にする。状態は記号と言葉で示し、信号色（赤黄緑）は使わない。遅れている取組の行だけ紺。\n差し替え：取組、状態、進捗率、次の打ち手。');
    const rows = [['利用実態の調査', '○ 順調', '80%', '予定どおり10月に完了'], ['事業者との協議', '○ 順調', '60%', '―'], ['予約システムの整備', '× 遅延', '25%', '3か月遅れ。人員2名の追加が必要'], ['運行規程の改定', '○ 順調', '50%', '―'], ['乗降地点の選定', '△ 注意', '40%', '病院との合意待ち（11月見込み）'], ['車両の調達', '○ 順調', '30%', '―']];
    const data = [['取組', '状態', '進捗', 'コメント'].map((h, j) => cell(h, { bold: true, align: j === 1 || j === 2 ? 'center' : 'left', border: bottom(G2, 1) }))]
      .concat(rows.map((r, i) => r.map((c, j) => cell(c, { align: j === 1 || j === 2 ? 'center' : 'left', bold: i === 2, color: i === 2 ? NAVY : BLACK, fontFace: j === 2 ? 'Arial' : F, border: i < rows.length - 1 ? bottom() : none }))));
    s.addTable(data, { x: L, y: 2.1, w: W, colW: [2.8, 1.5, 1.2, W - 5.5], rowH: [0.45, 0.68, 0.68, 0.68, 0.68, 0.68, 0.68] });
  }

  // ---------- P51 画面＋番号付き手順 ----------
  {
    const s = frame('P51', '3　打ち手', '新しい予約は3つの操作で完了し、所要時間は電話予約の8分から2分に短くなる。最も時間を減らすのは、操作2の乗車地点の自動入力である', '予約画面の操作手順', null,
      '使う場面：画面操作の説明。左に画面（スクリーンショットをそのまま）、右に番号付きの手順。画面上の番号と手順の番号を対応させる。最重要の操作だけ紺。個人情報はぼかす。\n差し替え：画面画像、手順。\n作法：画像を入れる予定の灰色の面は作業中だけ。相手に出す版には残さない。');
    const sw = 5.2;
    s.addShape(pres.shapes.RECTANGLE, { x: L, y: 2.15, w: sw, h: 4.3, fill: { color: G5 }, line: { type: 'none' } });
    txt(s, '予約画面のスクリーンショットを入れる', { x: L, y: 3.95, w: sw, h: 0.4, align: 'center', color: G2 });
    const mk = (n, x, y, key) => { s.addShape(pres.shapes.OVAL, { x, y, w: 0.36, h: 0.36, fill: { color: key ? NAVY : WHITE }, line: { color: NAVY, width: 1 } }); txt(s, String(n), num({ x, y, w: 0.36, h: 0.36, align: 'center', valign: 'middle', bold: true, color: key ? WHITE : NAVY })); };
    mk(1, L + 0.4, 2.5, false); mk(2, L + 2.6, 3.3, true); mk(3, L + 4.3, 5.7, false);
    const rx = L + sw + 0.4, rw = R - rx;
    [['利用者番号を入力する', '番号は乗車証の右上に記載'], ['「いつもの乗車地点」を押す', '乗車地点と行き先が過去の予約から入る（約5分短縮）'], ['時刻を選んで予約する', '前日の夕方に確認の通知が届く']].forEach(([h, d], i) => {
      const y = 2.2 + i * 1.4, key = i === 1;
      mk(i + 1, rx, y, key);
      txt(s, h, { x: rx + 0.5, y: y - 0.02, w: rw - 0.5, h: 0.4, bold: true, color: key ? NAVY : BLACK });
      txt(s, d, { x: rx + 0.5, y: y + 0.42, w: rw - 0.5, h: 0.6 });
      if (i < 2) rowRule(s, rx, y + 1.15, rw);
    });
  }

  // ---------- P52 ベン図（重なり） ----------
  {
    const s = frame('P52', '2　課題', '移動の支援が要る3,400世帯のうち、3つの条件が重なる620世帯が最も支援を要する。まずこの層に絞って、予約型交通の乗降地点を決めるべきである', '移動の支援が要る世帯の重なり', '（世帯、2026年5月）',
      '使う場面：複数の条件の重なりを示す。円は3つまで。円は塗らずに線で描き、重なりの中心（または注目の領域）だけ紺。各領域に数を書く。\n差し替え：条件名、各領域の数。');
    const cx = L + 3.2, cy = 4.1, r = 1.35;
    [[cx - 0.75, cy - 0.55, '高齢の単身'], [cx + 0.75, cy - 0.55, '車を持たない'], [cx, cy + 0.65, '駅から2km以上']].forEach(([x, y, t], i) => {
      s.addShape(pres.shapes.OVAL, { x: x - r, y: y - r, w: 2 * r, h: 2 * r, fill: { type: 'none' }, line: { color: G2, width: 1.25 } });
      const lx = i === 0 ? x - r - 1.6 : i === 1 ? x + r + 0.1 : x - 0.9;
      const ly = i === 2 ? y + r + 0.05 : y - r + 0.1;
      txt(s, t, i === 0 ? { x: L, y: ly, w: x - r - 0.05 - L, h: 0.3, bold: true, align: 'right' } : { x: lx, y: ly, w: 1.8, h: 0.3, bold: true, align: i === 1 ? 'left' : 'center' });
    });
    s.addShape(pres.shapes.OVAL, { x: cx - 0.4, y: cy - 0.35, w: 0.8, h: 0.7, fill: { color: NAVY }, line: { type: 'none' } });
    txt(s, '620', num({ x: cx - 0.45, y: cy - 0.2, w: 0.9, h: 0.4, align: 'center', bold: true, color: WHITE }));
    const rx = L + 6.7;
    head(s, rx, 2.15, R - rx, '3条件すべてに当たる世帯', { key: true });
    txt(s, '620世帯', { x: rx, y: 2.75, w: R - rx, h: 0.7, fontSize: 28, bold: true, color: NAVY });
    rowRule(s, rx, 3.65, R - rx);
    txt(s, '移動の支援が要る世帯全体', { x: rx, y: 3.8, w: R - rx, h: 0.35 });
    txt(s, '3,400世帯', num({ x: rx, y: 4.15, w: R - rx, h: 0.45, fontSize: 20, bold: true }));
    txt(s, '補足：いずれか1つ以上に当たる世帯の合計', { x: rx, y: 4.7, w: R - rx, h: 0.6, fontSize: 11, color: G1 });
  }

  // ---------- P53 現場の声（ヒアリングの引用） ----------
  {
    const s = frame('P53', '2　課題', '立場の異なる関係者が共通して、通院の足がなくなることを最大の不安に挙げた。数字に表れにくいこの不安への手当てが、合意形成の前提となる', 'ヒアリングで聞かれた声', '（ヒアリング32件より抜粋）',
      '使う場面：定量データを補う定性の根拠。発言は「」で短く引用し、発言者は属性で示す（個人名は出さない）。主張を最も端的に表す発言だけ紺。\n差し替え：発言、属性。');
    [['「バスがなくなったら、週2回の通院をどうすればよいのか分からない」', '沿線の高齢者（80代、一人暮らし）', true], ['「予約型になっても、病院の前で乗り降りできるなら困らない」', '沿線自治会 会長', false], ['「運転士が足りず、今の便数を保つだけで精一杯だ」', 'バス会社 運行管理者', false]].forEach(([q, who, key], i) => {
      const y = 2.2 + i * 1.45;
      line(s, L, y, 0, 1.05, key ? NAVY : G3, key ? 3 : 1.5);
      if (key) band(s, L, y, W, 1.05);
      txt(s, q, { x: L + 0.3, y, w: W - 0.3, h: 0.6, fontSize: key ? 16 : 14, bold: key, color: key ? NAVY : BLACK, valign: 'middle' });
      txt(s, who, { x: L + 0.3, y: y + 0.65, w: W - 0.3, h: 0.35, color: G1 });
    });
  }
  // ---------- P54 図＋右側の示唆帯 ----------
  {
    const s = frame('P54', '1　現状', 'バスの満足度は年代が上がるほど低く、80代以上は全体の半分にとどまる。背景には停留所の遠さがあり、支援は80代以上から始めるべきである', '年代別のバスの満足度', '（「満足」「やや満足」の計、%、n＝1,200、2026年5月）',
      '使う場面：左に定量の図、右端の淡い縦帯に読み取りと示唆を集約する。公開資料（MCK02-p9、MCK04-p9・p17・p27）に多い構成。帯は2〜3つの段に分け、各段を「太字の一文（言いたいこと）＋本文2〜3行（根拠・例）」で書く。段の間は細い線で区切る。帯の中で紺にするのは結論の段の太字だけ。\n差し替え：図のデータ、帯の各段。');
    const labels = ['全体', '〜50代', '60代', '70代', '80代以上'].reverse();
    const v = [62, 70, 64, 55, 31].reverse();
    s.addChart(pres.charts.BAR, [{ name: 'その他', labels, values: v.map((x, i) => i === 0 ? 0 : x) }, { name: '注目', labels, values: v.map((x, i) => i === 0 ? x : 0) }],
      Object.assign({}, chartBase, { x: L, y: 2.1, w: 6.2, h: 4.5, barDir: 'bar', barGrouping: 'stacked', barGapWidthPct: 40, chartColors: [G3, NAVY], showValue: true, dataLabelPosition: 'inEnd', dataLabelColor: WHITE, dataLabelFormatCode: '#,##0;;', valAxisMinVal: 0, valAxisMaxVal: 100 }));
    const bx = L + 6.5, bw = R - bx;
    s.addShape(pres.shapes.RECTANGLE, { x: bx, y: 2.1, w: bw, h: 4.5, fill: { color: G5 }, line: { type: 'none' } });
    const blocks = [['80代以上の満足は31%で、全体の半分にとどまる', '不満の理由の6割が「停留所が遠い・坂道がある」（自由回答）'],
      ['80代以上の多い地区から予約型を始めるべきである', '乗降地点を病院と自宅の前に置き、停留所まで歩く負担をなくす', true]];
    blocks.forEach(([lead, body, key], i) => {
      const y = 2.3 + i * 2.15;
      if (i) line(s, bx + 0.2, y - 0.2, bw - 0.4, 0, G3, 0.75);
      txt(s, lead, { x: bx + 0.2, y, w: bw - 0.4, h: 0.7, bold: true, color: key ? NAVY : BLACK });
      txt(s, body, { x: bx + 0.2, y: y + 0.75, w: bw - 0.4, h: 0.9 });
    });
  }

  // ---------- P55 表内ミニバー ----------
  {
    const s = frame('P55', '1　現状', '8つの指標のうち6つでみなと市は類似市の平均を下回り、特に1便当たりの乗車人数は平均の半分にとどまる。弱みは運行の効率に集中している', '指標別の比較', '（類似市の平均＝100、2025年度）',
      '使う場面：表のまま数値の大小も見せたいとき、数値の横に小さな横棒を入れ、基準値（平均＝100など）を縦の点線で示す。公開資料（MCK03-p42、MCK03-p38）に見られる表とグラフの折衷。最も弱い（強い）行だけ紺。\n差し替え：指標名、指数、基準線の位置。');
    const rows = [['人口当たりの運行本数', 112], ['1人当たりの利用回数', 95], ['1便当たりの乗車人数', 50], ['運賃で賄う費用の割合', 88], ['停留所までの近さ', 104], ['定時に運行した割合', 76], ['乗継ぎの待ち時間の短さ', 91], ['利用者の満足度', 83]];
    const top = 2.1, rh = 0.5, nx = L, nw = 3.4, vx = L + 3.5, vw = 0.8, bx = L + 4.6, scale = 0.035;
    txt(s, '指標', { x: nx, y: top, w: nw, h: 0.35, bold: true });
    txt(s, '指数', { x: vx, y: top, w: vw, h: 0.35, bold: true, align: 'right' });
    line(s, L, top + 0.42, W, 0, G2, 1);
    rows.forEach(([n, v], i) => {
      const y = top + 0.5 + i * rh, key = v === 50;
      txt(s, n, { x: nx, y, w: nw, h: rh, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      txt(s, String(v), num({ x: vx, y, w: vw, h: rh, valign: 'middle', align: 'right', bold: key, color: key ? NAVY : BLACK }));
      s.addShape(pres.shapes.RECTANGLE, { x: bx, y: y + 0.13, w: v * scale, h: rh - 0.26, fill: { color: key ? NAVY : G3 }, line: { type: 'none' } });
      if (i < rows.length - 1) line(s, L, y + rh, W, 0, G4, 0.75);
    });
    s.addShape(pres.shapes.LINE, { x: bx + 100 * scale, y: top + 0.45, w: 0, h: rows.length * rh + 0.1, line: { color: G1, width: 1, dashType: 'dash' } });
    txt(s, '平均＝100', { x: bx + 100 * scale - 0.6, y: top + 0.5 + rows.length * rh + 0.1, w: 1.2, h: 0.3, align: 'center', color: G1 });
  }
};
