# Demystifying Arm TrustZone: A Comprehensive Survey

- BibTeX key: `pinto2019trustzone`
- Category: `trusted-execution-environments`
- Authors: Sandro Pinto and Nuno Santos
- Year: 2019
- Source: https://doi.org/10.1145/3291047
- PDF source: https://syssec.dpss.inesc-id.pt/papers/pinto_acsur19.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Evidence role: Peer-reviewed SOTA. Use for the specific mechanism, evaluation, and threat-model scope established by the source; avoid broader claims outside its evidence class.
<!-- BEGIN PAPER REVIEW -->
## Paper Review
Canonical BibTeX key: `pinto2019trustzone`. Evidence role: Peer-reviewed SOTA. Use for the specific mechanism, evaluation, and threat-model scope established by the source; avoid broader claims outside its evidence class.

This README records the source/PDF availability above and should be treated as the local evidence-status record for Demystifying Arm TrustZone: A Comprehensive Survey. When citing this reference in the survey正文, keep the claim within the stated evidence role and cite stronger primary or official sources for mechanism details outside this source's scope.
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `02-trustzone-lineage` - Arm TrustZone TEE 与漏洞谱系
- Paper key: `pinto2019trustzone`
- Role: TrustZone ecosystem survey
- Evidence base: Pinto/Santos 2019 local PDF; Figure 1 TrustZone technology; Table 1 platforms.
- Boundary: Survey 不提供一手系统实验；不能替代某个 commercial TEE 或 CCA 机制原文。

### 1. 完整题目 / 作者 / 会议

- 完整题目: Demystifying Arm TrustZone: A Comprehensive Survey
- 作者: Sandro Pinto and Nuno Santos
- 会议/来源: ACM Computing Surveys, 2019
- Title evidence: README metadata; ACM Computing Surveys paper.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** 这篇 survey 的价值是把 TrustZone 从“一个硬件特性”讲成完整生态: hardware -> TEE OS -> TA -> application。

- 动机: TrustZone 被广泛使用，但资料分散在芯片、TEE OS、SDK、应用和学术原型里。
- 工作: 解释 TrustZone 技术基础，并按系统软件、TEE、应用、虚拟化和安全问题组织 literature。
- 数据: Table 1 总结平台，正文梳理多类 TEE OS 和研究系统。

**讲解稿:** 讲解时先把本页结论落到一句话: 这篇 survey 的价值是把 TrustZone 从“一个硬件特性”讲成完整生态: hardware -> TEE OS -> TA -> application。第一步解释为什么需要这一页: 动机: TrustZone 被广泛使用，但资料分散在芯片、TEE OS、SDK、应用和学术原型里。第二步说明论文或规范实际做了什么: 工作: 解释 TrustZone 技术基础，并按系统软件、TEE、应用、虚拟化和安全问题组织 literature。第三步收束到证据边界: 数据: Table 1 总结平台，正文梳理多类 TEE OS 和研究系统。引用时只把 Pinto/Santos 2019 Figure 1; Table 1; survey taxonomy sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Pinto/Santos 2019 Figure 1; Table 1; survey taxonomy sections.

- Proof object: flow - survey map: TrustZone hardware -> secure monitor -> TEE OS -> trusted applications -> normal-world client -> use cases / vulnerabilities


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是 TrustZone 只提供硬件分区，真正的 TEE 安全取决于软件栈如何使用这个分区。

- TEE OS、TA、client app、driver、RPC 和共享内存共同构成攻击面。
- 不同厂商有不同 TEE OS 和 API，导致生态碎片化。
- 研究系统常与商业部署的 threat model、接口和 TCB 不一致。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是 TrustZone 只提供硬件分区，真正的 TEE 安全取决于软件栈如何使用这个分区。第一步解释为什么需要这一页: TEE OS、TA、client app、driver、RPC 和共享内存共同构成攻击面。第二步说明论文或规范实际做了什么: 不同厂商有不同 TEE OS 和 API，导致生态碎片化。第三步收束到证据边界: 研究系统常与商业部署的 threat model、接口和 TCB 不一致。引用时只把 Pinto/Santos 2019 TrustZone architecture and software stack discussion 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Pinto/Santos 2019 TrustZone architecture and software stack discussion.

- Proof object: matrix - TrustZone 生态层: 硬件 = security extensions / NS bit; monitor = world switch; TEE OS = trusted services; TA/API = application-facing boundary; normal OS = client and driver


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: TrustZone-assisted TEE 不是硬件单点机制，而是硬件能力、TEE OS、TA 生命周期和普通世界接口的组合系统。

- 读这类论文时要问: 哪些代码在 secure world，哪些接口暴露给 normal world。
- Trusted applications 越多，TEE OS 越像一个小 OS，漏洞面越接近传统系统软件。
- TrustZone 的生态谱系解释了为什么后续 Realm/CVM 希望减少高权限共享 TCB。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: TrustZone-assisted TEE 不是硬件单点机制，而是硬件能力、TEE OS、TA 生命周期和普通世界接口的组合系统。第一步解释为什么需要这一页: 读这类论文时要问: 哪些代码在 secure world，哪些接口暴露给 normal world。第二步说明论文或规范实际做了什么: Trusted applications 越多，TEE OS 越像一个小 OS，漏洞面越接近传统系统软件。第三步收束到证据边界: TrustZone 的生态谱系解释了为什么后续 Realm/CVM 希望减少高权限共享 TCB。引用时只把 Pinto/Santos 2019 survey architecture; TEE OS and application sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Pinto/Santos 2019 survey architecture; TEE OS and application sections.

- Proof object: cards - 三层核心: 硬件隔离; TEE OS 服务; TA/API 生态; virtualization use; security pitfalls


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览可画成 normal world client 通过 driver/RPC 调用 secure world TEE OS 和 TA。

- Normal world 负责 UI、网络、文件系统和大部分应用逻辑。
- Secure world 负责密钥、crypto、secure storage、DRM、payment 等敏感服务。
- 共享内存和 RPC 是跨世界交互关键，也是后续漏洞 SoK 的重点。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览可画成 normal world client 通过 driver/RPC 调用 secure world TEE OS 和 TA。第一步解释为什么需要这一页: Normal world 负责 UI、网络、文件系统和大部分应用逻辑。第二步说明论文或规范实际做了什么: Secure world 负责密钥、crypto、secure storage、DRM、payment 等敏感服务。第三步收束到证据边界: 共享内存和 RPC 是跨世界交互关键，也是后续漏洞 SoK 的重点。引用时只把 Pinto/Santos 2019 Figure 1 and TEE software stack discussion 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Pinto/Santos 2019 Figure 1 and TEE software stack discussion.

- Proof object: flow - TEE 调用路径: normal app -> TEE client API -> normal-world driver -> SMC/secure monitor -> TEE OS -> trusted application


### 6. 核心方法拆解

#### 方法 1: 硬件与 Monitor 层分类

**Claim:** Survey 先把 TrustZone 硬件能力解释清楚，再讨论软件如何建立 TEE。

- 处理器安全状态、secure monitor 和 interrupt routing 是所有系统的底座。
- 内存和外设隔离决定 secure world 是否能保护密钥与 I/O。
- 虚拟化扩展会改变 monitor 和 hypervisor 的分工。

**讲解稿:** 讲解时先把本页结论落到一句话: Survey 先把 TrustZone 硬件能力解释清楚，再讨论软件如何建立 TEE。第一步解释为什么需要这一页: 处理器安全状态、secure monitor 和 interrupt routing 是所有系统的底座。第二步说明论文或规范实际做了什么: 内存和外设隔离决定 secure world 是否能保护密钥与 I/O。第三步收束到证据边界: 虚拟化扩展会改变 monitor 和 hypervisor 的分工。引用时只把 Pinto/Santos 2019 Figure 1; hardware architecture sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Pinto/Santos 2019 Figure 1; hardware architecture sections.

- Proof object: matrix - 硬件底座: CPU = security state; monitor = world switch; memory = secure region; peripheral = secure device; virtualization = hypervisor support

#### 方法 2: TEE OS / TA / API 分类

**Claim:** TrustZone 的实用价值来自 TEE OS 和 TA 生态，但这也是 TCB 膨胀来源。

- TEE OS 提供 scheduler、memory manager、crypto、secure storage 和 IPC。
- TA 使用 GlobalPlatform 或厂商 API 与普通世界交互。
- 接口越多、TA 越复杂，攻击面越大。

**讲解稿:** 讲解时先把本页结论落到一句话: TrustZone 的实用价值来自 TEE OS 和 TA 生态，但这也是 TCB 膨胀来源。第一步解释为什么需要这一页: TEE OS 提供 scheduler、memory manager、crypto、secure storage 和 IPC。第二步说明论文或规范实际做了什么: TA 使用 GlobalPlatform 或厂商 API 与普通世界交互。第三步收束到证据边界: 接口越多、TA 越复杂，攻击面越大。引用时只把 Pinto/Santos 2019 sections on TEE systems and applications 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Pinto/Santos 2019 sections on TEE systems and applications.

- Proof object: flow - TA lifecycle: load TA -> open session -> share memory -> invoke command -> return result -> close session

#### 方法 3: 应用与虚拟化谱系

**Claim:** Survey 把 TrustZone 放到移动、IoT、虚拟化和研究原型中比较，而不是只看一个 commercial TEE。

- 移动场景关注 DRM/payment/keystore。
- IoT 场景关注安全启动、远程管理和轻量 trusted service。
- 虚拟化场景试图把 TrustZone 扩成多 OS 或多 VM 安全底座，但边界不同于 CCA。

**讲解稿:** 讲解时先把本页结论落到一句话: Survey 把 TrustZone 放到移动、IoT、虚拟化和研究原型中比较，而不是只看一个 commercial TEE。第一步解释为什么需要这一页: 移动场景关注 DRM/payment/keystore。第二步说明论文或规范实际做了什么: IoT 场景关注安全启动、远程管理和轻量 trusted service。第三步收束到证据边界: 虚拟化场景试图把 TrustZone 扩成多 OS 或多 VM 安全底座，但边界不同于 CCA。引用时只把 Pinto/Santos 2019 application and virtualization sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Pinto/Santos 2019 application and virtualization sections.

- Proof object: cards - 用例谱系: mobile payment; DRM; keystore; IoT management; secure boot; virtualization


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** 这是一篇 peer-reviewed survey，不提供新系统实验；它适合当 TrustZone 生态地图。

- 证据源: ACM Computing Surveys 论文，本地 PDF。
- 核心证据: Figure 1 架构图、Table 1 平台表，以及各类 TEE OS/应用分类。
- Claim strength: 适合支撑背景、生态和分类，不支撑具体实现安全证明。

**讲解稿:** 讲解时先把本页结论落到一句话: 这是一篇 peer-reviewed survey，不提供新系统实验；它适合当 TrustZone 生态地图。第一步解释为什么需要这一页: 证据源: ACM Computing Surveys 论文，本地 PDF。第二步说明论文或规范实际做了什么: 核心证据: Figure 1 架构图、Table 1 平台表，以及各类 TEE OS/应用分类。第三步收束到证据边界: Claim strength: 适合支撑背景、生态和分类，不支撑具体实现安全证明。引用时只把 pdfinfo; Pinto/Santos 2019 Figure 1 and Table 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** pdfinfo; Pinto/Santos 2019 Figure 1 and Table 1.

- Proof object: matrix - 证据边界: 可支撑 = TrustZone ecosystem; 不能支撑 = commercial TEE bug-free; 实验 = 无新实验; 用法 = 背景/谱系/迁移成本


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能页应写成 survey boundary: 它汇总系统，不给统一 benchmark。

- 如果提及某个 TEE OS 或虚拟化系统性能，必须回到对应原始论文。
- Survey 本身可用于说明设计取舍: TCB、API、兼容性、虚拟化支持。
- 不要把 survey 中的生态覆盖写成性能优势。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能页应写成 survey boundary: 它汇总系统，不给统一 benchmark。第一步解释为什么需要这一页: 如果提及某个 TEE OS 或虚拟化系统性能，必须回到对应原始论文。第二步说明论文或规范实际做了什么: Survey 本身可用于说明设计取舍: TCB、API、兼容性、虚拟化支持。第三步收束到证据边界: 不要把 survey 中的生态覆盖写成性能优势。引用时只把 Pinto/Santos 2019 is a survey; no unified benchmark 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Pinto/Santos 2019 is a survey; no unified benchmark.

- Proof object: bars - claim strength: 生态覆盖 高; 统一性能 无; 机制解释 中; CCA 可替代性 低


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: 它是 TrustZone 入门和迁移背景的好材料，但不能回答 CCA 时代的云隔离问题。

- 优势: 系统化、覆盖面广，适合解释 TEE 软件栈和生态。
- 局限: survey 发表较早，对 CCA/RME、Realm 和现代 confidential VM 不完整。
- 商业化潜力: 帮助评估 legacy TrustZone API/TA 迁移、兼容性和审计成本。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: 它是 TrustZone 入门和迁移背景的好材料，但不能回答 CCA 时代的云隔离问题。第一步解释为什么需要这一页: 优势: 系统化、覆盖面广，适合解释 TEE 软件栈和生态。第二步说明论文或规范实际做了什么: 局限: survey 发表较早，对 CCA/RME、Realm 和现代 confidential VM 不完整。第三步收束到证据边界: 商业化潜力: 帮助评估 legacy TrustZone API/TA 迁移、兼容性和审计成本。引用时只把 README evaluation; survey scope 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** README evaluation; survey scope.

- Proof object: matrix - 评价: 优势 = 生态地图清晰; 局限 = 非 CCA / 非一手实验; 商业化 = legacy TEE 迁移评估; 本报告角色 = TrustZone lineage bridge


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
