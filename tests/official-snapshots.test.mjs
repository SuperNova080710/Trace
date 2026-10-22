import test from "node:test";
import assert from "node:assert/strict";
import { summarizeAttendanceSnapshot, summarizeChallengeSnapshot } from "../scripts/audit-official-snapshot.mjs";

const attendance = { source: "fictional example", from: "2026-01-05", asOf: "2026-01-16", scope: "all-training-days", trainingDays: 10, enrolledDays: 10, presentDays: 8, absentDays: 0, pendingDays: 2, excusedDays: null, platformRitualCount: 6, displayedRate: 80 };
test("attendance snapshot preserves pending days and distinct platform rituals", () => {
  const r = summarizeAttendanceSnapshot(attendance);
  assert.equal(r.counts.pendingDays, 2);
  assert.equal(r.counts.excusedDays, null);
  assert.equal(r.metrics[2].value, 6);
  assert.ok(r.metrics.every(x => x.status === "pending"));
  assert.ok(!JSON.stringify(r).includes("fictional example"));
});
test("attendance rejects impossible totals and mismatched official rates", () => {
  assert.throws(() => summarizeAttendanceSnapshot({...attendance, pendingDays: 3}), /exceed enrolled/);
  assert.throws(() => summarizeAttendanceSnapshot({...attendance, displayedRate: 90}), /disagrees/);
});
const challenge = { source: "fictional example", asOf: "2026-01-16", totalChallenges: 5, coreChallenges: 3, coreApproved: 3, masterApproved: 3, finalA: "in_progress", finalB: "locked" };
test("final challenges do not inflate approved core count", () => {
  const r = summarizeChallengeSnapshot(challenge);
  assert.equal(r.counts.masterApproved, 3);
  assert.equal(r.counts.finalAStatus, "in_progress");
  assert.equal(r.counts.finalBStatus, "locked");
  assert.ok(r.metrics.every(x => x.status === "pending"));
});
test("challenge snapshot checks sequential unlock and master approval count", () => {
  assert.throws(() => summarizeChallengeSnapshot({...challenge, masterApproved: 4}), /mismatch/);
  assert.throws(() => summarizeChallengeSnapshot({...challenge, finalB: "available"}), /cannot open/);
});
