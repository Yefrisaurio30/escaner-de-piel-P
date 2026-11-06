import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import StepHeader from '../components/StepHeader'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import ColorPicker from '../components/ColorPicker'
import { recommend } from '../lib/recommend'
import { RotateCcw, ScanLine } from 'lucide-react'

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

  async function handleAnalyze() {
    setError('')
    if (!ready) {
      setError('Mové los puntos 1 y 2 sobre zonas de piel y esperá la lectura.')
      return
    }
    setAnalyzing(true)
    // small delay for the scanning animation + perceived processing
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
    <div className="space-y-5">
      <StepHeader
        eyebrow="Tu foto"
        title="Aquí empieza tu match."
        subtitle="Ajustá los puntos sobre mejilla y frente. La lectura se actualiza sola."
      />

      <div className="relative">
        <ColorPicker
          photo={photo}
          points={points}
          onMove={(which, value) => dispatch({ type: 'SET_POINT', which, value })}
          onSelectActive={(which) => dispatch({ type: 'SET_ACTIVE_POINT', which })}
          onSample={(which, color) => dispatch({ type: 'SET_POINT_COLOR', which, color })}
        />
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

      {error && (
        <Card tone="blush" className="p-4">
          <p className="text-[13px] text-ink">{error}</p>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <Button variant="secondary" onClick={handleRepeat}>
          <RotateCcw className="h-4 w-4" /> Repetir foto
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted hidden sm:inline">
            {ready ? 'Muestra lista para analizar.' : 'Faltan lecturas.'}
          </span>
          <Button size="lg" loading={analyzing} disabled={!ready} onClick={handleAnalyze}>
            Analizar
          </Button>
        </div>
      </div>

      <Card tone="soft" className="p-4">
        <p className="text-xs font-semibold text-rose mb-1">Consejos para una mejor lectura</p>
        <ul className="text-[13px] text-ink-soft space-y-1 leading-snug">
          <li>• Elegí zonas sin sombra ni brillo (evitá la nariz).</li>
          <li>• Si mejilla y frente dan colores muy distintos, probá otra foto.</li>
          <li>• La luz natural mejora mucho la precisión.</li>
        </ul>
      </Card>
    </div>
  )
}