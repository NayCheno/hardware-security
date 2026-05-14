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
- Evidence role: Foundational. Use as a foundational entry point for this survey lane; later SOTA, specification, or implementation details should be cited separately when making narrow claims.

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

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `14-accelerator-dpu-smartnic-offload` - Accelerator / DPU / SmartNIC Offload TEE
- Paper key: `zhu2020hetee`
- Role: foundational rack-scale heterogeneous TEE system
- Evidence base: HETEE figures/tables: HETEE architecture, hardware setup, DNN evaluation Figure 7/8, cost breakdown.
- Boundary: HETEE 早于现代 SPDM/TDISP/CoVE-IO 生态，不等同于标准化 trusted device assignment。

### 1. 完整题目 / 作者 / 会议

- 完整题目: Enabling Rack-scale Confidential Computing using Heterogeneous Trusted Execution Environment
- 作者: Jianping Zhu, Rui Hou, XiaoFeng Wang, Wenhao Wang, Jiangfeng Cao, Boyan Zhao, Zhongpu Wang, Yuhui Zhang, Jiameng Ying, Lixin Zhang, Dan Meng
- 会议/来源: IEEE Symposium on Security and Privacy (S&P 2020)
- Title evidence: README metadata; IEEE S&P 2020 PDF title page.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** HETEE 的贡献是把 confidential computing 从单机 CPU enclave 扩成 rack-level accelerator enclave。

- 动机: GPU/DNN 训练推理需要高吞吐 accelerator，但 CPU TEE 本身无法保护 GPU 数据路径。
- 工作: 设计 HETEE box，security controller 管 remote attestation、加解密、resource allocation 和 secure cleanup。
- 数据: ResNet152 inference throughput overhead 2.17%，training throughput overhead 0.95%；单 GPU batch=8 平均 inference overhead 6.95%、training 0.91%。

**讲解稿:** 讲解时先把本页结论落到一句话: HETEE 的贡献是把 confidential computing 从单机 CPU enclave 扩成 rack-level accelerator enclave。第一步解释为什么需要这一页: 动机: GPU/DNN 训练推理需要高吞吐 accelerator，但 CPU TEE 本身无法保护 GPU 数据路径。第二步说明论文或规范实际做了什么: 工作: 设计 HETEE box，security controller 管 remote attestation、加解密、resource allocation 和 secure cleanup。第三步收束到证据边界: 数据: ResNet152 inference throughput overhead 2.17%，training throughput overhead 0.95%；单 GPU batch=8 平均 inference overhead 6.95%、training 0.91%。引用时只把 HETEE abstract; Figure 5-Figure 9; evaluation sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** HETEE abstract; Figure 5-Figure 9; evaluation sections.

- Proof object: flow - HETEE: remote user -> attestation to SC -> encrypted data stream -> proxy node -> GPU task -> secure cleanup -> encrypted result


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是 GPU/accelerator 高吞吐但传统 TEE 不保护设备内部和 PCIe 数据路径。

- CPU enclave 如果把 plaintext 发给 GPU，driver、PCIe、device memory 都可能暴露。
- 改 GPU silicon 不现实，使用 COTS GPU 更容易部署。
- Rack-scale pooling 还要解决多任务资源分配和 cleanup。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是 GPU/accelerator 高吞吐但传统 TEE 不保护设备内部和 PCIe 数据路径。第一步解释为什么需要这一页: CPU enclave 如果把 plaintext 发给 GPU，driver、PCIe、device memory 都可能暴露。第二步说明论文或规范实际做了什么: 改 GPU silicon 不现实，使用 COTS GPU 更容易部署。第三步收束到证据边界: Rack-scale pooling 还要解决多任务资源分配和 cleanup。引用时只把 HETEE introduction and threat model 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** HETEE introduction and threat model.

- Proof object: matrix - accelerator gap: CPU TEE = protects CPU memory; GPU = separate device/data path; Driver = large untrusted stack; PCIe = external fabric; HETEE = controller-mediated offload


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: 用一个较小的 Security Controller 作为 rack 内可信协调者，把大 GPU 软件栈移出 TCB。

- SC 做 attestation、key handling、task authorization。
- Proxy nodes 和 PCIe switch 连接 COTS accelerators。
- 任务结束后 reboot/cleanup 还原 secure state。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: 用一个较小的 Security Controller 作为 rack 内可信协调者，把大 GPU 软件栈移出 TCB。第一步解释为什么需要这一页: SC 做 attestation、key handling、task authorization。第二步说明论文或规范实际做了什么: Proxy nodes 和 PCIe switch 连接 COTS accelerators。第三步收束到证据边界: 任务结束后 reboot/cleanup 还原 secure state。引用时只把 HETEE architecture and design sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** HETEE architecture and design sections.

- Proof object: cards - HETEE TCB idea: Security Controller; remote attestation; encrypted I/O; PCIe switch config; secure cleanup


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: HETEE box 包含 SC node、proxy nodes、computing nodes/GPU 和 PCIe fabric。

- 远端用户先与 SC 建立 trust。
- SC 配置资源并控制数据进出。
- GPU 执行 DNN inference/training，结果经加密路径返回。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: HETEE box 包含 SC node、proxy nodes、computing nodes/GPU 和 PCIe fabric。第一步解释为什么需要这一页: 远端用户先与 SC 建立 trust。第二步说明论文或规范实际做了什么: SC 配置资源并控制数据进出。第三步收束到证据边界: GPU 执行 DNN inference/training，结果经加密路径返回。引用时只把 HETEE system figures and Table I 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** HETEE system figures and Table I.

- Proof object: matrix - 组件: SC node = trust and control; Proxy node = standard GPU software stack; GPU = COTS accelerator; PCIe switch = resource pooling; Remote user = attests and sends encrypted data


### 6. 核心方法拆解

#### 方法 1: Security Controller

**Claim:** SC 是 HETEE 的可信控制面，负责把用户、任务和设备资源绑定。

- 执行 remote attestation 和 key exchange。
- 配置 PCIe switch/resource assignment。
- 限制不可信 OS 直接接触敏感 plaintext。

**讲解稿:** 讲解时先把本页结论落到一句话: SC 是 HETEE 的可信控制面，负责把用户、任务和设备资源绑定。第一步解释为什么需要这一页: 执行 remote attestation 和 key exchange。第二步说明论文或规范实际做了什么: 配置 PCIe switch/resource assignment。第三步收束到证据边界: 限制不可信 OS 直接接触敏感 plaintext。引用时只把 HETEE design sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** HETEE design sections.

- Proof object: flow - SC control: attest SC -> establish keys -> assign GPU -> authorize proxy -> stream encrypted data -> cleanup

#### 方法 2: Encrypted Data Stream

**Claim:** HETEE 用加密数据流把 plaintext 暴露限制在可信边界内。

- 远端用户把数据加密发送到 HETEE box。
- SC/proxy 协调解密和 GPU task。
- 结果加密返回，降低网络和 host OS 观察面。

**讲解稿:** 讲解时先把本页结论落到一句话: HETEE 用加密数据流把 plaintext 暴露限制在可信边界内。第一步解释为什么需要这一页: 远端用户把数据加密发送到 HETEE box。第二步说明论文或规范实际做了什么: SC/proxy 协调解密和 GPU task。第三步收束到证据边界: 结果加密返回，降低网络和 host OS 观察面。引用时只把 HETEE data-flow design 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** HETEE data-flow design.

- Proof object: cards - data path: encrypted input; SC-controlled decrypt; GPU compute; encrypted output; cleanup

#### 方法 3: Rack-Scale Resource Pooling

**Claim:** HETEE 的独特点是 rack-level pooling，而不是单设备 enclave。

- PCIe fabric 可动态连接 computing units。
- 多 GPU 可提升 DNN task speedup。
- 资源回收必须伴随 secure cleanup。

**讲解稿:** 讲解时先把本页结论落到一句话: HETEE 的独特点是 rack-level pooling，而不是单设备 enclave。第一步解释为什么需要这一页: PCIe fabric 可动态连接 computing units。第二步说明论文或规范实际做了什么: 多 GPU 可提升 DNN task speedup。第三步收束到证据边界: 资源回收必须伴随 secure cleanup。引用时只把 HETEE scalability evaluation; PCIe switch design 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** HETEE scalability evaluation; PCIe switch design.

- Proof object: matrix - pooling: 1 GPU = baseline; 2 GPUs = speedup; 4 GPUs = higher speedup; Switch = dynamic assignment; Risk = shared fabric trust

#### 方法 4: Modern Boundary

**Claim:** HETEE 很有启发性，但不能替代现代 SPDM/TDISP/IDE evidence。

- 设备身份与 assignment lifecycle 后来由 TEE-I/O 生态更系统地定义。
- HETEE SC 是集中 TCB，供应链和容错风险高。
- 本 PPT 把它作为 foundational accelerator TEE。

**讲解稿:** 讲解时先把本页结论落到一句话: HETEE 很有启发性，但不能替代现代 SPDM/TDISP/IDE evidence。第一步解释为什么需要这一页: 设备身份与 assignment lifecycle 后来由 TEE-I/O 生态更系统地定义。第二步说明论文或规范实际做了什么: HETEE SC 是集中 TCB，供应链和容错风险高。第三步收束到证据边界: 本 PPT 把它作为 foundational accelerator TEE。引用时只把 HETEE publication date and survey boundary 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** HETEE publication date and survey boundary.

- Proof object: cards - not modern standard: pre-SPDM/TDISP focus; central SC TCB; COTS GPU trust assumption; cleanup critical; still foundational


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** 实验环境与数据: HETEE box 原型，DNN inference/training workload 和硬件模块开销。

- 硬件: SC node、proxy nodes、GPU computing units、PCIe switch/fabric。
- Workloads: VGG16、GoogLeNet、ResNet50/101/152，ImageNet 训练/推理数据。
- 指标: throughput overhead、latency overhead、GPU scalability、bandwidth/latency、cost。

**讲解稿:** 讲解时先把本页结论落到一句话: 实验环境与数据: HETEE box 原型，DNN inference/training workload 和硬件模块开销。第一步解释为什么需要这一页: 硬件: SC node、proxy nodes、GPU computing units、PCIe switch/fabric。第二步说明论文或规范实际做了什么: Workloads: VGG16、GoogLeNet、ResNet50/101/152，ImageNet 训练/推理数据。第三步收束到证据边界: 指标: throughput overhead、latency overhead、GPU scalability、bandwidth/latency、cost。引用时只把 HETEE evaluation Section VIII; Table I; Figure 7-Figure 9 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** HETEE evaluation Section VIII; Table I; Figure 7-Figure 9.

- Proof object: matrix - 实验设置: Models = VGG/GoogLeNet/ResNet; Dataset = ImageNet; Metrics = throughput/latency; Scale = 1/2/4 GPU; Boundary = not SPDM/TDISP


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能结论: HETEE throughput overhead 较低，但 latency overhead 与 batch/model/data transfer 明显相关。

- Abstract: ResNet152 inference throughput overhead 2.17%，training 0.95%。
- Figure 7: batch=8 时 inference throughput overhead 平均 6.95%，training 0.91%；多数训练低于 5%。
- Figure 8: batch=8 时 inference latency overhead 平均 42.96%，training 18.54%。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能结论: HETEE throughput overhead 较低，但 latency overhead 与 batch/model/data transfer 明显相关。第一步解释为什么需要这一页: Abstract: ResNet152 inference throughput overhead 2.17%，training 0.95%。第二步说明论文或规范实际做了什么: Figure 7: batch=8 时 inference throughput overhead 平均 6.95%，training 0.91%；多数训练低于 5%。第三步收束到证据边界: Figure 8: batch=8 时 inference latency overhead 平均 42.96%，training 18.54%。引用时只把 HETEE abstract; Figure 7; Figure 8 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** HETEE abstract; Figure 7; Figure 8.

- Proof object: bars - key numbers: ResNet152 inference throughput 2.17%; ResNet152 training throughput 0.95%; batch=8 inference latency 42.96%; batch=8 training latency 18.54%


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: HETEE 是 accelerator confidential offload 的 foundational baseline，强在系统视角，弱在现代协议闭环。

- 优势: 完整 rack-level prototype，直接覆盖 GPU DNN workload。
- 局限: 集中 SC TCB、COTS GPU trust、现代 device identity/lifecycle 不完整。
- 商业化潜力: 启发 DPU/SmartNIC security controller；落地需要标准化 device evidence 和 failure isolation。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: HETEE 是 accelerator confidential offload 的 foundational baseline，强在系统视角，弱在现代协议闭环。第一步解释为什么需要这一页: 优势: 完整 rack-level prototype，直接覆盖 GPU DNN workload。第二步说明论文或规范实际做了什么: 局限: 集中 SC TCB、COTS GPU trust、现代 device identity/lifecycle 不完整。第三步收束到证据边界: 商业化潜力: 启发 DPU/SmartNIC security controller；落地需要标准化 device evidence 和 failure isolation。引用时只把 HETEE conclusion and README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** HETEE conclusion and README evaluation.

- Proof object: matrix - 评价: 优势 = rack-scale accelerator TEE; 局限 = central TCB / old protocol era; 商业化 = DPU/security controller; 本方向角色 = foundational baseline


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
