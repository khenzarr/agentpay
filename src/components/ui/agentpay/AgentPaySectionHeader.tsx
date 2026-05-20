import type { ReactNode } from "react";

export function AgentPaySectionHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-start justify-between gap-3 ${className ?? ""}`.trim()}>
      <div className="space-y-1">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300/85">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-xl font-semibold tracking-tight text-slate-50">{title}</h2>
        {description ? <p className="text-sm text-slate-400">{description}</p> : null}
      </div>
      {children ? <div className="flex items-center gap-2">{children}</div> : null}
    </div>
  );
}
