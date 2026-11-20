import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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

export function ExperienceSection() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [credential, setCredential] = useState<(typeof credentials)[number] | null>(null);

  useEffect(() => {
    if (credential) dialogRef.current?.showModal();
  }, [credential]);

  return (
    <section className={`section section-tint ${styles.section}`} id="experience" aria-labelledby="experience-title">
      <div className={`container ${styles.content}`}>
        <h2 id="experience-title">경험</h2>
        <article className={styles.entry} aria-labelledby="aleph-title">
          <div className={styles.copy}>
            <p className={styles.period}>
              <time dateTime="2026-08-11">2026.08.11</time>–<time dateTime="2026-11-12">2026.11.12</time> · 대전 B반
            </p>
            <h3 id="aleph-title">SKT ALEPH</h3>
            <p className={styles.summary}>AI 보안 에이전트 개발 과정을 수료하고 <strong>케테르(최고 등급)</strong> 인증을 받았습니다.</p>
          </div>
          <div className={styles.actions}>
            {credentials.map((item) => (
              <button
                type="button"
                className={styles.open}
                aria-haspopup="dialog"
                key={item.title}
                onClick={() => setCredential(item)}
              >
                {`${item.title} 보기`} <span aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        </article>
      </div>

      <dialog className={styles.dialog} ref={dialogRef} aria-labelledby="aleph-document-title" onClose={() => setCredential(null)}>
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
