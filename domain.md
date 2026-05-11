# Domain Coverage Matrix

更新日期：2026-05-12

本文档维护当前 hardware-security survey 的知识域覆盖、SoK/survey 锚点、reference 证据、SOTA 状态和缺口。判断依据包括 `survey/*.tex` 正文、`survey/reference.bib`、`reference/` 本地论文库、公开论文页面、规范 release、arXiv、ACM/IEEE/USENIX/NDSS/RFC/Arm/RISC-V 官方来源。

当前事实：

- `survey/reference.bib`：130 个 BibTeX 条目。
- `survey/*.tex` 正文实际引用：39 个 key，全部能在 Bib 中找到。
- `reference/`：64 个论文/规范 README 条目，50 个本地 `paper.pdf`。
- 本轮补全：RISC-V AP-TEE、CoVE-IO、IOMMU、AIA、ACPI、AMD SEV-SNP、Pinto TrustZone survey、Cerdeira TrustZone SoK、Ling TrustZone attestation 已下载并验证；新增 `li2024sokteechoices`、Sanctum、CURE、MI6、TIMBER-V、Cerberus、ACE、OpenCCA、CAEC、IOPMP、CVA6-CFI、RV-CURE、CHERIoT、Henson memory encryption survey 作为 SoK/SOTA 或 SoK 引用扩展材料。

标记规则：

- `已覆盖`：正文已有实质叙述并引用对应 key。
- `待补足`：Bib/reference 已有材料，但正文还缺机制化展开或引用未进入正文。
- `未提到`：正文缺少该方向的关键概念、论文或规范。
- `SOTA`：当前应优先读/引用的最新或代表性最强材料。arXiv 和 draft spec 可以列为 SOTA，但必须标注 `arXiv`、`draft`、`not ratified`、`release` 或正式 venue。

## 0. 当前科研范围规定

本阶段目标是先把 SoK/survey 的研究边界、分类规则和证据标准定清楚，再补正文。当前 survey 固定为三条主线：Arm/RISC-V 机密计算防御机制、机密计算场景下的网络/数据路径防御机制、以及 ISA/硬件设计防御机制。当前不做侧信道/物理泄漏/故障注入等攻击方向的系统研究。

核心主线：

| 主线 | 研究对象 | 典型机制 / 关键词 | 使用边界 |
|---|---|---|---|
| Arm / RISC-V 机密计算防御机制 | 保护 confidential workload 免受不可信 host/hypervisor/OS/firmware 或设备路径影响的体系结构机制 | Arm TrustZone、CCA、RME、RMM、Realm、GPT/GPC、RIPAS；RISC-V Sanctum/Keystone/Penglai/SPEAR-V/ACE、CoVE/AP-TEE、TSM、TVM、memory donation/reclaim/share、attestation | 主线核心；机制 claims 必须回引原始论文/spec。 |
| 机密计算上的网络 / I/O / 数据路径防御机制 | confidential VM/Realm/TVM 使用 NIC、DPU、SmartNIC、RDMA、PCIe/CXL 设备或网络 offload 时的身份、隔离、加密、完整性、DMA 和中断防护 | CoVE-IO、TEE-I/O、SMMU、IOMMU、IOPMP/sIOPMP、AIA、trusted MSI、device assignment、SPDM、TDISP、PCIe IDE、CXL/RDMA data path、accelerator/device TEE、secure vNIC/vSwitch/offload | 只收“和机密计算边界直接相关”的网络/设备防御；普通 firewall/IDS/VPN/TLS 论文不作为主线。 |
| ISA / 硬件设计防御机制 | 指令集、页表/权限模型、内存系统、控制流、capability/tagging、debug/trace 控制等硬件级防御 | Arm MTE、PAC、BTI、GCS、PAN/PXN/UXN、PTE/page-table permissions、SMMU；RISC-V PMP/ePMP/Smepmp、PTE/page-table permissions、Zicfiss/Zicfilp、IOMMU、IOPMP、AIA；CHERI/CHERIoT、RV-CURE、memory encryption/integrity/replay protection、debug/trace lockdown | 作为 defense-in-depth 和平台设计边界；不能把这类机制写成 TEE/CCA/CoVE 本体。 |

纳入范围：

- 能直接支撑上述三条主线的 SoK、survey、规范、系统论文、实现论文和硬件设计论文。
- 能解释 Arm/RISC-V 机密计算 threat model、TCB、memory ownership、attestation、device/network data path、lifecycle 或 evidence chain 的材料。
- 能澄清 access control、PTE/page-table permissions、encryption、integrity、replay protection、capability/tagging、CFI、debug/trace、DMA/I/O protection 的材料。
- 网络防御材料只有在和 confidential workload、TEE、device assignment、trusted I/O、secure offload、RDMA/CXL/PCIe data path 或 attested network endpoint 直接相关时纳入。

暂不纳入当前研究：

- 侧信道、微架构泄漏、物理泄漏、故障注入、Rowhammer、power/EM、cache timing、speculative leakage 作为独立研究主题。
- attack-only 论文，除非它直接改变某个 in-scope 架构/spec 的 threat-model 解释。
- 普通网络安全论文，例如通用 firewall、IDS/IPS、DDoS、routing security、TLS/VPN/web security，除非它们明确服务于机密计算网络路径或可信网络端点。
- 大范围漏洞谱系整理，除非用于说明 TrustZone/CCA/CoVE 等机制的历史动机或明确排除边界。

执行规则：

- Agent 遇到论文链接时，先判断它属于哪条主线；无法映射到三条主线之一的论文默认不入库。
- 若只是侧信道/物理/故障/Rowhammer 攻击论文，默认不下载、不建目录、不做 citation expansion。
- 若只是普通网络防御论文，且没有 confidential computing / TEE / trusted I/O / device offload / attested endpoint 语境，默认不下载、不建目录。
- SoK/survey 引用扩展时，P0/P1 只给 in-scope 的机制、规范、系统、taxonomy 或代表性 baseline；侧信道类引用最多标为 `boundary only`，不作为当前 backlog。
- 正文只需要一段 threat-model boundary 说明当前不研究这些攻击面；不要新增独立 side-channel 章节。
- 现有 Bib 中的 attack 条目先保留，不批量删除；后续若用户明确转向攻击 SoK，再拆成独立 scope 和 bibliography。

## 1. 知识覆盖矩阵

| 知识点 / 小方向 | 状态 | 正文覆盖依据 | SoK / Survey 锚点 | 代表 reference / SOTA | 下一步 |
|---|---|---|---|---|---|
| 硬件辅助 TEE 总体设计空间 | 待补足 | 正文分散讨论 TrustZone/CCA/RISC-V primitives，但未以 TEE taxonomy 统领 | `schneider2022soktee`; `li2024sokteechoices`; `boubakri2025riscvtee`; `sok-tee` | `schneider2022soktee`; SOTA `li2024sokteechoices`; SOTA `boubakri2025riscvtee`; SOTA `sok-tee` | 在正文引入 launch、runtime isolation、trusted I/O、secure storage、attestation、TCB 的上位分类。 |
| Arm TrustZone TEE 与漏洞谱系 | 已覆盖 | `arm_trustzone_whitepaper`, `pinto2019trustzone`, `guan2017trustshadow`, `cerdeira2020trustzone` | `pinto2019trustzone`; `cerdeira2020trustzone` | `arm_trustzone_whitepaper`; SOTA `pinto2019trustzone`; SOTA `cerdeira2020trustzone` | 保持为 CCA 的历史背景；避免把 TrustZone threat model 与 CCA 混写。 |
| Arm CCA / RME / RMM 基础架构 | 已覆盖 | `li2022cca`, `arm_cca_spec`, `arm_rme_spec`, `arm_rmm_spec`, `linux_arm_cca_doc` | 无成熟专门 SoK；以规范和 OSDI 论文为准 | `li2022cca`; SOTA `arm_cca_spec`; SOTA `arm_rmm_spec` / `wu2024rmm` | 机制表补 RMI、RSI、RIPAS、PAS、granule lifecycle、GPT/GPC。 |
| Arm CCA 细粒度隔离与部署模型 | 待补足 | 正文提到 SHELTER/RContainer/virtCCA/NanoZone/LessTrust，但缺系统分类 | 无成熟 SoK；按系统论文追踪 | `zhang2023shelter`; SOTA `zhou2025rcontainer`; SOTA `liu2025nanozone` / `liu2025lesstrust`; SOTA `bertschi2025opencca`; SOTA `abdollahi2025caec` | 拆成 user-space、container、virtualization、intra-process、inter-CVM sharing、memory protection。 |
| Arm CCA I/O、DMA、accelerator、interrupt | 待补足 | 正文提到 SMMU、ACAI、Devlore、fabric，但接口细节不足 | `sok-tee` 仅作 accelerator TEE SoK | `acai2023`; SOTA `bertschi2026devlore`; SOTA `sok-tee` | 补 RME-DA/MEC、SMMU、device ownership、interrupt ownership、DMA/MMIO 可信路径。 |
| Attestation、boot、lifecycle | 已覆盖 | `eat_rfc`, `menetrey2022attestation`, `psa_certified`, `ling2021trustzoneatt`, `chen2024mraima`, `mao2025pdrima`, `seshadri2004swatt`, `defrawy2012smart`, `asokan2015seda` | `menetrey2022attestation` | `seshadri2004swatt`; SOTA `eat_rfc`; SOTA `mao2025pdrima` | 区分 generic attestation、Arm CCA evidence chain、RISC-V CoVE layered evidence。 |
| RISC-V 基础安全 primitives | 待补足 | 正文覆盖 privilege/PMP/ePMP/Smepmp/sIOPMP，但不够完整 | `boubakri2025riscvtee` 可辅助 | `riscv_privileged`; SOTA `riscv_iommu_2023`; SOTA `riscv_aia_2023`; SOTA `riscv_iopmp_2026`; SOTA `manoni2026cva6cfi` | 补 H-extension、IOMMU、AIA、IOPMP、Zicfilp/Zicfiss 与 confidential VM 的关系。 |
| RISC-V TEE lineage: Sanctum/Keystone/CURE/MI6/Penglai/SPEAR-V | 未提到 | 正文没有引用 `costan2016sanctum`, `lee2020keystone`, `bahmani2021cure`, `bourgeat2019mi6`, `feng2021penglai`, `schrammel2023spearv` | `boubakri2025riscvtee`; `schneider2022soktee`; `li2024sokteechoices` | `costan2016sanctum`; `lee2020keystone`; `weiser2019timberv`; `bahmani2021cure`; `bourgeat2019mi6`; SOTA `feng2021penglai`; SOTA `schrammel2023spearv`; SOTA `lee2022cerberus`; SOTA `ozga2025ace` | 必补，用于解释从 open hardware enclave、tagged-memory embedded enclave、scalable enclave、speculative-core enclave、formal memory sharing、embedded confidential computing 再到 CoVE confidential VM 的演进。 |
| RISC-V CoVE / AP-TEE confidential VM | 未提到 | 正文仍把 Arm CCA 主要对比到 PMP，层级不匹配 | `boubakri2025riscvtee`; CoVE 原论文和 AP-TEE spec | `sahita2023cove`; SOTA `riscv_ap_tee_2024` (v0.7 draft / not ratified); SOTA `boubakri2025riscvtee` | P0：补 TVM、TSM/TSM-driver、Supervisor Domains、COVH/COVG、memory donation/reclaim/share、CoVE attestation。 |
| RISC-V CoVE-IO / TEE-I/O | 未提到 | 正文没有 CoVE-IO/TDI/TDM/DSM/SPDM/TDISP/trusted MSI | `sok-tee` 可辅助 accelerator 背景；原始 spec 为主 | `feng2024siopmp`; SOTA `riscv_cove_io_2026` (v0.3.0 draft / not ratified); SOTA `riscv_iommu_2023` / `riscv_aia_2023` | P0：补 device identity、secure DMA/MMIO、interrupt、PCIe IDE、TDISP、SPDM。 |
| Memory encryption / integrity / replay protection | 待补足 | 正文提到 AMD SEV/SEV-SNP、CCA/CoVE 相关概念，但未分类 | `henson2014memory` | `henson2014memory`; SOTA `amd_sev_snp`; SOTA `riscv_ap_tee_2024` / `arm_cca_spec` | 区分 access control、encryption、integrity、replay protection；不要把 PMP/GPT 写成 memory encryption。 |
| 机密计算网络 / I/O / fabric 防御 | 待补足 | `cxl_spec`, `pcie_ide`, `acpi_spec`, `gouk2022directcxl`, `zhong2024cxltiers`, `wang2025odrp` 已覆盖部分 fabric；缺网络防御 taxonomy | `sok-tee` 可辅助 accelerator/device TEE；CoVE-IO 和 PCIe/CXL/RDMA specs 为主 | `riscv_cove_io_2026`; `feng2024siopmp`; `riscv_iommu_2023`; `riscv_iopmp_2026`; `riscv_aia_2023`; `pcie_ide`; `cxl_spec`; `wang2025odrp` | 补 NIC/DPU/SmartNIC、secure vNIC/vSwitch/offload、RDMA/CXL/PCIe data path、SPDM/TDISP/IDE、DMA/MMIO/MSI/IOMMU/IOPMP/AIA 的机密计算边界。 |
| ISA / 硬件设计防御: MTE、PTE/page table、CFI、capability/tagging | 待补足 | `armv-a`, `riscv_privileged` 已覆盖部分；正文尚未系统展开 PTE/page-table permission、debug/trace、capability/tagging | 无单一 SoK；以 architecture specs 和硬件实现论文为准 | `armv-a`; `riscv_privileged`; SOTA `manoni2026cva6cfi`; SOTA `kim2023rvcure`; SOTA `amar2023cheriot`; `henson2014memory` | 明确 MTE/PAC/BTI/GCS、PAN/PXN/UXN、PTE 权限、PMP/ePMP/Smepmp、Zicfiss/Zicfilp、CHERI/CHERIoT、RV-CURE、memory integrity/encryption 与 CCA/CoVE 的层级关系。 |
| Side-channel / physical leakage attacks | 当前不研究 / out-of-scope | Bib 中大量 attacks 条目，正文主线未引用 | 不作为当前 SoK 研究对象 | Bib attacks section; `schluter2025heracles` 仅适合 boundary/limitation | 不下载、不扩展、不写独立章节；只在 threat model / limitation 中说明 excluded attacks。 |

## 2. SoK / Survey 与 Reference 映射

| 锚点 | 本地 reference | 可参考内容 | 使用边界 |
|---|---|---|---|
| `schneider2022soktee` | `reference/trusted-execution-environments/sok/hardware-supported-trusted-execution-environments/` | 硬件 TEE design space；SoK 中涉及 SGX、SEV、TrustZone、Sanctum、Keystone 等可映射到本项目对应小方向 | 2022 时间截面，不覆盖 Arm CCA/CoVE-IO 最新规范。 |
| `li2024sokteechoices` | `reference/trusted-execution-environments/sok/understanding-design-choices-pitfalls-trusted-execution-environments/` | Server-side TEE runtime design choices、pitfalls、TRAF/lifecycle taxonomy；可支撑 CCA/CoVE/SEV/TDX/RISC-V enclave 横向比较 | 不替代每个平台原始论文/spec；x86/IBM 平台仅作对比，当前正文不展开。 |
| `pinto2019trustzone` | `reference/trusted-execution-environments/demystifying-arm-trustzone-comprehensive-survey/` | TrustZone 背景、系统软件、应用模式；本地 PDF 可用 | 只作为 TrustZone survey，不代表 CCA threat model。 |
| `cerdeira2020trustzone` | `reference/trusted-execution-environments/sok/understanding-prevailing-security-vulnerabilities-trustzone-tee/` | TrustZone-assisted TEE 漏洞 taxonomy、接口/TCB 风险；本地 PDF 可用 | 用于解释 CCA 动机和 TrustZone 局限，不直接证明 CCA 安全性。 |
| `menetrey2022attestation` | `reference/attestation/exploratory-study-attestation-mechanisms-for-tees/` | TEE attestation 机制、证据和 verifier 视角 | Generic attestation survey；Arm CCA/CoVE 证据链仍需回到规范。 |
| `boubakri2025riscvtee` | `reference/risc-v-confidential-computing/a-survey-of-risc-v-secure-enclaves-and-trusted-execution-environments/` | RISC-V secure enclaves / TEE 谱系；可连接 Sanctum、Keystone、CURE、MI6、Penglai、SPEAR-V、CoVE、ACE | MDPI HTML/PDF 已核验但自动 PDF 下载受 403 阻挡；机制 claims 应回引原论文/spec。 |
| `sok-tee` | `reference/accelerator-tees/sok/analysis-accelerator-tee-designs/` | Accelerator TEE taxonomy；可支撑 ACAI、Devlore、CoVE-IO、TDISP/IDE 讨论 | 只用于 accelerator/device TEE，不作为通用 CCA/CoVE SoK。 |
| `henson2014memory` | `reference/memory-and-io-fabrics/sok/memory-encryption-survey-existing-techniques/` | Memory encryption taxonomy；本地 PDF 已下载并解析 | 不是 TEE SoK；用于区分 encryption/integrity/replay 与 access-control。 |

## 3. 小方向三篇精选与五维介绍

每个小方向固定三篇：第一篇为基础/起点，后两篇优先为 SOTA。若材料是规范、RFC 或 survey，则在“实验结果”中标为无新实验，并说明证据类型。

### 3.1 硬件辅助 TEE taxonomy

1. `schneider2022soktee` — 基础入口；SoK/survey anchor；arXiv 2022。
   - 内容摘要：系统化整理硬件辅助 TEE 的 launch、runtime isolation、trusted I/O、secure storage、attestation 和 TCB 维度。
   - 研究背景：SGX、SEV、TrustZone、Sanctum、Keystone 等平台名称相似但威胁模型、硬件假设和部署场景差异大。
   - 解决方案：用机制级 taxonomy 替代产品级罗列，把不同 TEE 统一映射到可比较的安全属性。
   - 实验结果：Survey/SoK，无新实验；证据来自公开论文和规范比较。
   - 文章评价：适合做本项目顶层分类；不足是 2022 之后 CCA、CoVE/AP-TEE、CoVE-IO、accelerator TEE 需额外补。
2. `SOTA: boubakri2025riscvtee` — SoK/survey anchor；Electronics 2025；PDF 403，HTML 核验。
   - 内容摘要：梳理 RISC-V secure enclave 与 TEE 研究谱系。
   - 研究背景：RISC-V TEE 从 PMP monitor 到 confidential VM 的发展分散在论文、草案和原型中。
   - 解决方案：按 RISC-V TEE 设计点组织 Keystone、Penglai、SPEAR-V、CoVE 等工作。
   - 实验结果：Survey，无新实验。
   - 文章评价：适合补 RISC-V taxonomy；机制细节必须回到原始论文和 AP-TEE/CoVE-IO spec。
3. `SOTA: sok-tee` — SoK/survey anchor；NDSS 2026。
   - 内容摘要：系统化分析 accelerator TEE 设计。
   - 研究背景：Confidential workload 依赖 GPU/NPU/DPU/SmartNIC 后，CPU TEE 边界无法单独覆盖数据路径。
   - 解决方案：把 accelerator TEE 拆成设备身份、内存/总线保护、runtime TCB、调度、attestation 等维度。
   - 实验结果：Survey/SoK，无新实验。
   - 文章评价：非常适合 I/O/accelerator 小方向；不能替代通用 TEE SoK。

### 3.2 Arm TrustZone TEE 与漏洞谱系

1. `arm_trustzone_whitepaper` — 基础入口；Arm whitepaper。
   - 内容摘要：介绍 Secure/Non-secure world、NS bit 和 SoC 级隔离的基本模型。
   - 研究背景：移动和嵌入式平台需要把安全服务从普通 OS 中隔离出来。
   - 解决方案：在处理器、互连和外设路径传播安全状态，形成双世界系统。
   - 实验结果：白皮书，无实验。
   - 文章评价：历史基础价值高；不应当作 CCA 或 confidential VM 的 threat model 证据。
2. `SOTA: pinto2019trustzone` — Survey；ACM CSUR 2019。
   - 内容摘要：全面梳理 TrustZone 架构、TEE 软件栈、应用和虚拟化相关工作。
   - 研究背景：TrustZone 长期被广泛部署，但公开系统化资料不足。
   - 解决方案：按系统软件、TEE、虚拟化和应用场景分类。
   - 实验结果：Survey，无新实验。
   - 文章评价：适合写 TrustZone 背景；对 CCA/RME 不完整。
3. `SOTA: cerdeira2020trustzone` — SoK；IEEE S&P 2020。
   - 内容摘要：归纳 TrustZone-assisted TEE 的主流漏洞类型和根因。
   - 研究背景：TrustZone TEE 暴露接口复杂、TCB 变大，真实系统反复出现漏洞。
   - 解决方案：按漏洞面、接口、权限边界和实现缺陷建立 taxonomy。
   - 实验结果：SoK/漏洞分析，无新系统实验。
   - 文章评价：能有力支撑“为什么需要更强 CCA threat model”；不能替代 CCA 机制分析。

### 3.3 Arm CCA / RME / RMM 基础架构

1. `li2022cca` — 基础入口；OSDI 2022。
   - 内容摘要：提出并验证 Arm CCA 的核心设计，包括 Realm、RME、RMM、GPT/GPC 与 lifecycle。
   - 研究背景：云场景下 host 仍需管理资源，但不应看到 tenant workload 数据。
   - 解决方案：把资源管理和数据可见性分离，用硬件 granule ownership 和 RMM lifecycle 管理 Realm。
   - 实验结果：OSDI 系统论文提供设计验证和原型评估；正文引用时应以原论文数据为准。
   - 文章评价：Arm CCA 主线第一篇；商业落地潜力强，因为机制进入 Arm 架构和 Linux 文档。
2. `SOTA: arm_cca_spec` — Spec/industry SOTA；Arm spec 2025。
   - 内容摘要：给出 CCA 架构接口、Realm、memory ownership 和 attestation 语义。
   - 研究背景：研究论文需要落到稳定的硬件/固件 ABI 和平台行为。
   - 解决方案：规范化 CCA/RME 相关对象、状态、接口和安全语义。
   - 实验结果：规范，无实验。
   - 文章评价：正文写机制时最权威；但不是性能或实现可用性的证据。
3. `SOTA: arm_rmm_spec` / `wu2024rmm` — Spec + verification SOTA；Arm spec 2025 / arXiv 2024。
   - 内容摘要：RMM spec 定义 Realm 管理软件接口；ESBMC work 验证 RMM 组件。
   - 研究背景：RMM 位于 CCA TCB 核心，状态机或内存管理错误会破坏 Realm 安全。
   - 解决方案：规范提供接口契约，验证工作用 model checking 检查关键组件属性。
   - 实验结果：Spec 无实验；验证论文覆盖范围有限，不能泛化到完整 RMM。
   - 文章评价：适合讨论 CCA 正确性和 TCB 风险；商业落地依赖完整实现、验证覆盖和硬件支持。

### 3.4 Arm CCA 细粒度隔离与部署模型

1. `zhang2023shelter` — 基础入口；USENIX Security 2023。
   - 内容摘要：用 Arm CCA 支持用户态隔离。
   - 研究背景：Realm 机制不必只服务 VM，进程内/用户态敏感代码也需要低 TCB 隔离。
   - 解决方案：把 CCA primitives 封装成可供 user-space compartment 使用的隔离模型。
   - 实验结果：USENIX Security 论文提供原型与开销评估；具体数值回引原文。
   - 文章评价：开辟 CCA 细粒度使用方式；落地取决于 CCA 硬件普及和 OS/runtime 集成。
2. `SOTA: zhou2025rcontainer` — Academic SOTA；NDSS 2025。
   - 内容摘要：把 Arm CCA 扩展到安全容器架构。
   - 研究背景：容器比 VM 更轻，但内核共享导致隔离边界弱。
   - 解决方案：用 CCA 硬件 primitives 为容器建立更强的机密性边界。
   - 实验结果：NDSS 系统论文提供原型评估；具体结果需以论文数据为准。
   - 文章评价：贴近云原生落地；挑战是容器生态、编排系统和 CCA lifecycle 的耦合。
3. `SOTA: liu2025nanozone` / `liu2025lesstrust` — Academic SOTA；arXiv 2025 / IEEE TIFS 2025。
   - 内容摘要：研究 Arm CCA 上更可扩展、更细粒度的内存和进程内隔离。
   - 研究背景：只用 Realm/VM 粒度会造成管理成本和隔离粒度之间的矛盾。
   - 解决方案：探索 CCA granule/lifecycle 能否支撑更小保护域和更少管理者信任。
   - 实验结果：NanoZone 为 arXiv 论文；LessTrust 为 TIFS 论文，具体评估需回到原文。
   - 文章评价：方向前沿；商业潜力取决于硬件成本、kernel/runtime 改造和开发者可用性。

### 3.5 Arm CCA I/O、DMA、accelerator、interrupt

1. `acai2023` — 基础入口；arXiv 2023。
   - 内容摘要：研究如何用 Arm CCA 保护 accelerator execution。
   - 研究背景：Confidential workloads 需要使用加速器，CPU Realm 不能默认保护 offload 路径。
   - 解决方案：围绕 CCA-aware accelerator execution path 设计保护机制。
   - 实验结果：arXiv 系统论文提供原型结果；具体数值需回引原文。
   - 文章评价：是 Arm CCA accelerator 方向的重要入口；成熟度受制于设备支持和驱动 TCB。
2. `SOTA: bertschi2026devlore` — Academic SOTA；arXiv 2024 / year-tag 2026。
   - 内容摘要：关注 confidential VM 的 device interrupt protection。
   - 研究背景：即便 DMA 受控，设备 interrupt 也可能暴露或破坏 confidential VM 的状态与所有权。
   - 解决方案：把 interrupt delivery、device ownership 与 confidential boundary 绑定。
   - 实验结果：arXiv 论文，本地 PDF 可用；具体数据需回引原文。
   - 文章评价：很好地说明 interrupt 不是外围问题；落地需硬件、firmware、OS 和 hypervisor 协同。
3. `SOTA: sok-tee` — SoK/survey anchor；NDSS 2026。
   - 内容摘要：为 accelerator TEE 提供设计空间。
   - 研究背景：GPU/NPU/DPU/SmartNIC 的 TEE 机制比 CPU TEE 更分散。
   - 解决方案：分类设备身份、内存路径、队列、runtime、driver TCB、attestation。
   - 实验结果：Survey/SoK，无新实验。
   - 文章评价：可作为本方向的 SoK；必须与 ACAI/Devlore/Arm SMMU/RME-DA 等一手材料配合。

### 3.6 Attestation、boot、lifecycle

1. `seshadri2004swatt` — 基础入口；IEEE S&P 2004。
   - 内容摘要：提出软件 attestation 的早期代表方法。
   - 研究背景：低端嵌入式设备缺少硬件 root of trust，但仍需要远程确认代码完整性。
   - 解决方案：用 timing-sensitive checksum 让远程 verifier 检查设备内存内容。
   - 实验结果：论文在嵌入式节点场景评估；安全性强依赖时间和硬件假设。
   - 文章评价：历史价值高；现代高威胁模型下适用性有限。
2. `SOTA: eat_rfc` — Spec/industry SOTA；RFC 9711, 2025。
   - 内容摘要：定义 Entity Attestation Token 的 claims/token 表达。
   - 研究背景：多平台 attestation 需要可互操作的证据编码。
   - 解决方案：用 CWT/JWT 承载实体状态和安全属性 claims。
   - 实验结果：RFC，无实验。
   - 文章评价：标准化落地潜力强；不能说明某平台测量链是否充分。
3. `SOTA: mao2025pdrima` — Academic SOTA；arXiv 2025。
   - 内容摘要：研究 TrustZone-based TEE 的 policy-driven runtime integrity measurement attestation。
   - 研究背景：secure boot/launch attestation 不能覆盖运行时状态变化。
   - 解决方案：把策略驱动的 runtime measurement 融入 attestation。
   - 实验结果：arXiv 论文，本地 PDF 可用；具体结果需回引原文。
   - 文章评价：适合补 runtime attestation；不要把它泛化为 CCA/CoVE 的完整 evidence chain。

### 3.7 RISC-V 基础安全 primitives

1. `riscv_privileged` — 基础入口；RISC-V privileged spec。
   - 内容摘要：定义 RISC-V privilege modes、PMP、virtualization 和相关保护基础。
   - 研究背景：RISC-V 安全系统需要从标准 privilege/translation/memory-control 机制出发。
   - 解决方案：通过 M/S/U/HS/VS modes、PMP/ePMP/Smepmp、trap/translation 机制组合隔离。
   - 实验结果：规范，无实验。
   - 文章评价：所有 RISC-V TEE 讨论的底座；不是 confidential VM 的完整方案。
2. `SOTA: riscv_iommu_2023` / `riscv_iopmp_2026` — Supporting specs；IOMMU v1.0.0 ratified，IOPMP v0.8.2 draft。
   - 内容摘要：定义 RISC-V I/O translation/protection 架构。
   - 研究背景：DMA/总线 master 可绕过 CPU-side PMP/页表，TEE 需要 I/O 侧隔离。
   - 解决方案：IOMMU 约束设备地址转换和访问权限；IOPMP 通过 requester/memory-domain/entry matching 过滤 I/O transaction。
   - 实验结果：规范，无实验。
   - 文章评价：是 CoVE-IO 讨论的基础材料；IOPMP 仍是 draft，不是单独的 TEE 设计。
3. `SOTA: riscv_aia_2023` / `manoni2026cva6cfi` — Supporting interrupt/CFI materials；AIA v1.0，CVA6-CFI arXiv 2026。
   - 内容摘要：AIA 定义 interrupt/MSI/virtual interrupt 基础；CVA6-CFI 实现并评估 Zicfiss/Zicfilp。
   - 研究背景：confidential I/O 需要可信 interrupt delivery；runtime memory-safety/CFI 需要独立于 CCA/CoVE 的控制流防护。
   - 解决方案：AIA 规范化 interrupt controller 与 MSI；CVA6-CFI 用 shadow stack 和 landing pad 单元实现 backward/forward-edge CFI。
   - 实验结果：AIA 为规范无实验；CVA6-CFI 报告约 1.0% area overhead、MiBench automotive 子集最高 15.6% performance overhead。
   - 文章评价：AIA 支撑 trusted MSI/interrupt ownership；CVA6-CFI 说明 RISC-V CFI 的硬件成本，但不等同于 TEE 隔离。

### 3.8 RISC-V TEE lineage: Sanctum / TIMBER-V / Keystone / Penglai / SPEAR-V

1. `lee2020keystone` — 基础入口；arXiv 2019。
   - 内容摘要：开源 RISC-V TEE 框架。
   - 研究背景：商业 TEE 难定制、难验证，RISC-V 提供开放硬件/软件协同机会。
   - 解决方案：用 PMP、security monitor 和 runtime abstraction 构建 enclave。
   - 实验结果：论文报告 CoreMark/Beebs/RV8 开销低，IOZone 可明显更高；具体数值以原文为准。
   - 文章评价：RISC-V TEE baseline；适合解释 PMP-based enclave 的优缺点。
2. `SOTA: feng2021penglai` — Academic SOTA；OSDI 2021。
   - 内容摘要：面向大规模 enclave 的 scalable memory protection。
   - 研究背景：serverless/microservice 场景需要大量动态 enclave，传统 PMP region 数量有限。
   - 解决方案：引入更可扩展的内存保护和 metadata 管理机制。
   - 实验结果：OSDI 论文报告可支持大量 enclave 和较大安全内存；具体指标以原文为准。
   - 文章评价：系统贡献强；商业落地门槛在硬件修改和标准化。
3. `SOTA: schrammel2023spearv` — Academic SOTA；ACM AsiaCCS 2023。
   - 内容摘要：提出低开销、实用的 RISC-V enclave primitive。
   - 研究背景：需要灵活、低开销、可抵抗部分 controlled-channel 风险的 enclave 机制。
   - 解决方案：用 tag/metadata primitive 支持双向 sandbox 和嵌套隔离。
   - 实验结果：论文报告 protected/unprotected 场景低开销；具体数值以原文为准。
   - 文章评价：机制设计漂亮；尚非 RISC-V 标准，落地取决于硬件采纳。

### 3.9 RISC-V CoVE / AP-TEE confidential VM

1. `sahita2023cove` — 基础入口；arXiv 2023。
   - 内容摘要：提出 RISC-V CoVE confidential computing 参考架构方向。
   - 研究背景：多租户 confidential VM 需要降低 tenant 对 host/hypervisor 的信任。
   - 解决方案：描述 confidential VM 所需的 ISA、non-ISA、SoC 和 platform requirements。
   - 实验结果：架构论文/position-style，无完整系统实验。
   - 文章评价：是 CoVE 入口；不能替代 AP-TEE draft spec 的 ABI/state details。
2. `SOTA: riscv_ap_tee_2024` — Spec/industry SOTA；v0.7 draft / not ratified。
   - 内容摘要：定义 RISC-V AP-TEE/CoVE TVM lifecycle 和 SBI ABI。
   - 研究背景：CoVE 需要标准化 TVM、TSM、memory lifecycle、attestation 和 host/guest 调用界面。
   - 解决方案：给出 TSM、TSM-driver、Supervisor Domains、COVH/COVG、memory donation/reclaim/share 等规范语义。
   - 实验结果：规范草案，无实验。
   - 文章评价：当前最重要的 RISC-V CCA 对照材料；必须标注 draft / not ratified。
3. `SOTA: boubakri2025riscvtee` — Survey anchor；Electronics 2025。
   - 内容摘要：把 pre-CoVE enclave 与 CoVE 放入 RISC-V TEE 谱系。
   - 研究背景：RISC-V TEE 论文和规范发展快，survey 可减少分类断裂。
   - 解决方案：按 secure enclave / TEE mechanism 分类和对比。
   - 实验结果：Survey，无新实验。
   - 文章评价：适合辅助写作；mechanism claims 应回引 CoVE paper 和 AP-TEE spec。

### 3.10 RISC-V CoVE-IO / TEE-I/O

1. `feng2024siopmp` — 基础入口；ASPLOS 2024。
   - 内容摘要：提出面向 TEE 的 scalable I/O protection。
   - 研究背景：DMA 设备可绕过 CPU memory isolation，I/O 保护是 TEE 的关键缺口。
   - 解决方案：设计 scalable I/O protection metadata/checking 机制以提高设备访问控制效率。
   - 实验结果：ASPLOS 论文给出吞吐和开销评估；具体数值以原文为准。
   - 文章评价：RISC-V I/O protection 的关键学术 SOTA；但只解决 access control，不是完整 CoVE-IO。
2. `SOTA: riscv_cove_io_2026` — Spec/industry SOTA；v0.3.0 draft / not ratified。
   - 内容摘要：定义 RISC-V CoVE-IO confidential I/O 架构。
   - 研究背景：TVM 使用真实设备需要覆盖设备身份、DMA、MMIO、interrupt 和 link security。
   - 解决方案：引入 TDI/TDM/DSM、SPDM、TDISP、PCIe IDE、trusted MSI 等机制组合。
   - 实验结果：规范草案，无实验。
   - 文章评价：当前最重要的 RISC-V confidential I/O 规范；必须标注 draft。
3. `SOTA: riscv_iommu_2023` / `riscv_aia_2023` — Supporting specs；v1.0.0 / v1.0 release。
   - 内容摘要：IOMMU 和 AIA 分别支撑设备 DMA translation/protection 与 interrupt delivery。
   - 研究背景：CoVE-IO 不能只靠 PMP 或 CPU page table，必须处理设备侧地址转换和中断路径。
   - 解决方案：IOMMU 控制设备可访问地址空间，AIA 提供中断架构基础。
   - 实验结果：规范，无实验。
   - 文章评价：适合作为机制表支撑；不是单独的 confidential I/O 方案。

### 3.11 Memory encryption / integrity / replay protection

1. `henson2014memory` — 基础入口；ACM CSUR 2014。
   - 内容摘要：综述内存加密既有技术。
   - 研究背景：离芯片内存和物理攻击会暴露数据，单纯访问控制不等于加密。
   - 解决方案：分类 memory encryption、integrity、counter/replay protection 等技术路线。
   - 实验结果：Survey，无新实验。
   - 文章评价：最适合帮助本项目避免概念混淆；时间较早，需要结合 SEV-SNP/CCA/CoVE 更新。
2. `SOTA: amd_sev_snp` — Spec/industry SOTA；AMD whitepaper/spec。
   - 内容摘要：SEV-SNP 在 VM memory encryption 基础上加强完整性与 host 隔离。
   - 研究背景：早期 encrypted VM 面临 nested page table 和 host-controlled metadata 风险。
   - 解决方案：引入 secure nested paging 和完整性相关保护。
   - 实验结果：厂商技术材料，无独立实验。
   - 文章评价：有商业落地；应与攻击论文如 `schluter2025heracles` 一起讨论限制。
3. `SOTA: arm_cca_spec` / `riscv_ap_tee_2024` — Spec/industry SOTA；Arm spec / RISC-V draft。
   - 内容摘要：通过 ownership/access-control 与 lifecycle 保护 confidential workload memory。
   - 研究背景：CCA/CoVE 需要让 host 管理资源但不能读取 protected memory。
   - 解决方案：Arm 用 GPT/GPC 和 Realm lifecycle；RISC-V AP-TEE 用 TVM/TSM 和 memory donation/reclaim/share 等语义。
   - 实验结果：规范，无实验。
   - 文章评价：它们主要定义 access-control/lifecycle，不应被误写成 memory encryption survey 的替代品。

### 3.12 Memory / I/O fabrics: CXL、PCIe IDE、RDMA

1. `gouk2022directcxl` — 基础入口；USENIX ATC 2022。
   - 内容摘要：研究 DirectCXL memory disaggregation。
   - 研究背景：CXL 让内存位置和访问路径脱离本地 DRAM 假设。
   - 解决方案：实现对 CXL-attached memory 的高性能直接访问。
   - 实验结果：ATC 论文提供系统评估；具体指标以原文为准。
   - 文章评价：用于说明 fabric 改变 confidential boundary 的数据路径；不是 TEE 论文。
2. `SOTA: zhong2024cxltiers` — Academic SOTA；OSDI 2024。
   - 内容摘要：研究虚拟化环境中的 CXL memory tiers 管理。
   - 研究背景：云平台需要在本地/远端/分层内存间调度资源。
   - 解决方案：面向 virtualized environment 设计 memory tier 管理系统。
   - 实验结果：OSDI 论文提供云/系统评估；具体指标以原文为准。
   - 文章评价：适合支撑“host 管理资源但不应破坏 confidential boundary”的讨论。
3. `SOTA: wang2025odrp` — Academic SOTA；NSDI 2025。
   - 内容摘要：用 programmable RDMA 支持 on-demand remote paging。
   - 研究背景：远程内存和 RDMA 让数据离开 CPU/本地内存路径。
   - 解决方案：把 remote paging 与 programmable RDMA 数据路径结合。
   - 实验结果：NSDI 论文提供系统评估；具体指标以原文为准。
   - 文章评价：可说明 confidential computing 不能只看 CPU 内部隔离；不是直接防御论文。

## 4. 引用核验与清理规则

| 对象 | 核验结果 | 处理 |
|---|---|---|
| 正文 39 个 cite key | 全部存在于 `survey/reference.bib`。 | 无缺失 key。 |
| RISC-V AP-TEE / CoVE-IO | GitHub release 已核验并已下载本地 PDF；AP-TEE v0.7 是 draft/RC2 for ARC review，CoVE-IO v0.3.0 是 draft。 | 可以列为 spec/industry SOTA，但正文必须标注 draft / not ratified。 |
| `riscv_iommu_2023` / `riscv_aia_2023` | v1.0.0 / v1.0 release 来源核验并已下载本地 PDF。 | 作为 supporting spec；不要写成 TEE 系统论文。 |
| `sok-tee` | NDSS 2026 accelerator TEE SoK，本地 PDF 已下载。 | 仅用于 accelerator/device TEE taxonomy；不替代通用 TEE SoK。 |
| `boubakri2025riscvtee` | MDPI HTML 核验；PDF 自动下载 403。 | 作为 survey anchor；机制论断回引原始论文/spec。 |
| `li2024sokteechoices` | ASIA CCS 2024 SoK，作者主页 PDF 已下载。 | 作为通用 server-side TEE design-choice/pitfall SoK；正文机制仍回引原始论文/spec。 |
| `costan2016sanctum`, `bahmani2021cure`, `bourgeat2019mi6`, `ozga2025ace` | SoK/RISC-V survey 引用扩展材料，PDF 均已下载。 | 用于补 RISC-V TEE lineage；避免和 CoVE/AP-TEE confidential VM 标准混写。 |
| `weiser2019timberv`, `lee2022cerberus` | RISC-V survey/SoK 引用扩展材料，PDF 均已下载。 | TIMBER-V 用于 embedded/tagged-memory enclave 谱系；Cerberus 用于 formal enclave memory-sharing 与 shared-memory 设计比较。 |
| `riscv_iopmp_2026` | GitHub release v0.8.2 PDF 已下载；状态为 draft / in development。 | 支撑 IOPMP 和 CoVE-IO/sIOPMP 讨论；正文必须标注 not ratified。 |
| `manoni2026cva6cfi`, `kim2023rvcure`, `amar2023cheriot` | arXiv / MICRO 论文 PDF 已下载。 | 用于 runtime CFI / memory-safety hardening；不要和 CCA/CoVE 的 confidential-computing boundary 混写。 |
| `henson2014memory` | ACM CSUR 论文镜像 PDF 已下载，canonical DOI 已记录。 | 用于 memory encryption taxonomy；不要把 PMP/GPT/IOPMP 写成 encryption。 |
| `bertschi2025opencca`, `abdollahi2025caec` | Arm CCA SOTA 扩展材料，arXiv PDF 已下载。 | 用于 CCA research infrastructure 与 inter-CVM sharing；不是 Arm 官方规范。 |
| `xu2026virtcca`, `bertschi2026devlore` | arXiv 首发早于 Bib 年份；年份可能对应目标发表或最新引用习惯。 | 在 domain/SOTA 中标注 arXiv 状态，避免误导。 |
| Attacks / side-channel Bib 条目 | 大量条目与当前 defense/confidential-computing 主线弱相关，且正文未引用。 | 不批量删除；当前不下载、不扩展、不写 attack survey，只作为 threat boundary / limitation。 |
| `schluter2025heracles` | SEV-SNP 攻击论文，不是防御主线。 | 只在 threat model/limitations 中使用。 |

## 5. ACM / IEEE 两种 Survey 写法

| 风格 | 适用目标 | 写法要求 | 本项目落点 |
|---|---|---|---|
| ACM-style survey / CSUR 风格 | 强 taxonomy、系统化分类、批判性比较 | 先给 design space 和 classification criteria；每类有 representative systems；重视 threat model、limitations、evidence strength；表格多、结论克制。 | `domain.md` 的覆盖矩阵、SoK/reference 映射、三篇精选材料和引用清理表。 |
| IEEE-style survey / magazine/tutorial 风格 | 标准、架构演进、工程落地、跨平台教程 | 按技术路线叙述：Arm -> RISC-V -> device/fabric -> attestation；强调标准状态、产业生态和部署路径。 | `survey/*.tex` 正文更适合采用 IEEE-style 叙述，同时保留机制表。 |

建议实现方式：

- `domain.md` 保留 ACM-style taxonomy 和 evidence matrix。
- LaTeX 正文使用 IEEE-style architecture narrative，并在每节内部放机制对照表。
- 所有 draft/spec SOTA 必须显式写状态，尤其是 `riscv_ap_tee_2024` 和 `riscv_cove_io_2026`。

## 6. 后续正文补足优先级

| 优先级 | 任务 | 主要引用 |
|---|---|---|
| P0 | 在正文开头固定三条 survey 主线：Arm/RISC-V 机密计算防御、机密计算网络/I/O/data-path 防御、ISA/硬件设计防御。 | `schneider2022soktee`, `li2024sokteechoices`, `arm_cca_spec`, `riscv_ap_tee_2024`, `riscv_cove_io_2026`, `armv-a`, `riscv_privileged` |
| P0 | 新增 RISC-V CoVE/AP-TEE confidential VM 小节，纠正 Arm CCA 对比到 PMP 的层级不匹配。 | `sahita2023cove`, `riscv_ap_tee_2024`, `boubakri2025riscvtee` |
| P0 | 新增 RISC-V CoVE-IO / TEE-I/O 小节。 | `riscv_cove_io_2026`, `feng2024siopmp`, `riscv_iommu_2023`, `riscv_aia_2023`, `riscv_iopmp_2026`, `sok-tee` |
| P1 | 补机密计算网络 / I/O / fabric 防御 taxonomy。 | `riscv_cove_io_2026`, `pcie_ide`, `cxl_spec`, `wang2025odrp`, `gouk2022directcxl`, `zhong2024cxltiers`, `sok-tee` |
| P1 | 补 RISC-V TEE lineage。 | `costan2016sanctum`, `lee2020keystone`, `weiser2019timberv`, `bahmani2021cure`, `bourgeat2019mi6`, `feng2021penglai`, `schrammel2023spearv`, `lee2022cerberus`, `ozga2025ace` |
| P1 | 补 Arm CCA 机制表。 | `arm_cca_spec`, `arm_rme_spec`, `arm_rmm_spec`, `linux_arm_cca_doc` |
| P1 | 补 Arm CCA 研究平台和 inter-CVM sharing。 | `bertschi2025opencca`, `abdollahi2025caec` |
| P1 | 补 memory protection taxonomy。 | `henson2014memory`, `amd_sev_snp`, `arm_cca_spec`, `riscv_ap_tee_2024` |
| P1 | 补 ISA / 硬件设计防御 taxonomy，覆盖 MTE、PTE/page-table permission、PAC、BTI、GCS、PMP/ePMP、Zicfiss/Zicfilp、CHERI/CHERIoT、RV-CURE。 | `armv-a`, `riscv_privileged`, `manoni2026cva6cfi`, `kim2023rvcure`, `amar2023cheriot` |
| Scope-only | 写一段 side-channel / physical leakage out-of-scope statement，说明 attacks Bib 暂不进入当前 defense/specification 主线。 | Bib attacks section; `schluter2025heracles` |

## 7. 联网核验来源

- RISC-V AP-TEE / CoVE: https://github.com/riscv-non-isa/riscv-ap-tee and https://github.com/riscv-non-isa/riscv-ap-tee/releases/tag/v0.7
- RISC-V CoVE-IO: https://github.com/riscv-non-isa/riscv-ap-tee-io and https://github.com/riscv-non-isa/riscv-ap-tee-io/releases/tag/v0.3.0
- RISC-V IOMMU / AIA: https://github.com/riscv-non-isa/riscv-iommu/releases/tag/v1.0.0 and https://github.com/riscv/riscv-aia/releases/tag/1.0
- RISC-V IOPMP: https://github.com/riscv-non-isa/riscv-iopmp/releases/tag/v0.8.2
- RISC-V CFI / memory safety: https://arxiv.org/abs/2602.04991, https://arxiv.org/abs/2308.02945, and https://cheriot.org/ibex/flute/architecture/publication/2023/10/30/cheriot-at-micro.html
- RISC-V lineage additions: https://www.ndss-symposium.org/ndss-paper/timber-v-tag-isolated-memory-bringing-fine-grained-enclaves-to-risc-v/ and https://people.eecs.berkeley.edu/~sseshia/pubs/b2hd-leecheang-ccs22.html
- Memory encryption taxonomy: https://doi.org/10.1145/2566673
- Accelerator TEE SoK: https://www.ndss-symposium.org/wp-content/uploads/2026-f1424-paper.pdf
- RISC-V TEE survey: https://www.mdpi.com/2079-9292/14/21/4171
- TEE design-choice SoK: https://doi.org/10.1145/3634737.3644993 and https://people.csail.mit.edu/mengyuanli/files/asiaccs_sok.pdf
- RISC-V SoK citation expansion: https://www.usenix.org/conference/usenixsecurity16/technical-sessions/presentation/costan, https://arxiv.org/abs/2010.15866, https://arxiv.org/abs/1812.09822, https://arxiv.org/abs/2505.12995
- Arm CCA SOTA expansion: https://arxiv.org/abs/2506.05129 and https://arxiv.org/abs/2512.01594
- Arm CCA / RME / RMM / SMMU / Linux CCA docs: https://developer.arm.com/documentation/den0125/latest, https://developer.arm.com/documentation/den0126/latest, https://developer.arm.com/documentation/den0137/latest, https://developer.arm.com/documentation/ihi0070/latest, https://docs.kernel.org/arch/arm64/arm-cca.html
