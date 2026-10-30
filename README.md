# slide_builder

コンサル水準のスライドを作るための、自作のルール・型・見本・検査スクリプト集。
Claude のスキル **consulting-slide-builder**（スライド作成）と **slide-reference-library**（参照ライブラリの更新）が、作業のたびにこのリポジトリを読む。

## 構成

| パス | 内容 |
| --- | --- |
| `rules/slide-rules.md` | スライド作成ルールの正典（メッセージライン・見た目・本体・チャート・エビデンス・検算・追加ルール） |
| `rules/ai-wording.md` | AIらしい言い回しを消すための語彙と仕上げ前の確認（slide-rules.md C-5 から参照） |
| `rules/review-prompt.md` | 文脈を知らない別のエージェントに渡すレビュー指示文 |
| `patterns/patterns.md` | 型（P01〜P80）の定義。章A〜F、使う場面、紺にする1点、密度の目安、よくある失敗、参考ページID、デザインを格上げする作法 |
| `patterns/pattern-deck.pptx` | 見本デッキ137枚：表紙＋型の見本80枚（P01〜P80、架空の値）＋記号集4枚（S01〜S04）＋アイコン集4枚（I01〜I04）＋パーツ集2枚（S05・S06）＋テンプレート集21枚（T01〜T21、骨組み）＋通しの完成例25枚（架空の地方鉄道、数値は整合済み） |
| `patterns/refs.json` | 型ごとの参考ページID（見本デッキのノートに自動で入る） |
| `templates/` | 自作のマスター・テンプレート |
| `templates/icons/` | アイコン集の SVG 70種（Lucide、ISCライセンス。グレー・線幅1.5に整えたもの） |
| `scripts/check_deck.py` | 機械チェック（`python3 scripts/check_deck.py deck.pptx`、見本は `--sample`）。色・文字の大きさ・メッセージに加え、版面（本体の下の空き、塗りと枠線の重なり、囲みの数、塗りの面の数、文字のはみ出しの見積もり、記号の直打ち、表の最終行の罫線。rules H章）を検査。洗練の検査（本体の紺の数、注記・出所の行数、100以上の値の小数、表のセルの折り返し、メッセージの単位、G-6〜G-12）も行う |
| `scripts/compare_reference.py` | 手本のPDFと自分のデッキのPDFを同じ物差しで比べる（`python3 scripts/compare_reference.py 手本.pdf 自分.pdf --ref-pages 2-28 --own-pages 2-80`）。1ページごとに図の広さ・文字数・文字の段差・数字の割合・図に直接書いた文字の割合・注記の量・塗りの色数を測り、分布の重なりを類似度に、手本どうしの類似度との比を達成度として出す（I-5）。pdfplumber が必要 |
| `scripts/one_navy.py` | 本体の紺を主役の1か所に絞る（`python3 scripts/one_navy.py deck.pptx`）。見本デッキの生成時にも自動で通る（G-6） |
| `scripts/build_pattern_deck.js` | 見本デッキの再生成（`node scripts/build_pattern_deck.js patterns/pattern-deck.pptx`、pptxgenjs と sharp が必要：`npm i pptxgenjs sharp`）。P21以降は `build_pattern_deck_more*.js`（P72〜P78は `_more4.js`）、記号集・アイコン集は `build_symbol_icon_sheets.js`、パーツ集・テンプレート集は `build_template_sheets.js`、アイコンの目録は `icons.js` |
| `scripts/mck_marks.js` | 矢印と印の共通部品（流れ・太い矢印・差の矢印・段の区切り・比較・番号の丸・因果の三角・合流）。公開資料 MCK04 の描き方に合わせたもの。既定は文字色とグレーで、紺は `key: true` のときだけ（docs/symbols.md） |
| `scripts/add_guides.py` | スライドマスターにガイド線（①横+8.80 ②横+5.40 ③縦−13.20 ④縦+13.20 ⑤縦0、cm）を入れる（`python3 scripts/add_guides.py deck.pptx`）。見本デッキは生成時に入る |
| `docs/chart-and-source-notes.md` | 図表・出所・注記・図解の作法の根拠（調べた資料とURL）と、出所の書き方の例 |
| `docs/example-calc.md` | 完成例の数値の検算表 |
| `docs/reference-measurements.md` | 手本（MCK04）の実測値（文字の段差・余白・線・棒の隙間）と作図の既定値。実物と並べて比べるときの相手（I-5・I-6） |
| `docs/symbols.md` | 記号集：矢印・線・数値の符号・印の使い分けと決まり |
| `docs/icons.md` | アイコン集：70種の一覧と使い方の決まり |
| `docs/workflow.md` | スキルの処理の流れ（何を入力に、どのファイルの何を参照し、何をするか） |
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
