import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { summarizeAttendanceSnapshot, summarizeChallengeSnapshot } from "./audit-official-snapshot.mjs";

/**
 * Offline, read-only candidate metrics. Never publishes or edits src/content/.
 * Raw text (including peer feedback) is deliberately excluded from the output.
 */
const iso = /^\d{4}-\d{2}-\d{2}$/;
const validDate = (date) =>
  typeof date === "string" &&
  iso.test(date) &&
  !Number.isNaN(Date.parse(date + "T00:00:00Z")) &&
  new Date(date + "T00:00:00Z").toISOString().slice(0, 10) === date;

const requirePlain = (value, description) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Expected " + description + " object");
  }
};

function uniqueDatedRows(rows, label) {
  if (!Array.isArray(rows)) throw new Error(label + " must be an array");
  const seen = new Set();
  for (const row of rows) {
    requirePlain(row, label + " item");
    if (!validDate(row.date)) throw new Error("Invalid ISO date in " + label);
    if (seen.has(row.date)) throw new Error("Duplicate date in " + label);
    seen.add(row.date);
  }
  return [...rows].sort((a, b) => a.date.localeCompare(b.date));
}

function metricsFromCounts(counts, source, from, to, digest) {
  return Object.entries(counts).map(([id, value]) => ({
    id,
    value: value.count,
    unit: value.unit ?? "일",
    denominator: value.denominator ?? null,
    definition: value.definition,
    calculation: value.calculation,
    source,
    from,
    to,
    sourceDigest: digest,
    status: "pending",
  }));
}

export function summarizeRitual(raw, digest = "not-provided") {
  requirePlain(raw, "ritual source");
  const rows = uniqueDatedRows(raw.days, "ritual days");
  if (!rows.length) throw new Error("Ritual source has no days");
  let opening = 0, closing = 0, emptyClose = 0, missingClose = 0, late = 0;
  const strengths = { done: 0, partly: 0, not_done: 0 };
  const mappings = { "실천했다": "done", "일부 실천했다": "partly", "못 했다": "not_done" };
  for (const row of rows) {
    if (!Array.isArray(row.open)) throw new Error("Morning record must be an array");
    if (!row.open.every((line) => typeof line === "string")) throw new Error("Invalid morning entry");
    if (row.open.length) opening++;
    if (row.close == null) missingClose++;
    else {
      if (!Array.isArray(row.close)) throw new Error("Closing record must be array or null");
      if (!row.close.every((line) => typeof line === "string")) throw new Error("Invalid closing entry");
      if (row.close.length) {
        closing++;
        const values = row.close.filter((line) => line.startsWith("강점 행동:"));
        if (values.length > 1) throw new Error("Duplicate strength outcome");
        if (values.length === 1) {
          const key = mappings[values[0].slice("강점 행동:".length).trim()];
          if (!key) throw new Error("Unrecognized strength outcome");
          strengths[key]++;
        }
      } else emptyClose++;
    }
    if ([...row.open, ...(row.close ?? [])].some((line) => line.includes("늦은 작성"))) late++;
  }
  const from = rows[0].date, to = rows.at(-1).date, denominator = rows.length;
  const source = "사용자 제공 리추얼 JSON (로컬 원본)";
  return {
    schema: "trace.evidence-candidates.v1",
    sourceKind: "ritual",
    sourceDigest: digest,
    period: { from, to },
    counts: {
      recordedDates: denominator,
      openingWithText: opening,
      closingWithText: closing,
      closingEmpty: emptyClose,
      closingNull: missingClose,
      explicitlyLate: late,
      strengthOutcomes: strengths,
    },
    metrics: metricsFromCounts({
      "ritual.recorded-dates": { count: denominator, definition: "리추얼 날짜 레코드 수(실제 출석일 아님)", calculation: "고유 days[].date 개수" },
      "ritual.open-with-text": { count: opening, denominator, definition: "내용이 있는 아침 리추얼 날짜(같은 날 실시간 작성 여부는 미확인)", calculation: "open.length > 0인 날짜 수 / 기록 날짜 수" },
      "ritual.close-with-text": { count: closing, denominator, definition: "내용이 있는 마무리 리추얼 날짜(실제 출석일 아님)", calculation: "close가 비어 있지 않은 배열인 날짜 수 / 기록 날짜 수" },
    }, source, from, to, digest),
    limitations: [
      "리추얼 작성일은 출석일, 연속 참여일, 당일 작성일과 같지 않습니다.",
      "표시된 날짜 구간이 과정 전체 13주를 의미하지 않습니다.",
      "미기록/빈 기록/null을 구별했습니다. 개인 문장과 타인 정보는 결과에 포함하지 않았습니다.",
      "이 수치는 후보이며 사용자 공개 승인과 출처 검토 이전에는 게시하지 않습니다.",
    ],
  };
}

export function summarizeAttendance(raw, digest = "not-provided") {
  requirePlain(raw, "attendance source");
  if (typeof raw.source !== "string" || !raw.source.trim()) throw new Error("Attendance source description required");
  const rows = uniqueDatedRows(raw.days, "attendance days");
  if (!rows.length) throw new Error("Attendance source has no days");
  const statuses = ["present", "late", "absent", "excused"];
  const counts = Object.fromEntries(statuses.map((status) => [status, 0]));
  for (const row of rows) {
    if (!statuses.includes(row.status)) throw new Error("Unrecognized attendance status");
    counts[row.status]++;
  }
  const from = rows[0].date, to = rows.at(-1).date;
  return {
    schema: "trace.evidence-candidates.v1",
    sourceKind: "attendance",
    sourceDigest: digest,
    period: { from, to },
    counts: { statuses: counts, totalRows: rows.length },
    metrics: metricsFromCounts({
      "attendance.present": {
        count: counts.present,
        denominator: rows.length,
        definition: "출석 원본에서 present로 기록된 날짜 수; 지각 등은 별도",
        calculation: "days[].status === present인 날짜 수 / 원본에 실린 날짜 수",
      },
    }, raw.source, from, to, digest),
    limitations: [
      "출석 원본의 진위와 기간은 별도 확인해야 합니다.",
      "지각/결석/공결은 임의로 출석으로 합산하지 않았습니다.",
      "원본에 없는 날짜를 결석으로 추정하지 않습니다.",
      "사용자 승인 이전에는 게시하지 않습니다.",
    ],
  };
}

export function summarizeApprovals(raw, digest = "not-provided") {
  requirePlain(raw, "task source");
  if (typeof raw.source !== "string" || !raw.source.trim()) throw new Error("Task source description required");
  if (!Array.isArray(raw.tasks) || raw.tasks.length === 0) throw new Error("Task source has no tasks");
  const statuses = ["approved", "submitted", "in_progress", "rejected"];
  const seen = new Set(), counts = Object.fromEntries(statuses.map((status) => [status, 0]));
  for (const row of raw.tasks) {
    requirePlain(row, "task");
    if (typeof row.taskCode !== "string" || !/^[A-Z]{1,5}\d{1,3}(?:-[AB])?$/.test(row.taskCode)) {
      throw new Error("Invalid task code");
    }
    if (seen.has(row.taskCode)) throw new Error("Duplicate task");
    seen.add(row.taskCode);
    if (!statuses.includes(row.status)) throw new Error("Unrecognized approval status");
    counts[row.status]++;
  }
  if (!validDate(raw.from) || !validDate(raw.to) || raw.from > raw.to) throw new Error("Invalid task period");
  return {
    schema: "trace.evidence-candidates.v1",
    sourceKind: "approvals",
    sourceDigest: digest,
    period: { from: raw.from, to: raw.to },
    counts: { statuses: counts, totalTasks: raw.tasks.length },
    metrics: metricsFromCounts({
      "approvals.approved": {
        count: counts.approved,
        denominator: raw.tasks.length,
        unit: "개",
        definition: "공식 확인 내역에서 승인(approved) 상태인 고유 과제 수",
        calculation: "tasks[].status === approved인 고유 taskCode 수 / 원본에 실린 고유 과제 수",
      },
    }, raw.source, raw.from, raw.to, digest),
    limitations: [
      "제출만 완료한 과제는 승인으로 계산하지 않았습니다.",
      "입력된 과제 목록이 전체 과제인지 별도 확인이 필요합니다.",
      "사용자 승인 이전에는 게시하지 않습니다.",
    ],
  };
}

const handlers = { ritual: summarizeRitual, attendance: summarizeAttendance, approvals: summarizeApprovals, "attendance-snapshot": summarizeAttendanceSnapshot, "challenge-snapshot": summarizeChallengeSnapshot };
export function summarize(kind, raw, digest = "not-provided") {
  if (!Object.hasOwn(handlers, kind)) throw new Error("Expected kind: ritual|attendance|approvals|attendance-snapshot|challenge-snapshot");
  return handlers[kind](raw, digest);
}

async function main() {
  const [kind, file] = process.argv.slice(2);
  if (!file || !Object.hasOwn(handlers, kind)) {
    console.error("Usage: node scripts/audit-evidence.mjs ritual|attendance|approvals|attendance-snapshot|challenge-snapshot <path-to-local-private-json>");
    process.exitCode = 2;
    return;
  }
  try {
    const bytes = await readFile(file);
    const digest = "sha256:" + createHash("sha256").update(bytes).digest("hex");
    const raw = JSON.parse(bytes.toString("utf8"));
    const result = summarize(kind, raw, digest);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Source could not be audited: " + error.message);
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
