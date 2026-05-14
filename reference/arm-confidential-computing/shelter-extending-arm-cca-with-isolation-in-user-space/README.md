# SHELTER: Extending Arm CCA with Isolation in User Space

- BibTeX key: `zhang2023shelter`
- Category: `arm-confidential-computing`
- Authors: Yiming Zhang et al.
- Year: 2023
- Source: https://www.usenix.org/conference/usenixsecurity23/presentation/zhang-yiming
- PDF source: https://www.usenix.org/system/files/usenixsecurity23-zhang-yiming.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified

- Evidence role: Foundational. Use as a foundational entry point for this survey lane; later SOTA, specification, or implementation details should be cited separately when making narrow claims.
<!-- BEGIN PAPER REVIEW -->
## Paper Review
Canonical BibTeX key: `zhang2023shelter`. Evidence role: Foundational. Use as a foundational entry point for this survey lane; later SOTA, specification, or implementation details should be cited separately when making narrow claims.

This README records the source/PDF availability above and should be treated as the local evidence-status record for SHELTER: Extending Arm CCA with Isolation in User Space. When citing this reference in the survey正文, keep the claim within the stated evidence role and cite stronger primary or official sources for mechanism details outside this source's scope.
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `04-arm-cca-deployment` - Arm CCA 细粒度隔离与部署模型
- Paper key: `zhang2023shelter`
- Role: foundational user-space CCA isolation
- Evidence base: Shelter local PDF p.1-p.20; Figure 1 CCA components; Figure 2 overview; Figure 3 multi-GPT; Table 1/2.
- Boundary: 不解决容器级完整隔离和进程内高频 domain switching；后续 RContainer/NanoZone 补齐。

### 1. 完整题目 / 作者 / 会议

- 完整题目: SHELTER: Extending Arm CCA with Isolation in User Space
- 作者: Yiming Zhang et al.
- 会议/来源: USENIX Security 2023
- Title evidence: Shelter title page; README metadata.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** Shelter 的贡献是把 Arm CCA 从保护整台 Realm VM 扩展到 Normal world 内的用户态 SApp。

- 动机: 传统 TrustZone 需要 trusted OS，CCA 保护 CVM 但不能直接保护普通 OS 内的单个安全应用。
- 工作: 在 EL3 monitor 中管理 SApp，利用 GPT/GPC 和 multi-GPT 控制物理内存访问。
- 数据: 论文在 emulator/SoC 上验证功能和性能，摘要报告真实 workload 开销小于 15%。

**讲解稿:** 讲解时先把本页结论落到一句话: Shelter 的贡献是把 Arm CCA 从保护整台 Realm VM 扩展到 Normal world 内的用户态 SApp。第一步解释为什么需要这一页: 动机: 传统 TrustZone 需要 trusted OS，CCA 保护 CVM 但不能直接保护普通 OS 内的单个安全应用。第二步说明论文或规范实际做了什么: 工作: 在 EL3 monitor 中管理 SApp，利用 GPT/GPC 和 multi-GPT 控制物理内存访问。第三步收束到证据边界: 数据: 论文在 emulator/SoC 上验证功能和性能，摘要报告真实 workload 开销小于 15%。引用时只把 Shelter p.1 abstract; Figure 1; Figure 2; Figure 3; p.1 reports <15% overhead 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Shelter p.1 abstract; Figure 1; Figure 2; Figure 3; p.1 reports <15% overhead.

- Proof object: flow - Shelter 思路: normal OS hosts apps -> SApp requests protected execution -> Monitor configures GPT -> SApp memory becomes isolated -> OS remains mostly untrusted -> return to normal execution


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 研究背景是 CCA 的 Realm 粒度太粗，TrustZone trusted OS 又太重。

- 很多设备只需要保护少量 user-space security applications，而不是整台 VM。
- 把完整 trusted OS 放进 secure world 增大 TCB。
- 如果用 CCA 的 GPC/GPT 保护 Normal world 中的 SApp，就可能获得更轻的部署模型。

**讲解稿:** 讲解时先把本页结论落到一句话: 研究背景是 CCA 的 Realm 粒度太粗，TrustZone trusted OS 又太重。第一步解释为什么需要这一页: 很多设备只需要保护少量 user-space security applications，而不是整台 VM。第二步说明论文或规范实际做了什么: 把完整 trusted OS 放进 secure world 增大 TCB。第三步收束到证据边界: 如果用 CCA 的 GPC/GPT 保护 Normal world 中的 SApp，就可能获得更轻的部署模型。引用时只把 Shelter p.1-p.2 introduction; Figure 1; Table 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Shelter p.1-p.2 introduction; Figure 1; Table 1.

- Proof object: matrix - 为什么需要 Shelter: TrustZone = trusted OS TCB 大; CCA Realm = VM 粒度较粗; 普通进程 = 受 host OS 控制; 目标 = user-space app isolation; 约束 = 低开销/少修改


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: 只要能让 SApp 的物理页在 GPT 上对 host 不可访问，就能在 Normal world 内构造一个轻量 TEE。

- Monitor 使用独立 GPT 视图区分 SApp 和 host。
- GPC 对物理地址访问做最终判定，即使页表映射存在也不能绕过。
- 难点是动态内存分配、系统调用、跨核执行和上下文切换。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: 只要能让 SApp 的物理页在 GPT 上对 host 不可访问，就能在 Normal world 内构造一个轻量 TEE。第一步解释为什么需要这一页: Monitor 使用独立 GPT 视图区分 SApp 和 host。第二步说明论文或规范实际做了什么: GPC 对物理地址访问做最终判定，即使页表映射存在也不能绕过。第三步收束到证据边界: 难点是动态内存分配、系统调用、跨核执行和上下文切换。引用时只把 Shelter Figure 2 and Figure 3; Table 1 and Table 2 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Shelter Figure 2 and Figure 3; Table 1 and Table 2.

- Proof object: flow - SApp access control: SApp allocates memory -> monitor validates region -> SApp GPT grants access -> host GPT denies access -> GPC enforces on access -> SApp exits and releases


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: Shelter 把 monitor 放在 EL3，用 multi-GPT 为 host 和 SApp 提供不同物理访问视图。

- Host OS 继续管理普通应用和大部分资源。
- SApp 在 Normal world 执行，但其内存通过 S.GPT/host GPT 差异受保护。
- Monitor 负责创建、切换、验证和回收 SApp 的隔离状态。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: Shelter 把 monitor 放在 EL3，用 multi-GPT 为 host 和 SApp 提供不同物理访问视图。第一步解释为什么需要这一页: Host OS 继续管理普通应用和大部分资源。第二步说明论文或规范实际做了什么: SApp 在 Normal world 执行，但其内存通过 S.GPT/host GPT 差异受保护。第三步收束到证据边界: Monitor 负责创建、切换、验证和回收 SApp 的隔离状态。引用时只把 Shelter Figure 2 overview; Figure 3 multi-GPT design 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Shelter Figure 2 overview; Figure 3 multi-GPT design.

- Proof object: matrix - Shelter 组件: SApp = protected user-space app; Host OS = untrusted manager; EL3 Monitor = isolation controller; S.GPT = SApp-visible access; Host GPT = host no-access view


### 6. 核心方法拆解

#### 方法 1: SApp 抽象与 Threat Model

**Claim:** Shelter 把保护对象定义为用户态 SApp，而不是完整 VM 或 secure-world trusted OS。

- SApp 保护数据和代码不被 host OS、hypervisor 或 privileged software 读取/篡改。
- DoS 和某些 side channel 不作为主要目标。
- 这个抽象适合密钥处理、认证和轻量安全服务。

**讲解稿:** 讲解时先把本页结论落到一句话: Shelter 把保护对象定义为用户态 SApp，而不是完整 VM 或 secure-world trusted OS。第一步解释为什么需要这一页: SApp 保护数据和代码不被 host OS、hypervisor 或 privileged software 读取/篡改。第二步说明论文或规范实际做了什么: DoS 和某些 side channel 不作为主要目标。第三步收束到证据边界: 这个抽象适合密钥处理、认证和轻量安全服务。引用时只把 Shelter p.1-p.3 threat model and goals 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Shelter p.1-p.3 threat model and goals.

- Proof object: cards - SApp 边界: protected memory; normal-world execution; host untrusted; monitor trusted; low TCB

#### 方法 2: Multi-GPT 与 GPC Enforcement

**Claim:** 多 GPT 是 Shelter 的关键: 同一物理页在 SApp 视图可访问，在 host 视图不可访问。

- 每个 CPU core 可配置 GPC/GPT base，Shelter 利用这一点切换访问视图。
- Monitor 检查分配区域不重叠，并更新对应 GPT entries。
- GPC 让页表欺骗不能绕过物理访问权限。

**讲解稿:** 讲解时先把本页结论落到一句话: 多 GPT 是 Shelter 的关键: 同一物理页在 SApp 视图可访问，在 host 视图不可访问。第一步解释为什么需要这一页: 每个 CPU core 可配置 GPC/GPT base，Shelter 利用这一点切换访问视图。第二步说明论文或规范实际做了什么: Monitor 检查分配区域不重叠，并更新对应 GPT entries。第三步收束到证据边界: GPC 让页表欺骗不能绕过物理访问权限。引用时只把 Shelter Figure 3; Table 1 physical access permissions; Table 2 GPI encoding 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Shelter Figure 3; Table 1 physical access permissions; Table 2 GPI encoding.

- Proof object: flow - multi-GPT flow: host allocates pages -> monitor checks -> update S.GPT access -> set host GPT no-access -> run SApp -> restore on exit

#### 方法 3: 动态内存与系统交互

**Claim:** 真正难点是让 SApp 仍能使用 OS 服务，同时不把私有状态暴露给 OS。

- SApp 需要分配/释放内存、处理 syscall、与 normal world 交换非敏感数据。
- Monitor 验证 allocation result，避免 host 分配重叠或恶意页。
- 性能优化集中在减少 GPT 更新、上下文切换和跨核同步。

**讲解稿:** 讲解时先把本页结论落到一句话: 真正难点是让 SApp 仍能使用 OS 服务，同时不把私有状态暴露给 OS。第一步解释为什么需要这一页: SApp 需要分配/释放内存、处理 syscall、与 normal world 交换非敏感数据。第二步说明论文或规范实际做了什么: Monitor 验证 allocation result，避免 host 分配重叠或恶意页。第三步收束到证据边界: 性能优化集中在减少 GPT 更新、上下文切换和跨核同步。引用时只把 Shelter implementation sections; Figure 2/3 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Shelter implementation sections; Figure 2/3.

- Proof object: matrix - 交互风险: memory allocation = host may return malicious overlap; syscall = needs declassification boundary; multi-core = GPT base per core; context switch = switch cost; cleanup = avoid stale access


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** Shelter 的实验环境包括 emulator 功能验证和硬件 SoC 性能评估；它是系统论文，不是规范。

- 证据源: USENIX Security 2023 PDF，本地验证。
- 功能证据: CCA/GPT/GPC 模型、multi-GPT、SApp lifecycle。
- 性能证据: 摘要报告真实 workload 小于 15% 开销，细节见实验 section。

**讲解稿:** 讲解时先把本页结论落到一句话: Shelter 的实验环境包括 emulator 功能验证和硬件 SoC 性能评估；它是系统论文，不是规范。第一步解释为什么需要这一页: 证据源: USENIX Security 2023 PDF，本地验证。第二步说明论文或规范实际做了什么: 功能证据: CCA/GPT/GPC 模型、multi-GPT、SApp lifecycle。第三步收束到证据边界: 性能证据: 摘要报告真实 workload 小于 15% 开销，细节见实验 section。引用时只把 Shelter p.1 abstract; p.1-p.20; Figure 2/3; experiments section 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Shelter p.1 abstract; p.1-p.20; Figure 2/3; experiments section.

- Proof object: matrix - 实验/证据: 平台 = emulator + Arm hardware SoC; 对象 = SApp isolation; 关键图 = Fig.2/Fig.3; 性能 = <15% workload overhead; 边界 = 非 container/intra-process 全解


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能页可引用摘要级结论: Shelter 在真实 workload 上报告 modest overhead，小于 15%。

- 这个数字支撑 Shelter 作为轻量 user-space isolation 的可行性。
- 不能把它外推到所有 CCA deployment 或 container workload。
- 后续 RContainer/NanoZone 的比较说明更细粒度场景需要不同机制。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能页可引用摘要级结论: Shelter 在真实 workload 上报告 modest overhead，小于 15%。第一步解释为什么需要这一页: 这个数字支撑 Shelter 作为轻量 user-space isolation 的可行性。第二步说明论文或规范实际做了什么: 不能把它外推到所有 CCA deployment 或 container workload。第三步收束到证据边界: 后续 RContainer/NanoZone 的比较说明更细粒度场景需要不同机制。引用时只把 Shelter p.1 abstract reports <15% overhead; implementation/evaluation sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Shelter p.1 abstract reports <15% overhead; implementation/evaluation sections.

- Proof object: bars - Shelter 性能读法: reported workload overhead <15%; mechanism novelty 高; container coverage 低; intra-process switching 低


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: Shelter 是 CCA 细粒度隔离的起点，优势是轻量；局限是粒度和系统服务边界仍有限。

- 优势: 不需要完整 trusted OS，复用 CCA/GPC/GPT，机制边界容易理解。
- 局限: SApp 抽象不是完整容器，系统调用和 I/O 仍需谨慎设计。
- 商业化潜力: 适合设备内密钥服务、轻量安全模块和 CCA 用户态 SDK。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: Shelter 是 CCA 细粒度隔离的起点，优势是轻量；局限是粒度和系统服务边界仍有限。第一步解释为什么需要这一页: 优势: 不需要完整 trusted OS，复用 CCA/GPC/GPT，机制边界容易理解。第二步说明论文或规范实际做了什么: 局限: SApp 抽象不是完整容器，系统调用和 I/O 仍需谨慎设计。第三步收束到证据边界: 商业化潜力: 适合设备内密钥服务、轻量安全模块和 CCA 用户态 SDK。引用时只把 Shelter conclusion; README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Shelter conclusion; README evaluation.

- Proof object: matrix - 评价: 优势 = lightweight CCA user-space TEE; 局限 = 非容器/非进程内通用隔离; 商业化 = secure app SDK; 本方向角色 = foundation


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
