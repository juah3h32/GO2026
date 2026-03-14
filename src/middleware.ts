import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  const url = new URL(context.request.url);
  
  if (url.pathname === '/dev-sw.js') {
    return new Response(null, { status: 404 });
  }
  
  return next();
});