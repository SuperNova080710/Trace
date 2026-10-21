"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { ApprovedNarrative, EvidenceMetric } from "@/content/public-profile";

type Props = {
  displayName: string;
  contactEmail: string;
  narrative: ApprovedNarrative[];
  metrics: EvidenceMetric[];
};

const approaches = [
  {
    number: "01",
    title: "문제의 원인을 추적합니다",
    lead: "당장의 오류보다 문제가 발생한 흐름을 먼저 이해합니다.",
    description:
      "관찰한 현상과 재현 조건을 구분하고, 로그와 요청·응답 흐름을 확인하면서 원인을 좁혀 갑니다. 구체적인 사례와 결과는 사실 확인 후 이 영역에 연결합니다.",
    tags: ["문제 분석", "원인 추적"],
  },
  {
    number: "02",
    title: "과정을 작게 나누어 기록합니다",
    lead: "작은 변경도 나중에 다시 설명할 수 있도록 남깁니다.",
    description:
      "Issue로 작업 범위를 나누고 변경 이유와 검증 결과를 Commit·Pull Request에 기록하는 방식을 사용합니다. 누구나 작업의 맥락을 따라갈 수 있는 구조를 지향합니다.",
    tags: ["Issue / PR", "문서화"],
  },
  {
    number: "03",
    title: "검증 가능한 결과를 남깁니다",
    lead: "완료했다는 말보다 다시 확인할 수 있는 근거를 중요하게 생각합니다.",
    description:
      "테스트 결과와 공개 코드를 근거로 연결합니다. 개인 기록이나 활동 수치는 원본·기간·계산 방법을 확인하고 공개 승인을 거친 경우에만 게시합니다.",
    tags: ["테스트", "재현"],
  },
] as const;

const projects = [
  {
    number: "01",
    type: "RESEARCH",
    title: "ECH Beacon Detection",
    description: "암호화된 연결 환경의 비콘 탐지에 관한 연구 코드와 실험 기록입니다. 논문 및 성과의 세부 설명은 검증 후 추가합니다.",
    href: "https://github.com/SuperNova080710/ech-beacon-detection",
    link: "연구 저장소 보기",
    tone: "research",
    monogram: "ECH",
  },
  {
    number: "02",
    type: "WEB DEVELOPMENT",
    title: "Full-stack Blog",
    description: "Next.js 프런트엔드와 NestJS 백엔드를 나누어 구현한 웹 프로젝트입니다. 기능과 역할에 대한 상세 내용은 순차적으로 보강합니다.",
    href: "https://github.com/SuperNova080710/Blog-frontend",
    link: "프런트엔드 코드 보기",
    tone: "web",
    monogram: "WEB",
  },
] as const;

export function TraceLab({ displayName, contactEmail, narrative, metrics }: Props) {
  const [expanded, setExpanded] = useState<number | null>(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const indicator = progressRef.current;
    if (!indicator) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const maximum = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = maximum > 0 ? Math.min(1, Math.max(0, window.scrollY / maximum)) : 1;
      indicator.style.transform = "scaleX(" + ratio + ")";
    };
    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(schedule)
      : null;
    observer?.observe(document.body);
    update();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // Pointer coordinates are written to CSS variables without triggering React re-renders.
  // The overlay remains decorative and is disabled for reduced-motion users in CSS.
  function onSpotlightMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spotlight-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--spotlight-y", `${event.clientY - bounds.top}px`);
  }

  function onApproachKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    let next: number;
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        next = (index + 1) % approaches.length;
        break;
      case "ArrowUp":
      case "ArrowLeft":
        next = (index - 1 + approaches.length) % approaches.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = approaches.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    triggersRef.current[next]?.focus();
  }

  return (
    <div className="trace-page" id="top">
      <div className="reading-progress" ref={progressRef} aria-hidden="true" />
      <a className="skip-link" href="#about">본문 바로가기</a>

      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#top" aria-label="Trace 맨 위로">
            <span className="brand-mark">T<span>.</span></span>
            <span className="brand-name">TRACE <small>DEVELOPER PORTFOLIO</small></span>
          </a>
          <nav className="main-nav" aria-label="주요 메뉴">
            <a href="#about">소개</a>
            <a href="#approach">작업 방식</a>
            <a href="#projects">프로젝트</a>
            <a href="#evidence">기록</a>
          </nav>
          <a className="header-contact" href={"mailto:" + contactEmail}>
            Contact <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-glow" aria-hidden="true" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow light"><span className="eyebrow-line" /> DEVELOPER · PERSONAL ARCHIVE</p>
            <p className="hero-hello">안녕하세요. 개발자 <strong>{displayName}</strong>입니다.</p>
            <h1 id="hero-title">문제의 흐름을 읽고,<span>과정으로 답을 찾습니다.</span></h1>
            <p className="hero-description">
              기록을 통해 지나온 과정을 이해하고,<br className="desktop-break" />
              검증 가능한 결과로 다음 단계를 준비합니다.
            </p>
            <p className="hero-note">이 페이지는 BR-A 포트폴리오 제작 중인 버전입니다. 최종 자기소개 문장은 본인 승인 후 추가됩니다.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">프로젝트 살펴보기 <span aria-hidden="true">↗</span></a>
              <a className="button button-outline" href="#about">소개 더 보기 <span aria-hidden="true">↓</span></a>
            </div>
            <div className="hero-tags" aria-label="핵심 주제">
              <span>Root Cause</span><span>Documentation</span><span>Verification</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="문제의 관찰, 분석, 검증을 순서대로 정리한 과정 카드">
            <div className="trace-panel spotlight-card" onPointerMove={onSpotlightMove}>
              <div className="trace-panel-top">
                <span className="window-dots" aria-hidden="true"><i /><i /><i /></span>
                <span>trace / workflow</span>
                <span className="panel-status">● ACTIVE</span>
              </div>
              <div className="trace-panel-body">
                <div className="trace-panel-intro">How I approach problems</div>
                <div className="trace-step">
                  <span className="trace-step-index">01</span>
                  <div><strong>Observe</strong><small>현상을 정확히 파악합니다.</small></div>
                  <span className="step-check" aria-hidden="true">✓</span>
                </div>
                <div className="trace-connector" aria-hidden="true" />
                <div className="trace-step">
                  <span className="trace-step-index">02</span>
                  <div><strong>Understand</strong><small>원인과 흐름을 분석합니다.</small></div>
                  <span className="step-check" aria-hidden="true">✓</span>
                </div>
                <div className="trace-connector" aria-hidden="true" />
                <div className="trace-step">
                  <span className="trace-step-index">03</span>
                  <div><strong>Verify</strong><small>검증하고 기록으로 남깁니다.</small></div>
                  <span className="step-check" aria-hidden="true">✓</span>
                </div>
              </div>
              <div className="trace-panel-bottom"><span>TRACE / WORKFLOW</span><span>BUILD WITH EVIDENCE</span></div>
            </div>
          </div>
        </div>
        <div className="container hero-bottom"><span>작은 과정이 모여 한 사람의 기록이 됩니다.</span><a href="#about">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a></div>
      </section>

      <section className="section section-white" id="about" aria-labelledby="about-title">
        <div className="container">
          <div className="section-heading">
            <div className="section-side"><span>01</span><span className="side-rule" /></div>
            <div>
              <p className="eyebrow">ABOUT ME</p>
              <h2 id="about-title">제가 중요하게 생각하는 것은<br /><span>문제를 풀어내는 과정입니다.</span></h2>
            </div>
          </div>
          <div className="about-grid">
            <div className="about-main">
              <p className="about-lead">답을 빨리 찾는 것만큼,<br />그 답에 어떻게 도달했는지 설명할 수 있어야 한다고 생각합니다.</p>
              <p>
                개발 과정에서 새로운 기술을 만날 때마다 작게 나누어 이해하고, 막히는 지점은 기록으로 남기려 합니다.
                경험이 쌓일수록 중요한 것은 단순한 결과보다 다시 재현하고 설명할 수 있는 과정이라고 느낍니다.
              </p>
              <p className="pending-copy">T09·T11 원고와 실제 기록을 대조한 자기소개 본문은 사용자 검토 후 추가할 예정입니다.</p>
              {narrative.length > 0 && (
                <div className="approved-notes" aria-label="승인된 자기소개 문단">
                  {narrative.map((entry) => <p key={entry.id}>{entry.text}</p>)}
                </div>
              )}
            </div>
            <aside className="about-aside spotlight-card" aria-label="프로필 요약" onPointerMove={onSpotlightMove}>
              <p className="aside-label">PROFILE</p>
              <div className="profile-row"><span>이름</span><strong>{displayName}</strong></div>
              <div className="profile-row"><span>관심 분야</span><strong>Web · Systems · Research</strong></div>
              <div className="profile-row"><span>작업 습관</span><strong>Observe → Build → Verify</strong></div>
              <div className="profile-row"><span>공개 활동</span><a href="https://github.com/SuperNova080710" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a></div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section section-tint" id="approach" aria-labelledby="approach-title">
        <div className="container">
          <div className="section-heading">
            <div className="section-side"><span>02</span><span className="side-rule" /></div>
            <div>
              <p className="eyebrow">HOW I WORK</p>
              <h2 id="approach-title">제가 일하는 <span>세 가지 방식</span></h2>
              <p className="section-subtitle">각 항목을 선택하면 구체적인 접근 방식을 확인할 수 있습니다.</p>
            </div>
          </div>
          <div className="approach-list" aria-label="작업 방식 자세히 보기">
            {approaches.map((item, index) => {
              const isOpen = expanded === index;
              const contentId = "approach-detail-" + index;
              return (
                <article className={"approach-item" + (isOpen ? " is-open" : "")} key={item.number}>
                  <h3>
                    <button
                      ref={(node) => { triggersRef.current[index] = node; }}
                      className="approach-trigger"
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={contentId}
                      onClick={() => setExpanded(isOpen ? null : index)}
                      onKeyDown={(event) => onApproachKeyDown(event, index)}
                    >
                      <span className="approach-number">{item.number}</span>
                      <span className="approach-title">{item.title}</span>
                      <span className="approach-toggle" aria-hidden="true">
                        <span className="toggle-stroke toggle-horizontal" />
                        <span className="toggle-stroke toggle-vertical" />
                      </span>
                    </button>
                  </h3>
                  <div className="approach-detail" id={contentId} aria-hidden={!isOpen}>
                    <div className="approach-detail-inner">
                      <div className="approach-detail-content">
                        <p className="approach-lead">{item.lead}</p>
                        <p>{item.description}</p>
                        <div className="approach-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section-white" id="projects" aria-labelledby="projects-title">
        <div className="container">
          <div className="section-heading">
            <div className="section-side"><span>03</span><span className="side-rule" /></div>
            <div>
              <p className="eyebrow">SELECTED WORK</p>
              <h2 id="projects-title">결과를 확인할 수 있는 <span>프로젝트</span></h2>
              <p className="section-subtitle">공개 저장소를 통해 실제 작업을 확인할 수 있습니다. 상세 성과는 출처 검증 후 작성합니다.</p>
            </div>
          </div>
          <div className="project-grid">
            {projects.map((project) => (
              <article className="project-card spotlight-card" key={project.number} onPointerMove={onSpotlightMove}>
                <div className={"project-art project-art-" + project.tone}>
                  <span className="art-number">{project.number} / {project.type}</span>
                  <span className="art-monogram" aria-hidden="true">{project.monogram}</span>
                  <span className="art-corner" aria-hidden="true">↗</span>
                </div>
                <div className="project-content">
                  <span className="project-category">{project.type}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <a href={project.href} target="_blank" rel="noopener noreferrer">
                    {project.link} <span aria-hidden="true">↗</span><span className="sr-only"> (새 탭)</span>
                  </a>
                </div>
              </article>
            ))}
            <article className="project-card project-future spotlight-card" onPointerMove={onSpotlightMove}>
              <div className="project-art project-art-future">
                <span className="art-number">03 / NEXT CHAPTER</span>
                <span className="art-monogram" aria-hidden="true">NEXT</span>
              </div>
              <div className="project-content">
                <span className="project-category">UPCOMING</span>
                <h3>다음 프로젝트를 위한 자리</h3>
                <p>향후 공개할 애플리케이션을 위한 영역입니다. 아직 구현되거나 검증된 성과로 표기하지 않습니다.</p>
                <span className="future-label">준비 중</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-tint" id="evidence" aria-labelledby="evidence-title">
        <div className="container">
          <div className="section-heading">
            <div className="section-side"><span>04</span><span className="side-rule" /></div>
            <div>
              <p className="eyebrow">GROWTH & EVIDENCE</p>
              <h2 id="evidence-title">기록은 숫자가 아니라 <span>근거와 함께</span></h2>
              <p className="section-subtitle">리추얼 기록과 출석, 과제 수행은 각각 다른 기준으로 집계한 뒤 공개합니다.</p>
            </div>
          </div>
          {metrics.length > 0 ? (
            <div className="metrics-grid">
              {metrics.map((metric) => (
                <article className="metric-card" key={metric.id}>
                  <p>{metric.label}</p>
                  <strong>{metric.value.toLocaleString("ko-KR")} <small>{metric.unit}</small></strong>
                  <span>{metric.from} ~ {metric.to}</span>
                  <small>출처: {metric.source}</small>
                </article>
              ))}
            </div>
          ) : (
            <div className="evidence-placeholder">
              <span className="evidence-icon" aria-hidden="true">↗</span>
              <div>
                <h3>검증한 기록만 보여드리겠습니다.</h3>
                <p>날짜, 집계 기준, 원본 출처를 확인 중입니다. 승인되지 않은 개인 기록이나 미확인 출석 수치를 임의로 표시하지 않습니다.</p>
              </div>
              <span className="evidence-badge">DATA REVIEW</span>
            </div>
          )}
          <div className="evidence-links">
            <span>공개 활동 근거</span>
            <a href="https://github.com/SuperNova080710/ech-beacon-detection" target="_blank" rel="noopener noreferrer">T10 연구 기록 <span aria-hidden="true">↗</span><span className="sr-only"> (새 탭)</span></a>
            <a href="https://github.com/SuperNova080710/Blog-backend" target="_blank" rel="noopener noreferrer">Backend 코드 <span aria-hidden="true">↗</span><span className="sr-only"> (새 탭)</span></a>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact" aria-labelledby="contact-title">
        <div className="container contact-inner">
          <div>
            <p className="eyebrow light">CONTACT</p>
            <h2 id="contact-title">함께 이야기할 준비가 되어 있습니다.</h2>
            <p>프로젝트, 협업 또는 궁금한 점이 있다면 편하게 연락해 주세요.</p>
          </div>
          <a className="contact-mail" href={"mailto:" + contactEmail}>{contactEmail} <span aria-hidden="true">↗</span></a>
        </div>
      </section>
      <footer className="site-footer">
        <div className="container footer-inner">
          <a href="#top" className="footer-brand">TRACE<span>.</span></a>
          <p>오리온의 개발 기록 · 제작 중</p>
          <a href="#top">맨 위로 ↑</a>
        </div>
      </footer>
    </div>
  );
}
