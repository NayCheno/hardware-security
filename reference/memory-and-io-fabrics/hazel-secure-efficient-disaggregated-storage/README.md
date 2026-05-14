# Hazel: Secure and Efficient Disaggregated Storage

- BibTeX key: `chrapek2026hazel`
- Category: `memory-and-io-fabrics`
- Authors: Marcin Chrapek, Meni Orenbach, Ahmad Atamli, Marcin Copik, Mikhail Khalilov, Fritz Alder, Torsten Hoefler
- Year: 2026
- Venue: arXiv
- arXiv: `2510.18756`
- Source: https://arxiv.org/abs/2510.18756
- PDF source: https://arxiv.org/pdf/2510.18756
- Local PDF: `paper.pdf`
- Download status: downloaded and verified
- Survey lane: confidential-computing network/I/O/data-path defense
- Evidence role: Draft/not ratified. arXiv/preprint evidence for secure disaggregated storage data paths; use with explicit preprint status and do not treat as standardized trusted I/O.

<!-- BEGIN PAPER REVIEW -->
## Paper Review
### 1. 论文基本信息

- 论文标题: Hazel: Secure and Efficient Disaggregated Storage
- 作者 / 机构: Marcin Chrapek, Meni Orenbach, Ahmad Atamli, Marcin Copik, Mikhail Khalilov, Fritz Alder, Torsten Hoefler; ETH Zurich, NVIDIA, University of Southampton
- 发表会议 / 年份: arXiv v2, 2026
- 领域分类: 系统 / 网络 / 存储 / 安全
- 一句话总结: Hazel 为 NVMe-oF disaggregated storage 在 confidential computing threat model 下提供 confidentiality、integrity 和 freshness。
- 最核心贡献一句话: 它利用 NVMe metadata、counter leasing、Hazel Merkle Tree 和 BlueField-3 offload，在不修改 NVMe-oF 协议的前提下降低 secure storage data path 开销。

### 2. 研究问题与背景

Confidential computing 需要保护远端/分解式存储路径，但 dm-crypt、dm-integrity、dm-x 等本地方案直接套到 NVMe-oF 会导致扩展性差、CPU 使用率高和 freshness 维护开销。Hazel 的 gap 是: 缺少面向 disaggregated NVMe-oF 的 scalable secure storage control/data path，能同时提供 confidentiality、integrity、freshness。这个 gap 与本 survey 的 CXL/RDMA/NVMe-oF 数据路径防御直接相关。

攻击者包括特权管理员、其他用户、参与节点上的本地 adversary、远端 adversary，以及能观察或修改 control-plane/data-plane 请求响应的攻击者。论文假设存在 TEE/KBS、trusted Hazel service 和少量 trusted non-volatile memory。

### 3. 核心方法拆解

方法管线是: `confidential workload -> local Hazel service/KBS counter lease -> NVMe-oF request encapsulation -> metadata carries IV/hash/freshness info -> remote Hazel verifies/updates HMT -> SSD data+metadata storage`。核心模块包括 counter leasing、key derivation、NVMe metadata encapsulation、network freshness header、Hazel Merkle Tree、metadata cache、eventual consistency write path 和 BlueField-3 GGA/DOCA offload。

研究贡献是把 secure storage 的 freshness/integrity 从本地 block layer 重新设计为 disaggregated protocol-compatible data path。

### 4. 安全性 / 正确性分析

Hazel 目标是防止 plaintext 泄漏、数据篡改和 stale data replay。它通过 unique IV/counter leasing 支撑 confidentiality，通过 AEAD/hash 和 metadata 支撑 integrity，通过 HMT 和 freshness cache 支撑 freshness。正确性风险集中在 metadata cache 污染、并发写、crash recovery 和 eventual consistency。论文讨论了 crash/coherency，但完整形式化证明不足。

### 5. 实现细节

原型基于 SPDK 和 NVIDIA BlueField-3 DPU。使用 DOCA SDK 访问 BlueField-3 cryptographic Generic Global Accelerators。测试环境包含用户端 BF3 DPU、存储端 BF3 NIC、3.84 TB PCIe SSD 和 NVMe-oF path。实现涉及 SPDK vbdev、metadata handling、temporary buffers、pre-registered memory、freshness cache 和 multi-threaded HMT update。

### 6. 实验设计分析

论文评估 synthetic patterns、metadata cache pollution、eventual consistency、IO500、YCSB/RocksDB 和 AI training。报告大块/顺序路径可达 1--2% 开销，IO500 平均约 6.3% 开销，YCSB 平均 p99 latency 约 2.2% 开销；小随机 freshness IOPS 可出现较高开销，随机写/dirty reads 对 metadata-to-data ratio 敏感。实验强项是用真实 BF3/SSD/NVMe-oF 原型；不足是 arXiv 状态，仍需 peer-reviewed validation。

### 7. Novelty 分析

Novelty 分类: `solid systems contribution`，若后续顶会发表可视为 `strong research novelty`。Hazel 的新意在于把 secure storage freshness 和 NVMe metadata/SmartNIC offload 结合，并服务 CC threat model。

### 8. 局限性与可能漏洞

Hazel 依赖 KBS/TEE/Hazel service 的正确配置和远端 Hazel 可信路径。Freshness read path 对 dirty metadata cache 和小随机 I/O 敏感。BlueField-3 offload 说明 DPU 可成为 data-path TCB，但该文没有完整讨论 DPU attestation/device lifecycle 与 SPDM/TDISP 组合。arXiv 状态意味着引用时需标注 preprint。

### 9. 和已有工作的关系

Hazel 与 FOLIO 都服务 confidential VM 的高性能 I/O，但 Hazel 聚焦 disaggregated storage/NVMe-oF，FOLIO 聚焦 high-performance networks without trusted I/O devices。Hazel 与 SEV-TIO、TDISP、PCIe IDE 的关系是互补: 它设计 storage-layer security semantics，仍需要底层 device/link identity 和 protected transport。

### 10. 复现与再实现计划

最低复现目标是在 SPDK NVMe-oF 上实现 metadata-carried IV/hash + HMT freshness check，不一定一开始使用 BF3 offload。需要 KBS mock、counter lease、local/remote Hazel service、fio/IO500/YCSB workload。验收标准是篡改 ciphertext、替换 stale sector、重复 IV 和 metadata cache dirty case 均被检测，同时顺序读写开销接近论文数量级。

### 11. 对后续研究的启发

1. Hazel + TDISP/SPDM: 将 NVMe-oF storage endpoint 身份、DPU attestation 和 Hazel service evidence 绑定。
2. Confidential CXL-storage tier: 将 HMT/freshness metadata 扩展到 CXL-attached or pooled memory/storage。
3. Small random I/O optimization: 针对 dirty metadata cache 下的 freshness miss 设计 DPU-side batch verifier。
4. Crash-consistent confidential storage: 形式化验证 Hazel eventual consistency 和 HMT root 更新顺序。
5. Realm/TVM integration: 把 Hazel control path 与 Arm CCA/RISC-V CoVE key broker policy 对接。

### 12. Evidence README Addendum
- Evidence role: Draft/not ratified. arXiv/preprint evidence for secure disaggregated storage data paths; use with explicit preprint status and do not treat as standardized trusted I/O.
- 标准化 / 发表状态: arXiv preprint v2, 2026
- 对应小方向: confidential-computing storage/network data path; NVMe-oF with SmartNIC/DPU offload

#### 内容摘要

Hazel 为 NVMe-oF disaggregated storage 提供 confidentiality、integrity 和 freshness，同时利用 DPU/SmartNIC offload 降低开销。

#### 研究背景

本地 dm-crypt/dm-integrity/dm-x 在远端存储和大规模 CC 场景下扩展性与性能不足。

#### 解决方案

通过 counter leasing、NVMe metadata、Hazel Merkle Tree、metadata cache 和 BlueField-3 offload 构建 secure storage path。

#### 实验结果

合成和应用 workload 上常见 1--2% 开销；IO500 平均约 6.3%；小随机 freshness I/O 是主要弱点。

#### 文章评价

Hazel 是 confidential storage data path 的重要新增相关工作；但应标注 arXiv 状态，并补充底层设备身份/attestation 组合。
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `15-smartnic-trusted-nic-storage` - SmartNIC / Trusted NIC / Secure Storage Data Path
- Paper key: `chrapek2026hazel`
- Role: draft SOTA secure disaggregated storage data path
- Evidence base: Hazel Figure 1 overview; Figure 2 algorithm overheads; Figure 3 control path; Figure 4 data path; Figure 11 IO500; Figure 12 YCSB; Figure 13 ML.
- Boundary: Hazel 是 preprint；未完整闭环 BlueField DPU attestation、SPDM/TDISP/NVMe-oF endpoint identity。

### 1. 完整题目 / 作者 / 会议

- 完整题目: Hazel: Secure and Efficient Disaggregated Storage
- 作者: Chrapek et al.
- 会议/来源: arXiv / preprint, 2026
- Title evidence: README metadata; Hazel PDF title page.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** Hazel 的贡献是把 secure storage data path 的三个目标放到一个 NVMe-oF + DPU 原型里。

- 动机: confidential workload 使用远端存储时，本地 dm-crypt/dm-integrity/dm-x 难以兼顾性能、扩展性和 replay freshness。
- 工作: counter leasing 控制 path、NVMe metadata 封装、Hazel Merkle Tree、IV/metadata cache、BlueField-3 crypto offload。
- 数据: synthetic/IO500/YCSB/ML 评估；IO500 平均 overhead 6.3%，YCSB p99 latency 平均 2.2%，多数应用 1%-2% overhead。

**讲解稿:** 讲解时先把本页结论落到一句话: Hazel 的贡献是把 secure storage data path 的三个目标放到一个 NVMe-oF + DPU 原型里。第一步解释为什么需要这一页: 动机: confidential workload 使用远端存储时，本地 dm-crypt/dm-integrity/dm-x 难以兼顾性能、扩展性和 replay freshness。第二步说明论文或规范实际做了什么: 工作: counter leasing 控制 path、NVMe metadata 封装、Hazel Merkle Tree、IV/metadata cache、BlueField-3 crypto offload。第三步收束到证据边界: 数据: synthetic/IO500/YCSB/ML 评估；IO500 平均 overhead 6.3%，YCSB p99 latency 平均 2.2%，多数应用 1%-2% overhead。引用时只把 Hazel Figure 1-Figure 4; Figure 11-Figure 13 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Hazel Figure 1-Figure 4; Figure 11-Figure 13.

- Proof object: flow - Hazel: TEE requests storage -> KBS leases counters -> DPU offloads crypto -> NVMe metadata carries tags -> HMT verifies freshness -> data returns


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是远端存储不只要加密，还要防篡改和旧数据回放。

- dm-crypt 只给 confidentiality。
- dm-integrity/dm-x 会带来 IOPS/latency/throughput 开销。
- NVMe-oF/JBOF 场景中 host CPU 和 network path 都可能成为瓶颈。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是远端存储不只要加密，还要防篡改和旧数据回放。第一步解释为什么需要这一页: dm-crypt 只给 confidentiality。第二步说明论文或规范实际做了什么: dm-integrity/dm-x 会带来 IOPS/latency/throughput 开销。第三步收束到证据边界: NVMe-oF/JBOF 场景中 host CPU 和 network path 都可能成为瓶颈。引用时只把 Hazel Section 2; Figure 2 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Hazel Section 2; Figure 2.

- Proof object: matrix - storage security: Confidentiality = encryption; Integrity = MAC/AEAD; Freshness = counter/tree; Attestability = TEE/DPU evidence; Performance = DPU offload + metadata cache


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: 让 freshness/control path 慢而少，让 data path 快而 offloaded。

- KBS/TEE 负责 counter leasing 和 key/control。
- DPU 负责 line-rate crypto 和 NVMe-oF path。
- HMT/metadata cache 让 reads 尽量不走昂贵 tree path。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: 让 freshness/control path 慢而少，让 data path 快而 offloaded。第一步解释为什么需要这一页: KBS/TEE 负责 counter leasing 和 key/control。第二步说明论文或规范实际做了什么: DPU 负责 line-rate crypto 和 NVMe-oF path。第三步收束到证据边界: HMT/metadata cache 让 reads 尽量不走昂贵 tree path。引用时只把 Hazel Figure 3-Figure 5 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Hazel Figure 3-Figure 5.

- Proof object: cards - Hazel ingredients: counter leasing; NVMe metadata; Hazel Merkle Tree; metadata cache; BlueField-3 offload


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: Hazel control path 建 trust/key/counter，data path 走 DPU/NVMe-oF 并把安全 metadata 放进 sector layout。

- Figure 3 是 control path: cluster manager、TEE、KBS、Hazel service。
- Figure 4 是 data path 和 SSD sector layout。
- Figure 5 是 HMT 设计。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: Hazel control path 建 trust/key/counter，data path 走 DPU/NVMe-oF 并把安全 metadata 放进 sector layout。第一步解释为什么需要这一页: Figure 3 是 control path: cluster manager、TEE、KBS、Hazel service。第二步说明论文或规范实际做了什么: Figure 4 是 data path 和 SSD sector layout。第三步收束到证据边界: Figure 5 是 HMT 设计。引用时只把 Hazel Figure 3-Figure 5 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Hazel Figure 3-Figure 5.

- Proof object: matrix - 组件: TEE/KBS = counter/key control; Hazel service = local trusted service; DPU/BF3 = crypto offload; NVMe metadata = security tags; HMT = freshness tree


### 6. 核心方法拆解

#### 方法 1: Counter Leasing

**Claim:** Hazel 不为每次 I/O 找 KBS，而是租一段 counter range，降低 control path 频率。

- KBS 管 keys/counters。
- Lease range 可覆盖大量 writes。
- 租约错误会影响 freshness，所以必须由 TEE/KBS policy 管。

**讲解稿:** 讲解时先把本页结论落到一句话: Hazel 不为每次 I/O 找 KBS，而是租一段 counter range，降低 control path 频率。第一步解释为什么需要这一页: KBS 管 keys/counters。第二步说明论文或规范实际做了什么: Lease range 可覆盖大量 writes。第三步收束到证据边界: 租约错误会影响 freshness，所以必须由 TEE/KBS policy 管。引用时只把 Hazel Section 3.2; Figure 3 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Hazel Section 3.2; Figure 3.

- Proof object: flow - counter lease: TEE starts -> mutual attestation -> KBS leases counters -> Hazel uses range -> renew/revoke -> audit state

#### 方法 2: NVMe Metadata Encapsulation

**Claim:** Hazel 利用 NVMe metadata 携带安全信息，不重写整个 NVMe-oF 协议。

- Sector layout 放置 counter/MAC/metadata。
- DPU 在 data path 做 crypto/check。
- 这降低协议改造成本，也保留高性能 storage path。

**讲解稿:** 讲解时先把本页结论落到一句话: Hazel 利用 NVMe metadata 携带安全信息，不重写整个 NVMe-oF 协议。第一步解释为什么需要这一页: Sector layout 放置 counter/MAC/metadata。第二步说明论文或规范实际做了什么: DPU 在 data path 做 crypto/check。第三步收束到证据边界: 这降低协议改造成本，也保留高性能 storage path。引用时只把 Hazel Figure 4 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Hazel Figure 4.

- Proof object: matrix - sector layout: Data = encrypted payload; Counter/IV = freshness input; MAC/tag = integrity; Metadata = NVMe extension; DPU = offload processing

#### 方法 3: Hazel Merkle Tree

**Claim:** HMT 用 in-memory IV cache、batch update 和 eventual consistency 降低 freshness 开销。

- Tree 完全在磁盘上会造成不确定 latency。
- 全树在内存中又浪费 DRAM。
- HMT 选择 cache/batch/EC，在性能和 freshness timing 间取舍。

**讲解稿:** 讲解时先把本页结论落到一句话: HMT 用 in-memory IV cache、batch update 和 eventual consistency 降低 freshness 开销。第一步解释为什么需要这一页: Tree 完全在磁盘上会造成不确定 latency。第二步说明论文或规范实际做了什么: 全树在内存中又浪费 DRAM。第三步收束到证据边界: HMT 选择 cache/batch/EC，在性能和 freshness timing 间取舍。引用时只把 Hazel Figure 5-Figure 7 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Hazel Figure 5-Figure 7.

- Proof object: flow - HMT: write data -> update metadata cache -> batch tree updates -> eventual consistency -> read verifies freshness when needed

#### 方法 4: DPU Offload Boundary

**Claim:** Hazel 借助 BlueField-3 降低 CPU overhead，但 DPU 自身 trust 需要额外证明。

- 论文讨论 TDISP/IDE 作为相关工作/未来 trust basis。
- 当前 preprint 没把 DPU attestation 与 storage endpoint identity 全闭环。
- 商业部署必须补 SPDM/TDISP/NVMe endpoint evidence。

**讲解稿:** 讲解时先把本页结论落到一句话: Hazel 借助 BlueField-3 降低 CPU overhead，但 DPU 自身 trust 需要额外证明。第一步解释为什么需要这一页: 论文讨论 TDISP/IDE 作为相关工作/未来 trust basis。第二步说明论文或规范实际做了什么: 当前 preprint 没把 DPU attestation 与 storage endpoint identity 全闭环。第三步收束到证据边界: 商业部署必须补 SPDM/TDISP/NVMe endpoint evidence。引用时只把 Hazel related work and threat model; README boundary 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Hazel related work and threat model; README boundary.

- Proof object: cards - deployment gaps: DPU attestation; SPDM/TDISP; NVMe-oF endpoint identity; crash consistency; KBS operations


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** 实验环境与数据: NVMe-oF + BlueField-3 原型，synthetic、IO500、YCSB、ML training。

- 硬件: 高性能 PCIe SSD 与 NVIDIA BlueField-3 DPU。
- Benchmarks: synthetic read/write patterns、IO500、YCSB/RocksDB、ResNet50/UNet3D ML pipeline。
- 指标: throughput、IOPS、latency、CPU usage、p99 latency。

**讲解稿:** 讲解时先把本页结论落到一句话: 实验环境与数据: NVMe-oF + BlueField-3 原型，synthetic、IO500、YCSB、ML training。第一步解释为什么需要这一页: 硬件: 高性能 PCIe SSD 与 NVIDIA BlueField-3 DPU。第二步说明论文或规范实际做了什么: Benchmarks: synthetic read/write patterns、IO500、YCSB/RocksDB、ResNet50/UNet3D ML pipeline。第三步收束到证据边界: 指标: throughput、IOPS、latency、CPU usage、p99 latency。引用时只把 Hazel implementation/evaluation Section 4-5; Figure 11-Figure 13 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Hazel implementation/evaluation Section 4-5; Figure 11-Figure 13.

- Proof object: matrix - 实验设置: Storage = NVMe-oF / SSD; Offload = BlueField-3; Benchmarks = synthetic/IO500/YCSB/ML; Metrics = throughput/latency/CPU; Status = preprint


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能结论: Hazel 在常见大读写/应用路径开销低，但小随机 freshness 路径仍是弱点。

- Figure 11: IO500 overhead mostly below 10%，average 6.3%。
- Figure 12: YCSB p99 latency average 2.2%，throughput average 0.6%。
- Figure 13/文本: ML training freshness overhead 约 1%-2%；随机小 I/O freshness path 可显著变差。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能结论: Hazel 在常见大读写/应用路径开销低，但小随机 freshness 路径仍是弱点。第一步解释为什么需要这一页: Figure 11: IO500 overhead mostly below 10%，average 6.3%。第二步说明论文或规范实际做了什么: Figure 12: YCSB p99 latency average 2.2%，throughput average 0.6%。第三步收束到证据边界: Figure 13/文本: ML training freshness overhead 约 1%-2%；随机小 I/O freshness path 可显著变差。引用时只把 Hazel Figure 11-Figure 13; evaluation text 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Hazel Figure 11-Figure 13; evaluation text.

- Proof object: bars - key numbers: IO500 avg overhead 6.3%; YCSB p99 latency avg 2.2%; YCSB throughput avg 0.6%; ML freshness overhead 1%-2%


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: Hazel 是 secure disaggregated storage 的强 draft SOTA，但必须标注 preprint 与 endpoint trust 缺口。

- 优势: 把 confidentiality/integrity/freshness/DPU offload 集成进一个 storage prototype。
- 局限: preprint；DPU attestation、SPDM/TDISP、crash consistency 与 production KBS 运维仍需强化。
- 商业化潜力: 云 confidential storage、NVMe-oF/JBOF、DPU offload；落地风险在小随机 I/O 和证据闭环。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: Hazel 是 secure disaggregated storage 的强 draft SOTA，但必须标注 preprint 与 endpoint trust 缺口。第一步解释为什么需要这一页: 优势: 把 confidentiality/integrity/freshness/DPU offload 集成进一个 storage prototype。第二步说明论文或规范实际做了什么: 局限: preprint；DPU attestation、SPDM/TDISP、crash consistency 与 production KBS 运维仍需强化。第三步收束到证据边界: 商业化潜力: 云 confidential storage、NVMe-oF/JBOF、DPU offload；落地风险在小随机 I/O 和证据闭环。引用时只把 Hazel conclusion and README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Hazel conclusion and README evaluation.

- Proof object: matrix - 评价: 优势 = full storage data-path prototype; 局限 = preprint / endpoint gaps; 商业化 = confidential storage; 本方向角色 = storage-path SOTA


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
