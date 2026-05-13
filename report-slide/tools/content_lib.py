from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

import yaml


REPO_ROOT = Path(__file__).resolve().parents[2]
SLIDE_ROOT = REPO_ROOT / "report-slide"
DIRECTION_RE = re.compile(r"^\d{2}-")
SLIDE_KEYS = ("summary", "background", "solution", "experiments", "evaluation")


class ContentError(RuntimeError):
    pass


def direction_dirs() -> list[Path]:
    return sorted(
        path
        for path in SLIDE_ROOT.iterdir()
        if path.is_dir() and DIRECTION_RE.match(path.name) and (path / "papers.yml").exists()
    )


def load_yaml(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        data = yaml.safe_load(handle)
    if not isinstance(data, dict):
        raise ContentError(f"{path}: expected a YAML mapping")
    return data


def load_deck() -> list[dict[str, Any]]:
    deck: list[dict[str, Any]] = []
    for directory in direction_dirs():
        data = load_yaml(directory / "papers.yml")
        data["_directory"] = directory.name
        data["_path"] = str(directory / "papers.yml")
        story_path = directory / "story.yml"
        if story_path.exists():
            data["_story"] = load_yaml(story_path)
            data["_story_path"] = str(story_path)
        deck.append(data)
    return deck


def dump_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, indent=2)


def as_text(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return value.strip()
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, list):
        return "；".join(as_text(item) for item in value if as_text(item))
    if isinstance(value, dict):
        return "；".join(f"{key}: {as_text(item)}" for key, item in value.items() if as_text(item))
    return str(value).strip()


def nonempty(value: Any) -> bool:
    if isinstance(value, str):
        return bool(value.strip())
    if isinstance(value, list):
        return any(nonempty(item) for item in value)
    if isinstance(value, dict):
        return any(nonempty(item) for item in value.values())
    return value is not None


def split_points(text: str, *, limit: int = 4) -> list[str]:
    normalized = re.sub(r"\s+", " ", text.strip())
    if not normalized:
        return []
    parts = re.split(r"(?<=[。；;])\s+|(?<=[。；;])", normalized)
    points = [part.strip(" ；;。") for part in parts if part.strip(" ；;。")]
    if not points:
        points = [normalized]
    merged: list[str] = []
    for point in points:
        if len(point) < 14 and merged:
            merged[-1] = f"{merged[-1]}；{point}"
        else:
            merged.append(point)
    if len(merged) > limit:
        merged = merged[: limit - 1] + ["；".join(merged[limit - 1 :])]
    return merged


def concise_claim(text: str, fallback: str, *, max_chars: int = 74) -> str:
    points = split_points(text, limit=1)
    claim = points[0] if points else fallback
    claim = claim.strip(" ；;。")
    if len(claim) <= max_chars:
        return claim
    return claim[: max_chars - 1].rstrip(" ，,；;") + "。"


def migrate_primary(primary: dict[str, Any]) -> dict[str, Any]:
    """Return a primary entry with the v2 `slides` shape.

    The migration is deterministic and keeps all evidence metadata. Legacy fields
    are removed so `slides` is the presentation content source.
    """

    migrated = dict(primary)
    if isinstance(migrated.get("slides"), dict):
        return migrated

    title = as_text(migrated.get("title")) or as_text(migrated.get("key"))
    evidence = as_text(migrated.get("evidence"))
    selection_slot = as_text(migrated.get("selection_slot") or migrated.get("role"))
    paper_type = as_text(migrated.get("paper_type"))
    source_status = as_text(migrated.get("source_status") or migrated.get("pdf_status"))
    evidence_type = as_text(migrated.get("evidence_type"))
    maturity = as_text(migrated.get("maturity"))
    key_technologies = migrated.get("key_technologies") or []
    if not isinstance(key_technologies, list):
        key_technologies = split_points(as_text(key_technologies), limit=5)
    evaluation = migrated.get("evaluation") or {}
    if not isinstance(evaluation, dict):
        evaluation = {"strengths": as_text(evaluation), "limitations": "", "commercialization": ""}

    slides = {
        "summary": {
            "claim": concise_claim(as_text(migrated.get("summary")), f"{title} 固定本方向的证据坐标。"),
            "points": split_points(as_text(migrated.get("summary")), limit=4),
            "visual": {
                "title": "证据定位",
                "items": [
                    f"槽位：{selection_slot}",
                    f"类型：{paper_type}",
                    f"证据：{evidence}",
                    f"来源：{source_status}",
                ],
            },
        },
        "background": {
            "claim": concise_claim(as_text(migrated.get("background")), "研究问题来自保护对象和可信边界的错位。"),
            "points": split_points(as_text(migrated.get("background")), limit=4),
            "visual": {
                "title": "问题边界",
                "items": [
                    "保护对象",
                    "攻击/管理边界",
                    "现有方法缺口",
                ],
            },
        },
        "solution": {
            "claim": concise_claim(as_text(migrated.get("insight_solution")), "方案的关键是把抽象安全目标落到可执行机制。"),
            "points": split_points(as_text(migrated.get("insight_solution")), limit=4),
            "visual": {
                "title": "关键机制",
                "items": [as_text(item) for item in key_technologies if as_text(item)],
            },
        },
        "experiments": {
            "claim": concise_claim(as_text(migrated.get("experiment_claim")), "实验结论必须跟证据等级一起阅读。"),
            "points": split_points(as_text(migrated.get("experiment_claim")), limit=4),
            "visual": {
                "title": "证据强度",
                "items": [
                    f"类型：{evidence_type}",
                    f"成熟度：{maturity}",
                    f"PDF：{as_text(migrated.get('pdf_status'))}",
                ],
            },
        },
        "evaluation": {
            "claim": concise_claim(
                as_text(evaluation.get("strengths")),
                "评价同时看贡献、短板和商业化条件。",
            ),
            "strengths": as_text(evaluation.get("strengths")),
            "limitations": as_text(evaluation.get("limitations")),
            "commercialization": as_text(evaluation.get("commercialization")),
        },
    }

    migrated["slides"] = slides
    for legacy_key in (
        "summary",
        "background",
        "insight_solution",
        "key_technologies",
        "experiment_claim",
        "evaluation",
    ):
        migrated.pop(legacy_key, None)
    return migrated


def migrate_direction(data: dict[str, Any]) -> dict[str, Any]:
    migrated = dict(data)
    migrated["primary"] = [migrate_primary(primary) for primary in migrated.get("primary", [])]
    return migrated


def latex_escape(value: Any) -> str:
    text = as_text(value)
    replacements = {
        "\\": r"\textbackslash{}",
        "&": r"\&",
        "%": r"\%",
        "$": r"\$",
        "#": r"\#",
        "_": r"\_",
        "{": r"\{",
        "}": r"\}",
        "~": r"\textasciitilde{}",
        "^": r"\textasciicircum{}",
    }
    return "".join(replacements.get(char, char) for char in text)


def latex_itemize(points: list[Any]) -> str:
    clean = [latex_escape(point) for point in points if as_text(point)]
    if not clean:
        return r"\begin{itemize}\item 证据不足，待回到本地 PDF 或官方来源补全。\end{itemize}"
    body = "\n".join(f"  \\item {point}" for point in clean)
    return "\\begin{itemize}\n" + body + "\n\\end{itemize}"
