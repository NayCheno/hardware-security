## Design Document

## 1. Profile Baseline Declaration

- **Profile selection**: `profiles/academic.md`
- **Selection rationale**: This is a hardware security academic survey/research report targeting researchers, engineers, and graduate students in computer architecture and security.
- **Referenced dimensions**: Information density, color guidance (restrained academic palette), font hierarchy, layout patterns
- **Deviation notes**: Higher information density than typical classroom presentations; more technical depth per slide

## 2. Style Baseline Declaration

- **Style anchor**: Academic research presentation style (similar to USENIX/NDSS conference talk slides)
- **Referenced dimensions**: Layout structure (title + body), color restraint, clear typographic hierarchy, evidence-based content presentation
- **Reference scope**: Style + color scheme + layout (content from user's research materials)

## 3. Extracted Style

### Typographic Character
Academic rigor with moderate information density — clean, structured, professional

### Color Extraction
- **primary**: "#2563EB" — Deep blue for titles, navigation, key anchors (academic blue)
- **secondary**: "#64748B" — Slate gray for secondary text, annotations
- **accent**: "#DC2626" — Red for emphasis, evidence labels, key data points (from reference style)
- **background**: "#FFFFFF" — White background
- **text**: "#1F2937" — Dark gray for body text
- **surface**: "#F8FAFC" — Light gray for card backgrounds

### Font Hierarchy
- **Chinese fonts**: "MiSans, MiSans" (现代清晰)
- **English fonts**: "Inter, MiSans" (学术风格)
- Title: 36px, bold, primary color
- Subtitle: 24px, secondary color
- Body: 18-20px, text color, lineHeight 1.5
- Annotation: 14px, secondary color

### Container and Decoration
- Card structures: Subtle rounded rectangles (radius 4px) with light gray background
- Content separation: White space + thin horizontal lines (1px, #E2E8F0)
- Decorative elements: Left accent bars (4px wide, primary color) for section headers

### Image Style
- Minimal decorative imagery — this is a technical survey
- Tables: Clean academic style, three-line table aesthetic
- Charts: Minimal flat style, monochrome primary color family

## 4. Layout System

### Global Layout
- Page size: 1280 x 720 (16:9)
- Margins: 60px left/right, 50px top/bottom
- Navigation: Top-left direction label, top-right page category badge
- Footer: Source citation line at bottom

### Special Pages
- Cover: Centered title, subtitle, author info on white background with subtle blue accent bar
- TOC: Two-column layout with chapter list
- Chapter divider: Full-width primary color band with white chapter title

### Content Page Layouts
- **Paper detail page**: Left accent bar + title area + body content area (full width)
- **Comparison page**: Two-column or three-column card layout
- **Direction intro**: Title + bullet points + evidence matrix

## 5. Style Usage Rules

- `$title` style: Cover title, chapter titles, page titles
- `$subtitle` style: Paper names, section headers within pages
- `$body` style: Main content text, bullet points
- `$caption` style: Source citations, evidence labels, footnotes
- `$primary` color: Titles, accent bars, key numbers
- `$accent` color: Evidence badges, important highlights
- `$surface` color: Card backgrounds, alternating table rows

## 6. Risk Prohibitions

- **No gradients**: Keep flat academic style
- **No rounded corners above 4px**: Maintain sharp academic feel
- **No decorative icons**: Technical survey, not marketing deck
- **Body font minimum 18px**: Ensure readability for dense technical content
- **Title font minimum 28px**: Maintain visual hierarchy
- **No all-caps text**: Academic style uses normal case
- **No center-aligned body text**: Left-aligned for readability
- **No blue-purple gradients**: Stick to flat blue/gray palette

## 7. Theme Definition

```yaml
theme:
  colors:
    primary: "#2563EB"
    secondary: "#64748B"
    accent: "#DC2626"
    background: "#FFFFFF"
    text: "#1F2937"
    surface: "#F8FAFC"
    border: "#E2E8F0"
    lightText: "#9CA3AF"
  textStyles:
    title:
      fontSize: 36
      color: "$primary"
      fontFamily: "Inter, MiSans"
      fontWeight: "bold"
      lineHeight: 1.3
    subtitle:
      fontSize: 24
      color: "$secondary"
      fontFamily: "Inter, MiSans"
      lineHeight: 1.4
    body:
      fontSize: 18
      color: "$text"
      fontFamily: "Inter, MiSans"
      lineHeight: 1.5
    caption:
      fontSize: 14
      color: "$secondary"
      fontFamily: "Inter, MiSans"
      lineHeight: 1.4
    badge:
      fontSize: 12
      color: "#FFFFFF"
      fontFamily: "Inter, MiSans"
      backgroundColor: "$accent"
  tableStyles:
    default:
      fontSize: 16
      fontFamily: "Inter, MiSans"
      headerFill: "$primary"
      headerColor: "#FFFFFF"
      headerBold: true
      bodyFill: ["#FFFFFF", "$surface"]
      bodyColor: "$text"
      border:
        style: "solid"
        width: 1
        color: "$border"
```
