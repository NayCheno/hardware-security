# report-slide

This directory contains a LaTeX/Beamer scaffold for the hardware-security survey slide report.

`main.pdf` is generated locally for QA and review. It is intentionally ignored by Git and should not be committed.

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

For each selected primary paper, keep a seven-slide mini-story:

1. Title / venue / role
2. 内容摘要
3. 研究背景
4. 核心洞察 / 解决方案
5. 关键技术
6. 实验结果 / 证据状态
7. 文章评价：优点、不足、商业落地潜力

Evidence labels must be preserved: Foundational, Peer-reviewed SOTA, Spec/standard SOTA, Draft/not ratified, Industry evidence, Background substrate, Candidate/metadata-only.

Each direction keeps exactly three `primary` entries in `papers.yml`. Combined evidence packages are split into one primary paper/spec plus `auxiliary` comparison materials that do not count toward the three-paper rule. Missing-PDF, gated, metadata-only, and source-limited entries may describe source status only; they must not carry strong experimental claims.
