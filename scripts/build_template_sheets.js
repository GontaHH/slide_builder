// テンプレート集（T01〜T21）とパーツ集（S05・S06）
// 自作の書式「HG_pptFMT」の型を、本リポジトリの規定（指定色・14pt以上・ガイド線）で描き直したもの（2026-10-22）。
// 型の見本（P01〜P80）は架空の値で「完成形の見た目」を示すのに対し、テンプレート集は中身を空けた骨組み（XX）で、
// 新しいスライドを作るときにコピーして中身を入れる。使う場面と対応する型はノートに書いた。
// 元の書式の「Original Icons」は再配布できるか分からないため入れていない（アイコンは templates/icons/ を使う）。
const { hgArrow, hgCircle } = require('./hg_arrows.js');
module.exports = function ({ pres, frame, txt, line, rect, head, rowRule, icon, C }) {
  const { F, NAVY, BLACK, G1, G2, G3, G5, WHITE, L, R, W, BODY_Y, BLUE5 } = C;
  const MID = L + W / 2;                                   // ガイド線⑤（中心）
  const Y0 = BODY_Y + 0.55;                                 // スライドタイトルの線の下から本体を始める位置
  const shape = (s, type, x, y, w, h, o) => s.addShape(pres.shapes[type], Object.assign({ x, y, w, h }, o));
  const fill = (s, x, y, w, h, color) => shape(s, 'RECTANGLE', x, y, w, h, { fill: { color }, line: { type: 'none' } });
  const frameBox = (s, x, y, w, h, color, width) => shape(s, 'RECTANGLE', x, y, w, h, { fill: { type: 'none' }, line: { color: color || G2, width: width || 0.75 } });
  const num = (o) => Object.assign({ fontFace: 'Arial' }, o);
  const XB = [['XX', 0], ['XX', 1]];
  // 箇条書き：第1階層「•」、第2階層「–」を段落の書式で付ける（H-6）。見出しの「■」は level -1
  const ml = (s, items, o) => s.addText(items.map(([t, lv]) => ({
    text: t, options: { bullet: { code: lv < 0 ? '25A0' : lv === 0 ? '2022' : '2013', indent: 12 }, indentLevel: Math.max(lv, 0), paraSpaceAfter: 2, bold: lv < 0 },
  })), Object.assign({ isTextBox: true, fontFace: F, fontSize: 14, color: BLACK, margin: 0, valign: 'top' }, o));
  const badge = (s, x, y, n, d, color) => { shape(s, 'OVAL', x, y, d || 0.3, d || 0.3, { fill: { color: color || NAVY }, line: { type: 'none' } }); txt(s, String(n), num({ x, y, w: d || 0.3, h: d || 0.3, fontSize: 12, bold: true, color: WHITE, align: 'center', valign: 'middle' })); };
  const arrowMark = (s, x, y, d) => hgCircle(pres, s, x, y, d, { tone: 'accent' });
  // 列見出しの矢印の線（工程の順番を示す「──>」）
  const arrowHead = (s, x, y, w, t) => {
    txt(s, t, { x, y: y - 0.36, w: w - 0.15, h: 0.32, align: 'center', bold: true, valign: 'bottom' });
    line(s, x, y, w - 0.02, 0, G2, 1);
    shape(s, 'LINE', x + w - 0.14, y - 0.1, 0.12, 0.1, { line: { color: G2, width: 1 } });
    shape(s, 'LINE', x + w - 0.14, y, 0.12, 0.1, { flipV: true, line: { color: G2, width: 1 } });
  };
  // 下向きの工程（四角＋下の三角）
  const downStep = (s, x, y, w, h, t, color) => {
    fill(s, x, y, w, h - 0.14, color);
    shape(s, 'ISOSCELES_TRIANGLE', x, y + h - 0.15, w, 0.15, { rotate: 180, fill: { color }, line: { type: 'none' } });
    txt(s, t, { x, y, w, h: h - 0.1, align: 'center', valign: 'middle', bold: true });
  };
  const SRC = '注）テンプレート。XXを中身に差し替え、使わない行・列は消す（ガイド線②〜④からはみ出さない）\n出所）自作の書式（HG_pptFMT）を基に作成';
  const T = (id, kind, msg, notes, title = 'XX') => frame(id, 'テンプレート集　' + kind, msg, title, null, `テンプレートID：${id}\n${notes}`, { sticker: 'テンプレート', rawNotes: true, source: SRC });

  // =====================================================================
  // S05 パーツ集①：文字・箱・矢印
  // =====================================================================
  {
    const s = frame('S05', '記号集', '箱は淡い塗りと上線の2種類を基本にし、濃い塗りは1枚に1か所だけ使う。矢印は強調する1つだけを紺、他はグレーで描く', 'パーツ集（文字・箱・矢印）', null,
      'パーツ集①（自作の書式 HG_pptFMT のパーツ集を指定色で描き直したもの）。関連する型：P11、P22、P23、T13、T17。\n元の書式の赤・オレンジの箱は、指定色（rules B-3）に無いため入れていない。悪化・未達の強調は反対色の文字（#D73232）で示す。',
      { sticker: '記号集', rawNotes: true, source: '注）色は rules/slide-rules.md B-3 の指定色。図形はこのスライドからコピーして使う\n出所）自作の書式（HG_pptFMT）のパーツ集を基に作成' });
    head(s, L, Y0, 4.2, '文字の階層');
    ml(s, [['見出し（14pt太字）', -1], ['第1階層（14pt）', 0], ['第2階層（14pt）', 1]], { x: L, y: Y0 + 0.5, w: 4.2, h: 0.85 });
    head(s, L, Y0 + 1.45, 4.2, '箱の4種類（左：紺、右：グレー）');
    const kinds = [['濃い塗り', 'dark'], ['淡い塗り', 'light'], ['上線だけ', 'top'], ['枠線だけ', 'frame']];
    kinds.forEach(([k, kind], i) => {
      const y = Y0 + 1.98 + i * 0.58;
      txt(s, k, { x: L, y, w: 1.2, h: 0.48, valign: 'middle' });
      [[NAVY, BLUE5], [G2, G3]].forEach(([dark, light], j) => {
        const x = L + 1.3 + j * 1.35, w = 1.2, h = 0.46;
        if (kind === 'dark') fill(s, x, y, w, h, dark);
        if (kind === 'light') fill(s, x, y, w, h, light);
        if (kind === 'top') line(s, x, y, w, 0, dark, 2);
        if (kind === 'frame') frameBox(s, x, y, w, h, dark, 1);
        txt(s, 'XX', { x: x + 0.1, y, w: w - 0.2, h, valign: 'middle', bold: true, color: kind === 'dark' ? WHITE : BLACK });
      });
    });
    line(s, L + 4.05, Y0 + 2.56, 0, 1.04, NAVY, 1.5);
    txt(s, '補足：基本はこの2つ', { x: L + 4.1, y: Y0 + 2.5, w: 0.3, h: 1.6, fontSize: 11, color: NAVY, vert: 'eaVert' });
    const rx = L + 4.9, rw = R - rx;
    head(s, rx, Y0, 3.25, '矢印（右2列は下向き）');
    // HG_pptFMT のパーツ集と同じ4×4（左2列：右向き、右2列：下向き）。図形は scripts/hg_arrows.js
    const gs = 0.62, gx = rx + 0.05, gy = Y0 + 0.55, sz = 0.34;
    const grid = [[['double', 'r', 'accent'], ['triStroke', 'r', 'accent'], ['double', 'd', 'accent'], ['triStroke', 'd', 'accent']],
      [['double', 'r', 'gray'], ['triStroke', 'r', 'gray'], ['double', 'd', 'gray'], ['triStroke', 'd', 'gray']],
      [['circle', 'r', 'gray'], ['circle', 'r', 'accent']],
      [['line', 'r', 'gray'], ['lineDouble', 'r', 'accent']]];
    grid.forEach((row, i) => row.forEach(([k, dir, tone], j) => hgArrow(pres, s, k, gx + j * gs + (dir === 'd' ? 0.02 : 0.08), gy + i * gs + (dir === 'd' ? 0.08 : 0.02), sz, { dir, tone })));
    ['二重の矢羽', '三角＋線', '丸', '線'].forEach((n, i) => txt(s, n, { x: gx + 4 * gs, y: gy + i * gs, w: 0.8, h: sz + 0.04, fontSize: 11, valign: 'middle', color: G1 }));
    const cx = rx + 3.4, cw = R - cx;
    [0, 1].forEach(i => {
      const y = Y0 + 0.75 + i * 1.15;
      fill(s, cx + 0.35, y, cw - 0.35, 0.75, G5);
      txt(s, [{ text: '補足：確認事項・ポイント等', options: { breakLine: true } }, { text: 'XX' }], { x: cx + 0.45, y: y + 0.08, w: cw - 0.5, h: 0.6, fontSize: 11 });
      line(s, cx, y - 0.25, 0.35, 0.3, G2, 0.75);
    });
    txt(s, '補足：図の該当箇所から細線を引く（1枚に2つまで）', { x: cx, y: Y0 + 2.75, w: cw, h: 0.6, fontSize: 11, color: G1 });
    head(s, rx, Y0 + 3.4, rw, '使い分け');
    ml(s, [['紺の濃い塗り（白文字）は、立てたい1点に1か所だけ', 0], ['比べる相手・区分の箱は淡い塗りか上線にする', 0], ['塗りと枠線は重ねない（rules H-3）', 0]], { x: rx, y: Y0 + 3.9, w: rw, h: 0.85 });
  }

  // =====================================================================
  // S06 パーツ集②：番号・演算子・状態の印
  // =====================================================================
  {
    const s = frame('S06', '記号集', '番号・演算子・状態の印は文字を打たずに図形で作り、紺を基本、比べる相手はグレーにする。1枚で使う形は1種類にそろえる', 'パーツ集（番号・演算子・状態の印）', null,
      'パーツ集②。関連する型：P10、P29、P51、P57、T04、T09、T15。\n丸数字（①）の文字は環境で崩れるため使わず、このスライドの図形をコピーする。',
      { sticker: '記号集', rawNotes: true, source: '注）図形はこのスライドからコピーして使う。数字は Arial の白抜き\n出所）自作の書式（HG_pptFMT）のパーツ集を基に作成' });
    const colW = (W - 0.6) / 3;
    const cols = [L, L + colW + 0.3, L + 2 * (colW + 0.3)];
    head(s, cols[0], Y0, colW, '番号（左：紺、右：グレー）');
    ['四角', 'ひし形', '丸'].forEach((k, j) => {
      const x = cols[0] + j * 1.05;
      txt(s, k, { x, y: Y0 + 0.5, w: 0.9, h: 0.3, align: 'center' });
      [1, 2, 3, 4].forEach((n, i) => {
        const y = Y0 + 0.9 + i * 0.48;
        [NAVY, G2].forEach((c, m) => {
          const bx = x + 0.1 + m * 0.42;
          const type = j === 0 ? 'RECTANGLE' : j === 1 ? 'DIAMOND' : 'OVAL';
          shape(s, type, bx, y, 0.32, 0.32, { fill: { color: c }, line: { type: 'none' } });
          txt(s, String(n), num({ x: bx, y, w: 0.32, h: 0.32, fontSize: 12, bold: true, color: WHITE, align: 'center', valign: 'middle' }));
        });
      });
    });
    head(s, cols[1], Y0, colW, '演算子（計算式・T15）');
    [['＋', '足す'], ['−', '引く'], ['×', '掛ける'], ['÷', '割る'], ['＝', '等しい'], ['≒', 'ほぼ等しい']].forEach(([g, n], i) => {
      const x = cols[1] + (i % 2) * (colW / 2), y = Y0 + 0.6 + Math.floor(i / 2) * 0.62;
      shape(s, 'OVAL', x, y, 0.36, 0.36, { fill: { color: NAVY }, line: { type: 'none' } });
      txt(s, g, { x, y, w: 0.36, h: 0.36, fontSize: 14, bold: true, color: WHITE, align: 'center', valign: 'middle' });
      txt(s, n, { x: x + 0.45, y, w: colW / 2 - 0.5, h: 0.36, valign: 'middle' });
    });
    head(s, cols[2], Y0, colW, '状態の印');
    [['✓', '完了・該当'], ['↑', '増える・上がる'], ['↓', '減る・下がる'], ['？', '未確認・論点'], ['→', '次へ・移行']].forEach(([g, n], i) => {
      const y = Y0 + 0.55 + i * 0.46;
      shape(s, 'OVAL', cols[2], y, 0.34, 0.34, { fill: { color: NAVY }, line: { type: 'none' } });
      txt(s, g, { x: cols[2], y, w: 0.34, h: 0.34, fontSize: 13, bold: true, color: WHITE, align: 'center', valign: 'middle' });
      txt(s, n, { x: cols[2] + 0.45, y, w: colW - 0.5, h: 0.34, valign: 'middle' });
    });
    icon(s, 'refresh-cw', cols[2], Y0 + 2.88, 0.34, G2);
    txt(s, '循環（P45）', { x: cols[2] + 0.45, y: Y0 + 2.88, w: colW - 0.5, h: 0.36, valign: 'middle' });
    head(s, L, Y0 + 3.25, W, '使い分け');
    ml(s, [['番号は後のページで参照するときだけ振る。並列の項目には振らない', 0], ['番号の形（四角・ひし形・丸）は1つの資料で1種類にそろえ、強調する番号だけ紺にする', 0], ['状態の印は凡例で意味を書き、信号機の3色（赤・黄・緑）にしない', 0]], { x: L, y: Y0 + 3.72, w: W, h: 0.85 });
  }

  // =====================================================================
  // テンプレート集
  // =====================================================================

  // ---------- T01 目次 ----------
  {
    const s = T('T01', '目次', '目次は番号と章名を縦の線とともに1列に並べ、右に各章で答える問いを添える。章扉では該当する章だけを紺・太字にする',
      '使う場面：目次、章扉（該当章だけ紺・太字）。対応する型：P02、P34。\n本文が10枚以下なら目次・章扉は置かない（rules B-5）。', null);
    [1, 2, 3, 4].forEach((n, i) => {
      const y = BODY_Y + 0.1 + i * 1.15;
      line(s, L + 0.6, y, 0, 0.8, G2, 1.5);
      txt(s, n + '.', num({ x: L + 0.85, y, w: 0.5, h: 0.8, valign: 'middle', fontSize: 16 }));
      txt(s, 'XX', { x: L + 1.4, y, w: 4.0, h: 0.8, valign: 'middle', fontSize: 16 });
      ml(s, [['XX', 1]], { x: L + 5.6, y: y + 0.24, w: R - L - 5.6, h: 0.4 });
    });
  }

  // ---------- T02 報告書の構成 ----------
  {
    const s = T('T02', '構成', '報告書の構成は章番号と章名を淡い帯で示し、右に各章の要点を1行で添える。帯の色は全章で同じにし、強調には使わない',
      '使う場面：報告書・提案書の冒頭の構成。対応する型：P34（全体マップ）。\n章が8つを超えるなら、章を束ね直す。', null);
    [1, 2, 3, 4, 5, 6, 7].forEach((n, i) => {
      const y = BODY_Y + 0.05 + i * 0.68;
      fill(s, L, y, 0.05, 0.52, NAVY);
      fill(s, L + 0.12, y, 5.6, 0.52, G5);
      txt(s, n + '.', num({ x: L + 0.25, y, w: 0.5, h: 0.52, valign: 'middle', fontSize: 16 }));
      txt(s, 'XX', { x: L + 0.8, y, w: 4.8, h: 0.52, valign: 'middle', fontSize: 16 });
      ml(s, [['XX', 1]], { x: L + 6.0, y: y + 0.1, w: R - L - 6.0, h: 0.4 });
    });
  }

  // ---------- T03 背景と目的 ----------
  {
    const s = T('T03', '背景と目的', '背景と目的は左右に並べ、左の背景から右の目的が導かれることを中央の矢印で示す。目的は検討で答える1〜2点に絞って書く',
      '使う場面：検討の冒頭で背景と目的を示す。対応する型：P21（前提→帰結）。\n左右の見出しの線の高さをそろえる（rules H-10）。', null);
    const cw = W / 2 - 0.35;
    [['search', '背景', L], ['target', '目的', MID + 0.35]].forEach(([ic, t, x]) => {
      icon(s, ic, x, BODY_Y + 0.02, 0.32, G2);
      head(s, x, BODY_Y, cw, '　　' + t);
      ml(s, [['XX', 0], ['XX', 1], ['XX', 1], ['XX', 0], ['XX', 1]], { x, y: BODY_Y + 0.6, w: cw, h: 2.5 });
    });
    line(s, MID, BODY_Y + 0.6, 0, 4.4, G2, 1);
    arrowMark(s, MID - 0.15, BODY_Y + 2.6, 0.3);
  }

  // ---------- T04 本日のゴール・アジェンダ ----------
  {
    const s = T('T04', 'ゴール・アジェンダ', '会議資料の冒頭では本日のゴールを先に示し、その下に議題を番号付きで並べる。各議題には、その場で決めることを1行添える',
      '使う場面：会議資料の冒頭。対応する型：P56（時間配分付きアジェンダ）。\nゴールは「何が決まれば終わりか」を書く。', null);
    const boxH1 = 1.3, y2 = BODY_Y + boxH1 + 0.55;
    frameBox(s, L, BODY_Y, W, boxH1, G2);
    icon(s, 'target', L + 0.15, BODY_Y + 0.12, 0.32, NAVY);
    txt(s, '本日のゴール', { x: L + 0.55, y: BODY_Y + 0.12, w: 2.0, h: 0.32, bold: true, valign: 'middle' });
    ml(s, [['XX', 0], ['XX', 0]], { x: L + 0.55, y: BODY_Y + 0.55, w: W - 0.8, h: 0.7 });
    hgArrow(pres, s, 'double', MID - 0.19, BODY_Y + boxH1 + 0.06, 0.38, { dir: 'd', tone: 'accent' });
    frameBox(s, L, y2, W, 6.65 - y2, G2);
    icon(s, 'file-text', L + 0.15, y2 + 0.12, 0.32, NAVY);
    txt(s, '本日のアジェンダ', { x: L + 0.55, y: y2 + 0.12, w: 2.4, h: 0.32, bold: true, valign: 'middle' });
    [1, 2, 3].forEach((n, i) => {
      const y = y2 + 0.62 + i * 0.9;
      badge(s, L + 0.55, y, n);
      txt(s, 'XX', { x: L + 0.95, y, w: 4, h: 0.3, bold: true, valign: 'middle' });
      txt(s, '✓　XX', { x: L + 1.15, y: y + 0.38, w: W - 1.5, h: 0.3, valign: 'middle' });
    });
  }

  // 表の共通部品：表頭（列見出し）と行
  const table = (s, o) => {
    const { top = Y0, cols, rows = 5, rh = 0.82, labelW = 1.5, labelFill = false, group = null } = o;
    const cw = (W - labelW) / cols, hy = top + (group ? 0.42 : 0);
    if (group) { txt(s, 'XX', { x: L + labelW + cw * group[0], y: top, w: cw * (group[1] - group[0] + 1), h: 0.32, bold: true, align: 'center' }); line(s, L + labelW + cw * group[0] + 0.1, top + 0.36, cw * (group[1] - group[0] + 1) - 0.2, 0, G2, 0.75); }
    txt(s, '項目', { x: L + 0.1, y: hy, w: labelW - 0.1, h: 0.32, bold: true });
    for (let j = 0; j < cols; j++) txt(s, 'XX', { x: L + labelW + j * cw + 0.1, y: hy, w: cw - 0.2, h: 0.32, bold: true });
    line(s, L, hy + 0.38, W, 0, G2, 1);
    if (labelFill) fill(s, L, hy + 0.42, labelW - 0.08, rows * rh - 0.04, G3);
    for (let i = 0; i < rows; i++) {
      const y = hy + 0.45 + i * rh;
      txt(s, 'XX', { x: L + 0.1, y, w: labelW - 0.2, h: rh - 0.1, valign: 'middle', align: labelFill ? 'center' : 'left' });
      for (let j = 0; j < cols; j++) ml(s, XB, { x: L + labelW + j * cw + 0.1, y: y + 0.06, w: cw - 0.2, h: rh - 0.12 });
      if (i < rows - 1) rowRule(s, L + (labelFill ? labelW : 0), y + rh - 0.04, W - (labelFill ? labelW : 0));
    }
  };

  // ---------- T05 表（基本の型） ----------
  { const s = T('T05', '表', '表の基本形は表頭の下に線を1本引き、行の間を細い線で区切る。表頭・表側には色を使わず、目立たせたい所だけ着色する',
      '使う場面：比較・一覧の表の基本。対応する型：P16、P36、P50。\n行＝項目、列＝観点。最終行の下には線を引かない（rules H-5）。'); table(s, { cols: 4 }); }

  // ---------- T06 表（表側に塗り） ----------
  { const s = T('T06', '表', '表側（左端の列）で行の区分を立てたいときだけ、表側をグレーで塗る。塗るのは表側の1列だけにし、表頭と中のマスは塗らない',
      '使う場面：行の区分名を立てたい表。対応する型：P31、P55。\n表側の塗りはGray1（#CCCCCC）。表頭は塗らない。'); table(s, { cols: 4, labelFill: true }); }

  // ---------- T07 表（2段の表頭） ----------
  { const s = T('T07', '表', '表頭が2段になるときは、上の段の見出しを下の段の列にまたがせ、その下に細い線を引いて束ねる範囲を示す。線は束ねる列の幅だけにする',
      '使う場面：列を束ねる見出しがある表（年度×区分など）。対応する型：P44。\n上の段の線は、束ねる列の幅だけに引く。'); table(s, { cols: 4, group: [2, 3], rh: 0.78 }); }

  // ---------- T08 表（大分類＋入力枠＋説明） ----------
  {
    const s = T('T08', '表', '大分類をグレーの塊で左に置き、中段に項目名の枠、右に説明を並べる。枠は項目名の入力欄として使い、強調には使わない',
      '使う場面：大分類×項目の一覧（制度・施策の棚卸し）。対応する型：P76（入れ子行の行列）。\n枠線の箱は項目名の欄だけ（rules H-1 の例外：依頼者の書式）。');
    const c1 = 2.0, c2 = 2.3, x2 = L + c1 + 0.15, x3 = x2 + c2 + 0.25, rh = 0.68;
    [[L, c1], [x2, c2], [x3, R - x3]].forEach(([x, w]) => head(s, x, Y0, w, 'XX'));
    [0, 1].forEach(g => {
      const gy = Y0 + 0.55 + g * 3 * rh;
      fill(s, L, gy, c1, 3 * rh - 0.08, G3);
      txt(s, 'XX', { x: L + 0.1, y: gy + 0.05, w: c1 - 0.2, h: 0.3, bold: true });
      [0, 1, 2].forEach(i => {
        const y = gy + i * rh;
        frameBox(s, x2, y + 0.05, c2, rh - 0.15, G2);
        txt(s, 'XX', { x: x2 + 0.1, y: y + 0.05, w: c2 - 0.2, h: rh - 0.15, valign: 'middle' });
        ml(s, [['XX', 0]], { x: x3, y: y + 0.12, w: R - x3, h: rh - 0.2 });
        if (!(g === 1 && i === 2)) rowRule(s, x3, y + rh - 0.04, R - x3);
      });
    });
  }

  // ---------- T09 表（括弧でまとめた番号付きの行） ----------
  {
    const s = T('T09', '表', 'グループに分けた項目に番号を振るときは、左に区分名と括弧の線を置き、番号付きの行を並べる。番号は後で参照するときだけ振る',
      '使う場面：番号で他のページから参照する項目の一覧。対応する型：P58、P72。\n番号の図形は S06 からコピーする。');
    const gx = L, gw = 0.9, bx = L + gw + 0.25, c2 = 1.9, x3 = bx + c2 + 0.15, c3 = 2.1, x4 = x3 + c3 + 0.25, rh = 0.68;
    [[bx, c2], [x3, c3], [x4, R - x4]].forEach(([x, w]) => head(s, x, Y0, w, 'XX'));
    [0, 1].forEach(g => {
      const gy = Y0 + 0.55 + g * 3 * rh;
      txt(s, 'XX', { x: gx, y: gy, w: gw, h: 3 * rh - 0.1, valign: 'middle', align: 'center' });
      line(s, bx - 0.12, gy + 0.05, 0, 3 * rh - 0.18, G2, 1.25);
      [0, 1, 2].forEach(i => {
        const y = gy + i * rh, n = g * 3 + i + 1;
        fill(s, bx, y + 0.05, c2, rh - 0.15, G3);
        badge(s, bx + 0.08, y + 0.05 + (rh - 0.15 - 0.26) / 2, n, 0.26);
        txt(s, 'XX', { x: bx + 0.42, y: y + 0.05, w: c2 - 0.5, h: rh - 0.15, valign: 'middle' });
        frameBox(s, x3, y + 0.05, c3, rh - 0.15, G2);
        txt(s, 'XX', { x: x3 + 0.1, y: y + 0.05, w: c3 - 0.2, h: rh - 0.15, valign: 'middle' });
        ml(s, [['XX', 0]], { x: x4, y: y + 0.12, w: R - x4, h: rh - 0.2 });
        if (n < 6) rowRule(s, x4, y + rh - 0.04, R - x4);
      });
    });
  }

  // ---------- T10 数値表 ----------
  {
    const s = T('T10', '表（数値）', '数値の表は半角数字・3桁区切りで右にそろえ、線は行の間だけに引く。強調したい数値だけを紺にし、文字を一段大きくする',
      '使う場面：数値の一覧。対応する型：P37、P55。\n単位は見出しの括弧書きにまとめ、セルに単位を繰り返さない。西暦・年度には3桁区切りを付けない。');
    const lw = 1.3, cols = 8, cw = (W - lw) / cols, rh = 0.78;
    txt(s, '項目', { x: L, y: Y0, w: lw, h: 0.32, bold: true });
    for (let j = 0; j < cols; j++) txt(s, 'XX', { x: L + lw + j * cw, y: Y0, w: cw - 0.1, h: 0.32, bold: true, align: 'right' });
    line(s, L, Y0 + 0.38, W, 0, G2, 1);
    for (let i = 0; i < 5; i++) {
      const y = Y0 + 0.45 + i * rh;
      txt(s, 'XX', { x: L, y, w: lw, h: rh - 0.1, valign: 'middle' });
      for (let j = 0; j < cols; j++) {
        const key = i === 2 && j === 3;
        txt(s, '00,000', num({ x: L + lw + j * cw, y, w: cw - 0.1, h: rh - 0.1, valign: 'middle', align: 'right', fontSize: key ? 18 : 14, bold: key, color: key ? NAVY : BLACK }));
      }
      if (i < 4) rowRule(s, L, y + rh - 0.04, W);
    }
  }

  // ---------- T11 工程×観点（矢印の線の列見出し） ----------
  {
    const s = T('T11', '工程×観点', '工程を列、観点を行に置く表では、列見出しを矢印の線で左から右へつなぎ、工程の順番を示す。各マスは2〜3行に収める',
      '使う場面：工程（段階）ごとに観点別の中身を書く。対応する型：P13、P24、P43。\n強調する工程があれば、その列の見出しの文字だけ紺にする。');
    const lw = 1.3, cols = 3, cw = (W - lw) / cols, rh = 1.25, hy = Y0 + 0.38;
    for (let j = 0; j < cols; j++) arrowHead(s, L + lw + j * cw + 0.05, hy, cw - 0.1, 'XX');
    for (let i = 0; i < 3; i++) {
      const y = hy + 0.15 + i * rh;
      txt(s, 'XXX', { x: L, y, w: lw - 0.2, h: rh - 0.1, valign: 'middle', align: 'center' });
      line(s, L + lw - 0.12, y + 0.05, 0, rh - 0.15, G2, 1);
      line(s, L, y + rh - 0.1, lw - 0.12, 0, G2, 1);
      for (let j = 0; j < cols; j++) ml(s, [['XX', 0], ['XX', 1], ['XX', 1]], { x: L + lw + j * cw + 0.1, y: y + 0.1, w: cw - 0.2, h: rh - 0.2 });
      if (i < 2) rowRule(s, L + lw, y + rh - 0.05, W - lw);
    }
  }

  // ---------- T12 工程×観点（大分類の括弧＋塗りの行） ----------
  {
    const s = T('T12', '工程×観点', '行を大分類で束ねるときは、左に区分名と縦の線を置き、行の名前をグレーの塊で示す。列見出しは工程の矢印の線にする',
      '使う場面：大分類×小分類×工程の3段の整理。対応する型：P43、P76。');
    const gw = 0.9, lx = L + gw + 0.2, lw = 1.2, x0 = lx + lw + 0.1, cols = 3, cw = (R - x0) / cols, rh = 0.66, hy = Y0 + 0.38;
    for (let j = 0; j < cols; j++) arrowHead(s, x0 + j * cw + 0.05, hy, cw - 0.1, 'XX');
    [0, 1].forEach(g => {
      const gy = hy + 0.15 + g * 3 * rh;
      txt(s, 'XX', { x: L, y: gy, w: gw, h: 3 * rh - 0.1, valign: 'middle', align: 'center' });
      line(s, lx - 0.1, gy + 0.05, 0, 3 * rh - 0.15, G2, 1.25);
      [0, 1, 2].forEach(i => {
        const y = gy + i * rh;
        fill(s, lx, y + 0.04, lw, rh - 0.1, G3);
        txt(s, 'XX', { x: lx, y: y + 0.04, w: lw, h: rh - 0.1, valign: 'middle', align: 'center' });
        for (let j = 0; j < cols; j++) ml(s, XB, { x: x0 + j * cw + 0.1, y: y + 0.04, w: cw - 0.2, h: rh - 0.1 });
        if (!(g === 1 && i === 2)) rowRule(s, x0, y + rh - 0.02, R - x0);
      });
    });
  }

  // ---------- T13 縦の工程フロー ----------
  {
    const s = T('T13', 'フローチャート', '縦の工程フローでは左に工程を上から下へ並べ、右に各工程の中身を書く。強調したい工程だけを淡い紺で塗り、他はグレーにする',
      '使う場面：工程・手順と、その中身・説明。対応する型：P24（横の矢羽）、P51。\n強調しないときは全工程をグレーにする。');
    const sw = 1.6, rh = 1.12, tx = L + sw + 0.3;
    [0, 1, 2, 3].forEach(i => {
      const y = Y0 + i * rh, key = i === 2;
      downStep(s, L, y, sw, rh - 0.12, 'XX', key ? BLUE5 : G3);
      ml(s, [['XX', 0], ['XX', 1], ['XX', 1]], { x: tx, y: y + 0.05, w: R - tx, h: rh - 0.2, color: key ? NAVY : BLACK, bold: key });
      if (i < 3) rowRule(s, tx, y + rh - 0.07, R - tx);
    });
  }

  // ---------- T14 縦の工程フロー＋説明2列 ----------
  {
    const s = T('T14', 'フローチャート', '工程ごとに観点が2つあるときは、右側を2列に分けて列の上に見出しと線を置く。強調する工程の行だけ文字を紺・太字にする',
      '使う場面：工程×2観点（課題と打ち手、現状と目指す姿など）。対応する型：P43、P66。');
    const sw = 1.6, tx = L + sw + 0.3, cw = (R - tx - 0.3) / 2, rh = 1.0, y0 = Y0 + 0.5;
    head(s, tx, Y0, cw, 'XX'); head(s, tx + cw + 0.3, Y0, cw, 'XX');
    [0, 1, 2, 3].forEach(i => {
      const y = y0 + i * rh, key = i === 2;
      downStep(s, L, y, sw, rh - 0.1, 'XX', key ? BLUE5 : G3);
      [0, 1].forEach(j => ml(s, [['XX', 0], ['XX', 1]], { x: tx + j * (cw + 0.3), y: y + 0.05, w: cw, h: rh - 0.2, color: key ? NAVY : BLACK, bold: key }));
      if (i < 3) [0, 1].forEach(j => rowRule(s, tx + j * (cw + 0.3), y + rh - 0.06, cw));
    });
  }

  // ---------- T15 計算式 ----------
  {
    const s = T('T15', '計算式', '計算式は上段に項と演算子を並べ、下段に各項の定義と出所を書く。算定値の箱だけを淡い紺にし、項の箱は同じ色にそろえる',
      '使う場面：試算の算式を示す。対応する型：P29（計算ロジック）。\n各項の値は検算表と一致させる（rules D-4）。演算子は S06 からコピーする。');
    const lw = 1.2, x0 = L + lw + 0.15, bw = 1.85, ow = (R - x0 - 4 * bw) / 3, by = Y0, bh = 0.75;
    txt(s, '算定式', { x: L, y: by, w: lw - 0.1, h: bh, valign: 'middle', bold: true });
    txt(s, '各項の説明', { x: L, y: by + 1.6, w: lw - 0.1, h: 0.4, bold: true });
    line(s, L + lw, by - 0.05, 0, 4.85, G2, 1);
    const ops = ['×', '×', '＝'];
    [0, 1, 2, 3].forEach(j => {
      const x = x0 + j * (bw + ow), key = j === 3;
      fill(s, x, by, bw, bh, key ? BLUE5 : G5);
      if (j === 2) { txt(s, '項3', { x, y: by + 0.02, w: bw, h: 0.33, align: 'center' }); line(s, x + 0.25, by + bh / 2, bw - 0.5, 0, BLACK, 0.75); txt(s, '項4', { x, y: by + 0.4, w: bw, h: 0.33, align: 'center' }); }
      else txt(s, key ? '算定値' : '項' + (j + 1), { x, y: by, w: bw, h: bh, align: 'center', valign: 'middle', bold: key, color: key ? NAVY : BLACK });
      if (j < 3) { const ox = x + bw + ow / 2 - 0.16; shape(s, 'OVAL', ox, by + bh / 2 - 0.16, 0.32, 0.32, { fill: { color: NAVY }, line: { type: 'none' } }); txt(s, ops[j], { x: ox, y: by + bh / 2 - 0.16, w: 0.32, h: 0.32, bold: true, color: WHITE, align: 'center', valign: 'middle' }); }
      ml(s, [['XX', 0], ['XX', 1], ['出所：XX', 1]], { x, y: by + 1.6, w: bw, h: 2.2 });
    });
    rowRule(s, x0, by + 1.35, R - x0);
  }

  // ---------- T16 ツリー ----------
  {
    const s = T('T16', 'ツリー', 'ツリーは左から右へ分解し、同じ階層の箱を同じ大きさにそろえる。親から子への線は親の右端から出し、交差させずに直角で結ぶ',
      '使う場面：論点・要因の分解。対応する型：P14（ロジックツリー）、P35（イシューツリー）。\n分解は抜け漏れ・重複なく、3階層まで（rules C-3）。');
    const c1 = 1.7, c2x = L + c1 + 0.45, c2 = 3.0, c3x = c2x + c2 + 0.45, c3 = R - c3x;
    [[L, c1], [c2x, c2], [c3x, c3]].forEach(([x, w]) => head(s, x, Y0, w, 'XX'));
    const top = Y0 + 0.55, bot = 6.6;
    fill(s, L, top, c1, bot - top, G5);
    ml(s, XB, { x: L + 0.1, y: top + 0.1, w: c1 - 0.2, h: 0.8 });
    const mids = [[top, 1.55, 3], [top + 1.75, 1.0, 2], [top + 2.95, bot - top - 2.95, 2]];
    let k = 0;
    mids.forEach(([y, h, kids]) => {
      frameBox(s, c2x, y, c2, h, G2);
      ml(s, XB, { x: c2x + 0.1, y: y + 0.08, w: c2 - 0.2, h: 0.7 });
      line(s, c2x - 0.25, y + h / 2, 0.25, 0, G2, 0.75);
      const kh = (h - 0.1 * (kids - 1)) / kids, ys = [];
      for (let i = 0; i < kids; i++) {
        const ky = y + i * (kh + 0.1); ys.push(ky + kh / 2);
        frameBox(s, c3x, ky, c3, kh, G2); txt(s, 'XX', { x: c3x + 0.1, y: ky, w: c3 - 0.2, h: kh, valign: 'middle' }); k++;
        line(s, c3x - 0.2, ky + kh / 2, 0.2, 0, G2, 0.75);
      }
      line(s, c2x + c2, y + h / 2, 0.25, 0, G2, 0.75);
      line(s, c3x - 0.2, ys[0], 0, ys[ys.length - 1] - ys[0], G2, 0.75);
    });
    line(s, L + c1, (top + bot) / 2, 0.2, 0, G2, 0.75);
    line(s, c2x - 0.25, top + 0.775, 0, (top + 2.95 + (bot - top - 2.95) / 2) - (top + 0.775), G2, 0.75);
  }

  // ---------- T17 課題・打手の整理 ----------
  {
    const s = T('T17', '課題・打手', '課題と打手を整理するときは、左に課題をグレーの塊で置き、矢羽で右の打手の2列に結ぶ。1つの課題に打手を1行で対応させる',
      '使う場面：課題ごとの打手、事象ごとの対応。対応する型：P23（課題と打ち手の対応）、P77。\n打手の左列に打手の名前、右列に中身を書く。');
    const c1 = 2.0, ax = L + c1 + 0.08, c2x = L + c1 + 0.5, c2 = 2.0, c3x = c2x + c2 + 0.2, rh = 1.35;
    head(s, L, Y0, c1, '課題'); head(s, c2x, Y0, R - c2x, '打手');
    [1, 2, 3].forEach((n, i) => {
      const y = Y0 + 0.55 + i * rh;
      fill(s, L, y, c1, rh - 0.15, G3);
      ml(s, [['課題／事象' + n, -1], ['XX', 0], ['XX', 1]], { x: L + 0.1, y: y + 0.08, w: c1 - 0.2, h: rh - 0.3 });
      hgArrow(pres, s, 'triStroke', ax, y + rh / 2 - 0.2, 0.32, { tone: 'accent' });
      txt(s, 'XX', { x: c2x, y: y + 0.05, w: c2 - 0.15, h: 0.35, bold: true });
      line(s, c2x + c2, y, 0, rh - 0.15, G2, 0.75);
      ml(s, [['XX', -1], ['XX', 0], ['XX', 1]], { x: c3x, y: y + 0.05, w: R - c3x, h: rh - 0.25 });
      if (i < 2) rowRule(s, c2x, y + rh - 0.08, R - c2x);
    });
  }

  // ---------- T18 課題とアクション ----------
  {
    const s = T('T18', '課題とアクション', '課題とアクションのように左右が対になる内容は、中央の縦線で分け、見出しの線の交点に丸を置いて左から右への関係を示す',
      '使う場面：課題と行動、事実と政策など、A→Bの関係。対応する型：P21、P23。');
    head(s, L, Y0, MID - L - 0.15, 'XX'); head(s, MID + 0.15, Y0, R - MID - 0.15, 'XX');
    shape(s, 'OVAL', MID - 0.12, Y0 + 0.26, 0.24, 0.24, { fill: { color: WHITE }, line: { color: G2, width: 1 } });
    line(s, MID, Y0 + 0.5, 0, 6.6 - Y0 - 0.5, G2, 1);
    [L, MID + 0.3].forEach(x => ml(s, [['XX', 0], ['XX', 1], ['XX', 1], ['XX', 0], ['XX', 1], ['XX', 0], ['XX', 1]], { x, y: Y0 + 0.65, w: MID - L - 0.45, h: 3.5 }));
  }

  // ---------- T19 前提と検討事項 ----------
  {
    const s = T('T19', '前提と検討事項', '前提情報と、それを踏まえた検討事項を左右に置き、左の見出しの線を右の欄へ矢印でつなぐ。右の欄は縦の線で左と区切る',
      '使う場面：前提情報と検討事項、事実とそれを踏まえた対応。対応する型：P21（前提→帰結）。');
    const y = Y0 + 0.4;
    txt(s, 'XX', { x: L, y: y - 0.36, w: MID - L, h: 0.32, bold: true, valign: 'bottom' });
    shape(s, 'LINE', L, y, MID - L + 0.15, 0, { line: { color: G2, width: 1, endArrowType: 'triangle' } });
    line(s, MID + 0.05, y - 0.22, R - MID - 0.05, 0, G2, 1);
    line(s, MID + 0.05, y - 0.22, 0, 6.6 - y + 0.22, G2, 1);
    txt(s, 'XX', { x: MID + 0.35, y: y - 0.12, w: R - MID - 0.4, h: 0.32, bold: true });
    ml(s, [['XX', 0], ['XX', 1], ['XX', 1], ['XX', 0], ['XX', 1], ['XX', 0], ['XX', 1]], { x: L, y: y + 0.2, w: MID - L - 0.3, h: 3.5 });
    ml(s, [['XX', 0], ['XX', 1], ['XX', 0], ['XX', 1], ['XX', 0], ['XX', 1]], { x: MID + 0.35, y: y + 0.35, w: R - MID - 0.4, h: 3.5 });
  }

  // ---------- T20 事実と示唆 ----------
  {
    const s = T('T20', '事実と示唆', '事実の図を左に大きく置き、右の帯に示唆を2〜3点書く。帯の左端に矢印を置き、左の事実から示唆を導いたことを示す',
      '使う場面：グラフ・表から示唆を導く。対応する型：P21、P54（図＋右側の示唆帯）。\n帯の中で紺にするのは結論の一文だけ。');
    const pw = 2.7, px = R - pw, gw = px - L - 0.35;
    head(s, L, Y0, gw, 'XX');
    txt(s, '（グラフ・表を置く）', { x: L, y: Y0 + 2.0, w: gw, h: 0.4, align: 'center' });
    line(s, L, 6.55, gw, 0, G3, 0.75);
    fill(s, px, Y0 - 0.1, pw, 6.65 - Y0 + 0.1, G5);
    txt(s, 'XXXX', { x: px + 0.2, y: Y0, w: pw - 0.4, h: 0.32, bold: true });
    ml(s, [['XX', 0], ['XX', 1], ['XX', 1], ['XX', 0], ['XX', 1], ['XX', 1], ['XX', 0], ['XX', 1]], { x: px + 0.25, y: Y0 + 1.1, w: pw - 0.4, h: 3.2 });
    arrowMark(s, px - 0.17, (Y0 + 6.6) / 2 - 0.17, 0.34);
  }

  // ---------- T21 コメント・文書引用 ----------
  {
    const s = T('T21', 'コメント・文書引用', '発言や文書を引用するときは、上に示唆を書き、その根拠となる引用を下の枠に入れる。枠の右下に発言者か出所を必ず書く',
      '使う場面：ヒアリングの発言、文書・法令の引用。対応する型：P53（現場の声）。\n発言者は属性で示し、個人名は出さない（rules D-3）。引用は自分の主張が主、引用が従（著作権法32条）。');
    const cw = (W - 0.4) / 2;
    [L, L + cw + 0.4].forEach(x => {
      head(s, x, Y0, cw, 'XX');
      txt(s, '示唆', { x, y: Y0 + 0.55, w: cw, h: 0.32, bold: true });
      ml(s, [['補足説明', 0]], { x, y: Y0 + 0.92, w: cw, h: 0.35 });
      const qy = Y0 + 1.55, qh = 6.6 - qy;
      fill(s, x, qy, cw, qh, G5);
      txt(s, '“', { x: x + 0.1, y: qy + 0.02, w: 0.5, h: 0.5, fontSize: 28, bold: true, color: G2, fontFace: 'Georgia' });
      ml(s, [['XX', 0], ['XX', 0]], { x: x + 0.45, y: qy + 0.6, w: cw - 0.7, h: 1.2 });
      txt(s, '出所 or 発言者', { x: x + 0.3, y: qy + qh - 0.75, w: cw - 0.85, h: 0.3, align: 'right', fontSize: 11 });
      txt(s, '”', { x: x + cw - 0.55, y: qy + qh - 0.55, w: 0.5, h: 0.5, fontSize: 28, bold: true, color: G2, fontFace: 'Georgia', align: 'right' });
    });
  }
};
