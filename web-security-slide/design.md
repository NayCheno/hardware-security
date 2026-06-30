# Design Document: 网络设备Web服务安全研究

## 1. Profile Baseline Declaration

- **Profile selection**: `profiles/academic.md`
- **Selection rationale**: 本PPT为学术研究综述报告，涵盖网络设备Web安全领域的前沿技术，面向学术/工业界研究人员，需要严谨、专业、信息密集的呈现方式。
- **Referenced dimensions**: 设计哲学（内容为王、严谨规范）、信息密度（高）、图文比例（以图表为主）、色彩指导（低饱和度、稳重）、字体指导（无衬线体）、内容页布局（导航栏+标题+内容区）、叙事风格（论证驱动）。
- **Deviation notes**: 
  - 无单一大学标识要求，故不采用大学主题色，而采用行业主题色调（深灰+暗红）。
  - 由于是综述报告而非单一论文答辩，需增加跨维度对比和演进脉络的可视化。
  - 每篇文章的5个方面（摘要/背景/方案/实验/评价）需要整合到2页中，而非单页。

## 2. Style Baseline Declaration

- **Style anchor selection**: 
  - **Nature/Science期刊图表风格**：参考其严谨的数据呈现、清晰的信息层级、克制的色彩使用。
  - **Swiss International Style**：参考其网格对齐、清晰的排版层级、信息驱动的设计理念。
- **Referenced dimension explanation**: 
  - 从Nature/Science参考：数据图表的配色、标注规范、信息密度控制。
  - 从Swiss Style参考：严格的网格对齐、字号层级对比、留白与信息密度的平衡。

## 3. Style Details

### Color Design Principles

- **Overall tendency**: 保守稳重偏中间，学术专业感，局部用强调色突出关键数据。
- **Temperature**: 偏冷中性，带一点暖色点缀。
- **Primary color**: `#1E293B`（深炭灰）——稳重、专业、不抢内容风头。
- **Background**: `#F8FAFC`（极浅灰蓝）——比纯白更有质感，不刺眼。
- **Text color**: `#0F172A`（近黑）——高对比度，确保可读性。
- **Secondary color**: `#64748B`（中灰蓝）——用于次要信息、辅助文字、分隔线。
- **Accent color**: `#A6192E`（暗红）——呼应网络安全/漏洞主题，仅用于关键数据、CVE编号、漏洞数量等核心发现。
- **Panel color**: `#FFFFFF`（纯白）——用于卡片背景，与页面背景形成微弱层次。
- **Soft fill**: `#F1F5F9`（浅灰蓝）——用于表格交替行、引用块背景。
- **Risk color**: `#DC2626`（红色）——用于漏洞标记等极少数场景。
- **Success color**: `#059669`（绿色）——用于防御措施、正面结论。

### Font Usage Principles

- **中文标题**: `MiSans` Bold，现代清晰，适合屏幕显示。
- **中文正文**: `MiSans` Regular，高可读性。
- **英文标题/正文**: `QuattrocentoSans`，经典优雅无衬线，学术气质。
- **字号层级**:
  - 封面标题: 40px
  - 页面标题: 28px
  - 副标题/模块标题: 22px
  - 正文: 18-20px（内容密集用18px，内容较少用20px）
  - 辅助文字/标注: 14px
  - 导航栏文字: 12px

### Text Box and Container Styles

- **内容分隔**: 优先使用留白和字号差异建立层级；适度使用卡片（圆角矩形，圆角半径8px）。
- **卡片样式**: 白色填充 `#FFFFFF`，无阴影，无边框或极细边框 `#E2E8F0`。
- **装饰元素**: 页面顶部使用2px主色横线作为导航分隔；章节页使用大号半透明数字作为背景装饰。
- **引用/强调块**: 左侧4px accent色竖线 + 浅灰背景 `#F1F5F9`。

### Image Style

- **Icons**: 使用outline风格图标（far），克制使用，仅在关键模块标题前使用。
- **Tables**: 三线表风格，主色表头，浅灰交替行，无纵向边框。
- **Charts**: 扁平化，主色系列用 `#1E293B` 和 `#64748B`，accent系列用 `#A6192E`，数据标签完整。
- **Illustrations**: 优先使用系统架构图、流程图、对比表格，避免纯装饰性图片。

## 4. Layout System

### Global Layout Characteristics

- **Page size**: 1280×720 (16:9)
- **Page margins**: 左右60px，上下50px。
- **统一页面元素**:
  - 顶部导航栏: 高度40px，位于页面顶部，深灰背景 `#1E293B`，包含4个维度标签，当前维度高亮（accent色底+白字）。
  - 页面标题区: 导航栏下方，y=50，标题左对齐。
  - 页脚: 右下角页码，左下角报告名称缩写。

### Special Page Layouts

- **Cover**: 左1/2深灰背景+标题/副标题/作者信息，右1/2网络安全主题图片+渐变遮罩。
- **Table of Contents**: 网格布局，4个维度作为4个等宽卡片，每个卡片含维度编号、标题、3篇文章名称。
- **Chapter Pages**: 左2/3深灰背景+大号章节编号（半透明）+章节标题+简介，右1/3图片。
- **Final Page**: 居中布局，核心结论+防御策略要点+致谢。

### Content Page Layout Patterns

- **Pattern A - 文章详情页（上）**: 顶部标题+论文标签，主体分三栏——左栏「内容摘要」+「研究背景」，中栏「解决方案」（核心洞察+系统架构），右栏「关键数据」卡片。
- **Pattern B - 文章详情页（下）**: 顶部标题+论文标签，主体分上下——上半「实验结果」（表格/图表对比），下半「文章评价」（优势/局限/商业化 三栏）。
- **Pattern C - 维度总结页**: 时间线/演进图，横向排列3篇文章，每篇一个卡片，对比核心贡献、关键数据、局限性。
- **Pattern D - 防御策略页**: 四栏布局，每个防御维度一个卡片，含关键措施和结论。

## 5. Style Usage Rules

### textStyles usage
- `title`: 页面标题（28px, 主色）。
- `subtitle`: 副标题/模块标题（22px, 次色）。
- `body`: 正文内容（18px, 文字色, 1.6行高）。
- `caption`: 辅助文字/标注（14px, 次色）。
- `nav`: 导航栏文字（12px, 白色/高亮）。
- `coverTitle`: 封面标题（40px, 白色）。
- `chapterNum`: 章节编号装饰（120px, 半透明白）。
- `kpi`: 关键数据数字（32px, accent色, Bold）。

### color allocation
- `$primary`: 标题、导航栏背景、重点强调。
- `$secondary`: 副标题、辅助文字、次要信息。
- `$accent`: 关键数据、CVE编号、漏洞数量、高亮标记。
- `$background`: 页面全局背景。
- `$text`: 正文文字。
- `$panel`: 卡片背景。
- `$soft`: 表格交替行、引用块背景。
- `$risk`: 极少数漏洞标记场景。
- `$success`: 防御措施、正面结论。

### tableStyles usage
- `default`: 学术论文三线表风格，主色表头，浅灰交替行。

## 6. Risk Prohibitions

- [ ] **禁止使用蓝紫渐变**：学术场景禁止高饱和渐变，保持纯色扁平。
- [ ] **禁止字号低于18px**：正文最小18px，确保投影可读性。
- [ ] **禁止纯装饰性图片**：所有图片/图表必须承载信息。
- [ ] **禁止标题过长**：页面标题不超过一行，副标题不超过两行。
- [ ] **禁止左右布局高度不齐**：左右分栏时，内容底部应对齐。
- [ ] **禁止导航栏不一致**：所有内容页导航栏位置和样式必须完全一致。
- [ ] **禁止accent色大面积使用**：accent色仅用于关键数据点缀，不超过页面面积5%。
- [ ] **禁止卡片过多阴影**：卡片使用纯色背景区分，禁止投影阴影。
- [ ] **禁止无标注的图表**：所有图表必须有标题、坐标轴、图例、单位。
- [ ] **禁止左右留白不均**：内容集中区域必须居中，禁止左满右空。

## 7. Theme Definition

```yaml
theme:
  colors:
    primary: "#1E293B"
    secondary: "#64748B"
    accent: "#A6192E"
    background: "#F8FAFC"
    text: "#0F172A"
    panel: "#FFFFFF"
    soft: "#F1F5F9"
    rule: "#E2E8F0"
    risk: "#DC2626"
    success: "#059669"
  textStyles:
    coverTitle:
      fontSize: 40
      color: "#FFFFFF"
      fontFamily: "QuattrocentoSans, MiSans"
      lineHeight: 1.2
    title:
      fontSize: 28
      color: "$primary"
      fontFamily: "QuattrocentoSans, MiSans"
      lineHeight: 1.3
    subtitle:
      fontSize: 22
      color: "$secondary"
      fontFamily: "QuattrocentoSans, MiSans"
      lineHeight: 1.3
    body:
      fontSize: 18
      color: "$text"
      fontFamily: "QuattrocentoSans, MiSans"
      lineHeight: 1.6
    caption:
      fontSize: 14
      color: "$secondary"
      fontFamily: "QuattrocentoSans, MiSans"
      lineHeight: 1.4
    nav:
      fontSize: 12
      color: "#FFFFFF"
      fontFamily: "QuattrocentoSans, MiSans"
      lineHeight: 1.2
    chapterNum:
      fontSize: 120
      color: "#FFFFFF20"
      fontFamily: "QuattrocentoSans, MiSans"
      lineHeight: 1.0
    kpi:
      fontSize: 32
      color: "$accent"
      fontFamily: "QuattrocentoSans, MiSans"
      lineHeight: 1.2
  tableStyles:
    default:
      fontSize: 16
      fontFamily: "QuattrocentoSans, MiSans"
      headerFill: "$primary"
      headerColor: "#FFFFFF"
      headerBold: true
      bodyFill: ["#FFFFFF", "$soft"]
      bodyColor: "$text"
      border:
        style: solid
        width: 1
        color: "$rule"
      headerBorder:
        style: solid
        width: 2
        color: "$primary"
      bodyBorder:
        style: none
        color: "#00000000"
      lastRowBorder:
        style: solid
        width: 2
        color: "$primary"
```
