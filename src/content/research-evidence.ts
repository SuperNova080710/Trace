/** Issue #5: metrics and evidence from publicly documented ALEPH T10 main-v1. */
export const t10Research = {
  title: "Native ECH Beacon Detection",
  paperTitle: "Native ECH 환경에서 지터가 적용된 HTTPS Beacon 트래픽의 경량 메타데이터 기반 탐지 비교",
  totalTrials: 200,
  calibrationTrials: 90,
  heldout: { trials: 110, beacon: 50, normal: 60 },
  timingOnly: { tp: 50, fp: 10, tn: 50, fn: 0 },
  multiFeature: { tp: 50, fp: 7, tn: 53, fn: 0 },
  sources: {
    manuscript: "https://github.com/SuperNova080710/ech-beacon-detection/blob/main/docs/paper-t10-ko.md",
    evaluation: "https://github.com/SuperNova080710/ech-beacon-detection/blob/main/results/metrics/main-v1/heldout-evaluation.json",
    release: "https://github.com/SuperNova080710/ech-beacon-detection/releases/tag/main-v1-pcap-v1",
    log: "https://github.com/SuperNova080710/ech-beacon-detection/blob/main/docs/research-log.md",
  },
} as const;

/** Metrics apply only to the 110 Held-out trials, not all 200 trials. */
export function detectorMetrics(counts: { tp: number; fp: number; tn: number; fn: number }) {
  const precision = counts.tp / (counts.tp + counts.fp);
  const recall = counts.tp / (counts.tp + counts.fn);
  return {
    f1: (2 * precision * recall) / (precision + recall),
    recall,
    fpr: counts.fp / (counts.fp + counts.tn),
  };
}
