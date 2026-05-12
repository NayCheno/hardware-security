# Sanctum: Minimal Hardware Extensions for Strong Software Isolation

- BibTeX key: `costan2016sanctum`
- Category: `risc-v-confidential-computing`
- Authors: Victor Costan; Ilia Lebedev; Srinivas Devadas
- Year: 2016
- Venue: 25th USENIX Security Symposium (USENIX Security 2016)
- Source: https://www.usenix.org/conference/usenixsecurity16/technical-sessions/presentation/costan
- PDF source: https://www.usenix.org/system/files/conference/usenixsecurity16/sec16_paper_costan.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Evidence role: Foundational. Use as a foundational entry point for this survey lane; later SOTA, specification, or implementation details should be cited separately when making narrow claims.

<!-- BEGIN PAPER REVIEW -->
## Paper Review
### 1. 论文基本信息

- 论文标题: Sanctum: Minimal Hardware Extensions for Strong Software Isolation
- 作者 / 机构: Victor Costan; Ilia Lebedev; Srinivas Devadas / MIT CSAIL
- 发表会议 / 年份: USENIX Security 2016
- 领域分类: 架构 / 系统 / 安全
- 一句话总结: Sanctum 用最小硬件扩展和可信 security monitor 在开源 RISC-V Rocket core 上实现强软件隔离。
- 最核心贡献一句话: 它是 RISC-V/open hardware enclave 谱系的起点，并把软件侧信道纳入 threat model。

### 2. 研究问题与背景

OS/hypervisor TCB 过大且漏洞多，SGX 文档不透明且排除软件侧信道。Sanctum 要在软件攻击者控制 OS 的情况下保护 enclave 代码/数据及内存访问模式。它排除物理攻击、DoS、hardware bugs 和部分 bandwidth/timing side channels。

### 3. 核心方法拆解

机制路径为 `untrusted OS allocates resources -> security monitor verifies -> per-enclave page tables/cache partitioning/DRAM protection -> enclave execution -> attestation`。核心设计包括 open Rocket RISC-V、page coloring cache partition、DMA blocking、security monitor、remote attestation 和 enclave lifecycle。

### 4. 安全性 / 正确性分析

论文安全边界比 SGX 更强，试图阻止 cache timing 和 passive address translation attacks。强假设是硬件正确、monitor 正确、enclave 不通过 public API 泄露秘密。它不覆盖物理攻击、DoS、DRAM bandwidth/coherence directory timing 和现实多设备 I/O 复杂性。

### 5. 实现细节

原型基于 Rocket RISC-V core，硬件修改位于模块接口，security monitor 多数用 C++。论文声明相关代码开源。复现需老版本 Rocket/Sanctum toolchain，现代复现难度较高。

### 6. 实验设计分析

论文报告 Sanctum core clock speed 不变，page-coloring cache partitioning 带来几个百分点执行时间开销。实验说明 minimal hardware idea 可行，但与现代 OoO、多核、IOMMU/PCIe/CoVE 生态差距明显。

### 7. Novelty 分析

分类: strong research novelty。它将 open hardware、minimal extensions、cache-side-channel-aware isolation 和 analyzable monitor 结合，是后续 Keystone/MI6 等工作的基础。

### 8. 局限性与可能漏洞

最大限制是 2016 时间截面和较简化微架构。对 speculative execution、复杂 memory hierarchy、device assignment、confidential I/O、formal monitor proof 支持不足。

### 9. 和已有工作的关系

Sanctum 继承 Aegis/XOM/SGX 思路，影响 Keystone、MI6、Cerberus 和 RISC-V TEE 研究。与 CoVE/AP-TEE 不同，它是 process/enclave isolation，不是 confidential VM 标准。

### 10. 复现与再实现计划

最小复现目标是重建 enclave create/enter/exit、cache partition 和恶意 OS 页面错误观察测试。验收标准是 OS 无法读写 enclave memory，cache/page-fault side-channel demo 被隔离策略削弱。

### 11. 对后续研究的启发

1. Sanctum 到 CoVE 的演进表。2. Monitor proof 与 implementation refinement。3. cache partition 与 AIA/IOMMU/IOPMP 组合。4. 对 modern OoO core side-channel 扩展。5. 将 Sanctum threat model 更新到 2026。潜在 venue: USENIX Security、CCS、ASPLOS、HOST、IEEE S&P。

### 12. Evidence README Addendum
- Evidence role: Foundational. Use as a foundational entry point for this survey lane; later SOTA, specification, or implementation details should be cited separately when making narrow claims.
- 标准化 / 发表状态: peer-reviewed USENIX Security 2016
- 对应小方向: RISC-V TEE lineage

#### 内容摘要

Sanctum 是开放 RISC-V enclave 的 foundational work，强调 minimal hardware 和软件侧信道防护。

#### 研究背景

传统 OS/hypervisor 不适合作为隔离 TCB，SGX 透明度和 side-channel 假设不足。

#### 解决方案

通过 per-enclave page tables、cache partitioning、DMA protection 和 security monitor 实现 enclave。

#### 实验结果

论文报告时钟不降，page coloring 带来几个百分点执行开销。

#### 文章评价

适合作为 lineage 起点；现代 survey 需补 MI6、Keystone、Penglai、CoVE 和 CoVE-IO。
<!-- END PAPER REVIEW -->
