(function () {
  const storageKey = "trace-route-reveal-origin";

  function pageKey(url) {
    return url.pathname.replace(/(?:\/index)?\.html$/, "").replace(/\/$/, "") + url.hash;
  }

  function visibleCenter(element) {
    if (!element) return null;

    const rect = element.getBoundingClientRect();
    const left = Math.max(0, rect.left);
    const right = Math.min(window.innerWidth, rect.right);
    const top = Math.max(0, rect.top);
    const bottom = Math.min(window.innerHeight, rect.bottom);
    if (right <= left || bottom <= top) return null;

    return {
      x: (left + right) * 50 / window.innerWidth,
      y: (top + bottom) * 50 / window.innerHeight,
    };
  }

  window.addEventListener("pageswap", (event) => {
    const nextUrl = event.activation?.entry?.url;
    if (!event.viewTransition || !nextUrl) return;

    const destination = new URL(nextUrl);
    if (destination.origin !== window.location.origin) return;

    const to = pageKey(destination);
    const matchesDestination = (link) => {
      const url = new URL(link.href);
      return url.origin === destination.origin && pageKey(url) === to;
    };
    const active = document.activeElement?.closest("a[href]");
    const link = active && matchesDestination(active)
      ? active
      : Array.from(document.links).find(matchesDestination);
    const point = visibleCenter(link?.closest(".trace-origin") ?? link);

    try {
      sessionStorage.removeItem(storageKey);
      if (point) {
        const from = pageKey(new URL(window.location.href));
        sessionStorage.setItem(storageKey, JSON.stringify({ from, to, point }));
      }
    } catch {
      // The CSS origin covers browsers that restrict session storage.
    }
  });

  function takePreviousOrigin() {
    const fromUrl = window.navigation?.activation?.from?.url;
    if (!fromUrl) return null;

    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey) ?? "null");
      sessionStorage.removeItem(storageKey);
      if (saved?.from === pageKey(new URL(fromUrl)) &&
          saved.to === pageKey(new URL(window.location.href))) {
        return saved.point;
      }
    } catch {
      // Use the CSS origin when no saved coordinates are available.
    }
    return null;
  }

  window.addEventListener("pagereveal", (event) => {
    if (!event.viewTransition) return;

    const previousOrigin = takePreviousOrigin();
    const point = visibleCenter(document.querySelector(".trace-origin:target")) ?? previousOrigin;
    if (!point) return;

    const farX = Math.max(point.x, 100 - point.x) * window.innerWidth / 100;
    const farY = Math.max(point.y, 100 - point.y) * window.innerHeight / 100;
    const revealLimit = Math.hypot(farX, farY / 0.84) + 4;
    const rootStyle = document.documentElement.style;
    rootStyle.setProperty("--trace-reveal-x", `${point.x}%`);
    rootStyle.setProperty("--trace-reveal-y", `${point.y}%`);
    rootStyle.setProperty("--trace-reveal-limit", `${revealLimit}px`);
    const reset = () => {
      rootStyle.removeProperty("--trace-reveal-x");
      rootStyle.removeProperty("--trace-reveal-y");
      rootStyle.removeProperty("--trace-reveal-limit");
    };
    void event.viewTransition.finished.then(reset, reset);
  });
})();
