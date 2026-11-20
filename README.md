# Trace — 오리온의 개발 포트폴리오

안녕하세요. **백엔드·풀스택 개발을 지향하는 오리온**입니다. 화면의 요청이 API와 데이터베이스를 거쳐 어떤 결과로 이어지는지 이해하는 데 관심이 있습니다. 문제가 생기면 먼저 어디까지 정상인지 확인하고, 로그와 실행 결과를 대조해 원인을 좁혀갑니다.

[포트폴리오 보기](https://trace-eight-topaz.vercel.app/) · [이력서](https://trace-eight-topaz.vercel.app/documents/resume/) · [GitHub](https://github.com/SuperNova080710) · [기술 블로그](https://odyz.tistory.com/)

## 대표 프로젝트

### 디지털 트윈 스마트 캠퍼스

2024년 캡스톤에서 ESP32 센서 상태를 Unreal Engine의 가상 캠퍼스에 반영하고, 가상 공간의 명령을 실제 장치로 전달하는 **양방향 연동**을 담당했습니다. MQTT 메시지가 늦거나 누락되면 장치·네트워크·서버·Unreal Engine으로 구간을 나눠 전달 여부를 확인했습니다.

통합 시스템을 시연했고, 후속 연구로 2025년 한국디지털콘텐츠학회 대학생 논문경진대회에서 **동상**을 받았습니다. 같은 해 KCI 등재 학술지에 **제1저자**로 논문을 게재했습니다.

[포트폴리오 프로젝트](https://trace-eight-topaz.vercel.app/#projects) · [KCI 논문 정보](https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003279319)

### Full-stack Blog

NestJS와 PostgreSQL로 **JWT 로그인·토큰 갱신, 게시글 CRUD와 소유권 확인**을 구현했습니다. Next.js 화면을 API에 연결하고, 토큰이 갱신되면 기존 요청을 다시 보내도록 구성했습니다. Docker 환경에서 마이그레이션과 인증 흐름을 점검했습니다.

[백엔드 코드](https://github.com/SuperNova080710/Blog-backend) · [프론트엔드 코드](https://github.com/SuperNova080710/Blog-frontend)

### 한판아레나

알까기·오목·체스를 제공하는 온라인 대전 웹게임입니다. 대전과 친구 초대 흐름의 요구사항을 정하고, AI 보조 구현 결과를 브라우저에서 검증했습니다. 턴 표시와 재도전 동선, 메신저 입력 영역의 문제를 재현하며 수정 우선순위와 배포 여부를 판단했습니다.

[서비스 체험](https://alkkagi-alpha.vercel.app/) · [v0.4.3 릴리스 PR](https://github.com/SuperNova080710/Alkkagi/pull/388)

### ECH Beacon Explorer

동결된 합성 실험 데이터를 바탕으로, 같은 샘플에 대한 두 탐지기의 판정과 오탐·추론 비용을 비교할 수 있는 웹 앱을 구현했습니다.

[연구 기반 앱 체험](https://trace-eight-topaz.vercel.app/ech-beacon-explorer) · [연구 저장소](https://github.com/SuperNova080710/ech-beacon-detection)

## 경험과 실습

- **SKT ALEPH** · AI 보안 에이전트 개발 과정 수료, 케테르(최고 등급) 인증 · 2026.08–2026.11. [수료증·인증서 보기](https://trace-eight-topaz.vercel.app/#experience)
- **Kubernetes(k3s)** · Nginx 배포와 Pod 자동 복구, Traefik 라우팅·로드 밸런싱을 실습했습니다. 이미지 태그 오류로 배포가 실패했을 때 Pod 이벤트로 원인을 확인하고, 기존 서비스의 HTTP 응답과 롤백 결과를 기록했습니다. [실습 기록](https://odyz.tistory.com/43)
- **나사렛대학교** · IT융합학부 컴퓨터소프트웨어 트랙 · 2025년 2월 졸업

## 지원 서류와 연락처

[이력서](https://trace-eight-topaz.vercel.app/documents/resume/) · [자기소개서](https://trace-eight-topaz.vercel.app/documents/personal-statement/) · [프로젝트 경험기술서](https://trace-eight-topaz.vercel.app/documents/project-experience/)

세 문서는 웹에서 열람하거나 Word로 다운로드할 수 있으며, 브라우저 인쇄로 PDF를 저장할 수 있습니다.

이메일 [lionoh00@gmail.com](mailto:lionoh00@gmail.com)

## Trace 실행 및 검증

Trace는 Next.js·React·TypeScript로 구현한 정적 사이트이며 Vercel에서 운영합니다. 로컬 실행에는 Node.js 22 이상이 필요합니다.

```bash
npm ci
npm run dev
```

로컬 서버가 실행되면 [http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다. `npm run check`는 린트, 타입 검사, 테스트, 공개 범위 검사와 정적 빌드·내보내기 검증을 실행합니다.

[BR-A 재현·검증 기록](docs/quality/issue-8-final-reproduction.md) · [BR-B 제출 기록](docs/br-b/submission-draft.md)
