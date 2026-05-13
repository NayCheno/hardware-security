# report-slide

This directory contains the source for the hardware-security survey slide report.
The maintained content sources are each direction's `papers.yml` plus optional
direction-level `story.yml` files for authored, paper-read slide narratives.
Beamer/PDF and PPTX outputs are generated from those shared YAML sources.

`main.pdf` and `output/*.pptx` are generated locally for QA and review. They are
intentionally ignored by Git and should not be committed.

## Build

```bash
cd report-slide
make
```

The build uses `xelatex` to support Chinese text.

For validation only:

```bash
python tools/validate_content.py
```

For the editable PPTX:

```bash
node pptx/build.mjs
```

To rebuild one authored direction for visual QA:

```bash
node pptx/build.mjs --only 12-memory-io-fabrics --preview preview/12-memory-io-fabrics
```

## Layout

- `main.tex`: top-level Beamer file.
- `config/preamble.tex`: shared theme, fonts, and slide macros.
- `tools/validate_content.py`: validates the 15-direction / 45-paper / 225-detail-slide content contract.
- `tools/generate_beamer.py`: regenerates `section.tex` files from YAML.
- `pptx/build.mjs`: builds the editable PowerPoint deck from the same YAML.
- `00-overview/`: deck goal and direction index.
- `NN-<direction>/`: one subdirectory per classification point.
  - `section.tex`: generated LaTeX slides for this direction.
  - `papers.yml`: machine-readable paper selection, evidence status, and legacy five-slide notes.
  - `story.yml`: optional authored direction source; when present, it owns the direction's slide narrative and proof objects.

## Expansion rule

For each selected primary paper, keep a five-slide mini-story:

1. 内容摘要
2. 研究背景
3. 解决方案
4. 实验结果 / 证据状态
5. 文章评价：优点、不足、商业落地潜力

Evidence metadata is split across independent fields:
`selection_slot` records presentation position, `paper_type` records source kind,
`claim_strength` records E0-E5 claim support, and `source_status` records local
source/PDF status. Legacy `role` values are compatibility labels only and must
not be read as academic status.

Each direction keeps exactly three `primary` entries in `papers.yml`.
Combined evidence packages are split into one primary paper/spec plus
`auxiliary` comparison materials that do not count toward the three-slot rule.
Missing-PDF, gated, metadata-only, and source-limited entries may describe
source status only; they must not carry strong experimental claims.

For legacy directions, each `primary` entry must include:

```yaml
slides:
  summary:
  background:
  solution:
  experiments:
  evaluation:
```

For authored directions, `papers.yml` keeps selection and evidence metadata only,
and `story.yml` must contain 17 authored slides: direction intro, 3 papers x 5
detail slides, and direction summary. Each authored slide must include a claim,
narrative, source/page/figure/table evidence refs, source note, and proof object.

For specs and surveys, `slides.experiments.points` must explicitly state
`规范/Survey，无新实验` or equivalent conservative wording.

`tools/validate_content.py` is also the evidence QA gate. It rejects
draft/preprint or source-limited entries marked as peer-reviewed, E5 entries
that make mechanism/performance/state-machine claims, vendor-only primary
selections, and spec/SoK/survey slides that present themselves as mechanism
experiments.

The current three-primary ledger, evidence classes, and source-limited boundaries are reconciled in `../survey/evidence_ledger.md`.
