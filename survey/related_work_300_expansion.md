# Related Work Corpus Expansion to 300

Status date: 2026-05-12

This file records the 152 metadata-only candidates stored in `survey/candidate_reference.bib`. They were originally appended to `survey/reference.bib` during corpus expansion, but they are now kept separate from the 148 verified/active bibliography entries used by the survey.

Important rule: these entries are triage candidates, not downloaded/reviewed reference records. Before any candidate is cited substantively in the survey, verify its authors, venue, DOI/source URL, download a public PDF when available, create the matching `reference/<category>/<paper>/README.md`, and promote a canonical BibTeX entry into `survey/reference.bib`.

## Scope

The expansion follows the current survey boundary: Arm/RISC-V confidential-computing defenses, network/I/O/device/fabric defenses for confidential-computing paths, and ISA/hardware-design defenses such as memory tagging, pointer authentication, capabilities, CFI, page-table/PMP permissions, and memory encryption/integrity. Side-channel, physical, fault, Rowhammer, and generic network-security papers remain out of scope unless they directly change one of these mechanisms.

## Category Counts

| Category | Added | Intended use |
|---|---:|---|
| `accelerator-tee` | 18 | GPU/FPGA/NPU/DPU trusted execution and heterogeneous confidential-computing systems. |
| `arm-trustzone-cca` | 21 | Arm TrustZone-to-CCA lineage, CCA deployment models, CCA device/accelerator path candidates. |
| `attestation-boot-lifecycle` | 16 | Remote attestation, DICE/RATS/EAT/CoRIM, control-flow attestation and lifecycle evidence. |
| `confidential-io-fabric` | 21 | SmartNIC/DPU/NIC, RDMA/CXL/PCIe, secure vSwitch/offload and storage/network data-path baselines. |
| `hardware-tee-architecture` | 17 | Foundational secure-processor and enclave architecture lineage. |
| `isa-hardware-defense` | 18 | MTE/PAC/BTI/GCS/CHERI/CHERIoT/RV-CURE/CFI/memory-safety hardware defenses. |
| `memory-encryption-integrity` | 3 | Memory encryption, integrity-tree and replay-protection mechanisms. |
| `riscv-tee-architecture` | 21 | RISC-V TEE, CoVE/AP-TEE, secure monitor, PMP/ePMP/Smepmp and open hardware platform context. |
| `standards-industry` | 1 | Small number of mechanism-critical industry/spec anchors for comparison only. |
| `tee-runtime` | 16 | Cross-platform TEE runtime and network-facing enclave baselines; mostly comparison/background. |

## Priority Counts

| Priority | Meaning | Added |
|---|---|---:|
| P0 | Must verify/download first if this category is used in正文 | 42 |
| P1 | Important mechanism or representative baseline | 70 |
| P2 | Background, contrast, or boundary-only material | 40 |

## Immediate Download/Review Queue

Prioritize these newly added candidates because they are closest to the fixed survey scope:

### arm-trustzone-cca

- `rw2024hitchhikersguidearmcca` (2024) A Hitchhiker's Guide to Arm CCA
- `rw2025confidentialattestableefficientintercvm` (2025) Confidential, Attestable, and Efficient Inter-CVM Communication with Arm CCA
- `rw2025moregranularlesstrustenabling` (2025) More Granular Less Trust: Enabling Efficient Fine-Grained Isolation in Arm CCA
- `rw2026devloredeviceinterruptprotectionconfidential` (2026) Devlore: Device Interrupt Protection for Confidential Virtual Machines
- `rw2025rcontainersecurecontainerarchitecturearm` (2025) RContainer: A Secure Container Architecture with Arm CCA
- `rw2023shelterextendingarmccauser` (2023) SHELTER: Extending Arm CCA for User-Space Isolation
- `rw2024virtccavirtualizingarmconfidentialcomputing` (2024) virtCCA: Virtualizing Arm Confidential Computing Architecture
- `rw2025portalfastsecuredeviceaccess` (2025) PORTAL: Fast and Secure Device Access with Arm CCA for Modern Arm Mobile System-on-Chips

### riscv-tee-architecture

- `rw2020riscvphysicalmemoryprotection` (2020) RISC-V Physical Memory Protection and Enhanced PMP for Trusted Execution
- `rw2021riscvsmepmpsupervisormode` (2021) RISC-V Smepmp: Supervisor-Mode Enhanced Physical Memory Protection
- `rw2024riscvsupervisordomainsconfidential` (2024) RISC-V Supervisor Domains for Confidential Computing
- `rw2024riscvteeworkinggroup` (2024) RISC-V TEE Working Group CoVE Host and Guest Interface
- `rw2026riscvcoveio` (2026) RISC-V CoVE I/O Architecture
- `rw2025assuredconfidentialexecutionriscv` (2025) Assured Confidential Execution for RISC-V Embedded Systems
- `rw2025riscvconfidentialcomputingarchitecture` (2025) RISC-V Confidential Computing Architecture for Clouds and Edge
- `rw2025riscvrealmlikeconfidential` (2025) RISC-V Realm-Like Confidential Virtual Machines

### accelerator-tee

- `rw2018gravitontrustedexecutionenvironmentsgpus` (2018) Graviton: Trusted Execution Environments on GPUs
- `rw2020telekinesecurecomputingcloudgpus` (2020) Telekine: Secure Computing with Cloud GPUs
- `rw2022honeycombsecureefficientgpuexecutions` (2022) Honeycomb: Secure and Efficient GPU Executions via Static Validation
- `rw2024xputeeenablingtrustedexecutionheterogeneous` (2024) XpuTEE: Enabling Trusted Execution on Heterogeneous Accelerators
- `rw2020sgxfpgatrustedexecutionenvironment` (2020) SGX-FPGA: Trusted Execution Environment for CPU-FPGA Systems
- `rw2021shefshieldedenclavescloudfpgas` (2021) ShEF: Shielded Enclaves for Cloud FPGAs
- `rw2024confidentialcomputingheterogeneouscpugpu` (2024) Confidential Computing on Heterogeneous CPU-GPU Systems: Survey and Future Directions
- `rw2025soktrustedexecutionsocfpgas` (2025) SoK: Trusted Execution in SoC-FPGAs

### isa-hardware-defense

- `rw2015hafixhardwareassistedflowintegrity` (2015) HAFIX: Hardware-Assisted Flow Integrity Extension
- `rw2016hcfihardwareenforcedcontrolflow` (2016) HCFI: Hardware-Enforced Control-Flow Integrity
- `rw2008hardboundarchitecturalsupportspatialsafety` (2008) HardBound: Architectural Support for Spatial Safety of the C Programming Language
- `rw2012watchdoghardwaresafesecuremanual` (2012) Watchdog: Hardware for Safe and Secure Manual Memory Management and Full Memory Safety
- `rw2014watchdoglitehardwareacceleratedcompilerbased` (2014) WatchdogLite: Hardware-Accelerated Compiler-Based Pointer Checking
- `rw2015cherihybridcapabilitysystemarchitecture` (2015) CHERI: A Hybrid Capability-System Architecture for Scalable Software Compartmentalization
- `rw2019cheriabienforcingvalidpointerprovenance` (2019) CheriABI: Enforcing Valid Pointer Provenance and Minimizing Pointer Privilege in the POSIX C Run-Time Environment
- `rw2024cherihardwareenabledcc` (2024) CHERI: Hardware-Enabled C/C++ Memory Protection at Scale

### attestation-boot-lifecycle

- `rw2002bindfinegrainedattestationservice` (2002) BIND: A Fine-Grained Attestation Service for Secure Distributed Systems
- `rw2016cflatcontrolflowattestation` (2016) C-FLAT: Control-Flow Attestation for Embedded Devices Software
- `rw2017lofatlowoverheadcontrol` (2017) LO-FAT: Low-Overhead Control Flow Attestation in Hardware
- `rw2019vrasedverifiedhardwaresoftwareco` (2019) VRASED: A Verified Hardware-Software Co-Design for Remote Attestation
- `rw2023remoteattestationproceduresarchitecture` (2023) Remote ATtestation procedureS Architecture
- `rw2021deviceidentifiercompositionengine` (2021) Device Identifier Composition Engine

### hardware-tee-architecture

- `rw2010trustvisorefficienttcbreductionattestation` (2010) TrustVisor: Efficient TCB Reduction and Attestation
- `rw2008flickerexecutioninfrastructuretcbminimization` (2008) Flicker: An Execution Infrastructure for TCB Minimization

## Search Seeds Used

Recent web/arXiv searches during this expansion surfaced several current candidates that should be verified first when moving from corpus expansion to PDF ingestion:

- https://arxiv.org/abs/2506.07034 — NanoZone: Scalable, Efficient, and Secure Memory Protection for Arm CCA
- https://arxiv.org/abs/2506.05129 — OpenCCA: An Open Framework to Enable Arm CCA Research
- https://arxiv.org/abs/2512.01594 — Confidential, Attestable, and Efficient Inter-CVM Communication with Arm CCA
- https://arxiv.org/abs/2505.12995 — ACE: Confidential Computing for Embedded RISC-V Systems
- https://arxiv.org/abs/2503.16612 — SoK: Trusted Execution in SoC-FPGAs
- https://arxiv.org/abs/2408.11601 — Confidential Computing on Heterogeneous CPU-GPU Systems: Survey and Future Directions
- https://arxiv.org/abs/2509.18886 — Confidential LLM Inference: Performance and Cost Across CPU and GPU TEEs
- https://arxiv.org/abs/2406.08719 — TikTag: Breaking ARM Memory Tagging Extension with Speculative Execution; boundary-only for MTE limitations
- https://arxiv.org/abs/2407.08663 — Mon CHERI: Adapting Capability Hardware Enhanced RISC with Conditional Capabilities
- https://www.microsoft.com/en-us/research/uploads/prod/2024/02/cheriot_complete_memory_safety.pdf — CHERIoT: Complete Memory Safety for Embedded Devices

## Added Entries

| Key | Category | Priority | Year | Title |
|---|---|---|---:|---|
| `rw2013innovativeinstructionssoftwaremodelisolated` | `tee-runtime` | P1 | 2013 | Innovative Instructions and Software Model for Isolated Execution |
| `rw2014innovativeinstructionscreatetrustworthysoftware` | `tee-runtime` | P1 | 2014 | Using Innovative Instructions to Create Trustworthy Software Solutions |
| `rw2014shieldingapplicationsuntrustedcloudhaven` | `tee-runtime` | P1 | 2014 | Shielding Applications from an Untrusted Cloud with Haven |
| `rw2017graphenesgxpracticallibraryos` | `tee-runtime` | P1 | 2017 | Graphene-SGX: A Practical Library OS for Unmodified Applications on SGX |
| `rw2017panoplylowtcblinuxapplications` | `tee-runtime` | P1 | 2017 | Panoply: Low-TCB Linux Applications With SGX Enclaves |
| `rw2016ryoandistributedsandboxuntrustedcomputation` | `tee-runtime` | P2 | 2016 | Ryoan: A Distributed Sandbox for Untrusted Computation on Secret Data |
| `rw2015vc3trustworthydataanalyticscloud` | `tee-runtime` | P2 | 2015 | VC3: Trustworthy Data Analytics in the Cloud Using SGX |
| `rw2017opaqueobliviousencrypteddistributedanalytics` | `tee-runtime` | P2 | 2017 | Opaque: An Oblivious and Encrypted Distributed Analytics Platform |
| `rw2018enclavedbsecuredatabasesgx` | `tee-runtime` | P2 | 2018 | EnclaveDB: A Secure Database Using SGX |
| `rw2017eleosexitlessosservicessgx` | `tee-runtime` | P2 | 2017 | Eleos: ExitLess OS Services for SGX Enclaves |
| `rw2017hotcallsefficientsgxenclavecalls` | `tee-runtime` | P2 | 2017 | HotCalls: Efficient SGX Enclave Calls Without Switchless Calls |
| `rw2017glamdringautomaticapplicationpartitioningintel` | `tee-runtime` | P2 | 2017 | Glamdring: Automatic Application Partitioning for Intel SGX |
| `rw2020occlumsecureefficientmultitaskinginside` | `tee-runtime` | P2 | 2020 | Occlum: Secure and Efficient Multitasking Inside a Single Enclave of Intel SGX |
| `rw2019sgxlklsecuringhostos` | `tee-runtime` | P2 | 2019 | SGX-LKL: Securing the Host OS Interface for Trusted Execution |
| `rw2017endboxscalablemiddleboxfunctionsclient` | `tee-runtime` | P1 | 2017 | EndBox: Scalable Middlebox Functions Using Client-Side Trusted Execution |
| `rw2021chancelefficientmulticlientisolation` | `tee-runtime` | P2 | 2021 | Chancel: Efficient Multi-client Isolation Under Adversarial Programs |
| `rw2000architecturalsupportcopytamperresistant` | `hardware-tee-architecture` | P1 | 2000 | Architectural Support for Copy and Tamper Resistant Software |
| `rw2003aegisarchitecturetamperevidenttamper` | `hardware-tee-architecture` | P1 | 2003 | Aegis: Architecture for Tamper-Evident and Tamper-Resistant Processing |
| `rw2003singlechipsecureprocessor` | `hardware-tee-architecture` | P1 | 2003 | Single-Chip Secure Processor |
| `rw2003efficientmemoryintegrityverificationencryption` | `hardware-tee-architecture` | P1 | 2003 | Efficient Memory Integrity Verification and Encryption for Secure Processors |
| `rw2007bonsaimerkletreesefficientsecure` | `hardware-tee-architecture` | P1 | 2007 | Bonsai Merkle Trees: Efficient Secure Processors |
| `rw2010bastionarchitecturepracticalprotectionapplicatio` | `hardware-tee-architecture` | P1 | 2010 | Bastion: An Architecture for Practical Protection of Application and OS State |
| `rw2012hyperwallsecurevirtualizationcloudcomputing` | `hardware-tee-architecture` | P1 | 2012 | HyperWall: Secure Virtualization in Cloud Computing |
| `rw2010nohypevirtualizedcloudinfrastructurewithout` | `hardware-tee-architecture` | P2 | 2010 | NoHype: Virtualized Cloud Infrastructure Without the Virtualization |
| `rw2011sicehardwarelevelstronglyisolated` | `hardware-tee-architecture` | P1 | 2011 | SICE: A Hardware-Level Strongly Isolated Computing Environment |
| `rw2014isoxflexiblearchitecturehardware` | `hardware-tee-architecture` | P1 | 2014 | Iso-X: A Flexible Architecture for Hardware-Managed Isolated Execution |
| `rw2017komodoverificationdisentanglesecureenclave` | `hardware-tee-architecture` | P1 | 2017 | Komodo: Using Verification to Disentangle Secure-Enclave Hardware from Software |
| `rw2010trustvisorefficienttcbreductionattestation` | `hardware-tee-architecture` | P0 | 2010 | TrustVisor: Efficient TCB Reduction and Attestation |
| `rw2008flickerexecutioninfrastructuretcbminimization` | `hardware-tee-architecture` | P0 | 2008 | Flicker: An Execution Infrastructure for TCB Minimization |
| `rw2011memoirpracticalstatecontinuityprotected` | `hardware-tee-architecture` | P1 | 2011 | Memoir: Practical State Continuity for Protected Modules |
| `rw2013inktagsecureapplicationsuntrustedoperating` | `hardware-tee-architecture` | P1 | 2013 | InkTag: Secure Applications on an Untrusted Operating System |
| `rw2008overshadowvirtualizationbasedapproachretrofittin` | `hardware-tee-architecture` | P1 | 2008 | Overshadow: A Virtualization-Based Approach to Retrofitting Protection in Commodity Operating Systems |
| `rw2006proxossplitprivateapplicationsacross` | `hardware-tee-architecture` | P2 | 2006 | Proxos: Split Private Applications Across Trusted and Untrusted Hosts |
| `rw2013sancuslowcosttrustworthyextensible` | `riscv-tee-architecture` | P1 | 2013 | Sancus: Low-cost Trustworthy Extensible Networked Devices with a Zero-software Trusted Computing Base |
| `rw2017sancus20lowcost` | `riscv-tee-architecture` | P1 | 2017 | Sancus 2.0: A Low-Cost Security Architecture for IoT Devices |
| `rw2015tytantinytrustanchortiny` | `riscv-tee-architecture` | P1 | 2015 | TyTAN: Tiny Trust Anchor for Tiny Devices |
| `rw2020baolightweightstaticpartitioninghypervisor` | `riscv-tee-architecture` | P1 | 2020 | Bao: A Lightweight Static Partitioning Hypervisor for Modern Multi-Core Embedded Systems |
| `rw2018multizonesecurityriscv` | `riscv-tee-architecture` | P1 | 2018 | MultiZone Security for RISC-V |
| `rw2019arianeopensource64bit` | `riscv-tee-architecture` | P2 | 2019 | Ariane: An Open-Source 64-bit RISC-V Application Class Processor and Latest Improvements |
| `rw2019openpitonarianefirstopensource` | `riscv-tee-architecture` | P2 | 2019 | OpenPiton+Ariane: The First Open-Source SMP Linux-booting RISC-V System Scaling from One to Many Cores |
| `rw2020ibexembedded32bitrisc` | `riscv-tee-architecture` | P2 | 2020 | Ibex: An Embedded 32-bit RISC-V CPU Core |
| `rw2022cva6opensourceapplicationclass` | `riscv-tee-architecture` | P2 | 2022 | CVA6: The Open-Source Application Class RISC-V CPU |
| `rw2017pulpissimosmallsinglecorerisc` | `riscv-tee-architecture` | P2 | 2017 | PULPissimo: A Small Single-Core RISC-V SoC |
| `rw2019shaktitriscvprocessor` | `riscv-tee-architecture` | P1 | 2019 | Shakti-T: A RISC-V Processor With Light Weight Security Extensions |
| `rw2020hectorvheterogeneouscpuarchitecture` | `riscv-tee-architecture` | P1 | 2020 | Hector-V: A Heterogeneous CPU Architecture for a Secure RISC-V Execution Environment |
| `rw2020riscvphysicalmemoryprotection` | `riscv-tee-architecture` | P0 | 2020 | RISC-V Physical Memory Protection and Enhanced PMP for Trusted Execution |
| `rw2021riscvsmepmpsupervisormode` | `riscv-tee-architecture` | P0 | 2021 | RISC-V Smepmp: Supervisor-Mode Enhanced Physical Memory Protection |
| `rw2024riscvsupervisordomainsconfidential` | `riscv-tee-architecture` | P0 | 2024 | RISC-V Supervisor Domains for Confidential Computing |
| `rw2024riscvsbiriscv` | `riscv-tee-architecture` | P1 | 2024 | RISC-V SBI: The RISC-V Supervisor Binary Interface Specification |
| `rw2024riscvteeworkinggroup` | `riscv-tee-architecture` | P0 | 2024 | RISC-V TEE Working Group CoVE Host and Guest Interface |
| `rw2026riscvcoveio` | `riscv-tee-architecture` | P0 | 2026 | RISC-V CoVE I/O Architecture |
| `rw2025assuredconfidentialexecutionriscv` | `riscv-tee-architecture` | P0 | 2025 | Assured Confidential Execution for RISC-V Embedded Systems |
| `rw2025riscvconfidentialcomputingarchitecture` | `riscv-tee-architecture` | P0 | 2025 | RISC-V Confidential Computing Architecture for Clouds and Edge |
| `rw2025riscvrealmlikeconfidential` | `riscv-tee-architecture` | P0 | 2025 | RISC-V Realm-Like Confidential Virtual Machines |
| `rw2015trusticehardwareassistedisolatedcomputing` | `arm-trustzone-cca` | P1 | 2015 | TrustICE: Hardware-Assisted Isolated Computing Environments on Mobile Devices |
| `rw2016skeelightweightsecurekernellevel` | `arm-trustzone-cca` | P1 | 2016 | SKEE: A Lightweight Secure Kernel-Level Execution Environment for ARM |
| `rw2015secloakarmtrustzonebasedmobile` | `arm-trustzone-cca` | P2 | 2015 | SeCloak: ARM TrustZone-Based Mobile Peripheral Control |
| `rw2017vtzvirtualizingarmtrustzone` | `arm-trustzone-cca` | P1 | 2017 | vTZ: Virtualizing ARM TrustZone |
| `rw2019sanctuaryarmingtrustzoneuserspace` | `arm-trustzone-cca` | P1 | 2019 | SANCTUARY: ARMing TrustZone with User-space Enclaves |
| `rw2020privatezoneprovidingprivateexecutionenvironment` | `arm-trustzone-cca` | P1 | 2020 | PrivateZone: Providing a Private Execution Environment Using ARM TrustZone |
| `rw2020opteetrustedexecutionenvironment` | `arm-trustzone-cca` | P1 | 2020 | OP-TEE: Trusted Execution Environment for Arm |
| `rw2019teevvirtualizingtrustedexecutionenvironments` | `arm-trustzone-cca` | P1 | 2019 | TEEv: Virtualizing Trusted Execution Environments on Arm |
| `rw2010trustotptransformingsmartphonessecureone` | `arm-trustzone-cca` | P2 | 2010 | TrustOTP: Transforming Smartphones into Secure One-Time Password Tokens |
| `rw2015trustuitrustedpathmobileuser` | `arm-trustzone-cca` | P2 | 2015 | TrustUI: Trusted Path for Mobile User Interfaces |
| `rw2014tzrkprealtimekernel` | `arm-trustzone-cca` | P2 | 2014 | TZ-RKP: Real-Time Kernel Protection from the TrustZone Secure World |
| `rw2014samsungknoxsecurityframeworkandroid` | `arm-trustzone-cca` | P2 | 2014 | Samsung Knox: A Security Framework for Android Devices |
| `rw2016iskioslightweightdefenseagainstkernel` | `arm-trustzone-cca` | P2 | 2016 | IskiOS: Lightweight Defense Against Kernel-Level Attacks Using TrustZone |
| `rw2024hitchhikersguidearmcca` | `arm-trustzone-cca` | P0 | 2024 | A Hitchhiker's Guide to Arm CCA |
| `rw2025confidentialattestableefficientintercvm` | `arm-trustzone-cca` | P0 | 2025 | Confidential, Attestable, and Efficient Inter-CVM Communication with Arm CCA |
| `rw2025moregranularlesstrustenabling` | `arm-trustzone-cca` | P0 | 2025 | More Granular Less Trust: Enabling Efficient Fine-Grained Isolation in Arm CCA |
| `rw2026devloredeviceinterruptprotectionconfidential` | `arm-trustzone-cca` | P0 | 2026 | Devlore: Device Interrupt Protection for Confidential Virtual Machines |
| `rw2025rcontainersecurecontainerarchitecturearm` | `arm-trustzone-cca` | P0 | 2025 | RContainer: A Secure Container Architecture with Arm CCA |
| `rw2023shelterextendingarmccauser` | `arm-trustzone-cca` | P0 | 2023 | SHELTER: Extending Arm CCA for User-Space Isolation |
| `rw2024virtccavirtualizingarmconfidentialcomputing` | `arm-trustzone-cca` | P0 | 2024 | virtCCA: Virtualizing Arm Confidential Computing Architecture |
| `rw2025portalfastsecuredeviceaccess` | `arm-trustzone-cca` | P0 | 2025 | PORTAL: Fast and Secure Device Access with Arm CCA for Modern Arm Mobile System-on-Chips |
| `rw2002bindfinegrainedattestationservice` | `attestation-boot-lifecycle` | P0 | 2002 | BIND: A Fine-Grained Attestation Service for Secure Distributed Systems |
| `rw2005pioneerverifyingcodeintegrityenforcing` | `attestation-boot-lifecycle` | P1 | 2005 | Pioneer: Verifying Code Integrity and Enforcing Untampered Code Execution on Legacy Systems |
| `rw2009trincsmalltrustedhardwarelarge` | `attestation-boot-lifecycle` | P1 | 2009 | TrInc: Small Trusted Hardware for Large Distributed Systems |
| `rw2007a2mscalablesecuremonotoniccounters` | `attestation-boot-lifecycle` | P1 | 2007 | A2M: Scalable and Secure Monotonic Counters for Virtualized Systems |
| `rw2011minbfthowtolerateffaults` | `attestation-boot-lifecycle` | P2 | 2011 | MinBFT: How to Tolerate f Faults in BFT Systems |
| `rw2012cheapbftresourceefficientbyzantinefault` | `attestation-boot-lifecycle` | P2 | 2012 | CheapBFT: Resource-Efficient Byzantine Fault Tolerance |
| `rw2016cflatcontrolflowattestation` | `attestation-boot-lifecycle` | P0 | 2016 | C-FLAT: Control-Flow Attestation for Embedded Devices Software |
| `rw2017lofatlowoverheadcontrol` | `attestation-boot-lifecycle` | P0 | 2017 | LO-FAT: Low-Overhead Control Flow Attestation in Hardware |
| `rw2019vrasedverifiedhardwaresoftwareco` | `attestation-boot-lifecycle` | P0 | 2019 | VRASED: A Verified Hardware-Software Co-Design for Remote Attestation |
| `rw2019erasmusefficientremoteattestationvia` | `attestation-boot-lifecycle` | P1 | 2019 | ERASMUS: Efficient Remote Attestation via Self-Measurement for Unattended Settings |
| `rw2017hydrahybriddesignremoteattestation` | `attestation-boot-lifecycle` | P1 | 2017 | HYDRA: Hybrid Design for Remote Attestation |
| `rw2019diatdataintegrityattestationresilient` | `attestation-boot-lifecycle` | P2 | 2019 | DIAT: Data Integrity Attestation for Resilient Collaboration of Autonomous Systems |
| `rw2020scarrscalableruntimeremoteattestation` | `attestation-boot-lifecycle` | P1 | 2020 | ScaRR: Scalable Runtime Remote Attestation for Complex Systems |
| `rw2016seedsecurenoninteractiveattestation` | `attestation-boot-lifecycle` | P1 | 2016 | SeED: Secure Non-Interactive Attestation for Embedded Devices |
| `rw2023remoteattestationproceduresarchitecture` | `attestation-boot-lifecycle` | P0 | 2023 | Remote ATtestation procedureS Architecture |
| `rw2021deviceidentifiercompositionengine` | `attestation-boot-lifecycle` | P0 | 2021 | Device Identifier Composition Engine |
| `rw2016flexnicrethinkingnetworkdma` | `confidential-io-fabric` | P1 | 2016 | FlexNIC: Rethinking Network DMA |
| `rw2014arrakisoperatingsystemiscontrol` | `confidential-io-fabric` | P1 | 2014 | Arrakis: The Operating System is the Control Plane |
| `rw2014ixprotecteddataplaneoperatingsystem` | `confidential-io-fabric` | P1 | 2014 | IX: A Protected Dataplane Operating System for High Throughput and Low Latency |
| `rw2016netbrickstakingvoutnfv` | `confidential-io-fabric` | P2 | 2016 | NetBricks: Taking the V out of NFV |
| `rw2016clicknphighlyflexiblehighperformance` | `confidential-io-fabric` | P2 | 2016 | ClickNP: Highly Flexible and High Performance Network Processing with Reconfigurable Hardware |
| `rw2021fairnicpredictablevmlevelnetwork` | `confidential-io-fabric` | P1 | 2021 | FairNIC: Predictable VM-Level Network Performance for Public Clouds |
| `rw2019ipipeframeworkbuildingrealtime` | `confidential-io-fabric` | P2 | 2019 | iPipe: A Framework for Building Real-Time Streaming Applications with Programmable NICs |
| `rw2020panichighperformanceprogrammablenic` | `confidential-io-fabric` | P1 | 2020 | PANIC: A High-Performance Programmable NIC for Multi-tenant Networks |
| `rw2018metronnfvservicechainstrue` | `confidential-io-fabric` | P2 | 2018 | Metron: NFV Service Chains at the True Speed of the Underlying Hardware |
| `rw2019e3energyefficientmicroservicessmartnic` | `confidential-io-fabric` | P2 | 2019 | E3: Energy-Efficient Microservices on SmartNIC-Accelerated Servers |
| `rw2021linefsefficientsmartnicoffloaddistributed` | `confidential-io-fabric` | P1 | 2021 | LineFS: Efficient SmartNIC Offload of a Distributed File System with Pipeline Parallelism |
| `rw2014farmfastremotememory` | `confidential-io-fabric` | P2 | 2014 | FaRM: Fast Remote Memory |
| `rw2014herdhighlyefficientrdmabased` | `confidential-io-fabric` | P2 | 2014 | HERD: A Highly Efficient RDMA-based Distributed Key-Value Store |
| `rw2019erpcfastrpcdatacenternetworks` | `confidential-io-fabric` | P2 | 2019 | eRPC: Fast RPC for Datacenter Networks |
| `rw2017infiniswapefficientmemorydisaggregationinfiniban` | `confidential-io-fabric` | P1 | 2017 | Infiniswap: Efficient Memory Disaggregation with Infiniband RDMA |
| `rw2018legoosdisseminateddistributedoshardware` | `confidential-io-fabric` | P1 | 2018 | LegoOS: A Disseminated Distributed OS for Hardware Resource Disaggregation |
| `rw2020aifmhighperformanceapplicationintegrated` | `confidential-io-fabric` | P1 | 2020 | AIFM: High-Performance Application-Integrated Far Memory |
| `rw2020semerumemorydisaggregatedmanagedruntime` | `confidential-io-fabric` | P2 | 2020 | Semeru: A Memory-Disaggregated Managed Runtime |
| `rw2020fastswapfastscalableefficientremote` | `confidential-io-fabric` | P2 | 2020 | Fastswap: A Fast, Scalable, and Efficient Remote Memory System |
| `rw2023transparentpageplacementcxlenabled` | `confidential-io-fabric` | P1 | 2023 | Transparent Page Placement for CXL-Enabled Tiered Memory |
| `rw2023pondcxlbasedmemorypooling` | `confidential-io-fabric` | P1 | 2023 | Pond: CXL-Based Memory Pooling Systems for Cloud Platforms |
| `rw2018gravitontrustedexecutionenvironmentsgpus` | `accelerator-tee` | P0 | 2018 | Graviton: Trusted Execution Environments on GPUs |
| `rw2020telekinesecurecomputingcloudgpus` | `accelerator-tee` | P0 | 2020 | Telekine: Secure Computing with Cloud GPUs |
| `rw2020hixprotectinggpuacceleratedapplications` | `accelerator-tee` | P1 | 2020 | HIX: Protecting GPU-Accelerated Applications in the Cloud |
| `rw2022honeycombsecureefficientgpuexecutions` | `accelerator-tee` | P0 | 2022 | Honeycomb: Secure and Efficient GPU Executions via Static Validation |
| `rw2019securetimelygpuexecutioncyber` | `accelerator-tee` | P1 | 2019 | Secure and Timely GPU Execution in Cyber-Physical Systems |
| `rw2022litelowcostpracticalinter` | `accelerator-tee` | P1 | 2022 | LITE: A Low-Cost Practical Inter-Operable TEE for Heterogeneous Systems |
| `rw2024xputeeenablingtrustedexecutionheterogeneous` | `accelerator-tee` | P0 | 2024 | XpuTEE: Enabling Trusted Execution on Heterogeneous Accelerators |
| `rw2020sgxfpgatrustedexecutionenvironment` | `accelerator-tee` | P0 | 2020 | SGX-FPGA: Trusted Execution Environment for CPU-FPGA Systems |
| `rw2021shefshieldedenclavescloudfpgas` | `accelerator-tee` | P0 | 2021 | ShEF: Shielded Enclaves for Cloud FPGAs |
| `rw2022guardnnsecurednnacceleratortrusted` | `accelerator-tee` | P1 | 2022 | GuardNN: Secure DNN Accelerator for Trusted Execution |
| `rw2018slalomfastverifiableprivateexecution` | `accelerator-tee` | P1 | 2018 | Slalom: Fast, Verifiable and Private Execution of Neural Networks in Trusted Hardware |
| `rw2021cryptgpufastprivacypreservingmachine` | `accelerator-tee` | P2 | 2021 | CRYPTGPU: Fast Privacy-Preserving Machine Learning on the GPU |
| `rw2020delphicryptographicinferenceserviceneural` | `accelerator-tee` | P2 | 2020 | Delphi: A Cryptographic Inference Service for Neural Networks |
| `rw2018chironprivacypreservingmachinelearning` | `accelerator-tee` | P2 | 2018 | Chiron: Privacy-Preserving Machine Learning as a Service |
| `rw2020privadopracticalsecurednninference` | `accelerator-tee` | P2 | 2020 | Privado: Practical and Secure DNN Inference for Enclaves |
| `rw2024confidentialcomputingheterogeneouscpugpu` | `accelerator-tee` | P0 | 2024 | Confidential Computing on Heterogeneous CPU-GPU Systems: Survey and Future Directions |
| `rw2025confidentialllminferenceperformancecost` | `accelerator-tee` | P1 | 2025 | Confidential LLM Inference: Performance and Cost Across CPU and GPU TEEs |
| `rw2025soktrustedexecutionsocfpgas` | `accelerator-tee` | P0 | 2025 | SoK: Trusted Execution in SoC-FPGAs |
| `rw2005controlflowintegrityprinciplesimplementations` | `isa-hardware-defense` | P1 | 2005 | Control-Flow Integrity Principles, Implementations, and Applications |
| `rw2015hafixhardwareassistedflowintegrity` | `isa-hardware-defense` | P0 | 2015 | HAFIX: Hardware-Assisted Flow Integrity Extension |
| `rw2016hcfihardwareenforcedcontrolflow` | `isa-hardware-defense` | P0 | 2016 | HCFI: Hardware-Enforced Control-Flow Integrity |
| `rw2008hardboundarchitecturalsupportspatialsafety` | `isa-hardware-defense` | P0 | 2008 | HardBound: Architectural Support for Spatial Safety of the C Programming Language |
| `rw2009softboundhighlycompatiblecompletespatial` | `isa-hardware-defense` | P1 | 2009 | SoftBound: Highly Compatible and Complete Spatial Memory Safety for C |
| `rw2010cetscompilerenforcedtemporalsafety` | `isa-hardware-defense` | P1 | 2010 | CETS: Compiler-Enforced Temporal Safety for C |
| `rw2012watchdoghardwaresafesecuremanual` | `isa-hardware-defense` | P0 | 2012 | Watchdog: Hardware for Safe and Secure Manual Memory Management and Full Memory Safety |
| `rw2014watchdoglitehardwareacceleratedcompilerbased` | `isa-hardware-defense` | P0 | 2014 | WatchdogLite: Hardware-Accelerated Compiler-Based Pointer Checking |
| `rw2009baggyboundscheckingefficientbackwards` | `isa-hardware-defense` | P1 | 2009 | Baggy Bounds Checking: An Efficient and Backwards-Compatible Defense Against Out-of-Bounds Errors |
| `rw2013lowfatpointerscompactencoding` | `isa-hardware-defense` | P1 | 2013 | Low-Fat Pointers: Compact Encoding and Efficient Gate-Level Implementation of Fat Pointers for Spatial Safety and Capability-Based Security |
| `rw2015cherihybridcapabilitysystemarchitecture` | `isa-hardware-defense` | P0 | 2015 | CHERI: A Hybrid Capability-System Architecture for Scalable Software Compartmentalization |
| `rw2019cheriabienforcingvalidpointerprovenance` | `isa-hardware-defense` | P0 | 2019 | CheriABI: Enforcing Valid Pointer Provenance and Minimizing Pointer Privilege in the POSIX C Run-Time Environment |
| `rw2020cornucopiatemporalsafetycheriheaps` | `isa-hardware-defense` | P1 | 2020 | Cornucopia: Temporal Safety for CHERI Heaps |
| `rw2024cherihardwareenabledcc` | `isa-hardware-defense` | P0 | 2024 | CHERI: Hardware-Enabled C/C++ Memory Protection at Scale |
| `rw2024moncheriadaptingcapabilityhardware` | `isa-hardware-defense` | P1 | 2024 | Mon CHERI: Adapting Capability Hardware Enhanced RISC with Conditional Capabilities |
| `rw2018hardwareassistedaddresssanitizer` | `isa-hardware-defense` | P1 | 2018 | Hardware-Assisted AddressSanitizer |
| `rw2020pacstackauthenticatedcallstack` | `isa-hardware-defense` | P0 | 2020 | PACStack: An Authenticated Call Stack |
| `rw2019partspointerauthenticationruntimesafety` | `isa-hardware-defense` | P0 | 2019 | PARTS: Pointer Authentication Runtime Safety |
| `rw2003countermodeencryptionsecureprocessors` | `memory-encryption-integrity` | P1 | 2003 | Counter Mode Encryption for Secure Processors |
| `rw2005reducingoverheadmemoryintegrityverification` | `memory-encryption-integrity` | P1 | 2005 | Reducing the Overhead of Memory Integrity Verification in Secure Processors |
| `rw2010vaultsecurebindingpersistentmemory` | `memory-encryption-integrity` | P1 | 2010 | VAULT: A Secure Binding for Persistent Memory |
| `rw2024inteltrustdomainextensionsarchitecture` | `standards-industry` | P1 | 2024 | Intel Trust Domain Extensions Architecture Specification |

## Next Rules for Agents

- Do not treat `@misc` metadata-only entries as reviewed evidence.
- When a metadata-only entry becomes正文 evidence, replace it with verified BibTeX metadata in `survey/reference.bib` and add a `reference/` directory with source links and PDF status.
- SoK/survey candidates should trigger citation expansion only for in-scope mechanism papers, not side-channel or generic network-security branches.
- For Arm/RISC-V CCA/CoVE claims, prefer original specs and system papers over cross-platform runtime papers.
