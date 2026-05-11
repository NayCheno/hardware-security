# CoVE: Towards Confidential Computing on RISC-V Platforms

- BibTeX key: `sahita2023cove`
- Category: `risc-v-confidential-computing`
- Authors: Ravi Sahita et al.
- Year: 2023
- Source: https://arxiv.org/abs/2304.06167
- PDF source: https://arxiv.org/pdf/2304.06167
- Local PDF: `paper.pdf`
- Download status: downloaded and verified

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 1. 论文基本信息

- 论文标题: CoVE: Towards Confidential Computing on RISC-V Platforms
- 作者 / 机构: Ravi Sahita et al.; Rivos
- 发表会议 / 年份: arXiv 2023
- 领域分类: 架构 / 系统 / 安全
- 一句话总结: 论文提出 RISC-V confidential VM 的参考架构方向，讨论 ISA、non-ISA 和 SoC 层需求。
- 最核心贡献一句话: 它是 CoVE/AP-TEE 规范化路线前的架构宣言，应作为 RISC-V confidential computing 主线的第一篇代表文献。

### 2. 研究问题与背景

论文针对多租户平台中 firmware、host OS、VMM 和 operator 都进入 tenant TCB 的问题，提出 RISC-V 需要 hardware-attested TEE 来保护 data-in-use。这个 gap 真实存在，因为当前 survey 正文只写 PMP/sIOPMP，不能表达 confidential VM 的 TVM/TSM 结构。

### 3. 核心方法拆解

方法是 reference architecture: untrusted host/resource manager -> trusted security monitor / TSM-like layer -> trusted virtual machine -> platform attestation and memory-protection substrate。论文讨论 privilege、hypervisor、PMP/内存保护、attestation、memory encryption/integrity 与 I/O 要求。

### 4. 安全性 / 正确性分析

论文主要是设计讨论，不提供完整 formal proof。攻击者模型是不信任 host/operator 和部分平台软件；侧信道、物理攻击和设备攻击需要额外机制。安全论证足以支撑 domain.md 补知识点，但不足以独立证明 CoVE 实现安全。

### 5. 实现细节

PDF 未给出完整实现代码或系统实现细节。它更接近架构 proposal。后续应以 RISC-V AP-TEE v0.7、CoVE-IO v0.3.0、IOMMU/AIA 规范补接口和生命周期细节。

### 6. 实验设计分析

论文没有系统性能实验。实验结果应标记为“论文未说明”。与 Arm CCA、AMD SEV-SNP、Intel TDX 的比较主要是设计对照，而不是基准测试。

### 7. Novelty 分析

分类: solid systems contribution。新意在于把 RISC-V confidential VM 的机制需求系统化，并推动 CoVE 规范化；不是完整可评估的产品级实现。

### 8. 局限性与可能漏洞

最大局限是 proposal 性质强、缺少实现和评估。I/O、interrupt、device assignment、attestation evidence chain 在本文中仍不充分，需要 CoVE-IO 和 AP-TEE 规范补齐。

### 9. 和已有工作的关系

它承接 Keystone/Penglai 等 RISC-V enclave lineage，同时对齐 Arm CCA、AMD SEV-SNP、Intel TDX 的 confidential VM 模型。domain.md 应将其放在“RISC-V CoVE/AP-TEE 主线”的起点。

### 10. 复现与再实现计划

最小复现目标是从 AP-TEE 规范抽取 TVM/TSM/COVH/COVG/lifecycle/memory donation/attestation 表。验收标准是能和 Arm RMI/RSI/RMM/GPT/GPC 做一一对照。

### 11. 对后续研究的启发

1. 构建 CoVE lifecycle model。2. 评估 TSM TCB 与 RMM TCB。3. 设计 TVM attestation verifier。4. 建立 CoVE-IO DMA/interrupt 测试。5. 比较 CoVE 与 CCA 的 memory ownership transition。
<!-- END PAPER REVIEW -->
