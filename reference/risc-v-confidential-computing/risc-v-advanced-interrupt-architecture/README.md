# RISC-V Advanced Interrupt Architecture Specification

- BibTeX key: `riscv_aia_2023`
- Category: `risc-v-confidential-computing`
- Authors: RISC-V International
- Year: 2023
- Source: https://github.com/riscv/riscv-aia
- Release: https://github.com/riscv/riscv-aia/releases/tag/1.0
- PDF source: https://github.com/riscv/riscv-aia/releases/download/1.0/riscv-interrupts-1.0.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Standardization status: v1.0 release; use as base interrupt architecture reference rather than a standalone TEE design
- Evidence role: Spec/standard SOTA. Use for the public standard, architecture, or specification semantics it defines; do not infer implementation security, performance, or platform completeness beyond the document.

<!-- BEGIN REVIEW -->
## Review
### 1. 论文基本信息

- 论文标题: The RISC-V Advanced Interrupt Architecture
- 作者 / 机构: Editor John Hauser; RISC-V contributors
- 发表会议 / 年份: Specification v1.0 / 2023
- 领域分类: 架构 / 硬件 / 系统
- 一句话总结: 规范定义 RISC-V AIA，包括 hart CSRs、IMSIC、APLIC、MSI、虚拟化中断和 IOMMU MSI 支持。
- 最核心贡献一句话: 它是 RISC-V trusted MSI、virtual interrupt 和 CoVE/CoVE-IO interrupt path 的 ratified 基础。

### 2. 研究问题与背景

传统 PLIC 和中断路径难以满足现代虚拟化、MSI、per-hart interrupt file 和 confidential I/O 对可控 interrupt delivery 的需求。AIA 解决 interrupt controller/CSR/MSI/virtualization 架构问题，但不直接定义 TEE 策略。

### 3. 核心方法拆解

机制路径为 `device/MSI or interrupt source -> APLIC/IMSIC -> hart interrupt file/CSR -> M/S/VS delivery -> guest/TVM handler`。核心模块包括 Smaia/Ssaia、IMSIC、APLIC、machine/supervisor/VS CSRs、IPI、IOMMU support for MSIs to VMs。

### 4. 安全性 / 正确性分析

AIA 本身是功能/架构规范，安全性来自上层如何分配和保护 interrupt files、MSI pages 和 injection paths。对 CoVE-IO，trusted MSI 需要 AP-TEE/CoVE-IO 额外绑定 TVM、device identity 和 IMSIC ownership。

### 5. 实现细节

规范无实现。实现依赖 hart CSR、IMSIC memory-mapped files、APLIC、IOMMU MSI path 和 OS/hypervisor/TSM 支持。复现需要 interrupt controller model 和 VM/TVM interrupt tests。

### 6. 实验设计分析

规范无实验。测试应覆盖 MSI delivery、virtual interrupt exception、IMSIC binding/unbinding、IOMMU MSI translation、interrupt injection 和 stale configuration。

### 7. Novelty 分析

分类: solid systems contribution。贡献在 ratified interrupt architecture，安全研究价值来自它为 trusted interrupt path 提供标准部件。

### 8. 局限性与可能漏洞

AIA 不提供设备证明、MMIO/DMA 保护或 TVM lifecycle。错误的 IMSIC ownership、MSI remapping、host injection 或 rebind race 都可能破坏 confidential I/O 语义。

### 9. 和已有工作的关系

AIA 是 AP-TEE COVI 和 CoVE-IO trusted interrupt 的 supporting spec，也与 RISC-V IOMMU MSI support 相关。与 IOPMP/IOMMU 分工不同: AIA 处理中断，IOMMU/IOPMP 处理设备 memory access。

### 10. 复现与再实现计划

最小复现目标是在 emulator 中实现 IMSIC/APLIC subset，跑 VM interrupt injection 和 MSI remapping tests。验收标准是 host 无法向未授权 TVM 注入 trusted MSI，rebind 后旧路径失效。

### 11. 对后续研究的启发

1. CoVE COVI ABI 与 AIA IMSIC 的形式化对齐。2. Trusted MSI rebind/unbind race 检查。3. Interrupt DoS 与安全边界区分。4. IOMMU MSI table 和 AIA 的一致性测试。5. Device assignment 下 interrupt ownership transfer。潜在 venue: ASPLOS、USENIX Security、HOST、OSDI、NDSS。

### 12. Evidence README Addendum
- Evidence role: Spec/standard SOTA. Use for the public standard, architecture, or specification semantics it defines; do not infer implementation security, performance, or platform completeness beyond the document.
- 标准化 / 发表状态: ratified v1.0 release
- 对应小方向: RISC-V 基础安全 primitives; RISC-V CoVE-IO / TEE-I/O

#### 内容摘要

AIA 是 RISC-V 现代中断、MSI 和虚拟化中断的基础规范。

#### 研究背景

confidential VM 和 trusted I/O 需要可隔离、可绑定、可撤销的中断路径。

#### 解决方案

定义 IMSIC、APLIC、hart CSRs、virtual interrupt delivery 和 IOMMU MSI support。

#### 实验结果

规范，无新实验。

#### 文章评价

AIA 是 trusted MSI 讨论的必要基础，但安全语义要由 AP-TEE/CoVE-IO 赋予。
<!-- END REVIEW -->
