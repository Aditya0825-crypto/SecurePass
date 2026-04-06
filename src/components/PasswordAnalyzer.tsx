import { useState, useEffect } from "react";
import { analyzePassword, type PasswordAnalysis } from "@/lib/password";
import { Shield, Eye, EyeOff } from "lucide-react";
import StrengthBreakdown from "./StrengthBreakdown";
import SmartSuggestions from "./SmartSuggestions";
import ScoreBreakdownGraph from "./ScoreBreakdownGraph";

const strengthColors: Record<string, string> = {
  Weak: "text-cyber-danger",
  Fair: "text-cyber-warn",
  Strong: "text-cyber-blue",
  "Very Strong": "text-primary",
};

const barColors: Record<string, string> = {
  Weak: "bg-cyber-danger",
  Fair: "bg-cyber-warn",
  Strong: "bg-cyber-blue",
  "Very Strong": "bg-primary",
};

interface Props {
  onAnalyzed?: (password: string, score: number, strength: string, source: "generated" | "analyzed") => void;
}

const PasswordAnalyzer = ({ onAnalyzed }: Props) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null);
  const [lastTracked, setLastTracked] = useState("");

  useEffect(() => {
    const a = analyzePassword(password);
    setAnalysis(a);
    // Track when user stops typing a meaningful password
    if (password.length >= 4 && password !== lastTracked && onAnalyzed) {
      const timer = setTimeout(() => {
        onAnalyzed(password, a.score, a.strength, "analyzed");
        setLastTracked(password);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [password]);

  return (
    <div className="space-y-6">
      <div className="cyber-card p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
          <h2 className="text-lg font-semibold font-mono text-accent glow-text-blue">
            PASSWORD ANALYZER
          </h2>
        </div>

        {/* Input */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type a password to analyze..."
            className="w-full p-4 pr-12 rounded-lg bg-secondary/50 border border-border font-mono text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {analysis && password && (
          <>
            {/* Score + Strength */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className={`w-6 h-6 ${strengthColors[analysis.strength]}`} />
                <span className={`font-mono font-bold text-xl ${strengthColors[analysis.strength]}`}>
                  {analysis.strength}
                </span>
              </div>
              <span className={`font-mono text-3xl font-bold ${strengthColors[analysis.strength]}`}>
                {analysis.score}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barColors[analysis.strength]}`}
                style={{ width: `${analysis.score}%` }}
              />
            </div>

            {/* Quick checks */}
            <div className="grid grid-cols-2 gap-2 text-sm font-mono">
              <CheckItem label="Length" value={`${analysis.length} chars`} ok={analysis.length >= 8} />
              <CheckItem label="Crack Time" value={analysis.crackTime} ok={analysis.score >= 60} />
              <CheckItem label="Sequential" value={analysis.hasSequential ? "Found" : "None"} ok={!analysis.hasSequential} />
              <CheckItem label="Repeated" value={analysis.hasRepeated ? "Found" : "None"} ok={!analysis.hasRepeated} />
            </div>
          </>
        )}
      </div>

      {analysis && password && (
        <>
          <ScoreBreakdownGraph analysis={analysis} password={password} />
          <StrengthBreakdown analysis={analysis} />
          {analysis.score < 75 && <SmartSuggestions analysis={analysis} />}
        </>
      )}
    </div>
  );
};

const CheckItem = ({ label, value, ok }: { label: string; value: string; ok: boolean }) => (
  <div className={`flex justify-between p-2 rounded-md border ${ok ? "border-primary/20 bg-primary/5" : "border-cyber-danger/20 bg-cyber-danger/5"}`}>
    <span className="text-muted-foreground">{label}</span>
    <span className={ok ? "text-primary" : "text-cyber-danger"}>{value}</span>
  </div>
);

export default PasswordAnalyzer;
