/* SHATALOV WORKS — first screen polish + hotspots */

(() => {
  document.documentElement.classList.add("js");

  /* ---------- Reload: always start at HERO ---------- */

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  const navigationEntry = performance.getEntriesByType?.("navigation")?.[0];
  const isReload =
    navigationEntry?.type === "reload" ||
    // Legacy fallback for older browsers
    (typeof performance.navigation !== "undefined" &&
      performance.navigation.type === 1);

  const forceScrollTop = () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  if (isReload) {
    if (window.location.hash) {
      const { pathname, search } = window.location;
      history.replaceState(null, "", `${pathname}${search}`);
    }

    forceScrollTop();
    requestAnimationFrame(() => {
      forceScrollTop();
      requestAnimationFrame(forceScrollTop);
    });
    window.setTimeout(forceScrollTop, 0);
  }

  const hero = document.querySelector(".hero");
  const parallaxTarget = document.querySelector(".hero__compose");

  if (!hero) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  const reveal = () => {
    requestAnimationFrame(() => {
      hero.classList.add("is-ready");
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", reveal, { once: true });
  } else {
    reveal();
  }

  /* ---------- Parallax (compose: image + rail stay aligned) ---------- */

  if (parallaxTarget) {
    const maxOffset = 9;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = 0;

    const canParallax = () =>
      !reduceMotion.matches && finePointer.matches && window.innerWidth > 860;

    const applyTransform = () => {
      parallaxTarget.style.setProperty("--parallax-x", `${currentX.toFixed(2)}px`);
      parallaxTarget.style.setProperty("--parallax-y", `${currentY.toFixed(2)}px`);
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      if (
        Math.abs(targetX - currentX) < 0.05 &&
        Math.abs(targetY - currentY) < 0.05
      ) {
        currentX = targetX;
        currentY = targetY;
        applyTransform();
        rafId = 0;
        return;
      }

      applyTransform();
      rafId = requestAnimationFrame(tick);
    };

    const startTick = () => {
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const onMove = (event) => {
      if (!canParallax()) return;

      const rect = hero.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

      targetX = Math.max(-1, Math.min(1, nx)) * maxOffset;
      targetY = Math.max(-1, Math.min(1, ny)) * maxOffset;
      startTick();
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      startTick();
    };

    const resetParallax = () => {
      targetX = 0;
      targetY = 0;
      currentX = 0;
      currentY = 0;
      applyTransform();
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave, {
      passive: true,
    });
    window.addEventListener("blur", onLeave, { passive: true });

    reduceMotion.addEventListener("change", () => {
      if (reduceMotion.matches) resetParallax();
    });

    finePointer.addEventListener("change", () => {
      if (!finePointer.matches) resetParallax();
    });

    window.addEventListener(
      "resize",
      () => {
        if (!canParallax()) resetParallax();
      },
      { passive: true }
    );
  }

  /* ---------- Works scroll reveal ---------- */

  const revealNodes = [...document.querySelectorAll(".reveal")];

  if (revealNodes.length) {
    if (reduceMotion.matches) {
      revealNodes.forEach((node) => node.classList.add("is-visible"));
    } else if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          });
        },
        {
          root: null,
          rootMargin: "0px 0px -8% 0px",
          threshold: 0.18,
        }
      );

      revealNodes.forEach((node) => observer.observe(node));
    } else {
      revealNodes.forEach((node) => node.classList.add("is-visible"));
    }
  }
})();
