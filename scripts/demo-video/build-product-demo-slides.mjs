import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const base = path.join(root, "demo-output", "agentpay-founder-demo");
const screenshotsDir = path.join(base, "screenshots");
const slidesDir = path.join(base, "slides");
const scenesPath = path.join(root, "docs", "demo", "generated", "AGENTPAY_FOUNDER_DEMO_SCENES.json");

fs.mkdirSync(slidesDir, { recursive: true });

const scenes = JSON.parse(fs.readFileSync(scenesPath, "utf8")).scenes;

const screenshotByScene = {
  "01": "01-homepage-hero.png",
  "02": "02-homepage-lifecycle.png",
  "03": "03-agents.png",
  "04": "04-create-job.png",
  "05": "manual/05-jobs-manual.png",
  "06": "manual/06-job-detail-manual.png",
  "07": "manual/07-payments-manual.png",
  "08": "08-docs.png",
  "09": "09-api-proof.png",
  "10": "10-codebase.png",
  "11": "11-closing.png",
};

for (const scene of scenes) {
  const shotName = screenshotByScene[scene.id];
  const shotPath = shotName ? path.join(screenshotsDir, shotName) : null;
  if (!shotPath || !fs.existsSync(shotPath)) {
    throw new Error(`Missing required screenshot for scene ${scene.id}: ${shotName}`);
  }

  const bgUrl = `../screenshots/${shotName}`;
  const html = `<!doctype html>
<html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" />
<title>AgentPay Scene ${scene.id}</title>
<style>
html,body{margin:0;width:1920px;height:1080px;font-family:Inter,Segoe UI,Arial,sans-serif;background:#070A12;color:#fff}
.slide{position:relative;width:100%;height:100%;overflow:hidden}
.bg{position:absolute;inset:0;background-image:url('${bgUrl}');background-size:cover;background-position:center}
.topFade{position:absolute;left:0;right:0;top:0;height:190px;background:linear-gradient(180deg,rgba(4,8,18,.78),rgba(4,8,18,0))}
.bottomFade{position:absolute;left:0;right:0;bottom:0;height:340px;background:linear-gradient(0deg,rgba(4,8,18,.84),rgba(4,8,18,0))}
.brand{position:absolute;left:34px;top:26px;font-size:16px;color:#9FE8FF;letter-spacing:.08em;text-transform:uppercase;font-weight:700}
.title{position:absolute;left:38px;bottom:120px;font-size:46px;line-height:1.12;margin:0;font-weight:800;max-width:1280px}
.caption{position:absolute;left:38px;bottom:60px;font-size:24px;line-height:1.35;margin:0;color:#DBEAFE;max-width:1460px}
.mark{position:absolute;right:36px;bottom:32px;font-size:12px;color:#7DD3FC;letter-spacing:.08em;text-transform:uppercase}
</style></head>
<body><div class="slide"><div class="bg"></div><div class="topFade"></div><div class="bottomFade"></div>
<div class="brand">AgentPay · Arc Testnet MVP</div>
<h1 class="title">${escapeHtml(scene.title)}</h1>
<p class="caption">${escapeHtml(scene.caption)}</p>
<div class="mark">Scene ${escapeHtml(scene.id)} · ${escapeHtml(String(scene.duration))}s</div>
</div></body></html>`;

  fs.writeFileSync(path.join(slidesDir, `scene-${scene.id}.html`), html, "utf8");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

console.log("Product demo HTML slides generated from real screenshots.");
console.log("Next: render scene PNGs with Playwright screenshot of each HTML file.");
