# Keystone: An Open Framework for Architecting TEEs

- BibTeX key: `lee2020keystone`
- Category: `risc-v-confidential-computing`
- Authors: Dayeol Lee et al.
- Year: 2019
- Source: https://arxiv.org/abs/1907.10119
- PDF source: https://arxiv.org/pdf/1907.10119
- Local PDF: `paper.pdf`
- Download status: downloaded and verified

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 1. 论文基本信息

- 论文标题: Keystone: An Open Framework for Architecting TEEs
- 作者 / 机构: Dayeol Lee et al.; UC Berkeley
- 发表会议 / 年份: arXiv 2019
- 领域分类: 系统 / 安全 / 架构
- 一句话总结: Keystone 是面向 RISC-V 的开源 TEE 架构框架，强调可定制 TCB 和可复用 TEE primitive。
- 最核心贡献一句话: 它是 RISC-V TEE lineage 的基础文献，为 Penglai、SPEAR-V 和 CoVE 提供开放研究平台背景。

### 2. 研究问题与背景

论文针对 vendor-specific TEE trade-off 固化、难以按应用定制的问题。这个问题在 SGX/SEV/TrustZone 中真实存在，尤其体现在 TCB、secure I/O、内存模型和移植成本上。

### 3. 核心方法拆解

架构为: RISC-V hardware isolation -> programmable security monitor -> enclave runtime -> application。Keystone 把硬件隔离和 monitor 插件化，提供 enclave 创建、测量、attestation、runtime abstraction，并允许不同 deployment modes。

### 4. 安全性 / 正确性分析

威胁模型强调不可信 OS，依赖 RISC-V PMP 和 security monitor。论文展示 memory encryption、cache side-channel defense 等可选扩展，但不声称解决所有微架构侧信道。安全强度取决于具体实例化。

### 5. 实现细节

实现运行于 HiFive Unleashed 与 Rocket/BOOM/FireSim 等平台。PDF 第 2 页称 Keystone 增量 SM 约 1.6 KLoC，总 TCB 约 12--15 KLoC。实现意义在于开放框架，而非单一最终产品。

### 6. 实验设计分析

论文评估 CoreMark、Beebs、RV8、IOZone 和 real-world ML/secure remote computation。PDF 第 2 页摘要称 CoreMark/Beebs/RV8 开销小于 1%，IOZone 可达 40%，Torch on Eyrie 约 7.35%，FANN with seL4 约 0.36%。评估说明 CPU workload 负担小，I/O 与系统调用路径仍是挑战。

### 7. Novelty 分析

分类: strong research novelty。新意在于开放、可定制、面向 RISC-V 的 TEE 架构框架，使研究者能探索不同 TCB/feature trade-off。

### 8. 局限性与可能漏洞

Keystone 更像研究框架，商业落地需要标准化硬件、成熟 SDK、I/O/side-channel 防护和供应链 attestation。PMP 区域数量、动态内存和大规模云 workload 是后续工作重点。

### 9. 和已有工作的关系

Keystone 继承 Sanctum 的开放硬件隔离思想，也为 Penglai 的 scalable memory protection 和 SPEAR-V 的新硬件 primitive 提供对照。

### 10. 复现与再实现计划

最小复现目标是在 QEMU/HiFive 跑 Keystone demo，测 enclave creation、attestation、CoreMark 和 IOZone。验收标准是复现低 CPU overhead 与 I/O 开销趋势。

### 11. 对后续研究的启发

1. 把 Keystone 作为 RISC-V TEE baseline。2. 对比 PMP-based enclave 与 CoVE TVM。3. 建立 I/O path benchmark。4. 研究可插拔 side-channel defense。5. 评估开源 TEE 的供应链可信根。
<!-- END PAPER REVIEW -->
