# PDF Recovery Log

Last updated: 2026-05-12

## Workflow

For missing PDFs, use this source order before changing `pdf_status`:

1. Official publisher, conference, standards-body, or project page.
2. Author homepage, university mirror, institutional repository, arXiv, OpenReview, Internet Archive, or another verifiable public mirror.
3. Reject clearly unauthorized or shadow-library sources. ResearchGate request-only pages, abstract pages, and citation index pages are metadata evidence only.
4. Accept a PDF only after verifying title, authors, year/venue, and first-page text with `pdfinfo` and `pdftotext`.

## Recovered PDFs

| Key | Status | Verified PDF source | Verification |
| --- | --- | --- | --- |
| `boubakri2025riscvtee` | `local_pdf_verified` | `https://mdpi-res.com/d_attachment/electronics/electronics-14-04171/article_deploy/electronics-14-04171.pdf` | `pdfinfo` reports title *A Survey of RISC-V Secure Enclaves and Trusted Execution Environments*, authors Marouene Boubakri and Belhassen Zouari, 35 pages; page 1 shows Electronics 2025 DOI `10.3390/electronics14214171`. |
| `arm_trustzone_whitepaper` | `local_pdf_verified` | `https://documentation-service.arm.com/static/5f212796500e883ab8e74531` | `pdfinfo` reports title *ARM Security Technology Building a Secure System using TrustZone Technology*, 108 pages; page 1 shows PRD29-GENC-009492C and ARM copyright. |
| `arm_rme_spec` | `local_pdf_verified` | `https://documentation-service.arm.com/static/60d32e78677cf7536a55bad7` | `pdfinfo` reports title *Arm Architecture Reference Manual Supplement, The Realm Management Extension (RME), for Armv9-A*, document DDI0615, 617 pages. |

## Still Unavailable Or Gated

| Key | Attempted sources | Current status | Claim boundary |
| --- | --- | --- | --- |
| `liu2025lesstrust` | IEEE DOI page; author homepage `https://erhade.github.io/`; PKU institutional repository `https://ir.pku.edu.cn/handle/20.500.11897/776812`; ResearchGate request-only page | `source_verified_pdf_unavailable` | Peer-reviewed TIFS metadata is verified; do not cite detailed mechanism or performance numbers without a public PDF. |
| `arm_cca_spec` | Official Arm pages `https://developer.arm.com/documentation/den0125/latest` and `https://developer.arm.com/documentation/den0125/0400`; local automated access returned HTML/access-denied and no public static PDF endpoint was verified | `source_verified_pdf_unavailable` | Use public architecture concepts from the source page and the peer-reviewed Arm CCA paper; do not claim local PDF review. |
| `arm_rmm_spec` | Official Arm page and CDN URL `https://developer.arm.com/-/cdn-downloads/permalink/PDF/Architectures/DEN0137_1.0-rel0-rc1_rmm-arch_external.pdf`; local download returned access-denied HTML | `source_verified_pdf_unavailable` | Use only public RMM/RMI/RSI lifecycle concepts already supported by source-page evidence and stronger papers; do not claim local PDF review. |
| `fan2025xputee` | ACM DOI/PDF endpoint; ACM-indexed metadata; CiteDrive/Mendeley metadata; Zhichao Hua homepage | `source_verified_pdf_unavailable` / E5 source-limited | Keep as GPU heterogeneous TEE metadata only; do not use detailed threat model or benchmark claims. |
| `xia2021sgxfpga` | IEEE Xplore; Rutgers/ResearchWithNJ metadata; ResearchGate request-only page | `source_verified_pdf_unavailable` / E5 source-limited | Keep as CPU-FPGA lineage marker only; do not use mechanism or performance claims. |
| `chen2024mraima` | IEEE DOI; ICCCS 2024 page; proceedings TOC; ResearchGate profile metadata | `source_verified_pdf_unavailable` | Use only as attestation metadata/background until a public PDF is verified. |
| `pcisig_tdisp_2022`, `pcisig_tdisp_xt_2025` | PCI-SIG public metadata and member-gated download targets | `source_verified_pdf_unavailable` / E5 gated metadata | Only claim public existence and affected-area metadata; no normative message/state-machine details. |
