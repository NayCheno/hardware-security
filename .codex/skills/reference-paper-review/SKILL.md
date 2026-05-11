---
name: reference-paper-review
description: Deep Chinese review workflow for computer systems, security, architecture, OS, network, distributed systems, hardware, compiler, and software-engineering papers stored under a repository `reference/` library. Use when Codex needs to read a paper PDF/link/title, produce a critical reviewer-style paper analysis, or write/update that analysis into the paper directory's `README.md`.
---

# Reference Paper Review

## Purpose

Produce a critical, evidence-based paper reading note for papers under `reference/<category>/<paper>/`. Treat the output as a reusable research note, not a generic abstract.

Default output language is Chinese. Keep claims grounded in the paper. If the paper does not specify something, write `论文未说明` or `证据不足`; do not fill gaps with guesses.

## Workflow

1. Locate the paper directory, usually `reference/<category>/<paper>/`.
2. Read `README.md` first for BibTeX key, title, source URL, category, and download status.
3. Prefer `paper.pdf` when present. If no PDF exists, use the source links in README or user-provided link/title. Clearly mark weaker evidence when only metadata or a web page is available.
4. Extract enough paper text to support the review. When possible, cite section, page, figure, or table locations.
5. Write the analysis using the schema below.
6. Insert or replace the analysis in the paper `README.md` using `scripts/update_readme.py`.

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
- Any major fields marked `论文未说明` / `证据不足`
