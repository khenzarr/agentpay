import Link from "next/link";
import { AgentPayBadge } from "@/components/ui/agentpay/AgentPayBadge";
import { AgentPayLogoMark } from "@/components/ui/agentpay/AgentPayLogoMark";
import { AgentPayShell } from "@/components/ui/agentpay/AgentPayShell";
import { ConnectButton } from "@/components/wallet/ConnectButton";
import { UsdcBalance } from "@/components/wallet/UsdcBalance";

const nav = [
  { href: "/agents", label: "Agents" },
  { href: "/create-job", label: "Create job" },
  { href: "/jobs", label: "Jobs" },
  { href: "/payments", label: "Payments" },
  { href: "/docs", label: "Docs" },
];

export function Header() {
  return (
    <header className="relative sticky top-0 z-40 border-b border-cyan-200/10 bg-[#060912]/72 backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/45 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-violet-300/30 to-transparent" />
      <AgentPayShell>
        <div className="flex flex-wrap items-center justify-between gap-3 py-3.5 md:gap-4">
          <AgentPayLogoMark href="/" />

          <nav className="order-3 w-full overflow-x-auto md:order-none md:w-auto">
            <div className="flex w-max items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 text-sm text-zinc-300">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-3 py-1.5 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden items-center gap-1.5 md:flex">
              <AgentPayBadge variant="arc">Arc Testnet</AgentPayBadge>
              <AgentPayBadge variant="readonly">Read-only API v0</AgentPayBadge>
            </div>
            <UsdcBalance />
            <ConnectButton />
          </div>
        </div>
      </AgentPayShell>
    </header>
  );
}







