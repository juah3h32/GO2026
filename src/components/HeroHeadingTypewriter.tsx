import React from 'react';
import { Typewriter } from "./ui/typewriter"

interface HeroHeadingTypewriterProps {
  prefix: string
  words: string[]
  speed?: number
  delayBetweenWords?: number
}

export default function HeroHeadingTypewriter({
  prefix,
  words,
  speed = 75,
  delayBetweenWords = 2400,
}: HeroHeadingTypewriterProps) {
  const handleWordChange = (index: number) => {
    window.dispatchEvent(new CustomEvent('hero-line3-change', { detail: index }))
  }

  return (
    <>
      {prefix}&nbsp;
      <em>
        <Typewriter
          words={words}
          speed={speed}
          delayBetweenWords={delayBetweenWords}
          cursor
          cursorChar="_"
          onWordChange={handleWordChange}
        />
      </em>
    </>
  )
}
