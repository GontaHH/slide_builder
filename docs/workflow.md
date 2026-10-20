# スキルの処理の流れ

3つのスキルとこのリポジトリが、何を入力に、どのファイルの何を参照し、何をするかをまとめる。

## 全体像

```mermaid
flowchart LR
  subgraph UP["上流（考える）"]
    SD["storyline-designer<br/>ストーリーライン設計"] --> SW["ストーリーラインWord<br/>（SCQA・ゴーストデッキ）"]
    ER["evidence-researcher<br/>エビデンス調査"] --> EX["エビデンスExcel<br/>（台帳・グラフ用シート）"]
  end
  subgraph REPO["GitHub：slide_builder（育てるルールと型）"]
    RU["rules/slide-rules.md"]
    PT["patterns/patterns.md<br/>patterns/pattern-deck.pptx"]
    SC["scripts/check_deck.py"]
    RP["rules/review-prompt.md"]
    CA["catalog/catalog.xlsx"]
  end
  PC["PC：参照ライブラリ/<br/>sources/（PDF）・pages/（画像）"]
  SW --> CSB["consulting-slide-builder<br/>スライド作成・仕上げ"]
  EX --> CSB
  RU --> CSB
  PT --> CSB
  SC --> CSB
  RP --> CSB
  PC -. 参考ページの画像 .-> CSB
  CSB --> OUT["slides_案件名.pptx<br/>＋最終報告"]
  CSB -- 指摘を一般化したルール --> RU
  SRL["slide-reference-library<br/>参照ライブラリ更新"] --> CA
  SRL --> PT
  SRL --> PC
```

## consulting-slide-builder の手順

| 手順 | 入力 | 参照するファイルと箇所 | 処理 | 出力・関門 |
| --- | --- | --- | --- | --- |
| 1 準備 | 依頼内容、テンプレート（任意） | `rules/slide-rules.md` 全文（特に「着手前の確認」）、`patterns/patterns.md` | リポジトリを取得し、目的・成果物・範囲を3〜5行で合意する | 合意した目的 |
| 2 メッセージライン | ストーリーラインWord | `rules/slide-rules.md` A章（2行・20pt、事実＋示唆、単独で読める） | ゴーストデッキのタイトルを磨き、一覧にして10秒テスト | **承認**：メッセージライン一覧 |
| 3 本体設計 | メッセージライン一覧、エビデンスExcel | `patterns/patterns.md`（型・紺にする1点・密度）、`catalog/catalog.xlsx` と PCの `pages/`（参考ページ） | スライドごとに型・チャート・紺の1点・エビデンスIDを決める | **承認**：本体設計表 |
| 4 生成 | 本体設計表、エビデンスExcelの値 | `patterns/pattern-deck.pptx`（同じIDの見本）、`rules/slide-rules.md` B〜D章 | 見本を複製して中身を差し替え、章ごとに3〜4枚ずつ作る | 下書きのpptx |
| 5 仕上げ | 下書きのpptx | `scripts/check_deck.py`、`rules/slide-rules.md` D-4、`rules/review-prompt.md` | 機械チェック（FAIL 0）→ 画像で目視 → 検算表 → 別のエージェントのレビューと採否表 | 仕上がったpptx |
| 6 還元 | ユーザーとレビューの指摘 | `rules/slide-rules.md` G章、`scripts/check_deck.py`、`rules/review-prompt.md` | 指摘を1行のルールに一般化し、了承を得てリポジトリに追記・コミット | **承認**：追加ルール、CHANGELOG |

```mermaid
flowchart TD
  A["1 準備<br/>リポジトリ取得・目的の合意"] --> B["2 メッセージライン一覧"]
  B --> G1{"承認"}
  G1 -- 修正 --> B
  G1 -- OK --> C["3 本体設計表<br/>型・紺の1点・エビデンスID"]
  C --> G2{"承認"}
  G2 -- 修正 --> C
  G2 -- OK --> D["4 生成<br/>見本を複製して差し替え"]
  D --> E1["5-1 機械チェック<br/>check_deck.py"]
  E1 -- FAILあり --> D
  E1 -- FAIL 0 --> E2["5-2 画像で目視"]
  E2 --> E3["5-3 検算表"]
  E3 --> E4["5-4 別の目のレビュー<br/>採否表"]
  E4 --> F["6 仕上げと還元<br/>ルールをリポジトリへ"]
```

## slide-reference-library の手順

| 手順 | 入力 | 参照・更新するファイル | 処理 |
| --- | --- | --- | --- |
| 1 候補 | ウェブ検索 | `catalog/catalog.xlsx`「収集候補」 | 公開資料の書誌情報・URLを追記 |
| 2 取得 | 候補のURL | PCの `sources/`・`pages/` | PCでPDFを保存し、ページを画像にする（リポジトリには入れない） |
| 3 分類 | ページ画像 | `catalog/catalog.xlsx`「ページ台帳」 | 型・章・評価（A/B/C）・学べる点を記録 |
| 4 型の更新 | ページ台帳 | `patterns/patterns.md` | 評価Aを参考ページIDに登録、密度の目安・失敗例を更新、新しい型を提案 |
| 5 見本の再生成 | patterns.md | `scripts/build_pattern_deck*.js` → `patterns/pattern-deck.pptx` | 型を追加したときだけ再生成し、check_deck.py --sample で確認 |
| 6 反映 | 差分 | `CHANGELOG.md` | 他社資料が混ざっていないか確認してコミット |
