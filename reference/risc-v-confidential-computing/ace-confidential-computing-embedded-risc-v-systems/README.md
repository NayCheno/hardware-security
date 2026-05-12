# ACE: Confidential Computing for Embedded RISC-V Systems

- BibTeX key: `ozga2025ace`
- Category: `risc-v-confidential-computing`
- Authors: Wojciech Ozga; Guerney D. H. Hunt; Michael V. Le; Lennard Gaeher; Avraham Shinnar; Elaine R. Palmer; Hani Jamjoom; Silvio Dragone
- Year: 2025
- Source: https://arxiv.org/abs/2505.12995
- PDF source: https://arxiv.org/pdf/2505.12995
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Evidence role: Draft/not ratified. Use with explicit draft, preprint, or not-ratified status; do not treat as ratified standard, mature production evidence, or peer-reviewed consensus unless the source metadata says so.

<!-- BEGIN REVIEW -->
## Review
### 1. 论文基本信息

- 论文标题: ACE: Confidential Computing for Embedded RISC-V Systems
- 作者 / 机构: Wojciech Ozga 等 / IBM Research, MPI-SWS, IBM T.J. Watson
- 发表会议 / 年份: arXiv 2025
- 领域分类: 系统 / 安全 / 架构
- 一句话总结: ACE 把 VM-based confidential computing 带到嵌入式 RISC-V，并强调可验证 firmware 和低成本硬件。
- 最核心贡献一句话: 它是 RISC-V embedded confidential computing 的近期 Draft/not ratified 证据，并声称影响了 CoVE specification 的 embedded scope。

### 2. 研究问题与背景

嵌入式 mission-critical 系统需要隔离、验证和供应链 compartmentalization，但资源、成本和验证预算有限。ACE 目标是在 RISC-V virtualization support 上运行 TVM/TSM 模型，降低 hypervisor 信任，并支持形式化验证友好的设计。

### 3. 核心方法拆解

机制路径为 `early boot TSM -> static confidential memory partition -> one-step TVM promotion -> context switch/resource control -> Rust/RefinedRust verification loop`。核心模块包括 TSM、hypervisor/VM、TVM、static memory partitioning、single-step creation、Rust implementation、formal invariants。

### 4. 安全性 / 正确性分析

威胁模型是 software-level adversary 控制 hypervisor 和 TVM lifecycle/input，目标是破坏 TVM integrity/confidentiality 或 impersonate TVM。排除物理攻击和硬件错误，假设 TVM software correct。强点是将 verification 作为设计原则；弱点是硬件和 microarchitectural traces 假设较强。

### 5. 实现细节

实现为开源/royalty-free RISC-V embedded confidential computing stack，使用 Rust，并对核心部分用 RefinedRust/Rocq 证明 memory safety。评估在首批支持 RISC-V virtualization 的硬件上运行 Linux TVMs。

### 6. 实验设计分析

论文报告 process-intensive workloads 低 overhead，multi-vCPU network intensive workloads 最高约 50% overhead。实验说明可行性，但对设备/CoVE-IO、复杂外设、中断、real-time certification 的覆盖仍有限。

### 7. Novelty 分析

分类: strong research novelty。它把 confidential VM、嵌入式约束、Rust/verification methodology 和 RISC-V CoVE 兼容性结合。

### 8. 局限性与可能漏洞

最大限制是 arXiv 状态和目标场景较窄。静态 partition 和 single-step creation 牺牲云场景弹性；物理攻击、DMA 设备、microarchitectural leakage 和 TVM 软件 bug 不在核心保护范围。

### 9. 和已有工作的关系

ACE 与 CoVE/AP-TEE 共享 TVM/TSM 术语，偏 embedded deployment；与 CHERIoT/TIMBER-V 都面向 embedded，但 ACE 是 VM-based confidential computing，不是 capability/typed-memory enclave。

### 10. 复现与再实现计划

最小复现目标是在 RISC-V virtualization 硬件或 emulator 上启动 ACE TSM，promote 一个 Linux TVM。需要 ACE repo、Rust toolchain、RISC-V board/QEMU、network/process benchmarks。验收标准是 hypervisor 无法访问 TVM memory，attestation/measurement 可用，overhead 可复测。

### 11. 对后续研究的启发

1. ACE 与 AP-TEE v0.7 的 ABI/semantic diff。2. TSM Rust verification 模板。3. embedded CoVE-IO 设备模型。4. 静态 partition 与 dynamic memory donation 的 tradeoff。5. 面向 certification 的 confidential computing design rules。潜在 venue: USENIX Security、IEEE S&P、ASPLOS、RTSS、HOST。

### 12. Evidence README Addendum
- Evidence role: Draft/not ratified. Use with explicit draft, preprint, or not-ratified status; do not treat as ratified standard, mature production evidence, or peer-reviewed consensus unless the source metadata says so.
- 标准化 / 发表状态: arXiv preprint 2025
- 对应小方向: RISC-V TEE lineage; RISC-V CoVE / AP-TEE confidential VM

#### 内容摘要

ACE 是 embedded RISC-V 上的 VM-based confidential computing 方案，强调 TSM 简洁性和验证友好。

#### 研究背景

任务关键嵌入式系统需要隔离和可验证性，但不能承担云端复杂 confidential computing stack 的成本。

#### 解决方案

采用静态 confidential memory partition、single-step TVM creation、Rust/RefinedRust 验证方法和 RISC-V virtualization。

#### 实验结果

论文报告 process-intensive 低开销，multi-vCPU network intensive workloads 最高约 50% overhead。

#### 文章评价

适合补 RISC-V lineage 的 embedded confidential VM 分支。需标注 arXiv，并与 CoVE draft 状态区分。
<!-- END REVIEW -->
