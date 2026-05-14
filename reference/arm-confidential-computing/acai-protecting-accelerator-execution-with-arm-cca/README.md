# ACAI: Protecting Accelerator Execution with Arm Confidential Computing Architecture

- BibTeX key: `acai2023`
- Category: `arm-confidential-computing`
- Authors: Supraja Sridhara et al.
- Year: 2023
- Source: https://arxiv.org/abs/2305.15986
- PDF source: https://arxiv.org/pdf/2305.15986
- Local PDF: `paper.pdf`
- Download status: downloaded and verified

- Evidence role: Draft/not ratified. Use with explicit arXiv/preprint status; do not treat as ratified standard, mature production evidence, or peer-reviewed consensus unless the source metadata says so.
- Secondary use: Foundational design point for Arm CCA accelerator-execution discussions.
<!-- BEGIN PAPER REVIEW -->
## Paper Review
Canonical BibTeX key: `acai2023`. Evidence role: Draft/not ratified. Use with explicit arXiv/preprint status; do not treat as ratified standard, mature production evidence, or peer-reviewed consensus unless the source metadata says so. Secondary use: Foundational design point for Arm CCA accelerator-execution discussions.

This README records the source/PDF availability above and should be treated as the local evidence-status record for ACAI: Protecting Accelerator Execution with Arm Confidential Computing Architecture. When citing this reference in the survey正文, keep the claim within the stated evidence role and cite stronger primary or official sources for mechanism details outside this source's scope.
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `05-arm-cca-io-accelerator-interrupt` - Arm CCA I/O、DMA、Accelerator、Interrupt
- Paper key: `acai2023`
- Role: CCA accelerator data-path foundation
- Evidence base: ACAI local PDF p.1-p.20; Figure 1 access modes; Table 1 copy/encryption comparison; Figure 2 GPC; Figure 3 attacks/protection.
- Boundary: 聚焦 accelerator access/data path；interrupt lifecycle 和通用 device attestation 需要 Devlore/SoK 补充。

### 1. 完整题目 / 作者 / 会议

- 完整题目: ACAI: Protecting Accelerator Execution with Arm Confidential Computing Architecture
- 作者: Supraja Sridhara et al.
- 会议/来源: ACM CCS / Arm CCA accelerator research, 2023
- Title evidence: ACAI title page and README metadata.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** ACAI 的贡献是让 accelerator 成为 CCA Realm 可安全使用的一等资源，而不是把数据复制到普通世界 bounce buffer。

- 动机: CVM 需要 GPU/FPGA/NPU 加速，但 CCA 默认设备不能直接访问 Realm memory。
- 工作: 扩展 CCA invariants 到 device-side access，结合 PCIe/IDE、device-side GPC 和 driver compatibility。
- 数据: 摘要报告 GPU 平均 43.5% overhead、FPGA 平均 12.1%；系统其他部分开销 3.8%/1.9%。

**讲解稿:** 讲解时先把本页结论落到一句话: ACAI 的贡献是让 accelerator 成为 CCA Realm 可安全使用的一等资源，而不是把数据复制到普通世界 bounce buffer。第一步解释为什么需要这一页: 动机: CVM 需要 GPU/FPGA/NPU 加速，但 CCA 默认设备不能直接访问 Realm memory。第二步说明论文或规范实际做了什么: 工作: 扩展 CCA invariants 到 device-side access，结合 PCIe/IDE、device-side GPC 和 driver compatibility。第三步收束到证据边界: 数据: 摘要报告 GPU 平均 43.5% overhead、FPGA 平均 12.1%；系统其他部分开销 3.8%/1.9%。引用时只把 ACAI p.1 abstract; Figure 1; Table 1; Figure 2; Figure 3 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** ACAI p.1 abstract; Figure 1; Table 1; Figure 2; Figure 3.

- Proof object: flow - ACAI 目标: Realm app uses accelerator -> avoid plaintext bounce buffer -> protect PCIe/device path -> device-side access checks -> bind keys/attestation -> run GPU/FPGA workload


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是 accelerator 既需要访问 Realm 数据，又可能被 untrusted hypervisor 配置或观察。

- Integrated mode 性能好，但设备直接访问 Realm memory 会突破 CCA 默认假设。
- Encrypted/bounce-buffer mode 安全些，但需要额外 copy 和 software encryption。
- 外接 PCIe accelerator 需要保护 DMA、device memory 和 bus traffic。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是 accelerator 既需要访问 Realm 数据，又可能被 untrusted hypervisor 配置或观察。第一步解释为什么需要这一页: Integrated mode 性能好，但设备直接访问 Realm memory 会突破 CCA 默认假设。第二步说明论文或规范实际做了什么: Encrypted/bounce-buffer mode 安全些，但需要额外 copy 和 software encryption。第三步收束到证据边界: 外接 PCIe accelerator 需要保护 DMA、device memory 和 bus traffic。引用时只把 ACAI p.1-p.2; Figure 1 access modes; Table 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** ACAI p.1-p.2; Figure 1 access modes; Table 1.

- Proof object: matrix - 三种访问模式: Integrated = direct device access, minimal copy; Encrypted/bounce = extra copies + software crypto; ACAI = device-side GPC + protected bus; 风险 = hypervisor/device path; 目标 = security + compatibility


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: CCA 的 granule protection 不能只停在 CPU，必须扩展到 device-side transaction。

- Device-side GPC 根据 GPT 限制设备访问 Realm memory。
- PCIe IDE/硬件加密保护链路数据，避免 software encryption/copy。
- Attestation report 需要绑定 device-side keys 和 accelerator configuration。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: CCA 的 granule protection 不能只停在 CPU，必须扩展到 device-side transaction。第一步解释为什么需要这一页: Device-side GPC 根据 GPT 限制设备访问 Realm memory。第二步说明论文或规范实际做了什么: PCIe IDE/硬件加密保护链路数据，避免 software encryption/copy。第三步收束到证据边界: Attestation report 需要绑定 device-side keys 和 accelerator configuration。引用时只把 ACAI p.2-p.4; Figure 2 GPC in Arm CCA; Figure 3 attacks/protection 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** ACAI p.2-p.4; Figure 2 GPC in Arm CCA; Figure 3 attacks/protection.

- Proof object: flow - device-side invariant: Realm granule owner -> device request -> device-side GPC checks GPT -> PCIe IDE protects link -> accelerator executes -> result returns to Realm


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: ACAI 修改 CCA simulator/TF-A/RMM/hypervisor 相关路径，让 Realm 与 GPU/FPGA 协同。

- Figure 1 对比 integrated/encrypted/ACAI access modes。
- Figure 2 说明 CCA GPC 接口和 RMM/hypervisor/monitor 关系。
- Figure 3 展示设备访问 Realm memory 的攻击与 ACAI 防护。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: ACAI 修改 CCA simulator/TF-A/RMM/hypervisor 相关路径，让 Realm 与 GPU/FPGA 协同。第一步解释为什么需要这一页: Figure 1 对比 integrated/encrypted/ACAI access modes。第二步说明论文或规范实际做了什么: Figure 2 说明 CCA GPC 接口和 RMM/hypervisor/monitor 关系。第三步收束到证据边界: Figure 3 展示设备访问 Realm memory 的攻击与 ACAI 防护。引用时只把 ACAI Figure 1-Figure 3 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** ACAI Figure 1-Figure 3.

- Proof object: matrix - ACAI 组件: Realm VM = confidential workload; Accelerator = GPU/FPGA execution; Device-side GPC = DMA access check; PCIe IDE = link crypto; RMM/TF-A = CCA lifecycle integration


### 6. 核心方法拆解

#### 方法 1: Access Mode Comparison

**Claim:** ACAI 先把 integrated、encrypted 和 ACAI 三条路径讲清楚，方便理解为什么 bounce buffer 慢。

- Integrated 没有额外 copy，但 threat model 不够。
- Encrypted path 有两次额外 copy 和 software encryption/decryption。
- ACAI 目标是保留硬件加密与 direct path 优势，同时加 device-side checks。

**讲解稿:** 讲解时先把本页结论落到一句话: ACAI 先把 integrated、encrypted 和 ACAI 三条路径讲清楚，方便理解为什么 bounce buffer 慢。第一步解释为什么需要这一页: Integrated 没有额外 copy，但 threat model 不够。第二步说明论文或规范实际做了什么: Encrypted path 有两次额外 copy 和 software encryption/decryption。第三步收束到证据边界: ACAI 目标是保留硬件加密与 direct path 优势，同时加 device-side checks。引用时只把 ACAI Figure 1; Table 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** ACAI Figure 1; Table 1.

- Proof object: matrix - 路径对比: Integrated = fast but unsafe for untrusted host; Encrypted = safe-ish but copy/crypto heavy; ACAI = hardware protected direct access; PPT 结论 = data path must be first-class

#### 方法 2: Device-Side GPC 与 Security Invariants

**Claim:** 设备访问 Realm memory 前必须像 CPU 一样通过 granule protection checks。

- Device-side GPC 把 GPT restriction 转成 device access checks。
- 不允许设备越权访问其他 Realm 或 host memory。
- invariants 系统化描述哪些 device operation 是安全的。

**讲解稿:** 讲解时先把本页结论落到一句话: 设备访问 Realm memory 前必须像 CPU 一样通过 granule protection checks。第一步解释为什么需要这一页: Device-side GPC 把 GPT restriction 转成 device access checks。第二步说明论文或规范实际做了什么: 不允许设备越权访问其他 Realm 或 host memory。第三步收束到证据边界: invariants 系统化描述哪些 device operation 是安全的。引用时只把 ACAI Figure 2 and Figure 3; security invariants discussion 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** ACAI Figure 2 and Figure 3; security invariants discussion.

- Proof object: flow - GPC enforcement: device issues memory request -> lookup granule state -> check assigned share -> allow/deny DMA -> log/bind configuration -> protect result path

#### 方法 3: Attestation / Key Binding / Compatibility

**Claim:** ACAI 不能只做访问控制，还要让 verifier 相信设备侧配置与密钥绑定正确。

- 论文提到把 device-side encryption keys 和配置绑定到 attestation report。
- 保留现有 accelerator driver/application 兼容性是设计目标。
- 原型展示 GPU 和 FPGA 两类 accelerator。

**讲解稿:** 讲解时先把本页结论落到一句话: ACAI 不能只做访问控制，还要让 verifier 相信设备侧配置与密钥绑定正确。第一步解释为什么需要这一页: 论文提到把 device-side encryption keys 和配置绑定到 attestation report。第二步说明论文或规范实际做了什么: 保留现有 accelerator driver/application 兼容性是设计目标。第三步收束到证据边界: 原型展示 GPU 和 FPGA 两类 accelerator。引用时只把 ACAI p.2 contributions; implementation/evaluation sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** ACAI p.2 contributions; implementation/evaluation sections.

- Proof object: cards - 落地要件: device key binding; attestation report; existing drivers; GPU; FPGA; open-source prototype


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** ACAI 的实验环境是 CCA simulator 原型加 GPU/FPGA workload；不是量产 CCA CPU 上的产品测量。

- 证据源: 本地 PDF 20 页。
- 实现: 基于 Arm public simulator/TF-A/RMM/hypervisor 修改，展示 GPU 和 FPGA。
- 边界: 论文指出 CCA production CPUs 当时不可用，因此 performance 是 prototype evidence。

**讲解稿:** 讲解时先把本页结论落到一句话: ACAI 的实验环境是 CCA simulator 原型加 GPU/FPGA workload；不是量产 CCA CPU 上的产品测量。第一步解释为什么需要这一页: 证据源: 本地 PDF 20 页。第二步说明论文或规范实际做了什么: 实现: 基于 Arm public simulator/TF-A/RMM/hypervisor 修改，展示 GPU 和 FPGA。第三步收束到证据边界: 边界: 论文指出 CCA production CPUs 当时不可用，因此 performance 是 prototype evidence。引用时只把 ACAI p.1-p.2; implementation/evaluation sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** ACAI p.1-p.2; implementation/evaluation sections.

- Proof object: matrix - 实验边界: 平台 = Arm public simulator + prototype; 设备 = GPU and FPGA; 关键图 = Fig.1-Fig.3; 性能 = 43.5% GPU / 12.1% FPGA; 边界 = not production silicon


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能页的关键数字: ACAI 保护 GPU 平均 43.5% overhead、FPGA 平均 12.1%；对系统其他部分分别约 3.8% 和 1.9%。

- GPU overhead 较高，说明 accelerator path 安全不是免费。
- FPGA overhead 较低，说明开销与 device/workload/data movement 相关。
- 这些数字来自 prototype evaluation，不能外推到所有 PCIe accelerator。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能页的关键数字: ACAI 保护 GPU 平均 43.5% overhead、FPGA 平均 12.1%；对系统其他部分分别约 3.8% 和 1.9%。第一步解释为什么需要这一页: GPU overhead 较高，说明 accelerator path 安全不是免费。第二步说明论文或规范实际做了什么: FPGA overhead 较低，说明开销与 device/workload/data movement 相关。第三步收束到证据边界: 这些数字来自 prototype evaluation，不能外推到所有 PCIe accelerator。引用时只把 ACAI p.1-p.2 reports 43.5%, 12.1%, 3.8%, 1.9%; evaluation section 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** ACAI p.1-p.2 reports 43.5%, 12.1%, 3.8%, 1.9%; evaluation section.

- Proof object: bars - ACAI 关键数字: GPU protected workload 43.5%; FPGA protected workload 12.1%; rest system GPU mode 3.8%; rest system FPGA mode 1.9%


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: ACAI 是 CCA accelerator path 的基础论文，优势是问题抓得准；局限是原型和设备生态仍早期。

- 优势: 把 device-side access 纳入 CCA invariants，不再只靠 bounce buffer。
- 局限: 生产硬件、设备 attestation、TDISP/SPDM、driver TCB 仍需补齐。
- 商业化潜力: 适合 confidential AI/GPU/FPGA cloud，但依赖 vendor accelerator 和 PCIe trusted I/O 生态。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: ACAI 是 CCA accelerator path 的基础论文，优势是问题抓得准；局限是原型和设备生态仍早期。第一步解释为什么需要这一页: 优势: 把 device-side access 纳入 CCA invariants，不再只靠 bounce buffer。第二步说明论文或规范实际做了什么: 局限: 生产硬件、设备 attestation、TDISP/SPDM、driver TCB 仍需补齐。第三步收束到证据边界: 商业化潜力: 适合 confidential AI/GPU/FPGA cloud，但依赖 vendor accelerator 和 PCIe trusted I/O 生态。引用时只把 ACAI conclusion and README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** ACAI conclusion and README evaluation.

- Proof object: matrix - 评价: 优势 = first-class accelerator access; 局限 = prototype / ecosystem gap; 商业化 = confidential GPU/FPGA cloud; 本方向角色 = data-path anchor


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
