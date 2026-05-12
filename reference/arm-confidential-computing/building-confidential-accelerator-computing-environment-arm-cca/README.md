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
