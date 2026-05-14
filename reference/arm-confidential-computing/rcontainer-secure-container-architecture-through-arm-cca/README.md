# RContainer: A Secure Container Architecture through Extending ARM CCA Hardware Primitives

- BibTeX key: `zhou2025rcontainer`
- Category: `arm-confidential-computing`
- Authors: Qihang Zhou et al.
- Year: 2025
- Source: https://www.ndss-symposium.org/ndss-paper/rcontainer-a-secure-container-architecture-through-extending-arm-cca-hardware-primitives/
- PDF source: https://www.ndss-symposium.org/wp-content/uploads/2025-328-paper.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified

- Evidence role: Peer-reviewed SOTA. Use for the specific mechanism, evaluation, and threat-model scope established by the source; avoid broader claims outside its evidence class.
<!-- BEGIN PAPER REVIEW -->
## Paper Review
Canonical BibTeX key: `zhou2025rcontainer`. Evidence role: Peer-reviewed SOTA. Use for the specific mechanism, evaluation, and threat-model scope established by the source; avoid broader claims outside its evidence class.

This README records the source/PDF availability above and should be treated as the local evidence-status record for RContainer: A Secure Container Architecture through Extending ARM CCA Hardware Primitives. When citing this reference in the survey正文, keep the claim within the stated evidence role and cite stronger primary or official sources for mechanism details outside this source's scope.
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `04-arm-cca-deployment` - Arm CCA 细粒度隔离与部署模型
- Paper key: `zhou2025rcontainer`
- Role: container-level CCA deployment SOTA
- Evidence base: RContainer local PDF p.1-p.19; Fig.1 architecture; Fig.2 mixed-pagetable; Fig.3 pagefault; Fig.4-8 evaluation; Table I threat model.
- Boundary: 聚焦 container 隔离；不等同于完整 CVM confidential I/O 或进程内任意 domain 切换。

### 1. 完整题目 / 作者 / 会议

- 完整题目: RContainer: A Secure Container Architecture through Arm CCA
- 作者: Qihang Zhou et al.
- 会议/来源: NDSS 2025
- Title evidence: RContainer title page and README metadata.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** RContainer 的贡献是把 CCA 的隔离能力包装成 container-friendly runtime，而不是让每个容器都变成重 VM。

- 动机: Docker 容器轻量但隔离弱；VM/microVM 隔离强但开销和部署成本高。
- 工作: 设计 mini-OS、con-shim、mixed-pagetable、Shim-GPT 和控制流保护。
- 数据: 论文报告真实应用开销常在 4%-7%，Memcached/MySQL 等部分 workload 更低，生命周期操作大多低于 5%。

**讲解稿:** 讲解时先把本页结论落到一句话: RContainer 的贡献是把 CCA 的隔离能力包装成 container-friendly runtime，而不是让每个容器都变成重 VM。第一步解释为什么需要这一页: 动机: Docker 容器轻量但隔离弱；VM/microVM 隔离强但开销和部署成本高。第二步说明论文或规范实际做了什么: 工作: 设计 mini-OS、con-shim、mixed-pagetable、Shim-GPT 和控制流保护。第三步收束到证据边界: 数据: 论文报告真实应用开销常在 4%-7%，Memcached/MySQL 等部分 workload 更低，生命周期操作大多低于 5%。引用时只把 RContainer p.1 abstract; Fig.1; Fig.2; Fig.5; Fig.7; Table I 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RContainer p.1 abstract; Fig.1; Fig.2; Fig.5; Fig.7; Table I.

- Proof object: flow - RContainer 管线: container request -> mini-OS manages con-shim -> mixed page table -> Shim-GPT isolates memory -> deprivileged OS provides services -> container runs with stronger boundary


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是容器安全和轻量性长期冲突: 强隔离通常靠 VM，轻量容器通常共享 OS。

- 容器共享 host kernel，恶意容器可通过 kernel interface、procfs 或 namespace escape 攻击。
- 把每个容器放进 VM 会损失容器快速启动和高密度部署优势。
- CCA 提供新的物理地址空间权限，可能让容器以更低成本获得更强边界。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是容器安全和轻量性长期冲突: 强隔离通常靠 VM，轻量容器通常共享 OS。第一步解释为什么需要这一页: 容器共享 host kernel，恶意容器可通过 kernel interface、procfs 或 namespace escape 攻击。第二步说明论文或规范实际做了什么: 把每个容器放进 VM 会损失容器快速启动和高密度部署优势。第三步收束到证据边界: CCA 提供新的物理地址空间权限，可能让容器以更低成本获得更强边界。引用时只把 RContainer introduction; Table I threat model 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RContainer introduction; Table I threat model.

- Proof object: matrix - 容器隔离难点: Docker = lightweight but weak isolation; VM = strong but heavy; CCA = hardware PAS/GPT checks; 目标 = strong isolation + container UX; 风险 = OS/mini-OS TCB split


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: RContainer 不是把 OS 整体放进 TCB，而是用 mini-OS 管安全关键路径，让 deprivileged OS 继续提供普通服务。

- mini-OS 维护内存管理和控制流保护。
- deprivileged OS 与 mini-OS 同级运行，但通过 mixed-pagetable 和 GPT-routing 隔离。
- con-shim 是容器级隔离单元，负责承接容器执行状态。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: RContainer 不是把 OS 整体放进 TCB，而是用 mini-OS 管安全关键路径，让 deprivileged OS 继续提供普通服务。第一步解释为什么需要这一页: mini-OS 维护内存管理和控制流保护。第二步说明论文或规范实际做了什么: deprivileged OS 与 mini-OS 同级运行，但通过 mixed-pagetable 和 GPT-routing 隔离。第三步收束到证据边界: con-shim 是容器级隔离单元，负责承接容器执行状态。引用时只把 RContainer Fig.1 and Fig.2; design sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RContainer Fig.1 and Fig.2; design sections.

- Proof object: flow - TCB split: mini-OS trusted core -> con-shim per container -> deprivileged OS services -> mixed-pagetable boundary -> Shim-GPT permissions -> container workload


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: RContainer 用 mini-OS + con-shim + mixed-pagetable 代替传统 full OS TCB。

- Fig.1 展示 RContainer architecture。
- Fig.2 展示 shared page table 但不同 GPT 的 mixed-pagetable 机制。
- Fig.3 展示 pagefault workflow，让 fast path 尽量少进入高权限逻辑。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: RContainer 用 mini-OS + con-shim + mixed-pagetable 代替传统 full OS TCB。第一步解释为什么需要这一页: Fig.1 展示 RContainer architecture。第二步说明论文或规范实际做了什么: Fig.2 展示 shared page table 但不同 GPT 的 mixed-pagetable 机制。第三步收束到证据边界: Fig.3 展示 pagefault workflow，让 fast path 尽量少进入高权限逻辑。引用时只把 RContainer Fig.1-Fig.3 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RContainer Fig.1-Fig.3.

- Proof object: matrix - RContainer 组件: mini-OS = trusted memory/control-flow manager; con-shim = container isolation unit; deprivileged OS = service provider; mixed-pagetable = same page table, different GPT; GPT-routing = maps container to Shim-GPT


### 6. 核心方法拆解

#### 方法 1: Mini-OS 与 Con-Shim

**Claim:** mini-OS 只保留容器隔离所需的关键能力，减少高权限 TCB。

- con-shim 表示一个轻量 container security context。
- mini-OS 管理 con-shim memory、控制流和 pagefault fast path。
- deprivileged OS 负责服务但不能直接篡改 mini-OS/con-shim。

**讲解稿:** 讲解时先把本页结论落到一句话: mini-OS 只保留容器隔离所需的关键能力，减少高权限 TCB。第一步解释为什么需要这一页: con-shim 表示一个轻量 container security context。第二步说明论文或规范实际做了什么: mini-OS 管理 con-shim memory、控制流和 pagefault fast path。第三步收束到证据边界: deprivileged OS 负责服务但不能直接篡改 mini-OS/con-shim。引用时只把 RContainer Fig.1; design section around mini-OS and con-shim 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RContainer Fig.1; design section around mini-OS and con-shim.

- Proof object: cards - TCB 最小化: mini-OS; con-shim; deprivileged OS; container; control-flow protection

#### 方法 2: Mixed-Pagetable / Shim-GPT

**Claim:** mixed-pagetable 是 RContainer 的核心: 页表可共享，物理访问权限由不同 GPT 视图隔离。

- deprivileged OS 维护页表，mini-OS 通过 GPT-routing 绑定容器与 Shim-GPT。
- 容器运行前切到对应 GPT，阻止其他容器或 OS 访问私有页。
- 这避免了频繁重建页表带来的高开销。

**讲解稿:** 讲解时先把本页结论落到一句话: mixed-pagetable 是 RContainer 的核心: 页表可共享，物理访问权限由不同 GPT 视图隔离。第一步解释为什么需要这一页: deprivileged OS 维护页表，mini-OS 通过 GPT-routing 绑定容器与 Shim-GPT。第二步说明论文或规范实际做了什么: 容器运行前切到对应 GPT，阻止其他容器或 OS 访问私有页。第三步收束到证据边界: 这避免了频繁重建页表带来的高开销。引用时只把 RContainer Fig.2 mixed-pagetable; GPT-routing table discussion 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RContainer Fig.2 mixed-pagetable; GPT-routing table discussion.

- Proof object: flow - mixed-pagetable flow: shared page table -> container lookup GPT index -> switch to Shim-GPT -> run container -> GPC checks access -> return to service OS

#### 方法 3: Pagefault 与 Lifecycle Fast Path

**Claim:** 系统要可用，pagefault、创建、销毁和 OS 切换必须足够轻。

- Fig.3 区分快/慢 pagefault workflow。
- Table VIII 报告 OS switch、con-shim creation/termination 和 Set GPI 等 micro-cost。
- Fig.7 显示 docker lifecycle overhead 大多低于 5%，docker kill 最高约 8.5%。

**讲解稿:** 讲解时先把本页结论落到一句话: 系统要可用，pagefault、创建、销毁和 OS 切换必须足够轻。第一步解释为什么需要这一页: Fig.3 区分快/慢 pagefault workflow。第二步说明论文或规范实际做了什么: Table VIII 报告 OS switch、con-shim creation/termination 和 Set GPI 等 micro-cost。第三步收束到证据边界: Fig.7 显示 docker lifecycle overhead 大多低于 5%，docker kill 最高约 8.5%。引用时只把 RContainer Fig.3; Table VIII; Fig.7 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RContainer Fig.3; Table VIII; Fig.7.

- Proof object: matrix - runtime path: pagefault = fast/slow path; OS switch = about 492 us; con-shim create = about 530 us; Set GPI = 4KB page cost; docker lifecycle = mostly <5%, kill ~8.5%


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** RContainer 的实验环境覆盖 FVP 与 Armv8 hardware SoC，并测 lmbench、应用容器和 lifecycle。

- 证据源: NDSS 2025 PDF，本地验证。
- 功能证据: threat model matrix、architecture、mixed-pagetable、pagefault workflow。
- 性能证据: Fig.4 lmbench、Fig.5 应用、Fig.6 对比、Fig.7 lifecycle、Fig.8 kbuild。

**讲解稿:** 讲解时先把本页结论落到一句话: RContainer 的实验环境覆盖 FVP 与 Armv8 hardware SoC，并测 lmbench、应用容器和 lifecycle。第一步解释为什么需要这一页: 证据源: NDSS 2025 PDF，本地验证。第二步说明论文或规范实际做了什么: 功能证据: threat model matrix、architecture、mixed-pagetable、pagefault workflow。第三步收束到证据边界: 性能证据: Fig.4 lmbench、Fig.5 应用、Fig.6 对比、Fig.7 lifecycle、Fig.8 kbuild。引用时只把 RContainer p.1-p.19; Fig.1-Fig.8; Table I/VIII/IX 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RContainer p.1-p.19; Fig.1-Fig.8; Table I/VIII/IX.

- Proof object: matrix - 实验对象: 平台 = ARMv9-A FVP + ARMv8 hardware SoC; microbench = lmbench; apps = Apache/Nginx/Hackbench/Memcached/MySQL/Netperf; lifecycle = docker create/start/pause/rm/kill; 边界 = 模拟部分 Shelter comparison


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能页的核心数字: 真实应用 Apache/Nginx 约 4%-7% 平均约 5%，Memcached 稳定约 0.3%，MySQL 约 0.2%-0.3%，Netperf 低于 3%。

- RContainer 相比 virtualization 在大应用上明显低开销，论文称 virtualization 可超过 50%。
- 生命周期操作大多低于 5%，docker kill 约 8.5%。
- Hackbench 和 IPC encryption 是较高开销路径，需要单独解释。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能页的核心数字: 真实应用 Apache/Nginx 约 4%-7% 平均约 5%，Memcached 稳定约 0.3%，MySQL 约 0.2%-0.3%，Netperf 低于 3%。第一步解释为什么需要这一页: RContainer 相比 virtualization 在大应用上明显低开销，论文称 virtualization 可超过 50%。第二步说明论文或规范实际做了什么: 生命周期操作大多低于 5%，docker kill 约 8.5%。第三步收束到证据边界: Hackbench 和 IPC encryption 是较高开销路径，需要单独解释。引用时只把 RContainer Fig.5; Fig.7; lines around evaluation report 4%-7%, 0.3%, 0.2%-0.3%, <3%, kill ~8.5% 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RContainer Fig.5; Fig.7; lines around evaluation report 4%-7%, 0.3%, 0.2%-0.3%, <3%, kill ~8.5%.

- Proof object: bars - RContainer 性能读法: Apache/Nginx overhead 4%-7%; Memcached ~0.3%; MySQL 0.2%-0.3%; Netperf <3%; docker kill ~8.5%


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: RContainer 是 CCA 容器化部署的重要一步，优势是低开销；风险是 mini-OS 和兼容层仍需要工程成熟。

- 优势: 容器抽象清楚，mixed-pagetable 解决了强隔离与轻量性的冲突。
- 局限: 需要改 OS/runtime 路径，设备/I/O 和复杂容器生态仍是挑战。
- 商业化潜力: 可服务 cloud container confidential computing，但依赖 Arm CCA silicon、RMM、container runtime 和运维工具链。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: RContainer 是 CCA 容器化部署的重要一步，优势是低开销；风险是 mini-OS 和兼容层仍需要工程成熟。第一步解释为什么需要这一页: 优势: 容器抽象清楚，mixed-pagetable 解决了强隔离与轻量性的冲突。第二步说明论文或规范实际做了什么: 局限: 需要改 OS/runtime 路径，设备/I/O 和复杂容器生态仍是挑战。第三步收束到证据边界: 商业化潜力: 可服务 cloud container confidential computing，但依赖 Arm CCA silicon、RMM、container runtime 和运维工具链。引用时只把 RContainer conclusion and evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** RContainer conclusion and evaluation.

- Proof object: matrix - 评价: 优势 = container-friendly CCA isolation; 局限 = runtime/OS integration; 商业化 = confidential container platform; 本方向角色 = deployment SOTA


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
