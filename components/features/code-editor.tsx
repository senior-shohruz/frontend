"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Play, RotateCcw, Code2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CodeDraft } from "@/types";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div className="h-full bg-ink-100 animate-pulse" />,
});

interface CodeEditorProps {
  initialCode?: CodeDraft | null;
  onChange?: (code: CodeDraft) => void;
}

type Tab = "html" | "css" | "js";

export function CodeEditor({ initialCode, onChange }: CodeEditorProps) {
  const [activeTab, setActiveTab] = useState<Tab>("html");
  const [code, setCode] = useState<CodeDraft>({
    html: initialCode?.html ?? "<h1>Hello, world!</h1>\n",
    css: initialCode?.css ?? "h1 {\n  color: #d97a2c;\n  font-family: sans-serif;\n}\n",
    js: initialCode?.js ?? "console.log('Hello!');\n",
  });
  const [previewHtml, setPreviewHtml] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const runPreview = () => {
    const doc = `<!DOCTYPE html>
<html>
<head>
<style>body{margin:16px;font-family:system-ui,sans-serif;color:#222220;}${code.css || ""}</style>
</head>
<body>
${code.html || ""}
<script>
window.onerror = function(msg, src, line, col, err) {
  document.body.insertAdjacentHTML('beforeend',
    '<div style="position:fixed;bottom:0;left:0;right:0;background:#fef2f2;color:#991b1b;padding:8px 12px;font-family:ui-monospace,monospace;font-size:12px;border-top:1px solid #fecaca;">' +
    'Error: ' + msg + ' (line ' + line + ')</div>');
  return true;
};
try { ${code.js || ""} } catch(e) { window.onerror(e.message, '', 0, 0, e); }
</script>
</body>
</html>`;
    setPreviewHtml(doc);
  };

  // Auto-run on mount, then manually
  useEffect(() => {
    runPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced parent notify
  useEffect(() => {
    if (!onChange) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onChange(code), 800);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [code, onChange]);

  const reset = () => {
    setCode({
      html: initialCode?.html ?? "",
      css: initialCode?.css ?? "",
      js: initialCode?.js ?? "",
    });
  };

  const tabs: { key: Tab; label: string; lang: string }[] = [
    { key: "html", label: "HTML", lang: "html" },
    { key: "css",  label: "CSS",  lang: "css" },
    { key: "js",   label: "JS",   lang: "javascript" },
  ];

  return (
    <div className="border border-ink-200/70 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-ink-100 bg-ink-50/50 px-2 h-10">
        <div className="flex items-center gap-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-2.5 h-7 text-2xs font-mono uppercase tracking-wider rounded transition-colors ${
                activeTab === t.key
                  ? "bg-ink-900 text-white"
                  : "text-ink-500 hover:text-ink-900 hover:bg-ink-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowPreview((v) => !v)}
            className="text-ink-500 hover:text-ink-900 p-1.5 rounded hover:bg-ink-100"
            title={showPreview ? "Hide preview" : "Show preview"}
          >
            {showPreview ? <Code2 className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={reset}
            className="text-ink-500 hover:text-ink-900 p-1.5 rounded hover:bg-ink-100"
            title="Reset to starter code"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <Button size="sm" onClick={runPreview} className="h-7 text-xs">
            <Play className="h-3 w-3" />
            Run
          </Button>
        </div>
      </div>

      {/* Editor + preview */}
      <div className={`grid ${showPreview ? "lg:grid-cols-2" : "grid-cols-1"} h-[460px]`}>
        <div className="border-r border-ink-100">
          <Editor
            value={code[activeTab] || ""}
            language={tabs.find((t) => t.key === activeTab)?.lang}
            onChange={(value) => setCode((c) => ({ ...c, [activeTab]: value || "" }))}
            theme="vs"
            options={{
              fontSize: 13,
              fontFamily: "JetBrains Mono, ui-monospace, monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: "on",
              padding: { top: 12, bottom: 12 },
              tabSize: 2,
              renderLineHighlight: "none",
              overviewRulerLanes: 0,
              hideCursorInOverviewRuler: true,
              scrollbar: { vertical: "auto", horizontal: "auto" },
            }}
          />
        </div>
        {showPreview && (
          <div className="bg-white">
            <iframe
              title="preview"
              srcDoc={previewHtml}
              sandbox="allow-scripts"
              className="w-full h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
