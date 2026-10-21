# 図表・出所・注記の作法：調べたことと書き方の例

`rules/slide-rules.md` の D-1〜D-3（チャート・出所・注記）と C-3（ポンチ絵）に入れた規則の根拠と、出所の書き方の例。2026-10-22 に、コンサル出身者の資料作成本の解説、Zelazny『Say It With Charts』の要約、think-cell のマニュアル、官公庁・統計機関のグラフの手引き、著作権法・政府標準利用規約の解説を調べてまとめた。

調べ方の限界：
- 『Say It With Charts』や山口周・吉澤準特・前田鎌利らの書籍は本文を確認できず、出版社の目次や解説記事で確かめた範囲。
- McKinsey・BCG の社内のスライド規程は公開されていない。McKinsey Global Institute の公開レポートと、NRI が官公庁の検討会に出した公開資料で、実際の書き方を確かめた。
- 根拠を確かめられなかったものは「慣行（未確認）」と書いた。ルールに入れたものでも、案件の発注者の書式があればそちらを優先する。

## 1. ルールに入れたことと根拠

| ルール（slide-rules.md） | 根拠 |
| --- | --- |
| メッセージ→比較の種類（5種類）→形式の順で選ぶ（D-1） | Zelazny『Say It With Charts』の目次（O'Reilly）と要約記事 |
| 時系列は区切りが少なければ縦棒、多ければ折れ線（D-1） | 同上（Selling Power の要約） |
| 円グラフは例外。区分は6まで、大きい順に12時から、複数の円を並べない、複数回答に使わない（D-1） | 英国統計局（ONS）のグラフの手引き、カナダ統計局。Zelazny も円は最も使わない形式とする |
| 二軸グラフを避け、1つの図に1つの単位（D-1） | ONS のブログ、ダイヤモンド・オンラインの解説 |
| 棒グラフは0から、軸を恣意的に切らない（D-2） | デジタル庁「ダッシュボードデザインの実践ガイドブック」、京都府・東京都のグラフの手引き、ONS |
| 折れ線・散布図は0からでなくてよい（D-2） | ONS「Axes and gridlines」 |
| 目盛線は淡く、数値ラベルを付けるなら軸を消す（D-2） | data.europa.eu の可視化ガイド、ONS |
| 単位は「単位、時点」の順で見出しに（D-2） | McKinsey Global Institute の公開レポートの図表、東京都・ONS の手引き |
| 凡例をやめて直接ラベル（D-2） | data.europa.eu「Direct labelling」、デジタル庁ガイドブック |
| 大きい順、「その他」は最後、時系列は古い順（D-2） | 東京都の手引き、デジタル庁ガイドブック |
| 色だけに頼らない（D-2） | デジタル庁ガイドブック（色の違いだけで区別させない、コントラストの確保） |
| 差分矢印は絶対差か相対差かを書き分け、CAGR矢印は合計の棒どうしを結ぶ（D-2） | think-cell マニュアル「Chart decorations」 |
| CAGR の期間数は終了年−開始年（D-2） | CAGR の定義（人事用語集などの解説） |
| ウォーターフォールの始点・終点は全高、棒をつなぐ線（D-2） | ウォーターフォールの用語解説（Toucan Toco） |
| マリメッコは区分を少なく、片方しか議論しないなら棒に（D-1） | SlideScience の解説 |
| 見出し語の統一、注→出所の順、肩番号で対応（D-3） | NRI の公開資料は「出所）」、MGI は「Note:」「Source:」。順序に統一の規則は確認できず、本ルールは注→出所に統一（慣行） |
| 加工の度合いの書き分け、加工した旨を出典と別に書く（D-3） | デジタル庁「政府標準利用規約（第2.0版）」の解説、総務省統計局・e-Stat の利用規約の記載例 |
| 自社の分析は出所に含める（D-3） | MGI の図表（自社の分析を出所に並べて書く）、NRI の公開資料（「…等を基にNRI作成」） |
| たどれる形で書く、ウェブは更新日と閲覧日（D-3） | 大学図書館の引用ガイド、日本公認会計士協会 実務補習所「出典に関する注意事項」 |
| 孫引きをしない（D-3） | 大学図書館のガイダンス、著作権の解説記事 |
| 他者の図をそのまま貼らず、元データから描き直す。出所は許可の代わりにならない（D-3） | 著作権の解説記事（お名前.com）、デジタル庁の利用規約の解説（第三者の権利がある素材の扱い） |
| 引用の要件（著作権法32条・48条）（D-3） | 文化庁の解説を引く厚生労働省の資料、大学の著作権教育資料 |
| 年と年度、名目と実質の前提を注に（D-3） | 大阪府「統計表の利用上の注意」（年度の定義）、MGI の図表の注（基準年の価格） |
| アンケートの設問・回答形式・n数・時期・主体、n＜30は参考値（D-3） | 調査会社の報告書作成の手引き（アスマーク）、NRI の公開資料（回答者の属性を明記） |
| 流れは左から右、線を交差させない、直線と直角で結ぶ（C-3） | 前田鎌利・堀口友恵『プレゼン資料の図解化大全』の解説、フローチャートの作法（Creately）、AWS 構成図ガイドラインの解説 |
| 関係は配置で表し、配置を先に決めてから矢印（C-3） | 久恒啓一の図解の解説 |
| 要素の位置と大きさをそろえ、線と色は最小限（C-3、H-10） | 吉澤準特『外資系コンサルが実践する図解作成の基本』の解説 |

## 2. 本ルールが調査結果と違う書き方を選んでいるところ

| 項目 | 調査で見た書き方 | 本ルール | 理由 |
| --- | --- | --- | --- |
| 負の数の符号 | 会計資料では「▲」や括弧も使われる | 「−」で書く（`docs/symbols.md`） | 1つの資料で書き方を1つにするため。会計の資料に差し込むときは、相手の書式に従う |
| 構成比の図 | Zelazny は円グラフを構成比の基本形とする | 100%積上げ棒を基本にし、円は区分2〜3のときだけ | 複数の時点・属性を並べて比べることが多いため |
| 予測値の見せ方 | 網かけ・点線の決まりは確認できなかった | 淡い塗りかラベル「（見込）」「（予測）」 | 慣行。凡例で区別を言えることを優先 |
| 統計の記号 | 府県の統計表は「△」を負数、「−」を該当なしに使う | 該当なしは「—」、負数は「−」 | 本ルールの記号集に合わせる。統計表を引くときは、その凡例を注に書く |

## 3. 出所・注記の書き方の例

本ルールの見出し語（「注）」「出所）」）に合わせた例。社名・資料名は例示。

1. 統計を加工した
   ```
   注）2020年以降は概数値
   出所）総務省「令和2年国勢調査」（e-Stat、2026年10月21日閲覧）を加工して作成
   ```
2. 白書の図を作り直した
   ```
   出所）国土交通省「令和6年版 国土交通白書」（2024年6月）図表I-1-2-3を基に作成
   ```
3. 委託調査報告書の数値をそのまま使った
   ```
   出所）経済産業省「令和5年度 ◯◯に関する調査事業 報告書」（受託：株式会社◯◯、2024年3月）p.45
   ```
4. 企業の決算資料を組み替えた
   ```
   注）1. 年度は4月〜翌3月　2. セグメント変更前の数値を新しい区分に組み替えて表示
   出所）◯◯株式会社「2025年3月期 決算説明資料」（2025年5月）を加工して作成
   ```
5. ウェブの記事
   ```
   出所）日経クロステック「◯◯」（2025年7月8日）、https://xtech.nikkei.com/…（2026年10月21日閲覧）
   ```
6. 自社のアンケート
   ```
   注）設問「◯◯を利用したことがあるか（複数選択可）」。複数回答のため合計は100%を超える。n＝1,032
   出所）当社「◯◯に関する生活者調査」（2026年9月、インターネット調査、全国の20〜69歳）
   ```
7. 複数の出所から推計した
   ```
   注）2030年度以降は推計。実質（2015年価格）。四捨五入のため合計が一致しない場合がある
   出所）内閣府「国民経済計算」；国立社会保障・人口問題研究所「日本の将来推計人口（令和5年推計）」を基に推計
   ```
8. 英文のデッキ
   ```
   Note: Figures may not sum to 100% because of rounding.
   Source: IEA, World Energy Outlook 2025; team analysis
   ```

## 4. 参照した資料（URL）

- Zelazny『Say It With Charts』目次（O'Reilly）：https://www.oreilly.com/library/view/the-say-it/9780071474702/ch02.html
- 同 要約：https://www.sellingpower.com/2010/01/13/1932/a-primer-on-charts ／ https://www.antoinebuteau.com/lessons-from-gene-zelazny/ ／ https://www.qimacros.com/free-excel-tips/say-it-with-charts/
- think-cell マニュアル（Chart decorations）：https://www.thinkcell.com/en/resources/manual/chartdecorations
- デジタル庁 ダッシュボードデザインの実践ガイドブック：https://digital.go.jp/assets/contents/node/basic_page/field_ref_resources/1948e3cd-736a-4378-9e31-039b08d11106/10b4c14d/20240903_resources_dashboard-guidebook_guidebook_01.pdf
- デジタル庁 政府標準利用規約の解説：https://www.digital.go.jp/assets/contents/node/basic_page/field_ref_resources/f7fde41d-ffca-4b2a-9b25-94b8a701a037/a0f187e6/20220706_resources_data_betten_01.pdf
- e-Stat 利用規約：https://www.e-stat.go.jp/terms-of-use ／ 総務省統計局 経済センサスの利用：https://www.stat.go.jp/data/e-census/2014/riyou_2.html
- 総務省統計局 なるほど統計学園（グラフ）：https://www.stat.go.jp/naruhodo/9_graph/kihon.html
- 京都府 グラフ作成：https://www.pref.kyoto.jp/tokei/analysis/analyze/documents/graph.pdf
- 東京都 グラフの作り方：https://www.toukei.metro.tokyo.lg.jp/kurasi/2025/2025pdf/ku25rf2400.pdf
- 大阪府 統計表の利用上の注意：https://www.pref.osaka.lg.jp/documents/12493/attention.pdf
- ONS Service Manual（円グラフ／軸と目盛線／グラフの文字）：https://service-manual.ons.gov.uk/data-visualisation/chart-types/pie-and-doughnut-charts ／ https://service-manual.ons.gov.uk/data-visualisation/guidance/axes-and-gridlines ／ https://service-manual.ons.gov.uk/data-visualisation/guidance/chart-text
- ONS 二軸グラフの問題：https://digitalblog.ons.gov.uk/2019/07/03/dueling-with-axis-the-problems-with-dual-axis-charts
- カナダ統計局 円グラフ：https://www150.statcan.gc.ca/n1/edu/power-pouvoir/ch9/pie-secteurs/5214826-eng.htm
- data.europa.eu 可視化ガイド：https://data.europa.eu/apps/data-visualisation-guide/axes-grids-and-legends ／ https://data.europa.eu/apps/data-visualisation-guide/direct-labelling ／ https://data.europa.eu/apps/data-visualisation-guide/bar-size-and-spacing
- ウォーターフォールの解説：https://toucantoco.com/en/glossary/waterfall-chart.html ／ マリメッコの解説：https://slidescience.co/?p=4910
- 表の作り方：https://www.sbbit.jp/article/cont1/37747 ／ https://inforiver.com/wp-content/uploads/Best-Practices-for-table-design.pdf
- アンケートの報告書：https://www.asmarq.co.jp/wp-content/uploads/2024/12/questionnaire2.pdf
- McKinsey Global Institute 2019 compendium：https://www.mckinsey.com/~/media/McKinsey/Featured%20Insights/Innovation/Ten%20highlights%20from%20our%202019%20research/MGI-in-2019-A-compendium-of-our-research-this-year-vF.ashx
- NRI の公開資料（消防庁 検討会資料）：https://www.fdma.go.jp/singi_kento/kento/items/post-170/03/shiryou3-3.pdf
- 著作権・引用：https://www.bunka.go.jp/j-mediaarts-festival/copyright/index.html ／ https://www.mhlw.go.jp/content/001113027.pdf ／ https://copyright-edu.axies.jp/video/assets/pdf/08.pdf ／ https://www.onamae.com/business/article/305884/
- 引用の書き方（大学図書館・会計士協会）：https://www.kulib.kyoto-u.ac.jp/yoshidasouthlib/images/guidance/2025/guidance02-1.pdf ／ https://www.clib.kindai.ac.jp/search/pdf/guide_quote.pdf ／ https://jfael.or.jp/institution/jitsumu-cms/wp-content/uploads/2023/11/4.出典に関する注意事項2023.pdf
- 図解の作法：https://diamond.jp/articles/-/81602 ／ https://diamond.jp/articles/-/366485 ／ https://diamond.jp/articles/-/359526 ／ https://blogs.itmedia.co.jp/doc-consul/2018/07/post_103.html ／ https://www.lifehacker.jp/article/239089zukai-memo-method-02/ ／ https://gentosha-go.com/articles/-/38129?page=2 ／ https://creately.com/guides/flowchart-rules/ ／ https://blog.serverworks.co.jp/aws-diagram-guidelines
- スライドの体裁の解説：https://deckary.com/blog/mckinsey-style-slides ／ https://slidemodel.com/mckinsey-presentation-structure/ ／ https://www.jmrlsi.co.jp/skillup/presen/vp06.html
