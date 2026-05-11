# Memory Encryption: A Survey of Existing Techniques

- BibTeX key: `henson2014memory`
- Category: `memory-and-io-fabrics/sok`
- Authors: Michael Henson; Stephen Taylor
- Year: 2014
- Venue: ACM Computing Surveys
- Source: https://doi.org/10.1145/2566673
- PDF source: https://romisatriawahono.net/lecture/rm/survey/computer%20engineering/Henson%20-%20Memory%20Encryption%20-%202014.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12 from a public mirrored PDF; canonical DOI source is ACM
- SOTA role: survey anchor for memory encryption taxonomy; use to distinguish encryption, integrity, authentication, replay protection, and access control.

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 1. 论文基本信息

- 论文标题: Memory Encryption: A Survey of Existing Techniques
- 作者 / 机构: Michael Henson; Stephen Taylor / Dartmouth College
- 发表会议 / 年份: ACM Computing Surveys 2014
- 领域分类: 架构 / 安全 / 系统
- 一句话总结: 论文综述内存加密技术，解释为什么 disk encryption 无法保护明文 DRAM、总线和运行时代码数据。
- 最核心贡献一句话: 它为本 survey 提供 memory encryption、integrity、authentication、replay protection 与 access-control 的概念边界。

### 2. 研究问题与背景

论文解决的是代码和数据在主存中明文存在导致 cold boot、DMA/FireWire、bus snooping、memory modification 等攻击的问题。它强调 CPU 内部常被视为可信边界，而 RAM、bus 和外部组件在威胁模型中不可信。gap 真实存在，因为 PMP/GPT/IOPMP 这类 access-control 与 memory encryption 的保护目标不同。

### 3. 核心方法拆解

论文是 survey，按技术路线讨论硬件增强、OS 辅助、工业专用设备，以及 encryption 与 authentication/attestation/secure boot 的关系。可抽象为 `threat to off-chip memory -> cryptographic primitive/key management -> memory controller/OS integration -> confidentiality/integrity/replay tradeoff`。

### 4. 安全性 / 正确性分析

安全分析覆盖硬件和软件攻击者、物理访问、bus snooping、cold boot、DMA 等。论文明确 memory encryption 主要保护 confidentiality；memory authentication/integrity 和 replay protection 是相关但不同问题。作为 survey，它不证明某一方案安全，只整理假设和风险。

### 5. 实现细节

无统一实现。论文比较模拟器原型、OS-enhanced designs、coprocessor/industrial devices 和早期 commodity primitives。复现不是单系统任务，而是重建分类矩阵并用现代 SEV-SNP/CCA/CoVE 重新映射。

### 6. 实验设计分析

Survey 无新实验。证据来自既有论文、系统设计和攻击案例。局限是 2014 时间截面早于 SEV-SNP、TDX、Arm CCA、RISC-V CoVE，现代 secure nested paging、GPT/GPC、TVM lifecycle 等需额外补充。

### 7. Novelty 分析

分类: solid systems contribution。新意在于系统化整理 memory encryption 技术和威胁模型，而不是提出新机制。

### 8. 局限性与可能漏洞

最大局限是年代较早。它不能直接覆盖现代 confidential VM、memory ownership metadata、device assignment 或 CXL/PCIe IDE。某些“commodity processor primitives”部分已过时，需要用 AMD SEV-SNP、Arm CCA、RISC-V AP-TEE 和 CoVE-IO 更新。

### 9. 和已有工作的关系

它是 memory encryption taxonomy anchor，可与 AMD SEV-SNP、Arm CCA、CoVE/AP-TEE、PCIe IDE、CXL security 和 IOPMP 对照。关键写作边界: PMP/GPT/IOPMP 是 access control/lifecycle，不等于 encryption；SEV-SNP 更接近 encryption+integrity+metadata protection。

### 10. 复现与再实现计划

最小复现目标是构造现代 memory protection taxonomy 表: access control、encryption、integrity、replay、attestation、I/O path。需要阅读 Henson、AMD SEV-SNP、Arm CCA、RISC-V AP-TEE、PCIe IDE。验收标准是 survey 正文不混淆 access-control 和 encryption。

### 11. 对后续研究的启发

1. 更新 2026 版 memory encryption survey。2. 对 CCA/CoVE/SEV-SNP 的 integrity/replay 语义做统一比较。3. 研究 CXL/PCIe IDE 与 CPU memory encryption 的端到端边界。4. 构建 memory-encryption threat-model checklist。5. 分析 encrypted memory 与 forensic/attestation 的冲突。潜在 venue: CSUR、ACM Computing Surveys、IEEE S&P、USENIX Security、HOST。

### 12. SOTA README Addendum

- SOTA 定位: SoK/survey anchor
- 标准化 / 发表状态: peer-reviewed ACM Computing Surveys 2014
- 对应小方向: Memory encryption / integrity / replay protection

#### 内容摘要

这篇 survey 系统整理 memory encryption 的威胁、技术路线和性能/安全权衡。

#### 研究背景

Full disk encryption 不能保护运行时主存中的明文代码和数据，物理访问、DMA 和总线攻击仍可泄露秘密。

#### 解决方案

按硬件增强、OS 辅助和专用工业设备归纳 memory encryption 方案，并解释 encryption 与 authentication、attestation、secure boot 的边界。

#### 实验结果

Survey，无新实验；证据来自既有工作和攻击案例。

#### 文章评价

它是概念边界最有用的 anchor。时间较早，必须结合 SEV-SNP、CCA、CoVE 和 PCIe/CXL 资料更新。
<!-- END PAPER REVIEW -->
