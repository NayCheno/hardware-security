# Direct Access, High-Performance Memory Disaggregation with DirectCXL

- BibTeX key: `gouk2022directcxl`
- Category: `memory-and-io-fabrics`
- Authors: Donghyun Gouk et al.
- Year: 2022
- Source: https://www.usenix.org/conference/atc22/presentation/gouk
- PDF source: https://www.usenix.org/system/files/atc22-gouk.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified

- Evidence type: E1 peer-reviewed primary systems paper.
- Narrative role: Background substrate. CXL memory-disaggregation background substrate; use for data-path/fabric context, not as Arm CCA or CoVE security evidence.
<!-- BEGIN PAPER REVIEW -->
## Paper Review
Canonical BibTeX key: `gouk2022directcxl`. Evidence type: E1 peer-reviewed primary systems paper. Narrative role: Background substrate. CXL memory-disaggregation background substrate; use for data-path/fabric context, not as Arm CCA or CoVE security evidence.

This README records the source/PDF availability above and should be treated as the local evidence-status record for Direct Access, High-Performance Memory Disaggregation with DirectCXL. When citing this reference in the survey正文, keep the claim within the stated evidence role and cite stronger primary or official sources for mechanism details outside this source's scope.
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `12-memory-io-fabrics` - Memory / I/O Fabrics: CXL、RDMA、远端内存
- Paper key: `gouk2022directcxl`
- Role: foundational CXL memory-disaggregation systems paper
- Evidence base: DirectCXL Figure 1 RDMA path; Figure 2-Figure 5 design/runtime; Figure 6 latency; Figure 8 hierarchy; Figure 10 workload.
- Boundary: DirectCXL 是性能/系统论文，不提供 CXL IDE、SPDM/TDISP 或 confidential I/O 安全证明。

### 1. 完整题目 / 作者 / 会议

- 完整题目: Direct Access, High-Performance Memory Disaggregation with DirectCXL
- 作者: Donghyun Gouk et al.
- 会议/来源: USENIX ATC 2022
- Title evidence: README metadata; DirectCXL PDF title page.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** DirectCXL 的核心贡献不是“更快网络”，而是把远端内存变成 CPU 可直接 load/store 的 CXL.mem 地址空间。

- 动机: 传统 page/object disaggregation 经常走 RDMA、copy、runtime 和 page-fault 路径，latency 高。
- 工作: 构建 CXL device、CXL switch、Linux 5.13 runtime、cxl-namespace 和 mmap 接口。
- 数据: 64B RDMA latency 2705 cycles，DirectCXL 328 cycles；真实 workload 相比 RDMA-based disaggregation 约 3x 性能。

**讲解稿:** 讲解时先把本页结论落到一句话: DirectCXL 的核心贡献不是“更快网络”，而是把远端内存变成 CPU 可直接 load/store 的 CXL.mem 地址空间。第一步解释为什么需要这一页: 动机: 传统 page/object disaggregation 经常走 RDMA、copy、runtime 和 page-fault 路径，latency 高。第二步说明论文或规范实际做了什么: 工作: 构建 CXL device、CXL switch、Linux 5.13 runtime、cxl-namespace 和 mmap 接口。第三步收束到证据边界: 数据: 64B RDMA latency 2705 cycles，DirectCXL 328 cycles；真实 workload 相比 RDMA-based disaggregation 约 3x 性能。引用时只把 DirectCXL abstract; Figure 2-Figure 6; Figure 10 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** DirectCXL abstract; Figure 2-Figure 6; Figure 10.

- Proof object: flow - DirectCXL path: application load/store -> HDM address -> CXL root port -> CXL switch -> remote DRAM -> data returns to CPU cache


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是 RDMA memory disaggregation 的成本来自软件路径和 copy，不只是链路带宽。

- Page-based 方案有 page fault、swap、context switch 和 I/O amplification。
- Object-based 方案要求应用改接口，语义依赖对象系统。
- RDMA 需要 memory region、RNIC、remote runtime 或 CPU 参与。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是 RDMA memory disaggregation 的成本来自软件路径和 copy，不只是链路带宽。第一步解释为什么需要这一页: Page-based 方案有 page fault、swap、context switch 和 I/O amplification。第二步说明论文或规范实际做了什么: Object-based 方案要求应用改接口，语义依赖对象系统。第三步收束到证据边界: RDMA 需要 memory region、RNIC、remote runtime 或 CPU 参与。引用时只把 DirectCXL Section 1-2; Figure 1 RDMA data movement 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** DirectCXL Section 1-2; Figure 1 RDMA data movement.

- Proof object: matrix - 传统路径成本: Page-based = transparent but fault/copy heavy; Object-based = fast but app-specific; RDMA = MR/copy/runtime overhead; DirectCXL = address-mapped CXL.mem; Security gap = not identity/link protection


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: 如果 remote memory 能变成系统地址空间，关键路径就从 message/copy path 变成 address path。

- CXL device 暴露 Host-managed Device Memory。
- CXL switch 建立 virtual hierarchy 和 routing。
- Runtime 管理 namespace，不让 remote CPU 处理每次访问。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: 如果 remote memory 能变成系统地址空间，关键路径就从 message/copy path 变成 address path。第一步解释为什么需要这一页: CXL device 暴露 Host-managed Device Memory。第二步说明论文或规范实际做了什么: CXL switch 建立 virtual hierarchy 和 routing。第三步收束到证据边界: Runtime 管理 namespace，不让 remote CPU 处理每次访问。引用时只把 DirectCXL Figure 2-Figure 4 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** DirectCXL Figure 2-Figure 4.

- Proof object: cards - 核心对象: HDM; CXL flit; CXL switch; cxl-namespace; /dev/directcxl


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: CXL device 是被动内存模块，host 通过 PCIe/CXL fabric 访问它。

- PCIe enumeration 后，HDM 被映射进 host system memory。
- Root port 把 CPU load/store 请求转成 CXL flit。
- CXL controller 访问远端 DRAM，runtime 用 segment table 管 namespace。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: CXL device 是被动内存模块，host 通过 PCIe/CXL fabric 访问它。第一步解释为什么需要这一页: PCIe enumeration 后，HDM 被映射进 host system memory。第二步说明论文或规范实际做了什么: Root port 把 CPU load/store 请求转成 CXL flit。第三步收束到证据边界: CXL controller 访问远端 DRAM，runtime 用 segment table 管 namespace。引用时只把 DirectCXL Figure 2-Figure 5 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** DirectCXL Figure 2-Figure 5.

- Proof object: matrix - 架构组件: Host CPU = load/store issuer; Root Port = CXL flit conversion; CXL Switch = virtual hierarchy; CXL Device = remote DRAM endpoint; Runtime = namespace/mmap/ioctl


### 6. 核心方法拆解

#### 方法 1: CXL.mem Address Mapping

**Claim:** DirectCXL 让远端 DRAM 进入 host physical address space。

- 应用 mmap cxl-namespace 后直接 load/store。
- HDM base address 将请求导向 CXL root port。
- 不需要 host DRAM 中转 copy。

**讲解稿:** 讲解时先把本页结论落到一句话: DirectCXL 让远端 DRAM 进入 host physical address space。第一步解释为什么需要这一页: 应用 mmap cxl-namespace 后直接 load/store。第二步说明论文或规范实际做了什么: HDM base address 将请求导向 CXL root port。第三步收束到证据边界: 不需要 host DRAM 中转 copy。引用时只把 DirectCXL Section 3.1; Figure 2 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** DirectCXL Section 3.1; Figure 2.

- Proof object: flow - address mapping: PCIe enumeration -> HDM exposed -> namespace created -> mmap -> CPU load/store -> CXL flit

#### 方法 2: CXL Switch / Virtual Hierarchy

**Claim:** 多 host / 多 memory device 需要 switch 管 routing，而不是点对点线缆。

- CXL switch 建 virtual hierarchy。
- Routing table 连接 host 与 logical device。
- 这让 memory pooling/partitioning 成为 fabric management 问题。

**讲解稿:** 讲解时先把本页结论落到一句话: 多 host / 多 memory device 需要 switch 管 routing，而不是点对点线缆。第一步解释为什么需要这一页: CXL switch 建 virtual hierarchy。第二步说明论文或规范实际做了什么: Routing table 连接 host 与 logical device。第三步收束到证据边界: 这让 memory pooling/partitioning 成为 fabric management 问题。引用时只把 DirectCXL Figure 3; Figure 5 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** DirectCXL Figure 3; Figure 5.

- Proof object: matrix - fabric management: Host = compute complex; Switch = routing/virtual hierarchy; Device = HDM windows; Logical device = partitioned memory; Risk = needs trust later

#### 方法 3: Linux Runtime / Namespace

**Claim:** runtime 把硬件内存资源变成应用可用对象。

- 驱动暴露 /dev/directcxl。
- ioctl 创建 cxl-namespace。
- mmap 让应用按文件式接口映射远端内存。

**讲解稿:** 讲解时先把本页结论落到一句话: runtime 把硬件内存资源变成应用可用对象。第一步解释为什么需要这一页: 驱动暴露 /dev/directcxl。第二步说明论文或规范实际做了什么: ioctl 创建 cxl-namespace。第三步收束到证据边界: mmap 让应用按文件式接口映射远端内存。引用时只把 DirectCXL Figure 4 runtime 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** DirectCXL Figure 4 runtime.

- Proof object: flow - runtime: /dev/directcxl -> ioctl namespace -> segment table -> /dev/cxl-ns0 -> mmap -> application access

#### 方法 4: Security Boundary

**Claim:** DirectCXL 的机制图很适合 data path，但不能替代 confidential I/O 证据。

- 论文不处理 device identity。
- 论文不处理 CXL IDE/link confidentiality。
- 论文不处理 TVM/Realm ownership lifecycle。

**讲解稿:** 讲解时先把本页结论落到一句话: DirectCXL 的机制图很适合 data path，但不能替代 confidential I/O 证据。第一步解释为什么需要这一页: 论文不处理 device identity。第二步说明论文或规范实际做了什么: 论文不处理 CXL IDE/link confidentiality。第三步收束到证据边界: 论文不处理 TVM/Realm ownership lifecycle。引用时只把 DirectCXL conclusion; survey boundary 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** DirectCXL conclusion; survey boundary.

- Proof object: cards - not covered: SPDM; TDISP; CXL IDE; attestation; multi-tenant trust


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** 实验环境是真实/原型 CXL-enabled cluster，比较 Local、RDMA、Swap/KVS 和 DirectCXL。

- 软件: RISC-V Linux 5.13.19、DirectCXL runtime、FastSwap/HERD ports。
- 硬件/原型: CXL host/device/switch IP，自建 CXL device prototypes。
- Workloads: microbenchmarks、DLRM、MemDB、graph workloads 等。

**讲解稿:** 讲解时先把本页结论落到一句话: 实验环境是真实/原型 CXL-enabled cluster，比较 Local、RDMA、Swap/KVS 和 DirectCXL。第一步解释为什么需要这一页: 软件: RISC-V Linux 5.13.19、DirectCXL runtime、FastSwap/HERD ports。第二步说明论文或规范实际做了什么: 硬件/原型: CXL host/device/switch IP，自建 CXL device prototypes。第三步收束到证据边界: Workloads: microbenchmarks、DLRM、MemDB、graph workloads 等。引用时只把 DirectCXL Section 4; Figure 5; Table 1 workload characteristics 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** DirectCXL Section 4; Figure 5; Table 1 workload characteristics.

- Proof object: matrix - 实验设置: OS = Linux 5.13.19; Baseline = RDMA / Swap / KVS / Local; Metric = 64B latency, hierarchy, workload; Fabric = CXL switch/device prototype; Boundary = performance not security


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能结论: DirectCXL 显著缩短远端内存访问路径，但仍慢于本地 DRAM。

- Figure 6: RDMA 2705 cycles vs DirectCXL 328 cycles，8.3x faster。
- Figure 8: RDMA best-case 2027 cycles，约 6.2x slower than DirectCXL；Local L2 miss 约 60 cycles。
- Figure 10/conclusion: real workloads 约 3x better than RDMA-based disaggregation。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能结论: DirectCXL 显著缩短远端内存访问路径，但仍慢于本地 DRAM。第一步解释为什么需要这一页: Figure 6: RDMA 2705 cycles vs DirectCXL 328 cycles，8.3x faster。第二步说明论文或规范实际做了什么: Figure 8: RDMA best-case 2027 cycles，约 6.2x slower than DirectCXL；Local L2 miss 约 60 cycles。第三步收束到证据边界: Figure 10/conclusion: real workloads 约 3x better than RDMA-based disaggregation。引用时只把 DirectCXL Figure 6; Figure 8/Table 2; Figure 10 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** DirectCXL Figure 6; Figure 8/Table 2; Figure 10.

- Proof object: bars - key numbers: RDMA 64B read 2705 cycles; DirectCXL 64B load 328 cycles; RDMA vs DirectCXL 6.2x slower; real workload speedup ~3x


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: DirectCXL 强在证明 CXL.mem data path 价值，弱在完全不覆盖 confidential trust。

- 优势: 系统原型完整，数字直观，能解释 CXL 为什么改变 memory boundary。
- 局限: 无 attestation、link encryption、device lifecycle、multi-tenant ownership。
- 商业化潜力: CXL memory pooling/expansion；机密计算落地必须叠加 SPDM/TDISP/IDE/TEE policy。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: DirectCXL 强在证明 CXL.mem data path 价值，弱在完全不覆盖 confidential trust。第一步解释为什么需要这一页: 优势: 系统原型完整，数字直观，能解释 CXL 为什么改变 memory boundary。第二步说明论文或规范实际做了什么: 局限: 无 attestation、link encryption、device lifecycle、multi-tenant ownership。第三步收束到证据边界: 商业化潜力: CXL memory pooling/expansion；机密计算落地必须叠加 SPDM/TDISP/IDE/TEE policy。引用时只把 DirectCXL conclusion; README boundary 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** DirectCXL conclusion; README boundary.

- Proof object: matrix - 评价: 优势 = clear data-path speedup; 局限 = not confidential I/O; 商业化 = CXL pooling; 本方向角色 = fabric performance baseline


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
