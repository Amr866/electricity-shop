"use client";

import React from "react";
import {
  Lightbulb,
  Info,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

interface ArticleContentRendererProps {
  content: string;
}

export function ArticleContentRenderer({ content }: ArticleContentRendererProps) {
  // Parse paragraphs, headings, callouts, tables, and lists
  const renderedElements = React.useMemo(() => {
    if (!content) return null;

    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[][] = [];
    let tableHeader: string[] = [];
    let inCallout: "TIP" | "NOTE" | "WARNING" | "CAUTION" | null = null;
    let calloutLines: string[] = [];

    const flushCallout = (keyIndex: number) => {
      if (inCallout && calloutLines.length > 0) {
        const text = calloutLines.join("\n").trim();
        const type = inCallout;

        let borderClass = "border-amber-400/80 bg-amber-500/10 text-amber-950 dark:text-amber-200";
        let Icon = Lightbulb;
        let title = "نکته طلایی کارگاهی";

        if (type === "NOTE") {
          borderClass = "border-blue-400/80 bg-blue-500/10 text-blue-950 dark:text-blue-200";
          Icon = Info;
          title = "توجه مهم";
        } else if (type === "WARNING") {
          borderClass = "border-rose-400/80 bg-rose-500/10 text-rose-950 dark:text-rose-200";
          Icon = AlertTriangle;
          title = "هشدار ایمنی برق";
        } else if (type === "CAUTION") {
          borderClass = "border-orange-400/80 bg-orange-500/10 text-orange-950 dark:text-orange-200";
          Icon = ShieldAlert;
          title = "احتیاط فنی";
        }

        elements.push(
          <div
            key={`callout-${keyIndex}`}
            className={`my-6 rounded-2xl p-4 sm:p-5 border-r-4 border ${borderClass} shadow-xs space-y-2`}
          >
            <div className="flex items-center gap-2 font-black text-xs sm:text-sm">
              <Icon className="w-4 h-4 shrink-0" />
              <span>{title}</span>
            </div>
            <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium opacity-90">
              {text}
            </div>
          </div>
        );

        inCallout = null;
        calloutLines = [];
      }
    };

    const flushTable = (keyIndex: number) => {
      if (inTable) {
        elements.push(
          <div key={`table-wrapper-${keyIndex}`} className="my-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <table className="w-full text-right text-xs sm:text-sm">
              {tableHeader.length > 0 && (
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 font-extrabold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    {tableHeader.map((th, idx) => (
                      <th key={idx} className="p-3 sm:p-3.5 whitespace-nowrap">
                        {th.replace(/\*\*/g, "").trim()}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {tableRows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className={
                      rIdx % 2 === 0
                        ? "bg-white dark:bg-slate-900/60"
                        : "bg-slate-50/50 dark:bg-slate-850/40"
                    }
                  >
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-3 sm:p-3.5 align-middle">
                        {renderFormattedInline(cell.replace(/\*\*/g, "").trim())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

        inTable = false;
        tableHeader = [];
        tableRows = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Handle Callouts
      if (trimmed.startsWith("> [!TIP]")) {
        flushTable(i);
        flushCallout(i);
        inCallout = "TIP";
        continue;
      } else if (trimmed.startsWith("> [!NOTE]")) {
        flushTable(i);
        flushCallout(i);
        inCallout = "NOTE";
        continue;
      } else if (trimmed.startsWith("> [!WARNING]")) {
        flushTable(i);
        flushCallout(i);
        inCallout = "WARNING";
        continue;
      } else if (trimmed.startsWith("> [!CAUTION]")) {
        flushTable(i);
        flushCallout(i);
        inCallout = "CAUTION";
        continue;
      }

      if (inCallout) {
        if (trimmed.startsWith(">")) {
          calloutLines.push(trimmed.replace(/^>\s*/, ""));
          continue;
        } else if (trimmed === "") {
          continue;
        } else {
          flushCallout(i);
        }
      }

      // Handle Markdown Tables
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        // Divider row like |:---|:---|
        if (/^\|(\s*[:-]+[-| :]*)\|$/.test(trimmed)) {
          continue;
        }
        const cells = trimmed
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());

        if (!inTable) {
          inTable = true;
          tableHeader = cells;
        } else {
          tableRows.push(cells);
        }
        continue;
      } else {
        if (inTable) {
          flushTable(i);
        }
      }

      // Handle Headings
      if (trimmed.startsWith("## ")) {
        elements.push(
          <h2
            key={`h2-${i}`}
            className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white mt-8 mb-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2"
          >
            <span className="w-1.5 h-6 rounded-full bg-amber-500 shrink-0" />
            <span>{trimmed.replace(/^##\s+/, "")}</span>
          </h2>
        );
        continue;
      }

      if (trimmed.startsWith("### ")) {
        elements.push(
          <h3
            key={`h3-${i}`}
            className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mt-6 mb-3"
          >
            {trimmed.replace(/^###\s+/, "")}
          </h3>
        );
        continue;
      }

      // Handle Horizontal Rule
      if (trimmed === "---") {
        elements.push(
          <hr
            key={`hr-${i}`}
            className="my-8 border-slate-200 dark:border-slate-800"
          />
        );
        continue;
      }

      // Handle Bullet Lists
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const itemText = trimmed.replace(/^[-*]\s+/, "");
        elements.push(
          <div key={`li-${i}`} className="flex items-start gap-2.5 my-2 mr-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {renderFormattedInline(itemText)}
            </div>
          </div>
        );
        continue;
      }

      // Handle Numbered Lists
      if (/^\d+\.\s+/.test(trimmed)) {
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          elements.push(
            <div key={`ol-${i}`} className="flex items-start gap-2.5 my-2.5 mr-2">
              <span className="w-5 h-5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-black flex items-center justify-center shrink-0 border border-slate-300/60 dark:border-slate-700">
                {numMatch[1]}
              </span>
              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-0.5">
                {renderFormattedInline(numMatch[2])}
              </div>
            </div>
          );
          continue;
        }
      }

      // Standard Paragraph
      if (trimmed !== "") {
        elements.push(
          <p
            key={`p-${i}`}
            className="text-xs sm:text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed sm:leading-loose my-3 font-normal text-justify"
          >
            {renderFormattedInline(trimmed)}
          </p>
        );
      }
    }

    // Flush any pending callouts or tables at end
    flushCallout(lines.length);
    flushTable(lines.length);

    return elements;
  }, [content]);

  return <div className="article-body space-y-1">{renderedElements}</div>;
}

// Helper to render bold text and inline code nicely
function renderFormattedInline(text: string): React.ReactNode {
  // Simple parser for **bold** and `code`
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-extrabold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="font-mono text-xs bg-slate-100 dark:bg-slate-800 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 dir-ltr inline-block mx-0.5"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
