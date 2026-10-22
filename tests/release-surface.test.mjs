import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { auditExport } from "../scripts/check-release-surface.mjs";

const base = '<html lang="ko"><a href="#about">About</a><section id="about">Native ECH Beacon Detection 아직 다운로드 가능한 파일이 아닙니다 <a href="mailto:lionoh00@gmail.com">contact</a></section></html>';
async function fixture(extra) {
  const dir=await mkdtemp(join(tmpdir(),"trace-release-test-"));
  await writeFile(join(dir,"index.html"),base);
  if (extra) { await mkdir(join(dir,"documents")); await writeFile(join(dir,"documents","resume.pdf"),"not public"); }
  return dir;
}
test("minimal safe public output passes release surface check",async()=>{
 const dir=await fixture(false);
 try {assert.deepEqual(await auditExport(dir),[]);}finally{await rm(dir,{recursive:true,force:true});}
});
test("private documents are rejected even without secret text",async()=>{
 const dir=await fixture(true);
 try {assert.ok((await auditExport(dir)).some(x=>x.startsWith("unapproved-file:")));}finally{await rm(dir,{recursive:true,force:true});}
});
test("raw personal record markers are rejected without leaking text",async()=>{
 const dir=await fixture(false);
 try {
  await writeFile(join(dir,"extra.js"),'const x="data/private/";');
  assert.ok((await auditExport(dir)).some(x=>x.startsWith("private-directory-reference:")));
 }finally{await rm(dir,{recursive:true,force:true});}
});
