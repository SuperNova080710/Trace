import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const read = (p) => readFile(path.join(process.cwd(), p), "utf8");


test("static export is configured explicitly", async () => {
  const config = await read("next.config.ts");
  assert.match(config, /output:\s*["']export["']/);
});


test("private ritual source is ignored and not public content", async () => {
  const ignore = await read(".gitignore");
  assert.match(ignore, /ritual-history-\*\.json/);
  const profile = await read("src/content/public-profile.ts");
  assert.doesNotMatch(profile, /\.\.\/\.\.\/data\/private/);
  assert.match(profile, /entry\.status === "approved"/);
});


test("public data contains only the approved contact fields at foundation stage", async () => {
  const profile = await read("src/content/public-profile.ts");
  assert.match(profile, /displayName: "오리온"/);
  assert.match(profile, /contactEmail: "lionoh00@gmail.com"/);
  assert.match(profile, /export \{ narrative \} from "\.\/approved-narrative"/);
  assert.match(profile, /evidenceMetrics: readonly EvidenceMetric\[\] = \[/);
});


test("portfolio layout keeps a sticky profile beside the project column", async () => {
  const css = await read("src/app/globals.css");
  const lab = await read("src/components/trace-lab.tsx");
  assert.match(css, /\.portfolio-profile \{ position: sticky/);
  assert.match(lab, /className="container portfolio-layout"/);
  assert.match(lab, /className="portfolio-content"/);
  assert.doesNotMatch(lab, /orbit-outer|stage-coordinate|PERSPECTIVE \/|SIGNAL: GROWTH/);
});


test("cursor-follow glow is decorative and motion-aware", async () => {
  const css = await read("src/app/globals.css");
  const lab = await read("src/components/trace-lab.tsx");
  assert.match(lab, /onPointerMove=\{onSpotlightMove\}/);
  assert.match(lab, /pointerType !== "mouse"/);
  assert.match(css, /radial-gradient\(340px circle at var\(--spotlight-x/);
  assert.match(css, /pointer-events: none/);
  assert.match(css, /@media \(hover: hover\) and \(pointer: fine\)/);
  assert.match(css, /\.spotlight-card::after \{ display: none; \}/);
});


test("no private folder present in project root", async () => {
  const root = await readdir(process.cwd());
  assert.ok(!root.includes(".trace-private"));
});


test("profile navigation reaches contact while the email opens the mail app", async () => {
  const lab = await read("src/components/trace-lab.tsx");
  assert.match(lab, /href="#contact">연락처/);
  assert.match(lab, /id="contact" aria-labelledby="contact-title"/);
  assert.ok(lab.includes('className="portfolio-email" href={"mailto:" + contactEmail}'));
});


test("issue #3 provides accessible mobile navigation and distinct future documents state", async () => {
  const lab = await read("src/components/trace-lab.tsx");
  const css = await read("src/app/globals.css");
  const page = await read("src/app/page.tsx");
  assert.match(lab, /aria-expanded=\{mobileMenuOpen\}/);
  assert.match(lab, /aria-controls="trace-main-nav"/);
  assert.match(lab, /event\.key === "Escape"/);
  assert.match(lab, /href="#documents"/);
  assert.match(lab, /id="documents"/);
  assert.match(lab, /href="#contact"/);
  assert.match(lab, /백엔드 · 풀스택 개발자/);
  assert.match(lab, /href="\/documents\/resume\/"/);
  assert.match(lab, /href="\/documents\/personal-statement\/"/);
  assert.match(lab, /href="\/documents\/project-experience\/"/);
  assert.doesNotMatch(lab, /아직 다운로드 가능한 파일이 아닙니다/);
  assert.match(css, /\.main-nav\.is-open \{ display: flex; \}/);
  assert.match(page, /id="main-content" tabIndex=\{-1\}/);
});


test("T10 research display is limited to supported Held-out evaluation", async () => {
  const data = await read("src/content/research-evidence.ts");
  const page = await read("src/components/trace-lab.tsx");
  assert.match(data, /totalTrials: 200/);
  assert.match(data, /heldout: \{ trials: 110, beacon: 50, normal: 60 \}/);
  assert.match(data, /timingOnly: \{ tp: 50, fp: 10, tn: 50, fn: 0 \}/);
  assert.match(data, /multiFeature: \{ tp: 50, fp: 7, tn: 53, fn: 0 \}/);
  assert.match(page, /id="project-t10"/);
  assert.match(page, /ECH Beacon Explorer/);
  assert.match(page, /href="\/ech-beacon-explorer"/);
  assert.match(page, /두 방식의 재현율은 같았고/);
  assert.match(page, /결과의 범위는 단일 통제 환경입니다/);
});



test("application document cards reuse pointer glow and lift only for fine pointers", async () => {
  const lab = await read("src/components/trace-lab.tsx");
  const css = await read("src/app/globals.css");
  const start = lab.indexOf('className="document-list"');
  const end = lab.indexOf("</section>", start);
  assert.ok(start > 0 && end > start);
  const documents = lab.slice(start, end);
  assert.equal((documents.match(/className="document-item spotlight-card" onPointerMove=\{onSpotlightMove\}/g) ?? []).length, 3);
  for (const slug of ["resume", "personal-statement", "project-experience"]) {
    assert.ok(documents.includes(`href="/documents/${slug}/"`));
  }
  assert.match(css, /\.document-item\.spotlight-card::after\s*\{[\s\S]*?radial-gradient/);
  assert.match(css, /@media \(hover: hover\) and \(pointer: fine\)\s*\{\s*\.document-item\.spotlight-card:hover/);
  assert.match(css, /\.document-item\.spotlight-card:hover\s*\{\s*transform:\s*translateY\(-6px\)/);
  assert.match(css, /\.document-item\.spotlight-card:focus-within/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.document-item\.spotlight-card\s*\{\s*transition:\s*none;\s*\}\s*\.document-item\.spotlight-card:hover\s*\{\s*transform:\s*none/);
  assert.match(css, /\.document-item\.spotlight-card::after\s*\{\s*display:\s*none/);
});


test("hiring review starts with the blog and retains the project evidence and documents", async () => {
  const lab = await read("src/components/trace-lab.tsx");
  assert.ok(lab.indexOf('id="project-blog"') < lab.indexOf('id="capstone-title"'));
  assert.ok(lab.indexOf('id="capstone-title"') < lab.indexOf('id="project-t10"'));
  assert.match(lab, /작성자에게 200, 다른 로그인 사용자에게 403, 인증 정보가 없는 요청에 401/);
  assert.match(lab, /posts\.service\.ts/);
  assert.match(lab, /<details[\s\S]*?<summary>실험 설계와 공개 근거/);
  assert.doesNotMatch(lab, /리추얼 기록 날짜|공식 출석일|자기조절력|작업 방식/);
});
