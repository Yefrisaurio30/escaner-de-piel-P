import { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import StepHeader from '../components/StepHeader'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Swatch from '../components/ui/Swatch'
import { MatchDuo } from '../components/illustrations/PopIllustrations'
import { CATALOG, LINE_META } from '../data/catalog'
import { SKIN_LABEL, COVERAGE_LABEL } from '../data/quiz'
import { undertoneLabel } from '../lib/whatsapp'
import { Heart, RotateCcw, ArrowRight } from 'lucide-react'

export default function ResultStep() {
  const { state, dispatch, goTo } = useApp()
  const result = state.result
  useEffect(() => {
    if (!result) goTo(4)
  }, [result, goTo])
  if (!result) return null
  const cheek = state.points.cheek.color
  const forehead = state.points.forehead.color
  const cheekHex = cheek ? `#${[cheek.r, cheek.g, cheek.b].map((v) => v.toString(16).padStart(2, '0')).join('')}` : '#EADCD6'
  const foreheadHex = forehead ? `#${[forehead.r, forehead.g, forehead.b].map((v) => v.toString(16).padStart(2, '0')).join('')}` : '#EADCD6'

  return (
    <div className="space-y-5">
      <StepHeader
        eyebrow="Tu tono"
        title="Tu tono, nuestro punto de partida."
        subtitle="Esto es una guía visual. El tono final se confirma probando la base sobre tu piel."
      />

      <div className="grid lg:grid-cols-[1fr_0.9fr] gap-5 items-start">
        <div className="space-y-5">
          <Card tone="soft" className="p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-xs font-semibold text-rose uppercase tracking-wider">El encuentro de tonos</p>
                <p className="text-[13px] text-muted mt-1">Mejilla y frente, comparados.</p>
              </div>
              <div className="text-center">
                <div className="relative inline-block">
                  <Heart
                    className="h-12 w-12 text-rose"
                    fill={result.closeness > 60 ? '#D82B50' : 'none'}
                    strokeWidth={1.5}
                  />
                  <span className="absolute inset-0 grid place-items-center text-[10px] font-bold text-white">
                    {result.closeness}%
                  </span>
                </div>
                <p className="text-[10px] text-muted mt-1">
                  {result.closeness > 75 ? 'Muy cercano' : result.closeness > 50 ? 'Cercano' : 'Revisar foto'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white border border-line p-3 flex items-center gap-3">
                <div className="h-12 w-12 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: cheekHex }} />
                <div>
                  <p className="text-[12px] font-semibold text-ink">Mejilla</p>
                  <p className="text-[11px] text-muted font-mono">{cheekHex.toUpperCase()}</p>
                </div>
              </div>
              <div className="rounded-2xl bg-white border border-line p-3 flex items-center gap-3">
                <div className="h-12 w-12 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: foreheadHex }} />
                <div>
                  <p className="text-[12px] font-semibold text-ink">Frente</p>
                  <p className="text-[11px] text-muted font-mono">{foreheadHex.toUpperCase()}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card tone="white" className="p-5">
            <p className="text-xs font-semibold text-rose uppercase tracking-wider mb-3">Tu tono estimado</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="rounded-full bg-rose text-white px-4 py-2 text-sm font-semibold">
                {result.tone}
              </span>
              <span className="rounded-full bg-blush text-ink px-4 py-2 text-sm font-semibold">
                Subtomo: {undertoneLabel(result.undertone)}
              </span>
              <span className="rounded-full bg-cream text-ink px-4 py-2 text-sm font-semibold">
                {SKIN_LABEL[state.quiz.skin]} · {COVERAGE_LABEL[state.quiz.coverage]}
              </span>
            </div>
            <p className="text-[13px] text-ink-soft leading-relaxed">
              {result.lowLight
                ? 'La foto tiene luz irregular. Para una guía más precisa, repetí la foto con luz natural.'
                : 'La lectura es estable. Usala como punto de partida para probar bases.'}
            </p>
          </Card>
        </div>

        <div className="space-y-5">
          <div className="rounded-[2rem] overflow-hidden bg-gradient-to-br from-cream to-blush border border-line/60 shadow-card">
            <MatchDuo className="w-full h-auto" />
          </div>

          <Card tone="white" className="p-5">
            <p className="text-xs font-semibold text-rose uppercase tracking-wider mb-1">
              Base de partida: para confirmar
            </p>
            <h3 className="font-display text-xl text-ink mb-3">
              {result.primary.line} · {result.primary.reference}
            </h3>
            <p className="text-[13px] text-ink-soft mb-4">{result.primary.description}</p>

            <div className="space-y-3">
              {['Matte', 'Glow'].map((line) => (
                <div key={line}>
                  <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">
                    {LINE_META[line].label}
                  </p>
                  <div className="flex flex-wrap gap-2.5">
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
          </Card>

          <Card tone="soft" className="p-4">
            <p className="text-xs font-semibold text-rose mb-1">Consejo</p>
            <p className="text-[13px] text-ink-soft leading-relaxed">
              Probá la base en la línea de la mandíbula con luz natural. Si se funde con tu piel, es tu tono.
            </p>
          </Card>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2">
        <Button variant="secondary" onClick={() => { dispatch({ type: 'CLEAR_PHOTO' }); goTo(3) }}>
          <RotateCcw className="h-4 w-4" /> Repetir foto y análisis
        </Button>
        <Button size="lg" onClick={() => goTo(6)}>
          Ver mi selección <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}