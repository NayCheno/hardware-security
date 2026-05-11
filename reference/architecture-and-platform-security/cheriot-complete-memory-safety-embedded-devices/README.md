# CHERIoT: Complete Memory Safety for Embedded Devices

- BibTeX key: `amar2023cheriot`
- Category: `architecture-and-platform-security`
- Authors: Saar Amar; David Chisnall; Tony Chen; Nathaniel Wesley Filardo; Ben Laurie; Kunyan Liu; Robert Norton; Simon W. Moore; Yucong Tao; Robert N. M. Watson; Hongyan Xia
- Year: 2023
- Venue: MICRO 2023
- Source: https://cheriot.org/ibex/flute/architecture/publication/2023/10/30/cheriot-at-micro.html
- PDF source: https://cheriot.org/papers/2023-micro-cheriot-uarch.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12; Microsoft Research PDF endpoint returned HTTP 403, CHERIoT project PDF succeeded
- SOTA role: Academic SOTA for CHERI-derived embedded compartmentalization and deterministic memory safety; useful follow-up for the runtime CFI / memory-safety hardening gap.

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 1. 论文基本信息

- 论文标题: CHERIoT: Complete Memory Safety for Embedded Devices
- 作者 / 机构: Saar Amar 等 / Microsoft, University of Cambridge, Google, Arm
- 发表会议 / 年份: MICRO 2023
- 领域分类: 架构 / OS / 安全
- 一句话总结: 论文把 CHERI capability 架构裁剪到嵌入式设备，并与 security-centric RTOS 协同实现 compartmentalized memory safety。
- 最核心贡献一句话: CHERIoT 证明 deterministic complete memory safety 可以在嵌入式资源约束和 real-time 要求下实现。

### 2. 研究问题与背景

嵌入式设备软件栈越来越复杂，但 page table、sanitizer、动态插桩和高级语言迁移常违反实时、成本或兼容性约束。论文 gap 是缺少生产可行的 embedded compartmentalization + memory safety。威胁模型假设 mutually distrusting compartments，目标是跨 compartment memory safety；不等同于 cloud TEE remote attestation。

### 3. 核心方法拆解

机制路径为 `CHERI-derived capability -> CHERIoT ISA/encoding -> RTOS compartment switcher -> allocator/scheduler compartments -> object/cross-compartment safety`。核心模块包括 capability permissions、global/local IFC bit、sealing/unsealing、RTOS compartments、heap allocator、scheduler、temporal safety offloads 和 interrupt-disabled constraints。

### 4. 安全性 / 正确性分析

安全主张强: 对跨 compartment object access 提供 deterministic bounds/permission/lifetime enforcement。强假设是 capability hardware 和 RTOS TCB 正确，compartment 内部逻辑 bug 不一定被完全消除。论文强调 local capabilities、防止 stack reference 泄露、heap UAF 防护等；但 remote attestation、DMA/I/O path 和 physical attacks 不是重点。

### 5. 实现细节

实现包括 CHERIoT ISA/encoding、RTOS、编译/运行时和硬件辅助。PDF 显示 TCB 中 hand-written RTOS primitive 约 300 instructions。复现需要 CHERIoT toolchain、Ibex/Flute 相关硬件环境和 RTOS examples。

### 6. 实验设计分析

论文评估 power、performance、area microarchitectural impacts、key facilities microbenchmarks 和 end-to-end IoT application。证据比纯模拟强，但 survey 使用时仍需回原文看具体表格和 benchmark 选择。与 Linux/server workload 不直接可比。

### 7. Novelty 分析

分类: potentially top-tier contribution。新意是 CHERI capability、RTOS compartment model 和 embedded real-time constraints 的端到端 co-design。

### 8. 局限性与可能漏洞

最大局限是适用场景偏 embedded RTOS，不是 general-purpose Linux 或 confidential VM。DMA、device identity、attestation、network stack 证据链和多核复杂性需要另查。迁移现有 C/C++ embedded code 仍有工程成本。

### 9. 和已有工作的关系

CHERIoT 继承 CHERI/Morello 思路，但针对低成本 embedded。与 RV-CURE 都属于 memory-safety hardening；与 TIMBER-V 都关注 embedded RISC-V/CHERI 风格硬件辅助隔离，但 CHERIoT 的 capability model 和 RTOS 更完整。

### 10. 复现与再实现计划

最小复现目标是运行 CHERIoT RTOS demo，构造跨 compartment OOB/UAF/immutable-reference 测试。需要 CHERIoT SDK、simulator/FPGA、sample IoT application。验收标准是非法跨 compartment access 被硬件 capability 检查阻止，interrupt latency 可界定，microbenchmarks 接近论文。

### 11. 对后续研究的启发

1. 将 CHERIoT compartment model 与 embedded attestation 结合。2. 比较 CHERIoT 与 TIMBER-V 的 TCB/性能/安全边界。3. 研究 DMA/IOPMP 与 capability memory safety 的组合。4. 把 CHERIoT 用作 secure device firmware root。5. 建立 embedded memory-safety benchmark。潜在 venue: MICRO、ASPLOS、USENIX Security、IEEE S&P、RTSS。

### 12. SOTA README Addendum

- SOTA 定位: Academic SOTA
- 标准化 / 发表状态: peer-reviewed MICRO 2023
- 对应小方向: Runtime CFI / memory-safety hardening

#### 内容摘要

CHERIoT 是面向嵌入式的 CHERI capability + RTOS co-design，目标是完整且确定性的 compartmentalized memory safety。

#### 研究背景

低成本、实时嵌入式设备无法直接采用桌面/服务器的 heavyweight memory-safety 技术。

#### 解决方案

裁剪 capability encoding 和 permissions，配合 RTOS compartment switcher、allocator 和 scheduler 来维护 lifetime 和权限不变量。

#### 实验结果

论文提供 area/power/performance、microbenchmark 和 end-to-end IoT application 评估；具体指标以原文表格为准。

#### 文章评价

这是 runtime hardening 的重要 SOTA。它不替代 TEE/CCA/CoVE，但适合作为 protected firmware 和 embedded compartmentalization 的研究方向。
<!-- END PAPER REVIEW -->
