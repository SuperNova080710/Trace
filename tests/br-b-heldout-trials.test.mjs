import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const data = JSON.parse(await readFile("src/content/br-b-heldout-trials.json", "utf8"));
const contract = JSON.parse(await readFile("src/content/br-b-research-contract.json", "utf8"));
const rows = data.trials;
const beacon = rows.filter((row) => row.kind === "beacon");
const normal = rows.filter((row) => row.kind === "normal");
const positive = (detector, subset) => subset.filter((row) => row[detector].prediction === 1);
const confusion = (detector) => ({
  TP: positive(detector, beacon).length,
  FN: beacon.length - positive(detector, beacon).length,
  FP: positive(detector, normal).length,
  TN: normal.length - positive(detector, normal).length,
});

test("110 distinct pinned synthetic held-out trials are represented, without calibration samples", () => {
  assert.equal(data.schemaVersion, 1);
  assert.equal(data.dataset, "main-v1-heldout");
  assert.equal(rows.length, 110);
  assert.equal(new Set(rows.map((row) => row.id)).size, 110);
  assert.equal(beacon.length, 50);
  assert.equal(normal.length, 60);
  assert.equal(rows.length, contract.datasetCounts.heldoutDistinctIds);
  assert.ok(!rows.some((row) => /-t(?:0[1-9]|10)$/.test(row.id)));
});

test("original research commit and both verified SHA-256 digests stay pinned", () => {
  assert.equal(data.provenance.repository, contract.source.repository);
  assert.equal(data.provenance.commit, contract.source.commit);
  assert.equal(data.provenance.sourceFiles.timing.path, contract.source.paths.timingPredictions);
  assert.equal(data.provenance.sourceFiles.multi.path, contract.source.paths.multiPredictions);
  assert.equal(data.provenance.sourceFiles.timing.sha256, "afb3ab1fd99461e2cd56f54a8acde3e899d7bbdd3fefd9096b7c330b7079642a");
  assert.equal(data.provenance.sourceFiles.multi.sha256, "ffa99bcb98eb0b15e0ce9fff3dfa60c58404e39e255c44d28c5705aea67e7ec0");
});

test("trial IDs and scenario labels are strictly validated", () => {
  for (const row of rows) {
    if (row.kind === "beacon") {
      const match = /^beacon-j(00|10|30|50|70)-t\d+$/.exec(row.id);
      assert.ok(match, row.id);
      assert.equal(row.jitterPercent, Number(match[1]));
      assert.equal(row.profile, null);
    } else {
      const match = /^normal-(interactive-burst|irregular-lognormal|mixed-activity)-t\d+$/.exec(row.id);
      assert.ok(match, row.id);
      assert.equal(row.profile, match[1]);
      assert.equal(row.jitterPercent, null);
    }
  }
});

test("all scores are finite and detector verdicts are independent binary labels", () => {
  for (const row of rows) {
    for (const name of ["timing", "multi"]) {
      assert.ok(Number.isFinite(row[name].score), row.id + " score " + name);
      assert.ok([0, 1].includes(row[name].prediction), row.id + " prediction " + name);
    }
  }
  assert.match(data.note, /not probabilities/);
  assert.match(data.note, /evaluation only/);
});

test("all held-out detector confusion matrices exactly match published frozen results", () => {
  assert.deepEqual(confusion("timing"), contract.detectors.timingOnly);
  assert.deepEqual(confusion("multi"), contract.detectors.multiFeature);
  assert.deepEqual(confusion("timing"), { TP: 50, FN: 0, FP: 10, TN: 50 });
  assert.deepEqual(confusion("multi"), { TP: 50, FN: 0, FP: 7, TN: 53 });
});

test("normal profile row counts and paired false positives exactly match paper", () => {
  for (const [profile, expected] of Object.entries(contract.normalProfiles)) {
    assert.equal(normal.filter((row) => row.profile === profile).length, expected);
  }
  const paired = {
    bothFalsePositive: normal.filter((r) => r.timing.prediction === 1 && r.multi.prediction === 1).length,
    timingOnlyFalsePositive: normal.filter((r) => r.timing.prediction === 1 && r.multi.prediction === 0).length,
    multiOnlyFalsePositive: normal.filter((r) => r.timing.prediction === 0 && r.multi.prediction === 1).length,
    bothTrueNegative: normal.filter((r) => r.timing.prediction === 0 && r.multi.prediction === 0).length,
  };
  assert.deepEqual(paired, contract.pairedNormal);
  assert.ok(normal.filter((r) => r.timing.prediction !== r.multi.prediction).every((r) => r.profile === "irregular-lognormal"));
});

test("five jitter levels have exactly ten held-out beacon trials each", () => {
  for (const jitter of contract.jitterPercent) {
    const matches = beacon.filter((r) => r.jitterPercent === jitter);
    assert.equal(matches.length, 10);
    assert.equal(positive("timing", matches).length, 10);
    assert.equal(positive("multi", matches).length, 10);
  }
});

test("the actual three paired disagreement IDs are frozen, not invented examples", () => {
  const disagreements = normal.filter((r) => r.timing.prediction === 1 && r.multi.prediction === 0).map((r) => r.id).sort();
  assert.deepEqual(disagreements, [
    "normal-irregular-lognormal-t14",
    "normal-irregular-lognormal-t21",
    "normal-irregular-lognormal-t26",
  ]);
});

test("static trial data uses only whitelisted non-PII fields and has no credentials", () => {
  assert.deepEqual(Object.keys(data).sort(), ["dataset", "note", "provenance", "schemaVersion", "trials"]);
  for (const row of rows) {
    assert.deepEqual(Object.keys(row).sort(), ["id", "jitterPercent", "kind", "multi", "profile", "timing"]);
    for (const detector of ["timing", "multi"]) {
      assert.deepEqual(Object.keys(row[detector]).sort(), ["prediction", "score"]);
    }
  }
  const payload = JSON.stringify(data);
  assert.doesNotMatch(payload, /generated\/private|data\/private|ritual-history|@gmail\.com|Authorization|Bearer\s|sk-[A-Za-z0-9]{12}|AKIA[0-9A-Z]{16}/);
});
