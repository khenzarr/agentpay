# AgentPay Brandkit Direction

## 1) Brand summary

AgentPay is the settlement layer for autonomous work — where agents, clients, and marketplaces coordinate jobs, escrow, identity, and USDC settlement on Arc.

It is infrastructure-first: technical, verifiable, and developer-usable, while remaining calm and readable for non-protocol users.

The brand should communicate payment finality, lifecycle clarity, and trustworthy coordination between machine actors and human operators.

## 2) Brand keywords

- agentic
- settlement
- escrow
- trust
- coordination
- programmable work
- Arc-native
- USDC-native
- verifiable
- developer-first
- marketplace-ready
- identity-aware
- infrastructure
- precise
- composable

## 3) Brand personality

### What AgentPay is

- Trustworthy
- Technical
- Calm
- Precise
- Futuristic but usable
- Infrastructure-grade
- Developer-friendly

### What AgentPay is not

- Not meme-like
- Not gambling / DeFi casino aesthetic
- Not a dark hacker aesthetic
- Not generic AI SaaS styling
- Not legacy-bank visual language

## 4) Visual metaphor

### Candidate metaphors

1. **Escrow rails** — controlled payment movement with explicit checkpoints.
2. **Agent routing network** — jobs flow across connected actors and systems.
3. **Settlement grid** (**primary**) — stateful movement across a reliable lattice.

### Primary metaphor: Settlement Grid

- Jobs move across a structured grid: **Open → Funded → Submitted → Completed**.
- Agents and clients are nodes on that grid.
- USDC flows through secure rails between states.
- ArcNS provides readable identity labels for each node.

This metaphor maps directly to product behavior and should guide layout, iconography, stepper visuals, and motion.

## 5) Logo direction

> Direction only; no final assets generated in this sprint.

### Concept A — Settlement Node

- **Meaning:** escrow + completion finality.
- **Shape:** abstract node/dot with a contained check or lock-release stroke.
- **Best use:** app header, favicon, status-oriented surfaces.
- **Risk:** can look generic if checkmark is over-literal.

### Concept B — Agent Rail

- **Meaning:** agents routing work through payment rails.
- **Shape:** A/P monogram built from route lines or segmented paths.
- **Best use:** product wordmark lockup, docs hero, API branding.
- **Risk:** monogram legibility at small sizes.

### Concept C — Escrow Orbit

- **Meaning:** coordination and trust around a central escrow core.
- **Shape:** center point with 2–3 orbiting node dots.
- **Best use:** diagrams, onboarding visuals, docs illustrations.
- **Risk:** can drift into “generic web3 orbit” trope if not restrained.

### Recommendation

**Recommend Concept B (Agent Rail)** for primary brand mark exploration.

Reason: it uniquely combines “Agent” + “Pay” + route/rail infrastructure, and aligns best with Arc-native programmable settlement positioning.

## 6) Color palette

### Core palette

- Night Ledger — `#070A12` (primary background)
- Deep Surface — `#0D1324` (secondary background)
- Panel Surface — `#111A2E` (cards/panels)
- Border Line — `#22304A` (dividers/borders)
- Arc Cyan — `#2DD4FF` (primary action/accent)
- USDC Blue — `#2775CA` (payment/escrow emphasis)
- Agent Violet — `#8B5CF6` (agent/intelligence accent)
- Settlement Green — `#22C55E` (completed/success)
- Pending Amber — `#F59E0B` (pending/unsupported/attention)
- Risk Red — `#EF4444` (actual errors only)
- Text Primary — `#F8FAFC`
- Text Secondary — `#94A3B8`
- Text Muted — `#64748B`

### Usage rules

- Use **Arc Cyan** for primary product actions and key active states.
- Use **USDC Blue** specifically for payment, budget, and escrow semantics.
- Use **Agent Violet** for agent/automation-intelligence cues.
- Use **Settlement Green** for completion/settlement finality.
- Use **Pending Amber** for unsupported, pending, or cautionary states.
- Use **Risk Red** only for true failures/errors, not neutral limitations.

## 7) Typography direction

- **Headings:** modern grotesk / Inter-like sans (current stack already suitable).
- **Body:** Inter or system sans for clarity and density control.
- **Code/API:** mono for endpoints, IDs, chain data, and hashes.

Implementation note: keep current Tailwind/system setup in MVP; avoid adding external font dependencies in this sprint.

Future optional exploration: a slightly more opinionated display face for hero headlines, while retaining Inter/system for everything functional.

## 8) Icon and illustration style

- Thin-line, geometric icon language.
- Node-and-rail motifs tied to settlement/lifecycle movement.
- Subtle grid backdrops, especially in hero and data-heavy views.
- Avoid cartoon robots.
- Avoid overused “AI brain/chip” clichés.
- Prefer wallet, node, route, escrow, check/finality abstractions.

## 9) UI component style

### Component rules

- **Cards:** `rounded-xl` to `rounded-2xl`, soft elevated dark panels, subtle border contrast.
- **Buttons:** clear hierarchy (primary cyan, secondary outline, tertiary text).
- **Badges/Pills:** consistent tokenized status colors and legible contrast.
- **Tables:** high-contrast headers, restrained row separators, status-first readability.
- **Code blocks:** dark inset surfaces with mono and quiet border.
- **API cards:** compact metadata rows + endpoint emphasis.
- **Job lifecycle stepper:** explicit state progression with one active state.
- **Agent cards:** identity + role + trust indicators, minimal decorative noise.

### Visual behavior

- Restrained gradients only; avoid glow-heavy UI.
- Maintain high contrast for financial/contract information.
- Keep spacing rhythm predictable and infrastructure-like.

## 10) Status badge system

Use explicit labels and stable color semantics:

- **Open** → neutral slate
- **Funded** → cyan/blue
- **Submitted** → violet (or amber if “awaiting review” is emphasized)
- **Completed** → green
- **Unsupported** → amber/neutral
- **Not Claimed** → neutral gray
- **Read-only** → neutral-cyan mix (informational)
- **Live on Arc Testnet** → cyan/green informational
- **API v0** → violet/neutral informational

Important rules:

- Paymaster unsupported remains **amber/neutral**, not red panic.
- `NOT_CLAIMED` remains **neutral/gray**, not failure red.

## 11) Motion / interaction direction

- Subtle hover elevation on cards/buttons.
- No excessive animation or decorative motion.
- Small pulse only for live/indexed status indicators.
- Smooth transitions for tabs, pills, and panels.
- No particle effects or attention-hijacking motion.

## 12) Page-level visual direction

### `/` homepage

- Feel: concise infrastructure hero.
- Emphasize settlement layer statement + lifecycle proof blocks.
- Include settlement-grid cues, not marketing clutter.

### `/agents`

- Feel: identity-aware operator directory.
- Emphasize agent role, wallet, ArcNS readability, and action path.

### `/create-job`

- Feel: secure setup console.
- Focus on clarity, role hints, and trust-safe transaction affordances.

### `/jobs`

- Feel: lifecycle command center.
- Status and progression should be instantly scannable.

### `/jobs/[id]`

- Feel: operational control panel.
- Strong role guidance (client/agent/evaluator), step-by-step clarity.

### `/payments`

- Feel: settlement ledger view.
- Derived activity should clearly indicate source and confidence level.

### `/docs`

- Feel: developer console + integration handbook.
- Improve scannability with sectional hierarchy and API framing.

## 13) Brand voice

### Tone principles

- Direct
- Precise
- Confident without hype
- Proof-driven
- Developer-friendly
- Claim-safe

### Good sample phrases

- “Settlement infrastructure for autonomous work.”
- “Read-only API v0 for external integrators.”
- “USDC-native job lifecycle on Arc Testnet.”
- “ArcNS-readable identity for agents and clients.”

### Avoid phrases

- “fully production ready”
- “mainnet ready”
- “gasless on Arc”
- “fully ERC-compliant”
- “trustless AI economy” (unless deeply qualified)

## 14) Brand application examples

### README hero direction (example copy)

**Headline:** AgentPay — Settlement infrastructure for autonomous work.

**Subhead:** USDC-native escrow and job lifecycle coordination for agents, marketplaces, and external apps on Arc Testnet.

### UI hero direction (example copy)

**Headline:** USDC settlement rails for autonomous jobs.

**Subhead:** Coordinate escrow, identity, and completion from one Arc-native command surface.

### Status badge examples

- `Live on Arc Testnet` (cyan info)
- `Read-only API v0` (violet info)
- `Paymaster: Unsupported` (amber neutral)
- `Mainnet readiness: NOT_CLAIMED` (gray neutral)

### API card example

- Title: `GET /api/jobs`
- Meta: `Read-only · Arc Testnet · Indexed + enriched`
- Footer: `No signing · No custody · No mutation`

### Job card example

- Header: `Job #31192 · 12.00 USDC`
- Body: client/provider identity + ArcNS resolution status
- Footer: status pill + “Open detail” action

## 15) Next design sprint recommendation

### #50 — AgentPay UI Redesign Mockups / Design Preview

Recommended next step:

1. Build isolated mockups first (no logic changes).
2. Cover all key routes in a design preview surface (route or docs mock file).
3. Keep wallet/API/contract logic untouched during visual pass.
4. Request explicit approval on mockups before implementation.
