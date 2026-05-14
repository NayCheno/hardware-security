# SoK: Analysis of Accelerator TEE Designs

- BibTeX key: `sok-tee`
- Category: `accelerator-tees/sok`
- Authors: Chenxu Wang; Junjie Huang; Yujun Liang; Xuanyao Peng; Yuqun Zhang; Fengwei Zhang; Jiannong Cao; Hang Lu; Rui Hou; Shoumeng Yan; Tao Wei; Zhengyu He
- Year: 2026
- Venue: Network and Distributed System Security Symposium (NDSS 2026)
- Source: https://www.ndss-symposium.org/wp-content/uploads/2026-f1424-paper.pdf
- PDF source: https://www.ndss-symposium.org/wp-content/uploads/2026-f1424-paper.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-10
- Evidence role: Auxiliary SOTA for `01-tee-taxonomy`. Use for accelerator/device TEE taxonomy only. Mechanism claims for Arm CCA, RISC-V CoVE-IO, SPDM/TDISP, PCIe IDE, GPU/DPU/SmartNIC systems must be traced to original papers or specifications.

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
- 作者 / 机构: Chenxu Wang, Junjie Huang, Yujun Liang, Xuanyao Peng, Yuqun Zhang, Fengwei Zhang, Jiannong Cao, Hang Lu, Rui Hou, Shoumeng Yan, Tao Wei, Zhengyu He / SUSTech, Hong Kong Polytechnic University, Chinese Academy of Sciences, Ant Group 等
- 发表会议 / 年份: NDSS 2026
- 领域分类: 系统 / 安全 / 架构 / 硬件
- 一句话总结: 论文系统化分析 accelerator TEE，覆盖 GPU、NPU、TPU、FPGA、DPU/SmartNIC 等设备在 confidential workload 数据路径中的 access control、memory encryption、attestation、TCB 与 compatibility 问题。
- 最核心贡献一句话: 它把 CPU TEE 之外的设备侧可信边界变成可比较 taxonomy，是 01 中“TEE taxonomy 不能只停在 CPU/enclave/CVM”的关键辅助 SOTA。

### 2. 研究问题与背景

论文要解决的问题是: accelerator TEE 论文快速增长，但缺少统一框架。PDF p.1 摘要指出，现有研究多针对特定 CPU 或特定 accelerator，generalizability 不足；已有 TEE survey 只部分总结 accelerator computing threats/protections，缺少建设 accelerator TEE 的 framework 和不同安全方案优缺点比较。

背景数据:

- p.2-p.3 Motivation 说明，论文分析 51 个 accelerator TEE studies，Table I/p.2 汇总样本。
- 41/51 studies 在 2022 年之后提出，说明方向快速升温。
- 42/51 studies 依赖 CPU TEE，说明 accelerator TEE 常把 CPU-side TEE 当基础，而不是完全独立设备安全。
- 32/51 studies 面向 x86 平台，30/51 支持 GPU computing，反映云端异构计算主流形态。
- 40/51 studies 支持特定 CPU architecture，43/51 studies 只支持一种 accelerator，12/51 studies 释放 source code，说明迁移和复现困难。

三个 research questions:

1. RQ1: What is the typical framework of building an accelerator TEE?
2. RQ2: How to build an accelerator TEE with ensuring strong security on varied CPU/accelerator?
3. RQ3: What factors influence the accelerator TEE deployment on real-world platforms?

### 3. 核心方法拆解

本文是 SoK，不是新 accelerator TEE 系统。分析管线:

`paper collection -> accelerator TEE type -> attack vector -> security mechanism taxonomy -> deployment factors -> design insights`

核心模块:

| 模块 | 论文位置 | 核心内容 |
|---|---|---|
| Study corpus | Table I/p.2 | 51 个 accelerator TEE，覆盖 GPU/NPU/TPU/FPGA/general accelerator/industry designs |
| Architecture taxonomy | Figure 1/p.4, Table II/p.4-p.5 | Host-type、Acc.-type、Mix-type |
| Threat model | Figure 2/p.4-p.6 | task preparation/termination 与 task computing 阶段的 attack vectors |
| Access control | Table III/p.6, Table IV/p.7, Table V/p.8 | SAC1-SAC6 与部署场景偏好 |
| Memory encryption | Figure 3/p.9, Table VI/p.9, Table VII/p.9 | CPU/accelerator/I/O bus memory encryption 与 metadata granularity |
| Attestation | Figure 5/p.10-p.11, Figure 6/p.11, Table VIII/IX | accelerator HRoT、endorser、reference value、CPU-accelerator integrated attestation |
| TCB and compatibility | Table X/p.12-p.13, Table XII/XIII/p.14 | software stack size、TCB addition、multi-type support、plug-and-play support |

三类 accelerator TEE:

1. Host-type: 保护逻辑主要在 CPU-side TEE / hypervisor / firmware 中。适合复用已有 CPU TEE，但容易把 accelerator driver/runtime 放进 CVM/enclave，导致 TCB 膨胀。
2. Acc.-type: 保护逻辑迁移到 accelerator controller、accelerator memory encryption、device-side attestation 等。适合可修改 accelerator，但需要硬件/firmware 支持。
3. Mix-type: CPU-side 与 accelerator-side 都有安全组件，通常更接近 TDISP/DSM/IDE 这类 industry direction，但实现和兼容性复杂。

### 4. 安全性 / 正确性分析

Threat model:

- Figure 2/p.4 将 accelerator computing 分成 task preparation/termination stage 与 task computing stage。
- 攻击对象包括 accelerator workload: input/output data、model parameters、task code、page tables、confidential metadata；也包括 accelerator environment: CPU/accelerator hardware status、driver/runtime/software stack。
- 攻击来源覆盖 compromised host OS/hypervisor、malicious accelerator software、malicious tasks、physical threats、I/O bus tampering、firmware/driver trust-chain 问题。

安全机制边界:

- Access control 只能回答“谁能访问 workloads、MMIO、DMA、driver/software stack”。它不能自动解决 memory confidentiality/freshness，也不能证明 accelerator 环境可被远程验证。
- Memory encryption 解决 host memory、accelerator memory、I/O bus 上的 confidentiality/integrity/freshness；但 Figure 3 和 Table VII/p.9 显示 metadata granularity 和 CPU/accelerator encryption granularity mismatch 会带来显著 overhead。
- Attestation 解决 authenticity 和 environment verification；Figure 6/p.11 与 Table IX/p.11 显示很多 accelerator 缺少完整 attestation implementation，导致可被 emulation/replacement 或 trust-chain 攻击。

可支撑的 claim:

- Accelerator TEE 的安全边界至少要覆盖 access control、memory encryption、attestation 三个机制。
- 只保护 CPU/enclave/CVM 不足以覆盖 GPU/NPU/DPU/FPGA 数据路径。
- TCB 与 compatibility 是部署瓶颈，不只是安全机制设计问题。

不能支撑的 claim:

- 不能用本文证明某一个 GPU/DPU/SmartNIC 方案安全。
- 不能用本文替代 TDISP、PCIe IDE、SPDM、CoVE-IO、Arm CCA RME-DA 等规范。
- 不能把 Figure 4 的 overhead 当成所有 accelerator TEE 的通用性能结论；它是论文针对特定 memory encryption granularity mismatch 的分析/实验展示。

### 5. 实现细节

- Code size: 无新系统实现；Table X/p.12-p.13 汇总多个 accelerator TEE 的 system TCB size；Table XII/p.14 汇总 accelerator software stack size。
- Language: 论文未说明。
- Modified components: CPU-side TEE, TSM/RMM/SVSM/monitor, hypervisor, firmware, accelerator controller, encryption module, attestation module, IO bus filters, DSM/TDISP-like device security modules, accelerator drivers/runtime。
- Platform dependencies: GPU/NPU/TPU/FPGA/DPU/SmartNIC；x86/Arm/RISC-V CPU；PCIe/CXL-like links；TDISP/SPDM/IDE 生态。
- Open source or artifact availability: 本文无 artifact。p.3 指出只有 12/51 studies release source code。
- Hardest implementation part: 在不把巨大 accelerator driver/runtime 加入 TCB 的前提下，同时实现 device identity、memory/bus protection、queue/page-table/workload isolation、attested scheduling 和 multi-type compatibility。

### 6. 实验设计分析

本文是 SoK，无新 end-to-end accelerator TEE 系统实验。它包含系统化统计、表格比较和一个用于说明 memory encryption granularity mismatch 的 performance analysis。

证据对象:

- Table I/p.2: 51 个 studies corpus。
- Figure 1/p.4 与 Table II/p.4-p.5: accelerator TEE type taxonomy。
- Figure 2/p.4-p.6: attack vectors。
- Table III/p.6: security solutions comparison。
- Table IV/p.7: access control solution preference。
- Figure 3/Table VI/Table VII/p.9: memory encryption workflows、missing encryption implications、metadata comparison。
- Figure 4/p.10: LLM inference with SME solutions，secure initialization overhead 47.88%-73.45%，secure communication overhead 40.36%-44.94%。这应写成 SoK 中的 illustrative analysis，不是通用系统 benchmark。
- Figure 5/Figure 6/Table VIII/Table IX/p.10-p.11: attestation process and support。
- Table X-XIII/p.12-p.14: TCB size、software stack size、compatibility。

评价:

- 覆盖面很强，适合做 accelerator/device TEE 的 taxonomy anchor。
- 表格多、维度细，适合从 README 提炼成 PPT 机制矩阵。
- 由于不是新系统论文，不能把它的分析表当作某个方案的独立安全证明。

### 7. Novelty 分析

分类: `strong research novelty` for SoK / `solid systems contribution` for mechanism evidence。

理由: 它不是简单罗列 GPU/FPGA/NPU 论文，而是提出 Host-type、Acc.-type、Mix-type 三类架构，并把 access control、memory encryption、attestation、TCB、compatibility 作为建设 accelerator TEE 的主线。对本仓库而言，它填补了通用 CPU TEE SoK 对 device/accelerator path 覆盖不足的问题。

### 8. 局限性与可能漏洞

- 时间截面: 2026 后新设备、NVIDIA/AMD/Intel/Arm/RISC-V 规范状态可能变化。
- 证据异质: 51 个 studies 的 maturity 不同，包含 academic papers、industry designs、source-limited systems，不能简单同权比较。
- 真实部署缺口: 很多 accelerator TEE 只在特定 CPU/accelerator 上工作，43/51 只支持一个 accelerator type。
- TCB 难题: 表格显示 software stack 很大，例如 NVIDIA kernel driver、ROCm、CUDA/OpenCL 等可能 closed-source 或百万行规模；这会削弱“把 driver 放进 TEE”的安全性。
- Attestation 缺口: Figure 6/Table VIII/IX 显示很多 accelerator 缺少完整 vendor-supported attestation chain。
- TDISP 边界: p.15 说明 TDISP 是重要 industry framework，但不是 definitive solution；仍有 memory-encryption overhead、CPU-accelerator trust-chain、large TCB、compatibility 等盲点。

### 9. 和已有工作的关系

在 01 方向中，它是第二个辅助 SOTA:

- 对上补 `li2024sokteechoices`: Li 2024 的 TRAF 主要解释 server-side CPU TEE runtime resource management；本文把同样的 trust-boundary 问题扩展到 accelerator workloads、device memory、I/O bus、driver/runtime 和 device attestation。
- 与 `boubakri2025riscvtee` 互补: RISC-V survey 解释开放 ISA 的 enclave/confidential VM 谱系，本文解释异构设备的 TEE 谱系。
- 对下连接原始系统: Graviton、Telekine、Honeycomb、ShEF、ACAI、CAGE、PORTAL、StrongBox、TNIC、S-NIC、CoVE-IO、TDISP/IDE/SPDM 等需要用原始论文/spec 写机制 claim。

### 10. 复现与再实现计划

最小复现目标:

1. 复建 Table I 的 51-study corpus，并补齐本仓库 reference path、PDF status、evidence class。
2. 复建 Figure 1 的 Host/Acc/Mix 架构图，并标注 CPU-side、CC environment、accelerator-side TCB。
3. 对每个代表系统填入 access control、memory encryption、attestation、TCB addition、compatibility 维度。
4. 单独给 TDISP/PCIe IDE/SPDM/CoVE-IO 建立 spec evidence chain，避免把 SoK 表格当规范。

Acceptance criteria:

- 每个 accelerator TEE claim 都有原始论文/spec 或本文页码支撑。
- 对 source-limited 或 industry-only 材料只写状态，不写强机制/性能结论。
- 对性能数字明确标注是本文 illustrative analysis 或原始论文结果。

### 11. 对后续研究的启发

1. CPU-accelerator integrated attestation: 研究如何把 CPU TEE report、device HRoT、driver/runtime measurement、task evidence 组合成统一 verifier policy。
2. Driver/runtime TCB minimization: 将巨大 accelerator software stack 拆出 TCB，同时保留必要 queue/memory/MMIO protection。
3. Confidential accelerator scheduling: 设计既能保护 workload 又能让云平台调度 GPU/NPU/DPU 的 isolation/accounting 机制。
4. TDISP + workload semantics: TDISP 解决设备接口安全，但 AI model/task integrity 还需要 command/task-level attestation。
5. Multi-type accelerator TEE: 从单一 GPU/FPGA 扩展到 GPU+NPU+DPU/SmartNIC 组合 workload。
6. Secure memory metadata granularity: 针对 GPU/NPU 不同 access pattern 设计低开销 encryption/integrity/freshness metadata。

### 12. SOTA README Addendum

- SOTA 定位: Auxiliary SoK/survey anchor for accelerator/device TEE design space
- 标准化 / 发表状态: peer-reviewed NDSS 2026 paper
- 对应小方向: `01-tee-taxonomy` 的 accelerator/device TEE 辅助；`05-arm-cca-io-accelerator-interrupt`、`10-riscv-cove-io-tee-io`、`14-accelerator-dpu-smartnic-offload` 的背景 substrate

#### 内容摘要

本文把 accelerator TEE 从若干孤立 GPU/FPGA/NPU/DPU 系统论文整理为一个设计空间。读者可以用它理解: 当 confidential workload 使用 accelerator 后，敏感数据不再只在 CPU TEE 里，而会经过 driver、queue、device memory、I/O bus、accelerator firmware/controller 和 scheduler。

#### 研究背景

CPU TEE 解决的是 CPU 执行上下文和内存的一部分安全边界。现代 AI、图形、网络、存储和 SmartNIC/DPU offload 会把敏感数据推到设备侧。若设备没有 access control、memory encryption 和 attestation，host 即使看不到 CVM 内存，也可能通过 accelerator path 观察或篡改数据。

#### 解决方案

论文提出 Host-type、Acc.-type、Mix-type 三类 accelerator TEE 架构，并围绕 access control、memory encryption、attestation 三大机制组织设计空间。它还将 TCB size、software stack size、multi-type compatibility、plug-and-play support 纳入部署评价。

#### 实验结果

SoK，无新 end-to-end 系统实验。本文有 corpus statistics、taxonomy tables、attestation/memory-encryption analysis，以及 Figure 4 的 memory encryption granularity overhead 示例。PPT 中应把这些写成 evidence/coverage，而不是作为某个 accelerator TEE 系统的性能评测。

#### 文章评价

优点: 覆盖 accelerator/device TEE 前沿，能补齐 CPU TEE taxonomy 的盲区；表格和 RQ 结构适合转成清晰可读的 PPT。局限: 不能替代原始系统论文或规范；industry/spec 状态需要持续更新；多种材料成熟度不同。商业化潜力: 很高，尤其是 confidential AI、GPU cloud、DPU/SmartNIC、secure device assignment，但落地依赖厂商 HRoT、TDISP/SPDM/IDE、IOMMU/SMMU/IOPMP、driver TCB reduction 和云编排栈。

### 13. SoK Citation Expansion

| Priority | Cited work | Role in SoK | Repo category | Local status | Next action |
|---|---|---|---|---|---|
| P0 | Graviton / Telekine / Honeycomb | GPU TEE baselines | `reference/accelerator-tees/` | existing active references, local PDFs verified | Use original papers for mechanism claims. |
| P0 | ShEF / SGX-FPGA / SoC-FPGA SoK | FPGA and SoC-FPGA TEE baselines | `reference/accelerator-tees/` | ShEF and SoC-FPGA local PDFs verified; SGX-FPGA source-limited | Keep SGX-FPGA at metadata-only claim strength. |
| P1 | XpuTEE | Recent heterogeneous GPU TEE baseline | `reference/accelerator-tees/xputee-high-performance-practical-heterogeneous-tee-gpus/` | source-limited, public PDF unavailable | Use only as metadata until PDF is recovered. |
| P1 | CAGE / PORTAL / ACAI / Devlore | Arm CCA accelerator and device-path systems | `reference/arm-confidential-computing/` | active references with explicit draft/preprint boundaries where applicable | Use original papers/specs for CCA-specific claims. |
| P1 | TDISP / SPDM / PCIe IDE / CoVE-IO | Device interface and confidential I/O substrate | `reference/memory-and-io-fabrics/`; `reference/risc-v-confidential-computing/` | active references with spec/source-status labels | Use official specs for protocol/state-machine claims. |
| P2 boundary | GPU side-channel and physical attack works | Threat-model boundary | `survey/excluded_attack_reference.bib` where retained | excluded from active defense/spec corpus | Do not promote without a separate attack-scope plan. |
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `05-arm-cca-io-accelerator-interrupt` - Arm CCA I/O、DMA、Accelerator、Interrupt
- Paper key: `sok-tee`
- Role: accelerator/device TEE taxonomy bridge
- Evidence base: Wang/Huang 2026 local PDF; Table I; Figure 1/2; Table III; Figure 3/5/6; Table X-XIII.
- Boundary: 它是 SoK/taxonomy，不替代 ACAI、Devlore、TDISP、SPDM、IDE 或具体 GPU/FPGA/NPU 原文。

### 1. 完整题目 / 作者 / 会议

- 完整题目: SoK: Analysis of Accelerator TEE Designs
- 作者: Chenxu Wang, Junjie Huang, Yujun Liang, Xuanyao Peng, Yuqun Zhang, Fengwei Zhang, Jiannong Cao, Hang Lu, Rui Hou, Shoumeng Yan, Tao Wei, Zhengyu He
- 会议/来源: NDSS 2026
- Title evidence: Accelerator SoK title page; README metadata.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** 这篇 SoK 在 05 中的作用是把 ACAI 和 Devlore 放到更大设备侧 TEE 设计空间里。

- 动机: accelerator TEEs 多数只覆盖特定 CPU/accelerator，缺少通用比较框架。
- 工作: 分析 51 studies，归纳 Host-type/Acc.-type/Mix-type 和三类安全机制。
- 数据: Table I corpus，Table III security solutions，Table X-XIII TCB/compatibility。

**讲解稿:** 讲解时先把本页结论落到一句话: 这篇 SoK 在 05 中的作用是把 ACAI 和 Devlore 放到更大设备侧 TEE 设计空间里。第一步解释为什么需要这一页: 动机: accelerator TEEs 多数只覆盖特定 CPU/accelerator，缺少通用比较框架。第二步说明论文或规范实际做了什么: 工作: 分析 51 studies，归纳 Host-type/Acc.-type/Mix-type 和三类安全机制。第三步收束到证据边界: 数据: Table I corpus，Table III security solutions，Table X-XIII TCB/compatibility。引用时只把 Wang/Huang 2026 p.1-p.4; Table I; Figure 1/2; Table III 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Wang/Huang 2026 p.1-p.4; Table I; Figure 1/2; Table III.

- Proof object: flow - SoK 分析线: 51-study corpus -> architecture type -> attack vectors -> access control -> memory encryption -> attestation -> TCB/compatibility


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景是 CCA 设备路径不只包含 Arm-specific 方案，GPU/NPU/DPU/FPGA 都有类似可信边界问题。

- AI 和高性能 workload 越来越依赖 accelerator。
- CPU TEE 只保护 CPU-side memory/execution，offload 后数据进入 device memory/bus/queue。
- 设备侧缺身份、attestation 或 memory protection 时，CVM 仍不完整。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景是 CCA 设备路径不只包含 Arm-specific 方案，GPU/NPU/DPU/FPGA 都有类似可信边界问题。第一步解释为什么需要这一页: AI 和高性能 workload 越来越依赖 accelerator。第二步说明论文或规范实际做了什么: CPU TEE 只保护 CPU-side memory/execution，offload 后数据进入 device memory/bus/queue。第三步收束到证据边界: 设备侧缺身份、attestation 或 memory protection 时，CVM 仍不完整。引用时只把 Wang/Huang 2026 p.1-p.4; Figure 1/2 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Wang/Huang 2026 p.1-p.4; Figure 1/2.

- Proof object: matrix - 设备侧问题: Access = who can access task/device memory; Memory = host/device/link protection; Attestation = device identity and firmware; TCB = driver/runtime size; Compatibility = single-device designs


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: accelerator TEE 至少同时回答 access control、memory encryption、attestation；只解决 DMA 不够。

- ACAI 偏 memory/data path，Devlore 偏 interrupt/control path。
- SoK 提醒还要看 device HRoT、endorser、reference values、driver TCB 和 multi-device compatibility。
- 05 方向因此不能只讲 Arm CCA，还要和 TDISP/SPDM/IDE 关联。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: accelerator TEE 至少同时回答 access control、memory encryption、attestation；只解决 DMA 不够。第一步解释为什么需要这一页: ACAI 偏 memory/data path，Devlore 偏 interrupt/control path。第二步说明论文或规范实际做了什么: SoK 提醒还要看 device HRoT、endorser、reference values、driver TCB 和 multi-device compatibility。第三步收束到证据边界: 05 方向因此不能只讲 Arm CCA，还要和 TDISP/SPDM/IDE 关联。引用时只把 Wang/Huang 2026 Table III; Figure 3; Figure 5/6; Table X-XIII 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Wang/Huang 2026 Table III; Figure 3; Figure 5/6; Table X-XIII.

- Proof object: cards - 三大机制 + 两个部署维度: Access Control; Memory Encryption; Attestation; TCB size; Compatibility


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: SoK 把 accelerator TEE 分成 Host-type、Acc.-type 和 Mix-type。

- Host-type 复用 CPU TEE 和 host-side trusted component。
- Acc.-type 在 accelerator controller/firmware/hardware 内做保护。
- Mix-type 同时依赖 CPU-side 和 device-side root of trust，更接近商用 trusted I/O。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: SoK 把 accelerator TEE 分成 Host-type、Acc.-type 和 Mix-type。第一步解释为什么需要这一页: Host-type 复用 CPU TEE 和 host-side trusted component。第二步说明论文或规范实际做了什么: Acc.-type 在 accelerator controller/firmware/hardware 内做保护。第三步收束到证据边界: Mix-type 同时依赖 CPU-side 和 device-side root of trust，更接近商用 trusted I/O。引用时只把 Wang/Huang 2026 Figure 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Wang/Huang 2026 Figure 1.

- Proof object: matrix - 三类架构: Host-type = CPU-side TEE dominates; Acc.-type = accelerator-side controller; Mix-type = CPU + device trust chain; 05 映射 = ACAI/Devlore fit into device path; 边界 = SoK not a spec


### 6. 核心方法拆解

#### 方法 1: Access Control Taxonomy

**Claim:** Access control 不是单个 allow/deny，而是 CPU TEE、firmware、I/O bus、device controller 的组合。

- Table III/IV/V 比较不同 SAC 机制和部署偏好。
- 云端 discrete accelerator 更依赖 CPU-side + bus/device checks。
- endpoint integrated accelerator 更常依赖 firmware/monitor 和 platform hardware。

**讲解稿:** 讲解时先把本页结论落到一句话: Access control 不是单个 allow/deny，而是 CPU TEE、firmware、I/O bus、device controller 的组合。第一步解释为什么需要这一页: Table III/IV/V 比较不同 SAC 机制和部署偏好。第二步说明论文或规范实际做了什么: 云端 discrete accelerator 更依赖 CPU-side + bus/device checks。第三步收束到证据边界: endpoint integrated accelerator 更常依赖 firmware/monitor 和 platform hardware。引用时只把 Wang/Huang 2026 Table III-IV-V 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Wang/Huang 2026 Table III-IV-V.

- Proof object: matrix - Access layers: CPU TEE = CVM/enclave policy; TSM/RMM = manager checks; I/O bus = DMA/MMIO filter; Accelerator = controller/kernel auth; Driver = TCB pressure

#### 方法 2: Memory Encryption / Attestation

**Claim:** 设备侧保护必须覆盖 host memory、device memory、I/O link 和 metadata。

- Figure 3 展示 memory encryption workflow。
- Figure 5/6 和 Table VIII/IX 展示 attestation process 和缺口。
- 缺 HRoT/endorser/reference values 会导致伪造设备或错误固件被信任。

**讲解稿:** 讲解时先把本页结论落到一句话: 设备侧保护必须覆盖 host memory、device memory、I/O link 和 metadata。第一步解释为什么需要这一页: Figure 3 展示 memory encryption workflow。第二步说明论文或规范实际做了什么: Figure 5/6 和 Table VIII/IX 展示 attestation process 和缺口。第三步收束到证据边界: 缺 HRoT/endorser/reference values 会导致伪造设备或错误固件被信任。引用时只把 Wang/Huang 2026 Figure 3; Figure 5/6; Table VI-IX 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Wang/Huang 2026 Figure 3; Figure 5/6; Table VI-IX.

- Proof object: flow - device evidence path: CPU TEE report -> device HRoT -> firmware measurement -> endorser -> reference values -> verifier policy

#### 方法 3: TCB / Compatibility Lens

**Claim:** SoK 最适合提醒 PPT: device TEE 最大部署障碍往往是 driver/runtime TCB 和兼容性。

- Table X-XIII 总结 TCB size、software stack 和 compatibility。
- 很多系统只支持单一 accelerator 或特定 CPU。
- 商用落地需要减少高权限代码、支持 plug-and-play 和标准化 lifecycle。

**讲解稿:** 讲解时先把本页结论落到一句话: SoK 最适合提醒 PPT: device TEE 最大部署障碍往往是 driver/runtime TCB 和兼容性。第一步解释为什么需要这一页: Table X-XIII 总结 TCB size、software stack 和 compatibility。第二步说明论文或规范实际做了什么: 很多系统只支持单一 accelerator 或特定 CPU。第三步收束到证据边界: 商用落地需要减少高权限代码、支持 plug-and-play 和标准化 lifecycle。引用时只把 Wang/Huang 2026 Table X-XIII 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Wang/Huang 2026 Table X-XIII.

- Proof object: matrix - 部署瓶颈: Driver/runtime TCB = large / sometimes closed; Single accelerator = 43/51 studies; Specific CPU = 40/51 studies; Source availability = 12/51 source; Commercial gap = standards + orchestration


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** SoK 的实验环境页应写成 corpus 与 evidence boundary: 它不是一个新的 CCA device implementation。

- 证据源: NDSS 2026 PDF，本地验证。
- Corpus: 51 accelerator TEE studies, GPU/NPU/TPU/FPGA/general accelerator/industry designs。
- 边界: 具体性能、协议和安全证明必须回原始论文或规范。

**讲解稿:** 讲解时先把本页结论落到一句话: SoK 的实验环境页应写成 corpus 与 evidence boundary: 它不是一个新的 CCA device implementation。第一步解释为什么需要这一页: 证据源: NDSS 2026 PDF，本地验证。第二步说明论文或规范实际做了什么: Corpus: 51 accelerator TEE studies, GPU/NPU/TPU/FPGA/general accelerator/industry designs。第三步收束到证据边界: 边界: 具体性能、协议和安全证明必须回原始论文或规范。引用时只把 Wang/Huang 2026 Table I; p.2-p.15 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Wang/Huang 2026 Table I; p.2-p.15.

- Proof object: matrix - 证据边界: 可支撑 = design taxonomy; 不能支撑 = specific system proof; 实验 = SoK corpus + illustrative analysis; 用法 = checklist for 05/14


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能页引用 SoK 时要谨慎: Figure 4 是 granularity mismatch 的 illustrative analysis，不是通用 benchmark。

- 论文报告 secure initialization overhead 47.88%-73.45%。
- secure communication overhead 40.36%-44.94%。
- 结论是 memory-encryption granularity 需要贴合 accelerator access pattern。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能页引用 SoK 时要谨慎: Figure 4 是 granularity mismatch 的 illustrative analysis，不是通用 benchmark。第一步解释为什么需要这一页: 论文报告 secure initialization overhead 47.88%-73.45%。第二步说明论文或规范实际做了什么: secure communication overhead 40.36%-44.94%。第三步收束到证据边界: 结论是 memory-encryption granularity 需要贴合 accelerator access pattern。引用时只把 Wang/Huang 2026 Figure 4 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Wang/Huang 2026 Figure 4.

- Proof object: bars - SoK Figure 4: secure initialization 47.88%-73.45%; secure communication 40.36%-44.94%; universal benchmark 否; design warning 高


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: 这篇 SoK 是 05 的 taxonomy 补丁，让 Arm CCA I/O 讨论不局限于单个 GPU/FPGA 方案。

- 优势: RQ + corpus + tables 非常适合做设备侧 checklist。
- 局限: 不能替代 ACAI、Devlore 或 TDISP/SPDM/IDE 规范。
- 商业化潜力: 支撑 confidential AI/GPU cloud/DPU offload 的产品规划，但依赖标准化和 vendor support。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: 这篇 SoK 是 05 的 taxonomy 补丁，让 Arm CCA I/O 讨论不局限于单个 GPU/FPGA 方案。第一步解释为什么需要这一页: 优势: RQ + corpus + tables 非常适合做设备侧 checklist。第二步说明论文或规范实际做了什么: 局限: 不能替代 ACAI、Devlore 或 TDISP/SPDM/IDE 规范。第三步收束到证据边界: 商业化潜力: 支撑 confidential AI/GPU cloud/DPU offload 的产品规划，但依赖标准化和 vendor support。引用时只把 Wang/Huang 2026 conclusion; README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Wang/Huang 2026 conclusion; README evaluation.

- Proof object: matrix - 评价: 优势 = device TEE design space; 局限 = secondary evidence; 商业化 = confidential accelerator roadmap; 本方向角色 = taxonomy bridge


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
