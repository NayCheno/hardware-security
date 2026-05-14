#!/usr/bin/env node

import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { deck } from "./detailed-source.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const DEFAULT_OUT = path.join(ROOT, "report-slide", "output", "01-tee-taxonomy-detailed.pptx");
const SLIDE_SIZE = { width: 1280, height: 720 };

const STYLE = {
  bg: "#FFFFFF",
  ink: "#101828",
  soft: "#475467",
  muted: "#667085",
  faint: "#F8FAFC",
  panel: "#F9FAFB",
  panel2: "#FFF7ED",
  panel3: "#F0F9FF",
  rule: "#D0D5DD",
  red: "#B42318",
  redSoft: "#FEE4E2",
  gold: "#B54708",
  goldSoft: "#FEF0C7",
  green: "#027A48",
  greenSoft: "#D1FADF",
  blue: "#175CD3",
  blueSoft: "#D1E9FF",
  purple: "#6941C6",
  body: "Microsoft YaHei",
  display: "Georgia",
};

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (!key.startsWith("--")) throw new Error(`Unexpected argument: ${key}`);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key.slice(2)] = true;
    } else {
      args[key.slice(2)] = next;
      i += 1;
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
  if (!fsSync.existsSync(entrypoint)) throw new Error(`@oai/artifact-tool entrypoint not found: ${entrypoint}`);
  return import(pathToFileURL(entrypoint).href);
}

function frame(left, top, width, height) {
  return { left, top, width, height };
}

function addShape(slide, left, top, width, height, fill, options = {}) {
  return slide.shapes.add({
    geometry: options.geometry || "rect",
    name: options.name,
    position: frame(left, top, width, height),
    fill,
    line: options.line || { style: "solid", fill: "#00000000", width: 0 },
  });
}

function addText(slide, text, left, top, width, height, options = {}) {
  const shape = addShape(slide, left, top, width, height, options.fill || "#00000000", {
    line: options.line || { style: "solid", fill: "#00000000", width: 0 },
    name: options.name,
  });
  shape.text = String(text ?? "");
  shape.text.fontSize = options.size ?? 14;
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

function rule(slide, left, top, width, color = STYLE.rule, height = 1) {
  addShape(slide, left, top, width, height, color);
}

function asList(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function fitFont(text, base, floor = 22, thresholds = []) {
  const chars = String(text || "").length;
  let size = base;
  for (const [limit, next] of thresholds) {
    if (chars > limit) size = next;
  }
  return Math.max(floor, size);
}

function header(slide, slideData, index) {
  addShape(slide, 48, 34, 16, 6, STYLE.red);
  addText(slide, String(slideData.kicker || "").toUpperCase(), 72, 27, 470, 20, {
    size: 9.2,
    color: STYLE.muted,
    bold: true,
  });
  addText(slide, deck.title, 910, 27, 322, 18, {
    size: 8.8,
    color: STYLE.muted,
    align: "right",
  });
  rule(slide, 48, 54, 1184, "#D9D9D9");
  addText(slide, String(index + 1), 1190, 688, 42, 16, {
    size: 8.8,
    color: "#98A2B3",
    align: "right",
  });
}

function sourceNote(slide, slideData) {
  rule(slide, 48, 650, 1184, "#D9D9D9");
  addText(slide, `Evidence refs: ${slideData.evidence_refs}`, 48, 660, 1088, 22, {
    size: 7.5,
    color: STYLE.muted,
  });
  addText(slide, slideData.id, 48, 688, 780, 14, {
    size: 7.2,
    color: STYLE.muted,
  });
}

function panel(slide, left, top, width, height, title, options = {}) {
  if (options.fill !== "none") {
    addShape(slide, left, top, width, height, options.fill || "#FFFFFF", {
      line: { style: "solid", fill: options.line || "#D9D9D9", width: 1 },
    });
  }
  addText(slide, title, left + 10, top + 8, width - 20, 18, {
    size: 9.2,
    color: options.titleColor || STYLE.red,
    bold: true,
  });
}

function drawBullets(slide, items, left, top, width, options = {}) {
  const clean = asList(items).slice(0, options.limit ?? 4);
  const size = options.size ?? 15;
  const gap = options.gap ?? 70;
  clean.forEach((item, i) => {
    const y = top + i * gap;
    addShape(slide, left, y + 7, 6, 6, i % 2 ? STYLE.gold : STYLE.red);
    addText(slide, item, left + 20, y - 2, width - 20, gap - 8, {
      size,
      color: STYLE.ink,
      bold: i === 0 && options.boldFirst,
    });
  });
}

function drawNarrative(slide, slideData, left = 60, top = 184, width = 520, height = 400) {
  addText(slide, "讲解要点", left, top, width, 18, {
    size: 10,
    color: STYLE.red,
    bold: true,
  });
  rule(slide, left, top + 24, width - 28, "#E4E7EC");
  drawBullets(slide, slideData.body, left + 4, top + 52, width - 8, {
    size: 14.1,
    gap: Math.min(92, (height - 82) / Math.max(asList(slideData.body).length, 1)),
  });
}

function drawFlow(slide, proof, left, top, width, height) {
  panel(slide, left, top, width, height, proof.title || "Proof object", { fill: "#FFFFFF", line: "#D0D5DD", titleColor: STYLE.blue });
  const stages = asList(proof.stages).slice(0, 7);
  const stepH = Math.min(48, (height - 60) / Math.max(stages.length, 1));
  stages.forEach((stage, i) => {
    const y = top + 42 + i * stepH;
    addShape(slide, left + 18, y, 34, 24, i % 2 ? STYLE.goldSoft : STYLE.blueSoft, {
      line: { style: "solid", fill: i % 2 ? "#FEDF89" : "#84CAFF", width: 1 },
    });
    addText(slide, String(i + 1), left + 24, y + 4, 22, 14, {
      size: 10.5,
      color: i % 2 ? STYLE.gold : STYLE.blue,
      align: "center",
      bold: true,
    });
    addText(slide, stage, left + 66, y - 1, width - 88, stepH - 8, {
      size: 11.5,
      color: STYLE.ink,
      bold: i === 0,
    });
    if (i < stages.length - 1) rule(slide, left + 35, y + 26, 1, "#D0D5DD", Math.max(8, stepH - 28));
  });
}

function drawCards(slide, proof, left, top, width, height) {
  panel(slide, left, top, width, height, proof.title || "Proof object", { fill: "#FFFFFF", line: "#D0D5DD" });
  const items = asList(proof.items).slice(0, 6);
  const cols = items.length > 4 ? 3 : 2;
  const rows = Math.ceil(items.length / cols);
  const cardW = (width - 40 - (cols - 1) * 12) / cols;
  const cardH = Math.min(88, (height - 70 - (rows - 1) * 12) / Math.max(rows, 1));
  items.forEach((item, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = left + 16 + col * (cardW + 12);
    const y = top + 46 + row * (cardH + 12);
    const fill = [STYLE.redSoft, STYLE.goldSoft, STYLE.greenSoft, STYLE.blueSoft, "#F4EBFF", "#EAECF0"][i % 6];
    const color = [STYLE.red, STYLE.gold, STYLE.green, STYLE.blue, STYLE.purple, STYLE.soft][i % 6];
    addShape(slide, x, y, cardW, cardH, fill, { line: { style: "solid", fill: "#FFFFFF", width: 1 } });
    addText(slide, item, x + 12, y + 12, cardW - 24, cardH - 22, {
      size: 11.5,
      color,
      bold: true,
      valign: "middle",
    });
  });
}

function drawMatrix(slide, proof, left, top, width, height) {
  panel(slide, left, top, width, height, proof.title || "Proof object", { fill: "#FFFFFF", line: "#D0D5DD" });
  const columns = asList(proof.columns).slice(0, 4);
  const rows = Array.isArray(proof.rows) ? proof.rows.slice(0, 6) : [];
  const colCount = Math.max(columns.length, 1);
  const rowH = Math.min(42, (height - 92) / Math.max(rows.length, 1));
  const colW = (width - 40) / colCount;
  columns.forEach((col, i) => {
    addText(slide, col, left + 20 + i * colW, top + 44, colW - 10, 24, {
      size: colCount > 3 ? 8.2 : 9.2,
      color: STYLE.red,
      bold: true,
    });
  });
  rows.forEach((row, r) => {
    const y = top + 74 + r * rowH;
    addShape(slide, left + 18, y - 4, width - 36, rowH - 2, r % 2 ? "#FFFFFF" : "#F2F4F7", {
      line: { style: "solid", fill: "#00000000", width: 0 },
    });
    const cells = Array.isArray(row) ? row : [row];
    for (let c = 0; c < colCount; c += 1) {
      addText(slide, cells[c] || "", left + 22 + c * colW, y + 3, colW - 10, rowH - 8, {
        size: colCount > 3 ? 7.8 : 8.7,
        color: c === 0 ? STYLE.ink : STYLE.soft,
        bold: c === 0,
      });
    }
  });
}

function drawBars(slide, proof, left, top, width, height) {
  panel(slide, left, top, width, height, proof.title || "Proof object", { fill: "#FFFFFF", line: "#D0D5DD", titleColor: STYLE.gold });
  const metrics = Array.isArray(proof.metrics) ? proof.metrics.slice(0, 6) : [];
  const rowH = Math.min(50, (height - 72) / Math.max(metrics.length, 1));
  metrics.forEach((metric, i) => {
    const y = top + 52 + i * rowH;
    const bar = Math.max(0, Math.min(100, Number(metric.bar) || 0));
    addText(slide, metric.label, left + 20, y - 2, 250, 22, {
      size: 9.4,
      color: STYLE.ink,
      bold: true,
    });
    addShape(slide, left + 288, y + 5, width - 410, 12, "#EAECF0");
    addShape(slide, left + 288, y + 5, (width - 410) * (bar / 100), 12, i % 2 ? STYLE.gold : STYLE.red);
    addText(slide, metric.value, left + width - 110, y - 2, 86, 22, {
      size: 11.8,
      color: i % 2 ? STYLE.gold : STYLE.red,
      bold: true,
      align: "right",
    });
  });
}

function drawTimeline(slide, proof, left, top, width, height) {
  panel(slide, left, top, width, height, proof.title || "Proof object", { fill: "#FFFFFF", line: "#D0D5DD", titleColor: STYLE.blue });
  const rawItems = Array.isArray(proof.items) ? proof.items : proof.steps;
  const items = Array.isArray(rawItems) ? rawItems.slice(0, 6) : [];
  const midY = top + height / 2 + 18;
  rule(slide, left + 34, midY, width - 68, STYLE.blue, 3);
  const gap = (width - 86) / Math.max(items.length - 1, 1);
  items.forEach((item, i) => {
    const x = left + 38 + i * gap;
    const year = typeof item === "string" ? "" : item.year || item.label || "";
    const label = typeof item === "string" ? item : item.text || item.label || "";
    addShape(slide, x - 6, midY - 6, 12, 12, i % 2 ? STYLE.gold : STYLE.blue);
    addText(slide, year, x - 36, midY - 52, 72, 18, {
      size: 11.5,
      color: i % 2 ? STYLE.gold : STYLE.blue,
      bold: true,
      align: "center",
    });
    addText(slide, label, x - 50, midY + 18, 100, 54, {
      size: 9.6,
      color: STYLE.ink,
      bold: true,
      align: "center",
    });
  });
}

function drawArchitecture(slide, proof, left, top, width, height) {
  panel(slide, left, top, width, height, proof.title || "Proof object", { fill: "#FFFFFF", line: "#D0D5DD" });
  const lanes = Array.isArray(proof.lanes) ? proof.lanes.slice(0, 3) : [];
  const laneH = Math.min(86, (height - 72) / Math.max(lanes.length, 1));
  lanes.forEach((lane, i) => {
    const y = top + 46 + i * (laneH + 10);
    const fill = [STYLE.redSoft, STYLE.blueSoft, STYLE.greenSoft][i % 3];
    const color = [STYLE.red, STYLE.blue, STYLE.green][i % 3];
    addShape(slide, left + 20, y, 128, laneH, fill, {
      line: { style: "solid", fill: "#FFFFFF", width: 1 },
    });
    addText(slide, lane.label, left + 32, y + 18, 104, laneH - 28, {
      size: 11,
      color,
      bold: true,
      valign: "middle",
      align: "center",
    });
    const nodes = asList(lane.nodes).slice(0, 5);
    const nodeW = (width - 188) / Math.max(nodes.length, 1);
    nodes.forEach((node, j) => {
      const x = left + 170 + j * nodeW;
      addShape(slide, x, y + 16, nodeW - 12, laneH - 32, STYLE.panel, {
        line: { style: "solid", fill: STYLE.rule, width: 1 },
      });
      addText(slide, node, x + 8, y + 24, nodeW - 28, laneH - 48, {
        size: 9.4,
        color: STYLE.ink,
        bold: j === 0,
        valign: "middle",
        align: "center",
      });
      if (j < nodes.length - 1) rule(slide, x + nodeW - 14, y + laneH / 2, 14, STYLE.rule, 2);
    });
  });
}

function drawProof(slide, proof, left = 620, top = 214, width = 602, height = 392) {
  if (!proof || !proof.type) {
    panel(slide, left, top, width, height, "Proof object");
    return;
  }
  if (proof.type === "flow") return drawFlow(slide, proof, left, top, width, height);
  if (proof.type === "matrix") return drawMatrix(slide, proof, left, top, width, height);
  if (proof.type === "bars") return drawBars(slide, proof, left, top, width, height);
  if (proof.type === "timeline") return drawTimeline(slide, proof, left, top, width, height);
  if (proof.type === "cards") return drawCards(slide, proof, left, top, width, height);
  if (proof.type === "architecture") return drawArchitecture(slide, proof, left, top, width, height);
  return drawCards(slide, { title: proof.title || "Proof object", items: asList(proof.items || proof.stages) }, left, top, width, height);
}

function titleSlide(presentation, slideData, index) {
  const slide = presentation.slides.add();
  bg(slide);
  const [authors, venue] = String(slideData.claim || "").split("·").map((part) => part.trim());
  addText(slide, slideData.title, 120, 132, 1040, 118, {
    size: fitFont(slideData.title, 29, 22, [[80, 27], [110, 24], [140, 22]]),
    color: STYLE.ink,
    bold: true,
    align: "center",
    valign: "middle",
  });
  addText(slide, authors || slideData.claim, 170, 278, 940, 36, {
    size: 13,
    color: STYLE.soft,
    bold: true,
    align: "center",
  });
  addText(slide, venue || "", 170, 326, 940, 26, {
    size: 14,
    color: STYLE.red,
    bold: true,
    align: "center",
  });
  rule(slide, 360, 374, 560, "#D9D9D9");
  drawCards(slide, slideData.proof, 220, 410, 390, 140);
  addText(slide, "这篇论文在 01 中的用途", 700, 414, 320, 18, { size: 10, color: STYLE.red, bold: true });
  drawBullets(slide, slideData.body, 704, 452, 340, { size: 10.5, gap: 31, limit: 4 });
  sourceNote(slide, slideData);
  addText(slide, String(index + 1), 1190, 688, 42, 16, { size: 8.8, color: "#98A2B3", align: "right" });
  return slide;
}

function normalSlide(presentation, slideData, index) {
  const slide = presentation.slides.add();
  bg(slide);
  header(slide, slideData, index);
  const titleSize = fitFont(slideData.title, 28, 22, [[32, 26], [48, 24], [64, 22]]);
  addText(slide, slideData.title, 48, 76, 1040, 42, {
    size: titleSize,
    color: STYLE.ink,
    bold: true,
  });
  addText(slide, slideData.claim, 48, 128, 1138, 38, {
    size: fitFont(slideData.claim, 13.6, 10.8, [[80, 12.8], [120, 11.8], [160, 10.8]]),
    color: "#344054",
    bold: true,
  });
  drawNarrative(slide, slideData, 58, 188, 520, 410);
  drawProof(slide, slideData.proof, 640, 174, 548, 412);
  sourceNote(slide, slideData);
  return slide;
}

function validateDeck() {
  if (!deck || !Array.isArray(deck.slides)) throw new Error("detailed-source.mjs must export deck.slides.");
  const ids = new Set();
  for (const [index, slide] of deck.slides.entries()) {
    for (const field of ["id", "title", "claim", "body", "evidence_refs", "proof"]) {
      if (!slide[field] || (Array.isArray(slide[field]) && !slide[field].length)) {
        throw new Error(`Slide ${index + 1} missing required field: ${field}`);
      }
    }
    if (!Array.isArray(slide.body) || slide.body.length < 2) {
      throw new Error(`Slide ${slide.id} needs narrative body bullets.`);
    }
    if (ids.has(slide.id)) throw new Error(`Duplicate slide id: ${slide.id}`);
    ids.add(slide.id);
  }
}

async function saveBlob(blob, outputPath) {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, Buffer.from(await blob.arrayBuffer()));
}

async function renderPreviews(presentation, slides, previewDir) {
  if (!previewDir) return [];
  await fs.mkdir(previewDir, { recursive: true });
  const paths = [];
  for (let i = 0; i < slides.length; i += 1) {
    const png = await presentation.export({ slide: slides[i], format: "png", scale: 0.72 });
    const previewPath = path.join(previewDir, `slide-${String(i + 1).padStart(3, "0")}.png`);
    await saveBlob(png, previewPath);
    paths.push(previewPath);
  }
  return paths;
}

async function main() {
  validateDeck();
  const args = parseArgs(process.argv.slice(2));
  const out = path.resolve(String(args.out || DEFAULT_OUT));
  const previewDir = args.preview ? path.resolve(String(args.preview)) : undefined;
  const artifact = await importArtifactTool();
  const { Presentation, PresentationFile } = artifact;
  const presentation = Presentation.create({ slideSize: SLIDE_SIZE });
  const slides = deck.slides.map((slideData, index) => {
    return slideData.layout === "title"
      ? titleSlide(presentation, slideData, index)
      : normalSlide(presentation, slideData, index);
  });

  await fs.mkdir(path.dirname(out), { recursive: true });
  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(out);
  const stat = await fs.stat(out);
  const previews = await renderPreviews(presentation, slides, previewDir);
  const manifest = {
    title: deck.title,
    subtitle: deck.subtitle,
    output: out,
    outputBytes: stat.size,
    slideCount: presentation.slides.count,
    expectedSlideCount: deck.slides.length,
    previewDir,
    previewCount: previews.length,
    source: path.join(__dirname, "detailed-source.mjs"),
  };
  const manifestPath = path.join(path.dirname(out), "01-tee-taxonomy-detailed-manifest.json");
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ ...manifest, manifestPath }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
