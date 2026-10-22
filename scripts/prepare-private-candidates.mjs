import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { summarizeRitual } from "./audit-evidence.mjs";
import { summarizeAttendanceSnapshot, summarizeChallengeSnapshot } from "./audit-official-snapshot.mjs";
import { sanitizeRaw } from "./sanitize-ritual.mjs";
import { generateCandidates } from "./build-candidates.mjs";

function ensure(value, message) {
  if (!value) throw new Error(message);
}

/**
 * Compose private generator input only from previously audited, separate
 * evidence kinds. Human-reviewed focusTags are optional and NEVER inferred
 * from private ritual wording or from attendance/task status.
 *
 * This function does not publish or approve data.
 */
export function preparePrivateCandidates({ ritual, attendanceSnapshot, challengeSnapshot, reviewedTags = {} }) {
  const ritualAudit = summarizeRitual(ritual);
  const attendanceAudit = summarizeAttendanceSnapshot(attendanceSnapshot);
  const challengeAudit = summarizeChallengeSnapshot(challengeSnapshot);

  ensure(attendanceSnapshot.asOf === challengeSnapshot.asOf,
    "Attendance and challenge snapshots must share the same asOf date");
  ensure(ritualAudit.period.to <= attendanceSnapshot.asOf,
    "Ritual contains dates newer than the official snapshot; use a newer official snapshot");
  const counts = attendanceAudit.counts;
  const tasks = challengeAudit.counts;
  const input = sanitizeRaw(ritual, reviewedTags, {
    enrolledDays: counts.enrolledDays,
    presentDays: counts.presentDays,
    absentDays: counts.absentDays,
    pendingDays: counts.pendingDays,
  }, {
    coreTotal: tasks.coreChallenges,
    coreApproved: tasks.coreApproved,
    finalA: tasks.finalAStatus,
    finalB: tasks.finalBStatus,
  });

  // Stable dated rows; the source JSON's original order is not a provenance fact.
  input.rituals.days.sort((a, b) => a.date.localeCompare(b.date));
  const report = generateCandidates(input);
  ensure(report.report.counts.recordedDays === ritualAudit.counts.recordedDates &&
    report.report.counts.morningDays === ritualAudit.counts.openingWithText &&
    report.report.counts.closingDays === ritualAudit.counts.closingWithText,
  "Generator counts disagree with audited ritual source");
  ensure(report.report.counts.attendancePresent === counts.presentDays &&
    report.report.counts.approvedCoreTasks === tasks.coreApproved,
  "Generator counts disagree with official snapshot sources");
  ensure(report.report.publication === "NOT_APPROVED" &&
    report.report.candidates.every((entry) => entry.status === "pending"),
  "Generator must keep all candidates pending");
  return { input, ...report };
}

async function main() {
  const inputRoot = resolve("data/private");
  const outputRoot = resolve("generated/private");
  const filenames = {
    ritual: resolve(inputRoot, "ritual-history-2026-10-21.json"),
    attendance: resolve(inputRoot, "attendance-snapshot.json"),
    challenge: resolve(inputRoot, "challenge-snapshot.json"),
    tags: resolve(inputRoot, "reviewed-tags.json"),
  };
  const readJSON = async (path) => JSON.parse(await readFile(path, "utf8"));
  const [ritual, attendanceSnapshot, challengeSnapshot] = await Promise.all([
    readJSON(filenames.ritual),
    readJSON(filenames.attendance),
    readJSON(filenames.challenge),
  ]);
  let reviewedTags = {};
  let hasTagsFile = false;
  try {
    reviewedTags = await readJSON(filenames.tags);
    hasTagsFile = true;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const { input, bytes, sha256 } = preparePrivateCandidates({
    ritual, attendanceSnapshot, challengeSnapshot, reviewedTags,
  });
  await mkdir(inputRoot, { recursive: true });
  await mkdir(outputRoot, { recursive: true });
  await writeFile(resolve(inputRoot, "candidate-input.json"), JSON.stringify(input, null, 2) + "\n",
    { mode: 0o600 });
  await writeFile(resolve(outputRoot, "candidates.json"), bytes, { mode: 0o600 });
  console.log("PASS: offline audited snapshots combined with private ritual summary");
  console.log("PASS: generator candidates remain pending; no public files modified");
  console.log("Candidate JSON SHA-256:", sha256);
  if (!hasTagsFile) {
    console.log("NOTE: no manually reviewed tags file; ability dates remain unassigned");
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    // Never echo the original JSON or contents of personal records.
    console.error("Private integration failed:", error.message);
    process.exitCode = 1;
  });
}
