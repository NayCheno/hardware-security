from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Sequence


ROOT = Path(__file__).resolve().parents[1]
SURVEY_DIR = ROOT / "survey"
REPORT_DIR = ROOT / "report-slide"
OUT_DIR = ROOT / "out"


class BuildError(RuntimeError):
    pass


def run(command: Sequence[str], *, cwd: Path) -> None:
    printable = " ".join(command)
    print(f"$ {printable}", flush=True)
    try:
        subprocess.run(command, cwd=cwd, check=True)
    except FileNotFoundError as exc:
        raise BuildError(f"Required command not found: {command[0]}") from exc
    except subprocess.CalledProcessError as exc:
        raise BuildError(f"Command failed with exit code {exc.returncode}: {printable}") from exc


def copy_artifact(source: Path, target_name: str) -> Path:
    if not source.exists():
        raise BuildError(f"Expected artifact was not produced: {source}")
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    target = OUT_DIR / target_name
    shutil.copy2(source, target)
    print(f"wrote {target.relative_to(ROOT)}", flush=True)
    return target


def build_survey() -> None:
    print("==> Building survey PDF", flush=True)
    run(["pdflatex", "-interaction=nonstopmode", "main.tex"], cwd=SURVEY_DIR)
    run(["bibtex", "main"], cwd=SURVEY_DIR)
    run(["pdflatex", "-interaction=nonstopmode", "main.tex"], cwd=SURVEY_DIR)
    run(["pdflatex", "-interaction=nonstopmode", "main.tex"], cwd=SURVEY_DIR)
    copy_artifact(SURVEY_DIR / "main.pdf", "survey.pdf")


def build_report_pdf() -> None:
    print("==> Building report PDF", flush=True)
    run([sys.executable, "tools/validate_content.py"], cwd=REPORT_DIR)
    run([sys.executable, "tools/generate_beamer.py"], cwd=REPORT_DIR)
    run(["xelatex", "-interaction=nonstopmode", "main.tex"], cwd=REPORT_DIR)
    run(["xelatex", "-interaction=nonstopmode", "main.tex"], cwd=REPORT_DIR)
    copy_artifact(REPORT_DIR / "main.pdf", "report.pdf")


def build_report_pptx() -> None:
    print("==> Building report PPTX", flush=True)
    run([sys.executable, "tools/validate_content.py"], cwd=REPORT_DIR)
    run(["node", "pptx/build.mjs"], cwd=REPORT_DIR)
    copy_artifact(REPORT_DIR / "output" / "hardware-security-report-slide.pptx", "report.pptx")


def build_report() -> None:
    build_report_pdf()
    build_report_pptx()


def clean_out() -> None:
    if OUT_DIR.exists():
        shutil.rmtree(OUT_DIR)
        print(f"removed {OUT_DIR.relative_to(ROOT)}", flush=True)
    else:
        print("out/ is already clean", flush=True)


def parse_args(argv: Sequence[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        prog="build",
        description="Build repository deliverables and copy final artifacts into out/.",
    )
    parser.add_argument(
        "target",
        choices=("all", "survey", "report", "report-pdf", "report-pptx", "clean"),
        help="Build target to run.",
    )
    return parser.parse_args(argv)


def main(argv: Sequence[str] | None = None) -> int:
    args = parse_args(sys.argv[1:] if argv is None else argv)
    try:
        if args.target == "all":
            build_survey()
            build_report()
        elif args.target == "survey":
            build_survey()
        elif args.target == "report":
            build_report()
        elif args.target == "report-pdf":
            build_report_pdf()
        elif args.target == "report-pptx":
            build_report_pptx()
        elif args.target == "clean":
            clean_out()
        else:
            raise BuildError(f"Unknown target: {args.target}")
    except BuildError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
