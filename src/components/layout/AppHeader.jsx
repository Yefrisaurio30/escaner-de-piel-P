import { Menu, X, ArrowLeft } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import logo from '../../assets/logo.jpeg'

export default function AppHeader({ showBack = true, onBack }) {
  const { state, dispatch, goTo } = useApp()
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-paper/75 border-b border-line/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {showBack && state.step > 1 ? (
            <button
              type="button"
              onClick={onBack || (() => goTo(state.step - 1))}
              className="h-10 w-10 grid place-items-center rounded-full hover:bg-blush/60 text-ink"
              aria-label="Volver"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            <div className="h-10 w-10" />
          )}
          <img src={logo} alt="Prisma Pop" className="h-12 w-auto rounded-xl mix-blend-multiply" />
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-muted">
          <span className="font-medium">PRISMA POP</span>
          <span className="text-line">•</span>
          <span>Guía de tono</span>
        </div>

        <button
          type="button"
          onClick={() => dispatch({ type: 'TOGGLE_MENU' })}
          className="h-10 w-10 grid place-items-center rounded-full hover:bg-blush/60 text-ink"
          aria-label="Menú"
          aria-expanded={state.menuOpen}
        >
          {state.menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {state.menuOpen && (
        <div className="border-t border-line/60 bg-white/95 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 grid gap-2">
            <button
              type="button"
              onClick={() => { dispatch({ type: 'RESET_ALL' }) }}
              className="text-left rounded-xl px-3 py-2.5 hover:bg-blush/50 text-sm font-medium"
            >
              Reiniciar guía
            </button>
            <button
              type="button"
              onClick={() => { dispatch({ type: 'CLOSE_MENU' }) }}
              className="text-left rounded-xl px-3 py-2.5 hover:bg-blush/50 text-sm font-medium"
            >
              Cerrar menú
            </button>
            <p className="text-xs text-muted px-3 pt-2">
              Orientación visual. Confirmá siempre el tono sobre tu piel.
            </p>
          </div>
        </div>
      )}
    </header>
  )
}