import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../out/index.html", import.meta.url), "utf8");
const requiredTargets = ["main-content", "about", "approach", "projects", "evidence", "documents", "contact"];

assert.match(html, /<html[^>]+lang="ko"/);
for (const id of requiredTargets) {
  assert.ok(html.includes(`id="${id}"`), `Missing section anchor: ${id}`);
}
assert.ok(html.includes('href="#main-content"'), "Skip link must point to main");
assert.ok(html.includes('href="#contact"'), "Contact anchor missing");
assert.ok(html.includes('href="mailto:lionoh00@gmail.com"'), "Actual contact mailto missing");
assert.ok(html.includes("문제의 원인을 확인하고 해결 과정을 기록으로 남기는 사람"), "Approved-style one-line hook missing");
assert.ok(html.includes("모르는 문제가 생기면 제가 아는 지식 내에서 차근차근 찾아보는 사람입니다"), "Approved narrative opening missing");
assert.ok(html.includes("프로젝트 경험기술서"), "Documents status section missing");
assert.ok(html.includes("Native ECH Beacon Detection"), "T10 research missing");
assert.ok(html.includes("T13 · 차기 앱 예정"), "T13 future slot missing");
assert.ok(html.includes("아직 다운로드 가능한 파일이 아닙니다"), "Documents must not falsely claim available downloads");
assert.ok(!html.includes("ritual-history-2026-10-21.json"), "Private source filename must not be rendered");
for (const term of [
  "리추얼 기록 날짜",
  "공식 출석일",
  "핵심 과제 마스터 승인",
  "2026-10-21",
  "리추얼 원본에 날짜별 기록",
  "2일은 미확정 상태",
  "마지막 A·B 과제는 이 수치에 포함하지 않습니다",
]) {
  assert.ok(html.includes(term), "Approved historic evidence missing from static export: " + term);
}
assert.ok(!html.includes("본인이 웹 공개를 승인하기 전에는 개인 수치를 표시하지 않으며"), "Pre-approval placeholder must not be shown after author approval");
console.log("PASS: public static HTML contains all required anchors, contact and visible approved content");
