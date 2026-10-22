# Issue #7 — 결정적 기록 갱신 / 수동 승인 / 오프라인 재현

## 단계와 개인정보 경계

1. 사용자가 로컬 `data/private/`에 **원본 리추얼**과 공식 출석/과제 요약, 날짜별 검토 태그를 보관한다.
2. `sanitize-ritual.mjs`: 원문·동료 발언을 제거하고 날짜·아침/마무리 존재 여부·검토 태그만 출력한다. 태그는 사용자가 직접 검토해서 부여하며 AI가 자동으로 추정하지 않는다.
3. `build-candidates.mjs`: 날짜 근거가 첨부된 세 역량별 *후보*와 산식이 다른 출석·과제 숫자를 `generated/private/`에 저장한다. 모든 후보는 `pending`.
4. `review-approval.mjs`: 검토 대상 파일의 정확한 SHA-256, 후보 ID 및 `userConfirmed: true`를 수동 승인 파일에 입력해야 통과한다. **승인 결과도 private이고 자동 웹 게시를 금지**한다.
5. 실제 공개하려면 사전에 GitHub diff·서류·지표 범위를 사용자가 별도 승인하고 개발자가 공개 파일을 선택적으로 작성해야 한다.

모든 도구는 표준 Node.js 22 런타임만 사용한다. 정적 웹 앱과 별도 구동하며, 소스/사이트에 개인 원문을 두지 않는다.

## 입력 계약

**원본 리추얼 JSON:** `{"days":[{"date":"YYYY-MM-DD","open":["..."],"close":null 또는 ["..."]}]}`
(문장 자체를 공개하지 않는다.)

**검토 태그 JSON:** `{"2026-01-01":["self_regulation"],"2026-01-02":["self_motivation"]}`.
허용 태그: `self_regulation`, `relationships`, `self_motivation`.
인간이 직접 확인하지 않은 날짜는 빈 태그가 된다.

**공식 요약 JSON** (실제 수치가 아니라 가상의 예):

```json
{"attendance":{"enrolledDays":5,"presentDays":3,"pendingDays":2,"absentDays":0},
 "challenges":{"coreTotal":3,"coreApproved":2,"finalA":"in_progress","finalB":"locked"}}
```

## 오프라인 사용

```bash
cd ~/ALEPH/Trace
mkdir -p data/private generated/private
# 사용자 본인 원본과 검토 태그, 요약은 로컬에만 준비
node scripts/sanitize-ritual.mjs data/private/ritual-history-2026-10-21.json data/private/reviewed-tags.json data/private/official-summary.json data/private/candidate-input.json
node scripts/build-candidates.mjs data/private/candidate-input.json generated/private/candidates.json
sha256sum generated/private/candidates.json
npm run test
```

승인 파일 예시 (위 candidates.json의 SHA-256 hex를 직접 입력, **원문/실제 승인 아님**):

```json
{"schema":"trace.approvals.v1","candidateSha256":"<실제 SHA256>",
 "userConfirmed":true,"publishToWebsite":false,"approvedIds":["candidate-self_regulation"]}
```

```bash
node scripts/review-approval.mjs generated/private/candidates.json generated/private/approvals.json generated/private/reviewed-only.json
```

**수동 승인 문서를 작성하는 것은 실제 사용자의 검토·승인 이후에만 가능합니다.** 이 도구는 승인 파일을 생성해주거나 공개 사이트에 데이터를 자동 반영하지 않습니다.

## 재현 ZIP (가상 데이터만 포함)

```bash
python3 scripts/package-generator.py
unzip -l generated/private/issue7-reproduction.zip
sha256sum generated/private/issue7-reproduction.zip
```

ZIP은 스크립트·테스트·README(본 문서)·가상 입력·가상 최종 출력·파일별 SHA-256을 담습니다.
사용자의 실제 리추얼/출석/과제 자료는 어떤 형태로도 포함하지 않습니다.
ZIP의 자체 SHA는 포장 파일의 완전성을 확인하는 것이며 파일 내용은 `SHA256SUMS.json`으로 검증합니다.
ZIP에서 압축을 풀면 `node --test tests/*.test.mjs`로 핵심 재현 테스트를 돌릴 수 있습니다.

## 완료 전 수동 확인

- [ ] 사용자가 로컬 실제 JSON에서 변환과 갱신 결과를 재현
- [ ] 실제 행위별 3개 태그의 날짜 근거를 확인하고 승인 범위 명시
- [ ] ZIP 압축 해제 환경의 `node --test` 및 SHA 검증
- [ ] 사용자 공개 승인 전 배포 파일 미변경 확인
