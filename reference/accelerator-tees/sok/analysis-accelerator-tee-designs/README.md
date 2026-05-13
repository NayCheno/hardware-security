# SoK: Analysis of Accelerator TEE Designs

- BibTeX key: `sok-tee`
- Category: `accelerator-tees/sok`
- Authors: Chenxu Wang et al.
- Year: 2026
- Venue: Network and Distributed System Security Symposium (NDSS 2026)
- Source: https://www.ndss-symposium.org/wp-content/uploads/2026-f1424-paper.pdf
- PDF source: https://www.ndss-symposium.org/wp-content/uploads/2026-f1424-paper.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-10
- Evidence role: Background substrate. Use for taxonomy, lineage, or adjacent data-path substrate; primary mechanism claims must be traced to original papers, specs, or platform documents.

## SoK Citation Expansion

| Candidate / baseline | Canonical key | Reference record | Status | Survey use |
|---|---|---|---|---|
| Graviton | `volos2018graviton` | `reference/accelerator-tees/graviton-trusted-execution-environments-gpus/` | promoted; local PDF verified | Foundational GPU secure-context baseline. |
| Telekine | `hunt2020telekine` | `reference/accelerator-tees/telekine-secure-computing-cloud-gpus/` | promoted; local PDF verified | GPU TEE runtime/API-remoting baseline; side-channel discussion is boundary context only. |
| Honeycomb | `mai2023honeycomb` | `reference/accelerator-tees/honeycomb-secure-efficient-gpu-executions-static-validation/` | promoted; local PDF verified | Static-validation GPU TEE baseline. |
| ShEF | `zhao2022shef` | `reference/accelerator-tees/shef-shielded-enclaves-cloud-fpgas/` | promoted; local PDF verified | Cloud FPGA TEE baseline. |
| XpuTEE | `fan2025xputee` | `reference/accelerator-tees/xputee-high-performance-practical-heterogeneous-tee-gpus/` | promoted as source-limited; local PDF unavailable | Recent CPU/GPU heterogeneous TEE metadata; abstract-level claim only. |
| SGX-FPGA | `xia2021sgxfpga` | `reference/accelerator-tees/sgx-fpga-trusted-execution-cpu-fpga-heterogeneous-architecture/` | promoted as source-limited; local PDF unavailable | CPU-FPGA lineage marker only; no strong mechanism claim. |
| SoK: Trusted Execution in SoC-FPGAs | `perkins2024socsok` | `reference/accelerator-tees/sok/trusted-execution-soc-fpgas/` | promoted; local PDF verified | SoC-FPGA TEE gap/taxonomy support. |

<!-- BEGIN PAPER REVIEW -->
## Paper Review
### 1. 论文基本信息

- 论文标题: SoK: Analysis of Accelerator TEE Designs
- 作者 / 机构: Chenxu Wang and Junjie Huang
- 发表会议 / 年份: NDSS 2026
- 领域分类: 系统 / 安全 / 架构
- 一句话总结: 论文系统化梳理 accelerator TEE 的威胁模型、设计组件和安全/性能权衡。
- 最核心贡献一句话: 它适合作为本项目 accelerator TEE 小方向的 SoK 锚点，但不能替代 Arm CCA、RISC-V CoVE 或通用硬件 TEE SoK。

### 2. 研究问题与背景

GPU、NPU、DPU 和其他加速器已经进入多租户 confidential workload 的数据路径。CPU TEE 只能保护 CPU 执行上下文；如果加速器的命令队列、设备内存、DMA、调度器或驱动栈不在可信边界内，数据仍可能在 offload 路径泄漏。

### 3. 核心方法拆解

论文采用 SoK 方法，把 accelerator TEE 拆成威胁模型、设备身份、隔离域、内存/总线保护、驱动/运行时 TCB、调度与 attestation 等设计维度。它的价值在于把不同 accelerator TEE 方案放进同一比较框架，而不是提出一个新系统。

### 4. 安全性 / 正确性分析

安全分析主要来自分类和已有方案比较。用于本项目时，应把它作为 accelerator TEE taxonomy 和 open challenges 的证据，而不是作为某个具体系统安全性的实验证明。

### 5. 实现细节

无新系统实现。证据来源为本地 `paper.pdf` 与公开 NDSS 论文页面。

### 6. 实验设计分析

Survey/SoK，无新实验。评价重点是设计维度覆盖、威胁模型边界、TCB 差异和部署阻碍。

### 7. Novelty 分析

分类: solid systems contribution。新意来自 accelerator TEE 设计空间的系统化整理，尤其适合补全 CPU TEE survey 常弱化的设备和加速器部分。

### 8. 局限性与可能漏洞

SoK 的时间截面决定其对 2026 年之后新规范和商用实现不完整。它也不能直接回答 Arm CCA RME-DA、RISC-V CoVE-IO、PCIe TDISP/IDE 等标准细节，需要和原始规范一起引用。

### 9. 和已有工作的关系

应与 `schneider2022soktee` 形成上下位关系：前者覆盖通用硬件 TEE design space，本文覆盖 accelerator TEE 这个更窄但更接近现代 confidential AI/packet-processing 的方向。

### 10. 复现与再实现计划

最小复现目标是重建 accelerator TEE 机制矩阵：设备身份、DMA/MMIO 保护、命令队列隔离、设备内存保护、driver/runtime TCB、attestation 和调度隔离。验收标准是每个 accelerator TEE 方向都能映射到至少一个机制维度和一个可信来源。

### 11. 对后续研究的启发

1. 统一 CPU TEE 与 accelerator TEE 的 attestation evidence chain。
2. 比较 CoVE-IO、TDISP、PCIe IDE 与 vendor accelerator TEE 的边界。
3. 评估 confidential accelerator 的调度侧信道。
4. 为 SmartNIC/DPU 建立可复现实验基准。
5. 研究加速器驱动最小化 TCB 的工程路线。

### 12. SOTA README Addendum
- SOTA 定位: SoK/survey anchor
- 标准化 / 发表状态: peer-reviewed NDSS 2026 paper
- 对应小方向: Arm CCA I/O / accelerator; RISC-V confidential I/O; accelerator TEEs

#### 内容摘要

本文把 accelerator TEE 从若干孤立系统论文整理为可比较的设计空间，强调 CPU TEE 的安全边界必须延伸到设备、加速器运行时和 I/O 路径。

#### 研究背景

Confidential computing 工作负载越来越依赖 GPU、NPU、DPU、SmartNIC 等设备。传统 TEE 论文常把设备路径作为外部假设处理，导致 DMA、设备内存、队列和中断成为绕过点。

#### 解决方案

论文通过 SoK taxonomy 梳理 accelerator TEE 设计维度，并比较不同方案如何处理设备身份、内存隔离、driver/runtime TCB、数据路径保护和 attestation。妙处在于把 accelerator 视为完整可信执行链的一部分，而不是单纯外设。

#### 实验结果

Survey/SoK，无新实验。证据来自对已有 accelerator TEE 方案和标准组件的归纳比较。

#### 文章评价

优点是方向贴近当前 accelerator TEE 前沿，能补上通用 TEE survey 对加速器覆盖不足的问题；不足是无法替代原始系统论文或规范的机制细节。商业落地潜力高，但取决于设备厂商、IOMMU/TDISP/IDE/CoVE-IO 等标准和云平台编排栈是否协同成熟。

### 13. SoK Citation Expansion

| Priority | Cited work | Role in SoK | Repo category | Local status | Next action |
|---|---|---|---|---|---|
| P0 | Graviton / Telekine / Honeycomb | GPU TEE baselines | `reference/accelerator-tees/` | existing active references, local PDFs verified | Use original papers for mechanism claims. |
| P0 | ShEF / SGX-FPGA / SoC-FPGA SoK | FPGA and SoC-FPGA TEE baselines | `reference/accelerator-tees/` | ShEF and SoC-FPGA local PDFs verified; SGX-FPGA source-limited | Keep SGX-FPGA at metadata-only claim strength. |
| P1 | XpuTEE | Recent heterogeneous GPU TEE baseline | `reference/accelerator-tees/xputee-high-performance-practical-heterogeneous-tee-gpus/` | source-limited, public PDF unavailable | Use only as metadata until PDF is recovered. |
| P1 | CAGE / PORTAL / ACAI / Devlore | Arm CCA accelerator and device-path systems | `reference/arm-confidential-computing/` | active references with explicit draft/preprint boundaries where applicable | Use original papers/specs for CCA-specific claims. |
| P2 boundary | GPU side-channel and physical attack works | Threat-model boundary | `survey/excluded_attack_reference.bib` where retained | excluded from active defense/spec corpus | Do not promote without a separate attack-scope plan. |
<!-- END PAPER REVIEW -->
