# The RISC-V Instruction Set Manual: Privileged Architecture

- BibTeX key: `riscv_privileged`
- Category: `architecture-and-platform-security`
- Authors: RISC-V Foundation
- Year: 2025
- Source: https://docs.riscv.org/reference/isa/_attachments/riscv-privileged.pdf
- PDF source: https://docs.riscv.org/reference/isa/_attachments/riscv-privileged.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified

<!-- BEGIN PAPER REVIEW -->
## Paper Review
### 1. 论文基本信息

- 论文标题: The RISC-V Instruction Set Manual, Volume II: Privileged Architecture
- 作者 / 机构: RISC-V International
- 发表会议 / 年份: Official Release 20260120
- 领域分类: 架构 / 硬件 / 系统
- 一句话总结: 规范定义 RISC-V privilege modes、CSR、trap、PMP、Smepmp、hypervisor 和 supervisor/machine-level 基础。
- 最核心贡献一句话: 它是所有 RISC-V TEE、CoVE/AP-TEE、IOMMU/AIA 和 runtime hardening 讨论的 ISA 底座。

### 2. 研究问题与背景

RISC-V 平台安全必须建立在 privilege separation、trap delegation、memory protection 和 virtualization 语义之上。该规范解决 ISA/privileged software contract 问题，不直接提供 TEE，但定义 TEE 依赖的 PMP、Smepmp、H-extension、state-enable 和 CFI 相关状态。

### 3. 核心方法拆解

机制路径为 `hart privilege mode -> CSR/trap state -> address translation/PMP/PMAs -> hypervisor/VS state -> extension-specific controls`。重要模块包括 M/S/U/HS/VS 模式、mstatus/menvcfg/mseccfg、PMP、Smepmp、Smstateen、Smcsrind、Smctr、supervisor translation 和 hypervisor 支持。

### 4. 安全性 / 正确性分析

规范提供语义，不证明具体平台安全。PMP/Smepmp 可限制物理内存访问，H-extension 支撑虚拟化，state-enable 限制扩展状态访问。强假设是实现和 privileged firmware 正确。它不覆盖 DMA/I/O requester、device identity、memory encryption、attestation 或 side-channel。

### 5. 实现细节

这是 ISA 规范。实现分布在 CPU core、MMU、CSR file、trap logic 和 firmware/OS/hypervisor。复现方式不是实现全文，而是构建最小 privileged model 并测试 PMP/Smepmp/trap/hypervisor 行为。

### 6. 实验设计分析

规范无实验。验证需要 ISA compliance tests、PMP/Smepmp property tests、trap delegation tests、virtualization tests 和 malicious privileged transition cases。

### 7. Novelty 分析

分类: solid systems contribution。作为基础规范，其研究价值在标准化语义和为上层 TEE 提供可组合 primitives。

### 8. 局限性与可能漏洞

规范本身不提供完整安全方案。PMP region 数量、配置错误、M-mode TCB 过大、DMA 绕过、IOMMU/IOPMP 缺失、side-channel 和 speculative behavior 都可能破坏上层安全目标。

### 9. 和已有工作的关系

Sanctum/Keystone/Penglai/SPEAR-V/TIMBER-V/CURE/ACE 都在不同程度上依赖 RISC-V privileged primitives。CoVE/AP-TEE 在 H-extension/TSM/TVM 之上定义 confidential VM；IOMMU/AIA/IOPMP 是补齐设备和中断路径的 non-ISA/ISA 规范。

### 10. 复现与再实现计划

最小复现目标是用 Sail/QEMU/Spike 或自定义模型测试 PMP/Smepmp 与 trap/virtualization。验收标准是 M/S/U/HS/VS 权限边界正确、PMP lock 生效、Smepmp 防止 M-mode 越权执行/访问、虚拟化 CSR 行为符合规范。

### 11. 对后续研究的启发

1. 构建 RISC-V TEE primitive matrix。2. 对 Smepmp+PMP monitor 做形式化验证。3. 将 privilege spec 与 IOPMP/IOMMU/AIA 统一建模。4. 研究 CFI state 与 TEE monitor hardening。5. 自动生成 TSM/monitor 的 CSR misuse checker。潜在 venue: ASPLOS、PLDI、USENIX Security、HOST、ISCA。

### 12. Evidence README Addendum
- Evidence role: Spec/standard SOTA. Use for the public standard, architecture, or specification semantics it defines; do not infer implementation security, performance, or platform completeness beyond the document.
- 标准化 / 发表状态: Official Release 20260120
- 对应小方向: RISC-V 基础安全 primitives; Runtime CFI / memory-safety hardening

#### 内容摘要

RISC-V privileged architecture 是 RISC-V 安全系统的基础规范。

#### 研究背景

所有 RISC-V TEE 都必须依赖 privilege modes、trap、PMP/Smepmp、translation 和 hypervisor 语义。

#### 解决方案

规范化 machine/supervisor/hypervisor/virtual supervisor 状态、CSR、PMP、Smepmp 和相关扩展。

#### 实验结果

规范，无新实验。

#### 文章评价

必须引用但不能过度解释。它是底座，不是完整 TEE、memory encryption 或 trusted I/O 方案。
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `07-riscv-primitives` - RISC-V 基础安全 Primitives
- Paper key: `riscv_privileged`
- Role: foundational CPU privilege specification
- Evidence base: Privileged spec local PDF; Figure 1 implementation stacks; Table 1 privilege levels.
- Boundary: 规范无新实验；不证明某个 TEE implementation 安全。

### 1. 完整题目 / 作者 / 会议

- 完整题目: The RISC-V Instruction Set Manual, Volume II: Privileged Architecture
- 作者: RISC-V Foundation / RISC-V International contributors
- 会议/来源: RISC-V privileged architecture specification, 2025 snapshot
- Title evidence: README metadata; RISC-V privileged spec PDF.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** Privileged spec 是所有 RISC-V TEE 的 CPU-side 词典。

- 动机: 开放 ISA 需要可标准化的特权执行、隔离和虚拟化接口。
- 工作: 定义 M/S/U privilege、CSRs、trap/delegation、PMP、page tables、hypervisor extension。
- 数据: spec 文档无实验，Figure 1 和 Table 1 是讲解入口。

**讲解稿:** 讲解时先把本页结论落到一句话: Privileged spec 是所有 RISC-V TEE 的 CPU-side 词典。第一步解释为什么需要这一页: 动机: 开放 ISA 需要可标准化的特权执行、隔离和虚拟化接口。第二步说明论文或规范实际做了什么: 工作: 定义 M/S/U privilege、CSRs、trap/delegation、PMP、page tables、hypervisor extension。第三步收束到证据边界: 数据: spec 文档无实验，Figure 1 和 Table 1 是讲解入口。引用时只把 RISC-V privileged spec Figure 1; Table 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RISC-V privileged spec Figure 1; Table 1.

- Proof object: flow - privilege stack: U-mode app -> S-mode OS -> HS/VS virtualization -> M-mode firmware -> PMP/page tables -> TEE monitor/TSM


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是 RISC-V 的 openness 带来灵活性，也要求 TEE 设计者明确每个 privilege level 的责任。

- M-mode 权力最大，常承载 firmware/security monitor。
- S/HS/VS 管 OS/hypervisor/guest state。
- PMP/ePMP 和 page table 是早期 enclave 与后续 CoVE 的隔离底座。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是 RISC-V 的 openness 带来灵活性，也要求 TEE 设计者明确每个 privilege level 的责任。第一步解释为什么需要这一页: M-mode 权力最大，常承载 firmware/security monitor。第二步说明论文或规范实际做了什么: S/HS/VS 管 OS/hypervisor/guest state。第三步收束到证据边界: PMP/ePMP 和 page table 是早期 enclave 与后续 CoVE 的隔离底座。引用时只把 RISC-V privileged spec Figure 1; Table 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RISC-V privileged spec Figure 1; Table 1.

- Proof object: matrix - 特权层: M-mode = firmware / monitor; S-mode = OS; U-mode = app; HS/VS = virtualization; PMP/Sv* = memory protection


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: RISC-V TEE 的设计差异，很多都可以追溯到把 trust 放在 M-mode monitor、S-mode TSM 还是硬件扩展里。

- Keystone/Penglai 依赖 security monitor/PMP。
- CoVE/AP-TEE 把 confidential VM 推到 TVM/TSM/MTT。
- I/O/interrupt 方案必须和 privilege/trap/delegation 语义一致。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: RISC-V TEE 的设计差异，很多都可以追溯到把 trust 放在 M-mode monitor、S-mode TSM 还是硬件扩展里。第一步解释为什么需要这一页: Keystone/Penglai 依赖 security monitor/PMP。第二步说明论文或规范实际做了什么: CoVE/AP-TEE 把 confidential VM 推到 TVM/TSM/MTT。第三步收束到证据边界: I/O/interrupt 方案必须和 privilege/trap/delegation 语义一致。引用时只把 RISC-V privileged spec; Boubakri survey mapping 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RISC-V privileged spec; Boubakri survey mapping.

- Proof object: cards - 设计分叉: M-mode monitor; PMP/ePMP; S/HS virtualization; page table ownership; trap delegation


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: privilege spec 定义 execution stack 和可用硬件隔离语义，TEE 在其上分配 TCB。

- Figure 1 展示不同 privileged execution stacks。
- Table 1 给 privilege levels。
- PMP/virtual memory/hypervisor chapters 是安全 primitive 的核心。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: privilege spec 定义 execution stack 和可用硬件隔离语义，TEE 在其上分配 TCB。第一步解释为什么需要这一页: Figure 1 展示不同 privileged execution stacks。第二步说明论文或规范实际做了什么: Table 1 给 privilege levels。第三步收束到证据边界: PMP/virtual memory/hypervisor chapters 是安全 primitive 的核心。引用时只把 RISC-V privileged spec Figure 1; Table 1; PMP/VM/H extension chapters 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RISC-V privileged spec Figure 1; Table 1; PMP/VM/H extension chapters.

- Proof object: matrix - 从 spec 到 TEE: PMP = enclave memory boundary; Virtual memory = guest/user isolation; Trap = monitor entry; CSR = control state; H extension = confidential VM substrate


### 6. 核心方法拆解

#### 方法 1: Privilege Levels / Trap Delegation

**Claim:** TEE 要先决定谁处理 trap、谁拥有最高权限。

- M-mode 是 mandatory highest privilege。
- Delegation 决定异常/中断流向 S/HS/VS。
- 错误 delegation 会扩大不可信 OS 控制面。

**讲解稿:** 讲解时先把本页结论落到一句话: TEE 要先决定谁处理 trap、谁拥有最高权限。第一步解释为什么需要这一页: M-mode 是 mandatory highest privilege。第二步说明论文或规范实际做了什么: Delegation 决定异常/中断流向 S/HS/VS。第三步收束到证据边界: 错误 delegation 会扩大不可信 OS 控制面。引用时只把 Privileged spec privilege/trap chapters 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Privileged spec privilege/trap chapters.

- Proof object: flow - trap path: event -> delegation check -> M/S/HS handler -> state save -> policy -> return

#### 方法 2: PMP/ePMP 与 Memory Boundary

**Claim:** PMP 是 RISC-V enclave lineage 最早的硬件隔离抓手。

- PMP 定义 physical memory region access。
- ePMP/Smepmp 扩展能减少 M-mode/firmware 风险。
- Keystone/Penglai/SPEAR-V 都围绕 memory ownership 做设计。

**讲解稿:** 讲解时先把本页结论落到一句话: PMP 是 RISC-V enclave lineage 最早的硬件隔离抓手。第一步解释为什么需要这一页: PMP 定义 physical memory region access。第二步说明论文或规范实际做了什么: ePMP/Smepmp 扩展能减少 M-mode/firmware 风险。第三步收束到证据边界: Keystone/Penglai/SPEAR-V 都围绕 memory ownership 做设计。引用时只把 Privileged spec PMP chapters 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Privileged spec PMP chapters.

- Proof object: matrix - PMP 用法: Region = physical memory; Permissions = R/W/X; Owner = monitor/firmware; Risk = scalability/granularity; TEE = enclave isolation

#### 方法 3: Virtual Memory / Hypervisor Extension

**Claim:** CoVE/AP-TEE 需要从 enclave 走向 TVM，这依赖 H extension 和 guest stage。

- VS/HS 模式支持 guest OS 和 hypervisor 分工。
- Stage translation 决定 guest physical 到 host physical 的路径。
- Confidential VM 还需额外 memory tracking 和 ownership。

**讲解稿:** 讲解时先把本页结论落到一句话: CoVE/AP-TEE 需要从 enclave 走向 TVM，这依赖 H extension 和 guest stage。第一步解释为什么需要这一页: VS/HS 模式支持 guest OS 和 hypervisor 分工。第二步说明论文或规范实际做了什么: Stage translation 决定 guest physical 到 host physical 的路径。第三步收束到证据边界: Confidential VM 还需额外 memory tracking 和 ownership。引用时只把 Privileged spec virtual memory and hypervisor sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Privileged spec virtual memory and hypervisor sections.

- Proof object: cards - CVM substrate: VS-mode; HS-mode; stage translation; guest CSRs; hypervisor traps


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** 这是官方/规范类材料，无实验；它支撑术语和机制边界。

- 证据源: local PDF 约 222 页。
- 可支撑: privilege/PMP/VM/H extension terminology。
- 不能支撑: Keystone/Penglai/CoVE performance 或完整安全证明。

**讲解稿:** 讲解时先把本页结论落到一句话: 这是官方/规范类材料，无实验；它支撑术语和机制边界。第一步解释为什么需要这一页: 证据源: local PDF 约 222 页。第二步说明论文或规范实际做了什么: 可支撑: privilege/PMP/VM/H extension terminology。第三步收束到证据边界: 不能支撑: Keystone/Penglai/CoVE performance 或完整安全证明。引用时只把 pdfinfo; privileged spec Figure 1/Table 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** pdfinfo; privileged spec Figure 1/Table 1.

- Proof object: matrix - 证据边界: 类型 = spec; 实验 = 无; 可支撑 = primitive definitions; 不能支撑 = system evaluation


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能页写成“无新实验”: spec 不给 overhead。

- Trap、PMP checks、page-table walk 可能影响性能，但 spec 不测。
- 性能必须引用 Keystone/Penglai/SPEAR-V/CoVE 系统论文。
- 本页只给 claim strength。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能页写成“无新实验”: spec 不给 overhead。第一步解释为什么需要这一页: Trap、PMP checks、page-table walk 可能影响性能，但 spec 不测。第二步说明论文或规范实际做了什么: 性能必须引用 Keystone/Penglai/SPEAR-V/CoVE 系统论文。第三步收束到证据边界: 本页只给 claim strength。引用时只把 RISC-V privileged spec scope 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RISC-V privileged spec scope.

- Proof object: bars - claim strength: 规范权威 高; 性能数据 无; TEE 适用性 基础


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: Privileged spec 是 RISC-V 安全的地基，价值高但抽象层低。

- 优势: 官方、全面、决定所有后续设计语言。
- 局限: 不是 TEE 方案；不含 verifier/attestation/I/O lifecycle。
- 商业化潜力: 所有 RISC-V confidential computing 产品都必须兼容这些语义。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: Privileged spec 是 RISC-V 安全的地基，价值高但抽象层低。第一步解释为什么需要这一页: 优势: 官方、全面、决定所有后续设计语言。第二步说明论文或规范实际做了什么: 局限: 不是 TEE 方案；不含 verifier/attestation/I/O lifecycle。第三步收束到证据边界: 商业化潜力: 所有 RISC-V confidential computing 产品都必须兼容这些语义。引用时只把 README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** README evaluation.

- Proof object: matrix - 评价: 优势 = foundational; 局限 = not a TEE; 商业化 = ISA compatibility; 本方向角色 = CPU primitive


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
