import { getArcscanAddressUrl } from "@/lib/arcscan";
import {
  ERC8183_AGENTIC_COMMERCE_ADDRESS,
  ARC_TESTNET_USDC_ADDRESS,
} from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/8 py-8 text-center text-xs text-zinc-500">
      <p>
        Arc Testnet · USDC escrow · Inspired by Arc&apos;s agentic economy
        architecture
      </p>
      <p className="mt-2 space-x-3">
        <a
          href={getArcscanAddressUrl(ERC8183_AGENTIC_COMMERCE_ADDRESS)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-500 hover:underline"
        >
          ERC-8183 contract
        </a>
        <a
          href={getArcscanAddressUrl(ARC_TESTNET_USDC_ADDRESS)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-500 hover:underline"
        >
          USDC
        </a>
      </p>
    </footer>
  );
}

