# Reference library

This directory stores cited papers and specifications grouped by topic.

Layout rule:

- `reference/<category>/<paper>/paper.pdf` stores the original downloaded PDF when publicly available.
- `reference/<category>/<paper>/README.md` records citation metadata and source links.
- `reference/<category>/sok/` is reserved for SoK papers for that category.

Current categories:

- `accelerator-tees/`
- `arm-confidential-computing/`
- `attestation/`
- `architecture-and-platform-security/`
- `memory-and-io-fabrics/`
- `risc-v-confidential-computing/`
- `trusted-execution-environments/`

Category routing for the current survey scope:

- `arm-confidential-computing/`: Arm CCA/RME/RMM/Realm, Arm confidential VM, Arm CCA research platforms, inter-CVM sharing, CCA-specific memory and device mechanisms.
- `risc-v-confidential-computing/`: RISC-V enclave lineage, CoVE/AP-TEE, TVM/TSM, CoVE-IO, TEE-I/O, RISC-V IOMMU/IOPMP/AIA when used for confidential-computing boundaries.
- `accelerator-tees/`: GPU/NPU/DPU/SmartNIC/NIC accelerator TEE, confidential offload, device-local TEE, accelerator attestation and secure scheduling.
- `memory-and-io-fabrics/`: confidential-computing network/I/O/data-path materials that are not tied to one CPU architecture, including CXL, RDMA, PCIe IDE, SPDM, TDISP, secure fabric paths, remote memory, trusted vNIC/vSwitch/offload, and fabric boundary papers.
- `architecture-and-platform-security/`: ISA and hardware-design defenses such as Arm MTE/PAC/BTI/GCS/PAN/PXN/UXN/PTE permissions, RISC-V PMP/ePMP/Smepmp/Zicfiss/Zicfilp/PTE permissions, CHERI/CHERIoT, RV-CURE, memory encryption/integrity/replay protection, debug/trace lockdown, and hardware CFI/memory-safety implementations.
- `attestation/`: evidence formats, verifier policy, boot/lifecycle attestation, device/network endpoint identity, and measurement chains used by Arm/RISC-V confidential-computing systems.
- `trusted-execution-environments/`: cross-platform TEE SoK/survey anchors and historical TrustZone/TEE background that supports the Arm/RISC-V confidential-computing comparison.

Generic network-security papers such as firewall, IDS/IPS, DDoS, routing security, generic TLS/VPN, or web security are not part of this library unless they directly protect a confidential-computing network path, trusted endpoint, or device offload boundary.

Download status: 88 of 102 paper/spec reference entry directories have verified local PDFs. Category index README files are not counted as reference entries.

Bibliography corpus status: `survey/reference.bib` contains 104 active in-scope entries. `survey/background_runtime_reference.bib` preserves 2 SGX runtime/container background substrate entries that are not active evidence for this survey. `survey/excluded_attack_reference.bib` preserves 64 out-of-scope attack-only entries for future attack-scope work; they are not active evidence for this survey. `survey/candidate_reference.bib` contains 152 metadata-only related-work candidates; they are not downloaded/reviewed reference records and must be verified before promotion into 正文 evidence. `survey/p0_p1_candidate_status.md` gives terminal states for all 112 P0/P1 candidates and marks which are active-canonical coverage, backlog/no substantive citation, or background substrate. `survey/evidence_ledger.md` is the current count, evidence-class, and boundary ledger. `survey/top_conference_coverage_audit.md`, `survey/citation_expansion_triage.md`, and `survey/pdf_recovery_log.md` are historical/source-entry logs. See `survey/related_work_300_expansion.md` before using any candidate.

Evidence role classes follow the survey methodology: E0 official standards/specs/RFCs, E1 peer-reviewed primary papers, E2 surveys/SoKs, E3 public drafts or not-ratified releases, E4 vendor/industry evidence, and E5 metadata-only/gated/blocked or HTML-only evidence. Gated or unavailable PDFs are recorded as unavailable; no private access is assumed.

Newly added or completed in this pass:

- `reference/risc-v-confidential-computing/risc-v-advanced-interrupt-architecture/`
- `reference/risc-v-confidential-computing/risc-v-ap-tee-specification/`
- `reference/risc-v-confidential-computing/risc-v-cove-io-specification/`
- `reference/risc-v-confidential-computing/risc-v-iommu-specification/`
- `reference/memory-and-io-fabrics/advanced-configuration-and-power-interface-specification/`
- `reference/architecture-and-platform-security/amd-sev-snp-strengthening-vm-isolation/`
- `reference/trusted-execution-environments/demystifying-arm-trustzone-comprehensive-survey/`
- `reference/trusted-execution-environments/sok/understanding-prevailing-security-vulnerabilities-trustzone-tee/`
- `reference/attestation/secure-boot-trusted-boot-remote-attestation-arm-trustzone-iot/`
- `reference/attestation/remote-attestation-procedures-rats-architecture/`
- `reference/attestation/entity-attestation-token-rfc9711/`
- `reference/attestation/c-flat-control-flow-attestation-embedded-systems-software/`
- `reference/attestation/lo-fat-low-overhead-control-flow-attestation-hardware/`
- `reference/attestation/vrased-verified-hardware-software-co-design-remote-attestation/`
- `reference/trusted-execution-environments/komodo-verification-disentangle-secure-enclave-hardware-software/`
- `reference/trusted-execution-environments/sok/understanding-design-choices-pitfalls-trusted-execution-environments/`
- `reference/risc-v-confidential-computing/sanctum-minimal-hardware-extensions-strong-software-isolation/`
- `reference/risc-v-confidential-computing/cure-customizable-resilient-enclaves/`
- `reference/risc-v-confidential-computing/mi6-secure-enclaves-speculative-out-of-order-processor/`
- `reference/risc-v-confidential-computing/ace-confidential-computing-embedded-risc-v-systems/`
- `reference/arm-confidential-computing/opencca-open-framework-enable-arm-cca-research/`
- `reference/arm-confidential-computing/caec-confidential-attestable-efficient-inter-cvm-communication-arm-cca/`
- `reference/risc-v-confidential-computing/risc-v-iopmp-architecture-specification/`
- `reference/risc-v-confidential-computing/timber-v-tag-isolated-memory-fine-grained-enclaves-risc-v/`
- `reference/risc-v-confidential-computing/cerberus-formal-approach-secure-efficient-enclave-memory-sharing/`
- `reference/architecture-and-platform-security/cva6-cfi-first-glance-risc-v-control-flow-integrity-extensions/`
- `reference/architecture-and-platform-security/rv-cure-risc-v-capability-architecture-full-memory-safety/`
- `reference/architecture-and-platform-security/cheriot-complete-memory-safety-embedded-devices/`
- `reference/architecture-and-platform-security/sok/memory-encryption-survey-existing-techniques/`
- `reference/memory-and-io-fabrics/security-protocol-and-data-model-spdm-specification/`
- `reference/memory-and-io-fabrics/secured-messages-using-spdm-specification/`
- `reference/memory-and-io-fabrics/spdm-over-tcp-binding-specification/`
- `reference/memory-and-io-fabrics/spdm-architecture-white-paper/`
- `reference/memory-and-io-fabrics/amd-sev-tio-trusted-io/`
- `reference/memory-and-io-fabrics/bridge-the-future-high-performance-networks-confidential-vms-without-trusted-io-devices/`
- `reference/memory-and-io-fabrics/pcie-tee-device-interface-security-protocol-tdisp/`
- `reference/accelerator-tees/confidential-computing-within-ai-accelerator/`
- `reference/accelerator-tees/enabling-rack-scale-confidential-computing-heterogeneous-tee/`
- `reference/accelerator-tees/confidential-computing-heterogeneous-devices-cloud-scale/`
- `reference/accelerator-tees/nvidia-bluefield-operation-ftpm-over-optee/`
- `reference/attestation/separate-but-together-integrating-remote-attestation-into-tls/`
- `reference/attestation/transparent-attested-dns-confidential-computing-services/`
- `reference/attestation/hardware-requirements-device-identifier-composition-engine/`
- `reference/architecture-and-platform-security/limitations-and-opportunities-modern-hardware-isolation-mechanisms/`
- `reference/architecture-and-platform-security/voodoo-memory-tagging-authenticated-encryption-error-correction-magic/`
- `reference/arm-confidential-computing/cpc-flexible-secure-efficient-cvm-maintenance-confidential-procedure-calls/`
- `reference/arm-confidential-computing/aster-bringing-confidential-computing-to-android/`
- `reference/arm-confidential-computing/portal-fast-secure-device-access-arm-cca/`
- `reference/arm-confidential-computing/building-confidential-accelerator-computing-environment-arm-cca/`
- `reference/accelerator-tees/strongbox-gpu-tee-arm-endpoints/`
- `reference/accelerator-tees/graviton-trusted-execution-environments-gpus/`
- `reference/accelerator-tees/telekine-secure-computing-cloud-gpus/`
- `reference/accelerator-tees/honeycomb-secure-efficient-gpu-executions-static-validation/`
- `reference/accelerator-tees/shef-shielded-enclaves-cloud-fpgas/`
- `reference/accelerator-tees/xputee-high-performance-practical-heterogeneous-tee-gpus/`
- `reference/accelerator-tees/sgx-fpga-trusted-execution-cpu-fpga-heterogeneous-architecture/`
- `reference/accelerator-tees/sok/trusted-execution-soc-fpgas/`
- `reference/memory-and-io-fabrics/smartnic-security-isolation-cloud-snic/`
- `reference/memory-and-io-fabrics/tnic-trusted-nic-architecture/`
- `reference/memory-and-io-fabrics/hazel-secure-efficient-disaggregated-storage/`
- `reference/memory-and-io-fabrics/osmosis-enabling-multi-tenancy-datacenter-smartnics/`
- `reference/trusted-execution-environments/serverless-functions-confidential-efficient-split-containers/`

Entries without a verified local PDF yet:

- `reference/architecture-and-platform-security/amd-secure-encrypted-virtualization/`
- `reference/architecture-and-platform-security/arm-architecture-reference-manual-a-profile/`
- `reference/architecture-and-platform-security/arm-system-memory-management-unit-architecture-specification/`
- `reference/architecture-and-platform-security/understanding-trace/`
- `reference/arm-confidential-computing/arm-cca-specification/`
- `reference/arm-confidential-computing/linux-arm-cca-documentation/`
- `reference/arm-confidential-computing/more-granular-less-trust-arm-cca-intra-process-isolation/`
- `reference/arm-confidential-computing/realm-management-monitor-specification/`
- `reference/attestation/mra-ima-enhanced-mutual-remote-attestation-arm-trustzone/`
- `reference/attestation/psa-certified-security-framework/`
- `reference/accelerator-tees/xputee-high-performance-practical-heterogeneous-tee-gpus/`
- `reference/accelerator-tees/sgx-fpga-trusted-execution-cpu-fpga-heterogeneous-architecture/`
- `reference/memory-and-io-fabrics/pci-express-integrity-and-data-encryption/`
- `reference/memory-and-io-fabrics/pcie-tee-device-interface-security-protocol-tdisp/`

Notes:

- Missing PDFs are not all errors. Remaining blocked entries are mostly Arm developer pages, PCI-SIG member-gated material, IEEE/ACM/Elsevier publisher pages, AMD pages without a stable public PDF endpoint, or HTML-only documentation. TDISP and TDISP XT currently have public metadata but no public PCI-SIG PDF.
- Do not mark a PDF as local unless `paper.pdf` exists and has been verified as a PDF.
