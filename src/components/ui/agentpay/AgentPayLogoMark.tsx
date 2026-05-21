import Link from "next/link";

export function AgentPayLogoMark({
  href,
  className,
}: {
  href?: string;
  className?: string;
}) {
  const content = (
    <span
      className={`inline-flex min-w-0 flex-nowrap items-center gap-3.5 whitespace-nowrap ${className ?? ""}`.trim()}
    >
      <span className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-cyan-200/35 bg-[radial-gradient(circle_at_30%_20%,rgba(103,232,249,0.26),transparent_45%),linear-gradient(135deg,rgba(8,15,31,0.98),rgba(9,18,42,0.88)_52%,rgba(109,40,217,0.26))] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_0_28px_rgba(37,99,255,0.26)]">
        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_35%,transparent_65%,rgba(255,255,255,0.04))]" />
        <span className="pointer-events-none absolute -bottom-2 left-1/2 h-4 w-8 -translate-x-1/2 rounded-full bg-violet-400/20 blur-md" />
        <svg
          aria-hidden
          viewBox="0 0 48 48"
          className="relative z-10 h-7 w-7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="agentpay-ap-gradient"
              x1="8"
              y1="8"
              x2="40"
              y2="40"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#67E8F9" />
              <stop offset="0.5" stopColor="#3B82F6" />
              <stop offset="1" stopColor="#A78BFA" />
            </linearGradient>
          </defs>
          <path d="M12 36L20 12L28 36" stroke="url(#agentpay-ap-gradient)" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 26H24" stroke="url(#agentpay-ap-gradient)" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M31 36V12h6.4c4.2 0 7 2.7 7 6.6 0 3.8-2.8 6.5-7 6.5H31" stroke="url(#agentpay-ap-gradient)" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="30.5" cy="32.5" r="1.6" fill="#C084FC" />
          <circle cx="30.5" cy="32.5" r="4.2" fill="url(#agentpay-ap-gradient)" fillOpacity="0.12" />
        </svg>
      </span>
      <span className="inline-flex min-w-0 flex-col leading-none">
        <span className="text-[0.98rem] font-semibold tracking-[-0.02em] text-slate-50 sm:text-[1.02rem]">
          AgentPay
        </span>
        <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-cyan-200/85 sm:text-[11px]">
          FOR ARC
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
