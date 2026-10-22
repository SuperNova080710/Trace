import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve, dirname } from "node:path";
import { pathToFileURL } from "node:url";

const sha = (s)=>createHash("sha256").update(s).digest("hex");
const assert=(x,msg)=>{if(!x)throw new Error(msg);};
function privateLocation(path){
  const p=resolve(path), allowed=resolve("generated/private")+"/";
  assert(p.startsWith(allowed),"Approval paths must stay inside generated/private/");
  return p;
}
/**
 * Approval is exact-version and exact-candidate scoped.
 * This is a private handoff, NEVER an automatic public publishing step.
 */
export function gateApprovedCandidates(candidateBytes, approval){
  assert(typeof candidateBytes==="string" && approval && typeof approval==="object" &&
    !Array.isArray(approval),"Missing candidate or approval document");
  const digest=sha(candidateBytes);
  assert(approval.schema==="trace.approvals.v1","Invalid approval schema");
  assert(approval.candidateSha256===digest,"Stale approval: candidate SHA-256 mismatch");
  assert(approval.userConfirmed===true,"Explicit user confirmation required");
  assert(approval.publishToWebsite===false,"Public posting cannot be automated");
  assert(Array.isArray(approval.approvedIds) && approval.approvedIds.length>0 &&
    new Set(approval.approvedIds).size===approval.approvedIds.length,"Approval IDs must be unique and nonempty");
  const data=JSON.parse(candidateBytes);
  assert(data.schema==="trace.generator-output.v1" && data.publication==="NOT_APPROVED",
    "Candidate source must be a private pending report");
  const byId=new Map(data.candidates.map(c=>[c.id,c]));
  const selected=approval.approvedIds.map(id=>{
    const c=byId.get(id);
    assert(c && c.status==="pending","Unknown or already changed candidate ID");
    assert(c.evidenceDates.length>0,"Cannot approve candidate without evidence dates");
    return {id:c.id,label:c.label,text:c.draft,evidenceDates:c.evidenceDates,reviewed:true};
  });
  return JSON.stringify({schema:"trace.approved-private.v1",
    sourceCandidateSha256:digest,publication:"PRIVATE_REVIEWED_NOT_PUBLISHED",
    selected},null,2)+"\n";
}
async function main(){
  const [candidateFile,approvalFile,outFile]=process.argv.slice(2);
  if(!outFile)throw new Error("Usage: node scripts/review-approval.mjs <private-candidates> <private-approval> <private-reviewed-output>");
  const [candidate,approval]=await Promise.all([
    readFile(privateLocation(candidateFile),"utf8"),
    readFile(privateLocation(approvalFile),"utf8").then(JSON.parse),
  ]);
  const bytes=gateApprovedCandidates(candidate,approval);
  const out=privateLocation(outFile);
  await mkdir(dirname(out),{recursive:true});
  await writeFile(out,bytes,{mode:0o600});
  console.log("Reviewed candidates prepared privately. No public files modified.");
}
if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  main().catch(e=>{console.error("Approval rejected:",e.message);process.exitCode=1;});
}
