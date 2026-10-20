# slide_builder

コンサル水準のスライドを作るための、自作のルール・型・見本・検査スクリプト集。
Claude のスキル **consulting-slide-builder**（スライド作成）と **slide-reference-library**（参照ライブラリの更新）が、作業のたびにこのリポジトリを読む。

## 構成

| パス | 内容 |
| --- | --- |
| `rules/slide-rules.md` | スライド作成ルールの正典（メッセージライン・見た目・本体・チャート・エビデンス・検算・追加ルール） |
| `rules/review-prompt.md` | 文脈を知らない別のエージェントに渡すレビュー指示文 |
| `patterns/patterns.md` | 型（P01〜P20）の定義。章A〜F、使う場面、紺にする1点、密度の目安、よくある失敗、参考ページID |
| `patterns/pattern-deck.pptx` | 型の見本デッキ（自作、数値は全てダミー） |
| `templates/` | 自作のマスター・テンプレート |
| `scripts/check_deck.py` | 機械チェック（`python3 scripts/check_deck.py deck.pptx`、見本は `--sample`） |
| `scripts/build_pattern_deck.js` | 見本デッキの再生成（`node scripts/build_pattern_deck.js patterns/pattern-deck.pptx`、pptxgenjs が必要） |
| `catalog/catalog.xlsx` | 公開資料の収集候補とページ台帳（書誌情報・URL・学べる点のみ） |
| `CHANGELOG.md` | ルール・型の変更履歴 |

## 入れないもの

- **他社の資料そのもの**（PDF、ページ画像、スクリーンショット）。手元のPCの `参照ライブラリ/sources/`・`pages/` に置き、リポジトリには資料名・URL・ページ番号・学べる点だけを書く。
- **会社・案件の情報**（顧客名、案件資料、社内の数値）。
- 各社のロゴ・社名・ブランド色を写した見本。

## ルールの育て方

レビューで受けた指摘は、直して終わりにせず、同じ指摘が二度と出ないルールに一般化する。

- 機械的に判定できるもの → `scripts/check_deck.py` に検査を追加
- 意味の判断が要るもの → `rules/review-prompt.md` の観点に追加
- それ以外 → `rules/slide-rules.md` の「G. 追加ルール」に1行追加

変更は `CHANGELOG.md` に日付と理由を書く。
