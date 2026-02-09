import { readFile } from "node:fs/promises";
import { globSync } from "glob";

function validateNode(node, location) {
  const errors = [];

  if (!node || typeof node !== "object" || Array.isArray(node)) {
    errors.push(`${location}: JSON-LD node must be an object.`);
    return errors;
  }

  const context = node["@context"];
  if (typeof context !== "string" || !context.includes("schema.org")) {
    errors.push(`${location}: missing or invalid @context.`);
  }

  const type = node["@type"];
  if (typeof type !== "string" || type.length === 0) {
    errors.push(`${location}: missing @type.`);
    return errors;
  }

  if (type === "FAQPage") {
    if (!Array.isArray(node.mainEntity) || node.mainEntity.length === 0) {
      errors.push(`${location}: FAQPage requires a non-empty mainEntity array.`);
    } else {
      node.mainEntity.forEach((item, index) => {
        if (item?.["@type"] !== "Question") {
          errors.push(`${location}: mainEntity[${index}] must be a Question.`);
        }
        if (typeof item?.name !== "string" || item.name.trim().length === 0) {
          errors.push(`${location}: mainEntity[${index}] missing question name.`);
        }
        const answer = item?.acceptedAnswer;
        if (answer?.["@type"] !== "Answer" || typeof answer?.text !== "string" || answer.text.trim().length === 0) {
          errors.push(`${location}: mainEntity[${index}] missing acceptedAnswer text.`);
        }
      });
    }
  }

  if (type === "Article") {
    if (typeof node.headline !== "string" || node.headline.trim().length === 0) {
      errors.push(`${location}: Article requires headline.`);
    }
    if (typeof node.description !== "string" || node.description.trim().length === 0) {
      errors.push(`${location}: Article requires description.`);
    }
    if (typeof node.mainEntityOfPage !== "string" || node.mainEntityOfPage.trim().length === 0) {
      errors.push(`${location}: Article requires mainEntityOfPage.`);
    }
  }

  if (type === "SoftwareApplication") {
    if (typeof node.name !== "string" || node.name.trim().length === 0) {
      errors.push(`${location}: SoftwareApplication requires name.`);
    }
    if (typeof node.applicationCategory !== "string" || node.applicationCategory.trim().length === 0) {
      errors.push(`${location}: SoftwareApplication requires applicationCategory.`);
    }
    if (typeof node.operatingSystem !== "string" || node.operatingSystem.trim().length === 0) {
      errors.push(`${location}: SoftwareApplication requires operatingSystem.`);
    }
    if (typeof node.url !== "string" || node.url.trim().length === 0) {
      errors.push(`${location}: SoftwareApplication requires url.`);
    }
  }

  return errors;
}

const htmlFiles = globSync("**/*.html", {
  ignore: ["node_modules/**"],
  nodir: true,
  windowsPathsNoEscape: true
});

const jsonLdPattern = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
const errors = [];
let count = 0;

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const matches = [...html.matchAll(jsonLdPattern)];

  for (const match of matches) {
    const payload = match[1]?.trim();
    if (!payload) {
      errors.push(`${file}: empty JSON-LD script block.`);
      continue;
    }

    let parsed;
    try {
      parsed = JSON.parse(payload);
    } catch (error) {
      errors.push(`${file}: invalid JSON-LD JSON syntax (${error.message}).`);
      continue;
    }

    count += 1;
    if (Array.isArray(parsed)) {
      parsed.forEach((node, index) => {
        errors.push(...validateNode(node, `${file} [node ${index}]`));
      });
    } else {
      errors.push(...validateNode(parsed, file));
    }
  }
}

if (count === 0) {
  console.error("No JSON-LD blocks found in HTML files.");
  process.exit(1);
}

if (errors.length > 0) {
  console.error("Structured data validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Structured data validation passed (${count} block(s) checked).`);
