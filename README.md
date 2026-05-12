# Hardware Security Research

This repository organizes a hardware-security survey and its cited paper library.

## Repository Layout

```text
.
├── survey/
│   ├── main.tex
│   ├── reference.bib
│   ├── candidate_reference.bib
│   ├── p0_p1_candidate_status.md
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
└── .codex/
    └── skills/
        └── reference-paper-review/
```

## `survey/`

`survey/` contains the LaTeX survey source and build outputs. Build from inside this directory:

```bash
cd survey
pdflatex -interaction=nonstopmode main.tex
bibtex main
pdflatex -interaction=nonstopmode main.tex
pdflatex -interaction=nonstopmode main.tex
```

The bibliography used by the survey lives in `survey/reference.bib`. Metadata-only related-work candidates are kept separately in `survey/candidate_reference.bib`; they must not be cited in正文 until their metadata, source, and evidence status are verified and promoted into `survey/reference.bib`. The P0/P1 subset is controlled by `survey/p0_p1_candidate_status.md`, which assigns all 112 P0/P1 candidates to terminal states: active canonical coverage, explicit backlog/no substantive citation, or background substrate.

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
