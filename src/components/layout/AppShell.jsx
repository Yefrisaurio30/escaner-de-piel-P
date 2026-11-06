import { useApp } from '../../context/AppContext'
import AppHeader from './AppHeader'
import { STEPS } from '../../data/steps'
import StepProgress from '../StepProgress'
import BrandLogo from '../BrandLogo'

export default function AppShell({ children }) {
  const { state, goTo } = useApp()
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-4 lg:py-8 flex-1 grid lg:grid-cols-[290px_1fr] gap-6 lg:gap-10">
        <aside className="hidden lg:flex flex-col gap-6 sticky top-8 self-start">
          <BrandLogo size="md" />
          <div className="rounded-[var(--radius-card)] bg-white/80 border border-line/70 p-5 shadow-card">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose mb-3">
              Tu pedido en 6 pasos
            </p>
            <ol className="space-y-1.5">
              {STEPS.map((s, i) => {
                const n = i + 1
                const active = n === state.step
                const done = n < state.step
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => goTo(n)}
                      className={`w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 transition-colors ${
                        active
                          ? 'bg-rose text-white'
                          : done
                          ? 'text-ink hover:bg-blush/50'
                          : 'text-muted hover:bg-blush/40'
                      }`}
                    >
                      <span
                        className={`text-xs font-bold w-6 ${
                          active ? 'text-white' : 'text-rose'
                        }`}
                      >
                        {String(n).padStart(2, '0')}
                      </span>
                      <span className="text-sm font-medium">{s.label}</span>
                    </button>
                  </li>
                )
              })}
            </ol>
            <div className="mt-4">
              <StepProgress current={state.step} />
            </div>
          </div>
          <div className="rounded-[var(--radius-card)] bg-gradient-to-br from-blush to-white border border-rose/10 p-5">
            <p className="text-xs font-semibold text-rose mb-1">Acerca de tu tono</p>
            <p className="text-[13px] leading-relaxed text-ink-soft">
              La guía es una orientación visual. El tono final se confirma probando la base sobre tu piel con luz natural.
            </p>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="lg:hidden mb-5">
            <StepProgress current={state.step} />
          </div>
          <div key={state.step} className="animate-fade-up">
            {children}
          </div>
        </main>
      </div>

      <footer className="mt-auto border-t border-line/60 bg-white/60 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between text-xs text-muted">
          <span>{BRAND_TAGLINE}</span>
          <span className="hidden sm:inline">Hecho con cuidado · PRISMA POP</span>
        </div>
      </footer>
    </div>
  )
}

const BRAND_TAGLINE = 'Tu piel, en sus propios tonos.'