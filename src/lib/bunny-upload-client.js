// src/lib/bunny-upload-client.js
// Cliente de subida a Bunny Stream via TUS (resumable), para uso en el
// navegador desde cualquier tab de admin (Biblioteca, Videos de productos).
import * as tus from 'tus-js-client';

export const BUNNY_PULLZONE = import.meta.env.PUBLIC_BUNNY_PULLZONE_HOSTNAME;

// Sube un archivo a Bunny Stream. Devuelve en cuanto termina la subida — NO
// espera a que Bunny procese miniatura/duracion (tarda varios segundos), para
// no bloquear el boton de Guardar. Usa refineBunnyMetadataInBackground() para
// completar esos datos despues.
export async function uploadFileToBunny(file, titleHint, onProgress, signEndpoint = '/api/admin/biblioteca-bunny-sign') {
  const signR = await fetch(signEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: titleHint || file.name }),
  });
  const sign = await signR.json();
  if (!sign.ok) throw new Error(sign.error || 'No se pudo firmar la subida.');

  await new Promise((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: sign.tusEndpoint,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        AuthorizationSignature: sign.signature,
        AuthorizationExpire: String(sign.expiration),
        VideoId: sign.videoId,
        LibraryId: String(sign.libraryId),
      },
      metadata: { filetype: file.type, title: titleHint || file.name },
      onError: reject,
      onProgress: (sent, total) => onProgress?.(Math.round((sent / total) * 100)),
      onSuccess: resolve,
    });
    upload.start();
  });

  return {
    bunnyVideoId: sign.videoId,
    poster: `https://${BUNNY_PULLZONE}/${sign.videoId}/thumbnail.jpg`,
    duracion: 0,
  };
}

// Hace polling en segundo plano (sin bloquear la UI) hasta que Bunny termine
// de procesar el video, y entonces llama a onReady con duracion/miniatura reales.
export function pollBunnyMetadata(bunnyVideoId, onReady, statusEndpoint = '/api/admin/biblioteca-bunny-sign') {
  (async () => {
    for (let i = 0; i < 10; i++) {
      await new Promise(r => setTimeout(r, 2000));
      try {
        const stR = await fetch(`${statusEndpoint}?videoId=${bunnyVideoId}`);
        const st = await stR.json();
        if (st.ok && st.duracion) { await onReady(st); return; }
      } catch (err) { console.error('[pollBunnyMetadata]', err); /* reintenta */ }
    }
  })();
}
