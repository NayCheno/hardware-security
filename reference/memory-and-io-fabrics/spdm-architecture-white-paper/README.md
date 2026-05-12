# Security Protocol and Data Model (SPDM) Architecture White Paper

- BibTeX key: `dmtf_spdm_arch_2024`
- Category: `memory-and-io-fabrics`
- Authors: DMTF SPDM Working Group
- Year: 2024
- Venue: DMTF Informational White Paper DSP2058 v1.3.0
- Source: https://www.dmtf.org/standards/spdm
- PDF source: https://www.dmtf.org/sites/default/files/standards/documents/DSP2058_1.3.0.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12
- Survey lane: confidential-computing network/I/O/data-path defense
- Evidence role: Industry evidence. DMTF industry white paper explaining SPDM deployment; use as explanatory industry evidence, not normative mechanism proof.

<!-- BEGIN REVIEW -->
## Review
### 1. 论文基本信息

- 论文标题: Security Protocol and Data Model (SPDM) Architecture White Paper
- 作者 / 机构: DMTF SPDM Working Group
- 发表会议 / 年份: DMTF DSP2058 v1.3.0 / 2024
- 领域分类: 架构 / 网络 / 安全
- 一句话总结: 白皮书解释 SPDM 的系统架构位置、用例、transport 和与硬件组件证明的关系。
- 最核心贡献一句话: 它适合在 survey 正文中作为 SPDM 概念入口，规范细节仍回引 DSP0274/DSP0277。

### 2. 研究问题与背景

SPDM 的原始规范较长且偏消息格式。Survey 写作需要解释为什么 device authentication、measurement 和 secure sessions 会成为机密计算 I/O 栈的一部分。该白皮书提供架构层解释。

### 3. 核心方法拆解

白皮书从 use cases、requester/responder model、certificate、measurement、secure session、transport binding 和 ecosystem 角度解释 SPDM。它不是新协议，而是对标准族的架构导读。

### 4. 安全性 / 正确性分析

作为 informational white paper，它不提供形式化证明或产品验证。安全论断应回到 DSP0274、DSP0277 和具体 transport/TDISP/IDE 规范。

### 5. 实现细节

无新实现。可用于解释 libspdm、platform firmware、device firmware、management controllers 和 trusted I/O 控制面如何组合。

### 6. 实验设计分析

白皮书无实验。Survey 中使用时只作为背景和概念图，不作为性能或安全证据。

### 7. Novelty 分析

分类: incremental engineering / explanatory architecture。价值在于降低标准族理解成本。

### 8. 局限性与可能漏洞

不能替代规范，也不覆盖完整 TDISP、IDE、IOMMU/IOPMP 或 CoVE-IO state machine。

### 9. 和已有工作的关系

与 `dmtf_spdm_2025`、`dmtf_spdm_secured_messages_2025`、`dmtf_spdm_tcp_2024` 配合使用。正文若需要简洁说明 SPDM 的架构角色，可引用该白皮书。

### 10. 复现与再实现计划

不适合作为复现对象。可把白皮书中的架构模型转为 survey 的 device trust pipeline 图或表。

### 11. 对后续研究的启发

1. 整理 SPDM 标准族到 CoVE-IO 的映射。2. 构建 device-attestation glossary。3. 比较 MCTP/TCP/DOE transport binding。4. 建立 verifier policy 模板。5. 形成 trusted I/O 教程章节。

### 12. Evidence README Addendum
- Evidence role: Industry evidence. DMTF industry white paper explaining SPDM deployment; use as explanatory industry evidence, not normative mechanism proof.
- 标准化 / 发表状态: DMTF informational white paper
- 对应小方向: 机密计算网络 / I/O / fabric 防御

#### 内容摘要

该白皮书是 SPDM 标准族的架构导读。

#### 研究背景

机密计算设备证明涉及多个规范，survey 需要一个清晰入口。

#### 解决方案

解释 SPDM requester/responder、measurement、certificate、secure session 和 transport 的关系。

#### 实验结果

白皮书，无新实验。

#### 文章评价

适合讲清概念，不应用作规范细节或安全证明的唯一依据。
<!-- END REVIEW -->
