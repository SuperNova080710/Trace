/** User-transcribed, official-portal SUMMARY snapshots, kept local until approved. */
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
function validDate(value) {
  if (typeof value !== "string" || !datePattern.test(value)) return false;
  const parsed = new Date(value + "T00:00:00Z");
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}
function object(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Expected summary object");
}
function number(value, name) {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error("Invalid nonnegative integer: " + name);
  return value;
}
function source(value) {
  if (typeof value !== "string" || !value.trim()) throw new Error("Missing source description");
}
function metric(id, value, unit, denominator, formula) {
  return { id, value, unit, denominator, formula, status: "pending" };
}
const percent = (n, d) => Math.round(n / d * 1000) / 10;

export function summarizeAttendanceSnapshot(raw, digest = "not-provided") {
  object(raw);
  source(raw.source);
  if (!validDate(raw.from) || !validDate(raw.asOf) || raw.from > raw.asOf) throw new Error("Invalid snapshot period");
  if (raw.scope !== "all-training-days") throw new Error("Summary scope must be all-training-days");
  const training = number(raw.trainingDays, "trainingDays");
  const enrolled = number(raw.enrolledDays, "enrolledDays");
  const present = number(raw.presentDays, "presentDays");
  const absent = number(raw.absentDays, "absentDays");
  const pending = number(raw.pendingDays, "pendingDays");
  const ritual = number(raw.platformRitualCount, "platformRitualCount");
  const excused = raw.excusedDays == null ? null : number(raw.excusedDays, "excusedDays");
  if (!enrolled || enrolled > training || present + absent + pending + (excused ?? 0) > enrolled) {
    throw new Error("Attendance statuses exceed enrolled days");
  }
  const rate = raw.displayedRate;
  if (typeof rate !== "number" || !Number.isFinite(rate) ||
      rate < 0 || rate > 100 || Math.round(rate * 10) / 10 !== rate) {
    throw new Error("Invalid displayed attendance rate");
  }
  const unknown = enrolled - present - absent - pending;
  // An unreported excused count remains unknown, even if 0 would explain the rate.
  const candidates = excused == null ? Array.from({ length: unknown + 1 }, (_, i) => i) : [excused];
  if (!candidates.some((leave) => percent(present + leave, enrolled) === rate)) {
    throw new Error("Displayed rate disagrees with attendance-plus-excused formula");
  }
  return {
    schema: "trace.evidence-candidates.v1",
    sourceKind: "official-attendance-snapshot",
    sourceDigest: digest,
    sourceLabel: "ALEPH Studio 출석 화면 (사용자 전사)",
    period: { from: raw.from, asOf: raw.asOf, scope: "all-training-days" },
    counts: { trainingDays: training, enrolledDays: enrolled,
      presentDays: present, absentDays: absent, pendingDays: pending,
      excusedDays: excused, platformRitualCount: ritual },
    displayedRate: rate,
    metrics: [
      metric("attendance.present", present, "일", enrolled, "공식 화면 출석 수"),
      metric("attendance.provisional-rate", rate, "%", enrolled, "(출석+공가)/재적일; 미확정 포함"),
      metric("platform.ritual-cumulative", ritual, "회", null, "플랫폼 누적 횟수; JSON 기록 날짜와 별도"),
    ],
    limitations: [
      "분모에 아직 확정되지 않은 훈련일이 포함됩니다. 강사 확정 후 출석률이 바뀔 수 있습니다.",
      "주말, 공휴일, 휴강일은 훈련일에서 제외됩니다.",
      "공가 건수가 표시되지 않았다면 0으로 확정하지 않습니다.",
      "플랫폼 리추얼 횟수는 개인 JSON 기록 날짜 수와 별개입니다.",
      "승인 전까지 공개 사이트에 반영하지 않습니다.",
    ],
  };
}

export function summarizeChallengeSnapshot(raw, digest = "not-provided") {
  object(raw);
  source(raw.source);
  if (!validDate(raw.asOf)) throw new Error("Invalid challenge snapshot date");
  const total = number(raw.totalChallenges, "totalChallenges");
  const core = number(raw.coreChallenges, "coreChallenges");
  const approvedCore = number(raw.coreApproved, "coreApproved");
  const approvedAll = number(raw.masterApproved, "masterApproved");
  if (total !== core + 2 || approvedCore > core || approvedAll > total) {
    throw new Error("Inconsistent challenge totals");
  }
  const statuses = ["approved", "in_progress", "available", "locked"];
  if (!statuses.includes(raw.finalA) || !statuses.includes(raw.finalB)) {
    throw new Error("Unknown final challenge status");
  }
  if (raw.finalA !== "approved" && raw.finalB !== "locked") {
    throw new Error("Final B cannot open before Final A approval");
  }
  if (approvedCore + Number(raw.finalA === "approved") + Number(raw.finalB === "approved") !== approvedAll) {
    throw new Error("Master approval total mismatch");
  }
  return {
    schema: "trace.evidence-candidates.v1",
    sourceKind: "official-challenge-snapshot",
    sourceDigest: digest,
    sourceLabel: "ALEPH Studio 과제 상태 화면 (사용자 캡처)",
    period: { asOf: raw.asOf, snapshot: true },
    counts: { totalChallenges: total, coreChallenges: core, coreApproved: approvedCore,
      masterApproved: approvedAll, finalAStatus: raw.finalA, finalBStatus: raw.finalB },
    metrics: [
      metric("challenges.master-approved", approvedAll, "개", total, "마스터 승인 수"),
      metric("challenges.core-approved", approvedCore, "개", core, "핵심 과제 승인 수"),
    ],
    limitations: [
      "진행 중이나 잠긴 과제를 승인·완료로 계산하지 않습니다.",
      "현재 화면의 스냅샷이며 이후 승인 상태가 변경될 수 있습니다.",
      "승인 전까지 공개 사이트에 반영하지 않습니다.",
    ],
  };
}
