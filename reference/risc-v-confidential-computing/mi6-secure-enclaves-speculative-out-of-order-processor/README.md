# MI6: Secure Enclaves in a Speculative Out-of-Order Processor

- BibTeX key: `bourgeat2019mi6`
- Category: `risc-v-confidential-computing`
- Authors: Thomas Bourgeat; Ilia Lebedev; Andrew Wright; Sizhuo Zhang; Arvind; Srinivas Devadas
- Year: 2019
- Venue: IEEE/ACM International Symposium on Microarchitecture (MICRO 2019)
- Source: https://arxiv.org/abs/1812.09822
- PDF source: https://arxiv.org/pdf/1812.09822
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Evidence role: Peer-reviewed SOTA. Use for the specific mechanism, evaluation, and threat-model scope established by the source; avoid broader claims outside its evidence class.

<!-- BEGIN REVIEW -->
## Review
### 1. 论文基本信息

- 论文标题: MI6: Secure Enclaves in a Speculative Out-of-Order Processor
- 作者 / 机构: Thomas Bourgeat 等 / MIT CSAIL
- 发表会议 / 年份: MICRO 2019 / arXiv 2019
- 领域分类: 架构 / 硬件 / 安全
- 一句话总结: MI6 在 speculative out-of-order RISC-V processor 中实现 enclave，并处理更复杂的微架构 side channel。
- 最核心贡献一句话: 它把 Sanctum 的 isolation 目标推进到更现实的 OoO、多级内存层次和 speculation 攻击面。

### 2. 研究问题与背景

Spectre 等攻击说明仅保护 architectural memory 不够，shared microarchitectural state 会泄露秘密。MI6 要解决 speculative OoO core 中 enclave strong isolation，包括 cache、MSHR、DRAM controller bandwidth、branch/speculation state 等。

### 3. 核心方法拆解

机制路径为 `enclave scheduling -> protection domain allocation -> steady-state spatial/temporal isolation -> purge on transitions -> security monitor validation`。核心机制包括 purge instruction、page-walk check、machine-mode speculation off、LLC set/MSHR partitioning、cache hierarchy side-channel controls。

### 4. 安全性 / 正确性分析

MI6 定义 Strong Isolation: colocated attacker 能提取的秘密不应超过远端 API attacker。它覆盖软件攻击和 speculative state，排除物理攻击、DoS、hardware bugs、部分 sensors/performance counters。安全边界清晰但实现复杂，依赖硬件 partition 和 purge 正确。

### 5. 实现细节

基于 open-source RiscyOO speculative OoO RISC-V processor，在 AWS F1 FPGA emulation 上运行 Linux 和 SPEC CINT2006。复现难度高，需要老硬件模型、FPGA flow 和 security monitor。

### 6. 实验设计分析

论文报告 protected programs 平均 slowdown 约 16.4%。实验用 SPEC CINT2006 on untrusted Linux，能体现 OoO/memory hierarchy 成本，但不覆盖现代 CFI、CoVE、I/O device assignment 或 real commercial workloads。

### 7. Novelty 分析

分类: strong research novelty。它把 enclave isolation 与 speculative OoO 微架构隔离系统化，明显超越简单 PMP/缓存分区方案。

### 8. 局限性与可能漏洞

最大限制是高复杂度和性能/资源成本。强隔离需要 partition 或 purge 多种 shared resources；real SoC 中还有 IOMMU、PCIe、GPU、CXL、power/thermal side-channel 等未充分覆盖。

### 9. 和已有工作的关系

MI6 继承 Sanctum，解决其未覆盖的 OoO/speculation/memory hierarchy 侧信道。与 Keystone/Penglai 更偏系统/monitor；与 CoVE/AP-TEE 不同，它不是 VM-level confidential computing spec。

### 10. 复现与再实现计划

最小复现目标是在 OoO simulator 中实现 purge 和 cache/MSHR partition，复现一个 Spectre/cache side-channel blocked demo。验收标准是 protection domains 不共享可观察 microarchitectural state，benchmark overhead 可量化。

### 11. 对后续研究的启发

1. 将 MI6 isolation property 迁移到 TSM/RMM hardening。2. 研究 CoVE/CCA 是否需要类似 purge。3. 对 OoO enclave 的 formal noninterference 证明。4. 与 CFI/memory safety 合并防御。5. 扩展到 accelerator/shared LLC/CXL。潜在 venue: MICRO、ISCA、ASPLOS、IEEE S&P、USENIX Security。

### 12. Evidence README Addendum
- Evidence role: Peer-reviewed SOTA. Use for the specific mechanism, evaluation, and threat-model scope established by the source; avoid broader claims outside its evidence class.
- 标准化 / 发表状态: peer-reviewed MICRO 2019
- 对应小方向: RISC-V TEE lineage

#### 内容摘要

MI6 是 speculative out-of-order RISC-V enclave 的代表工作。

#### 研究背景

现代微架构共享状态和 speculation 会破坏进程/enclave 隔离。

#### 解决方案

通过 protection domains、partitioning 和 purge instruction 在 steady state 和 transition 中维持隔离。

#### 实验结果

论文报告 SPEC CINT2006 protected programs 平均 slowdown 约 16.4%。

#### 文章评价

适合写 RISC-V TEE lineage 中的 microarchitectural isolation 分支；实现复杂度和部署成本较高。
<!-- END REVIEW -->
