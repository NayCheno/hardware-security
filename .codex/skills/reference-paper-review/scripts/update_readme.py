#!/usr/bin/env python3
"""Insert or replace the Paper Review section in a reference README."""

from __future__ import annotations

import argparse
from pathlib import Path

BEGIN = "<!-- BEGIN PAPER REVIEW -->"
END = "<!-- END PAPER REVIEW -->"
HEADING = "## Paper Review"


def normalize_review(text: str) -> str:
    text = text.strip()
    if not text:
        raise ValueError("review markdown is empty")

    if text.startswith(BEGIN):
        text = text[len(BEGIN) :].strip()
    if text.endswith(END):
        text = text[: -len(END)].strip()

    if not text.startswith(HEADING):
        text = f"{HEADING}\n\n{text}"

    return f"{BEGIN}\n{text.rstrip()}\n{END}\n"


def update_readme(readme_path: Path, review_path: Path) -> None:
    if not readme_path.exists():
        raise FileNotFoundError(f"README not found: {readme_path}")
    if not review_path.exists():
        raise FileNotFoundError(f"review markdown not found: {review_path}")

    readme = readme_path.read_text(encoding="utf-8").rstrip()
    block = normalize_review(review_path.read_text(encoding="utf-8"))

    begin_index = readme.find(BEGIN)
    end_index = readme.find(END)
    if begin_index != -1 and end_index != -1 and end_index > begin_index:
        end_index += len(END)
        updated = f"{readme[:begin_index].rstrip()}\n\n{block}{readme[end_index:].lstrip()}"
    elif begin_index == -1 and end_index == -1:
        updated = f"{readme}\n\n{block}"
    else:
        raise ValueError("README has mismatched paper review markers")

    readme_path.write_text(updated.rstrip() + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("readme", type=Path, help="reference paper README.md")
    parser.add_argument("review", type=Path, help="generated paper review markdown")
    args = parser.parse_args()
    update_readme(args.readme, args.review)


if __name__ == "__main__":
    main()
