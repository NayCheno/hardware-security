# Graviton: Trusted Execution Environments on GPUs

- BibTeX key: `volos2018graviton`
- Category: `accelerator-tees`
- Authors: Stavros Volos, Kapil Vaswani, Rodrigo Bruno
- Year: 2018
- Venue: 13th USENIX Symposium on Operating Systems Design and Implementation (OSDI 18)
- Source: https://www.usenix.org/conference/osdi18/presentation/volos
- PDF source: https://www.usenix.org/system/files/osdi18-volos.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Survey lane: confidential-computing network/I/O/data-path defense
- SOTA role: foundational GPU TEE baseline

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 1. 论文基本信息

- 论文标题: Graviton: Trusted Execution Environments on GPUs
- 作者 / 机构: Stavros Volos、Kapil Vaswani / Microsoft Research；Rodrigo Bruno / INESC-ID / IST, University of Lisbon
- 发表会议 / 年份: OSDI 2018
- 领域分类: 系统 / 安全 / 架构
- 一句话总结: Graviton 把 TEE 概念扩展到 GPU secure context，并把主机驱动、OS 和 hypervisor 排除在 GPU kernel/data 可信边界外。
- 最核心贡献一句话: 它是 GPU TEE 的 foundational baseline，提出用 GPU command processor 和 secure context 管理设备资源 ownership，而不是信任主机驱动。

### 2. 研究问题与背景

CPU TEE 不能自动保护 GPU 上执行的 kernel、设备内存、命令队列和 host-device 传输。论文要解决的问题是: 当云服务商或攻击者控制 host software stack 时，用户能否安全地把敏感计算 offload 到 GPU。这个 gap 真实存在，因为传统 GPU driver 管理 page table、device memory 和 command submission，攻击面比 CPU enclave 边界更大。

### 3. 核心方法拆解

机制管线: `CPU TEE 或可信 runtime 持有 key -> 创建 GPU secure context -> command processor 管理资源 ownership -> 加密/authenticated host-device command/data path -> GPU kernel 在 secure context 内执行 -> destroy 时清理资源`。关键设计是把敏感 GPU 资源的分配、映射和清理由 command processor 检查，防止 untrusted driver 直接访问 page directory、page table、command queue 和 secure context state。

### 4. 安全性 / 正确性分析

威胁模型允许攻击者控制 host driver、OS 和 hypervisor，但信任 GPU hardware 与 on-package memory。论文明确把 side channel、physical invasive attack、malicious GPU hardware 等留在边界外。Graviton 的 security claim 依赖 command processor 正确实现 ownership tracking，以及 key 在 CPU-side trusted component 中得到保护。

### 5. 实现细节

原型基于 off-the-shelf NVIDIA GPU，用 emulation 模拟新硬件特性，并扩展 CUDA runtime。由于没有真实硬件实现 command processor 修改，复现难点在于可信硬件路径无法完全用 commodity GPU 验证。

### 6. 实验设计分析

论文在机器学习 benchmark 上评估 secure context 的 overhead，报告 17%-33% 开销，主要来自 GPU 往返流量的加解密。评估支撑“低硬件复杂度可行”的方向性 claim，但由于硬件机制是模拟实现，不能当作生产 GPU TEE 性能证据。

### 7. Novelty 分析

分类: potentially top-tier contribution。新意在于重新定义 GPU driver 与 GPU hardware 的信任接口，把 secure context、device-memory ownership、measurement 和 secure cleanup 组合为 GPU TEE 架构。

### 8. 局限性与可能漏洞

最大限制是信任 on-package memory 与 GPU hardware，且硬件扩展未在真实商用 GPU silicon 中实现。side channel、multi-GPU、firmware update、device reset、DoS 和现代 PCIe trusted I/O lifecycle 均不是完整解决范围。

### 9. 和已有工作的关系

Graviton 是后续 Telekine、Honeycomb、ShEF 和 XpuTEE 对照的 GPU TEE 起点。它强调 device-local hardware support；Telekine 补 side-channel-oblivious stream abstraction；Honeycomb 用 static validation 减少硬件修改；ShEF 把问题转向 FPGA；XpuTEE 追求 CPU/GPU heterogeneous enclave abstraction。

### 10. 复现与再实现计划

最小复现目标是模拟 secure context lifecycle: create、resource allocation、encrypted transfer、kernel launch、measurement、destroy/cleanup。验收标准是 untrusted driver 无法映射或重用 secure context 的 page table、device memory 和 command queue。

### 11. 对后续研究的启发

1. 把 GPU secure context lifecycle 映射到 SPDM/TDISP/CoVE-IO device-interface lifecycle。2. 对 command processor ownership tracking 做形式化状态机。3. 比较 Graviton 与 modern confidential GPU vendor design。4. 评估 GPU TEE side-channel boundary。5. 研究 multi-tenant accelerator reset 与 cleanup proof。

### 12. Evidence README Addendum

- Evidence role: E1 peer-reviewed foundational accelerator TEE evidence.
- 标准化 / 发表状态: OSDI 2018 peer-reviewed paper; local PDF verified.
- 对应小方向: accelerator/device TEE; confidential offload; GPU TEE lineage.

#### 内容摘要

Graviton 提出 GPU secure context，把 GPU 资源与密钥绑定并由 command processor 管理 ownership，目标是在 host software 不可信时保护 GPU kernel 和数据。

#### 研究背景

GPU driver 默认拥有设备资源管理权。CPU TEE 不覆盖 GPU 内部明文执行和设备内存，因此 confidential workload 使用 GPU 时会离开 CPU protection boundary。

#### 解决方案

核心是把敏感资源管理从 driver 直接控制改成 command processor 检查，并用 runtime 扩展保护 data copy 和 kernel launch。

#### 实验结果

论文报告 17%-33% overhead；但硬件机制是 emulation，不应写成已部署产品级结果。

#### 文章评价

这是 GPU TEE 的 foundational baseline，适合支撑“accelerator 必须有自己的 trusted execution boundary”这一 survey claim；不适合单独证明现代 CoVE-IO/TDISP 组合已经完整。
<!-- END PAPER REVIEW -->
