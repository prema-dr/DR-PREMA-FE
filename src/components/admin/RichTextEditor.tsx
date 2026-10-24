"use client";

import { useRef } from "react";
import {
  LinkSimpleIcon as LinkSimple,
  ListBulletsIcon as ListBullets,
  ListNumbersIcon as ListNumbers,
  QuotesIcon as Quotes,
  TextBIcon as TextB,
  TextItalicIcon as TextItalic,
  TextUnderlineIcon as TextUnderline,
} from "@phosphor-icons/react/dist/ssr";

type Tool = { label: string; command: string; value?: string; content: React.ReactNode };

const TOOLS: (Tool | "sep")[] = [
  { label: "Heading", command: "formatBlock", value: "h2", content: <span className="text-[13px] font-bold">H2</span> },
  { label: "Subheading", command: "formatBlock", value: "h3", content: <span className="text-[13px] font-bold">H3</span> },
  { label: "Paragraph", command: "formatBlock", value: "p", content: <span className="text-[13px] font-bold">¶</span> },
  "sep",
  { label: "Bold", command: "bold", content: <TextB size={16} weight="bold" /> },
  { label: "Italic", command: "italic", content: <TextItalic size={16} weight="bold" /> },
  { label: "Underline", command: "underline", content: <TextUnderline size={16} weight="bold" /> },
  "sep",
  { label: "Bulleted list", command: "insertUnorderedList", content: <ListBullets size={16} weight="bold" /> },
  { label: "Numbered list", command: "insertOrderedList", content: <ListNumbers size={16} weight="bold" /> },
  { label: "Quote", command: "formatBlock", value: "blockquote", content: <Quotes size={16} weight="bold" /> },
  { label: "Link", command: "createLink", content: <LinkSimple size={16} weight="bold" /> },
];

/** Minimal rich-text editor. Output is HTML; the backend sanitises it before saving. */
export function RichTextEditor({ initialHtml, onChange }: { initialHtml: string; onChange: (html: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  function run(tool: Tool) {
    let value = tool.value;
    if (tool.command === "createLink") {
      const url = window.prompt("Link URL (https://…)");
      if (!url || !/^(https?:\/\/|mailto:)/i.test(url)) return;
      value = url;
    }
    ref.current?.focus();
    document.execCommand(tool.command, false, value);
    onChange(ref.current?.innerHTML ?? "");
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-rose-100 bg-white focus-within:border-rose-400 focus-within:ring-4 focus-within:ring-rose-100">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-rose-100 bg-rose-50/50 p-1.5">
        {TOOLS.map((tool, i) =>
          tool === "sep" ? (
            <span key={i} className="mx-1 h-5 w-px bg-rose-200" />
          ) : (
            <button
              key={tool.label}
              type="button"
              title={tool.label}
              aria-label={tool.label}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => run(tool)}
              className="flex size-8 items-center justify-center rounded-lg text-rose-900/70 transition-colors hover:bg-white hover:text-rose-600"
            >
              {tool.content}
            </button>
          ),
        )}
      </div>
      <div
        ref={(node) => {
          ref.current = node;
          // Seed once; afterwards the DOM is the source of truth so the caret never jumps.
          if (node && !node.dataset.ready) {
            node.dataset.ready = "1";
            node.innerHTML = initialHtml;
          }
        }}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label="Article content"
        data-placeholder="Start writing your article…"
        onInput={() => onChange(ref.current?.innerHTML ?? "")}
        onPaste={(e) => {
          e.preventDefault();
          document.execCommand("insertText", false, e.clipboardData.getData("text/plain"));
        }}
        className="admin-prose min-h-[360px] px-5 py-4 text-[15px] text-rose-950 focus:outline-none"
      />
    </div>
  );
}
