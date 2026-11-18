export type DocumentLink = { label: string; url: string };
export type DocumentSection = {
  heading: string;
  paragraphs?: readonly string[];
  bullets?: readonly string[];
  links?: readonly DocumentLink[];
};
export type ApplicationDocument = {
  slug: "resume" | "personal-statement" | "project-experience";
  title: string;
  subtitle: string;
  summary: string;
  sections: readonly DocumentSection[];
};

export const applicationDocumentsUpdatedAt = "2026년 11월 18일";

const sources = {
  trace: { label: "Trace 포트폴리오", url: "https://trace-eight-topaz.vercel.app/" },
  paper: { label: "KCI 논문 상세", url: "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003279319" },
  technicalBlog: { label: "티스토리 기술 블로그", url: "https://odyz.tistory.com/" },
  podRecovery: { label: "Nginx 배포와 Pod 자동 복구", url: "https://odyz.tistory.com/37" },
  routing: { label: "Traefik 호스트 기반 라우팅", url: "https://odyz.tistory.com/40" },
  loadBalancing: { label: "Traefik 로드 밸런싱", url: "https://odyz.tistory.com/41" },
  rollingUpdate: { label: "롤링 업데이트와 롤백", url: "https://odyz.tistory.com/42" },
  rolloutFailure: { label: "ImagePullBackOff 원인 분석과 롤백", url: "https://odyz.tistory.com/43" },
  blogBackend: { label: "Blog 백엔드 코드", url: "https://github.com/SuperNova080710/Blog-backend" },
  blogFrontend: { label: "Blog 프런트엔드 코드", url: "https://github.com/SuperNova080710/Blog-frontend" },
  ech: { label: "Native ECH 연구 저장소", url: "https://github.com/SuperNova080710/ech-beacon-detection" },
  explorer: { label: "ECH Beacon Explorer", url: "https://trace-eight-topaz.vercel.app/ech-beacon-explorer" },
  arena: { label: "한판아레나", url: "https://alkkagi-alpha.vercel.app/" },
  arenaRelease: { label: "한판아레나 v0.4.3 릴리스 PR", url: "https://github.com/SuperNova080710/Alkkagi/pull/388" },
} satisfies Record<string, DocumentLink>;

export const applicationDocuments: readonly ApplicationDocument[] = [
  {
    slug: "resume",
    title: "이력서",
    subtitle: "오리온 · 백엔드 / 풀스택 개발자",
    summary: "인증과 데이터 흐름을 구현하고, 문제가 생기면 로그와 테스트로 실패 지점을 좁혀가는 개발자입니다.",
    sections: [
      { heading: "기본 정보", paragraphs: [
        "오리온 (포트폴리오 공개용 이름) · 백엔드 / 풀스택 개발자 지원",
        "이메일: lionoh00@gmail.com",
        "나사렛대학교 IT융합학부 컴퓨터소프트웨어 트랙 · 2025년 2월 졸업",
        "SKT ALEPH 과정 · 2026년 11월 수료",
      ], links: [
        { label: "GitHub", url: "https://github.com/SuperNova080710" },
        sources.trace,
        sources.technicalBlog,
      ] },
      { heading: "기술 경험", bullets: [
        "백엔드: Node.js, NestJS, TypeScript, TypeORM, REST API, JWT 인증·토큰 갱신",
        "프런트엔드: Next.js, React, Tailwind CSS",
        "데이터베이스·배포: PostgreSQL, Supabase Auth·RLS·Realtime, Docker, Vercel",
        "인프라 실습: Ubuntu, Kubernetes(k3s), kubectl, YAML, Traefik Ingress",
        "개발·검증: GitHub Issue·PR·CI, 로그 기반 오류 재현, 브라우저 동작 확인",
      ] },
      { heading: "주요 프로젝트", bullets: [
        "디지털 트윈 스마트 캠퍼스 · ESP32·MQTT·서버·Unreal Engine 연동을 담당해 현실 장치와 가상 캠퍼스의 양방향 제어를 구현하고 시연했습니다.",
        "Full-stack Blog · NestJS·PostgreSQL API와 Next.js 화면을 구축했습니다. JWT 로그인·갱신, 게시글 CRUD, 사용자 소유권 확인을 구현했습니다.",
        "한판아레나 v0.4.3 · 알까기·오목·체스 웹게임의 요구사항 정의, AI 보조 구현 결과 검증, PR 검토와 Vercel 릴리스 판단을 맡았습니다.",
        "Native ECH Beacon Detection · 합성 Held-out 110건에서 두 탐지기를 비교했습니다. Multi-feature 모델의 정상 트래픽 오탐은 10건에서 7건, F1은 0.9091에서 0.9346으로 바뀌었습니다.",
      ], links: [sources.blogBackend, sources.arenaRelease, sources.explorer] },
      { heading: "수상·논문", bullets: [
        "2025년 7월 · 한국디지털콘텐츠학회 하계종합학술대회 대학생 논문경진대회 동상",
        "2025년 12월 · 「디지털 트윈 및 메타버스 융합형 스마트 캠퍼스 설계 및 구현」 제1저자, KCI 등재 《디지털콘텐츠학회논문지》 26권 12호, 3391–3397쪽",
      ], links: [sources.paper] },
      { heading: "Kubernetes 개인 실습", paragraphs: [
        "2026년 11월 · k3s에서 Nginx 배포와 Pod 복구, Traefik 호스트 기반 라우팅·로드 밸런싱, 롤링 업데이트와 롤백을 실습했습니다. 이미지 태그 오류를 Pod 이벤트로 찾아내고 배포 실패 구간의 HTTP 응답과 복구 결과를 기록했습니다.",
      ], links: [sources.rolloutFailure] },
    ],
  },
  {
    slug: "personal-statement",
    title: "자기소개서",
    subtitle: "오리온 · 문제의 구조를 이해하고 근거를 남기는 개발자",
    summary: "디지털 트윈 연동 문제와 Kubernetes 배포 실패를 확인하며 익힌 문제 해결 방식을 소개합니다.",
    sections: [
      { heading: "정상인 구간부터 확인합니다", paragraphs: [
        "모르는 문제가 생기면 제가 아는 지식 내에서 차근차근 찾아보는 사람입니다. 먼저 어디까지 정상이고 어디서부터 예상과 다른지 확인합니다. 로그와 실행 결과를 하나씩 대조하면, 다음에 무엇을 확인해야 할지 판단할 수 있었습니다.",
      ] },
      { heading: "디지털 트윈에서 문제의 범위를 좁힌 경험", paragraphs: [
        "2024년 캡스톤에서 ESP32의 센서 상태를 Unreal Engine 가상 공간에 반영하고, 가상 공간에서 실제 장치를 제어하도록 연동을 맡았습니다. MQTT 메시지가 늦거나 누락됐을 때는 ESP32, 네트워크, 서버, Unreal Engine으로 구간을 나눠 메시지가 어디까지 전달되는지 확인했습니다.",
        "구간별로 확인한 결과를 바탕으로 연결을 완성해 시연했습니다. 이 프로젝트를 발전시킨 연구로 2025년 한국디지털콘텐츠학회 대학생 논문경진대회에서 동상을 받았고, 같은 해 12월 KCI 등재 학술지에 논문을 게재했습니다.",
      ], links: [sources.paper] },
      { heading: "배포 실패와 서비스 상태를 따로 확인했습니다", paragraphs: [
        "k3s 실습에서는 존재하지 않는 이미지 태그로 새 버전을 배포했습니다. 설정 검증은 통과했지만 새 Pod는 ImagePullBackOff에 머물렀습니다. Pod 이벤트를 읽어 이미지 태그가 원인임을 확인하고, 별도로 HTTP 요청을 보내 기존 Pod 세 개가 여전히 응답하는지도 확인했습니다.",
        "배포 실패 구간의 요청 20건은 모두 HTTP 200이었고, 롤백 뒤 Pod와 서비스가 정상 상태인지 다시 확인했습니다. 재현 조건과 실행 결과를 티스토리에 남겨, 나중에도 같은 상황을 어떤 순서로 확인했는지 돌아볼 수 있게 했습니다.",
      ], links: [sources.rolloutFailure] },
      { heading: "요구사항을 실제 사용 흐름으로 검증합니다", paragraphs: [
        "한판아레나에서는 친구와 대전 방에 입장하고, 턴을 확인하고, 게임 종료 후 재도전하는 흐름을 기준으로 요구사항을 정했습니다. AI 보조로 구현한 기능을 브라우저에서 사용하며 턴 표시, 재도전 동선, 메신저 입력창처럼 사용에 직접 영향을 주는 문제를 재현해 수정 우선순위를 정했습니다. 검증 결과를 보고 PR과 배포 여부를 판단했습니다.",
      ], links: [sources.arenaRelease] },
      { heading: "지원 동기와 앞으로의 방향", paragraphs: [
        "화면에서 보이는 동작이 API와 데이터베이스 상태로 어떻게 이어지는지 파악하는 과정에 흥미가 있어 백엔드와 풀스택 개발을 지향합니다. Full-stack Blog에서 인증과 토큰 갱신, 게시글 소유권을 구현하면서 이 관심을 구체적인 개발 경험으로 쌓았습니다.",
        "입사 후에는 기존 시스템의 데이터 흐름과 검증 방법부터 이해하겠습니다. 변경을 작게 나누어 확인하고, 문제가 생기면 재현 조건과 수정 근거를 남겨 동료가 이어서 검증할 수 있게 하겠습니다.",
      ] },
    ],
  },
  {
    slug: "project-experience",
    title: "프로젝트 경험기술서",
    subtitle: "오리온 · 수행 내용과 검증 근거",
    summary: "백엔드 구현, 디지털 트윈 연구, Kubernetes 실습, 웹게임과 포트폴리오 배포 경험에서 맡은 역할과 확인 결과를 정리했습니다.",
    sections: [
      { heading: "디지털 트윈 스마트 캠퍼스", paragraphs: [
        "기간·기술: 2024년 캡스톤디자인 · ESP32, MQTT, 서버, Unreal Engine.",
        "담당: 현실 장치의 상태를 가상 캠퍼스에 반영하고 가상 공간에서 장치를 제어하는 양방향 연동을 맡았습니다. 메시지 지연과 누락이 반복되자 장치, 네트워크, 서버, Unreal Engine에서 각각 전달 여부와 처리 결과를 확인했습니다.",
        "성과: 2024년 통합 시스템 시연. 2025년 7월 한국디지털콘텐츠학회 하계종합학술대회 대학생 논문경진대회 동상. 2025년 12월 「디지털 트윈 및 메타버스 융합형 스마트 캠퍼스 설계 및 구현」 제1저자 게재.",
        "게재 정보: 《디지털콘텐츠학회논문지》 26권 12호, 3391–3397쪽, DOI 10.9728/dcs.2025.26.12.3391.",
      ], links: [sources.paper] },
      { heading: "Full-stack Blog | 인증과 게시글 API", paragraphs: [
        "기술: NestJS 11, TypeORM 0.3, PostgreSQL 16, Next.js 16, React 19, TypeScript, Docker.",
        "담당: JWT 로그인·토큰 갱신·로그아웃·사용자 조회와 게시글 CRUD를 구현했습니다. 프런트엔드에서 토큰 갱신 후 요청을 다시 보내도록 연결했고, API에서 게시글 소유권을 확인했습니다.",
        "검증: 로그인, 토큰 갱신, 사용자별 게시글 접근을 확인했습니다. Docker 환경에서 마이그레이션과 CORS 설정도 점검했습니다.",
      ], links: [sources.blogBackend, sources.blogFrontend] },
      { heading: "Kubernetes(k3s) | 배포와 장애 복구 실습", paragraphs: [
        "범위: 2026년 11월 Ubuntu의 개인 k3s 클러스터. kubectl, Deployment, Service, Ingress, ConfigMap, Traefik을 사용했습니다.",
      ], bullets: [
        "Nginx를 배포하고 YAML로 Pod 수를 3개로 설정했습니다. Pod를 삭제해도 원하는 개수로 돌아오는 것을 확인했습니다.",
        "Traefik Ingress로 Host에 따라 두 서비스로 라우팅했습니다. 한 서비스에 연결된 Pod 3개로 HTTP 요청이 분산되는 것을 응답의 Hostname으로 확인했습니다.",
        "롤링 업데이트에서 새 Pod와 기존 Pod의 교체 과정을 관찰하고, 배포 리비전 조회와 롤백을 실습했습니다.",
        "존재하지 않는 이미지 태그를 적용해 ImagePullBackOff를 재현했습니다. Pod 이벤트에서 원인을 확인했고, 실패 구간의 HTTP 요청 20건이 모두 200으로 응답하는 것과 롤백 후 정상 상태를 기록했습니다.",
      ], links: [sources.podRecovery, sources.routing, sources.loadBalancing, sources.rollingUpdate, sources.rolloutFailure] },
      { heading: "한판아레나 | 웹게임 품질 검증과 릴리스", paragraphs: [
        "기술: Next.js, React, TypeScript, Supabase PostgreSQL·Auth·RLS·Realtime, Vercel.",
        "담당: 알까기에서 시작해 오목·체스로 확장하는 요구사항과 대전·랭크·친구 초대 흐름을 정의했습니다. AI 보조로 구현한 게임 로직, 화면, 데이터 접근·실시간 동작의 결과를 브라우저에서 점검하고 수정 우선순위와 배포 여부를 판단했습니다.",
        "성과: v0.4.3 정식 릴리스에 세 게임 공통 친구 메신저·초대와 화면 전환 개선을 반영했습니다. 게임별 턴 표시와 재도전 흐름, 메신저 입력 영역을 확인했습니다.",
      ], links: [sources.arena, sources.arenaRelease] },
      { heading: "Native ECH Beacon Detection | 합성 데이터 실험", paragraphs: [
        "기술: TLS 1.3, ECH, Python, Docker, OpenSSL, PCAP.",
        "담당: 합성 HTTPS 연결 200건을 Calibration 90건과 Held-out 110건으로 고정 분리했습니다. 동일 Held-out 표본에서 연결 메타데이터 기반 Timing-only와 Multi-feature 모델의 판정을 비교했습니다.",
        "결과: 정상 연결 오탐 10건 → 7건, F1 0.9091 → 0.9346, 두 모델의 재현율 1.0. 결과 범위는 단일 통제 환경의 합성 표본이며, Multi-feature의 추론 비용이 더 높았습니다.",
      ], links: [sources.ech, sources.explorer] },
      { heading: "Trace | 포트폴리오와 문서 열람", paragraphs: [
        "범위: 프로젝트 근거, 연구 결과 탐색 앱, 공개 지원 문서 3종을 Next.js 포트폴리오에 연결했습니다.",
        "담당: 대표 프로젝트 배치, 서류 탭·다운로드 동선, 데스크톱·모바일 전환 요구사항을 정하고 Preview에서 변경사항을 검토했습니다. GitHub PR과 Vercel 운영 배포 흐름을 사용했습니다.",
      ], links: [sources.trace] },
    ],
  },
];

export function getApplicationDocument(slug: string): ApplicationDocument | undefined {
  return applicationDocuments.find((document) => document.slug === slug);
}
