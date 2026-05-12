# RISC-V Confidential Computing References

This directory stores RISC-V enclave, TEE, CoVE/AP-TEE, I/O protection, and confidential-VM references used by `domain.md`.

Suggested reading order:

1. `sanctum-minimal-hardware-extensions-strong-software-isolation/`
2. `keystone-open-framework-architecting-tees/`
3. `cure-customizable-resilient-enclaves/`
4. `mi6-secure-enclaves-speculative-out-of-order-processor/`
5. `penglai-scalable-memory-protection/`
6. `spear-v-secure-practical-enclave-architecture-risc-v/`
7. `timber-v-tag-isolated-memory-fine-grained-enclaves-risc-v/`
8. `cove-towards-confidential-computing-on-risc-v-platforms/`
9. `risc-v-ap-tee-specification/`
10. `risc-v-iopmp-architecture-specification/`
11. `risc-v-cove-io-specification/`
12. `cerberus-formal-approach-secure-efficient-enclave-memory-sharing/`
13. `ace-confidential-computing-embedded-risc-v-systems/`

## Indexed References

| Key | Reference | Status | Use in `domain.md` |
|---|---|---|---|
| `costan2016sanctum` | `sanctum-minimal-hardware-extensions-strong-software-isolation/` | USENIX Security 2016, local PDF available, Review available | Foundational RISC-V/open-hardware enclave baseline. |
| `lee2020keystone` | `keystone-open-framework-architecting-tees/` | EuroSys 2020, author-hosted final PDF available, Review available | Foundational RISC-V enclave framework. |
| `bahmani2021cure` | `cure-customizable-resilient-enclaves/` | USENIX Security 2021/arXiv, local PDF available, Review available | RISC-V customizable enclave and peripheral-binding baseline. |
| `bourgeat2019mi6` | `mi6-secure-enclaves-speculative-out-of-order-processor/` | MICRO 2019/arXiv, local PDF available, Review available | RISC-V speculative OoO enclave and microarchitectural isolation baseline. |
| `feng2021penglai` | `penglai-scalable-memory-protection/` | OSDI 2021, local PDF available, Review available | Peer-reviewed SOTA for scalable RISC-V enclave memory protection. |
| `schrammel2023spearv` | `spear-v-secure-practical-enclave-architecture-risc-v/` | ASIA CCS 2023, local PDF available, Review available | Peer-reviewed SOTA for low-overhead practical RISC-V enclave primitives. |
| `weiser2019timberv` | `timber-v-tag-isolated-memory-fine-grained-enclaves-risc-v/` | NDSS 2019, local PDF available, Review available | Embedded RISC-V tagged-memory enclave lineage and fine-grained isolation baseline. |
| `sahita2023cove` | `cove-towards-confidential-computing-on-risc-v-platforms/` | arXiv 2023, local PDF available, Review available | Foundational CoVE confidential-VM architecture paper. |
| `riscv_ap_tee_2024` | `risc-v-ap-tee-specification/` | Draft/not ratified: AP-TEE v0.7 / RC2 for ARC review, local PDF available, Review available | Draft/not ratified source for TVM/TSM/COVH/COVG lifecycle. |
| `riscv_iopmp_2026` | `risc-v-iopmp-architecture-specification/` | v0.8.2 draft / not ratified, local PDF available, Review available | Draft/not ratified source for I/O request filtering, memory-domain matching, and DMA isolation. |
| `riscv_cove_io_2026` | `risc-v-cove-io-specification/` | Draft/not ratified: CoVE-IO v0.3.0, local PDF available, Review available | Draft/not ratified source for trusted I/O, DMA/MMIO, device identity, and interrupt-path concepts. |
| `riscv_iommu_2023` | `risc-v-iommu-specification/` | v1.0.1 / 20260222 ratified-library release, local PDF available, Review available | Spec/standard SOTA for I/O translation/protection references in CoVE-IO discussion. |
| `riscv_aia_2023` | `risc-v-advanced-interrupt-architecture/` | v1.0 ratified June 2023 with 20250312 clarifications, local PDF available, Review available | Spec/standard SOTA for interrupt architecture and trusted MSI / confidential I/O discussion. |
| `boubakri2025riscvtee` | `a-survey-of-risc-v-secure-enclaves-and-trusted-execution-environments/` | Electronics 2025 survey, MDPI HTML and local PDF verified, Review available | E2 background substrate survey anchor; use alongside original papers/specs. |
| `lee2022cerberus` | `cerberus-formal-approach-secure-efficient-enclave-memory-sharing/` | ACM CCS 2022, local PDF available, Review available | Formal enclave memory-sharing baseline for Keystone/RISC-V and future confidential-VM shared-memory comparisons. |
| `ozga2025ace` | `ace-confidential-computing-embedded-risc-v-systems/` | arXiv 2025, local PDF available, Review available | Draft/not ratified source for embedded RISC-V confidential computing with auditable/formally oriented firmware. |
