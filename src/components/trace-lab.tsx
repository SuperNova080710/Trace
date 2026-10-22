"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { ApprovedNarrative, EvidenceMetric } from "@/content/public-profile";
import { detectorMetrics, t10Research } from "@/content/research-evidence";

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

const projects = [{
  number: "02", type: "WEB DEVELOPMENT", title: "Full-stack Blog",
  description: "Next.js 프런트엔드와 NestJS 백엔드를 나누어 구현한 웹 프로젝트입니다. 기능과 역할은 순차적으로 보강합니다.",
  href: "https://github.com/SuperNova080710/Blog-frontend", link: "프런트엔드 코드 보기", tone: "web", monogram: "WEB",
}] as const;

export function TraceLab({ displayName, contactEmail, narrative, metrics }: Props) {
  const [expanded, setExpanded] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const storyTimelineRef = useRef<HTMLDivElement>(null);
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

      const timeline = storyTimelineRef.current;
      if (timeline) {
        const rect = timeline.getBoundingClientRect();
        const start = rect.top + 60;
        const end = rect.bottom - 60;
        const cursor = window.innerHeight * 0.52;
        const fill = end > start
          ? Math.min(1, Math.max(0, (cursor - start) / (end - start)))
          : 0;
        timeline.style.setProperty("--timeline-progress", String(fill));

        const chapters = Array.from(timeline.querySelectorAll<HTMLElement>(".story-chapter"));
        const focused = chapters.reduce((index, chapter, current) => {
          return chapter.getBoundingClientRect().top < cursor ? current : index;
        }, 0);
        chapters.forEach((chapter, index) => {
          chapter.classList.toggle("is-current", index === focused);
        });
      }
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

  // Reveal only chapter content that begins below the viewport. Without JavaScript
  // or with reduced motion enabled, the full narrative remains readable.
  useEffect(() => {
    const timeline = storyTimelineRef.current;
    if (!timeline || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const chapters = Array.from(timeline.querySelectorAll<HTMLElement>(".story-chapter"));
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in-view");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08, rootMargin: "0px 0px -8% 0px" });

    for (const chapter of chapters) {
      if (chapter.getBoundingClientRect().top > window.innerHeight * 0.88) {
        chapter.classList.add("reveal-ready");
        observer.observe(chapter);
      }
    }
    return () => observer.disconnect();
  }, []);

  // Close the mobile menu on viewport changes, without altering desktop navigation.
  useEffect(() => {
    const media = window.matchMedia("(min-width: 761px)");
    const onChange = () => {
      if (media.matches) setMobileMenuOpen(false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  // A reader may scroll through long non-interactive content while keyboard focus
  // remains in the off-screen header. Restore a visible reading position on the
  // next forward Tab; otherwise preserve the browser's native Tab order.
  useEffect(() => {
    let scrolledSinceFocus = window.scrollY > 160;

    const markScroll = () => { scrolledSinceFocus = true; };
    const resetOnFocus = () => { scrolledSinceFocus = false; };

    const handleTab = (event: globalThis.KeyboardEvent) => {
      if (
        event.key !== "Tab" || event.shiftKey || event.defaultPrevented ||
        event.altKey || event.ctrlKey || event.metaKey || !scrolledSinceFocus
      ) return;

      const active = document.activeElement;
      if (active instanceof HTMLElement && active !== document.body && active !== document.documentElement) {
        const bounds = active.getBoundingClientRect();
        // Visible controls always retain their normal sequential Tab behavior.
        if (bounds.bottom > 88 && bounds.top < window.innerHeight - 24) return;
      }

      const main = document.getElementById("main-content");
      if (!main) return;
      const readingNodes = Array.from(main.querySelectorAll<HTMLElement>(
        ".about-main p, .story-chapter-body h3, .story-chapter-body p, " +
        ".story-closing p, .ability-summary h3, .section-heading h2, " +
        ".project-content h3, .evidence-placeholder h3, .document-item strong, " +
        ".contact-inner h2"
      ));
      const visible = readingNodes
        .map((node) => ({ node, bounds: node.getBoundingClientRect() }))
        .filter(({ bounds }) => bounds.bottom > 100 && bounds.top < window.innerHeight - 44);
      const target = visible.sort((a, b) => {
        const preferred = window.innerHeight * 0.35;
        return Math.abs(a.bounds.top - preferred) - Math.abs(b.bounds.top - preferred);
      })[0]?.node;
      if (!target) return;

      // A temporary -1 target is not added to the sequential Tab order.
      // preventScroll preserves the reading position for the first Tab.
      event.preventDefault();
      const originalTabIndex = target.getAttribute("tabindex");
      target.setAttribute("tabindex", "-1");
      target.classList.add("reading-resume-focus");
      target.addEventListener("blur", () => {
        target.classList.remove("reading-resume-focus");
        if (originalTabIndex === null) target.removeAttribute("tabindex");
        else target.setAttribute("tabindex", originalTabIndex);
      }, { once: true });
      target.focus({ preventScroll: true });
      scrolledSinceFocus = false;
    };

    window.addEventListener("scroll", markScroll, { passive: true });
    document.addEventListener("focusin", resetOnFocus);
    document.addEventListener("keydown", handleTab, true);
    return () => {
      window.removeEventListener("scroll", markScroll);
      document.removeEventListener("focusin", resetOnFocus);
      document.removeEventListener("keydown", handleTab, true);
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
      <a className="skip-link" href="#main-content">본문 바로가기</a>

      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#top" aria-label="Trace 맨 위로">
            <span className="brand-mark">T<span>.</span></span>
            <span className="brand-name">TRACE <small>DEVELOPER PORTFOLIO</small></span>
          </a>
          <button
            className={mobileMenuOpen ? "menu-button is-open" : "menu-button"}
            type="button"
            ref={mobileMenuButtonRef}
            aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={mobileMenuOpen}
            aria-controls="trace-main-nav"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <span className="menu-button-lines" aria-hidden="true"><i /><i /><i /></span>
          </button>
          <nav
            className={mobileMenuOpen ? "main-nav is-open" : "main-nav"}
            id="trace-main-nav"
            aria-label="주요 메뉴"
            onKeyDown={(event) => {
              if (event.key === "Escape" && mobileMenuOpen) {
                setMobileMenuOpen(false);
                mobileMenuButtonRef.current?.focus();
              }
            }}
          >
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>소개</a>
            <a href="#approach" onClick={() => setMobileMenuOpen(false)}>작업 방식</a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)}>프로젝트</a>
            <a href="#evidence" onClick={() => setMobileMenuOpen(false)}>기록</a>
            <a href="#documents" onClick={() => setMobileMenuOpen(false)}>지원 서류</a>
            <a href="#contact" className="mobile-contact-link" onClick={() => setMobileMenuOpen(false)}>연락하기 <span aria-hidden="true">↓</span></a>
          </nav>
          <a className="header-contact" href="#contact">
            Contact <span aria-hidden="true">↓</span>
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
            <p className="hero-identity"><span aria-hidden="true" className="identity-mark" />문제의 원인을 확인하고 해결 과정을 기록으로 남기는 사람</p>
            <p className="hero-description">
              기록을 통해 지나온 과정을 이해하고,<br className="desktop-break" />
              검증 가능한 결과로 다음 단계를 준비합니다.
            </p>
            <p className="hero-note">이 페이지는 BR-A 포트폴리오 제작 중인 버전입니다. 자기소개 본문은 본인의 검토와 승인을 거쳐 반영했습니다.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">프로젝트 살펴보기 <span aria-hidden="true">↗</span></a>
              <a className="button button-outline" href="#about">소개 더 보기 <span aria-hidden="true">↓</span></a>
            </div>
            <div className="hero-tags" aria-label="핵심 주제">
              <span>Root Cause</span><span>Documentation</span><span>Verification</span>
            </div>
            <a className="hero-email" href="#contact" aria-label="하단 연락처에서 이메일 주소 확인하기">
              <span>EMAIL</span> {contactEmail} <span aria-hidden="true">↓</span>
            </a>
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
              {narrative.filter((entry) => entry.chapter === "opening").map((entry) => (
                <p className="about-lead approved-opening" key={entry.id}>{entry.text}</p>
              ))}
              <p className="about-context">2024년의 캡스톤디자인과 2026년의 문제 해결 기록을 바탕으로, 제가 무엇을 어려워했고 어떻게 접근 방식을 바꿨는지 정리했습니다.</p>
            </div>
            <aside className="about-aside spotlight-card" aria-label="프로필 요약" onPointerMove={onSpotlightMove}>
              <p className="aside-label">PROFILE</p>
              <div className="profile-row"><span>이름</span><strong>{displayName}</strong></div>
              <div className="profile-row"><span>관심 분야</span><strong>Web · Systems · Research</strong></div>
              <div className="profile-row"><span>작업 습관</span><strong>Observe → Build → Verify</strong></div>
              <div className="profile-row"><span>공개 활동</span><a href="https://github.com/SuperNova080710" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a></div>
            </aside>
          </div>

          <div className="approved-story" aria-label="오리온의 자기소개 본문">
            <div className="story-timeline-heading">
              <span className="story-timeline-eyebrow">MY JOURNEY · 2024—2026</span>
              <p>한 번에 완성된 결과가 아니라, 문제를 마주하고 다시 시도해 온 기록입니다.</p>
            </div>
            <div className="story-chapters" ref={storyTimelineRef}>
              <span className="story-timeline-fill" aria-hidden="true" />
            {([
              { id: "difficulty", number: "01", title: "막혔던 순간", subtitle: "2024 · 디지털 트윈 캡스톤" },
              { id: "turning", number: "02", title: "접근 방식을 바꾸다", subtitle: "2024–2026 · 다시 확인하고 다시 시작하기" },
              { id: "growth", number: "03", title: "지금도 남기는 기록", subtitle: "2026 · 기록, 협업, AI의 검증" },
            ] as const).map((chapter) => {
              const paragraphs = narrative.filter((entry) => entry.chapter === chapter.id);
              if (paragraphs.length === 0) return null;
              return (
                <section className="story-chapter" data-step={chapter.number} key={chapter.id} aria-labelledby={`story-${chapter.id}`}>
                  <div className="story-chapter-number" aria-hidden="true"><span>{chapter.number}</span></div>
                  <div className="story-chapter-body">
                    <p className="story-chapter-kicker">{chapter.subtitle}</p>
                    <h3 id={`story-${chapter.id}`}>{chapter.title}</h3>
                    {paragraphs.map((entry) => <p key={entry.id}>{entry.text}</p>)}
                  </div>
                </section>
              );
            })}
            </div>
            {narrative.filter((entry) => entry.chapter === "closing").map((entry) => (
              <blockquote className="story-closing" key={entry.id}>
                <span className="story-closing-label">앞으로의 방향</span>
                <p>{entry.text}</p>
              </blockquote>
            ))}
            <div className="ability-summary" aria-labelledby="abilities-title">
              <h3 id="abilities-title">경험 속 세 가지 역량</h3>
              <div className="ability-grid">
                <article>
                  <span className="ability-index">01 · SELF-REGULATION</span>
                  <h4>자기조절력</h4>
                  <p>오류가 반복될 때 시스템을 구간별로 분리하고, 원인과 현재 상태를 단계적으로 확인했습니다.</p>
                  <small>근거: 2024 캡스톤 · 2026-09-30</small>
                </article>
                <article>
                  <span className="ability-index">02 · RELATIONSHIP</span>
                  <h4>대인관계력</h4>
                  <p>팀으로 시스템을 구현하며 설명과 공유의 필요성을 배웠습니다. 구체적인 개인 역할은 추가 검증이 필요합니다.</p>
                  <small>근거: 2024 캡스톤 · 세부 행동 보완 예정</small>
                </article>
                <article>
                  <span className="ability-index">03 · MOTIVATION</span>
                  <h4>자기동기력</h4>
                  <p>이미 투자한 시간이 있어도 문제가 된 구조를 다시 시작하고, 해결 과정을 다음 작업의 지식으로 남겼습니다.</p>
                  <small>근거: 2026-09-17 · 2026-09-16</small>
                </article>
              </div>
              <p className="story-source-note">본문은 본인이 승인한 자기소개를 바탕으로 작성했습니다. 소설 T11의 허구화된 장면이나 미확인 수치는 사실처럼 사용하지 않았습니다.</p>
            </div>
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
              <p className="section-subtitle">T10의 연구 원고·평가 원본·재현 데이터를 공개 근거와 함께 확인할 수 있습니다.</p>
            </div>
          </div>
          <article className="research-feature" id="project-t10" aria-labelledby="t10-title">
            <div className="research-feature-top">
              <p className="research-eyebrow">01 / FEATURED RESEARCH · ALEPH T10 · main-v1</p>
              <h3 id="t10-title">{t10Research.title}</h3>
              <p>{t10Research.paperTitle}</p>
              <p>Native ECH 환경의 합성 HTTPS Beacon 탐지에서 Timing-only와 Multi-feature 탐지기를 비교한 연구 원고와 실험 결과입니다.</p>
            </div>
            <div className="research-numbers" aria-label="T10 평가 결과">
              <div><span>전체 합성 실험</span><strong>{t10Research.totalTrials}<small> Trials</small></strong><small>Beacon 100 · Normal 100</small></div>
              <div><span>Held-out 평가</span><strong>{t10Research.heldout.trials}<small> Trials</small></strong><small>Beacon 50 · Normal 60</small></div>
              <div><span>오탐 · Timing → Multi</span><strong>{t10Research.timingOnly.fp}<small> → </small>{t10Research.multiFeature.fp}<small>건</small></strong><small>동일 정상 표본 기준</small></div>
              <div><span>F1 · Timing → Multi</span><strong className="research-f1">{detectorMetrics(t10Research.timingOnly).f1.toFixed(4)}<small> → </small>{detectorMetrics(t10Research.multiFeature).f1.toFixed(4)}</strong><small>두 모델 Recall 1.0000</small></div>
            </div>
            <div className="research-detail">
              <div>
                <h4>상황 · 행동 · 결과</h4>
                <p><b>상황</b> ECH 환경에서 비콘의 연결 간격에 지터가 발생할 때 탐지 성능을 비교할 필요가 있었습니다.</p>
                <p><b>행동</b> Native ECH 테스트베드와 200개 Trial을 구성하고, 사전 고정된 Calibration/Held-out 분할로 두 탐지기를 평가했습니다.</p>
                <p><b>결과</b> Held-out 110개에서 Multi-feature는 정상 오탐 10건을 7건으로 줄였습니다. 두 모델 모두 Recall 1.0000으로, 고지터 재현율 우위 가설은 지지되지 않았습니다.</p>
                <p className="research-crosslink">연결 역량: <a href="#approach">원인 분석과 검증</a> · <a href="#about">성장 서사</a></p>
              </div>
              <aside aria-label="연구 결과 해석상의 한계">
                <h4>해석의 한계</h4>
                <p>단일 통제 환경의 합성 트래픽 실험입니다. 실제 악성 트래픽 및 운영망 일반화 성능을 검증한 결과가 아닙니다. Multi-feature는 추론 비용도 더 높았습니다.</p>
              </aside>
            </div>
            <div className="research-links" aria-label="T10 공개 근거">
              <a href={t10Research.sources.manuscript} target="_blank" rel="noopener noreferrer">연구 원고 <span aria-hidden="true">↗</span></a>
              <a href={t10Research.sources.evaluation} target="_blank" rel="noopener noreferrer">평가 JSON <span aria-hidden="true">↗</span></a>
              <a href={t10Research.sources.release} target="_blank" rel="noopener noreferrer">PCAP 200개 Release <span aria-hidden="true">↗</span></a>
              <a href={t10Research.sources.log} target="_blank" rel="noopener noreferrer">연구 기록 <span aria-hidden="true">↗</span></a>
            </div>
            <p className="research-footnote">T10은 별도의 연구 원고이며 이전 Digital Twin 논문과 다릅니다. 학술지 게재 실적으로 표시하지 않습니다.</p>
          </article>
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
                <span className="art-number">03 / T13 · NEXT APP</span>
                <span className="art-monogram" aria-hidden="true">NEXT</span>
              </div>
              <div className="project-content">
                <span className="project-category">UPCOMING</span>
                <h3>T13 · 차기 앱 예정</h3>
                <p>ALEPH T13 앱 과제를 위한 자리입니다. 구현·배포·성과는 확인 전이므로 준비 중으로 표시합니다.</p>
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
                  <span>집계 기간: {metric.from} ~ {metric.to}</span>
                  <dl className="metric-facts">
                    <div><dt>자료 유형</dt><dd>{({
                      ritual: "개인 리추얼 기록",
                      "official-attendance-snapshot": "공식 출석 요약",
                      "official-challenge-snapshot": "공식 과제 승인 요약",
                    } as const)[metric.sourceKind]}</dd></div>
                    <div><dt>기준일</dt><dd>{metric.asOf}</dd></div>
                    <div><dt>출처</dt><dd>{metric.source}</dd></div>
                    <div><dt>정의</dt><dd>{metric.definition}</dd></div>
                    <div><dt>산식</dt><dd>{metric.calculation}</dd></div>
                    <div><dt>분모</dt><dd>{metric.denominator === null ? "원본에 별도 분모 없음" : metric.denominator.toLocaleString("ko-KR")}</dd></div>
                  </dl>
                  {metric.provisional && (
                    <p className="metric-provisional">잠정 수치 · 공식 확정 또는 승인 상태 변경 시 재검증 필요</p>
                  )}
                  {metric.limitations.length > 0 && (
                    <ul className="metric-limitations" aria-label="해석상의 한계">
                      {metric.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="evidence-placeholder">
              <span className="evidence-icon" aria-hidden="true">↗</span>
              <div>
                <h3>검증한 기록만 보여드리겠습니다.</h3>
                <p>리추얼 기록과 공식 출석·과제 수치는 서로 다른 출처와 산식으로 검증했습니다. 다만 본인이 웹 공개를 승인하기 전에는 개인 수치를 표시하지 않으며, 확정 전 출석은 잠정값으로 다룹니다.</p>
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

      <section className="section section-white documents-section" id="documents" aria-labelledby="documents-title">
        <div className="container">
          <div className="section-heading">
            <div className="section-side"><span>05</span><span className="side-rule" /></div>
            <div>
              <p className="eyebrow">APPLICATION DOCUMENTS</p>
              <h2 id="documents-title">지원에 필요한 <span>세 가지 문서</span></h2>
              <p className="section-subtitle">이력서, 자기소개서, 프로젝트 경험기술서는 제작·검증을 마쳤고 BR-A 제출 시 비공개 파일로 제공할 예정입니다. 사이트에서는 아직 다운로드 가능한 파일이 아닙니다.</p>
            </div>
          </div>
          <div className="document-list" aria-label="서류 준비 현황">
            <div className="document-item"><span className="document-number">01</span><strong>이력서</strong><span className="document-status">제출 준비 완료 · 웹 비공개</span></div>
            <div className="document-item"><span className="document-number">02</span><strong>자기소개서</strong><span className="document-status">제출 준비 완료 · 웹 비공개</span></div>
            <div className="document-item"><span className="document-number">03</span><strong>프로젝트 경험기술서</strong><span className="document-status">제출 준비 완료 · 웹 비공개</span></div>
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
