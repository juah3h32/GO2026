// src/lib/product-page-videos.js
// Mapea el public_id de Cloudinary (campo `video` de cada variante, en los
// i18n) al slot_key de Bunny usado en la tabla `product_videos` — por nombre
// de archivo, ya que son fijos y pocos por pagina. Compartido por las paginas
// de producto individual (stretch-film, sacos, flexible, esquineros,
// arpillas, cuerdas, rafias) para no duplicar el mapeo 7 veces.
const BASENAME_TO_SLOT = {
  'fondo':               'pg-stretch-film',
  'slaminar':            'pg-sacos-slaminar',
  'transp':              'pg-sacos-transp',
  'eco':                 'pg-sacos-eco',
  'bobinaf':             'pg-flexible-bobinaf',
  'standup':             'pg-flexible-standup',
  'standup-origanics':   'pg-flexible-standup-origanics',
  'bolsa-alto-vacio':    'pg-flexible-bolsa-alto-vacio',
  'esquinero':           'pg-esquineros',
  'circular':            'pg-arpilla-circular',
  'mono':                'pg-arpilla-mono',
  'costura':             'pg-arpilla-costura',
  'etiqueta':            'pg-arpilla-etiqueta',
  'cuerda-1':            'pg-cuerda-1',
  'cuerdai':             'pg-cuerda-i',
  'cuerdae':             'pg-cuerda-e',
  'fondon':              'pg-rafia-n',
  'fondoe':              'pg-rafia-e',
  'fondor':              'pg-rafia-r',
};

// bunnyVideos: resultado de readProductVideos(). cloudinaryPath: el campo
// `video` tal cual viene del i18n (ej "GO/stretch/fondo" o "GO/sacos/eco.mp4").
// Devuelve la URL mp4 directa de Bunny, o null si ese slot no tiene video.
export function bunnySrcForProductVideo(bunnyVideos, cloudinaryPath, pullzone) {
  if (!cloudinaryPath) return null;
  const basename = cloudinaryPath.split('/').pop().replace(/\.mp4$/i, '').toLowerCase();
  const slot = BASENAME_TO_SLOT[basename];
  if (!slot || !bunnyVideos[slot]) return null;
  return `https://${pullzone}/${bunnyVideos[slot]}/play_1080p.mp4`;
}
