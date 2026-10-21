// 追加の型 P56〜P71（2026-10 追加・第3弾）
// 公開資料の新型候補（MCK01・BCG01）と、外資系コンサルの資料に多い図法（ダンベル、スロープ、ブレット、パレート、ファネル、分布、
// カスタマージャーニー、体制図、ワークストリーム計画、年表、選択肢カード、関係者マップ）を、本スキルの規定で作り直したもの。
// 見本の値は【】の空欄ではなく、それらしいダミー値にして、完成形の見た目を確かめられるようにしている。
module.exports = function ({ pres, frame, txt, line, rect, icon, C }) {
  const { F, NAVY, BLACK, G1, G2, G3, G4, G5, WHITE, L, R, W, BLUE5 } = C;
  const TINT = { color: BLUE5 };
  const shape = (s, type, x, y, w, h, o) => s.addShape(pres.shapes[type], Object.assign({ x, y, w, h }, o));
  const fillRect = (s, x, y, w, h, color) => shape(s, 'RECTANGLE', x, y, w, h, { fill: { color }, line: { type: 'none' } });
  const dot = (s, cx, cy, d, color, lineColor) => shape(s, 'OVAL', cx - d / 2, cy - d / 2, d, d, { fill: { color }, line: lineColor ? { color: lineColor, width: 1 } : { type: 'none' } });
  const arrow = (s, x, y, w, h, color, width, dash) => shape(s, 'LINE', x, y, w, h, { line: { color: color || G2, width: width || 1, endArrowType: 'triangle', dashType: dash || 'solid' } });
  const badge = (s, x, y, t, key) => { dot(s, x + 0.16, y + 0.16, 0.32, key ? NAVY : G2); txt(s, t, { x, y, w: 0.32, h: 0.32, fontSize: 12, bold: true, color: WHITE, align: 'center', valign: 'middle', fontFace: 'Arial' }); };
  const num = (o) => Object.assign({ fontFace: 'Arial' }, o);
  const colHead = (s, x, y, w, t, o) => txt(s, t, Object.assign({ x, y, w, h: 0.32, bold: true, color: G1 }, o || {}));

  // ---------- P56 時間配分付きアジェンダ ----------
  {
    const s = frame('P56', '目次', '本日の120分のうち半分を論点2の打ち手の選定に充て、最後の20分で次回までの宿題を確定する。論点1は事前送付資料の確認に留める', '本日の進め方', '（13:00〜15:00、120分）',
      '使う場面：会議資料の冒頭で、議題ごとの時間と狙いを示す。時間・議題・内容・資料の4列に、時間の配分を横棒で添える。山場の議題の行だけ紺の淡色。合計時間で締める。');
    const rows = [['13:00', 10, '開会・本日の目的', '目的と、会議の終わりに決めることを確認', 'p.2'], ['13:10', 30, '論点1　現状認識', '事前送付資料の要点だけを確認する', 'p.3–8'],
      ['13:40', 60, '論点2　打ち手の選定', '3案を比較し、推奨案の採否を議論する', 'p.9–18'], ['14:40', 20, '次回までの宿題', '担当と期限を確定する', 'p.19']];
    const top = 2.1, rh = 0.9, cx = [L, L + 0.95, L + 3.4, L + 6.2, L + 9.2];
    ['開始', '配分', '議題', '内容', '資料'].forEach((h, j) => colHead(s, cx[j], top, j === 4 ? 1.0 : 2.4, h));
    line(s, L, top + 0.4, W, 0, G2, 1);
    rows.forEach((r, i) => {
      const y = top + 0.48 + i * rh, key = i === 2;
      if (key) shape(s, 'RECTANGLE', L, y, W, rh - 0.08, { fill: TINT, line: { type: 'none' } });
      txt(s, r[0], num({ x: cx[0], y, w: 0.9, h: rh - 0.08, valign: 'middle', color: G1 }));
      fillRect(s, cx[1], y + 0.3, r[1] * 0.025, 0.24, key ? NAVY : G3);
      txt(s, r[1] + '分', num({ x: cx[1] + r[1] * 0.025 + 0.08, y, w: 0.7, h: rh - 0.08, valign: 'middle', bold: key, color: key ? NAVY : BLACK }));
      txt(s, r[2], { x: cx[2], y, w: 2.7, h: rh - 0.08, valign: 'middle', bold: true, color: key ? NAVY : BLACK });
      txt(s, r[3], { x: cx[3], y, w: 2.9, h: rh - 0.08, valign: 'middle' });
      txt(s, r[4], num({ x: cx[4], y, w: 1.0, h: rh - 0.08, valign: 'middle', color: G1 }));
      line(s, L, y + rh - 0.04, W, 0, G4, 0.75);
    });
    txt(s, '合計　120分', { x: L, y: top + 0.55 + 4 * rh, w: 3.3, h: 0.35, bold: true });
  }

  // ---------- P57 目的→設計上の工夫 ----------
  {
    const s = frame('P57', '3　打ち手', '新制度は3つの目的に対して5つの工夫で応える設計である。最も重い目的Aには工夫1〜3の3つが効いており、制度の中核をなしている', '制度の目的と設計上の工夫', null,
      '使う場面：左に目的、右に設計上の工夫を置き、英字バッジで「どの工夫がどの目的に効くか」を対応させる。最も重い目的と、それに効く工夫のバッジだけ紺。工夫は動詞で書く。');
    const lx = L, lw = 3.6, rx = L + 4.3, rw = R - rx, top = 2.1;
    colHead(s, lx, top, lw, '目的'); colHead(s, rx, top, rw, '設計上の工夫'); colHead(s, R - 1.3, top, 1.3, '効く目的', { align: 'right' });
    line(s, lx, top + 0.4, lw, 0, G2, 1); line(s, rx, top + 0.4, rw, 0, G2, 1);
    [['A', '利用者の負担を下げる', true], ['B', '事業者の参入を促す', false], ['C', '自治体の事務を減らす', false]].forEach(([k, t, key], i) => {
      const y = top + 0.6 + i * 1.4;
      badge(s, lx, y + 0.12, k, key);
      txt(s, t, { x: lx + 0.45, y, w: lw - 0.45, h: 0.56, valign: 'middle', bold: true, color: key ? NAVY : BLACK });
      line(s, lx, y + 1.15, lw, 0, G4, 0.75);
    });
    shape(s, 'ISOSCELES_TRIANGLE', L + 3.78, 3.75, 0.36, 0.26, { rotate: 90, fill: { color: G3 }, line: { type: 'none' } });
    [['1', '運賃の上限を地域で一律に定める', 'A'], ['2', '乗継ぎの割引を事業者間で自動精算する', 'AB'], ['3', '予約と決済を1つのアプリにまとめる', 'AC'], ['4', '参入時の初期費用を3年間補助する', 'B'], ['5', '申請を年1回の一括申請に改める', 'C']].forEach(([n, t, ks], i) => {
      const y = top + 0.52 + i * 0.84;
      txt(s, n, num({ x: rx, y, w: 0.3, h: 0.6, valign: 'middle', bold: true, color: G1 }));
      txt(s, t, { x: rx + 0.35, y, w: rw - 1.6, h: 0.6, valign: 'middle' });
      ks.split('').forEach((k, j) => badge(s, R - 0.36 - (ks.length - 1 - j) * 0.4, y + 0.14, k, k === 'A'));
      line(s, rx, y + 0.72, rw, 0, G4, 0.75);
    });
  }

  // ---------- P58 索引付きチェック表 ----------
  {
    const s = frame('P58', '1　現状', '先行6事例のうち5事例が専任の調整役を置いており、成功の共通要素は資金より人材にある。各事例の詳細は参考資料の該当ページで確認できる', '先行事例の取組要素', '（6事例、2025年度時点）',
      '使う場面：事例×枠組みの表に、該当するセルだけ印を付け、右端に詳細ページの番号を入れる。読み手は表で全体を見て、気になる事例だけ参考資料へ飛べる。最も多くの事例に共通する列だけ紺。');
    const cols = ['資金', '専任の調整役', '拠点', '条例・制度', 'データ共有'], keyCol = 1;
    const cases = [['事例A　北部市', [1, 1, 1, 0, 1], 'p.24'], ['事例B　東町', [0, 1, 0, 1, 0], 'p.26'], ['事例C　南村', [1, 1, 1, 0, 0], 'p.28'], ['事例D　西市', [1, 0, 0, 1, 1], 'p.30'], ['事例E　中央市', [0, 1, 1, 0, 1], 'p.32'], ['事例F　港町', [1, 1, 0, 0, 0], 'p.34']];
    const top = 2.05, nw = 2.6, cw = 1.35, px = L + nw + 5 * cw + 0.2, rh = 0.56;
    shape(s, 'RECTANGLE', L + nw + keyCol * cw, top, cw, 0.5 + cases.length * rh + 0.55, { fill: TINT, line: { type: 'none' } });
    cols.forEach((c, j) => txt(s, c, { x: L + nw + j * cw, y: top, w: cw, h: 0.46, align: 'center', valign: 'middle', bold: true, fontSize: 14, color: j === keyCol ? NAVY : G1 }));
    txt(s, '詳細', { x: px, y: top, w: R - px, h: 0.46, align: 'center', valign: 'middle', bold: true, color: G1 });
    line(s, L, top + 0.5, W, 0, G2, 1);
    cases.forEach(([n, v, p], i) => {
      const y = top + 0.55 + i * rh;
      txt(s, n, { x: L, y, w: nw, h: rh, valign: 'middle' });
      v.forEach((on, j) => { if (on) txt(s, '✓', { x: L + nw + j * cw, y, w: cw, h: rh, align: 'center', valign: 'middle', fontSize: 18, bold: true, color: j === keyCol ? NAVY : G2, fontFace: 'Arial' }); });
      txt(s, p, num({ x: px, y, w: R - px, h: rh, align: 'center', valign: 'middle', color: G1 }));
      line(s, L, y + rh, W, 0, G4, 0.5);
    });
    const y = top + 0.6 + cases.length * rh;
    txt(s, '該当数', { x: L, y, w: nw, h: 0.4, bold: true, valign: 'middle' });
    cols.forEach((c, j) => txt(s, String(cases.filter(r => r[1][j]).length), num({ x: L + nw + j * cw, y, w: cw, h: 0.4, align: 'center', valign: 'middle', bold: true, color: j === keyCol ? NAVY : BLACK })));
  }

  // ---------- P59 条件で絞り込む候補表 ----------
  {
    const s = frame('P59', '3　打ち手', '8つの候補地を3つの条件で絞り込むと、すべてを満たすのは候補3と候補6の2か所だけである。両者のうち費用の低い候補3を第一候補とする', '候補地の絞り込み', '（○＝条件を満たす）',
      '使う場面：候補を条件で順に落としていく過程を、1枚の表で見せる。条件を外れた行は文字をグレーにし、外れた条件のセルに×を置く。残った候補のうち推奨の行だけ紺。上に絞り込みの件数を矢印で示す。');
    const steps = [['候補', 8], ['条件1　用地', 5], ['条件2　接続', 3], ['条件3　費用', 2]];
    steps.forEach(([t, n], i) => {
      const x = L + i * 2.62;
      txt(s, t, { x, y: 2.08, w: 1.75, h: 0.3, color: G1, align: 'center' });
      txt(s, n + 'か所', num({ x, y: 2.28, w: 1.75, h: 0.4, align: 'center', bold: true, fontSize: 18, color: i === 3 ? NAVY : BLACK }));
      if (i < 3) arrow(s, x + 1.85, 2.47, 0.65, 0, G3, 1);
    });
    const rows = [['候補1', '○', '×', '', '18'], ['候補2', '×', '', '', '12'], ['候補3', '○', '○', '○', '9'], ['候補4', '○', '○', '×', '21'], ['候補5', '×', '', '', '15'], ['候補6', '○', '○', '○', '11'], ['候補7', '○', '×', '', '10'], ['候補8', '×', '', '', '8']];
    const top = 2.85, rh = 0.4, cx = [L, L + 2.2, L + 4.0, L + 5.8, L + 7.6], cw = 1.6;
    ['候補地', '用地', '接続', '費用', '概算費用（億円）'].forEach((h, j) => txt(s, h, { x: cx[j], y: top, w: j === 4 ? 2.5 : cw, h: 0.34, bold: true, color: G1, align: j ? 'center' : 'left' }));
    line(s, L, top + 0.38, W, 0, G2, 1);
    rows.forEach((r, i) => {
      const y = top + 0.42 + i * rh, pass = r[3] === '○', key = r[0] === '候補3';
      if (key) shape(s, 'RECTANGLE', L, y, W, rh, { fill: TINT, line: { type: 'none' } });
      const c = key ? NAVY : pass ? BLACK : G3;
      txt(s, r[0] + (key ? '　第一候補' : ''), { x: cx[0], y, w: 2.2, h: rh, valign: 'middle', bold: key || pass, color: c });
      r.slice(1).forEach((v, j) => txt(s, v, { x: cx[j + 1], y, w: j === 3 ? 2.5 : cw, h: rh, valign: 'middle', align: 'center', color: v === '×' ? G1 : c, bold: key, fontFace: j === 3 ? 'Arial' : F }));
      line(s, L, y + rh, W, 0, G4, 0.5);
    });
  }

  // ---------- P60 ダンベルチャート ----------
  {
    const s = frame('P60', '1　現状', '8地域すべてで利用率は10年で下がったが、下げ幅は地域で大きく異なる。対象の東部は21ポイント減と最も大きく、平均の2倍に当たる', '地域別の公共交通の利用率', '（%、2015年度と2025年度）',
      '使う場面：2時点（または2群）の差を、行ごとに点と線で示す。差の大きい順に並べ、変化の向きが一目で分かる。両端の値を点の外側に書く。注目する行だけ紺、他はグレー（前の時点は淡く、後の時点は濃く）。');
    const rows = [['東部', 48, 27], ['北部', 41, 29], ['山間部', 35, 24], ['西部', 44, 34], ['湾岸部', 39, 30], ['中央部', 52, 45], ['南部', 33, 27], ['市街地', 58, 54]];
    const top = 2.35, rh = 0.5, x0 = L + 2.0, sc = 0.105, base = 15;
    const X = v => x0 + (v - base) * sc;
    dot(s, X(48) - 0.28, 2.23, 0.16, G3); txt(s, '2015年度', { x: X(48) - 0.15, y: 2.08, w: 1.4, h: 0.3 });
    dot(s, X(27) - 1.08, 2.23, 0.16, G2); txt(s, '2025年度', { x: X(27) - 0.95, y: 2.08, w: 1.4, h: 0.3 });
    txt(s, '差', { x: R - 1.0, y: 2.08, w: 1.0, h: 0.3, color: G1, bold: true, align: 'right' });
    rows.forEach(([n, a, b], i) => {
      const y = top + 0.15 + i * rh, cy = y + rh / 2, key = i === 0;
      txt(s, n, { x: L, y, w: 1.8, h: rh, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      line(s, X(b), cy, X(a) - X(b), 0, key ? NAVY : G3, key ? 2.5 : 2);
      dot(s, X(a), cy, 0.2, key ? WHITE : G3, key ? NAVY : null);
      dot(s, X(b), cy, 0.2, key ? NAVY : G2);
      txt(s, String(a), num({ x: X(a) + 0.15, y, w: 0.5, h: rh, valign: 'middle', color: key ? NAVY : G1 }));
      txt(s, String(b), num({ x: X(b) - 0.65, y, w: 0.5, h: rh, valign: 'middle', align: 'right', color: key ? NAVY : BLACK, bold: key }));
      txt(s, '−' + (a - b), num({ x: R - 1.0, y, w: 1.0, h: rh, valign: 'middle', align: 'right', bold: key, color: key ? NAVY : BLACK }));
      line(s, L, y + rh, W, 0, G5, 0.5);
    });
  }

  // ---------- P61 スロープグラフ ----------
  {
    const s = frame('P61', '1　現状', '5つの移動手段のうち、10年で順位を上げたのは送迎だけである。鉄道は分担率を21%から13%に落とし、2位の座を送迎に譲った', '移動手段別の分担率', '（%、2015年度→2025年度）',
      '使う場面：2時点の値と順位の入れ替わりを示す。左右に時点を置き、項目ごとに線で結ぶ。項目名と値は線の両端に直接書く（凡例は使わない）。注目する1本だけ紺の太線、他はグレーの細線。項目は5〜8本まで。');
    const rows = [['自家用車', 52, 56], ['鉄道', 21, 13], ['バス', 14, 5], ['徒歩・自転車', 10, 8], ['送迎', 3, 18]];
    const xa = L + 3.0, xb = L + 7.2, y0 = 6.4, sc = 0.066;
    const Y = v => y0 - v * sc;
    txt(s, '2015年度', { x: xa - 0.8, y: 2.08, w: 1.6, h: 0.3, bold: true, align: 'center', color: G1 });
    txt(s, '2025年度', { x: xb - 0.8, y: 2.08, w: 1.6, h: 0.3, bold: true, align: 'center', color: G1 });
    line(s, xa, 2.35, 0, 4.1, G4, 0.75); line(s, xb, 2.35, 0, 4.1, G4, 0.75);
    // ラベルの縦位置：値の位置から、重ならないよう最低0.3インチずつ離す
    const spread = vals => { const o = vals.map((v, i) => [Y(v), i]).sort((p, q) => p[0] - q[0]), out = []; o.forEach(([y, i], k) => { out[i] = k ? Math.max(y, out[o[k - 1][1]] + 0.3) : y; }); return out; };
    const la = spread(rows.map(r => r[1])), lb = spread(rows.map(r => r[2]));
    rows.forEach(([n, a, b], i) => {
      const key = n === '鉄道', c = key ? NAVY : G3;
      shape(s, 'LINE', xa, Math.min(Y(a), Y(b)), xb - xa, Math.abs(Y(b) - Y(a)) || 0.001, { line: { color: c, width: key ? 2.5 : 1.25 }, flipV: Y(b) < Y(a) });
      dot(s, xa, Y(a), 0.14, key ? NAVY : G2); dot(s, xb, Y(b), 0.14, key ? NAVY : G2);
      txt(s, `${n}　${a}`, { x: xa - 2.75, y: la[i] - 0.16, w: 2.6, h: 0.32, align: 'right', valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      txt(s, `${b}　${n}`, { x: xb + 0.15, y: lb[i] - 0.16, w: 2.6, h: 0.32, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
    });
  }

  // ---------- P62 目標対実績バー（ブレット） ----------
  {
    const s = frame('P62', '4　実行計画', '6つのKPIのうち4つは年度目標の8割を超えたが、担い手の確保は目標の45%にとどまる。下期は担い手の確保に予算と人員を寄せるべきである', 'KPIの達成状況', '（2026年度上期末時点、目標＝100%）',
      '使う場面：複数のKPIの実績を目標と並べて示す。淡いグレーの帯を目標までの長さ、濃い棒を実績、黒い縦線を目標値とする。達成率の数値を右に書く。最も遅れているKPIの棒だけ紺。');
    const rows = [['利用者数', '12.4万人', 96], ['運行の定時率', '97.1%', 99], ['アプリ登録者', '1.8万人', 82], ['協賛企業', '24社', 80], ['担い手の確保', '9人', 45], ['収支の改善', '0.6億円', 60]];
    const top = 2.1, rh = 0.68, bx = L + 2.6, bw = 5.4, sc = bw / 120;
    colHead(s, L, top, 2.4, 'KPI'); colHead(s, bx, top, bw, '達成率'); colHead(s, R - 1.95, top, 1.95, '実績　　達成率', { align: 'right' });
    line(s, L, top + 0.4, W, 0, G2, 1);
    rows.forEach(([n, v, p], i) => {
      const y = top + 0.5 + i * rh, key = p === 45;
      txt(s, n, { x: L, y, w: 2.4, h: rh, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      fillRect(s, bx, y + 0.16, 100 * sc, rh - 0.32, G5);
      fillRect(s, bx, y + 0.24, p * sc, rh - 0.48, key ? NAVY : G2);
      line(s, bx + 100 * sc, y + 0.1, 0, rh - 0.2, BLACK, 1.5);
      txt(s, v, num({ x: R - 2.1, y, w: 1.1, h: rh, valign: 'middle', align: 'right', color: G1 }));
      txt(s, p + '%', num({ x: R - 0.9, y, w: 0.9, h: rh, valign: 'middle', align: 'right', bold: true, color: key ? NAVY : BLACK }));
    });
    txt(s, '目標', { x: bx + 100 * sc - 0.4, y: top + 0.5 + rows.length * rh, w: 0.8, h: 0.3, align: 'center', color: G1 });
  }

  // ---------- P63 パレート図 ----------
  {
    const s = frame('P63', '2　課題', '苦情は9種類に分かれるが、上位3種類で全体の71%を占める。遅延・接続・情報提供の3つに対策を絞れば、苦情の大半を減らせる', '種類別の苦情件数と累積構成比', '（件、%、2025年度）',
      '使う場面：多数の要因のうち少数が大半を占めることを示す。件数の降順に棒を並べ、累積構成比を折れ線で重ね、80%などの目安に点線を引く。対策を絞る上位の棒だけ紺。');
    const data = [['遅延', 182], ['接続', 121], ['情報提供', 97], ['運賃', 41], ['車内', 33], ['乗務員', 27], ['設備', 22], ['予約', 18], ['その他', 22]];
    const total = data.reduce((a, d) => a + d[1], 0);
    const x0 = L + 0.6, cw = 0.95, bw = 0.62, y0 = 6.15, hs = 0.017, ph = 3.7, top = y0 - ph;
    line(s, x0 - 0.1, y0, data.length * cw + 0.1, 0, G3, 0.75);
    shape(s, 'LINE', x0 - 0.1, top + ph * 0.2, data.length * cw + 0.1, 0, { line: { color: G1, width: 0.75, dashType: 'dash' } });
    txt(s, '80%', num({ x: x0 + data.length * cw + 0.05, y: top + ph * 0.2 - 0.16, w: 0.7, h: 0.32, color: G1 }));
    let cum = 0, prev = null;
    data.forEach(([n, v], i) => {
      const x = x0 + i * cw, key = i < 3;
      fillRect(s, x, y0 - v * hs, bw, v * hs, key ? NAVY : G3);
      txt(s, String(v), num({ x: x - 0.1, y: y0 - v * hs - 0.32, w: bw + 0.2, h: 0.3, align: 'center', color: key ? NAVY : BLACK, bold: key }));
      txt(s, n, { x: x - 0.17, y: y0 + 0.05, w: bw + 0.34, h: 0.3, align: 'center' });
      cum += v;
      const cx = x + bw / 2, cy = y0 - ph * cum / total;
      if (prev) shape(s, 'LINE', prev[0], Math.min(prev[1], cy), cx - prev[0], Math.abs(prev[1] - cy) || 0.001, { line: { color: G1, width: 1.25 }, flipV: true });
      dot(s, cx, cy, 0.12, G1);
      if (i === 2) txt(s, Math.round(100 * cum / total) + '%', num({ x: cx + 0.12, y: cy - 0.05, w: 0.8, h: 0.3, bold: true, color: NAVY }));
      prev = [cx, cy];
    });
    txt(s, '累積構成比', { x: R - 1.6, y: top - 0.15, w: 1.6, h: 0.3, color: G1, align: 'right' });
  }

  // ---------- P64 ファネル（段階の歩留まり） ----------
  {
    const s = frame('P64', '2　課題', 'アプリを知った人のうち実際に予約まで至るのは12%にとどまる。最大の離脱は登録から初回予約の間で起きており、ここで半数以上が離れている', '利用までの段階ごとの人数と移行率', '（人、2026年4〜9月）',
      '使う場面：段階ごとに人数が減る過程を示し、どこで最も離れるかを特定する。棒は中央にそろえて段階順に積み、段階の間に移行率を書く。最も移行率の低い段階だけ紺。');
    const st = [['アプリを知った', 20000], ['ダウンロード', 9200], ['会員登録', 5600], ['初回予約', 2400], ['2回目以降の予約', 1500]];
    const mw = 5.0, cx = L + 2.4 + mw / 2, top = 2.15, rh = 0.84;
    colHead(s, R - 2.3, top - 0.1, 2.3, '前段階からの移行率', { align: 'right' });
    st.forEach(([n, v], i) => {
      const y = top + 0.25 + i * rh, w = mw * v / st[0][1], key = i === 3;
      fillRect(s, cx - w / 2, y, w, rh - 0.22, key ? NAVY : G3);
      txt(s, n, { x: L, y, w: 2.2, h: rh - 0.22, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      txt(s, v.toLocaleString('en-US'), num({ x: cx + Math.max(w, 1.4) / 2 + 0.1, y, w: 1.0, h: rh - 0.22, valign: 'middle', color: key ? NAVY : BLACK, bold: key }));
      if (i > 0) txt(s, Math.round(100 * v / st[i - 1][1]) + '%', num({ x: R - 1.2, y: y - 0.1, w: 1.2, h: rh - 0.02, valign: 'middle', align: 'right', fontSize: key ? 20 : 14, bold: true, color: key ? NAVY : BLACK }));
      if (i > 0) line(s, R - 2.3, y - 0.11, 2.3, 0, G4, 0.5);
    });
  }

  // ---------- P65 分布（ヒストグラム＋中央値） ----------
  {
    const s = frame('P65', '1　現状', '沿線42集落の最寄り駅までの距離は中央値で2.4kmだが、5km以上の集落が9つあり分布は長く右に伸びる。平均値では遠い集落の実態が見えない', '集落別の最寄り駅までの距離の分布', '（集落数、km）',
      '使う場面：平均だけでは伝わらない、ばらつきや偏りを示す。階級ごとの件数を隙間の狭い縦棒で並べ、中央値（または平均）を縦の点線で示す。注目する階級だけ紺。');
    const bins = [['0–1', 6], ['1–2', 10], ['2–3', 9], ['3–4', 5], ['4–5', 3], ['5–6', 3], ['6–7', 2], ['7–8', 2], ['8–', 2]];
    const x0 = L + 0.8, cw = 0.95, y0 = 6.1, hs = 0.34;
    line(s, x0 - 0.1, y0, bins.length * cw + 0.1, 0, G3, 0.75);
    bins.forEach(([n, v], i) => {
      const x = x0 + i * cw, key = i >= 5;
      fillRect(s, x, y0 - v * hs, cw - 0.06, v * hs, key ? NAVY : G3);
      txt(s, String(v), num({ x, y: y0 - v * hs - 0.32, w: cw - 0.06, h: 0.3, align: 'center', color: key ? NAVY : BLACK, bold: key, fill: { color: WHITE } }));
      txt(s, n, num({ x: x - 0.1, y: y0 + 0.05, w: cw + 0.14, h: 0.3, align: 'center' }));
    });
    const mx = x0 + 2.4 * cw;
    shape(s, 'LINE', mx, 2.3, 0, y0 - 2.3, { line: { color: BLACK, width: 1, dashType: 'dash' } });
    txt(s, '中央値 2.4km', { x: mx + 0.08, y: 2.2, w: 1.8, h: 0.3, bold: true });
    line(s, x0 + 5 * cw, y0 - 3 * hs - 0.5, 4 * cw - 0.06, 0, NAVY, 1);
    txt(s, '5km以上　9集落', { x: x0 + 5 * cw, y: y0 - 3 * hs - 0.88, w: 4 * cw, h: 0.3, align: 'center', bold: true, color: NAVY });
  }

  // ---------- P66 カスタマージャーニー ----------
  {
    const s = frame('P66', '2　課題', '通院する高齢者は予約から帰宅までの5段階のうち、乗継ぎの待ち時間で最も強い不満を抱く。打ち手は乗継ぎの段階に集中させるべきである', '通院する高齢者の移動の流れ', '（ヒアリング20件を基に作成）',
      '使う場面：利用者の行動を段階ごとに追い、各段階の接点・不満・打ち手を行で並べる。満足度の線で山と谷を見せる。不満が最も強い段階の列だけ紺の細枠。行は3〜4、段階は4〜6まで。');
    const stages = ['予約する', '駅まで行く', '乗り継ぐ', '受診する', '帰宅する'];
    const lx = L, lw = 1.5, x0 = L + lw, cw = (W - lw) / 5, top = 2.05;
    stages.forEach((t, j) => {
      shape(s, j === 0 ? 'PENTAGON' : 'CHEVRON', x0 + j * cw, top, j < 4 ? cw + 0.04 : cw, 0.45, { fill: { color: j === 2 ? NAVY : G4 }, line: { type: 'none' } });
      txt(s, t, { x: x0 + j * cw + 0.2, y: top, w: cw - 0.3, h: 0.45, valign: 'middle', align: 'center', bold: true, color: j === 2 ? WHITE : BLACK });
    });
    shape(s, 'RECTANGLE', x0 + 2 * cw + 0.03, top + 0.5, cw - 0.06, 4.15, { fill: { type: 'none' }, line: { color: NAVY, width: 1.25 } });
    const rows = [['行動', ['電話で予約', '徒歩で15分', '駅で40分待つ', '受付から2時間', '家族が迎えに']], ['不満', ['平日のみ', '坂道がきつい', '待合所が寒い', '―', '頼みにくい']], ['打ち手', ['アプリと電話', '戸口まで送迎', '接続ダイヤ', '―', '帰りの予約']]];
    rows.forEach(([h, cells], i) => {
      const y = top + 0.6 + i * 0.72;
      txt(s, h, { x: lx, y, w: lw - 0.1, h: 0.62, valign: 'middle', bold: true, color: G1 });
      cells.forEach((c, j) => txt(s, c, { x: x0 + j * cw + 0.08, y, w: cw - 0.16, h: 0.62, valign: 'middle', align: 'center', color: j === 2 && i > 0 ? NAVY : BLACK, bold: j === 2 && i > 0 }));
      line(s, lx, y + 0.67, W, 0, G4, 0.5);
    });
    const sy = top + 2.85, sh = 1.6, sat = [3, 2, -4, 1, 0];
    txt(s, '満足度', { x: lx, y: sy + 0.55, w: lw - 0.1, h: 0.4, bold: true, color: G1 });
    line(s, x0, sy + sh / 2, W - lw, 0, G4, 0.75);
    const P = j => [x0 + j * cw + cw / 2, sy + sh / 2 - sat[j] * 0.13];
    sat.forEach((v, j) => {
      const [cx, cy] = P(j);
      if (j > 0) { const [px, py] = P(j - 1); shape(s, 'LINE', px, Math.min(py, cy), cx - px, Math.abs(cy - py) || 0.001, { line: { color: G2, width: 1.5 }, flipV: cy < py }); }
      dot(s, cx, cy, j === 2 ? 0.22 : 0.16, j === 2 ? NAVY : G2);
    });
    txt(s, '最も強い不満', { x: P(2)[0] - 0.9, y: P(2)[1] + 0.12, w: 1.8, h: 0.3, align: 'center', bold: true, color: NAVY });
  }

  // ---------- P67 体制図 ----------
  {
    const s = frame('P67', '4　実行計画', '推進体制は協議会の下に事務局を新設し、3つの作業部会を束ねる。事務局が予算と進捗を一元管理することで、部会間の調整を月1回の会議に集約する', '推進体制', '（2027年度から）',
      '使う場面：意思決定・事務局・実行チームの関係と役割を示す。上下は指揮の関係、点線は助言の関係。各箱に役割を1行、主な構成員を1行書く。新設・変更する組織だけ紺。');
    const top = 2.05, bw = 3.6, cxm = L + W / 2;
    const org = (x, y, w, t, sub, key, ic, dash) => {
      shape(s, 'RECTANGLE', x, y, w, 0.95, { fill: { color: WHITE }, line: { color: key ? NAVY : G3, width: key ? 1.75 : 0.75, dashType: dash ? 'dash' : 'solid' } });
      icon(s, ic, x + 0.15, y + 0.2, 0.55, key ? NAVY : G2);
      txt(s, t, { x: x + 0.8, y: y + 0.1, w: w - 0.9, h: 0.38, bold: true, color: key ? NAVY : BLACK, valign: 'middle' });
      txt(s, sub, { x: x + 0.8, y: y + 0.48, w: w - 0.9, h: 0.38, valign: 'middle', color: G1 });
    };
    org(cxm - bw / 2, top, bw, '地域交通協議会', '市長・事業者・住民代表', false, 'landmark');
    org(cxm - bw / 2, top + 1.45, bw, '事務局（新設）', '予算と進捗を一元管理', true, 'settings');
    org(R - 2.9, top + 1.45, 2.9, '有識者', '月1回の助言', false, 'lightbulb', true);
    line(s, cxm, top + 0.95, 0, 0.5, G2, 1);
    shape(s, 'LINE', cxm + bw / 2, top + 1.92, R - 2.9 - cxm - bw / 2, 0, { line: { color: G2, width: 1, dashType: 'dash' } });
    const ws = [['運行部会', '事業者3社', 'bus'], ['利用促進部会', '商工会・学校', 'messages-square'], ['データ部会', '市情報政策課', 'database']];
    const ww = (W - 0.6) / 3, wy = top + 3.3;
    line(s, cxm, top + 2.4, 0, 0.45, G2, 1);
    line(s, L + ww / 2, top + 2.85, W - ww, 0, G2, 1);
    ws.forEach(([t, sub, ic], i) => {
      const x = L + i * (ww + 0.3);
      line(s, x + ww / 2, top + 2.85, 0, 0.45, G2, 1);
      org(x, wy, ww, t, sub, false, ic);
    });
    txt(s, '（実線＝指揮、点線＝助言）', { x: L, y: top + 4.4, w: 4, h: 0.3, color: G1, fontSize: 12 });
  }

  // ---------- P68 フェーズ×ワークストリームのロードマップ ----------
  {
    const s = frame('P68', '4　実行計画', '3つのフェーズを4つの作業の流れで進め、18か月で本格運行に移る。完了時期を決めるのは車両の調達であり、発注を最初の3か月で終える必要がある', '作業の流れ別の実行計画', '（2027年4月〜2028年9月）',
      '使う場面：フェーズ（列）×作業の流れ（行）で、いつ何をするかを示す。各セルの棒に短い動詞句を書き、フェーズの境目の判断点を◆で示す。完了時期を決める作業の棒だけ紺。');
    const phases = [['フェーズ1　準備', '2027年4〜9月'], ['フェーズ2　実証', '2027年10月〜2028年3月'], ['フェーズ3　移行', '2028年4〜9月']];
    const lw = 2.1, x0 = L + lw, pw = (W - lw) / 3, top = 2.05;
    phases.forEach(([p, d], j) => {
      shape(s, j === 0 ? 'PENTAGON' : 'CHEVRON', x0 + j * pw, top, j < 2 ? pw + 0.04 : pw, 0.42, { fill: { color: G4 }, line: { type: 'none' } });
      txt(s, p, { x: x0 + j * pw + 0.25, y: top, w: pw - 0.4, h: 0.42, valign: 'middle', bold: true });
      txt(s, d, { x: x0 + j * pw, y: top + 0.45, w: pw, h: 0.3, align: 'center', color: G1 });
    });
    const rows = [['運行計画', [[0, 1, 'ダイヤ案の作成'], [1, 2, '実証運行と見直し'], [2, 3, '本格ダイヤ']]], ['車両', [[0, 0.5, '発注', true], [0.5, 2, '製造・納入'], [2, 3, '全車両の配備']]], ['システム', [[0, 1.2, '予約アプリの開発'], [1.2, 3, '試験運用と改良']]], ['利用促進', [[1, 2, '沿線への周知'], [2, 3, '定期券の切替え']]]];
    rows.forEach(([h, bars], i) => {
      const y = top + 0.95 + i * 0.8;
      txt(s, h, { x: L, y, w: lw - 0.1, h: 0.55, valign: 'middle', bold: true });
      if (i < rows.length - 1) line(s, L, y + 0.7, W, 0, G4, 0.75);
      bars.forEach(([a, b, t, key]) => {
        shape(s, 'RECTANGLE', x0 + a * pw + 0.05, y + 0.06, (b - a) * pw - 0.1, 0.44, { fill: { color: key ? NAVY : G5 }, line: { type: 'none' } });
        txt(s, t, { x: x0 + a * pw + 0.12, y: y + 0.06, w: (b - a) * pw - 0.24, h: 0.44, valign: 'middle', align: 'center', bold: key, color: key ? WHITE : BLACK, fontSize: 14 });
      });
    });
    [[1, '実証の可否'], [2, '本格運行の可否']].forEach(([j, t]) => {
      const x = x0 + j * pw;
      shape(s, 'LINE', x, top + 0.85, 0, 3.2, { line: { color: G1, width: 0.75, dashType: 'dash' } });
      shape(s, 'DIAMOND', x - 0.13, top + 4.05, 0.26, 0.26, { fill: { color: BLACK }, line: { type: 'none' } });
      txt(s, '判断：' + t, { x: x - 1.3, y: top + 4.33, w: 2.6, h: 0.3, align: 'center', fontSize: 14 });
    });
  }

  // ---------- P69 年表（タイムライン） ----------
  {
    const s = frame('P69', '1　現状', '沿線の交通は25年で3度の転機を経てきた。2020年の減便以降は利用の減少が加速しており、今回の見直しは2008年以来の大きな転機となる', '沿線の交通をめぐる主な出来事', '（2000〜2026年）',
      '使う場面：出来事の順番と間隔を示す。横の時間軸に年の目盛りを置き、出来事を上下交互に短く書く。期間のある出来事は軸の上に帯で示す。最も重要な出来事だけ紺の大きな点。');
    const y0 = 4.4, x0 = L + 0.4, x1 = R - 0.4, a = 2000, b = 2026;
    const X = yr => x0 + (yr - a) * (x1 - x0) / (b - a);
    line(s, x0, y0, x1 - x0, 0, G2, 1.5);
    for (let yr = 2000; yr <= 2025; yr += 5) { line(s, X(yr), y0 - 0.06, 0, 0.12, G2, 1); txt(s, String(yr), num({ x: X(yr) - 0.4, y: y0 + 0.1, w: 0.8, h: 0.3, align: 'center', color: G1 })); }
    shape(s, 'RECTANGLE', X(2020), y0 - 0.1, X(2026) - X(2020), 0.2, { fill: { color: G4 }, line: { type: 'none' } });
    txt(s, '利用の減少が加速', { x: X(2020), y: y0 + 0.42, w: X(2026) - X(2020), h: 0.3, align: 'center', color: G1 });
    const ev = [[2003, '第三セクターに移行', 1], [2008, '上下分離を検討し見送り', -1], [2012, '駅の無人化（6駅）', 1], [2016, '沿線高校の統合', -1], [2020, '減便（1日32→24本）', 1], [2026, '運営形態の見直し', -1, true]];
    ev.forEach(([yr, t, side, key]) => {
      const x = X(yr), up = side > 0, ly = up ? y0 - 1.25 : y0 + 0.75, tx = Math.min(x - 1.1, R - 2.2);
      line(s, x, up ? ly + 0.65 : y0, 0, up ? y0 - ly - 0.65 : ly - y0, key ? NAVY : G3, 0.75);
      dot(s, x, y0, key ? 0.3 : 0.16, key ? NAVY : G2);
      txt(s, String(yr), num({ x: tx, y: ly, w: 2.2, h: 0.3, align: x - 1.1 > tx ? 'right' : 'center', bold: true, color: key ? NAVY : BLACK }));
      txt(s, t, { x: tx, y: ly + 0.3, align: x - 1.1 > tx ? 'right' : 'center', w: 2.2, h: 0.35, bold: key, color: key ? NAVY : BLACK });
    });
  }

  // ---------- P70 選択肢カード（3案＋推奨） ----------
  {
    const s = frame('P70', '3　打ち手', '3つの運営形態のうち、上下分離案は町の負担を年4.1億円減らしつつ運行を続けられる。費用と継続性の両面で最も優れ、推奨案とする', '運営形態の3案の比較', '（町の負担は2030年度の試算）',
      '使う場面：選択肢を同じ項目の並びでカードにし、横に見比べられるようにする。項目の行は全カードで高さをそろえ、最も言いたい数値を大きく書く。推奨のカードだけ紺の枠と「推奨」の見出し。');
    const cards = [['A　現状維持', '町が赤字を補填し続ける', '6.3', '高い', '運行は続くが負担が増え続ける', 1], ['B　上下分離', '施設は町、運行は会社が担う', '2.2', '中程度', '補助制度の採択が前提', 3, true], ['C　バス転換', '鉄道を廃止しバスで代替する', '1.5', '低い', '利用者の3割が離れる恐れ', 2]];
    const cw = (W - 0.5) / 3, top = 2.15, labels = ['概要', '町の負担（億円／年）', '継続性', '主なリスク'];
    cards.forEach(([t, a, cost, cont, risk, rank, key], i) => {
      const x = L + i * (cw + 0.25);
      shape(s, 'RECTANGLE', x, top, cw, 4.45, { fill: { color: WHITE }, line: { color: key ? NAVY : G3, width: key ? 2 : 0.75 } });
      if (key) { fillRect(s, x + cw - 0.9, top - 0.18, 0.75, 0.34, NAVY); txt(s, '推奨', { x: x + cw - 0.9, y: top - 0.18, w: 0.75, h: 0.34, align: 'center', valign: 'middle', bold: true, color: WHITE }); }
      txt(s, t, { x: x + 0.2, y: top + 0.2, w: cw - 0.4, h: 0.4, bold: true, fontSize: 16, color: key ? NAVY : BLACK });
      line(s, x + 0.2, top + 0.7, cw - 0.4, 0, G4, 0.75);
      const vals = [a, cost, cont, risk];
      [0.8, 1.7, 2.95, 3.6].forEach((dy, j) => {
        txt(s, labels[j], { x: x + 0.2, y: top + dy, w: cw - 0.4, h: 0.28, color: G1 });
        txt(s, vals[j], j === 1 ? num({ x: x + 0.2, y: top + dy + 0.25, w: cw - 0.4, h: 0.65, fontSize: 32, bold: true, color: key ? NAVY : G2 }) : { x: x + 0.2, y: top + dy + 0.27, w: cw - 0.4, h: j === 3 ? 0.6 : 0.34, bold: key && j !== 0, color: BLACK });
      });
    });
  }

  // ---------- P71 関係者マップ（影響力×関心） ----------
  {
    const s = frame('P71', '4　実行計画', '8者の関係者のうち、影響力が大きく関心の低い県を早期に巻き込むことが鍵である。県の補助が上下分離案の前提となるため、年内に協議を始める', '関係者の影響力と関心', '（ヒアリングを基に評価）',
      '使う場面：関係者を影響力（縦）と関心（横）の2軸に置き、誰をどう巻き込むかを示す。象限の名前を四隅に書き、動かしたい関係者には目指す位置への点線矢印を付ける。最優先の関係者だけ紺。');
    const gx = L + 0.9, gy = 2.15, gw = 6.4, gh = 4.2;
    line(s, gx, gy + gh, gw, 0, G2, 1); line(s, gx, gy, 0, gh, G2, 1);
    shape(s, 'LINE', gx + gw / 2, gy, 0, gh, { line: { color: G3, width: 0.75, dashType: 'dash' } });
    shape(s, 'LINE', gx, gy + gh / 2, gw, 0, { line: { color: G3, width: 0.75, dashType: 'dash' } });
    txt(s, '影響力', { x: L, y: gy - 0.05, w: 0.85, h: 0.3, color: G1, bold: true });
    txt(s, '関心　→', { x: gx + gw - 1.3, y: gy + gh + 0.05, w: 1.3, h: 0.3, color: G1, bold: true, align: 'right' });
    [['満足を保つ', 0, 0], ['重点的に巻き込む', 1, 0], ['様子を見る', 0, 1], ['情報を伝える', 1, 1]].forEach(([t, c, r]) => txt(s, t, { x: gx + c * gw / 2 + 0.1, y: gy + r * gh / 2 + 0.05, w: gw / 2 - 0.2, h: 0.3, color: G3, bold: true, align: c ? 'right' : 'left' }));
    const P = [['県', 0.22, 0.85, true], ['鉄道会社', 0.82, 0.88], ['町長', 0.7, 0.75], ['国（運輸局）', 0.35, 0.68], ['沿線の高校', 0.62, 0.32], ['商工会', 0.42, 0.25], ['住民', 0.85, 0.4], ['観光協会', 0.18, 0.15]];
    P.forEach(([n, cx, cy, key]) => {
      const x = gx + cx * gw, y = gy + (1 - cy) * gh;
      dot(s, x, y, key ? 0.26 : 0.18, key ? NAVY : G2);
      txt(s, n, { x: x + 0.18, y: y - 0.17, w: 1.6, h: 0.34, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      if (key) arrow(s, x + 0.15, y + 0.05, gw * 0.45, 0, NAVY, 1.25, 'dash');
    });
    const rx = gx + gw + 0.4, rw = R - rx;
    txt(s, '巻き込み方', { x: rx, y: gy, w: rw, h: 0.3, bold: true, color: G1 });
    line(s, rx, gy + 0.36, rw, 0, G3, 0.75);
    txt(s, '県', { x: rx, y: gy + 0.5, w: rw, h: 0.3, bold: true, color: NAVY });
    txt(s, '補助の前提条件を年内に協議し、関心を高める', { x: rx, y: gy + 0.82, w: rw, h: 0.9, color: NAVY });
    line(s, rx, gy + 1.8, rw, 0, G4, 0.75);
    txt(s, '鉄道会社・町長', { x: rx, y: gy + 1.95, w: rw, h: 0.3, bold: true });
    txt(s, '月1回の協議会で進捗を共有する', { x: rx, y: gy + 2.27, w: rw, h: 0.65 });
  }
};
