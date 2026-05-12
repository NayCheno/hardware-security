# Hardware Requirements for a Device Identifier Composition Engine

- BibTeX key: `tcg_dice_2018`
- Category: `attestation`
- Authors: Trusted Computing Group
- Year: 2018
- Venue: TCG Published specification, Level 00 Revision 78
- Source: https://trustedcomputinggroup.org/resource/dice-architecture/
- PDF source: https://trustedcomputinggroup.org/wp-content/uploads/Hardware-Requirements-for-Device-Identifier-Composition-Engine-r78_For-Publication.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12 with `pdfinfo`; 12 pages
- Survey lane: Arm/RISC-V confidential-computing defense; attestation and boot/lifecycle evidence
- Evidence role: E0 official specification. Use for DICE UDS/CDI derivation and boot measurement vocabulary; do not cite as a complete remote-attestation protocol, Android AVF profile, or platform-specific CCA/RISC-V attestation implementation.

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 1. 论文基本信息

- 论文标题: Hardware Requirements for a Device Identifier Composition Engine
- 作者 / 机构: Trusted Computing Group
- 发表会议 / 年份: TCG Published specification, Level 00 Revision 78, 2018
- 领域分类: 安全 / 硬件 / 标准
- 一句话总结: 该规范定义 DICE 如何从 Unique Device Secret 和 first mutable code measurement 派生 Compound Device Identifier。
- 最核心贡献一句话: 它把早期启动阶段的硬件根秘密、首个可变代码测量和派生身份绑定，为后续设备 attestation 和 sealing chain 提供基础语义。

### 2. 研究问题与背景

DICE 要解决 embedded/device boot identity 的根问题: 在执行任何可变代码之前，设备需要把不可变硬件秘密与即将运行的软件测量绑定，生成一个不暴露硬件根秘密的派生身份。该身份可以被后续启动阶段用来证明设备状态或派生更多密钥。

这个 gap 对本 survey 成立，因为 Aster、Android AVF、RATS/EAT 和很多 TEE attestation 流程都依赖 boot measurement chain 和 per-stage derived identity。DICE 不是完整远程证明协议，也不是 Arm CCA 或 Android AVF 官方 profile；它只提供硬件需求和 CDI/UDS 语义。

### 3. 核心方法拆解

机制路径是: `immutable DICE -> read Unique Device Secret -> measure first mutable code -> mix UDS and measurement with one-way function -> produce Compound Device Identifier -> disable UDS access -> transfer control to measured mutable code`。

核心概念包括 Unique Device Secret (UDS)、Compound Device Identifier (CDI)、first mutable code、DICE operation、one-way derivation、debug/reset requirements 和 UDS access control。关键设计选择是 UDS 不直接作为身份暴露，而是只用于派生 CDI；这样即使 CDI 和 code measurement 可见，也不应能反推 UDS。

### 4. 安全性 / 正确性分析

安全目标是让 CDI 绑定设备硬件秘密和最早可变代码状态，并阻止后续可变代码读取或恢复 UDS。规范要求 UDS 统计唯一、与其他身份用途隔离、只被 DICE 独占读取；DICE 每次 reset 后在任何可变代码运行前执行；DICE 在转交控制前禁止 UDS 访问并擦除可能恢复 UDS 的中间值。

强假设是 immutable 或 manufacturer-controlled DICE update process 正确，first mutable code measurement 正确，one-way function 安全，调试口和 reset/update 流程不破坏 UDS 隔离。规范不定义完整 CDI 证书格式、远程 verifier policy、RATS token、Android pVM profile、CCA Realm report 或 DPU/device attestation。

### 5. 实现细节

这是硬件需求规范，不提供代码实现。它规定 DICE 的执行时序、UDS properties、CDI derivation、debug behavior、DICE immutability/update process 和 UDS access disablement。平台实现可以用 hash 或 KDF 将 UDS 与 code measurement 混合，但具体算法、证书链和 higher-level attestation flow 由平台 profile 决定。

### 6. 实验设计分析

规范无新实验。证据来自 TCG Published specification。对本 survey 来说，DICE 的作用是提供 attestation/sealing chain 的 boot identity vocabulary；实验或部署结论必须来自 Aster、platform attestation papers、RATS/EAT profiles 或具体系统实现。

### 7. Novelty 分析

Novelty 分类: `Spec/industry SOTA`。它不是研究论文 novelty，而是标准化 vocabulary 和硬件需求。其价值在于让 boot-stage identity derivation 有统一术语，可被 Android pVM、embedded TEE、RATS/EAT 和 cloud confidential-computing evidence chain 复用。

### 8. 局限性与可能漏洞

最大局限是抽象层级低: DICE 本身不解决证书格式、verifier policy、revocation、rollback protection、runtime freshness、device assignment、DMA/I/O protection 或 application semantic correctness。若 manufacturer update process、debug controls、hash/KDF choice、measurement implementation 或 first mutable code storage 被破坏，CDI 语义会被削弱。规范也不覆盖 side channel、physical leakage、fault injection 或 supply-chain proof。

### 9. 和已有工作的关系

DICE 与 RATS/EAT 互补: DICE 描述 boot identity derivation，RATS/EAT 描述 attestation architecture/token roles。它也与 Aster 的 DICE-compatible Android pVM chain 相关: Aster 需要把 Realm-Monitor/pVM bootloader 纳入 DICE-like chain，但 DICE 规范本身不定义 Aster 的 Android CDD policy 或 CCA Realm semantics。

### 10. 复现与再实现计划

最低复现目标是在一个 toy boot chain 中实现 UDS + first mutable code measurement -> CDI derivation，并证明后续 mutable code 只能拿到 CDI、不能读取 UDS。需要 ROM/DICE stage、模拟 UDS、hash/KDF、first mutable code image、reset path 和 debug-control test。验收标准是 measurement 改变时 CDI 改变，UDS 不出现在 mutable code address space，中间值被清除，reset 后流程可重复。

### 11. 对后续研究的启发

1. CCA Realm DICE profile: 定义 Realm-Monitor、Realm initial measurement 和 pVM bootloader 的 DICE stage boundary。
2. CoVE/AP-TEE DICE mapping: 将 TSM/TVM launch evidence 映射到 UDS/CDI-style derivation。
3. DICE + RATS/EAT evidence chain: 把 CDI 派生身份、安全启动 measurement 和 EAT claims 绑定成 verifier 可消费格式。
4. DICE rollback freshness: 研究 CDI 与 secure storage/RPMB/monotonic counter 的组合，支撑 Aster-style rollback protection。
5. DICE for device endpoints: 将 DICE 用于 DPU/NIC/accelerator local roots，并与 SPDM/TDISP device identity 组合。

### 12. SOTA README Addendum

- SOTA 定位: Spec/industry SOTA
- 标准化 / 发表状态: TCG Published specification, Level 00 Revision 78
- 对应小方向: Boot identity, DICE, attestation root, sealing key derivation

#### 内容摘要

DICE 规范定义硬件在最早启动阶段如何用 UDS 和 first mutable code measurement 派生 CDI，为后续 attestation 和 sealing chain 建立根身份。

#### 研究背景

设备需要在运行可变软件前建立可归因、不可直接泄漏硬件根秘密的身份。单纯使用设备唯一密钥会暴露长期秘密，单纯测量软件又缺少硬件绑定。

#### 解决方案

DICE 在 reset 后、任意 mutable code 运行前执行，把 UDS 与 first mutable code measurement 通过 one-way function 混合生成 CDI，然后关闭 UDS 访问并清除中间值。

#### 实验结果

规范/标准，无新实验。证据基础是 TCG Published PDF；系统级可用性需要结合 Aster、RATS/EAT 和具体平台 attestation 实现。

#### 文章评价

DICE 是 attestation boot chain 的关键标准证据，适合补 Aster 和 Android AVF-on-CCA 的 DICE-compatible claim。引用边界必须清楚: 它不是完整 remote-attestation protocol，也不是 CCA/CoVE/SPDM/TDISP 或 Android production profile。
<!-- END PAPER REVIEW -->
