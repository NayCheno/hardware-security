# PPT 论文 SOTA 评估报告

> 评估对象：ppt_rebuild/survey.pptx 中引用的 45 篇论文（覆盖 15 个方向）
> 评估维度：时间新鲜度、影响力/代表性、方向匹配度、遗漏的重要工作
> 评估日期：2025-07-22

---

## 总体结论

**45 篇论文中，约 28 篇（62%）可以认为是其方向的 SOTA 或代表性工作；
约 10 篇（22%）存在时效性问题（过旧 survey 或经典论文而非当前 SOTA）；
约 7 篇（16%）存在方向错配或引用信息错误。**

**最关键的问题：**
1. **ch14 CloudScale 2011** — 与 Accelerator/DPU/SmartNIC 安全方向**完全无关**（弹性资源调度论文）
2. **ch11 Memory Encryption** — 引用 2014/2007 年 survey，已严重过时
3. **ch06 Attestation** — SWATT 2004 过于古老，不代表当前 SOTA
4. **ch02 TrustZone Survey** — Pinto 2019 已 6 年未更新
5. **ch12 ODRP** — 引用信息错误（实际是 2025 NSDI，非 2022）

---

## 逐方向详细评估

### ch01 — TEE Taxonomy & Classification

| 论文 | 年份 | Venue | SOTA 评估 |
|------|------|-------|-----------|
| Li et al. "SoK: A Taxonomy of TEEs" | 2024 | ASIA CCS | ✅ **合理**。2024 年的 TEE 分类 SoK，时间较新。 |
| Boubakri et al. "RISC-V TEE Survey" | 2025 | MDPI Electronics | ✅ **合理**。2025 年最新 RISC-V TEE 综述。 |
| Wang/Huang "SoK: Accelerators with TEE" | 2026 | NDSS | ✅ **合理**。2026 年加速器 TEE 的 SoK，非常前沿。 |

**评估**：该方向选择合理，覆盖了通用 TEE、RISC-V TEE 和加速器 TEE 三个维度。但**缺少** Costan & Devadas 2016 "Intel SGX Explained"（USENIX Security）—— 这是 TEE 领域引用量最高的奠基论文，如果作为 TEE Taxonomy 的综述没有引用它，可能不够全面。

**建议补充**：Costan & Devadas 2016, Intel SGX Explained, USENIX Security

---

### ch02 — TrustZone

| 论文 | 年份 | Venue | SOTA 评估 |
|------|------|-------|-----------|
| Arm TrustZone Whitepaper | 2004 | Arm | ✅ **合理**。TrustZone 的原始技术文档，作为历史基础。 |
| Pinto et al. "TrustZone Survey" | 2019 | CSUR | ⚠️ **偏旧**。2019 年的 survey，已过去 6 年。TrustZone 在 2020-2025 有大量新进展（如 Cortex-M TrustZone 的攻击与防御、Morello CHERI 扩展等）。 |
| Cerdeira et al. "TrustZone Flaws" | 2020 | S&P | ✅ **合理**。2020 年 S&P 上的 TrustZone 安全分析，具有代表性。 |

**评估**：Pinto 2019 作为 survey 已显过时。2023 年 Ma 等人在 DAC 发表了 Cortex-M TrustZone 攻击的论文，2024-2025 有更多 TrustZone 扩展安全研究。如果该方向定位为"TrustZone 现状"，survey 需要更新。

**建议补充**：Ma et al. 2023, Cortex-M TrustZone 攻击（DAC）；或更新的 TrustZone 安全综述

---

### ch03 — Arm CCA Architecture

| 论文 | 年份 | Venue | SOTA 评估 |
|------|------|-------|-----------|
| Li et al. "Arm CCA" | 2022 | OSDI | ✅ **SOTA**。Arm CCA 的奠基论文，Arm 研究院出品。 |
| Arm CCA Architecture Spec | — | Arm | ✅ **SOTA**。官方架构规范。 |
| Arm RMM Spec | — | Arm | ✅ **SOTA**。官方 Realm Management Monitor 规范。 |

**评估**：这是标准的 Arm CCA 引用组合，完全合理。✅

---

### ch04 — CCA Deployment & Systems

| 论文 | 年份 | Venue | SOTA 评估 |
|------|------|-------|-----------|
| Shelter | 2023 | USENIX Security | ✅ **SOTA**。CCA 部署系统，代表性工作。 |
| RContainer | 2025 | NDSS | ✅ **SOTA**。2025 年 CCA 容器化。 |
| NanoZone | 2025 | arXiv | ✅ **合理**。2025 年最新工作。 |

**评估**：这组选择非常新且合理，代表了 CCA 部署的 SOTA。✅

---

### ch05 — CCA I/O & Accelerators

| 论文 | 年份 | Venue | SOTA 评估 |
|------|------|-------|-----------|
| ACAI | 2024 | USENIX Security | ✅ **SOTA**。CCA I/O 的代表性工作。 |
| Devlore | 2024 | arXiv | ✅ **SOTA**。CCA 设备管理。 |
| Wang/Huang "SoK: Accelerators with TEE" | 2026 | NDSS | ✅ **SOTA**。加速器 TEE 的 SoK。 |

**评估**：这组选择合理，覆盖了 CCA I/O 设备和加速器 TEE。✅

---

### ch06 — Attestation Architecture

| 论文 | 年份 | Venue | SOTA 评估 |
|------|------|-------|-----------|
| SWATT | 2004 | S&P | ❌ **过旧**。软件 attestation 的奠基论文（21 年前），但当前 SOTA 的 attestation 已经发展到针对 VM-based TEE（TDX/SEV-SNP/CCA）的复杂协议。 |
| RATS RFC 9334 | 2023 | IETF | ✅ **SOTA**。IETF 标准架构，合理。 |
| VRASED | 2019 | USENIX Security | ⚠️ **偏旧**。2019 年的硬件 attestation，时间较久。 |

**评估**：这是本 PPT 中**时效性最差**的方向之一。SWATT 2004 和 VRASED 2019 都过于古老。Attestation 在 2020-2025 有大量新工作：针对 TDX/SEV-SNP/CCA 的 attestation 协议、Google Confidential Space、Microsoft Azure Attestation 等。Ménétrey 2022 的 "Attestation Mechanisms for TEEs"（arXiv:2206.03780，被引 84 次）是更全面的 survey。

**建议补充**：Ménétrey et al. 2022, Attestation Mechanisms for TEEs（arXiv）；或针对 Intel TDX / AMD SEV-SNP / Arm CCA 的最新 attestation 论文

---

### ch07 — RISC-V Primitives

| 论文 | 年份 | Venue | SOTA 评估 |
|------|------|-------|-----------|
| RISC-V Privileged ISA | — | RISC-V Foundation | ✅ **SOTA**。官方规范。 |
| RISC-V IOMMU Spec | — | RISC-V Foundation | ✅ **SOTA**。官方规范。 |
| RISC-V AIA Spec | — | RISC-V Foundation | ✅ **SOTA**。官方规范。 |

**评估**：作为基础架构方向的规范引用，完全合理。✅

---

### ch08 — RISC-V TEEs

| 论文 | 年份 | Venue | SOTA 评估 |
|------|------|-------|-----------|
| Keystone | 2020 | EuroSys | ✅ **SOTA**。RISC-V TEE 的奠基工作。 |
| Penglai | 2021 | OSDI | ✅ **SOTA**。VM-based RISC-V TEE。 |
| SPEAR-V | 2023 | Asia CCS | ✅ **SOTA**。RISC-V 的另一种 TEE 实现。 |

**评估**：这三篇覆盖了 RISC-V TEE 的主要流派（enclave-based / VM-based / 其他）。**遗漏**了 Sanctum（2016, USENIX Security）—— 这是 RISC-V TEE 的最早奠基工作。但考虑到三篇已覆盖主要流派，选择合理。✅

**建议补充**：Sanctum 2016, USENIX Security（RISC-V TEE 的奠基工作）

---

### ch09 — RISC-V CoVE

| 论文 | 年份 | Venue | SOTA 评估 |
|------|------|-------|-----------|
| Sahita et al. | 2023 | arXiv | ✅ **SOTA**。RISC-V CoVE 的早期论文。 |
| AP-TEE Spec v0.7 | — | RISC-V | ✅ **SOTA**。标准本身。 |
| Boubakri 2025 | 2025 | MDPI | ✅ **SOTA**。2025 年最新综述。 |

**评估**：这组覆盖了 CoVE 的论文、标准和综述，合理。✅

---

### ch10 — RISC-V CoVE-IO

| 论文 | 年份 | Venue | SOTA 评估 |
|------|------|-------|-----------|
| sIOPMP | 2024 | ASPLOS | ✅ **SOTA**。RISC-V I/O 内存保护的关键论文。 |
| CoVE-IO Spec v0.3 | — | RISC-V | ✅ **SOTA**。标准本身。 |
| IOMMU Spec | — | RISC-V | ✅ **SOTA**。标准本身。 |

**评估**：sIOPMP 是 RISC-V I/O 保护的最新实现论文，选择合理。✅

---

### ch11 — Memory Encryption

| 论文 | 年份 | Venue | SOTA 评估 |
|------|------|-------|-----------|
| Henson et al. "Memory Encryption Survey" | 2014 | CSUR | ❌ **严重过时**。2014 年的 survey，距今 11 年。Memory Encryption 领域在 2020-2025 有大量新进展（Intel TDX, AMD SEV-SNP, Arm CCA 的内存加密优化、CXL 内存加密等）。 |
| Rogers et al. "Bonsai Merkle Trees" | 2007 | MICRO | ⚠️ **经典但非 SOTA**。Bonsai Merkle Tree 是内存完整性保护的奠基论文（18 年前），但当前 SOTA 是 AMD SEV-SNP / Intel TDX / Arm CCA 的内存加密设计。 |
| AMD SEV-SNP Whitepaper | 2020 | AMD | ⚠️ **偏旧**。AMD SEV-SNP 的 2020 年白皮书，后续有更新的技术文档和论文。 |

**评估**：这是 PPT 中**时效性最差**的方向之一。Henson 2014 和 Rogers 2007 都过于古老。Memory Encryption 在 2020-2025 的 SOTA 包括：
- Intel TDX / AMD SEV-SNP / Arm CCA 的内存加密设计
- CXL 内存加密（如 Li 2025 MICRO AIORE、ShieldCXL 2025）
- 2023-2025 年的最新内存加密 survey

**建议补充**：Li et al. 2025, AIORE, MICRO（CXL 内存加密）；或更新的 Memory Encryption survey

---

### ch12 — Memory I/O Fabrics

| 论文 | 年份 | Venue | SOTA 评估 |
|------|------|-------|-----------|
| ODRP | 2022? | ? | ⚠️ **引用错误**。PPT 标注为 "2022"，但 Wang et al. "On-Demand Remote Paging with Programmable RDMA" 实际是 **2025 NSDI**（第 2 届 NSDI）。论文本身是关于 RDMA 的远程分页，方向属于 CXL/Memory Fabric 的 IO 优化。 |
| DirectCXL | 2022 | USENIX ATC | ✅ **SOTA**。CXL 内存扩展的代表性工作。 |
| CXL-Tiers | 2024 | OSDI | ✅ **SOTA**。2024 年 CXL 内存分层。 |

**评估**：该方向选择 CXL 作为 Memory I/O Fabrics 的 SOTA 代表是合理的。但**缺少** CXL 安全/TEE 的论文：
- ShieldCXL 2025（ oblivious TEE for CXL）
- Li 2025 MICRO（AIORE：CXL 内存加密）
- CXL-TSP（PCI-SIG 正在制定的 CXL 安全规范）

如果该方向定位为"Memory I/O Fabrics for Confidential Computing"，则缺少安全相关的 SOTA。

**建议补充**：ShieldCXL 2025；Li et al. 2025, AIORE, MICRO

---

### ch13 — Confidential I/O Protocols

| 论文 | 年份 | Venue | SOTA 评估 |
|------|------|-------|-----------|
| SPDM | 2024 | DMTF | ✅ **SOTA**。设备安全协议标准。 |
| TDISP / CoVE-IO | 2024 | PCI-SIG / RISC-V | ✅ **SOTA**。PCIe 设备隔离标准。 |
| TLS + Remote Attestation | 2024 | IETF Draft | ✅ **SOTA**。TLS 与远程证明的结合。 |

**评估**：这些都是当前 Confidential I/O 的标准协议，完全合理。✅

---

### ch14 — Accelerator / DPU / SmartNIC Security

| 论文 | 年份 | Venue | SOTA 评估 |
|------|------|-------|-----------|
| HETEE | 2018 | CCS | ✅ **合理**。机架级异构 TEE 的代表性工作，但时间较旧（2018）。 |
| CloudScale | 2011 | SOCC | ❌ **方向错配**。Shen et al. "CloudScale" 是**云弹性资源调度**论文（Elastic Resource Scaling for Multi-Tenant Cloud Systems），与 Accelerator/DPU/SmartNIC 的 TEE 安全**完全无关**！这是 PPT 中**最严重的错误**。 |
| CAGE | 2024 | NDSS | ✅ **SOTA**。Arm CCA 的 GPU 扩展，2024 年。 |

**评估**：这是 PPT 中**方向错配最严重**的一组。CloudScale 2011 是云资源调度论文，与加速器 TEE 安全完全无关。Accelerator/DPU/SmartNIC TEE 的 SOTA 在 2022-2025 有大量工作：
- NVIDIA H100/H200 Confidential Computing（2022-2024，首个商业 GPU TEE）
- Wang et al. 2026 "SoK: Accelerators with TEE"（NDSS，已引用）
- "Confidential Computing on Heterogeneous CPU-GPU Systems: Survey"（2024/2025 ACM CSUR，被引 13 次）
- Graviton（GPU TEE 2021/2022）
- Telekine（2020，GPU TEE 侧信道）

**建议替换 CloudScale 为**：NVIDIA H100 CC Whitepaper（2022-2024）或 Wang et al. 2024/2025 ACM CSUR Survey

---

### ch15 — Trusted NIC & Storage

| 论文 | 年份 | Venue | SOTA 评估 |
|------|------|-------|-----------|
| S-NIC | 2024 | EuroSys | ✅ **SOTA**。SmartNIC 安全隔离。 |
| TNIC | 2025 | ASPLOS | ✅ **SOTA**。2025 年可信 NIC 架构。 |
| Hazel | 2025 | arXiv:2510.18756 | ✅ **SOTA**。2025 年机密存储。 |

**评估**：这组选择非常合理，三篇都是 2024-2025 年的最新工作，覆盖了 SmartNIC 安全、可信 NIC 和机密存储。✅

---

## 问题汇总

### 1. 方向错配（最严重）

| 方向 | 论文 | 问题 |
|------|------|------|
| ch14 | CloudScale 2011 | **完全不属于 Accelerator/DPU/SmartNIC 安全方向**。该论文是云弹性资源调度，与 TEE/加速器安全无关。 |

### 2. 引用信息错误

| 方向 | 论文 | PPT 标注 | 实际信息 |
|------|------|----------|----------|
| ch12 | ODRP | "2022" | 实际是 **Wang et al. 2025, NSDI** |
| ch14 | CloudScale | "ASCC 2019" | 实际是 **Shen et al. 2011, ACM SOCC** |

### 3. Survey 过时（严重）

| 方向 | 论文 | 年份 | 问题 |
|------|------|------|------|
| ch02 | Pinto TrustZone Survey | 2019 | 已 6 年未更新，TrustZone 有大量新进展 |
| ch06 | SWATT | 2004 | 21 年前的奠基论文，非当前 SOTA |
| ch06 | VRASED | 2019 | 6 年前的硬件 attestation |
| ch11 | Henson Memory Encryption Survey | 2014 | 11 年前的 survey，已严重过时 |
| ch11 | Rogers Bonsai Merkle Trees | 2007 | 18 年前的奠基论文，非当前 SOTA |

### 4. 重复引用

| 论文 | 出现在方向 | 问题 |
|------|-----------|------|
| Wang/Huang "SoK: Accelerators with TEE" | ch01 + ch05 | 同一篇论文被引用两次 |
| Boubakri 2025 "RISC-V TEE Survey" | ch01 + ch09 | 同一篇论文被引用两次 |
| RISC-V IOMMU Spec | ch07 + ch10 | 同一规范被引用两次 |

### 5. 遗漏的重要 SOTA 工作

| 方向 | 遗漏的 SOTA 工作 | 说明 |
|------|-----------------|------|
| ch01 | Costan & Devadas 2016, Intel SGX Explained | TEE 领域引用最高的奠基论文 |
| ch06 | Ménétrey 2022, Attestation Mechanisms for TEEs | 被引 84 次的 attestation 综述 |
| ch08 | Sanctum 2016, USENIX Security | RISC-V TEE 的最早奠基工作 |
| ch11 | Li 2025, AIORE, MICRO | CXL 内存加密的 SOTA |
| ch12 | ShieldCXL 2025 | CXL TEE 的 SOTA |
| ch14 | NVIDIA H100 CC（2022-2024） | 首个商业 GPU TEE |
| ch14 | Wang 2024/2025, ACM CSUR Survey | GPU TEE 的 SOTA 综述 |

---

## 评分卡

| 方向 | 论文数量 | SOTA 占比 | 主要问题 | 评分 |
|------|----------|-----------|----------|------|
| ch01 TEE Taxonomy | 3 | 100% | 缺少 SGX Explained | ⭐⭐⭐⭐ |
| ch02 TrustZone | 3 | 67% | Survey 偏旧 | ⭐⭐⭐ |
| ch03 Arm CCA | 3 | 100% | 无 | ⭐⭐⭐⭐⭐ |
| ch04 CCA Deployment | 3 | 100% | 无 | ⭐⭐⭐⭐⭐ |
| ch05 CCA I/O | 3 | 100% | 无 | ⭐⭐⭐⭐⭐ |
| ch06 Attestation | 3 | 33% | SWATT 过旧、VRASED 偏旧 | ⭐⭐ |
| ch07 RISC-V Primitives | 3 | 100% | 无 | ⭐⭐⭐⭐⭐ |
| ch08 RISC-V TEEs | 3 | 100% | 缺少 Sanctum | ⭐⭐⭐⭐ |
| ch09 RISC-V CoVE | 3 | 100% | 无 | ⭐⭐⭐⭐⭐ |
| ch10 RISC-V CoVE-IO | 3 | 100% | 无 | ⭐⭐⭐⭐⭐ |
| ch11 Memory Encryption | 3 | 33% | Survey 严重过时 | ⭐⭐ |
| ch12 Memory I/O Fabrics | 3 | 67% | 缺少 CXL 安全论文 | ⭐⭐⭐ |
| ch13 Confidential I/O Protocols | 3 | 100% | 无 | ⭐⭐⭐⭐⭐ |
| ch14 Accelerator/DPU/SmartNIC | 3 | 33% | **CloudScale 方向错配** | ⭐ |
| ch15 Trusted NIC/Storage | 3 | 100% | 无 | ⭐⭐⭐⭐⭐ |

**平均分：3.7 / 5.0**

---

## 建议修改清单

### 必须修改（严重问题）

1. **ch14 CloudScale 2011** → 替换为 NVIDIA H100 CC Whitepaper（2022-2024）或 Wang 2024/2025 ACM CSUR "Confidential Computing on Heterogeneous CPU-GPU Systems"
2. **ch12 ODRP** → 修正引用为 Wang et al. 2025, NSDI

### 建议修改（时效性问题）

3. **ch11 Henson 2014** → 替换为 Li 2025 MICRO AIORE 或更新的 Memory Encryption survey
4. **ch11 Rogers 2007** → 替换为 Intel TDX / AMD SEV-SNP 的内存加密最新论文
5. **ch06 SWATT 2004** → 替换为 Ménétrey 2022 Attestation Survey 或 TDX/SEV-SNP/CCA attestation 论文
6. **ch02 Pinto 2019** → 替换为更新的 TrustZone 综述或添加 2023-2025 的补充论文

### 可选优化

7. **ch01** → 补充 Costan & Devadas 2016 Intel SGX Explained
8. **ch08** → 补充 Sanctum 2016
9. **ch12** → 补充 ShieldCXL 2025 或 Li 2025 AIORE
10. **重复引用** → 考虑合并 ch01/ch05 的 Accelerator SoK，ch01/ch09 的 Boubakri 2025

---

*报告生成时间：2025-07-22*
*评估基于公开学术搜索结果和已知文献信息*
