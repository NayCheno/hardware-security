# Top Conference Coverage Audit

Status date: 2026-05-12

This table tracks the recent top-conference papers requested in `next-plan.md`.
It separates active evidence from boundary-only attack references so that attack
papers and generic network substrates do not leak into active survey claims.

| Paper | Venue / year | Canonical key | Category / corpus | In-scope status | Evidence level | Repo status | PDF status | Action / boundary |
|---|---|---|---|---|---|---|---|---|
| Limitations and Opportunities of Modern Hardware Isolation Mechanisms | USENIX ATC 2024 | `chen2024hardwareisolation` | `architecture-and-platform-security` | Active in-scope | E1 primary paper | README, PDF, BibTeX, and正文 citation present | Verified local PDF, 21 pages | Use for comparative hardware isolation evidence; not TEE/CCA/CoVE/trusted-I/O proof. |
| CPC: Flexible, Secure, and Efficient CVM Maintenance with Confidential Procedure Calls | USENIX ATC 2024 | `chen2024cpc` | `arm-confidential-computing` | Active in-scope | E1 primary paper | README, PDF, BibTeX, and正文 citation present | Verified local PDF, 19 pages | Use for CVM maintenance/lifecycle evidence; not Arm official interface or production migration standard. |
| Transparent Attested DNS for Confidential Computing Services | USENIX Security 2025 | `delignatlavaud2025adns` | `attestation` | Active in-scope | E1 primary paper | README, PDF, BibTeX, and正文 citation present | Verified local PDF, 21 pages | Use for attested naming, policy discovery, certificate issuance, and transparency logs; not device identity or DMA control. |
| Voodoo: Memory Tagging, Authenticated Encryption, and Error Correction through MAGIC | USENIX Security 2024 | `lamster2024voodoo` | `architecture-and-platform-security` | Active in-scope | E1 primary paper | README, PDF, BibTeX, and正文 citation present | Verified local PDF, 19 pages | Use for memory-tagging/authenticated-encryption/ECC composition; not TEE lifecycle or trusted I/O. |
| Serverless Functions Made Confidential and Efficient with Split Containers | USENIX Security 2025 | `shi2025cofunc` | `trusted-execution-environments` | Active background substrate | E1 primary paper | README, PDF, BibTeX, and正文 citation present | Verified local PDF, 21 pages | Use for confidential serverless/container packaging tradeoffs; not Arm CCA/RISC-V CoVE mechanism evidence. |
| HECKLER: Breaking Confidential VMs with Malicious Interrupts | USENIX Security 2024 | `schluter2024heckler` | `survey/excluded_attack_reference.bib` | Boundary-only / excluded attack | Excluded attack metadata | Excluded BibTeX and boundary prose present; no active正文 citation | No local PDF by policy | Use only as interrupt-ownership motivation; keep out of active evidence and attack survey expansion. |
| Bringing Confidential Computing to Android | ACM MobiSys 2026 | `kuhne2026aster` | `arm-confidential-computing` | Active emerging in-scope | E1 primary paper | README, PDF, BibTeX, and正文 citation present | Verified local PDF, 16 pages | Use for Android AVF-on-CCA mobile deployment; not Arm official profile, production hardware proof, or trusted-I/O evidence. |
| OSMOSIS: Enabling Multi-Tenancy in Datacenter SmartNICs | USENIX ATC 2024 | `khalilov2024osmosis` | `memory-and-io-fabrics` | Active background substrate | E1 primary paper | README, PDF, BibTeX, and正文 citation present | Verified local PDF, 18 pages | Use for SmartNIC multi-tenancy and resource-management context; not confidential-I/O, TEE, SPDM, TDISP, or attestation evidence. |

## Audit Summary

- Active in-scope additions from this plan: 7 canonical entries.
- Boundary-only additions from this plan: 1 excluded attack entry.
- Active BibTeX count after PDF recovery and attestation-lineage promotion: 104.
- Excluded attack BibTeX count after audit: 64.
- 正文 cited keys after PDF recovery and attestation-lineage promotion: 102, all present in `survey/reference.bib`.
- Reference library status after PDF recovery and attestation-lineage promotion: 102 paper/spec entry READMEs, 88 verified local PDFs.
- Current corpus counts are reconciled in `survey/evidence_ledger.md`.
- `next-plan.md` remains a control file and is not part of the evidence corpus.
