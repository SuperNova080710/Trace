(function () {
  const storageKey = "trace-route-reveal-origin";

  function routePath(url) {
    return url.pathname.replace(/(?:\/index)?\.html$/, "").replace(/\/$/, "");
  }

  function pageKey(url) {
    return routePath(url) + url.hash;
  }

  function visibleBounds(element) {
    if (!element) return null;

    const rect = element.getBoundingClientRect();
    const left = Math.max(0, rect.left);
    const right = Math.min(window.innerWidth, rect.right);
    const top = Math.max(0, rect.top);
    const bottom = Math.min(window.innerHeight, rect.bottom);
    if (right <= left || bottom <= top) return null;

    return {
      left: left * 100 / window.innerWidth,
      right: right * 100 / window.innerWidth,
      top: top * 100 / window.innerHeight,
      bottom: bottom * 100 / window.innerHeight,
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
    const bounds = visibleBounds(link?.closest(".trace-origin, .application-tab"));

    try {
      sessionStorage.removeItem(storageKey);
      if (bounds) {
        const from = pageKey(new URL(window.location.href));
        sessionStorage.setItem(storageKey, JSON.stringify({ from, to, bounds }));
      }
    } catch {
      // The CSS origin covers browsers that restrict session storage.
    }
  });

  function takePreviousBounds(from, to) {
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey) ?? "null");
      sessionStorage.removeItem(storageKey);
      if (saved?.from === pageKey(from) && saved.to === pageKey(to)) {
        return saved.bounds;
      }
    } catch {
      // Use the CSS origin when no saved coordinates are available.
    }
    return null;
  }

  function playReveal(transition, mode, variables) {
    const root = document.documentElement;
    root.dataset.traceReveal = mode;
    for (const [name, value] of Object.entries(variables)) {
      root.style.setProperty(name, value);
    }
    const reset = () => {
      delete root.dataset.traceReveal;
      for (const name of Object.keys(variables)) root.style.removeProperty(name);
    };
    void transition.finished.then(reset, reset);
  }

  function playLiquidReveal(transition, bounds) {
    const x = bounds ? (bounds.left + bounds.right) / 2 : 50;
    const y = bounds ? (bounds.top + bounds.bottom) / 2 : 22;
    const farX = Math.max(x, 100 - x) * window.innerWidth / 100;
    const farY = Math.max(y, 100 - y) * window.innerHeight / 100;
    const revealLimit = Math.hypot(farX, farY / 0.84) + 4;
    playReveal(transition, "liquid", {
      "--trace-reveal-x": `${x}%`,
      "--trace-reveal-y": `${y}%`,
      "--trace-reveal-limit": `${revealLimit}px`,
    });
  }

  function playCardReveal(transition, mode, bounds) {
    const inset = [bounds.top, 100 - bounds.right, 100 - bounds.bottom, bounds.left];
    playReveal(transition, mode, {
      "--trace-card-inset": inset.map((value) => `${value}%`).join(" "),
    });
  }

  window.addEventListener("pagereveal", (event) => {
    const fromUrl = window.navigation?.activation?.from?.url || document.referrer;
    const transition = event.viewTransition;
    if (!transition || !fromUrl) return;

    const from = new URL(fromUrl);
    const to = new URL(window.location.href);
    if (from.origin !== to.origin) return;

    const previousBounds = takePreviousBounds(from, to);
    const fromPath = routePath(from);
    const toPath = routePath(to);

    if (fromPath.startsWith("/documents/") && toPath.startsWith("/documents/")) {
      const activeTab = document.querySelector('.application-tab[aria-current="page"]');
      playLiquidReveal(transition, previousBounds ?? visibleBounds(activeTab));
    } else if (previousBounds && fromPath === "" && document.querySelector(".trace-route-panel")) {
      playCardReveal(transition, "expand", previousBounds);
    } else if (toPath === "") {
      const matchingLink = Array.from(document.querySelectorAll(".trace-origin a")).find(
        (link) => routePath(new URL(link.href)) === fromPath
      );
      const card = document.querySelector(".trace-origin:target") ?? matchingLink?.closest(".trace-origin");
      const bounds = visibleBounds(card);
      if (bounds) playCardReveal(transition, "collapse", bounds);
    }
  });
})();
