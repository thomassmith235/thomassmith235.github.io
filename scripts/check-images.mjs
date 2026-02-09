import { stat } from "node:fs/promises";
import path from "node:path";
import { globSync } from "glob";

const MAX_RASTER_BYTES = 350 * 1024;
const MAX_SVG_BYTES = 75 * 1024;
const WARN_BYTES = 200 * 1024;

const imageFiles = globSync("assets/images/**/*.{png,jpg,jpeg,webp,avif,svg}", {
  nodir: true,
  windowsPathsNoEscape: true
});

if (imageFiles.length === 0) {
  console.log("No images found in assets/images.");
  process.exit(0);
}

const failures = [];
const warnings = [];

for (const file of imageFiles) {
  const info = await stat(file);
  const ext = path.extname(file).toLowerCase();
  const maxBytes = ext === ".svg" ? MAX_SVG_BYTES : MAX_RASTER_BYTES;

  if (info.size > maxBytes) {
    failures.push(`${file}: ${info.size} bytes (max ${maxBytes} bytes)`);
    continue;
  }

  if (info.size > WARN_BYTES) {
    warnings.push(`${file}: ${info.size} bytes (consider stronger compression)`);
  }
}

console.log(`Checked ${imageFiles.length} image file(s).`);

if (warnings.length > 0) {
  console.log("\nWarnings:");
  for (const warning of warnings) {
    console.log(`- ${warning}`);
  }
}

if (failures.length > 0) {
  console.error("\nImage compression check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Image compression check passed.");
