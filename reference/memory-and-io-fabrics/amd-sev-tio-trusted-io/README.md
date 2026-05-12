# AMD SEV-TIO: Trusted I/O for Secure Encrypted Virtualization

- BibTeX key: `amd_sev_tio_2023`
- Category: `memory-and-io-fabrics`
- Authors: AMD
- Year: 2023
- Venue: AMD white paper
- Source: https://docs.amd.com/v/u/en-US/sev-tio-whitepaper
- PDF source: https://docs.amd.com/api/khub/documents/LEtP2bVCuvJCHm2sU7BoQw/content
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Survey lane: confidential-computing network/I/O/data-path defense
- Evidence role: Industry evidence. Use for vendor, product, or industry deployment evidence only; do not generalize to peer-reviewed mechanism proof or complete platform security.

<!-- BEGIN REVIEW -->
## Review
### 1. 论文基本信息

- 论文标题: AMD SEV-TIO: Trusted I/O for Secure Encrypted Virtualization
- 作者 / 机构: AMD
- 发表会议 / 年份: White paper / 2023
- 领域分类: 架构 / 系统 / 安全
- 一句话总结: 白皮书解释 AMD 如何把 SEV-SNP guest 的信任边界扩展到 TDISP-capable devices。
- 最核心贡献一句话: 它是理解 TDISP/SPDM/IDE 如何落入商用 confidential VM I/O 栈的重要工业材料。

### 2. 研究问题与背景

SEV-SNP 保护 guest private memory，但传统 device assignment 只能让设备访问 shared memory，导致 bounce buffering 和 host 可见 I/O traffic。SEV-TIO 目标是让 guest 在验证设备身份和配置后，把 TDISP-capable device 纳入信任边界，允许设备直接访问 guest private memory。

### 3. 核心方法拆解

机制路径为 `SEV-SNP guest -> device identity/config retrieval -> SPDM secure session -> TDISP TDI binding -> IDE protected fabric -> IOMMU/RMP check -> private-memory DMA/MMIO`。关键对象包括 TVM/guest、TSM、DSM、TDI、SPDM、IDE、RMP、vIOMMU、MMIO validation 和 device state machine。

### 4. 安全性 / 正确性分析

白皮书把 host software 视为不可信，要求设备隔离 guest data/workloads 并让 guest 验证 device identity/configuration。它依赖 TDISP device、SPDM session、IDE link、SEV-SNP RMP/IOMMU checks 和 AMD Secure Processor/TSM 逻辑。它是工业设计说明，不是形式化证明。

### 5. 实现细节

实现依赖 AMD SEV-SNP、RMP、vIOMMU、ASP/firmware、TDISP-capable PCIe device 和 IDE。白皮书说明了 SDT/SDTE、guest request、MMIO private mapping、IOMMU access path 等关键工程接口。

### 6. 实验设计分析

白皮书无公开实验。它以架构解释为主，不能证明性能收益或安全性已经在产品中完整验证。Survey 中应把它作为 industry design evidence。

### 7. Novelty 分析

分类: solid systems/industry architecture contribution。它把 TDISP、SPDM、IDE 和 SEV-SNP RMP/IOMMU 组合成可信 I/O 方案，是 CoVE-IO 和 Arm CCA I/O 对照的好材料。

### 8. 局限性与可能漏洞

最大限制是厂商白皮书而非 peer-reviewed 论文。设备生态、证书供应链、firmware 更新、TDI state bugs、IOMMU/ATS/PRI cache、hotplug/revocation 都需要独立验证。

### 9. 和已有工作的关系

与 RISC-V CoVE-IO 高度同构: 都需要 SPDM/TDISP/IDE、device binding、IOMMU 和 trusted memory ownership。与 FOLIO 的关系是对照: SEV-TIO 扩大 TCB 到 trusted device，FOLIO 尝试在无 trusted I/O 设备时优化 CVM 网络路径。

### 10. 复现与再实现计划

最小复现目标是模拟 SEV-SNP guest、TDISP device 和 IOMMU/RMP policy，验证绑定前后 DMA 到 private memory 的差异。真实复现需要支持 SEV-TIO 的硬件和 TDISP-capable device。

### 11. 对后续研究的启发

1. SEV-TIO、CoVE-IO、Arm RME-DA 的统一 trusted I/O 表。2. TDISP state machine verification。3. Device certificate lifecycle and revocation。4. Secure vNIC/SmartNIC confidential offload benchmark。5. Bounce buffering 与 trusted I/O 的性能/TCB tradeoff。

### 12. Evidence README Addendum
- Evidence role: Industry evidence. Use for vendor, product, or industry deployment evidence only; do not generalize to peer-reviewed mechanism proof or complete platform security.
- 标准化 / 发表状态: AMD white paper, 2023
- 对应小方向: 机密计算网络 / I/O / fabric 防御

#### 内容摘要

SEV-TIO 解释如何把 SEV-SNP confidential guest 与 TDISP-capable device 安全绑定。

#### 研究背景

Confidential VM 的网络、存储和 accelerator I/O 会因 bounce buffering 和 host-visible shared memory 产生性能和安全问题。

#### 解决方案

组合 TDISP、SPDM、PCIe IDE、RMP/IOMMU 和 firmware-mediated binding，使设备可被 guest 验证并访问 private memory。

#### 实验结果

白皮书，无公开实验。

#### 文章评价

很适合作为 CoVE-IO 的 x86 industry 对照；需要明确它不是 Arm/RISC-V 主线，但支撑 trusted I/O taxonomy。
<!-- END REVIEW -->
