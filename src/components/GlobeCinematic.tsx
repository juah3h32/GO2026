import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import WireframeDottedGlobe from "./WireframeDottedGlobe"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface GlobeCinematicProps {
  tag?: string
  title?: string
  titleEm?: string
}

export default function GlobeCinematic({
  tag = "PRESENCIA GLOBAL",
  title = "EXPORTAMOS AL",
  titleEm = "MUNDO",
}: GlobeCinematicProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Estado inicial
      gsap.set(".gcin-text", { autoAlpha: 1, y: 0, filter: "blur(0px)" })
      gsap.set(".gcin-globe", { autoAlpha: 0, y: 160, scale: 0.8, filter: "blur(12px)" })
      gsap.set(".gcin-hint", { autoAlpha: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=2800",
          pin: true,
          scrub: 1.4,
          anticipatePin: 1,
        },
      })

      tl
        // Texto sale hacia arriba con blur
        .to(".gcin-text", {
          y: -100,
          autoAlpha: 0,
          filter: "blur(20px)",
          ease: "power2.inOut",
          duration: 1.5,
        }, 0)
        // Globo sube desde abajo
        .to(".gcin-globe", {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          ease: "expo.out",
          duration: 3,
        }, 0.4)
        // Hint aparece
        .to(".gcin-hint", {
          autoAlpha: 0.55,
          ease: "power2.out",
          duration: 1,
        }, 2.5)
        // Hold
        .to({}, { duration: 3.5 })
        // Exit: globo se va con escala y blur
        .to(".gcin-globe", {
          scale: 0.88,
          autoAlpha: 0,
          filter: "blur(10px)",
          ease: "power2.in",
          duration: 1.5,
        })
        .to(".gcin-hint", { autoAlpha: 0, duration: 0.5 }, "<")
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="gcin-section">

      {/* Grid de fondo sutil */}
      <div className="gcin-grid" aria-hidden="true" />

      {/* Fase 1 — Texto */}
      <div className="gcin-text">
        <p className="gcin-tag">
          <span className="gcin-tag__line" />
          {tag}
          <span className="gcin-tag__line" />
        </p>
        <h2 className="gcin-title">
          {title}
          <br />
          <em className="gcin-title__em">{titleEm}</em>
        </h2>
      </div>

      {/* Fase 2 — Globo */}
      <div className="gcin-globe">
        <WireframeDottedGlobe width={700} height={700} />
      </div>

      {/* Hint de interacción */}
      <p className="gcin-hint">Arrastra para rotar</p>
    </div>
  )
}
