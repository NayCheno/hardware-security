# Realm Management Monitor Specification

- BibTeX key: `arm_rmm_spec`
- Category: `arm-confidential-computing`
- Authors: Arm Limited
- Year: 2025
- Source: https://developer.arm.com/documentation/den0137/latest/
- PDF source: https://developer.arm.com/-/cdn-downloads/permalink/PDF/Architectures/DEN0137_1.0-rel0-rc1_rmm-arch_external.pdf
- Local PDF: not available in this directory
- Download status: official Arm documentation page and public DEN0137 CDN URL verified; local PDF unavailable in this repository. Rechecked on 2026-05-12; direct CDN download returned access-denied HTML to automated download.
- Survey lane: Arm/RISC-V confidential-computing defense
- Evidence class: E0 official architecture specification source, local source page only
- Evidence role: Spec/standard SOTA. Official Arm RMM source-page evidence with local PDF unavailable; use only public RMM/RMI/RSI lifecycle concepts and avoid unavailable non-public details.
<!-- BEGIN PAPER REVIEW -->
## Paper Review
Canonical BibTeX key: `arm_rmm_spec`. Evidence role: Spec/standard SOTA. Official Arm RMM source-page evidence with local PDF unavailable; use only public RMM/RMI/RSI lifecycle concepts and avoid unavailable non-public details.

This README records the source/PDF availability above and should be treated as the local evidence-status record for Realm Management Monitor Specification. When citing this reference in the survey正文, keep the claim within the stated evidence role and cite stronger primary or official sources for mechanism details outside this source's scope.
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `03-arm-cca-rme-rmm` - Arm CCA / RME / RMM 基础架构
- Paper key: `arm_rmm_spec`
- Role: official RMM/RMI/RSI lifecycle source
- Evidence base: RMM spec README official source-page/CDN URL verified; local PDF unavailable.
- Boundary: 本地 PDF 不可用；只引用公开 lifecycle 概念和 README 中记录的 source status。

### 1. 完整题目 / 作者 / 会议

- 完整题目: Realm Management Monitor Specification
- 作者: Arm Limited
- 会议/来源: Arm official RMM architecture specification source, 2025
- Title evidence: reference/arm-confidential-computing/realm-management-monitor-specification/README.md.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** RMM spec 的价值是把 CCA 中最关键的软件 TCB 讲清楚: 谁创建 Realm，谁运行 REC，谁改变 granule state。

- 动机: Realm 需要 lifecycle manager，否则 untrusted host 可通过创建/销毁/调度路径影响安全边界。
- 工作: 规范 RMI/RSI、Realm/REC/granule 管理和 monitor 分工。
- 数据: 官方规范源，无新实验；本地 PDF 未保存。

**讲解稿:** 讲解时先把本页结论落到一句话: RMM spec 的价值是把 CCA 中最关键的软件 TCB 讲清楚: 谁创建 Realm，谁运行 REC，谁改变 granule state。第一步解释为什么需要这一页: 动机: Realm 需要 lifecycle manager，否则 untrusted host 可通过创建/销毁/调度路径影响安全边界。第二步说明论文或规范实际做了什么: 工作: 规范 RMI/RSI、Realm/REC/granule 管理和 monitor 分工。第三步收束到证据边界: 数据: 官方规范源，无新实验；本地 PDF 未保存。引用时只把 RMM spec README; Li 2022 Table 2 as local interface context 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RMM spec README; Li 2022 Table 2 as local interface context.

- Proof object: flow - RMM 生命周期: create Realm -> delegate granules -> create REC -> run Realm -> attest/measure -> destroy and undelegate


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景是 CCA 的硬件隔离必须有一个小而受控的管理者，否则 host 仍可通过生命周期操作绕过安全目标。

- Host 需要请求创建/运行 Realm，但不应直接操控 Realm 私有状态。
- Realm payload 需要某些服务，但也不能信任 host。
- RMI/RSI 把这两类请求分开，是 RMM TCB 可审计的基础。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景是 CCA 的硬件隔离必须有一个小而受控的管理者，否则 host 仍可通过生命周期操作绕过安全目标。第一步解释为什么需要这一页: Host 需要请求创建/运行 Realm，但不应直接操控 Realm 私有状态。第二步说明论文或规范实际做了什么: Realm payload 需要某些服务，但也不能信任 host。第三步收束到证据边界: RMI/RSI 把这两类请求分开，是 RMM TCB 可审计的基础。引用时只把 RMM spec README; Li 2022 RMM discussion 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RMM spec README; Li 2022 RMM discussion.

- Proof object: matrix - RMM 要隔离的接口: RMI = host management side; RSI = Realm service side; Granule = ownership state; REC = execution context; Measurement = attestation state


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: RMM 是 CCA 安全边界的状态机；安全性来自合法状态转换，而不是单个函数调用。

- Realm 创建前后，granule、REC、page tables 和 measurements 都有严格状态。
- Host 只能通过 RMI 请求，RMM 检查是否满足前置条件。
- Realm 通过 RSI 获取服务和 evidence，避免直接信任 normal world。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: RMM 是 CCA 安全边界的状态机；安全性来自合法状态转换，而不是单个函数调用。第一步解释为什么需要这一页: Realm 创建前后，granule、REC、page tables 和 measurements 都有严格状态。第二步说明论文或规范实际做了什么: Host 只能通过 RMI 请求，RMM 检查是否满足前置条件。第三步收束到证据边界: Realm 通过 RSI 获取服务和 evidence，避免直接信任 normal world。引用时只把 RMM spec README; Li 2022 Figure 2/Table 2 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RMM spec README; Li 2022 Figure 2/Table 2.

- Proof object: flow - state-machine thinking: host RMI call -> check precondition -> update Realm/granule state -> run REC -> Realm RSI call -> attestation/evidence


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: RMM 夹在 untrusted host 和 Realm 之间，向两边暴露不同接口。

- Host side: RMI for creation, memory delegation, REC run and teardown。
- Realm side: RSI for Realm-visible services and reports。
- 硬件 side: GPT/GPC enforce final access decisions。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: RMM 夹在 untrusted host 和 Realm 之间，向两边暴露不同接口。第一步解释为什么需要这一页: Host side: RMI for creation, memory delegation, REC run and teardown。第二步说明论文或规范实际做了什么: Realm side: RSI for Realm-visible services and reports。第三步收束到证据边界: 硬件 side: GPT/GPC enforce final access decisions。引用时只把 RMM spec README; Li 2022 Table 2 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RMM spec README; Li 2022 Table 2.

- Proof object: matrix - RMM 三面接口: Host-facing = RMI; Realm-facing = RSI; Hardware-facing = GPT/GPC state; Verifier-facing = attestation evidence; TCB = RMM must stay small


### 6. 核心方法拆解

#### 方法 1: Realm Creation / Destruction

**Claim:** RMM 让 host 管生命周期，但 host 不能越过状态机直接读写 Realm。

- 创建 Realm 需要初始化 metadata、measurement 和 granule ownership。
- 销毁 Realm 需要清理私有 granules，避免数据残留。
- 这些步骤是后续 container/accelerator 论文必须兼容的底座。

**讲解稿:** 讲解时先把本页结论落到一句话: RMM 让 host 管生命周期，但 host 不能越过状态机直接读写 Realm。第一步解释为什么需要这一页: 创建 Realm 需要初始化 metadata、measurement 和 granule ownership。第二步说明论文或规范实际做了什么: 销毁 Realm 需要清理私有 granules，避免数据残留。第三步收束到证据边界: 这些步骤是后续 container/accelerator 论文必须兼容的底座。引用时只把 RMM spec README lifecycle concepts 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RMM spec README lifecycle concepts.

- Proof object: flow - Realm lifecycle: allocate metadata -> delegate granules -> measure initial state -> activate Realm -> run REC -> teardown and scrub

#### 方法 2: REC Run 与 Scheduling

**Claim:** Host 可以调度 Realm，但 REC state 的安全保存/恢复由 RMM 边界控制。

- 这保留了云平台调度能力。
- 同时防止 hypervisor 直接读取 confidential register/memory state。
- Interrupt、device 和 scheduling 论文都在这个接口附近扩展。

**讲解稿:** 讲解时先把本页结论落到一句话: Host 可以调度 Realm，但 REC state 的安全保存/恢复由 RMM 边界控制。第一步解释为什么需要这一页: 这保留了云平台调度能力。第二步说明论文或规范实际做了什么: 同时防止 hypervisor 直接读取 confidential register/memory state。第三步收束到证据边界: Interrupt、device 和 scheduling 论文都在这个接口附近扩展。引用时只把 RMM spec README; Li 2022 RMI/REC discussion 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RMM spec README; Li 2022 RMI/REC discussion.

- Proof object: matrix - 调度分工: Host = when to run; RMM = safe entry/exit; REC = Realm execution context; Realm = tenant workload; 风险 = interrupt/device interactions

#### 方法 3: Attestation / Measurement

**Claim:** RMM 生命周期必须产生 verifier 可用的初始状态证据。

- 测量绑定 Realm 初始配置、内存内容和平台状态。
- Verifier 依据 evidence 判断是否把 secret 交给 Realm。
- 这也是 06 attestation 方向与 03 CCA 方向的连接点。

**讲解稿:** 讲解时先把本页结论落到一句话: RMM 生命周期必须产生 verifier 可用的初始状态证据。第一步解释为什么需要这一页: 测量绑定 Realm 初始配置、内存内容和平台状态。第二步说明论文或规范实际做了什么: Verifier 依据 evidence 判断是否把 secret 交给 Realm。第三步收束到证据边界: 这也是 06 attestation 方向与 03 CCA 方向的连接点。引用时只把 RMM spec README; Li 2022 attestation discussion 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RMM spec README; Li 2022 attestation discussion.

- Proof object: flow - evidence path: Realm initial state -> RMM measurement -> platform attestation key -> report/token -> remote verifier -> secret release policy


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** 实验环境页写成规范证据状态: 官方 source 已记录，但本地 PDF 不可用。

- 证据源: Arm DEN0137 documentation page/CDN URL status recorded in README。
- 可支撑: RMM/RMI/RSI lifecycle 公开概念。
- 不能支撑: 未本地读取的具体表格、性能或实现细节。

**讲解稿:** 讲解时先把本页结论落到一句话: 实验环境页写成规范证据状态: 官方 source 已记录，但本地 PDF 不可用。第一步解释为什么需要这一页: 证据源: Arm DEN0137 documentation page/CDN URL status recorded in README。第二步说明论文或规范实际做了什么: 可支撑: RMM/RMI/RSI lifecycle 公开概念。第三步收束到证据边界: 不能支撑: 未本地读取的具体表格、性能或实现细节。引用时只把 RMM specification README download status 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RMM specification README download status.

- Proof object: matrix - 证据状态: 证据等级 = E0 official source; 本地 PDF = unavailable; 实验 = 无; PPT 用法 = lifecycle/interface boundary


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能页应明确: RMM spec 不给 overhead，性能需看 RMM implementation 或系统论文。

- RMI/RSI 调用、granule transition 和 REC exit/entry 可能影响性能。
- Spec 只能说明这些路径存在，不能给出开销数字。
- 具体数据需要 Shelter/RContainer/NanoZone/Devlore/CAGE 等论文。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能页应明确: RMM spec 不给 overhead，性能需看 RMM implementation 或系统论文。第一步解释为什么需要这一页: RMI/RSI 调用、granule transition 和 REC exit/entry 可能影响性能。第二步说明论文或规范实际做了什么: Spec 只能说明这些路径存在，不能给出开销数字。第三步收束到证据边界: 具体数据需要 Shelter/RContainer/NanoZone/Devlore/CAGE 等论文。引用时只把 RMM spec README; no benchmark evidence 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RMM spec README; no benchmark evidence.

- Proof object: bars - claim strength: 接口语义 高; 生命周期边界 高; 性能数字 无; 实现安全 需另证


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: RMM spec 是 CCA 可信边界的状态机锚点，商业化成败取决于实现、小 TCB 和生态兼容。

- 优势: 清晰分离 host-facing 和 Realm-facing 接口。
- 局限: 本仓库缺本地 PDF，不能展开未验证细节。
- 商业化潜力: RMM 是 Arm CCA 云平台必需组件，但需要 formal assurance、patching、debug policy 和 device lifecycle 集成。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: RMM spec 是 CCA 可信边界的状态机锚点，商业化成败取决于实现、小 TCB 和生态兼容。第一步解释为什么需要这一页: 优势: 清晰分离 host-facing 和 Realm-facing 接口。第二步说明论文或规范实际做了什么: 局限: 本仓库缺本地 PDF，不能展开未验证细节。第三步收束到证据边界: 商业化潜力: RMM 是 Arm CCA 云平台必需组件，但需要 formal assurance、patching、debug policy 和 device lifecycle 集成。引用时只把 RMM spec README 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RMM spec README.

- Proof object: matrix - 评价: 优势 = lifecycle state machine; 局限 = local PDF unavailable; 商业化 = CCA runtime TCB; 本报告角色 = RMI/RSI 边界锚点


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
