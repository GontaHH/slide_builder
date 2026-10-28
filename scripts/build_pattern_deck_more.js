// 追加の型 P21〜P33（2026-10 追加）
// Jinba consulting-pptx-skill の型カタログ（62型）と外資系コンサルの公開資料の作法を参考に、
// 既存20型で不足していた「構造で通す」「進め方・計画」「提示・締め」「数字で証明（シナリオ・感度）」を補う。
// 2026-10-22：見本の値を架空の値（みなと市のバス事業）にし、箱で囲んだ器を「見出し＋線」に改めた（P22・P23・P32）。
module.exports = function ({ pres, frame, txt, line, rect, readout, PANEL_W, head, rowRule, bullets, chartBase, C }) {
  const { F, NAVY, BLACK, G1, G2, G3, G4, G5, WHITE, L, R, W, BODY_Y, BLUE5 } = C;
  const tri = (s, x, y, w, h, color) => require('./hg_arrows.js').hgArrow(pres, s, 'triStroke', x, y, Math.min(w, h) * 1.25, { tone: color === NAVY ? 'accent' : 'gray' });
  const arrow = (s, x, y, w, h, color, width) => s.addShape(pres.shapes.LINE, { x, y, w, h, line: { color: color || G2, width: width || 1, endArrowType: 'triangle' } });
  const cell = (t, o) => ({ text: t, options: Object.assign({ fontFace: F, fontSize: 14, valign: 'middle', color: BLACK, }, o) });
  const bottom = (c, w) => [{ type: 'none' }, { type: 'none' }, { pt: w || 0.75, color: c || G4 }, { type: 'none' }];
  const none = [{ type: 'none' }, { type: 'none' }, { type: 'none' }, { type: 'none' }];
  const num = (o) => Object.assign({ fontFace: 'Arial', fontSize: 12 }, o);   // 図の中の数値は12pt（B-2）

  // ---------- P21 前提→帰結（左に図、右に読み取り） ----------
  {
    const s = frame('P21', '2　課題', '赤字4.2億円の7割は支線12路線で生じている。対策の対象を支線に絞れば、限られた予算でも赤字を大きく減らせる', null, null,
      '使う場面：左の図（前提）から、右の読み取り（帰結）を導く。強い因果があるときだけ中央にグレーの三角を1つ置く。右の項目は左の図のどこの話かを番号で対応させる。\n差し替え：左の図、右の読み取り3点。');
    const lw = 4.9;
    head(s, L, BODY_Y, lw, '路線区分別の赤字（億円、2025年度）');
    const labels = ['支線（12路線）', '幹線（4路線）', '循環線', '深夜便'];
    s.addChart(pres.charts.BAR, [
      { name: 'その他', labels, values: [0, 0.6, 0.4, 0.3] },
      { name: '注目', labels, values: [2.9, 0, 0, 0] },
    ], Object.assign({}, chartBase, { x: L, y: 2.1, w: lw, h: 4.4, barDir: 'bar', barGrouping: 'stacked', barGapWidthPct: 40, chartColors: [G3, NAVY], showValue: true, dataLabelPosition: 'inEnd', dataLabelColor: WHITE, dataLabelFormatCode: '0.0;;', catAxisOrientation: 'maxMin' }));
    tri(s, L + lw + 0.12, 3.9, 0.45, 0.32, G2);
    const rx = L + lw + 0.75, rw = R - rx;
    head(s, rx, BODY_Y, rw, '読み取り', { key: true });
    [['赤字の7割は支線', '支線12路線だけで年2.9億円の赤字'], ['幹線・循環線の赤字は小さい', '合わせて年1.3億円で、急ぐ必要は小さい'], ['対象を支線に絞る', '転換費用1.2億円で赤字を半減できる']].forEach(([h, b], i) => {
      const y = 2.15 + i * 1.45;
      txt(s, String(i + 1), num({ x: rx, y, w: 0.3, h: 0.32, bold: true, color: i === 0 ? NAVY : G1 }));
      txt(s, h, { x: rx + 0.35, y, w: rw - 0.35, h: 0.32, bold: true, color: i === 0 ? NAVY : BLACK });
      txt(s, b, { x: rx + 0.35, y: y + 0.4, w: rw - 0.35, h: 0.6 });
      if (i < 2) rowRule(s, rx, y + 1.18, rw);
    });
  }

  // ---------- P22 SCR（状況・課題・解決） ----------
  {
    const s = frame('P22', '0　全体像', 'バス事業を支えてきた通学需要は、生徒数の減少で崩れつつある。支線を予約型交通に転換すれば、5年で赤字を半減できる', null, null,
      '使う場面：冒頭やエグゼクティブサマリーの前で、話の骨格を3段で示す。課題は「未達の原因」だけを書き、解決は課題と1対1で対応させる（同じ行に置く）。解決の列だけ紺。「Situation」などの枠組みの名前は紙面に出さない。\n差し替え：各段の見出しと根拠2点。\n作法：項目を箱で囲まず、見出しの線と行の線で組む。段の間の三角は見出しの行に1つずつ。');
    const cw = (W - 0.6) / 3, top = BODY_Y, rh = 1.42, y0 = top + 1.0;
    const cols = [['状況', 'これまでの前提', ['通学の需要で、幹線も支線も乗客を確保できた', '運賃収入で費用の8割を賄えた', '市の補助は年1億円で足りていた']],
      ['課題', '前提が崩れた原因', ['生徒数が10年で35%減り、支線の乗客が半減した', '運転士の賃金上昇で、費用が年1.1億円増えた', '赤字が補助の上限を年3.2億円上回った']],
      ['解決', 'とるべき打ち手', ['支線を予約型交通に転換し、需要に合わせて運ぶ', '運転士を幹線に集め、1人当たりの乗客を増やす', '補助を転換費用に充て、5年で赤字を半減する']]];
    cols.forEach(([k, sub, items], i) => {
      const x = L + i * (cw + 0.3), key = i === 2;
      txt(s, k, { x, y: top, w: cw, h: 0.4, fontSize: 18, bold: true, color: key ? NAVY : BLACK });
      txt(s, sub, { x, y: top + 0.42, w: cw, h: 0.3, color: G1 });
      line(s, x, top + 0.8, cw, 0, key ? NAVY : G2, key ? 1.25 : 1.0);
      items.forEach((t, j) => {
        const y = y0 + j * rh;
        txt(s, String(j + 1), num({ x, y: y + 0.1, w: 0.3, h: 0.35, bold: true, color: key ? NAVY : G1 }));
        txt(s, t, { x: x + 0.35, y: y + 0.1, w: cw - 0.4, h: rh - 0.4, bold: key, color: key ? NAVY : BLACK });
        if (j < items.length - 1) rowRule(s, x, y + rh - 0.15, cw);
      });
      if (i < 2) tri(s, x + cw + 0.05, top + 0.3, 0.22, 0.18, G2);
    });
  }

  // ---------- P23 課題と打ち手の対応 ----------
  {
    const s = frame('P23', '3　打ち手', '課題ごとに打ち手を対応させると、効果が最も大きいのは支線の予約型交通への転換である。他の打ち手より先に、ここへ資源を集中すべきである', '課題と打ち手の対応', '（効果は赤字の削減額、億円／年）',
      '使う場面：課題と打ち手を1対1で対応させる。打ち手のない課題、課題のない打ち手を作らない。最優先の組だけ紺。\n差し替え：課題、打ち手、効果の目安。\n作法：課題と打ち手を箱で囲まず、行で対応させる。課題→打ち手の向きは見出しの行に三角を1つだけ置いて示し、行ごとに矢印を繰り返さない。');
    const cw = 4.2, gx = L + cw + 0.6, ew = R - (gx + cw) - 0.1, top = 2.15, rh = 1.2;
    head(s, L, top, cw, '課題');
    head(s, gx, top, cw, '打ち手');
    head(s, gx + cw + 0.1, top, ew, '効果', { align: 'right' });
    tri(s, L + cw + 0.18, top + 0.08, 0.26, 0.2, G2);
    [['通学需要の減少で、支線の乗客が半減した', '支線12路線を予約型交通に転換する', '1.6'], ['運転士の不足で、幹線を増便できない', '支線の運転士を幹線へ再配置する', '0.5'], ['予約と案内が事業者ごとに分かれている', '予約センターで窓口を一本化する', '0.3']].forEach(([a, b, e], i) => {
      const y = top + 0.55 + i * rh, key = i === 0;
      txt(s, String(i + 1), num({ x: L, y, w: 0.3, h: rh - 0.2, valign: 'middle', bold: true, color: key ? NAVY : G1 }));
      txt(s, a, { x: L + 0.35, y, w: cw - 0.35, h: rh - 0.2, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      txt(s, b, { x: gx, y, w: cw, h: rh - 0.2, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      txt(s, e, num({ x: gx + cw + 0.1, y, w: ew, h: rh - 0.2, valign: 'middle', align: 'right', fontSize: 20, bold: true, color: key ? NAVY : G1 }));
      if (i < 2) rowRule(s, L, y + rh - 0.1, W);
    });
    txt(s, '合計　2.4', num({ x: gx, y: top + 0.55 + 3 * rh, w: R - gx, h: 0.35, bold: true, align: 'right' }));
  }

  // ---------- P24 矢羽（プロセス・変遷） ----------
  {
    const s = frame('P24', '4　実行計画', '導入は1年で進め、利用者に影響が出るのは2027年1月の試行からである。12月までに車両と運転士を揃えることが、計画どおり進む条件となる', '導入の工程', '（2026年4月〜2027年4月）',
      '使う場面：工程・手順・変遷を左から右へ。4〜6工程。今回決める工程・最も重要な工程だけ紺。各工程の下に、期間・何をするか・誰がするか・終わりの条件を、工程と1対1の列で書く。\n差し替え：工程名、期間、内容、担当、条件。\n作法：矢羽の下に別の内容を積まない。下半分を空けず、行見出しで中身を並べる。');
    const n = 5, lw = 1.25, gx = L + lw, cw = (W - lw + 0.15 * (n - 1)) / n, top = 2.12;
    const steps = [['現状把握', '4〜6月', '乗降データで利用の実態を調べる', '市 交通政策課', '支線ごとの需要が分かる'], ['設計', '7〜9月', '運行区域と予約のルールを決める', '市・バス会社', '協議会で承認される'],
      ['準備', '10〜12月', '車両と運転士を用意する', 'バス会社', '車両8台と運転士10人'], ['試行', '2027年1〜3月', '2地区で予約型を試す', 'バス会社', '継続利用率80%以上'], ['本格運用', '2027年4月〜', '支線に順次広げる', '市・バス会社', '―']];
    const rowsY = [top + 0.85, top + 1.45, top + 2.45, top + 3.05];
    ['期間', 'やること', '担当', '終わりの条件'].forEach((k, j) => {
      txt(s, k, { x: L, y: rowsY[j], w: lw - 0.05, h: j === 1 ? 0.9 : 0.55, valign: 'middle', bold: true, color: G1 });
      if (j < 3) rowRule(s, L, rowsY[j + 1] - 0.06, W);
    });
    steps.forEach(([t, per, what, who, cond], i) => {
      const x = gx + i * (cw - 0.15), key = i === 3, cx = x + 0.12, ww = cw - 0.35;
      s.addShape(i === 0 ? pres.shapes.PENTAGON : pres.shapes.CHEVRON, { x, y: top, w: cw, h: 0.62, fill: { color: key ? NAVY : G3 }, line: { type: 'none' } });
      txt(s, String(i + 1) + '　' + t, { x: x + 0.28, y: top, w: cw - 0.5, h: 0.62, bold: true, color: key ? WHITE : BLACK, valign: 'middle' });
      txt(s, per, { x: cx, y: rowsY[0], w: ww, h: 0.55, valign: 'middle', color: G1 });
      txt(s, what, { x: cx, y: rowsY[1], w: ww, h: 0.9, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      txt(s, who, { x: cx, y: rowsY[2], w: ww, h: 0.55, valign: 'middle' });
      txt(s, cond, { x: cx, y: rowsY[3], w: ww, h: 0.75, valign: 'middle', bold: i === 2, color: i === 2 ? NAVY : BLACK });
    });
    txt(s, '試行の開始条件：12月末までに車両8台と運転士10人を揃えること', { x: L, y: top + 4.1, w: W, h: 0.35, bold: true, color: NAVY });
  }

  // ---------- P25 ガントチャート ----------
  {
    const s = frame('P25', '4　実行計画', '全体の完了時期は、最も長い予約システムの整備で決まる。整備に着手する6月までに予算を確定できるかが、計画の成否を分ける', 'スケジュール', '（2026年度）',
      '使う場面：作業ごとの期間と順序。全体の完了時期を決める作業（クリティカルパス）だけ紺。節目は◆で示す。作業は8行程度まで。時間のマスは等幅にし、バーは実際の開始・終了の位置に置く。\n差し替え：作業名、開始・終了月、節目。');
    const months = ['4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '1月', '2月', '3月'];
    const lx = L, lw = 2.8, gx = L + lw, gw = W - lw, mw = gw / 12;
    months.forEach((m, i) => { txt(s, m, { x: gx + i * mw, y: 2.1, w: mw, h: 0.3, align: 'center', color: G1 }); if (i > 0) line(s, gx + i * mw, 2.45, 0, 3.9, G5, 0.75); });
    line(s, L, 2.45, W, 0, G2, 1);
    const tasks = [['利用実態の調査', 0, 3, false], ['予約システムの整備', 2, 10, true], ['事業者との協議', 1, 6, false], ['運行規程の改定', 5, 8, false], ['2地区での試行', 9, 12, false], ['効果の検証', 10, 12, false]];
    tasks.forEach(([t, a, b, key], i) => {
      const y = 2.6 + i * 0.62;
      txt(s, t, { x: lx, y, w: lw - 0.1, h: 0.4, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      s.addShape(pres.shapes.RECTANGLE, { x: gx + a * mw + 0.03, y: y + 0.08, w: (b - a) * mw - 0.06, h: 0.26, fill: { color: key ? NAVY : G3 }, line: { type: 'none' } });
      if (i < tasks.length - 1) line(s, L, y + 0.52, W, 0, G5, 0.75);
    });
    [[6, '協議の合意'], [12, '本格運用の判断']].forEach(([m, t], i) => {
      const x = gx + m * mw;
      const dx = Math.min(x - 0.14, R - 0.28);
      s.addShape(pres.shapes.DIAMOND, { x: dx, y: 6.38, w: 0.28, h: 0.28, fill: { color: i === 1 ? NAVY : G2 }, line: { type: 'none' } });
      txt(s, t, { x: dx - 1.5, y: 6.4, w: 1.4, h: 0.3, align: 'right', bold: i === 1, color: i === 1 ? NAVY : BLACK });
    });
  }

  // ---------- P26 スイムレーン（業務フロー） ----------
  {
    const s = frame('P26', '2　課題', '利用登録の手続きは完了まで平均18日かかり、遅れの大半はバス会社での確認待ちで生じている。ここが手続きを短くする焦点となる', '利用登録の手続きの流れ', '（導入前の現状）',
      '使う場面：複数の主体にまたがる業務の流れ。行＝主体（レーン）、左から右へ時間。導入前の現状に提案物を混ぜない。問題の工程だけ紺。\n差し替え：レーン名、工程、矢印。');
    const lanes = ['利用者', '市の窓口', 'バス会社'], lh = 1.45, top = 2.1, lx = L + 1.5;
    lanes.forEach((n, i) => {
      const y = top + i * lh;
      if (i % 2 === 0) s.addShape(pres.shapes.RECTANGLE, { x: L, y, w: W, h: lh, fill: { color: G5 }, line: { type: 'none' } });
      txt(s, n, { x: L + 0.1, y, w: 1.3, h: lh, bold: true, valign: 'middle' });
      if (i < lanes.length - 1) line(s, L, y + lh, W, 0, G3, 0.75);
    });
    line(s, L, top, W, 0, G2, 1);
    line(s, lx, top, 0, lh * 3, G3, 0.75);
    const bw = 1.5, bh = 0.7;
    const steps = [[0, 0, '申請', false], [1, 1, '受付', false], [2, 2, '内容の確認', true], [1, 3, '補正の依頼', false], [0, 4, '書類の再提出', false], [2, 5, '登録', false]];
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
    txt(s, '確認待ち 平均11日', { x: pos[2].x - 0.3, y: pos[2].y + bh + 0.04, w: 2.6, h: 0.3, bold: true, color: NAVY });
  }

  // ---------- P27 シナリオ比較（線＋前提） ----------
  {
    const s = frame('P27', '1　現状', '利用者数は基本シナリオでも2050年度に3割以上減る。どのシナリオでも維持に必要な水準を下回り、今の路線網の見直しは避けられない', null, null,
      '使う場面：将来の見通しに幅がある場合。左にシナリオ別の推移、右に各シナリオの前提。基本シナリオだけ紺、他はグレー。見通しの期間は「（予測）」と明記。\n差し替え：シナリオの値、前提、維持ライン。');
    const lw = 5.9;
    head(s, L, BODY_Y, lw, '利用者数の見通し（2025年度＝100、2050年度まで予測）');
    const labels = ['2025', '2030', '2035', '2040', '2045', '2050'];
    s.addChart(pres.charts.LINE, [
      { name: '楽観', labels, values: [100, 97, 94, 91, 88, 86] },
      { name: '基本', labels, values: [100, 93, 86, 79, 72, 66] },
      { name: '悲観', labels, values: [100, 89, 78, 68, 59, 50] },
    ], Object.assign({}, chartBase, { x: L, y: 2.1, w: lw - 0.9, h: 4.5, chartColors: [G3, NAVY, G2], lineSize: 2, lineDataSymbol: 'none', valAxisHidden: false, valAxisLabelFontSize: 12, valAxisLabelColor: G1, valAxisLineShow: false, valAxisMinVal: 40, valAxisMaxVal: 110 }));
    txt(s, '楽観', { x: L + lw - 0.85, y: 2.75, w: 0.85, h: 0.3, color: G1 });
    txt(s, '基本', { x: L + lw - 0.85, y: 3.65, w: 0.85, h: 0.3, bold: true, color: NAVY });
    txt(s, '悲観', { x: L + lw - 0.85, y: 4.55, w: 0.85, h: 0.3, color: G1 });
    const rx = L + lw + 0.3, rw = R - rx;
    head(s, rx, BODY_Y, rw, '各シナリオの前提（2050年度）');
    const data = [[cell('', { border: bottom(G2, 1) }), cell('人口', { bold: true, align: 'center', border: bottom(G2, 1) }), cell('利用率', { bold: true, align: 'center', border: bottom(G2, 1) })]]
      .concat([['楽観', '−8%', '＋2pt'], ['基本', '−12%', '±0pt'], ['悲観', '−17%', '−2pt']].map((r, i) => r.map((c, j) => cell(c, { align: j === 0 ? 'left' : 'center', fontFace: j === 0 ? F : 'Arial', bold: i === 1, color: i === 1 ? NAVY : BLACK, border: i < 2 ? bottom() : none }))));
    s.addTable(data, { x: rx, y: 2.15, w: rw, colW: [1.0, (rw - 1.0) / 2, (rw - 1.0) / 2], rowH: [0.5, 0.7, 0.7, 0.7] });
    rowRule(s, rx, 4.95, rw);
    txt(s, '今の路線網の維持には、2025年度比80以上の利用者数が要る', { x: rx, y: 5.1, w: rw, h: 0.7, bold: true, color: NAVY });
  }

  // ---------- P28 感度分析（トルネード） ----------
  {
    const s = frame('P28', '3　打ち手', '収支を最も左右する前提は利用者数で、±10%の変動で収支が年4,000万円前後動く。本格投資の前に、利用者数を試行で確かめるべきである', '前提が±10%変動したときの収支の変化', '（百万円／年、基本ケース＝−210）',
      '使う場面：どの前提が結論を左右するかを示す。影響の大きい順に上から並べる。最も影響の大きい前提だけ紺。基本ケースの値を中央線で示す。\n差し替え：前提名、下振れ・上振れの値。');
    const items = [['利用者数', 42, 38, true], ['運賃単価', 25, 25, false], ['運転士の人件費', 18, 15, false], ['燃料費', 10, 9, false], ['その他', 5, 4, false]];
    const cx = L + 2.4 + (W - 2.4 - PANEL_W - 0.3) / 2, sc = 0.048, top = 2.25;
    txt(s, '下振れ', { x: cx - 2.4, y: 2.05, w: 2.2, h: 0.28, align: 'right', color: G1 });
    txt(s, '上振れ', { x: cx + 0.2, y: 2.05, w: 2.2, h: 0.28, color: G1 });
    items.forEach(([n, lo, hi, key], i) => {
      const y = top + 0.25 + i * 0.82;
      txt(s, n, { x: L, y, w: 2.3, h: 0.5, valign: 'middle', bold: key, color: key ? NAVY : BLACK, fontSize: 12 });
      s.addShape(pres.shapes.RECTANGLE, { x: cx - lo * sc, y: y + 0.07, w: lo * sc, h: 0.36, fill: { color: key ? NAVY : G3 }, line: { type: 'none' } });
      s.addShape(pres.shapes.RECTANGLE, { x: cx, y: y + 0.07, w: hi * sc, h: 0.36, fill: { color: key ? NAVY : G3 }, line: { type: 'none' } });
      txt(s, '−' + lo, num({ x: cx - lo * sc - 0.75, y, w: 0.7, h: 0.5, align: 'right', valign: 'middle', bold: key, color: key ? NAVY : BLACK }));
      txt(s, '＋' + hi, num({ x: cx + hi * sc + 0.05, y, w: 0.7, h: 0.5, valign: 'middle', bold: key, color: key ? NAVY : BLACK }));
    });
    line(s, cx, top + 0.1, 0, 4.25, G2, 1);
    txt(s, '基本ケース', { x: cx - 0.8, y: top + 4.4, w: 1.6, h: 0.3, align: 'center', color: G1, fontSize: 12 });
    readout(s, [['利用者数の±10%で収支が約4,000万円動く', '下振れ−42・上振れ＋38百万円で、2位の運賃単価（±25）の1.6倍に当たる'],
      ['試行で利用者数を確かめてから投資する', '2地区の試行（2027年）で継続利用率80%以上を確かめ、本格投資の判断の基準にする（P47）']]);
  }

  // ---------- P29 計算ロジック（ドライバーの式） ----------
  {
    const s = frame('P29', '3　打ち手', '赤字4.2億円は、利用者数×単価で決まる収入が費用を下回るためである。単価を据え置くなら、黒字化には利用者数を188万人増やす必要がある', '収支の計算ロジック', '（2025年度）',
      '使う場面：結論の数字がどの数字の掛け算・足し算で決まるかを示す。演算子（＝×−＋）を明記し、各箱に値を書く。値は検算表と一致させる。動かすべきドライバーだけ紺。\n差し替え：各ドライバーの名前と値、演算子。');
    const box = (x, y, w, name, val, key) => {
      rect(s, x, y, w, 1.0, { line: { color: key ? NAVY : G2, width: key ? 1.75 : 0.75 } });
      txt(s, name, { x: x + 0.1, y: y + 0.1, w: w - 0.2, h: 0.32, align: 'center', color: key ? NAVY : G1, bold: key });
      txt(s, val, num({ x: x + 0.1, y: y + 0.45, w: w - 0.2, h: 0.45, align: 'center', fontSize: 18, bold: true, color: key ? NAVY : BLACK }));
    };
    const op = (x, y, t) => txt(s, t, { x, y, w: 0.5, h: 1.0, align: 'center', valign: 'middle', fontSize: 20, bold: true, color: G1 });
    const bw = 2.0;
    box(L, 2.3, bw, '収支', '−4.2億円', false); op(L + bw, 2.3, '＝');
    box(L + bw + 0.5, 2.3, bw, '収入', '6.5億円', false); op(L + 2 * bw + 0.5, 2.3, '−');
    box(L + 2 * bw + 1.0, 2.3, bw, '費用', '10.7億円', false);
    const x2 = L + bw + 0.5;
    line(s, x2 + bw / 2, 3.3, 0, 0.5, G3, 0.75);
    box(L + 0.6, 3.8 + 0.2, bw, '利用者数', '290万人', true); op(L + 0.6 + bw, 4.0, '×');
    box(L + 1.1 + bw, 4.0, bw, '単価', '224円', false);
    line(s, L + 0.6 + bw / 2, 3.8, (L + 1.1 + bw + bw / 2) - (L + 0.6 + bw / 2), 0, G3, 0.75);
    line(s, L + 0.6 + bw / 2, 3.8, 0, 0.2, G3, 0.75); line(s, L + 1.1 + bw + bw / 2, 3.8, 0, 0.2, G3, 0.75);
    const x3 = L + 2 * bw + 1.0;
    line(s, x3 + bw / 2, 3.3, 0, 0.5, G3, 0.75);
    box(x3 + 0.3, 4.0, 1.6, '人件費', '7.4億円', false); op(x3 + 1.9, 4.0, '＋');
    box(x3 + 2.4, 4.0, 1.6, '車両・燃料', '3.3億円', false);
    line(s, x3 + 1.1, 3.8, 2.4, 0, G3, 0.75); line(s, x3 + 1.1, 3.8, 0, 0.2, G3, 0.75); line(s, x3 + 3.5, 3.8, 0, 0.2, G3, 0.75);
    rowRule(s, L, 5.35, W);
    txt(s, '黒字化に必要な利用者数：＋188万人（4.2億円÷224円。単価据え置きの場合）', { x: L, y: 5.5, w: W, h: 0.35, bold: true, color: NAVY });
  }

  // ---------- P30 リスク一覧 ----------
  {
    const s = frame('P30', '4　実行計画', '最も影響が大きいリスクは、予約型の利用者が想定を下回ることである。兆候を試行の初月から毎月確かめ、発生時はすぐ定時便に戻せるよう備える', '主なリスクと対応', '（影響度：●大　◑中　○小）',
      '使う場面：リスク・兆候・打ち手を一覧で示す。影響度の大きい順に並べる。最も影響の大きいリスクの行だけ紺。\n差し替え：リスク、兆候（何を見れば分かるか）、影響度、打ち手。');
    const head2 = ['リスク', '兆候（何を見るか）', '影響度', '打ち手'];
    const rows = [['利用者が想定を下回る', '月次の利用者数が計画比90%未満', '●', '一部の地区を定時便に戻す'], ['費用が膨らむ', '四半期の費用が予算比110%超', '◑', '委託先の調達を見直す'], ['事業者の合意が遅れる', '協議の開催が計画から1か月遅延', '◑', '市長名で協議を申し入れる'], ['運転士が集まらない', '応募数が募集枠の半数未満', '○', 'タクシー事業者に委託する']];
    const data = [head2.map((h, j) => cell(h, { bold: true, align: j === 2 ? 'center' : 'left', border: bottom(G2, 1) }))]
      .concat(rows.map((r, i) => r.map((c, j) => cell(c, { align: j === 2 ? 'center' : 'left', fontSize: j === 2 ? 20 : 14, bold: i === 0 && j !== 2, color: i === 0 ? NAVY : (j === 2 ? G2 : BLACK), border: i < rows.length - 1 ? bottom() : none }))));
    s.addTable(data, { x: L, y: 2.1, w: W, colW: [3.0, 3.3, 1.0, W - 7.3], rowH: [0.5, 1.0, 1.0, 1.0, 1.0] });
  }

  // ---------- P31 ヒートマップ表 ----------
  {
    const s = frame('P31', '1　現状', '東部は需要・採算・担い手のいずれも弱く、6地区の中で課題が最も集中している。支援の優先順位は、東部を最上位に置くべきである', '地区別・観点別の状況', '（色が濃いほど課題が大きい、2025年度）',
      '使う場面：多数の項目×観点の強弱を一覧で示す。濃淡はグレー3段階、最も言いたい行（または列）だけ紺の枠で囲む。凡例で濃淡の意味を書く。\n差し替え：行・列の名前、各セルの水準（1〜3）。');
    const cols = ['需要', '採算', '担い手', '設備', '連携'];
    const rows = [['北部', [1, 1, 2, 1, 1]], ['西部', [2, 1, 1, 2, 1]], ['東部', [3, 3, 3, 2, 2]], ['中央部', [1, 2, 1, 1, 2]], ['南部', [2, 2, 1, 3, 1]], ['湾岸部', [1, 1, 2, 2, 1]]];
    const shade = { 1: G5, 2: G3, 3: G2 }, lx = L, lw = 1.8, cw = 1.25, top = 2.15, rh = 0.66;
    cols.forEach((c, j) => txt(s, c, { x: lx + lw + j * cw, y: top, w: cw, h: 0.35, align: 'center', bold: true }));
    rows.forEach(([n, v], i) => {
      const y = top + 0.45 + i * rh, key = i === 2;
      txt(s, n, { x: lx, y, w: lw - 0.1, h: rh - 0.06, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      v.forEach((lv, j) => s.addShape(pres.shapes.RECTANGLE, { x: lx + lw + j * cw + 0.03, y: y + 0.03, w: cw - 0.06, h: rh - 0.06, fill: { color: shade[lv] }, line: { type: 'none' } }));
    });
    s.addShape(pres.shapes.RECTANGLE, { x: lx, y: top + 0.45 + 2 * rh - 0.02, w: lw + 5 * cw, h: rh + 0.04, fill: { type: 'none' }, line: { color: NAVY, width: 1.75 } });
    const gx = lx + lw + 5 * cw + 0.5;
    head(s, gx, top, R - gx, '凡例');
    [['課題 大', G2], ['課題 中', G3], ['課題 小', G5]].forEach(([t, c], i) => {
      s.addShape(pres.shapes.RECTANGLE, { x: gx, y: top + 0.6 + i * 0.5, w: 0.35, h: 0.3, fill: { color: c }, line: { type: 'none' } });
      txt(s, t, { x: gx + 0.45, y: top + 0.57 + i * 0.5, w: R - gx - 0.45, h: 0.35, color: G1 });
    });
    head(s, gx, 4.25, R - gx, '読み取り', { key: true });
    txt(s, '東部は5観点中3観点で課題が大きい', { x: gx, y: 4.8, w: R - gx, h: 0.95, bold: true, color: NAVY });
  }

  // ---------- P32 意思決定ページ ----------
  {
    const s = frame('P32', '5　ご判断いただきたい事項', '本日は支線の扱いについて、予約型交通への転換の採用をご判断いただきたい。転換案は費用と効果の釣り合いが最も良く、2028年度に効果が出る', null, null,
      '使う場面：会議で判断を求める。決めてほしいこと・選択肢と推奨・判断に必要な前提・決めた後の動きを1枚に。推奨案と「決めてほしいこと」だけ紺。依頼や合意事項がない資料では使わない。\n差し替え：論点、案、推奨理由、前提、期限。\n作法：「決めていただきたいこと」は淡い紺の帯で立てるが、帯に枠線を重ねない（塗りか枠のどちらか一方）。');
    s.addShape(pres.shapes.RECTANGLE, { x: L, y: BODY_Y, w: W - 0.9, h: 0.75, fill: { color: BLUE5 }, line: { type: 'none' } });
    txt(s, '決めていただきたいこと', { x: L + 0.2, y: BODY_Y, w: 2.6, h: 0.75, valign: 'middle', bold: true, color: NAVY });
    txt(s, '支線12路線を予約型交通に転換し、2027年4月に1地区目の試行を始めること', { x: L + 2.9, y: BODY_Y, w: W - 4.0, h: 0.75, valign: 'middle', bold: true, color: NAVY });
    const lw = 5.6;
    head(s, L, 2.55, lw, '選択肢');
    [['現状維持', '路線と便数を変えない', '費用 小／効果 小', false], ['予約型へ転換（推奨）', '支線を予約型交通にする', '費用 中／効果 大', true], ['路線の廃止', '支線をやめ通院は補助で対応', '費用 大／効果 中', false]].forEach(([n, d, e, key], i) => {
      const y = 3.05 + i * 1.05;
      txt(s, n, { x: L + 0.12, y, w: 1.65, h: 0.85, valign: 'middle', bold: true, color: key ? NAVY : BLACK });
      txt(s, d, { x: L + 1.8, y, w: 2.1, h: 0.85, valign: 'middle', color: key ? NAVY : BLACK });
      txt(s, e, { x: L + 3.95, y, w: lw - 3.95, h: 0.85, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      if (i < 2) rowRule(s, L, y + 0.95, lw);
    });
    s.addShape(pres.shapes.RECTANGLE, { x: L, y: 4.02, w: lw, h: 1.0, fill: { type: 'none' }, line: { color: NAVY, width: 1.5 } });
    const rx = L + lw + 0.4, rw = R - rx;
    head(s, rx, 2.55, rw, '判断の前提');
    bullets(s, ['転換費用は5年で1.2億円まで', '協議会で事業者3社が合意すること', '効果の算定方法は参考資料p.24'], { x: rx, y: 3.05, w: rw, h: 1.3 });
    head(s, rx, 4.55, rw, '決定後の動き');
    txt(s, [{ text: '2026年12月　推進室の立ち上げ', options: { breakLine: true } }, { text: '2027年4月　1地区目の試行開始', options: { breakLine: true } }, { text: '2027年10月　効果の中間報告' }], { x: rx, y: 5.05, w: rw, h: 1.3 });
  }

  // ---------- P33 小図の並列（スモールマルチプル） ----------
  {
    const s = frame('P33', '1　現状', 'バスの利用者が減り続けているのは4地区中で東部だけで、他は横ばいか増加である。東部に固有の要因を特定する必要がある', '地区別の年間利用者数の推移', '（万人、2015–2025年度、縦軸はすべて同じ目盛り）',
      '使う場面：同じ図法・同じ目盛りで、切り口違い（地域・事業・顧客層）を並べて比べる。目盛りは必ずそろえる。注目の1枚だけ紺、他はグレー。\n差し替え：各小図のデータと見出し。');
    const labels = ['15', '17', '19', '21', '23', '25'];
    const sets = [['北部', [60, 62, 61, 63, 64, 66], false], ['西部', [55, 54, 56, 55, 57, 58], false], ['東部', [70, 64, 58, 52, 47, 41], true], ['中央部', [40, 41, 43, 46, 49, 52], false]];
    const cw = (W - PANEL_W - 0.3 - 0.45) / 4;
    sets.forEach(([n, v, key], i) => {
      const x = L + i * (cw + 0.15);
      head(s, x, 2.1, cw, n, { key, align: 'center' });
      s.addChart(pres.charts.BAR, [{ name: n, labels, values: v }], Object.assign({}, chartBase, { x, y: 2.6, w: cw, h: 3.55, barDir: 'col', barGapWidthPct: 40, chartColors: [key ? NAVY : G3], showValue: false, valAxisMinVal: 0, valAxisMaxVal: 80, catAxisLabelFontSize: 12 }));
      txt(s, '10年で ' + (v[5] - v[0] >= 0 ? '＋' : '−') + Math.abs(v[5] - v[0]), num({ x, y: 6.2, w: cw, h: 0.35, align: 'center', bold: true, color: key ? NAVY : G1 }));
    });
    readout(s, [['減り続けているのは東部だけ', '東部は10年で70万人から41万人に減った（−41%）。他の3地区は横ばいか増加'],
      ['東部では通学の利用が半分になった', '沿線の高校の統合（2016年）以降、東部の通学の利用は10年で半分に減った']]);
  }
};
