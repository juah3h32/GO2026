---
name: Plan de Hardening de Seguridad
description: Roadmap de 3 fases para eliminar vulnerabilidades de seguridad encontradas
type: project
---

## Roadmap de Hardening - Grupo Ortiz GO2026

### Fase 1: Inmediata (Semana de 2026-05-04)
**Objetivo:** Hacer deploy seguro a producción

- [ ] Eliminar fallbacks hardcodeados a secretos
  - Agregar validación en daily-reports.js:94,145
  - Agregar validación en send-now.js
  - Agregar validación en recruitment-ia.js

- [ ] Completar escapado de XSS
  - Verificar send-now.js también aplique escapeHtml()
  - Verificar notify.js escapa nombres de candidatos en PDFs

- [ ] Verificar HTTPS + HSTS
  - Obtener certificado SSL válido
  - Forzar redirect de HTTP → HTTPS
  - Agregar header: Strict-Transport-Security: max-age=31536000

- [ ] Completar rate limiting
  - Aplicar a recruitment-ia.js (actualmente solo en send-now.js)
  - Configurar valores según load esperado (actualmente 5 req/min)

### Fase 2: Corto Plazo (Próximas 2-4 semanas)
**Objetivo:** Hardening de autenticación y logging

- [ ] CSRF Tokens en formularios
  - Generar tokens server-side en respuestas HTML
  - Validar en POST handlers
  - Aplicar a admin panel, distribuidores

- [ ] Logging seguro
  - NO loguear números de teléfono completos (solo hash como implementado)
  - NO loguear emails completos
  - NO loguear tokens/secretos
  - Centralizar en /var/log/go2026-security.log

- [ ] JWT Hardening
  - Validar duración del token (máximo 24h)
  - Implementar refresh tokens
  - Validar exp claim en verifyAdminToken.ts
  - Agregar blacklist de tokens revocados

- [ ] Cookie Security Flags
  - Verificar que admin_token use HttpOnly, Secure, SameSite=Strict
  - Implementar en auth endpoint de login

### Fase 3: Mediano Plazo (1-3 meses)
**Objetivo:** Protección en profundidad

- [ ] CSP Hardening
  - Remover 'unsafe-inline' de script-src
  - Implementar nonces para inline scripts
  - Agregar report-uri para monitoreo de violaciones

- [ ] WAF (Web Application Firewall)
  - Evaluar: Cloudflare WAF, AWS WAF, ModSecurity
  - Reglas para: SQLi, XSS, command injection, path traversal

- [ ] Monitoring de Seguridad
  - Alertas por rate limit exceeded
  - Alertas por JWT verification failures
  - Dashboard de intentos fallidos de login
  - Correlación de IPs sospechosas

- [ ] Política de Seguridad de Datos
  - GDPR compliance para datos de candidatos
  - Política de retención: ¿cuánto tiempo guardar CVs?
  - Encriptación en tránsito (TLS 1.3 mínimo)
  - Encriptación en reposo para base de datos sensible

---

## Validaciones Pre-Deploy

Antes de cada deploy a producción:

```bash
# 1. Verificar que NO hay secrets en código
grep -r "hardcoded\|'ortiz2026'\|'secret'\|'token'" src/pages/api --include="*.js"

# 2. Verificar que CRON_SECRET_EXTERNAL está definido
echo $CRON_SECRET_EXTERNAL | wc -c  # debe ser > 32

# 3. Verificar HTTPS en astro.config.mjs
grep "https://" astro.config.mjs | grep grupo-ortiz.com

# 4. Test rápido de rate limiting
curl -X POST https://grupo-ortiz.com/api/reports/send-now \
  -H "Authorization: Bearer $TOKEN" \
  -d '{}' -i
# Repetir 6 veces: 5ta debería retornar 429
```

---

## Tracking de Cambios

**2026-05-04:**
- Identificadas 5 CVE-level vulnerabilidades
- Corregidas: XSS (recruitment-ia.js), CSRF (send-now.js, recruitment-ia.js), ReDoS (BotGO.jsx)
- Parcialmente corregidas: Secret hardcodeado (requiere test en entorno)
- Creado rateLimit.ts, aplicado a send-now.js

**Estado actual:** 
- Vulnerable a CRON_SECRET_EXTERNAL fallback si no está configurado en entorno
- Rate limiting solo en 1 de 2 endpoints críticos
- CSP todavía permite 'unsafe-inline'

**Blocker para producción:** Verificar secretos en variables de entorno
