# A Survey of RISC-V Secure Enclaves and Trusted Execution Environments

- BibTeX key: `boubakri2025riscvtee`
- Category: `risc-v-confidential-computing`
- Authors: Marouene Boubakri and Belhassen Zouari
- Year: 2025
- Venue: Electronics 14(21):4171
- Source: https://www.mdpi.com/2079-9292/14/21/4171
- DOI: https://doi.org/10.3390/electronics14214171
- PDF source: https://www.mdpi.com/2079-9292/14/21/4171/pdf
- Local PDF: not available in this directory
- Download status: attempted again on 2026-05-10; PDF endpoint returned HTTP 403 to automated download, HTML source verified
- SOTA role: survey anchor for RISC-V secure enclaves and TEEs; use as taxonomy support, then cite original Keystone/Penglai/SPEAR-V/CoVE/AP-TEE sources for mechanism claims

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 1. 论文基本信息

- 论文标题: A Survey of RISC-V Secure Enclaves and Trusted Execution Environments
- 作者 / 机构: Marouene Boubakri; Belhassen Zouari
- 发表会议 / 年份: Electronics 2025
- 领域分类: 系统 / 安全 / 架构
- 一句话总结: 论文综述 RISC-V secure enclaves 与 TEE 发展谱系，可作为 RISC-V TEE 小方向的 survey anchor。
- 最核心贡献一句话: 它把 Sanctum、Keystone、Penglai、SPEAR-V、CoVE 等分散工作放进 RISC-V TEE 分类框架。

### 2. 研究问题与背景

RISC-V 的开放 ISA 让 enclave/TEE 研究快速分化到 PMP monitor、tagged memory、scalable memory protection、confidential VM、embedded confidential computing 等路线。论文解决读者缺少综述入口的问题。证据源为 MDPI HTML；PDF 自动下载被 403 阻挡，因此具体机制 claims 应回引本仓库已下载的原始论文和规范。

### 3. 核心方法拆解

论文是 survey，分析路径为 `RISC-V security primitive -> enclave architecture -> trusted monitor/runtime -> memory/I/O/attestation support -> representative system`。它可辅助归类，但不是机制规范。对于 CoVE/AP-TEE/CoVE-IO，应以 `sahita2023cove`、`riscv_ap_tee_2024`、`riscv_cove_io_2026` 为主证据。

### 4. 安全性 / 正确性分析

作为 survey，不提供新证明或攻击复现。价值在横向分类；风险是不同系统 threat model 不一致，不能把 embedded enclave、PMP-based enclave 和 confidential VM 混成同一安全等级。当前 README 已标明 PDF 不可用，证据强度弱于本地 PDF。

### 5. 实现细节

无实现。HTML 证据可用于 bibliographic triage；机制细节需要对照 Sanctum/Keystone/CURE/MI6/Penglai/SPEAR-V/CoVE/AP-TEE/ACE 原文。

### 6. 实验设计分析

Survey 无新实验。它可能汇总已有系统结果，但不能替代原论文的 benchmark 和 threat model。用于 survey 正文时只引用其 taxonomy，不引用具体 overhead 数字，除非回到原文验证。

### 7. Novelty 分析

分类: solid systems contribution。其新意在于 RISC-V TEE 方向的近期整理，尤其适合弥补通用 TEE SoK 对 CoVE/AP-TEE 等新规范覆盖不足。

### 8. 局限性与可能漏洞

最大局限是本地没有 PDF，且 survey 对新 draft spec 的状态可能滞后。另一个风险是把 RISC-V 的 open hardware flexibility 过度解读为安全性保证；安全仍取决于 TCB、monitor、内存系统、I/O 和 attestation。

### 9. 和已有工作的关系

它连接 `schneider2022soktee`、`li2024sokteechoices` 与本仓库 RISC-V 目录。最重要的一跳扩展包括 Sanctum、Keystone、CURE、MI6、Penglai、SPEAR-V、TIMBER-V、Cerberus、CoVE、AP-TEE、CoVE-IO、ACE。

### 10. 复现与再实现计划

最小复现目标是抽取论文 reference list，构造 RISC-V TEE lineage 表并检查每个关键系统是否有本地 README/PDF/review。验收标准是正文能区分 enclave、trusted execution monitor、confidential VM 和 confidential I/O。

### 11. 对后续研究的启发

1. 写 RISC-V TEE 年代表。2. 对 PMP/ePMP/Smepmp/IOPMP/IOMMU/AIA 做 primitive 矩阵。3. 对 CoVE 与 Arm CCA 做同层对照。4. 将 embedded enclave 与 cloud confidential VM 分开评价。5. 搜索 WorldGuard、TIMBER-V、Cerberus 等未在 domain 主表中的重要分支。潜在 venue: CSUR、IEEE Access survey、ACM Computing Surveys、HOST、JSA。

### 12. SOTA README Addendum

- SOTA 定位: SoK/survey anchor
- 标准化 / 发表状态: peer-reviewed Electronics 2025; evidence source HTML only because PDF download returned 403
- 对应小方向: RISC-V TEE lineage; RISC-V CoVE / AP-TEE confidential VM

#### 内容摘要

该 survey 是 RISC-V secure enclave/TEE 的近期综述入口。

#### 研究背景

RISC-V TEE 从开放 enclave 原型发展到 CoVE/AP-TEE 草案，材料分散且层级不同。

#### 解决方案

按 RISC-V TEE 系统和机制归类代表性工作，帮助建立阅读路径。

#### 实验结果

Survey，无新实验；本地证据为 HTML 页面，PDF endpoint 自动下载 403。

#### 文章评价

可作为 taxonomy anchor，但机制和状态必须回引原始论文/spec，尤其是 draft/not ratified 规范。

### 13. SoK Citation Expansion

| Priority | Cited work | Role in SoK | Repo category | Local status | Next action |
|---|---|---|---|---|---|
| P0 | Sanctum | Foundational open-hardware enclave | `reference/risc-v-confidential-computing/sanctum-minimal-hardware-extensions-strong-software-isolation/` | existing, local PDF available | Finish Paper Review and cite for lineage. |
| P0 | Keystone | Open RISC-V enclave framework | `reference/risc-v-confidential-computing/keystone-open-framework-architecting-tees/` | existing, Paper Review available | Use as baseline. |
| P0 | Penglai | Scalable enclave memory protection | `reference/risc-v-confidential-computing/penglai-scalable-memory-protection/` | existing, Paper Review available | Use as academic SOTA. |
| P0 | SPEAR-V | Practical RISC-V enclave primitive | `reference/risc-v-confidential-computing/spear-v-secure-practical-enclave-architecture-risc-v/` | existing, Paper Review available | Use as academic SOTA. |
| P0 | CoVE/AP-TEE | Confidential VM architecture/spec | `reference/risc-v-confidential-computing/cove-towards-confidential-computing-on-risc-v-platforms/`; `risc-v-ap-tee-specification/` | existing, local PDFs available | Use for confidential VM section. |
| P0 | CoVE-IO | Confidential I/O spec | `reference/risc-v-confidential-computing/risc-v-cove-io-specification/` | existing, local PDF available | Use for trusted I/O section. |
| P1 | TIMBER-V | Embedded tagged-memory enclave | `reference/risc-v-confidential-computing/timber-v-tag-isolated-memory-fine-grained-enclaves-risc-v/` | added, Paper Review available | Use as embedded branch. |
| P1 | Cerberus | Formal enclave memory sharing | `reference/risc-v-confidential-computing/cerberus-formal-approach-secure-efficient-enclave-memory-sharing/` | added, Paper Review available | Use for sharing/formal proof discussion. |
| P1 | ACE | Embedded RISC-V confidential computing | `reference/risc-v-confidential-computing/ace-confidential-computing-embedded-risc-v-systems/` | existing, local PDF available | Finish Paper Review when writing embedded subsection. |
<!-- END PAPER REVIEW -->
