# TEE Device Interface Security Protocol (TDISP)

- BibTeX key: `pcisig_tdisp_2022`
- Category: `memory-and-io-fabrics`
- Authors: PCI-SIG
- Year: 2022
- Venue: PCI-SIG Engineering Change Notice
- Source: https://pcisig.com/PCI%20Express/ECN/Base/TEEDeviceInterfaceSecurityProtocol
- PDF source: unavailable publicly; PCI-SIG document download is member-gated
- Local PDF: unavailable
- Download status: unavailable: official PDF is behind PCI-SIG member access; public metadata page verified on 2026-05-12
- Survey lane: confidential-computing network/I/O/data-path defense
- Evidence class: E3/E5 hybrid; public PCI-SIG metadata and related public implementation documents only, not a reviewed public PDF
- SOTA role: Spec/industry SOTA for trusted device-interface lifecycle, with gated-spec limitations. Use only for public TDISP existence, role, and lifecycle concepts unless a public source supports the detail.

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 1. 论文基本信息

- 论文标题: TEE Device Interface Security Protocol (TDISP)
- 作者 / 机构: PCI-SIG
- 发表会议 / 年份: PCI-SIG ECN / 2022
- 领域分类: 架构 / 网络 / 安全
- 一句话总结: TDISP 定义 TVM 与 PCIe device interface 建立信任关系、保护 host-device interconnect、可信 attach/detach TDI 的机制。
- 最核心贡献一句话: 它是 confidential I/O 中把设备接口纳入 TVM/Realm/guest 信任边界的关键 PCIe 标准。

### 2. 研究问题与背景

TVM 需要直接使用 VF、accelerator 或 NIC 时，传统 SR-IOV assignment 仍由 host/VMM 控制设备配置和可见路径。TDISP 的目标是让 TSM 与 DSM 管理 TDI lifecycle，使 TVM 能信任被分配的 device interface。

### 3. 核心方法拆解

根据公开元数据和相关规范，机制路径为 `TSM/TVM policy -> SPDM/CMA control channel -> DSM/TDI state machine -> IDE protected interconnect -> trusted attach/detach -> DMA/MMIO policy`。关键概念包括 TEE Device Interface、Device Security Module、TEE Security Manager、SPDM、IDE 和 TDI state。

### 4. 安全性 / 正确性分析

TDISP 不是单独的加密协议。它依赖 SPDM 做身份/measurement/control channel，依赖 PCIe IDE 保护 fabric data path，依赖 IOMMU/IOPMP/SMMU/RMP/GPT 等 host-side memory ownership enforcement。PDF 不公开，当前 README 只基于 PCI-SIG public metadata、AMD SEV-TIO white paper 和 CoVE-IO references。

### 5. 实现细节

实现需要 TDISP-capable device、DSM firmware、host TSM、SPDM stack、IDE keying 和平台 I/O isolation。典型实现映射到 SR-IOV PF/VF: PF/DSM 管理，VF/TDI 分配给 TVM。

### 6. 实验设计分析

无公开实验。验证应覆盖 TDI bind/unbind、state transition、BAR/MMIO lock、IDE key lifecycle、malicious host remapping、device reset/hotplug 和 attestation freshness。

### 7. Novelty 分析

分类: strong systems/spec contribution。TDISP 把 device assignment 从“VMM 配置资源”提升为“TVM 可验证的设备接口信任关系”。

### 8. 局限性与可能漏洞

最大限制是规范 PDF member-gated，公开可审查性弱。多功能设备、shared accelerator、ATS/PRI cache、热插拔、证书撤销、设备固件更新和 DoS 都是后续风险。

### 9. 和已有工作的关系

TDISP 与 SPDM、Secured Messages、PCIe IDE、CoVE-IO、AMD SEV-TIO 和 accelerator TEE SoK 强相关。正文中应把它作为 trusted device-interface lifecycle 标准，而非普通网络安全技术。

### 10. 复现与再实现计划

无公开规范全文时只能做近似复现: 基于 CoVE-IO/SEV-TIO 公开资料建立 TDI state model，用 mock DSM/TSM 验证 bind/unbind 和 trusted MMIO/DMA policy。

### 11. 对后续研究的启发

1. 公开资料下重建 TDISP state abstraction。2. CoVE-IO 与 SEV-TIO 的 TDI lifecycle 对照。3. TDISP + IDE + IOMMU 的组合验证。4. 多租户 SmartNIC/DPU 的 TDI revocation。5. Linux PCI TSM 支持路径跟踪。

### 12. SOTA README Addendum

- SOTA 定位: Spec/industry SOTA, public-metadata limited
- 标准化 / 发表状态: PCI-SIG ECN; official PDF member-gated; local evidence is public metadata, not full spec text
- 对应小方向: 机密计算网络 / I/O / fabric 防御; RISC-V CoVE-IO / TEE-I/O

#### 内容摘要

TDISP 定义 TVM 与设备接口建立可信 I/O virtualization 关系。

#### 研究背景

Confidential VM 不能默认相信 host-controlled device assignment。

#### 解决方案

通过 TSM/DSM/TDI lifecycle、SPDM control plane 和 IDE data path 组合实现可信 attach/detach。

#### 实验结果

规范，无公开实验。

#### 文章评价

是 trusted I/O taxonomy 的核心标准，但因 PDF member-gated，正文只能使用 public metadata / related public documentation 支撑的结论，不能写成已精读完整公开规范。
<!-- END PAPER REVIEW -->
