# VRASED: A Verified Hardware/Software Co-Design for Remote Attestation

- BibTeX key: `nunes2019vrased`
- Category: `attestation`
- Authors: Ivan De Oliveira Nunes; Karim Eldefrawy; Norrathep Rattanavipanon; Michael Steiner; Gene Tsudik
- Year: 2019
- Venue: 28th USENIX Security Symposium (USENIX Security 2019)
- Source: https://www.usenix.org/conference/usenixsecurity19/presentation/de-oliveira-nunes
- PDF source: https://www.usenix.org/system/files/sec19-nunes.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12 from USENIX open-access PDF
- Evidence class: E1 peer-reviewed primary paper
- Evidence role: Peer-reviewed SOTA for verified remote-attestation co-design. Use for hardware/software RA verification and MSP430/Basys3 prototype evidence; do not generalize to arbitrary TEE evidence profiles without platform-specific sources.

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 内容摘要

VRASED 设计并验证 Verifiable Remote Attestation for Simple Embedded Devices，把硬件隔离、软件 attestation routine 和形式化证明放在同一个 co-design 中。

### 研究背景

Remote attestation 的安全性常依赖硬件、软件和协议共同成立，但早期方案很少对实现级安全性质做机器可检查证明。低端 IoT 设备还需要控制硬件成本。

### 解决方案

VRASED 用少量硬件扩展保护 attestation 代码、密钥和内存访问，并用形式化验证证明关键安全性质。妙处是把 RA root 的硬件约束和软件实现一起验证，而不是只给协议草图或手工论证。

### 实验结果

论文在 TI MSP430 / Basys3 Artix-7 FPGA 上实现和评估，展示 verified RA design 的可行性和低硬件开销；具体资源、性能和验证规模以 USENIX 2019 原文为准。

### 文章评价

优点是证据强：同行评审、公开 PDF、形式化验证和真实原型结合。局限是目标为 simple embedded devices，不是云 CVM、Arm CCA Realm、RISC-V TVM 或 DPU/NIC endpoint 的完整 evidence chain。商业落地潜力在 MCU/IoT RoT 和可审计 attestation IP，风险在工具链、proof maintenance 和平台 profile 对接。
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `06-attestation-boot-lifecycle` - Attestation、Boot、Lifecycle
- Paper key: `nunes2019vrased`
- Role: verified RA co-design SOTA
- Evidence base: VRASED local PDF p.1-p.20; Figure 1 RA protocol; Table 1 notation; Figure 3 architecture; verification/evaluation sections.
- Boundary: 面向低端 MCU/embedded RA；不能直接替代 cloud CVM attestation 规范。

### 1. 完整题目 / 作者 / 会议

- 完整题目: VRASED: A Verified Hardware/Software Co-Design for Remote Attestation
- 作者: Ivan De Oliveira Nunes, Karim Eldefrawy, Norrathep Rattanavipanon, Michael Steiner, Gene Tsudik
- 会议/来源: USENIX Security 2019
- Title evidence: VRASED title page; README metadata.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** VRASED 的贡献是把 RA 从协议想法推进到硬件/软件协同形式化验证。

- 动机: 早期 RA 方案常有设计但缺 formal verification，implementation 与模型可能不一致。
- 工作: 定义 HW-Mod、SW-Att、K/CR/AR memory regions，并用 LTL/NuSMV 和 F* 验证组件。
- 数据: FPGA implementation publicly available，论文报告 synthesized components overhead minimal。

**讲解稿:** 讲解时先把本页结论落到一句话: VRASED 的贡献是把 RA 从协议想法推进到硬件/软件协同形式化验证。第一步解释为什么需要这一页: 动机: 早期 RA 方案常有设计但缺 formal verification，implementation 与模型可能不一致。第二步说明论文或规范实际做了什么: 工作: 定义 HW-Mod、SW-Att、K/CR/AR memory regions，并用 LTL/NuSMV 和 F* 验证组件。第三步收束到证据边界: 数据: FPGA implementation publicly available，论文报告 synthesized components overhead minimal。引用时只把 VRASED p.1 abstract; Figure 1; Table 1; verification/evaluation sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** VRASED p.1 abstract; Figure 1; Table 1; verification/evaluation sections.

- Proof object: flow - VRASED 管线: RA protocol -> HW-Mod access control -> SW-Att HMAC -> LTL specs -> NuSMV model checking -> F* verified software -> FPGA implementation


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是 RA 需要同时相信硬件规则、软件 MAC 代码和二者组合。

- 只证明协议不够，硬件实现可能允许 DMA/interrupt 绕过。
- 只证明 HMAC 不够，attestation key 和 code memory 也要保护。
- VRASED 的目标是 end-to-end definitions 到 implementation 都可验证。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是 RA 需要同时相信硬件规则、软件 MAC 代码和二者组合。第一步解释为什么需要这一页: 只证明协议不够，硬件实现可能允许 DMA/interrupt 绕过。第二步说明论文或规范实际做了什么: 只证明 HMAC 不够，attestation key 和 code memory 也要保护。第三步收束到证据边界: VRASED 的目标是 end-to-end definitions 到 implementation 都可验证。引用时只把 VRASED p.1-p.3 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** VRASED p.1-p.3.

- Proof object: matrix - RA 正确性对象: Key K = must remain secret; CR = code region protected; AR = attested region; DMA/interrupt = must not corrupt execution; SW-Att = verified HMAC behavior


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: 可验证 RA 必须把硬件状态机和软件 attestation 代码放进同一个证明边界。

- HW-Mod 保护 K 和 CR，并限制 DMA/interrupt。
- SW-Att 使用 HACL*/HMAC-SHA256 verified implementation。
- LTL specs 将安全性质表达为硬件信号和 memory-region 不变量。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: 可验证 RA 必须把硬件状态机和软件 attestation 代码放进同一个证明边界。第一步解释为什么需要这一页: HW-Mod 保护 K 和 CR，并限制 DMA/interrupt。第二步说明论文或规范实际做了什么: SW-Att 使用 HACL*/HMAC-SHA256 verified implementation。第三步收束到证据边界: LTL specs 将安全性质表达为硬件信号和 memory-region 不变量。引用时只把 VRASED Figure 3; Table 1; Section 4 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** VRASED Figure 3; Table 1; Section 4.

- Proof object: flow - co-design boundary: hardware signals -> memory regions -> key access -> software HMAC -> proof obligations -> attestation report


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: verifier 发 challenge，prover 的 HW-Mod 保证 SW-Att 在受保护条件下计算 HMAC。

- Figure 1 是通用 RA protocol。
- Figure 3 定义 VRASED hardware architecture。
- Table 1 给出 PC、DMA、irq、CR、KR、AR 等符号，是理解 proof 的钥匙。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: verifier 发 challenge，prover 的 HW-Mod 保证 SW-Att 在受保护条件下计算 HMAC。第一步解释为什么需要这一页: Figure 1 是通用 RA protocol。第二步说明论文或规范实际做了什么: Figure 3 定义 VRASED hardware architecture。第三步收束到证据边界: Table 1 给出 PC、DMA、irq、CR、KR、AR 等符号，是理解 proof 的钥匙。引用时只把 VRASED Figure 1; Table 1; Figure 3 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** VRASED Figure 1; Table 1; Figure 3.

- Proof object: matrix - VRASED 组件: Verifier = challenge and verify; SW-Att = HMAC over AR; HW-Mod = access-control FSM; K/CR/AR = key/code/attested memory; NuSMV/F* = proof tools


### 6. 核心方法拆解

#### 方法 1: Formal Specification in LTL

**Claim:** VRASED 把 RA 安全性质写成 LTL 公式并由 NuSMV 检查。

- 硬件信号包括 Ren/Wen/Daddr/DMAaddr/irq/PC。
- 性质覆盖 key secrecy、code integrity、atomicity 等。
- 形式化让硬件边界可审计。

**讲解稿:** 讲解时先把本页结论落到一句话: VRASED 把 RA 安全性质写成 LTL 公式并由 NuSMV 检查。第一步解释为什么需要这一页: 硬件信号包括 Ren/Wen/Daddr/DMAaddr/irq/PC。第二步说明论文或规范实际做了什么: 性质覆盖 key secrecy、code integrity、atomicity 等。第三步收束到证据边界: 形式化让硬件边界可审计。引用时只把 VRASED Section 4; Table 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** VRASED Section 4; Table 1.

- Proof object: cards - LTL objects: PC; CR; KR; AR; DMA; irq

#### 方法 2: Verified SW-Att

**Claim:** 软件侧不是随便写一个 HMAC，而是使用 verified implementation 并处理 compiler trust gap。

- SW-Att uses HACL* HMAC-SHA256 verified in F*。
- 论文讨论低端 MCU 缺 verified compiler 的挑战。
- 软件 proof 与硬件 enforcement 共同支撑 RA。

**讲解稿:** 讲解时先把本页结论落到一句话: 软件侧不是随便写一个 HMAC，而是使用 verified implementation 并处理 compiler trust gap。第一步解释为什么需要这一页: SW-Att uses HACL* HMAC-SHA256 verified in F*。第二步说明论文或规范实际做了什么: 论文讨论低端 MCU 缺 verified compiler 的挑战。第三步收束到证据边界: 软件 proof 与硬件 enforcement 共同支撑 RA。引用时只把 VRASED Section 4.3; software verification discussion 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** VRASED Section 4.3; software verification discussion.

- Proof object: flow - software proof: F* spec -> HACL* HMAC -> C implementation -> compiler caveat -> runs from CR -> HW protects execution

#### 方法 3: HW/SW Composition

**Claim:** 最终安全性来自硬件保护、软件 HMAC 和 composition proof。

- HW-Mod 限制 key/code access。
- SW-Att 计算 challenge-bound HMAC。
- composition 证明子性质足以推出端到端 RA property。

**讲解稿:** 讲解时先把本页结论落到一句话: 最终安全性来自硬件保护、软件 HMAC 和 composition proof。第一步解释为什么需要这一页: HW-Mod 限制 key/code access。第二步说明论文或规范实际做了什么: SW-Att 计算 challenge-bound HMAC。第三步收束到证据边界: composition 证明子性质足以推出端到端 RA property。引用时只把 VRASED proof/composition sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** VRASED proof/composition sections.

- Proof object: matrix - composition: HW = protect K/CR/atomicity; SW = compute HMAC over AR; Protocol = challenge freshness; Proof = sub-properties imply RA; Implementation = FPGA prototype


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** VRASED 是 peer-reviewed 系统+验证论文，包含 formal proof 和 FPGA implementation。

- 证据源: USENIX Security 2019 PDF，本地验证。
- 验证工具: LTL/NuSMV, F* verified HMAC。
- 实现: FPGA/MCU-style setting，论文报告 minimal overhead。

**讲解稿:** 讲解时先把本页结论落到一句话: VRASED 是 peer-reviewed 系统+验证论文，包含 formal proof 和 FPGA implementation。第一步解释为什么需要这一页: 证据源: USENIX Security 2019 PDF，本地验证。第二步说明论文或规范实际做了什么: 验证工具: LTL/NuSMV, F* verified HMAC。第三步收束到证据边界: 实现: FPGA/MCU-style setting，论文报告 minimal overhead。引用时只把 VRASED p.1-p.20; Figure 1/3; Table 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** VRASED p.1-p.20; Figure 1/3; Table 1.

- Proof object: matrix - 证据: 形式化 = LTL/NuSMV; 软件 = F*/HACL*; 硬件 = HW-Mod/FPGA; 实验 = implementation overhead; 边界 = embedded MCU scope


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能页要和证明一起读: VRASED 的重点是 verified RA，开销是低端设备上的实现成本。

- 论文报告 formally verified synthesized components minimal overhead。
- 不能把它当作 cloud attestation latency baseline。
- 性能与 attested memory size、HMAC cost、MCU frequency 强相关。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能页要和证明一起读: VRASED 的重点是 verified RA，开销是低端设备上的实现成本。第一步解释为什么需要这一页: 论文报告 formally verified synthesized components minimal overhead。第二步说明论文或规范实际做了什么: 不能把它当作 cloud attestation latency baseline。第三步收束到证据边界: 性能与 attested memory size、HMAC cost、MCU frequency 强相关。引用时只把 VRASED evaluation section 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** VRASED evaluation section.

- Proof object: bars - claim strength: formal proof 高; implementation evidence 中高; cloud CVM performance 低; embedded RA relevance 高


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: VRASED 是 RA 方向的强 SOTA，因为它把设计、实现和证明放在一起。

- 优势: proof-driven, HW/SW co-design, public implementation。
- 局限: MCU threat model；物理攻击和现代 TEE lifecycle 不完全覆盖。
- 商业化潜力: 可转化为 device RoT、IoT RA 和小型安全控制器设计方法。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: VRASED 是 RA 方向的强 SOTA，因为它把设计、实现和证明放在一起。第一步解释为什么需要这一页: 优势: proof-driven, HW/SW co-design, public implementation。第二步说明论文或规范实际做了什么: 局限: MCU threat model；物理攻击和现代 TEE lifecycle 不完全覆盖。第三步收束到证据边界: 商业化潜力: 可转化为 device RoT、IoT RA 和小型安全控制器设计方法。引用时只把 VRASED conclusion; README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** VRASED conclusion; README evaluation.

- Proof object: matrix - 评价: 优势 = verified co-design; 局限 = embedded scope; 商业化 = IoT/device RoT; 本方向角色 = verified RA anchor


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
