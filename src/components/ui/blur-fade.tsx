import { useRef, useEffect } from "react"
import { motion, useInView, useAnimation } from "motion/react"

interface BlurFadeProps {
  children: React.ReactNode
  className?: string
  variant?: {
    hidden: { y: number }
    visible: { y: number }
  }
  duration?: number
  delay?: number
  yOffset?: number
  inView?: boolean
  inViewMargin?: string
  blur?: string
}

export function BlurFade({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  yOffset = 8,
  inView = false,
  inViewMargin = "-50px",
  blur = "8px",
}: BlurFadeProps) {
  const ref = useRef(null)
  const controls = useAnimation()
  const isInView = useInView(ref, { once: false, margin: inViewMargin as any })

  const defaultVariants = {
    hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: 0, opacity: 1, filter: "blur(0px)" },
  }
  const combinedVariants = variant || defaultVariants

  useEffect(() => {
    if (!inView) return
    if (isInView) {
      controls.start("visible")
    } else {
      controls.set("hidden")
    }
  }, [isInView, inView, controls])

  return (
    <motion.div
      ref={ref}
      initial={inView ? "hidden" : "visible"}
      animate={inView ? controls : "visible"}
      variants={combinedVariants}
      transition={{ delay: 0.04 + delay, duration, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
