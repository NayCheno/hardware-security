# Design and Verification of the Arm Confidential Compute Architecture

- BibTeX key: `li2022cca`
- Category: `arm-confidential-computing`
- Authors: Xupeng Li et al.
- Year: 2022
- Source: https://www.usenix.org/conference/osdi22/presentation/li
- PDF source: https://www.usenix.org/system/files/osdi22-li.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified

- Evidence role: Foundational. Use as a foundational entry point for this survey lane; later SOTA, specification, or implementation details should be cited separately when making narrow claims.
<!-- BEGIN PAPER REVIEW -->
## Paper Review
Canonical BibTeX key: `li2022cca`. Evidence role: Foundational. Use as a foundational entry point for this survey lane; later SOTA, specification, or implementation details should be cited separately when making narrow claims.

This README records the source/PDF availability above and should be treated as the local evidence-status record for Design and Verification of the Arm Confidential Compute Architecture. When citing this reference in the survey正文, keep the claim within the stated evidence role and cite stronger primary or official sources for mechanism details outside this source's scope.
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `03-arm-cca-rme-rmm` - Arm CCA / RME / RMM 基础架构
- Paper key: `li2022cca`
- Role: foundational CCA architecture paper
- Evidence base: Li 2022 local PDF p.1-p.22; Figure 1 CCA architecture; Figure 2 granule delegation; Table 1 access-control policy; Table 2 RMI.
- Boundary: 研究论文解释设计与验证；具体产品和最新规范语义仍需回官方 spec。

### 1. 完整题目 / 作者 / 会议

- 完整题目: Design and Verification of the Arm Confidential Compute Architecture
- 作者: Xupeng Li et al.
- 会议/来源: OSDI 2022 / Arm CCA research paper
- Title evidence: Li 2022 title page and README metadata.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** Li 2022 的贡献是把“host 不可信”的云 threat model 落到 Arm 平台的 Realm、GPT 和 RMM 机制上。

- 动机: OS/hypervisor 传统上被信任，但云租户希望敏感 VM 对云管理员和 host software 不透明。
- 工作: 引入 Realms、Root world、Granule Protection Table、RMM 和 Realm/host 接口。
- 数据: 论文给出访问控制表、RMI 表和形式化设计验证思路，不是单纯性能论文。

**讲解稿:** 讲解时先把本页结论落到一句话: Li 2022 的贡献是把“host 不可信”的云 threat model 落到 Arm 平台的 Realm、GPT 和 RMM 机制上。第一步解释为什么需要这一页: 动机: OS/hypervisor 传统上被信任，但云租户希望敏感 VM 对云管理员和 host software 不透明。第二步说明论文或规范实际做了什么: 工作: 引入 Realms、Root world、Granule Protection Table、RMM 和 Realm/host 接口。第三步收束到证据边界: 数据: 论文给出访问控制表、RMI 表和形式化设计验证思路，不是单纯性能论文。引用时只把 Li 2022 p.1 abstract; Figure 1; Table 1; Table 2 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Li 2022 p.1 abstract; Figure 1; Table 1; Table 2.

- Proof object: flow - CCA 设计管线: sensitive VM -> host becomes untrusted -> Realm abstraction -> GPT granule ownership -> RMM lifecycle -> attestation and verification


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 研究背景是 hypervisor 必须继续调度资源，但不应能读写 tenant VM 的机密状态。

- 传统虚拟化中 hypervisor 管页表、设备、调度和 VM 生命周期，拥有过强能力。
- TrustZone 双世界不能自然扩展到多租户云 VM，因为 secure world 不是为大量 CVM 管理设计。
- CCA 需要保留云平台可管理性，同时把内存内容和执行状态从 host 隔离。

**讲解稿:** 讲解时先把本页结论落到一句话: 研究背景是 hypervisor 必须继续调度资源，但不应能读写 tenant VM 的机密状态。第一步解释为什么需要这一页: 传统虚拟化中 hypervisor 管页表、设备、调度和 VM 生命周期，拥有过强能力。第二步说明论文或规范实际做了什么: TrustZone 双世界不能自然扩展到多租户云 VM，因为 secure world 不是为大量 CVM 管理设计。第三步收束到证据边界: CCA 需要保留云平台可管理性，同时把内存内容和执行状态从 host 隔离。引用时只把 Li 2022 p.1-p.2 introduction; Figure 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Li 2022 p.1-p.2 introduction; Figure 1.

- Proof object: matrix - CCA 要拆开的权力: Host = scheduling/resource allocation; Realm = tenant code/data confidentiality; RMM = lifecycle and access-control enforcement; Monitor/Root = highest privilege management; Verifier = attestation decision


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: CCA 不是让 hypervisor 消失，而是让 hypervisor 只能管理“不可读”的 Realm 资源。

- Granule ownership 是 CCA 最小安全单位；host 可请求 delegate/undelegate，但不能随意访问 Realm granule。
- RMM 是 Realm lifecycle 的安全仲裁者，RMI/RSI 把 host 与 Realm 的操作分开。
- 这种分工是 CCA 后续 I/O、interrupt、container 和 accelerator 方案的基础。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: CCA 不是让 hypervisor 消失，而是让 hypervisor 只能管理“不可读”的 Realm 资源。第一步解释为什么需要这一页: Granule ownership 是 CCA 最小安全单位；host 可请求 delegate/undelegate，但不能随意访问 Realm granule。第二步说明论文或规范实际做了什么: RMM 是 Realm lifecycle 的安全仲裁者，RMI/RSI 把 host 与 Realm 的操作分开。第三步收束到证据边界: 这种分工是 CCA 后续 I/O、interrupt、container 和 accelerator 方案的基础。引用时只把 Li 2022 Figure 2; Table 1 access-control policy; Table 2 RMI 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Li 2022 Figure 2; Table 1 access-control policy; Table 2 RMI.

- Proof object: flow - 谁能做什么: host requests resource action -> RMM checks granule state -> GPT enforces access -> Realm runs with protected state -> host schedules but cannot inspect -> attestation binds initial state


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: CCA 增加 Realm world 和 Root world，让 RMM 管理 Realm，同时用 GPT 在硬件路径约束访问。

- Figure 1 展示 CCA 在既有 Arm worlds 基础上增加 Realm。
- GPT/GPC 负责物理地址 granule 的 security state 检查。
- RMM 暴露 RMI 给 host、RSI 给 Realm，把管理操作和 guest service 分离。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: CCA 增加 Realm world 和 Root world，让 RMM 管理 Realm，同时用 GPT 在硬件路径约束访问。第一步解释为什么需要这一页: Figure 1 展示 CCA 在既有 Arm worlds 基础上增加 Realm。第二步说明论文或规范实际做了什么: GPT/GPC 负责物理地址 granule 的 security state 检查。第三步收束到证据边界: RMM 暴露 RMI 给 host、RSI 给 Realm，把管理操作和 guest service 分离。引用时只把 Li 2022 Figure 1; Figure 2; Table 2 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Li 2022 Figure 1; Figure 2; Table 2.

- Proof object: matrix - CCA 组件: Realm = tenant CVM execution; RMM = Realm lifecycle monitor; GPT/GPC = granule access control; Host = untrusted scheduling; RMI/RSI = management/service interfaces


### 6. 核心方法拆解

#### 方法 1: Realm 与 Security State

**Claim:** Realm 把 tenant VM 从 Normal world hypervisor 中隔离出来。

- Realm world 是 CCA 的核心执行环境，目标是保护 VM 内存和 CPU state。
- Root world/RMM 拥有管理 Realm 的高权限，但需要保持小 TCB。
- Normal world host 仍可调度，但只能通过受控接口影响 Realm。

**讲解稿:** 讲解时先把本页结论落到一句话: Realm 把 tenant VM 从 Normal world hypervisor 中隔离出来。第一步解释为什么需要这一页: Realm world 是 CCA 的核心执行环境，目标是保护 VM 内存和 CPU state。第二步说明论文或规范实际做了什么: Root world/RMM 拥有管理 Realm 的高权限，但需要保持小 TCB。第三步收束到证据边界: Normal world host 仍可调度，但只能通过受控接口影响 Realm。引用时只把 Li 2022 Figure 1 and Section on CCA architecture 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Li 2022 Figure 1 and Section on CCA architecture.

- Proof object: cards - worlds: Normal; Realm; Root; Secure; host remains manager; Realm hides data

#### 方法 2: Granule Protection Table / GPC

**Claim:** GPT/GPC 把物理内存按 granule 标记为不同 owner，是 CCA 防 host 读写的硬件根。

- Host 请求 delegate granule 后，RMM/GPT 改变 granule security state。
- Access-control policy 决定哪个 world 能访问哪个 granule。
- 错误的 granule transition 会直接破坏 Realm 隔离。

**讲解稿:** 讲解时先把本页结论落到一句话: GPT/GPC 把物理内存按 granule 标记为不同 owner，是 CCA 防 host 读写的硬件根。第一步解释为什么需要这一页: Host 请求 delegate granule 后，RMM/GPT 改变 granule security state。第二步说明论文或规范实际做了什么: Access-control policy 决定哪个 world 能访问哪个 granule。第三步收束到证据边界: 错误的 granule transition 会直接破坏 Realm 隔离。引用时只把 Li 2022 Figure 2; Table 1 CCA access-control policy 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Li 2022 Figure 2; Table 1 CCA access-control policy.

- Proof object: flow - granule lifecycle: normal granule -> delegate request -> RMM validates -> GPT state changes -> Realm owns granule -> undelegate on teardown

#### 方法 3: RMM / RMI / RSI 分工

**Claim:** RMM 是 CCA 软件 TCB 核心，接口设计决定 host 与 Realm 能否安全协作。

- RMI 面向 host/hypervisor，用于创建 Realm、管理 granule、运行 REC。
- RSI 面向 Realm payload，用于获取服务和 attestation 相关信息。
- 接口越小、状态机越清楚，越容易验证和实现。

**讲解稿:** 讲解时先把本页结论落到一句话: RMM 是 CCA 软件 TCB 核心，接口设计决定 host 与 Realm 能否安全协作。第一步解释为什么需要这一页: RMI 面向 host/hypervisor，用于创建 Realm、管理 granule、运行 REC。第二步说明论文或规范实际做了什么: RSI 面向 Realm payload，用于获取服务和 attestation 相关信息。第三步收束到证据边界: 接口越小、状态机越清楚，越容易验证和实现。引用时只把 Li 2022 Table 2 RMM Realm Management Interface 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Li 2022 Table 2 RMM Realm Management Interface.

- Proof object: matrix - 接口边界: RMI = host -> RMM management; RSI = Realm -> RMM services; RMM = checks lifecycle invariants; Host = cannot bypass GPT; Realm = does not trust host

#### 方法 4: 形式化验证与设计边界

**Claim:** 论文强调 CCA 的访问控制和状态转换需要可验证，而不是只靠实现约定。

- 验证对象主要是架构状态、granule transition 和访问控制不变量。
- 这类证明支撑设计正确性，但不等于证明所有实现没有漏洞。
- PPT 中要把 formal design evidence 与产品/性能 evidence 分开。

**讲解稿:** 讲解时先把本页结论落到一句话: 论文强调 CCA 的访问控制和状态转换需要可验证，而不是只靠实现约定。第一步解释为什么需要这一页: 验证对象主要是架构状态、granule transition 和访问控制不变量。第二步说明论文或规范实际做了什么: 这类证明支撑设计正确性，但不等于证明所有实现没有漏洞。第三步收束到证据边界: PPT 中要把 formal design evidence 与产品/性能 evidence 分开。引用时只把 Li 2022 verification sections; Table 1 access-control policy 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Li 2022 verification sections; Table 1 access-control policy.

- Proof object: matrix - 验证能/不能支撑: 能 = access-control invariants; 能 = state transition sanity; 不能 = all firmware bugs absent; 不能 = I/O/device path complete; 处理 = 回 spec and implementation


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** 实验环境页应写成设计与验证证据: 论文不是在证明某一商用 CCA 服务器的完整性能。

- 证据源: 本地 PDF 22 页。
- 核心证据: Figure 1/2、Table 1、Table 2、验证讨论。
- 边界: I/O、device assignment、interrupt 和后续 RMM 规范细节需要其他材料补充。

**讲解稿:** 讲解时先把本页结论落到一句话: 实验环境页应写成设计与验证证据: 论文不是在证明某一商用 CCA 服务器的完整性能。第一步解释为什么需要这一页: 证据源: 本地 PDF 22 页。第二步说明论文或规范实际做了什么: 核心证据: Figure 1/2、Table 1、Table 2、验证讨论。第三步收束到证据边界: 边界: I/O、device assignment、interrupt 和后续 RMM 规范细节需要其他材料补充。引用时只把 pdfinfo; Li 2022 p.1-p.22 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** pdfinfo; Li 2022 p.1-p.22.

- Proof object: matrix - 证据边界: 可支撑 = CCA base architecture; 不能支撑 = all deployment/I/O claims; 实验 = 设计验证为主; 后续引用 = Arm spec/RMM spec


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能页要谨慎: Li 2022 的核心是架构和验证，不是给 CCA 全栈性能基准。

- 可讨论的性能相关点是 CCA 试图保留 host resource management 和 VM 兼容性。
- 不可写成“CCA overhead 已被本文全面证明”。
- 具体 container、accelerator、interrupt 和 memory-protection overhead 应分别引用 Shelter/RContainer/NanoZone/ACAI/Devlore 等论文。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能页要谨慎: Li 2022 的核心是架构和验证，不是给 CCA 全栈性能基准。第一步解释为什么需要这一页: 可讨论的性能相关点是 CCA 试图保留 host resource management 和 VM 兼容性。第二步说明论文或规范实际做了什么: 不可写成“CCA overhead 已被本文全面证明”。第三步收束到证据边界: 具体 container、accelerator、interrupt 和 memory-protection overhead 应分别引用 Shelter/RContainer/NanoZone/ACAI/Devlore 等论文。引用时只把 Li 2022 scope and validation evidence 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Li 2022 scope and validation evidence.

- Proof object: bars - claim strength: 架构定义 高; 形式化设计证据 中高; 全栈性能 低; I/O 覆盖 低


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: Li 2022 是 CCA 方向主线材料，优势是边界清楚；局限是需要规范和系统论文补齐落地细节。

- 优势: 把 Realm/GPT/RMM/attestation 放进统一设计。
- 局限: 不覆盖所有后续规范细节、设备路径和 commercial deployment。
- 商业化潜力: 是 Arm server confidential computing 的基础，但依赖 RMM、firmware、OS、I/O ecosystem 成熟。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: Li 2022 是 CCA 方向主线材料，优势是边界清楚；局限是需要规范和系统论文补齐落地细节。第一步解释为什么需要这一页: 优势: 把 Realm/GPT/RMM/attestation 放进统一设计。第二步说明论文或规范实际做了什么: 局限: 不覆盖所有后续规范细节、设备路径和 commercial deployment。第三步收束到证据边界: 商业化潜力: 是 Arm server confidential computing 的基础，但依赖 RMM、firmware、OS、I/O ecosystem 成熟。引用时只把 Li 2022 conclusion; README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Li 2022 conclusion; README evaluation.

- Proof object: matrix - 评价: 优势 = CCA design spine; 局限 = 非完整产品验证; 商业化 = Arm cloud CVM 基础; 本报告角色 = 03 主 SOTA


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
