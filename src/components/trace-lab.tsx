"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { ApprovedNarrative, EvidenceMetric } from "@/content/public-profile";

type Dimension = "record" | "process" | "proof";

const dimensions: { id: Dimension; index: string; name: string; english: string; headline: string; description: string; symbol: string }[] = [
  {
    id: "record",
    index: "01",
    name: "기록",
    english: "RECORD",
    headline: "흩어진 시간을, 다시 읽을 수 있는 기록으로.",
    description: "시작과 마무리, 작은 행동의 반복을 기록합니다. 실제 일수와 출석률은 서로 다른 기준으로 검증합니다.",
    symbol: "◎",
  },
  {
    id: "process",
    index: "02",
    name: "과정",
    english: "PROCESS",
    headline: "정답보다, 원인에 도달하는 과정을 남깁니다.",
    description: "불확실한 문제 앞에서 가설을 세우고 확인합니다. 서사의 사실관계와 구체적인 사례는 검토 후 공개됩니다.",
    symbol: "⌁",
  },
  {
    id: "proof",
    index: "03",
    name: "근거",
    english: "PROOF",
    headline: "주장보다, 확인 가능한 결과를 연결합니다.",
    description: "논문, 코드, 재현 절차와 같은 공개 근거를 모읍니다. 검증되지 않은 수치를 성과로 게시하지 않습니다.",
    symbol: "◇",
  },
];

type TraceLabProps = {
  displayName: string;
  contactEmail: string;
  narrative: ApprovedNarrative[];
  metrics: EvidenceMetric[];
};

export function TraceLab({ displayName, contactEmail, narrative, metrics }: TraceLabProps) {
  const [active, setActive] = useState<Dimension>("record");
  const [progress, setProgress] = useState(0);
  const tabId = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const onScroll = () => {
      const maximum = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maximum > 0 ? Math.min(100, (window.scrollY / maximum) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const selected = dimensions.find((item) => item.id === active) ?? dimensions[0];

  function handleTabs(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys: Record<string, number> = { ArrowRight: (index + 1) % dimensions.length, ArrowLeft: (index - 1 + dimensions.length) % dimensions.length, Home: 0, End: dimensions.length - 1 };
    const next = keys[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setActive(dimensions[next].id);
    refs.current[next]?.focus();
  }

  return (
    <>
      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <a href="#main-view" className="skip-link">본문으로 건너뛰기</a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="TRACE 처음으로">TR<span>A</span>CE<span className="wordmark-dot">.</span></a>
        <nav aria-label="주요 메뉴" className="top-nav">
          <a href="#main-view">탐색</a>
          <a href="#evidence">근거</a>
          <a href="#contact" className="nav-contact">연락 <span aria-hidden="true">↗</span></a>
        </nav>
      </header>

      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span className="live-indicator" /> A PERSONAL RESEARCH LOG <span className="eyebrow-divider">/</span> 2026</div>
            <p className="hero-identifier">안녕하세요, <strong>{displayName}</strong>입니다.</p>
            <h1 id="hero-title">Every step<br />leaves a <em>trace.</em></h1>
            <p className="hero-subcopy">보이는 결과 뒤의 보이지 않는 과정까지.<br />기록하고, 추적하고, 증명하는 개발 포트폴리오.</p>
            <div className="hero-actions">
              <a className="primary-action" href="#main-view">기록 탐색하기 <span aria-hidden="true">↘</span></a>
              <a className="secondary-action" href="#contact">이야기 나누기 <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="signal-stage" aria-label="기록, 과정, 근거를 연결하는 TRACE 콘셉트 도식">
            <div className="signal-grid" aria-hidden="true" />
            <div className="orbit orbit-outer" aria-hidden="true" />
            <div className="orbit orbit-middle" aria-hidden="true" />
            <div className="orbit orbit-inner" aria-hidden="true" />
            <div className="core-signal" aria-hidden="true">
              <div className="core-symbol">T<span>.</span></div>
            </div>
            <span className="axis-label axis-top">POINT / 001</span>
            <span className="axis-label axis-bottom">SIGNAL: GROWTH</span>
            <span className="stage-coordinate stage-coordinate-top">37° 34&apos; 00&quot; N</span>
            <span className="stage-coordinate stage-coordinate-bottom">TRACE SYSTEM // v0.1</span>
            <span className="orbit-mark mark-first" aria-hidden="true" />
            <span className="orbit-mark mark-second" aria-hidden="true" />
          </div>
        </div>
        <div className="hero-footer" aria-hidden="true">
          <span>SCROLL TO EXPLORE</span>
          <span className="scroll-tick">↓</span>
          <span>01 — FOUNDATION</span>
        </div>
      </section>

      <section className="explore-section" id="main-view" aria-labelledby="explore-title">
        <div className="section-intro">
          <span className="section-counter">[ 01 / 03 ]</span>
          <div>
            <p className="section-eyebrow">SELECT A SIGNAL</p>
            <h2 id="explore-title">결과보다 <span>과정을 추적합니다.</span></h2>
            <p className="section-description">세 가지 관점에서 오리온의 작업 방식을 탐색하세요. 지금은 설계 단계이며, 개인의 구체적인 서사와 수치는 근거 검증 후 공개됩니다.</p>
          </div>
        </div>

        <div className="explore-console">
          <div className="console-heading"><span>TRACE / EXPLORER</span><span className="console-status"><i aria-hidden="true" /> INTERACTIVE / READY</span></div>
          <div className="tab-strip" role="tablist" aria-label="탐색 관점">
            {dimensions.map((dimension, index) => (
              <button
                key={dimension.id}
                ref={(node) => { refs.current[index] = node; }}
                id={`${tabId}-tab-${dimension.id}`}
                type="button"
                role="tab"
                aria-selected={dimension.id === active}
                aria-controls={`${tabId}-panel`}
                tabIndex={dimension.id === active ? 0 : -1}
                onClick={() => setActive(dimension.id)}
                onKeyDown={(event) => handleTabs(event, index)}
                className={`dimension-tab ${dimension.id === active ? "selected" : ""}`}
              >
                <span className="dimension-number">{dimension.index}</span>
                <span>{dimension.name}</span>
                <span className="dimension-english">{dimension.english}</span>
              </button>
            ))}
          </div>
          <div id={`${tabId}-panel`} role="tabpanel" aria-labelledby={`${tabId}-tab-${selected.id}`} className="console-body" tabIndex={0}>
            <div className="console-illustration" aria-hidden="true"><span className="dimension-glyph">{selected.symbol}</span><span className="console-illustration-label">{selected.english} / ACTIVE</span></div>
            <div className="console-copy">
              <p className="console-kicker">PERSPECTIVE / {selected.index}</p>
              <h3>{selected.headline}</h3>
              <p>{selected.description}</p>
              <span className="console-chip">NEXT PHASE / 증거 검토 중</span>
            </div>
          </div>
          <div className="console-footer"><span>SYSTEM STATUS: FOUNDATION</span><span>03 SIGNALS CONNECTED <span aria-hidden="true">↗</span></span></div>
        </div>
      </section>

      <section className="evidence-section" id="evidence" aria-labelledby="evidence-title">
        <div className="section-intro">
          <span className="section-counter">[ 02 / 03 ]</span>
          <div>
            <p className="section-eyebrow">VERIFIABLE, NOT ASSUMED</p>
            <h2 id="evidence-title">근거 없는 숫자는 <span>쓰지 않습니다.</span></h2>
            <p className="section-description">리추얼 기록, 과제 이력, 연구 결과를 날짜·원본 출처와 함께 검증합니다. 승인된 자료만 게시됩니다.</p>
          </div>
        </div>
        <div className="evidence-board">
          <div className="board-main">
            <span className="board-label">EVIDENCE PIPELINE</span>
            <div className="pipeline">
              <div><span>01</span><strong>수집</strong><small>PRIVATE INPUT</small></div>
              <span className="pipeline-arrow" aria-hidden="true">→</span>
              <div><span>02</span><strong>검증</strong><small>HUMAN REVIEW</small></div>
              <span className="pipeline-arrow" aria-hidden="true">→</span>
              <div><span>03</span><strong>공개</strong><small>APPROVED ONLY</small></div>
            </div>
            <p className="board-note">원본 기록은 비공개로 관리합니다. 공개용 문장과 지표는 작성자 승인 이후에만 반영됩니다.</p>
          </div>
          <div className="board-side">
            <span className="board-label">CURRENT STATE</span>
            <span className="state-symbol" aria-hidden="true">⌘</span>
            <strong>{metrics.length === 0 && narrative.length === 0 ? "승인 대기" : "검증된 항목 준비됨"}</strong>
            <span>{metrics.length} METRICS / {narrative.length} NOTES</span>
          </div>
        </div>
      </section>

      <section className="connect-section" id="contact" aria-labelledby="connect-title">
        <div className="section-intro">
          <span className="section-counter">[ 03 / 03 ]</span>
          <div>
            <p className="section-eyebrow">LET&apos;S CONNECT</p>
            <h2 id="connect-title">다음 흔적을 <span>함께 만들고 싶습니다.</span></h2>
            <p className="section-description">현재 Trace의 기반을 제작하고 있습니다. 공개 포트폴리오가 완성되기 전에도 이메일로 연락하실 수 있습니다.</p>
          </div>
        </div>
        <a className="email-link" href={`mailto:${contactEmail}`}>
          <span>{contactEmail}</span><span aria-hidden="true">↗</span>
        </a>
      </section>

      <footer className="site-footer">
        <a href="#top" className="footer-logo">TRACE<span>.</span></a>
        <span>오리온 / 설계 및 제작 중</span>
        <span>MADE TO KEEP TRACK.</span>
      </footer>
    </>
  );
}
