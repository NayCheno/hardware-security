# ODRP: on-demand remote paging with programmable RDMA

- BibTeX key: `wang2025odrp`
- Category: `memory-and-io-fabrics`
- Authors: Zixuan Wang et al.
- Year: 2025
- Source: https://www.usenix.org/conference/nsdi25/presentation/wang-zixuan
- PDF source: https://www.usenix.org/system/files/nsdi25-wang-zixuan.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified

- Evidence type: E1 peer-reviewed primary systems paper.
- Narrative role: Background substrate. RDMA/remote-paging background substrate; use for data-path context, not as proof of a complete confidential-computing boundary.
<!-- BEGIN PAPER REVIEW -->
## Paper Review
Canonical BibTeX key: `wang2025odrp`. Evidence type: E1 peer-reviewed primary systems paper. Narrative role: Background substrate. RDMA/remote-paging background substrate; use for data-path context, not as proof of a complete confidential-computing boundary.

This README records the source/PDF availability above and should be treated as the local evidence-status record for ODRP: on-demand remote paging with programmable RDMA. When citing this reference in the survey正文, keep the claim within the stated evidence role and cite stronger primary or official sources for mechanism details outside this source's scope.
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `12-memory-io-fabrics` - Memory / I/O Fabrics: CXL、RDMA、远端内存
- Paper key: `wang2025odrp`
- Role: SOTA programmable RDMA remote paging system
- Evidence base: ODRP Figure 1 alternatives; Figure 6 WR chain design; Figure 7 utilization/CPU/performance; Figure 8/9 scaling and swap throughput.
- Boundary: ODRP 是 disaggregated memory performance paper，不提供 confidential link/device/TEE proof。

### 1. 完整题目 / 作者 / 会议

- 完整题目: ODRP: On-Demand Remote Paging with Programmable RDMA
- 作者: Wang et al.
- 会议/来源: 2025 systems paper
- Title evidence: README metadata; ODRP PDF title page.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** ODRP 的贡献是把 remote paging 的动态分配逻辑从 MNode CPU 搬到 programmable RDMA WR chains。

- 动机: One-sided static utilization 低，two-sided dynamic 需要 MNode CPU，remote paging 在数据中心难同时兼顾性能和利用率。
- 工作: 用 RDMA WAIT/ENABLE/CAS/FAA 等 work request chain 做 4KB-granularity on-demand allocation。
- 数据: 相比 Fastswap/alternatives，remote memory utilization 提升 1.72x-12x，MNode CPU usage 为 0，性能 overhead 约 0.8%-14.6%。

**讲解稿:** 讲解时先把本页结论落到一句话: ODRP 的贡献是把 remote paging 的动态分配逻辑从 MNode CPU 搬到 programmable RDMA WR chains。第一步解释为什么需要这一页: 动机: One-sided static utilization 低，two-sided dynamic 需要 MNode CPU，remote paging 在数据中心难同时兼顾性能和利用率。第二步说明论文或规范实际做了什么: 工作: 用 RDMA WAIT/ENABLE/CAS/FAA 等 work request chain 做 4KB-granularity on-demand allocation。第三步收束到证据边界: 数据: 相比 Fastswap/alternatives，remote memory utilization 提升 1.72x-12x，MNode CPU usage 为 0，性能 overhead 约 0.8%-14.6%。引用时只把 ODRP abstract; Figure 6; Figure 7; Figure 9 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** ODRP abstract; Figure 6; Figure 7; Figure 9.

- Proof object: flow - ODRP path: CNode page fault -> RDMA WR chain -> lookup translation table -> allocate remote page -> update mapping -> swap data


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是 remote memory disaggregation 有三难: utilization、MNode CPU、performance。

- Static pre-registration 无 CPU 但内存碎片/利用率差。
- Dynamic/two-sided 方法利用率高但消耗 MNode CPU。
- 4KB-granularity paging 需要频繁 allocation/free，MNode 成为瓶颈。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是 remote memory disaggregation 有三难: utilization、MNode CPU、performance。第一步解释为什么需要这一页: Static pre-registration 无 CPU 但内存碎片/利用率差。第二步说明论文或规范实际做了什么: Dynamic/two-sided 方法利用率高但消耗 MNode CPU。第三步收束到证据边界: 4KB-granularity paging 需要频繁 allocation/free，MNode 成为瓶颈。引用时只把 ODRP Section 1-2; Figure 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** ODRP Section 1-2; Figure 1.

- Proof object: matrix - 三难: Utilization = static wastes memory; MNode CPU = dynamic consumes CPU; Performance = extra RTT/control path; Granularity = 4KB pages; ODRP = RNIC offload


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: RDMA work requests 可以组合成小型控制程序，把 remote paging 控制路径 offload。

- WR chain 利用 WAIT、ENABLE、CAS、FAA 等 primitive。
- MNode 存 data structures，但 CPU 不处理每个请求。
- CNode 只维护轻量 metadata，remote allocation 在 RNIC 侧完成。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: RDMA work requests 可以组合成小型控制程序，把 remote paging 控制路径 offload。第一步解释为什么需要这一页: WR chain 利用 WAIT、ENABLE、CAS、FAA 等 primitive。第二步说明论文或规范实际做了什么: MNode 存 data structures，但 CPU 不处理每个请求。第三步收束到证据边界: CNode 只维护轻量 metadata，remote allocation 在 RNIC 侧完成。引用时只把 ODRP WR chain design; Figure 6 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** ODRP WR chain design; Figure 6.

- Proof object: cards - RDMA primitives: WAIT; ENABLE; CAS; FAA; READ/WRITE


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: CNode 发起 fault/swap，RNIC 执行 WR chain，MNode 内存保存 translation table 和 free page queue。

- Translation table 记录 virtual remote page 到 allocated page。
- Free queue 支持 on-demand allocation。
- RNIC atomic operations 保证并发更新的一致性。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: CNode 发起 fault/swap，RNIC 执行 WR chain，MNode 内存保存 translation table 和 free page queue。第一步解释为什么需要这一页: Translation table 记录 virtual remote page 到 allocated page。第二步说明论文或规范实际做了什么: Free queue 支持 on-demand allocation。第三步收束到证据边界: RNIC atomic operations 保证并发更新的一致性。引用时只把 ODRP Section 4; Figure 6 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** ODRP Section 4; Figure 6.

- Proof object: matrix - 组件: CNode = faulting compute node; RNIC = programmable WR execution; MNode memory = remote page pool; TT = translation table; Free queue = allocation source


### 6. 核心方法拆解

#### 方法 1: WR Chain as Remote Control Path

**Claim:** ODRP 用 WR chain 实现查表、分配、更新，而不是唤醒 remote CPU。

- WAIT/ENABLE 组织依赖。
- CAS/FAA 完成并发安全更新。
- 链式操作把 allocation 放到 RNIC 数据路径附近。

**讲解稿:** 讲解时先把本页结论落到一句话: ODRP 用 WR chain 实现查表、分配、更新，而不是唤醒 remote CPU。第一步解释为什么需要这一页: WAIT/ENABLE 组织依赖。第二步说明论文或规范实际做了什么: CAS/FAA 完成并发安全更新。第三步收束到证据边界: 链式操作把 allocation 放到 RNIC 数据路径附近。引用时只把 ODRP Figure 6 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** ODRP Figure 6.

- Proof object: flow - WR chain: READ TT -> if unmapped -> CAS/FAA free queue -> WRITE TT -> READ/WRITE page -> complete

#### 方法 2: On-Demand 4KB Allocation

**Claim:** 按需 4KB 分配让 remote memory utilization 接近实际使用量。

- Static 预留会浪费空页。
- ODRP 不需要每个 CNode 预注册大 remote memory。
- 细粒度分配也带来 metadata 和 atomic operation 成本。

**讲解稿:** 讲解时先把本页结论落到一句话: 按需 4KB 分配让 remote memory utilization 接近实际使用量。第一步解释为什么需要这一页: Static 预留会浪费空页。第二步说明论文或规范实际做了什么: ODRP 不需要每个 CNode 预注册大 remote memory。第三步收束到证据边界: 细粒度分配也带来 metadata 和 atomic operation 成本。引用时只把 ODRP Figure 7 utilization results 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** ODRP Figure 7 utilization results.

- Proof object: matrix - allocation: Static = low utilization; Two-sided = CPU heavy; ODRP = on-demand 4KB; Benefit = high utilization; Cost = WR chain overhead

#### 方法 3: Consistency and Concurrency

**Claim:** remote paging 需要保证多个 CNode 并发 allocation 不把同一页分出去。

- 论文用 RDMA atomic 和 induction argument 分析一致性。
- TT/free-queue 更新需要顺序约束。
- 错误会导致 alias、data corruption 或 page leak。

**讲解稿:** 讲解时先把本页结论落到一句话: remote paging 需要保证多个 CNode 并发 allocation 不把同一页分出去。第一步解释为什么需要这一页: 论文用 RDMA atomic 和 induction argument 分析一致性。第二步说明论文或规范实际做了什么: TT/free-queue 更新需要顺序约束。第三步收束到证据边界: 错误会导致 alias、data corruption 或 page leak。引用时只把 ODRP correctness discussion; Figure 6 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** ODRP correctness discussion; Figure 6.

- Proof object: cards - invariants: one page one owner; TT update atomic; free queue consistency; no MNode CPU; fault handles unmapped

#### 方法 4: Security Boundary

**Claim:** ODRP 只解决性能/利用率，不解决 remote memory trust。

- 不证明 MNode 不会读写数据。
- 不提供 link encryption 或 attestation。
- Confidential storage/memory 需要 Hazel/SPDM/TEE-I/O 类机制叠加。

**讲解稿:** 讲解时先把本页结论落到一句话: ODRP 只解决性能/利用率，不解决 remote memory trust。第一步解释为什么需要这一页: 不证明 MNode 不会读写数据。第二步说明论文或规范实际做了什么: 不提供 link encryption 或 attestation。第三步收束到证据边界: Confidential storage/memory 需要 Hazel/SPDM/TEE-I/O 类机制叠加。引用时只把 ODRP threat/scope; survey boundary 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** ODRP threat/scope; survey boundary.

- Proof object: cards - not covered: MNode confidentiality; RDMA link security; device attestation; freshness; tenant policy


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** 实验环境比较 one-sided static/dynamic、two-sided、Fastswap 等 baselines。

- 评估指标: remote memory utilization、MNode CPU usage、execution time/throughput、swap throughput、CNode scaling。
- 工作负载: Redis/VoltDB 等 memory-disaggregation workloads。
- 证据边界: 支撑 remote paging performance，不支撑 confidential trust。

**讲解稿:** 讲解时先把本页结论落到一句话: 实验环境比较 one-sided static/dynamic、two-sided、Fastswap 等 baselines。第一步解释为什么需要这一页: 评估指标: remote memory utilization、MNode CPU usage、execution time/throughput、swap throughput、CNode scaling。第二步说明论文或规范实际做了什么: 工作负载: Redis/VoltDB 等 memory-disaggregation workloads。第三步收束到证据边界: 证据边界: 支撑 remote paging performance，不支撑 confidential trust。引用时只把 ODRP Section 5; Figure 7-Figure 9 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** ODRP Section 5; Figure 7-Figure 9.

- Proof object: matrix - 实验设置: Baselines = static/dynamic/two-sided/Fastswap; Metrics = utilization/CPU/performance; Granularity = 4KB pages; Offload = RDMA WR chains; Boundary = performance only


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能结论: ODRP 用少量性能开销换取远端内存利用率和 MNode CPU 的大幅改善。

- Abstract/Figure 7: remote memory utilization 提升 1.72x-12x。
- MNode CPU usage 为 0，避免 two-sided 方法 86%-99% CPU usage。
- 性能 overhead 约 0.8%-14.6%，部分 throughput 场景 overhead 约 14.2%。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能结论: ODRP 用少量性能开销换取远端内存利用率和 MNode CPU 的大幅改善。第一步解释为什么需要这一页: Abstract/Figure 7: remote memory utilization 提升 1.72x-12x。第二步说明论文或规范实际做了什么: MNode CPU usage 为 0，避免 two-sided 方法 86%-99% CPU usage。第三步收束到证据边界: 性能 overhead 约 0.8%-14.6%，部分 throughput 场景 overhead 约 14.2%。引用时只把 ODRP abstract; Figure 7; Figure 9 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** ODRP abstract; Figure 7; Figure 9.

- Proof object: bars - key numbers: utilization gain 1.72x-12x; MNode CPU 0; overhead low end 0.8%; overhead high end 14.6%


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: ODRP 是 RDMA disaggregated memory 的强系统 SOTA，但它把安全问题留给上层。

- 优势: 利用 programmable RDMA，三难取舍清楚，实验指标直接。
- 局限: 不处理 confidentiality/integrity/freshness，也不证明 remote endpoint trust。
- 商业化潜力: 远端内存池和 cloud paging；机密计算必须结合加密、attestation 和 policy。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: ODRP 是 RDMA disaggregated memory 的强系统 SOTA，但它把安全问题留给上层。第一步解释为什么需要这一页: 优势: 利用 programmable RDMA，三难取舍清楚，实验指标直接。第二步说明论文或规范实际做了什么: 局限: 不处理 confidentiality/integrity/freshness，也不证明 remote endpoint trust。第三步收束到证据边界: 商业化潜力: 远端内存池和 cloud paging；机密计算必须结合加密、attestation 和 policy。引用时只把 ODRP conclusion; README boundary 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** ODRP conclusion; README boundary.

- Proof object: matrix - 评价: 优势 = high utilization without MNode CPU; 局限 = not secure memory; 商业化 = remote paging; 本方向角色 = RDMA paging SOTA


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
