import React from 'react';
import {
  ProgressSlider,
  SliderContent,
  SliderWrapper,
  SliderBtnGroup,
  SliderBtn,
} from './ProgressSlider';

interface TimelineItem {
  num: string;
  title: string;
  desc: string;
  desc_short?: string;
  img: string;
  isVideo?: boolean;
  poster?: string;
}

interface Props {
  title: string;
  subtitle: string;
  items: TimelineItem[];
}

export default function ImpactoTimeline({ title, subtitle, items }: Props) {
  const firstId = items[0]?.num ?? '01';

  return (
    <section className="it-section">
      {/* ── Header ── */}
      <div className="it-header">
        <h2 className="it-title">{title}</h2>
        <p className="it-sub">{subtitle}</p>
      </div>

      <div className="it-wrap">
        <ProgressSlider 
          activeSlider={firstId} 
          values={items.map((item) => item.num)}
          duration={5000} 
          className="it-root"
        >

          {/* ── Zona de medios — imagen/video grande ── */}
          <SliderContent className="it-media-zone">
            {items.map((item) => (
              <SliderWrapper key={item.num} value={item.num} className="it-media-fill">
                {item.isVideo ? (
                  <video
                    src={item.img}
                    autoPlay muted loop playsInline
                    poster={item.poster}
                    className="it-media"
                  />
                ) : (
                  <img
                    src={item.img}
                    alt={item.title}
                    loading="lazy"
                    className="it-media"
                  />
                )}
                {/* Gradient inferior para fusionar con la nav */}
                <div className="it-media-vignette" aria-hidden="true" />
              </SliderWrapper>
            ))}
          </SliderContent>

          {/* ── Barra de tabs inferior ── */}
          <SliderBtnGroup className="it-nav">
            {items.map((item) => (
              <SliderBtn
                key={item.num}
                value={item.num}
                className="it-item"
                progressBarClass="it-progress"
              >
                {/* número pequeño */}
                <span className="it-num">{item.num}</span>
                {/* título */}
                <strong className="it-name">{item.title}</strong>
                {/* descripción */}
                <p className="it-desc">{item.desc}</p>
              </SliderBtn>
            ))}
          </SliderBtnGroup>

        </ProgressSlider>
      </div>
    </section>
  );
}
