// src/components/SplitText.jsx
import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText'; // Requiere Licencia
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

const SplitText = ({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-10px',
  textAlign = 'center',
  tag = 'p',
  onLetterAnimationComplete
}) => {
  const ref = useRef(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if (document.fonts.status === 'loaded') {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => setFontsLoaded(true));
    }
  }, []);

  useGSAP(() => {
      if (!ref.current || !text || !fontsLoaded) return;
      const el = ref.current;
      
      // Limpieza previa
      if (el._rbsplitInstance) {
        try { el._rbsplitInstance.revert(); } catch (_) {}
        el._rbsplitInstance = null;
      }

      const splitInstance = new GSAPSplitText(el, {
        type: splitType,
        linesClass: 'split-line',
        wordsClass: 'split-word',
        charsClass: 'split-char',
      });

      let targets = (splitType.includes('chars') && splitInstance.chars.length) ? splitInstance.chars :
                    (splitType.includes('words') && splitInstance.words.length) ? splitInstance.words :
                    splitInstance.lines;

      gsap.fromTo(targets, 
        { ...from },
        {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          scrollTrigger: {
            trigger: el,
            start: "top 85%", 
            end: "bottom 15%",
            toggleActions: "play reverse play reverse", // Para que se reinicie al subir/bajar
          }
        }
      );

      el._rbsplitInstance = splitInstance;
    },
    { dependencies: [text, fontsLoaded, delay, duration], scope: ref }
  );

  const Tag = tag;
  return (
    <Tag ref={ref} className={className} style={{ textAlign, willChange: 'transform, opacity' }}>
      {text}
    </Tag>
  );
};

export default SplitText;