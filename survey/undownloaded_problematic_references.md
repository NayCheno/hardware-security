# Undownloaded or Source-Limited Reference Boundaries

Scope: entries already tracked under `reference/**/README.md` whose local PDF is unavailable, member-gated, source-limited, HTML-only, or metadata-only. This is a quick index; the current count and claim-strength rules remain in `survey/evidence_ledger.md`, and recovery attempts, when made, are recorded in `survey/pdf_recovery_log.md`.

These entries may be cited only within the boundary stated below. Do not use them for strong mechanism, performance, or state-machine claims unless a public PDF/source is later recovered and the entry is reclassified.

| Key(s) | Reference / source status | Allowed use |
|---|---|---|
| `xia2021sgxfpga` | SGX-FPGA metadata/source verified; public PDF unavailable | CPU-FPGA TEE lineage marker only; no detailed mechanism or performance claim. |
| `fan2025xputee` | XpuTEE metadata/source verified; public PDF unavailable | Recent heterogeneous GPU TEE metadata only; no benchmark or threat-model claim beyond abstract-level status. |
| `amd_sev` | AMD Secure Encrypted Virtualization local PDF unavailable | Historical/vendor SEV context only; use `amd_sev_snp` for verified local PDF evidence. |
| `armv-a` | Arm Architecture Reference Manual source tracked without local public PDF | Architecture terminology and public Arm concept boundary only. |
| `arm_smmu_spec` | Arm SMMU architecture source tracked without local public PDF | SMMU/IOMMU terminology and public source-page evidence only. |
| `arm_understanding_trace` | Arm trace documentation source tracked without local PDF | Debug/trace lockdown context only; no normative implementation claim. |
| `arm_cca_spec`, `linux_arm_cca_doc` | Official Arm CCA source pages verified; no local public PDF | Public Realm/CCA concepts only; avoid private ABI or unstated state-machine details. |
| `arm_rmm_spec` | Official Arm RMM source/CDN target verified; local download unavailable | Public RMM/RMI/RSI lifecycle concepts only; no local PDF review claim. |
| `liu2025lesstrust` | Peer-reviewed/source metadata verified; local PDF unavailable | Source-limited CCA deployment context only until PDF is recovered. |
| `chen2024mraima` | Attestation paper metadata/source verified; local PDF unavailable | Attestation metadata/background only; no detailed protocol or evaluation claim. |
| `psa_certified` | PSA framework source tracked without local PDF | Industry/security-framework context only. |
| `pcie_ide` | PCIe IDE source tracked without local PDF | PCIe link-protection concept only; prefer public metadata and verified specs where available. |
| `pcisig_tdisp_2022`, `pcisig_tdisp_xt_2025` | PCI-SIG public metadata/member-gated downloads | TDISP/TDISP XT existence and affected-area metadata only; no gated normative message/state-machine claim. |
