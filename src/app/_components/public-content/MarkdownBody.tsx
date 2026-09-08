function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Validate untrusted Markdown destinations before escaping them into attributes. */
export function safeContentUrl(value: string): string | null {
  if (!value || /[\s\\<>"\u0000-\u001f\u007f]/.test(value)) return null;
  try {
    const decoded = decodeURIComponent(value);
    if (/[\\\u0000-\u001f\u007f]/.test(decoded) || decoded.startsWith("//")) return null;
    const scheme = value.match(/^([a-z][a-z\d+.-]*):/i);
    if (scheme && !/^https?:$/i.test(`${scheme[1]}:`)) return null;
    if (scheme && !/^https?:\/\//i.test(value)) return null;
    const url = new URL(value, "https://some-in-univ.com/");
    if (!/^https?:$/.test(url.protocol) || url.username || url.password) return null;
    return value;
  } catch {
    return null;
  }
}

function inlineMarkdown(value: string) {
  // Tokenize source, not escaped/generated HTML: code and attributes remain opaque.
  const tokens = /`([^`]+)`|(!?)\[([^\]]*)\]\(((?:[^()]|\([^()]*\))*)\)|\*\*([^*]+)\*\*|https?:\/\/[^\s<>]+/g;
  let html = "";
  let end = 0;
  for (const match of value.matchAll(tokens)) {
    html += escapeHtml(value.slice(end, match.index));
    end = match.index + match[0].length;
    const [, code, image, label, destination, bold] = match;
    if (code !== undefined) {
      html += `<code>${escapeHtml(code)}</code>`;
    } else if (label !== undefined) {
      const button = !image && label.startsWith("button:");
      const text = button ? label.slice(7) : label;
      const safe = safeContentUrl(destination);
      if (!safe) {
        html += escapeHtml(text);
      } else if (image) {
        const alt = text.trim() || "본문 첨부 이미지";
        html += `<a href="${escapeHtml(safe)}" target="_blank" rel="noopener noreferrer" class="public-content-image" aria-label="${escapeHtml(alt)} — 원본 이미지 확대 (새 탭)"><span data-content-media-frame style="display:block;position:relative;width:100%;aspect-ratio:3/4"><img src="${escapeHtml(safe)}" alt="${escapeHtml(alt)}" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain" /></span><span class="block text-sm">원본 이미지 확대 (새 탭)</span></a>`;
      } else {
        const style = button ? ' class="public-content-button inline-flex min-h-11 items-center rounded-xl border border-current px-4 py-2"' : "";
        html += `<a href="${escapeHtml(safe)}"${style} rel="noopener noreferrer">${escapeHtml(text)}</a>`;
      }
    } else if (bold !== undefined) {
      html += `<strong>${escapeHtml(bold)}</strong>`;
    } else {
      const url = match[0].replace(/[.,!?;:]+$/, "");
      const safe = safeContentUrl(url);
      html += safe
        ? `<a href="${escapeHtml(safe)}" rel="noopener noreferrer">${escapeHtml(new URL(safe).hostname)}</a>${escapeHtml(match[0].slice(url.length))}`
        : escapeHtml(match[0]);
    }
  }
  return html + escapeHtml(value.slice(end));
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
  return s.split(/(?<!\\)\|/).map((cell) => cell.trim().replace(/\\\|/g, "|"));
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
    '<p class="text-sm">표가 화면보다 넓으면 좌우로 스크롤해 확인하세요.</p>',
    '<div class="public-markdown-table-wrap" role="region" aria-label="본문 표 — 좌우 스크롤" tabindex="0">',
    "<table>",
    `<thead><tr>${th}</tr></thead>`,
    bodyRows.length > 0 ? `<tbody>${trs}</tbody>` : "",
    "</table>",
    "</div>",
  ].join("");
}

export function markdownToHtml(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const headingOffset = lines.some((line) => /^#\s+/.test(line.trim())) ? 1 : 0;
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

    if (/^(?:-{3,}|\*{3,}|_{3,})$/.test(line)) {
      flushParagraph();
      closeList();
      html.push("<hr />");
      i += 1;
      continue;
    }

    const fence = line.match(/^(`{3,}|~{3,})/);
    if (fence) {
      flushParagraph();
      closeList();
      i += 1;
      const code: string[] = [];
      while (i < lines.length && !lines[i].trim().startsWith(fence[1])) code.push(lines[i++]);
      if (i < lines.length) i += 1;
      html.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      const level = Math.min(6, Math.max(2, heading[1].length + headingOffset));
      html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      i += 1;
      continue;
    }

    if (line === ">" || line.startsWith("> ")) {
      flushParagraph();
      closeList();
      if (line !== ">") html.push(`<blockquote>${inlineMarkdown(line.slice(2))}</blockquote>`);
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
