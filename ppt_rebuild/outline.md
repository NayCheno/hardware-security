# Presentation Outline

## Page 1 [cover]
- **Title**: Hardware Security Survey: Trusted Execution, Confidential Computing, and I/O Protection
- **Subtitle**: A Comprehensive Review of Arm CCA, RISC-V CoVE, and Cross-Architecture Platform Security
- **Other info**: Research survey covering 15 technical directions with 45 primary papers

## Page 2 [table_of_contents]
- **Title**: Contents
- **Chapter list**:
  1. TEE Taxonomy & Classification Framework
  2. Arm TrustZone Lineage & Vulnerability Spectrum
  3. Arm CCA / RME / RMM Architecture
  4. Arm CCA Fine-Grained Isolation & Deployment
  5. Arm CCA I/O, DMA, Accelerator & Interrupt
  6. Attestation, Boot & Lifecycle
  7. RISC-V Security Primitives
  8. RISC-V TEE Lineage
  9. RISC-V CoVE / AP-TEE Confidential VM
  10. RISC-V CoVE-IO / TEE-I/O
  11. Memory Encryption, Integrity & Replay Protection
  12. Memory / I/O Fabrics: CXL, PCIe IDE, RDMA
  13. Confidential I/O Protocol & Trusted Device Interface
  14. Accelerator / DPU / SmartNIC Confidential Offload
  15. SmartNIC / Trusted NIC / Secure Storage Path

## Page 3 [chapter]
- **Title**: 01 — TEE Taxonomy & Classification Framework
- **Subtitle**: Li 2024 / Boubakri 2025 / Wang/Huang 2026
- **Introduction**: Establishing a unified taxonomy for CPU, RISC-V, and accelerator TEEs across runtime management, resource ownership, and evidence chains

## Page 4 [content]
- **Title**: Li 2024 — SoK: TEE Runtime Choices (Summary)
- **Content**: Content summary of Li 2024's TRAF framework: TEE Runtime Architectural Framework mapping CPU/memory/I/O runtime events to four resource-management modes (unprotected, RTPM-only, RTPM-guarded, instance-assisted). This is the foundational taxonomy anchor for the entire survey.
- **Sources**: Li 2024, USENIX Security

## Page 5 [content]
- **Title**: Li 2024 — Research Background & Solution
- **Content**: Background: TEE's fundamental contradiction where host is untrusted but must manage scheduling, page tables, I/O. Solution: TRAF transforms "is TEE secure" into "who manages this runtime event, who verifies, who bears TCB cost". Four modes trade security, TCB size, and manageability.
- **Sources**: Li 2024 p.2-3, p.5-8

## Page 6 [content]
- **Title**: Li 2024 — Experiments & Evaluation
- **Content**: SoK with no new experiments; evidence from Figure 5 design-choice matrix and Table 1 vulnerable design flaws. Evaluation: Strong taxonomy for cloud TEE checklist, but limited device path coverage and no platform security proofs.
- **Sources**: Li 2024 p.7-9, p.12

## Page 7 [content]
- **Title**: Boubakri 2025 — RISC-V TEE Survey (Summary)
- **Content**: Survey covering 2016-2025 RISC-V secure enclave/TEE lineage from Sanctum to CoVE/AP-TEE. Figure 1 timeline and Table 1 comparison matrix. Key contribution: organizing RISC-V TEE into primitive stack, system lineage, and open challenges.
- **Sources**: Boubakri 2025, MDPI Electronics

## Page 8 [content]
- **Title**: Boubakri 2025 — Background & Solution
- **Content**: Background: RISC-V openness brings customization but fragmentation in PMP/monitor/CoVE terminology. Solution: Three-layer reading (primitive -> system -> evidence matrix) to map Keystone/Penglai/SPEAR-V/CoVE/AP-TEE evolution.
- **Sources**: Boubakri 2025 p.4-18, p.19-29

## Page 9 [content]
- **Title**: Boubakri 2025 — Experiments & Evaluation
- **Content**: No new experiments; survey evidence from timeline and comparison matrix. Evaluation: Good RISC-V roadmap but secondary evidence; standardization gaps remain for production deployment.
- **Sources**: Boubakri 2025 p.19-31

## Page 10 [content]
- **Title**: Wang/Huang 2026 — Accelerator TEE SoK (Summary)
- **Content**: Analysis of 51 accelerator TEE studies (41/51 since 2022). Host-type/Acc.-type/Mix-type taxonomy around access control, memory encryption, attestation. Fills Li 2024's device path gap.
- **Sources**: Wang/Huang 2026, NDSS 2026

## Page 11 [content]
- **Title**: Wang/Huang 2026 — Background & Solution
- **Content**: Background: CPU TEE alone insufficient; data crosses driver, queue, device memory, DMA, firmware. Solution: Architecture taxonomy (Host/Acc./Mix) + access control + memory protection + attestation framework with TCB/comparability analysis.
- **Sources**: Wang/Huang 2026 p.2-6, p.9-14

## Page 12 [content]
- **Title**: Wang/Huang 2026 — Experiments & Evaluation
- **Content**: SoK corpus analysis; no new end-to-end experiments. Tables X-XIII on TCB size, software stack, multi-type support. Evaluation: High commercial potential for confidential AI/GPU cloud but depends on vendor HRoT and standard interfaces.
- **Sources**: Wang/Huang 2026 p.12-15

## Page 13 [content]
- **Title**: 01 — Direction Summary & Comparison
- **Content**: Three papers complement: Li 2024 (CPU taxonomy), Boubakri 2025 (RISC-V lineage), Wang/Huang 2026 (device path). SoK evidence only fixes design space; platform mechanisms need primary evidence.
- **Sources**: Three papers' evidence matrices

## Page 14 [chapter]
- **Title**: 02 — Arm TrustZone Lineage & Vulnerability Spectrum
- **Subtitle**: Arm TrustZone Whitepaper / Pinto 2019 / Cerdeira 2020
- **Introduction**: From TrustZone TEE fundamentals to vulnerability taxonomy, establishing the historical motivation for Arm CCA

## Page 15 [content]
- **Title**: Arm TrustZone Whitepaper — Foundational Model (Summary)
- **Content**: First-party Arm specification defining Secure/Non-secure world, NS bit, and SoC-level isolation. Foundational mechanism source for dual-world TEE architecture.
- **Sources**: Arm Security Technology Whitepaper

## Page 16 [content]
- **Title**: Arm TrustZone Whitepaper — Background & Solution
- **Content**: Background: Mobile/embedded platforms need security service isolation from normal OS. Solution: Processor, interconnect, and peripheral path security state propagation forming dual-world system with secure monitor.
- **Sources**: Arm TrustZone Whitepaper

## Page 17 [content]
- **Title**: Arm TrustZone Whitepaper — Experiments & Evaluation
- **Content**: Industry evidence, no independent experiments. Evaluation: High historical value for explaining Arm TEE dual-world origin, but not CCA/RME threat model. Long-term mobile/embedded deployment; risk in large TCB and complex migration to CCA.
- **Sources**: Arm TrustZone Whitepaper, evidence ledger E4

## Page 18 [content]
- **Title**: Pinto 2019 — Demystifying Arm TrustZone (Summary)
- **Content**: Comprehensive survey of TrustZone-assisted TEEs covering system software, TEE OS, virtualization, and IoT/mobile deployment patterns. Systematic taxonomy map for mature TEE ecosystem.
- **Sources**: Pinto 2019, ACM Computing Surveys

## Page 19 [content]
- **Title**: Pinto 2019 — Background & Solution
- **Content**: Background: TrustZone widely deployed but fragmented documentation; academic and industry TEE stack boundaries inconsistent. Solution: Classification by TEE OS, trusted applications, hardware-assisted virtualization, and deployment scenarios.
- **Sources**: Pinto 2019 p.1-30

## Page 20 [content]
- **Title**: Pinto 2019 — Experiments & Evaluation
- **Content**: Survey with no new experiments. Evaluation: Suitable for TrustZone background and ecosystem taxonomy. Incomplete for CCA/RME; useful for vendor legacy assessment and migration cost analysis.
- **Sources**: Pinto 2019, evidence ledger E2

## Page 21 [content]
- **Title**: Cerdeira 2020 — TrustZone TEE Vulnerability SoK (Summary)
- **Content**: S&P 2020 SoK categorizing mainstream TrustZone TEE vulnerabilities by attack surface, interface, permission boundary, and implementation flaws. Anchors vulnerability narrative for CCA evolution motivation.
- **Sources**: Cerdeira 2020, IEEE S&P

## Page 22 [content]
- **Title**: Cerdeira 2020 — Background & Solution
- **Content**: Background: Complex TEE interfaces and growing TCB lead to repeated vulnerabilities. Solution: Taxonomy by trusted application/TEE OS attack surface, secure monitor/driver interface risk, and root-cause grouping.
- **Sources**: Cerdeira 2020 p.1-20

## Page 23 [content]
- **Title**: Cerdeira 2020 — Experiments & Evaluation
- **Content**: Survey with no new experiments. Evaluation: Supports "why stronger CCA threat model needed" historical motivation. Useful for security audit and migration assessment; requires TCB reduction and continuous vulnerability governance.
- **Sources**: Cerdeira 2020, evidence ledger E2

## Page 24 [content]
- **Title**: 02 — Direction Summary & Comparison
- **Content**: Three papers span TrustZone foundation (E4), ecosystem survey (E2), and vulnerability taxonomy (E2). Evolution: TrustZone TEE -> CCA Realm, driven by TCB complexity and interface vulnerability accumulation.
- **Sources**: Evidence ledger 02

## Page 25 [chapter]
- **Title**: 03 — Arm CCA / RME / RMM Architecture
- **Subtitle**: Li 2022 OSDI / Arm CCA Spec / RMM Spec
- **Introduction**: Core Arm confidential computing architecture: Realm, RME, RMM, granule ownership, and lifecycle management

## Page 26 [content]
- **Title**: Li 2022 — Arm CCA Design & Verification (Summary)
- **Content**: OSDI 2022 foundational paper proposing and validating Arm CCA core design including Realm, RME, RMM, GPT/GPC, and lifecycle. Peer-reviewed system treatment of confidential VM architecture.
- **Sources**: Li 2022, USENIX OSDI

## Page 27 [content]
- **Title**: Li 2022 — Background & Solution
- **Content**: Background: Cloud host must manage resources but should not see tenant workload data. Solution: Separation of resource management and data visibility via hardware granule ownership and RMM-mediated Realm lifecycle.
- **Sources**: Li 2022 p.1-8

## Page 28 [content]
- **Title**: Li 2022 — Experiments & Evaluation
- **Content**: Prototype evaluation showing design verification. Strong commercial potential as mechanism enters Arm architecture and Linux/firmware ecosystem. Risks: hardware availability, RMM correctness, attestation integration.
- **Sources**: Li 2022, evidence ledger E1

## Page 29 [content]
- **Title**: Arm CCA Architecture Specification (Summary)
- **Content**: First-party Arm specification defining Realm model, memory ownership, and attestation semantics. Current standard for CCA architecture interface and evidence vocabulary.
- **Sources**: Arm CCA Spec (DEN0125)

## Page 30 [content]
- **Title**: Arm CCA Spec — Background & Solution
- **Content**: Background: Research papers need stable hardware/firmware ABI. Solution: Standardizes CCA/RME objects, states, interfaces, and security semantics including Realm security state, PAS ownership, RIPAS, and lifecycle vocabulary.
- **Sources**: Arm CCA Spec

## Page 31 [content]
- **Title**: Arm CCA Spec — Experiments & Evaluation
- **Content**: Specification with no new experiments. Evaluation: Most authoritative for CCA mechanism semantics, but not performance or implementation correctness evidence. Commercial value depends on Armv9 CCA platform ecosystem maturity.
- **Sources**: Arm CCA Spec, evidence ledger E0

## Page 32 [content]
- **Title**: RMM Specification (Summary)
- **Content**: First-party RMM specification defining Realm management software interface, RMI/RSI roles, and lifecycle. Core of CCA TCB for Realm creation, memory transition, measurement, and attestation.
- **Sources**: Arm RMM Spec (DEN0137)

## Page 33 [content]
- **Title**: RMM Spec — Background & Solution
- **Content**: Background: RMM at core of CCA TCB; state machine or memory errors destroy Realm security. Solution: Standardized interfaces constrain Realm creation, memory transition, measurement, run/exit, and attestation states.
- **Sources**: Arm RMM Spec

## Page 34 [content]
- **Title**: RMM Spec — Experiments & Evaluation
- **Content**: Specification with no new experiments. Evaluation: Clear RMM as CCA TCB core, but does not prove any implementation correct. Deployment depends on RMM verification, firmware updates, and hardware support.
- **Sources**: Arm RMM Spec, evidence ledger E0

## Page 35 [content]
- **Title**: 03 — Direction Summary & Comparison
- **Content**: Li 2022 (E1 system paper) + Arm CCA Spec (E0) + RMM Spec (E0) form the CCA foundation. Gap: implementation verification, production RMM, and platform attestation integration remain open.
- **Sources**: Evidence ledger 03

## Page 36 [chapter]
- **Title**: 04 — Arm CCA Fine-Grained Isolation & Deployment
- **Subtitle**: Shelter / RContainer / NanoZone
- **Introduction**: Extending CCA from VM-level Realms to user-space, containers, and fine-grained memory protection

## Page 37 [content]
- **Title**: Shelter 2023 — CCA User-Space Isolation (Summary)
- **Content**: USENIX Security 2023: Moving CCA from VM Realms to user-space compartments. First peer-reviewed system for CCA user-space isolation with application-level sensitive code protection.
- **Sources**: Zhang 2023, USENIX Security

## Page 38 [content]
- **Title**: Shelter 2023 — Background & Solution
- **Content**: Background: Realm mechanisms need not serve only VMs; in-process sensitive code needs small TCB, host-untrusted isolation. Solution: CCA primitives packaged into user-space isolation model for application compartments.
- **Sources**: Zhang 2023 p.1-15

## Page 39 [content]
- **Title**: Shelter 2023 — Experiments & Evaluation
- **Content**: Prototype with overhead evaluation. Evaluation: Opens CCA fine-grained usage from VM to application isolation. Risks: prototype not general ABI, depends on runtime/OS/hardware ecosystem. Cloud sensitive functions and mobile security services potential.
- **Sources**: Zhang 2023, evidence ledger E1

## Page 40 [content]
- **Title**: RContainer 2025 — CCA Secure Container (Summary)
- **Content**: NDSS 2025: Extending Arm CCA to secure container architecture for cloud-native deployment. CCA-backed container isolation preserving containerization model.
- **Sources**: Zhou 2025, NDSS

## Page 41 [content]
- **Title**: RContainer 2025 — Background & Solution
- **Content**: Background: Containers share kernel for efficiency but traditional boundaries vulnerable to high-privilege host/kernel paths. Solution: CCA hardware primitives for container workload confidentiality while retaining deployment model.
- **Sources**: Zhou 2025 p.1-18

## Page 42 [content]
- **Title**: RContainer 2025 — Experiments & Evaluation
- **Content**: Prototype evaluation. Evaluation: Strong cloud-native potential for secure container services. Risks: Kubernetes/runtime modification, debugging observability, tenant migration costs.
- **Sources**: Zhou 2025, evidence ledger E1

## Page 43 [content]
- **Title**: NanoZone 2025 — CCA Fine-Grained Memory (Summary)
- **Content**: arXiv preprint exploring scalable, efficient secure memory protection for Arm CCA. Addresses VM/Realm granularity being too coarse for some workloads.
- **Sources**: Liu 2025, arXiv

## Page 44 [content]
- **Title**: NanoZone 2025 — Background & Solution
- **Content**: Background: Realm/VM granularity creates management cost, protection domain count, and intra-app sensitive data isolation tradeoffs. Solution: Research on CCA granule/lifecycle supporting smaller protection domains.
- **Sources**: Liu 2025 p.1-15

## Page 45 [content]
- **Title**: NanoZone 2025 — Experiments & Evaluation
- **Content**: Preprint with design and evaluation. Evaluation: Directly addresses CCA granularity and scalability. Draft status; not peer-reviewed consensus. Potential for plugin sandbox, key handling, multi-tenant component isolation if hardware costs controllable.
- **Sources**: Liu 2025, evidence ledger E3

## Page 46 [content]
- **Title**: 04 — Direction Summary & Comparison
- **Content**: Shelter (user-space) -> RContainer (cloud-native) -> NanoZone (fine-grained). Evolution from VM Realm to application/container/component isolation. Evidence grades: E1, E1, E3.
- **Sources**: Evidence ledger 04

## Page 47 [chapter]
- **Title**: 05 — Arm CCA I/O, DMA, Accelerator & Interrupt
- **Subtitle**: ACAI / Devlore / Accelerator TEE SoK
- **Introduction**: Device access, DMA, interrupt ownership, and accelerator workflow within CCA boundary

## Page 48 [content]
- **Title**: ACAI 2023 — CCA Accelerator Execution (Summary)
- **Content**: arXiv: Extending Arm CCA to protect accelerator execution. CPU Realm offload path does not automatically inherit confidentiality. Early design point for CCA-aware accelerator paths.
- **Sources**: ACAI 2023, arXiv

## Page 49 [content]
- **Title**: ACAI 2023 — Background & Solution
- **Content**: Background: Confidential workloads need GPU/NPU/FPGA but device DMA/queue/driver controlled by untrusted host exposes Realm data. Solution: CCA-aware accelerator path connecting Realm, device memory, queue management, and attestation.
- **Sources**: ACAI 2023 p.1-12

## Page 50 [content]
- **Title**: ACAI 2023 — Experiments & Evaluation
- **Content**: Prototype/design evaluation. Evaluation: Pushes CCA discussion from CPU/VM to accelerator workflow. Preprint risks: not standardized interface, driver/runtime TCB remains engineering challenge. AI/HPC confidential offload potential.
- **Sources**: ACAI 2023, evidence ledger E3

## Page 51 [content]
- **Title**: Devlore 2024 — Device Interrupt Protection (Summary)
- **Content**: arXiv: Device interrupt protection for confidential VMs. Interrupt delivery as core security surface, not just DMA. Timing/ownership leakage and state machine attacks via interrupts.
- **Sources**: Bertschi 2024, arXiv

## Page 52 [content]
- **Title**: Devlore 2024 — Background & Solution
- **Content**: Background: Even with DMA controlled, device interrupts can leak timing/ownership or destroy confidential VM state machine. Solution: Interrupt delivery and device ownership bound to confidential boundary, making device events part of security perimeter.
- **Sources**: Bertschi 2024 p.1-15

## Page 53 [content]
- **Title**: Devlore 2024 — Experiments & Evaluation
- **Content**: Prototype evidence. Evaluation: Identifies interrupt as CCA device path core security surface. Draft status; needs hardware, firmware, OS, hypervisor, and interrupt controller coordination. Critical for cloud direct-device and accelerator tenant isolation.
- **Sources**: Bertschi 2024, evidence ledger E3

## Page 54 [content]
- **Title**: Accelerator TEE SoK 2026 (Summary)
- **Content**: NDSS 2026 SoK: Taxonomy for accelerator TEE design space across Host-type/Acc.-type/Mix-type. 51 studies analyzed covering GPU, NPU, TPU, FPGA, DPU/SmartNIC. Fills CCA I/O device path taxonomy gap.
- **Sources**: Wang/Huang 2026, NDSS 2026

## Page 55 [content]
- **Title**: Accelerator TEE SoK — Background & Solution
- **Content**: Background: Device TEE mechanisms more fragmented than CPU TEE. Solution: Taxonomy distinguishing device identity, memory path, queue, runtime, driver TCB, and attestation. Serves as CCA I/O background substrate.
- **Sources**: Wang/Huang 2026 p.2-6

## Page 56 [content]
- **Title**: Accelerator TEE SoK — Experiments & Evaluation
- **Content**: No new experiments; corpus and taxonomy tables. Evaluation: Systematizes accelerator TEE design space avoiding CPU-only narrative. Not Arm CCA-specific or production deployment proof. Useful for product requirements and vendor benchmarking.
- **Sources**: Wang/Huang 2026, evidence ledger E2

## Page 57 [content]
- **Title**: 05 — Direction Summary & Comparison
- **Content**: ACAI (accelerator path) + Devlore (interrupt boundary) + SoK (taxonomy). Two drafts (E3) plus survey (E2). CCA device path security requires combining all three perspectives with SPDM/TDISP/IDE evidence.
- **Sources**: Evidence ledger 05

## Page 58 [chapter]
- **Title**: 06 — Attestation, Boot & Lifecycle
- **Subtitle**: SWATT / RATS / VRASED
- **Introduction**: From software attestation to standardized remote attestation architecture and verified hardware/software co-design

## Page 59 [content]
- **Title**: SWATT 2004 — Software Attestation (Summary)
- **Content**: IEEE S&P 2004: Early software attestation using timing-sensitive checksum for remote verification of embedded device memory. Challenge-response model with strict timing assumptions.
- **Sources**: Seshadri 2004, IEEE S&P

## Page 60 [content]
- **Title**: SWATT 2004 — Background & Solution
- **Content**: Background: Low-end embedded devices lack hardware RoT but need remote code integrity verification. Solution: Timing-sensitive memory checksum with verifier/prover challenge-response. Strict time assumptions constrain prover computing to prevent tampering.
- **Sources**: Seshadri 2004 p.1-10

## Page 61 [content]
- **Title**: SWATT 2004 — Experiments & Evaluation
- **Content**: Embedded node evaluation. Evaluation: High historical value for attestation evolution from software to hardware RoT. Limited against modern strong adversaries and complex SoC/TEE. Modern commercial should use hardware RoT, standardized evidence, and verifier policy.
- **Sources**: Seshadri 2004, evidence ledger E1

## Page 62 [content]
- **Title**: RATS Architecture (Summary)
- **Content**: RFC 9334: Standardized attestation architecture defining attester, verifier, relying party, evidence, endorsements, reference values, attestation results, and appraisal policy. Cross-TEE remote attestation foundation.
- **Sources**: RATS RFC 9334

## Page 63 [content]
- **Title**: RATS — Background & Solution
- **Content**: Background: Multi-platform attestation needs unified roles, messages, freshness, and verifier policy vocabulary. Solution: Standardized evidence generation, transfer, evaluation roles and topology. EAT for token encoding of entity state and security claims.
- **Sources**: RATS RFC 9334

## Page 64 [content]
- **Title**: RATS — Experiments & Evaluation
- **Content**: Standard with no experiments. Evaluation: Authoritative baseline for cross-platform attestation terminology and verifier policy. Does not prove any platform measurement chain sufficient. Strong standardization potential but complex policy operation.
- **Sources**: RATS, evidence ledger E0

## Page 65 [content]
- **Title**: VRASED 2019 — Verified RA Co-Design (Summary)
- **Content**: USENIX Security 2019: Hardware/software remote attestation root co-design with formal verification for simple embedded devices. Verified security sub-properties with MSP430/Basys3 FPGA implementation.
- **Sources**: Nunes 2019, USENIX Security

## Page 66 [content]
- **Title**: VRASED 2019 — Background & Solution
- **Content**: Background: RA security depends on hardware isolation, software routine, and protocol together, but early schemes lacked machine-checkable implementation proofs. Solution: Minimal hardware extensions protecting attestation code, keys, and memory access with formal verification.
- **Sources**: Nunes 2019 p.1-18

## Page 67 [content]
- **Title**: VRASED 2019 — Experiments & Evaluation
- **Content**: Prototype and verification evidence for MSP430/Basys3. Evaluation: Strong evidence combining formal verification, co-design, and real prototype. Targets simple embedded devices, not cloud CVM or CCA Realm. Suitable for auditable MCU/IoT RoT and attestation IP.
- **Sources**: Nunes 2019, evidence ledger E1

## Page 68 [content]
- **Title**: 06 — Direction Summary & Comparison
- **Content**: SWATT (E1 historical) -> RATS (E0 standard) -> VRASED (E1 verified). Evolution: software timing -> standardized architecture -> formally verified co-design. Gap: cloud CVM/Realm evidence profiles need further work.
- **Sources**: Evidence ledger 06

## Page 69 [chapter]
- **Title**: 07 — RISC-V Security Primitives
- **Subtitle**: Privileged ISA / IOMMU / AIA
- **Introduction**: Foundation primitives for RISC-V TEEs: privilege modes, PMP, I/O translation, and interrupt architecture

## Page 70 [content]
- **Title**: RISC-V Privileged Architecture (Summary)
- **Content**: Standard specification defining M/S/U/HS/VS modes, PMP/ePMP/Smepmp, traps, translation, and paging substrate. Foundation for all RISC-V TEE, CoVE, and AP-TEE discussions.
- **Sources**: RISC-V Privileged ISA Spec

## Page 71 [content]
- **Title**: RISC-V Privileged — Background & Solution
- **Content**: Background: RISC-V security must start from standard privilege/translation/memory-control mechanisms. Solution: M/S/U and virtualization modes combined with PMP/ePMP/Smepmp and trap/translation mechanisms form isolation substrate.
- **Sources**: RISC-V Privileged ISA Spec

## Page 72 [content]
- **Title**: RISC-V Privileged — Experiments & Evaluation
- **Content**: Standard with no experiments. Evaluation: Common foundation for all RISC-V TEE. Not a complete confidential VM or enclave solution, nor does it cover device I/O isolation. Commercial value in open ecosystem consensus with implementation variance risks.
- **Sources**: RISC-V Privileged ISA, evidence ledger E0

## Page 73 [content]
- **Title**: RISC-V IOMMU (Summary)
- **Content**: Standard I/O translation/protection architecture for device address translation and access permission control. Current substrate for DMA isolation and CoVE-IO discussions.
- **Sources**: RISC-V IOMMU Spec

## Page 74 [content]
- **Title**: RISC-V IOMMU — Background & Solution
- **Content**: Background: DMA and bus masters bypass CPU-side PMP/page tables. Solution: IOMMU brings device-initiated access into configurable translation/protection boundary with I/O page tables and permission semantics.
- **Sources**: RISC-V IOMMU Spec

## Page 75 [content]
- **Title**: RISC-V IOMMU — Experiments & Evaluation
- **Content**: Standard with no experiments. Evaluation: Standard substrate for RISC-V confidential I/O and DMA isolation. IOMMU itself is not a TEE; does not cover device identity, attestation, or interrupt ownership. Critical for server and heterogeneous device pass-through.
- **Sources**: RISC-V IOMMU, evidence ledger E0

## Page 76 [content]
- **Title**: RISC-V AIA (Summary)
- **Content**: Advanced Interrupt Architecture specification defining interrupt, MSI, and virtual interrupt semantics. Foundation for trusted interrupt delivery and confidential I/O.
- **Sources**: RISC-V AIA Spec

## Page 77 [content]
- **Title**: RISC-V AIA — Background & Solution
- **Content**: Background: Confidential I/O needs trusted interrupt/MSI delivery, not just DMA isolation. Solution: AIA standardizes interrupt controller and MSI/virtual interrupt semantics for trusted delivery substrate.
- **Sources**: RISC-V AIA Spec

## Page 78 [content]
- **Title**: RISC-V AIA — Experiments & Evaluation
- **Content**: Standard with no experiments. Evaluation: Provides standard vocabulary for trusted MSI and interrupt ownership. Does not define complete confidential I/O protocol or prove implementation correctness. Base value for pass-through devices and SmartNIC/DPU interrupt paths.
- **Sources**: RISC-V AIA, evidence ledger E0

## Page 79 [content]
- **Title**: 07 — Direction Summary & Comparison
- **Content**: Privileged ISA (E0 foundation) + IOMMU (E0 DMA) + AIA (E0 interrupts). Three E0 standards form RISC-V TEE substrate but require CoVE/AP-TEE for confidential VM semantics.
- **Sources**: Evidence ledger 07

## Page 80 [chapter]
- **Title**: 08 — RISC-V TEE Lineage
- **Subtitle**: Keystone / Penglai / SPEAR-V
- **Introduction**: From PMP-based enclave to scalable memory protection and tag/metadata primitives

## Page 81 [content]
- **Title**: Keystone 2020 — Open RISC-V TEE Framework (Summary)
- **Content**: EuroSys 2020: Open-source RISC-V TEE framework using PMP, security monitor, and runtime abstraction. Foundational public enclave baseline for research and customization.
- **Sources**: Lee 2020, EuroSys

## Page 82 [content]
- **Title**: Keystone 2020 — Background & Solution
- **Content**: Background: Commercial TEEs difficult to customize and verify. Solution: PMP region + security monitor + runtime + host ABI combined into extensible open-source TEE framework with hardware/software co-design.
- **Sources**: Lee 2020 p.1-18

## Page 83 [content]
- **Title**: Keystone 2020 — Experiments & Evaluation
- **Content**: CoreMark/Beebs/RV8 overhead results. Evaluation: RISC-V TEE baseline explaining PMP-based enclave advantages and limitations. EuroSys 2020 foundational evidence, not standardized confidential VM. Strong open-source customization potential.
- **Sources**: Lee 2020, evidence ledger E1

## Page 84 [content]
- **Title**: Penglai 2021 — Scalable Enclave Memory (Summary)
- **Content**: OSDI 2021: Scalable enclave memory protection for large-scale dynamic enclaves. Addresses serverless/microservice demand for many dynamic enclaves beyond PMP region limits.
- **Sources**: Feng 2021, OSDI

## Page 85 [content]
- **Title**: Penglai 2021 — Background & Solution
- **Content**: Background: Traditional PMP region limits constrain enclave count, dynamic lifecycle, and protected memory size. Solution: More scalable memory protection and metadata management pushing RISC-V enclave from static isolation to cloud-scale deployment.
- **Sources**: Feng 2021 p.1-20

## Page 86 [content]
- **Title**: Penglai 2021 — Experiments & Evaluation
- **Content**: Supports large enclave counts and secure memory sizes. Evaluation: Strong system contribution directly addressing PMP scale bottleneck. Requires hardware modifications and ecosystem support, not ratified RISC-V confidential computing standard. Cloud-native enclave service potential.
- **Sources**: Feng 2021, evidence ledger E1

## Page 87 [content]
- **Title**: SPEAR-V 2023 — Low-Overhead Enclave Primitive (Summary)
- **Content**: AsiaCCS 2023: Low-overhead practical RISC-V enclave primitive using tag/metadata for bidirectional sandbox and nested isolation. SoC and remote-attestation focus.
- **Sources**: Schrammel 2023, AsiaCCS

## Page 88 [content]
- **Title**: SPEAR-V 2023 — Background & Solution
- **Content**: Background: RISC-V enclaves need more flexible, low-overhead primitives resisting controlled-channel risks. Solution: Tag/metadata primitive replacing PMP-only isolation with finer-grained protected/unprotected interaction support.
- **Sources**: Schrammel 2023 p.1-20

## Page 89 [content]
- **Title**: SPEAR-V 2023 — Experiments & Evaluation
- **Content**: Low overhead in protected/unprotected scenarios. Evaluation: Clear mechanism design showing RISC-V enclave primitive evolution along tag/metadata path. Not RISC-V standard or production hardware. Potential for fine-grained embedded/edge TEE if hardware vendors adopt.
- **Sources**: Schrammel 2023, evidence ledger E1

## Page 90 [content]
- **Title**: 08 — Direction Summary & Comparison
- **Content**: Keystone (PMP baseline) -> Penglai (scalable memory) -> SPEAR-V (tag/metadata). Evolution from basic enclave to scalable to fine-grained. All E1 peer-reviewed but not standardized.
- **Sources**: Evidence ledger 08

## Page 91 [chapter]
- **Title**: 09 — RISC-V CoVE / AP-TEE Confidential VM
- **Subtitle**: CoVE / AP-TEE Spec / RISC-V TEE Survey
- **Introduction**: From pre-CoVE enclave to confidential VM with TVM lifecycle, TSM, and standardized ABI

## Page 92 [content]
- **Title**: CoVE 2023 — Confidential Computing Reference (Summary)
- **Content**: arXiv: RISC-V CoVE confidential computing reference architecture. Defines ISA, non-ISA, SoC, and platform requirements for confidential VMs. Early mainline design material for RISC-V CVMs.
- **Sources**: Sahita 2023, arXiv

## Page 93 [content]
- **Title**: CoVE 2023 — Background & Solution
- **Content**: Background: Multi-tenant confidential VMs need reduced trust in host/hypervisor, distinct from single-process enclave lineage. Solution: CoVE reference architecture describing TVM-required hardware, firmware, hypervisor, and platform support with host trust reduction.
- **Sources**: Sahita 2023 p.1-15

## Page 94 [content]
- **Title**: CoVE 2023 — Experiments & Evaluation
- **Content**: Architecture/position paper without complete system experiments. Evaluation: CVM entry material pushing RISC-V from enclave to TVM model. Does not provide complete ABI, state machine, or ratified standard. Directional value for open confidential VM ecosystem.
- **Sources**: Sahita 2023, evidence ledger E3

## Page 95 [content]
- **Title**: AP-TEE 2024 — TVM Lifecycle Spec (Summary)
- **Content**: RISC-V draft specification (v0.7) defining AP-TEE/CoVE TVM lifecycle and SBI ABI including TVM, TSM, COVH/COVG, and memory lifecycle. Current standards-track source for RISC-V confidential VM semantics.
- **Sources**: RISC-V AP-TEE Spec v0.7

## Page 96 [content]
- **Title**: AP-TEE 2024 — Background & Solution
- **Content**: Background: CoVE needs standardized TVM, TSM, memory lifecycle, attestation, and host/guest interface to compare with Arm CCA/RMM. Solution: TSM, TSM-driver, Supervisor Domains, COVH/COVG, memory donation/reclaim/share semantics.
- **Sources**: RISC-V AP-TEE Spec

## Page 97 [content]
- **Title**: AP-TEE 2024 — Experiments & Evaluation
- **Content**: Draft specification with no experiments. Evaluation: Most critical RISC-V CCA comparison material, directly defining TVM/TSM lifecycle. v0.7 RC2 still draft; state machine and ABI may change. Open confidential VM stack potential with standard convergence risks.
- **Sources**: AP-TEE Spec, evidence ledger E3

## Page 98 [content]
- **Title**: RISC-V TEE Survey 2025 (Summary)
- **Content**: MDPI 2025 survey cross-checking CoVE and AP-TEE lineage against older enclave systems. Auxiliary taxonomy for positioning Keystone/Penglai/SPEAR-V versus CoVE/AP-TEE.
- **Sources**: Boubakri 2025, MDPI Electronics

## Page 99 [content]
- **Title**: RISC-V TEE Survey — Background & Solution
- **Content**: Background: RISC-V TEE papers and specifications evolving rapidly. Solution: Classification by secure enclave, TEE mechanism, memory/I/O/attestation support. Mechanism claims must reference CoVE paper and AP-TEE spec.
- **Sources**: Boubakri 2025 p.1-30

## Page 100 [content]
- **Title**: RISC-V TEE Survey — Experiments & Evaluation
- **Content**: No new experiments. Evaluation: Helps position systems but survey cannot replace original mechanism papers or specifications. Useful for product roadmap classification; risk of taxonomy lag and threat model merging.
- **Sources**: Boubakri 2025, evidence ledger E2

## Page 101 [content]
- **Title**: 09 — Direction Summary & Comparison
- **Content**: CoVE (E3 architecture) + AP-TEE (E3 draft spec) + Survey (E2). RISC-V confidential VM still in draft stage; needs standard ratification, platform support, and verifier ecosystem maturation.
- **Sources**: Evidence ledger 09

## Page 102 [chapter]
- **Title**: 10 — RISC-V CoVE-IO / TEE-I/O
- **Subtitle**: sIOPMP / CoVE-IO Spec / RISC-V IOMMU
- **Introduction**: Device identity, DMA/MMIO, interrupt, and link security unified under I/O translation boundary

## Page 103 [content]
- **Title**: sIOPMP 2024 — Scalable I/O Protection (Summary)
- **Content**: ASPLOS 2024: Scalable I/O protection for TEE focusing on device access control and metadata/checking scalability. Peer-reviewed mechanism starting point for RISC-V trusted I/O and DMA isolation.
- **Sources**: Feng 2024, ASPLOS

## Page 104 [content]
- **Title**: sIOPMP 2024 — Background & Solution
- **Content**: Background: DMA devices bypass CPU memory isolation; I/O protection is critical TEE gap. Solution: Scalable I/O protection metadata/checking mechanism improving device access control efficiency for larger-scale I/O protection.
- **Sources**: Feng 2024 p.1-15

## Page 105 [content]
- **Title**: sIOPMP 2024 — Experiments & Evaluation
- **Content**: Throughput and overhead evaluation. Evaluation: Peer-reviewed SOTA for RISC-V I/O protection, usable as CoVE-IO access-control prerequisite. Mainly addresses access control, not full device identity, TDISP, link security, or trusted interrupt. High-performance device pass-through value.
- **Sources**: Feng 2024, evidence ledger E1

## Page 106 [content]
- **Title**: CoVE-IO 2026 — Confidential I/O Spec (Summary)
- **Content**: RISC-V draft (v0.3.0) defining CoVE-IO confidential I/O architecture extending TVM device use to device identity, DMA/MMIO, interrupt, and link security. Current standards-track SOTA for RISC-V confidential I/O.
- **Sources**: RISC-V CoVE-IO Spec v0.3.0

## Page 107 [content]
- **Title**: CoVE-IO 2026 — Background & Solution
- **Content**: Background: TVM using real devices must cover device identity, DMA/MMIO, interrupt delivery, link protection, and management control plane. Solution: TDI/TDM/DSM, SPDM, TDISP, PCIe IDE, trusted MSI mechanism combination describing draft confidential I/O lifecycle.
- **Sources**: RISC-V CoVE-IO Spec

## Page 108 [content]
- **Title**: CoVE-IO 2026 — Experiments & Evaluation
- **Content**: Draft specification with no experiments. Evaluation: Most important RISC-V confidential I/O specification entry. v0.3.0 may change; does not prove any hardware or OS implementation mature. Critical for RISC-V confidential accelerator/NIC ecosystem.
- **Sources**: CoVE-IO Spec, evidence ledger E3

## Page 109 [content]
- **Title**: RISC-V IOMMU for CoVE-IO (Summary)
- **Content**: IOMMU supports device DMA translation/protection as standard substrate for CoVE-IO device-side address access control. RISC-V IOMMU specification provides current DMA isolation substrate.
- **Sources**: RISC-V IOMMU Spec

## Page 110 [content]
- **Title**: RISC-V IOMMU for CoVE-IO — Background & Solution
- **Content**: Background: CoVE-IO cannot rely solely on PMP or CPU page tables. Solution: IOMMU controls device-addressable space with independent translation/protection semantics, integrating with CoVE-IO trusted device lifecycle.
- **Sources**: RISC-V IOMMU Spec

## Page 111 [content]
- **Title**: RISC-V IOMMU for CoVE-IO — Experiments & Evaluation
- **Content**: Standard with no experiments. Evaluation: Standard support point for CoVE-IO DMA isolation and I/O translation. IOMMU alone is not a confidential I/O solution; does not cover device identity, SPDM/TDISP, or link security. Server device pass-through and multi-tenant DMA management value.
- **Sources**: RISC-V IOMMU, evidence ledger E0

## Page 112 [content]
- **Title**: 10 — Direction Summary & Comparison
- **Content**: sIOPMP (E1 access control) + CoVE-IO (E3 draft) + IOMMU (E0 substrate). RISC-V confidential I/O still needs SPDM/TDISP/IDE convergence and platform ABI maturity.
- **Sources**: Evidence ledger 10

## Page 113 [chapter]
- **Title**: 11 — Memory Encryption, Integrity & Replay Protection
- **Subtitle**: Memory Encryption Survey / Bonsai Merkle Trees / AMD SEV-SNP
- **Introduction**: From encryption taxonomy to integrity trees and industry memory-integrity deployment

## Page 114 [content]
- **Title**: Memory Encryption Survey 2014 (Summary)
- **Content**: ACM Computing Surveys: Comprehensive review of memory encryption threat models, technical routes, and performance/security tradeoffs. Background starting point for secure memory encryption, integrity, and freshness concepts.
- **Sources**: Henson 2014, ACM CSUR

## Page 115 [content]
- **Title**: Memory Encryption Survey — Background & Solution
- **Content**: Background: Full disk encryption does not protect runtime DRAM, bus, and DMA paths. Solution: Taxonomy organized by hardware-enhanced, OS-assisted, dedicated device, and cryptographic memory controller routes explaining encryption, authentication, and freshness tradeoffs.
- **Sources**: Henson 2014 p.1-30

## Page 116 [content]
- **Title**: Memory Encryption Survey — Experiments & Evaluation
- **Content**: Survey with no experiments. Evaluation: Best for conceptual boundaries preventing PMP/GPT/IOPMP confusion with encryption. 2014 snapshot predates SEV-SNP, TDX, Arm CCA, RISC-V CoVE, CXL/PCIe IDE. Useful as architecture checklist but misses modern confidential VM ownership metadata.
- **Sources**: Henson 2014, evidence ledger E2

## Page 117 [content]
- **Title**: Bonsai Merkle Trees 2007 (Summary)
- **Content**: MICRO 2007: Address-independent seed encryption and Bonsai Merkle Trees for memory integrity and freshness. Counter/tree metadata detects tamper and replay. Peer-reviewed mechanism anchor for secure processor memory integrity.
- **Sources**: Rogers 2007, IEEE MICRO

## Page 118 [content]
- **Title**: Bonsai Merkle Trees — Background & Solution
- **Content**: Background: Encryption alone cannot detect stale or modified memory values from untrusted memory system. Solution: Address-independent seed encryption (AISE) reduces OS friction; Bonsai Merkle Trees authenticate counter metadata and root state for replay/tamper detection.
- **Sources**: Rogers 2007 p.1-12

## Page 119 [content]
- **Title**: Bonsai Merkle Trees — Experiments & Evaluation
- **Content**: Secure-processor simulation with reduced memory-integrity overhead. Evaluation: Shifts anchor from vendor/spec contrast to peer-reviewed memory-integrity mechanism. Not modern confidential VM product; useful for memory-controller integrity-tree design.
- **Sources**: Rogers 2007, evidence ledger E1

## Page 120 [content]
- **Title**: AMD SEV-SNP (Summary)
- **Content**: AMD industry whitepaper extending encrypted VM with secure nested paging and integrity-related protections reducing host-controlled metadata risks. Industry evidence for modern VM memory-integrity deployment.
- **Sources**: AMD SEV-SNP Whitepaper

## Page 121 [content]
- **Title**: AMD SEV-SNP — Background & Solution
- **Content**: Background: Early encrypted VMs faced nested page table, reverse map metadata, replay/alias, and malicious remapping attacks. Solution: Secure Nested Paging and RMP combining memory ownership/validation with encrypted VM lifecycle.
- **Sources**: AMD SEV-SNP Whitepaper

## Page 122 [content]
- **Title**: AMD SEV-SNP — Experiments & Evaluation
- **Content**: Industry material with no independent academic experiments. Evaluation: Shows memory encryption evolution from confidentiality to integrity/metadata protection. Vendor whitepaper not peer-reviewed proof; real cloud platform relevance with supplier binding and firmware version risks.
- **Sources**: AMD SEV-SNP, evidence ledger E4

## Page 123 [content]
- **Title**: 11 — Direction Summary & Comparison
- **Content**: Survey (E2 conceptual) + Bonsai (E1 mechanism) + SEV-SNP (E4 industry). Evolution: taxonomy -> peer-reviewed mechanism -> commercial deployment. Gap: CCA/CoVE memory integrity mechanisms still emerging.
- **Sources**: Evidence ledger 11

## Page 124 [chapter]
- **Title**: 12 — Memory / I/O Fabrics: CXL, PCIe IDE, RDMA
- **Subtitle**: DirectCXL / CXL-Tiers / ODRP
- **Introduction**: High-performance memory/fabric data paths extending confidential boundary beyond CPU local memory

## Page 125 [content]
- **Title**: DirectCXL 2022 (Summary)
- **Content**: ASPLOS 2022: Directly accessible memory disaggregation via CXL.mem, making remote memory host-addressable via load/store. 8.3x faster than RDMA for 64B reads. Linux 5.13 runtime and namespace support.
- **Sources**: Gouk 2022, ASPLOS

## Page 126 [content]
- **Title**: DirectCXL — Background & Solution
- **Content**: Background: Traditional memory disaggregation costs from page/object software paths, not just bandwidth. Solution: CXL device as passive memory module with HDM mapping, CXL switch virtual hierarchy, and /dev/directcxl runtime. Eliminates copy path in favor of address path.
- **Sources**: Gouk 2022 p.1-8

## Page 127 [content]
- **Title**: DirectCXL — Experiments & Evaluation
- **Content**: 64B read: RDMA 2705 cycles vs DirectCXL 328 cycles (8.3x). Real workload ~3x over RDMA-based disaggregation. Evaluation: Excellent for CXL memory boundary explanation, but lacks confidential I/O identity, encryption, and lifecycle evidence.
- **Sources**: Gouk 2022, evidence ledger E1

## Page 128 [content]
- **Title**: CXL-Tiers 2024 (Summary)
- **Content**: ASPLOS 2024: Intel Flat Memory Mode combining hardware-managed cache-line tiering with software VM performance isolation. 82% workloads <=5% slowdown. Memstrata allocator for outlier VM mitigation.
- **Sources**: Zhong 2024, ASPLOS

## Page 129 [content]
- **Title**: CXL-Tiers — Background & Solution
- **Content**: Background: Software tiering hard in VMs due to guest non-cooperation, page granularity issues, and high host overhead. Solution: Hardware cache-line swap in memory controller + mixed mode dedicated local memory + Memstrata slowdown estimator and dynamic allocator.
- **Sources**: Zhong 2024 p.1-13

## Page 130 [content]
- **Title**: CXL-Tiers — Experiments & Evaluation
- **Content**: 82% workloads <=5% slowdown, 95% <=10%. Memstrata reduces worst-case from 35% to <6%. CPU overhead 4% of one core, memory ~110MB. Evaluation: Strong cloud platform evidence with real CXL prototype. Does not cover CXL IDE, attestation, or confidential VM ownership.
- **Sources**: Zhong 2024, evidence ledger E1

## Page 131 [content]
- **Title**: ODRP 2025 (Summary)
- **Content**: ASPLOS 2025: Programmable RDMA remote paging offloading memory management to RNIC data path. Zero MNode CPU usage, 1.72x-12x utilization gain, 0.8%-14.6% application overhead.
- **Sources**: Wang 2025, ASPLOS

## Page 132 [content]
- **Title**: ODRP — Background & Solution
- **Content**: Background: RDMA remote paging tradeoff: static one-sided fast but wastes memory; dynamic/two-sided saves memory but consumes MNode CPU. Solution: Client-assisted WR chains on RNIC implementing load, mapped store, unmapped store, invalidate via native RDMA primitives.
- **Sources**: Wang 2025 p.1-12

## Page 133 [content]
- **Title**: ODRP — Experiments & Evaluation
- **Content**: 1.72x-12x utilization gain, zero MNode CPU, 87.3% swap throughput at 8 CNodes. Evaluation: Strong for SmartNIC/RNIC as memory-management actor. WR-chain complexity, empty queue, and crash recovery remain challenges. No attestation or encrypted link.
- **Sources**: Wang 2025, evidence ledger E1

## Page 134 [content]
- **Title**: 12 — Direction Summary & Comparison
- **Content**: DirectCXL (latency) + CXL-Tiers (VM management) + ODRP (utilization). All fabric substrate papers, not confidential-computing security proofs. Missing: CXL IDE, SPDM/TDISP, device attestation, CCA/CoVE ownership.
- **Sources**: Evidence ledger 12

## Page 135 [chapter]
- **Title**: 13 — Confidential I/O Protocol & Trusted Device Interface
- **Subtitle**: SPDM / CoVE-IO / TLS+RA
- **Introduction**: SPDM/TDISP/PCIe IDE and attested TLS combined with trusted device lifecycle

## Page 136 [content]
- **Title**: SPDM 2025 (Summary)
- **Content**: DMTF specification defining device/component identity, measurement, capability negotiation, certificate/challenge, and key exchange. First-party foundation for device identity, measurement, and secured session establishment.
- **Sources**: DMTF SPDM Spec (DSP0274)

## Page 137 [content]
- **Title**: SPDM — Background & Solution
- **Content**: Background: Confidential workload using real devices cannot trust host-enumerated PCIe requester ID, VF config, or driver state alone. Solution: Requester/responder protocol with certificate chain, measurement blocks, transcript, and secured session for device trust.
- **Sources**: DMTF SPDM Spec

## Page 138 [content]
- **Title**: SPDM — Experiments & Evaluation
- **Content**: Standard with no experiments. Evaluation: Common device-evidence foundation for CoVE-IO, TDISP, PCIe IDE keying, and vendor attestation. Single SPDM session does not prove TDI state, IOMMU policy, IDE link, or firmware isolation. Fleet-scale attestation potential.
- **Sources**: SPDM, evidence ledger E0

## Page 139 [content]
- **Title**: CoVE-IO TDISP 2026 (Summary)
- **Content**: RISC-V draft mapping SPDM and TDISP-style ideas into RISC-V TEE-I/O track. TDI/TDM/DSM, SPDM, TDISP, PCIe IDE, IOMMU, trusted MSI, and CoVE ABI combination for TVM trusted I/O.
- **Sources**: RISC-V CoVE-IO Spec v0.3.0

## Page 140 [content]
- **Title**: CoVE-IO TDISP — Background & Solution
- **Content**: Background: TVM/Realm using devices must cover device interface identity, DMA/MMIO, interrupt delivery, and PCIe/CXL link in same boundary. Solution: CoVE-IO draft describing RISC-V confidential I/O lifecycle with TDI/TDM/DSM and TSM/RDSM lifecycle.
- **Sources**: RISC-V CoVE-IO Spec

## Page 141 [content]
- **Title**: CoVE-IO TDISP — Experiments & Evaluation
- **Content**: Draft with no experiments. Evaluation: Most complete public RISC-V confidential I/O architecture draft. v0.3.0 unratified; TDISP/XT not publicly reviewable. Points to vendor NIC/DPU/accelerator assignment with SPDM certificate, TDISP state, IDE key risks.
- **Sources**: CoVE-IO, evidence ledger E3

## Page 142 [content]
- **Title**: TLS+RA 2025 (Summary)
- **Content**: USENIX ATC 2025: Integrating remote attestation into TLS handshake or certificate path. Binds application secure channel to attested TEE endpoint with endpoint/channel-binding evidence.
- **Sources**: Weinhold 2025, USENIX ATC

## Page 143 [content]
- **Title**: TLS+RA — Background & Solution
- **Content**: Background: SPDM and TDISP identify device/control-plane state but do not prove where application TLS runs or its workload identity. Solution: Remote-attestation evidence integrated into TLS, binding channel endpoint, TEE measurement, and verifier policy.
- **Sources**: Weinhold 2025 p.1-15

## Page 144 [content]
- **Title**: TLS+RA — Experiments & Evaluation
- **Content**: Peer-reviewed prototype and evaluation. Evaluation: Fits protocol/device-endpoint evidence better than device-only papers. Does not solve device assignment, TDISP state, IDE link protection, or DMA isolation. Useful for confidential service onboarding and key release.
- **Sources**: Weinhold 2025, evidence ledger E1

## Page 145 [content]
- **Title**: 13 — Direction Summary & Comparison
- **Content**: SPDM (E0 device identity) + CoVE-IO (E3 draft lifecycle) + TLS+RA (E1 endpoint binding). Combined: device identity -> trusted lifecycle -> application channel. Gap: production TDISP implementation and verifier policy automation.
- **Sources**: Evidence ledger 13

## Page 146 [chapter]
- **Title**: 14 — Accelerator / DPU / SmartNIC Confidential Offload
- **Subtitle**: HETEE / CloudScale / CAGE
- **Introduction**: From rack-level heterogeneous TEE to cloud-scale DSA pools and Arm CCA accelerator workflow

## Page 147 [content]
- **Title**: HETEE 2020 (Summary)
- **Content**: IEEE S&P 2020: Rack-level heterogeneous TEE with security controller and PCIe fabric dynamically isolating GPU/FPGA/TPU. Foundational peer-reviewed work for CPU-accelerator TEE co-design.
- **Sources**: Zhu 2020, IEEE S&P

## Page 148 [content]
- **Title**: HETEE — Background & Solution
- **Content**: Background: CPU TEE cannot naturally protect accelerator offload path; sensitive data exposed in GPU, driver, PCIe fabric, remote pool. Solution: Security Controller as thin TCB managing accelerator assignment, encryption, attestation, secure cleanup, and resource recycling.
- **Sources**: Zhu 2020 p.1-18

## Page 149 [content]
- **Title**: HETEE — Experiments & Evaluation
- **Content**: Real hardware prototype. ResNet152 inference max overhead 2.17%, training max 0.95%. Evaluation: Accelerator confidential offload baseline showing CPU TEE boundary extension. Pre-dates SPDM/TDISP/CoVE-IO. DPU/SmartNIC security-controller design inspiration.
- **Sources**: Zhu 2020, evidence ledger E1

## Page 150 [content]
- **Title**: CloudScale 2024 (Summary)
- **Content**: ACSAC 2024: Cloud-scale security controller bridging TEE-enabled nodes with legacy non-TEE DSA/NPU/GPU nodes. AI/Redis/file-system workloads average 1.5-5% overhead, scaling to 2236 concurrent NPUs.
- **Sources**: Dhar 2024, ACSAC

## Page 151 [content]
- **Title**: CloudScale — Background & Solution
- **Content**: Background: Most data center DSA nodes lack TEE capability; users must choose between accelerator performance and sensitive data protection. Solution: SC as TEE proxy executing access control, attestation, key exchange, and encrypted/authenticated data path.
- **Sources**: Dhar 2024 p.1-18

## Page 152 [content]
- **Title**: CloudScale — Experiments & Evaluation
- **Content**: 1.5-5% overhead, 2236 concurrent NPUs. Evaluation: Extends accelerator TEE from single-node to cloud-scale heterogeneous DSA pool. SC correctness and supply chain trust are hard assumptions. Does not replace SPDM/TDISP/PCIe IDE/IOMMU or vendor DPU RoT.
- **Sources**: Dhar 2024, evidence ledger E1

## Page 153 [content]
- **Title**: CAGE 2026 (Summary)
- **Content**: Building confidential accelerator computing environment for Arm CCA. Uses GPC/GPT and Monitor-side shadow task to protect Realm GPU/FPGA workflow. Peer-reviewed SOTA for Arm CCA accelerator enclaves.
- **Sources**: Wang 2026, PolyU

## Page 154 [content]
- **Title**: CAGE — Background & Solution
- **Content**: Background: Arm CCA protects Realm memory but untrusted accelerator driver/runtime handles code, metadata, MMIO, DMA buffer, and completion. Solution: Shadow task, Monitor verification, GPC/GPT protection, and accelerator-specific cleanup for real workflow isolation.
- **Sources**: Wang 2026 p.1-18

## Page 155 [content]
- **Title**: CAGE — Experiments & Evaluation
- **Content**: GPU benchmark 0.58%-5.31%, FPGA 9.61%-16.30%, TCB increment ~1301 LoC + 140 LoC. Evaluation: Current Arm CCA GPU/FPGA confidential accelerator peer-reviewed SOTA. Device identity, SPDM/TDISP, production CCA hardware, multi-tenant scheduling remain open.
- **Sources**: Wang 2026, evidence ledger E1

## Page 156 [content]
- **Title**: 14 — Direction Summary & Comparison
- **Content**: HETEE (rack-level) -> CloudScale (cloud-scale) -> CAGE (Arm CCA). Evolution from rack to cloud to architecture-specific. All E1 peer-reviewed. Needs SPDM/TDISP/IDE integration for production.
- **Sources**: Evidence ledger 14

## Page 157 [chapter]
- **Title**: 15 — SmartNIC / Trusted NIC / Secure Storage
- **Subtitle**: S-NIC / TNIC / Hazel
- **Introduction**: NIC-local root, secure offload, resource management, and confidential storage data paths

## Page 158 [content]
- **Title**: S-NIC 2024 (Summary)
- **Content**: EuroSys 2024: Virtual SmartNIC with hardware isolation for network functions on SmartNIC. Memory denylist, locked TLB, cache partitioning, accelerator virtualization, DMA isolation, bus arbitration.
- **Sources**: Zhou 2024, EuroSys

## Page 159 [content]
- **Title**: S-NIC — Background & Solution
- **Content**: Background: SmartNIC/DPU running packet processing, DPI, NAT, storage offload risks leakage or tampering between NIC OS and tenant functions. Solution: Virtual SmartNIC launch/destroy lifecycle with memory denylist, locked TLB, DMA isolation, cache partitioning, accelerator virtualization, bus arbitration.
- **Sources**: Zhou 2024 p.1-15

## Page 160 [content]
- **Title**: S-NIC — Experiments & Evaluation
- **Content**: Hardware area +8.89%, power +11.45%, throughput worst-case <1.7%. Evaluation: Clear NIC-local resource ownership baseline for secure vNIC/vSwitch/offload. No real production silicon or complete VM/Realm trusted I/O/SPDM/TDISP lifecycle. DPU tenant isolation guidance value.
- **Sources**: Zhou 2024, evidence ledger E1

## Page 161 [content]
- **Title**: TNIC 2025 (Summary)
- **Content**: ASPLOS 2025: Trusted NIC architecture with minimal silicon root-of-trust on NIC hardware. Transferable authentication and non-equivocation for trusted distributed systems. Tamarin-verified protocol core.
- **Sources**: Giantsidi 2025, ASPLOS

## Page 162 [content]
- **Title**: TNIC — Background & Solution
- **Content**: Background: CPU TEE large TCB, poor performance, high heterogeneity for cross-node network I/O. Solution: Minimal security primitives on NIC hardware with kernel-bypass stack and Tamarin-verified protocol. NIC-level silicon RoT replacing CPU-centric approach.
- **Sources**: Giantsidi 2025 p.1-18

## Page 163 [content]
- **Title**: TNIC — Experiments & Evaluation
- **Content**: Up to 6x vs CPU-centric TEE, hardware TCB ~2,114 LoC, Tamarin verification. Evaluation: Peer-reviewed SOTA and formal verification for network endpoint root-of-trust. Does not protect workload memory or replace SPDM/TDISP/IOMMU/link encryption/device lifecycle. SmartNIC local root academic blueprint.
- **Sources**: Giantsidi 2025, evidence ledger E1

## Page 164 [content]
- **Title**: Hazel 2026 (Summary)
- **Content**: arXiv: Secure disaggregated storage for NVMe-oF with confidentiality, integrity, and freshness. BlueField-3 DPU crypto offload. Common path 1-2% overhead, IO500 ~6.3%, YCSB p99 improvements.
- **Sources**: Chrapek 2026, arXiv

## Page 165 [content]
- **Title**: Hazel — Background & Solution
- **Content**: Background: dm-crypt/dm-integrity insufficient for confidential remote storage performance, scale, and replay freshness. Solution: Counter leasing, NVMe metadata, Hazel Merkle Tree, metadata cache, eventual consistency, and DPU crypto offload for NVMe-oF path.
- **Sources**: Chrapek 2026 p.1-20

## Page 166 [content]
- **Title**: Hazel — Experiments & Evaluation
- **Content**: Preprint with NVMe-oF prototype. Evaluation: Combines confidential storage data path, freshness, and DPU offload in one system. Preprint status; BlueField DPU attestation, SPDM/TDISP, NVMe-oF endpoint identity not complete. Near cloud confidential storage demand but crash consistency and KBS/DPU operations remain risks.
- **Sources**: Chrapek 2026, evidence ledger E3

## Page 167 [content]
- **Title**: 15 — Direction Summary & Comparison
- **Content**: S-NIC (function isolation) + TNIC (NIC root-of-trust) + Hazel (storage data path). Evolution: NIC-local isolation -> trusted endpoint -> secure storage. E1, E1, E3 evidence grades. Needs SPDM/TDISP/IDE and device lifecycle for full production stack.
- **Sources**: Evidence ledger 15

## Page 168 [final]
- **Title**: Key Takeaways & Research Gaps
- **Core message**: Hardware security has evolved from isolated CPU features to platform-level protection contracts. Arm CCA and RISC-V CoVE represent convergent confidential computing directions, but cross-architecture evidence chains, device attestation, and production I/O security remain open challenges.
- **Other info**: Evidence grades range from E0 (specifications) to E1 (peer-reviewed systems) to E4 (industry). The most significant gaps are in verified RMM implementations, ratified RISC-V standards, and confidential I/O protocol maturity.
