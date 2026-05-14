# RISC-V CoVE-IO Specification

- BibTeX key: `riscv_cove_io_2026`
- Category: `risc-v-confidential-computing`
- Authors: RISC-V Non-ISA AP-TEE-IO contributors
- Year: 2026
- Source: https://github.com/riscv-non-isa/riscv-ap-tee-io
- Release: https://github.com/riscv-non-isa/riscv-ap-tee-io/releases/tag/v0.3.0
- PDF source: https://github.com/riscv-non-isa/riscv-ap-tee-io/releases/download/v0.3.0/riscv-cove-io.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Standardization status: Draft/not ratified: CoVE-IO v0.3.0
- Evidence role: Draft/not ratified: CoVE-IO v0.3.0. Public RISC-V CoVE-IO source for trusted I/O concepts; always mark with this status.

<!-- BEGIN PAPER REVIEW -->
## Paper Review
### 1. 论文基本信息

- 论文标题: Confidential VM Extension I/O (CoVE-IO) for Confidential Computing on RISC-V platforms
- 作者 / 机构: Samuel Ortiz; Jiewen Yao; RISC-V AP-TEE-IO Task Group
- 发表会议 / 年份: Draft/not ratified: CoVE-IO v0.3.0 / 2026
- 领域分类: 架构 / 系统 / 安全
- 一句话总结: 规范定义 RISC-V TVM 使用真实设备时的 device identity、TDISP/SPDM、PCIe IDE、trusted MMIO/DMA 和 ABI。
- 最核心贡献一句话: 它是 RISC-V confidential I/O / TEE-I/O 的当前 Draft/not ratified: CoVE-IO v0.3.0 规范证据。

### 2. 研究问题与背景

AP-TEE 保护 TVM 内存和执行，但真实设备会通过 MMIO、DMA、interrupt 和 PCIe/CXL.io link 接触 TVM 数据。CoVE-IO 要解决设备可信连接、接口绑定、DMA/MMIO 安全、trusted MSI 和设备/TVM 相互 attestation。Draft/not ratified: CoVE-IO v0.3.0。

### 3. 核心方法拆解

机制路径为 `platform ownership -> device initialization -> SPDM secure session -> TDISP interface binding -> IDE link -> TVM verifies device -> trusted MMIO/DMA/interrupt ABI`。核心对象包括 TDI、TDM、DSM/RDSM、TSM、SPDM、TDISP、DOE、IDE、IOMMU assignment、CoVE-IO manifest、COVH/COVG/COVT functions。

### 4. 安全性 / 正确性分析

规范列出 trusted MMIO malicious access/remapping/redirection/pre-configuration、PCIe link MITM、PCIe ID spoofing、confused-deputy DMA remapping 等威胁。强假设是设备支持 PCIe/CXL.io、TDISP、DOE、IDE，平台 TSM/RDSM 正确，IOMMU/IOPMP/AIA 组合无错。它不证明具体实现安全，也不解决所有 DoS/side-channel。

### 5. 实现细节

无单一实现。实现需要 device firmware 支持 TDISP/SPDM/IDE，host/TSM/RDSM 管理 device connection transcript、IDE key、interface binding 和 ABI。复现比 AP-TEE 更难，因为需要 device model 或 PCIe/CXL.io simulator。

### 6. 实验设计分析

规范草案无实验。验证应覆盖 device connect/disconnect、SPDM key update、IDE refresh、TDI report/state、MMIO mapping、interface region add/reclaim、malicious remapping 和 interrupt injection。不能作为性能或产品成熟度证据。

### 7. Novelty 分析

分类: strong systems/spec contribution。它把 confidential VM 的边界从 CPU/memory 扩展到 device and fabric path，是 RISC-V 追平 CCA/TDISP/IDE 生态的关键接口。

### 8. 局限性与可能漏洞

最大限制是 Draft/not ratified: CoVE-IO v0.3.0 和设备生态依赖强。TDISP/SPDM/IDE 支持度、证书链、热更新/reattestation、multi-function device、ATS/PRI cache、shared accelerators 和 CXL memory device 都可能成为复杂风险点。

### 9. 和已有工作的关系

CoVE-IO 与 sIOPMP、RISC-V IOMMU、AIA、IOPMP、PCIe IDE、TDISP/SPDM 强相关。它比 sIOPMP 更完整，后者主要解决 I/O access control；它也可与 Arm RME-DA/MEC/SMMU/device assignment 对照。

### 10. 复现与再实现计划

最小复现目标是构建一个 simulated PCIe device + TSM/RDSM harness，完成 SPDM transcript、TDISP binding、MMIO map 和 DMA policy test。需要 CoVE-IO ABI stub、IOMMU/IOPMP model、SPDM/TDISP library。验收标准是 TVM 只接受 attested interface，host 无法重映射 trusted MMIO/DMA，IDE key lifecycle 可观察。

### 11. 对后续研究的启发

1. CoVE-IO ABI fuzzing。2. TDISP/SPDM/IDE 与 IOMMU/IOPMP 的端到端形式化模型。3. Trusted MSI 与 AIA IMSIC 的安全属性验证。4. CXL memory/accelerator 在 CoVE-IO 下的 ownership transfer。5. Devlore/ACAI/sIOPMP 与 CoVE-IO 的 unified device TEE taxonomy。潜在 venue: IEEE S&P、USENIX Security、NDSS、ASPLOS、HOST。

### 12. Evidence README Addendum
- Evidence role: Draft/not ratified: CoVE-IO v0.3.0. Public RISC-V CoVE-IO source for trusted I/O concepts; always mark with this status.
- 标准化 / 发表状态: Draft/not ratified: CoVE-IO v0.3.0
- 对应小方向: RISC-V CoVE-IO / TEE-I/O

#### 内容摘要

CoVE-IO 定义 TVM 与真实设备建立 confidential I/O 关系所需的协议、ABI 和威胁模型。

#### 研究背景

CPU/内存隔离无法保护设备 DMA、MMIO、中断和 PCIe/CXL.io link 上的数据路径。

#### 解决方案

组合 TDISP、SPDM、PCIe IDE、IOMMU/IOPMP/AIA 和 CoVE ABI，实现设备连接、接口绑定、attestation 和 trusted MMIO/DMA。

#### 实验结果

规范草案，无新实验。

#### 文章评价

它是 RISC-V trusted I/O 最重要资料，但成熟度低于 ratified specs，正文必须标注 Draft/not ratified: CoVE-IO v0.3.0。
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `10-riscv-cove-io-tee-io` - RISC-V CoVE-IO / TEE-I/O
- Paper key: `riscv_cove_io_2026`
- Role: standards-track trusted device lifecycle draft
- Evidence base: CoVE-IO PDF Figure 1 bounce buffering; Figure 2 topology; Figure 3 high-level architecture; Tables 1-3 requirements.
- Boundary: draft/not ratified；不提供系统实验，也不替代 SPDM/TDISP/PCIe IDE 原始规范。

### 1. 完整题目 / 作者 / 会议

- 完整题目: RISC-V CoVE-IO Specification
- 作者: RISC-V Non-ISA AP-TEE-IO contributors
- 会议/来源: RISC-V AP-TEE-IO / CoVE-IO draft specification, 2026
- Title evidence: README metadata; CoVE-IO draft PDF title page.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** CoVE-IO 的作用是把“TVM 能不能直接用设备”写成一组 lifecycle 和协议要求。

- 动机: bounce buffer 能工作但慢；直接设备 assignment 需要证明设备身份、保护链路和约束 DMA/interrupt。
- 工作: 整理 AP-TEE-IO requirements、topology、high-level architecture 和 TEE-IO/TDISP/SPDM/IDE 关系。
- 数据: 规范草案无实验，证据来自 Figure 1-3 和 requirement tables。

**讲解稿:** 讲解时先把本页结论落到一句话: CoVE-IO 的作用是把“TVM 能不能直接用设备”写成一组 lifecycle 和协议要求。第一步解释为什么需要这一页: 动机: bounce buffer 能工作但慢；直接设备 assignment 需要证明设备身份、保护链路和约束 DMA/interrupt。第二步说明论文或规范实际做了什么: 工作: 整理 AP-TEE-IO requirements、topology、high-level architecture 和 TEE-IO/TDISP/SPDM/IDE 关系。第三步收束到证据边界: 数据: 规范草案无实验，证据来自 Figure 1-3 和 requirement tables。引用时只把 CoVE-IO Figure 1-Figure 3; Tables 1-3 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE-IO Figure 1-Figure 3; Tables 1-3.

- Proof object: flow - CoVE-IO path: TVM wants device -> baseline bounce buffer -> device identity -> secure link -> IOMMU/IOPMP policy -> trusted assignment


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是 confidential VM 的 I/O 默认会退回 shared memory/bounce buffer，安全但性能和语义都不理想。

- Bounce buffer 让 host 可见共享页，TVM 必须复制/加密/验证。
- 直通设备需要设备固件身份、PCIe link protection、DMA isolation 和 interrupt routing。
- 任何一个环节缺失，设备都可能成为 host 观察或篡改 TVM 的通道。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是 confidential VM 的 I/O 默认会退回 shared memory/bounce buffer，安全但性能和语义都不理想。第一步解释为什么需要这一页: Bounce buffer 让 host 可见共享页，TVM 必须复制/加密/验证。第二步说明论文或规范实际做了什么: 直通设备需要设备固件身份、PCIe link protection、DMA isolation 和 interrupt routing。第三步收束到证据边界: 任何一个环节缺失，设备都可能成为 host 观察或篡改 TVM 的通道。引用时只把 CoVE-IO Figure 1; requirement sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE-IO Figure 1; requirement sections.

- Proof object: matrix - trusted I/O 要素: Identity = SPDM certificate/measurement; Assignment = TDISP lifecycle; Link = PCIe IDE; DMA = IOMMU/IOPMP; Interrupt = AIA/secure interrupt policy


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: CoVE-IO 不是一个单独模块，而是把多个标准和 RISC-V TSM lifecycle 绑定起来。

- SPDM 解决设备身份和 measurement。
- TDISP 解决 device interface assignment state。
- IDE 解决 PCIe link confidentiality/integrity。
- TSM 负责把这些证据与 TVM memory/interrupt/DMA policy 绑定。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: CoVE-IO 不是一个单独模块，而是把多个标准和 RISC-V TSM lifecycle 绑定起来。第一步解释为什么需要这一页: SPDM 解决设备身份和 measurement。第二步说明论文或规范实际做了什么: TDISP 解决 device interface assignment state。第三步收束到证据边界: IDE 解决 PCIe link confidentiality/integrity。引用时只把 CoVE-IO high-level architecture; related requirements 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE-IO high-level architecture; related requirements.

- Proof object: cards - protocol bundle: SPDM; TDISP; PCIe IDE; IOMMU/IOPMP; TSM policy


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: CoVE-IO 在 TVM、host VMM、TSM、IOMMU、root port 和 device 之间建立 trust choreography。

- Figure 2 解释 PCIe topology，Figure 3 解释 high-level architecture。
- Host 仍管理资源，但 trusted assignment state 不能只由 host 决定。
- Device interface 从 unassigned 到 assigned to TVM 需要可证明转换。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: CoVE-IO 在 TVM、host VMM、TSM、IOMMU、root port 和 device 之间建立 trust choreography。第一步解释为什么需要这一页: Figure 2 解释 PCIe topology，Figure 3 解释 high-level architecture。第二步说明论文或规范实际做了什么: Host 仍管理资源，但 trusted assignment state 不能只由 host 决定。第三步收束到证据边界: Device interface 从 unassigned 到 assigned to TVM 需要可证明转换。引用时只把 CoVE-IO Figure 2-Figure 3 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE-IO Figure 2-Figure 3.

- Proof object: matrix - 架构对象: TVM = device user; Host/VMM = resource orchestrator; TSM = trusted policy owner; IOMMU = DMA translation; Device = SPDM/TDISP endpoint


### 6. 核心方法拆解

#### 方法 1: Bounce Buffer Baseline

**Claim:** CoVE-IO 先说明 baseline: 用 shared pages 做 I/O，安全边界清楚但成本高。

- TVM 私有内存不直接给设备 DMA。
- I/O data 通过 shared/non-confidential buffer 中转。
- 这降低 device trust requirement，但增加 copy 和 encryption burden。

**讲解稿:** 讲解时先把本页结论落到一句话: CoVE-IO 先说明 baseline: 用 shared pages 做 I/O，安全边界清楚但成本高。第一步解释为什么需要这一页: TVM 私有内存不直接给设备 DMA。第二步说明论文或规范实际做了什么: I/O data 通过 shared/non-confidential buffer 中转。第三步收束到证据边界: 这降低 device trust requirement，但增加 copy 和 encryption burden。引用时只把 CoVE-IO Figure 1 bounce buffering 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE-IO Figure 1 bounce buffering.

- Proof object: flow - bounce path: TVM private data -> copy/encrypt -> shared buffer -> host/device I/O -> copy/verify back -> TVM private data

#### 方法 2: Trusted Device Assignment

**Claim:** 直接 assignment 要把 device interface state 绑定到某个 TVM。

- 设备必须通过 SPDM/TDISP 证明身份和状态。
- TSM/IOMMU/IOPMP 必须配置只允许访问 TVM 授权内存。
- Unassign/reset/cleanup 同样是安全生命周期的一部分。

**讲解稿:** 讲解时先把本页结论落到一句话: 直接 assignment 要把 device interface state 绑定到某个 TVM。第一步解释为什么需要这一页: 设备必须通过 SPDM/TDISP 证明身份和状态。第二步说明论文或规范实际做了什么: TSM/IOMMU/IOPMP 必须配置只允许访问 TVM 授权内存。第三步收束到证据边界: Unassign/reset/cleanup 同样是安全生命周期的一部分。引用时只把 CoVE-IO requirements and TEE-IO architecture 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE-IO requirements and TEE-IO architecture.

- Proof object: flow - assignment lifecycle: discover device -> authenticate -> lock interface -> assign to TVM -> run I/O -> unassign and clean

#### 方法 3: DMA / Interrupt / MMIO Policy

**Claim:** Trusted I/O 不只看 DMA，还包括 MMIO register 和 interrupt delivery。

- DMA translation 需要 IOMMU/IOPMP。
- MMIO 配置空间不能让 host 注入危险 state。
- Interrupt/MSI routing 必须防 fake/wrong target。

**讲解稿:** 讲解时先把本页结论落到一句话: Trusted I/O 不只看 DMA，还包括 MMIO register 和 interrupt delivery。第一步解释为什么需要这一页: DMA translation 需要 IOMMU/IOPMP。第二步说明论文或规范实际做了什么: MMIO 配置空间不能让 host 注入危险 state。第三步收束到证据边界: Interrupt/MSI routing 必须防 fake/wrong target。引用时只把 CoVE-IO architecture; relation to IOMMU/AIA 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE-IO architecture; relation to IOMMU/AIA.

- Proof object: matrix - data/control paths: DMA = IOMMU/IOPMP; MMIO = register access policy; Interrupt = AIA/IMSIC routing; Queue = descriptor ownership; Reset = state cleanup

#### 方法 4: Evidence Binding

**Claim:** 最终 verifier 需要知道 TVM 用的 device 是否也在可信状态。

- Platform attestation 只证明 CPU/TSM 不够。
- Device evidence 需要和 TVM token 或 policy 关联。
- 这也是 CoVE-IO draft 与 SPDM/TDISP 的连接点。

**讲解稿:** 讲解时先把本页结论落到一句话: 最终 verifier 需要知道 TVM 用的 device 是否也在可信状态。第一步解释为什么需要这一页: Platform attestation 只证明 CPU/TSM 不够。第二步说明论文或规范实际做了什么: Device evidence 需要和 TVM token 或 policy 关联。第三步收束到证据边界: 这也是 CoVE-IO draft 与 SPDM/TDISP 的连接点。引用时只把 CoVE-IO attestation and device lifecycle requirements 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE-IO attestation and device lifecycle requirements.

- Proof object: flow - evidence: platform token -> TSM policy -> SPDM device cert -> TDISP state -> TVM-device binding -> verifier decision


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** CoVE-IO 是 draft specification，无新实验；本页记录 evidence boundary。

- 证据源: 本地 PDF，Figure 1-3 和 requirement tables。
- 可支撑: trusted I/O requirement taxonomy, lifecycle, architecture。
- 不能支撑: 性能 overhead、final ratified standard、某个 device 的实际安全。

**讲解稿:** 讲解时先把本页结论落到一句话: CoVE-IO 是 draft specification，无新实验；本页记录 evidence boundary。第一步解释为什么需要这一页: 证据源: 本地 PDF，Figure 1-3 和 requirement tables。第二步说明论文或规范实际做了什么: 可支撑: trusted I/O requirement taxonomy, lifecycle, architecture。第三步收束到证据边界: 不能支撑: 性能 overhead、final ratified standard、某个 device 的实际安全。引用时只把 CoVE-IO Figure 1-Figure 3; Tables 1-3 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE-IO Figure 1-Figure 3; Tables 1-3.

- Proof object: matrix - 证据边界: 类型 = draft spec; 实验 = 无; 可支撑 = TEE-I/O lifecycle; 不能支撑 = performance / final ABI


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能页写成无新实验: CoVE-IO 只定义路径，不测路径。

- 性能风险来自 bounce buffer copy、SPDM/TDISP setup、IOMMU translation、IDE encryption 和 interrupt virtualization。
- 直接 assignment 可减少 copy，但增加 trusted lifecycle complexity。
- 具体数字应引用未来实现或 device/vendor report。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能页写成无新实验: CoVE-IO 只定义路径，不测路径。第一步解释为什么需要这一页: 性能风险来自 bounce buffer copy、SPDM/TDISP setup、IOMMU translation、IDE encryption 和 interrupt virtualization。第二步说明论文或规范实际做了什么: 直接 assignment 可减少 copy，但增加 trusted lifecycle complexity。第三步收束到证据边界: 具体数字应引用未来实现或 device/vendor report。引用时只把 CoVE-IO draft scope 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE-IO draft scope.

- Proof object: bars - path tradeoff: bounce safety 高; bounce performance 低; direct I/O performance 潜力高; direct I/O complexity 高


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: CoVE-IO 是 RISC-V confidential I/O 的关键蓝图，但还处于标准收敛阶段。

- 优势: 把 SPDM/TDISP/IDE/IOMMU/TSM 放到同一 lifecycle。
- 局限: draft/not ratified，无实现性能；依赖 PCIe/device ecosystem。
- 商业化潜力: 云 CVM 设备直通、accelerator、storage、SmartNIC 都需要它。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: CoVE-IO 是 RISC-V confidential I/O 的关键蓝图，但还处于标准收敛阶段。第一步解释为什么需要这一页: 优势: 把 SPDM/TDISP/IDE/IOMMU/TSM 放到同一 lifecycle。第二步说明论文或规范实际做了什么: 局限: draft/not ratified，无实现性能；依赖 PCIe/device ecosystem。第三步收束到证据边界: 商业化潜力: 云 CVM 设备直通、accelerator、storage、SmartNIC 都需要它。引用时只把 CoVE-IO draft status and README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE-IO draft status and README evaluation.

- Proof object: matrix - 评价: 优势 = full lifecycle blueprint; 局限 = draft/no experiment; 商业化 = CVM device assignment; 本方向角色 = standards-track SOTA


---

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `13-confidential-io-protocol-device-endpoint` - Confidential I/O Protocol / Device Endpoint
- Paper key: `riscv_cove_io_2026`
- Role: trusted device assignment lifecycle draft
- Evidence base: CoVE-IO Figure 1 bounce buffering; Figure 2 topology; Figure 3 architecture; requirements tables.
- Boundary: draft/not ratified；无实验；具体协议细节仍要回到 SPDM/TDISP/PCIe IDE 原始规范。

### 1. 完整题目 / 作者 / 会议

- 完整题目: RISC-V CoVE-IO Specification
- 作者: RISC-V Non-ISA AP-TEE-IO contributors
- 会议/来源: RISC-V AP-TEE-IO / CoVE-IO draft specification, 2026
- Title evidence: README metadata; CoVE-IO draft PDF.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** CoVE-IO 的贡献是说明 SPDM 证据如何进入 TVM-device assignment，而不是停在设备自证。

- 动机: 设备即使能自证，也必须被安全地分配、撤销、清理和限制 DMA/interrupt。
- 工作: 规范 TVM trusted I/O 的 topology、requirements、bounce buffer baseline 和 high-level architecture。
- 数据: draft spec 无实验。

**讲解稿:** 讲解时先把本页结论落到一句话: CoVE-IO 的贡献是说明 SPDM 证据如何进入 TVM-device assignment，而不是停在设备自证。第一步解释为什么需要这一页: 动机: 设备即使能自证，也必须被安全地分配、撤销、清理和限制 DMA/interrupt。第二步说明论文或规范实际做了什么: 工作: 规范 TVM trusted I/O 的 topology、requirements、bounce buffer baseline 和 high-level architecture。第三步收束到证据边界: 数据: draft spec 无实验。引用时只把 CoVE-IO Figure 1-Figure 3; Tables 1-3 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE-IO Figure 1-Figure 3; Tables 1-3.

- Proof object: flow - assignment evidence: SPDM evidence -> TDISP state -> TSM policy -> IOMMU mapping -> IDE link -> TVM uses device


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是 endpoint identity 只是第一步，TVM 还要知道设备 interface 是否真的归自己。

- Host 可以枚举设备，但不能单独决定可信 assignment。
- 设备重置、热插拔、error recovery 都可能破坏 trust state。
- CoVE-IO 把 lifecycle 明确化。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是 endpoint identity 只是第一步，TVM 还要知道设备 interface 是否真的归自己。第一步解释为什么需要这一页: Host 可以枚举设备，但不能单独决定可信 assignment。第二步说明论文或规范实际做了什么: 设备重置、热插拔、error recovery 都可能破坏 trust state。第三步收束到证据边界: CoVE-IO 把 lifecycle 明确化。引用时只把 CoVE-IO requirement sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE-IO requirement sections.

- Proof object: matrix - lifecycle questions: Discover = which device; Authenticate = SPDM evidence; Assign = TDISP state; Protect = IOMMU/IDE; Cleanup = unassign/reset


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: trusted device assignment 是 evidence、address policy、link protection 和 cleanup 的交集。

- SPDM 证明身份和 state。
- TDISP 证明 interface assignment state。
- IOMMU/IOPMP 限制 DMA。
- IDE 保护 PCIe link，TSM 绑定到 TVM。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: trusted device assignment 是 evidence、address policy、link protection 和 cleanup 的交集。第一步解释为什么需要这一页: SPDM 证明身份和 state。第二步说明论文或规范实际做了什么: TDISP 证明 interface assignment state。第三步收束到证据边界: IOMMU/IOPMP 限制 DMA。引用时只把 CoVE-IO high-level architecture 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE-IO high-level architecture.

- Proof object: cards - intersection: evidence; assignment state; DMA policy; link protection; cleanup


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: CoVE-IO 将 TVM、TSM、host、IOMMU、root port 和 device 组织成一个 trusted I/O workflow。

- Figure 1 显示 bounce buffer baseline。
- Figure 2/3 展示 topology 和 high-level architecture。
- TVM direct I/O 只有在 evidence 和 lifecycle 都满足时才成立。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: CoVE-IO 将 TVM、TSM、host、IOMMU、root port 和 device 组织成一个 trusted I/O workflow。第一步解释为什么需要这一页: Figure 1 显示 bounce buffer baseline。第二步说明论文或规范实际做了什么: Figure 2/3 展示 topology 和 high-level architecture。第三步收束到证据边界: TVM direct I/O 只有在 evidence 和 lifecycle 都满足时才成立。引用时只把 CoVE-IO Figure 1-Figure 3 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE-IO Figure 1-Figure 3.

- Proof object: matrix - workflow objects: TVM = consumer; TSM = policy/evidence binder; Host = resource manager; Device = SPDM/TDISP responder; Fabric = IOMMU/IDE/root port


### 6. 核心方法拆解

#### 方法 1: Evidence-to-Assignment Binding

**Claim:** CoVE-IO 把 SPDM evidence 绑定到具体 device interface，而不是只验证设备型号。

- 证书和 measurement 进入 policy。
- TDISP state 证明 interface 被安全锁定。
- TSM 记录 TVM-device relationship。

**讲解稿:** 讲解时先把本页结论落到一句话: CoVE-IO 把 SPDM evidence 绑定到具体 device interface，而不是只验证设备型号。第一步解释为什么需要这一页: 证书和 measurement 进入 policy。第二步说明论文或规范实际做了什么: TDISP state 证明 interface 被安全锁定。第三步收束到证据边界: TSM 记录 TVM-device relationship。引用时只把 CoVE-IO architecture and requirements 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE-IO architecture and requirements.

- Proof object: flow - binding: SPDM cert -> measurement -> TDISP lock -> TSM verifies -> assign interface -> TVM token/policy

#### 方法 2: Bounce vs Direct I/O

**Claim:** CoVE-IO 用 bounce buffer 做安全 baseline，用 direct assignment 做性能目标。

- Bounce buffer 简单但 copy 重。
- Direct I/O 性能更好但要求完整 lifecycle。
- PPT 不能把 direct I/O 写成默认已经安全。

**讲解稿:** 讲解时先把本页结论落到一句话: CoVE-IO 用 bounce buffer 做安全 baseline，用 direct assignment 做性能目标。第一步解释为什么需要这一页: Bounce buffer 简单但 copy 重。第二步说明论文或规范实际做了什么: Direct I/O 性能更好但要求完整 lifecycle。第三步收束到证据边界: PPT 不能把 direct I/O 写成默认已经安全。引用时只把 CoVE-IO Figure 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE-IO Figure 1.

- Proof object: matrix - I/O modes: Bounce = safe baseline; Direct = performance target; Risk = device trust; Need = SPDM/TDISP/IDE; Policy = TSM-controlled

#### 方法 3: DMA / Interrupt Control

**Claim:** 设备可信还不够，访问路径必须由 IOMMU/IOPMP/AIA 类机制限制。

- DMA 只允许 TVM 授权页。
- MMIO/queue 需要 ownership。
- Interrupt/MSI routing 不能被 host 任意伪造。

**讲解稿:** 讲解时先把本页结论落到一句话: 设备可信还不够，访问路径必须由 IOMMU/IOPMP/AIA 类机制限制。第一步解释为什么需要这一页: DMA 只允许 TVM 授权页。第二步说明论文或规范实际做了什么: MMIO/queue 需要 ownership。第三步收束到证据边界: Interrupt/MSI routing 不能被 host 任意伪造。引用时只把 CoVE-IO relation to IOMMU/AIA/IOPMP 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE-IO relation to IOMMU/AIA/IOPMP.

- Proof object: cards - control points: DMA mappings; MMIO registers; queue descriptors; MSI/interrupt; fault cleanup


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** CoVE-IO 是 draft specification，无新实验；本页只承载 lifecycle blueprint。

- 证据源: 本地 CoVE-IO draft PDF。
- 可支撑: requirements, topology, architecture, bounce/direct model。
- 不能支撑: final standard status or overhead。

**讲解稿:** 讲解时先把本页结论落到一句话: CoVE-IO 是 draft specification，无新实验；本页只承载 lifecycle blueprint。第一步解释为什么需要这一页: 证据源: 本地 CoVE-IO draft PDF。第二步说明论文或规范实际做了什么: 可支撑: requirements, topology, architecture, bounce/direct model。第三步收束到证据边界: 不能支撑: final standard status or overhead。引用时只把 CoVE-IO PDF 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE-IO PDF.

- Proof object: matrix - 证据边界: 类型 = draft spec; 实验 = 无; 可支撑 = lifecycle architecture; 不能支撑 = final ABI/performance


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能页写成无新实验: draft 只解释模式，不测模式。

- Bounce buffer 性能风险是 copy/encrypt。
- Direct assignment 性能潜力高但 setup/control path 更复杂。
- 具体 overhead 需要未来实现。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能页写成无新实验: draft 只解释模式，不测模式。第一步解释为什么需要这一页: Bounce buffer 性能风险是 copy/encrypt。第二步说明论文或规范实际做了什么: Direct assignment 性能潜力高但 setup/control path 更复杂。第三步收束到证据边界: 具体 overhead 需要未来实现。引用时只把 CoVE-IO scope 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE-IO scope.

- Proof object: bars - tradeoff: bounce safety 高; bounce speed 低; direct speed 高潜力; evidence maturity draft


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: CoVE-IO 是 RISC-V endpoint trust 的集成蓝图，但它依赖多个外部标准成熟。

- 优势: 把协议和 TSM lifecycle 连接起来。
- 局限: draft/no experiment；SPDM/TDISP/IDE/IOMMU 互操作复杂。
- 商业化潜力: TVM device passthrough 和 accelerator/storage/NIC 直通。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: CoVE-IO 是 RISC-V endpoint trust 的集成蓝图，但它依赖多个外部标准成熟。第一步解释为什么需要这一页: 优势: 把协议和 TSM lifecycle 连接起来。第二步说明论文或规范实际做了什么: 局限: draft/no experiment；SPDM/TDISP/IDE/IOMMU 互操作复杂。第三步收束到证据边界: 商业化潜力: TVM device passthrough 和 accelerator/storage/NIC 直通。引用时只把 CoVE-IO README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CoVE-IO README evaluation.

- Proof object: matrix - 评价: 优势 = integration blueprint; 局限 = draft complexity; 商业化 = trusted passthrough; 本方向角色 = lifecycle SOTA


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
