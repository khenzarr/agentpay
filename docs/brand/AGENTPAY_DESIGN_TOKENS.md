# AgentPay Design Tokens (Direction)

> Documentation-only token proposal for upcoming UI redesign sprint.
> No Tailwind/config/CSS implementation changes in this sprint.

## 1) Color tokens

### Foundation

- `bg.base` = `#070A12` (Night Ledger)
- `bg.surface` = `#0D1324` (Deep Surface)
- `bg.panel` = `#111A2E` (Panel Surface)
- `border.default` = `#22304A` (Border Line)

### Brand accents

- `accent.primary` = `#2DD4FF` (Arc Cyan)
- `accent.payment` = `#2775CA` (USDC Blue)
- `accent.agent` = `#8B5CF6` (Agent Violet)

### Feedback

- `state.success` = `#22C55E` (Settlement Green)
- `state.warning` = `#F59E0B` (Pending Amber)
- `state.error` = `#EF4444` (Risk Red)

### Text

- `text.primary` = `#F8FAFC`
- `text.secondary` = `#94A3B8`
- `text.muted` = `#64748B`

## 2) Status color mapping

- `status.open` → neutral slate
- `status.funded` → cyan/blue
- `status.submitted` → violet (or amber when awaiting review emphasis is needed)
- `status.completed` → green
- `status.unsupported` → amber/neutral
- `status.notClaimed` → gray neutral
- `status.readOnly` → info-neutral (cyan tinted)
- `status.liveArcTestnet` → info (cyan/green)
- `status.apiV0` → info (violet/neutral)

Rules:

- `unsupported` is never panic-red.
- `NOT_CLAIMED` is neutral/gray, not failure semantics.

## 3) Spacing principles

- Base spacing scale: 4px rhythm (`4 / 8 / 12 / 16 / 24 / 32 / 48`).
- Page sections: 24–40px vertical spacing.
- Card internals: 12–20px padding depending on density.
- Dense data rows: 8–12px vertical rhythm.
- Avoid over-compression for dashboard tables and status stacks.

## 4) Component token rules

### Cards

- Radius: `12px–16px` (`rounded-xl` to `rounded-2xl`)
- Background: `bg.panel`
- Border: `border.default`
- Elevation: minimal (subtle shadow or backdrop contrast only)

### Badges / pills

- Shape: full/large pill radius
- Height target: compact (`text-xs`, balanced horizontal padding)
- Always paired with explicit label text
- Use status mapping from Section 2

### Buttons

- Primary: `accent.primary` fill, high-contrast text
- Secondary: transparent/dark fill + subtle border
- Danger: `state.error` only for destructive/error pathways
- Disabled: lowered opacity + no misleading active glow

### Tables

- Header text uses `text.secondary`
- Rows separated by subtle `border.default` variants
- Status column designed for first-scan recognition

### Code blocks

- Inset dark surface (`bg.base` or deeper variant)
- Mono typography
- Quiet border + horizontal overflow handling

## 5) Typography scale (recommended)

- `display` → 40–48px (homepage hero)
- `h1` → 32–40px
- `h2` → 24–28px
- `h3` → 18–20px
- `body` → 14–16px
- `meta` → 12–13px
- `code` → 12–13px mono

Font-family direction:

- Sans UI: current Inter/system stack
- Mono: system mono stack for hashes, IDs, endpoints

## 6) Interaction tokens (lightweight)

- `motion.fast` ≈ 120–160ms
- `motion.normal` ≈ 180–240ms
- `easing.standard` = smooth ease-out
- Hover elevation: subtle translate/shadow only
- Live pulse: low-intensity, sparingly used

## 7) Implementation guidance for Sprint #50

- Apply these tokens first in mockups/design preview.
- Validate status semantics across `/jobs`, `/jobs/[id]`, `/payments`, and `/docs`.
- Keep product logic untouched while applying visual system updates.
