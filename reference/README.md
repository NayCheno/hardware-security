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

Download status: 50 of 64 reference entries have verified local PDFs.

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
- `reference/memory-and-io-fabrics/sok/memory-encryption-survey-existing-techniques/`

Entries without a verified local PDF yet:

- `reference/architecture-and-platform-security/amd-secure-encrypted-virtualization/`
- `reference/architecture-and-platform-security/arm-architecture-reference-manual-a-profile/`
- `reference/architecture-and-platform-security/arm-system-memory-management-unit-architecture-specification/`
- `reference/architecture-and-platform-security/understanding-trace/`
- `reference/arm-confidential-computing/arm-cca-specification/`
- `reference/arm-confidential-computing/linux-arm-cca-documentation/`
- `reference/arm-confidential-computing/more-granular-less-trust-arm-cca-intra-process-isolation/`
- `reference/arm-confidential-computing/realm-management-extension-architecture-specification/`
- `reference/arm-confidential-computing/realm-management-monitor-specification/`
- `reference/attestation/mra-ima-enhanced-mutual-remote-attestation-arm-trustzone/`
- `reference/attestation/psa-certified-security-framework/`
- `reference/memory-and-io-fabrics/pci-express-integrity-and-data-encryption/`
- `reference/risc-v-confidential-computing/a-survey-of-risc-v-secure-enclaves-and-trusted-execution-environments/`
- `reference/trusted-execution-environments/arm-security-technology-trustzone/`

Notes:

- Missing PDFs are not all errors. Remaining blocked entries are mostly Arm developer pages, PCI-SIG member-gated material, IEEE/ACM/Elsevier publisher pages, AMD pages without a stable public PDF endpoint, or HTML-only documentation.
- Do not mark a PDF as local unless `paper.pdf` exists and has been verified as a PDF.
