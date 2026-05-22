---
name: i18n System
description: How translations are organized and consumed across pages and components
type: project
---

**Files**: `src/i18n/{es,en,pt,zh,ar}.ts` (~1300 lines each, single `export const <lang> = { ... }`) + `src/i18n/index.ts` that re-exports `languages` (label map) and `translations` (full dictionary keyed by lang code).

**Top-level keys per dictionary**: nav, hero, common, chatbot, pwa, promociones, catalog, products_list, stretch_film, cuerdas, rafias, arpillas, sacos, esquineros, flexible_packaging, distribuidor, quienes_somos, impacto_social, home, footer.

**Consumption pattern** (used in every page under `src/pages/[lang]/`):
```astro
import { languages, translations } from "../../i18n";
export function getStaticPaths() {
  return Object.keys(languages).map((lang) => ({ params: { lang } }));
}
const { lang } = Astro.params;
const currentLang = (lang && lang in translations) ? lang : 'es';
const t = translations[currentLang as keyof typeof translations];
const pageData = t.<section>;  // e.g. t.cuerdas, t.home
```

**RTL handling**: Arabic is detected via `currentLang === 'ar'` and `dir={isRTL ? 'rtl' : 'ltr'}` is set on the relevant section (see about.astro).

**Components that consume translations directly**: Nadbar.astro (nav), Footer.astro (footer), BotGO.jsx (chatbot.*), BaseLayout.astro (pwa.* fallback).

**Routing**: `/` redirects to `/${detected-lang}/` based on Accept-Language header (src/pages/index.astro). Hreflang tags in BaseLayout cover all 5 langs + x-default.

**Adding a new translation key**: must be added in ALL 5 files to avoid runtime undefined access. Many pages cast `t as any` to bypass strict checking — be careful, missing keys won't fail TypeScript build.
