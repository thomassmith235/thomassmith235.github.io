import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";

const PORT = 4173;
const HOST = "127.0.0.1";
const ROOT = process.cwd();

const URLS = [
  `http://${HOST}:${PORT}/`,
  `http://${HOST}:${PORT}/fmea/`,
  `http://${HOST}:${PORT}/insights/what-is-fmea/`
];

const THRESHOLDS = {
  performance: 0.7,
  seo: 0.9
};

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8"
};

function safePathname(urlPath) {
  const withoutQuery = urlPath.split("?")[0].split("#")[0];
  const decoded = decodeURIComponent(withoutQuery);
  const normalized = path.normalize(decoded).replace(/^([.][.][/\\])+/, "");
  return normalized;
}

async function resolveFile(urlPath) {
  let filePath = path.join(ROOT, safePathname(urlPath));

  try {
    const fileStats = await stat(filePath);
    if (fileStats.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }
  } catch {
    if (!path.extname(filePath)) {
      filePath = path.join(filePath, "index.html");
    }
  }

  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(ROOT))) {
    throw new Error("Path traversal blocked");
  }

  return resolved;
}

function startStaticServer() {
  return new Promise((resolve) => {
    const server = http.createServer(async (req, res) => {
      try {
        const filePath = await resolveFile(req.url || "/");
        const data = await readFile(filePath);
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
        res.end(data);
      } catch {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
      }
    });

    server.listen(PORT, HOST, () => resolve(server));
  });
}

function scoreValue(value) {
  return typeof value === "number" ? value : 0;
}

let server;
let chrome;

try {
  server = await startStaticServer();
  chrome = await launch({
    chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"]
  });

  const failures = [];

  for (const url of URLS) {
    const runnerResult = await lighthouse(
      url,
      {
        port: chrome.port,
        output: "json",
        logLevel: "error",
        onlyCategories: ["performance", "seo", "best-practices", "accessibility"]
      },
      undefined
    );

    if (!runnerResult?.lhr) {
      failures.push(`${url}: no Lighthouse result produced.`);
      continue;
    }

    const { categories } = runnerResult.lhr;
    const perf = scoreValue(categories.performance?.score);
    const seo = scoreValue(categories.seo?.score);

    console.log(`${url}`);
    console.log(`- performance: ${Math.round(perf * 100)}`);
    console.log(`- seo: ${Math.round(seo * 100)}`);
    console.log(`- best-practices: ${Math.round(scoreValue(categories["best-practices"]?.score) * 100)}`);
    console.log(`- accessibility: ${Math.round(scoreValue(categories.accessibility?.score) * 100)}`);

    if (perf < THRESHOLDS.performance) {
      failures.push(`${url}: performance score ${perf.toFixed(2)} below threshold ${THRESHOLDS.performance.toFixed(2)}.`);
    }

    if (seo < THRESHOLDS.seo) {
      failures.push(`${url}: seo score ${seo.toFixed(2)} below threshold ${THRESHOLDS.seo.toFixed(2)}.`);
    }
  }

  if (failures.length > 0) {
    console.error("\nLighthouse checks failed:");
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exitCode = 1;
  } else {
    console.log("\nLighthouse checks passed.");
  }
} finally {
  if (chrome) {
    try {
      await chrome.kill();
    } catch (error) {
      if (error?.code !== "EPERM") {
        throw error;
      }
      console.warn("Warning: ignoring Chrome temp cleanup EPERM on this OS.");
    }
  }
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
}
