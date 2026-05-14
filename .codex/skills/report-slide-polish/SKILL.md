---
name: report-slide-polish
description: Polish, repair, validate, and build this repository's local report-slide hardware-security deck. Use when Codex works on report-slide sources, uv build commands, out/report.pdf or out/report.pptx deliverables, evidence/footer/layout QA, or local PPTX/PDF consistency for the Chinese hardware-security slide report.
---

# Report Slide Polish

## Purpose

Use this skill as the repo-specific production companion to `$ppt-skill`. `$ppt-skill` owns the academic content contract: topic framing, paper selection, taxonomy, and slide narrative. This skill owns local implementation: editing `report-slide` sources, regenerating artifacts with `uv`, and verifying that `out/report.pdf` and `out/report.pptx` are consistent, readable, and evidence-bound.

Do not use Google Drive for this workflow. Do not hand-edit final PDF/PPTX artifacts. Modify local source files and generators, then rebuild.

## Local Contract

Primary deliverables:

```text
out/report.pdf
out/report.pptx
```

Intermediate generated artifacts may exist, but are not the final handoff:

```text
report-slide/main.pdf
report-slide/output/hardware-security-report-slide.pptx
```

Treat these local sources as the normal edit points:

```text
report-slide/main.tex
report-slide/config/preamble.tex
report-slide/<direction>/section.tex
report-slide/<direction>/story.yml
report-slide/<direction>/papers.yml
report-slide/tools/generate_beamer.py
report-slide/pptx/build.mjs
tools/build.py
```

Use the unified build commands:

```bash
uv run build report       # out/report.pdf and out/report.pptx
uv run build report-pdf   # out/report.pdf only
uv run build report-pptx  # out/report.pptx only
uv run build survey       # out/survey.pdf
uv run build all          # all unified out/ artifacts
uv run build clean        # clean out/
```

## Workflow

1. Inspect `git status --short`, relevant diffs, and the touched `report-slide` files before editing. Preserve unrelated user changes.
2. Decide the right edit layer:
   - Use `story.yml` / `papers.yml` for content, metadata, evidence, and per-paper structure.
   - Use generated `section.tex` only when the repo pattern makes it the maintained source for that section.
   - Use `generate_beamer.py`, `preamble.tex`, and `pptx/build.mjs` for shared layout, footer, badge, typography, and export behavior.
3. Preserve the report structure unless the user explicitly asks otherwise:
   - 15 technical directions.
   - 3 representative materials per direction.
   - 5 pages per material: content summary, research background, solution, experiments/evidence, evaluation.
   - Direction opening and direction summary pages.
   - E0-E5 evidence methodology.
4. Fix deck-wide text defects before cosmetic polish: English truncation, mojibake, control characters, abnormal word splits, duplicated boilerplate, overlong bullets, and inconsistent terminology.
5. Replace dense prose with compact diagrams, cards, timelines, and comparison matrices where the source evidence supports it. Keep each page focused on one claim.
6. Rebuild through `uv run build ...`; never treat a manually edited generated artifact as the source of truth.
7. Verify both PDF and PPTX outputs. If the task changes visible layout, inspect rendered pages/slides rather than relying only on successful compilation.
8. Report changed source files, build commands run, artifacts produced, and any remaining evidence gaps.

## Evidence Rules

Keep claims evidence-bound:

| Level | Meaning | Boundary |
| --- | --- | --- |
| E0 | official spec / RFC | Mechanisms, interfaces, terms, status only; write `规范，无新实验` when relevant. |
| E1 | peer-reviewed system paper | System design and experiments only inside the paper's threat model and workload. |
| E2 | SoK / Survey | Taxonomy and related-work framing; do not treat as first-hand experiments. |
| E3 | draft / preprint | Frontline or draft status only; explicitly mark `draft / not ratified`. |
| E4 | industry evidence | Product behavior, deployment practice, or engineering background; not universal proof. |
| E5 | limited public evidence | Source status and research leads only; no strong mechanism or performance claims. |

Any specific number, version, public status, ratification status, benchmark result, TCB size, CVE count, workload count, performance overhead, or deployment claim needs a source location. If it is not verified, write `待补证据：需要核对原文 / 官方规范 / 版本状态`.

## Slide Quality

Prefer a restrained academic technical style:

- 16:9 layout.
- Clean background, controlled density, clear title area.
- Evidence badge near the top right.
- Compact source/evidence footer instead of repeated long disclaimers.
- Concrete visual element every 5-8 slides when possible.
- No text overflow, cropped tables, broken footers, duplicated pages, or mismatched PDF/PPTX content.

Use compact footers:

```text
Source: {title}, {venue/year/version}, {Fig/Table/Page if applicable} | Evidence: E1 System Paper
来源：{标题}，{会议/年份/版本}，{图/表/页码}｜证据等级：E1 System Paper
```

Normalize common terminology:

| Variant | Preferred |
| --- | --- |
| Arm/RISC V/RISCV | Arm / RISC-V |
| CCA/RME/RMM | Arm CCA / RME / RMM |
| CoVE/APTEE/AP-TEE | CoVE / AP-TEE |
| PCIeIDE / PCI-E IDE | PCIe IDE |
| CXL mem | CXL.mem |
| Smart NIC / smartnic | SmartNIC |
| trusted IO | Trusted I/O |
| TEE I/O | TEE-I/O |
| realm / rmm | Realm / RMM when used as proper nouns |

## Reference

For broad deck cleanup, read `references/report-slide-contract.md`. It condenses the full `next-plan.md` into page-type requirements, visual templates, text-repair rules, QA gates, and prohibited changes.
