# RISC-V Application-Processor Trusted Execution Environment Specification

- BibTeX key: `riscv_ap_tee_2024`
- Category: `risc-v-confidential-computing`
- Authors: RISC-V Non-ISA AP-TEE contributors
- Year: 2024
- Source: https://github.com/riscv-non-isa/riscv-ap-tee
- Release: https://github.com/riscv-non-isa/riscv-ap-tee/releases/tag/v0.7
- PDF source: https://github.com/riscv-non-isa/riscv-ap-tee/releases/download/v0.7/riscv-cove.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Standardization status: v0.7 draft / RC2 for ARC review; treat as not ratified
- Evidence role: Draft/not ratified. Public RISC-V AP-TEE v0.7 draft/RC2 source for CoVE/AP-TEE lifecycle and ABI concepts; always mark as draft/not ratified.

<!-- BEGIN REVIEW -->
## Review
### 1. 论文基本信息

- 论文标题: RISC-V Application-Processor Trusted Execution Environment Specification / Confidential VM Extension (CoVE)
- 作者 / 机构: RISC-V AP-TEE Task Group
- 发表会议 / 年份: Specification draft v0.7 / 2024
- 领域分类: 架构 / 系统 / 安全
- 一句话总结: 规范定义 RISC-V CoVE/AP-TEE 的 TVM、TSM、COVH/COVG/COVI ABI、memory lifecycle 和 attestation 语义。
- 最核心贡献一句话: 它是当前 RISC-V confidential VM 与 Arm CCA 同层对照的核心 Draft/not ratified 规范证据。

### 2. 研究问题与背景

RISC-V 需要从 PMP-based enclave 上升到 confidential VM 层级，使 guest/tenant 不必信任 host OS/hypervisor。规范解决 TVM 创建、内存捐赠/回收/共享、TSM 保护、attestation evidence 和中断/guest/host ABI 的标准化问题。v0.7 PDF 明确为 development draft，not ratified。

### 3. 核心方法拆解

机制路径为 `host/COVH -> TSM/TSM-driver -> TVM lifecycle -> confidential memory mapping -> COVG guest calls -> attestation evidence`。核心模块包括 TVM、TSM、Supervisor Domains、THCS/VHCS、COVH/COVG/COVI、memory convert/reclaim/add measured/shared/zero pages、AIA IMSIC binding、TVM token 和 layered evidence。

### 4. 安全性 / 正确性分析

威胁模型将 host/hypervisor 视为不可信管理者，目标是保护 TVM memory/register state/attestation。强假设是 TSM 和底层硬件正确，平台 attestation key 和 measurement 正确，memory lifecycle 没有 alias/race。规范不是证明；实现仍需验证 TLB shootdown、page conversion、interrupt binding、MMIO/shared memory corner cases。

### 5. 实现细节

规范无单一实现，但定义 SBI ABI 和 deployment models。实现依赖 RISC-V H-extension、AIA、IOMMU/IOPMP/SoC memory isolation、TSM firmware 和 host/guest software。复现难点是搭建完整 TVM stack 和 attestation chain。

### 6. 实验设计分析

规范草案无实验。验证应覆盖 TVM creation/finalize/run/destroy、memory donation/reclaim/share、measured pages、COVI interrupt binding、COVG attestation calls 和 hostile host fuzzing。不能引用它作为性能证据。

### 7. Novelty 分析

分类: solid systems contribution。作为标准草案，贡献在将 RISC-V confidential VM 生命周期和 ABI 固化为可实现接口。

### 8. 局限性与可能漏洞

最大限制是 draft/not ratified。CoVE-IO 另有独立草案，AP-TEE 本体对真实设备、安全 DMA、PCIe IDE/TDISP/SPDM 覆盖不完整。host-controlled resource management 的 race、side-channel、DoS 和实现 bug 仍是风险。

### 9. 和已有工作的关系

它是 `sahita2023cove` 的规范化后续，与 Arm CCA/RME/RMM 同层。它依赖/关联 RISC-V privileged architecture、H-extension、AIA、IOMMU、IOPMP 和 CoVE-IO。与 Keystone/Penglai/SPEAR-V 不同，它保护 VM/TVM 而非单进程 enclave。

### 10. 复现与再实现计划

最小复现目标是在 emulator/FPGA 上实现 TSM stub、COVH create/finalize/run、memory conversion 和 COVG evidence call。需要 RISC-V hypervisor stack、TSM firmware、host KVM/QEMU patch 或 test harness。验收标准是 hostile host 无法映射 confidential pages，TVM token measurement 可复验，shared pages 显式 lifecycle。

### 11. 对后续研究的启发

1. AP-TEE 与 Arm CCA 的 granule/page lifecycle 对照。2. TSM ABI fuzzing 和 formal model。3. TVM memory sharing 的 race-free proof。4. CoVE attestation evidence 与 EAT/CCA token 的统一 verifier。5. CoVE-IO 与 AP-TEE 生命周期合并验证。潜在 venue: ASPLOS、USENIX Security、IEEE S&P、CCS、HOST。

### 12. Evidence README Addendum
- Evidence role: Draft/not ratified. Public RISC-V AP-TEE v0.7 draft/RC2 source for CoVE/AP-TEE lifecycle and ABI concepts; always mark as draft/not ratified.
- 标准化 / 发表状态: v0.7 draft, development state, not ratified
- 对应小方向: RISC-V CoVE / AP-TEE confidential VM

#### 内容摘要

AP-TEE/CoVE 规范定义 RISC-V TVM、TSM、memory lifecycle、COVH/COVG/COVI ABI 和 attestation evidence。

#### 研究背景

RISC-V confidential computing 需要标准化 VM-level TEE，而不能只依赖 PMP enclave 原型。

#### 解决方案

以 TSM 作为 trusted protection module，让 host 通过 COVH 管理 TVM，但关键 memory/interrupt/attestation 状态由 TSM enforce。

#### 实验结果

规范草案，无新实验。

#### 文章评价

这是本 survey 最关键的 RISC-V confidential VM 材料。正文必须标注 draft/not ratified，并避免把它和 legacy RISC-V enclave 混写。
<!-- END REVIEW -->
