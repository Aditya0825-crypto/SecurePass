import { useState, useCallback, Suspense } from "react";
import { KeyRound, Shield, GitCompare, Terminal } from "lucide-react";
import PasswordGenerator from "@/components/PasswordGenerator";
import PasswordAnalyzer from "@/components/PasswordAnalyzer";
import PasswordComparison from "@/components/PasswordComparison";
import PasswordHistory, { type HistoryEntry } from "@/components/PasswordHistory";
import CyberShield3D from "@/components/CyberShield3D";

const tabs = [
  { id: "generate", label: "Generate", icon: KeyRound },
  { id: "analyze", label: "Analyze", icon: Shield },
  { id: "compare", label: "Compare", icon: GitCompare },
] as const;

type TabId = (typeof tabs)[number]["id"];

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>("generate");
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const addToHistory = useCallback(
    (password: string, score: number, strength: string, source: "generated" | "analyzed") => {
      setHistory((prev) => [
        {
          id: crypto.randomUUID(),
          password,
          score,
          strength,
          source,
          timestamp: new Date(),
        },
        ...prev.slice(0, 19), // keep last 20
      ]);
    },
    []
  );

  const clearHistory = useCallback(() => setHistory([]), []);

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* 3D Header */}
        <header className="text-center space-y-1">
          <Suspense fallback={<div className="h-40" />}>
            <CyberShield3D />
          </Suspense>
          <div className="flex items-center justify-center gap-3">
            <Terminal className="w-8 h-8 text-primary animate-pulse-glow" />
            <h1 className="text-3xl md:text-4xl font-bold font-mono text-primary glow-text-green tracking-tight">
              CyberPass
            </h1>
          </div>
          <p className="text-sm font-mono text-muted-foreground">
            Generate • Analyze • Secure
          </p>
        </header>

        {/* Tabs */}
        <nav className="flex gap-1 p-1 rounded-lg bg-secondary/50 border border-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md font-mono text-sm font-medium transition-all ${
                  active
                    ? "bg-primary text-primary-foreground glow-green"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <main>
          {activeTab === "generate" && (
            <PasswordGenerator onGenerated={addToHistory} />
          )}
          {activeTab === "analyze" && (
            <PasswordAnalyzer onAnalyzed={addToHistory} />
          )}
          {activeTab === "compare" && <PasswordComparison />}
        </main>

        {/* History Timeline */}
        <PasswordHistory entries={history} onClear={clearHistory} />
      </div>
    </div>
  );
};

export default Index;
