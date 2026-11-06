import { useApp } from '../context/AppContext'
import StepHeader from '../components/StepHeader'
import Button from '../components/ui/Button'
import PillGroup from '../components/ui/PillGroup'
import Card from '../components/ui/Card'
import { HugDuo } from '../components/illustrations/PopIllustrations'
import {
  SKIN_OPTIONS,
  VEIN_OPTIONS,
  COVERAGE_OPTIONS,
  SKIN_LABEL,
  UNDERTONE_LABEL,
} from '../data/quiz'

export default function QuizStep() {
  const { state, dispatch, goTo } = useApp()
  const { quiz } = state
  const complete = quiz.skin && quiz.veins && quiz.coverage

  return (
    <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6 lg:gap-10 items-start">
      <div>
        <StepHeader
          eyebrow="Sobre ti"
          title="Tu piel tiene mucho que contar."
          subtitle="Respondé con lo que más se acerque. No hay respuestas incorrectas."
        />

        <div className="space-y-6">
          <section>
            <h2 className="text-[15px] font-semibold text-ink mb-2.5">
              ¿Cómo sientes tu piel?
            </h2>
            <PillGroup
              options={SKIN_OPTIONS}
              value={quiz.skin}
              onChange={(v) => dispatch({ type: 'SET_QUIZ', key: 'skin', value: v })}
              columns={3}
            />
          </section>

          <section>
            <h2 className="text-[15px] font-semibold text-ink mb-2.5">
              ¿De qué color ves tus venas?
            </h2>
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
          </section>

          <section>
            <h2 className="text-[15px] font-semibold text-ink mb-2.5">
              ¿Qué cobertura te gusta?
            </h2>
            <PillGroup
              options={COVERAGE_OPTIONS}
              value={quiz.coverage}
              onChange={(v) => dispatch({ type: 'SET_QUIZ', key: 'coverage', value: v })}
              columns={3}
            />
          </section>
        </div>

        <div className="mt-7 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <Button
            size="lg"
            disabled={!complete}
            onClick={() => goTo(3)}
          >
            Continuar a la cámara
          </Button>
          <p className="text-xs text-muted">
            {complete ? '3 de 3 respuestas listas.' : `${[quiz.skin, quiz.veins, quiz.coverage].filter(Boolean).length} de 3 respuestas listas.`}
          </p>
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="rounded-[2rem] overflow-hidden bg-gradient-to-br from-cream to-blush border border-line/60 shadow-card">
          <HugDuo className="w-full h-auto" />
        </div>
        {quiz.skin && (
          <Card tone="soft" className="mt-4 p-4">
            <p className="text-xs font-semibold text-rose mb-1">Tu perfil preliminar</p>
            <p className="text-[14px] text-ink">
              Piel {SKIN_LABEL[quiz.skin].toLowerCase()}
              {quiz.veins ? ` · subtomo ${UNDERTONE_LABEL[quiz.veins].toLowerCase()}` : ''}
              {quiz.coverage ? ` · cobertura ${quiz.coverage}` : ''}
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}