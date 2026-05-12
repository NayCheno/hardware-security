# Separate but Together: Integrating Remote Attestation into TLS

- BibTeX key: `weinhold2025tlsra`
- Category: `attestation`
- Authors: Carsten Weinhold, Muhammad Usama Sardar, Ionut Mihalcea, Yogesh Deshpande, Hannes Tschofenig, Yaron Sheffer, Thomas Fossati, Michael Roitzsch
- Year: 2025
- Venue: USENIX Annual Technical Conference (USENIX ATC 2025)
- Source: https://www.usenix.org/conference/atc25/presentation/weinhold
- PDF source: https://www.usenix.org/system/files/atc25-weinhold.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Survey lane: confidential-computing network/I/O/data-path defense
- Evidence role: Peer-reviewed SOTA. Use for the specific mechanism, evaluation, and threat-model scope established by the source; avoid broader claims outside its evidence class.

<!-- BEGIN PAPER REVIEW -->
## Paper Review
### 1. 论文基本信息

- 论文标题: Separate but Together: Integrating Remote Attestation into TLS
- 作者 / 机构: Carsten Weinhold 等；Barkhausen Institut / TU Dresden / Arm / Linaro 等
- 发表会议 / 年份: USENIX ATC 2025
- 领域分类: 系统 / 安全 / 网络
- 一句话总结: 论文提出 TLS+RA，把 TLS 的证书身份和 remote attestation 的 TEE 状态证明绑定进同一次 TLS 1.3 握手。
- 最核心贡献一句话: 它解决 confidential computing 连接中“安全通道是否真正终止在被证明的 TEE 内”的关键网络端点问题。

### 2. 研究问题与背景

Confidential workload 需要远程注入 secrets 或建立业务连接，但普通 TLS 只证明域名/证书身份，remote attestation 只证明平台/软件状态。如果二者并排执行而没有密码学绑定，攻击者可能中继 attestation evidence，让 TLS channel 实际终止在 TEE 外。论文的 gap 对本 survey 很关键：network endpoint attestation 不只是拿到 quote，还要证明应用通道和 attested execution context 是同一个端点。

### 3. 核心方法拆解

TLS+RA pipeline: TLS ClientHello 携带 attestation request/nonce -> TEE 内 TLS+RA library 生成 attestation report -> TLS handshake 传递 certificate 和 report -> client 同时验证 TLS identity 与 attestation evidence -> channel key 与 attested endpoint 绑定。设计强调 deployment independence 和 failure independence：TLS CA/PKI 与 TEE vendor attestation infrastructure 分离，任一侧失败不应自动破坏另一侧保证。

### 4. 安全性 / 正确性分析

威胁模型考虑 TLS private key 或 attestation RoT key 单侧泄漏，但不同时泄漏。论文的关键安全点是防 relay attack，并避免把 attestation 安全性依赖到长寿命 TLS private key 上。它不替代底层 TEE attestation 语义，也不证明应用代码无漏洞；它只处理 channel binding 和 endpoint identity 组合问题。

### 5. 实现细节

论文实现基于 OpenSSL，支持 TLS 1.3 extension 风格的 attestation integration。代码公开。实现难点是兼容标准 TLS 部署，同时让 attestation evidence 与握手 transcript 正确绑定。

### 6. 实验设计分析

评估关注 handshake latency 和 channel throughput。论文主张不增加额外 round trip、不增加嵌套加密层，因此比外层 TLS + 内层 attested channel 的设计更轻。实验指标适合协议集成论文，但真实部署还需要 verifier policy、evidence formats、证书生命周期和多 TEE vendor 互操作评估。

### 7. Novelty 分析

分类: solid systems/security contribution。新意在于把 TLS 身份和 remote attestation 作为两个独立但可叠加的 assurance，而不是把一个塞进另一个的长期密钥体系。

### 8. 局限性与可能漏洞

TLS+RA 需要应用和 TLS library 运行在 TEE 内或被 attestation 覆盖。它依赖 verifier 能正确解释 evidence，也依赖 TEE vendor root 和 TLS PKI 的独立性。对 DPU/SmartNIC/NIC endpoints 来说，还需要设备身份、SPDM/TDISP 或平台 attestation 配合。

### 9. 和已有工作的关系

它补齐 EAT、SPDM、TDISP 之外的网络应用层问题：SPDM 证明设备，TDISP 管 interface lifecycle，TLS+RA 证明业务通道终止在 attested TEE 软件内。它也可作为 RA-TLS、RATS-TLS、Open Enclave Attested TLS 的 Peer-reviewed SOTA 对照。

### 10. 复现与再实现计划

最小复现目标是在一个 TEE demo 中运行 TLS+RA server，client 验证证书、attestation report 和 handshake binding。验收标准是 relay attacker 无法把 quote 从真实 TEE 转接到 TEE 外 TLS endpoint。

### 11. 对后续研究的启发

1. 为 Realm/TVM workload 建立 attested service endpoint。2. 将 TLS+RA 与 EAT/CCA token/CoVE evidence 对接。3. 研究 DPU/SmartNIC 上 TLS termination 的 attestation。4. 对比 SPDM device session 与 TLS application session。5. 形式化验证 verifier policy。
<!-- END PAPER REVIEW -->
