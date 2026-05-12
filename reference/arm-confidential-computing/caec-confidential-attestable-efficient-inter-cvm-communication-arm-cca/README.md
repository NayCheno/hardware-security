# CAEC: Confidential, Attestable, and Efficient Inter-CVM Communication with Arm CCA

- BibTeX key: `abdollahi2025caec`
- Category: `arm-confidential-computing`
- Authors: Sina Abdollahi; Amir Al Sadi; David Kotz; Marios Kogias; Hamed Haddadi
- Year: 2025
- Source: https://arxiv.org/abs/2512.01594
- PDF source: https://arxiv.org/pdf/2512.01594
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Evidence role: Draft/not ratified. Use with explicit draft, preprint, or not-ratified status; do not treat as ratified standard, mature production evidence, or peer-reviewed consensus unless the source metadata says so.

<!-- BEGIN PAPER REVIEW -->
## Paper Review
### 1. 论文基本信息

- 论文标题: CAEC: Confidential, Attestable, and Efficient Inter-CVM Communication with Arm CCA
- 作者 / 机构: Sina Abdollahi 等 / Imperial College London, Dartmouth College
- 发表会议 / 年份: IEEE EuroS&P 2026 / arXiv 2026
- 领域分类: 系统 / 安全 / 架构
- 一句话总结: CAEC 在 Arm CCA 中扩展 firmware 支持 Confidential Shared Memory，让互相 attested 的 CVM 共享 plaintext memory 且 hypervisor 不可访问。
- 最核心贡献一句话: 它是 Arm CCA inter-CVM confidential sharing 的近期 Draft/not ratified 证据。

### 2. 研究问题与背景

现有 CVM 架构采用 disjoint memory model，CVM 只能与 hypervisor shared memory 通信，inter-CVM plaintext sharing 需要加密/解密，效率差。ML/agentic/compartmentalized services 需要 CVM 间高效共享大对象和消息。CAEC 目标是在不改 CCA 硬件的情况下实现可证明/可 attested 的 CSM。

### 3. 核心方法拆解

机制路径为 `mutual attestation -> RMM ownership/access-control extension -> Confidential Shared Memory region -> direct CVM plaintext exchange -> hypervisor excluded`。核心模块包括 CSM metadata、ownership model、RMM checks、attestation extensions、realm access-control rules 和 ABI integration。

### 4. 安全性 / 正确性分析

威胁模型仍假设 hypervisor 不可信，并进一步要求未授权 CVM 不能访问 CSM。强项是利用 CCA firmware/RMM 可扩展性，显式维护 CSM ownership 和 attestation。风险在于 RMM 新接口、CSM lifecycle、revocation、concurrency 和 malicious participating CVM 行为。

### 5. 实现细节

论文称 CAEC 扩展 CCA firmware，增加约 4%-6% firmware code size，并在 CCA functional/performance prototypes 上实现。Artifact URL 在论文中给出。复现需 Arm CCA prototype/FVP/performance prototype 和多 realm workload。

### 6. 实验设计分析

论文报告 inter-CVM communication 相比 hypervisor-accessible shared memory + encryption 最高 209x CPU cycle reduction，并报告大模型共享可降低 16.6%-44.4% memory footprint。结果支撑性能主张，但安全证明和真实硬件部署仍需更多 evidence。

### 7. Novelty 分析

分类: strong research novelty。它扩展 disjoint CVM memory model，支持 protected inter-CVM sharing，同时保持 CCA 硬件兼容。

### 8. 局限性与可能漏洞

最大限制是 arXiv/未来会议状态和基于 prototype。CSM 引入新的 sharing lifecycle 和 revocation 问题；participating CVM 本身恶意时如何限制数据滥用不完全由机制解决。与 Cerberus read-only sharing 相比，CAEC 更强但验证复杂度更高。

### 9. 和已有工作的关系

相关工作包括 Cerberus、PIE、Elasticlave 和 CCA/RMM。CAEC 是 Arm CCA 上 inter-CVM mutable/plaintext sharing 的代表，可与 RISC-V CoVE shared pages 和 Cerberus formal sharing 对照。

### 10. 复现与再实现计划

最小复现目标是在 CCA prototype 上建立两个 realm，完成 mutual attestation、CSM create/map/write/read/revoke。需要 CAEC artifact、CCA stack、microbenchmark 和加密 shared-memory baseline。验收标准是 hypervisor 读不到 CSM，未授权 realm 访问失败，cycle/memory footprint 优于 baseline。

### 11. 对后续研究的启发

1. CAEC-style CSM 在 RISC-V CoVE 的可行性。2. Mutable CSM 的形式化安全模型。3. Revocation 和 crash consistency。4. CSM 与 confidential accelerator buffer sharing。5. 多租户 ML model sharing policy。潜在 venue: IEEE S&P、USENIX Security、CCS、EuroSys、OSDI。

### 12. Evidence README Addendum
- Evidence role: Draft/not ratified. Use with explicit draft, preprint, or not-ratified status; do not treat as ratified standard, mature production evidence, or peer-reviewed consensus unless the source metadata says so.
- 标准化 / 发表状态: accepted EuroS&P 2026 / arXiv 2026
- 对应小方向: Arm CCA 细粒度隔离与部署模型; inter-CVM sharing

#### 内容摘要

CAEC 在 Arm CCA 中实现 confidential shared memory，让多个 attested CVM 直接共享 plaintext 数据而不暴露给 hypervisor。

#### 研究背景

CVM disjoint memory model 让 inter-CVM communication 必须经 hypervisor-visible memory 并加密，开销高。

#### 解决方案

扩展 RMM/firmware，加入 CSM ownership、access control 和 attestation semantics，无需修改 CCA 硬件。

#### 实验结果

论文报告 inter-CVM communication 最高 209x CPU cycle reduction，LLM/model sharing 场景 memory footprint 降低 16.6%-44.4%。

#### 文章评价

这是 CCA sharing 的重要 Draft/not ratified 证据。新共享模型也引入 revocation、concurrency 和 verification 复杂性，正文需和 Cerberus/CoVE shared memory 对照。
<!-- END PAPER REVIEW -->
