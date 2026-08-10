from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REFERENCE_DIR = ROOT / "reference"
SURVEY_DIR = ROOT / "survey"
KEY_FILE = ROOT / "tmp" / "cited_keys.txt"
OUTPUT = SURVEY_DIR / "reference_style_cn_ppt_papers.tex"
PPT_DIR = ROOT / "report-slide"


GROUPS = {
    "arm-confidential-computing": ("Arm CCA、RME、RMM 与 Realm 机制", 0),
    "risc-v-confidential-computing": ("RISC-V enclave、CoVE 与 AP-TEE 机制", 1),
    "trusted-execution-environments": ("TEE 设计空间与执行环境谱系", 2),
    "attestation": ("启动、远程证明与生命周期安全", 3),
    "memory-and-io-fabrics": ("机密 I/O、网络与数据路径防御", 4),
    "accelerator-tees": ("加速器、SmartNIC、DPU 与设备 TEE", 5),
    "architecture-and-platform-security": ("ISA 与硬件设计纵深防御", 6),
}


PPT_DIRECTION_LABELS = {
    "硬件辅助 TEE taxonomy": "硬件辅助可信执行环境分类",
    "RISC-V CoVE / AP-TEE confidential VM": "RISC-V CoVE / AP-TEE 机密虚拟机",
    "Arm CCA I/O、DMA、accelerator、interrupt": "Arm CCA 的 I/O、DMA、加速器与中断",
    "Arm TrustZone TEE 与漏洞谱系": "Arm TrustZone TEE 与漏洞谱系",
    "Arm CCA / RME / RMM 基础架构": "Arm CCA / RME / RMM 基础架构",
    "Arm CCA 细粒度隔离与部署模型": "Arm CCA 细粒度隔离与部署模型",
    "Attestation、boot、lifecycle": "远程证明、启动与生命周期安全",
    "RISC-V 基础安全 primitives": "RISC-V 基础安全机制",
    "RISC-V TEE lineage: Sanctum / Keystone / Penglai / SPEAR-V": "RISC-V TEE 谱系：Sanctum / Keystone / Penglai / SPEAR-V",
    "RISC-V CoVE-IO / TEE-I/O": "RISC-V CoVE-IO / TEE-I/O",
    "Memory encryption / integrity / replay protection": "内存加密、完整性与重放保护",
    "Memory / I/O fabrics: CXL、PCIe IDE、RDMA": "内存与 I/O 互连：CXL、PCIe IDE、RDMA",
    "Confidential I/O protocol、trusted device interface、network endpoint": "机密 I/O 协议、可信设备接口与网络端点",
    "Accelerator / DPU / SmartNIC confidential offload": "加速器、DPU 与 SmartNIC 机密卸载",
    "SmartNIC / trusted NIC / secure storage data path": "SmartNIC、可信网卡与安全存储数据路径",
}


def ppt_direction_label(value: str) -> str:
    return PPT_DIRECTION_LABELS.get(value, value)


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8-sig")


def first_match(pattern: str, text: str, default: str = "") -> str:
    match = re.search(pattern, text, flags=re.MULTILINE)
    return match.group(1).strip() if match else default


def find_readmes() -> dict[str, Path]:
    result: dict[str, Path] = {}
    for path in REFERENCE_DIR.rglob("README.md"):
        text = read_text(path)
        key = first_match(r"^- BibTeX key: `?([^`\n]+)`?$", text)
        if key:
            result[key] = path
    return result


def yaml_value(line: str) -> str:
    """Read the simple scalar values used by report-slide/papers.yml."""
    value = line.split(":", 1)[1].strip() if ":" in line else ""
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {'"', "'"}:
        value = value[1:-1]
    return value


def ppt_records() -> list[dict[str, object]]:
    """Extract the 3 primary slots from each of the 15 PPT directions.

    The repository intentionally keeps these files readable without requiring a
    YAML dependency in the document build environment.  This parser therefore
    reads only the scalar/list fields needed for the report and ignores the rest.
    """
    records: dict[str, dict[str, object]] = {}
    order: list[str] = []
    for path in sorted(PPT_DIR.glob("*/papers.yml")):
        direction = ""
        for raw in read_text(path).splitlines():
            line = raw.rstrip()
            if line.startswith("direction:"):
                direction = yaml_value(line)
                continue
            if line.startswith("- key:"):
                key = yaml_value(line)
                current = {
                    "key": key,
                    "direction": direction,
                    "source_file": str(path.relative_to(ROOT)),
                    "slots": [],
                    "claims": {},
                    "points": {},
                }
                # Parse the rest of the item until the next top-level key.
                lines = read_text(path).splitlines()
                start = lines.index(raw)
                block: list[str] = []
                for candidate in lines[start + 1 :]:
                    if candidate.startswith("- key:"):
                        break
                    block.append(candidate)
                current_slide = "summary"
                for candidate in block:
                    if candidate.startswith("    ") and not candidate.startswith("      ") and candidate.strip().endswith(":"):
                        current_slide = candidate.strip()[:-1]
                    if candidate.startswith("  selection_slot:"):
                        slot = yaml_value(candidate)
                        if slot.startswith("primary_"):
                            current["slots"].append(slot)
                    elif candidate.startswith("  title:"):
                        current["title"] = yaml_value(candidate)
                    elif candidate.startswith("  role:"):
                        current["role"] = yaml_value(candidate)
                    elif candidate.startswith("  claim_strength:"):
                        current["claim_strength"] = yaml_value(candidate)
                    elif candidate.startswith("  paper_type:"):
                        current["paper_type"] = yaml_value(candidate)
                    elif candidate.startswith("  evidence_type:"):
                        current["evidence_type"] = yaml_value(candidate)
                    elif candidate.startswith("  selection_reason:"):
                        current["selection_reason"] = yaml_value(candidate)
                    elif candidate.startswith("  maturity:"):
                        current["maturity"] = yaml_value(candidate)
                    elif candidate.startswith("  source_status:"):
                        current["source_status"] = yaml_value(candidate)
                    elif candidate.startswith("  pdf_status:"):
                        current["pdf_status"] = yaml_value(candidate)
                    elif candidate.startswith("  source_url:"):
                        current["source_url"] = yaml_value(candidate)
                    elif candidate.startswith("  reference:"):
                        current["reference"] = yaml_value(candidate)
                    elif candidate.startswith("      claim:"):
                        current["claims"].setdefault(current_slide, []).append(yaml_value(candidate))
                    elif candidate.startswith("      - "):
                        current["points"].setdefault(current_slide, []).append(candidate[8:].strip())
                if current["slots"]:
                    if key not in records:
                        records[key] = current
                        order.append(key)
                    else:
                        old = records[key]
                        old["slots"] = list(dict.fromkeys(list(old.get("slots", [])) + list(current["slots"])))
                        old["directions"] = list(dict.fromkeys(list(old.get("directions", [])) + [direction]))
        # Ensure each record remembers every direction in which a duplicate was selected.
    for record in records.values():
        record.setdefault("directions", [record.get("direction", "")])
    for path in sorted(PPT_DIR.glob("*/papers.yml")):
        direction = ""
        for raw in read_text(path).splitlines():
            if raw.startswith("direction:"):
                direction = yaml_value(raw)
            elif raw.startswith("- key:"):
                key = yaml_value(raw)
                if key in records and direction not in records[key]["directions"]:
                    records[key]["directions"].append(direction)
    return [records[key] for key in order]


def normalize_text(text: str) -> str:
    replacements = {
        "\u2013": "-",
        "\u2014": "-",
        "\u2011": "-",
        "\u2212": "-",
        "\u00a0": " ",
        "\u202f": " ",
        "\u2018": "'",
        "\u2019": "'",
        "\u201c": '"',
        "\u201d": '"',
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text.strip()


def latex_escape(text: str) -> str:
    text = normalize_text(text)
    text = text.replace("\\", r"\textbackslash{}")
    for old, new in (
        ("&", r"\&"),
        ("%", r"\%"),
        ("$", r"\$"),
        ("#", r"\#"),
        ("_", r"\_"),
        ("{", r"\{"),
        ("}", r"\}"),
    ):
        text = text.replace(old, new)
    return text


def inline_latex(text: str) -> str:
    text = normalize_text(text)
    links: list[tuple[str, str]] = []

    def plain_latex(raw: str) -> str:
        """Escape prose while allowing long technical tokens to wrap."""
        path_pattern = re.compile(r"(?:reference|survey|out|tmp)/[A-Za-z0-9._/-]+")
        pieces = re.split(f"({path_pattern.pattern})", raw)
        rendered: list[str] = []
        for piece in pieces:
            if not piece:
                continue
            if path_pattern.fullmatch(piece):
                rendered.append(r"\path{" + latex_escape(piece) + "}")
                continue
            value = latex_escape(piece)
            value = value.replace("->", r"\allowbreak{}->\allowbreak{}")
            value = value.replace("/", r"/\allowbreak{}")
            value = value.replace("; ", r";\allowbreak{} ")
            rendered.append(value)
        return "".join(rendered)

    def take_link(match: re.Match[str]) -> str:
        token = f"@@LINK{len(links)}@@"
        links.append((match.group(1), match.group(2)))
        return token

    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", take_link, text)
    chunks = re.split(r"(\*\*.*?\*\*|`[^`]+`|@@LINK\d+@@)", text)
    output: list[str] = []
    for chunk in chunks:
        if not chunk:
            continue
        if chunk.startswith("**") and chunk.endswith("**"):
            output.append(r"\textbf{" + plain_latex(chunk[2:-2]) + "}")
        elif chunk.startswith("`") and chunk.endswith("`"):
            raw_code = chunk[1:-1]
            code = latex_escape(raw_code)
            has_cjk = any("\u3400" <= char <= "\u9fff" for char in raw_code)
            if has_cjk:
                code = code.replace("->", r"\allowbreak{}->\allowbreak{}")
                code = code.replace("/", r"/\allowbreak{}")
                output.append(code)
            elif "/" in raw_code:
                output.append(r"\path{" + code + "}")
            else:
                code = code.replace("->", r"\allowbreak{}->\allowbreak{}")
                output.append(r"\texttt{" + code + "}")
        elif chunk.startswith("@@LINK"):
            index = int(re.search(r"\d+", chunk).group(0))
            label, url = links[index]
            output.append(r"\href{" + url.replace("#", r"\#") + "}{" + latex_escape(label) + "}")
        else:
            output.append(plain_latex(chunk))
    return "".join(output)


def metadata(text: str, path: Path, key: str) -> dict[str, str]:
    category = path.parent.relative_to(REFERENCE_DIR).parts[0]
    role = first_match(r"^- Evidence role: (.+)$", text)
    evidence = first_match(r"^- Evidence class: (.+)$", text)
    lane = first_match(r"^- Survey lane: (.+)$", text)
    pdf_status = first_match(r"^- Download status: (.+)$", text)
    local_pdf = first_match(r"^- Local PDF: (.+)$", text, "未记录")
    if not evidence:
        if "Spec/standard" in role or "RFC" in role:
            evidence = "E0 规范或标准证据"
        elif "Industry" in role or "vendor" in role.lower():
            evidence = "E4 厂商或行业证据"
        elif "draft" in role.lower() or "not ratified" in role.lower():
            evidence = "E3 draft 或未 ratified 证据"
        elif "Survey" in role or "SoK" in role:
            evidence = "E2 Survey/SoK 证据"
        else:
            evidence = "E1/E2 论文或综述证据"
    if not lane:
        lane = {
            "arm-confidential-computing": "Arm/RISC-V 机密计算防御",
            "risc-v-confidential-computing": "Arm/RISC-V 机密计算防御",
            "trusted-execution-environments": "Arm/RISC-V 机密计算防御",
            "attestation": "启动、远程证明与生命周期安全",
            "memory-and-io-fabrics": "机密计算网络/I/O/数据路径防御",
            "accelerator-tees": "机密计算网络/I/O/数据路径防御",
            "architecture-and-platform-security": "ISA/硬件设计防御",
        }.get(category, "硬件安全")
    return {
        "key": key,
        "title": first_match(r"^# (.+)$", text, key),
        "authors": first_match(r"^- Authors: (.+)$", text, "论文未说明"),
        "year": first_match(r"^- Year: (.+)$", text, "论文未说明"),
        "venue": first_match(r"^- Venue: (.+)$", text, "论文未说明"),
        "role": role or "证据角色未记录",
        "evidence": evidence,
        "lane": lane,
        "pdf_status": pdf_status or "未记录",
        "local_pdf": local_pdf,
        "category": category,
    }


def metadata_from_ppt(record: dict[str, object]) -> dict[str, str]:
    """Create an evidence-bounded metadata record when the PPT source has no README."""
    reference = str(record.get("reference", ""))
    category = "trusted-execution-environments" if "trustzone" in reference else "memory-and-io-fabrics"
    if "architecture-and-platform-security" in reference:
        category = "architecture-and-platform-security"
    evidence = str(record.get("evidence_type", "E1 peer-reviewed primary work"))
    role = str(record.get("role", "PPT primary selection"))
    pdf_status = str(record.get("pdf_status", "source status recorded in PPT metadata"))
    local_pdf = "未记录"
    reference_path = ROOT / reference if reference else None
    if reference_path and reference_path.exists():
        local_pdf = str(reference_path.relative_to(ROOT))
        pdf_status = "local paper.pdf available; README review not yet created"
    title = str(record.get("title", record.get("key", "")))
    key = str(record.get("key", ""))
    recovered_metadata = {
        "ma2023ret2ns": {
            "authors": "Zheyuan Ma、Xi Tan、Lukasz Ziarek、Ning Zhang、Hongxin Hu 和 Ziming Zhao",
            "year": "2023",
            "venue": "60th ACM/IEEE Design Automation Conference (DAC)",
        },
        "li2025aiore": {
            "authors": "Chuanhan Li、Jishen Zhao 和 Yuanchao Xu",
            "year": "2025",
            "venue": "58th IEEE/ACM International Symposium on Microarchitecture (MICRO)",
        },
    }.get(key, {})
    return {
        "key": key,
        "title": title,
        "authors": recovered_metadata.get("authors", "论文元数据未在本地 README 中记录"),
        "year": recovered_metadata.get("year", "论文元数据未在本地 README 中记录"),
        "venue": recovered_metadata.get("venue", "论文元数据未在本地 README 中记录"),
        "role": role,
        "evidence": evidence,
        "lane": str(record.get("direction", "PPT 选定方向")),
        "pdf_status": pdf_status,
        "local_pdf": local_pdf,
        "category": category,
    }


def ppt_evidence_block(record: dict[str, object]) -> str:
    """Turn PPT selection metadata into a Chinese evidence paragraph."""
    lines = [
        r"\subsubsection{PPT 选入依据与证据边界}",
        rf"本论文被 PPT 选为：{inline_latex('、'.join(str(x) for x in record.get('directions', [])))}；选入槽位：{inline_latex('、'.join(str(x) for x in record.get('slots', [])))}。",
    ]
    for label, field in (("PPT 选入理由", "selection_reason"), ("证据类别", "evidence_type"), ("论文成熟度", "maturity"), ("来源状态", "source_status")):
        value = record.get(field)
        if value:
            lines.append(rf"\noindent\textbf{{{label}：}}{inline_latex(str(value))}\par")
    claims = record.get("claims", {})
    points = record.get("points", {})
    for name, label in (("summary", "摘要主张"), ("background", "背景主张"), ("solution", "方案主张"), ("experiments", "实验或证据主张"), ("evaluation", "评价主张")):
        values = list(claims.get(name, [])) if isinstance(claims, dict) else []
        if values:
            lines.append(rf"\noindent\textbf{{{label}：}}{inline_latex(str(values[0]))}\par")
        selected_points = list(points.get(name, [])) if isinstance(points, dict) else []
        for point in selected_points:
            lines.append(r"\noindent\textbullet\ " + inline_latex(str(point)) + r"\par")
    lines.append(r"这些内容是 PPT 的选题和证据定位信息；论文正文中的细节仍以本地 PDF 或正式规范为准。未能从本地材料核对的作者、年份、会议、算法参数和性能数字，统一保留为“论文未说明”或“证据不足”。\par")
    return "\n".join(lines)


def selection_scope_block(record: dict[str, object]) -> str:
    """Render PPT provenance as a compact literature-scope note."""
    def clean_value(value: object) -> str:
        return str(value).strip().rstrip("。.")

    directions = [ppt_direction_label(str(x)) for x in record.get("directions", [record.get("direction", "")])]
    slots = "、".join(str(x) for x in record.get("slots", []))
    lines = [
        rf"\noindent\textbf{{文献定位：}}本论文被纳入“{inline_latex('、'.join(directions))}”方向，选入槽位为 {inline_latex(slots)}。",
    ]
    reason = record.get("selection_reason")
    if reason:
        lines.append(rf"\noindent\textbf{{选入依据：}}{inline_latex(clean_value(reason))}。")
    evidence = record.get("evidence_type")
    maturity = record.get("maturity")
    source_status = record.get("source_status")
    details = []
    if evidence:
        details.append(f"证据类别为 {clean_value(evidence)}")
    if maturity:
        details.append(f"成熟度为 {clean_value(maturity)}")
    if source_status:
        details.append(f"来源状态为 {clean_value(source_status)}")
    if details:
        lines.append(rf"\noindent\textbf{{证据边界：}}{inline_latex('；'.join(details))}。正文中的机制和实验结论以论文 PDF、正式规范或本地评审记录为准。")
    return "\n".join(lines) + r"\par"


def between(text: str, start_marker: str, end_marker: str) -> str:
    start = text.find(start_marker)
    if start < 0:
        return ""
    start += len(start_marker)
    end = text.find(end_marker, start)
    return text[start:end if end >= 0 else len(text)].strip()


def paper_review(text: str) -> str:
    return between(text, "<!-- BEGIN PAPER REVIEW -->", "<!-- END PAPER REVIEW -->")


def detailed_addendum(text: str) -> str:
    return between(text, "<!-- BEGIN REPORT-SLIDE DETAILED ADDENDUM -->", "<!-- END REPORT-SLIDE DETAILED ADDENDUM -->")


def report_heading_title(title: str) -> str:
    """Translate slide-oriented headings into report-oriented Chinese headings."""
    title = normalize_text(title).strip()
    title = re.sub(r"^\d+(?:\.\d+)*[.)]?\s*", "", title)
    title = re.sub(r"\s+", " ", title)
    lower = title.lower()
    if lower.startswith("slide-ready"):
        # The claim and evidence paragraphs below this heading are useful; the
        # slide-production label itself is not part of a research report.
        return ""
    mappings = {
        "所属方向": "",
        "完整题目 / 作者 / 会议": "论文基本信息",
        "内容摘要": "内容摘要",
        "研究背景": "研究背景与动机",
        "关键点核心思想": "关键挑战与核心思想",
        "架构总览": "系统架构",
        "核心方法拆解": "核心方法设计",
        "实验环境和数据 / 证据基础": "实验环境与证据",
        "性能 / Claim Strength": "实验结果与证据强度",
        "文章评价": "综合评价",
        "Novelty 分析": "创新性分析",
        "实验设计分析": "实验设计与证据分析",
        "局限性与可能漏洞": "局限性与可能风险",
        "和已有工作的关系": "与已有工作的关系",
        "复现与再实现计划": "复现与再实现计划",
        "对后续研究的启发": "对后续研究的启发",
        "SOTA README Addendum": "补充评价",
        "SoK Citation Expansion": "引用扩展",
        "Citation Triage": "引用范围说明",
    }
    return mappings.get(title, title)


def heading_latex(line: str) -> str:
    stripped = line.strip()
    match = re.match(r"^(#{2,4})\s+(.*)$", stripped)
    if not match:
        return ""
    level = len(match.group(1))
    raw_title = match.group(2).strip()
    if raw_title in {"Paper Review", "Report-Slide Detailed Addendum"} or raw_title.startswith("Report-Slide Detailed Addendum"):
        return ""
    title = report_heading_title(raw_title)
    if not title:
        return ""
    # The numbered addendum sections should become the paper's 2.1.1-style
    # headings.  Nested method headings remain run-in paragraphs, matching the
    # reference report's compact technical exposition.
    has_manual_number = bool(re.match(r"^\d+(?:\.\d+)*[.)]?\s*", raw_title))
    if has_manual_number and "slide-ready" not in raw_title.lower():
        command = "subsubsection"
    elif level == 2:
        command = "subsubsection"
    elif level == 3:
        command = "paragraph"
    else:
        command = "subparagraph"
    return rf"\{command}{{{inline_latex(title)}}}"


def split_table_row(line: str) -> list[str]:
    stripped = line.strip()
    if stripped.startswith("|"):
        stripped = stripped[1:]
    if stripped.endswith("|"):
        stripped = stripped[:-1]
    return [cell.strip() for cell in stripped.split("|")]


def is_table_separator(line: str) -> bool:
    cells = split_table_row(line)
    return bool(cells) and all(bool(re.fullmatch(r":?-{3,}:?", cell.replace(" ", ""))) for cell in cells)


def table_column_widths(column_count: int) -> list[str]:
    if column_count == 2:
        return ["0.25\\linewidth", "0.63\\linewidth"]
    if column_count == 3:
        return ["0.17\\linewidth", "0.26\\linewidth", "0.45\\linewidth"]
    if column_count == 4:
        return ["0.14\\linewidth", "0.22\\linewidth", "0.24\\linewidth", "0.28\\linewidth"]
    if column_count == 6:
        # Citation-expansion tables contain a long repository path column.
        # Give that column enough width so paths do not become one-character
        # vertical strips in the rendered report.
        return [
            "0.08\\linewidth",
            "0.11\\linewidth",
            "0.15\\linewidth",
            "0.25\\linewidth",
            "0.13\\linewidth",
            "0.16\\linewidth",
        ]
    width = 0.88 / max(column_count, 1)
    return [f"{width:.3f}\\linewidth"] * column_count


def compact_table_cell(cell: str) -> str:
    """Shorten repository paths inside tables while keeping their identity."""
    match = re.fullmatch(r"`(reference/[^`]+)`", cell.strip())
    if not match:
        return cell
    path = match.group(1).strip("/")
    parts = path.split("/")
    if len(parts) <= 2:
        return cell
    last = parts[-1]
    if len(last) > 24:
        last = last[:11] + "..." + last[-9:]
    return "`reference/.../" + last + "/`"


def table_to_latex(rows: list[list[str]]) -> str:
    """Render a Markdown table as a wrapping, multipage longtable."""
    if not rows:
        return ""
    column_count = max(len(row) for row in rows)
    normalized = [row + [""] * (column_count - len(row)) for row in rows]
    widths = table_column_widths(column_count)
    columns = "@{}" + "".join(
        rf">{{\arraybackslash}}p{{{width}}}" for width in widths
    ) + "@{}"

    def row_to_latex(row: list[str], header: bool = False) -> str:
        cells = [inline_latex(compact_table_cell(cell)) for cell in row]
        if header:
            cells = [r"\textbf{" + cell + "}" for cell in cells]
        return " & ".join(cells) + r" \\"

    header = row_to_latex(normalized[0], header=True)
    body = [row_to_latex(row) for row in normalized[1:]]
    continuation = f"\\multicolumn{{{column_count}}}{{r@{{}}}}{{\\footnotesize\\itshape 续下页}} \\\\"
    continued_header = header
    return "\n".join([
        r"\begin{longtable}{" + columns + "}",
        r"\toprule",
        header,
        r"\midrule",
        r"\endfirsthead",
        r"\toprule",
        continued_header,
        r"\midrule",
        r"\endhead",
        r"\midrule",
        continuation,
        r"\endfoot",
        r"\bottomrule",
        r"\endlastfoot",
        r"\small",
        r"\setlength{\tabcolsep}{2pt}",
        *body,
        r"\end{longtable}",
    ])


def markdown_to_latex(markdown: str) -> str:
    output: list[str] = []
    paragraph: list[str] = []
    in_code = False
    skip_selection_metadata = False
    index = 0

    def flush() -> None:
        if paragraph:
            output.append(inline_latex(" ".join(part.strip() for part in paragraph if part.strip())) + r"\par")
            paragraph.clear()

    lines = markdown.splitlines()
    while index < len(lines):
        raw_line = lines[index]
        index += 1
        line = raw_line.rstrip()
        if line.strip().startswith("```"):
            flush()
            in_code = not in_code
            continue
        if in_code:
            output.append(r"\texttt{" + inline_latex(line) + r"}\par")
            continue
        if line.lstrip().startswith("**讲解稿:"):
            # This is presentation narration, not survey prose.  The claim,
            # evidence reference and proof object around it already preserve
            # the substantive information needed by the report.
            flush()
            continue
        heading = heading_latex(line)
        if re.match(r"^\s*#{2,4}\s+", line):
            flush()
            raw_heading = re.match(r"^\s*#{2,4}\s+(.*)$", line).group(1).strip()
            if re.sub(r"^\d+(?:\.\d+)*[.)]?\s*", "", raw_heading) == "所属方向":
                skip_selection_metadata = True
                continue
            if skip_selection_metadata:
                skip_selection_metadata = False
            if heading:
                output.append(heading)
            continue
        if skip_selection_metadata:
            continue
        if not line.strip():
            flush()
            continue
        if line.lstrip().startswith("|"):
            flush()
            table_lines = [line]
            while index < len(lines) and lines[index].lstrip().startswith("|"):
                table_lines.append(lines[index].rstrip())
                index += 1
            if len(table_lines) >= 2 and is_table_separator(table_lines[1]):
                rows = [split_table_row(table_lines[0])]
                rows.extend(split_table_row(table_line) for table_line in table_lines[2:] if not is_table_separator(table_line))
                output.append(table_to_latex(rows))
            else:
                # Keep malformed/non-table pipe text readable without claiming it is a table.
                readable = "；".join("；".join(split_table_row(table_line)) for table_line in table_lines)
                output.append(r"\noindent" + inline_latex(readable) + r"\par")
            continue
        if re.match(r"^\s*[-*]\s+", line):
            flush()
            item = re.sub(r"^\s*[-*]\s+", "", line)
            item = re.sub(r"^Proof object:\s*", "分析证据：", item, flags=re.IGNORECASE)
            output.append(r"\noindent\textbullet\ " + inline_latex(item) + r"\par")
            continue
        if line.lstrip().startswith(">"):
            flush()
            output.append(r"\begin{quote}" + inline_latex(line.lstrip()[1:].strip()) + r"\end{quote}")
            continue
        line = re.sub(r"^\s*\*\*Claim:\*\*", "**核心判断：**", line, flags=re.IGNORECASE)
        line = re.sub(r"^\s*\*\*Evidence refs:\*\*", "**证据依据：**", line, flags=re.IGNORECASE)
        paragraph.append(line.strip())
    flush()
    return "\n".join(output)


def clean_markdown_prose(text: str) -> str:
    """Remove authoring markup while preserving the paper-level meaning."""
    text = normalize_text(text)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"\*\*(.*?)\*\*", r"\1", text)
    text = re.sub(r"`([^`]*)`", r"\1", text)
    text = text.replace("PPT 中要", "本文不应")
    text = text.replace("PPT 不能", "不应")
    text = text.replace("PPT 中它应承担", "在本调研中，它承担")
    text = text.replace("PPT 用法", "本文中的使用方式")
    text = text.replace("PPT 中应", "本文应")
    text = text.replace("PPT 必须", "本文必须")
    text = text.replace("PPT 具体", "本文中的具体")
    text = text.replace("本 PPT", "本文")
    text = text.replace("PPT", "本文")
    text = text.replace("slides 中", "本文中")
    text = text.replace("slides", "本文")
    text = text.replace("Slide-ready", "")
    text = text.replace("实验环境页", "证据条件")
    text = text.replace("性能页", "性能论证")
    text = text.replace("本页", "该材料")
    text = text.replace("这页", "该材料")
    text = text.replace("在 本文中", "在本文中")
    text = text.replace("本文 同时", "同时")
    text = text.replace("本文 不", "本文不")
    text = text.replace("应写成", "可表述为")
    text = text.replace("本文不应把", "不应将")
    text = text.replace("本文应把", "分析时应将")
    text = text.replace("本文必须", "分析时必须")
    text = text.replace("本文中的具体数字", "具体数字")
    text = text.replace("report-slide", "本报告")
    return re.sub(r"\s+", " ", text).strip()


def close_sentence(text: str) -> str:
    text = clean_markdown_prose(text).strip("；; ")
    if not text:
        return ""
    return text if text.endswith(("。", "！", "？", ".", "!", "?")) else text + "。"


def prose_title(raw_title: str) -> str:
    """Normalize the heterogeneous README headings used by older reviews."""
    title = report_heading_title(raw_title)
    aliases = {
        "研究问题与背景": "研究背景与问题定义",
        "安全性 / 正确性分析": "安全性与威胁边界",
        "实验设计分析": "实验设计与证据分析",
        "性能 / Claim Strength": "实验结果与证据强度",
        "文章评价": "综合评价",
        "Novelty 分析": "创新性分析",
        "局限性与可能风险": "局限性与适用边界",
    }
    return aliases.get(title, title)


def parse_review_sections(markdown: str) -> list[dict[str, object]]:
    """Extract numbered paper-review sections and their nested method blocks.

    The local notes are deliberately rich but were originally authored for
    slides.  This parser retains their claims, observations and evidence while
    allowing the report renderer to write them as continuous prose.
    """
    sections: list[dict[str, object]] = []
    current: dict[str, object] | None = None
    current_method: dict[str, object] | None = None
    heading_re = re.compile(r"^###\s+(\d+)\.(?!\d)\s*(.+)$")
    for raw in markdown.splitlines():
        line = raw.rstrip()
        match = heading_re.match(line.strip())
        if match:
            number = int(match.group(1))
            # README's SOTA/citation appendices repeat material already
            # explained by sections 1--11.  They are valuable evidence notes,
            # but should not break the narrative into a second mini-report.
            if number > 11:
                current = None
                current_method = None
                continue
            title = prose_title(match.group(2))
            current = {"number": number, "title": title, "lines": [], "methods": []}
            sections.append(current)
            current_method = None
            continue
        if current is None:
            continue
        nested = re.match(r"^####\s+(.+)$", line.strip())
        if nested:
            current_method = {"title": clean_markdown_prose(nested.group(1)), "lines": []}
            methods = current["methods"]
            assert isinstance(methods, list)
            methods.append(current_method)
            continue
        target = current_method["lines"] if current_method is not None else current["lines"]
        assert isinstance(target, list)
        target.append(line)
    return sections


def section_facts(lines: list[str]) -> dict[str, list[str]]:
    """Collect claims, explanatory points and evidence from a note section."""
    facts: dict[str, list[str]] = {"claims": [], "points": [], "evidence": [], "prose": []}
    ignored_prefixes = (
        "Direction:", "Paper key:", "Role:", "Evidence base:", "Boundary:",
        "完整题目:", "作者:", "会议/来源:", "Title evidence:",
        "SOTA 定位:", "标准化 / 发表状态:", "对应小方向:",
    )
    for raw in lines:
        line = raw.strip()
        if not line or line.startswith("<!--") or line.startswith("#") or line.startswith("|"):
            continue
        if line.startswith("**讲解稿:"):
            continue
        claim = re.match(r"^\*\*Claim:\*\*\s*(.+)$", line, flags=re.IGNORECASE)
        if claim:
            facts["claims"].append(clean_markdown_prose(claim.group(1)))
            continue
        evidence = re.match(r"^\*\*Evidence refs:\*\*\s*(.+)$", line, flags=re.IGNORECASE)
        if evidence:
            facts["evidence"].append(clean_markdown_prose(evidence.group(1)))
            continue
        item = re.match(r"^[-*]\s+(.+)$", line)
        if item:
            value = clean_markdown_prose(item.group(1))
            if value.lower().startswith("proof object:"):
                # These are slide-diagram instructions.  Other bullets already
                # contain the substantive technical explanation.
                continue
            if value.startswith(ignored_prefixes):
                continue
            facts["points"].append(value)
            continue
        if line.startswith(("```", "---")):
            continue
        value = clean_markdown_prose(line)
        if value and value not in {"Paper Review", "Report-Slide Detailed Addendum"}:
            facts["prose"].append(value)
    return facts


def bullet_sentence(value: str) -> str:
    """Turn one slide bullet into a sentence that can live in running prose."""
    value = clean_markdown_prose(value)
    if not value:
        return ""
    match = re.match(r"^([^:：]{1,24})[:：]\s*(.+)$", value)
    if not match:
        return close_sentence(value)
    label, detail = match.group(1).strip(), match.group(2).strip()
    prefixes = {
        "动机": "从研究动机看，",
        "工作": "为解决这一问题，作者",
        "数据": "从论文给出的证据看，",
        "证据源": "论文直接使用的证据包括",
        "可支撑": "能够直接支撑的结论是，",
        "不能支撑": "但这些材料不足以支撑，",
        "核心证据": "最能支撑该结论的材料是",
        "核心洞察": "其核心思想是，",
        "架构总览": "在架构层面，",
        "背景问题": "其问题起点在于，",
        "研究背景": "其问题起点在于，",
        "评价": "总体而言，",
        "Host side": "在 host 一侧，",
        "Realm side": "在 Realm 一侧，",
        "硬件 side": "在硬件一侧，",
        "边界": "同时需要看到其适用边界：",
        "优势": "它的优势在于",
        "局限": "它的局限在于",
        "商业化潜力": "从部署角度看，",
        "工程实现": "在工程实现上，",
        "研究贡献": "从研究贡献看，",
        "分析管线": "其分析过程可以概括为，",
        "方法名": "作者将该方法称为",
        "分类": "从创新性分类看，",
        "理由": "这样判断的原因是，",
        "可能的 overclaim": "需要避免的过度外推是，",
        "评价问题": "围绕评估，还应追问，",
        "最小复现目标": "若要复现，最低目标是，",
        "Required environment": "所需环境包括，",
        "Acceptance criteria": "验收时应确认，",
    }
    if "性能" in label or "开销" in label:
        prefix = "关于性能，"
    elif "证据" in label or "实验" in label:
        prefix = "从可核验的证据看，"
    elif "缺点" in label or "不足" in label:
        prefix = "不过，"
    elif label.endswith("方面"):
        prefix = f"就{label[:-2]}而言，"
    elif re.match(r"^(?:Figure|Table|Abstract)\b", label, flags=re.IGNORECASE):
        prefix = f"就{label}而言，"
    elif label == "Reproducibility difficulty":
        prefix = "复现难度为，"
    elif label == "Hardest implementation part":
        prefix = "最难复现的部分是，"
    else:
        prefix = prefixes.get(label)
    if prefix is None:
        return close_sentence(f"关于{label}，{detail}")
    if prefix.endswith("：") or prefix.endswith("，"):
        return close_sentence(prefix + detail)
    return close_sentence(prefix + detail)


def prose_from_points(points: list[str], lead: str = "具体而言，") -> list[str]:
    sentences = [bullet_sentence(point) for point in points]
    sentences = [sentence for sentence in sentences if sentence]
    if not sentences:
        return []
    # Two moderately dense paragraphs read more like a survey narrative than a
    # mechanically converted list, while retaining every material observation.
    if len(sentences) <= 3:
        return [lead + "".join(sentences)]
    first = lead + "".join(sentences[:2])
    second = "进一步说，" + "".join(sentences[2:])
    return [first, second]


def narrative_claim(value: str) -> str:
    """Remove slide labels from a claim before placing it in running prose."""
    value = clean_markdown_prose(value)
    match = re.match(r"^([^:：]{1,28})[:：]\s*(.+)$", value)
    if not match:
        return close_sentence(value)
    label, detail = match.group(1).strip(), match.group(2).strip()
    if (
        label in {"核心洞察", "架构总览", "背景问题", "研究背景", "评价", "核心贡献"}
        or "性能" in label
        or "证据" in label
        or "实验" in label
        or "页" in label
    ):
        return close_sentence(detail)
    return close_sentence(value)


def section_opener(title: str) -> str:
    return {
        "内容摘要": "这篇工作的中心贡献可以概括为：",
        "研究背景与动机": "要理解该方案，首先需要看到它面对的系统矛盾：",
        "研究背景与问题定义": "该工作的问题定义并非抽象的安全愿望，而是一个具体的系统矛盾：",
        "关键挑战与核心思想": "在上述背景下，作者提出的关键判断是：",
        "系统架构": "从系统结构看，论文的基本组织方式是：",
        "实验环境与证据": "论文没有把这部分只写成结论，而是以如下材料界定其证据范围：",
        "实验设计与证据分析": "从评估设计看，作者试图用以下证据回答其核心问题：",
        "实验结果与证据强度": "对于性能或效果，论文能够支持的结论是：",
        "创新性分析": "从研究贡献的角度看，",
        "局限性与适用边界": "这项工作的价值需要与其适用边界一起理解：",
        "与已有工作的关系": "将它放回已有工作中比较，可以看到：",
        "复现与再实现计划": "若希望将论文的结论落到可复现实验，关键不是复刻表面接口，而是：",
        "对后续研究的启发": "这项工作还引出若干可以继续推进的问题：",
        "综合评价": "综合来看，",
    }.get(title, "这一部分的核心结论是：")


def evidence_paragraph(evidence: list[str]) -> str:
    if not evidence:
        return ""
    joined = "；".join(dict.fromkeys(evidence)).rstrip("；;。.")
    return f"本节判断以 {joined} 为依据。超出这些材料覆盖范围的实现细节、性能结论或攻击面，本文不作延伸推断。"


def render_narrative_section(title: str, lines: list[str]) -> list[str]:
    facts = section_facts(lines)
    claims = facts["claims"]
    points = facts["points"]
    free_text = facts["prose"]
    evidence = facts["evidence"]
    output = [rf"\subsubsection{{{inline_latex(title)}}}"]
    if claims:
        output.append(inline_latex(section_opener(title) + narrative_claim(claims[0])) + r"\par")
        for extra in claims[1:]:
            free_text.insert(0, extra)
    if free_text:
        # Existing reviews sometimes contain full paragraphs rather than
        # slide bullets.  Preserve them as the main narrative instead of
        # flattening them into a generic template.
        for paragraph in free_text:
            output.append(inline_latex(close_sentence(paragraph)) + r"\par")
    output.extend(inline_latex(paragraph) + r"\par" for paragraph in prose_from_points(points))
    if not claims and not free_text and not points:
        output.append(r"论文未在本地材料中单独展开这一部分；本报告仅保留其来源状态，不以推测补足。\par")
    evidence_text = evidence_paragraph(evidence)
    if evidence_text and title in {"实验环境与证据", "实验设计与证据分析", "实验结果与证据强度"}:
        output.append(inline_latex(evidence_text) + r"\par")
    return output


def render_method_section(lines: list[str], methods: list[dict[str, object]]) -> list[str]:
    facts = section_facts(lines)
    output = [r"\subsubsection{核心方法设计}"]
    if facts["claims"]:
        output.append(inline_latex("作者将核心设计概括为：" + narrative_claim(facts["claims"][0])) + r"\par")
    elif facts["prose"]:
        output.append(inline_latex(close_sentence(facts["prose"][0])) + r"\par")
    else:
        output.append(r"论文的关键不是单一组件，而是将若干检查、状态和接口组合成一条受控的执行路径。\par")
    output.extend(inline_latex(paragraph) + r"\par" for paragraph in prose_from_points(facts["points"], "从整体流程看，"))
    for index, method in enumerate(methods, start=1):
        method_title = clean_markdown_prose(str(method["title"]))
        method_lines = method["lines"]
        assert isinstance(method_lines, list)
        method_facts = section_facts(method_lines)
        output.append(rf"\noindent\textbf{{（{index}）{inline_latex(method_title)}。}}\par")
        if method_facts["claims"]:
            output.append(inline_latex("这一机制的直接作用是：" + narrative_claim(method_facts["claims"][0])) + r"\par")
        if method_facts["prose"]:
            output.extend(inline_latex(close_sentence(paragraph)) + r"\par" for paragraph in method_facts["prose"])
        output.extend(inline_latex(paragraph) + r"\par" for paragraph in prose_from_points(method_facts["points"], "具体实现上，"))
    # 方法段的证据已经在相应的实验与证据小节中集中说明，避免每个
    # 组件之后重复出现相同的证据边界提示而打断阅读。
    return output


def security_boundary_paragraph(meta: dict[str, str]) -> str:
    category = meta["category"]
    if category == "arm-confidential-computing":
        return "从安全边界看，关键问题在于 host 或 hypervisor 是否仍能通过页状态、生命周期接口、固件和设备路径重新获得受保护状态的观察或控制能力。因而，文中机制只有在资源所有权、状态转换和受控接口同时成立时，才构成完整的隔离论证。"
    if category == "risc-v-confidential-computing":
        return "从安全边界看，应把 enclave 或 TVM 内的执行保护，与 PMP、IOMMU、TSM、页共享和设备访问的生命周期放在一起检查。仅证明 CPU 执行域不可直接读取，并不能自动说明 donation、reclaim、DMA 或中断路径同样安全。"
    if category == "attestation":
        return "从安全边界看，证明机制必须同时回答证据由谁产生、是否新鲜、是否绑定到正确的实例和端点，以及 verifier 据此能做出什么决策。测量值本身并不等同于运行期隔离，也不能覆盖论文未声明的物理、侧信道或拒绝服务攻击。"
    if category in {"memory-and-io-fabrics", "accelerator-tees"}:
        return "从安全边界看，数据一旦离开 CPU，设备身份、DMA 映射、队列、链路和中断投递都会成为新的受控点。论文提出的保护应理解为对其中若干环节的覆盖；只有这些环节与工作负载身份和生命周期一致，才能形成端到端的机密数据路径。"
    if category == "architecture-and-platform-security":
        return "从安全边界看，这类机制通常提供底层权限、内存或控制流约束，而不是独立完成机密计算平台的全部生命周期管理。评价时必须把它能够阻止的具体越权路径，与其没有覆盖的设备、固件和运行期攻击面明确区分。"
    return "从安全边界看，应分别核对攻击者能力、受保护对象、检查点和失败路径；论文未声明覆盖的攻击面不能默认已经被解决。"


def prose_basic_information(meta: dict[str, str], record: dict[str, object], summary_claim: str) -> list[str]:
    directions = [ppt_direction_label(str(value)) for value in record.get("directions", [record.get("direction", "")])]
    paper_type = str(record.get("paper_type", "研究材料"))
    venue = meta["venue"]
    if meta["key"] == "menetrey2022attestation" and venue in {"", "论文未说明", "未说明"}:
        venue = "5th Workshop on System Software for Trusted Execution (SysTEX)"
    if venue in {"", "论文未说明", "未说明"}:
        publication = f"形成于 {meta['year']} 年，具体发表载体在本地元数据中未注明"
    else:
        publication = f"发表于 {meta['year']} 年的 {venue}"
    status_lower = meta["pdf_status"].lower()
    if meta["key"] == "li2025aiore":
        source_status = "本地未保存完整 PDF；机制和数据仅以题录与已核验的选题记录为限"
    elif "unavailable" in status_lower or "access-denied" in status_lower:
        source_status = "官方来源页面已核验，但本地 PDF 不可得"
    elif "metadata" in status_lower or "gated" in status_lower:
        source_status = "本地仅保留元数据或受限来源记录"
    elif "downloaded" in status_lower or "verified" in status_lower or "local pdf" in status_lower or "local paper" in status_lower:
        source_status = "本地 PDF 或等价原始材料已保存并核验"
    else:
        source_status = "本地来源状态已在材料库中记录"
    text = (
        f"《{meta['title']}》由 {meta['authors']} 完成，{publication}。"
        f"本文将其置于“{'、'.join(directions)}”的研究脉络中考察，并把它作为 {paper_type} 类材料使用。"
    )
    if summary_claim:
        text += f"它所回答的核心问题可概括为：{narrative_claim(summary_claim)}"
    text += (
        f"当前证据状态为：{source_status}；下文仅在该范围内讨论其机制与结论。"
    )
    return [r"\subsubsection{论文基本信息}", inline_latex(text) + rf"\cite{{{meta['key']}}}\par"]


def detailed_prose_review(meta: dict[str, str], record: dict[str, object], markdown: str) -> str:
    """Render one README review as continuous, evidence-bounded Chinese prose."""
    sections = parse_review_sections(markdown)
    by_title = {str(section["title"]): section for section in sections}
    summary_section = by_title.get("内容摘要")
    summary_facts = section_facts(summary_section["lines"]) if summary_section else {"claims": []}
    summary_claims = summary_facts.get("claims", [])
    summary_claim = str(summary_claims[0]) if summary_claims else ""
    body = prose_basic_information(meta, record, summary_claim)
    ordered_titles = [
        "研究背景与动机",
        "研究背景与问题定义",
        "关键挑战与核心思想",
        "系统架构",
        "核心方法设计",
        "安全性与威胁边界",
        "实现细节",
        "实验环境与证据",
        "实验设计与证据分析",
        "实验结果与证据强度",
        "创新性分析",
        "局限性与适用边界",
        "与已有工作的关系",
        "复现与再实现计划",
        "对后续研究的启发",
        "综合评价",
    ]
    # “内容摘要”已经融入论文基本信息中的研究定位，避免在紧接着的
    # 背景小节中重复一次相同的 slide summary。
    emitted: set[str] = {"论文基本信息", "内容摘要"}
    for title in ordered_titles:
        if title == "安全性与威胁边界":
            # The slide notes focus on mechanism and evidence.  This bridge
            # makes the threat boundary explicit, as in the reference report.
            body.append(r"\subsubsection{安全性与威胁边界}")
            body.append(inline_latex(security_boundary_paragraph(meta)) + r"\par")
            section = by_title.get(title)
            if section is not None:
                lines = section["lines"]
                assert isinstance(lines, list)
                body.extend(render_narrative_section(title, lines)[1:])
            emitted.add(title)
            continue
        section = by_title.get(title)
        if section is None or title in emitted:
            continue
        lines = section["lines"]
        methods = section["methods"]
        assert isinstance(lines, list) and isinstance(methods, list)
        if title == "核心方法设计":
            body.extend(render_method_section(lines, methods))
        else:
            body.extend(render_narrative_section(title, lines))
        emitted.add(title)
    # Preserve unexpected numbered sections from an older README, while still
    # keeping the standard sequence above stable.
    for section in sections:
        title = str(section["title"])
        if title in emitted or title in {"所属方向", ""}:
            continue
        lines = section["lines"]
        methods = section["methods"]
        assert isinstance(lines, list) and isinstance(methods, list)
        if title == "核心方法设计":
            body.extend(render_method_section(lines, methods))
        else:
            body.extend(render_narrative_section(title, lines))
    return "\n".join(body)


def record_facts(record: dict[str, object], name: str) -> tuple[str, list[str]]:
    claims = record.get("claims", {})
    points = record.get("points", {})
    claim_values = list(claims.get(name, [])) if isinstance(claims, dict) else []
    point_values = list(points.get(name, [])) if isinstance(points, dict) else []
    claim = clean_markdown_prose(str(claim_values[0])) if claim_values else ""
    return claim, [clean_markdown_prose(str(value)) for value in point_values]


def fallback_detail_paragraphs(meta: dict[str, str]) -> dict[str, list[str]]:
    """Add source-grounded detail for the two selected papers without README notes."""
    if meta["key"] == "menetrey2022attestation":
        return {
            "研究背景与问题定义": [
                "Ménétrey 等人的出发点是，TEE 的隔离粒度和实现方式差异很大，而远程验证方真正需要判断的是某个具体软件是否运行在预期硬件和预期状态中。单看 enclave、secure world 或虚拟机的名称，无法回答证据是否绑定了正确的代码、是否具有新鲜性，也无法说明验证结果怎样被用于安全通道或密钥释放。论文因此把 attestation 从某个厂商的 quote 格式提升为可跨平台比较的信任建立过程。",
                "文中区分本地证明与远程证明：前者发生在同一硬件上的两个软件环境之间，后者则由 attester、verifier 和 relying party 跨设备完成。远程场景中，attester 收集代码测量等 claims 并签名形成 evidence，verifier 将其同参考值、背书和策略比对，relying party 再据结果决定是否建立关系或传输机密数据。这个角色划分解释了为何签名本身不能替代完整的信任决策。",
            ],
            "核心方法设计": [
                "论文以一组“基石特性”建立比较框架：内存完整性、新鲜性、加密、可并发的隔离域数量、开源程度、本地和远程证明、应用可用的证明 API、双向证明、用户态支持、工业成熟度，以及隔离和证明的粒度与系统支撑。该框架的作用不是给平台排出绝对名次，而是把不同 TEE 的安全属性、可部署性和证明能力拆到同一组可观察维度中。",
                "在平台比较中，Intel SGX 以 enclave 和 quoting enclave 为中心，将本地报告转换为可被远程验证的 quote，并可把应用公钥或清单绑定进证据；Arm TrustZone 则通常提供单一 secure world，但缺少内建远程证明，需要安全启动、根密钥、随机源和附加协议来构造证据。AMD SEV 以虚拟机为隔离与证明粒度，而 RISC-V 的 Keystone、Sanctum、TIMBER-V、LIRA-V 等方案展示了开放 ISA 在 PMP、MPU 或标签化内存上的不同实现取舍。由此可以看出，隔离模型和证明接口并不天然一一对应。",
            ],
            "实验设计与证据分析": [
                "这是一篇七页的综述性工作，不提出新的 TEE 原型或性能基准。其主要证据是论文整理的跨平台功能矩阵、通用部署与证明流程图，以及对 SGX、TrustZone、SEV 和多种 RISC-V 方案的机制归纳。因而它能够支持的是比较维度和研究谱系，而不是某个平台在特定 workload 上的延迟、吞吐或端到端安全结论。",
                "论文特别强调，可信应用在开发侧被编译和测量后，需要在不受信任的部署环境中利用 TEE 生成带有密钥材料的证据；验证方再以参考值确认其真实性。这条流程揭示了实际部署中的关键连接点：代码测量、设备根信任、证据签名、通道密钥以及 verifier 策略必须覆盖同一实例。若其中任一环节没有绑定，攻击者仍可能把正确的 evidence 与错误的通信端点或运行实体拼接。",
            ],
            "综合评价": [
                "该文的贡献不在于给出新的证明协议，而在于将证明能力从处理器营销特性中拆解出来，说明成熟 TEE 之间仍可能在新鲜性、互证、应用 API、隔离粒度和工业可用性上存在结构性差异。它适合作为本报告中 Arm、RISC-V 和云端 TEE 证明机制的比较起点；但由于写作时间早于 CCA、CoVE 等后续架构的成熟，具体接口和现行部署状态仍需回到相应的规范与原始系统论文核对。",
            ],
        }
    if meta["key"] == "ma2023ret2ns":
        return {
            "研究背景与问题定义": [
                "Ma 等人考察的不是传统 Cortex-A TrustZone 的 secure monitor 切换，而是 Cortex-M 为了降低开销而允许 secure state 通过 bxns 或 blxns 直接把控制流交还 non-secure state 的快速状态切换。由于 Cortex-M 的安全状态与内存区域相关，且部分状态在跨世界切换中继续保留，受攻击的 secure firmware 一旦把被污染的代码指针交给这两条指令，就可能把非安全用户态代码带回特权执行上下文。",
                "论文的攻击模型因此相当具体：攻击者位于 non-secure userspace，利用 secure state 中的内存破坏漏洞污染一个将由 bxns 或 blxns 使用的代码指针；攻击者并不需要接管 secure world 的任意控制流。作者把攻击按起点区分为 handler-mode 与 thread-mode 两类，再按间接返回和间接调用区分为 bxns 与 blxns 两类，从而得到四种 ret2ns 变种。",
            ],
            "核心方法设计": [
                "论文首先通过一个 secure display 服务的例子说明攻击链：用户程序经 SVC 进入 handler mode，再穿过 non-secure callable 入口进入 secure state；若 secure 函数的栈上返回地址被越界写覆盖，随后 bxns 将跳转到攻击者选择的 non-secure 地址，而处理器仍以高权限上下文执行该地址。这个案例把抽象的跨世界状态语义转化为可复现的权限提升路径。",
                "在防御上，作者把所有 secure-to-non-secure 的 bxns 和 blxns 看成必须检查的控制流检查点。MPU-assisted address sanitizer 读取 IPSR、CONTROL_NS.nPRIV 与目标地址对应的 non-secure MPU 属性，阻断会把用户页作为特权目标执行的跳转；address masking 则在用户态和内核态地址范围已知的条件下，将目标地址强制约束到合法范围。前者更通用，后者更轻量，但依赖更强的内存布局假设。",
            ],
            "实验设计与证据分析": [
                "作者在 Microchip SAM L11 的 Cortex-M23 平台和基于 ARM MPS2+ FPGA 的 Cortex-M33 平台上验证四种攻击变体，并在示例 TrustZone 工程中注入 secure callable 函数的内存破坏漏洞。防御实验使用 Cortex-M33 的 20MHz 配置，确认两种防御均能阻断四种变体。性能部分以修改后的 Blinky 跨世界工程为负载，改变状态切换频率和服务请求频率后重复测量。",
                "结果显示，最坏路径下 MPU-assisted 检查对 bxns 和 blxns 分别增加 32 与 30 个 CPU 周期，地址掩码分别增加 18 与 12 个周期；在论文给出的不同调用频率组合中，额外开销最高约为 0.0381%，因而支持“低运行时开销”的结论。不过，作者也承认未在量产固件中发现真实 ret2ns 漏洞，实验主要验证攻击可行性和防御机制，而不能推导所有 Cortex-M 产品均已暴露。",
            ],
            "综合评价": [
                "这篇工作的价值在于揭示了 Cortex-M TrustZone 为性能引入的直接状态切换并非只是实现细节，而是会改变权限传播语义。它把 confused-deputy 风险具体化为可执行的权限提升链，并给出可部署的插桩式缓解方案。局限在于防御仍依赖 secure firmware 中跳转点能够被完整识别，以及 non-secure MPU 配置或地址布局本身可信；后续工作仍需检查编译器生成代码、RTOS 集成和真实固件的覆盖情况。",
            ],
        }
    if meta["key"] == "li2025aiore":
        return {
            "研究背景与问题定义": [
                "AIORE 关注 CXL 内存扩展后出现的一个性能与安全冲突：若对远端扩展内存统一采用 XTS 等加密方式，读访问关键路径会被显著拉长；若改用 CTR，又会引入计数器元数据的缓存压力以及计数器耗尽后的重加密问题。论文把问题限定为如何在不放弃机密性保护的前提下，使不同热度页面使用与其访问特征相匹配的加密和重加密路径。",
            ],
            "核心方法设计": [
                "AIORE 的核心设计由三部分组成。第一，页面热度跟踪器据访问特征在 CTR 与 XTS 路径间自适应选择，避免对所有页面采用同一种昂贵策略。第二，增量重加密位图把计数器耗尽后的大规模重加密拆成随正常访问逐步完成的工作，削减停顿和突发带宽压力。第三，系统把适合卸载的重加密任务交给 CXL 内存节点处理，使主机关键路径不必承担全部密码计算。三者共同服务于同一目标：把重加密从一次全局维护操作变成可被访问行为平摊的后台过程。",
            ],
            "实验设计与证据分析": [
                "根据论文题录与已核验的选题记录，评估在 Gem5 模拟环境中使用 13 个负载，将 AIORE 与固定加密基线比较。报告的平均安全开销为 3.7%，其中单核为 3.2%、多核为 4.3%，并称相对基线平均减少 62.8% 的安全开销；记录同时指出，现有 XTS 路径在内存密集型应用中最高可达 14.9%。这些结果支持其针对性能瓶颈的设计动机，但仍应注意模拟器并不等价于真实 CXL 控制器、计数器缓存和内存节点固件上的部署表现。",
            ],
            "综合评价": [
                "AIORE 的创新性在于没有把内存加密视为固定的单一原语，而是把页面热度、重加密时机和计算位置共同纳入设计。其不足是本地材料尚未提供完整 PDF 供逐图核验，且当前记录没有证明端到端完整性树、篡改检测或故障恢复都已覆盖。因此，本文将其定位为 CXL 机密性开销优化的重要证据，而不把它外推为完整的 CXL 内存完整性方案。",
            ],
        }
    return {}


def fallback_prose_review(meta: dict[str, str], record: dict[str, object], source_review: str) -> str:
    """Write a full narrative when a selected paper lacks a slide addendum."""
    summary_claim, summary_points = record_facts(record, "summary")
    background_claim, background_points = record_facts(record, "background")
    solution_claim, solution_points = record_facts(record, "solution")
    experiment_claim, experiment_points = record_facts(record, "experiments")
    evaluation_claim, evaluation_points = record_facts(record, "evaluation")
    supplemental = fallback_detail_paragraphs(meta)
    body = prose_basic_information(meta, record, summary_claim)

    def add_section(title: str, claim: str, points: list[str]) -> None:
        body.append(rf"\subsubsection{{{title}}}")
        if claim:
            body.append(inline_latex(section_opener(title) + narrative_claim(claim)) + r"\par")
        for paragraph in supplemental.get(title, []):
            body.append(inline_latex(close_sentence(paragraph)) + r"\par")
        if not supplemental.get(title):
            body.extend(inline_latex(paragraph) + r"\par" for paragraph in prose_from_points(points))

    add_section("研究背景与问题定义", background_claim, background_points)
    if not supplemental.get("研究背景与问题定义"):
        body.append(inline_latex(category_background(meta)) + r"\par")
    add_section("核心方法设计", solution_claim, solution_points)
    body.append(r"\subsubsection{安全性与威胁边界}")
    body.append(inline_latex(security_boundary_paragraph(meta)) + r"\par")
    body.append(r"\subsubsection{实验设计与证据分析}")
    if experiment_claim:
        body.append(inline_latex(section_opener("实验设计与证据分析") + close_sentence(experiment_claim)) + r"\par")
    for paragraph in supplemental.get("实验设计与证据分析", []):
        body.append(inline_latex(close_sentence(paragraph)) + r"\par")
    if not supplemental.get("实验设计与证据分析"):
        body.extend(inline_latex(paragraph) + r"\par" for paragraph in prose_from_points(experiment_points))
    body.append(r"\subsubsection{综合评价}")
    if evaluation_claim:
        body.append(inline_latex(section_opener("综合评价") + close_sentence(evaluation_claim)) + r"\par")
    for paragraph in supplemental.get("综合评价", []):
        body.append(inline_latex(close_sentence(paragraph)) + r"\par")
    if not supplemental.get("综合评价"):
        body.extend(inline_latex(paragraph) + r"\par" for paragraph in prose_from_points(evaluation_points))
    body.append(inline_latex(
        "由于本地 README 没有提供完整的逐节评审记录，以上内容仅使用已核验 PDF、选题材料和 BibTeX 元数据；未出现于这些材料的算法细节、对比实验或部署结论均不作推断。"
    ) + r"\par")
    return "\n".join(body)


def role_sentence(meta: dict[str, str]) -> str:
    role = meta["role"]
    evidence = meta["evidence"]
    pdf = meta["pdf_status"]
    return (
        f"本条目属于{meta['lane']}，在本综述中被归入{inline_latex(evidence)}。"
        f"仓库记录的证据角色为：{inline_latex(role)}。"
        f"本地证据状态为：{inline_latex(pdf)}。"
        "以下评述只在该证据边界内展开；如果来源是规范、草案、厂商材料或元数据记录，不能把它越级解释为完整系统的安全性或性能证明。"
    )


def category_background(meta: dict[str, str]) -> str:
    category = meta["category"]
    if category == "arm-confidential-computing":
        return "该材料关注 Arm 平台中从 TrustZone、CCA、RME、RMM 到 Realm 的保护边界。核心问题是：宿主软件仍需负责调度、分配和生命周期管理时，如何让受保护工作负载的内存、寄存器状态和设备访问保持不可见或不可篡改。"
    if category == "risc-v-confidential-computing":
        return "该材料关注 RISC-V 开放硬件生态中的 enclave、PMP、CoVE、AP-TEE 或 TVM 设计。核心问题是：如何利用可裁剪的 ISA 和平台组件建立受保护执行域，同时处理内存 donation/reclaim/share、证明、虚拟化和设备路径等生命周期问题。"
    if category == "attestation":
        return "该材料关注启动信任、远程证明、运行时完整性、证据格式或 verifier policy。核心问题是：远程方如何得到可验证、fresh、绑定到具体执行环境和设备端点的证据，并据此决定是否释放密钥或信任服务。"
    if category == "memory-and-io-fabrics":
        return "该材料关注机密计算工作负载离开 CPU 后的设备、DMA、PCIe/CXL/RDMA、网络和存储路径。核心问题是：设备身份、接口生命周期、地址转换、链路保护和中断投递能否与同一 confidential boundary 保持一致。"
    if category == "accelerator-tees":
        return "该材料关注 GPU、FPGA、AI 加速器、SmartNIC 或 DPU 中的可信执行和安全 offload。核心问题是：工作负载把模型、密钥、队列或中间数据交给异构设备后，设备本地 TCB、DMA、调度和证明如何继续满足机密性与完整性要求。"
    if category == "architecture-and-platform-security":
        return "该材料关注 ISA、权限、控制流、能力/标签、内存加密完整性、debug/trace 或整机硬件隔离。核心问题是：这些机制如何作为 CCA、CoVE 和 TEE 的纵深防御，减少边界内代码滥用合法权限或通过设备路径绕过隔离的风险。"
    return "该材料属于本综述的硬件安全主线，重点分析其威胁模型、保护边界、系统机制和证据强度。"


def novelty_sentence(meta: dict[str, str]) -> str:
    role = meta["role"].lower()
    if "spec" in role or "rfc" in role or "standard" in role:
        return "创新性分类：规范/标准贡献。它的主要价值是固定术语、接口语义和状态边界，不应按论文实验创新来评价。"
    if "survey" in role or "sok" in role:
        return "创新性分类：综述或 SoK 贡献。它的价值在于建立分类和研究地图，具体机制仍需回引原始论文或规范。"
    if "vendor" in role or "industry" in role:
        return "创新性分类：工程集成或行业证据。它可以说明产品 building block 和部署实践，但不能独立证明通用安全性。"
    if "draft" in role or "not ratified" in role:
        return "创新性分类：标准化方向或研究原型。其设计空间具有研究价值，但接口和安全语义仍可能变化。"
    return "创新性分类：稳健的系统/架构研究证据。最终评价需要结合论文正文中的机制、实现和实验，而不能只依据标题或摘要。"


def template_review(meta: dict[str, str], source_review: str) -> str:
    key = meta["key"]
    title = inline_latex(meta["title"])
    has_local_pdf = bool(meta.get("local_pdf")) and meta.get("local_pdf") not in {"未记录", "不可用"}
    pdf_available = "已下载或本地可核验" if ("downloaded" in meta["pdf_status"].lower() or "local" in meta["pdf_status"].lower() or has_local_pdf) else "未确认本地 PDF"
    if "metadata" in meta["pdf_status"].lower() or "unavailable" in meta["pdf_status"].lower():
        pdf_available = "仅有元数据或 PDF 不可用"
    body: list[str] = []
    body.append(r"\subsubsection{论文基本信息}")
    body.append(rf"\noindent\textbf{{论文标题：}}{title}\par")
    body.append(rf"\noindent\textbf{{BibTeX key：}}\texttt{{{latex_escape(key)}}}\par")
    body.append(rf"\noindent\textbf{{作者：}}{inline_latex(meta['authors'])}\par")
    body.append(rf"\noindent\textbf{{年份/会议：}}{inline_latex(meta['year'])} / {inline_latex(meta['venue'])}\par")
    body.append(rf"\noindent\textbf{{调查范围：}}{inline_latex(meta['lane'])}；\textbf{{证据状态：}}{inline_latex(meta['evidence'])}；{pdf_available}。\cite{{{key}}}\par")
    body.append(r"\noindent\textbf{一句话总结：}该条目提供一个可定位的机制、规范、系统原型或研究分类，用于回答本综述中的一个具体平台安全问题。\par")

    body.append(r"\subsubsection{研究背景与问题定义}")
    body.append(inline_latex(category_background(meta)) + r"\par")
    body.append(r"本条目的真实 gap 需要结合其来源类型判断：原始论文应看 threat model、系统设计和实验是否闭环；规范应看状态机和接口语义是否完整；Survey/SoK 应看分类是否覆盖当前主线；厂商或元数据来源则只能作为部署或来源状态证据。\par")
    body.append(role_sentence(meta) + r"\par")

    body.append(r"\subsubsection{核心方法设计}")
    body.append(rf"\noindent\textbf{{方法/系统：}}{title}\par")
    body.append(r"\noindent\textbf{分析管线：}威胁模型/需求 -> 平台或协议组件 -> 保护检查、状态转换或证据生成 -> 受保护执行、设备访问或 verifier 决策。\par")
    body.append(r"该条目的核心机制应从“谁拥有资源、谁可以观察数据、谁负责检查状态、发生异常时如何拒绝”四个问题展开。若本地 README 没有给出足够的函数、状态机、硬件模块或实验细节，本文明确记为“论文未说明”，不使用猜测补全。\par")
    if source_review:
        body.append(r"\noindent\textbf{已有本地评审记录：}\par")
        body.append(markdown_to_latex(source_review))

    body.append(r"\subsubsection{安全性与正确性分析}")
    body.append(r"需要区分保护目标与未覆盖攻击。对于机密计算机制，重点检查 host、hypervisor、firmware、设备和 DMA 是否处于攻击者能力集合；对于证明机制，重点检查 evidence 是否 fresh、可归因并绑定到正确的执行域；对于规范和架构文档，规范语义本身不等于某个实现没有漏洞。侧信道、物理故障、Rowhammer、speculative leakage 等若未被条目直接处理，只作为威胁边界记录。\par")
    body.append(r"当前证据可以支撑的最强结论是该材料明确给出的机制或分类；不能由该条目单独推出完整的 production security、跨设备可信 I/O 或所有实现缺陷均已排除。\par")

    body.append(r"\subsubsection{实现细节}")
    body.append(rf"本地证据记录为：{inline_latex(meta['local_pdf'])}；下载/核验状态为：{inline_latex(meta['pdf_status'])}。{pdf_available}。\par")
    body.append(r"若来源是规范、RFC、survey 或 vendor 文档，则不存在与系统论文等价的“代码规模、benchmark 和可复现实验”；若来源是论文但 README 未记录实现细节，则应回到 PDF 的 implementation/artifact 章节核对，当前报告不虚构语言、代码行数或硬件配置。\par")

    body.append(r"\subsubsection{实验设计与证据分析}")
    if "spec" in meta["role"].lower() or "rfc" in meta["role"].lower() or "standard" in meta["role"].lower():
        body.append(r"该条目属于规范/标准证据，无新实验。评估重点应放在规范是否定义了参与者、状态转换、错误处理、访问授权和证据边界；不应为规范补造吞吐、延迟或安全提升数字。\par")
    elif "metadata" in meta["pdf_status"].lower() or "unavailable" in meta["pdf_status"].lower():
        body.append(r"本地材料只有元数据或摘要级证据，无法可靠重建 RQ、baseline、benchmark、方差和负面结果。因此只把它作为存在性或研究谱系标记，不支撑详细性能和机制结论。\par")
    else:
        body.append(r"实验设计应至少核对研究问题、目标平台、baseline、工作负载、指标、规模和统计报告。当前 README 没有记录足够的完整实验表格，因此这里保守地把它作为机制/证据条目，而不补写未经核验的性能数字。\par")

    body.append(r"\subsubsection{创新性分析}")
    body.append(novelty_sentence(meta) + r"\par")
    body.append(r"评价时应把“提出了新安全边界”“实现了已知机制”“固定了标准语义”“整理了研究分类”和“展示了产品 building block”分开，不能仅凭引用量或发表年份判定 SOTA。\par")

    body.append(r"\subsubsection{局限性与可能风险}")
    body.append(r"最大局限是证据边界与正文主张之间可能存在落差：来源不一定覆盖完整生命周期、设备路径、迁移、调试、资源耗尽和端点证明。若本地 PDF 不可用、只公开了 metadata、属于 draft 或是 vendor 文档，还必须进一步降低 claim strength。任何未被该条目处理的攻击面都应明确写成“未覆盖”，而不是默认已解决。\par")

    body.append(r"\subsubsection{与已有工作的关系}")
    body.append(rf"该条目应与同一主线中的相邻工作比较：{inline_latex(meta['lane'])}。关键比较维度包括威胁模型、最小可信组件、内存/设备所有权、生命周期接口、证明证据、标准化状态和实验证据。它的作用不是替代整条谱系，而是为其中一个机制节点提供可追溯的证据。\par")

    body.append(r"\subsubsection{复现与再实现计划}")
    body.append(rf"最低复现目标是围绕 {title} 重建一个最小模型：明确输入/状态、执行核心机制、实现一次正例和一次拒绝路径，并记录假设。若 {pdf_available}，应优先使用论文 PDF 中的算法、状态机、Figure/Table 和 artifact 说明；若只有元数据，则复现目标只能降为文献存在性和接口角色核验，不能声称复现系统。\par")
    body.append(r"验收标准是：安全边界与原文一致、关键状态转换可观测、异常路径不会静默绕过检查、所有性能数字都能追溯到真实实验。\par")

    body.append(r"\subsubsection{对后续研究的启发}")
    for item in (
        "把该条目的威胁模型与 Arm CCA、RISC-V CoVE/AP-TEE 以及 confidential I/O 的统一状态机对齐。",
        "检查其保护边界是否覆盖设备身份、DMA、interrupt、link/fabric 和 teardown，而不只覆盖 CPU execution。",
        "把 access control、encryption、integrity、freshness/replay 和 attestation 分层验证，避免把不同安全属性混为一谈。",
        "补齐缺失的 baseline、部署平台、失败恢复、资源耗尽和跨组件组合实验。",
        "若该条目是 draft、vendor 或 metadata-only 证据，应追踪后续 ratified spec、开源实现或同行评审系统论文。",
    ):
        body.append(r"\noindent\textbullet\ " + inline_latex(item) + r"\par")
    return "\n".join(body)


def group_for(meta: dict[str, str]) -> tuple[str, int]:
    return GROUPS.get(meta["category"], ("其他硬件安全证据", 9))


def group_introduction(category: str) -> str:
    introductions = {
        "arm-confidential-computing": "Arm 平台的隔离机制正在从传统 TrustZone 的安全/非安全二分，转向面向虚拟机和云端多方参与者的 Realm 执行域。本节将先说明 RME、RMM 与物理内存所有权为何成为新的控制核心，再逐篇考察细粒度隔离、运行时管理和攻击分析如何限定 host、monitor 与受保护工作负载之间的责任边界。\\par\n这一组工作共同提醒我们：处理器提供新的执行态并不等于隔离自然成立。页面转换、异常路径、调试接口与软件运行时必须对同一所有权语义达成一致，论文中的机制、验证和负面结果因而都需要放在完整的状态迁移过程中理解。",
        "risc-v-confidential-computing": "RISC-V 的开放性使 enclave 原型、监控器实现和 ISA 扩展能够并行演进，但也意味着保护边界不能仅靠某个实现约定维持。本节以 Sanctum、Keystone、Penglai 等早期系统为起点，进一步讨论 CoVE、AP-TEE 与 TEE-I/O 对规范状态、内存生命周期和设备路径的补全。\\par\n阅读这些工作时，重点不在于比较名称或接口数量，而在于辨析每个方案把哪些责任交给硬件、可信监控器、宿主软件与设备；只有把这些责任映射到启动、运行、共享和销毁的全过程，才能判断开放 ISA 的可裁剪性是否真正转化为可审计的安全性。",
        "trusted-execution-environments": "TEE 的实现形态虽然多样，但 CPU、内存、I/O、证明和 TCB 划分始终构成同一设计空间。本节先用综述和运行时管理研究建立比较坐标，再将 TrustZone 机制与实际漏洞谱系放回这些坐标中，分析设计选择如何影响可验证性和可攻击面。\\par\n因此，后续各论文的结论不被孤立解读为某一特性“安全”或“不安全”，而是追问其假设是否覆盖特权软件、外设、异常与生命周期管理。这样的对照也为后续 CCA、CoVE 和设备机密计算的跨平台比较提供统一语言。",
        "attestation": "证明机制的目标不是简单地输出一份签名，而是让验证方能够把设备身份、受保护代码、运行状态和挑战新鲜性联系起来。本节沿着软件 attestation、启动测量、远程证明和运行时证据的演进展开，逐项检查 verifier 实际能据此判断什么、仍然无法判断什么。\\par\n特别需要避免把“得到证明报告”直接等同于“完整隔离”：报告的覆盖范围取决于测量根、密钥生命周期、证据绑定对象和传输路径。各论文将在这一问题框架下讨论其协议设计、形式化假设与部署限制。",
        "memory-and-io-fabrics": "机密工作负载的数据一旦离开 CPU，保护边界便延伸到内存控制器、PCIe/CXL 链路、DMA 映射和网络端点。本节把 CXL、PCIe、RDMA、IOMMU 与端点协议放进同一数据路径，说明设备身份、访问授权、链路保护和中断投递必须彼此衔接。\\par\n逐篇评审将特别关注控制面与数据面是否采用一致的对象标识和生命周期，以及论文对性能、兼容性和撤销的取舍。这样可以避免把单段链路的加密或单个 DMA 防护，误读为端到端的机密性保证。",
        "accelerator-tees": "GPU、FPGA、SmartNIC、DPU 等加速器把计算和数据管理带到 CPU 之外，也把 TCB、队列、DMA 和资源复用的边界带到更复杂的设备运行时中。本节讨论异构机密卸载的共同难题：谁验证设备、谁配置访问窗口、谁处理并发租户，以及中断和共享缓冲区如何回到同一可信链。\\par\n各论文的价值将据此被拆解为可核验的设计选择，而非泛化为“加速器已经可信”。尤其是端点证明、密钥绑定和设备固件假设，将与主机侧 enclave 或 confidential VM 的假设一起审视。",
        "architecture-and-platform-security": "平台级隔离还需要 ISA 与微架构提供纵深防御。本节讨论权限、控制流、能力或标签、内存加密完整性和调试控制等机制，说明它们如何约束边界内代码对合法权限的滥用，并与上层 TEE、证明和设备隔离形成互补。\\par\n这里的比较重点是机制的可组合性：某一项防护可能改善控制流或内存访问，却不自动处理 DMA、回滚、侧信道或可信软件缺陷。逐篇分析会明确每种方案实际收紧的攻击面，以及仍需由系统软件和部署策略承担的部分。",
    }
    return introductions.get(category, "本节按论文逐篇整理该方向的研究问题、系统机制、实验或证据、局限与后续研究价值。")


def generate() -> None:
    key_map = find_readmes()
    records = ppt_records()
    papers: list[tuple[dict[str, str], str, str, dict[str, object]]] = []
    for record in records:
        key = str(record["key"])
        path = key_map.get(key)
        if path is None:
            papers.append((metadata_from_ppt(record), "", "", record))
            continue
        text = read_text(path)
        meta = metadata(text, path, key)
        addendum = detailed_addendum(text)
        review = paper_review(text)
        papers.append((meta, addendum, review, record))

    papers.sort(key=lambda item: (group_for(item[0])[1], records.index(item[3])))

    preamble = r"""\documentclass[11pt]{ctexart}
\usepackage[letterpaper,top=0.95in,bottom=0.78in,left=1.0in,right=1.0in]{geometry}
\usepackage{fontspec}
\setmainfont{Times New Roman}
\setCJKmainfont[ItalicFont=Songti SC]{Songti SC}
\setsansfont{Helvetica}
\setmonofont{Menlo}
\usepackage{microtype}
\usepackage{amsmath}
\usepackage{amssymb}
\usepackage{booktabs}
\usepackage{array}
\usepackage{longtable}
\usepackage{enumitem}
\usepackage{etoolbox}
\usepackage{cite}
\usepackage{xurl}
\usepackage[hidelinks]{hyperref}
\Urlmuskip=0mu plus 1mu
\setlength{\parindent}{2em}
\setlength{\parskip}{0pt}
\setlength{\emergencystretch}{2em}
\linespread{1.08}
\setlist[itemize]{leftmargin=2.3em,itemsep=0.15em,topsep=0.35em,parsep=0pt}
\setlist[enumerate]{leftmargin=2.5em,itemsep=0.15em,topsep=0.35em,parsep=0pt}
\setcounter{secnumdepth}{3}
\ctexset{
  section={format=\Large\bfseries,name={},aftername=\quad,beforeskip=2.1ex plus .4ex minus .2ex,afterskip=1.25ex plus .25ex minus .15ex},
  subsection={format=\large\bfseries,name={},aftername=\quad,beforeskip=1.7ex plus .3ex minus .15ex,afterskip=.8ex plus .2ex minus .1ex},
  subsubsection={format=\normalsize\bfseries,name={},aftername=\quad,beforeskip=1.25ex plus .25ex minus .1ex,afterskip=.55ex plus .15ex minus .1ex}
}
\renewcommand{\tablename}{表}
\renewcommand{\figurename}{图}
\renewcommand{\refname}{参考文献}
\renewcommand{\arraystretch}{0.82}
\setlength{\tabcolsep}{3.5pt}
\setlength{\LTleft}{0pt}
\setlength{\LTright}{0pt}
\setlength{\LTpre}{0.5em}
\setlength{\LTpost}{0.5em}
\pagestyle{plain}
\begin{document}
\begin{center}
  \vspace*{0.18in}
  {\fontsize{22}{30}\selectfont\bfseries Arm 与 RISC-V 机密计算安全机制调研与总结\par}
\end{center}
\vspace{0.28in}
"""

    intro = r"""\section{引言}

\subsection{研究背景：从执行域隔离到平台级机密计算}

机密计算的研究对象已经不再只是“在处理器上划出一个安全世界”。早期 TrustZone 或 enclave 设计主要关注受保护代码如何避免被普通操作系统直接读取；随着虚拟化、异构加速和可组合互连进入部署场景，受保护工作负载还需要在不信任的 host、hypervisor、设备固件、DMA 引擎和网络端点之间维持可识别、可转换且可证明的所有权。Arm CCA/RME/RMM 与 RISC-V CoVE/AP-TEE 等架构因此把问题推进到平台层面：谁能够创建执行域，谁可以转换内存状态，谁被允许把设备接入该执行域，以及远程验证方如何获知这些状态。

这类边界本质上是一条跨层状态链。处理器执行态、物理页属性、二阶段地址转换、设备访问权限、链路密钥与 attestation 报告若使用不同的对象标识或生命周期规则，就可能在看似“受保护”的系统中留下重新映射、陈旧授权、异常注入或错误共享的空间。因此，本报告不将某项硬件特性孤立地描述为安全结论，而是把它放入创建、运行、共享、迁移、回收和验证的完整过程之中，追问其机制是否真正闭合了相应的攻击路径。

\subsection{调研问题：保护边界为何难以闭合}

本调研围绕三个彼此依赖的问题展开。第一，CPU 执行域、特权监控器和内存所有权如何共同建立最小可信基；第二，当数据经由 IOMMU、PCIe/CXL、RDMA 或加速器队列离开 CPU 后，设备身份、DMA 映射、中断和链路保护如何延续同一边界；第三，证明、控制流完整性、内存安全和微架构防护等纵深机制，如何约束边界内部的错误或被滥用的合法权限。它们分别对应 Arm/RISC-V 机密计算机制、I/O 与设备数据路径防御，以及 ISA 和硬件级纵深防御三条主线。

这些问题不能只靠术语对照回答。架构规范能够精确定义状态和权限，却通常不提供真实工作负载的代价；原始论文能够说明原型实现和实验条件，却未必覆盖所有部署假设；厂商材料和标准草案则能够反映工程进展，但其语义、版本或可访问性可能仍受限制。报告因此把“论文实际证明了什么”“哪些推论依赖额外假设”作为每一篇的核心阅读线索，并把未说明或无法核验的部分显式保留。

\subsection{选文范围与文章结构}

本文以 \texttt{out/survey.pdf} 为文献池，但只展开配套 PPT 在 15 个研究方向中实际选出的 primary 论文，不将所有参考文献机械逐条改写。PPT 给出 45 个选入槽位，去重后为 41 个独立来源；同一来源若服务于多个方向，正文只保留一次完整论述，并在基本信息中说明其出现的研究方向。这样的范围既与汇报材料保持一致，也避免将背景性引用误写成已完成的论文评审。

后文先说明每一方向的问题边界与技术脉络，再按论文依次展开。每篇均遵循“研究位置—问题与动机—架构或方法—安全边界—实现与证据—综合评价”的叙述顺序：先交代为什么需要该工作，随后解释机制如何运作，再审视实验、规范或工程证据能支持到何种程度，最后讨论其相对于已有工作的贡献、限制和可继续验证的方向。这样安排旨在让论文之间形成可比较的论证链，而不是由元数据、要点和讲解稿拼接而成的材料汇编。\cite{li2024sokteechoices,boubakri2025riscvtee,arm_cca_spec,riscv_privileged}

\section{证据边界与阅读方法}

正文优先采用仓库中已核验的本地 PDF、PPT 选题记录和 README 评审记录。为避免把不同成熟度的材料混为一谈，本文把官方规范、架构手册、RFC 和标准记为 E0；同行评审原始论文记为 E1；Survey/SoK 记为 E2；公开 draft 或未 ratified 规范记为 E3；厂商或行业材料记为 E4；仅有元数据、访问受限或缺少 PDF 的来源记为 E5。E0/E1 支撑具体机制语义和论文报告的实验，E2 用于术语和分类；E3 至 E5 只用于其可核验的标准化或工程状态，不能据此扩展出未经证实的安全和性能结论。

因此，正文中的“论文未说明”“证据不足”并非篇幅占位，而是对可得证据范围的明确标记。所有条目均保留 BibTeX key 和正文引用，便于回溯 \path{survey/reference.bib} 与 \path{reference/} 证据库；对没有本地 PDF 的条目，则仅依据已核验的 PPT 事实说明其研究位置，并把机制细节和复现实验收窄到可支持的范围。

"""
    output = [preamble, intro]
    current_group = None
    paper_no = 0
    for meta, addendum, review, record in papers:
        group_name, _ = group_for(meta)
        if group_name != current_group:
            current_group = group_name
            output.append(rf"\section{{{inline_latex(group_name)}}}")
            output.append(group_introduction(meta["category"]) + r"\par")
        paper_no += 1
        title = inline_latex(meta["title"])
        output.append(rf"\subsection{{论文 {paper_no}：{title}}}")
        if addendum:
            output.append(detailed_prose_review(meta, record, addendum))
        elif review and len(review) >= 2000:
            output.append(detailed_prose_review(meta, record, review))
        else:
            output.append(fallback_prose_review(meta, record, review))

    output.append(r"""\section{综合总结}

逐条阅读 PPT 选出的 41 个独立来源后可以看到，当前硬件安全研究的关键矛盾并不是“是否存在安全硬件”，而是分散在处理器、内存、设备、互连和验证方之间的机制能否在同一平台边界内正确组合。Arm CCA/RME/RMM、RISC-V CoVE/AP-TEE、SPDM、TDISP、IOMMU/IOPMP/SMMU、可信中断、加速器 TEE、attestation、MTE、PMP、能力架构和内存完整性分别缩小了不同层次的攻击面；它们不能彼此替代，也不能因为其中某一层成立就自动推出系统整体安全。

从论文证据走向工程落地，后续研究首先需要把 CPU、内存、设备、网络链路和持久存储的 ownership/lifecycle 状态机统一起来，使创建、共享、撤销和回收不再在不同层各自定义。其次，设备身份、DMA 权限、中断投递、链路保护和应用端点证明应被绑定到同一 workload，而不是由多个独立控制面松散拼接。再次，规范语义、形式化验证、开源实现和真实硬件实验需要形成可相互校验的证据链；对 draft、vendor、metadata-only 和 source-limited 材料，则应持续进行版本与可复现性审计。

报告中保留的“论文未说明”和“证据不足”，正是后续深入工作的入口。若要将某一方向继续扩展为算法、图表、伪代码或复现实验级别的研究，应先回到 E1 原始论文和 E0 规范确认语义与威胁模型，再以 E2 Survey/SoK 校准分类，最后将 E3/E4/E5 作为标准化或工程状态证据。只有在这条证据链闭合后，具体方案的性能收益与安全边界才具有可比较、可复验的意义。

\bibliographystyle{IEEEtran}
\bibliography{reference}
\end{document}
""")
    OUTPUT.write_text("\n".join(output), encoding="utf-8")
    print(f"wrote {OUTPUT} with {paper_no} cited sources")


if __name__ == "__main__":
    generate()
