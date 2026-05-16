import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STORYBOOK_IFRAME_PATH = path.join(ROOT_DIR, "storybook-static", "iframe.html");
const OUTPUT_DIR = path.join(ROOT_DIR, "output", "screenshot");
const OUTPUT_PATH = path.join(OUTPUT_DIR, "launcher-view.png");
const STORY_ID = "view-mainview-dashboardview--launcher-shell";
const VIEWPORT = "1440,900";

function getBrowserCandidates() {
  const platform = os.platform();
  const candidates = [];

  if (process.env.CHROME_PATH) {
    candidates.push(process.env.CHROME_PATH);
  }

  if (platform === "win32") {
    candidates.push(
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
      "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    );
  }

  if (platform === "darwin") {
    candidates.push(
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
      "/Applications/Chromium.app/Contents/MacOS/Chromium",
    );
  }

  candidates.push("google-chrome", "chrome", "chromium", "chromium-browser", "msedge");
  return candidates;
}

function resolveBrowserPath() {
  for (const candidate of getBrowserCandidates()) {
    if (path.isAbsolute(candidate) && existsSync(candidate)) {
      return candidate;
    }

    if (!path.isAbsolute(candidate)) {
      const probe = spawnSync(candidate, ["--version"], {
        shell: true,
        stdio: "ignore",
      });

      if (probe.status === 0) {
        return candidate;
      }
    }
  }

  throw new Error("Chrome, Chromium, or Edge was not found. Set CHROME_PATH to a browser executable.");
}

if (!existsSync(STORYBOOK_IFRAME_PATH)) {
  throw new Error("storybook-static/iframe.html was not found. Run pnpm build-storybook first.");
}

mkdirSync(OUTPUT_DIR, { recursive: true });

const browserPath = resolveBrowserPath();
const storyUrl = `${pathToFileURL(STORYBOOK_IFRAME_PATH).href}?id=${STORY_ID}&viewMode=story`;
const result = spawnSync(
  browserPath,
  [
    "--headless",
    "--disable-gpu",
    "--allow-file-access-from-files",
    "--hide-scrollbars",
    `--window-size=${VIEWPORT}`,
    "--virtual-time-budget=12000",
    `--screenshot=${OUTPUT_PATH}`,
    storyUrl,
  ],
  {
    shell: false,
    stdio: "inherit",
  },
);

if (result.error) {
  throw result.error;
}

if (result.status !== 0) {
  throw new Error(`Screenshot command failed with exit code ${result.status ?? "unknown"}.`);
}

console.log(`Saved screenshot: ${OUTPUT_PATH}`);
