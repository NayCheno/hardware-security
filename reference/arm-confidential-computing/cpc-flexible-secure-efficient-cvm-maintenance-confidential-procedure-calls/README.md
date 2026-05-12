# CPC: Flexible, Secure, and Efficient CVM Maintenance with Confidential Procedure Calls

- BibTeX key: `chen2024cpc`
- Category: `arm-confidential-computing`
- Authors: Jiahao Chen, Zeyu Mi, Yubin Xia, Haibing Guan, Haibo Chen
- Year: 2024
- Venue: USENIX Annual Technical Conference (USENIX ATC 2024)
- Source: https://www.usenix.org/conference/atc24/presentation/chen-jiahao
- PDF source: https://www.usenix.org/system/files/atc24-chen-jiahao.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12 with `pdfinfo`; 19 pages
- Survey lane: Arm/RISC-V confidential-computing defense
- Evidence role: E1 peer-reviewed primary paper. Use for CVM maintenance, guest-side maintenance invocation, and the paper's AMD SEV-SNP / Arm CCA prototype evidence; do not cite as an Arm official interface or a general trusted-I/O mechanism.

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 1. 论文基本信息

- 论文标题: CPC: Flexible, Secure, and Efficient CVM Maintenance with Confidential Procedure Calls
- 作者 / 机构: Jiahao Chen, Zeyu Mi, Yubin Xia, Haibing Guan, Haibo Chen; Shanghai Jiao Tong University
- 发表会议 / 年份: USENIX ATC 2024
- 领域分类: 系统 / 安全 / OS
- 一句话总结: CPC 把 CVM maintenance module 放回 tenant-trusted guest 内部，用 host 调度专用 vCPU 的方式触发维护逻辑，避免把 live migration、snapshot、resource reclamation 等功能塞进固件。
- 最核心贡献一句话: 它提出 Confidential Procedure Calls 和 Confidential Page Table Isolation，让 CVM 可以在不放宽 host 数据访问的前提下执行可定制维护过程。

### 2. 研究问题与背景

论文要解决 CVM 的运维悖论: CVM 通过阻止 host 访问 guest private memory 和 register state 来保护租户数据，但传统 VM maintenance 正需要 host intrusive access 或 host-provided in-guest agent。live migration、snapshotting、disaster recovery、monitoring、security scanning、backup、resource reclamation 都因此受阻。

作者声称现有方案常把维护逻辑转移到 firmware / infrastructure domain，导致灵活性差、跨平台差、TCB 膨胀，并可能受 firmware 性能瓶颈影响。这个 gap 对本 survey 成立，因为 Arm CCA/RME/GPT/GPC 解释了 protected memory lifecycle，但 survey 原本缺少近年顶会对 CVM maintenance、migration、snapshot 和 reclaim 的系统证据。

威胁模型继承 CVM: host/hypervisor 不可信，guest 私有内存和 vCPU state 受 CVM 保护；infrastructure domain 可信。论文明确 side-channel 和 DoS 不在 CVM threat model 内，因此不能把 CPC 写成解决这些攻击。

### 3. 核心方法拆解

机制路径是: `host schedules hvCPU -> guest-trusted CPC module executes inside CVM -> CPC accesses private data through guest authority -> host only sees control-plane scheduling -> optional CPTI isolates CPC from guest OS`。

CPC 的关键思想是利用 host 仍然保留的 control plane: host 可以调度 vCPU，但不能直接读写 CVM data plane。CPC 把维护过程绑定到 host-visible 的专用 hvCPU 上，由 host 触发执行，但 code/data 在 CVM 内部受保护。CPTI 则为需要抵御 compromised guest OS 的维护任务提供 intra-CVM page-table isolation，使 CPC code/data 和 guest OS 隔离。

### 4. 安全性 / 正确性分析

安全边界是: host 可以触发、暂停、调度 CPC，但不能直接观察 CPC 的 code/data 或 guest private memory；guest/tenant 预先信任并配置维护模块。对于 disaster recovery、snapshot 等需要 guest OS 失效或被攻陷时仍能执行的场景，CPTI 提供额外隔离。论文不把 host DoS、side-channel、恶意硬件、物理攻击纳入保护目标。

主要风险是 CPC 扩展了 guest 内部的维护 TCB: 维护模块本身必须由租户信任，且其语义正确性、密钥处理、数据导出策略需要由部署方控制。CPTI 缓解 guest OS 对 CPC 的干扰，但并不自动证明所有 maintenance module 安全。

### 5. 实现细节

论文实现了两个原型: AMD SEV-SNP real-machine 原型用于性能评估，Arm CCA official simulator 原型用于验证跨平台和安全设计。实现涉及 vCPU/hvCPU 调度语义、CPC 入口、guest-side maintenance module、CPTI page-table isolation、host trigger/suspend 路径和 CVM memory ownership 机制。Arm CCA 侧由于缺少真实硬件，证据应标注为 simulator prototype。

### 6. 实验设计分析

实验覆盖 resource reclamation、live migration、加密/抽取 private data、CPC 与 firmware-based 或 guest-agent baseline 的对比。论文摘要报告 resource reclamation 快约 3x，live migration 相比既有 AMD-SP-based 方案快约 138x，private data encryption/extraction 超过 340x。强项是同时展示 AMD SEV-SNP 性能和 Arm CCA 可移植性；局限是 Arm CCA 部分依赖 official simulator，真实硬件部署、云平台运维流程和多租户策略仍需后续验证。

### 7. Novelty 分析

Novelty 分类: `strong research novelty`。CPC 的新意不在某个加密 primitive，而在把 CVM maintenance 的 vantage point 从 host/firmware 移到 guest-trusted procedure，同时保留 host 调度触发语义。它为 CVM lifecycle survey 补上 live migration、snapshot、resource reclamation 这一类运维状态转换问题。

### 8. 局限性与可能漏洞

最大局限是维护模块需要 tenant 信任和正确配置；如果 CPC module 本身有漏洞或导出过多数据，CVM boundary 不能自动修复。CPC 还依赖 host control plane 的可用性，不解决 DoS。Arm CCA 证据是 simulator prototype，不是 production CCA deployment。与 device assignment、TDISP、SPDM、trusted interrupt delivery 的组合关系需要另行研究。

### 9. 和已有工作的关系

CPC 与 Arm CCA/RME/RMM 是互补关系: Arm CCA 定义 Realm、memory ownership 和 lifecycle 基础，CPC 研究如何在 CVM 内安全执行维护过程。它也与 Cerberus 的 snapshot/clone、CAEC 的 inter-CVM sharing、PORTAL/Devlore 的 device/interrupt lifecycle 形成相邻问题，但 CPC 重点是 CVM maintenance 而非 device I/O 或 inter-CVM communication。

### 10. 复现与再实现计划

最低复现目标是在 SEV-SNP 或模拟 CCA 环境中实现一个 CPC module: host 创建/调度 hvCPU，guest 内 CPC 执行 resource reclamation 或 snapshot metadata collection，host 无法直接读 private memory。需要 CVM 平台、KVM/QEMU 修改或 simulator、guest kernel/module、CPTI 测试和 baseline。验收标准是 host 只能触发过程，不能读 CPC private data；busy guest 下 CPC 仍能获得 dedicated execution；CPTI 模式下 compromised guest OS 不能改写 CPC code/data。

### 11. 对后续研究的启发

1. CCA-native migration protocol: 将 CPC 与 RMM/GPT/RIPAS 状态机结合，定义 migration/snapshot 的可验证状态转换。
2. CPC + attestation policy: 把 CPC module hash、允许导出字段和 verifier policy 绑定，防止维护模块过度授权。
3. CPC for confidential I/O cleanup: 用 CPC 执行 vNIC/DPU/device queue cleanup，研究与 TDISP/SPDM/CoVE-IO 的关系。
4. Formal verification of CPTI: 对 CPC page-table isolation 和 guest OS 攻击面做模型检查。
5. Cross-platform CVM maintenance API: 比较 SEV-SNP、TDX、Arm CCA、RISC-V CoVE/AP-TEE 上可抽象的 host trigger 与 guest execution 语义。

### 12. SOTA README Addendum

- SOTA 定位: Academic SOTA
- 标准化 / 发表状态: peer-reviewed USENIX ATC 2024
- 对应小方向: Arm CCA deployment and CVM lifecycle / maintenance

#### 内容摘要

CPC 提出在 CVM 内执行 tenant-trusted maintenance procedure，由 host 通过调度专用 vCPU 触发，避免 host intrusive access 或 firmware TCB 膨胀。

#### 研究背景

CVM 阻止 host 访问 guest private state，导致 live migration、snapshot、resource reclamation 等传统 VM 运维机制失效；把功能放进 firmware 又牺牲灵活性和 TCB 简洁性。

#### 解决方案

Confidential Procedure Calls 使用 hvCPU 调度语义触发 guest-side maintenance module，CPTI 在需要时隔离 CPC 与 guest OS。AMD SEV-SNP 原型展示性能，Arm CCA simulator 原型展示跨平台适配。

#### 实验结果

论文报告 resource reclamation 约 3x、live migration 约 138x 加速，private data encryption/extraction 超过 340x；Arm CCA 结果来自 official simulator。

#### 文章评价

CPC 是 CVM lifecycle/maintenance 缺口的重要顶会证据。它应被写成 CVM maintenance 系统论文，而不是 Arm 官方 CCA 接口、通用 trusted I/O 或完整生产迁移规范。
<!-- END PAPER REVIEW -->
