import { useEffect, useRef, useState } from 'react'
import { Hand } from 'lucide-react'
import { sampleRegion, lightQuality } from '../lib/color'

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

export default function ColorPicker({ photo, points, onMove, onSelectActive, onSample }) {
  const containerRef = useRef(null)
  const samplingCanvasRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [dragging, setDragging] = useState(null)
  const [imgSize, setImgSize] = useState({ w: photo?.width || 4, h: photo?.height || 5 })

  useEffect(() => {
    if (!photo?.src) return
    setLoaded(false)
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = img.naturalWidth
      c.height = img.naturalHeight
      const ctx = c.getContext('2d')
      ctx.drawImage(img, 0, 0)
      samplingCanvasRef.current = c
      setImgSize({ w: img.naturalWidth, h: img.naturalHeight })
      setLoaded(true)
    }
    img.src = photo.src
  }, [photo?.src])

  function sample(which) {
    const canvas = samplingCanvasRef.current
    if (!canvas) return
    const pt = points[which]
    const x = pt.x * canvas.width
    const y = pt.y * canvas.height
    const radius = Math.max(6, Math.round(Math.min(canvas.width, canvas.height) * 0.032))
    const ctx = canvas.getContext('2d')
    const color = sampleRegion(ctx, x, y, radius, canvas.width, canvas.height)
    if (color) onSample(which, color)
  }

  useEffect(() => {
    if (!loaded) return
    sample('cheek')
    sample('forehead')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  useEffect(() => {
    if (!loaded) return
    sample('cheek')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points.cheek.x, points.cheek.y, loaded])

  useEffect(() => {
    if (!loaded) return
    sample('forehead')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points.forehead.x, points.forehead.y, loaded])

  function handlePointerDown(e, which) {
    e.stopPropagation()
    onSelectActive(which)
    setDragging(which)
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {}
  }

  function handlePointerMove(e) {
    if (!dragging || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clamp((e.clientX - rect.left) / rect.width, 0.05, 0.95)
    const y = clamp((e.clientY - rect.top) / rect.height, 0.05, 0.95)
    onMove(dragging, { x, y })
  }

  function handlePointerUp() {
    setDragging(null)
  }

  function handleContainerPointerDown(e) {
    if (!containerRef.current) return
    const target = e.target
    if (target !== containerRef.current && !target.classList?.contains('picker-bg')) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clamp((e.clientX - rect.left) / rect.width, 0.05, 0.95)
    const y = clamp((e.clientY - rect.top) / rect.height, 0.05, 0.95)
    onSelectActive(points.active)
    onMove(points.active, { x, y })
  }

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative w-full rounded-[1.75rem] overflow-hidden bg-ink/5 border border-line shadow-card touch-none select-none"
        style={{ aspectRatio: `${imgSize.w} / ${imgSize.h}` }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerDown={handleContainerPointerDown}
      >
        <img
          src={photo.src}
          alt="Foto para análisis de tono"
          className="picker-bg absolute inset-0 w-full h-full object-contain pointer-events-none"
          draggable={false}
        />
        {!loaded && (
          <div className="absolute inset-0 grid place-items-center bg-paper/80">
            <div className="text-sm text-muted">Cargando imagen…</div>
          </div>
        )}

        {(['cheek', 'forehead']).map((which) => {
          const pt = points[which]
          const active = points.active === which
          const color = pt.color ? `rgb(${pt.color.r}, ${pt.color.g}, ${pt.color.b})` : 'transparent'
          return (
            <button
              key={which}
              type="button"
              onPointerDown={(e) => handlePointerDown(e, which)}
              onClick={(e) => {
                e.stopPropagation()
                onSelectActive(which)
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 h-11 w-11 rounded-full border-2 grid place-items-center transition-transform ${
                active ? 'border-rose scale-110 shadow-soft' : 'border-white/90'
              }`}
              style={{
                left: `${pt.x * 100}%`,
                top: `${pt.y * 100}%`,
                backgroundColor: pt.color ? color : 'rgba(255,255,255,0.35)',
                backdropFilter: 'blur(2px)',
              }}
              aria-label={`Punto ${which === 'cheek' ? 'mejilla' : 'frente'}`}
              aria-pressed={active}
            >
              <span className="text-[10px] font-bold text-white drop-shadow">
                {which === 'cheek' ? '1' : '2'}
              </span>
            </button>
          )
        })}

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span className="text-[11px] font-semibold text-white bg-black/45 backdrop-blur rounded-full px-3 py-1.5">
            Arrastrá los puntos 1 (mejilla) y 2 (frente)
          </span>
          <span className="text-[11px] font-semibold text-white bg-black/45 backdrop-blur rounded-full px-3 py-1.5 flex items-center gap-1">
            <Hand className="h-3 w-3" /> Tocá para mover
          </span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { key: 'cheek', label: '1 · Mejilla' },
          { key: 'forehead', label: '2 · Frente' },
        ].map(({ key, label }) => {
          const pt = points[key]
          const color = pt.color
          const hex = color ? `#${[color.r, color.g, color.b].map((v) => v.toString(16).padStart(2, '0')).join('')}` : '—'
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectActive(key)}
              className={`text-left rounded-2xl border p-3.5 transition-all ${
                points.active === key ? 'border-rose bg-rose-light/60' : 'border-line bg-white hover:border-rose/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-11 w-11 rounded-full border-2 border-white shadow-sm shrink-0"
                  style={{ backgroundColor: color ? `rgb(${color.r},${color.g},${color.b})` : '#EADCD6' }}
                />
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-ink">{label}</p>
                  <p className="text-[12px] text-muted font-mono truncate">{hex.toUpperCase()}</p>
                  <p className="text-[11px] text-muted">
                    {color ? `RGB ${color.r}, ${color.g}, ${color.b}` : 'Sin muestra'}
                    {color ? ` · ${lightQuality(color)}` : ''}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}