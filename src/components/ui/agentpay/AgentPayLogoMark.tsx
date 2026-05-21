import Image from "next/image";

export function AgentPayLogoMark() {
  return (
    <div className="flex min-w-0 shrink-0 items-center gap-3">
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-cyan-300/30 bg-[#07111f]/90 shadow-[0_0_32px_rgba(45,212,255,0.22)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_20%,rgba(45,212,255,0.18),transparent_45%),radial-gradient(circle_at_72%_80%,rgba(138,92,255,0.18),transparent_48%)]" />
        <Image
          src="/brand/agentpay-mark.svg"
          alt="AgentPay AP monogram"
          width={38}
          height={38}
          priority
          className="relative h-[38px] w-[38px] drop-shadow-[0_0_12px_rgba(45,212,255,0.55)]"
        />
      </div>

      <div className="min-w-0 leading-none">
        <div className="whitespace-nowrap text-[15px] font-bold tracking-[-0.02em] text-slate-50">AgentPay</div>
        <div className="mt-1 whitespace-nowrap text-[9px] font-black uppercase tracking-[0.22em] text-cyan-300">For Arc</div>
      </div>
    </div>
  );
}
