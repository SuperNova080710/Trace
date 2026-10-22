/**
 * Public, approved details only.
 * Do not import the private ritual-history JSON from this module.
 * Only explicitly approved public aggregates may be included; draft or raw entries remain absent.
 */
export const publicProfile = {
  displayName: "오리온",
  contactEmail: "lionoh00@gmail.com",
  title: "Trace — 오리온의 개발 기록",
} as const;

export type ApprovalStatus = "pending" | "approved";

export type NarrativeChapter = "opening" | "difficulty" | "turning" | "growth" | "closing";

export type ApprovedNarrative = {
  id: string;
  chapter: NarrativeChapter;
  text: string;
  status: ApprovalStatus;
  evidenceIds: readonly string[];
};

/** One explicitly approved, source-scoped public measure (never a raw audit output). */
export type EvidenceMetric = {
  id: string;
  label: string;
  value: number;
  unit: string;
  source: string;
  sourceKind: "ritual" | "official-attendance-snapshot" | "official-challenge-snapshot";
  from: string;
  to: string;
  /** Date of the source snapshot, which need not be the end of the measured period. */
  asOf: string;
  /** Do not invent a denominator where the source never provided one. */
  denominator: number | null;
  definition: string;
  calculation: string;
  /** Not a publication approval; indicates the official measure may still change. */
  provisional: boolean;
  limitations: readonly string[];
  status: ApprovalStatus;
};

/** Only explicitly approved entries are allowed to appear on the public site. */
export function approvedOnly<T extends { status: ApprovalStatus }>(
  entries: readonly T[],
): T[] {
  return entries.filter((entry) => entry.status === "approved");
}

/** User-approved BR-A narrative: published only after explicit full-text approval. */
export { narrative } from "./approved-narrative";

/**
 * Explicitly approved public *aggregate* facts (author approved 2026-10-22).
 * Historical snapshot AS OF 2026-10-21, not the latest/current figures.
 * Never import raw rituals, official attendance rows, private tags or any peer data.
 */
export const evidenceMetrics: readonly EvidenceMetric[] = [
  {
    id: "ritual-recorded-dates-2026-10-21",
    label: "리추얼 기록 날짜",
    value: 47,
    unit: "일",
    source: "본인 리추얼 JSON 내보내기 및 로컬 결정적 집계",
    sourceKind: "ritual",
    from: "2026-08-11",
    to: "2026-10-21",
    asOf: "2026-10-21",
    denominator: null,
    definition: "해당 기간 리추얼 원본에 날짜별 기록이 존재하는 날짜 수",
    calculation: "중복 없는 리추얼 날짜 레코드의 수",
    provisional: false,
    limitations: [
      "출석 일수, 매일 연속 작성, 하루의 아침·마무리 모두 완료를 뜻하지 않습니다.",
      "2026-10-21까지 검증한 과거 자료이며 이후 추가된 기록은 반영하지 않았습니다.",
    ],
    status: "approved",
  },
  {
    id: "official-present-days-2026-10-21",
    label: "공식 출석일",
    value: 45,
    unit: "일",
    source: "ALEPH Studio 공식 출석 요약 화면 · 사용자 확인 스냅샷",
    sourceKind: "official-attendance-snapshot",
    from: "2026-08-11",
    to: "2026-10-21",
    asOf: "2026-10-21",
    denominator: 47,
    definition: "재적 훈련일 47일 중 공식 출석으로 표시된 45일",
    calculation: "공식 출석 45 ÷ 재적 훈련일 47 × 100 = 95.7% (소수 첫째 자리 반올림)",
    provisional: true,
    limitations: [
      "2일은 미확정 상태이며 최종 출석 및 출석률은 달라질 수 있습니다.",
      "리추얼 기록일이나 지연 작성은 출석으로 환산하지 않았습니다.",
    ],
    status: "approved",
  },
  {
    id: "official-approved-core-2026-10-21",
    label: "핵심 과제 마스터 승인",
    value: 11,
    unit: "개",
    source: "ALEPH Studio 공식 과제 진행 화면 · 사용자 확인 스냅샷",
    sourceKind: "official-challenge-snapshot",
    from: "2026-10-21",
    to: "2026-10-21",
    asOf: "2026-10-21",
    denominator: 11,
    definition: "2026-10-21 기준 핵심 과제 11개 중 마스터 승인 11개",
    calculation: "핵심 과제 마스터 승인 11 ÷ 전체 핵심 과제 11",
    provisional: false,
    limitations: [
      "마지막 A·B 과제는 이 수치에 포함하지 않습니다.",
      "공식 과제 상태의 2026-10-21 당시 스냅샷이며 현재 진행 상황과 다를 수 있습니다.",
    ],
    status: "approved",
  },
];
