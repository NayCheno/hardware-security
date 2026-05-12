# RISC-V CoVE-IO Specification

- BibTeX key: `riscv_cove_io_2026`
- Category: `risc-v-confidential-computing`
- Authors: RISC-V Non-ISA AP-TEE-IO contributors
- Year: 2026
- Source: https://github.com/riscv-non-isa/riscv-ap-tee-io
- Release: https://github.com/riscv-non-isa/riscv-ap-tee-io/releases/tag/v0.3.0
- PDF source: https://github.com/riscv-non-isa/riscv-ap-tee-io/releases/download/v0.3.0/riscv-cove-io.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Standardization status: Draft/not ratified: CoVE-IO v0.3.0
- Evidence role: Draft/not ratified: CoVE-IO v0.3.0. Public RISC-V CoVE-IO source for trusted I/O concepts; always mark with this status.

<!-- BEGIN PAPER REVIEW -->
## Paper Review
### 1. 论文基本信息

- 论文标题: Confidential VM Extension I/O (CoVE-IO) for Confidential Computing on RISC-V platforms
- 作者 / 机构: Samuel Ortiz; Jiewen Yao; RISC-V AP-TEE-IO Task Group
- 发表会议 / 年份: Draft/not ratified: CoVE-IO v0.3.0 / 2026
- 领域分类: 架构 / 系统 / 安全
- 一句话总结: 规范定义 RISC-V TVM 使用真实设备时的 device identity、TDISP/SPDM、PCIe IDE、trusted MMIO/DMA 和 ABI。
- 最核心贡献一句话: 它是 RISC-V confidential I/O / TEE-I/O 的当前 Draft/not ratified: CoVE-IO v0.3.0 规范证据。

### 2. 研究问题与背景

AP-TEE 保护 TVM 内存和执行，但真实设备会通过 MMIO、DMA、interrupt 和 PCIe/CXL.io link 接触 TVM 数据。CoVE-IO 要解决设备可信连接、接口绑定、DMA/MMIO 安全、trusted MSI 和设备/TVM 相互 attestation。Draft/not ratified: CoVE-IO v0.3.0。

### 3. 核心方法拆解

机制路径为 `platform ownership -> device initialization -> SPDM secure session -> TDISP interface binding -> IDE link -> TVM verifies device -> trusted MMIO/DMA/interrupt ABI`。核心对象包括 TDI、TDM、DSM/RDSM、TSM、SPDM、TDISP、DOE、IDE、IOMMU assignment、CoVE-IO manifest、COVH/COVG/COVT functions。

### 4. 安全性 / 正确性分析

规范列出 trusted MMIO malicious access/remapping/redirection/pre-configuration、PCIe link MITM、PCIe ID spoofing、confused-deputy DMA remapping 等威胁。强假设是设备支持 PCIe/CXL.io、TDISP、DOE、IDE，平台 TSM/RDSM 正确，IOMMU/IOPMP/AIA 组合无错。它不证明具体实现安全，也不解决所有 DoS/side-channel。

### 5. 实现细节

无单一实现。实现需要 device firmware 支持 TDISP/SPDM/IDE，host/TSM/RDSM 管理 device connection transcript、IDE key、interface binding 和 ABI。复现比 AP-TEE 更难，因为需要 device model 或 PCIe/CXL.io simulator。

### 6. 实验设计分析

规范草案无实验。验证应覆盖 device connect/disconnect、SPDM key update、IDE refresh、TDI report/state、MMIO mapping、interface region add/reclaim、malicious remapping 和 interrupt injection。不能作为性能或产品成熟度证据。

### 7. Novelty 分析

分类: strong systems/spec contribution。它把 confidential VM 的边界从 CPU/memory 扩展到 device and fabric path，是 RISC-V 追平 CCA/TDISP/IDE 生态的关键接口。

### 8. 局限性与可能漏洞

最大限制是 Draft/not ratified: CoVE-IO v0.3.0 和设备生态依赖强。TDISP/SPDM/IDE 支持度、证书链、热更新/reattestation、multi-function device、ATS/PRI cache、shared accelerators 和 CXL memory device 都可能成为复杂风险点。

### 9. 和已有工作的关系

CoVE-IO 与 sIOPMP、RISC-V IOMMU、AIA、IOPMP、PCIe IDE、TDISP/SPDM 强相关。它比 sIOPMP 更完整，后者主要解决 I/O access control；它也可与 Arm RME-DA/MEC/SMMU/device assignment 对照。

### 10. 复现与再实现计划

最小复现目标是构建一个 simulated PCIe device + TSM/RDSM harness，完成 SPDM transcript、TDISP binding、MMIO map 和 DMA policy test。需要 CoVE-IO ABI stub、IOMMU/IOPMP model、SPDM/TDISP library。验收标准是 TVM 只接受 attested interface，host 无法重映射 trusted MMIO/DMA，IDE key lifecycle 可观察。

### 11. 对后续研究的启发

1. CoVE-IO ABI fuzzing。2. TDISP/SPDM/IDE 与 IOMMU/IOPMP 的端到端形式化模型。3. Trusted MSI 与 AIA IMSIC 的安全属性验证。4. CXL memory/accelerator 在 CoVE-IO 下的 ownership transfer。5. Devlore/ACAI/sIOPMP 与 CoVE-IO 的 unified device TEE taxonomy。潜在 venue: IEEE S&P、USENIX Security、NDSS、ASPLOS、HOST。

### 12. Evidence README Addendum
- Evidence role: Draft/not ratified: CoVE-IO v0.3.0. Public RISC-V CoVE-IO source for trusted I/O concepts; always mark with this status.
- 标准化 / 发表状态: Draft/not ratified: CoVE-IO v0.3.0
- 对应小方向: RISC-V CoVE-IO / TEE-I/O

#### 内容摘要

CoVE-IO 定义 TVM 与真实设备建立 confidential I/O 关系所需的协议、ABI 和威胁模型。

#### 研究背景

CPU/内存隔离无法保护设备 DMA、MMIO、中断和 PCIe/CXL.io link 上的数据路径。

#### 解决方案

组合 TDISP、SPDM、PCIe IDE、IOMMU/IOPMP/AIA 和 CoVE ABI，实现设备连接、接口绑定、attestation 和 trusted MMIO/DMA。

#### 实验结果

规范草案，无新实验。

#### 文章评价

它是 RISC-V trusted I/O 最重要资料，但成熟度低于 ratified specs，正文必须标注 Draft/not ratified: CoVE-IO v0.3.0。
<!-- END PAPER REVIEW -->
