import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "demo-output", "agentpay-founder-demo");
const screenshotsDir = path.join(outDir, "screenshots");
const dataDir = path.join(outDir, "data");
const scenesPath = path.join(root, "docs", "demo", "generated", "AGENTPAY_FOUNDER_DEMO_SCENES.json");
const fallbackMd = path.join(outDir, "scripts", "capture-fallback.md");

fs.mkdirSync(screenshotsDir, { recursive: true });
fs.mkdirSync(path.dirname(fallbackMd), { recursive: true });

const scenes = JSON.parse(fs.readFileSync(scenesPath, "utf8"));
const baseUrl = scenes.live?.baseUrl ?? "https://agentpay-dusky.vercel.app";

let jobId = scenes.live?.jobId ?? "35698";
try {
  const jobs = JSON.parse(fs.readFileSync(path.join(dataDir, "jobs-limit-1.json"), "utf8"));
  const live = jobs?.jobs?.[0]?.id;
  if (live) jobId = String(live);
} catch {}

const targets = [
  ["scene-01-home", `${baseUrl}/`],
  ["scene-02-problem", `${baseUrl}/`],
  ["scene-03-lifecycle", `${baseUrl}/`],
  ["scene-04-agents", `${baseUrl}/agents`],
  ["scene-05-create-job", `${baseUrl}/create-job`],
  ["scene-06-jobs", `${baseUrl}/jobs`],
  ["scene-07-job-detail", `${baseUrl}/jobs/${jobId}`],
  ["scene-08-payments", `${baseUrl}/payments`],
  ["scene-09-docs", `${baseUrl}/docs`],
  ["scene-09-api-health", `${baseUrl}/api/health`],
  ["scene-09-api-jobs", `${baseUrl}/api/jobs?limit=1`],
  ["scene-09-api-identity", `${baseUrl}/api/identity/resolve?name=agentpayagent.circle`],
  ["scene-10-github", `https://github.com/khenzarr/agentpay`],
  ["scene-11-closing", `${baseUrl}/`],
];

async function run() {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    const md = `# Capture Fallback\n\nPlaywright is unavailable. Capture these URLs manually at 1920x1080:\n\n${targets
      .map(([name, url]) => `- ${name}: ${url}`)
      .join("\n")}\n\nSave under: \`demo-output/agentpay-founder-demo/screenshots\`\n\nDo not submit transactions or trigger wallet actions.`;
    fs.writeFileSync(fallbackMd, md, "utf8");
    console.log("Playwright missing. Wrote fallback:", fallbackMd);
    return;
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  for (const [name, url] of targets) {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(2200);
    await page.screenshot({ path: path.join(screenshotsDir, `${name}.png`), fullPage: false });
    console.log("Captured", name);
  }

  await browser.close();
  console.log("Capture complete.");
}

run().catch((err) => {
  console.error("capture failed", err);
  process.exitCode = 1;
});
