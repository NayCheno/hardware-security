# Memory Encryption: A Survey of Existing Techniques

- BibTeX key: `henson2014memory`
- Category: `architecture-and-platform-security/sok`
- Authors: Michael Henson; Stephen Taylor
- Year: 2014
- Venue: ACM Computing Surveys
- Source: https://doi.org/10.1145/2566673
- PDF source: https://romisatriawahono.net/lecture/rm/survey/computer%20engineering/Henson%20-%20Memory%20Encryption%20-%202014.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12 from a public mirrored PDF; canonical DOI source is ACM
- Survey lane: ISA/hardware-design defense
- Evidence role: Background substrate. Use for taxonomy, lineage, or adjacent data-path substrate; primary mechanism claims must be traced to original papers, specs, or platform documents.

<!-- BEGIN PAPER REVIEW -->
## Paper Review
### 1. 论文基本信息

- 论文标题: Memory Encryption: A Survey of Existing Techniques
- 作者 / 机构: Michael Henson; Stephen Taylor / Dartmouth College
- 发表会议 / 年份: ACM Computing Surveys 2014
- 领域分类: 架构 / 安全 / 系统
- 一句话总结: 论文综述内存加密技术，解释为什么 disk encryption 无法保护明文 DRAM、总线和运行时代码数据。
- 最核心贡献一句话: 它为本 survey 提供 memory encryption、integrity、authentication、replay protection 与 access-control 的概念边界。

### 2. 研究问题与背景

论文解决的是代码和数据在主存中明文存在导致 cold boot、DMA/FireWire、bus snooping、memory modification 等攻击的问题。它强调 CPU 内部常被视为可信边界，而 RAM、bus 和外部组件在威胁模型中不可信。gap 真实存在，因为 PMP/GPT/IOPMP 这类 access-control 与 memory encryption 的保护目标不同。

### 3. 核心方法拆解

论文是 survey，按技术路线讨论硬件增强、OS 辅助、工业专用设备，以及 encryption 与 authentication/attestation/secure boot 的关系。可抽象为 `threat to off-chip memory -> cryptographic primitive/key management -> memory controller/OS integration -> confidentiality/integrity/replay tradeoff`。

### 4. 安全性 / 正确性分析

安全分析覆盖硬件和软件攻击者、物理访问、bus snooping、cold boot、DMA 等。论文明确 memory encryption 主要保护 confidentiality；memory authentication/integrity 和 replay protection 是相关但不同问题。作为 survey，它不证明某一方案安全，只整理假设和风险。

### 5. 实现细节

无统一实现。论文比较模拟器原型、OS-enhanced designs、coprocessor/industrial devices 和早期 commodity primitives。复现不是单系统任务，而是重建分类矩阵并用现代 SEV-SNP/CCA/CoVE 重新映射。

### 6. 实验设计分析

Survey 无新实验。证据来自既有论文、系统设计和攻击案例。局限是 2014 时间截面早于 SEV-SNP、TDX、Arm CCA、RISC-V CoVE，现代 secure nested paging、GPT/GPC、TVM lifecycle 等需额外补充。

### 7. Novelty 分析

分类: solid systems contribution。新意在于系统化整理 memory encryption 技术和威胁模型，而不是提出新机制。

### 8. 局限性与可能漏洞

最大局限是年代较早。它不能直接覆盖现代 confidential VM、memory ownership metadata、device assignment 或 CXL/PCIe IDE。某些“commodity processor primitives”部分已过时，需要用 AMD SEV-SNP、Arm CCA、RISC-V AP-TEE 和 CoVE-IO 更新。

### 9. 和已有工作的关系

它是 memory encryption taxonomy anchor，可与 AMD SEV-SNP、Arm CCA、CoVE/AP-TEE、PCIe IDE、CXL security 和 IOPMP 对照。关键写作边界: PMP/GPT/IOPMP 是 access control/lifecycle，不等于 encryption；SEV-SNP 更接近 encryption+integrity+metadata protection。

### 10. 复现与再实现计划

最小复现目标是构造现代 memory protection taxonomy 表: access control、encryption、integrity、replay、attestation、I/O path。需要阅读 Henson、AMD SEV-SNP、Arm CCA、RISC-V AP-TEE、PCIe IDE。验收标准是 survey 正文不混淆 access-control 和 encryption。

### 11. 对后续研究的启发

1. 更新 2026 版 memory encryption survey。2. 对 CCA/CoVE/SEV-SNP 的 integrity/replay 语义做统一比较。3. 研究 CXL/PCIe IDE 与 CPU memory encryption 的端到端边界。4. 构建 memory-encryption threat-model checklist。5. 分析 encrypted memory 与 forensic/attestation 的冲突。潜在 venue: CSUR、ACM Computing Surveys、IEEE S&P、USENIX Security、HOST。

### 12. SOTA README Addendum
- SOTA 定位: SoK/survey anchor
- 标准化 / 发表状态: peer-reviewed ACM Computing Surveys 2014
- 对应小方向: Memory encryption / integrity / replay protection

#### 内容摘要

这篇 survey 系统整理 memory encryption 的威胁、技术路线和性能/安全权衡。

#### 研究背景

Full disk encryption 不能保护运行时主存中的明文代码和数据，物理访问、DMA 和总线攻击仍可泄露秘密。

#### 解决方案

按硬件增强、OS 辅助和专用工业设备归纳 memory encryption 方案，并解释 encryption 与 authentication、attestation、secure boot 的边界。

#### 实验结果

Survey，无新实验；证据来自既有工作和攻击案例。

#### 文章评价

它是概念边界最有用的 anchor。时间较早，必须结合 SEV-SNP、CCA、CoVE 和 PCIe/CXL 资料更新。

### 13. SoK Citation Expansion

| Priority | Cited work | Role in SoK | Repo category | Local status | Next action |
|---|---|---|---|---|---|
| P0 | AEGIS | Secure-processor memory protection foundation | `reference/architecture-and-platform-security/aegis-architecture-tamper-evident-tamper-resistant-processing/` | added, local PDF verified, review available | Use as foundational lineage. |
| P0 | Efficient Memory Integrity Verification and Encryption | Memory integrity/encryption mechanism bridge | `reference/architecture-and-platform-security/efficient-memory-integrity-verification-encryption-secure-processors/` | added, local PDF verified, review available | Use as mechanism lineage. |
| P0 | Bonsai Merkle Trees | Memory freshness and replay-protection mechanism anchor | `reference/architecture-and-platform-security/address-independent-seed-encryption-bonsai-merkle-trees/` | added, local PDF verified, review available | Use as direction 11 primary mechanism anchor. |
| P1 | AMD SEV-SNP | Modern industry memory-integrity deployment evidence | `reference/architecture-and-platform-security/amd-sev-snp-strengthening-vm-isolation/` | existing, local PDF verified | Keep as vendor evidence, not sole proof. |
| P2 boundary | Cold-boot, DMA, and physical-memory attacks | Threat-model motivation | `survey/excluded_attack_reference.bib` where retained | attack-only boundary | Do not expand under current defense/spec scope. |
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `11-memory-encryption-integrity-replay` - 内存加密 / 完整性 / Replay Protection
- Paper key: `henson2014memory`
- Role: survey/background taxonomy
- Evidence base: Survey PDF Figure 1/2 and technique tables; README metadata.
- Boundary: Survey 无新实验；不能替代具体 memory encryption/integrity 系统论文。

### 1. 完整题目 / 作者 / 会议

- 完整题目: Memory Encryption: A Survey of Existing Techniques
- 作者: Martin Henson and Stephen Taylor
- 会议/来源: ACM Computing Surveys, 2014
- Title evidence: README metadata; ACM Computing Surveys PDF.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** Henson survey 的价值是建立 memory encryption 的词典: 加密、计数器、完整性、replay 都不是一回事。

- 动机: 处理器外部内存可被总线探测、冷启动、DMA 或恶意平台观察/篡改。
- 工作: 综述 existing memory encryption techniques 和设计 tradeoff。
- 数据: survey 无新实验；证据来自文献分类。

**讲解稿:** 讲解时先把本页结论落到一句话: Henson survey 的价值是建立 memory encryption 的词典: 加密、计数器、完整性、replay 都不是一回事。第一步解释为什么需要这一页: 动机: 处理器外部内存可被总线探测、冷启动、DMA 或恶意平台观察/篡改。第二步说明论文或规范实际做了什么: 工作: 综述 existing memory encryption techniques 和设计 tradeoff。第三步收束到证据边界: 数据: survey 无新实验；证据来自文献分类。引用时只把 Henson survey introduction; Figures/Tables on existing techniques 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Henson survey introduction; Figures/Tables on existing techniques.

- Proof object: flow - memory protection goals: plaintext in CPU -> encrypt before DRAM -> counter/nonce -> MAC/integrity -> Merkle/freshness -> plaintext returns to CPU


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是 DRAM 不在 CPU trust boundary 内，攻击者可以观察或回放外部内存内容。

- 只加密无法防止 bit flipping 或 replay。
- MAC 能检测篡改，但没有 freshness 时旧的合法 ciphertext/MAC 仍可回放。
- 计数器和 Merkle tree 解决 freshness，但引入存储和性能开销。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是 DRAM 不在 CPU trust boundary 内，攻击者可以观察或回放外部内存内容。第一步解释为什么需要这一页: 只加密无法防止 bit flipping 或 replay。第二步说明论文或规范实际做了什么: MAC 能检测篡改，但没有 freshness 时旧的合法 ciphertext/MAC 仍可回放。第三步收束到证据边界: 计数器和 Merkle tree 解决 freshness，但引入存储和性能开销。引用时只把 Henson survey security discussion 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Henson survey security discussion.

- Proof object: matrix - 三类保护: Confidentiality = encryption; Integrity = MAC/hash; Freshness = counter/tree; Replay risk = old valid block; Cost = metadata + cache pressure


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: memory security 的设计本质是 metadata management。

- Counter 必须唯一且不回退。
- Integrity tree 必须覆盖 counter 或 data。
- Metadata 如果太大，会污染 cache 并吞掉 memory bandwidth。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: memory security 的设计本质是 metadata management。第一步解释为什么需要这一页: Counter 必须唯一且不回退。第二步说明论文或规范实际做了什么: Integrity tree 必须覆盖 counter 或 data。第三步收束到证据边界: Metadata 如果太大，会污染 cache 并吞掉 memory bandwidth。引用时只把 Henson survey technique comparison 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Henson survey technique comparison.

- Proof object: cards - metadata questions: where counters live; how MACs are cached; what tree covers; what survives crash; what trust root stores


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: Survey 将技术按加密模式、地址绑定、计数器、MAC 和 tree 组织起来。

- Address-dependent encryption 容易影响 page movement。
- Counter-mode encryption 提供 latency hiding，但 counter storage 是成本。
- Merkle/integrity tree 给 freshness，但树节点会影响 cache。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: Survey 将技术按加密模式、地址绑定、计数器、MAC 和 tree 组织起来。第一步解释为什么需要这一页: Address-dependent encryption 容易影响 page movement。第二步说明论文或规范实际做了什么: Counter-mode encryption 提供 latency hiding，但 counter storage 是成本。第三步收束到证据边界: Merkle/integrity tree 给 freshness，但树节点会影响 cache。引用时只把 Henson survey taxonomy tables 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Henson survey taxonomy tables.

- Proof object: matrix - taxonomy: Encryption mode = counter / tweak / stream; Address binding = virtual/physical/address-independent; Integrity = MAC/hash; Freshness = tree/counter root; System issue = paging/sharing/VM


### 6. 核心方法拆解

#### 方法 1: Encryption Granularity

**Claim:** 粒度越细，保护越精细，但 metadata 和 lookup 越多。

- Cache-line encryption 是常见粒度。
- Page-level 方案便于 OS 管理但可能泄露更粗模式。
- Block/counter size 会影响存储开销。

**讲解稿:** 讲解时先把本页结论落到一句话: 粒度越细，保护越精细，但 metadata 和 lookup 越多。第一步解释为什么需要这一页: Cache-line encryption 是常见粒度。第二步说明论文或规范实际做了什么: Page-level 方案便于 OS 管理但可能泄露更粗模式。第三步收束到证据边界: Block/counter size 会影响存储开销。引用时只把 Henson survey granularity discussion 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Henson survey granularity discussion.

- Proof object: matrix - granularity: cache line = common data block; page = OS-friendly; counter block = metadata grouping; tree node = freshness proof; root = trusted on-chip

#### 方法 2: Counter / Nonce Management

**Claim:** Counter-mode 安全依赖不重用 keystream，所以 counter 是安全状态。

- Counter 重用会泄露 plaintext relation。
- Counter overflow、rollback 和 crash recovery 都是系统问题。
- Address-independent seed 类方案试图让 page movement 更容易。

**讲解稿:** 讲解时先把本页结论落到一句话: Counter-mode 安全依赖不重用 keystream，所以 counter 是安全状态。第一步解释为什么需要这一页: Counter 重用会泄露 plaintext relation。第二步说明论文或规范实际做了什么: Counter overflow、rollback 和 crash recovery 都是系统问题。第三步收束到证据边界: Address-independent seed 类方案试图让 page movement 更容易。引用时只把 Henson survey counter-mode sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Henson survey counter-mode sections.

- Proof object: flow - counter path: block address -> counter/seed -> AES stream -> xor plaintext -> ciphertext -> counter update

#### 方法 3: Integrity and Replay

**Claim:** MAC 检测篡改，Merkle tree 把 MAC/counter 的 freshness 连接到可信 root。

- CPU 内保留 root 或少量可信 state。
- Memory 中存储 MAC/tree nodes。
- 读取时验证 path，写入时更新 path。

**讲解稿:** 讲解时先把本页结论落到一句话: MAC 检测篡改，Merkle tree 把 MAC/counter 的 freshness 连接到可信 root。第一步解释为什么需要这一页: CPU 内保留 root 或少量可信 state。第二步说明论文或规范实际做了什么: Memory 中存储 MAC/tree nodes。第三步收束到证据边界: 读取时验证 path，写入时更新 path。引用时只把 Henson survey integrity/freshness sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Henson survey integrity/freshness sections.

- Proof object: flow - verify: load data+counter -> load MAC/tree nodes -> recompute -> compare to root -> accept or fault

#### 方法 4: Survey Evidence Boundary

**Claim:** Survey 的正确用法是解释设计空间，而不是给某个机制背书。

- 它能说明为什么 Bonsai Merkle Tree 有意义。
- 它不能证明某个商用 CPU 的安全。
- 具体性能必须回到 BMT/SEV-SNP/实现论文。

**讲解稿:** 讲解时先把本页结论落到一句话: Survey 的正确用法是解释设计空间，而不是给某个机制背书。第一步解释为什么需要这一页: 它能说明为什么 Bonsai Merkle Tree 有意义。第二步说明论文或规范实际做了什么: 它不能证明某个商用 CPU 的安全。第三步收束到证据边界: 具体性能必须回到 BMT/SEV-SNP/实现论文。引用时只把 Henson survey scope 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Henson survey scope.

- Proof object: cards - use correctly: taxonomy; threat vocabulary; tradeoff framing; not primary experiment; not product claim


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** 实验页写成 survey 证据页: 无新实验，只有文献覆盖。

- 证据源: ACM Computing Surveys paper local PDF。
- 可支撑: memory encryption taxonomy and vocabulary。
- 不能支撑: overhead numbers for BMT/SEV-SNP or modern CPUs。

**讲解稿:** 讲解时先把本页结论落到一句话: 实验页写成 survey 证据页: 无新实验，只有文献覆盖。第一步解释为什么需要这一页: 证据源: ACM Computing Surveys paper local PDF。第二步说明论文或规范实际做了什么: 可支撑: memory encryption taxonomy and vocabulary。第三步收束到证据边界: 不能支撑: overhead numbers for BMT/SEV-SNP or modern CPUs。引用时只把 Henson survey README and PDF 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Henson survey README and PDF.

- Proof object: matrix - 证据边界: 类型 = survey; 实验 = 无; 可支撑 = taxonomy; 不能支撑 = system performance


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能页写成 claim-strength: survey 不产出新性能曲线。

- 它提示性能成本来自 encryption latency、MAC/tree node fetch、counter storage 和 cache pollution。
- 具体数字引用 Rogers BMT 或产品实现材料。
- 因此本页只画性能成本来源。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能页写成 claim-strength: survey 不产出新性能曲线。第一步解释为什么需要这一页: 它提示性能成本来自 encryption latency、MAC/tree node fetch、counter storage 和 cache pollution。第二步说明论文或规范实际做了什么: 具体数字引用 Rogers BMT 或产品实现材料。第三步收束到证据边界: 因此本页只画性能成本来源。引用时只把 Henson survey performance discussion 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Henson survey performance discussion.

- Proof object: bars - cost sources: encryption latency medium; tree metadata high risk; counter storage medium; survey own data none


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: Henson survey 适合作为方向第一页背景，不适合作为 SOTA 机制终点。

- 优势: 概念清楚，便于区分 encryption/integrity/freshness。
- 局限: 2014 年材料较旧，不能覆盖 CXL/TEE-I/O/modern CVM 全部边界。
- 商业化潜力: 做产品威胁建模词典；真正落地看具体 CPU/SoC 机制。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: Henson survey 适合作为方向第一页背景，不适合作为 SOTA 机制终点。第一步解释为什么需要这一页: 优势: 概念清楚，便于区分 encryption/integrity/freshness。第二步说明论文或规范实际做了什么: 局限: 2014 年材料较旧，不能覆盖 CXL/TEE-I/O/modern CVM 全部边界。第三步收束到证据边界: 商业化潜力: 做产品威胁建模词典；真正落地看具体 CPU/SoC 机制。引用时只把 Henson survey conclusion and README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Henson survey conclusion and README evaluation.

- Proof object: matrix - 评价: 优势 = clear taxonomy; 局限 = older survey; 商业化 = threat-model vocabulary; 本方向角色 = background taxonomy


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
