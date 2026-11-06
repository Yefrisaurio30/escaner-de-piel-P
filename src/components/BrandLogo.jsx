const letterColors = [
  'text-rose',
  'text-lavender',
  'text-baby',
  'text-butter',
  'text-mint',
  'text-rose-2',
  'text-rose',
  'text-lavender',
  'text-baby',
]

export default function BrandLogo({ size = 'md', className = '' }) {
  const sizes = { sm: 'text-xl', md: 'text-3xl', lg: 'text-5xl', xl: 'text-6xl' }
  const word = 'PRISMA POP'.replace(' ', '')
  return (
    <div className={`inline-flex flex-col items-center gap-1 ${className}`}>
      <svg
        viewBox="0 0 220 52"
        className="h-8 w-auto sm:h-10"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="prism-rainbow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D82B50" />
            <stop offset="25%" stopColor="#B7A6E8" />
            <stop offset="50%" stopColor="#B9D8F2" />
            <stop offset="75%" stopColor="#F6DDA7" />
            <stop offset="100%" stopColor="#BEE9D8" />
          </linearGradient>
          <linearGradient id="prism-fill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D82B50" />
            <stop offset="100%" stopColor="#B7A6E8" />
          </linearGradient>
        </defs>
        <path
          d="M18 42 Q110 -6 202 42"
          stroke="url(#prism-rainbow)"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        />
        <polygon points="102,10 118,10 110,28" fill="url(#prism-fill)" opacity="0.9" />
        <circle cx="46" cy="18" r="3" fill="#F6DDA7" />
        <circle cx="176" cy="16" r="2.5" fill="#BEE9D8" />
        <circle cx="110" cy="4" r="2" fill="#B7A6E8" />
      </svg>
      <div
        className={`font-logo font-bold leading-none tracking-tight flex items-center justify-center gap-0.5 ${sizes[size]}`}
        style={{ textShadow: '0 2px 0 rgba(255,255,255,0.7), 0 6px 18px rgba(194,37,67,0.18)' }}
      >
        {word.split('').map((c, i) => (
          <span key={i} className={letterColors[i % letterColors.length]}>
            {c}
          </span>
        ))}
      </div>
    </div>
  )
}