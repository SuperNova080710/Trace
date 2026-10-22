import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { pathToFileURL } from "node:url";
import { generateCandidates } from "./build-candidates.mjs";

const assert = (ok, message) => { if (!ok) throw new Error(message); };
const object = (v) => v && typeof v === "object" && !Array.isArray(v);
const dateOK = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) &&
  new Date(s + "T00:00:00Z").toISOString().slice(0,10) === s;
const tags = ["self_regulation","relationships","self_motivation"];
const privatePath = (path, base) => {
  const full = resolve(path), prefix = resolve(base) + "/";
  assert(full.startsWith(prefix), "Read/write path must be under " + base);
  return full;
};

/**
 * Raw ritual wording never enters the candidate schema. Tags are independently
 * authored, date-indexed judgements; the tool does not infer competencies.
 */
export function sanitizeRaw(raw, reviewedTags, attendance, challenges) {
  assert(object(raw) && Array.isArray(raw.days), "Invalid ritual days");
  assert(object(reviewedTags), "Reviewed-tags map required");
  const days = raw.days.map((day) => {
    assert(object(day) && dateOK(day.date) && Array.isArray(day.open) &&
      (day.close === null || Array.isArray(day.close)), "Invalid ritual row");
    assert(day.open.every(v=>typeof v==="string") &&
      (day.close===null || day.close.every(v=>typeof v==="string")), "Invalid ritual entry");
    const assigned = reviewedTags[day.date] ?? [];
    assert(Array.isArray(assigned) && assigned.every(tag=>tags.includes(tag)) &&
      new Set(assigned).size === assigned.length, "Invalid manually-reviewed tags");
    return {date:day.date,openHasText:day.open.length>0,
      closeHasText:day.close!==null && day.close.length>0,focusTags:[...assigned].sort()};
  });
  const observed = new Set(days.map(d=>d.date));
  for (const day of Object.keys(reviewedTags)) {
    assert(observed.has(day), "Reviewed tag date is missing from ritual source");
  }
  const out = {schema:"trace.generator-input.v1",rituals:{days},attendance,challenges};
  generateCandidates(out); // Same validation contract before saving anything.
  return out;
}
async function main(){
  const [rawPath,tagsPath,summaryPath,outPath] = process.argv.slice(2);
  if(!outPath) throw new Error("Usage: node scripts/sanitize-ritual.mjs <private-raw> <private-tags> <private-summary> <private-sanitized-output>");
  const paths=[rawPath,tagsPath,summaryPath].map(p=>privatePath(p,"data/private"));
  const output=privatePath(outPath,"data/private");
  const [raw,reviewed,summary]=await Promise.all(paths.map(async p=>JSON.parse(await readFile(p,"utf8"))));
  assert(object(summary),"Expected reviewed summary");
  const data=sanitizeRaw(raw,reviewed,summary.attendance,summary.challenges);
  await mkdir(dirname(output),{recursive:true});
  await writeFile(output,JSON.stringify(data,null,2)+"\n",{mode:0o600});
  console.log("Sanitized summary written locally; raw text excluded.");
}
if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  main().catch(e=>{console.error("Sanitization failed:",e.message);process.exitCode=1;});
}
