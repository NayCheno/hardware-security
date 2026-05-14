# Research Slide Report Contract

Use this reference when generating a Chinese academic PPT slide report. Keep the final output concise per slide, but preserve every required field.

## 1. Report Positioning

Start with:

```markdown
## 0. 报告标题与定位
- 报告标题：
- 副标题：
- 目标读者：
- 报告核心问题：
- 报告总页数建议：
```

Then produce:

```markdown
## 1. 领域全局框架
- 背景页：
- 技术瓶颈页：
- 分类总览页：
- 技术路线总览页：
```

The field frame must answer:

- 该领域解决的核心问题是什么？
- 为什么重要？
- 传统方法遇到哪些瓶颈？
- 可以拆成哪些 3-6 个互补技术维度？
- 每个维度内部的技术演进逻辑是什么？

## 2. Dimension Template

For each technical dimension:

```markdown
### 维度 N：{维度名称，中英可并列}
- 核心痛点：
- 为什么传统方法解决不好：
- 技术演进逻辑：
  1. 基石方法：
  2. 第一次关键改进：
  3. 第二次关键改进：
  4. 最新范式变化：
- 该维度精选论文：
  - 开创性论文：
  - SOTA 论文 1：
  - SOTA 论文 2：
- 选择这三篇的理由：
```

Selection table:

```markdown
| 方向 | 论文 | 定位 | 选择理由 | 相比前作的关键进步 | 局限 |
|---|---|---|---|---|---|
```

Global selection table:

```markdown
## 2. 论文选择总表

| 技术维度 | 小方向 | 开创性论文 | SOTA 1 | SOTA 2 | 选择理由 |
|---|---|---|---|---|---|
```

## 3. Per-Slide Schema

Every slide must use:

```markdown
### Slide {编号}: {标题}

**核心信息一句话：**
...

**页面正文：**
- ...
- ...
- ...

**推荐图示/版式：**
...

**演讲备注：**
...

**引用来源：**
...
```

When a slide includes numbers, cite the exact paper section/table/figure/page if known.

## 4. Per-Paper Deep-Dive Slides

Create 6-10 slides per selected paper. Expand to 10-12 only for unusually important papers.

### Slide A: 论文标题页

Must include:

- Paper title.
- Authors and institutions when available.
- Venue/year.
- Position in the direction: `开创性工作`, `第一代方法`, `SOTA`, `Benchmark`, `LLM-driven`, `Static Analysis`, `Fuzzing-based`, etc.
- One-sentence contribution.

Layout: left side paper title and venue; right side positioning tags.

### Slide B: 内容摘要

```markdown
### 内容摘要
- 关键动机：
  - ...
- 本文工作：
  1. ...
  2. ...
  3. ...
- 核心技术贡献：
  - ...
- 关键数据：
  - ...
- 一句话总结：
  - ...
```

### Slide C: 研究背景

Explain:

- What research problem the paper solves.
- Why prior methods fail.
- Root cause: complex data flow, source/sink identification, poor generalization, annotation cost, missing benchmark, instrumentation limits, cross-language/process/modal gaps, evaluation bias, etc.
- Why the problem matters in real systems.

### Slide D: 核心洞察

Use 2-4 insights:

```markdown
- Insight 1：一句话概括
  - 具体解释：
  - 为什么能解决前面的问题：
  - 和前作的区别：
```

End with a technical conversion sentence:

```markdown
本文将 {原问题} 转化为 {新问题/新表示/新流程}，从而避免了 {旧瓶颈}，并提升了 {关键能力}。
```

### Slide E: 系统架构/方法总览

Cover:

1. Input.
2. Preprocessing.
3. Core modules.
4. Information flow between modules.
5. Output.
6. How detection/generation/verification/evaluation is completed.

Recommend a flowchart, architecture diagram, source-to-sink graph, agent workflow, benchmark construction diagram, taxonomy tree, or comparison matrix.

### Slides F-H: 核心技术模块

Each module slide covers exactly one module:

```markdown
### 核心模块 {编号}：{模块名}
- 设计目标：
- 输入：
- 方法：
  1. ...
  2. ...
  3. ...
- 输出：
- 技术妙处：
- 解决的问题：
- 可能失败场景：
```

### Slide I: 实验结果

Use concrete evidence. Include:

- Dataset/benchmark/workload scale.
- Baselines.
- Metrics.
- Main result.
- Ablations.
- Efficiency.
- Generalization.
- Real-world cases.
- Human validation/statistical evidence if reported.

Preferred table:

```markdown
### 实验设置
- 数据集：
- Baseline：
- 指标：
- 环境：

### 关键结果
1. 效果：
2. 效率：
3. 泛化：
4. 真实案例：
5. 消融结论：

| 方法 | 数据集 | 关键指标 | 结果 | 相比基线提升 |
|---|---|---|---|---|
```

### Slide J: 文章评价

```markdown
### 文章评价

#### 设计优势
- ...
- ...
- ...

#### 局限性分析
1. 技术假设限制：
2. 数据/实验限制：
3. 工程复杂度：
4. 可能误报/漏报来源：
5. 泛化风险：

#### 商业化潜力
- 适合落地场景：
- 不适合落地场景：
- 工程部署难点：
- 与现有产品/流程结合方式：
- 商业价值判断：高 / 中 / 低；理由：

#### 一句话评价
> ...
```

## 5. Dimension Summary Pages

After each dimension:

### Summary Page 1: 技术演进图

Cover:

- Foundational paper: what it solved.
- SOTA 1: which defect it fixed.
- SOTA 2: what it further improved.
- Remaining unsolved issues.

Recommended visual: three-stage evolution arrow, comparison matrix, capability radar, or `痛点 -> 方法 -> 局限 -> 下一代方向` chain.

### Summary Page 2: 方法对比表

```markdown
| 论文 | 核心思想 | 技术范式 | 解决的问题 | 实验优势 | 主要局限 | 商业落地潜力 |
|---|---|---|---|---|---|---|
```

End with:

- 当前最强方法是什么。
- 最适合商业落地的方法是什么。
- 未来研究空白是什么。

## 6. Final Summary Pages

Include four final summary groups:

### 全局技术路线总结

Summarize all dimensions and their relationships in one route map.

### 方法成熟度与商业化判断

```markdown
| 技术方向 | 学术成熟度 | 工程成熟度 | 商业落地潜力 | 部署难点 | 推荐优先级 |
|---|---|---|---|---|---|
```

Commercial judgment must specify whether the direction fits:

- Cloud platform.
- Vendor internal tooling.
- Security assessment service.
- Human expert-in-the-loop workflow.
- Expensive models, real devices, simulation, private data, or manual labels.

### 未来研究方向

Give at least five directions. For each:

```markdown
- 方向：
- 为什么现有方法解决不了：
- 需要的新技术：
- 潜在应用价值：
```

### 最终 Takeaway

```markdown
- Takeaway 1：
- Takeaway 2：
- Takeaway 3：
```

## 7. Style Rules

- Use Chinese academic-report style.
- One slide, one core claim.
- Avoid abstract praise; explain mechanisms and evidence.
- Do not turn the report into a paper abstract collection.
- Use the narrative chain: `核心痛点 -> 技术洞察 -> 方法设计 -> 实验验证 -> 评价落地`.
- For very large reports, keep every required field but write compact bullets and continue by sections.

## 8. Final Self-Check

Before delivering, check:

- 是否已经建立清晰的领域分类？
- 每个方向是否选择了 3 篇最值得讲的论文？
- 是否区分了开创性论文和 SOTA 论文？
- 每篇论文是否包含摘要、背景、洞察、方法、实验、评价？
- 是否解释了方法逻辑和技术妙处？
- 是否分析了优势、不足和商业落地潜力？
- 是否给出了技术演进关系？
- 是否包含图表、流程图、架构图等 PPT 视觉设计建议？
- 是否所有关键数字都有来源或标注不确定？
- 是否避免编造？
- 是否避免可直接用于未授权攻击的细节？
