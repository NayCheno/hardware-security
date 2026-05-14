# RISC-V IOMMU Architecture Specification

- BibTeX key: `riscv_iommu_2023`
- Category: `risc-v-confidential-computing`
- Authors: RISC-V Non-ISA IOMMU contributors
- Year: 2026
- Source: https://docs.riscv.org/reference/home/index.html
- Release: RISC-V Ratified Specifications Library release v1.0.1 / 20260222
- PDF source: https://docs.riscv.org/reference/iommu/_attachments/riscv-iommu.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Standardization status: v1.0.1 / 20260222 ratified-library release; base architecture and listed standard extensions are ratified
- Evidence role: Spec/standard SOTA. Use for the public standard, architecture, or specification semantics it defines; do not infer implementation security, performance, or platform completeness beyond the document.

<!-- BEGIN PAPER REVIEW -->
## Paper Review
### 1. 论文基本信息

- 论文标题: RISC-V IOMMU Architecture Specification
- 作者 / 机构: RISC-V IOMMU Task Group
- 发表会议 / 年份: RISC-V Ratified Specifications Library v1.0.1 / 20260222
- 领域分类: 架构 / 硬件 / 系统
- 一句话总结: 规范定义 RISC-V I/O memory management unit 的 device context、process context、address translation、ATS/PRI 和 fault/queue 接口。
- 最核心贡献一句话: 它是 RISC-V 设备 DMA 地址转换和隔离的 ratified 基础规范。

### 2. 研究问题与背景

设备 DMA 可绕过 CPU page table/PMP，虚拟化和 confidential I/O 需要设备侧地址转换、权限检查、MSI translation 和 fault reporting。该规范解决 IOMMU 架构接口问题；它不是 TEE 本体，也不提供 device identity 或 link encryption。

### 3. 核心方法拆解

机制路径为 `device request -> device directory table -> process directory/first-stage/second-stage translation -> MSI/fault/page-request queues -> memory access`。核心对象包括 DDT、PDT、device context、process context、IOHGATP、MSI page table、ATS/PRI handling、command/fault/page-request queues 和 MMIO registers。

### 4. 安全性 / 正确性分析

安全边界是设备地址转换和权限检查。强假设包括 IOMMU 硬件正确、host/TSM 正确配置、device ID 不被 spoof、cache invalidation 顺序正确。它不能独立解决 malicious device、PCIe link MITM、TDISP state 或 memory encryption。

### 5. 实现细节

规范无实现。实现依赖 PCIe/root complex/SoC interconnect 与 OS/hypervisor driver。复现需要 IOMMU model、DMA devices、fault queue tests、ATS/PRI tests。

### 6. 实验设计分析

规范无实验。验证重点应是 address translation correctness、fault delivery、ATS invalidation、MSI remapping、two-stage translation 和 malicious DMA tests。

### 7. Novelty 分析

分类: solid systems contribution。作为 ratified spec，它的价值在标准化 RISC-V IOMMU，而不是提出新防御。

### 8. 局限性与可能漏洞

IOMMU 配置错误、stale translations、ATS/PRI cache、device ID spoofing 和 confused deputy 都是潜在风险。它缺少 CoVE-IO 所需的 device attestation 和 trusted interface lifecycle。

### 9. 和已有工作的关系

IOMMU 是 CoVE-IO 的 supporting spec，需与 AIA、IOPMP、SPDM/TDISP/IDE 组合。与 sIOPMP/IOPMP 不同，IOMMU 主要做地址转换和设备上下文管理。

### 10. 复现与再实现计划

最小复现目标是实现 software IOMMU model，模拟 device DMA 到 guest/host/TVM memory。验收标准是非法 IOVA 被 fault，MSI remapping 正确，cache invalidation 后 stale translation 失效。

### 11. 对后续研究的启发

1. IOMMU + IOPMP 组合策略编译。2. CoVE-IO 下 ATS/PRI 安全性。3. Trusted MSI remapping 验证。4. IOMMU driver fuzzing。5. Device identity 与 IOMMU context binding。潜在 venue: ASPLOS、USENIX Security、NDSS、HOST、OSDI。

### 12. Evidence README Addendum
- Evidence role: Spec/standard SOTA. Use for the public standard, architecture, or specification semantics it defines; do not infer implementation security, performance, or platform completeness beyond the document.
- 标准化 / 发表状态: ratified-library release v1.0.1 / 20260222；base architecture v1.0 和列出的 standard extensions 均为 ratified
- 对应小方向: RISC-V 基础安全 primitives; RISC-V CoVE-IO / TEE-I/O

#### 内容摘要

RISC-V IOMMU 定义设备 DMA 地址转换、隔离和 queue/register 接口。

#### 研究背景

虚拟化和 confidential I/O 需要将设备访问约束到正确 guest/TVM 地址空间。

#### 解决方案

通过 device/process context、first/second-stage translation、ATS/PRI 和 MSI/fault queues 实现设备侧地址管理。

#### 实验结果

规范，无新实验。

#### 文章评价

它是必要底座，但不是完整安全方案。CoVE-IO 还需要 device identity、IDE、TDISP、SPDM、trusted interrupt 和 lifecycle。
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `07-riscv-primitives` - RISC-V 基础安全 Primitives
- Paper key: `riscv_iommu_2023`
- Role: DMA isolation specification
- Evidence base: IOMMU local PDF; Figure 1 device isolation; Figure 2 DMA translation/direct assignment; Table 1 terms.
- Boundary: 规范无实验；TEE-I/O/CoVE-IO 安全还需要 TDISP/SPDM/IDE 和 TVM lifecycle。

### 1. 完整题目 / 作者 / 会议

- 完整题目: RISC-V IOMMU Architecture Specification
- 作者: RISC-V Non-ISA IOMMU contributors
- 会议/来源: RISC-V IOMMU specification, 2026 snapshot
- Title evidence: README metadata; RISC-V IOMMU spec PDF.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** RISC-V IOMMU 的作用是让设备 DMA 也服从地址转换和隔离策略。

- 动机: 如果设备可直接 DMA 到任意内存，CPU-side TEE 隔离会被绕过。
- 工作: 定义 device context、translation structures、fault/reporting 和 VM direct assignment。
- 数据: spec 文档无实验；Figure 1/2 是讲解核心。

**讲解稿:** 讲解时先把本页结论落到一句话: RISC-V IOMMU 的作用是让设备 DMA 也服从地址转换和隔离策略。第一步解释为什么需要这一页: 动机: 如果设备可直接 DMA 到任意内存，CPU-side TEE 隔离会被绕过。第二步说明论文或规范实际做了什么: 工作: 定义 device context、translation structures、fault/reporting 和 VM direct assignment。第三步收束到证据边界: 数据: spec 文档无实验；Figure 1/2 是讲解核心。引用时只把 IOMMU spec Figure 1; Figure 2; Table 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** IOMMU spec Figure 1; Figure 2; Table 1.

- Proof object: flow - DMA translation: device request -> device ID/context -> I/O page table -> permission check -> translated address -> fault/report if invalid


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是设备不走 CPU load/store，但仍能读写内存。

- DMA bypass CPU page table。
- 虚拟化场景需要把 device safely assigned to VM。
- Confidential VM 场景还需要把 DMA 与 TVM ownership/measurement 绑定。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是设备不走 CPU load/store，但仍能读写内存。第一步解释为什么需要这一页: DMA bypass CPU page table。第二步说明论文或规范实际做了什么: 虚拟化场景需要把 device safely assigned to VM。第三步收束到证据边界: Confidential VM 场景还需要把 DMA 与 TVM ownership/measurement 绑定。引用时只把 IOMMU spec introduction; Figure 1/2 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** IOMMU spec introduction; Figure 1/2.

- Proof object: matrix - DMA 风险: No IOMMU = device can overwrite memory; IOMMU = translation and permissions; VM assignment = guest device isolation; TEE gap = identity/lifecycle still needed


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: IOMMU 是 I/O 隔离必要条件，但不是 trusted I/O 的充分条件。

- 它管地址和权限，不自动证明设备身份。
- 它管 DMA，不自动保护 PCIe link confidentiality/freshness。
- 它是 CoVE-IO 的底层积木之一。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: IOMMU 是 I/O 隔离必要条件，但不是 trusted I/O 的充分条件。第一步解释为什么需要这一页: 它管地址和权限，不自动证明设备身份。第二步说明论文或规范实际做了什么: 它管 DMA，不自动保护 PCIe link confidentiality/freshness。第三步收束到证据边界: 它是 CoVE-IO 的底层积木之一。引用时只把 IOMMU spec; CoVE-IO relation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** IOMMU spec; CoVE-IO relation.

- Proof object: cards - 必要但不充分: DMA translation; device context; fault reporting; no identity proof; no link crypto


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: device context 指向 translation structures，IOMMU 对 DMA 请求做地址转换。

- Figure 1 展示 non-virtualized device isolation。
- Figure 2 展示 direct device assignment to VM。
- 上下文、队列、fault 和 cache 是实现细节核心。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: device context 指向 translation structures，IOMMU 对 DMA 请求做地址转换。第一步解释为什么需要这一页: Figure 1 展示 non-virtualized device isolation。第二步说明论文或规范实际做了什么: Figure 2 展示 direct device assignment to VM。第三步收束到证据边界: 上下文、队列、fault 和 cache 是实现细节核心。引用时只把 IOMMU spec Figure 1/2 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** IOMMU spec Figure 1/2.

- Proof object: matrix - IOMMU 组件: Device ID = select context; Context = translation root; I/O page table = permissions; Fault queue = report violations; VM assignment = guest DMA isolation


### 6. 核心方法拆解

#### 方法 1: Device Context / Translation

**Claim:** 每个设备请求先被映射到 context，再走 I/O page table。

- Context 绑定 device identity within platform。
- Translation root 定义 DMA address space。
- Invalid access 生成 fault。

**讲解稿:** 讲解时先把本页结论落到一句话: 每个设备请求先被映射到 context，再走 I/O page table。第一步解释为什么需要这一页: Context 绑定 device identity within platform。第二步说明论文或规范实际做了什么: Translation root 定义 DMA address space。第三步收束到证据边界: Invalid access 生成 fault。引用时只把 IOMMU spec context/translation chapters 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** IOMMU spec context/translation chapters.

- Proof object: flow - translation path: request -> device ID -> context -> page-table walk -> permission -> host physical address

#### 方法 2: Direct Device Assignment

**Claim:** 虚拟化需要把设备交给 VM，同时不允许它访问其他 VM。

- IOMMU 为 assigned device 配置 guest-specific translation。
- Fault/reporting 让 host 管理错误但不能越权。
- CoVE-IO 会在此基础上加入 TVM trust boundary。

**讲解稿:** 讲解时先把本页结论落到一句话: 虚拟化需要把设备交给 VM，同时不允许它访问其他 VM。第一步解释为什么需要这一页: IOMMU 为 assigned device 配置 guest-specific translation。第二步说明论文或规范实际做了什么: Fault/reporting 让 host 管理错误但不能越权。第三步收束到证据边界: CoVE-IO 会在此基础上加入 TVM trust boundary。引用时只把 IOMMU spec Figure 2 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** IOMMU spec Figure 2.

- Proof object: matrix - assignment: Device D1 = VM1 address space; Device D2 = VM2 address space; Host = configuration manager; Risk = malicious config; Need = trusted lifecycle

#### 方法 3: Fault / Queue / Cache

**Claim:** IOMMU 不是静态表，还包含 invalidation、fault 和性能相关结构。

- Translation cache 需要 invalidation。
- Fault queue 影响可观测性和恢复。
- Doorbell/command queues 形成 TCB/DoS 边界。

**讲解稿:** 讲解时先把本页结论落到一句话: IOMMU 不是静态表，还包含 invalidation、fault 和性能相关结构。第一步解释为什么需要这一页: Translation cache 需要 invalidation。第二步说明论文或规范实际做了什么: Fault queue 影响可观测性和恢复。第三步收束到证据边界: Doorbell/command queues 形成 TCB/DoS 边界。引用时只把 IOMMU spec queue/fault/invalidation sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** IOMMU spec queue/fault/invalidation sections.

- Proof object: cards - runtime objects: command queue; fault queue; translation cache; invalidation; device context


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** 这是 RISC-V IOMMU 规范，无新实验；它支撑 DMA 隔离语义。

- 证据源: local PDF 约 109 页。
- 核心图: Figure 1/2，Table 1 terms。
- 边界: 不证明 CoVE-IO 或 TEE-I/O 完整安全。

**讲解稿:** 讲解时先把本页结论落到一句话: 这是 RISC-V IOMMU 规范，无新实验；它支撑 DMA 隔离语义。第一步解释为什么需要这一页: 证据源: local PDF 约 109 页。第二步说明论文或规范实际做了什么: 核心图: Figure 1/2，Table 1 terms。第三步收束到证据边界: 边界: 不证明 CoVE-IO 或 TEE-I/O 完整安全。引用时只把 IOMMU spec Figure 1/2; Table 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** IOMMU spec Figure 1/2; Table 1.

- Proof object: matrix - 证据边界: 类型 = spec; 实验 = 无; 可支撑 = DMA/IOMMU terminology; 不能支撑 = device trust lifecycle


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能页写成无新实验: IOMMU spec 不给 overhead。

- IOTLB、page-table walk、invalidation 会影响性能。
- 具体开销需要系统论文或实现报告。
- PPT 只说明性能风险点。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能页写成无新实验: IOMMU spec 不给 overhead。第一步解释为什么需要这一页: IOTLB、page-table walk、invalidation 会影响性能。第二步说明论文或规范实际做了什么: 具体开销需要系统论文或实现报告。第三步收束到证据边界: PPT 只说明性能风险点。引用时只把 IOMMU spec scope 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** IOMMU spec scope.

- Proof object: bars - claim strength: DMA 机制定义 高; 性能数字 无; trusted device proof 低


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: IOMMU 是 RISC-V trusted I/O 的必要积木，商业价值高但不能单独完成 TEE-I/O。

- 优势: 官方 DMA isolation 语义。
- 局限: 缺 attestation、link encryption、device lifecycle。
- 商业化潜力: 虚拟化、device assignment 和 CoVE-IO 的基础。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: IOMMU 是 RISC-V trusted I/O 的必要积木，商业价值高但不能单独完成 TEE-I/O。第一步解释为什么需要这一页: 优势: 官方 DMA isolation 语义。第二步说明论文或规范实际做了什么: 局限: 缺 attestation、link encryption、device lifecycle。第三步收束到证据边界: 商业化潜力: 虚拟化、device assignment 和 CoVE-IO 的基础。引用时只把 README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** README evaluation.

- Proof object: matrix - 评价: 优势 = DMA boundary; 局限 = not full trusted I/O; 商业化 = device assignment; 本方向角色 = I/O primitive


---

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `10-riscv-cove-io-tee-io` - RISC-V CoVE-IO / TEE-I/O
- Paper key: `riscv_iommu_2023`
- Role: auxiliary DMA translation substrate
- Evidence base: IOMMU local PDF Figure 1 device isolation; Figure 2 direct assignment; Table 1 terms.
- Boundary: IOMMU 是必要条件，不提供设备身份、链路保护或完整 TEE-I/O lifecycle。

### 1. 完整题目 / 作者 / 会议

- 完整题目: RISC-V IOMMU Architecture Specification
- 作者: RISC-V Non-ISA IOMMU contributors
- 会议/来源: RISC-V IOMMU specification, 2026 snapshot
- Title evidence: README metadata; IOMMU spec PDF.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** IOMMU 的作用是让设备 DMA 也必须经过地址转换和权限检查。

- 动机: 没有 IOMMU，设备可直接 DMA 到 TVM/enclave/private memory。
- 工作: 定义 device context、I/O page table、translation、fault、direct assignment。
- 数据: 规范无实验；证据是 Figure 1/2 和术语表。

**讲解稿:** 讲解时先把本页结论落到一句话: IOMMU 的作用是让设备 DMA 也必须经过地址转换和权限检查。第一步解释为什么需要这一页: 动机: 没有 IOMMU，设备可直接 DMA 到 TVM/enclave/private memory。第二步说明论文或规范实际做了什么: 工作: 定义 device context、I/O page table、translation、fault、direct assignment。第三步收束到证据边界: 数据: 规范无实验；证据是 Figure 1/2 和术语表。引用时只把 IOMMU Figure 1; Figure 2; Table 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** IOMMU Figure 1; Figure 2; Table 1.

- Proof object: flow - DMA translation: device request -> device ID -> context lookup -> I/O page table -> permission check -> translated address/fault


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是 DMA 不走 CPU page table，所以 CPU-side confidential memory 需要 I/O-side enforcement。

- Device assignment 到 VM 时，设备需要 guest-specific address space。
- Host 配置 IOMMU 的能力本身也要被 TSM/policy 约束。
- IOMMU 解决地址，不解决设备是否可信。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是 DMA 不走 CPU page table，所以 CPU-side confidential memory 需要 I/O-side enforcement。第一步解释为什么需要这一页: Device assignment 到 VM 时，设备需要 guest-specific address space。第二步说明论文或规范实际做了什么: Host 配置 IOMMU 的能力本身也要被 TSM/policy 约束。第三步收束到证据边界: IOMMU 解决地址，不解决设备是否可信。引用时只把 IOMMU introduction; Figure 1/2 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** IOMMU introduction; Figure 1/2.

- Proof object: matrix - IOMMU covers: DMA address = yes; Permission = yes; Fault reporting = yes; Device identity proof = no; Link encryption = no


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: IOMMU 是 trusted I/O 的地址层，CoVE-IO 是它上面的信任层。

- IOMMU 让 direct assignment 可实现。
- CoVE-IO 需要确保 IOMMU 配置与 TVM ownership 一致。
- sIOPMP/IOPMP 可补充 physical access control。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: IOMMU 是 trusted I/O 的地址层，CoVE-IO 是它上面的信任层。第一步解释为什么需要这一页: IOMMU 让 direct assignment 可实现。第二步说明论文或规范实际做了什么: CoVE-IO 需要确保 IOMMU 配置与 TVM ownership 一致。第三步收束到证据边界: sIOPMP/IOPMP 可补充 physical access control。引用时只把 IOMMU spec; CoVE-IO relation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** IOMMU spec; CoVE-IO relation.

- Proof object: cards - layering: IOMMU translation; IOPMP permission; TSM config authority; SPDM/TDISP identity; TVM policy


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: device context 指向 translation root，fault queue/command queue 支撑 runtime 管理。

- Figure 1 是 non-virtualized isolation。
- Figure 2 是 direct assignment to VM。
- TEE 场景必须把 context ownership 与 TVM lifecycle 一起管理。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: device context 指向 translation root，fault queue/command queue 支撑 runtime 管理。第一步解释为什么需要这一页: Figure 1 是 non-virtualized isolation。第二步说明论文或规范实际做了什么: Figure 2 是 direct assignment to VM。第三步收束到证据边界: TEE 场景必须把 context ownership 与 TVM lifecycle 一起管理。引用时只把 IOMMU Figure 1-Figure 2 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** IOMMU Figure 1-Figure 2.

- Proof object: matrix - 组件: Device context = select translation root; I/O page table = DMA mappings; Fault queue = violation reporting; Command queue = management; IOTLB = performance cache


### 6. 核心方法拆解

#### 方法 1: Device Context Lookup

**Claim:** 每个 DMA request 先定位 device context，决定走哪个 translation root。

- Requester/source ID 是隔离入口。
- Context 配错会让设备进入错误 address space。
- TEE manager 必须把 context update 纳入可信流程。

**讲解稿:** 讲解时先把本页结论落到一句话: 每个 DMA request 先定位 device context，决定走哪个 translation root。第一步解释为什么需要这一页: Requester/source ID 是隔离入口。第二步说明论文或规范实际做了什么: Context 配错会让设备进入错误 address space。第三步收束到证据边界: TEE manager 必须把 context update 纳入可信流程。引用时只把 IOMMU context and translation sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** IOMMU context and translation sections.

- Proof object: flow - context lookup: requester ID -> device context -> translation root -> permission -> DMA result

#### 方法 2: Direct Assignment

**Claim:** IOMMU 让设备直通给 VM 成为可能，但 confidential VM 需要更强配置保护。

- Guest DMA 访问必须限制到 assigned memory。
- Fault/reporting 不能泄露过多 TVM state。
- Unassign 后要清理 stale mapping。

**讲解稿:** 讲解时先把本页结论落到一句话: IOMMU 让设备直通给 VM 成为可能，但 confidential VM 需要更强配置保护。第一步解释为什么需要这一页: Guest DMA 访问必须限制到 assigned memory。第二步说明论文或规范实际做了什么: Fault/reporting 不能泄露过多 TVM state。第三步收束到证据边界: Unassign 后要清理 stale mapping。引用时只把 IOMMU Figure 2; assignment sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** IOMMU Figure 2; assignment sections.

- Proof object: matrix - assignment risks: Wrong context = cross-VM DMA; Stale IOTLB = old mapping usable; Fault leak = state observability; Unassign = cleanup required; TEE fix = TSM policy

#### 方法 3: Fault and Invalidation

**Claim:** IOMMU runtime 的难点在 invalidation、fault delivery 和缓存一致性。

- IOTLB 提升性能但需要正确 invalidation。
- Fault queue 让 software 观察 violation，但也形成 DoS/side signal。
- CoVE-IO 需要定义 confidential fault handling policy。

**讲解稿:** 讲解时先把本页结论落到一句话: IOMMU runtime 的难点在 invalidation、fault delivery 和缓存一致性。第一步解释为什么需要这一页: IOTLB 提升性能但需要正确 invalidation。第二步说明论文或规范实际做了什么: Fault queue 让 software 观察 violation，但也形成 DoS/side signal。第三步收束到证据边界: CoVE-IO 需要定义 confidential fault handling policy。引用时只把 IOMMU fault/invalidation sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** IOMMU fault/invalidation sections.

- Proof object: cards - runtime control: IOTLB; invalidation; fault queue; command queue; DoS boundary


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** IOMMU 是规范，无实验；作为 10 方向第三篇辅助 SOTA，只承载 DMA translation 语义。

- 证据源: 本地 PDF，Figure 1/2 和 Table 1。
- 可支撑: DMA isolation/direct assignment terms。
- 不能支撑: device trust, SPDM/TDISP, performance overhead。

**讲解稿:** 讲解时先把本页结论落到一句话: IOMMU 是规范，无实验；作为 10 方向第三篇辅助 SOTA，只承载 DMA translation 语义。第一步解释为什么需要这一页: 证据源: 本地 PDF，Figure 1/2 和 Table 1。第二步说明论文或规范实际做了什么: 可支撑: DMA isolation/direct assignment terms。第三步收束到证据边界: 不能支撑: device trust, SPDM/TDISP, performance overhead。引用时只把 IOMMU spec Figure 1/2; Table 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** IOMMU spec Figure 1/2; Table 1.

- Proof object: matrix - 证据边界: 类型 = spec; 实验 = 无; 可支撑 = DMA translation; 不能支撑 = trusted device lifecycle


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能页写成无新实验: IOMMU 规范不提供 benchmark。

- 性能关注 IOTLB hit/miss、page-table walk、invalidation、fault handling。
- 直接 assignment 性能潜力高，但 trusted lifecycle 会增加 setup cost。
- 具体开销必须来自实现评测。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能页写成无新实验: IOMMU 规范不提供 benchmark。第一步解释为什么需要这一页: 性能关注 IOTLB hit/miss、page-table walk、invalidation、fault handling。第二步说明论文或规范实际做了什么: 直接 assignment 性能潜力高，但 trusted lifecycle 会增加 setup cost。第三步收束到证据边界: 具体开销必须来自实现评测。引用时只把 IOMMU spec scope 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** IOMMU spec scope.

- Proof object: bars - claim strength: DMA semantics 高; performance data 无; CoVE-IO dependency 高; identity coverage 无


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: IOMMU 是本方向不可缺的底座，但必须和 sIOPMP/CoVE-IO/SPDM/TDISP 合用。

- 优势: 官方 DMA translation 语义，支持 direct assignment。
- 局限: 不证明设备可信，也不处理链路加密。
- 商业化潜力: 虚拟化、CVM、DPU/accelerator assignment 的基础。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: IOMMU 是本方向不可缺的底座，但必须和 sIOPMP/CoVE-IO/SPDM/TDISP 合用。第一步解释为什么需要这一页: 优势: 官方 DMA translation 语义，支持 direct assignment。第二步说明论文或规范实际做了什么: 局限: 不证明设备可信，也不处理链路加密。第三步收束到证据边界: 商业化潜力: 虚拟化、CVM、DPU/accelerator assignment 的基础。引用时只把 IOMMU README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** IOMMU README evaluation.

- Proof object: matrix - 评价: 优势 = DMA address boundary; 局限 = not full trusted I/O; 商业化 = device passthrough; 本方向角色 = translation substrate


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
