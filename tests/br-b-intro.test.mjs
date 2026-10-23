import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile("src/app/ech-beacon-explorer/page.tsx", "utf8");
const css = await readFile("src/app/ech-beacon-explorer/explorer.module.css", "utf8");
const research = JSON.parse(await readFile("src/content/br-b-research-contract.json", "utf8"));

test("standalone public route has original paper title and explicitly states who benefits", () => {
  assert.equal(research.title, "Native ECH 환경에서 지터가 적용된 HTTPS Beacon 트래픽의 경량 메타데이터 기반 탐지 비교");
  assert.match(source, /research\.title/);
  assert.match(source, /보안 학습자와 분석자/);
  assert.match(source, /합성 Held-out 실험 결과/);
  assert.match(source, /얼마나|어떻게|오탐과 처리 비용 차이/);
});

test("first screen gives exactly three clearly defined product actions", () => {
  const taskLabels = source.match(/index: "0[1-3]"/g) ?? [];
  assert.deepEqual(taskLabels, ['index: "01"', 'index: "02"', 'index: "03"']);
  assert.match(source, /시나리오를 선택합니다/);
  assert.match(source, /두 탐지기의 판정을 비교합니다/);
  assert.match(source, /탐지 효과와 비용을 함께 판단합니다/);
});

test("research summary is bound to immutable contract, not invented runtime forecasts", () => {
  assert.match(source, /research\.detectors/);
  assert.match(source, /research\.inferenceBench\.ratio/);
  assert.match(source, /research\.datasetCounts\.heldout/);
  assert.match(source, /원래 가설/);
  assert.match(source, /지지되지 않았습니다/);
  assert.match(source, /이 화면에서 새 모델을 학습하거나 실시간 트래픽을 판정하지 않습니다/);
});

test("route is isolated from existing TRACE homepage before explicit portfolio integration", async () => {
  const home = await readFile("src/app/page.tsx", "utf8");
  const lab = await readFile("src/components/trace-lab.tsx", "utf8");
  assert.match(home, /<TraceLab/);
  assert.match(lab, /ECH Beacon Explorer/);
  assert.match(lab, /href="\/ech-beacon-explorer"/);
  assert.match(source, /href="\/#projects"/);
  assert.match(source, /target="_blank" rel="noopener noreferrer"/);
});

test("styles are accessible, responsive and respect reduced motion", () => {
  assert.match(source, /<main id="main-content"/);
  assert.match(source, /aria-labelledby="explorer-title"/);
  assert.match(source, /aria-label="ECH Beacon Explorer 이동"/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media \(max-width: 600px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test("the first route does not falsely imply finished interactive sample exploration", () => {
  assert.match(source, /실험 표본 탐색 가능/);
  assert.match(source, /<InteractiveExplorer \/>/);
  assert.match(source, /import InteractiveExplorer/);
  assert.doesNotMatch(source, /localStorage|fetch\(|navigator|window\./);
});

test("BR-B hero preserves a readable two-line headline on desktop without isolating the final particle", () => {
  assert.match(source, /<span className=\{styles\.heroHeadline\}>암호화된 연결 뒤의 탐지 결과를<\/span>/);
  assert.match(source, /<span className=\{styles\.heroAccent\}>숫자로 검증하다\.<\/span>/);
  assert.doesNotMatch(source, /암호화된 연결 뒤의 탐지 결과를<br/);
  assert.match(css, /\.hero h1 \.heroHeadline \{ display: block; white-space: nowrap; \}/);
  assert.match(css, /\.hero h1 \.heroAccent \{ display: block; color: #8fc6ff; \}/);
  assert.match(css, /font-size: clamp\(30px, 3\.25vw, 44px\)/);
  assert.match(css, /@media \(max-width: 600px\)[\s\S]*?\.hero h1 \.heroHeadline \{ white-space: normal; \}/);
});
