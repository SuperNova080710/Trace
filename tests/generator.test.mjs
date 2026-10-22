import test from "node:test";
import assert from "node:assert/strict";
import { generateCandidates } from "../scripts/build-candidates.mjs";

const input={
  schema:"trace.generator-input.v1",
  rituals:{days:[
    {date:"2026-01-03",openHasText:true,closeHasText:false,focusTags:["self_motivation"]},
    {date:"2026-01-01",openHasText:true,closeHasText:true,focusTags:["self_regulation","relationships"]},
  ]},
  attendance:{enrolledDays:5,presentDays:3,pendingDays:2,absentDays:0},
  challenges:{coreTotal:3,coreApproved:2,finalA:"in_progress",finalB:"locked"},
};
test("same input bytes yield identical output and SHA-256",()=>{
 const a=generateCandidates(input),b=generateCandidates(structuredClone(input));
 assert.equal(a.bytes,b.bytes);assert.equal(a.sha256,b.sha256);
 assert.equal(a.report.publication,"NOT_APPROVED");
 assert.ok(a.report.candidates.every(c=>c.status==="pending"));
});
test("date ordering changes neither candidate output nor digest",()=>{
 const changed=structuredClone(input);changed.rituals.days.reverse();
 assert.equal(generateCandidates(input).sha256,generateCandidates(changed).sha256);
});
test("counts and evidence dates are strictly distinguished",()=>{
 const x=generateCandidates(input).report;
 assert.deepEqual(x.counts,{recordedDays:2,morningDays:2,closingDays:1,attendancePresent:3,attendanceEnrolled:5,attendancePending:2,approvedCoreTasks:2,coreTaskTotal:3});
 assert.deepEqual(x.candidates[0].evidenceDates,["2026-01-01"]);
 assert.deepEqual(x.candidates[2].evidenceDates,["2026-01-03"]);
});
test("reject invalid counts, status and sensitive arbitrary evidence tags",()=>{
 const duplicate=structuredClone(input);duplicate.rituals.days[1].date="2026-01-03";
 assert.throws(()=>generateCandidates(duplicate),/duplicate/);
 const total=structuredClone(input);total.attendance.pendingDays=4;
 assert.throws(()=>generateCandidates(total),/attendance summary/);
 const tag=structuredClone(input);tag.rituals.days[0].focusTags=["other-person-secret"];
 assert.throws(()=>generateCandidates(tag),/ability tag/);
 const b=structuredClone(input);b.challenges.finalB="approved";
 assert.throws(()=>generateCandidates(b),/Final B/);
});
test("no private passages are carried to the generated report",()=>{
 const x=structuredClone(input);x.rituals.days[0].privateNote="민감한 동료 일화";
 const { bytes }=generateCandidates(x);
 assert.ok(!bytes.includes("민감한"));assert.ok(!bytes.includes("privateNote"));
});
