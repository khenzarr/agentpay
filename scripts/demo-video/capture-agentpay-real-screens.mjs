import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const root = process.cwd();
const outDir = path.join(root, "demo-output", "agentpay-founder-demo");
const shotsDir = path.join(outDir, "screenshots");
const dataDir = path.join(outDir, "data");
const scenesPath = path.join(root, "docs", "demo", "generated", "AGENTPAY_FOUNDER_DEMO_SCENES.json");

fs.mkdirSync(shotsDir, { recursive: true });

const scenes = JSON.parse(fs.readFileSync(scenesPath, "utf8"));
const baseUrl = scenes.live?.baseUrl ?? "https://agentpay-dusky.vercel.app";

function readJsonOrNull(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

const jobsLimit = readJsonOrNull(path.join(dataDir, "jobs-limit-1.json"));
const health = readJsonOrNull(path.join(dataDir, "health.json"));
const identity = readJsonOrNull(path.join(dataDir, "identity-agentpayagent-circle.json"));

const liveJobId = String(jobsLimit?.jobs?.[0]?.id ?? scenes.live?.jobId ?? "35698");

function createApiProofHtml() {
  const apiProofPath = path.join(outDir, "scripts", "api-proof.html");
  fs.mkdirSync(path.dirname(apiProofPath), { recursive: true });

  const jobsSnippet = jobsLimit ?? {
    note: "jobs-limit-1.json not found; capture script used fallback note.",
  };
  const healthSnippet = health ?? {
    note: "health.json not found; capture script used fallback note.",
  };
  const identitySnippet = identity ?? {
    note: "identity-agentpayagent-circle.json not found; capture script used fallback note.",
  };

  const html = `<!doctype html>
<html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" />
<title>AgentPay API Proof</title>
<style>
  :root { color-scheme: dark; }
  body { margin:0; background:#070A12; color:#E2E8F0; font:16px/1.45 Inter,Segoe UI,Arial,sans-serif; }
  .wrap { width:1920px; height:1080px; box-sizing:border-box; padding:42px 56px; }
  .kicker { color:#9FE8FF; font-size:14px; letter-spacing:.1em; text-transform:uppercase; }
  h1 { margin:10px 0 20px; font-size:42px; line-height:1.12; }
  .grid { display:grid; grid-template-columns:1fr 1fr; gap:18px; }
  .card { border:1px solid rgba(45,212,255,.35); border-radius:14px; background:rgba(8,13,26,.82); overflow:hidden; }
  .head { padding:10px 12px; border-bottom:1px solid rgba(45,212,255,.2); color:#93C5FD; font-size:13px; }
  pre { margin:0; padding:14px; font-size:12px; line-height:1.4; max-height:340px; overflow:auto; white-space:pre-wrap; }
  .note { margin-top:16px; color:#CBD5E1; font-size:15px; }
</style></head>
<body><div class="wrap">
  <div class="kicker">AgentPay Developer API v0</div>
  <h1>Read-only endpoint outputs</h1>
  <div class="grid">
    <section class="card"><div class="head">GET /api/health</div><pre>${escapeHtml(JSON.stringify(healthSnippet, null, 2))}</pre></section>
    <section class="card"><div class="head">GET /api/jobs?limit=1</div><pre>${escapeHtml(JSON.stringify(jobsSnippet, null, 2))}</pre></section>
  </div>
  <section class="card" style="margin-top:18px;"><div class="head">GET /api/identity/resolve?name=agentpayagent.circle</div><pre>${escapeHtml(JSON.stringify(identitySnippet, null, 2))}</pre></section>
  <p class="note">The Developer API v0 is read-only. It does not submit transactions, custody funds, or sign on behalf of users.</p>
</div></body></html>`;

  fs.writeFileSync(apiProofPath, html, "utf8");
  return apiProofPath;
}

function createCodebaseHtml() {
  const codebasePath = path.join(outDir, "scripts", "codebase-proof.html");
  const html = `<!doctype html>
<html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" />
<title>AgentPay Codebase Walkthrough</title>
<style>
  body{margin:0;background:#070A12;color:#E2E8F0;font:16px/1.45 Inter,Segoe UI,Arial,sans-serif}
  .wrap{width:1920px;height:1080px;box-sizing:border-box;padding:56px}
  .kicker{color:#9FE8FF;letter-spacing:.09em;font-size:14px;text-transform:uppercase}
  h1{margin:10px 0 16px;font-size:44px}
  .panel{border:1px solid rgba(45,212,255,.35);border-radius:16px;background:rgba(8,13,26,.85);padding:24px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
  ul{margin:0;padding-left:20px}
  li{margin:8px 0}
  code{color:#93C5FD}
  .note{margin-top:16px;color:#CBD5E1}
</style></head>
<body><div class="wrap">
  <div class="kicker">AgentPay Founder Demo</div>
  <h1>Codebase walkthrough (real project files)</h1>
  <div class="grid">
    <section class="panel"><ul>
      <li><code>src/components/agentpay/CreateJobForm.tsx</code></li>
      <li><code>src/hooks/useAgentPayJobs.ts</code></li>
      <li><code>src/lib/events.ts</code></li>
    </ul></section>
    <section class="panel"><ul>
      <li><code>src/app/api/jobs/route.ts</code></li>
      <li><code>src/lib/arcnsResolver.ts</code></li>
      <li><code>src/components/ui/agentpay/*</code></li>
    </ul></section>
  </div>
  <p class="note">Read/index architecture is separated across routes, hooks, event parsing, and UI primitives.</p>
</div></body></html>`;
  fs.writeFileSync(codebasePath, html, "utf8");
  return codebasePath;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function run() {
  let playwright;
  try {
    playwright = await import("playwright");
  } catch {
    playwright = null;
  }

  const apiProofHtml = createApiProofHtml();
  const codebaseHtml = createCodebaseHtml();

  const targets = [
    ["01-homepage-hero.png", `${baseUrl}/`],
    ["02-homepage-lifecycle.png", `${baseUrl}/`],
    ["03-agents.png", `${baseUrl}/agents`],
    ["04-create-job.png", `${baseUrl}/create-job`],
    ["05-jobs.png", `${baseUrl}/jobs`],
    ["06-job-detail.png", `${baseUrl}/jobs/${liveJobId}`],
    ["07-payments.png", `${baseUrl}/payments`],
    ["08-docs.png", `${baseUrl}/docs`],
    ["09-api-proof.png", `file:///${apiProofHtml.replace(/\\/g, "/")}`],
    ["10-codebase.png", `file:///${codebaseHtml.replace(/\\/g, "/")}`],
    ["11-closing.png", `${baseUrl}/`],
  ];

  if (!playwright) {
    for (const [filename, url] of targets) {
      const targetPath = path.join(shotsDir, filename);
      const cmd = `npx -y playwright screenshot --device="Desktop Chrome" --viewport-size=1920,1080 "${url}" "${targetPath}"`;
      execSync(cmd, { stdio: "inherit", shell: true });
      console.log(`Captured ${filename} via Playwright CLI`);
    }
    console.log("Real screenshot capture complete (CLI fallback).");
    return;
  }

  const { chromium } = playwright;
  let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: "msedge" });
  } catch {
    try {
      browser = await chromium.launch({ headless: true, channel: "chrome" });
    } catch {
      browser = await chromium.launch({ headless: true });
    }
  }

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();
  page.setDefaultTimeout(90000);

  for (const [filename, url] of targets) {
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(shotsDir, filename), fullPage: false });
    console.log(`Captured ${filename}`);
  }

  await browser.close();
  console.log("Real screenshot capture complete.");
}

run().catch((error) => {
  console.error("capture failed", error);
  process.exitCode = 1;
});
