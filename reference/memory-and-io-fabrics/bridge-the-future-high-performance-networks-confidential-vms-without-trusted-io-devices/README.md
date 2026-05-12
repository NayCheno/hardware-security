# Bridge the Future: High-Performance Networks in Confidential VMs without Trusted I/O devices

- BibTeX key: `li2024folio`
- Category: `memory-and-io-fabrics`
- Authors: Mengyuan Li; Shashvat Srivastava; Mengjia Yan
- Year: 2024
- Venue: arXiv
- Source: https://arxiv.org/abs/2403.03360
- PDF source: https://arxiv.org/pdf/2403.03360
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Survey lane: confidential-computing network/I/O/data-path defense
- Evidence role: Draft/not ratified. arXiv/preprint evidence for CVM networking without trusted I/O devices; use as a cautious data-path design point, not as a standard or universal trusted-I/O replacement.

<!-- BEGIN PAPER REVIEW -->
## Paper Review
### 1. 论文基本信息

- 论文标题: Bridge the Future: High-Performance Networks in Confidential VMs without Trusted I/O devices
- 作者 / 机构: Mengyuan Li; Shashvat Srivastava; Mengjia Yan
- 发表会议 / 年份: arXiv 2024
- 领域分类: 网络 / 系统 / 安全
- 一句话总结: FOLIO 认为网络 I/O 不一定需要 trusted I/O 设备，使用 DPDK/SNP 优化即可接近理想 TIO 网络性能。
- 最核心贡献一句话: 它为本 survey 提供“不要把所有网络性能问题都归结为 TDISP/IDE”的关键反例。

### 2. 研究问题与背景

Trusted I/O 可以降低 CVM I/O overhead，但会扩大 TCB 到设备且商业可用性有限。网络流量在 CVM threat model 下通常仍会使用端到端加密，因此 PCIe bus 上额外的 I/O encryption 对网络场景未必总是收益最大。论文的 gap 是: 如何在没有 TIO 设备时让 CVM 获得高性能网络。

### 3. 核心方法拆解

机制路径为 `SEV-SNP CVM -> encrypted network endpoint assumption -> DPDK data path analysis -> remove avoidable shared/private transitions -> FOLIO optimized packet path -> near-TIO network throughput`。核心是分析 SNP VM 网络性能瓶颈并设计 DPDK extension。

### 4. 安全性 / 正确性分析

安全边界刻意不信任 I/O device。它依赖 CVM 内部软件和端到端网络加密保护 payload，而不是把 NIC 加入 TCB。这个假设适合网络流量，但不适合 GPU/ML accelerator、storage accelerator 或会处理 plaintext 的 SmartNIC/DPU。

### 5. 实现细节

论文实现 FOLIO，基于 AMD SEV-SNP 和 DPDK。实现焦点是 packet processing path、shared/private memory transitions、copy/encryption overhead 和 data-plane fast path。

### 6. 实验设计分析

论文报告 FOLIO 相对理想 TIO configuration 性能差距小于 6%。评价价值在于它把 trusted I/O 的性能收益拆解到网络场景，而不是默认 trusted device 总是最佳。

### 7. Novelty 分析

分类: solid systems contribution。它不是新硬件机制，而是在 confidential VM networking 中提出重要设计判断: 对网络，端到端协议和软件 data path 优化可能比扩大 TCB 更实用。

### 8. 局限性与可能漏洞

该结论不能泛化到所有 I/O。若设备需要处理明文、做 packet inspection/offload、RDMA memory operation、storage encryption offload 或 AI inference，untrusted device path 可能不够。论文基于 SEV-SNP，不直接证明 Arm CCA/CoVE 的同等效果。

### 9. 和已有工作的关系

与 AMD SEV-TIO、CoVE-IO、TDISP/IDE 形成对照: 后者扩展 TCB 到 device，FOLIO 维持 device outside TCB 并优化软件路径。Survey 应把它放入“network I/O 特例”而非通用 trusted I/O 替代品。

### 10. 复现与再实现计划

需要 SEV-SNP 平台、DPDK、网络 benchmark 和可比较的 shared/private memory 配置。验收标准是复现 packet throughput/latency，并拆分 copy、encryption、VM exit 和 shared buffer overhead。

### 11. 对后续研究的启发

1. Arm CCA/CoVE 下复现 FOLIO-style network path。2. 区分 encrypted endpoint network I/O 与 plaintext accelerator offload。3. 构建 CVM networking taxonomy。4. 比较 trusted vNIC、vhost-user、DPDK、SR-IOV、TDISP。5. 分析 RDMA verbs 是否仍适用 FOLIO 的假设。

### 12. Evidence README Addendum
- Evidence role: Draft/not ratified. arXiv/preprint evidence for CVM networking without trusted I/O devices; use as a cautious data-path design point, not as a standard or universal trusted-I/O replacement.
- 标准化 / 发表状态: arXiv preprint, 2024
- 对应小方向: 机密计算网络 / I/O / fabric 防御

#### 内容摘要

FOLIO 是针对 CVM high-performance networking 的软件数据路径方案。

#### 研究背景

Trusted I/O 可降低 overhead，但扩大 TCB 且设备不可用；网络流量本身常有端到端加密。

#### 解决方案

通过 DPDK extension 和路径优化减少 SEV-SNP 网络 overhead，避免信任 NIC。

#### 实验结果

论文报告相对理想 TIO 网络配置性能差距小于 6%。

#### 文章评价

这是网络方向必须纳入的材料，因为它防止 survey 把“trusted I/O”写成网络性能唯一答案。
<!-- END PAPER REVIEW -->
