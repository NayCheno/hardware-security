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
| `costan2016sanctum` | `sanctum-minimal-hardware-extensions-strong-software-isolation/` | USENIX Security 2016, local PDF available, Paper Review available | Foundational RISC-V/open-hardware enclave baseline. |
| `lee2020keystone` | `keystone-open-framework-architecting-tees/` | arXiv 2019, local PDF available, Paper Review available | Foundational RISC-V enclave framework. |
| `bahmani2021cure` | `cure-customizable-resilient-enclaves/` | USENIX Security 2021/arXiv, local PDF available, Paper Review available | RISC-V customizable enclave and peripheral-binding baseline. |
| `bourgeat2019mi6` | `mi6-secure-enclaves-speculative-out-of-order-processor/` | MICRO 2019/arXiv, local PDF available, Paper Review available | RISC-V speculative OoO enclave and microarchitectural isolation baseline. |
| `feng2021penglai` | `penglai-scalable-memory-protection/` | OSDI 2021, local PDF available, Paper Review available | Academic SOTA for scalable RISC-V enclave memory protection. |
| `schrammel2023spearv` | `spear-v-secure-practical-enclave-architecture-risc-v/` | ASIA CCS 2023, local PDF available, Paper Review available | Academic SOTA for low-overhead practical RISC-V enclave primitives. |
| `weiser2019timberv` | `timber-v-tag-isolated-memory-fine-grained-enclaves-risc-v/` | NDSS 2019, local PDF available, Paper Review available | Embedded RISC-V tagged-memory enclave lineage and fine-grained isolation baseline. |
| `sahita2023cove` | `cove-towards-confidential-computing-on-risc-v-platforms/` | arXiv 2023, local PDF available, Paper Review available | Foundational CoVE confidential-VM architecture paper. |
| `riscv_ap_tee_2024` | `risc-v-ap-tee-specification/` | v0.7 draft / not ratified, local PDF available, Paper Review available | Spec/industry SOTA for TVM/TSM/COVH/COVG lifecycle. |
| `riscv_iopmp_2026` | `risc-v-iopmp-architecture-specification/` | v0.8.2 draft / not ratified, local PDF available, Paper Review available | Supporting primitive for I/O request filtering, memory-domain matching, and DMA isolation. |
| `riscv_cove_io_2026` | `risc-v-cove-io-specification/` | v0.3.0 draft / not ratified, local PDF available, Paper Review available | Spec/industry SOTA for trusted I/O, DMA/MMIO, device identity, interrupt path. |
| `riscv_iommu_2023` | `risc-v-iommu-specification/` | v1.0.0 release, local PDF available, Paper Review available | Base I/O translation/protection reference for CoVE-IO discussion. |
| `riscv_aia_2023` | `risc-v-advanced-interrupt-architecture/` | v1.0 release, local PDF available, Paper Review available | Base interrupt architecture reference for trusted MSI / confidential I/O discussion. |
| `boubakri2025riscvtee` | `a-survey-of-risc-v-secure-enclaves-and-trusted-execution-environments/` | Electronics 2025 survey, HTML source verified, PDF blocked by 403, Paper Review available | RISC-V TEE survey anchor; use alongside original papers/specs. |
| `lee2022cerberus` | `cerberus-formal-approach-secure-efficient-enclave-memory-sharing/` | ACM CCS 2022, local PDF available, Paper Review available | Formal enclave memory-sharing baseline for Keystone/RISC-V and future confidential-VM shared-memory comparisons. |
| `ozga2025ace` | `ace-confidential-computing-embedded-risc-v-systems/` | arXiv 2025, local PDF available, Paper Review available | Embedded RISC-V confidential computing SOTA with auditable/formally oriented firmware. |
