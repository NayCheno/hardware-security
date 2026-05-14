# Security Protocol and Data Model (SPDM) Specification

- BibTeX key: `dmtf_spdm_2025`
- Category: `memory-and-io-fabrics`
- Authors: DMTF SPDM Working Group
- Year: 2025
- Venue: DMTF DSP0274 v1.4.0, selected as this survey's SPDM snapshot
- Source: https://www.dmtf.org/dsp/DSP0274
- PDF source: https://www.dmtf.org/sites/default/files/standards/documents/DSP0274_1.4.0.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Survey lane: confidential-computing network/I/O/data-path defense
- Evidence role: Spec/standard SOTA. DMTF standard for device identity, measurement, and key exchange; not a complete trusted-I/O system without lifecycle, link, DMA, and interrupt controls.
- Spec identifier/status: DMTF DSP0274 v1.4.0, selected as this survey's SPDM snapshot; published standard.

<!-- BEGIN PAPER REVIEW -->
## Paper Review
### 1. 论文基本信息

- 论文标题: Security Protocol and Data Model (SPDM) Specification
- 作者 / 机构: DMTF SPDM Working Group
- 发表会议 / 年份: DMTF DSP0274 v1.4.0, selected as this survey's SPDM snapshot / 2025
- 领域分类: 架构 / 安全 / 网络
- 一句话总结: SPDM 定义设备和平台组件之间的能力协商、身份认证、固件/配置 measurement、证书检索、challenge-response 和安全会话建立。
- 最核心贡献一句话: 它是 confidential I/O 中 device identity 和 measurement evidence 的基础协议。

### 2. 研究问题与背景

机密计算把 CPU/内存边界扩展到真实设备后，TVM/Realm 不能只相信 PCIe requester ID 或驱动配置；它必须知道设备是谁、固件和配置处于什么状态、会话密钥如何建立。SPDM 解决的是组件级认证、测量和密钥交换问题，是 CoVE-IO、TDISP、PCIe IDE、CXL 和设备 attestation 的共同底座。

### 3. 核心方法拆解

机制路径为 `requester -> GET_VERSION/CAPABILITIES/ALGORITHMS -> DIGESTS/CERTIFICATE -> CHALLENGE/MEASUREMENTS -> KEY_EXCHANGE/FINISH -> secured messages`。核心对象包括 SPDM requester/responder、certificate chain、measurement blocks、transcript hash、session key、mutual authentication 和 capability flags。

### 4. 安全性 / 正确性分析

SPDM 给出协议语义，不证明某个设备安全。安全性依赖证书链、root of trust、measurement 语义、算法协商、transcript binding、随机数质量和实现正确。它能证明 responder identity 和报告的 measurement，但不能单独保证设备内部隔离、DMA 权限、IDE link、TDISP state 或 TVM memory ownership。

### 5. 实现细节

规范无单一实现。DMTF 提供 libspdm 等开源实现生态。系统集成通常发生在 BMC、firmware、TSM/RDSM、device security module、PCIe DOE/MCTP/TCP binding 或 CoVE-IO/TDISP control path 中。

### 6. 实验设计分析

规范无实验。验证应覆盖版本协商降级、算法选择、证书链、measurement freshness、session transcript、key update、error path、responder reset 和 transport binding。

### 7. Novelty 分析

分类: solid systems/spec contribution。SPDM 的价值不是新密码学，而是把组件身份、measurement 和密钥交换标准化为可被 PCIe/CXL/CoVE-IO 等上层协议复用的硬件安全控制面。

### 8. 局限性与可能漏洞

最大限制是 SPDM 只解决 control-plane trust bootstrap。若设备内部 TDI 隔离、IOMMU/IOPMP、IDE、TDISP state machine 或证书供应链出错，SPDM 成功也不能证明端到端 confidential I/O 安全。

### 9. 和已有工作的关系

SPDM 是 CoVE-IO、PCIe TDISP、PCIe IDE key management、AMD SEV-TIO 和 device attestation 的共同依赖。正文应把它写成 device trust/evidence/control-plane 协议，而不是 DMA access-control 或 link encryption 本身。

### 10. 复现与再实现计划

最小复现目标是用 libspdm 或 spdm-rs 建立 requester/responder，完成证书认证、measurement 读取和 secure session。验收标准是 transcript 可复验、measurement 与设备状态绑定、算法降级被拒绝。

### 11. 对后续研究的启发

1. 建立 CoVE-IO/TDISP/SPDM/IDE 的端到端 state machine。2. 研究 device certificate revocation 和 fleet-scale verifier policy。3. 检查 SPDM binding 到 TCP/MCTP/DOE 时的 transcript 差异。4. 为 confidential NIC/DPU 建立 measurement schema。5. 对 SPDM responder 做协议 fuzzing 和 differential testing。

### 12. Evidence README Addendum
- Evidence role: Spec/standard SOTA. DMTF standard for device identity, measurement, and key exchange; not a complete trusted-I/O system without lifecycle, link, DMA, and interrupt controls.
- 标准化 / 发表状态: DMTF DSP0274 v1.4.0, selected as this survey's SPDM snapshot; published standard
- 对应小方向: 机密计算网络 / I/O / fabric 防御; RISC-V CoVE-IO / TEE-I/O

#### 内容摘要

SPDM 标准化设备身份认证、固件/配置 measurement 和会话密钥建立。

#### 研究背景

Confidential workload 使用真实设备时，需要在把设备加入信任边界前验证设备身份和状态。

#### 解决方案

通过 capability negotiation、certificate、challenge、measurement 和 key exchange 建立可被上层 TDISP/IDE/CoVE-IO 复用的安全控制面。

#### 实验结果

规范，无新实验。

#### 文章评价

它是 trusted I/O 不可缺少的基础标准，但必须和 TDISP、IDE、IOMMU/IOPMP/AIA 或 SMMU 组合才能形成完整 I/O 防御。
<!-- END PAPER REVIEW -->

<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->

## Report-Slide Detailed Addendum

### 所属方向

- Direction: `13-confidential-io-protocol-device-endpoint` - Confidential I/O Protocol / Device Endpoint
- Paper key: `dmtf_spdm_2025`
- Role: device identity and measurement standard
- Evidence base: SPDM sections 7-11; Figure 1 certificate chain models; Figure 2 protocol flow; Table 3 generic message; request/response tables.
- Boundary: SPDM 不单独定义 device assignment lifecycle、DMA isolation、interrupt routing 或 PCIe link IDE；它是设备证据协议底座。

### 1. 完整题目 / 作者 / 会议

- 完整题目: Security Protocol and Data Model (SPDM) Specification
- 作者: DMTF SPDM Working Group
- 会议/来源: DMTF DSP0274 v1.4.0, 2025
- Title evidence: README metadata; DMTF DSP0274 PDF.

### 2. 内容摘要

### 2.1 Slide-ready summary

**Claim:** SPDM 的贡献是让平台能问设备: 你是谁、固件/配置是什么、能否建立安全会话。

- 动机: confidential I/O 不能只相信 PCIe requester ID，必须有设备证书和 measurement。
- 工作: 定义 requester/responder、certificate chain、CHALLENGE、GET_MEASUREMENTS、KEY_EXCHANGE、secure session。
- 数据: 标准规范无实验；证据来自消息格式、状态和协议流。

**讲解稿:** 讲解时先把本页结论落到一句话: SPDM 的贡献是让平台能问设备: 你是谁、固件/配置是什么、能否建立安全会话。第一步解释为什么需要这一页: 动机: confidential I/O 不能只相信 PCIe requester ID，必须有设备证书和 measurement。第二步说明论文或规范实际做了什么: 工作: 定义 requester/responder、certificate chain、CHALLENGE、GET_MEASUREMENTS、KEY_EXCHANGE、secure session。第三步收束到证据边界: 数据: 标准规范无实验；证据来自消息格式、状态和协议流。引用时只把 SPDM Section 7-11; Figure 1; Figure 2 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SPDM Section 7-11; Figure 1; Figure 2.

- Proof object: flow - SPDM flow: GET_VERSION -> CAPABILITIES/ALGORITHMS -> DIGESTS/CERTIFICATE -> CHALLENGE -> GET_MEASUREMENTS -> KEY_EXCHANGE -> secured messages


### 3. 研究背景

### 3.1 Slide-ready background

**Claim:** 背景问题是设备也需要 remote attestation: TVM/Realm 要知道 accelerator/NIC/storage endpoint 的真实状态。

- 证书链证明设备身份或供应链 root。
- Measurement 证明固件/配置/安全状态。
- Secure session 保护后续协议消息，但数据面还可能需要 IDE/其他链路保护。

**讲解稿:** 讲解时先把本页结论落到一句话: 背景问题是设备也需要 remote attestation: TVM/Realm 要知道 accelerator/NIC/storage endpoint 的真实状态。第一步解释为什么需要这一页: 证书链证明设备身份或供应链 root。第二步说明论文或规范实际做了什么: Measurement 证明固件/配置/安全状态。第三步收束到证据边界: Secure session 保护后续协议消息，但数据面还可能需要 IDE/其他链路保护。引用时只把 SPDM overview and definitions 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SPDM overview and definitions.

- Proof object: matrix - SPDM answers: Identity = certificate chain; Liveness = challenge response; State = measurements; Session = key exchange; Not covered = DMA/lifecycle/link data plane


### 4. 关键点核心思想

### 4.1 Slide-ready core insight

**Claim:** 核心洞察: SPDM 是 evidence protocol，不是 complete trusted I/O system。

- 它把 low-level security capabilities 暴露给上层机制。
- TDISP、PCIe IDE、CXL、CoVE-IO 可以使用 SPDM evidence。
- Verifier/TSM 必须决定 measurement 是否满足 policy。

**讲解稿:** 讲解时先把本页结论落到一句话: 核心洞察: SPDM 是 evidence protocol，不是 complete trusted I/O system。第一步解释为什么需要这一页: 它把 low-level security capabilities 暴露给上层机制。第二步说明论文或规范实际做了什么: TDISP、PCIe IDE、CXL、CoVE-IO 可以使用 SPDM evidence。第三步收束到证据边界: Verifier/TSM 必须决定 measurement 是否满足 policy。引用时只把 SPDM introduction; CoVE-IO relation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SPDM introduction; CoVE-IO relation.

- Proof object: cards - SPDM building blocks: Requester; Responder; certificate slots; measurement blocks; session keys


### 5. 架构总览

### 5.1 Slide-ready architecture

**Claim:** 架构总览: Requester 与 Responder 通过 request-response 消息建立身份、measurement 和 session。

- Requester 可以是 host/TSM/root port。
- Responder 可以是 device/endpoint。
- 连接可有多个 secure sessions，消息格式由 SPDM version/request/response code 约束。

**讲解稿:** 讲解时先把本页结论落到一句话: 架构总览: Requester 与 Responder 通过 request-response 消息建立身份、measurement 和 session。第一步解释为什么需要这一页: Requester 可以是 host/TSM/root port。第二步说明论文或规范实际做了什么: Responder 可以是 device/endpoint。第三步收束到证据边界: 连接可有多个 secure sessions，消息格式由 SPDM version/request/response code 约束。引用时只把 SPDM Section 8 connection model; Table 3 generic message 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SPDM Section 8 connection model; Table 3 generic message.

- Proof object: matrix - 协议对象: Requester = initiates request; Responder = device endpoint; Certificate = identity chain; Measurement = state evidence; Session = confidential/integrity-protected messages


### 6. 核心方法拆解

#### 方法 1: Certificate / Challenge

**Claim:** GET_CERTIFICATE 和 CHALLENGE 证明 endpoint 身份和私钥持有。

- DIGESTS/CERTIFICATE 获取证书摘要和链。
- CHALLENGE_AUTH 对 nonce/transcript 签名。
- 这证明设备不是一个随意伪造的 requester ID。

**讲解稿:** 讲解时先把本页结论落到一句话: GET_CERTIFICATE 和 CHALLENGE 证明 endpoint 身份和私钥持有。第一步解释为什么需要这一页: DIGESTS/CERTIFICATE 获取证书摘要和链。第二步说明论文或规范实际做了什么: CHALLENGE_AUTH 对 nonce/transcript 签名。第三步收束到证据边界: 这证明设备不是一个随意伪造的 requester ID。引用时只把 SPDM Section 10.9-10.10; Figure 1 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SPDM Section 10.9-10.10; Figure 1.

- Proof object: flow - identity proof: DIGESTS -> GET_CERTIFICATE -> verify chain -> CHALLENGE nonce -> CHALLENGE_AUTH -> policy accepts identity

#### 方法 2: Measurements

**Claim:** GET_MEASUREMENTS 把设备固件/配置状态交给 requester 判断。

- Measurement blocks 可被签名或绑定到 transcript。
- Policy 决定哪些 measurement 可接受。
- SPDM 不规定每个设备 measurement 的业务语义。

**讲解稿:** 讲解时先把本页结论落到一句话: GET_MEASUREMENTS 把设备固件/配置状态交给 requester 判断。第一步解释为什么需要这一页: Measurement blocks 可被签名或绑定到 transcript。第二步说明论文或规范实际做了什么: Policy 决定哪些 measurement 可接受。第三步收束到证据边界: SPDM 不规定每个设备 measurement 的业务语义。引用时只把 SPDM Section 10.12 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SPDM Section 10.12.

- Proof object: matrix - measurement: Request = GET_MEASUREMENTS; Evidence = measurement blocks; Signature = optional/required by policy; Verifier = policy check; Gap = semantic interpretation

#### 方法 3: Secure Sessions

**Claim:** KEY_EXCHANGE/FINISH 建立 SPDM secured messages。

- 会话密钥保护后续 SPDM payload。
- Transcript hash 防止握手被篡改。
- 数据面大流量仍通常依赖 IDE/TLS/IPsec/设备协议。

**讲解稿:** 讲解时先把本页结论落到一句话: KEY_EXCHANGE/FINISH 建立 SPDM secured messages。第一步解释为什么需要这一页: 会话密钥保护后续 SPDM payload。第二步说明论文或规范实际做了什么: Transcript hash 防止握手被篡改。第三步收束到证据边界: 数据面大流量仍通常依赖 IDE/TLS/IPsec/设备协议。引用时只把 SPDM Section 7.4; Section 10.17; Section 11 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SPDM Section 7.4; Section 10.17; Section 11.

- Proof object: flow - session: KEY_EXCHANGE -> KEY_EXCHANGE_RSP -> FINISH -> session keys -> secured messages

#### 方法 4: Use in TEE-I/O

**Claim:** SPDM 证据需要被 CoVE-IO/TDISP/TSM 绑定到 device assignment。

- 设备身份本身不等于已安全分配给 TVM。
- TDISP 管 device interface state。
- IOMMU/IOPMP 管 DMA，IDE 管链路。

**讲解稿:** 讲解时先把本页结论落到一句话: SPDM 证据需要被 CoVE-IO/TDISP/TSM 绑定到 device assignment。第一步解释为什么需要这一页: 设备身份本身不等于已安全分配给 TVM。第二步说明论文或规范实际做了什么: TDISP 管 device interface state。第三步收束到证据边界: IOMMU/IOPMP 管 DMA，IDE 管链路。引用时只把 SPDM scope; CoVE-IO relation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SPDM scope; CoVE-IO relation.

- Proof object: cards - upper-layer needs: TDISP state; IOMMU policy; IDE link; TSM binding; TVM token


### 7. 实验环境和数据 / 证据基础

### 7.1 Slide-ready evidence environment

**Claim:** SPDM 是标准规范，无实验；实验页写成协议覆盖和边界。

- 证据源: DMTF DSP0274 v1.4.0 本地 PDF。
- 可支撑: message exchanges, certificates, measurements, sessions。
- 不能支撑: device assignment correctness or performance overhead。

**讲解稿:** 讲解时先把本页结论落到一句话: SPDM 是标准规范，无实验；实验页写成协议覆盖和边界。第一步解释为什么需要这一页: 证据源: DMTF DSP0274 v1.4.0 本地 PDF。第二步说明论文或规范实际做了什么: 可支撑: message exchanges, certificates, measurements, sessions。第三步收束到证据边界: 不能支撑: device assignment correctness or performance overhead。引用时只把 SPDM DSP0274 sections 7-11 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SPDM DSP0274 sections 7-11.

- Proof object: matrix - 证据边界: 类型 = standard spec; 实验 = 无; 可支撑 = identity/measurement/session; 不能支撑 = complete trusted I/O


### 8. 性能 / Claim Strength

### 8.1 Slide-ready performance

**Claim:** 性能页写成无新实验: SPDM 定义协议，不给 workload benchmark。

- 开销来源是 certificate transfer、signature verification、measurement retrieval、key exchange。
- 这些通常在 setup/control path，而不是每个 data packet。
- 数据面性能需看 IDE/TLS/device stack。

**讲解稿:** 讲解时先把本页结论落到一句话: 性能页写成无新实验: SPDM 定义协议，不给 workload benchmark。第一步解释为什么需要这一页: 开销来源是 certificate transfer、signature verification、measurement retrieval、key exchange。第二步说明论文或规范实际做了什么: 这些通常在 setup/control path，而不是每个 data packet。第三步收束到证据边界: 数据面性能需看 IDE/TLS/device stack。引用时只把 SPDM scope 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SPDM scope.

- Proof object: bars - claim strength: 标准权威 高; endpoint identity 强; performance data 无; lifecycle coverage 需 TDISP


### 9. 文章评价

### 9.1 Slide-ready evaluation

**Claim:** 评价: SPDM 是 device attestation 的必备底座，但不能单独讲成 confidential I/O。

- 优势: 标准化、可互操作，覆盖 identity/measurement/session。
- 局限: 不管理 DMA、interrupt、assignment lifecycle、data-plane link。
- 商业化潜力: PCIe/CXL/DPU/accelerator trust root 的共同语言。

**讲解稿:** 讲解时先把本页结论落到一句话: 评价: SPDM 是 device attestation 的必备底座，但不能单独讲成 confidential I/O。第一步解释为什么需要这一页: 优势: 标准化、可互操作，覆盖 identity/measurement/session。第二步说明论文或规范实际做了什么: 局限: 不管理 DMA、interrupt、assignment lifecycle、data-plane link。第三步收束到证据边界: 商业化潜力: PCIe/CXL/DPU/accelerator trust root 的共同语言。引用时只把 SPDM README evaluation 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。

**Evidence refs:** SPDM README evaluation.

- Proof object: matrix - 评价: 优势 = standard endpoint evidence; 局限 = not full lifecycle; 商业化 = device ecosystem; 本方向角色 = protocol foundation


<!-- END REPORT-SLIDE DETAILED ADDENDUM -->
