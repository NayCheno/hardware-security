# 大型PPT重建计划：Hardware Security Survey

## 目标
基于 reference.pdf 的学术汇报风格，重建 out/report.pptx，涵盖15个硬件安全方向，每个方向精选3篇核心论文进行深度介绍。

## 内容结构
- 15个技术方向（来自report-slide）
- 每个方向：方向介绍 + 3篇论文 × 5个维度（内容摘要、研究背景、解决方案、实验结果、文章评价） + 方向总结
- 总计约260页

## 工作流程

### Stage 1: 主Agent设计（不可委派）
1. 创建 design.md - 基于reference.pdf风格的视觉设计
2. 创建 outline.md - 完整的PPT大纲
3. 创建 .pptd 主文件 - 定义theme和pages列表

### Stage 2: 子代理并行生成.page文件
- 将15个方向分成5组，每组3个方向
- 5个子代理并行工作，每组生成约50-55个.page文件
- 每个子代理负责的方向：
  - Worker 1: 方向01-03 (TEE taxonomy, TrustZone, Arm CCA)
  - Worker 2: 方向04-06 (Arm CCA deployment, Arm CCA I/O, Attestation)
  - Worker 3: 方向07-09 (RISC-V primitives, RISC-V TEE lineage, CoVE/AP-TEE)
  - Worker 4: 方向10-12 (CoVE-IO, Memory encryption, Memory/I/O fabrics)
  - Worker 5: 方向13-15 (Confidential I/O protocol, Accelerator offload, SmartNIC)

### Stage 3: 检查与修复
- 主Agent运行check.sh检查所有页面
- 修复所有ERROR和WARNING

### Stage 4: 转换与交付
- 主Agent运行convert.sh生成最终.pptx

## 风格参考
- reference.pdf：学术汇报风格，白底，清晰标题层次，蓝色/灰色主色调
- 每篇论文5个维度：内容摘要、研究背景、解决方案、实验结果、文章评价
