/* SHATALOV WORKS — site logic */

(() => {
  document.documentElement.classList.add("js");

  /* ---------- Reload: always start at HERO ---------- */

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  const navigationEntry = performance.getEntriesByType?.("navigation")?.[0];
  const isReload =
    navigationEntry?.type === "reload" ||
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

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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

  /* ---------- Mobile nav (hamburger) ---------- */

  const nav =
    document.querySelector(".hero-mobile .nav") ||
    document.querySelector(".hero__inner .nav") ||
    document.querySelector(".nav");
  const navToggle = nav?.querySelector(".nav__toggle");
  const navMenu = nav?.querySelector(".nav__menu");
  const navIcon = navToggle?.querySelector(".nav__toggle-icon");
  const mobileNavQuery = window.matchMedia("(max-width: 860px)");

  if (nav && navToggle && navMenu && navIcon) {
    const setNavOpen = (open) => {
      nav.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute(
        "aria-label",
        open ? "Закрыть меню" : "Открыть меню"
      );
      navIcon.textContent = open ? "×" : "☰";
    };

    const closeNav = () => setNavOpen(false);

    navToggle.addEventListener("click", () => {
      if (!mobileNavQuery.matches) return;
      const open = navToggle.getAttribute("aria-expanded") === "true";
      setNavOpen(!open);
    });

    navMenu.querySelectorAll("a.nav__link").forEach((link) => {
      link.addEventListener("click", () => {
        if (mobileNavQuery.matches) closeNav();
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (navToggle.getAttribute("aria-expanded") !== "true") return;
      closeNav();
      navToggle.focus();
    });

    const onBreakpointChange = () => {
      if (!mobileNavQuery.matches) closeNav();
    };

    if (typeof mobileNavQuery.addEventListener === "function") {
      mobileNavQuery.addEventListener("change", onBreakpointChange);
    } else if (typeof mobileNavQuery.addListener === "function") {
      mobileNavQuery.addListener(onBreakpointChange);
    }
  }

  /* ---------- Desktop HERO: entry assembly only ---------- */

  const heroCanvas = document.querySelector("[data-hero-motion]");
  const desktopMotionQuery = window.matchMedia("(min-width: 1101px)");

  if (heroCanvas && desktopMotionQuery.matches) {
    const ASSEMBLY_MS = 5200;

    const setStatic = () => {
      heroCanvas.classList.remove("is-assembling", "is-live", "is-plate-ready");
      heroCanvas.classList.add("is-static");
    };

    const startLive = () => {
      /* 1) Paint full PNG under finished layers while they still cover it */
      heroCanvas.classList.add("is-plate-ready");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          /* 2) Remove overlay only after plate is already opacity:1 underneath */
          heroCanvas.classList.add("is-live");
          heroCanvas.classList.remove("is-assembling", "is-plate-ready");
        });
      });
    };

    const startAssembly = () => {
      heroCanvas.classList.remove("is-static", "is-live", "is-plate-ready");
      heroCanvas.classList.add("is-assembling");
      window.setTimeout(startLive, ASSEMBLY_MS);
    };

    if (reduceMotion.matches) {
      setStatic();
    } else {
      startAssembly();
    }

    const onMotionPreference = () => {
      if (reduceMotion.matches) {
        setStatic();
        return;
      }
      if (
        !heroCanvas.classList.contains("is-live") &&
        !heroCanvas.classList.contains("is-assembling")
      ) {
        startAssembly();
      }
    };

    if (typeof reduceMotion.addEventListener === "function") {
      reduceMotion.addEventListener("change", onMotionPreference);
    } else if (typeof reduceMotion.addListener === "function") {
      reduceMotion.addListener(onMotionPreference);
    }
  } else if (heroCanvas) {
    heroCanvas.classList.add("is-static");
  }
})();
