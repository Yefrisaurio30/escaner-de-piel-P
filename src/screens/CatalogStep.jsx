import { useMemo, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import StepHeader from '../components/StepHeader'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import ProductCard from '../components/ProductCard'
import { LINE_META } from '../data/catalog'
import { SKIN_LABEL, COVERAGE_LABEL } from '../data/quiz'
import { buildMessage, buildWhatsAppUrl } from '../lib/whatsapp'
import { MessageCircle, Edit3, RotateCcw } from 'lucide-react'

export default function CatalogStep() {
  const { state, goTo } = useApp()
  const result = state.result

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
    <div className="space-y-6">
      <StepHeader
        eyebrow="Tu selección"
        title="Hechos para ir contigo."
        subtitle="Tu guía estimada y las referencias para comparar. El tono final se confirma sobre tu piel."
      />

      <Card tone="soft" className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-rose uppercase tracking-wider mb-2">Tu guía</p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-rose text-white px-3.5 py-1.5 text-sm font-semibold">
                Tono: {result.tone}
              </span>
              <span className="rounded-full bg-white border border-line px-3.5 py-1.5 text-sm font-semibold text-ink">
                Matiz: {result.undertone === 'cool' ? 'Frío' : result.undertone === 'warm' ? 'Cálido' : 'Neutro'}
              </span>
              <span className="rounded-full bg-white border border-line px-3.5 py-1.5 text-sm font-semibold text-ink">
                Piel: {SKIN_LABEL[state.quiz.skin]}
              </span>
              <span className="rounded-full bg-white border border-line px-3.5 py-1.5 text-sm font-semibold text-ink">
                Cobertura: {COVERAGE_LABEL[state.quiz.coverage]}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => goTo(2)}>
            <Edit3 className="h-4 w-4" /> Editar respuestas
          </Button>
        </div>
      </Card>

      {grouped.map(({ line, meta, items }) => (
        <section key={line}>
          <div className="flex items-end justify-between mb-3">
            <div>
              <h3 className="font-display text-xl text-ink">{meta.label}</h3>
              <p className="text-[13px] text-muted">{meta.description}</p>
            </div>
            <span className="text-xs font-semibold text-rose bg-rose-light rounded-full px-3 py-1">
              {items.length} referencias
            </span>
          </div>
          <div className="grid gap-3">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} recommended={p.id === result.primary.id} />
            ))}
          </div>
        </section>
      ))}

      <Card tone="paper" className="p-5">
        <p className="text-xs font-semibold text-rose uppercase tracking-wider mb-2">
          Así se vería tu mensaje
        </p>
        <pre className="whitespace-pre-wrap text-[13px] leading-relaxed text-ink-soft font-body">
          {message}
        </pre>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2">
        <Button variant="secondary" onClick={() => { /* keep */ goTo(3) }}>
          <RotateCcw className="h-4 w-4" /> Nueva foto
        </Button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 bg-[#25D366] text-white hover:bg-[#1ebe57] shadow-soft h-14 px-6 text-base"
        >
          <MessageCircle className="h-5 w-5" />
          Consultar por WhatsApp
        </a>
      </div>

      <p className="text-[11px] text-muted text-center leading-relaxed">
        Orientación visual basada en la foto. El tono final se confirma probando la base sobre tu piel. Tu foto no se envía.
      </p>
    </div>
  )
}