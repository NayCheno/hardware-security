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
- Evidence role: Peer-reviewed SOTA. Use for the specific mechanism, evaluation, and threat-model scope established by the source; avoid broader claims outside its evidence class.

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

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `14-accelerator-dpu-smartnic-offload` - Accelerator / DPU / SmartNIC Offload TEE
- Paper key: `dhar2024cloudscale`
- Role: peer-reviewed SOTA cloud-scale heterogeneous device confidential computing
- Evidence base: CloudScale abstract; Figure 4 manifest; Figure 5 SC prototype; Figure 6 evaluation; NPU/SSD workload results.
- Boundary: CloudScale 不替代 SPDM/TDISP/IOMMU/IDE 标准；SC 正确性和供应链可信是硬假设。

### 1. 完整题目 / 作者 / 会议

- 完整题目: Confidential Computing with Heterogeneous Devices at Cloud-Scale
- 作者: Aritra Dhar, Supraja Sridhara, Shweta Shinde, Srdjan Capkun, Renzo Andri
- 会议/来源: ACSAC 2024
- Title evidence: README metadata; ACSAC 2024 PDF title page.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** CloudScale 的贡献是把 HETEE 式 controller 思路推到 cloud-scale heterogeneous DSA pool。

- 动机: 数据中心大量 DSA/NPU/GPU/SSD 没有 TEE 能力，tenant 不想在性能和数据保护间二选一。
- 工作: 设计 distributed security controller，作为 TEE proxy 做 access control、attestation、key exchange 和 encrypted/authenticated data path。
- 数据: AI、Redis、file-system workloads overhead 约 1.5%-5%，规模估算到 2236 concurrent NPUs running CNNs。

**讲解稿:** 讲解时先把本页结论落到一句话: CloudScale 的贡献是把 HETEE 式 controller 思路推到 cloud-scale heterogeneous DSA pool。第一步解释为什么需要这一页: 动机: 数据中心大量 DSA/NPU/GPU/SSD 没有 TEE 能力，tenant 不想在性能和数据保护间二选一。第二步说明论文或规范实际做了什么: 工作: 设计 distributed security controller，作为 TEE proxy 做 access control、attestation、key exchange 和 encrypted/authenticated data path。第三步收束到证据边界: 数据: AI、Redis、file-system workloads overhead 约 1.5%-5%，规模估算到 2236 concurrent NPUs running CNNs。引用时只把 CloudScale abstract; Figure 4-Figure 6; evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CloudScale abstract; Figure 4-Figure 6; evaluation.

- Proof object: flow - CloudScale: TEE VM -> Security Controller -> manifest/policy -> legacy DSA/NPU/SSD -> encrypted/authenticated path -> result returns


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是云里不是所有 accelerator 都能变成 TEE device。

- 替换所有 DSA 为 TEE-capable 硬件成本高且周期长。
- Legacy non-TEE devices 性能强，但无法直接接触敏感 plaintext。
- 云规模还要求多节点、多 SC、多租户 resource pool。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是云里不是所有 accelerator 都能变成 TEE device。第一步解释为什么需要这一页: 替换所有 DSA 为 TEE-capable 硬件成本高且周期长。第二步说明论文或规范实际做了什么: Legacy non-TEE devices 性能强，但无法直接接触敏感 plaintext。第三步收束到证据边界: 云规模还要求多节点、多 SC、多租户 resource pool。引用时只把 CloudScale introduction 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CloudScale introduction.

- Proof object: matrix - cloud gap: TEE CPU = available; TEE DSA = limited; Legacy DSA = common; Tenant = needs confidentiality; CloudScale = SC-mediated secure path


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: SC 作为 cloud-scale proxy，把非 TEE DSA 放进可证明的物理/逻辑安全边界。

- SC enforcement 包括 access control、attestation、key exchange 和 encrypted/authenticated data path。
- Manifest 描述 enclave/DSA/resource requirements。
- SC chiplet/prototype 评估控制面和数据面开销。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: SC 作为 cloud-scale proxy，把非 TEE DSA 放进可证明的物理/逻辑安全边界。第一步解释为什么需要这一页: SC enforcement 包括 access control、attestation、key exchange 和 encrypted/authenticated data path。第二步说明论文或规范实际做了什么: Manifest 描述 enclave/DSA/resource requirements。第三步收束到证据边界: SC chiplet/prototype 评估控制面和数据面开销。引用时只把 CloudScale design sections; Figure 4 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CloudScale design sections; Figure 4.

- Proof object: cards - SC functions: access control; key exchange; attestation; encrypted path; resource policy


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: TEE-enabled node 与 legacy DSA node 通过 SC 协调，SC 形成安全 perimeter。

- SC 解析 manifest 并检查资源授权。
- TEE VM 与 DSA node 通过 SC 建立 secure path。
- 多个 DSA 节点可被纳入同一 cloud-scale pool。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: TEE-enabled node 与 legacy DSA node 通过 SC 协调，SC 形成安全 perimeter。第一步解释为什么需要这一页: SC 解析 manifest 并检查资源授权。第二步说明论文或规范实际做了什么: TEE VM 与 DSA node 通过 SC 建立 secure path。第三步收束到证据边界: 多个 DSA 节点可被纳入同一 cloud-scale pool。引用时只把 CloudScale architecture figures 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CloudScale architecture figures.

- Proof object: matrix - 组件: TEE VM = confidential workload; SC = trusted proxy/controller; DSA/NPU/SSD = legacy accelerator/storage; Manifest = policy/resource description; KMS/attestation = trust bootstrap


### 6. 核心方法拆解

#### 方法 1: Manifest-Driven Assignment

**Claim:** CloudScale 用 manifest 描述用户任务需要哪些设备和安全属性。

- Manifest 让 SC 知道哪些节点/设备可访问数据。
- 错误 manifest 或 policy 会直接影响安全边界。
- 这类似 CoVE-IO 的 lifecycle policy，但面向 cloud-scale legacy pool。

**讲解稿:** 讲解时先把本页结论落到一句话: CloudScale 用 manifest 描述用户任务需要哪些设备和安全属性。第一步解释为什么需要这一页: Manifest 让 SC 知道哪些节点/设备可访问数据。第二步说明论文或规范实际做了什么: 错误 manifest 或 policy 会直接影响安全边界。第三步收束到证据边界: 这类似 CoVE-IO 的 lifecycle policy，但面向 cloud-scale legacy pool。引用时只把 CloudScale Figure 4; design sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CloudScale Figure 4; design sections.

- Proof object: flow - manifest: user job -> manifest -> SC validates -> resources assigned -> secure path established

#### 方法 2: SC Data Plane

**Claim:** SC 不只是管理面，还要处理 encrypted/authenticated data path。

- 论文 RTL/prototype 中 SC chiplet data plane 约 2.5 KLoC。
- SC 处理 access control 和 crypto。
- 数据面延迟/吞吐决定能否承载 AI/SSD workloads。

**讲解稿:** 讲解时先把本页结论落到一句话: SC 不只是管理面，还要处理 encrypted/authenticated data path。第一步解释为什么需要这一页: 论文 RTL/prototype 中 SC chiplet data plane 约 2.5 KLoC。第二步说明论文或规范实际做了什么: SC 处理 access control 和 crypto。第三步收束到证据边界: 数据面延迟/吞吐决定能否承载 AI/SSD workloads。引用时只把 CloudScale implementation/evaluation; SC chiplet discussion 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CloudScale implementation/evaluation; SC chiplet discussion.

- Proof object: matrix - SC datapath: Crypto = AES-GCM/keyed path; Policy = access control; Throughput = 12.96GB/s class reported; Latency = ns/us class components; TCB = SC RTL/proxy code

#### 方法 3: Cloud-Scale Resource Pool

**Claim:** CloudScale 关注多 DSA 并发和数据中心容量规划。

- 论文估算 RetinaNet-RN50 可到 2236 concurrent NPUs。
- SSD 场景可到 117 concurrent Intel 535 SSDs。
- 扩展上限受 PCIe lanes、SC throughput 和 workload latency 支配。

**讲解稿:** 讲解时先把本页结论落到一句话: CloudScale 关注多 DSA 并发和数据中心容量规划。第一步解释为什么需要这一页: 论文估算 RetinaNet-RN50 可到 2236 concurrent NPUs。第二步说明论文或规范实际做了什么: SSD 场景可到 117 concurrent Intel 535 SSDs。第三步收束到证据边界: 扩展上限受 PCIe lanes、SC throughput 和 workload latency 支配。引用时只把 CloudScale abstract/evaluation; NPU/SSD scalability lines 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CloudScale abstract/evaluation; NPU/SSD scalability lines.

- Proof object: bars - scale evidence: NPU CNN concurrency 2236; SSD concurrency 117; SC throughput 12.96GB/s

#### 方法 4: Trusted I/O Boundary

**Claim:** CloudScale 的 SC 方案和标准 TEE-I/O 是互补关系，不是替代关系。

- SC 可以作为 DPU/SmartNIC 形态落地。
- 但 device identity、TDISP state、IOMMU/IDE 仍需标准化机制。
- 商业风险在多租户 failure isolation 和 SC compromise blast radius。

**讲解稿:** 讲解时先把本页结论落到一句话: CloudScale 的 SC 方案和标准 TEE-I/O 是互补关系，不是替代关系。第一步解释为什么需要这一页: SC 可以作为 DPU/SmartNIC 形态落地。第二步说明论文或规范实际做了什么: 但 device identity、TDISP state、IOMMU/IDE 仍需标准化机制。第三步收束到证据边界: 商业风险在多租户 failure isolation 和 SC compromise blast radius。引用时只把 CloudScale discussion; survey boundary 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CloudScale discussion; survey boundary.

- Proof object: cards - standard gaps: SPDM identity; TDISP lifecycle; IOMMU/IOPMP; PCIe IDE; failure isolation


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** 实验环境与数据: RTL/prototype + AI/Redis/file-system/SSD workloads。

- Workloads: ResNet-34/50 on Ascend NPU, Redis query/update, FIO/SSD file-system path。
- 规模: concurrent NPU/SSD estimates。
- 实现: SC chiplet data plane RTL/prototype，TEE VM + legacy node path。

**讲解稿:** 讲解时先把本页结论落到一句话: 实验环境与数据: RTL/prototype + AI/Redis/file-system/SSD workloads。第一步解释为什么需要这一页: Workloads: ResNet-34/50 on Ascend NPU, Redis query/update, FIO/SSD file-system path。第二步说明论文或规范实际做了什么: 规模: concurrent NPU/SSD estimates。第三步收束到证据边界: 实现: SC chiplet data plane RTL/prototype，TEE VM + legacy node path。引用时只把 CloudScale evaluation Section VI; Figure 6 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CloudScale evaluation Section VI; Figure 6.

- Proof object: matrix - 实验设置: AI = Ascend NPU ResNet; Storage = SSD/FIO; Database = Redis; Scale = NPU/SSD concurrency; Metric = latency/throughput overhead


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能结论: CloudScale 把 overhead 控制在实用范围，但 SC 成为关键瓶颈和 TCB。

- Abstract: AI、Redis、file-system workloads overhead 约 1.5%-5%。
- Evaluation: SEV VM path overhead 约 1.84%-1.94%，Redis read/update latency overhead 约 4.37%，ResNet-34 batch 16 max overhead 约 5.3%。
- SC access-control block 约 3.585us latency，但可 pipeline 隐藏。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能结论: CloudScale 把 overhead 控制在实用范围，但 SC 成为关键瓶颈和 TCB。第一步解释为什么需要这一页: Abstract: AI、Redis、file-system workloads overhead 约 1.5%-5%。第二步说明论文或规范实际做了什么: Evaluation: SEV VM path overhead 约 1.84%-1.94%，Redis read/update latency overhead 约 4.37%，ResNet-34 batch 16 max overhead 约 5.3%。第三步收束到证据边界: SC access-control block 约 3.585us latency，但可 pipeline 隐藏。引用时只把 CloudScale abstract; evaluation lines around Figure 6 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CloudScale abstract; evaluation lines around Figure 6.

- Proof object: bars - key numbers: typical overhead 1.5%-5%; ResNet max overhead 5.3%; Redis latency overhead 4.37%; NPU concurrency 2236


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: CloudScale 是 cloud-scale accelerator/DPU offload 的强 SOTA，但商业落地取决于 SC trust 和标准互操作。

- 优势: 直面 legacy heterogeneous devices，云规模叙事强，overhead 数据较完整。
- 局限: SC compromise blast radius、physical perimeter、vendor attestation 和 lifecycle 仍复杂。
- 商业化潜力: DPU/SmartNIC security gateway、confidential accelerator pool。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: CloudScale 是 cloud-scale accelerator/DPU offload 的强 SOTA，但商业落地取决于 SC trust 和标准互操作。第一步解释为什么需要这一页: 优势: 直面 legacy heterogeneous devices，云规模叙事强，overhead 数据较完整。第二步说明论文或规范实际做了什么: 局限: SC compromise blast radius、physical perimeter、vendor attestation 和 lifecycle 仍复杂。第三步收束到证据边界: 商业化潜力: DPU/SmartNIC security gateway、confidential accelerator pool。引用时只把 CloudScale conclusion and README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CloudScale conclusion and README evaluation.

- Proof object: matrix - 评价: 优势 = cloud-scale legacy DSA bridge; 局限 = SC TCB and lifecycle; 商业化 = DPU security proxy; 本方向角色 = cloud-scale SOTA


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
