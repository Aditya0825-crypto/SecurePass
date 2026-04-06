import { useState } from "react";
import { generatePassword } from "@/lib/password";
import { Copy, RefreshCw, Check } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

import { analyzePassword } from "@/lib/password";

interface Props {
  onGenerated?: (password: string, score: number, strength: string, source: "generated" | "analyzed") => void;
}

const PasswordGenerator = ({ onGenerated }: Props) => {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true, lowercase: true, numbers: true, symbols: true,
  });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const pw = generatePassword(length, options);
    setPassword(pw);
    setCopied(false);
    if (onGenerated) {
      const a = analyzePassword(pw);
      onGenerated(pw, a.score, a.strength, "generated");
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success("Password copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const toggles = [
    { key: "uppercase" as const, label: "A-Z", desc: "Uppercase" },
    { key: "lowercase" as const, label: "a-z", desc: "Lowercase" },
    { key: "numbers" as const, label: "0-9", desc: "Numbers" },
    { key: "symbols" as const, label: "!@#", desc: "Symbols" },
  ];

  return (
    <div className="cyber-card p-6 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
        <h2 className="text-lg font-semibold font-mono text-primary glow-text-green">
          PASSWORD GENERATOR
        </h2>
      </div>

      {/* Length slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground font-mono">Length</span>
          <span className="text-2xl font-bold font-mono text-primary glow-text-green">{length}</span>
        </div>
        <Slider
          value={[length]}
          onValueChange={(v) => setLength(v[0])}
          min={6} max={32} step={1}
          className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary [&_[role=slider]]:glow-green"
        />
        <div className="flex justify-between text-xs text-muted-foreground font-mono">
          <span>6</span><span>32</span>
        </div>
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-2 gap-3">
        {toggles.map((t) => (
          <div
            key={t.key}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
              options[t.key]
                ? "border-primary/40 bg-primary/5"
                : "border-border bg-secondary/30"
            }`}
          >
            <div>
              <span className="font-mono text-sm font-semibold text-foreground">{t.label}</span>
              <p className="text-xs text-muted-foreground">{t.desc}</p>
            </div>
            <Switch
              checked={options[t.key]}
              onCheckedChange={(v) => setOptions((o) => ({ ...o, [t.key]: v }))}
            />
          </div>
        ))}
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-mono font-bold text-sm tracking-wider hover:opacity-90 transition-all glow-green flex items-center justify-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        GENERATE PASSWORD
      </button>

      {/* Result */}
      {password && (
        <div className="relative group">
          <div className="p-4 rounded-lg bg-secondary/50 border border-primary/20 font-mono text-lg text-foreground break-all tracking-wide">
            {password}
          </div>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-all"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
};

export default PasswordGenerator;
