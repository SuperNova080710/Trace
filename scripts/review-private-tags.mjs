import { readFile, writeFile, mkdir, rename, unlink } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { pathToFileURL } from "node:url";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

export const REVIEW_DATES = [
  "2026-09-09", "2026-09-16", "2026-09-17", "2026-09-30", "2026-10-07",
];
const TAG_NAMES = ["self_regulation", "relationships", "self_motivation"];

/** Only an explicit choice adds tags; blank leaves tags unchanged, 0 clears. */
export function interpretAnswer(answer) {
  const value = answer.trim();
  if (value === "") return null;
  if (value === "0") return [];
  if (!/^[123](?:[,\s]+[123])*$/.test(value)) {
    throw new Error("1, 2, 3 중 하나 이상 또는 0, Enter만 입력하세요");
  }
  const indices = value.split(/[,\s]+/).map(Number);
  if (new Set(indices).size !== indices.length) {
    throw new Error("중복된 역량 번호입니다");
  }
  return indices.map((n) => TAG_NAMES[n - 1]).sort();
}

export function addManualReview(current, date, selection) {
  if (!current || typeof current !== "object" || Array.isArray(current)) {
    throw new Error("검토 태그는 날짜별 JSON 객체여야 합니다");
  }
  if (!REVIEW_DATES.includes(date)) throw new Error("검토 대상 날짜가 아닙니다");
  if (selection === null) return { ...current };
  if (!Array.isArray(selection) || new Set(selection).size !== selection.length ||
      selection.some((tag) => !TAG_NAMES.includes(tag))) {
    throw new Error("선택값이 유효하지 않습니다");
  }
  return { ...current, [date]: [...selection].sort() };
}

function validateExisting(rows, current) {
  if (!current || typeof current !== "object" || Array.isArray(current)) {
    throw new Error("기존 검토 파일 형식이 잘못되었습니다");
  }
  for (const [date, tags] of Object.entries(current)) {
    if (!rows.has(date)) throw new Error("기존 파일에 원본에 없는 날짜가 있습니다");
    if (!Array.isArray(tags) || tags.some((tag) => !TAG_NAMES.includes(tag)) ||
        new Set(tags).size !== tags.length) {
      throw new Error("기존 파일에 잘못된 태그가 있습니다");
    }
  }
}

function localText(lines) {
  if (lines === null) return "(null: 마무리 기록 없음)";
  if (!Array.isArray(lines) || lines.some((v) => typeof v !== "string")) {
    throw new Error("리추얼 문장 배열의 형식이 올바르지 않습니다");
  }
  return lines.length ? lines.map((line, n) => "  " + (n+1) + ". " + line).join("\n") : "(빈 배열)";
}

async function main() {
  if (!stdin.isTTY || !stdout.isTTY) {
    throw new Error("사용자가 직접 읽고 선택하는 로컬 터미널에서만 실행할 수 있습니다");
  }
  const rawFile = resolve("data/private/ritual-history-2026-10-21.json");
  const tagsFile = resolve("data/private/reviewed-tags.json");
  const raw = JSON.parse(await readFile(rawFile, "utf8"));
  if (!Array.isArray(raw.days)) throw new Error("리추얼 원본의 days 배열이 없습니다");
  const rows = new Map();
  for (const row of raw.days) {
    if (typeof row.date !== "string" || rows.has(row.date)) {
      throw new Error("원본에 유효하지 않거나 중복된 날짜가 있습니다");
    }
    rows.set(row.date, row);
  }
  let current={};
  try { current=JSON.parse(await readFile(tagsFile,"utf8")); }
  catch(error){ if(error.code!=="ENOENT") throw error; }
  validateExisting(rows,current);
  const ui=createInterface({input:stdin,output:stdout});
  let edited=0;
  try {
    console.log("개인 기록은 로컬 터미널에서만 표시됩니다. 원문을 채팅·GitHub에 붙여넣지 마세요.");
    console.log("1 자기조절력 / 2 대인관계력 / 3 자기동기력 / 0 근거 없음 / Enter 건너뛰기");
    for (const date of REVIEW_DATES) {
      const row=rows.get(date);
      if (!row) { console.log(date+": 원본 기록 없음, 건너뜀"); continue; }
      console.log("\n------ "+date+" ------");
      console.log("[아침]\n"+localText(row.open));
      console.log("[마무리]\n"+localText(row.close));
      console.log("기존 선정: "+(current[date]?.join(", ") || "없음"));
      while(true){
        const answer=await ui.question("원문을 확인한 뒤 역량 번호를 선택하세요: ");
        let selected;
        try { selected=interpretAnswer(answer); }
        catch(err){console.log("입력 오류: "+err.message);continue;}
        if(selected===null) { console.log("건너뜀: 변경 없음"); break; }
        current=addManualReview(current,date,selected);
        edited++;
        console.log("비공개 태그로 기록됨 (공개 승인 아님)");
        break;
      }
    }
  } finally {ui.close();}
  if(!edited){
    console.log("NOTE: 선택 변경 없음. 검토 파일을 만들거나 수정하지 않았습니다.");
    return;
  }
  await mkdir(dirname(tagsFile),{recursive:true});
  const tmp=tagsFile+".tmp."+process.pid;
  try{
    await writeFile(tmp,JSON.stringify(Object.fromEntries(Object.entries(current).sort()),null,2)+"\n",
      {mode:0o600,flag:"wx"});
    await rename(tmp,tagsFile);
  } catch(err){await unlink(tmp).catch(()=>{}); throw err;}
  console.log("PASS: 사용자 수동 검토 태그를 data/private/reviewed-tags.json에 저장");
  console.log("NOTE: 공개 승인 및 사이트 콘텐츠 변경 없음");
}
if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  main().catch(err=>{console.error("검토 도구 실패: "+err.message);process.exitCode=1;});
}
