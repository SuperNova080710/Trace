/**
 * Public application materials, synthesized from the author's approved TRACE
 * narrative, earlier BR-A drafts, and selected Memorial Park records.
 * No raw ritual logs, personal photos, or unverified awards are published.
 */
export type DocumentSection = { heading: string; paragraphs?: readonly string[]; bullets?: readonly string[] };
export type ApplicationDocument = {
  slug: "resume" | "personal-statement" | "project-experience";
  title: string;
  subtitle: string;
  summary: string;
  sections: readonly DocumentSection[];
};

export const applicationDocuments: readonly ApplicationDocument[] = [
  {
    slug: "resume",
    title: "이력서",
    subtitle: "오리온 · 백엔드 / 풀스택 개발자",
    summary: "NestJS와 PostgreSQL로 인증·게시글 API를 구현하고 Next.js 화면과 연결했습니다.",
    sections: [
      { heading: "기본 정보", paragraphs: ["이름: 오리온 (포트폴리오 공개용 이름)", "지원 직무: 백엔드 개발자 · 풀스택 개발자", "이메일: lionoh00@gmail.com", "GitHub: https://github.com/SuperNova080710", "학력: 나사렛대학교 IT융합학부 컴퓨터소프트웨어 트랙 · 2025년 2월 졸업"] },
      { heading: "주요 프로젝트", bullets: [
        "Full-stack Blog — NestJS·PostgreSQL 기반 인증과 게시글 API를 구현하고 Next.js 화면과 연결했습니다. 게시글 수정·삭제 권한을 서버에서 작성자 기준으로 확인합니다.",
        "디지털 트윈 캡스톤 (2024) — ESP32·MQTT·서버·Unreal Engine을 잇는 경로를 구간별로 점검했습니다. 팀은 장치 상태 반영과 제어를 시연했습니다.",
        "ECH 탐지 연구 — 합성 평가 110건에서 두 탐지 방식을 비교해 정상 연결 오탐 10건에서 7건으로 줄어든 결과를 확인했습니다."
      ] },
      { heading: "기술 경험", bullets: [
        "백엔드 · NestJS, Node.js, TypeScript, TypeORM, PostgreSQL, REST API, JWT",
        "프런트엔드 · Next.js, React, TypeScript",
        "개발 환경 · Docker, GitHub Issues와 Pull Requests"
      ] },
      { heading: "프로젝트 링크", bullets: [
        "Blog Backend: https://github.com/SuperNova080710/Blog-backend",
        "Blog Frontend: https://github.com/SuperNova080710/Blog-frontend",
        "ECH Research: https://github.com/SuperNova080710/ech-beacon-detection"
      ] },
    ]
  },
  {
    slug: "personal-statement",
    title: "자기소개서",
    subtitle: "오리온 · 문제의 구조를 이해하고 근거를 남기는 개발자",
    summary: "막힌 문제를 작은 구간으로 나누고 원인을 확인했던 경험을 중심으로 작성한 자기소개서입니다.",
    sections: [
      { heading: "연결 문제를 바라보는 방식이 바뀐 경험", paragraphs: [
        "2024년 디지털 트윈 캡스톤에서 팀과 함께 실제 장치의 상태를 Unreal Engine에 반영하고, 가상 공간에서 장치를 제어하는 시스템을 만들었습니다. MQTT 메시지 전달과 서버 연동에서 오류가 반복되자 처음에는 여러 부분을 동시에 수정했습니다. 변경이 쌓일수록 어느 구간에서 문제가 발생하는지 파악하기 어려웠습니다.",
        "ESP32, 네트워크, 서버, Unreal Engine으로 데이터가 지나가는 길을 나누고 각 구간에서 정상적으로 동작하는 부분부터 확인했습니다. 그렇게 확인 범위를 좁혀가며 팀과 최종 시연을 완성했습니다. 이후에는 수정에 앞서 어디까지 동작하는지 확인하고, 다음 변경의 결과를 비교할 기준부터 세웁니다."
      ] },
      { heading: "백엔드에 관심을 둔 이유", paragraphs: [
        "화면에서 시작한 요청이 서버의 규칙과 데이터베이스 상태로 이어지는 과정이 흥미롭습니다. Full-stack Blog를 만들며 로그인과 토큰 갱신을 화면에 연결하고, 게시글을 수정하거나 삭제할 때 서버가 작성자를 확인하도록 구현했습니다. 앞으로도 기능을 추가할 때 어떤 조건에서 요청이 허용되고 어떤 경우 거부되는지 함께 확인하고 싶습니다."
      ] }
    ]
  },
  {
    slug: "project-experience",
    title: "프로젝트 경험기술서",
    subtitle: "오리온 · 수행 내용과 검증 근거",
    summary: "프로젝트별 목표, 수행 범위, 결과, 한계를 구분했습니다. AI 보조 개발에서는 본인 기여를 구체적으로 명시했습니다.",
    sections: [
      { heading: "01 · Full-stack Blog | 백엔드·풀스택 구현", paragraphs: [
        "기술: NestJS 11, Node.js 22, TypeORM 0.3, PostgreSQL 16, JWT, Next.js 16, React 19, TypeScript.",
        "상황: 인증과 게시글 CRUD를 수행하는 웹 서비스를 프런트엔드와 백엔드로 나누어 구축해야 했습니다.",
        "수행: JWT 로그인·토큰 갱신과 게시글 CRUD 및 페이지네이션을 구현했습니다. 새 글의 작성자는 인증된 사용자로 저장하고, 수정·삭제는 서비스에서 저장된 작성자 ID와 요청 사용자 ID를 비교해 처리했습니다.",
        "코드와 API 문서에서 확인할 수 있는 수정 응답은 작성자 200, 다른 로그인 사용자 403, 미인증 요청 401입니다. PostgreSQL 스키마 변경은 TypeORM 마이그레이션으로 관리했습니다.",
        "권한 검사 코드: https://github.com/SuperNova080710/Blog-backend/blob/main/src/modules/posts/posts.service.ts",
        "API 문서: https://github.com/SuperNova080710/Blog-backend/blob/main/docs/api/posts.md"
      ] },
      { heading: "02 · 디지털 트윈 캡스톤 | 팀 프로젝트·연동 오류 분석", paragraphs: [
        "기간: 2024년. 기술: ESP32, MQTT, 서버, Unreal Engine.",
        "상황: 물리 장치 상태를 가상환경에 반영하고 가상환경에서 장치를 제어하는 통합 과정에서 통신 지연, 데이터 처리, 영상 연동 오류가 반복됐습니다.",
        "본인 역할: ESP32→네트워크→서버→Unreal Engine으로 구간을 나누어 각 구간의 동작을 확인하고 원인을 좁혔습니다.",
        "팀 결과: 실제 장치 상태 반영과 가상 공간에서의 장치 제어를 최종 시연했습니다."
      ] },
      { heading: "03 · Native ECH Beacon Detection | 재현 가능한 보안 연구", paragraphs: [
        "기술: TLS 1.3, ECH, Python, Docker, OpenSSL, curl, nginx, PCAP.",
        "문제: ECH 환경의 합성 HTTPS 비콘을 연결 메타데이터로 판별할 때 Timing-only와 Multi-feature의 차이를 정량적으로 확인하고자 했습니다.",
        "수행: 200개 통제 Trial(Beacon 100 / Normal 100)을 수집하고 Calibration 90, Held-out 110으로 고정 분리했습니다. 두 탐지기 예측과 평가 JSON, 패킷 원본의 재현성과 무결성을 검증했습니다.",
        "결과: Held-out Beacon 50 / Normal 60에서 Timing-only TP50·FP10·TN50·FN0, Multi-feature TP50·FP7·TN53·FN0을 확인했습니다. F1 0.9091→0.9346, 재현율 양쪽 모두 1.0입니다. 따라서 최초의 재현율 향상 가설은 지지되지 않았습니다.",
        "한계: 합성·단일 통제 환경 결과로 실제 악성 C2나 운영망 성능으로 일반화할 수 없습니다. Multi-feature는 계산 비용이 더 높습니다.",
        "근거: https://github.com/SuperNova080710/ech-beacon-detection"
      ] },
      { heading: "04 · Alkkagi Arena | 기획·품질 검증·릴리스 판단", paragraphs: [
        "기술: Next.js, React, TypeScript, Supabase PostgreSQL·Auth·RLS, Realtime, Vercel. GitHub: https://github.com/SuperNova080710/Alkkagi",
        "목표: 친구와 방을 만들어 1:1로 대전하고 랜덤 랭크 매칭·점수·순위를 제공하는 브라우저 게임으로 시작해 오목 등으로 확장했습니다.",
        "본인 역할: 프로젝트 목표와 기술 스택 선택, 1:1 게임·랭크·친구·AI 대전 요구사항 정의, 사용자 시나리오 점검, 화면·턴 상태·재도전·랭킹·채팅 등에 대한 문제 제기 및 수정 우선순위 결정, PR 검토와 Vercel 배포 승인.",
        "AI 지원 범위: 게임 로직·화면 컴포넌트·SQL/RLS·실시간 통신·자동화 테스트 등의 구현을 AI에 위임해 진행했습니다. 구현 세부 코드를 전부 직접 작성한 것으로 표현하지 않습니다.",
        "결과: 정식 릴리스에서 알까기·오목 게임 화면을 확인했고, 반복된 Preview 검증을 통해 UI·기능 수정 사항을 정리했습니다. 전체 운영 트래픽 수치·기여율은 확인되지 않았습니다."
      ] },
      { heading: "05 · k3s · Kubernetes | 인프라 학습 실습", paragraphs: [
        "환경: Ubuntu, k3s, kubectl, nginx, Kubernetes Deployment 및 Service.",
        "수행: nginx Deployment와 Service를 생성하고 Replica 3개로 확장했습니다. Pod 강제 삭제 후 복구, YAML 선언 변경 전 kubectl diff 확인, 배포 상태 관찰 등을 진행했습니다.",
        "학습 결과: 명령어·옵션의 의미와 각 리소스의 연결 구조를 메모하고 결과를 확인하는 방식으로 학습했습니다. 이는 개인 실습이며 운영 Kubernetes 구축 경력으로 주장하지 않습니다."
      ] }
    ]
  }
];

export function getApplicationDocument(slug: string): ApplicationDocument | undefined {
  return applicationDocuments.find((document) => document.slug === slug);
}
