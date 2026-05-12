# report-slide

This directory contains a LaTeX/Beamer scaffold for the hardware-security survey slide report.

## Build

```bash
cd report-slide
make
```

The build uses `xelatex` to support Chinese text.

## Layout

- `main.tex`: top-level Beamer file.
- `config/preamble.tex`: shared theme, fonts, and slide macros.
- `00-overview/`: deck goal and direction index.
- `NN-<direction>/`: one subdirectory per classification point.
  - `section.tex`: LaTeX slides for this direction.
  - `papers.yml`: machine-readable paper selection and five-section notes.

## Expansion rule

For each selected paper, expand the current summary slide into:

1. Title / venue / role
2. 内容摘要
3. 研究背景
4. 解决方案 / 核心洞察 / 技术模块
5. 实验结果
6. 文章评价：优点、不足、商业落地潜力

Evidence labels must be preserved: Foundational, Peer-reviewed SOTA, Spec/standard SOTA, Draft/not ratified, Industry evidence, Background substrate, Candidate/metadata-only.
