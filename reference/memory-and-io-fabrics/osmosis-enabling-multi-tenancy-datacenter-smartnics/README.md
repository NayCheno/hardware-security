# OSMOSIS: Enabling Multi-Tenancy in Datacenter SmartNICs

- BibTeX key: `khalilov2024osmosis`
- Category: `memory-and-io-fabrics`
- Authors: Mikhail Khalilov, Marcin Chrapek, Siyuan Shen, Alessandro Vezzu, Thomas Benz, Salvatore Di Girolamo, Timo Schneider, Daniele De Sensi, Luca Benini, Torsten Hoefler
- Year: 2024
- Venue: USENIX ATC 2024
- Source: https://www.usenix.org/conference/atc24/presentation/khalilov
- PDF source: https://www.usenix.org/system/files/atc24-khalilov.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12 with `pdfinfo`; 18 pages
- Survey lane: confidential-computing network/I/O/data-path defense
- Evidence role: E1 peer-reviewed primary paper / background substrate for SmartNIC multi-tenancy and resource-management context. Use for SmartNIC resource isolation, QoS, scheduling, and on-path offload pressure; do not cite as a confidential-I/O, TEE, SPDM, TDISP, attestation, or cryptographic data-protection scheme.

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 1. 论文基本信息

- 论文标题: OSMOSIS: Enabling Multi-Tenancy in Datacenter SmartNICs
- 作者 / 机构: Mikhail Khalilov, Marcin Chrapek, Siyuan Shen, Alessandro Vezzu, Thomas Benz, Salvatore Di Girolamo, Timo Schneider, Daniele De Sensi, Luca Benini, Torsten Hoefler; ETH Zurich, Sapienza University of Rome
- 发表会议 / 年份: USENIX ATC 2024
- 领域分类: 系统 / 网络 / 架构
- 一句话总结: OSMOSIS 为 on-path SmartNIC 提供面向多租户的资源管理和 QoS 机制。
- 最核心贡献一句话: 它把 SmartNIC 上的 compute、DMA、egress bandwidth 和 local memory 显式建模为可调度资源，并用硬件友好的 scheduling/resource-management co-design 支持多租户隔离和公平性。

### 2. 研究问题与背景

SmartNIC/DPU 正在从固定功能 NIC 变成可编程 on-path compute substrate，tenant kernel 可以在网卡上处理 packet、发起 DMA、使用 egress path 和 local memory。传统 NIC virtualization 主要分配 ingress/egress bandwidth，不能处理 SmartNIC kernel execution time、DMA head-of-line blocking、local memory exhaustion 和 control-path latency。

OSMOSIS 要解决的 gap 是: 数据中心 SmartNIC 需要支持多租户 resource multiplexing 和 QoS，但普通 WRR/link-bandwidth allocation 不能公平调度 compute-bound 与 I/O-bound on-NIC kernels。这个 gap 对本 survey 是背景性相关，因为 confidential networking/secure offload 也必须面对 SmartNIC resource sharing 和 tenant isolation；但 OSMOSIS 本身不是 confidential-computing 或 trusted-I/O 安全机制。

### 3. 核心方法拆解

机制路径是: `tenant creates flow execution context -> OSMOSIS allocates SR-IOV VF and SLO policy -> matching engine maps packets to FMQ -> WLBVT scheduler assigns processing units -> DMA/egress fragmentation and WRR reduce HoL blocking -> host/control plane updates policy and memory limits`。

核心模块包括 Flow Management Queue (FMQ)、weighted limited borrowed virtual time (WLBVT) scheduler、DMA request fragmentation、egress scheduling、SLO knobs、host-side control plane、SR-IOV VF abstraction、IOMMU setup 和 PsPIN-based RISC-V SmartNIC backend。设计重点是把 SmartNIC kernel execution 当成类似 OS scheduling 的资源问题，但实现必须足够硬件友好，不能用高开销 software context switch。

### 4. 安全性 / 正确性分析

OSMOSIS 的核心 claim 是 performance isolation、fair resource multiplexing 和 QoS，而不是机密性或完整性。它通过 SLO policy、FMQ scheduling、kernel cycle limits、IOMMU-selected host pages 和 local memory bounds 降低 tenant 之间的资源干扰。论文没有把 malicious tenant confidentiality、device attestation、secure boot、secret handling、cryptographic isolation 或 host compromise 作为主要安全目标。

对本 survey 的边界必须严格: OSMOSIS 可以说明 SmartNIC 多租户 offload 会引入 compute/DMA/egress/memory 资源管理问题；不能用它证明 confidential VM 的 trusted I/O、TDISP lifecycle、SPDM identity、DPU attestation 或 tenant data confidentiality 已经成立。

### 5. 实现细节

论文在 open-source RISC-V-based 400Gbit/s PsPIN SmartNIC 上实现和评估 OSMOSIS。host-side API 支持 multiple ECTX 和 SLO policy，论文报告 335 LoC C；matching engine、WLBVT scheduler 和 DMA fragmentation 的 functional blocks 为 1216 LoC C++，并与 cycle-accurate PsPIN SystemVerilog backend 集成。作者还实现了 synthesizable SystemVerilog IP blocks 估算硬件成本。

实现细节包括 PsPIN RI5CY 32-bit PUs、1GHz clock、cluster scratchpad、L2 kernel buffer、512-bit AXI DMA link、PMP-style local memory protection、FMQ MMIO state、WLBVT 128 FMQs five-cycle scheduling decision、DMA/egress fragmentation。FPGA prototype 受限于频率和资源，完整性能主要依赖 cycle-accurate simulation 和 synthesis estimates。

### 6. 实验设计分析

实验问题包括 scheduler area scaling、相对 PsPIN baseline 的 overhead、最大可承载负载、resource allocation fairness。指标包括 throughput、million packets per second、kernel completion time、flow completion time、Jain's fairness metric、hardware area 和 scheduling latency。

核心结果: 128 FMQ 的 WLBVT scheduler 面积约为 PsPIN cluster+L2 area 的 1%；compute-bound isolated workloads 在 OSMOSIS 下约在 baseline 的正负 3% 内；I/O-bound workloads 因 fragmentation 有 23% 到 2% overhead，但仍支持高吞吐；multi-tenant compute mixture 中平均 fairness 比 RR 高 47%，FCT 约快 39%；I/O mixture 中 fairness 最高改善 83%，FCT 最高改善 63%。这些结果支持资源管理 claim，但不支持 confidentiality claim。

### 7. Novelty 分析

Novelty 分类: `solid systems contribution`。OSMOSIS 的贡献在于把 on-path SmartNIC 的 compute、DMA、egress 和 memory 多资源调度纳入一个硬件/软件协同管理层，并显示传统 NIC virtualization/QoS 不足。它对本 survey 的价值是补 SmartNIC resource-management background substrate。

### 8. 局限性与可能漏洞

最大局限是安全目标有限: OSMOSIS 不做 attestation、trusted boot、confidential memory、cryptographic channel binding、device lifecycle state machine 或 malicious host defense。实验主要基于 PsPIN/cycle-accurate simulation 和 synthesis estimates，FPGA prototype 无法达到目标 400Gbit/s 设计规模。Run-to-completion 和 static memory allocation 简化了硬件调度，但也限制了长任务、动态内存和复杂 tenant code。若 tenant code 恶意或 host compromise，论文没有给出完整防护。

### 9. 和已有工作的关系

OSMOSIS 与 rNIC virtualization、SmartNIC scheduling、PsPIN、BlueField DPA、network QoS、packet scheduling、accelerator scheduling 和 SR-IOV 相关。与 S-NIC/TNIC 不同，OSMOSIS 不提供 NIC-local root of trust 或 attestation primitive；与 TDISP/SPDM/CoVE-IO 不同，它不定义 trusted device interface 或 confidential workload assignment；与 Hazel 不同，它不处理 remote-storage confidentiality/integrity/freshness。

### 10. 复现与再实现计划

最低复现目标是运行 PsPIN simulation 中两个 tenant 的 compute-bound 和 I/O-bound flow，比较 RR baseline 与 WLBVT/DMA fragmentation 的 fairness、FCT 和 overhead。需要 PsPIN toolchain、Verilator/SystemVerilog simulation、OSMOSIS scheduler blocks、synthetic packet traces 和 kernel workload。验收标准是 WLBVT 对 compute-bound tenants 的 Jain fairness 高于 RR，DMA fragmentation 能减少 HoL blocking，isolated workload overhead 接近论文报告范围。

### 11. 对后续研究的启发

1. Secure SmartNIC multi-tenancy: 在 OSMOSIS 资源调度上叠加 attestation、secure boot 和 tenant code measurement。
2. OSMOSIS + confidential VM I/O: 将 FMQ/SLO policy 与 TDISP/CoVE-IO device assignment 组合，检查 lifecycle consistency。
3. Malicious tenant model: 研究 tenant kernel 试图耗尽 DMA/local memory/egress path 时的 enforcement 和 audit。
4. DPU/SmartNIC TEE integration: 将 S-NIC/TNIC 的 trust root 与 OSMOSIS 的 resource scheduler 合并。
5. Production hardware evaluation: 在 BlueField DPA 或真实 400Gbit/s SmartNIC 上验证 full-stack overhead、QoS 和 isolation。

### 12. SOTA README Addendum

- SOTA 定位: Academic SOTA / background substrate
- 标准化 / 发表状态: peer-reviewed USENIX ATC 2024
- 对应小方向: SmartNIC multi-tenancy, resource multiplexing, programmable network offload substrate

#### 内容摘要

OSMOSIS 是 SmartNIC 多租户资源管理的顶会系统论文，针对 on-path packet processing 中 compute、DMA、egress 和 memory 资源难以公平共享的问题。

#### 研究背景

Confidential networking 和 trusted offload 若把 SmartNIC/DPU 放入数据路径，必须面对 tenant kernel 在 NIC 上争用资源的问题。OSMOSIS 提供了这个背景，但不解决机密性。

#### 解决方案

OSMOSIS 用 FMQ 抽象 flow execution context，用 WLBVT 调度 processing units，用 DMA/egress fragmentation 缓解 HoL blocking，并通过 SLO knobs 与 SR-IOV VF 暴露资源管理接口。

#### 实验结果

论文在 PsPIN 400Gbit/s SmartNIC 模型上评估，报告 WLBVT 面积约 1% PsPIN cluster+L2，compute workload overhead 约正负 3%，I/O fragmentation overhead 约 23% 到 2%，fairness 和 FCT 相对 RR 有明显改善。

#### 文章评价

OSMOSIS 适合作为 SmartNIC multi-tenancy/resource-management 背景材料。正文引用时必须说明它不是 confidential I/O、TEE、SPDM、TDISP 或 attestation evidence；它只说明网络 offload endpoint 一旦可编程，多租户资源管理本身就是 boundary engineering 问题。
<!-- END PAPER REVIEW -->
