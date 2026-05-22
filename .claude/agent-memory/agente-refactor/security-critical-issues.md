---
name: Vulnerabilidades Críticas Encontradas
description: 5 CVE-level vulnerabilities identificadas en endpoints API y autenticación
type: project
---

## Hallazgos de Seguridad - 2026-05-04

### CRÍTICA – Secret Hardcodeado (CWE-798)
**Archivos:** `src/pages/api/cron/daily-reports.js:94,145`
**Estado:** PARCIALMENTE CORREGIDO

```javascript
// ❌ ANTES
const cronSecret = ... || 'ortiz2026';  // Secret visible en código

// ✅ DESPUÉS
const cronSecret = ... ;
if (!cronSecret) throw new Error('CRON_SECRET_EXTERNAL no configurado');
```

**Acción:** Verificar que CRON_SECRET_EXTERNAL esté definido en Vercel/AWS antes de deploy

---

### CRÍTICA – XSS en HTML (CWE-79)
**Archivo:** `src/pages/api/reports/recruitment-ia.js:280-300`
**Estado:** CORREGIDO

Campos de candidato (nombre, puesto, email) se inyectaban sin escapado en HTML de reportes.

**Acción:** Función `escapeHtml()` ahora aplica a todos los campos dinámicos

---

### CRÍTICA – CSRF en Endpoints API (CWE-352)
**Archivos:** `src/pages/api/reports/send-now.js`, `recruitment-ia.js`
**Estado:** CORREGIDO

Faltaba validación de origen/referer. Agregada función `validateOrigin()` que whitelist-ea:
- https://grupo-ortiz.com
- https://www.grupo-ortiz.com

---

### CRÍTICA – ReDoS (CWE-1333)
**Archivo:** `src/components/BotGO.jsx:9-20`
**Estado:** CORREGIDO

Regex como `/\bcompr[a-z]{2,}/` eran vulnerable a strings patológicos.

**Acción:** Limitados cuantificadores a máximo 5-8 caracteres, agregado límite global de 30 caracteres

---

### CRÍTICA – Exposición de Secretos en envPrefix
**Archivo:** `astro.config.mjs:69`
**Estado:** DOCUMENTADO (sin corregir aún)

Variables como `CRON_SECRET_EXTERNAL`, `WAHOOKS_TOKEN` no están en whitelist. Podrían exponerse en SSR.

**Acción:** Requiere refactoring para acceder SOLO vía `process.env` en server-side

---

## Prioridad: Deploy Blocker

Antes de producción:
1. Confirmar CRON_SECRET_EXTERNAL en variables de entorno
2. Verificar JWT_SECRET > 32 caracteres
3. Ejecutar test de XSS injection en reportes
4. Validar HTTPS y certificado SSL

**Why:** Estos vulnerabilidades permiten: falsificación de reportes, DoS, inyección de código en PDFs enviados a clientes

**How to apply:** Las correcciones están parcialmente aplicadas. Requiere re-verificar después de merge y antes de deploy a producción.
