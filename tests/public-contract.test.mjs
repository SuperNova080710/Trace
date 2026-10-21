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
  assert.match(profile, /evidenceMetrics: readonly EvidenceMetric\[\] = \[\]/);
});

test("app has Korean semantics and keyboard-operable accordion", async () => {
  const layout = await read("src/app/layout.tsx");
  const lab = await read("src/components/trace-lab.tsx");
  assert.match(layout, /lang="ko"/);
  assert.match(lab, /aria-expanded=/);
  assert.match(lab, /aria-controls=/);
  assert.match(lab, /ArrowRight/);
  assert.match(lab, /ArrowLeft/);
  assert.match(lab, /ArrowDown/);
  assert.match(lab, /ArrowUp/);
  assert.match(lab, /Home/);
  assert.match(lab, /End/);
});

test("T01-like structure uses light sections with a restrained navy hero", async () => {
  const css = await read("src/app/globals.css");
  const lab = await read("src/components/trace-lab.tsx");
  assert.match(css, /\.section-white\s*\{\s*background:\s*#fff/);
  assert.match(css, /\.hero\s*\{[^}]*var\(--navy\)/s);
  assert.match(lab, /className="project-grid"/);
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

test("accordion animates its height but still hides collapsed content accessibly", async () => {
  const css = await read("src/app/globals.css");
  const lab = await read("src/components/trace-lab.tsx");
  assert.match(css, /grid-template-rows: 0fr/);
  assert.match(css, /grid-template-rows: 1fr/);
  assert.match(css, /visibility: hidden/);
  assert.match(css, /\.approach-detail-inner \{ min-height: 0; overflow: hidden; \}/);
  assert.match(lab, /aria-hidden=\{!isOpen\}/);
  assert.match(lab, /aria-expanded=\{isOpen\}/);
  assert.doesNotMatch(lab, /id=\{contentId\} hidden=/);
});

test("no private folder present in project root", async () => {
  const root = await readdir(process.cwd());
  assert.ok(!root.includes(".trace-private"));
});

test("header Contact scrolls to the contact section while footer email opens the mail app", async () => {
  const lab = await read("src/components/trace-lab.tsx");
  assert.match(lab, /className="header-contact" href="#contact"/);
  assert.match(lab, /id="contact" aria-labelledby="contact-title"/);
  assert.ok(lab.includes('className="contact-mail" href={"mailto:" + contactEmail}'));
});

test("issue #2 publishes only author-approved narrative in three factual chapters", async () => {
  const story = await read("src/content/approved-narrative.ts");
  const lab = await read("src/components/trace-lab.tsx");
  const page = await read("src/app/page.tsx");
  const approved = story.match(/status: "approved"/g) ?? [];
  assert.equal(approved.length, 10);
  assert.match(story, /모르는 문제가 생기면 제가 아는 지식 내에서 차근차근 찾아보는 사람입니다\./);
  assert.match(story, /앞으로 새로운 기술과 낯선 문제를 피하기보다 구조를 이해하고, 원인을 파악하는 해결 과정을 자신의 경험이나 지식으로 쌓는 개발자가 되려고 합니다\./);
  assert.match(page, /approvedOnly\(narrative\)/);
  for (const id of ["difficulty", "turning", "growth", "closing"]) {
    assert.ok(lab.includes('chapter === "' + id + '"') || lab.includes('id: "' + id + '"'));
  }
  assert.match(lab, /구체적인 개인 역할은 추가 검증이 필요합니다/);
  assert.doesNotMatch(lab, /원고와 실제 기록을 대조한 자기소개 본문은 사용자 검토 후 추가할 예정입니다/);
  assert.doesNotMatch(story, /\b(?:ghp_|sk_live_|-----BEGIN PRIVATE KEY)/);
});

test("three capabilities have distinct evidence boundaries", async () => {
  const lab = await read("src/components/trace-lab.tsx");
  for (const term of ["자기조절력", "대인관계력", "자기동기력", "세부 행동 보완 예정"]) {
    assert.ok(lab.includes(term));
  }
});

test("approved story has scroll-led timeline with subtle nonblocking visual cues", async () => {
  const css = await read("src/app/globals.css");
  const lab = await read("src/components/trace-lab.tsx");
  assert.match(lab, /className="story-chapters" ref=\{storyTimelineRef\}/);
  assert.match(lab, /className="story-timeline-fill" aria-hidden="true"/);
  assert.match(lab, /--timeline-progress/);
  assert.match(lab, /IntersectionObserver/);
  assert.match(lab, /entry\.target\.classList\.add\("is-in-view"\)/);
  assert.match(css, /\.story-chapter\[data-step="02"\] \.story-chapter-body/);
  assert.match(css, /translateY\(12px\)/);
  assert.match(css, /\.ability-grid article:hover \{ transform: translateY\(-3px\)/);
});

test("narrative is readable without motion APIs or for reduced-motion users", async () => {
  const css = await read("src/app/globals.css");
  const lab = await read("src/components/trace-lab.tsx");
  assert.match(lab, /typeof IntersectionObserver === "undefined"/);
  assert.match(lab, /prefers-reduced-motion: reduce/);
  assert.match(css, /\.story-chapter\.reveal-ready:not\(\.is-in-view\) \.story-chapter-body \{ opacity: 1; transform: none; \}/);
  assert.doesNotMatch(lab, /aria-hidden=\{[^}]*chapter/);
  assert.doesNotMatch(lab, /문장.*본인 승인 후 추가됩니다/);
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
  assert.match(lab, /문제의 원인을 확인하고 해결 과정을 기록으로 남기는 사람/);
  assert.match(lab, /아직 다운로드 가능한 파일이 아닙니다/);
  assert.match(css, /\.main-nav\.is-open \{ display: flex; \}/);
  assert.match(page, /id="main-content" tabIndex=\{-1\}/);
});

test("accordion keyboard outline surrounds the entire expanded article", async () => {
  const css = await read("src/app/globals.css");
  const lab = await read("src/components/trace-lab.tsx");
  assert.match(css, /\.approach-item:has\(> h3 > \.approach-trigger:focus-visible\) \{/);
  assert.match(css, /\.approach-item:has\(> h3 > \.approach-trigger:focus-visible\) \.approach-trigger:focus-visible/);
  assert.match(lab, /className=\{"approach-item" \+ \(isOpen \? " is-open" : ""\)\}/);
  assert.match(lab, /aria-expanded=\{isOpen\}/);
  assert.match(css, /\.approach-item\.is-open \.approach-detail \{/);
});

test("Tab after scrolling keeps the reading position without changing normal Tab navigation", async () => {
  const lab = await read("src/components/trace-lab.tsx");
  const css = await read("src/app/globals.css");
  assert.match(lab, /event\.key !== "Tab" \|\| event\.shiftKey/);
  assert.match(lab, /event\.defaultPrevented/);
  assert.match(lab, /scrolledSinceFocus/);
  assert.match(lab, /bounds\.bottom > 88 && bounds\.top < window\.innerHeight - 24/);
  assert.match(lab, /event\.preventDefault\(\);[\s\S]*target\.focus\(\{ preventScroll: true \}\)/);
  assert.match(lab, /originalTabIndex === null\) target\.removeAttribute\("tabindex"\)/);
  assert.match(lab, /document\.removeEventListener\("keydown", handleTab, true\)/);
  assert.match(css, /\.reading-resume-focus:focus \{/);
});
