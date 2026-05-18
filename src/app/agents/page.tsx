import Link from "next/link";
import { demoAgents } from "@/config/demo-agents";
import { ArcScanAddressLink } from "@/components/agentpay/ArcScanLink";
import { ArcnsResolutionBadge } from "@/components/agentpay/ArcnsResolutionBadge";

export default function AgentsPage() {
  return (
    <>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-white">Demo agents</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Static demo catalog for grant MVP. Replace addresses via{" "}
            <code className="text-sky-400">NEXT_PUBLIC_DEMO_AGENT_ADDRESS</code>.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {demoAgents.map((agent) => (
            <article key={agent.id} className="card space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-semibold text-white">{agent.name}</h2>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-zinc-400">
                  {agent.role}
                </span>
              </div>
              <p className="text-sm text-zinc-400">{agent.description}</p>
              <p className="text-xs text-zinc-500">
                <span className="text-zinc-400">Wallet: </span>
                <ArcScanAddressLink address={agent.address} />
              </p>
              <ArcnsResolutionBadge name={agent.arcnsName} />
              <Link
                href={`/create-job?agent=${agent.id}`}
                className="inline-block rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
              >
                Create job
              </Link>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
