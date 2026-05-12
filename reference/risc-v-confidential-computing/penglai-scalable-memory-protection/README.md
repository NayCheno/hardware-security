# Scalable Memory Protection in the Penglai Enclave

- BibTeX key: `feng2021penglai`
- Category: `risc-v-confidential-computing`
- Authors: Erhu Feng et al.
- Year: 2021
- Venue: 15th USENIX Symposium on Operating Systems Design and Implementation (OSDI 2021)
- Source: https://www.usenix.org/conference/osdi21/presentation/feng
- PDF source: https://www.usenix.org/system/files/osdi21-feng.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified

- Evidence role: Peer-reviewed SOTA. Use for the specific mechanism, evaluation, and threat-model scope established by the source; avoid broader claims outside its evidence class.

<!-- BEGIN REVIEW -->
## Review
### 1. 论文基本信息

- 论文标题: Scalable Memory Protection in the Penglai Enclave
- 作者 / 机构: Erhu Feng et al.; Shanghai Jiao Tong University / Shanghai AI Laboratory
- 发表会议 / 年份: OSDI 2021
- 领域分类: 系统 / 架构 / 安全
- 一句话总结: Penglai 用软硬件协同解决 RISC-V enclave 的可扩展安全内存和快速初始化问题。
- 最核心贡献一句话: GPT 与 MMT 两个硬件原语把 RISC-V enclave 从小规模静态保护推进到大规模动态保护。

### 2. 研究问题与背景

论文关注 serverless/microservice 场景下 enclave 数量多、生命周期短、内存需求动态变化的问题。已有 SGX/TrustZone/早期 RISC-V enclave 受静态安全内存、容量限制和初始化成本约束。这个 gap 真实，PDF 第 2--3 页明确讨论 1,000s enclaves、512GB secure memory 和启动延迟。

### 3. 核心方法拆解

架构为: untrusted Linux -> enclave driver/lib -> secure monitor -> GPT/MMT hardware -> encrypted/integrity-protected memory。GPT 保护页表页以提供页级隔离；MMT 支持可挂载 Merkle tree；shadow enclave/fork-style creation 降低初始化延迟。

### 4. 安全性 / 正确性分析

威胁模型包括不可信 OS 与对 enclave 内存的访问/篡改。安全性依赖 monitor、GPT/MMT、内存加密和完整性树。侧信道不是主要解决目标，证据不足以覆盖 cache/controlled-channel 攻击。

### 5. 实现细节

实现基于 Penglai RISC-V enclave，修改 Rocket Core、memory controller、Linux kernel、secure monitor 和 SDK。PDF 第 3 页称 monitor 约 6,399 LoC，并在 FPGA、QEMU、Gem5 上实现。

### 6. 实验设计分析

论文用 RV8、CoreMark、Redis、MapReduce 和 serverless application 评估。核心结果: 支持 1,000s concurrent enclaves、512GB secure memory；CPU-intensive benchmark 开销可忽略，Redis 约 5% overhead；16MB enclave memory 下启动优化约三数量级；MapReduce shadow fork 约 3.6x speedup。

### 7. Novelty 分析

分类: potentially top-tier contribution。它不仅是 RISC-V enclave 工程实现，还提出面向大规模动态 enclave 的硬件内存保护机制。

### 8. 局限性与可能漏洞

局限包括硬件修改要求、侧信道未系统解决、商业 SoC 采用门槛高。MMT/GPT 与现有 RISC-V 标准化路径之间的关系需要谨慎表述，不应等同于 CoVE 标准。

### 9. 和已有工作的关系

Penglai 与 Keystone 同属 pre-CoVE RISC-V TEE lineage，但更强调 scalable memory protection。它也为后续 CoVE/AP-TEE 的 memory ownership 讨论提供设计背景。

### 10. 复现与再实现计划

最小复现目标是在 QEMU/Gem5 上跑 Penglai monitor、创建多 enclave 并测启动/Redis。验收标准是复现 GPT overhead、enclave count scaling 和 shadow fork speedup 趋势。

### 11. 对后续研究的启发

1. 将 GPT/MMT 映射到 CoVE memory tracking。2. 研究标准化 memory integrity primitive。3. 将 serverless lifecycle 与 attestation 绑定。4. 评估 side-channel hardening。5. 探索商业硬件成本和兼容性。
<!-- END REVIEW -->
