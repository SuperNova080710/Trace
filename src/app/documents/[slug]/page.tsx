import type { Metadata } from "next";
import { BrandMark } from "@/components/brand-mark";
import { RouteLink } from "@/components/route-link";
import { applicationDocuments, getApplicationDocument } from "@/content/application-documents";
import { DocumentActions } from "@/components/document-actions";
import "./document.css";

export function generateStaticParams() {
  return applicationDocuments.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const document = getApplicationDocument(slug);
  return { title: document ? `${document.title} | TRACE` : "지원 문서 | TRACE", description: document?.summary };
}

export default async function ApplicationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const document = getApplicationDocument(slug);
  if (!document) return null;

  return (
    <main className="application-page trace-route-panel">
      <header className="application-header">
        <RouteLink href={`/#document-${slug}`} className="application-back">
          <BrandMark />
          <span><span aria-hidden="true">←</span> 지원 서류로 돌아가기</span>
        </RouteLink>
        <span>APPLICATION DOCUMENTS / 2026</span>
      </header>
      <div className="application-layout">
        <aside className="application-sidebar" aria-label="문서 선택">
          <p>지원 서류</p>
          <nav>
            {applicationDocuments.map((item, i) => (
              <RouteLink className={item.slug === slug ? "selected" : ""} aria-current={item.slug === slug ? "page" : undefined}
                    key={item.slug} href={`/documents/${item.slug}/`}>
                <span>0{i + 1}</span>{item.title}
              </RouteLink>
            ))}
          </nav>
          <p className="application-disclaimer">공개용 이름으로 작성된 개발자 지원 문서입니다. 기업별 지원 시 연락처·지원 직무를 확인하세요.</p>
        </aside>
        <div className="application-main">
          <div className="application-intro">
            <p className="application-kicker">TRACE / CAREER PROFILE</p>
            <h1>{document.title}</h1>
            <p className="application-subtitle">{document.subtitle}</p>
            <p className="application-summary">{document.summary}</p>
          </div>
          <DocumentActions title={document.title} slug={document.slug} />
          <article id="application-document" className="application-paper">
            <div className="paper-header"><strong>TRACE.</strong><span>APPLICATION DOCUMENTS</span></div>
            <div className="paper-heading"><p>BACKEND · FULL-STACK DEVELOPMENT</p><h2>{document.title}</h2><span>{document.subtitle}</span></div>
            {document.sections.map((section, index) => (
              <section key={section.heading} className="paper-section">
                <div className="paper-section-heading"><span>{String(index + 1).padStart(2, "0")}</span><h3>{section.heading}</h3></div>
                {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets && <ul>{section.bullets.map((line) => <li key={line}>{line}</li>)}</ul>}
              </section>
            ))}
            <footer className="paper-footer">오리온 · 2026년 11월 5일 기준 · 공개용 지원 문서</footer>
          </article>
        </div>
      </div>
    </main>
  );
}
