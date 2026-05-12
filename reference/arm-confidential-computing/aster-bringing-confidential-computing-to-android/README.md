# Bringing Confidential Computing to Android

- BibTeX key: `kuhne2026aster`
- Category: `arm-confidential-computing`
- Authors: Mark Kuhne, Supraja Sridhara, Andrin Bertschi, Nicolas Dutly, Fabio Aliberti, Srdjan Capkun, Shweta Shinde
- Year: 2026
- Venue: ACM MobiSys 2026
- DOI: https://doi.org/10.1145/3745756.3809250
- Source: https://aster-cca.github.io/
- PDF source: https://www.shwetashinde.org/publications/aster_mobisys26.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12 with `pdfinfo`; 16 pages
- Survey lane: Arm/RISC-V confidential-computing defense
- Evidence role: E1 peer-reviewed primary paper / emerging Arm CCA mobile and Android protected-VM evidence. Use for Android AVF-on-CCA deployment tradeoffs; do not cite as an Arm official CCA specification or production device guarantee.

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 1. 论文基本信息

- 论文标题: Bringing Confidential Computing to Android
- 作者 / 机构: Mark Kuhne, Supraja Sridhara, Andrin Bertschi, Nicolas Dutly, Fabio Aliberti, Srdjan Capkun, Shweta Shinde; ETH Zurich
- 发表会议 / 年份: ACM MobiSys 2026
- 领域分类: 系统 / 安全 / OS
- 一句话总结: Aster 研究如何把 Android Virtualization Framework 的 protected VM 放到 Arm CCA Realm world 中。
- 最核心贡献一句话: 它把 AVF 的 Android CDD 安全需求映射到 Arm TrustZone/CCA design space，并实现一个基于 CCA 的 Android pVM 原型，补齐 lifecycle、trusted boot、attestation、rollback、memory protection 和 privilege separation。

### 2. 研究问题与背景

Android AVF 让敏感服务运行在 protected VM 中，但现有实现依赖 MMU-based trusted hypervisor。这个模型仍需信任 hypervisor，且不等同于 Arm CCA 提供的 Realm 级物理内存所有权和硬件隔离。Aster 要解决的问题是: Android 的 CDD/AVF 安全约束、DICE attestation、rollback protection、pVM lifecycle 和 Arm TEE/CCA 模型之间并不能直接一一映射。

论文比较四种设计选择，并认为让 Android 运行在 normal world、pVM 运行在 realm world 的 CCA 方案在安全性和实现成本之间最合适。这个 gap 对本 survey 成立，因为 Arm CCA 部署模型正在从 server CVM 扩展到移动端 protected VM 和 Android 系统服务。该论文不能替代 Arm CCA/RME/RMM 官方规范，也不能证明量产 Android 设备已经支持完整 CCA。

### 3. 核心方法拆解

机制路径是: `Android app requests pVM -> Android/VM manager enters CCA management path -> Realm Monitor creates and measures pVM -> pVM bootloader extends DICE chain -> pVM executes in Realm memory -> host Android provides IPC and scheduling without seeing protected state`。

Aster 的核心模块包括: AVF security-requirement analysis、基于 CCA 的 pVM launch path、DICE-compatible trusted boot and attestation、per-pVM memory encryption context、policy verifier、rollback-protected filesystem handling、Android kernel/VM manager patches、pVM bootloader changes 和 Realm-Monitor/firmware integration。关键设计选择是使用 CCA Realm world 承载 pVM，而不是把 pVM 放在 secure world 或继续依赖 normal-world hypervisor。

### 4. 安全性 / 正确性分析

论文考虑 compromised Android 和 compromised pVM 两类攻击者。Aster 依赖 Arm CCA world separation、GPT/GPC、Realm-Monitor、firmware、DICE chain、policy verifier 和 per-pVM encryption context 来防止 Android 直接访问 pVM memory、绕过 launch policy、伪造 attestation 或回滚 pVM state。

强假设是 firmware、Realm-Monitor、secure-world software 和 CCA hardware 正确。论文明确把 side channel 和 microarchitectural attacks 作为 orthogonal/out-of-scope；本 README 不把这些 attack class 展开成下载目标。由于作者说明没有可用的 native CCA-enabled Android hardware，实验部分是 emulator 加 Armv8.2 board 的近似验证，不能写成 production CCA phone security proof。

### 5. 实现细节

实现基于 TF-A Realm-Monitor v1.0-eac5、firmware v2.10、Linux 6.7-rc4 CCA patches、AOSP v13.0.0_r12 和 Android common kernel v15-6.6。论文报告了约 5.7K LoC 的关键修改: Android kernel 集成 Linaro CCA patches 2554 LoC，Android management/service interface 426+113 LoC，crosvm 469 LoC，pVM bootloader 543 LoC，DICE/firmware/RMM attestation 403+478+522 LoC，launch sequence 48 LoC，encryption-context handling 206 LoC。

平台包括 QEMU system-level emulator 和 Armv8.2 board。由于没有可用的 native Armv9-A CCA Android hardware，作者只能实现相关数据结构和接口，并用模拟/近似硬件估计开销。Aster 项目页提供开源入口。

### 6. 实验设计分析

实验覆盖 platform boot、pVM boot、RV8 CPU/memory stress、LMbench system/I/O benchmark，以及 isolated compilation、AVF test app、public-key generation、One-Time-Password generation 四个应用场景。指标包括 boot time、context switches、SMC calls、instruction count、execution time 和 benchmark throughput。

核心结果是: Aster 引入一次性 platform boot 开销，论文报告 baseline normal-world boot 11.79s、Aster realm setup 12.64s，约增加 0.85s；realm-world 增量约 0.36s。pVM init 中 DICE measurement 带来明显开销，realm-world pVM init 报告约 59% overhead，certificate generation 约 17% overhead；runtime stress benchmark 和应用场景总体显示较低影响。评估的主要局限是没有 native CCA Android board，instruction-count 和 board approximation 不能完全替代真实平台端到端测量。

### 7. Novelty 分析

Novelty 分类: `solid systems contribution`。Aster 的新意不是提出新的 CCA primitive，而是把 Android AVF 的安全模型、DICE/rollback/pVM lifecycle 和 CCA Realm execution 做系统化映射，并实现了可运行原型。对本 survey 的价值是补 mobile/Android CCA deployment evidence。

### 8. 局限性与可能漏洞

最大局限是硬件成熟度: 没有量产 CCA-enabled Android device 做完整验证，memory encryption context 相关部分也受实现可得性限制。Aster 扩大了 Realm-Monitor/firmware/boot chain 的集成责任，相关代码和策略错误会直接影响 pVM 安全。Rollback protection、DICE certificate chain、Android CDD property mapping 和 pVM bootloader 都是复杂工程面。论文不解决 generic Android app bug、side channel、malicious peripherals 的完整 trusted I/O、TDISP/SPDM device assignment、DPU/NIC endpoint identity 或跨设备生产部署认证。

### 9. 和已有工作的关系

Aster 与 Arm CCA/RME/RMM 规范、Android AVF、TrustZone、ACAI、PORTAL、CAGE、SHELTER、RContainer 等工作相关。与 RContainer 不同，Aster 的 protected object 是 Android pVM/AVF workload；与 PORTAL/CAGE 不同，它的重点不是设备 plaintext access region 或 accelerator workflow，而是 mobile protected-VM deployment。与 CPC 互补: CPC 讨论 CVM maintenance，Aster 讨论 Android pVM lifecycle、attestation 和 rollback。

### 10. 复现与再实现计划

最低复现目标是用作者开源仓库或论文环境启动一个 Microdroid-based pVM，并验证 DICE chain、pVM launch policy、Realm-Monitor communication 和 basic IPC。需要 AOSP 13、Android common kernel、TF-A/RMM、CCA Linux patches、QEMU/Arm board setup，以及可运行的 AVF test app。验收标准是 pVM 可启动、attestation certificate chain 可生成、host Android 不能直接访问 pVM private memory、rollback/tamper path 能被检测，且 benchmark 趋势与论文一致。

### 11. 对后续研究的启发

1. Production Android CCA validation: 在真实 CCA mobile SoC 上验证 Aster 的 memory encryption、power 和 peripheral compatibility。
2. Aster + trusted I/O: 将 pVM 与 PORTAL、SMMU、TDISP/SPDM 或 device attestation 组合，解决相机、传感器、NPU 等移动设备路径。
3. Formal AVF-to-CCA policy mapping: 对 CDD/AVF property 与 CCA state-machine 关系做 machine-checkable policy。
4. Lightweight rollback service: 为 Android pVM 设计低 TCB、可证明 freshness 的 rollback protection service。
5. Attested mobile service deployment: 研究面向 OTP、wallet、password manager、isolated compilation 的 remote verifier policy 和 user-consent model。

### 12. SOTA README Addendum

- SOTA 定位: Academic SOTA
- 标准化 / 发表状态: peer-reviewed MobiSys 2026
- 对应小方向: Arm CCA mobile/Android deployment, protected VM lifecycle, AVF-on-CCA integration

#### 内容摘要

Aster 是 Arm CCA 在 Android protected VM 场景中的最新顶会系统证据。它说明 CCA 可以作为 AVF 的硬件隔离后端，但需要补齐 Android-specific lifecycle、DICE attestation、rollback、policy 和 memory-protection 语义。

#### 研究背景

现有 AVF 依赖 trusted hypervisor 和 MMU isolation，安全强度弱于 CCA Realm world。Android CDD 又有细粒度 pVM 要求，不能简单把 TrustZone 或 CCA 当成 drop-in backend。

#### 解决方案

Aster 选择 Android normal world + pVM realm world 的设计，修改 Android kernel、VM manager、pVM bootloader、firmware 和 Realm-Monitor，把 launch policy、DICE chain、attestation、rollback 和 per-pVM memory protection 接到 CCA 路径上。

#### 实验结果

论文在 emulator 和 Armv8.2 board 上评估。结果显示 platform boot 增加约 0.85s，一些 pVM boot/attestation 阶段有明显一次性开销，runtime benchmark 和应用开销总体较低。由于缺少 native CCA Android hardware，结果应视为强原型证据而非量产设备证据。

#### 文章评价

Aster 对本 survey 很重要，因为它把 Arm CCA deployment 从 server/container/accelerator 扩到 Android protected VM。引用时必须保持边界: 它是 mobile deployment evidence，不是 Arm 官方规范、不是完整 trusted I/O 方案，也不是 production Android CCA availability claim。
<!-- END PAPER REVIEW -->
