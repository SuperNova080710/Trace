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
    <div className="trace-page" id="top">
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
          <a className="header-contact" href="#contact">
            Contact <span aria-hidden="true">↓</span>
          </a>
        </div>
      </header>

      <section id="about" className="hero" aria-labelledby="hero-title">
        <div className="hero-glow" aria-hidden="true" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <h1 id="hero-title">{displayName}<span>백엔드 · 풀스택 개발자</span></h1>
            <p className="hero-description">NestJS와 PostgreSQL로 인증과 게시글 API를 구현하고 Next.js 화면과 연결했습니다. 연동 오류가 생기면 데이터가 흐르는 구간을 나눠 원인을 확인합니다.</p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/documents/resume/">이력서 보기 <span aria-hidden="true">↗</span></Link>
              <a className="button button-outline" href="https://github.com/SuperNova080710">GitHub <span aria-hidden="true">↗</span></a>
            </div>
          </div>

          <div className="hero-visual" aria-label="Full-stack Blog 게시글 수정 권한 처리">
            <div className="trace-panel spotlight-card" onPointerMove={onSpotlightMove}>
              <div className="trace-panel-top">
                <span className="window-dots" aria-hidden="true"><i /><i /><i /></span>
                <span>Full-stack Blog</span>
              </div>
              <div className="trace-panel-body">
                <div className="trace-panel-intro">게시글 수정 권한 처리</div>
                <div className="trace-step">
                  <span className="trace-step-index">01</span>
                  <div><strong>인증</strong><small>JWT로 요청을 보낸 사용자를 확인합니다.</small></div>
                  <span className="step-check" aria-hidden="true">✓</span>
                </div>
                <div className="trace-connector" aria-hidden="true" />
                <div className="trace-step">
                  <span className="trace-step-index">02</span>
                  <div><strong>작성자 확인</strong><small>서버에서 게시글 작성자와 요청 사용자를 비교합니다.</small></div>
                  <span className="step-check" aria-hidden="true">✓</span>
                </div>
                <div className="trace-connector" aria-hidden="true" />
                <div className="trace-step">
                  <span className="trace-step-index">03</span>
                  <div><strong>저장 또는 거부</strong><small>작성자면 수정하고, 다른 사용자에게는 403을 반환합니다.</small></div>
                  <span className="step-check" aria-hidden="true">✓</span>
                </div>
              </div>
              <div className="trace-panel-bottom"><a href="#project-blog">Full-stack Blog 사례 보기 →</a></div>
            </div>
          </div>
        </div>
      </section>


      <section className="section section-white" id="projects" aria-labelledby="projects-title">
        <div className="container">
          <div className="section-heading">
            <div className="section-side"><span>01</span><span className="side-rule" /></div>
            <div><h2 id="projects-title">프로젝트</h2></div>
          </div>

          <article className="research-feature" id="project-blog" aria-labelledby="blog-title">
            <div className="research-feature-top">
              <h3 id="blog-title">Full-stack Blog</h3>
              <p>Next.js 화면과 NestJS·PostgreSQL API를 연결해 로그인, 토큰 갱신, 게시글 작성·조회·수정·삭제를 구현했습니다.</p>
            </div>
            <div className="research-detail">
              <div>
                <h4>게시글 수정 권한을 서버에서 확인</h4>
                <p>조회는 공개하고, 수정·삭제는 작성자에게만 허용했습니다. 글을 등록할 때는 인증된 사용자로 작성자를 지정하고, 수정·삭제할 때는 서비스에서 저장된 작성자 ID와 요청한 사용자 ID를 비교합니다.</p>
              </div>
              <aside aria-label="코드와 API 문서에서 확인한 동작">
                <h4>권한별 API 응답</h4>
                <p>수정 요청은 작성자에게 200, 다른 로그인 사용자에게 403, 인증 정보가 없는 요청에 401을 반환하도록 구현했습니다.</p>
              </aside>
            </div>
            <div className="research-links" aria-label="Full-stack Blog 코드와 문서">
              <a href="https://github.com/SuperNova080710/Blog-backend">백엔드 저장소</a>
              <a href="https://github.com/SuperNova080710/Blog-frontend">프런트엔드 저장소</a>
              <a href="https://github.com/SuperNova080710/Blog-backend/blob/main/src/modules/posts/posts.service.ts">작성자 권한 검사 코드</a>
              <a href="https://github.com/SuperNova080710/Blog-backend/blob/main/docs/api/posts.md">게시글 API 문서</a>
            </div>
          </article>

          <article className="research-feature" id="approach" aria-labelledby="capstone-title">
            <div className="research-feature-top">
              <h3 id="capstone-title">디지털 트윈 캡스톤</h3>
              <p>2024년 팀 프로젝트에서 실제 장치의 상태를 Unreal Engine에 반영하고, 가상 공간에서 장치를 제어하는 시스템을 시연했습니다.</p>
            </div>
            <div className="research-detail">
              <div>
                <h4>연동 오류를 구간별로 확인</h4>
                <p>MQTT 메시지 지연과 연동 오류가 반복되자, ESP32 → 네트워크 → 서버 → Unreal Engine 흐름을 나눠 각 구간이 정상 동작하는지 확인했습니다.</p>
              </div>
              <aside aria-label="팀 결과">
                <h4>최종 시연</h4>
                <p>팀은 장치 상태 반영과 제어가 이어지는 시연 시스템을 완성했습니다.</p>
              </aside>
            </div>
          </article>

          <article className="research-feature" id="project-t10" aria-labelledby="t10-title">
            <div className="research-feature-top">
              <h3 id="t10-title">{t10Research.title}</h3>
              <p id="evidence">합성 평가 {t10Research.heldout.trials}건에서 두 탐지 방식을 비교한 결과, 정상 연결 오탐이 {t10Research.timingOnly.fp}건에서 {t10Research.multiFeature.fp}건으로 줄었습니다.</p>
            </div>
            <div className="research-links" aria-label="ECH 연구 앱">
              <a href="/ech-beacon-explorer">ECH Beacon Explorer 열기 <span aria-hidden="true">↗</span></a>
            </div>
            <details className="project-content">
              <summary>실험 설계와 공개 근거</summary>
              <div>
                <p>합성 실험 {t10Research.totalTrials}건을 보정용과 평가용으로 사전에 나누고, 동일한 평가 표본에서 두 탐지 방식을 비교했습니다. F1은 {detectorMetrics(t10Research.timingOnly).f1.toFixed(4)}에서 {detectorMetrics(t10Research.multiFeature).f1.toFixed(4)}로 높아졌습니다. 두 방식의 재현율은 같았고, 여러 특징을 함께 쓰는 방식의 추론 비용이 더 높았습니다.</p>
                <p>결과의 범위는 단일 통제 환경입니다. 실제 운영망 성능은 별도 확인이 필요합니다.</p>
                <div className="research-links" aria-label="ECH 공개 근거">
                  <a href={t10Research.sources.manuscript}>연구 원고</a>
                  <a href={t10Research.sources.evaluation}>평가 JSON</a>
                  <a href={t10Research.sources.release}>PCAP 200개</a>
                  <a href={t10Research.sources.log}>연구 기록</a>
                </div>
              </div>
            </details>
          </article>
        </div>
      </section>

      <section className="section section-white documents-section" id="documents" aria-labelledby="documents-title">
        <div className="container">
          <div className="section-heading">
            <div className="section-side"><span>05</span><span className="side-rule" /></div>
            <div>
              <p className="eyebrow">APPLICATION DOCUMENTS</p>
              <h2 id="documents-title">지원에 필요한 <span>세 가지 문서</span></h2>
              <p className="section-subtitle">메모리얼 파크의 경험 기록과 검증된 프로젝트 성과를 바탕으로 작성한 공개용 지원 문서입니다. 각 문서를 바로 읽거나 파일로 내려받고, PDF로 저장할 수 있습니다.</p>
            </div>
          </div>
          <div className="document-list" aria-label="지원 서류 열람 및 다운로드">
            <div className="document-item spotlight-card" onPointerMove={onSpotlightMove}><span className="document-number">01</span><strong>이력서</strong><Link className="document-download" href="/documents/resume/">이력서 열람 <span aria-hidden="true">↗</span></Link></div>
            <div className="document-item spotlight-card" onPointerMove={onSpotlightMove}><span className="document-number">02</span><strong>자기소개서</strong><Link className="document-download" href="/documents/personal-statement/">자기소개서 열람 <span aria-hidden="true">↗</span></Link></div>
            <div className="document-item spotlight-card" onPointerMove={onSpotlightMove}><span className="document-number">03</span><strong>프로젝트 경험기술서</strong><Link className="document-download" href="/documents/project-experience/">프로젝트 경험기술서 열람 <span aria-hidden="true">↗</span></Link></div>
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
          <p>오리온의 개발 기록</p>
          <a href="#top">맨 위로 ↑</a>
        </div>
      </footer>
    </div>
  );
}
