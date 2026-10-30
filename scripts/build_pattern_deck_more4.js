// 追加の型 P72〜P78（2026-10-22 追加・第4弾）
// Jinba consulting-pptx-skill（github.com/carnot-tech/jinba-consulting-pptx-skill、MIT License）の型カタログ62型のうち、
// 本リポジトリに無かった7つの見せ方を、本スキルの規定（NRIの骨格・紺1点・14pt以上・見出し＋線の器）で作り直したもの。
// 対応：P72＝claim_panel_figure、P73＝delta_bars_totals、P74＝progress_bubble_matrix、P75＝ranked_bar_annotated、
//       P76＝nested_row_matrix、P77＝issue_cause_solution、P78＝opposing_chevrons。
// 見本の値はすべて架空（みなと市のバス事業・行政手続き）。
module.exports = function ({ pres, frame, txt, line, rect, head, rowRule, bullets, chartBase, C }) {
  const { F, NAVY, BLACK, G1, G2, G3, G4, G5, WHITE, L, R, W, BODY_Y, BLUE5 } = C;
  const num = (o) => Object.assign({ fontFace: 'Arial', fontSize: 12 }, o);   // 図の中の数値は12pt（B-2）
  const tri = (s, x, y, w, h, color) => require('./mck_marks.js').cause(pres, s, x, y, Math.min(w, h) * 1.25, { key: color === NAVY });   // 因果の三角（グレーの塗りの細い三角）
  const bar = (s, x, y, w, h, color) => s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color }, line: { type: 'none' } });

  // ---------- P72 主張パネル＋図（各論に一覧の番号を持ち込む） ----------
  {
    const s = frame('P72', '2　課題（論点2）', '支線の1便当たりの赤字は1万2千円で、幹線の4倍に達する。赤字の原因は便数の多さではなく、1便当たりの乗客の少なさにある', null, null,
      '使う場面：全体マップ・イシューツリー・エグゼクティブサマリーで番号を振った論点を、各論のページで受けるとき。左1/4に「番号＋区分名＋この1枚の主張」、右3/4に根拠の図を置く。番号と区分名は一覧のページと一字一句そろえる。\n差し替え：番号、区分名、主張、右の図。\n作法：左のパネルを濃い塗りの箱にしない。紺の大きな番号と、パネルと図の間の紺の縦線で区切る（塗りの面を増やさない）。主張はメッセージラインの言い換えでなく、その根拠の一点を書く。');
    const pw = 2.35, gx = L + pw + 0.45, gw = R - gx;
    txt(s, '2', num({ x: L, y: BODY_Y + 0.05, w: pw, h: 1.0, fontSize: 54, bold: true, color: NAVY }));
    txt(s, '論点2　赤字の原因', { x: L, y: BODY_Y + 1.15, w: pw, h: 0.35, bold: true, color: NAVY });
    rowRule(s, L, BODY_Y + 1.6, pw - 0.15);
    txt(s, '支線は、1便に乗る客の少なさで赤字が膨らむ', { x: L, y: BODY_Y + 1.75, w: pw - 0.15, h: 1.3, bold: true, color: NAVY });
    txt(s, '→ 打ち手はp.17', { x: L, y: 6.2, w: pw, h: 0.3, color: G1 });
    line(s, L + pw + 0.2, BODY_Y + 0.1, 0, 4.95, NAVY, 2);
    head(s, gx, BODY_Y, gw, '路線区分別の1便当たりの赤字（円、2025年度）');
    const items = [['支線（12路線）', 12000, true], ['循環線', 5800, false], ['深夜便', 4100, false], ['幹線（4路線）', 3000, false]];
    const lw = 1.65, sc = (gw - lw - 1.0) / 12000;
    items.forEach(([n, v, key], i) => {
      const y = 2.25 + i * 1.0;
      txt(s, n, { x: gx, y, w: lw, h: 0.6, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      bar(s, gx + lw, y + 0.12, v * sc, 0.36, key ? NAVY : G3);
      txt(s, v.toLocaleString(), num({ x: gx + lw + v * sc + 0.08, y, w: 0.9, h: 0.6, valign: 'middle', bold: key, color: key ? NAVY : BLACK }));
    });
    line(s, gx + lw, 2.2, 0, 4.0, G3, 0.75);
    rowRule(s, gx, 6.25, gw);
    txt(s, '1便当たりの乗客　支線 1.2人／幹線 9.8人', { x: gx, y: 6.33, w: gw, h: 0.32, color: G1 });
  }

  // ---------- P73 増減の縦棒＋左右合計 ----------
  {
    const s = frame('P73', '3　打ち手', '予約型交通の試行で1日200人が新たに乗り、185人が乗らなくなった。差し引きの増加は15人にとどまり、減った分の4割は東部の定時便の利用者である', '地区別の1日当たり利用者数の増減', '（人／日、試行前1か月と試行後1か月の比較）',
      '使う場面：項目ごとに増える分と減る分の両方があり、総量の差し引きだけでは中身が見えないとき。基準線の上に増える分、下に減る分を描き、左端に増減それぞれの合計を大きく置く。注目の1本だけ紺。\n差し替え：項目、増加・減少の値、合計。\n作法：増減を赤と緑で塗り分けない（＋−の符号と位置で示す）。合計は検算する。');
    const rows = [['北部', 60, 20], ['西部', 40, 55], ['東部', 10, 70], ['中央部', 70, 15], ['南部', 20, 25]];
    const up = rows.reduce((a, r) => a + r[1], 0), dn = rows.reduce((a, r) => a + r[2], 0);
    const lw = 2.4, gx = L + lw + 0.3, gw = R - gx, base = 4.15, sc = 0.024, cw = gw / rows.length;
    txt(s, '＋' + up, num({ x: L, y: 2.35, w: lw, h: 0.8, fontSize: 36, bold: true }));
    txt(s, '増える分', { x: L, y: 3.15, w: lw, h: 0.32, color: G1 });
    txt(s, '−' + dn, num({ x: L, y: 4.45, w: lw, h: 0.8, fontSize: 36, bold: true }));
    txt(s, '減る分', { x: L, y: 5.25, w: lw, h: 0.32, color: G1 });
    rowRule(s, L, 5.75, lw - 0.1);
    txt(s, '差し引き　＋' + (up - dn), num({ x: L, y: 5.85, w: lw, h: 0.35, bold: true, color: NAVY }));
    line(s, gx, base, gw, 0, G2, 1);
    rows.forEach(([n, u, d], i) => {
      const x = gx + i * cw + cw * 0.3, bw = cw * 0.4, key = n === '東部';
      bar(s, x, base - u * sc, bw, u * sc, G2);
      bar(s, x, base, bw, d * sc, key ? NAVY : G3);
      txt(s, '＋' + u, num({ x: x - 0.2, y: base - u * sc - 0.32, w: bw + 0.4, h: 0.28, align: 'center' }));
      txt(s, '−' + d, num({ x: x - 0.2, y: base + d * sc + 0.04, w: bw + 0.4, h: 0.28, align: 'center', bold: key, color: key ? NAVY : BLACK }));
      txt(s, n, { x: gx + i * cw, y: 6.3, w: cw, h: 0.32, align: 'center', bold: key, color: key ? NAVY : BLACK });
    });
    txt(s, '補足：基準線の上は新たに乗った人、下は乗らなくなった人', { x: L, y: 6.3, w: lw, h: 0.45, fontSize: 11, color: G1 });
  }

  // ---------- P74 進捗バブル行列 ----------
  {
    const s = frame('P74', '1　現状', '市の手続き420件のうちオンラインで完結するのは84件にとどまる。未着手の8割は福祉と税に集中しており、両部門から手を付ける必要がある', '部門別・段階別の手続きの件数', '（件、2026年9月時点、円の面積は件数に比例）',
      '使う場面：行（部門・地域）×列（段階）の件数を、円の面積で一覧にする。どの段階に件数が溜まっているかを一目で見せる。注目の円だけ紺。行と列の合計を端に置く。\n差し替え：行・列の名前、件数。\n作法：円の直径でなく面積を件数に比例させる。円の横に数字を書き、凡例に頼らない。');
    const cols = ['未着手', '試行中', '一部で運用', 'オンラインで完結'];
    const rows = [['福祉', [98, 18, 12, 8]], ['税', [72, 15, 16, 13]], ['交通', [15, 14, 20, 35]], ['環境', [19, 18, 19, 28]]];
    const lw = 1.6, tw = 1.0, cw = (W - lw - tw) / 4, top = 2.1, rh = 0.86, k = 0.08;
    txt(s, '部門', { x: L, y: top, w: lw, h: 0.35, bold: true });
    cols.forEach((c, j) => txt(s, c, { x: L + lw + j * cw, y: top, w: cw, h: 0.35, align: 'center', bold: true }));
    txt(s, '計', { x: R - tw, y: top, w: tw, h: 0.35, align: 'right', bold: true });
    line(s, L, top + 0.42, W, 0, G2, 1);
    const colSum = [0, 0, 0, 0];
    rows.forEach(([n, v], i) => {
      const y = top + 0.5 + i * rh, cy = y + rh / 2 - 0.04;
      txt(s, n, { x: L, y, w: lw, h: rh - 0.08, valign: 'middle', bold: true });
      v.forEach((c, j) => {
        colSum[j] += c;
        const d = Math.sqrt(c) * k, cx = L + lw + j * cw + cw / 2 - 0.25, key = j === 0 && i < 2;
        s.addShape(pres.shapes.OVAL, { x: cx - d / 2, y: cy - d / 2, w: d, h: d, fill: { color: key ? NAVY : G3 }, line: { type: 'none' } });
        txt(s, String(c), num({ x: cx + Math.max(d / 2, 0.2) + 0.05, y: cy - 0.16, w: 0.6, h: 0.32, bold: key, color: key ? NAVY : BLACK }));
      });
      txt(s, String(v.reduce((a, b) => a + b, 0)), num({ x: R - tw, y, w: tw, h: rh - 0.08, valign: 'middle', align: 'right' }));
      if (i < rows.length - 1) rowRule(s, L, y + rh - 0.04, W);
    });
    const yt = top + 0.5 + rows.length * rh + 0.04;
    line(s, L, yt, W, 0, G2, 1);
    txt(s, '計', { x: L, y: yt + 0.06, w: lw, h: 0.35, bold: true });
    colSum.forEach((c, j) => txt(s, String(c), num({ x: L + lw + j * cw, y: yt + 0.06, w: cw - 0.5, h: 0.35, align: 'center', bold: true })));
    txt(s, String(colSum.reduce((a, b) => a + b, 0)), num({ x: R - tw, y: yt + 0.06, w: tw, h: 0.35, align: 'right', bold: true }));
  }

  // ---------- P75 分布の順位棒＋注記（ロングテール） ----------
  {
    const vals = Array.from({ length: 120 }, (_, i) => Math.round(260 * Math.pow(i + 1, -1.05) + 2));
    const total = vals.reduce((a, b) => a + b, 0), top12 = vals.slice(0, 12).reduce((a, b) => a + b, 0);
    const under10 = vals.slice(12).filter(v => v < 10).length, share = Math.round(top12 / total * 100);
    const s = frame('P75', '2　課題', `市内120の停留所のうち、上位1割の12か所で乗車の${share}%を占める。残る108か所の大半は1日10人未満で、乗降地点を集約する余地が大きい`, '停留所別の1日当たり乗車人数', '（人、120停留所を多い順に並べたもの、2025年度）',
      '使う場面：項目が数十〜数百あり、少数の上位に量が集中している（裾が長く伸びる）ことを示す。全項目を多い順の細い棒で並べ、上位の区切りに線を引いて、その割合を注記する。上位の棒だけ紺。\n差し替え：項目の値（多い順）、区切りの位置、注記。\n作法：項目名は書かない（数が多く読めない）。読ませるのは形と区切りの注記。右に読み取りを置く。');
    const gx = L, gw = 6.6, base = 6.3, sc = 3.7 / vals[0], bw = gw / vals.length;
    vals.forEach((v, i) => bar(s, gx + i * bw + bw * 0.12, base - v * sc, bw * 0.76, v * sc, i < 12 ? NAVY : G3));
    line(s, gx, base, gw, 0, G2, 1);
    const cut = gx + 12 * bw;
    s.addShape(pres.shapes.LINE, { x: cut, y: 2.2, w: 0, h: base - 2.2, line: { color: G2, width: 1, dashType: 'dash' } });
    txt(s, `上位12か所\n乗車の${share}%`, { x: cut + 0.12, y: 2.2, w: 2.2, h: 0.65, bold: true, color: NAVY });
    txt(s, '多い順 →', { x: gx, y: base + 0.05, w: 1.5, h: 0.3, fontSize: 11, color: G1 });
    const rx = L + gw + 0.45, rw = R - rx;
    head(s, rx, BODY_Y + 0.4, rw, '読み取り');
    [[`上位12か所（1割）で${share}%`, `1日${top12.toLocaleString()}人／全体${total.toLocaleString()}人`], [`${under10}か所は1日10人未満`, '残る108か所の8割以上'], ['集約の候補', '10人未満の停留所を予約型の乗降地点にまとめる']].forEach(([h, b], i) => {
      const y = 2.5 + i * 1.3;
      txt(s, h, { x: rx, y, w: rw, h: 0.34, bold: true, color: i === 0 ? NAVY : BLACK });
      txt(s, b, { x: rx, y: y + 0.4, w: rw, h: 0.6 });
      if (i < 2) rowRule(s, rx, y + 1.12, rw);
    });
  }

  // ---------- P76 入れ子行の行列 ----------
  {
    const s = frame('P76', '3　打ち手', '移動支援の費用4.3億円の8割は、移動の手段を用意するメニューに向いている。負担を下げるメニューは費用が小さく、拡充の余地が大きい', '移動支援のメニューと費用', '（百万円／年、2025年度）',
      '使う場面：行を大分類で束ね、その中に小分類の行を入れ子にする一覧。大分類ごとの小計を添え、大分類どうしの比較を読ませる。注目の大分類だけ紺。\n差し替え：大分類、メニュー、対象、費用。\n作法：大分類を濃い塗りの箱にしない。大分類の名前と小計を左に置き、その範囲を縦の線で括る。大分類の間に全幅の線を1本、行の間は細い線（H-5）。');
    const groups = [['移動の手段を用意する', [['予約型交通', '高齢者・通学の生徒', 180], ['コミュニティバス', '全住民', 120], ['福祉有償運送', '要介護者', 40]], false],
      ['移動の負担を下げる', [['運賃の割引', '70歳以上', 50], ['タクシー券', '免許を返納した人', 20], ['通院の付添い', '要介護者', 15]], true]];
    const gw = 2.7, mx = L + gw + 0.25, mw = 3.0, tx = mx + mw, tw = 2.6, vx = R - 1.6, rh = 0.52, top = 2.1;
    txt(s, '分類', { x: L, y: top, w: gw, h: 0.35, bold: true });
    txt(s, 'メニュー', { x: mx, y: top, w: mw, h: 0.35, bold: true });
    txt(s, '対象', { x: tx, y: top, w: tw, h: 0.35, bold: true });
    txt(s, '費用', { x: vx, y: top, w: 1.6, h: 0.35, bold: true, align: 'right' });
    line(s, L, top + 0.42, W, 0, G2, 1);
    let y = top + 0.55;
    const total = groups.reduce((a, g) => a + g[1].reduce((b, r) => b + r[2], 0), 0);
    groups.forEach(([g, items, key], gi) => {
      const sub = items.reduce((a, r) => a + r[2], 0), gh = items.length * rh;
      txt(s, g, { x: L, y, w: gw - 0.2, h: 0.4, bold: true, color: key ? NAVY : BLACK });
      txt(s, `小計 ${sub}（${Math.round(sub / total * 100)}%）`, num({ x: L, y: y + 0.42, w: gw - 0.2, h: 0.35, bold: key, color: key ? NAVY : G1 }));
      line(s, mx - 0.12, y + 0.06, 0, gh - 0.12, key ? NAVY : G3, key ? 2 : 1.25);
      items.forEach(([m, who, v], j) => {
        const yy = y + j * rh;
        txt(s, m, { x: mx, y: yy, w: mw, h: rh, valign: 'middle', bold: key, color: key ? NAVY : BLACK });
        txt(s, who, { x: tx, y: yy, w: tw, h: rh, valign: 'middle' });
        txt(s, String(v), num({ x: vx, y: yy, w: 1.6, h: rh, valign: 'middle', align: 'right', bold: key, color: key ? NAVY : BLACK }));
        if (j < items.length - 1) rowRule(s, mx, yy + rh, R - mx);
      });
      y += gh + 0.1;
      if (gi < groups.length - 1) { line(s, L, y, W, 0, G2, 1); y += 0.15; }
    });
    line(s, L, y + 0.05, W, 0, G2, 1);
    txt(s, '合計', { x: L, y: y + 0.12, w: gw, h: 0.35, bold: true });
    txt(s, String(total), num({ x: vx, y: y + 0.12, w: 1.6, h: 0.35, bold: true, align: 'right' }));
  }

  // ---------- P77 課題→原因→解決 ----------
  {
    const s = frame('P77', '3　打ち手', '利用者が挙げる不便は、それぞれ別の原因から生じている。最も効くのは支線の時刻を幹線に合わせることで、費用を増やさずに乗継ぎの待ちを減らせる', '利用者が感じる不便の原因と解決', '（利用者アンケートの上位の不便、2026年5月）',
      '使う場面：課題ごとに原因を1段挟んで解決を示す。課題と解決を直接つなぐと「なぜその解決か」が飛ぶときに使う。行は課題ごと、列は課題・原因・解決。最も効く解決の行だけ紺。\n差し替え：課題、原因、解決、費用。\n作法：課題→原因→解決の向きは見出しの行に三角を1つずつ置いて示し、行ごとに矢印を繰り返さない。原因は「未達の事実」でなく仕組みを書く。');
    const cols = [['課題（利用者の不便）', 2.9], ['原因', 2.9], ['解決', 3.0], ['追加の費用', W - 9.1]];
    let x = L; const xs = [];
    cols.forEach(([h, w], j) => { xs.push(x); head(s, x, BODY_Y + 0.45, w - (j < 3 ? 0.3 : 0), h, { key: j === 2, align: j === 3 ? 'right' : 'left' }); if (j < 2) tri(s, x + w - 0.24, BODY_Y + 0.55, 0.18, 0.14, G2); x += w + 0.1; });
    const rows = [['乗継ぎで30分以上待つ', '支線と幹線の時刻を別々に決めている', '支線の発車を幹線の到着に合わせる', 'なし', true], ['電話の予約がつながらない', '予約を受ける回線が1つしかない', 'アプリと自動音声の予約を加える', '年600万円', false], ['夕方の便が少ない', '運転士の勤務が日中に偏っている', '勤務を2交代にして夕方の便を増やす', '年900万円', false]];
    rows.forEach((r, i) => {
      const y = 2.6 + i * 1.25;
      r.slice(0, 4).forEach((t, j) => txt(s, t, Object.assign({ x: xs[j], y, w: cols[j][1] - 0.3, h: 1.0, valign: 'middle', bold: r[4] && j >= 2, color: r[4] && j >= 2 ? NAVY : BLACK }, j === 3 ? num({ align: 'right', w: cols[3][1] }) : {})));
      if (i < rows.length - 1) rowRule(s, L, y + 1.12, W);
    });
  }

  // ---------- P78 対向シェブロン（押し上げ要因と押し下げ要因） ----------
  {
    const s = frame('P78', '1　現状', '2035年度までに需要は通院の増加などで18万回増えるが、人口減少などで31万回減る。差し引き13万回の減少を前提に計画すべきである', '2035年度までの年間需要の増減要因', '（万回／年、2025年度比、市の推計）',
      '使う場面：同じ量を押し上げる要因と押し下げる要因が同時に働き、差し引きの向きを示したいとき。左に押し上げ要因、右に押し下げ要因を並べ、中央に向きの異なる矢羽を置く。差し引きを下に1行で書く。差し引きを決める側の合計だけ紺。\n差し替え：要因、値、合計。\n作法：要因の値は同じ単位・同じ期間でそろえ、合計を検算する。赤と緑で塗り分けない。');
    const up = [['通院の増加', 9], ['免許の返納の増加', 6], ['観光客の回復', 3]], dn = [['人口の減少', 19], ['通学の減少', 8], ['在宅勤務の定着', 4]];
    const su = up.reduce((a, r) => a + r[1], 0), sd = dn.reduce((a, r) => a + r[1], 0);
    const cw = 3.6, lx = L, rx = R - cw, cx = L + cw + 0.35, cwid = rx - 0.35 - cx;
    head(s, lx, BODY_Y + 0.45, cw, '押し上げる要因');
    head(s, rx, BODY_Y + 0.45, cw, '押し下げる要因', { key: true });
    const list = (x, items, sign, key) => items.forEach(([n, v], i) => {
      const y = 2.6 + i * 0.85;
      txt(s, n, { x, y, w: cw - 1.0, h: 0.6, valign: 'middle', bold: key && i === 0, color: key && i === 0 ? NAVY : BLACK });
      txt(s, sign + v, num({ x: x + cw - 1.0, y, w: 1.0, h: 0.6, valign: 'middle', align: 'right', bold: key && i === 0, color: key && i === 0 ? NAVY : BLACK }));
      if (i < items.length - 1) rowRule(s, x, y + 0.72, cw);
    });
    list(lx, up, '＋', false); list(rx, dn, '−', true);
    const ty = 2.6 + 3 * 0.85 + 0.05;
    line(s, lx, ty, cw, 0, G2, 1); line(s, rx, ty, cw, 0, NAVY, 1.25);
    txt(s, '計', { x: lx, y: ty + 0.08, w: 1, h: 0.4, bold: true }); txt(s, '＋' + su, num({ x: lx + cw - 1.0, y: ty + 0.08, w: 1.0, h: 0.4, align: 'right', bold: true, fontSize: 18 }));
    txt(s, '計', { x: rx, y: ty + 0.08, w: 1, h: 0.4, bold: true, color: NAVY }); txt(s, '−' + sd, num({ x: rx + cw - 1.0, y: ty + 0.08, w: 1.0, h: 0.4, align: 'right', bold: true, fontSize: 18, color: NAVY }));
    s.addShape(pres.shapes.CHEVRON, { x: cx + cwid / 2 - 0.55, y: 2.55, w: 1.1, h: 1.0, rotate: 270, fill: { color: G3 }, line: { type: 'none' } });
    txt(s, '押し上げ', { x: cx, y: 3.6, w: cwid, h: 0.3, align: 'center', color: G1 });
    s.addShape(pres.shapes.CHEVRON, { x: cx + cwid / 2 - 0.55, y: 4.15, w: 1.1, h: 1.0, rotate: 90, fill: { color: NAVY }, line: { type: 'none' } });
    txt(s, '押し下げ', { x: cx, y: 5.2, w: cwid, h: 0.3, align: 'center', bold: true, color: NAVY });
    rowRule(s, L, 5.95, W);
    txt(s, `差し引き　＋${su} − ${sd} ＝ −${sd - su}万回／年`, num({ x: L, y: 6.05, w: W, h: 0.4, bold: true, color: NAVY, align: 'center' }));
  }
};
