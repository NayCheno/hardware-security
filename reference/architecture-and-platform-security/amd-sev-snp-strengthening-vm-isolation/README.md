# Secure Encrypted Virtualization Secure Nested Paging (SEV-SNP)

- BibTeX key: `amd_sev_snp`
- Category: `architecture-and-platform-security`
- Authors: AMD
- Year: 2020
- Source: https://docs.amd.com/v/u/en-US/SEV-SNP-strengthening-vm-isolation-with-integrity-protection-and-more
- PDF source: https://docs.amd.com/api/khub/documents/g0_UaJyXtYQXiVHEFLlNzQ/content
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Evidence role: Industry evidence. Use for vendor, product, or industry deployment evidence only; do not generalize to peer-reviewed mechanism proof or complete platform security.
<!-- BEGIN PAPER REVIEW -->
## Paper Review
Canonical BibTeX key: `amd_sev_snp`. Evidence role: Industry evidence. Use for vendor, product, or industry deployment evidence only; do not generalize to peer-reviewed mechanism proof or complete platform security.

This README records the source/PDF availability above and should be treated as the local evidence-status record for Secure Encrypted Virtualization Secure Nested Paging (SEV-SNP). When citing this reference in the survey正文, keep the claim within the stated evidence role and cite stronger primary or official sources for mechanism details outside this source's scope.
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `11-memory-encryption-integrity-replay` - 内存加密 / 完整性 / Replay Protection
- Paper key: `amd_sev_snp`
- Role: industry evidence for modern VM isolation hardening
- Evidence base: AMD whitepaper Figure 1 AES key stealing; Figure 2 VMCB; Figure 3 NAE flow; README metadata.
- Boundary: 工业白皮书，不是 peer-reviewed performance paper；本地材料更偏 SEV-ES/GHCB/NAE 机制解释。

### 1. 完整题目 / 作者 / 会议

- 完整题目: Strengthening VM Isolation with Integrity Protection and More
- 作者: AMD
- 会议/来源: AMD white paper / technical overview, 2020
- Title evidence: AMD whitepaper PDF and README metadata.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** AMD SEV-SNP 方向的贡献是把 VM 机密性从 memory encryption 推向 guest state、ownership 和 hypervisor interaction hardening。

- 动机: 只加密内存还不够，hypervisor 可通过寄存器状态、VMEXIT/emulation、page ownership 等通道影响 guest。
- 工作: SEV-ES 加密 guest register state，用 GHCB/#VC 约束 hypervisor emulation；SNP 进一步强化 memory ownership/integrity。
- 数据: 白皮书无 benchmark；图示重点是 AES key stealing、VMCB 和 NAE flow。

**讲解稿:** 讲解时先把本页结论落到一句话: AMD SEV-SNP 方向的贡献是把 VM 机密性从 memory encryption 推向 guest state、ownership 和 hypervisor interaction hardening。第一步解释为什么需要这一页: 动机: 只加密内存还不够，hypervisor 可通过寄存器状态、VMEXIT/emulation、page ownership 等通道影响 guest。第二步说明论文或规范实际做了什么: 工作: SEV-ES 加密 guest register state，用 GHCB/#VC 约束 hypervisor emulation；SNP 进一步强化 memory ownership/integrity。第三步收束到证据边界: 数据: 白皮书无 benchmark；图示重点是 AES key stealing、VMCB 和 NAE flow。引用时只把 AMD Figure 1-Figure 3; README review 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AMD Figure 1-Figure 3; README review.

- Proof object: flow - SEV hardening: encrypted memory -> encrypted guest state -> #VC exception -> GHCB shared protocol -> SNP ownership/integrity -> attestation


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是 hypervisor 即使看不到加密内存，仍能观察或操纵 VM exit state。

- Figure 1 展示从寄存器读取 AES key 的风险。
- 传统 VMEXIT 会暴露 guest register/control state 给 hypervisor。
- SEV-ES/NAE/GHCB 把 guest 自愿共享的信息收敛到协议化 buffer。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是 hypervisor 即使看不到加密内存，仍能观察或操纵 VM exit state。第一步解释为什么需要这一页: Figure 1 展示从寄存器读取 AES key 的风险。第二步说明论文或规范实际做了什么: 传统 VMEXIT 会暴露 guest register/control state 给 hypervisor。第三步收束到证据边界: SEV-ES/NAE/GHCB 把 guest 自愿共享的信息收敛到协议化 buffer。引用时只把 AMD Figure 1; Figure 2; Figure 3 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AMD Figure 1; Figure 2; Figure 3.

- Proof object: matrix - hypervisor channels: Memory = encrypted by SEV; Registers = SEV-ES protects; Emulation = #VC/GHCB protocol; Page ownership = SNP/RMP direction; Attestation = platform evidence


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: VM isolation 要保护 data、CPU state 和 memory ownership，而不只是 DRAM ciphertext。

- SEV-ES 防止 hypervisor 在 VMEXIT 中读取大部分 guest state。
- GHCB 是 guest 与 hypervisor 的受控共享结构。
- SNP/RMP 方向把 host 对 guest page 的 ownership 攻击纳入防护。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: VM isolation 要保护 data、CPU state 和 memory ownership，而不只是 DRAM ciphertext。第一步解释为什么需要这一页: SEV-ES 防止 hypervisor 在 VMEXIT 中读取大部分 guest state。第二步说明论文或规范实际做了什么: GHCB 是 guest 与 hypervisor 的受控共享结构。第三步收束到证据边界: SNP/RMP 方向把 host 对 guest page 的 ownership 攻击纳入防护。引用时只把 AMD SEV-ES/SNP whitepaper mechanisms 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AMD SEV-ES/SNP whitepaper mechanisms.

- Proof object: cards - hardening layers: memory encryption; state encryption; #VC handler; GHCB; RMP/SNP ownership


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: Guest 遇到需要 hypervisor emulation 的 NAE 时，先进入 #VC handler，再通过 GHCB 显式共享最小状态。

- Figure 2 是 VMCB，Figure 3 是 NAE example flow。
- Guest 决定哪些寄存器/信息写入 GHCB。
- Hypervisor 处理 emulation 后，guest 读取结果并继续执行。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: Guest 遇到需要 hypervisor emulation 的 NAE 时，先进入 #VC handler，再通过 GHCB 显式共享最小状态。第一步解释为什么需要这一页: Figure 2 是 VMCB，Figure 3 是 NAE example flow。第二步说明论文或规范实际做了什么: Guest 决定哪些寄存器/信息写入 GHCB。第三步收束到证据边界: Hypervisor 处理 emulation 后，guest 读取结果并继续执行。引用时只把 AMD Figure 2 VMCB; Figure 3 NAE flow 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AMD Figure 2 VMCB; Figure 3 NAE flow.

- Proof object: flow - NAE flow: guest instruction -> #VC exception -> guest writes GHCB -> VMGEXIT -> hypervisor emulates -> guest validates result


### 6. 核心方法拆解

#### 方法 1: Encrypted State / SEV-ES

**Claim:** SEV-ES 把 VMEXIT 时的 guest register state 从 hypervisor 视野里拿掉。

- VMRUN/VMEXIT 不再直接暴露关键 register。
- VMSA 等状态由 AMD-SP/CPU 处理。
- 这降低 Figure 1 类 register secret leakage。

**讲解稿:** 讲解时先把本页结论落到一句话: SEV-ES 把 VMEXIT 时的 guest register state 从 hypervisor 视野里拿掉。第一步解释为什么需要这一页: VMRUN/VMEXIT 不再直接暴露关键 register。第二步说明论文或规范实际做了什么: VMSA 等状态由 AMD-SP/CPU 处理。第三步收束到证据边界: 这降低 Figure 1 类 register secret leakage。引用时只把 AMD Figure 1; Figure 2; SEV-ES sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AMD Figure 1; Figure 2; SEV-ES sections.

- Proof object: matrix - state protection: Before = hypervisor sees exit state; SEV-ES = guest state encrypted; Benefit = register secrets hidden; Cost = guest #VC support; Boundary = still needs protocol correctness

#### 方法 2: GHCB / #VC Protocol

**Claim:** GHCB 让 guest 对 hypervisor 共享信息显式化。

- Non-Automatic Exit 触发 #VC。
- Guest #VC handler 决定写哪些 field 到 GHCB。
- VMGEXIT 把请求交给 hypervisor，再由 guest 检查返回值。

**讲解稿:** 讲解时先把本页结论落到一句话: GHCB 让 guest 对 hypervisor 共享信息显式化。第一步解释为什么需要这一页: Non-Automatic Exit 触发 #VC。第二步说明论文或规范实际做了什么: Guest #VC handler 决定写哪些 field 到 GHCB。第三步收束到证据边界: VMGEXIT 把请求交给 hypervisor，再由 guest 检查返回值。引用时只把 AMD Figure 3 NAE flow 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AMD Figure 3 NAE flow.

- Proof object: flow - GHCB protocol: NAE event -> #VC handler -> populate GHCB -> VMGEXIT -> hypervisor action -> guest resumes

#### 方法 3: SNP / Ownership Direction

**Claim:** SNP 的要点是进一步限制 hypervisor 对 guest page ownership 和完整性的攻击面。

- RMP/ownership table 是现代 SNP 叙事核心。
- Page validation/assignment 防止 host 将错误页映射给 guest。
- 本地白皮书只支撑高层方向，细节需 AMD APM/SNP spec。

**讲解稿:** 讲解时先把本页结论落到一句话: SNP 的要点是进一步限制 hypervisor 对 guest page ownership 和完整性的攻击面。第一步解释为什么需要这一页: RMP/ownership table 是现代 SNP 叙事核心。第二步说明论文或规范实际做了什么: Page validation/assignment 防止 host 将错误页映射给 guest。第三步收束到证据边界: 本地白皮书只支撑高层方向，细节需 AMD APM/SNP spec。引用时只把 AMD SEV-SNP README and whitepaper boundary 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AMD SEV-SNP README and whitepaper boundary.

- Proof object: cards - SNP direction: RMP ownership; page validation; integrity protection; attestation report; spec needed for details

#### 方法 4: Industrial Evidence Boundary

**Claim:** 白皮书适合解释产品方向，但不是系统论文评估。

- 不能从白皮书推导性能 overhead。
- 不能替代 AMD 架构手册或 Linux/KVM 实现细节。
- PPT 中保留其 industry-evidence 身份。

**讲解稿:** 讲解时先把本页结论落到一句话: 白皮书适合解释产品方向，但不是系统论文评估。第一步解释为什么需要这一页: 不能从白皮书推导性能 overhead。第二步说明论文或规范实际做了什么: 不能替代 AMD 架构手册或 Linux/KVM 实现细节。第三步收束到证据边界: PPT 中保留其 industry-evidence 身份。引用时只把 AMD whitepaper scope 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AMD whitepaper scope.

- Proof object: matrix - use: Good for = mechanism overview; Need more for = exact ABI/spec; No = benchmark; Evidence = industry whitepaper; Role = modern CVM context


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** 实验页写成 industry evidence: 无新实验，只有白皮书图示和机制说明。

- 证据源: AMD PDF/README；Figure 1-Figure 3。
- 可支撑: SEV-ES/GHCB/NAE 的机制解释和 SNP 方向性。
- 不能支撑: 性能、形式化安全、完整 SNP ABI。

**讲解稿:** 讲解时先把本页结论落到一句话: 实验页写成 industry evidence: 无新实验，只有白皮书图示和机制说明。第一步解释为什么需要这一页: 证据源: AMD PDF/README；Figure 1-Figure 3。第二步说明论文或规范实际做了什么: 可支撑: SEV-ES/GHCB/NAE 的机制解释和 SNP 方向性。第三步收束到证据边界: 不能支撑: 性能、形式化安全、完整 SNP ABI。引用时只把 AMD Figure 1-Figure 3; README evidence boundary 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AMD Figure 1-Figure 3; README evidence boundary.

- Proof object: matrix - 证据边界: 类型 = industry whitepaper; 实验 = 无; 可支撑 = mechanism overview; 不能支撑 = peer-reviewed performance


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能页写成无新实验: 白皮书没有 benchmark。

- 潜在开销来自 #VC/GHCB emulation、page validation、RMP checks 和 attestation。
- 真实开销取决于 workload、VMEXIT rate、I/O emulation 和 kernel implementation。
- 本 PPT 不编造数字。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能页写成无新实验: 白皮书没有 benchmark。第一步解释为什么需要这一页: 潜在开销来自 #VC/GHCB emulation、page validation、RMP checks 和 attestation。第二步说明论文或规范实际做了什么: 真实开销取决于 workload、VMEXIT rate、I/O emulation 和 kernel implementation。第三步收束到证据边界: 本 PPT 不编造数字。引用时只把 AMD whitepaper scope 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AMD whitepaper scope.

- Proof object: bars - claim strength: industry relevance 高; mechanism clarity 中; performance data 无; spec completeness 需另证


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: AMD SEV-SNP 是理解现代 CVM 商业化的关键工业材料，但证据等级不同于论文。

- 优势: 贴近真实产品，解释 hypervisor 不可信后 state/emulation 如何收敛。
- 局限: 白皮书粒度有限；需要配套 spec、Linux/KVM 和安全分析。
- 商业化潜力: 已经是云 CVM 生态核心路线；风险在 firmware/attestation/guest driver 复杂性。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: AMD SEV-SNP 是理解现代 CVM 商业化的关键工业材料，但证据等级不同于论文。第一步解释为什么需要这一页: 优势: 贴近真实产品，解释 hypervisor 不可信后 state/emulation 如何收敛。第二步说明论文或规范实际做了什么: 局限: 白皮书粒度有限；需要配套 spec、Linux/KVM 和安全分析。第三步收束到证据边界: 商业化潜力: 已经是云 CVM 生态核心路线；风险在 firmware/attestation/guest driver 复杂性。引用时只把 AMD README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** AMD README evaluation.

- Proof object: matrix - 评价: 优势 = industry deployment relevance; 局限 = whitepaper evidence; 商业化 = cloud CVM; 本方向角色 = industry auxiliary SOTA


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
