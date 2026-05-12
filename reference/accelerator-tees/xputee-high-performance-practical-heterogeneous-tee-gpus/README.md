# XpuTEE: A High-Performance and Practical Heterogeneous Trusted Execution Environment for GPUs

- BibTeX key: `fan2025xputee`
- Category: `accelerator-tees`
- Authors: Shulin Fan, Zhichao Hua, Yubin Xia, Haibo Chen
- Year: 2025
- Venue: ACM Transactions on Computer Systems 43(1-2)
- Source: https://dl.acm.org/doi/10.1145/3719653
- PDF source: https://dl.acm.org/doi/pdf/10.1145/3719653
- Local PDF: unavailable
- Download status: unavailable: ACM DOI PDF endpoint returned HTTP 403 on 2026-05-12; metadata and abstract verified through DOI/ACM-indexed sources, CiteDrive/Mendeley metadata, and Zhichao Hua's homepage, which lists XpuTEE without a public PDF link
- Survey lane: confidential-computing network/I/O/data-path defense
- SOTA role: source-limited current GPU heterogeneous TEE baseline

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 1. 论文基本信息

- 论文标题: XpuTEE: A High-Performance and Practical Heterogeneous Trusted Execution Environment for GPUs
- 作者 / 机构: Shulin Fan, Zhichao Hua, Yubin Xia, Haibo Chen / Shanghai Jiao Tong University IPADS
- 发表会议 / 年份: ACM Transactions on Computer Systems, 2025
- 领域分类: 系统 / 安全 / 架构
- 一句话总结: XpuTEE 提出 CPU/GPU joint TEE abstraction，用 CEnclave 和 XEnclave 组成 XpuEnclave，目标是降低 CPU-GPU confidential communication 开销。
- 最核心贡献一句话: 它是当前 GPU heterogeneous TEE 的重要近年 baseline，但本地没有公开 PDF，正文只能使用 DOI metadata/abstract 层面的有限 claim。

### 2. 研究问题与背景

AI workloads 常在 CPU 与 GPU 间跨设备执行。传统 CPU TEE 保护 CPU-side logic，GPU TEE 保护 device task，但二者之间的加密复制和运行时协作会带来开销。XpuTEE 的公开摘要声称 gap 是缺少兼容现有 CPU/GPU、低通信开销、统一 CPU/GPU abstraction 的 heterogeneous TEE。

### 3. 核心方法拆解

公开 metadata/abstract 支持的机制描述是: `XpuEnclave -> CEnclave protects CPU-side logic + multiple XEnclaves guard GPU tasks -> remove cryptographic operations and extra memory copies on CPU-GPU path`。更细的 page table、driver、attestation、reset 和 cleanup state machine 因 PDF 不可访问，证据不足。

### 4. 安全性 / 正确性分析

本文只能记录公开 abstract 层面的 security goal，不能据此复述完整 threat model。无法确认 side-channel、physical attack、malicious GPU firmware、driver TCB、IOMMU/PCIe path 和 attestation evidence 的具体边界。

### 5. 实现细节

公开信息显示论文为 ACM TOCS 2025、43(1-2)、1-27 页，DOI 为 10.1145/3719653。作者主页列为 ACM TOCS 论文，但没有公开 PDF 链接。实现细节需要 PDF 或 artifact 后再补。

### 6. 实验设计分析

公开 abstract 声称 common AI applications 平均 overhead 为 2.48%。由于本地无 PDF，benchmark 组成、baseline、公平性、variance 和 ablation 均证据不足，正文不得展开强性能 claim。

### 7. Novelty 分析

分类: solid systems contribution, source-limited。公开信息显示 novelty 在 XpuEnclave heterogeneous abstraction 和减少 CPU-GPU path crypto/copy 开销；严格评价需等待完整论文。

### 8. 局限性与可能漏洞

最大限制是本项目当前没有公开 PDF。不能确认 threat model、TCB、attestation、device reset、memory cleanup 和 side-channel exclusions，因此只能作为近年 baseline metadata 和有限 abstract evidence。

### 9. 和已有工作的关系

XpuTEE 应与 Honeycomb、Graviton 和 Telekine 对照: 它公开声称更强调 CPU/GPU joint abstraction 和 communication overhead；Honeycomb 强调 static validation；Telekine 强调 stream side channel；Graviton 强调 GPU hardware secure context。

### 10. 复现与再实现计划

当前只能设定 metadata-driven 复现目标: 找到公开 PDF或 artifact 后，提取 XpuEnclave lifecycle、CEnclave/XEnclave boundary、CPU-GPU memory-sharing path 和 attestation model。没有 PDF 前不做实现复现承诺。

### 11. 对后续研究的启发

1. 等 PDF 可用后补完整 threat model。2. 对比 XpuTEE 和 Honeycomb 的通信路径。3. 研究 XpuEnclave 与 TDISP/CoVE-IO device lifecycle 如何组合。4. 建立 CPU/GPU joint enclave state-machine 表。5. 核验 2.48% overhead 的 workload 范围。

### 12. Evidence README Addendum

- Evidence role: E5/source-limited metadata plus abstract evidence; not a strong mechanism proof yet.
- 标准化 / 发表状态: ACM TOCS 2025 journal article; local PDF unavailable due HTTP 403.
- 对应小方向: accelerator/device TEE; GPU heterogeneous TEE; confidential AI offload.

#### 内容摘要

XpuTEE 公开摘要显示其目标是建立 CPU/GPU unified TEE abstraction，并减少 CPU-GPU confidential communication 中的 cryptographic operations 和 extra copies。

#### 研究背景

AI workload 需要 heterogeneous accelerator，但 CPU-only TEE 与 GPU-only TEE 之间存在协作和性能问题。

#### 解决方案

公开信息只支持 XpuEnclave/CEnclave/XEnclave 级描述；更细机制待 PDF 核验。

#### 实验结果

公开 abstract 声称 common AI applications 平均 overhead 2.48%；由于无本地 PDF，正文只可作为 source-limited metadata，不应展开强性能 claim。

#### 文章评价

XpuTEE 值得进入 active bibliography，因为它是 2025 GPU heterogeneous TEE baseline；但本项目必须保留 source-limited 状态，直到 PDF 可审查。

PDF recovery notes: ACM and metadata mirrors confirm DOI `10.1145/3719653`, ACM TOCS 43(1-2), authors Shulin Fan, Zhichao Hua, Yubin Xia, and Haibo Chen. ResearchGate is request-only and no author-hosted PDF was found.
<!-- END PAPER REVIEW -->
