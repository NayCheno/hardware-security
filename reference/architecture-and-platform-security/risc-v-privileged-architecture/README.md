# The RISC-V Instruction Set Manual: Privileged Architecture

- BibTeX key: `riscv_privileged`
- Category: `architecture-and-platform-security`
- Authors: RISC-V Foundation
- Year: 2025
- Source: https://docs.riscv.org/reference/isa/_attachments/riscv-privileged.pdf
- PDF source: https://docs.riscv.org/reference/isa/_attachments/riscv-privileged.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified

<!-- BEGIN REVIEW -->
## Review
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
<!-- END REVIEW -->
