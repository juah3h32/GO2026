# API de vacantes para departamentos externos

> Para: equipo tecnico del departamento aliado (ej. Cindy / RH externo).
> Objetivo: ellos administran sus propias vacantes y candidatos desde su sistema,
> conectandose a la base de datos de Grupo Ortiz via esta API — sin tocar su web
> ni darles acceso al panel admin. Sus vacantes activas aparecen automaticamente
> en `https://grupo-ortiz.com/es/vacantes`.

---

## 1. Como funciona (resumen)

```
Su sistema (backend)  --->  POST /api/partner/vacantes   (crea/edita su vacante)
                       --->  POST /api/partner/candidatos (sube candidatos)
                       --->  GET  /api/partner/vacantes   (lee SOLO sus vacantes)
                       --->  GET  /api/partner/candidatos (lee SOLO sus candidatos)

grupo-ortiz.com/es/vacantes  <---  GET /api/vacantes (publico, ya existente)
                                   muestra TODAS las vacantes activas, incluidas
                                   las que ellos suban — sin que nosotros hagamos nada mas.
```

Cada cuenta externa tiene una **API key** amarrada a un `rh_user_id` fijo.
Con esa key solo pueden ver/editar lo que crearon ellos mismos. Jamas ven ni
tocan vacantes o candidatos de otras areas.

---

## 2. Autenticacion

Header obligatorio en cada request:

```
x-api-key: gops_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

- Sin este header o con una key invalida/revocada → `401 { ok:false, error:"API key invalida o faltante." }`.
- La key se genera una sola vez (ver seccion 7). Si se pierde, se revoca y se genera otra — no se puede recuperar la original.
- **No exponer la key en codigo de frontend/navegador.** Debe vivir en el backend de ellos. Si necesitan llamar la API desde el navegador igual, avisar para configurar `PARTNER_CORS_ORIGIN` a su dominio exacto (ver seccion 8) — aun asi, cualquiera que vea el JS de su pagina vera la key.

---

## 3. Endpoint: vacantes

### `GET /api/partner/vacantes`

Devuelve **solo** las vacantes de esa cuenta (activas e inactivas).

```json
{
  "ok": true,
  "vacantes": [
    {
      "id": 12,
      "titulo": "Operador de Produccion",
      "area": "Manufactura",
      "tipo": "Tiempo completo",
      "ubicacion": "Morelia, Mich.",
      "horario": "Lunes a viernes",
      "salario": "$8,000 - $9,500 mensuales",
      "descripcion": "Buscamos un operador...",
      "requisitos": "Educacion...\nMinimo...",
      "activa": true,
      "multiples": false,
      "empresa": "",
      "rh_user_id": 7,
      "link_externo": ""
    }
  ]
}
```

### `POST /api/partner/vacantes` — crear

```json
{
  "action": "create",
  "titulo": "Operador de Produccion",
  "area": "Manufactura",
  "tipo": "Tiempo completo",
  "ubicacion": "Morelia, Mich.",
  "horario": "Lunes a viernes",
  "salario": "$8,000 - $9,500 mensuales",
  "descripcion": "Texto libre.",
  "requisitos": "Texto libre, un requisito por linea.",
  "activa": true,
  "multiples": false,
  "empresa": "Nombre de su empresa (opcional)",
  "link_externo": "https://... (opcional, si su postulacion no es en grupo-ortiz.com)"
}
```

Respuesta: `{ "ok": true, "id": 45 }`. Solo `titulo` es obligatorio.
`activa: true` → aparece de inmediato en `grupo-ortiz.com/es/vacantes`.

### `POST /api/partner/vacantes` — editar

```json
{ "action": "update", "id": 45, "titulo": "...", "activa": true, "...": "..." }
```

Mismos campos que `create` + `id`. Si el `id` no es de su cuenta → `403`.

### `POST /api/partner/vacantes` — activar/desactivar

```json
{ "action": "toggle", "id": 45, "activa": false }
```

### `POST /api/partner/vacantes` — eliminar

```json
{ "action": "delete", "id": 45 }
```

---

## 4. Endpoint: candidatos

### `GET /api/partner/candidatos`

Devuelve solo los candidatos ligados a sus propias vacantes.

```json
{
  "ok": true,
  "candidatos": [
    {
      "id": 101, "nombre": "Juan Perez", "email": "juan@mail.com",
      "telefono": "4431234567", "puesto": "Operador de Produccion",
      "status": "nuevo", "created_at": "2026-10-19 10:00:00", "rh_user_id": 7
    }
  ]
}
```

### `POST /api/partner/candidatos` — subir candidato

Opcion A — ligado a una vacante que ya crearon con esta misma API (recomendado,
evita typos y deja todo relacionado):

```json
{
  "action": "create",
  "vacanteId": 45,
  "nombre": "Juan Perez",
  "email": "juan@mail.com",
  "telefono": "4431234567",
  "edad": "28",
  "colonia": "Centro",
  "mensaje": "Comentarios del candidato (opcional)"
}
```

Opcion B — con el puesto como texto libre (si el candidato no viene de una
vacante creada por esta API):

```json
{
  "action": "create",
  "puesto": "Operador de Produccion",
  "nombre": "Juan Perez",
  "telefono": "4431234567"
}
```

Reglas:
- `nombre` + (`telefono` o `email`) son obligatorios.
- `vacanteId` o `puesto` es obligatorio (si mandan `vacanteId` de una vacante que no es suya → `403`).
- Si ya existe un candidato con el mismo telefono/email **para el mismo puesto**, no se duplica — responde `{ "ok": true, "id": <id existente>, "duplicate": true }`.
- CV opcional en base64: `cvNombre`, `cvBase64`, `cvTipo` (ej. `"application/pdf"`). Limite de payload 6 MB — si el CV pesa mas, mandar un link (ej. Drive) dentro de `mensaje` en vez de `cvBase64`.

---

## 5. Codigos de error

| Status | Cuando |
|---|---|
| 400 | Falta un campo obligatorio |
| 401 | `x-api-key` ausente o invalida |
| 403 | El `id`/`vacanteId` no pertenece a esta cuenta |
| 413 | Payload mayor a 6 MB (candidatos) / 100 KB (vacantes) |
| 429 | Limite de peticiones superado (ver seccion 6) |
| 500 | Error interno — reintentar; si persiste, avisar a Grupo Ortiz |

Todas las respuestas son JSON `{ ok: boolean, ... }`. `ok:false` siempre trae `error`.

---

## 6. Limites (rate limit)

- 60 peticiones/minuto por API key (no por IP — su servidor puede mandar todo el trafico que necesite desde una sola IP sin pisar este limite ajeno).
- Si se supera: `429` + header `Retry-After: 60`.

---

## 7. Como se da de alta una cuenta nueva (lo hace Grupo Ortiz, una sola vez)

```bash
node scripts/create-partner.mjs "Cindy - Departamento X"
```

Esto imprime una sola vez:
```
rh_user_id:  7
API key:     gops_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

La API key se entrega al departamento externo por un canal seguro (no por
correo/chat en texto plano si se puede evitar). Si se compromete, se revoca
desde la base de datos (`UPDATE api_keys SET active=0 WHERE id=...`) y se
genera una nueva con el mismo script.

---

## 8. CORS (solo si ellos llaman la API desde el navegador)

Por default la API responde con `Access-Control-Allow-Origin: *`, pensado para
llamadas servidor-a-servidor (su backend llama a esta API; la key nunca toca
el navegador). Si su arquitectura requiere llamar directo desde JS de
navegador, avisar para fijar `PARTNER_CORS_ORIGIN=https://su-dominio.com` en
el `.env` de Grupo Ortiz — pero la recomendacion sigue siendo llamar desde su
backend, porque cualquier key visible en JS del navegador puede ser copiada
por cualquiera que abra las herramientas de desarrollador.

---

## 9. Ejemplo rapido (curl)

```bash
# Crear vacante
curl -X POST https://grupo-ortiz.com/api/partner/vacantes \
  -H "Content-Type: application/json" \
  -H "x-api-key: gops_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -d '{"action":"create","titulo":"Operador de Produccion","area":"Manufactura","activa":true}'

# Ver mis vacantes
curl https://grupo-ortiz.com/api/partner/vacantes \
  -H "x-api-key: gops_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Subir candidato
curl -X POST https://grupo-ortiz.com/api/partner/candidatos \
  -H "Content-Type: application/json" \
  -H "x-api-key: gops_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -d '{"action":"create","vacanteId":45,"nombre":"Juan Perez","telefono":"4431234567"}'
```

---

## 10. Archivos tocados en este repo (referencia interna)

- `src/lib/analytics-db.js` — tabla `api_keys` + `createApiKey`/`verifyApiKey`/`revokeApiKey`
- `src/lib/verifyPartnerKey.js` — resuelve `x-api-key` → `rh_user_id`
- `src/pages/api/partner/vacantes.js` — CRUD de vacantes por partner
- `src/pages/api/partner/candidatos.js` — alta/listado de candidatos por partner
- `src/middleware.ts` — bucket de rate limit `partner` (60/min por API key) + payload 6 MB en `/api/partner/candidatos`
- `vercel.json` — `Cross-Origin-Resource-Policy: cross-origin` en `/api/partner/*` (sin esto el navegador del partner bloquea la respuesta aunque CORS este bien puesto)
- `scripts/create-partner.mjs` — provisiona cuenta + API key
