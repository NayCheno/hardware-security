# SWATT: softWare-based attestation for embedded devices

- BibTeX key: `seshadri2004swatt`
- Category: `attestation`
- Authors: A. Seshadri et al.
- Year: 2004
- Source: https://doi.org/10.1109/SECPRI.2004.1301329
- PDF source: https://users.ece.cmu.edu/~adrian/projects/swatt.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified

- Evidence role: Foundational. Use as a foundational entry point for this survey lane; later SOTA, specification, or implementation details should be cited separately when making narrow claims.
<!-- BEGIN PAPER REVIEW -->
## Paper Review
Canonical BibTeX key: `seshadri2004swatt`. Evidence role: Foundational. Use as a foundational entry point for this survey lane; later SOTA, specification, or implementation details should be cited separately when making narrow claims.

This README records the source/PDF availability above and should be treated as the local evidence-status record for SWATT: softWare-based attestation for embedded devices. When citing this reference in the survey正文, keep the claim within the stated evidence role and cite stronger primary or official sources for mechanism details outside this source's scope.
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `06-attestation-boot-lifecycle` - Attestation、Boot、Lifecycle
- Paper key: `seshadri2004swatt`
- Role: foundational software attestation
- Evidence base: SWATT local PDF p.1-p.12; Figure 1 memory verification attack; Figure 2 external memory verification.
- Boundary: 适用于受限嵌入式假设；不适合直接作为现代 TEE/CVM attestation 充分证据。

### 1. 完整题目 / 作者 / 会议

- 完整题目: SWATT: Software-based Attestation for Embedded Devices
- 作者: A. Seshadri et al.
- 会议/来源: IEEE Symposium on Security and Privacy, 2004
- Title evidence: SWATT title page and README metadata.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** SWATT 的贡献是把 attestation 作为 challenge-response memory verification 问题提出。

- 动机: 低成本嵌入式设备没有 TPM/secure coprocessor，但 verifier 仍想知道 memory 是否被篡改。
- 工作: 设计 software verification procedure，让 verifier 根据 challenge、expected memory 和 timing 判断设备状态。
- 数据: 论文以嵌入式 memory architecture 与 timing 假设为核心，没有现代 TEE benchmark。

**讲解稿:** 讲解时先把本页结论落到一句话: SWATT 的贡献是把 attestation 作为 challenge-response memory verification 问题提出。第一步解释为什么需要这一页: 动机: 低成本嵌入式设备没有 TPM/secure coprocessor，但 verifier 仍想知道 memory 是否被篡改。第二步说明论文或规范实际做了什么: 工作: 设计 software verification procedure，让 verifier 根据 challenge、expected memory 和 timing 判断设备状态。第三步收束到证据边界: 数据: 论文以嵌入式 memory architecture 与 timing 假设为核心，没有现代 TEE benchmark。引用时只把 SWATT p.1 introduction; Figure 1; Figure 2 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SWATT p.1 introduction; Figure 1; Figure 2.

- Proof object: flow - SWATT 管线: verifier sends random challenge -> device runs checksum over memory -> response returns within timing bound -> verifier recomputes expected response -> mismatch or delay indicates compromise


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是 verifier 不能直接读取设备 memory，只能让可能已被攻破的设备自证。

- 简单 hash/MAC 会被 malware 通过保存 clean copy、搬移恶意代码或延迟计算绕过。
- SWATT 依赖小型 MCU、已知 clock/memory architecture 和无虚拟内存等假设。
- 这个背景解释了后续 RA 为什么要加入硬件 root of trust。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是 verifier 不能直接读取设备 memory，只能让可能已被攻破的设备自证。第一步解释为什么需要这一页: 简单 hash/MAC 会被 malware 通过保存 clean copy、搬移恶意代码或延迟计算绕过。第二步说明论文或规范实际做了什么: SWATT 依赖小型 MCU、已知 clock/memory architecture 和无虚拟内存等假设。第三步收束到证据边界: 这个背景解释了后续 RA 为什么要加入硬件 root of trust。引用时只把 SWATT problem definition; Figure 1 memory verification attack 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SWATT problem definition; Figure 1 memory verification attack.

- Proof object: matrix - SWATT 假设: 设备 = low-end embedded; verifier = knows expected memory; attacker = software compromise; 关键约束 = timing + architecture; 排除 = hardware modification


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: 软件 attestation 的安全性不仅看 response 是否正确，还看 response 是否按预期时间产生。

- 如果 attacker 把恶意代码藏到别处再计算 clean memory hash，时间会变慢。
- Verification routine 必须遍历 memory，减少 attacker 预测和跳过。
- 这种 timing assumption 是强限制，也是 SWATT 后续被硬件 RA 替代的重要原因。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: 软件 attestation 的安全性不仅看 response 是否正确，还看 response 是否按预期时间产生。第一步解释为什么需要这一页: 如果 attacker 把恶意代码藏到别处再计算 clean memory hash，时间会变慢。第二步说明论文或规范实际做了什么: Verification routine 必须遍历 memory，减少 attacker 预测和跳过。第三步收束到证据边界: 这种 timing assumption 是强限制，也是 SWATT 后续被硬件 RA 替代的重要原因。引用时只把 SWATT design sections; Figure 2 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SWATT design sections; Figure 2.

- Proof object: flow - timing security: random challenge -> memory traversal -> tight checksum loop -> expected execution time -> response check -> delay detection


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览是 verifier 与 prover 的外部 memory verification protocol。

- Verifier 持有 expected memory image 和 challenge。
- Prover 运行 verification code 并返回 response。
- 没有硬件 key isolation；可信性来自 timing、architecture knowledge 和 communication assumption。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览是 verifier 与 prover 的外部 memory verification protocol。第一步解释为什么需要这一页: Verifier 持有 expected memory image 和 challenge。第二步说明论文或规范实际做了什么: Prover 运行 verification code 并返回 response。第三步收束到证据边界: 没有硬件 key isolation；可信性来自 timing、architecture knowledge 和 communication assumption。引用时只把 SWATT Figure 2 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SWATT Figure 2.

- Proof object: matrix - RA 角色雏形: Verifier = expected memory + challenge; Prover = untrusted embedded device; Evidence = timed checksum response; Secret = none / software-only; Risk = strong assumptions


### 6. 核心方法拆解

#### 方法 1: Challenge-Response Memory Checksum

**Claim:** SWATT 把 memory attestation 设计成一次随机挑战驱动的 checksum。

- Challenge 防止预计算 response。
- Checksum 覆盖 code/static data/config。
- Verifier 本地重算 expected response。

**讲解稿:** 讲解时先把本页结论落到一句话: SWATT 把 memory attestation 设计成一次随机挑战驱动的 checksum。第一步解释为什么需要这一页: Challenge 防止预计算 response。第二步说明论文或规范实际做了什么: Checksum 覆盖 code/static data/config。第三步收束到证据边界: Verifier 本地重算 expected response。引用时只把 SWATT p.1-p.4; Figure 2 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SWATT p.1-p.4; Figure 2.

- Proof object: flow - checksum: challenge -> verification routine -> read memory -> compute response -> return -> verify

#### 方法 2: Timing-Bound Security

**Claim:** 时间上界是 SWATT 的安全核心，也是最大脆弱点。

- Attacker 用 clean copy 或重定位 malware 会增加执行时间。
- Verifier 需要知道设备 clock 和 memory architecture。
- 网络 jitter 或复杂 CPU 会破坏假设。

**讲解稿:** 讲解时先把本页结论落到一句话: 时间上界是 SWATT 的安全核心，也是最大脆弱点。第一步解释为什么需要这一页: Attacker 用 clean copy 或重定位 malware 会增加执行时间。第二步说明论文或规范实际做了什么: Verifier 需要知道设备 clock 和 memory architecture。第三步收束到证据边界: 网络 jitter 或复杂 CPU 会破坏假设。引用时只把 SWATT security discussion 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SWATT security discussion.

- Proof object: matrix - 时间假设: 能支撑 = simple MCU; 难支撑 = complex OS/network; 攻击 = relocation/copy; 检测 = slowdown; 边界 = not modern cloud RA

#### 方法 3: Legacy Device Trade-off

**Claim:** SWATT 的价值是低成本和 legacy-friendly，但缺少硬件 root of trust。

- 不需要安全协处理器。
- 可用于早期 sensor/smartcard/PDA 场景。
- 不能提供密钥保护、secure boot 或 runtime isolation。

**讲解稿:** 讲解时先把本页结论落到一句话: SWATT 的价值是低成本和 legacy-friendly，但缺少硬件 root of trust。第一步解释为什么需要这一页: 不需要安全协处理器。第二步说明论文或规范实际做了什么: 可用于早期 sensor/smartcard/PDA 场景。第三步收束到证据边界: 不能提供密钥保护、secure boot 或 runtime isolation。引用时只把 SWATT use cases and limitations 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SWATT use cases and limitations.

- Proof object: cards - 取舍: software only; low cost; legacy device; timing fragile; no hardware key


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** SWATT 的实验/证据是早期嵌入式软件 attestation 设计，不是现代 TEE 平台评估。

- 证据源: S&P 2004 PDF，本地验证。
- 核心图: Figure 1 attack, Figure 2 verification procedure。
- 边界: timing 假设强，不能外推到 CCA/CoVE/RATS without hardware root。

**讲解稿:** 讲解时先把本页结论落到一句话: SWATT 的实验/证据是早期嵌入式软件 attestation 设计，不是现代 TEE 平台评估。第一步解释为什么需要这一页: 证据源: S&P 2004 PDF，本地验证。第二步说明论文或规范实际做了什么: 核心图: Figure 1 attack, Figure 2 verification procedure。第三步收束到证据边界: 边界: timing 假设强，不能外推到 CCA/CoVE/RATS without hardware root。引用时只把 SWATT p.1-p.12 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SWATT p.1-p.12.

- Proof object: matrix - 证据边界: 可支撑 = software RA history; 不能支撑 = modern TEE evidence; 性能 = timing-based not benchmark; 角色 = foundational


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能页应写成 timing constraint 页: SWATT 的性能本身就是安全假设的一部分。

- 过慢可能意味着 malware 搬移或模拟。
- 过复杂平台会让 timing bound 难以可靠判断。
- 不应把 SWATT 写成现代 remote attestation 性能基线。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能页应写成 timing constraint 页: SWATT 的性能本身就是安全假设的一部分。第一步解释为什么需要这一页: 过慢可能意味着 malware 搬移或模拟。第二步说明论文或规范实际做了什么: 过复杂平台会让 timing bound 难以可靠判断。第三步收束到证据边界: 不应把 SWATT 写成现代 remote attestation 性能基线。引用时只把 SWATT timing discussion 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SWATT timing discussion.

- Proof object: bars - claim strength: 历史价值 高; 现代适用 低; 硬件 root 无; timing dependency 高


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: SWATT 是 RA 思想起点，但它也清楚暴露了纯软件 attestation 的脆弱假设。

- 优势: 成本低、概念清楚、奠定 verifier/prover/challenge-response 语言。
- 局限: 依赖 timing、简单硬件和无物理攻击；缺少密钥隔离。
- 商业化潜力: 更像历史教材；现代产品应采用硬件 RoT、measured boot 和标准 RATS/EAT。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: SWATT 是 RA 思想起点，但它也清楚暴露了纯软件 attestation 的脆弱假设。第一步解释为什么需要这一页: 优势: 成本低、概念清楚、奠定 verifier/prover/challenge-response 语言。第二步说明论文或规范实际做了什么: 局限: 依赖 timing、简单硬件和无物理攻击；缺少密钥隔离。第三步收束到证据边界: 商业化潜力: 更像历史教材；现代产品应采用硬件 RoT、measured boot 和标准 RATS/EAT。引用时只把 SWATT conclusion; README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SWATT conclusion; README evaluation.

- Proof object: matrix - 评价: 优势 = software RA foundation; 局限 = strong timing assumptions; 商业化 = legacy/educational; 本方向角色 = history anchor


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
