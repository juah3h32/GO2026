import { BlurFade } from "./ui/blur-fade"

interface BlurFadeCTAProps {
  tag: string
  title: string
  titleEm: string
  sub: string
  btnText: string
  btnHref: string
}

export default function BlurFadeCTA({ tag, title, titleEm, sub, btnText, btnHref }: BlurFadeCTAProps) {
  return (
    <div className="cta__inner">
      <BlurFade inView delay={0} duration={0.45} yOffset={20} blur="6px">
        <p className="section-tag">{tag}</p>
      </BlurFade>

      <BlurFade inView delay={0.08} duration={0.5} yOffset={24} blur="8px">
        <h2 className="cta__heading">
          {title} <em>{titleEm}</em>
        </h2>
      </BlurFade>

      <BlurFade inView delay={0.16} duration={0.5} yOffset={20} blur="6px">
        <p className="cta__sub">{sub}</p>
      </BlurFade>

      <BlurFade inView delay={0.24} duration={0.45} yOffset={16} blur="4px">
        <a href={btnHref} className="btn btn--solid btn--xl">
          {btnText}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </BlurFade>
    </div>
  )
}
