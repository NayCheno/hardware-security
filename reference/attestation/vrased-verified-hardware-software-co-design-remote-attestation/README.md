# VRASED: A Verified Hardware/Software Co-Design for Remote Attestation

- BibTeX key: `nunes2019vrased`
- Category: `attestation`
- Authors: Ivan De Oliveira Nunes; Karim Eldefrawy; Norrathep Rattanavipanon; Michael Steiner; Gene Tsudik
- Year: 2019
- Venue: 28th USENIX Security Symposium (USENIX Security 2019)
- Source: https://www.usenix.org/conference/usenixsecurity19/presentation/de-oliveira-nunes
- PDF source: https://www.usenix.org/system/files/sec19-nunes.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12 from USENIX open-access PDF
- Evidence class: E1 peer-reviewed primary paper
- Evidence role: Peer-reviewed SOTA for verified remote-attestation co-design. Use for hardware/software RA verification and MSP430/Basys3 prototype evidence; do not generalize to arbitrary TEE evidence profiles without platform-specific sources.

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 内容摘要

VRASED 设计并验证 Verifiable Remote Attestation for Simple Embedded Devices，把硬件隔离、软件 attestation routine 和形式化证明放在同一个 co-design 中。

### 研究背景

Remote attestation 的安全性常依赖硬件、软件和协议共同成立，但早期方案很少对实现级安全性质做机器可检查证明。低端 IoT 设备还需要控制硬件成本。

### 解决方案

VRASED 用少量硬件扩展保护 attestation 代码、密钥和内存访问，并用形式化验证证明关键安全性质。妙处是把 RA root 的硬件约束和软件实现一起验证，而不是只给协议草图或手工论证。

### 实验结果

论文在 TI MSP430 / Basys3 Artix-7 FPGA 上实现和评估，展示 verified RA design 的可行性和低硬件开销；具体资源、性能和验证规模以 USENIX 2019 原文为准。

### 文章评价

优点是证据强：同行评审、公开 PDF、形式化验证和真实原型结合。局限是目标为 simple embedded devices，不是云 CVM、Arm CCA Realm、RISC-V TVM 或 DPU/NIC endpoint 的完整 evidence chain。商业落地潜力在 MCU/IoT RoT 和可审计 attestation IP，风险在工具链、proof maintenance 和平台 profile 对接。
<!-- END PAPER REVIEW -->
