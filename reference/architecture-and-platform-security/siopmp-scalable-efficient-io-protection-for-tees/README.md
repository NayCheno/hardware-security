# sIOPMP: Scalable and Efficient I/O Protection for TEEs

- BibTeX key: `feng2024siopmp`
- Category: `architecture-and-platform-security`
- Authors: Erhu Feng et al.
- Year: 2024
- Source: https://doi.org/10.1145/3620665.3640378
- PDF source: https://ipads.se.sjtu.edu.cn/_media/publications/feng-asplos24.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified

- Evidence role: Peer-reviewed SOTA. Use for the specific mechanism, evaluation, and threat-model scope established by the source; avoid broader claims outside its evidence class.

<!-- BEGIN PAPER REVIEW -->
## Paper Review
### 1. 论文基本信息

- 论文标题: sIOPMP: Scalable and Efficient I/O Protection for TEEs
- 作者 / 机构: Erhu Feng et al.; Shanghai Jiao Tong University / Alibaba DAMO Academy
- 发表会议 / 年份: ASPLOS 2024
- 领域分类: 架构 / 系统 / 安全
- 一句话总结: sIOPMP 面向 TEE 的 DMA/I/O 隔离，解决传统 IOMMU 或软件 I/O 在 TEE 场景下的性能和可扩展性问题。
- 最核心贡献一句话: 它是 RISC-V/TEE I/O 隔离方向的关键 Peer-reviewed SOTA 论文，应作为 CoVE-IO 之前的论文锚点。

### 2. 研究问题与背景

TEE 通常重视 CPU/内存隔离，但 DMA-capable device 可绕过 CPU 访问受保护内存。传统 IOMMU 或软件 I/O 在 I/O intensive workload 下会引入明显吞吐下降。论文第 1 页摘要明确指出现有方法至少 20% throughput degradation 的问题。

### 3. 核心方法拆解

架构为: device DMA request -> multi-stage-tree checker -> hot/cold device classification -> mountable entries/remapping -> protected memory access decision。设计妙处是把 I/O 隔离需求从 CPU page-table 模型中分离出来，用区域/设备状态匹配 TEE workloads。

### 4. 安全性 / 正确性分析

安全目标是阻止恶意 DMA 请求越权访问 TEE 内存。论文假设 sIOPMP 硬件检查器和 trusted configuration 正确。它不单独解决设备身份、链路加密、TDISP/SPDM 设备可信状态，也不覆盖所有微架构侧信道。

### 5. 实现细节

实现包含 multi-stage-tree checker、hot/cold device remapping 机制和原型评估。PDF 第 13 页讨论了 1000 IOPMP entries、64 hot devices 的实现配置，并说明参数可随机器演进调整。

### 6. 实验设计分析

论文评估 microbenchmarks 和 real-world workloads。摘要报告 sIOPMP 带来 negligible overhead，并相对 IOMMU-based/software I/O 的 TEE 机制提升 20%--38% network throughput。实验支撑其 I/O 性能主张。

### 7. Novelty 分析

分类: potentially top-tier contribution。它把 TEE I/O 隔离提升为一等问题，提出硬件机制并给出系统评估。

### 8. 局限性与可能漏洞

sIOPMP 主要解决 DMA access-control，不等同于 confidential I/O 全栈。CoVE-IO 还需要 TDI/TDM/DSM、SPDM、TDISP、PCIe IDE、trusted MSI 和 attestation 结合。

### 9. 和已有工作的关系

它连接 RISC-V IOPMP/PMP 传统和 CoVE-IO 未来路线，也可与 Arm SMMU/RME-DA、PCIe IDE、CXL security 对照。

### 10. 复现与再实现计划

最小复现目标是模拟 DMA checker 和 hot/cold device remapping，跑 network throughput benchmark。验收标准是复现相对 IOMMU/software I/O 的吞吐提升趋势。

### 11. 对后续研究的启发

1. 将 sIOPMP 接入 CoVE-IO lifecycle。2. 加入设备 attestation 与 TDISP。3. 评估 CXL/PCIe IDE 组合。4. 对比 Arm SMMU/RME-DA。5. 研究多租户设备共享中的 revocation 和 DoS。
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `10-riscv-cove-io-tee-io` - RISC-V CoVE-IO / TEE-I/O
- Paper key: `feng2024siopmp`
- Role: peer-reviewed SOTA RISC-V I/O protection mechanism
- Evidence base: sIOPMP PDF design figures/tables; local README metadata.
- Boundary: sIOPMP 保护 I/O access control，不等同于完整 SPDM/TDISP/CoVE-IO trusted-device lifecycle。

### 1. 完整题目 / 作者 / 会议

- 完整题目: sIOPMP: Scalable and Efficient I/O Protection for TEEs
- 作者: Erhu Feng et al.
- 会议/来源: ASPLOS 2024
- Title evidence: README metadata; sIOPMP ASPLOS 2024 PDF title page.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** sIOPMP 的核心贡献是把设备访问控制做成可扩展硬件检查，而不是靠少量粗粒度 IOPMP entry。

- 动机: DMA 设备可绕过 CPU-side enclave/TVM memory isolation，传统 I/O protection metadata 不够可扩展。
- 工作: 设计 scalable I/O protection metadata 和 checking path，用于 TEE 场景的 device access control。
- 数据: peer-reviewed 系统论文，有实现和性能评估；具体页码/图表在 README addendum 中保留。

**讲解稿:** 讲解时先把本页结论落到一句话: sIOPMP 的核心贡献是把设备访问控制做成可扩展硬件检查，而不是靠少量粗粒度 IOPMP entry。第一步解释为什么需要这一页: 动机: DMA 设备可绕过 CPU-side enclave/TVM memory isolation，传统 I/O protection metadata 不够可扩展。第二步说明论文或规范实际做了什么: 工作: 设计 scalable I/O protection metadata 和 checking path，用于 TEE 场景的 device access control。第三步收束到证据边界: 数据: peer-reviewed 系统论文，有实现和性能评估；具体页码/图表在 README addendum 中保留。引用时只把 sIOPMP abstract, design, and evaluation sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** sIOPMP abstract, design, and evaluation sections.

- Proof object: flow - sIOPMP story: device request -> source identity -> metadata lookup -> permission check -> TEE memory access allowed/blocked


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是 CPU TEE 边界会被 I/O 打穿: DMA 不经过 CPU page table。

- Enclave/TVM 私有页即使 CPU 访问受限，也可能被设备 DMA 读写。
- 设备数量、queue、address range 增加后，静态 region 规则难维护。
- TEE 需要既保护私有内存，又允许受信设备高性能访问。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是 CPU TEE 边界会被 I/O 打穿: DMA 不经过 CPU page table。第一步解释为什么需要这一页: Enclave/TVM 私有页即使 CPU 访问受限，也可能被设备 DMA 读写。第二步说明论文或规范实际做了什么: 设备数量、queue、address range 增加后，静态 region 规则难维护。第三步收束到证据边界: TEE 需要既保护私有内存，又允许受信设备高性能访问。引用时只把 sIOPMP motivation sections; relation to IOMMU/IOPMP 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** sIOPMP motivation sections; relation to IOMMU/IOPMP.

- Proof object: matrix - I/O attack surface: DMA read = secret exfiltration; DMA write = memory corruption; MMIO = device control path; Queue = descriptor tamper; Metadata scale = many devices/regions


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: I/O protection 的关键不是“有没有检查”，而是检查是否能随设备和内存规模扩展。

- sIOPMP 把 source ID、memory domain 和 permission metadata 组织成更可扩展结构。
- 它把设备访问控制放在数据路径硬件里，减少 monitor/hypervisor 高频介入。
- 但它仍需要上层 TSM/attestation 决定哪个 device 可信。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: I/O protection 的关键不是“有没有检查”，而是检查是否能随设备和内存规模扩展。第一步解释为什么需要这一页: sIOPMP 把 source ID、memory domain 和 permission metadata 组织成更可扩展结构。第二步说明论文或规范实际做了什么: 它把设备访问控制放在数据路径硬件里，减少 monitor/hypervisor 高频介入。第三步收束到证据边界: 但它仍需要上层 TSM/attestation 决定哪个 device 可信。引用时只把 sIOPMP design sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** sIOPMP design sections.

- Proof object: cards - design axes: source identity; memory domain; permission metadata; fast lookup; TEE policy above


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: 设备请求先被识别为某个 source，再经 sIOPMP metadata 判断能否访问目标物理地址。

- 这与 CPU-side PMP 类似，但对象从 CPU core 变成 I/O master。
- sIOPMP 更关注 scalable metadata layout 和 lookup cost。
- 上层 TEE manager 负责配置 policy，下层硬件负责每次访问 enforcement。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: 设备请求先被识别为某个 source，再经 sIOPMP metadata 判断能否访问目标物理地址。第一步解释为什么需要这一页: 这与 CPU-side PMP 类似，但对象从 CPU core 变成 I/O master。第二步说明论文或规范实际做了什么: sIOPMP 更关注 scalable metadata layout 和 lookup cost。第三步收束到证据边界: 上层 TEE manager 负责配置 policy，下层硬件负责每次访问 enforcement。引用时只把 sIOPMP architecture/design figures 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** sIOPMP architecture/design figures.

- Proof object: matrix - 组件: I/O master = device / DMA engine; Source ID = who sends request; Domain metadata = which TEE owns memory; Checker = allow/deny; TEE manager = configures policy


### 6. 核心方法拆解

#### 方法 1: Source-to-Domain Mapping

**Claim:** sIOPMP 首先要回答: 这次 I/O request 来自哪个设备或 function。

- 设备身份在平台内部通常来自 requester/source ID。
- Source 被映射到 memory domain 或 permission context。
- 错误映射会导致设备越权访问 TVM/enclave memory。

**讲解稿:** 讲解时先把本页结论落到一句话: sIOPMP 首先要回答: 这次 I/O request 来自哪个设备或 function。第一步解释为什么需要这一页: 设备身份在平台内部通常来自 requester/source ID。第二步说明论文或规范实际做了什么: Source 被映射到 memory domain 或 permission context。第三步收束到证据边界: 错误映射会导致设备越权访问 TVM/enclave memory。引用时只把 sIOPMP source identity mapping design 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** sIOPMP source identity mapping design.

- Proof object: flow - source mapping: requester ID -> source table -> memory domain -> permission context -> access decision

#### 方法 2: Scalable Permission Metadata

**Claim:** 核心设计目标是避免每个 device/region 都占用昂贵固定 entry。

- Metadata 要支持大量设备和动态内存。
- Lookup 必须足够快，不能让每次 DMA 都陷入软件。
- 配置路径仍必须被 trusted firmware/TSM 保护。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心设计目标是避免每个 device/region 都占用昂贵固定 entry。第一步解释为什么需要这一页: Metadata 要支持大量设备和动态内存。第二步说明论文或规范实际做了什么: Lookup 必须足够快，不能让每次 DMA 都陷入软件。第三步收束到证据边界: 配置路径仍必须被 trusted firmware/TSM 保护。引用时只把 sIOPMP metadata/checking design 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** sIOPMP metadata/checking design.

- Proof object: matrix - metadata tradeoff: 粒度 = fine enough for TEE pages; 规模 = many devices/domains; 速度 = hardware path; 配置 = trusted control; 风险 = stale policy

#### 方法 3: TEE Integration Boundary

**Claim:** sIOPMP 是 enforcement primitive，不是完整 trusted I/O stack。

- 它不自己证明设备固件身份。
- 它不自己提供 PCIe link encryption/freshness。
- 它需要和 CoVE-IO、SPDM/TDISP、IOMMU、AIA 组合。

**讲解稿:** 讲解时先把本页结论落到一句话: sIOPMP 是 enforcement primitive，不是完整 trusted I/O stack。第一步解释为什么需要这一页: 它不自己证明设备固件身份。第二步说明论文或规范实际做了什么: 它不自己提供 PCIe link encryption/freshness。第三步收束到证据边界: 它需要和 CoVE-IO、SPDM/TDISP、IOMMU、AIA 组合。引用时只把 sIOPMP discussion; CoVE-IO/IOMMU relation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** sIOPMP discussion; CoVE-IO/IOMMU relation.

- Proof object: cards - needs above/beside: TSM policy; SPDM device identity; TDISP assignment; PCIe IDE; IOMMU translation

#### 方法 4: Performance Path

**Claim:** 性能关键在每次 DMA 的 fast-path check 和 policy update 的 slow-path 管理。

- Fast path 应只做 metadata lookup 和 permission check。
- Slow path 处理 domain create/destroy、device bind/unbind、permission update。
- PPT 用这个框架解释为什么 I/O protection 难比 CPU load/store PMP 更复杂。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能关键在每次 DMA 的 fast-path check 和 policy update 的 slow-path 管理。第一步解释为什么需要这一页: Fast path 应只做 metadata lookup 和 permission check。第二步说明论文或规范实际做了什么: Slow path 处理 domain create/destroy、device bind/unbind、permission update。第三步收束到证据边界: PPT 用这个框架解释为什么 I/O protection 难比 CPU load/store PMP 更复杂。引用时只把 sIOPMP evaluation and design rationale 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** sIOPMP evaluation and design rationale.

- Proof object: flow - fast/slow path: slow: configure domain -> slow: bind device -> fast: DMA request -> fast: metadata check -> fast: memory access/fault


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** 实验环境与数据页: sIOPMP 是系统论文，有设计、实现和评估，但 deck 不把它扩写成 device attestation 证据。

- 证据源: 本地 peer-reviewed PDF 和 README。
- 可支撑: scalable I/O protection mechanism and overhead discussion。
- 边界: 不能支撑 SPDM/TDISP/IDE 或完整 CoVE-IO lifecycle。

**讲解稿:** 讲解时先把本页结论落到一句话: 实验环境与数据页: sIOPMP 是系统论文，有设计、实现和评估，但 deck 不把它扩写成 device attestation 证据。第一步解释为什么需要这一页: 证据源: 本地 peer-reviewed PDF 和 README。第二步说明论文或规范实际做了什么: 可支撑: scalable I/O protection mechanism and overhead discussion。第三步收束到证据边界: 边界: 不能支撑 SPDM/TDISP/IDE 或完整 CoVE-IO lifecycle。引用时只把 sIOPMP PDF design/evaluation; README evidence boundary 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** sIOPMP PDF design/evaluation; README evidence boundary.

- Proof object: matrix - 证据边界: 类型 = peer-reviewed system; 可支撑 = I/O access control; 不能支撑 = device identity lifecycle; 组合需求 = CoVE-IO + IOMMU + SPDM/TDISP


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能结论按机制解释: sIOPMP 的价值在降低 I/O protection fast path 的扩展成本。

- 具体 benchmark 数字以论文评价章节为准，README addendum 保留 evidence refs。
- 关键指标应看 DMA latency/throughput、metadata memory cost、policy update cost。
- 本页不把 access-control overhead 写成完整 TEE-I/O overhead。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能结论按机制解释: sIOPMP 的价值在降低 I/O protection fast path 的扩展成本。第一步解释为什么需要这一页: 具体 benchmark 数字以论文评价章节为准，README addendum 保留 evidence refs。第二步说明论文或规范实际做了什么: 关键指标应看 DMA latency/throughput、metadata memory cost、policy update cost。第三步收束到证据边界: 本页不把 access-control overhead 写成完整 TEE-I/O overhead。引用时只把 sIOPMP evaluation sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** sIOPMP evaluation sections.

- Proof object: bars - performance interpretation: I/O access control evidence 强; device attestation evidence 无; trusted lifecycle evidence 需 CoVE-IO; scalability focus 高


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: sIOPMP 是 RISC-V trusted I/O 的关键机制论文，但它只解决 data-path protection 的一段。

- 优势: 把 DMA/MMIO access control 作为硬件 primitive 处理，方向正确。
- 局限: 设备身份、链路保护、interrupt 和 lifecycle 需要其他标准/系统。
- 商业化潜力: 适合 RISC-V SoC、DPU、accelerator 平台；风险在标准采纳和与 IOMMU/TEE-IO 的接口。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: sIOPMP 是 RISC-V trusted I/O 的关键机制论文，但它只解决 data-path protection 的一段。第一步解释为什么需要这一页: 优势: 把 DMA/MMIO access control 作为硬件 primitive 处理，方向正确。第二步说明论文或规范实际做了什么: 局限: 设备身份、链路保护、interrupt 和 lifecycle 需要其他标准/系统。第三步收束到证据边界: 商业化潜力: 适合 RISC-V SoC、DPU、accelerator 平台；风险在标准采纳和与 IOMMU/TEE-IO 的接口。引用时只把 sIOPMP conclusion and README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** sIOPMP conclusion and README evaluation.

- Proof object: matrix - 评价: 优势 = scalable I/O enforcement; 局限 = not full TEE-I/O; 商业化 = RISC-V SoC I/O; 本方向角色 = main mechanism SOTA


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
