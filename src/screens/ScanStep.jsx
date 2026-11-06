import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import StepHeader from '../components/StepHeader'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import ColorPicker from '../components/ColorPicker'
import { recommend } from '../lib/recommend'
import { luminance, lightQuality } from '../lib/color'
import { RotateCcw, ScanLine, Sparkles } from 'lucide-react'

export default function ScanStep() {
  const { state, dispatch, goTo } = useApp()
  const { photo, points } = state
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!photo) goTo(3)
  }, [photo, goTo])
  if (!photo) return null

  const ready = Boolean(points.cheek.color && points.forehead.color)
  const cheek = points.cheek.color
  const forehead = points.forehead.color
  const lum = cheek ? luminance(cheek) : forehead ? luminance(forehead) : 0
  const filled = Math.round((lum / 255) * 8)
  const quality = cheek || forehead ? lightQuality(cheek || forehead) : 'Sin muestra'

  async function handleAnalyze() {
    setError('')
    if (!ready) {
      setError('Mové los puntos 1 y 2 sobre zonas de piel y esperá la lectura.')
      return
    }
    setAnalyzing(true)
    await new Promise((r) => setTimeout(r, 1300))
    const result = recommend({ quiz: state.quiz, samples: points })
    if (!result) {
      setAnalyzing(false)
      setError('No pudimos calcular tu tono. Probá con otra foto.')
      return
    }
    dispatch({ type: 'SET_RESULT', result })
    setAnalyzing(false)
    goTo(5)
  }

  function handleRepeat() {
    dispatch({ type: 'CLEAR_PHOTO' })
    goTo(3)
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <StepHeader
        eyebrow="Una foto, dos pistas"
        title="Aquí empieza tu match."
        subtitle="Marca una zona de piel en la mejilla y otra en la frente. Evita brillos, sombras fuertes y labios."
      />

      <div className="relative">
        <ColorPicker
          photo={photo}
          points={points}
          onMove={(which, value) => dispatch({ type: 'SET_POINT', which, value })}
          onSelectActive={(which) => dispatch({ type: 'SET_ACTIVE_POINT', which })}
          onSample={(which, color) => dispatch({ type: 'SET_POINT_COLOR', which, color })}
        />
        <div className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-[11px] font-semibold text-rose shadow-sm">
          Guía ilustrativa · no es una medición real
        </div>
        {analyzing && (
          <div className="absolute inset-0 z-20 rounded-[1.75rem] overflow-hidden bg-ink/30 backdrop-blur-sm grid place-items-center">
            <div className="relative w-full h-full">
              <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose to-transparent animate-[scan_1.2s_linear_infinite]" />
            </div>
            <div className="absolute inset-0 grid place-items-center">
              <div className="bg-white/95 rounded-2xl px-5 py-4 shadow-card text-center">
                <ScanLine className="h-6 w-6 text-rose mx-auto mb-2 animate-pulse" />
                <p className="font-semibold text-ink text-[15px]">Analizando tu tono…</p>
                <p className="text-xs text-muted mt-1">Comparando mejilla y frente</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-[1.5rem] border border-line bg-white p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-semibold text-ink">Luz para la muestra</span>
          <span className="text-[12px] font-semibold text-rose">{quality}</span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className={`h-2 flex-1 rounded-full transition-colors ${
                i < filled ? 'bg-rose' : 'bg-line'
              }`}
            />
          ))}
        </div>
        <p className="mt-2 text-[12px] text-muted">Medidor ilustrativo; no es una medición real.</p>
      </div>

      {error && (
        <Card tone="blush" className="p-4">
          <p className="text-[13px] text-ink">{error}</p>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <Button variant="secondary" onClick={handleRepeat}>
          <RotateCcw className="h-4 w-4" /> Repetir foto
        </Button>
        <Button size="lg" loading={analyzing} disabled={!ready} onClick={handleAnalyze}>
          <Sparkles className="h-4 w-4" /> Analizar
        </Button>
      </div>

      <p className="text-[12px] text-muted">
        La cámara solo estima el tono. La iluminación y el dispositivo pueden afectar la comparación.
      </p>
    </div>
  )
}