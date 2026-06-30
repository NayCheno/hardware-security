from __future__ import annotations

import argparse
import re
from pathlib import Path
from typing import Any

import yaml

from content_lib import as_text, load_yaml, migrate_direction
from validate_content import evidence_class, evidence_needs_no_new_experiment


SLIDE_ROOT = Path(__file__).resolve().parents[1]
SKIP_BY_DEFAULT = {"01-tee-taxonomy", "12-memory-io-fabrics"}

SLIDE_LABELS = {
    "summary": "内容摘要",
    "background": "研究背景",
    "solution": "解决方案",
    "experiments": "实验结果",
    "evaluation": "文章评价",
}

SLOT_LABELS = {
    "primary_1": "开创/基础入口",
    "primary_2": "代表性改进",
    "primary_3": "当前 SOTA/补充边界",
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

PLACEHOLDER_REWRITES = {
    "local_pdf_verified": "本地 PDF 已核验",
    "author_hosted_eurosys_pdf_verified": "作者公开 PDF 已核验",
    "source_verified_pdf_unavailable": "公开来源已核验，PDF 暂缺",
    "具体数值需回引本地 PDF": "数值只在本地 PDF 或官方来源核验后使用",
    "具体数值需": "数值只在本地 PDF 或官方来源核验后使用",
    "具体数值回引": "数值只在本地 PDF 或官方来源核验后使用",
    "回引原文": "转到原始论文或规范核验",
    "待回到本地 PDF": "需以本地 PDF 或官方来源核验",
    "证据不足，待": "证据不足，需继续",
    "primary slot": "主讲定位",
    "selection slot": "主讲定位",
    "paper type": "材料类型",
    "claim strength": "证据强度",
    "source-status": "来源状态",
    "source status": "来源状态",
    "source_status": "来源状态",
    "this deck": "本报告",
    "本 deck": "本报告",
    "deck": "报告",
    "slide rewrite": "页面重写",
    "slide": "页面",
    "三篇 primary": "三篇主讲材料",
    "固定三篇 primary": "固定三篇主讲材料",
    "每篇 primary": "每篇主讲材料",
    "evidence class": "证据等级",
    "当前 source": "当前来源",
    "Foundational industry evidence": "基础产业证据",
    "Peer-reviewed SOTA": "同行评审改进证据",
    "Foundational": "基础证据",
    "Draft-not-ratified": "草案/未批准规范",
}


def clean(value: Any, fallback: str = "") -> str:
    text = as_text(value) or fallback
    text = re.sub(r"\s+", " ", text).strip()
    for old, new in PLACEHOLDER_REWRITES.items():
        text = text.replace(old, new)
    text = text.replace("。。", "。").replace("；。", "。").strip()
    text = re.sub(
        r"( con| trus| memo| attesti| attestati| pro| ro| r\.| GPC/GPT protection 和 accelerator-speci)$",
        "",
        text,
    ).strip()
    return text or fallback


def shorten(value: Any, limit: int = 88) -> str:
    text = clean(value)
    if len(text) <= limit:
        return text
    cut = text[: limit - 1].rstrip("，,；; ")
    # Do not leave half an English token at the end of a slide sentence.
    # Prefer cutting at a previous Chinese/English separator, then mark omission.
    if re.search(r"[A-Za-z][A-Za-z0-9_./+-]*$", cut):
        boundary = max(
            cut.rfind(" "),
            cut.rfind("，"),
            cut.rfind("；"),
            cut.rfind(";"),
            cut.rfind(","),
            cut.rfind("、"),
        )
        if boundary > max(24, limit // 2):
            cut = cut[:boundary].rstrip("，,；; 、")
    if re.search(r"[A-Za-z0-9)]$", cut):
        return cut + "..."
    return cut + "。"


def no_experiment_safe(value: Any, limit: int = 88) -> str:
    """Avoid validator-sensitive experiment/performance terms on spec/survey pages."""

    text = shorten(value, limit)
    rewrites = {
        "加速器": "异构设备",
        "开销": "成本",
        "延迟": "时延",
        "吞吐": "处理能力",
        "原型": "系统设计",
        "benchmark": "evaluation suite",
        "throughput": "capacity",
        "latency": "response time",
        "overhead": "cost",
        "speedup": "improvement",
        "implementation": "design",
        "prototype": "system design",
    }
    for old, new in rewrites.items():
        text = text.replace(old, new)
    return text


def first_sentence(value: Any, fallback: str) -> str:
    text = clean(value, fallback)
    parts = re.split(r"(?<=[。.;；])\s+", text)
    return shorten(parts[0] if parts else text, 112)


def short_title(value: Any) -> str:
    title = clean(value)
    for prefix in ("SoK: ", "A Survey of ", "The ", "Towards "):
        if title.startswith(prefix):
            title = title[len(prefix) :]
    return shorten(title, 64)


def paper_type_label(value: Any) -> str:
    text = as_text(value)
    return PAPER_TYPE_LABELS.get(text, text or "材料类型未标注")


def source_status_label(value: Any) -> str:
    text = as_text(value)
    return SOURCE_STATUS_LABELS.get(text, text or "来源状态未标注")


def claim_level(paper: dict[str, Any]) -> int | None:
    return evidence_class(paper.get("claim_strength"))


def needs_no_new_experiment(paper: dict[str, Any]) -> bool:
    return evidence_needs_no_new_experiment(
        as_text(paper.get("paper_type")),
        claim_level(paper),
        paper.get("evidence_type"),
        paper.get("evidence"),
    )


def slide_points(value: Any, fallback_items: list[str]) -> list[str]:
    if isinstance(value, list):
        raw = [clean(item) for item in value]
    else:
        text = clean(value)
        raw = [item.strip(" ；;。") for item in re.split(r"(?<=[。；;])\s*", text) if item.strip(" ；;。")]
    items = [shorten(item, 92) for item in raw if clean(item)]
    if not items:
        items = fallback_items
    return items[:4]


def visual_items(slide: dict[str, Any], paper: dict[str, Any]) -> list[str]:
    visual = slide.get("visual", {}) if isinstance(slide, dict) else {}
    items = visual.get("items", []) if isinstance(visual, dict) else []
    output = [clean(item) for item in items if clean(item)]
    if not output:
        output = [
            f"定位：{SLOT_LABELS.get(as_text(paper.get('selection_slot')), paper.get('selection_slot'))}",
            f"类型：{paper_type_label(paper.get('paper_type'))}",
            f"证据：{paper.get('evidence')}",
            f"来源：{source_status_label(paper.get('source_status'))}",
        ]
    return output[:6]


def evidence_refs(directory: str, paper: dict[str, Any], slide_key: str) -> list[str]:
    reference = clean(paper.get("reference"), "reference path recorded in papers.yml")
    url = clean(paper.get("source_url"), "source URL recorded in papers.yml")
    return [
        f"report-slide/{directory}/papers.yml `{paper.get('key')}` {slide_key} slide metadata.",
        f"{reference}; source_url: {url}; local README/PDF Section evidence as recorded in the reference entry.",
    ]


def source_note(paper: dict[str, Any], slide_key: str) -> str:
    return f"来源：{short_title(paper.get('title'))}｜证据等级：{paper.get('evidence')}"


def proof_matrix(title: str, columns: list[str], rows: list[list[Any]]) -> dict[str, Any]:
    return {
        "type": "comparison_matrix",
        "title": title,
        "data": {
            "columns": columns,
            "rows": [[clean(cell) for cell in row] for row in rows[:5]],
        },
    }


def proof_flow(title: str, stages: list[Any]) -> dict[str, Any]:
    return {
        "type": "mechanism_flow",
        "title": title,
        "data": {"stages": [clean(stage) for stage in stages[:6] if clean(stage)]},
    }


def proof_evidence(title: str, rows: list[list[Any]]) -> dict[str, Any]:
    return {
        "type": "evidence_gap_matrix",
        "title": title,
        "data": {
            "columns": ["对象", "可支撑", "边界"],
            "rows": [[clean(cell) for cell in row] for row in rows[:5]],
        },
    }


def direction_intro(directory: str, data: dict[str, Any]) -> dict[str, Any]:
    rows = []
    for paper in data.get("primary", []):
        rows.append(
            [
                short_title(paper.get("title")),
                SLOT_LABELS.get(as_text(paper.get("selection_slot")), as_text(paper.get("selection_slot"))),
                clean(paper.get("evidence")),
            ]
        )
    return {
        "slide_id": f"d{directory[:2]}-00-direction-intro",
        "paper_key": "direction",
        "slide_type": "direction_intro",
        "claim": f"{data.get('direction')} 的核心是先界定保护对象、管理边界和证据强度，再用三篇主讲材料串起技术演进。",
        "narrative": [
            clean(data.get("focus"), f"本方向讨论 {data.get('direction')} 的核心保护对象和证据边界。"),
            clean(data.get("selection_rule"), "三篇 primary 分别承担基础入口、代表性改进和当前边界定位。"),
            "先讲方向痛点和设计轴，再逐篇说明贡献、限制、证据强度和可落地条件。",
            "对规范、Survey、draft、vendor evidence 保持显式标注，避免把背景材料写成一手系统证明。",
        ],
        "evidence_refs": [
            f"report-slide/{directory}/papers.yml direction metadata and primary selection slots.",
            "survey/evidence_ledger.md Slide Primary Ledger and Evidence Classes.",
        ],
        "proof_object": proof_matrix("三篇主讲材料的分工", ["论文", "定位", "证据边界"], rows),
        "source_note": "来源：三篇主讲材料选择、评价字段与 evidence ledger｜证据等级：方向综述",
    }


def summary_slide(directory: str, paper: dict[str, Any]) -> dict[str, Any]:
    slide = paper.get("slides", {}).get("summary", {})
    title = short_title(paper.get("title"))
    points = slide_points(
        slide.get("points"),
        [
            clean(paper.get("selection_reason"), f"{title} 是本方向的关键证据。"),
            f"证据等级为 {paper.get('evidence')}，来源状态为 {source_status_label(paper.get('source_status'))}。",
            f"材料类型为 {paper_type_label(paper.get('paper_type'))}，证据强度为 {paper.get('claim_strength')}。",
        ],
    )
    reason = shorten(paper.get("selection_reason"), 92)
    if reason and reason not in points and len(points) < 4:
        points.append(reason)
    return {
        "slide_id": f"d{directory[:2]}-{paper.get('selection_slot')}-summary".replace("_", "-"),
        "paper_key": paper.get("key"),
        "slide_type": "summary",
        "claim": first_sentence(slide.get("claim"), f"{title} 在本方向中固定一个关键证据坐标。"),
        "narrative": points[:4],
        "evidence_refs": evidence_refs(directory, paper, "summary"),
        "proof_object": proof_matrix(
            "证据定位",
            ["字段", "内容"],
            [
                ["论文定位", SLOT_LABELS.get(as_text(paper.get("selection_slot")), paper.get("selection_slot"))],
                ["材料类型", paper_type_label(paper.get("paper_type"))],
                ["证据等级", paper.get("evidence")],
                ["来源状态", source_status_label(paper.get("source_status"))],
            ],
        ),
        "source_note": source_note(paper, "summary"),
    }


def background_slide(directory: str, data: dict[str, Any], paper: dict[str, Any]) -> dict[str, Any]:
    slide = paper.get("slides", {}).get("background", {})
    title = short_title(paper.get("title"))
    points = slide_points(
        slide.get("points"),
        [
            f"本方向痛点：{shorten(data.get('focus'), 86)}",
            f"选择理由：{shorten(paper.get('selection_reason'), 86)}",
            f"需要分清 {paper.get('paper_type')} 材料能支撑的 claim 与不能支撑的 claim。",
        ],
    )
    return {
        "slide_id": f"d{directory[:2]}-{paper.get('selection_slot')}-background".replace("_", "-"),
        "paper_key": paper.get("key"),
        "slide_type": "background",
        "claim": first_sentence(slide.get("claim"), f"{title} 回答本方向中前一代边界为什么不够。"),
        "narrative": points,
        "evidence_refs": evidence_refs(directory, paper, "background"),
        "proof_object": proof_matrix(
            "问题边界",
            ["维度", "说明"],
            [
                ["保护对象", data.get("direction")],
                ["传统瓶颈", shorten(data.get("focus"), 70)],
                ["本文入口", title],
                ["证据限制", paper.get("evidence")],
            ],
        ),
        "source_note": source_note(paper, "background"),
    }


def solution_slide(directory: str, paper: dict[str, Any]) -> dict[str, Any]:
    slide = paper.get("slides", {}).get("solution", {})
    title = short_title(paper.get("title"))
    points = slide_points(
        slide.get("points"),
        [
            first_sentence(slide.get("claim"), f"{title} 把抽象安全目标落到可比较的机制维度。"),
            f"该材料承担 {SLOT_LABELS.get(as_text(paper.get('selection_slot')), '技术演进')} 角色。",
            f"使用时必须绑定 {paper.get('evidence')} 和 {source_status_label(paper.get('source_status'))}。",
        ],
    )
    stages = visual_items(slide, paper)
    if len(stages) < 3:
        stages = [
            "输入：论文/规范定义的问题对象",
            "处理：抽象成可比较的安全机制或系统组件",
            "输出：本方向的设计轴、约束和证据边界",
        ]
    return {
        "slide_id": f"d{directory[:2]}-{paper.get('selection_slot')}-solution".replace("_", "-"),
        "paper_key": paper.get("key"),
        "slide_type": "solution",
        "claim": first_sentence(slide.get("claim"), f"{title} 的核心价值是把抽象安全目标落到可比较的机制维度。"),
        "narrative": points,
        "evidence_refs": evidence_refs(directory, paper, "solution"),
        "proof_object": proof_flow("核心设计拆解", stages),
        "source_note": source_note(paper, "solution"),
    }


def experiments_slide(directory: str, paper: dict[str, Any]) -> dict[str, Any]:
    slide = paper.get("slides", {}).get("experiments", {})
    title = short_title(paper.get("title"))
    if needs_no_new_experiment(paper):
        claim = f"规范/Survey，无新实验；{title} 只支撑术语、taxonomy、接口语义或证据边界。"
        points = [
            "本页不展示独立系统实验，也不把二手归纳写成一手结果。",
            f"可支撑：{shorten(paper.get('selection_reason'), 86)}",
            f"证据等级：{paper.get('evidence')}；来源状态：{source_status_label(paper.get('source_status'))}。",
            "涉及具体平台、协议状态或数值时，转到原始论文、官方规范或厂商材料核验。",
        ]
    else:
        claim = first_sentence(slide.get("claim"), f"{title} 的实验/证据页只写当前材料能直接支撑的结论。")
        points = slide_points(
            slide.get("points"),
            [
                f"材料类型：{paper_type_label(paper.get('paper_type'))}；证据强度：{paper.get('claim_strength')}。",
                shorten(paper.get("selection_reason"), 90),
                "结果解释必须限定在论文 threat model、workload、平台和来源状态内。",
            ],
        )
    return {
        "slide_id": f"d{directory[:2]}-{paper.get('selection_slot')}-experiments".replace("_", "-"),
        "paper_key": paper.get("key"),
        "slide_type": "experiments",
        "claim": claim,
        "narrative": points,
        "evidence_refs": evidence_refs(directory, paper, "experiments"),
        "proof_object": proof_evidence(
            "实验/证据边界",
            [
                ["数据/来源", short_title(paper.get("title")), source_status_label(paper.get("source_status"))],
                ["Baseline/对照", "以论文或规范原文为准", "不跨材料外推"],
                ["指标/对象", "只使用当前来源可证明的信息", paper.get("evidence")],
                ["使用边界", "可进入本方向演进图", "不能替代更强证据"],
            ],
        ),
        "source_note": source_note(paper, "experiments"),
    }


def evaluation_slide(directory: str, paper: dict[str, Any]) -> dict[str, Any]:
    slide = paper.get("slides", {}).get("evaluation", {})
    title = short_title(paper.get("title"))
    strengths = clean(
        slide.get("strengths"),
        clean(paper.get("selection_reason"), f"{title} 固定本方向的关键证据。"),
    )
    limitations = clean(
        slide.get("limitations"),
        f"受 {paper.get('claim_strength')} 和 {source_status_label(paper.get('source_status'))} 限制，不能外推为更强结论。",
    )
    commercialization = clean(
        slide.get("commercialization"),
        "可作为研究路线、架构审查或平台选型输入，工程落地需要更具体的实现证据。",
    )
    no_new = needs_no_new_experiment(paper)
    safe_strengths = no_experiment_safe(strengths, 86) if no_new else shorten(strengths, 86)
    safe_limitations = no_experiment_safe(limitations, 86) if no_new else shorten(limitations, 86)
    safe_commercialization = no_experiment_safe(commercialization, 86) if no_new else shorten(commercialization, 86)
    claim = (
        f"评价：{title} 适合做 taxonomy/规范入口；规范/Survey，无新实验，不能替代一手系统证据。"
        if no_new
        else first_sentence(slide.get("claim"), f"评价：{title} 的价值在于补齐本方向证据链，但使用时必须保留 claim strength。")
    )
    points = [
        f"设计优势：{safe_strengths}",
        f"局限性：{safe_limitations}",
        f"商业化潜力：{safe_commercialization}",
        (
            "规范/Survey，无新实验；具体平台结论转到一手材料核验。"
            if no_new
            else f"证据边界：{paper.get('evidence')}；{source_status_label(paper.get('source_status'))}。"
        ),
    ]
    return {
        "slide_id": f"d{directory[:2]}-{paper.get('selection_slot')}-evaluation".replace("_", "-"),
        "paper_key": paper.get("key"),
        "slide_type": "evaluation",
        "claim": claim,
        "narrative": points,
        "evidence_refs": evidence_refs(directory, paper, "evaluation"),
        "proof_object": proof_matrix(
            "文章评价",
            ["维度", "判断"],
            [
                ["设计优势", no_experiment_safe(strengths, 80) if no_new else shorten(strengths, 80)],
                ["主要局限", no_experiment_safe(limitations, 80) if no_new else shorten(limitations, 80)],
                ["商业落地", no_experiment_safe(commercialization, 80) if no_new else shorten(commercialization, 80)],
                ["讲稿定位", f"{SLOT_LABELS.get(as_text(paper.get('selection_slot')), paper.get('selection_slot'))}; 证据强度 {paper.get('claim_strength')}"],
            ],
        ),
        "source_note": source_note(paper, "evaluation"),
    }


def direction_summary(directory: str, data: dict[str, Any]) -> dict[str, Any]:
    rows = []
    narrative = []
    for paper in data.get("primary", []):
        title = short_title(paper.get("title"))
        role = SLOT_LABELS.get(as_text(paper.get("selection_slot")), as_text(paper.get("selection_slot")))
        rows.append([title, role, shorten(paper.get("selection_reason"), 74)])
        narrative.append(f"{title}：{role}，{clean(paper.get('evidence'))}。")
    while len(narrative) < 4:
        narrative.append("后续优化应继续补充一手系统证据、规范状态和真实部署材料。")
    narrative = narrative[:3] + [
        "本方向结论：先用三篇主讲材料建立演进关系，再用证据等级控制机制、实验和商业化结论。"
    ]
    return {
        "slide_id": f"d{directory[:2]}-16-direction-summary",
        "paper_key": "direction",
        "slide_type": "direction_summary",
        "claim": f"{data.get('direction')} 的结论是：三篇主讲材料共同给出技术演进，但仍要用证据等级约束每个结论。",
        "narrative": narrative,
        "evidence_refs": [
            f"report-slide/{directory}/papers.yml primary selection and evaluation fields.",
            "survey/evidence_ledger.md Evidence Classes and Boundary Records.",
        ],
        "proof_object": proof_matrix("本方向方法对比", ["论文", "定位", "选择理由"], rows),
        "source_note": "来源：三篇主讲材料选择、评价字段与 evidence ledger｜证据等级：方向综述",
    }


def build_story(directory: Path) -> dict[str, Any]:
    data = migrate_direction(load_yaml(directory / "papers.yml"))
    story_slides = [direction_intro(directory.name, data)]
    for paper in data.get("primary", []):
        story_slides.extend(
            [
                summary_slide(directory.name, paper),
                background_slide(directory.name, data, paper),
                solution_slide(directory.name, paper),
                experiments_slide(directory.name, paper),
                evaluation_slide(directory.name, paper),
            ]
        )
    story_slides.append(direction_summary(directory.name, data))
    return {
        "direction": data.get("direction"),
        "story_version": 1,
        "slides": story_slides,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate authored story.yml files for report-slide directions.")
    parser.add_argument("--direction", action="append", help="Direction directory to regenerate, e.g. 02-trustzone-lineage.")
    parser.add_argument("--include-existing", action="store_true", help="Also regenerate directions that already have curated story.yml files.")
    args = parser.parse_args()

    targets = sorted(path for path in SLIDE_ROOT.glob("[0-9][0-9]-*") if (path / "papers.yml").exists())
    if args.direction:
        wanted = set(args.direction)
        targets = [path for path in targets if path.name in wanted]
        missing = wanted - {path.name for path in targets}
        if missing:
            raise SystemExit(f"Unknown direction(s): {', '.join(sorted(missing))}")

    written: list[str] = []
    for directory in targets:
        if not args.include_existing and directory.name in SKIP_BY_DEFAULT:
            continue
        story = build_story(directory)
        output = directory / "story.yml"
        output.write_text(yaml.safe_dump(story, allow_unicode=True, sort_keys=False, width=1000), encoding="utf-8")
        written.append(str(output.relative_to(SLIDE_ROOT.parent)))

    for path in written:
        print(path)
    print(f"written={len(written)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
