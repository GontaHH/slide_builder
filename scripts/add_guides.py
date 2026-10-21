"""スライドマスターにガイド線を入れる（rules/slide-rules.md B-1「ガイド線」）。

使い方:
    python3 scripts/add_guides.py deck.pptx            # 上書き
    python3 scripts/add_guides.py deck.pptx out.pptx   # 別名で保存

ガイド線の値は PowerPoint の表示と同じく「スライドの中心からの距離（cm）」で持つ。
横のガイドは中心より上が＋、縦のガイドは中心より右が＋。
  ① スライドタイトル（メッセージブロック）の上端  横 +8.80
  ② ボディ部分（本体の見出し）の上端            横 +5.40
  ③ 資料内容の左端                              縦 −13.20
  ④ 資料内容の右端                              縦 +13.20
  ⑤ 資料の中心                                  縦 0
スライドマスターのガイド線（PowerPoint 2013 以降）として入れるので、本文のスライドでは動かせない
（動かすときは［表示］→［スライド マスター］で直す）。既にあるマスターのガイド線は置き換える。
"""
import re
import sys
import zipfile

GUIDES = [("horz", 8.80), ("horz", 5.40), ("vert", -13.20), ("vert", 13.20), ("vert", 0.0)]
EMU_PER_CM = 360000
P15 = "http://schemas.microsoft.com/office/powerpoint/2012/main"
EXT_URI = "{27BBF7A9-308A-43DC-89C8-2F10F3537804}"


def guide_xml(cx_emu, cy_emu, guides=GUIDES):
    """ガイド線の位置を 1/8 pt（576 単位＝1インチ）に直して p15:sldGuideLst を作る。"""
    items = []
    for i, (orient, cm) in enumerate(guides, 1):
        if orient == "horz":
            pos_emu = cy_emu / 2 - cm * EMU_PER_CM   # 中心より上が＋
        else:
            pos_emu = cx_emu / 2 + cm * EMU_PER_CM   # 中心より右が＋
        pos = round(pos_emu / 914400 * 576)
        attr = ' orient="horz"' if orient == "horz" else ""
        items.append(f'<p15:guide id="{i}"{attr} pos="{pos}" userDrawn="1"><p15:clr><a:srgbClr val="F26B43"/></p15:clr></p15:guide>')
    return (f'<p:ext uri="{EXT_URI}"><p15:sldGuideLst xmlns:p15="{P15}">' + "".join(items) + "</p15:sldGuideLst></p:ext>")


def set_master_guides(master_xml, cx, cy):
    ext = guide_xml(cx, cy)
    master_xml = re.sub(r'<p:ext uri="\{27BBF7A9-308A-43DC-89C8-2F10F3537804\}">.*?</p:ext>', "", master_xml, flags=re.S)
    if "<p:extLst>" in master_xml:
        return master_xml.replace("<p:extLst>", "<p:extLst>" + ext, 1)
    if "<p:extLst/>" in master_xml:
        return master_xml.replace("<p:extLst/>", "<p:extLst>" + ext + "</p:extLst>", 1)
    return master_xml.replace("</p:sldMaster>", "<p:extLst>" + ext + "</p:extLst></p:sldMaster>", 1)


def main(src, dst=None):
    dst = dst or src
    with zipfile.ZipFile(src) as z:
        files = {n: z.read(n) for n in z.namelist()}
    pres = files["ppt/presentation.xml"].decode("utf-8")
    m = re.search(r'<p:sldSz cx="(\d+)" cy="(\d+)"', pres)
    cx, cy = int(m.group(1)), int(m.group(2))
    for name in [n for n in files if re.match(r"ppt/slideMasters/slideMaster\d+\.xml$", n)]:
        files[name] = set_master_guides(files[name].decode("utf-8"), cx, cy).encode("utf-8")
    with zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED) as z:
        for n, b in files.items():
            z.writestr(n, b)
    print("guides added:", dst, f"(スライド {cx / EMU_PER_CM:.2f}×{cy / EMU_PER_CM:.2f}cm)")


if __name__ == "__main__":
    main(*sys.argv[1:3])
