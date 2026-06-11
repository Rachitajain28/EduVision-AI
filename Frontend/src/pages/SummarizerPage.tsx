import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Download, Sparkles, Loader2, BookOpen, CheckCheck } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// Markdown renderer — bold, bullets, numbered list
const RenderSummary = ({ text }: { text: string }) => {
  const lines = text.split("\n").filter(line => line.trim() !== "");

  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        // Heading: **Text:**
        if (/^\*\*.*\*\*$/.test(line.trim()) || /^\*\*.*:\*\*$/.test(line.trim())) {
          const clean = line.replace(/\*\*/g, "").trim();
          return <p key={i} className="font-display font-semibold text-base mt-4 first:mt-0">{clean}</p>;
        }

        // Bullet: * text or - text
        if (/^[\*\-] /.test(line.trim())) {
          const clean = line.replace(/^[\*\-] /, "").replace(/\*\*(.*?)\*\*/g, "$1");
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <p className="text-sm leading-relaxed">{clean}</p>
            </div>
          );
        }

        // Numbered: 1. text
        if (/^\d+\./.test(line.trim())) {
          const num = line.match(/^(\d+)\./)?.[1];
          const clean = line.replace(/^\d+\.\s*/, "").replace(/\*\*(.*?)\*\*/g, "$1");
          return (
            <div key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {num}
              </span>
              <p className="text-sm leading-relaxed">{clean}</p>
            </div>
          );
        }

        // Normal text with inline bold
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className="text-sm leading-relaxed">
            {parts.map((part, j) =>
              j % 2 === 1 ? <strong key={j}>{part}</strong> : part
            )}
          </p>
        );
      })}
    </div>
  );
};

const SummarizerPage = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setSummary("");
    try {
      const response = await fetch(`${API_URL}/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input })
      });
      const data = await response.json();
      setSummary(data.summary);
    } catch {
      setSummary("Error generating summary.");
    }
    setLoading(false);
  };

  const handlePDFUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setSummary("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(`${API_URL}/summarize-pdf`, {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      setSummary(data.summary || data.error);
    } catch {
      setSummary("Error processing PDF.");
    }
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([summary], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summary.txt";
    a.click();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-2xl font-bold mb-1">AI Study Summarizer</h1>
      <p className="text-muted-foreground text-sm mb-6">Upload your study material or upload a PDF.</p>

      <div className="glass-card rounded-2xl p-6 mb-6">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your study material here..."
          className="w-full h-40 bg-muted/50 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-ring/30 resize-none"
        />
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          onChange={handlePDFUpload}
          className="hidden"
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={generate}
            disabled={loading || !input.trim()}
            className="px-6 py-2.5 rounded-xl gradient-primary font-semibold hover-lift disabled:opacity-50 flex items-center gap-2 text-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate Summary
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2.5 rounded-xl glass-card font-medium hover-lift flex items-center gap-2 text-sm"
          >
            <BookOpen className="w-4 h-4" />
            Upload PDF
          </button>
        </div>
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground mt-3">Analyzing your material with AI...</p>
          </motion.div>
        )}

        {summary && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-semibold text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" /> Summary
              </h2>
              <div className="flex gap-2">
                <button onClick={copy} className="p-2 rounded-lg hover:bg-muted transition-colors" title="Copy">
                  {copied ? <CheckCheck className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <button onClick={download} className="p-2 rounded-lg hover:bg-muted transition-colors" title="Download">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <RenderSummary text={summary} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SummarizerPage;