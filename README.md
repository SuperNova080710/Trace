# TRACE

> Every step leaves a trace.

오리온의 작업 과정·검증된 근거·성장 기록을 연결하기 위한 **독립적인 공개 포트폴리오**입니다.

- **현재 상태:** BR-A Issue #1 기반 구현; 전체 과제 완성 또는 배포가 아닙니다.
- **공개 이름:** 오리온
- **연락:** [lionoh00@gmail.com](mailto:lionoh00@gmail.com)
- **스택:** Next.js 16.3.8 App Router, React 19.2.8, TypeScript, CSS
- **프로젝트 디자인:** 인터랙티브 실험형 — 세 가지 관점의 키보드 탐색 콘솔
- **배포 형식:** Next.js `output: "export"` (정적 HTML, CSS, JavaScript)

## 시작하기

Node.js 22 이상 및 npm이 필요합니다.

```bash
git clone https://github.com/SuperNova080710/Trace.git
cd Trace
git checkout issue-1-architecture
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 여세요.

## 품질 확인

```bash
npm run lint
npm run typecheck
npm run test
npm run check:public
npm run build
```

`npm run check`는 위 명령을 순서대로 실행합니다. 정적 출력물은 `out/`에 생성됩니다.

> GitHub 연결을 통해 초기 파일을 생성했으며, 실제 의존성 설치·빌드·브라우저 실행 검증 결과는 CI가 실행되고 나서 확정해야 합니다. 테스트 코드를 추가한 사실 자체가 통과를 의미하지 않습니다.

## 구조

```text
Trace/
├─ .github/workflows/ci.yml           # PR 정적 품질 게이트
├─ docs/architecture/                 # ADR · 요구사항 · 공개 데이터 계약
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx                    # 메타데이터·접근성 문서 루트
│  │  ├─ page.tsx                      # 승인된 데이터만 주입
│  │  └─ globals.css                   # 반응형 다크 테마
│  ├─ components/
│  │  └─ trace-lab.tsx                 # 인터랙티브 탐색/키보드 탭
│  └─ content/
│     └─ public-profile.ts             # 승인된 공개 사실 및 스키마
├─ scripts/check-public-surface.mjs    # 공개 경로·시크릿 패턴 검사
├─ tests/public-contract.test.mjs      # Node 표준 테스트
├─ next.config.ts                      # 정적 내보내기
└─ package.json
```

## 비공개와 승인

- `ritual-history-2026-10-21.json` 등 원본 리추얼 JSON은 **공개 저장소에 업로드 금지**.
- 승인 전 서사, 출석 수치, 타인 이름 등은 공개 화면에 출력하지 않습니다.
- `data/private/`와 `.trace-private/`는 Git에서 무시됩니다.
- 공개 텍스트는 `src/content/public-profile.ts`의 승인 계약을 따릅니다.
- 정적 사이트이므로 브라우저에 포함된 데이터는 **모두 공개된 데이터**입니다.
- `check:public`은 알려진 패턴을 검사하는 보조장치이고 개인정보 완전 탐지는 아닙니다.

## 후속 이슈

- [#2 서사](https://github.com/SuperNova080710/Trace/issues/2)
- [#3 인터페이스](https://github.com/SuperNova080710/Trace/issues/3)
- [#4 근거 지표](https://github.com/SuperNova080710/Trace/issues/4)
- [#5 T10 논문 및 T13 앱 예정](https://github.com/SuperNova080710/Trace/issues/5)
- [#6 문서 3종](https://github.com/SuperNova080710/Trace/issues/6)
- [#7 갱신 장치](https://github.com/SuperNova080710/Trace/issues/7)
- [#8 최종 검증](https://github.com/SuperNova080710/Trace/issues/8)

기술 선택 ADR: [docs/architecture/stack-decision.md](docs/architecture/stack-decision.md).
