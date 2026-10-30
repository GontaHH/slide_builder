// 記号集（S01・S02）とアイコン集（I01〜I04）
// 型の見本の中で使う矢印・符号・アイコンの「正しい使い方」を1か所にまとめたもの。詳しい決まりは docs/symbols.md と docs/icons.md。
const { ICONS } = require('./icons.js');

module.exports = function ({ pres, frame, txt, line, icon, C }) {
  const { F, NAVY, BLACK, G1, G2, G3, G4, WHITE, L, R, W } = C;
  const shape = (s, type, x, y, w, h, o) => s.addShape(pres.shapes[type], Object.assign({ x, y, w, h }, o));
  const ln = (s, x, y, w, h, color, width, o) => shape(s, 'LINE', x, y, w, h, { line: Object.assign({ color, width }, o || {}) });
  const OPT = { sticker: '記号集', rawNotes: true, source: '注）色・太さ・使う場面の決まりは docs/symbols.md を参照\n出所）rules/slide-rules.md（B-3 配色、C-1 本体の原則、D-2 チャートの作法）を基に作成' };

  // 1行に1つの記号：左に見本、中央に名前、右に使う場面（すべて14pt）
  const sheet = (id, msg, title, notes, items) => {
    const s = frame(id, '記号集', msg, title, null, notes, OPT);
    const rh = 0.66, top = 2.05, nx = L + 2.0, ux = L + 4.3;
    txt(s, '見本', { x: L, y: top, w: 1.8, h: 0.3, bold: true, color: G1, align: 'center' });
    txt(s, '名前', { x: nx, y: top, w: 2.2, h: 0.3, bold: true, color: G1 });
    txt(s, '使う場面と決まり', { x: ux, y: top, w: R - ux, h: 0.3, bold: true, color: G1 });
    ln(s, L, top + 0.36, W, 0, G2, 1);
    items.forEach(([n, use, draw], i) => {
      const y = top + 0.42 + i * rh;
      draw(s, L + 0.25, y + rh / 2, y);
      txt(s, n, { x: nx, y, w: 2.2, h: rh, bold: true, valign: 'middle' });
      txt(s, use, { x: ux, y, w: R - ux, h: rh, valign: 'middle' });
      ln(s, L, y + rh, W, 0, G4, 0.5);
    });
    return s;
  };
  const sym = (t, o) => (s, x, y, top) => txt(s, t, Object.assign({ x: L, y: top, w: 1.8, h: 0.66, fontSize: 20, bold: true, align: 'center', valign: 'middle', fontFace: 'Arial' }, o || {}));

  // 矢印・印の図形は scripts/mck_marks.js（公開資料 MCK04 の描き方）。既定は文字色とグレーで、紺は「その1枚の主役」の例だけ
  const M = require('./mck_marks.js');
  const X0 = L + 0.25, X1 = L + 1.55;   // 見本欄の左端・右端

  // ---------- S01 記号集①：矢印 ----------
  sheet('S01', '矢印は細い線に小さな塗りの三角の頭を付けて描き、意味は流れ・計画・やり取り・合流の4つに絞る。太い矢印は変化の向きを示す1本だけ', '矢印の使い分け（MCK04の描き方）',
    '記号集①。公開資料 MCK04（マッキンゼー、2022年）の矢印の描き方に合わせた（p5 の収束する線、p21 の太い矢印）。関連する型：P12 ポンチ絵、P45 循環サイクル、P47 分岐と判断、P71 関係者マップ。\n図形は scripts/mck_marks.js（flow・bold・merge）で描く。PowerPoint の線の矢印（頭が小さく潰れる）は使わない。', [
      ['流れの矢印', 'モノ・お金・データの流れ。線の上に流れるものを書く（Gray2、1pt、頭は小さな塗りの三角。MCK04-p5）', (s, x, y) => M.flow(pres, s, X0, y, X1, y)],
      ['太い矢印', '変化の向き（伸びる・転じる）を示す1本だけ。文字色で描き、主役のときだけ紺（4.5pt。MCK04-p21）', (s, x, y) => M.bold(pres, s, X0, y + 0.16, X1, y - 0.16)],
      ['点線の矢印', '将来の計画、目指す位置、間接的な関係（実線と同じ頭）', (s, x, y) => M.flow(pres, s, X0, y, X1, y, { dash: true })],
      ['双方向の矢印', '相互のやり取り。片方向で言えるなら片方向にする', (s, x, y) => M.flow(pres, s, X0, y, X1, y, { both: true })],
      ['合流の矢印', '複数の要素が1つにまとまる。細い線を1点に集め、そこから1本の矢印を出す（MCK04-p5）。分岐はこの逆向き', (s, x, y) => M.merge(pres, s, [[X0, y - 0.24], [X0, y], [X0, y + 0.24]], X0 + 0.55, y, X1)],
      ['循環の印', '繰り返し・好循環。矢印で円を描かず、アイコン（refresh-cw、グレー）を添えて起点を1つ示す', (s, x, y) => icon(s, 'refresh-cw', X0 + 0.42, y - 0.22, 0.44, G2)],
    ]);

  // ---------- S02 記号集②：線と注釈 ----------
  sheet('S02', '差・伸び・平均・段の区切りは、図の上に細い線と短い文字で書き込んで示す。括弧や吹き出しで囲まず、値は線の脇に太字で添える', '線と注釈の使い分け（MCK04の描き方）',
    '記号集②。MCK04 の注釈の描き方に合わせた（p5・p26 の差の矢印、p31 の平均「Ø」、p5 の段の区切り）。関連する型：P03 縦棒＋CAGR、P13 プロセス、P21 前提→帰結、P25 ガント、P60 ダンベル。\n図形は scripts/mck_marks.js（drop・step・cause）で描く。', [
      ['差の矢印', '2本の棒の差。高い棒の上端から細線を伸ばし、低い棒の上端まで縦の矢印を下ろして「−17%」を太字で添える（MCK04-p26）', (s, x, y) => { M.drop(pres, s, X0 + 0.75, y - 0.22, y + 0.2, '−17%', { from: X0 }); }],
      ['伸び率の矢印', '時系列の伸び。棒の上に斜めの細い矢印を置き、上に「年平均＋6.7%」と書く', (s, x, y) => { M.flow(pres, s, X0, y + 0.18, X1, y - 0.12, { color: BLACK }); }],
      ['平均の線', '平均・基準の横線。線の右端に「Ø 36」と値を書き、凡例に頼らない（MCK04-p31）', (s, x, y) => { M.seg(pres, s, X0, y, X1 - 0.45, y, BLACK, 0.75); txt(s, 'Ø 36', { x: X1 - 0.4, y: y - 0.15, w: 0.6, h: 0.3, fontFace: 'Arial', fontSize: 12, bold: true, valign: 'middle' }); }],
      ['段の区切り', '左から右へ進む段（インプット→処理→アウトプット）。縦の区切り線の上に、白い丸に細い「＞」を置く（MCK04-p5）', (s, x, y) => { M.seg(pres, s, X0 + 0.65, y - 0.3, X0 + 0.65, y + 0.3, G3, 0.75); M.step(pres, s, X0 + 0.65, y, 0.34); }],
      ['因果の三角', '左右の間の強い因果。1枚に1つまで。グレーの塗りの細い三角だけで、線や枠を付けない', (s, x, y) => M.cause(pres, s, X0 + 0.55, y - 0.2, 0.4)],
      ['判断点', '節目・判断の時期。判断の内容を下に書く（文字色の◆）', (s, x, y) => { ln(s, X0, y, 1.3, 0, G3, 1); shape(s, 'DIAMOND', X0 + 0.52, y - 0.13, 0.26, 0.26, { fill: { color: BLACK }, line: { type: 'none' } }); }],
    ]);

  // ---------- S03 記号集③：数値の符号 ----------
  sheet('S03', '数値の符号は1つの意味に1つの書き方で統一する。負の数は「−」で書き、▲や△を符号に使わない。比率の差はpt、比較は倍で書く', '数値の符号の書き方',
    '記号集③。関連する型：P03 CAGR、P05 構成比、P06 ウォーターフォール、P29 計算ロジック、P36 差の表。\n理由と例は docs/symbols.md。', [
      ['増減の符号', '負の数は「−」で書く。▲・△は会計の「マイナス」と紛れるので使わない', sym('+ −')],
      ['増減の向き', '表の中で向きだけを示すときに使う。数値の符号の代わりにしない', sym('▲ ▼', { fontFace: F })],
      ['比率の差', '「52%→46%」の差は「−6pt」と書く。「−6%」と書かない', sym('pt')],
      ['比較', '「1.5倍」と書く。同じ資料の中で「150%」と混ぜない', sym('倍', { fontFace: F })],
      ['期間・範囲', '「2015–2025年度」「3–5件」。文中の範囲は「〜」を使う', sym('–')],
      ['変化の前後', '「32→24本」。結論の「⇒」は使わず、言葉で書く', sym('→')],
    ]);

  // ---------- S04 記号集④：印と表記 ----------
  const harvey = (s, x, y, q) => {
    shape(s, 'OVAL', x, y, 0.26, 0.26, { fill: { color: q === 4 ? G2 : WHITE }, line: { color: G2, width: 1 } });
    if (q > 0 && q < 4) shape(s, 'PIE', x, y, 0.26, 0.26, { fill: { color: G2 }, line: { type: 'none' }, angleRange: [270, 270 + q * 90] });
  };
  sheet('S04', '評価・該当・番号・注記の印は図形か決まった文字で書き、凡例で意味を定義する。該当なしは空欄にせず「―」を置き、推計値は（見込）で区別する', '印と表記の使い分け',
    '記号集④。関連する型：P16 評価表、P10 チャート＋キーメッセージ欄、P58 索引付きチェック表、P03 見通し。\n理由と例は docs/symbols.md。', [
      ['評価', 'ハーベイボール。凡例で基準を必ず定義する。信号色は使わない', (s, x, y) => [0, 1, 2, 3, 4].forEach(q => harvey(s, x - 0.15 + q * 0.33, y - 0.13, q))],
      ['該当・対象外の印', '対象と対象外を並べるときは✓と×を細い丸で囲む（MCK04-p4）。表の中では✓だけを使い、○×と混ぜない', (s, x, y) => { require('./mck_marks.js').badge(pres, s, X0 + 0.45, y, 0.32, '✓', { outline: true }); require('./mck_marks.js').badge(pres, s, X0 + 0.9, y, 0.32, '×', { outline: true }); }],
      ['番号・区分の丸', '論点の番号は文字色の塗りの丸に白抜き、区分（A・B）は白い丸に細い線（MCK04-p5・p21）。丸数字の文字は使わない', (s, x, y) => { require('./mck_marks.js').badge(pres, s, X0 + 0.45, y, 0.32, '1'); require('./mck_marks.js').badge(pres, s, X0 + 0.9, y, 0.32, 'A', { outline: true }); }],
      ['注記', '本文の肩番号と「注）1.」を対応させ、出所の上に書く', sym('注）1.', { fontSize: 14, fontFace: F })],
      ['該当なし', '空欄にせず「―」を置く。「0」と区別する', sym('―', { fontFace: F })],
      ['推計値', '実績と区別する。年度の後ろに付け、棒の色を淡くする', sym('（見込）', { fontSize: 14, fontFace: F })],
    ]);

  // ---------- I01〜I04 アイコン集 ----------
  const IOPT = { sticker: 'アイコン集', rawNotes: true, source: '注）アイコンは Lucide（ISCライセンス）の線画をグレー・線幅1.5に整えたもの。SVGは templates/icons/ にある\n出所）Lucide Contributors「Lucide」（lucide.dev）を基に作成' };
  const msgs = [
    'アイコンは関係図で主体や流れを示すために使い、飾りには使わない。人・組織と施設・地域の20種で、関係図の登場人物の大半を表せる',
    '移動・物流とお金・数字のアイコンは、関係図の矢印に流れるものを示すときに使う。アイコンだけで意味を伝えず、必ず短い名前を下に添える',
    '情報・技術と行為・状態のアイコンは、仕組みや取組の中身を示すときに使う。1枚に使う種類は6つまでとし、絵柄の太さと色をそろえる',
    '環境・健康のアイコンは政策や取組の分野を示すときに使う。色はグレーを基本とし、変化する主体や注目する分野の1つだけを紺にする',
  ];
  const groups = [[0, 1], [2, 3], [4, 5], [6]];
  groups.forEach((g, k) => {
    const s = frame('I0' + (k + 1), 'アイコン集', msgs[k], 'アイコン集（' + g.map(i => ICONS[i][0]).join('・') + '）', '（全70種、templates/icons/*.svg）',
      `アイコン集 ${k + 1}/4。関連する型：P12 ポンチ絵、P67 体制図。\nPowerPoint では「挿入→画像→このデバイス」で SVG を挿入し、「グラフィックス形式→線」で色を変える。名前はアイコンの下に14ptで添える。`, IOPT);
    g.forEach((gi, r) => {
      const [cat, list] = ICONS[gi], y0 = 2.05 + r * 2.4;
      txt(s, cat, { x: L, y: y0, w: 3, h: 0.3, bold: true, color: G1 });
      line(s, L, y0 + 0.34, W, 0, G3, 0.5);
      list.forEach(([file, name], i) => {
        const col = i % 5, row = Math.floor(i / 5), x = L + col * (W / 5), y = y0 + 0.45 + row * 0.95;
        const key = k === 3 && i === 0;
        icon(s, file, x + 0.05, y + 0.05, 0.5, key ? NAVY : G2);
        txt(s, name, { x: x + 0.65, y: y + 0.02, w: W / 5 - 0.7, h: 0.32, bold: true, color: key ? NAVY : BLACK });
        txt(s, '（' + file + '）', { x: x + 0.6, y: y + 0.32, w: W / 5 - 0.6, h: 0.26, fontSize: 11, color: G1, fontFace: 'Arial' });
      });
    });
    if (k === 3) {
      const y0 = 4.55;
      txt(s, '使い方の例（紺は1つだけ）', { x: L, y: y0, w: 4, h: 0.3, bold: true, color: G1 });
      line(s, L, y0 + 0.34, W, 0, G3, 0.5);
      [['landmark', '町', false], ['train-front', '鉄道会社', true], ['users', '利用者', false]].forEach(([f, n, key], i) => {
        const x = L + 0.6 + i * 3.4;
        shape(s, 'OVAL', x, y0 + 0.55, 0.95, 0.95, { fill: { color: WHITE }, line: { color: key ? NAVY : G3, width: key ? 2 : 1 } });
        icon(s, f, x + 0.2, y0 + 0.75, 0.55, key ? NAVY : G2);
        txt(s, n, { x: x - 0.5, y: y0 + 1.55, w: 1.95, h: 0.32, align: 'center', bold: key, color: key ? NAVY : BLACK });
        if (i < 2) shape(s, 'LINE', x + 1.1, y0 + 1.02, 2.15, 0, { line: { color: i === 0 ? G2 : NAVY, width: i === 0 ? 1 : 1.75, endArrowType: 'triangle' } });
      });
      txt(s, '補助金', { x: L + 1.9, y: y0 + 0.7, w: 1.6, h: 0.3, align: 'center', color: G1 });
      txt(s, '運行サービス', { x: L + 5.2, y: y0 + 0.7, w: 1.8, h: 0.3, align: 'center', bold: true, color: NAVY });
    }
  });
};
