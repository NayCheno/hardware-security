#!/usr/bin/env node

import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { detailedDirections } from "./content.mjs";
import { deck as teeTaxonomyDeck } from "../01-tee-taxonomy/detailed-source.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const DEFAULT_OUT = path.join(ROOT, "report-slide", "output", "hardware-security-report-slide-detailed-02-15.pptx");
const SLIDE_SIZE = { width: 1280, height: 720 };
const STYLE = {
  bg: "#FFFFFF",
  ink: "#101828",
  soft: "#344054",
  muted: "#667085",
  rule: "#D9D9D9",
  red: "#B42318",
  gold: "#B54708",
  blue: "#175CD3",
  green: "#027A48",
  body: "Microsoft YaHei",
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
  if (!fsSync.existsSync(entrypoint)) throw new Error(`@oai/artifact-tool entrypoint not found: ${entrypoint}`);
  return import(pathToFileURL(entrypoint).href);
}

function frame(left, top, width, height) {
  return { left, top, width, height };
}

function shape(slide, left, top, width, height, fill, options = {}) {
  return slide.shapes.add({
    geometry: options.geometry || "rect",
    position: frame(left, top, width, height),
    fill,
    line: options.line || { style: "solid", fill: "#00000000", width: 0 },
  });
}

function text(slide, value, left, top, width, height, options = {}) {
  const node = shape(slide, left, top, width, height, options.fill || "#00000000", {
    line: options.line || { style: "solid", fill: "#00000000", width: 0 },
  });
  node.text = String(value ?? "");
  node.text.fontSize = options.size ?? 13;
  node.text.color = options.color ?? STYLE.ink;
  node.text.bold = Boolean(options.bold);
  node.text.typeface = options.face ?? STYLE.body;
  node.text.alignment = options.align ?? "left";
  node.text.verticalAlignment = options.valign ?? "top";
  node.text.insets = options.insets ?? { left: 0, right: 0, top: 0, bottom: 0 };
  return node;
}

function bg(slide) {
  shape(slide, 0, 0, SLIDE_SIZE.width, SLIDE_SIZE.height, STYLE.bg);
}

function line(slide, left, top, width, color = STYLE.rule, height = 1) {
  shape(slide, left, top, width, height, color);
}

function list(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function fitFont(value, base, floor = 18) {
  const length = String(value || "").length;
  if (length > 90) return Math.max(floor, base - 6);
  if (length > 66) return Math.max(floor, base - 4);
  if (length > 44) return Math.max(floor, base - 2);
  return base;
}

function clampText(value, max = 138) {
  const textValue = String(value || "").replace(/\s+/g, " ").trim();
  if (textValue.length <= max) return textValue;
  return `${textValue.slice(0, max - 3).trimEnd()}...`;
}

function claimTakeaway(value) {
  const cleaned = String(value || "").replace(/^[^:：]{1,18}[:：]\s*/, "").trim();
  return clampText(cleaned || value, 178);
}

function stripLeadCue(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/^\s*(动机|工作|数据|背景|做法|边界|结论|核心|证据|定位|价值|限制|优势|局限)[:：]\s*/u, "")
    .trim();
}

function logicItems(data) {
  const body = list(data.body);
  const evidence = String(data.evidence_refs || "local README / paper.pdf");
  return [
    {
      label: "背景",
      text: stripLeadCue(body[0] || data.claim),
      color: STYLE.red,
      fill: "#FEE4E2",
    },
    {
      label: "做法",
      text: stripLeadCue(body[1] || body[0] || data.claim),
      color: STYLE.blue,
      fill: "#D1E9FF",
    },
    {
      label: "证据边界",
      text: stripLeadCue(body[2] || body[body.length - 1] || evidence),
      color: STYLE.gold,
      fill: "#FEF0C7",
    },
  ];
}

function header(slide, kicker, page, sectionTitle) {
  shape(slide, 48, 34, 16, 6, STYLE.red);
  text(slide, String(kicker || "").toUpperCase(), 72, 27, 470, 20, { size: 9.2, color: STYLE.muted, bold: true });
  text(slide, sectionTitle || "Hardware Security Report Slide", 910, 27, 322, 18, { size: 8.8, color: STYLE.muted, align: "right" });
  line(slide, 48, 54, 1184);
  text(slide, String(page), 1190, 688, 42, 16, { size: 8.8, color: "#98A2B3", align: "right" });
}

function footer(slide, source, id) {
  line(slide, 48, 650, 1184);
  text(slide, `Evidence refs: ${source || "local README / paper.pdf"}`, 48, 660, 1088, 22, { size: 7.4, color: STYLE.muted });
  text(slide, id, 48, 688, 760, 14, { size: 7.2, color: STYLE.muted });
}

function bullets(slide, items, left, top, width, options = {}) {
  const clean = list(items).slice(0, options.limit ?? 4);
  const gap = options.gap ?? Math.min(88, 310 / Math.max(clean.length, 1));
  clean.forEach((item, index) => {
    const y = top + index * gap;
    shape(slide, left, y + 7, 6, 6, index % 2 ? STYLE.gold : STYLE.red);
    text(slide, item, left + 20, y - 2, width - 20, gap - 8, {
      size: options.size ?? 13.4,
      color: STYLE.ink,
      bold: index === 0 && options.boldFirst,
    });
  });
}

function panelTitle(slide, value, left, top, width, color = STYLE.red) {
  text(slide, value, left, top, width, 18, { size: 9.4, color, bold: true });
  line(slide, left, top + 24, width, "#E4E7EC");
}

function drawLogicPanel(slide, data, left, top, width, height) {
  shape(slide, left, top, width, height, "#FFFFFF", { line: { style: "solid", fill: "#D0D5DD", width: 1 } });
  text(slide, "内容说明", left + 14, top + 12, width - 28, 18, { size: 9.4, color: STYLE.red, bold: true });
  line(slide, left + 14, top + 38, width - 28, "#E4E7EC");
  const items = logicItems(data);
  const rowH = (height - 58) / items.length;
  items.forEach((item, index) => {
    const y = top + 52 + index * rowH;
    shape(slide, left + 16, y, 34, 24, item.fill, { line: { style: "solid", fill: "#D0D5DD", width: 0.7 } });
    text(slide, String(index + 1), left + 16, y + 5, 34, 12, { size: 8.8, color: item.color, bold: true, align: "center" });
    text(slide, item.label, left + 62, y - 1, width - 78, 16, { size: 8.8, color: item.color, bold: true });
    text(slide, clampText(item.text, 205), left + 62, y + 19, width - 86, rowH - 27, {
      size: fitFont(item.text, 10.2, 8.1),
      color: STYLE.ink,
    });
  });
}

function drawTakeaway(slide, data, left, top, width, height) {
  shape(slide, left, top, width, height, "#F8FAFC", { line: { style: "solid", fill: "#D0D5DD", width: 1 } });
  text(slide, "本页结论", left + 14, top + 10, 82, 16, { size: 8.8, color: STYLE.green, bold: true });
  text(slide, claimTakeaway(data.claim), left + 104, top + 8, width - 118, height - 16, {
    size: fitFont(data.claim, 10.4, 8.4),
    color: STYLE.soft,
    bold: true,
    valign: "middle",
  });
}

function drawCards(slide, title, items, left, top, width, height) {
  shape(slide, left, top, width, height, "#FFFFFF", { line: { style: "solid", fill: "#D0D5DD", width: 1 } });
  text(slide, title, left + 14, top + 12, width - 28, 18, { size: 9.2, color: STYLE.red, bold: true });
  const clean = list(items).slice(0, 8);
  const cols = clean.length > 4 ? 2 : 1;
  const cardW = (width - 36 - (cols - 1) * 12) / cols;
  const cardH = Math.min(52, (height - 56 - (Math.ceil(clean.length / cols) - 1) * 10) / Math.max(1, Math.ceil(clean.length / cols)));
  clean.forEach((item, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x = left + 16 + col * (cardW + 12);
    const y = top + 44 + row * (cardH + 10);
    const fill = ["#FEE4E2", "#FEF0C7", "#D1E9FF", "#D1FADF"][index % 4];
    const color = [STYLE.red, STYLE.gold, STYLE.blue, STYLE.green][index % 4];
    shape(slide, x, y, cardW, cardH, fill);
    text(slide, item, x + 10, y + 8, cardW - 20, cardH - 14, { size: 10, color, bold: true, valign: "middle" });
  });
}

function drawFlow(slide, title, items, left, top, width, height) {
  shape(slide, left, top, width, height, "#FFFFFF", { line: { style: "solid", fill: "#D0D5DD", width: 1 } });
  text(slide, title, left + 14, top + 12, width - 28, 18, { size: 9.2, color: STYLE.blue, bold: true });
  const clean = list(items).slice(0, 8);
  const rowH = Math.min(44, (height - 54) / Math.max(clean.length, 1));
  clean.forEach((item, index) => {
    const y = top + 42 + index * rowH;
    shape(slide, left + 18, y, 32, 22, index % 2 ? "#FEF0C7" : "#D1E9FF", {
      line: { style: "solid", fill: index % 2 ? "#FEDF89" : "#84CAFF", width: 1 },
    });
    text(slide, String(index + 1), left + 24, y + 4, 20, 12, { size: 9.5, color: index % 2 ? STYLE.gold : STYLE.blue, align: "center", bold: true });
    text(slide, item, left + 66, y - 1, width - 88, rowH - 8, { size: 10.5, color: STYLE.ink, bold: index === 0 });
    if (index < clean.length - 1) line(slide, left + 34, y + 24, 1, "#D0D5DD", Math.max(6, rowH - 26));
  });
}

function drawMatrix(slide, title, rows, left, top, width, height) {
  shape(slide, left, top, width, height, "#FFFFFF", { line: { style: "solid", fill: "#D0D5DD", width: 1 } });
  text(slide, title, left + 14, top + 12, width - 28, 18, { size: 9.2, color: STYLE.red, bold: true });
  const clean = Array.isArray(rows) ? rows.slice(0, 7) : [];
  const rowH = Math.min(42, (height - 54) / Math.max(clean.length, 1));
  clean.forEach((row, index) => {
    const y = top + 44 + index * rowH;
    const cells = Array.isArray(row) ? row : [row];
    shape(slide, left + 14, y - 2, width - 28, rowH - 1, index % 2 ? "#FFFFFF" : "#F2F4F7");
    const firstW = width * 0.32;
    text(slide, cells[0] || "", left + 20, y + 4, firstW - 18, rowH - 8, { size: 8.4, color: STYLE.ink, bold: true });
    text(slide, cells.slice(1).join(" / "), left + firstW, y + 4, width - firstW - 26, rowH - 8, { size: 8.2, color: STYLE.soft });
  });
}

function drawBars(slide, title, metrics, left, top, width, height) {
  shape(slide, left, top, width, height, "#FFFFFF", { line: { style: "solid", fill: "#D0D5DD", width: 1 } });
  text(slide, title, left + 14, top + 12, width - 28, 18, { size: 9.2, color: STYLE.gold, bold: true });
  const clean = Array.isArray(metrics) ? metrics.slice(0, 6) : [];
  const rowH = Math.min(48, (height - 56) / Math.max(clean.length, 1));
  clean.forEach((metric, index) => {
    const y = top + 46 + index * rowH;
    const value = Math.max(4, Math.min(100, Number(metric.bar ?? 50)));
    text(slide, metric.label || "", left + 20, y - 2, 230, 18, { size: 8.8, bold: true });
    shape(slide, left + 260, y + 4, width - 390, 10, "#EAECF0");
    shape(slide, left + 260, y + 4, (width - 390) * (value / 100), 10, index % 2 ? STYLE.gold : STYLE.red);
    text(slide, metric.value || "", left + width - 116, y - 4, 92, 18, { size: 9.4, color: index % 2 ? STYLE.gold : STYLE.red, bold: true, align: "right" });
  });
}

function drawProof(slide, proof, left = 640, top = 174, width = 548, height = 412) {
  const object = proof || {};
  if (object.type === "matrix") return drawMatrix(slide, object.title || "图文证据", object.rows || object.items, left, top, width, height);
  if (object.type === "bars") return drawBars(slide, object.title || "关键数字", object.metrics || object.items, left, top, width, height);
  if (object.type === "cards") return drawCards(slide, object.title || "图文证据", object.items, left, top, width, height);
  return drawFlow(slide, object.title || "机制路径", object.items || object.steps || [], left, top, width, height);
}

function normalSlide(presentation, data, page) {
  const slide = presentation.slides.add();
  bg(slide);
  header(slide, data.kicker, page, data.sectionTitle);
  text(slide, data.title, 48, 76, 1040, 42, { size: fitFont(data.title, 28, 21), bold: true });
  text(slide, data.claim, 48, 128, 1138, 38, { size: fitFont(data.claim, 13.5, 10.6), color: STYLE.soft, bold: true });
  drawLogicPanel(slide, data, 58, 188, 520, 330);
  drawTakeaway(slide, data, 58, 540, 520, 66);
  drawProof(slide, data.proof, 640, 174, 548, 432);
  footer(slide, data.evidence_refs, data.id);
  return slide;
}

function titleSlide(presentation, data, page) {
  const slide = presentation.slides.add();
  bg(slide);
  text(slide, data.title, 120, 122, 1040, 128, { size: fitFont(data.title, 29, 20), bold: true, align: "center", valign: "middle" });
  text(slide, data.authors, 150, 276, 980, 38, { size: 12.5, color: STYLE.soft, bold: true, align: "center" });
  text(slide, data.venue, 150, 330, 980, 28, { size: 13.4, color: STYLE.red, bold: true, align: "center" });
  line(slide, 340, 374, 600);
  drawCards(slide, "为什么放在本方向", data.body?.slice(0, 4) || [], 210, 410, 390, 138);
  panelTitle(slide, "这篇论文/规范的角色", 700, 414, 340);
  bullets(slide, data.roleItems || [], 704, 452, 340, { size: 10.4, gap: 31, limit: 4 });
  footer(slide, data.evidence_refs, data.id);
  text(slide, String(page), 1190, 688, 42, 16, { size: 8.8, color: "#98A2B3", align: "right" });
  return slide;
}

function directionIntro(direction) {
  return {
    id: `${direction.id}-00-category`,
    kicker: "CATEGORY",
    sectionTitle: direction.title,
    title: direction.title,
    claim: direction.claim,
    body: direction.background,
    evidence_refs: direction.evidence,
    proof: { type: "flow", title: "理解路径", items: direction.path },
  };
}

function directionKey(direction) {
  return {
    id: `${direction.id}-01-key-papers`,
    kicker: "SOTA MAP",
    sectionTitle: direction.title,
    title: "本分类关键点与三篇 SOTA 的分工",
    claim: direction.keyClaim,
    body: direction.keyPoints,
    evidence_refs: direction.evidence,
    proof: {
      type: "matrix",
      title: "三篇材料在本方向中的职责",
      rows: direction.papers.map((paper) => [paper.short || paper.key, paper.role, paper.primaryContribution, paper.boundary]),
    },
  };
}

function paperSlides(direction, paper) {
  const base = `${direction.id}-${paper.key}`;
  const sectionTitle = direction.title;
  const title = {
    id: `${base}-title`,
    layout: "title",
    title: paper.title,
    authors: paper.authors,
    venue: paper.venue,
    roleItems: [`定位: ${paper.role}`, `主贡献: ${paper.primaryContribution}`, `边界: ${paper.boundary}`],
    body: [paper.primaryContribution, paper.boundary, paper.evidenceBase],
    evidence_refs: paper.titleEvidence || paper.evidenceBase,
  };
  const slides = [
    title,
    { id: `${base}-summary`, kicker: "CONTENT SUMMARY", sectionTitle, title: "内容摘要", ...paper.summary },
    { id: `${base}-background`, kicker: "BACKGROUND", sectionTitle, title: "研究背景", ...paper.background },
    { id: `${base}-core`, kicker: "CORE IDEA", sectionTitle, title: "核心洞察", ...paper.core },
    { id: `${base}-architecture`, kicker: "ARCHITECTURE", sectionTitle, title: paper.architecture.title || "架构总览", ...paper.architecture },
  ];
  paper.methods.forEach((method, index) => {
    slides.push({
      id: `${base}-method-${index + 1}`,
      kicker: `METHOD ${index + 1}`,
      sectionTitle,
      title: `核心方法${["一", "二", "三", "四", "五"][index] || index + 1}：${method.title}`,
      ...method,
    });
  });
  slides.push({ id: `${base}-evidence`, kicker: "EVIDENCE", sectionTitle, title: "实验环境与证据基础", ...paper.evidenceEnv });
  slides.push({ id: `${base}-performance`, kicker: "PERFORMANCE / DATA", sectionTitle, title: "性能与 Claim Strength 边界", ...paper.performance });
  slides.push({ id: `${base}-evaluation`, kicker: "EVALUATION", sectionTitle, title: "文章评价", ...paper.evaluation });
  return slides;
}

function expandDirections(include01 = false) {
  const slides = [];
  if (include01) slides.push(...teeTaxonomyDeck.slides);
  for (const direction of detailedDirections) {
    slides.push(directionIntro(direction), directionKey(direction));
    direction.papers.forEach((paper) => slides.push(...paperSlides(direction, paper)));
  }
  return slides;
}

function validate(slides) {
  const ids = new Set();
  for (const [index, slide] of slides.entries()) {
    const required = slide.layout === "title"
      ? ["id", "title", "authors", "venue", "body", "evidence_refs"]
      : ["id", "title", "claim", "body", "evidence_refs", "proof"];
    for (const field of required) {
      if (!slide[field] || (Array.isArray(slide[field]) && !slide[field].length)) {
        throw new Error(`Slide ${index + 1} missing ${field}: ${slide.id}`);
      }
    }
    if (ids.has(slide.id)) throw new Error(`Duplicate slide id: ${slide.id}`);
    ids.add(slide.id);
  }
}

async function saveBlob(blob, outputPath) {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, Buffer.from(await blob.arrayBuffer()));
}

async function renderPreviews(presentation, slides, previewDir, limitArg) {
  if (!previewDir) return [];
  await fs.mkdir(previewDir, { recursive: true });
  const limit = limitArg === "all" || limitArg === true ? slides.length : Number.parseInt(limitArg || String(slides.length), 10);
  const count = Number.isFinite(limit) ? Math.min(limit, slides.length) : slides.length;
  const paths = [];
  for (let index = 0; index < count; index += 1) {
    const png = await presentation.export({ slide: slides[index], format: "png", scale: 0.72 });
    const previewPath = path.join(previewDir, `slide-${String(index + 1).padStart(3, "0")}.png`);
    await saveBlob(png, previewPath);
    paths.push(previewPath);
  }
  return paths;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const include01 = Boolean(args.include01);
  const out = path.resolve(String(args.out || DEFAULT_OUT));
  const previewDir = args.preview ? path.resolve(String(args.preview)) : undefined;
  let expanded = expandDirections(include01);
  if (args.only) {
    const only = String(args.only);
    expanded = expanded.filter((slide) => slide.id.startsWith(`${only}-`) || slide.id.startsWith(only));
  }
  validate(expanded);
  const artifact = await importArtifactTool();
  const { Presentation, PresentationFile } = artifact;
  const presentation = Presentation.create({ slideSize: SLIDE_SIZE });
  const slides = expanded.map((slide, index) => slide.layout === "title"
    ? titleSlide(presentation, slide, index + 1)
    : normalSlide(presentation, slide, index + 1));
  await fs.mkdir(path.dirname(out), { recursive: true });
  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(out);
  const stat = await fs.stat(out);
  const previews = await renderPreviews(presentation, slides, previewDir, args["preview-limit"]);
  const manifest = {
    output: out,
    outputBytes: stat.size,
    slideCount: presentation.slides.count,
    expectedSlideCount: expanded.length,
    include01,
    directionCount: detailedDirections.length + (include01 ? 1 : 0),
    previewDir,
    previewCount: previews.length,
  };
  const manifestPath = path.join(path.dirname(out), path.basename(out, ".pptx") + "-manifest.json");
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ ...manifest, manifestPath }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
