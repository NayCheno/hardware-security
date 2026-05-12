# LO-FAT: Low-Overhead Control Flow ATtestation in Hardware

- BibTeX key: `dessouky2017lofat`
- Category: `attestation`
- Authors: Ghada Dessouky; Shaza Zeitouni; Thomas Nyman; Andrew Paverd; Lucas Davi; Patrick Koeberl; N. Asokan; Ahmad-Reza Sadeghi
- Year: 2017
- Venue: 54th Design Automation Conference (DAC 2017)
- Source: https://research.aalto.fi/en/publications/lo-fat-low-overhead-control-flow-attestation-in-hardware/
- DOI: https://doi.org/10.1145/3061639.3062276
- PDF source: https://arxiv.org/pdf/1706.03754
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12 from arXiv after ACM Author-Izer returned HTTP 403 to automated download
- Evidence class: E1 peer-reviewed primary paper, public PDF via arXiv
- Evidence role: Peer-reviewed runtime/control-flow attestation SOTA lineage. Use for hardware CFA design and RISC-V SoC prototype claims; do not cite it as a general TEE, CCA/CoVE, or verifier-token standard.

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 内容摘要

LO-FAT 把 C-FLAT 的 control-flow attestation 思路下沉到硬件，在处理器旁路记录分支、跳转、返回等控制流事件，生成可远程验证的路径摘要。

### 研究背景

C-FLAT 能检测运行期控制流异常，但软件插桩带来性能开销和 legacy compatibility 问题。嵌入式系统需要在不改写目标程序的情况下完成运行路径证明。

### 解决方案

LO-FAT 用硬件 branch filter、loop monitor、hash engine 和 metadata storage 透明捕获控制流事件。关键妙处是并行于主处理器收集路径信息，不要求软件插桩，并用 loop metadata 压缩循环路径。

### 实验结果

论文基于 RISC-V SoC proof-of-concept 做 RTL/仿真评估，报告对被证明软件没有处理器停顿，硬件面积和片上内存开销可接受；具体数值以原文为准。

### 文章评价

优点是把 runtime attestation 从软件插桩推向硬件实现，商业上更接近 MCU/SoC 级安全 IP；不足是需要硬件集成和受限 threat model，难直接覆盖复杂 OS、DMA、device path 或 CCA/CoVE confidential VM evidence chain。
<!-- END PAPER REVIEW -->
