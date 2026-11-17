"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import Link from "next/link";
import { detectorMetrics, t10Research } from "@/content/research-evidence";

type Props = {
  displayName: string;
  contactEmail: string;
};

export function TraceLab({ displayName, contactEmail }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 761px)");
    const onChange = () => {
      if (media.matches) setMobileMenuOpen(false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  function onSpotlightMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spotlight-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--spotlight-y", `${event.clientY - bounds.top}px`);
  }

  return (
    <div className="trace-page portfolio-page" id="top">
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
            <a href="#projects" onClick={() => setMobileMenuOpen(false)}>프로젝트</a>
            <a href="#documents" onClick={() => setMobileMenuOpen(false)}>지원 서류</a>
            <a href="#contact" className="mobile-contact-link" onClick={() => setMobileMenuOpen(false)}>연락하기 <span aria-hidden="true">↓</span></a>
          </nav>
        </div>
      </header>

      <div className="container portfolio-layout">
        <aside className="portfolio-profile" id="about" aria-labelledby="hero-title">
          <h1 id="hero-title">{displayName}</h1>
          <p className="portfolio-role">백엔드 · 풀스택 개발자</p>
          <p className="portfolio-copy">NestJS와 PostgreSQL로 인증과 게시글 API를 구현하고 Next.js 화면과 연결했습니다.</p>
          <div className="portfolio-links">
            <Link href="/documents/resume/">이력서 보기 <span aria-hidden="true">↗</span></Link>
            <a href="https://github.com/SuperNova080710">GitHub <span aria-hidden="true">↗</span></a>
          </div>
          <nav className="portfolio-section-nav" aria-label="홈 섹션">
            <a href="#projects">프로젝트</a>
            <a href="#documents">지원 서류</a>
            <a href="#contact">연락처</a>
          </nav>
        </aside>

        <div className="portfolio-content">
          <section id="projects" aria-labelledby="projects-title">
            <h2 id="projects-title">프로젝트</h2>
            <article className="portfolio-project" id="approach" aria-labelledby="capstone-title">
              <h3 id="capstone-title">디지털 트윈 기반 스마트 캠퍼스</h3>
              <p>실제 IoT 장치와 Unreal Engine 가상 캠퍼스를 양방향으로 연결했습니다. 3D 모델링을 제외한 시스템 전반을 직접 구현했습니다.</p>
              <p className="portfolio-publication">디지털콘텐츠학회논문지 게재 · KCI 등재 · 2025</p>
              <div className="portfolio-links">
                <Link href="/projects/digital-twin/">프로젝트 상세 <span aria-hidden="true">→</span></Link>
                <a href="https://doi.org/10.9728/dcs.2025.26.12.3391">게재 논문 보기 <span aria-hidden="true">↗</span></a>
              </div>
            </article>
            <article className="portfolio-project" id="project-blog" aria-labelledby="blog-title">
              <h3 id="blog-title">Full-stack Blog</h3>
              <p>Next.js 화면과 NestJS·PostgreSQL API를 연결해 로그인, 토큰 갱신, 게시글 기능을 구현했습니다. 수정·삭제 요청은 서버에서 작성자 ID를 확인해 처리합니다.</p>
              <div className="portfolio-links">
                <a href="https://github.com/SuperNova080710/Blog-backend">백엔드 코드</a>
                <a href="https://github.com/SuperNova080710/Blog-frontend">프런트엔드 코드</a>
              </div>
              <details>
                <summary>게시글 권한 처리 상세</summary>
                <p>글을 등록할 때는 인증된 사용자로 작성자를 지정합니다. 수정 요청은 작성자에게 200, 다른 로그인 사용자에게 403, 인증 정보가 없는 요청에 401을 반환하도록 구현했습니다.</p>
                <div className="portfolio-links">
                  <a href="https://github.com/SuperNova080710/Blog-backend/blob/main/src/modules/posts/posts.service.ts">권한 검사 코드</a>
                  <a href="https://github.com/SuperNova080710/Blog-backend/blob/main/docs/api/posts.md">게시글 API 문서</a>
                </div>
              </details>
            </article>
            <article className="portfolio-project" id="project-t10" aria-labelledby="t10-title">
              <h3 id="t10-title">{t10Research.title}</h3>
              <p id="evidence">합성 평가 {t10Research.heldout.trials}건에서 여러 특징을 함께 사용한 탐지기의 정상 연결 오탐이 {t10Research.timingOnly.fp}건에서 {t10Research.multiFeature.fp}건으로 줄었습니다.</p>
              <div className="portfolio-links">
                <a href="/ech-beacon-explorer">ECH Beacon Explorer 열기 <span aria-hidden="true">↗</span></a>
              </div>
              <details>
                <summary>실험 설계와 공개 근거</summary>
                <p>합성 실험 {t10Research.totalTrials}건을 보정용과 평가용으로 사전에 나누고, 동일한 평가 표본에서 두 탐지 방식을 비교했습니다. F1은 {detectorMetrics(t10Research.timingOnly).f1.toFixed(4)}에서 {detectorMetrics(t10Research.multiFeature).f1.toFixed(4)}로 높아졌습니다. 두 방식의 재현율은 같았고, 여러 특징을 함께 쓰는 방식의 추론 비용이 더 높았습니다.</p>
                <p>결과의 범위는 단일 통제 환경입니다. 실제 운영망 성능은 별도 확인이 필요합니다.</p>
                <div className="portfolio-links" aria-label="ECH 공개 근거">
                  <a href={t10Research.sources.manuscript}>연구 원고</a>
                  <a href={t10Research.sources.evaluation}>평가 JSON</a>
                  <a href={t10Research.sources.release}>PCAP 200개</a>
                  <a href={t10Research.sources.log}>연구 기록</a>
                </div>
              </details>
            </article>
          </section>

          <section className="portfolio-end" id="documents" aria-labelledby="documents-title">
            <h2 id="documents-title">지원 서류</h2>
            <ul className="document-list" aria-label="지원 서류 열람 및 다운로드">
              <li className="document-item spotlight-card" onPointerMove={onSpotlightMove}><Link className="document-download" href="/documents/resume/">이력서 열람 <span aria-hidden="true">↗</span></Link></li>
              <li className="document-item spotlight-card" onPointerMove={onSpotlightMove}><Link className="document-download" href="/documents/personal-statement/">자기소개서 열람 <span aria-hidden="true">↗</span></Link></li>
              <li className="document-item spotlight-card" onPointerMove={onSpotlightMove}><Link className="document-download" href="/documents/project-experience/">프로젝트 경험기술서 열람 <span aria-hidden="true">↗</span></Link></li>
            </ul>
          </section>
          <section className="portfolio-end" id="contact" aria-labelledby="contact-title">
            <h2 id="contact-title">연락처</h2>
            <a className="portfolio-email" href={"mailto:" + contactEmail}>{contactEmail}</a>
          </section>
        </div>
      </div>
      <footer className="site-footer">
        <div className="container footer-inner">
          <a href="#top" className="footer-brand">TRACE<span>.</span></a>
          <p>오리온의 개발 기록</p>
          <a href="#top">맨 위로 ↑</a>
        </div>
      </footer>
    </div>
  );
}
