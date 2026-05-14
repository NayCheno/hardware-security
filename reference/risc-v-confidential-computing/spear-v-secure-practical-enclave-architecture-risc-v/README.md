# SPEAR-V: Secure and Practical Enclave Architecture for RISC-V

- BibTeX key: `schrammel2023spearv`
- Category: `risc-v-confidential-computing`
- Authors: David Schrammel et al.
- Year: 2023
- Venue: ACM Asia Conference on Computer and Communications Security (ASIA CCS 2023)
- Source: https://doi.org/10.1145/3579856.3590264
- PDF source: https://tugraz.elsevierpure.com/ws/portalfiles/portal/58764488/spearv.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified

- Evidence role: Peer-reviewed SOTA. Use for the specific mechanism, evaluation, and threat-model scope established by the source; avoid broader claims outside its evidence class.

<!-- BEGIN PAPER REVIEW -->
## Paper Review
### 1. 论文基本信息

- 论文标题: SPEAR-V: Secure and Practical Enclave Architecture for RISC-V
- 作者 / 机构: David Schrammel et al.; Graz University of Technology
- 发表会议 / 年份: ASIA CCS 2023
- 领域分类: 架构 / 安全 / 系统
- 一句话总结: SPEAR-V 用单一硬件 primitive 支持 RISC-V enclave 的双向 sandbox、共享内存和嵌套。
- 最核心贡献一句话: 它代表 pre-CoVE RISC-V enclave 方向的 Peer-reviewed SOTA 之一，重点是低开销、灵活和 controlled-channel mitigation。

### 2. 研究问题与背景

论文指出现有 enclave 架构要么性能差、要么受限于固定物理内存范围、要么易受 controlled-channel 攻击。现代云应用需要灵活内存、共享内存和嵌套能力。

### 3. 核心方法拆解

方法是 memory-tagging-like single hardware primitive，用 tag/metadata 支持 enclave 与 host 双向隔离。架构允许共享内存和任意嵌套，避免为每个功能堆叠多个硬件机制。

### 4. 安全性 / 正确性分析

威胁模型覆盖不可信 host/OS，并关注 controlled-channel 攻击缓解。完整安全性仍依赖硬件 tag 正确实现、monitor/runtime 和 tag 管理策略。物理攻击与所有微架构侧信道不是完全解决。

### 5. 实现细节

论文实现了原型并评估硬件修改和软件开销。具体商业可用性取决于 RISC-V CPU 厂商是否愿意采用该 primitive，标准化状态不如 AP-TEE/CoVE。

### 6. 实验设计分析

PDF 第 1 页摘要称 unprotected applications 零 overhead，protected applications 平均约 1% overhead，并用 LMbench/Embench 等评估。结果支撑“低开销 enclave primitive”的主张，但跨真实云 workload 的长期验证不足。

### 7. Novelty 分析

分类: strong research novelty。新意是以一个统一硬件机制支持双向隔离、共享内存和嵌套。

### 8. 局限性与可能漏洞

局限在于需要非标准硬件扩展，生态采用不确定。若 tag metadata 不能贯穿 DMA/I/O/fabric，整体 confidential boundary 仍不完整。

### 9. 和已有工作的关系

SPEAR-V 与 Keystone/Penglai 同属 RISC-V enclave lineage；相比 Keystone 更偏硬件 primitive，和 Penglai 的 scalable memory protection 互补。与 CoVE 的 confidential VM 目标不同，但机制思想可借鉴。

### 10. 复现与再实现计划

最小复现目标是基于 artifact 或模拟器实现 tag check，运行 LMbench/Embench，对比 protected/unprotected overhead。验收标准是复现低开销趋势和嵌套/共享内存语义。

### 11. 对后续研究的启发

1. 与 RISC-V memory tagging draft 对照。2. 验证 DMA/IOMMU 场景。3. 和 CoVE memory tracking 比较。4. 加入 attestation evidence。5. 研究云平台采用门槛。
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `08-riscv-tee-lineage` - RISC-V TEE 谱系: Keystone / Penglai / SPEAR-V
- Paper key: `schrammel2023spearv`
- Role: peer-reviewed SOTA lightweight tag-based RISC-V enclave primitive
- Evidence base: SPEAR-V PDF Figure 1 design overview; Figure 2 HPCE; Figure 3 TLB tag fields; Figure 4 tagged translation; evaluation sections.
- Boundary: SPEAR-V 是研究型硬件扩展；不等同于 ratified RISC-V TEE standard。

### 1. 完整题目 / 作者 / 会议

- 完整题目: SPEAR-V: Secure and Practical Enclave Architecture for RISC-V
- 作者: David Schrammel et al.
- 会议/来源: ACM Asia Conference on Computer and Communications Security (ASIA CCS 2023)
- Title evidence: README metadata; ASIA CCS 2023 PDF title page.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** SPEAR-V 的核心贡献是把 enclave ownership 变成 page tag，而不是只靠 PMP region 或复制 page table。

- 动机: 现有 enclave 方案常有性能开销、controlled-channel/page-table attack 风险和不灵活的内存边界。
- 工作: 提出 tag store、immutable page table、TLB/PTW extension、SM enclave API。
- 数据: 摘要报告 unprotected application 零开销，protected application 平均约 1% overhead。

**讲解稿:** 讲解时先把本页结论落到一句话: SPEAR-V 的核心贡献是把 enclave ownership 变成 page tag，而不是只靠 PMP region 或复制 page table。第一步解释为什么需要这一页: 动机: 现有 enclave 方案常有性能开销、controlled-channel/page-table attack 风险和不灵活的内存边界。第二步说明论文或规范实际做了什么: 工作: 提出 tag store、immutable page table、TLB/PTW extension、SM enclave API。第三步收束到证据边界: 数据: 摘要报告 unprotected application 零开销，protected application 平均约 1% overhead。引用时只把 SPEAR-V abstract; Figure 1; Figure 3; evaluation summary 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SPEAR-V abstract; Figure 1; Figure 3; evaluation summary.

- Proof object: flow - SPEAR-V idea: DRAM pages -> tag store -> PTW checks tags -> immutable page tables -> SM owns API -> nested sandbox


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是 page table 自身会成为攻击面: OS 可通过 remap、unmap、fault pattern 观察或操纵 enclave。

- 如果 page table 由 untrusted OS 管理，enclave 需要额外防御 alias/remapping。
- 如果复制或移动 page table 到安全区，性能和软件复杂度会上升。
- SPEAR-V 选择给 page 和 page table 加 tag，让硬件翻译路径直接检查合法性。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是 page table 自身会成为攻击面: OS 可通过 remap、unmap、fault pattern 观察或操纵 enclave。第一步解释为什么需要这一页: 如果 page table 由 untrusted OS 管理，enclave 需要额外防御 alias/remapping。第二步说明论文或规范实际做了什么: 如果复制或移动 page table 到安全区，性能和软件复杂度会上升。第三步收束到证据边界: SPEAR-V 选择给 page 和 page table 加 tag，让硬件翻译路径直接检查合法性。引用时只把 SPEAR-V introduction; Figure 1; controlled-channel discussion 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SPEAR-V introduction; Figure 1; controlled-channel discussion.

- Proof object: matrix - page-table 风险: Remapping = same page mapped differently; Unmapping = controlled-channel faults; Duplication = software overhead; PMP only = coarse region; Tagging = page-granular policy


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: 标记 page table 为 immutable 后，OS 可以继续管理普通页表，但不能偷偷改 enclave mapping。

- Tag store 记录 owner/ID、page type、immutable bit、page level 等字段。
- PTW/TLB 在地址翻译时带着 tag 检查访问权限。
- 嵌套 enclave 和双向 sandbox 来自“谁拥有这页、谁能访问这页”的统一语义。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: 标记 page table 为 immutable 后，OS 可以继续管理普通页表，但不能偷偷改 enclave mapping。第一步解释为什么需要这一页: Tag store 记录 owner/ID、page type、immutable bit、page level 等字段。第二步说明论文或规范实际做了什么: PTW/TLB 在地址翻译时带着 tag 检查访问权限。第三步收束到证据边界: 嵌套 enclave 和双向 sandbox 来自“谁拥有这页、谁能访问这页”的统一语义。引用时只把 SPEAR-V Figure 1; Figure 3; Section 5 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SPEAR-V Figure 1; Figure 3; Section 5.

- Proof object: cards - tag semantics: owner / enclave ID; immutable page table; page type; shared key; page level


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: tag store 在 DRAM 中，SM 在 M-mode 中管理 tag，PTW/TLB 在硬件路径检查 tag。

- Figure 1 显示 DRAM tag store、page tables、application、SM 和 M-mode 关系。
- Figure 3 显示 tag fields 如何进入 TLB entry。
- SM 提供 E_CREATE、E_ADD/E_REMOVE、E_ENTER/E_EXIT、SHARE/REVOKE 等 API。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: tag store 在 DRAM 中，SM 在 M-mode 中管理 tag，PTW/TLB 在硬件路径检查 tag。第一步解释为什么需要这一页: Figure 1 显示 DRAM tag store、page tables、application、SM 和 M-mode 关系。第二步说明论文或规范实际做了什么: Figure 3 显示 tag fields 如何进入 TLB entry。第三步收束到证据边界: SM 提供 E_CREATE、E_ADD/E_REMOVE、E_ENTER/E_EXIT、SHARE/REVOKE 等 API。引用时只把 SPEAR-V Figure 1; Figure 3; Section 5.5 SM API 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SPEAR-V Figure 1; Figure 3; Section 5.5 SM API.

- Proof object: matrix - 架构对象: Tag store = per-page metadata; PTW/TLB = enforces tags; SM = M-mode tag manager; Immutable PT = prevents remap attack; Shared memory key = controlled sharing


### 6. 核心方法拆解

#### 方法 1: Page-Granular Tag Store

**Claim:** Tag store 把“这页属于谁”放到硬件可查的 metadata 中。

- 每 4KiB page 可有 owner/ID 和 page type。
- Tag store 自身由 SM/PMP/tag self-protection 保护。
- 非 taggable memory 可跳过 tag fetch，降低普通程序开销。

**讲解稿:** 讲解时先把本页结论落到一句话: Tag store 把“这页属于谁”放到硬件可查的 metadata 中。第一步解释为什么需要这一页: 每 4KiB page 可有 owner/ID 和 page type。第二步说明论文或规范实际做了什么: Tag store 自身由 SM/PMP/tag self-protection 保护。第三步收束到证据边界: 非 taggable memory 可跳过 tag fetch，降低普通程序开销。引用时只把 SPEAR-V Figure 1; Section 5.1-5.3 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SPEAR-V Figure 1; Section 5.1-5.3.

- Proof object: flow - tag lookup: virtual address -> PTW walks page table -> fetch page-table tags -> fetch leaf-page tag -> permission check -> TLB caches subset

#### 方法 2: Immutable Page Tables

**Claim:** Immutable bit 是 SPEAR-V 对抗 page-table attack 的关键点。

- SM 在加入 enclave page 时验证 mapping，并把相关 page table 标记 immutable。
- 写 immutable page table 会 trap 到 SM。
- 这阻止 OS 通过 PTE 修改制造 alias/remap。

**讲解稿:** 讲解时先把本页结论落到一句话: Immutable bit 是 SPEAR-V 对抗 page-table attack 的关键点。第一步解释为什么需要这一页: SM 在加入 enclave page 时验证 mapping，并把相关 page table 标记 immutable。第二步说明论文或规范实际做了什么: 写 immutable page table 会 trap 到 SM。第三步收束到证据边界: 这阻止 OS 通过 PTE 修改制造 alias/remap。引用时只把 SPEAR-V Figure 2; Section 5.4 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SPEAR-V Figure 2; Section 5.4.

- Proof object: matrix - immutable PT: Before = OS can edit PTE; SM validation = unique mapping check; After = PT tagged immutable; Violation = trap to SM; Benefit = remap/fault attack harder

#### 方法 3: Nested / Two-Way Sandboxing

**Claim:** SPEAR-V 不只保护 enclave 免受 host 攻击，也能让 enclave 内部再隔离子区域。

- Nested enclave page 与 parent enclave page 走同一 tag/owner 规则。
- 父 enclave 不能直接读子 enclave 私有页。
- 这种双向 sandbox 对 plugin、library、JIT 或不可信组件很有用。

**讲解稿:** 讲解时先把本页结论落到一句话: SPEAR-V 不只保护 enclave 免受 host 攻击，也能让 enclave 内部再隔离子区域。第一步解释为什么需要这一页: Nested enclave page 与 parent enclave page 走同一 tag/owner 规则。第二步说明论文或规范实际做了什么: 父 enclave 不能直接读子 enclave 私有页。第三步收束到证据边界: 这种双向 sandbox 对 plugin、library、JIT 或不可信组件很有用。引用时只把 SPEAR-V abstract; Section 5 nested enclave discussion 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SPEAR-V abstract; Section 5 nested enclave discussion.

- Proof object: cards - sandbox directions: host -> enclave blocked; enclave -> host controlled; parent -> child blocked; shared pages explicit; syscalls via host app

#### 方法 4: SM API and Lifecycle

**Claim:** SM API 把 tag 写入和 page ownership change 收敛到可信路径。

- E_CREATE/E_DESTROY 管 enclave 生命周期。
- E_ADD/E_REMOVE 管 enclave page ownership。
- E_SHARE/E_REVOKE 管 shared memory key。

**讲解稿:** 讲解时先把本页结论落到一句话: SM API 把 tag 写入和 page ownership change 收敛到可信路径。第一步解释为什么需要这一页: E_CREATE/E_DESTROY 管 enclave 生命周期。第二步说明论文或规范实际做了什么: E_ADD/E_REMOVE 管 enclave page ownership。第三步收束到证据边界: E_SHARE/E_REVOKE 管 shared memory key。引用时只把 SPEAR-V Section 5.5 API 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SPEAR-V Section 5.5 API.

- Proof object: flow - API lifecycle: E_CREATE -> E_ADD pages -> tag page tables -> E_ENTER -> SHARE/REVOKE -> E_DESTROY


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** 实验环境是研究原型和模拟/硬件评估，重点验证 tag 扩展开销与面积/性能 tradeoff。

- 论文评估 unprotected 与 protected application 的开销。
- 评估还探索 0/32/64/128-bit tags 等设计点和 TLB/PTW 影响。
- 证据边界: 证明 SPEAR-V 原型可行，不代表供应商量产采用。

**讲解稿:** 讲解时先把本页结论落到一句话: 实验环境是研究原型和模拟/硬件评估，重点验证 tag 扩展开销与面积/性能 tradeoff。第一步解释为什么需要这一页: 论文评估 unprotected 与 protected application 的开销。第二步说明论文或规范实际做了什么: 评估还探索 0/32/64/128-bit tags 等设计点和 TLB/PTW 影响。第三步收束到证据边界: 证据边界: 证明 SPEAR-V 原型可行，不代表供应商量产采用。引用时只把 SPEAR-V evaluation sections; Figure 3; tag-size discussion 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SPEAR-V evaluation sections; Figure 3; tag-size discussion.

- Proof object: matrix - 实验问题: Q1 = protected app overhead; Q2 = unprotected app overhead; Q3 = tag size/area tradeoff; Q4 = TLB/PTW effect; Boundary = research prototype


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能结论: SPEAR-V 用 tag path 换取细粒度隔离，摘要报告 protected app 平均约 1% overhead。

- Unprotected application 可放在 non-taggable memory 或跳过 tag fetch，论文称接近零开销。
- Protected application 因 TLB miss/tag lookup 增加开销，平均约 1%。
- 关键风险是硬件 tag store 面积、tag cache/TLB 设计和 page-table write trap。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能结论: SPEAR-V 用 tag path 换取细粒度隔离，摘要报告 protected app 平均约 1% overhead。第一步解释为什么需要这一页: Unprotected application 可放在 non-taggable memory 或跳过 tag fetch，论文称接近零开销。第二步说明论文或规范实际做了什么: Protected application 因 TLB miss/tag lookup 增加开销，平均约 1%。第三步收束到证据边界: 关键风险是硬件 tag store 面积、tag cache/TLB 设计和 page-table write trap。引用时只把 SPEAR-V abstract; Section 8 evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SPEAR-V abstract; Section 8 evaluation.

- Proof object: bars - performance evidence: unprotected app 0% reported; protected app average ~1%; tag expressiveness high; standardization maturity research


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: SPEAR-V 是 RISC-V enclave primitive 的强 SOTA，因为它把 page-table safety 和低开销放进一个硬件语义。

- 优势: 低开销、细粒度、可嵌套，机制比纯 PMP 更灵活。
- 局限: 需要硬件扩展和 tag store；侧信道、I/O 和标准化仍需其他机制。
- 商业化潜力: 适合嵌入式/边缘/插件隔离；风险在 ISA 扩展接受度、验证成本和 toolchain support。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: SPEAR-V 是 RISC-V enclave primitive 的强 SOTA，因为它把 page-table safety 和低开销放进一个硬件语义。第一步解释为什么需要这一页: 优势: 低开销、细粒度、可嵌套，机制比纯 PMP 更灵活。第二步说明论文或规范实际做了什么: 局限: 需要硬件扩展和 tag store；侧信道、I/O 和标准化仍需其他机制。第三步收束到证据边界: 商业化潜力: 适合嵌入式/边缘/插件隔离；风险在 ISA 扩展接受度、验证成本和 toolchain support。引用时只把 SPEAR-V conclusion and README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SPEAR-V conclusion and README evaluation.

- Proof object: matrix - 评价: 优势 = tag-based page ownership; 局限 = non-standard hardware; 商业化 = fine-grained isolation; 本方向角色 = lightweight primitive SOTA


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
