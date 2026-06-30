from __future__ import annotations

from pathlib import Path
from typing import Any

from content_lib import (
    SLIDE_KEYS,
    SLIDE_ROOT,
    as_text,
    direction_dirs,
    latex_escape,
    latex_itemize,
    load_deck,
    load_yaml,
    migrate_direction,
)


SLIDE_LABELS = {
    "summary": "内容摘要",
    "background": "研究背景",
    "solution": "解决方案",
    "experiments": "实验结果",
    "evaluation": "文章评价",
}

PAPER_TYPE_LABELS = {
    "system": "系统论文",
    "spec": "规范/标准材料",
    "sok": "SoK/综述",
    "survey": "Survey/综述",
    "vendor": "厂商白皮书",
    "whitepaper": "厂商白皮书",
    "benchmark": "Benchmark",
}

SOURCE_STATUS_LABELS = {
    "local_pdf_verified": "本地 PDF 已核验",
    "author_hosted_eurosys_pdf_verified": "作者公开 PDF 已核验",
    "source_verified_pdf_unavailable": "公开来源已核验，PDF 暂缺",
}

PUBLIC_TEXT_REWRITES = {
    "local_pdf_verified": "本地 PDF 已核验",
    "author_hosted_eurosys_pdf_verified": "作者公开 PDF 已核验",
    "source_verified_pdf_unavailable": "公开来源已核验，PDF 暂缺",
    "source status": "来源状态",
    "source-status": "来源状态",
    "source_status": "来源状态",
    "paper type": "材料类型",
    "claim strength": "证据强度",
    "primary slot": "主讲定位",
    "selection slot": "主讲定位",
    "Primary 1": "基础入口",
    "Primary 2": "代表性改进",
    "Primary 3": "当前边界",
    "primary": "主讲材料",
    "Foundational industry evidence": "基础产业证据",
    "Peer-reviewed SOTA": "同行评审改进证据",
    "Foundational": "基础证据",
    "Draft-not-ratified": "草案/未批准规范",
}


def write(path: Path, content: str) -> None:
    path.write_text(content.rstrip() + "\n", encoding="utf-8")


def compact_title(value: Any, limit: int = 46) -> str:
    text = as_text(value)
    for prefix in ("SoK: ", "A Survey of ", "The ", "Towards "):
        if text.startswith(prefix):
            text = text[len(prefix) :]
    return text if len(text) <= limit else text[: limit - 1].rstrip(" ,;；，") + "…"


def source_status_label(value: Any) -> str:
    text = as_text(value)
    return SOURCE_STATUS_LABELS.get(text, text or "来源状态未标注")


def public_text(value: Any) -> str:
    text = as_text(value)
    for old, new in PUBLIC_TEXT_REWRITES.items():
        text = text.replace(old, new)
    return text


def evidence_label(value: Any) -> str:
    text = public_text(value)
    replacements = {
        "E1 primary systems": "E1 系统论文",
        "peer-reviewed primary": "同行评审系统论文",
        "Peer-reviewed primary": "同行评审系统论文",
        "Primary": "主讲材料",
        "primary": "主讲材料",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


def source_note_for_display(value: Any) -> str:
    text = public_text(value)
    internal_terms = (
        "papers.yml",
        "story.yml",
        "report-slide",
        "reference entry",
        "source URL",
        "source-status",
        "evidence ledger",
        "claim 强度保持",
    )
    if not text or any(term in text for term in internal_terms):
        text = "来源：论文原文、官方规范或公开材料｜证据等级：见本页 badge"
    elif not text.startswith("来源：") and not text.startswith("Source:"):
        text = f"来源：{text}"
    return text


def primary_cards(primary: list[dict[str, Any]]) -> str:
    rows = []
    slot_labels = {
        "primary_1": "基础入口",
        "primary_2": "代表性改进",
        "primary_3": "当前边界",
    }
    for paper in primary:
        slot = slot_labels.get(as_text(paper.get("selection_slot")), as_text(paper.get("selection_slot")))
        paper_type = as_text(paper.get("paper_type"))
        label = f"{slot} / {paper_type}" if paper_type else slot
        rows.append(rf"\PrimaryCard{{{latex_escape(label)}}}{{{latex_escape(paper.get('title'))}}}{{{latex_escape(paper.get('evidence'))}}}")
    return "\n".join(rows)


def evidence_items(primary: list[dict[str, Any]]) -> str:
    return latex_itemize(
        [
            f"{compact_title(paper.get('title'), 42)}：{paper.get('evidence')}；{source_status_label(paper.get('source_status'))}"
            for paper in primary
        ]
    )


def paper_by_key(data: dict[str, Any], key: str) -> dict[str, Any] | None:
    for paper in data.get("primary", []):
        if as_text(paper.get("key")) == key:
            return paper
    return None


def proof_list(items: list[Any]) -> str:
    return latex_itemize([as_text(item) for item in items])


def proof_table(data: dict[str, Any]) -> str:
    columns = data.get("columns", [])
    rows = data.get("rows", [])
    if not isinstance(columns, list) or not isinstance(rows, list) or not columns:
        return proof_list(rows if isinstance(rows, list) else [])
    spec = "Y" * len(columns)
    header = " & ".join(rf"\textbf{{{latex_escape(col)}}}" for col in columns) + r" \\"
    body_rows = []
    for row in rows:
        cells = row if isinstance(row, list) else [row]
        padded = cells[: len(columns)] + [""] * max(0, len(columns) - len(cells))
        body_rows.append(" & ".join(latex_escape(cell) for cell in padded) + r" \\")
    return (
        r"{\tiny" + "\n"
        + rf"\begin{{tabularx}}{{\linewidth}}{{@{{}}{spec}@{{}}}}" + "\n"
        + r"\toprule" + "\n"
        + header + "\n"
        + r"\midrule" + "\n"
        + "\n".join(body_rows) + "\n"
        + r"\bottomrule" + "\n"
        + r"\end{tabularx}"
        + "\n}"
    )


def proof_metric_bars(data: dict[str, Any]) -> str:
    metrics = data.get("metrics", [])
    if not isinstance(metrics, list):
        return ""
    rows = []
    for metric in metrics:
        if not isinstance(metric, dict):
            continue
        bar = metric.get("bar", 35)
        try:
            width = max(0.04, min(float(bar) / 100.0, 0.95))
        except (TypeError, ValueError):
            width = 0.35
        rows.append(
            rf"\textbf{{{latex_escape(metric.get('label'))}}}\hfill "
            rf"\textcolor{{Accent}}{{\bfseries {latex_escape(metric.get('value'))}}}\par"
            rf"\textcolor{{Accent}}{{\rule{{{width:.2f}\linewidth}}{{1.1mm}}}}\par"
            rf"{{\tiny\textcolor{{Muted}}{{{latex_escape(metric.get('note'))}}}}}\par\vspace{{0.8mm}}"
        )
    return "\n".join(rows)


def proof_flow(data: dict[str, Any]) -> str:
    stages = data.get("stages", [])
    if not isinstance(stages, list):
        return ""
    return latex_itemize([f"{index:02d}. {as_text(stage)}" for index, stage in enumerate(stages, start=1)])


def proof_paths(data: dict[str, Any]) -> str:
    paths = data.get("paths", [])
    if not isinstance(paths, list):
        return ""
    rows = []
    for path in paths:
        if not isinstance(path, dict):
            continue
        steps = path.get("steps", [])
        step_text = " → ".join(as_text(step) for step in steps) if isinstance(steps, list) else as_text(steps)
        rows.append(
            rf"\textbf{{{latex_escape(path.get('label'))}}}\par" + "\n"
            rf"{latex_escape(step_text)}\par" + "\n"
            rf"{{\tiny\textcolor{{Muted}}{{{latex_escape(path.get('note'))}}}}}\par\vspace{{1.8mm}}"
        )
    return "\n".join(rows)


def proof_timeline(data: dict[str, Any]) -> str:
    steps = data.get("steps", [])
    if not isinstance(steps, list):
        return ""
    rows = []
    for step in steps:
        if not isinstance(step, dict):
            continue
        rows.append(
            rf"\textcolor{{Accent}}{{\bfseries {latex_escape(step.get('label'))}}}\par"
            rf"\textbf{{{latex_escape(step.get('claim'))}}}\par"
            rf"{{\tiny\textcolor{{Muted}}{{{latex_escape(step.get('evidence'))}}}}}\par\vspace{{1.6mm}}"
        )
    return "\n".join(rows)


def render_proof_object(proof: dict[str, Any]) -> str:
    proof_type = as_text(proof.get("type"))
    data = proof.get("data", {})
    if not isinstance(data, dict):
        data = {}
    if proof_type in {"comparison_matrix", "rdma_tradeoff_matrix", "evidence_gap_matrix"}:
        body = proof_table(data)
    elif proof_type == "metric_bars":
        body = proof_metric_bars(data)
    elif proof_type == "path_compare":
        body = proof_paths(data)
    elif proof_type == "evolution_timeline":
        body = proof_timeline(data)
    elif proof_type in {"mechanism_flow", "tiering_loop", "wr_chain_flow"}:
        body = proof_flow(data)
    else:
        body = latex_itemize([as_text(item) for item in data.values()])
    return authored_panel(proof.get("title"), body, fill="Panel")


def authored_panel(title: Any, body: str, *, fill: str = "Paper") -> str:
    return rf"""\fcolorbox{{Rule}}{{{fill}}}{{%
  \begin{{minipage}}[t]{{0.97\linewidth}}
    \vspace{{1.1mm}}
    \hspace{{1.4mm}}\begin{{minipage}}{{0.92\linewidth}}
      \PanelTitle{{{latex_escape(title)}}}
      \scriptsize {body}
    \end{{minipage}}
    \vspace{{1mm}}
  \end{{minipage}}}}"""


def source_footnote(value: Any) -> str:
    return rf"\SourceFootnote{{{latex_escape(value)}}}"


def authored_label(slide_type: str) -> str:
    return {
        "direction_intro": "方向开场",
        "direction_summary": "方向总结",
        **SLIDE_LABELS,
    }.get(slide_type, slide_type)


def render_authored_slide(data: dict[str, Any], slide: dict[str, Any]) -> str:
    slide_type = as_text(slide.get("slide_type"))
    paper_key = as_text(slide.get("paper_key"))
    label = authored_label(slide_type)
    paper = paper_by_key(data, paper_key)
    title = as_text(data.get("direction")) if paper is None else as_text(paper.get("title"))
    meta_key = "证据等级"
    evidence = evidence_label(paper.get("evidence")) if paper is not None else "方向综述"
    source = f"来源状态：{source_status_label(paper.get('source_status'))}" if paper is not None else "来源状态：公开材料综合"
    narrative = slide.get("narrative", [])
    proof = slide.get("proof_object", {})
    if not isinstance(proof, dict):
        proof = {}
    return rf"""\begin{{frame}}[t,shrink=6]{{{latex_escape(title)}：{latex_escape(label)}}}
\DeckKicker{{{latex_escape(label)}}}
\SlideMeta{{{latex_escape(meta_key)}}}{{{latex_escape(evidence)}}}{{{latex_escape(source)}}}
{{\large\bfseries\color{{Ink}} {latex_escape(slide.get("claim"))}\par}}\vspace{{1.2mm}}
\begin{{columns}}[T,totalwidth=\textwidth]
  \begin{{column}}{{0.45\textwidth}}
    {authored_panel("内容说明", latex_itemize(narrative), fill="Paper")}
  \end{{column}}
  \begin{{column}}{{0.49\textwidth}}
    {render_proof_object(proof)}
  \end{{column}}
\end{{columns}}
{source_footnote(source_note_for_display(slide.get("source_note")))}
\end{{frame}}
"""


def render_authored_direction(data: dict[str, Any]) -> str:
    story = data.get("_story", {})
    slides = story.get("slides", []) if isinstance(story, dict) else []
    parts = [rf"\section{{{latex_escape(data.get('direction'))}}}"]
    for slide in slides:
        if isinstance(slide, dict):
            parts.append(render_authored_slide(data, slide))
    return "\n\n".join(parts)


def render_overview(directions: list[dict[str, Any]]) -> str:
    grouped_rows = [
        ["TEE 基础与 Arm 路线", "01-05", "TEE taxonomy；TrustZone；Arm CCA/RME/RMM；部署与 I/O 边界"],
        ["Attestation 与 RISC-V 基础", "06-10", "RATS/boot/lifecycle；RISC-V primitives；TEE lineage；CoVE/AP-TEE；CoVE-IO"],
        ["Memory / Fabric / Protocol", "11-13", "Memory encryption/integrity；CXL/PCIe IDE/RDMA；SPDM/TDISP/TLS+RA"],
        ["Accelerator / DPU / SmartNIC", "14-15", "GPU/FPGA/DPU confidential offload；trusted NIC；secure storage path"],
        ["全局总结", "结尾", "证据边界、研究空白、工程落地优先级"],
    ]
    group_table = "\n".join(
        rf"{latex_escape(row[0])} & \textcolor{{Accent}}{{\bfseries {latex_escape(row[1])}}} & {latex_escape(row[2])} \\"
        for row in grouped_rows
    )
    route_items = latex_itemize(
        [
            "TEE taxonomy -> Arm CCA / RISC-V CoVE",
            "Memory ownership -> I/O fabric -> trusted device interface",
            "SPDM / TDISP / IDE -> DPU / SmartNIC / storage endpoint",
            "端到端 evidence chain 约束实验与部署结论",
        ]
    )
    return rf"""
\section{{总览与证据规则}}

\begin{{frame}}[t]{{报告问题与技术路线}}
\DeckKicker{{报告定位}}
\SlideMeta{{证据等级}}{{Method}}{{来源：报告结构与 primary ledger}}
\ClaimLine{{平台管理者不可信，但仍掌握 CPU 调度、内存、I/O 和设备资源。}}
\begin{{columns}}[T,totalwidth=\textwidth]
  \begin{{column}}{{0.31\textwidth}}
    \OverviewPanel{{核心问题}}{{\begin{{itemize}}
      \item 管理者仍控制 CPU 调度、页表、DMA、interrupt 和设备分配。
      \item 机密计算要把“谁能访问数据”从软件约定下沉到硬件与证明链。
    \end{{itemize}}}}
  \end{{column}}
  \begin{{column}}{{0.31\textwidth}}
    \OverviewPanel{{报告范围}}{{\begin{{itemize}}
      \item Arm TrustZone / CCA / RME / RMM。
      \item RISC-V primitives、TEE lineage、CoVE / AP-TEE。
      \item Memory、CXL、PCIe IDE、SPDM、DPU、SmartNIC。
    \end{{itemize}}}}
  \end{{column}}
  \begin{{column}}{{0.31\textwidth}}
    \OverviewPanel{{阅读主线}}{{{route_items}}}
  \end{{column}}
\end{{columns}}
\SourceFootnote{{来源：report-slide 15 directions / 45 primary materials｜证据等级：方法论}}
\end{{frame}}

\begin{{frame}}[t]{{证据等级与结论边界}}
\DeckKicker{{证据边界}}
\SlideMeta{{证据等级}}{{E0-E5}}{{来源：survey evidence classes}}
\ClaimLine{{所有机制和实验结论都必须落在证据等级允许的范围内。}}
\scriptsize
\begin{{tabularx}}{{\textwidth}}{{@{{}}lYY@{{}}}}
\toprule
标签 & 可支撑什么 & 不能支撑什么 \\
\midrule
E0 Spec & 规范机制、接口、术语、状态；规范，无新实验 & 性能、安全证明或部署效果 \\
E1 System Paper & 系统设计、实现、实验数字 & 论文 threat model / workload 之外的泛化 \\
E2 SoK / Survey & taxonomy、覆盖范围、相关工作框架 & 一手机制实验或产品结论 \\
E3 Draft & 前沿方向、草案状态；draft / not ratified & 已批准标准或量产状态 \\
E4 Industry & 产品行为、部署实践、工程背景 & 普适安全证明 \\
E5 Limited & 来源状态和研究线索 & 强机制、性能或成熟度结论 \\
\bottomrule
\end{{tabularx}}
\SourceFootnote{{来源：survey evidence classes 与 report-slide evidence ledger｜证据等级：方法论}}
\end{{frame}}

\begin{{frame}}[t]{{15 个技术方向总览}}
\DeckKicker{{方向索引}}
\SlideMeta{{证据等级}}{{Method}}{{来源：report-slide direction manifest}}
\ClaimLine{{15 个方向按保护对象、资源管理者、证据链和设备边界组织。}}
\scriptsize
\begin{{tabularx}}{{\textwidth}}{{@{{}}l l Y@{{}}}}
\toprule
组 & 方向 & 覆盖范围 \\
\midrule
{group_table}
\bottomrule
\end{{tabularx}}
\SourceFootnote{{来源：report-slide direction list｜证据等级：方向综述}}
\end{{frame}}
"""


def render_direction(data: dict[str, Any]) -> str:
    if isinstance(data.get("_story"), dict):
        return render_authored_direction(data)

    direction = latex_escape(data.get("direction"))
    focus = latex_escape(data.get("focus"))
    selection_rule = latex_escape(data.get("selection_rule"))
    primary = data.get("primary", [])
    parts = [
        rf"""\section{{{direction}}}

\begin{{frame}}[t]{{{direction}：方向开场}}
\DeckKicker{{方向开场}}
\ClaimLine{{{focus}}}
\begin{{columns}}[T,totalwidth=\textwidth]
  \begin{{column}}{{0.56\textwidth}}
    \textbf{{三篇主讲选择规则}}\par
    \SmallLead{{{selection_rule}}}
    \vspace{{2mm}}
{primary_cards(primary)}
  \end{{column}}
  \begin{{column}}{{0.38\textwidth}}
    \VisualPanel{{证据边界}}{{{evidence_items(primary)}}}
  \end{{column}}
\end{{columns}}
\end{{frame}}
"""
    ]

    for paper in primary:
        parts.extend(render_paper(paper))

    parts.append(render_summary(data))
    return "\n".join(parts)


def render_paper(paper: dict[str, Any]) -> list[str]:
    title = latex_escape(paper.get("title"))
    evidence = latex_escape(evidence_label(paper.get("evidence")))
    source = latex_escape(f"来源状态：{source_status_label(paper.get('source_status'))}")
    slides = paper.get("slides", {})
    rendered: list[str] = []

    for slide_key in ("summary", "background", "solution", "experiments"):
        slide = slides.get(slide_key, {})
        visual = slide.get("visual", {})
        rendered.append(
            rf"""\PaperSlide
{{{latex_escape(SLIDE_LABELS[slide_key])}}}
{{{title}}}
{{证据等级}}
{{{evidence}}}
{{{source}}}
{{{latex_escape(slide.get("claim"))}}}
{{{latex_itemize(slide.get("points", []))}}}
{{{latex_escape(visual.get("title"))}}}
{{{latex_itemize(visual.get("items", []))}}}
"""
        )

    evaluation = slides.get("evaluation", {})
    rendered.append(
rf"""\PaperEvalSlide
{{{title}}}
{{证据等级}}
{{{evidence}}}
{{{source}}}
{{{latex_escape(evaluation.get("claim"))}}}
{{{latex_escape(evaluation.get("strengths"))}}}
{{{latex_escape(evaluation.get("limitations"))}}}
{{{latex_escape(evaluation.get("commercialization"))}}}
"""
    )
    return rendered


def render_summary(data: dict[str, Any]) -> str:
    primary = data.get("primary", [])
    titles = [as_text(paper.get("title")) for paper in primary]
    strengths = [as_text(paper.get("slides", {}).get("evaluation", {}).get("strengths")) for paper in primary]
    limits = [as_text(paper.get("slides", {}).get("evaluation", {}).get("limitations")) for paper in primary]
    commercial = [
        as_text(paper.get("slides", {}).get("evaluation", {}).get("commercialization"))
        for paper in primary
    ]
    return rf"""\begin{{frame}}[t]{{{latex_escape(data.get("direction"))}：技术演进总结}}
\DeckKicker{{方向总结}}
\ClaimLine{{三篇材料共同回答本方向从基础机制到当前证据边界的演进关系。}}
\begin{{columns}}[T,totalwidth=\textwidth]
  \begin{{column}}{{0.31\textwidth}}
    \VisualPanel{{技术演进}}{{{latex_itemize(titles)}}}
  \end{{column}}
  \begin{{column}}{{0.31\textwidth}}
    \VisualPanel{{优点与缺口}}{{{latex_itemize(strengths[:2] + limits[:2])}}}
  \end{{column}}
  \begin{{column}}{{0.31\textwidth}}
    \VisualPanel{{商业化适配}}{{{latex_itemize(commercial)}}}
  \end{{column}}
\end{{columns}}
\end{{frame}}
"""


def main() -> int:
    directions: list[dict[str, Any]] = []
    for data in load_deck():
        if not isinstance(data.get("_story"), dict):
            data = migrate_direction(data)
        directions.append(data)

    write(SLIDE_ROOT / "00-overview" / "section.tex", render_overview(directions))
    for data in directions:
        write(SLIDE_ROOT / data["_directory"] / "section.tex", render_direction(data))

    print(f"Generated Beamer sections for {len(directions)} directions.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
