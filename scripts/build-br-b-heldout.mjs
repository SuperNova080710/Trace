/**
 * BR-B #31 reproducible import. No network, secrets, PII or training.
 *
 * node scripts/build-br-b-heldout.mjs --check  # CI/read-only
 * node scripts/build-br-b-heldout.mjs --write  # regenerate deterministic JSON
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const paths = {
  timing: "data/br-b/source/timing-only-predictions.csv",
  multi: "data/br-b/source/multi-feature-predictions.csv",
  target: "src/content/br-b-heldout-trials.json",
  contract: "src/content/br-b-research-contract.json",
};
const resolve = (rel) => path.join(root, rel);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const toNumber = (v, name) => {
  assert.ok(typeof v === "string" && v.trim().length > 0, "missing " + name);
  const n = Number(v);
  assert.ok(Number.isFinite(n), "invalid number: " + name);
  return n;
};
function parseCsv(bytes, scoreName, expectedHash) {
  assert.equal(sha256(bytes), expectedHash, "original T10 CSV SHA-256 mismatch");
  const raw = bytes.toString("utf8").trimEnd().split(/\r?\n/);
  assert.deepEqual(raw.shift().split(","), ["trial_id", scoreName, "prediction", "detector_version", "calibration_fingerprint_sha256"]);
  const seen = new Set();
  const rows = raw.map((line) => {
    const parts = line.split(",");
    assert.equal(parts.length, 5, "invalid CSV column count");
    const [trialId, scoreValue, predictionValue, version, fingerprint] = parts;
    assert.match(trialId, /^(?:beacon-j(?:00|10|30|50|70)-t\d+|normal-(?:interactive-burst|irregular-lognormal|mixed-activity)-t\d+)$/);
    assert.ok(!seen.has(trialId), "duplicate trial ID " + trialId);
    seen.add(trialId);
    assert.equal(version, "1.0.0");
    assert.match(fingerprint, /^[0-9a-f]{64}$/);
    const pred = toNumber(predictionValue, "prediction");
    assert.ok(pred === 0 || pred === 1, "prediction must be 0 or 1");
    return { trialId, score: toNumber(scoreValue, scoreName), pred };
  });
  assert.equal(rows.length, 110);
  return rows;
}
function confusion(trials, field) {
  const c = { TP: 0, FP: 0, TN: 0, FN: 0 };
  for (const t of trials) {
    const positive = t.groundTruth === "beacon";
    const predicted = t[field] === 1;
    c[positive ? (predicted ? "TP" : "FN") : (predicted ? "FP" : "TN")]++;
  }
  return c;
}
export async function buildHeldout() {
  const contract = JSON.parse(await readFile(resolve(paths.contract), "utf8"));
  const expected = contract.source.predictionDigests;
  assert.equal(contract.dataset, "main-v1");
  const timing = parseCsv(await readFile(resolve(paths.timing)), "iat_cv", expected.timingPredictions);
  const multi = parseCsv(await readFile(resolve(paths.multi)), "multi_feature_logit", expected.multiPredictions);
  const indexed = new Map(multi.map((item) => [item.trialId, item]));
  const trials = timing.map((a) => {
    const b = indexed.get(a.trialId);
    assert.ok(b, "missing multi-feature trial " + a.trialId);
    const bm = /^beacon-j(\d\d)-/.exec(a.trialId);
    const nm = /^normal-(interactive-burst|irregular-lognormal|mixed-activity)-/.exec(a.trialId);
    assert.ok(Boolean(bm) !== Boolean(nm), "invalid trial label: " + a.trialId);
    return {
      trialId: a.trialId,
      groundTruth: bm ? "beacon" : "normal",
      jitterPercent: bm ? Number(bm[1]) : null,
      normalProfile: nm ? nm[1] : null,
      timingOnlyPrediction: a.pred,
      multiFeaturePrediction: b.pred,
      iatCv: a.score,
      multiFeatureLogit: b.score,
    };
  });
  assert.equal(trials.length, contract.datasetCounts.heldoutDistinctIds);
  assert.deepEqual(confusion(trials, "timingOnlyPrediction"), contract.detectors.timingOnly);
  assert.deepEqual(confusion(trials, "multiFeaturePrediction"), contract.detectors.multiFeature);
  const paired = { bothFalsePositive: 0, timingOnlyFalsePositive: 0, multiOnlyFalsePositive: 0, bothTrueNegative: 0 };
  for (const t of trials.filter((row) => row.groundTruth === "normal")) {
    const a = t.timingOnlyPrediction, b = t.multiFeaturePrediction;
    if (a && b) paired.bothFalsePositive++;
    else if (a) paired.timingOnlyFalsePositive++;
    else if (b) paired.multiOnlyFalsePositive++;
    else paired.bothTrueNegative++;
  }
  assert.deepEqual(paired, contract.pairedNormal);
  return {
    schemaVersion: 1,
    study: "main-v1",
    sourceCommit: contract.source.commit,
    scope: "frozen synthetic heldout 110 trials; not live detection",
    trials,
  };
}
export async function run(mode) {
  assert.ok(mode === "--check" || mode === "--write", "Usage: node scripts/build-br-b-heldout.mjs --check|--write");
  const serialized = JSON.stringify(await buildHeldout(), null, 2) + "\n";
  if (mode === "--check") {
    const saved = await readFile(resolve(paths.target), "utf8");
    assert.equal(saved, serialized, "generated JSON differs from pinned public T10 predictions");
    process.stdout.write("PASS: 110 synthetic Held-out trials, 2 source SHA-256, paired prediction and deterministic JSON\n");
  } else {
    await writeFile(resolve(paths.target), serialized, "utf8");
    process.stdout.write("PASS: regenerated exact frozen Held-out JSON\n");
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run(process.argv[2]).catch((err) => {
    process.stderr.write(String(err?.stack ?? err) + "\n");
    process.exitCode = 1;
  });
}
