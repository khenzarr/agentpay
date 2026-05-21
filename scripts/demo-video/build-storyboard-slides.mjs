import fs from "node:fs";
import path from "node:path";
import { execFileSync, execSync } from "node:child_process";

const root = process.cwd();
const out = path.join(root, "demo-output", "agentpay-founder-demo");
const slides = path.join(out, "slides");
const scenesPath = path.join(root, "docs", "demo", "generated", "AGENTPAY_FOUNDER_DEMO_SCENES.json");

const scenes = JSON.parse(fs.readFileSync(scenesPath, "utf8")).scenes;

execFileSync("node", [path.join(root, "scripts", "demo-video", "build-product-demo-slides.mjs")], { stdio: "inherit" });

async function renderPngsWithPlaywrightModule() {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    return false;
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  for (const s of scenes) {
    const file = path.join(slides, `scene-${s.id}.html`);
    await page.goto(`file:///${file.replace(/\\/g, "/")}`);
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(slides, `scene-${s.id}.png`) });
  }
  await browser.close();
  console.log("Slide PNG render complete.");
  return true;
}

function renderPngsWithPlaywrightCli() {
  for (const s of scenes) {
    const file = path.join(slides, `scene-${s.id}.html`);
    const pngPath = path.join(slides, `scene-${s.id}.png`);
    const cmd = `npx -y playwright screenshot --device="Desktop Chrome" --viewport-size=1920,1080 "file:///${file.replace(/\\/g, "/")}" "${pngPath}"`;
    execSync(cmd, { stdio: "inherit", shell: true });
  }
  console.log("Slide PNG render complete (Playwright CLI fallback).");
}

function tryNpxPlaywrightProbe() {
  try {
    const out = execSync("npx playwright --version", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      shell: true,
    }).trim();
    console.log(`npx playwright probe succeeded: ${out}`);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  fs.mkdirSync(slides, { recursive: true });
  const rendered = await renderPngsWithPlaywrightModule();
  if (rendered) return;

  const npxOk = tryNpxPlaywrightProbe();
  if (!npxOk) {
    throw new Error("Playwright is required for final screenshot-based slide PNGs. No synthetic fallback allowed.");
  }
  renderPngsWithPlaywrightCli();
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
