import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(path, "utf8");

test("unapproved private activity metrics remain absent from public data", async () => {
  const profile = await read("src/content/public-profile.ts");
  const page = await read("src/app/page.tsx");
  assert.match(profile, /evidenceMetrics: readonly EvidenceMetric\[\] = \[\]/);
  assert.match(profile, /entry\.status === "approved"/);
  assert.match(page, /approvedOnly\(evidenceMetrics\)/);
  assert.doesNotMatch(profile, /data\/private\/|generated\/private\/|ritual-history-/);
});

test("approved metric schema requires independent sources and explicit denominator", async () => {
  const profile = await read("src/content/public-profile.ts");
  for (const field of ["sourceKind", "asOf", "denominator", "definition",
    "calculation", "provisional", "limitations", "status"]) {
    assert.match(profile, new RegExp("\\b" + field + "\\b"));
  }
  assert.match(profile, /"ritual" \| "official-attendance-snapshot" \| "official-challenge-snapshot"/);
  assert.match(profile, /denominator: number \| null/);
});

test("approved metrics display source, coverage, formula, and limitations", async () => {
  const lab = await read("src/components/trace-lab.tsx");
  for (const term of ["metric.sourceKind", "metric.source", "metric.definition",
    "metric.calculation", "metric.denominator", "metric.asOf", "metric.provisional",
    "metric.limitations", "metric.from", "metric.to"]) {
    assert.ok(lab.includes(term), "Missing evidence field in UI: " + term);
  }
  assert.match(lab, /metric\.denominator === null \? "원본에 별도 분모 없음"/);
  assert.match(lab, /잠정 수치 · 공식 확정 또는 승인 상태 변경 시 재검증 필요/);
  assert.match(lab, /metrics\.length > 0[\s\S]*?검증한 기록만 보여드리겠습니다\./);
});

test("compact evidence detail layout allows long source labels to wrap", async () => {
  const css = await read("src/app/globals.css");
  assert.match(css, /\.metric-facts dd \{[^}]*overflow-wrap: anywhere/);
  assert.match(css, /\.metric-facts > div \{[^}]*minmax\(0,1fr\)/);
  assert.match(css, /\.metrics-grid \{ grid-template-columns: 1fr; \}/);
});
