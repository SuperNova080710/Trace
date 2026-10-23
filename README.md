# Trace — 오리온의 개발 기록

> 작은 과정이 모여 한 사람의 기록이 됩니다.

ALEPH **BR-A (마지막 A)** 공개 진로 포트폴리오입니다. 자기소개·실제 프로젝트 근거·출처별 활동 지표를 공개하고, 개인 원본 기록·지원 문서·후보 생성 결과는 공개 페이지와 분리합니다.

## BR-B 제출·심사 현황 — 2026-10-23

- **BR-B 과제 제출:** 사용자가 ALEPH 제출을 직접 확인했습니다. 플랫폼의 내부 제출 기록을 별도로 조회한 것은 아닙니다.
- **제출 URL:** https://trace-eight-topaz.vercel.app/ech-beacon-explorer
- **최종 문서:** PR [#50](https://github.com/SuperNova080710/Trace/pull/50) `main` 병합 완료.
- **개발/검증:** Next.js 16.4.2, 품질·보안 및 Chromium CI 성공. 익명 동료 후기와 3가지 기능 무설명 사용 확인 완료.
- **과제 상태:** 제출 작업 [#38](https://github.com/SuperNova080710/Trace/issues/38) 종료. **강사·마스터 최종 승인 미확인**으로 후속 [#51](https://github.com/SuperNova080710/Trace/issues/51) Open, 상위 [#24](https://github.com/SuperNova080710/Trace/issues/24) Open.
- **별도 품질 과제:** 수동 키보드·스크린리더 검사는 [#30](https://github.com/SuperNova080710/Trace/issues/30)에서 미완료로 관리. 제출 완료를 전체 접근성 검증 완료로 오해하지 않습니다.

이 섹션이 최신 기준입니다. 하단의 이전 '미제출' 표기는 당시 진행 기록입니다.

## 현재 진행 상태 — 2026-10-23

- **BR-A:** 마스터 승인 완료.
- **BR-B:** ECH Beacon Explorer 구현, 포트폴리오 대표작 연결, Vercel 공개 배포 및 비로그인 시크릿 창 접근 확인.
- **동료 검증:** 동료가 앱 링크만 받고 설명 없이 실험 선택·판정 비교·효과/비용 비교의 세 기능을 모두 사용한 사실을 사용자 확인. 익명 UI 한 줄 후기 확보·조치 완료([#37](https://github.com/SuperNova080710/Trace/issues/37), PR [#47](https://github.com/SuperNova080710/Trace/pull/47)).
- **보안 및 브라우저 검사:** Next.js 16.4.2 패치 PR [#49](https://github.com/SuperNova080710/Trace/pull/49) main 병합 완료. main 품질·보안 [CI 성공](https://github.com/SuperNova080710/Trace/actions/runs/39878909485) 및 [Chrome QA 성공](https://github.com/SuperNova080710/Trace/actions/runs/39878909880).
- **BR-B 최종 제출:** [제출문 정본](docs/br-b/submission-draft.md) 준비 완료. 공개 URL 단독 제출 가능. 플랫폼 실제 전송 및 강사·마스터 승인은 아직 확인되지 않음. 수동 스크린리더/키보드 점검은 별도 열린 이슈 [#30](https://github.com/SuperNova080710/Trace/issues/30).

이 아래의 이전 시점 서술은 작업 당시 이력입니다. 현재 상태는 본 섹션을 우선합니다.

## 공개 사이트와 현재 상태

- **공개 사이트:** https://trace-eight-topaz.vercel.app/
- **공개 연락처:** [lionoh00@gmail.com](mailto:lionoh00@gmail.com)
- **기술:** Next.js 16.4.2 · React 19.2.8 · TypeScript · 정적 HTML 내보내기 (`output: "export"`)
- **운영 기준:** 2026-10-22 · BR-A 마스터 승인, BR-B PR #44 main 병합 완료.
- **배포 확인:** 사용자가 2026-10-22 Vercel 운영 페이지에서 세 활동 지표가 실제 표시되는 것을 확인했습니다.
- **과제 상태:** BR-A 마스터 승인 완료. BR-B 공개 앱 구현·배포·시크릿 창 비로그인 접근 사용자 확인. 동료 무설명 사용·실제 익명 후기 확인 완료, 실제 플랫폼 제출은 미완료.

## 공개 페이지 탐색

| 확인 항목 | 페이지 위치 | 현재 제공 내용 |
| --- | --- | --- |
| 첫 화면·자기소개 | [`#about`](https://trace-eight-topaz.vercel.app/#about) | 공개명·'…한 사람' 한 줄 소개, 고난→문제 해결→성장에 관한 승인된 사실 기반 이야기 |
| 세 가지 역량 | `#about` / [`#approach`](https://trace-eight-topaz.vercel.app/#approach) | 자기조절력·대인관계력·자기동기력. **대인관계력의 개인 행동 장면은 추가 대조가 필요합니다** |
| 대표작 | [`#projects`](https://trace-eight-topaz.vercel.app/#projects) | T10 Native ECH 연구 원고·Held-out 평가·공개 근거. BR-B ECH Beacon Explorer 앱 카드 및 링크 제공 |
| 활동 근거 | [`#evidence`](https://trace-eight-topaz.vercel.app/#evidence) | 사용자 승인된 **2026-10-21 기준** 리추얼·공식 출석·핵심 승인 집계 3종과 출처·산식·한계 |
| 지원 문서 | [`#documents`](https://trace-eight-topaz.vercel.app/#documents) | 이력서·자기소개서·프로젝트 경험기술서 제작 상태. **사이트 다운로드는 미승인**이며 채점용 비공개 ZIP에 별도 포함 |
| 연락 | [`#contact`](https://trace-eight-topaz.vercel.app/#contact) | 승인된 공개 이메일 |

### 공개 승인된 활동 지표 (2026-10-21 역사적 스냅샷)

| 자료 유형 | 집계 | 중요한 해석 |
| --- | --- | --- |
| 본인 리추얼 JSON | **기록이 존재하는 날짜 47일** | 출석일 또는 47일 연속 작성이 아님. 2026-10-22 신규 기록은 포함하지 않음 |
| 공식 출석 요약 | **45일 / 재적 훈련일 47일** | **미확정 2일**, 잠정 출석률 약 95.7%; 리추얼을 출석으로 환산하지 않음 |
| 공식 과제 진행 요약 | **핵심 11개 중 마스터 승인 11개** | 마지막 A·B는 핵심 11개 승인 수에 포함하지 않음 |

이 수치는 사용자로부터 **웹 공개 승인을 받은 집계값만** 표시합니다. 원본 날짜별 리추얼, 타인 발언, 일별 출결, 역량 태그 및 전체 서류는 공개하지 않았습니다. 2026-10-22 기준 리추얼 48일과 2026-10-21 공식 스냅샷을 혼합하지 않습니다.

## BR-A 과제 충족 상황 (승인 당시 기록 · 현재 마스터 승인 완료)

| 범위 | 판단 |
| --- | --- |
| BRA-C01, C04–C06 | 사이트·코드·사용자 확인 근거상 완료 (날짜 있는 장면, 출처별 숫자, T10과 T13 예정 자리) |
| BRA-C02 | **보완 권장**: 자기조절력·자기동기력은 설명 가능. 대인관계력은 특정 날짜의 실제 협업·경청 **행동 장면**에 대한 추가 사실 대조·본문 공개 승인 필요 |
| BRA-C03 | 공개명 ‘오리온’과 ‘…한 사람’ 문구는 존재. 심사자가 요구하는 **본인 이름**으로 공개명이 인정되는지 별도 확인 필요 |
| BRA-C07–C09 | 지원 서류 3종 DOCX/PDF 및 결정적 갱신 장치 ZIP 제작·독립 재현 테스트 완료. **실제 제출 파일 첨부는 아직 미완료** |
| BRA-C10–C13 | 개인정보 자동 검사·비로그인 사이트 검증·재현 및 AI 활용 설명 초안 확보. **제출 ZIP 내용 최종 수동 확인 및 제출란 입력** 필요 |
| BRA-C20–C21 | **미완료**: 공개 HTTPS URL 1개와 최종 문서·장치 ZIP 1개를 실제 BR-A 제출 양식에 첨부·전송해야 충족 |

기술 검사 성공이 마스터 승인·과제 심사 전항목 통과를 의미하지는 않습니다. 개인정보와 사실성 검토, BR-A 제출 완료 여부는 별도입니다.

## 비공개 '계속 새로 쓰는 장치'

- `scripts/audit-evidence.mjs`: 리추얼·공식 출석·과제 요약을 서로 다른 계약으로 집계·검증
- `scripts/prepare-private-candidates.mjs`: 비공개 입력을 연계하여 날짜별 역량 근거 후보 생성
- `scripts/review-private-tags.mjs`: 사용자의 로컬 역량 태그 선택/검토
- `scripts/build-candidates.mjs`: 결정적 결과·SHA-256 생성 및 명시적 승인 게이트
- `scripts/package-generator.py`, `scripts/verify-reproduction.py`: 합성 테스트 데이터를 포함한 독립 실행·재현 ZIP 패키징 및 검사

같은 입력으로 같은 출력을 만드는 재현 시험과 임시 폴더의 독립 Node 테스트 **10/10**을 완료했습니다. 실제 원본과 새로 생성된 후보의 상태는 `pending`이며, **자동 웹 게시하지 않습니다**. 집계 3종의 공개 승인과 날짜별 역량 문장의 공개 승인은 별개입니다. 더 자세한 지침은 [Issue #7 장치 문서](docs/data/issue-7-generator.md)를 참고하세요.

### 개발 및 검사

Node.js **22 이상** 환경에서 실행합니다.

```bash
git clone https://github.com/SuperNova080710/Trace.git
cd Trace
npm ci
npm run check
npm run dev
```

`npm run check`는 ESLint, TypeScript, Node 테스트, 공개 소스 검사, 정적 빌드, HTML·링크·릴리스 표면 검사를 실행합니다. 2026-10-23 보안 패치 작업(이슈 #48)에서 Next.js 16.4.2 및 동일 버전 eslint-config-next로 업그레이드하고 정식 npm lockfile을 재생성했습니다. 패치 브랜치의 잠금 의존성 설치, 프로덕션 `npm audit --omit=dev --audit-level=high`, 린트·타입 검사·기존 자동 테스트·정적 내보내기·공개 검사 CI가 성공했습니다. CI 기록은 현재 브랜치와 커밋 단위로 확인해야 하며 병합 전 결과를 운영 버전으로 표시하지 않습니다.

## 최종 제출 준비 (BR-A 과거 기록 · 현재 마스터 승인 완료)

**결과물 URL:** https://trace-eight-topaz.vercel.app/ (로그인 없이 열리는 HTTPS 주소 하나)

**제출 대상:** 사용자 로컬 `generated/private/Trace_BR-A_Private_Submission.zip` — 이력서·자기소개서·프로젝트 경험기술서 DOCX/PDF 6개, 독립 장치 ZIP, `SHA256SUMS.json`으로 구성된 **기존 검증본**입니다. 공개 저장소에 업로드하지 않으며 제출 플랫폼에만 첨부합니다.

- [x] 공개 사이트 배포, 승인된 활동 집계 3종 실제 화면 확인, GitHub Actions 성공
- [x] 서류 3종 제작, 원본 ↔ 합본 내 문서의 바이트 동일성 및 ZIP 구성/무결성 검사 기록
- [x] 제출란에 넣을 **재현·통과 확인 4항목**, **AI와 본인 판단 3줄**의 초안 준비
- [ ] 기존 최종 ZIP의 **8MB 이하 크기 / SHA-256 / 압축 무결성** 제출 직전 재확인
- [ ] 서류·외부 링크에 타인 실명·연락처·비공개 내용이 없는지 최종 수동 점검 (일부 PDF에 '검토본/draft' 메타데이터가 남음)
- [ ] BRA-C02 대인관계력 실제 행동 근거 보강 여부와 BRA-C03 공개명 적합성 최종 판단
- [ ] 플랫폼에 **공개 URL 1개 + 최종 ZIP 1개 + 확인 4항목 + AI/내 판단 3줄** 입력하고 실제 제출
- [ ] 마스터 최종 승인 결과 확인; 승인 전에는 BR-A 완료로 표시하지 않음

제출 기준은 문서·장치 파일 **1~4개 또는 단일 ZIP**, 전체 파일 **8MB 이하**입니다. 소스 URL은 받지 않습니다. 지원 서류를 Vercel의 `public/` 폴더에 복사하지 마세요.

추가 상세: [BR-A 최종 재현·보안 점검](docs/quality/issue-8-final-reproduction.md).

## Issues

- [#4 13주 활동 지표](https://github.com/SuperNova080710/Trace/issues/4) — 기능 구현·실배포 확인 완료
- [#6 지원 서류 3종](https://github.com/SuperNova080710/Trace/issues/6) — 제작 완료, 실제 제출과 수동 검토 대기
- [#7 결정적 기록 갱신 장치](https://github.com/SuperNova080710/Trace/issues/7) — 구현·독립 재현 완료, 개인 날짜별 근거 최종 대조는 별도
- [#8 보안·BR-A 최종 제출](https://github.com/SuperNova080710/Trace/issues/8) — **마스터 승인 완료**, BR-B와 별도


## BR-B — ECH Beacon Explorer (2026-10-22 main 병합·배포 완료)

- **연구 기반 대화형 앱:** https://trace-eight-topaz.vercel.app/ech-beacon-explorer · 사용자 공개 접근·시크릿 창 비로그인 확인.
- **대표작 연계:** 홈의 기존 T13 예정 카드를 ECH Beacon Explorer로 대체.
- **세 가지 사용자 작업:** ① 합성 Held-out 트래픽의 유형·지터·프로필을 선택해 필터링 ② 같은 Trial의 Timing-only 및 Multi-feature 판정과 혼동행렬을 비교 ③ 전체 동결 평가의 오탐 감소(10→7건)와 순수 추론 배치 중앙값(0.080385→1.408802ms)을 살펴보기.
- **데이터 출처:** [ech-beacon-detection](https://github.com/SuperNova080710/ech-beacon-detection) 동결 커밋 `daae3300003527958d7cd4a0865fbc8b911d1966`. `src/content/br-b-research-contract.json` 및 `src/content/br-b-heldout-trials.json`을 사용. 예측을 재학습하거나 실제 운영망을 실시간 판정하지 않음.
- **연구의 한계:** 고지터에서 Multi-feature가 Recall 우위를 보인 것은 아니며, 두 탐지기 Recall은 모두 1.0. 실측 운영망 성능 및 특징 추출 시간을 포함한 종단 간 추론 비용을 주장하지 않음.
- **기술 검사:** PR #44에서 CI 성공. Node 테스트·정적 빌드·동결 데이터 검사·공개 데이터 검사 포함.
- **완료한 사용자 검증:** PR #44 병합, Vercel 배포, 공개 앱 및 시크릿 창 접근. **확보한 동료 의견:** 제목 줄바꿈에 관한 실제 익명 후기 1건(이슈 #37). **완료:** 동료의 3가지 조작 무설명 수행 여부 확인. **미완료:** BR-B 실제 제출, 모바일·키보드/스크린리더 수동 확인.
- **변경 PR:** [#44](https://github.com/SuperNova080710/Trace/pull/44) 병합 완료.

### BR-B 현재 과제 진행상황 (2026-10-22)

- **공개 앱:** https://trace-eight-topaz.vercel.app/ech-beacon-explorer
- **병합·배포 확인:** PR #44가 main에 병합됐고 사용자가 Vercel 앱 공개 접근 및 새 시크릿 창 비로그인을 확인했습니다.
- **제출 형태:** 공개 URL 단독 제출 가능. 독립 ZIP은 선택 사항이므로 중복 제작하지 않습니다.
- **잔여 사용자 수행:** 실제 익명 후기와 세 가지 작업을 무설명 수행했다는 사용자 확인까지 완료(#37), BR-B 제출란에 재현 확인 4항목·AI와 내 판단 3줄·URL을 입력한 뒤 실제 제출(#38).
- **품질 추적:** 코드 회귀 테스트와 실제 모바일/키보드/스크린리더 수동 테스트를 구분합니다. 자동 검사 성공을 실사용 완료로 표기하지 않습니다.

### BR-B 품질·보안 후속 (2026-10-23)

- 제목 줄바꿈 제보 → PR [#47](https://github.com/SuperNova080710/Trace/pull/47) `main` 병합 확인. 1366/1920px 데스크톱 제목은 첫째 줄 ‘암호화된 연결 뒤의 탐지 결과를’, 둘째 줄 ‘숫자로 검증하다.’ 형태로 설계했으며, 모바일에서는 줄바꿈 가능하도록 분리합니다.
- 실제 동료 후기 원문 중 핵심: “/ 기준으로 줄바꿈이 되어있어 불편합니다.” 익명으로 #37에 기록. 동료의 세 가지 작업 무설명 사용은 사용자 확인으로 추가 확정됐습니다. 단, 수정 후 재검증까지 입증된 것은 아닙니다.
- 2026-10-23 기존 `main` CI의 프로덕션 감사에서 Next.js 16.3.8의 심각한 취약점이 발견되어 [#48](https://github.com/SuperNova080710/Trace/issues/48)에서 16.4.2 패치 후 PR #49를 main에 병합했으며, 품질 CI와 Chrome QA 모두 통과했습니다. 임시 잠금 파일 생성 CI 워크플로는 사용 후 삭제했습니다.
- 정적 UI 브라우저 QA: `scripts/check-brb-browser.mjs`, `.github/workflows/brb-browser-qa.yml`; 여러 데스크톱·모바일 폭과 필터·빈 결과·판정 비교 흐름을 자동 검사합니다. 이는 동료/스크린리더 수동 평가를 대체하지 않습니다.
- **실제 BR-B 플랫폼 제출은 사용자 수행 전까지 미완료로 유지**합니다. 제출 문구는 [최종 제출용 정본](docs/br-b/submission-draft.md) 참고.
