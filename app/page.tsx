"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SITE_CONTENT = {
  nav: [
    { id: "hire", label: "Hire me" },
    { id: "artist", label: "Artist" },
  ],
  section1: {
    id: "hire",
    bgImage: "/uploads/portrait.jpeg",
    indexNum: "01",
    indexLabel: "Hire me",
    eyebrow: "Producer · Available for work",
    title: "Samuel Guye",
    cta: { 
      label: "Hire me", 
      href: "mailto:hello@samuelguye.com" 
    },
    credits: (
      <>
        Selected credits — produced <span className="track">i walk this earth all by myself</span>{" "}
        for <span className="artist">ekkstacy</span>, a hushed midnight ballad off his 2023 record;
        co-produced <span className="track">diffuse</span> with{" "}
        <span className="artist">60 juno</span> under his SEATAPE alias, a slow-burning ambient
        cut; and produced <span className="track">my world</span> for{" "}
        <span className="artist">chuckyy</span>, a warm bedroom-pop single from last spring.
      </>
    ),
    scrollHint: "Artist",
  },
  section2: {
    id: "artist",
    bgImage: "/uploads/working.JPG",
    indexNum: "02",
    indexLabel: "Artist",
    eyebrow: "Two solo projects",
    title: "Samuel Guye",
    projects: [
      { id: "seatape", name: "SEATAPE", meta: "Ambient · 2022 —", href: "#" },
      { id: "bluesleeves", name: "bluesleeves", meta: "Songs · 2024 —", href: "#" },
    ],
    footer: {
      leftText: "Based in Paris · 2026",
      links: [
        { label: "Email", href: "mailto:hello@samuelguye.com" },
        { label: "Instagram", href: "#" },
        { label: "Spotify", href: "#" },
      ],
    },
  },
};

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: "power3.out" });

    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const tabs = root.querySelectorAll<HTMLAnchorElement>(".tab");
      const pill = root.querySelector<HTMLSpanElement>(".tab-pill")!;

      function positionPill(activeTab: HTMLElement, animate = true) {
        const xOffset = (gsap.getProperty(activeTab, "x") as number) || 0;
        const x = activeTab.offsetLeft + xOffset;
        const w = activeTab.offsetWidth;
        
        if (animate) {
          gsap.to(pill, { x, width: w, duration: 0.55, ease: "expo.inOut", overwrite: "auto" });
        } else {
          gsap.set(pill, { x, width: w });
        }
      }

      function setActiveTab(name: string) {
        tabs.forEach((t) => {
          const isActive = t.dataset.tab === name;
          t.classList.toggle("is-active", isActive);
          t.setAttribute("aria-selected", isActive ? "true" : "false");
          if (isActive) positionPill(t, true);
        });
      }

      tabs.forEach((t) => {
        t.addEventListener("click", (e) => {
          e.preventDefault();
          const target = document.querySelector("#" + t.dataset.tab);
          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });

      const activeTab = root.querySelector<HTMLElement>(".tab.is-active");
      gsap.set(pill, { opacity: 0 });
      if (activeTab) positionPill(activeTab, false);

      gsap.set(".mark", { opacity: 0, scale: 0.6 });
      gsap.set(".top", { y: -10, opacity: 0 });

      // =====================================
      // 🧲 ALL LINKS MAGNETIC + SCALE HOVER
      // =====================================
      const magneticElements = root.querySelectorAll<HTMLElement>("a, .tab, .cta, .project");
      
      magneticElements.forEach((el) => {
        const isTab = el.classList.contains("tab");
        const scaleHover = isTab ? 1 : 1.08; 

        el.addEventListener("mousemove", (e) => {
          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          const moveX = (e.clientX - centerX) * 0.35;
          const moveY = (e.clientY - centerY) * 0.35;

          gsap.to(el, {
            x: moveX,
            y: moveY,
            scale: scaleHover,
            duration: 0.6,
            ease: "power3.out",
            overwrite: "auto",
          });
          
          if (isTab && el.classList.contains("is-active")) positionPill(el, true);
        });

        el.addEventListener("mouseleave", () => {
          gsap.to(el, {
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "elastic.out(1, 0.3)",
            overwrite: "auto",
          });
          
          if (isTab && el.classList.contains("is-active")) positionPill(el, true);
        });
      });

      // =====================================
      // 🌈 RAINBOW SPOTLIGHT TRACKING
      // =====================================
      const rainbowElements = root.querySelectorAll<HTMLElement>(".rainbow-hover");
      rainbowElements.forEach((el) => {
        el.addEventListener("mousemove", (e) => {
          const rect = el.getBoundingClientRect();
          const localX = e.clientX - rect.left;
          const localY = e.clientY - rect.top;
          
          el.style.setProperty("--local-x", `${localX}px`);
          el.style.setProperty("--local-y", `${localY}px`);
        });
      });

      // Intro Reveal
      const sec1 = root.querySelector<HTMLElement>(`#${SITE_CONTENT.section1.id}`)!;
      const sec1Reveals = sec1.querySelectorAll<HTMLElement>(".reveal");
      gsap.set(sec1Reveals, { y: 26, opacity: 0 });

      const intro = gsap.timeline();
      intro
        .to(".mark", { opacity: 1, scale: 1, duration: 0.9, stagger: 0.06, ease: "expo.out" }, 0.1)
        .to(".top", { y: 0, opacity: 1, duration: 0.8 }, 0.25)
        .to(pill, { opacity: 1, duration: 0.4 }, 0.4)
        .to(sec1Reveals, { y: 0, opacity: 1, duration: 0.9, stagger: 0.09, ease: "expo.out" }, 0.5);

      // Section 2 reveals
      const sec2 = root.querySelector<HTMLElement>(`#${SITE_CONTENT.section2.id}`)!;
      const sec2Reveals = sec2.querySelectorAll<HTMLElement>(".reveal");
      gsap.set(sec2Reveals, { y: 28, opacity: 0 });

      ScrollTrigger.batch(Array.from(sec2Reveals), {
        start: "top 82%",
        onEnter: (batch) =>
          gsap.to(batch, { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "expo.out", overwrite: "auto" }),
        onLeaveBack: (batch) =>
          gsap.to(batch, { y: 28, opacity: 0, duration: 0.4, ease: "power2.in", overwrite: "auto" }),
      });

      // Parallax
      root.querySelectorAll<HTMLElement>(".signature").forEach((sig) => {
        gsap.to(sig, {
          yPercent: -40, scale: 0.94, ease: "none",
          scrollTrigger: { trigger: sig.closest(".section") as Element, start: "top top", end: "bottom top", scrub: 0.6 },
        });
      });
      root.querySelectorAll<HTMLElement>(".section-index").forEach((el) => {
        gsap.to(el, {
          yPercent: -80, ease: "none",
          scrollTrigger: { trigger: el.closest(".section") as Element, start: "top top", end: "bottom top", scrub: 0.6 },
        });
      });

      // Active tabs
      ScrollTrigger.create({
        trigger: `#${SITE_CONTENT.section1.id}`, start: "top 50%", end: "bottom 50%",
        onEnter: () => setActiveTab(SITE_CONTENT.section1.id), onEnterBack: () => setActiveTab(SITE_CONTENT.section1.id),
      });
      ScrollTrigger.create({
        trigger: `#${SITE_CONTENT.section2.id}`, start: "top 50%", end: "bottom 50%",
        onEnter: () => setActiveTab(SITE_CONTENT.section2.id), onEnterBack: () => setActiveTab(SITE_CONTENT.section2.id),
      });

      // Progress bar
      const progress = root.querySelector<HTMLDivElement>("#progress")!;
      ScrollTrigger.create({
        start: 0, end: "max", onUpdate: (self) => { progress.style.width = self.progress * 100 + "%"; },
      });

      gsap.utils.toArray<HTMLElement>(".eyebrow .dot").forEach((dot) => {
        gsap.to(dot, { boxShadow: "0 0 22px rgba(201, 168, 106, 0.95)", duration: 2.2, ease: "sine.inOut", repeat: -1, yoyo: true });
      });

      const onResize = () => {
        const active = root.querySelector<HTMLElement>(".tab.is-active");
        if (active) positionPill(active, false);
      };
      
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <div className="mark tl" />
      <div className="mark tr" />
      <div className="mark bl" />
      <div className="mark br" />

      <div className="progress" id="progress" />

      <header className="top">
        <nav className="tabs" role="tablist" aria-label="Sections">
          <span className="tab-pill" aria-hidden="true" />
          {SITE_CONTENT.nav.map((tab, i) => (
            <a key={tab.id} className={`tab ${i === 0 ? "is-active" : ""}`} data-tab={tab.id} href={`#${tab.id}`}>
              {tab.label}
            </a>
          ))}
        </nav>
      </header>

      {/* SECTION 1 - HERO LEFT ALIGNED */}
      <section className="section" id={SITE_CONTENT.section1.id}>
        <div className="section-bg reveal">
          <div className="bg-image" style={{ backgroundImage: `url('${SITE_CONTENT.section1.bgImage}')` }} />
          <div className="bg-overlay" />
        </div>

        <div className="content-wrap align-left">
          {/* <div className="section-index reveal">
            {SITE_CONTENT.section1.indexNum}<small>{SITE_CONTENT.section1.indexLabel}</small>
          </div> */}

          {SITE_CONTENT.section1.eyebrow && (
            <div className="eyebrow reveal">
              <span className="dot" />
              {SITE_CONTENT.section1.eyebrow}
            </div>
          )}

          {/* 1. Title */}
          <h1 className="signature reveal rainbow-hover" data-text={SITE_CONTENT.section1.title}>
            {SITE_CONTENT.section1.title}
          </h1>

          {/* 2. Credits / Info description */}
          <p className="credits reveal">
            {SITE_CONTENT.section1.credits}
          </p>

          {/* 3. Primary action button */}
          <div className="cta-wrap reveal">
            <a className="cta" href={SITE_CONTENT.section1.cta.href}>
              <span>{SITE_CONTENT.section1.cta.label}</span>
              <span className="cta-arrow" aria-hidden="true" />
            </a>
          </div>

          {/* {SITE_CONTENT.section1.scrollHint && (
            <div className="scroll-hint reveal">
              <span>{SITE_CONTENT.section1.scrollHint}</span>
              <span className="line" />
            </div>
          )} */}
        </div>
      </section>

      {/* SECTION 2 */}
      <section className="section" id={SITE_CONTENT.section2.id}>
        <div className="section-bg reveal">
          <div className="bg-image" style={{ backgroundImage: `url('${SITE_CONTENT.section2.bgImage}')` }} />
          <div className="bg-overlay" />
        </div>

        <div className="content-wrap">
          <div className="section-index reveal">
            {SITE_CONTENT.section2.indexNum}<small>{SITE_CONTENT.section2.indexLabel}</small>
          </div>

          {SITE_CONTENT.section2.eyebrow && (
            <div className="eyebrow reveal">
              <span className="dot" />
              {SITE_CONTENT.section2.eyebrow}
            </div>
          )}

          <h1 className="signature reveal rainbow-hover" data-text={SITE_CONTENT.section2.title}>
            {SITE_CONTENT.section2.title}
          </h1>

          <div className="projects reveal">
            {SITE_CONTENT.section2.projects.map((project, index) => (
              <div key={project.id} style={{ display: 'contents' }}>
                <a className="project" href={project.href} data-project={project.id}>
                  <div className="project-name rainbow-hover" data-text={project.name}>{project.name}</div>
                  <div className="project-meta">{project.meta}</div>
                </a>
                {index !== SITE_CONTENT.section2.projects.length - 1 && (
                  <div className="projects-sep" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>

          <div className="foot reveal">
            <div className="left">{SITE_CONTENT.section2.footer.leftText}</div>
            <div className="right">
              {SITE_CONTENT.section2.footer.links.map((link, index) => (
                <a 
                  key={index} 
                  href={link.href} 
                  target={link.href.startsWith("http") ? "_blank" : undefined} 
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}