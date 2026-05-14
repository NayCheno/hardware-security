# TNIC: A Trusted NIC Architecture

- BibTeX key: `giantsidi2025tnic`
- Category: `memory-and-io-fabrics`
- Authors: Dimitra Giantsidi, Julian Pritzi, Felix Gust, Antonios Katsarakis, Atsushi Koshiba, Pramod Bhatotia
- Year: 2025
- Venue: ASPLOS 2025
- DOI: `10.1145/3676641.3716277`
- Source: https://portal.fis.tum.de/en/publications/tnic-a-trusted-nic-architecture-a-hardware-network-substrate-for-/
- PDF source: https://dse.in.tum.de/wp-content/uploads/2025/02/TNIC-ASPLOS-2025.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified
- Survey lane: confidential-computing network/I/O/data-path defense; attestation/device endpoint identity
- Evidence role: Peer-reviewed SOTA. Use for the specific mechanism, evaluation, and threat-model scope established by the source; avoid broader claims outside its evidence class.

<!-- BEGIN PAPER REVIEW -->
## Paper Review
### 1. 论文基本信息

- 论文标题: TNIC: A Trusted NIC Architecture
- 作者 / 机构: Dimitra Giantsidi, Julian Pritzi, Felix Gust, Antonios Katsarakis, Atsushi Koshiba, Pramod Bhatotia; University of Edinburgh, TUM, Huawei Research
- 发表会议 / 年份: ASPLOS 2025
- 领域分类: 系统 / 网络 / 硬件 / 安全
- 一句话总结: TNIC 在 NIC 级别构建最小 silicon root-of-trust，为 Byzantine cloud distributed systems 提供 transferable authentication 和 non-equivocation。
- 最核心贡献一句话: 它把跨主机可信分布式系统的关键安全 primitive 下沉到 SmartNIC/NIC hardware，而不是依赖异构 CPU TEE。

### 2. 研究问题与背景

传统 BFT 系统性能差，CPU TEE 虽能提供单节点隔离，但在异构云环境中存在编程模型不统一、TCB 大、网络 I/O 慢等问题。TNIC 的 gap 是: 缺少一个 host CPU-agnostic、可验证、低延迟的 network-level trust substrate。这个问题与本 survey 的 network endpoint attestation 方向相关，因为 confidential workload 的可信边界可能终止在 NIC/DPU，而不是 CPU Realm/TVM 内。

威胁模型继承 Byzantine fault model: 云基础设施、机器和网络可表现为 Byzantine；攻击者可控制 host software 和网络栈，但不能破坏 TNIC 硬件 root 和密码 primitive。

### 3. 核心方法拆解

方法管线是: `TNIC provisioning/attestation -> trusted NIC network stack -> kernel-bypass RDMA-like API -> per-message counter/MAC primitive -> distributed protocol transformation`。TNIC 的硬件 TCB 提供 non-equivocation 和 transferable authentication；软件网络栈提供类似 RDMA verbs 的 API；系统层用这些 primitive 把 Byzantine tolerance 转化为更便宜的 crash-fault-style replication。

研究贡献包括硬件/软件 co-design、Tamarin 形式化验证、网络 API 和四个分布式系统 case study。

### 4. 安全性 / 正确性分析

论文用 Tamarin 验证 attestation kernel 和 TNIC protocol 的 safety/security properties。核心安全性质是: 节点不能对同一 counter 产生冲突消息，第三方能验证消息来源并转移信任。安全边界很窄，有利于验证；但它不直接保护 application memory 或 host-side TEE state，也不解决物理攻击和 DoS。

### 5. 实现细节

论文实现 t-FPGA / TNIC hardware prototype、C++/DPDK/eRPC 软件栈、Tamarin proof 和 distributed application prototypes。论文报告 TNIC 硬件 TCB 约 2,114 LoC HLS/HDL，远小于把完整分布式应用放入 TEE 的代码体量。Artifact 在 GitHub/Zenodo 可用。

### 6. 实验设计分析

评估包括 attestation latency、network stack latency/throughput、A2M、BFT、chain replication 和 proof-of-execution 等系统。论文报告 TNIC 相比 CPU-centric TEE systems 最多 6x 性能提升，小包网络路径延迟可达 5--5.5us 量级，并在 BFT/CR 场景中显著优于 SGX/AMD-SEV baseline。实验强项是系统级端到端评估和形式化验证；弱项是 TNIC 目标是可信分布式系统 primitive，不是完整 confidential I/O stack。

### 7. Novelty 分析

Novelty 分类: `strong research novelty`。TNIC 的关键新意是用最小 NIC hardware root 提供 distributed systems 所需的两个安全 primitive，避免把所有可信计算压在 CPU TEE 上。对本 survey，它提供了 network endpoint root-of-trust 的高质量 Peer-reviewed SOTA。

### 8. 局限性与可能漏洞

TNIC 不直接提供 CPU workload memory confidentiality，也不替代 SPDM/TDISP/IOMMU。它的安全性依赖 TNIC 硬件实现和 provisioning trust。它主要服务 BFT/可信分布式协议，若用于 confidential VM 网络路径，还需要与 VM attestation、key broker、DMA protection、vNIC lifecycle 组合。

### 9. 和已有工作的关系

TNIC 与 TLS+RA 都处理网络 endpoint trust，但 TNIC 是 NIC-level silicon root 和 protocol primitive，TLS+RA 是 application channel 与 TEE evidence 的绑定。与 S-NIC 相比，TNIC 更关注 non-equivocation/transferable authentication，而 S-NIC 更关注 NIC-local function isolation。与 BlueField OP-TEE/fTPM 相比，TNIC 是学术硬件架构而非 vendor building block。

### 10. 复现与再实现计划

最低复现目标是实现一个 FPGA 上的 monotonic counter + CMAC attest primitive，并通过 Tamarin 或轻量模型验证 non-equivocation。软件侧用 DPDK/eRPC 暴露 send/recv wrapper，复现一个小型 reliable broadcast 或 chain replication。验收标准是 Byzantine host 无法产生 counter 冲突认证消息，且 TNIC 路径相对 CPU TEE baseline 有明显低延迟优势。

### 11. 对后续研究的启发

1. TNIC + Realm/TVM attestation: 让 NIC proof 与 CPU TEE quote 联合进入 verifier policy。
2. DPU key broker acceleration: 用 NIC-level transferable authentication 简化 KBS/proxy trust chain。
3. Secure vSwitch non-equivocation: 防止 host vSwitch 对不同 tenant 或 verifier equivocate flow state。
4. TNIC with SPDM/TDISP: 将 NIC root-of-trust 与 device lifecycle 标准组合。
5. Formal network endpoint taxonomy: 把 TLS+RA、TNIC、SPDM 和 S-NIC 放到同一 endpoint evidence 层比较。

### 12. Evidence README Addendum
- Evidence role: Peer-reviewed SOTA. Use for the specific mechanism, evaluation, and threat-model scope established by the source; avoid broader claims outside its evidence class.
- 标准化 / 发表状态: ASPLOS 2025 peer-reviewed paper
- 对应小方向: trusted NIC architecture and attested network endpoint

#### 内容摘要

TNIC 提供 NIC-level silicon root-of-trust，用 transferable authentication 和 non-equivocation 支撑可信分布式系统。

#### 研究背景

异构 CPU TEE 在网络 I/O 和跨节点一致性场景中存在性能、TCB 和编程模型问题。

#### 解决方案

在 NIC 硬件中实现最小 attestation kernel 和消息认证/counter primitive，并提供 kernel-bypass network stack。

#### 实验结果

相比 CPU-centric TEE systems 最多 6x 性能提升；Tamarin 验证安全性质；硬件 TCB 约 2,114 LoC。

#### 文章评价

TNIC 是 network endpoint trust 的重要 Peer-reviewed SOTA，但不是完整 confidential I/O；应与 VM attestation、DMA/link protection 和 device lifecycle 共同使用。
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `15-smartnic-trusted-nic-storage` - SmartNIC / Trusted NIC / Secure Storage Data Path
- Paper key: `giantsidi2025tnic`
- Role: peer-reviewed SOTA trusted network endpoint architecture
- Evidence base: TNIC Figure 1 system overview; Figure 2 hardware architecture; Figure 3 attestation; Table 1 APIs; Figures 5-13 evaluation; Table 4 TCB.
- Boundary: TNIC 不保护 workload memory，也不替代 SPDM/TDISP/IOMMU/link encryption；它提供 network endpoint trust substrate。

### 1. 完整题目 / 作者 / 会议

- 完整题目: TNIC: A Trusted NIC Architecture
- 作者: Dimitra Giantsidi, Julian Pritzi, Felix Gust, Antonios Katsarakis, Atsushi Koshiba, Pramod Bhatotia
- 会议/来源: ASPLOS 2025
- Title evidence: README metadata; ASPLOS 2025 PDF title page.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** TNIC 的贡献是把跨主机可信分布式系统的 root-of-trust 从 CPU TEE 下沉到 NIC hardware。

- 动机: CPU TEE 在网络 I/O 场景 TCB 大、延迟高、异构性强。
- 工作: 设计 TNIC hardware、attestation kernel、programming APIs 和 Tamarin-verified protocol core。
- 数据: 相比 TEE-based systems 3x-5x throughput 改善；硬件 TCB 约 2114 LoC；tnic design 占 U280 FPGA 约 16.6% LUT/16.3% FF。

**讲解稿:** 讲解时先把本页结论落到一句话: TNIC 的贡献是把跨主机可信分布式系统的 root-of-trust 从 CPU TEE 下沉到 NIC hardware。第一步解释为什么需要这一页: 动机: CPU TEE 在网络 I/O 场景 TCB 大、延迟高、异构性强。第二步说明论文或规范实际做了什么: 工作: 设计 TNIC hardware、attestation kernel、programming APIs 和 Tamarin-verified protocol core。第三步收束到证据边界: 数据: 相比 TEE-based systems 3x-5x throughput 改善；硬件 TCB 约 2114 LoC；tnic design 占 U280 FPGA 约 16.6% LUT/16.3% FF。引用时只把 TNIC Figure 1-Figure 4; Table 1; Table 4; Figure 10-Figure 13 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** TNIC Figure 1-Figure 4; Table 1; Table 4; Figure 10-Figure 13.

- Proof object: flow - TNIC: application posts request -> TNIC attestation kernel -> hardware signs/verifies -> RoCE/network path -> receiver verifies -> BFT/CFT system uses proof


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是分布式系统需要可信 message provenance，但 CPU enclave 路径会拖慢网络。

- BFT/CFT protocol 需要 authentication/non-equivocation。
- 在 CPU TEE 中做 crypto 和 network stack 可能产生巨大 latency spikes。
- NIC 本来就在数据路径上，适合作为 host-agnostic trust substrate。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是分布式系统需要可信 message provenance，但 CPU enclave 路径会拖慢网络。第一步解释为什么需要这一页: BFT/CFT protocol 需要 authentication/non-equivocation。第二步说明论文或规范实际做了什么: 在 CPU TEE 中做 crypto 和 network stack 可能产生巨大 latency spikes。第三步收束到证据边界: NIC 本来就在数据路径上，适合作为 host-agnostic trust substrate。引用时只把 TNIC introduction; Figure 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** TNIC introduction; Figure 1.

- Proof object: matrix - network trust gap: CPU TEE = large TCB / I/O overhead; SSL-lib = fast but not tamper-proof; RDMA = fast but untrusted; TNIC = trusted NIC endpoint; Goal = transferable authentication


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: 把最小安全 primitive 固化在 NIC，应用通过 kernel-bypass API 获得可信网络操作。

- Attestation kernel 位于 TNIC hardware。
- Request/response handler 处理发送/接收 path。
- Tamarin model 验证 bootstrapping、RA、message transmission/reception。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: 把最小安全 primitive 固化在 NIC，应用通过 kernel-bypass API 获得可信网络操作。第一步解释为什么需要这一页: Attestation kernel 位于 TNIC hardware。第二步说明论文或规范实际做了什么: Request/response handler 处理发送/接收 path。第三步收束到证据边界: Tamarin model 验证 bootstrapping、RA、message transmission/reception。引用时只把 TNIC Figure 2; Figure 3; verification sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** TNIC Figure 2; Figure 3; verification sections.

- Proof object: cards - TNIC primitives: attestation kernel; CMAC/HMAC path; transferable authentication; non-equivocation; Tamarin proof


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: TNIC hardware 介于 host application 和 100Gb MAC/RoCE network stack 之间。

- Figure 2 展示 Tx/Rx datapath 和 attestation kernel。
- Figure 3 展示 remote attestation protocol。
- Table 1 给 programming APIs。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: TNIC hardware 介于 host application 和 100Gb MAC/RoCE network stack 之间。第一步解释为什么需要这一页: Figure 2 展示 Tx/Rx datapath 和 attestation kernel。第二步说明论文或规范实际做了什么: Figure 3 展示 remote attestation protocol。第三步收束到证据边界: Table 1 给 programming APIs。引用时只把 TNIC Figure 2-Figure 4; Table 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** TNIC Figure 2-Figure 4; Table 1.

- Proof object: matrix - 组件: Host app = kernel-bypass API; Attestation kernel = trusted core; Req handler = transmit path; Request decoder = receive path; 100Gb MAC/RoCE = network substrate


### 6. 核心方法拆解

#### 方法 1: NIC-Level Attestation

**Claim:** TNIC 先证明 NIC hardware/control binary，再让应用相信 network primitive。

- Remote attestation protocol 用 measurement 和 mutual TLS 建 trust。
- Verifier 检查 Ctrlbin/Ctrlpub 等信息。
- 这和 device endpoint attestation 目标一致，但不是 SPDM 标准实现。

**讲解稿:** 讲解时先把本页结论落到一句话: TNIC 先证明 NIC hardware/control binary，再让应用相信 network primitive。第一步解释为什么需要这一页: Remote attestation protocol 用 measurement 和 mutual TLS 建 trust。第二步说明论文或规范实际做了什么: Verifier 检查 Ctrlbin/Ctrlpub 等信息。第三步收束到证据边界: 这和 device endpoint attestation 目标一致，但不是 SPDM 标准实现。引用时只把 TNIC Figure 3 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** TNIC Figure 3.

- Proof object: flow - attestation: measure Ctrlbin -> sign evidence -> mutual TLS -> verifier checks -> connection established

#### 方法 2: Transferable Authentication

**Claim:** TNIC 让收到的 message proof 可以被第三方验证，而不是只在点对点连接里有效。

- 用于 BFT/CFT systems 的 non-equivocation。
- 硬件生成/验证 message authentication。
- 应用不需要把大 CPU TEE 放进每个 network hop。

**讲解稿:** 讲解时先把本页结论落到一句话: TNIC 让收到的 message proof 可以被第三方验证，而不是只在点对点连接里有效。第一步解释为什么需要这一页: 用于 BFT/CFT systems 的 non-equivocation。第二步说明论文或规范实际做了什么: 硬件生成/验证 message authentication。第三步收束到证据边界: 应用不需要把大 CPU TEE 放进每个 network hop。引用时只把 TNIC design and protocol sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** TNIC design and protocol sections.

- Proof object: cards - distributed property: message provenance; non-equivocation; third-party verifiable; BFT/CFT support; host-agnostic

#### 方法 3: Kernel-Bypass Stack

**Claim:** TNIC 保持高性能的关键是让应用绕过 OS kernel，直接 post requests 给 hardware。

- APIs 类似 RDMA/ibv 风格。
- Memory area 在 connection creation 时分配。
- Network stack 仍追求 low-latency operations。

**讲解稿:** 讲解时先把本页结论落到一句话: TNIC 保持高性能的关键是让应用绕过 OS kernel，直接 post requests 给 hardware。第一步解释为什么需要这一页: APIs 类似 RDMA/ibv 风格。第二步说明论文或规范实际做了什么: Memory area 在 connection creation 时分配。第三步收束到证据边界: Network stack 仍追求 low-latency operations。引用时只把 TNIC Table 1; Figure 4 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** TNIC Table 1; Figure 4.

- Proof object: flow - data path: application buffer -> API request -> TNIC hardware -> RoCE packet -> remote TNIC -> application receives

#### 方法 4: Formal Verification Boundary

**Claim:** Tamarin proof 强化协议性质，但不证明所有硬件实现没有 bug。

- 模型覆盖 bootstrapping、remote attestation、transmission、reception。
- 实现仍有 FPGA/HLS/HDL 工程风险。
- PPT 应把 proof scope 与 system evaluation 分开。

**讲解稿:** 讲解时先把本页结论落到一句话: Tamarin proof 强化协议性质，但不证明所有硬件实现没有 bug。第一步解释为什么需要这一页: 模型覆盖 bootstrapping、remote attestation、transmission、reception。第二步说明论文或规范实际做了什么: 实现仍有 FPGA/HLS/HDL 工程风险。第三步收束到证据边界: PPT 应把 proof scope 与 system evaluation 分开。引用时只把 TNIC Tamarin verification section 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** TNIC Tamarin verification section.

- Proof object: matrix - proof scope: Covers = protocol properties; Tool = Tamarin; Not cover = all RTL bugs; TCB = 2114 LoC; Value = stronger than pure prototype


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** 实验环境与数据: FPGA prototype、host baselines、distributed-system case studies 和 Tamarin proof。

- 平台: Xilinx U280 FPGA / Vitis XRT v2022.2 等。
- Baselines: RDMA-hw、DRCT-IO、DPDK、SSL-lib、SGX/AMD SEV variants。
- Workloads: attest/verify microbenchmarks、send latency/throughput、A2M、BFT/CFT systems。

**讲解稿:** 讲解时先把本页结论落到一句话: 实验环境与数据: FPGA prototype、host baselines、distributed-system case studies 和 Tamarin proof。第一步解释为什么需要这一页: 平台: Xilinx U280 FPGA / Vitis XRT v2022.2 等。第二步说明论文或规范实际做了什么: Baselines: RDMA-hw、DRCT-IO、DPDK、SSL-lib、SGX/AMD SEV variants。第三步收束到证据边界: Workloads: attest/verify microbenchmarks、send latency/throughput、A2M、BFT/CFT systems。引用时只把 TNIC evaluation Section 8; Figure 5-Figure 13; Table 2-5 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** TNIC evaluation Section 8; Figure 5-Figure 13; Table 2-5.

- Proof object: matrix - 实验设置: Platform = FPGA prototype; Baselines = TEE/RDMA/DPDK/SSL; Metrics = latency/throughput/TCB; Proof = Tamarin; TCB = 2114 LoC


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能结论: TNIC 明显优于 TEE-based network trust，但相对纯 SSL/RDMA 仍有安全成本。

- Paper reports 3x-5x better throughput compared to AMD-SEV/SGX TEE-based competitors。
- A2M Table 3: tnic 158K ops/s, 6.34us latency；AMD-sev 30K ops/s, 32.37us。
- Table 4: hardware TCB 2114 LoC vs TEE-hosted codebase over 2M LoC class。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能结论: TNIC 明显优于 TEE-based network trust，但相对纯 SSL/RDMA 仍有安全成本。第一步解释为什么需要这一页: Paper reports 3x-5x better throughput compared to AMD-SEV/SGX TEE-based competitors。第二步说明论文或规范实际做了什么: A2M Table 3: tnic 158K ops/s, 6.34us latency；AMD-sev 30K ops/s, 32.37us。第三步收束到证据边界: Table 4: hardware TCB 2114 LoC vs TEE-hosted codebase over 2M LoC class。引用时只把 TNIC Figure 8-Figure 12; Table 3; Table 4 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** TNIC Figure 8-Figure 12; Table 3; Table 4.

- Proof object: bars - key numbers: throughput gain vs TEEs 3x-5x; tnic A2M latency 6.34us; AMD-sev A2M latency 32.37us; hardware TCB 2114 LoC


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: TNIC 是 trusted network endpoint 的强 SOTA，最适合支撑“NIC 也可以是 RoT”。

- 优势: root-of-trust 下沉到 NIC，形式化验证 + 系统评估都较强。
- 局限: 不保护 workload memory，不覆盖 SPDM/TDISP/IDE/IOMMU lifecycle。
- 商业化潜力: SmartNIC/DPU attested messaging、BFT/CFT service、cloud network trust substrate。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: TNIC 是 trusted network endpoint 的强 SOTA，最适合支撑“NIC 也可以是 RoT”。第一步解释为什么需要这一页: 优势: root-of-trust 下沉到 NIC，形式化验证 + 系统评估都较强。第二步说明论文或规范实际做了什么: 局限: 不保护 workload memory，不覆盖 SPDM/TDISP/IDE/IOMMU lifecycle。第三步收束到证据边界: 商业化潜力: SmartNIC/DPU attested messaging、BFT/CFT service、cloud network trust substrate。引用时只把 TNIC conclusion and README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** TNIC conclusion and README evaluation.

- Proof object: matrix - 评价: 优势 = NIC-level trust root; 局限 = not memory/device lifecycle; 商业化 = trusted network substrate; 本方向角色 = trusted NIC SOTA


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
