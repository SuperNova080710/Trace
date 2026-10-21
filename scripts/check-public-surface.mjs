import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const roots = ["src", "public", "generated/public"];
const offenders = [];
const riskyPaths = /(^|\/)(ritual-history-[^/]+\.json|\.env(?:\..+)?|credentials\.json|private)(\/|$)/i;
const riskyValues = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bgh[pousr]_[a-zA-Z0-9]{20,}\b/,
  /\bsk_(?:live|test)_[a-zA-Z0-9]{16,}\b/,
];

async function scan(path) {
  let entries;
  try {
    entries = await readdir(path, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }

  for (const entry of entries) {
    const fullPath = join(path, entry.name);
    const location = relative(process.cwd(), fullPath);
    if (riskyPaths.test(location)) {
      offenders.push(location + " (forbidden public path)");
      continue;
    }
    if (entry.isDirectory()) {
      await scan(fullPath);
    } else if (entry.isFile()) {
      const content = await readFile(fullPath, "utf8");
      if (riskyValues.some((pattern) => pattern.test(content))) {
        offenders.push(location + " (sensitive-looking content)");
      }
    }
  }
}

for (const root of roots) await scan(root);

if (offenders.length) {
  console.error("Public source check failed:\n" + offenders.join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS: no known private-path or secret-token patterns in public sources");
  console.log("NOTE: heuristic scan only; human privacy review remains mandatory");
}
