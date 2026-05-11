# RISC-V confidential computing

This category stores RISC-V TEE, enclave, CoVE/AP-TEE, and confidential I/O references.

Suggested reading order:

1. `keystone-open-framework-architecting-tees/`
2. `penglai-scalable-memory-protection/`
3. `spear-v-secure-practical-enclave-architecture-risc-v/`
4. `cove-towards-confidential-computing-on-risc-v-platforms/`
5. `risc-v-ap-tee-specification/`
6. `risc-v-cove-io-specification/`
# RISC-V Confidential Computing References

This directory stores RISC-V enclave, TEE, CoVE/AP-TEE, I/O protection, and confidential-VM references used by `domain.md`.

## Indexed References

| Key | Reference | Status | Use in `domain.md` |
|---|---|---|---|
| `lee2020keystone` | `keystone-open-framework-architecting-tees/` | arXiv 2019, local PDF available, Paper Review available | Foundational RISC-V enclave framework. |
| `feng2021penglai` | `penglai-scalable-memory-protection/` | OSDI 2021, local PDF available, Paper Review available | Academic SOTA for scalable RISC-V enclave memory protection. |
| `schrammel2023spearv` | `spear-v-secure-practical-enclave-architecture-risc-v/` | ASIA CCS 2023, local PDF available, Paper Review available | Academic SOTA for low-overhead practical RISC-V enclave primitives. |
| `sahita2023cove` | `cove-towards-confidential-computing-on-risc-v-platforms/` | arXiv 2023, local PDF available, Paper Review available | Foundational CoVE confidential-VM architecture paper. |
| `riscv_ap_tee_2024` | `risc-v-ap-tee-specification/` | v0.7 draft / not ratified, source verified, local PDF unavailable | Spec/industry SOTA for TVM/TSM/COVH/COVG lifecycle. |
| `riscv_cove_io_2026` | `risc-v-cove-io-specification/` | v0.3.0 draft / not ratified, source verified, local PDF unavailable | Spec/industry SOTA for trusted I/O, DMA/MMIO, device identity, interrupt path. |
| `riscv_iommu_2023` | `risc-v-iommu-specification/` | v1.0.0 release, source verified, local PDF unavailable | Base I/O translation/protection reference for CoVE-IO discussion. |
| `riscv_aia_2023` | `risc-v-advanced-interrupt-architecture/` | v1.0 release, source verified, local PDF unavailable | Base interrupt architecture reference for trusted MSI / confidential I/O discussion. |
| `boubakri2025riscvtee` | `a-survey-of-risc-v-secure-enclaves-and-trusted-execution-environments/` | Electronics 2025 survey, HTML source verified, PDF blocked by 403 | RISC-V TEE survey anchor; use alongside original papers/specs. |
