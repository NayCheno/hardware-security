# SoK: Understanding Design Choices and Pitfalls of Trusted Execution Environments

- BibTeX key: `li2024sokteechoices`
- Category: `trusted-execution-environments/sok`
- Authors: Mengyuan Li; Yuheng Yang; Guoxing Chen; Mengjia Yan; Yinqian Zhang
- Year: 2024
- Venue: ACM Asia Conference on Computer and Communications Security (ASIA CCS 2024)
- Source: https://doi.org/10.1145/3634737.3644993
- PDF source: https://people.csail.mit.edu/mengyuanli/files/asiaccs_sok.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Evidence role: Main taxonomy anchor for `01-tee-taxonomy`. Use for server-side TEE runtime design choices, lifecycle, management modes, and pitfall taxonomy. Do not use it as direct proof of any platform mechanism or performance result.

## Citation Triage

| Priority | Cited work | Role in SoK | Repo category | Local status | Next action |
|---|---|---|---|---|---|
| P0 | Sanctum | RISC-V/open hardware enclave baseline | `reference/risc-v-confidential-computing/sanctum-minimal-hardware-extensions-strong-software-isolation/` | added, local PDF available | Review and map against Keystone/Penglai/CoVE lineage. |
| P0 | CURE | Customizable RISC-V enclave and peripheral-binding baseline | `reference/risc-v-confidential-computing/cure-customizable-resilient-enclaves/` | added, local PDF available | Review for I/O and accelerator TEE discussion. |
| P1 | MI6 | Speculative out-of-order RISC-V enclave baseline | `reference/risc-v-confidential-computing/mi6-secure-enclaves-speculative-out-of-order-processor/` | added, local PDF available | Review when expanding side-channel/speculation limits. |
| P1 | Keystone / Penglai | Existing RISC-V enclave lineage | `reference/risc-v-confidential-computing/` | existing, local PDFs available | Already covered as lineage anchors. |
| P2 | Intel TDX / IBM PEF | Out-of-scope platform comparison | not added | metadata only | Add later only if x86/IBM confidential VM comparison becomes in-scope. |

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 1. 论文基本信息

- 论文标题: SoK: Understanding Design Choices and Pitfalls of Trusted Execution Environments
- 作者 / 机构: Mengyuan Li, Yuheng Yang, Guoxing Chen, Mengjia Yan, Yinqian Zhang / MIT, Shanghai Jiao Tong University, Southern University of Science and Technology
- 发表会议 / 年份: ASIA CCS 2024
- 领域分类: 系统 / 安全 / 架构
- 一句话总结: 论文提出 TRAF，把 server-side TEE 从“SGX/SEV/TDX/CCA/Keystone 等产品名列表”拆成 remote attestation、runtime resource management、TCB/host 分工和 design pitfall。
- 最核心贡献一句话: 它给 01 taxonomy 提供主 SOTA 框架: 用四种 runtime management mode 解释不同 TEE 为什么在 CPU、memory、I/O、attestation 上做出不同安全/性能/TCB 权衡。

### 2. 研究问题与背景

论文要解决的问题是: cloud TEE 一方面要保护 cloud customer 的 data-in-use，另一方面又必须让不可信 host OS/hypervisor 继续管理 CPU、memory、I/O 等云资源。PDF p.1 摘要和 p.2 Introduction 明确把问题写成: host OS 原本完全控制资源，TEE 设计要重新划分 host OS 与 TCB 的职责，否则非本领域读者只能看到 SGX、SEV、TDX、CCA、PEF、Keystone、Sanctum、CURE、Penglai 等名称，难以理解设计选择背后的共性。

论文的背景知识可以压缩成四个概念:

1. Secure Remote Execution (SRE): 远程用户希望在不可信云平台上执行敏感 workload，并得到 secure measurement、confidentiality、integrity 三类保证。论文在 p.2 Section 2.1 给出这三个安全属性。
2. Threat model: 论文 p.3 Section 2.2 假设 adversary 控制整套软件栈，可以执行 privileged instructions、launch/pause/destroy TEE instance、管理 non-TEE world 的 memory mapping、I/O devices 和 CPU scheduling；商业 TEE 通常排除 DoS 和 microarchitectural side-channel。
3. TCB split: 论文 p.3 把 TCB 分成 Manufacturer TCB 与 ISV TCB。Manufacturer TCB 包含硬件、microcode、firmware、security monitor、quoting/provisioning enclave 等平台提供组件；ISV TCB 是 enclave/CVM 里面的应用或 OS。
4. TEE lifecycle: 论文 Figure 2/p.3 把生命周期抽象为 remote attestation 与 runtime management。前者证明初始状态可信；后者决定运行时资源如何由 host、RTPM 和 TEE instance 协同管理。

这个 gap 真实存在。Figure 5/p.7 把多种 TEE 的 CPU scheduling、context switch、interrupt/instruction emulation、virtual memory、memory allocation、page fault、I/O data transmission、I/O operations 映射到统一表格，说明不同平台确实可以用相同维度比较，而不是只按产品名分段描述。

### 3. 核心方法拆解

方法名: TEE Runtime Architectural Framework (TRAF)。

分析管线:

`TEE lifecycle -> runtime event/task -> 谁管理资源 -> 四种 management mode -> security/TCB/performance implication -> known pitfall/attack`

TRAF 先把 TEE runtime 里的资源事件拆成三组，依据是 Figure 3/p.5:

| 资源组 | 代表事件 | 读者应该理解的含义 |
|---|---|---|
| CPU management | CPU scheduling, context switch, interrupt/instruction emulation | 谁决定 enclave/CVM 什么时候运行、寄存器如何保存、虚拟化事件如何模拟 |
| Memory management | virtual address space, memory allocation, page fault, page table, protected/shared memory | 谁拥有地址空间、物理页、页表和 fault handling 的最终控制权 |
| I/O management | I/O data transmission, I/O operations, shared memory, I/O devices | 敏感数据离开 CPU/TEE 边界后由谁保护，是否需要 trusted I/O |

TRAF 的核心是四种 mode，依据是 Figure 4/p.5:

| Mode | 谁在管 | 直观解释 | 典型收益 | 典型风险 |
|---|---|---|---|---|
| Unprotected | untrusted privileged software | host 直接管理资源 | 性能好、云平台可调度 | host 可观察/操控资源，攻击面最大 |
| RTPM-only | Runtime Protection Module | TCB 完全接管资源管理 | 安全边界最清楚 | TCB 变大，复杂任务代价高 |
| RTPM-guarded | host 配置，RTPM 校验 | host 做资源管理，TCB 做安全检查 | 平衡 TCB 与可管理性 | corner case 校验遗漏会形成漏洞 |
| Instance-assisted | TEE instance 自己参与管理 | enclave/CVM runtime 直接管理部分资源 | 灵活，可减少 host 观察面 | 恶意 instance 或复杂 runtime 可能扩大 TCB/DoS 风险 |

关键设计选择:

- CPU scheduling 通常是 unprotected mode，因为 CSP 需要调度资源，放进 RTPM 会显著增加 TCB 和性能开销。依据 p.6 Section 4.3.1。
- Context switch 通常采用 RTPM-only mode，以保护寄存器和微架构状态；AMD SEV 早期例外，后续 SEV-ES/SEV-SNP 转向更强保护。依据 p.6 Section 4.3.2。
- Page fault 和 memory allocation 体现多种 mode 的分歧: RTPM-guarded 可降低 TCB，但 page fault 可被 host 用于 controlled-channel；RTPM-only 更强但复杂；instance-assisted 可让 Keystone/CURE runtime 参与页表管理。依据 p.7-p.8 Section 4.4。
- I/O 多数仍是 unprotected mode，通过 application-layer encryption 保护数据；trusted I/O 需要设备侧可信逻辑、PCIe IDE、SR-IOV 等额外机制。依据 p.8 Section 4.5。
- Pitfall 分析用 Table 1/p.9 与 Appendix Table 2 把 known attacks 回扣到 design flaw: 未保护寄存器、TLB misuse、unauthenticated encryption、unprotected NPT 等问题常来自 unprotected 或 RTPM-guarded corner case。

工程实现 vs 研究贡献:

- 工程实现: 论文没有实现新 TEE，也没有发布新 prototype。
- 研究贡献: 提供可复用 taxonomy、mode-based analysis 和 vulnerability/pitfall mapping。它适合拿来组织本仓库的 01 方向 PPT，但具体机制仍必须回到 Arm CCA、RISC-V AP-TEE、CoVE-IO、SEV-SNP、TDX 等原文或规范。

### 4. 安全性 / 正确性分析

Threat model 清晰。论文 p.3 Section 2.2 明确 adversary 可控制 privileged software、管理内存/I/O/调度、可 launch/pause/destroy TEE instance；物理攻击是否纳入取决于具体 TEE；DoS 与 microarchitectural side-channel 多数商业 TEE 排除。

防御边界:

- 论文不声称 TRAF 本身防御攻击；它是解释设计选择和漏洞来源的框架。
- Table 1/p.9 的 vulnerable design flaws 说明，许多 SEV/SEV-ES/SNP 相关攻击可归因于 context switch、instruction emulation、memory allocation 等资源管理 mode 的弱保护。
- Appendix Table 2 列 attack catalog，但论文也说明 side-channel、hardware flaw、speculative execution 等攻击类型不属于 runtime design flaw 的主线讨论。

可能的 overclaim:

- 如果只引用该 SoK 就说某个平台“安全”或“性能好”，证据不足。它只能支撑 taxonomy、design-choice framing、pitfall explanation。
- 它的主要 scope 是 hardware-based server-side TEEs in general-purpose processors。论文 p.2-p.3 明确排除没有 SRE 的 TrustZone、纯软件 TEE、software extensions of TEEs、embedded TEEs。因此不能用它覆盖全部 mobile/embedded TrustZone 或 accelerator TEE。

### 5. 实现细节

- Code size: 无新代码。
- Language: 论文未说明。
- Modified components: 无实现；分析对象包括 SoC/hardware RoT、RTPM、host OS/hypervisor、TEE instance runtime、I/O devices。
- Platform dependencies: 公开论文和规范材料；商业平台细节受 closed-source 限制。
- Artifact availability: 论文 PDF 可公开获取；无代码 artifact。
- Reproducibility difficulty: 中等。复现不是跑实验，而是复建 Figure 5 的 TEE/mode 矩阵，并把新材料如 CoVE-IO、AP-TEE、TDISP、RME-DA、accelerator TEE 映射进去。
- Hardest implementation part: 若要把 TRAF 变成工具或 checklist，难点是对每个平台找出 host、RTPM、instance 三者对每个 runtime event 的真实职责边界。

### 6. 实验设计分析

这是一篇 SoK，无新系统实验。实验环境、benchmark、throughput/latency 数据均不适用。论文的证据对象是系统化整理:

- Figure 1/p.1-p.2: traditional cloud 与 cloud with TEE 的 trust relationship 对比。
- Figure 2/p.3: generalized TEE lifecycle。
- Figure 3/p.5: CPU/memory/I/O common events。
- Figure 4/p.5: four modes for runtime management。
- Figure 5/p.7: representative TEEs 的 mode choice matrix。
- Table 1/p.9: vulnerable design flaws。
- Appendix Table 2: existing attacks catalog。

评价问题:

- TRAF 是否能解释不同 TEE 的 design choices? Figure 5 支撑较强。
- TRAF 是否能解释 known design flaws? Table 1 与 Section 5.2/5.3 支撑较强，但只覆盖论文选择的 case study。
- 是否能替代原始机制论文或规范? 不能。它没有新实验和 formal proof。

### 7. Novelty 分析

分类: `strong research novelty`。

理由: 普通 SoK 常按平台或攻击类型横向列举，TRAF 则把 cloud TEE 的核心矛盾抽象为 resource management delegation。这个抽象能解释为什么 CPU scheduling 放给 host、context switch 放给 RTPM、page fault 处于灰区、I/O 仍大量依赖 unprotected path。对 survey/report-slide 来说，它比单纯的产品年表更有解释力。

### 8. 局限性与可能漏洞

- Scope 限制: 不覆盖 embedded TEE、TrustZone mobile/IoT 主线、纯软件 TEE、accelerator/device TEE 的完整设计空间。论文 p.2-p.3 已说明这些边界。
- 时间截面: 2024 之后的 AP-TEE、CoVE-IO、TDISP/IDE、Arm CCA device assignment、accelerator TEE 材料需要本仓库额外补齐。
- 证据来源限制: 商业 TEE 多为 closed-source，TCB size、firmware behavior、corner-case implementation 很难独立验证。
- 实验缺口: 无新实验，无法说明某个 mode 的真实 performance overhead。
- 安全边界: 论文明确把大量 microarchitectural side-channel 作为商业 TEE 常见排除项，不能把这篇 SoK 当作 side-channel 防御综述。

### 9. 和已有工作的关系

与 `schneider2022soktee` 相比，本文更聚焦 server-side TEE runtime design choices 与 pitfall，而不是更广义的 hardware-supported TEE taxonomy。与 RISC-V/accelerator 专项 SoK 相比，本文是上位框架: 它解释“host/TCB/instance 如何分工”，而 RISC-V survey 和 accelerator SoK 解释某个子生态里具体出现了哪些系统和设计约束。

在 01 PPT 中的定位:

- 主 SOTA: 建立总 taxonomy 和读者可理解的解释框架。
- 支撑方向: 硬件辅助 TEE 总体设计空间、server-side confidential computing、runtime lifecycle、TCB/resource-management tradeoff。
- 辅助材料: `boubakri2025riscvtee` 补 RISC-V 谱系；`sok-tee` 补 accelerator/device TEE 谱系。

### 10. 复现与再实现计划

最小复现目标:

1. 以 Figure 3 的 CPU/memory/I/O events 为列。
2. 以 Figure 4 的四种 management modes 为取值。
3. 对每个平台填入 host、RTPM/TSM/RMM、TEE instance 的职责。
4. 标出依据来源: 原始论文、官方规范、SoK，或者 `论文未说明`。

Required environment:

- 本地 PDF: `paper.pdf`。
- 原始平台材料: Arm CCA/RME/RMM、SEV-SNP、TDX、Keystone、Penglai、CURE、CoVE/AP-TEE、CoVE-IO。
- 输出: 一张可维护的 taxonomy matrix 和一份 reviewer checklist。

Acceptance criteria:

- 任意一个 TEE 小节都能回答: 谁管理 CPU scheduling? 谁保存 context? 谁维护 page table? 谁验证 memory ownership? I/O 是否离开 protected path? attestation 报告覆盖哪些初始状态?
- 对 SoK 无法直接证明的机制，必须回引原始论文或规范。

### 11. 对后续研究的启发

1. TRAF for trusted I/O: 把 CoVE-IO、TDISP、PCIe IDE、SPDM、device assignment 加入 runtime event/mode matrix。
2. TRAF for accelerator TEE: 把 GPU/NPU/DPU/SmartNIC 的 queue、device memory、firmware、scheduler、driver TCB 映射为 host/RTPM/device/instance 分工。
3. Mode-aware verifier policy: remote attestation 不只验证初始镜像，还要表达 resource-management mode 和 excluded attacks。
4. Corner-case audit checklist: 对每个 RTPM-guarded mode 检查 host 可否通过 present bit、interrupt injection、I/O emulation、shared memory 影响 secret-dependent behavior。
5. Cross-architecture comparison: 用同一矩阵对比 Arm CCA RMM、RISC-V TSM/AP-TEE、AMD SVSM、Intel TDX module。
6. Commercial readiness study: 对比 cloud vendor 公开文档中哪些 runtime events 已可 attested，哪些仍是 policy/implementation assumption。

### 12. SOTA README Addendum

- SOTA 定位: Academic SOTA / SoK taxonomy anchor
- 标准化 / 发表状态: peer-reviewed ASIA CCS 2024
- 对应小方向: `01-tee-taxonomy` / 硬件辅助 TEE 总体设计空间

#### 内容摘要

本文的核心不是提出一个新 TEE，而是提出一套读懂 TEE 的方法。它从 remote attestation 与 runtime management 两段生命周期出发，把 CPU、memory、I/O 中常见资源管理任务映射到四种 mode: unprotected、RTPM-only、RTPM-guarded、instance-assisted。这样，读者不需要先记住所有产品名，也能理解为什么 TEE 设计总是在“让 host 管资源”和“让 TCB 保安全”之间取舍。

#### 研究背景

Confidential computing 的基本矛盾是: 云平台必须继续调度和复用资源，但用户又不信任云平台的 privileged software。论文 p.2-p.3 说明，host 可以管理 CPU scheduling、memory mapping、I/O devices，甚至 launch/pause/destroy TEE instance；因此 TEE 的安全性并不只来自“有加密内存”，还来自每个 runtime event 的管理权是否被正确限制。

#### 解决方案

TRAF 用 Figure 3 的 CPU/memory/I/O event 分类和 Figure 4 的四种 mode 组织设计空间。它特别有用的地方是把安全问题落到具体资源: CPU scheduling 通常不能放进 TCB；context switch 通常必须强保护；page fault 和 memory allocation 是最容易出现 guarded-mode corner case 的区域；I/O 往往仍是 unprotected path，需要额外 trusted I/O、application encryption 或 device-side trust。

#### 实验结果

SoK，无新实验。证据来自 Figure 1-Figure 5、Table 1、Appendix Table 2 以及平台论文/规范/攻击案例。性能页只能写“mode choice 对性能/TCB 有定性影响”，不能写某个平台的 overhead 数字，除非回到该平台原始论文或规范。

#### 文章评价

优点: taxonomy 解释力强，适合作为 01 的主线；能把 SGX/SEV/TDX/CCA/RISC-V enclave 放进同一资源管理语言。局限: 范围偏 server-side general-purpose CPU TEE，不能覆盖 accelerator/device TEE，也不能替代原始机制证据。商业化潜力: 可转化为架构评审 checklist、attestation policy checklist 和 cloud TEE 产品对比表，但落地时必须补充 vendor/spec 级证据。

### 13. SoK Citation Expansion

| Priority | Cited work | Role in SoK | Repo category | Local status | Next action |
|---|---|---|---|---|---|
| P0 | Sanctum | RISC-V/open-hardware enclave baseline | `reference/risc-v-confidential-computing/sanctum-minimal-hardware-extensions-strong-software-isolation/` | existing, local PDF available | Use original paper for mechanism claims. |
| P0 | Keystone | RISC-V open enclave framework | `reference/risc-v-confidential-computing/keystone-open-framework-architecting-tees/` | existing, Review available | Use as RISC-V baseline. |
| P0 | CURE | Customizable RISC-V enclave | `reference/risc-v-confidential-computing/cure-customizable-resilient-enclaves/` | existing, local PDF available | Use for peripheral-binding and multi-level enclave comparison. |
| P1 | MI6 | Speculative OoO enclave | `reference/risc-v-confidential-computing/mi6-secure-enclaves-speculative-out-of-order-processor/` | existing, local PDF available | Use only for speculation/side-channel boundary. |
| P1 | TIMBER-V | Embedded tagged-memory enclave | `reference/risc-v-confidential-computing/timber-v-tag-isolated-memory-fine-grained-enclaves-risc-v/` | added, Review available | Use as embedded lineage branch. |
| P1 | Cerberus | Formal enclave memory sharing | `reference/risc-v-confidential-computing/cerberus-formal-approach-secure-efficient-enclave-memory-sharing/` | added, Review available | Use for memory-sharing comparison. |
| P2 | Intel TDX / AMD SEV / IBM PEF | Cross-platform comparison | partially in Bib/reference | backlog | Add only when x86/IBM comparison enters正文. |
<!-- END PAPER REVIEW -->
