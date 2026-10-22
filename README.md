# Trace — 오리온의 개발 기록

> 작은 과정이 모여 한 사람의 기록이 됩니다.

ALEPH BR-A 공개 진로 포트폴리오. 문제를 해결하는 과정, 확인 가능한 연구 결과, 비공개 기록에서 만들어진 **승인 대기** 지표와 지원 서류를 구분해 관리합니다.

- **공개 사이트:** https://trace-eight-topaz.vercel.app/
- **공개 연락처:** [lionoh00@gmail.com](mailto:lionoh00@gmail.com)
- **기술:** Next.js 16.3.8 · React 19.2.8 · TypeScript · 정적 HTML 내보내기(`output: "export"`)
- **대표작:** Native ECH 기반 합성 HTTPS Beacon 탐지 비교 연구 (T10); T13 앱은 예정 자리만 준비
- **진행 상태:** 서사·연구 근거·디자인·로컬 재현 장치 완료. 개인 지표 웹 게시 및 서류 웹 다운로드는 **승인 전**이며, 완료한 것으로 표시하지 않습니다.

## 처음 확인하는 분께

공개 사이트에서 다음 위치로 이동하세요.

| 항목 | 위치 | 확인 내용 |
|---|---|---|
| 나의 이야기 | `#about` | 승인된 사실 기반 자기소개, 세 가지 역량 |
| 작업 방식 | `#approach` | 문제를 관찰·분석·검증하는 방식 |
| 대표작 | `#projects` / `#project-t10` | T10 원고·평가 JSON·PCAP Release 공개 링크, T13 예정 |
| 활동 지표 | `#evidence` | 미승인 개인 수치는 비공개. **출처별 숫자가 사이트에 나타나는 것은 사용자 승인 이후** |
| 지원 문서 | `#documents` | 이력서·자기소개서·프로젝트 경험기술서의 준비 상태. 제출 파일은 비공개 채점 제출물 |
| 연락 | `#contact` | 승인된 공개 이메일 |

BR-A 재현 절차 및 제출 상태: [docs/quality/issue-8-final-reproduction.md](docs/quality/issue-8-final-reproduction.md)

## 개발 및 로컬 품질 검사

Node.js 22 이상을 사용합니다.

```bash
git clone https://github.com/SuperNova080710/Trace.git
cd Trace
npm ci
npm run check
npm run dev
```

`npm run check`는 린트, TypeScript, 단위 테스트, 공개 파일 보조검사, 정적 빌드, HTML/링크 계약, 산출물 비공개 검사까지 실행합니다. 배포 대상은 `out/`에 생성됩니다. GitHub CI의 `npm audit`는 npm 감사 서버가 503일 경우 **검사 미확정**으로 기록하며, 이를 취약점 없음으로 해석하지 않습니다.

## 비공개 갱신 장치

- `scripts/audit-evidence.mjs`: 개인 리추얼 수집 현황 요약
- `scripts/audit-official-snapshot.mjs`: 공식 출석·과제 스냅샷 개별 검증
- `scripts/prepare-private-candidates.mjs`: 서로 다른 출처의 입력을 연결해 비공개 근거 후보 생성
- `scripts/review-private-tags.mjs`: 사용자가 로컬에서 날짜별 역량을 검토해 태그 기록
- `scripts/build-candidates.mjs`: 결정적 후보·SHA-256 생성
- `scripts/package-generator.py`, `scripts/verify-reproduction.py`: 오프라인 재현 ZIP 구성 및 검증

로컬의 `data/private/` 및 `generated/private/` 안에 보관된 문장·일별 근거·공식 스냅샷은 **GitHub 또는 사이트에 올리지 않습니다.** 공개 데이터로 전달하려면 별도의 실제 내용 검토와 명시적 사용자 승인이 필요합니다. 리추얼 기록일 수는 **출석일 수 또는 연속 작성일 수**를 뜻하지 않습니다.

장치 실행과 독립 ZIP 검증: [docs/data/issue-7-generator.md](docs/data/issue-7-generator.md).

## 제출 준비

BR-A는 로그인 없는 HTTPS URL **한 개**와 이력서·자기소개서·경험기술서 및 실행 장치 ZIP을 **1~4개 파일(하나의 ZIP 허용)**로 받습니다. 파일 합계는 과제 화면에 표시된 **8MB 제한**을 준수해야 하며, 소스 URL은 받지 않습니다.

- 제출된 모든 URL은 새 시크릿 창에서 로그인·초대·CAPTCHA 없이 열려야 합니다.
- 제출 양식에는 **재현·통과 확인 4항목**과 **AI/본인 판단 3줄**을 입력합니다.
- 지원 서류의 웹 공개는 사용자 허가 전까지 금지합니다. 채점용 비공개 파일 제출과 공개 다운로드는 별개의 결정을 필요로 합니다.
- 개인정보 검출은 자동 검사만으로 완전하지 않으므로 실제 URL·문서·ZIP의 최종 수동 검토가 필요합니다.

## 작업 기록

- [#4 활동 지표](https://github.com/SuperNova080710/Trace/issues/4)
- [#6 제출 서류](https://github.com/SuperNova080710/Trace/issues/6)
- [#7 결정적 갱신 장치](https://github.com/SuperNova080710/Trace/issues/7)
- [#8 보안 및 제출 점검](https://github.com/SuperNova080710/Trace/issues/8)
