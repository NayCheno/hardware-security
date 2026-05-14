# Scalable Memory Protection in the Penglai Enclave

- BibTeX key: `feng2021penglai`
- Category: `risc-v-confidential-computing`
- Authors: Erhu Feng et al.
- Year: 2021
- Venue: 15th USENIX Symposium on Operating Systems Design and Implementation (OSDI 2021)
- Source: https://www.usenix.org/conference/osdi21/presentation/feng
- PDF source: https://www.usenix.org/system/files/osdi21-feng.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified

- Evidence role: Peer-reviewed SOTA. Use for the specific mechanism, evaluation, and threat-model scope established by the source; avoid broader claims outside its evidence class.

<!-- BEGIN PAPER REVIEW -->
## Paper Review
### 1. 论文基本信息

- 论文标题: Scalable Memory Protection in the Penglai Enclave
- 作者 / 机构: Erhu Feng et al.; Shanghai Jiao Tong University / Shanghai AI Laboratory
- 发表会议 / 年份: OSDI 2021
- 领域分类: 系统 / 架构 / 安全
- 一句话总结: Penglai 用软硬件协同解决 RISC-V enclave 的可扩展安全内存和快速初始化问题。
- 最核心贡献一句话: GPT 与 MMT 两个硬件原语把 RISC-V enclave 从小规模静态保护推进到大规模动态保护。

### 2. 研究问题与背景

论文关注 serverless/microservice 场景下 enclave 数量多、生命周期短、内存需求动态变化的问题。已有 SGX/TrustZone/早期 RISC-V enclave 受静态安全内存、容量限制和初始化成本约束。这个 gap 真实，PDF 第 2--3 页明确讨论 1,000s enclaves、512GB secure memory 和启动延迟。

### 3. 核心方法拆解

架构为: untrusted Linux -> enclave driver/lib -> secure monitor -> GPT/MMT hardware -> encrypted/integrity-protected memory。GPT 保护页表页以提供页级隔离；MMT 支持可挂载 Merkle tree；shadow enclave/fork-style creation 降低初始化延迟。

### 4. 安全性 / 正确性分析

威胁模型包括不可信 OS 与对 enclave 内存的访问/篡改。安全性依赖 monitor、GPT/MMT、内存加密和完整性树。侧信道不是主要解决目标，证据不足以覆盖 cache/controlled-channel 攻击。

### 5. 实现细节

实现基于 Penglai RISC-V enclave，修改 Rocket Core、memory controller、Linux kernel、secure monitor 和 SDK。PDF 第 3 页称 monitor 约 6,399 LoC，并在 FPGA、QEMU、Gem5 上实现。

### 6. 实验设计分析

论文用 RV8、CoreMark、Redis、MapReduce 和 serverless application 评估。核心结果: 支持 1,000s concurrent enclaves、512GB secure memory；CPU-intensive benchmark 开销可忽略，Redis 约 5% overhead；16MB enclave memory 下启动优化约三数量级；MapReduce shadow fork 约 3.6x speedup。

### 7. Novelty 分析

分类: potentially top-tier contribution。它不仅是 RISC-V enclave 工程实现，还提出面向大规模动态 enclave 的硬件内存保护机制。

### 8. 局限性与可能漏洞

局限包括硬件修改要求、侧信道未系统解决、商业 SoC 采用门槛高。MMT/GPT 与现有 RISC-V 标准化路径之间的关系需要谨慎表述，不应等同于 CoVE 标准。

### 9. 和已有工作的关系

Penglai 与 Keystone 同属 pre-CoVE RISC-V TEE lineage，但更强调 scalable memory protection。它也为后续 CoVE/AP-TEE 的 memory ownership 讨论提供设计背景。

### 10. 复现与再实现计划

最小复现目标是在 QEMU/Gem5 上跑 Penglai monitor、创建多 enclave 并测启动/Redis。验收标准是复现 GPT overhead、enclave count scaling 和 shadow fork speedup 趋势。

### 11. 对后续研究的启发

1. 将 GPT/MMT 映射到 CoVE memory tracking。2. 研究标准化 memory integrity primitive。3. 将 serverless lifecycle 与 attestation 绑定。4. 评估 side-channel hardening。5. 探索商业硬件成本和兼容性。
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `08-riscv-tee-lineage` - RISC-V TEE 谱系: Keystone / Penglai / SPEAR-V
- Paper key: `feng2021penglai`
- Role: peer-reviewed SOTA scalable RISC-V enclave system
- Evidence base: Penglai PDF Figure 1 architecture; Figure 2 GPT; Figure 3 MMU extension; Table 1 comparison; evaluation sections.
- Boundary: Penglai 需要硬件扩展；它仍是 enclave system，不是标准化 CoVE TVM。

### 1. 完整题目 / 作者 / 会议

- 完整题目: Scalable Memory Protection in the Penglai Enclave
- 作者: Erhu Feng et al.
- 会议/来源: OSDI 2021
- Title evidence: README metadata; OSDI 2021 PDF title page.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** Penglai 解决 Keystone/PMP 系路线的规模瓶颈: enclave 数量、secure memory 大小和启动延迟。

- 动机: serverless/microservice 场景需要很多短生命周期 enclave，固定 PMP region 与静态 secure memory 不够。
- 工作: 提出 Guarded Page Table、Mountable Merkle Tree、shadow enclave，并实现开源 RISC-V enclave system。
- 数据: 论文报告支持 thousands enclave、最高 512GB secure memory，CPU benchmark 低开销，memory-intensive benchmark 约 5% overhead。

**讲解稿:** 讲解时先把本页结论落到一句话: Penglai 解决 Keystone/PMP 系路线的规模瓶颈: enclave 数量、secure memory 大小和启动延迟。第一步解释为什么需要这一页: 动机: serverless/microservice 场景需要很多短生命周期 enclave，固定 PMP region 与静态 secure memory 不够。第二步说明论文或规范实际做了什么: 工作: 提出 Guarded Page Table、Mountable Merkle Tree、shadow enclave，并实现开源 RISC-V enclave system。第三步收束到证据边界: 数据: 论文报告支持 thousands enclave、最高 512GB secure memory，CPU benchmark 低开销，memory-intensive benchmark 约 5% overhead。引用时只把 Penglai abstract; Figure 1; Table 1; evaluation summary 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Penglai abstract; Figure 1; Table 1; evaluation summary.

- Proof object: flow - Penglai answer: serverless demand -> GPT page ownership -> MMT integrity scale -> shadow enclave fork -> many enclaves -> lower startup latency


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是 PMP 的“少量 region”模型不能自然支撑云原生 enclave。

- SGX-style EPC 有固定 protected memory 和初始化成本。
- PMP-based enclave 受寄存器数量和 contiguous memory 管理限制。
- serverless 函数需要快速创建、复用、销毁，microservice 需要大量并发隔离单元。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是 PMP 的“少量 region”模型不能自然支撑云原生 enclave。第一步解释为什么需要这一页: SGX-style EPC 有固定 protected memory 和初始化成本。第二步说明论文或规范实际做了什么: PMP-based enclave 受寄存器数量和 contiguous memory 管理限制。第三步收束到证据边界: serverless 函数需要快速创建、复用、销毁，microservice 需要大量并发隔离单元。引用时只把 Penglai Section 1-2; Table 1 comparison 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Penglai Section 1-2; Table 1 comparison.

- Proof object: matrix - 规模痛点: 数量 = thousands concurrent enclaves; 容量 = large secure memory; 粒度 = 4KB page ownership; 启动 = fast fork-like creation; 完整性 = scalable memory integrity


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: 不要在每次访问都做昂贵 ownership checking，把检查提前到 page-table mapping 和 secure-memory metadata。

- GPT 保护 host page table，确保 untrusted OS 不能把 secure page 映射给自己。
- MMT 用 mountable subtree 缩短 integrity checking 路径，支撑大 secure memory。
- Shadow enclave 把代码/数据 measurement 预处理，降低 serverless-style enclave 创建成本。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: 不要在每次访问都做昂贵 ownership checking，把检查提前到 page-table mapping 和 secure-memory metadata。第一步解释为什么需要这一页: GPT 保护 host page table，确保 untrusted OS 不能把 secure page 映射给自己。第二步说明论文或规范实际做了什么: MMT 用 mountable subtree 缩短 integrity checking 路径，支撑大 secure memory。第三步收束到证据边界: Shadow enclave 把代码/数据 measurement 预处理，降低 serverless-style enclave 创建成本。引用时只把 Penglai Section 4; Figure 2-Figure 4; Figure 11 startup evidence 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Penglai Section 4; Figure 2-Figure 4; Figure 11 startup evidence.

- Proof object: cards - 三件核心事: GPT: page ownership; MMT: scalable integrity; shadow enclave: fast fork; server enclave: service chain; cache-line locking: sensitive sections


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: monitor/driver/SDK 加硬件 GPT/MMT 扩展，组成一个可扩展 enclave OS。

- Figure 1 显示 host app、driver、monitor、enclave、inter-enclave communication 和 hardware extensions。
- Secure monitor 管理 enclave lifecycle 和硬件配置；host 仍负责普通资源管理。
- Penglai 把 HPT Area、enclave page table、MMT meta-zone 都纳入可信管理。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: monitor/driver/SDK 加硬件 GPT/MMT 扩展，组成一个可扩展 enclave OS。第一步解释为什么需要这一页: Figure 1 显示 host app、driver、monitor、enclave、inter-enclave communication 和 hardware extensions。第二步说明论文或规范实际做了什么: Secure monitor 管理 enclave lifecycle 和硬件配置；host 仍负责普通资源管理。第三步收束到证据边界: Penglai 把 HPT Area、enclave page table、MMT meta-zone 都纳入可信管理。引用时只把 Penglai Figure 1; Figure 2; Figure 3 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Penglai Figure 1; Figure 2; Figure 3.

- Proof object: matrix - 组件: Monitor = enclave lifecycle and hardware config; Driver/SDK = host-side API; GPT = page-table ownership check; MMT = integrity tree for secure memory; Shadow enclave = fast initialization


### 6. 核心方法拆解

#### 方法 1: Guarded Page Table

**Claim:** GPT 用硬件和 HPT Area 约束 host page table，让 page ownership 变成硬件可检查的属性。

- Host page table 必须位于受保护 HPT Area。
- MMU extension 检查 page-table entry 是否非法指向 secure page。
- 这样避免每次内存访问都查大型 metadata。

**讲解稿:** 讲解时先把本页结论落到一句话: GPT 用硬件和 HPT Area 约束 host page table，让 page ownership 变成硬件可检查的属性。第一步解释为什么需要这一页: Host page table 必须位于受保护 HPT Area。第二步说明论文或规范实际做了什么: MMU extension 检查 page-table entry 是否非法指向 secure page。第三步收束到证据边界: 这样避免每次内存访问都查大型 metadata。引用时只把 Penglai Figure 2; Figure 3; Section 4.1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Penglai Figure 2; Figure 3; Section 4.1.

- Proof object: flow - GPT check: host updates PTE -> PTE must be in HPT Area -> MMU checks target page -> secure page blocked -> enclave page table controlled by monitor

#### 方法 2: Mountable Merkle Tree

**Claim:** MMT 让 secure memory integrity 随容量扩展，而不是让树节点吞掉 cache 和 bandwidth。

- SubTree 可 mount/unmount，缩短热点 secure memory 的验证路径。
- 根和关键 metadata 留在 SoC/monitor 控制范围。
- 论文目标是支持最高 512GB secure memory。

**讲解稿:** 讲解时先把本页结论落到一句话: MMT 让 secure memory integrity 随容量扩展，而不是让树节点吞掉 cache 和 bandwidth。第一步解释为什么需要这一页: SubTree 可 mount/unmount，缩短热点 secure memory 的验证路径。第二步说明论文或规范实际做了什么: 根和关键 metadata 留在 SoC/monitor 控制范围。第三步收束到证据边界: 论文目标是支持最高 512GB secure memory。引用时只把 Penglai Section 4.2; MMT design figures; abstract 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Penglai Section 4.2; MMT design figures; abstract.

- Proof object: matrix - MMT 设计: 问题 = large tree verification overhead; 结构 = mountable SubTree; 可信根 = SoC root / monitor; 容量目标 = up to 512GB; 收益 = lower integrity overhead

#### 方法 3: Shadow Enclave Fast Startup

**Claim:** Shadow enclave 把 serverless 场景的重复初始化变成 fork-style creation。

- Shadow enclave 不直接运行，只保存可复用 code/data template。
- 测量可提前计算并密封，fork 时避免重复高成本 attestation/initialization。
- 论文报告 16MB enclave creation 可提升三个数量级。

**讲解稿:** 讲解时先把本页结论落到一句话: Shadow enclave 把 serverless 场景的重复初始化变成 fork-style creation。第一步解释为什么需要这一页: Shadow enclave 不直接运行，只保存可复用 code/data template。第二步说明论文或规范实际做了什么: 测量可提前计算并密封，fork 时避免重复高成本 attestation/initialization。第三步收束到证据边界: 论文报告 16MB enclave creation 可提升三个数量级。引用时只把 Penglai Section 4.3; Figure 11 startup evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Penglai Section 4.3; Figure 11 startup evaluation.

- Proof object: flow - shadow fork: create shadow template -> precompute measurement -> seal manifest -> fork new enclave -> dynamic memory add -> run function

#### 方法 4: Server Enclave / IPC

**Claim:** Penglai 还把 enclave 组织成服务链，缓解所有功能都信任 host OS 的问题。

- Server enclave 可处理文件系统等服务，降低 Iago attack 风险。
- Relay page 支持 host-enclave 与 enclave-enclave communication。
- 这让 enclave 更接近 microservice 组合，而不是单个安全进程。

**讲解稿:** 讲解时先把本页结论落到一句话: Penglai 还把 enclave 组织成服务链，缓解所有功能都信任 host OS 的问题。第一步解释为什么需要这一页: Server enclave 可处理文件系统等服务，降低 Iago attack 风险。第二步说明论文或规范实际做了什么: Relay page 支持 host-enclave 与 enclave-enclave communication。第三步收束到证据边界: 这让 enclave 更接近 microservice 组合，而不是单个安全进程。引用时只把 Penglai Section 5.2 software implementation and IPC figures 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Penglai Section 5.2 software implementation and IPC figures.

- Proof object: cards - runtime model: server enclave; relay page; H-E IPC; E-E IPC; asynchronous calls


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** 实验环境覆盖硬件扩展原型、Linux 修改和 serverless/microservice workloads。

- 实现: 修改 RISC-V core/MMU/SoC 相关路径，增加 GPT/MMT engine，monitor、driver、SDK 和 libraries。
- 工作负载: CPU-intensive benchmark、Redis 等 memory-intensive benchmark、MapReduce 和 serverless application。
- 证据边界: 评估证明可扩展 enclave prototype，不证明标准化 AP-TEE/CoVE 兼容性。

**讲解稿:** 讲解时先把本页结论落到一句话: 实验环境覆盖硬件扩展原型、Linux 修改和 serverless/microservice workloads。第一步解释为什么需要这一页: 实现: 修改 RISC-V core/MMU/SoC 相关路径，增加 GPT/MMT engine，monitor、driver、SDK 和 libraries。第二步说明论文或规范实际做了什么: 工作负载: CPU-intensive benchmark、Redis 等 memory-intensive benchmark、MapReduce 和 serverless application。第三步收束到证据边界: 证据边界: 评估证明可扩展 enclave prototype，不证明标准化 AP-TEE/CoVE 兼容性。引用时只把 Penglai implementation and evaluation sections; Figure 1; Table 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Penglai implementation and evaluation sections; Figure 1; Table 1.

- Proof object: matrix - 实验覆盖: CPU benchmarks = RV8/CoreMark-like; Memory workloads = Redis; Scalability = thousands enclaves; Capacity = up to 512GB secure memory; Startup = shadow enclave fork


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能结论: Penglai 的 selling point 是“规模提升而开销仍可接受”。

- 论文摘要报告 memory-intensive benchmark 约 5% overhead。
- GPT overhead 对 memory mapping 路径更敏感，对普通 CPU benchmark 较小。
- Shadow enclave 把 16MB secure memory 初始化延迟提升三个数量级。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能结论: Penglai 的 selling point 是“规模提升而开销仍可接受”。第一步解释为什么需要这一页: 论文摘要报告 memory-intensive benchmark 约 5% overhead。第二步说明论文或规范实际做了什么: GPT overhead 对 memory mapping 路径更敏感，对普通 CPU benchmark 较小。第三步收束到证据边界: Shadow enclave 把 16MB secure memory 初始化延迟提升三个数量级。引用时只把 Penglai abstract; evaluation sections; Figure 11 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Penglai abstract; evaluation sections; Figure 11.

- Proof object: bars - key numbers: secure memory capacity 512GB; concurrent enclaves 1000s; memory benchmark overhead ~5%; startup improvement 1000x class


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: Penglai 是 RISC-V enclave 规模化的强 SOTA，但商业化依赖硬件扩展被采纳。

- 优势: 直接解决 PMP region、secure memory capacity 和 startup latency。
- 局限: 硬件改动较大；与后续 CoVE TVM 标准不是同一抽象层。
- 商业化潜力: serverless enclave、edge cloud、云原生微隔离；风险在 ISA/SoC 标准化和生态支持。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: Penglai 是 RISC-V enclave 规模化的强 SOTA，但商业化依赖硬件扩展被采纳。第一步解释为什么需要这一页: 优势: 直接解决 PMP region、secure memory capacity 和 startup latency。第二步说明论文或规范实际做了什么: 局限: 硬件改动较大；与后续 CoVE TVM 标准不是同一抽象层。第三步收束到证据边界: 商业化潜力: serverless enclave、edge cloud、云原生微隔离；风险在 ISA/SoC 标准化和生态支持。引用时只把 Penglai conclusion and README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Penglai conclusion and README evaluation.

- Proof object: matrix - 评价: 优势 = scalable enclave memory; 局限 = hardware extension adoption; 商业化 = serverless enclaves; 本方向角色 = scalability SOTA


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
