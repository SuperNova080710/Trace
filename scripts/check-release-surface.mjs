import { readFile, readdir } from "node:fs/promises";
import { join, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

// Static audit reads out/ only; never modifies or approves personal documents.
const disallowedPath = /(^|\/)(?:private|\.env(?:\..*)?|\.git|documents|credentials\.json)(?:\/|$)|(?:\.pdf|\.docx|\.zip|\.pem|\.key)$|ritual-history-[^/]+\.json$/i;
const sensitiveContent = [
  ["private-directory-reference", /(?:data|generated)\/private\//i],
  ["raw-ritual-reference", /ritual-history-\d{4}-\d{2}-\d{2}\.json/i],
  ["private-approval-contract", /(?:trace\.approvals\.v1|trace\.generator-input\.v1|trace\.generator-output\.v1|PRIVATE_REVIEWED_NOT_PUBLISHED|candidateSha256)/],
  ["secret-key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ["github-token", /\bgh[pousr]_[A-Za-z0-9]{20,}\b/],
  ["api-token", /\bsk_(?:live|test)_[A-Za-z0-9]{16,}\b/],
];
const textual = /\.(?:html?|m?js|css|json|txt|xml|svg|map|md)$/i;
const pathLabel = (root, file) => relative(root, file).split(sep).join("/");

export async function auditExport(root) {
  const base=resolve(root);
  const problems=[];
  const fileNames=[];
  async function visit(directory) {
    for (const entry of await readdir(directory,{withFileTypes:true})) {
      const full=join(directory,entry.name), path=pathLabel(base,full);
      if (entry.isSymbolicLink()) { problems.push("symlink: "+path); continue; }
      if (disallowedPath.test(path)) { problems.push("unapproved-file: "+path); continue; }
      if (entry.isDirectory()) { await visit(full); continue; }
      if (!entry.isFile()) { problems.push("unknown-export-entry: "+path); continue; }
      fileNames.push(path);
      if (!textual.test(path)) continue;
      const contents=await readFile(full,"utf8");
      for (const [rule, expression] of sensitiveContent) {
        if (expression.test(contents)) problems.push(rule+": "+path);
      }
    }
  }
  await visit(base);
  if (!fileNames.includes("index.html")) {
    problems.push("missing-index-html");
    return problems;
  }
  const html=await readFile(join(base,"index.html"),"utf8");
  if (!/<html\b[^>]*\blang="ko"/i.test(html)) problems.push("missing-ko-language");
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
  const seen=new Set();
  for (const id of ids) {
    if (seen.has(id)) { problems.push("duplicate-id: "+id); break; }
    seen.add(id);
  }
  for (const [,ref] of html.matchAll(/\bhref="#([^"]+)"/g)) {
    if (!seen.has(ref)) problems.push("missing-anchor: "+ref);
  }
  for (const [tag] of html.matchAll(/<a\b[^>]*>/g)) {
    if (/target="_blank"/.test(tag) && !/rel="[^"]*\bnoopener\b[^"]*\bnoreferrer\b[^"]*"/.test(tag))
      problems.push("unsafe-external-target");
    const url=tag.match(/\bhref="([^"]+)"/)?.[1];
    if (url && /^(?:javascript:|data:|http:)/i.test(url)) problems.push("unsafe-link-protocol");
  }
  if (!html.includes("Native ECH Beacon Detection")) problems.push("missing-research-evidence");
  if (!html.includes("아직 다운로드 가능한 파일이 아닙니다")) problems.push("missing-document-publication-gate");
  if (!html.includes('href="mailto:lionoh00@gmail.com"')) problems.push("missing-approved-contact");
  return [...new Set(problems)].sort();
}

async function main() {
  const issues=await auditExport(resolve("out"));
  if (issues.length) {
    console.error("FAIL: exported release-surface audit:\n"+issues.join("\n"));
    process.exitCode=1;
  } else {
    console.log("PASS: release static surface, link targets and document approval gate");
    console.log("NOTE: personal names, mobile interaction and remote HTTPS still require manual review");
  }
}
if (process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error=>{ console.error("Release audit could not complete:",error.message);process.exitCode=1; });
}
