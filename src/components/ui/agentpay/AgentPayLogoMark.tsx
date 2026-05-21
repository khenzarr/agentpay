import Image from "next/image";
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
      <span className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[15px] border border-cyan-200/40 bg-[linear-gradient(150deg,rgba(6,11,24,0.96),rgba(10,16,35,0.88))] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_0_0_1px_rgba(14,165,233,0.14),0_10px_30px_rgba(15,72,140,0.30),0_0_26px_rgba(45,212,255,0.20)]">
        <span className="pointer-events-none absolute inset-[1px] rounded-[14px] bg-[radial-gradient(circle_at_28%_20%,rgba(45,212,255,0.14),transparent_42%),radial-gradient(circle_at_82%_88%,rgba(139,92,246,0.12),transparent_44%)]" />
        <Image
          src="/brand/agentpay-mark.svg"
          alt="AgentPay AP monogram"
          width={36}
          height={36}
          className="relative h-9 w-9 object-contain [filter:drop-shadow(0_0_8px_rgba(45,212,255,0.24))]"
          priority
        />
      </span>
      <span className="inline-flex min-w-0 flex-col leading-none">
        <span className="text-[1rem] font-semibold tracking-[-0.018em] text-slate-50 sm:text-[1.04rem]">
          AgentPay
        </span>
        <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.24em] text-cyan-200/90 sm:text-[11px]">
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
