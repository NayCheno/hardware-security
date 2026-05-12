# RISC-V IOPMP Architecture Specification

- BibTeX key: `riscv_iopmp_2026`
- Category: `risc-v-confidential-computing`
- Authors: RISC-V IOPMP Task Group
- Year: 2026
- Version: 0.8.2 draft
- Source: https://github.com/riscv-non-isa/riscv-iopmp/releases/tag/v0.8.2
- PDF source: https://github.com/riscv-non-isa/riscv-iopmp/releases/download/v0.8.2/2026-0209-iopmp.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Standardization status: draft / in development; treat as not ratified
- Evidence role: Draft/not ratified. Public RISC-V IOPMP v0.8.2 draft source for I/O protection primitives; always mark as draft/not ratified.

<!-- BEGIN REVIEW -->
## Review
### 1. 论文基本信息

- 论文标题: RISC-V IOPMP Architecture Specification
- 作者 / 机构: RISC-V IOPMP Task Group / RISC-V International
- 发表会议 / 年份: Specification draft v0.8.2 / 2026
- 领域分类: 架构 / 硬件 / 安全
- 一句话总结: 规范定义 I/O PMP 的 requester、memory domain、entry matching 和错误处理机制，用于限制 I/O transaction 可访问的内存范围。
- 最核心贡献一句话: 它把 PMP 类访问控制扩展到 I/O 请求路径，为 RISC-V TEE/CoVE-IO 的 DMA 隔离提供可组合底座。

### 2. 研究问题与背景

CPU-side PMP 或页表不能约束独立 bus master、DMA 设备和 I/O fabric 中的请求。该规范要解决的是 I/O requester 到内存的访问控制与配置保护问题。gap 真实存在，因为 CoVE-IO、sIOPMP 和 confidential accelerator 都需要证明设备请求不能越权访问 protected memory。规范假设实现正确、平台软件按锁定位配置表项；它不单独解决设备身份、链路加密、TDISP/SPDM 远程证明或 replay protection。

### 3. 核心方法拆解

机制路径可写为 `I/O requester -> RRID/SRCMD -> memory domain -> IOPMP entry match -> allow/deny/error`。核心对象包括 Request-Role-ID、receiver/control port、memory domain、SRCMD table、MDCFG table、entry array、priority matching、lock bits 和 error capture。v0.8.2 还包含 secondary permission、MSI、safe runtime configuration 等扩展。研究贡献主要是规范化硬件接口；具体系统安全性取决于 SoC 集成和 TSM/firmware 配置。

### 4. 安全性 / 正确性分析

威胁边界是阻止 I/O request 越过已配置 memory domain。强假设包括 requester identity 可信、interconnect 不篡改 RRID、配置寄存器锁正确、热插拔和 runtime reconfiguration 有原子性。规范提供行为语义而非形式化证明；如果设备身份、PCIe IDE 或 TDISP 不配套，IOPMP 只能做本地访问控制，不能证明远端设备可信。

### 5. 实现细节

这是规范草案，无代码实现。实现依赖 SoC interconnect 暴露 requester identity、IOPMP block 位于正确数据路径、control port 受 trusted software 管理。复现难点在于在 RTL/FPGA 中模拟多个 requester、错误上报、锁定位和 safe runtime configuration。

### 6. 实验设计分析

规范无实验。验证应覆盖表项匹配优先级、lock 语义、非法访问错误、MSI/error path、runtime 更新原子性和多 IOPMP 级联。用于 survey 时不应把规范存在等同于性能或安全已被实测证明。

### 7. Novelty 分析

分类: solid systems contribution。新意在于将 PMP 风格的硬件访问控制体系化扩展到 I/O transaction，而不是提出完整 TEE。作为标准草案，它的价值在接口统一和可组合性。

### 8. 局限性与可能漏洞

最大限制是 v0.8.2 仍为 in-development draft。安全依赖 requester ID 不被 spoof、配置者可信、设备生命周期和 hotplug 可控。它不覆盖 PCIe link MITM、设备固件恶意、TDISP state、SPDM certificate chain、内存加密或 replay protection。

### 9. 和已有工作的关系

IOPMP 是 PMP/sIOPMP/CoVE-IO 之间的机制桥梁。sIOPMP 是面向 TEE 的可扩展设计论文；RISC-V IOMMU 处理地址转换和设备上下文；AIA 处理中断；CoVE-IO 组合 IOPMP/IOMMU/AIA/TDISP/IDE/SPDM 形成 trusted I/O 叙事。

### 10. 复现与再实现计划

最小复现目标是在简化 SoC 中加入两个 DMA requester、两个 memory domain 和一组 IOPMP entry。环境需要 Verilog/Chisel 或 SystemC 模型、DMA traffic generator 和 property tests。验收标准是越权 DMA 被阻止、配置锁生效、合法 shared buffer 可访问、runtime reconfiguration 不产生短暂越权窗口。

### 11. 对后续研究的启发

1. CoVE-IO 中 IOPMP 与 TDI ownership 的形式化组合验证。2. 热插拔设备的 requester identity 绑定与撤销。3. IOPMP 与 IOMMU/ATS/PRI cache invalidation 的一致性。4. 多租户 confidential accelerator 的可扩展 policy 编译。5. IOPMP 配置错误的自动检测与 fuzzing。潜在 venue: ASPLOS、USENIX Security、IEEE S&P、DAC、HOST。

### 12. Evidence README Addendum
- Evidence role: Draft/not ratified. Public RISC-V IOPMP v0.8.2 draft source for I/O protection primitives; always mark as draft/not ratified.
- 标准化 / 发表状态: v0.8.2 draft, in development, not ratified
- 对应小方向: RISC-V 基础安全 primitives; RISC-V CoVE-IO / TEE-I/O

#### 内容摘要

IOPMP 定义 RISC-V 平台 I/O request 的 memory-domain 访问控制机制，补足 CPU-side PMP 无法覆盖 DMA/总线请求的问题。

#### 研究背景

Confidential VM 和 accelerator TEE 的安全边界必须覆盖设备可见内存；否则 host 之外的设备仍可 DMA 到 protected memory。

#### 解决方案

通过 SRCMD/MDCFG/entry array 和 lock 语义表达 requester 到 memory domain 的访问策略，配合错误捕获和安全运行时配置支持平台软件管理。

#### 实验结果

规范草案，无新实验；证据基础是 v0.8.2 PDF 的接口和行为定义。

#### 文章评价

它是 RISC-V trusted I/O 重要底座，但不是完整 confidential I/O。正文必须显式标注 draft/not ratified，并把设备证明、链路加密和中断可信路径回引 CoVE-IO、AIA、IOMMU 和 PCIe/TDISP/SPDM 材料。
<!-- END REVIEW -->
