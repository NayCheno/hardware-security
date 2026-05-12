# Telekine: Secure Computing with Cloud GPUs

- BibTeX key: `hunt2020telekine`
- Category: `accelerator-tees`
- Authors: Tyler Hunt, Zhipeng Jia, Vance Miller, Ariel Szekely, Yige Hu, Christopher J. Rossbach, Emmett Witchel
- Year: 2020
- Venue: 17th USENIX Symposium on Networked Systems Design and Implementation (NSDI 20)
- Source: https://www.usenix.org/conference/nsdi20/presentation/hunt
- PDF source: https://www.usenix.org/system/files/nsdi20-paper-hunt.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Survey lane: confidential-computing network/I/O/data-path defense
- SOTA role: GPU TEE side-channel-aware runtime baseline

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 1. 论文基本信息

- 论文标题: Telekine: Secure Computing with Cloud GPUs
- 作者 / 机构: Tyler Hunt, Zhipeng Jia, Vance Miller, Ariel Szekely, Yige Hu, Christopher J. Rossbach, Emmett Witchel / UT Austin and VMware Research
- 发表会议 / 年份: NSDI 2020
- 领域分类: 系统 / 安全 / 网络
- 一句话总结: Telekine 在假设 GPU 支持 TEE 的前提下，用 data-oblivious GPU stream abstraction 降低 host-observable timing 和 API interaction 泄漏。
- 最核心贡献一句话: 它说明 GPU TEE 不能只保护内存和 command queue，还必须控制 CPU-side API interaction 中的 secret-dependent 行为。

### 2. 研究问题与背景

Graviton 类 GPU TEE 保护设备资源，但 GPU API 调用、kernel launch timing 和 host-device interaction 仍可泄漏 secret-dependent 行为。论文展示了基于 GPU kernel timing 的 ImageNet 分类攻击，并提出 secure stream abstraction 来避免 untrusted host 观察到 secret-dependent execution pattern。

### 3. 核心方法拆解

机制管线: `application -> LibTelekine trusted component -> data-oblivious stream generation -> untrusted relay/cloud GPU execution -> trusted result handling`。Telekine 通过 API remoting 和 partitioning 让 secret-dependent control 留在 trusted component 内，untrusted cloud 只看到不依赖 secret 的 stream。

### 4. 安全性 / 正确性分析

Telekine 假设底层 GPU 已有 TEE 能力，因此它不是 GPU TEE hardware design 本身。其安全边界主要针对 host-observable timing/API side channel；物理攻击、GPU microarchitectural leakage、malicious GPU hardware 和 DoS 不在完整解决范围。claim 强度应写成“side-channel-aware runtime on top of GPU TEE assumption”。

### 5. 实现细节

原型支持 MXNet 和 Galois workloads，涉及 GPU API remoting、stream abstraction 和应用划分。复现难点是需要重建论文所需 GPU TEE 假设或用模拟环境近似。

### 6. 实验设计分析

论文报告 MXNet image-recognition training 相对 insecure local GPU baseline 有 10%-22% penalty，Galois graph workloads 有 18%-41% overhead。实验覆盖 ML 与 graph workloads，但依赖特定 API partitioning，不能泛化为所有 GPU workload。

### 7. Novelty 分析

分类: strong research novelty。贡献不在新硬件 primitive，而在把 GPU TEE 的安全问题扩展到 stream/API 层，并用 data-oblivious abstraction 处理真实侧信道。

### 8. 局限性与可能漏洞

最大限制是底层 GPU TEE 被假设存在。复杂动态 workload、secret-dependent memory access inside GPU、multi-tenant scheduling 和 cloud driver behavior 仍需额外机制。

### 9. 和已有工作的关系

Telekine 直接补 Graviton 的 runtime/side-channel gap。它与 Honeycomb/XpuTEE 的区别是关注 cloud GPU API stream 的 secret independence，而不是主要改变 GPU memory isolation 或 heterogeneous enclave abstraction。

### 10. 复现与再实现计划

最小复现目标是为一个 ML training loop 生成固定形状的 GPU API stream，并用 adversarial logger 验证 host-observable calls/timing 不随输入类别变化。验收标准是 untrusted relay 不能从 stream pattern 分类 secret input。

### 11. 对后续研究的启发

1. 把 GPU TEE taxonomy 中加入 host-visible API channel。2. 为 confidential accelerator 建立 data-oblivious runtime benchmark。3. 比较 Telekine 与 TDISP/IDE 只保护 device interface 的差异。4. 研究 DPU/NIC offload API side channel。5. 组合 stream-oblivious runtime 与 hardware secure context。

### 12. Evidence README Addendum

- Evidence role: E1 peer-reviewed accelerator TEE runtime evidence.
- 标准化 / 发表状态: NSDI 2020 peer-reviewed paper; local PDF verified.
- 对应小方向: accelerator/device TEE; confidential offload; side-channel-aware runtime boundary.

#### 内容摘要

Telekine 把 GPU TEE 的安全边界从设备资源扩展到 host-observable API stream，强调 secure computing with cloud GPUs 需要避免 secret-dependent interaction。

#### 研究背景

云 GPU workload 需要信任 provider 管理栈；即使有 GPU TEE，kernel timing 和 API 交互也可能泄漏输入。

#### 解决方案

通过 data-oblivious stream abstraction 和 API remoting，让 untrusted cloud relay 只看到与 secret 无关的请求序列。

#### 实验结果

论文报告 MXNet 10%-22% penalty、Galois 18%-41% overhead；适合说明安全 runtime 代价，而不是底层 GPU TEE 硬件可用性。

#### 文章评价

Telekine 是 GPU TEE lineage 中必须保留的 side-channel-aware baseline。正文使用时应明确其底层 GPU TEE 是假设，不把它写成完整硬件标准。
<!-- END PAPER REVIEW -->
