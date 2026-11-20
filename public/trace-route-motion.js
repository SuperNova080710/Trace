(function () {
  const storageKey = "trace-route-reveal-origin";
  let clearLaunch;

  function routePath(url) {
    return url.pathname.replace(/(?:\/index)?\.html$/, "").replace(/\/$/, "");
  }

  function pageKey(url) {
    return routePath(url) + url.hash;
  }

  function isLaunchDetail(path) {
    return path === "/ech-beacon-explorer" || path.startsWith("/documents/");
  }

  function launchDirection(from, to) {
    const fromPath = routePath(from);
    const toPath = routePath(to);
    if (fromPath === "" && isLaunchDetail(toPath)) return "open";
    if (toPath === "" && isLaunchDetail(fromPath)) return "close";
    return null;
  }

  function launchLink(path) {
    return Array.from(document.querySelectorAll("a[data-trace-launch-link]")).find((link) => routePath(new URL(link.href)) === path);
  }

  function playLaunch(transition, direction, surface) {
    clearLaunch?.();
    const root = document.documentElement;
    root.dataset.traceRouteTransition = direction;
    surface.setAttribute("data-trace-route-surface", "");
    const reset = () => {
      if (clearLaunch !== reset) return;
      clearLaunch = undefined;
      delete root.dataset.traceRouteTransition;
      surface.removeAttribute("data-trace-route-surface");
    };
    clearLaunch = reset;
    void transition.finished.then(reset, reset);
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

    const current = new URL(window.location.href);
    const direction = launchDirection(current, destination);
    if (direction) {
      const surface = direction === "open" ? launchLink(routePath(destination)) : document.documentElement;
      if (surface) playLaunch(event.viewTransition, direction, surface);
      return;
    }

    if (!routePath(current).startsWith("/documents/") || !routePath(destination).startsWith("/documents/")) return;

    const to = pageKey(destination);
    const matchesDestination = (link) => {
      const url = new URL(link.href);
      return url.origin === destination.origin && pageKey(url) === to;
    };
    const active = document.activeElement?.closest("a[href]");
    const link = active && matchesDestination(active)
      ? active
      : Array.from(document.links).find(matchesDestination);
    const bounds = visibleBounds(link?.closest(".application-tab"));

    try {
      sessionStorage.removeItem(storageKey);
      if (bounds) {
        sessionStorage.setItem(storageKey, JSON.stringify({ from: pageKey(current), to, bounds }));
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

  window.addEventListener("pagereveal", (event) => {
    const fromUrl = window.navigation?.activation?.from?.url || document.referrer;
    const transition = event.viewTransition;
    if (!transition || !fromUrl) return;

    const from = new URL(fromUrl);
    const to = new URL(window.location.href);
    if (from.origin !== to.origin) return;

    const direction = launchDirection(from, to);
    if (direction === "open" && document.querySelector(".trace-route-panel")) {
      playLaunch(transition, direction, document.documentElement);
    } else if (direction === "close") {
      const link = launchLink(routePath(from));
      if (link) {
        if (!visibleBounds(link)) link.scrollIntoView({ block: "nearest", behavior: "instant" });
        playLaunch(transition, direction, link);
      }
    }

    const fromPath = routePath(from);
    const toPath = routePath(to);

    if (fromPath.startsWith("/documents/") && toPath.startsWith("/documents/")) {
      const activeTab = document.querySelector('.application-tab[aria-current="page"]');
      playLiquidReveal(transition, takePreviousBounds(from, to) ?? visibleBounds(activeTab));
    }
  });
})();
