# Transparent Attested DNS for Confidential Computing Services

- BibTeX key: `delignatlavaud2025adns`
- Category: `attestation`
- Authors: Antoine Delignat-Lavaud, Cedric Fournet, Kapil Vaswani, Manuel Costa, Sylvan Clebsch, Christoph M. Wintersteiger
- Year: 2025
- Venue: USENIX Security Symposium 2025
- Source: https://www.usenix.org/conference/usenixsecurity25/presentation/delignat-lavaud
- PDF source: https://www.usenix.org/system/files/usenixsecurity25-delignat-lavaud.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12 with `pdfinfo`; 21 pages
- Survey lane: confidential-computing network/I/O/data-path defense; attestation and verifier policy
- Evidence role: E1 peer-reviewed primary paper. Use for attested service naming, discovery, policy binding, certificate issuance, and transparency logs; do not cite as device identity, DMA control, TDISP/SPDM lifecycle, or proof that service code is semantically correct.

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 1. 论文基本信息

- 论文标题: Transparent Attested DNS for Confidential Computing Services
- 作者 / 机构: Antoine Delignat-Lavaud, Cedric Fournet, Kapil Vaswani, Manuel Costa, Sylvan Clebsch, Christoph M. Wintersteiger; Azure Research, Microsoft / Imandra
- 发表会议 / 年份: USENIX Security 2025
- 领域分类: 安全 / 网络 / 系统
- 一句话总结: aDNS 把 confidential service 的 TEE attestation、domain name、certificate issuance 和 public transparency log 绑定起来，让服务发现和证书获取也带有可审计的 attestation policy。
- 最核心贡献一句话: 它把远程证明从应用自定义机制提升到 DNS/name layer，使域名下的服务必须满足 domain-specific attestation policy 才能注册密钥和获得证书。

### 2. 研究问题与背景

论文要解决的问题是 confidential service 的信任建立仍依赖自定义客户端和协议: 客户需要发现、更新和验证 attestation evidence，服务更新时还要传播新的 verification policy。传统 Web 安全用 domain names、origins、certificates 作为通用抽象，但 confidential computing 还缺少等价的 name-based attestation discovery。

这个 gap 对本 survey 成立，因为 TLS+RA 解决的是 TLS channel 与 attested endpoint 的绑定，SPDM/TDISP 解决设备身份和接口生命周期，而 aDNS 解决 service naming、discovery、zone policy、certificate issuance 和 attestation transparency。它属于 attestation/verifier policy 与 confidential service channel 的交叉，不是 generic DNS security。

### 3. 核心方法拆解

机制路径是: `zone policy -> TEE registration with hardware attestation -> aDNS verifies policy -> DNS/DANE/ACME certificate issuance -> transparency log -> client or auditor verifies records before TLS connection`。

aDNS 的核心模块包括 authoritative DNS service、zone delegation protocol、TEE registration protocol、attestation record query/verification、ACME-compatible certificate issuance、DNSSEC/DANE integration、append-only transparency log 和 browser extension client。aDNS 自身作为 confidential service 运行在 fault-tolerant network of TEEs 中。

### 4. 安全性 / 正确性分析

安全目标是把域名、服务公钥/证书、TEE measurement 和 domain-specific policy 绑定，并通过 public append-only log 防止 targeted attacks 或不可审计的策略替换。aDNS 不解释 TEE measurement 的业务语义，也不保证服务代码天然正确或数据一定机密；它执行 service owner 表达的 policy，并让 enlightened clients/auditors 可以检查和追责。

主要假设包括 DNSSEC/DANE/ACME/Certificate Transparency 等底层机制正确部署、TEE attestation provider 可验证、aDNS TEE 网络和 log 机制安全。论文不解决 DMA、device assignment、side-channel、physical attack、DoS 或 application-level semantic bugs。

### 5. 实现细节

论文实现 aDNS authoritative server、client/browser extension 和 sample confidential services。artifact 页面和论文指向 Zenodo/GitHub，主论文报告支持 SGX enclaves、SEV-SNP confidential VMs 和 confidential containers 等样例。实现难点在于兼容现有 DNS/TLS/ACME 生态，同时把 attestation verification 放进 name/certificate workflow。

### 6. 实验设计分析

实验评估 sample services、TEE 平台多样性、浏览器扩展的连接前查询/验证开销和 DNS caching/scalability。论文声称 enlightened client 在打开 TLS connection 前查询和验证 attestation records 的性能开销 negligible，并指出 legacy clients 可以通过部分 enlightened clients 的审计获得 deter/blame 效果。局限是 deployment 依赖 DNSSEC/DANE/ACME adoption、policy authoring 和 transparency ecosystem；真实大规模 Web 迁移仍需长期验证。

### 7. Novelty 分析

Novelty 分类: `strong research novelty`。aDNS 的新意是把 confidential computing 的 attestation evidence 绑定到 DNS name authority 和 certificate issuance，而不是继续要求每个服务自定义 attestation client。它适合补本 survey 的 attested service discovery / endpoint identity 缺口。

### 8. 局限性与可能漏洞

最大局限是 aDNS 执行的是 policy binding，不是应用安全证明；如果 policy 写错、measurement 语义不清、TEE 平台 attestation root 出问题，aDNS 无法自动判断服务是否真正满足业务安全目标。DNSSEC/DANE/ACME/CT 的部署复杂性也可能限制 adoption。对 DPU/NIC/device endpoint 场景，还需要 SPDM/TDISP/平台 attestation 补上设备层证据。

### 9. 和已有工作的关系

aDNS 与 TLS+RA 互补: TLS+RA 绑定 TLS channel 和 attested endpoint，aDNS 绑定域名、证书、服务 policy 和 attestation record。aDNS 与 RATS/EAT 关系是上层 discovery 和 policy distribution，可使用平台 evidence 但不替代 evidence format。与 SPDM/TDISP 不同，aDNS 关注服务名和应用层 endpoint，不是 PCIe/device interface lifecycle。

### 10. 复现与再实现计划

最低复现目标是部署一个 aDNS authoritative service、一个 sample confidential service 和一个 client/browser verifier。需要 DNSSEC/DANE/ACME 测试环境、TEE attestation provider 或模拟 evidence、policy file、append-only log 和 TLS endpoint。验收标准是: 不满足 policy 的 TEE 不能注册记录或获取证书；满足 policy 的服务可被 client 验证；log 中能审计 policy、attestation 和 certificate 历史。

### 11. 对后续研究的启发

1. CCA/CoVE service-name binding: 为 Realm/TVM 服务定义 EAT/RATS-compatible aDNS policy。
2. Device-backed service discovery: 将 aDNS 与 SPDM device identity 和 DPU-hosted TLS termination 组合。
3. Policy transparency UX: 研究浏览器如何向用户或企业管理员表达 TEE policy 变化。
4. Cross-cloud attestation roots: 让 aDNS 同时处理 SGX、SEV-SNP、TDX、Arm CCA、RISC-V CoVE evidence。
5. Formal policy validation: 对 aDNS policy、certificate issuance 和 log consistency 做形式化验证或 differential testing。

### 12. SOTA README Addendum

- SOTA 定位: Academic SOTA
- 标准化 / 发表状态: peer-reviewed USENIX Security 2025
- 对应小方向: Attested service discovery, endpoint identity, verifier policy binding

#### 内容摘要

aDNS 是面向 confidential computing service 的 attested naming layer，把域名、TEE attestation、policy、证书签发和 transparency log 组合起来。

#### 研究背景

当前 confidential service 常依赖自定义客户端验证 attestation，难以与 Web/DNS/证书生态对齐，也难以支持长期服务更新和审计。

#### 解决方案

aDNS 在 zone authority 内强制执行 domain-specific attestation policy，要求服务 TEE 通过硬件证明后才能注册密钥和获得证书，并把记录、policy 和 attestation 写入 public append-only log。

#### 实验结果

论文实现 aDNS confidential service、browser extension 和多个 sample confidential services，报告 client-side attestation record 查询/验证在连接建立路径上的开销很小。

#### 文章评价

aDNS 是 attested service discovery 的关键顶会证据。它补 TLS+RA 之外的命名、发现、证书和 policy distribution 问题，但不能替代设备身份、DMA/TDISP 生命周期或应用语义安全证明。
<!-- END PAPER REVIEW -->
