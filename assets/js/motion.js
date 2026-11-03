(function (window) {
  "use strict";

  const FILM_SECONDS = 90;
  const AUTOPLAY_PX_PER_S = 120;
  const END_EPSILON = 2;

  window.initMotion = function initMotion({ reduced }) {
    const R = window.PortfolioRender;
    const doc = document.documentElement;
    const body = document.body;
    const scenes = Array.from(document.querySelectorAll("section.scene"));
    const indicator = document.getElementById("scene-indicator");
    const markers = Array.from(document.querySelectorAll("#player-markers a"));
    const time = document.getElementById("player-time");
    const progressEl = document.getElementById("player-progress");
    const toggle = document.getElementById("player-toggle");

    const hasGsap = !reduced && typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
    const lenis = !reduced && typeof window.Lenis !== "undefined" ? new window.Lenis({ autoRaf: false }) : null;

    if (hasGsap) {
      const gsap = window.gsap;
      gsap.registerPlugin(window.ScrollTrigger);
      body.classList.add("has-gsap");
      if (lenis) {
        lenis.on("scroll", window.ScrollTrigger.update);
        gsap.ticker.add((t) => lenis.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
      }
    } else if (lenis) {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }

    const maxScroll = () => doc.scrollHeight - window.innerHeight;

    function scrollTo(target, opts = {}) {
      if (lenis) {
        lenis.scrollTo(target, {
          duration: opts.duration ?? 1.2,
          easing: opts.linear ? (x) => x : undefined,
          onComplete: opts.onComplete
        });
        return;
      }
      const el = typeof target === "number" ? null : document.querySelector(target);
      if (el) el.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
      else window.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
      if (opts.onComplete) opts.onComplete();
    }

    function setScene(id) {
      if (body.dataset.scene === id) return;
      body.dataset.scene = id;
      const scene = scenes.find((s) => s.dataset.scene === id);
      if (!scene) return;
      const n = scenes.indexOf(scene) + 1;
      if (indicator) indicator.textContent = `${indicator.dataset.prefix || "Scene"} ${n}/${scenes.length} — ${scene.dataset.sceneName}`;
      markers.forEach((a) => a.classList.toggle("is-active", a.dataset.scene === id));
    }

    function trackWithoutGsap() {
      const mid = window.innerHeight * 0.6;
      const current = scenes.filter((s) => s.getBoundingClientRect().top <= mid).pop() || scenes[0];
      setScene(current.dataset.scene);
      const clips = Array.from(document.querySelectorAll(".clip:not(.is-hidden)"));
      const active = clips.filter((c) => c.getBoundingClientRect().top <= window.innerHeight / 2).pop();
      if (active) R.setActiveClip(active.id.replace("clip-", ""));
    }

    function onScroll() {
      const max = maxScroll();
      const p = max > 0 ? window.scrollY / max : 0;
      if (time) time.textContent = R.formatTimecode(p, FILM_SECONDS);
      if (progressEl) progressEl.style.setProperty("--progress", `${(p * 100).toFixed(2)}%`);
      if (!hasGsap) trackWithoutGsap();
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (hasGsap) {
      const gsap = window.gsap;
      const ST = window.ScrollTrigger;
      scenes.forEach((s) => ST.create({
        trigger: s, start: "top 60%", end: "bottom 60%",
        onToggle: (self) => { if (self.isActive) setScene(s.dataset.scene); }
      }));
      document.querySelectorAll(".clip").forEach((c) => ST.create({
        trigger: c, start: "top center", end: "bottom center",
        onToggle: (self) => { if (self.isActive) R.setActiveClip(c.id.replace("clip-", "")); }
      }));

      gsap.from(".hero-name__line > span", { yPercent: 110, duration: 0.9, stagger: 0.08, ease: "power3.out" });
      gsap.from("#title .chips li, #hero-status, #title .hero-actions, #title .hint", { y: 20, opacity: 0, duration: 0.6, stagger: 0.06, delay: 0.5 });
      gsap.from("#portrait", { scale: 0.8, opacity: 0, duration: 1, ease: "power2.out" });

      document.querySelectorAll(".counter dd").forEach((dd) => {
        const target = Number(dd.dataset.target);
        ST.create({
          trigger: dd, start: "top 85%", once: true,
          onEnter: () => gsap.fromTo(dd, { textContent: 0 }, { textContent: target, duration: 1.2, snap: { textContent: 1 }, ease: "power1.out" })
        });
      });

      document.querySelectorAll(".marquee--a .marquee__track, .marquee--b .marquee__track").forEach((track, i) => {
        gsap.fromTo(track, { xPercent: i === 0 ? 0 : -50 }, { xPercent: i === 0 ? -50 : 0, ease: "none", scrollTrigger: { trigger: "#stack", start: "top bottom", end: "bottom top", scrub: 1 } });
      });

      gsap.from("#contact .h-display", { y: 40, opacity: 0, duration: 0.8, scrollTrigger: { trigger: "#contact", start: "top 70%" } });
    } else {
      document.querySelectorAll(".counter dd").forEach((dd) => { dd.textContent = dd.dataset.target; });
    }

    // ---------- autoplay ----------
    let playing = false;

    const playLabel = toggle ? toggle.getAttribute("aria-label") : "";

    function pause(atEnd) {
      if (!playing) return;
      playing = false;
      if (lenis) { lenis.stop(); lenis.start(); }
      if (toggle) {
        toggle.textContent = atEnd ? "↺" : "▶";
        toggle.setAttribute("aria-label", atEnd ? (toggle.dataset.replayLabel || playLabel) : playLabel);
        toggle.setAttribute("aria-pressed", "false");
      }
    }

    function play() {
      if (reduced || playing) return;
      if (maxScroll() - window.scrollY <= END_EPSILON) {
        if (lenis) { scrollTo(0, { duration: 1, onComplete: play }); return; }
        window.scrollTo({ top: 0 });
      }
      const remaining = maxScroll() - window.scrollY;
      playing = true;
      if (toggle) { toggle.textContent = "⏸"; toggle.setAttribute("aria-label", playLabel); toggle.setAttribute("aria-pressed", "true"); }
      scrollTo(maxScroll(), { duration: Math.max(1, remaining / AUTOPLAY_PX_PER_S), linear: true, onComplete: () => pause(true) });
    }

    ["wheel", "touchstart", "pointerdown", "keydown"].forEach((ev) => {
      window.addEventListener(ev, (e) => { if (!toggle || !toggle.contains(e.target)) pause(); }, { passive: true });
    });

    if (toggle) {
      if (reduced) toggle.classList.add("is-hidden");
      else toggle.addEventListener("click", () => (playing ? pause() : play()));
    }

    markers.forEach((a) => a.addEventListener("click", (e) => {
      e.preventDefault();
      pause();
      const target = a.getAttribute("href");
      scrollTo(target);
      history.replaceState(null, "", target);
    }));

    return { scrollTo, play, pause, isPlaying: () => playing };
  };
})(window);
