import { AgentPayBadge } from "@/components/ui/agentpay/AgentPayBadge";

type AgentPayStatusVariant =
  | "open"
  | "funded"
  | "submitted"
  | "completed"
  | "unsupported"
  | "notClaimed"
  | "readonly"
  | "error"
  | "neutral";

export function AgentPayStatusPill({
  status,
  label,
  className,
}: {
  status: AgentPayStatusVariant;
  label?: string;
  className?: string;
}) {
  return (
    <AgentPayBadge variant={status} className={className}>
      {label ?? status}
    </AgentPayBadge>
  );
}
