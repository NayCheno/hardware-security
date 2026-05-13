# Next steps

1. After editing any `papers.yml` or authored `story.yml`, run `python tools/validate_content.py`.
2. Regenerate Beamer sections with `python tools/generate_beamer.py`; do not hand-edit generated `section.tex` unless the generator is updated too.
3. Build with `make check` and inspect `main.pdf` locally.
4. Build the editable deck with `node pptx/build.mjs`; use `--preview report-slide/preview --preview-limit 20` for a quick visual smoke test.
5. For one authored direction, use `node pptx/build.mjs --only 12-memory-io-fabrics --preview preview/12-memory-io-fabrics` and inspect all rendered pages.
6. Keep every primary paper as a fixed five-slide mini-story: 内容摘要、研究背景、解决方案、实验结果、文章评价.
7. Put concrete numbers in “实验结果” only after checking the original local PDF or official source.
8. Keep `main.pdf`, `output/*.pptx`, and preview images as generated local QA artifacts; do not commit them.
