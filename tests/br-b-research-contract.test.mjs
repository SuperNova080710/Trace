import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const contract = JSON.parse(await readFile("src/content/br-b-research-contract.json", "utf8"));
const documentation = await readFile("docs/br-b/data-contract.md", "utf8");
const existingResearch = await readFile("src/content/research-evidence.ts", "utf8");

function metrics({ TP, FP, TN, FN }) {
  const precision = TP / (TP + FP);
  const recall = TP / (TP + FN);
  const fpr = FP / (FP + TN);
  return { precision, recall, fpr, f1: (2 * precision * recall) / (precision + recall) };
}
function near(actual, expected, precision = 0.0001) {
  assert.ok(Math.abs(actual - expected) <= precision, String(actual) + " differs from " + String(expected));
}

test("T10 public main-v1 research source is immutable and explicitly pinned", () => {
  assert.equal(contract.schemaVersion, 1);
  assert.equal(contract.dataset, "main-v1");
  assert.equal(contract.source.repository, "SuperNova080710/ech-beacon-detection");
  assert.equal(contract.source.commit, "daae3300003527958d7cd4a0865fbc8b911d1966");
  assert.deepEqual(contract.source.paths, {
    evaluation: "results/metrics/main-v1/heldout-evaluation.json",
    timingPredictions: "results/timing-only/main-v1/predictions.csv",
    multiPredictions: "results/multi-feature/main-v1/predictions.csv",
    processingCost: "results/metrics/main-v1/processing-cost-benchmark.json",
  });
  for (const [key, digest] of Object.entries(contract.source.predictionDigests)) {
    assert.match(digest, /^[0-9a-f]{64}$/, "source digest " + key);
  }
  assert.equal(contract.source.predictionDigests.evaluation, "b357dee703565d98b65467b94f488f9681e53f3ed41b1e3153f432279be9f46b");
});

test("held-out split and normal profiles have correct non-overlapping totals", () => {
  const c = contract.datasetCounts;
  assert.deepEqual(c, {
    total: 200, calibration: 90, heldout: 110,
    heldoutBeacon: 50, heldoutNormal: 60, heldoutDistinctIds: 110,
  });
  assert.equal(c.heldout + c.calibration, c.total);
  assert.equal(c.heldoutBeacon + c.heldoutNormal, c.heldout);
  assert.deepEqual(contract.normalProfiles, {
    "interactive-burst": 24, "irregular-lognormal": 18, "mixed-activity": 18,
  });
  assert.equal(Object.values(contract.normalProfiles).reduce((a, b) => a + b, 0), 60);
});

test("locked detectors match the published confusion matrices", () => {
  assert.deepEqual(contract.detectors.timingOnly, { TP: 50, FP: 10, TN: 50, FN: 0 });
  assert.deepEqual(contract.detectors.multiFeature, { TP: 50, FP: 7, TN: 53, FN: 0 });
  for (const counts of Object.values(contract.detectors)) {
    assert.equal(Object.values(counts).reduce((a, b) => a + b, 0), 110);
    assert.equal(counts.TP + counts.FN, 50);
    assert.equal(counts.TN + counts.FP, 60);
  }
  assert.match(existingResearch, /timingOnly: \{ tp: 50, fp: 10, tn: 50, fn: 0 \}/);
  assert.match(existingResearch, /multiFeature: \{ tp: 50, fp: 7, tn: 53, fn: 0 \}/);
});

test("metrics derived from confusion matrices match the fixed T10 evaluation", () => {
  const timing = metrics(contract.detectors.timingOnly);
  const multi = metrics(contract.detectors.multiFeature);
  near(timing.precision, 0.8333333333);
  near(multi.precision, 0.8771929825);
  near(timing.recall, 1);
  near(multi.recall, 1);
  near(timing.f1, 0.9090909091);
  near(multi.f1, 0.9345794393);
  near(timing.fpr, 0.1666666667);
  near(multi.fpr, 0.1166666667);
});

test("paired errors on the same 60 normal samples reconcile with FP totals", () => {
  const p = contract.pairedNormal;
  assert.deepEqual(p, {
    bothFalsePositive: 7,
    timingOnlyFalsePositive: 3,
    multiOnlyFalsePositive: 0,
    bothTrueNegative: 50,
  });
  assert.equal(Object.values(p).reduce((a, b) => a + b, 0), 60);
  assert.equal(p.bothFalsePositive + p.timingOnlyFalsePositive, contract.detectors.timingOnly.FP);
  assert.equal(p.bothFalsePositive + p.multiOnlyFalsePositive, contract.detectors.multiFeature.FP);
});

test("per-jitter beacon counts do not duplicate 60 normal samples as independent sets", () => {
  assert.deepEqual(contract.jitterPercent, [0, 10, 30, 50, 70]);
  assert.equal(contract.heldoutBeaconPerJitter, 10);
  assert.equal(contract.jitterPercent.length * contract.heldoutBeaconPerJitter, 50);
  assert.equal(contract.interpretation.reuseSame60NormalAcrossJitter, true);
  assert.match(documentation, /반복 사용/);
});

test("prediction batch cost is locked and excludes parsing and feature extraction", () => {
  const x = contract.inferenceBench;
  assert.equal(x.sourceScope, "pure_prediction_on_preextracted_features");
  assert.equal(x.trialsPerBatch, 110);
  assert.equal(x.timingMedianBatchMs, 0.080385);
  assert.equal(x.multiMedianBatchMs, 1.408802);
  near(x.multiMedianBatchMs / x.timingMedianBatchMs, x.ratio, 0.001);
  near(x.ratio, 17.5256);
  assert.equal(contract.interpretation.includeFeatureExtractionInLatency, false);
});

test("app must not imply live C2 detection or invalid scientific conclusions", () => {
  assert.deepEqual(contract.interpretation, {
    syntheticControlledTraffic: true,
    heldoutLabelsUsedOnlyForEvaluation: true,
    reuseSame60NormalAcrossJitter: true,
    recallAdvantageAtHighJitterSupported: false,
    productionDetectionValidated: false,
    includeFeatureExtractionInLatency: false,
  });
  assert.match(documentation, /실제 운영망/);
  assert.match(documentation, /지지되지 않았다/);
  assert.match(documentation, /통계적 유의성/);
});

test("data contract stays public, source-scoped, and free of private input paths", () => {
  const json = JSON.stringify(contract);
  assert.doesNotMatch(json, /data\/private\/|generated\/private\/|ritual-history-|@gmail\.com|Bearer\s|AKIA[0-9A-Z]{16}/);
  assert.match(documentation, /정적/);
  assert.match(documentation, /trial_id/);
});
