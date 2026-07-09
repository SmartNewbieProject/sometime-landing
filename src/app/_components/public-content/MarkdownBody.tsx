function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g, (_match, alt, src) => {
      return `<img src="${src}" alt="${escapeHtml(alt)}" loading="lazy" />`;
    })
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

/** GFM 테이블 행: | a | b | 형태 (구분선 제외) */
function isTableRow(line: string) {
  const trimmed = line.trim();
  if (!trimmed.includes("|")) return false;
  if (isTableSeparator(trimmed)) return false;
  // 최소 한 칸 이상: | cell | 또는 cell | cell
  const cells = splitTableCells(trimmed);
  return cells.length >= 2;
}

/** | --- | :---: | ---: | */
function isTableSeparator(line: string) {
  const trimmed = line.trim();
  if (!trimmed.includes("|") || !trimmed.includes("-")) return false;
  const cells = splitTableCells(trimmed);
  if (cells.length === 0) return false;
  return cells.every((cell) => /^:?-{1,}:?$/.test(cell.replace(/\s+/g, "")));
}

function splitTableCells(line: string): string[] {
  let s = line.trim();
  if (s.startsWith("|")) s = s.slice(1);
  if (s.endsWith("|")) s = s.slice(0, -1);
  return s.split("|").map((cell) => cell.trim());
}

function parseAlignments(separatorLine: string): Array<"left" | "center" | "right"> {
  return splitTableCells(separatorLine).map((cell) => {
    const compact = cell.replace(/\s+/g, "");
    if (compact.startsWith(":") && compact.endsWith(":")) return "center";
    if (compact.endsWith(":")) return "right";
    return "left";
  });
}

function renderTable(
  headerCells: string[],
  alignments: Array<"left" | "center" | "right">,
  bodyRows: string[][],
): string {
  const th = headerCells
    .map((cell, i) => {
      const align = alignments[i] ?? "left";
      return `<th style="text-align:${align}">${inlineMarkdown(cell)}</th>`;
    })
    .join("");

  const trs = bodyRows
    .map((row) => {
      const tds = headerCells
        .map((_, i) => {
          const align = alignments[i] ?? "left";
          const cell = row[i] ?? "";
          return `<td style="text-align:${align}">${inlineMarkdown(cell)}</td>`;
        })
        .join("");
      return `<tr>${tds}</tr>`;
    })
    .join("");

  return [
    '<div class="public-markdown-table-wrap">',
    "<table>",
    `<thead><tr>${th}</tr></thead>`,
    bodyRows.length > 0 ? `<tbody>${trs}</tbody>` : "",
    "</table>",
    "</div>",
  ].join("");
}

export function markdownToHtml(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let paragraph: string[] = [];
  let inList = false;
  let i = 0;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    html.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
    paragraph = [];
  };

  const closeList = () => {
    if (!inList) return;
    html.push("</ul>");
    inList = false;
  };

  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      closeList();
      i += 1;
      continue;
    }

    // GFM table: header + separator + body rows
    if (
      isTableRow(line) &&
      i + 1 < lines.length &&
      isTableSeparator(lines[i + 1].trim())
    ) {
      flushParagraph();
      closeList();

      const headerCells = splitTableCells(line);
      const alignments = parseAlignments(lines[i + 1].trim());
      const bodyRows: string[][] = [];
      i += 2;

      while (i < lines.length) {
        const next = lines[i].trim();
        if (!next) break;
        if (!isTableRow(next)) break;
        bodyRows.push(splitTableCells(next));
        i += 1;
      }

      html.push(renderTable(headerCells, alignments, bodyRows));
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph();
      closeList();
      html.push(`<h3>${inlineMarkdown(line.slice(4))}</h3>`);
      i += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      closeList();
      html.push(`<h2>${inlineMarkdown(line.slice(3))}</h2>`);
      i += 1;
      continue;
    }

    if (line.startsWith("# ")) {
      flushParagraph();
      closeList();
      html.push(`<h1>${inlineMarkdown(line.slice(2))}</h1>`);
      i += 1;
      continue;
    }

    if (line.startsWith("> ")) {
      flushParagraph();
      closeList();
      html.push(`<blockquote>${inlineMarkdown(line.slice(2))}</blockquote>`);
      i += 1;
      continue;
    }

    if (line.startsWith("- ") || line.startsWith("* ")) {
      flushParagraph();
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${inlineMarkdown(line.slice(2))}</li>`);
      i += 1;
      continue;
    }

    // 번호 목록
    const ordered = line.match(/^\d+\.\s+(.+)$/);
    if (ordered) {
      flushParagraph();
      closeList();
      // 단순화: ol 누적 없이 개별 처리 대신 연속 번호 목록 수집
      const items: string[] = [ordered[1]];
      i += 1;
      while (i < lines.length) {
        const m = lines[i].trim().match(/^\d+\.\s+(.+)$/);
        if (!m) break;
        items.push(m[1]);
        i += 1;
      }
      html.push(
        `<ol>${items.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</ol>`,
      );
      continue;
    }

    paragraph.push(line);
    i += 1;
  }

  flushParagraph();
  closeList();
  return html.join("\n");
}

export function MarkdownBody({ content }: { content: string }) {
  return (
    <div
      className="public-markdown"
      dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
    />
  );
}
