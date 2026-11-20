import Image from "next/image";
import { useRef, useState, type PointerEventHandler } from "react";
import { flushSync } from "react-dom";
import styles from "./experience-section.module.css";

const credentials = [
  {
    title: "수료증",
    image: "/experience/aleph-completion.jpg",
    description: "오리온의 SKT ALEPH 과정 수료증. 2026년 11월 12일 발급.",
  },
  {
    title: "인증서",
    image: "/experience/aleph-certification.jpg",
    description: "오리온의 SKT ALEPH AI 보안 에이전트 개발 과정 인증서. 케테르(최고 등급), 2026년 11월 12일 발급.",
  },
] as const;

type Credential = (typeof credentials)[number];

export function ExperienceSection({ onSpotlightMove }: { onSpotlightMove: PointerEventHandler<HTMLElement> }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [credential, setCredential] = useState<Credential | null>(null);

  function showCredential(item: Credential) {
    flushSync(() => setCredential(item));
    dialogRef.current?.showModal();
  }

  return (
    <section className={`section section-tint ${styles.section}`} id="experience" aria-labelledby="experience-title">
      <div className="container">
        <div className={`section-heading ${styles.heading}`}>
          <div className="section-side" aria-hidden="true"><span>04</span><span className="side-rule" /></div>
          <h2 id="experience-title"><span>경험</span></h2>
        </div>
        <div className={`project-grid ${styles.grid}`}>
          <article className="project-card spotlight-card" aria-labelledby="aleph-title" onPointerMove={onSpotlightMove}>
            <div className="project-art project-art-future">
              <span className="art-number">01 / 교육 과정</span>
              <span className="art-monogram" aria-hidden="true">ALEPH</span>
            </div>
            <div className="project-content">
              <span className={`project-category ${styles.period}`}>
                <time dateTime="2026-08-11">2026.08.11</time>–<time dateTime="2026-11-12">2026.11.12</time> · 대전 B반
              </span>
              <h3 id="aleph-title">SKT ALEPH</h3>
              <p className={styles.summary}>AI 보안 에이전트 개발 과정을 수료하고 <strong>케테르(최고 등급)</strong> 인증을 받았습니다.</p>
              <div className={styles.actions}>
                {credentials.map((item) => (
                  <button type="button" className={styles.open} aria-haspopup="dialog" key={item.title} onClick={() => showCredential(item)}>
                    {`${item.title} 보기`} <span aria-hidden="true">→</span>
                  </button>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>

      <dialog className={styles.dialog} ref={dialogRef} aria-labelledby="aleph-document-title">
        <div className={styles.dialogHeader}>
          <h3 id="aleph-document-title">SKT ALEPH {credential?.title}</h3>
          <form method="dialog">
            <button className={styles.close} type="submit">닫기</button>
          </form>
        </div>
        {credential && (
          <Image
            className={styles.document}
            src={credential.image}
            alt={credential.description}
            width={1813}
            height={1281}
            unoptimized
          />
        )}
        <div className={styles.dialogFooter}>
          <p className={styles.note}>증명사진, 문서 번호, 확인 코드를 가린 공개용 열람본입니다.</p>
          {credential && <a href={credential.image} target="_blank" rel="noopener noreferrer">이미지 크게 보기 <span aria-hidden="true">↗</span></a>}
        </div>
      </dialog>
    </section>
  );
}
