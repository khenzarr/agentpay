"use client";

import { useAgentPayJobs } from "@/hooks/useAgentPayJobs";

export function JobsStats() {
  const { stats } = useAgentPayJobs();

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total jobs", value: stats.totalJobs },
          { label: "Escrowed USDC", value: stats.totalEscrowedUsdc },
          { label: "Completed", value: stats.completedJobs },
          { label: "Paid out USDC", value: stats.totalPaidOutUsdc },
        ].map((s) => (
          <div key={s.label} className="card">
            <p className="text-xs text-zinc-500">{s.label}</p>
            <p className="mt-1 text-2xl font-semibold text-white">{s.value}</p>
          </div>
        ))}
      </div>
    </>
  );
}
