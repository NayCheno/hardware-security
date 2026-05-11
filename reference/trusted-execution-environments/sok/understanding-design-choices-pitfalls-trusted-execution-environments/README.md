# SoK: Understanding Design Choices and Pitfalls of Trusted Execution Environments

- BibTeX key: `li2024sokteechoices`
- Category: `trusted-execution-environments/sok`
- Authors: Mengyuan Li; Yuheng Yang; Guoxing Chen; Mengjia Yan; Yinqian Zhang
- Year: 2024
- Venue: ACM Asia Conference on Computer and Communications Security (ASIA CCS 2024)
- Source: https://doi.org/10.1145/3634737.3644993
- PDF source: https://people.csail.mit.edu/mengyuanli/files/asiaccs_sok.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- SOTA role: SoK/survey anchor for server-side TEE runtime design choices and pitfalls; use with `schneider2022soktee` for general TEE taxonomy and with original platform papers for mechanism claims.

## Citation Triage

| Priority | Cited work | Role in SoK | Repo category | Local status | Next action |
|---|---|---|---|---|---|
| P0 | Sanctum | RISC-V/open hardware enclave baseline | `reference/risc-v-confidential-computing/sanctum-minimal-hardware-extensions-strong-software-isolation/` | added, local PDF available | Review and map against Keystone/Penglai/CoVE lineage. |
| P0 | CURE | Customizable RISC-V enclave and peripheral-binding baseline | `reference/risc-v-confidential-computing/cure-customizable-resilient-enclaves/` | added, local PDF available | Review for I/O and accelerator TEE discussion. |
| P1 | MI6 | Speculative out-of-order RISC-V enclave baseline | `reference/risc-v-confidential-computing/mi6-secure-enclaves-speculative-out-of-order-processor/` | added, local PDF available | Review when expanding side-channel/speculation limits. |
| P1 | Keystone / Penglai | Existing RISC-V enclave lineage | `reference/risc-v-confidential-computing/` | existing, local PDFs available | Already covered as lineage anchors. |
| P2 | Intel TDX / IBM PEF | Out-of-scope platform comparison | not added | metadata only | Add later only if x86/IBM confidential VM comparison becomes in-scope. |
