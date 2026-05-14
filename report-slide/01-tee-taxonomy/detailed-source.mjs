export const deck = {
  title: "01 硬件辅助 TEE Taxonomy",
  subtitle: "独立详细版: 1 篇主 SOTA + 2 篇辅助 SOTA",
  slides: [
    {
      id: "01-00-taxonomy-intro",
      kicker: "CATEGORY",
      title: "硬件辅助 TEE Taxonomy 概览",
      claim: "不要先背 SGX、SEV、TrustZone、CCA、CoVE 的产品名；先看数据在 CPU、内存、I/O 和设备之间移动时，谁有权管理资源，谁负责证明可信。",
      body: [
        "TEE 的目标是让远程用户在不可信平台上执行敏感 workload，同时得到初始状态证明、运行时隔离和数据保密/完整性。",
        "真正难点是 host 仍要调度 CPU、分配内存、处理 I/O；taxonomy 要解释这些管理权如何被 TCB、monitor、device root of trust 分割。",
        "本分类用 SoK/Survey 建立 design space，再回到原始论文或规范支撑具体机制和性能。"
      ],
      evidence_refs: "Li 2024 p.1-p.3 Figure 1/2; Boubakri 2025 p.4 Figure 1; Wang/Huang 2026 p.1-p.4 Figure 1/2.",
      proof: {
        type: "flow",
        title: "理解路径",
        stages: ["远程用户", "attestation 证明初始状态", "TCB/monitor 保护运行时", "host 仍管理资源", "I/O/accelerator 扩展可信边界", "verifier 判断是否可用"]
      }
    },
    {
      id: "01-01-key-papers",
      kicker: "SOTA MAP",
      title: "本分类关键点与三篇 SOTA 的分工",
      claim: "主 SOTA 提供通用语言；两篇辅助 SOTA 分别补上 RISC-V 开放 ISA 谱系和 GPU/NPU/DPU/SmartNIC 等设备侧可信边界。",
      body: [
        "Li 2024: 用 TRAF 解释 host、RTPM、TEE instance 如何分工管理 CPU/memory/I/O。",
        "Boubakri 2025: 把 Sanctum、Keystone、CURE、Penglai、CoVE、AP-TEE 等 RISC-V 路线串成谱系。",
        "Wang/Huang 2026: 说明 confidential workload 进入 accelerator 后，access control、memory encryption、attestation 必须覆盖设备路径。"
      ],
      evidence_refs: "report-slide/01-tee-taxonomy/papers.yml; three local PDFs verified by pdfinfo.",
      proof: {
        type: "matrix",
        title: "三篇论文在 01 中的职责",
        columns: ["论文", "角色", "解决的问题", "不能替代什么"],
        rows: [
          ["Li 2024", "主 SOTA", "通用 TEE runtime taxonomy", "平台机制/性能原文"],
          ["Boubakri 2025", "辅助 SOTA", "RISC-V TEE lineage", "Keystone/CoVE/AP-TEE 原文"],
          ["Wang/Huang 2026", "辅助 SOTA", "accelerator/device TEE taxonomy", "TDISP/SPDM/IDE/GPU 系统原文"]
        ]
      }
    },
    {
      id: "01-02-li-title",
      kicker: "PRIMARY SOTA",
      layout: "title",
      title: "SoK: Understanding Design Choices and Pitfalls of Trusted Execution Environments",
      claim: "Mengyuan Li, Yuheng Yang, Guoxing Chen, Mengjia Yan, Yinqian Zhang · ASIA CCS 2024",
      body: [
        "定位: 01 的主 taxonomy anchor。",
        "证据等级: E2 peer-reviewed SoK，local PDF verified。",
        "用途: server-side TEE lifecycle、runtime management modes、known design pitfalls。"
      ],
      evidence_refs: "Local PDF title page p.1; README metadata.",
      proof: {
        type: "cards",
        title: "为什么作为主 SOTA",
        items: ["TRAF 框架", "四种 runtime mode", "CPU/memory/I/O 统一表", "pitfall mapping"]
      }
    },
    {
      id: "01-03-li-summary",
      kicker: "CONTENT SUMMARY",
      title: "内容摘要",
      claim: "论文提出 TRAF: 先看 TEE 生命周期，再看 CPU、memory、I/O 事件由 host、RTPM 还是 TEE instance 管。",
      body: [
        "动机: server-side TEEs 设计差异大，known attacks 增多，新读者难以从平台名理解安全边界。",
        "工作: 提出 TEE Runtime Architectural Framework，拆解 common runtime tasks 和四种管理模式。",
        "数据: Figure 5 汇总代表性 TEEs 的设计选择，Table 1/2 把 known attacks 与 design flaws 关联。"
      ],
      evidence_refs: "Li 2024 p.1 abstract; p.2 contributions; p.7 Figure 5; p.9 Table 1; Appendix Table 2.",
      proof: {
        type: "flow",
        title: "TRAF 分析管线",
        stages: ["TEE lifecycle", "runtime event", "management mode", "security/TCB/perf implication", "known pitfall"]
      }
    },
    {
      id: "01-04-li-background",
      kicker: "BACKGROUND",
      title: "研究背景",
      claim: "host 可以调度 CPU、改 memory mapping、处理 I/O，甚至启动/暂停/销毁 TEE instance；TEE 设计必须在资源效率和安全边界之间分工。",
      body: [
        "SRE 要求 secure measurement、confidentiality、integrity；这些保证依赖 hardware-backed TCB。",
        "论文 threat model 假设 adversary 控制 privileged software，并管理 non-TEE world 的 memory、I/O、CPU scheduling。",
        "商业 TEE 通常排除 DoS 和 microarchitectural side-channel，taxonomy 必须把这些边界说清楚。"
      ],
      evidence_refs: "Li 2024 p.2 Section 2.1; p.3 Section 2.2.",
      proof: {
        type: "matrix",
        title: "TEE 读者要先分清的三条边界",
        columns: ["边界", "受谁控制", "为什么重要"],
        rows: [
          ["Trust boundary", "host vs TCB vs TEE instance", "决定 attacker 能操作什么"],
          ["TCB boundary", "Manufacturer TCB vs ISV TCB", "决定漏洞责任在哪"],
          ["Evidence boundary", "attestation report / specs / papers", "决定 claim 能否被 verifier 接受"]
        ]
      }
    },
    {
      id: "01-05-li-core-idea",
      kicker: "CORE IDEA",
      title: "核心洞察",
      claim: "同一个 TEE 可以在 CPU scheduling 用 unprotected mode，在 context switch 用 RTPM-only，在 page fault 用 RTPM-guarded，在 virtual memory 用 instance-assisted。",
      body: [
        "这解释了为什么 TEE 设计不是简单的安全/不安全二分。",
        "unprotected mode 让 host 高效管理资源，但扩大观察和操控面。",
        "RTPM-only 最安全但扩大 TCB；RTPM-guarded 折中却容易在 corner case 出错。"
      ],
      evidence_refs: "Li 2024 p.5 Figure 4; p.6-p.9 Sections 4.3-5.2.",
      proof: {
        type: "matrix",
        title: "四种 management mode",
        columns: ["Mode", "谁主导", "直观解释", "典型风险"],
        rows: [
          ["Unprotected", "host", "资源直接交给不可信 OS", "可观察/操控"],
          ["RTPM-only", "TCB/RTPM", "TCB 完全接管", "TCB 变大"],
          ["RTPM-guarded", "host + RTPM", "host 配置, TCB 校验", "校验遗漏"],
          ["Instance-assisted", "TEE instance", "instance runtime 参与管理", "runtime/DoS 风险"]
        ]
      }
    },
    {
      id: "01-06-li-architecture",
      kicker: "ARCHITECTURE",
      title: "TEE 生命周期与 TRAF 架构总览",
      claim: "Figure 2 给出 TEE 生命周期，Figure 3 把 runtime 管理拆成 CPU、memory、I/O 三组事件，Figure 4 再给每个事件分配 management mode。",
      body: [
        "Attestation: 证明 hardware/TEE instance 初始状态，建立 secure channel。",
        "Runtime CPU: scheduling、context switch、interrupt/instruction emulation。",
        "Runtime memory/I/O: virtual memory、physical page allocation、page fault、shared memory、I/O device path。"
      ],
      evidence_refs: "Li 2024 p.3 Figure 2; p.5 Figure 3 and Figure 4.",
      proof: {
        type: "architecture",
        title: "TRAF 架构重绘",
        lanes: [
          { label: "Remote Attestation", nodes: ["TEE executable", "measurement", "signed report", "secure channel"] },
          { label: "CPU Runtime", nodes: ["scheduling", "context switch", "interrupt", "instruction emulation"] },
          { label: "Memory / I/O Runtime", nodes: ["page ownership", "page fault", "shared memory", "I/O operation"] }
        ]
      }
    },
    {
      id: "01-07-li-method-lifecycle",
      kicker: "METHOD 1",
      title: "核心方法一：生命周期与 TRAF 分析管线",
      claim: "Remote attestation 只证明 TEE instance 开始时是什么；runtime management 才决定 host 在运行中能否通过调度、页表、I/O、interrupt 影响机密数据。",
      body: [
        "Step 1: TEE instance 或 owner 请求 attestation supervisor 生成报告。",
        "Step 2: supervisor 签名 measurement 和配置状态，remote user 验证 Manufacturer TCB 与 ISV TCB 初始状态。",
        "Step 3: 运行期继续处理 CPU、memory、I/O 事件；这里才是 design-choice 差异最大的位置。"
      ],
      evidence_refs: "Li 2024 p.3-p.4 Section 3 and Figure 2.",
      proof: {
        type: "flow",
        title: "从 launch 到 runtime",
        stages: ["load TEE", "measure initial state", "sign attestation report", "establish secure channel", "runtime resource events", "mode-specific enforcement"]
      }
    },
    {
      id: "01-08-li-method-modes",
      kicker: "METHOD 2",
      title: "核心方法二：四种 Resource-Management Mode",
      claim: "可以用一句话记住: unprotected 追求可管理性，RTPM-only 追求强安全，RTPM-guarded 做折中，instance-assisted 把一部分控制交给 enclave/CVM runtime。",
      body: [
        "CPU scheduling 多用 unprotected，因为 CSP 需要调度策略和低开销。",
        "Context switch 多用 RTPM-only，因为寄存器和微架构状态必须防泄漏。",
        "Page fault / memory allocation 常在 guarded 与 only 之间取舍，是 pitfall 高发区。"
      ],
      evidence_refs: "Li 2024 p.5 Figure 4; p.6-p.8 Sections 4.3-4.4.",
      proof: {
        type: "bars",
        title: "mode 的直观风险/成本",
        metrics: [
          { label: "Unprotected: 性能/可管理性", value: "高", bar: 92 },
          { label: "Unprotected: host 影响面", value: "高", bar: 95 },
          { label: "RTPM-only: 安全边界清晰度", value: "高", bar: 94 },
          { label: "RTPM-only: TCB/复杂度成本", value: "高", bar: 82 },
          { label: "RTPM-guarded: corner-case 风险", value: "中高", bar: 70 }
        ]
      }
    },
    {
      id: "01-09-li-method-cpu-memory",
      kicker: "METHOD 3",
      title: "核心方法三：CPU 与 Memory Runtime Management",
      claim: "CPU scheduling 若交给 TCB 会破坏云平台效率；context switch 若交给 host 又会泄漏寄存器；memory allocation/page fault 则介于两者之间。",
      body: [
        "CPU scheduling: host 控制，带来 interrupt-based controlled-channel 风险。",
        "Context switch: 多数 TEE 由 RTPM 保存/恢复寄存器；SEV 早期弱保护导致漏洞。",
        "Memory allocation: host 可选择物理页，但 RTPM 需要检查 ownership、permissions 或 encryption key。"
      ],
      evidence_refs: "Li 2024 p.6 Section 4.3.1-4.3.2; p.7-p.8 Section 4.4.",
      proof: {
        type: "matrix",
        title: "CPU/memory runtime event",
        columns: ["事件", "常见 mode", "为什么这样设计", "主要风险"],
        rows: [
          ["CPU scheduling", "Unprotected", "CSP 需要调度效率", "host 观察/中断"],
          ["Context switch", "RTPM-only", "保护寄存器和状态", "TCB 复杂度"],
          ["Memory allocation", "RTPM-guarded", "host 分配, TCB 校验", "ownership 校验遗漏"],
          ["Page fault", "mixed", "性能/安全取舍", "controlled-channel"]
        ]
      }
    },
    {
      id: "01-10-li-method-io-pitfalls",
      kicker: "METHOD 4",
      title: "核心方法四：I/O、Attestation 与 Pitfall Mapping",
      claim: "Li 2024 指出，多数 TEE 的 I/O data transmission 和 I/O operations 仍是 unprotected mode；这解释了为什么后续必须引入 trusted I/O、PCIe IDE、SPDM/TDISP 和 device attestation。",
      body: [
        "SGX OCall、VM-based emulated I/O、DMA shared memory 都会把数据带出 protected memory。",
        "软件 TLS/磁盘加密可以保护部分数据，但不能等同于设备路径可信。",
        "Table 1 把 unprotected/RTPM-guarded corner cases 与已知设计缺陷关联。"
      ],
      evidence_refs: "Li 2024 p.8 Section 4.5; p.9 Table 1 and Section 5.2.",
      proof: {
        type: "flow",
        title: "I/O trust gap",
        stages: ["TEE private memory", "shared buffer", "host / hypervisor", "emulated device / DMA", "external device", "application-layer encryption or trusted I/O"]
      }
    },
    {
      id: "01-11-li-evidence-env",
      kicker: "EVIDENCE",
      title: "实验环境与证据基础",
      claim: "实验页必须写“无新实验”；它能支撑设计空间和 pitfall framing，不能单独支撑某个平台的 overhead 或安全证明。",
      body: [
        "证据源: ASIA CCS 2024 论文，本地 PDF 17 页，pdfinfo verified。",
        "核心数据对象: Figure 1-5、Table 1、Appendix Table 2。",
        "覆盖平台: Intel SGX/TDX、AMD SEV family、Arm CCA、IBM PEF、RISC-V Sanctum/Keystone/Penglai/CURE 等。"
      ],
      evidence_refs: "pdfinfo; Li 2024 p.1-p.17.",
      proof: {
        type: "matrix",
        title: "证据强度",
        columns: ["项目", "状态", "可支撑", "不可支撑"],
        rows: [
          ["论文类型", "SoK", "taxonomy", "新机制"],
          ["实验", "无新实验", "证据边界", "性能数字"],
          ["表格", "Figure 5/Table 1", "设计选择/缺陷映射", "平台安全证明"]
        ]
      }
    },
    {
      id: "01-12-li-performance-boundary",
      kicker: "PERFORMANCE / DATA",
      title: "性能与 Claim Strength 边界",
      claim: "unprotected mode 性能最好但攻击面大；RTPM-only 安全边界强但可能扩大 TCB；RTPM-guarded 折中，corner case 是风险来源。",
      body: [
        "论文只做定性分析: CPU scheduling 放入 RTPM 会显著降低性能，复杂任务放入 RTPM 会扩大 TCB。",
        "Figure 5 是代表性 TEE 的 mode matrix，不是 benchmark chart。",
        "PPT 中所有性能/开销数字必须回到原始平台论文或规范。"
      ],
      evidence_refs: "Li 2024 p.5-p.9 Sections 4.2-5.2.",
      proof: {
        type: "matrix",
        title: "mode trade-off",
        columns: ["设计选择", "性能", "TCB", "安全"],
        rows: [
          ["Unprotected", "最好", "小", "弱"],
          ["RTPM-only", "可能变差", "大", "强"],
          ["RTPM-guarded", "折中", "中", "依赖校验完整性"],
          ["Instance-assisted", "取决于 runtime", "runtime 增加", "减少 host 观察面"]
        ]
      }
    },
    {
      id: "01-13-li-evaluation",
      kicker: "EVALUATION",
      title: "文章评价",
      claim: "它最适合解释通用 TEE design space；局限是 server-side CPU TEE 偏重，不能替代 device path、RISC-V spec 和原始系统证据。",
      body: [
        "优势: 解释力强，能把产品名转换成 host/RTPM/instance 分工。",
        "局限: 不覆盖 embedded TrustZone、纯软件 TEE、完整 accelerator/device TEE。",
        "商业化潜力: 可转成 cloud TEE 选型 checklist、verifier policy checklist、架构评审表。"
      ],
      evidence_refs: "Li 2024 p.2-p.3 scope; p.12 Section 6 limitations; README evaluation.",
      proof: {
        type: "matrix",
        title: "讲稿中的使用边界",
        columns: ["维度", "判断"],
        rows: [
          ["作为主 SOTA", "是, 固定 taxonomy language"],
          ["作为机制证明", "否, 回原文/spec"],
          ["作为性能来源", "否, 无新实验"],
          ["商业评审", "可用作 checklist 起点"]
        ]
      }
    },
    {
      id: "01-14-boubakri-title",
      kicker: "AUX SOTA 1",
      layout: "title",
      title: "A Survey of RISC-V Secure Enclaves and Trusted Execution Environments",
      claim: "Marouene Boubakri, Belhassen Zouari · Electronics 2025",
      body: [
        "定位: RISC-V secure enclave / TEE 谱系辅助 SOTA。",
        "证据等级: E2 peer-reviewed survey，MDPI HTML 与 local PDF verified。",
        "用途: 连接 Sanctum、Keystone、CURE、Penglai、SPEAR-V、CoVE、AP-TEE。"
      ],
      evidence_refs: "Boubakri 2025 title page p.1; README metadata.",
      proof: {
        type: "cards",
        title: "为什么放在 01",
        items: ["2016-2025 timeline", "RISC-V primitive stack", "Table 1 matrix", "standardization/adoption gaps"]
      }
    },
    {
      id: "01-15-boubakri-summary",
      kicker: "CONTENT SUMMARY",
      title: "内容摘要",
      claim: "它解释 RISC-V 方向为何从 PMP/monitor enclave 演进到 scalable memory protection、TVM/TSM 和 AP-TEE/CoVE 这类 confidential VM 方向。",
      body: [
        "动机: RISC-V openness 带来可定制安全硬件，也造成设计碎片化。",
        "工作: 按系统逐一 survey，并用 Table 1 横向比较 isolation、memory、secure I/O、SCA、TCB、SDK、compliance。",
        "数据: Figure 1 给出 2016-2025 时间线，Section 4 总结 adoption 和 standardization gap。"
      ],
      evidence_refs: "Boubakri 2025 p.1 abstract; p.4 Figure 1; p.19 Table 1; p.20-p.29 Section 4.",
      proof: {
        type: "timeline",
        title: "RISC-V TEE 谱系",
        steps: [
          { label: "2016", text: "Sanctum: open-hardware enclave" },
          { label: "2020", text: "Keystone: open enclave framework" },
          { label: "2021", text: "CURE/Penglai: scalable protection" },
          { label: "2023", text: "CoVE/AP-TEE: TVM/TSM direction" },
          { label: "2025", text: "AnyTEE and ecosystem discussion" }
        ]
      }
    },
    {
      id: "01-16-boubakri-background",
      kicker: "BACKGROUND",
      title: "研究背景",
      claim: "PMP/ePMP、U/S/M privilege、virtual memory、hypervisor extension、crypto/memory tagging 决定了 RISC-V TEE 可以怎么做，也限制了它能多大规模落地。",
      body: [
        "轻量 enclave 往往复用 PMP/ePMP，部署简单但受 region 数量和 granularity 限制。",
        "强隔离方案会改硬件、page table walker、cache/memory system 或 monitor，带来复杂度和移植成本。",
        "CoVE/AP-TEE 把问题上升到 confidential VM，需要 TSM、TVM、MTT、ABI 和标准化。"
      ],
      evidence_refs: "Boubakri 2025 p.4 Section 2.2; p.17-p.18 AP-TEE; p.20-p.29 Discussion.",
      proof: {
        type: "flow",
        title: "RISC-V TEE substrate",
        stages: ["U/S/M privilege", "PMP/ePMP", "secure monitor", "virtual memory / H extension", "MTT/TVM/TSM", "attestation and ABI"]
      }
    },
    {
      id: "01-17-boubakri-core-idea",
      kicker: "CORE IDEA",
      title: "核心洞察",
      claim: "Table 1 显示，系统可以在 memory isolation 上很强，却没有 secure I/O、SDK、compliance 或 production validation；这就是 RISC-V 谱系的主矛盾。",
      body: [
        "Keystone/Sanctum 等奠定 enclave baseline，但不自动解决 secure I/O 或 production compliance。",
        "Penglai/Cerberus 关注 scalability、memory sharing、serverless latency，但机制 claim 仍要回原文。",
        "CoVE/AP-TEE 贴近 confidential computing 标准，但 draft/spec 状态必须显式标注。"
      ],
      evidence_refs: "Boubakri 2025 p.19 Table 1; p.20-p.29 Section 4.",
      proof: {
        type: "matrix",
        title: "RISC-V TEE 三个维度",
        columns: ["维度", "代表路线", "主要问题"],
        rows: [
          ["隔离", "PMP/ePMP, PTW, MTT", "granularity / ownership"],
          ["可扩展", "Penglai, Cerberus", "enclave 数量和 sharing"],
          ["生态", "CoVE, AP-TEE, AnyTEE", "ABI / SDK / standards"]
        ]
      }
    },
    {
      id: "01-18-boubakri-architecture",
      kicker: "ARCHITECTURE",
      title: "RISC-V TEE 架构总览",
      claim: "底层是 RISC-V 安全原语，中层是 enclave/confidential VM 系统，上层是 SDK、compliance、standardization 和 production viability。",
      body: [
        "Primitive layer: PMP/ePMP、virtual memory、H-extension、crypto、memory tagging。",
        "System layer: Keystone、Sanctum、CURE、Penglai、SPEAR-V、CoVE、AP-TEE 等。",
        "Ecosystem layer: unified programming model、GlobalPlatform/PKCS#11、SDK、OpenSBI/Linux/OP-TEE upstream。"
      ],
      evidence_refs: "Boubakri 2025 p.4 Section 2.2; p.19 Table 1; p.24-p.29 Sections 4.7-4.17.",
      proof: {
        type: "architecture",
        title: "RISC-V TEE 三层视图",
        lanes: [
          { label: "Primitive", nodes: ["PMP/ePMP", "virtual memory", "H extension", "crypto/tagging"] },
          { label: "TEE System", nodes: ["enclave", "secure monitor", "memory isolation", "attestation"] },
          { label: "Ecosystem", nodes: ["SDK/API", "compliance", "standardization", "production validation"] }
        ]
      }
    },
    {
      id: "01-19-boubakri-method-primitives",
      kicker: "METHOD 1",
      title: "核心方法一：RISC-V Security Primitive Stack",
      claim: "PMP/ePMP 是许多 RISC-V enclave 的起点，但 page ownership、DMA/I/O、scalability 和 side-channel 不会因为用了 PMP 就自动解决。",
      body: [
        "PMP/ePMP 提供 memory region access control，是 Keystone、Dorami、SPEAR-V 等路线的基础。",
        "Virtual memory 和 hypervisor extension 让 confidential VM/TVM 路线成为可能。",
        "Crypto、memory tagging 和 I/O primitives 决定能否扩展到 physical attack、secure I/O 和 richer deployment。"
      ],
      evidence_refs: "Boubakri 2025 p.4 Section 2.2; p.19 Table 1; p.20-p.23 Sections 4.1-4.5.",
      proof: {
        type: "matrix",
        title: "primitive 到安全目标",
        columns: ["Primitive", "支撑能力", "常见缺口"],
        rows: [
          ["PMP/ePMP", "memory region isolation", "entry/granularity scalability"],
          ["Virtual memory", "page-based isolation", "host page-table trust"],
          ["H extension", "TVM/virtualization", "TSM/ABI complexity"],
          ["IOMMU/IOPMP", "secure I/O substrate", "spec maturity and composition"]
        ]
      }
    },
    {
      id: "01-20-boubakri-method-lineage",
      kicker: "METHOD 2",
      title: "核心方法二：RISC-V Enclave Lineage",
      claim: "Sanctum 重 isolation，Keystone 重 extensible framework，CURE/Penglai 重 scalability/peripheral/memory，SPEAR-V 重 practical primitive；每个系统只覆盖部分 design space。",
      body: [
        "轻量路线: 尽量少改硬件，通常牺牲 secure I/O、rich SDK 或 production readiness。",
        "硬件协同路线: 引入 cache tag、filter engine、GPT/MMT 等，安全能力更强但可移植性更差。",
        "共享/弹性路线: 关注 serverless、memory sharing、startup latency，但需要复杂 correctness reasoning。"
      ],
      evidence_refs: "Boubakri 2025 p.4-p.18 Section 3; p.19 Table 1.",
      proof: {
        type: "matrix",
        title: "代表系统的讲解定位",
        columns: ["系统", "定位", "记忆点"],
        rows: [
          ["Sanctum/MI6", "hardware isolation", "强隔离但硬件路线重"],
          ["Keystone", "open framework", "把 enclave 框架开放出来"],
          ["CURE/Penglai", "scalable protection", "扩展到更多 enclave/内存"],
          ["CoVE/AP-TEE", "confidential VM", "走向标准化 TVM"]
        ]
      }
    },
    {
      id: "01-21-boubakri-method-cove-aptee",
      kicker: "METHOD 3",
      title: "核心方法三：CoVE/AP-TEE Confidential VM 演进",
      claim: "AP-TEE 引入 TSM Driver、TSM、TVM、TH-ABI、TG-ABI、MTT 和 boot-chain measurement，目标是 RISC-V 对标 SEV/TDX/CCA 的 confidential VM 抽象。",
      body: [
        "AP-TEE 区分 Non-Confidential 与 Confidential domains。",
        "TSM Driver 在 M-mode 作为 relay，TSM 在 Confidential domain 的 HS-mode 处理 hypervisor 和 TVM 请求。",
        "MTT 区分 confidential 与 non-confidential pages；attestation 覆盖 TSM Driver -> TSM -> TVM。"
      ],
      evidence_refs: "Boubakri 2025 p.17-p.18 Section 3.14 AP-TEE; p.12-p.13 Section 3.7 CoVE.",
      proof: {
        type: "flow",
        title: "AP-TEE trust chain",
        stages: ["TSM Driver measured", "TSM measured", "host/hypervisor in non-conf domain", "TVM created via TH-ABI", "TVM interacts via TG-ABI", "attestation covers Driver -> TSM -> TVM"]
      }
    },
    {
      id: "01-22-boubakri-method-adoption",
      kicker: "METHOD 4",
      title: "核心方法四：开放挑战与 Adoption Gap",
      claim: "Section 4 指出，没有统一 programming model、标准 API、certification、production silicon/adversarial workload validation，RISC-V TEE 很难从 prototype 走向生产。",
      body: [
        "Systemic challenges: fragmentation、Iago attack risk、privileged monitor bugs、prototype-stage validation。",
        "Unified programming model: developer API、portable runtime、SBI extension、TEE-specific SM 分层。",
        "Compliance: GlobalPlatform、PKCS#11、TEE profiles 是 regulated domains 的 adoption 条件。"
      ],
      evidence_refs: "Boubakri 2025 p.23-p.29 Sections 4.5-4.17.",
      proof: {
        type: "matrix",
        title: "从论文原型到生产平台",
        columns: ["关卡", "论文中的问题", "对 01 taxonomy 的含义"],
        rows: [
          ["Programming model", "每个框架 ABI/SDK 不同", "taxonomy 要看开发者接口"],
          ["Compliance", "缺 GlobalPlatform/PKCS#11", "安全不等于可采购"],
          ["Validation", "多为 FPGA/simulator", "证据等级要写清"],
          ["Standardization", "AP-TEE/CoVE 仍演进", "状态需要跟踪"]
        ]
      }
    },
    {
      id: "01-23-boubakri-evidence-env",
      kicker: "EVIDENCE",
      title: "实验环境与证据基础",
      claim: "PPT 中的实验环境页应写成“证据来源与覆盖范围”: MDPI HTML、本地 PDF、Figure 1 timeline、Table 1 comparison、Section 4 discussion。",
      body: [
        "证据源: Electronics 2025 PDF 35 页，pdfinfo verified。",
        "覆盖期: 2016-2025 RISC-V secure enclave and TEE proposals。",
        "核心输出: timeline、system survey、comparison matrix、deployment/standardization discussion。"
      ],
      evidence_refs: "pdfinfo; Boubakri 2025 p.4 Section 2.3; p.19 Table 1.",
      proof: {
        type: "matrix",
        title: "证据使用边界",
        columns: ["可用作", "不可用作", "处理方式"],
        rows: [
          ["RISC-V lineage", "系统安全证明", "回原始论文"],
          ["Table 1 overview", "性能数字来源", "回原始图表"],
          ["standardization gap", "规范最终状态", "查官方 spec"]
        ]
      }
    },
    {
      id: "01-24-boubakri-performance-boundary",
      kicker: "PERFORMANCE / DATA",
      title: "性能与 Claim Strength 边界",
      claim: "Survey 会转述 Penglai、AnyTEE 等原始论文的 overhead 或 scalability，但这些数字不是本文新实验，不能从本 survey 直接推出平台性能结论。",
      body: [
        "Table 1 汇总 TCB size、implementation validation、SDK、crypto、compliance，但不是 benchmark。",
        "Section 3 中出现的性能陈述需要回到对应系统原文。",
        "01 PPT 可以展示“证据矩阵”，而不是展示未经回引的速度条形图。"
      ],
      evidence_refs: "Boubakri 2025 p.18 Penglai/AnyTEE narrative; p.19 Table 1.",
      proof: {
        type: "matrix",
        title: "RISC-V survey 数据分类",
        columns: ["数据", "来源", "PPT 处理"],
        rows: [
          ["timeline", "本文 Figure 1", "可直接使用"],
          ["comparison matrix", "本文 Table 1", "可直接使用, 标 E2"],
          ["overhead/latency", "原始论文转述", "回原文后再用"],
          ["draft status", "AP-TEE/CoVE source", "查官方状态"]
        ]
      }
    },
    {
      id: "01-25-boubakri-evaluation",
      kicker: "EVALUATION",
      title: "文章评价",
      claim: "它的价值是让 01 不只讲 x86/Arm CPU TEE，而能把 RISC-V 开放 ISA、PMP、CoVE/AP-TEE 和 ecosystem gap 放进同一叙事。",
      body: [
        "优势: 覆盖 2016-2025，能形成清晰 timeline 和 matrix。",
        "局限: 二手 survey 证据，且不同系统 threat model/maturity 不同。",
        "商业化潜力: 可用于 RISC-V confidential computing 选型入口，但落地取决于 spec、SDK、attestation、I/O 和 vendor support。"
      ],
      evidence_refs: "Boubakri 2025 p.20-p.29 Discussion; README evaluation.",
      proof: {
        type: "matrix",
        title: "作为 01 辅助 SOTA 的判断",
        columns: ["维度", "结论"],
        rows: [
          ["补充范围", "RISC-V enclave/confidential VM lineage"],
          ["证据强度", "E2 survey, local PDF verified"],
          ["最大风险", "二手机制/性能描述"],
          ["最佳用法", "taxonomy bridge + reading map"]
        ]
      }
    },
    {
      id: "01-26-accel-title",
      kicker: "AUX SOTA 2",
      layout: "title",
      title: "SoK: Analysis of Accelerator TEE Designs",
      claim: "Chenxu Wang, Junjie Huang, Yujun Liang, Xuanyao Peng, Yuqun Zhang, Fengwei Zhang, Jiannong Cao, Hang Lu, Rui Hou, Shoumeng Yan, Tao Wei, Zhengyu He · NDSS 2026",
      body: [
        "定位: accelerator/device TEE taxonomy 辅助 SOTA。",
        "证据等级: E2 peer-reviewed SoK，local PDF verified。",
        "用途: GPU/NPU/TPU/FPGA/DPU/SmartNIC 的 access control、memory encryption、attestation、TCB/compatibility。"
      ],
      evidence_refs: "Wang/Huang 2026 title page p.1; README metadata.",
      proof: {
        type: "cards",
        title: "为什么放在 01",
        items: ["51-study corpus", "Host/Acc/Mix taxonomy", "3 security mechanisms", "TCB/compatibility deployment lens"]
      }
    },
    {
      id: "01-27-accel-summary",
      kicker: "CONTENT SUMMARY",
      title: "内容摘要",
      claim: "敏感数据会进入 GPU/NPU/DPU/FPGA 的命令队列、device memory、driver/runtime、I/O bus 和 scheduler；这些都要纳入可信执行链。",
      body: [
        "动机: accelerator TEE studies 增长快，但多数针对特定 CPU/accelerator，缺少通用设计框架。",
        "工作: 51-study corpus，提出 Host-type、Acc.-type、Mix-type，并分析 access control、memory encryption、attestation。",
        "数据: Table I corpus，Figure 1 architecture，Figure 2 attack vectors，Table III-XIII security/TCB/compatibility matrices。"
      ],
      evidence_refs: "Wang/Huang 2026 p.1 abstract; p.2-p.3 motivation; p.4 Figure 1/2.",
      proof: {
        type: "flow",
        title: "为什么 CPU TEE 不够",
        stages: ["CVM/enclave", "driver/runtime", "DMA/MMIO", "I/O bus", "accelerator memory", "compute engine", "result path"]
      }
    },
    {
      id: "01-28-accel-background",
      kicker: "BACKGROUND",
      title: "研究背景",
      claim: "AI、图形、网络、存储和 SmartNIC/DPU offload 让敏感 workload 不再只停留在 CPU 私有内存；设备身份、设备内存、队列和总线都可能成为绕过点。",
      body: [
        "Table I 收集 51 个 accelerator TEE，41/51 在 2022 年后提出。",
        "42/51 依赖 CPU TEE，说明多数设计仍把 CPU-side TEE 当起点。",
        "40/51 支持特定 CPU architecture，43/51 只支持一个 accelerator，显示兼容性和迁移困难。"
      ],
      evidence_refs: "Wang/Huang 2026 p.2-p.3 Motivation and Table I.",
      proof: {
        type: "bars",
        title: "论文给出的 corpus statistics",
        metrics: [
          { label: "studies analyzed", value: "51", bar: 100 },
          { label: "proposed since 2022", value: "41/51", bar: 80 },
          { label: "rely on CPU TEE", value: "42/51", bar: 82 },
          { label: "specific CPU architecture", value: "40/51", bar: 78 },
          { label: "single accelerator type", value: "43/51", bar: 84 }
        ]
      }
    },
    {
      id: "01-29-accel-core-idea",
      kicker: "CORE IDEA",
      title: "核心洞察",
      claim: "只把 workload 放进 CVM/enclave 还不够；如果 accelerator 没有访问控制、设备内存/总线保护和可验证身份，host 仍可能从 offload path 攻击。",
      body: [
        "Access control: 谁能访问 task data、driver、MMIO、DMA、accelerator memory。",
        "Memory encryption: host memory、accelerator memory、I/O bus 上的数据是否有 confidentiality/integrity/freshness。",
        "Attestation: CPU TEE 与 accelerator HRoT/endorser/reference values 如何形成一条 verifier 可接受的证据链。"
      ],
      evidence_refs: "Wang/Huang 2026 p.1 abstract; p.6 Table III; p.9 Figure 3/Table VI/VII; p.10-p.11 Figure 5/6.",
      proof: {
        type: "architecture",
        title: "三大安全机制",
        lanes: [
          { label: "Access Control", nodes: ["CVM/enclave", "TSM/RMM", "firmware", "I/O bus", "accelerator controller"] },
          { label: "Memory Encryption", nodes: ["host memory", "device memory", "metadata", "I/O link"] },
          { label: "Attestation", nodes: ["CPU HRoT", "accelerator HRoT", "endorser", "verifier"] }
        ]
      }
    },
    {
      id: "01-30-accel-architecture",
      kicker: "ARCHITECTURE",
      title: "Accelerator TEE 架构总览",
      claim: "Host-type 复用 CPU TEE；Acc.-type 把控制逻辑放进 accelerator；Mix-type 同时依赖 CPU-side 和 device-side security components，更接近 TDISP/DSM/IDE 方向。",
      body: [
        "Host-type: host/CC/firmware 侧组件保护 accelerator workloads，易复用但可能扩大 CPU-side TCB。",
        "Acc.-type: accelerator controller、encryption module、attestation module 直接保护设备侧路径。",
        "Mix-type: CPU-side TEE 与 accelerator-side DSM/HRoT/IDE 组合，部署更复杂但更贴近商用设备接口安全。"
      ],
      evidence_refs: "Wang/Huang 2026 p.4 Figure 1 and Table II.",
      proof: {
        type: "matrix",
        title: "三类 accelerator TEE",
        columns: ["类型", "保护逻辑位置", "优点", "风险"],
        rows: [
          ["Host-type", "CPU-side TEE/firmware", "复用现有 TEE", "driver/runtime TCB 膨胀"],
          ["Acc.-type", "accelerator controller", "设备侧强控制", "需改硬件/firmware"],
          ["Mix-type", "CPU + device", "信任链完整", "标准/兼容性复杂"]
        ]
      }
    },
    {
      id: "01-31-accel-method-threat",
      kicker: "METHOD 1",
      title: "核心方法一：Accelerator Threat Model",
      claim: "攻击不只发生在计算时；模型参数、输入输出、task code、page table、metadata 在准备、传输、执行、终止阶段都可能暴露。",
      body: [
        "Task preparation/termination: host memory、driver/runtime、page table、task buffer pointer 是攻击面。",
        "Task computing: accelerator memory、compute engine、MMIO、DMA、device status 和 task scheduling 是攻击面。",
        "攻击者可以是 host OS/hypervisor、malicious task、device/firmware adversary 或 physical/link adversary。"
      ],
      evidence_refs: "Wang/Huang 2026 p.4-p.6 Figure 2 and Section IV.",
      proof: {
        type: "flow",
        title: "attack surface path",
        stages: ["prepare data/model", "configure driver/page table", "DMA/MMIO over bus", "accelerator computes", "scheduler/queue state", "return output and release resources"]
      }
    },
    {
      id: "01-32-accel-method-access",
      kicker: "METHOD 2",
      title: "核心方法二：Access Control 组合机制",
      claim: "论文显示，云端离散 accelerator 常需要 CPU TEE + accelerator-side defense；endpoint integrated accelerator 更常依赖 firmware/monitor 和平台安全硬件。",
      body: [
        "SAC1/SAC2: 基于 CPU TEE，是否保护 accelerator software stack 是关键分叉。",
        "SAC4/SAC5/SAC6: firmware、I/O bus、accelerator hardware/controller 提供更靠近设备的控制。",
        "Table IV 给出部署场景偏好，说明 access control 必须按 cloud discrete vs edge integrated 场景选择。"
      ],
      evidence_refs: "Wang/Huang 2026 p.6 Table III; p.7 Table IV; p.8 Table V.",
      proof: {
        type: "matrix",
        title: "Access control 组合逻辑",
        columns: ["位置", "机制", "解决什么", "常见限制"],
        rows: [
          ["CPU TEE", "CVM/enclave", "host memory workload", "driver TCB"],
          ["TSM/RMM/hypervisor", "manager policy", "device assignment", "高权限 TCB"],
          ["I/O bus", "filter/TDISP-like", "DMA/MMIO path", "标准成熟度"],
          ["Accelerator", "controller/kernel auth", "device memory/queue", "硬件改造"]
        ]
      }
    },
    {
      id: "01-33-accel-method-memory",
      kicker: "METHOD 3",
      title: "核心方法三：Protected Memory / Bus / Queue",
      claim: "缺 CPU-side、accelerator-side 或 I/O bus encryption 会让 data/code/metadata/PTEs 在不同位置变成 plaintext；但加密 granularity 不匹配又会带来 overhead。",
      body: [
        "Table VI 显示 host memory、accelerator memory、PCIe/CXL link、shared memory 都有不同 physical threat。",
        "Table VII 比较 security metadata granularity，说明 GPU/NPU access pattern 与传统 64B MEE 不一定匹配。",
        "Figure 4 用 LLM inference 展示 granularity mismatch 的初始化/通信开销，但这是 SoK 中的 illustrative analysis。"
      ],
      evidence_refs: "Wang/Huang 2026 p.9 Figure 3/Table VI/Table VII; p.10 Figure 4.",
      proof: {
        type: "matrix",
        title: "memory/data path protection",
        columns: ["位置", "缺什么", "后果"],
        rows: [
          ["Host memory", "CPU-side encryption", "task/PTE/metadata plaintext"],
          ["Device memory", "acc-side encryption", "GDDR/HBM 数据可被 probing"],
          ["I/O link", "bus encryption/freshness", "packets 可被 sniff/tamper/replay"],
          ["Metadata", "proper granularity", "integrity tree/overhead 失衡"]
        ]
      }
    },
    {
      id: "01-34-accel-method-attestation",
      kicker: "METHOD 4",
      title: "核心方法四：Device Identity 与 Attestation",
      claim: "CPU TEE 的 report 不足以证明 accelerator 环境；需要 accelerator HRoT、endorser、reference values、attestation service 和 CPU-accelerator integrated evidence。",
      body: [
        "Figure 5 给出 mainstream accelerator attestation process。",
        "Figure 6/Table VIII 显示很多 surveyed accelerators 缺少 vendor-supported attestation。",
        "Table IX 说明缺 HRoT、endorser、reference value、verifier policy 会导致 emulation/replacement 和 trust-chain 攻击。"
      ],
      evidence_refs: "Wang/Huang 2026 p.10-p.11 Figure 5/Figure 6/Table VIII/Table IX.",
      proof: {
        type: "flow",
        title: "CPU-accelerator attestation chain",
        stages: ["CPU TEE report", "accelerator HRoT", "accelerator endorser", "reference values", "task/config evidence", "remote verifier policy"]
      }
    },
    {
      id: "01-35-accel-method-tcb",
      kicker: "METHOD 5",
      title: "核心方法五：Runtime / Driver TCB 与 Scheduling",
      claim: "把 accelerator driver/runtime 塞进 TEE 会引入百万行级软件栈；只支持单一 GPU/NPU/FPGA 又难以迁移到云平台的多设备环境。",
      body: [
        "Table X 总结 system TCB size，指出高权限 TCB 增加会削弱安全性。",
        "Table XII 显示 NVIDIA/AMD/Mali/Xilinx/NPU 等 software stack 规模差异大，部分 closed-source。",
        "Table XIII 将 multi-type TEE/accelerator support、plug-and-play software/platform support 作为 compatibility 指标。"
      ],
      evidence_refs: "Wang/Huang 2026 p.12-p.14 Table X/Table XII/Table XIII.",
      proof: {
        type: "matrix",
        title: "部署瓶颈",
        columns: ["瓶颈", "论文证据", "商业含义"],
        rows: [
          ["Driver/runtime TCB", "Table XII", "代码大且可能闭源"],
          ["High-privilege additions", "Table X", "RMM/TSM/SVSM 风险"],
          ["Single-accelerator support", "43/51 studies", "难迁移"],
          ["Hardware changes", "implementation / compatibility pressure", "云端不愿大改平台"]
        ]
      }
    },
    {
      id: "01-36-accel-evidence-env",
      kicker: "EVIDENCE",
      title: "实验环境与证据基础",
      claim: "它有 51-study corpus 和大量 comparison tables；但不是一个新 accelerator TEE implementation，也不能替代原始系统论文或 TDISP/IDE/SPDM 规范。",
      body: [
        "证据源: NDSS 2026 PDF 18 页，pdfinfo verified。",
        "覆盖对象: GPU、NPU、TPU、FPGA、general accelerator、industry designs。",
        "核心表格: Table I、II、III、IV、VI、VII、VIII、IX、X、XII、XIII。"
      ],
      evidence_refs: "pdfinfo; Wang/Huang 2026 p.1-p.15.",
      proof: {
        type: "matrix",
        title: "证据边界",
        columns: ["可支撑", "不能支撑", "处理方式"],
        rows: [
          ["accelerator TEE design space", "某系统安全证明", "回原文"],
          ["security mechanism taxonomy", "TDISP 状态机 claim", "查 spec"],
          ["TCB/compatibility lens", "通用性能结论", "标注 SoK/illustrative"]
        ]
      }
    },
    {
      id: "01-37-accel-performance-boundary",
      kicker: "PERFORMANCE / DATA",
      title: "性能与 Claim Strength 边界",
      claim: "论文报告 secure initialization overhead 47.88%-73.45%、secure communication overhead 40.36%-44.94%，用于说明不匹配的 encryption granularity 会带来成本。",
      body: [
        "这个数据来自论文对 LLM inference with SME solutions 的展示，应标为 SoK 内部 illustrative analysis。",
        "它不能证明所有 accelerator TEE 都有相同 overhead。",
        "可用于 PPT 讲明 design insight: accelerator MEE 必须贴合 GPU/NPU access pattern，不能机械迁移 CPU MEE。"
      ],
      evidence_refs: "Wang/Huang 2026 p.10 Figure 4 and Section VI insights.",
      proof: {
        type: "bars",
        title: "Figure 4 的谨慎读法",
        metrics: [
          { label: "secure initialization overhead", value: "47.88%-73.45%", bar: 73 },
          { label: "secure communication overhead", value: "40.36%-44.94%", bar: 45 },
          { label: "claim strength as system benchmark", value: "低", bar: 18 },
          { label: "claim strength as design warning", value: "高", bar: 90 }
        ]
      }
    },
    {
      id: "01-38-accel-evaluation",
      kicker: "EVALUATION",
      title: "文章评价",
      claim: "它最适合解释为什么 TEE taxonomy 必须延伸到 GPU/NPU/DPU/SmartNIC；局限是不能替代原始规范和系统论文。",
      body: [
        "优势: 结构完整，RQ + taxonomy + tables 很适合转成图文 PPT。",
        "局限: corpus 成熟度不一，industry/spec 状态和 vendor support 需要继续核验。",
        "商业化潜力: confidential AI、GPU cloud、DPU/SmartNIC、secure device assignment 需求强，但依赖 HRoT、TDISP/SPDM/IDE、driver TCB reduction 和编排栈。"
      ],
      evidence_refs: "Wang/Huang 2026 p.15 TDISP discussion and conclusion; README evaluation.",
      proof: {
        type: "matrix",
        title: "作为 01 辅助 SOTA 的判断",
        columns: ["维度", "结论"],
        rows: [
          ["补充范围", "accelerator/device path"],
          ["证据强度", "E2 NDSS SoK, local PDF verified"],
          ["最大风险", "不能替代原始系统/spec"],
          ["最佳用法", "设备侧 taxonomy + checklist"]
        ]
      }
    }
  ]
};
