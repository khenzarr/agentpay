export const agentPayColors = {
  nightLedger: "#070A12",
  deepSurface: "#0D1324",
  panelSurface: "#111A2E",
  borderLine: "#22304A",
  arcCyan: "#2DD4FF",
  usdcBlue: "#2775CA",
  agentViolet: "#8B5CF6",
  settlementGreen: "#22C55E",
  pendingAmber: "#F59E0B",
  riskRed: "#EF4444",
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
} as const;

export type AgentPayTone =
  | "open"
  | "funded"
  | "submitted"
  | "completed"
  | "unsupported"
  | "notClaimed"
  | "readOnly"
  | "arcTestnet"
  | "usdc"
  | "arcns"
  | "api"
  | "error"
  | "neutral";

export const agentPayToneClasses: Record<AgentPayTone, string> = {
  open: "border-slate-500/40 bg-slate-500/10 text-slate-200",
  funded: "border-cyan-400/40 bg-cyan-400/10 text-cyan-200",
  submitted: "border-violet-400/40 bg-violet-400/10 text-violet-200",
  completed: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  unsupported: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  notClaimed: "border-slate-500/40 bg-slate-500/10 text-slate-300",
  readOnly: "border-cyan-400/40 bg-cyan-400/10 text-cyan-200",
  arcTestnet: "border-cyan-400/40 bg-cyan-400/10 text-cyan-200",
  usdc: "border-blue-400/40 bg-blue-400/10 text-blue-200",
  arcns: "border-violet-400/40 bg-violet-400/10 text-violet-200",
  api: "border-sky-400/40 bg-sky-400/10 text-sky-200",
  error: "border-red-400/40 bg-red-400/10 text-red-200",
  neutral: "border-white/20 bg-white/5 text-zinc-200",
};
