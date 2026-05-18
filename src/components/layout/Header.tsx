import Link from "next/link";
import { ConnectButton } from "@/components/wallet/ConnectButton";
import { UsdcBalance } from "@/components/wallet/UsdcBalance";

const nav = [
  { href: "/agents", label: "Agents" },
  { href: "/create-job", label: "Create job" },
  { href: "/jobs", label: "Jobs" },
  { href: "/payments", label: "Payments" },
];

export function Header() {
  return (
    <header className="border-b border-white/8 bg-black/20 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-white">
          AgentPay
          <span className="ml-2 text-sm font-normal text-sky-400">for Arc</span>
        </Link>
        <nav className="flex flex-wrap gap-4 text-sm text-zinc-400">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <UsdcBalance />
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}

