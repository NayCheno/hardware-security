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
- SOTA role: secure disaggregated storage / NVMe-oF confidential data-path SOTA candidate

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

### 12. SOTA README Addendum

- SOTA 定位: Academic SOTA candidate
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
