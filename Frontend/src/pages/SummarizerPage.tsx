import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Download, Sparkles, Loader2, BookOpen } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const SummarizerPage = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const fileInputRef = useRef(null);

  // ✅ TEXT SUMMARY
  const generate = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setSummary("");

    try {
      const response = await fetch(`${API_URL}/summarize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: input
        })
      });

      const data = await response.json();
      setSummary(data.summary);

    } catch (error) {
      console.error("Error:", error);
      setSummary("Error generating summary.");
    }

    setLoading(false);
  };

  // ✅ PDF UPLOAD SUMMARY (NEW 🔥)
  const handlePDFUpload = async (event) => {
    const file = event.target.files[0];
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

    } catch (error) {
      console.error("Error:", error);
      setSummary("Error processing PDF.");
    }

    setLoading(false);
  };

  // ✅ COPY
  const copy = () => {
    navigator.clipboard.writeText(summary);
  };

  // ✅ DOWNLOAD
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
      <h1 className="font-display text-2xl font-bold mb-2">
        AI Study Summarizer
      </h1>

      <p className="text-muted-foreground mb-6">
        Paste your study material or upload a PDF.
      </p>

      <div className="glass-card rounded-2xl p-6 mb-6">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your study material here..."
          className="w-full h-40 bg-muted/50 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-ring/30 resize-none"
        />

        {/* ✅ Hidden file input */}
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          onChange={handlePDFUpload}
          style={{ display: "none" }}
        />

        <div className="flex gap-3 mt-4">
          {/* TEXT BUTTON */}
          <button
            onClick={generate}
            disabled={loading || !input.trim()}
            className="px-6 py-2.5 rounded-xl gradient-primary font-semibold hover-lift disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Generate Summary
          </button>

          {/* PDF BUTTON */}
          <button
            onClick={() => fileInputRef.current.click()}
            className="px-6 py-2.5 rounded-xl glass-card font-medium hover-lift flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Upload PDF
          </button>
        </div>
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground mt-3">
              Analyzing your material with AI...
            </p>
          </motion.div>
        )}

        {summary && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg">
                📖 Summary
              </h2>

              <div className="flex gap-2">
                <button
                  onClick={copy}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  title="Copy"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  onClick={download}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-sm leading-relaxed whitespace-pre-line">
              {summary}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SummarizerPage;