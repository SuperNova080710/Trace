import type { Metadata } from "next";
import Link from "next/link";
import study from "@/content/br-b-research-contract.json";
import styles from "./page.module.css";

const sourceRoot =
  "https://github.com/" +
  study.source.repository +
  "/blob/" +
  study.source.commit;

export const metadata: Metadata = {
  title: "ECH Beacon Explorer | TRACE",
  description:
    "T10의 합성 Native ECH HTTPS Beacon 탐지 실험에서 두 탐지기의 동결 판정, 정상 오탐과 추론 비용 차이를 살펴보는 공개 연구 앱.",
  robots: { index: true, follow: true },
};

export default function EchBeaconExplorer() {
  const timing = study.detectors.timingOnly;
  const multi = study.detectors.multiFeature;

  return (
    <div className={styles.page}>
      <a href="#explorer-main" className={styles.skipLink}>본문으로 건너뛰기</a>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand} aria-label="TRACE 포트폴리오 홈으로 이동">TRACE<span>.</span></Link>
          <span className={styles.headerSeparator} aria-hidden="true">/</span>
          <span className={styles.headerName}>ECH Beacon Explorer</span>
          <span className={styles.headerStatus}>RESEARCH APPLICATION · BR-B</span>
        </div>
      </header>

      <main id="explorer-main" tabIndex={-1} className={styles.main}>
        <section className={styles.hero} aria-labelledby="explorer-title">
          <div className={styles.heroCopy}>
            <p className={styles.kicker}><span aria-hidden="true" className={styles.kickerDot} />T10 RESEARCH → INTERACTIVE APPLICATION</p>
            <h1 id="explorer-title" className={styles.title}>ECH Beacon <span>Explorer.</span></h1>
            <p className={styles.paperLabel}>적용 논문 · T10 / MAIN-V1</p>
            <h2 className={styles.paperTitle}>{study.title}</h2>
            <p className={styles.valueStatement}>
              이 앱은 <strong>보안 학습자와 트래픽 분석자</strong>가 논문의 합성 HTTPS Beacon 실험을 살펴보며,
              Timing-only와 Multi-feature의 <strong>판정·정상 오탐·추론 비용</strong> 차이를 이해하도록 돕습니다.
            </p>
            <p className={styles.safety}>
              실제 악성 트래픽이나 운영망을 실시간 탐지하는 서비스가 아닙니다.
              T10 논문에서 동결한 합성 Held-out 실험 결과만 다룹니다.
            </p>
            <div className={styles.researchLinks} aria-label="연구 원문과 검증 자료">
              <a href={sourceRoot + "/docs/paper-t10-ko.md"} target="_blank" rel="noopener noreferrer">
                연구 원문 <span aria-hidden="true">↗</span>
              </a>
              <a href={sourceRoot + "/" + study.source.paths.evaluation} target="_blank" rel="noopener noreferrer">
                평가 원본 JSON <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <aside className={styles.snapshot} aria-label="논문에서 검증된 Held-out 실험 결과">
            <div className={styles.snapshotHeader}>
              <span>FROZEN RESEARCH SNAPSHOT</span>
              <span>MAIN-V1</span>
            </div>
            <div className={styles.snapshotMain}>
              <p>동결된 Held-out 평가</p>
              <strong>{study.datasetCounts.heldout}<small> Trials</small></strong>
              <span>Beacon {study.datasetCounts.heldoutBeacon} · Normal {study.datasetCounts.heldoutNormal}</span>
            </div>
            <div className={styles.snapshotStats}>
              <div>
                <span>정상 오탐 비교</span>
                <strong>{timing.FP} <small>→</small> {multi.FP}<small>건</small></strong>
                <small>동일한 정상 {study.datasetCounts.heldoutNormal}개 표본 기준</small>
              </div>
              <div>
                <span>순수 추론 시간 비율</span>
                <strong>{study.inferenceBench.ratio.toFixed(2)}<small>×</small></strong>
                <small>Multi-feature / Timing-only · 110행 배치</small>
              </div>
            </div>
            <p className={styles.snapshotFootnote}>
              두 탐지기 모두 Beacon Recall 1.0000. 고지터 조건에서 Multi-feature의 Recall 우위 가설은 지지되지 않았습니다.
            </p>
          </aside>
        </section>

        <section className={styles.section} aria-labelledby="steps-title">
          <div className={styles.sectionHeader}>
            <p className={styles.sectionLabel}>HOW TO EXPLORE · 3 ACTIONS</p>
            <h2 id="steps-title">실험을 이해하는 세 가지 동작</h2>
            <p>아래는 앱에 구현할 사용 흐름입니다. 현재 버전은 연구 설명 첫 화면이며, 사례 선택과 실제 판정 탐색 기능은 후속 단계에서 연결됩니다.</p>
          </div>
          <ol className={styles.steps}>
            <li>
              <span className={styles.stepIndex} aria-hidden="true">01</span>
              <h3>실험 시나리오 선택</h3>
              <p>Beacon 지터 0·10·30·50·70% 또는 정상 트래픽 유형에서 사례를 고릅니다.</p>
            </li>
            <li>
              <span className={styles.stepIndex} aria-hidden="true">02</span>
              <h3>같은 Trial의 판정 비교</h3>
              <p>두 탐지기의 동결된 0/1 판정과 실제 합성 라벨을 분리해 비교합니다.</p>
            </li>
            <li>
              <span className={styles.stepIndex} aria-hidden="true">03</span>
              <h3>정확도와 비용 해석</h3>
              <p>오탐 10→7 감소와 순수 추론 17.53배 비용의 교환 관계를 확인합니다.</p>
            </li>
          </ol>
        </section>

        <section className={styles.limitSection} aria-labelledby="limits-title">
          <div>
            <p className={styles.sectionLabel}>EVIDENCE & LIMITATIONS</p>
            <h2 id="limits-title">연구의 범위를 벗어나지 않습니다.</h2>
          </div>
          <div className={styles.limitCopy}>
            <p>이 앱의 근거는 <strong>단일 통제 실험 환경의 합성 HTTPS 트래픽</strong>입니다. Held-out {study.datasetCounts.heldout}건의 고정 결과이며, 실제 악성 C2 탐지 성능이나 운영망 일반화를 검증한 수치가 아닙니다.</p>
            <p>지터별 비교에서는 동일 정상 60건을 재사용합니다. 순수 추론 벤치마크에는 패킷 캡처, PCAP 파싱, 특징 추출, 파일 입출력이 포함되지 않습니다.</p>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>TRACE / ECH BEACON EXPLORER</span>
        <Link href="/">포트폴리오로 돌아가기 <span aria-hidden="true">↗</span></Link>
      </footer>
    </div>
  );
}
