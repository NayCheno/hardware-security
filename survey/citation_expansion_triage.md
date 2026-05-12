# One-Hop Citation Expansion Triage

Status date: 2026-05-12

This pass reviews one-hop references and related-work anchors for the recent
top-conference papers added in `next-plan.md`. The filter is deliberately
strict: promote only public, verifiable, directly in-scope defense/spec/system
sources. Attack-only, generic-network, and x86/runtime-only references remain
boundary or backlog material.

## Promoted in This Pass

| Promoted key | Trigger source | Why it was promoted | Repo path | PDF status | Boundary |
|---|---|---|---|---|---|
| `tcg_dice_2018` | Aster uses DICE-compatible boot/attestation and pVM sealing language | Official DICE UDS/CDI derivation is directly needed to ground Android AVF-on-CCA attestation and rollback claims; existing `rw2021deviceidentifiercompositionengine` was P0 backlog | `reference/attestation/hardware-requirements-device-identifier-composition-engine/` | Verified local PDF, 12 pages | Use for DICE boot identity vocabulary only; not a complete remote-attestation protocol or platform profile. |

## Triage Table

| Source paper | One-hop candidate / family | Repo state before pass | Decision | Rationale |
|---|---|---|---|---|
| Hardware Isolation | Arm MTE/PAC/BTI, MPK/PKU, CHERI, isolation-primitives baselines | Arm/RISC-V specs and CHERIoT/RV-CURE/CVA6-CFI active; x86 MPK-like works remain background | No new download | Active survey already has the architectural/spec anchors needed for the hardware-defense lane; x86-specific process-isolation baselines are not needed for Arm/RISC-V/CCA/CoVE claims. |
| CPC | AMD SEV-SNP, Arm CCA/RMM/RMI, Intel TDX, migration/snapshot baselines | SEV-SNP and Arm CCA/RMM active; TDX remains P1 backlog for cross-platform comparison | No new download | CPC正文 claim is grounded by CPC plus existing SEV-SNP/CCA entries. TDX is useful comparison but outside the current Arm/RISC-V-focused mechanism lane. |
| aDNS | TLS+RA/RA-TLS, RATS/EAT, DNSSEC/DANE/ACME/Certificate Transparency | TLS+RA, RATS, and EAT active | No new download | DNSSEC/DANE/ACME/CT are generic Internet PKI standards; aDNS itself is the in-scope confidential-computing binding evidence. |
| Voodoo | MAGIC mode, memory-authentication/ECC cryptographic baselines, Arm MTE, CHERI | Voodoo and Henson memory-encryption survey active; Arm/CHERI references active | No new download | MAGIC is important to Voodoo internals, but the survey only needs hardware-design evidence at the system level; Voodoo provides the primary mechanism/evaluation evidence. |
| CoFunc | Kata-CVM, SCONE, Graphene/Gramine, confidential containers, SEV/TDX baselines | SCONE/Graphene-like SGX runtime material exists as background/candidate; RContainer active | No new download | These are runtime/container baselines, mostly x86/SGX or implementation background. CoFunc is used only as confidential serverless/container substrate, not as Arm CCA mechanism evidence. |
| Aster | DICE, Android AVF/CDD docs, Arm CCA/RMM, PORTAL/CAGE/ACAI | DICE was P0 backlog; CCA/device papers active | Promote DICE | DICE directly grounds boot identity, attestation chain, and sealing-key vocabulary used by Aster. Android docs are platform documentation, not survey paper evidence. |
| OSMOSIS | PsPIN, FlexNIC, PANIC, FairNIC, PicNIC, Justitia, Caladan | Several programmable-NIC systems already in candidate/background status | No new download | They are generic NIC resource-management or OS/networking papers. OSMOSIS is sufficient as the SmartNIC multi-tenancy background substrate; no confidential-I/O security claim should depend on these baselines. |
| HECKLER | Interrupt attacks on confidential VMs | Excluded attack bibliography | No expansion | Attack-only source remains boundary motivation; do not download or recursively expand attack references in this defense/spec survey. |

## Count Update

- Active BibTeX entries after DICE promotion: 100.
- Excluded attack BibTeX entries: 64.
-正文 cited keys after DICE promotion: 98, all present in `survey/reference.bib`.
- Reference library status after DICE promotion: 98 paper/spec entry READMEs, 81 verified local PDFs.
