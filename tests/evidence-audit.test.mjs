import test from "node:test";
import assert from "node:assert/strict";
import { summarize, summarizeRitual, summarizeAttendance, summarizeApprovals } from "../scripts/audit-evidence.mjs";

const ritual = {
  student: "Test fixture only",
  peerNamesMasked: true,
  days: [
    { date: "2026-01-02", open: ["호흡: 예시"], close: ["강점 행동: 실천했다", "동료: 기밀 원문"] },
    { date: "2026-01-05", open: ["표시: 늦은 작성"], close: [] },
    { date: "2026-01-06", open: ["예시"], close: null },
    { date: "2026-01-07", open: ["예시"], close: ["강점 행동: 일부 실천했다"] },
  ],
};
test("ritual measurement distinguishes recorded/morning/closing/late and null/empty", () => {
  const v = summarizeRitual(ritual, "sha256:test");
  assert.deepEqual(v.counts, {
    recordedDates: 4, openingWithText: 4, closingWithText: 2, closingEmpty: 1,
    closingNull: 1, explicitlyLate: 1,
    strengthOutcomes: { done: 1, partly: 1, not_done: 0 },
  });
  assert.equal(v.metrics[2].denominator, 4);
  assert.ok(v.metrics.every((m) => m.status === "pending"));
  assert.ok(v.limitations.some((s) => s.includes("출석일")));
  assert.equal(JSON.stringify(v).includes("기밀 원문"), false);
  assert.equal(JSON.stringify(v).includes("Test fixture only"), false);
});
test("ritual data must have unique ISO dates and well-defined statuses", () => {
  const duplicated = { ...ritual, days: [ritual.days[0], ritual.days[0]] };
  assert.throws(() => summarizeRitual(duplicated), /Duplicate date/);
  const impossible = { ...ritual, days: [{ ...ritual.days[0], date: "2026-02-30" }] };
  assert.throws(() => summarizeRitual(impossible), /Invalid ISO date/);
  const unexpected = { ...ritual, days: [{ ...ritual.days[0], close: ["강점 행동: 미정"] }] };
  assert.throws(() => summarizeRitual(unexpected), /Unrecognized strength outcome/);
});
test("attendance never converts ritual days or late entries to present", () => {
  const result = summarizeAttendance({
    source: "Example attendance register, not real",
    days: [
      { date: "2026-01-03", status: "late" },
      { date: "2026-01-02", status: "present" },
      { date: "2026-01-04", status: "absent" },
    ],
  });
  assert.deepEqual(result.counts.statuses, { present: 1, late: 1, absent: 1, excused: 0 });
  assert.equal(result.metrics[0].value, 1);
  assert.equal(result.metrics[0].status, "pending");
});
test("approvals count only approved tasks and reject duplicate task codes", () => {
  const example = {
    source: "Example approval register, not real",
    from: "2026-01-01", to: "2026-01-31",
    tasks: [{ taskCode: "T01", status: "submitted" }, { taskCode: "T02", status: "approved" }],
  };
  const result = summarizeApprovals(example);
  assert.equal(result.metrics[0].value, 1);
  assert.equal(result.metrics[0].denominator, 2);
  assert.equal(result.metrics[0].status, "pending");
  assert.throws(() => summarizeApprovals({ ...example, tasks: [example.tasks[0], example.tasks[0]] }), /Duplicate task/);
});
test("summary kind requires distinct source schemas", () => {
  assert.throws(() => summarize("attendance", ritual), /Attendance source description/);
  assert.throws(() => summarize("ritual", { days: [{ date: "2026-01-01", open: null, close: [] }] }), /Morning record must be an array/);
  assert.throws(() => summarize("unsupported", {}), /Expected kind/);
});
