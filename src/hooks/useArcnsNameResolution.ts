"use client";

import { useQuery } from "@tanstack/react-query";
import { resolveArcNSName } from "@/lib/arcnsResolver";

export function useArcnsNameResolution(name?: string) {
  const normalized = name?.trim();

  return useQuery({
    queryKey: ["arcns-resolution", normalized ?? ""],
    enabled: Boolean(normalized),
    queryFn: async () => {
      if (!normalized) return { state: "idle" as const };
      return resolveArcNSName(normalized);
    },
    staleTime: 60_000,
  });
}
