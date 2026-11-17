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
assert.ok(html.includes("백엔드 · 풀스택 개발자"), "Candidate role missing");
const blog = html.indexOf('id="project-blog"');
const capstone = html.indexOf('id="capstone-title"');
const research = html.indexOf('id="project-t10"');
assert.ok(blog >= 0 && blog < capstone && capstone < research, "Project order in the hiring flow changed");
assert.ok(html.includes("프로젝트 경험기술서"), "Documents status section missing");
assert.ok(html.includes("Native ECH Beacon Detection"), "T10 research missing");
assert.ok(html.includes("ECH Beacon Explorer"), "BR-B featured application missing");
assert.ok(html.includes('href="/ech-beacon-explorer"'), "BR-B app route missing from portfolio");
for (const slug of ["resume", "personal-statement", "project-experience"]) {
  assert.ok(new RegExp(`href="/documents/${slug}/?"`).test(html), `Missing document link: ${slug}`);
  const documentPage = await readFile(new URL(`../out/documents/${slug}.html`, import.meta.url), "utf8");
  assert.ok(documentPage.includes("Word 다운로드"), `Missing DOCX action: ${slug}`);
  assert.ok(documentPage.includes(`/downloads/TRACE_${slug}.docx`), `Missing DOCX link: ${slug}`);
  assert.ok(documentPage.includes("PDF로 저장"), `Missing PDF print option: ${slug}`);
  const docx = await readFile(new URL(`../out/downloads/TRACE_${slug}.docx`, import.meta.url));
  assert.ok(docx.length > 2000 && docx.subarray(0, 2).toString("latin1") === "PK", `Invalid DOCX: ${slug}`);
}
assert.ok(!html.includes("ritual-history-2026-10-21.json"), "Private source filename must not be rendered");
for (const term of ["리추얼 기록 날짜", "공식 출석일", "핵심 과제 마스터 승인"]) {
  assert.ok(!html.includes(term), "Historical training metric returned to the home page: " + term);
}
assert.ok(!html.includes("본인이 웹 공개를 승인하기 전에는 개인 수치를 표시하지 않으며"), "Pre-approval placeholder must not be shown after author approval");
console.log("PASS: public static HTML contains all required anchors, contact and visible approved content");

const brbHtml = await readFile(new URL("../out/ech-beacon-explorer.html", import.meta.url), "utf8");
for (const term of [
  'id="explorer-title"',
  "Native ECH 환경에서 지터가 적용된 HTTPS Beacon 트래픽의 경량 메타데이터 기반 탐지 비교",
  "보안 학습자와 분석자",
  "시나리오를 선택합니다",
  "두 탐지기의 판정을 비교합니다",
  "탐지 효과와 비용을 함께 판단합니다",
  "실험 표본 탐색 가능",
]) {
  assert.ok(brbHtml.includes(term), "BR-B static page missing required introductory content: " + term);
}
assert.ok(brbHtml.includes('href="/#projects"'), "BR-B backlink to portfolio missing");
assert.ok(!brbHtml.includes("ritual-history-2026-10-21.json"), "BR-B static page must not expose private input name");
console.log("PASS: BR-B independent static research introduction exported with clear limitations");
