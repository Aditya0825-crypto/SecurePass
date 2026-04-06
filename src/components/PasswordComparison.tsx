import { useState } from "react";
import { analyzePassword } from "@/lib/password";
import { GitCompare, Eye, EyeOff } from "lucide-react";

const PasswordComparison = () => {
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const a1 = analyzePassword(pw1);
  const a2 = analyzePassword(pw2);
  const hasBoth = pw1.length > 0 && pw2.length > 0;

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

  return (
    <div className="cyber-card p-6 space-y-6">
      <div className="flex items-center gap-3">
        <GitCompare className="w-4 h-4 text-accent" />
        <h2 className="text-lg font-semibold font-mono text-accent glow-text-blue">
          PASSWORD COMPARISON
        </h2>
      </div>

      {/* Inputs */}
      <div className="space-y-3">
        {[
          { value: pw1, set: setPw1, show: show1, toggle: () => setShow1(!show1), label: "Password 1" },
          { value: pw2, set: setPw2, show: show2, toggle: () => setShow2(!show2), label: "Password 2" },
        ].map((field, i) => (
          <div key={i} className="relative">
            <input
              type={field.show ? "text" : "password"}
              value={field.value}
              onChange={(e) => field.set(e.target.value)}
              placeholder={field.label}
              className="w-full p-3 pr-10 rounded-lg bg-secondary/50 border border-border font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all"
            />
            <button
              onClick={field.toggle}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {field.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        ))}
      </div>

      {hasBoth && (
        <div className="space-y-4">
          {/* Side-by-side comparison */}
          <div className="grid grid-cols-2 gap-4">
            {[a1, a2].map((a, i) => (
              <div key={i} className="space-y-3 p-4 rounded-lg border border-border bg-secondary/20">
                <p className="text-xs font-mono text-muted-foreground">Password {i + 1}</p>
                <p className={`text-2xl font-bold font-mono ${strengthColors[a.strength]}`}>{a.score}</p>
                <p className={`text-sm font-mono font-semibold ${strengthColors[a.strength]}`}>{a.strength}</p>
                <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColors[a.strength]}`}
                    style={{ width: `${a.score}%` }}
                  />
                </div>
                <p className="text-xs font-mono text-muted-foreground">
                  Crack time: <span className="text-foreground">{a.crackTime}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Difference summary */}
          <div className="p-4 rounded-lg border border-border bg-secondary/10 space-y-2">
            <p className="text-xs font-mono text-muted-foreground">COMPARISON</p>
            <div className="flex justify-between text-sm font-mono">
              <span className="text-muted-foreground">Score Difference</span>
              <span className="text-foreground">{Math.abs(a1.score - a2.score)} pts</span>
            </div>
            <div className="flex justify-between text-sm font-mono">
              <span className="text-muted-foreground">Winner</span>
              <span className={a1.score >= a2.score ? strengthColors[a1.strength] : strengthColors[a2.strength]}>
                {a1.score === a2.score ? "Tie" : a1.score > a2.score ? "Password 1" : "Password 2"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordComparison;
