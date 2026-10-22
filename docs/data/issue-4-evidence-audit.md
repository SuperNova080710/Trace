# Issue #4 — 13주 활동 지표 / 근거 수집 및 산식

> 상태: **리추얼 로컬 입력 스키마 확보**, 공식 출석표의 일별 원본 확보는 **미완료**. 요약 스냅샷 검증 및 2026-10-21 기준 3개 집계 수치의 공개는 **2026-10-22 사용자 승인 완료**.
>
> **저장소와 정적 배포에는 개인별 리추얼 원문, 출석표, 제출 상세를 넣지 않는다.**

## 분리 원칙

| 출처 유형 | 의미 | 산식/분모 | 한계 |
|---|---|---|---|
| ritual | 리추얼 입력의 날짜별 레코드 수 | 고유 `days[].date` 수 | 실제 출석 또는 당일 작성의 증거가 아님 |
| ritual.open | 내용이 있는 아침 기록일 | `open.length > 0` 날짜 / 리추얼 레코드 날짜 | 소급 작성 가능, 실제 출석의 증거가 아님 |
| ritual.close | 내용이 있는 마무리 기록일 | `close`의 내용이 있는 날짜 / 리추얼 레코드 날짜 | `null`과 빈 배열을 구분 |
| attendance.present | 공식 출결에서 출석으로 기재된 날 | `present` 날짜 / 출결 원본에 실린 날짜 수 | 지각·공결을 임의로 합산하지 않음 |
| approvals.approved | 공식 승인 상태의 고유 과제 | `approved` 고유 과제 / 원본 고유 과제 수 | 제출은 승인과 다름 |

## 프로그램 기간 구분

2026-10-21 시점 이용 가능한 리추얼 원본 날짜 구간은 2026-08-11 ~ 2026-10-21입니다.
이 범위는 **전체 교육 과정의 공식 13주 출결 범위와 동일하다고 검증된 값이 아닙니다.**
'47일 출석', '47일 연속 작성', '13주 매일 작성'으로 서술하지 않습니다.

로컬 리추얼 출처의 SHA-256을 함께 확인한 뒤 결과를 대조합니다. 2026-10-22 사용자 승인에 따라 과거 기준 3개 집계 항목만 공개 필드에 반영합니다. 그 외 원본과 구체적 일별 기록은 공개하지 않습니다.

## 명령어 (로컬 전용)

원본은 `data/private/ritual-history-2026-10-21.json`에만 저장합니다(이 폴더는 Git 무시 대상).

```bash
mkdir -p data/private
# 원본을 위 경로에 직접 복사합니다. 원본 파일은 GitHub에 업로드하지 마세요.
node scripts/audit-evidence.mjs ritual data/private/ritual-history-2026-10-21.json
npm run test
```

명령의 출력은 이름·동료 발언·개인 문장을 포함하지 않는 *집계 후보* JSON입니다. 출력의 `status`는 항상 `pending`입니다.
GitHub Issue/PR, README, 공개 페이지에 원본 또는 출력값을 그대로 붙여넣지 않습니다.

### 공식 출석 자료 예시 스키마 (가상의 입력 예시)

```json
{
  "source": "공식 출석 내역 확인처(직접 입력)",
  "days": [
    {"date": "2026-01-02", "status": "present"},
    {"date": "2026-01-03", "status": "late"}
  ]
}
```

`status` 허용값: `present`, `late`, `absent`, `excused`.
실제 원본과 다른 임시 예시이며, 공식 증빙이 없으면 활용하지 않습니다.

### 공식 과제 승인 내역 예시 스키마 (가상의 입력 예시)

```json
{
  "source": "공식 과제 승인 내역 확인처(직접 입력)",
  "from": "2026-01-02",
  "to": "2026-01-31",
  "tasks": [
    {"taskCode": "T01", "status": "submitted"},
    {"taskCode": "T02", "status": "approved"}
  ]
}
```

`status` 허용값: `approved`, `submitted`, `in_progress`, `rejected`.
같은 과제를 중복 집계하지 않습니다. 공식 이슈/코드와 실제 Task 코드는 구분해야 합니다.

## 게시 승인

1. 원본 출처 및 SHA-256, 추출 날짜/범위, 완결 여부 확인
2. 작성 기록·출석·승인 각각의 정의·분모·기간·누락값 확인
3. 사용자에게 개인 정보 및 **수치 공개** 범위를 별도로 승인받음
4. 필요한 숫자와 최소 출처/산식만 `src/content/public-profile.ts` 등에 `status: "approved"`로 반영
5. 정적 HTML 검사·모바일 가독성·공개 근거 재확인

## 후속 자료

- [ ] **실제 출석 원본:** 공식 출결 기록 또는 동일한 신뢰도를 갖는 자료
- [ ] **과제 승인 원본:** 과제 코드, 승인 상태를 확인 가능한 내역
- [x] **지표 공개 승인:** 2026-10-21 기준 리추얼 기록일·공식 출석일·핵심 과제 승인 수치만, 각 출처/분모/산식/주의사항과 함께 공개 승인 (2026-10-22)

수치가 모두 확보되지 않더라도 미확인 값은 **0**이 아니라 **미확인**으로 남깁니다.

## 공식 요약 스냅샷 처리

공식 출석 요약과 챌린지 진행 현황은 일별 기록과 별도의 입력 유형으로 처리합니다. `attendance-snapshot`은 강사 미확정일을 분모에 포함하며, 공가 값이 확인되지 않으면 `null`로 유지합니다. `challenge-snapshot`은 핵심 승인 수 및 마지막 A/B의 진행·잠금 상태를 독립적으로 검증합니다. 공식 화면 전사 수치는 코드·테스트·문서에 고정하지 않습니다.

```bash
node scripts/audit-evidence.mjs attendance-snapshot data/private/attendance-snapshot.json
node scripts/audit-evidence.mjs challenge-snapshot data/private/challenge-snapshot.json
```

모든 출력은 `pending` 상태이며 사용자 공개 승인 전에는 사이트에 반영하지 않습니다.


## 공개 지표 컴포넌트 사전 준비 (별도 PR)

Issue #4의 UI는 공개 가능 상태가 **명시적으로 승인된** `EvidenceMetric`만 렌더링한다. 타입 계약은 다음 항목을 구분한다.

- `sourceKind`: `ritual` / `official-attendance-snapshot` / `official-challenge-snapshot`
- `from`, `to`, `asOf`: 집계 기간과 화면 스냅샷 확인일의 차이
- `definition`, `calculation`, `denominator`: 무엇을 어떻게 집계했는지, 분모가 없으면 `null`
- `provisional`: 미확정 출석/추후 승인 변동이 가능한 자료의 잠정 상태
- `limitations`: 원본이 증명하지 못하는 사실과 해석상 주의점
- `status`: `approved`만 렌더링

`src/content/public-profile.ts`의 `evidenceMetrics`에는 사용자 승인을 받은 **3개 과거 집계 항목만** 수동 등록했다. 개인 원본/날짜별 JSON을 import하지 않는다. 실제 배포 페이지에 반영됐는지는 PR 병합과 배포 후 확인해야 한다.

사용자 명시적 공개 승인 전에는 `status: "approved"` 데이터를 작성할 수 없으며, 개인 원본/타인 이름/일별 출결/리추얼 원문을 공개 저장소에 추가하지 않는다.

검토 완료 이후에도 출석 스냅샷의 강사 미확정일이 남아 있다면 `provisional: true`로 표시하고, 비공개 날짜별 강점 태그를 출석 증빙으로 재해석하지 않는다.

검사:
```bash
npm run check
```

이 PR의 완료 기준은 **검증된 과거 집계 3개를 승인된 범위로 표현하고 정적 산출물 검사 통과**하는 것이다. 실제 운영 배포와 출석 확정일 반영은 별도로 확인한다.
