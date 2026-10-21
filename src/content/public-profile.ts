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

export type ApprovedNarrative = {
  id: string;
  text: string;
  status: ApprovalStatus;
  evidenceIds: readonly string[];
};

export type EvidenceMetric = {
  id: string;
  label: string;
  value: number;
  unit: string;
  source: string;
  from: string;
  to: string;
  status: ApprovalStatus;
};

/** Only explicitly approved entries are allowed to appear on the public site. */
export function approvedOnly<T extends { status: ApprovalStatus }>(
  entries: readonly T[],
): T[] {
  return entries.filter((entry) => entry.status === "approved");
}

/** Populated after review in issues #2 and #4. Never publish drafts. */
export const narrative: readonly ApprovedNarrative[] = [];
export const evidenceMetrics: readonly EvidenceMetric[] = [];
