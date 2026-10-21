// アイコン集：templates/icons/*.svg の目録と、見本デッキに置くための関数
// アイコンは Lucide（ISCライセンス、templates/icons/LICENSE）の線画を、グレー・線幅1.5に整えたもの。
// PowerPoint には SVG のまま挿入でき、「グラフィックス形式」で色を変えられる。
const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, '..', 'templates', 'icons');

// [カテゴリ, [[ファイル名, 名前, 使う場面], ...]]
const ICONS = [
  ['人・組織', [
    ['user', '個人', '利用者・担当者など1人'], ['users', '人々', '住民・利用者の集団、チーム'], ['user-check', '担い手', '人材の確保・認定'],
    ['person-standing', '歩行者', '高齢者・徒歩の利用者'], ['baby', '子育て', '子育て世帯・乳幼児'], ['building-2', '企業', '事業者・民間企業'],
    ['landmark', '行政', '国・自治体・公的機関'], ['factory', '工場', '製造業・生産拠点'], ['store', '店舗', '小売・商店'], ['briefcase', '事業', '仕事・ビジネス・案件'],
  ]],
  ['施設・地域', [
    ['hospital', '病院', '医療機関'], ['school', '学校', '教育機関・通学'], ['hotel', '宿泊', '観光・宿泊施設'], ['house', '住まい', '世帯・住宅'],
    ['map-pin', '地点', '拠点・所在地'], ['globe', '海外', '国際・グローバル'], ['mountain', '自然', '山間地・観光資源'], ['tractor', '農業', '農業・一次産業'],
    ['fish', '漁業', '水産業'], ['utensils', '飲食', '飲食店・食'],
  ]],
  ['移動・物流', [
    ['train-front', '鉄道', '鉄道・駅'], ['bus', 'バス', '路線バス・送迎'], ['car', '自動車', '自家用車・タクシー'], ['truck', '物流', 'トラック輸送・配送'],
    ['plane', '航空', '空路・空港'], ['ship', '海運', '船舶・港湾'], ['package', '荷物', '商品・貨物'], ['route', '経路', '路線・移動の道筋'],
    ['shopping-cart', '購買', '買物・消費'], ['accessibility', '移動支援', 'バリアフリー・移動に配慮が要る人'],
  ]],
  ['お金・数字', [
    ['banknote', '資金', '補助金・支払・お金の流れ'], ['wallet', '支払', '利用者の負担・決済'], ['piggy-bank', '積立', '基金・貯蓄'], ['receipt', '請求', '料金・請求・費用'],
    ['chart-column', '統計', '数値データ・実績'], ['chart-line', '推移', '時系列・見通し'], ['trending-up', '増加', '伸び・改善'], ['trending-down', '減少', '落ち込み・悪化'],
    ['scale', '公平', '比較・バランス・規制'], ['gavel', '法令', '法律・制度・判断'],
  ]],
  ['情報・技術', [
    ['database', 'データ', 'データ基盤・蓄積'], ['cloud', 'クラウド', 'クラウドサービス'], ['smartphone', 'スマホ', 'アプリ・モバイル'], ['laptop', 'PC', '業務システム・事務'],
    ['bot', 'AI', 'AI・自動応答'], ['network', '連携基盤', 'システム連携・ネットワーク'], ['file-text', '文書', '報告書・申請書類'], ['search', '調査', '検索・調査・点検'],
    ['lock', '保護', 'セキュリティ・個人情報'], ['mail', '連絡', '通知・メール'],
  ]],
  ['行為・状態', [
    ['handshake', '連携', '協定・提携・合意'], ['messages-square', '対話', '会議・ヒアリング・相談'], ['target', '目標', 'KPI・狙い'], ['lightbulb', '着想', 'アイデア・示唆'],
    ['settings', '仕組み', '制度・運用・設定'], ['clock', '時間', '所要時間・待ち時間'], ['calendar', '日程', '期限・スケジュール'], ['triangle-alert', '注意', 'リスク・警告'],
    ['circle-check', '完了', '達成・確認済み'], ['refresh-cw', '循環', '繰り返し・見直し'],
  ]],
  ['環境・健康', [
    ['leaf', '環境', '環境配慮・脱炭素'], ['recycle', '資源循環', 'リサイクル'], ['zap', '電力', 'エネルギー・電気'], ['sun', '太陽光', '再生可能エネルギー'],
    ['wind', '風力', '風・再生可能エネルギー'], ['droplet', '水', '上下水道・水資源'], ['battery-charging', '蓄電', '充電・蓄電池'], ['sprout', '育成', '成長・新規事業'],
    ['heart-pulse', '健康', '健康・介護'], ['stethoscope', '医療', '診療・医師'],
  ]],
];

// 見本デッキ用：配置を予約し、書き出し前に PNG へ変換してまとめて貼る（sharp が必要）
function iconQueue(pres) {
  const queue = [];
  const icon = (s, name, x, y, size, color) => queue.push({ s, name, x, y, size, color: color || '7F7F7F' });
  const flush = async () => {
    const sharp = require('sharp');
    const cache = {};
    for (const q of queue) {
      const key = q.name + q.color;
      if (!cache[key]) {
        const svg = fs.readFileSync(path.join(DIR, q.name + '.svg'), 'utf8').replace(/stroke="#[0-9A-Fa-f]{6}"/, `stroke="#${q.color}"`);
        cache[key] = (await sharp(Buffer.from(svg), { density: 1200 }).resize(256, 256).png().toBuffer()).toString('base64');
      }
      q.s.addImage({ data: 'image/png;base64,' + cache[key], x: q.x, y: q.y, w: q.size, h: q.size, altText: q.name });
    }
  };
  return { icon, flush };
}

module.exports = { ICONS, iconQueue };
