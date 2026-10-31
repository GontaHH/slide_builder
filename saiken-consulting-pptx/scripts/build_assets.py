#!/usr/bin/env python3
"""
build_assets.py — assets/ の見本を、いまのパーツ集（版面 §0.2・配色 §0.3）から作り直す。

  python3 scripts/build_assets.py

  assets/SlideCatalog_16x9.pdf    全パーツ（b01〜b30・m01〜m35）を1ページずつ並べた型の一覧（PDF）
  assets/SuperTemplate_parts.pptx 同じ並びを PowerPoint に書き出したもの（全スライド編集可能。SVG の図は画像）

パーツ集の見た目（:root・版面ブロック）を変えたら作り直す。依存は snapshot.py・html_to_pptx.py と同じ
（Chromium headless shell・python-pptx。PLAYWRIGHT_MODULE_DIR か npm run setup）。
"""
import pathlib, re, shutil, subprocess, sys, tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
BASE = ROOT / "templates" / "freeform_parts_16x9.html"
MORE = ROOT / "templates" / "freeform_parts_more_16x9.html"


def count(path, cls):
    return len(re.findall(rf'<section class="{cls}[\s"]', path.read_text(encoding="utf-8")))


def main():
    parts = [f"b{i:02d}" for i in range(1, count(BASE, "s") + 1)] + [f"m{i:02d}" for i in range(1, count(MORE, "slide") + 1)]
    with tempfile.TemporaryDirectory() as d:
        deck = pathlib.Path(d) / "catalog.html"
        run = lambda *a: subprocess.run([sys.executable, *a], check=True, cwd=ROOT)
        run("scripts/new_deck.py", "--parts", ",".join(parts), "--title", "パーツ一覧", "-o", str(deck))
        run("scripts/snapshot.py", str(deck))
        run("scripts/html_to_pptx.py", str(deck))
        (ROOT / "assets").mkdir(exist_ok=True)
        shutil.copy(deck.with_suffix(".pdf"), ROOT / "assets" / "SlideCatalog_16x9.pdf")
        shutil.copy(deck.with_suffix(".pptx"), ROOT / "assets" / "SuperTemplate_parts.pptx")
    print(f"assets/SlideCatalog_16x9.pdf・assets/SuperTemplate_parts.pptx（{len(parts)} 枚）")


if __name__ == "__main__":
    main()
