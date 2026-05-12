# Enabling Rack-scale Confidential Computing using Heterogeneous Trusted Execution Environment

- BibTeX key: `zhu2020hetee`
- Category: `accelerator-tees`
- Authors: Jianping Zhu, Rui Hou, XiaoFeng Wang, Wenhao Wang, Jiangfeng Cao, Boyan Zhao, Zhongpu Wang, Yuhui Zhang, Jiameng Ying, Lixin Zhang, Dan Meng
- Year: 2020
- Venue: IEEE Symposium on Security and Privacy (S&P 2020)
- Source: https://ieeexplore.ieee.org/document/9152787
- PDF source: https://heartever.github.io/files/hetee.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Survey lane: confidential-computing network/I/O/data-path defense
- SOTA role: Foundational accelerator/device TEE system; useful baseline for rack-scale accelerator isolation before TDISP/CoVE-IO-era designs.

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 1. 论文基本信息

- 论文标题: Enabling Rack-scale Confidential Computing using Heterogeneous Trusted Execution Environment
- 作者 / 机构: Jianping Zhu 等；中国科学院 / Indiana University
- 发表会议 / 年份: IEEE S&P 2020
- 领域分类: 系统 / 安全 / 架构
- 一句话总结: HETEE 用 rack-level security controller 和 PCIe fabric 动态隔离 GPU/FPGA/TPU 等加速器，使传统非 TEE accelerator 能服务机密计算任务。
- 最核心贡献一句话: 它把 confidential computing boundary 从 CPU TEE 扩展到 rack-scale heterogeneous accelerators，而不要求修改商用 CPU 或 accelerator 芯片。

### 2. 研究问题与背景

论文解决的问题是 CPU TEE 无法直接保护 compute/data-intensive workloads 的 accelerator offload 路径。深度学习训练、推理和大数据处理依赖 GPU/TPU/FPGA，但传统 TEE 只能保护 CPU enclave/VM；一旦数据进入 accelerator、driver 或 PCIe fabric，host 或云管理者仍可能观察或操控数据路径。这个 gap 真实存在，并且也是本 survey 中 SmartNIC/DPU/NIC/accelerator TEE 方向的核心动机。

### 3. 核心方法拆解

HETEE 的 pipeline 可写为: encrypted task from host -> security controller validation -> PCIe fabric assignment -> microserver/enclave controls accelerator -> secure cleanup and release。Security controller 是主要 TCB，负责资源分配、认证、加解密、remote attestation、PCIe ExpressFabric 配置和 enclave 生命周期控制。设计选择的重点是把复杂 AI runtime、GPU driver 等大软件栈放在可被验证和隔离的 microserver/enclave 中，而不是全部放进一个 CPU TEE。

### 4. 安全性 / 正确性分析

安全目标是让 untrusted host/CSP 不能读取或篡改机密任务的数据和代码，同时允许 rack 内 accelerator 动态复用。防御边界强依赖 security controller、PCIe fabric 配置正确性、secure cleanup 和 enclave 初始化验证。论文把 side-channel 等问题作为边界外或弱覆盖内容；因此它不能证明 accelerator 本身成为完整 TEE，只能证明通过外部控制器和物理/总线隔离构造的 rack-scale confidential execution path。

### 5. 实现细节

论文实现了真实硬件原型，使用 security controller、PCIe ExpressFabric、microservers 和 accelerator 资源池。实现难点在于动态资源迁移、secure cleanup、加密认证数据通道和 remote attestation 链。它不是纯软件系统，复现难度较高，需要特定硬件拓扑。

### 6. 实验设计分析

评估使用神经网络训练和推理任务。论文报告 ResNet152 上 inference 最大 throughput overhead 2.17%，training 最大 overhead 0.95%。这些结果支持“rack-scale 隔离不一定带来高性能损失”的主张，但实验依赖其硬件原型和 workload 选择；对现代 DPU/SmartNIC、PCIe IDE、TDISP、CoVE-IO 的兼容性需要后续工作验证。

### 7. Novelty 分析

分类: strong systems contribution。新意在于用 rack-level controller 和 PCIe fabric 动态调整可信边界，而不是修改 accelerator 芯片或把所有逻辑塞进 CPU enclave。

### 8. 局限性与可能漏洞

局限包括特定硬件依赖、security controller 成为集中 TCB、设备内部恶意固件和现代 confidential I/O 标准缺失。它早于 SPDM/TDISP/CoVE-IO 成熟讨论，因此正文引用时应作为 foundational accelerator TEE baseline，而不是当作当前标准化 trusted I/O 的完整答案。

### 9. 和已有工作的关系

HETEE 可与 ITX、CloudScale heterogeneous devices、ACAI、CoVE-IO 和 accelerator TEE SoK 对照。它代表“外部控制器保护非 TEE accelerator”的路线，区别于 ITX 的 device-local confidential execution 和 FOLIO 的“不信任 I/O device”路线。

### 10. 复现与再实现计划

最小复现目标是建立一个抽象模型: SC -> PCIe fabric -> accelerator assignment -> cleanup。验收标准是能说明 task key、device ownership、DMA window、attestation evidence 和 cleanup state 在生命周期中如何变化。

### 11. 对后续研究的启发

1. 把 HETEE security controller 映射到 TDISP/CoVE-IO device lifecycle。2. 比较 rack-level SC 与 device-local RoT 的 TCB 大小。3. 研究 SmartNIC/DPU 作为 security controller 的可行性。4. 加入 PCIe IDE/SPDM 证据链。5. 建立 confidential offload benchmark。
<!-- END PAPER REVIEW -->
