import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function QuienesSomos() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });

      gsap.from(textRef.current, {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="quienes-somos-wrapper">
      <div className="full-bg"></div>

      <h1 ref={titleRef} className="quienes-title">QUIÉNES SOMOS</h1>
      <p ref={textRef} className="quienes-text">
        Grupo Ortiz es una empresa mexicana líder en la fabricación de soluciones
        de empaque y materiales industriales, con más de 65 años de experiencia en
        el mercado.
        <br /><br />
        A lo largo de nuestra trayectoria nos hemos consolidado como uno de los
        principales fabricantes de América Latina, ofreciendo productos de alta
        calidad para diversos sectores industriales.
      </p>

      <style>{`
        /* Definir variables globales si aún no existen */
        :root {
          --carousel-bg-gradient: linear-gradient(70deg, #fb670b, rgb(42, 42, 44));
        }
        html.dark {
          --carousel-bg-gradient: linear-gradient(70deg, #ff6600, #222222);
        }

        .quienes-somos-wrapper {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          position: relative;
          overflow: hidden;
          background: transparent;
          font-family: 'Poppins', sans-serif;
        }

        .full-bg {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 2000px;
          height: 1200px;
          background-image: var(--carousel-bg-gradient);
          border-radius: 20% 30% 80% 10%;
          filter: blur(150px);
          transform: translate(-50%, -50%);
          z-index: -1;
          transition: all 1s ease;
        }

        .quienes-title {
          color: #FB670B;
          font-size: 72px;
          font-weight: 700;
          margin-bottom: 32px;
          letter-spacing: 2px;
          z-index: 2;
          position: relative;
        }

        .quienes-text {
          max-width: 900px;
          font-size: 18px;
          line-height: 1.8;
          color: #ffffff;
          opacity: 0.85;
          z-index: 2;
          position: relative;
        }

        @media (max-width: 768px) {
          .quienes-title { font-size: 42px; }
          .quienes-text { font-size: 15px; }
          .full-bg { width: 1500px; height: 900px; filter: blur(100px); }
        }
      `}</style>
    </section>
  );
}
