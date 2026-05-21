import Link from "next/link";

export function AgentPayLogoMark({
  href,
  className,
}: {
  href?: string;
  className?: string;
}) {
  const content = (
    <span className={`inline-flex items-center gap-3.5 ${className ?? ""}`.trim()}>
      <span className="relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-[14px] border border-cyan-200/35 bg-gradient-to-br from-cyan-400/20 via-[#0a1128] to-violet-500/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_0_28px_rgba(37,99,255,0.28)]">
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_70%_at_18%_20%,rgba(34,211,238,0.2),transparent_65%)]" />
        <span className="pointer-events-none absolute -bottom-3 left-1/2 h-5 w-8 -translate-x-1/2 rounded-full bg-cyan-300/25 blur-md" />
        <svg
          aria-hidden
          viewBox="0 0 36 36"
          className="relative z-10 h-7 w-7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="agentpay-ap-gradient" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#67E8F9" />
              <stop offset="0.5" stopColor="#3B82F6" />
              <stop offset="1" stopColor="#A78BFA" />
            </linearGradient>
          </defs>
          <path
            d="M8 28.5V8h11.5c4.25 0 7 2.4 7 6.4s-2.75 6.5-7 6.5h-7"
            stroke="url(#agentpay-ap-gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 28.5V8l8.5 20.5"
            stroke="url(#agentpay-ap-gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="inline-flex flex-col leading-tight">
        <span className="text-[1.02rem] font-semibold tracking-tight text-slate-50">AgentPay</span>
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-200/90">
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
