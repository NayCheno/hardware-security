# P0/P1 Candidate Terminal Status

Status date: 2026-05-12

This file assigns every P0/P1 metadata-only candidate from `survey/candidate_reference.bib` to a terminal evidence state. It is a backlog/control record, not a bibliography used by正文. A `rw...` key must not be cited in `survey/*.tex`; use the listed active canonical key when one exists, or keep the candidate out of正文 until it is verified and promoted.

Terminal states used here:

- `Covered by active reference`: a verified or explicitly status-limited canonical entry already exists in `survey/reference.bib` and `reference/`; the `rw...` key remains metadata-only.
- `Backlog`: the candidate is explicit background/backlog and must not support substantive正文 claims until authors, venue, DOI/source, PDF availability, README review, and canonical BibTeX are added.
- `Background substrate`: the candidate may explain adjacent systems such as SGX runtimes, CXL/RDMA, SmartNICs, memory disaggregation, or ISA lineage, but it is not evidence for Arm CCA, RISC-V CoVE/AP-TEE, TDISP, or accelerator/device TEE claims unless promoted.

Counts: P0 = 42, P1 = 70, total P0/P1 = 112.

| Candidate key | Priority | Category | Year | Terminal state |
|---|---|---|---:|---|
| `rw2018gravitontrustedexecutionenvironmentsgpus` | P0 | `accelerator-tee` | 2018 | Covered by active reference `volos2018graviton`; candidate remains metadata-only. |
| `rw2020sgxfpgatrustedexecutionenvironment` | P0 | `accelerator-tee` | 2020 | Covered by active source-limited reference `xia2021sgxfpga`; no strong mechanism claim until public PDF is available. |
| `rw2020telekinesecurecomputingcloudgpus` | P0 | `accelerator-tee` | 2020 | Covered by active reference `hunt2020telekine`; candidate remains metadata-only. |
| `rw2021shefshieldedenclavescloudfpgas` | P0 | `accelerator-tee` | 2021 | Covered by active reference `zhao2022shef`; candidate remains metadata-only. |
| `rw2022honeycombsecureefficientgpuexecutions` | P0 | `accelerator-tee` | 2022 | Covered by active reference `mai2023honeycomb`; candidate remains metadata-only. |
| `rw2024confidentialcomputingheterogeneouscpugpu` | P0 | `accelerator-tee` | 2024 | Backlog accelerator TEE baseline; no substantive citation until source/PDF/README are verified. |
| `rw2024xputeeenablingtrustedexecutionheterogeneous` | P0 | `accelerator-tee` | 2024 | Covered by active source-limited reference `fan2025xputee`; abstract-level metadata only until public PDF is available. |
| `rw2025soktrustedexecutionsocfpgas` | P0 | `accelerator-tee` | 2025 | Covered by active reference `perkins2024socsok`; candidate remains metadata-only. |
| `rw2023shelterextendingarmccauser` | P0 | `arm-trustzone-cca` | 2023 | Covered by active reference `zhang2023shelter`; candidate remains metadata-only. |
| `rw2024hitchhikersguidearmcca` | P0 | `arm-trustzone-cca` | 2024 | Backlog P0 Arm CCA explainer; no substantive citation until source/PDF/README are verified. |
| `rw2024virtccavirtualizingarmconfidentialcomputing` | P0 | `arm-trustzone-cca` | 2024 | Covered by active reference `xu2026virtcca`; candidate remains metadata-only. |
| `rw2025confidentialattestableefficientintercvm` | P0 | `arm-trustzone-cca` | 2025 | Covered by active reference `abdollahi2025caec`; candidate remains metadata-only. |
| `rw2025moregranularlesstrustenabling` | P0 | `arm-trustzone-cca` | 2025 | Covered by active reference `liu2025lesstrust`; local PDF unavailable, so cite only metadata/source status until PDF is added. |
| `rw2025portalfastsecuredeviceaccess` | P0 | `arm-trustzone-cca` | 2025 | Covered by active reference `sang2025portal`; candidate remains metadata-only. |
| `rw2025rcontainersecurecontainerarchitecturearm` | P0 | `arm-trustzone-cca` | 2025 | Covered by active reference `zhou2025rcontainer`; candidate remains metadata-only. |
| `rw2026devloredeviceinterruptprotectionconfidential` | P0 | `arm-trustzone-cca` | 2026 | Covered by active reference `bertschi2026devlore`; candidate remains metadata-only. |
| `rw2002bindfinegrainedattestationservice` | P0 | `attestation-boot-lifecycle` | 2002 | Backlog foundational attestation; no substantive citation until canonical paper is ingested. |
| `rw2016cflatcontrolflowattestation` | P0 | `attestation-boot-lifecycle` | 2016 | Covered by active reference `abera2016cflat`; candidate remains metadata-only. |
| `rw2017lofatlowoverheadcontrol` | P0 | `attestation-boot-lifecycle` | 2017 | Covered by active reference `dessouky2017lofat`; candidate remains metadata-only. |
| `rw2019vrasedverifiedhardwaresoftwareco` | P0 | `attestation-boot-lifecycle` | 2019 | Covered by active reference `nunes2019vrased`; candidate remains metadata-only. |
| `rw2021deviceidentifiercompositionengine` | P0 | `attestation-boot-lifecycle` | 2021 | Covered by active official TCG reference `tcg_dice_2018`; candidate remains metadata-only. |
| `rw2023remoteattestationproceduresarchitecture` | P0 | `attestation-boot-lifecycle` | 2023 | Covered by active reference `rats_rfc`; candidate remains metadata-only. |
| `rw2008flickerexecutioninfrastructuretcbminimization` | P0 | `hardware-tee-architecture` | 2008 | Backlog/foundational lineage; no substantive citation until canonical paper/PDF/README are added. |
| `rw2010trustvisorefficienttcbreductionattestation` | P0 | `hardware-tee-architecture` | 2010 | Backlog/foundational lineage; no substantive citation until canonical paper/PDF/README are added. |
| `rw2008hardboundarchitecturalsupportspatialsafety` | P0 | `isa-hardware-defense` | 2008 | Backlog ISA/hardware-defense lineage; current正文 should use verified specs and active CHERIoT/RV-CURE/CVA6-CFI entries. |
| `rw2012watchdoghardwaresafesecuremanual` | P0 | `isa-hardware-defense` | 2012 | Backlog ISA/hardware-defense lineage; current正文 should use verified specs and active CHERIoT/RV-CURE/CVA6-CFI entries. |
| `rw2014watchdoglitehardwareacceleratedcompilerbased` | P0 | `isa-hardware-defense` | 2014 | Backlog ISA/hardware-defense lineage; current正文 should use verified specs and active CHERIoT/RV-CURE/CVA6-CFI entries. |
| `rw2015cherihybridcapabilitysystemarchitecture` | P0 | `isa-hardware-defense` | 2015 | Backlog ISA/hardware-defense lineage; current正文 should use verified specs and active CHERIoT/RV-CURE/CVA6-CFI entries. |
| `rw2015hafixhardwareassistedflowintegrity` | P0 | `isa-hardware-defense` | 2015 | Backlog ISA/hardware-defense lineage; current正文 should use verified specs and active CHERIoT/RV-CURE/CVA6-CFI entries. |
| `rw2016hcfihardwareenforcedcontrolflow` | P0 | `isa-hardware-defense` | 2016 | Backlog ISA/hardware-defense lineage; current正文 should use verified specs and active CHERIoT/RV-CURE/CVA6-CFI entries. |
| `rw2019cheriabienforcingvalidpointerprovenance` | P0 | `isa-hardware-defense` | 2019 | Backlog ISA/hardware-defense lineage; current正文 should use verified specs and active CHERIoT/RV-CURE/CVA6-CFI entries. |
| `rw2019partspointerauthenticationruntimesafety` | P0 | `isa-hardware-defense` | 2019 | Backlog ISA/hardware-defense lineage; current正文 should use verified specs and active CHERIoT/RV-CURE/CVA6-CFI entries. |
| `rw2020pacstackauthenticatedcallstack` | P0 | `isa-hardware-defense` | 2020 | Backlog ISA/hardware-defense lineage; current正文 should use verified specs and active CHERIoT/RV-CURE/CVA6-CFI entries. |
| `rw2024cherihardwareenabledcc` | P0 | `isa-hardware-defense` | 2024 | Backlog ISA/hardware-defense lineage; current正文 should use verified specs and active CHERIoT/RV-CURE/CVA6-CFI entries. |
| `rw2020riscvphysicalmemoryprotection` | P0 | `riscv-tee-architecture` | 2020 | Covered for current survey by `riscv_privileged`; candidate remains backlog for historical PMP discussion. |
| `rw2021riscvsmepmpsupervisormode` | P0 | `riscv-tee-architecture` | 2021 | Covered for current survey by `riscv_privileged`; candidate remains backlog for Smepmp history. |
| `rw2024riscvsupervisordomainsconfidential` | P0 | `riscv-tee-architecture` | 2024 | Covered for current survey by `riscv_ap_tee_2024`; no `rw` citation unless original source is verified. |
| `rw2024riscvteeworkinggroup` | P0 | `riscv-tee-architecture` | 2024 | Covered for current survey by `riscv_ap_tee_2024` and `sahita2023cove`; no `rw` citation. |
| `rw2025assuredconfidentialexecutionriscv` | P0 | `riscv-tee-architecture` | 2025 | Covered by active reference `ozga2025ace`; candidate remains metadata-only. |
| `rw2025riscvconfidentialcomputingarchitecture` | P0 | `riscv-tee-architecture` | 2025 | Backlog RISC-V substrate; no substantive citation until source/PDF/README are verified. |
| `rw2025riscvrealmlikeconfidential` | P0 | `riscv-tee-architecture` | 2025 | Backlog RISC-V substrate; no substantive citation until source/PDF/README are verified. |
| `rw2026riscvcoveio` | P0 | `riscv-tee-architecture` | 2026 | Covered by active reference `riscv_cove_io_2026`; draft/not-ratified status must remain explicit. |
| `rw2018slalomfastverifiableprivateexecution` | P1 | `accelerator-tee` | 2018 | Backlog accelerator TEE baseline; no substantive citation until source/PDF/README are verified. |
| `rw2019securetimelygpuexecutioncyber` | P1 | `accelerator-tee` | 2019 | Backlog accelerator TEE baseline; no substantive citation until source/PDF/README are verified. |
| `rw2020hixprotectinggpuacceleratedapplications` | P1 | `accelerator-tee` | 2020 | Backlog accelerator TEE baseline; no substantive citation until source/PDF/README are verified. |
| `rw2022guardnnsecurednnacceleratortrusted` | P1 | `accelerator-tee` | 2022 | Backlog accelerator TEE baseline; no substantive citation until source/PDF/README are verified. |
| `rw2022litelowcostpracticalinter` | P1 | `accelerator-tee` | 2022 | Backlog accelerator TEE baseline; no substantive citation until source/PDF/README are verified. |
| `rw2025confidentialllminferenceperformancecost` | P1 | `accelerator-tee` | 2025 | Backlog accelerator TEE baseline; no substantive citation until source/PDF/README are verified. |
| `rw2015trusticehardwareassistedisolatedcomputing` | P1 | `arm-trustzone-cca` | 2015 | Backlog Arm TrustZone/CCA lineage; no substantive citation until source/PDF/README are verified. |
| `rw2016skeelightweightsecurekernellevel` | P1 | `arm-trustzone-cca` | 2016 | Backlog Arm TrustZone/CCA lineage; no substantive citation until source/PDF/README are verified. |
| `rw2017vtzvirtualizingarmtrustzone` | P1 | `arm-trustzone-cca` | 2017 | Backlog Arm TrustZone/CCA lineage; no substantive citation until source/PDF/README are verified. |
| `rw2019sanctuaryarmingtrustzoneuserspace` | P1 | `arm-trustzone-cca` | 2019 | Backlog Arm TrustZone/CCA lineage; no substantive citation until source/PDF/README are verified. |
| `rw2019teevvirtualizingtrustedexecutionenvironments` | P1 | `arm-trustzone-cca` | 2019 | Backlog Arm TrustZone/CCA lineage; no substantive citation until source/PDF/README are verified. |
| `rw2020opteetrustedexecutionenvironment` | P1 | `arm-trustzone-cca` | 2020 | Backlog Arm TrustZone/CCA lineage; no substantive citation until source/PDF/README are verified. |
| `rw2020privatezoneprovidingprivateexecutionenvironment` | P1 | `arm-trustzone-cca` | 2020 | Backlog Arm TrustZone/CCA lineage; no substantive citation until source/PDF/README are verified. |
| `rw2005pioneerverifyingcodeintegrityenforcing` | P1 | `attestation-boot-lifecycle` | 2005 | Backlog attestation/lifecycle candidate; no substantive citation until canonical source is verified. |
| `rw2007a2mscalablesecuremonotoniccounters` | P1 | `attestation-boot-lifecycle` | 2007 | Backlog attestation/lifecycle candidate; no substantive citation until canonical source is verified. |
| `rw2009trincsmalltrustedhardwarelarge` | P1 | `attestation-boot-lifecycle` | 2009 | Backlog attestation/lifecycle candidate; no substantive citation until canonical source is verified. |
| `rw2016seedsecurenoninteractiveattestation` | P1 | `attestation-boot-lifecycle` | 2016 | Backlog attestation/lifecycle candidate; no substantive citation until canonical source is verified. |
| `rw2017hydrahybriddesignremoteattestation` | P1 | `attestation-boot-lifecycle` | 2017 | Backlog attestation/lifecycle candidate; no substantive citation until canonical source is verified. |
| `rw2019erasmusefficientremoteattestationvia` | P1 | `attestation-boot-lifecycle` | 2019 | Backlog attestation/lifecycle candidate; no substantive citation until canonical source is verified. |
| `rw2020scarrscalableruntimeremoteattestation` | P1 | `attestation-boot-lifecycle` | 2020 | Backlog attestation/lifecycle candidate; no substantive citation until canonical source is verified. |
| `rw2014arrakisoperatingsystemiscontrol` | P1 | `confidential-io-fabric` | 2014 | Background substrate for CXL/RDMA/SmartNIC/fabric; no substantive confidential-computing claim unless promoted. |
| `rw2014ixprotecteddataplaneoperatingsystem` | P1 | `confidential-io-fabric` | 2014 | Background substrate for CXL/RDMA/SmartNIC/fabric; no substantive confidential-computing claim unless promoted. |
| `rw2016flexnicrethinkingnetworkdma` | P1 | `confidential-io-fabric` | 2016 | Background substrate for CXL/RDMA/SmartNIC/fabric; no substantive confidential-computing claim unless promoted. |
| `rw2017infiniswapefficientmemorydisaggregationinfiniban` | P1 | `confidential-io-fabric` | 2017 | Background substrate for CXL/RDMA/SmartNIC/fabric; no substantive confidential-computing claim unless promoted. |
| `rw2018legoosdisseminateddistributedoshardware` | P1 | `confidential-io-fabric` | 2018 | Background substrate for CXL/RDMA/SmartNIC/fabric; no substantive confidential-computing claim unless promoted. |
| `rw2020aifmhighperformanceapplicationintegrated` | P1 | `confidential-io-fabric` | 2020 | Background substrate for CXL/RDMA/SmartNIC/fabric; no substantive confidential-computing claim unless promoted. |
| `rw2020panichighperformanceprogrammablenic` | P1 | `confidential-io-fabric` | 2020 | Background substrate for CXL/RDMA/SmartNIC/fabric; no substantive confidential-computing claim unless promoted. |
| `rw2021fairnicpredictablevmlevelnetwork` | P1 | `confidential-io-fabric` | 2021 | Background substrate for CXL/RDMA/SmartNIC/fabric; no substantive confidential-computing claim unless promoted. |
| `rw2021linefsefficientsmartnicoffloaddistributed` | P1 | `confidential-io-fabric` | 2021 | Background substrate for CXL/RDMA/SmartNIC/fabric; no substantive confidential-computing claim unless promoted. |
| `rw2023pondcxlbasedmemorypooling` | P1 | `confidential-io-fabric` | 2023 | Background substrate for CXL/RDMA/SmartNIC/fabric; no substantive confidential-computing claim unless promoted. |
| `rw2023transparentpageplacementcxlenabled` | P1 | `confidential-io-fabric` | 2023 | Background substrate for CXL/RDMA/SmartNIC/fabric; no substantive confidential-computing claim unless promoted. |
| `rw2000architecturalsupportcopytamperresistant` | P1 | `hardware-tee-architecture` | 2000 | Backlog/foundational lineage; no substantive citation until canonical paper/PDF/README are added. |
| `rw2003aegisarchitecturetamperevidenttamper` | P1 | `hardware-tee-architecture` | 2003 | Backlog/foundational lineage; no substantive citation until canonical paper/PDF/README are added. |
| `rw2003efficientmemoryintegrityverificationencryption` | P1 | `hardware-tee-architecture` | 2003 | Backlog/foundational lineage; no substantive citation until canonical paper/PDF/README are added. |
| `rw2003singlechipsecureprocessor` | P1 | `hardware-tee-architecture` | 2003 | Backlog/foundational lineage; no substantive citation until canonical paper/PDF/README are added. |
| `rw2007bonsaimerkletreesefficientsecure` | P1 | `hardware-tee-architecture` | 2007 | Backlog/foundational lineage; no substantive citation until canonical paper/PDF/README are added. |
| `rw2008overshadowvirtualizationbasedapproachretrofittin` | P1 | `hardware-tee-architecture` | 2008 | Backlog/foundational lineage; no substantive citation until canonical paper/PDF/README are added. |
| `rw2010bastionarchitecturepracticalprotectionapplicatio` | P1 | `hardware-tee-architecture` | 2010 | Backlog/foundational lineage; no substantive citation until canonical paper/PDF/README are added. |
| `rw2011memoirpracticalstatecontinuityprotected` | P1 | `hardware-tee-architecture` | 2011 | Backlog/foundational lineage; no substantive citation until canonical paper/PDF/README are added. |
| `rw2011sicehardwarelevelstronglyisolated` | P1 | `hardware-tee-architecture` | 2011 | Backlog/foundational lineage; no substantive citation until canonical paper/PDF/README are added. |
| `rw2012hyperwallsecurevirtualizationcloudcomputing` | P1 | `hardware-tee-architecture` | 2012 | Backlog/foundational lineage; no substantive citation until canonical paper/PDF/README are added. |
| `rw2013inktagsecureapplicationsuntrustedoperating` | P1 | `hardware-tee-architecture` | 2013 | Backlog/foundational lineage; no substantive citation until canonical paper/PDF/README are added. |
| `rw2014isoxflexiblearchitecturehardware` | P1 | `hardware-tee-architecture` | 2014 | Backlog/foundational lineage; no substantive citation until canonical paper/PDF/README are added. |
| `rw2017komodoverificationdisentanglesecureenclave` | P1 | `hardware-tee-architecture` | 2017 | Covered by active reference `ferraiuolo2017komodo`; candidate remains metadata-only. |
| `rw2005controlflowintegrityprinciplesimplementations` | P1 | `isa-hardware-defense` | 2005 | Backlog ISA/hardware-defense lineage; current正文 should use verified specs and active CHERIoT/RV-CURE/CVA6-CFI entries. |
| `rw2009baggyboundscheckingefficientbackwards` | P1 | `isa-hardware-defense` | 2009 | Backlog ISA/hardware-defense lineage; current正文 should use verified specs and active CHERIoT/RV-CURE/CVA6-CFI entries. |
| `rw2009softboundhighlycompatiblecompletespatial` | P1 | `isa-hardware-defense` | 2009 | Backlog ISA/hardware-defense lineage; current正文 should use verified specs and active CHERIoT/RV-CURE/CVA6-CFI entries. |
| `rw2010cetscompilerenforcedtemporalsafety` | P1 | `isa-hardware-defense` | 2010 | Backlog ISA/hardware-defense lineage; current正文 should use verified specs and active CHERIoT/RV-CURE/CVA6-CFI entries. |
| `rw2013lowfatpointerscompactencoding` | P1 | `isa-hardware-defense` | 2013 | Backlog ISA/hardware-defense lineage; current正文 should use verified specs and active CHERIoT/RV-CURE/CVA6-CFI entries. |
| `rw2018hardwareassistedaddresssanitizer` | P1 | `isa-hardware-defense` | 2018 | Backlog ISA/hardware-defense lineage; current正文 should use verified specs and active CHERIoT/RV-CURE/CVA6-CFI entries. |
| `rw2020cornucopiatemporalsafetycheriheaps` | P1 | `isa-hardware-defense` | 2020 | Backlog ISA/hardware-defense lineage; current正文 should use verified specs and active CHERIoT/RV-CURE/CVA6-CFI entries. |
| `rw2024moncheriadaptingcapabilityhardware` | P1 | `isa-hardware-defense` | 2024 | Backlog ISA/hardware-defense lineage; current正文 should use verified specs and active CHERIoT/RV-CURE/CVA6-CFI entries. |
| `rw2003countermodeencryptionsecureprocessors` | P1 | `memory-encryption-integrity` | 2003 | Backlog memory-integrity lineage; use active `henson2014memory` survey unless original paper is promoted. |
| `rw2005reducingoverheadmemoryintegrityverification` | P1 | `memory-encryption-integrity` | 2005 | Backlog memory-integrity lineage; use active `henson2014memory` survey unless original paper is promoted. |
| `rw2010vaultsecurebindingpersistentmemory` | P1 | `memory-encryption-integrity` | 2010 | Backlog memory-integrity lineage; use active `henson2014memory` survey unless original paper is promoted. |
| `rw2013sancuslowcosttrustworthyextensible` | P1 | `riscv-tee-architecture` | 2013 | Backlog RISC-V substrate; no substantive citation until source/PDF/README are verified. |
| `rw2015tytantinytrustanchortiny` | P1 | `riscv-tee-architecture` | 2015 | Backlog RISC-V substrate; no substantive citation until source/PDF/README are verified. |
| `rw2017sancus20lowcost` | P1 | `riscv-tee-architecture` | 2017 | Backlog RISC-V substrate; no substantive citation until source/PDF/README are verified. |
| `rw2018multizonesecurityriscv` | P1 | `riscv-tee-architecture` | 2018 | Backlog RISC-V substrate; no substantive citation until source/PDF/README are verified. |
| `rw2019shaktitriscvprocessor` | P1 | `riscv-tee-architecture` | 2019 | Backlog RISC-V substrate; no substantive citation until source/PDF/README are verified. |
| `rw2020baolightweightstaticpartitioninghypervisor` | P1 | `riscv-tee-architecture` | 2020 | Backlog RISC-V substrate; no substantive citation until source/PDF/README are verified. |
| `rw2020hectorvheterogeneouscpuarchitecture` | P1 | `riscv-tee-architecture` | 2020 | Backlog RISC-V substrate; no substantive citation until source/PDF/README are verified. |
| `rw2024riscvsbiriscv` | P1 | `riscv-tee-architecture` | 2024 | Backlog standard/spec candidate; no substantive citation until official SBI source is ingested. |
| `rw2024inteltrustdomainextensionsarchitecture` | P1 | `standards-industry` | 2024 | Backlog industry/spec comparison; no substantive citation until official source is ingested. |
| `rw2013innovativeinstructionssoftwaremodelisolated` | P1 | `tee-runtime` | 2013 | Backlog/background substrate for SGX runtime comparison; no substantive citation in current Arm/RISC-V/TEE-I/O正文. |
| `rw2014innovativeinstructionscreatetrustworthysoftware` | P1 | `tee-runtime` | 2014 | Backlog/background substrate for SGX runtime comparison; no substantive citation in current Arm/RISC-V/TEE-I/O正文. |
| `rw2014shieldingapplicationsuntrustedcloudhaven` | P1 | `tee-runtime` | 2014 | Backlog/background substrate for SGX runtime comparison; no substantive citation in current Arm/RISC-V/TEE-I/O正文. |
| `rw2017endboxscalablemiddleboxfunctionsclient` | P1 | `tee-runtime` | 2017 | Backlog/background substrate for SGX runtime comparison; no substantive citation in current Arm/RISC-V/TEE-I/O正文. |
| `rw2017graphenesgxpracticallibraryos` | P1 | `tee-runtime` | 2017 | Backlog/background substrate for SGX runtime comparison; no substantive citation in current Arm/RISC-V/TEE-I/O正文. |
| `rw2017panoplylowtcblinuxapplications` | P1 | `tee-runtime` | 2017 | Backlog/background substrate for SGX runtime comparison; no substantive citation in current Arm/RISC-V/TEE-I/O正文. |

## Post-Plan Top-Conference Additions

These entries were promoted as canonical keys during the `next-plan.md` implementation pass. They were not converted from the `rw...` P0/P1 metadata subset, so the P0/P1 candidate counts remain P0 = 42, P1 = 70, total = 112.

| Canonical key | Priority / role | Category or corpus | Terminal state |
|---|---|---|---|
| `chen2024hardwareisolation` | P0 active | `architecture-and-platform-security` | Added as active reference with verified PDF and README; cited only for hardware-isolation primitive comparison. |
| `chen2024cpc` | P0 active | `arm-confidential-computing` | Added as active reference with verified PDF and README; cited for CVM maintenance/lifecycle, not official Arm interface. |
| `delignatlavaud2025adns` | P1 active | `attestation` | Added as active reference with verified PDF and README; cited for attested naming/policy, not device identity or DMA control. |
| `lamster2024voodoo` | P1 active | `architecture-and-platform-security` | Added as active reference with verified PDF and README; cited for memory tagging/authenticated-encryption/ECC composition. |
| `shi2025cofunc` | P1 background substrate | `trusted-execution-environments` | Added as active background substrate with verified PDF and README; cited for confidential serverless/container packaging only. |
| `kuhne2026aster` | P2/emerging active | `arm-confidential-computing` | Added as active emerging reference with verified PDF and README; cited for Android AVF-on-CCA deployment only. |
| `khalilov2024osmosis` | P2/background substrate | `memory-and-io-fabrics` | Added as active background substrate with verified PDF and README; cited for SmartNIC resource management only. |
| `schluter2024heckler` | Boundary-only | `survey/excluded_attack_reference.bib` | Added only to excluded attack bibliography and boundary prose; no active正文 citation. |
| `tcg_dice_2018` | One-hop P0 promotion | `attestation` | Added from Aster citation triage as official DICE UDS/CDI reference with verified PDF and README. |

## Promotion Gate

To promote any backlog row, replace the metadata-only candidate with a canonical BibTeX entry in `survey/reference.bib`, add or update a `reference/<category>/<slug>/README.md`, record PDF availability or blockage, and update this table from backlog to the canonical key. Until then, the terminal state is no substantive正文 citation.
