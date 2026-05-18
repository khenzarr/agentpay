# AgentPay Proof Artifact Template

> Use this template for future Circle/Arc integration proofs.
>
> Proof rule: **implement → verify → record proof → claim**.

## 1. Proof title

- `{{short, specific proof title}}`

## 2. Integration name

- `{{integration / feature name}}`

## 3. Date/time

- `{{ISO-8601 date/time + timezone}}`

## 4. Operator/founder

- `{{name / role}}`

## 5. Status before proof

- `{{e.g. IMPLEMENTED / VERIFIED / BLOCKED / NOT_CLAIMED}}`

## 6. Intended status after proof

- `{{e.g. CURRENT_VERIFIED / CURRENT_CODE_IMPLEMENTED_SPEND_ESTIMATE_VERIFIED}}`

## 7. Claim boundary

- `{{what is claimable now, and what is explicitly not claimable}}`
- Example claim-safe wording: **“Verified only for the exact scope shown below; no broader claim is made.”**

## 8. Environment

- **Local command:** `{{npm run ... / node ...}}`
- **Env file used:** `{{.env.local / .env.appkit.local / .env.circle.local}}`
- **Dry-run/live mode:** `{{dry-run | live}}`
- **Chain/network:** `{{Arc_Testnet / Ethereum_Sepolia / other}}`
- **Wallet/source/destination:** `{{source wallet, recipient wallet, account type, custody type}}`
- **Token/amount (if applicable):** `{{USDC 0.01 / n/a}}`

## 9. Command(s) run

```bash
{{commands}}
```

## 10. Output summary

- `{{brief summary of what happened}}`

## 11. Proof artifacts

- **Tx hash:** `{{hash or n/a}}`
- **Explorer link:** `{{url or n/a}}`
- **Operation id:** `{{id or n/a}}`
- **Wallet id:** `{{id or n/a}}`
- **Wallet address:** `{{address or n/a}}`
- **Estimate output:** `{{fee / balance / route estimate or n/a}}`
- **API result:** `{{success / error summary / response state}}`

## 12. Security notes

- [ ] No secrets printed
- [ ] `.env` file ignored
- [ ] recovery files ignored
- [ ] no `NEXT_PUBLIC` secrets
- [ ] no private keys / entity secrets / API keys exposed

## 13. What is now claimable

- `{{only the exact verified scope}}`
- Example claim-safe wording: **“CURRENT_VERIFIED for wallet creation + metadata read only.”**

## 14. What is still not claimable

- `{{explicit non-claims / blocked areas}}`
- Example claim-safe wording: **“Live spend not executed, therefore live spend is NOT_CLAIMED.”**

## 15. Docs updated

- `{{docs updated during the proof}}`

## 16. Validation commands

```bash
{{npm run lint / npm run typecheck / npm run build / other checks}}
```

## 17. Validation results

- `{{pass/fail + concise notes}}`

## 18. Final status decision

- `{{final status label}}`
- Example claim-safe wording: **“Claim-safe for the exact proof scope only.”**

## 19. Follow-up blockers

- `{{remaining blockers / prerequisites}}`

## 20. Reviewer checklist

- [ ] Proof scope matches the claimed status exactly
- [ ] No overclaiming language present
- [ ] Proof artifacts are linked and readable
- [ ] Security notes are complete
- [ ] Validation commands are recorded
- [ ] Remaining blockers are explicit
- [ ] Reviewer can reproduce the proof from the recorded steps

## Example claim-safe wording snippets

- **“CURRENT_VERIFIED (wallet creation + metadata read only)”**
- **“Estimate verified; live execution not performed.”**
- **“Implemented, but NOT_CLAIMED pending runtime proof.”**
- **“Verified only for the exact on-chain flow recorded in this proof artifact.”**
