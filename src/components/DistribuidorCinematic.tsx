"use client";

import React, { useEffect, useRef } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window { gsap: any; ScrollTrigger: any; }
}

const STYLES = `
  .dc-root {
    position: relative; width: 100vw; height: 100vh;
    overflow: hidden; overflow: clip;
    display: flex; align-items: center; justify-content: center;
    background: var(--bg-body, #ffffff);
    font-family: var(--font-body, system-ui, sans-serif);
    perspective: 1500px;
    isolation: isolate;
  }
  .dc-grain {
    position: absolute; inset: 0; pointer-events: none; z-index: 50;
    opacity: 0.04; mix-blend-mode: overlay;
    background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)"/></svg>');
  }
  .dc-grid {
    position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: 0.35;
    background-size: 60px 60px;
    background-image:
      linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px);
    mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }

  /* ── HERO TEXT (inside card) ── */
  .dc-hero {
    position: absolute; inset: 0; z-index: 15;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; padding: 0 32px;
    pointer-events: none;
  }
  .dc-t1 {
    visibility: hidden;
    color: #ffffff;
    text-shadow: 0 4px 16px rgba(0,0,0,0.5);
    font-family: var(--font-display, system-ui);
    font-size: clamp(3rem, 7vw, 8rem);
    font-weight: 900; letter-spacing: 0.04em; text-transform: uppercase;
    margin-bottom: 6px; line-height: 1;
  }
  .dc-t2 {
    color: #fb670b;
    font-family: var(--font-display, system-ui);
    font-size: clamp(3rem, 7vw, 8rem);
    font-weight: 900; letter-spacing: 0.04em; text-transform: uppercase;
    line-height: 1;
    text-shadow: 0 0 40px rgba(251,103,11,0.35);
  }

  /* ── FINAL MESSAGE ── */
  .dc-final {
    position: absolute; inset: 0; z-index: 5;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; padding: 0 24px;
    opacity: 0; visibility: hidden; pointer-events: none;
  }
  .dc-final-h {
    font-family: var(--font-display, system-ui);
    font-size: clamp(2.5rem, 6vw, 6rem);
    font-weight: 900; color: var(--text-main, #0a0a0a);
    text-transform: uppercase; line-height: 0.95; margin-bottom: 24px;
  }
  .dc-final-h span { color: #fb670b; }
  .dc-final-p {
    font-size: clamp(1rem, 1.2vw, 1.25rem); color: #52525b;
    max-width: 500px; margin-bottom: 40px; line-height: 1.6;
  }
  .dc-scroll-down {
    display: flex; flex-direction: column; align-items: center; gap: 12px;
    color: #fb670b; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em;
  }
  .dc-arrow-bounce {
    animation: dc-bounce 2s infinite;
  }
  @keyframes dc-bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }

  /* ── MAIN CARD ── */
  .dc-card-wrap {
    position: absolute; inset: 0; z-index: 20;
    display: flex; align-items: center; justify-content: center;
    pointer-events: none; perspective: 1500px;
  }
  .dc-card {
    position: relative; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
    pointer-events: auto;
    width: 92vw; height: 92vh; border-radius: 32px;
    opacity: 0; /* hidden until GSAP animates it in */
    background: linear-gradient(145deg, #1c1c1e 0%, #050505 100%);
    box-shadow:
      0 40px 100px -20px rgba(0,0,0,.9),
      0 20px 40px -20px rgba(0,0,0,.8),
      inset 0 1px 2px rgba(255,255,255,.12),
      inset 0 -2px 4px rgba(0,0,0,.8);
    border: 1px solid rgba(255,255,255,.04);
  }
  @media (min-width: 768px) { .dc-card { width: 85vw; height: 85vh; border-radius: 40px; } }

  .dc-sheen {
    position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
    background: radial-gradient(800px circle at var(--mouse-x,50%) var(--mouse-y,50%), rgba(251,103,11,.06) 0%, transparent 40%);
    mix-blend-mode: screen; transition: opacity .3s ease;
  }

  /* Card inner grid */
  .dc-card-body {
    position: relative; width: 100%; height: 100%;
    max-width: 1280px; margin: 0 auto;
    padding: 24px 16px;
    display: flex; flex-direction: column;
    justify-content: space-evenly; align-items: center; z-index: 10;
  }
  @media (min-width: 1024px) {
    .dc-card-body {
      display: grid; grid-template-columns: 1fr 1fr 1fr;
      align-items: center; gap: 32px; padding: 0 48px;
    }
  }

  /* Left text block */
  .dc-left {
    visibility: hidden;
    display: flex; flex-direction: column; justify-content: center;
    text-align: center; z-index: 20; width: 100%; order: 3;
  }
  @media (min-width: 1024px) { .dc-left { text-align: left; order: 1; } }

  /* Eyebrow tag — matches site's h4 style */
  .dc-left-tag {
    color: #fb670b;
    font-family: var(--font-body, system-ui);
    font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase;
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 14px; justify-content: center;
  }
  @media (min-width: 1024px) { .dc-left-tag { justify-content: flex-start; } }
  .dc-left-tag::before {
    content: ''; flex-shrink: 0;
    width: 28px; height: 2px; background: #fb670b;
    display: none;
  }
  @media (min-width: 1024px) { .dc-left-tag::before { display: block; } }

  .dc-left-h {
    color: #fff;
    font-family: var(--font-display, system-ui);
    font-size: clamp(2.2rem, 3.5vw, 4.2rem);
    font-weight: 900; letter-spacing: 0.02em; text-transform: uppercase;
    margin-bottom: 20px; line-height: 1;
  }
  .dc-left-p {
    color: rgba(255,255,255,.6);
    font-size: clamp(0.9rem, 1.15vw, 1.1rem);
    line-height: 1.7; display: block;
    max-width: 340px;
  }
  @media (max-width: 1023px) { .dc-left-p { margin: 0 auto; } }
  .dc-left-p strong { color: #fb670b; font-weight: 700; }

  /* Right logo */
  .dc-right {
    visibility: hidden;
    display: flex; justify-content: center; align-items: center;
    z-index: 20; width: 100%; order: 1;
  }
  @media (min-width: 1024px) { .dc-right { justify-content: flex-end; order: 3; } }
  .dc-logo-img {
    width: clamp(70px, 10vw, 140px);
    height: auto;
    object-fit: contain;
    image-rendering: auto;
    filter: drop-shadow(0 0 30px rgba(251,103,11,.5)) drop-shadow(0 4px 12px rgba(0,0,0,.5));
    opacity: 0.9;
  }

  /* Phone wrapper */
  .dc-phone-wrap {
    visibility: hidden;
    position: relative; width: 100%; height: 380px;
    display: flex; align-items: center; justify-content: center;
    z-index: 10; order: 2; perspective: 1000px;
  }
  @media (min-width: 1024px) { .dc-phone-wrap { height: 600px; } }
  .dc-phone-scale {
    position: relative; width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    transform: scale(0.65);
  }
  @media (min-width: 640px)  { .dc-phone-scale { transform: scale(0.82); } }
  @media (min-width: 1024px) { .dc-phone-scale { transform: scale(1); } }

  /* iPhone */
  .dc-iphone {
    position: relative; width: 280px; height: 580px;
    border-radius: 3rem; background-color: #111;
    box-shadow: inset 0 0 0 2px #52525b, inset 0 0 0 7px #000,
                0 40px 80px -15px rgba(0,0,0,.9), 0 15px 25px -5px rgba(0,0,0,.7);
    display: flex; flex-direction: column; will-change: transform;
  }
  .dc-hw-btn {
    position: absolute;
    background: linear-gradient(90deg,#404040 0%,#171717 100%);
    box-shadow: -2px 0 5px rgba(0,0,0,.8), inset -1px 0 1px rgba(255,255,255,.15), inset 1px 0 2px rgba(0,0,0,.8);
    border-left: 1px solid rgba(255,255,255,.05);
  }
  .dc-screen {
    position: absolute; inset: 7px;
    background: #050914; border-radius: 2.5rem;
    overflow: hidden; box-shadow: inset 0 0 15px rgba(0,0,0,1);
    color: white; z-index: 10;
  }
  .dc-glare {
    position: absolute; inset: 0;
    background: linear-gradient(110deg, rgba(255,255,255,.08) 0%, rgba(255,255,255,0) 45%);
    z-index: 40; pointer-events: none;
  }
  .dc-island {
    position: absolute; top: 5px; left: 50%; transform: translateX(-50%);
    width: 100px; height: 28px; background: black; border-radius: 9999px;
    z-index: 50; display: flex; align-items: center; justify-content: flex-end; padding: 0 12px;
    box-shadow: inset 0 -1px 2px rgba(255,255,255,.1);
  }
  .dc-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #22c55e;
    box-shadow: 0 0 8px rgba(34,197,94,.8);
    animation: dc-pulse 2s ease-in-out infinite;
  }
  @keyframes dc-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }

  /* App UI */
  .dc-app {
    position: relative; width: 100%; height: 100%;
    padding: 48px 20px 32px; display: flex; flex-direction: column;
  }
  .dc-widget { visibility: hidden; }
  .dc-app-head {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 28px;
  }
  .dc-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: rgba(255,255,255,.05); color: #d4d4d4;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 13px;
    border: 1px solid rgba(255,255,255,.1); box-shadow: 0 5px 15px rgba(0,0,0,.5);
  }
  .dc-ring-wrap {
    position: relative; width: 176px; height: 176px;
    margin: 0 auto 24px;
    display: flex; align-items: center; justify-content: center;
    filter: drop-shadow(0 15px 25px rgba(0,0,0,.8));
  }
  .dc-ring {
    transform: rotate(-90deg); transform-origin: center;
    stroke-dasharray: 402; stroke-dashoffset: 402; stroke-linecap: round;
  }
  .dc-ring-center {
    position: absolute; display: flex; flex-direction: column; align-items: center; z-index: 10;
  }
  .dc-count { font-size: 2.5rem; font-weight: 900; letter-spacing: -0.05em; color: white; }
  .dc-rlabel {
    font-size: 8px; color: rgba(251,103,11,.55);
    text-transform: uppercase; letter-spacing: .1em; font-weight: 700; margin-top: 2px;
  }
  .dc-wcard {
    background: linear-gradient(180deg,rgba(255,255,255,.04) 0%,rgba(255,255,255,.01) 100%);
    box-shadow: 0 10px 20px rgba(0,0,0,.3), inset 0 1px 1px rgba(255,255,255,.05), inset 0 -1px 1px rgba(0,0,0,.5);
    border: 1px solid rgba(255,255,255,.03);
    border-radius: 16px; padding: 12px;
    display: flex; align-items: center; margin-bottom: 10px;
  }
  .dc-wicon {
    width: 40px; height: 40px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    margin-right: 12px; flex-shrink: 0;
  }
  .dc-wicon-or { background: linear-gradient(135deg,rgba(251,103,11,.2) 0%,rgba(251,103,11,.05) 100%); border: 1px solid rgba(251,103,11,.2); }
  .dc-wicon-gr { background: linear-gradient(135deg,rgba(34,197,94,.2) 0%,rgba(34,197,94,.05) 100%); border: 1px solid rgba(34,197,94,.2); }
  .dc-wl1 { height: 8px; width: 80px; background: #d4d4d4; border-radius: 9999px; margin-bottom: 8px; }
  .dc-wl2 { height: 6px; width: 48px; background: #525252; border-radius: 9999px; }
  .dc-home-bar {
    position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%);
    width: 120px; height: 4px; background: rgba(255,255,255,.2); border-radius: 9999px;
  }

  /* Floating badges */
  .dc-badge {
    visibility: hidden; position: absolute;
    display: flex; align-items: center; gap: 12px; z-index: 30;
    background: linear-gradient(135deg,rgba(255,255,255,.08) 0%,rgba(255,255,255,.01) 100%);
    backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
    box-shadow: 0 0 0 1px rgba(255,255,255,.1), 0 25px 50px -12px rgba(0,0,0,.8),
                inset 0 1px 1px rgba(255,255,255,.2), inset 0 -1px 1px rgba(0,0,0,.5);
    border-radius: 16px; padding: 12px 16px;
  }
  .dc-badge-icon {
    width: 40px; height: 40px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
    background: linear-gradient(180deg,rgba(251,103,11,.2) 0%,rgba(251,103,11,.05) 100%);
    border: 1px solid rgba(251,103,11,.3);
  }
  .dc-badge-t { color: white; font-size: 14px; font-weight: 700; letter-spacing: -0.01em; }
  .dc-badge-s { color: rgba(251,103,11,.55); font-size: 11px; font-weight: 500; }
  .dc-badge-1 { top: 24px; left: -15px; }
  .dc-badge-2 { bottom: 80px; right: -15px; }
  @media (min-width: 1024px) { .dc-badge-1 { top: 48px; left: -80px; } .dc-badge-2 { bottom: 80px; right: -80px; } }
`;

interface Props {
  tagline1?: string;
  tagline2?: string;
  cardHeading?: string;
  cardDesc?: string;
  brandName?: string;
  metricValue?: number;
  metricLabel?: string;
  ctaHeading?: string;
  ctaDesc?: string;
  ctaPrimaryText?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryText?: string;
  ctaSecondaryHref?: string;
}

export default function DistribuidorCinematic({
  tagline1 = "Tecnología y",
  tagline2 = "Logística.",
  cardHeading = "Control Total.\nEn tus manos.",
  cardDesc = "Nuestra plataforma te permite gestionar pedidos, monitorear entregas y optimizar tu inventario en tiempo real desde cualquier dispositivo.",
  brandName = "GO",
  metricValue = 65,
  metricLabel = "Años",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef      = useRef<HTMLDivElement>(null);
  const phoneRef     = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);

  /* ── Mouse tilt ── */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 2) return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (!cardRef.current || !phoneRef.current) return;
        const r = cardRef.current.getBoundingClientRect();
        cardRef.current.style.setProperty("--mouse-x", `${e.clientX - r.left}px`);
        cardRef.current.style.setProperty("--mouse-y", `${e.clientY - r.top}px`);
        window.gsap?.to(phoneRef.current, {
          rotationY: (e.clientX / window.innerWidth - 0.5) * 2 * 12,
          rotationX: -(e.clientY / window.innerHeight - 0.5) * 2 * 12,
          ease: "power3.out", duration: 1.2,
        });
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(rafRef.current); };
  }, []);

  /* ── Cinematic scroll timeline ── */
  useEffect(() => {
    const gsap = window.gsap;
    const ST   = window.ScrollTrigger;
    if (!gsap || !ST) return;

    const mobile = window.innerWidth < 768;
    const ctx = gsap.context(() => {

      /* Initial states — card invisible so it never bleeds over stats section */
      gsap.set(".dc-t1",  { autoAlpha: 0, y: 60, scale: 0.85, filter: "blur(20px)", rotationX: -15 });
      gsap.set(".dc-t2",  { autoAlpha: 0, y: 40, filter: "blur(16px)" });
      gsap.set(".dc-card", { y: window.innerHeight + 500, autoAlpha: 0 }); // Deeper start
      gsap.set(".dc-final", { autoAlpha: 0, y: 40 });
      gsap.set([".dc-left", ".dc-right", ".dc-phone-wrap", ".dc-badge", ".dc-widget"], { autoAlpha: 0 });
      gsap.set(containerRef.current, { backgroundColor: "transparent" }); // Transparent initially

      /* Single scroll timeline — text lives inside the card, revealed after card enters */
      gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=3000",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      })
        /* 0 ── Container background becomes solid as card enters */
        .to(containerRef.current, { backgroundColor: "var(--bg-body)", duration: 1 }, 0.5)
        /* 1 ── Card fades in and flies up from below */
        .to(".dc-card",  { y: 0, autoAlpha: 1, ease: "power3.inOut", duration: 3 }, 0.8)
        /* 2 ── Text reveals once card is centered (same font size = symmetric) */
        .to(".dc-t1", { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", rotationX: 0, ease: "expo.out", duration: 2 }, 2.2)
        .to(".dc-t2", { autoAlpha: 1, y: 0, filter: "blur(0px)", ease: "expo.out", duration: 1.8 }, 3.2)
        /* 3 ── Hold text visible */
        .to({}, { duration: 1.0 })
        /* 4 ── Text fades, card expands */
        .to([".dc-t1", ".dc-t2"], { autoAlpha: 0, y: -30, filter: "blur(8px)", duration: 1, ease: "power2.in" })
        .to(".dc-card",  { width: "100%", height: "100%", borderRadius: "0px", ease: "power3.inOut", duration: 1.5 }, "<0.3")
        /* 5 ── Phone + widgets appear */
        .fromTo(".dc-phone-wrap",
          { y: 300, z: -500, rotationX: 50, rotationY: -30, autoAlpha: 0, scale: 0.6 },
          { y: 0,   z: 0,    rotationX: 0,  rotationY: 0,   autoAlpha: 1, scale: 1, ease: "expo.out", duration: 2.5 }, "-=0.8"
        )
        .fromTo(".dc-widget", { y: 40, autoAlpha: 0, scale: 0.95 },
                              { y: 0,  autoAlpha: 1, scale: 1, stagger: 0.15, ease: "back.out(1.2)", duration: 1.5 }, "-=1.5")
        /* 6 ── Ring counter */
        .to(".dc-ring",  { strokeDashoffset: 60, duration: 2, ease: "power3.inOut" }, "-=1.2")
        .to(".dc-count", { innerHTML: metricValue, snap: { innerHTML: 1 }, duration: 2, ease: "expo.out" }, "-=2.0")
        /* 7 ── Badges + side text */
        .fromTo(".dc-badge", { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: -10 },
                             { y: 0,   autoAlpha: 1, scale: 1, rotationZ: 0, ease: "back.out(1.5)", duration: 1.5, stagger: 0.2 }, "-=2.0")
        .fromTo(".dc-left",  { x: -50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.5 }, "-=1.5")
        .fromTo(".dc-right", { x:  50, autoAlpha: 0, scale: 0.8 }, { x: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.5 }, "<")
        /* 8 ── Hold full content */
        .to({}, { duration: 1.5 })
        /* 9 ── Exit card content + collapse back to rounded */
        .to([".dc-phone-wrap", ".dc-badge", ".dc-left", ".dc-right"],
          { scale: 0.9, y: -40, z: -200, autoAlpha: 0, ease: "power3.in", duration: 1.2, stagger: 0.05 })
        .to(".dc-card", {
          width: mobile ? "92vw" : "85vw",
          height: mobile ? "92vh" : "85vh",
          borderRadius: mobile ? "32px" : "40px",
          ease: "expo.inOut", duration: 1.8,
        }, "<0.4")
        /* 10 ── Card flies up and fades out, Final message fades in */
        .to(".dc-card", { autoAlpha: 0, duration: 0.8, ease: "power2.in" })
        .to(".dc-final", { autoAlpha: 1, y: 0, ease: "expo.out", duration: 1.2 }, "-=0.2")
        .to(containerRef.current, { backgroundColor: "transparent", duration: 0.5 }, "<")
        .to(".dc-card", { y: -(window.innerHeight + 500), duration: 1.2, ease: "none" }, "<")
        /* 11 ── Final message fades out and moves up to transition to form */
        .to(".dc-final", { autoAlpha: 0, y: -100, ease: "power2.in", duration: 1.0 });

    }, containerRef);

    // Actualizar posiciones de todos los triggers tras añadir el pin de 3000px
    requestAnimationFrame(() => { ST.refresh(); });

    return () => ctx.revert();
  }, [metricValue]);

  return (
    <div ref={containerRef} className="dc-root">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="dc-grain" aria-hidden="true" />
      <div className="dc-grid"  aria-hidden="true" />

      {/* ── Final Message (fills the void) ── */}
      <div className="dc-final">
        <h2 className="dc-final-h">Tu operación, <br /><span>a otro nivel.</span></h2>
        <p className="dc-final-p">
          Únete a la red de distribuidores más grande de México y maximiza tu rentabilidad hoy mismo.
        </p>
        <div className="dc-scroll-down">
          <span>Completa tu solicitud</span>
          <svg className="dc-arrow-bounce" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </div>
      </div>

      {/* ── Dark card ── */}
      <div className="dc-card-wrap">
        <div ref={cardRef} className="dc-card">
          <div className="dc-sheen" aria-hidden="true" />

          {/* ── Hero text INSIDE the card so never bleeds onto white bg ── */}
          <div className="dc-hero">
            <h2 className="dc-t1">{tagline1}</h2>
            <h2 className="dc-t2">{tagline2}</h2>
          </div>

          <div className="dc-card-body">

            {/* Orange logo – right on desktop */}
            <div className="dc-right">
              <img
                src="/images/logo/Logo.svg"
                alt="Grupo Ortiz"
                className="dc-logo-img"
                loading="lazy"
              />
            </div>

            {/* Phone – center */}
            <div className="dc-phone-wrap">
              <div className="dc-phone-scale">
                <div ref={phoneRef} className="dc-iphone">
                  {/* Hardware buttons */}
                  <div className="dc-hw-btn" style={{ top: 120, left: -3, width: 3, height: 25, borderRadius: "4px 0 0 4px" }} aria-hidden="true" />
                  <div className="dc-hw-btn" style={{ top: 160, left: -3, width: 3, height: 45, borderRadius: "4px 0 0 4px" }} aria-hidden="true" />
                  <div className="dc-hw-btn" style={{ top: 220, left: -3, width: 3, height: 45, borderRadius: "4px 0 0 4px" }} aria-hidden="true" />
                  <div className="dc-hw-btn" style={{ top: 170, right: -3, width: 3, height: 70, borderRadius: "0 4px 4px 0" }} aria-hidden="true" />

                  <div className="dc-screen">
                    <div className="dc-glare" aria-hidden="true" />
                    <div className="dc-island">
                      <div className="dc-dot" />
                    </div>

                    <div className="dc-app">
                      {/* Header */}
                      <div className="dc-widget dc-app-head">
                        <div>
                          <span style={{ fontSize: 9, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, display: "block", marginBottom: 3 }}>Hoy</span>
                          <span style={{ fontSize: 19, fontWeight: 700, color: "white", letterSpacing: "-0.02em" }}>Mis Pedidos</span>
                        </div>
                        <div className="dc-avatar">GO</div>
                      </div>

                      {/* Circular counter */}
                      <div className="dc-widget dc-ring-wrap">
                        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden="true">
                          <circle cx="88" cy="88" r="64" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="12" />
                          <circle className="dc-ring" cx="88" cy="88" r="64" fill="none" stroke="#fb670b" strokeWidth="12" />
                        </svg>
                        <div className="dc-ring-center">
                          <span className="dc-count">0</span>
                          <span className="dc-rlabel">{metricLabel}</span>
                        </div>
                      </div>

                      {/* Widget cards */}
                      <div>
                        <div className="dc-widget dc-wcard">
                          <div className="dc-wicon dc-wicon-or">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fb670b" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                          </div>
                          <div>
                            <div className="dc-wl1" />
                            <div className="dc-wl2" />
                          </div>
                        </div>
                        <div className="dc-widget dc-wcard">
                          <div className="dc-wicon dc-wicon-gr">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <div className="dc-wl1" />
                            <div className="dc-wl2" />
                          </div>
                        </div>
                      </div>
                      <div className="dc-home-bar" />
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="dc-badge dc-badge-1">
                  <div className="dc-badge-icon">🚚</div>
                  <div>
                    <p className="dc-badge-t">Envío 24h</p>
                    <p className="dc-badge-s">Despacho inmediato</p>
                  </div>
                </div>
                <div className="dc-badge dc-badge-2">
                  <div className="dc-badge-icon">📦</div>
                  <div>
                    <p className="dc-badge-t">Pedido listo</p>
                    <p className="dc-badge-s">Stock garantizado</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Left text block */}
            <div className="dc-left">
              <p className="dc-left-tag">Distribuidor Oficial</p>
              <h3 className="dc-left-h">{cardHeading}</h3>
              <p className="dc-left-p">
                Con <strong>Grupo Ortiz</strong> obtienes precios directos
                de fábrica, stock garantizado y entregas en 24 h para
                maximizar tu margen.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
