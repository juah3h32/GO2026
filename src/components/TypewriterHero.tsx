import { Typewriter } from "./ui/typewriter"

interface TypewriterHeroProps {
  words: string[]
  label?: string
  speed?: number
  delayBetweenWords?: number
}

export default function TypewriterHero({
  words,
  label = "Fabricamos",
  speed = 70,
  delayBetweenWords = 2200,
}: TypewriterHeroProps) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      margin: "clamp(18px, 3vh, 36px) 0 clamp(22px, 3.5vh, 40px)",
    }}>
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "14px",
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.14)",
        borderRadius: "999px",
        padding: "8px 22px 8px 10px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
      }}>

        {/* Orange label pill */}
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          background: "#fb670b",
          color: "#fff",
          fontSize: "clamp(0.5rem, 1.1vw, 0.6rem)",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          padding: "5px 13px",
          borderRadius: "999px",
          flexShrink: 0,
          lineHeight: 1,
        }}>
          {label}
        </span>

        {/* Separator */}
        <span style={{
          display: "block",
          width: "1px",
          height: "14px",
          background: "rgba(255,255,255,0.2)",
          flexShrink: 0,
        }} />

        {/* Typewriter text */}
        <span style={{
          fontSize: "clamp(0.75rem, 1.6vw, 0.95rem)",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.92)",
          minWidth: "clamp(120px, 18vw, 220px)",
          textAlign: "left",
          lineHeight: 1,
        }}>
          <Typewriter
            words={words}
            speed={speed}
            delayBetweenWords={delayBetweenWords}
            cursor
            cursorChar="|"
          />
        </span>
      </div>
    </div>
  )
}
