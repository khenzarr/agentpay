# AgentPay Recording Runbook

Related final guides:

- `./AGENTPAY_TIMED_REHEARSAL_PLAN.md` (strict 5-minute recording flow)
- `./AGENTPAY_FINAL_GRANT_ASSETS_CHECKLIST.md` (submission-ready assets checklist)

## Recommended recording setup

- Browser window: maximize or fixed 16:9 capture (recommended 1920×1080).
- Browser zoom: 100–125% for legibility.
- Terminal: side-by-side or quick-switch tab with readable font (14px+).
- Wallet panel: keep collapsed unless needed; avoid revealing unrelated assets.
- Editor/repo: open safe files only (no `.env*`, no secret paths).

## Tabs to preload

1. `https://agentpay-dusky.vercel.app`
2. `https://agentpay-dusky.vercel.app/agents`
3. `https://agentpay-dusky.vercel.app/create-job`
4. `https://agentpay-dusky.vercel.app/jobs`
5. `https://agentpay-dusky.vercel.app/jobs/31003` (fallback: first indexed job)
6. `https://agentpay-dusky.vercel.app/payments`
7. `https://agentpay-dusky.vercel.app/docs`
8. `https://github.com/khenzarr/agentpay`
9. Optional ArcScan contract tab
10. Optional API endpoint tab

## Curl commands to prepare (PowerShell)

```powershell
curl.exe https://agentpay-dusky.vercel.app/api/health
curl.exe https://agentpay-dusky.vercel.app/api/metadata
curl.exe "https://agentpay-dusky.vercel.app/api/jobs?limit=1"
curl.exe "https://agentpay-dusky.vercel.app/api/payments?limit=1"
curl.exe "https://agentpay-dusky.vercel.app/api/identity/resolve?name=agentpayagent.circle"
curl.exe https://agentpay-dusky.vercel.app/api/integration/status
```

## Time budget (5-minute target)

| Segment | Target |
|---|---:|
| Opening | 0:00–0:20 |
| Problem + solution | 0:20–0:55 |
| Homepage + Agents | 0:55–1:35 |
| Create Job flow | 1:35–2:20 |
| Jobs + Job Detail | 2:20–3:05 |
| Payments | 3:05–3:35 |
| Docs + API | 3:35–4:20 |
| Codebase walkthrough | 4:20–4:50 |
| Closing | 4:50–5:00 |

## Retake checklist

- [ ] Audio is clear and consistent.
- [ ] No secrets or private files shown.
- [ ] No overclaims (especially Paymaster/Gasless on Arc).
- [ ] Product pages loaded successfully.
- [ ] API v0 endpoints shown (live or curl fallback).
- [ ] Codebase overview shown briefly and cleanly.
- [ ] Final claim-safe closing statement included.
