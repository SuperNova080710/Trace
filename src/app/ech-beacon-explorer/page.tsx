import type { Metadata } from "next";
import Link from "next/link";
import research from "@/content/br-b-research-contract.json";
import styles from "./explorer.module.css";
import InteractiveExplorer from "./interactive-explorer";

export const metadata: Metadata = {
  title: "ECH Beacon Explorer | TRACE",
  description: "T10 연구의 합성 Held-out 110건을 바탕으로 Timing-only·Multi-feature 탐지기의 오탐과 추론 비용을 비교하는 연구 결과 탐색 앱.",
};

const tasks = [
  {
    index: "01",
    title: "시나리오를 선택합니다",
    detail: "Beacon 지터 0·10·30·50·70% 또는 정상 트래픽 프로필별로 실험 표본을 살펴봅니다.",
    tag: "SCENARIOS",
  },
  {
    index: "02",
    title: "두 탐지기의 판정을 비교합니다",
    detail: "같은 Held-out Trial에서 Timing-only와 Multi-feature가 각각 어떤 결정을 내렸는지 확인합니다.",
    tag: "PAIRED DECISIONS",
  },
  {
    index: "03",
    title: "탐지 효과와 비용을 함께 판단합니다",
    detail: "오탐 감소와 순수 추론 비용 증가를 함께 보고, 연구가 증명한 범위와 한계를 구분합니다.",
    tag: "TRADE-OFF",
  },
] as const;

export default function ExplorerIntro() {
  const { timingOnly, multiFeature } = research.detectors;

  return (
    <main id="main-content" className={styles.root}>
      <div className={styles.shell}>
        <nav className={styles.nav} aria-label="ECH Beacon Explorer 이동">
          <Link href="/" className={styles.brand}>
            <span className={styles.brandSymbol} aria-hidden="true">T</span>
            <span>TRACE <span className={styles.brandSecondary}>/ RESEARCH LAB</span></span>
          </Link>
          <Link href="/#projects" className={styles.back}>포트폴리오로 돌아가기 <span aria-hidden="true">↗</span></Link>
        </nav>

        <section className={styles.hero} aria-labelledby="explorer-title">
          <div className={styles.heroContent}>
            <p className={styles.kicker}><span className={styles.liveDot} aria-hidden="true" /> ALEPH BR-B · T10 RESEARCH APPLICATION</p>
            <h1 id="explorer-title">
              암호화된 연결 뒤의 탐지 결과를<br />
              <span>숫자로 검증하다.</span>
            </h1>
            <p className={styles.lead}>
              ECH 환경의 HTTPS Beacon 탐지를 연구하는 <strong>보안 학습자와 분석자</strong>가
              합성 Held-out 실험 결과를 직접 살펴보며, 두 탐지기의 오탐과 처리 비용 차이를 이해하도록 돕는 앱입니다.
            </p>
            <div className={styles.heroMeta} aria-label="연구 데이터 개요">
              <span>FROZEN DATA · main-v1</span>
              <span>HELD-OUT {research.datasetCounts.heldout} TRIALS</span>
              <span>NO LOGIN REQUIRED</span>
            </div>
          </div>
          <div className={styles.heroVisual} aria-hidden="true">
            <div className={styles.orbitOuter}><div className={styles.orbitInner}><span className={styles.orbitCore}>ECH</span></div></div>
            <span className={styles.visualLabelTop}>ENCRYPTED CLIENT HELLO</span>
            <span className={styles.visualLabelBottom}>SIGNAL ≠ CERTAINTY</span>
          </div>
        </section>

        <section className={styles.paper} aria-labelledby="paper-title">
          <div>
            <p className={styles.sectionEyebrow}>01 / ORIGINAL PAPER</p>
            <h2 id="paper-title">이 앱의 근거가 되는 논문</h2>
            <p className={styles.paperTitle}>{research.title}</p>
            <p className={styles.muted}>단일 통제 환경에서 생성한 합성 HTTPS 연결을 대상으로 한 탐지기 비교 연구입니다. 실제 운영망 탐지 정확도를 입증한 결과가 아닙니다.</p>
          </div>
          <a href="https://github.com/SuperNova080710/ech-beacon-detection/blob/main/docs/paper-t10-ko.md" target="_blank" rel="noopener noreferrer" className={styles.paperLink}>논문 원문 보기 <span aria-hidden="true">↗</span></a>
        </section>

        <section className={styles.results} aria-labelledby="results-title">
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.sectionEyebrow}>02 / FIXED RESEARCH RESULT</p>
              <h2 id="results-title">같은 데이터, 다른 오탐</h2>
              <p className={styles.muted}>공개된 연구의 사전 고정 모델과 평가 결과입니다. 이 화면에서 새 모델을 학습하거나 실시간 트래픽을 판정하지 않습니다.</p>
            </div>
            <span className={styles.frozenLabel}>HELD-OUT · N = {research.datasetCounts.heldout}</span>
          </div>
          <div className={styles.metricGrid}>
            <article className={styles.metricCard}>
              <span className={styles.metricEyebrow}>TIMING-ONLY / FALSE POSITIVES</span>
              <div className={styles.metricNumber}>{timingOnly.FP}<span>건</span></div>
              <p>정상 {research.datasetCounts.heldoutNormal}건 중 오탐</p>
              <div className={styles.metricTrack}><span style={{ width: (timingOnly.FP / research.datasetCounts.heldoutNormal * 100) + "%" }} /></div>
            </article>
            <article className={styles.metricCard}>
              <span className={styles.metricEyebrow}>MULTI-FEATURE / FALSE POSITIVES</span>
              <div className={styles.metricNumber}>{multiFeature.FP}<span>건</span></div>
              <p>같은 정상 표본에서 오탐 3건 감소</p>
              <div className={styles.metricTrack}><span style={{ width: (multiFeature.FP / research.datasetCounts.heldoutNormal * 100) + "%" }} /></div>
            </article>
            <article className={styles.metricCard}>
              <span className={styles.metricEyebrow}>PURE INFERENCE / MEDIAN RATIO</span>
              <div className={styles.metricNumber}>{research.inferenceBench.ratio.toFixed(2)}<span>×</span></div>
              <p>Multi-feature가 더 높은 추론 비용을 보임</p>
              <p className={styles.metricFine}>110행 순수 추론 · 특징 추출 및 I/O 제외</p>
            </article>
          </div>
          <div className={styles.interpretation}>
            <span className={styles.interpretationMark} aria-hidden="true">!</span>
            <p>두 탐지기의 Beacon 재현율은 모두 <strong>100%</strong>였습니다. 원래 가설인 ‘고지터에서 Multi-feature의 재현율 우위’는 지지되지 않았습니다. 확인된 차이는 <strong>정상 트래픽의 오탐 감소와 계산 비용 증가</strong>입니다.</p>
          </div>
        </section>

        <section className={styles.actions} aria-labelledby="actions-title">
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.sectionEyebrow}>03 / THREE THINGS TO EXPLORE</p>
              <h2 id="actions-title">이 앱에서 할 세 가지</h2>
            </div>
            <span className={styles.stageTag}>실험 표본 탐색 가능</span>
          </div>
          <div className={styles.stepGrid}>
            {tasks.map((task) => (
              <article key={task.index} className={styles.step}>
                <span className={styles.stepNumber}>{task.index}</span>
                <span className={styles.stepTag}>{task.tag}</span>
                <h3>{task.title}</h3>
                <p>{task.detail}</p>
              </article>
            ))}
          </div>
          <p className={styles.stageNote}>아래 연구 랩에서 세 작업을 직접 수행할 수 있습니다. 예측은 T10 연구의 동결된 표본을 사용합니다.</p>
        </section>

        <InteractiveExplorer />

        <footer className={styles.footer}>
          <span>ECH BEACON EXPLORER · TRACE / ALEPH BR-B</span>
          <div>
            <a href="https://github.com/SuperNova080710/ech-beacon-detection/blob/main/results/metrics/main-v1/heldout-evaluation.json" target="_blank" rel="noopener noreferrer">평가 데이터 ↗</a>
            <Link href="/">TRACE 포트폴리오 ↗</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
