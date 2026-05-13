# Evidence Ledger

Last reconciled: 2026-05-13

This ledger is the current count and boundary record for `survey/`,
`reference/`, and `report-slide/`. Older audit files explain how a source
entered the corpus; this file records the current state after PDF recovery,
attestation-lineage promotion, foundational backlog promotion, and the
three-slot slide selection pass.

## Current Counts

| Corpus item | Count | Source of truth |
|---|---:|---|
| Active in-scope BibTeX entries | 114 | `survey/reference.bib` entries |
| Survey 正文 cited keys | 102 | `\cite{...}` keys in `survey/*.tex`; all resolve in `survey/reference.bib` |
| Background runtime BibTeX entries | 2 | `survey/background_runtime_reference.bib` |
| Excluded attack-only BibTeX entries | 64 | `survey/excluded_attack_reference.bib` |
| Metadata-only candidates | 152 | `survey/candidate_reference.bib` |
| P0/P1 candidate terminal states | 112 | `survey/p0_p1_candidate_status.md` |
| Reference entry READMEs | 112 | `reference/**/README.md` files with `- BibTeX key:` |
| Verified local `paper.pdf` files | 98 | `reference/**/paper.pdf` |
| Slide directions | 15 | `report-slide/manifest.json` |
| Slide primary selections | 45 | exactly 3 primary entries per direction |

## Evidence Classes

| Class | Meaning | Allowed claim strength |
|---|---|---|
| E0 | Official standard, specification, RFC, or ratified release | Normative mechanism, state, terminology, and interface claims only. |
| E1 | Peer-reviewed primary paper with public paper/spec evidence | System design, implementation, and measured-results claims within the paper's threat model. |
| E2 | SoK, survey, taxonomy, or literature-review anchor | Taxonomy, coverage, and related-work framing; mechanism claims must cite original papers/specs. |
| E3 | Public draft, release candidate, arXiv/preprint, or not-ratified specification | Emerging-direction evidence; status must be explicit and results cannot be overstated. |
| E4 | Vendor, industry, whitepaper, documentation, or product evidence | Product behavior, deployment practice, or engineering building-block claims. |
| E5 | Metadata-only, gated, blocked, HTML-only, or source-limited evidence | Bibliographic/background status only; no strong mechanism or performance claim. |

## Taxonomy Axes

| Axis | Values used in this corpus | Enforcement rule |
|---|---|---|
| Survey lane | Arm/RISC-V confidential-computing defense; confidential-computing network/I/O/data-path defense; ISA/hardware-design defense | New sources must map to one lane before promotion into active evidence. |
| Protected object | Realm/TVM/enclave memory; device/DMA/MMIO/interrupt path; boot/attestation evidence; NIC/DPU/accelerator endpoint; ISA memory/control-flow state | Do not reuse evidence for a different protected object without an explicit bridge source. |
| Mechanism type | Access control/ownership; encryption/integrity/freshness; attestation/evidence chain; trusted I/O/device lifecycle; hardware memory safety/CFI | Keep access-control, encryption, attestation, and device-lifecycle claims separate. |
| Selection slot | primary_1, primary_2, primary_3, auxiliary, background, candidate | Each slide direction has exactly three primary entries; slot position is presentation structure, not academic status. |
| Paper type | system, spec, sok, survey, vendor, contrast, background | Paper type records what the source is; it is independent from slide position and evidence class. |
| Claim strength | E0, E1, E2, E3, E4, E5 | Claim strength records the strongest class of claim this source can support. |
| Maturity | ratified, published, survey, vendor, draft/not ratified, preprint, metadata-only | Draft/preprint/metadata status must be visible in slides and prose. |
| Source status | local_pdf_verified, source_verified_pdf_unavailable, source-limited, member-gated, metadata-only, html-only | Source/PDF verifiability status; independent from maturity and claim strength. |
| Legacy role | existing `role` strings such as foundational, sota_1, sota_2, spec_foundation, or contrast | Compatibility text only; not a source of academic status, evidence class, claim strength, maturity, or source status. |

## Slide Primary Ledger

| Direction | Primary 1 | Primary 2 | Primary 3 |
|---|---|---|---|
| `01-tee-taxonomy` | `li2024sokteechoices` (E2 peer-reviewed taxonomy anchor) | `boubakri2025riscvtee` (E2 survey) | `sok-tee` (E2) |
| `02-trustzone-lineage` | `arm_trustzone_whitepaper` (E4) | `pinto2019trustzone` (E2) | `cerdeira2020trustzone` (E2) |
| `03-arm-cca-rme-rmm` | `li2022cca` (E1) | `arm_cca_spec` (E0) | `arm_rmm_spec` (E0) |
| `04-arm-cca-deployment` | `zhang2023shelter` (E1) | `zhou2025rcontainer` (E1) | `liu2025nanozone` (E3) |
| `05-arm-cca-io-accelerator-interrupt` | `acai2023` (E3) | `bertschi2026devlore` (E3) | `sok-tee` (E2) |
| `06-attestation-boot-lifecycle` | `seshadri2004swatt` (E1) | `rats_rfc` (E0) | `nunes2019vrased` (E1) |
| `07-riscv-primitives` | `riscv_privileged` (E0) | `riscv_iommu_2023` (E0) | `riscv_aia_2023` (E0) |
| `08-riscv-tee-lineage` | `lee2020keystone` (E1) | `feng2021penglai` (E1) | `schrammel2023spearv` (E1) |
| `09-riscv-cove-ap-tee` | `sahita2023cove` (E3 public preprint/proposal) | `riscv_ap_tee_2024` (E3) | `boubakri2025riscvtee` (E2 survey) |
| `10-riscv-cove-io-tee-io` | `feng2024siopmp` (E1) | `riscv_cove_io_2026` (E3) | `riscv_iommu_2023` (E0) |
| `11-memory-encryption-integrity-replay` | `henson2014memory` (E2) | `rogers2007bonsai` (E1 memory-integrity/freshness mechanism) | `amd_sev_snp` (E4 industry evidence) |
| `12-memory-io-fabrics` | `gouk2022directcxl` (E1 primary systems) | `zhong2024cxltiers` (E1 primary systems) | `wang2025odrp` (E1 primary systems) |
| `13-confidential-io-protocol-device-endpoint` | `dmtf_spdm_2025` (E0) | `riscv_cove_io_2026` (E3) | `weinhold2025tlsra` (E1 endpoint/channel binding) |
| `14-accelerator-dpu-smartnic-offload` | `zhu2020hetee` (E1) | `dhar2024cloudscale` (E1) | `wang2026cage` (E1) |
| `15-smartnic-trusted-nic-storage` | `zhou2024snic` (E1) | `giantsidi2025tnic` (E1) | `chrapek2026hazel` (E3) |

## Boundary Records

| Key / family | Current status | Boundary |
|---|---|---|
| `boubakri2025riscvtee` | E2 peer-reviewed survey; MDPI HTML and local PDF verified | Use for RISC-V TEE taxonomy/background only; original papers/specs carry mechanism claims. |
| `fan2025xputee`, `xia2021sgxfpga` | E5/source-limited; DOI or metadata verified, public PDF blocked | Use as lineage/baseline metadata only; no strong mechanism or performance claims. |
| `pcisig_tdisp_2022`, `pcisig_tdisp_xt_2025` | E5 public metadata/member-gated | Use for existence and affected-area metadata only; no normative TDISP state-machine details. |
| `arm_cca_spec`, `arm_rmm_spec` | Official Arm source pages verified; no local public PDF | Use public concepts and official page evidence; avoid unstated private ABI/state-machine details. |
| `liu2025lesstrust`, `chen2024mraima` | Metadata/source verified, no local PDF | Mention as source-limited context only unless public PDF is recovered. |
| DirectCXL/CXL-Tiers/ODRP | E1 primary systems | Use as memory/fabric background systems; not as surveys or confidential-computing security proof. |
| `abera2016cflat`, `dessouky2017lofat`, `nunes2019vrased`, `ferraiuolo2017komodo` | Active E1 references with verified PDFs | Use for runtime/control-flow attestation and verified enclave lineage only. |
| `mccune2008flicker`, `mccune2010trustvisor`, `noorman2013sancus`, `koeberl2015tytan` | Active E1 references with verified PDFs | Use for foundational TEE/attestation/embedded trust-anchor lineage only; do not infer modern CCA/CoVE production semantics. |
| `devietti2008hardbound`, `nagarakatte2012watchdog`, `watson2015cheri` | Active E1 references with verified PDFs | Use for capability and hardware memory-safety lineage; modern CHERI/CHERIoT/RV-CURE claims still require their current primary/spec evidence. |
| `suh2003aegis`, `suh2003memoryintegrity`, `rogers2007bonsai` | Active E1 references with verified PDFs | Use for secure-processor memory encryption/integrity/freshness lineage; vendor/spec-only CCA/SEV-SNP sources must not be the sole mechanism proof for replay/freshness claims. |
| `schneider2022soktee` | Supplementary E3/preprint taxonomy boundary in `01-tee-taxonomy` | Keep as historical hardware-supported TEE SoK context; do not present it as the peer-reviewed taxonomy anchor. |
| `arm_cca_spec` in direction 11 | Auxiliary E0 ownership/access-control contrast | Use for Realm memory ownership and lifecycle vocabulary only; not as memory-integrity/freshness primary evidence. |
| `li2024folio` in direction 13 | Auxiliary E3 contrast/related work | Use to show high-performance confidential networking without trusting I/O devices; not as protocol/device-endpoint primary evidence. |
| Attack-only bibliography | 64 excluded entries | Do not promote into active defense/spec evidence without a new attack-scope plan. |

## Validation Commands

```powershell
rg -n "114 active|112 paper/spec entry READMEs|98 verified local PDFs|45 primary|15 slide directions" README.md domain.md reference/README.md survey report-slide/README.md
@'
from pathlib import Path
import json, re
bib = Path("survey/reference.bib").read_text(encoding="utf-8")
active = len(re.findall(r"(?m)^\s*@\w+\s*\{", bib))
keys = set()
for path in Path("survey").glob("*.tex"):
    text = path.read_text(encoding="utf-8")
    for match in re.finditer(r"\\(?:cite|citep|citet|parencite|textcite)\s*\{([^}]*)\}", text):
        keys.update(key.strip() for key in match.group(1).split(",") if key.strip())
manifest = json.loads(Path("report-slide/manifest.json").read_text(encoding="utf-8"))
directions = manifest if isinstance(manifest, list) else manifest["directions"]
primary = sum(len(direction["primary"]) for direction in directions)
print(active, len(keys), len(directions), primary)
'@ | python -
git diff --check
```
