import { STEPS } from '../data/steps'

export default function StepProgress({ current }) {
  return (
    <div className="w-full" aria-label="Progreso del flujo">
      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-muted mb-2">
        <span>
          {String(current).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
        </span>
        <span className="text-rose">{STEPS[current - 1]?.label}</span>
      </div>
      <div className="flex gap-1.5">
        {STEPS.map((s, i) => {
          const n = i + 1
          const done = n < current
          const active = n === current
          return (
            <div
              key={s.id}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                done ? 'bg-rose' : active ? 'bg-rose-2' : 'bg-line'
              }`}
              aria-current={active ? 'step' : undefined}
            />
          )
        })}
      </div>
    </div>
  )
}