# Remote ATtestation procedureS (RATS) Architecture

- BibTeX key: `rats_rfc`
- Category: `attestation`
- Authors: Henk Birkholz, Dave Thaler, Michael Richardson, Ned Smith, and Wei Pan
- Year: 2023
- Source: https://www.rfc-editor.org/info/rfc9334
- PDF source: https://www.rfc-editor.org/rfc/rfc9334.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified
- Evidence role: Spec/standard SOTA. Official RFC 9334 architecture and terminology source for RATS roles and messages; not a platform mechanism or token-format implementation.

<!-- BEGIN PAPER REVIEW -->
## Paper Review
RFC 9334 defines the Remote ATtestation procedureS architecture. It is not a platform mechanism, a token format, or a confidential-computing implementation. Its role in this survey is to provide standard terminology for attesters, relying parties, verifiers, evidence, endorsements, reference values, attestation results, appraisal policies, freshness, and common topological patterns.

Use this source for attestation architecture and verifier-policy vocabulary. Use `eat_rfc` for Entity Attestation Token encoding, Arm/RISC-V specifications for platform-specific evidence semantics, and peer-reviewed system papers for implementation and evaluation claims.
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `06-attestation-boot-lifecycle` - Attestation、Boot、Lifecycle
- Paper key: `rats_rfc`
- Role: standard attestation architecture
- Evidence base: RATS architecture local PDF; Figure 1 conceptual data flow; Table 1 events over time.
- Boundary: 架构 RFC 不定义某个 TEE 的具体 claim 内容、签名格式或性能。

### 1. 完整题目 / 作者 / 会议

- 完整题目: Remote Attestation Procedures (RATS) Architecture
- 作者: Henk Birkholz, Dave Thaler, Michael Richardson, Ned Smith, Wei Pan
- 会议/来源: IETF RFC 9334 / RATS Architecture, 2023
- Title evidence: RATS RFC title page and README metadata.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** RATS 的贡献是把不同平台的 attestation 统一成 Attester、Verifier、Relying Party 和 Evidence/Appraisal 语言。

- 动机: TPM、TEE、device、cloud 都需要证明状态，但协议和 claim 格式不同。
- 工作: 定义 Attester、Verifier、Relying Party、Endorser、Reference Value Provider 等角色。
- 数据: 这是 RFC architecture document，无实验；Figure 1 是核心数据流。

**讲解稿:** 讲解时先把本页结论落到一句话: RATS 的贡献是把不同平台的 attestation 统一成 Attester、Verifier、Relying Party 和 Evidence/Appraisal 语言。第一步解释为什么需要这一页: 动机: TPM、TEE、device、cloud 都需要证明状态，但协议和 claim 格式不同。第二步说明论文或规范实际做了什么: 工作: 定义 Attester、Verifier、Relying Party、Endorser、Reference Value Provider 等角色。第三步收束到证据边界: 数据: 这是 RFC architecture document，无实验；Figure 1 是核心数据流。引用时只把 RATS Figure 1; Table 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RATS Figure 1; Table 1.

- Proof object: flow - RATS data flow: Attester collects claims -> Evidence conveyed -> Verifier appraises -> Endorsements/reference values used -> Attestation result -> Relying Party decision


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是 attestation 经常被误解为单个签名报告；RATS 强调 appraisal 需要多方证据。

- Evidence 只说明 attester 声称什么，不自动等于可信。
- Verifier 还要拿 endorsements、reference values 和 appraisal policy 判断。
- Relying Party 根据 attestation result 决定是否授予访问。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是 attestation 经常被误解为单个签名报告；RATS 强调 appraisal 需要多方证据。第一步解释为什么需要这一页: Evidence 只说明 attester 声称什么，不自动等于可信。第二步说明论文或规范实际做了什么: Verifier 还要拿 endorsements、reference values 和 appraisal policy 判断。第三步收束到证据边界: Relying Party 根据 attestation result 决定是否授予访问。引用时只把 RATS terminology and Figure 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RATS terminology and Figure 1.

- Proof object: matrix - RATS 角色: Attester = produces Evidence; Verifier = appraises claims; Relying Party = uses result; Endorser = endorses keys/components; Reference Provider = known-good values


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: trust decision 不在 attester，而在 verifier 的 appraisal policy。

- 同一份 Evidence 对不同 relying party 可能有不同结论。
- Endorsements 证明 evidence signing key 或 component 来源。
- Reference values 证明 measured state 是否属于可接受基线。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: trust decision 不在 attester，而在 verifier 的 appraisal policy。第一步解释为什么需要这一页: 同一份 Evidence 对不同 relying party 可能有不同结论。第二步说明论文或规范实际做了什么: Endorsements 证明 evidence signing key 或 component 来源。第三步收束到证据边界: Reference values 证明 measured state 是否属于可接受基线。引用时只把 RATS appraisal model 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RATS appraisal model.

- Proof object: flow - appraisal: Evidence -> Endorsements -> Reference Values -> Policy -> Attestation Result -> Access Decision


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: RATS 把证明过程拆成 evidence generation、conveyance、appraisal 和 result use。

- Attester 可是 device、TEE、CVM、accelerator 或 service。
- Verifier 可以本地或远端；passport/background-check model 只是部署方式。
- RATS 中立于 CPU 架构、claim 内容和传输协议。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: RATS 把证明过程拆成 evidence generation、conveyance、appraisal 和 result use。第一步解释为什么需要这一页: Attester 可是 device、TEE、CVM、accelerator 或 service。第二步说明论文或规范实际做了什么: Verifier 可以本地或远端；passport/background-check model 只是部署方式。第三步收束到证据边界: RATS 中立于 CPU 架构、claim 内容和传输协议。引用时只把 RATS Figure 1 and architecture sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RATS Figure 1 and architecture sections.

- Proof object: matrix - RATS 对象: Claims = state statements; Evidence = signed/secured claims; Endorsements = manufacturer/vendor statements; Reference Values = known-good measurements; Attestation Result = verifier output


### 6. 核心方法拆解

#### 方法 1: Conceptual Data Flow

**Claim:** Figure 1 是 RATS 最重要的一页: 证明不是二方对话，而是多角色数据流。

- Attester 产生 Evidence。
- Verifier 结合 endorsements/reference values 做 appraisal。
- Relying Party 消费 result。

**讲解稿:** 讲解时先把本页结论落到一句话: Figure 1 是 RATS 最重要的一页: 证明不是二方对话，而是多角色数据流。第一步解释为什么需要这一页: Attester 产生 Evidence。第二步说明论文或规范实际做了什么: Verifier 结合 endorsements/reference values 做 appraisal。第三步收束到证据边界: Relying Party 消费 result。引用时只把 RATS Figure 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RATS Figure 1.

- Proof object: flow - Figure 1: Attester -> Evidence -> Verifier -> Appraisal Inputs -> Attestation Result -> Relying Party

#### 方法 2: Passport vs Background Check

**Claim:** RATS 支持不同部署模型，取决于 verifier 是否在线参与 relying-party 交互。

- Passport: attester 先拿 result，再给 relying party。
- Background check: relying party 把 evidence 转给 verifier。
- 两者影响隐私、延迟和可缓存性。

**讲解稿:** 讲解时先把本页结论落到一句话: RATS 支持不同部署模型，取决于 verifier 是否在线参与 relying-party 交互。第一步解释为什么需要这一页: Passport: attester 先拿 result，再给 relying party。第二步说明论文或规范实际做了什么: Background check: relying party 把 evidence 转给 verifier。第三步收束到证据边界: 两者影响隐私、延迟和可缓存性。引用时只把 RATS architecture deployment models 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RATS architecture deployment models.

- Proof object: matrix - 模型: Passport = cached attestation result; Background = online verifier; Trade-off = latency/privacy/freshness; PPT 用法 = lifecycle design choices

#### 方法 3: Evidence Freshness / Lifecycle

**Claim:** RATS 关注事件随时间变化，适合连接 boot、runtime 和 device lifecycle。

- Boot measurement 只是初始状态。
- 配置更新、固件升级、device assignment 都可能需要新 evidence。
- Table 1 说明 events over time 的重要性。

**讲解稿:** 讲解时先把本页结论落到一句话: RATS 关注事件随时间变化，适合连接 boot、runtime 和 device lifecycle。第一步解释为什么需要这一页: Boot measurement 只是初始状态。第二步说明论文或规范实际做了什么: 配置更新、固件升级、device assignment 都可能需要新 evidence。第三步收束到证据边界: Table 1 说明 events over time 的重要性。引用时只把 RATS Table 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RATS Table 1.

- Proof object: cards - lifecycle events: boot; measurement; configuration; update; assignment; appraisal


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** RATS 是标准架构文档，无新实验；它是 06 的语言和模型锚点。

- 证据源: RFC PDF，本地验证。
- 核心证据: Figure 1 conceptual data flow, Table 1 events over time。
- 边界: 不规定 Arm CCA/CoVE/EAT 具体字段，也不测性能。

**讲解稿:** 讲解时先把本页结论落到一句话: RATS 是标准架构文档，无新实验；它是 06 的语言和模型锚点。第一步解释为什么需要这一页: 证据源: RFC PDF，本地验证。第二步说明论文或规范实际做了什么: 核心证据: Figure 1 conceptual data flow, Table 1 events over time。第三步收束到证据边界: 边界: 不规定 Arm CCA/CoVE/EAT 具体字段，也不测性能。引用时只把 RATS Figure 1; Table 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RATS Figure 1; Table 1.

- Proof object: matrix - 证据边界: 可支撑 = attestation roles; 不能支撑 = platform security proof; 实验 = 无; 用法 = terminology and lifecycle


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能页应写成无新实验: RATS 不给 latency/throughput，只给架构模型。

- 任何 attestation latency 来自具体协议、crypto、network 和 verifier deployment。
- RATS 可解释 latency 会受 passport/background 模型影响。
- 不能给出 benchmark。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能页应写成无新实验: RATS 不给 latency/throughput，只给架构模型。第一步解释为什么需要这一页: 任何 attestation latency 来自具体协议、crypto、network 和 verifier deployment。第二步说明论文或规范实际做了什么: RATS 可解释 latency 会受 passport/background 模型影响。第三步收束到证据边界: 不能给出 benchmark。引用时只把 RATS architecture scope 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RATS architecture scope.

- Proof object: bars - claim strength: 架构语言 高; 性能数据 无; 平台中立 高; 具体 claim 字段 低


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: RATS 是所有后续 TEE/Device attestation slides 的共同词典。

- 优势: 角色、对象、流程清晰，适合跨 Arm/RISC-V/device 统一叙事。
- 局限: 抽象层高，不告诉你某个 evidence 是否安全。
- 商业化潜力: 是供应链、confidential VM、device onboarding 和 zero trust 的基础架构语言。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: RATS 是所有后续 TEE/Device attestation slides 的共同词典。第一步解释为什么需要这一页: 优势: 角色、对象、流程清晰，适合跨 Arm/RISC-V/device 统一叙事。第二步说明论文或规范实际做了什么: 局限: 抽象层高，不告诉你某个 evidence 是否安全。第三步收束到证据边界: 商业化潜力: 是供应链、confidential VM、device onboarding 和 zero trust 的基础架构语言。引用时只把 RATS conclusion; README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RATS conclusion; README evaluation.

- Proof object: matrix - 评价: 优势 = standard vocabulary; 局限 = not mechanism proof; 商业化 = zero-trust attestation; 本方向角色 = main architecture


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
