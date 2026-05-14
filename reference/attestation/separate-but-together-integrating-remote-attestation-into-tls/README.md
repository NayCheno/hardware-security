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

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `13-confidential-io-protocol-device-endpoint` - Confidential I/O Protocol / Device Endpoint
- Paper key: `weinhold2025tlsra`
- Role: peer-reviewed SOTA channel-binding mechanism for attested endpoints
- Evidence base: TLS+RA README; paper Figure 1 relay risk; Figure 2 TLS+RA flow; evaluation/implementation sections.
- Boundary: TLS+RA 不替代底层 TEE quote semantics，也不证明应用代码无漏洞；它解决 channel binding 与 endpoint identity 组合问题。

### 1. 完整题目 / 作者 / 会议

- 完整题目: Separate but Together: Integrating Remote Attestation into TLS
- 作者: Carsten Weinhold, Muhammad Usama Sardar, Ionut Mihalcea, Yogesh Deshpande, Hannes Tschofenig, Yaron Sheffer, Thomas Fossati, Michael Roitzsch
- 会议/来源: USENIX ATC 2025
- Title evidence: README metadata; USENIX ATC 2025 PDF title page.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** TLS+RA 的贡献是证明“这个 TLS 连接”真的终止在“这个 attested TEE/workload”里。

- 动机: 普通 TLS 证明域名/证书，remote attestation 证明 TEE 状态；两者并排执行会被 relay。
- 工作: 在 TLS 1.3 handshake 中携带/绑定 attestation request、nonce、evidence 和 transcript。
- 数据: peer-reviewed 系统论文，基于 OpenSSL 实现并评估握手开销。

**讲解稿:** 讲解时先把本页结论落到一句话: TLS+RA 的贡献是证明“这个 TLS 连接”真的终止在“这个 attested TEE/workload”里。第一步解释为什么需要这一页: 动机: 普通 TLS 证明域名/证书，remote attestation 证明 TEE 状态；两者并排执行会被 relay。第二步说明论文或规范实际做了什么: 工作: 在 TLS 1.3 handshake 中携带/绑定 attestation request、nonce、evidence 和 transcript。第三步收束到证据边界: 数据: peer-reviewed 系统论文，基于 OpenSSL 实现并评估握手开销。引用时只把 TLS+RA Figure 1-Figure 2; implementation/evaluation sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** TLS+RA Figure 1-Figure 2; implementation/evaluation sections.

- Proof object: flow - TLS+RA: ClientHello + RA request -> TEE generates evidence -> TLS transcript binding -> certificate verification -> attestation verification -> secure channel established


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是机密 workload 经常要远程注入 secret，但远端需要知道 TLS endpoint 和 TEE endpoint 是同一个。

- 只看 TLS: 不知道服务器是否在 TEE 中运行。
- 只看 RA: 不知道后续 TLS channel 是否被 relay 到 TEE 外。
- TLS+RA 解决二者的密码学绑定。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是机密 workload 经常要远程注入 secret，但远端需要知道 TLS endpoint 和 TEE endpoint 是同一个。第一步解释为什么需要这一页: 只看 TLS: 不知道服务器是否在 TEE 中运行。第二步说明论文或规范实际做了什么: 只看 RA: 不知道后续 TLS channel 是否被 relay 到 TEE 外。第三步收束到证据边界: TLS+RA 解决二者的密码学绑定。引用时只把 TLS+RA README and threat model 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** TLS+RA README and threat model.

- Proof object: matrix - 分离风险: TLS only = identity but no TEE state; RA only = state but no channel binding; Parallel = relay possible; TLS+RA = bound transcript; Verifier = checks both


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: Attestation evidence 必须绑定到 TLS transcript，而不是作为握手之外的附件。

- Nonce/challenge 防重放。
- Transcript binding 防止中间人把 evidence 挪到另一条 TLS channel。
- TLS PKI 与 TEE attestation infrastructure 保持 separate but together。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: Attestation evidence 必须绑定到 TLS transcript，而不是作为握手之外的附件。第一步解释为什么需要这一页: Nonce/challenge 防重放。第二步说明论文或规范实际做了什么: Transcript binding 防止中间人把 evidence 挪到另一条 TLS channel。第三步收束到证据边界: TLS PKI 与 TEE attestation infrastructure 保持 separate but together。引用时只把 TLS+RA design sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** TLS+RA design sections.

- Proof object: cards - security logic: fresh nonce; transcript binding; TEE evidence; TLS identity; independent failure domains


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: client 同时执行 TLS certificate validation 和 attestation verification，然后才相信 channel。

- Server 侧 TEE 内 TLS+RA library 生成 evidence。
- Client 验证证书链和 TEE quote/report。
- 只有二者都和 transcript 一致，secret 才应释放。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: client 同时执行 TLS certificate validation 和 attestation verification，然后才相信 channel。第一步解释为什么需要这一页: Server 侧 TEE 内 TLS+RA library 生成 evidence。第二步说明论文或规范实际做了什么: Client 验证证书链和 TEE quote/report。第三步收束到证据边界: 只有二者都和 transcript 一致，secret 才应释放。引用时只把 TLS+RA Figure 2 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** TLS+RA Figure 2.

- Proof object: matrix - 验证对象: TLS cert = domain/service identity; RA evidence = TEE/software state; Nonce = freshness; Transcript = channel binding; Policy = secret release decision


### 6. 核心方法拆解

#### 方法 1: Relay Attack Defense

**Claim:** TLS+RA 首先解决普通并排 TLS+RA 容易被 relay 的问题。

- 攻击者可让真实 TEE 生成 evidence，却让 TLS channel 终止在非 TEE 进程。
- Binding evidence to handshake transcript 阻止证据跨 channel 搬运。
- 这对 secret provisioning 特别关键。

**讲解稿:** 讲解时先把本页结论落到一句话: TLS+RA 首先解决普通并排 TLS+RA 容易被 relay 的问题。第一步解释为什么需要这一页: 攻击者可让真实 TEE 生成 evidence，却让 TLS channel 终止在非 TEE 进程。第二步说明论文或规范实际做了什么: Binding evidence to handshake transcript 阻止证据跨 channel 搬运。第三步收束到证据边界: 这对 secret provisioning 特别关键。引用时只把 TLS+RA Figure 1 relay attack 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** TLS+RA Figure 1 relay attack.

- Proof object: flow - relay blocked: attacker opens TLS -> requests TEE quote -> tries relay evidence -> transcript mismatch -> client rejects

#### 方法 2: TLS 1.3 Integration

**Claim:** 设计目标是兼容 TLS 生态，而不是重写安全通道协议。

- 使用 TLS extension 风格传递 attestation negotiation/evidence。
- 证书 PKI 与 attestation verifier 独立。
- 失败处理要区分 TLS failure 和 attestation failure。

**讲解稿:** 讲解时先把本页结论落到一句话: 设计目标是兼容 TLS 生态，而不是重写安全通道协议。第一步解释为什么需要这一页: 使用 TLS extension 风格传递 attestation negotiation/evidence。第二步说明论文或规范实际做了什么: 证书 PKI 与 attestation verifier 独立。第三步收束到证据边界: 失败处理要区分 TLS failure 和 attestation failure。引用时只把 TLS+RA design/implementation sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** TLS+RA design/implementation sections.

- Proof object: cards - integration: TLS extension; OpenSSL; TLS certificate path; attestation verifier; policy decision

#### 方法 3: Evidence Policy

**Claim:** TLS+RA 不判断所有 TEE 语义，它把 evidence 交给 policy/verifier。

- TEE vendor quote 格式仍由底层决定。
- 应用 policy 决定接受哪些 measurement。
- 这让机制可跨 Intel/AMD/Arm/RISC-V endpoint。

**讲解稿:** 讲解时先把本页结论落到一句话: TLS+RA 不判断所有 TEE 语义，它把 evidence 交给 policy/verifier。第一步解释为什么需要这一页: TEE vendor quote 格式仍由底层决定。第二步说明论文或规范实际做了什么: 应用 policy 决定接受哪些 measurement。第三步收束到证据边界: 这让机制可跨 Intel/AMD/Arm/RISC-V endpoint。引用时只把 TLS+RA design; README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** TLS+RA design; README evaluation.

- Proof object: matrix - policy split: Mechanism = bind evidence to channel; Verifier = parse quote/report; Policy = measurement allowlist; TLS = transport identity; Application = secret release


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** 实验环境与数据: peer-reviewed 系统实现，README 已记录 OpenSSL/TLS 1.3 集成。

- 证据源: USENIX ATC 2025 PDF 和本地 README。
- 实现: OpenSSL-based TLS+RA prototype。
- 边界: 支撑 channel binding，不支撑底层 TEE 安全或 device lifecycle。

**讲解稿:** 讲解时先把本页结论落到一句话: 实验环境与数据: peer-reviewed 系统实现，README 已记录 OpenSSL/TLS 1.3 集成。第一步解释为什么需要这一页: 证据源: USENIX ATC 2025 PDF 和本地 README。第二步说明论文或规范实际做了什么: 实现: OpenSSL-based TLS+RA prototype。第三步收束到证据边界: 边界: 支撑 channel binding，不支撑底层 TEE 安全或 device lifecycle。引用时只把 TLS+RA implementation/evaluation sections; README 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** TLS+RA implementation/evaluation sections; README.

- Proof object: matrix - 实验覆盖: Type = system paper; Implementation = OpenSSL/TLS 1.3; Metric = handshake overhead; Security = relay defense; Boundary = not TEE quote semantics


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能结论: TLS+RA 的开销主要在握手/control path，不是长期数据面。

- 额外成本来自 evidence generation、verification 和 handshake payload。
- 数据面仍走普通 TLS session keys。
- 具体数值以论文 evaluation 为准，PPT 不把它扩展成所有网络 I/O 性能。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能结论: TLS+RA 的开销主要在握手/control path，不是长期数据面。第一步解释为什么需要这一页: 额外成本来自 evidence generation、verification 和 handshake payload。第二步说明论文或规范实际做了什么: 数据面仍走普通 TLS session keys。第三步收束到证据边界: 具体数值以论文 evaluation 为准，PPT 不把它扩展成所有网络 I/O 性能。引用时只把 TLS+RA evaluation sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** TLS+RA evaluation sections.

- Proof object: bars - overhead sources: handshake payload medium; quote generation TEE-dependent; quote verification policy-dependent; data-path overhead low


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: TLS+RA 是 endpoint/channel binding 的强 SOTA，特别适合 confidential service secret provisioning。

- 优势: 问题切得准，避免 TLS 与 RA 并排使用的 relay 漏洞。
- 局限: 仍依赖底层 attestation correctness 和 application policy。
- 商业化潜力: API service、KBS、CVM secret injection、DPU/NIC control channel。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: TLS+RA 是 endpoint/channel binding 的强 SOTA，特别适合 confidential service secret provisioning。第一步解释为什么需要这一页: 优势: 问题切得准，避免 TLS 与 RA 并排使用的 relay 漏洞。第二步说明论文或规范实际做了什么: 局限: 仍依赖底层 attestation correctness 和 application policy。第三步收束到证据边界: 商业化潜力: API service、KBS、CVM secret injection、DPU/NIC control channel。引用时只把 TLS+RA README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** TLS+RA README evaluation.

- Proof object: matrix - 评价: 优势 = channel-bound attestation; 局限 = depends on quote policy; 商业化 = KBS/service endpoint; 本方向角色 = peer-reviewed SOTA


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
