# CoVE: Towards Confidential Computing on RISC-V Platforms

- BibTeX key: `sahita2023cove`
- Category: `risc-v-confidential-computing`
- Authors: Ravi Sahita et al.
- Year: 2023
- Source: https://arxiv.org/abs/2304.06167
- PDF source: https://arxiv.org/pdf/2304.06167
- Local PDF: `paper.pdf`
- Download status: downloaded and verified

- Evidence role: Foundational. Use as a foundational entry point for this survey lane; later SOTA, specification, or implementation details should be cited separately when making narrow claims.

<!-- BEGIN PAPER REVIEW -->
## Paper Review
### 1. 论文基本信息

- 论文标题: CoVE: Towards Confidential Computing on RISC-V Platforms
- 作者 / 机构: Ravi Sahita et al.; Rivos
- 发表会议 / 年份: arXiv 2023
- 领域分类: 架构 / 系统 / 安全
- 一句话总结: 论文提出 RISC-V confidential VM 的参考架构方向，讨论 ISA、non-ISA 和 SoC 层需求。
- 最核心贡献一句话: 它是 CoVE/AP-TEE 规范化路线前的架构宣言，应作为 RISC-V confidential computing 主线的第一篇代表文献。

### 2. 研究问题与背景

论文针对多租户平台中 firmware、host OS、VMM 和 operator 都进入 tenant TCB 的问题，提出 RISC-V 需要 hardware-attested TEE 来保护 data-in-use。这个 gap 真实存在，因为当前 survey 正文只写 PMP/sIOPMP，不能表达 confidential VM 的 TVM/TSM 结构。

### 3. 核心方法拆解

方法是 reference architecture: untrusted host/resource manager -> trusted security monitor / TSM-like layer -> trusted virtual machine -> platform attestation and memory-protection substrate。论文讨论 privilege、hypervisor、PMP/内存保护、attestation、memory encryption/integrity 与 I/O 要求。

### 4. 安全性 / 正确性分析

论文主要是设计讨论，不提供完整 formal proof。攻击者模型是不信任 host/operator 和部分平台软件；侧信道、物理攻击和设备攻击需要额外机制。安全论证足以支撑 domain.md 补知识点，但不足以独立证明 CoVE 实现安全。

### 5. 实现细节

PDF 未给出完整实现代码或系统实现细节。它更接近架构 proposal。后续应以 Draft/not ratified: RISC-V AP-TEE v0.7 / RC2 for ARC review、Draft/not ratified: CoVE-IO v0.3.0、IOMMU/AIA 规范补接口和生命周期细节。

### 6. 实验设计分析

论文没有系统性能实验。实验结果应标记为“论文未说明”。与 Arm CCA、AMD SEV-SNP、Intel TDX 的比较主要是设计对照，而不是基准测试。

### 7. Novelty 分析

分类: solid systems contribution。新意在于把 RISC-V confidential VM 的机制需求系统化，并推动 CoVE 规范化；不是完整可评估的产品级实现。

### 8. 局限性与可能漏洞

最大局限是 proposal 性质强、缺少实现和评估。I/O、interrupt、device assignment、attestation evidence chain 在本文中仍不充分，需要 CoVE-IO 和 AP-TEE 规范补齐。

### 9. 和已有工作的关系

它承接 Keystone/Penglai 等 RISC-V enclave lineage，同时对齐 Arm CCA、AMD SEV-SNP、Intel TDX 的 confidential VM 模型。domain.md 应将其放在“RISC-V CoVE/AP-TEE 主线”的起点。

### 10. 复现与再实现计划

最小复现目标是从 AP-TEE 规范抽取 TVM/TSM/COVH/COVG/lifecycle/memory donation/attestation 表。验收标准是能和 Arm RMI/RSI/RMM/GPT/GPC 做一一对照。

### 11. 对后续研究的启发

1. 构建 CoVE lifecycle model。2. 评估 TSM TCB 与 RMM TCB。3. 设计 TVM attestation verifier。4. 建立 CoVE-IO DMA/interrupt 测试。5. 比较 CoVE 与 CCA 的 memory ownership transition。
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `09-riscv-cove-ap-tee` - RISC-V CoVE / AP-TEE Confidential VM
- Paper key: `sahita2023cove`
- Role: foundational RISC-V confidential VM architecture proposal
- Evidence base: CoVE PDF Figure 1 reference architecture; Figure 2 MTT enforcement; Figure 3 SoC view; Table 1 privilege levels.
- Boundary: CoVE 是 proposal/preprint，不是 ratified standard，也没有完整系统性能评估。

### 1. 完整题目 / 作者 / 会议

- 完整题目: CoVE: Towards Confidential Computing on RISC-V Platforms
- 作者: Ravi Sahita et al.
- 会议/来源: Public preprint / RISC-V CoVE proposal, 2023
- Title evidence: README metadata; CoVE PDF title page.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** CoVE 的贡献是把 RISC-V confidential computing 从 enclave 语言改写成 VM 语言。

- 动机: 云租户希望降低对 host OS/hypervisor 的信任，同时继续运行完整 guest OS。
- 工作: 定义 CoVE TVM、TSM、TSM-driver、MTT、confidential qualifier、COVH/COVG/COVI ABI。
- 数据: 架构 proposal 无完整 benchmark；证据主要是 reference architecture 和机制定义。

**讲解稿:** 讲解时先把本页结论落到一句话: CoVE 的贡献是把 RISC-V confidential computing 从 enclave 语言改写成 VM 语言。第一步解释为什么需要这一页: 动机: 云租户希望降低对 host OS/hypervisor 的信任，同时继续运行完整 guest OS。第二步说明论文或规范实际做了什么: 工作: 定义 CoVE TVM、TSM、TSM-driver、MTT、confidential qualifier、COVH/COVG/COVI ABI。第三步收束到证据边界: 数据: 架构 proposal 无完整 benchmark；证据主要是 reference architecture 和机制定义。引用时只把 CoVE Figure 1; Figure 2; Table 1; Section 3-6 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE Figure 1; Figure 2; Table 1; Section 3-6.

- Proof object: flow - CoVE model: tenant VM -> host VMM -> COVH ABI -> TSM-driver -> TSM -> MTT/confidential memory -> attestation


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是 VM 需要保留 hypervisor 的资源管理能力，但不能让 hypervisor 读写私有内存。

- 传统 VM 完全信任 hypervisor；CVM 要把 host 降级为 untrusted resource manager。
- RISC-V H extension 提供虚拟化底座，但还缺 confidential-mode、memory assignment 和 attestation。
- CoVE 的设计与 Arm CCA/Intel TDX/AMD SNP 在同一个概念层对齐。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是 VM 需要保留 hypervisor 的资源管理能力，但不能让 hypervisor 读写私有内存。第一步解释为什么需要这一页: 传统 VM 完全信任 hypervisor；CVM 要把 host 降级为 untrusted resource manager。第二步说明论文或规范实际做了什么: RISC-V H extension 提供虚拟化底座，但还缺 confidential-mode、memory assignment 和 attestation。第三步收束到证据边界: CoVE 的设计与 Arm CCA/Intel TDX/AMD SNP 在同一个概念层对齐。引用时只把 CoVE Section 1-3; related comparison sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE Section 1-3; related comparison sections.

- Proof object: matrix - 角色变化: Before = hypervisor trusted; CoVE = hypervisor manages but cannot inspect; TSM = security intermediary; TVM = confidential guest; Verifier = checks TCB and TVM evidence


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: CoVE 不是把 Keystone enclave 放大，而是用 TSM + MTT 重定义 VM memory ownership。

- TVM 包含 guest firmware、guest OS 和 application。
- MTT 跟踪 confidential memory，host 只有在 TSM 允许时才能 donate/reclaim/share。
- COVH 面向 host lifecycle，COVG 面向 guest attestation/share request，COVI 面向 secure interrupt。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: CoVE 不是把 Keystone enclave 放大，而是用 TSM + MTT 重定义 VM memory ownership。第一步解释为什么需要这一页: TVM 包含 guest firmware、guest OS 和 application。第二步说明论文或规范实际做了什么: MTT 跟踪 confidential memory，host 只有在 TSM 允许时才能 donate/reclaim/share。第三步收束到证据边界: COVH 面向 host lifecycle，COVG 面向 guest attestation/share request，COVI 面向 secure interrupt。引用时只把 CoVE Figure 1; Figure 2; lines on COVH/COVG/COVI 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE Figure 1; Figure 2; lines on COVH/COVG/COVI.

- Proof object: cards - CoVE primitives: TVM; TSM; TSM-driver; MTT; COVH/COVG/COVI


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: TSM 是 TEE 和 non-TEE 之间的 TCB intermediary，host 继续调度资源。

- SoC RoT measure TSM-driver 和 TSM，用于 attestation。
- Host/VMM 通过 COVH 创建 TVM、添加 page、调度 vhart。
- TVM 通过 COVG 请求 attestation、memory sharing 和 para-virtualized I/O。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: TSM 是 TEE 和 non-TEE 之间的 TCB intermediary，host 继续调度资源。第一步解释为什么需要这一页: SoC RoT measure TSM-driver 和 TSM，用于 attestation。第二步说明论文或规范实际做了什么: Host/VMM 通过 COVH 创建 TVM、添加 page、调度 vhart。第三步收束到证据边界: TVM 通过 COVG 请求 attestation、memory sharing 和 para-virtualized I/O。引用时只把 CoVE Figure 1 reference architecture 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE Figure 1 reference architecture.

- Proof object: matrix - 接口拆分: COVH = host -> TSM lifecycle; COVG = TVM -> TSM guest services; COVI = secure interrupt facilities; MTT = memory ownership; RoT = TCB measurement


### 6. 核心方法拆解

#### 方法 1: TSM / TSM-driver Split

**Claim:** CoVE 把安全 enforcement 放在 TSM，把 machine-specific bootstrap 和 context work 放在 TSM-driver。

- TSM-driver bootstrap TSM spatial/temporal isolation。
- TSM enforcement 聚焦 TVM memory/state invariants。
- 这种 split 允许实现差异，但也扩大 attestation 必须覆盖的 TCB。

**讲解稿:** 讲解时先把本页结论落到一句话: CoVE 把安全 enforcement 放在 TSM，把 machine-specific bootstrap 和 context work 放在 TSM-driver。第一步解释为什么需要这一页: TSM-driver bootstrap TSM spatial/temporal isolation。第二步说明论文或规范实际做了什么: TSM enforcement 聚焦 TVM memory/state invariants。第三步收束到证据边界: 这种 split 允许实现差异，但也扩大 attestation 必须覆盖的 TCB。引用时只把 CoVE Figure 1; Section 3.1 TSM-driver functions 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE Figure 1; Section 3.1 TSM-driver functions.

- Proof object: flow - TCB chain: SoC RoT -> TSM-driver -> TSM -> TVM metadata -> attestation token

#### 方法 2: Memory Tracking Table

**Claim:** MTT 是 CoVE memory isolation 的核心: 它记录物理页属于普通世界、TSM 还是某个 TVM。

- Host donate memory to TVM via TSM。
- MTT enforcement 阻止 host 访问 confidential page。
- Shared/non-confidential pages 必须显式标记，服务 para-virtualized I/O。

**讲解稿:** 讲解时先把本页结论落到一句话: MTT 是 CoVE memory isolation 的核心: 它记录物理页属于普通世界、TSM 还是某个 TVM。第一步解释为什么需要这一页: Host donate memory to TVM via TSM。第二步说明论文或规范实际做了什么: MTT enforcement 阻止 host 访问 confidential page。第三步收束到证据边界: Shared/non-confidential pages 必须显式标记，服务 para-virtualized I/O。引用时只把 CoVE Figure 2 MTT enforcement; Section 4 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE Figure 2 MTT enforcement; Section 4.

- Proof object: matrix - MTT states: Non-confidential = host-visible; Confidential = TVM-owned; TSM-owned = metadata/control; Shared = para-virtualized I/O; Reclaim = zero/clean before reuse

#### 方法 3: TVM Lifecycle Intrinsics

**Claim:** CoVE 把 VM 创建拆成 allocation、measurement、vhart creation、finalization 和 execution。

- Measured initial pages 进入 TVM measurement。
- Demand-zero confidential pages 可由 VMM 按需加入。
- Execution/fault/exit 仍需 host 调度，但 confidential state 由 TSM 保存恢复。

**讲解稿:** 讲解时先把本页结论落到一句话: CoVE 把 VM 创建拆成 allocation、measurement、vhart creation、finalization 和 execution。第一步解释为什么需要这一页: Measured initial pages 进入 TVM measurement。第二步说明论文或规范实际做了什么: Demand-zero confidential pages 可由 VMM 按需加入。第三步收束到证据边界: Execution/fault/exit 仍需 host 调度，但 confidential state 由 TSM 保存恢复。引用时只把 CoVE lifecycle bullets around TVM creation/execution 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE lifecycle bullets around TVM creation/execution.

- Proof object: flow - TVM lifecycle: detect TSM -> create TVM -> donate pages -> measure payload -> create vCPUs -> finalize -> run/exit

#### 方法 4: Attestation and Device Boundary

**Claim:** CoVE 明确 attestation 与 I/O 是后续能否安全商用的关键边界。

- DICE/SoC RoT 建立 TSM/TVM evidence chain。
- Device attachment 需要 SPDM/TDISP/IDE/IOMMU 等额外机制。
- 论文只提出边界要求，不等于完整 TEE-I/O 标准。

**讲解稿:** 讲解时先把本页结论落到一句话: CoVE 明确 attestation 与 I/O 是后续能否安全商用的关键边界。第一步解释为什么需要这一页: DICE/SoC RoT 建立 TSM/TVM evidence chain。第二步说明论文或规范实际做了什么: Device attachment 需要 SPDM/TDISP/IDE/IOMMU 等额外机制。第三步收束到证据边界: 论文只提出边界要求，不等于完整 TEE-I/O 标准。引用时只把 CoVE Section 6.4 SoC I/O and devices; attestation sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE Section 6.4 SoC I/O and devices; attestation sections.

- Proof object: cards - attestation chain: hardware RoT; TSM-driver measurement; TSM measurement; TVM measurement; device identity later


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** CoVE 是 architecture/proposal，无完整系统实验；实验页写成证据基础和边界。

- 证据源: 本地 PDF，包含 reference architecture、MTT enforcement、SoC view 和 privilege-level table。
- 可支撑: TVM/TSM/MTT/COVH/COVG/COVI 概念。
- 不能支撑: AP-TEE final ABI、生产实现开销、device TEE-I/O 完整安全。

**讲解稿:** 讲解时先把本页结论落到一句话: CoVE 是 architecture/proposal，无完整系统实验；实验页写成证据基础和边界。第一步解释为什么需要这一页: 证据源: 本地 PDF，包含 reference architecture、MTT enforcement、SoC view 和 privilege-level table。第二步说明论文或规范实际做了什么: 可支撑: TVM/TSM/MTT/COVH/COVG/COVI 概念。第三步收束到证据边界: 不能支撑: AP-TEE final ABI、生产实现开销、device TEE-I/O 完整安全。引用时只把 CoVE Figure 1-Figure 3; Table 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE Figure 1-Figure 3; Table 1.

- Proof object: matrix - 证据边界: 类型 = proposal/preprint; 实验 = 无完整 benchmark; 可支撑 = architecture semantics; 不能支撑 = production performance


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能页写成 claim strength: CoVE 没有给系统 overhead 数字。

- 它保留 host 资源管理能力，理论上降低兼容成本。
- 但 MTT lookup、TSM entry/exit、measurement 和 memory conversion 都可能产生开销。
- 具体性能必须等待 AP-TEE 实现或系统论文。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能页写成 claim strength: CoVE 没有给系统 overhead 数字。第一步解释为什么需要这一页: 它保留 host 资源管理能力，理论上降低兼容成本。第二步说明论文或规范实际做了什么: 但 MTT lookup、TSM entry/exit、measurement 和 memory conversion 都可能产生开销。第三步收束到证据边界: 具体性能必须等待 AP-TEE 实现或系统论文。引用时只把 CoVE scope and absence of evaluation benchmark 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE scope and absence of evaluation benchmark.

- Proof object: bars - claim strength: 架构清晰度 高; 标准成熟度 proposal; 性能数据 无; 后续影响 高


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: CoVE 是 RISC-V CVM 入口材料，强在概念完整，弱在证据成熟度。

- 优势: 对齐 CCA/TDX/SNP 的 TVM 模型，明确 TSM/MTT/ABI 分工。
- 局限: preprint/proposal；device I/O、debug、PMU、interrupt 等边界仍需后续 spec。
- 商业化潜力: 对开放 CVM 生态很关键；风险在标准收敛、firmware 质量和 verifier ecosystem。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: CoVE 是 RISC-V CVM 入口材料，强在概念完整，弱在证据成熟度。第一步解释为什么需要这一页: 优势: 对齐 CCA/TDX/SNP 的 TVM 模型，明确 TSM/MTT/ABI 分工。第二步说明论文或规范实际做了什么: 局限: preprint/proposal；device I/O、debug、PMU、interrupt 等边界仍需后续 spec。第三步收束到证据边界: 商业化潜力: 对开放 CVM 生态很关键；风险在标准收敛、firmware 质量和 verifier ecosystem。引用时只把 CoVE conclusion and README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE conclusion and README evaluation.

- Proof object: matrix - 评价: 优势 = CVM model for RISC-V; 局限 = proposal maturity; 商业化 = open confidential VM; 本方向角色 = reference architecture


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
