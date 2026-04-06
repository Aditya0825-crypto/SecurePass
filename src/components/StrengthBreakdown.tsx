import type { PasswordAnalysis } from "@/lib/password";
import { Check, X } from "lucide-react";

const items = [
  { key: "hasUppercase" as const, label: "Uppercase Letters (A-Z)" },
  { key: "hasLowercase" as const, label: "Lowercase Letters (a-z)" },
  { key: "hasNumbers" as const, label: "Numbers (0-9)" },
  { key: "hasSymbols" as const, label: "Special Characters (!@#)" },
];

const StrengthBreakdown = ({ analysis }: { analysis: PasswordAnalysis }) => (
  <div className="cyber-card p-6 space-y-4">
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-cyber-warn animate-pulse-glow" />
      <h3 className="text-sm font-semibold font-mono text-cyber-warn">
        STRENGTH BREAKDOWN
      </h3>
    </div>

    <div className="space-y-3">
      {items.map((item) => {
        const present = analysis[item.key];
        return (
          <div key={item.key} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {present ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <X className="w-4 h-4 text-cyber-danger" />
                )}
                <span className="text-sm font-mono text-foreground">{item.label}</span>
              </div>
              <span className={`text-xs font-mono ${present ? "text-primary" : "text-cyber-danger"}`}>
                {present ? "PRESENT" : "MISSING"}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${present ? "bg-primary" : "bg-cyber-danger/30"}`}
                style={{ width: present ? "100%" : "15%" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default StrengthBreakdown;
