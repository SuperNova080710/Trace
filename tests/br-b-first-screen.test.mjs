import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [page, styles, contract] = await Promise.all([
  readFile("src/app/ech-beacon-explorer/page.tsx", "utf8"),
  readFile("src/app/ech-beacon-explorer/page.module.css", "utf8"),
  readFile("src/content/br-b-research-contract.json", "utf8").then(JSON.parse),
]);

test("BRB-C03: first screen displays exact frozen T10 paper title and names its target user", () => {
  assert.match(page, /<h1 id="explorer-title"/);
  assert.match(page, /ECH Beacon/);
  assert.match(page, /<h2 className=\{styles.paperTitle\}>\{study.title\}<\/h2>/);
  assert.match(contract.title, /Native ECH 환경에서 지터가 적용된 HTTPS Beacon/);
  assert.match(page, /보안 학습자와 트래픽 분석자/);
  assert.match(page, /판정·정상 오탐·추론 비용/);
});

test("original research evidence is linked at its pinned commit and the app admits limits", () => {
  assert.match(page, /study.source.commit/);
  assert.match(page, /paper-t10-ko\.md/);
  assert.match(page, /study.source.paths.evaluation/);
  assert.match(page, /target="_blank" rel="noopener noreferrer"/);
  assert.match(page, /실제 악성 트래픽이나 운영망을 실시간 탐지하는 서비스가 아닙니다/);
  assert.match(page, /같은 정상 60건을 재사용/);
  assert.match(page, /Rec all|Recall 1\.0000/);
});

test("the first screen is honest about future interactive stages", () => {
  assert.match(page, /사례 선택과 실제 판정 탐색 기능은 후속 단계에서 연결됩니다/);
  for (const phrase of ["실험 시나리오 선택", "같은 Trial의 판정 비교", "정확도와 비용 해석"]) {
    assert.ok(page.includes(phrase), phrase);
  }
  assert.doesNotMatch(page, /<button\b|onClick=\{|useState\(/);
});

test("BR-B initial route has keyboard affordances, mobile layout and reduced-motion rules", () => {
  assert.match(page, /href="#explorer-main"/);
  assert.match(page, /<main id="explorer-main" tabIndex=\{-1\}/);
  assert.match(page, /<Link href="\/"/);
  assert.match(page, /aria-labelledby="explorer-title"/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /@media \(max-width: 650px\)/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /grid-template-columns: 1fr/);
});
