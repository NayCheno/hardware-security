# Serverless Functions Made Confidential and Efficient with Split Containers

- BibTeX key: `shi2025cofunc`
- Category: `trusted-execution-environments`
- Authors: Jiacheng Shi, Jinyu Gu, Yubin Xia, Haibo Chen
- Year: 2025
- Venue: USENIX Security Symposium 2025
- Source: https://www.usenix.org/conference/usenixsecurity25/presentation/shi-jiacheng
- PDF source: https://www.usenix.org/system/files/usenixsecurity25-shi-jiacheng.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12 with `pdfinfo`; 21 pages
- Survey lane: Arm/RISC-V confidential-computing defense; cross-platform TEE deployment background
- Evidence role: E1 peer-reviewed primary paper / background substrate for confidential serverless and split confidential containers. Use for CVM-based serverless/container deployment tradeoffs; do not cite as an Arm CCA mechanism paper.

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 1. 论文基本信息

- 论文标题: Serverless Functions Made Confidential and Efficient with Split Containers
- 作者 / 机构: Jiacheng Shi, Jinyu Gu, Yubin Xia, Haibo Chen; Shanghai Jiao Tong University
- 发表会议 / 年份: USENIX Security 2025
- 领域分类: 系统 / 安全 / OS
- 一句话总结: CoFunc 用 split container 把 serverless function 的安全执行放进 CVM，同时把资源管理和容器管理留在不可信 host Linux 中。
- 最核心贡献一句话: 它提出将 confidential container 拆成 CVM 内的 function-oriented OS/libOS 和 CVM 外 shadow container，从而降低 TCB 并缓解 CVM cold start 与 resource provisioning 问题。

### 2. 研究问题与背景

论文要解决 confidential serverless 的部署矛盾: serverless 函数短生命周期、高并发、弹性伸缩，而现有 CVM-based confidential container 通常一函数一 CVM，导致 cold start、内存共享缺失、资源浪费和大 TCB。传统 OS-based containers 隔离弱，VM-based containers TCB 和启动成本高，SGX container 路线受架构和 enclave startup 限制。

这个 gap 对本 survey 成立，因为 TEE design space 需要说明 confidential computing 不只表现为 VM/Realm/TVM，还会被上层 serverless/container packaging 约束。CoFunc 是 cross-platform confidential container/serverless background substrate；它不是 Arm CCA 机制论文，不能支撑 Arm RME/RMM/GPT/GPC 的机制 claim。

### 3. 核心方法拆解

机制路径是: `host shadow container manages cgroups/namespaces/resources -> resource granted to confidential container -> function executes inside CVM microkernel + libOS -> untrusted host Linux provides management/I/O substrate -> libOS protects I/O with encryption/authentication`。

核心模块包括 split container architecture、CVM microkernel、per-function libOS、shadow container、host Linux/QEMU patches、resource granting、in-CVM isolation 和 encrypted/authenticated I/O path。关键选择是把 container management 和 function execution 分离: 安全相关执行在 CVM 内，复杂 management 留在 CVM 外。

### 4. 安全性 / 正确性分析

安全目标是保护 confidential container 的机密性和完整性，使其不受 CVM 外 compromised privileged software、CVM 内恶意 co-located confidential containers 以及论文 threat model 中的物理攻击影响。CoFunc 的隔离依赖 CVM 硬件和内部 microkernel/libOS，而不是 Linux guest OS。

强假设是 CVM 硬件、microkernel/libOS、加密/authenticated I/O 路径和 function-oriented OS 正确。它不解决 generic serverless application bug、side-channel、DoS、供应链、云平台调度公平性或任意设备可信 I/O。对本 survey 应写成 deployment substrate 和 TCB/性能 tradeoff。

### 5. 实现细节

论文实现 CoFunc 原型，支持 AMD SEV 和 Intel TDX。系统包括约 20K LoC 的 CVM microkernel、function libOS、shadow container、host Linux/QEMU patches 和 benchmark scripts。artifact appendix 指向 GitHub/Figshare，并要求 AMD SEV-SNP 支持、较多 CPU cores 和内存。README 当前主证据来自 USENIX 正式论文 PDF。

### 6. 实验设计分析

实验使用 FunctionBench、ServerlessBench 和 real-world functions，对比 Kata-CVM、optimized SEV microVM、native lean container 等 baseline。论文报告 CoFunc 相比 CVM-based confidential container 最高 60x(SEV) 和 215x(TDX) 性能提升，平均相比 lean non-confidential container 低于 14% overhead，并在 200 functions 场景显著降低内存需求。强项是 benchmark 贴近 serverless；局限是系统复杂、artifact 硬件要求高，且结果主要覆盖 SEV/TDX，不直接证明 Arm CCA/RISC-V CoVE 上可用。

### 7. Novelty 分析

Novelty 分类: `strong research novelty`。新意在 split container: 将 security 和 management 分离，用小 CVM OS 支撑多函数安全执行，同时复用 host Linux 管理能力。它对 survey 的价值是补 confidential serverless/container deployment，而不是补某个 ISA 或 CCA primitive。

### 8. 局限性与可能漏洞

最大局限是 CoFunc 引入新的 CVM microkernel/libOS TCB，且 encrypted/authenticated I/O 需要正确覆盖 host-provided rootfs/network 路径。多函数共享 CVM 需要可靠的 in-CVM isolation；microkernel bug 会影响多个函数。Arm CCA、RISC-V CoVE/AP-TEE 的实现证据缺失。它不解决 TDISP/SPDM、device assignment、interrupt delivery 或 DPU/NIC endpoint identity。

### 9. 和已有工作的关系

CoFunc 与 RContainer、SCONE、Kata-CVM、BlackBox、X-Container、PIE 等容器/TEE runtime 工作相关。与 RContainer 不同，CoFunc 不是 Arm CCA container architecture，而是 SEV/TDX 上的 confidential serverless split-container 系统。与 CPC 互补: CPC 解决 CVM maintenance procedure，CoFunc 解决 serverless confidential container packaging。

### 10. 复现与再实现计划

最低复现目标是运行 artifact 中一个 serverless function，比较 CoFunc、Kata-CVM 和 native lean container 的端到端 latency。需要 SEV-SNP 或 TDX 硬件、Linux/KVM/QEMU patches、CoFunc CVM OS、shadow container runtime、FunctionBench/ServerlessBench。验收标准是 confidential container 在 CVM 内执行、host shadow container 只做管理、跨容器隔离测试通过、启动延迟和内存趋势接近论文。

### 11. 对后续研究的启发

1. Arm CCA split-container port: 研究 Realm/RMM/GPT/GPC 是否能支持 CoFunc-like serverless packaging。
2. CoVE/AP-TEE confidential serverless: 将 split container 映射到 TVM/TSM lifecycle。
3. Device-aware confidential serverless: 把 CoFunc 与 vNIC/DPU/TDISP/SPDM 组合，解决 serverless I/O path。
4. Formal verification of CVM microkernel: 缩小 CoFunc TCB 并验证 in-CVM isolation。
5. Attested function supply chain: 把 CoFunc function image、libOS、policy 和 aDNS/TLS+RA evidence 绑定。

### 12. SOTA README Addendum

- SOTA 定位: Academic SOTA
- 标准化 / 发表状态: peer-reviewed USENIX Security 2025
- 对应小方向: Confidential serverless, CVM-based confidential containers, TEE deployment substrate

#### 内容摘要

CoFunc 是一个 CVM-based confidential serverless 系统，通过 split container 把安全执行和容器管理分离，降低 TCB 并改善冷启动与资源效率。

#### 研究背景

Serverless 函数短生命周期、高并发和弹性伸缩，与传统一函数一 CVM 的 confidential container 设计不匹配；Linux guest OS 又会带来大 TCB。

#### 解决方案

CoFunc 在 CVM 内部署 function-oriented microkernel + libOS 执行多个 confidential containers，CVM 外 shadow container 负责 cgroups/namespaces/resource management，I/O 通过加密和认证保护。

#### 实验结果

论文使用 FunctionBench 和 ServerlessBench，报告相对 Kata-CVM 最高 60x(SEV) 和 215x(TDX) 提升，相比 lean container 平均低于 14% overhead，并在并发函数场景显著降低内存开销。

#### 文章评价

CoFunc 是 confidential serverless/container deployment 的关键顶会证据。它应作为 cross-platform substrate 使用，不应被写成 Arm CCA、RISC-V CoVE、TDISP/SPDM 或设备可信路径机制。
<!-- END PAPER REVIEW -->
