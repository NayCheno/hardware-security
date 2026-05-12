# SGX-FPGA: Trusted Execution Environment for CPU-FPGA Heterogeneous Architecture

- BibTeX key: `xia2021sgxfpga`
- Category: `accelerator-tees`
- Authors: Ke Xia, Yukui Luo, Xiaolin Xu, Sheng Wei
- Year: 2021
- Venue: 2021 58th ACM/IEEE Design Automation Conference (DAC 2021)
- Source: https://www.researchwithrutgers.com/en/publications/sgx-fpga-trusted-execution-environment-for-cpu-fpga-heterogeneous
- PDF source: https://ieeexplore.ieee.org/document/9586207
- Local PDF: unavailable
- Download status: unavailable: IEEE Xplore public stamp endpoint returned HTTP 418 on 2026-05-12; Rutgers metadata page and DOI verified
- Survey lane: confidential-computing network/I/O/data-path defense
- SOTA role: source-limited CPU-FPGA TEE metadata baseline

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 1. 论文基本信息

- 论文标题: SGX-FPGA: Trusted Execution Environment for CPU-FPGA Heterogeneous Architecture
- 作者 / 机构: Ke Xia, Yukui Luo, Xiaolin Xu, Sheng Wei
- 发表会议 / 年份: DAC 2021
- 领域分类: 系统 / 安全 / 硬件
- 一句话总结: 公开 metadata 表明 SGX-FPGA 试图通过 Intel SGX enclave 与 FPGA 之间的 trusted hardware isolation path 构建 CPU-FPGA TEE。
- 最核心贡献一句话: 该条目只作为 source-limited metadata baseline，不能在正文中做强机制 claim。

### 2. 研究问题与背景

CPU-based SGX 不直接支持 FPGA offload。公开摘要声称 SGX-FPGA 要解决 CPU-FPGA heterogeneous architecture 中 FPGA cloud service 的 TEE 缺口。由于无公开 PDF，本项目只能确认问题陈述和高层 claim。

### 3. 核心方法拆解

公开 metadata 支持的机制描述是: `SGX enclave -> trusted hardware isolation path -> FPGA execution -> real CPU-FPGA hardware evaluation`。缺少 PDF，无法可靠说明 bitstream loading、DMA/MMIO control、attestation、key exchange、cleanup 或 side-channel boundary。

### 4. 安全性 / 正确性分析

证据不足以评价 threat model。不能确认是否防御 malicious host OS、cloud shell logic、physical FPGA access、DMA attack、side channel 或 malicious bitstream。正文只可写“source-limited metadata record exists”，不应比较机制优劣。

### 5. 实现细节

Rutgers metadata page 记录该论文发表于 DAC 2021，页码 301-306，DOI 10.1109/DAC18074.2021.9586207。公开摘要称实验基于 real CPU-FPGA hardware，但实现细节不可审查。

### 6. 实验设计分析

公开摘要只称 high security and low performance overhead。没有 PDF 时，benchmark、baseline、metric 和硬件配置均不可核验；不得在正文中使用性能数值或机制细节。

### 7. Novelty 分析

分类: source-limited metadata。若完整论文可用，它可能是 CPU-FPGA trusted path baseline；当前只能作为候选 lineage marker。

### 8. 局限性与可能漏洞

最大限制是没有公开 PDF，且 IEEE metadata 页面受限。由于 CPU-FPGA path 涉及 SGX EPC、driver、PCIe/DMA、FPGA shell 和 bitstream supply chain，不能凭摘要推断安全覆盖。

### 9. 和已有工作的关系

SGX-FPGA 可与 ShEF 对照: SGX-FPGA 高层上桥接 CPU SGX 与 FPGA；ShEF 更强调 FPGA-local boot/attestation 和 Shield。当前只能记录这个关系方向，不能展开机制比较。

### 10. 复现与再实现计划

复现前置条件是获得论文 PDF 或作者公开 artifact。最低核验目标是提取 CPU-FPGA trust path、FPGA memory/DMA policy、attestation evidence 和 cleanup lifecycle。

### 11. 对后续研究的启发

1. 继续追踪公开 PDF。2. 和 ShEF 比较 CPU-rooted 与 FPGA-rooted TEE。3. 核验 SGX enclave 是否成为 bottleneck/TCB。4. 检查 DMA/IOMMU 与 FPGA shell threat model。5. 不在正文中使用未核验机制 claim。

### 12. Evidence README Addendum

- Evidence role: E5/source-limited metadata only.
- 标准化 / 发表状态: DAC 2021 conference paper metadata verified; local PDF unavailable.
- 对应小方向: accelerator/device TEE; CPU-FPGA heterogeneous TEE lineage.

#### 内容摘要

SGX-FPGA 是 CPU-FPGA TEE 的 metadata-limited baseline，公开摘要声称用 SGX 与 FPGA trusted isolation path 保护 heterogeneous execution。

#### 研究背景

CPU TEE 默认不覆盖 FPGA offload，CPU-FPGA cloud service 需要额外可信路径。

#### 解决方案

证据不足。只能记录“bridging SGX enclaves and FPGAs”的公开高层 claim。

#### 实验结果

证据不足。公开摘要声称 real hardware evaluation，但本项目没有 PDF 核验。

#### 文章评价

保留该记录有助于说明 CPU-FPGA TEE lineage，但必须显式标注 source-limited，不能作为强机制或性能证据。
<!-- END PAPER REVIEW -->
