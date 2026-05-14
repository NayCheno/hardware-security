# NanoZone: Scalable, Efficient, and Secure Memory Protection for Arm CCA

- BibTeX key: `liu2025nanozone`
- Category: `arm-confidential-computing`
- Authors: Shiqi Liu et al.
- Year: 2025
- Source: https://arxiv.org/abs/2506.07034
- PDF source: https://arxiv.org/pdf/2506.07034
- Local PDF: `paper.pdf`
- Download status: downloaded and verified

- Evidence role: Draft/not ratified. Use with explicit draft, preprint, or not-ratified status; do not treat as ratified standard, mature production evidence, or peer-reviewed consensus unless the source metadata says so.
<!-- BEGIN PAPER REVIEW -->
## Paper Review
Canonical BibTeX key: `liu2025nanozone`. Evidence role: Draft/not ratified. Use with explicit draft, preprint, or not-ratified status; do not treat as ratified standard, mature production evidence, or peer-reviewed consensus unless the source metadata says so.

This README records the source/PDF availability above and should be treated as the local evidence-status record for NanoZone: Scalable, Efficient, and Secure Memory Protection for Arm CCA. When citing this reference in the survey正文, keep the claim within the stated evidence role and cite stronger primary or official sources for mechanism details outside this source's scope.
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `04-arm-cca-deployment` - Arm CCA 细粒度隔离与部署模型
- Paper key: `liu2025nanozone`
- Role: fine-grained memory protection SOTA
- Evidence base: NanoZone local PDF p.1-p.17; Figure 1 comparison; Figure 2 domain switching; Figure 3 POE/PIE overlay; Table 1.
- Boundary: arXiv/preprint；机制与性能需等待 peer review，不能当作标准或商用产品证据。

### 1. 完整题目 / 作者 / 会议

- 完整题目: NanoZone: Scalable and Efficient Secure Memory Protection for Arm CCA
- 作者: Shiqi Liu et al.
- 会议/来源: arXiv preprint, 2025
- Title evidence: NanoZone title page and README metadata.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** NanoZone 的贡献是解决 CCA CVM 内部的更细粒度问题: 一个进程或服务内部的不同数据域也需要隔离。

- 动机: CCA 保护整个 CVM，RContainer/Shelter 仍难阻止同一进程内的 bug 泄露 session key。
- 工作: 利用 POE、PIE、PAS 和 root-world monitor 构建进程内多 domain memory protection。
- 数据: 论文报告 POE domain switch 约 20 cycles，domain-switch latency 约为 privileged switches 的 4.87%，Nginx 约 22.67% overhead，但相对无隔离 baseline 额外开销约 4.40%。

**讲解稿:** 讲解时先把本页结论落到一句话: NanoZone 的贡献是解决 CCA CVM 内部的更细粒度问题: 一个进程或服务内部的不同数据域也需要隔离。第一步解释为什么需要这一页: 动机: CCA 保护整个 CVM，RContainer/Shelter 仍难阻止同一进程内的 bug 泄露 session key。第二步说明论文或规范实际做了什么: 工作: 利用 POE、PIE、PAS 和 root-world monitor 构建进程内多 domain memory protection。第三步收束到证据边界: 数据: 论文报告 POE domain switch 约 20 cycles，domain-switch latency 约为 privileged switches 的 4.87%，Nginx 约 22.67% overhead，但相对无隔离 baseline 额外开销约 4.40%。引用时只把 NanoZone p.1 abstract; Figure 1; Figure 2; Figure 3; p.1 reports 20% overhead/95% throughput and domain-switch numbers 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** NanoZone p.1 abstract; Figure 1; Figure 2; Figure 3; p.1 reports 20% overhead/95% throughput and domain-switch numbers.

- Proof object: flow - NanoZone 思路: CVM still too coarse -> split process memory into domains -> POE fast user switch -> PIE/PAS for stronger boundary -> root monitor prevents abuse -> case studies evaluate overhead


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景是 intra-VM/intra-process bug: 即使 VM 对 host 保密，VM 内部组件之间仍会互相伤害。

- Heartbleed 类漏洞说明进程内 private data 需要更细粒度隔离。
- 传统 MPK/PKU 类机制切换快，但难覆盖 kernel/OS adversary。
- CCA PAS/GPT 强但切换重，NanoZone 试图组合快路径和强路径。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景是 intra-VM/intra-process bug: 即使 VM 对 host 保密，VM 内部组件之间仍会互相伤害。第一步解释为什么需要这一页: Heartbleed 类漏洞说明进程内 private data 需要更细粒度隔离。第二步说明论文或规范实际做了什么: 传统 MPK/PKU 类机制切换快，但难覆盖 kernel/OS adversary。第三步收束到证据边界: CCA PAS/GPT 强但切换重，NanoZone 试图组合快路径和强路径。引用时只把 NanoZone p.1 introduction; Figure 1 comparison; Table 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** NanoZone p.1 introduction; Figure 1 comparison; Table 1.

- Proof object: matrix - 粒度对比: CVM = protects whole VM; Container/SApp = process or container boundary; MPK-like = fast but OS-sensitive; NanoZone = domain within process; 风险 = domain-switch abuse


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: 高安全边界和低切换开销不能只靠一种机制，NanoZone 用 POE 快速切换，用 PIE/PAS 兜底。

- POE 类似 protection key，适合用户态快速 domain switching。
- PIE/PAS 提供更强隔离但切换代价高。
- root-world monitoring 和 interrupt rerouting 防止 OS 篡改权限寄存器或滥用切换。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: 高安全边界和低切换开销不能只靠一种机制，NanoZone 用 POE 快速切换，用 PIE/PAS 兜底。第一步解释为什么需要这一页: POE 类似 protection key，适合用户态快速 domain switching。第二步说明论文或规范实际做了什么: PIE/PAS 提供更强隔离但切换代价高。第三步收束到证据边界: root-world monitoring 和 interrupt rerouting 防止 OS 篡改权限寄存器或滥用切换。引用时只把 NanoZone p.2-p.5 design; Figure 2 and Figure 3 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** NanoZone p.2-p.5 design; Figure 2 and Figure 3.

- Proof object: flow - fast + strong path: POE fast switch -> PIE permission indirection -> PAS boundary when needed -> root monitor validates -> interrupt rerouted -> domain abuse blocked


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: NanoZone 在 user-mode 提供 PIM/permission switch，在 root world 监控 page table 和权限状态。

- Figure 3 展示 permission indirection and overlay。
- PIM 由用户态专用指令写，减少陷入内核。
- Root-world module 监控 page table updates 和 interrupt control flow。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: NanoZone 在 user-mode 提供 PIM/permission switch，在 root world 监控 page table 和权限状态。第一步解释为什么需要这一页: Figure 3 展示 permission indirection and overlay。第二步说明论文或规范实际做了什么: PIM 由用户态专用指令写，减少陷入内核。第三步收束到证据边界: Root-world module 监控 page table updates 和 interrupt control flow。引用时只把 NanoZone Figure 3; design sections 4.x 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** NanoZone Figure 3; design sections 4.x.

- Proof object: matrix - NanoZone 组件: POE = fast user-level domain; PIE = permission indirection; PAS = CCA physical address space; PIM = permission index map; Root module = anti-abuse monitor


### 6. 核心方法拆解

#### 方法 1: POE Fast Domain Switching

**Claim:** NanoZone 把高频 domain switch 留在用户态，避免每次 trap/flush。

- 论文报告 POE domain switch 约 20 cycles。
- Figure 2 的 Memcached 场景显示 96.72% switch hit rate 在 POE domain 内。
- 这解释了为什么它适合 session key、per-client data 等高频访问隔离。

**讲解稿:** 讲解时先把本页结论落到一句话: NanoZone 把高频 domain switch 留在用户态，避免每次 trap/flush。第一步解释为什么需要这一页: 论文报告 POE domain switch 约 20 cycles。第二步说明论文或规范实际做了什么: Figure 2 的 Memcached 场景显示 96.72% switch hit rate 在 POE domain 内。第三步收束到证据边界: 这解释了为什么它适合 session key、per-client data 等高频访问隔离。引用时只把 NanoZone p.2-p.3; Figure 2; lines reporting ~20 cycles and 96.72% hit rate 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** NanoZone p.2-p.3; Figure 2; lines reporting ~20 cycles and 96.72% hit rate.

- Proof object: bars - fast path: POE switch ~20 cycles; POE hit rate 96.72%; privileged switch latency share 4.87%

#### 方法 2: PIE / PAS Strong Boundary

**Claim:** 当 POE 不够强时，NanoZone 用 PIE/PAS 组合把权限绑定到 CCA 更强的地址空间语义。

- PIE 提供 permission indirection，减少 domain 数量限制。
- PAS/GPT 提供 CCA 物理访问控制兜底。
- 代价是跨 PIE/PAS 的切换比 POE 慢，需要减少频率。

**讲解稿:** 讲解时先把本页结论落到一句话: 当 POE 不够强时，NanoZone 用 PIE/PAS 组合把权限绑定到 CCA 更强的地址空间语义。第一步解释为什么需要这一页: PIE 提供 permission indirection，减少 domain 数量限制。第二步说明论文或规范实际做了什么: PAS/GPT 提供 CCA 物理访问控制兜底。第三步收束到证据边界: 代价是跨 PIE/PAS 的切换比 POE 慢，需要减少频率。引用时只把 NanoZone Figure 3; p.2-p.5 POE/PIE/PAS design 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** NanoZone Figure 3; p.2-p.5 POE/PIE/PAS design.

- Proof object: matrix - 机制分工: POE = fast user switch; PIE = permission indirection; PAS = strong CCA boundary; Root monitor = prevents corruption; Policy = keep most switches in POE

#### 方法 3: Domain-Switch Abuse 防护

**Claim:** 如果攻击者能滥用切换指令，进程内隔离会失效；NanoZone 因此增加 root-world 监控。

- 监控 page table updates，防止 OS 改映射破坏域。
- 监控/重定向 interrupt control flow，保护权限状态。
- 限制 unauthorized domain switch，避免 attacker 进入不属于自己的 domain。

**讲解稿:** 讲解时先把本页结论落到一句话: 如果攻击者能滥用切换指令，进程内隔离会失效；NanoZone 因此增加 root-world 监控。第一步解释为什么需要这一页: 监控 page table updates，防止 OS 改映射破坏域。第二步说明论文或规范实际做了什么: 监控/重定向 interrupt control flow，保护权限状态。第三步收束到证据边界: 限制 unauthorized domain switch，避免 attacker 进入不属于自己的 domain。引用时只把 NanoZone security challenge discussion around domain-switching abuse 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** NanoZone security challenge discussion around domain-switching abuse.

- Proof object: flow - abuse defense: attacker tries switch -> permission state checked -> page table update monitored -> interrupt enters root path -> unauthorized access blocked -> domain state restored


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** NanoZone 的证据包括 emulator 功能版本和 Arm development board 性能 variant；但发表状态是 arXiv。

- 证据源: arXiv 2025 PDF，本地验证。
- 核心图表: Figure 1 比较、Figure 2 switching scenarios、Figure 3 POE/PIE overlay、Table 1。
- 评估对象: microbenchmarks、Nginx、Memcached、NVM protection 等 case studies。

**讲解稿:** 讲解时先把本页结论落到一句话: NanoZone 的证据包括 emulator 功能版本和 Arm development board 性能 variant；但发表状态是 arXiv。第一步解释为什么需要这一页: 证据源: arXiv 2025 PDF，本地验证。第二步说明论文或规范实际做了什么: 核心图表: Figure 1 比较、Figure 2 switching scenarios、Figure 3 POE/PIE overlay、Table 1。第三步收束到证据边界: 评估对象: microbenchmarks、Nginx、Memcached、NVM protection 等 case studies。引用时只把 NanoZone p.1-p.17; Figure 1-Figure 3; evaluation section 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** NanoZone p.1-p.17; Figure 1-Figure 3; evaluation section.

- Proof object: matrix - 实验/证据: 状态 = arXiv preprint; 平台 = emulator + Arm dev boards; micro = domain switch; apps = Nginx/Memcached/NVM; 边界 = needs peer review


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能页的谨慎读法: POE switch 很快，跨 PIE/PAS 仍重；真实应用开销与切换路径分布强相关。

- 论文报告 POE switch 约 20 cycles，domain-switch latency 约为 privileged switches 的 4.87%。
- Nginx experienced 22.67% overhead，但相对无隔离 baseline 的额外 overhead 约 4.40%。
- 摘要还报告保留 95% throughput / about 20% overhead，应标注 preprint evidence。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能页的谨慎读法: POE switch 很快，跨 PIE/PAS 仍重；真实应用开销与切换路径分布强相关。第一步解释为什么需要这一页: 论文报告 POE switch 约 20 cycles，domain-switch latency 约为 privileged switches 的 4.87%。第二步说明论文或规范实际做了什么: Nginx experienced 22.67% overhead，但相对无隔离 baseline 的额外 overhead 约 4.40%。第三步收束到证据边界: 摘要还报告保留 95% throughput / about 20% overhead，应标注 preprint evidence。引用时只把 NanoZone p.1 abstract; Figure 2; evaluation text reporting 20 cycles, 4.87%, 22.67%, 4.40%, 95% throughput 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** NanoZone p.1 abstract; Figure 2; evaluation text reporting 20 cycles, 4.87%, 22.67%, 4.40%, 95% throughput.

- Proof object: bars - NanoZone 关键数字: POE switch ~20 cycles; privileged switch share 4.87%; Nginx overhead 22.67%; extra vs baseline 4.40%; throughput retained 95%


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: NanoZone 是最细粒度的一篇，设计有启发性，但 preprint 状态和硬件依赖需要谨慎。

- 优势: 把 CCA、POE/PIE 和进程内隔离结合，抓住 domain-switch 成本核心。
- 局限: arXiv 状态；机制依赖新硬件/寄存器语义和 root-world monitor。
- 商业化潜力: 适合 confidential server 内 session key、tenant data、library sandbox；落地需要 compiler/runtime/OS 配合。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: NanoZone 是最细粒度的一篇，设计有启发性，但 preprint 状态和硬件依赖需要谨慎。第一步解释为什么需要这一页: 优势: 把 CCA、POE/PIE 和进程内隔离结合，抓住 domain-switch 成本核心。第二步说明论文或规范实际做了什么: 局限: arXiv 状态；机制依赖新硬件/寄存器语义和 root-world monitor。第三步收束到证据边界: 商业化潜力: 适合 confidential server 内 session key、tenant data、library sandbox；落地需要 compiler/runtime/OS 配合。引用时只把 NanoZone conclusion and README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** NanoZone conclusion and README evaluation.

- Proof object: matrix - 评价: 优势 = fine-grained isolation; 局限 = preprint + hardware dependency; 商业化 = per-session/per-library isolation; 本方向角色 = granularity frontier


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
