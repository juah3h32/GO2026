// src/pages/api/reports/git-status.ts
// Devuelve los archivos modificados/nuevos (git status) mapeados a rutas de página.
// Permite capturar cambios aunque no hayan sido commiteados ni pusheados.

import type { APIRoute } from 'astro';
import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Mapea un path de archivo a la ruta de la página correspondiente
function fileToPagePath(file: string): string | null {
  // Páginas Astro: src/pages/[lang]/acolchado.astro → /es/acolchado/
  const pageMatch = file.match(/src\/pages\/(?:\[lang\]|es|en|pt|ar|zh)\/(.+?)\.astro$/);
  if (pageMatch) {
    const name = pageMatch[1];
    return name === 'index' ? '/es/' : `/es/${name}/`;
  }

  // Imágenes de sección: public/images/acolchado/ → /es/acolchado/
  const imgSectionMatch = file.match(/public\/images\/([a-z][a-z0-9-]+)\//);
  if (imgSectionMatch) {
    const sec = imgSectionMatch[1];
    const SKIP = ['logo', 'icons', 'og', 'banners', 'carrusel', 'divisiones'];
    if (!SKIP.includes(sec)) return `/es/${sec}/`;
  }

  // Videos del carrusel o divisiones → home (divisiones section)
  if (file.match(/public\/videos\/(carrusel|divisiones)\//)) return '/es/';

  // Videos de sección específica
  const vidSectionMatch = file.match(/public\/videos\/([a-z][a-z0-9-]+)\//);
  if (vidSectionMatch && vidSectionMatch[1] !== 'carrusel') return `/es/${vidSectionMatch[1]}/`;

  // Componentes clave → home
  if (file.includes('src/components/Navbar') || file.includes('Nadbar') ||
      file.includes('src/components/VideoWithFallback') ||
      file.includes('src/styles/home')) return '/es/';

  // Estilos de sección: src/styles/cuerdas.css → /es/cuerdas/
  const styleMatch = file.match(/src\/styles\/([a-z][a-z0-9-]+)\.css$/);
  if (styleMatch) return `/es/${styleMatch[1]}/`;

  // i18n / middleware → home (cambios de idioma visibles en todas las páginas)
  if (file.includes('src/i18n/') || file.includes('src/middleware')) return '/es/';

  return null;
}

function fileToLabel(file: string, path: string): string {
  // Label descriptivo basado en el archivo
  if (file.includes('src/pages')) {
    const m = file.match(/\/([a-z][a-z0-9-]+)\.astro$/);
    return m ? m[1].charAt(0).toUpperCase() + m[1].slice(1) : 'Página';
  }
  if (file.includes('public/images/')) return `Imágenes · ${path.replace('/es/', '').replace('/', '') || 'Home'}`;
  if (file.includes('public/videos/')) return `Videos · ${path.replace('/es/', '').replace('/', '') || 'Home'}`;
  if (file.includes('src/styles/')) return `Estilos · ${path.replace('/es/', '').replace('/', '') || 'General'}`;
  if (file.includes('src/i18n/')) return 'Traducciones';
  if (file.includes('src/components/')) {
    const m = file.match(/\/([A-Za-z]+)\.(astro|jsx|tsx)$/);
    return m ? m[1] : 'Componente';
  }
  return path.replace('/es/', '').replace('/', '') || 'Home';
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const adminRole = await verifyAdminToken(request);
    if (!adminRole) return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), { status: 401 });

    // git status --porcelain: cada línea = "XY filename"
    const { stdout } = await execAsync('git status --porcelain', { cwd: process.cwd() });

    const changedFiles = stdout
      .split('\n')
      .filter(Boolean)
      .map(line => line.slice(3).trim().split(' -> ').pop()!); // handle renames

    // Mapear archivos → páginas (deduplicar)
    const seenPaths = new Set<string>();
    const changes: { path: string; label: string; files: string[] }[] = [];

    for (const file of changedFiles) {
      const path = fileToPagePath(file);
      if (!path) continue;
      if (seenPaths.has(path)) {
        // Agregar el archivo a la entrada existente
        const existing = changes.find(c => c.path === path);
        if (existing && !existing.files.includes(file)) existing.files.push(file);
        continue;
      }
      seenPaths.add(path);
      changes.push({ path, label: fileToLabel(file, path), files: [file] });
    }

    return new Response(JSON.stringify({ ok: true, changes, total: changedFiles.length }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[git-status]', err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
};
