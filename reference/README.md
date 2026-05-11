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

Download status: 26 of 50 reference entries have verified local PDFs.

Newly added or completed in this pass:

- `reference/trusted-execution-environments/sok/hardware-supported-trusted-execution-environments/`
- `reference/risc-v-confidential-computing/cove-towards-confidential-computing-on-risc-v-platforms/`
- `reference/risc-v-confidential-computing/penglai-scalable-memory-protection/`
- `reference/risc-v-confidential-computing/keystone-open-framework-architecting-tees/`
- `reference/risc-v-confidential-computing/spear-v-secure-practical-enclave-architecture-risc-v/`
- `reference/architecture-and-platform-security/siopmp-scalable-efficient-io-protection-for-tees/`
- `reference/attestation/swatt-software-based-attestation-for-embedded-devices/`
- `reference/attestation/seda-scalable-embedded-device-attestation/`

Entries without a verified local PDF yet:

- `reference/accelerator-tees/sok/analysis-accelerator-tee-designs/`
- `reference/architecture-and-platform-security/amd-secure-encrypted-virtualization/`
- `reference/architecture-and-platform-security/amd-sev-snp-strengthening-vm-isolation/`
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
- `reference/attestation/secure-boot-trusted-boot-remote-attestation-arm-trustzone-iot/`
- `reference/memory-and-io-fabrics/advanced-configuration-and-power-interface-specification/`
- `reference/memory-and-io-fabrics/pci-express-integrity-and-data-encryption/`
- `reference/risc-v-confidential-computing/a-survey-of-risc-v-secure-enclaves-and-trusted-execution-environments/`
- `reference/risc-v-confidential-computing/risc-v-advanced-interrupt-architecture/`
- `reference/risc-v-confidential-computing/risc-v-ap-tee-specification/`
- `reference/risc-v-confidential-computing/risc-v-cove-io-specification/`
- `reference/risc-v-confidential-computing/risc-v-iommu-specification/`
- `reference/trusted-execution-environments/arm-security-technology-trustzone/`
- `reference/trusted-execution-environments/demystifying-arm-trustzone-comprehensive-survey/`
- `reference/trusted-execution-environments/sok/understanding-prevailing-security-vulnerabilities-trustzone-tee/`

Notes:

- Missing PDFs are not all errors. Several Arm, PCI-SIG, AMD, IEEE, ACM, and GitHub-release assets were verified by source URL but blocked, timed out, or required interactive access from this environment.
- Do not mark a PDF as local unless `paper.pdf` exists and has been verified with `file`.
