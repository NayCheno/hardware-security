from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from typing import Any

from content_lib import SLIDE_KEYS, as_text, direction_dirs, load_yaml, nonempty


BAD_MARKERS = re.compile(r"\b(TODO|TBD|FIXME|XXX)\b", re.IGNORECASE)
PLACEHOLDER_MARKERS = (
    "论文提供系统评估",
    "具体数值需",
    "具体数值回引",
    "回引原文",
    "待回到本地 PDF",
    "证据不足，待",
)
AUTHORED_SLIDE_TYPES = (
    "direction_intro",
    "summary",
    "background",
    "solution",
    "experiments",
    "evaluation",
    "direction_summary",
)
SELECTION_SLOTS = ("primary_1", "primary_2", "primary_3")
PAPER_TYPES = {"system", "spec", "sok", "survey", "vendor", "contrast", "background"}


def fail(errors: list[str], path: Path, message: str) -> None:
    errors.append(f"{path}: {message}")


def contains_bad_marker(value: Any) -> bool:
    if isinstance(value, dict):
        return any(contains_bad_marker(item) for item in value.values())
    if isinstance(value, list):
        return any(contains_bad_marker(item) for item in value)
    return bool(BAD_MARKERS.search(as_text(value)))


def joined(value: Any) -> str:
    if isinstance(value, dict):
        return " ".join(joined(item) for item in value.values())
    if isinstance(value, list):
        return " ".join(joined(item) for item in value)
    return as_text(value)


def validate_primary(
    errors: list[str],
    path: Path,
    primary: dict[str, Any],
    index: int,
    *,
    require_slides: bool = True,
) -> None:
    key = as_text(primary.get("key")) or f"primary[{index}]"
    required_meta = (
        "key",
        "selection_slot",
        "paper_type",
        "claim_strength",
        "selection_reason",
        "evidence_type",
        "maturity",
        "pdf_status",
        "source_url",
        "evidence",
        "source_status",
        "reference",
        "title",
    )
    for field in required_meta:
        if not nonempty(primary.get(field)):
            fail(errors, path, f"{key}: missing required metadata field `{field}`")

    evidence = as_text(primary.get("evidence"))
    if not re.search(r"\bE[0-5]\b", evidence):
        fail(errors, path, f"{key}: evidence must include E0-E5 class, got `{evidence}`")
    claim_strength = as_text(primary.get("claim_strength"))
    if not re.search(r"\bE[0-5]\b", claim_strength):
        fail(errors, path, f"{key}: claim_strength must include E0-E5 class, got `{claim_strength}`")
    paper_type = as_text(primary.get("paper_type"))
    if paper_type not in PAPER_TYPES:
        fail(errors, path, f"{key}: unsupported paper_type `{paper_type}`")

    if not require_slides:
        if contains_bad_marker(primary):
            fail(errors, path, f"{key}: contains TODO/TBD/FIXME marker")
        return

    slides = primary.get("slides")
    if not isinstance(slides, dict):
        fail(errors, path, f"{key}: missing `slides` mapping")
        return

    for slide_key in SLIDE_KEYS:
        slide = slides.get(slide_key)
        if not isinstance(slide, dict):
            fail(errors, path, f"{key}: missing slides.{slide_key}")
            continue
        if not nonempty(slide.get("claim")):
            fail(errors, path, f"{key}: slides.{slide_key}.claim is empty")
        if slide_key == "evaluation":
            for field in ("strengths", "limitations", "commercialization"):
                if not nonempty(slide.get(field)):
                    fail(errors, path, f"{key}: slides.evaluation.{field} is empty")
        else:
            if not nonempty(slide.get("points")):
                fail(errors, path, f"{key}: slides.{slide_key}.points is empty")
            visual = slide.get("visual")
            if not isinstance(visual, dict) or not nonempty(visual.get("title")) or not nonempty(visual.get("items")):
                fail(errors, path, f"{key}: slides.{slide_key}.visual needs title and items")

    experiment_text = joined(slides.get("experiments", {}))
    evidence_type = f"{as_text(primary.get('evidence_type'))} {as_text(primary.get('evidence'))}".lower()
    if ("survey" in evidence_type or "sok" in evidence_type or "spec" in evidence_type or "standard" in evidence_type or "e0" in evidence_type or "e2" in evidence_type) and "无新实验" not in experiment_text:
        fail(errors, path, f"{key}: spec/survey evidence experiments must state `无新实验`")

    if contains_bad_marker(primary):
        fail(errors, path, f"{key}: contains TODO/TBD/FIXME marker")


def validate_authored_story(
    errors: list[str],
    story_path: Path,
    primary_keys: set[str],
) -> int:
    story = load_yaml(story_path)
    slides = story.get("slides")
    if not isinstance(slides, list):
        fail(errors, story_path, "`slides` must be a list")
        return 0
    if len(slides) != 17:
        fail(errors, story_path, f"expected 17 authored slides, found {len(slides)}")

    expected_per_paper = set(SLIDE_KEYS)
    seen: dict[str, set[str]] = {key: set() for key in primary_keys}
    seen_ids: set[str] = set()

    for index, slide in enumerate(slides, start=1):
        if not isinstance(slide, dict):
            fail(errors, story_path, f"slides[{index}] must be a mapping")
            continue
        slide_id = as_text(slide.get("slide_id"))
        paper_key = as_text(slide.get("paper_key"))
        slide_type = as_text(slide.get("slide_type"))
        prefix = slide_id or f"slides[{index}]"

        for field in ("slide_id", "paper_key", "slide_type", "claim", "narrative", "evidence_refs", "proof_object", "source_note"):
            if not nonempty(slide.get(field)):
                fail(errors, story_path, f"{prefix}: missing `{field}`")
        if slide_id in seen_ids:
            fail(errors, story_path, f"{prefix}: duplicate slide_id")
        seen_ids.add(slide_id)
        if slide_type not in AUTHORED_SLIDE_TYPES:
            fail(errors, story_path, f"{prefix}: unsupported slide_type `{slide_type}`")
        if paper_key not in primary_keys and paper_key != "direction":
            fail(errors, story_path, f"{prefix}: paper_key `{paper_key}` is not a primary key or `direction`")
        if paper_key in primary_keys:
            seen[paper_key].add(slide_type)
            refs = joined(slide.get("evidence_refs"))
            if not re.search(r"\b(p\.|pp\.|Fig\.|Figure|Table|§|Section)\b", refs):
                fail(errors, story_path, f"{prefix}: evidence_refs must include page/figure/table/section evidence")

        narrative = slide.get("narrative")
        if not isinstance(narrative, list) or not all(as_text(item) for item in narrative):
            fail(errors, story_path, f"{prefix}: narrative must be a non-empty list of text")
        evidence_refs = slide.get("evidence_refs")
        if not isinstance(evidence_refs, list) or not all(as_text(item) for item in evidence_refs):
            fail(errors, story_path, f"{prefix}: evidence_refs must be a non-empty list of text")
        proof_object = slide.get("proof_object")
        if not isinstance(proof_object, dict):
            fail(errors, story_path, f"{prefix}: proof_object must be a mapping")
        else:
            for field in ("type", "title"):
                if not nonempty(proof_object.get(field)):
                    fail(errors, story_path, f"{prefix}: proof_object.{field} is empty")
            if not nonempty(proof_object.get("data")):
                fail(errors, story_path, f"{prefix}: proof_object.data is empty")

        text = joined(slide)
        if contains_bad_marker(slide):
            fail(errors, story_path, f"{prefix}: contains TODO/TBD/FIXME marker")
        for marker in PLACEHOLDER_MARKERS:
            if marker in text:
                fail(errors, story_path, f"{prefix}: contains placeholder phrase `{marker}`")

    for key, slide_types in seen.items():
        missing = expected_per_paper - slide_types
        extra = slide_types - expected_per_paper
        if missing:
            fail(errors, story_path, f"{key}: missing authored slide types {sorted(missing)}")
        if extra:
            fail(errors, story_path, f"{key}: unexpected authored slide types {sorted(extra)}")

    return sum(len(types & expected_per_paper) for types in seen.values())


def validate_direction(errors: list[str], path: Path) -> tuple[int, int]:
    data = load_yaml(path)
    story_path = path.with_name("story.yml")
    has_story = story_path.exists()
    if not nonempty(data.get("direction")):
        fail(errors, path, "missing `direction`")
    if not nonempty(data.get("focus")):
        fail(errors, path, "missing `focus`")
    if not nonempty(data.get("selection_rule")):
        fail(errors, path, "missing `selection_rule`")

    primary = data.get("primary")
    if not isinstance(primary, list):
        fail(errors, path, "`primary` must be a list")
        return 0, 0
    if len(primary) != 3:
        fail(errors, path, f"expected exactly 3 primary entries, found {len(primary)}")

    selection_slots = [as_text(item.get("selection_slot")) for item in primary if isinstance(item, dict)]
    if selection_slots != list(SELECTION_SLOTS):
        fail(errors, path, f"selection_slot values must be {list(SELECTION_SLOTS)}, got {selection_slots}")

    for index, item in enumerate(primary, start=1):
        if not isinstance(item, dict):
            fail(errors, path, f"primary[{index}] must be a mapping")
            continue
        validate_primary(errors, path, item, index, require_slides=not has_story)

    if has_story:
        primary_keys = {as_text(item.get("key")) for item in primary if isinstance(item, dict) and as_text(item.get("key"))}
        paper_slide_count = validate_authored_story(errors, story_path, primary_keys)
    else:
        paper_slide_count = len(primary) * 5

    return len(primary), paper_slide_count


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate report-slide content.")
    parser.add_argument("--direction", help="Validate only one direction directory, e.g. 12-memory-io-fabrics.")
    args = parser.parse_args()

    errors: list[str] = []
    dirs = direction_dirs()
    if args.direction:
        dirs = [directory for directory in dirs if directory.name == args.direction]
        if not dirs:
            errors.append(f"unknown direction `{args.direction}`")
    elif len(dirs) != 15:
        errors.append(f"expected 15 direction directories, found {len(dirs)}")

    primary_count = 0
    paper_slide_count = 0
    for directory in dirs:
        count, slides = validate_direction(errors, directory / "papers.yml")
        primary_count += count
        paper_slide_count += slides

    if not args.direction and primary_count != 45:
        errors.append(f"expected 45 primary papers, found {primary_count}")
    if not args.direction and paper_slide_count != 225:
        errors.append(f"expected 225 paper detail slides, found {paper_slide_count}")

    if errors:
        print("report-slide content validation failed:", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1

    print(
        f"report-slide content validation passed: {len(dirs)} directions, {primary_count} primary papers, {paper_slide_count} paper detail slides."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
