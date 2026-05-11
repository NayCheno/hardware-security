---
name: reference-paper-review
description: Survey-oriented Chinese workflow for hardware-security paper ingestion, classification, and critical review. Use when Codex is given a paper PDF URL, arXiv/DOI/paper page/title, or a paper already under `reference/`; download verified PDFs into the correct reference category directory, map the paper against `domain.md`, write/update the paper `README.md`, and for SoK/survey papers expand important cited works for classification and analysis.
---

# Reference Paper Review

## Purpose

Maintain this repository's hardware-security survey evidence library and produce critical, evidence-based paper notes under `reference/<category>/<paper>/`. Treat the output as reusable SoK/survey material, not a generic abstract.

Default output language is Chinese. Keep claims grounded in the paper. If the paper does not specify something, write `论文未说明` or `证据不足`; do not fill gaps with guesses.

## Current Research Scope

This repository is a research SoK/survey evidence library. The default goal is to build a defensible architecture-level survey, not to collect every adjacent security paper.

Prioritize papers, specifications, and surveys that directly support:

- hardware-assisted TEE and confidential-computing design space,
- Arm TrustZone / Arm CCA / RME / RMM mechanisms,
- RISC-V enclave lineage, CoVE / AP-TEE, CoVE-IO, TEE-I/O, IOMMU, IOPMP, and AIA,
- attestation, boot, lifecycle, memory ownership, DMA/I/O protection, accelerator/device TEE,
- memory protection taxonomy when it clarifies access control, encryption, integrity, replay protection, or lifecycle semantics,
- runtime CFI / memory-safety hardening only when it helps separate architectural hardening from TEE/confidential-computing boundaries.

Current out-of-scope topics:

- side-channel, microarchitectural leakage, physical leakage, fault injection, Rowhammer, power/EM, cache-timing, and speculative-leakage papers as primary research targets,
- attack-only papers that do not directly change the architecture/specification taxonomy,
- broad vulnerability surveys unless they are needed to explain the threat-model boundary of an in-scope TEE/confidential-computing mechanism.

For out-of-scope attack papers, do not download PDFs, create new reference directories, or expand citations by default. Mention them only as limitations or excluded threats when an in-scope paper relies on that boundary. If the user explicitly asks to study attacks later, create a separate scope and bibliography instead of mixing it into the current defense/specification survey.

## Repository Contract

- Use the current categories in `reference/README.md`; read `domain.md` when category or SOTA role is unclear.
- Store ordinary papers at `reference/<category>/<paper-slug>/`.
- Store SoK/survey/taxonomy/literature-review anchor papers at `reference/<category>/sok/<paper-slug>/`.
- Use a lowercase kebab-case slug derived from the canonical title.
- Before creating anything, deduplicate with `rg` across `reference/`, `survey/reference.bib`, and `domain.md` using title words, BibTeX key, DOI, arXiv id, and author/year.
- Treat `paper.pdf` as local evidence only after the file exists and is verified as a PDF. If download fails, keep the README and record the exact failure in `Download status`.

## Link/PDF Ingestion Workflow

When the user gives a network link, title, DOI, or arXiv page, do the ingestion work instead of only explaining what to do.

1. Identify the input type:
   - Direct PDF: `.pdf` URL, `arxiv.org/pdf/...`, publisher PDF endpoint, or `Content-Type: application/pdf`.
   - Paper page: arXiv abstract, DOI, ACM/IEEE/USENIX/NDSS/OpenReview/publisher page, GitHub release, or project page.
   - Title-only input: search for the canonical paper page and PDF source.
2. Resolve metadata from primary sources when possible: title, authors, year, venue/status, DOI/arXiv id, source URL, PDF URL, BibTeX key candidate, and whether the paper is SoK/survey/spec/system/attack/defense.
3. Choose the category by matching the paper's mechanism and contribution against `domain.md` and existing `reference/<category>/` entries. If it is a SoK/survey anchor, place it under that category's `sok/` directory.
4. Create or update the paper directory and README metadata. Use this shape unless the existing README already has equivalent fields:

```markdown
# Paper Title

- BibTeX key: `key`
- Category: `category[/sok]`
- Authors: ...
- Year: ...
- Venue: ...
- Source: ...
- PDF source: ...
- Local PDF: `paper.pdf` or unavailable
- Download status: downloaded and verified | unavailable: reason
- SOTA role: ...  # only when applicable
```

5. Download the public PDF to `paper.pdf` when available. Preserve the source URL in `PDF source`. Verify the file by checking PDF magic bytes, `file`, `pdfinfo`, or a successful text extraction.
6. Generate the review with the schema below and write it back with `scripts/update_readme.py`.
7. If the paper is intended for the survey bibliography and reliable metadata is available, add or update its BibTeX entry in `survey/reference.bib`. Do not invent DOI, pages, venue, or publisher fields.

## Existing Paper Workflow

1. Locate the paper directory, usually `reference/<category>/<paper>/` or `reference/<category>/sok/<paper>/`.
2. Read `README.md` first for BibTeX key, title, source URL, category, and download status.
3. Prefer `paper.pdf` when present. If no PDF exists, use the source links in README or user-provided link/title. Clearly mark weaker evidence when only metadata or a web page is available.
4. Extract enough paper text to support the review. When possible, cite section, page, figure, or table locations.
5. Write the analysis using the schema below.
6. Insert or replace the analysis in the paper `README.md` using `scripts/update_readme.py`.

## SoK / Survey Expansion Workflow

When the ingested or reviewed paper is a SoK, survey, taxonomy, or literature review, use it as an anchor for one-hop citation expansion.

1. Extract the bibliography from `paper.pdf` or the publisher/arXiv page. If extraction quality is poor, say so and use only citations that can be identified reliably.
2. Build a citation triage table before downloading many papers. Prioritize references that are:
   - foundational systems/specifications for this survey's hardware-security scope,
   - directly used by the SoK taxonomy,
   - baselines or representative systems,
   - SOTA or standards-track materials,
   - missing from `reference/` but mapped to a `domain.md` gap.
3. Filter out current out-of-scope attack-only works before assigning P0/P1. Side-channel, physical-leakage, fault, Rowhammer, cache-timing, and speculative-leakage citations should normally be marked `out-of-scope` or `P2 boundary only`, unless the user explicitly asks to study that attack area.
4. For each in-scope P0/P1 cited work, search for the primary paper/spec page and public PDF, deduplicate against the repo, classify into the right category, create/update the README, download a verified PDF when possible, and analyze it with this same review schema.
5. Do not recursively expand references of those cited works unless the user explicitly asks. For large SoK bibliographies, finish the highest-priority cited works first and leave a clear backlog table in the SoK README or final report.
6. Update `reference/<category>/sok/README.md` when adding a SoK anchor. Update `domain.md` only for material changes to coverage, SOTA status, or survey gaps.

## Review Standard

Act like a top-conference reviewer, reproduction lead, and follow-up research advisor:

- Separate author claims from demonstrated evidence.
- Judge whether evaluation supports the claims.
- Identify implicit assumptions, missing baselines, deployment barriers, and possible bypasses or failure modes.
- Distinguish engineering integration from research novelty.
- Do not overpraise. State uncertainty directly.

## README Section Contract

Write the generated review under a section titled:

```markdown
## Paper Review
```

The script will wrap this section with stable markers:

```markdown
<!-- BEGIN PAPER REVIEW -->
## Paper Review
...
<!-- END PAPER REVIEW -->
```

Do not remove the existing metadata section above it unless the user explicitly asks.

## Review Schema

Use these headings. Keep the order stable so notes are comparable across papers.

### 1. 论文基本信息

- 论文标题
- 作者 / 机构
- 发表会议 / 年份
- 领域分类: choose from 系统 / 安全 / 架构 / 编译器 / OS / 网络 / 分布式 / 硬件 / 软件工程 / 其他
- 一句话总结
- 最核心贡献一句话

### 2. 研究问题与背景

Answer:

- 论文要解决什么问题
- 为什么重要
- 之前方法为什么不够
- 论文声称的 gap
- 这个 gap 是否真实存在，以及依据
- For security papers: attacker model, trust boundary, protection goal, excluded attacks
- For systems papers: system model, workload/deployment scenario, performance/reliability/scalability/compatibility goals

### 3. 核心方法拆解

Analyze mechanisms, not just the abstract:

- Method/system/framework name
- Architecture as a text pipeline, e.g. `Input -> Component A -> Enforcement -> Output`
- Core modules and responsibilities
- Key algorithms, protocols, analyses, monitors, hardware mechanisms, or system designs
- Major design choices and the concrete problem each solves
- Hidden assumptions and whether they are realistic
- Which parts are engineering implementation vs. research contribution

### 4. 安全性 / 正确性分析

For security work:

- Threat model clarity
- What attacker can and cannot do
- Defense boundary
- Possible bypasses or adaptive attackers
- Whether side-channel / physical / fault / Rowhammer / speculative leakage is explicitly excluded; do not turn excluded attacks into follow-up download targets unless requested
- Strong assumptions
- Proof, empirical validation, exploit reproduction, or real vulnerability evidence
- Whether security claims are sufficiently supported
- Overclaims

For systems work:

- Correctness claims
- Proof, invariants, testing, model checking, differential testing, fuzzing, or deployment evidence
- Failure handling
- Crash consistency, concurrency, memory ordering, isolation, and resource-exhaustion edges
- Corner-case coverage

### 5. 实现细节

Extract implementation facts:

- Code size
- Language
- Modified components: kernel / compiler / runtime / hypervisor / hardware / firmware / browser / network stack / distributed system / other
- Platform dependencies
- Open source or artifact availability
- Reproducibility difficulty
- Hardest implementation part
- Whether implementation matches paper claims

### 6. 实验设计分析

Cover:

- Evaluation questions/RQs
- Benchmarks, datasets, workloads, scale, selection bias, target-scenario coverage
- Baselines, fairness, missing baselines, weakened baselines, ablations
- Metrics: latency, throughput, overhead, memory, precision/recall/F1, exploit success, bug count, false positives/negatives, scalability, etc.
- Whether metrics are appropriate or misleading
- Whether variance, confidence intervals, or statistical significance are reported
- Core results, key figures/tables, support for claims, negative results, unexplained anomalies

### 7. Novelty 分析

Judge novelty strictly:

- New problem, method, system, attack, defense, measurement, dataset/benchmark, formalization, or engineering integration
- Classify as one of: `incremental engineering`, `solid systems contribution`, `strong research novelty`, `potentially top-tier contribution`
- Explain the classification.

### 8. 局限性与可能漏洞

Act as a reviewer:

- Biggest limitation
- Fragile assumptions
- Insufficient experiments
- Missing baselines
- Claims with weak evidence
- Scalability issues
- Deployment barriers
- Security bypass/evasion/adaptive attacker, if applicable
- System failure modes, if applicable
- Whether the authors discuss limitations sufficiently
- Out-of-scope attack classes should be recorded as boundary conditions, not expanded into a separate attack survey by default

### 9. 和已有工作的关系

Analyze:

- Closest related work categories
- Essential differences
- Whether this is mostly a combination of known ideas
- Where it truly improves over prior work
- Missing related work comparisons
- Keywords/directions to search for follow-up work

### 10. 复现与再实现计划

Provide:

- Minimum reproducible target
- Required environment
- Required data/benchmarks
- Modules to implement
- Simplifications that are acceptable
- Simplifications that would break the core claim
- Acceptance criteria
- Demo plan
- Paper-level reproduction plan

### 11. 对后续研究的启发

Give at least 5 concrete directions, ranked by potential. For each:

- New problem
- Why the original paper does not solve it
- Technical route
- Required experiments
- Likely venues
- Risks

## SOTA README Addendum

When a README is for a paper/spec selected as a domain SOTA, foundational first paper, or SoK/survey anchor, append an extra section after item 11 inside the same `## Paper Review` block:

```markdown
### 12. SOTA README Addendum

- SOTA 定位: 基础/历史入口 | Academic SOTA | Spec/industry SOTA | SoK/survey anchor
- 标准化 / 发表状态: peer-reviewed venue, arXiv preprint, draft, not ratified, ratified, RFC, or vendor specification
- 对应小方向: the exact `domain.md` subdirection this README supports

#### 内容摘要
...

#### 研究背景
...

#### 解决方案
...

#### 实验结果
...

#### 文章评价
...
```

Rules for this addendum:

- `内容摘要`: give a high-level summary of the work or the authors' main position.
- `研究背景`: describe the research problem, threat model or system gap, and why it matters.
- `解决方案`: explain the mechanism/design and why the design choices are technically interesting.
- `实验结果`: summarize measured results and baselines; for specs, RFCs, and surveys, write `规范/Survey，无新实验` and summarize the evidence basis instead of inventing results.
- `文章评价`: state strengths, limitations, missing evidence, and whether the method has commercial deployment potential.
- Mark status explicitly. Draft specs and arXiv papers may be SOTA, but must be labeled `draft`, `not ratified`, or `arXiv` where applicable.
- If the evidence source is only metadata or a web page rather than `paper.pdf`, say so directly.

## SoK Citation Expansion Addendum

For SoK/survey/taxonomy anchor papers, append this section after the SOTA addendum when citation expansion was performed:

```markdown
### 13. SoK Citation Expansion

| Priority | Cited work | Role in SoK | Repo category | Local status | Next action |
|---|---|---|---|---|---|
| P0 | ... | taxonomy foundation / baseline / spec / SOTA | `reference/...` | existing / added / missing PDF / backlog | ... |
```

Rules for this addendum:

- Include only citations that are relevant to this repository's hardware-security survey scope.
- Mark whether each cited work already existed, was newly added, was only metadata-verified, or still needs a PDF/review.
- Use `P0` for must-read anchor evidence, `P1` for important supporting work, and `P2` for background or optional expansion.
- Keep the table factual; do not claim a cited paper has been analyzed unless its README has a `Paper Review` block or the current response includes the analysis.

## Updating README

Save the generated review to a temporary Markdown file, then run:

```bash
python3 .codex/skills/reference-paper-review/scripts/update_readme.py \
  reference/<category>/<paper>/README.md \
  /path/to/generated-review.md
```

The review file may include or omit the `## Paper Review` heading. The script normalizes it.

After updating, briefly report:

- README path updated
- Evidence source used (`paper.pdf`, source URL, or metadata only)
- PDF download and verification result when ingestion was performed
- Category and local path chosen
- SoK citation expansion status, including any P0/P1 backlog
- Any major fields marked `论文未说明` / `证据不足`
