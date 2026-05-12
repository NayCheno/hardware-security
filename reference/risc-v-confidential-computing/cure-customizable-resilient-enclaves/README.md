# CURE: A Security Architecture with CUstomizable and Resilient Enclaves

- BibTeX key: `bahmani2021cure`
- Category: `risc-v-confidential-computing`
- Authors: Raad Bahmani; Ferdinand Brasser; Ghada Dessouky; Patrick Jauernig; Matthias Klimmek; Ahmad-Reza Sadeghi; Emmanuel Stapf
- Year: 2021
- Venue: 30th USENIX Security Symposium (USENIX Security 2021)
- Source: https://arxiv.org/abs/2010.15866
- PDF source: https://arxiv.org/pdf/2010.15866
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Evidence role: Peer-reviewed SOTA. Use for the specific mechanism, evaluation, and threat-model scope established by the source; avoid broader claims outside its evidence class.

<!-- BEGIN REVIEW -->
## Review
### 1. 论文基本信息

- 论文标题: CURE: A Security Architecture with Customizable and Resilient Enclaves
- 作者 / 机构: Raad Bahmani 等 / TU Darmstadt
- 发表会议 / 年份: USENIX Security 2021 / arXiv 2020
- 领域分类: 架构 / 系统 / 安全
- 一句话总结: CURE 提出可定制 enclave 类型，并支持 enclave-to-peripheral binding、cache resource allocation 和多 privilege-level 隔离。
- 最核心贡献一句话: 它把 RISC-V enclave 从 one-size-fits-all 推向可配置边界和外设绑定。

### 2. 研究问题与背景

现有 TEE 通常只有单一 enclave 类型，难支持 MLaaS、外设/accelerator、multi-core 和细粒度 cache side-channel 防护。CURE 目标是在强软件攻击者控制 OS/hypervisor/部分 firmware 的情况下保护 enclave 和 TCB，并支持 DMA/peripheral binding。

### 3. 核心方法拆解

机制路径为 `service requirements -> enclave type/config -> security monitor -> CPU/cache/bus hardware primitive -> memory/peripheral/cache ownership`。核心类型包括 sub-space enclave、user-space enclave、self-contained enclave。硬件原语涉及 CPU core、system bus filtering、shared cache partition 和 peripheral/resource mapping。

### 4. 安全性 / 正确性分析

威胁模型包括强软件攻击者和 DMA 攻击，排除物理攻击、hardware bugs 和 DoS。强项是明确把 peripherals、cache side-channel 和 privilege-level boundary 纳入设计。弱点是安全依赖新的 bus/cache/monitor primitives，形式化证明和真实复杂 SoC 覆盖有限。

### 5. 实现细节

实现于 RISC-V-based SoC / Rocket Chip，评估 FPGA 和 cycle-accurate simulator。需要硬件修改、security monitor 和 runtime support。复现难度高，尤其是外设绑定和 shared cache primitive。

### 6. 实验设计分析

论文报告标准 benchmark 几何平均性能开销 15.33%，并评估硬件组件和代码规模。实验覆盖 micro/macro benchmarks，但对真实 accelerator、PCIe/CXL 设备、现代 confidential VM 的 comparison 不足。

### 7. Novelty 分析

分类: strong research novelty。它同时处理 enclave type customization、peripheral binding 和 cache resource protection，比单一 PMP enclave 更完整。

### 8. 局限性与可能漏洞

最大限制是需要硬件原语，标准化和商业采纳不确定。外设安全仍依赖 device state reset、identity 和 bus filtering；与 CoVE-IO/TDISP/IDE 比较时应标明年代和 threat model 差异。

### 9. 和已有工作的关系

CURE 扩展 Sanctum/Keystone/Sanctuary/Komodo 等路线，也连接 sIOPMP/CoVE-IO 的 I/O protection 主题。它不是 confidential VM，但对 device binding 讨论很有价值。

### 10. 复现与再实现计划

最小复现目标是实现 user-space enclave 和 peripheral binding demo，构造恶意 DMA 测试。需要 Rocket Chip/CURE repo、FPGA/simulator、benchmark suite。验收标准是 enclave memory/peripheral/cache resource 不被非授权软件访问。

### 11. 对后续研究的启发

1. 用 CURE 对照 CoVE-IO 的 device binding。2. 将 customizable enclave type 纳入 RISC-V lineage 表。3. 对 bus filtering 做形式化验证。4. 研究 accelerator enclave 和 TDISP/IDE 组合。5. 评估 CURE-style cache allocation 对 modern side-channel 的覆盖。潜在 venue: USENIX Security、ASPLOS、CCS、HOST、DAC。

### 12. Evidence README Addendum
- Evidence role: Peer-reviewed SOTA. Use for the specific mechanism, evaluation, and threat-model scope established by the source; avoid broader claims outside its evidence class.
- 标准化 / 发表状态: peer-reviewed USENIX Security 2021
- 对应小方向: RISC-V TEE lineage; RISC-V CoVE-IO / TEE-I/O 背景

#### 内容摘要

CURE 支持多种 enclave 类型、外设绑定和 cache resource 隔离。

#### 研究背景

单一 enclave abstraction 难满足现代服务对 privilege、multi-core、peripheral 和 side-channel 的不同需求。

#### 解决方案

通过 CPU/bus/cache 硬件原语和 security monitor，让 enclave 边界和资源绑定可配置。

#### 实验结果

论文报告标准 benchmark 几何平均开销 15.33%。

#### 文章评价

系统贡献强，尤其适合写 RISC-V enclave 到 trusted I/O 的过渡；缺点是硬件采纳和标准化不确定。
<!-- END REVIEW -->
