import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"

interface RotatingEarthProps {
  width?: number
  height?: number
  className?: string
}

// ISO A2 codes — EE.UU. + México + Latinoamérica
const LA_ISO = new Set([
  "US",                                                         // Estados Unidos
  "MX",                                                         // México
  "GT","BZ","HN","SV","NI","CR","PA",                          // Centroamérica
  "CU","DO","HT","JM","TT","PR","BB","LC","VC","GD","AG","KN", // Caribe
  "CO","VE","GY","SR",                                          // Norte SA
  "EC","PE","BO","BR","CL","AR","UY","PY",                      // Sur SA
])

export default function RotatingEarth({ width = 700, height = 520, className = "" }: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    const containerWidth  = Math.min(width, window.innerWidth - 40)
    const containerHeight = Math.min(height, window.innerHeight - 100)

    // Radio máximo posible — el globo llena el canvas sin cortarse
    const radius = Math.min(containerWidth, containerHeight) / 2 - 4

    const dpr = window.devicePixelRatio || 1
    canvas.width  = containerWidth  * dpr
    canvas.height = containerHeight * dpr
    canvas.style.width  = `${containerWidth}px`
    canvas.style.height = `${containerHeight}px`
    context.scale(dpr, dpr)

    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([containerWidth / 2, containerHeight / 2])
      .clipAngle(90)

    const path = d3.geoPath().projection(projection).context(context)

    // ── Helpers punto-en-polígono ──────────────────────────────────────────
    const pointInRing = (point: [number, number], ring: number[][]): boolean => {
      const [x, y] = point
      let inside = false
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const [xi, yi] = ring[i]
        const [xj, yj] = ring[j]
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
          inside = !inside
      }
      return inside
    }

    const pointInFeature = (pt: [number, number], feature: any): boolean => {
      const geom = feature.geometry
      if (geom.type === "Polygon") {
        if (!pointInRing(pt, geom.coordinates[0])) return false
        for (let i = 1; i < geom.coordinates.length; i++)
          if (pointInRing(pt, geom.coordinates[i])) return false
        return true
      }
      if (geom.type === "MultiPolygon") {
        for (const poly of geom.coordinates) {
          if (pointInRing(pt, poly[0])) {
            let hole = false
            for (let i = 1; i < poly.length; i++)
              if (pointInRing(pt, poly[i])) { hole = true; break }
            if (!hole) return true
          }
        }
      }
      return false
    }

    const generateDots = (feature: any, spacing = 16) => {
      const dots: [number, number][] = []
      const [[minLng, minLat], [maxLng, maxLat]] = d3.geoBounds(feature)
      const step = spacing * 0.08
      for (let lng = minLng; lng <= maxLng; lng += step)
        for (let lat = minLat; lat <= maxLat; lat += step) {
          const pt: [number, number] = [lng, lat]
          if (pointInFeature(pt, feature)) dots.push(pt)
        }
      return dots
    }

    // ── Estado ────────────────────────────────────────────────────────────
    interface DotData { lng: number; lat: number; isLA: boolean }
    const allDots: DotData[] = []
    let landFeatures: any
    let laFeatures:   any[] = []

    // ── Render ────────────────────────────────────────────────────────────
    const render = () => {
      context.clearRect(0, 0, containerWidth, containerHeight)
      const sf = projection.scale() / radius  // scale factor (siempre 1 — sin zoom)

      if (!landFeatures) return

      // Graticule
      const graticule = d3.geoGraticule()
      context.beginPath()
      path(graticule())
      context.strokeStyle  = "#e5e7eb"
      context.lineWidth    = 0.5 * sf
      context.globalAlpha  = 0.45
      context.stroke()
      context.globalAlpha  = 1

      // Contornos tierra (gris claro)
      context.beginPath()
      landFeatures.features.forEach((f: any) => path(f))
      context.strokeStyle = "#d1d5db"
      context.lineWidth   = 0.5 * sf
      context.stroke()

      // Relleno sutil LATAM
      laFeatures.forEach(f => {
        context.beginPath()
        path(f)
        context.fillStyle = "rgba(251,103,11,0.10)"
        context.fill()
      })

      // Puntos — grises para el mundo, naranja para LATAM
      allDots.forEach(dot => {
        const proj = projection([dot.lng, dot.lat])
        if (!proj) return
        const [px, py] = proj
        if (px < 0 || px > containerWidth || py < 0 || py > containerHeight) return

        context.beginPath()
        context.arc(px, py, (dot.isLA ? 1.9 : 1.2) * sf, 0, 2 * Math.PI)
        context.fillStyle = dot.isLA ? "#fb670b" : "#374151"
        context.fill()
      })

      // Contorno naranja LATAM encima de todo
      laFeatures.forEach(f => {
        context.beginPath()
        path(f)
        context.strokeStyle = "#fb670b"
        context.lineWidth   = 1.4 * sf
        context.stroke()
      })
    }

    // ── Carga de datos ────────────────────────────────────────────────────
    const loadWorldData = async () => {
      try {
        setIsLoading(true)

        const [landRes, countriesRes] = await Promise.all([
          fetch("https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json"),
          fetch("https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/cultural/ne_110m_admin_0_countries.json"),
        ])

        if (!landRes.ok) throw new Error("land")
        landFeatures = await landRes.json()

        // Extraer features de LATAM (con fallback si falla)
        if (countriesRes.ok) {
          const countries = await countriesRes.json()
          laFeatures = countries.features.filter((f: any) => {
            const p = f.properties ?? {}
            const iso = p.ISO_A2 ?? p.iso_a2 ?? p.ADM0_A2 ?? ""
            return LA_ISO.has(iso.toUpperCase())
          })
        }

        // Generar puntos para toda la tierra y marcar los de LATAM
        landFeatures.features.forEach((feature: any) => {
          generateDots(feature, 16).forEach(([lng, lat]) => {
            const pt: [number, number] = [lng, lat]
            const isLA = laFeatures.some(f => pointInFeature(pt, f))
            allDots.push({ lng, lat, isLA })
          })
        })

        render()
        setIsLoading(false)
      } catch {
        setError("No se pudo cargar la visualización del globo")
        setIsLoading(false)
      }
    }

    // ── Rotación automática ───────────────────────────────────────────────
    const rotation = [0, 0]
    let autoRotate = true

    const rotationTimer = d3.timer(() => {
      if (!autoRotate) return
      rotation[0] += 0.35
      projection.rotate(rotation)
      render()
    })

    // ── Drag para rotar ───────────────────────────────────────────────────
    const handleMouseDown = (e: MouseEvent) => {
      autoRotate = false
      const sx = e.clientX, sy = e.clientY
      const sr = [...rotation]

      const onMove = (mv: MouseEvent) => {
        rotation[0] = sr[0] + (mv.clientX - sx) * 0.5
        rotation[1] = Math.max(-90, Math.min(90, sr[1] - (mv.clientY - sy) * 0.5))
        projection.rotate(rotation)
        render()
      }
      const onUp = () => {
        document.removeEventListener("mousemove", onMove)
        document.removeEventListener("mouseup", onUp)
        setTimeout(() => { autoRotate = true }, 10)
      }
      document.addEventListener("mousemove", onMove)
      document.addEventListener("mouseup", onUp)
    }

    canvas.addEventListener("mousedown", handleMouseDown)
    loadWorldData()

    return () => {
      rotationTimer.stop()
      canvas.removeEventListener("mousedown", handleMouseDown)
    }
  }, [width, height])

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className={`globe-wrapper ${className}`} style={{ position: "relative", display: "inline-block" }}>
      {isLoading && (
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center",
          color: "#9ca3af", fontSize: "0.85rem",
        }}>
          Cargando…
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{ display: "block", maxWidth: "100%", height: "auto", cursor: "grab" }}
      />
    </div>
  )
}
