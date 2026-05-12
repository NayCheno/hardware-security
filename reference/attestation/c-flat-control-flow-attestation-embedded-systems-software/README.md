# C-FLAT: Control-Flow Attestation for Embedded Systems Software

- BibTeX key: `abera2016cflat`
- Category: `attestation`
- Authors: Tigist Abera; N. Asokan; Lucas Davi; Jan-Erik Ekberg; Thomas Nyman; Andrew Paverd; Ahmad-Reza Sadeghi; Gene Tsudik
- Year: 2016
- Venue: Proceedings of the 2016 ACM SIGSAC Conference on Computer and Communications Security (CCS 2016)
- Source: https://research.aalto.fi/en/publications/c-flat-control-flow-attestation-for-embedded-systems-software/
- DOI: https://doi.org/10.1145/2976749.2978358
- PDF source: https://download.hrz.tu-darmstadt.de/pub/FB20/Dekanat/Publikationen/TRUST/c-flat-ccs-2016.pdf
- Local PDF: `paper.pdf`
- Download status: downloaded and verified on 2026-05-12 from TU Darmstadt public mirror after ACM Author-Izer returned HTTP 403 to automated download
- Evidence class: E1 peer-reviewed primary paper
- Evidence role: Foundational runtime/control-flow attestation. Use for the C-FLAT mechanism, TrustZone/Raspberry Pi prototype, and runtime control-flow attestation problem framing; do not generalize to standard RATS/EAT token semantics or modern confidential-VM evidence chains.

<!-- BEGIN PAPER REVIEW -->
## Paper Review

### 内容摘要

C-FLAT 提出 Control-Flow Attestation，把远程证明从静态软件完整性扩展到程序运行路径。Verifier 不只检查代码是否初始可信，还检查 prover 在一次执行中是否走过预期控制流。

### 研究背景

传统 remote attestation 更擅长确认设备初始内存或软件镜像，但控制流劫持和 data-only attack 可以在加载后改变运行行为。嵌入式/IoT 设备资源受限，又需要远程判断运行期行为是否偏离合法路径。

### 解决方案

论文在 TrustZone 保护的 attestation 逻辑中累计执行分支的路径摘要，并把该摘要返回给 verifier 做离线路径验证。妙处在于把 control-flow integrity 与 remote attestation 连接起来，让攻击者即使保持代码镜像不变，也难以隐藏异常路径。

### 实验结果

论文在 Raspberry Pi / ARM TrustZone 原型上评估真实 embedded application。结果显示 C-FLAT 能检测控制流劫持，但需要软件插桩，开销随控制流事件数量增长。

### 文章评价

优点是开创性强，明确提出 runtime/control-flow attestation 这一问题线；不足是依赖插桩和离线路径枚举，面对大型复杂软件时扩展性有限。商业落地潜力更适合受控 firmware/embedded 场景，现代产品需要结合硬件 CFA、标准化 evidence profile 和 verifier policy。
<!-- END PAPER REVIEW -->
