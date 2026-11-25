import { useRef, type MouseEvent, type ReactNode } from "react";

/** Keep native disclosure semantics and finish the exit before hiding its contents. */
export function Disclosure({ className, title, children }: {
  className: string;
  title: string;
  children: ReactNode;
}) {
  const motion = useRef<Animation | null>(null);

  function toggle(event: MouseEvent<HTMLElement>) {
    const details = event.currentTarget.parentElement as HTMLDetailsElement;
    const body = event.currentTarget.nextElementSibling as HTMLElement;
    const opening = !details.open || details.hasAttribute("data-closing");
    const from = details.open ? body.getBoundingClientRect().height : 0;
    const opacity = details.open ? getComputedStyle(body).opacity : "0";
    event.preventDefault();
    motion.current?.cancel();
    details.removeAttribute("data-closing");
    body.inert = !opening;
    if (!body.animate || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      details.open = opening;
      body.inert = false;
      return;
    }

    details.open = true;
    details.toggleAttribute("data-closing", !opening);
    const animation = body.animate([
      { height: from + "px", opacity },
      { height: (opening ? body.scrollHeight : 0) + "px", opacity: opening ? 1 : 0 },
    ], { duration: opening ? 340 : 290, easing: "cubic-bezier(.22,.75,.28,1)", fill: "both" });
    motion.current = animation;
    animation.onfinish = () => {
      if (motion.current !== animation) return;
      details.open = opening;
      animation.cancel();
      details.removeAttribute("data-closing");
      body.inert = false;
      motion.current = null;
    };
  }

  return (
    <details className={className}>
      <summary onClick={toggle}>{title}</summary>
      <div className="disclosure-body">{children}</div>
    </details>
  );
}
