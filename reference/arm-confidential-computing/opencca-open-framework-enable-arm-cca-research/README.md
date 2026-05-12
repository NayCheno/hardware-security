# OpenCCA: An Open Framework to Enable Arm CCA Research

- BibTeX key: `bertschi2025opencca`
- Category: `arm-confidential-computing`
- Authors: Andrin Bertschi; Shweta Shinde
- Year: 2025
- Venue: 8th Workshop on System Software for Trusted Execution (SysTEX 2025)
- Source: https://arxiv.org/abs/2506.05129
- PDF source: https://arxiv.org/pdf/2506.05129
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Evidence role: Draft/not ratified. Use with explicit draft, preprint, or not-ratified status; do not treat as ratified standard, mature production evidence, or peer-reviewed consensus unless the source metadata says so.

<!-- BEGIN REVIEW -->
## Review
### 1. 论文基本信息

- 论文标题: OpenCCA: An Open Framework to Enable Arm CCA Research
- 作者 / 机构: Andrin Bertschi; Shweta Shinde / ETH Zurich
- 发表会议 / 年份: SysTEX 2025 / arXiv 2025
- 领域分类: 系统 / 安全 / 架构
- 一句话总结: OpenCCA 在 commodity Armv8.2 RK3588 板上模拟 CCA-bound software，为 Arm CCA 研究提供可测性能平台。
- 最核心贡献一句话: 它降低 Arm CCA 研究的硬件门槛，并缓解 FVP 不可 cycle-accurate 的评估问题。

### 2. 研究问题与背景

公开 Arm CCA 硬件缺失，研究者要么用 FVP 只能获得功能/指令计数，要么在非 CCA 板上 ad-hoc 移植，导致重复劳动和不可比结果。OpenCCA 的 gap 真实存在，论文调查 19 篇 CCA 工作中多数需要自行移植或缺少硬件评估。

### 3. 核心方法拆解

机制路径为 `FVP CCA-bound software -> modified TF-A/RMM/U-Boot -> commodity RK3588 -> lifecycle/performance measurement`。核心技术是软件模拟 realm/root world、替代缺失 GPT/RME 指令、适配 RMM stage-2/timer/FP traps、保持 hypervisor/CVM/kvmtool 不变。

### 4. 安全性 / 正确性分析

论文明确 OpenCCA 当前不在非 CCA 板上提供 CCA 等价安全，只面向功能正确和性能估计。它不能作为 Arm CCA security evidence；安全边界仍需官方 RME/RMM/spec 或真实硬件。

### 5. 实现细节

原型在 Radxa Rock 5B/RK3588，修改 TF-A 约 940 LoC、RMM 约 1440 LoC、U-Boot 约 216 LoC。hypervisor、CVM Linux 和 kvmtool 保持不变。复现需要刷固件、UART/power control 和 CCA 软件栈。

### 6. 实验设计分析

评估包括生命周期 metrics、FVP/OpenCCA 功能对照、case studies。优点是比 FVP 更接近真实性能；缺点是没有 RME/GPC 真实硬件安全和微架构等价性，性能仍是近似。

### 7. Novelty 分析

分类: solid systems contribution。贡献是研究基础设施，而非新安全机制。

### 8. 局限性与可能漏洞

最大限制是“模拟 CCA 操作”不能 enforce CCA security。缺失 RME/GPT/GPC 的硬件语义会影响安全和部分性能。适合作为 evaluation scaffold，不适合作为 production TEE。

### 9. 和已有工作的关系

OpenCCA 类似 OpenSGX 的研究平台角色。它支撑 Shelter、ACAI、RContainer、virtCCA、Devlore 等 CCA work 的评估可复用性，也可帮助本 survey 判断 Arm CCA 论文实验质量。

### 10. 复现与再实现计划

最小复现目标是用 OpenCCA boot 一个 realm/CVM Linux 并测 create/run/teardown lifecycle。需要 RK3588 board、flash server/UART、OpenCCA firmware stack。验收标准是 FVP 上的 CCA-bound code 能 lift-and-shift 到 board，关键 lifecycle metrics 可采集。

### 11. 对后续研究的启发

1. 建立 Arm CCA evaluation baseline。2. 将 OpenCCA 与真实 CCA hardware 对比校准。3. 为 CCA papers 提供 artifact standard。4. 结合 virtCCA 提升安全模拟。5. 评估 CCA research 的性能可比性。潜在 venue: SysTEX、ASPLOS artifacts、USENIX ATC、EuroSys、SEC artifacts。

### 12. Evidence README Addendum
- Evidence role: Draft/not ratified. Use with explicit draft, preprint, or not-ratified status; do not treat as ratified standard, mature production evidence, or peer-reviewed consensus unless the source metadata says so.
- 标准化 / 发表状态: SysTEX 2025 / arXiv preprint
- 对应小方向: Arm CCA 细粒度隔离与部署模型; Arm CCA 研究平台

#### 内容摘要

OpenCCA 是 Arm CCA 研究平台，允许在 commodity Arm board 上跑 CCA-bound stack。

#### 研究背景

真实 CCA 硬件缺失导致 FVP-only 或 ad-hoc board transplant，实验不可比。

#### 解决方案

修改 TF-A/RMM/U-Boot 模拟 RME/realm/root world 操作，同时保持上层 hypervisor/CVM stack 不变。

#### 实验结果

论文报告生命周期测量和案例研究；安全不等价于真实 CCA。

#### 文章评价

对 survey 很有用，可评价 CCA 论文实验环境。但引用时必须声明它是 research framework，不是安全实现。
<!-- END REVIEW -->
