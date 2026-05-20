import Link from "next/link";

export function AgentPayLogoMark({
  href,
  className,
}: {
  href?: string;
  className?: string;
}) {
  const content = (
    <span className={`inline-flex items-center gap-3 ${className ?? ""}`.trim()}>
      <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-cyan-300/40 bg-gradient-to-br from-cyan-400/25 via-slate-900 to-violet-500/25 shadow-[0_0_24px_rgba(45,212,255,0.2)]">
        <span className="pointer-events-none absolute left-1.5 right-1.5 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-cyan-300/60 via-cyan-200/30 to-violet-300/60" />
        <span className="text-[0.65rem] font-semibold tracking-wide text-slate-100">AP</span>
      </span>
      <span className="inline-flex flex-col leading-tight">
        <span className="text-base font-semibold tracking-tight text-slate-50">AgentPay</span>
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-cyan-300/90">
          for Arc
        </span>
      </span>
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} aria-label="AgentPay home">
      {content}
    </Link>
  );
}
