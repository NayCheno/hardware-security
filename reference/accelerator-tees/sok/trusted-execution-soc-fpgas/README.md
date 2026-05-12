# SoK: Trusted Execution in SoC-FPGAs

- BibTeX key: `perkins2024socsok`
- Category: `accelerator-tees/sok`
- Authors: Garrett Perkins, Benjamin Macht, Lucas L. Ritzdorf, Tristan Running Crane, Brock J. LaMeres, Clemente Izurieta, Ann Marie Reinhold
- Year: 2024
- Venue: 6th IEEE International Conference on Trust, Privacy and Security in Intelligent Systems, and Applications (TPS-ISA 2024); arXiv version posted 2025
- Source: https://arxiv.org/abs/2503.16612
- PDF source: https://arxiv.org/pdf/2503.16612
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Survey lane: confidential-computing network/I/O/data-path defense
- SOTA role: SoC-FPGA TEE SoK boundary and gap map

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 1. 论文基本信息

- 论文标题: SoK: Trusted Execution in SoC-FPGAs
- 作者 / 机构: Garrett Perkins et al. / Montana State University, Idaho National Laboratory, Pacific Northwest National Laboratory
- 发表会议 / 年份: TPS-ISA 2024; arXiv 2025
- 领域分类: 系统 / 安全 / 硬件
- 一句话总结: 论文系统化整理 SoC-FPGA TEE 文献，识别 27 个 primary studies 和 extensible solution 缺口。
- 最核心贡献一句话: 它为 SoC-FPGA/edge accelerator TEE 提供 one-hop taxonomy，但不替代 ShEF、SGX-FPGA 等 primary system papers。

### 2. 研究问题与背景

SoC-FPGA 常用于 edge/IoT/security-critical deployment，但 FPGA 不是为安全作为第一目标设计。论文关注的是 SoC-FPGA-based TEE 的应用、feature 和研究缺口，尤其是 extensible TEE 稀缺的问题。

### 3. 核心方法拆解

方法管线: `ACM/IEEE search -> inclusion criteria -> 27 primary studies -> feature/application taxonomy -> heatmap/gap discussion`。重点 features 包括 hardware acceleration、secure boot、root of trust、attestation、memory security、enclave 和 security monitor。

### 4. 安全性 / 正确性分析

作为 SoK，它不证明某个 TEE 的安全性。它的证据强度来自系统化检索和分类。需要注意 inclusion criteria 偏向 open-source、SoC-based 和 applied research，可能排除 proprietary/cloud FPGA 生产材料。

### 5. 实现细节

无新系统实现。本文提供文献检索、筛选、分类和 gap analysis。PDF 为 arXiv v1，6 页。

### 6. 实验设计分析

无新性能实验。论文报告从 109 篇候选中筛到 27 篇 primary studies，并按 applications/features 做分布统计。它适合作为 coverage/gap evidence，不适合做机制 claim。

### 7. Novelty 分析

分类: solid systems contribution。新意在于把 SoC-FPGA TEE 作为独立 SoK 对象，补足通用 accelerator TEE survey 对 edge/SoC-FPGA 的覆盖。

### 8. 局限性与可能漏洞

最大限制是篇幅短、检索范围有限，且对每个 primary system 的机制细节不深。它偏向 SoC-FPGA，不直接覆盖 PCIe cloud GPU、DPU、SmartNIC 或 TDISP/CoVE-IO。

### 9. 和已有工作的关系

它与 `sok-tee` 互补: `sok-tee` 覆盖 accelerator TEE 设计空间，本文聚焦 SoC-FPGA TEE 文献和 gap。对 ShEF/SGX-FPGA 的机制 claim 仍应回引 primary paper 或 source-limited README。

### 10. 复现与再实现计划

最小复现目标是复现检索流程: 用论文 search strings 在 ACM/IEEE 上重建候选集，应用 inclusion criteria，复核 27 篇 primary studies。验收标准是能重建 application/feature matrix。

### 11. 对后续研究的启发

1. 将 SoC-FPGA TEE features 映射到 accelerator TEE lifecycle 表。2. 对 extensible SoC-FPGA TEE 做缺口分析。3. 区分 edge SoC-FPGA 与 cloud FPGA threat model。4. 将 attestation/secure boot evidence 与 RATS/EAT 对齐。5. 为 FPGA TEE 建立 open artifact checklist。

### 12. Evidence README Addendum

- Evidence role: E2 SoK evidence for SoC-FPGA TEE taxonomy; primary mechanism claims need source papers.
- 标准化 / 发表状态: peer-reviewed TPS-ISA 2024 paper; arXiv PDF verified.
- 对应小方向: accelerator/device TEE; FPGA/SoC-FPGA trusted execution.

#### 内容摘要

本文统计和分类 SoC-FPGA TEE 文献，指出 extensible、feature-rich solutions 稀缺。

#### 研究背景

Edge/IoT 场景中 SoC-FPGA 既承担加速又处理敏感数据，但相关 TEE 方案分散。

#### 解决方案

用系统化检索和 feature/application matrix 组织 27 个 primary studies。

#### 实验结果

Survey/SoK，无新系统实验；关键结果是文献覆盖和 gap taxonomy。

#### 文章评价

适合补 accelerator TEE baseline 中的 SoC-FPGA/edge 视角；不能替代 primary system papers。
<!-- END PAPER REVIEW -->
