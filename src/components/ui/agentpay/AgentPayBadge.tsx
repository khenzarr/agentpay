import type { ReactNode } from "react";
import { type AgentPayTone, agentPayToneClasses } from "@/lib/agentpay-design";

type AgentPayBadgeVariant =
  | "arc"
  | "usdc"
  | "arcns"
  | "api"
  | "readonly"
  | "unsupported"
  | "notClaimed"
  | "open"
  | "funded"
  | "submitted"
  | "completed"
  | "error"
  | "neutral";

const variantToneMap: Record<AgentPayBadgeVariant, AgentPayTone> = {
  arc: "arcTestnet",
  usdc: "usdc",
  arcns: "arcns",
  api: "api",
  readonly: "readOnly",
  unsupported: "unsupported",
  notClaimed: "notClaimed",
  open: "open",
  funded: "funded",
  submitted: "submitted",
  completed: "completed",
  error: "error",
  neutral: "neutral",
};

export function AgentPayBadge({
  variant,
  children,
  className,
}: {
  variant: AgentPayBadgeVariant;
  children?: ReactNode;
  className?: string;
}) {
  const tone = variantToneMap[variant];
  const label = children ?? variant;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${agentPayToneClasses[tone]} ${className ?? ""}`.trim()}
    >
      {label}
    </span>
  );
}
