import type { ReactNode } from "react";

export function AgentPayCodeBlock({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <pre
      className={`overflow-x-auto rounded-2xl border border-cyan-500/20 bg-[#0A1222] p-4 text-xs text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] ${className ?? ""}`.trim()}
    >
      <code>{children}</code>
    </pre>
  );
}
