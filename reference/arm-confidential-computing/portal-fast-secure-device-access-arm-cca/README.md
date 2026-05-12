# PORTAL: Fast and Secure Device Access with Arm CCA for Modern Arm Mobile System-on-Chips (SoCs)

- BibTeX key: `sang2025portal`
- Category: `arm-confidential-computing`
- Authors: Fan Sang, Jaehyuk Lee, Xiaokuan Zhang, Taesoo Kim
- Year: 2025
- Venue: IEEE Symposium on Security and Privacy 2025
- DOI: `10.1109/SP61157.2025.00013`
- Source: https://sp2025.ieee-security.org/accepted-papers.html
- PDF source: https://sang.fan/assets/papers/portal_sp25.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified
- Survey lane: Arm/RISC-V confidential-computing defense; confidential-computing network/I/O/data-path defense
- SOTA role: Arm CCA device-access SOTA for mobile SoC / integrated-device paths

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 1. 论文基本信息

- 论文标题: PORTAL: Fast and Secure Device Access with Arm CCA for Modern Arm Mobile System-on-Chips (SoCs)
- 作者 / 机构: Fan Sang, Jaehyuk Lee, Xiaokuan Zhang, Taesoo Kim; Georgia Tech and George Mason University
- 发表会议 / 年份: IEEE S&P 2025
- 领域分类: 系统 / 安全 / 架构
- 一句话总结: PORTAL 用 Arm CCA 的内存隔离机制为 Realm VM 和指定外设建立 plaintext device-access region，避免把设备 I/O 全部退化为 shared-buffer encryption。
- 最核心贡献一句话: 它把 Arm CCA 的 GPT/GPC、System Realm、SMMU/device attachment 和 attestation measurement 组合成一个面向移动 SoC 集成设备的动态安全 I/O 接口。

### 2. 研究问题与背景

PORTAL 要解决的是 Arm CCA 在移动 SoC 上访问大量集成外设时的安全和性能冲突。CCA 默认把设备视为不可信，Realm 不能让普通外设直接访问 protected memory；传统 workaround 使用 bounce buffer、virtio 或 shared memory encryption，但在实时、多设备和低功耗场景下会带来明显开销。论文的 gap 是: 现有 secure device I/O 方案多依赖加密搬运数据，不能很好支持移动 SoC 上动态设备分配和低功耗访问。这个 gap 对本 survey 成立，因为网络设备、GPU/NPU、sensor fusion 和 DPU-like offload 都会让 protected workload 频繁跨越 CPU-local boundary。

攻击者模型包括不可信 host/hypervisor、普通世界软件、恶意应用和非法 device-management 操作；论文假设 SoC 封装和物理互连可信，不覆盖物理探测、侧信道和恶意硬件外设本体。

### 3. 核心方法拆解

方法管线是: `Realm VM request -> System Realm mediates device attach -> RMM/SMMU/GPT update -> PORTAL protected plaintext region -> designated peripheral DMA/MMIO access`。System Realm 持有设备管理逻辑，避免把 SMMU 管理代码直接塞入不可信 host；RMM/Monitor 负责关键状态切换；REM measurement 记录 device-management 相关状态，供远程 verifier 检查。

关键设计选择是不用加密保护 Realm 与外设之间的每一次数据搬运，而是用 CCA memory isolation 保证只有指定 Realm 和指定外设能访问 PORTAL region。其研究贡献在于组合 CCA granule ownership、SMMU stage-2 和 device lifecycle，而不是提出新的密码协议。

### 4. 安全性 / 正确性分析

论文针对非法设备管理、错误映射、伪造设备访问和 untrusted OS 干扰进行了机制分析。核心边界是: host 仍能管理资源，但不能把 PORTAL region 映射给未授权实体；设备 attach/detach 需要通过 System Realm/RMM 约束。安全性依赖 verifier 检查 attestation evidence，也依赖 SoC package 内 interconnect 与设备身份假设。物理攻击、侧信道、恶意外设固件被排除，因此在 survey 中不能把 PORTAL 写成完整 trusted I/O 方案。

### 5. 实现细节

论文实现两个原型: 一个在 Arm FVP 上验证功能和安全逻辑，一个在 RK3588/Armv8 指令模拟环境上评估性能。实现引入约 1,660 LoC TCB 增量。修改点涉及 RMM/Monitor、System Realm、SMMU/device-management 路径和 Realm-facing attach/detach 接口。由于真实商用 CCA/RME 硬件尚有限，性能原型包含对 Armv9/CCA 指令行为的模拟，这是复现时的主要限制。

### 6. 实验设计分析

实验问题覆盖性能收益、lifecycle 开销、System Realm 开销、memory overhead 和 power。论文报告 PORTAL 激活有约 9.8% one-time overhead，在 GPU use cases 中获得 1.07x--9.07x 性能收益，平均性能提升约 3.71x，并降低平均功耗。评估强项是将功能验证和性能评估分离；弱项是仍受限于非最终 CCA 硬件，且设备类别主要偏移动 SoC integrated device，不能直接外推到数据中心 NIC/DPU。

### 7. Novelty 分析

Novelty 分类: `strong research novelty`。PORTAL 的新意不是单一 primitive，而是把 CCA memory ownership 和 device assignment 用于 plaintext I/O region，形成一条不同于 encrypt-every-transfer 的 Arm CCA device-access 路线。它对本 survey 的价值在于补上 Arm CCA I/O 不是只有 accelerator/interrupt 的视角。

### 8. 局限性与可能漏洞

最大局限是安全性依赖 SoC-integrated device 和 trusted package 假设；对离散 PCIe 设备、恶意设备固件、复杂 DPU/NIC runtime 的覆盖不足。System Realm 成为新的管理 TCB，若其设备状态机或 SMMU 更新逻辑出错，可能破坏隔离。论文没有解决 side-channel、physical probing 和 DoS。对 production CCA 硬件的实测仍需等待真实平台。

### 9. 和已有工作的关系

PORTAL 与 ACAI/CAGE 都处理 CCA 与设备/accelerator 的组合问题，但 PORTAL 更偏 device I/O interface 和 mobile SoC dynamic peripheral access。它与 SPDM/TDISP/CoVE-IO 的层次不同: PORTAL 关注 Arm CCA 内部 memory/device access enforcement；SPDM/TDISP 更偏设备身份和接口 lifecycle。后续应搜索 RME-DA、Arm SMMU realm-aware device assignment、mobile confidential I/O、secure vNIC/secure peripheral sharing。

### 10. 复现与再实现计划

最低复现目标是在 Arm FVP 或 OpenCCA-like 环境中实现最小 System Realm: 支持一个虚拟设备 attach、一个 protected I/O region、SMMU mapping check 和 attestation measurement 更新。必要组件包括 TF-A/RMM 修改、Realm guest test driver、host attach command、非法映射测试。可简化真实 GPU workload，但不能省略 device memory ownership 和 SMMU enforcement。验收标准是: 未授权 Realm/host 访问失败，指定设备访问成功，attach/detach 后旧映射不可用。

### 11. 对后续研究的启发

1. CCA secure vNIC/virtio replacement: 将 PORTAL region 机制用于 vNIC queue 和 packet buffer，测试是否能减少 confidential VM 网络加密搬运开销。
2. Portal + SPDM/TDISP composition: 把设备身份和 PORTAL attach 状态绑定，补上设备本体可信性证据。
3. DPU-hosted System Realm analogue: 研究 DPU/SmartNIC 上是否可放置类似 System Realm 的设备管理 TCB。
4. Migration-aware device lifecycle: 分析 Realm migration 时 PORTAL region、SMMU state 和设备队列如何安全迁移或销毁。
5. Formal state-machine validation: 对 attach/detach/RIPAS/PAS/SMMU 更新做模型检查，降低 System Realm 逻辑错误风险。

### 12. SOTA README Addendum

- SOTA 定位: Academic SOTA
- 标准化 / 发表状态: IEEE S&P 2025 peer-reviewed paper
- 对应小方向: Arm CCA I/O/device access, mobile SoC confidential I/O

#### 内容摘要

PORTAL 提出一种基于 Arm CCA memory isolation 的设备访问接口，让 Realm VM 与指定外设共享受硬件访问控制保护的 plaintext region。

#### 研究背景

移动 SoC 集成设备数量多、I/O 实时性强、功耗敏感；传统 shared-buffer encryption 会导致性能和能耗压力。

#### 解决方案

通过 System Realm、SMMU、RMM/Monitor 和 CCA GPT/GPC 组合实现动态设备 attach/detach，并用 attestation measurement 约束管理状态。

#### 实验结果

论文报告约 9.8% one-time overhead，GPU use cases 中 1.07x--9.07x 性能收益，并有功耗收益。

#### 文章评价

PORTAL 是 Arm CCA device-access 的关键相关工作；但它依赖 SoC-integrated device 假设，不能替代 PCIe/TDISP/SPDM 可信设备生命周期机制。
<!-- END PAPER REVIEW -->
