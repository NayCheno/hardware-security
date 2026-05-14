# Hardware Security Research

This repository organizes a hardware-security survey and its cited paper library.

## Repository Layout

```text
.
├── survey/
│   ├── main.tex
│   ├── reference.bib
│   ├── background_runtime_reference.bib
│   ├── excluded_attack_reference.bib
│   ├── candidate_reference.bib
│   ├── p0_p1_candidate_status.md
│   ├── top_conference_coverage_audit.md
│   ├── confidential_computing_of_arm_hardware.tex
│   ├── riscv_confidential_computing.tex
│   ├── confidential_io_and_network_defense.tex
│   └── security_of_hardware_design.tex
├── reference/
│   ├── README.md
│   ├── <category>/
│   │   ├── sok/
│   │   └── <paper>/
│   │       ├── paper.pdf
│   │       └── README.md
│   └── ...
├── report-slide/
│   ├── main.tex
│   ├── Makefile
│   ├── manifest.json
│   ├── config/
│   │   └── preamble.tex
│   ├── 00-overview/
│   │   └── section.tex
│   └── <direction>/
│       ├── section.tex
│       └── papers.yml
├── tools/
│   └── build.py
├── out/
│   ├── survey.pdf
│   ├── report.pdf
│   └── report.pptx
├── pyproject.toml
└── .codex/
    └── skills/
        └── reference-paper-review/
```

## Build With `uv`

Build commands are managed through the root `pyproject.toml`.
Final deliverables are copied into the repository-root `out/` directory with
stable names, while intermediate LaTeX/PPTX build files remain in their source
directories and are ignored by Git.

```bash
uv run build survey       # writes out/survey.pdf
uv run build report       # writes out/report.pdf and out/report.pptx
uv run build report-pdf   # writes out/report.pdf only
uv run build report-pptx  # writes out/report.pptx only
uv run build all          # writes all three artifacts
uv run build clean        # removes out/
```

The report PDF is generated from `report-slide/main.tex` through XeLaTeX. The
editable deck is generated from `report-slide/pptx/build.mjs`; the canonical
local PPTX path remains `report-slide/output/hardware-security-report-slide.pptx`,
and the build command also copies it to `out/report.pptx`.

## `survey/`

`survey/` contains the LaTeX survey source and build outputs. Prefer the root
`uv` command:

```bash
uv run build survey
```

The active bibliography used by the survey lives in `survey/reference.bib`; it currently contains 114 active in-scope entries, and the 正文 cites 102 unique keys with no missing BibTeX definitions. SGX runtime/container background substrate entries that are not cited by the current 正文 live in `survey/background_runtime_reference.bib`; they are retained for historical comparison only and are not active evidence. Metadata-only related-work candidates are kept separately in `survey/candidate_reference.bib`; it currently contains 152 entries, and they must not be cited in 正文 until their metadata, source, and evidence status are verified and promoted into `survey/reference.bib`. Out-of-scope attack-only bibliography entries are preserved separately in `survey/excluded_attack_reference.bib`; it currently contains 64 entries for future attack-scope work and they are not active survey evidence. The P0/P1 subset is controlled by `survey/p0_p1_candidate_status.md`, which assigns all 112 P0/P1 candidates to terminal states: active canonical coverage, explicit backlog/no substantive citation, or background substrate. The `reference/` library currently has 112 paper/spec README records and 98 verified local PDFs. The report-slide corpus keeps 15 directions and exactly 45 primary selections. The latest foundational promotion added Flicker, TrustVisor, HardBound, CHERI 2015, Sancus, TyTAN, Watchdog, AEGIS, Efficient Memory Integrity, and Bonsai Merkle Trees as active canonical references with verified local PDFs. Current counts and evidence boundaries are reconciled in `survey/evidence_ledger.md`; recent top-conference coverage is audited in `survey/top_conference_coverage_audit.md`, and one-hop expansion decisions are recorded in `survey/citation_expansion_triage.md`.

Evidence classes are defined in `survey/main.tex`: E0 official standards/specs/RFCs, E1 peer-reviewed primary papers, E2 surveys/SoKs, E3 public drafts or not-ratified releases, E4 vendor/industry evidence, and E5 metadata-only/gated/blocked sources. Slide selection now keeps `selection_slot`, `paper_type`, and `claim_strength` separate so a primary slot is not mistaken for academic SOTA status.

## `report-slide/`

`report-slide/` contains the LaTeX/Beamer source for the Chinese slide report. It is a presentation layer derived from the taxonomy and evidence matrix in `domain.md`; slide-specific structure should not be copied back into the survey matrix.

Prefer the root `uv` command:

```bash
uv run build report
```

For separate output types:

```bash
uv run build report-pdf
uv run build report-pptx
```

`report-slide/main.pdf` and `report-slide/output/hardware-security-report-slide.pptx`
are generated locally for review and are intentionally ignored by Git. The
normalized deliverable names are `out/report.pdf` and `out/report.pptx`.
`report-slide/slide-example.pdf` is a local visual reference for the desired
talk style and is not part of the tracked slide source.

## `reference/`

`reference/` stores the paper library for cited work. The intended layout is:

- `reference/<category>/`: one topic category.
- `reference/<category>/sok/`: fixed directory reserved for SoK papers in that category.
- `reference/<category>/<paper>/paper.pdf`: original PDF when publicly available.
- `reference/<category>/<paper>/README.md`: metadata, source links, download status, and paper-review notes.

See `reference/README.md` for current categories and PDF download status.

## Local Codex Skill

`.codex/skills/reference-paper-review/` defines a repository-local skill for producing deep Chinese reviewer-style analyses of papers under `reference/`.

Typical workflow:

1. Read `reference/<category>/<paper>/README.md`.
2. Use `paper.pdf` when available, otherwise use the source links recorded in the README.
3. Generate the structured paper review described by the skill.
4. Write it back to the paper README with:

```bash
python3 .codex/skills/reference-paper-review/scripts/update_readme.py \
  reference/<category>/<paper>/README.md \
  /path/to/generated-review.md
```

The script updates the `Paper Review` block idempotently using stable markers.
