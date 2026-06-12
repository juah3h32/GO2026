# Catalogos digitales — Como funciona

Guia para cualquier persona. Explica que es, donde se guarda y como hacer cada cambio.

---

## 1. Que es

Cada division (Acolchado, Arpilla, Bolsas, Rafia, etc.) tiene un catalogo digital.
Ese catalogo se ve de dos formas:

- **Web:** pagina animada en `/{idioma}/catalogo/{division}`
- **PDF:** boton "Descargar PDF" en la misma pagina

Las dos formas leen **los mismos datos**. Si cambias el dato, cambia en web y en PDF.

---

## 2. Donde se guarda todo (Turso)

El CONTENIDO del catalogo (textos, productos, fichas tecnicas, imagenes) NO esta en el codigo.
Esta en una base de datos en la nube llamada **Turso**.

| Dato | Valor |
|---|---|
| Base de datos | `libsql://analytics-botgo-juanpa.aws-us-east-1.turso.io` |
| Tabla | `catalog_kv` |
| Columnas | `key` (slug del catalogo), `json` (el catalogo completo), `updated_at` |
| Panel para verla | https://turso.tech (cuenta "juanpa") |

Hay tres piezas. No confundirlas:

| Pieza | Que es | Manda? |
|---|---|---|
| **Turso** | Base de datos en la nube. El contenido real. | SI, gana siempre |
| **JSON** (`src/data/catalogo-*.json`) | Semilla / respaldo inicial. | Solo si Turso esta vacio |
| **Codigo** (`.astro`, `.js`) | El diseño: como se ve, colores, layout, PDF. | Define la forma, no el texto |

---

## 3. Como lee el sitio (flujo)

Cada vez que alguien abre el catalogo (web o PDF), el sistema hace esto:

```
Pide el catalogo "digital-bolsas"
        |
        v
  Existe en Turso?
        |
   SI --+-- usa el dato de Turso      <- esto es lo que se ve
        |
   NO --+-- usa el JSON semilla
            y lo copia a Turso (primera vez)
```

Clave: el sitio lee Turso **en cada visita** (SSR).
Por eso un cambio en Turso se ve **al instante**, sin volver a publicar.

---

## 4. Como hacer cada modificacion

### A. Cambiar TEXTO, PRODUCTOS, FICHAS o IMAGEN  → tiempo real, sin push

Esto es CONTENIDO. Se edita en vivo.

1. Abre la pagina del catalogo con el panel editor.
2. Cambia el texto / producto / ficha / imagen.
3. Pulsa **Guardar**.
4. Guardar escribe directo a Turso (`/api/admin/catalog`).
5. Recarga la pagina. Ya esta. **No hay que publicar nada.**

Ejemplos:
- Corregir la descripcion de una division.
- Agregar o quitar un producto.
- Cambiar valores de una ficha tecnica.
- Cambiar la foto de portada.

### B. Cambiar DISEÑO, COMO SE VE o el PDF  → requiere push/deploy

Esto es CODIGO. Vive en los archivos, no en Turso.

1. Se edita el codigo.
2. Se hace push a Vercel (deploy).
3. El cambio sale cuando termina el deploy.

Ejemplos:
- Que los productos salgan en linea horizontal cuando son mas de 3.
- Como se dibujan las tablas en el PDF.
- Colores, tipografias, posicion de la imagen.

### Resumen rapido

| Quiero cambiar | Donde | Push? |
|---|---|---|
| Texto, productos, fichas, imagen | Panel editor → Guardar (Turso) | NO |
| Diseño, layout, PDF | Codigo + deploy Vercel | SI |

---

## 5. Trampa importante: editar el JSON NO siempre se ve

Si editas un archivo `src/data/catalogo-*.json` y el catalogo YA existe en Turso:

- Turso gana.
- El cambio del JSON **no aparece**.
- El JSON solo sirve para catalogos nuevos (sin registro en Turso) o un deploy limpio.

**Para forzar que el JSON entre a Turso** existe un script:

```bash
node scripts/sync-intros-turso.mjs
```

Ese script copia el campo `intro` (las descripciones) del JSON hacia Turso,
respetando todo lo demas (productos, fichas, imagenes).

---

## 6. Los catalogos (slugs)

Cada catalogo tiene un identificador (`slug`). Asi se guarda en Turso.

| Division | Slug | JSON semilla |
|---|---|---|
| Stretch Film | `digital-stretch-film` | `catalogo-stretch.json` |
| Acolchado | `digital-acolchado` | `catalogo-acolchado.json` |
| Arpilla | `digital-arpilla` | `catalogo-arpilla.json` |
| Cuerda | `digital-cuerda` | `catalogo-cuerda.json` |
| Rafia | `digital-rafia` | `catalogo-rafia.json` |
| Empaque Flexible | `digital-flexible` | `catalogo-flexible.json` |
| Saco | `digital-saco` | `catalogo-saco.json` |
| Esquinero | `digital-esquinero` | `catalogo-esquinero.json` |
| Naturizable | `digital-naturizable` | `catalogo-naturizable.json` |
| Bolsas | `digital-bolsas` | `catalogo-bolsas.json` |

Registro en codigo: `src/lib/catalogs.js`

---

## 7. Estructura de un catalogo (el JSON)

```
cover        -> titulos de portada (t1, t2, division)
coverImg     -> imagen de portada
visualCover  -> ajuste de la imagen (escala, posicion)
intro        -> descripcion: p1, bioTitle, p2  (5 idiomas)
productos    -> lista de nombres para la portada
fichas       -> una por producto:
                  nombre, desc, img
                  + UNO de estos tipos de tabla:
                    specs       (caracteristica / minimo / maximo)
                    matrix      (tabla ancha: headers + filas)
                    colorTable  (color / medidas)
styles       -> estilos de texto guardados desde el editor
```

Idiomas: `es`, `en`, `pt`, `zh`, `ar`.

---

## 8. Archivos clave (para tecnicos)

| Archivo | Que hace |
|---|---|
| `src/lib/catalog-store.js` | Lee/escribe catalogos en Turso (`getCatalog`, `saveCatalog`) |
| `src/lib/catalogs.js` | Registro de catalogos (slug + semilla) |
| `src/pages/[lang]/catalogo/[category].astro` | Vista WEB + panel editor |
| `src/pages/api/catalogo-pdf.js` | Genera el PDF |
| `src/pages/api/admin/catalog.js` | Endpoint que guarda cambios del editor en Turso |
| `src/data/catalogo-*.json` | Semillas (respaldo inicial) |
| `scripts/sync-intros-turso.mjs` | Empuja intros del JSON a Turso |

---

## 9. Preguntas frecuentes

**Edite en el panel y no se ve.**
Recarga la pagina. Si sigue igual, revisa que pulsaste Guardar.

**Edite el JSON y no se ve.**
Normal. Turso gana. Usa el panel, o corre el script de sync.

**El PDF no muestra lo mismo que la web.**
Web y PDF leen el mismo dato (Turso). Si difieren, es un tema de
como el codigo dibuja ese dato → es cambio de codigo (push).

**Donde veo el contenido crudo?**
Dashboard de Turso (https://turso.tech), tabla `catalog_kv`.
