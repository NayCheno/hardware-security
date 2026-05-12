# ShEF: Shielded Enclaves for Cloud FPGAs

- BibTeX key: `zhao2022shef`
- Category: `accelerator-tees`
- Authors: Mark Zhao, Mingyu Gao, Christos Kozyrakis
- Year: 2022
- Venue: 27th ACM International Conference on Architectural Support for Programming Languages and Operating Systems (ASPLOS 22)
- Source: https://arxiv.org/abs/2103.03500
- PDF source: https://arxiv.org/pdf/2103.03500
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Survey lane: confidential-computing network/I/O/data-path defense
- SOTA role: cloud FPGA TEE baseline

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 1. 论文基本信息

- 论文标题: ShEF: Shielded Enclaves for Cloud FPGAs
- 作者 / 机构: Mark Zhao / Stanford; Mingyu Gao / Tsinghua; Christos Kozyrakis / Stanford
- 发表会议 / 年份: ASPLOS 2022
- 领域分类: 系统 / 安全 / 架构 / 硬件
- 一句话总结: ShEF 为 cloud FPGA accelerator 提供 secure boot、remote attestation 和可定制 Shield，用 FPGA 机制实现独立于 CPU TEE 的 enclave。
- 最核心贡献一句话: 它把 accelerator TEE 扩展到 reconfigurable FPGA，并强调 Shell logic、physical access 和 custom security/performance tradeoff。

### 2. 研究问题与背景

云 FPGA 可运行敏感 accelerator，但 CPU TEE 不能直接保护 FPGA fabric、bitstream、Shell logic 和外部存储路径。ShEF 的 gap 是: 现有 accelerator TEE 要么依赖 CPU enclave，要么需要新硬件，要么没有覆盖 cloud FPGA Shell/physical threat model。

### 3. 核心方法拆解

机制管线: `FPGA secure boot -> security kernel/Root of Trust extension -> remote attestation -> accelerator bitstream loaded into known state -> Shield interposes ports to Shell/memory -> encrypted/authenticated data access -> accelerator execution`。核心模块是 boot process、attestation protocol 和可配置 Shield。

### 4. 安全性 / 正确性分析

ShEF 允许攻击者控制 CPU software、拥有物理访问并可 compromise cloud provider interface logic。安全边界依赖 FPGA existing security mechanisms、boot chain、Shield 正确性和 IP vendor 配置。side channel、DoS 和 vendor mechanism defect 仍需额外处理。

### 5. 实现细节

论文实现 end-to-end ShEF workflow，并在 AWS F1 类 cloud FPGA 场景评估多个 accelerator。它声明 ShEF artifact/open-source，这比只给设计图的 FPGA TEE 证据更强。

### 6. 实验设计分析

评估包含 GDPR secure storage benchmark 和 DNNWeaver 等多个 accelerator，报告 0%-122% overhead 和 3.1%-11% area cost。结果显示 custom Shield 可按 workload 调整代价，但性能区间跨度大，说明机制选择高度依赖访问模式。

### 7. Novelty 分析

分类: strong research novelty。新意在于为 cloud FPGA 的 spatial/reconfigurable 计算模型构造 TEE workflow，并把可定制 security engines 作为一等设计点。

### 8. 局限性与可能漏洞

ShEF 强依赖 FPGA vendor secure boot/attestation primitives 和用户正确配置 Shield。复杂多租户 partial reconfiguration、bitstream supply chain、side channel、fault injection 和 lifecycle revocation 不完整。

### 9. 和已有工作的关系

ShEF 与 Graviton/Telekine/Honeycomb 同属 accelerator TEE baseline，但设备模型从 GPU 转为 FPGA。它与 SGX-FPGA 的区别是 ShEF 不把 CPU SGX 作为核心信任路径，而是依靠 FPGA-local mechanisms。

### 10. 复现与再实现计划

最小复现目标是为一个 FPGA accelerator 构造 Shield wrapper，保护 host-facing ports 和 memory traffic，并生成 attestation evidence。验收标准是 untrusted Shell 不能读取或篡改 accelerator secret data。

### 11. 对后续研究的启发

1. 把 FPGA TEE Shield 映射到 CoVE-IO TDI lifecycle。2. 为 FPGA bitstream attestation 建立标准 evidence claim。3. 比较 ShEF 与 SGX-FPGA 的 CPU/FPGA TCB 差异。4. 研究 FPGA partial reconfiguration cleanup。5. 建立 SmartNIC/DPU FPGA fabric 的 TEE taxonomy。

### 12. Evidence README Addendum

- Evidence role: E1 peer-reviewed FPGA accelerator TEE evidence.
- 标准化 / 发表状态: ASPLOS 2022 peer-reviewed paper; arXiv/public PDF verified.
- 对应小方向: accelerator/device TEE; cloud FPGA; confidential offload.

#### 内容摘要

ShEF 用 secure boot、remote attestation 和可配置 Shield 保护 cloud FPGA accelerator，减少对 CPU TEE 的依赖。

#### 研究背景

Cloud FPGA 的 Shell logic、外部 host 和物理访问威胁让 CPU-only TEE 不足以保护 FPGA accelerator。

#### 解决方案

通过 FPGA-local boot/attestation 和 Shield interposition 为 accelerator data path 提供 confidentiality、integrity、freshness 与 isolation。

#### 实验结果

论文报告 0%-122% overhead 和 3.1%-11% area，表明可配置安全代价取决于 workload access pattern。

#### 文章评价

ShEF 是 FPGA accelerator TEE baseline；正文可用它补 GPU 之外的 accelerator lineage，但不应把它写成通用 PCIe trusted I/O 标准。
<!-- END PAPER REVIEW -->
