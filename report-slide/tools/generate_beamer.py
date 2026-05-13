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


def write(path: Path, content: str) -> None:
    path.write_text(content.rstrip() + "\n", encoding="utf-8")


def primary_cards(primary: list[dict[str, Any]]) -> str:
    rows = []
    slot_labels = {
        "primary_1": "Primary 1",
        "primary_2": "Primary 2",
        "primary_3": "Primary 3",
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
            f"{paper.get('key')}: {paper.get('paper_type')}；{paper.get('claim_strength')}；{paper.get('source_status')}"
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
            rf"{{\tiny\textcolor{{Muted}}{{{latex_escape(metric.get('note'))}}}}}\par\vspace{{1.4mm}}"
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
    meta_key = paper_key if paper is not None else as_text(data.get("_directory"))
    evidence = as_text(paper.get("evidence")) if paper is not None else "authored direction"
    source = as_text(paper.get("source_status")) if paper is not None else "local evidence synthesis"
    narrative = slide.get("narrative", [])
    proof = slide.get("proof_object", {})
    if not isinstance(proof, dict):
        proof = {}
    return rf"""\begin{{frame}}[t,shrink=6]{{{latex_escape(title)}：{latex_escape(label)}}}
\DeckKicker{{{latex_escape(label)}}}
\SlideMeta{{{latex_escape(meta_key)}}}{{{latex_escape(evidence)}}}{{{latex_escape(source)}}}
{{\large\bfseries\color{{Ink}} {latex_escape(slide.get("claim"))}\par}}\vspace{{1.8mm}}
\begin{{columns}}[T,totalwidth=\textwidth]
  \begin{{column}}{{0.45\textwidth}}
    {authored_panel("讲解逻辑", latex_itemize(narrative), fill="Paper")}
  \end{{column}}
  \begin{{column}}{{0.49\textwidth}}
    {render_proof_object(proof)}
  \end{{column}}
\end{{columns}}
\vspace{{1mm}}
{{\tiny\textcolor{{Muted}}{{Source: {latex_escape(slide.get("source_note"))}}}}}
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
    rows = []
    for index, direction in enumerate(directions, start=1):
        keys = " / ".join(as_text(paper.get("key")) for paper in direction.get("primary", []))
        rows.append(rf"\IndexEntry{{{index:02d}}}{{{latex_escape(direction.get('direction'))}}}{{{latex_escape(keys)}}}")
    left_rows = "\n".join(rows[:8])
    right_rows = "\n".join(rows[8:])

    return rf"""
\section{{总览与证据规则}}

\begin{{frame}}[t]{{重做后的 report-slide 交付形态}}
\DeckKicker{{REPORT STRUCTURE}}
\ClaimLine{{同一份 YAML 内容源同时生成 Beamer/PDF 与可编辑 PPTX，避免内容漂移。}}
\begin{{columns}}[T,totalwidth=\textwidth]
  \begin{{column}}{{0.56\textwidth}}
    \begin{{itemize}}
      \item 15 个小方向，每个方向固定 3 个 selection slot。
      \item 每篇文章固定 5 页：内容摘要、研究背景、解决方案、实验结果、文章评价。
      \item 每个 primary 独立记录 paper type、claim strength、maturity/source status。
      \item PDF 与 PPTX 只作为交付物；可维护内容是 \texttt{{papers.yml}}、方向级 \texttt{{story.yml}} 和生成脚本。
    \end{{itemize}}
  \end{{column}}
  \begin{{column}}{{0.38\textwidth}}
    \VisualPanel{{页数与结构}}{{\begin{{itemize}}
      \item 45 个 primary slot
      \item 225 页文章精讲
      \item 每方向 1 页开场 + 1 页总结
      \item 全 deck 约 260 页
    \end{{itemize}}}}
  \end{{column}}
\end{{columns}}
\end{{frame}}

\begin{{frame}}[t]{{证据等级与允许 claim}}
\DeckKicker{{EVIDENCE RULES}}
\ClaimLine{{所有机制和实验结论都必须落在证据等级允许的范围内。}}
\scriptsize
\begin{{tabularx}}{{\textwidth}}{{@{{}}lY@{{}}}}
\toprule
标签 & Slide 中允许的表述 \\
\midrule
E0 official spec/RFC & 只写规范性机制、状态、接口和术语；没有独立实验时写“规范，无新实验”。 \\
E1 peer-reviewed primary & 可写系统设计、实现和实验结果，但必须限定在论文 threat model 和 workload 内。 \\
E2 SoK/Survey & 用于 taxonomy、覆盖范围和 related-work framing；机制 claim 回到原论文或规范。 \\
E3 draft/preprint & 只写 emerging direction 与草案状态；标题或证据行显式标注 draft/not ratified。 \\
E4 industry evidence & 只支撑产品行为、部署实践或 building block；不当作普适安全证明。 \\
E5 metadata/source-limited & 只写来源状态，不支撑强机制或性能 claim。 \\
\bottomrule
\end{{tabularx}}
\end{{frame}}

\begin{{frame}}[t]{{15 个小方向与 primary slot}}
\DeckKicker{{DIRECTION INDEX}}
\begin{{columns}}[T,totalwidth=\textwidth]
  \begin{{column}}{{0.49\textwidth}}
{left_rows}
  \end{{column}}
  \begin{{column}}{{0.49\textwidth}}
{right_rows}
  \end{{column}}
\end{{columns}}
\end{{frame}}
"""


def render_direction(data: dict[str, Any]) -> str:
    if isinstance(data.get("_story"), dict):
        return render_authored_direction(data)

    direction = latex_escape(data.get("direction"))
    focus = latex_escape(data.get("focus"))
    selection_rule = latex_escape(data.get("selection_rule"))
    primary = data.get("primary", [])
    directory = latex_escape(data.get("_directory", ""))

    parts = [
        rf"""\section{{{direction}}}

\begin{{frame}}[t]{{{direction}：方向开场}}
\DeckKicker{{{directory}}}
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
    key = latex_escape(paper.get("key"))
    evidence = latex_escape(paper.get("evidence"))
    source = latex_escape(paper.get("source_status"))
    slides = paper.get("slides", {})
    rendered: list[str] = []

    for slide_key in ("summary", "background", "solution", "experiments"):
        slide = slides.get(slide_key, {})
        visual = slide.get("visual", {})
        rendered.append(
            rf"""\PaperSlide
{{{latex_escape(SLIDE_LABELS[slide_key])}}}
{{{title}}}
{{{key}}}
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
{{{key}}}
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
\DeckKicker{{DIRECTION TAKEAWAY}}
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
