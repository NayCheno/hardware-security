# Local Report Slide Contract

This reference condenses `next-plan.md` for the local `report-slide` production workflow. Load it when making broad layout, text, evidence, or artifact-generation changes.

## Non-Negotiables

- Work locally only; do not access or modify Google Drive.
- Do not hand-edit `report-slide/main.pdf`, `report-slide/output/hardware-security-report-slide.pptx`, `out/report.pdf`, or `out/report.pptx`.
- Modify maintained source files and generators, then rebuild with `uv`.
- Keep PDF and PPTX content aligned.
- Do not sacrifice technical accuracy for visual polish.

## Required Structure

Keep the current report theme:

```text
硬件辅助机密计算与可信 I/O 安全综述
Arm/RISC-V TEE、CCA/CoVE、内存与 I/O 数据路径的技术演进
```

Keep the report shape:

- 15 technical directions.
- 45 representative materials.
- Around 260 slides/pages unless the user explicitly changes scope.
- E0-E5 evidence levels.
- Global summary and research implications.

Keep these 15 directions:

1. 硬件辅助 TEE taxonomy
2. Arm TrustZone TEE 与漏洞谱系
3. Arm CCA / RME / RMM 基础架构
4. Arm CCA 细粒度隔离与部署模型
5. Arm CCA I/O、DMA、accelerator、interrupt
6. Attestation、boot、lifecycle
7. RISC-V 基础安全 primitives
8. RISC-V TEE lineage: Sanctum / Keystone / Penglai / SPEAR-V
9. RISC-V CoVE / AP-TEE confidential VM
10. RISC-V CoVE-IO / TEE-I/O
11. Memory encryption / integrity / replay protection
12. Memory / I/O fabrics: CXL、PCIe IDE、RDMA
13. Confidential I/O protocol、trusted device interface、network endpoint
14. Accelerator / DPU / SmartNIC confidential offload
15. SmartNIC / trusted NIC / secure storage data path

Each direction keeps:

- Opening page.
- 3 representative materials.
- For each material: content summary, research background, solution, experiments/evidence, evaluation.
- Direction summary page.

## Page Templates

### Cover

Include title, subtitle, date, `Research Slide Report`, and metrics:

- 15 technical directions.
- 45 representative materials.
- Around 260 pages.
- E0-E5 evidence system.

Use a formal research-report layout: large title, route-map or five-stage narrative, and compact author/date/version area.

### Report Positioning

Use three blocks: core problem, report scope, reading path. Emphasize:

```text
平台管理者不可信，但仍掌握 CPU 调度、内存、I/O 和设备资源。
```

### Evidence Page

Render E0-E5 as a compact table or ladder. Each row should show what the level can support and what it cannot support.

### Direction Overview

Replace dense lists with grouped matrices or route maps. Suggested grouping:

| Group | Directions |
| --- | --- |
| TEE 基础与 Arm 路线 | 01-05 |
| Attestation 与 RISC-V 基础 | 06-10 |
| Memory / Fabric / Protocol | 11-13 |
| Accelerator / DPU / SmartNIC | 14-15 |
| 全局总结 | Ending pages |

### Direction Opening

Use a consistent layout:

```text
方向 N：{方向名称}
核心问题：一句话说明本方向解决什么问题。
技术演进：基础入口 -> 代表改进 -> 当前 SOTA / 当前边界
三篇主讲材料：{定位 + 证据等级}
本方向边界：说明哪些结论不能直接推出。
```

### Content Summary

Use summary cards instead of long paragraphs:

```text
材料定位：{开创性 / 代表性改进 / SOTA / 规范 / Survey / Draft}
关键动机：1-2 条
本文工作：3 条以内
关键贡献：3 条以内
最重要证据：实验数字 / 规范版本 / Figure/Table / 无新实验
```

### Research Background

Use a problem chain:

1. Prior model/system solved what.
2. What it did not cover.
3. Why the gap matters.
4. How this material enters the gap.

Good visuals: problem chain, threat boundary, before/after comparison, trust boundary diagram.

### Solution

Do not leave the page as three generic bullets. Prefer mechanism diagrams, module breakdowns, state machines, trust-boundary diagrams, data paths, or attestation/evidence flows.

Use this structure:

```text
核心思想：一句话说明本文把问题转化成什么问题。
机制拆解：模块 A / B / C。
关键妙处：为什么这个设计比前作更好。
边界：它没有解决什么。
```

### Experiments / Evidence

Avoid vague placeholders such as `具体指标以本地 PDF 为准`.

Use:

```text
证据类型：{规范无实验 / 系统原型 / Survey 无新实验 / 厂商材料 / Draft 原型}
关键结果：指标 + 数值 + 来源位置
不能推出：不证明什么 / 不代表什么
```

Rules:

- If the source has explicit numbers, include them with a location.
- If not verified, write `待补证据：需要核对原文 Table/Figure`.
- E0 pages state `规范，无新实验`.
- E2 pages state `Survey/SoK，无新系统实验`.
- E3 pages state `draft / not ratified`.

### Evaluation

Use three cards:

| 设计优势 | 局限性 | 商业化潜力 |
| --- | --- | --- |
| 2-4 points | 2-4 points | high / medium / low plus scenario |

Include landing scenarios, unsuitable scenarios, deployment difficulty, evidence limits, and commercial potential.

### Direction Summary

Use an evolution diagram, method comparison matrix, and takeaway.

Comparison fields:

| 材料 | 定位 | 保护对象 | 核心机制 | 证据等级 | 主要局限 | 落地潜力 |
| --- | --- | --- | --- | --- | --- | --- |

## Visual Requirements

Use a restrained academic technical palette:

| Use | Color |
| --- | --- |
| Background | `#F8FAFC` or white |
| Primary text | `#0F172A` |
| Secondary text | `#475569` |
| Primary accent | `#2563EB` |
| Secondary accent | `#0891B2` |
| Risk / limitation | `#DC2626` |
| Evidence / reminder | `#F59E0B` |
| Table lines | `#CBD5E1` |

Use red only for risk, limitation, error, or attack surface.

Recommended fonts:

- Chinese: Microsoft YaHei, Source Han Sans, Noto Sans CJK.
- English: Aptos, Arial, Inter.

Approximate sizes:

| Element | Size |
| --- | --- |
| Cover title | 38-46 |
| Slide title | 28-34 |
| Subtitle | 18-22 |
| Body | 17-22 |
| Table body | 13-16 |
| Footer | 8-10 |
| Evidence badge | 10-12 |

Every page should have a title area, evidence badge, main content area, and compact source/evidence/footer area.

Use one meaningful visual element at least every 5-8 slides:

- Taxonomy matrix.
- Evolution timeline.
- Architecture diagram.
- Trust-boundary diagram.
- CPU -> memory -> I/O -> device data path.
- Evidence-chain diagram.
- Comparison matrix.
- Experiment metric cards.

Tables should normally use no more than 6 columns, readable row height, and enough padding. Split wide tables instead of shrinking text until unreadable.

## Text Repair

Scan generated PPTX/PDF for:

- Truncated English endings such as `source for thi`, `linea`, `sema`, or `workfl`.
- Mojibake, control characters, and abnormal word splits.
- Mixed Chinese inserted into broken English fragments.
- Repeated boilerplate such as `引用依据：引用依据...`.
- Empty template pages that repeat labels without real research content.

Normalize:

| Variant | Preferred |
| --- | --- |
| Arm/RISC V/RISCV | Arm / RISC-V |
| CCA/RME/RMM | Arm CCA / RME / RMM |
| CoVE/APTEE/AP-TEE | CoVE / AP-TEE |
| PCIeIDE / PCI-E IDE | PCIe IDE |
| CXL mem | CXL.mem |
| Smart NIC / smartnic | SmartNIC |
| confidential VM | confidential VM / 机密虚拟机 |
| trusted IO | Trusted I/O |
| TEE I/O | TEE-I/O |
| Realm / realm | Realm when used as proper noun |
| RMM / rmm | RMM when used as proper noun |

Chinese terminology:

| English | Chinese |
| --- | --- |
| confidential computing | 机密计算 |
| confidential VM | 机密虚拟机 |
| remote attestation | 远程证明 |
| trusted I/O | 可信 I/O |
| memory ownership | 内存所有权 |
| device attestation | 设备证明 |
| evidence chain | 证据链 |
| verifier policy | 验证方策略 |
| threat model | 威胁模型 |
| workload | 工作负载 |

## Evidence QA

Never invent:

- Paper titles, authors, venues, years.
- Spec versions or ratification status.
- Experimental numbers or performance improvements.
- Commercial deployment, open-source, or mass-production status.

Specific values require source locations:

- Performance, overhead, TCB LoC.
- Sample, workload, or CVE counts.
- Spec versions, public status, draft versions.

Evidence boundaries:

- E0: no experiment claims.
- E1: experiments only inside paper setup.
- E2: no first-hand experiment claims.
- E3: mark `draft / not ratified`.
- E4: no universal security proof.
- E5: leads/status only.

## Build And Verification

Preferred full build:

```bash
uv run build report
```

Then check:

- `out/report.pdf` exists.
- `out/report.pptx` exists.
- Page/slide counts are plausible for the edited scope.
- PDF pages are continuous.
- No text is cropped.
- No table or image exceeds page boundaries.
- Footers and evidence badges remain visible.
- Fonts do not cause layout shifts.
- No blank or duplicate generated pages.
- PDF and PPTX content are consistent.

When substantial edits are made, produce either `修改记录表.md` or `修改记录表.xlsx` with:

| 文件 | 页码/Slide | 问题类型 | 原问题 | 修改动作 | 修改后效果 | 是否需人工复核 |
| --- | --- | --- | --- | --- | --- | --- |

If evidence remains unresolved, produce `待补证据清单.md`:

| Slide | 内容 | 需要核验的来源 | 当前处理 |
| --- | --- | --- | --- |

## Forbidden Changes

- Do not fabricate or silently strengthen technical claims.
- Do not remove the 15 directions or the E0-E5 evidence system.
- Do not write draft/preprint material as ratified or productized.
- Do not turn SoK/survey papers into first-hand experiments.
- Do not treat vendor white papers as universal proof.
- Do not independently edit PDF and PPTX so they diverge.
- Do not leave placeholders such as `以本地 PDF 为准` as final slide text.
