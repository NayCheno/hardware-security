# Managing Memory Tiers with CXL in Virtualized Environments

- BibTeX key: `zhong2024cxltiers`
- Category: `memory-and-io-fabrics`
- Authors: Yuhong Zhong et al.
- Year: 2024
- Source: https://www.usenix.org/conference/osdi24/presentation/zhong-yuhong
- PDF source: https://www.usenix.org/system/files/osdi24-zhong-yuhong.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified

- Evidence type: E1 peer-reviewed primary systems paper.
- Narrative role: Background substrate. CXL memory-tier management background substrate; use for data-placement/fabric context, not as trusted-I/O proof.
<!-- BEGIN PAPER REVIEW -->
## Paper Review
Canonical BibTeX key: `zhong2024cxltiers`. Evidence type: E1 peer-reviewed primary systems paper. Narrative role: Background substrate. CXL memory-tier management background substrate; use for data-placement/fabric context, not as trusted-I/O proof.

This README records the source/PDF availability above and should be treated as the local evidence-status record for Managing Memory Tiers with CXL in Virtualized Environments. When citing this reference in the survey正文, keep the claim within the stated evidence role and cite stronger primary or official sources for mechanism details outside this source's scope.
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `12-memory-io-fabrics` - Memory / I/O Fabrics: CXL、RDMA、远端内存
- Paper key: `zhong2024cxltiers`
- Role: SOTA CXL memory-tier management for VMs
- Evidence base: CXL-Tiers Figure 1-Figure 2 VM locality; Figure 3-Figure 4 Flat Memory Mode; Figure 8-Figure 12 Memstrata; Figure 10/12 results.
- Boundary: CXL-Tiers 是 memory-tier performance/isolation 论文，不提供 confidential I/O 或 TEE security proof。

### 1. 完整题目 / 作者 / 会议

- 完整题目: Managing Memory Tiers with CXL in Virtualized Environments
- 作者: Huiyang Zhong et al.
- 会议/来源: 2024 systems paper
- Title evidence: README metadata; CXL-Tiers PDF title page.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** CXL-Tiers 的关键不是“给 VM 加慢内存”，而是让硬件做 cache-line tiering，让软件只处理多租户 outlier。

- 动机: CXL memory capacity 便宜但 latency 高；VM 环境中 software tiering 追踪 hotness 成本高且不透明。
- 工作: 使用 Intel Flat Memory Mode/Mixed Mode，并设计 Memstrata 预测 VM slowdown、迁移 dedicated local pages。
- 数据: mixed mode 下 82% workloads slowdown <=5%；Memstrata 将 realistic multi-VM worst-case slowdown 从 35% 降到 <6%。

**讲解稿:** 讲解时先把本页结论落到一句话: CXL-Tiers 的关键不是“给 VM 加慢内存”，而是让硬件做 cache-line tiering，让软件只处理多租户 outlier。第一步解释为什么需要这一页: 动机: CXL memory capacity 便宜但 latency 高；VM 环境中 software tiering 追踪 hotness 成本高且不透明。第二步说明论文或规范实际做了什么: 工作: 使用 Intel Flat Memory Mode/Mixed Mode，并设计 Memstrata 预测 VM slowdown、迁移 dedicated local pages。第三步收束到证据边界: 数据: mixed mode 下 82% workloads slowdown <=5%；Memstrata 将 realistic multi-VM worst-case slowdown 从 35% 降到 <6%。引用时只把 CXL-Tiers abstract; Figure 5; Figure 10-Figure 12 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CXL-Tiers abstract; Figure 5; Figure 10-Figure 12.

- Proof object: flow - CXL-Tiers loop: VM accesses memory -> memory controller line swap -> collect perf events -> predict slowdown -> migrate local pages -> outlier improves


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是 VM 软件 tiering 很难又快又准。

- Host 看不到 guest 真实 hotness 或追踪成本高。
- 2MB/1GB huge page 让冷热 cache line 混在一起。
- 多租户竞争 local DRAM 会制造 outlier 和尾部 slowdown。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是 VM 软件 tiering 很难又快又准。第一步解释为什么需要这一页: Host 看不到 guest 真实 hotness 或追踪成本高。第二步说明论文或规范实际做了什么: 2MB/1GB huge page 让冷热 cache line 混在一起。第三步收束到证据边界: 多租户竞争 local DRAM 会制造 outlier 和尾部 slowdown。引用时只把 CXL-Tiers Section 1-2; Figure 1-Figure 2 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CXL-Tiers Section 1-2; Figure 1-Figure 2.

- Proof object: matrix - VM tiering pain: Telemetry = host overhead/privacy; Granularity = page too coarse; Huge pages = hot/cold mixed; Noisy neighbor = local DRAM conflict; Goal = <=5% slowdown for most


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: 硬件做细粒度 hotness，软件做多租户公平。

- Flat Memory Mode 在 memory controller 里做 cache-line swap。
- Mixed Mode 保留 dedicated local memory 给 outlier。
- Memstrata 用 performance events 和 ML estimator 找到需要 local pages 的 VM。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: 硬件做细粒度 hotness，软件做多租户公平。第一步解释为什么需要这一页: Flat Memory Mode 在 memory controller 里做 cache-line swap。第二步说明论文或规范实际做了什么: Mixed Mode 保留 dedicated local memory 给 outlier。第三步收束到证据边界: Memstrata 用 performance events 和 ML estimator 找到需要 local pages 的 VM。引用时只把 CXL-Tiers Figure 3-Figure 4; Figure 8-Figure 9 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CXL-Tiers Figure 3-Figure 4; Figure 8-Figure 9.

- Proof object: cards - split responsibility: HW: cache-line tiering; SW: outlier detection; SW: page migration; VM unchanged; cloud policy above


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: VM 看到一个内存池，硬件在 local/CXL 间搬 cache line，Memstrata 在 VM 间分 dedicated local pages。

- 硬件 tiered NUMA node 聚合 local DRAM 与 CXL memory。
- Mixed mode 暴露 dedicated local NUMA node。
- Memstrata 控制页迁移，不改 guest。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: VM 看到一个内存池，硬件在 local/CXL 间搬 cache line，Memstrata 在 VM 间分 dedicated local pages。第一步解释为什么需要这一页: 硬件 tiered NUMA node 聚合 local DRAM 与 CXL memory。第二步说明论文或规范实际做了什么: Mixed mode 暴露 dedicated local NUMA node。第三步收束到证据边界: Memstrata 控制页迁移，不改 guest。引用时只把 CXL-Tiers Figure 3-Figure 4; Figure 8 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CXL-Tiers Figure 3-Figure 4; Figure 8.

- Proof object: matrix - 组件: HW-tiered node = local + CXL capacity; Dedicated local = reserved fast pages; Memstrata = allocator/controller; Estimator = predict >5% slowdown; VM = unmodified guest


### 6. 核心方法拆解

#### 方法 1: Flat / Mixed Memory Mode

**Claim:** Flat Memory Mode 把 local DRAM 当 CXL tier 的硬件 cache，Mixed Mode 留出 dedicated local DRAM。

- Cache-line granularity 避免 page-level hotness 错配。
- Mixed Mode 支持为 latency-sensitive VM 分配稳定 fast pages。
- Guest 无需修改。

**讲解稿:** 讲解时先把本页结论落到一句话: Flat Memory Mode 把 local DRAM 当 CXL tier 的硬件 cache，Mixed Mode 留出 dedicated local DRAM。第一步解释为什么需要这一页: Cache-line granularity 避免 page-level hotness 错配。第二步说明论文或规范实际做了什么: Mixed Mode 支持为 latency-sensitive VM 分配稳定 fast pages。第三步收束到证据边界: Guest 无需修改。引用时只把 CXL-Tiers Figure 3-Figure 4 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CXL-Tiers Figure 3-Figure 4.

- Proof object: flow - tiering: local DRAM -> CXL memory -> cache-line swap -> dedicated local pages -> VM uniform address space

#### 方法 2: Slowdown Estimator

**Claim:** Memstrata 不追踪每页 hotness，而是预测 VM 是否已经成为 outlier。

- 输入包括 per-VM performance events。
- 目标阈值是 slowdown >5%。
- 估计器避免高成本 PTE scanning/instruction sampling。

**讲解稿:** 讲解时先把本页结论落到一句话: Memstrata 不追踪每页 hotness，而是预测 VM 是否已经成为 outlier。第一步解释为什么需要这一页: 输入包括 per-VM performance events。第二步说明论文或规范实际做了什么: 目标阈值是 slowdown >5%。第三步收束到证据边界: 估计器避免高成本 PTE scanning/instruction sampling。引用时只把 CXL-Tiers Figure 8-Figure 9; Listing 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CXL-Tiers Figure 8-Figure 9; Listing 1.

- Proof object: matrix - estimator: Input = perf counters; Output = slowdown class; Threshold = >5%; Policy = rank outliers; Benefit = low host overhead

#### 方法 3: Dynamic Page Allocator

**Claim:** Allocator 把 dedicated local pages 从低风险 VM 转给 outlier VM。

- 只给 predicted outlier 更高 rank。
- 可在多个 workload combinations 中降低 worst-case slowdown。
- 风险是预测错误和迁移策略本身开销。

**讲解稿:** 讲解时先把本页结论落到一句话: Allocator 把 dedicated local pages 从低风险 VM 转给 outlier VM。第一步解释为什么需要这一页: 只给 predicted outlier 更高 rank。第二步说明论文或规范实际做了什么: 可在多个 workload combinations 中降低 worst-case slowdown。第三步收束到证据边界: 风险是预测错误和迁移策略本身开销。引用时只把 CXL-Tiers Listing 1; Figure 10-Figure 12 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CXL-Tiers Listing 1; Figure 10-Figure 12.

- Proof object: flow - allocator: collect counters -> predict slowdown -> rank VMs -> select donor -> migrate pages -> re-evaluate

#### 方法 4: Confidential Boundary Lesson

**Claim:** CXL-Tiers 对机密计算的启发是资源管理也会成为 side/control boundary。

- 性能 telemetry 可能泄露 workload 行为。
- Host page migration policy 会影响 CVM tail latency。
- 论文不提供机密性证明，只提供 tiering 机制证据。

**讲解稿:** 讲解时先把本页结论落到一句话: CXL-Tiers 对机密计算的启发是资源管理也会成为 side/control boundary。第一步解释为什么需要这一页: 性能 telemetry 可能泄露 workload 行为。第二步说明论文或规范实际做了什么: Host page migration policy 会影响 CVM tail latency。第三步收束到证据边界: 论文不提供机密性证明，只提供 tiering 机制证据。引用时只把 CXL-Tiers scope; survey boundary 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CXL-Tiers scope; survey boundary.

- Proof object: cards - TEE lesson: telemetry boundary; placement policy; tail latency; tenant isolation; needs TEE evidence


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** 实验环境覆盖真实 CXL memory、QEMU/KVM 修改和大量 VM workloads。

- 系统: Linux kernel/QEMU/KVM 修改，CXL cards + Intel memory controller。
- Workloads: 115 workloads，web/data/Spark/ML/GAP/SPEC 等组合。
- 指标: slowdown、outlier、CPU overhead、memory overhead。

**讲解稿:** 讲解时先把本页结论落到一句话: 实验环境覆盖真实 CXL memory、QEMU/KVM 修改和大量 VM workloads。第一步解释为什么需要这一页: 系统: Linux kernel/QEMU/KVM 修改，CXL cards + Intel memory controller。第二步说明论文或规范实际做了什么: Workloads: 115 workloads，web/data/Spark/ML/GAP/SPEC 等组合。第三步收束到证据边界: 指标: slowdown、outlier、CPU overhead、memory overhead。引用时只把 CXL-Tiers implementation/evaluation sections 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CXL-Tiers implementation/evaluation sections.

- Proof object: matrix - 实验设置: Workloads = 115; Environment = virtualized CXL tiers; Metric = slowdown/outlier; Controller = Memstrata; Overhead = CPU <=4% core, memory 110MB


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能结论: 大多数 workload 可接受，但 outlier 需要 software isolation policy。

- Mixed mode: 82% workloads slowdown <=5%，95% <=10%，outlier up to 34%。
- Memstrata: realistic multi-VM worst-case slowdown 35% -> <6%。
- Memstrata overhead: max CPU overhead 4% of a single core，memory overhead 约 110MB。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能结论: 大多数 workload 可接受，但 outlier 需要 software isolation policy。第一步解释为什么需要这一页: Mixed mode: 82% workloads slowdown <=5%，95% <=10%，outlier up to 34%。第二步说明论文或规范实际做了什么: Memstrata: realistic multi-VM worst-case slowdown 35% -> <6%。第三步收束到证据边界: Memstrata overhead: max CPU overhead 4% of a single core，memory overhead 约 110MB。引用时只把 CXL-Tiers abstract; Figure 5; Figure 10-Figure 12 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CXL-Tiers abstract; Figure 5; Figure 10-Figure 12.

- Proof object: bars - key numbers: workloads <=5% slowdown 82%; workloads <=10% slowdown 95%; worst-case before 35%; after Memstrata <6%


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: CXL-Tiers 是 CXL VM resource-management SOTA，但不是 security mechanism。

- 优势: 分工清楚，数据充分，能解释 CXL tiering 在云 VM 中的实际尾部风险。
- 局限: 不处理 confidential memory ownership、device identity、link security。
- 商业化潜力: 云 CXL capacity tier 管理；机密计算场景需控制 telemetry 和 host policy 信任。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: CXL-Tiers 是 CXL VM resource-management SOTA，但不是 security mechanism。第一步解释为什么需要这一页: 优势: 分工清楚，数据充分，能解释 CXL tiering 在云 VM 中的实际尾部风险。第二步说明论文或规范实际做了什么: 局限: 不处理 confidential memory ownership、device identity、link security。第三步收束到证据边界: 商业化潜力: 云 CXL capacity tier 管理；机密计算场景需控制 telemetry 和 host policy 信任。引用时只把 CXL-Tiers conclusion; README boundary 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** CXL-Tiers conclusion; README boundary.

- Proof object: matrix - 评价: 优势 = VM tiering policy; 局限 = not TEE security; 商业化 = cloud CXL memory; 本方向角色 = tiering SOTA


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
