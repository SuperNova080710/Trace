import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const read = (p) => readFile(path.join(process.cwd(), p), "utf8");

test("static export is configured explicitly", async () => {
  const config = await read("next.config.ts");
  assert.match(config, /output:\s*["']export["']/);
});

test("private ritual source is ignored and not public content", async () => {
  const ignore = await read(".gitignore");
  assert.match(ignore, /ritual-history-\*\.json/);
  const profile = await read("src/content/public-profile.ts");
  assert.doesNotMatch(profile, /\.\.\/\.\.\/data\/private/);
  assert.match(profile, /entry\.status === "approved"/);
});

test("public data contains only the approved contact fields at foundation stage", async () => {
  const profile = await read("src/content/public-profile.ts");
  assert.match(profile, /displayName: "오리온"/);
  assert.match(profile, /contactEmail: "lionoh00@gmail.com"/);
  assert.match(profile, /narrative: readonly ApprovedNarrative\[\] = \[\]/);
  assert.match(profile, /evidenceMetrics: readonly EvidenceMetric\[\] = \[\]/);
});

test("app has Korean semantics and accessible interaction scaffold", async () => {
  const layout = await read("src/app/layout.tsx");
  const lab = await read("src/components/trace-lab.tsx");
  assert.match(layout, /lang="ko"/);
  assert.match(lab, /role="tablist"/);
  assert.match(lab, /role="tabpanel"/);
  assert.match(lab, /ArrowRight/);
  assert.match(lab, /ArrowLeft/);
});

test("no private folder present in project root", async () => {
  const root = await readdir(process.cwd());
  assert.ok(!root.includes(".trace-private"));
});
