# NOTICE（出所と改変の内容）

このスキル（`saiken-consulting-pptx`）は、Carnot AI Inc. が MIT License で公開している
[carnot-tech/jinba-consulting-pptx-skill](https://github.com/carnot-tech/jinba-consulting-pptx-skill)
（取り込み時点: 2026-10-31 の main）をもとに改変したものです。元の著作権表示と許諾文は `LICENSE` に残しています。

元のスキルの作者が、この改変版を作成・保証・推奨したものではありません。この改変版についての問い合わせ先は元の作者ではなく、
slide_builder リポジトリの管理者です。元の作者の商標（社名・製品名・ロゴ）は、このスキルの名称・生成する資料・クレジットに使いません。

## 元のまま使っているもの

- 規約の正典 `references/slide-rules.md`（§0〜§9）と要点版・型カタログ・レビュー指示文・AI らしさの語彙
- 部品（両パーツ集の各パーツの作り）と `new_deck.py`
- 機械チェック（`check_deck.py`・`check_layout.mjs`・`check_all.py`）、PDF 化（`snapshot.py`）、PPTX 変換（`html_to_pptx.py`）、既存資料への差し込み（`measure_deck.py`・`deck_pptx.py`）
- 作業の手順（SKILL.md の工程 1〜9、フレッシュアイ・レビュー）

## 改変したもの

| 区分 | 内容 | 場所 |
|---|---|---|
| 版面 | スライドメッセージ・スライドタイトル・エビデンス・出所の位置と幅・高さを、NRI が官公庁の検討会に出した公開資料の骨格（slide_builder `rules/slide-rules.md` B-1 の実測値）に合わせた。章名の行 7.25mm／メッセージ 20pt・2行まで／区切り線 37.0mm／スライドタイトル（`.st`）41.25mm／エビデンス 143〜486pt／出所 174.3mm・9pt／左右 5.6mm。本体は上詰め | slide-rules §0.2、両パーツ集の `<style>` 末尾、`new_deck.py` |
| 配色 | 暖色（生成り・茶）から、墨とグレーで描き強調色 `--key` を1か所だけ使うモノトーンへ（McKinsey 型の抑制） | slide-rules §0.3、両パーツ集の `:root` |
| 検査 | 版面の定位置のずれ・メッセージ3行以上（FAIL）、強調色の使いすぎ（WARN）を追加。メッセージの大きさの基準を 22pt → 20pt、1行の目安を 40字 → 46字に | `check_layout.mjs`（31・32）、`check_deck.py` |
| 変換 | 列の間を空けた表（`border-spacing`）を PPTX にするとき、列の位置を HTML と揃える | `html_dump.mjs` |
| 比率 | 4:3（254×190.5mm）を選べるようにした（`new_deck.py --ratio 4:3`）。PPTX の大きさは HTML の縦横比から決め、検査の mm 換算・文字の大きさの基準は高さで測る | `new_deck.py`・`html_to_pptx.py`・`check_layout.mjs`・`check_deck.py` |
| 部品の不具合 | 計算ロジックの流れ（m27）の項目名が列の下に付かずスライドの下端へ流れていたのを直した。凡例＋図の見出しを並べたページで出所が定位置から外れるのを直した | 両パーツ集 |
| 表記 | 出所・注記の見出し語を「出所）」「注）」に | 両パーツ集 |
| 削除 | 元の作者の製品の説明（`references/jinba-context.md`）、商標ポリシー、裏表紙の制作クレジット、GitHub の設定（`.github/`） | — |
| 見本 | `assets/` の見本 PDF・PPTX を、改変後のパーツ集から作り直した（`scripts/build_assets.py`） | `assets/` |
