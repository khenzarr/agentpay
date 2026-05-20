# AgentPay Claim-Safe Talk Track

## Approved phrases

- “Arc Testnet MVP”
- “USDC-native escrow/job lifecycle”
- “read-only Developer API v0”
- “derived from job lifecycle state”
- “wallet-confirmed actions”
- “no server custody”
- “no server-side signing”
- “ArcNS identity/readability layer”
- “ERC-8183-inspired lifecycle using Arc tutorial/reference subset”
- “Full ERC-8183 compliance is NOT_CLAIMED”
- “Paymaster/Gasless on Arc Testnet is NOT_CLAIMED”

## Avoid phrases

- “production-ready”
- “mainnet-ready”
- “fully ERC-8183 compliant”
- “fully ERC-8004 compliant”
- “Paymaster is live on Arc”
- “gasless is live on Arc”
- “audited”
- “guaranteed settlement”
- “protocol-wide complete ledger”
- “production SDK”
- “production API SLA”

## Replacement table

| Risky phrase | Use instead |
|---|---|
| production-ready | Arc Testnet MVP |
| mainnet-ready | Mainnet readiness is NOT_CLAIMED |
| fully ERC-8183 compliant | ERC-8183-inspired lifecycle using Arc tutorial/reference subset; full ERC-8183 compliance is NOT_CLAIMED |
| fully ERC-8004 compliant | Full ERC-8004 compliance is NOT_CLAIMED |
| Paymaster is live on Arc | Circle Paymaster / Gasless is chain-aware in AgentPay and unsupported on Arc Testnet today |
| gasless is live on Arc | Client-side readiness is complete; Arc Testnet live proof remains NOT_CLAIMED |
| audited | Built as an Arc Testnet MVP with claim-safe boundaries |
| guaranteed settlement | Settlement behavior follows current verified lifecycle scope |
| protocol-wide complete ledger | Indexed/derived read surface within configured range |
| production SDK | SDK is roadmap-only; NOT_CLAIMED in MVP |
| production API SLA | Developer API v0 is live and read-only; production SLA is NOT_CLAIMED |

## Circle/Arc integration wording (exact-safe)

### Arc Testnet
Use:

“AgentPay is live as an Arc Testnet MVP.”

### USDC
Use:

“AgentPay provides a USDC-native escrow and job lifecycle flow in the current verified MVP scope.”

### ArcNS
Use:

“ArcNS is used as an identity/readability layer for participants. It is not escrow logic itself.”

### API v0
Use:

“Developer API v0 is read-only and live. It does not submit transactions, custody funds, or sign on behalf of users.”

### Circle Paymaster / Gasless boundary
Use:

- “Circle Paymaster / Gasless is chain-aware in AgentPay.”
- “Available on Circle Paymaster-supported networks.”
- “Unsupported on Arc Testnet until Circle Paymaster support/deployment is available.”
- “Client-side readiness is complete, but Arc Testnet live proof remains NOT_CLAIMED.”

### Gateway / Unified Balance (if mentioned)
Use:

“Gateway / Unified Balance is currently code-implemented with spend-estimate verification in current scope; do not overstate unverified live execution.”
