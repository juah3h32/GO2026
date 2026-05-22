import { BlurFade } from "./ui/blur-fade"

interface Props {
  title: string
  className?: string
}

// Parses "Word1 <br>Word2 <span>Word3</span>" into animated lines
export default function HeroTitleBlur({ title, className = "" }: Props) {
  const lines: Array<{ text: string; isEmphasis: boolean }> = []

  title.split(/<br\s*\/?>/i).forEach((part) => {
    const spanMatch = part.match(/<span[^>]*>(.*?)<\/span>/i)
    if (spanMatch) {
      const before = part.replace(/<span[^>]*>.*?<\/span>/gi, "").trim()
      if (before) lines.push({ text: before, isEmphasis: false })
      lines.push({ text: spanMatch[1], isEmphasis: true })
    } else {
      const text = part.trim()
      if (text) lines.push({ text, isEmphasis: false })
    }
  })

  return (
    <div className={`hero-blur-title ${className}`} role="heading" aria-level={1}>
      {lines.map((line, i) => (
        <BlurFade key={i} inView delay={i * 0.2} duration={0.7} yOffset={40} blur="18px">
          <span className={line.isEmphasis ? "title-emphasis" : "title-line"}>
            {line.text}
          </span>
        </BlurFade>
      ))}
    </div>
  )
}
