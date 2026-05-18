# Circle Product Alignment

**Principle:** Only mark a Circle product as **currently integrated** if the grant demo can prove it on video.

---

## Currently integrated (honest MVP baseline)

Based on **planned MVP** using Arc Testnet + ERC-8183 reference + MetaMask (not yet built in empty `agentpay` repo—claims apply **after implementation**):

| Product | Can claim when demo shows | MVP evidence plan |
|---------|---------------------------|-------------------|
| **USDC** | Yes | `approve` + escrow `fund` + payout on completion using testnet USDC `0x3600000000000000000000000000000000000000` |
| **Contracts** | Yes | Interaction with Arc-deployed ERC-8183 reference **or** self-deployed escrow—show contract address on ArcScan |

### Checkbox recommendation (grant form)

**Check now (post-implementation demo):**

- [x] USDC  
- [x] Contracts  

**Do NOT check for MVP unless built and demoed:**

- [ ] EURC  
- [ ] Bridge Kit  
- [ ] CCTP  
- [ ] Gateway  
- [ ] Paymaster  
- [ ] Wallets  
- [ ] Other  

**If nothing is deployed yet at application time:**

- [ ] I am not currently integrated with any Circle products  
- Then list **planned** products in roadmap section only.

---

## Planned Circle products (roadmap — not current)

| Product | Use in AgentPay | Phase | Dependency |
|---------|-----------------|-------|------------|
| **Arc** (platform) | Settlement chain | M1 | Testnet RPC |
| **Bridge Kit / CCTP** | Cross-chain USDC to fund Arc escrow | M5 | App Kit bridge quickstart |
| **Gateway / Unified Balance** | Agent treasury, multichain float | M6 | Unified Balance docs |
| **App Kit Send** | Same-chain USDC top-up UX | M4 | `NEXT_PUBLIC_KIT_KEY` pattern from FlowPay |
| **Wallets** (Developer Controlled / Programmable) | Autonomous agent signing | M7 | Circle Console API key + entity secret |
| **Paymaster** | USDC gas sponsorship for agents | M7 | Account abstraction docs |
| **EURC** | EU agent payouts | Post-MVP | Multi-stablecoin support on Arc |

---

## Sister project (ArcNS) — do not double-count without clarity

ArcNS **currently** uses (per local `CIRCLE_GRANT_README.md`):

- USDC for registrations/renewals  
- `.circle` TLD namespace  

**AgentPay application** should describe its **own** integrations. Cross-link ArcNS as traction, not as AgentPay’s Bridge/Gateway integration.

---

## FlowPay — App Kit status (important)

FlowPay `package.json` includes `@circle-fin/app-kit` and `lib/appkit.ts` instantiates `AppKit`, but **no Send/Bridge UI usage was found** in application code.

**For AgentPay:** Do **not** cite App Kit as integrated based on FlowPay dependency alone.

---

## What must be shown in the 5-minute demo video

| Segment | Show |
|---------|------|
| Code walkthrough | `contracts/` or ABI config for ERC-8183; `frontend/` job pages; USDC address constant |
| Circle product usage | MetaMask on Arc Testnet; USDC approve + fund + release; ArcScan tx URLs |
| Integration demo | Full job lifecycle (create → fund → submit → complete) |
| Narrative | How USDC on Arc enables agent settlement; pointer to ERC-8183/8004 roadmap |

---

## What should NOT be claimed yet

| Claim | Why |
|-------|-----|
| “Full ERC-8183 compliant protocol” | Unless every interface/event validated against reference |
| “ERC-8004 registered agents in production” | MVP uses demo agents unless registry wired |
| “CCTP / Bridge Kit integrated” | No code in agentpay; FlowPay bridge is manual 2-step, not Circle Bridge Kit |
| “Gateway Unified Balance” | Not implemented |
| “Circle Wallets in production” | Official tutorials use dev-controlled wallets; AgentPay MVP uses MetaMask |
| “Paymaster gasless agents” | Not MVP |
| “App Kit Send live” | Not verified in FlowPay UI |

Label all of the above: **UNVERIFIED — DO NOT CLAIM IN GRANT FORM YET** until built.

---

## Integration risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| USDC decimals confusion (6 vs 18) | Wrong amounts | Use ERC-20 `0x3600…` with **6 decimals** for escrow per ERC-8183 tutorial; separate native gas (18) per Arc docs |
| ERC-8183 role confusion (client vs provider vs evaluator) | Failed txs | Follow tutorial: client creates/funds, provider sets budget/submits, evaluator completes |
| ArcNS API downtime | Name resolution fails | Fallback to raw `0x` address; show resolution status |
| Faucet rate limits | Demo fails | Pre-fund demo wallets; document balances |
| Reference contract upgrade | Broken ABI | Pin ABI version; monitor Arc docs |
| Grant checkbox overclaim | Rejection/trust loss | Use section above literally |

---

## Demo vs application timing

| Scenario | Form checkboxes |
|----------|-----------------|
| Apply **before** MVP code | “Not currently integrated” + planned USDC/Contracts |
| Apply **with** working testnet demo | USDC + Contracts |
| Apply **with** App Kit bridge demo | Add Bridge Kit / CCTP only if video shows App Kit bridge tx |

---

## Arc official contracts (testnet — from Arc docs)

| Contract | Address | AgentPay use |
|----------|---------|--------------|
| ERC-8183 Agentic Commerce | `0x0747EEf0706327138c69792bF28Cd525089e4583` | Escrow MVP target |
| USDC | `0x3600000000000000000000000000000000000000` | Escrow token |
| ERC-8004 IdentityRegistry | `0x8004A818BFB912233c491871b3d84c89A494BD9e` | Roadmap |

Verify on https://testnet.arcscan.app before filming.
