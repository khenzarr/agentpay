import { ERC8183_JOB_STATUS_NAMES } from "@/abi/erc8183AgenticCommerce";

const mvpSteps = ["Open", "Funded", "Submitted", "Completed"] as const;

export function JobStatusStepper({ currentStatus }: { currentStatus: number }) {
  const currentName = ERC8183_JOB_STATUS_NAMES[currentStatus] ?? "Unknown";
  const currentIndex = mvpSteps.indexOf(
    currentName as (typeof mvpSteps)[number]
  );

  return (
    <ol className="flex flex-wrap gap-2">
      {mvpSteps.map((step, i) => {
        const done = currentIndex >= 0 && i <= currentIndex;
        const active = currentName === step;
        return (
          <li
            key={step}
            className={`rounded-full border px-3 py-1 text-xs ${
              active
                ? "border-sky-400 bg-sky-500/20 text-sky-100"
                : done
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100"
                  : "border-white/10 bg-white/5 text-zinc-500"
            }`}
          >
            {step}
          </li>
        );
      })}
    </ol>
  );
}

