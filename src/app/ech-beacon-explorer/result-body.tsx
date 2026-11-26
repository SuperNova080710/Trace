import { useLayoutEffect, useRef, type ReactNode } from "react";
import styles from "./interactive.module.css";

/** Follow the result height, including line wrapping after a resize or font load. */
export function ResultBody({ children }: { children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const frame = outer.current;
    const content = inner.current;
    if (!frame || !content || !window.ResizeObserver) return;
    const measure = () => { frame.style.height = content.getBoundingClientRect().height + "px"; };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    return () => observer.disconnect();
  }, []);
  return <div ref={outer} className={styles.resultFrame}><div ref={inner} className={styles.resultBody}>{children}</div></div>;
}
