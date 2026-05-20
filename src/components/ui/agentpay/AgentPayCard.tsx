import type { ReactNode } from "react";

type AgentPayCardVariant = "default" | "elevated" | "muted";

const variantClasses: Record<AgentPayCardVariant, string> = {
  default: "bg-[#111A2E]/80 border-[#22304A]",
  elevated: "bg-[#111A2E]/90 border-cyan-400/30",
  muted: "bg-white/[0.03] border-white/10",
};

export function AgentPayCard({
  children,
  className,
  glow = false,
  variant = "default",
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  variant?: AgentPayCardVariant;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 ${variantClasses[variant]} ${
        glow ? "shadow-[0_0_40px_rgba(45,212,255,0.08)]" : ""
      } ${className ?? ""}`.trim()}
    >
      {glow ? (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-violet-500/10" />
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
}
