import test from "node:test";
import assert from "node:assert/strict";
import { REVIEW_DATES, interpretAnswer, addManualReview } from "../scripts/review-private-tags.mjs";

test("no competence tags are assigned by default",()=>{
  assert.equal(interpretAnswer("   "),null);
  assert.deepEqual(interpretAnswer("0"),[]);
  assert.equal(REVIEW_DATES.length,5);
});

test("only explicit human choices become recognized tags",()=>{
  assert.deepEqual(interpretAnswer("1"),["self_regulation"]);
  assert.deepEqual(interpretAnswer("2 3"),["relationships","self_motivation"]);
  assert.deepEqual(interpretAnswer("3,1"),["self_motivation","self_regulation"]);
});

test("reject duplicate and malformed answers",()=>{
  assert.throws(()=>interpretAnswer("1,1"),/중복/);
  assert.throws(()=>interpretAnswer("4"),/입력/);
  assert.throws(()=>interpretAnswer("1,0"),/입력/);
  assert.throws(()=>interpretAnswer("text"),/입력/);
});

test("skip does not overwrite earlier reviews, clear is explicit",()=>{
 const current={"2026-09-09":["self_regulation"]};
 assert.deepEqual(addManualReview(current,"2026-09-09",null),current);
 assert.deepEqual(addManualReview(current,"2026-09-09",[]),{"2026-09-09":[]});
 assert.deepEqual(current,{"2026-09-09":["self_regulation"]});
});

test("review cannot invent dates or unsupported tags",()=>{
 assert.throws(()=>addManualReview({},"2026-10-21",["self_regulation"]),/검토 대상/);
 assert.throws(()=>addManualReview({},"2026-09-09",["personal_secret"]),/유효/);
 assert.throws(()=>addManualReview({},"2026-09-09",["relationships","relationships"]),/유효/);
});
