# TrustVisor: Efficient TCB Reduction and Attestation

- BibTeX key: mccune2010trustvisor
- Category: trusted-execution-environments
- Authors: Jonathan M. McCune; Yanlin Li; Ning Qu; Zongwei Zhou; Anupam Datta; Virgil D. Gligor; Adrian Perrig
- Year: 2010
- Venue: IEEE Symposium on Security and Privacy 2010
- Source: https://doi.org/10.1109/SP.2010.17
- PDF source: https://www.jonmccune.net/papers/MLQZDGP2010.pdf
- Local PDF: paper.pdf
- Download status: downloaded and verified
- Survey lane: Arm/RISC-V confidential-computing defense
- Evidence role: 基础/历史入口：small hypervisor, protected code blocks, micro-TPM attestation

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 1. 论文基本信息

- 论文标题: TrustVisor: Efficient TCB Reduction and Attestation
- 作者 / 机构: Jonathan M. McCune; Yanlin Li; Ning Qu; Zongwei Zhou; Anupam Datta; Virgil D. Gligor; Adrian Perrig
- 发表会议 / 年份: IEEE Symposium on Security and Privacy 2010, 2010
- 领域分类: 架构 / 安全 / 系统
- 一句话总结: TrustVisor 用小型 hypervisor 和 micro-TPM 改进 Flicker 的频繁 late-launch 开销，为敏感代码块提供隔离、密封和 attestation。
- 最核心贡献一句话: TrustVisor launch -> PAL registration -> nested paging/DEV isolation -> micro-TPM measurement -> remote attestation

### 2. 研究问题与背景

该工作补齐本 survey 的经典谱系缺口。它解决的是早期硬件辅助隔离、attestation、memory safety 或 memory integrity 机制如何从抽象威胁模型落到可实现的硬件/软件边界。其重要性在于现代 CCA、CoVE、SEV-SNP、CHERI/CHERIoT 和 memory-integrity 讨论都继承了这些基本设计问题。

### 3. 核心方法拆解

- 方法/系统: TrustVisor: Efficient TCB Reduction and Attestation
- 架构管线: TrustVisor launch -> PAL registration -> nested paging/DEV isolation -> micro-TPM measurement -> remote attestation
- 关键机制: 硬件保护边界、metadata/measurement 维护、受控执行或受控内存访问。
- 工程与研究贡献边界: 该条目作为 lineage anchor 使用，机制 claim 只限于论文自身 threat model。

### 4. 安全性 / 正确性分析

论文威胁模型关注硬件辅助隔离或内存保护的主要攻击面。侧信道、物理故障、现代 speculative leakage、生产固件供应链等不应从这些论文中外推为已解决。

### 5. 实现细节

实现细节以本地 paper.pdf 为证据。若论文给出 prototype、FPGA、hypervisor、compiler 或 simulator，它只证明对应实验平台上的 feasibility，不证明现代生产平台成熟度。

### 6. 实验设计分析

论文报告约 6K LOC TCB，common-case legacy OS overhead 低于 7%。 评估结论可用于 lineage 和机制比较；跨年代性能数字不能直接和现代 CCA/CoVE/TDX/SEV-SNP 系统横向比较。

### 7. Novelty 分析

分类: strong research novelty。该工作是相应子方向的早期 canonical mechanism，而不是仅作背景罗列。

### 8. 局限性与可能漏洞

依赖当时 x86 virtualization/TPM 语义，不能直接替代现代 CCA/CoVE/TDX 规范证据。 不能把该论文的结论扩展到 out-of-scope side-channel、fault、Rowhammer 或现代 production deployment。

### 9. 和已有工作的关系

该条目连接
next-plan.md 指出的 foundational backlog 与当前 active corpus：TEE/attestation lineage、hardware memory-safety lineage、secure-processor memory encryption/integrity lineage。

### 10. 复现与再实现计划

最低复现目标是重建论文的最小机制模型：实现核心 metadata/measurement/protection check，并用小型 workload 验证正例通过、非法访问或非法状态被拒绝。验收标准是能复现论文的核心安全边界，而不是复现全部历史平台。

### 11. 对后续研究的启发

1. 将经典机制映射到 CCA/CoVE/TDX/SEV-SNP 的现代 trust boundary。
2. 比较 memory ownership、memory encryption、integrity、freshness/replay 的分层差异。
3. 为 CHERI/RV-CURE/CHERIoT 与 HardBound/Watchdog 建立 lineage 表。
4. 为 embedded attestation/TEE 与 server confidential VM 建立 threat-model 对照。
5. 检查经典设计在 DMA、IOMMU、SPDM/TDISP 和 accelerator endpoint 场景下的缺口。

### 12. Evidence README Addendum

- Evidence 定位: 基础/历史入口：small hypervisor, protected code blocks, micro-TPM attestation
- 标准化 / 发表状态: peer-reviewed venue
- 对应小方向: domain.md 中的 TEE lineage、attestation lineage、memory encryption/integrity/replay 或 ISA/hardware-design defense。

#### 内容摘要

TrustVisor 用小型 hypervisor 和 micro-TPM 改进 Flicker 的频繁 late-launch 开销，为敏感代码块提供隔离、密封和 attestation。

#### 研究背景

该论文用于补齐 foundational lineage，避免 survey 只从近期 CCA/CoVE 或 CHERIoT/RV-CURE 跳入现代机制。

#### 解决方案

TrustVisor launch -> PAL registration -> nested paging/DEV isolation -> micro-TPM measurement -> remote attestation

#### 实验结果

论文报告约 6K LOC TCB，common-case legacy OS overhead 低于 7%。

#### 文章评价

优点是机制定位清晰、历史影响大；限制是年代较早、平台假设和现代 confidential-computing production evidence 不同。商业化潜力应通过后续标准、产品或现代系统论文再确认。
<!-- END PAPER REVIEW -->
