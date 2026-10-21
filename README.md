# TRACE

> 작은 과정이 모여 한 사람의 기록이 됩니다.

오리온의 작업 과정·검증된 근거·성장 기록을 연결하는 **독립적인 공개 포트폴리오**입니다.

- **현재 상태:** BR-A Issue #1 기반 구현 및 디자인 개선; 전체 과제 완성 또는 배포가 아닙니다.
- **공개 이름:** 오리온
- **연락:** [lionoh00@gmail.com](mailto:lionoh00@gmail.com)
- **스택:** Next.js 16.3.8 App Router, React 19.2.8, TypeScript, CSS
- **디자인:** T01의 차분한 파란색 포트폴리오 분위기를 참고한 네이비 히어로 + 밝은 본문 + 카드 레이아웃
- **가벼운 상호작용:** 작업 방식 아코디언(키보드 화살표/Home/End), 페이지 스크롤 게이지
- **배포 형식:** Next.js 정적 내보내기 (output: "export")

## 시작하기

Node.js 22 이상 및 npm이 필요합니다.

~~~bash
git clone https://github.com/SuperNova080710/Trace.git
cd Trace
git switch issue-1-architecture
npm install
npm run dev
~~~

브라우저에서 http://localhost:3000 을 열어 확인하세요.

## 품질 확인

~~~bash
npm run check
~~~

린트·타입·Node 테스트·공개 소스 보조검사·정적 빌드를 순차 실행합니다. 배포 대상은 out/에 생성됩니다.

## 디렉터리

~~~text
Trace/
├─ .github/workflows/ci.yml
├─ docs/architecture/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  └─ globals.css
│  ├─ components/trace-lab.tsx
│  └─ content/public-profile.ts
├─ scripts/check-public-surface.mjs
├─ tests/public-contract.test.mjs
└─ package.json
~~~

## 공개 데이터 원칙

- 리추얼/출석/제출 원본은 공개 저장소에 넣지 않습니다.
- 승인 전 자기소개 본문, 지표 및 제3자 정보는 실제 화면에 게시하지 않습니다.
- 공개 승인 데이터만 src/content/public-profile.ts를 통해 전달합니다.
- 특정 공개 GitHub 프로젝트 링크는 확인 가능한 공개 근거로 안내합니다.
- 패턴 스캔은 개인정보 완전 탐지를 보장하지 않으며, 사람이 최종 검토해야 합니다.

## 남은 과제

- #2 자기소개 서사와 사실 검증
- #3 UI 완성도·키보드/모바일 실사용 검증
- #4 출석·리추얼·과제 근거 지표
- #5 T10 논문 성과와 T13 앱 예정 슬롯
- #6 지원 문서 3종
- #7 결정적 기록 갱신 장치
- #8 배포·보안·과제 제출 검증

기술 선택 결정 근거: docs/architecture/stack-decision.md
