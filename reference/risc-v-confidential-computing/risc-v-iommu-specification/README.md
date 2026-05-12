# RISC-V IOMMU Architecture Specification

- BibTeX key: `riscv_iommu_2023`
- Category: `risc-v-confidential-computing`
- Authors: RISC-V Non-ISA IOMMU contributors
- Year: 2026
- Source: https://docs.riscv.org/reference/home/index.html
- Release: RISC-V Ratified Specifications Library release v1.0.1 / 20260222
- PDF source: https://docs.riscv.org/reference/iommu/_attachments/riscv-iommu.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Standardization status: v1.0.1 / 20260222 ratified-library release; base architecture and listed standard extensions are ratified
- Evidence role: Spec/standard SOTA. Use for the public standard, architecture, or specification semantics it defines; do not infer implementation security, performance, or platform completeness beyond the document.

<!-- BEGIN PAPER REVIEW -->
## Paper Review
### 1. 论文基本信息

- 论文标题: RISC-V IOMMU Architecture Specification
- 作者 / 机构: RISC-V IOMMU Task Group
- 发表会议 / 年份: RISC-V Ratified Specifications Library v1.0.1 / 20260222
- 领域分类: 架构 / 硬件 / 系统
- 一句话总结: 规范定义 RISC-V I/O memory management unit 的 device context、process context、address translation、ATS/PRI 和 fault/queue 接口。
- 最核心贡献一句话: 它是 RISC-V 设备 DMA 地址转换和隔离的 ratified 基础规范。

### 2. 研究问题与背景

设备 DMA 可绕过 CPU page table/PMP，虚拟化和 confidential I/O 需要设备侧地址转换、权限检查、MSI translation 和 fault reporting。该规范解决 IOMMU 架构接口问题；它不是 TEE 本体，也不提供 device identity 或 link encryption。

### 3. 核心方法拆解

机制路径为 `device request -> device directory table -> process directory/first-stage/second-stage translation -> MSI/fault/page-request queues -> memory access`。核心对象包括 DDT、PDT、device context、process context、IOHGATP、MSI page table、ATS/PRI handling、command/fault/page-request queues 和 MMIO registers。

### 4. 安全性 / 正确性分析

安全边界是设备地址转换和权限检查。强假设包括 IOMMU 硬件正确、host/TSM 正确配置、device ID 不被 spoof、cache invalidation 顺序正确。它不能独立解决 malicious device、PCIe link MITM、TDISP state 或 memory encryption。

### 5. 实现细节

规范无实现。实现依赖 PCIe/root complex/SoC interconnect 与 OS/hypervisor driver。复现需要 IOMMU model、DMA devices、fault queue tests、ATS/PRI tests。

### 6. 实验设计分析

规范无实验。验证重点应是 address translation correctness、fault delivery、ATS invalidation、MSI remapping、two-stage translation 和 malicious DMA tests。

### 7. Novelty 分析

分类: solid systems contribution。作为 ratified spec，它的价值在标准化 RISC-V IOMMU，而不是提出新防御。

### 8. 局限性与可能漏洞

IOMMU 配置错误、stale translations、ATS/PRI cache、device ID spoofing 和 confused deputy 都是潜在风险。它缺少 CoVE-IO 所需的 device attestation 和 trusted interface lifecycle。

### 9. 和已有工作的关系

IOMMU 是 CoVE-IO 的 supporting spec，需与 AIA、IOPMP、SPDM/TDISP/IDE 组合。与 sIOPMP/IOPMP 不同，IOMMU 主要做地址转换和设备上下文管理。

### 10. 复现与再实现计划

最小复现目标是实现 software IOMMU model，模拟 device DMA 到 guest/host/TVM memory。验收标准是非法 IOVA 被 fault，MSI remapping 正确，cache invalidation 后 stale translation 失效。

### 11. 对后续研究的启发

1. IOMMU + IOPMP 组合策略编译。2. CoVE-IO 下 ATS/PRI 安全性。3. Trusted MSI remapping 验证。4. IOMMU driver fuzzing。5. Device identity 与 IOMMU context binding。潜在 venue: ASPLOS、USENIX Security、NDSS、HOST、OSDI。

### 12. Evidence README Addendum
- Evidence role: Spec/standard SOTA. Use for the public standard, architecture, or specification semantics it defines; do not infer implementation security, performance, or platform completeness beyond the document.
- 标准化 / 发表状态: ratified-library release v1.0.1 / 20260222；base architecture v1.0 和列出的 standard extensions 均为 ratified
- 对应小方向: RISC-V 基础安全 primitives; RISC-V CoVE-IO / TEE-I/O

#### 内容摘要

RISC-V IOMMU 定义设备 DMA 地址转换、隔离和 queue/register 接口。

#### 研究背景

虚拟化和 confidential I/O 需要将设备访问约束到正确 guest/TVM 地址空间。

#### 解决方案

通过 device/process context、first/second-stage translation、ATS/PRI 和 MSI/fault queues 实现设备侧地址管理。

#### 实验结果

规范，无新实验。

#### 文章评价

它是必要底座，但不是完整安全方案。CoVE-IO 还需要 device identity、IDE、TDISP、SPDM、trusted interrupt 和 lifecycle。
<!-- END PAPER REVIEW -->
