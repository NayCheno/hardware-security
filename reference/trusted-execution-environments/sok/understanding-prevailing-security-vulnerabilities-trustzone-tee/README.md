# SoK: Understanding the Prevailing Security Vulnerabilities in TrustZone-assisted TEE Systems

- BibTeX key: `cerdeira2020trustzone`
- Category: `trusted-execution-environments/sok`
- Authors: David Cerdeira et al.
- Year: 2020
- Source: https://doi.org/10.1109/SP40000.2020.00061
- PDF source: https://www.cs.purdue.edu/homes/pfonseca/papers/sp2020-tees.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Evidence role: Peer-reviewed SOTA. Use for the specific mechanism, evaluation, and threat-model scope established by the source; avoid broader claims outside its evidence class.
<!-- BEGIN PAPER REVIEW -->
## Paper Review
Canonical BibTeX key: `cerdeira2020trustzone`. Evidence role: Peer-reviewed SOTA. Use for the specific mechanism, evaluation, and threat-model scope established by the source; avoid broader claims outside its evidence class.

This README records the source/PDF availability above and should be treated as the local evidence-status record for SoK: Understanding the Prevailing Security Vulnerabilities in TrustZone-assisted TEE Systems. When citing this reference in the survey正文, keep the claim within the stated evidence role and cite stronger primary or official sources for mechanism details outside this source's scope.

### 13. SoK Citation Expansion

| Priority | Cited work | Role in SoK | Repo category | Local status | Next action |
|---|---|---|---|---|---|
| P0 | TrustZone architecture and Arm TrustZone whitepaper | TrustZone mechanism foundation | `reference/trusted-execution-environments/arm-security-technology-trustzone/` | existing, local PDF verified | Use as historical/vendor foundation only. |
| P0 | Demystifying Arm TrustZone | Peer-reviewed TrustZone survey bridge | `reference/trusted-execution-environments/demystifying-arm-trustzone-comprehensive-survey/` | existing, local PDF verified | Use for TrustZone background; not CCA claims. |
| P1 | TrustShadow | Representative TrustZone-assisted TEE system | `reference/trusted-execution-environments/trustshadow-secure-execution-unmodified-applications-arm-trustzone/` | existing, local PDF verified | Use as lineage example. |
| P2 boundary | TrustZone vulnerability and exploit papers | Vulnerability taxonomy evidence | `survey/excluded_attack_reference.bib` where retained | out-of-scope for current defense/spec corpus | Do not expand into attack survey unless scope changes. |
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `02-trustzone-lineage` - Arm TrustZone TEE 与漏洞谱系
- Paper key: `cerdeira2020trustzone`
- Role: TrustZone vulnerability SoK
- Evidence base: Cerdeira 2020 local PDF; Figure 1/2 architecture; Table I and vulnerability taxonomy.
- Boundary: 只支撑 TrustZone 漏洞谱系；不能推导 CCA/RME 一定存在相同漏洞。

### 1. 完整题目 / 作者 / 会议

- 完整题目: SoK: Understanding the Prevailing Security Vulnerabilities in TrustZone-assisted TEE Systems
- 作者: David Cerdeira, Nuno Santos, Pedro Fonseca, Sandro Pinto
- 会议/来源: IEEE Symposium on Security and Privacy (S&P) 2020
- Title evidence: S&P 2020 paper title page; README metadata.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** 这篇 SoK 的贡献是说明: TrustZone 有硬件隔离不等于 TEE 系统没有漏洞。

- 动机: 数亿设备依赖 TrustZone TEE 保护 keystore、DRM、支付等敏感任务，但公开漏洞不断出现。
- 工作: 系统化收集 disclosed vulnerabilities，分析 trusted OS、TA、driver、API 和 exploit chain。
- 数据: Figure 1/2 展示软件架构，表格和案例把漏洞映射到组件与根因。

**讲解稿:** 讲解时先把本页结论落到一句话: 这篇 SoK 的贡献是说明: TrustZone 有硬件隔离不等于 TEE 系统没有漏洞。第一步解释为什么需要这一页: 动机: 数亿设备依赖 TrustZone TEE 保护 keystore、DRM、支付等敏感任务，但公开漏洞不断出现。第二步说明论文或规范实际做了什么: 工作: 系统化收集 disclosed vulnerabilities，分析 trusted OS、TA、driver、API 和 exploit chain。第三步收束到证据边界: 数据: Figure 1/2 展示软件架构，表格和案例把漏洞映射到组件与根因。引用时只把 Cerdeira 2020 p.1 abstract; Figure 1 software architecture; Figure 2 detailed architecture; Table I 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Cerdeira 2020 p.1 abstract; Figure 1 software architecture; Figure 2 detailed architecture; Table I.

- Proof object: flow - 漏洞 SoK 分析线: collect disclosures -> map to TEE architecture -> classify components -> identify root causes -> build exploit chain -> derive lessons


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 研究背景是 TrustZone-assisted TEE 的接口太多: normal world 可以不断向 secure world 发送命令和共享数据。

- Trusted OS 和 TA 被认为可信，但实际包含复杂 parser、IPC、driver 和 vendor code。
- Normal-world client/driver 可能被 attacker 控制，输入校验和共享内存边界成为关键。
- 供应链和闭源生态让漏洞修复、审计和版本追踪更困难。

**讲解稿:** 讲解时先把本页结论落到一句话: 研究背景是 TrustZone-assisted TEE 的接口太多: normal world 可以不断向 secure world 发送命令和共享数据。第一步解释为什么需要这一页: Trusted OS 和 TA 被认为可信，但实际包含复杂 parser、IPC、driver 和 vendor code。第二步说明论文或规范实际做了什么: Normal-world client/driver 可能被 attacker 控制，输入校验和共享内存边界成为关键。第三步收束到证据边界: 供应链和闭源生态让漏洞修复、审计和版本追踪更困难。引用时只把 Cerdeira 2020 Figure 1 and Figure 2; overview sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Cerdeira 2020 Figure 1 and Figure 2; overview sections.

- Proof object: matrix - 主要攻击面: Client API = malicious normal-world input; Shared memory = TOCTOU / validation gap; Trusted OS = kernel/service bug; Trusted App = parser and logic bug; Driver = device-specific privileged code


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: TrustZone 漏洞通常不是 NS bit 失效，而是 secure-world 软件把不可信输入当成可信上下文处理。

- 攻击者常先控制 normal OS，再利用 TEE driver/API 触发 secure world bug。
- 漏洞链可以从一个 TA 扩展到 trusted OS，再影响密钥、secure storage 或其他 TA。
- 这就是后续 CCA/RME 强调更小管理面、更清晰 ownership 和 attestable lifecycle 的原因之一。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: TrustZone 漏洞通常不是 NS bit 失效，而是 secure-world 软件把不可信输入当成可信上下文处理。第一步解释为什么需要这一页: 攻击者常先控制 normal OS，再利用 TEE driver/API 触发 secure world bug。第二步说明论文或规范实际做了什么: 漏洞链可以从一个 TA 扩展到 trusted OS，再影响密钥、secure storage 或其他 TA。第三步收束到证据边界: 这就是后续 CCA/RME 强调更小管理面、更清晰 ownership 和 attestable lifecycle 的原因之一。引用时只把 Cerdeira 2020 overview and vulnerability taxonomy sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Cerdeira 2020 overview and vulnerability taxonomy sections.

- Proof object: flow - 典型攻击链: compromise normal world -> send crafted TEE command -> abuse shared memory -> trigger TA/TEE OS bug -> escalate inside secure world -> extract/modify protected asset


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览应重画为 normal world clients、TEE driver、secure monitor、TEE OS、TA 和安全外设。

- Figure 1 给出 TrustZone-assisted TEE 软件结构。
- Figure 2 展示多个 commercial TEE 的共同组件和差异。
- 漏洞分类要绑定到组件，否则只能得到泛泛的“TEE 不安全”。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览应重画为 normal world clients、TEE driver、secure monitor、TEE OS、TA 和安全外设。第一步解释为什么需要这一页: Figure 1 给出 TrustZone-assisted TEE 软件结构。第二步说明论文或规范实际做了什么: Figure 2 展示多个 commercial TEE 的共同组件和差异。第三步收束到证据边界: 漏洞分类要绑定到组件，否则只能得到泛泛的“TEE 不安全”。引用时只把 Cerdeira 2020 Figure 1 and Figure 2 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Cerdeira 2020 Figure 1 and Figure 2.

- Proof object: matrix - 组件到风险: Normal world = attacker-controlled client; TEE driver = command marshal/unmarshal; Secure monitor = world switch boundary; TEE OS = high-value kernel TCB; TA = vendor/service-specific parser


### 6. 核心方法拆解

#### 方法 1: 公开漏洞收集与归一化

**Claim:** SoK 先把分散 CVE、报告和 exploit 整理成可比较的数据集。

- 不同厂商、TEE OS 和版本的漏洞命名不统一。
- 作者把漏洞映射到组件、权限、攻击前提和安全影响。
- 这种归一化让论文能从个案推导设计教训。

**讲解稿:** 讲解时先把本页结论落到一句话: SoK 先把分散 CVE、报告和 exploit 整理成可比较的数据集。第一步解释为什么需要这一页: 不同厂商、TEE OS 和版本的漏洞命名不统一。第二步说明论文或规范实际做了什么: 作者把漏洞映射到组件、权限、攻击前提和安全影响。第三步收束到证据边界: 这种归一化让论文能从个案推导设计教训。引用时只把 Cerdeira 2020 methodology and Table I 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Cerdeira 2020 methodology and Table I.

- Proof object: cards - 归一化字段: vendor; TEE component; entry point; root cause; impact; exploit precondition

#### 方法 2: 组件级 Root-Cause Taxonomy

**Claim:** 漏洞根因被放回 TEE 架构，而不是只按 CWE 标签罗列。

- TA parser 和 command handlers 易受 untrusted input 影响。
- TEE OS service/driver bug 影响范围更大。
- 共享内存、object handle 和权限检查是反复出现的边界错误。

**讲解稿:** 讲解时先把本页结论落到一句话: 漏洞根因被放回 TEE 架构，而不是只按 CWE 标签罗列。第一步解释为什么需要这一页: TA parser 和 command handlers 易受 untrusted input 影响。第二步说明论文或规范实际做了什么: TEE OS service/driver bug 影响范围更大。第三步收束到证据边界: 共享内存、object handle 和权限检查是反复出现的边界错误。引用时只把 Cerdeira 2020 vulnerability taxonomy sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Cerdeira 2020 vulnerability taxonomy sections.

- Proof object: matrix - 根因到后果: Input validation = TA compromise; Memory safety = code execution; Access control = cross-TA / service abuse; Shared memory = TOCTOU / confused deputy; Update/patch = long-lived exposure

#### 方法 3: Exploit Chain 与设计教训

**Claim:** SoK 的价值是说明小漏洞如何沿 TEE 组件串成高影响攻击链。

- Normal world bug 不一定直接拿到密钥，但可作为进入 TEE API 的起点。
- TA compromise 可进一步攻击 TEE OS 或其他 trusted service。
- 设计教训是缩小 TCB、隔离 TA、限制共享内存和强化接口验证。

**讲解稿:** 讲解时先把本页结论落到一句话: SoK 的价值是说明小漏洞如何沿 TEE 组件串成高影响攻击链。第一步解释为什么需要这一页: Normal world bug 不一定直接拿到密钥，但可作为进入 TEE API 的起点。第二步说明论文或规范实际做了什么: TA compromise 可进一步攻击 TEE OS 或其他 trusted service。第三步收束到证据边界: 设计教训是缩小 TCB、隔离 TA、限制共享内存和强化接口验证。引用时只把 Cerdeira 2020 exploit examples and lessons sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Cerdeira 2020 exploit examples and lessons sections.

- Proof object: flow - 从 bug 到资产泄露: normal-world foothold -> TEE command abuse -> TA memory corruption -> trusted OS primitive -> secure storage/key access -> persistent impact


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** 这是 peer-reviewed SoK，实验环境是公开漏洞 corpus 和架构归纳，而不是新 TEE 实现。

- 证据源: IEEE S&P 2020 PDF，本地验证。
- 核心对象: commercial TrustZone-assisted TEEs、公开漏洞、架构组件和攻击案例。
- 边界: 不能把 TrustZone 漏洞直接写成 CCA/RME 的一手证据，只能作为迁移动机。

**讲解稿:** 讲解时先把本页结论落到一句话: 这是 peer-reviewed SoK，实验环境是公开漏洞 corpus 和架构归纳，而不是新 TEE 实现。第一步解释为什么需要这一页: 证据源: IEEE S&P 2020 PDF，本地验证。第二步说明论文或规范实际做了什么: 核心对象: commercial TrustZone-assisted TEEs、公开漏洞、架构组件和攻击案例。第三步收束到证据边界: 边界: 不能把 TrustZone 漏洞直接写成 CCA/RME 的一手证据，只能作为迁移动机。引用时只把 pdfinfo; Cerdeira 2020 p.1-p.18 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** pdfinfo; Cerdeira 2020 p.1-p.18.

- Proof object: matrix - 证据边界: 可支撑 = TrustZone vulnerability taxonomy; 不能支撑 = CCA/RME vulnerability proof; 实验 = 无新系统 benchmark; 用法 = 漏洞谱系和设计教训


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能页应写成风险覆盖页: 论文关注漏洞和攻击面，不测 latency/throughput。

- 没有可引用的系统性能结论。
- 可视化应展示 claim strength: 漏洞分类强，性能 claim 弱。
- 商业风险来自 patch lag、闭源 TCB 和 vendor-specific TA 生态。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能页应写成风险覆盖页: 论文关注漏洞和攻击面，不测 latency/throughput。第一步解释为什么需要这一页: 没有可引用的系统性能结论。第二步说明论文或规范实际做了什么: 可视化应展示 claim strength: 漏洞分类强，性能 claim 弱。第三步收束到证据边界: 商业风险来自 patch lag、闭源 TCB 和 vendor-specific TA 生态。引用时只把 Cerdeira 2020 SoK scope; no benchmark section 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Cerdeira 2020 SoK scope; no benchmark section.

- Proof object: bars - claim strength: 漏洞 taxonomy 高; 攻击案例 高; 性能评估 无; CCA 外推 低


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: 这篇 SoK 是 TrustZone 方向最重要的反面教材，说明硬件隔离必须配合小 TCB 和严格接口。

- 优势: 把真实漏洞放回架构组件，容易看出“错在哪里”。
- 局限: 依赖公开披露，闭源系统和未公开漏洞覆盖不足。
- 商业化潜力: 可转化为 TEE audit checklist、TA sandboxing 需求和 CCA 迁移论据。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: 这篇 SoK 是 TrustZone 方向最重要的反面教材，说明硬件隔离必须配合小 TCB 和严格接口。第一步解释为什么需要这一页: 优势: 把真实漏洞放回架构组件，容易看出“错在哪里”。第二步说明论文或规范实际做了什么: 局限: 依赖公开披露，闭源系统和未公开漏洞覆盖不足。第三步收束到证据边界: 商业化潜力: 可转化为 TEE audit checklist、TA sandboxing 需求和 CCA 迁移论据。引用时只把 Cerdeira 2020 conclusion; README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Cerdeira 2020 conclusion; README evaluation.

- Proof object: matrix - 评价: 优势 = 漏洞和组件绑定清楚; 局限 = 公开披露偏差; 商业化 = 审计/迁移 checklist; 本报告角色 = TrustZone 风险谱系


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
