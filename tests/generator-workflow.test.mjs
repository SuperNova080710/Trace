import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { sanitizeRaw } from "../scripts/sanitize-ritual.mjs";
import { generateCandidates } from "../scripts/build-candidates.mjs";
import { gateApprovedCandidates } from "../scripts/review-approval.mjs";

const digest=s=>createHash("sha256").update(s).digest("hex");
const fixture=JSON.parse(await readFile(new URL("../scripts/fixtures/issue7-example.json",import.meta.url),"utf8"));
test("raw ritual conversion strips text and produces deterministic sanitized contract",()=>{
  const raw={days:[
    {date:"2026-01-02",open:["PRIVATE JOURNAL"],close:null},
    {date:"2026-01-01",open:["PRIVATE PEER NAME"],close:["SECRET"]},
  ]};
  const tags={"2026-01-01":["self_regulation"]};
  const v=sanitizeRaw(raw,tags,fixture.attendance,fixture.challenges);
  const encoded=JSON.stringify(v);
  assert.doesNotMatch(encoded,/PRIVATE|SECRET/);
  assert.deepEqual(v.rituals.days[0].focusTags,[]);
  assert.deepEqual(v.rituals.days[1].focusTags,["self_regulation"]);
  assert.equal(generateCandidates(v).report.counts.closingDays,1);
});
test("tag map cannot silently attach unobserved dates",()=>{
 const raw={days:[{date:"2026-01-01",open:[],close:null}]};
 assert.throws(()=>sanitizeRaw(raw,{"2026-01-05":["relationships"]},fixture.attendance,fixture.challenges),/missing/);
});
test("only exact candidate SHA and explicit manual confirmation pass approval gate",()=>{
 const {bytes}=generateCandidates(fixture);
 const approval={schema:"trace.approvals.v1",candidateSha256:digest(bytes),
   userConfirmed:true,publishToWebsite:false,approvedIds:["candidate-self_regulation"]};
 const output=gateApprovedCandidates(bytes,approval);
 assert.match(output,/PRIVATE_REVIEWED_NOT_PUBLISHED/);
 assert.match(output,/2026-01-01/);
 assert.doesNotMatch(output,/attendancePresent|PRIVATE JOURNAL/);
 assert.throws(()=>gateApprovedCandidates(bytes,{...approval,candidateSha256:"abc"}),/Stale/);
 assert.throws(()=>gateApprovedCandidates(bytes,{...approval,userConfirmed:false}),/confirmation/);
 assert.throws(()=>gateApprovedCandidates(bytes,{...approval,publishToWebsite:true}),/cannot be automated/);
 assert.throws(()=>gateApprovedCandidates(bytes,{...approval,approvedIds:["unknown"]}),/Unknown/);
});
test("updating recorded dates or attendance counts changes output digest",()=>{
 const a=generateCandidates(fixture).sha256;
 const b=structuredClone(fixture);b.attendance.presentDays=2;
 assert.notEqual(a,generateCandidates(b).sha256);
 const c=structuredClone(fixture);c.rituals.days[0].focusTags.push("relationships");
 assert.notEqual(a,generateCandidates(c).sha256);
});
test("no approval can pass when all evidence dates are missing",()=>{
 const x=structuredClone(fixture);x.rituals.days.forEach(d=>d.focusTags=[]);
 const {bytes}=generateCandidates(x);
 const a={schema:"trace.approvals.v1",candidateSha256:digest(bytes),userConfirmed:true,
   publishToWebsite:false,approvedIds:["candidate-relationships"]};
 assert.throws(()=>gateApprovedCandidates(bytes,a),/without evidence dates/);
});
