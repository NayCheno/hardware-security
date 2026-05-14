# RISC-V Advanced Interrupt Architecture Specification

- BibTeX key: `riscv_aia_2023`
- Category: `risc-v-confidential-computing`
- Authors: RISC-V International
- Year: 2023
- Source: https://docs.riscv.org/reference/home/index.html
- Release: RISC-V Ratified Specifications Library document revised 20250312
- PDF source: https://docs.riscv.org/reference/aia/_attachments/riscv-interrupts.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Standardization status: v1.0 ratified in June 2023; current ratified-library document includes 20250312 clarifications
- Evidence role: Spec/standard SOTA. Use for the public standard, architecture, or specification semantics it defines; do not infer implementation security, performance, or platform completeness beyond the document.

<!-- BEGIN PAPER REVIEW -->
## Paper Review
### 1. 论文基本信息

- 论文标题: The RISC-V Advanced Interrupt Architecture
- 作者 / 机构: Editor John Hauser; RISC-V contributors
- 发表会议 / 年份: Specification v1.0 ratified June 2023; revised 20250312
- 领域分类: 架构 / 硬件 / 系统
- 一句话总结: 规范定义 RISC-V AIA，包括 hart CSRs、IMSIC、APLIC、MSI、虚拟化中断和 IOMMU MSI 支持。
- 最核心贡献一句话: 它是 RISC-V trusted MSI、virtual interrupt 和 CoVE/CoVE-IO interrupt path 的 ratified 基础。

### 2. 研究问题与背景

传统 PLIC 和中断路径难以满足现代虚拟化、MSI、per-hart interrupt file 和 confidential I/O 对可控 interrupt delivery 的需求。AIA 解决 interrupt controller/CSR/MSI/virtualization 架构问题，但不直接定义 TEE 策略。

### 3. 核心方法拆解

机制路径为 `device/MSI or interrupt source -> APLIC/IMSIC -> hart interrupt file/CSR -> M/S/VS delivery -> guest/TVM handler`。核心模块包括 Smaia/Ssaia、IMSIC、APLIC、machine/supervisor/VS CSRs、IPI、IOMMU support for MSIs to VMs。

### 4. 安全性 / 正确性分析

AIA 本身是功能/架构规范，安全性来自上层如何分配和保护 interrupt files、MSI pages 和 injection paths。对 CoVE-IO，trusted MSI 需要 AP-TEE/CoVE-IO 额外绑定 TVM、device identity 和 IMSIC ownership。

### 5. 实现细节

规范无实现。实现依赖 hart CSR、IMSIC memory-mapped files、APLIC、IOMMU MSI path 和 OS/hypervisor/TSM 支持。复现需要 interrupt controller model 和 VM/TVM interrupt tests。

### 6. 实验设计分析

规范无实验。测试应覆盖 MSI delivery、virtual interrupt exception、IMSIC binding/unbinding、IOMMU MSI translation、interrupt injection 和 stale configuration。

### 7. Novelty 分析

分类: solid systems contribution。贡献在 ratified interrupt architecture，安全研究价值来自它为 trusted interrupt path 提供标准部件。

### 8. 局限性与可能漏洞

AIA 不提供设备证明、MMIO/DMA 保护或 TVM lifecycle。错误的 IMSIC ownership、MSI remapping、host injection 或 rebind race 都可能破坏 confidential I/O 语义。

### 9. 和已有工作的关系

AIA 是 AP-TEE COVI 和 CoVE-IO trusted interrupt 的 supporting spec，也与 RISC-V IOMMU MSI support 相关。与 IOPMP/IOMMU 分工不同: AIA 处理中断，IOMMU/IOPMP 处理设备 memory access。

### 10. 复现与再实现计划

最小复现目标是在 emulator 中实现 IMSIC/APLIC subset，跑 VM interrupt injection 和 MSI remapping tests。验收标准是 host 无法向未授权 TVM 注入 trusted MSI，rebind 后旧路径失效。

### 11. 对后续研究的启发

1. CoVE COVI ABI 与 AIA IMSIC 的形式化对齐。2. Trusted MSI rebind/unbind race 检查。3. Interrupt DoS 与安全边界区分。4. IOMMU MSI table 和 AIA 的一致性测试。5. Device assignment 下 interrupt ownership transfer。潜在 venue: ASPLOS、USENIX Security、HOST、OSDI、NDSS。

### 12. Evidence README Addendum
- Evidence role: Spec/standard SOTA. Use for the public standard, architecture, or specification semantics it defines; do not infer implementation security, performance, or platform completeness beyond the document.
- 标准化 / 发表状态: AIA v1.0 ratified June 2023 with 20250312 clarifications
- 对应小方向: RISC-V 基础安全 primitives; RISC-V CoVE-IO / TEE-I/O

#### 内容摘要

AIA 是 RISC-V 现代中断、MSI 和虚拟化中断的基础规范。

#### 研究背景

confidential VM 和 trusted I/O 需要可隔离、可绑定、可撤销的中断路径。

#### 解决方案

定义 IMSIC、APLIC、hart CSRs、virtual interrupt delivery 和 IOMMU MSI support。

#### 实验结果

规范，无新实验。

#### 文章评价

AIA 是 trusted MSI 讨论的必要基础，但安全语义要由 AP-TEE/CoVE-IO 赋予。
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `07-riscv-primitives` - RISC-V 基础安全 Primitives
- Paper key: `riscv_aia_2023`
- Role: interrupt architecture specification
- Evidence base: AIA local PDF; Figure 1 traditional interrupt delivery; Figure 2 MSI/IMSIC; Table 1 limits.
- Boundary: 规范无实验；不证明某个 TEE 的 interrupt isolation。

### 1. 完整题目 / 作者 / 会议

- 完整题目: RISC-V Advanced Interrupt Architecture Specification
- 作者: RISC-V International
- 会议/来源: RISC-V AIA specification, 2023
- Title evidence: README metadata; RISC-V AIA spec PDF.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** AIA 的贡献是把 RISC-V interrupt 从传统 wired IRQ 推向 MSI/IMSIC 和虚拟化友好的模型。

- 动机: 多核、多 guest 和设备直通需要可扩展 interrupt routing。
- 工作: 定义 APLIC、IMSIC、MSI、guest interrupt files 和相关 CSR。
- 数据: spec 无实验；Figure 1/2 是讲解入口。

**讲解稿:** 讲解时先把本页结论落到一句话: AIA 的贡献是把 RISC-V interrupt 从传统 wired IRQ 推向 MSI/IMSIC 和虚拟化友好的模型。第一步解释为什么需要这一页: 动机: 多核、多 guest 和设备直通需要可扩展 interrupt routing。第二步说明论文或规范实际做了什么: 工作: 定义 APLIC、IMSIC、MSI、guest interrupt files 和相关 CSR。第三步收束到证据边界: 数据: spec 无实验；Figure 1/2 是讲解入口。引用时只把 AIA Figure 1; Figure 2; Table 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AIA Figure 1; Figure 2; Table 1.

- Proof object: flow - interrupt path: device event -> APLIC/MSI -> IMSIC interrupt file -> hart receives interrupt -> guest/host routing -> handler executes


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是 interrupt 也是可信边界: 设备和 host 可以通过错误中断影响 TVM/CVM execution。

- 传统 wired interrupt 不适合大规模虚拟化。
- MSI 让设备通过 memory write 发送 interrupt。
- Confidential computing 需要把 interrupt ownership 与 TVM/device lifecycle 绑定。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是 interrupt 也是可信边界: 设备和 host 可以通过错误中断影响 TVM/CVM execution。第一步解释为什么需要这一页: 传统 wired interrupt 不适合大规模虚拟化。第二步说明论文或规范实际做了什么: MSI 让设备通过 memory write 发送 interrupt。第三步收束到证据边界: Confidential computing 需要把 interrupt ownership 与 TVM/device lifecycle 绑定。引用时只把 AIA introduction; Figure 1/2 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AIA introduction; Figure 1/2.

- Proof object: matrix - interrupt 风险: Wired IRQ = routing complexity; MSI = message write as interrupt; IMSIC = per-hart interrupt files; Guest = virtual interrupt state; TEE gap = trusted lifecycle needed


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: I/O 安全不只看 DMA，还要看 interrupt 是否可伪造、错投或被 host 滥用。

- AIA 定义机制，Devlore/CoVE-IO 这类系统定义 trusted management。
- IMSIC/APLIC 让 interrupt virtualization 更清晰。
- 但 spec 本身不判断哪个 device 是否可信。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: I/O 安全不只看 DMA，还要看 interrupt 是否可伪造、错投或被 host 滥用。第一步解释为什么需要这一页: AIA 定义机制，Devlore/CoVE-IO 这类系统定义 trusted management。第二步说明论文或规范实际做了什么: IMSIC/APLIC 让 interrupt virtualization 更清晰。第三步收束到证据边界: 但 spec 本身不判断哪个 device 是否可信。引用时只把 AIA Figure 1/2; Devlore relation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AIA Figure 1/2; Devlore relation.

- Proof object: cards - 控制面对象: APLIC; IMSIC; MSI; guest interrupt file; routing policy


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: APLIC 处理 wired sources，IMSIC 接收 MSIs，hart/guest 通过 interrupt file 取中断。

- Figure 1 展示 traditional wired interrupt。
- Figure 2 展示 MSI + IMSIC。
- 虚拟化支持让 guest interrupt delivery 更可扩展。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: APLIC 处理 wired sources，IMSIC 接收 MSIs，hart/guest 通过 interrupt file 取中断。第一步解释为什么需要这一页: Figure 1 展示 traditional wired interrupt。第二步说明论文或规范实际做了什么: Figure 2 展示 MSI + IMSIC。第三步收束到证据边界: 虚拟化支持让 guest interrupt delivery 更可扩展。引用时只把 AIA Figure 1/2 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AIA Figure 1/2.

- Proof object: matrix - AIA 组件: APLIC = interrupt controller; IMSIC = per-hart MSI controller; MSI = message-signaled interrupt; Hart = interrupt receiver; Guest file = virtualized interrupt target


### 6. 核心方法拆解

#### 方法 1: APLIC / Wired Interrupts

**Claim:** APLIC 负责传统外部中断源的域和路由。

- 把 interrupt source 路由到 machine/supervisor/guest context。
- 支持优先级、pending/enabled 状态。
- TEE 场景需要防止不可信 manager 错配。

**讲解稿:** 讲解时先把本页结论落到一句话: APLIC 负责传统外部中断源的域和路由。第一步解释为什么需要这一页: 把 interrupt source 路由到 machine/supervisor/guest context。第二步说明论文或规范实际做了什么: 支持优先级、pending/enabled 状态。第三步收束到证据边界: TEE 场景需要防止不可信 manager 错配。引用时只把 AIA APLIC sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AIA APLIC sections.

- Proof object: flow - APLIC: external source -> domain -> priority/pending -> target hart -> interrupt delivery

#### 方法 2: IMSIC / MSI Delivery

**Claim:** IMSIC 把 MSI 变成 per-hart interrupt file，适合虚拟化和设备直通。

- 设备通过 message write 触发 interrupt。
- 每个 hart/guest 可有独立 interrupt file。
- CoVE-IO 需要在这个模型上绑定 trusted device assignment。

**讲解稿:** 讲解时先把本页结论落到一句话: IMSIC 把 MSI 变成 per-hart interrupt file，适合虚拟化和设备直通。第一步解释为什么需要这一页: 设备通过 message write 触发 interrupt。第二步说明论文或规范实际做了什么: 每个 hart/guest 可有独立 interrupt file。第三步收束到证据边界: CoVE-IO 需要在这个模型上绑定 trusted device assignment。引用时只把 AIA Figure 2; IMSIC sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AIA Figure 2; IMSIC sections.

- Proof object: flow - MSI path: device MSI write -> IMSIC file -> pending bit -> hart interrupt -> guest handler

#### 方法 3: Virtual Interrupt Boundary

**Claim:** AIA 提供 virtualization 机制，但可信边界还要靠 TSM/CoVE-IO/Devlore 类检查。

- Guest external interrupt 需要 routing state。
- Host 管理便利与 TVM 安全存在冲突。
- PPT 中应把 spec mechanism 和 trusted policy 分开。

**讲解稿:** 讲解时先把本页结论落到一句话: AIA 提供 virtualization 机制，但可信边界还要靠 TSM/CoVE-IO/Devlore 类检查。第一步解释为什么需要这一页: Guest external interrupt 需要 routing state。第二步说明论文或规范实际做了什么: Host 管理便利与 TVM 安全存在冲突。第三步收束到证据边界: PPT 中应把 spec mechanism 和 trusted policy 分开。引用时只把 AIA virtualization sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AIA virtualization sections.

- Proof object: matrix - spec vs policy: Spec = how interrupts route; TEE policy = who may configure; Risk = fake/wrong interrupt; Need = trusted lifecycle; Evidence = no experiment


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** AIA 是 interrupt 规范，无新实验；它支撑 07/10 的控制面术语。

- 证据源: local PDF 约 90 页。
- 核心图: Figure 1 traditional delivery, Figure 2 MSI/IMSIC, Table 1 limits。
- 边界: 不证明 confidential interrupt isolation。

**讲解稿:** 讲解时先把本页结论落到一句话: AIA 是 interrupt 规范，无新实验；它支撑 07/10 的控制面术语。第一步解释为什么需要这一页: 证据源: local PDF 约 90 页。第二步说明论文或规范实际做了什么: 核心图: Figure 1 traditional delivery, Figure 2 MSI/IMSIC, Table 1 limits。第三步收束到证据边界: 边界: 不证明 confidential interrupt isolation。引用时只把 AIA Figure 1/2; Table 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AIA Figure 1/2; Table 1.

- Proof object: matrix - 证据边界: 类型 = spec; 实验 = 无; 可支撑 = interrupt primitives; 不能支撑 = TEE policy proof


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能页写成无新实验: AIA spec 不给 interrupt latency benchmark。

- IMSIC/APLIC 会影响 interrupt scalability。
- 具体 latency/overhead 要引用实现或系统论文。
- 本页只说明性能相关路径。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能页写成无新实验: AIA spec 不给 interrupt latency benchmark。第一步解释为什么需要这一页: IMSIC/APLIC 会影响 interrupt scalability。第二步说明论文或规范实际做了什么: 具体 latency/overhead 要引用实现或系统论文。第三步收束到证据边界: 本页只说明性能相关路径。引用时只把 AIA spec scope 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AIA spec scope.

- Proof object: bars - claim strength: interrupt mechanism 高; performance data 无; TEE isolation 需另证


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: AIA 是 RISC-V I/O 控制面的关键规范，但必须和 IOMMU/CoVE-IO 合用。

- 优势: 支持 MSI/virtual interrupt scalability。
- 局限: 不定义 trusted device lifecycle。
- 商业化潜力: 多核/虚拟化/设备直通 RISC-V 平台必备。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: AIA 是 RISC-V I/O 控制面的关键规范，但必须和 IOMMU/CoVE-IO 合用。第一步解释为什么需要这一页: 优势: 支持 MSI/virtual interrupt scalability。第二步说明论文或规范实际做了什么: 局限: 不定义 trusted device lifecycle。第三步收束到证据边界: 商业化潜力: 多核/虚拟化/设备直通 RISC-V 平台必备。引用时只把 README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** README evaluation.

- Proof object: matrix - 评价: 优势 = scalable interrupt architecture; 局限 = not trusted policy; 商业化 = virtualized RISC-V I/O; 本方向角色 = interrupt primitive


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
