# SoK: Understanding Design Choices and Pitfalls of Trusted Execution Environments

- BibTeX key: `li2024sokteechoices`
- Category: `trusted-execution-environments/sok`
- Authors: Mengyuan Li; Yuheng Yang; Guoxing Chen; Mengjia Yan; Yinqian Zhang
- Year: 2024
- Venue: ACM Asia Conference on Computer and Communications Security (ASIA CCS 2024)
- Source: https://doi.org/10.1145/3634737.3644993
- PDF source: https://people.csail.mit.edu/mengyuanli/files/asiaccs_sok.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- SOTA role: SoK/survey anchor for server-side TEE runtime design choices and pitfalls; use with `schneider2022soktee` for general TEE taxonomy and with original platform papers for mechanism claims.

## Citation Triage

| Priority | Cited work | Role in SoK | Repo category | Local status | Next action |
|---|---|---|---|---|---|
| P0 | Sanctum | RISC-V/open hardware enclave baseline | `reference/risc-v-confidential-computing/sanctum-minimal-hardware-extensions-strong-software-isolation/` | added, local PDF available | Review and map against Keystone/Penglai/CoVE lineage. |
| P0 | CURE | Customizable RISC-V enclave and peripheral-binding baseline | `reference/risc-v-confidential-computing/cure-customizable-resilient-enclaves/` | added, local PDF available | Review for I/O and accelerator TEE discussion. |
| P1 | MI6 | Speculative out-of-order RISC-V enclave baseline | `reference/risc-v-confidential-computing/mi6-secure-enclaves-speculative-out-of-order-processor/` | added, local PDF available | Review when expanding side-channel/speculation limits. |
| P1 | Keystone / Penglai | Existing RISC-V enclave lineage | `reference/risc-v-confidential-computing/` | existing, local PDFs available | Already covered as lineage anchors. |
| P2 | Intel TDX / IBM PEF | Out-of-scope platform comparison | not added | metadata only | Add later only if x86/IBM confidential VM comparison becomes in-scope. |

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 1. 论文基本信息

- 论文标题: SoK: Understanding Design Choices and Pitfalls of Trusted Execution Environments
- 作者 / 机构: Mengyuan Li; Yuheng Yang; Guoxing Chen; Mengjia Yan; Yinqian Zhang / MIT, SJTU, SUSTech
- 发表会议 / 年份: ASIA CCS 2024
- 领域分类: 系统 / 安全 / 架构
- 一句话总结: 论文用 TRAF 框架拆解 server-side TEE 在 CPU、memory、I/O runtime management 上的设计选择和常见坑。
- 最核心贡献一句话: 它把 TEE 从产品罗列提升到 resource-management modes 和 pitfall taxonomy，适合作为本仓库通用 TEE SoK 锚点。

### 2. 研究问题与背景

云场景中 TEE 既要让 host/CSP 管资源，又要防止 host 破坏 TEE instance 的 confidentiality/integrity。不同平台如 SGX、TDX、SEV、CCA、PEF、Keystone、Sanctum、CURE、Penglai 设计差异大，攻击也来自 host 仍控制某些 corner-case resources。论文 gap 真实存在，因为单独阅读平台论文很难看出 CPU/memory/I/O 管理权如何拆分。

### 3. 核心方法拆解

核心方法是 TEE Runtime Architectural Framework。分析路径为 `TEE lifecycle -> resource-management task -> unprotected/RTPM-only/RTPM-guarded/instance-assisted mode -> security implication -> known attack/pitfall`。TRAF 分析 CPU virtualization、memory management、I/O management 和 remote attestation，并把设计选择与 TCB size、performance、security tradeoff 关联。

### 4. 安全性 / 正确性分析

论文是 SoK，不提供新防御证明。安全贡献在于指出设计 flaws 常来自 untrusted host 仍管理未充分保护的资源。它明确 commercial TEE 常排除 DoS 和 microarchitectural side-channel。用于本项目时，它能支撑 taxonomy 和 pitfall 叙述，但具体机制安全性必须回引 Arm CCA/RISC-V AP-TEE/SEV-SNP 等原始规范。

### 5. 实现细节

无实现。证据来自平台规范、论文和攻击案例。复现工作是重建 TRAF 表格，并把 2025/2026 新材料如 CoVE-IO、OpenCCA、CAEC、Devlore 归入对应 management mode。

### 6. 实验设计分析

无传统实验。评价是系统化分类和案例分析。优点是覆盖 server-side TEEs 和 known attacks；局限是 embedded TrustZone/CHERIoT/TIMBER-V 不在主要范围内，且 2024 之后 draft specs 需要更新。

### 7. Novelty 分析

分类: strong research novelty。TRAF 的 mode-based 分解比普通 survey 更适合解释 TEE 为什么在资源管理 corner case 出错。

### 8. 局限性与可能漏洞

最大局限是 SoK 时间截面和 scope: embedded TEEs、accelerator TEE、CoVE-IO/TDISP/PCIe IDE 的最新细节不充分。它对某些商业平台依赖公开资料，无法验证 closed-source Manufacturer TCB。

### 9. 和已有工作的关系

它补充 `schneider2022soktee` 的硬件 TEE taxonomy，更聚焦 server-side runtime design choices。它引用/覆盖 RISC-V lineage 中 Sanctum、Keystone、CURE、Penglai 等，可作为本轮一跳扩展下载的依据。

### 10. 复现与再实现计划

最小复现目标是用 TRAF 重建本 survey 的 TEE design table: CPU、memory、I/O、attestation、TCB mode。需要读取 CCA、AP-TEE、CoVE-IO、SEV-SNP、TDX 和 RISC-V enclave 原文。验收标准是每个小节能说明 host、RTPM/TSM/RMM 和 guest/realm/TVM 的职责边界。

### 11. 对后续研究的启发

1. 将 TRAF 扩展到 CoVE-IO/TDISP/IDE trusted I/O。2. 把 Arm CCA RME/RMM 与 RISC-V TSM 做 mode-by-mode 对照。3. 构建 TEE pitfall checklist 用于审计新论文。4. 研究 inter-CVM sharing 的 management-mode 转换。5. 将 accelerator TEE 加入 resource-management taxonomy。潜在 venue: CSUR、IEEE S&P SoK、USENIX Security、CCS、NDSS。

### 12. SOTA README Addendum

- SOTA 定位: SoK/survey anchor
- 标准化 / 发表状态: peer-reviewed ASIA CCS 2024
- 对应小方向: 硬件辅助 TEE 总体设计空间; Arm CCA / RISC-V CoVE 对照

#### 内容摘要

论文提出 TRAF，从 runtime resource management 角度解释 server-side TEE 设计选择和坑。

#### 研究背景

TEE 要在 untrusted host 仍负责资源管理的前提下提供 SRE，因此安全问题经常出在职责划分和 corner-case enforcement。

#### 解决方案

将 runtime task 分为 unprotected、RTPM-only、RTPM-guarded、instance-assisted 四种模式，并映射 CPU、memory、I/O 管理。

#### 实验结果

SoK，无新实验；证据来自平台论文、规范和攻击案例。

#### 文章评价

非常适合 survey 的总框架。机制细节不能只引用它，必须回到每个平台原始论文/spec。

### 13. SoK Citation Expansion

| Priority | Cited work | Role in SoK | Repo category | Local status | Next action |
|---|---|---|---|---|---|
| P0 | Sanctum | RISC-V/open-hardware enclave baseline | `reference/risc-v-confidential-computing/sanctum-minimal-hardware-extensions-strong-software-isolation/` | existing, local PDF available | Add/finish lineage review before writing survey section. |
| P0 | Keystone | RISC-V open enclave framework | `reference/risc-v-confidential-computing/keystone-open-framework-architecting-tees/` | existing, Paper Review available | Use as baseline. |
| P0 | CURE | Customizable RISC-V enclave | `reference/risc-v-confidential-computing/cure-customizable-resilient-enclaves/` | existing, local PDF available | Add/finish lineage review. |
| P1 | MI6 | Speculative OoO enclave | `reference/risc-v-confidential-computing/mi6-secure-enclaves-speculative-out-of-order-processor/` | existing, local PDF available | Use for speculation/side-channel boundary. |
| P1 | TIMBER-V | Embedded tagged-memory enclave | `reference/risc-v-confidential-computing/timber-v-tag-isolated-memory-fine-grained-enclaves-risc-v/` | added, Paper Review available | Use as embedded lineage branch. |
| P1 | Cerberus | Formal enclave memory sharing | `reference/risc-v-confidential-computing/cerberus-formal-approach-secure-efficient-enclave-memory-sharing/` | added, Paper Review available | Use for memory-sharing comparison. |
| P2 | Intel TDX / AMD SEV / IBM PEF | Cross-platform comparison | partially in Bib/reference | backlog | Add only when x86/IBM comparison enters正文. |
<!-- END PAPER REVIEW -->
