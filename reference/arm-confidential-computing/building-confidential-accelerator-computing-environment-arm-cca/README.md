# Building Confidential Accelerator Computing Environment for Arm CCA

- BibTeX key: `wang2026cage`
- Category: `arm-confidential-computing`
- Authors: Chenxu Wang, Kun Lu, Fengwei Zhang, Yunjie Deng, Kevin Leach, Jiannong Cao, Zhenyu Ning, Shoumeng Yan, Tao Wei, Zhengyu He
- Year: 2026
- Venue: IEEE Transactions on Dependable and Secure Computing, 23(1)
- DOI: `10.1109/TDSC.2025.3615787`
- Source: https://ira.lib.polyu.edu.hk/handle/10397/117541
- PDF source: https://ira.lib.polyu.edu.hk/bitstream/10397/117541/1/Wang_Building_Confidential_Accelerator.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified
- Survey lane: Arm/RISC-V confidential-computing defense; confidential-computing network/I/O/data-path defense
- Evidence role: Peer-reviewed SOTA. Use for the specific mechanism, evaluation, and threat-model scope established by the source; avoid broader claims outside its evidence class.

<!-- BEGIN PAPER REVIEW -->
## Paper Review
### 1. 论文基本信息

- 论文标题: Building Confidential Accelerator Computing Environment for Arm CCA
- 作者 / 机构: Chenxu Wang et al.; SUSTech, PolyU, Vanderbilt, Hunan University, Ant Group
- 发表会议 / 年份: IEEE TDSC 2026
- 领域分类: 系统 / 安全 / 架构
- 一句话总结: 论文提出 CAGE，用 Arm CCA 的 GPC/GPT 和 Monitor 侧 shadow task 机制保护 Realm 使用 GPU/FPGA accelerator 的过程。
- 最核心贡献一句话: CAGE 在不改硬件的前提下，把 CCA Realm 与 unified-memory GPU、PCIe FPGA 的 confidential accelerator workflow 对齐。

### 2. 研究问题与背景

Arm CCA 能保护 Realm 内存，但通用 accelerator workload 会把敏感数据、任务描述符和代码交给 untrusted driver/runtime 管理。现有 GPU/FPGA TEE 多基于 SGX、TrustZone 或定制 accelerator hardware，无法直接适配 CCA 的 Realm-style architecture。论文声称的 gap 是: CCA 缺少可用的 confidential accelerator computing 环境，而 RME-DA 仍偏概念化。这个 gap 对本 survey 成立，因为 accelerator/DPU/SmartNIC offload 正是 confidential computing 的主要数据路径缺口。

攻击者可以控制 host OS、hypervisor、accelerator driver/runtime 和外设软件栈；论文信任 CCA hardware primitive、Monitor/RMM 逻辑和真实 accelerator 硬件本体。物理攻击、侧信道、rollback 等被标为 out-of-scope 或需正交机制。

### 3. 核心方法拆解

方法管线是: `Realm confidential task -> untrusted accelerator stack builds stub/shadow metadata -> Monitor verifies and constructs real task -> GPC/GPT protects Realm/accelerator buffers -> accelerator executes -> Monitor restores/cleans state`。CAGE 的核心模块包括 shadow task management、accelerator environment protection、GPT maintenance optimization 和 accelerator-specific workflow adaptation。GPU 侧处理 unified memory 和 GPU MMIO/register state；FPGA 侧处理 dedicated memory、XDMA metadata 和 PCIe workflow。

研究贡献在 shadow task 与 CCA GPC/GPT 组合。工程部分包括移植到 Arm FVP、Juno R2 + Mali-T624、Xilinx VCU118 FPGA 和 TF-A Monitor 修改。

### 4. 安全性 / 正确性分析

CAGE 防御未授权 memory access、恶意 metadata、GPU page-table 操纵、恶意 task submission、fake accelerator、SMMU/GPC 绕过和 FPGA dedicated-memory 泄漏。安全性主要来自 Monitor 对 metadata/code signature 的检查、GPC 对 CPU/GPU/外设访问的限制、MMIO/register 状态检查和环境清理。强假设是 accelerator 硬件可信、物理攻击排除、side-channel/rollback 需要正交方案。论文的安全分析较系统，但没有形式化证明完整状态机。

### 5. 实现细节

GPU 原型基于 Arm FVP Base RevC、Linux 5.3.0、TF-A 2.8 和 Arm Juno R2 + Mali-T624。论文报告 GPU 支持引入 1,301 LoC，FPGA 扩展额外 140 LoC；对比 Midgard driver 约 30K LoC 和 OpenCL runtime，CAGE 避免把重型 accelerator stack 纳入 TCB。FPGA 原型使用 Xilinx VCU118 和 XDMA workflow。

### 6. 实验设计分析

GPU 评估使用 Rodinia benchmark 和神经网络模型，报告 GPU benchmark 开销 0.58%--5.31%。FPGA 评估使用 FFT 和 matrix multiplication 等 benchmark，报告 9.61%--16.30% 开销。实验覆盖功能验证、安全分析、GPT optimization、GPU/FPGA 两种 accelerator 类型。局限是硬件环境仍不是最终 CCA production platform，GPU 类型偏 Arm endpoint unified-memory GPU，不能直接代表数据中心离散 GPU/DPU。

### 7. Novelty 分析

Novelty 分类: `strong research novelty`。CAGE 把 CCA Realm 语义真正推进到 accelerator workflow，并比只讨论 RME-DA 概念更可操作。相比 StrongBox，CAGE 的新意是从 TrustZone endpoint GPU 转向 CCA Realm；相比 ACAI，CAGE 的 shadow task 和 GPU/FPGA workflow 分析更细。

### 8. 局限性与可能漏洞

最大局限是 accelerator 硬件可信和 device identity 假设较强，SPDM/TDISP-style device attestation 不是核心实现。复杂 accelerator firmware、共享 GPU scheduling、multi-tenant DPU/NIC 以及 interrupt/fault delivery 还需要额外机制。Monitor 中加入 accelerator-specific logic 增加 TCB，后续需要形式化验证和最小化。

### 9. 和已有工作的关系

CAGE 与 ACAI、PORTAL、Devlore 共同构成 Arm CCA device/accelerator 子线: ACAI 偏 CCA accelerator protection，PORTAL 偏 device-access interface，Devlore 偏 interrupt protection，CAGE 偏 GPU/FPGA confidential accelerator workflow。它也连接 StrongBox、HETEE、ITX、CloudScale 等 accelerator TEE 工作，但 CAGE 的 CCA Realm 适配性更强。

### 10. 复现与再实现计划

最低复现目标是实现一个单 accelerator shadow-task pipeline: Realm 提供签名 metadata，Monitor 构建真实 task，GPC/GPT 限制 buffer 和 MMIO，driver 只能操作 stub。GPU 可先用 FVP test engine 或模拟 DMA 设备替代；FPGA 可简化为 XDMA descriptor check。验收标准是 malicious metadata、越权 DMA、非法 MMIO 和 stale task 均被拒绝或清理。

### 11. 对后续研究的启发

1. CAGE + TDISP/SPDM: 将 accelerator identity 和 shadow task lifecycle 绑定。
2. CAGE for DPU/SmartNIC: 把 shadow task 扩展到 packet-processing rules、queue descriptors 和 TLS termination keys。
3. Interrupt-complete lifecycle: 与 Devlore-style interrupt ownership 组合，补齐 accelerator completion path。
4. Formal Monitor minimization: 证明 GPT/GPC 更新和 shadow-task 状态机无 TOCTTOU。
5. Scheduler-aware confidential accelerator sharing: 在不泄漏任务状态的前提下支持多 Realm accelerator multiplexing。

### 12. Evidence README Addendum
- Evidence role: Peer-reviewed SOTA. Use for the specific mechanism, evaluation, and threat-model scope established by the source; avoid broader claims outside its evidence class.
- 标准化 / 发表状态: IEEE TDSC 2026 peer-reviewed journal article; expands CAGE/Arm CCA accelerator line
- 对应小方向: Arm CCA accelerator/device confidential computing

#### 内容摘要

CAGE 为 Arm CCA Realm 提供 GPU/FPGA confidential accelerator execution，避免把 untrusted driver/runtime 纳入 Realm TCB。

#### 研究背景

CCA 保护 CPU/Realm 内存，但 accelerator workflow 会暴露 code、data、metadata、MMIO 和 DMA path。

#### 解决方案

通过 shadow task、Monitor-side verification、GPC/GPT protection 和 accelerator workflow-specific cleanup 保护 unified-memory GPU 和 FPGA。

#### 实验结果

GPU benchmark 开销 0.58%--5.31%，FPGA benchmark 开销 9.61%--16.30%，TCB 增量约 1,301 LoC + 140 LoC。

#### 文章评价

这是 Arm CCA accelerator 方向必须引用的 Peer-reviewed SOTA；限制是 device identity、production CCA hardware 和复杂多租户 accelerator scheduling 仍需进一步研究。
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `14-accelerator-dpu-smartnic-offload` - Accelerator / DPU / SmartNIC Offload TEE
- Paper key: `wang2026cage`
- Role: peer-reviewed SOTA Arm CCA GPU/FPGA accelerator workflow
- Evidence base: CAGE Figure 5 GPU overhead; Figure 8 FPGA overhead; Table III breakdown; implementation LoC.
- Boundary: CAGE 不完整解决 device identity、SPDM/TDISP、真实量产 CCA 硬件和多租户 accelerator scheduling。

### 1. 完整题目 / 作者 / 会议

- 完整题目: Building Confidential Accelerator Computing Environment for Arm CCA
- 作者: Chenxu Wang et al.
- 会议/来源: IEEE Transactions on Dependable and Secure Computing (TDSC), 2026
- Title evidence: README metadata; TDSC 2026 PDF title page.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** CAGE 的贡献是把 Realm 的机密边界延伸到 accelerator workflow，而不是让 untrusted driver 直接处理敏感 task。

- 动机: Arm CCA 保护 Realm memory，但 accelerator driver/runtime 会接触 code、metadata、MMIO、DMA buffer 和 completion state。
- 工作: Monitor 维护 shadow task，验证 untrusted stub 操作，用 GPC/GPT 保护 accelerator buffers，并做 GPU/FPGA cleanup。
- 数据: GPU benchmark overhead 0.58%-5.31%，FPGA benchmark 9.61%-16.30%；GPU TCB 增量 1301 LoC，FPGA 额外 140 LoC。

**讲解稿:** 讲解时先把本页结论落到一句话: CAGE 的贡献是把 Realm 的机密边界延伸到 accelerator workflow，而不是让 untrusted driver 直接处理敏感 task。第一步解释为什么需要这一页: 动机: Arm CCA 保护 Realm memory，但 accelerator driver/runtime 会接触 code、metadata、MMIO、DMA buffer 和 completion state。第二步说明论文或规范实际做了什么: 工作: Monitor 维护 shadow task，验证 untrusted stub 操作，用 GPC/GPT 保护 accelerator buffers，并做 GPU/FPGA cleanup。第三步收束到证据边界: 数据: GPU benchmark overhead 0.58%-5.31%，FPGA benchmark 9.61%-16.30%；GPU TCB 增量 1301 LoC，FPGA 额外 140 LoC。引用时只把 CAGE abstract; Figure 5; Figure 8; implementation section 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CAGE abstract; Figure 5; Figure 8; implementation section.

- Proof object: flow - CAGE workflow: Realm app -> untrusted accelerator stack -> shadow task in Monitor -> GPC/GPT protected buffers -> GPU/FPGA execution -> verified result


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是 CCA 的 GPC/GPT 能保护内存 ownership，但 accelerator workflow 还有大量 metadata 和 queue state。

- Driver 可以伪造 task metadata 或地址。
- Accelerator DMA buffer 需要 Granule Protection Check/translation policy。
- GPU/FPGA workflow 差异大，不能只做通用 copy wrapper。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是 CCA 的 GPC/GPT 能保护内存 ownership，但 accelerator workflow 还有大量 metadata 和 queue state。第一步解释为什么需要这一页: Driver 可以伪造 task metadata 或地址。第二步说明论文或规范实际做了什么: Accelerator DMA buffer 需要 Granule Protection Check/translation policy。第三步收束到证据边界: GPU/FPGA workflow 差异大，不能只做通用 copy wrapper。引用时只把 CAGE introduction and threat model 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CAGE introduction and threat model.

- Proof object: matrix - CCA accelerator gap: Realm memory = protected by CCA; Driver/runtime = untrusted; Task metadata = tamper risk; DMA buffer = needs GPC/GPT; Device identity = not fully solved


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: 让 untrusted stack 继续做复杂工程，但在 Monitor 里重建并验证一个可信 shadow task。

- Shadow task 捕获真实 accelerator task 的安全关键字段。
- Monitor 验证 metadata、地址和状态转换。
- GPC/GPT 保护 accelerator-visible memory，降低 driver TCB。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: 让 untrusted stack 继续做复杂工程，但在 Monitor 里重建并验证一个可信 shadow task。第一步解释为什么需要这一页: Shadow task 捕获真实 accelerator task 的安全关键字段。第二步说明论文或规范实际做了什么: Monitor 验证 metadata、地址和状态转换。第三步收束到证据边界: GPC/GPT 保护 accelerator-visible memory，降低 driver TCB。引用时只把 CAGE design sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CAGE design sections.

- Proof object: cards - CAGE core: shadow task; Monitor verification; GPC/GPT protection; accelerator cleanup; untrusted stub


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: Realm 与 accelerator stack 之间插入 Monitor-side verification 和 GPT/GPC protection。

- Untrusted driver 发起 GPU/FPGA task。
- Monitor 检查并同步 shadow task 到真实 task。
- Protected buffers 经 accelerator GPT/GPC 管理，防止 host 访问敏感数据。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: Realm 与 accelerator stack 之间插入 Monitor-side verification 和 GPT/GPC protection。第一步解释为什么需要这一页: Untrusted driver 发起 GPU/FPGA task。第二步说明论文或规范实际做了什么: Monitor 检查并同步 shadow task 到真实 task。第三步收束到证据边界: Protected buffers 经 accelerator GPT/GPC 管理，防止 host 访问敏感数据。引用时只把 CAGE architecture figures; Figure 5/8 evaluation context 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CAGE architecture figures; Figure 5/8 evaluation context.

- Proof object: matrix - 组件: Realm = confidential workload; Monitor = shadow task and policy; Untrusted stack = driver/runtime; GPC/GPT = memory ownership; Accelerator = GPU/FPGA execution


### 6. 核心方法拆解

#### 方法 1: Shadow Task

**Claim:** Shadow task 是 CAGE 的核心抽象: 在可信 Monitor 内保存可验证的 accelerator task 镜像。

- 真实 task 仍由 untrusted stack 操作。
- Monitor 根据 shadow task 检查 metadata/address。
- 避免把庞大 GPU/FPGA driver 纳入 TCB。

**讲解稿:** 讲解时先把本页结论落到一句话: Shadow task 是 CAGE 的核心抽象: 在可信 Monitor 内保存可验证的 accelerator task 镜像。第一步解释为什么需要这一页: 真实 task 仍由 untrusted stack 操作。第二步说明论文或规范实际做了什么: Monitor 根据 shadow task 检查 metadata/address。第三步收束到证据边界: 避免把庞大 GPU/FPGA driver 纳入 TCB。引用时只把 CAGE design sections; shadow task discussion 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CAGE design sections; shadow task discussion.

- Proof object: flow - shadow task: driver prepares task -> Monitor extracts fields -> shadow task validates -> sync to real task -> launch accelerator

#### 方法 2: GPC/GPT Buffer Protection

**Claim:** CAGE 用 CCA GPC/GPT 保护 accelerator buffer ownership。

- Sensitive buffers 切到 Realm/accelerator 可用状态。
- Monitor 优化 GPT maintenance，减少同步开销。
- 错误地址/metadata 只导致 DoS，不应泄露或篡改 secret。

**讲解稿:** 讲解时先把本页结论落到一句话: CAGE 用 CCA GPC/GPT 保护 accelerator buffer ownership。第一步解释为什么需要这一页: Sensitive buffers 切到 Realm/accelerator 可用状态。第二步说明论文或规范实际做了什么: Monitor 优化 GPT maintenance，减少同步开销。第三步收束到证据边界: 错误地址/metadata 只导致 DoS，不应泄露或篡改 secret。引用时只把 CAGE GPC/GPT design and optimization sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CAGE GPC/GPT design and optimization sections.

- Proof object: matrix - buffer policy: Realm private = host blocked; Accelerator-visible = controlled by Monitor; Untrusted metadata = verified; GPT sync = optimized; Failure = DoS over disclosure

#### 方法 3: GPU vs FPGA Workflow

**Claim:** CAGE 明确 GPU 和 FPGA 工作流不同，因此保护模块也不同。

- GPU 侧重 task/queue/buffer 元数据。
- FPGA 侧重 bitstream/task metadata 和 XDMA-like path。
- 扩展到 DPU/SmartNIC 时也要重画 workflow-specific state。

**讲解稿:** 讲解时先把本页结论落到一句话: CAGE 明确 GPU 和 FPGA 工作流不同，因此保护模块也不同。第一步解释为什么需要这一页: GPU 侧重 task/queue/buffer 元数据。第二步说明论文或规范实际做了什么: FPGA 侧重 bitstream/task metadata 和 XDMA-like path。第三步收束到证据边界: 扩展到 DPU/SmartNIC 时也要重画 workflow-specific state。引用时只把 CAGE GPU/FPGA evaluation and implementation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CAGE GPU/FPGA evaluation and implementation.

- Proof object: cards - workflow-specific: GPU queue; GPU buffer; FPGA metadata; XDMA driver; device cleanup

#### 方法 4: TCB and Identity Boundary

**Claim:** CAGE 缩小 driver TCB，但仍未解决所有 device trust 问题。

- 增加约 1301 LoC GPU security modules 和 140 LoC FPGA extension。
- 真实 device identity/fake accelerator/SMMU 路径需要额外机制。
- SPDM/TDISP/IDE 是商业化时必须补上的层。

**讲解稿:** 讲解时先把本页结论落到一句话: CAGE 缩小 driver TCB，但仍未解决所有 device trust 问题。第一步解释为什么需要这一页: 增加约 1301 LoC GPU security modules 和 140 LoC FPGA extension。第二步说明论文或规范实际做了什么: 真实 device identity/fake accelerator/SMMU 路径需要额外机制。第三步收束到证据边界: SPDM/TDISP/IDE 是商业化时必须补上的层。引用时只把 CAGE implementation/security discussion 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CAGE implementation/security discussion.

- Proof object: matrix - boundary: TCB add = 1301 LoC + 140 LoC; Not solved = device identity; Needs = SPDM/TDISP; Risk = scheduler/side channels; Value = CCA workflow proof


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** 实验环境与数据: Arm CCA emulation/prototype，GPU Rodinia/ML 和 FPGA benchmarks。

- 实现: Arm Trusted Firmware-A v2.8 Monitor 修改，GPU security modules 1301 LoC，FPGA extension 140 LoC。
- GPU: 六个 Rodinia benchmarks 和 ML inference models。
- FPGA: 六个 C benchmarks / Xilinx workflow。

**讲解稿:** 讲解时先把本页结论落到一句话: 实验环境与数据: Arm CCA emulation/prototype，GPU Rodinia/ML 和 FPGA benchmarks。第一步解释为什么需要这一页: 实现: Arm Trusted Firmware-A v2.8 Monitor 修改，GPU security modules 1301 LoC，FPGA extension 140 LoC。第二步说明论文或规范实际做了什么: GPU: 六个 Rodinia benchmarks 和 ML inference models。第三步收束到证据边界: FPGA: 六个 C benchmarks / Xilinx workflow。引用时只把 CAGE implementation/evaluation sections; Figure 5; Figure 8 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CAGE implementation/evaluation sections; Figure 5; Figure 8.

- Proof object: matrix - 实验设置: Platform = Arm CCA emulation/prototype; GPU = Rodinia + ML inference; FPGA = Xilinx tasks; TCB = 1301 LoC + 140 LoC; Metrics = overhead/breakdown


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能结论: CAGE 的 GPU 开销较低，FPGA 更高但仍在论文声称的 moderate 区间。

- GPU Rodinia: overhead 0.58%-5.31%。
- FPGA benchmarks: overhead 9.61%-16.30%。
- 论文还报告通过优化缓解 84.63%-96.55% GPT sync overhead。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能结论: CAGE 的 GPU 开销较低，FPGA 更高但仍在论文声称的 moderate 区间。第一步解释为什么需要这一页: GPU Rodinia: overhead 0.58%-5.31%。第二步说明论文或规范实际做了什么: FPGA benchmarks: overhead 9.61%-16.30%。第三步收束到证据边界: 论文还报告通过优化缓解 84.63%-96.55% GPT sync overhead。引用时只把 CAGE Figure 5; Figure 8; GPT optimization evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CAGE Figure 5; Figure 8; GPT optimization evaluation.

- Proof object: bars - key numbers: GPU overhead low 0.58%; GPU overhead high 5.31%; FPGA overhead low 9.61%; FPGA overhead high 16.30%


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: CAGE 是当前 Arm CCA accelerator workflow 的强 SOTA，最适合支撑 GPU/FPGA confidential offload slides。

- 优势: 机制贴近 CCA，shadow task 概念清楚，GPU/FPGA 都有评估。
- 局限: device identity、production CCA hardware、multi-tenant scheduling、side channels 仍需额外机制。
- 商业化潜力: 可迁移到 DPU/SmartNIC queue descriptor 和 packet-processing task，但必须补 SPDM/TDISP。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: CAGE 是当前 Arm CCA accelerator workflow 的强 SOTA，最适合支撑 GPU/FPGA confidential offload slides。第一步解释为什么需要这一页: 优势: 机制贴近 CCA，shadow task 概念清楚，GPU/FPGA 都有评估。第二步说明论文或规范实际做了什么: 局限: device identity、production CCA hardware、multi-tenant scheduling、side channels 仍需额外机制。第三步收束到证据边界: 商业化潜力: 可迁移到 DPU/SmartNIC queue descriptor 和 packet-processing task，但必须补 SPDM/TDISP。引用时只把 CAGE conclusion and README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CAGE conclusion and README evaluation.

- Proof object: matrix - 评价: 优势 = CCA-native accelerator workflow; 局限 = identity/scheduling gaps; 商业化 = GPU/FPGA/DPU offload; 本方向角色 = Arm CCA SOTA


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
