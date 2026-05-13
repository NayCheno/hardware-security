#!/usr/bin/env node

import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const SLIDE_ROOT = path.join(ROOT, "report-slide");
const DEFAULT_OUT = path.join(SLIDE_ROOT, "output", "hardware-security-report-slide.pptx");
const SLIDE_SIZE = { width: 1280, height: 720 };
const STYLE = {
  bg: "#FFFFFF",
  ink: "#111827",
  soft: "#4B5563",
  muted: "#667085",
  accent: "#B42318",
  accentSoft: "#FEE4E2",
  panel: "#F8FAFC",
  rule: "#D0D5DD",
  deep: "#101828",
  gold: "#B54708",
  green: "#027A48",
  body: "Microsoft YaHei",
  display: "Georgia",
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
  const result = spawnSync("python", [script], { cwd: ROOT, encoding: "utf8" });
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

function rule(slide, x, y, w, color = STYLE.rule, h = 1) {
  addShape(slide, x, y, w, h, color);
}

function kicker(slide, label, x = 58, y = 46) {
  addShape(slide, x, y + 5, 18, 10, STYLE.accent);
  addText(slide, String(label || "").toUpperCase(), x + 30, y, 520, 18, {
    size: 10,
    color: STYLE.muted,
    bold: true,
  });
}

function title(slide, value, x = 58, y = 82, w = 900, h = 90, size = 36) {
  addText(slide, value, x, y, w, h, {
    size,
    color: STYLE.ink,
    bold: true,
    face: STYLE.body,
  });
}

function meta(slide, paper, y = 151) {
  addText(slide, `${paper.key}   ${paper.evidence}   ${paper.source_status}`, 58, y, 1060, 20, {
    size: 10,
    color: STYLE.muted,
  });
}

function footer(slide, page, label) {
  rule(slide, 58, 682, 1164, STYLE.rule, 1);
  addText(slide, label, 58, 690, 900, 16, { size: 8.5, color: STYLE.muted });
  addText(slide, String(page).padStart(3, "0"), 1160, 686, 64, 18, {
    size: 12,
    color: STYLE.muted,
    face: STYLE.display,
    bold: true,
    align: "right",
  });
}

function panel(slide, x, y, w, h, heading, options = {}) {
  addShape(slide, x, y, w, h, options.fill || STYLE.panel, {
    line: { style: "solid", fill: options.line || STYLE.rule, width: 1 },
  });
  addText(slide, heading, x + 18, y + 16, w - 36, 18, {
    size: 10,
    color: options.headingColor || STYLE.accent,
    bold: true,
  });
}

function asList(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function bulletList(slide, items, x, y, w, options = {}) {
  const size = options.size ?? 16;
  const gap = options.gap ?? 50;
  asList(items).slice(0, options.limit ?? 5).forEach((item, index) => {
    const yy = y + index * gap;
    addShape(slide, x, yy + 7, 8, 8, index % 2 ? STYLE.gold : STYLE.accent);
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

function coverSlide(presentation, deck) {
  const slide = presentation.slides.add();
  bg(slide);
  addShape(slide, 58, 54, 6, 58, STYLE.accent);
  addText(slide, "HARDWARE SECURITY SURVEY", 80, 55, 420, 18, { size: 10, color: STYLE.muted, bold: true });
  addText(slide, "Arm/RISC-V 机密计算、I/O/Data-path 防御与硬件设计防御", 80, 84, 780, 24, { size: 14, color: STYLE.soft });
  title(slide, "Report-Slide\n全量重做版", 58, 178, 700, 160, 58);
  addText(slide, "45 篇精选主讲材料 · 15 个小方向 · 5 页精讲结构", 62, 378, 680, 30, {
    size: 19,
    color: STYLE.soft,
    bold: true,
  });
  metricRail(slide, 60, 530, [
    ["15", "小方向", "由 evidence ledger 固定"],
    ["45", "主讲材料", "1 篇 foundational + 2 篇 SOTA"],
    ["225", "精讲页", "摘要/背景/方案/实验/评价"],
    ["2", "交付轨道", "Beamer PDF + editable PPTX"],
  ]);
  visualStack(slide, "内容源", ["papers.yml", "story.yml", "generate_beamer.py", "pptx/build.mjs"], 820, 190, 340, 292, "flow");
  footer(slide, 1, `Generated from ${deck.length} report-slide directions`);
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
  kicker(one, "Report structure");
  title(one, "同一份 YAML 内容源同时生成 Beamer/PDF 与可编辑 PPTX。", 58, 86, 930, 86, 34);
  bulletList(one, [
    "15 个小方向，每个方向固定 3 篇主讲材料。",
    "每篇文章固定 5 页：内容摘要、研究背景、解决方案、实验结果、文章评价。",
    "规范、Survey、draft、industry evidence 均在页内保留证据等级。",
    "PDF 与 PPTX 只作为交付物；可维护内容是 papers.yml、story.yml 和生成脚本。",
  ], 78, 230, 620, { gap: 58, size: 18 });
  visualStack(one, "页数与结构", ["45 篇主讲材料", "225 页文章精讲", "每方向 1 页开场 + 1 页总结", "全 deck 约 260 页"], 780, 210, 350, 320);
  footer(one, page++, "Overview | delivery shape");
  slides.push(one);

  const two = presentation.slides.add();
  bg(two);
  kicker(two, "Evidence rules");
  title(two, "所有机制和实验结论都必须落在证据等级允许的范围内。", 58, 86, 900, 86, 34);
  const evidence = [
    ["E0", "规范性机制、状态、接口和术语；没有独立实验时写“规范，无新实验”。"],
    ["E1", "系统设计、实现和实验结果，但限定在论文 threat model 和 workload 内。"],
    ["E2", "taxonomy、覆盖范围和 related-work framing；机制 claim 回到原论文或规范。"],
    ["E3", "emerging direction 与草案状态；显式标注 draft/not ratified。"],
    ["E4/E5", "industry evidence 只支撑产品行为；metadata/source-limited 只写来源状态。"],
  ];
  evidence.forEach((row, index) => {
    const yy = 210 + index * 74;
    addText(two, row[0], 84, yy, 86, 38, { size: 24, color: index % 2 ? STYLE.gold : STYLE.accent, face: STYLE.display, bold: true });
    rule(two, 180, yy + 18, 850, index % 2 ? "#FEDF89" : "#FDA29B", 2);
    addText(two, row[1], 202, yy + 2, 780, 42, { size: 15, color: STYLE.ink });
  });
  footer(two, page++, "Overview | evidence rules");
  slides.push(two);

  const three = presentation.slides.add();
  bg(three);
  kicker(three, "Direction index");
  title(three, "15 个小方向按 foundational + SOTA 证据组织。", 58, 84, 940, 70, 32);
  deck.forEach((direction, index) => {
    const col = index < 8 ? 0 : 1;
    const row = col === 0 ? index : index - 8;
    const x = col === 0 ? 72 : 666;
    const y = 184 + row * 58;
    addText(three, String(index + 1).padStart(2, "0"), x, y, 42, 24, {
      size: 17,
      color: index % 2 ? STYLE.gold : STYLE.accent,
      face: STYLE.display,
      bold: true,
    });
    addText(three, direction.direction, x + 52, y - 2, 480, 22, { size: 12.5, color: STYLE.ink, bold: true });
    addText(three, direction.primary.map((p) => p.key).join(" / "), x + 52, y + 22, 480, 18, { size: 8.6, color: STYLE.muted });
  });
  footer(three, page++, "Overview | direction index");
  slides.push(three);
  return { slides, nextPage: page };
}

function directionIntro(presentation, direction, page) {
  const slide = presentation.slides.add();
  bg(slide);
  kicker(slide, direction._directory || direction.direction);
  title(slide, `${direction.direction}：方向开场`, 58, 82, 990, 54, 31);
  addText(slide, direction.focus, 60, 154, 820, 58, { size: 17, color: STYLE.soft, bold: true });
  panel(slide, 64, 252, 630, 268, "三篇主讲选择规则", { fill: "#FFFFFF" });
  addText(slide, direction.selection_rule, 88, 292, 580, 54, { size: 13.5, color: STYLE.soft });
  direction.primary.forEach((paper, index) => {
    const yy = 370 + index * 46;
    addText(slide, index === 0 ? "基础入口" : `SOTA ${index}`, 88, yy, 78, 24, { size: 11, color: STYLE.accent, bold: true });
    addText(slide, paper.title, 178, yy - 2, 330, 28, { size: 13, color: STYLE.ink, bold: true });
    addText(slide, paper.evidence, 520, yy, 140, 22, { size: 9.5, color: STYLE.muted });
  });
  visualStack(slide, "证据边界", direction.primary.map((paper) => `${paper.key}: ${paper.evidence}; ${paper.source_status}`), 768, 246, 364, 314);
  footer(slide, page, `Direction | ${direction.direction}`);
  return slide;
}

function paperSlide(presentation, direction, paper, slideKey, page) {
  const slide = presentation.slides.add();
  const labels = {
    summary: "内容摘要",
    background: "研究背景",
    solution: "解决方案",
    experiments: "实验结果",
  };
  const data = paper.slides[slideKey];
  bg(slide);
  kicker(slide, labels[slideKey]);
  title(slide, `${paper.title}：${labels[slideKey]}`, 58, 82, 1020, 54, 28);
  meta(slide, paper, 144);
  addText(slide, data.claim, 58, 176, 900, 52, { size: 21, color: STYLE.ink, bold: true });
  panel(slide, 64, 272, 650, 300, "讲解要点", { fill: "#FFFFFF" });
  bulletList(slide, data.points, 90, 324, 590, { size: 16, gap: 58, limit: 4 });
  const mode = slideKey === "solution" ? "flow" : "stack";
  visualStack(slide, data.visual.title, data.visual.items, 780, 252, 360, 320, mode);
  footer(slide, page, `${direction.direction} | ${paper.key}`);
  return slide;
}

function evaluationSlide(presentation, direction, paper, page) {
  const slide = presentation.slides.add();
  const data = paper.slides.evaluation;
  bg(slide);
  kicker(slide, "文章评价");
  title(slide, `${paper.title}：文章评价`, 58, 82, 1020, 54, 28);
  meta(slide, paper, 144);
  addText(slide, data.claim, 58, 176, 900, 52, { size: 21, color: STYLE.ink, bold: true });
  const cards = [
    ["优点", data.strengths, STYLE.green],
    ["不足", data.limitations, STYLE.accent],
    ["商业落地", data.commercialization, STYLE.gold],
  ];
  cards.forEach((card, index) => {
    const x = 72 + index * 376;
    addShape(slide, x, 272, 326, 274, "#FFFFFF", { line: { style: "solid", fill: STYLE.rule, width: 1 } });
    addShape(slide, x, 272, 326, 8, card[2]);
    addText(slide, card[0], x + 22, 300, 260, 24, { size: 15, color: card[2], bold: true });
    addText(slide, card[1], x + 22, 344, 282, 132, { size: 14, color: STYLE.ink });
  });
  footer(slide, page, `${direction.direction} | ${paper.key}`);
  return slide;
}

function directionSummary(presentation, direction, page) {
  const slide = presentation.slides.add();
  bg(slide);
  kicker(slide, "Direction takeaway");
  title(slide, `${direction.direction}：技术演进总结`, 58, 82, 1020, 54, 28);
  addText(slide, "三篇材料共同回答本方向从基础机制到 SOTA 边界的演进关系。", 58, 160, 880, 36, {
    size: 20,
    color: STYLE.ink,
    bold: true,
  });
  const titles = direction.primary.map((paper) => paper.title);
  const gap = direction.primary.flatMap((paper) => [paper.slides.evaluation.strengths, paper.slides.evaluation.limitations]).slice(0, 4);
  const commercial = direction.primary.map((paper) => paper.slides.evaluation.commercialization);
  visualStack(slide, "技术演进", titles, 70, 252, 330, 308);
  visualStack(slide, "优点与缺口", gap, 472, 252, 330, 308);
  visualStack(slide, "商业化适配", commercial, 874, 252, 330, 308);
  footer(slide, page, `Direction summary | ${direction.direction}`);
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
  addText(slide, `Source: ${note}`, 80, 620, 1054, 20, { size: 8.4, color: STYLE.muted });
}

function drawAuthoredPanel(slide, x, y, w, h, heading) {
  addShape(slide, x, y, w, h, "#FFFFFF", { line: { style: "solid", fill: STYLE.rule, width: 1 } });
  addShape(slide, x, y, w, 6, STYLE.accent);
  addText(slide, heading, x + 18, y + 18, w - 36, 18, { size: 10, color: STYLE.accent, bold: true });
}

function drawNarrative(slide, items, x, y, w, h) {
  drawAuthoredPanel(slide, x, y, w, h, "讲解逻辑");
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

function authoredStorySlide(presentation, direction, storySlide, page) {
  const slide = presentation.slides.add();
  const paper = paperByKey(direction, storySlide.paper_key);
  const label = authoredLabel(storySlide.slide_type);
  const slideTitle = paper ? `${paper.title}：${label}` : `${direction.direction}：${label}`;
  bg(slide);
  kicker(slide, label);
  title(slide, slideTitle, 58, 78, 1060, 58, paper ? 24 : 28);
  addText(slide, paper ? `${paper.key}   ${paper.evidence}   ${paper.source_status}` : `${direction._directory}   authored story   local evidence synthesis`, 58, 138, 1060, 18, {
    size: 9.2,
    color: STYLE.muted,
  });
  addText(slide, storySlide.claim, 58, 168, 1060, 58, { size: 19, color: STYLE.ink, bold: true });
  drawNarrative(slide, storySlide.narrative, 64, 260, 496, 320);
  drawAuthoredProof(slide, storySlide.proof_object || {}, 610, 236, 570, 352);
  drawSourceNote(slide, storySlide.source_note || "");
  footer(slide, page, `${direction.direction} | ${storySlide.slide_id}`);
  return slide;
}

function authoredDirectionSlides(presentation, direction, pageStart) {
  let page = pageStart;
  const slides = [];
  const storySlides = Array.isArray(direction._story?.slides) ? direction._story.slides : [];
  for (const storySlide of storySlides) {
    slides.push(authoredStorySlide(presentation, direction, storySlide, page++));
  }
  return { slides, nextPage: page };
}

function finalSlide(presentation, page) {
  const slide = presentation.slides.add();
  bg(slide);
  kicker(slide, "Delivery contract");
  title(slide, "每页都保留证据等级，并只写当前证据能支撑的结论。", 58, 84, 920, 88, 34);
  visualStack(slide, "内容契约", [
    "每篇主讲材料固定 5 页。",
    "每方向固定 3 篇主讲材料，辅助材料只作对比。",
    "Beamer/PDF 与 PPTX 从 papers.yml/story.yml 生成。",
  ], 92, 232, 430, 310);
  visualStack(slide, "证据约束", [
    "draft/not ratified 不写成量产标准。",
    "spec/survey 页面必须写“无新实验”。",
    "性能数据只来自本地 PDF 或官方来源。",
    "source-limited 只写来源状态。",
  ], 690, 232, 430, 310);
  footer(slide, page, "Global constraints");
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

  for (const direction of deck) {
    if (direction._story?.slides) {
      const authored = authoredDirectionSlides(presentation, direction, page);
      slides.push(...authored.slides);
      page = authored.nextPage;
    } else {
      slides.push(directionIntro(presentation, direction, page++));
      for (const paper of direction.primary) {
        for (const slideKey of ["summary", "background", "solution", "experiments"]) {
          slides.push(paperSlide(presentation, direction, paper, slideKey, page++));
        }
        slides.push(evaluationSlide(presentation, direction, paper, page++));
      }
      slides.push(directionSummary(presentation, direction, page++));
    }
  }
  if (!only) {
    slides.push(finalSlide(presentation, page++));
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
