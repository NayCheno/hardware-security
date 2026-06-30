# Presentation Outline

## Page 1 [cover]
- **Title**: 网络设备的Web服务安全研究
- **Subtitle**: 从污点源识别到漏洞验证的全链路技术演进
- **Other info**: 作者：罗夏朴 | 香港理工大学 电子计算学系 | 2025

## Page 2 [table_of_contents]
- **Title**: 目录
- **Chapter list**:
  1. 输入源点识别（Source）
  2. 复杂后端数据流（Propagation）
  3. 隐藏接口发现（Sink）
  4. 漏洞验证与PoC生成（Verification）

## Page 3 [content]
- **Title**: 研究背景与问题空间
- **Content**: 概述网络设备Web接口安全面临的核心挑战：入口识别难、数据流复杂、隐藏接口泛滥、漏洞验证困难。引入四个维度的技术演进脉络，作为全文框架。
- **Sources**: 罗夏朴，网络设备Web服务安全研究

## Page 4 [chapter]
- **Title**: 01 输入源点识别（Source）
- **Subtitle**: 从精确匹配到语义理解
- **Introduction**: 核心痛点：后端二进制中盲目寻找输入点会引入大量无效路径与误报。技术演进逻辑：从关键词精确匹配→模糊匹配→结构化建模+LLM。

## Page 5 [content]
- **Title**: SaTC — 前后端共享关键词的污点源识别
- **Content**: 基于PDF第4-14页。文章详情页上：内容摘要（首次提出利用前后端共享关键词定位后端输入点）、研究背景（IoT设备Web管理服务暴露、传统分析误报漏报严重）、解决方案（前端关键词提取→后端DRF定位→目标导向污点分析）。
- **Sources**: SaTC, USENIX Security 2021

## Page 6 [content]
- **Title**: SaTC — 实验结果与文章评价
- **Content**: 基于PDF第12-14页。文章详情页下：实验结果（39个固件发现33个0-day、命令注入20个+缓冲区溢出13个、关键词提取<10秒、污点分析20-30分钟/二进制）、与现有方法对比（首次实现前后端协同Source识别）、文章评价（优势：洞察简洁工程可落地；局限：Web依赖、前端混淆、隐藏接口漏报；商业化：推荐后续技术）。
- **Sources**: SaTC, USENIX Security 2021

## Page 7 [content]
- **Title**: HermeScan — 模糊匹配与轻量级数据流分析
- **Content**: 基于PDF第15-29页。文章详情页上：内容摘要（结合编辑距离/BERT语义相似度模糊Source匹配、跨库CFG恢复、LCO-RDA轻量级数据流分析）、研究背景（SaTC精确匹配漏报、符号执行路径爆炸、跨库CFG缺失）、解决方案（增强CFG恢复→模糊Source匹配→LCO跨过程分析→路径合并）。
- **Sources**: HermeScan, NDSS 2024

## Page 8 [content]
- **Title**: HermeScan — 实验结果与文章评价
- **Content**: 基于PDF第26-29页。文章详情页下：实验结果（30个固件发现163个漏洞TPR 81%、速度是SaTC的7.5倍、N-day数据集204个已知漏洞）、与现有方法对比（SaTC仅发现32个、KARONTE 0个）、文章评价（优势：系统补齐三类关键缺口；局限：RDA路径不敏感、BERT语义噪声；商业化：适合高速静态引擎）。
- **Sources**: HermeScan, NDSS 2024

## Page 9 [content]
- **Title**: LARA — URI-Key结构化与LLM语义分析
- **Content**: 基于PDF第30-42页。文章详情页上：内容摘要（融合URI-Key语义建模与LLM代码理解的Web输入源识别、相比SaTC URI/Key提取提升5.4/4.7倍）、研究背景（精确匹配遗漏隐藏Key、缺乏语义理解导致误报）、解决方案（模式匹配污点源识别→LLM辅助语义分析→复合交叉验证→多层包装Sink提取→键值敏感污点追踪）。
- **Sources**: LARA, USENIX Security 2024

## Page 10 [content]
- **Title**: LARA — 实验结果与文章评价
- **Content**: 基于PDF第40-42页。文章详情页下：实验结果（203款设备、URI/Key提升5.4/4.7倍、误报率降低57%、多发现556个漏洞含245个0-day、162个CVE）、与现有方法对比（SaTC多556个、KARONTE多602个）、文章评价（优势：推进到代码意图层；局限：LLM成本稳定性、反编译质量依赖；商业化：需提示词固化本地模型）。
- **Sources**: LARA, USENIX Security 2024

## Page 11 [content]
- **Title**: 维度一总结：Source识别技术演进
- **Content**: 基于PDF第43页。维度总结页：横向对比SaTC/HermeScan/LARA三篇论文的核心贡献、技术演进逻辑（从硬编码匹配→模糊匹配→LLM语义理解）、关键数据对比、局限性对比。
- **Sources**: 罗夏朴，网络设备Web服务安全研究

## Page 12 [chapter]
- **Title**: 02 复杂后端数据流（Propagation）
- **Subtitle**: 从单体分析到跨边界追踪
- **Introduction**: 核心痛点：即便定位输入点后，数据在后端往往不是被单一程序处理。现代固件高度解耦，数据流追踪面临规模爆炸与路径截断。技术演进：跨进程建模→跨语言架构→规模化反向分析→底层RDA优化。

## Page 13 [content]
- **Title**: KARONTE — 多二进制交互与BDG建模
- **Content**: 基于PDF第45-57页。文章详情页上：内容摘要（面向多二进制固件交互的跨进程数据流建模与漏洞检测、在53个固件发现46个0-day）、研究背景（IoT固件漏洞常跨多个二进制传播、单二进制分析无法覆盖IPC漏洞）、解决方案（边界二进制发现→通信范式查找器CPF→二进制依赖图BDG→多二进制静态污点分析→不安全交互检测）。
- **Sources**: KARONTE, IEEE S&P 2020

## Page 14 [content]
- **Title**: KARONTE — 实验结果与文章评价
- **Content**: 基于PDF第56-57页。文章详情页下：实验结果（53个固件发现46个0-day、平均告警从722个降至2个、警报总数降低两个数量级）、与现有方法对比（传统单二进制分析误报极高）、文章评价（优势：奠定多二进制IPC数据流抽象基础；局限：符号执行开销重、CPF覆盖不全图断裂；商业化：仅适合高价值样本离线分析）。
- **Sources**: KARONTE, IEEE S&P 2020

## Page 15 [content]
- **Title**: MangoDFA — Sink-to-Source与富表达式模型
- **Content**: 基于PDF第58-70页。文章详情页上：内容摘要（面向二进制固件服务的可扩展Sink-to-Source数据流分析、分析770,374个二进制发现10,834个TruPoCs）、研究背景（边界二进制过滤漏报、布尔污点模型过度污点化误报）、解决方案（富表达式混合值域→Sink-to-Source反向分析→Assumed Nonimpact策略→轻量级环境解析→TruPoCs机制）。
- **Sources**: MangoDFA, USENIX Security 2024

## Page 16 [content]
- **Title**: MangoDFA — 实验结果与文章评价
- **Content**: 基于PDF第68-70页。文章详情页下：实验结果（49个固件6,920个二进制946小时、大规模数据集770,374个二进制10,834个TruPoCs、平均38.12秒/二进制、TPR 57%）、与现有方法对比（SaTC 27倍二进制数量、边界过滤导致系统性漏报）、文章评价（优势：全固件覆盖+Sink-to-Source控制规模；局限：TruPoC≠真实PoC、复杂业务逻辑覆盖有限；商业化：适合云端批量扫描）。
- **Sources**: MangoDFA, USENIX Security 2024

## Page 17 [content]
- **Title**: OctopusTaint — RDA+AIL的污点回溯与净化检查
- **Content**: 基于PDF第71-81页。文章详情页上：内容摘要（结合增强RDA、净化检查与跨边界传播建模的固件污点分析、49个0-day验证、比SaTC快24%）、研究背景（动态符号执行性能瓶颈、盲目污点追踪高误报、间接调用与非标准源遗漏）、解决方案（AIL中间表示→Sink-to-Source逆向回溯→净化语义检查→NVRAM路径拼接→新污点源发现与间接调用解析）。
- **Sources**: OctopusTaint, ACM CCS 2024

## Page 18 [content]
- **Title**: OctopusTaint — 实验结果与文章评价
- **Content**: 基于PDF第80-81页。文章详情页下：实验结果（49个0-day、1,542个固件大规模数据集、比SaTC快24%、复杂间接调用场景召回率83% vs MangoDFA 16%）、与现有方法对比（同为RDA工具MangoDFA在复杂场景召回率仅16%）、文章评价（优势：误报来源处理细致；局限：依赖angr/AIL/DDG底层质量；商业化：适合高精度静态分析后端、大型设备厂商内部平台）。
- **Sources**: OctopusTaint, ACM CCS 2024

## Page 19 [content]
- **Title**: 维度二总结：Propagation技术演进
- **Content**: 基于PDF第93页。维度总结页：横向对比KARONTE/MangoDFA/OctopusTaint三篇论文的核心贡献、技术演进逻辑（从多二进制IPC建模→Sink-to-Source+富表达式→RDA+AIL底层优化）、关键数据对比、局限性对比。
- **Sources**: 罗夏朴，网络设备Web服务安全研究

## Page 20 [chapter]
- **Title**: 03 隐藏接口发现（Sink）
- **Subtitle**: 从盲测到智能推断
- **Introduction**: 核心痛点：IoT设备往往包含大量因历史遗留或调试所需的隐藏Web接口，无文档、无入口、无认证，成为重大安全隐患。技术演进：静态解析与盲测→路由分析与LLM推断→多语言接口规格恢复。

## Page 21 [content]
- **Title**: IoTScope — 静态枚举与黑盒验证隐藏接口
- **Content**: 基于PDF第95-106页。文章详情页上：内容摘要（面向IoT设备隐藏Web接口的静态枚举与黑盒验证框架、17台设备识别44个漏洞含43个未知）、研究背景（传统工具缺乏访问控制和隐藏接口检测能力、接口枚举困难、未保护接口识别困难、隐藏属性判定困难）、解决方案（接口枚举→双子请求探测→响应聚类过滤→配置修改/信息泄露判定）。
- **Sources**: IoTScope, WWW 2022

## Page 22 [content]
- **Title**: IoTScope — 实验结果与文章评价
- **Content**: 基于PDF第105-106页。文章详情页下：实验结果（11个厂商17款真实设备、44个漏洞20个配置+24个信息泄露、8个CVE、平均47分钟/设备处理6.2万请求）、与现有方法对比（首个黑盒验证隐藏接口技术）、文章评价（优势：首个黑盒验证确认未授权隐藏接口；局限：枚举偏暴力请求量大、覆盖URL型未授权接口；商业化：需严格授权隔离限速）。
- **Sources**: IoTScope, WWW 2022

## Page 23 [content]
- **Title**: EAGLEYE — 路由Token推断与LLM模式学习
- **Content**: 基于PDF第107-122页。文章详情页上：内容摘要（基于路由Token推断的IoT隐藏Web接口发现框架、13台设备发现79个隐藏接口是IoTScope的25倍）、研究背景（现有扫描器存在Frontend Bias、隐藏接口零引用前端、静态分析难以定义Source/Sink、Fuzzing缺乏目标）、解决方案（Token比对分析→LLM驱动模式学习→自校正循环→定向黑盒Fuzzing）。
- **Sources**: EAGLEYE, NDSS 2025

## Page 24 [content]
- **Title**: EAGLEYE — 实验结果与文章评价
- **Content**: 基于PDF第119-122页。文章详情页下：实验结果（13款设备79个隐藏接口27个绕过认证+52个认证后、零误报、是IoTScope的25倍、29个未知漏洞7个CVE）、与现有方法对比（IoTScope仅3个、覆盖Header/Body/认证后接口）、文章评价（优势：从URL枚举提升到routing token推断；局限：依赖公开请求和反编译上下文、LLM反馈闭环成本高；商业化：厂商内部排查）。
- **Sources**: EAGLEYE, NDSS 2025

## Page 25 [content]
- **Title**: PANGOLIN — 多语言接口规格恢复与语义Fuzzing
- **Content**: 基于PDF第123-132页。文章详情页上：内容摘要（LLM驱动代码语义分析的多语言IoT固件Fuzzing框架、12台设备发现68个未知漏洞是LABRADOR的2.96倍）、研究背景（多语言后端C/C++/Lua/Python混合、参数层级形式跨语言传递、仅发现路由Token不够）、解决方案（代码表示预处理→入口映射恢复→多语言调用图MCG→参数规格生成与校正→响应反馈驱动语义Fuzzing）。
- **Sources**: PANGOLIN, USENIX Security 2026

## Page 26 [content]
- **Title**: PANGOLIN — 实验结果与文章评价
- **Content**: 基于PDF第131-132页。文章详情页下：实验结果（12台设备2,856个后端接口1,793个未暴露、68个未知漏洞45个在隐藏接口、31个CVE编号、EAGLEYE仅4个）、与现有方法对比（隐藏接口漏洞EAGLEYE 4 vs PANGOLIN 45）、文章评价（优势：恢复参数规格和跨语言调用链；局限：依赖LLM设备响应、对无反馈设备失效；商业化：适合高端设备安全评估）。
- **Sources**: PANGOLIN, USENIX Security 2026

## Page 27 [content]
- **Title**: 维度三总结：Sink发现技术演进
- **Content**: 基于PDF第133页。维度总结页：横向对比IoTScope/EAGLEYE/PANGOLIN三篇论文的核心贡献、技术演进逻辑（从暴力枚举→智能token推断→接口规格恢复）、关键数据对比、局限性对比。
- **Sources**: 罗夏朴，网络设备Web服务安全研究

## Page 28 [chapter]
- **Title**: 04 漏洞验证与PoC生成（Verification）
- **Subtitle**: 从静态告警到动态闭环
- **Introduction**: 核心痛点：静态污点分析产生大量告警，黑盒Fuzzing缺乏内部覆盖率指导。如何高效验证漏洞并生成PoC？技术演进：约束语义不一致性分析→响应反馈导向Fuzzing→动静结合Agent自动利用→告警真实性验证。

## Page 29 [content]
- **Title**: NÜWA — 前后端约束语义不一致性分析
- **Content**: 基于PDF第135-145页。文章详情页上：内容摘要（基于前后端约束语义不一致性的嵌入式Web服务漏洞检测、13个厂商基准确认51个真实告警）、研究背景（传统Source-Sink可达性忽略安全校验导致高误报、单一维度分析失效）、解决方案（前端约束语义提取→后端函数摘要与切片→后端约束语义提取→不一致性静态分析）。
- **Sources**: NÜWA, USENIX Security 2025

## Page 30 [content]
- **Title**: NÜWA — 实验结果与文章评价
- **Content**: 基于PDF第144-145页。文章详情页下：实验结果（13个厂商31个已知漏洞基准、确认51个真实告警覆盖28个已知+12个关联、相比SaTC/LARA/Mango/OctopusTaint多发现18/6/17/19个、准确率76%、约束提取准确率95%/86%/85%）、文章评价（优势：从约束一致性角度解释漏洞；局限：约束提取不完整影响有效性；商业化：适合固件发布前安全检查）。
- **Sources**: NÜWA, USENIX Security 2025

## Page 31 [content]
- **Title**: LABRADOR — 响应反馈导向的黑盒定向Fuzzing
- **Content**: 基于PDF第146-157页。文章详情页上：内容摘要（基于响应反馈的黑盒IoT设备定向Fuzzing框架、14台设备发现79个0-day含61个CVE）、研究背景（真实设备无法插桩、黑盒Fuzzing缺少覆盖率和目标距离反馈）、解决方案（响应执行轨迹推断RTI→IO面向距离度量IODM→距离引导变异策略）。
- **Sources**: LABRADOR, IEEE S&P 2024

## Page 32 [content]
- **Title**: LABRADOR — 实验结果与文章评价
- **Content**: 基于PDF第156-157页。文章详情页下：实验结果（14台企业级设备79个0-day含61个CVE、是SNIPUZZ/BOOFUZZ的44倍、是SaTC的8.57倍）、与现有方法对比（静态分析缺乏隐式控制流信息、字符串匹配规则死板漏报）、文章评价（优势：响应字符串近似恢复黑盒执行轨迹；局限：依赖响应可匹配字符串、静默接口反馈质量下降；商业化：需稳定重启恢复机制）。
- **Sources**: LABRADOR, IEEE S&P 2024

## Page 33 [content]
- **Title**: FirmAgent — Fuzzing与LLM Agent的自动化PoC生成
- **Content**: 基于PDF第158-169页。文章详情页上：内容摘要（结合Fuzzing能力与LLM Agent语义推理的固件漏洞发现与PoC生成框架、14款固件确认182个真实漏洞精度91%）、研究背景（静态分析误报高缺少PoC、Fuzzing难覆盖深层Sink、单独LLM易分析不可达路径）、解决方案（Fuzzing驱动信息收集→污点追踪至PoC生成代理→反编译代码修复→语义追踪与告警验证→PoC生成）。
- **Sources**: FirmAgent, NDSS 2026

## Page 34 [content]
- **Title**: FirmAgent — 实验结果与文章评价
- **Content**: 基于PDF第168-169页。文章详情页下：实验结果（14款固件182个真实漏洞45个命令注入+137个缓冲区溢出、140个0-day、17个CVE、精度91%是HermeScan的33%的2.76倍、167个PoC 91.8%直接触发）、文章评价（优势：Fuzzing真实可达性+LLM语义推理结合；局限：依赖仿真QEMU插桩反编译LLM多重因素失败率高；商业化：适合厂商内部红队/安全实验室）。
- **Sources**: FirmAgent, NDSS 2026

## Page 35 [content]
- **Title**: 维度四总结：Verification技术演进
- **Content**: 基于PDF第197页。维度总结页：横向对比NÜWA/LABRADOR/FirmAgent三篇论文的核心贡献、技术演进逻辑（从约束一致性分析→响应反馈导向Fuzzing→Fuzzing+LLM闭环）、关键数据对比、局限性对比。
- **Sources**: 罗夏朴，网络设备Web服务安全研究

## Page 36 [content]
- **Title**: 防御策略：从漏洞发现到设备防护
- **Content**: 基于PDF第198-204页。四大防御维度：建立接口与参数资产清单、跨组件数据流建立安全边界、隐藏接口治理与认证、用约束一致性主动式发现漏洞。将漏洞验证能力前移到发布前。
- **Sources**: 罗夏朴，网络设备Web服务安全研究

## Page 37 [final]
- **Title**: 总结与展望
- **Core message**: 网络设备Web安全研究已形成从Source识别→Propagation追踪→Sink发现→Verification闭环的完整技术体系。未来方向：大模型驱动的自动化漏洞分析、多语言混合架构的通用化、真实设备上的高可信验证。
- **Other info**: 感谢聆听 | 罗夏朴 | 香港理工大学
