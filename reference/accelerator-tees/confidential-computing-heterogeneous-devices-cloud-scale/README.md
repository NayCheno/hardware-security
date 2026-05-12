# Confidential Computing with Heterogeneous Devices at Cloud-Scale

- BibTeX key: `dhar2024cloudscale`
- Category: `accelerator-tees`
- Authors: Aritra Dhar, Supraja Sridhara, Shweta Shinde, Srdjan Capkun, Renzo Andri
- Year: 2024
- Venue: Annual Computer Security Applications Conference (ACSAC 2024)
- Source: https://www.acsac.org/2024/program/final/s297.html
- PDF source: https://www.shwetashinde.org/publications/cloudscale_acsac24.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Survey lane: confidential-computing network/I/O/data-path defense
- SOTA role: Academic SOTA for cloud-scale heterogeneous DSA protection with TEE and non-TEE nodes.

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 1. 论文基本信息

- 论文标题: Confidential Computing with Heterogeneous Devices at Cloud-Scale
- 作者 / 机构: Aritra Dhar 等；Huawei Zurich Research Center / ETH Zurich
- 发表会议 / 年份: ACSAC 2024
- 领域分类: 系统 / 安全 / 架构
- 一句话总结: 论文提出 Security Controller (SC)，让 TEE-enabled nodes 和 legacy non-TEE DSA nodes 能在数据中心内共同服务 confidential workload。
- 最核心贡献一句话: 它把 accelerator TEE 问题从单机设备扩展到 cloud-scale heterogeneous DSA pool，并用 SC 提供 access control、attestation 和 physical-adversary-aware protection。

### 2. 研究问题与背景

现代云 workload 依赖 GPU、NPU、FPGA、SSD 等 domain-specific accelerators，但并非所有节点和设备都具备 TEE 能力。用户要么放弃 accelerator 性能，要么把敏感数据交给非 TEE 设备和 CSP 管理栈。论文声称的 gap 是“数据中心规模的 heterogeneous confidential computing 缺少实用桥接机制”，这个 gap 对本 survey 的 DPU/SmartNIC/NIC/offload 方向成立。

### 3. 核心方法拆解

系统 pipeline 可写为: confidential request -> SC policy / attestation -> TEE node or non-TEE DSA node -> encrypted/authenticated data movement -> workload completion。SC 是专用硬件模块，作为 legacy non-TEE DSA 的 TEE proxy，负责 access control、attestation、key exchange 和数据路径保护。相较 HETEE，它强调跨 rack / cloud-scale deployment，并尽量支持 unmodified workloads。

### 4. 安全性 / 正确性分析

安全边界信任 SC、TEE-enabled nodes 的证明链和 SC 与 DSA 之间的控制/数据保护。论文考虑 malicious CSP、software stack 和 physical attacker，比只考虑恶意 OS/VMM 的 accelerator TEE 更强。局限是 SC 仍是关键集中组件，且设备内部恶意固件、side-channel、DoS 和复杂调度侧信道需要单独处理。

### 5. 实现细节

论文实现并综合 SC hardware，评估 AI、Redis 和 file-system workloads。实现事实包括 SC-FPGA prototype、TEE/non-TEE node attestation、SIGMA key exchange、AES-GCM 数据保护和 secure boot traces 采集。复现难度高，依赖硬件原型和数据中心式拓扑。

### 6. 实验设计分析

论文报告平均 1.5-5% overhead，且可扩展到 2236 concurrent NPUs running CNNs。实验覆盖 FIO、Redis 和 AI workload，能支持低开销主张。风险是实验环境与真实商用云的 DPU/SmartNIC/NIC 编排、热插拔、租户隔离和故障恢复仍有差距。

### 7. Novelty 分析

分类: strong systems contribution。新意在于把 confidential heterogeneous computing 放在 cloud-scale resource pool 视角下，而不是只设计单个 accelerator enclave。

### 8. 局限性与可能漏洞

SC 的正确性和供应链可信是硬假设。论文没有替代 SPDM/TDISP/PCIe IDE/IOMMU 这些标准化组件，而是提供另一种硬件控制器路线。对本 survey 来说，它应被写成 cloud-scale confidential offload 方案，而非 Arm/RISC-V 标准机制。

### 9. 和已有工作的关系

它直接对比 HETEE，并指出 HETEE 在部分场景中数据路径和软件改造成本较高。它也和 ITX/ACAI/CoVE-IO 互补：ITX 把 TEE 放进 accelerator，ACAI 面向 Arm CCA accelerator path，CoVE-IO 面向标准化 trusted I/O，本文面向 cloud-scale mixed TEE/non-TEE DSA pool。

### 10. 复现与再实现计划

最小复现目标是构建 SC 机制表：node attestation、key exchange、access-control decision、encrypted data path、scale-out DSA assignment。验收标准是能区分 SC 保护哪些链路、哪些仍依赖设备或平台标准。

### 11. 对后续研究的启发

1. 把 SC 作为 SmartNIC/DPU root-of-trust 的候选形态。2. 对比 SC 与 SPDM/TDISP/IDE 标准栈。3. 研究 non-TEE DSA 的 revocation 和 cleanup。4. 做 confidential network offload 的端到端 benchmark。5. 补充 multi-tenant failure isolation。
<!-- END PAPER REVIEW -->
