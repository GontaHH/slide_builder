# saiken-consulting-pptx — コンサル品質スライド作成スキル（NRI 版面・モノトーン配色）

Claude Code のスキルとして使う、スライド作成の規約・部品・機械チェック一式です。
[carnot-tech/jinba-consulting-pptx-skill](https://github.com/carnot-tech/jinba-consulting-pptx-skill)（MIT License）の中身をそのまま使い、**次の2点だけ**を差し替えています（詳細は [NOTICE.md](NOTICE.md)）。

| 差し替えた点 | 内容 | 規約 |
| --- | --- | --- |
| **版面**（位置と幅・高さ） | スライドメッセージ・スライドタイトル・エビデンス・出所の位置を、NRI が官公庁の検討会に出した公開資料の骨格に合わせた | [slide-rules §0.2](references/slide-rules.md) |
| **配色** | 墨とグレーで描き、強調色（`--key` #1A4A9C）はメッセージが指す1点だけ（McKinsey 型の抑制） | [slide-rules §0.3](references/slide-rules.md) |

### 版面（16:9・338.67×190.5mm）

A4横（NRI の資料の判型。27.52×19.05cm）と 16:9 は高さが同じ 19.05cm なので、縦の位置は NRI の pt 値のまま、横は左右の余白 0.56cm を同じにして幅だけ広げています。

```
 7.25mm ┌ 章名の行（10.5pt・グレー）                              ┐ ①
13.25mm │ スライドメッセージ（20pt・墨・2行まで。46字/行）          │
 37.0mm ├──────────────── 区切り線（0.75pt・グレー）──────────────┤
41.25mm │ スライドタイトル（14pt 太字＋1.25pt の線。単位・期間は右に）│ ②
 50.5mm │ エビデンス（本体。上詰め）                                │
171.4mm │                                                          │
174.3mm │ 注）… ／ 出所）…（9pt・2行まで）               ページ番号 │
        └ 左右の端 5.6mm（③④）                                    ┘
```

**4:3 にもできます**（`new_deck.py --ratio 4:3`。254×190.5mm、PPTX は 10×7.5in）。4:3 も高さは 19.05cm なので縦の位置は同じで、横幅だけが変わります（メッセージは1行約34字）。

位置は全ページで動かしません（メッセージが1行でも区切り線は 37.0mm）。`check_layout.mjs` が、定位置から 1mm 超ずれたページとメッセージが3行以上のページを FAIL にし、強調色を3か所以上に使ったページを WARN にします。

### 配色

| 役割 | 色 |
| --- | --- |
| 文字 | 墨 #1F1F1F |
| 見出し・罫線・濃い面 | #262626 |
| 補助（軸ラベル・番号／矢印・淡い強調／注記・出所） | #4D4D4D／#A6A6A6／#666666 |
| 線・面 | #BFBFBF（罫）・#E0E0E0（薄い罫）・#F2F2F2（面） |
| **強調色（1ページ1か所）** | **#1A4A9C**（淡い面 #E4EBF5） |
| 意味を持つ赤（悪化・✕だけ） | #B3261E |

棒グラフは灰色で描き、言いたい1本だけ `.hl`、推す案の行の軸ボックスだけ `.key-fill` にします。組織の色に合わせるときは両パーツ集の `:root` の `--key`・`--key-soft` だけを差し替えます。

### 使い方（Claude Code）

このフォルダ（`saiken-consulting-pptx/`）を `~/.claude/skills/saiken-consulting-pptx/` に置くか、claude.ai のスキルとして zip でアップロードします。「コンサル品質のスライドを作って」「NRI の版面で」などで起動し、SKILL.md の手順（定義 → 調べる → ストーリーライン → 骨組み → 中身 → 文章 → 検査 → PDF 目視 → フレッシュアイ・レビュー）で進みます。

## 本質は `references/slide-rules.md`

このリポジトリでいちばん価値があるのは、実はテンプレでもスクリプトでもなく、**[slide-rules.md](references/slide-rules.md)** というテキストファイルです。「結論はタイトルに書く」「角丸禁止」「塗りのあるボックスに枠線を付けない」「1資料1用語」「前提・定義は左、帰結は右」…。

使い方は3つだけです。**AIに資料を作らせる前に毎回このファイルを読ませる。出力後に `scripts/check_deck.py` で違反を機械検出する。最後に `references/content-review-prompt.md` の指示文で、作り方を知らない別のエージェントにデッキを読ませ、日本語・論理・矛盾の指摘を受けて採用分だけ直す。** AIはセッションごとに記憶がリセットされるので、口頭で注意しても定着しません。ルールをファイルにして毎回読ませるのが定着させる方法です。

良いスライドを決めるのは型ではなく、**組んだ後の調整**です。表を2枚に割る、右カラムを帰結の形に書き直す、タイトルだけを通して読んでストーリーを繋ぎ直す。型に囚われず直し、そこで受けた指摘を slide-rules.md に1行足す。この繰り返しが品質の源で、型カタログとパーツ集は「たたき台を早く出して、調整に時間を回す」ための道具です。

自社で使うときは、slide-rules.md に自社の規約・指摘を追記して育ててください。

## 65型のスライド型カタログ

入口は **[assets/SlideCatalog_16x9.pdf](assets/SlideCatalog_16x9.pdf)**（65ページ）です。P.1〜30 が基本パーツ集、P.31〜65 が追加パーツ集を印刷したもので、型ID・型名・使いどころの一覧は [references/archetype-catalog.md](references/archetype-catalog.md) にあります。

「65型」は作れる見せ方の上限ではありません。実際のデッキでは、型を組み合わせたり崩したりして規約の範囲で自由に組むので、見せ方のパターンはこれより多くなります。型カタログは「レイアウトの発想帳」として使い、合わなければ捨ててください。


## パーツ集の使い方

| ファイル | 中身 | 使用頻度 |
| --- | --- | --- |
| `templates/freeform_parts_16x9.html`（基本パーツ集） | 表紙・全体マップ・目次・章扉・矢羽・前提→帰結・軸のある表・主張パネル・評価表・分布図・スイムレーン・表と裏の2段・一問一答など30パーツ | 高い。まずここから |
| `templates/freeform_parts_more_16x9.html`（追加パーツ集） | エグゼクティブサマリー・積み上げ棒・ブリッジ・散布図・比較表・マトリクス・イシューツリー・ロードマップ・ガントなど35パーツ | 低い。基本で足りないとき |

どちらも 16:9・1 section = 1スライドの単体HTMLです。`scripts/new_deck.py --parts b01,m05,...` のようにパーツ番号を並べると、必要なパーツだけを取り出した1本のHTMLができます（2ファイルの見た目の定義は、衝突しないようにスクリプトが結合します）。あとはプレースホルダー（本文 `Text 1`、項目名 `ラベル 1`、見出し `タイトル 1`、数値 `00`、年 `YYYY年`、出所 `出所）Source 1`）を実物に差し替えます。1つの図・表のページは、本体の最初に `<div class="st">何のデータか<span class="u">単位・期間</span></div>`（スライドタイトル）を置きます。残っていると `check_deck.py` が FAIL にします。

各 section のタイトル欄には型名だけが入っていて、見本の主張文は置いていません。見本文があると、その文型をなぞった資料になってしまうからです（slide-rules §2.8）。タイトルは必ず自分のストーリーラインから書きます。

**色・書体・版面は両ファイルで同じ既定**です（墨・グレー＋強調色1色。見出しは明朝、本文はゴシック）。色は各ファイルの `<style>` 冒頭の `:root`、版面は `<style>` 末尾の「版面」ブロックで一括管理しています。

## セットアップ

```bash
# 1. Claude Code のスキルフォルダに置く（これだけで規約・パーツ集・機械チェックが使える）
cp -r saiken-consulting-pptx ~/.claude/skills/saiken-consulting-pptx   # slide_builder リポジトリから

# 2. PDF 化と実レンダリング検査に使う Chromium headless shell を入れる（Node.js が必要。Chromium 本体は入れない。ダウンロード約95MB）
cd ~/.claude/skills/saiken-consulting-pptx && npm run setup        # Linux（コンテナ・Pod）は npm run setup:linux（依存ライブラリも入れる。日本語フォントは別に入れる）

# 3.（任意）PPTX に変換する・PPTX を check_deck.py で検査する場合（変換には Node.js 22 以上と手順2の headless shell も使う）
pip3 install python-pptx
```

- `scripts/check_deck.py`（規約の機械チェック）と `scripts/new_deck.py`（たたき台の生成）は Python 標準ライブラリだけで動きます。
- PDF 化は Chromium headless shell の印刷を使います（`scripts/snapshot.py`）。出力は Chrome 本体と画素単位で同じで、Chrome 本体が要りません。`CHROME_PATH` を指定すると Chrome 本体に切り替えられます（探し方は `scripts/find_browser.py`）。
- `package.json` は手順2の playwright と headless shell を入れるためだけのものです。`node_modules/` は .gitignore 済みです。

## 自分用のカスタマイズ

自分の組織の規約・禁止語・テンプレは `local/` に置きます（`local/README.md` 参照。git 管理外）。スキルは本体の規約を読んだ後に `local/slide-rules.local.md` を読み、重なる規則はそちらを優先します。どの資料にも効く規則は本体（このフォルダ）に、規約1行＋機械チェック＋テストの3点で入れます（[CONTRIBUTING.md](CONTRIBUTING.md)）。

元のスキルの更新を取り込むときは、版面（両パーツ集の `<style>` 末尾の「版面」ブロック・`new_deck.py` の見出し様式）と配色（`:root`）、`check_layout.mjs` の §0.2・§0.3 の検査を上書きしないでください。

## 手動で使う場合

```bash
python3 scripts/new_deck.py --list                                          # パーツ番号と型名の一覧
python3 scripts/new_deck.py --parts b01,b02,m05,b06,b09,b10 --title "資料名" -o mydeck.html   # たたき台を生成
python3 scripts/check_deck.py mydeck.html           # 規約の機械チェック（FAIL 0 にする）
python3 scripts/check_deck.py mydeck.html --forbid ~/.config/deck-forbidden-terms.txt   # 社外に出す前に顧客名・社内語の残りを検査（リストはリポジトリ外に置く）
node scripts/check_layout.mjs mydeck.html           # フッター重なり・はみ出し・空きの多いページの実レンダリング検査
python3 scripts/snapshot.py mydeck.html            # PDF と、4ページずつまとめた目視用の画像（headless shell で印刷）
python3 scripts/html_to_pptx.py mydeck.html         # PPTX を求められたときだけ: 編集できる PPTX に変換
```

## PowerPoint（.pptx）にする流れ

**まず HTML で仕上げ、PPTX にするのはユーザーから明示されたときだけ**にしています。

1. HTML でデッキを組み、機械チェック・レビュー・PDF での目視まで HTML 上で済ませる（修正の往復が速く、機械チェックもかけやすい）
2. 「PPTX で欲しい」と言われたら `scripts/html_to_pptx.py` で変換する。Chrome で描画した結果を読み取り、PowerPoint の図形として組み直すので、文字・表・図形はそのまま PowerPoint で編集できる
3. PPTX を渡した後に修正が来たら、HTML を直して変換し直す（PPTX を手で直すと HTML と中身がずれる）

SVG のチャートや画像は画像として貼られます（中の数値は編集できません）。書体は Yu Gothic / Yu Mincho に置き換わるので、変換後は PowerPoint で開いて折り返しを確認してください。

### 既にある PowerPoint 資料へページを足すとき

社内の標準デッキや作りかけの提案書に数ページ足す場合、変換した PPTX は書体・文字の大きさ・表の作りが元の資料と揃いません。このときは変換せず、**その資料のマスターの上に直接組みます**。

```bash
python3 scripts/measure_deck.py house.pptx                      # 資料の書式を測る → house.skin.json（目で見て直す）。.potx も可
python3 examples/house_deck_example.py house.pptx pages.pptx    # 作例。資料のマスターの上に 2 ページ組む
python3 scripts/check_deck.py pages.pptx --house house.skin.json
```

タイトルは資料のプレースホルダーに入り、書体・地色・ページ番号は資料のマスターがそのまま決めます。表は資料と同じ「テキストボックス＋罫線」で組むので、貼り付けても書式が変わりません。詳しくは slide-rules.md §8.7。

## 中身

| パス | 内容 |
| --- | --- |
| `SKILL.md` | AIへの指示書（スキルの本体）。考え方と手順だけを書き、詳細は `references/` に置く |
| `templates/freeform_parts_16x9.html` | 基本パーツ集（30パーツ・1パーツ=1スライド・16:9） |
| `templates/freeform_parts_more_16x9.html` | 追加パーツ集（35パーツ。チャート・比較表・マトリクス・計画系） |
| `references/slide-rules.md` | スライド作成ルール正典（§0.2 版面・§0.3 配色がこのスキルの差し替え部分） |
| `references/archetype-catalog.md` | 65型の型カタログ（型ID・型名・使いどころ・どのパーツ集の何番か） |
| `references/content-review-prompt.md` | フレッシュアイ・レビューの指示文。機械チェックのあと、作り方を伏せた別エージェントにデッキのファイルを渡して日本語・論理・破綻を拾わせ、採否表にして直す |
| `references/ai-smell-lexicon.md` | AI臭ワード・言い回しのリストとセルフチェック |
| `references/rules-digest.md` | 規約の要点版（工程ごと。各行に正典の § 番号）。`scripts/rules.py --phase <工程>` で表示する |
| `scripts/new_deck.py` | パーツ番号を並べて1本のデッキHTMLを生成（両パーツ集のCSSをスコープして結合・ページ番号の振り直し）。`--list` でよく使う20種類と使いどころ、`--show b09` で1部品のHTML |
| `scripts/rules.py` | 規約を工程ごとに引く（`--phase plan` など＝要点版、`--sec 4.12` で1項、`--full` で節全体） |
| `scripts/check_all.py` | check_deck・check_layout・出典の照合（`sources.md`）を1回で回し、指摘をページごとにまとめる |
| `scripts/snapshot.py` | PDF と、4ページずつまとめた目視用の画像を1回で作る（`--page N` で1ページを大きく） |
| `scripts/check_deck.py` | 規約の機械チェック（HTML / PPTX 両対応。テンプレ集の検査は `--template`）。タイトルの「N段階」と本文の連番の食い違いも FAIL にする |
| `scripts/html_to_pptx.py` | HTMLデッキを編集できる PPTX に変換（ユーザーが PPTX を求めたときだけ使う）。`scripts/html_dump.mjs` が Chrome で描画した要素を書き出し、python-pptx で組み立てる。追加の npm パッケージは不要（`scripts/lib_cdp.mjs` が Chrome を直接操作する） |
| `scripts/check_layout.mjs` | HTMLデッキの実レンダリング検査（フッターとの重なり・右端/下端のはみ出し・版面の40%超の空き） |
| `scripts/measure_deck.py` | 既存の PowerPoint 資料の書式（レイアウト・タイトルの枠・文字の大きさ・書体の指定の有無・罫線・色）を測り、`skin.json` に書き出す |
| `scripts/deck_pptx.py` | 測った書式で、その資料のマスターの上に編集可能なページを組む部品（タイトル・見出し・罫線の表・強調の面・矢羽・✓✕△）。作例は `examples/house_deck_example.py` |
| `tests/` | 機械チェックの自己テスト（`python3 -m unittest discover -s tests`）。指摘を機械チェックにしたら、直していない版で FAIL が出ることをここで確かめる |
| `assets/SlideCatalog_16x9.pdf` | **65型のスライド型カタログ（両パーツ集を印刷した65ページ）。型を探すときの入口** |
| `assets/SuperTemplate_parts.pptx` | 65型のPPTX見本帳（両パーツ集を本スキルの版面・配色で書き出したもの。全スライド編集可能）。PowerPoint で手動コピーして使うときの見本。パーツ集の正本ではない |
| `scripts/build_assets.py` | `assets/` の見本（PDF・PPTX）をいまのパーツ集から作り直す |
| `examples/sample_deck.html` | 版面と配色の作例（架空の地方鉄道の4枚。`sources.md` は数字の控え） |
| `NOTICE.md` | 元のスキルからの出所と、改変した内容 |

## カスタマイズ

- 色は両パーツ集の `:root` の `--key`・`--key-soft` だけを差し替えます（ほかはグレーのまま。§0.3）
- 版面（位置と幅・高さ）は変えません。変えるときは両パーツ集の「版面」ブロック・`new_deck.py`・`check_layout.mjs`（31）・slide-rules §0.2 を同時に直します
- 制作クレジットは入れません。ツール名・リポジトリ名がスライドに出ていると `check_deck.py` が FAIL にします
- PowerPoint（.pptx）が要るときは、HTML で仕上げてから `scripts/html_to_pptx.py` で変換します（上の「PowerPoint（.pptx）にする流れ」）

## ライセンス

MIT License（[LICENSE](LICENSE)）。元のスキルの著作権表示を残しています。元のスキルの作者がこの改変版を作成・保証したものではありません（[NOTICE.md](NOTICE.md)）。
