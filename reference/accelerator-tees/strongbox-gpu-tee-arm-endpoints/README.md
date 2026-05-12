# StrongBox: A GPU TEE on Arm Endpoints

- BibTeX key: `deng2022strongbox`
- Category: `accelerator-tees`
- Authors: Yunjie Deng, Chenxu Wang, Shunchang Yu, Shiqing Liu, Zhenyu Ning, Kevin Leach, Jin Li, Shoumeng Yan, Zhengyu He, Jiannong Cao, Fengwei Zhang
- Year: 2022
- Venue: ACM CCS 2022
- DOI: `10.1145/3548606.3560627`
- Source: https://research.polyu.edu.hk/en/publications/strongbox-a-gpu-tee-on-arm-endpoints/
- PDF source: https://fengweiz.github.io/paper/strongbox-ccs22.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified
- Survey lane: confidential-computing network/I/O/data-path defense; ISA/hardware-design defense
- SOTA role: foundational Arm endpoint GPU TEE baseline

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 1. 论文基本信息

- 论文标题: StrongBox: A GPU TEE on Arm Endpoints
- 作者 / 机构: Yunjie Deng et al.; SUSTech, PolyU, Vanderbilt, Hunan University, Ant Group, Guangzhou University
- 发表会议 / 年份: ACM CCS 2022
- 领域分类: 系统 / 安全 / 架构
- 一句话总结: StrongBox 用 TrustZone、TZASC 和 Stage-2 translation 保护 Arm endpoint GPU 的 unified-memory task RAM 与 MMIO。
- 最核心贡献一句话: 它证明 Arm endpoint GPU 可以在不改 GPU/CPU 硬件的情况下实现通用 GPU TEE，并把 heavy GPU driver 留在不可信世界。

### 2. 研究问题与背景

Arm endpoint GPU 与 CPU 共享 unified memory，不像很多离散 GPU 有天然 dedicated memory 边界。kernel/GPU driver 被攻破后，攻击者可读取 GPU buffer、篡改 GPU page table 或提交恶意 GPU task。现有 Intel/SGX GPU TEE 或特定 ML TrustZone 方案不能直接适配 Arm endpoint GPU。StrongBox 的 gap 是通用、低 TCB、兼容 Arm endpoint GPU 的 TEE 缺失。

威胁模型包括控制 kernel、GPU driver/runtime 和其他 peripheral driver 的 privileged attacker；信任 TrustZone、GPU、firmware 和硬件访问控制。物理攻击、side-channel、cryptographic attacks 和 DoS 被排除。

### 3. 核心方法拆解

方法管线是: `user secure GPU app -> untrusted OpenCL/runtime/driver allocates resources -> SMC enters StrongBox runtime -> GPU Guard locks MMIO and exclusivity -> Task Protector verifies code/data and protects task RAM -> GPU executes -> cleanup and result export`。GPU Guard 负责 GPU exclusive execution、MMIO/register protection 和 interrupt handling；Task Protector 负责 secure task RAM、code/data integrity、GPU buffer 分类和 redundancy optimization。

工程贡献是把 heavy GPU driver/runtime 保留在 normal world，只把关键访问控制放入 EL3 secure monitor，从而降低 TCB。

### 4. 安全性 / 正确性分析

StrongBox 分析了敏感数据/代码泄漏、GPU page table 攻击、恶意 task、fake GPU、compromised GPU software stack 和 Iago-style 攻击。防御依赖 secure task RAM、TZASC/Stage-2 translation、GPU MMIO register check、HMAC/integrity verification、secure termination cleanup。强假设是 GPU 硬件可信，且 endpoint GPU 不支持复杂并发执行；这使方案适合移动/端侧 GPU，但不直接适合云平台离散 GPU。

### 5. 实现细节

原型运行在 Arm Juno R2 开发板，包含 Cortex-A53/A72 和 Mali-T624 GPU。论文报告 TCB 约 1,366 LoC，显著小于把约 30K LoC Midgard GPU driver 移入 TEE 的设计。软件组件包括 Linux kernel、Arm Trusted Firmware/EL3 runtime、OpenCL/Midgard driver 交互和 secure task memory 管理。

### 6. 实验设计分析

实验使用 Rodinia、SqueezeNet、MobileNet-v1 等 benchmark，报告总体开销 4.70%--15.26%。评估还比较了 GPU TEE 设计维度和系统性能影响。实验优点是使用 off-the-shelf Arm Mali GPU；不足是 endpoint GPU 任务通常顺序执行，临时 exclusive GPU 使用在高并发/数据中心 GPU 上不一定成立。

### 7. Novelty 分析

Novelty 分类: `solid systems contribution`。StrongBox 在 Arm endpoint GPU TEE 上是 foundational baseline，但相对于后续 CCA/CAGE/PORTAL 工作，它的威胁模型仍是 TrustZone/endpoint 风格，不是 Realm confidential VM。

### 8. 局限性与可能漏洞

StrongBox 不适合 Arm cloud platforms，论文也明确指出 hypervisor-enabled Arm devices 会带来额外限制。它要求 secure task 执行期间 GPU 临时独占，可能影响并发图形/AI workloads。side-channel 和 DoS 不解决。由于依赖 TrustZone 和 EL3 runtime，TCB correctness 仍关键。

### 9. 和已有工作的关系

StrongBox 是 CAGE/Arm CCA accelerator 工作的重要前置基线。相比 Graviton/HIX 等 Intel/discrete GPU TEE，它处理 Arm unified-memory GPU；相比 CAGE，它没有 Realm/GPT/GPC lifecycle；相比 ITX/HETEE，它偏 endpoint GPU 而非 data-center accelerator fabric。

### 10. 复现与再实现计划

最低复现目标是在 Arm board 或 QEMU/FVP-like 环境中实现 secure task RAM + GPU MMIO lock + code/data HMAC check。可先用模拟 GPU MMIO 代替真实 Mali；不能省略 Stage-2/TZASC-like access-control 检查。验收标准是 untrusted driver 无法读取 secure GPU buffer，恶意 GPU page-table mapping 被拒绝，secure task 完成后内存清理。

### 11. 对后续研究的启发

1. StrongBox-to-CCA migration: 对比 TrustZone secure monitor 与 CCA RMM/System Realm 的 TCB 差异。
2. Unified-memory GPU confidentiality: 为 mobile SoC NPU/GPU/ISP 设计更通用的 buffer ownership model。
3. Secure GPU scheduling: 在保护 task RAM 的同时减少临时独占 GPU 对系统交互的影响。
4. Side-channel boundary statement: 明确 unified-memory GPU TEE 的 cache/bus leakage 排除边界。
5. Device attestation extension: 给 StrongBox-like GPU runtime 增加可远程验证的 evidence chain。

### 12. SOTA README Addendum

- SOTA 定位: 基础/历史入口
- 标准化 / 发表状态: ACM CCS 2022 peer-reviewed paper
- 对应小方向: Arm endpoint accelerator TEE baseline

#### 内容摘要

StrongBox 是 Arm endpoint GPU TEE 的代表性早期系统，保护 GPU task memory、code integrity 和 MMIO access。

#### 研究背景

Arm endpoint GPU 共享系统内存，compromised kernel/GPU driver 可读取或篡改 GPU workload。

#### 解决方案

用 TrustZone/EL3 runtime、TZASC、Stage-2 translation、GPU Guard 和 Task Protector 建立轻量 GPU TEE。

#### 实验结果

Mali-T624 原型报告 4.70%--15.26% 开销，TCB 约 1,366 LoC。

#### 文章评价

适合作为 CCA accelerator 之前的 Arm GPU TEE baseline；不能写成 Arm CCA/Realm 方案。
<!-- END PAPER REVIEW -->
