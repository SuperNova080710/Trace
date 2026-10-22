/**
 * Public, approved details only.
 * Do not import the private ritual-history JSON from this module.
 * Draft narrative, attendance, and submission metrics must remain absent.
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

/** No author-approved public activity metrics yet: leave this empty until explicit approval. */
export const evidenceMetrics: readonly EvidenceMetric[] = [];
