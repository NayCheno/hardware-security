#!/usr/bin/env python3
"""
Generate all 33 .page files for CH07, CH08, CH09 of the hardware security survey PPT.
"""

import os

OUT_DIR = "/Users/nya/workspace/research/hardware-security/ppt_rebuild/pages"
os.makedirs(OUT_DIR, exist_ok=True)


def indent_text(text, indent="      "):
    """Indent all lines of text for YAML block scalar."""
    lines = text.splitlines()
    if not lines:
        return ""
    return "\n".join([indent + line for line in lines])


def make_text_element(eid, x, y, w, h, text, font_size=18, color="$text", font_family="Inter, MiSans",
                      line_height=1.5, align=None, wrap=None, bold=False):
    """Generate a text element YAML."""
    parts = []
    parts.append(f"- elementId: {eid}")
    parts.append(f"  elementType: text")
    parts.append(f"  bounds: [{x}, {y}, {w}, {h}]")
    parts.append(f"  content:")
    parts.append(f"    fontSize: {font_size}")
    parts.append(f"    color: {color}")
    parts.append(f"    fontFamily: {font_family}")
    if line_height is not None:
        parts.append(f"    lineHeight: {line_height}")
    if align is not None:
        parts.append(f"    align: {align}")
    if wrap is not None:
        parts.append(f"    wrap: {wrap}")
    parts.append(f"    text: |")
    
    text_content = text
    if bold and not text_content.startswith("<"):
        text_content = f"<p><strong>{text_content}</strong></p>"
    elif bold and text_content.startswith("<p>"):
        text_content = text_content.replace("<p>", "<p><strong>", 1).replace("</p>", "</strong></p>", 1)
    
    parts.append(indent_text(text_content, "      "))
    return "\n".join(parts)


def make_shape_element(eid, x, y, w, h, fill_color, shape="rect"):
    return f"""- elementId: {eid}
  elementType: shape
  bounds: [{x}, {y}, {w}, {h}]
  shapeName: {shape}
  fill:
    type: solid
    color: {fill_color}"""


def make_badge_element(eid_bg, eid_text, x, y, w, h, text, bg_color):
    shape_el = make_shape_element(eid_bg, x, y, w, h, bg_color)
    text_el = make_text_element(eid_text, x, y, w, h, text, font_size=12, color="#FFFFFF",
                                  align="[center, middle]", wrap=False, line_height=1.0)
    return shape_el + "\n" + text_el


def make_table_element(eid, x, y, w, h, col_widths, row_heights, rows, style="$default"):
    cw_str = ", ".join([f"{c:.4f}" for c in col_widths])
    rh_str = ", ".join([f"{r:.4f}" for r in row_heights])
    rows_yaml = []
    for row in rows:
        cells_yaml = []
        for cell in row:
            cells_yaml.append(f"- content: {{text: \"{cell}\"}}")
        rows_yaml.append("    -\n      " + "\n      ".join(cells_yaml))
    rows_yaml_joined = "\n".join(rows_yaml)
    return f"""- elementId: {eid}
  elementType: table
  bounds: [{x}, {y}, {w}, {h}]
  columnWidths: [{cw_str}]
  rowHeights: [{rh_str}]
  style: {style}
  rows:
{rows_yaml_joined}"""


def top_bar():
    return make_shape_element("top-bar", 0, 0, 1280, 6, "$primary")


def bottom_bar():
    return make_shape_element("bottom-bar", 0, 714, 1280, 6, "$primary")


def source_line(text):
    return make_text_element("source", 60, 690, 1160, 20, text, font_size=14, color="$secondary", line_height=1.2)


def direction_badge(ch_label):
    return make_badge_element("badge-bg", "badge-text", 60, 12, 120, 20, ch_label, "$primary")


def evidence_badge(ev_text):
    return make_badge_element("ev-badge-bg", "ev-badge-text", 1080, 38, 140, 20, ev_text, "$accent")


def title_line(y=80):
    return make_shape_element("title-line", 60, y, 120, 3, "$primary")


def build_page(page_type, elements, notes=""):
    notes_str = f"\nnotes: {notes}" if notes else ""
    return f"""pageType: {page_type}
background:
  type: solid
  color: "#FFFFFF"{notes_str}
elements:
{chr(10).join(elements)}
"""


# =============================================================================
# CH07 Data
# =============================================================================

CH07 = {
    "direction": "RISC-V 基础安全 primitives",
    "subtitle": "从标准规范到安全 substrate 的技术演进",
    "intro": "把 PMP/ePMP/Smepmp、IOMMU、IOPMP、AIA、CFI 等 substrate 与 TEE 本体区分开。先用三篇主讲材料建立演进关系，再用证据等级控制每个结论。",
    "papers": [
        ("RISC-V privileged architecture", "开创/基础入口", "E0 / 基础证据 standard substrate"),
        ("RISC-V IOMMU", "代表性改进", "E0 / Spec-standard SOTA"),
        ("RISC-V Advanced Interrupt Architecture", "当前 SOTA/补充边界", "E0 / Spec-standard SOTA"),
    ],
    "p1": {
        "paper": "RISC-V privileged architecture",
        "summary_claim": "定义 RISC-V privilege modes、PMP、virtualization、trap/translation 和相关保护基础",
        "summary_narr": "RISC-V privileged ISA defines PMP, traps, modes, and paging substrate for RISC-V TEEs。",
        "background": "RISC-V 安全系统需要从标准 privilege/translation/memory-control 机制出发，TEE 论文不能跳过底层隔离语义。",
        "solution": "通过 M/S/U/HS/VS modes、PMP/ePMP/Smepmp、trap/translation 机制组合隔离 substrate。这些机制共同构成 RISC-V TEE 的底层安全底座。",
        "experiments": "规范/Survey，无新实验。RISC-V privileged architecture 只支撑术语、taxonomy、接口语义或证据边界。涉及具体平台、协议状态或数值时，转到原始论文或厂商材料核验。",
        "evidence": "E0 / 基础证据",
        "evidence_full": "E0 / 基础证据 standard substrate",
        "source": "来源：RISC-V privileged architecture｜证据等级：E0 / Foundational standard substrate",
        "eval": {
            "设计优势": "所有 RISC-V TEE、CoVE、AP-TEE 讨论的共同底座。",
            "主要局限": "不是 confidential VM 或 enclave 的完整方案，也不覆盖设备 I/O 隔离。",
            "商业落地": "商业价值在于开放生态共识；风险在厂商实现差异和扩展组合复杂度。",
            "讲稿定位": "开创/基础入口；证据强度 E0",
        }
    },
    "p2": {
        "paper": "RISC-V IOMMU",
        "summary_claim": "定义 RISC-V I/O translation/protection 架构，用于约束设备地址转换和访问权限",
        "summary_narr": "RISC-V IOMMU specification is the current standard substrate for DMA isolation and CoVE-IO。",
        "background": "DMA 和总线 master 可绕过 CPU-side PMP/页表。TEE 或 CoVE-IO 需要 I/O 侧地址转换和权限控制。",
        "solution": "IOMMU 把设备发起的访问纳入可配置 translation/protection 边界。提供 I/O page-table 和 permission semantics，是 CoVE-IO 的标准 substrate。",
        "experiments": "规范/Survey，无新实验。RISC-V IOMMU 只支撑术语、taxonomy、接口语义或证据边界。涉及具体平台、协议状态或数值时，转到原始论文或厂商材料核验。",
        "evidence": "E0 / Spec-standard",
        "evidence_full": "E0 / Spec-standard SOTA",
        "source": "来源：RISC-V IOMMU｜证据等级：E0 / Spec-standard SOTA",
        "eval": {
            "设计优势": "是 RISC-V confidential I/O 和 DMA 隔离讨论的标准 substrate。",
            "主要局限": "IOMMU 自身不是 TEE，也不覆盖设备身份、attestation 或 interrupt ownership。",
            "商业落地": "对服务器和异构设备直通很关键；风险在设备生态、固件配置和 verifier 无法直接观察配置完整性。",
            "讲稿定位": "代表性改进；证据强度 E0",
        }
    },
    "p3": {
        "paper": "RISC-V Advanced Interrupt Architecture",
        "summary_claim": "定义 interrupt、MSI、virtual interrupt 等基础，为 trusted interrupt delivery 和 confidential I/O 提供标准语义",
        "summary_narr": "RISC-V AIA specification is the current interrupt virtualization and ownership substrate。",
        "background": "Confidential I/O 不只需要 DMA 隔离，也需要可信 interrupt/MSI delivery。runtime CFI 则是独立的控制流防护 substrate。",
        "solution": "AIA 规范化 interrupt controller 与 MSI/virtual interrupt，为 confidential I/O 提供 trusted interrupt-delivery substrate。",
        "experiments": "规范/Survey，无新实验。RISC-V Advanced Interrupt Architecture 只支撑术语、taxonomy、接口语义或证据边界。涉及具体平台、协议状态或数值时，转到原始论文或厂商材料核验。",
        "evidence": "E0 / Spec-standard",
        "evidence_full": "E0 / Spec-standard SOTA",
        "source": "来源：RISC-V Advanced Interrupt Architecture｜证据等级：E0 / Spec-standard SOTA",
        "eval": {
            "设计优势": "为 trusted MSI、interrupt ownership 和虚拟化中断路径提供标准词汇。",
            "主要局限": "不定义完整 confidential I/O protocol，也不证明实现侧中断隔离正确。",
            "商业落地": "对直通设备和 SmartNIC/DPU 中断路径有基础价值；风险在平台实现、IOMMU/IOPMP 组合和审计可见性。",
            "讲稿定位": "当前 SOTA/补充边界；证据强度 E0",
        }
    },
}


# =============================================================================
# CH08 Data
# =============================================================================

CH08 = {
    "direction": "RISC-V TEE lineage",
    "subtitle": "Sanctum / Keystone / Penglai / SPEAR-V 技术演进",
    "intro": "从 PMP-based enclave 到 scalable memory protection，再到 tag/metadata primitive。固定三篇主讲材料，直接呈现 RISC-V enclave lineage 演进。",
    "papers": [
        ("Keystone: 开源 RISC-V TEE 框架", "开创/基础入口", "E1 / 基础证据"),
        ("Penglai: scalable enclave memory protection", "代表性改进", "E1 / 同行评审改进证据"),
        ("SPEAR-V: low-overhead RISC-V enclave primitive", "当前 SOTA/补充边界", "E1 / 同行评审改进证据"),
    ],
    "p1": {
        "paper": "Keystone: 开源 RISC-V TEE 框架",
        "summary_claim": "开源 RISC-V TEE 框架，用 PMP、security monitor 和 runtime abstraction 构建 enclave",
        "summary_narr": "EuroSys 2020 Keystone is the foundational public RISC-V open-source TEE framework paper。",
        "background": "商业 TEE 难定制、难验证。RISC-V 提供开放硬件/软件协同机会，需要可研究、可裁剪的 enclave baseline。",
        "solution": "把 PMP region、security monitor、runtime 和 host ABI 组合成可扩展的开源 TEE 框架。实现 PMP-based enclave isolation 和软件/硬件协同设计。",
        "experiments": "论文报告 CoreMark/Beebs/RV8 等开销结果。具体数值需核对原文 Table/Figure 后写入。",
        "evidence": "E1 / 基础证据",
        "evidence_full": "E1 / 基础证据",
        "source": "来源：Keystone: 开源 RISC-V TEE 框架｜证据等级：E1 / Foundational",
        "eval": {
            "设计优势": "RISC-V TEE baseline，适合解释 PMP-based enclave 的优势和限制。",
            "主要局限": "EuroSys 2020 foundational evidence，不代表后续标准化 confidential VM 或生产 enclave。",
            "商业落地": "开源可定制性强；风险在 PMP region 限制、生态成熟度和安全 monitor 正确性。",
            "讲稿定位": "开创/基础入口；证据强度 E1",
        }
    },
    "p2": {
        "paper": "Penglai: scalable enclave memory protection",
        "summary_claim": "面向大规模 enclave 的 scalable memory protection，回应 serverless/microservice 对大量动态 enclave 的需求",
        "summary_narr": "OSDI 2021 Penglai is a peer-reviewed SOTA scalable RISC-V enclave OS after Keystone。",
        "background": "传统 PMP region 数量有限，难以支撑大量 enclave、动态生命周期和更大的受保护内存。",
        "solution": "引入更可扩展的内存保护和 metadata 管理机制，把 RISC-V enclave 从少量静态隔离推进到云端规模化。",
        "experiments": "OSDI 论文报告可支持大量 enclave 和较大安全内存。具体指标需核对原文 Table/Figure 后写入。",
        "evidence": "E1 / 同行评审",
        "evidence_full": "E1 / 同行评审改进证据",
        "source": "来源：Penglai: scalable enclave memory protection｜证据等级：E1 / Peer-reviewed SOTA",
        "eval": {
            "设计优势": "系统贡献强，直接解决 PMP-based enclave 在规模上的瓶颈。",
            "主要局限": "需要硬件修改和生态配套，不等同于 RISC-V ratified confidential-computing standard。",
            "商业落地": "适合云原生 enclave 服务方向；风险在硬件采纳、标准化和云平台管理接口。",
            "讲稿定位": "代表性改进；证据强度 E1",
        }
    },
    "p3": {
        "paper": "SPEAR-V: low-overhead RISC-V enclave primitive",
        "summary_claim": "提出低开销、实用的 RISC-V enclave primitive，用 tag/metadata primitive 支持双向 sandbox 和嵌套隔离",
        "summary_narr": "SPEAR-V is a peer-reviewed SOTA RISC-V TEE system with SoC and remote-attestation focus。",
        "background": "RISC-V enclave 需要更灵活、低开销、可抵抗部分 controlled-channel 风险的硬件 primitive。",
        "solution": "用 tag/metadata primitive 替代仅靠 PMP region 的隔离表达，支持更细粒度的 protected/unprotected 交互。",
        "experiments": "AsiaCCS 论文报告 protected/unprotected 场景低开销。具体数值需核对原文 Table/Figure 后写入。",
        "evidence": "E1 / 同行评审",
        "evidence_full": "E1 / 同行评审改进证据",
        "source": "来源：SPEAR-V: low-overhead RISC-V enclave primitive｜证据等级：E1 / Peer-reviewed SOTA",
        "eval": {
            "设计优势": "机制设计清晰，展示 RISC-V enclave primitive 可沿 tag/metadata 路线演进。",
            "主要局限": "Peer-reviewed 系统证据不等同于 RISC-V 标准或量产硬件采纳。",
            "商业落地": "若硬件供应商采纳，适合细粒度隔离和嵌入式/边缘 TEE；风险在 ISA 扩展标准化和工具链支持。",
            "讲稿定位": "当前 SOTA/补充边界；证据强度 E1",
        }
    },
}


# =============================================================================
# CH09 Data
# =============================================================================

CH09 = {
    "direction": "RISC-V CoVE / AP-TEE confidential VM",
    "subtitle": "从 enclave 到 confidential VM 的架构演进",
    "intro": "把 pre-CoVE enclave 与 AP-TEE/CoVE TVM lifecycle 区分开。survey 只作为 background substrate，不替代 CoVE/AP-TEE 机制证据。",
    "papers": [
        ("RISC-V CoVE reference architecture", "开创/基础入口", "E3 / 基础证据 public preprint"),
        ("RISC-V AP-TEE / CoVE TVM 规范草案", "代表性改进", "E3 / 草案/未批准规范"),
        ("RISC-V TEE 谱系辅助材料", "当前 SOTA/补充边界", "E2 survey / Background substrate"),
    ],
    "p1": {
        "paper": "RISC-V CoVE reference architecture",
        "summary_claim": "提出 RISC-V CoVE confidential computing 参考架构方向，明确 confidential VM 需要的 ISA、non-ISA、SoC 与 platform requirements",
        "summary_narr": "CoVE 2023 is the early mainline design material for RISC-V confidential VMs。",
        "background": "多租户 confidential VM 需要降低 tenant 对 host/hypervisor 的信任，并区别于单进程 enclave lineage。",
        "solution": "用 CoVE reference architecture 描述 TVM 所需的硬件、固件、hypervisor 和 platform support。明确 ISA/non-ISA/SoC/platform requirement split。",
        "experiments": "架构论文/position-style，无完整系统实验。具体 ABI/state details 需要 AP-TEE draft 补充。",
        "evidence": "E3 / 基础证据",
        "evidence_full": "E3 / 基础证据 public preprint",
        "source": "来源：RISC-V CoVE reference architecture｜证据等级：E3 / Foundational public preprint",
        "eval": {
            "设计优势": "CoVE confidential VM 入口材料，能把 RISC-V 从 enclave lineage 推向 TVM 模型。",
            "主要局限": "不提供完整 ABI、状态机或 ratified standard 语义。",
            "商业落地": "对开放 confidential VM 生态有方向价值；风险在标准未定、平台支持和 verifier ecosystem。",
            "讲稿定位": "开创/基础入口；证据强度 E3",
        }
    },
    "p2": {
        "paper": "RISC-V AP-TEE / CoVE TVM 规范草案",
        "summary_claim": "定义 RISC-V AP-TEE/CoVE TVM lifecycle 和 SBI ABI，包括 TVM、TSM、COVH/COVG 与 memory lifecycle",
        "summary_narr": "AP-TEE draft is the current standards-track source for RISC-V confidential VM semantics。",
        "background": "CoVE 需要标准化 TVM、TSM、memory lifecycle、attestation 和 host/guest 调用界面，才能与 Arm CCA/RMM 同层比较。",
        "solution": "给出 TSM、TSM-driver、Supervisor Domains、COVH/COVG、memory donation/reclaim/share 等 draft 规范语义。",
        "experiments": "规范/Survey，无新实验。RISC-V AP-TEE / CoVE TVM 规范草案只支撑术语、taxonomy、接口语义或证据边界。",
        "evidence": "E3 / 草案",
        "evidence_full": "E3 / 草案/未批准规范",
        "source": "来源：RISC-V AP-TEE / CoVE TVM 规范草案｜证据等级：E3 / Draft-not-ratified",
        "eval": {
            "设计优势": "当前最关键的 RISC-V CCA 对照材料，直接定义 TVM/TSM lifecycle。",
            "主要局限": "v0.7 RC2 仍是 draft，状态机和 ABI 可能变化。",
            "商业落地": "商业潜力在开放 confidential VM stack；风险在标准收敛、firmware/OS support 和兼容迁移。",
            "讲稿定位": "代表性改进；证据强度 E3",
        }
    },
    "p3": {
        "paper": "RISC-V TEE 谱系辅助材料",
        "summary_claim": "把 pre-CoVE enclave 与 CoVE 放入 RISC-V TEE 谱系，辅助区分 enclave architecture、trusted monitor/runtime 和 confidential VM",
        "summary_narr": "Recent RISC-V TEE survey cross-checks the CoVE and AP-TEE lineage against older enclave work。",
        "background": "RISC-V TEE 论文和规范发展快，survey 可减少分类断裂。即使本地 PDF 已核验，机制细节仍要回到原始论文/spec。",
        "solution": "按 secure enclave、TEE mechanism、memory/I/O/attestation support 分类。机制 claim 必须回引 CoVE paper 和 AP-TEE spec。",
        "experiments": "规范/Survey，无新实验。RISC-V TEE 谱系辅助材料只支撑术语、taxonomy、接口语义或证据边界。",
        "evidence": "E2 survey",
        "evidence_full": "E2 survey / Background",
        "source": "来源：RISC-V TEE 谱系辅助材料｜证据等级：E2 survey / Background substrate",
        "eval": {
            "设计优势": "有助于横向定位 Keystone/Penglai/SPEAR-V 与 CoVE/AP-TEE。",
            "主要局限": "Survey 不能替代原始机制论文或官方规范，尤其不能承载性能或安全证明细节。",
            "商业落地": "适合产品路线图分类；风险在 survey 分类滞后和不同 threat model 被误合并。",
            "讲稿定位": "当前 SOTA/补充边界；证据强度 E2 survey",
        }
    },
}


# =============================================================================
# Page generators
# =============================================================================

def generate_intro_page(ch, data):
    bullet_items = "\n".join([f"<li>{p[0]} — {p[1]}（{p[2]}）</li>" for p in data["papers"]])
    text = f"<ul>\n{bullet_items}\n</ul>"
    elements = [
        top_bar(),
        make_shape_element("left-bar", 60, 120, 4, 80, "$primary"),
        make_text_element("title", 80, 110, 1100, 50, f"方向{ch}：{data['direction']}", font_size=36, color="$primary", bold=True),
        make_text_element("subtitle", 80, 160, 1100, 35, data["subtitle"], font_size=24, color="$secondary"),
        make_text_element("intro", 80, 220, 1100, 70, data["intro"], font_size=18, color="$text", line_height=1.5),
        make_text_element("papers", 80, 300, 1100, 300, text, font_size=18, color="$text", line_height=1.6),
        bottom_bar(),
    ]
    return build_page("chapter", elements)


def generate_summary_page(ch, pnum, data, pdata):
    body = f"<p><strong>核心贡献：</strong>{pdata['summary_claim']}</p>\n<p>{pdata['summary_narr']}</p>\n<p><strong>论文定位：</strong>{pdata['evidence_full']}</p>"
    elements = [
        top_bar(),
        direction_badge(f"CH{ch}"),
        make_text_element("title", 60, 38, 1000, 40, f"{pdata['paper']} — 内容摘要", font_size=32, color="$primary", bold=True),
        title_line(y=80),
        evidence_badge(pdata["evidence"]),
        make_text_element("body", 60, 95, 1160, 555, body, font_size=18, color="$text", line_height=1.5),
        source_line(pdata["source"]),
        bottom_bar(),
    ]
    return build_page("content", elements)


def generate_bg_sol_page(ch, pnum, data, pdata):
    bg_text = f"<p>{pdata['background']}</p>"
    sol_text = f"<p>{pdata['solution']}</p>"
    elements = [
        top_bar(),
        direction_badge(f"CH{ch}"),
        make_text_element("bg-title", 60, 40, 300, 35, "研究背景", font_size=24, color="$primary", bold=True),
        make_text_element("bg-body", 60, 80, 1160, 230, bg_text, font_size=18, color="$text", line_height=1.5),
        make_shape_element("sep-line", 60, 330, 1160, 1, "$border"),
        make_text_element("sol-title", 60, 350, 300, 35, "解决方案", font_size=24, color="$primary", bold=True),
        make_text_element("sol-body", 60, 390, 1160, 260, sol_text, font_size=18, color="$text", line_height=1.5),
        source_line(pdata["source"]),
        bottom_bar(),
    ]
    return build_page("content", elements)


def generate_exp_eval_page(ch, pnum, data, pdata):
    exp_text = f"<p>{pdata['experiments']}</p>"
    eval_rows = [
        ["维度", "判断"],
        ["设计优势", pdata["eval"]["设计优势"]],
        ["主要局限", pdata["eval"]["主要局限"]],
        ["商业落地", pdata["eval"]["商业落地"]],
        ["讲稿定位", pdata["eval"]["讲稿定位"]],
    ]
    elements = [
        top_bar(),
        direction_badge(f"CH{ch}"),
        make_text_element("exp-title", 60, 40, 300, 35, "实验结果", font_size=24, color="$primary", bold=True),
        make_text_element("exp-body", 60, 80, 1160, 230, exp_text, font_size=18, color="$text", line_height=1.5),
        make_text_element("eval-title", 60, 330, 300, 35, "文章评价", font_size=24, color="$primary", bold=True),
        make_table_element("eval-table", 60, 370, 1160, 280, [0.2, 0.8], [0.2]*5, eval_rows, style="$default"),
        source_line(pdata["source"]),
        bottom_bar(),
    ]
    return build_page("content", elements)


def generate_summary_dir_page(ch, data):
    rows = [["论文", "核心思想", "主要局限", "证据等级"]]
    for p in data["papers"]:
        paper_name = p[0]
        if paper_name == "RISC-V privileged architecture":
            core = "定义 privilege modes、PMP、virtualization 基础"
            limit = "不是 confidential VM 或 enclave 完整方案"
            ev = "E0 / 基础证据"
        elif paper_name == "RISC-V IOMMU":
            core = "定义 I/O translation/protection 架构"
            limit = "不覆盖设备身份、attestation 或 interrupt"
            ev = "E0 / Spec-standard"
        elif paper_name == "RISC-V Advanced Interrupt Architecture":
            core = "定义 interrupt、MSI、virtual interrupt 基础"
            limit = "不定义完整 confidential I/O protocol"
            ev = "E0 / Spec-standard"
        elif paper_name == "Keystone: 开源 RISC-V TEE 框架":
            core = "PMP + security monitor + runtime 构建 enclave"
            limit = "不代表后续标准化 confidential VM"
            ev = "E1 / 基础证据"
        elif paper_name == "Penglai: scalable enclave memory protection":
            core = "可扩展内存保护应对大规模 enclave"
            limit = "需要硬件修改和生态配套"
            ev = "E1 / 同行评审"
        elif paper_name == "SPEAR-V: low-overhead RISC-V enclave primitive":
            core = "tag/metadata primitive 支持双向 sandbox"
            limit = "不等同于 RISC-V 标准或量产硬件"
            ev = "E1 / 同行评审"
        elif paper_name == "RISC-V CoVE reference architecture":
            core = "CoVE confidential computing 参考架构方向"
            limit = "不提供完整 ABI、状态机或 ratified standard"
            ev = "E3 / 基础证据"
        elif paper_name == "RISC-V AP-TEE / CoVE TVM 规范草案":
            core = "定义 TVM lifecycle 和 SBI ABI"
            limit = "v0.7 RC2 仍是 draft，可能变化"
            ev = "E3 / 草案"
        elif paper_name == "RISC-V TEE 谱系辅助材料":
            core = "pre-CoVE enclave 与 CoVE 谱系分类"
            limit = "不能替代原始机制论文或官方规范"
            ev = "E2 survey"
        else:
            core = ""
            limit = ""
            ev = ""
        rows.append([paper_name, core, limit, ev])

    elements = [
        top_bar(),
        make_text_element("title", 60, 30, 500, 35, "方向总结", font_size=32, color="$primary", bold=True),
        title_line(y=68),
        make_table_element("summary-table", 60, 90, 1160, 570, [0.25, 0.30, 0.30, 0.15], [0.2]*5, rows, style="$default"),
        source_line("来源：三篇主讲材料选择、评价字段与 evidence ledger｜证据等级：方向综述"),
        bottom_bar(),
    ]
    return build_page("content", elements)


# =============================================================================
# Main generation
# =============================================================================

pages_to_generate = []

# CH07
pages_to_generate.append(("ch07_intro.page", generate_intro_page("07", CH07)))
pages_to_generate.append(("ch07_p1_summary.page", generate_summary_page("07", 1, CH07, CH07["p1"])))
pages_to_generate.append(("ch07_p1_bg_sol.page", generate_bg_sol_page("07", 1, CH07, CH07["p1"])))
pages_to_generate.append(("ch07_p1_exp_eval.page", generate_exp_eval_page("07", 1, CH07, CH07["p1"])))
pages_to_generate.append(("ch07_p2_summary.page", generate_summary_page("07", 2, CH07, CH07["p2"])))
pages_to_generate.append(("ch07_p2_bg_sol.page", generate_bg_sol_page("07", 2, CH07, CH07["p2"])))
pages_to_generate.append(("ch07_p2_exp_eval.page", generate_exp_eval_page("07", 2, CH07, CH07["p2"])))
pages_to_generate.append(("ch07_p3_summary.page", generate_summary_page("07", 3, CH07, CH07["p3"])))
pages_to_generate.append(("ch07_p3_bg_sol.page", generate_bg_sol_page("07", 3, CH07, CH07["p3"])))
pages_to_generate.append(("ch07_p3_exp_eval.page", generate_exp_eval_page("07", 3, CH07, CH07["p3"])))
pages_to_generate.append(("ch07_summary.page", generate_summary_dir_page("07", CH07)))

# CH08
pages_to_generate.append(("ch08_intro.page", generate_intro_page("08", CH08)))
pages_to_generate.append(("ch08_p1_summary.page", generate_summary_page("08", 1, CH08, CH08["p1"])))
pages_to_generate.append(("ch08_p1_bg_sol.page", generate_bg_sol_page("08", 1, CH08, CH08["p1"])))
pages_to_generate.append(("ch08_p1_exp_eval.page", generate_exp_eval_page("08", 1, CH08, CH08["p1"])))
pages_to_generate.append(("ch08_p2_summary.page", generate_summary_page("08", 2, CH08, CH08["p2"])))
pages_to_generate.append(("ch08_p2_bg_sol.page", generate_bg_sol_page("08", 2, CH08, CH08["p2"])))
pages_to_generate.append(("ch08_p2_exp_eval.page", generate_exp_eval_page("08", 2, CH08, CH08["p2"])))
pages_to_generate.append(("ch08_p3_summary.page", generate_summary_page("08", 3, CH08, CH08["p3"])))
pages_to_generate.append(("ch08_p3_bg_sol.page", generate_bg_sol_page("08", 3, CH08, CH08["p3"])))
pages_to_generate.append(("ch08_p3_exp_eval.page", generate_exp_eval_page("08", 3, CH08, CH08["p3"])))
pages_to_generate.append(("ch08_summary.page", generate_summary_dir_page("08", CH08)))

# CH09
pages_to_generate.append(("ch09_intro.page", generate_intro_page("09", CH09)))
pages_to_generate.append(("ch09_p1_summary.page", generate_summary_page("09", 1, CH09, CH09["p1"])))
pages_to_generate.append(("ch09_p1_bg_sol.page", generate_bg_sol_page("09", 1, CH09, CH09["p1"])))
pages_to_generate.append(("ch09_p1_exp_eval.page", generate_exp_eval_page("09", 1, CH09, CH09["p1"])))
pages_to_generate.append(("ch09_p2_summary.page", generate_summary_page("09", 2, CH09, CH09["p2"])))
pages_to_generate.append(("ch09_p2_bg_sol.page", generate_bg_sol_page("09", 2, CH09, CH09["p2"])))
pages_to_generate.append(("ch09_p2_exp_eval.page", generate_exp_eval_page("09", 2, CH09, CH09["p2"])))
pages_to_generate.append(("ch09_p3_summary.page", generate_summary_page("09", 3, CH09, CH09["p3"])))
pages_to_generate.append(("ch09_p3_bg_sol.page", generate_bg_sol_page("09", 3, CH09, CH09["p3"])))
pages_to_generate.append(("ch09_p3_exp_eval.page", generate_exp_eval_page("09", 3, CH09, CH09["p3"])))
pages_to_generate.append(("ch09_summary.page", generate_summary_dir_page("09", CH09)))

for filename, content in pages_to_generate:
    filepath = os.path.join(OUT_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Generated: {filepath}")

print(f"\nTotal: {len(pages_to_generate)} files generated.")
