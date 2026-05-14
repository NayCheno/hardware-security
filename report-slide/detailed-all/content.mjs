const flow = (title, items) => ({ type: "flow", title, items });
const cards = (title, items) => ({ type: "cards", title, items });
const matrix = (title, rows) => ({ type: "matrix", title, rows });
const bars = (title, metrics) => ({ type: "bars", title, metrics });
const s = (claim, body, evidence_refs, proof) => ({ claim, body, evidence_refs, proof });
const m = (title, claim, body, evidence_refs, proof) => ({ title, ...s(claim, body, evidence_refs, proof) });

export const detailedDirections = [
  {
    id: "02-trustzone-lineage",
    title: "Arm TrustZone TEE 与漏洞谱系",
    claim: "这个分类解释 Arm TrustZone 如何用 Secure/Non-secure world 建立移动/嵌入式 TEE，以及为什么 legacy TEE 漏洞会推动后续 CCA/RME 改造。",
    background: [
      "先建立一个边界: TrustZone 把 SoC 切成 Secure world 和 Non-secure world，安全状态沿 CPU、总线、内存控制器和外设传播。",
      "TrustZone 很成熟，但它不是云 confidential VM；trusted OS、TA、monitor、driver 和共享内存接口会形成很大的软件 TCB。",
      "本方向用 Arm 白皮书建立机制底座，用 Pinto 2019 解释生态谱系，用 Cerdeira 2020 解释漏洞根因和迁移动机。"
    ],
    keyClaim: "主线是“机制 -> 生态 -> 漏洞”: 白皮书说明双世界硬件模型，survey 说明 TEE 软件栈和用法，SoK 说明真实系统为什么反复出错。",
    keyPoints: [
      "Arm TrustZone whitepaper: 基础机制源，讲 NS bit、Secure Monitor、SoC security state propagation。",
      "Pinto/Santos 2019: 把 TrustZone-assisted TEE 的硬件、TEE OS、TA、虚拟化和应用场景系统化。",
      "Cerdeira 2020: 从公开漏洞出发，说明 trusted OS、TA、driver、接口和供应链如何成为攻击面。"
    ],
    evidence: "Arm TrustZone whitepaper local PDF; Pinto/Santos 2019 survey local PDF; Cerdeira 2020 S&P SoK local PDF.",
    path: ["Secure vs Non-secure world", "NS bit propagates over SoC", "secure monitor switches worlds", "TEE OS and TAs expose APIs", "real systems accumulate vulnerabilities", "CCA/RME tightens cloud boundary"],
    papers: [
      {
        key: "arm_trustzone_whitepaper",
        short: "Arm TrustZone WP",
        title: "ARM Security Technology: Building a Secure System Using TrustZone Technology",
        authors: "ARM Limited",
        venue: "Arm white paper, 2009",
        role: "foundational mechanism source",
        primaryContribution: "提出 Secure/Non-secure world、NS bit 与 SoC 级安全状态传播的基础模型。",
        boundary: "只支撑 TrustZone 基础模型；不能当作 CCA/RME/RMM 或云 CVM threat model。",
        evidenceBase: "Arm whitepaper PDF p.1-p.109; Figure 1-1, Figure 2-1, Figure 3-1.",
        titleEvidence: "README metadata; Arm TrustZone whitepaper title page.",
        summary: s(
          "白皮书的贡献是把安全从 CPU 指令扩展到 SoC 级资源标记: 每个总线 transaction 都带着安全状态。",
          [
            "动机: 移动/嵌入式系统要把 DRM、密钥、支付、启动和安全外设从普通 OS 中隔离出来。",
            "工作: 定义 Secure world / Non-secure world、NS bit、secure monitor、secure interrupt 和安全外设访问控制。",
            "数据: 它是 vendor architecture whitepaper，无实验数据；价值是机制定义和图示。"
          ],
          "Arm TrustZone whitepaper p.1-p.3 security concepts; Figure 2-1 SoC example; Figure 3-1 processor modes.",
          flow("TrustZone 基础路径", ["asset", "secure world", "NS bit", "secure monitor", "secure peripheral", "normal world OS"])
        ),
        background: s(
          "TrustZone 诞生背景不是云多租户，而是单设备内把安全服务和 rich OS 分开。",
          [
            "普通 OS 复杂、易被攻破；但系统仍需要显示、键盘、存储、基带、安全启动等安全敏感服务。",
            "安全边界必须跨 CPU、cache/TLB、内存控制器、DMA、debug 和 interrupt，而不能只在软件进程层做隔离。",
            "这解释了 TrustZone 为什么强调 SoC integration，而不是只定义一个 enclave 指令集。"
          ],
          "Arm TrustZone whitepaper p.1-p.2 security concepts; p.2 Figure 2-1 cellular handset SoC.",
          matrix("TrustZone 要保护的对象", [["密钥/证书", "Secure storage 或 crypto service"], ["安全外设", "secure display / keypad / sensor"], ["启动链", "secure boot and firmware"], ["普通 OS", "视为可被攻破的 non-secure software"]])
        ),
        core: s(
          "核心思想是把系统状态二分: Secure transaction 可以访问安全资源，Non-secure transaction 被硬件拒绝。",
          [
            "NS bit 是理解 TrustZone 最直接的抓手: 它让总线和外设知道一次访问来自哪个 world。",
            "Secure monitor 是世界切换入口，负责保存/恢复上下文，并让普通 OS 无法直接进入 secure services。",
            "缺点也很清楚: 一旦 trusted OS/TA/monitor 变复杂，TrustZone 的硬件边界无法自动修复软件漏洞。"
          ],
          "Arm TrustZone whitepaper Figure 3-1; processor security state and monitor mode discussion.",
          flow("Secure state propagation", ["CPU security state", "NS bit on transactions", "interconnect checks", "memory/peripheral access", "secure monitor call", "trusted service"])
        ),
        architecture: s(
          "架构总览是“双世界 + monitor + secure peripherals”: 普通 OS 仍运行大多数功能，安全服务在 secure world 中响应请求。",
          [
            "CPU 支持安全状态和 monitor mode；普通世界通过 SMC 请求安全服务。",
            "内存和外设由 TZASC/TZPC 等控制器按安全属性隔离，DMA 也必须遵守安全状态。",
            "中断和 debug 路径需要独立处理，否则 non-secure world 可以观察或打断 secure execution。"
          ],
          "Arm TrustZone whitepaper Figure 2-1 and Figure 3-1; chapters on memory, peripherals, interrupts, debug.",
          matrix("TrustZone 组件视图", [["CPU", "secure/non-secure state, monitor mode"], ["Interconnect", "propagates NS bit"], ["Memory controller", "secure region access control"], ["Peripheral", "secure-only or non-secure accessible"], ["Monitor", "world switch and context management"]])
        ),
        methods: [
          m("Secure / Non-secure World",
            "双世界模型让普通 OS 和安全服务共享 CPU，但硬件状态决定资源可见性。",
            ["Secure world 可以运行 trusted OS/firmware/TA；Non-secure world 运行 rich OS 和应用。", "世界切换不是进程切换，而是更底层的安全状态切换。", "这个模型简单直观，但 trusted side 过大时仍会累积漏洞。"],
            "Arm TrustZone whitepaper processor security state sections; Figure 3-1.",
            flow("world switch", ["normal app", "SMC", "secure monitor", "trusted service", "return to normal world"])),
          m("NS Bit 与 SoC Security State",
            "TrustZone 真正的硬件价值在于把安全属性带到总线和外设路径。",
            ["NS bit 附着在总线 transaction 上，内存控制器和外设据此决定是否授权。", "安全内存、外设、DMA 和 interrupt 都要按这个状态检查。", "如果某个外设或 DMA path 没有正确接入安全状态，就会破坏隔离。"],
            "Arm TrustZone whitepaper Figure 2-1; memory/peripheral security chapters.",
            matrix("NS bit 检查点", [["CPU", "生成安全状态"], ["Bus", "携带 transaction 属性"], ["Memory", "拒绝 non-secure 访问 secure region"], ["Peripheral", "只接受 secure transaction"], ["DMA", "必须被同样约束"]])),
          m("Secure Monitor / Interrupt / Debug",
            "monitor、interrupt 和 debug 是 TrustZone 能否落地的控制面。",
            ["Secure monitor 保存/恢复两个世界的上下文。", "FIQ/IRQ 路由影响安全任务是否能被普通世界干扰。", "debug/trace 必须锁定，否则攻击者可绕过软件隔离直接观察 secure world。"],
            "Arm TrustZone whitepaper monitor, interrupt and debug discussions.",
            cards("控制面检查表", ["SMC entry", "context save/restore", "secure interrupt routing", "debug lockdown", "secure boot handoff"]))
        ],
        evidenceEnv: s(
          "这是 vendor whitepaper，没有实验环境；应把它作为机制定义和历史背景，而不是性能或安全证明。",
          ["证据源: Arm 官方 PDF，本地已验证。", "可支撑: TrustZone 基础术语、SoC 级安全状态传播、双世界模型。", "不能支撑: CCA/RME/RMM、商业 TEE 具体实现安全性、漏洞统计或性能开销。"],
          "pdfinfo; Arm TrustZone whitepaper p.1-p.109.",
          matrix("证据边界", [["可支撑", "mechanism vocabulary"], ["不能支撑", "CCA/cloud CVM guarantees"], ["实验", "论文未提供"], ["PPT 用法", "背景和架构页"]])
        ),
        performance: s(
          "性能页应写成“无新实验”: 白皮书没有 benchmark，只能说明 TrustZone 把检查放进硬件路径以降低软件隔离成本。",
          ["不要为白皮书补造 latency 或 overhead 数字。", "可以讨论 qualitative trade-off: 硬件状态传播降低软件检查复杂度，但 secure world TCB 和 world switch 仍有工程成本。", "真实性能需要引用具体 TEE OS/SoC/系统论文。"],
          "Arm TrustZone whitepaper is architecture/vendor evidence; no benchmark table.",
          bars("claim strength", [{ label: "机制定义", value: "高", bar: 90 }, { label: "性能数字", value: "无", bar: 5 }, { label: "CCA 适用性", value: "低", bar: 20 }, { label: "历史背景", value: "高", bar: 92 }])
        ),
        evaluation: s(
          "评价: TrustZone 是 Arm TEE 的历史根基，但它的双世界模型不能直接满足云 confidential VM 的隔离需求。",
          ["优势: 简单、部署广、SoC 集成强，适合保护设备内密钥和安全服务。", "局限: secure world TCB 容易变大，TA/driver/API 漏洞会击穿安全服务。", "商业化潜力: 已长期服务移动和嵌入式生态；未来价值主要在和 CCA/RME 形成历史对照。"],
          "README evaluation; Arm TrustZone whitepaper architecture scope.",
          matrix("评价", [["优势", "成熟双世界硬件模型"], ["局限", "TCB 和接口复杂"], ["商业化", "移动/嵌入式长期落地"], ["本报告角色", "CCA 前史与边界对照"]])
        )
      },
      {
        key: "pinto2019trustzone",
        short: "Pinto 2019",
        title: "Demystifying Arm TrustZone: A Comprehensive Survey",
        authors: "Sandro Pinto and Nuno Santos",
        venue: "ACM Computing Surveys, 2019",
        role: "TrustZone ecosystem survey",
        primaryContribution: "系统梳理 TrustZone-assisted TEE 的硬件、软件栈、TEE OS、应用、虚拟化和研究生态。",
        boundary: "Survey 不提供一手系统实验；不能替代某个 commercial TEE 或 CCA 机制原文。",
        evidenceBase: "Pinto/Santos 2019 local PDF; Figure 1 TrustZone technology; Table 1 platforms.",
        titleEvidence: "README metadata; ACM Computing Surveys paper.",
        summary: s(
          "这篇 survey 的价值是把 TrustZone 从“一个硬件特性”讲成完整生态: hardware -> TEE OS -> TA -> application。",
          ["动机: TrustZone 被广泛使用，但资料分散在芯片、TEE OS、SDK、应用和学术原型里。", "工作: 解释 TrustZone 技术基础，并按系统软件、TEE、应用、虚拟化和安全问题组织 literature。", "数据: Table 1 总结平台，正文梳理多类 TEE OS 和研究系统。"],
          "Pinto/Santos 2019 Figure 1; Table 1; survey taxonomy sections.",
          flow("survey map", ["TrustZone hardware", "secure monitor", "TEE OS", "trusted applications", "normal-world client", "use cases / vulnerabilities"])
        ),
        background: s(
          "背景问题是 TrustZone 只提供硬件分区，真正的 TEE 安全取决于软件栈如何使用这个分区。",
          ["TEE OS、TA、client app、driver、RPC 和共享内存共同构成攻击面。", "不同厂商有不同 TEE OS 和 API，导致生态碎片化。", "研究系统常与商业部署的 threat model、接口和 TCB 不一致。"],
          "Pinto/Santos 2019 TrustZone architecture and software stack discussion.",
          matrix("TrustZone 生态层", [["硬件", "security extensions / NS bit"], ["monitor", "world switch"], ["TEE OS", "trusted services"], ["TA/API", "application-facing boundary"], ["normal OS", "client and driver"]])
        ),
        core: s(
          "核心洞察: TrustZone-assisted TEE 不是硬件单点机制，而是硬件能力、TEE OS、TA 生命周期和普通世界接口的组合系统。",
          ["读这类论文时要问: 哪些代码在 secure world，哪些接口暴露给 normal world。", "Trusted applications 越多，TEE OS 越像一个小 OS，漏洞面越接近传统系统软件。", "TrustZone 的生态谱系解释了为什么后续 Realm/CVM 希望减少高权限共享 TCB。"],
          "Pinto/Santos 2019 survey architecture; TEE OS and application sections.",
          cards("三层核心", ["硬件隔离", "TEE OS 服务", "TA/API 生态", "virtualization use", "security pitfalls"])
        ),
        architecture: s(
          "架构总览可画成 normal world client 通过 driver/RPC 调用 secure world TEE OS 和 TA。",
          ["Normal world 负责 UI、网络、文件系统和大部分应用逻辑。", "Secure world 负责密钥、crypto、secure storage、DRM、payment 等敏感服务。", "共享内存和 RPC 是跨世界交互关键，也是后续漏洞 SoK 的重点。"],
          "Pinto/Santos 2019 Figure 1 and TEE software stack discussion.",
          flow("TEE 调用路径", ["normal app", "TEE client API", "normal-world driver", "SMC/secure monitor", "TEE OS", "trusted application"])
        ),
        methods: [
          m("硬件与 Monitor 层分类",
            "Survey 先把 TrustZone 硬件能力解释清楚，再讨论软件如何建立 TEE。",
            ["处理器安全状态、secure monitor 和 interrupt routing 是所有系统的底座。", "内存和外设隔离决定 secure world 是否能保护密钥与 I/O。", "虚拟化扩展会改变 monitor 和 hypervisor 的分工。"],
            "Pinto/Santos 2019 Figure 1; hardware architecture sections.",
            matrix("硬件底座", [["CPU", "security state"], ["monitor", "world switch"], ["memory", "secure region"], ["peripheral", "secure device"], ["virtualization", "hypervisor support"]])),
          m("TEE OS / TA / API 分类",
            "TrustZone 的实用价值来自 TEE OS 和 TA 生态，但这也是 TCB 膨胀来源。",
            ["TEE OS 提供 scheduler、memory manager、crypto、secure storage 和 IPC。", "TA 使用 GlobalPlatform 或厂商 API 与普通世界交互。", "接口越多、TA 越复杂，攻击面越大。"],
            "Pinto/Santos 2019 sections on TEE systems and applications.",
            flow("TA lifecycle", ["load TA", "open session", "share memory", "invoke command", "return result", "close session"])),
          m("应用与虚拟化谱系",
            "Survey 把 TrustZone 放到移动、IoT、虚拟化和研究原型中比较，而不是只看一个 commercial TEE。",
            ["移动场景关注 DRM/payment/keystore。", "IoT 场景关注安全启动、远程管理和轻量 trusted service。", "虚拟化场景试图把 TrustZone 扩成多 OS 或多 VM 安全底座，但边界不同于 CCA。"],
            "Pinto/Santos 2019 application and virtualization sections.",
            cards("用例谱系", ["mobile payment", "DRM", "keystore", "IoT management", "secure boot", "virtualization"]))
        ],
        evidenceEnv: s(
          "这是一篇 peer-reviewed survey，不提供新系统实验；它适合当 TrustZone 生态地图。",
          ["证据源: ACM Computing Surveys 论文，本地 PDF。", "核心证据: Figure 1 架构图、Table 1 平台表，以及各类 TEE OS/应用分类。", "Claim strength: 适合支撑背景、生态和分类，不支撑具体实现安全证明。"],
          "pdfinfo; Pinto/Santos 2019 Figure 1 and Table 1.",
          matrix("证据边界", [["可支撑", "TrustZone ecosystem"], ["不能支撑", "commercial TEE bug-free"], ["实验", "无新实验"], ["用法", "背景/谱系/迁移成本"]])
        ),
        performance: s(
          "性能页应写成 survey boundary: 它汇总系统，不给统一 benchmark。",
          ["如果提及某个 TEE OS 或虚拟化系统性能，必须回到对应原始论文。", "Survey 本身可用于说明设计取舍: TCB、API、兼容性、虚拟化支持。", "不要把 survey 中的生态覆盖写成性能优势。"],
          "Pinto/Santos 2019 is a survey; no unified benchmark.",
          bars("claim strength", [{ label: "生态覆盖", value: "高", bar: 88 }, { label: "统一性能", value: "无", bar: 5 }, { label: "机制解释", value: "中", bar: 65 }, { label: "CCA 可替代性", value: "低", bar: 18 }])
        ),
        evaluation: s(
          "评价: 它是 TrustZone 入门和迁移背景的好材料，但不能回答 CCA 时代的云隔离问题。",
          ["优势: 系统化、覆盖面广，适合解释 TEE 软件栈和生态。", "局限: survey 发表较早，对 CCA/RME、Realm 和现代 confidential VM 不完整。", "商业化潜力: 帮助评估 legacy TrustZone API/TA 迁移、兼容性和审计成本。"],
          "README evaluation; survey scope.",
          matrix("评价", [["优势", "生态地图清晰"], ["局限", "非 CCA / 非一手实验"], ["商业化", "legacy TEE 迁移评估"], ["本报告角色", "TrustZone lineage bridge"]])
        )
      },
      {
        key: "cerdeira2020trustzone",
        short: "Cerdeira 2020",
        title: "SoK: Understanding the Prevailing Security Vulnerabilities in TrustZone-assisted TEE Systems",
        authors: "David Cerdeira, Nuno Santos, Pedro Fonseca, Sandro Pinto",
        venue: "IEEE Symposium on Security and Privacy (S&P) 2020",
        role: "TrustZone vulnerability SoK",
        primaryContribution: "把 commercial TrustZone-assisted TEE 的公开漏洞按组件、接口、根因和攻击链系统化。",
        boundary: "只支撑 TrustZone 漏洞谱系；不能推导 CCA/RME 一定存在相同漏洞。",
        evidenceBase: "Cerdeira 2020 local PDF; Figure 1/2 architecture; Table I and vulnerability taxonomy.",
        titleEvidence: "S&P 2020 paper title page; README metadata.",
        summary: s(
          "这篇 SoK 的贡献是说明: TrustZone 有硬件隔离不等于 TEE 系统没有漏洞。",
          ["动机: 数亿设备依赖 TrustZone TEE 保护 keystore、DRM、支付等敏感任务，但公开漏洞不断出现。", "工作: 系统化收集 disclosed vulnerabilities，分析 trusted OS、TA、driver、API 和 exploit chain。", "数据: Figure 1/2 展示软件架构，表格和案例把漏洞映射到组件与根因。"],
          "Cerdeira 2020 p.1 abstract; Figure 1 software architecture; Figure 2 detailed architecture; Table I.",
          flow("漏洞 SoK 分析线", ["collect disclosures", "map to TEE architecture", "classify components", "identify root causes", "build exploit chain", "derive lessons"])
        ),
        background: s(
          "研究背景是 TrustZone-assisted TEE 的接口太多: normal world 可以不断向 secure world 发送命令和共享数据。",
          ["Trusted OS 和 TA 被认为可信，但实际包含复杂 parser、IPC、driver 和 vendor code。", "Normal-world client/driver 可能被 attacker 控制，输入校验和共享内存边界成为关键。", "供应链和闭源生态让漏洞修复、审计和版本追踪更困难。"],
          "Cerdeira 2020 Figure 1 and Figure 2; overview sections.",
          matrix("主要攻击面", [["Client API", "malicious normal-world input"], ["Shared memory", "TOCTOU / validation gap"], ["Trusted OS", "kernel/service bug"], ["Trusted App", "parser and logic bug"], ["Driver", "device-specific privileged code"]])
        ),
        core: s(
          "核心洞察: TrustZone 漏洞通常不是 NS bit 失效，而是 secure-world 软件把不可信输入当成可信上下文处理。",
          ["攻击者常先控制 normal OS，再利用 TEE driver/API 触发 secure world bug。", "漏洞链可以从一个 TA 扩展到 trusted OS，再影响密钥、secure storage 或其他 TA。", "这就是后续 CCA/RME 强调更小管理面、更清晰 ownership 和 attestable lifecycle 的原因之一。"],
          "Cerdeira 2020 overview and vulnerability taxonomy sections.",
          flow("典型攻击链", ["compromise normal world", "send crafted TEE command", "abuse shared memory", "trigger TA/TEE OS bug", "escalate inside secure world", "extract/modify protected asset"])
        ),
        architecture: s(
          "架构总览应重画为 normal world clients、TEE driver、secure monitor、TEE OS、TA 和安全外设。",
          ["Figure 1 给出 TrustZone-assisted TEE 软件结构。", "Figure 2 展示多个 commercial TEE 的共同组件和差异。", "漏洞分类要绑定到组件，否则只能得到泛泛的“TEE 不安全”。"],
          "Cerdeira 2020 Figure 1 and Figure 2.",
          matrix("组件到风险", [["Normal world", "attacker-controlled client"], ["TEE driver", "command marshal/unmarshal"], ["Secure monitor", "world switch boundary"], ["TEE OS", "high-value kernel TCB"], ["TA", "vendor/service-specific parser"]])
        ),
        methods: [
          m("公开漏洞收集与归一化",
            "SoK 先把分散 CVE、报告和 exploit 整理成可比较的数据集。",
            ["不同厂商、TEE OS 和版本的漏洞命名不统一。", "作者把漏洞映射到组件、权限、攻击前提和安全影响。", "这种归一化让论文能从个案推导设计教训。"],
            "Cerdeira 2020 methodology and Table I.",
            cards("归一化字段", ["vendor", "TEE component", "entry point", "root cause", "impact", "exploit precondition"])),
          m("组件级 Root-Cause Taxonomy",
            "漏洞根因被放回 TEE 架构，而不是只按 CWE 标签罗列。",
            ["TA parser 和 command handlers 易受 untrusted input 影响。", "TEE OS service/driver bug 影响范围更大。", "共享内存、object handle 和权限检查是反复出现的边界错误。"],
            "Cerdeira 2020 vulnerability taxonomy sections.",
            matrix("根因到后果", [["Input validation", "TA compromise"], ["Memory safety", "code execution"], ["Access control", "cross-TA / service abuse"], ["Shared memory", "TOCTOU / confused deputy"], ["Update/patch", "long-lived exposure"]])),
          m("Exploit Chain 与设计教训",
            "SoK 的价值是说明小漏洞如何沿 TEE 组件串成高影响攻击链。",
            ["Normal world bug 不一定直接拿到密钥，但可作为进入 TEE API 的起点。", "TA compromise 可进一步攻击 TEE OS 或其他 trusted service。", "设计教训是缩小 TCB、隔离 TA、限制共享内存和强化接口验证。"],
            "Cerdeira 2020 exploit examples and lessons sections.",
            flow("从 bug 到资产泄露", ["normal-world foothold", "TEE command abuse", "TA memory corruption", "trusted OS primitive", "secure storage/key access", "persistent impact"]))
        ],
        evidenceEnv: s(
          "这是 peer-reviewed SoK，实验环境是公开漏洞 corpus 和架构归纳，而不是新 TEE 实现。",
          ["证据源: IEEE S&P 2020 PDF，本地验证。", "核心对象: commercial TrustZone-assisted TEEs、公开漏洞、架构组件和攻击案例。", "边界: 不能把 TrustZone 漏洞直接写成 CCA/RME 的一手证据，只能作为迁移动机。"],
          "pdfinfo; Cerdeira 2020 p.1-p.18.",
          matrix("证据边界", [["可支撑", "TrustZone vulnerability taxonomy"], ["不能支撑", "CCA/RME vulnerability proof"], ["实验", "无新系统 benchmark"], ["用法", "漏洞谱系和设计教训"]])
        ),
        performance: s(
          "性能页应写成风险覆盖页: 论文关注漏洞和攻击面，不测 latency/throughput。",
          ["没有可引用的系统性能结论。", "可视化应展示 claim strength: 漏洞分类强，性能 claim 弱。", "商业风险来自 patch lag、闭源 TCB 和 vendor-specific TA 生态。"],
          "Cerdeira 2020 SoK scope; no benchmark section.",
          bars("claim strength", [{ label: "漏洞 taxonomy", value: "高", bar: 92 }, { label: "攻击案例", value: "高", bar: 84 }, { label: "性能评估", value: "无", bar: 5 }, { label: "CCA 外推", value: "低", bar: 22 }])
        ),
        evaluation: s(
          "评价: 这篇 SoK 是 TrustZone 方向最重要的反面教材，说明硬件隔离必须配合小 TCB 和严格接口。",
          ["优势: 把真实漏洞放回架构组件，容易看出“错在哪里”。", "局限: 依赖公开披露，闭源系统和未公开漏洞覆盖不足。", "商业化潜力: 可转化为 TEE audit checklist、TA sandboxing 需求和 CCA 迁移论据。"],
          "Cerdeira 2020 conclusion; README evaluation.",
          matrix("评价", [["优势", "漏洞和组件绑定清楚"], ["局限", "公开披露偏差"], ["商业化", "审计/迁移 checklist"], ["本报告角色", "TrustZone 风险谱系"]])
        )
      }
    ]
  }
  ,
  {
    id: "03-arm-cca-rme-rmm",
    title: "Arm CCA / RME / RMM 基础架构",
    claim: "这个分类解释 Arm CCA 如何把 Arm 平台从 TrustZone 双世界扩展到面向云 CVM 的 Realm、Root world、granule ownership 和 RMM lifecycle。",
    background: [
      "先记住: CCA 的关键不是“多一个 secure world”，而是让 tenant Realm 对 host OS/hypervisor 不透明。",
      "RME/GPT 负责把物理内存 granule 分给 Normal/Realm/Root/Secure 等 security state，RMM 管 Realm 生命周期。",
      "本方向用 Li 2022 解释设计与验证，用 Arm CCA spec/RMM spec 固定官方术语和接口边界。"
    ],
    keyClaim: "主 SOTA 解释 CCA 为什么需要 Realm 和 granule ownership；两篇官方规范分别补齐架构语义和 RMM/RMI/RSI 生命周期。",
    keyPoints: [
      "Li 2022: 解释 Arm CCA 的设计动机、Realms、granule protection 和形式化验证思想。",
      "Arm CCA Specification: 官方架构来源，定义 Realm/RME/GPT 等公开概念。",
      "RMM Specification: 官方 monitor source，定义 RMI/RSI、Realm/REC/granule lifecycle。"
    ],
    evidence: "Li 2022 local PDF; Arm CCA/RMM README official source-page evidence, local PDF unavailable.",
    path: ["host/hypervisor untrusted", "Realm protects tenant state", "GPT assigns granules", "RMM controls lifecycle", "attestation reports initial state", "spec boundary limits claims"],
    papers: [
      {
        key: "li2022cca",
        short: "Li 2022 CCA",
        title: "Design and Verification of the Arm Confidential Compute Architecture",
        authors: "Xupeng Li et al.",
        venue: "OSDI 2022 / Arm CCA research paper",
        role: "foundational CCA architecture paper",
        primaryContribution: "提出并解释 Arm CCA 的 Realm 抽象、granule 访问控制和 RMM/host 分工。",
        boundary: "研究论文解释设计与验证；具体产品和最新规范语义仍需回官方 spec。",
        evidenceBase: "Li 2022 local PDF p.1-p.22; Figure 1 CCA architecture; Figure 2 granule delegation; Table 1 access-control policy; Table 2 RMI.",
        titleEvidence: "Li 2022 title page and README metadata.",
        summary: s(
          "Li 2022 的贡献是把“host 不可信”的云 threat model 落到 Arm 平台的 Realm、GPT 和 RMM 机制上。",
          ["动机: OS/hypervisor 传统上被信任，但云租户希望敏感 VM 对云管理员和 host software 不透明。", "工作: 引入 Realms、Root world、Granule Protection Table、RMM 和 Realm/host 接口。", "数据: 论文给出访问控制表、RMI 表和形式化设计验证思路，不是单纯性能论文。"],
          "Li 2022 p.1 abstract; Figure 1; Table 1; Table 2.",
          flow("CCA 设计管线", ["sensitive VM", "host becomes untrusted", "Realm abstraction", "GPT granule ownership", "RMM lifecycle", "attestation and verification"])
        ),
        background: s(
          "研究背景是 hypervisor 必须继续调度资源，但不应能读写 tenant VM 的机密状态。",
          ["传统虚拟化中 hypervisor 管页表、设备、调度和 VM 生命周期，拥有过强能力。", "TrustZone 双世界不能自然扩展到多租户云 VM，因为 secure world 不是为大量 CVM 管理设计。", "CCA 需要保留云平台可管理性，同时把内存内容和执行状态从 host 隔离。"],
          "Li 2022 p.1-p.2 introduction; Figure 1.",
          matrix("CCA 要拆开的权力", [["Host", "scheduling/resource allocation"], ["Realm", "tenant code/data confidentiality"], ["RMM", "lifecycle and access-control enforcement"], ["Monitor/Root", "highest privilege management"], ["Verifier", "attestation decision"]])
        ),
        core: s(
          "核心洞察: CCA 不是让 hypervisor 消失，而是让 hypervisor 只能管理“不可读”的 Realm 资源。",
          ["Granule ownership 是 CCA 最小安全单位；host 可请求 delegate/undelegate，但不能随意访问 Realm granule。", "RMM 是 Realm lifecycle 的安全仲裁者，RMI/RSI 把 host 与 Realm 的操作分开。", "这种分工是 CCA 后续 I/O、interrupt、container 和 accelerator 方案的基础。"],
          "Li 2022 Figure 2; Table 1 access-control policy; Table 2 RMI.",
          flow("谁能做什么", ["host requests resource action", "RMM checks granule state", "GPT enforces access", "Realm runs with protected state", "host schedules but cannot inspect", "attestation binds initial state"])
        ),
        architecture: s(
          "架构总览: CCA 增加 Realm world 和 Root world，让 RMM 管理 Realm，同时用 GPT 在硬件路径约束访问。",
          ["Figure 1 展示 CCA 在既有 Arm worlds 基础上增加 Realm。", "GPT/GPC 负责物理地址 granule 的 security state 检查。", "RMM 暴露 RMI 给 host、RSI 给 Realm，把管理操作和 guest service 分离。"],
          "Li 2022 Figure 1; Figure 2; Table 2.",
          matrix("CCA 组件", [["Realm", "tenant CVM execution"], ["RMM", "Realm lifecycle monitor"], ["GPT/GPC", "granule access control"], ["Host", "untrusted scheduling"], ["RMI/RSI", "management/service interfaces"]])
        ),
        methods: [
          m("Realm 与 Security State",
            "Realm 把 tenant VM 从 Normal world hypervisor 中隔离出来。",
            ["Realm world 是 CCA 的核心执行环境，目标是保护 VM 内存和 CPU state。", "Root world/RMM 拥有管理 Realm 的高权限，但需要保持小 TCB。", "Normal world host 仍可调度，但只能通过受控接口影响 Realm。"],
            "Li 2022 Figure 1 and Section on CCA architecture.",
            cards("worlds", ["Normal", "Realm", "Root", "Secure", "host remains manager", "Realm hides data"])),
          m("Granule Protection Table / GPC",
            "GPT/GPC 把物理内存按 granule 标记为不同 owner，是 CCA 防 host 读写的硬件根。",
            ["Host 请求 delegate granule 后，RMM/GPT 改变 granule security state。", "Access-control policy 决定哪个 world 能访问哪个 granule。", "错误的 granule transition 会直接破坏 Realm 隔离。"],
            "Li 2022 Figure 2; Table 1 CCA access-control policy.",
            flow("granule lifecycle", ["normal granule", "delegate request", "RMM validates", "GPT state changes", "Realm owns granule", "undelegate on teardown"])),
          m("RMM / RMI / RSI 分工",
            "RMM 是 CCA 软件 TCB 核心，接口设计决定 host 与 Realm 能否安全协作。",
            ["RMI 面向 host/hypervisor，用于创建 Realm、管理 granule、运行 REC。", "RSI 面向 Realm payload，用于获取服务和 attestation 相关信息。", "接口越小、状态机越清楚，越容易验证和实现。"],
            "Li 2022 Table 2 RMM Realm Management Interface.",
            matrix("接口边界", [["RMI", "host -> RMM management"], ["RSI", "Realm -> RMM services"], ["RMM", "checks lifecycle invariants"], ["Host", "cannot bypass GPT"], ["Realm", "does not trust host"]])),
          m("形式化验证与设计边界",
            "论文强调 CCA 的访问控制和状态转换需要可验证，而不是只靠实现约定。",
            ["验证对象主要是架构状态、granule transition 和访问控制不变量。", "这类证明支撑设计正确性，但不等于证明所有实现没有漏洞。", "PPT 中要把 formal design evidence 与产品/性能 evidence 分开。"],
            "Li 2022 verification sections; Table 1 access-control policy.",
            matrix("验证能/不能支撑", [["能", "access-control invariants"], ["能", "state transition sanity"], ["不能", "all firmware bugs absent"], ["不能", "I/O/device path complete"], ["处理", "回 spec and implementation"]]))
        ],
        evidenceEnv: s(
          "实验环境页应写成设计与验证证据: 论文不是在证明某一商用 CCA 服务器的完整性能。",
          ["证据源: 本地 PDF 22 页。", "核心证据: Figure 1/2、Table 1、Table 2、验证讨论。", "边界: I/O、device assignment、interrupt 和后续 RMM 规范细节需要其他材料补充。"],
          "pdfinfo; Li 2022 p.1-p.22.",
          matrix("证据边界", [["可支撑", "CCA base architecture"], ["不能支撑", "all deployment/I/O claims"], ["实验", "设计验证为主"], ["后续引用", "Arm spec/RMM spec"]])
        ),
        performance: s(
          "性能页要谨慎: Li 2022 的核心是架构和验证，不是给 CCA 全栈性能基准。",
          ["可讨论的性能相关点是 CCA 试图保留 host resource management 和 VM 兼容性。", "不可写成“CCA overhead 已被本文全面证明”。", "具体 container、accelerator、interrupt 和 memory-protection overhead 应分别引用 Shelter/RContainer/NanoZone/ACAI/Devlore 等论文。"],
          "Li 2022 scope and validation evidence.",
          bars("claim strength", [{ label: "架构定义", value: "高", bar: 92 }, { label: "形式化设计证据", value: "中高", bar: 75 }, { label: "全栈性能", value: "低", bar: 25 }, { label: "I/O 覆盖", value: "低", bar: 22 }])
        ),
        evaluation: s(
          "评价: Li 2022 是 CCA 方向主线材料，优势是边界清楚；局限是需要规范和系统论文补齐落地细节。",
          ["优势: 把 Realm/GPT/RMM/attestation 放进统一设计。", "局限: 不覆盖所有后续规范细节、设备路径和 commercial deployment。", "商业化潜力: 是 Arm server confidential computing 的基础，但依赖 RMM、firmware、OS、I/O ecosystem 成熟。"],
          "Li 2022 conclusion; README evaluation.",
          matrix("评价", [["优势", "CCA design spine"], ["局限", "非完整产品验证"], ["商业化", "Arm cloud CVM 基础"], ["本报告角色", "03 主 SOTA"]])
        )
      },
      {
        key: "arm_cca_spec",
        short: "Arm CCA spec",
        title: "Arm Confidential Compute Architecture Specification",
        authors: "Arm Limited",
        venue: "Arm official architecture specification source, 2025",
        role: "official specification SOTA",
        primaryContribution: "提供 Arm CCA/RME 公开架构术语和规范边界。",
        boundary: "本仓库无本地 PDF；只引用 README 已验证的官方 source-page 和公开概念，不写不可访问细节。",
        evidenceBase: "README official source-page evidence; local PDF unavailable.",
        titleEvidence: "reference/arm-confidential-computing/arm-cca-specification/README.md.",
        summary: s(
          "CCA spec 的作用是把论文里的设计语言固定成官方架构语言。",
          ["动机: 研究论文会解释为什么，规范定义什么状态、接口和约束是架构语义。", "工作: 公开描述 Realm/RME/GPT 等 CCA 概念和软件/硬件分工。", "数据: spec 是官方文档源，不提供系统实验；本地 PDF 不可用，claim 必须保守。"],
          "Arm CCA spec README: official Arm documentation page verified; local PDF unavailable.",
          cards("spec 用法", ["official terminology", "architecture boundary", "public concepts", "no local PDF", "no benchmark"])
        ),
        background: s(
          "背景问题是 CCA 讨论容易混用论文、实现和规范；spec 页必须固定术语边界。",
          ["Realm、RME、GPT、Root/RMM 等词在 slides 中必须按官方语义使用。", "如果规范 PDF 不在本地，不能引用未读细节。", "这页的价值是避免把论文推测写成标准事实。"],
          "Arm CCA spec README evidence class E0 official architecture source.",
          matrix("规范边界", [["官方术语", "可以引用"], ["未本地验证 PDF 细节", "不引用"], ["性能", "不提供"], ["产品行为", "需 vendor implementation source"]])
        ),
        core: s(
          "核心洞察: spec 是规则书，不是实验论文；它告诉我们哪些 CCA claim 可以被官方架构支撑。",
          ["Spec 强于论文的是规范权威性。", "Spec 弱于系统论文的是没有 workload、实现开销或 deployment 评估。", "在 PPT 中它应承担“术语校准”和“边界校准”的角色。"],
          "Arm CCA spec README.",
          flow("spec 证据链", ["official page", "public architecture concept", "slide terminology", "claim boundary", "implementation paper for details"])
        ),
        architecture: s(
          "架构总览按公开 CCA 概念绘制: Realm payload、RMM/Root、Normal host、GPT/GPC 和 attestation。",
          ["Host 继续管理资源但不读取 Realm 内容。", "RMM/Root 管 Realm lifecycle 和 granule state。", "GPT/GPC 在硬件路径执行访问控制。"],
          "Arm CCA public architecture concepts; Li 2022 Figure 1 as local detailed backup.",
          matrix("CCA spec 公开对象", [["Realm", "confidential payload"], ["RMM/Root", "lifecycle authority"], ["Normal host", "untrusted manager"], ["GPT/GPC", "granule access enforcement"], ["Attestation", "evidence to verifier"]])
        ),
        methods: [
          m("Realm / REC / Granule 术语固定",
            "Spec 的第一用途是把 slides 里的对象名标准化。",
            ["Realm 是保护域，不等同于 TrustZone secure world。", "REC 是 Realm execution context，负责运行 vCPU-like state。", "Granule 是内存 ownership 和状态转换的基本单位。"],
            "Arm CCA spec README; Li 2022 local PDF for concept explanation.",
            cards("terms", ["Realm", "REC", "Granule", "RME", "GPT", "RMM"])),
          m("访问控制语义",
            "Spec 让我们知道访问控制不是软件约定，而是架构状态和检查。",
            ["Granule state 决定哪个 security state 可以访问内存。", "Host 的管理请求必须经过 RMM/Monitor 的合法状态转换。", "这解释了为什么 CCA deployment 论文都围绕 granule、page table 和 RMM 接口做设计。"],
            "Arm CCA spec README; Li 2022 Table 1.",
            flow("access semantics", ["granule state", "request transition", "RMM validation", "hardware check", "allowed/denied access"])),
          m("Claim Boundary 管理",
            "因为本地没有 spec PDF，所有规范页必须显式写 evidence boundary。",
            ["可以说“官方 CCA source-page 已验证”。", "不能说“本文本地验证了某条具体 DEN0125 表格”。", "具体接口细节尽量回 Li 2022、RMM README 或本地可读论文。"],
            "Arm CCA spec README download status.",
            matrix("引用规则", [["可写", "public CCA concepts"], ["谨慎", "detailed state machine"], ["不可写", "unverified private tables"], ["替代", "local Li 2022/RMM sources"]]))
        ],
        evidenceEnv: s(
          "实验环境页写成“官方规范源，无本地 PDF”: 这是强规范证据，但不是可渲染论文证据。",
          ["来源: Arm DEN0125 official documentation page。", "本地状态: README 记录 PDF download unavailable/access-denied。", "处理: 只用公开概念，不用 unavailable details。"],
          "Arm CCA specification README download status.",
          matrix("证据状态", [["证据等级", "E0 official source"], ["本地 PDF", "unavailable"], ["实验", "无"], ["使用", "术语和规范边界"]])
        ),
        performance: s(
          "性能页应明确: 官方架构规范不提供性能数字。",
          ["任何 CCA overhead 都必须来自具体实现论文或产品文档。", "Spec 可说明可能影响性能的机制类别: granule transition、world switch、attestation、RMM call。", "但不能给出 benchmark 结论。"],
          "Arm CCA spec README; no local benchmark.",
          bars("claim strength", [{ label: "规范权威", value: "高", bar: 95 }, { label: "本地 PDF", value: "无", bar: 5 }, { label: "性能数据", value: "无", bar: 5 }, { label: "术语校准", value: "高", bar: 90 }])
        ),
        evaluation: s(
          "评价: CCA spec 是 03 的权威边界材料，但它必须和本地论文一起使用。",
          ["优势: 官方来源，适合校准术语和架构边界。", "局限: 本地 PDF 不可用，不能做细节页的唯一证据。", "商业化潜力: 代表 Arm confidential computing 标准化方向，但真实落地依赖 silicon、firmware、RMM 和云软件栈。"],
          "Arm CCA spec README.",
          matrix("评价", [["优势", "official source"], ["局限", "local PDF unavailable"], ["商业化", "Arm CCA ecosystem"], ["本报告角色", "术语和边界锚点"]])
        )
      },
      {
        key: "arm_rmm_spec",
        short: "Arm RMM spec",
        title: "Realm Management Monitor Specification",
        authors: "Arm Limited",
        venue: "Arm official RMM architecture specification source, 2025",
        role: "official RMM/RMI/RSI lifecycle source",
        primaryContribution: "定义 RMM、RMI、RSI 和 Realm lifecycle 的官方接口边界。",
        boundary: "本地 PDF 不可用；只引用公开 lifecycle 概念和 README 中记录的 source status。",
        evidenceBase: "RMM spec README official source-page/CDN URL verified; local PDF unavailable.",
        titleEvidence: "reference/arm-confidential-computing/realm-management-monitor-specification/README.md.",
        summary: s(
          "RMM spec 的价值是把 CCA 中最关键的软件 TCB 讲清楚: 谁创建 Realm，谁运行 REC，谁改变 granule state。",
          ["动机: Realm 需要 lifecycle manager，否则 untrusted host 可通过创建/销毁/调度路径影响安全边界。", "工作: 规范 RMI/RSI、Realm/REC/granule 管理和 monitor 分工。", "数据: 官方规范源，无新实验；本地 PDF 未保存。"],
          "RMM spec README; Li 2022 Table 2 as local interface context.",
          flow("RMM 生命周期", ["create Realm", "delegate granules", "create REC", "run Realm", "attest/measure", "destroy and undelegate"])
        ),
        background: s(
          "背景是 CCA 的硬件隔离必须有一个小而受控的管理者，否则 host 仍可通过生命周期操作绕过安全目标。",
          ["Host 需要请求创建/运行 Realm，但不应直接操控 Realm 私有状态。", "Realm payload 需要某些服务，但也不能信任 host。", "RMI/RSI 把这两类请求分开，是 RMM TCB 可审计的基础。"],
          "RMM spec README; Li 2022 RMM discussion.",
          matrix("RMM 要隔离的接口", [["RMI", "host management side"], ["RSI", "Realm service side"], ["Granule", "ownership state"], ["REC", "execution context"], ["Measurement", "attestation state"]])
        ),
        core: s(
          "核心洞察: RMM 是 CCA 安全边界的状态机；安全性来自合法状态转换，而不是单个函数调用。",
          ["Realm 创建前后，granule、REC、page tables 和 measurements 都有严格状态。", "Host 只能通过 RMI 请求，RMM 检查是否满足前置条件。", "Realm 通过 RSI 获取服务和 evidence，避免直接信任 normal world。"],
          "RMM spec README; Li 2022 Figure 2/Table 2.",
          flow("state-machine thinking", ["host RMI call", "check precondition", "update Realm/granule state", "run REC", "Realm RSI call", "attestation/evidence"])
        ),
        architecture: s(
          "架构总览: RMM 夹在 untrusted host 和 Realm 之间，向两边暴露不同接口。",
          ["Host side: RMI for creation, memory delegation, REC run and teardown。", "Realm side: RSI for Realm-visible services and reports。", "硬件 side: GPT/GPC enforce final access decisions。"],
          "RMM spec README; Li 2022 Table 2.",
          matrix("RMM 三面接口", [["Host-facing", "RMI"], ["Realm-facing", "RSI"], ["Hardware-facing", "GPT/GPC state"], ["Verifier-facing", "attestation evidence"], ["TCB", "RMM must stay small"]])
        ),
        methods: [
          m("Realm Creation / Destruction",
            "RMM 让 host 管生命周期，但 host 不能越过状态机直接读写 Realm。",
            ["创建 Realm 需要初始化 metadata、measurement 和 granule ownership。", "销毁 Realm 需要清理私有 granules，避免数据残留。", "这些步骤是后续 container/accelerator 论文必须兼容的底座。"],
            "RMM spec README lifecycle concepts.",
            flow("Realm lifecycle", ["allocate metadata", "delegate granules", "measure initial state", "activate Realm", "run REC", "teardown and scrub"])),
          m("REC Run 与 Scheduling",
            "Host 可以调度 Realm，但 REC state 的安全保存/恢复由 RMM 边界控制。",
            ["这保留了云平台调度能力。", "同时防止 hypervisor 直接读取 confidential register/memory state。", "Interrupt、device 和 scheduling 论文都在这个接口附近扩展。"],
            "RMM spec README; Li 2022 RMI/REC discussion.",
            matrix("调度分工", [["Host", "when to run"], ["RMM", "safe entry/exit"], ["REC", "Realm execution context"], ["Realm", "tenant workload"], ["风险", "interrupt/device interactions"]])),
          m("Attestation / Measurement",
            "RMM 生命周期必须产生 verifier 可用的初始状态证据。",
            ["测量绑定 Realm 初始配置、内存内容和平台状态。", "Verifier 依据 evidence 判断是否把 secret 交给 Realm。", "这也是 06 attestation 方向与 03 CCA 方向的连接点。"],
            "RMM spec README; Li 2022 attestation discussion.",
            flow("evidence path", ["Realm initial state", "RMM measurement", "platform attestation key", "report/token", "remote verifier", "secret release policy"]))
        ],
        evidenceEnv: s(
          "实验环境页写成规范证据状态: 官方 source 已记录，但本地 PDF 不可用。",
          ["证据源: Arm DEN0137 documentation page/CDN URL status recorded in README。", "可支撑: RMM/RMI/RSI lifecycle 公开概念。", "不能支撑: 未本地读取的具体表格、性能或实现细节。"],
          "RMM specification README download status.",
          matrix("证据状态", [["证据等级", "E0 official source"], ["本地 PDF", "unavailable"], ["实验", "无"], ["PPT 用法", "lifecycle/interface boundary"]])
        ),
        performance: s(
          "性能页应明确: RMM spec 不给 overhead，性能需看 RMM implementation 或系统论文。",
          ["RMI/RSI 调用、granule transition 和 REC exit/entry 可能影响性能。", "Spec 只能说明这些路径存在，不能给出开销数字。", "具体数据需要 Shelter/RContainer/NanoZone/Devlore/CAGE 等论文。"],
          "RMM spec README; no benchmark evidence.",
          bars("claim strength", [{ label: "接口语义", value: "高", bar: 94 }, { label: "生命周期边界", value: "高", bar: 88 }, { label: "性能数字", value: "无", bar: 5 }, { label: "实现安全", value: "需另证", bar: 35 }])
        ),
        evaluation: s(
          "评价: RMM spec 是 CCA 可信边界的状态机锚点，商业化成败取决于实现、小 TCB 和生态兼容。",
          ["优势: 清晰分离 host-facing 和 Realm-facing 接口。", "局限: 本仓库缺本地 PDF，不能展开未验证细节。", "商业化潜力: RMM 是 Arm CCA 云平台必需组件，但需要 formal assurance、patching、debug policy 和 device lifecycle 集成。"],
          "RMM spec README.",
          matrix("评价", [["优势", "lifecycle state machine"], ["局限", "local PDF unavailable"], ["商业化", "CCA runtime TCB"], ["本报告角色", "RMI/RSI 边界锚点"]])
        )
      }
    ]
  }
  ,
  {
    id: "04-arm-cca-deployment",
    title: "Arm CCA 细粒度隔离与部署模型",
    claim: "这个分类解释 CCA 如何从“保护整台 CVM”走向用户态隔离、容器隔离和进程内细粒度内存保护。",
    background: [
      "CCA 的原始抽象适合保护 confidential VM，但真实部署还需要把一个 VM 内的应用、容器、库和 session 数据继续隔离。",
      "本方向的三篇论文都在问同一个问题: 能否复用 CCA/RME 的 granule 和权限机制，减少 trusted OS/EL3 代码，同时保持低开销。",
      "阅读顺序是 Shelter 打开用户态隔离，RContainer 把容器变成 CCA-friendly 隔离单元，NanoZone 进一步做到进程内 domain。"
    ],
    keyClaim: "三篇论文形成粒度递进: Shelter 是 user-space app 隔离，RContainer 是 container 隔离，NanoZone 是 intra-process/intra-VM domain 隔离。",
    keyPoints: [
      "Shelter: 用 CCA/GPT/monitor 保护 Normal world 中的 SApp，目标是低 TCB 用户态安全应用。",
      "RContainer: 用 mini-OS、con-shim、mixed-pagetable 和 Shim-GPT 让容器获得更强隔离。",
      "NanoZone: 用 POE/PIE/PAS 组合把隔离粒度推进到进程内域，并优化 domain-switch cost。"
    ],
    evidence: "Shelter USENIX Security 2023 local PDF; RContainer NDSS 2025 local PDF; NanoZone arXiv 2025 local PDF.",
    path: ["CVM protects whole VM", "user-space app needs smaller TCB", "container needs OS-compatible isolation", "process needs per-domain memory", "permission switch cost matters", "deployment chooses granularity"],
    papers: [
      {
        key: "zhang2023shelter",
        short: "Shelter",
        title: "SHELTER: Extending Arm CCA with Isolation in User Space",
        authors: "Yiming Zhang et al.",
        venue: "USENIX Security 2023",
        role: "foundational user-space CCA isolation",
        primaryContribution: "把 CCA 的 Realm/Root 机制用于 Normal world 用户态安全应用隔离。",
        boundary: "不解决容器级完整隔离和进程内高频 domain switching；后续 RContainer/NanoZone 补齐。",
        evidenceBase: "Shelter local PDF p.1-p.20; Figure 1 CCA components; Figure 2 overview; Figure 3 multi-GPT; Table 1/2.",
        titleEvidence: "Shelter title page; README metadata.",
        summary: s(
          "Shelter 的贡献是把 Arm CCA 从保护整台 Realm VM 扩展到 Normal world 内的用户态 SApp。",
          ["动机: 传统 TrustZone 需要 trusted OS，CCA 保护 CVM 但不能直接保护普通 OS 内的单个安全应用。", "工作: 在 EL3 monitor 中管理 SApp，利用 GPT/GPC 和 multi-GPT 控制物理内存访问。", "数据: 论文在 emulator/SoC 上验证功能和性能，摘要报告真实 workload 开销小于 15%。"],
          "Shelter p.1 abstract; Figure 1; Figure 2; Figure 3; p.1 reports <15% overhead.",
          flow("Shelter 思路", ["normal OS hosts apps", "SApp requests protected execution", "Monitor configures GPT", "SApp memory becomes isolated", "OS remains mostly untrusted", "return to normal execution"])
        ),
        background: s(
          "研究背景是 CCA 的 Realm 粒度太粗，TrustZone trusted OS 又太重。",
          ["很多设备只需要保护少量 user-space security applications，而不是整台 VM。", "把完整 trusted OS 放进 secure world 增大 TCB。", "如果用 CCA 的 GPC/GPT 保护 Normal world 中的 SApp，就可能获得更轻的部署模型。"],
          "Shelter p.1-p.2 introduction; Figure 1; Table 1.",
          matrix("为什么需要 Shelter", [["TrustZone", "trusted OS TCB 大"], ["CCA Realm", "VM 粒度较粗"], ["普通进程", "受 host OS 控制"], ["目标", "user-space app isolation"], ["约束", "低开销/少修改"]])
        ),
        core: s(
          "核心洞察: 只要能让 SApp 的物理页在 GPT 上对 host 不可访问，就能在 Normal world 内构造一个轻量 TEE。",
          ["Monitor 使用独立 GPT 视图区分 SApp 和 host。", "GPC 对物理地址访问做最终判定，即使页表映射存在也不能绕过。", "难点是动态内存分配、系统调用、跨核执行和上下文切换。"],
          "Shelter Figure 2 and Figure 3; Table 1 and Table 2.",
          flow("SApp access control", ["SApp allocates memory", "monitor validates region", "SApp GPT grants access", "host GPT denies access", "GPC enforces on access", "SApp exits and releases"])
        ),
        architecture: s(
          "架构总览: Shelter 把 monitor 放在 EL3，用 multi-GPT 为 host 和 SApp 提供不同物理访问视图。",
          ["Host OS 继续管理普通应用和大部分资源。", "SApp 在 Normal world 执行，但其内存通过 S.GPT/host GPT 差异受保护。", "Monitor 负责创建、切换、验证和回收 SApp 的隔离状态。"],
          "Shelter Figure 2 overview; Figure 3 multi-GPT design.",
          matrix("Shelter 组件", [["SApp", "protected user-space app"], ["Host OS", "untrusted manager"], ["EL3 Monitor", "isolation controller"], ["S.GPT", "SApp-visible access"], ["Host GPT", "host no-access view"]])
        ),
        methods: [
          m("SApp 抽象与 Threat Model",
            "Shelter 把保护对象定义为用户态 SApp，而不是完整 VM 或 secure-world trusted OS。",
            ["SApp 保护数据和代码不被 host OS、hypervisor 或 privileged software 读取/篡改。", "DoS 和某些 side channel 不作为主要目标。", "这个抽象适合密钥处理、认证和轻量安全服务。"],
            "Shelter p.1-p.3 threat model and goals.",
            cards("SApp 边界", ["protected memory", "normal-world execution", "host untrusted", "monitor trusted", "low TCB"])),
          m("Multi-GPT 与 GPC Enforcement",
            "多 GPT 是 Shelter 的关键: 同一物理页在 SApp 视图可访问，在 host 视图不可访问。",
            ["每个 CPU core 可配置 GPC/GPT base，Shelter 利用这一点切换访问视图。", "Monitor 检查分配区域不重叠，并更新对应 GPT entries。", "GPC 让页表欺骗不能绕过物理访问权限。"],
            "Shelter Figure 3; Table 1 physical access permissions; Table 2 GPI encoding.",
            flow("multi-GPT flow", ["host allocates pages", "monitor checks", "update S.GPT access", "set host GPT no-access", "run SApp", "restore on exit"])),
          m("动态内存与系统交互",
            "真正难点是让 SApp 仍能使用 OS 服务，同时不把私有状态暴露给 OS。",
            ["SApp 需要分配/释放内存、处理 syscall、与 normal world 交换非敏感数据。", "Monitor 验证 allocation result，避免 host 分配重叠或恶意页。", "性能优化集中在减少 GPT 更新、上下文切换和跨核同步。"],
            "Shelter implementation sections; Figure 2/3.",
            matrix("交互风险", [["memory allocation", "host may return malicious overlap"], ["syscall", "needs declassification boundary"], ["multi-core", "GPT base per core"], ["context switch", "switch cost"], ["cleanup", "avoid stale access"]]))
        ],
        evidenceEnv: s(
          "Shelter 的实验环境包括 emulator 功能验证和硬件 SoC 性能评估；它是系统论文，不是规范。",
          ["证据源: USENIX Security 2023 PDF，本地验证。", "功能证据: CCA/GPT/GPC 模型、multi-GPT、SApp lifecycle。", "性能证据: 摘要报告真实 workload 小于 15% 开销，细节见实验 section。"],
          "Shelter p.1 abstract; p.1-p.20; Figure 2/3; experiments section.",
          matrix("实验/证据", [["平台", "emulator + Arm hardware SoC"], ["对象", "SApp isolation"], ["关键图", "Fig.2/Fig.3"], ["性能", "<15% workload overhead"], ["边界", "非 container/intra-process 全解"]])
        ),
        performance: s(
          "性能页可引用摘要级结论: Shelter 在真实 workload 上报告 modest overhead，小于 15%。",
          ["这个数字支撑 Shelter 作为轻量 user-space isolation 的可行性。", "不能把它外推到所有 CCA deployment 或 container workload。", "后续 RContainer/NanoZone 的比较说明更细粒度场景需要不同机制。"],
          "Shelter p.1 abstract reports <15% overhead; implementation/evaluation sections.",
          bars("Shelter 性能读法", [{ label: "reported workload overhead", value: "<15%", bar: 15 }, { label: "mechanism novelty", value: "高", bar: 85 }, { label: "container coverage", value: "低", bar: 25 }, { label: "intra-process switching", value: "低", bar: 20 }])
        ),
        evaluation: s(
          "评价: Shelter 是 CCA 细粒度隔离的起点，优势是轻量；局限是粒度和系统服务边界仍有限。",
          ["优势: 不需要完整 trusted OS，复用 CCA/GPC/GPT，机制边界容易理解。", "局限: SApp 抽象不是完整容器，系统调用和 I/O 仍需谨慎设计。", "商业化潜力: 适合设备内密钥服务、轻量安全模块和 CCA 用户态 SDK。"],
          "Shelter conclusion; README evaluation.",
          matrix("评价", [["优势", "lightweight CCA user-space TEE"], ["局限", "非容器/非进程内通用隔离"], ["商业化", "secure app SDK"], ["本方向角色", "foundation"]])
        )
      },
      {
        key: "zhou2025rcontainer",
        short: "RContainer",
        title: "RContainer: A Secure Container Architecture through Arm CCA",
        authors: "Qihang Zhou et al.",
        venue: "NDSS 2025",
        role: "container-level CCA deployment SOTA",
        primaryContribution: "用 mini-OS、con-shim、mixed-pagetable 和 Shim-GPT 在 CCA 上构建安全容器。",
        boundary: "聚焦 container 隔离；不等同于完整 CVM confidential I/O 或进程内任意 domain 切换。",
        evidenceBase: "RContainer local PDF p.1-p.19; Fig.1 architecture; Fig.2 mixed-pagetable; Fig.3 pagefault; Fig.4-8 evaluation; Table I threat model.",
        titleEvidence: "RContainer title page and README metadata.",
        summary: s(
          "RContainer 的贡献是把 CCA 的隔离能力包装成 container-friendly runtime，而不是让每个容器都变成重 VM。",
          ["动机: Docker 容器轻量但隔离弱；VM/microVM 隔离强但开销和部署成本高。", "工作: 设计 mini-OS、con-shim、mixed-pagetable、Shim-GPT 和控制流保护。", "数据: 论文报告真实应用开销常在 4%-7%，Memcached/MySQL 等部分 workload 更低，生命周期操作大多低于 5%。"],
          "RContainer p.1 abstract; Fig.1; Fig.2; Fig.5; Fig.7; Table I.",
          flow("RContainer 管线", ["container request", "mini-OS manages con-shim", "mixed page table", "Shim-GPT isolates memory", "deprivileged OS provides services", "container runs with stronger boundary"])
        ),
        background: s(
          "背景问题是容器安全和轻量性长期冲突: 强隔离通常靠 VM，轻量容器通常共享 OS。",
          ["容器共享 host kernel，恶意容器可通过 kernel interface、procfs 或 namespace escape 攻击。", "把每个容器放进 VM 会损失容器快速启动和高密度部署优势。", "CCA 提供新的物理地址空间权限，可能让容器以更低成本获得更强边界。"],
          "RContainer introduction; Table I threat model.",
          matrix("容器隔离难点", [["Docker", "lightweight but weak isolation"], ["VM", "strong but heavy"], ["CCA", "hardware PAS/GPT checks"], ["目标", "strong isolation + container UX"], ["风险", "OS/mini-OS TCB split"]])
        ),
        core: s(
          "核心洞察: RContainer 不是把 OS 整体放进 TCB，而是用 mini-OS 管安全关键路径，让 deprivileged OS 继续提供普通服务。",
          ["mini-OS 维护内存管理和控制流保护。", "deprivileged OS 与 mini-OS 同级运行，但通过 mixed-pagetable 和 GPT-routing 隔离。", "con-shim 是容器级隔离单元，负责承接容器执行状态。"],
          "RContainer Fig.1 and Fig.2; design sections.",
          flow("TCB split", ["mini-OS trusted core", "con-shim per container", "deprivileged OS services", "mixed-pagetable boundary", "Shim-GPT permissions", "container workload"])
        ),
        architecture: s(
          "架构总览: RContainer 用 mini-OS + con-shim + mixed-pagetable 代替传统 full OS TCB。",
          ["Fig.1 展示 RContainer architecture。", "Fig.2 展示 shared page table 但不同 GPT 的 mixed-pagetable 机制。", "Fig.3 展示 pagefault workflow，让 fast path 尽量少进入高权限逻辑。"],
          "RContainer Fig.1-Fig.3.",
          matrix("RContainer 组件", [["mini-OS", "trusted memory/control-flow manager"], ["con-shim", "container isolation unit"], ["deprivileged OS", "service provider"], ["mixed-pagetable", "same page table, different GPT"], ["GPT-routing", "maps container to Shim-GPT"]])
        ),
        methods: [
          m("Mini-OS 与 Con-Shim",
            "mini-OS 只保留容器隔离所需的关键能力，减少高权限 TCB。",
            ["con-shim 表示一个轻量 container security context。", "mini-OS 管理 con-shim memory、控制流和 pagefault fast path。", "deprivileged OS 负责服务但不能直接篡改 mini-OS/con-shim。"],
            "RContainer Fig.1; design section around mini-OS and con-shim.",
            cards("TCB 最小化", ["mini-OS", "con-shim", "deprivileged OS", "container", "control-flow protection"])),
          m("Mixed-Pagetable / Shim-GPT",
            "mixed-pagetable 是 RContainer 的核心: 页表可共享，物理访问权限由不同 GPT 视图隔离。",
            ["deprivileged OS 维护页表，mini-OS 通过 GPT-routing 绑定容器与 Shim-GPT。", "容器运行前切到对应 GPT，阻止其他容器或 OS 访问私有页。", "这避免了频繁重建页表带来的高开销。"],
            "RContainer Fig.2 mixed-pagetable; GPT-routing table discussion.",
            flow("mixed-pagetable flow", ["shared page table", "container lookup GPT index", "switch to Shim-GPT", "run container", "GPC checks access", "return to service OS"])),
          m("Pagefault 与 Lifecycle Fast Path",
            "系统要可用，pagefault、创建、销毁和 OS 切换必须足够轻。",
            ["Fig.3 区分快/慢 pagefault workflow。", "Table VIII 报告 OS switch、con-shim creation/termination 和 Set GPI 等 micro-cost。", "Fig.7 显示 docker lifecycle overhead 大多低于 5%，docker kill 最高约 8.5%。"],
            "RContainer Fig.3; Table VIII; Fig.7.",
            matrix("runtime path", [["pagefault", "fast/slow path"], ["OS switch", "about 492 us"], ["con-shim create", "about 530 us"], ["Set GPI", "4KB page cost"], ["docker lifecycle", "mostly <5%, kill ~8.5%"]]))
        ],
        evidenceEnv: s(
          "RContainer 的实验环境覆盖 FVP 与 Armv8 hardware SoC，并测 lmbench、应用容器和 lifecycle。",
          ["证据源: NDSS 2025 PDF，本地验证。", "功能证据: threat model matrix、architecture、mixed-pagetable、pagefault workflow。", "性能证据: Fig.4 lmbench、Fig.5 应用、Fig.6 对比、Fig.7 lifecycle、Fig.8 kbuild。"],
          "RContainer p.1-p.19; Fig.1-Fig.8; Table I/VIII/IX.",
          matrix("实验对象", [["平台", "ARMv9-A FVP + ARMv8 hardware SoC"], ["microbench", "lmbench"], ["apps", "Apache/Nginx/Hackbench/Memcached/MySQL/Netperf"], ["lifecycle", "docker create/start/pause/rm/kill"], ["边界", "模拟部分 Shelter comparison"]])
        ),
        performance: s(
          "性能页的核心数字: 真实应用 Apache/Nginx 约 4%-7% 平均约 5%，Memcached 稳定约 0.3%，MySQL 约 0.2%-0.3%，Netperf 低于 3%。",
          ["RContainer 相比 virtualization 在大应用上明显低开销，论文称 virtualization 可超过 50%。", "生命周期操作大多低于 5%，docker kill 约 8.5%。", "Hackbench 和 IPC encryption 是较高开销路径，需要单独解释。"],
          "RContainer Fig.5; Fig.7; lines around evaluation report 4%-7%, 0.3%, 0.2%-0.3%, <3%, kill ~8.5%.",
          bars("RContainer 性能读法", [{ label: "Apache/Nginx overhead", value: "4%-7%", bar: 7 }, { label: "Memcached", value: "~0.3%", bar: 3 }, { label: "MySQL", value: "0.2%-0.3%", bar: 3 }, { label: "Netperf", value: "<3%", bar: 3 }, { label: "docker kill", value: "~8.5%", bar: 9 }])
        ),
        evaluation: s(
          "评价: RContainer 是 CCA 容器化部署的重要一步，优势是低开销；风险是 mini-OS 和兼容层仍需要工程成熟。",
          ["优势: 容器抽象清楚，mixed-pagetable 解决了强隔离与轻量性的冲突。", "局限: 需要改 OS/runtime 路径，设备/I/O 和复杂容器生态仍是挑战。", "商业化潜力: 可服务 cloud container confidential computing，但依赖 Arm CCA silicon、RMM、container runtime 和运维工具链。"],
          "RContainer conclusion and evaluation.",
          matrix("评价", [["优势", "container-friendly CCA isolation"], ["局限", "runtime/OS integration"], ["商业化", "confidential container platform"], ["本方向角色", "deployment SOTA"]])
        )
      },
      {
        key: "liu2025nanozone",
        short: "NanoZone",
        title: "NanoZone: Scalable and Efficient Secure Memory Protection for Arm CCA",
        authors: "Shiqi Liu et al.",
        venue: "arXiv preprint, 2025",
        role: "fine-grained memory protection SOTA",
        primaryContribution: "把 CCA 保护粒度推进到进程内 domain，使用 POE/PIE/PAS 组合优化 domain switching。",
        boundary: "arXiv/preprint；机制与性能需等待 peer review，不能当作标准或商用产品证据。",
        evidenceBase: "NanoZone local PDF p.1-p.17; Figure 1 comparison; Figure 2 domain switching; Figure 3 POE/PIE overlay; Table 1.",
        titleEvidence: "NanoZone title page and README metadata.",
        summary: s(
          "NanoZone 的贡献是解决 CCA CVM 内部的更细粒度问题: 一个进程或服务内部的不同数据域也需要隔离。",
          ["动机: CCA 保护整个 CVM，RContainer/Shelter 仍难阻止同一进程内的 bug 泄露 session key。", "工作: 利用 POE、PIE、PAS 和 root-world monitor 构建进程内多 domain memory protection。", "数据: 论文报告 POE domain switch 约 20 cycles，domain-switch latency 约为 privileged switches 的 4.87%，Nginx 约 22.67% overhead，但相对无隔离 baseline 额外开销约 4.40%。"],
          "NanoZone p.1 abstract; Figure 1; Figure 2; Figure 3; p.1 reports 20% overhead/95% throughput and domain-switch numbers.",
          flow("NanoZone 思路", ["CVM still too coarse", "split process memory into domains", "POE fast user switch", "PIE/PAS for stronger boundary", "root monitor prevents abuse", "case studies evaluate overhead"])
        ),
        background: s(
          "背景是 intra-VM/intra-process bug: 即使 VM 对 host 保密，VM 内部组件之间仍会互相伤害。",
          ["Heartbleed 类漏洞说明进程内 private data 需要更细粒度隔离。", "传统 MPK/PKU 类机制切换快，但难覆盖 kernel/OS adversary。", "CCA PAS/GPT 强但切换重，NanoZone 试图组合快路径和强路径。"],
          "NanoZone p.1 introduction; Figure 1 comparison; Table 1.",
          matrix("粒度对比", [["CVM", "protects whole VM"], ["Container/SApp", "process or container boundary"], ["MPK-like", "fast but OS-sensitive"], ["NanoZone", "domain within process"], ["风险", "domain-switch abuse"]])
        ),
        core: s(
          "核心洞察: 高安全边界和低切换开销不能只靠一种机制，NanoZone 用 POE 快速切换，用 PIE/PAS 兜底。",
          ["POE 类似 protection key，适合用户态快速 domain switching。", "PIE/PAS 提供更强隔离但切换代价高。", "root-world monitoring 和 interrupt rerouting 防止 OS 篡改权限寄存器或滥用切换。"],
          "NanoZone p.2-p.5 design; Figure 2 and Figure 3.",
          flow("fast + strong path", ["POE fast switch", "PIE permission indirection", "PAS boundary when needed", "root monitor validates", "interrupt rerouted", "domain abuse blocked"])
        ),
        architecture: s(
          "架构总览: NanoZone 在 user-mode 提供 PIM/permission switch，在 root world 监控 page table 和权限状态。",
          ["Figure 3 展示 permission indirection and overlay。", "PIM 由用户态专用指令写，减少陷入内核。", "Root-world module 监控 page table updates 和 interrupt control flow。"],
          "NanoZone Figure 3; design sections 4.x.",
          matrix("NanoZone 组件", [["POE", "fast user-level domain"], ["PIE", "permission indirection"], ["PAS", "CCA physical address space"], ["PIM", "permission index map"], ["Root module", "anti-abuse monitor"]])
        ),
        methods: [
          m("POE Fast Domain Switching",
            "NanoZone 把高频 domain switch 留在用户态，避免每次 trap/flush。",
            ["论文报告 POE domain switch 约 20 cycles。", "Figure 2 的 Memcached 场景显示 96.72% switch hit rate 在 POE domain 内。", "这解释了为什么它适合 session key、per-client data 等高频访问隔离。"],
            "NanoZone p.2-p.3; Figure 2; lines reporting ~20 cycles and 96.72% hit rate.",
            bars("fast path", [{ label: "POE switch", value: "~20 cycles", bar: 10 }, { label: "POE hit rate", value: "96.72%", bar: 97 }, { label: "privileged switch latency share", value: "4.87%", bar: 5 }])),
          m("PIE / PAS Strong Boundary",
            "当 POE 不够强时，NanoZone 用 PIE/PAS 组合把权限绑定到 CCA 更强的地址空间语义。",
            ["PIE 提供 permission indirection，减少 domain 数量限制。", "PAS/GPT 提供 CCA 物理访问控制兜底。", "代价是跨 PIE/PAS 的切换比 POE 慢，需要减少频率。"],
            "NanoZone Figure 3; p.2-p.5 POE/PIE/PAS design.",
            matrix("机制分工", [["POE", "fast user switch"], ["PIE", "permission indirection"], ["PAS", "strong CCA boundary"], ["Root monitor", "prevents corruption"], ["Policy", "keep most switches in POE"]]))
          ,
          m("Domain-Switch Abuse 防护",
            "如果攻击者能滥用切换指令，进程内隔离会失效；NanoZone 因此增加 root-world 监控。",
            ["监控 page table updates，防止 OS 改映射破坏域。", "监控/重定向 interrupt control flow，保护权限状态。", "限制 unauthorized domain switch，避免 attacker 进入不属于自己的 domain。"],
            "NanoZone security challenge discussion around domain-switching abuse.",
            flow("abuse defense", ["attacker tries switch", "permission state checked", "page table update monitored", "interrupt enters root path", "unauthorized access blocked", "domain state restored"]))
        ],
        evidenceEnv: s(
          "NanoZone 的证据包括 emulator 功能版本和 Arm development board 性能 variant；但发表状态是 arXiv。",
          ["证据源: arXiv 2025 PDF，本地验证。", "核心图表: Figure 1 比较、Figure 2 switching scenarios、Figure 3 POE/PIE overlay、Table 1。", "评估对象: microbenchmarks、Nginx、Memcached、NVM protection 等 case studies。"],
          "NanoZone p.1-p.17; Figure 1-Figure 3; evaluation section.",
          matrix("实验/证据", [["状态", "arXiv preprint"], ["平台", "emulator + Arm dev boards"], ["micro", "domain switch"], ["apps", "Nginx/Memcached/NVM"], ["边界", "needs peer review"]])
        ),
        performance: s(
          "性能页的谨慎读法: POE switch 很快，跨 PIE/PAS 仍重；真实应用开销与切换路径分布强相关。",
          ["论文报告 POE switch 约 20 cycles，domain-switch latency 约为 privileged switches 的 4.87%。", "Nginx experienced 22.67% overhead，但相对无隔离 baseline 的额外 overhead 约 4.40%。", "摘要还报告保留 95% throughput / about 20% overhead，应标注 preprint evidence。"],
          "NanoZone p.1 abstract; Figure 2; evaluation text reporting 20 cycles, 4.87%, 22.67%, 4.40%, 95% throughput.",
          bars("NanoZone 关键数字", [{ label: "POE switch", value: "~20 cycles", bar: 8 }, { label: "privileged switch share", value: "4.87%", bar: 5 }, { label: "Nginx overhead", value: "22.67%", bar: 23 }, { label: "extra vs baseline", value: "4.40%", bar: 5 }, { label: "throughput retained", value: "95%", bar: 95 }])
        ),
        evaluation: s(
          "评价: NanoZone 是最细粒度的一篇，设计有启发性，但 preprint 状态和硬件依赖需要谨慎。",
          ["优势: 把 CCA、POE/PIE 和进程内隔离结合，抓住 domain-switch 成本核心。", "局限: arXiv 状态；机制依赖新硬件/寄存器语义和 root-world monitor。", "商业化潜力: 适合 confidential server 内 session key、tenant data、library sandbox；落地需要 compiler/runtime/OS 配合。"],
          "NanoZone conclusion and README evaluation.",
          matrix("评价", [["优势", "fine-grained isolation"], ["局限", "preprint + hardware dependency"], ["商业化", "per-session/per-library isolation"], ["本方向角色", "granularity frontier"]])
        )
      }
    ]
  }
  ,
  {
    id: "05-arm-cca-io-accelerator-interrupt",
    title: "Arm CCA I/O、DMA、Accelerator、Interrupt",
    claim: "这个分类解释 CCA 保护 CPU/内存后，为什么设备 DMA、PCIe accelerator 和 interrupt 仍会把机密边界撕开。",
    background: [
      "先记住: CVM 不是孤岛，它要和 GPU/FPGA/NPU、SMMU、PCIe、interrupt controller 和 driver 交互。",
      "设备能 DMA、发 interrupt、执行 kernel、持有 device memory；如果这些路径不受保护，host 仍能通过 offload path 影响 Realm。",
      "本方向用 ACAI 讲 accelerator memory path，用 Devlore 讲 interrupt path，用 Accelerator SoK 建立更一般的 device TEE taxonomy。"
    ],
    keyClaim: "三篇材料分别覆盖 data path、control path 和 taxonomy: ACAI 解决 CCA accelerator access，Devlore 解决 device interrupt injection，SoK 提供 access/memory/attestation/TCB 总框架。",
    keyPoints: [
      "ACAI: 扩展 CCA security invariants 到 PCIe accelerator，避免 bounce-buffer/software encryption 成为瓶颈。",
      "Devlore: 用 delegate-but-check 保护 physical/virtual interrupt lifecycle，防 hypervisor 注入恶意中断。",
      "Accelerator TEE SoK: 把 access control、memory encryption、attestation、TCB/compatibility 作为设备侧 checklist。"
    ],
    evidence: "ACAI local PDF; Devlore local PDF; Wang/Huang 2026 Accelerator TEE SoK local PDF.",
    path: ["Realm protects CPU memory", "device wants DMA", "accelerator executes workload", "interrupts signal completion", "host controls I/O stack", "trusted I/O needs memory + interrupt + attestation"],
    papers: [
      {
        key: "acai2023",
        short: "ACAI",
        title: "ACAI: Protecting Accelerator Execution with Arm Confidential Computing Architecture",
        authors: "Supraja Sridhara et al.",
        venue: "ACM CCS / Arm CCA accelerator research, 2023",
        role: "CCA accelerator data-path foundation",
        primaryContribution: "提出让 CCA Realm 安全使用 GPU/FPGA 等 accelerator 的机制和 security invariants。",
        boundary: "聚焦 accelerator access/data path；interrupt lifecycle 和通用 device attestation 需要 Devlore/SoK 补充。",
        evidenceBase: "ACAI local PDF p.1-p.20; Figure 1 access modes; Table 1 copy/encryption comparison; Figure 2 GPC; Figure 3 attacks/protection.",
        titleEvidence: "ACAI title page and README metadata.",
        summary: s(
          "ACAI 的贡献是让 accelerator 成为 CCA Realm 可安全使用的一等资源，而不是把数据复制到普通世界 bounce buffer。",
          ["动机: CVM 需要 GPU/FPGA/NPU 加速，但 CCA 默认设备不能直接访问 Realm memory。", "工作: 扩展 CCA invariants 到 device-side access，结合 PCIe/IDE、device-side GPC 和 driver compatibility。", "数据: 摘要报告 GPU 平均 43.5% overhead、FPGA 平均 12.1%；系统其他部分开销 3.8%/1.9%。"],
          "ACAI p.1 abstract; Figure 1; Table 1; Figure 2; Figure 3.",
          flow("ACAI 目标", ["Realm app uses accelerator", "avoid plaintext bounce buffer", "protect PCIe/device path", "device-side access checks", "bind keys/attestation", "run GPU/FPGA workload"])
        ),
        background: s(
          "背景问题是 accelerator 既需要访问 Realm 数据，又可能被 untrusted hypervisor 配置或观察。",
          ["Integrated mode 性能好，但设备直接访问 Realm memory 会突破 CCA 默认假设。", "Encrypted/bounce-buffer mode 安全些，但需要额外 copy 和 software encryption。", "外接 PCIe accelerator 需要保护 DMA、device memory 和 bus traffic。"],
          "ACAI p.1-p.2; Figure 1 access modes; Table 1.",
          matrix("三种访问模式", [["Integrated", "direct device access, minimal copy"], ["Encrypted/bounce", "extra copies + software crypto"], ["ACAI", "device-side GPC + protected bus"], ["风险", "hypervisor/device path"], ["目标", "security + compatibility"]])
        ),
        core: s(
          "核心洞察: CCA 的 granule protection 不能只停在 CPU，必须扩展到 device-side transaction。",
          ["Device-side GPC 根据 GPT 限制设备访问 Realm memory。", "PCIe IDE/硬件加密保护链路数据，避免 software encryption/copy。", "Attestation report 需要绑定 device-side keys 和 accelerator configuration。"],
          "ACAI p.2-p.4; Figure 2 GPC in Arm CCA; Figure 3 attacks/protection.",
          flow("device-side invariant", ["Realm granule owner", "device request", "device-side GPC checks GPT", "PCIe IDE protects link", "accelerator executes", "result returns to Realm"])
        ),
        architecture: s(
          "架构总览: ACAI 修改 CCA simulator/TF-A/RMM/hypervisor 相关路径，让 Realm 与 GPU/FPGA 协同。",
          ["Figure 1 对比 integrated/encrypted/ACAI access modes。", "Figure 2 说明 CCA GPC 接口和 RMM/hypervisor/monitor 关系。", "Figure 3 展示设备访问 Realm memory 的攻击与 ACAI 防护。"],
          "ACAI Figure 1-Figure 3.",
          matrix("ACAI 组件", [["Realm VM", "confidential workload"], ["Accelerator", "GPU/FPGA execution"], ["Device-side GPC", "DMA access check"], ["PCIe IDE", "link crypto"], ["RMM/TF-A", "CCA lifecycle integration"]])
        ),
        methods: [
          m("Access Mode Comparison",
            "ACAI 先把 integrated、encrypted 和 ACAI 三条路径讲清楚，方便理解为什么 bounce buffer 慢。",
            ["Integrated 没有额外 copy，但 threat model 不够。", "Encrypted path 有两次额外 copy 和 software encryption/decryption。", "ACAI 目标是保留硬件加密与 direct path 优势，同时加 device-side checks。"],
            "ACAI Figure 1; Table 1.",
            matrix("路径对比", [["Integrated", "fast but unsafe for untrusted host"], ["Encrypted", "safe-ish but copy/crypto heavy"], ["ACAI", "hardware protected direct access"], ["PPT 结论", "data path must be first-class"]])),
          m("Device-Side GPC 与 Security Invariants",
            "设备访问 Realm memory 前必须像 CPU 一样通过 granule protection checks。",
            ["Device-side GPC 把 GPT restriction 转成 device access checks。", "不允许设备越权访问其他 Realm 或 host memory。", "invariants 系统化描述哪些 device operation 是安全的。"],
            "ACAI Figure 2 and Figure 3; security invariants discussion.",
            flow("GPC enforcement", ["device issues memory request", "lookup granule state", "check assigned share", "allow/deny DMA", "log/bind configuration", "protect result path"])),
          m("Attestation / Key Binding / Compatibility",
            "ACAI 不能只做访问控制，还要让 verifier 相信设备侧配置与密钥绑定正确。",
            ["论文提到把 device-side encryption keys 和配置绑定到 attestation report。", "保留现有 accelerator driver/application 兼容性是设计目标。", "原型展示 GPU 和 FPGA 两类 accelerator。"],
            "ACAI p.2 contributions; implementation/evaluation sections.",
            cards("落地要件", ["device key binding", "attestation report", "existing drivers", "GPU", "FPGA", "open-source prototype"]))
        ],
        evidenceEnv: s(
          "ACAI 的实验环境是 CCA simulator 原型加 GPU/FPGA workload；不是量产 CCA CPU 上的产品测量。",
          ["证据源: 本地 PDF 20 页。", "实现: 基于 Arm public simulator/TF-A/RMM/hypervisor 修改，展示 GPU 和 FPGA。", "边界: 论文指出 CCA production CPUs 当时不可用，因此 performance 是 prototype evidence。"],
          "ACAI p.1-p.2; implementation/evaluation sections.",
          matrix("实验边界", [["平台", "Arm public simulator + prototype"], ["设备", "GPU and FPGA"], ["关键图", "Fig.1-Fig.3"], ["性能", "43.5% GPU / 12.1% FPGA"], ["边界", "not production silicon"]])
        ),
        performance: s(
          "性能页的关键数字: ACAI 保护 GPU 平均 43.5% overhead、FPGA 平均 12.1%；对系统其他部分分别约 3.8% 和 1.9%。",
          ["GPU overhead 较高，说明 accelerator path 安全不是免费。", "FPGA overhead 较低，说明开销与 device/workload/data movement 相关。", "这些数字来自 prototype evaluation，不能外推到所有 PCIe accelerator。"],
          "ACAI p.1-p.2 reports 43.5%, 12.1%, 3.8%, 1.9%; evaluation section.",
          bars("ACAI 关键数字", [{ label: "GPU protected workload", value: "43.5%", bar: 44 }, { label: "FPGA protected workload", value: "12.1%", bar: 12 }, { label: "rest system GPU mode", value: "3.8%", bar: 4 }, { label: "rest system FPGA mode", value: "1.9%", bar: 2 }])
        ),
        evaluation: s(
          "评价: ACAI 是 CCA accelerator path 的基础论文，优势是问题抓得准；局限是原型和设备生态仍早期。",
          ["优势: 把 device-side access 纳入 CCA invariants，不再只靠 bounce buffer。", "局限: 生产硬件、设备 attestation、TDISP/SPDM、driver TCB 仍需补齐。", "商业化潜力: 适合 confidential AI/GPU/FPGA cloud，但依赖 vendor accelerator 和 PCIe trusted I/O 生态。"],
          "ACAI conclusion and README evaluation.",
          matrix("评价", [["优势", "first-class accelerator access"], ["局限", "prototype / ecosystem gap"], ["商业化", "confidential GPU/FPGA cloud"], ["本方向角色", "data-path anchor"]])
        )
      },
      {
        key: "bertschi2026devlore",
        short: "Devlore",
        title: "DEVLORE: Device Interrupt Protection for Confidential VMs",
        authors: "Andrin Bertschi et al.",
        venue: "Preprint / CCA device interrupt research, 2026",
        role: "device interrupt protection SOTA",
        primaryContribution: "提出保护 confidential VM device interrupt lifecycle 的 delegate-but-check 机制。",
        boundary: "聚焦 interrupt path；不解决 accelerator memory encryption 或完整 trusted device attestation。",
        evidenceBase: "Devlore local PDF p.1-p.21; Figure 1 attacks; Figure 2 design; Figure 3 GIC configuration; Table 1/2/3.",
        titleEvidence: "Devlore title page and README metadata.",
        summary: s(
          "Devlore 的贡献是补上 CCA device path 的控制面缺口: 恶意 hypervisor 可以伪造或操纵中断。",
          ["动机: CCA 保护 CVM 内存，但 integrated devices 需要 interrupt；hypervisor 控 GIC/vGIC 会产生 fake interrupt 风险。", "工作: delegate interrupt management to hypervisor, but trusted software checks correctness。", "数据: FVP 原型，四类设备，约 7k LoC 改动；stress workload overhead up to 1%，glmark2 GPU case overhead 0.06%。"],
          "Devlore p.1 abstract; Figure 1; Figure 2; Figure 3; Table 1/2/3.",
          flow("Devlore 问题路径", ["device raises interrupt", "GIC routes physical interrupt", "hypervisor virtualizes", "attacker may inject fake IRQ", "trusted checker validates", "CVM receives only valid interrupt"])
        ),
        background: s(
          "背景问题是 memory isolation 和 interrupt isolation 不一样: 设备绑定一次内存后仍会在运行时不断发中断。",
          ["Hypervisor 通常管理 GIC 配置、virtual interrupt 注入和优先级。", "攻击者可注入 fake physical/virtual interrupts 影响 CVM control flow。", "CVM 需要设备完成通知，但不能信任 host 的 interrupt bookkeeping。"],
          "Devlore p.1-p.3; Figure 1.",
          matrix("Interrupt attack surface", [["GIC config", "hypervisor controlled"], ["physical IRQ", "device-originated but routable"], ["virtual IRQ", "host-injected to CVM"], ["runtime", "continuous delivery"], ["目标", "valid device IRQ only"]])
        ),
        core: s(
          "核心洞察: 不必把所有 interrupt 管理都搬进 TCB；可以让 hypervisor 继续管理，但由 trusted side 记录和检查。",
          ["Devlore 保护 registration、physical-to-virtual mapping 和 runtime delivery。", "Trusted software 记录 device/interrupt assignment，检查 physical 和 virtual interrupt 是否匹配。", "这种 delegate-but-check 保留兼容性，减少 driver 改动。"],
          "Devlore p.1-p.2 contributions; Figure 2 design.",
          flow("delegate-but-check", ["hypervisor configures GIC", "trusted side records assignment", "physical IRQ arrives", "check origin/number", "validate virtual IRQ", "deliver to CVM"])
        ),
        architecture: s(
          "架构总览: Devlore 在 CCA/RMM/GIC 路径上增加 interrupt isolation state，不改应用和 device driver。",
          ["Figure 1 展示 Arm interrupt architecture 和攻击。", "Figure 2 展示 Devlore design: isolation, physical interrupt record, virtual interrupt check。", "Table 1 给出 device lifecycle API，Table 2 给 driver compatibility。"],
          "Devlore Figure 1-Figure 3; Table 1 and Table 2.",
          matrix("Devlore 组件", [["CVM", "interrupt receiver"], ["Device", "valid IRQ source"], ["Hypervisor", "delegated manager"], ["Trusted checker", "assignment + validation"], ["GIC/vGIC", "physical/virtual routing"]])
        ),
        methods: [
          m("Interrupt Lifecycle Modeling",
            "Devlore 把 interrupt 从 registration 到 delivery 拆成 lifecycle，而不是只防一次注入。",
            ["Registration: 设备和 interrupt number 被绑定。", "Mapping: physical IRQ 到 virtual IRQ 的关系被记录。", "Delivery: runtime 检查是否为合法设备产生的 interrupt。"],
            "Devlore p.1-p.3; Figure 2.",
            flow("interrupt lifecycle", ["register device IRQ", "record physical IRQ", "configure virtual mapping", "receive physical interrupt", "check virtual injection", "deliver to CVM"])),
          m("Physical 与 Virtual Interrupt 双检查",
            "攻击可以发生在 physical IRQ 或 virtual IRQ 层，因此两层都要检查。",
            ["设备不能伪造未分配给自己的 interrupt number。", "Hypervisor 不能向 CVM 注入未被 trusted side 认可的 virtual interrupt。", "GIC 配置流需要额外验证，防止 fake route。"],
            "Devlore Figure 1 attacks; Figure 3 GIC configuration flow.",
            matrix("双检查", [["Physical IRQ", "origin / number assignment"], ["Virtual IRQ", "CVM-visible injection"], ["GIC config", "trusted validation"], ["Attack", "fake IRQ blocked"], ["Compatibility", "driver unchanged"]]))
          ,
          m("兼容性与最小改动",
            "设计目标是不改应用和设备驱动，只在 CCA/GIC/RMM 相关路径加检查。",
            ["论文报告约 7k LoC 改动。", "Table 2 展示多类 device-driver compatibility。", "FVP 上评估四类设备和多个 use case。"],
            "Devlore p.2 contributions; Table 2; implementation/evaluation sections.",
            cards("工程目标", ["no app changes", "no device driver changes", "~7k LoC", "four devices", "Arm FVP", "integrated GPU case"]))
        ],
        evidenceEnv: s(
          "Devlore 的实验环境是 Arm FVP 和 Arm board performance prototype；CCA production CPU 不可用需明确标注。",
          ["证据源: 本地 PDF 21 页。", "平台: CCA-enabled FVP，另有 Arm board performance prototype。", "对象: 四类设备、interrupt stress、glmark2 GPU case、driver compatibility。"],
          "Devlore p.1-p.2; Figure 1-Figure 3; Table 1-3; evaluation section.",
          matrix("实验边界", [["平台", "Arm FVP + Arm board prototype"], ["设备", "four diverse devices"], ["改动", "~7k LoC"], ["性能", "up to 1%, 0.06%"], ["边界", "pre-production CCA"]])
        ),
        performance: s(
          "性能页核心数字: sustained interrupt load 下 overhead up to 1%；glmark2 integrated GPU application overhead 0.06%。",
          ["这些数字说明 interrupt checking 可以很轻，但只覆盖 Devlore 的 interrupt path。", "不能把它外推为完整 device confidential I/O overhead。", "设备 memory path、attestation 和 driver TCB 仍需 ACAI/SoK/TDISP 类材料补充。"],
          "Devlore p.1-p.2 reports up to 1% and 0.06%; evaluation section.",
          bars("Devlore 关键数字", [{ label: "interrupt stress overhead", value: "up to 1%", bar: 5 }, { label: "glmark2 GPU overhead", value: "0.06%", bar: 1 }, { label: "code changes", value: "~7k LoC", bar: 35 }, { label: "driver changes", value: "none", bar: 5 }])
        ),
        evaluation: s(
          "评价: Devlore 把 CCA I/O 讨论从 DMA 扩展到 interrupt，设计清晰但仍是早期原型。",
          ["优势: 抓住 interrupt lifecycle，保留 hypervisor 管理能力且最小改动。", "局限: 不处理 DMA confidentiality、device attestation、TDISP/SPDM 和 malicious device firmware。", "商业化潜力: 适合 mobile/edge/cloud integrated devices，但依赖 GIC/RMM/OS upstream 和硬件实现。"],
          "Devlore conclusion and README evaluation.",
          matrix("评价", [["优势", "interrupt lifecycle protection"], ["局限", "not full I/O security"], ["商业化", "integrated devices for CVM"], ["本方向角色", "control-path anchor"]])
        )
      },
      {
        key: "sok-tee",
        short: "Accelerator SoK",
        title: "SoK: Analysis of Accelerator TEE Designs",
        authors: "Chenxu Wang, Junjie Huang, Yujun Liang, Xuanyao Peng, Yuqun Zhang, Fengwei Zhang, Jiannong Cao, Hang Lu, Rui Hou, Shoumeng Yan, Tao Wei, Zhengyu He",
        venue: "NDSS 2026",
        role: "accelerator/device TEE taxonomy bridge",
        primaryContribution: "用 51-study corpus 总结 accelerator TEE 的 access control、memory encryption、attestation、TCB/compatibility。",
        boundary: "它是 SoK/taxonomy，不替代 ACAI、Devlore、TDISP、SPDM、IDE 或具体 GPU/FPGA/NPU 原文。",
        evidenceBase: "Wang/Huang 2026 local PDF; Table I; Figure 1/2; Table III; Figure 3/5/6; Table X-XIII.",
        titleEvidence: "Accelerator SoK title page; README metadata.",
        summary: s(
          "这篇 SoK 在 05 中的作用是把 ACAI 和 Devlore 放到更大设备侧 TEE 设计空间里。",
          ["动机: accelerator TEEs 多数只覆盖特定 CPU/accelerator，缺少通用比较框架。", "工作: 分析 51 studies，归纳 Host-type/Acc.-type/Mix-type 和三类安全机制。", "数据: Table I corpus，Table III security solutions，Table X-XIII TCB/compatibility。"],
          "Wang/Huang 2026 p.1-p.4; Table I; Figure 1/2; Table III.",
          flow("SoK 分析线", ["51-study corpus", "architecture type", "attack vectors", "access control", "memory encryption", "attestation", "TCB/compatibility"])
        ),
        background: s(
          "背景是 CCA 设备路径不只包含 Arm-specific 方案，GPU/NPU/DPU/FPGA 都有类似可信边界问题。",
          ["AI 和高性能 workload 越来越依赖 accelerator。", "CPU TEE 只保护 CPU-side memory/execution，offload 后数据进入 device memory/bus/queue。", "设备侧缺身份、attestation 或 memory protection 时，CVM 仍不完整。"],
          "Wang/Huang 2026 p.1-p.4; Figure 1/2.",
          matrix("设备侧问题", [["Access", "who can access task/device memory"], ["Memory", "host/device/link protection"], ["Attestation", "device identity and firmware"], ["TCB", "driver/runtime size"], ["Compatibility", "single-device designs"]])
        ),
        core: s(
          "核心洞察: accelerator TEE 至少同时回答 access control、memory encryption、attestation；只解决 DMA 不够。",
          ["ACAI 偏 memory/data path，Devlore 偏 interrupt/control path。", "SoK 提醒还要看 device HRoT、endorser、reference values、driver TCB 和 multi-device compatibility。", "05 方向因此不能只讲 Arm CCA，还要和 TDISP/SPDM/IDE 关联。"],
          "Wang/Huang 2026 Table III; Figure 3; Figure 5/6; Table X-XIII.",
          cards("三大机制 + 两个部署维度", ["Access Control", "Memory Encryption", "Attestation", "TCB size", "Compatibility"])
        ),
        architecture: s(
          "架构总览: SoK 把 accelerator TEE 分成 Host-type、Acc.-type 和 Mix-type。",
          ["Host-type 复用 CPU TEE 和 host-side trusted component。", "Acc.-type 在 accelerator controller/firmware/hardware 内做保护。", "Mix-type 同时依赖 CPU-side 和 device-side root of trust，更接近商用 trusted I/O。"],
          "Wang/Huang 2026 Figure 1.",
          matrix("三类架构", [["Host-type", "CPU-side TEE dominates"], ["Acc.-type", "accelerator-side controller"], ["Mix-type", "CPU + device trust chain"], ["05 映射", "ACAI/Devlore fit into device path"], ["边界", "SoK not a spec"]])
        ),
        methods: [
          m("Access Control Taxonomy",
            "Access control 不是单个 allow/deny，而是 CPU TEE、firmware、I/O bus、device controller 的组合。",
            ["Table III/IV/V 比较不同 SAC 机制和部署偏好。", "云端 discrete accelerator 更依赖 CPU-side + bus/device checks。", "endpoint integrated accelerator 更常依赖 firmware/monitor 和 platform hardware。"],
            "Wang/Huang 2026 Table III-IV-V.",
            matrix("Access layers", [["CPU TEE", "CVM/enclave policy"], ["TSM/RMM", "manager checks"], ["I/O bus", "DMA/MMIO filter"], ["Accelerator", "controller/kernel auth"], ["Driver", "TCB pressure"]])),
          m("Memory Encryption / Attestation",
            "设备侧保护必须覆盖 host memory、device memory、I/O link 和 metadata。",
            ["Figure 3 展示 memory encryption workflow。", "Figure 5/6 和 Table VIII/IX 展示 attestation process 和缺口。", "缺 HRoT/endorser/reference values 会导致伪造设备或错误固件被信任。"],
            "Wang/Huang 2026 Figure 3; Figure 5/6; Table VI-IX.",
            flow("device evidence path", ["CPU TEE report", "device HRoT", "firmware measurement", "endorser", "reference values", "verifier policy"])),
          m("TCB / Compatibility Lens",
            "SoK 最适合提醒 PPT: device TEE 最大部署障碍往往是 driver/runtime TCB 和兼容性。",
            ["Table X-XIII 总结 TCB size、software stack 和 compatibility。", "很多系统只支持单一 accelerator 或特定 CPU。", "商用落地需要减少高权限代码、支持 plug-and-play 和标准化 lifecycle。"],
            "Wang/Huang 2026 Table X-XIII.",
            matrix("部署瓶颈", [["Driver/runtime TCB", "large / sometimes closed"], ["Single accelerator", "43/51 studies"], ["Specific CPU", "40/51 studies"], ["Source availability", "12/51 source"], ["Commercial gap", "standards + orchestration"]]))
        ],
        evidenceEnv: s(
          "SoK 的实验环境页应写成 corpus 与 evidence boundary: 它不是一个新的 CCA device implementation。",
          ["证据源: NDSS 2026 PDF，本地验证。", "Corpus: 51 accelerator TEE studies, GPU/NPU/TPU/FPGA/general accelerator/industry designs。", "边界: 具体性能、协议和安全证明必须回原始论文或规范。"],
          "Wang/Huang 2026 Table I; p.2-p.15.",
          matrix("证据边界", [["可支撑", "design taxonomy"], ["不能支撑", "specific system proof"], ["实验", "SoK corpus + illustrative analysis"], ["用法", "checklist for 05/14"]])
        ),
        performance: s(
          "性能页引用 SoK 时要谨慎: Figure 4 是 granularity mismatch 的 illustrative analysis，不是通用 benchmark。",
          ["论文报告 secure initialization overhead 47.88%-73.45%。", "secure communication overhead 40.36%-44.94%。", "结论是 memory-encryption granularity 需要贴合 accelerator access pattern。"],
          "Wang/Huang 2026 Figure 4.",
          bars("SoK Figure 4", [{ label: "secure initialization", value: "47.88%-73.45%", bar: 73 }, { label: "secure communication", value: "40.36%-44.94%", bar: 45 }, { label: "universal benchmark", value: "否", bar: 8 }, { label: "design warning", value: "高", bar: 90 }])
        ),
        evaluation: s(
          "评价: 这篇 SoK 是 05 的 taxonomy 补丁，让 Arm CCA I/O 讨论不局限于单个 GPU/FPGA 方案。",
          ["优势: RQ + corpus + tables 非常适合做设备侧 checklist。", "局限: 不能替代 ACAI、Devlore 或 TDISP/SPDM/IDE 规范。", "商业化潜力: 支撑 confidential AI/GPU cloud/DPU offload 的产品规划，但依赖标准化和 vendor support。"],
          "Wang/Huang 2026 conclusion; README evaluation.",
          matrix("评价", [["优势", "device TEE design space"], ["局限", "secondary evidence"], ["商业化", "confidential accelerator roadmap"], ["本方向角色", "taxonomy bridge"]])
        )
      }
    ]
  }
  ,
  {
    id: "06-attestation-boot-lifecycle",
    title: "Attestation、Boot、Lifecycle",
    claim: "这个分类解释远程 verifier 如何判断一个设备、TEE 或 CVM 是否处在可接受状态: 先有 measurement，再有 evidence，再有 appraisal policy。",
    background: [
      "Attestation 不是一句“我可信”，而是 attester 产生 evidence，verifier 用 endorsements/reference values/appraisal policy 判断。",
      "早期 SWATT 说明软件 attestation 的挑战，RATS 给出现代通用角色模型，VRASED 展示硬件/软件协同验证的 RA 设计。",
      "在 CCA/CoVE/TEE-I/O 里，boot/lifecycle/evidence chain 决定 verifier 何时释放 secret。"
    ],
    keyClaim: "三篇材料分别给出历史起点、标准架构和 verified co-design: SWATT 是软件 RA 起点，RATS 是通用角色语言，VRASED 是可验证 RA 实现代表。",
    keyPoints: [
      "SWATT: 用 timing-bound challenge-response 检查嵌入式设备 memory contents。",
      "RATS RFC: 定义 Attester/Verifier/Relying Party、Evidence、Endorsements、Reference Values、Appraisal。",
      "VRASED: 用 HW/SW co-design、LTL/NuSMV 和 F* verified HMAC 构建 formally verified RA。"
    ],
    evidence: "SWATT local PDF; RATS architecture RFC PDF; VRASED USENIX Security 2019 local PDF.",
    path: ["device boots", "measurement collected", "attester signs evidence", "verifier appraises claims", "relying party releases access", "runtime/lifecycle changes require new evidence"],
    papers: [
      {
        key: "seshadri2004swatt",
        short: "SWATT",
        title: "SWATT: Software-based Attestation for Embedded Devices",
        authors: "A. Seshadri et al.",
        venue: "IEEE Symposium on Security and Privacy, 2004",
        role: "foundational software attestation",
        primaryContribution: "提出无需安全协处理器的 software-only memory attestation 思路。",
        boundary: "适用于受限嵌入式假设；不适合直接作为现代 TEE/CVM attestation 充分证据。",
        evidenceBase: "SWATT local PDF p.1-p.12; Figure 1 memory verification attack; Figure 2 external memory verification.",
        titleEvidence: "SWATT title page and README metadata.",
        summary: s("SWATT 的贡献是把 attestation 作为 challenge-response memory verification 问题提出。",
          ["动机: 低成本嵌入式设备没有 TPM/secure coprocessor，但 verifier 仍想知道 memory 是否被篡改。", "工作: 设计 software verification procedure，让 verifier 根据 challenge、expected memory 和 timing 判断设备状态。", "数据: 论文以嵌入式 memory architecture 与 timing 假设为核心，没有现代 TEE benchmark。"],
          "SWATT p.1 introduction; Figure 1; Figure 2.",
          flow("SWATT 管线", ["verifier sends random challenge", "device runs checksum over memory", "response returns within timing bound", "verifier recomputes expected response", "mismatch or delay indicates compromise"])),
        background: s("背景问题是 verifier 不能直接读取设备 memory，只能让可能已被攻破的设备自证。",
          ["简单 hash/MAC 会被 malware 通过保存 clean copy、搬移恶意代码或延迟计算绕过。", "SWATT 依赖小型 MCU、已知 clock/memory architecture 和无虚拟内存等假设。", "这个背景解释了后续 RA 为什么要加入硬件 root of trust。"],
          "SWATT problem definition; Figure 1 memory verification attack.",
          matrix("SWATT 假设", [["设备", "low-end embedded"], ["verifier", "knows expected memory"], ["attacker", "software compromise"], ["关键约束", "timing + architecture"], ["排除", "hardware modification"]])),
        core: s("核心洞察: 软件 attestation 的安全性不仅看 response 是否正确，还看 response 是否按预期时间产生。",
          ["如果 attacker 把恶意代码藏到别处再计算 clean memory hash，时间会变慢。", "Verification routine 必须遍历 memory，减少 attacker 预测和跳过。", "这种 timing assumption 是强限制，也是 SWATT 后续被硬件 RA 替代的重要原因。"],
          "SWATT design sections; Figure 2.",
          flow("timing security", ["random challenge", "memory traversal", "tight checksum loop", "expected execution time", "response check", "delay detection"])),
        architecture: s("架构总览是 verifier 与 prover 的外部 memory verification protocol。",
          ["Verifier 持有 expected memory image 和 challenge。", "Prover 运行 verification code 并返回 response。", "没有硬件 key isolation；可信性来自 timing、architecture knowledge 和 communication assumption。"],
          "SWATT Figure 2.",
          matrix("RA 角色雏形", [["Verifier", "expected memory + challenge"], ["Prover", "untrusted embedded device"], ["Evidence", "timed checksum response"], ["Secret", "none / software-only"], ["Risk", "strong assumptions"]])),
        methods: [
          m("Challenge-Response Memory Checksum", "SWATT 把 memory attestation 设计成一次随机挑战驱动的 checksum。", ["Challenge 防止预计算 response。", "Checksum 覆盖 code/static data/config。", "Verifier 本地重算 expected response。"], "SWATT p.1-p.4; Figure 2.", flow("checksum", ["challenge", "verification routine", "read memory", "compute response", "return", "verify"])),
          m("Timing-Bound Security", "时间上界是 SWATT 的安全核心，也是最大脆弱点。", ["Attacker 用 clean copy 或重定位 malware 会增加执行时间。", "Verifier 需要知道设备 clock 和 memory architecture。", "网络 jitter 或复杂 CPU 会破坏假设。"], "SWATT security discussion.", matrix("时间假设", [["能支撑", "simple MCU"], ["难支撑", "complex OS/network"], ["攻击", "relocation/copy"], ["检测", "slowdown"], ["边界", "not modern cloud RA"]])),
          m("Legacy Device Trade-off", "SWATT 的价值是低成本和 legacy-friendly，但缺少硬件 root of trust。", ["不需要安全协处理器。", "可用于早期 sensor/smartcard/PDA 场景。", "不能提供密钥保护、secure boot 或 runtime isolation。"], "SWATT use cases and limitations.", cards("取舍", ["software only", "low cost", "legacy device", "timing fragile", "no hardware key"]))
        ],
        evidenceEnv: s("SWATT 的实验/证据是早期嵌入式软件 attestation 设计，不是现代 TEE 平台评估。",
          ["证据源: S&P 2004 PDF，本地验证。", "核心图: Figure 1 attack, Figure 2 verification procedure。", "边界: timing 假设强，不能外推到 CCA/CoVE/RATS without hardware root。"], "SWATT p.1-p.12.", matrix("证据边界", [["可支撑", "software RA history"], ["不能支撑", "modern TEE evidence"], ["性能", "timing-based not benchmark"], ["角色", "foundational"]])),
        performance: s("性能页应写成 timing constraint 页: SWATT 的性能本身就是安全假设的一部分。",
          ["过慢可能意味着 malware 搬移或模拟。", "过复杂平台会让 timing bound 难以可靠判断。", "不应把 SWATT 写成现代 remote attestation 性能基线。"], "SWATT timing discussion.", bars("claim strength", [{ label: "历史价值", value: "高", bar: 90 }, { label: "现代适用", value: "低", bar: 25 }, { label: "硬件 root", value: "无", bar: 5 }, { label: "timing dependency", value: "高", bar: 85 }])),
        evaluation: s("评价: SWATT 是 RA 思想起点，但它也清楚暴露了纯软件 attestation 的脆弱假设。",
          ["优势: 成本低、概念清楚、奠定 verifier/prover/challenge-response 语言。", "局限: 依赖 timing、简单硬件和无物理攻击；缺少密钥隔离。", "商业化潜力: 更像历史教材；现代产品应采用硬件 RoT、measured boot 和标准 RATS/EAT。"], "SWATT conclusion; README evaluation.", matrix("评价", [["优势", "software RA foundation"], ["局限", "strong timing assumptions"], ["商业化", "legacy/educational"], ["本方向角色", "history anchor"]]))
      },
      {
        key: "rats_rfc",
        short: "RATS",
        title: "Remote Attestation Procedures (RATS) Architecture",
        authors: "Henk Birkholz, Dave Thaler, Michael Richardson, Ned Smith, Wei Pan",
        venue: "IETF RFC 9334 / RATS Architecture, 2023",
        role: "standard attestation architecture",
        primaryContribution: "定义远程证明的通用角色、证据对象和 appraisal 数据流。",
        boundary: "架构 RFC 不定义某个 TEE 的具体 claim 内容、签名格式或性能。",
        evidenceBase: "RATS architecture local PDF; Figure 1 conceptual data flow; Table 1 events over time.",
        titleEvidence: "RATS RFC title page and README metadata.",
        summary: s("RATS 的贡献是把不同平台的 attestation 统一成 Attester、Verifier、Relying Party 和 Evidence/Appraisal 语言。",
          ["动机: TPM、TEE、device、cloud 都需要证明状态，但协议和 claim 格式不同。", "工作: 定义 Attester、Verifier、Relying Party、Endorser、Reference Value Provider 等角色。", "数据: 这是 RFC architecture document，无实验；Figure 1 是核心数据流。"], "RATS Figure 1; Table 1.", flow("RATS data flow", ["Attester collects claims", "Evidence conveyed", "Verifier appraises", "Endorsements/reference values used", "Attestation result", "Relying Party decision"])),
        background: s("背景问题是 attestation 经常被误解为单个签名报告；RATS 强调 appraisal 需要多方证据。",
          ["Evidence 只说明 attester 声称什么，不自动等于可信。", "Verifier 还要拿 endorsements、reference values 和 appraisal policy 判断。", "Relying Party 根据 attestation result 决定是否授予访问。"], "RATS terminology and Figure 1.", matrix("RATS 角色", [["Attester", "produces Evidence"], ["Verifier", "appraises claims"], ["Relying Party", "uses result"], ["Endorser", "endorses keys/components"], ["Reference Provider", "known-good values"]])),
        core: s("核心洞察: trust decision 不在 attester，而在 verifier 的 appraisal policy。",
          ["同一份 Evidence 对不同 relying party 可能有不同结论。", "Endorsements 证明 evidence signing key 或 component 来源。", "Reference values 证明 measured state 是否属于可接受基线。"], "RATS appraisal model.", flow("appraisal", ["Evidence", "Endorsements", "Reference Values", "Policy", "Attestation Result", "Access Decision"])),
        architecture: s("架构总览: RATS 把证明过程拆成 evidence generation、conveyance、appraisal 和 result use。",
          ["Attester 可是 device、TEE、CVM、accelerator 或 service。", "Verifier 可以本地或远端；passport/background-check model 只是部署方式。", "RATS 中立于 CPU 架构、claim 内容和传输协议。"], "RATS Figure 1 and architecture sections.", matrix("RATS 对象", [["Claims", "state statements"], ["Evidence", "signed/secured claims"], ["Endorsements", "manufacturer/vendor statements"], ["Reference Values", "known-good measurements"], ["Attestation Result", "verifier output"]])),
        methods: [
          m("Conceptual Data Flow", "Figure 1 是 RATS 最重要的一页: 证明不是二方对话，而是多角色数据流。", ["Attester 产生 Evidence。", "Verifier 结合 endorsements/reference values 做 appraisal。", "Relying Party 消费 result。"], "RATS Figure 1.", flow("Figure 1", ["Attester", "Evidence", "Verifier", "Appraisal Inputs", "Attestation Result", "Relying Party"])),
          m("Passport vs Background Check", "RATS 支持不同部署模型，取决于 verifier 是否在线参与 relying-party 交互。", ["Passport: attester 先拿 result，再给 relying party。", "Background check: relying party 把 evidence 转给 verifier。", "两者影响隐私、延迟和可缓存性。"], "RATS architecture deployment models.", matrix("模型", [["Passport", "cached attestation result"], ["Background", "online verifier"], ["Trade-off", "latency/privacy/freshness"], ["PPT 用法", "lifecycle design choices"]])),
          m("Evidence Freshness / Lifecycle", "RATS 关注事件随时间变化，适合连接 boot、runtime 和 device lifecycle。", ["Boot measurement 只是初始状态。", "配置更新、固件升级、device assignment 都可能需要新 evidence。", "Table 1 说明 events over time 的重要性。"], "RATS Table 1.", cards("lifecycle events", ["boot", "measurement", "configuration", "update", "assignment", "appraisal"]))
        ],
        evidenceEnv: s("RATS 是标准架构文档，无新实验；它是 06 的语言和模型锚点。",
          ["证据源: RFC PDF，本地验证。", "核心证据: Figure 1 conceptual data flow, Table 1 events over time。", "边界: 不规定 Arm CCA/CoVE/EAT 具体字段，也不测性能。"], "RATS Figure 1; Table 1.", matrix("证据边界", [["可支撑", "attestation roles"], ["不能支撑", "platform security proof"], ["实验", "无"], ["用法", "terminology and lifecycle"]])),
        performance: s("性能页应写成无新实验: RATS 不给 latency/throughput，只给架构模型。",
          ["任何 attestation latency 来自具体协议、crypto、network 和 verifier deployment。", "RATS 可解释 latency 会受 passport/background 模型影响。", "不能给出 benchmark。"], "RATS architecture scope.", bars("claim strength", [{ label: "架构语言", value: "高", bar: 95 }, { label: "性能数据", value: "无", bar: 5 }, { label: "平台中立", value: "高", bar: 92 }, { label: "具体 claim 字段", value: "低", bar: 30 }])),
        evaluation: s("评价: RATS 是所有后续 TEE/Device attestation slides 的共同词典。",
          ["优势: 角色、对象、流程清晰，适合跨 Arm/RISC-V/device 统一叙事。", "局限: 抽象层高，不告诉你某个 evidence 是否安全。", "商业化潜力: 是供应链、confidential VM、device onboarding 和 zero trust 的基础架构语言。"], "RATS conclusion; README evaluation.", matrix("评价", [["优势", "standard vocabulary"], ["局限", "not mechanism proof"], ["商业化", "zero-trust attestation"], ["本方向角色", "main architecture"]]))
      },
      {
        key: "nunes2019vrased",
        short: "VRASED",
        title: "VRASED: A Verified Hardware/Software Co-Design for Remote Attestation",
        authors: "Ivan De Oliveira Nunes, Karim Eldefrawy, Norrathep Rattanavipanon, Michael Steiner, Gene Tsudik",
        venue: "USENIX Security 2019",
        role: "verified RA co-design SOTA",
        primaryContribution: "用硬件 FSM、verified HMAC 软件和 formal verification 构建端到端 RA 方案。",
        boundary: "面向低端 MCU/embedded RA；不能直接替代 cloud CVM attestation 规范。",
        evidenceBase: "VRASED local PDF p.1-p.20; Figure 1 RA protocol; Table 1 notation; Figure 3 architecture; verification/evaluation sections.",
        titleEvidence: "VRASED title page; README metadata.",
        summary: s("VRASED 的贡献是把 RA 从协议想法推进到硬件/软件协同形式化验证。",
          ["动机: 早期 RA 方案常有设计但缺 formal verification，implementation 与模型可能不一致。", "工作: 定义 HW-Mod、SW-Att、K/CR/AR memory regions，并用 LTL/NuSMV 和 F* 验证组件。", "数据: FPGA implementation publicly available，论文报告 synthesized components overhead minimal。"], "VRASED p.1 abstract; Figure 1; Table 1; verification/evaluation sections.", flow("VRASED 管线", ["RA protocol", "HW-Mod access control", "SW-Att HMAC", "LTL specs", "NuSMV model checking", "F* verified software", "FPGA implementation"])),
        background: s("背景问题是 RA 需要同时相信硬件规则、软件 MAC 代码和二者组合。",
          ["只证明协议不够，硬件实现可能允许 DMA/interrupt 绕过。", "只证明 HMAC 不够，attestation key 和 code memory 也要保护。", "VRASED 的目标是 end-to-end definitions 到 implementation 都可验证。"], "VRASED p.1-p.3.", matrix("RA 正确性对象", [["Key K", "must remain secret"], ["CR", "code region protected"], ["AR", "attested region"], ["DMA/interrupt", "must not corrupt execution"], ["SW-Att", "verified HMAC behavior"]])),
        core: s("核心洞察: 可验证 RA 必须把硬件状态机和软件 attestation 代码放进同一个证明边界。",
          ["HW-Mod 保护 K 和 CR，并限制 DMA/interrupt。", "SW-Att 使用 HACL*/HMAC-SHA256 verified implementation。", "LTL specs 将安全性质表达为硬件信号和 memory-region 不变量。"], "VRASED Figure 3; Table 1; Section 4.", flow("co-design boundary", ["hardware signals", "memory regions", "key access", "software HMAC", "proof obligations", "attestation report"])),
        architecture: s("架构总览: verifier 发 challenge，prover 的 HW-Mod 保证 SW-Att 在受保护条件下计算 HMAC。",
          ["Figure 1 是通用 RA protocol。", "Figure 3 定义 VRASED hardware architecture。", "Table 1 给出 PC、DMA、irq、CR、KR、AR 等符号，是理解 proof 的钥匙。"], "VRASED Figure 1; Table 1; Figure 3.", matrix("VRASED 组件", [["Verifier", "challenge and verify"], ["SW-Att", "HMAC over AR"], ["HW-Mod", "access-control FSM"], ["K/CR/AR", "key/code/attested memory"], ["NuSMV/F*", "proof tools"]])),
        methods: [
          m("Formal Specification in LTL", "VRASED 把 RA 安全性质写成 LTL 公式并由 NuSMV 检查。", ["硬件信号包括 Ren/Wen/Daddr/DMAaddr/irq/PC。", "性质覆盖 key secrecy、code integrity、atomicity 等。", "形式化让硬件边界可审计。"], "VRASED Section 4; Table 1.", cards("LTL objects", ["PC", "CR", "KR", "AR", "DMA", "irq"])),
          m("Verified SW-Att", "软件侧不是随便写一个 HMAC，而是使用 verified implementation 并处理 compiler trust gap。", ["SW-Att uses HACL* HMAC-SHA256 verified in F*。", "论文讨论低端 MCU 缺 verified compiler 的挑战。", "软件 proof 与硬件 enforcement 共同支撑 RA。"], "VRASED Section 4.3; software verification discussion.", flow("software proof", ["F* spec", "HACL* HMAC", "C implementation", "compiler caveat", "runs from CR", "HW protects execution"])),
          m("HW/SW Composition", "最终安全性来自硬件保护、软件 HMAC 和 composition proof。", ["HW-Mod 限制 key/code access。", "SW-Att 计算 challenge-bound HMAC。", "composition 证明子性质足以推出端到端 RA property。"], "VRASED proof/composition sections.", matrix("composition", [["HW", "protect K/CR/atomicity"], ["SW", "compute HMAC over AR"], ["Protocol", "challenge freshness"], ["Proof", "sub-properties imply RA"], ["Implementation", "FPGA prototype"]]))
        ],
        evidenceEnv: s("VRASED 是 peer-reviewed 系统+验证论文，包含 formal proof 和 FPGA implementation。",
          ["证据源: USENIX Security 2019 PDF，本地验证。", "验证工具: LTL/NuSMV, F* verified HMAC。", "实现: FPGA/MCU-style setting，论文报告 minimal overhead。"], "VRASED p.1-p.20; Figure 1/3; Table 1.", matrix("证据", [["形式化", "LTL/NuSMV"], ["软件", "F*/HACL*"], ["硬件", "HW-Mod/FPGA"], ["实验", "implementation overhead"], ["边界", "embedded MCU scope"]])),
        performance: s("性能页要和证明一起读: VRASED 的重点是 verified RA，开销是低端设备上的实现成本。",
          ["论文报告 formally verified synthesized components minimal overhead。", "不能把它当作 cloud attestation latency baseline。", "性能与 attested memory size、HMAC cost、MCU frequency 强相关。"], "VRASED evaluation section.", bars("claim strength", [{ label: "formal proof", value: "高", bar: 94 }, { label: "implementation evidence", value: "中高", bar: 75 }, { label: "cloud CVM performance", value: "低", bar: 18 }, { label: "embedded RA relevance", value: "高", bar: 88 }])),
        evaluation: s("评价: VRASED 是 RA 方向的强 SOTA，因为它把设计、实现和证明放在一起。",
          ["优势: proof-driven, HW/SW co-design, public implementation。", "局限: MCU threat model；物理攻击和现代 TEE lifecycle 不完全覆盖。", "商业化潜力: 可转化为 device RoT、IoT RA 和小型安全控制器设计方法。"], "VRASED conclusion; README evaluation.", matrix("评价", [["优势", "verified co-design"], ["局限", "embedded scope"], ["商业化", "IoT/device RoT"], ["本方向角色", "verified RA anchor"]]))
      }
    ]
  }
  ,
  {
    id: "07-riscv-primitives",
    title: "RISC-V 基础安全 Primitives",
    claim: "这个分类解释 RISC-V TEE/CoVE/TEE-I/O 的底层积木: privilege levels、PMP/ePMP、IOMMU 和 interrupt architecture。",
    background: [
      "RISC-V 的安全性来自可组合 primitives，而不是一个单独的 TEE 产品。",
      "Privilege spec 决定 M/S/U/HS/VS 等执行层级，IOMMU 决定 DMA 隔离和设备直通，AIA 决定 MSI/interrupt virtualization。",
      "这些材料大多是规范，不提供实验；它们负责定义边界，系统论文负责证明开销和可用性。"
    ],
    keyClaim: "三篇规范分别回答 CPU privilege、DMA translation 和 interrupt delivery: 它们是后续 Keystone/Penglai/CoVE/CoVE-IO 的共同底座。",
    keyPoints: [
      "RISC-V Privileged Architecture: 定义 privilege levels、trap/delegation、PMP、virtual memory 和 hypervisor 基础。",
      "RISC-V IOMMU: 定义 device isolation、DMA translation、direct assignment 和 fault/reporting 机制。",
      "RISC-V AIA: 定义 APLIC/IMSIC/MSI 和 interrupt virtualization，是 CoVE-IO/TEE-I/O 的控制面基础。"
    ],
    evidence: "RISC-V privileged, IOMMU, and AIA local PDFs.",
    path: ["CPU privilege defines who can execute", "PMP/page table defines memory access", "IOMMU translates DMA", "AIA routes interrupts", "TEE builds lifecycle around them"],
    papers: [
      {
        key: "riscv_privileged",
        short: "Privileged ISA",
        title: "The RISC-V Instruction Set Manual, Volume II: Privileged Architecture",
        authors: "RISC-V Foundation / RISC-V International contributors",
        venue: "RISC-V privileged architecture specification, 2025 snapshot",
        role: "foundational CPU privilege specification",
        primaryContribution: "定义 RISC-V privilege levels、CSRs、trap、PMP、virtual memory 和 hypervisor support。",
        boundary: "规范无新实验；不证明某个 TEE implementation 安全。",
        evidenceBase: "Privileged spec local PDF; Figure 1 implementation stacks; Table 1 privilege levels.",
        titleEvidence: "README metadata; RISC-V privileged spec PDF.",
        summary: s("Privileged spec 是所有 RISC-V TEE 的 CPU-side 词典。",
          ["动机: 开放 ISA 需要可标准化的特权执行、隔离和虚拟化接口。", "工作: 定义 M/S/U privilege、CSRs、trap/delegation、PMP、page tables、hypervisor extension。", "数据: spec 文档无实验，Figure 1 和 Table 1 是讲解入口。"], "RISC-V privileged spec Figure 1; Table 1.", flow("privilege stack", ["U-mode app", "S-mode OS", "HS/VS virtualization", "M-mode firmware", "PMP/page tables", "TEE monitor/TSM"])),
        background: s("背景问题是 RISC-V 的 openness 带来灵活性，也要求 TEE 设计者明确每个 privilege level 的责任。",
          ["M-mode 权力最大，常承载 firmware/security monitor。", "S/HS/VS 管 OS/hypervisor/guest state。", "PMP/ePMP 和 page table 是早期 enclave 与后续 CoVE 的隔离底座。"], "RISC-V privileged spec Figure 1; Table 1.", matrix("特权层", [["M-mode", "firmware / monitor"], ["S-mode", "OS"], ["U-mode", "app"], ["HS/VS", "virtualization"], ["PMP/Sv*", "memory protection"]])),
        core: s("核心洞察: RISC-V TEE 的设计差异，很多都可以追溯到把 trust 放在 M-mode monitor、S-mode TSM 还是硬件扩展里。",
          ["Keystone/Penglai 依赖 security monitor/PMP。", "CoVE/AP-TEE 把 confidential VM 推到 TVM/TSM/MTT。", "I/O/interrupt 方案必须和 privilege/trap/delegation 语义一致。"], "RISC-V privileged spec; Boubakri survey mapping.", cards("设计分叉", ["M-mode monitor", "PMP/ePMP", "S/HS virtualization", "page table ownership", "trap delegation"])),
        architecture: s("架构总览: privilege spec 定义 execution stack 和可用硬件隔离语义，TEE 在其上分配 TCB。",
          ["Figure 1 展示不同 privileged execution stacks。", "Table 1 给 privilege levels。", "PMP/virtual memory/hypervisor chapters 是安全 primitive 的核心。"], "RISC-V privileged spec Figure 1; Table 1; PMP/VM/H extension chapters.", matrix("从 spec 到 TEE", [["PMP", "enclave memory boundary"], ["Virtual memory", "guest/user isolation"], ["Trap", "monitor entry"], ["CSR", "control state"], ["H extension", "confidential VM substrate"]])),
        methods: [
          m("Privilege Levels / Trap Delegation", "TEE 要先决定谁处理 trap、谁拥有最高权限。", ["M-mode 是 mandatory highest privilege。", "Delegation 决定异常/中断流向 S/HS/VS。", "错误 delegation 会扩大不可信 OS 控制面。"], "Privileged spec privilege/trap chapters.", flow("trap path", ["event", "delegation check", "M/S/HS handler", "state save", "policy", "return"])),
          m("PMP/ePMP 与 Memory Boundary", "PMP 是 RISC-V enclave lineage 最早的硬件隔离抓手。", ["PMP 定义 physical memory region access。", "ePMP/Smepmp 扩展能减少 M-mode/firmware 风险。", "Keystone/Penglai/SPEAR-V 都围绕 memory ownership 做设计。"], "Privileged spec PMP chapters.", matrix("PMP 用法", [["Region", "physical memory"], ["Permissions", "R/W/X"], ["Owner", "monitor/firmware"], ["Risk", "scalability/granularity"], ["TEE", "enclave isolation"]])),
          m("Virtual Memory / Hypervisor Extension", "CoVE/AP-TEE 需要从 enclave 走向 TVM，这依赖 H extension 和 guest stage。", ["VS/HS 模式支持 guest OS 和 hypervisor 分工。", "Stage translation 决定 guest physical 到 host physical 的路径。", "Confidential VM 还需额外 memory tracking 和 ownership。"], "Privileged spec virtual memory and hypervisor sections.", cards("CVM substrate", ["VS-mode", "HS-mode", "stage translation", "guest CSRs", "hypervisor traps"]))
        ],
        evidenceEnv: s("这是官方/规范类材料，无实验；它支撑术语和机制边界。",
          ["证据源: local PDF 约 222 页。", "可支撑: privilege/PMP/VM/H extension terminology。", "不能支撑: Keystone/Penglai/CoVE performance 或完整安全证明。"], "pdfinfo; privileged spec Figure 1/Table 1.", matrix("证据边界", [["类型", "spec"], ["实验", "无"], ["可支撑", "primitive definitions"], ["不能支撑", "system evaluation"]])),
        performance: s("性能页写成“无新实验”: spec 不给 overhead。",
          ["Trap、PMP checks、page-table walk 可能影响性能，但 spec 不测。", "性能必须引用 Keystone/Penglai/SPEAR-V/CoVE 系统论文。", "本页只给 claim strength。"], "RISC-V privileged spec scope.", bars("claim strength", [{ label: "规范权威", value: "高", bar: 95 }, { label: "性能数据", value: "无", bar: 5 }, { label: "TEE 适用性", value: "基础", bar: 80 }])),
        evaluation: s("评价: Privileged spec 是 RISC-V 安全的地基，价值高但抽象层低。",
          ["优势: 官方、全面、决定所有后续设计语言。", "局限: 不是 TEE 方案；不含 verifier/attestation/I/O lifecycle。", "商业化潜力: 所有 RISC-V confidential computing 产品都必须兼容这些语义。"], "README evaluation.", matrix("评价", [["优势", "foundational"], ["局限", "not a TEE"], ["商业化", "ISA compatibility"], ["本方向角色", "CPU primitive"]]))
      },
      {
        key: "riscv_iommu_2023",
        short: "RISC-V IOMMU",
        title: "RISC-V IOMMU Architecture Specification",
        authors: "RISC-V Non-ISA IOMMU contributors",
        venue: "RISC-V IOMMU specification, 2026 snapshot",
        role: "DMA isolation specification",
        primaryContribution: "定义 RISC-V 平台的 DMA translation、device isolation、direct assignment 和 I/O page-table 语义。",
        boundary: "规范无实验；TEE-I/O/CoVE-IO 安全还需要 TDISP/SPDM/IDE 和 TVM lifecycle。",
        evidenceBase: "IOMMU local PDF; Figure 1 device isolation; Figure 2 DMA translation/direct assignment; Table 1 terms.",
        titleEvidence: "README metadata; RISC-V IOMMU spec PDF.",
        summary: s("RISC-V IOMMU 的作用是让设备 DMA 也服从地址转换和隔离策略。",
          ["动机: 如果设备可直接 DMA 到任意内存，CPU-side TEE 隔离会被绕过。", "工作: 定义 device context、translation structures、fault/reporting 和 VM direct assignment。", "数据: spec 文档无实验；Figure 1/2 是讲解核心。"], "IOMMU spec Figure 1; Figure 2; Table 1.", flow("DMA translation", ["device request", "device ID/context", "I/O page table", "permission check", "translated address", "fault/report if invalid"])),
        background: s("背景问题是设备不走 CPU load/store，但仍能读写内存。",
          ["DMA bypass CPU page table。", "虚拟化场景需要把 device safely assigned to VM。", "Confidential VM 场景还需要把 DMA 与 TVM ownership/measurement 绑定。"], "IOMMU spec introduction; Figure 1/2.", matrix("DMA 风险", [["No IOMMU", "device can overwrite memory"], ["IOMMU", "translation and permissions"], ["VM assignment", "guest device isolation"], ["TEE gap", "identity/lifecycle still needed"]])),
        core: s("核心洞察: IOMMU 是 I/O 隔离必要条件，但不是 trusted I/O 的充分条件。",
          ["它管地址和权限，不自动证明设备身份。", "它管 DMA，不自动保护 PCIe link confidentiality/freshness。", "它是 CoVE-IO 的底层积木之一。"], "IOMMU spec; CoVE-IO relation.", cards("必要但不充分", ["DMA translation", "device context", "fault reporting", "no identity proof", "no link crypto"])),
        architecture: s("架构总览: device context 指向 translation structures，IOMMU 对 DMA 请求做地址转换。",
          ["Figure 1 展示 non-virtualized device isolation。", "Figure 2 展示 direct device assignment to VM。", "上下文、队列、fault 和 cache 是实现细节核心。"], "IOMMU spec Figure 1/2.", matrix("IOMMU 组件", [["Device ID", "select context"], ["Context", "translation root"], ["I/O page table", "permissions"], ["Fault queue", "report violations"], ["VM assignment", "guest DMA isolation"]])),
        methods: [
          m("Device Context / Translation", "每个设备请求先被映射到 context，再走 I/O page table。", ["Context 绑定 device identity within platform。", "Translation root 定义 DMA address space。", "Invalid access 生成 fault。"], "IOMMU spec context/translation chapters.", flow("translation path", ["request", "device ID", "context", "page-table walk", "permission", "host physical address"])),
          m("Direct Device Assignment", "虚拟化需要把设备交给 VM，同时不允许它访问其他 VM。", ["IOMMU 为 assigned device 配置 guest-specific translation。", "Fault/reporting 让 host 管理错误但不能越权。", "CoVE-IO 会在此基础上加入 TVM trust boundary。"], "IOMMU spec Figure 2.", matrix("assignment", [["Device D1", "VM1 address space"], ["Device D2", "VM2 address space"], ["Host", "configuration manager"], ["Risk", "malicious config"], ["Need", "trusted lifecycle"]])),
          m("Fault / Queue / Cache", "IOMMU 不是静态表，还包含 invalidation、fault 和性能相关结构。", ["Translation cache 需要 invalidation。", "Fault queue 影响可观测性和恢复。", "Doorbell/command queues 形成 TCB/DoS 边界。"], "IOMMU spec queue/fault/invalidation sections.", cards("runtime objects", ["command queue", "fault queue", "translation cache", "invalidation", "device context"]))
        ],
        evidenceEnv: s("这是 RISC-V IOMMU 规范，无新实验；它支撑 DMA 隔离语义。",
          ["证据源: local PDF 约 109 页。", "核心图: Figure 1/2，Table 1 terms。", "边界: 不证明 CoVE-IO 或 TEE-I/O 完整安全。"], "IOMMU spec Figure 1/2; Table 1.", matrix("证据边界", [["类型", "spec"], ["实验", "无"], ["可支撑", "DMA/IOMMU terminology"], ["不能支撑", "device trust lifecycle"]])),
        performance: s("性能页写成无新实验: IOMMU spec 不给 overhead。",
          ["IOTLB、page-table walk、invalidation 会影响性能。", "具体开销需要系统论文或实现报告。", "PPT 只说明性能风险点。"], "IOMMU spec scope.", bars("claim strength", [{ label: "DMA 机制定义", value: "高", bar: 90 }, { label: "性能数字", value: "无", bar: 5 }, { label: "trusted device proof", value: "低", bar: 25 }])),
        evaluation: s("评价: IOMMU 是 RISC-V trusted I/O 的必要积木，商业价值高但不能单独完成 TEE-I/O。",
          ["优势: 官方 DMA isolation 语义。", "局限: 缺 attestation、link encryption、device lifecycle。", "商业化潜力: 虚拟化、device assignment 和 CoVE-IO 的基础。"], "README evaluation.", matrix("评价", [["优势", "DMA boundary"], ["局限", "not full trusted I/O"], ["商业化", "device assignment"], ["本方向角色", "I/O primitive"]]))
      },
      {
        key: "riscv_aia_2023",
        short: "RISC-V AIA",
        title: "RISC-V Advanced Interrupt Architecture Specification",
        authors: "RISC-V International",
        venue: "RISC-V AIA specification, 2023",
        role: "interrupt architecture specification",
        primaryContribution: "定义 APLIC/IMSIC/MSI 与 interrupt virtualization，是 RISC-V confidential I/O 控制面基础。",
        boundary: "规范无实验；不证明某个 TEE 的 interrupt isolation。",
        evidenceBase: "AIA local PDF; Figure 1 traditional interrupt delivery; Figure 2 MSI/IMSIC; Table 1 limits.",
        titleEvidence: "README metadata; RISC-V AIA spec PDF.",
        summary: s("AIA 的贡献是把 RISC-V interrupt 从传统 wired IRQ 推向 MSI/IMSIC 和虚拟化友好的模型。",
          ["动机: 多核、多 guest 和设备直通需要可扩展 interrupt routing。", "工作: 定义 APLIC、IMSIC、MSI、guest interrupt files 和相关 CSR。", "数据: spec 无实验；Figure 1/2 是讲解入口。"], "AIA Figure 1; Figure 2; Table 1.", flow("interrupt path", ["device event", "APLIC/MSI", "IMSIC interrupt file", "hart receives interrupt", "guest/host routing", "handler executes"])),
        background: s("背景问题是 interrupt 也是可信边界: 设备和 host 可以通过错误中断影响 TVM/CVM execution。",
          ["传统 wired interrupt 不适合大规模虚拟化。", "MSI 让设备通过 memory write 发送 interrupt。", "Confidential computing 需要把 interrupt ownership 与 TVM/device lifecycle 绑定。"], "AIA introduction; Figure 1/2.", matrix("interrupt 风险", [["Wired IRQ", "routing complexity"], ["MSI", "message write as interrupt"], ["IMSIC", "per-hart interrupt files"], ["Guest", "virtual interrupt state"], ["TEE gap", "trusted lifecycle needed"]])),
        core: s("核心洞察: I/O 安全不只看 DMA，还要看 interrupt 是否可伪造、错投或被 host 滥用。",
          ["AIA 定义机制，Devlore/CoVE-IO 这类系统定义 trusted management。", "IMSIC/APLIC 让 interrupt virtualization 更清晰。", "但 spec 本身不判断哪个 device 是否可信。"], "AIA Figure 1/2; Devlore relation.", cards("控制面对象", ["APLIC", "IMSIC", "MSI", "guest interrupt file", "routing policy"])),
        architecture: s("架构总览: APLIC 处理 wired sources，IMSIC 接收 MSIs，hart/guest 通过 interrupt file 取中断。",
          ["Figure 1 展示 traditional wired interrupt。", "Figure 2 展示 MSI + IMSIC。", "虚拟化支持让 guest interrupt delivery 更可扩展。"], "AIA Figure 1/2.", matrix("AIA 组件", [["APLIC", "interrupt controller"], ["IMSIC", "per-hart MSI controller"], ["MSI", "message-signaled interrupt"], ["Hart", "interrupt receiver"], ["Guest file", "virtualized interrupt target"]])),
        methods: [
          m("APLIC / Wired Interrupts", "APLIC 负责传统外部中断源的域和路由。", ["把 interrupt source 路由到 machine/supervisor/guest context。", "支持优先级、pending/enabled 状态。", "TEE 场景需要防止不可信 manager 错配。"], "AIA APLIC sections.", flow("APLIC", ["external source", "domain", "priority/pending", "target hart", "interrupt delivery"])),
          m("IMSIC / MSI Delivery", "IMSIC 把 MSI 变成 per-hart interrupt file，适合虚拟化和设备直通。", ["设备通过 message write 触发 interrupt。", "每个 hart/guest 可有独立 interrupt file。", "CoVE-IO 需要在这个模型上绑定 trusted device assignment。"], "AIA Figure 2; IMSIC sections.", flow("MSI path", ["device MSI write", "IMSIC file", "pending bit", "hart interrupt", "guest handler"])),
          m("Virtual Interrupt Boundary", "AIA 提供 virtualization 机制，但可信边界还要靠 TSM/CoVE-IO/Devlore 类检查。", ["Guest external interrupt 需要 routing state。", "Host 管理便利与 TVM 安全存在冲突。", "PPT 中应把 spec mechanism 和 trusted policy 分开。"], "AIA virtualization sections.", matrix("spec vs policy", [["Spec", "how interrupts route"], ["TEE policy", "who may configure"], ["Risk", "fake/wrong interrupt"], ["Need", "trusted lifecycle"], ["Evidence", "no experiment"]]))
        ],
        evidenceEnv: s("AIA 是 interrupt 规范，无新实验；它支撑 07/10 的控制面术语。",
          ["证据源: local PDF 约 90 页。", "核心图: Figure 1 traditional delivery, Figure 2 MSI/IMSIC, Table 1 limits。", "边界: 不证明 confidential interrupt isolation。"], "AIA Figure 1/2; Table 1.", matrix("证据边界", [["类型", "spec"], ["实验", "无"], ["可支撑", "interrupt primitives"], ["不能支撑", "TEE policy proof"]])),
        performance: s("性能页写成无新实验: AIA spec 不给 interrupt latency benchmark。",
          ["IMSIC/APLIC 会影响 interrupt scalability。", "具体 latency/overhead 要引用实现或系统论文。", "本页只说明性能相关路径。"], "AIA spec scope.", bars("claim strength", [{ label: "interrupt mechanism", value: "高", bar: 90 }, { label: "performance data", value: "无", bar: 5 }, { label: "TEE isolation", value: "需另证", bar: 30 }])),
        evaluation: s("评价: AIA 是 RISC-V I/O 控制面的关键规范，但必须和 IOMMU/CoVE-IO 合用。",
          ["优势: 支持 MSI/virtual interrupt scalability。", "局限: 不定义 trusted device lifecycle。", "商业化潜力: 多核/虚拟化/设备直通 RISC-V 平台必备。"], "README evaluation.", matrix("评价", [["优势", "scalable interrupt architecture"], ["局限", "not trusted policy"], ["商业化", "virtualized RISC-V I/O"], ["本方向角色", "interrupt primitive"]]))
      }
    ]
  }
  ,
  {
    id: "08-riscv-tee-lineage",
    title: "RISC-V TEE 谱系: Keystone / Penglai / SPEAR-V",
    claim: "这个分类解释 RISC-V enclave 如何从 PMP-based open framework 发展到 scalable memory protection，再走向 tag/metadata primitive。",
    background: [
      "RISC-V TEE 的第一阶段不是 confidential VM，而是用开放 ISA、M-mode monitor 和 PMP 建立可研究、可裁剪的 enclave。",
      "Keystone 解决可定制和开源基线，Penglai 解决 PMP 数量和 secure memory 规模问题，SPEAR-V 解决 page-table manipulation 与低开销标签隔离。",
      "可以把这条线理解成: 先能隔离一个 enclave，再能跑很多 enclave，最后把隔离语义做成更细粒度的硬件标签。"
    ],
    keyClaim: "三篇论文的关系是“开源框架 -> 云规模内存保护 -> 轻量硬件标签”: 它们共同解释 CoVE 之前的 RISC-V enclave 设计空间。",
    keyPoints: [
      "Keystone: EuroSys 2020 开源框架，用 security monitor、PMP、runtime abstraction 支持可定制 TEE。",
      "Penglai: OSDI 2021 SOTA，用 Guarded Page Table、Mountable Merkle Tree、shadow enclave 支持大量并发 enclave。",
      "SPEAR-V: ASIA CCS 2023 SOTA，用 page-granular tag store 与 immutable page tables 支持低开销双向 sandbox。"
    ],
    evidence: "Keystone EuroSys 2020 PDF; Penglai OSDI 2021 PDF; SPEAR-V ASIA CCS 2023 PDF.",
    path: ["PMP isolates physical regions", "Security monitor owns enclave lifecycle", "Runtime moves policy into enclave", "GPT/MMT scale memory ownership", "Tag store hardens page tables", "CoVE later lifts model to TVM"],
    papers: [
      {
        key: "lee2020keystone",
        short: "Keystone",
        title: "Keystone: An Open Framework for Architecting Trusted Execution Environments",
        authors: "Dayeol Lee, David Kohlbrenner, Shweta Shinde, Krste Asanovic, Dawn Song",
        venue: "EuroSys 2020",
        role: "foundational open RISC-V TEE framework",
        primaryContribution: "把 RISC-V PMP、M-mode security monitor、runtime 和 SDK 组合成可定制开源 TEE 框架。",
        boundary: "Keystone 是 enclave framework，不是 confidential VM 标准；I/O、侧信道和 paging policy 由 runtime/扩展决定。",
        evidenceBase: "Keystone PDF Figure 1-Figure 6; Table 1 SBI; Table 2 hardware platforms; Table 3 TCB breakdown.",
        titleEvidence: "README metadata; Keystone EuroSys 2020 PDF title page.",
        summary: s("Keystone 的核心贡献是让研究者能自己选择 TCB 与功能，而不是被固定商用 TEE 设计点锁死。",
          ["动机: SGX/TrustZone 等商用 TEE 功能固定，难适配不同 threat model 和资源管理需求。", "工作: 提出 common security monitor + per-enclave runtime 的开源框架，用 PMP 做硬件隔离。", "数据: 论文实现 SM、Eyrie/seL4 runtime，并在 CoreMark、Beebs、RV8、IOZone 等 benchmark 上评估。"], "Keystone abstract; Figure 1 system; Section 7 evaluation.", flow("Keystone story", ["untrusted OS", "M-mode SM", "PMP region", "runtime in enclave", "eapp", "attestation to verifier"])),
        background: s("背景问题是“一个 TEE 不可能同时适合所有场景”。",
          ["有的应用要最小 TCB，有的要 syscalls，有的要 secure I/O，有的要 cache partition 或 memory encryption。", "传统 TEE 把很多策略固定在平台里，研究者很难替换 monitor、runtime 或内存管理。", "RISC-V 提供开放硬件接口，Keystone 把这种开放性变成 TEE framework。"], "Keystone Section 2; Figure 1.", matrix("需求冲突", [["最小 TCB", "少功能、少代码"], ["兼容性", "需要 runtime/syscall support"], ["资源管理", "paging/resize/I/O tradeoff"], ["安全扩展", "cache partition, sealed storage, timers"], ["Keystone", "framework lets choices vary"]])),
        core: s("核心洞察: 让 SM 只做不可替代的隔离与生命周期，把可变策略交给 enclave runtime。",
          ["SM 在 M-mode 运行，负责 PMP、enclave measurement、entry/exit、destroy/cleaning。", "Runtime 在 enclave 内运行，负责 page table、syscall proxy、SDK、policy modules。", "这种拆分降低固定 TCB，也让不同 enclave 可以选择不同安全/性能 tradeoff。"], "Keystone Figure 2 end-to-end overview; Table 1 SBI; Figure 3 PMP.", cards("SM vs Runtime", ["SM: isolate and measure", "SM: expose SBI", "RT: manage memory", "RT: proxy syscalls", "eapp: workload logic"])),
        architecture: s("架构总览: Keystone 把 untrusted host、security monitor、runtime、eapp 和 remote verifier 串成一个生命周期。",
          ["Host OS 负责资源分配和启动请求，但不能读写受 PMP 保护的 enclave memory。", "SM 建立 measurement 并配置 PMP；remote verifier 用 SM/enclave measurement 决定是否信任。", "Eyrie runtime 让普通应用获得 libc、syscall proxy 和可选模块。"], "Keystone Figure 1; Figure 2; Table 1.", matrix("架构对象", [["Host OS", "resource manager, untrusted"], ["SM", "M-mode reference monitor"], ["PMP", "physical memory access control"], ["RT/Eyrie", "enclave-side policy"], ["Verifier", "checks measurement and platform"]])) ,
        methods: [
          m("Security Monitor + PMP", "Keystone 的隔离基础是 SM 动态配置 PMP，把 enclave memory 从 host OS 中切走。", ["Enclave 创建时，SM 检查/测量 host 准备的内存。", "Enclave 运行时，PMP 允许 enclave 访问自己的 region，阻止 host/user 访问。", "销毁时，SM 清理内存并释放 PMP entry。"], "Keystone Figure 3; Table 1 create/run/resume/destroy.", flow("PMP lifecycle", ["create request", "measure pages", "configure PMP", "enter enclave", "trap to SM", "clean and destroy"])),
          m("Runtime Abstraction", "Runtime 把“要不要 page table、syscall、SDK、cache policy”变成 enclave-specific 选择。", ["Eyrie 提供 native runtime；论文也演示 seL4 runtime。", "Syscall proxy 和 edge call 让 enclave 与 untrusted host 交互。", "代价是 runtime 进入 enclave TCB，功能越多 TCB 越大。"], "Keystone Section 5; Table 3 TCB breakdown.", matrix("runtime choices", [["Eyrie", "small native RT"], ["seL4", "microkernel RT"], ["syscall proxy", "compatibility"], ["paging module", "flexible memory"], ["TCB cost", "feature-dependent"]])),
          m("Attestation End-to-End", "Keystone 不只隔离内存，还把 platform、SM 和 enclave measurement 交给远端 verifier。", ["平台提供 RoT/boot measurement。", "SM hash 和 enclave hash 进入 attestation report。", "Verifier 依据 known SM/enclave measurement 决定是否提供 secret。"], "Keystone Figure 2; Section 4.5 attestation.", flow("attestation", ["platform RoT", "measure SM", "measure enclave pages", "sign report", "remote verifier", "secret release"])),
          m("Feature Modules / Tradeoffs", "Keystone 的价值在于把 cache partition、on-chip memory、self-paging、memory encryption 作为可选模块展示。", ["Figure 5 比较不同 memory model。", "可选模块能增强威胁模型，但也增加实现复杂度和开销。", "这为后续 Penglai/SPEAR-V 的专门化设计提供基线。"], "Keystone Figure 5 memory model; Section 4.6 platform extensions.", cards("可选防护", ["cache partition", "on-chip scratchpad", "self-paging", "software encryption", "sealed storage/timer"]))
        ],
        evidenceEnv: s("实验环境是真实 RISC-V 板卡和开源核模拟组合，目标是验证 framework 可实现和开销范围。",
          ["硬件: HiFive Freedom Unleashed FU540，以及 Rocket/BOOM 等开源 RISC-V 处理器设置。", "软件: buildroot Linux 4.15、SM、Eyrie runtime、Linux driver、seL4 port。", "评估: CoreMark、Beebs、RV8、IOZone、Torch/FANN、lifecycle operations 和 TCB LoC。"], "Keystone Section 7.1; Table 2 hardware; Table 3 LoC.", matrix("实验对象", [["Platform", "FU540 + open RISC-V cores"], ["OS", "buildroot Linux 4.15"], ["Runtime", "Eyrie / seL4"], ["Benchmarks", "CoreMark, Beebs, RV8, IOZone"], ["TCB", "SM plus selected RT modules"]])),
        performance: s("性能结论: 基础 CPU benchmark 开销小，I/O 和功能模块开销更明显。",
          ["论文摘要报告 CoreMark/Beebs/RV8 低开销，IOZone 可到约 40%。", "Figure 6 拆分 enclave lifecycle，create/destroy 受 memory cleaning/attestation 等影响。", "关键不是某个数字，而是 framework 让用户显式选择安全功能与开销。"], "Keystone abstract; Figure 6 lifecycle; Section 7.", bars("reported evidence", [{ label: "CoreMark/Beebs/RV8", value: "low", bar: 20 }, { label: "IOZone", value: "up to ~40%", bar: 70 }, { label: "SM added code", value: "~1.6 KLoC", bar: 25 }, { label: "max eapp TCB", value: "~15 KLoC", bar: 45 }])),
        evaluation: s("评价: Keystone 是 RISC-V TEE 的基础 SOTA，因为它给出了可复用、可修改、可评估的开源起点。",
          ["优势: framework 结构清楚，SM/RT 分工明确，适合研究新硬件 primitive。", "局限: PMP 数量和物理 region 管理限制明显；secure I/O、侧信道和大规模 enclave 不是默认解决。", "商业化潜力: 适合教学、原型和定制设备；量产需要硬件供应商、toolchain、认证和长期维护。"], "Keystone discussion and README evaluation.", matrix("评价", [["优势", "open and customizable"], ["局限", "not scalable CVM"], ["商业化", "prototype / edge"], ["本方向角色", "baseline framework"]]))
      },
      {
        key: "feng2021penglai",
        short: "Penglai",
        title: "Scalable Memory Protection in the Penglai Enclave",
        authors: "Erhu Feng et al.",
        venue: "OSDI 2021",
        role: "peer-reviewed SOTA scalable RISC-V enclave system",
        primaryContribution: "提出 GPT、MMT 和 shadow enclave，把 RISC-V enclave 从少量 PMP region 推到 thousands concurrent enclave 和 large secure memory。",
        boundary: "Penglai 需要硬件扩展；它仍是 enclave system，不是标准化 CoVE TVM。",
        evidenceBase: "Penglai PDF Figure 1 architecture; Figure 2 GPT; Figure 3 MMU extension; Table 1 comparison; evaluation sections.",
        titleEvidence: "README metadata; OSDI 2021 PDF title page.",
        summary: s("Penglai 解决 Keystone/PMP 系路线的规模瓶颈: enclave 数量、secure memory 大小和启动延迟。",
          ["动机: serverless/microservice 场景需要很多短生命周期 enclave，固定 PMP region 与静态 secure memory 不够。", "工作: 提出 Guarded Page Table、Mountable Merkle Tree、shadow enclave，并实现开源 RISC-V enclave system。", "数据: 论文报告支持 thousands enclave、最高 512GB secure memory，CPU benchmark 低开销，memory-intensive benchmark 约 5% overhead。"], "Penglai abstract; Figure 1; Table 1; evaluation summary.", flow("Penglai answer", ["serverless demand", "GPT page ownership", "MMT integrity scale", "shadow enclave fork", "many enclaves", "lower startup latency"])),
        background: s("背景问题是 PMP 的“少量 region”模型不能自然支撑云原生 enclave。",
          ["SGX-style EPC 有固定 protected memory 和初始化成本。", "PMP-based enclave 受寄存器数量和 contiguous memory 管理限制。", "serverless 函数需要快速创建、复用、销毁，microservice 需要大量并发隔离单元。"], "Penglai Section 1-2; Table 1 comparison.", matrix("规模痛点", [["数量", "thousands concurrent enclaves"], ["容量", "large secure memory"], ["粒度", "4KB page ownership"], ["启动", "fast fork-like creation"], ["完整性", "scalable memory integrity"]])),
        core: s("核心洞察: 不要在每次访问都做昂贵 ownership checking，把检查提前到 page-table mapping 和 secure-memory metadata。",
          ["GPT 保护 host page table，确保 untrusted OS 不能把 secure page 映射给自己。", "MMT 用 mountable subtree 缩短 integrity checking 路径，支撑大 secure memory。", "Shadow enclave 把代码/数据 measurement 预处理，降低 serverless-style enclave 创建成本。"], "Penglai Section 4; Figure 2-Figure 4; Figure 11 startup evidence.", cards("三件核心事", ["GPT: page ownership", "MMT: scalable integrity", "shadow enclave: fast fork", "server enclave: service chain", "cache-line locking: sensitive sections"])),
        architecture: s("架构总览: monitor/driver/SDK 加硬件 GPT/MMT 扩展，组成一个可扩展 enclave OS。",
          ["Figure 1 显示 host app、driver、monitor、enclave、inter-enclave communication 和 hardware extensions。", "Secure monitor 管理 enclave lifecycle 和硬件配置；host 仍负责普通资源管理。", "Penglai 把 HPT Area、enclave page table、MMT meta-zone 都纳入可信管理。"], "Penglai Figure 1; Figure 2; Figure 3.", matrix("组件", [["Monitor", "enclave lifecycle and hardware config"], ["Driver/SDK", "host-side API"], ["GPT", "page-table ownership check"], ["MMT", "integrity tree for secure memory"], ["Shadow enclave", "fast initialization"]])) ,
        methods: [
          m("Guarded Page Table", "GPT 用硬件和 HPT Area 约束 host page table，让 page ownership 变成硬件可检查的属性。", ["Host page table 必须位于受保护 HPT Area。", "MMU extension 检查 page-table entry 是否非法指向 secure page。", "这样避免每次内存访问都查大型 metadata。"], "Penglai Figure 2; Figure 3; Section 4.1.", flow("GPT check", ["host updates PTE", "PTE must be in HPT Area", "MMU checks target page", "secure page blocked", "enclave page table controlled by monitor"])),
          m("Mountable Merkle Tree", "MMT 让 secure memory integrity 随容量扩展，而不是让树节点吞掉 cache 和 bandwidth。", ["SubTree 可 mount/unmount，缩短热点 secure memory 的验证路径。", "根和关键 metadata 留在 SoC/monitor 控制范围。", "论文目标是支持最高 512GB secure memory。"], "Penglai Section 4.2; MMT design figures; abstract.", matrix("MMT 设计", [["问题", "large tree verification overhead"], ["结构", "mountable SubTree"], ["可信根", "SoC root / monitor"], ["容量目标", "up to 512GB"], ["收益", "lower integrity overhead"]])),
          m("Shadow Enclave Fast Startup", "Shadow enclave 把 serverless 场景的重复初始化变成 fork-style creation。", ["Shadow enclave 不直接运行，只保存可复用 code/data template。", "测量可提前计算并密封，fork 时避免重复高成本 attestation/initialization。", "论文报告 16MB enclave creation 可提升三个数量级。"], "Penglai Section 4.3; Figure 11 startup evaluation.", flow("shadow fork", ["create shadow template", "precompute measurement", "seal manifest", "fork new enclave", "dynamic memory add", "run function"])),
          m("Server Enclave / IPC", "Penglai 还把 enclave 组织成服务链，缓解所有功能都信任 host OS 的问题。", ["Server enclave 可处理文件系统等服务，降低 Iago attack 风险。", "Relay page 支持 host-enclave 与 enclave-enclave communication。", "这让 enclave 更接近 microservice 组合，而不是单个安全进程。"], "Penglai Section 5.2 software implementation and IPC figures.", cards("runtime model", ["server enclave", "relay page", "H-E IPC", "E-E IPC", "asynchronous calls"]))
        ],
        evidenceEnv: s("实验环境覆盖硬件扩展原型、Linux 修改和 serverless/microservice workloads。",
          ["实现: 修改 RISC-V core/MMU/SoC 相关路径，增加 GPT/MMT engine，monitor、driver、SDK 和 libraries。", "工作负载: CPU-intensive benchmark、Redis 等 memory-intensive benchmark、MapReduce 和 serverless application。", "证据边界: 评估证明可扩展 enclave prototype，不证明标准化 AP-TEE/CoVE 兼容性。"], "Penglai implementation and evaluation sections; Figure 1; Table 1.", matrix("实验覆盖", [["CPU benchmarks", "RV8/CoreMark-like"], ["Memory workloads", "Redis"], ["Scalability", "thousands enclaves"], ["Capacity", "up to 512GB secure memory"], ["Startup", "shadow enclave fork"]])),
        performance: s("性能结论: Penglai 的 selling point 是“规模提升而开销仍可接受”。",
          ["论文摘要报告 memory-intensive benchmark 约 5% overhead。", "GPT overhead 对 memory mapping 路径更敏感，对普通 CPU benchmark 较小。", "Shadow enclave 把 16MB secure memory 初始化延迟提升三个数量级。"], "Penglai abstract; evaluation sections; Figure 11.", bars("key numbers", [{ label: "secure memory capacity", value: "512GB", bar: 90 }, { label: "concurrent enclaves", value: "1000s", bar: 85 }, { label: "memory benchmark overhead", value: "~5%", bar: 20 }, { label: "startup improvement", value: "1000x class", bar: 88 }])),
        evaluation: s("评价: Penglai 是 RISC-V enclave 规模化的强 SOTA，但商业化依赖硬件扩展被采纳。",
          ["优势: 直接解决 PMP region、secure memory capacity 和 startup latency。", "局限: 硬件改动较大；与后续 CoVE TVM 标准不是同一抽象层。", "商业化潜力: serverless enclave、edge cloud、云原生微隔离；风险在 ISA/SoC 标准化和生态支持。"], "Penglai conclusion and README evaluation.", matrix("评价", [["优势", "scalable enclave memory"], ["局限", "hardware extension adoption"], ["商业化", "serverless enclaves"], ["本方向角色", "scalability SOTA"]]))
      },
      {
        key: "schrammel2023spearv",
        short: "SPEAR-V",
        title: "SPEAR-V: Secure and Practical Enclave Architecture for RISC-V",
        authors: "David Schrammel et al.",
        venue: "ACM Asia Conference on Computer and Communications Security (ASIA CCS 2023)",
        role: "peer-reviewed SOTA lightweight tag-based RISC-V enclave primitive",
        primaryContribution: "用 page-granular memory tag store、immutable page tables 和 SM API 支持低开销 protected/unprotected isolation 与嵌套 sandbox。",
        boundary: "SPEAR-V 是研究型硬件扩展；不等同于 ratified RISC-V TEE standard。",
        evidenceBase: "SPEAR-V PDF Figure 1 design overview; Figure 2 HPCE; Figure 3 TLB tag fields; Figure 4 tagged translation; evaluation sections.",
        titleEvidence: "README metadata; ASIA CCS 2023 PDF title page.",
        summary: s("SPEAR-V 的核心贡献是把 enclave ownership 变成 page tag，而不是只靠 PMP region 或复制 page table。",
          ["动机: 现有 enclave 方案常有性能开销、controlled-channel/page-table attack 风险和不灵活的内存边界。", "工作: 提出 tag store、immutable page table、TLB/PTW extension、SM enclave API。", "数据: 摘要报告 unprotected application 零开销，protected application 平均约 1% overhead。"], "SPEAR-V abstract; Figure 1; Figure 3; evaluation summary.", flow("SPEAR-V idea", ["DRAM pages", "tag store", "PTW checks tags", "immutable page tables", "SM owns API", "nested sandbox"])),
        background: s("背景问题是 page table 自身会成为攻击面: OS 可通过 remap、unmap、fault pattern 观察或操纵 enclave。",
          ["如果 page table 由 untrusted OS 管理，enclave 需要额外防御 alias/remapping。", "如果复制或移动 page table 到安全区，性能和软件复杂度会上升。", "SPEAR-V 选择给 page 和 page table 加 tag，让硬件翻译路径直接检查合法性。"], "SPEAR-V introduction; Figure 1; controlled-channel discussion.", matrix("page-table 风险", [["Remapping", "same page mapped differently"], ["Unmapping", "controlled-channel faults"], ["Duplication", "software overhead"], ["PMP only", "coarse region"], ["Tagging", "page-granular policy"]])),
        core: s("核心洞察: 标记 page table 为 immutable 后，OS 可以继续管理普通页表，但不能偷偷改 enclave mapping。",
          ["Tag store 记录 owner/ID、page type、immutable bit、page level 等字段。", "PTW/TLB 在地址翻译时带着 tag 检查访问权限。", "嵌套 enclave 和双向 sandbox 来自“谁拥有这页、谁能访问这页”的统一语义。"], "SPEAR-V Figure 1; Figure 3; Section 5.", cards("tag semantics", ["owner / enclave ID", "immutable page table", "page type", "shared key", "page level"])),
        architecture: s("架构总览: tag store 在 DRAM 中，SM 在 M-mode 中管理 tag，PTW/TLB 在硬件路径检查 tag。",
          ["Figure 1 显示 DRAM tag store、page tables、application、SM 和 M-mode 关系。", "Figure 3 显示 tag fields 如何进入 TLB entry。", "SM 提供 E_CREATE、E_ADD/E_REMOVE、E_ENTER/E_EXIT、SHARE/REVOKE 等 API。"], "SPEAR-V Figure 1; Figure 3; Section 5.5 SM API.", matrix("架构对象", [["Tag store", "per-page metadata"], ["PTW/TLB", "enforces tags"], ["SM", "M-mode tag manager"], ["Immutable PT", "prevents remap attack"], ["Shared memory key", "controlled sharing"]])),
        methods: [
          m("Page-Granular Tag Store", "Tag store 把“这页属于谁”放到硬件可查的 metadata 中。", ["每 4KiB page 可有 owner/ID 和 page type。", "Tag store 自身由 SM/PMP/tag self-protection 保护。", "非 taggable memory 可跳过 tag fetch，降低普通程序开销。"], "SPEAR-V Figure 1; Section 5.1-5.3.", flow("tag lookup", ["virtual address", "PTW walks page table", "fetch page-table tags", "fetch leaf-page tag", "permission check", "TLB caches subset"])),
          m("Immutable Page Tables", "Immutable bit 是 SPEAR-V 对抗 page-table attack 的关键点。", ["SM 在加入 enclave page 时验证 mapping，并把相关 page table 标记 immutable。", "写 immutable page table 会 trap 到 SM。", "这阻止 OS 通过 PTE 修改制造 alias/remap。"], "SPEAR-V Figure 2; Section 5.4.", matrix("immutable PT", [["Before", "OS can edit PTE"], ["SM validation", "unique mapping check"], ["After", "PT tagged immutable"], ["Violation", "trap to SM"], ["Benefit", "remap/fault attack harder"]])),
          m("Nested / Two-Way Sandboxing", "SPEAR-V 不只保护 enclave 免受 host 攻击，也能让 enclave 内部再隔离子区域。", ["Nested enclave page 与 parent enclave page 走同一 tag/owner 规则。", "父 enclave 不能直接读子 enclave 私有页。", "这种双向 sandbox 对 plugin、library、JIT 或不可信组件很有用。"], "SPEAR-V abstract; Section 5 nested enclave discussion.", cards("sandbox directions", ["host -> enclave blocked", "enclave -> host controlled", "parent -> child blocked", "shared pages explicit", "syscalls via host app"])),
          m("SM API and Lifecycle", "SM API 把 tag 写入和 page ownership change 收敛到可信路径。", ["E_CREATE/E_DESTROY 管 enclave 生命周期。", "E_ADD/E_REMOVE 管 enclave page ownership。", "E_SHARE/E_REVOKE 管 shared memory key。"], "SPEAR-V Section 5.5 API.", flow("API lifecycle", ["E_CREATE", "E_ADD pages", "tag page tables", "E_ENTER", "SHARE/REVOKE", "E_DESTROY"]))
        ],
        evidenceEnv: s("实验环境是研究原型和模拟/硬件评估，重点验证 tag 扩展开销与面积/性能 tradeoff。",
          ["论文评估 unprotected 与 protected application 的开销。", "评估还探索 0/32/64/128-bit tags 等设计点和 TLB/PTW 影响。", "证据边界: 证明 SPEAR-V 原型可行，不代表供应商量产采用。"], "SPEAR-V evaluation sections; Figure 3; tag-size discussion.", matrix("实验问题", [["Q1", "protected app overhead"], ["Q2", "unprotected app overhead"], ["Q3", "tag size/area tradeoff"], ["Q4", "TLB/PTW effect"], ["Boundary", "research prototype"]])),
        performance: s("性能结论: SPEAR-V 用 tag path 换取细粒度隔离，摘要报告 protected app 平均约 1% overhead。",
          ["Unprotected application 可放在 non-taggable memory 或跳过 tag fetch，论文称接近零开销。", "Protected application 因 TLB miss/tag lookup 增加开销，平均约 1%。", "关键风险是硬件 tag store 面积、tag cache/TLB 设计和 page-table write trap。"], "SPEAR-V abstract; Section 8 evaluation.", bars("performance evidence", [{ label: "unprotected app", value: "0% reported", bar: 5 }, { label: "protected app average", value: "~1%", bar: 15 }, { label: "tag expressiveness", value: "high", bar: 85 }, { label: "standardization maturity", value: "research", bar: 35 }])),
        evaluation: s("评价: SPEAR-V 是 RISC-V enclave primitive 的强 SOTA，因为它把 page-table safety 和低开销放进一个硬件语义。",
          ["优势: 低开销、细粒度、可嵌套，机制比纯 PMP 更灵活。", "局限: 需要硬件扩展和 tag store；侧信道、I/O 和标准化仍需其他机制。", "商业化潜力: 适合嵌入式/边缘/插件隔离；风险在 ISA 扩展接受度、验证成本和 toolchain support。"], "SPEAR-V conclusion and README evaluation.", matrix("评价", [["优势", "tag-based page ownership"], ["局限", "non-standard hardware"], ["商业化", "fine-grained isolation"], ["本方向角色", "lightweight primitive SOTA"]]))
      }
    ]
  },
  {
    id: "09-riscv-cove-ap-tee",
    title: "RISC-V CoVE / AP-TEE Confidential VM",
    claim: "这个分类解释 RISC-V 如何从 enclave 走向 confidential VM: TVM、TSM、memory tracking、SBI ABI 和 attestation。",
    background: [
      "Enclave 保护单个进程或小 TCB，confidential VM 要保护整个 guest OS + application workload。",
      "CoVE 是早期 reference architecture，AP-TEE draft 把 TVM lifecycle、memory assignment、attestation 和 ABI 写成标准化候选语义。",
      "Boubakri survey 用来把 CoVE/AP-TEE 放回 RISC-V TEE 演进谱系，但机制 claim 必须回到 CoVE/AP-TEE 原始材料。"
    ],
    keyClaim: "主 SOTA 是 AP-TEE draft，因为它定义 TVM/TSM lifecycle；CoVE paper 给 reference architecture，Boubakri survey 给谱系校准。",
    keyPoints: [
      "CoVE 2023: 提出 RISC-V confidential VM reference architecture，包含 TSM、TSM-driver、MTT、COVH/COVG/COVI ABI。",
      "AP-TEE 2024: 规范化 TVM security requirements、deployment model、attestation、TVM lifecycle 和 CoVE SBI extension。",
      "Boubakri 2025: survey 级别横向整理 Keystone/Penglai/SPEAR-V 与 CoVE/AP-TEE，不能替代机制证据。"
    ],
    evidence: "CoVE arXiv PDF; RISC-V AP-TEE v0.7 draft PDF; Boubakri Electronics 2025 survey PDF.",
    path: ["tenant wants VM confidentiality", "host/hypervisor remains resource manager", "TSM becomes security intermediary", "MTT owns confidential pages", "COVH/COVG expose lifecycle", "attestation tells relying party what ran"],
    papers: [
      {
        key: "sahita2023cove",
        short: "CoVE",
        title: "CoVE: Towards Confidential Computing on RISC-V Platforms",
        authors: "Ravi Sahita et al.",
        venue: "Public preprint / RISC-V CoVE proposal, 2023",
        role: "foundational RISC-V confidential VM architecture proposal",
        primaryContribution: "提出 CoVE TVM reference architecture，把 TSM、TSM-driver、MTT、confidential qualifier 和 attestation 放到同一模型。",
        boundary: "CoVE 是 proposal/preprint，不是 ratified standard，也没有完整系统性能评估。",
        evidenceBase: "CoVE PDF Figure 1 reference architecture; Figure 2 MTT enforcement; Figure 3 SoC view; Table 1 privilege levels.",
        titleEvidence: "README metadata; CoVE PDF title page.",
        summary: s("CoVE 的贡献是把 RISC-V confidential computing 从 enclave 语言改写成 VM 语言。",
          ["动机: 云租户希望降低对 host OS/hypervisor 的信任，同时继续运行完整 guest OS。", "工作: 定义 CoVE TVM、TSM、TSM-driver、MTT、confidential qualifier、COVH/COVG/COVI ABI。", "数据: 架构 proposal 无完整 benchmark；证据主要是 reference architecture 和机制定义。"], "CoVE Figure 1; Figure 2; Table 1; Section 3-6.", flow("CoVE model", ["tenant VM", "host VMM", "COVH ABI", "TSM-driver", "TSM", "MTT/confidential memory", "attestation"])),
        background: s("背景问题是 VM 需要保留 hypervisor 的资源管理能力，但不能让 hypervisor 读写私有内存。",
          ["传统 VM 完全信任 hypervisor；CVM 要把 host 降级为 untrusted resource manager。", "RISC-V H extension 提供虚拟化底座，但还缺 confidential-mode、memory assignment 和 attestation。", "CoVE 的设计与 Arm CCA/Intel TDX/AMD SNP 在同一个概念层对齐。"], "CoVE Section 1-3; related comparison sections.", matrix("角色变化", [["Before", "hypervisor trusted"], ["CoVE", "hypervisor manages but cannot inspect"], ["TSM", "security intermediary"], ["TVM", "confidential guest"], ["Verifier", "checks TCB and TVM evidence"]])),
        core: s("核心洞察: CoVE 不是把 Keystone enclave 放大，而是用 TSM + MTT 重定义 VM memory ownership。",
          ["TVM 包含 guest firmware、guest OS 和 application。", "MTT 跟踪 confidential memory，host 只有在 TSM 允许时才能 donate/reclaim/share。", "COVH 面向 host lifecycle，COVG 面向 guest attestation/share request，COVI 面向 secure interrupt。"], "CoVE Figure 1; Figure 2; lines on COVH/COVG/COVI.", cards("CoVE primitives", ["TVM", "TSM", "TSM-driver", "MTT", "COVH/COVG/COVI"])),
        architecture: s("架构总览: TSM 是 TEE 和 non-TEE 之间的 TCB intermediary，host 继续调度资源。",
          ["SoC RoT measure TSM-driver 和 TSM，用于 attestation。", "Host/VMM 通过 COVH 创建 TVM、添加 page、调度 vhart。", "TVM 通过 COVG 请求 attestation、memory sharing 和 para-virtualized I/O。"], "CoVE Figure 1 reference architecture.", matrix("接口拆分", [["COVH", "host -> TSM lifecycle"], ["COVG", "TVM -> TSM guest services"], ["COVI", "secure interrupt facilities"], ["MTT", "memory ownership"], ["RoT", "TCB measurement"]])),
        methods: [
          m("TSM / TSM-driver Split", "CoVE 把安全 enforcement 放在 TSM，把 machine-specific bootstrap 和 context work 放在 TSM-driver。", ["TSM-driver bootstrap TSM spatial/temporal isolation。", "TSM enforcement 聚焦 TVM memory/state invariants。", "这种 split 允许实现差异，但也扩大 attestation 必须覆盖的 TCB。"], "CoVE Figure 1; Section 3.1 TSM-driver functions.", flow("TCB chain", ["SoC RoT", "TSM-driver", "TSM", "TVM metadata", "attestation token"])),
          m("Memory Tracking Table", "MTT 是 CoVE memory isolation 的核心: 它记录物理页属于普通世界、TSM 还是某个 TVM。", ["Host donate memory to TVM via TSM。", "MTT enforcement 阻止 host 访问 confidential page。", "Shared/non-confidential pages 必须显式标记，服务 para-virtualized I/O。"], "CoVE Figure 2 MTT enforcement; Section 4.", matrix("MTT states", [["Non-confidential", "host-visible"], ["Confidential", "TVM-owned"], ["TSM-owned", "metadata/control"], ["Shared", "para-virtualized I/O"], ["Reclaim", "zero/clean before reuse"]])),
          m("TVM Lifecycle Intrinsics", "CoVE 把 VM 创建拆成 allocation、measurement、vhart creation、finalization 和 execution。", ["Measured initial pages 进入 TVM measurement。", "Demand-zero confidential pages 可由 VMM 按需加入。", "Execution/fault/exit 仍需 host 调度，但 confidential state 由 TSM 保存恢复。"], "CoVE lifecycle bullets around TVM creation/execution.", flow("TVM lifecycle", ["detect TSM", "create TVM", "donate pages", "measure payload", "create vCPUs", "finalize", "run/exit"])),
          m("Attestation and Device Boundary", "CoVE 明确 attestation 与 I/O 是后续能否安全商用的关键边界。", ["DICE/SoC RoT 建立 TSM/TVM evidence chain。", "Device attachment 需要 SPDM/TDISP/IDE/IOMMU 等额外机制。", "论文只提出边界要求，不等于完整 TEE-I/O 标准。"], "CoVE Section 6.4 SoC I/O and devices; attestation sections.", cards("attestation chain", ["hardware RoT", "TSM-driver measurement", "TSM measurement", "TVM measurement", "device identity later"]))
        ],
        evidenceEnv: s("CoVE 是 architecture/proposal，无完整系统实验；实验页写成证据基础和边界。",
          ["证据源: 本地 PDF，包含 reference architecture、MTT enforcement、SoC view 和 privilege-level table。", "可支撑: TVM/TSM/MTT/COVH/COVG/COVI 概念。", "不能支撑: AP-TEE final ABI、生产实现开销、device TEE-I/O 完整安全。"], "CoVE Figure 1-Figure 3; Table 1.", matrix("证据边界", [["类型", "proposal/preprint"], ["实验", "无完整 benchmark"], ["可支撑", "architecture semantics"], ["不能支撑", "production performance"]])),
        performance: s("性能页写成 claim strength: CoVE 没有给系统 overhead 数字。",
          ["它保留 host 资源管理能力，理论上降低兼容成本。", "但 MTT lookup、TSM entry/exit、measurement 和 memory conversion 都可能产生开销。", "具体性能必须等待 AP-TEE 实现或系统论文。"], "CoVE scope and absence of evaluation benchmark.", bars("claim strength", [{ label: "架构清晰度", value: "高", bar: 85 }, { label: "标准成熟度", value: "proposal", bar: 45 }, { label: "性能数据", value: "无", bar: 5 }, { label: "后续影响", value: "高", bar: 80 }])),
        evaluation: s("评价: CoVE 是 RISC-V CVM 入口材料，强在概念完整，弱在证据成熟度。",
          ["优势: 对齐 CCA/TDX/SNP 的 TVM 模型，明确 TSM/MTT/ABI 分工。", "局限: preprint/proposal；device I/O、debug、PMU、interrupt 等边界仍需后续 spec。", "商业化潜力: 对开放 CVM 生态很关键；风险在标准收敛、firmware 质量和 verifier ecosystem。"], "CoVE conclusion and README evaluation.", matrix("评价", [["优势", "CVM model for RISC-V"], ["局限", "proposal maturity"], ["商业化", "open confidential VM"], ["本方向角色", "reference architecture"]]))
      },
      {
        key: "riscv_ap_tee_2024",
        short: "AP-TEE",
        title: "RISC-V Application-Processor Trusted Execution Environment Specification",
        authors: "RISC-V Non-ISA AP-TEE contributors",
        venue: "RISC-V AP-TEE draft specification v0.7, 2024",
        role: "current standards-track RISC-V TVM semantics source",
        primaryContribution: "把 CoVE TVM security requirements、deployment model、attestation、lifecycle、memory management 和 SBI ABI 写成规范草案。",
        boundary: "v0.7 draft/not ratified；不能写成最终标准或生产 ABI。",
        evidenceBase: "AP-TEE PDF contents: Section 4 threat/security requirements; Section 5 deployment and isolation; Section 6 attestation; Section 7 lifecycle; Section 8 SBI.",
        titleEvidence: "README metadata; AP-TEE draft title page.",
        summary: s("AP-TEE 是本方向主 SOTA: 它把 CoVE 的想法推进到可实现的 draft ABI 和生命周期语义。",
          ["动机: CoVE 需要统一 TVM、TSM、memory donation/reclaim/share、attestation 和 host/guest ABI。", "工作: 定义 TVM security requirements、TSM init/operation、TVM attestation、lifecycle 和 CoVE SBI extension。", "数据: 规范草案无实验；证据来自章节级语义和 ABI 列表。"], "AP-TEE Section 4-8 table of contents and draft PDF.", flow("AP-TEE spec path", ["threat model", "deployment model", "TSM operation", "TVM attestation", "TVM lifecycle", "CoVE SBI"])),
        background: s("背景问题是 confidential VM 只有概念不够，host、guest、firmware 和 verifier 必须共享同一套状态机。",
          ["没有标准 ABI，OS/VMM/firmware 很难互操作。", "没有明确 memory lifecycle，donate/reclaim/share 容易产生 data remanence 或 ownership confusion。", "没有 attestation token schema，relying party 无法判断 TVM 和 TSM 状态。"], "AP-TEE Section 4-8.", matrix("标准化对象", [["Threat model", "what TVM must resist"], ["TSM", "trusted security manager"], ["Memory lifecycle", "donate/share/reclaim"], ["Attestation", "TVM/TSM token"], ["SBI", "host/guest calls"]])),
        core: s("核心洞察: AP-TEE 把 TVM 当成有状态对象，所有 page、vCPU、interrupt 和 token 都围绕 lifecycle 变化。",
          ["TVM build/initialization 决定初始 measurement。", "TVM execution 决定 host 与 TSM 如何处理 exit/fault/interrupt。", "TVM memory management 决定 measured, zero, shared, private page 的安全要求。"], "AP-TEE Section 7 TVM lifecycle; Section 6 attestation.", cards("state objects", ["TVM state", "vCPU/vhart state", "measured pages", "shared pages", "TSM/TVM token"])),
        architecture: s("架构总览: AP-TEE 的主体不是图，而是规范化状态机和 ABI contract。",
          ["TSM/TSM-driver 与 host/guest 的边界由 SBI extension 切开。", "Section 6 定义 TSM token 和 TVM token 相关内容。", "Section 7/8 把 create, memory management, execution, shutdown 对应到 runtime interface。"], "AP-TEE Section 6-8.", matrix("AP-TEE contract", [["Host side", "COVH runtime interface"], ["Guest side", "COVG-style services"], ["Attestation", "TSM token / TVM token"], ["Memory", "mapping security requirements"], ["Interrupt", "TVM external/timer handling"]])),
        methods: [
          m("TVM Build and Measurement", "AP-TEE 规定 TVM 初始内容如何进入 measurement，避免 host 在创建后偷换 payload。", ["Multi-step/single-step creation 都必须形成可验证初始状态。", "Measured page assignment 影响 TVM token。", "Finalization 后，初始 measured payload 不应再被 host 任意修改。"], "AP-TEE Section 6.1.2; Section 7.1; Section 8.2 TVM creation.", flow("build", ["create TVM", "donate page-table pool", "map code/data", "extend measurement", "finalize", "attest"])),
          m("Memory Management Semantics", "AP-TEE 的关键是把 private/shared/zero/reclaimed page 的转换写清楚。", ["TVM private page 对 host 不可见。", "Shared page 用于 paravirtual I/O，但必须显式转换。", "Reclaim/reuse 需要清理，避免 secret 残留。"], "AP-TEE Section 7.3 memory management; Section 5.2 memory isolation.", matrix("page lifecycle", [["Donate", "host -> TVM/TSM"], ["Measure", "initial payload"], ["Zero", "demand-zero private page"], ["Share", "TVM <-> host I/O"], ["Reclaim", "clean before host reuse"]])),
          m("Attestation Token Model", "AP-TEE 把 TSM token 与 TVM token 分开，让 verifier 同时看平台和 workload。",
            ["TSM token 证明 TSM/TCB 状态。", "TVM token 证明 TVM measurement、configuration 和 security posture。", "Debug/PMU 等可观测能力需要进入 attestation posture。"], "AP-TEE Section 6 TVM Attestation and Measurements.", flow("attestation tokens", ["hardware RoT", "TSM token", "TVM measurement", "TVM token", "verifier policy", "secret release"])),
          m("CoVE SBI Extension", "SBI extension 是 host/guest/TSM 互操作的落地点。", ["Host runtime interface 覆盖 detect capability、create TVM、memory management、run。", "Guest interface 覆盖 attestation request 和 shared-memory operations。", "Draft ABI 可能变化，所以 PPT 必须标注 not ratified。"], "AP-TEE Section 8 CoVE SBI extension proposal.", cards("ABI groups", ["capability enumeration", "TVM creation", "memory conversion", "run/exit", "attestation request"]))
        ],
        evidenceEnv: s("AP-TEE 是规范草案，无实验；它支撑术语、状态机和 ABI，不支撑性能 claim。",
          ["证据源: 本地 AP-TEE draft PDF，约 80+ 页，章节覆盖 threat model 到 SBI。", "可支撑: TVM lifecycle、memory mapping security requirements、attestation token、runtime interface。", "边界: v0.7 draft/not ratified，后续版本可能改名、改状态机或改 ABI。"], "AP-TEE draft PDF Section 4-8.", matrix("证据边界", [["类型", "draft specification"], ["实验", "无"], ["成熟度", "not ratified"], ["可支撑", "lifecycle/ABI semantics"]])),
        performance: s("性能页写成无新实验: AP-TEE 不给 benchmark，但揭示未来开销来源。",
          ["潜在开销来自 TSM call、page conversion、measurement、TLB invalidation 和 interrupt handling。", "规范价值在互操作，不在证明开销。", "性能要回到后续实现或 CoVE 系统论文。"], "AP-TEE draft scope.", bars("claim strength", [{ label: "规范细节", value: "高", bar: 90 }, { label: "ratified status", value: "草案", bar: 45 }, { label: "performance evidence", value: "无", bar: 5 }, { label: "implementation guidance", value: "强", bar: 75 }])),
        evaluation: s("评价: AP-TEE 是 RISC-V CVM 方向最关键的当前材料，但必须显式标注 draft 风险。",
          ["优势: 把 CoVE lifecycle/ABI/attestation 写成可实现接口。", "局限: not ratified；缺生产实现、性能数据、完整 I/O 标准闭环。", "商业化潜力: 若稳定，会成为开放 CVM software stack 的对齐点。"], "AP-TEE draft status and README evaluation.", matrix("评价", [["优势", "standards-track semantics"], ["局限", "draft / no experiment"], ["商业化", "open CVM ABI"], ["本方向角色", "main SOTA spec"]]))
      },
      {
        key: "boubakri2025riscvtee",
        short: "Boubakri Survey",
        title: "A Survey of RISC-V Secure Enclaves and Trusted Execution Environments",
        authors: "Marouene Boubakri and Belhassen Zouari",
        venue: "Electronics 14(21):4171, 2025",
        role: "auxiliary survey for lineage and classification",
        primaryContribution: "横向整理 RISC-V enclave/TEE 系统、机制栈和开放挑战，辅助区分 pre-CoVE enclave 与 CoVE/AP-TEE。",
        boundary: "Survey 不提供一手机制证明或性能数据；机制 claim 回引 Keystone/Penglai/SPEAR-V/CoVE/AP-TEE 原始材料。",
        evidenceBase: "Boubakri survey local PDF/MDPI HTML; taxonomy tables and challenge sections.",
        titleEvidence: "README metadata; Boubakri PDF/MDPI page.",
        summary: s("Boubakri survey 的作用是给 RISC-V TEE 画地图，而不是替代原始系统论文。",
          ["动机: RISC-V TEE 论文、开源项目和规范发展快，容易把 enclave、CVM、monitor、runtime 混在一起。", "工作: 按 RISC-V security primitive、secure enclave lineage、TEE mechanism 和开放挑战整理。", "数据: survey 无新实验；使用论文/规范作为二手证据。"], "Boubakri survey sections on taxonomy and challenges.", flow("survey map", ["RISC-V primitives", "enclave systems", "runtime/monitor choices", "CoVE/AP-TEE", "open challenges"])),
        background: s("背景问题是同样叫 TEE，Keystone、Penglai、SPEAR-V、CoVE 的保护对象并不一样。",
          ["Keystone/Penglai/SPEAR-V 多是 enclave/process/address-space isolation。", "CoVE/AP-TEE 面向 whole-VM confidentiality。", "Survey 可帮助读者先定位层级，再进入具体论文。"], "Boubakri survey taxonomy sections.", matrix("分类校准", [["Keystone", "open enclave framework"], ["Penglai", "scalable enclave memory"], ["SPEAR-V", "tag-based primitive"], ["CoVE", "confidential VM"], ["AP-TEE", "draft CVM spec"]])),
        core: s("核心洞察: RISC-V TEE 的差异主要来自 trust placement、memory primitive、attestation 和 I/O support。",
          ["Trust 可放在 M-mode monitor、S-mode/HS-mode TSM、硬件 tag 或 SoC RoT。", "Memory primitive 可是 PMP/GPT/MMT/MTT/tag store。", "Survey 的价值是把这些设计轴合并成比较表。"], "Boubakri survey taxonomy and open issues.", cards("design axes", ["trust placement", "memory primitive", "attestation", "I/O/device support", "standard maturity"])),
        architecture: s("架构总览: Survey 不给单一系统图，而是给一张从 ISA primitive 到 TEE system 的分层视图。",
          ["底层: privileged ISA、PMP/ePMP、MMU、IOMMU、AIA。", "中层: monitor/TSM/runtime/memory metadata。", "上层: enclave app、serverless function、TVM workload、remote verifier。"], "Boubakri survey classification sections; relation to 07-09 decks.", matrix("分层视图", [["ISA", "privilege/PMP/MMU"], ["Platform", "RoT/IOMMU/AIA"], ["TEE manager", "SM/TSM/runtime"], ["Workload", "enclave or TVM"], ["Verifier", "attestation decision"]])),
        methods: [
          m("Primitive Stack", "Survey 把 RISC-V 安全 primitive 当作系统设计的底座。", ["Privilege mode 决定谁能管理隔离。", "PMP/ePMP/MMU/MTT/tag store 决定内存边界。", "IOMMU/AIA/CoVE-IO 决定 I/O 方向仍待成熟。"], "Boubakri survey primitive discussion.", flow("primitive stack", ["M/S/U/HS modes", "PMP/ePMP", "MMU/GPT/MTT", "IOMMU/AIA", "TEE system"])),
          m("Lineage Comparison", "Survey 的实用价值是把代表系统放在同一条演进线上。", ["Sanctum/Keystone 是 foundational open enclave。", "Penglai/CURE/SPEAR-V 是不同 memory primitive 分支。", "CoVE/AP-TEE 是 confidential VM 分支。"], "Boubakri survey comparative tables.", matrix("lineage", [["Foundational", "Sanctum / Keystone"], ["Scalable", "Penglai"], ["Primitive", "SPEAR-V / CURE"], ["CVM", "CoVE / AP-TEE"], ["I/O", "CoVE-IO emerging"]])),
          m("Open Challenges", "Survey 支撑“为什么还要继续研究”的问题意识。", ["标准化、硬件采用、formal verification、side-channel boundary、I/O/device trust 都未完全解决。", "不同论文 threat model 不可直接合并。", "商用前需要 verifier、firmware、OS、device ecosystem 一起成熟。"], "Boubakri survey open challenges section.", cards("open gaps", ["standardization", "hardware adoption", "I/O trust", "verification", "ecosystem maturity"]))
        ],
        evidenceEnv: s("实验页写成 survey 证据页: 无新系统实验，证据来自文献覆盖和分类一致性。",
          ["证据源: 本地 PDF 与 MDPI HTML 已核验。", "可支撑: 分类、谱系、挑战。", "不能支撑: 某个系统的真实性能、安全证明或 ABI 细节。"], "Boubakri survey PDF/HTML; README addendum.", matrix("证据边界", [["类型", "peer-reviewed survey"], ["实验", "无新实验"], ["支撑", "taxonomy"], ["边界", "mechanism claims need primary sources"]])),
        performance: s("性能页写成 claim-strength: survey 不能把二手 performance 写成一手结果。",
          ["可引用 survey 中的相对讨论，但 PPT 具体数字应回到 Keystone/Penglai/SPEAR-V/CoVE 原文。", "本页只说明覆盖范围和证据强度。", "这能避免把 survey 结论误当作系统实验。"], "Boubakri survey scope; README evidence boundary.", bars("claim strength", [{ label: "taxonomy coverage", value: "高", bar: 85 }, { label: "mechanism detail", value: "中", bar: 55 }, { label: "performance evidence", value: "二手", bar: 25 }, { label: "commercial roadmap", value: "辅助", bar: 65 }])),
        evaluation: s("评价: Boubakri survey 是很好的辅助材料，但它的正确用法是地图，不是证据终点。",
          ["优势: 新、覆盖 RISC-V TEE 谱系，适合开场比较。", "局限: survey 粒度有限，可能滞后 draft/spec 变化。", "商业化潜力: 适合做 roadmap 和 gap analysis；具体产品决策仍要看标准和系统实测。"], "Boubakri survey conclusion; README evaluation.", matrix("评价", [["优势", "taxonomy bridge"], ["局限", "secondary evidence"], ["商业化", "roadmap aid"], ["本方向角色", "auxiliary SOTA"]]))
      }
    ]
  },
  {
    id: "10-riscv-cove-io-tee-io",
    title: "RISC-V CoVE-IO / TEE-I/O",
    claim: "这个分类解释 confidential VM 如何安全使用设备: DMA/MMIO、IOMMU、IOPMP、SPDM/TDISP/IDE、interrupt 和 device assignment。",
    background: [
      "只保护 CPU memory 不够，设备可以通过 DMA、MMIO、interrupt、queue 和 link traffic 影响 confidential workload。",
      "sIOPMP 给 RISC-V TEE 做 scalable I/O protection；CoVE-IO draft 把 trusted device lifecycle 放进 AP-TEE-IO；IOMMU spec 提供 DMA translation 基础。",
      "本方向必须把地址隔离、设备身份、链路加密和生命周期分开讲，避免把 IOMMU 当成完整 trusted I/O。"
    ],
    keyClaim: "主线是“DMA access control -> trusted device lifecycle -> translation substrate”: sIOPMP 是系统论文，CoVE-IO 是 draft spec，IOMMU 是底层规范。",
    keyPoints: [
      "sIOPMP: 提出 scalable I/O protection metadata/checking，降低 TEE 设备访问控制的可扩展性瓶颈。",
      "CoVE-IO: 定义 RISC-V AP-TEE-IO 中的 TVM trusted device assignment、bounce buffer baseline 和 TEE-IO lifecycle。",
      "RISC-V IOMMU: 定义 DMA translation/direct assignment，是必要条件，但不提供设备 attestation 或 link security。"
    ],
    evidence: "sIOPMP peer-reviewed PDF; RISC-V CoVE-IO draft PDF; RISC-V IOMMU spec PDF.",
    path: ["device issues DMA/MMIO", "IOMMU translates address", "IOPMP checks physical access", "SPDM/TDISP proves device identity", "IDE protects link", "TSM binds device to TVM"],
    papers: [
      {
        key: "feng2024siopmp",
        short: "sIOPMP",
        title: "sIOPMP: Scalable and Efficient I/O Protection for TEEs",
        authors: "Erhu Feng et al.",
        venue: "ASPLOS 2024",
        role: "peer-reviewed SOTA RISC-V I/O protection mechanism",
        primaryContribution: "提出面向 TEE 的 scalable I/O protection primitive，用更可扩展的 metadata/checking 保护设备 DMA/MMIO access。",
        boundary: "sIOPMP 保护 I/O access control，不等同于完整 SPDM/TDISP/CoVE-IO trusted-device lifecycle。",
        evidenceBase: "sIOPMP PDF design figures/tables; local README metadata.",
        titleEvidence: "README metadata; sIOPMP ASPLOS 2024 PDF title page.",
        summary: s("sIOPMP 的核心贡献是把设备访问控制做成可扩展硬件检查，而不是靠少量粗粒度 IOPMP entry。",
          ["动机: DMA 设备可绕过 CPU-side enclave/TVM memory isolation，传统 I/O protection metadata 不够可扩展。", "工作: 设计 scalable I/O protection metadata 和 checking path，用于 TEE 场景的 device access control。", "数据: peer-reviewed 系统论文，有实现和性能评估；具体页码/图表在 README addendum 中保留。"], "sIOPMP abstract, design, and evaluation sections.", flow("sIOPMP story", ["device request", "source identity", "metadata lookup", "permission check", "TEE memory access allowed/blocked"])),
        background: s("背景问题是 CPU TEE 边界会被 I/O 打穿: DMA 不经过 CPU page table。",
          ["Enclave/TVM 私有页即使 CPU 访问受限，也可能被设备 DMA 读写。", "设备数量、queue、address range 增加后，静态 region 规则难维护。", "TEE 需要既保护私有内存，又允许受信设备高性能访问。"], "sIOPMP motivation sections; relation to IOMMU/IOPMP.", matrix("I/O attack surface", [["DMA read", "secret exfiltration"], ["DMA write", "memory corruption"], ["MMIO", "device control path"], ["Queue", "descriptor tamper"], ["Metadata scale", "many devices/regions"]])),
        core: s("核心洞察: I/O protection 的关键不是“有没有检查”，而是检查是否能随设备和内存规模扩展。",
          ["sIOPMP 把 source ID、memory domain 和 permission metadata 组织成更可扩展结构。", "它把设备访问控制放在数据路径硬件里，减少 monitor/hypervisor 高频介入。", "但它仍需要上层 TSM/attestation 决定哪个 device 可信。"], "sIOPMP design sections.", cards("design axes", ["source identity", "memory domain", "permission metadata", "fast lookup", "TEE policy above"])),
        architecture: s("架构总览: 设备请求先被识别为某个 source，再经 sIOPMP metadata 判断能否访问目标物理地址。",
          ["这与 CPU-side PMP 类似，但对象从 CPU core 变成 I/O master。", "sIOPMP 更关注 scalable metadata layout 和 lookup cost。", "上层 TEE manager 负责配置 policy，下层硬件负责每次访问 enforcement。"], "sIOPMP architecture/design figures.", matrix("组件", [["I/O master", "device / DMA engine"], ["Source ID", "who sends request"], ["Domain metadata", "which TEE owns memory"], ["Checker", "allow/deny"], ["TEE manager", "configures policy"]])),
        methods: [
          m("Source-to-Domain Mapping", "sIOPMP 首先要回答: 这次 I/O request 来自哪个设备或 function。", ["设备身份在平台内部通常来自 requester/source ID。", "Source 被映射到 memory domain 或 permission context。", "错误映射会导致设备越权访问 TVM/enclave memory。"], "sIOPMP source identity mapping design.", flow("source mapping", ["requester ID", "source table", "memory domain", "permission context", "access decision"])),
          m("Scalable Permission Metadata", "核心设计目标是避免每个 device/region 都占用昂贵固定 entry。", ["Metadata 要支持大量设备和动态内存。", "Lookup 必须足够快，不能让每次 DMA 都陷入软件。", "配置路径仍必须被 trusted firmware/TSM 保护。"], "sIOPMP metadata/checking design.", matrix("metadata tradeoff", [["粒度", "fine enough for TEE pages"], ["规模", "many devices/domains"], ["速度", "hardware path"], ["配置", "trusted control"], ["风险", "stale policy"]])),
          m("TEE Integration Boundary", "sIOPMP 是 enforcement primitive，不是完整 trusted I/O stack。", ["它不自己证明设备固件身份。", "它不自己提供 PCIe link encryption/freshness。", "它需要和 CoVE-IO、SPDM/TDISP、IOMMU、AIA 组合。"], "sIOPMP discussion; CoVE-IO/IOMMU relation.", cards("needs above/beside", ["TSM policy", "SPDM device identity", "TDISP assignment", "PCIe IDE", "IOMMU translation"])),
          m("Performance Path", "性能关键在每次 DMA 的 fast-path check 和 policy update 的 slow-path 管理。", ["Fast path 应只做 metadata lookup 和 permission check。", "Slow path 处理 domain create/destroy、device bind/unbind、permission update。", "PPT 用这个框架解释为什么 I/O protection 难比 CPU load/store PMP 更复杂。"], "sIOPMP evaluation and design rationale.", flow("fast/slow path", ["slow: configure domain", "slow: bind device", "fast: DMA request", "fast: metadata check", "fast: memory access/fault"]))
        ],
        evidenceEnv: s("实验环境与数据页: sIOPMP 是系统论文，有设计、实现和评估，但 deck 不把它扩写成 device attestation 证据。",
          ["证据源: 本地 peer-reviewed PDF 和 README。", "可支撑: scalable I/O protection mechanism and overhead discussion。", "边界: 不能支撑 SPDM/TDISP/IDE 或完整 CoVE-IO lifecycle。"], "sIOPMP PDF design/evaluation; README evidence boundary.", matrix("证据边界", [["类型", "peer-reviewed system"], ["可支撑", "I/O access control"], ["不能支撑", "device identity lifecycle"], ["组合需求", "CoVE-IO + IOMMU + SPDM/TDISP"]])),
        performance: s("性能结论按机制解释: sIOPMP 的价值在降低 I/O protection fast path 的扩展成本。",
          ["具体 benchmark 数字以论文评价章节为准，README addendum 保留 evidence refs。", "关键指标应看 DMA latency/throughput、metadata memory cost、policy update cost。", "本页不把 access-control overhead 写成完整 TEE-I/O overhead。"], "sIOPMP evaluation sections.", bars("performance interpretation", [{ label: "I/O access control evidence", value: "强", bar: 80 }, { label: "device attestation evidence", value: "无", bar: 5 }, { label: "trusted lifecycle evidence", value: "需 CoVE-IO", bar: 30 }, { label: "scalability focus", value: "高", bar: 90 }])),
        evaluation: s("评价: sIOPMP 是 RISC-V trusted I/O 的关键机制论文，但它只解决 data-path protection 的一段。",
          ["优势: 把 DMA/MMIO access control 作为硬件 primitive 处理，方向正确。", "局限: 设备身份、链路保护、interrupt 和 lifecycle 需要其他标准/系统。", "商业化潜力: 适合 RISC-V SoC、DPU、accelerator 平台；风险在标准采纳和与 IOMMU/TEE-IO 的接口。"], "sIOPMP conclusion and README evaluation.", matrix("评价", [["优势", "scalable I/O enforcement"], ["局限", "not full TEE-I/O"], ["商业化", "RISC-V SoC I/O"], ["本方向角色", "main mechanism SOTA"]]))
      },
      {
        key: "riscv_cove_io_2026",
        short: "CoVE-IO",
        title: "RISC-V CoVE-IO Specification",
        authors: "RISC-V Non-ISA AP-TEE-IO contributors",
        venue: "RISC-V AP-TEE-IO / CoVE-IO draft specification, 2026",
        role: "standards-track trusted device lifecycle draft",
        primaryContribution: "定义 RISC-V confidential VM 的 trusted device assignment、bounce buffering、PCIe topology、TEE-IO requirements 和 device lifecycle 语义。",
        boundary: "draft/not ratified；不提供系统实验，也不替代 SPDM/TDISP/PCIe IDE 原始规范。",
        evidenceBase: "CoVE-IO PDF Figure 1 bounce buffering; Figure 2 topology; Figure 3 high-level architecture; Tables 1-3 requirements.",
        titleEvidence: "README metadata; CoVE-IO draft PDF title page.",
        summary: s("CoVE-IO 的作用是把“TVM 能不能直接用设备”写成一组 lifecycle 和协议要求。",
          ["动机: bounce buffer 能工作但慢；直接设备 assignment 需要证明设备身份、保护链路和约束 DMA/interrupt。", "工作: 整理 AP-TEE-IO requirements、topology、high-level architecture 和 TEE-IO/TDISP/SPDM/IDE 关系。", "数据: 规范草案无实验，证据来自 Figure 1-3 和 requirement tables。"], "CoVE-IO Figure 1-Figure 3; Tables 1-3.", flow("CoVE-IO path", ["TVM wants device", "baseline bounce buffer", "device identity", "secure link", "IOMMU/IOPMP policy", "trusted assignment"])),
        background: s("背景问题是 confidential VM 的 I/O 默认会退回 shared memory/bounce buffer，安全但性能和语义都不理想。",
          ["Bounce buffer 让 host 可见共享页，TVM 必须复制/加密/验证。", "直通设备需要设备固件身份、PCIe link protection、DMA isolation 和 interrupt routing。", "任何一个环节缺失，设备都可能成为 host 观察或篡改 TVM 的通道。"], "CoVE-IO Figure 1; requirement sections.", matrix("trusted I/O 要素", [["Identity", "SPDM certificate/measurement"], ["Assignment", "TDISP lifecycle"], ["Link", "PCIe IDE"], ["DMA", "IOMMU/IOPMP"], ["Interrupt", "AIA/secure interrupt policy"]])),
        core: s("核心洞察: CoVE-IO 不是一个单独模块，而是把多个标准和 RISC-V TSM lifecycle 绑定起来。",
          ["SPDM 解决设备身份和 measurement。", "TDISP 解决 device interface assignment state。", "IDE 解决 PCIe link confidentiality/integrity。", "TSM 负责把这些证据与 TVM memory/interrupt/DMA policy 绑定。"], "CoVE-IO high-level architecture; related requirements.", cards("protocol bundle", ["SPDM", "TDISP", "PCIe IDE", "IOMMU/IOPMP", "TSM policy"])),
        architecture: s("架构总览: CoVE-IO 在 TVM、host VMM、TSM、IOMMU、root port 和 device 之间建立 trust choreography。",
          ["Figure 2 解释 PCIe topology，Figure 3 解释 high-level architecture。", "Host 仍管理资源，但 trusted assignment state 不能只由 host 决定。", "Device interface 从 unassigned 到 assigned to TVM 需要可证明转换。"], "CoVE-IO Figure 2-Figure 3.", matrix("架构对象", [["TVM", "device user"], ["Host/VMM", "resource orchestrator"], ["TSM", "trusted policy owner"], ["IOMMU", "DMA translation"], ["Device", "SPDM/TDISP endpoint"]])),
        methods: [
          m("Bounce Buffer Baseline", "CoVE-IO 先说明 baseline: 用 shared pages 做 I/O，安全边界清楚但成本高。", ["TVM 私有内存不直接给设备 DMA。", "I/O data 通过 shared/non-confidential buffer 中转。", "这降低 device trust requirement，但增加 copy 和 encryption burden。"], "CoVE-IO Figure 1 bounce buffering.", flow("bounce path", ["TVM private data", "copy/encrypt", "shared buffer", "host/device I/O", "copy/verify back", "TVM private data"])),
          m("Trusted Device Assignment", "直接 assignment 要把 device interface state 绑定到某个 TVM。", ["设备必须通过 SPDM/TDISP 证明身份和状态。", "TSM/IOMMU/IOPMP 必须配置只允许访问 TVM 授权内存。", "Unassign/reset/cleanup 同样是安全生命周期的一部分。"], "CoVE-IO requirements and TEE-IO architecture.", flow("assignment lifecycle", ["discover device", "authenticate", "lock interface", "assign to TVM", "run I/O", "unassign and clean"])),
          m("DMA / Interrupt / MMIO Policy", "Trusted I/O 不只看 DMA，还包括 MMIO register 和 interrupt delivery。", ["DMA translation 需要 IOMMU/IOPMP。", "MMIO 配置空间不能让 host 注入危险 state。", "Interrupt/MSI routing 必须防 fake/wrong target。"], "CoVE-IO architecture; relation to IOMMU/AIA.", matrix("data/control paths", [["DMA", "IOMMU/IOPMP"], ["MMIO", "register access policy"], ["Interrupt", "AIA/IMSIC routing"], ["Queue", "descriptor ownership"], ["Reset", "state cleanup"]])),
          m("Evidence Binding", "最终 verifier 需要知道 TVM 用的 device 是否也在可信状态。", ["Platform attestation 只证明 CPU/TSM 不够。", "Device evidence 需要和 TVM token 或 policy 关联。", "这也是 CoVE-IO draft 与 SPDM/TDISP 的连接点。"], "CoVE-IO attestation and device lifecycle requirements.", flow("evidence", ["platform token", "TSM policy", "SPDM device cert", "TDISP state", "TVM-device binding", "verifier decision"]))
        ],
        evidenceEnv: s("CoVE-IO 是 draft specification，无新实验；本页记录 evidence boundary。",
          ["证据源: 本地 PDF，Figure 1-3 和 requirement tables。", "可支撑: trusted I/O requirement taxonomy, lifecycle, architecture。", "不能支撑: 性能 overhead、final ratified standard、某个 device 的实际安全。"], "CoVE-IO Figure 1-Figure 3; Tables 1-3.", matrix("证据边界", [["类型", "draft spec"], ["实验", "无"], ["可支撑", "TEE-I/O lifecycle"], ["不能支撑", "performance / final ABI"]])),
        performance: s("性能页写成无新实验: CoVE-IO 只定义路径，不测路径。",
          ["性能风险来自 bounce buffer copy、SPDM/TDISP setup、IOMMU translation、IDE encryption 和 interrupt virtualization。", "直接 assignment 可减少 copy，但增加 trusted lifecycle complexity。", "具体数字应引用未来实现或 device/vendor report。"], "CoVE-IO draft scope.", bars("path tradeoff", [{ label: "bounce safety", value: "高", bar: 80 }, { label: "bounce performance", value: "低", bar: 25 }, { label: "direct I/O performance", value: "潜力高", bar: 75 }, { label: "direct I/O complexity", value: "高", bar: 85 }])),
        evaluation: s("评价: CoVE-IO 是 RISC-V confidential I/O 的关键蓝图，但还处于标准收敛阶段。",
          ["优势: 把 SPDM/TDISP/IDE/IOMMU/TSM 放到同一 lifecycle。", "局限: draft/not ratified，无实现性能；依赖 PCIe/device ecosystem。", "商业化潜力: 云 CVM 设备直通、accelerator、storage、SmartNIC 都需要它。"], "CoVE-IO draft status and README evaluation.", matrix("评价", [["优势", "full lifecycle blueprint"], ["局限", "draft/no experiment"], ["商业化", "CVM device assignment"], ["本方向角色", "standards-track SOTA"]]))
      },
      {
        key: "riscv_iommu_2023",
        short: "RISC-V IOMMU",
        title: "RISC-V IOMMU Architecture Specification",
        authors: "RISC-V Non-ISA IOMMU contributors",
        venue: "RISC-V IOMMU specification, 2026 snapshot",
        role: "auxiliary DMA translation substrate",
        primaryContribution: "定义 DMA translation、device context、direct assignment、fault/reporting，是 CoVE-IO 的地址隔离底座。",
        boundary: "IOMMU 是必要条件，不提供设备身份、链路保护或完整 TEE-I/O lifecycle。",
        evidenceBase: "IOMMU local PDF Figure 1 device isolation; Figure 2 direct assignment; Table 1 terms.",
        titleEvidence: "README metadata; IOMMU spec PDF.",
        summary: s("IOMMU 的作用是让设备 DMA 也必须经过地址转换和权限检查。",
          ["动机: 没有 IOMMU，设备可直接 DMA 到 TVM/enclave/private memory。", "工作: 定义 device context、I/O page table、translation、fault、direct assignment。", "数据: 规范无实验；证据是 Figure 1/2 和术语表。"], "IOMMU Figure 1; Figure 2; Table 1.", flow("DMA translation", ["device request", "device ID", "context lookup", "I/O page table", "permission check", "translated address/fault"])),
        background: s("背景问题是 DMA 不走 CPU page table，所以 CPU-side confidential memory 需要 I/O-side enforcement。",
          ["Device assignment 到 VM 时，设备需要 guest-specific address space。", "Host 配置 IOMMU 的能力本身也要被 TSM/policy 约束。", "IOMMU 解决地址，不解决设备是否可信。"], "IOMMU introduction; Figure 1/2.", matrix("IOMMU covers", [["DMA address", "yes"], ["Permission", "yes"], ["Fault reporting", "yes"], ["Device identity proof", "no"], ["Link encryption", "no"]])),
        core: s("核心洞察: IOMMU 是 trusted I/O 的地址层，CoVE-IO 是它上面的信任层。",
          ["IOMMU 让 direct assignment 可实现。", "CoVE-IO 需要确保 IOMMU 配置与 TVM ownership 一致。", "sIOPMP/IOPMP 可补充 physical access control。"], "IOMMU spec; CoVE-IO relation.", cards("layering", ["IOMMU translation", "IOPMP permission", "TSM config authority", "SPDM/TDISP identity", "TVM policy"])),
        architecture: s("架构总览: device context 指向 translation root，fault queue/command queue 支撑 runtime 管理。",
          ["Figure 1 是 non-virtualized isolation。", "Figure 2 是 direct assignment to VM。", "TEE 场景必须把 context ownership 与 TVM lifecycle 一起管理。"], "IOMMU Figure 1-Figure 2.", matrix("组件", [["Device context", "select translation root"], ["I/O page table", "DMA mappings"], ["Fault queue", "violation reporting"], ["Command queue", "management"], ["IOTLB", "performance cache"]])),
        methods: [
          m("Device Context Lookup", "每个 DMA request 先定位 device context，决定走哪个 translation root。", ["Requester/source ID 是隔离入口。", "Context 配错会让设备进入错误 address space。", "TEE manager 必须把 context update 纳入可信流程。"], "IOMMU context and translation sections.", flow("context lookup", ["requester ID", "device context", "translation root", "permission", "DMA result"])),
          m("Direct Assignment", "IOMMU 让设备直通给 VM 成为可能，但 confidential VM 需要更强配置保护。", ["Guest DMA 访问必须限制到 assigned memory。", "Fault/reporting 不能泄露过多 TVM state。", "Unassign 后要清理 stale mapping。"], "IOMMU Figure 2; assignment sections.", matrix("assignment risks", [["Wrong context", "cross-VM DMA"], ["Stale IOTLB", "old mapping usable"], ["Fault leak", "state observability"], ["Unassign", "cleanup required"], ["TEE fix", "TSM policy"]])),
          m("Fault and Invalidation", "IOMMU runtime 的难点在 invalidation、fault delivery 和缓存一致性。", ["IOTLB 提升性能但需要正确 invalidation。", "Fault queue 让 software 观察 violation，但也形成 DoS/side signal。", "CoVE-IO 需要定义 confidential fault handling policy。"], "IOMMU fault/invalidation sections.", cards("runtime control", ["IOTLB", "invalidation", "fault queue", "command queue", "DoS boundary"]))
        ],
        evidenceEnv: s("IOMMU 是规范，无实验；作为 10 方向第三篇辅助 SOTA，只承载 DMA translation 语义。",
          ["证据源: 本地 PDF，Figure 1/2 和 Table 1。", "可支撑: DMA isolation/direct assignment terms。", "不能支撑: device trust, SPDM/TDISP, performance overhead。"], "IOMMU spec Figure 1/2; Table 1.", matrix("证据边界", [["类型", "spec"], ["实验", "无"], ["可支撑", "DMA translation"], ["不能支撑", "trusted device lifecycle"]])),
        performance: s("性能页写成无新实验: IOMMU 规范不提供 benchmark。",
          ["性能关注 IOTLB hit/miss、page-table walk、invalidation、fault handling。", "直接 assignment 性能潜力高，但 trusted lifecycle 会增加 setup cost。", "具体开销必须来自实现评测。"], "IOMMU spec scope.", bars("claim strength", [{ label: "DMA semantics", value: "高", bar: 90 }, { label: "performance data", value: "无", bar: 5 }, { label: "CoVE-IO dependency", value: "高", bar: 80 }, { label: "identity coverage", value: "无", bar: 5 }])),
        evaluation: s("评价: IOMMU 是本方向不可缺的底座，但必须和 sIOPMP/CoVE-IO/SPDM/TDISP 合用。",
          ["优势: 官方 DMA translation 语义，支持 direct assignment。", "局限: 不证明设备可信，也不处理链路加密。", "商业化潜力: 虚拟化、CVM、DPU/accelerator assignment 的基础。"], "IOMMU README evaluation.", matrix("评价", [["优势", "DMA address boundary"], ["局限", "not full trusted I/O"], ["商业化", "device passthrough"], ["本方向角色", "translation substrate"]]))
      }
    ]
  },
  {
    id: "11-memory-encryption-integrity-replay",
    title: "内存加密 / 完整性 / Replay Protection",
    claim: "这个分类解释 confidential computing 中 memory protection 的三件事: confidentiality、integrity 和 freshness/replay。",
    background: [
      "内存加密只解决“看不懂”，完整性解决“改不了”，freshness/replay 解决“不能把旧值放回来”。三者缺一不可。",
      "Henson survey 给 memory encryption 技术谱系，Bonsai Merkle Trees 给 integrity/freshness 的经典低开销设计，AMD SEV-SNP 说明现代 VM 隔离如何加入 guest state 和 RMP 机制。",
      "本方向把 survey、经典体系结构论文和工业白皮书放在一起，强调 evidence strength 不同。"
    ],
    keyClaim: "主 SOTA 选 Bonsai Merkle Trees，因为它给出可评估的 integrity/freshness 机制；Henson survey 做背景，SEV-SNP 说明产业级 VM 隔离边界。",
    keyPoints: [
      "Henson 2014 survey: 总结 existing memory encryption techniques 和攻击/设计轴，作为背景材料。",
      "Rogers 2007 Bonsai Merkle Trees: 用 address-independent seed encryption + BMT 降低完整性树 cache pollution 和 overhead。",
      "AMD SEV-SNP: 工业白皮书，说明 SEV-ES/NAE/GHCB 与 SNP/RMP 这类 VM isolation hardening 的方向。"
    ],
    evidence: "Henson memory encryption survey; Rogers MICRO 2007 BMT PDF; AMD SEV-SNP/SEV-ES whitepaper PDF.",
    path: ["confidentiality encrypts memory", "integrity detects modification", "freshness detects replay", "metadata/counters/Merkle tree carry proof", "VM isolation adds ownership tables", "attestation reports security posture"],
    papers: [
      {
        key: "henson2014memory",
        short: "Memory Encryption Survey",
        title: "Memory Encryption: A Survey of Existing Techniques",
        authors: "Martin Henson and Stephen Taylor",
        venue: "ACM Computing Surveys, 2014",
        role: "survey/background taxonomy",
        primaryContribution: "系统整理 memory encryption 的 threat model、block/counter/key/MAC/integrity 设计空间。",
        boundary: "Survey 无新实验；不能替代具体 memory encryption/integrity 系统论文。",
        evidenceBase: "Survey PDF Figure 1/2 and technique tables; README metadata.",
        titleEvidence: "README metadata; ACM Computing Surveys PDF.",
        summary: s("Henson survey 的价值是建立 memory encryption 的词典: 加密、计数器、完整性、replay 都不是一回事。",
          ["动机: 处理器外部内存可被总线探测、冷启动、DMA 或恶意平台观察/篡改。", "工作: 综述 existing memory encryption techniques 和设计 tradeoff。", "数据: survey 无新实验；证据来自文献分类。"], "Henson survey introduction; Figures/Tables on existing techniques.", flow("memory protection goals", ["plaintext in CPU", "encrypt before DRAM", "counter/nonce", "MAC/integrity", "Merkle/freshness", "plaintext returns to CPU"])),
        background: s("背景问题是 DRAM 不在 CPU trust boundary 内，攻击者可以观察或回放外部内存内容。",
          ["只加密无法防止 bit flipping 或 replay。", "MAC 能检测篡改，但没有 freshness 时旧的合法 ciphertext/MAC 仍可回放。", "计数器和 Merkle tree 解决 freshness，但引入存储和性能开销。"], "Henson survey security discussion.", matrix("三类保护", [["Confidentiality", "encryption"], ["Integrity", "MAC/hash"], ["Freshness", "counter/tree"], ["Replay risk", "old valid block"], ["Cost", "metadata + cache pressure"]])),
        core: s("核心洞察: memory security 的设计本质是 metadata management。",
          ["Counter 必须唯一且不回退。", "Integrity tree 必须覆盖 counter 或 data。", "Metadata 如果太大，会污染 cache 并吞掉 memory bandwidth。"], "Henson survey technique comparison.", cards("metadata questions", ["where counters live", "how MACs are cached", "what tree covers", "what survives crash", "what trust root stores"])),
        architecture: s("架构总览: Survey 将技术按加密模式、地址绑定、计数器、MAC 和 tree 组织起来。",
          ["Address-dependent encryption 容易影响 page movement。", "Counter-mode encryption 提供 latency hiding，但 counter storage 是成本。", "Merkle/integrity tree 给 freshness，但树节点会影响 cache。"], "Henson survey taxonomy tables.", matrix("taxonomy", [["Encryption mode", "counter / tweak / stream"], ["Address binding", "virtual/physical/address-independent"], ["Integrity", "MAC/hash"], ["Freshness", "tree/counter root"], ["System issue", "paging/sharing/VM"]])),
        methods: [
          m("Encryption Granularity", "粒度越细，保护越精细，但 metadata 和 lookup 越多。", ["Cache-line encryption 是常见粒度。", "Page-level 方案便于 OS 管理但可能泄露更粗模式。", "Block/counter size 会影响存储开销。"], "Henson survey granularity discussion.", matrix("granularity", [["cache line", "common data block"], ["page", "OS-friendly"], ["counter block", "metadata grouping"], ["tree node", "freshness proof"], ["root", "trusted on-chip"]])),
          m("Counter / Nonce Management", "Counter-mode 安全依赖不重用 keystream，所以 counter 是安全状态。", ["Counter 重用会泄露 plaintext relation。", "Counter overflow、rollback 和 crash recovery 都是系统问题。", "Address-independent seed 类方案试图让 page movement 更容易。"], "Henson survey counter-mode sections.", flow("counter path", ["block address", "counter/seed", "AES stream", "xor plaintext", "ciphertext", "counter update"])),
          m("Integrity and Replay", "MAC 检测篡改，Merkle tree 把 MAC/counter 的 freshness 连接到可信 root。", ["CPU 内保留 root 或少量可信 state。", "Memory 中存储 MAC/tree nodes。", "读取时验证 path，写入时更新 path。"], "Henson survey integrity/freshness sections.", flow("verify", ["load data+counter", "load MAC/tree nodes", "recompute", "compare to root", "accept or fault"])),
          m("Survey Evidence Boundary", "Survey 的正确用法是解释设计空间，而不是给某个机制背书。", ["它能说明为什么 Bonsai Merkle Tree 有意义。", "它不能证明某个商用 CPU 的安全。", "具体性能必须回到 BMT/SEV-SNP/实现论文。"], "Henson survey scope.", cards("use correctly", ["taxonomy", "threat vocabulary", "tradeoff framing", "not primary experiment", "not product claim"]))
        ],
        evidenceEnv: s("实验页写成 survey 证据页: 无新实验，只有文献覆盖。",
          ["证据源: ACM Computing Surveys paper local PDF。", "可支撑: memory encryption taxonomy and vocabulary。", "不能支撑: overhead numbers for BMT/SEV-SNP or modern CPUs。"], "Henson survey README and PDF.", matrix("证据边界", [["类型", "survey"], ["实验", "无"], ["可支撑", "taxonomy"], ["不能支撑", "system performance"]])),
        performance: s("性能页写成 claim-strength: survey 不产出新性能曲线。",
          ["它提示性能成本来自 encryption latency、MAC/tree node fetch、counter storage 和 cache pollution。", "具体数字引用 Rogers BMT 或产品实现材料。", "因此本页只画性能成本来源。"], "Henson survey performance discussion.", bars("cost sources", [{ label: "encryption latency", value: "medium", bar: 50 }, { label: "tree metadata", value: "high risk", bar: 80 }, { label: "counter storage", value: "medium", bar: 55 }, { label: "survey own data", value: "none", bar: 5 }])),
        evaluation: s("评价: Henson survey 适合作为方向第一页背景，不适合作为 SOTA 机制终点。",
          ["优势: 概念清楚，便于区分 encryption/integrity/freshness。", "局限: 2014 年材料较旧，不能覆盖 CXL/TEE-I/O/modern CVM 全部边界。", "商业化潜力: 做产品威胁建模词典；真正落地看具体 CPU/SoC 机制。"], "Henson survey conclusion and README evaluation.", matrix("评价", [["优势", "clear taxonomy"], ["局限", "older survey"], ["商业化", "threat-model vocabulary"], ["本方向角色", "background taxonomy"]]))
      },
      {
        key: "rogers2007bonsai",
        short: "Bonsai Merkle Trees",
        title: "Using Address Independent Seed Encryption and Bonsai Merkle Trees to Make Secure Processors OS- and Performance-Friendly",
        authors: "Brian Rogers, Siddhartha Chhabra, Milos Prvulovic, Yan Solihin",
        venue: "MICRO 2007",
        role: "classic peer-reviewed primary mechanism for memory integrity/freshness",
        primaryContribution: "提出 AISE + Bonsai Merkle Trees，只把 tree 覆盖 counter 而非全部 data，显著降低 integrity verification overhead。",
        boundary: "模拟评估基于 SPEC2000 与当时架构假设；不是现代 CVM 产品白皮书。",
        evidenceBase: "BMT PDF Table 1 qualitative comparison; Figure 5 BMT size reduction; Figure 6-11 performance; Table 2 storage overhead.",
        titleEvidence: "MICRO 2007 PDF title page and README metadata.",
        summary: s("BMT 的贡献是把 replay protection 做得更省 cache: 树只保护 counter，data 用 MAC 保护。",
          ["动机: 传统 Merkle Tree 为所有 data block 建树，树节点会严重污染 cache 和 bandwidth。", "工作: Address Independent Seed Encryption 支持系统友好 page movement，共同搭配 Bonsai Merkle Trees。", "数据: SPEC2000 模拟评估显示 AISE+BMT 平均 execution overhead 约 1.8%，明显低于 standard Merkle Tree。"], "BMT Figure 5-Figure 8; Table 1; Table 2.", flow("AISE+BMT", ["CPU request", "AISE counter seed", "data encryption", "MAC checks data", "BMT checks counters", "trusted root"])),
        background: s("背景问题是 secure processor 要同时支持 OS 功能和低开销 memory integrity。",
          ["Global counter 简单但存储和系统支持差。", "Virtual/physical address based encryption 会影响 shared memory、page movement 或 IPC。", "传统 Merkle Tree 能防 replay，但树节点太多，cache pollution 高。"], "BMT Section 1-3; Table 1.", matrix("旧方案痛点", [["Global counter", "high storage / IPC issue"], ["Address-based", "page movement hard"], ["Standard MT", "cache pollution"], ["No freshness", "replay possible"], ["AISE+BMT", "OS-friendly + lower overhead"]])),
        core: s("核心洞察: Freshness 的树不必覆盖所有 data block，只需覆盖不可回退的 counters。",
          ["Data block 用 MAC 保护 integrity。", "Counter block 用 Bonsai Merkle Tree 保护 freshness。", "因为 counter metadata 比 data 小得多，树更小，cache 污染更低。"], "BMT Figure 5; Section 5 Bonsai Merkle Trees.", cards("why Bonsai", ["data MAC outside tree", "tree over counters", "small trusted root", "less cache pollution", "same replay goal"])),
        architecture: s("架构总览: CPU 内有 root/crypto engine，内存中有 data、counter、MAC 和 BMT nodes。",
          ["读数据时并行/流水处理 decryption、MAC verification 和 BMT path verification。", "写数据时 counter/MAC/tree path 更新。", "AISE 的 seed 设计让 memory sharing 和 page movement 更友好。"], "BMT architecture and methodology sections; Table 1.", matrix("组件", [["Data block", "encrypted"], ["Counter", "freshness state"], ["MAC", "data integrity"], ["BMT node", "counter freshness"], ["Root", "trusted on-chip"]])),
        methods: [
          m("Address Independent Seed Encryption", "AISE 避免把 ciphertext 与固定虚拟/物理地址强绑定，降低 OS 管理障碍。", ["Page movement、shared memory 和 IPC 更容易支持。", "Seed/counter 构造仍保证 encryption stream 不重用。", "Table 1 将 AISE 与 global/virtual/physical schemes 对比。"], "BMT Table 1; Section 4 AISE.", flow("AISE encrypt", ["LPID / seed", "block counter", "AES stream", "xor plaintext", "MAC ciphertext", "store data"])),
          m("Bonsai Merkle Tree", "BMT 的树覆盖 counter blocks，而 data blocks 由 MAC 覆盖。", ["Counter replay 会被 BMT root 检出。", "Data modification 会被 MAC 检出。", "树规模相对 standard Merkle Tree 明显降低。"], "BMT Figure 5; Section 5.", flow("BMT verify", ["load counter", "verify counter path", "verify data MAC", "decrypt", "return plaintext"])),
          m("Cache Pollution Reduction", "BMT 性能优势来自减少 Merkle nodes 占用 cache。", ["论文报告 standard MT 平均 L2 cache 中大量空间被 tree nodes 占用。", "BMT 让 data 占比接近无完整性方案。", "这解释了 Figure 8/9/10 的 overhead 差异。"], "BMT Figure 8-Figure 10.", bars("cache effect", [{ label: "Standard MT cache pressure", value: "high", bar: 80 }, { label: "BMT cache pressure", value: "low", bar: 20 }, { label: "BMT bus growth", value: "small", bar: 25 }])),
          m("Storage Overhead Tradeoff", "BMT 降低性能开销，但仍要为 MAC/counter/tree 付出内存开销。", ["Table 2 显示 MAC size 越大，storage overhead 越高。", "BMT 相比 global64+MT 仍有 storage advantage。", "现代系统还要考虑 crash consistency 和 persistence。"], "BMT Table 2; Figure 11.", matrix("metadata cost", [["Counters", "required for freshness"], ["MACs", "integrity"], ["Tree nodes", "counter freshness"], ["Trusted root", "on-chip"], ["Crash", "not fully solved here"]]))
        ],
        evidenceEnv: s("实验环境与数据: SESC simulator + SPEC2000，比较 AISE+BMT 与其他 counter/Merkle 方案。",
          ["模拟器: SESC execution-driven simulator。", "工作负载: 21 个 C/C++ SPEC2000 benchmark，reference input，fast-forward 后模拟。", "参数: L2 1MB/8-way，memory latency 200 cycles，AES/MAC latency assumptions。"], "BMT Section 6 Experimental Setup.", matrix("实验设置", [["Simulator", "SESC"], ["Benchmarks", "21 SPEC2000 C/C++"], ["Memory", "200-cycle latency"], ["Crypto", "AES/MAC modeled"], ["Metric", "execution time/storage/cache pollution"]])),
        performance: s("性能结论很强: AISE+BMT 把完整性/freshness overhead 从 standard MT 的两位数降到约 1.8%。",
          ["Figure 6: global64+MT 平均 overhead 约 25.9%，AISE+BMT 平均约 1.8%。", "Figure 8: AISE+MT 约 12.1%，AISE+BMT 约 1.8%。", "Table 2: 128-bit MAC 时 AISE+BMT storage overhead 约 21.55%，仍有明显成本。"], "BMT Figure 6; Figure 8; Table 2; conclusion.", bars("reported numbers", [{ label: "global64+MT avg overhead", value: "25.9%", bar: 80 }, { label: "AISE+MT avg overhead", value: "12.1%", bar: 45 }, { label: "AISE+BMT avg overhead", value: "1.8%", bar: 12 }, { label: "128b MAC storage", value: "21.55%", bar: 60 }])),
        evaluation: s("评价: BMT 是 memory integrity/freshness 的经典 SOTA 基线，至今仍适合解释为什么 metadata design 决定性能。",
          ["优势: 机制清楚，实验量化充分，直接解决 standard MT cache pollution。", "局限: 模拟年代较早；不覆盖现代 multi-tenant CVM、CXL、persistent crash consistency 全部问题。", "商业化潜力: tree-over-counter 思想可用于 CPU/TEE/storage freshness；落地要结合现代 cache/MC/firmware。"], "BMT conclusion and README evaluation.", matrix("评价", [["优势", "low-overhead freshness"], ["局限", "older simulator context"], ["商业化", "memory/storage integrity"], ["本方向角色", "main mechanism SOTA"]]))
      },
      {
        key: "amd_sev_snp",
        short: "AMD SEV-SNP",
        title: "Strengthening VM Isolation with Integrity Protection and More",
        authors: "AMD",
        venue: "AMD white paper / technical overview, 2020",
        role: "industry evidence for modern VM isolation hardening",
        primaryContribution: "说明 SEV-ES/SEV-SNP 如何降低 hypervisor 对 guest state/memory 的可见性，并引入更强 VM isolation 机制。",
        boundary: "工业白皮书，不是 peer-reviewed performance paper；本地材料更偏 SEV-ES/GHCB/NAE 机制解释。",
        evidenceBase: "AMD whitepaper Figure 1 AES key stealing; Figure 2 VMCB; Figure 3 NAE flow; README metadata.",
        titleEvidence: "AMD whitepaper PDF and README metadata.",
        summary: s("AMD SEV-SNP 方向的贡献是把 VM 机密性从 memory encryption 推向 guest state、ownership 和 hypervisor interaction hardening。",
          ["动机: 只加密内存还不够，hypervisor 可通过寄存器状态、VMEXIT/emulation、page ownership 等通道影响 guest。", "工作: SEV-ES 加密 guest register state，用 GHCB/#VC 约束 hypervisor emulation；SNP 进一步强化 memory ownership/integrity。", "数据: 白皮书无 benchmark；图示重点是 AES key stealing、VMCB 和 NAE flow。"], "AMD Figure 1-Figure 3; README review.", flow("SEV hardening", ["encrypted memory", "encrypted guest state", "#VC exception", "GHCB shared protocol", "SNP ownership/integrity", "attestation"])),
        background: s("背景问题是 hypervisor 即使看不到加密内存，仍能观察或操纵 VM exit state。",
          ["Figure 1 展示从寄存器读取 AES key 的风险。", "传统 VMEXIT 会暴露 guest register/control state 给 hypervisor。", "SEV-ES/NAE/GHCB 把 guest 自愿共享的信息收敛到协议化 buffer。"], "AMD Figure 1; Figure 2; Figure 3.", matrix("hypervisor channels", [["Memory", "encrypted by SEV"], ["Registers", "SEV-ES protects"], ["Emulation", "#VC/GHCB protocol"], ["Page ownership", "SNP/RMP direction"], ["Attestation", "platform evidence"]])),
        core: s("核心洞察: VM isolation 要保护 data、CPU state 和 memory ownership，而不只是 DRAM ciphertext。",
          ["SEV-ES 防止 hypervisor 在 VMEXIT 中读取大部分 guest state。", "GHCB 是 guest 与 hypervisor 的受控共享结构。", "SNP/RMP 方向把 host 对 guest page 的 ownership 攻击纳入防护。"], "AMD SEV-ES/SNP whitepaper mechanisms.", cards("hardening layers", ["memory encryption", "state encryption", "#VC handler", "GHCB", "RMP/SNP ownership"])),
        architecture: s("架构总览: Guest 遇到需要 hypervisor emulation 的 NAE 时，先进入 #VC handler，再通过 GHCB 显式共享最小状态。",
          ["Figure 2 是 VMCB，Figure 3 是 NAE example flow。", "Guest 决定哪些寄存器/信息写入 GHCB。", "Hypervisor 处理 emulation 后，guest 读取结果并继续执行。"], "AMD Figure 2 VMCB; Figure 3 NAE flow.", flow("NAE flow", ["guest instruction", "#VC exception", "guest writes GHCB", "VMGEXIT", "hypervisor emulates", "guest validates result"])),
        methods: [
          m("Encrypted State / SEV-ES", "SEV-ES 把 VMEXIT 时的 guest register state 从 hypervisor 视野里拿掉。", ["VMRUN/VMEXIT 不再直接暴露关键 register。", "VMSA 等状态由 AMD-SP/CPU 处理。", "这降低 Figure 1 类 register secret leakage。"], "AMD Figure 1; Figure 2; SEV-ES sections.", matrix("state protection", [["Before", "hypervisor sees exit state"], ["SEV-ES", "guest state encrypted"], ["Benefit", "register secrets hidden"], ["Cost", "guest #VC support"], ["Boundary", "still needs protocol correctness"]])),
          m("GHCB / #VC Protocol", "GHCB 让 guest 对 hypervisor 共享信息显式化。", ["Non-Automatic Exit 触发 #VC。", "Guest #VC handler 决定写哪些 field 到 GHCB。", "VMGEXIT 把请求交给 hypervisor，再由 guest 检查返回值。"], "AMD Figure 3 NAE flow.", flow("GHCB protocol", ["NAE event", "#VC handler", "populate GHCB", "VMGEXIT", "hypervisor action", "guest resumes"])),
          m("SNP / Ownership Direction", "SNP 的要点是进一步限制 hypervisor 对 guest page ownership 和完整性的攻击面。", ["RMP/ownership table 是现代 SNP 叙事核心。", "Page validation/assignment 防止 host 将错误页映射给 guest。", "本地白皮书只支撑高层方向，细节需 AMD APM/SNP spec。"], "AMD SEV-SNP README and whitepaper boundary.", cards("SNP direction", ["RMP ownership", "page validation", "integrity protection", "attestation report", "spec needed for details"])),
          m("Industrial Evidence Boundary", "白皮书适合解释产品方向，但不是系统论文评估。", ["不能从白皮书推导性能 overhead。", "不能替代 AMD 架构手册或 Linux/KVM 实现细节。", "PPT 中保留其 industry-evidence 身份。"], "AMD whitepaper scope.", matrix("use", [["Good for", "mechanism overview"], ["Need more for", "exact ABI/spec"], ["No", "benchmark"], ["Evidence", "industry whitepaper"], ["Role", "modern CVM context"]]))
        ],
        evidenceEnv: s("实验页写成 industry evidence: 无新实验，只有白皮书图示和机制说明。",
          ["证据源: AMD PDF/README；Figure 1-Figure 3。", "可支撑: SEV-ES/GHCB/NAE 的机制解释和 SNP 方向性。", "不能支撑: 性能、形式化安全、完整 SNP ABI。"], "AMD Figure 1-Figure 3; README evidence boundary.", matrix("证据边界", [["类型", "industry whitepaper"], ["实验", "无"], ["可支撑", "mechanism overview"], ["不能支撑", "peer-reviewed performance"]])),
        performance: s("性能页写成无新实验: 白皮书没有 benchmark。",
          ["潜在开销来自 #VC/GHCB emulation、page validation、RMP checks 和 attestation。", "真实开销取决于 workload、VMEXIT rate、I/O emulation 和 kernel implementation。", "本 PPT 不编造数字。"], "AMD whitepaper scope.", bars("claim strength", [{ label: "industry relevance", value: "高", bar: 90 }, { label: "mechanism clarity", value: "中", bar: 65 }, { label: "performance data", value: "无", bar: 5 }, { label: "spec completeness", value: "需另证", bar: 40 }])),
        evaluation: s("评价: AMD SEV-SNP 是理解现代 CVM 商业化的关键工业材料，但证据等级不同于论文。",
          ["优势: 贴近真实产品，解释 hypervisor 不可信后 state/emulation 如何收敛。", "局限: 白皮书粒度有限；需要配套 spec、Linux/KVM 和安全分析。", "商业化潜力: 已经是云 CVM 生态核心路线；风险在 firmware/attestation/guest driver 复杂性。"], "AMD README evaluation.", matrix("评价", [["优势", "industry deployment relevance"], ["局限", "whitepaper evidence"], ["商业化", "cloud CVM"], ["本方向角色", "industry auxiliary SOTA"]]))
      }
    ]
  },
  {
    id: "12-memory-io-fabrics",
    title: "Memory / I/O Fabrics: CXL、RDMA、远端内存",
    claim: "这个分类解释高性能 memory/fabric data path 如何把 confidential boundary 从 CPU 本地 DRAM 推到 CXL/RDMA/remote memory。",
    background: [
      "CXL 和 RDMA 不是 TEE 协议，但它们决定敏感数据如何跨 host、memory node、switch、NIC 和 accelerator 流动。",
      "DirectCXL 说明 CXL.mem direct load/store 可以显著缩短远端内存路径；CXL-Tiers 说明 VM 云环境中硬件 tiering 与隔离调度的冲突；ODRP 说明 RDMA remote paging 的瓶颈不只是网络，而是 MNode CPU 和内存利用率。",
      "本方向是 data-path/fabric substrate，不单独证明 CCA、CoVE 或 TEE-I/O 安全。"
    ],
    keyClaim: "三篇论文共同回答“远端内存怎么快”: DirectCXL 快在路径短，CXL-Tiers 快在硬件 tiering + 多租户调度，ODRP 快在把 remote paging 控制逻辑 offload 到 RDMA WR chains。",
    keyPoints: [
      "DirectCXL: USENIX ATC 2022，用 CXL.mem 让 CPU load/store 直接访问远端 DRAM，64B latency 328 cycles vs RDMA 2705 cycles。",
      "CXL-Tiers: 2024，Intel Flat Memory Mode + Memstrata，在 VM 中用 hardware-tiered memory 和 slowdown estimator 限制 outlier。",
      "ODRP: 2025，用 programmable RDMA WR chains 做 on-demand remote paging，提升 remote memory utilization 1.72x-12x。"
    ],
    evidence: "DirectCXL ATC 2022 PDF; CXL-Tiers PDF; ODRP PDF; existing story.yml evidence refs.",
    path: ["workload misses local memory", "fabric path moves data", "CXL makes memory addressable", "tiering decides placement", "RDMA WR chains offload paging", "confidential I/O still needs identity/link/lifecycle"],
    papers: [
      {
        key: "gouk2022directcxl",
        short: "DirectCXL",
        title: "Direct Access, High-Performance Memory Disaggregation with DirectCXL",
        authors: "Donghyun Gouk et al.",
        venue: "USENIX ATC 2022",
        role: "foundational CXL memory-disaggregation systems paper",
        primaryContribution: "提出 directly accessible memory disaggregation，用 CXL.mem 把远端 DRAM 暴露为 host 可直接 load/store 的地址空间。",
        boundary: "DirectCXL 是性能/系统论文，不提供 CXL IDE、SPDM/TDISP 或 confidential I/O 安全证明。",
        evidenceBase: "DirectCXL Figure 1 RDMA path; Figure 2-Figure 5 design/runtime; Figure 6 latency; Figure 8 hierarchy; Figure 10 workload.",
        titleEvidence: "README metadata; DirectCXL PDF title page.",
        summary: s("DirectCXL 的核心贡献不是“更快网络”，而是把远端内存变成 CPU 可直接 load/store 的 CXL.mem 地址空间。",
          ["动机: 传统 page/object disaggregation 经常走 RDMA、copy、runtime 和 page-fault 路径，latency 高。", "工作: 构建 CXL device、CXL switch、Linux 5.13 runtime、cxl-namespace 和 mmap 接口。", "数据: 64B RDMA latency 2705 cycles，DirectCXL 328 cycles；真实 workload 相比 RDMA-based disaggregation 约 3x 性能。"], "DirectCXL abstract; Figure 2-Figure 6; Figure 10.", flow("DirectCXL path", ["application load/store", "HDM address", "CXL root port", "CXL switch", "remote DRAM", "data returns to CPU cache"])),
        background: s("背景问题是 RDMA memory disaggregation 的成本来自软件路径和 copy，不只是链路带宽。",
          ["Page-based 方案有 page fault、swap、context switch 和 I/O amplification。", "Object-based 方案要求应用改接口，语义依赖对象系统。", "RDMA 需要 memory region、RNIC、remote runtime 或 CPU 参与。"], "DirectCXL Section 1-2; Figure 1 RDMA data movement.", matrix("传统路径成本", [["Page-based", "transparent but fault/copy heavy"], ["Object-based", "fast but app-specific"], ["RDMA", "MR/copy/runtime overhead"], ["DirectCXL", "address-mapped CXL.mem"], ["Security gap", "not identity/link protection"]])),
        core: s("核心洞察: 如果 remote memory 能变成系统地址空间，关键路径就从 message/copy path 变成 address path。",
          ["CXL device 暴露 Host-managed Device Memory。", "CXL switch 建立 virtual hierarchy 和 routing。", "Runtime 管理 namespace，不让 remote CPU 处理每次访问。"], "DirectCXL Figure 2-Figure 4.", cards("核心对象", ["HDM", "CXL flit", "CXL switch", "cxl-namespace", "/dev/directcxl"])),
        architecture: s("架构总览: CXL device 是被动内存模块，host 通过 PCIe/CXL fabric 访问它。",
          ["PCIe enumeration 后，HDM 被映射进 host system memory。", "Root port 把 CPU load/store 请求转成 CXL flit。", "CXL controller 访问远端 DRAM，runtime 用 segment table 管 namespace。"], "DirectCXL Figure 2-Figure 5.", matrix("架构组件", [["Host CPU", "load/store issuer"], ["Root Port", "CXL flit conversion"], ["CXL Switch", "virtual hierarchy"], ["CXL Device", "remote DRAM endpoint"], ["Runtime", "namespace/mmap/ioctl"]])),
        methods: [
          m("CXL.mem Address Mapping", "DirectCXL 让远端 DRAM 进入 host physical address space。", ["应用 mmap cxl-namespace 后直接 load/store。", "HDM base address 将请求导向 CXL root port。", "不需要 host DRAM 中转 copy。"], "DirectCXL Section 3.1; Figure 2.", flow("address mapping", ["PCIe enumeration", "HDM exposed", "namespace created", "mmap", "CPU load/store", "CXL flit"])),
          m("CXL Switch / Virtual Hierarchy", "多 host / 多 memory device 需要 switch 管 routing，而不是点对点线缆。",
            ["CXL switch 建 virtual hierarchy。", "Routing table 连接 host 与 logical device。", "这让 memory pooling/partitioning 成为 fabric management 问题。"], "DirectCXL Figure 3; Figure 5.", matrix("fabric management", [["Host", "compute complex"], ["Switch", "routing/virtual hierarchy"], ["Device", "HDM windows"], ["Logical device", "partitioned memory"], ["Risk", "needs trust later"]])),
          m("Linux Runtime / Namespace", "runtime 把硬件内存资源变成应用可用对象。", ["驱动暴露 /dev/directcxl。", "ioctl 创建 cxl-namespace。", "mmap 让应用按文件式接口映射远端内存。"], "DirectCXL Figure 4 runtime.", flow("runtime", ["/dev/directcxl", "ioctl namespace", "segment table", "/dev/cxl-ns0", "mmap", "application access"])),
          m("Security Boundary", "DirectCXL 的机制图很适合 data path，但不能替代 confidential I/O 证据。", ["论文不处理 device identity。", "论文不处理 CXL IDE/link confidentiality。", "论文不处理 TVM/Realm ownership lifecycle。"], "DirectCXL conclusion; survey boundary.", cards("not covered", ["SPDM", "TDISP", "CXL IDE", "attestation", "multi-tenant trust"]))
        ],
        evidenceEnv: s("实验环境是真实/原型 CXL-enabled cluster，比较 Local、RDMA、Swap/KVS 和 DirectCXL。",
          ["软件: RISC-V Linux 5.13.19、DirectCXL runtime、FastSwap/HERD ports。", "硬件/原型: CXL host/device/switch IP，自建 CXL device prototypes。", "Workloads: microbenchmarks、DLRM、MemDB、graph workloads 等。"], "DirectCXL Section 4; Figure 5; Table 1 workload characteristics.", matrix("实验设置", [["OS", "Linux 5.13.19"], ["Baseline", "RDMA / Swap / KVS / Local"], ["Metric", "64B latency, hierarchy, workload"], ["Fabric", "CXL switch/device prototype"], ["Boundary", "performance not security"]])),
        performance: s("性能结论: DirectCXL 显著缩短远端内存访问路径，但仍慢于本地 DRAM。",
          ["Figure 6: RDMA 2705 cycles vs DirectCXL 328 cycles，8.3x faster。", "Figure 8: RDMA best-case 2027 cycles，约 6.2x slower than DirectCXL；Local L2 miss 约 60 cycles。", "Figure 10/conclusion: real workloads 约 3x better than RDMA-based disaggregation。"], "DirectCXL Figure 6; Figure 8/Table 2; Figure 10.", bars("key numbers", [{ label: "RDMA 64B read", value: "2705 cycles", bar: 100 }, { label: "DirectCXL 64B load", value: "328 cycles", bar: 12 }, { label: "RDMA vs DirectCXL", value: "6.2x slower", bar: 62 }, { label: "real workload speedup", value: "~3x", bar: 45 }])),
        evaluation: s("评价: DirectCXL 强在证明 CXL.mem data path 价值，弱在完全不覆盖 confidential trust。",
          ["优势: 系统原型完整，数字直观，能解释 CXL 为什么改变 memory boundary。", "局限: 无 attestation、link encryption、device lifecycle、multi-tenant ownership。", "商业化潜力: CXL memory pooling/expansion；机密计算落地必须叠加 SPDM/TDISP/IDE/TEE policy。"], "DirectCXL conclusion; README boundary.", matrix("评价", [["优势", "clear data-path speedup"], ["局限", "not confidential I/O"], ["商业化", "CXL pooling"], ["本方向角色", "fabric performance baseline"]]))
      },
      {
        key: "zhong2024cxltiers",
        short: "CXL-Tiers",
        title: "Managing Memory Tiers with CXL in Virtualized Environments",
        authors: "Huiyang Zhong et al.",
        venue: "2024 systems paper",
        role: "SOTA CXL memory-tier management for VMs",
        primaryContribution: "将 Intel Flat Memory Mode 与 Memstrata slowdown estimator 结合，在 VM 环境中管理 local DRAM 与 CXL tier 的性能隔离。",
        boundary: "CXL-Tiers 是 memory-tier performance/isolation 论文，不提供 confidential I/O 或 TEE security proof。",
        evidenceBase: "CXL-Tiers Figure 1-Figure 2 VM locality; Figure 3-Figure 4 Flat Memory Mode; Figure 8-Figure 12 Memstrata; Figure 10/12 results.",
        titleEvidence: "README metadata; CXL-Tiers PDF title page.",
        summary: s("CXL-Tiers 的关键不是“给 VM 加慢内存”，而是让硬件做 cache-line tiering，让软件只处理多租户 outlier。",
          ["动机: CXL memory capacity 便宜但 latency 高；VM 环境中 software tiering 追踪 hotness 成本高且不透明。", "工作: 使用 Intel Flat Memory Mode/Mixed Mode，并设计 Memstrata 预测 VM slowdown、迁移 dedicated local pages。", "数据: mixed mode 下 82% workloads slowdown <=5%；Memstrata 将 realistic multi-VM worst-case slowdown 从 35% 降到 <6%。"], "CXL-Tiers abstract; Figure 5; Figure 10-Figure 12.", flow("CXL-Tiers loop", ["VM accesses memory", "memory controller line swap", "collect perf events", "predict slowdown", "migrate local pages", "outlier improves"])),
        background: s("背景问题是 VM 软件 tiering 很难又快又准。",
          ["Host 看不到 guest 真实 hotness 或追踪成本高。", "2MB/1GB huge page 让冷热 cache line 混在一起。", "多租户竞争 local DRAM 会制造 outlier 和尾部 slowdown。"], "CXL-Tiers Section 1-2; Figure 1-Figure 2.", matrix("VM tiering pain", [["Telemetry", "host overhead/privacy"], ["Granularity", "page too coarse"], ["Huge pages", "hot/cold mixed"], ["Noisy neighbor", "local DRAM conflict"], ["Goal", "<=5% slowdown for most"]])),
        core: s("核心洞察: 硬件做细粒度 hotness，软件做多租户公平。",
          ["Flat Memory Mode 在 memory controller 里做 cache-line swap。", "Mixed Mode 保留 dedicated local memory 给 outlier。", "Memstrata 用 performance events 和 ML estimator 找到需要 local pages 的 VM。"], "CXL-Tiers Figure 3-Figure 4; Figure 8-Figure 9.", cards("split responsibility", ["HW: cache-line tiering", "SW: outlier detection", "SW: page migration", "VM unchanged", "cloud policy above"])),
        architecture: s("架构总览: VM 看到一个内存池，硬件在 local/CXL 间搬 cache line，Memstrata 在 VM 间分 dedicated local pages。",
          ["硬件 tiered NUMA node 聚合 local DRAM 与 CXL memory。", "Mixed mode 暴露 dedicated local NUMA node。", "Memstrata 控制页迁移，不改 guest。"], "CXL-Tiers Figure 3-Figure 4; Figure 8.", matrix("组件", [["HW-tiered node", "local + CXL capacity"], ["Dedicated local", "reserved fast pages"], ["Memstrata", "allocator/controller"], ["Estimator", "predict >5% slowdown"], ["VM", "unmodified guest"]])),
        methods: [
          m("Flat / Mixed Memory Mode", "Flat Memory Mode 把 local DRAM 当 CXL tier 的硬件 cache，Mixed Mode 留出 dedicated local DRAM。", ["Cache-line granularity 避免 page-level hotness 错配。", "Mixed Mode 支持为 latency-sensitive VM 分配稳定 fast pages。", "Guest 无需修改。"], "CXL-Tiers Figure 3-Figure 4.", flow("tiering", ["local DRAM", "CXL memory", "cache-line swap", "dedicated local pages", "VM uniform address space"])),
          m("Slowdown Estimator", "Memstrata 不追踪每页 hotness，而是预测 VM 是否已经成为 outlier。", ["输入包括 per-VM performance events。", "目标阈值是 slowdown >5%。", "估计器避免高成本 PTE scanning/instruction sampling。"], "CXL-Tiers Figure 8-Figure 9; Listing 1.", matrix("estimator", [["Input", "perf counters"], ["Output", "slowdown class"], ["Threshold", ">5%"], ["Policy", "rank outliers"], ["Benefit", "low host overhead"]])),
          m("Dynamic Page Allocator", "Allocator 把 dedicated local pages 从低风险 VM 转给 outlier VM。",
            ["只给 predicted outlier 更高 rank。", "可在多个 workload combinations 中降低 worst-case slowdown。", "风险是预测错误和迁移策略本身开销。"], "CXL-Tiers Listing 1; Figure 10-Figure 12.", flow("allocator", ["collect counters", "predict slowdown", "rank VMs", "select donor", "migrate pages", "re-evaluate"])),
          m("Confidential Boundary Lesson", "CXL-Tiers 对机密计算的启发是资源管理也会成为 side/control boundary。", ["性能 telemetry 可能泄露 workload 行为。", "Host page migration policy 会影响 CVM tail latency。", "论文不提供机密性证明，只提供 tiering 机制证据。"], "CXL-Tiers scope; survey boundary.", cards("TEE lesson", ["telemetry boundary", "placement policy", "tail latency", "tenant isolation", "needs TEE evidence"]))
        ],
        evidenceEnv: s("实验环境覆盖真实 CXL memory、QEMU/KVM 修改和大量 VM workloads。",
          ["系统: Linux kernel/QEMU/KVM 修改，CXL cards + Intel memory controller。", "Workloads: 115 workloads，web/data/Spark/ML/GAP/SPEC 等组合。", "指标: slowdown、outlier、CPU overhead、memory overhead。"], "CXL-Tiers implementation/evaluation sections.", matrix("实验设置", [["Workloads", "115"], ["Environment", "virtualized CXL tiers"], ["Metric", "slowdown/outlier"], ["Controller", "Memstrata"], ["Overhead", "CPU <=4% core, memory 110MB"]])),
        performance: s("性能结论: 大多数 workload 可接受，但 outlier 需要 software isolation policy。",
          ["Mixed mode: 82% workloads slowdown <=5%，95% <=10%，outlier up to 34%。", "Memstrata: realistic multi-VM worst-case slowdown 35% -> <6%。", "Memstrata overhead: max CPU overhead 4% of a single core，memory overhead 约 110MB。"], "CXL-Tiers abstract; Figure 5; Figure 10-Figure 12.", bars("key numbers", [{ label: "workloads <=5% slowdown", value: "82%", bar: 82 }, { label: "workloads <=10% slowdown", value: "95%", bar: 95 }, { label: "worst-case before", value: "35%", bar: 70 }, { label: "after Memstrata", value: "<6%", bar: 20 }])),
        evaluation: s("评价: CXL-Tiers 是 CXL VM resource-management SOTA，但不是 security mechanism。",
          ["优势: 分工清楚，数据充分，能解释 CXL tiering 在云 VM 中的实际尾部风险。", "局限: 不处理 confidential memory ownership、device identity、link security。", "商业化潜力: 云 CXL capacity tier 管理；机密计算场景需控制 telemetry 和 host policy 信任。"], "CXL-Tiers conclusion; README boundary.", matrix("评价", [["优势", "VM tiering policy"], ["局限", "not TEE security"], ["商业化", "cloud CXL memory"], ["本方向角色", "tiering SOTA"]]))
      },
      {
        key: "wang2025odrp",
        short: "ODRP",
        title: "ODRP: On-Demand Remote Paging with Programmable RDMA",
        authors: "Wang et al.",
        venue: "2025 systems paper",
        role: "SOTA programmable RDMA remote paging system",
        primaryContribution: "用 RDMA WR chains 在 RNIC 上实现 on-demand remote paging，避免 MNode CPU 参与并提升 remote memory utilization。",
        boundary: "ODRP 是 disaggregated memory performance paper，不提供 confidential link/device/TEE proof。",
        evidenceBase: "ODRP Figure 1 alternatives; Figure 6 WR chain design; Figure 7 utilization/CPU/performance; Figure 8/9 scaling and swap throughput.",
        titleEvidence: "README metadata; ODRP PDF title page.",
        summary: s("ODRP 的贡献是把 remote paging 的动态分配逻辑从 MNode CPU 搬到 programmable RDMA WR chains。",
          ["动机: One-sided static utilization 低，two-sided dynamic 需要 MNode CPU，remote paging 在数据中心难同时兼顾性能和利用率。", "工作: 用 RDMA WAIT/ENABLE/CAS/FAA 等 work request chain 做 4KB-granularity on-demand allocation。", "数据: 相比 Fastswap/alternatives，remote memory utilization 提升 1.72x-12x，MNode CPU usage 为 0，性能 overhead 约 0.8%-14.6%。"], "ODRP abstract; Figure 6; Figure 7; Figure 9.", flow("ODRP path", ["CNode page fault", "RDMA WR chain", "lookup translation table", "allocate remote page", "update mapping", "swap data"])),
        background: s("背景问题是 remote memory disaggregation 有三难: utilization、MNode CPU、performance。",
          ["Static pre-registration 无 CPU 但内存碎片/利用率差。", "Dynamic/two-sided 方法利用率高但消耗 MNode CPU。", "4KB-granularity paging 需要频繁 allocation/free，MNode 成为瓶颈。"], "ODRP Section 1-2; Figure 1.", matrix("三难", [["Utilization", "static wastes memory"], ["MNode CPU", "dynamic consumes CPU"], ["Performance", "extra RTT/control path"], ["Granularity", "4KB pages"], ["ODRP", "RNIC offload"]])),
        core: s("核心洞察: RDMA work requests 可以组合成小型控制程序，把 remote paging 控制路径 offload。",
          ["WR chain 利用 WAIT、ENABLE、CAS、FAA 等 primitive。", "MNode 存 data structures，但 CPU 不处理每个请求。", "CNode 只维护轻量 metadata，remote allocation 在 RNIC 侧完成。"], "ODRP WR chain design; Figure 6.", cards("RDMA primitives", ["WAIT", "ENABLE", "CAS", "FAA", "READ/WRITE"])),
        architecture: s("架构总览: CNode 发起 fault/swap，RNIC 执行 WR chain，MNode 内存保存 translation table 和 free page queue。",
          ["Translation table 记录 virtual remote page 到 allocated page。", "Free queue 支持 on-demand allocation。", "RNIC atomic operations 保证并发更新的一致性。"], "ODRP Section 4; Figure 6.", matrix("组件", [["CNode", "faulting compute node"], ["RNIC", "programmable WR execution"], ["MNode memory", "remote page pool"], ["TT", "translation table"], ["Free queue", "allocation source"]])),
        methods: [
          m("WR Chain as Remote Control Path", "ODRP 用 WR chain 实现查表、分配、更新，而不是唤醒 remote CPU。", ["WAIT/ENABLE 组织依赖。", "CAS/FAA 完成并发安全更新。", "链式操作把 allocation 放到 RNIC 数据路径附近。"], "ODRP Figure 6.", flow("WR chain", ["READ TT", "if unmapped", "CAS/FAA free queue", "WRITE TT", "READ/WRITE page", "complete"])),
          m("On-Demand 4KB Allocation", "按需 4KB 分配让 remote memory utilization 接近实际使用量。", ["Static 预留会浪费空页。", "ODRP 不需要每个 CNode 预注册大 remote memory。", "细粒度分配也带来 metadata 和 atomic operation 成本。"], "ODRP Figure 7 utilization results.", matrix("allocation", [["Static", "low utilization"], ["Two-sided", "CPU heavy"], ["ODRP", "on-demand 4KB"], ["Benefit", "high utilization"], ["Cost", "WR chain overhead"]])),
          m("Consistency and Concurrency", "remote paging 需要保证多个 CNode 并发 allocation 不把同一页分出去。", ["论文用 RDMA atomic 和 induction argument 分析一致性。", "TT/free-queue 更新需要顺序约束。", "错误会导致 alias、data corruption 或 page leak。"], "ODRP correctness discussion; Figure 6.", cards("invariants", ["one page one owner", "TT update atomic", "free queue consistency", "no MNode CPU", "fault handles unmapped"])),
          m("Security Boundary", "ODRP 只解决性能/利用率，不解决 remote memory trust。", ["不证明 MNode 不会读写数据。", "不提供 link encryption 或 attestation。", "Confidential storage/memory 需要 Hazel/SPDM/TEE-I/O 类机制叠加。"], "ODRP threat/scope; survey boundary.", cards("not covered", ["MNode confidentiality", "RDMA link security", "device attestation", "freshness", "tenant policy"]))
        ],
        evidenceEnv: s("实验环境比较 one-sided static/dynamic、two-sided、Fastswap 等 baselines。",
          ["评估指标: remote memory utilization、MNode CPU usage、execution time/throughput、swap throughput、CNode scaling。", "工作负载: Redis/VoltDB 等 memory-disaggregation workloads。", "证据边界: 支撑 remote paging performance，不支撑 confidential trust。"], "ODRP Section 5; Figure 7-Figure 9.", matrix("实验设置", [["Baselines", "static/dynamic/two-sided/Fastswap"], ["Metrics", "utilization/CPU/performance"], ["Granularity", "4KB pages"], ["Offload", "RDMA WR chains"], ["Boundary", "performance only"]])),
        performance: s("性能结论: ODRP 用少量性能开销换取远端内存利用率和 MNode CPU 的大幅改善。",
          ["Abstract/Figure 7: remote memory utilization 提升 1.72x-12x。", "MNode CPU usage 为 0，避免 two-sided 方法 86%-99% CPU usage。", "性能 overhead 约 0.8%-14.6%，部分 throughput 场景 overhead 约 14.2%。"], "ODRP abstract; Figure 7; Figure 9.", bars("key numbers", [{ label: "utilization gain", value: "1.72x-12x", bar: 90 }, { label: "MNode CPU", value: "0", bar: 5 }, { label: "overhead low end", value: "0.8%", bar: 10 }, { label: "overhead high end", value: "14.6%", bar: 45 }])),
        evaluation: s("评价: ODRP 是 RDMA disaggregated memory 的强系统 SOTA，但它把安全问题留给上层。",
          ["优势: 利用 programmable RDMA，三难取舍清楚，实验指标直接。", "局限: 不处理 confidentiality/integrity/freshness，也不证明 remote endpoint trust。", "商业化潜力: 远端内存池和 cloud paging；机密计算必须结合加密、attestation 和 policy。"], "ODRP conclusion; README boundary.", matrix("评价", [["优势", "high utilization without MNode CPU"], ["局限", "not secure memory"], ["商业化", "remote paging"], ["本方向角色", "RDMA paging SOTA"]]))
      }
    ]
  },
  {
    id: "13-confidential-io-protocol-device-endpoint",
    title: "Confidential I/O Protocol / Device Endpoint",
    claim: "这个分类解释机密计算里的 endpoint trust: 设备是谁、状态是什么、安全通道是否真正终止在被证明的端点。",
    background: [
      "IOMMU 管地址，IOPMP 管访问，SPDM/TDISP/TLS+RA 管身份、measurement 和 channel binding。",
      "SPDM 是设备身份/measurement/session 的标准底座；CoVE-IO 把 SPDM/TDISP/IDE 放进 TVM trusted device lifecycle；TLS+RA 解决网络通道和 remote attestation 分离导致的 relay risk。",
      "本方向强调 protocol evidence: SPDM/CoVE-IO 是规范，TLS+RA 是 peer-reviewed 系统论文。"
    ],
    keyClaim: "三篇论文/规范的角色不同: SPDM 证明 device identity，CoVE-IO 绑定 device lifecycle，TLS+RA 证明应用 TLS channel 与 attested endpoint 是同一个。",
    keyPoints: [
      "DMTF SPDM 1.4.0: 定义 GET_VERSION/CAPABILITIES/CERTIFICATE/CHALLENGE/MEASUREMENTS/KEY_EXCHANGE 等消息。",
      "RISC-V CoVE-IO: 把 SPDM/TDISP/IDE/IOMMU/TSM 组合成 TVM trusted I/O lifecycle。",
      "TLS+RA: USENIX ATC 2025，把 TLS 1.3 channel 与 TEE attestation evidence 绑定，防 relay。"
    ],
    evidence: "DMTF DSP0274 v1.4.0 PDF; CoVE-IO draft PDF; TLS+RA USENIX ATC 2025 PDF.",
    path: ["endpoint claims identity", "certificate chain proves manufacturer/root", "measurements prove device/software state", "key exchange creates secure session", "lifecycle binds device to TVM", "TLS+RA binds channel to attested workload"],
    papers: [
      {
        key: "dmtf_spdm_2025",
        short: "SPDM",
        title: "Security Protocol and Data Model (SPDM) Specification",
        authors: "DMTF SPDM Working Group",
        venue: "DMTF DSP0274 v1.4.0, 2025",
        role: "device identity and measurement standard",
        primaryContribution: "定义组件间能力协商、证书检索、challenge-response、measurement retrieval、key exchange 和 secured messages。",
        boundary: "SPDM 不单独定义 device assignment lifecycle、DMA isolation、interrupt routing 或 PCIe link IDE；它是设备证据协议底座。",
        evidenceBase: "SPDM sections 7-11; Figure 1 certificate chain models; Figure 2 protocol flow; Table 3 generic message; request/response tables.",
        titleEvidence: "README metadata; DMTF DSP0274 PDF.",
        summary: s("SPDM 的贡献是让平台能问设备: 你是谁、固件/配置是什么、能否建立安全会话。",
          ["动机: confidential I/O 不能只相信 PCIe requester ID，必须有设备证书和 measurement。", "工作: 定义 requester/responder、certificate chain、CHALLENGE、GET_MEASUREMENTS、KEY_EXCHANGE、secure session。", "数据: 标准规范无实验；证据来自消息格式、状态和协议流。"], "SPDM Section 7-11; Figure 1; Figure 2.", flow("SPDM flow", ["GET_VERSION", "CAPABILITIES/ALGORITHMS", "DIGESTS/CERTIFICATE", "CHALLENGE", "GET_MEASUREMENTS", "KEY_EXCHANGE", "secured messages"])),
        background: s("背景问题是设备也需要 remote attestation: TVM/Realm 要知道 accelerator/NIC/storage endpoint 的真实状态。",
          ["证书链证明设备身份或供应链 root。", "Measurement 证明固件/配置/安全状态。", "Secure session 保护后续协议消息，但数据面还可能需要 IDE/其他链路保护。"], "SPDM overview and definitions.", matrix("SPDM answers", [["Identity", "certificate chain"], ["Liveness", "challenge response"], ["State", "measurements"], ["Session", "key exchange"], ["Not covered", "DMA/lifecycle/link data plane"]])),
        core: s("核心洞察: SPDM 是 evidence protocol，不是 complete trusted I/O system。",
          ["它把 low-level security capabilities 暴露给上层机制。", "TDISP、PCIe IDE、CXL、CoVE-IO 可以使用 SPDM evidence。", "Verifier/TSM 必须决定 measurement 是否满足 policy。"], "SPDM introduction; CoVE-IO relation.", cards("SPDM building blocks", ["Requester", "Responder", "certificate slots", "measurement blocks", "session keys"])),
        architecture: s("架构总览: Requester 与 Responder 通过 request-response 消息建立身份、measurement 和 session。",
          ["Requester 可以是 host/TSM/root port。", "Responder 可以是 device/endpoint。", "连接可有多个 secure sessions，消息格式由 SPDM version/request/response code 约束。"], "SPDM Section 8 connection model; Table 3 generic message.", matrix("协议对象", [["Requester", "initiates request"], ["Responder", "device endpoint"], ["Certificate", "identity chain"], ["Measurement", "state evidence"], ["Session", "confidential/integrity-protected messages"]])),
        methods: [
          m("Certificate / Challenge", "GET_CERTIFICATE 和 CHALLENGE 证明 endpoint 身份和私钥持有。", ["DIGESTS/CERTIFICATE 获取证书摘要和链。", "CHALLENGE_AUTH 对 nonce/transcript 签名。", "这证明设备不是一个随意伪造的 requester ID。"], "SPDM Section 10.9-10.10; Figure 1.", flow("identity proof", ["DIGESTS", "GET_CERTIFICATE", "verify chain", "CHALLENGE nonce", "CHALLENGE_AUTH", "policy accepts identity"])),
          m("Measurements", "GET_MEASUREMENTS 把设备固件/配置状态交给 requester 判断。", ["Measurement blocks 可被签名或绑定到 transcript。", "Policy 决定哪些 measurement 可接受。", "SPDM 不规定每个设备 measurement 的业务语义。"], "SPDM Section 10.12.", matrix("measurement", [["Request", "GET_MEASUREMENTS"], ["Evidence", "measurement blocks"], ["Signature", "optional/required by policy"], ["Verifier", "policy check"], ["Gap", "semantic interpretation"]])),
          m("Secure Sessions", "KEY_EXCHANGE/FINISH 建立 SPDM secured messages。", ["会话密钥保护后续 SPDM payload。", "Transcript hash 防止握手被篡改。", "数据面大流量仍通常依赖 IDE/TLS/IPsec/设备协议。"], "SPDM Section 7.4; Section 10.17; Section 11.", flow("session", ["KEY_EXCHANGE", "KEY_EXCHANGE_RSP", "FINISH", "session keys", "secured messages"])),
          m("Use in TEE-I/O", "SPDM 证据需要被 CoVE-IO/TDISP/TSM 绑定到 device assignment。", ["设备身份本身不等于已安全分配给 TVM。", "TDISP 管 device interface state。", "IOMMU/IOPMP 管 DMA，IDE 管链路。"], "SPDM scope; CoVE-IO relation.", cards("upper-layer needs", ["TDISP state", "IOMMU policy", "IDE link", "TSM binding", "TVM token"]))
        ],
        evidenceEnv: s("SPDM 是标准规范，无实验；实验页写成协议覆盖和边界。",
          ["证据源: DMTF DSP0274 v1.4.0 本地 PDF。", "可支撑: message exchanges, certificates, measurements, sessions。", "不能支撑: device assignment correctness or performance overhead。"], "SPDM DSP0274 sections 7-11.", matrix("证据边界", [["类型", "standard spec"], ["实验", "无"], ["可支撑", "identity/measurement/session"], ["不能支撑", "complete trusted I/O"]])),
        performance: s("性能页写成无新实验: SPDM 定义协议，不给 workload benchmark。",
          ["开销来源是 certificate transfer、signature verification、measurement retrieval、key exchange。", "这些通常在 setup/control path，而不是每个 data packet。", "数据面性能需看 IDE/TLS/device stack。"], "SPDM scope.", bars("claim strength", [{ label: "标准权威", value: "高", bar: 95 }, { label: "endpoint identity", value: "强", bar: 90 }, { label: "performance data", value: "无", bar: 5 }, { label: "lifecycle coverage", value: "需 TDISP", bar: 40 }])),
        evaluation: s("评价: SPDM 是 device attestation 的必备底座，但不能单独讲成 confidential I/O。",
          ["优势: 标准化、可互操作，覆盖 identity/measurement/session。", "局限: 不管理 DMA、interrupt、assignment lifecycle、data-plane link。", "商业化潜力: PCIe/CXL/DPU/accelerator trust root 的共同语言。"], "SPDM README evaluation.", matrix("评价", [["优势", "standard endpoint evidence"], ["局限", "not full lifecycle"], ["商业化", "device ecosystem"], ["本方向角色", "protocol foundation"]]))
      },
      {
        key: "riscv_cove_io_2026",
        short: "CoVE-IO",
        title: "RISC-V CoVE-IO Specification",
        authors: "RISC-V Non-ISA AP-TEE-IO contributors",
        venue: "RISC-V AP-TEE-IO / CoVE-IO draft specification, 2026",
        role: "trusted device assignment lifecycle draft",
        primaryContribution: "把 SPDM/TDISP/IDE/IOMMU/TSM 组合到 RISC-V TVM trusted I/O lifecycle 中。",
        boundary: "draft/not ratified；无实验；具体协议细节仍要回到 SPDM/TDISP/PCIe IDE 原始规范。",
        evidenceBase: "CoVE-IO Figure 1 bounce buffering; Figure 2 topology; Figure 3 architecture; requirements tables.",
        titleEvidence: "README metadata; CoVE-IO draft PDF.",
        summary: s("CoVE-IO 的贡献是说明 SPDM 证据如何进入 TVM-device assignment，而不是停在设备自证。",
          ["动机: 设备即使能自证，也必须被安全地分配、撤销、清理和限制 DMA/interrupt。", "工作: 规范 TVM trusted I/O 的 topology、requirements、bounce buffer baseline 和 high-level architecture。", "数据: draft spec 无实验。"], "CoVE-IO Figure 1-Figure 3; Tables 1-3.", flow("assignment evidence", ["SPDM evidence", "TDISP state", "TSM policy", "IOMMU mapping", "IDE link", "TVM uses device"])),
        background: s("背景问题是 endpoint identity 只是第一步，TVM 还要知道设备 interface 是否真的归自己。",
          ["Host 可以枚举设备，但不能单独决定可信 assignment。", "设备重置、热插拔、error recovery 都可能破坏 trust state。", "CoVE-IO 把 lifecycle 明确化。"], "CoVE-IO requirement sections.", matrix("lifecycle questions", [["Discover", "which device"], ["Authenticate", "SPDM evidence"], ["Assign", "TDISP state"], ["Protect", "IOMMU/IDE"], ["Cleanup", "unassign/reset"]])),
        core: s("核心洞察: trusted device assignment 是 evidence、address policy、link protection 和 cleanup 的交集。",
          ["SPDM 证明身份和 state。", "TDISP 证明 interface assignment state。", "IOMMU/IOPMP 限制 DMA。", "IDE 保护 PCIe link，TSM 绑定到 TVM。"], "CoVE-IO high-level architecture.", cards("intersection", ["evidence", "assignment state", "DMA policy", "link protection", "cleanup"])),
        architecture: s("架构总览: CoVE-IO 将 TVM、TSM、host、IOMMU、root port 和 device 组织成一个 trusted I/O workflow。",
          ["Figure 1 显示 bounce buffer baseline。", "Figure 2/3 展示 topology 和 high-level architecture。", "TVM direct I/O 只有在 evidence 和 lifecycle 都满足时才成立。"], "CoVE-IO Figure 1-Figure 3.", matrix("workflow objects", [["TVM", "consumer"], ["TSM", "policy/evidence binder"], ["Host", "resource manager"], ["Device", "SPDM/TDISP responder"], ["Fabric", "IOMMU/IDE/root port"]])),
        methods: [
          m("Evidence-to-Assignment Binding", "CoVE-IO 把 SPDM evidence 绑定到具体 device interface，而不是只验证设备型号。", ["证书和 measurement 进入 policy。", "TDISP state 证明 interface 被安全锁定。", "TSM 记录 TVM-device relationship。"], "CoVE-IO architecture and requirements.", flow("binding", ["SPDM cert", "measurement", "TDISP lock", "TSM verifies", "assign interface", "TVM token/policy"])),
          m("Bounce vs Direct I/O", "CoVE-IO 用 bounce buffer 做安全 baseline，用 direct assignment 做性能目标。", ["Bounce buffer 简单但 copy 重。", "Direct I/O 性能更好但要求完整 lifecycle。", "PPT 不能把 direct I/O 写成默认已经安全。"], "CoVE-IO Figure 1.", matrix("I/O modes", [["Bounce", "safe baseline"], ["Direct", "performance target"], ["Risk", "device trust"], ["Need", "SPDM/TDISP/IDE"], ["Policy", "TSM-controlled"]])),
          m("DMA / Interrupt Control", "设备可信还不够，访问路径必须由 IOMMU/IOPMP/AIA 类机制限制。", ["DMA 只允许 TVM 授权页。", "MMIO/queue 需要 ownership。", "Interrupt/MSI routing 不能被 host 任意伪造。"], "CoVE-IO relation to IOMMU/AIA/IOPMP.", cards("control points", ["DMA mappings", "MMIO registers", "queue descriptors", "MSI/interrupt", "fault cleanup"]))
        ],
        evidenceEnv: s("CoVE-IO 是 draft specification，无新实验；本页只承载 lifecycle blueprint。",
          ["证据源: 本地 CoVE-IO draft PDF。", "可支撑: requirements, topology, architecture, bounce/direct model。", "不能支撑: final standard status or overhead。"], "CoVE-IO PDF.", matrix("证据边界", [["类型", "draft spec"], ["实验", "无"], ["可支撑", "lifecycle architecture"], ["不能支撑", "final ABI/performance"]])),
        performance: s("性能页写成无新实验: draft 只解释模式，不测模式。",
          ["Bounce buffer 性能风险是 copy/encrypt。", "Direct assignment 性能潜力高但 setup/control path 更复杂。", "具体 overhead 需要未来实现。"], "CoVE-IO scope.", bars("tradeoff", [{ label: "bounce safety", value: "高", bar: 80 }, { label: "bounce speed", value: "低", bar: 25 }, { label: "direct speed", value: "高潜力", bar: 80 }, { label: "evidence maturity", value: "draft", bar: 45 }])),
        evaluation: s("评价: CoVE-IO 是 RISC-V endpoint trust 的集成蓝图，但它依赖多个外部标准成熟。",
          ["优势: 把协议和 TSM lifecycle 连接起来。", "局限: draft/no experiment；SPDM/TDISP/IDE/IOMMU 互操作复杂。", "商业化潜力: TVM device passthrough 和 accelerator/storage/NIC 直通。"], "CoVE-IO README evaluation.", matrix("评价", [["优势", "integration blueprint"], ["局限", "draft complexity"], ["商业化", "trusted passthrough"], ["本方向角色", "lifecycle SOTA"]]))
      },
      {
        key: "weinhold2025tlsra",
        short: "TLS+RA",
        title: "Separate but Together: Integrating Remote Attestation into TLS",
        authors: "Carsten Weinhold, Muhammad Usama Sardar, Ionut Mihalcea, Yogesh Deshpande, Hannes Tschofenig, Yaron Sheffer, Thomas Fossati, Michael Roitzsch",
        venue: "USENIX ATC 2025",
        role: "peer-reviewed SOTA channel-binding mechanism for attested endpoints",
        primaryContribution: "把 remote attestation evidence 与 TLS 1.3 handshake/channel 绑定，防止 attestation relay 和通道终止点错配。",
        boundary: "TLS+RA 不替代底层 TEE quote semantics，也不证明应用代码无漏洞；它解决 channel binding 与 endpoint identity 组合问题。",
        evidenceBase: "TLS+RA README; paper Figure 1 relay risk; Figure 2 TLS+RA flow; evaluation/implementation sections.",
        titleEvidence: "README metadata; USENIX ATC 2025 PDF title page.",
        summary: s("TLS+RA 的贡献是证明“这个 TLS 连接”真的终止在“这个 attested TEE/workload”里。",
          ["动机: 普通 TLS 证明域名/证书，remote attestation 证明 TEE 状态；两者并排执行会被 relay。", "工作: 在 TLS 1.3 handshake 中携带/绑定 attestation request、nonce、evidence 和 transcript。", "数据: peer-reviewed 系统论文，基于 OpenSSL 实现并评估握手开销。"], "TLS+RA Figure 1-Figure 2; implementation/evaluation sections.", flow("TLS+RA", ["ClientHello + RA request", "TEE generates evidence", "TLS transcript binding", "certificate verification", "attestation verification", "secure channel established"])),
        background: s("背景问题是机密 workload 经常要远程注入 secret，但远端需要知道 TLS endpoint 和 TEE endpoint 是同一个。",
          ["只看 TLS: 不知道服务器是否在 TEE 中运行。", "只看 RA: 不知道后续 TLS channel 是否被 relay 到 TEE 外。", "TLS+RA 解决二者的密码学绑定。"], "TLS+RA README and threat model.", matrix("分离风险", [["TLS only", "identity but no TEE state"], ["RA only", "state but no channel binding"], ["Parallel", "relay possible"], ["TLS+RA", "bound transcript"], ["Verifier", "checks both"]])),
        core: s("核心洞察: Attestation evidence 必须绑定到 TLS transcript，而不是作为握手之外的附件。",
          ["Nonce/challenge 防重放。", "Transcript binding 防止中间人把 evidence 挪到另一条 TLS channel。", "TLS PKI 与 TEE attestation infrastructure 保持 separate but together。"], "TLS+RA design sections.", cards("security logic", ["fresh nonce", "transcript binding", "TEE evidence", "TLS identity", "independent failure domains"])),
        architecture: s("架构总览: client 同时执行 TLS certificate validation 和 attestation verification，然后才相信 channel。",
          ["Server 侧 TEE 内 TLS+RA library 生成 evidence。", "Client 验证证书链和 TEE quote/report。", "只有二者都和 transcript 一致，secret 才应释放。"], "TLS+RA Figure 2.", matrix("验证对象", [["TLS cert", "domain/service identity"], ["RA evidence", "TEE/software state"], ["Nonce", "freshness"], ["Transcript", "channel binding"], ["Policy", "secret release decision"]])),
        methods: [
          m("Relay Attack Defense", "TLS+RA 首先解决普通并排 TLS+RA 容易被 relay 的问题。", ["攻击者可让真实 TEE 生成 evidence，却让 TLS channel 终止在非 TEE 进程。", "Binding evidence to handshake transcript 阻止证据跨 channel 搬运。", "这对 secret provisioning 特别关键。"], "TLS+RA Figure 1 relay attack.", flow("relay blocked", ["attacker opens TLS", "requests TEE quote", "tries relay evidence", "transcript mismatch", "client rejects"])),
          m("TLS 1.3 Integration", "设计目标是兼容 TLS 生态，而不是重写安全通道协议。", ["使用 TLS extension 风格传递 attestation negotiation/evidence。", "证书 PKI 与 attestation verifier 独立。", "失败处理要区分 TLS failure 和 attestation failure。"], "TLS+RA design/implementation sections.", cards("integration", ["TLS extension", "OpenSSL", "TLS certificate path", "attestation verifier", "policy decision"])),
          m("Evidence Policy", "TLS+RA 不判断所有 TEE 语义，它把 evidence 交给 policy/verifier。", ["TEE vendor quote 格式仍由底层决定。", "应用 policy 决定接受哪些 measurement。", "这让机制可跨 Intel/AMD/Arm/RISC-V endpoint。"], "TLS+RA design; README evaluation.", matrix("policy split", [["Mechanism", "bind evidence to channel"], ["Verifier", "parse quote/report"], ["Policy", "measurement allowlist"], ["TLS", "transport identity"], ["Application", "secret release"]]))
        ],
        evidenceEnv: s("实验环境与数据: peer-reviewed 系统实现，README 已记录 OpenSSL/TLS 1.3 集成。",
          ["证据源: USENIX ATC 2025 PDF 和本地 README。", "实现: OpenSSL-based TLS+RA prototype。", "边界: 支撑 channel binding，不支撑底层 TEE 安全或 device lifecycle。"], "TLS+RA implementation/evaluation sections; README.", matrix("实验覆盖", [["Type", "system paper"], ["Implementation", "OpenSSL/TLS 1.3"], ["Metric", "handshake overhead"], ["Security", "relay defense"], ["Boundary", "not TEE quote semantics"]])),
        performance: s("性能结论: TLS+RA 的开销主要在握手/control path，不是长期数据面。",
          ["额外成本来自 evidence generation、verification 和 handshake payload。", "数据面仍走普通 TLS session keys。", "具体数值以论文 evaluation 为准，PPT 不把它扩展成所有网络 I/O 性能。"], "TLS+RA evaluation sections.", bars("overhead sources", [{ label: "handshake payload", value: "medium", bar: 45 }, { label: "quote generation", value: "TEE-dependent", bar: 60 }, { label: "quote verification", value: "policy-dependent", bar: 55 }, { label: "data-path overhead", value: "low", bar: 15 }])),
        evaluation: s("评价: TLS+RA 是 endpoint/channel binding 的强 SOTA，特别适合 confidential service secret provisioning。",
          ["优势: 问题切得准，避免 TLS 与 RA 并排使用的 relay 漏洞。", "局限: 仍依赖底层 attestation correctness 和 application policy。", "商业化潜力: API service、KBS、CVM secret injection、DPU/NIC control channel。"], "TLS+RA README evaluation.", matrix("评价", [["优势", "channel-bound attestation"], ["局限", "depends on quote policy"], ["商业化", "KBS/service endpoint"], ["本方向角色", "peer-reviewed SOTA"]]))
      }
    ]
  },
  {
    id: "14-accelerator-dpu-smartnic-offload",
    title: "Accelerator / DPU / SmartNIC Offload TEE",
    claim: "这个分类解释 confidential workload 把数据交给 GPU、FPGA、NPU、DPU、SmartNIC 时，CPU TEE 边界如何继续延伸。",
    background: [
      "CPU Realm/TVM 保护的是 CPU 执行和内存，敏感数据一旦进入 accelerator queue、driver、DMA buffer、device memory 或 remote pool，边界就变了。",
      "HETEE 用 rack-level security controller 做早期 heterogeneous TEE；CloudScale 把这个思想推到 cloud-scale non-TEE DSA pool；CAGE 用 Arm CCA GPC/GPT 和 shadow task 保护 Realm 使用 GPU/FPGA workflow。",
      "本方向必须区分 accelerator isolation、device identity、driver TCB、queue/metadata protection 和 scheduling。"
    ],
    keyClaim: "三篇论文的演进是 rack-scale controller -> cloud-scale DSA proxy -> Arm CCA accelerator workflow；它们都在回答“CPU TEE 之外的数据路径怎么继续可信”。",
    keyPoints: [
      "HETEE: IEEE S&P 2020，用 HETEE box/security controller/PCIe switch 为 GPU 加速任务提供 rack-scale confidential offload。",
      "CloudScale: ACSAC 2024，用 cloud-scale security controller 桥接 TEE nodes 与 legacy non-TEE DSA/NPU/GPU pool，平均 1.5%-5% overhead。",
      "CAGE: TDSC 2026，用 Arm CCA GPC/GPT 和 Monitor-side shadow task 保护 Realm 使用 GPU/FPGA，GPU overhead 0.58%-5.31%。"
    ],
    evidence: "HETEE IEEE S&P 2020 PDF; CloudScale ACSAC 2024 PDF; CAGE TDSC 2026 PDF.",
    path: ["Realm/TVM invokes accelerator", "untrusted driver prepares task", "trusted controller/monitor verifies metadata", "DMA buffers protected", "accelerator executes", "cleanup and attestation close lifecycle"],
    papers: [
      {
        key: "zhu2020hetee",
        short: "HETEE",
        title: "Enabling Rack-scale Confidential Computing using Heterogeneous Trusted Execution Environment",
        authors: "Jianping Zhu, Rui Hou, XiaoFeng Wang, Wenhao Wang, Jiangfeng Cao, Boyan Zhao, Zhongpu Wang, Yuhui Zhang, Jiameng Ying, Lixin Zhang, Dan Meng",
        venue: "IEEE Symposium on Security and Privacy (S&P 2020)",
        role: "foundational rack-scale heterogeneous TEE system",
        primaryContribution: "用 HETEE box、security controller、PCIe switch 和 proxy nodes 把机密计算任务扩展到 GPU/accelerator rack。",
        boundary: "HETEE 早于现代 SPDM/TDISP/CoVE-IO 生态，不等同于标准化 trusted device assignment。",
        evidenceBase: "HETEE figures/tables: HETEE architecture, hardware setup, DNN evaluation Figure 7/8, cost breakdown.",
        titleEvidence: "README metadata; IEEE S&P 2020 PDF title page.",
        summary: s("HETEE 的贡献是把 confidential computing 从单机 CPU enclave 扩成 rack-level accelerator enclave。",
          ["动机: GPU/DNN 训练推理需要高吞吐 accelerator，但 CPU TEE 本身无法保护 GPU 数据路径。", "工作: 设计 HETEE box，security controller 管 remote attestation、加解密、resource allocation 和 secure cleanup。", "数据: ResNet152 inference throughput overhead 2.17%，training throughput overhead 0.95%；单 GPU batch=8 平均 inference overhead 6.95%、training 0.91%。"], "HETEE abstract; Figure 5-Figure 9; evaluation sections.", flow("HETEE", ["remote user", "attestation to SC", "encrypted data stream", "proxy node", "GPU task", "secure cleanup", "encrypted result"])),
        background: s("背景问题是 GPU/accelerator 高吞吐但传统 TEE 不保护设备内部和 PCIe 数据路径。",
          ["CPU enclave 如果把 plaintext 发给 GPU，driver、PCIe、device memory 都可能暴露。", "改 GPU silicon 不现实，使用 COTS GPU 更容易部署。", "Rack-scale pooling 还要解决多任务资源分配和 cleanup。"], "HETEE introduction and threat model.", matrix("accelerator gap", [["CPU TEE", "protects CPU memory"], ["GPU", "separate device/data path"], ["Driver", "large untrusted stack"], ["PCIe", "external fabric"], ["HETEE", "controller-mediated offload"]])),
        core: s("核心洞察: 用一个较小的 Security Controller 作为 rack 内可信协调者，把大 GPU 软件栈移出 TCB。",
          ["SC 做 attestation、key handling、task authorization。", "Proxy nodes 和 PCIe switch 连接 COTS accelerators。", "任务结束后 reboot/cleanup 还原 secure state。"], "HETEE architecture and design sections.", cards("HETEE TCB idea", ["Security Controller", "remote attestation", "encrypted I/O", "PCIe switch config", "secure cleanup"])),
        architecture: s("架构总览: HETEE box 包含 SC node、proxy nodes、computing nodes/GPU 和 PCIe fabric。",
          ["远端用户先与 SC 建立 trust。", "SC 配置资源并控制数据进出。", "GPU 执行 DNN inference/training，结果经加密路径返回。"], "HETEE system figures and Table I.", matrix("组件", [["SC node", "trust and control"], ["Proxy node", "standard GPU software stack"], ["GPU", "COTS accelerator"], ["PCIe switch", "resource pooling"], ["Remote user", "attests and sends encrypted data"]])),
        methods: [
          m("Security Controller", "SC 是 HETEE 的可信控制面，负责把用户、任务和设备资源绑定。", ["执行 remote attestation 和 key exchange。", "配置 PCIe switch/resource assignment。", "限制不可信 OS 直接接触敏感 plaintext。"], "HETEE design sections.", flow("SC control", ["attest SC", "establish keys", "assign GPU", "authorize proxy", "stream encrypted data", "cleanup"])),
          m("Encrypted Data Stream", "HETEE 用加密数据流把 plaintext 暴露限制在可信边界内。", ["远端用户把数据加密发送到 HETEE box。", "SC/proxy 协调解密和 GPU task。", "结果加密返回，降低网络和 host OS 观察面。"], "HETEE data-flow design.", cards("data path", ["encrypted input", "SC-controlled decrypt", "GPU compute", "encrypted output", "cleanup"])),
          m("Rack-Scale Resource Pooling", "HETEE 的独特点是 rack-level pooling，而不是单设备 enclave。", ["PCIe fabric 可动态连接 computing units。", "多 GPU 可提升 DNN task speedup。", "资源回收必须伴随 secure cleanup。"], "HETEE scalability evaluation; PCIe switch design.", matrix("pooling", [["1 GPU", "baseline"], ["2 GPUs", "speedup"], ["4 GPUs", "higher speedup"], ["Switch", "dynamic assignment"], ["Risk", "shared fabric trust"]])),
          m("Modern Boundary", "HETEE 很有启发性，但不能替代现代 SPDM/TDISP/IDE evidence。", ["设备身份与 assignment lifecycle 后来由 TEE-I/O 生态更系统地定义。", "HETEE SC 是集中 TCB，供应链和容错风险高。", "本 PPT 把它作为 foundational accelerator TEE。"], "HETEE publication date and survey boundary.", cards("not modern standard", ["pre-SPDM/TDISP focus", "central SC TCB", "COTS GPU trust assumption", "cleanup critical", "still foundational"]))
        ],
        evidenceEnv: s("实验环境与数据: HETEE box 原型，DNN inference/training workload 和硬件模块开销。",
          ["硬件: SC node、proxy nodes、GPU computing units、PCIe switch/fabric。", "Workloads: VGG16、GoogLeNet、ResNet50/101/152，ImageNet 训练/推理数据。", "指标: throughput overhead、latency overhead、GPU scalability、bandwidth/latency、cost。"], "HETEE evaluation Section VIII; Table I; Figure 7-Figure 9.", matrix("实验设置", [["Models", "VGG/GoogLeNet/ResNet"], ["Dataset", "ImageNet"], ["Metrics", "throughput/latency"], ["Scale", "1/2/4 GPU"], ["Boundary", "not SPDM/TDISP"]])),
        performance: s("性能结论: HETEE throughput overhead 较低，但 latency overhead 与 batch/model/data transfer 明显相关。",
          ["Abstract: ResNet152 inference throughput overhead 2.17%，training 0.95%。", "Figure 7: batch=8 时 inference throughput overhead 平均 6.95%，training 0.91%；多数训练低于 5%。", "Figure 8: batch=8 时 inference latency overhead 平均 42.96%，training 18.54%。"], "HETEE abstract; Figure 7; Figure 8.", bars("key numbers", [{ label: "ResNet152 inference throughput", value: "2.17%", bar: 20 }, { label: "ResNet152 training throughput", value: "0.95%", bar: 10 }, { label: "batch=8 inference latency", value: "42.96%", bar: 70 }, { label: "batch=8 training latency", value: "18.54%", bar: 40 }])),
        evaluation: s("评价: HETEE 是 accelerator confidential offload 的 foundational baseline，强在系统视角，弱在现代协议闭环。",
          ["优势: 完整 rack-level prototype，直接覆盖 GPU DNN workload。", "局限: 集中 SC TCB、COTS GPU trust、现代 device identity/lifecycle 不完整。", "商业化潜力: 启发 DPU/SmartNIC security controller；落地需要标准化 device evidence 和 failure isolation。"], "HETEE conclusion and README evaluation.", matrix("评价", [["优势", "rack-scale accelerator TEE"], ["局限", "central TCB / old protocol era"], ["商业化", "DPU/security controller"], ["本方向角色", "foundational baseline"]]))
      },
      {
        key: "dhar2024cloudscale",
        short: "CloudScale",
        title: "Confidential Computing with Heterogeneous Devices at Cloud-Scale",
        authors: "Aritra Dhar, Supraja Sridhara, Shweta Shinde, Srdjan Capkun, Renzo Andri",
        venue: "ACSAC 2024",
        role: "peer-reviewed SOTA cloud-scale heterogeneous device confidential computing",
        primaryContribution: "用 cloud-scale Security Controller 桥接 TEE-enabled CPU nodes 与 legacy non-TEE DSA/NPU/GPU/SSD nodes。",
        boundary: "CloudScale 不替代 SPDM/TDISP/IOMMU/IDE 标准；SC 正确性和供应链可信是硬假设。",
        evidenceBase: "CloudScale abstract; Figure 4 manifest; Figure 5 SC prototype; Figure 6 evaluation; NPU/SSD workload results.",
        titleEvidence: "README metadata; ACSAC 2024 PDF title page.",
        summary: s("CloudScale 的贡献是把 HETEE 式 controller 思路推到 cloud-scale heterogeneous DSA pool。",
          ["动机: 数据中心大量 DSA/NPU/GPU/SSD 没有 TEE 能力，tenant 不想在性能和数据保护间二选一。", "工作: 设计 distributed security controller，作为 TEE proxy 做 access control、attestation、key exchange 和 encrypted/authenticated data path。", "数据: AI、Redis、file-system workloads overhead 约 1.5%-5%，规模估算到 2236 concurrent NPUs running CNNs。"], "CloudScale abstract; Figure 4-Figure 6; evaluation.", flow("CloudScale", ["TEE VM", "Security Controller", "manifest/policy", "legacy DSA/NPU/SSD", "encrypted/authenticated path", "result returns"])),
        background: s("背景问题是云里不是所有 accelerator 都能变成 TEE device。",
          ["替换所有 DSA 为 TEE-capable 硬件成本高且周期长。", "Legacy non-TEE devices 性能强，但无法直接接触敏感 plaintext。", "云规模还要求多节点、多 SC、多租户 resource pool。"], "CloudScale introduction.", matrix("cloud gap", [["TEE CPU", "available"], ["TEE DSA", "limited"], ["Legacy DSA", "common"], ["Tenant", "needs confidentiality"], ["CloudScale", "SC-mediated secure path"]])),
        core: s("核心洞察: SC 作为 cloud-scale proxy，把非 TEE DSA 放进可证明的物理/逻辑安全边界。",
          ["SC enforcement 包括 access control、attestation、key exchange 和 encrypted/authenticated data path。", "Manifest 描述 enclave/DSA/resource requirements。", "SC chiplet/prototype 评估控制面和数据面开销。"], "CloudScale design sections; Figure 4.", cards("SC functions", ["access control", "key exchange", "attestation", "encrypted path", "resource policy"])),
        architecture: s("架构总览: TEE-enabled node 与 legacy DSA node 通过 SC 协调，SC 形成安全 perimeter。",
          ["SC 解析 manifest 并检查资源授权。", "TEE VM 与 DSA node 通过 SC 建立 secure path。", "多个 DSA 节点可被纳入同一 cloud-scale pool。"], "CloudScale architecture figures.", matrix("组件", [["TEE VM", "confidential workload"], ["SC", "trusted proxy/controller"], ["DSA/NPU/SSD", "legacy accelerator/storage"], ["Manifest", "policy/resource description"], ["KMS/attestation", "trust bootstrap"]])),
        methods: [
          m("Manifest-Driven Assignment", "CloudScale 用 manifest 描述用户任务需要哪些设备和安全属性。", ["Manifest 让 SC 知道哪些节点/设备可访问数据。", "错误 manifest 或 policy 会直接影响安全边界。", "这类似 CoVE-IO 的 lifecycle policy，但面向 cloud-scale legacy pool。"], "CloudScale Figure 4; design sections.", flow("manifest", ["user job", "manifest", "SC validates", "resources assigned", "secure path established"])),
          m("SC Data Plane", "SC 不只是管理面，还要处理 encrypted/authenticated data path。", ["论文 RTL/prototype 中 SC chiplet data plane 约 2.5 KLoC。", "SC 处理 access control 和 crypto。", "数据面延迟/吞吐决定能否承载 AI/SSD workloads。"], "CloudScale implementation/evaluation; SC chiplet discussion.", matrix("SC datapath", [["Crypto", "AES-GCM/keyed path"], ["Policy", "access control"], ["Throughput", "12.96GB/s class reported"], ["Latency", "ns/us class components"], ["TCB", "SC RTL/proxy code"]])),
          m("Cloud-Scale Resource Pool", "CloudScale 关注多 DSA 并发和数据中心容量规划。",
            ["论文估算 RetinaNet-RN50 可到 2236 concurrent NPUs。", "SSD 场景可到 117 concurrent Intel 535 SSDs。", "扩展上限受 PCIe lanes、SC throughput 和 workload latency 支配。"], "CloudScale abstract/evaluation; NPU/SSD scalability lines.", bars("scale evidence", [{ label: "NPU CNN concurrency", value: "2236", bar: 90 }, { label: "SSD concurrency", value: "117", bar: 55 }, { label: "SC throughput", value: "12.96GB/s", bar: 70 }])),
          m("Trusted I/O Boundary", "CloudScale 的 SC 方案和标准 TEE-I/O 是互补关系，不是替代关系。", ["SC 可以作为 DPU/SmartNIC 形态落地。", "但 device identity、TDISP state、IOMMU/IDE 仍需标准化机制。", "商业风险在多租户 failure isolation 和 SC compromise blast radius。"], "CloudScale discussion; survey boundary.", cards("standard gaps", ["SPDM identity", "TDISP lifecycle", "IOMMU/IOPMP", "PCIe IDE", "failure isolation"]))
        ],
        evidenceEnv: s("实验环境与数据: RTL/prototype + AI/Redis/file-system/SSD workloads。",
          ["Workloads: ResNet-34/50 on Ascend NPU, Redis query/update, FIO/SSD file-system path。", "规模: concurrent NPU/SSD estimates。", "实现: SC chiplet data plane RTL/prototype，TEE VM + legacy node path。"], "CloudScale evaluation Section VI; Figure 6.", matrix("实验设置", [["AI", "Ascend NPU ResNet"], ["Storage", "SSD/FIO"], ["Database", "Redis"], ["Scale", "NPU/SSD concurrency"], ["Metric", "latency/throughput overhead"]])),
        performance: s("性能结论: CloudScale 把 overhead 控制在实用范围，但 SC 成为关键瓶颈和 TCB。",
          ["Abstract: AI、Redis、file-system workloads overhead 约 1.5%-5%。", "Evaluation: SEV VM path overhead 约 1.84%-1.94%，Redis read/update latency overhead 约 4.37%，ResNet-34 batch 16 max overhead 约 5.3%。", "SC access-control block 约 3.585us latency，但可 pipeline 隐藏。"], "CloudScale abstract; evaluation lines around Figure 6.", bars("key numbers", [{ label: "typical overhead", value: "1.5%-5%", bar: 35 }, { label: "ResNet max overhead", value: "5.3%", bar: 35 }, { label: "Redis latency overhead", value: "4.37%", bar: 32 }, { label: "NPU concurrency", value: "2236", bar: 90 }])),
        evaluation: s("评价: CloudScale 是 cloud-scale accelerator/DPU offload 的强 SOTA，但商业落地取决于 SC trust 和标准互操作。",
          ["优势: 直面 legacy heterogeneous devices，云规模叙事强，overhead 数据较完整。", "局限: SC compromise blast radius、physical perimeter、vendor attestation 和 lifecycle 仍复杂。", "商业化潜力: DPU/SmartNIC security gateway、confidential accelerator pool。"], "CloudScale conclusion and README evaluation.", matrix("评价", [["优势", "cloud-scale legacy DSA bridge"], ["局限", "SC TCB and lifecycle"], ["商业化", "DPU security proxy"], ["本方向角色", "cloud-scale SOTA"]]))
      },
      {
        key: "wang2026cage",
        short: "CAGE",
        title: "Building Confidential Accelerator Computing Environment for Arm CCA",
        authors: "Chenxu Wang et al.",
        venue: "IEEE Transactions on Dependable and Secure Computing (TDSC), 2026",
        role: "peer-reviewed SOTA Arm CCA GPU/FPGA accelerator workflow",
        primaryContribution: "用 Arm CCA GPC/GPT、Monitor-side shadow task 和 accelerator-specific protection 保护 Realm 使用 GPU/FPGA。",
        boundary: "CAGE 不完整解决 device identity、SPDM/TDISP、真实量产 CCA 硬件和多租户 accelerator scheduling。",
        evidenceBase: "CAGE Figure 5 GPU overhead; Figure 8 FPGA overhead; Table III breakdown; implementation LoC.",
        titleEvidence: "README metadata; TDSC 2026 PDF title page.",
        summary: s("CAGE 的贡献是把 Realm 的机密边界延伸到 accelerator workflow，而不是让 untrusted driver 直接处理敏感 task。",
          ["动机: Arm CCA 保护 Realm memory，但 accelerator driver/runtime 会接触 code、metadata、MMIO、DMA buffer 和 completion state。", "工作: Monitor 维护 shadow task，验证 untrusted stub 操作，用 GPC/GPT 保护 accelerator buffers，并做 GPU/FPGA cleanup。", "数据: GPU benchmark overhead 0.58%-5.31%，FPGA benchmark 9.61%-16.30%；GPU TCB 增量 1301 LoC，FPGA 额外 140 LoC。"], "CAGE abstract; Figure 5; Figure 8; implementation section.", flow("CAGE workflow", ["Realm app", "untrusted accelerator stack", "shadow task in Monitor", "GPC/GPT protected buffers", "GPU/FPGA execution", "verified result"])),
        background: s("背景问题是 CCA 的 GPC/GPT 能保护内存 ownership，但 accelerator workflow 还有大量 metadata 和 queue state。",
          ["Driver 可以伪造 task metadata 或地址。", "Accelerator DMA buffer 需要 Granule Protection Check/translation policy。", "GPU/FPGA workflow 差异大，不能只做通用 copy wrapper。"], "CAGE introduction and threat model.", matrix("CCA accelerator gap", [["Realm memory", "protected by CCA"], ["Driver/runtime", "untrusted"], ["Task metadata", "tamper risk"], ["DMA buffer", "needs GPC/GPT"], ["Device identity", "not fully solved"]])),
        core: s("核心洞察: 让 untrusted stack 继续做复杂工程，但在 Monitor 里重建并验证一个可信 shadow task。",
          ["Shadow task 捕获真实 accelerator task 的安全关键字段。", "Monitor 验证 metadata、地址和状态转换。", "GPC/GPT 保护 accelerator-visible memory，降低 driver TCB。"], "CAGE design sections.", cards("CAGE core", ["shadow task", "Monitor verification", "GPC/GPT protection", "accelerator cleanup", "untrusted stub"])),
        architecture: s("架构总览: Realm 与 accelerator stack 之间插入 Monitor-side verification 和 GPT/GPC protection。",
          ["Untrusted driver 发起 GPU/FPGA task。", "Monitor 检查并同步 shadow task 到真实 task。", "Protected buffers 经 accelerator GPT/GPC 管理，防止 host 访问敏感数据。"], "CAGE architecture figures; Figure 5/8 evaluation context.", matrix("组件", [["Realm", "confidential workload"], ["Monitor", "shadow task and policy"], ["Untrusted stack", "driver/runtime"], ["GPC/GPT", "memory ownership"], ["Accelerator", "GPU/FPGA execution"]])),
        methods: [
          m("Shadow Task", "Shadow task 是 CAGE 的核心抽象: 在可信 Monitor 内保存可验证的 accelerator task 镜像。", ["真实 task 仍由 untrusted stack 操作。", "Monitor 根据 shadow task 检查 metadata/address。", "避免把庞大 GPU/FPGA driver 纳入 TCB。"], "CAGE design sections; shadow task discussion.", flow("shadow task", ["driver prepares task", "Monitor extracts fields", "shadow task validates", "sync to real task", "launch accelerator"])),
          m("GPC/GPT Buffer Protection", "CAGE 用 CCA GPC/GPT 保护 accelerator buffer ownership。",
            ["Sensitive buffers 切到 Realm/accelerator 可用状态。", "Monitor 优化 GPT maintenance，减少同步开销。", "错误地址/metadata 只导致 DoS，不应泄露或篡改 secret。"], "CAGE GPC/GPT design and optimization sections.", matrix("buffer policy", [["Realm private", "host blocked"], ["Accelerator-visible", "controlled by Monitor"], ["Untrusted metadata", "verified"], ["GPT sync", "optimized"], ["Failure", "DoS over disclosure"]])),
          m("GPU vs FPGA Workflow", "CAGE 明确 GPU 和 FPGA 工作流不同，因此保护模块也不同。",
            ["GPU 侧重 task/queue/buffer 元数据。", "FPGA 侧重 bitstream/task metadata 和 XDMA-like path。", "扩展到 DPU/SmartNIC 时也要重画 workflow-specific state。"], "CAGE GPU/FPGA evaluation and implementation.", cards("workflow-specific", ["GPU queue", "GPU buffer", "FPGA metadata", "XDMA driver", "device cleanup"])),
          m("TCB and Identity Boundary", "CAGE 缩小 driver TCB，但仍未解决所有 device trust 问题。", ["增加约 1301 LoC GPU security modules 和 140 LoC FPGA extension。", "真实 device identity/fake accelerator/SMMU 路径需要额外机制。", "SPDM/TDISP/IDE 是商业化时必须补上的层。"], "CAGE implementation/security discussion.", matrix("boundary", [["TCB add", "1301 LoC + 140 LoC"], ["Not solved", "device identity"], ["Needs", "SPDM/TDISP"], ["Risk", "scheduler/side channels"], ["Value", "CCA workflow proof"]]))
        ],
        evidenceEnv: s("实验环境与数据: Arm CCA emulation/prototype，GPU Rodinia/ML 和 FPGA benchmarks。",
          ["实现: Arm Trusted Firmware-A v2.8 Monitor 修改，GPU security modules 1301 LoC，FPGA extension 140 LoC。", "GPU: 六个 Rodinia benchmarks 和 ML inference models。", "FPGA: 六个 C benchmarks / Xilinx workflow。"], "CAGE implementation/evaluation sections; Figure 5; Figure 8.", matrix("实验设置", [["Platform", "Arm CCA emulation/prototype"], ["GPU", "Rodinia + ML inference"], ["FPGA", "Xilinx tasks"], ["TCB", "1301 LoC + 140 LoC"], ["Metrics", "overhead/breakdown"]])),
        performance: s("性能结论: CAGE 的 GPU 开销较低，FPGA 更高但仍在论文声称的 moderate 区间。",
          ["GPU Rodinia: overhead 0.58%-5.31%。", "FPGA benchmarks: overhead 9.61%-16.30%。", "论文还报告通过优化缓解 84.63%-96.55% GPT sync overhead。"], "CAGE Figure 5; Figure 8; GPT optimization evaluation.", bars("key numbers", [{ label: "GPU overhead low", value: "0.58%", bar: 10 }, { label: "GPU overhead high", value: "5.31%", bar: 25 }, { label: "FPGA overhead low", value: "9.61%", bar: 40 }, { label: "FPGA overhead high", value: "16.30%", bar: 55 }])),
        evaluation: s("评价: CAGE 是当前 Arm CCA accelerator workflow 的强 SOTA，最适合支撑 GPU/FPGA confidential offload slides。",
          ["优势: 机制贴近 CCA，shadow task 概念清楚，GPU/FPGA 都有评估。", "局限: device identity、production CCA hardware、multi-tenant scheduling、side channels 仍需额外机制。", "商业化潜力: 可迁移到 DPU/SmartNIC queue descriptor 和 packet-processing task，但必须补 SPDM/TDISP。"], "CAGE conclusion and README evaluation.", matrix("评价", [["优势", "CCA-native accelerator workflow"], ["局限", "identity/scheduling gaps"], ["商业化", "GPU/FPGA/DPU offload"], ["本方向角色", "Arm CCA SOTA"]]))
      }
    ]
  },
  {
    id: "15-smartnic-trusted-nic-storage",
    title: "SmartNIC / Trusted NIC / Secure Storage Data Path",
    claim: "这个分类解释可信边界如何落到 NIC/DPU 和远端存储 data path: NIC-local isolation、network endpoint root 和 storage freshness。",
    background: [
      "SmartNIC/DPU 不只是网卡，它会跑 packet processing、crypto、storage offload、vSwitch、tenant NF 和 control-plane code。",
      "S-NIC 解决 SmartNIC 内部 multi-function isolation；TNIC 把 network trust root 做成 NIC hardware；Hazel 把 secure disaggregated storage 的 confidentiality、integrity、freshness 和 DPU offload 结合起来。",
      "本方向必须区分 NIC-local isolation、distributed-system authentication、NVMe-oF storage data path 和 full confidential I/O lifecycle。"
    ],
    keyClaim: "三篇论文的层次不同: S-NIC 保护 NIC 内部资源，TNIC 把 NIC 变成可信网络端点，Hazel 保护远端存储数据和 freshness。",
    keyPoints: [
      "S-NIC: EuroSys 2024，用 memory denylist、locked TLB、cache partitioning、accelerator virtualization 和 bus arbitration 隔离 SmartNIC functions。",
      "TNIC: ASPLOS 2025，在 NIC hardware 中实现 transferable authentication/non-equivocation，Tamarin 验证，硬件 TCB 约 2114 LoC。",
      "Hazel: 2026 preprint，用 counter leasing、NVMe metadata、Hazel Merkle Tree 和 BlueField-3 offload 保护 NVMe-oF storage path。"
    ],
    evidence: "S-NIC EuroSys 2024 PDF; TNIC ASPLOS 2025 PDF; Hazel arXiv/local PDF.",
    path: ["tenant runs NIC/storage function", "NIC-local resources isolated", "NIC endpoint signs/verifies network operations", "storage path encrypts and authenticates sectors", "freshness metadata prevents replay", "DPU offload keeps overhead practical"],
    papers: [
      {
        key: "zhou2024snic",
        short: "S-NIC",
        title: "S-NIC: SmartNIC Security Isolation for the Cloud",
        authors: "Zhou et al.",
        venue: "EuroSys 2024",
        role: "foundational SmartNIC function isolation system",
        primaryContribution: "提出 virtual smart NIC abstraction，用硬件隔离 SmartNIC 上不同 network functions 的 memory、accelerator、DMA、cache 和 bus resources。",
        boundary: "S-NIC 不等同于完整 VM/Realm trusted I/O，也没有真实 production NIC silicon。",
        evidenceBase: "S-NIC Figure 1 SmartNIC architecture; Figure 2 S-NIC architecture; Table 1 APIs; Figure 5/6/8; Tables 2-8.",
        titleEvidence: "README metadata; EuroSys 2024 PDF title page.",
        summary: s("S-NIC 的贡献是让 SmartNIC 上的 tenant network function 像拥有自己的 virtual NIC 一样被隔离。",
          ["动机: SmartNIC 上多个 tenant/function 共享 NIC OS、DRAM、cores、accelerators，容易泄露或篡改 state。", "工作: 提出 locked-down TLB entries、memory denylist、cache partitioning、accelerator virtualization、DMA isolation、bus arbitration 和 attestation。", "数据: function throughput worst-case 下降 <1.7%，chip area up to 8.89%，power up to 11.45%。"], "S-NIC abstract; Figure 2; Table 1; evaluation tables.", flow("S-NIC", ["host launches NF", "nf_launch", "locked TLB entries", "isolated RAM/accelerator", "bus arbitration", "attestation"])),
        background: s("背景问题是 SmartNIC 自己也变成多租户计算平台，NIC OS 不能默认可信。",
          ["Packet processing、DPI、NAT、ZIP、RAID、load balancer 可能同时运行。", "共享 allocator、accelerator 或 bus 可造成 cross-function leakage/corruption。", "传统 NIC SR-IOV 不覆盖 SmartNIC 内部可编程资源。"], "S-NIC Section 2-3; Figure 1.", matrix("SmartNIC attack surface", [["DRAM", "shared buffers/metadata"], ["Cores", "programmable NF"], ["Accelerators", "DPI/ZIP/RAID"], ["NIC OS", "management authority"], ["Bus/cache", "contention/leakage"]])),
        core: s("核心洞察: NIC 上也需要类似 enclave/VM 的 resource ownership，但对象是 NIC-local resources。",
          ["Memory denylist 防止 NIC OS 访问 function private memory。", "Locked TLB entries 固定 NF address translation。", "Accelerator virtualization 和 bus arbitration 防止 shared hardware 造成越权。"], "S-NIC Figure 2; Table 1.", cards("isolation objects", ["memory denylist", "locked TLB", "cache partition", "accelerator virtualization", "bus arbitration"])),
        architecture: s("架构总览: S-NIC 在 SmartNIC SoC 内加入硬件隔离机制和 host-visible management API。",
          ["Figure 2 展示 high-level architecture。", "Table 1 展示 nf_launch 等 management APIs。", "Attestation 让 host/tenant 知道 function 由 certified S-NIC 启动。"], "S-NIC Figure 2; Table 1.", matrix("组件", [["Management core", "launch/control"], ["Programmable cores", "run NFs"], ["TLB banks", "locked translations"], ["Accelerators", "virtualized"], ["Attestation", "launch evidence"]])),
        methods: [
          m("Locked TLB / Memory Denylist", "S-NIC 用 locked TLB 和 denylist 建立 NIC-local single-owner memory semantics。", ["NF launch 时锁定 translation。", "NIC OS 之后不能更新 NF TLB。", "Denylist 阻止管理软件访问 function memory。"], "S-NIC Figure 2; Table 1.", flow("NF launch", ["host request", "nf_launch", "allocate memory", "lock TLB", "denylist owner", "run NF"])),
          m("Accelerator Virtualization", "SmartNIC 的 DPI/ZIP/RAID 等 accelerator 也必须虚拟化和隔离。",
            ["Virtual accelerator 分配独立 state。", "硬件检查请求属于哪个 function。", "避免一个 NF 读取另一个 NF 的 accelerator metadata。"], "S-NIC Figure 3; Tables 3/7.", matrix("accelerator isolation", [["DPI", "rule/cache state"], ["ZIP", "compression buffers"], ["RAID", "storage metadata"], ["Virtualization", "per-NF state"], ["Risk", "shared accelerator leakage"]])),
          m("Cache / Bus Partitioning", "即使 memory 权限正确，共享 cache 和 bus 仍能造成性能和信息干扰。",
            ["S-NIC 加 bus arbiter 和 cache partition。", "Evaluation 报告 worst-case IPC degradation 约 1.66%。", "这是 NIC-local side/control channel 的系统化处理。"], "S-NIC Figure 5; evaluation section.", bars("interference control", [{ label: "throughput worst-case drop", value: "<1.7%", bar: 20 }, { label: "IPC degradation", value: "1.66%", bar: 18 }, { label: "area overhead", value: "8.89%", bar: 45 }])),
          m("Attested Function Lifecycle", "S-NIC 提供 function launch/attest/destroy 的 lifecycle，而不是只给静态隔离。",
            ["nf_attest 证明 function was launched on certified S-NIC。", "生命周期 API 让 host 管理 NF，但不能越权改私有资源。", "仍不等同于 TVM trusted device assignment。"], "S-NIC Table 1; Appendix attestation.", flow("lifecycle", ["nf_launch", "resource lock", "nf_attest", "run packets", "nf_destroy", "resource cleanup"]))
        ],
        evidenceEnv: s("实验环境与数据: SmartNIC architecture simulation/modeling + six network functions。",
          ["Functions: DPI、NAT、ZIP、RAID、load balancer、monitor 等。", "Metrics: area/power estimates、throughput/IPC degradation、instruction latency、memory usage。", "Evidence boundary: 不是 production silicon。"], "S-NIC evaluation section; Tables 2-8; Figure 5-Figure 8.", matrix("实验设置", [["Functions", "six NFs"], ["Metrics", "area/power/perf"], ["Hardware cost", "TLB/cache/bus estimates"], ["Security", "resource ownership"], ["Boundary", "no production NIC silicon"]])),
        performance: s("性能结论: S-NIC 的隔离成本在论文评估中较小，主要硬件成本是 TLB/cache/bus support。",
          ["Abstract/evaluation: throughput worst-case drop <1.7%。", "Chip area increases up to 8.89%，power draw up to 11.45%。", "nf_attest latency 受 RSA 等 crypto 影响，管理操作不是 packet fast path。"], "S-NIC abstract; evaluation Tables 2-5; Figure 5/6.", bars("key numbers", [{ label: "throughput drop", value: "<1.7%", bar: 18 }, { label: "area overhead", value: "8.89%", bar: 45 }, { label: "power overhead", value: "11.45%", bar: 50 }, { label: "IPC degradation", value: "1.66%", bar: 18 }])),
        evaluation: s("评价: S-NIC 是 SmartNIC 内部多租户隔离的强基线，但它不是完整 confidential I/O。",
          ["优势: 资源对象拆得清楚，硬件成本量化，贴近 DPU/NIC 多租户问题。", "局限: 无生产 silicon；不处理 SPDM/TDISP、TVM binding、link encryption。", "商业化潜力: DPU tenant NF isolation；风险在功能链、资源利用率和 vendor attestation。"], "S-NIC conclusion and README evaluation.", matrix("评价", [["优势", "NIC-local isolation"], ["局限", "not full TEE-I/O"], ["商业化", "DPU NF isolation"], ["本方向角色", "SmartNIC isolation SOTA"]]))
      },
      {
        key: "giantsidi2025tnic",
        short: "TNIC",
        title: "TNIC: A Trusted NIC Architecture",
        authors: "Dimitra Giantsidi, Julian Pritzi, Felix Gust, Antonios Katsarakis, Atsushi Koshiba, Pramod Bhatotia",
        venue: "ASPLOS 2025",
        role: "peer-reviewed SOTA trusted network endpoint architecture",
        primaryContribution: "在 NIC hardware 中实现 minimal root-of-trust，为 distributed systems 提供 transferable authentication 和 non-equivocation。",
        boundary: "TNIC 不保护 workload memory，也不替代 SPDM/TDISP/IOMMU/link encryption；它提供 network endpoint trust substrate。",
        evidenceBase: "TNIC Figure 1 system overview; Figure 2 hardware architecture; Figure 3 attestation; Table 1 APIs; Figures 5-13 evaluation; Table 4 TCB.",
        titleEvidence: "README metadata; ASPLOS 2025 PDF title page.",
        summary: s("TNIC 的贡献是把跨主机可信分布式系统的 root-of-trust 从 CPU TEE 下沉到 NIC hardware。",
          ["动机: CPU TEE 在网络 I/O 场景 TCB 大、延迟高、异构性强。", "工作: 设计 TNIC hardware、attestation kernel、programming APIs 和 Tamarin-verified protocol core。", "数据: 相比 TEE-based systems 3x-5x throughput 改善；硬件 TCB 约 2114 LoC；tnic design 占 U280 FPGA 约 16.6% LUT/16.3% FF。"], "TNIC Figure 1-Figure 4; Table 1; Table 4; Figure 10-Figure 13.", flow("TNIC", ["application posts request", "TNIC attestation kernel", "hardware signs/verifies", "RoCE/network path", "receiver verifies", "BFT/CFT system uses proof"])),
        background: s("背景问题是分布式系统需要可信 message provenance，但 CPU enclave 路径会拖慢网络。",
          ["BFT/CFT protocol 需要 authentication/non-equivocation。", "在 CPU TEE 中做 crypto 和 network stack 可能产生巨大 latency spikes。", "NIC 本来就在数据路径上，适合作为 host-agnostic trust substrate。"], "TNIC introduction; Figure 1.", matrix("network trust gap", [["CPU TEE", "large TCB / I/O overhead"], ["SSL-lib", "fast but not tamper-proof"], ["RDMA", "fast but untrusted"], ["TNIC", "trusted NIC endpoint"], ["Goal", "transferable authentication"]])),
        core: s("核心洞察: 把最小安全 primitive 固化在 NIC，应用通过 kernel-bypass API 获得可信网络操作。",
          ["Attestation kernel 位于 TNIC hardware。", "Request/response handler 处理发送/接收 path。", "Tamarin model 验证 bootstrapping、RA、message transmission/reception。"], "TNIC Figure 2; Figure 3; verification sections.", cards("TNIC primitives", ["attestation kernel", "CMAC/HMAC path", "transferable authentication", "non-equivocation", "Tamarin proof"])),
        architecture: s("架构总览: TNIC hardware 介于 host application 和 100Gb MAC/RoCE network stack 之间。",
          ["Figure 2 展示 Tx/Rx datapath 和 attestation kernel。", "Figure 3 展示 remote attestation protocol。", "Table 1 给 programming APIs。"], "TNIC Figure 2-Figure 4; Table 1.", matrix("组件", [["Host app", "kernel-bypass API"], ["Attestation kernel", "trusted core"], ["Req handler", "transmit path"], ["Request decoder", "receive path"], ["100Gb MAC/RoCE", "network substrate"]])),
        methods: [
          m("NIC-Level Attestation", "TNIC 先证明 NIC hardware/control binary，再让应用相信 network primitive。", ["Remote attestation protocol 用 measurement 和 mutual TLS 建 trust。", "Verifier 检查 Ctrlbin/Ctrlpub 等信息。", "这和 device endpoint attestation 目标一致，但不是 SPDM 标准实现。"], "TNIC Figure 3.", flow("attestation", ["measure Ctrlbin", "sign evidence", "mutual TLS", "verifier checks", "connection established"])),
          m("Transferable Authentication", "TNIC 让收到的 message proof 可以被第三方验证，而不是只在点对点连接里有效。", ["用于 BFT/CFT systems 的 non-equivocation。", "硬件生成/验证 message authentication。", "应用不需要把大 CPU TEE 放进每个 network hop。"], "TNIC design and protocol sections.", cards("distributed property", ["message provenance", "non-equivocation", "third-party verifiable", "BFT/CFT support", "host-agnostic"])),
          m("Kernel-Bypass Stack", "TNIC 保持高性能的关键是让应用绕过 OS kernel，直接 post requests 给 hardware。", ["APIs 类似 RDMA/ibv 风格。", "Memory area 在 connection creation 时分配。", "Network stack 仍追求 low-latency operations。"], "TNIC Table 1; Figure 4.", flow("data path", ["application buffer", "API request", "TNIC hardware", "RoCE packet", "remote TNIC", "application receives"])),
          m("Formal Verification Boundary", "Tamarin proof 强化协议性质，但不证明所有硬件实现没有 bug。", ["模型覆盖 bootstrapping、remote attestation、transmission、reception。", "实现仍有 FPGA/HLS/HDL 工程风险。", "PPT 应把 proof scope 与 system evaluation 分开。"], "TNIC Tamarin verification section.", matrix("proof scope", [["Covers", "protocol properties"], ["Tool", "Tamarin"], ["Not cover", "all RTL bugs"], ["TCB", "2114 LoC"], ["Value", "stronger than pure prototype"]]))
        ],
        evidenceEnv: s("实验环境与数据: FPGA prototype、host baselines、distributed-system case studies 和 Tamarin proof。",
          ["平台: Xilinx U280 FPGA / Vitis XRT v2022.2 等。", "Baselines: RDMA-hw、DRCT-IO、DPDK、SSL-lib、SGX/AMD SEV variants。", "Workloads: attest/verify microbenchmarks、send latency/throughput、A2M、BFT/CFT systems。"], "TNIC evaluation Section 8; Figure 5-Figure 13; Table 2-5.", matrix("实验设置", [["Platform", "FPGA prototype"], ["Baselines", "TEE/RDMA/DPDK/SSL"], ["Metrics", "latency/throughput/TCB"], ["Proof", "Tamarin"], ["TCB", "2114 LoC"]])),
        performance: s("性能结论: TNIC 明显优于 TEE-based network trust，但相对纯 SSL/RDMA 仍有安全成本。",
          ["Paper reports 3x-5x better throughput compared to AMD-SEV/SGX TEE-based competitors。", "A2M Table 3: tnic 158K ops/s, 6.34us latency；AMD-sev 30K ops/s, 32.37us。", "Table 4: hardware TCB 2114 LoC vs TEE-hosted codebase over 2M LoC class。"], "TNIC Figure 8-Figure 12; Table 3; Table 4.", bars("key numbers", [{ label: "throughput gain vs TEEs", value: "3x-5x", bar: 85 }, { label: "tnic A2M latency", value: "6.34us", bar: 25 }, { label: "AMD-sev A2M latency", value: "32.37us", bar: 80 }, { label: "hardware TCB", value: "2114 LoC", bar: 20 }])),
        evaluation: s("评价: TNIC 是 trusted network endpoint 的强 SOTA，最适合支撑“NIC 也可以是 RoT”。",
          ["优势: root-of-trust 下沉到 NIC，形式化验证 + 系统评估都较强。", "局限: 不保护 workload memory，不覆盖 SPDM/TDISP/IDE/IOMMU lifecycle。", "商业化潜力: SmartNIC/DPU attested messaging、BFT/CFT service、cloud network trust substrate。"], "TNIC conclusion and README evaluation.", matrix("评价", [["优势", "NIC-level trust root"], ["局限", "not memory/device lifecycle"], ["商业化", "trusted network substrate"], ["本方向角色", "trusted NIC SOTA"]]))
      },
      {
        key: "chrapek2026hazel",
        short: "Hazel",
        title: "Hazel: Secure and Efficient Disaggregated Storage",
        authors: "Chrapek et al.",
        venue: "arXiv / preprint, 2026",
        role: "draft SOTA secure disaggregated storage data path",
        primaryContribution: "用 counter leasing、NVMe metadata、Hazel Merkle Tree、metadata cache 和 BlueField-3 DPU offload 同时处理 confidentiality、integrity、freshness。",
        boundary: "Hazel 是 preprint；未完整闭环 BlueField DPU attestation、SPDM/TDISP/NVMe-oF endpoint identity。",
        evidenceBase: "Hazel Figure 1 overview; Figure 2 algorithm overheads; Figure 3 control path; Figure 4 data path; Figure 11 IO500; Figure 12 YCSB; Figure 13 ML.",
        titleEvidence: "README metadata; Hazel PDF title page.",
        summary: s("Hazel 的贡献是把 secure storage data path 的三个目标放到一个 NVMe-oF + DPU 原型里。",
          ["动机: confidential workload 使用远端存储时，本地 dm-crypt/dm-integrity/dm-x 难以兼顾性能、扩展性和 replay freshness。", "工作: counter leasing 控制 path、NVMe metadata 封装、Hazel Merkle Tree、IV/metadata cache、BlueField-3 crypto offload。", "数据: synthetic/IO500/YCSB/ML 评估；IO500 平均 overhead 6.3%，YCSB p99 latency 平均 2.2%，多数应用 1%-2% overhead。"], "Hazel Figure 1-Figure 4; Figure 11-Figure 13.", flow("Hazel", ["TEE requests storage", "KBS leases counters", "DPU offloads crypto", "NVMe metadata carries tags", "HMT verifies freshness", "data returns"])),
        background: s("背景问题是远端存储不只要加密，还要防篡改和旧数据回放。",
          ["dm-crypt 只给 confidentiality。", "dm-integrity/dm-x 会带来 IOPS/latency/throughput 开销。", "NVMe-oF/JBOF 场景中 host CPU 和 network path 都可能成为瓶颈。"], "Hazel Section 2; Figure 2.", matrix("storage security", [["Confidentiality", "encryption"], ["Integrity", "MAC/AEAD"], ["Freshness", "counter/tree"], ["Attestability", "TEE/DPU evidence"], ["Performance", "DPU offload + metadata cache"]])),
        core: s("核心洞察: 让 freshness/control path 慢而少，让 data path 快而 offloaded。",
          ["KBS/TEE 负责 counter leasing 和 key/control。", "DPU 负责 line-rate crypto 和 NVMe-oF path。", "HMT/metadata cache 让 reads 尽量不走昂贵 tree path。"], "Hazel Figure 3-Figure 5.", cards("Hazel ingredients", ["counter leasing", "NVMe metadata", "Hazel Merkle Tree", "metadata cache", "BlueField-3 offload"])),
        architecture: s("架构总览: Hazel control path 建 trust/key/counter，data path 走 DPU/NVMe-oF 并把安全 metadata 放进 sector layout。",
          ["Figure 3 是 control path: cluster manager、TEE、KBS、Hazel service。", "Figure 4 是 data path 和 SSD sector layout。", "Figure 5 是 HMT 设计。"], "Hazel Figure 3-Figure 5.", matrix("组件", [["TEE/KBS", "counter/key control"], ["Hazel service", "local trusted service"], ["DPU/BF3", "crypto offload"], ["NVMe metadata", "security tags"], ["HMT", "freshness tree"]])),
        methods: [
          m("Counter Leasing", "Hazel 不为每次 I/O 找 KBS，而是租一段 counter range，降低 control path 频率。", ["KBS 管 keys/counters。", "Lease range 可覆盖大量 writes。", "租约错误会影响 freshness，所以必须由 TEE/KBS policy 管。"], "Hazel Section 3.2; Figure 3.", flow("counter lease", ["TEE starts", "mutual attestation", "KBS leases counters", "Hazel uses range", "renew/revoke", "audit state"])),
          m("NVMe Metadata Encapsulation", "Hazel 利用 NVMe metadata 携带安全信息，不重写整个 NVMe-oF 协议。",
            ["Sector layout 放置 counter/MAC/metadata。", "DPU 在 data path 做 crypto/check。", "这降低协议改造成本，也保留高性能 storage path。"], "Hazel Figure 4.", matrix("sector layout", [["Data", "encrypted payload"], ["Counter/IV", "freshness input"], ["MAC/tag", "integrity"], ["Metadata", "NVMe extension"], ["DPU", "offload processing"]])),
          m("Hazel Merkle Tree", "HMT 用 in-memory IV cache、batch update 和 eventual consistency 降低 freshness 开销。", ["Tree 完全在磁盘上会造成不确定 latency。", "全树在内存中又浪费 DRAM。", "HMT 选择 cache/batch/EC，在性能和 freshness timing 间取舍。"], "Hazel Figure 5-Figure 7.", flow("HMT", ["write data", "update metadata cache", "batch tree updates", "eventual consistency", "read verifies freshness when needed"])),
          m("DPU Offload Boundary", "Hazel 借助 BlueField-3 降低 CPU overhead，但 DPU 自身 trust 需要额外证明。", ["论文讨论 TDISP/IDE 作为相关工作/未来 trust basis。", "当前 preprint 没把 DPU attestation 与 storage endpoint identity 全闭环。", "商业部署必须补 SPDM/TDISP/NVMe endpoint evidence。"], "Hazel related work and threat model; README boundary.", cards("deployment gaps", ["DPU attestation", "SPDM/TDISP", "NVMe-oF endpoint identity", "crash consistency", "KBS operations"]))
        ],
        evidenceEnv: s("实验环境与数据: NVMe-oF + BlueField-3 原型，synthetic、IO500、YCSB、ML training。",
          ["硬件: 高性能 PCIe SSD 与 NVIDIA BlueField-3 DPU。", "Benchmarks: synthetic read/write patterns、IO500、YCSB/RocksDB、ResNet50/UNet3D ML pipeline。", "指标: throughput、IOPS、latency、CPU usage、p99 latency。"], "Hazel implementation/evaluation Section 4-5; Figure 11-Figure 13.", matrix("实验设置", [["Storage", "NVMe-oF / SSD"], ["Offload", "BlueField-3"], ["Benchmarks", "synthetic/IO500/YCSB/ML"], ["Metrics", "throughput/latency/CPU"], ["Status", "preprint"]])),
        performance: s("性能结论: Hazel 在常见大读写/应用路径开销低，但小随机 freshness 路径仍是弱点。",
          ["Figure 11: IO500 overhead mostly below 10%，average 6.3%。", "Figure 12: YCSB p99 latency average 2.2%，throughput average 0.6%。", "Figure 13/文本: ML training freshness overhead 约 1%-2%；随机小 I/O freshness path 可显著变差。"], "Hazel Figure 11-Figure 13; evaluation text.", bars("key numbers", [{ label: "IO500 avg overhead", value: "6.3%", bar: 35 }, { label: "YCSB p99 latency avg", value: "2.2%", bar: 18 }, { label: "YCSB throughput avg", value: "0.6%", bar: 10 }, { label: "ML freshness overhead", value: "1%-2%", bar: 15 }])),
        evaluation: s("评价: Hazel 是 secure disaggregated storage 的强 draft SOTA，但必须标注 preprint 与 endpoint trust 缺口。",
          ["优势: 把 confidentiality/integrity/freshness/DPU offload 集成进一个 storage prototype。", "局限: preprint；DPU attestation、SPDM/TDISP、crash consistency 与 production KBS 运维仍需强化。", "商业化潜力: 云 confidential storage、NVMe-oF/JBOF、DPU offload；落地风险在小随机 I/O 和证据闭环。"], "Hazel conclusion and README evaluation.", matrix("评价", [["优势", "full storage data-path prototype"], ["局限", "preprint / endpoint gaps"], ["商业化", "confidential storage"], ["本方向角色", "storage-path SOTA"]]))
      }
    ]
  }
];
