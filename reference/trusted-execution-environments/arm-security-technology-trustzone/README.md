# ARM Security Technology: Building a Secure System Using TrustZone Technology

- BibTeX key: `arm_trustzone_whitepaper`
- Category: `trusted-execution-environments`
- Authors: ARM Limited
- Year: 2009
- Source: https://developer.arm.com/documentation/PRD29-GENC-009492/c?lang=en
- PDF source: https://documentation-service.arm.com/static/5f212796500e883ab8e74531
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12 from Arm documentation-service static PDF for PRD29-GENC-009492C

- Evidence role: Foundational. Use as a foundational entry point for this survey lane; later SOTA, specification, or implementation details should be cited separately when making narrow claims.
<!-- BEGIN PAPER REVIEW -->
## Paper Review
Canonical BibTeX key: `arm_trustzone_whitepaper`. Evidence role: Foundational. Use as a foundational entry point for this survey lane; later SOTA, specification, or implementation details should be cited separately when making narrow claims.

This README records the source/PDF availability above and should be treated as the local evidence-status record for ARM Security Technology: Building a Secure System Using TrustZone Technology. When citing this reference in the survey正文, keep the claim within the stated evidence role and cite stronger primary or official sources for mechanism details outside this source's scope.
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `02-trustzone-lineage` - Arm TrustZone TEE 与漏洞谱系
- Paper key: `arm_trustzone_whitepaper`
- Role: foundational mechanism source
- Evidence base: Arm whitepaper PDF p.1-p.109; Figure 1-1, Figure 2-1, Figure 3-1.
- Boundary: 只支撑 TrustZone 基础模型；不能当作 CCA/RME/RMM 或云 CVM threat model。

### 1. 完整题目 / 作者 / 会议

- 完整题目: ARM Security Technology: Building a Secure System Using TrustZone Technology
- 作者: ARM Limited
- 会议/来源: Arm white paper, 2009
- Title evidence: README metadata; Arm TrustZone whitepaper title page.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** 白皮书的贡献是把安全从 CPU 指令扩展到 SoC 级资源标记: 每个总线 transaction 都带着安全状态。

- 动机: 移动/嵌入式系统要把 DRM、密钥、支付、启动和安全外设从普通 OS 中隔离出来。
- 工作: 定义 Secure world / Non-secure world、NS bit、secure monitor、secure interrupt 和安全外设访问控制。
- 数据: 它是 vendor architecture whitepaper，无实验数据；价值是机制定义和图示。

**讲解稿:** 讲解时先把本页结论落到一句话: 白皮书的贡献是把安全从 CPU 指令扩展到 SoC 级资源标记: 每个总线 transaction 都带着安全状态。第一步解释为什么需要这一页: 动机: 移动/嵌入式系统要把 DRM、密钥、支付、启动和安全外设从普通 OS 中隔离出来。第二步说明论文或规范实际做了什么: 工作: 定义 Secure world / Non-secure world、NS bit、secure monitor、secure interrupt 和安全外设访问控制。第三步收束到证据边界: 数据: 它是 vendor architecture whitepaper，无实验数据；价值是机制定义和图示。引用时只把 Arm TrustZone whitepaper p.1-p.3 security concepts; Figure 2-1 SoC example; Figure 3-1 processor modes 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Arm TrustZone whitepaper p.1-p.3 security concepts; Figure 2-1 SoC example; Figure 3-1 processor modes.

- Proof object: flow - TrustZone 基础路径: asset -> secure world -> NS bit -> secure monitor -> secure peripheral -> normal world OS


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** TrustZone 诞生背景不是云多租户，而是单设备内把安全服务和 rich OS 分开。

- 普通 OS 复杂、易被攻破；但系统仍需要显示、键盘、存储、基带、安全启动等安全敏感服务。
- 安全边界必须跨 CPU、cache/TLB、内存控制器、DMA、debug 和 interrupt，而不能只在软件进程层做隔离。
- 这解释了 TrustZone 为什么强调 SoC integration，而不是只定义一个 enclave 指令集。

**讲解稿:** 讲解时先把本页结论落到一句话: TrustZone 诞生背景不是云多租户，而是单设备内把安全服务和 rich OS 分开。第一步解释为什么需要这一页: 普通 OS 复杂、易被攻破；但系统仍需要显示、键盘、存储、基带、安全启动等安全敏感服务。第二步说明论文或规范实际做了什么: 安全边界必须跨 CPU、cache/TLB、内存控制器、DMA、debug 和 interrupt，而不能只在软件进程层做隔离。第三步收束到证据边界: 这解释了 TrustZone 为什么强调 SoC integration，而不是只定义一个 enclave 指令集。引用时只把 Arm TrustZone whitepaper p.1-p.2 security concepts; p.2 Figure 2-1 cellular handset SoC 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Arm TrustZone whitepaper p.1-p.2 security concepts; p.2 Figure 2-1 cellular handset SoC.

- Proof object: matrix - TrustZone 要保护的对象: 密钥/证书 = Secure storage 或 crypto service; 安全外设 = secure display / keypad / sensor; 启动链 = secure boot and firmware; 普通 OS = 视为可被攻破的 non-secure software


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心思想是把系统状态二分: Secure transaction 可以访问安全资源，Non-secure transaction 被硬件拒绝。

- NS bit 是理解 TrustZone 最直接的抓手: 它让总线和外设知道一次访问来自哪个 world。
- Secure monitor 是世界切换入口，负责保存/恢复上下文，并让普通 OS 无法直接进入 secure services。
- 缺点也很清楚: 一旦 trusted OS/TA/monitor 变复杂，TrustZone 的硬件边界无法自动修复软件漏洞。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心思想是把系统状态二分: Secure transaction 可以访问安全资源，Non-secure transaction 被硬件拒绝。第一步解释为什么需要这一页: NS bit 是理解 TrustZone 最直接的抓手: 它让总线和外设知道一次访问来自哪个 world。第二步说明论文或规范实际做了什么: Secure monitor 是世界切换入口，负责保存/恢复上下文，并让普通 OS 无法直接进入 secure services。第三步收束到证据边界: 缺点也很清楚: 一旦 trusted OS/TA/monitor 变复杂，TrustZone 的硬件边界无法自动修复软件漏洞。引用时只把 Arm TrustZone whitepaper Figure 3-1; processor security state and monitor mode discussion 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Arm TrustZone whitepaper Figure 3-1; processor security state and monitor mode discussion.

- Proof object: flow - Secure state propagation: CPU security state -> NS bit on transactions -> interconnect checks -> memory/peripheral access -> secure monitor call -> trusted service


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览是“双世界 + monitor + secure peripherals”: 普通 OS 仍运行大多数功能，安全服务在 secure world 中响应请求。

- CPU 支持安全状态和 monitor mode；普通世界通过 SMC 请求安全服务。
- 内存和外设由 TZASC/TZPC 等控制器按安全属性隔离，DMA 也必须遵守安全状态。
- 中断和 debug 路径需要独立处理，否则 non-secure world 可以观察或打断 secure execution。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览是“双世界 + monitor + secure peripherals”: 普通 OS 仍运行大多数功能，安全服务在 secure world 中响应请求。第一步解释为什么需要这一页: CPU 支持安全状态和 monitor mode；普通世界通过 SMC 请求安全服务。第二步说明论文或规范实际做了什么: 内存和外设由 TZASC/TZPC 等控制器按安全属性隔离，DMA 也必须遵守安全状态。第三步收束到证据边界: 中断和 debug 路径需要独立处理，否则 non-secure world 可以观察或打断 secure execution。引用时只把 Arm TrustZone whitepaper Figure 2-1 and Figure 3-1; chapters on memory, peripherals, interrupts, debug 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Arm TrustZone whitepaper Figure 2-1 and Figure 3-1; chapters on memory, peripherals, interrupts, debug.

- Proof object: matrix - TrustZone 组件视图: CPU = secure/non-secure state, monitor mode; Interconnect = propagates NS bit; Memory controller = secure region access control; Peripheral = secure-only or non-secure accessible; Monitor = world switch and context management


### 6. 核心方法拆解

#### 方法 1: Secure / Non-secure World

**Claim:** 双世界模型让普通 OS 和安全服务共享 CPU，但硬件状态决定资源可见性。

- Secure world 可以运行 trusted OS/firmware/TA；Non-secure world 运行 rich OS 和应用。
- 世界切换不是进程切换，而是更底层的安全状态切换。
- 这个模型简单直观，但 trusted side 过大时仍会累积漏洞。

**讲解稿:** 讲解时先把本页结论落到一句话: 双世界模型让普通 OS 和安全服务共享 CPU，但硬件状态决定资源可见性。第一步解释为什么需要这一页: Secure world 可以运行 trusted OS/firmware/TA；Non-secure world 运行 rich OS 和应用。第二步说明论文或规范实际做了什么: 世界切换不是进程切换，而是更底层的安全状态切换。第三步收束到证据边界: 这个模型简单直观，但 trusted side 过大时仍会累积漏洞。引用时只把 Arm TrustZone whitepaper processor security state sections; Figure 3-1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Arm TrustZone whitepaper processor security state sections; Figure 3-1.

- Proof object: flow - world switch: normal app -> SMC -> secure monitor -> trusted service -> return to normal world

#### 方法 2: NS Bit 与 SoC Security State

**Claim:** TrustZone 真正的硬件价值在于把安全属性带到总线和外设路径。

- NS bit 附着在总线 transaction 上，内存控制器和外设据此决定是否授权。
- 安全内存、外设、DMA 和 interrupt 都要按这个状态检查。
- 如果某个外设或 DMA path 没有正确接入安全状态，就会破坏隔离。

**讲解稿:** 讲解时先把本页结论落到一句话: TrustZone 真正的硬件价值在于把安全属性带到总线和外设路径。第一步解释为什么需要这一页: NS bit 附着在总线 transaction 上，内存控制器和外设据此决定是否授权。第二步说明论文或规范实际做了什么: 安全内存、外设、DMA 和 interrupt 都要按这个状态检查。第三步收束到证据边界: 如果某个外设或 DMA path 没有正确接入安全状态，就会破坏隔离。引用时只把 Arm TrustZone whitepaper Figure 2-1; memory/peripheral security chapters 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Arm TrustZone whitepaper Figure 2-1; memory/peripheral security chapters.

- Proof object: matrix - NS bit 检查点: CPU = 生成安全状态; Bus = 携带 transaction 属性; Memory = 拒绝 non-secure 访问 secure region; Peripheral = 只接受 secure transaction; DMA = 必须被同样约束

#### 方法 3: Secure Monitor / Interrupt / Debug

**Claim:** monitor、interrupt 和 debug 是 TrustZone 能否落地的控制面。

- Secure monitor 保存/恢复两个世界的上下文。
- FIQ/IRQ 路由影响安全任务是否能被普通世界干扰。
- debug/trace 必须锁定，否则攻击者可绕过软件隔离直接观察 secure world。

**讲解稿:** 讲解时先把本页结论落到一句话: monitor、interrupt 和 debug 是 TrustZone 能否落地的控制面。第一步解释为什么需要这一页: Secure monitor 保存/恢复两个世界的上下文。第二步说明论文或规范实际做了什么: FIQ/IRQ 路由影响安全任务是否能被普通世界干扰。第三步收束到证据边界: debug/trace 必须锁定，否则攻击者可绕过软件隔离直接观察 secure world。引用时只把 Arm TrustZone whitepaper monitor, interrupt and debug discussions 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Arm TrustZone whitepaper monitor, interrupt and debug discussions.

- Proof object: cards - 控制面检查表: SMC entry; context save/restore; secure interrupt routing; debug lockdown; secure boot handoff


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** 这是 vendor whitepaper，没有实验环境；应把它作为机制定义和历史背景，而不是性能或安全证明。

- 证据源: Arm 官方 PDF，本地已验证。
- 可支撑: TrustZone 基础术语、SoC 级安全状态传播、双世界模型。
- 不能支撑: CCA/RME/RMM、商业 TEE 具体实现安全性、漏洞统计或性能开销。

**讲解稿:** 讲解时先把本页结论落到一句话: 这是 vendor whitepaper，没有实验环境；应把它作为机制定义和历史背景，而不是性能或安全证明。第一步解释为什么需要这一页: 证据源: Arm 官方 PDF，本地已验证。第二步说明论文或规范实际做了什么: 可支撑: TrustZone 基础术语、SoC 级安全状态传播、双世界模型。第三步收束到证据边界: 不能支撑: CCA/RME/RMM、商业 TEE 具体实现安全性、漏洞统计或性能开销。引用时只把 pdfinfo; Arm TrustZone whitepaper p.1-p.109 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** pdfinfo; Arm TrustZone whitepaper p.1-p.109.

- Proof object: matrix - 证据边界: 可支撑 = mechanism vocabulary; 不能支撑 = CCA/cloud CVM guarantees; 实验 = 论文未提供; PPT 用法 = 背景和架构页


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能页应写成“无新实验”: 白皮书没有 benchmark，只能说明 TrustZone 把检查放进硬件路径以降低软件隔离成本。

- 不要为白皮书补造 latency 或 overhead 数字。
- 可以讨论 qualitative trade-off: 硬件状态传播降低软件检查复杂度，但 secure world TCB 和 world switch 仍有工程成本。
- 真实性能需要引用具体 TEE OS/SoC/系统论文。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能页应写成“无新实验”: 白皮书没有 benchmark，只能说明 TrustZone 把检查放进硬件路径以降低软件隔离成本。第一步解释为什么需要这一页: 不要为白皮书补造 latency 或 overhead 数字。第二步说明论文或规范实际做了什么: 可以讨论 qualitative trade-off: 硬件状态传播降低软件检查复杂度，但 secure world TCB 和 world switch 仍有工程成本。第三步收束到证据边界: 真实性能需要引用具体 TEE OS/SoC/系统论文。引用时只把 Arm TrustZone whitepaper is architecture/vendor evidence; no benchmark table 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Arm TrustZone whitepaper is architecture/vendor evidence; no benchmark table.

- Proof object: bars - claim strength: 机制定义 高; 性能数字 无; CCA 适用性 低; 历史背景 高


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: TrustZone 是 Arm TEE 的历史根基，但它的双世界模型不能直接满足云 confidential VM 的隔离需求。

- 优势: 简单、部署广、SoC 集成强，适合保护设备内密钥和安全服务。
- 局限: secure world TCB 容易变大，TA/driver/API 漏洞会击穿安全服务。
- 商业化潜力: 已长期服务移动和嵌入式生态；未来价值主要在和 CCA/RME 形成历史对照。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: TrustZone 是 Arm TEE 的历史根基，但它的双世界模型不能直接满足云 confidential VM 的隔离需求。第一步解释为什么需要这一页: 优势: 简单、部署广、SoC 集成强，适合保护设备内密钥和安全服务。第二步说明论文或规范实际做了什么: 局限: secure world TCB 容易变大，TA/driver/API 漏洞会击穿安全服务。第三步收束到证据边界: 商业化潜力: 已长期服务移动和嵌入式生态；未来价值主要在和 CCA/RME 形成历史对照。引用时只把 README evaluation; Arm TrustZone whitepaper architecture scope 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** README evaluation; Arm TrustZone whitepaper architecture scope.

- Proof object: matrix - 评价: 优势 = 成熟双世界硬件模型; 局限 = TCB 和接口复杂; 商业化 = 移动/嵌入式长期落地; 本报告角色 = CCA 前史与边界对照


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
