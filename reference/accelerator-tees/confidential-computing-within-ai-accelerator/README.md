# Confidential Computing within an AI Accelerator

- BibTeX key: `vaswani2023itx`
- Category: `accelerator-tees`
- Authors: Kapil Vaswani; Stavros Volos; Cedric Fournet; Antonio Nino Diaz; Ken Gordon; Balaji Vembu; Sam Webster; David Chisnall; Saurabh Kulkarni; Graham Cunningham; Richard Osborne; Daniel Wilkinson
- Year: 2023
- Venue: USENIX ATC 2023
- Source: https://www.usenix.org/conference/atc23/presentation/vaswani
- PDF source: https://www.usenix.org/system/files/atc23-vaswani.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Survey lane: confidential-computing network/I/O/data-path defense
- SOTA role: foundational accelerator TEE system showing native confidential-computing support inside an AI accelerator.

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 1. 论文基本信息

- 论文标题: Confidential Computing within an AI Accelerator
- 作者 / 机构: Microsoft; Graphcore; Meta; Lucata Systems; XTX Markets; Imagination Technologies
- 发表会议 / 年份: USENIX ATC 2023
- 领域分类: 系统 / 架构 / 硬件
- 一句话总结: 论文提出 IPU Trusted Extensions (ITX)，在 Graphcore AI accelerator 内实现 TEE、attestation 和 PCIe bandwidth authenticated encryption。
- 最核心贡献一句话: 它证明 accelerator 可以原生成为 confidential-computing TCB 的一部分，而不只是 CPU TEE 的外设。

### 2. 研究问题与背景

AI workload 的敏感数据和模型常在 accelerator 上处理。CPU TEE 保护不了 accelerator 内部明文执行，也无法消除 host runtime/driver 对 accelerator state 的控制。论文要解决的是在不信任 host CPU 的情况下，把训练任务安全委托给 AI accelerator。

### 3. 核心方法拆解

机制路径为 `host submits encrypted workload -> CCU hardware root of trust -> IPU TEE creation -> attestation/key exchange -> PCIe authenticated encryption -> on-chip plaintext compute -> protected result return`。核心模块包括 ITX execution mode、Confidential Compute Unit、device identity、attestation report、cryptographic engines、compiler/runtime support 和 provisioning/update protocols。

### 4. 安全性 / 正确性分析

威胁模型排除完全物理攻击，重点是不信任 host CPU/software。安全边界清晰: 明文只在 IPU chip 内出现，host 与外部内存看到的是加密数据。强假设是 CCU、firmware、compiler/runtime 和 IPU TEE mode 正确。

### 5. 实现细节

论文在 Graphcore GC200 IPU 上实现实验支持，7nm tape-out，硬件扩展小于 1% ASIC area。实现包括硬件 RoT、PCIe line-rate crypto engine、firmware provisioning、attestation 和 TensorFlow runtime/compiler 支持。

### 6. 实验设计分析

论文使用标准 DNN training workload 评估，报告 ITX 相对非机密 IPU workload 小于 5% overhead，并相对 CPU-based AMD SEV-SNP confidential computing system 最高 17x 性能收益。实验强项是真 ASIC 原型，弱点是产品化、跨设备链路加密和开放复现有限。

### 7. Novelty 分析

分类: potentially top-tier contribution。它不是把 CPU TEE 透传到 GPU，而是直接在 accelerator 内部加入 TEE mode、RoT、attestation 和 PCIe 加密数据路径。

### 8. 局限性与可能漏洞

原型使用 discrete HRoT，IPU-IPU link 未加密，物理链路攻击仍是限制。它适用于静态编译、资源独占的 IPU 模型，不一定直接迁移到 GPU/DPU/SmartNIC 的动态调度和共享队列。

### 9. 和已有工作的关系

它是 accelerator TEE SoK 的重要代表系统，可与 ACAI、Devlore、CoVE-IO、TDISP/IDE 和 SEV-TIO 对照。正文应把它放在“设备原生 TEE”而非“CPU confidential VM”类别。

### 10. 复现与再实现计划

真实复现需要 ITX-capable IPU，不现实。最小复现目标是用 accelerator simulator/FPGA 复刻 `encrypted host memory -> device RoT attestation -> on-chip plaintext execution -> encrypted PCIe transfer`。验收标准是 host 无法读写 workload 明文，attestation report 与 loaded task 绑定。

### 11. 对后续研究的启发

1. 为 SmartNIC/DPU 构建 ITX-style device TEE。2. 把 SPDM/TDISP/IDE 与 accelerator-native attestation 对齐。3. 研究 multi-accelerator link encryption。4. 比较 static compiler scheduling 与 dynamic GPU runtime 的 TCB。5. 建立 confidential accelerator benchmark suite。

### 12. SOTA README Addendum

- SOTA 定位: Foundational accelerator TEE system
- 标准化 / 发表状态: peer-reviewed USENIX ATC 2023 paper
- 对应小方向: accelerator/device TEE; 机密计算网络 / I/O / fabric 防御

#### 内容摘要

ITX 在 AI accelerator 内加入 TEE、attestation 和 PCIe 加密数据路径。

#### 研究背景

CPU confidential computing 不能保护 accelerator 内部明文执行和设备 runtime。

#### 解决方案

在 IPU 上增加 execution mode、hardware RoT、attestation、cryptographic engines 和 compiler/runtime support。

#### 实验结果

论文报告小于 5% overhead，且相对 CPU-based SEV-SNP confidential ML 最高 17x 性能收益。

#### 文章评价

这是 accelerator confidential computing 的强系统证据；但原型依赖特定 IPU，通用 GPU/DPU/NIC 仍需独立方案。
<!-- END PAPER REVIEW -->
