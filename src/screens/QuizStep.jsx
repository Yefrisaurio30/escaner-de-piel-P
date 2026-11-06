import { CheckCircle2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import StepHeader from '../components/StepHeader'
import Button from '../components/ui/Button'
import PillGroup from '../components/ui/PillGroup'
import { HugDuo } from '../components/illustrations/PopIllustrations'
import {
  SKIN_OPTIONS,
  VEIN_OPTIONS,
  COVERAGE_OPTIONS,
  UNDERTONE_LABEL,
} from '../data/quiz'

export default function QuizStep() {
  const { state, dispatch, goTo } = useApp()
  const { quiz } = state
  const complete = quiz.skin && quiz.veins && quiz.coverage
  const answered = [quiz.skin, quiz.veins, quiz.coverage].filter(Boolean).length

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="rounded-[2rem] overflow-hidden bg-gradient-to-br from-blush to-cream border border-line/60 shadow-card">
        <HugDuo className="w-full h-auto" />
      </div>

      <StepHeader
        eyebrow="Primero, un poco de ti"
        title="Tu piel tiene mucho que contar."
        subtitle="Cuatro pistas para afinar tu selección antes de abrir la cámara."
      />

      <section className="space-y-6">
        <div>
          <h2 className="text-[15px] font-semibold text-ink mb-2.5">
            ¿Cómo sientes tu piel?
          </h2>
          <PillGroup
            options={SKIN_OPTIONS}
            value={quiz.skin}
            onChange={(v) => dispatch({ type: 'SET_QUIZ', key: 'skin', value: v })}
            columns={3}
          />
        </div>

        <div>
          <h2 className="text-[15px] font-semibold text-ink mb-2.5">
            ¿De qué color ves tus venas?
          </h2>
          <p className="text-[13px] text-muted mb-2.5">
            Mira tu muñeca con luz natural. Es una pista que orienta, no confirma, tu subtono.
          </p>
          <PillGroup
            options={VEIN_OPTIONS}
            value={quiz.veins}
            onChange={(v) => dispatch({ type: 'SET_QUIZ', key: 'veins', value: v })}
            columns={3}
          />
          {quiz.veins && (
            <p className="mt-2 text-xs text-muted">
              Tendencia detectada: <span className="font-semibold text-rose">{UNDERTONE_LABEL[quiz.veins]}</span>.
            </p>
          )}
        </div>

        <div>
          <h2 className="text-[15px] font-semibold text-ink mb-2.5">
            ¿Qué cobertura te gusta?
          </h2>
          <PillGroup
            options={COVERAGE_OPTIONS}
            value={quiz.coverage}
            onChange={(v) => dispatch({ type: 'SET_QUIZ', key: 'coverage', value: v })}
            columns={3}
          />
        </div>
      </section>

      <div className="flex items-center justify-between">
        <span className="text-[13px] text-ink-soft">
          {answered} de 3 respuestas listas
        </span>
        <CheckCircle2
          className={`h-5 w-5 transition-colors ${complete ? 'text-rose' : 'text-line'}`}
        />
      </div>

      <Button
        size="lg"
        className="w-full"
        disabled={!complete}
        onClick={() => goTo(3)}
      >
        Continuar a la cámara
      </Button>

      <p className="text-[13px] text-muted">
        Podrás revisar tus respuestas antes de consultar.
      </p>
    </div>
  )
}