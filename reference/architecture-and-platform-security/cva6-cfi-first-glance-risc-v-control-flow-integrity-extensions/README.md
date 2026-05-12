# CVA6-CFI: A First Glance at RISC-V Control-Flow Integrity Extensions

- BibTeX key: `manoni2026cva6cfi`
- Category: `architecture-and-platform-security`
- Authors: Simone Manoni; Emanuele Parisi; Riccardo Tedeschi; Davide Rossi; Andrea Acquaviva; Andrea Bartolini
- Year: 2026
- Venue: arXiv preprint
- Source: https://arxiv.org/abs/2602.04991
- PDF source: https://arxiv.org/pdf/2602.04991
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Evidence role: Draft/not ratified. arXiv/preprint implementation evidence for RISC-V Zicfiss/Zicfilp in CVA6; not evidence for TEE, memory-confidentiality, DMA-isolation, or CoVE/AP-TEE boundaries.

<!-- BEGIN REVIEW -->
## Review
### 1. 论文基本信息

- 论文标题: CVA6-CFI: A First Glance at RISC-V Control-Flow Integrity Extensions
- 作者 / 机构: Simone Manoni 等 / University of Bologna, Barcelona Supercomputing Center, Chips-IT
- 发表会议 / 年份: arXiv 2026
- 领域分类: 架构 / 硬件 / 安全
- 一句话总结: 论文首次设计、集成并评估 RISC-V Zicfiss/Zicfilp CFI 扩展在 CVA6 core 中的硬件实现。
- 最核心贡献一句话: 它给出 RISC-V 标准 CFI 扩展的早期 RTL 证据: 约 1.0% area overhead、最高 15.6% performance overhead。

### 2. 研究问题与背景

RISC-V embedded/application-class 平台常运行 memory-unsafe 代码，容易被 ROP 和 control-flow hijacking 攻击。RISC-V 已有 Zicfiss/Zicfilp，但缺少微架构实现和开销评估。攻击模型聚焦控制流劫持，不覆盖数据-only 攻击、side-channel、kernel compromise 或 TEE boundary。

### 3. 核心方法拆解

机制路径为 `compiler emits CFI instructions -> CVA6 decode -> SSU/LPU hardware checks -> exception on mismatch`。Zicfiss 用 shadow stack 保护 backward edge，Zicfilp 用 landing pad 保护 forward edge。核心模块包括 shadow stack unit、landing pad unit、CSR 扩展、decoder/MMU/commit stage 修改和 CFI-aware toolchain。

### 4. 安全性 / 正确性分析

安全主张针对 return address tampering 和 indirect branch hijack。论文实现硬件检查，但没有系统化攻击复现或形式化验证。强假设包括编译器正确插桩、shadow stack memory 访问控制正确、异常处理不被绕过。对 JOP/COP 细粒度策略、动态链接、内核态和多线程上下文切换证据有限。

### 5. 实现细节

实现集成到开源 CVA6，使用 shadow stack unit 和 landing pad unit。论文说明实现开源在 AlSaqr-platform/cva6 分支。平台为 GF22FDX 综合、QEMU user emulation 和 RTL-calibrated cycle model。复现需特定 RTL、SiFive CFI GCC toolchain、benchmark scripts。

### 6. 实验设计分析

硬件评估综合到 22nm FDX，目标 800 MHz；整体 pipeline area overhead 约 1.0%。软件评估用 MiBench automotive subset，CFI code-size overhead 约 22-23KB，CFI instructions 小于 0.5% executed instructions，最高 runtime overhead 15.6%。缺少 Linux kernel CFI path、真实 silicon power、SPEC/复杂 workloads 和 attack tests。

### 7. Novelty 分析

分类: solid systems contribution。它是 RISC-V CFI 标准扩展落到开源 core 的早期实现和测量，不是新 CFI 理论。

### 8. 局限性与可能漏洞

最大局限是 arXiv 短论文和早期实现。没有稳定 CFI-patched Linux，因此 user-emulation 限制明显。它保护 control-flow，不提供 memory confidentiality、attestation、DMA isolation 或 CCA/CoVE 边界。

### 9. 和已有工作的关系

对应 Intel CET、Arm BTI/PAC 的 RISC-V 标准化路线。与 RV-CURE/CHERIoT 关系是互补: CVA6-CFI 保护控制流，RV-CURE/CHERIoT 更偏 object/capability memory safety。与 TEE/CCA 关系是 defense-in-depth，不替代隔离。

### 10. 复现与再实现计划

最小复现目标是 checkout CVA6-CFI 分支，编译 CFI-aware MiBench，复现 area/cycle overhead。需要 Synopsys 或开源综合替代、QEMU/RTL sim、SiFive CFI GCC。验收标准是 shadow stack mismatch 和 landing pad mismatch 能触发异常，benchmark overhead 接近论文。

### 11. 对后续研究的启发

1. 在 Linux kernel 与 context switch 中评估 Zicfiss/Zicfilp。2. 将 CFI 与 RISC-V TEE runtime 结合，保护 TSM/security monitor。3. 对 LPU/SSU 做形式化 property checking。4. 与 CHERIoT/RV-CURE 组合形成 CFI+memory safety。5. 在 out-of-order/multicore CVA6 后继上评估。潜在 venue: ASPLOS、MICRO、HPCA、HOST、DAC。

### 12. Evidence README Addendum
- Evidence role: Draft/not ratified. arXiv/preprint implementation evidence for RISC-V Zicfiss/Zicfilp in CVA6; not evidence for TEE, memory-confidentiality, DMA-isolation, or CoVE/AP-TEE boundaries.
- 标准化 / 发表状态: arXiv preprint 2026
- 对应小方向: RISC-V 基础安全 primitives; Runtime CFI / memory-safety hardening

#### 内容摘要

CVA6-CFI 是 RISC-V Zicfiss/Zicfilp 的早期开源 core 集成评估。

#### 研究背景

RISC-V CFI 标准需要实际硬件成本和性能证据，否则 survey 只能停留在 ISA 层面。

#### 解决方案

在 CVA6 中加入 shadow stack unit 和 landing pad unit，并配套 CFI-aware toolchain 评估。

#### 实验结果

22nm FDX 下约 1.0% area overhead；MiBench automotive 子集最高 15.6% runtime overhead。

#### 文章评价

适合作为 RISC-V CFI 的 Draft/not ratified 实现证据。局限是 arXiv、短评估、user-space benchmark，不能证明 TEE 或 confidential computing 安全。
<!-- END REVIEW -->
