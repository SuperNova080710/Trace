import test from "node:test";
import assert from "node:assert/strict";
import { preparePrivateCandidates } from "../scripts/prepare-private-candidates.mjs";

function inputs() {
  return {
    ritual: {days: [
      {date:"2026-01-02",open:["SECRET PEER MESSAGE"],close:null},
      {date:"2026-01-01",open:["PRIVATE JOURNAL"],close:["PRIVATE THOUGHT"]},
    ]},
    attendanceSnapshot: {
      source:"Official portal sample", from:"2026-01-01", asOf:"2026-01-03",
      scope:"all-training-days", trainingDays:4, enrolledDays:4,
      presentDays:3, absentDays:0, pendingDays:1, excusedDays:null,
      platformRitualCount:1, displayedRate:75,
    },
    challengeSnapshot: {
      source:"Official challenge sample", asOf:"2026-01-03",
      totalChallenges:5, coreChallenges:3, coreApproved:2,
      masterApproved:2, finalA:"in_progress", finalB:"locked",
    },
  };
}

test("two official snapshots and raw rituals produce private pending candidates",()=>{
  const result=preparePrivateCandidates(inputs());
  assert.equal(result.report.counts.recordedDays,2);
  assert.equal(result.report.counts.morningDays,2);
  assert.equal(result.report.counts.closingDays,1);
  assert.equal(result.report.counts.attendancePresent,3);
  assert.equal(result.report.counts.attendancePending,1);
  assert.equal(result.report.counts.approvedCoreTasks,2);
  assert.equal(result.report.publication,"NOT_APPROVED");
  assert.ok(result.report.candidates.every(c=>c.status==="pending" && c.evidenceDates.length===0));
  assert.doesNotMatch(result.bytes,/SECRET|PRIVATE JOURNAL|PRIVATE THOUGHT|platformRitualCount/);
  assert.doesNotMatch(JSON.stringify(result.input),/SECRET|PRIVATE JOURNAL|PRIVATE THOUGHT/);
});

test("human-authored tags add only corresponding dates, no automatic approvals",()=>{
  const result=preparePrivateCandidates({...inputs(),
    reviewedTags:{"2026-01-01":["relationships"],"2026-01-02":["self_regulation"]}});
  assert.deepEqual(result.report.candidates[0].evidenceDates,["2026-01-02"]);
  assert.deepEqual(result.report.candidates[1].evidenceDates,["2026-01-01"]);
  assert.ok(result.report.candidates.every(c=>c.status==="pending"));
});

test("source date ordering does not change deterministic output digest",()=>{
  const a=preparePrivateCandidates(inputs());
  const changed=inputs();
  changed.ritual.days.reverse();
  const b=preparePrivateCandidates(changed);
  assert.equal(a.sha256,b.sha256);
  assert.deepEqual(a.input,b.input);
});

test("never combine mismatched official snapshot dates",()=>{
  const data=inputs();
  data.challengeSnapshot.asOf="2026-01-04";
  assert.throws(()=>preparePrivateCandidates(data),/same asOf date/);
});

test("never mix newer private rituals with an older official snapshot",()=>{
  const data=inputs();
  data.ritual.days[0].date="2026-01-04";
  assert.throws(()=>preparePrivateCandidates(data),/newer than the official snapshot/);
});

test("invalid official snapshot and invented evidence tags fail before generating files",()=>{
  const rate=inputs();
  rate.attendanceSnapshot.displayedRate=100;
  assert.throws(()=>preparePrivateCandidates(rate),/rate disagrees/);
  const tags=inputs();
  tags.reviewedTags={"2026-01-04":["self_motivation"]};
  assert.throws(()=>preparePrivateCandidates(tags),/missing from ritual source/);
});
