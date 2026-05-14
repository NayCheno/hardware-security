import fs from "fs";
import path from "path";
import { detailedDirections } from "./content.mjs";

const repo = process.cwd();
const begin = "<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->";
const end = "<!-- END REPORT-SLIDE DETAILED ADDENDUM -->";

const manualPathByKey = {
  rogers2007bonsai: "reference/architecture-and-platform-security/address-independent-seed-encryption-bonsai-merkle-trees/README.md"
};

const readmeByKey = new Map();
const walk = (dir) => {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (ent.isFile() && ent.name === "README.md") {
      const text = fs.readFileSync(p, "utf8");
      const m = text.match(/BibTeX key:\s*`([^`]+)`/);
      if (m && !readmeByKey.has(m[1])) readmeByKey.set(m[1], p);
    }
  }
};
walk(path.join(repo, "reference"));
for (const [key, rel] of Object.entries(manualPathByKey)) {
  readmeByKey.set(key, path.join(repo, rel));
}

const escapeMd = (value) => String(value ?? "").replace(/\r\n/g, "\n").trim();
const bulletList = (items) => (items ?? []).map((item) => `- ${escapeMd(item)}`).join("\n");
const compact = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
const stripStop = (value) => compact(value).replace(/[。.!；;，,]+$/u, "");
const sentence = (prefix, value, fallback = "论文未说明") => `${prefix}${stripStop(value) || fallback}。`;

const proofText = (proof) => {
  if (!proof) return "- 论文未说明";
  if (proof.type === "flow") return `- Proof object: flow - ${proof.title}: ${(proof.items ?? []).join(" -> ")}`;
  if (proof.type === "cards") return `- Proof object: cards - ${proof.title}: ${(proof.items ?? []).join("; ")}`;
  if (proof.type === "matrix") return `- Proof object: matrix - ${proof.title}: ${(proof.rows ?? []).map((row) => row.join(" = ")).join("; ")}`;
  if (proof.type === "bars") return `- Proof object: bars - ${proof.title}: ${(proof.metrics ?? []).map((m) => `${m.label} ${m.value}`).join("; ")}`;
  return `- Proof object: ${proof.type ?? "unknown"} - ${proof.title ?? "论文未说明"}`;
};

const narrativeText = (slide) => {
  const body = (slide?.body ?? []).filter(Boolean).map(compact);
  const claim = compact(slide?.claim);
  const first = body[0] || claim || "论文未说明";
  const second = body[1] || body[0] || claim || "论文未说明";
  const third = body[2] || body[body.length - 1] || compact(slide?.evidence_refs) || "证据不足";
  const evidence = compact(slide?.evidence_refs) || "论文未说明";
  return [
    sentence("讲解时先把本页结论落到一句话: ", claim),
    sentence("第一步解释为什么需要这一页: ", first),
    sentence("第二步说明论文或规范实际做了什么: ", second),
    sentence("第三步收束到证据边界: ", third, "证据不足"),
    `引用时只把 ${stripStop(evidence) || "论文未说明"} 作为支撑范围，不把 survey/spec 的归纳扩展成未验证的一手机制或性能结论。`
  ].join("");
};

const section = (title, slide) => `### ${title}

**Claim:** ${escapeMd(slide?.claim)}

${bulletList(slide?.body)}

**讲解稿:** ${narrativeText(slide)}

**Evidence refs:** ${escapeMd(slide?.evidence_refs)}

${proofText(slide?.proof)}
`;

const methodSection = (methods) => (methods ?? []).map((method, idx) => `#### 方法 ${idx + 1}: ${escapeMd(method.title)}

**Claim:** ${escapeMd(method.claim)}

${bulletList(method.body)}

**讲解稿:** ${narrativeText(method)}

**Evidence refs:** ${escapeMd(method.evidence_refs)}

${proofText(method.proof)}
`).join("\n");

const paperAddendum = (direction, paper) => `## Report-Slide Detailed Addendum

### 所属方向

- Direction: \`${direction.id}\` - ${direction.title}
- Paper key: \`${paper.key}\`
- Role: ${escapeMd(paper.role)}
- Evidence base: ${escapeMd(paper.evidenceBase)}
- Boundary: ${escapeMd(paper.boundary)}

### 1. 完整题目 / 作者 / 会议

- 完整题目: ${escapeMd(paper.title)}
- 作者: ${escapeMd(paper.authors)}
- 会议/来源: ${escapeMd(paper.venue)}
- Title evidence: ${escapeMd(paper.titleEvidence)}

### 2. 内容摘要

${section("2.1 Slide-ready summary", paper.summary)}

### 3. 研究背景

${section("3.1 Slide-ready background", paper.background)}

### 4. 关键点核心思想

${section("4.1 Slide-ready core insight", paper.core)}

### 5. 架构总览

${section("5.1 Slide-ready architecture", paper.architecture)}

### 6. 核心方法拆解

${methodSection(paper.methods)}

### 7. 实验环境和数据 / 证据基础

${section("7.1 Slide-ready evidence environment", paper.evidenceEnv)}

### 8. 性能 / Claim Strength

${section("8.1 Slide-ready performance", paper.performance)}

### 9. 文章评价

${section("9.1 Slide-ready evaluation", paper.evaluation)}
`;

const grouped = new Map();
for (const direction of detailedDirections) {
  for (const paper of direction.papers) {
    const items = grouped.get(paper.key) ?? [];
    items.push({ direction, paper });
    grouped.set(paper.key, items);
  }
}

const touched = [];
const missing = [];
for (const [key, items] of grouped) {
  const readmePath = readmeByKey.get(key);
  if (!readmePath || !fs.existsSync(readmePath)) {
    missing.push(key);
    continue;
  }
  const body = [
    begin,
    "",
    items.map(({ direction, paper }) => paperAddendum(direction, paper)).join("\n---\n\n"),
    end,
    ""
  ].join("\n");

  const before = fs.readFileSync(readmePath, "utf8");
  const stripped = before.replace(new RegExp(`\\n?${begin}[\\s\\S]*?${end}\\n?`, "m"), "\n");
  const next = `${stripped.trimEnd()}\n\n${body}`;
  if (before !== next) {
    fs.writeFileSync(readmePath, next, "utf8");
    touched.push(path.relative(repo, readmePath).replace(/\\/g, "/"));
  }
}

console.log(JSON.stringify({
  papers: grouped.size,
  touched: touched.length,
  missing,
  files: touched
}, null, 2));
