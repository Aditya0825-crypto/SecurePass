import { useMemo } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import type { PasswordAnalysis } from "@/lib/password";
import { BarChart3 } from "lucide-react";

interface Props {
  analysis: PasswordAnalysis;
  password: string;
}

function calcEntropy(password: string): number {
  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^A-Za-z0-9]/.test(password)) poolSize += 33;
  if (poolSize === 0) return 0;
  const entropy = password.length * Math.log2(poolSize);
  return Math.min(100, Math.round((entropy / 128) * 100));
}

function calcBreakdown(analysis: PasswordAnalysis, password: string) {
  const lengthScore = Math.min(100, Math.round((analysis.length / 20) * 100));
  const variety = [analysis.hasUppercase, analysis.hasLowercase, analysis.hasNumbers, analysis.hasSymbols].filter(Boolean).length;
  const complexityScore = Math.round((variety / 4) * 100);
  const patternPenalty =
    (analysis.hasSequential ? 30 : 0) +
    (analysis.hasRepeated ? 25 : 0) +
    (analysis.hasCommonPattern ? 40 : 0);
  const entropy = calcEntropy(password);

  return { lengthScore, complexityScore, patternPenalty: Math.min(100, patternPenalty), entropy };
}

const ScoreBreakdownGraph = ({ analysis, password }: Props) => {
  const breakdown = useMemo(() => calcBreakdown(analysis, password), [analysis, password]);

  const radarData = [
    { metric: "Length", value: breakdown.lengthScore },
    { metric: "Complexity", value: breakdown.complexityScore },
    { metric: "Entropy", value: breakdown.entropy },
    { metric: "No Patterns", value: 100 - breakdown.patternPenalty },
  ];

  const barData = [
    { name: "Length", value: breakdown.lengthScore, type: "positive" },
    { name: "Complexity", value: breakdown.complexityScore, type: "positive" },
    { name: "Entropy", value: breakdown.entropy, type: "positive" },
    { name: "Pattern Penalty", value: -breakdown.patternPenalty, type: "negative" },
  ];

  const barColors: Record<string, string> = {
    positive: "hsl(160, 100%, 45%)",
    negative: "hsl(0, 80%, 55%)",
  };

  return (
    <div className="cyber-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
        <BarChart3 className="w-5 h-5 text-accent" />
        <h3 className="text-sm font-semibold font-mono text-accent glow-text-blue">
          SCORE BREAKDOWN
        </h3>
      </div>

      {/* Stat pills */}
      <div className="grid grid-cols-2 gap-3">
        <StatPill label="Length" value={breakdown.lengthScore} color="primary" />
        <StatPill label="Complexity" value={breakdown.complexityScore} color="accent" />
        <StatPill label="Entropy" value={breakdown.entropy} color="cyber-blue" />
        <StatPill label="Penalty" value={breakdown.patternPenalty} color="cyber-danger" negative />
      </div>

      {/* Radar Chart */}
      <div className="relative">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="hsl(220, 15%, 22%)" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 11, fontFamily: "JetBrains Mono" }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Radar
              dataKey="value"
              stroke="hsl(160, 100%, 45%)"
              fill="hsl(160, 100%, 45%)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-3 uppercase tracking-wider">
          Component Scores
        </p>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={barData} layout="vertical" margin={{ left: 0, right: 10 }}>
            <XAxis type="number" domain={[-100, 100]} tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} width={90} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
              {barData.map((entry, idx) => (
                <Cell key={idx} fill={barColors[entry.type]} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StatPill = ({
  label,
  value,
  color,
  negative,
}: {
  label: string;
  value: number;
  color: string;
  negative?: boolean;
}) => (
  <div className="relative overflow-hidden rounded-lg border border-border bg-secondary/30 p-3">
    {/* Animated glow bar */}
    <div
      className={`absolute bottom-0 left-0 h-1 rounded-full transition-all duration-700 ${
        negative ? "bg-cyber-danger" : `bg-${color}`
      }`}
      style={{ width: `${Math.abs(value)}%` }}
    />
    <div className="flex items-center justify-between">
      <span className="text-xs font-mono text-muted-foreground">{label}</span>
      <span
        className={`text-lg font-bold font-mono ${
          negative
            ? value > 0
              ? "text-cyber-danger"
              : "text-primary"
            : `text-${color}`
        }`}
      >
        {negative && value > 0 ? `-${value}` : value}
      </span>
    </div>
  </div>
);

export default ScoreBreakdownGraph;
