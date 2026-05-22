"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MinimalistHeroProps {
  logoText?: string;
  navLinks?: { label: string; href: string }[];
  mainText: string;
  ctaText?: string;
  readMoreLink: string;
  imageSrc: string;
  imageAlt: string;
  overlayText: {
    part1: string;
    part2: string;
  };
  socialLinks?: { icon: LucideIcon; href: string }[];
  locationText?: string;
  hideHeader?: boolean;
  circleColor?: string;
  className?: string;
}

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="text-sm font-medium tracking-widest text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
  >
    {children}
  </a>
);

const SocialIcon = ({ href, icon: Icon }: { href: string; icon: LucideIcon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-zinc-400 transition-colors hover:text-[#fb670b] dark:text-zinc-500 dark:hover:text-[#fb670b]"
  >
    <Icon className="h-5 w-5" />
  </a>
);

export const MinimalistHero = ({
  logoText = 'GO',
  navLinks = [],
  mainText,
  ctaText = 'Comenzar',
  readMoreLink,
  imageSrc,
  imageAlt,
  overlayText,
  socialLinks = [],
  locationText,
  hideHeader = false,
  circleColor = '#fb670b',
  className,
}: MinimalistHeroProps) => {
  return (
    <div
      className={cn(
        'relative flex w-full flex-col items-center justify-between overflow-hidden',
        'px-6 md:px-12',
        hideHeader ? 'h-screen pt-[80px] pb-6' : 'h-screen p-8 md:p-12',
        className
      )}
    >
      {/* Header interno — oculto cuando el Nadbar ya gestiona la navegación */}
      {!hideHeader && (
        <header className="z-30 flex w-full max-w-7xl items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl font-bold tracking-wider text-zinc-900 dark:text-white"
          >
            {logoText}
          </motion.div>

          <div className="hidden items-center space-x-8 md:flex">
            {navLinks.map((link) => (
              <NavLink key={link.label} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col space-y-1.5 md:hidden"
            aria-label="Open menu"
          >
            <span className="block h-0.5 w-6 bg-zinc-900 dark:bg-white" />
            <span className="block h-0.5 w-6 bg-zinc-900 dark:bg-white" />
            <span className="block h-0.5 w-5 bg-zinc-900 dark:bg-white" />
          </motion.button>
        </header>
      )}

      {/* Área principal — 3 columnas en desktop */}
      <div className="relative grid w-full max-w-7xl flex-grow grid-cols-1 items-center gap-4 md:grid-cols-3">

        {/* Col 1 — Texto izquierdo + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="z-20 order-2 md:order-1 flex flex-col items-center md:items-start text-center md:text-left"
        >
          <p
            className="max-w-[280px] text-sm leading-relaxed text-zinc-500 dark:text-zinc-400"
          >
            {mainText}
          </p>

          <a
            href={readMoreLink}
            className="mt-7 inline-flex items-center gap-2 rounded-full px-7 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 hover:gap-3 hover:shadow-lg"
            style={{ backgroundColor: circleColor }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#000'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = circleColor; }}
          >
            {ctaText}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>

        {/* Col 2 — Imagen centrada con círculo sólido */}
        <div className="relative order-1 md:order-2 flex h-full min-h-[380px] items-center justify-center">
          {/* Círculo sólido de fondo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.9 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="absolute h-[300px] w-[300px] rounded-full md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px]"
            style={{ backgroundColor: circleColor }}
          />
          {/* Imagen del teléfono escalada 1.5× */}
          <motion.img
            src={imageSrc}
            alt={imageAlt}
            className="relative z-10 h-auto w-56 scale-150 object-contain md:w-64 lg:w-72"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              t.onerror = null;
              t.src = `https://placehold.co/400x700/fb670b/ffffff?text=GO`;
            }}
          />
        </div>

        {/* Col 3 — Texto display grande */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="z-20 order-3 flex items-center justify-center text-center md:justify-start md:text-left"
        >
          <h1
            className="text-7xl font-black uppercase leading-[0.9] tracking-tight text-zinc-900 dark:text-white md:text-8xl lg:text-9xl"
            style={{ fontFamily: 'var(--font-display, Impact, Arial Black, sans-serif)' }}
          >
            {overlayText.part1}
            <br />
            <span style={{ color: circleColor }}>{overlayText.part2}</span>
          </h1>
        </motion.div>
      </div>

      {/* Footer — redes sociales + ubicación */}
      {(socialLinks.length > 0 || locationText) && (
        <footer className="z-30 flex w-full max-w-7xl items-center justify-between pt-2">
          {socialLinks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="flex items-center gap-4"
            >
              {socialLinks.map((link, i) => (
                <SocialIcon key={i} href={link.href} icon={link.icon} />
              ))}
            </motion.div>
          )}

          {locationText && (
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.3 }}
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500"
            >
              {locationText}
            </motion.span>
          )}
        </footer>
      )}
    </div>
  );
};
