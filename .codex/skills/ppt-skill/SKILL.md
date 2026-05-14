---
name: ppt-skill
description: Generate research-grade Chinese academic PPT slide-report plans from a research topic, paper list, PDF/link set, bibliography, keywords, or local repository evidence. Use when Codex is asked to create a slide-by-slide technical evolution report, paper survey deck, academic presentation outline, or PPT-ready Chinese content with domain taxonomy, representative paper selection, per-paper deep-dive slides, visual design suggestions, citations, and commercialization/research takeaways.
---

# PPT Skill

## Purpose

Produce a research-oriented technical evolution slide report, not a generic literature review. The default output is Chinese, slide-by-slide PPT copy with citations and visual layout guidance. If the user asks for an actual `.pptx`, compose this skill with the presentation/deck-generation skill and use this skill as the content contract.

Treat every claim as evidence-bound. Do not invent papers, venues, authors, benchmarks, CVEs, datasets, SOTA status, code availability, or experimental numbers.

## Input Resolution

Before drafting, resolve these fields from the user request or repository context:

- Research topic.
- Target audience.
- Candidate paper sources: user list, PDFs, links, BibTeX, keywords, local `reference/`, `survey/reference.bib`, or "self-search".
- Target page count.
- Output mode: slide-by-slide Markdown by default; `.pptx` only if explicitly requested.

If a required field is absent but can be inferred safely, state the assumption and continue. Ask only when the topic or audience is too ambiguous to select papers responsibly.

## Evidence Workflow

1. Build an evidence corpus from primary sources first: paper PDFs, official conference/publisher pages, arXiv/OpenReview pages, project pages, artifact pages, and author repositories.
2. In this repository, check `reference/`, `survey/reference.bib`, and `domain.md` before broad web search when the topic is hardware/security related.
3. For post-2024 or "latest/SOTA" claims, verify against current primary sources. Record uncertainty as `需要查证` instead of guessing.
4. For every selected paper, capture canonical title, authors, institutions when available, venue/year, paper URL/PDF URL, code/artifact URL if available, and exact source locations for important numbers such as section/table/figure/page.
5. When evidence is incomplete, keep the slide but mark the missing field explicitly as `论文未说明`, `未找到公开 artifact`, or `需要查证`.

## Report Construction Workflow

1. Start with the global field frame, not individual papers:
   - Core problem.
   - Why it matters.
   - Bottlenecks in traditional approaches.
   - 3-6 complementary technical dimensions.
   - Evolution logic inside each dimension.
2. For each technical dimension or subdirection, select exactly three representative papers unless the user asks otherwise:
   - Foundational paper: defines the problem, route, dataset, benchmark, or research pattern.
   - SOTA 1: a later representative improvement with clear technical jump.
   - SOTA 2: latest or strongest method, preferably a paradigm shift.
3. Reject weak selections:
   - Do not choose a paper only because it is old, famous, or new.
   - Do not choose three nearly identical methods.
   - Do not use a survey/position paper as a technical representative unless it is itself a benchmark, taxonomy, or definition-setting artifact.
4. For each selected paper, generate 6-10 PPT-ready pages:
   - Title and positioning.
   - Content summary.
   - Research background.
   - Core insights.
   - System/method overview.
   - 2-4 core technique module pages.
   - Experimental results.
   - Paper evaluation and deployment/commercialization judgment.
5. After each dimension, add:
   - Technology evolution summary.
   - Method comparison table.
   - Dimension takeaway.
6. End with:
   - Global technology route map.
   - Academic/engineering/commercial maturity matrix.
   - At least five future research directions.
   - 3-5 final takeaways.

## Output Contract

Always output the report with these top-level sections:

```markdown
## 0. 报告标题与定位
## 1. 领域全局框架
## 2. 论文选择总表
## 3. Slide-by-slide PPT 大纲
## 4. 每个维度总结
## 5. 全局总结与商业化判断
```

For every slide, use this page-level schema:

```markdown
### Slide {编号}: {标题}

**核心信息一句话：**
...

**页面正文：**
- ...

**推荐图示/版式：**
...

**演讲备注：**
...

**引用来源：**
...
```

Use `references/slide-report-contract.md` for the detailed slide templates, selection tables, dimension summary tables, commercialization matrix, future-direction format, and final self-check.

## Visualization Standard

Every slide must include a concrete visual/layout recommendation. Across the report, include a meaningful visual design at least every 5-8 slides, such as:

- Taxonomy tree.
- Technology evolution timeline.
- System architecture diagram.
- Source-to-sink data-flow diagram.
- Agent/workflow diagram.
- Benchmark construction diagram.
- Method comparison matrix.
- Commercialization maturity matrix.

Keep each slide focused on one core point. Prefer compact tables and diagrams over dense prose.

## Security Boundary

For cybersecurity or vulnerability topics, explain research methods, validation design, experimental conclusions, and defensive implications. Do not provide exploit payloads, unauthorized attack runbooks, or target-specific instructions. Describe PoC material only as validation ideas, input constraints, trigger-condition classes, and safety-bounded evidence.

## Quality Gate

Before final output, verify:

- The taxonomy is coherent and non-overlapping.
- Foundational and SOTA roles are justified, not asserted.
- Every selected paper has source-backed metadata.
- Every specific number has a cited source location or is marked uncertain.
- Per-paper slides cover motivation, background, insight, method, experiments, and evaluation.
- Each dimension includes evolution and comparison summaries.
- The report reads as a technical evolution narrative rather than a paper list.
- No directly actionable offensive instructions are included.
