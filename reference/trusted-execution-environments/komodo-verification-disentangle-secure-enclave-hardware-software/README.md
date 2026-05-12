# Komodo: Using Verification to Disentangle Secure-Enclave Hardware from Software

- BibTeX key: `ferraiuolo2017komodo`
- Category: `trusted-execution-environments`
- Authors: Andrew Ferraiuolo; Andrew Baumann; Chris Hawblitzel; Bryan Parno
- Year: 2017
- Venue: Proceedings of the 26th Symposium on Operating Systems Principles (SOSP 2017)
- Source: https://research.google/pubs/komodo-using-verification-to-disentangle-secure-enclave-hardware-from-software/
- DOI: https://doi.org/10.1145/3132747.3132782
- PDF source: https://people.ece.cornell.edu/af433/pdf/ferraiuolo-sosp-17.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12 from the Google Research-linked Cornell author PDF
- Evidence class: E1 peer-reviewed primary paper
- Evidence role: Foundational verified enclave-monitor lineage. Use for verified software monitor/enclave design and TrustZone prototype claims; do not cite it as RISC-V CoVE/AP-TEE, Arm CCA, or production SGX evidence.

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 内容摘要

Komodo 把 enclave 机制中底层硬件能力和高层 enclave 管理逻辑拆开，用经过机器检查证明的软件 monitor 在 Arm TrustZone 平台上实现 SGX-like isolated execution。

### 研究背景

SGX 把大量 enclave 管理逻辑固化在复杂硬件和微码中，更新和验证困难。研究问题是能否只让硬件提供更小的底层隔离/加密/attestation primitives，再把可演进的 enclave policy 放到 verified software 中。

### 解决方案

Komodo 通过 verified assembly monitor 管理 enclave 生命周期、页表和隔离，并证明 enclave integrity/confidentiality 等高层性质。妙处在于降低硬件复杂度，把可变策略从硅中移出，同时保留硬件辅助隔离和 attestation。

### 实验结果

论文在 Arm TrustZone prototype 上实现并评估，SOSP 2017 版本报告 19 页系统设计、验证和性能结果；具体开销、代码规模和证明规模以原文为准。

### 文章评价

优点是把 formal verification 引入 enclave monitor 设计，对后续 Keystone/Cerberus/verified TEE lineage 有启发；不足是 prototype 规模和平台覆盖有限，不能直接代表 CCA/CoVE confidential VM。商业潜力在可验证 monitor/firmware IP，但需要工程化证明维护和硬件接口标准化。
<!-- END PAPER REVIEW -->
