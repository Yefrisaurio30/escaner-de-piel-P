export default function StepHeader({ eyebrow, title, subtitle, align = 'left' }) {
  return (
    <header className={`mb-6 ${align === 'center' ? 'text-center' : ''}`}>
      {eyebrow && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose mb-2">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-[2rem] leading-[1.05] text-ink text-balance sm:text-[2.4rem]">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-[15px] leading-relaxed text-muted max-w-prose">
          {subtitle}
        </p>
      )}
    </header>
  )
}