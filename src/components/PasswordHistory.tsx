import { Clock, Shield, Trash2 } from "lucide-react";

export interface HistoryEntry {
  id: string;
  password: string;
  score: number;
  strength: string;
  source: "generated" | "analyzed";
  timestamp: Date;
}

const strengthColors: Record<string, string> = {
  Weak: "text-cyber-danger",
  Fair: "text-cyber-warn",
  Strong: "text-cyber-blue",
  "Very Strong": "text-primary",
};

const dotColors: Record<string, string> = {
  Weak: "bg-cyber-danger",
  Fair: "bg-cyber-warn",
  Strong: "bg-cyber-blue",
  "Very Strong": "bg-primary",
};

const PasswordHistory = ({
  entries,
  onClear,
}: {
  entries: HistoryEntry[];
  onClear: () => void;
}) => {
  if (entries.length === 0) return null;

  const masked = (pw: string) =>
    pw.length <= 4 ? "••••" : pw.slice(0, 2) + "•".repeat(Math.min(pw.length - 4, 8)) + pw.slice(-2);

  const timeAgo = (date: Date) => {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="cyber-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold font-mono text-accent glow-text-blue">
            PASSWORD HISTORY
          </h3>
          <span className="text-xs font-mono text-muted-foreground px-2 py-0.5 rounded-full bg-secondary">
            {entries.length}
          </span>
        </div>
        <button
          onClick={onClear}
          className="text-muted-foreground hover:text-cyber-danger transition-colors p-1"
          title="Clear history"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="relative pl-4">
        {/* Timeline line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="relative flex items-start gap-3 group">
              {/* Timeline dot */}
              <div className={`w-3 h-3 rounded-full ${dotColors[entry.strength]} ring-2 ring-background shrink-0 mt-1.5 z-10`} />

              <div className="flex-1 p-3 rounded-lg border border-border bg-secondary/20 hover:bg-secondary/30 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-sm text-foreground tracking-wide">
                    {masked(entry.password)}
                  </span>
                  <span className={`font-mono text-lg font-bold ${strengthColors[entry.strength]}`}>
                    {entry.score}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono font-semibold ${strengthColors[entry.strength]}`}>
                      {entry.strength}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground px-1.5 py-0.5 rounded bg-secondary">
                      {entry.source === "generated" ? "GEN" : "ANA"}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    {timeAgo(entry.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PasswordHistory;
