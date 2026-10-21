import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { pathToFileURL } from "node:url";

const hash = (s) => createHash("sha256").update(s).digest("hex");
const isDay = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) &&
  !Number.isNaN(Date.parse(s + "T00:00:00Z")) &&
  new Date(s + "T00:00:00Z").toISOString().slice(0, 10) === s;
const integer = (x) => Number.isSafeInteger(x) && x >= 0;
const object = (x) => x && typeof x === "object" && !Array.isArray(x);
const ordered = (x) => Object.fromEntries(Object.entries(x).sort(([a],[b])=>a.localeCompare(b,"en")).map(
  ([k,v]) => [k, Array.isArray(v) ? v.map(normalize) : normalize(v)]));
function normalize(v) { return object(v) ? ordered(v) : v; }
function assert(condition, message) { if (!condition) throw new Error(message); }

/**
 * Deterministic, privacy-preserving candidate generator.
 * Requires pre-audited *summary counts*. Does not import or emit raw ritual text.
 * Never touches public source, approval files, or the deployment directory.
 */
export function generateCandidates(input) {
  assert(object(input) && input.schema === "trace.generator-input.v1", "Invalid input schema");
  const { rituals, attendance, challenges } = input;
  assert(object(rituals) && Array.isArray(rituals.days), "Missing rituals.days");
  const dates = new Set();
  for (const day of rituals.days) {
    assert(object(day) && isDay(day.date) && !dates.has(day.date), "Invalid/duplicate ritual date");
    assert(typeof day.openHasText === "boolean" && typeof day.closeHasText === "boolean", "Ritual values must be booleans");
    assert(day.focusTags === undefined || (Array.isArray(day.focusTags) &&
      day.focusTags.every((t) => ["self_regulation","relationships","self_motivation"].includes(t))), "Unrecognized ability tag");
    dates.add(day.date);
  }
  assert(dates.size > 0, "No ritual dates");
  assert(object(attendance) && integer(attendance.enrolledDays) && attendance.enrolledDays > 0 &&
    integer(attendance.presentDays) && integer(attendance.pendingDays) &&
    integer(attendance.absentDays) &&
    attendance.presentDays + attendance.pendingDays + attendance.absentDays <= attendance.enrolledDays,
    "Invalid attendance summary");
  assert(object(challenges) && integer(challenges.coreTotal) && integer(challenges.coreApproved) &&
    challenges.coreApproved <= challenges.coreTotal && ["approved","in_progress","locked","available"].includes(challenges.finalA) &&
    ["approved","in_progress","locked","available"].includes(challenges.finalB), "Invalid challenge summary");
  assert(challenges.finalA === "approved" || challenges.finalB === "locked", "Final B must be locked before A approval");

  const days = [...rituals.days].sort((a,b)=>a.date.localeCompare(b.date));
  const counts = {
    recordedDays: days.length,
    morningDays: days.filter(d=>d.openHasText).length,
    closingDays: days.filter(d=>d.closeHasText).length,
    attendancePresent: attendance.presentDays,
    attendanceEnrolled: attendance.enrolledDays,
    attendancePending: attendance.pendingDays,
    approvedCoreTasks: challenges.coreApproved,
    coreTaskTotal: challenges.coreTotal,
  };
  const names = [
    ["self_regulation","자기조절력","문제를 나누어 확인하고 해결 방식을 조정했습니다."],
    ["relationships","대인관계력","팀 안에서 수행한 구체적 행동을 근거와 함께 검토합니다."],
    ["self_motivation","자기동기력","정해진 목표를 계속 실천하고 진행 과정을 점검했습니다."],
  ];
  const candidates = names.map(([tag,label,draft]) => {
    const matchedDates = days.filter(d=>(d.focusTags??[]).includes(tag)).map(d=>d.date);
    return {
      id: "candidate-" + tag,
      label, status: "pending",
      draft: matchedDates.length ? draft : "해당 능력에 연결된 검증 기록이 아직 없습니다.",
      evidenceDates: matchedDates,
      evidenceDefinition: "사용자가 사전 검토하여 부여한 focusTags의 날짜만 사용",
      requiresHumanVerification: true,
    };
  });
  const report = {
    schema: "trace.generator-output.v1",
    publication: "NOT_APPROVED",
    sourceScope: "sanitized summary inputs only",
    counts,
    candidates,
    limitations: [
      "리추얼 날짜 수는 실제 출석일 수가 아닙니다.",
      "출석의 미확정일은 분모에 포함되며 수치가 달라질 수 있습니다.",
      "생성 문단은 실제 행위를 자동 증명하지 않으며 수동 사실 검증이 필요합니다.",
      "사용자 공개 승인 없이는 사이트 콘텐츠로 복사하지 않습니다.",
    ],
  };
  const bytes = JSON.stringify(normalize(report), null, 2) + "\n";
  return { report: normalize(report), bytes, sha256: hash(bytes) };
}

async function main() {
  const [inputPath, outputPath] = process.argv.slice(2);
  if (!inputPath || !outputPath) {
    console.error("Usage: node scripts/build-candidates.mjs <private-sanitized-input.json> <private-output.json>");
    process.exitCode = 2;
    return;
  }
  const inPath = resolve(inputPath), outPath = resolve(outputPath);
  const allowed = resolve("generated/private") + "/";
  assert(outPath.startsWith(allowed), "Output must reside under generated/private/");
  const source = JSON.parse(await readFile(inPath,"utf8"));
  const { bytes, sha256 } = generateCandidates(source);
  await mkdir(dirname(outPath),{recursive:true});
  await writeFile(outPath, bytes, {encoding:"utf8",flag:"w",mode:0o600});
  console.log("Candidate report generated (private, pending). SHA-256:", sha256);
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((err)=>{console.error("Generation failed:",err.message);process.exitCode=1;});
}
