import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(path, "utf8");

test("only the three author-approved historical aggregates are public", async () => {
  const profile = await read("src/content/public-profile.ts");
  const page = await read("src/app/page.tsx");
  assert.match(profile, /evidenceMetrics: readonly EvidenceMetric\[\] = \[/);
  assert.match(profile, /entry\.status === "approved"/);
  assert.match(page, /approvedOnly\(evidenceMetrics\)/);
  assert.equal((profile.match(/status: "approved",/g) ?? []).length, 3);
  assert.equal((profile.match(/asOf: "2026-10-21"/g) ?? []).length, 3);
  for (const [label, count, denominator] of [
    ["리추얼 기록 날짜", 47, null],
    ["공식 출석일", 45, 47],
    ["핵심 과제 마스터 승인", 11, 11],
  ]) {
    assert.ok(profile.includes('label: "' + label + '"'));
    assert.match(profile, new RegExp("value: " + count + ","));
    assert.ok(profile.includes("denominator: " + (denominator === null ? "null" : denominator)));
  }
  assert.match(profile, /2일은 미확정 상태/);
  assert.match(profile, /매일 연속 작성/);
  assert.match(profile, /마지막 A·B 과제는 이 수치에 포함하지 않습니다/);
  assert.doesNotMatch(profile, /data\/private\/|generated\/private\/|ritual-history-/);
  assert.doesNotMatch(profile, /asOf: "2026-10-22"/);
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
