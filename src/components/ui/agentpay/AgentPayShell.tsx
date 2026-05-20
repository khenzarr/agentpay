import type { ReactNode } from "react";

export function AgentPayShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-4 ${className ?? ""}`.trim()}>
      {children}
    </div>
  );
}
