import { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import StepHeader from '../components/StepHeader'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Swatch from '../components/ui/Swatch'
import tuSeleccion from '../assets/tu-seleccion.jpeg'
import { CATALOG } from '../data/catalog'
import { UNDERTONE_LABEL } from '../data/quiz'
import { undertoneLabel } from '../lib/whatsapp'
import { Heart, RotateCcw, ArrowRight, Info } from 'lucide-react'

export default function ResultStep() {
  const { state, dispatch, goTo } = useApp()
  const result = state.result
  useEffect(() => {
    if (!result) goTo(4)
  }, [result, goTo])
  if (!result) return null

  const cheek = state.points.cheek.color
  const cheekHex = cheek ? `#${[cheek.r, cheek.g, cheek.b].map((v) => v.toString(16).padStart(2, '0')).join('')}` : '#EADCD6'
  const closeHex = result.primary.hex

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <StepHeader
        eyebrow="Análisis completado"
        title="Tu tono, nuestro punto de partida."
        subtitle="Esta es tu aproximación de color a partir de las muestras de mejilla y frente. No hace falta encajar en un tono: el tono se acerca a ti."
      />

      <div className="rounded-[2rem] overflow-hidden bg-gradient-to-br from-cream to-blush border border-line/60 shadow-card">
        <img
          src={tuSeleccion}
          alt="Tu selección de tonos"
          className="w-full h-auto mix-blend-multiply"
        />
      </div>

      <Card tone="soft" className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-rose">El encuentro de tonos</span>
          <span className="text-[11px] text-muted">Ejemplo ilustrativo</span>
        </div>
        <div className="grid grid-cols-3 items-center gap-3">
          <div className="flex flex-col items-center gap-2">
            <Swatch hex={cheekHex} size="lg" />
            <span className="text-[12px] font-semibold text-ink">Tu tono</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Heart
              className="h-8 w-8 text-rose"
              fill={result.closeness > 60 ? '#D82B50' : 'none'}
              strokeWidth={1.5}
            />
            <span className="text-[11px] font-semibold text-ink/80">Muy cercano</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Swatch hex={closeHex} size="lg" />
            <span className="text-[12px] font-semibold text-ink">Tono cercano</span>
          </div>
        </div>
        <p className="mt-3 text-[12px] text-muted">
          El corazón expresa cercanía visual, no una coincidencia exacta ni una medida de precisión.
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-rose mb-1">Tu tono estimado</p>
          <p className="font-display text-2xl text-ink">{result.tone}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-rose mb-1">Subtono estimado</p>
          <p className="font-display text-2xl text-ink">{UNDERTONE_LABEL[state.quiz.veins] || undertoneLabel(result.undertone)}</p>
        </div>
      </div>

      <Card tone="white" className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose">Ejemplo de base · por confirmar</span>
        </div>
        <span className="inline-flex rounded-full bg-blush px-3 py-1 text-[12px] font-semibold text-ink">Kevin y Coco</span>
        <h3 className="font-display text-2xl text-ink">{result.primary.line} · {result.primary.reference} (ejemplo)</h3>

        <div className="space-y-3">
          {['Matte', 'Glow'].map((line) => (
            <div key={line}>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">
                {line === 'Matte' ? 'GAMA MATTE' : 'GAMA GLOW HIDRATANTE'}
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                {CATALOG.filter((p) => p.line === line).map((p) => (
                  <div key={p.id} className="flex flex-col items-center gap-1">
                    <Swatch
                      hex={p.hex}
                      size="md"
                      selected={p.id === result.primary.id}
                      label={p.name}
                    />
                    <span className={`text-[10px] font-semibold ${p.id === result.primary.id ? 'text-rose' : 'text-muted'}`}>
                      {p.reference}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-[12px] text-muted">
          Referencia de ejemplo, no un match real. Colores sin calibrar; confirma el tono en tu piel.
        </p>
      </Card>

      <Card tone="blush" className="p-4 flex gap-3">
        <Info className="h-5 w-5 text-rose shrink-0 mt-0.5" />
        <p className="text-[13px] text-ink-soft">
          La cámara solo estima. La luz y el dispositivo influyen en la lectura de mejilla y frente; prueba la base con luz natural antes de elegir.
        </p>
      </Card>

      <Button size="lg" className="w-full" onClick={() => goTo(6)}>
        Ver mi selección <ArrowRight className="h-4 w-4" />
      </Button>

      <button
        type="button"
        onClick={() => { dispatch({ type: 'CLEAR_PHOTO' }); goTo(3) }}
        className="mx-auto flex items-center gap-2 text-[13px] font-semibold text-ink hover:text-rose"
      >
        <RotateCcw className="h-4 w-4" /> Repetir foto y análisis
      </button>
    </div>
  )
}