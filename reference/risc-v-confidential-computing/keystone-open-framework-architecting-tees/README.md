# Keystone: An Open Framework for Architecting Trusted Execution Environments

- BibTeX key: `lee2020keystone`
- Category: `risc-v-confidential-computing`
- Authors: Dayeol Lee, David Kohlbrenner, Shweta Shinde, Krste Asanovic, and Dawn Song
- Year: 2020
- Venue: EuroSys '20, article 38, 16 pages
- Source: https://doi.org/10.1145/3342195.3387532
- PDF source: https://www.shwetashinde.org/publications/keystone_eurosys20.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified from the author-hosted EuroSys 2020 PDF on 2026-05-12

- Evidence role: Foundational. Use as a foundational entry point for this survey lane; later SOTA, specification, or implementation details should be cited separately when making narrow claims.

<!-- BEGIN PAPER REVIEW -->
## Paper Review
### 1. 论文基本信息

- 论文标题: Keystone: An Open Framework for Architecting Trusted Execution Environments
- 作者 / 机构: Dayeol Lee, David Kohlbrenner, Shweta Shinde, Krste Asanovic, and Dawn Song; UC Berkeley
- 发表会议 / 年份: EuroSys 2020
- 领域分类: 系统 / 安全 / 架构
- 一句话总结: Keystone 是面向 RISC-V 的开源 TEE 架构框架，强调可定制 TCB 和可复用 TEE primitive。
- 最核心贡献一句话: 它是 RISC-V TEE lineage 的基础文献，为 Penglai、SPEAR-V 和 CoVE 提供开放研究平台背景。

### 2. 研究问题与背景

论文针对 vendor-specific TEE trade-off 固化、难以按应用定制的问题。这个问题在 SGX/SEV/TrustZone 中真实存在，尤其体现在 TCB、secure I/O、内存模型和移植成本上。

### 3. 核心方法拆解

架构为: RISC-V hardware isolation -> programmable security monitor -> enclave runtime -> application。Keystone 把硬件隔离和 monitor 插件化，提供 enclave 创建、测量、attestation、runtime abstraction，并允许不同 deployment modes。

### 4. 安全性 / 正确性分析

威胁模型强调不可信 OS，依赖 RISC-V PMP 和 security monitor。论文展示 memory encryption、cache side-channel defense 等可选扩展，但不声称解决所有微架构侧信道。安全强度取决于具体实例化。

### 5. 实现细节

实现运行于 HiFive Unleashed 与 Rocket/BOOM/FireSim 等平台。PDF 第 2 页称 Keystone 增量 SM 约 1.6 KLoC，总 TCB 约 12--15 KLoC。实现意义在于开放框架，而非单一最终产品。

### 6. 实验设计分析

论文评估 CoreMark、Beebs、RV8、IOZone 和 real-world ML/secure remote computation。PDF 第 2 页摘要称 CoreMark/Beebs/RV8 开销小于 1%，IOZone 可达 40%，Torch on Eyrie 约 7.35%，FANN with seL4 约 0.36%。评估说明 CPU workload 负担小，I/O 与系统调用路径仍是挑战。

### 7. Novelty 分析

分类: strong research novelty。新意在于开放、可定制、面向 RISC-V 的 TEE 架构框架，使研究者能探索不同 TCB/feature trade-off。

### 8. 局限性与可能漏洞

Keystone 更像研究框架，商业落地需要标准化硬件、成熟 SDK、I/O/side-channel 防护和供应链 attestation。PMP 区域数量、动态内存和大规模云 workload 是后续工作重点。

### 9. 和已有工作的关系

Keystone 继承 Sanctum 的开放硬件隔离思想，也为 Penglai 的 scalable memory protection 和 SPEAR-V 的新硬件 primitive 提供对照。

### 10. 复现与再实现计划

最小复现目标是在 QEMU/HiFive 跑 Keystone demo，测 enclave creation、attestation、CoreMark 和 IOZone。验收标准是复现低 CPU overhead 与 I/O 开销趋势。

### 11. 对后续研究的启发

1. 把 Keystone 作为 RISC-V TEE baseline。2. 对比 PMP-based enclave 与 CoVE TVM。3. 建立 I/O path benchmark。4. 研究可插拔 side-channel defense。5. 评估开源 TEE 的供应链可信根。

### 12. SOTA README Addendum

- SOTA 定位: 基础/历史入口
- 标准化 / 发表状态: EuroSys 2020 peer-reviewed conference paper
- 对应小方向: RISC-V TEE lineage: Sanctum/Keystone/CURE/MI6/Penglai/SPEAR-V

#### 内容摘要

Keystone 是 RISC-V enclave/TEE lineage 的基础开放框架，用 EuroSys 2020 正式论文而非早期预印本作为本仓库主证据。

#### 研究背景

论文针对封闭 TEE 设计难以定制 TCB、runtime 和 threat model 的问题，提供一个可在 RISC-V 平台上复用和修改的开放研究框架。

#### 解决方案

Keystone 使用 RISC-V 硬件隔离、可编程 security monitor、enclave runtime 和 attestation 抽象，把 TEE primitive 组合成可定制框架。

#### 实验结果

EuroSys 论文提供原型评估；本 README 中的具体数值来自已验证 EuroSys PDF，而不是二手 survey。

#### 文章评价

优点是开放、可定制、可复现实验价值高；不足是它仍依赖 monitor 正确性、PMP 限制和额外 I/O/side-channel 防护。商业落地潜力主要在 RISC-V TEE SDK 和研究平台，不应写成 CoVE/AP-TEE 级 confidential VM 标准。
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `08-riscv-tee-lineage` - RISC-V TEE 谱系: Keystone / Penglai / SPEAR-V
- Paper key: `lee2020keystone`
- Role: foundational open RISC-V TEE framework
- Evidence base: Keystone PDF Figure 1-Figure 6; Table 1 SBI; Table 2 hardware platforms; Table 3 TCB breakdown.
- Boundary: Keystone 是 enclave framework，不是 confidential VM 标准；I/O、侧信道和 paging policy 由 runtime/扩展决定。

### 1. 完整题目 / 作者 / 会议

- 完整题目: Keystone: An Open Framework for Architecting Trusted Execution Environments
- 作者: Dayeol Lee, David Kohlbrenner, Shweta Shinde, Krste Asanovic, Dawn Song
- 会议/来源: EuroSys 2020
- Title evidence: README metadata; Keystone EuroSys 2020 PDF title page.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** Keystone 的核心贡献是让研究者能自己选择 TCB 与功能，而不是被固定商用 TEE 设计点锁死。

- 动机: SGX/TrustZone 等商用 TEE 功能固定，难适配不同 threat model 和资源管理需求。
- 工作: 提出 common security monitor + per-enclave runtime 的开源框架，用 PMP 做硬件隔离。
- 数据: 论文实现 SM、Eyrie/seL4 runtime，并在 CoreMark、Beebs、RV8、IOZone 等 benchmark 上评估。

**讲解稿:** 讲解时先把本页结论落到一句话: Keystone 的核心贡献是让研究者能自己选择 TCB 与功能，而不是被固定商用 TEE 设计点锁死。第一步解释为什么需要这一页: 动机: SGX/TrustZone 等商用 TEE 功能固定，难适配不同 threat model 和资源管理需求。第二步说明论文或规范实际做了什么: 工作: 提出 common security monitor + per-enclave runtime 的开源框架，用 PMP 做硬件隔离。第三步收束到证据边界: 数据: 论文实现 SM、Eyrie/seL4 runtime，并在 CoreMark、Beebs、RV8、IOZone 等 benchmark 上评估。引用时只把 Keystone abstract; Figure 1 system; Section 7 evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Keystone abstract; Figure 1 system; Section 7 evaluation.

- Proof object: flow - Keystone story: untrusted OS -> M-mode SM -> PMP region -> runtime in enclave -> eapp -> attestation to verifier


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是“一个 TEE 不可能同时适合所有场景”。

- 有的应用要最小 TCB，有的要 syscalls，有的要 secure I/O，有的要 cache partition 或 memory encryption。
- 传统 TEE 把很多策略固定在平台里，研究者很难替换 monitor、runtime 或内存管理。
- RISC-V 提供开放硬件接口，Keystone 把这种开放性变成 TEE framework。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是“一个 TEE 不可能同时适合所有场景”。第一步解释为什么需要这一页: 有的应用要最小 TCB，有的要 syscalls，有的要 secure I/O，有的要 cache partition 或 memory encryption。第二步说明论文或规范实际做了什么: 传统 TEE 把很多策略固定在平台里，研究者很难替换 monitor、runtime 或内存管理。第三步收束到证据边界: RISC-V 提供开放硬件接口，Keystone 把这种开放性变成 TEE framework。引用时只把 Keystone Section 2; Figure 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Keystone Section 2; Figure 1.

- Proof object: matrix - 需求冲突: 最小 TCB = 少功能、少代码; 兼容性 = 需要 runtime/syscall support; 资源管理 = paging/resize/I/O tradeoff; 安全扩展 = cache partition, sealed storage, timers; Keystone = framework lets choices vary


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: 让 SM 只做不可替代的隔离与生命周期，把可变策略交给 enclave runtime。

- SM 在 M-mode 运行，负责 PMP、enclave measurement、entry/exit、destroy/cleaning。
- Runtime 在 enclave 内运行，负责 page table、syscall proxy、SDK、policy modules。
- 这种拆分降低固定 TCB，也让不同 enclave 可以选择不同安全/性能 tradeoff。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: 让 SM 只做不可替代的隔离与生命周期，把可变策略交给 enclave runtime。第一步解释为什么需要这一页: SM 在 M-mode 运行，负责 PMP、enclave measurement、entry/exit、destroy/cleaning。第二步说明论文或规范实际做了什么: Runtime 在 enclave 内运行，负责 page table、syscall proxy、SDK、policy modules。第三步收束到证据边界: 这种拆分降低固定 TCB，也让不同 enclave 可以选择不同安全/性能 tradeoff。引用时只把 Keystone Figure 2 end-to-end overview; Table 1 SBI; Figure 3 PMP 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Keystone Figure 2 end-to-end overview; Table 1 SBI; Figure 3 PMP.

- Proof object: cards - SM vs Runtime: SM: isolate and measure; SM: expose SBI; RT: manage memory; RT: proxy syscalls; eapp: workload logic


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: Keystone 把 untrusted host、security monitor、runtime、eapp 和 remote verifier 串成一个生命周期。

- Host OS 负责资源分配和启动请求，但不能读写受 PMP 保护的 enclave memory。
- SM 建立 measurement 并配置 PMP；remote verifier 用 SM/enclave measurement 决定是否信任。
- Eyrie runtime 让普通应用获得 libc、syscall proxy 和可选模块。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: Keystone 把 untrusted host、security monitor、runtime、eapp 和 remote verifier 串成一个生命周期。第一步解释为什么需要这一页: Host OS 负责资源分配和启动请求，但不能读写受 PMP 保护的 enclave memory。第二步说明论文或规范实际做了什么: SM 建立 measurement 并配置 PMP；remote verifier 用 SM/enclave measurement 决定是否信任。第三步收束到证据边界: Eyrie runtime 让普通应用获得 libc、syscall proxy 和可选模块。引用时只把 Keystone Figure 1; Figure 2; Table 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Keystone Figure 1; Figure 2; Table 1.

- Proof object: matrix - 架构对象: Host OS = resource manager, untrusted; SM = M-mode reference monitor; PMP = physical memory access control; RT/Eyrie = enclave-side policy; Verifier = checks measurement and platform


### 6. 核心方法拆解

#### 方法 1: Security Monitor + PMP

**Claim:** Keystone 的隔离基础是 SM 动态配置 PMP，把 enclave memory 从 host OS 中切走。

- Enclave 创建时，SM 检查/测量 host 准备的内存。
- Enclave 运行时，PMP 允许 enclave 访问自己的 region，阻止 host/user 访问。
- 销毁时，SM 清理内存并释放 PMP entry。

**讲解稿:** 讲解时先把本页结论落到一句话: Keystone 的隔离基础是 SM 动态配置 PMP，把 enclave memory 从 host OS 中切走。第一步解释为什么需要这一页: Enclave 创建时，SM 检查/测量 host 准备的内存。第二步说明论文或规范实际做了什么: Enclave 运行时，PMP 允许 enclave 访问自己的 region，阻止 host/user 访问。第三步收束到证据边界: 销毁时，SM 清理内存并释放 PMP entry。引用时只把 Keystone Figure 3; Table 1 create/run/resume/destroy 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Keystone Figure 3; Table 1 create/run/resume/destroy.

- Proof object: flow - PMP lifecycle: create request -> measure pages -> configure PMP -> enter enclave -> trap to SM -> clean and destroy

#### 方法 2: Runtime Abstraction

**Claim:** Runtime 把“要不要 page table、syscall、SDK、cache policy”变成 enclave-specific 选择。

- Eyrie 提供 native runtime；论文也演示 seL4 runtime。
- Syscall proxy 和 edge call 让 enclave 与 untrusted host 交互。
- 代价是 runtime 进入 enclave TCB，功能越多 TCB 越大。

**讲解稿:** 讲解时先把本页结论落到一句话: Runtime 把“要不要 page table、syscall、SDK、cache policy”变成 enclave-specific 选择。第一步解释为什么需要这一页: Eyrie 提供 native runtime；论文也演示 seL4 runtime。第二步说明论文或规范实际做了什么: Syscall proxy 和 edge call 让 enclave 与 untrusted host 交互。第三步收束到证据边界: 代价是 runtime 进入 enclave TCB，功能越多 TCB 越大。引用时只把 Keystone Section 5; Table 3 TCB breakdown 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Keystone Section 5; Table 3 TCB breakdown.

- Proof object: matrix - runtime choices: Eyrie = small native RT; seL4 = microkernel RT; syscall proxy = compatibility; paging module = flexible memory; TCB cost = feature-dependent

#### 方法 3: Attestation End-to-End

**Claim:** Keystone 不只隔离内存，还把 platform、SM 和 enclave measurement 交给远端 verifier。

- 平台提供 RoT/boot measurement。
- SM hash 和 enclave hash 进入 attestation report。
- Verifier 依据 known SM/enclave measurement 决定是否提供 secret。

**讲解稿:** 讲解时先把本页结论落到一句话: Keystone 不只隔离内存，还把 platform、SM 和 enclave measurement 交给远端 verifier。第一步解释为什么需要这一页: 平台提供 RoT/boot measurement。第二步说明论文或规范实际做了什么: SM hash 和 enclave hash 进入 attestation report。第三步收束到证据边界: Verifier 依据 known SM/enclave measurement 决定是否提供 secret。引用时只把 Keystone Figure 2; Section 4.5 attestation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Keystone Figure 2; Section 4.5 attestation.

- Proof object: flow - attestation: platform RoT -> measure SM -> measure enclave pages -> sign report -> remote verifier -> secret release

#### 方法 4: Feature Modules / Tradeoffs

**Claim:** Keystone 的价值在于把 cache partition、on-chip memory、self-paging、memory encryption 作为可选模块展示。

- Figure 5 比较不同 memory model。
- 可选模块能增强威胁模型，但也增加实现复杂度和开销。
- 这为后续 Penglai/SPEAR-V 的专门化设计提供基线。

**讲解稿:** 讲解时先把本页结论落到一句话: Keystone 的价值在于把 cache partition、on-chip memory、self-paging、memory encryption 作为可选模块展示。第一步解释为什么需要这一页: Figure 5 比较不同 memory model。第二步说明论文或规范实际做了什么: 可选模块能增强威胁模型，但也增加实现复杂度和开销。第三步收束到证据边界: 这为后续 Penglai/SPEAR-V 的专门化设计提供基线。引用时只把 Keystone Figure 5 memory model; Section 4.6 platform extensions 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Keystone Figure 5 memory model; Section 4.6 platform extensions.

- Proof object: cards - 可选防护: cache partition; on-chip scratchpad; self-paging; software encryption; sealed storage/timer


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** 实验环境是真实 RISC-V 板卡和开源核模拟组合，目标是验证 framework 可实现和开销范围。

- 硬件: HiFive Freedom Unleashed FU540，以及 Rocket/BOOM 等开源 RISC-V 处理器设置。
- 软件: buildroot Linux 4.15、SM、Eyrie runtime、Linux driver、seL4 port。
- 评估: CoreMark、Beebs、RV8、IOZone、Torch/FANN、lifecycle operations 和 TCB LoC。

**讲解稿:** 讲解时先把本页结论落到一句话: 实验环境是真实 RISC-V 板卡和开源核模拟组合，目标是验证 framework 可实现和开销范围。第一步解释为什么需要这一页: 硬件: HiFive Freedom Unleashed FU540，以及 Rocket/BOOM 等开源 RISC-V 处理器设置。第二步说明论文或规范实际做了什么: 软件: buildroot Linux 4.15、SM、Eyrie runtime、Linux driver、seL4 port。第三步收束到证据边界: 评估: CoreMark、Beebs、RV8、IOZone、Torch/FANN、lifecycle operations 和 TCB LoC。引用时只把 Keystone Section 7.1; Table 2 hardware; Table 3 LoC 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Keystone Section 7.1; Table 2 hardware; Table 3 LoC.

- Proof object: matrix - 实验对象: Platform = FU540 + open RISC-V cores; OS = buildroot Linux 4.15; Runtime = Eyrie / seL4; Benchmarks = CoreMark, Beebs, RV8, IOZone; TCB = SM plus selected RT modules


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能结论: 基础 CPU benchmark 开销小，I/O 和功能模块开销更明显。

- 论文摘要报告 CoreMark/Beebs/RV8 低开销，IOZone 可到约 40%。
- Figure 6 拆分 enclave lifecycle，create/destroy 受 memory cleaning/attestation 等影响。
- 关键不是某个数字，而是 framework 让用户显式选择安全功能与开销。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能结论: 基础 CPU benchmark 开销小，I/O 和功能模块开销更明显。第一步解释为什么需要这一页: 论文摘要报告 CoreMark/Beebs/RV8 低开销，IOZone 可到约 40%。第二步说明论文或规范实际做了什么: Figure 6 拆分 enclave lifecycle，create/destroy 受 memory cleaning/attestation 等影响。第三步收束到证据边界: 关键不是某个数字，而是 framework 让用户显式选择安全功能与开销。引用时只把 Keystone abstract; Figure 6 lifecycle; Section 7 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Keystone abstract; Figure 6 lifecycle; Section 7.

- Proof object: bars - reported evidence: CoreMark/Beebs/RV8 low; IOZone up to ~40%; SM added code ~1.6 KLoC; max eapp TCB ~15 KLoC


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: Keystone 是 RISC-V TEE 的基础 SOTA，因为它给出了可复用、可修改、可评估的开源起点。

- 优势: framework 结构清楚，SM/RT 分工明确，适合研究新硬件 primitive。
- 局限: PMP 数量和物理 region 管理限制明显；secure I/O、侧信道和大规模 enclave 不是默认解决。
- 商业化潜力: 适合教学、原型和定制设备；量产需要硬件供应商、toolchain、认证和长期维护。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: Keystone 是 RISC-V TEE 的基础 SOTA，因为它给出了可复用、可修改、可评估的开源起点。第一步解释为什么需要这一页: 优势: framework 结构清楚，SM/RT 分工明确，适合研究新硬件 primitive。第二步说明论文或规范实际做了什么: 局限: PMP 数量和物理 region 管理限制明显；secure I/O、侧信道和大规模 enclave 不是默认解决。第三步收束到证据边界: 商业化潜力: 适合教学、原型和定制设备；量产需要硬件供应商、toolchain、认证和长期维护。引用时只把 Keystone discussion and README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** Keystone discussion and README evaluation.

- Proof object: matrix - 评价: 优势 = open and customizable; 局限 = not scalable CVM; 商业化 = prototype / edge; 本方向角色 = baseline framework


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
