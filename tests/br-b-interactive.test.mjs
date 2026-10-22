import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const trials = JSON.parse(await readFile("src/content/br-b-heldout-trials.json","utf8")).trials;
const contract = JSON.parse(await readFile("src/content/br-b-research-contract.json","utf8"));
const component = await readFile("src/app/ech-beacon-explorer/interactive-explorer.tsx","utf8");
const home = await readFile("src/components/trace-lab.tsx","utf8");
function matrix(key, subset = trials) {
  return {
    TP: subset.filter(t => t.groundTruth === "beacon" && t[key] === 1).length,
    FP: subset.filter(t => t.groundTruth === "normal" && t[key] === 1).length,
    TN: subset.filter(t => t.groundTruth === "normal" && t[key] === 0).length,
    FN: subset.filter(t => t.groundTruth === "beacon" && t[key] === 0).length
  };
}
test("interactive explorer uses only pinned trial data and never uploads raw traffic",()=> {
  assert.match(component,/br-b-heldout-trials\.json/);
  assert.doesNotMatch(component,/fetch\(|localStorage|sessionStorage|API_KEY|process\.env|WebSocket/);
});
test("both detector matrices match frozen T10 contract",()=>{
  assert.deepEqual(matrix("timingOnlyPrediction"),contract.detectors.timingOnly);
  assert.deepEqual(matrix("multiFeaturePrediction"),contract.detectors.multiFeature);
});
test("all 5 beacon jitter levels are selectable and each has 10 samples",()=>{
  for(const jitter of contract.jitterPercent) assert.equal(trials.filter(t=>t.groundTruth==="beacon" && t.jitterPercent===jitter).length,10);
  assert.match(component,/const jitters = \["all", "0", "10", "30", "50", "70"\]/);
});
test("all normal profiles and paired disagreements match frozen evaluation",()=>{
  for(const [p,n] of Object.entries(contract.normalProfiles)) assert.equal(trials.filter(t=>t.normalProfile===p).length,n);
  assert.equal(trials.filter(t=>t.groundTruth==="normal"&&t.timingOnlyPrediction===1&&t.multiFeaturePrediction===0).length,contract.pairedNormal.timingOnlyFalsePositive);
  assert.equal(trials.filter(t=>t.groundTruth==="normal"&&t.timingOnlyPrediction===0&&t.multiFeaturePrediction===1).length,contract.pairedNormal.multiOnlyFalsePositive);
});
test("explorer declares filtering, empty input handling and keyboard accessible controls",()=>{
  for(const control of ["brb-group","brb-jitter","brb-profile","brb-search"]) assert.ok(component.includes(control));
  assert.match(component,/aria-pressed/);
  assert.match(component,/maxLength=\{64\}/);
  assert.match(component,/filtered\.length === 0/);
  assert.match(component,/disabled=\{safePage === 0\}/);
  assert.match(component,/Precision/);
  assert.match(component,/Recall/);
});
test("tradeoff describes frozen non-production scope and the portfolio links to app",()=>{
  assert.match(component,/순수 추론/);
  assert.match(component,/운영망 성능/);
  assert.match(home,/href="\/ech-beacon-explorer"/);
});
