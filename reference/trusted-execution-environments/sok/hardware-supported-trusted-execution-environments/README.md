# SoK: Hardware-supported Trusted Execution Environments

- BibTeX key: `schneider2022soktee`
- Category: `trusted-execution-environments/sok`
- Authors: Moritz Schneider et al.
- Year: 2022
- Source: https://arxiv.org/abs/2205.12742
- PDF source: https://arxiv.org/pdf/2205.12742
- Local PDF: `paper.pdf`
- Download status: downloaded and verified

- Evidence role: Background substrate. Use for taxonomy, lineage, or adjacent data-path substrate; primary mechanism claims must be traced to original papers, specs, or platform documents.

<!-- BEGIN REVIEW -->
## Review
### 1. 论文基本信息

- 论文标题: SoK: Hardware-supported Trusted Execution Environments
- 作者 / 机构: Moritz Schneider et al.; ETH Zurich / Intel
- 发表会议 / 年份: arXiv 2022
- 领域分类: 系统 / 安全 / 架构
- 一句话总结: 论文把硬件辅助 TEE 的可验证启动、运行时隔离、可信 I/O 和安全存储抽象成可比较的设计空间。
- 最核心贡献一句话: 它提供跨 SGX、TrustZone、SEV、Sanctum、Keystone 等 TEE 的机制级 taxonomy，适合作为本项目知识域划分的 SoK 锚点。

### 2. 研究问题与背景

论文要解决商业和学术 TEE 名称、威胁模型、ISA 与部署场景差异很大而难以比较的问题。PDF 第 1 页摘要明确指出既有 TEE 缺少 holistic systematization。安全模型覆盖软件 adversary、部分硬件/物理 adversary、peripheral adversary 等，但不同 TEE 的侧信道、物理攻击和设备攻击假设不一致。

### 3. 核心方法拆解

方法是 taxonomy: usage model -> adversary class -> verifiable launch -> CPU/memory isolation -> trusted I/O -> secure storage。它把产品名下沉为 launch measurement、内存加密/完整性、SoC request provenance、peripheral access control 等机制构件。它不是提出新系统，而是提供分类框架。

### 4. 安全性 / 正确性分析

贡献来自比较和归纳，不是形式化证明。它能揭示可信 I/O 与 secure storage 经常被弱化，但对每个系统的具体漏洞复现不是重点。用于本项目时应作为覆盖矩阵依据，不能作为某平台安全性的实验证明。

### 5. 实现细节

无实现。证据来自公开论文、规范和设计分析。复现难点在于保持 taxonomy 与 2024--2026 年的新规范同步。

### 6. 实验设计分析

无传统实验。评价指标是安全目标、攻击面、TCB、可信 I/O、secure storage 等机制覆盖度。缺点是新近 CCA、CoVE-IO、TDISP 等内容需要后续补充。

### 7. Novelty 分析

分类: solid systems contribution。新意在于跨平台、机制级、可比较的 TEE 设计空间。

### 8. 局限性与可能漏洞

最大局限是时间截面: 2022 之后的 Arm CCA、RISC-V CoVE/AP-TEE、CoVE-IO 和 accelerator TEE 需要额外补齐。商业落地和标准化状态讨论有限。

### 9. 和已有工作的关系

它可作为 Pinto TrustZone survey、Cerdeira TrustZone SoK、Intel SGX/AMD SEV/Arm CCA/RISC-V TEE lineage 的上位框架。本项目应先引用它建立 design-space，再用领域 SoK 和明确 evidence role 的论文补细节。

### 10. 复现与再实现计划

最小复现目标是重建 TEE 机制矩阵: launch、runtime isolation、memory encryption/integrity、I/O、storage、attestation、TCB。验收标准是每个知识点都有 SoK/survey anchor 或明确标注无 SoK。

### 11. 对后续研究的启发

1. 更新 2026 版硬件 TEE taxonomy。2. 区分 access control、encryption、integrity、replay protection。3. 单独评估 trusted I/O 商用阻碍。4. 统一 attestation evidence chain。5. 建立 confidential accelerator 跨平台比较基准。
<!-- END REVIEW -->
