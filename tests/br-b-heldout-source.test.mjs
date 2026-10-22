import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";

const dir = path.join("data", "br-b", "source");
const [contract, generated, rawTiming, rawMulti] = await Promise.all([
  readFile("src/content/br-b-research-contract.json", "utf8").then(JSON.parse),
  readFile("src/content/br-b-heldout-trials.json", "utf8").then(JSON.parse),
  readFile(path.join(dir, "timing-only-predictions.csv")),
  readFile(path.join(dir, "multi-feature-predictions.csv")),
]);
const items = generated.trials;
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
const counts = (field) => items.reduce((acc, t) => {
  const positive = t.groundTruth === "beacon";
  const predicted = t[field] === 1;
  acc[positive ? (predicted ? "TP" : "FN") : (predicted ? "FP" : "TN")]++;
  return acc;
}, { TP: 0, FP: 0, TN: 0, FN: 0 });

test("the two synthetic source CSV byte hashes match the pinned T10 research", () => {
  assert.equal(sha(rawTiming), contract.source.predictionDigests.timingPredictions);
  assert.equal(sha(rawMulti), contract.source.predictionDigests.multiPredictions);
});

test("generated public JSON declares exactly the correct frozen study", () => {
  assert.equal(generated.schemaVersion, 1);
  assert.equal(generated.study, contract.dataset);
  assert.equal(generated.sourceCommit, contract.source.commit);
  assert.match(generated.scope, /synthetic heldout 110 trials; not live detection/);
  assert.equal(items.length, 110);
  assert.equal(new Set(items.map((x) => x.trialId)).size, 110);
});

test("all 110 source rows round-trip byte-for-byte through the deterministic importer", () => {
  const result = spawnSync(process.execPath, ["scripts/build-br-b-heldout.mjs", "--check"], {
    cwd: process.cwd(), encoding: "utf8", timeout: 12000,
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /PASS: 110 synthetic Held-out trials/);
});

test("ground truth, jitter and normal scenarios are exact and never used as predictions", () => {
  const beacon = items.filter((t) => t.groundTruth === "beacon");
  const normal = items.filter((t) => t.groundTruth === "normal");
  assert.equal(beacon.length, 50);
  assert.equal(normal.length, 60);
  for (const j of contract.jitterPercent) {
    assert.equal(beacon.filter((t) => t.jitterPercent === j).length, 10);
  }
  for (const [profile, count] of Object.entries(contract.normalProfiles)) {
    assert.equal(normal.filter((t) => t.normalProfile === profile).length, count);
  }
  assert.ok(beacon.every((t) => t.normalProfile === null));
  assert.ok(normal.every((t) => t.jitterPercent === null));
  assert.ok(items.every((t) => [0, 1].includes(t.timingOnlyPrediction) && [0, 1].includes(t.multiFeaturePrediction)));
  assert.ok(items.every((t) => Number.isFinite(t.iatCv) && Number.isFinite(t.multiFeatureLogit)));
});

test("both 110-sample confusion matrices match frozen T10 Held-out evidence", () => {
  assert.deepEqual(counts("timingOnlyPrediction"), contract.detectors.timingOnly);
  assert.deepEqual(counts("multiFeaturePrediction"), contract.detectors.multiFeature);
});

test("paired normal false positives reproduce exactly the T10 observed differences", () => {
  const normal = items.filter((t) => t.groundTruth === "normal");
  const both = normal.filter((t) => t.timingOnlyPrediction === 1 && t.multiFeaturePrediction === 1);
  const timingOnly = normal.filter((t) => t.timingOnlyPrediction === 1 && t.multiFeaturePrediction === 0);
  const multiOnly = normal.filter((t) => t.timingOnlyPrediction === 0 && t.multiFeaturePrediction === 1);
  const neither = normal.filter((t) => t.timingOnlyPrediction === 0 && t.multiFeaturePrediction === 0);
  assert.deepEqual(
    [both.length, timingOnly.length, multiOnly.length, neither.length],
    [7, 3, 0, 50],
  );
  assert.ok(timingOnly.every((t) => t.normalProfile === "irregular-lognormal"));
});

test("no private identity, user histories, contact fields, raw PCAP or secret tokens appear", () => {
  const json = JSON.stringify(generated);
  assert.doesNotMatch(json, /data\/private|generated\/private|ritual-history|password|access_token|refresh_token|Bearer\s|api[_-]?key|@gmail\.com|-----BEGIN/);
  assert.deepEqual(Object.keys(items[0]), [
    "trialId", "groundTruth", "jitterPercent", "normalProfile",
    "timingOnlyPrediction", "multiFeaturePrediction", "iatCv", "multiFeatureLogit",
  ]);
});
