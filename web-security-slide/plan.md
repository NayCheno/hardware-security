# Plan: 网络设备Web服务安全研究 Slides 制作

## 目标
基于PDF报告《网络设备Web服务安全_2.pdf》，制作一个精炼、专业的PPT Slides。每个维度精选3篇文章，每篇涵盖：内容摘要、研究背景、解决方案、实验结果、文章评价。

## 维度与文章精选

### 维度一：输入源点识别 (Source)
1. **SaTC** (USENIX Security 2021) - 基石：前后端共享关键词定位污点源
2. **HermeScan** (NDSS 2024) - SOTA：模糊匹配+跨库CFG+RDA
3. **LARA** (USENIX Security 2024) - SOTA：URI-Key结构化+LLM语义分析

### 维度二：复杂后端数据流 (Propagation)
1. **KARONTE** (IEEE S&P 2020) - 基石：多二进制交互+BDG建模
2. **MangoDFA** (USENIX Security 2024) - SOTA：Sink-to-Source+富表达式+全固件覆盖
3. **OctopusTaint** (ACM CCS 2024) - SOTA：RDA+AIL+净化检查+间接调用解析

### 维度三：隐藏接口发现 (Sink)
1. **IoTScope** (WWW 2022) - 基石：静态枚举+黑盒验证隐藏接口
2. **EAGLEYE** (NDSS 2025) - SOTA：路由Token推断+LLM模式学习
3. **PANGOLIN** (USENIX Security 2026) - SOTA：多语言接口规格恢复+语义Fuzzing

### 维度四：漏洞验证与PoC (Verification/PoC)
1. **NÜWA** (USENIX Security 2025) - 基石：约束语义不一致性分析
2. **LABRADOR** (IEEE S&P 2024) - SOTA：响应反馈导向黑盒Fuzzing
3. **FirmAgent** (NDSS 2026) - SOTA：Fuzzing+LLM Agent自动化PoC生成

## PPT结构

- 封面 1页
- 目录 1页
- 背景概述 1页
- 维度一（Source）章节页 + 3篇文章×2页 + 维度总结 1页 = 8页
- 维度二（Propagation）章节页 + 3篇文章×2页 + 维度总结 1页 = 8页
- 维度三（Sink）章节页 + 3篇文章×2页 + 维度总结 1页 = 8页
- 维度四（Verification）章节页 + 3篇文章×2页 + 维度总结 1页 = 8页
- 防御策略总结 1页
- 结尾页 1页
- 总计约36页

## 执行流程

### Stage 1: 主Agent设计
- 读取academic profile
- 创建design.md（视觉设计）
- 创建outline.md（内容大纲）
- 创建.pptd主文件

### Stage 2: 子Agent生产.page文件
- 分配多个子agent并行生成.page文件
- 每个子agent负责约8-10页

### Stage 3: 检查与修复
- 运行check.sh检查所有页面
- 修复ERROR和WARNING
- 重新验证

### Stage 4: 转换与交付
- 运行convert.sh生成.pptx
- 交付最终文件

## 技能使用
- pptx-swarm（长PPT生成）
- 使用reference_mode（基于PDF报告参考风格）
- summary_mode（基于已有文档内容）
