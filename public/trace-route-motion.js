(function () {
  const sharedName = "trace-route-card";

  // Static exports serve the same page with or without a trailing slash.
  function routePath(url) {
    return new URL(url).pathname.replace(/\.html$/, "").replace(/\/$/, "");
  }

  function nameSurface(transition, other, phase) {
    if (!transition || !other) return;

    const otherPath = routePath(other);
    const onHome = document.querySelector(".trace-page");
    if (onHome) {
      const link = Array.from(onHome.querySelectorAll(".trace-origin a"))
        .find((anchor) => routePath(anchor.href) === otherPath);
      const card = link?.closest(".trace-origin");
      const rect = card?.getBoundingClientRect();
      if (!rect || rect.bottom <= 0 || rect.top >= window.innerHeight) {
        transition.skipTransition();
        return;
      }
      capture(card, transition, phase);
    } else if (["", "/index"].includes(otherPath) &&
               document.querySelector(".trace-route-panel")) {
      capture(document.documentElement, transition, phase);
    }
  }

  function capture(surface, transition, phase) {
    surface.style.viewTransitionName = sharedName;
    // The outgoing name must also be removed if this page is restored from BFCache.
    const captured = phase === "out" ? transition.finished : transition.ready;
    const reset = () => surface.style.removeProperty("view-transition-name");
    void captured.then(reset, reset);
  }

  window.addEventListener("pageswap", (event) => {
    nameSurface(event.viewTransition, event.activation?.entry?.url, "out");
  });

  window.addEventListener("pagereveal", (event) => {
    nameSurface(event.viewTransition, window.navigation?.activation?.from?.url, "in");
  });
})();
