# A Survey of RISC-V Secure Enclaves and Trusted Execution Environments

- BibTeX key: `boubakri2025riscvtee`
- Category: `risc-v-confidential-computing`
- Authors: Marouene Boubakri and Belhassen Zouari
- Year: 2025
- Venue: Electronics 14(21):4171
- Source: https://www.mdpi.com/2079-9292/14/21/4171
- DOI: https://doi.org/10.3390/electronics14214171
- PDF source: https://mdpi-res.com/d_attachment/electronics/electronics-14-04171/article_deploy/electronics-14-04171.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12 from the MDPI static resource endpoint
- Evidence class: E2 peer-reviewed survey
- Evidence role: Auxiliary SOTA for `01-tee-taxonomy`. Use as a RISC-V secure enclave / TEE lineage bridge. Mechanism, performance, and standardization claims must be traced to original papers or official RISC-V sources.

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 1. 论文基本信息

- 论文标题: A Survey of RISC-V Secure Enclaves and Trusted Execution Environments
- 作者 / 机构: Marouene Boubakri; Belhassen Zouari / 论文 PDF 未说明机构细节
- 发表会议 / 年份: Electronics, 2025
- 领域分类: 系统 / 安全 / 架构
- 一句话总结: 论文把 2016-2025 年 RISC-V secure enclave 与 TEE 工作整理成一条谱系，覆盖 Keystone、Sanctum、TIMBER-V、MI6、CURE、CoVE、WorldGuard、SPEAR-V、AP-TEE、Penglai、AnyTEE 等。
- 最核心贡献一句话: 它是 01 方向的 RISC-V 辅助 SOTA，用来解释“通用 TEE taxonomy 落到开放 ISA 时，为什么 PMP/ePMP、monitor、MTT、TVM、TSM、secure I/O 和标准化会成为关键变量”。

### 2. 研究问题与背景

论文要解决的问题是 RISC-V TEE 研究过于分散。PDF p.1 摘要指出，RISC-V 的开放、可扩展和模块化特性推动了 confidential computing foundations，但已有方案在 isolation、scalability、adoption、performance cost、programming model、real-world validation 上取舍不同，社区缺少 consolidated view。

背景知识:

1. RISC-V privilege stack: p.4 Section 2.2 将 U/S/M 三个 privilege levels、PMP/ePMP、virtual memory、hypervisor extension、cryptographic instructions、memory tagging 描述为 RISC-V TEE 的 architectural substrate。
2. TEE vs secure enclave: p.3 Section 2.1 说明 TEE 是更宽的受信执行环境概念，secure enclave 是其中一种实现方式，通常隔离应用或安全上下文。
3. Survey method: p.4 Section 2.3 给出四个选择标准: architectural significance、implementation fidelity、design-goal diversity、community/industrial impact，并覆盖 2016-2025。
4. Timeline: Figure 1/p.4 把 Sanctum、MI6、Keystone、CURE、SPEAR-V、CoVE、WorldGuard、AnyTEE、TIMBER-V、Elasticlave、VirTEE、AP-TEE、DORAMI、Penglai 放在同一时间轴上。

Gap 是否真实存在: 是。Table 1/p.19 显示 RISC-V TEE 在 isolation architecture、enclave type、privilege level、memory isolation、secure I/O、cache side-channel protection、hardware modification、implementation validation、SDK、TCB size、crypto、compliance 上差异很大。没有一个单一系统同时解决所有维度。

### 3. 核心方法拆解

本文是 survey，不是新系统。分析管线:

`RISC-V primitives -> representative TEE/enclave systems -> comparison matrix -> design trade-offs -> deployment and standardization gaps`

核心模块:

| 模块 | 论文位置 | 讲解重点 |
|---|---|---|
| Architectural substrate | p.4 Section 2.2 | U/S/M privilege、PMP/ePMP、virtual memory、hypervisor extension、crypto、memory tagging |
| Chronological lineage | Figure 1/p.4 | 2016-2025 RISC-V TEE/enclave 演进 |
| System survey | Section 3/p.4-p.18 | 逐个解释 Keystone、Sanctum、TIMBER-V、MI6、CURE、CoVE、AP-TEE、Penglai 等 |
| Comparative matrix | Table 1/p.19 | 用 isolation、memory、I/O、SCA、implementation、TCB、compliance 横向比较 |
| Discussion | Section 4/p.20-p.29 | trade-off、scalability、secure I/O、side-channel、systemic challenges、programming model、standardization、production viability |

四个对 01 PPT 最重要的核心思想:

1. Primitive stack 决定上限: PMP/ePMP 是许多轻量 enclave 的基础，但 PMP entries、granularity 和 privileged monitor design 限制 scalability。p.4、p.20-p.21、p.26 都回到这个主题。
2. Enclave lineage 不等于 confidential VM lineage: Keystone/Sanctum/CURE/Penglai 等偏 enclave 或 monitor 设计；CoVE/AP-TEE 则把 RISC-V 推向 TVM/TSM/confidential VM 抽象。CoVE 在 p.12-p.13，AP-TEE 在 p.17-p.18。
3. Secure I/O 是共同弱项: Table 1/p.19 的 Sec. I/O 列显示多数系统只有 partial 或 none；Section 4.3/p.21 讨论 secure I/O/DMA/peripheral 仍是缺口。
4. Production viability 不只看安全机制: Section 4.16/p.27-p.29 将 SDK、toolchain、standards、ASIC/production validation、ecosystem integration 作为 adoption 条件。

### 4. 安全性 / 正确性分析

这篇 survey 不提供新 proof，也不复现实验攻击。它的安全分析来自比较已有系统的 threat model 和机制覆盖。

可以支撑的 claim:

- RISC-V TEE 设计确实分成多条路线: PMP/monitor-based lightweight enclaves、hardware-modified enclaves、balanced/hybrid systems、TVM/confidential VM specs。
- 多数 RISC-V TEE 对 secure I/O、cache side-channel、compliance、production validation 的支持不完整，依据 Table 1/p.19 与 Section 4。
- CoVE/AP-TEE 代表 RISC-V confidential VM/standardization 方向，但 AP-TEE 在本文中仍是 draft specification，依据 p.17-p.18 Section 3.14。

不能支撑的 claim:

- 不能只引用本文证明 Keystone、Penglai、CoVE、AP-TEE 的机制安全性。
- 不能只引用本文报告 Penglai、AnyTEE 等性能数字，除非回到对应原始论文核验。
- 不能把所有系统放在同一安全等级上，因为 threat model、attacker capability、physical/side-channel assumptions 并不一致。

### 5. 实现细节

- Code size: 本文无新实现。Table 1/p.19 引用若干系统的 TCB size，例如 Keystone 约 8.4 k LoC、Sanctum 约 5 k LoC、Cerberus 约 7 k LoC、Penglai 约 10.2 k LoC、AnyTEE 约 9.4 k LoC；这些是 survey 汇总，应回引原论文。
- Language: 论文未说明。
- Modified components: survey 对象包括 RISC-V core、PMP/ePMP、page table walker、secure monitor、enclave runtime、MTT/GPT/MMT、TVM/TSM、SDK 等。
- Platform dependencies: RISC-V privilege architecture、PMP/ePMP、hypervisor extension、draft AP-TEE/CoVE materials、FPGA/simulator/prototype evidence。
- Open source or artifact: 本文无 artifact；部分被 survey 系统有开源框架或原始 artifact。
- Reproducibility difficulty: 中等偏高。难点是把 survey 中的二手描述逐项回引到原始论文/spec，尤其是性能、TCB size、secure I/O、compliance 状态。

### 6. 实验设计分析

Survey，无新实验。本文的“数据”主要是:

- Figure 1/p.4: 2016-2025 系统时间线。
- Table 1/p.19: RISC-V TEE comparison matrix。
- Section 4/p.20-p.29: 设计权衡、scalability、secure I/O、side-channel、systemic challenges、programming model、compliance、TCB size、hardware modification、deployment scenarios、production viability。

评价:

- 覆盖面广，适合做 RISC-V 谱系导航。
- 论文把很多原始系统的性能和机制数字汇总进 narrative，但 PPT 里必须标明这些不是本文新实验。
- 本文可辅助建立 “RISC-V TEE 从 enclave 到 confidential VM” 的故事线，但具体架构图和实验页应从原始 Keystone/Penglai/SPEAR-V/CoVE/AP-TEE/CoVE-IO README 中取证。

### 7. Novelty 分析

分类: `solid systems contribution`。

理由: 它的新意不在新机制，而在把 RISC-V secure enclave/TEE 近期材料系统化，尤其是把 early enclave work、scalable memory protection、TVM/confidential VM、AP-TEE draft、production viability 放进一个表格和讨论框架。相对 Li 2024 的通用 server-side TEE SoK，它更窄，但能补上 01 中 RISC-V 分支的谱系。

### 8. 局限性与可能漏洞

- 证据层级: 这是 E2 survey。机制 claim 必须回到原始论文/spec。
- 发表载体: Electronics 2025 peer-reviewed journal survey，但不是系统/安全顶会一手机制论文。
- 状态滞后: AP-TEE、CoVE-IO、IOPMP、RISC-V IOMMU/AIA 等规范状态可能在 2026 后变化，需要单独跟踪。
- 横向比较风险: Table 1 把不同 threat model、不同验证平台、不同成熟度系统放进同一矩阵，读者容易误解为同等级比较。
- 性能证据: survey narrative 中的 overhead/latency 数字来自被引用论文，不应在 01 PPT 中作为本文实验结果。

### 9. 和已有工作的关系

本文在 01 方向中是辅助 SOTA:

- 对上连接 `li2024sokteechoices`: Li 2024 给出通用 host/RTPM/instance resource-management framework，本文解释 RISC-V 平台中这些职责如何被 PMP、monitor、MTT、TSM、TVM 等机制实现。
- 对下连接 RISC-V 原始论文/spec: Sanctum、Keystone、CURE、Penglai、SPEAR-V、CoVE、AP-TEE、CoVE-IO、ACE 等仍是机制 claim 的主证据。
- 与 accelerator SoK 互补: 本文偏 CPU/enclave/confidential VM，`sok-tee` 偏 GPU/NPU/DPU/FPGA/device TEE。

### 10. 复现与再实现计划

最小复现目标:

1. 复建 Figure 1 时间线，并标出每个系统在本仓库中的 README/PDF 状态。
2. 复建 Table 1，但把每个格子的证据来源拆成原始 paper/spec 页码。
3. 将系统归入四类: PMP/monitor enclave、hardware-modified enclave、scalable memory protection、confidential VM/spec。
4. 单独标出 secure I/O、attestation、production validation、standardization status。

Acceptance criteria:

- 每个 RISC-V 系统至少有一个原始证据路径。
- 对 draft/not-ratified spec 显式标注状态。
- 任何性能数字必须有原始论文图表页码。

### 11. 对后续研究的启发

1. RISC-V TEE lineage map: 用 timeline + mechanism matrix 解释从 Sanctum/Keystone 到 CoVE/AP-TEE 的层级变化。
2. PMP scalability study: 系统比较 PMP/ePMP/Smepmp/IOPMP/IOMMU 对 enclave 数量、page ownership、DMA 的限制。
3. Unified TEE ABI: 结合 Section 4.7 的 portable runtime/SBI extension 思路，研究 RISC-V TEE SDK 与 GlobalPlatform/PKCS#11 的映射。
4. Confidential I/O composition: 把 CoVE-IO、IOMMU、AIA、IOPMP、SPDM/TDISP 放入 RISC-V TVM data path。
5. Production readiness benchmark: 对 SDK、open-source status、FPGA/simulator/silicon validation、compliance 和 attestation evidence 做评分。
6. Evidence cleanup: 对 survey 中每个二手 performance/TCB 数字建立 original-source ledger，避免 SoK 写作时过度引用 survey。

### 12. SOTA README Addendum

- SOTA 定位: Auxiliary SoK/survey anchor
- 标准化 / 发表状态: peer-reviewed Electronics 2025 survey; MDPI HTML and local PDF verified
- 对应小方向: `01-tee-taxonomy` 的 RISC-V 谱系辅助；`08-riscv-tee-lineage`、`09-riscv-cove-ap-tee` 的背景 substrate

#### 内容摘要

本文把 RISC-V TEE 从开放 ISA 原语到 secure enclave、scalable enclave、confidential VM 和 standardization path 串成一条谱系。对非本领域读者来说，它回答“为什么 RISC-V TEE 不只是一个 Keystone 或 CoVE，而是一组围绕 PMP/ePMP、monitor、memory ownership、attestation、SDK 和标准化的设计路线”。

#### 研究背景

RISC-V 的开放性带来可定制安全硬件，也带来碎片化。轻量 enclave 容易部署但受 PMP/scalability 限制；强隔离方案常需要硬件修改；confidential VM 方向需要 TSM/TVM/MTT 和 ABI；production adoption 还要 SDK、compliance、upstream support 和标准化。

#### 解决方案

论文用 timeline、逐系统 survey、Table 1 comparison matrix 和 Section 4 discussion 组织 RISC-V TEE 设计空间。它将 Keystone/Sanctum/CURE/Penglai/SPEAR-V 等系统和 CoVE/AP-TEE 这样的 confidential VM/spec 方向放到同一比较框架。

#### 实验结果

Survey，无新实验。本文引用了若干原始论文的实现和性能信息，但 01 PPT 只把它作为 taxonomy/evidence map 使用。机制、overhead、TCB size、secure I/O 状态需要回引原始论文或官方 spec。

#### 文章评价

优点: 能把 RISC-V 小方向和通用 TEE taxonomy 接起来，适合建立清晰谱系。局限: 二手 survey 证据不能替代一手机制材料；某些 draft/spec 状态需要持续更新。商业化潜力: 可辅助 RISC-V confidential computing 平台选型，但落地取决于 AP-TEE/CoVE、IOMMU/IOPMP、SDK、attestation 和生态支持是否成熟。

### 13. SoK Citation Expansion

| Priority | Cited work | Role in SoK | Repo category | Local status | Next action |
|---|---|---|---|---|---|
| P0 | Sanctum | Foundational open-hardware enclave | `reference/risc-v-confidential-computing/sanctum-minimal-hardware-extensions-strong-software-isolation/` | existing, local PDF available | Use original paper for lineage. |
| P0 | Keystone | Open RISC-V enclave framework | `reference/risc-v-confidential-computing/keystone-open-framework-architecting-tees/` | existing, Review available | Use as baseline. |
| P0 | Penglai | Scalable enclave memory protection | `reference/risc-v-confidential-computing/penglai-scalable-memory-protection/` | existing, Review available | Use as peer-reviewed SOTA. |
| P0 | SPEAR-V | Practical RISC-V enclave primitive | `reference/risc-v-confidential-computing/spear-v-secure-practical-enclave-architecture-risc-v/` | existing, Review available | Use as peer-reviewed SOTA. |
| P0 | CoVE/AP-TEE | Confidential VM architecture/spec | `reference/risc-v-confidential-computing/cove-towards-confidential-computing-on-risc-v-platforms/`; `risc-v-ap-tee-specification/` | existing, local PDFs available | Use for confidential VM section. |
| P0 | CoVE-IO | Confidential I/O spec | `reference/risc-v-confidential-computing/risc-v-cove-io-specification/` | existing, local PDF available | Use for trusted I/O section. |
| P1 | TIMBER-V | Embedded tagged-memory enclave | `reference/risc-v-confidential-computing/timber-v-tag-isolated-memory-fine-grained-enclaves-risc-v/` | added, Review available | Use as embedded branch. |
| P1 | Cerberus | Formal enclave memory sharing | `reference/risc-v-confidential-computing/cerberus-formal-approach-secure-efficient-enclave-memory-sharing/` | added, Review available | Use for sharing/formal proof discussion. |
| P1 | ACE | Embedded RISC-V confidential computing | `reference/risc-v-confidential-computing/ace-confidential-computing-embedded-risc-v-systems/` | existing, local PDF available | Finish review when writing embedded subsection. |
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `09-riscv-cove-ap-tee` - RISC-V CoVE / AP-TEE Confidential VM
- Paper key: `boubakri2025riscvtee`
- Role: auxiliary survey for lineage and classification
- Evidence base: Boubakri survey local PDF/MDPI HTML; taxonomy tables and challenge sections.
- Boundary: Survey 不提供一手机制证明或性能数据；机制 claim 回引 Keystone/Penglai/SPEAR-V/CoVE/AP-TEE 原始材料。

### 1. 完整题目 / 作者 / 会议

- 完整题目: A Survey of RISC-V Secure Enclaves and Trusted Execution Environments
- 作者: Marouene Boubakri and Belhassen Zouari
- 会议/来源: Electronics 14(21):4171, 2025
- Title evidence: README metadata; Boubakri PDF/MDPI page.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** Boubakri survey 的作用是给 RISC-V TEE 画地图，而不是替代原始系统论文。

- 动机: RISC-V TEE 论文、开源项目和规范发展快，容易把 enclave、CVM、monitor、runtime 混在一起。
- 工作: 按 RISC-V security primitive、secure enclave lineage、TEE mechanism 和开放挑战整理。
- 数据: survey 无新实验；使用论文/规范作为二手证据。

**讲解稿:** 讲解时先把本页结论落到一句话: Boubakri survey 的作用是给 RISC-V TEE 画地图，而不是替代原始系统论文。第一步解释为什么需要这一页: 动机: RISC-V TEE 论文、开源项目和规范发展快，容易把 enclave、CVM、monitor、runtime 混在一起。第二步说明论文或规范实际做了什么: 工作: 按 RISC-V security primitive、secure enclave lineage、TEE mechanism 和开放挑战整理。第三步收束到证据边界: 数据: survey 无新实验；使用论文/规范作为二手证据。引用时只把 Boubakri survey sections on taxonomy and challenges 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Boubakri survey sections on taxonomy and challenges.

- Proof object: flow - survey map: RISC-V primitives -> enclave systems -> runtime/monitor choices -> CoVE/AP-TEE -> open challenges


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是同样叫 TEE，Keystone、Penglai、SPEAR-V、CoVE 的保护对象并不一样。

- Keystone/Penglai/SPEAR-V 多是 enclave/process/address-space isolation。
- CoVE/AP-TEE 面向 whole-VM confidentiality。
- Survey 可帮助读者先定位层级，再进入具体论文。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是同样叫 TEE，Keystone、Penglai、SPEAR-V、CoVE 的保护对象并不一样。第一步解释为什么需要这一页: Keystone/Penglai/SPEAR-V 多是 enclave/process/address-space isolation。第二步说明论文或规范实际做了什么: CoVE/AP-TEE 面向 whole-VM confidentiality。第三步收束到证据边界: Survey 可帮助读者先定位层级，再进入具体论文。引用时只把 Boubakri survey taxonomy sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Boubakri survey taxonomy sections.

- Proof object: matrix - 分类校准: Keystone = open enclave framework; Penglai = scalable enclave memory; SPEAR-V = tag-based primitive; CoVE = confidential VM; AP-TEE = draft CVM spec


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: RISC-V TEE 的差异主要来自 trust placement、memory primitive、attestation 和 I/O support。

- Trust 可放在 M-mode monitor、S-mode/HS-mode TSM、硬件 tag 或 SoC RoT。
- Memory primitive 可是 PMP/GPT/MMT/MTT/tag store。
- Survey 的价值是把这些设计轴合并成比较表。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: RISC-V TEE 的差异主要来自 trust placement、memory primitive、attestation 和 I/O support。第一步解释为什么需要这一页: Trust 可放在 M-mode monitor、S-mode/HS-mode TSM、硬件 tag 或 SoC RoT。第二步说明论文或规范实际做了什么: Memory primitive 可是 PMP/GPT/MMT/MTT/tag store。第三步收束到证据边界: Survey 的价值是把这些设计轴合并成比较表。引用时只把 Boubakri survey taxonomy and open issues 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Boubakri survey taxonomy and open issues.

- Proof object: cards - design axes: trust placement; memory primitive; attestation; I/O/device support; standard maturity


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: Survey 不给单一系统图，而是给一张从 ISA primitive 到 TEE system 的分层视图。

- 底层: privileged ISA、PMP/ePMP、MMU、IOMMU、AIA。
- 中层: monitor/TSM/runtime/memory metadata。
- 上层: enclave app、serverless function、TVM workload、remote verifier。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: Survey 不给单一系统图，而是给一张从 ISA primitive 到 TEE system 的分层视图。第一步解释为什么需要这一页: 底层: privileged ISA、PMP/ePMP、MMU、IOMMU、AIA。第二步说明论文或规范实际做了什么: 中层: monitor/TSM/runtime/memory metadata。第三步收束到证据边界: 上层: enclave app、serverless function、TVM workload、remote verifier。引用时只把 Boubakri survey classification sections; relation to 07-09 decks 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Boubakri survey classification sections; relation to 07-09 decks.

- Proof object: matrix - 分层视图: ISA = privilege/PMP/MMU; Platform = RoT/IOMMU/AIA; TEE manager = SM/TSM/runtime; Workload = enclave or TVM; Verifier = attestation decision


### 6. 核心方法拆解

#### 方法 1: Primitive Stack

**Claim:** Survey 把 RISC-V 安全 primitive 当作系统设计的底座。

- Privilege mode 决定谁能管理隔离。
- PMP/ePMP/MMU/MTT/tag store 决定内存边界。
- IOMMU/AIA/CoVE-IO 决定 I/O 方向仍待成熟。

**讲解稿:** 讲解时先把本页结论落到一句话: Survey 把 RISC-V 安全 primitive 当作系统设计的底座。第一步解释为什么需要这一页: Privilege mode 决定谁能管理隔离。第二步说明论文或规范实际做了什么: PMP/ePMP/MMU/MTT/tag store 决定内存边界。第三步收束到证据边界: IOMMU/AIA/CoVE-IO 决定 I/O 方向仍待成熟。引用时只把 Boubakri survey primitive discussion 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Boubakri survey primitive discussion.

- Proof object: flow - primitive stack: M/S/U/HS modes -> PMP/ePMP -> MMU/GPT/MTT -> IOMMU/AIA -> TEE system

#### 方法 2: Lineage Comparison

**Claim:** Survey 的实用价值是把代表系统放在同一条演进线上。

- Sanctum/Keystone 是 foundational open enclave。
- Penglai/CURE/SPEAR-V 是不同 memory primitive 分支。
- CoVE/AP-TEE 是 confidential VM 分支。

**讲解稿:** 讲解时先把本页结论落到一句话: Survey 的实用价值是把代表系统放在同一条演进线上。第一步解释为什么需要这一页: Sanctum/Keystone 是 foundational open enclave。第二步说明论文或规范实际做了什么: Penglai/CURE/SPEAR-V 是不同 memory primitive 分支。第三步收束到证据边界: CoVE/AP-TEE 是 confidential VM 分支。引用时只把 Boubakri survey comparative tables 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Boubakri survey comparative tables.

- Proof object: matrix - lineage: Foundational = Sanctum / Keystone; Scalable = Penglai; Primitive = SPEAR-V / CURE; CVM = CoVE / AP-TEE; I/O = CoVE-IO emerging

#### 方法 3: Open Challenges

**Claim:** Survey 支撑“为什么还要继续研究”的问题意识。

- 标准化、硬件采用、formal verification、side-channel boundary、I/O/device trust 都未完全解决。
- 不同论文 threat model 不可直接合并。
- 商用前需要 verifier、firmware、OS、device ecosystem 一起成熟。

**讲解稿:** 讲解时先把本页结论落到一句话: Survey 支撑“为什么还要继续研究”的问题意识。第一步解释为什么需要这一页: 标准化、硬件采用、formal verification、side-channel boundary、I/O/device trust 都未完全解决。第二步说明论文或规范实际做了什么: 不同论文 threat model 不可直接合并。第三步收束到证据边界: 商用前需要 verifier、firmware、OS、device ecosystem 一起成熟。引用时只把 Boubakri survey open challenges section 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Boubakri survey open challenges section.

- Proof object: cards - open gaps: standardization; hardware adoption; I/O trust; verification; ecosystem maturity


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** 实验页写成 survey 证据页: 无新系统实验，证据来自文献覆盖和分类一致性。

- 证据源: 本地 PDF 与 MDPI HTML 已核验。
- 可支撑: 分类、谱系、挑战。
- 不能支撑: 某个系统的真实性能、安全证明或 ABI 细节。

**讲解稿:** 讲解时先把本页结论落到一句话: 实验页写成 survey 证据页: 无新系统实验，证据来自文献覆盖和分类一致性。第一步解释为什么需要这一页: 证据源: 本地 PDF 与 MDPI HTML 已核验。第二步说明论文或规范实际做了什么: 可支撑: 分类、谱系、挑战。第三步收束到证据边界: 不能支撑: 某个系统的真实性能、安全证明或 ABI 细节。引用时只把 Boubakri survey PDF/HTML; README addendum 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Boubakri survey PDF/HTML; README addendum.

- Proof object: matrix - 证据边界: 类型 = peer-reviewed survey; 实验 = 无新实验; 支撑 = taxonomy; 边界 = mechanism claims need primary sources


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能页写成 claim-strength: survey 不能把二手 performance 写成一手结果。

- 可引用 survey 中的相对讨论，但 PPT 具体数字应回到 Keystone/Penglai/SPEAR-V/CoVE 原文。
- 本页只说明覆盖范围和证据强度。
- 这能避免把 survey 结论误当作系统实验。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能页写成 claim-strength: survey 不能把二手 performance 写成一手结果。第一步解释为什么需要这一页: 可引用 survey 中的相对讨论，但 PPT 具体数字应回到 Keystone/Penglai/SPEAR-V/CoVE 原文。第二步说明论文或规范实际做了什么: 本页只说明覆盖范围和证据强度。第三步收束到证据边界: 这能避免把 survey 结论误当作系统实验。引用时只把 Boubakri survey scope; README evidence boundary 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Boubakri survey scope; README evidence boundary.

- Proof object: bars - claim strength: taxonomy coverage 高; mechanism detail 中; performance evidence 二手; commercial roadmap 辅助


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: Boubakri survey 是很好的辅助材料，但它的正确用法是地图，不是证据终点。

- 优势: 新、覆盖 RISC-V TEE 谱系，适合开场比较。
- 局限: survey 粒度有限，可能滞后 draft/spec 变化。
- 商业化潜力: 适合做 roadmap 和 gap analysis；具体产品决策仍要看标准和系统实测。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: Boubakri survey 是很好的辅助材料，但它的正确用法是地图，不是证据终点。第一步解释为什么需要这一页: 优势: 新、覆盖 RISC-V TEE 谱系，适合开场比较。第二步说明论文或规范实际做了什么: 局限: survey 粒度有限，可能滞后 draft/spec 变化。第三步收束到证据边界: 商业化潜力: 适合做 roadmap 和 gap analysis；具体产品决策仍要看标准和系统实测。引用时只把 Boubakri survey conclusion; README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Boubakri survey conclusion; README evaluation.

- Proof object: matrix - 评价: 优势 = taxonomy bridge; 局限 = secondary evidence; 商业化 = roadmap aid; 本方向角色 = auxiliary SOTA


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
