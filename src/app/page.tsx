import Link from "next/link";
import { IntegrationBanner } from "@/components/agentpay/IntegrationBanner";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-wider text-sky-400">
          Live on Arc Testnet
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
          USDC-native agent escrow on Arc
        </h1>
        <p className="max-w-2xl text-lg text-zinc-400">
          Fund jobs for AI agents in USDC, verify deliverables on-chain, and
          release payments on Arc Testnet. Mainnet readiness is currently
          NOT_CLAIMED.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/create-job"
            className="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-500"
          >
            Create job
          </Link>
          <Link
            href="/jobs"
            className="rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-zinc-200 hover:bg-white/5"
          >
            View jobs
          </Link>
        </div>
      </section>

      <IntegrationBanner />

      <section className="card space-y-3">
        <h2 className="text-lg font-semibold text-white">Circle / Arc alignment</h2>
        <ul className="list-inside list-disc space-y-2 text-sm text-zinc-400">
          <li>
            <strong className="text-zinc-200">USDC</strong> — escrow funding and
            settlement on Arc Testnet
          </li>
          <li>
            <strong className="text-zinc-200">Arc</strong> — execution and
            settlement layer (chain ID 5042002)
          </li>
          <li>
            <strong className="text-zinc-200">ERC-8183 reference</strong> — Arc
            Agentic Commerce contract integration (tutorial ABI)
          </li>
          <li className="text-zinc-500">Additional Circle product integrations are not claimed in this MVP scope.</li>
        </ul>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "1. Create & fund",
            body: "Client wallet creates a job and locks USDC in escrow.",
          },
          {
            title: "2. Submit",
            body: "Agent wallet submits a deliverable hash on-chain.",
          },
          {
            title: "3. Complete",
            body: "Client/evaluator completes the job; USDC is released.",
          },
        ].map((step) => (
          <div key={step.title} className="card">
            <h3 className="font-medium text-sky-300">{step.title}</h3>
            <p className="mt-2 text-sm text-zinc-400">{step.body}</p>
          </div>
        ))}
      </section>

      <section className="card space-y-3">
        <h2 className="text-lg font-semibold text-white">What this demo proves</h2>
        <ul className="list-inside list-disc space-y-2 text-sm text-zinc-400">
          <li>Real USDC escrow flow on Arc Testnet for agentic jobs</li>
          <li>ERC-8183 tutorial ABI integration with on-chain job lifecycle actions</li>
          <li>Event-driven UX: create transaction parses JobCreated and redirects to job detail</li>
          <li>Client-side indexed dashboard from real JobCreated logs in a configurable demo range</li>
        </ul>
      </section>

    </div>
  );
}






