import { NextResponse } from "next/server";
import { ARC_TESTNET_CHAIN_ID } from "@/lib/constants";

const BASE = {
  service: "AgentPay",
  environment: "Arc Testnet",
  chainId: ARC_TESTNET_CHAIN_ID,
} as const;

export function jsonOk<T extends Record<string, unknown>>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, ...BASE, ...data }, init);
}

export function jsonError(
  code: string,
  message: string,
  status = 500,
  extra?: Record<string, unknown>
) {
  return NextResponse.json(
    {
      ok: false,
      ...BASE,
      error: {
        code,
        message,
      },
      ...(extra ?? {}),
    },
    { status }
  );
}
