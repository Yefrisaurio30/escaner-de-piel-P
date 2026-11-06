export default function PillGroup({ options, value, onChange, columns = 3 }) {
  return (
    <div
      className={`grid gap-2.5 ${
        columns === 2 ? 'grid-cols-2' : columns === 3 ? 'grid-cols-3' : 'grid-cols-1'
      }`}
    >
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={`group text-left rounded-2xl border px-3.5 py-3 transition-all duration-200 min-h-[68px] ${
              active
                ? 'border-rose bg-rose text-white shadow-soft'
                : 'border-line bg-white hover:border-rose/40 hover:bg-blush/40'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className={`text-[15px] font-semibold ${active ? 'text-white' : 'text-ink'}`}>
                {opt.label}
              </span>
              {active && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 rounded-full px-2 py-0.5">
                  Elegido
                </span>
              )}
            </div>
            {opt.hint && (
              <p className={`mt-1 text-[12px] leading-snug ${active ? 'text-white/85' : 'text-muted'}`}>
                {opt.hint}
              </p>
            )}
          </button>
        )
      })}
    </div>
  )
}