import Image from "next/image";
import { useRef, useState, type MouseEvent, type PointerEventHandler } from "react";
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

function isBackdrop(event: MouseEvent<HTMLDialogElement>) {
  if (event.target !== event.currentTarget) return false;

  const { left, right, top, bottom } = event.currentTarget.getBoundingClientRect();
  return event.clientX < left || event.clientX >= right || event.clientY < top || event.clientY >= bottom;
}

export function ExperienceSection({ onSpotlightMove }: { onSpotlightMove: PointerEventHandler<HTMLElement> }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pressedBackdrop = useRef(false);
  const transitionRef = useRef<ViewTransition | null>(null);
  const fallbackRef = useRef<Animation | null>(null);
  const [credential, setCredential] = useState<Credential | null>(null);

  function updateViewer(update: () => void, direction: "open" | "close") {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      fallbackRef.current?.cancel();
      delete dialog.dataset.motion;
      update();
      return;
    }
    if (!document.startViewTransition) {
      if (dialog.dataset.motion === direction) return;
      const opening = direction === "open";
      const current = getComputedStyle(dialog);
      const shown = { opacity: current.opacity, transform: current.transform };
      const hidden = { opacity: 0, transform: "translateY(12px) scale(.965)" };
      fallbackRef.current?.cancel();
      if (opening) update();
      dialog.dataset.motion = direction;
      const animation = dialog.animate(opening ? [hidden, {opacity: 1, transform: "none"}] : [shown, hidden], {
        duration: opening ? 320 : 280, easing: "cubic-bezier(.22,.75,.28,1)",
      });
      fallbackRef.current = animation;
      animation.onfinish = () => {
        if (fallbackRef.current !== animation) return;
        if (!opening) update();
        fallbackRef.current = null;
        delete dialog.dataset.motion;
      };
      return;
    }

    const root = document.documentElement;
    const attribute = "data-trace-credential-transition";
    // Capture the button where it was pressed even during a smooth scroll.
    window.scrollTo({left: window.scrollX, top: window.scrollY, behavior: "instant"});
    root.setAttribute(attribute, direction);
    const transition = document.startViewTransition(update);
    transitionRef.current = transition;
    void transition.finished.finally(() => {
      if (transitionRef.current === transition) {
        transitionRef.current = null;
        root.removeAttribute(attribute);
      }
    }).catch(() => {});
  }

  function showCredential(item: Credential) {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;

    flushSync(() => setCredential(item));
    updateViewer(() => dialog.showModal(), "open");
  }

  function closeCredential() {
    const dialog = dialogRef.current;
    if (dialog?.open) updateViewer(() => dialog.close(), "close");
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
                  <button
                    type="button"
                    className={styles.open}
                    aria-haspopup="dialog"
                    aria-controls="aleph-document-viewer"
                    data-trace-credential-origin={credential === item ? "" : undefined}
                    key={item.title}
                    onClick={() => showCredential(item)}
                  >
                    {`${item.title} 보기`} <span aria-hidden="true">→</span>
                  </button>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>

      <dialog
        id="aleph-document-viewer"
        className={styles.dialog}
        ref={dialogRef}
        aria-labelledby="aleph-document-title"
        onCancel={(event) => {
          event.preventDefault();
          closeCredential();
        }}
        onPointerDown={(event) => { pressedBackdrop.current = event.button === 0 && isBackdrop(event); }}
        onClick={(event) => {
          const clickedBackdrop = pressedBackdrop.current && isBackdrop(event);
          pressedBackdrop.current = false;
          if (clickedBackdrop) closeCredential();
        }}
      >
        <div className={styles.dialogHeader}>
          <h3 id="aleph-document-title">SKT ALEPH {credential?.title}</h3>
          <button className={styles.close} type="button" onClick={closeCredential}>닫기</button>
        </div>
        {credential && (
          <Image
            className={styles.document}
            src={credential.image}
            alt={credential.description}
            width={1813}
            height={1281}
            loading="eager"
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
