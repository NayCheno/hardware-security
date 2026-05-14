# Arm Confidential Compute Architecture Specification

- BibTeX key: `arm_cca_spec`
- Category: `arm-confidential-computing`
- Authors: Arm Limited
- Year: 2025
- Source: https://developer.arm.com/documentation/den0125/latest
- PDF source: https://developer.arm.com/documentation/den0125/latest
- Local PDF: not available in this directory
- Download status: official Arm documentation page verified; local PDF unavailable in this repository. Rechecked on 2026-05-12; `den0125/latest` and `den0125/0400` returned access-denied HTML to automated download, and no stable public PDF endpoint was found.
- Survey lane: Arm/RISC-V confidential-computing defense
- Evidence class: E0 official architecture specification source, local source page only
- Evidence role: Spec/standard SOTA. Official Arm CCA source-page evidence with local PDF unavailable; use only public architecture concepts and avoid unavailable non-public details.
<!-- BEGIN PAPER REVIEW -->
## Paper Review
Canonical BibTeX key: `arm_cca_spec`. Evidence role: Spec/standard SOTA. Official Arm CCA source-page evidence with local PDF unavailable; use only public architecture concepts and avoid unavailable non-public details.

This README records the source/PDF availability above and should be treated as the local evidence-status record for Arm Confidential Compute Architecture Specification. When citing this reference in the survey正文, keep the claim within the stated evidence role and cite stronger primary or official sources for mechanism details outside this source's scope.
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `03-arm-cca-rme-rmm` - Arm CCA / RME / RMM 基础架构
- Paper key: `arm_cca_spec`
- Role: official specification SOTA
- Evidence base: README official source-page evidence; local PDF unavailable.
- Boundary: 本仓库无本地 PDF；只引用 README 已验证的官方 source-page 和公开概念，不写不可访问细节。

### 1. 完整题目 / 作者 / 会议

- 完整题目: Arm Confidential Compute Architecture Specification
- 作者: Arm Limited
- 会议/来源: Arm official architecture specification source, 2025
- Title evidence: reference/arm-confidential-computing/arm-cca-specification/README.md.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** CCA spec 的作用是把论文里的设计语言固定成官方架构语言。

- 动机: 研究论文会解释为什么，规范定义什么状态、接口和约束是架构语义。
- 工作: 公开描述 Realm/RME/GPT 等 CCA 概念和软件/硬件分工。
- 数据: spec 是官方文档源，不提供系统实验；本地 PDF 不可用，claim 必须保守。

**讲解稿:** 讲解时先把本页结论落到一句话: CCA spec 的作用是把论文里的设计语言固定成官方架构语言。第一步解释为什么需要这一页: 动机: 研究论文会解释为什么，规范定义什么状态、接口和约束是架构语义。第二步说明论文或规范实际做了什么: 工作: 公开描述 Realm/RME/GPT 等 CCA 概念和软件/硬件分工。第三步收束到证据边界: 数据: spec 是官方文档源，不提供系统实验；本地 PDF 不可用，claim 必须保守。引用时只把 Arm CCA spec README: official Arm documentation page verified; local PDF unavailable 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Arm CCA spec README: official Arm documentation page verified; local PDF unavailable.

- Proof object: cards - spec 用法: official terminology; architecture boundary; public concepts; no local PDF; no benchmark


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是 CCA 讨论容易混用论文、实现和规范；spec 页必须固定术语边界。

- Realm、RME、GPT、Root/RMM 等词在 slides 中必须按官方语义使用。
- 如果规范 PDF 不在本地，不能引用未读细节。
- 这页的价值是避免把论文推测写成标准事实。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是 CCA 讨论容易混用论文、实现和规范；spec 页必须固定术语边界。第一步解释为什么需要这一页: Realm、RME、GPT、Root/RMM 等词在 slides 中必须按官方语义使用。第二步说明论文或规范实际做了什么: 如果规范 PDF 不在本地，不能引用未读细节。第三步收束到证据边界: 这页的价值是避免把论文推测写成标准事实。引用时只把 Arm CCA spec README evidence class E0 official architecture source 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Arm CCA spec README evidence class E0 official architecture source.

- Proof object: matrix - 规范边界: 官方术语 = 可以引用; 未本地验证 PDF 细节 = 不引用; 性能 = 不提供; 产品行为 = 需 vendor implementation source


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: spec 是规则书，不是实验论文；它告诉我们哪些 CCA claim 可以被官方架构支撑。

- Spec 强于论文的是规范权威性。
- Spec 弱于系统论文的是没有 workload、实现开销或 deployment 评估。
- 在 PPT 中它应承担“术语校准”和“边界校准”的角色。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: spec 是规则书，不是实验论文；它告诉我们哪些 CCA claim 可以被官方架构支撑。第一步解释为什么需要这一页: Spec 强于论文的是规范权威性。第二步说明论文或规范实际做了什么: Spec 弱于系统论文的是没有 workload、实现开销或 deployment 评估。第三步收束到证据边界: 在 PPT 中它应承担“术语校准”和“边界校准”的角色。引用时只把 Arm CCA spec README 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Arm CCA spec README.

- Proof object: flow - spec 证据链: official page -> public architecture concept -> slide terminology -> claim boundary -> implementation paper for details


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览按公开 CCA 概念绘制: Realm payload、RMM/Root、Normal host、GPT/GPC 和 attestation。

- Host 继续管理资源但不读取 Realm 内容。
- RMM/Root 管 Realm lifecycle 和 granule state。
- GPT/GPC 在硬件路径执行访问控制。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览按公开 CCA 概念绘制: Realm payload、RMM/Root、Normal host、GPT/GPC 和 attestation。第一步解释为什么需要这一页: Host 继续管理资源但不读取 Realm 内容。第二步说明论文或规范实际做了什么: RMM/Root 管 Realm lifecycle 和 granule state。第三步收束到证据边界: GPT/GPC 在硬件路径执行访问控制。引用时只把 Arm CCA public architecture concepts; Li 2022 Figure 1 as local detailed backup 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Arm CCA public architecture concepts; Li 2022 Figure 1 as local detailed backup.

- Proof object: matrix - CCA spec 公开对象: Realm = confidential payload; RMM/Root = lifecycle authority; Normal host = untrusted manager; GPT/GPC = granule access enforcement; Attestation = evidence to verifier


### 6. 核心方法拆解

#### 方法 1: Realm / REC / Granule 术语固定

**Claim:** Spec 的第一用途是把 slides 里的对象名标准化。

- Realm 是保护域，不等同于 TrustZone secure world。
- REC 是 Realm execution context，负责运行 vCPU-like state。
- Granule 是内存 ownership 和状态转换的基本单位。

**讲解稿:** 讲解时先把本页结论落到一句话: Spec 的第一用途是把 slides 里的对象名标准化。第一步解释为什么需要这一页: Realm 是保护域，不等同于 TrustZone secure world。第二步说明论文或规范实际做了什么: REC 是 Realm execution context，负责运行 vCPU-like state。第三步收束到证据边界: Granule 是内存 ownership 和状态转换的基本单位。引用时只把 Arm CCA spec README; Li 2022 local PDF for concept explanation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Arm CCA spec README; Li 2022 local PDF for concept explanation.

- Proof object: cards - terms: Realm; REC; Granule; RME; GPT; RMM

#### 方法 2: 访问控制语义

**Claim:** Spec 让我们知道访问控制不是软件约定，而是架构状态和检查。

- Granule state 决定哪个 security state 可以访问内存。
- Host 的管理请求必须经过 RMM/Monitor 的合法状态转换。
- 这解释了为什么 CCA deployment 论文都围绕 granule、page table 和 RMM 接口做设计。

**讲解稿:** 讲解时先把本页结论落到一句话: Spec 让我们知道访问控制不是软件约定，而是架构状态和检查。第一步解释为什么需要这一页: Granule state 决定哪个 security state 可以访问内存。第二步说明论文或规范实际做了什么: Host 的管理请求必须经过 RMM/Monitor 的合法状态转换。第三步收束到证据边界: 这解释了为什么 CCA deployment 论文都围绕 granule、page table 和 RMM 接口做设计。引用时只把 Arm CCA spec README; Li 2022 Table 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Arm CCA spec README; Li 2022 Table 1.

- Proof object: flow - access semantics: granule state -> request transition -> RMM validation -> hardware check -> allowed/denied access

#### 方法 3: Claim Boundary 管理

**Claim:** 因为本地没有 spec PDF，所有规范页必须显式写 evidence boundary。

- 可以说“官方 CCA source-page 已验证”。
- 不能说“本文本地验证了某条具体 DEN0125 表格”。
- 具体接口细节尽量回 Li 2022、RMM README 或本地可读论文。

**讲解稿:** 讲解时先把本页结论落到一句话: 因为本地没有 spec PDF，所有规范页必须显式写 evidence boundary。第一步解释为什么需要这一页: 可以说“官方 CCA source-page 已验证”。第二步说明论文或规范实际做了什么: 不能说“本文本地验证了某条具体 DEN0125 表格”。第三步收束到证据边界: 具体接口细节尽量回 Li 2022、RMM README 或本地可读论文。引用时只把 Arm CCA spec README download status 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Arm CCA spec README download status.

- Proof object: matrix - 引用规则: 可写 = public CCA concepts; 谨慎 = detailed state machine; 不可写 = unverified private tables; 替代 = local Li 2022/RMM sources


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** 实验环境页写成“官方规范源，无本地 PDF”: 这是强规范证据，但不是可渲染论文证据。

- 来源: Arm DEN0125 official documentation page。
- 本地状态: README 记录 PDF download unavailable/access-denied。
- 处理: 只用公开概念，不用 unavailable details。

**讲解稿:** 讲解时先把本页结论落到一句话: 实验环境页写成“官方规范源，无本地 PDF”: 这是强规范证据，但不是可渲染论文证据。第一步解释为什么需要这一页: 来源: Arm DEN0125 official documentation page。第二步说明论文或规范实际做了什么: 本地状态: README 记录 PDF download unavailable/access-denied。第三步收束到证据边界: 处理: 只用公开概念，不用 unavailable details。引用时只把 Arm CCA specification README download status 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Arm CCA specification README download status.

- Proof object: matrix - 证据状态: 证据等级 = E0 official source; 本地 PDF = unavailable; 实验 = 无; 使用 = 术语和规范边界


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能页应明确: 官方架构规范不提供性能数字。

- 任何 CCA overhead 都必须来自具体实现论文或产品文档。
- Spec 可说明可能影响性能的机制类别: granule transition、world switch、attestation、RMM call。
- 但不能给出 benchmark 结论。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能页应明确: 官方架构规范不提供性能数字。第一步解释为什么需要这一页: 任何 CCA overhead 都必须来自具体实现论文或产品文档。第二步说明论文或规范实际做了什么: Spec 可说明可能影响性能的机制类别: granule transition、world switch、attestation、RMM call。第三步收束到证据边界: 但不能给出 benchmark 结论。引用时只把 Arm CCA spec README; no local benchmark 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Arm CCA spec README; no local benchmark.

- Proof object: bars - claim strength: 规范权威 高; 本地 PDF 无; 性能数据 无; 术语校准 高


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: CCA spec 是 03 的权威边界材料，但它必须和本地论文一起使用。

- 优势: 官方来源，适合校准术语和架构边界。
- 局限: 本地 PDF 不可用，不能做细节页的唯一证据。
- 商业化潜力: 代表 Arm confidential computing 标准化方向，但真实落地依赖 silicon、firmware、RMM 和云软件栈。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: CCA spec 是 03 的权威边界材料，但它必须和本地论文一起使用。第一步解释为什么需要这一页: 优势: 官方来源，适合校准术语和架构边界。第二步说明论文或规范实际做了什么: 局限: 本地 PDF 不可用，不能做细节页的唯一证据。第三步收束到证据边界: 商业化潜力: 代表 Arm confidential computing 标准化方向，但真实落地依赖 silicon、firmware、RMM 和云软件栈。引用时只把 Arm CCA spec README 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Arm CCA spec README.

- Proof object: matrix - 评价: 优势 = official source; 局限 = local PDF unavailable; 商业化 = Arm CCA ecosystem; 本报告角色 = 术语和边界锚点


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
