# SPDM over TCP Binding Specification

- BibTeX key: `dmtf_spdm_tcp_2024`
- Category: `memory-and-io-fabrics`
- Authors: DMTF SPDM Working Group
- Year: 2024
- Venue: DMTF Standard DSP0287 v1.0.0
- Source: https://www.dmtf.org/dsp/DSP0287
- PDF source: https://www.dmtf.org/sites/default/files/standards/documents/DSP0287_1.0.0.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Survey lane: confidential-computing network/I/O/data-path defense
- Evidence role: Spec/standard SOTA. DMTF transport binding for SPDM over TCP; transport support only, not a device-isolation or memory-protection mechanism.
- Spec identifier/status: DMTF DSP0287 v1.0.0, published standard.

<!-- BEGIN REVIEW -->
## Review
### 1. 论文基本信息

- 论文标题: SPDM over TCP Binding Specification
- 作者 / 机构: DMTF SPDM Working Group
- 发表会议 / 年份: DMTF Standard DSP0287 v1.0.0 / 2024
- 领域分类: 网络 / 安全 / 系统
- 一句话总结: 规范定义如何在 TCP transport 上承载 SPDM。
- 最核心贡献一句话: 它让 SPDM 设备/组件证明不局限于本地总线，可支撑远端或网络可达设备的 attestation control path。

### 2. 研究问题与背景

机密计算网络防御不仅涉及 PCIe/CXL 本地设备，也涉及 SmartNIC、DPU、管理控制器或远端组件。若组件通过 TCP 可达，SPDM 需要明确 transport binding，否则 transcript、framing、错误处理和会话语义会不一致。

### 3. 核心方法拆解

机制路径为 `TCP connection -> SPDM requester/responder framing -> SPDM negotiation/measurement -> optional secured messages -> endpoint trust decision`。它主要规定 transport 适配，而不是改变 SPDM 的密码学语义。

### 4. 安全性 / 正确性分析

TCP binding 只解决承载和互操作，不自动提供机密性或完整性；安全属性仍来自 SPDM 和 Secured Messages。网络路径上的 DoS、routing、TLS/VPN 等普通网络安全不是该规范主线。

### 5. 实现细节

规范无实现。适用实现包括 management controller、DPU/SmartNIC endpoint、remote device service 或 verifier-facing gateway。

### 6. 实验设计分析

规范无实验。验证重点是 framing、connection reset、partial messages、timeout、session resumption 和与 secured messages 的组合。

### 7. Novelty 分析

分类: incremental engineering / spec contribution。其价值是把 SPDM 扩展到网络 transport，方便 confidential infrastructure 中跨组件证明。

### 8. 局限性与可能漏洞

不能替代设备内部隔离或 data-plane encryption。若 endpoint 本身不可信，TCP 上的 SPDM 成功只证明某个 responder 持有证书和报告 measurement。

### 9. 和已有工作的关系

与 `dmtf_spdm_2025` 和 `dmtf_spdm_secured_messages_2025` 是绑定关系。正文中应作为“network-reachable attested endpoint”支撑材料。

### 10. 复现与再实现计划

实现一个 SPDM-over-TCP requester/responder demo，验证连接建立、消息边界、measurement 请求和 secure session。验收标准是跨 transport transcript 与标准一致。

### 11. 对后续研究的启发

1. DPU/SmartNIC 远端 attestation gateway。2. SPDM over TCP 与 EAT/RATS verifier 联动。3. 机密网络 endpoint 的证书和 measurement 生命周期。4. 多租户管理网络的 SPDM 隔离。5. TCP reset/DoS 下的 verifier policy。

### 12. Evidence README Addendum
- Evidence role: Spec/standard SOTA. DMTF transport binding for SPDM over TCP; transport support only, not a device-isolation or memory-protection mechanism.
- 标准化 / 发表状态: DMTF published standard, DSP0287 v1.0.0
- 对应小方向: 机密计算网络 / I/O / fabric 防御

#### 内容摘要

该规范定义 SPDM over TCP 的承载语义。

#### 研究背景

部分可信设备或管理组件并不只通过本地总线通信，网络化 attestation 需要标准 binding。

#### 解决方案

规定 SPDM 消息在 TCP 上的 framing 和传输行为。

#### 实验结果

规范，无新实验。

#### 文章评价

适合补“机密计算网络防御”里的 endpoint attestation，但不是普通网络安全协议。
<!-- END REVIEW -->
