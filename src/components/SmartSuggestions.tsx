import { useState } from "react";
import type { PasswordAnalysis } from "@/lib/password";
import { Lightbulb, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const SmartSuggestions = ({ analysis }: { analysis: PasswordAnalysis }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(analysis.improvedPassword);
    setCopied(true);
    toast.success("Improved password copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="cyber-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Lightbulb className="w-4 h-4 text-cyber-warn" />
        <h3 className="text-sm font-semibold font-mono text-cyber-warn">
          SMART SUGGESTIONS
        </h3>
      </div>

      <ul className="space-y-2">
        {analysis.suggestions.map((s, i) => (
          <li key={i} className="flex items-start gap-2 text-sm font-mono">
            <span className="text-cyber-warn mt-0.5">›</span>
            <span className="text-muted-foreground">{s}</span>
          </li>
        ))}
      </ul>

      {analysis.improvedPassword && (
        <div className="space-y-2">
          <p className="text-xs font-mono text-muted-foreground">Improved version:</p>
          <div className="relative">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 font-mono text-sm text-primary break-all">
              {analysis.improvedPassword}
            </div>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-1.5 rounded bg-primary/20 hover:bg-primary/30 text-primary transition-all"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSuggestions;
