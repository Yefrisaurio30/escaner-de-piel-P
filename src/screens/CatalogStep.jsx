import { useMemo, useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import StepHeader from '../components/StepHeader'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import ProductCard from '../components/ProductCard'
import { LINE_META } from '../data/catalog'
import { SKIN_LABEL, COVERAGE_LABEL } from '../data/quiz'
import { buildMessage, buildWhatsAppUrl } from '../lib/whatsapp'
import { MessageCircle, Lightbulb, Info } from 'lucide-react'
import { HeroDuo } from '../components/illustrations/PopIllustrations'

export default function CatalogStep() {
  const { state, goTo } = useApp()
  const result = state.result
  const [tipsOpen, setTipsOpen] = useState(false)

  useEffect(() => {
    if (!result) goTo(5)
  }, [result, goTo])

  const message = useMemo(
    () =>
      result
        ? buildMessage({
            quiz: state.quiz,
            result,
            SKIN_LABEL,
            COVERAGE_LABEL,
          })
        : '',
    [state.quiz, result],
  )

  if (!result) return null

  const url = buildWhatsAppUrl(message)

  const grouped = ['Matte', 'Glow'].map((line) => ({
    line,
    meta: LINE_META[line],
    items: result.all.filter((p) => p.line === line),
  }))

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="rounded-[2rem] overflow-hidden bg-gradient-to-br from-blush to-cream border border-line/60 shadow-card">
        <HeroDuo className="w-full h-auto" />
        <p className="px-4 pb-3 text-[11px] text-muted text-center">
          La cámara estima el tono en mejilla y frente · Confirma el color sobre tu piel
        </p>
      </div>

      <StepHeader
        eyebrow="Tu pequeño guardarropa de tonos"
        title="Hechos para ir contigo."
        subtitle="Siete referencias del catálogo Kevin y Coco para explorar. Selección ilustrativa — confirma los tonos sobre tu piel antes de comprar."
      />

      <Card tone="soft" className="p-5">
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="text-[13px] font-semibold text-ink">Tu guía</span>
          <button
            type="button"
            onClick={() => goTo(2)}
            className="text-[12px] font-semibold text-rose underline"
          >
            Editar
          </button>
        </div>
        <p className="text-[14px] text-ink">
          tono {result.tone.toLowerCase()} / subtono {result.undertone === 'cool' ? 'frío' : result.undertone === 'warm' ? 'cálido' : 'neutro'}
        </p>
        <p className="text-[13px] text-muted mt-1">
          Piel {SKIN_LABEL[state.quiz.skin]?.toLowerCase()} · Venas: {state.quiz.veins} · Cobertura {COVERAGE_LABEL[state.quiz.coverage]?.toLowerCase()}
        </p>
      </Card>

      <p className="text-[12px] text-muted">
        Kevin y Coco · Referencias indicadas por la marca. Colores y envases ilustrativos; sin tonos calibrados ni stock confirmado.
      </p>

      {grouped.map(({ line, meta, items }) => (
        <section key={line} className="space-y-3">
          <div className="flex items-end justify-between">
            <h3 className="font-display text-xl text-ink">{meta.label}</h3>
            <span className="text-[12px] text-muted">
              {items.map((p) => p.reference).join(' · ')}
            </span>
          </div>
          <div className="grid gap-3">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} recommended={p.id === result.primary.id} />
            ))}
          </div>
        </section>
      ))}

      <Card tone="blush" className="p-4 flex gap-3">
        <Info className="h-5 w-5 text-rose shrink-0 mt-0.5" />
        <p className="text-[13px] text-ink-soft">
          Corrector, precorrector y contorno: catálogo pendiente. Se agregarán cuando estén disponibles.
        </p>
      </Card>

      {tipsOpen && (
        <Card tone="paper" className="p-4">
          <p className="text-[13px] font-semibold text-ink mb-1">Sugerencias para elegir mejor</p>
          <ul className="text-[13px] text-ink-soft space-y-1">
            <li>• Probá la base sobre la mandíbula con luz natural.</li>
            <li>• Si el tono se funde con tu piel, es el tuyo.</li>
            <li>• Confirmá antes de comprar; es una guía ilustrativa.</li>
          </ul>
        </Card>
      )}

      <Card tone="paper" className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-rose">Así se vería tu mensaje</span>
          <MessageCircle className="h-4 w-4 text-rose" />
        </div>
        <pre className="whitespace-pre-wrap text-[13px] leading-relaxed text-ink-soft font-body">
          {message}
        </pre>
      </Card>

      <div className="flex flex-col gap-3">
        <Button variant="secondary" size="lg" onClick={() => setTipsOpen((v) => !v)}>
          <Lightbulb className="h-4 w-4" /> Sugerencias
        </Button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 bg-rose text-white hover:bg-rose-dark shadow-soft h-14 px-6 text-base"
        >
          <MessageCircle className="h-5 w-5" />
          Consultar por WhatsApp
        </a>
      </div>

      <p className="text-[12px] text-muted text-center leading-relaxed">
        La foto no se incluiría automáticamente. Podrás revisar el mensaje antes de enviarlo.
      </p>
      <p className="text-[12px] text-muted text-center leading-relaxed">
        Recuerda: la cámara solo estima el tono; la luz y el dispositivo afectan el resultado. Confirma el color en tu piel.
      </p>
    </div>
  )
}