# RV-CURE: A RISC-V Capability Architecture for Full Memory Safety

- BibTeX key: `kim2023rvcure`
- Category: `architecture-and-platform-security`
- Authors: Yonghae Kim; Anurag Kar; Jaewon Lee; Jaekyu Lee; Hyesoon Kim
- Year: 2023
- Venue: arXiv preprint
- Source: https://arxiv.org/abs/2308.02945
- PDF source: https://arxiv.org/pdf/2308.02945
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- SOTA role: RISC-V hardware-assisted memory-safety research reference for capability/tagged-pointer protection across stack, heap, and globals.

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 1. 论文基本信息

- 论文标题: RV-CURE: A RISC-V Capability Architecture for Full Memory Safety
- 作者 / 机构: Yonghae Kim 等 / Georgia Tech, Arm Research
- 发表会议 / 年份: arXiv 2023
- 领域分类: 架构 / 编译器 / 安全
- 一句话总结: 论文提出 RISC-V capability architecture，通过 data-pointer tagging 和硬件 capability check 支持 full memory safety。
- 最核心贡献一句话: RV-CURE 在 BOOM/FireSim/Linux 上展示了 stack/heap/global 全覆盖 memory safety 约 10.8% SPEC 2017 C/C++ slowdown 的可行性。

### 2. 研究问题与背景

内存安全漏洞长期占主流漏洞来源，软件 sanitizer 开销高，fat pointer/CHERI 类方案兼容性成本大。论文要解决 performance、security、compatibility 三者同时满足的问题。威胁模型覆盖用户进程地址空间内 spatial/temporal memory safety bug，不覆盖 speculative side-channel、Rowhammer、硬件物理攻击或 TEE 隔离边界。

### 3. 核心方法拆解

机制路径为 `compiler DPT instrumentation -> pointer tag in high bits -> CMT metadata -> hardware capability-execution pipeline -> check every tagged-pointer memory access`。核心模块包括 tagd/xtag/cstr/cclr 指令、Capability Metadata Table、capability cache、store/clear buffers 和 BOOM memory pipeline 集成。

### 4. 安全性 / 正确性分析

安全目标是 spatial、temporal、intra-object memory safety。强项是保护 stack/heap/global，保持 source/binary compatibility 的论证。弱点是 tag collision、metadata table、compiler coverage、unchecked assembly/library 和 microarchitectural leakage 仍需细查。论文明确不阻止 PACMAN 类型 speculative attack 本身，但可阻断依赖真实 memory bug 的后续阶段。

### 5. 实现细节

原型基于 RISC-V BOOM、FireSim FPGA accelerated full-system simulation、Linux OS 和 LLVM pass。硬件加入 capability execution pipeline 与小型 buffers。复现难度高，需要 RTL、compiler pass、FireSim 环境和 SPEC 2017。

### 6. 实验设计分析

评估 SPEC 2017 C/C++，报告平均 10.8% slowdown；45nm FreePDK 综合估计 8.6% area、11.6% power overhead。指标覆盖性能/面积/功耗，但对大型真实服务、JIT、kernel、multithread race、legacy binary 混合生态覆盖有限。

### 7. Novelty 分析

分类: strong research novelty。它不是单纯 ISA 小改，而是 compiler、architecture、system 的 co-design，目标是完整 memory safety 与兼容性。

### 8. 局限性与可能漏洞

最大限制是 arXiv 状态和复杂系统栈。DPT 依赖编译器覆盖所有相关 memory access；CMT 是新的攻击面和性能瓶颈；与 virtual memory、signals、JIT、shared libraries、kernel boundary 的完整性需要更多证据。

### 9. 和已有工作的关系

RV-CURE 对比 CHERI、In-Fat Pointer、No-Fat、C3、AOS。与 CHERIoT 相比，它偏 Linux/full-system RISC-V capability pipeline；CHERIoT 偏 embedded RTOS 和 compartmentalization。与 CVA6-CFI 互补，分别覆盖 memory safety 和 control-flow integrity。

### 10. 复现与再实现计划

最小复现目标是用 LLVM pass 插桩小型 C benchmark，在 BOOM/FireSim 模型上验证 bounds/UAF 检测。需要 RV64 toolchain、LLVM pass、RTL modifications、FireSim、SPEC 或替代 benchmark。验收标准是 OOB/UAF demo 被拦截，性能开销在小 benchmark 上可解释。

### 11. 对后续研究的启发

1. 将 RV-CURE 用于保护 TSM/security monitor。2. 研究 DPT 与 virtualized confidential VM 的地址空间交互。3. 对 CMT tag collision 和 metadata corruption 做攻击评估。4. 与 Zicfiss/Zicfilp 组合形成 memory+CFI。5. 在真实 FPGA/ASIC 上测 power/latency。潜在 venue: ASPLOS、MICRO、USENIX Security、IEEE S&P、PLDI。

### 12. SOTA README Addendum

- SOTA 定位: Academic SOTA
- 标准化 / 发表状态: arXiv preprint 2023
- 对应小方向: Runtime CFI / memory-safety hardening; RISC-V 基础安全 primitives

#### 内容摘要

RV-CURE 提供 RISC-V full memory safety 的 capability/tagged-pointer 方案。

#### 研究背景

软件 sanitizer 太慢，fat pointer 兼容性差，工业 memory-safety 需求又非常强。

#### 解决方案

用 compiler DPT 生成 tagged pointers，用硬件 capability pipeline 检查 CMT metadata，覆盖 stack/heap/global。

#### 实验结果

论文报告 SPEC 2017 C/C++ 平均 10.8% slowdown，45nm 估计 8.6% area 和 11.6% power overhead。

#### 文章评价

研究价值高，但仍是 arXiv 原型。它是 memory-safety hardening，不是 confidential computing 或 memory encryption。
<!-- END PAPER REVIEW -->
