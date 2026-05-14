# RISC-V Application-Processor Trusted Execution Environment Specification

- BibTeX key: `riscv_ap_tee_2024`
- Category: `risc-v-confidential-computing`
- Authors: RISC-V Non-ISA AP-TEE contributors
- Year: 2024
- Source: https://github.com/riscv-non-isa/riscv-ap-tee
- Release: https://github.com/riscv-non-isa/riscv-ap-tee/releases/tag/v0.7
- PDF source: https://github.com/riscv-non-isa/riscv-ap-tee/releases/download/v0.7/riscv-cove.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Standardization status: Draft/not ratified: AP-TEE v0.7 / RC2 for ARC review
- Evidence role: Draft/not ratified: AP-TEE v0.7 / RC2. Public RISC-V AP-TEE source for CoVE/AP-TEE lifecycle and ABI concepts; always mark with this status.

<!-- BEGIN PAPER REVIEW -->
## Paper Review
### 1. 论文基本信息

- 论文标题: RISC-V Application-Processor Trusted Execution Environment Specification / Confidential VM Extension (CoVE)
- 作者 / 机构: RISC-V AP-TEE Task Group
- 发表会议 / 年份: Draft/not ratified: AP-TEE v0.7 / RC2 / 2024
- 领域分类: 架构 / 系统 / 安全
- 一句话总结: 规范定义 RISC-V CoVE/AP-TEE 的 TVM、TSM、COVH/COVG/COVI ABI、memory lifecycle 和 attestation 语义。
- 最核心贡献一句话: 它是当前 RISC-V confidential VM 与 Arm CCA 同层对照的核心 Draft/not ratified: AP-TEE v0.7 / RC2 规范证据。

### 2. 研究问题与背景

RISC-V 需要从 PMP-based enclave 上升到 confidential VM 层级，使 guest/tenant 不必信任 host OS/hypervisor。规范解决 TVM 创建、内存捐赠/回收/共享、TSM 保护、attestation evidence 和中断/guest/host ABI 的标准化问题。Draft/not ratified: AP-TEE v0.7 / RC2。

### 3. 核心方法拆解

机制路径为 `host/COVH -> TSM/TSM-driver -> TVM lifecycle -> confidential memory mapping -> COVG guest calls -> attestation evidence`。核心模块包括 TVM、TSM、Supervisor Domains、THCS/VHCS、COVH/COVG/COVI、memory convert/reclaim/add measured/shared/zero pages、AIA IMSIC binding、TVM token 和 layered evidence。

### 4. 安全性 / 正确性分析

威胁模型将 host/hypervisor 视为不可信管理者，目标是保护 TVM memory/register state/attestation。强假设是 TSM 和底层硬件正确，平台 attestation key 和 measurement 正确，memory lifecycle 没有 alias/race。规范不是证明；实现仍需验证 TLB shootdown、page conversion、interrupt binding、MMIO/shared memory corner cases。

### 5. 实现细节

规范无单一实现，但定义 SBI ABI 和 deployment models。实现依赖 RISC-V H-extension、AIA、IOMMU/IOPMP/SoC memory isolation、TSM firmware 和 host/guest software。复现难点是搭建完整 TVM stack 和 attestation chain。

### 6. 实验设计分析

规范草案无实验。验证应覆盖 TVM creation/finalize/run/destroy、memory donation/reclaim/share、measured pages、COVI interrupt binding、COVG attestation calls 和 hostile host fuzzing。不能引用它作为性能证据。

### 7. Novelty 分析

分类: solid systems contribution。作为标准草案，贡献在将 RISC-V confidential VM 生命周期和 ABI 固化为可实现接口。

### 8. 局限性与可能漏洞

最大限制是 Draft/not ratified: AP-TEE v0.7 / RC2。CoVE-IO 另有独立草案，AP-TEE 本体对真实设备、安全 DMA、PCIe IDE/TDISP/SPDM 覆盖不完整。host-controlled resource management 的 race、side-channel、DoS 和实现 bug 仍是风险。

### 9. 和已有工作的关系

它是 `sahita2023cove` 的规范化后续，与 Arm CCA/RME/RMM 同层。它依赖/关联 RISC-V privileged architecture、H-extension、AIA、IOMMU、IOPMP 和 CoVE-IO。与 Keystone/Penglai/SPEAR-V 不同，它保护 VM/TVM 而非单进程 enclave。

### 10. 复现与再实现计划

最小复现目标是在 emulator/FPGA 上实现 TSM stub、COVH create/finalize/run、memory conversion 和 COVG evidence call。需要 RISC-V hypervisor stack、TSM firmware、host KVM/QEMU patch 或 test harness。验收标准是 hostile host 无法映射 confidential pages，TVM token measurement 可复验，shared pages 显式 lifecycle。

### 11. 对后续研究的启发

1. AP-TEE 与 Arm CCA 的 granule/page lifecycle 对照。2. TSM ABI fuzzing 和 formal model。3. TVM memory sharing 的 race-free proof。4. CoVE attestation evidence 与 EAT/CCA token 的统一 verifier。5. CoVE-IO 与 AP-TEE 生命周期合并验证。潜在 venue: ASPLOS、USENIX Security、IEEE S&P、CCS、HOST。

### 12. Evidence README Addendum
- Evidence role: Draft/not ratified: AP-TEE v0.7 / RC2. Public RISC-V AP-TEE source for CoVE/AP-TEE lifecycle and ABI concepts; always mark with this status.
- 标准化 / 发表状态: Draft/not ratified: AP-TEE v0.7 / RC2
- 对应小方向: RISC-V CoVE / AP-TEE confidential VM

#### 内容摘要

AP-TEE/CoVE 规范定义 RISC-V TVM、TSM、memory lifecycle、COVH/COVG/COVI ABI 和 attestation evidence。

#### 研究背景

RISC-V confidential computing 需要标准化 VM-level TEE，而不能只依赖 PMP enclave 原型。

#### 解决方案

以 TSM 作为 trusted protection module，让 host 通过 COVH 管理 TVM，但关键 memory/interrupt/attestation 状态由 TSM enforce。

#### 实验结果

规范草案，无新实验。

#### 文章评价

这是本 survey 最关键的 RISC-V confidential VM 材料。正文必须标注 Draft/not ratified: AP-TEE v0.7 / RC2，并避免把它和 legacy RISC-V enclave 混写。
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `09-riscv-cove-ap-tee` - RISC-V CoVE / AP-TEE Confidential VM
- Paper key: `riscv_ap_tee_2024`
- Role: current standards-track RISC-V TVM semantics source
- Evidence base: AP-TEE PDF contents: Section 4 threat/security requirements; Section 5 deployment and isolation; Section 6 attestation; Section 7 lifecycle; Section 8 SBI.
- Boundary: v0.7 draft/not ratified；不能写成最终标准或生产 ABI。

### 1. 完整题目 / 作者 / 会议

- 完整题目: RISC-V Application-Processor Trusted Execution Environment Specification
- 作者: RISC-V Non-ISA AP-TEE contributors
- 会议/来源: RISC-V AP-TEE draft specification v0.7, 2024
- Title evidence: README metadata; AP-TEE draft title page.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** AP-TEE 是本方向主 SOTA: 它把 CoVE 的想法推进到可实现的 draft ABI 和生命周期语义。

- 动机: CoVE 需要统一 TVM、TSM、memory donation/reclaim/share、attestation 和 host/guest ABI。
- 工作: 定义 TVM security requirements、TSM init/operation、TVM attestation、lifecycle 和 CoVE SBI extension。
- 数据: 规范草案无实验；证据来自章节级语义和 ABI 列表。

**讲解稿:** 讲解时先把本页结论落到一句话: AP-TEE 是本方向主 SOTA: 它把 CoVE 的想法推进到可实现的 draft ABI 和生命周期语义。第一步解释为什么需要这一页: 动机: CoVE 需要统一 TVM、TSM、memory donation/reclaim/share、attestation 和 host/guest ABI。第二步说明论文或规范实际做了什么: 工作: 定义 TVM security requirements、TSM init/operation、TVM attestation、lifecycle 和 CoVE SBI extension。第三步收束到证据边界: 数据: 规范草案无实验；证据来自章节级语义和 ABI 列表。引用时只把 AP-TEE Section 4-8 table of contents and draft PDF 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AP-TEE Section 4-8 table of contents and draft PDF.

- Proof object: flow - AP-TEE spec path: threat model -> deployment model -> TSM operation -> TVM attestation -> TVM lifecycle -> CoVE SBI


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是 confidential VM 只有概念不够，host、guest、firmware 和 verifier 必须共享同一套状态机。

- 没有标准 ABI，OS/VMM/firmware 很难互操作。
- 没有明确 memory lifecycle，donate/reclaim/share 容易产生 data remanence 或 ownership confusion。
- 没有 attestation token schema，relying party 无法判断 TVM 和 TSM 状态。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是 confidential VM 只有概念不够，host、guest、firmware 和 verifier 必须共享同一套状态机。第一步解释为什么需要这一页: 没有标准 ABI，OS/VMM/firmware 很难互操作。第二步说明论文或规范实际做了什么: 没有明确 memory lifecycle，donate/reclaim/share 容易产生 data remanence 或 ownership confusion。第三步收束到证据边界: 没有 attestation token schema，relying party 无法判断 TVM 和 TSM 状态。引用时只把 AP-TEE Section 4-8 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AP-TEE Section 4-8.

- Proof object: matrix - 标准化对象: Threat model = what TVM must resist; TSM = trusted security manager; Memory lifecycle = donate/share/reclaim; Attestation = TVM/TSM token; SBI = host/guest calls


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: AP-TEE 把 TVM 当成有状态对象，所有 page、vCPU、interrupt 和 token 都围绕 lifecycle 变化。

- TVM build/initialization 决定初始 measurement。
- TVM execution 决定 host 与 TSM 如何处理 exit/fault/interrupt。
- TVM memory management 决定 measured, zero, shared, private page 的安全要求。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: AP-TEE 把 TVM 当成有状态对象，所有 page、vCPU、interrupt 和 token 都围绕 lifecycle 变化。第一步解释为什么需要这一页: TVM build/initialization 决定初始 measurement。第二步说明论文或规范实际做了什么: TVM execution 决定 host 与 TSM 如何处理 exit/fault/interrupt。第三步收束到证据边界: TVM memory management 决定 measured, zero, shared, private page 的安全要求。引用时只把 AP-TEE Section 7 TVM lifecycle; Section 6 attestation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AP-TEE Section 7 TVM lifecycle; Section 6 attestation.

- Proof object: cards - state objects: TVM state; vCPU/vhart state; measured pages; shared pages; TSM/TVM token


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: AP-TEE 的主体不是图，而是规范化状态机和 ABI contract。

- TSM/TSM-driver 与 host/guest 的边界由 SBI extension 切开。
- Section 6 定义 TSM token 和 TVM token 相关内容。
- Section 7/8 把 create, memory management, execution, shutdown 对应到 runtime interface。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: AP-TEE 的主体不是图，而是规范化状态机和 ABI contract。第一步解释为什么需要这一页: TSM/TSM-driver 与 host/guest 的边界由 SBI extension 切开。第二步说明论文或规范实际做了什么: Section 6 定义 TSM token 和 TVM token 相关内容。第三步收束到证据边界: Section 7/8 把 create, memory management, execution, shutdown 对应到 runtime interface。引用时只把 AP-TEE Section 6-8 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AP-TEE Section 6-8.

- Proof object: matrix - AP-TEE contract: Host side = COVH runtime interface; Guest side = COVG-style services; Attestation = TSM token / TVM token; Memory = mapping security requirements; Interrupt = TVM external/timer handling


### 6. 核心方法拆解

#### 方法 1: TVM Build and Measurement

**Claim:** AP-TEE 规定 TVM 初始内容如何进入 measurement，避免 host 在创建后偷换 payload。

- Multi-step/single-step creation 都必须形成可验证初始状态。
- Measured page assignment 影响 TVM token。
- Finalization 后，初始 measured payload 不应再被 host 任意修改。

**讲解稿:** 讲解时先把本页结论落到一句话: AP-TEE 规定 TVM 初始内容如何进入 measurement，避免 host 在创建后偷换 payload。第一步解释为什么需要这一页: Multi-step/single-step creation 都必须形成可验证初始状态。第二步说明论文或规范实际做了什么: Measured page assignment 影响 TVM token。第三步收束到证据边界: Finalization 后，初始 measured payload 不应再被 host 任意修改。引用时只把 AP-TEE Section 6.1.2; Section 7.1; Section 8.2 TVM creation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AP-TEE Section 6.1.2; Section 7.1; Section 8.2 TVM creation.

- Proof object: flow - build: create TVM -> donate page-table pool -> map code/data -> extend measurement -> finalize -> attest

#### 方法 2: Memory Management Semantics

**Claim:** AP-TEE 的关键是把 private/shared/zero/reclaimed page 的转换写清楚。

- TVM private page 对 host 不可见。
- Shared page 用于 paravirtual I/O，但必须显式转换。
- Reclaim/reuse 需要清理，避免 secret 残留。

**讲解稿:** 讲解时先把本页结论落到一句话: AP-TEE 的关键是把 private/shared/zero/reclaimed page 的转换写清楚。第一步解释为什么需要这一页: TVM private page 对 host 不可见。第二步说明论文或规范实际做了什么: Shared page 用于 paravirtual I/O，但必须显式转换。第三步收束到证据边界: Reclaim/reuse 需要清理，避免 secret 残留。引用时只把 AP-TEE Section 7.3 memory management; Section 5.2 memory isolation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AP-TEE Section 7.3 memory management; Section 5.2 memory isolation.

- Proof object: matrix - page lifecycle: Donate = host -> TVM/TSM; Measure = initial payload; Zero = demand-zero private page; Share = TVM <-> host I/O; Reclaim = clean before host reuse

#### 方法 3: Attestation Token Model

**Claim:** AP-TEE 把 TSM token 与 TVM token 分开，让 verifier 同时看平台和 workload。

- TSM token 证明 TSM/TCB 状态。
- TVM token 证明 TVM measurement、configuration 和 security posture。
- Debug/PMU 等可观测能力需要进入 attestation posture。

**讲解稿:** 讲解时先把本页结论落到一句话: AP-TEE 把 TSM token 与 TVM token 分开，让 verifier 同时看平台和 workload。第一步解释为什么需要这一页: TSM token 证明 TSM/TCB 状态。第二步说明论文或规范实际做了什么: TVM token 证明 TVM measurement、configuration 和 security posture。第三步收束到证据边界: Debug/PMU 等可观测能力需要进入 attestation posture。引用时只把 AP-TEE Section 6 TVM Attestation and Measurements 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AP-TEE Section 6 TVM Attestation and Measurements.

- Proof object: flow - attestation tokens: hardware RoT -> TSM token -> TVM measurement -> TVM token -> verifier policy -> secret release

#### 方法 4: CoVE SBI Extension

**Claim:** SBI extension 是 host/guest/TSM 互操作的落地点。

- Host runtime interface 覆盖 detect capability、create TVM、memory management、run。
- Guest interface 覆盖 attestation request 和 shared-memory operations。
- Draft ABI 可能变化，所以 PPT 必须标注 not ratified。

**讲解稿:** 讲解时先把本页结论落到一句话: SBI extension 是 host/guest/TSM 互操作的落地点。第一步解释为什么需要这一页: Host runtime interface 覆盖 detect capability、create TVM、memory management、run。第二步说明论文或规范实际做了什么: Guest interface 覆盖 attestation request 和 shared-memory operations。第三步收束到证据边界: Draft ABI 可能变化，所以 PPT 必须标注 not ratified。引用时只把 AP-TEE Section 8 CoVE SBI extension proposal 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AP-TEE Section 8 CoVE SBI extension proposal.

- Proof object: cards - ABI groups: capability enumeration; TVM creation; memory conversion; run/exit; attestation request


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** AP-TEE 是规范草案，无实验；它支撑术语、状态机和 ABI，不支撑性能 claim。

- 证据源: 本地 AP-TEE draft PDF，约 80+ 页，章节覆盖 threat model 到 SBI。
- 可支撑: TVM lifecycle、memory mapping security requirements、attestation token、runtime interface。
- 边界: v0.7 draft/not ratified，后续版本可能改名、改状态机或改 ABI。

**讲解稿:** 讲解时先把本页结论落到一句话: AP-TEE 是规范草案，无实验；它支撑术语、状态机和 ABI，不支撑性能 claim。第一步解释为什么需要这一页: 证据源: 本地 AP-TEE draft PDF，约 80+ 页，章节覆盖 threat model 到 SBI。第二步说明论文或规范实际做了什么: 可支撑: TVM lifecycle、memory mapping security requirements、attestation token、runtime interface。第三步收束到证据边界: 边界: v0.7 draft/not ratified，后续版本可能改名、改状态机或改 ABI。引用时只把 AP-TEE draft PDF Section 4-8 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AP-TEE draft PDF Section 4-8.

- Proof object: matrix - 证据边界: 类型 = draft specification; 实验 = 无; 成熟度 = not ratified; 可支撑 = lifecycle/ABI semantics


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能页写成无新实验: AP-TEE 不给 benchmark，但揭示未来开销来源。

- 潜在开销来自 TSM call、page conversion、measurement、TLB invalidation 和 interrupt handling。
- 规范价值在互操作，不在证明开销。
- 性能要回到后续实现或 CoVE 系统论文。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能页写成无新实验: AP-TEE 不给 benchmark，但揭示未来开销来源。第一步解释为什么需要这一页: 潜在开销来自 TSM call、page conversion、measurement、TLB invalidation 和 interrupt handling。第二步说明论文或规范实际做了什么: 规范价值在互操作，不在证明开销。第三步收束到证据边界: 性能要回到后续实现或 CoVE 系统论文。引用时只把 AP-TEE draft scope 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AP-TEE draft scope.

- Proof object: bars - claim strength: 规范细节 高; ratified status 草案; performance evidence 无; implementation guidance 强


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: AP-TEE 是 RISC-V CVM 方向最关键的当前材料，但必须显式标注 draft 风险。

- 优势: 把 CoVE lifecycle/ABI/attestation 写成可实现接口。
- 局限: not ratified；缺生产实现、性能数据、完整 I/O 标准闭环。
- 商业化潜力: 若稳定，会成为开放 CVM software stack 的对齐点。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: AP-TEE 是 RISC-V CVM 方向最关键的当前材料，但必须显式标注 draft 风险。第一步解释为什么需要这一页: 优势: 把 CoVE lifecycle/ABI/attestation 写成可实现接口。第二步说明论文或规范实际做了什么: 局限: not ratified；缺生产实现、性能数据、完整 I/O 标准闭环。第三步收束到证据边界: 商业化潜力: 若稳定，会成为开放 CVM software stack 的对齐点。引用时只把 AP-TEE draft status and README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AP-TEE draft status and README evaluation.

- Proof object: matrix - 评价: 优势 = standards-track semantics; 局限 = draft / no experiment; 商业化 = open CVM ABI; 本方向角色 = main SOTA spec


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
