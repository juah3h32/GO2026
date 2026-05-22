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
        />
      </em>
    </>
  )
}
