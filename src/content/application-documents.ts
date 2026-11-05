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
    summary: "서버와 프런트엔드를 연결해 기능을 구현하고, 오류를 재현·검증하며 변경 이력을 남기는 개발자입니다.",
    sections: [
      { heading: "기본 정보", paragraphs: ["이름: 오리온 (포트폴리오 공개용 이름)", "지원 직무: 백엔드 개발자 · 풀스택 개발자", "이메일: lionoh00@gmail.com", "GitHub: https://github.com/SuperNova080710", "학력: 나사렛대학교 IT융합학부 컴퓨터소프트웨어 트랙 · 2025년 2월 졸업"] },
      { heading: "소개", paragraphs: ["모르는 문제가 생기면 제가 아는 지식 내에서 차근차근 찾아보는 사람입니다. 구현 자체보다 시스템의 흐름과 오류의 발생 구간을 이해하고, 로그와 테스트를 통해 결과를 다시 확인하는 태도를 중요하게 생각합니다."] },
      { heading: "기술 경험", bullets: [
        "백엔드: Node.js, NestJS, TypeScript, TypeORM, REST API, JWT 인증·토큰 갱신",
        "프런트엔드: Next.js, React, TypeScript, Tailwind CSS",
        "데이터베이스·배포: PostgreSQL, Supabase, RLS, Docker, Vercel",
        "학습 및 실습: Linux, k3s, Kubernetes Deployment·Service, GitHub Issue·PR·CI",
        "연구: Python, TLS 1.3/ECH, PCAP, 실험 데이터 분석 및 재현성 검증"
      ] },
      { heading: "주요 프로젝트", bullets: [
        "Full-stack Blog — Next.js 화면과 NestJS·TypeORM·PostgreSQL API를 별도 저장소로 구성. JWT 로그인·토큰 갱신과 게시글 목록·상세·작성·수정·삭제 흐름 개발·검증.",
        "Native ECH Beacon Detection — 합성 통제 실험 200 Trial 중 Held-out 110건에서 Timing-only 대비 Multi-feature의 오탐 10→7건, F1 0.9091→0.9346 확인. 실제 운영망 탐지 성능을 뜻하지는 않음.",
        "디지털 트윈 캡스톤(2024) — ESP32·MQTT·서버·Unreal Engine 연결 과정의 오류를 구간별로 분리 검증하여 시연 시스템 완성.",
        "Alkkagi Arena(2026) — 1:1 알까기·오목 웹게임의 요구사항·사용 흐름을 기획하고 AI 지원 구현을 검토, 브라우저 실제 사용 및 PR·배포 승인에 참여."
      ] },
      { heading: "확인 가능한 작업 방식", paragraphs: ["큰 목표를 이슈로 나누어 구현·검증 후 PR에 남깁니다. AI를 활용할 때도 제안된 구현을 결과로 단정하지 않고, 사용자 관점에서 직접 재현하고 수정할 기준을 정합니다. 업무 경력, 실제 사용자 수와 기여율 등 미확인 수치는 기재하지 않았습니다."] },
      { heading: "프로젝트 링크", bullets: [
        "Blog Backend: https://github.com/SuperNova080710/Blog-backend",
        "Blog Frontend: https://github.com/SuperNova080710/Blog-frontend",
        "ECH Research: https://github.com/SuperNova080710/ech-beacon-detection",
        "Alkkagi Arena: https://github.com/SuperNova080710/Alkkagi"
      ] },
    ]
  },
  {
    slug: "personal-statement",
    title: "자기소개서",
    subtitle: "오리온 · 문제의 구조를 이해하고 근거를 남기는 개발자",
    summary: "막힌 문제를 작은 구간으로 나누고 원인을 확인했던 경험을 중심으로 작성한 자기소개서입니다.",
    sections: [
      { heading: "문제를 대하는 태도", paragraphs: [
        "모르는 문제가 생기면 제가 아는 지식 내에서 차근차근 찾아보는 사람입니다.",
        "문제를 마주했을 때 바로 정답을 찾지 못하더라도, 어떤 부분이 정상이고 어디부터 예상과 다른지 구분하려고 노력합니다. 제가 잘 아는 부분에서 시작해 로그와 실행 결과를 확인하면 처음에는 복잡해 보이던 문제도 조금씩 이해할 수 있었습니다."
      ] },
      { heading: "실패한 접근을 바꾼 디지털 트윈 경험", paragraphs: [
        "2024년 캡스톤디자인에서 ESP32와 Unreal Engine을 연결해 현실 장치의 상태를 가상 공간에 반영하고 가상 공간에서 실제 장치를 제어하는 디지털 트윈 시스템을 개발했습니다. MQTT 메시지의 지연과 전달 문제, 서버 및 Unreal Engine 연동 오류, 영상 처리 문제 등이 반복됐습니다.",
        "처음에는 여러 부분을 함께 수정했지만, 어디에서 문제가 발생하는지 알기 더 어려워졌습니다. 이후 ESP32, 네트워크, 서버, Unreal Engine으로 흐름을 나누어 각 구간을 하나씩 검증했습니다. 확인한 구간을 기준으로 원인을 좁혀가며 최종 연결 시스템을 완성했습니다. 이 경험은 문제를 빨리 수정하는 것보다 현재 상태를 정확히 파악하는 일이 중요하다는 점을 알려주었습니다."
      ] },
      { heading: "기록하고 검증하는 습관", paragraphs: [
        "개발을 계속하면서 같은 원칙을 실천하고 있습니다. 2026년 9월에는 해결되지 않던 오류의 재현 조건과 로그를 추적했고, 복잡하게 꼬인 구조를 정리해 다시 시작하기도 했습니다. 타입 검사 오류를 확인할 때는 이전 테스트 파일 변경으로 남아 있던 참조를 원인으로 찾아냈습니다.",
        "최근 k3s를 학습할 때도 단순히 명령어를 따라 치는 데에서 끝내지 않으려고 합니다. Deployment와 Service를 직접 생성하고 결과를 관찰하며, 옵션의 의미와 YAML 설정이 어떤 동작을 만들어내는지 기록했습니다. 아직 모든 설정을 완성하지는 못했지만, GUI보다 CLI부터 연습하면서 구조를 이해하려고 했습니다."
      ] },
      { heading: "AI와 협업하면서 지키는 기준", paragraphs: [
        "AI를 사용해 구현 속도를 높일 수 있어도, 제안된 코드가 실제 요구사항을 만족하는지는 따로 확인해야 한다고 생각합니다. Alkkagi Arena에서는 게임 주제와 핵심 기능, 랭크 경쟁과 방 참여 방식 등을 결정하고 AI 지원 구현을 활용했습니다. 실제 사용 중 발견한 화면 스크롤, 턴 표시, 재도전 흐름, 랭킹 화면의 불편한 점을 구체적으로 정리해 수정과 검증을 반복했습니다.",
        "저는 이 과정에서 AI가 작성한 코드를 모두 직접 작성했다고 말하지 않습니다. 요구사항을 분명히 하고 문제를 재현하며, 무엇을 수정할지 판단하고 배포 결과를 확인하는 역할 역시 책임 있는 개발 과정이라고 생각합니다."
      ] },
      { heading: "지원 동기와 앞으로의 방향", paragraphs: [
        "백엔드와 풀스택 개발을 지향하는 이유는 화면에서 보이는 동작과 서버·데이터베이스의 상태가 어떻게 이어지는지 이해하는 과정에 흥미가 있기 때문입니다. 블로그 프로젝트에서 인증, 토큰 갱신, 사용자별 데이터 접근과 게시글 API를 개발하며 이런 관심을 구체적인 경험으로 쌓았습니다.",
        "입사 후에는 기존 시스템의 규칙과 데이터 흐름을 먼저 파악하고, 작은 변경부터 테스트 가능한 단위로 검증하겠습니다. 문제를 해결했을 때는 왜 발생했는지와 어떤 판단으로 수정했는지 함께 기록해 동료가 이어서 확인할 수 있게 하겠습니다.",
        "앞으로 새로운 기술과 낯선 문제를 피하기보다 구조를 이해하고, 원인을 파악하는 해결 과정을 자신의 경험이나 지식으로 쌓는 개발자가 되려고 합니다."
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
        "수행: NestJS API의 Controller·DTO·Service 흐름, JWT Access/Refresh 토큰 갱신, 쿠키 및 401 재시도, 게시글 목록·상세·생성·수정·삭제, 페이지네이션과 사용자 소유권 동작을 구현·검증했습니다. Docker 환경의 데이터베이스 마이그레이션 문제와 CORS 설정도 점검했습니다.",
        "결과: 로그인·토큰 갱신·게시글 주요 기능의 동작을 확인했습니다. 실사용자 규모 및 운영 가용성 지표는 확보하지 않아 주장하지 않습니다.",
        "근거: https://github.com/SuperNova080710/Blog-backend / https://github.com/SuperNova080710/Blog-frontend"
      ] },
      { heading: "02 · Native ECH Beacon Detection | 재현 가능한 보안 연구", paragraphs: [
        "기술: TLS 1.3, ECH, Python, Docker, OpenSSL, curl, nginx, PCAP.",
        "문제: ECH 환경의 합성 HTTPS 비콘을 연결 메타데이터로 판별할 때 Timing-only와 Multi-feature의 차이를 정량적으로 확인하고자 했습니다.",
        "수행: 200개 통제 Trial(Beacon 100 / Normal 100)을 수집하고 Calibration 90, Held-out 110으로 고정 분리했습니다. 두 탐지기 예측과 평가 JSON, 패킷 원본의 재현성과 무결성을 검증했습니다.",
        "결과: Held-out Beacon 50 / Normal 60에서 Timing-only TP50·FP10·TN50·FN0, Multi-feature TP50·FP7·TN53·FN0을 확인했습니다. F1 0.9091→0.9346, 재현율 양쪽 모두 1.0입니다. 따라서 최초의 재현율 향상 가설은 지지되지 않았습니다.",
        "한계: 합성·단일 통제 환경 결과로 실제 악성 C2나 운영망 성능으로 일반화할 수 없습니다. Multi-feature는 계산 비용이 더 높습니다.",
        "근거: https://github.com/SuperNova080710/ech-beacon-detection"
      ] },
      { heading: "03 · 디지털 트윈 캡스톤 | 팀 프로젝트·연동 오류 분석", paragraphs: [
        "기간: 2024년. 기술: ESP32, MQTT, 서버, Unreal Engine.",
        "상황: 물리 장치 상태를 가상환경에 반영하고 가상환경에서 장치를 제어하는 통합 과정에서 통신 지연, 데이터 처리, 영상 연동 오류가 반복됐습니다.",
        "수행: ESP32→네트워크→서버→Unreal Engine으로 구간을 나누어 각 구간의 동작을 확인하고 원인을 좁혔습니다.",
        "결과: 시스템 연결 및 최종 시연을 완성했습니다. 팀원별 코드 기여율은 검증되지 않아 제시하지 않습니다."
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
      ] },
      { heading: "검증 원칙", paragraphs: ["공개 저장소·본인 기록에서 확인할 수 있는 결과만 기술했습니다. 연구 실험의 제약, 팀 프로젝트 기여 경계, AI 보조 개발에서의 역할, 인프라 학습과 운영 경험의 차이를 명시했습니다."] }
    ]
  }
];

export function getApplicationDocument(slug: string): ApplicationDocument | undefined {
  return applicationDocuments.find((document) => document.slug === slug);
}
