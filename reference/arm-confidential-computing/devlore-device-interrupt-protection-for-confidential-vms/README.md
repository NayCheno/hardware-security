# Devlore: Device Interrupt Protection for Confidential VMs

- BibTeX key: `bertschi2026devlore`
- Category: `arm-confidential-computing`
- Authors: Andrin Bertschi et al.
- Year: 2026
- Source: https://arxiv.org/abs/2408.05835
- PDF source: https://arxiv.org/pdf/2408.05835
- Local PDF: `paper.pdf`
- Download status: downloaded and verified

- Evidence role: Draft/not ratified. Use with explicit draft, preprint, or not-ratified status; do not treat as ratified standard, mature production evidence, or peer-reviewed consensus unless the source metadata says so.
<!-- BEGIN PAPER REVIEW -->
## Paper Review
Canonical BibTeX key: `bertschi2026devlore`. Evidence role: Draft/not ratified. Use with explicit draft, preprint, or not-ratified status; do not treat as ratified standard, mature production evidence, or peer-reviewed consensus unless the source metadata says so.

This README records the source/PDF availability above and should be treated as the local evidence-status record for Devlore: Device Interrupt Protection for Confidential VMs. When citing this reference in the survey正文, keep the claim within the stated evidence role and cite stronger primary or official sources for mechanism details outside this source's scope.
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `05-arm-cca-io-accelerator-interrupt` - Arm CCA I/O、DMA、Accelerator、Interrupt
- Paper key: `bertschi2026devlore`
- Role: device interrupt protection SOTA
- Evidence base: Devlore local PDF p.1-p.21; Figure 1 attacks; Figure 2 design; Figure 3 GIC configuration; Table 1/2/3.
- Boundary: 聚焦 interrupt path；不解决 accelerator memory encryption 或完整 trusted device attestation。

### 1. 完整题目 / 作者 / 会议

- 完整题目: DEVLORE: Device Interrupt Protection for Confidential VMs
- 作者: Andrin Bertschi et al.
- 会议/来源: Preprint / CCA device interrupt research, 2026
- Title evidence: Devlore title page and README metadata.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** Devlore 的贡献是补上 CCA device path 的控制面缺口: 恶意 hypervisor 可以伪造或操纵中断。

- 动机: CCA 保护 CVM 内存，但 integrated devices 需要 interrupt；hypervisor 控 GIC/vGIC 会产生 fake interrupt 风险。
- 工作: delegate interrupt management to hypervisor, but trusted software checks correctness。
- 数据: FVP 原型，四类设备，约 7k LoC 改动；stress workload overhead up to 1%，glmark2 GPU case overhead 0.06%。

**讲解稿:** 讲解时先把本页结论落到一句话: Devlore 的贡献是补上 CCA device path 的控制面缺口: 恶意 hypervisor 可以伪造或操纵中断。第一步解释为什么需要这一页: 动机: CCA 保护 CVM 内存，但 integrated devices 需要 interrupt；hypervisor 控 GIC/vGIC 会产生 fake interrupt 风险。第二步说明论文或规范实际做了什么: 工作: delegate interrupt management to hypervisor, but trusted software checks correctness。第三步收束到证据边界: 数据: FVP 原型，四类设备，约 7k LoC 改动；stress workload overhead up to 1%，glmark2 GPU case overhead 0.06%。引用时只把 Devlore p.1 abstract; Figure 1; Figure 2; Figure 3; Table 1/2/3 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Devlore p.1 abstract; Figure 1; Figure 2; Figure 3; Table 1/2/3.

- Proof object: flow - Devlore 问题路径: device raises interrupt -> GIC routes physical interrupt -> hypervisor virtualizes -> attacker may inject fake IRQ -> trusted checker validates -> CVM receives only valid interrupt


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是 memory isolation 和 interrupt isolation 不一样: 设备绑定一次内存后仍会在运行时不断发中断。

- Hypervisor 通常管理 GIC 配置、virtual interrupt 注入和优先级。
- 攻击者可注入 fake physical/virtual interrupts 影响 CVM control flow。
- CVM 需要设备完成通知，但不能信任 host 的 interrupt bookkeeping。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是 memory isolation 和 interrupt isolation 不一样: 设备绑定一次内存后仍会在运行时不断发中断。第一步解释为什么需要这一页: Hypervisor 通常管理 GIC 配置、virtual interrupt 注入和优先级。第二步说明论文或规范实际做了什么: 攻击者可注入 fake physical/virtual interrupts 影响 CVM control flow。第三步收束到证据边界: CVM 需要设备完成通知，但不能信任 host 的 interrupt bookkeeping。引用时只把 Devlore p.1-p.3; Figure 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Devlore p.1-p.3; Figure 1.

- Proof object: matrix - Interrupt attack surface: GIC config = hypervisor controlled; physical IRQ = device-originated but routable; virtual IRQ = host-injected to CVM; runtime = continuous delivery; 目标 = valid device IRQ only


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: 不必把所有 interrupt 管理都搬进 TCB；可以让 hypervisor 继续管理，但由 trusted side 记录和检查。

- Devlore 保护 registration、physical-to-virtual mapping 和 runtime delivery。
- Trusted software 记录 device/interrupt assignment，检查 physical 和 virtual interrupt 是否匹配。
- 这种 delegate-but-check 保留兼容性，减少 driver 改动。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: 不必把所有 interrupt 管理都搬进 TCB；可以让 hypervisor 继续管理，但由 trusted side 记录和检查。第一步解释为什么需要这一页: Devlore 保护 registration、physical-to-virtual mapping 和 runtime delivery。第二步说明论文或规范实际做了什么: Trusted software 记录 device/interrupt assignment，检查 physical 和 virtual interrupt 是否匹配。第三步收束到证据边界: 这种 delegate-but-check 保留兼容性，减少 driver 改动。引用时只把 Devlore p.1-p.2 contributions; Figure 2 design 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Devlore p.1-p.2 contributions; Figure 2 design.

- Proof object: flow - delegate-but-check: hypervisor configures GIC -> trusted side records assignment -> physical IRQ arrives -> check origin/number -> validate virtual IRQ -> deliver to CVM


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: Devlore 在 CCA/RMM/GIC 路径上增加 interrupt isolation state，不改应用和 device driver。

- Figure 1 展示 Arm interrupt architecture 和攻击。
- Figure 2 展示 Devlore design: isolation, physical interrupt record, virtual interrupt check。
- Table 1 给出 device lifecycle API，Table 2 给 driver compatibility。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: Devlore 在 CCA/RMM/GIC 路径上增加 interrupt isolation state，不改应用和 device driver。第一步解释为什么需要这一页: Figure 1 展示 Arm interrupt architecture 和攻击。第二步说明论文或规范实际做了什么: Figure 2 展示 Devlore design: isolation, physical interrupt record, virtual interrupt check。第三步收束到证据边界: Table 1 给出 device lifecycle API，Table 2 给 driver compatibility。引用时只把 Devlore Figure 1-Figure 3; Table 1 and Table 2 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Devlore Figure 1-Figure 3; Table 1 and Table 2.

- Proof object: matrix - Devlore 组件: CVM = interrupt receiver; Device = valid IRQ source; Hypervisor = delegated manager; Trusted checker = assignment + validation; GIC/vGIC = physical/virtual routing


### 6. 核心方法拆解

#### 方法 1: Interrupt Lifecycle Modeling

**Claim:** Devlore 把 interrupt 从 registration 到 delivery 拆成 lifecycle，而不是只防一次注入。

- Registration: 设备和 interrupt number 被绑定。
- Mapping: physical IRQ 到 virtual IRQ 的关系被记录。
- Delivery: runtime 检查是否为合法设备产生的 interrupt。

**讲解稿:** 讲解时先把本页结论落到一句话: Devlore 把 interrupt 从 registration 到 delivery 拆成 lifecycle，而不是只防一次注入。第一步解释为什么需要这一页: Registration: 设备和 interrupt number 被绑定。第二步说明论文或规范实际做了什么: Mapping: physical IRQ 到 virtual IRQ 的关系被记录。第三步收束到证据边界: Delivery: runtime 检查是否为合法设备产生的 interrupt。引用时只把 Devlore p.1-p.3; Figure 2 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Devlore p.1-p.3; Figure 2.

- Proof object: flow - interrupt lifecycle: register device IRQ -> record physical IRQ -> configure virtual mapping -> receive physical interrupt -> check virtual injection -> deliver to CVM

#### 方法 2: Physical 与 Virtual Interrupt 双检查

**Claim:** 攻击可以发生在 physical IRQ 或 virtual IRQ 层，因此两层都要检查。

- 设备不能伪造未分配给自己的 interrupt number。
- Hypervisor 不能向 CVM 注入未被 trusted side 认可的 virtual interrupt。
- GIC 配置流需要额外验证，防止 fake route。

**讲解稿:** 讲解时先把本页结论落到一句话: 攻击可以发生在 physical IRQ 或 virtual IRQ 层，因此两层都要检查。第一步解释为什么需要这一页: 设备不能伪造未分配给自己的 interrupt number。第二步说明论文或规范实际做了什么: Hypervisor 不能向 CVM 注入未被 trusted side 认可的 virtual interrupt。第三步收束到证据边界: GIC 配置流需要额外验证，防止 fake route。引用时只把 Devlore Figure 1 attacks; Figure 3 GIC configuration flow 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Devlore Figure 1 attacks; Figure 3 GIC configuration flow.

- Proof object: matrix - 双检查: Physical IRQ = origin / number assignment; Virtual IRQ = CVM-visible injection; GIC config = trusted validation; Attack = fake IRQ blocked; Compatibility = driver unchanged

#### 方法 3: 兼容性与最小改动

**Claim:** 设计目标是不改应用和设备驱动，只在 CCA/GIC/RMM 相关路径加检查。

- 论文报告约 7k LoC 改动。
- Table 2 展示多类 device-driver compatibility。
- FVP 上评估四类设备和多个 use case。

**讲解稿:** 讲解时先把本页结论落到一句话: 设计目标是不改应用和设备驱动，只在 CCA/GIC/RMM 相关路径加检查。第一步解释为什么需要这一页: 论文报告约 7k LoC 改动。第二步说明论文或规范实际做了什么: Table 2 展示多类 device-driver compatibility。第三步收束到证据边界: FVP 上评估四类设备和多个 use case。引用时只把 Devlore p.2 contributions; Table 2; implementation/evaluation sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Devlore p.2 contributions; Table 2; implementation/evaluation sections.

- Proof object: cards - 工程目标: no app changes; no device driver changes; ~7k LoC; four devices; Arm FVP; integrated GPU case


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** Devlore 的实验环境是 Arm FVP 和 Arm board performance prototype；CCA production CPU 不可用需明确标注。

- 证据源: 本地 PDF 21 页。
- 平台: CCA-enabled FVP，另有 Arm board performance prototype。
- 对象: 四类设备、interrupt stress、glmark2 GPU case、driver compatibility。

**讲解稿:** 讲解时先把本页结论落到一句话: Devlore 的实验环境是 Arm FVP 和 Arm board performance prototype；CCA production CPU 不可用需明确标注。第一步解释为什么需要这一页: 证据源: 本地 PDF 21 页。第二步说明论文或规范实际做了什么: 平台: CCA-enabled FVP，另有 Arm board performance prototype。第三步收束到证据边界: 对象: 四类设备、interrupt stress、glmark2 GPU case、driver compatibility。引用时只把 Devlore p.1-p.2; Figure 1-Figure 3; Table 1-3; evaluation section 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Devlore p.1-p.2; Figure 1-Figure 3; Table 1-3; evaluation section.

- Proof object: matrix - 实验边界: 平台 = Arm FVP + Arm board prototype; 设备 = four diverse devices; 改动 = ~7k LoC; 性能 = up to 1%, 0.06%; 边界 = pre-production CCA


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能页核心数字: sustained interrupt load 下 overhead up to 1%；glmark2 integrated GPU application overhead 0.06%。

- 这些数字说明 interrupt checking 可以很轻，但只覆盖 Devlore 的 interrupt path。
- 不能把它外推为完整 device confidential I/O overhead。
- 设备 memory path、attestation 和 driver TCB 仍需 ACAI/SoK/TDISP 类材料补充。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能页核心数字: sustained interrupt load 下 overhead up to 1%；glmark2 integrated GPU application overhead 0.06%。第一步解释为什么需要这一页: 这些数字说明 interrupt checking 可以很轻，但只覆盖 Devlore 的 interrupt path。第二步说明论文或规范实际做了什么: 不能把它外推为完整 device confidential I/O overhead。第三步收束到证据边界: 设备 memory path、attestation 和 driver TCB 仍需 ACAI/SoK/TDISP 类材料补充。引用时只把 Devlore p.1-p.2 reports up to 1% and 0.06%; evaluation section 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Devlore p.1-p.2 reports up to 1% and 0.06%; evaluation section.

- Proof object: bars - Devlore 关键数字: interrupt stress overhead up to 1%; glmark2 GPU overhead 0.06%; code changes ~7k LoC; driver changes none


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: Devlore 把 CCA I/O 讨论从 DMA 扩展到 interrupt，设计清晰但仍是早期原型。

- 优势: 抓住 interrupt lifecycle，保留 hypervisor 管理能力且最小改动。
- 局限: 不处理 DMA confidentiality、device attestation、TDISP/SPDM 和 malicious device firmware。
- 商业化潜力: 适合 mobile/edge/cloud integrated devices，但依赖 GIC/RMM/OS upstream 和硬件实现。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: Devlore 把 CCA I/O 讨论从 DMA 扩展到 interrupt，设计清晰但仍是早期原型。第一步解释为什么需要这一页: 优势: 抓住 interrupt lifecycle，保留 hypervisor 管理能力且最小改动。第二步说明论文或规范实际做了什么: 局限: 不处理 DMA confidentiality、device attestation、TDISP/SPDM 和 malicious device firmware。第三步收束到证据边界: 商业化潜力: 适合 mobile/edge/cloud integrated devices，但依赖 GIC/RMM/OS upstream 和硬件实现。引用时只把 Devlore conclusion and README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Devlore conclusion and README evaluation.

- Proof object: matrix - 评价: 优势 = interrupt lifecycle protection; 局限 = not full I/O security; 商业化 = integrated devices for CVM; 本方向角色 = control-path anchor


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
