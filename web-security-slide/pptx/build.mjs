#!/usr/bin/env node

import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const SLIDE_ROOT = path.join(ROOT, "web-security-slide");
const DEFAULT_OUT = path.join(SLIDE_ROOT, "output", "web-security-report-slide.pptx");
const SLIDE_SIZE = { width: 1280, height: 720 };
const STYLE = {
  bg: "#FAFBFC",
  bgWarm: "#F0F4F8",
  ink: "#0F172A",
  inkDeep: "#1E293B",
  soft: "#475569",
  muted: "#64748B",
  accent: "#2563EB",
  accentDeep: "#1E40AF",
  accentSoft: "#DBEAFE",
  accentGlow: "#EFF6FF",
  secondary: "#0891B2",
  secondarySoft: "#CFFAFE",
  panel: "#FFFFFF",
  panelWarm: "#F8FAFC",
  rule: "#CBD5E1",
  ruleLight: "#E2E8F0",
  deep: "#0F172A",
  gold: "#F59E0B",
  goldSoft: "#FEF3C7",
  green: "#059669",
  greenSoft: "#D1FAE5",
  risk: "#DC2626",
  riskSoft: "#FEE2E2",
  body: "Microsoft YaHei",
  display: "Aptos",
  directionColors: [
    "#2563EB", "#0891B2", "#059669", "#8B5CF6", "#D946EF",
    "#F59E0B", "#EF4444", "#EC4899", "#14B8A6", "#3B82F6",
    "#6366F1", "#8B5CF6", "#A855F7", "#D946EF", "#F43F5E",
  ],
};

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (!key.startsWith("--")) throw new Error(`Unexpected argument: ${key}`);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key.slice(2)] = true;
    } else {
      args[key.slice(2)] = next;
      index += 1;
    }
  }
  return args;
}

function runtimeNodeModules() {
  if (process.env.CODEX_RUNTIME_NODE_MODULES) return process.env.CODEX_RUNTIME_NODE_MODULES;
  const home = process.env.HOME || process.env.USERPROFILE;
  if (!home) throw new Error("Cannot locate home directory for bundled Codex runtime.");
  return path.join(home, ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "node", "node_modules");
}

async function importArtifactTool() {
  const entrypoint = path.join(runtimeNodeModules(), "@oai", "artifact-tool", "dist", "artifact_tool.mjs");
  if (!fsSync.existsSync(entrypoint)) {
    throw new Error(`@oai/artifact-tool entrypoint not found: ${entrypoint}`);
  }
  return import(pathToFileURL(entrypoint).href);
}

function loadDeck() {
  const script = path.join(SLIDE_ROOT, "tools", "export_content_json.py");
  // Use .venv python if available, fallback to system python
  const venvPython = path.join(ROOT, ".venv", "Scripts", "python.exe");
  const pythonPath = fsSync.existsSync(venvPython) ? venvPython : "python";
  const result = spawnSync(pythonPath, [script], { cwd: ROOT, encoding: "utf8", shell: true });
  if (result.status !== 0) {
    throw new Error(["Failed to export report-slide YAML as JSON.", result.stdout, result.stderr].filter(Boolean).join("\n"));
  }
  return JSON.parse(result.stdout);
}

function normalizeFrame(x, y, w, h) {
  return { left: x, top: y, width: w, height: h };
}

function addShape(slide, x, y, w, h, fill, options = {}) {
  return slide.shapes.add({
    geometry: options.geometry || "rect",
    name: options.name,
    position: normalizeFrame(x, y, w, h),
    fill,
    line: options.line || { style: "solid", fill: "#00000000", width: 0 },
  });
}

function addText(slide, value, x, y, w, h, options = {}) {
  const shape = addShape(slide, x, y, w, h, options.fill || "#00000000", {
    line: options.line || { style: "solid", fill: "#00000000", width: 0 },
    name: options.name,
  });
  shape.text = String(value ?? "");
  shape.text.fontSize = options.size ?? 18;
  shape.text.color = options.color ?? STYLE.ink;
  shape.text.bold = Boolean(options.bold);
  shape.text.typeface = options.face ?? STYLE.body;
  shape.text.alignment = options.align ?? "left";
  shape.text.verticalAlignment = options.valign ?? "top";
  shape.text.insets = options.insets ?? { left: 0, right: 0, top: 0, bottom: 0 };
  return shape;
}

function bg(slide) {
  addShape(slide, 0, 0, SLIDE_SIZE.width, SLIDE_SIZE.height, STYLE.bg);
}

function bgGradient(slide, color) {
  addShape(slide, 0, 0, SLIDE_SIZE.width, SLIDE_SIZE.height, STYLE.bg);
  // Add subtle gradient overlay at top
  addShape(slide, 0, 0, SLIDE_SIZE.width, 180, color || "#EFF6FF", {
    line: { style: "solid", fill: "#00000000", width: 0 },
  });
}

function leftAccentBar(slide, color) {
  addShape(slide, 0, 0, 5, SLIDE_SIZE.height, color || STYLE.accent);
}

function rule(slide, x, y, w, color = STYLE.rule, h = 1) {
  addShape(slide, x, y, w, h, color);
}

function kicker(slide, label, x = 64, y = 50, color) {
  const c = color || STYLE.accent;
  addShape(slide, x, y + 4, 20, 12, c);
  addText(slide, String(label || "").toUpperCase(), x + 34, y, 520, 18, {
    size: 11,
    color: STYLE.muted,
    bold: true,
  });
}

function kickerBadge(slide, label, x = 64, y = 50, color) {
  const c = color || STYLE.accent;
  const w = (String(label || "").length * 7.5) + 32;
  addShape(slide, x, y, w, 24, c, {
    line: { style: "solid", fill: "#00000000", width: 0 },
  });
  addText(slide, String(label || "").toUpperCase(), x + 12, y + 5, w - 24, 14, {
    size: 9.5,
    color: "#FFFFFF",
    bold: true,
    align: "center",
    valign: "middle",
  });
}

function title(slide, value, x = 64, y = 88, w = 900, h = 90, size = 36) {
  addText(slide, value, x, y, w, h, {
    size,
    color: STYLE.inkDeep,
    bold: true,
    face: STYLE.body,
  });
}

function subtitle(slide, value, x = 64, y = 140, w = 900, h = 40, size = 18) {
  addText(slide, value, x, y, w, h, {
    size,
    color: STYLE.soft,
    bold: false,
    face: STYLE.body,
  });
}

function meta(slide, paper, y = 151) {
  addText(slide, `来源状态：${publicSourceStatus(paper.source_status)}`, 58, y, 760, 20, {
    size: 10,
    color: STYLE.muted,
  });
  evidenceBadge(slide, publicEvidence(paper.evidence), 958, y - 4);
}

function footer(slide, page, label, directionIndex, totalDirections) {
  rule(slide, 64, 680, 1152, STYLE.ruleLight, 1);
  const dirText = directionIndex !== undefined && totalDirections
    ? `${String(directionIndex).padStart(2, "0")} / ${String(totalDirections).padStart(2, "0")} 方向`
    : "";
  const fullLabel = dirText ? `${label}  |  ${dirText}` : label;
  addText(slide, fullLabel, 64, 688, 900, 18, { size: 9, color: STYLE.muted });
  addText(slide, String(page).padStart(3, "0"), 1152, 684, 64, 20, {
    size: 13,
    color: STYLE.accent,
    face: STYLE.display,
    bold: true,
    align: "right",
  });
}

function globalProgress(slide, directionIndex, totalDirections) {
  if (directionIndex === undefined || !totalDirections) return;
  const barW = 160;
  const barH = 4;
  const x = 1050;
  const y = 692;
  addShape(slide, x, y, barW, barH, STYLE.ruleLight, {
    line: { style: "solid", fill: "#00000000", width: 0 },
  });
  const progress = barW * (directionIndex / totalDirections);
  const color = STYLE.directionColors[(directionIndex - 1) % STYLE.directionColors.length] || STYLE.accent;
  addShape(slide, x, y, progress, barH, color, {
    line: { style: "solid", fill: "#00000000", width: 0 },
  });
}

function panel(slide, x, y, w, h, heading, options = {}) {
  addShape(slide, x, y, w, h, options.fill || STYLE.panel, {
    line: { style: "solid", fill: options.line || STYLE.ruleLight, width: 1 },
  });
  const headingColor = options.headingColor || STYLE.accent;
  addShape(slide, x, y + 2, 4, 20, headingColor, {
    line: { style: "solid", fill: "#00000000", width: 0 },
  });
  addText(slide, heading, x + 18, y + 14, w - 36, 20, {
    size: 11,
    color: headingColor,
    bold: true,
  });
}

function shadowPanel(slide, x, y, w, h, heading, options = {}) {
  // Subtle shadow panel with top accent bar
  addShape(slide, x + 1, y + 2, w, h, "#E2E8F0", {
    line: { style: "solid", fill: "#00000000", width: 0 },
  });
  addShape(slide, x, y, w, h, options.fill || STYLE.panel, {
    line: { style: "solid", fill: options.line || STYLE.ruleLight, width: 1 },
  });
  if (heading) {
    const headingColor = options.headingColor || STYLE.accent;
    addShape(slide, x, y, w, 4, headingColor, {
      line: { style: "solid", fill: "#00000000", width: 0 },
    });
    addText(slide, heading, x + 18, y + 16, w - 36, 20, {
      size: 11,
      color: headingColor,
      bold: true,
    });
  }
}

function asList(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function evidenceBadge(slide, value, x = 960, y = 48, w = 224) {
  const colorMap = {
    "E0": STYLE.accentDeep,
    "E1": STYLE.accent,
    "E2": STYLE.green,
    "E3": STYLE.gold,
    "E4": STYLE.muted,
    "E5": STYLE.risk,
  };
  let badgeColor = STYLE.accentSoft;
  let textColor = STYLE.accent;
  const text = String(value || "");
  for (const [key, color] of Object.entries(colorMap)) {
    if (text.includes(key)) {
      badgeColor = color + "20"; // 20% opacity hex
      textColor = color;
      break;
    }
  }
  addShape(slide, x, y, w, 28, badgeColor, {
    line: { style: "solid", fill: textColor + "40", width: 1 },
  });
  addText(slide, value, x + 12, y + 7, w - 24, 12, {
    size: 9,
    color: textColor,
    bold: true,
    align: "center",
    valign: "middle",
  });
}

function publicSourceStatus(value) {
  const map = {
    local_pdf_verified: "本地 PDF 已核验",
    author_hosted_eurosys_pdf_verified: "作者公开 PDF 已核验",
    source_verified_pdf_unavailable: "公开来源已核验，PDF 暂缺",
  };
  return map[value] || value || "来源状态未标注";
}

function publicEvidence(value) {
  let text = String(value || "");
  const replacements = [
    ["E1 primary systems", "E1 系统论文"],
    ["peer-reviewed primary", "同行评审系统论文"],
    ["Peer-reviewed primary", "同行评审系统论文"],
    ["Primary", "主讲材料"],
    ["primary", "主讲材料"],
    ["Foundational industry evidence", "基础产业证据"],
    ["Peer-reviewed SOTA", "同行评审改进证据"],
    ["Foundational", "基础证据"],
    ["Draft-not-ratified", "草案/未批准规范"],
  ];
  for (const [oldValue, newValue] of replacements) {
    text = text.replaceAll(oldValue, newValue);
  }
  return text;
}

function shortTitle(value, limit = 48) {
  let text = String(value || "");
  for (const prefix of ["SoK: ", "A Survey of ", "The ", "Towards "]) {
    if (text.startsWith(prefix)) text = text.slice(prefix.length);
  }
  return text.length <= limit ? text : `${text.slice(0, limit - 1).replace(/[ ,;；，]+$/u, "")}…`;
}

function sanitizeSourceNote(note) {
  let text = String(note || "");
  const publicRewrites = [
    ["local_pdf_verified", "本地 PDF 已核验"],
    ["author_hosted_eurosys_pdf_verified", "作者公开 PDF 已核验"],
    ["source_verified_pdf_unavailable", "公开来源已核验，PDF 暂缺"],
    ["source status", "来源状态"],
    ["source-status", "来源状态"],
    ["source_status", "来源状态"],
    ["paper type", "材料类型"],
    ["claim strength", "证据强度"],
    ["primary slot", "主讲定位"],
    ["selection slot", "主讲定位"],
    ["Primary 1", "基础入口"],
    ["Primary 2", "代表性改进"],
    ["Primary 3", "当前边界"],
    ["primary", "主讲材料"],
    ["Foundational industry evidence", "基础产业证据"],
    ["Peer-reviewed SOTA", "同行评审改进证据"],
    ["Foundational", "基础证据"],
    ["Draft-not-ratified", "草案/未批准规范"],
  ];
  for (const [oldValue, newValue] of publicRewrites) {
    text = text.replaceAll(oldValue, newValue);
  }
  const internalTerms = [
    "papers.yml",
    "story.yml",
    "report-slide",
    "reference entry",
    "source URL",
    "source-status",
    "evidence ledger",
    "claim 强度保持",
  ];
  if (!text || internalTerms.some((term) => text.includes(term))) {
    return "来源：论文原文、官方规范或公开材料｜证据等级：见本页 badge";
  }
  if (!text.startsWith("来源：") && !text.startsWith("Source:")) return `来源：${text}`;
  return text;
}

function bulletList(slide, items, x, y, w, options = {}) {
  const size = options.size ?? 16;
  const gap = options.gap ?? 50;
  const bulletColor = options.bulletColor || STYLE.accent;
  asList(items).slice(0, options.limit ?? 5).forEach((item, index) => {
    const yy = y + index * gap;
    const bc = Array.isArray(bulletColor) ? bulletColor[index % bulletColor.length] : bulletColor;
    addShape(slide, x, yy + 8, 7, 7, bc, {
      line: { style: "solid", fill: "#00000000", width: 0 },
    });
    addText(slide, item, x + 20, yy, w - 20, gap - 6, {
      size,
      color: options.color || STYLE.ink,
      bold: Boolean(options.boldFirst && index === 0),
    });
  });
}

function visualStack(slide, heading, items, x, y, w, h, mode = "stack") {
  panel(slide, x, y, w, h, heading);
  const clean = asList(items).slice(0, 5);
  if (mode === "flow") {
    const stepW = (w - 54) / Math.max(clean.length, 1);
    clean.forEach((item, index) => {
      const xx = x + 20 + index * stepW;
      addShape(slide, xx, y + 92, stepW - 16, 104, index % 2 ? "#FFF7ED" : STYLE.accentSoft, {
        line: { style: "solid", fill: index % 2 ? "#FDBA74" : "#FDA29B", width: 1 },
      });
      addText(slide, String(index + 1).padStart(2, "0"), xx + 12, y + 105, 40, 22, {
        size: 16,
        color: index % 2 ? STYLE.gold : STYLE.accent,
        face: STYLE.display,
        bold: true,
      });
      addText(slide, item, xx + 12, y + 136, stepW - 40, 44, { size: 10.5, color: STYLE.ink, bold: true });
      if (index < clean.length - 1) {
        rule(slide, xx + stepW - 9, y + 144, 18, STYLE.rule, 2);
      }
    });
    return;
  }

  clean.forEach((item, index) => {
    const yy = y + 62 + index * 58;
    addText(slide, String(index + 1).padStart(2, "0"), x + 22, yy, 42, 28, {
      size: 21,
      color: index % 2 ? STYLE.gold : STYLE.accent,
      face: STYLE.display,
      bold: true,
    });
    rule(slide, x + 72, yy + 15, w - 96, index % 2 ? "#FEDF89" : "#FDA29B", 2);
    addText(slide, item, x + 82, yy - 1, w - 110, 34, { size: 12, color: STYLE.ink, bold: index === 0 });
  });
}

function sectionDivider(presentation, direction, directionIndex, totalDirections, page) {
  const slide = presentation.slides.add();
  const color = STYLE.directionColors[(directionIndex - 1) % STYLE.directionColors.length] || STYLE.accent;
  
  // Full background
  addShape(slide, 0, 0, SLIDE_SIZE.width, SLIDE_SIZE.height, STYLE.bg);
  
  // Left color block (1/3 width)
  addShape(slide, 0, 0, 420, SLIDE_SIZE.height, color, {
    line: { style: "solid", fill: "#00000000", width: 0 },
  });
  
  // Direction number on left block
  addText(slide, String(directionIndex).padStart(2, "0"), 56, 220, 300, 140, {
    size: 96,
    color: "#FFFFFF",
    face: STYLE.display,
    bold: true,
  });
  
  // Direction label on left block
  addText(slide, "DIRECTION", 60, 370, 300, 28, {
    size: 14,
    color: "#FFFFFFCC",
    bold: true,
  });
  
  // Direction name on right
  addText(slide, direction.direction, 480, 260, 740, 60, {
    size: 38,
    color: STYLE.inkDeep,
    bold: true,
    face: STYLE.body,
  });
  
  // Focus description
  addText(slide, direction.focus || "", 480, 340, 700, 80, {
    size: 17,
    color: STYLE.soft,
    bold: false,
  });
  
  // Primary papers list
  if (direction.primary && direction.primary.length > 0) {
    addText(slide, "主讲材料", 480, 450, 200, 24, {
      size: 12,
      color: color,
      bold: true,
    });
    direction.primary.forEach((paper, index) => {
      const yy = 486 + index * 38;
      addShape(slide, 480, yy + 10, 10, 10, color, {
        line: { style: "solid", fill: "#00000000", width: 0 },
      });
      addText(slide, paper.title || "", 502, yy, 680, 28, {
        size: 13,
        color: STYLE.ink,
        bold: true,
      });
      addText(slide, publicEvidence(paper.evidence) || "", 502, yy + 22, 300, 18, {
        size: 9,
        color: STYLE.muted,
      });
    });
  }
  
  // Global progress
  globalProgress(slide, directionIndex, totalDirections);
  
  // Footer
  footer(slide, page, `方向开场 | ${direction.direction}`, directionIndex, totalDirections);
  return slide;
}

function coverSlide(presentation, deck) {
  const slide = presentation.slides.add();
  bg(slide);
  
  // Top accent bar
  addShape(slide, 0, 0, SLIDE_SIZE.width, 6, STYLE.accent, {
    line: { style: "solid", fill: "#00000000", width: 0 },
  });
  
  // Left vertical accent
  addShape(slide, 0, 0, 8, SLIDE_SIZE.height, STYLE.accent, {
    line: { style: "solid", fill: "#00000000", width: 0 },
  });
  
  addText(slide, "RESEARCH SLIDE REPORT", 64, 60, 420, 18, { size: 11, color: STYLE.muted, bold: true });
  addText(slide, "IoT 网络设备 Web 接口安全的技术演进与前沿实践", 64, 90, 820, 26, { size: 15, color: STYLE.soft });
  
  title(slide, "网络设备 Web 服务\n安全研究综述", 64, 180, 760, 170, 52);
  addText(slide, "面向固件漏洞挖掘、隐藏接口发现与自动化验证的研究型技术演进报告", 68, 390, 760, 34, {
    size: 20,
    color: STYLE.soft,
    bold: true,
  });
  
  metricRail(slide, 64, 550, [
    ["4", "技术维度", "覆盖 Source 识别到 PoC 生成全链路"],
    ["12", "代表论文", "USENIX Security / IEEE S&P / NDSS / CCS"],
    ["~80", "页", "封面、总览、方向页与总结"],
    ["E1-E2", "证据体系", "每页保留 claim boundary"],
  ]);
  
  visualStack(slide, "报告主线", ["Source 识别", "Dataflow 追踪", "Hidden 接口", "验证与 PoC"], 840, 210, 360, 300);
  footer(slide, 1, "网络设备 Web 安全研究综述");
  return slide;
}

function metricRail(slide, x, y, metrics) {
  metrics.forEach((metric, index) => {
    const xx = x + index * 280;
    rule(slide, xx, y - 10, 1, index % 2 ? STYLE.gold : STYLE.accent, 64);
    addText(slide, metric[0], xx + 16, y, 110, 36, {
      size: 32,
      color: STYLE.ink,
      face: STYLE.display,
      bold: true,
    });
    addText(slide, metric[1], xx + 16, y + 42, 170, 18, { size: 10, color: STYLE.ink, bold: true });
    addText(slide, metric[2], xx + 16, y + 62, 190, 24, { size: 9, color: STYLE.muted });
  });
}

function overviewSlides(presentation, deck, pageStart) {
  let page = pageStart;
  const slides = [];
  const one = presentation.slides.add();
  bg(one);
  kicker(one, "报告定位");
  evidenceBadge(one, "Method", 960, 44);
  title(one, "网络设备 Web 接口是对外暴露的首要攻击面，传统分析工具在固件场景面临四大挑战。", 58, 86, 980, 88, 32);
  const positionCards = [
    ["核心问题", ["固件缺少源码，入口识别困难。", "数据流因多进程/多语言而截断。", "厂商遗留测试接口缺乏保护。", "静态告警海量、动态 Fuzzing 难运行。"]],
    ["报告范围", ["Source 识别：从关键词匹配到 LLM 语义理解。", "Dataflow 追踪：跨进程、跨语言、规模化。", "Hidden 接口：从 URL 枚举到参数规格恢复。", "验证与 PoC：从静态告警到动态闭环。"]],
    ["阅读主线", ["Source 识别 -> 污点源精准定位。", "Dataflow 追踪 -> 跨组件漏洞发现。", "Hidden 接口 -> 未授权访问与后门挖掘。", "验证与 PoC -> 告警确认与利用生成。"]],
  ];
  positionCards.forEach((card, index) => {
    const x = 72 + index * 386;
    panel(one, x, 236, 332, 280, card[0], { fill: "#FFFFFF" });
    bulletList(one, card[1], x + 24, 294, 280, { gap: 56, size: 14.2, limit: 4 });
  });
  footer(one, page++, "总览 | 报告定位");
  slides.push(one);

  const two = presentation.slides.add();
  bg(two);
  kicker(two, "证据边界");
  evidenceBadge(two, "E0-E5", 960, 44);
  title(two, "所有实验结论均基于论文 threat model、数据集和 workload；静态分析告警不等于可利用漏洞。", 58, 86, 900, 86, 34);
  const evidence = [
    ["E1", "同行评审系统论文支撑系统设计、实现与实验结果，限定在论文 threat model 与数据集内。"],
    ["E2", "Survey/经验研究用于 taxonomy、覆盖范围与 related-work framing；机制结论回到原论文或规范。"],
    ["E3", "预印本、arXiv 或工具开源版本；显式标注其非最终评审状态。"],
    ["E4", "工具厂商博客、会议演讲或技术白皮书，仅支撑工程背景与研究线索。"],
  ];
  evidence.forEach((row, index) => {
    const yy = 210 + index * 74;
    const badgeColors = [STYLE.accentDeep, STYLE.accent, STYLE.green, STYLE.gold, STYLE.muted];
    const barColors = [STYLE.accentSoft, STYLE.accentSoft, STYLE.greenSoft, STYLE.goldSoft, "#F1F5F9"];
    const badgeColor = badgeColors[index] || STYLE.accent;
    const barColor = barColors[index] || STYLE.accentSoft;
    
    addShape(two, 72, yy - 4, 1080, 64, "#FFFFFF", {
      line: { style: "solid", fill: STYLE.ruleLight, width: 1 },
    });
    addShape(two, 72, yy - 4, 4, 64, badgeColor, {
      line: { style: "solid", fill: "#00000000", width: 0 },
    });
    addText(two, row[0], 96, yy + 4, 86, 38, { size: 24, color: badgeColor, face: STYLE.display, bold: true });
    addText(two, row[1], 210, yy + 10, 880, 42, { size: 15, color: STYLE.ink });
  });
  footer(two, page++, "总览 | 证据边界");
  slides.push(two);

  const three = presentation.slides.add();
  bg(three);
  kicker(three, "方向索引");
  evidenceBadge(three, "Method", 960, 44);
  title(three, "4 个技术维度按输入源点、数据流传播、隐藏接口发现与漏洞验证展开。", 58, 84, 940, 70, 32);
  const groups = [
    ["输入源点识别", "01", "SaTC -> HermeScan -> LARA：从关键词匹配到 LLM 语义理解"],
    ["复杂后端数据流", "02", "KARONTE -> MangoDFA -> OctopusTaint：跨进程、规模化、高精度"],
    ["隐藏接口发现", "03", "IoTScope -> EAGLEYE -> PANGOLIN：从 URL 枚举到参数规格恢复"],
    ["漏洞验证与 PoC", "04", "NÜWA -> LABRADOR -> FirmAgent：从静态约束到动态闭环"],
    ["全局总结", "结尾", "技术演进、研究空白、工程落地优先级"],
  ];
  groups.forEach((group, index) => {
    const y = 202 + index * 72;
    addShape(three, 72, y - 10, 1080, 56, index % 2 ? "#FFFFFF" : STYLE.panel, {
      line: { style: "solid", fill: STYLE.rule, width: 1 },
    });
    addText(three, group[0], 96, y, 230, 24, { size: 13.4, color: STYLE.ink, bold: true });
    addText(three, group[1], 350, y - 2, 90, 26, { size: 18, color: STYLE.accent, bold: true, align: "center" });
    addText(three, group[2], 472, y, 620, 28, { size: 11.2, color: STYLE.soft });
  });
  footer(three, page++, "总览 | 方向索引");
  slides.push(three);
  return { slides, nextPage: page };
}

function directionIntro(presentation, direction, page, directionIndex, totalDirections) {
  const slide = presentation.slides.add();
  const color = STYLE.directionColors[(directionIndex - 1) % STYLE.directionColors.length] || STYLE.accent;
  bg(slide);
  leftAccentBar(slide, color);
  
  kicker(slide, "方向开场");
  title(slide, `${direction.direction}：方向开场`, 64, 82, 990, 54, 31);
  addText(slide, direction.focus, 66, 154, 820, 58, { size: 17, color: STYLE.soft, bold: true });
  
  shadowPanel(slide, 64, 252, 640, 280, "三篇主讲选择规则", { fill: "#FFFFFF", headingColor: color });
  addText(slide, direction.selection_rule, 88, 292, 590, 54, { size: 13.5, color: STYLE.soft });
  direction.primary.forEach((paper, index) => {
    const yy = 370 + index * 48;
    addShape(slide, 88, yy + 8, 8, 8, color, {
      line: { style: "solid", fill: "#00000000", width: 0 },
    });
    addText(slide, `主讲 ${index + 1}`, 108, yy, 78, 24, { size: 11, color: color, bold: true });
    addText(slide, paper.title, 198, yy - 2, 340, 28, { size: 13, color: STYLE.ink, bold: true });
    addText(slide, publicEvidence(paper.evidence), 548, yy, 140, 22, { size: 9.5, color: STYLE.muted });
  });
  
  visualStack(slide, "证据边界", direction.primary.map((paper) => `${shortTitle(paper.title, 32)}：${publicEvidence(paper.evidence)}；${publicSourceStatus(paper.source_status)}`), 768, 246, 364, 314);
  
  globalProgress(slide, directionIndex, totalDirections);
  footer(slide, page, `方向开场 | ${direction.direction}`, directionIndex, totalDirections);
  return slide;
}

function paperSlide(presentation, direction, paper, slideKey, page, directionIndex, totalDirections) {
  const slide = presentation.slides.add();
  const labels = {
    summary: "内容摘要",
    background: "研究背景",
    solution: "解决方案",
    experiments: "实验结果",
  };
  const data = paper.slides[slideKey];
  const color = STYLE.directionColors[(directionIndex - 1) % STYLE.directionColors.length] || STYLE.accent;
  
  // Page type colors
  const typeColors = {
    summary: STYLE.accent,
    background: STYLE.muted,
    solution: STYLE.green,
    experiments: STYLE.gold,
  };
  const typeColor = typeColors[slideKey] || color;
  
  bg(slide);
  leftAccentBar(slide, typeColor);
  
  kicker(slide, labels[slideKey]);
  title(slide, `${paper.title}：${labels[slideKey]}`, 64, 82, 1020, 54, 26);
  meta(slide, paper, 144);
  addText(slide, data.claim, 64, 176, 900, 52, { size: 20, color: STYLE.inkDeep, bold: true });
  
  shadowPanel(slide, 64, 272, 650, 300, "讲解要点", { fill: "#FFFFFF", headingColor: typeColor });
  bulletList(slide, data.points, 90, 324, 590, { size: 15, gap: 56, limit: 4, bulletColor: typeColor });
  
  const mode = slideKey === "solution" ? "flow" : "stack";
  visualStack(slide, data.visual.title, data.visual.items, 780, 252, 360, 320, mode);
  
  globalProgress(slide, directionIndex, totalDirections);
  footer(slide, page, `${direction.direction} | ${labels[slideKey]}`, directionIndex, totalDirections);
  return slide;
}

function evaluationSlide(presentation, direction, paper, page, directionIndex, totalDirections) {
  const slide = presentation.slides.add();
  const data = paper.slides.evaluation;
  const color = STYLE.directionColors[(directionIndex - 1) % STYLE.directionColors.length] || STYLE.accent;
  
  bg(slide);
  leftAccentBar(slide, color);
  kicker(slide, "文章评价");
  title(slide, `${paper.title}：文章评价`, 64, 82, 1020, 54, 26);
  meta(slide, paper, 144);
  addText(slide, data.claim, 64, 176, 900, 52, { size: 20, color: STYLE.inkDeep, bold: true });
  
  const cards = [
    ["优点", data.strengths, STYLE.green, STYLE.greenSoft],
    ["不足", data.limitations, STYLE.risk, STYLE.riskSoft],
    ["商业落地", data.commercialization, STYLE.gold, STYLE.goldSoft],
  ];
  cards.forEach((card, index) => {
    const x = 72 + index * 376;
    // Shadow
    addShape(slide, x + 1, 273, 326, 274, "#E2E8F0", { line: { style: "solid", fill: "#00000000", width: 0 } });
    addShape(slide, x, 272, 326, 274, "#FFFFFF", { line: { style: "solid", fill: STYLE.ruleLight, width: 1 } });
    addShape(slide, x, 272, 326, 6, card[2]);
    addText(slide, card[0], x + 22, 298, 260, 24, { size: 15, color: card[2], bold: true });
    addText(slide, card[1], x + 22, 342, 282, 132, { size: 14, color: STYLE.ink });
  });
  
  globalProgress(slide, directionIndex, totalDirections);
  footer(slide, page, `${direction.direction} | 文章评价`, directionIndex, totalDirections);
  return slide;
}

function directionSummary(presentation, direction, page, directionIndex, totalDirections) {
  const slide = presentation.slides.add();
  const color = STYLE.directionColors[(directionIndex - 1) % STYLE.directionColors.length] || STYLE.accent;
  
  bg(slide);
  leftAccentBar(slide, color);
  kicker(slide, "方向总结");
  title(slide, `${direction.direction}：技术演进总结`, 64, 82, 1020, 54, 26);
  addText(slide, "三篇材料共同回答本方向从基础机制到当前证据边界的演进关系。", 64, 160, 880, 36, {
    size: 20,
    color: STYLE.inkDeep,
    bold: true,
  });
  
  const titles = direction.primary.map((paper) => paper.title);
  const gap = direction.primary.flatMap((paper) => [paper.slides.evaluation.strengths, paper.slides.evaluation.limitations]).slice(0, 4);
  const commercial = direction.primary.map((paper) => paper.slides.evaluation.commercialization);
  
  visualStack(slide, "技术演进", titles, 70, 252, 330, 308);
  visualStack(slide, "优点与缺口", gap, 472, 252, 330, 308);
  visualStack(slide, "商业化适配", commercial, 874, 252, 330, 308);
  
  globalProgress(slide, directionIndex, totalDirections);
  footer(slide, page, `方向总结 | ${direction.direction}`, directionIndex, totalDirections);
  return slide;
}

function paperByKey(direction, key) {
  return direction.primary.find((paper) => paper.key === key);
}

function authoredLabel(slideType) {
  return {
    direction_intro: "方向开场",
    direction_summary: "方向总结",
    summary: "内容摘要",
    background: "研究背景",
    solution: "解决方案",
    experiments: "实验结果",
    evaluation: "文章评价",
  }[slideType] || slideType;
}

function drawSourceNote(slide, note) {
  addShape(slide, 64, 610, 1086, 42, "#FFFFFF", { line: { style: "solid", fill: STYLE.rule, width: 1 } });
  addText(slide, sanitizeSourceNote(note), 80, 620, 1054, 20, { size: 8.2, color: STYLE.muted });
}

function drawAuthoredPanel(slide, x, y, w, h, heading) {
  addShape(slide, x, y, w, h, "#FFFFFF", { line: { style: "solid", fill: STYLE.rule, width: 1 } });
  addShape(slide, x, y, w, 6, STYLE.accent);
  addText(slide, heading, x + 18, y + 18, w - 36, 18, { size: 10, color: STYLE.accent, bold: true });
}

function drawNarrative(slide, items, x, y, w, h) {
  drawAuthoredPanel(slide, x, y, w, h, "内容说明");
  asList(items).slice(0, 4).forEach((item, index) => {
    const yy = y + 58 + index * 55;
    addText(slide, String(index + 1).padStart(2, "0"), x + 20, yy, 36, 22, {
      size: 16,
      color: index % 2 ? STYLE.gold : STYLE.accent,
      face: STYLE.display,
      bold: true,
    });
    addText(slide, item, x + 64, yy - 2, w - 88, 44, { size: 12.2, color: STYLE.ink });
  });
}

function drawFlowVisual(slide, proof, x, y, w, h) {
  drawAuthoredPanel(slide, x, y, w, h, proof.title);
  const stages = asList(proof.data?.stages).slice(0, 6);
  const cols = stages.length <= 4 ? stages.length : 3;
  const rows = Math.ceil(stages.length / cols);
  const cellW = (w - 56) / cols;
  const cellH = rows === 1 ? 120 : 92;
  stages.forEach((stage, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const xx = x + 22 + col * cellW;
    const yy = y + 80 + row * (cellH + 26);
    addShape(slide, xx, yy, cellW - 20, cellH, index % 2 ? "#FFF7ED" : STYLE.accentSoft, {
      line: { style: "solid", fill: index % 2 ? "#FDBA74" : "#FDA29B", width: 1 },
    });
    addText(slide, String(index + 1).padStart(2, "0"), xx + 12, yy + 12, 38, 22, {
      size: 16,
      color: index % 2 ? STYLE.gold : STYLE.accent,
      face: STYLE.display,
      bold: true,
    });
    addText(slide, stage, xx + 14, yy + 42, cellW - 48, cellH - 52, { size: 10.3, color: STYLE.ink, bold: index === 0 });
    if (col < cols - 1 && index < stages.length - 1) {
      rule(slide, xx + cellW - 18, yy + cellH / 2, 18, STYLE.rule, 2);
    }
  });
}

function drawPathCompare(slide, proof, x, y, w, h) {
  drawAuthoredPanel(slide, x, y, w, h, proof.title);
  const paths = Array.isArray(proof.data?.paths) ? proof.data.paths.slice(0, 2) : [];
  paths.forEach((pathItem, index) => {
    const xx = x + 22 + index * ((w - 58) / 2);
    const yy = y + 68;
    const cardW = (w - 76) / 2;
    addShape(slide, xx, yy, cardW, h - 92, index === 0 ? "#F8FAFC" : "#FFF7ED", {
      line: { style: "solid", fill: index === 0 ? STYLE.rule : "#FDBA74", width: 1 },
    });
    addText(slide, pathItem.label, xx + 18, yy + 18, cardW - 36, 22, {
      size: 13,
      color: index === 0 ? STYLE.soft : STYLE.gold,
      bold: true,
    });
    asList(pathItem.steps).slice(0, 5).forEach((step, stepIndex) => {
      const sy = yy + 56 + stepIndex * 34;
      addShape(slide, xx + 18, sy + 5, 8, 8, index === 0 ? STYLE.muted : STYLE.accent);
      addText(slide, step, xx + 34, sy, cardW - 58, 24, { size: 9.6, color: STYLE.ink });
    });
    addText(slide, pathItem.note, xx + 18, yy + h - 118, cardW - 36, 32, { size: 8.8, color: STYLE.muted, bold: true });
  });
}

function drawTimeline(slide, proof, x, y, w, h) {
  drawAuthoredPanel(slide, x, y, w, h, proof.title);
  const steps = Array.isArray(proof.data?.steps) ? proof.data.steps.slice(0, 4) : [];
  steps.forEach((step, index) => {
    const yy = y + 70 + index * 64;
    addText(slide, step.label, x + 24, yy, 130, 22, { size: 13, color: index % 2 ? STYLE.gold : STYLE.accent, face: STYLE.display, bold: true });
    rule(slide, x + 164, yy + 12, 330, index % 2 ? "#FEDF89" : "#FDA29B", 2);
    addText(slide, step.claim, x + 182, yy - 4, 260, 24, { size: 12, color: STYLE.ink, bold: true });
    addText(slide, step.evidence, x + 182, yy + 24, 320, 20, { size: 9.2, color: STYLE.muted });
  });
}

function drawMetricBars(slide, proof, x, y, w, h) {
  drawAuthoredPanel(slide, x, y, w, h, proof.title);
  const metrics = Array.isArray(proof.data?.metrics) ? proof.data.metrics.slice(0, 5) : [];
  metrics.forEach((metric, index) => {
    const yy = y + 66 + index * 50;
    const bar = Math.max(2, Math.min(Number(metric.bar) || 20, 100));
    addText(slide, metric.label, x + 22, yy, 210, 18, { size: 10.5, color: STYLE.ink, bold: true });
    addText(slide, metric.value, x + w - 160, yy - 2, 124, 22, { size: 13, color: index % 2 ? STYLE.gold : STYLE.accent, bold: true, align: "right" });
    addShape(slide, x + 244, yy + 5, w - 430, 10, "#EAECF0", { line: { style: "solid", fill: "#00000000", width: 0 } });
    addShape(slide, x + 244, yy + 5, (w - 430) * (bar / 100), 10, index % 2 ? STYLE.gold : STYLE.accent);
    addText(slide, metric.note, x + 244, yy + 20, w - 300, 16, { size: 8.6, color: STYLE.muted });
  });
}

function drawMatrix(slide, proof, x, y, w, h) {
  drawAuthoredPanel(slide, x, y, w, h, proof.title);
  const columns = asList(proof.data?.columns);
  const rows = Array.isArray(proof.data?.rows) ? proof.data.rows.slice(0, 5) : [];
  const colCount = Math.max(columns.length, 2);
  const rowH = Math.min(48, (h - 104) / Math.max(rows.length, 1));
  const colW = (w - 44) / colCount;
  columns.forEach((col, index) => {
    addText(slide, col, x + 22 + index * colW, y + 58, colW - 10, 28, { size: 9.3, color: STYLE.accent, bold: true });
  });
  rows.forEach((row, rowIndex) => {
    const yy = y + 92 + rowIndex * rowH;
    addShape(slide, x + 20, yy - 4, w - 44, 1, rowIndex % 2 ? "#FEDF89" : "#FDA29B");
    const cells = Array.isArray(row) ? row : [row];
    for (let col = 0; col < colCount; col += 1) {
      addText(slide, cells[col] || "", x + 22 + col * colW, yy, colW - 10, rowH - 8, {
        size: colCount > 3 ? 8.2 : 9.2,
        color: col === 0 ? STYLE.ink : STYLE.soft,
        bold: col === 0,
      });
    }
  });
}

function drawAuthoredProof(slide, proof, x, y, w, h) {
  const type = proof?.type;
  if (type === "path_compare") return drawPathCompare(slide, proof, x, y, w, h);
  if (type === "evolution_timeline") return drawTimeline(slide, proof, x, y, w, h);
  if (type === "metric_bars") return drawMetricBars(slide, proof, x, y, w, h);
  if (["comparison_matrix", "rdma_tradeoff_matrix", "evidence_gap_matrix"].includes(type)) return drawMatrix(slide, proof, x, y, w, h);
  return drawFlowVisual(slide, proof, x, y, w, h);
}

function authoredStorySlide(presentation, direction, storySlide, page, directionIndex, totalDirections) {
  const slide = presentation.slides.add();
  const paper = paperByKey(direction, storySlide.paper_key);
  const label = authoredLabel(storySlide.slide_type);
  const slideTitle = paper ? `${paper.title}：${label}` : `${direction.direction}：${label}`;
  bg(slide);
  kicker(slide, label);
  title(slide, slideTitle, 58, 78, 1060, 58, paper ? 24 : 28);
  addText(slide, paper ? `来源状态：${publicSourceStatus(paper.source_status)}` : "方向综述：主讲材料与公开来源综合", 58, 138, 760, 18, {
    size: 9.2,
    color: STYLE.muted,
  });
  evidenceBadge(slide, paper ? publicEvidence(paper.evidence) : "方向综述", 958, 134);
  addText(slide, storySlide.claim, 58, 168, 1060, 58, { size: 19, color: STYLE.ink, bold: true });
  drawNarrative(slide, storySlide.narrative, 64, 260, 496, 320);
  drawAuthoredProof(slide, storySlide.proof_object || {}, 610, 236, 570, 352);
  drawSourceNote(slide, storySlide.source_note || "");
  globalProgress(slide, directionIndex, totalDirections);
  footer(slide, page, `${direction.direction} | ${label}`, directionIndex, totalDirections);
  return slide;
}

function authoredDirectionSlides(presentation, direction, pageStart, directionIndex, totalDirections) {
  let page = pageStart;
  const slides = [];
  const storySlides = Array.isArray(direction._story?.slides) ? direction._story.slides : [];
  for (const storySlide of storySlides) {
    slides.push(authoredStorySlide(presentation, direction, storySlide, page++, directionIndex, totalDirections));
  }
  return { slides, nextPage: page };
}

function finalSlide(presentation, page, totalDirections) {
  const slide = presentation.slides.add();
  bg(slide);
  
  // Top accent bar
  addShape(slide, 0, 0, SLIDE_SIZE.width, 6, STYLE.accent, {
    line: { style: "solid", fill: "#00000000", width: 0 },
  });
  
  kicker(slide, "全局总结");
  title(slide, "网络设备 Web 安全研究正从静态污点分析走向动静结合、LLM 辅助的自动化闭环。", 64, 84, 920, 88, 34);
  
  visualStack(slide, "技术结论", [
    "早期工作聚焦单二进制污点分析与关键词匹配。",
    "新一代技术必须覆盖跨进程、跨语言、隐藏接口与参数规格。",
    "LLM 正在重塑 Source 识别、接口推断与 PoC 生成范式。",
    "动态验证与静态约束结合是未来漏洞挖掘的核心路线。",
  ], 92, 232, 430, 310);
  visualStack(slide, "研究空白", [
    "跨语言数据流模型（C-Lua-Python-JS）仍不成熟。",
    "隐藏接口的参数规格恢复与状态机推断需要更多研究。",
    "LLM 辅助分析的可复现性、成本与误报控制缺少系统评估。",
    "从告警到可验证 PoC 的端到端流水线仍缺少统一基准。",
  ], 690, 232, 430, 310);
  
  globalProgress(slide, totalDirections, totalDirections);
  footer(slide, page, "全局总结 | 研究启示", totalDirections, totalDirections);
  return slide;
}

async function saveBlobToFile(blob, outputPath) {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, Buffer.from(await blob.arrayBuffer()));
}

async function maybeRenderPreviews(presentation, slides, previewDir, limitArg) {
  if (!previewDir) return [];
  await fs.mkdir(previewDir, { recursive: true });
  const limit = limitArg === "all" || limitArg === true ? slides.length : Number.parseInt(limitArg || String(slides.length), 10);
  const count = Number.isFinite(limit) ? Math.min(limit, slides.length) : slides.length;
  const paths = [];
  for (let index = 0; index < count; index += 1) {
    const preview = await presentation.export({ slide: slides[index], format: "png", scale: 0.65 });
    const previewPath = path.join(previewDir, `slide-${String(index + 1).padStart(3, "0")}.png`);
    await saveBlobToFile(preview, previewPath);
    paths.push(previewPath);
  }
  return paths;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const out = path.resolve(args.out || DEFAULT_OUT);
  const previewDir = args.preview ? path.resolve(String(args.preview)) : undefined;
  let deck = loadDeck();
  const only = args.only ? String(args.only) : "";
  if (only) {
    deck = deck.filter((direction) => direction._directory === only || direction.direction === only);
    if (!deck.length) {
      throw new Error(`No report-slide direction matched --only ${only}`);
    }
  }
  const artifact = await importArtifactTool();
  const { Presentation, PresentationFile } = artifact;
  const presentation = Presentation.create({ slideSize: SLIDE_SIZE });
  const slides = [];

  let page = 1;
  if (!only) {
    slides.push(coverSlide(presentation, deck));
    page = 2;
    const overview = overviewSlides(presentation, deck, page);
    slides.push(...overview.slides);
    page = overview.nextPage;
  }

  const totalDirections = deck.length;
  let directionIndex = 0;
  
  for (const direction of deck) {
    directionIndex += 1;
    
    // Add section divider before each direction
    if (!only) {
      slides.push(sectionDivider(presentation, direction, directionIndex, totalDirections, page++));
    }
    
    if (direction._story?.slides) {
      const authored = authoredDirectionSlides(presentation, direction, page, directionIndex, totalDirections);
      slides.push(...authored.slides);
      page = authored.nextPage;
    } else {
      slides.push(directionIntro(presentation, direction, page++, directionIndex, totalDirections));
      for (const paper of direction.primary) {
        for (const slideKey of ["summary", "background", "solution", "experiments"]) {
          slides.push(paperSlide(presentation, direction, paper, slideKey, page++, directionIndex, totalDirections));
        }
        slides.push(evaluationSlide(presentation, direction, paper, page++, directionIndex, totalDirections));
      }
      slides.push(directionSummary(presentation, direction, page++, directionIndex, totalDirections));
    }
  }
  if (!only) {
    slides.push(finalSlide(presentation, page++, totalDirections));
  }

  await fs.mkdir(path.dirname(out), { recursive: true });
  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(out);
  const stat = await fs.stat(out);
  const previews = await maybeRenderPreviews(presentation, slides, previewDir, args["preview-limit"]);
  const manifest = {
    output: out,
    outputBytes: stat.size,
    slideCount: presentation.slides.count,
    expectedSlideCount: slides.length,
    only: only || undefined,
    previewDir,
    previewCount: previews.length,
  };
  const manifestPath = path.join(path.dirname(out), "pptx-build-manifest.json");
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ ...manifest, manifestPath }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
