function Character({ x, y, skin = '#D9A97E', hair = '#6B4F8F', shirt = '#D82B50', scale = 1, flip = false }) {
  const t = `translate(${x} ${y}) scale(${flip ? -1 : 1} ${scale})`
  return (
    <g transform={t}>
      {/* body */}
      <ellipse cx="0" cy="52" rx="34" ry="44" fill={shirt} opacity="0.95" />
      <ellipse cx="0" cy="40" rx="26" ry="10" fill="#fff" opacity="0.18" />
      {/* neck */}
      <rect x="-7" y="8" width="14" height="16" rx="6" fill={skin} />
      {/* head */}
      <circle cx="0" cy="-12" r="30" fill={skin} />
      {/* hair */}
      <path d="M-30 -18 Q-26 -52 0 -54 Q26 -52 30 -18 Q22 -30 0 -32 Q-22 -30 -30 -18 Z" fill={hair} />
      <path d="M-26 -14 Q-30 -2  -22 6" stroke={hair} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M26 -14 Q30 -2 22 6" stroke={hair} strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* eyes */}
      <circle cx="-10" cy="-14" r="3.2" fill="#2B2323" />
      <circle cx="10" cy="-14" r="3.2" fill="#2B2323" />
      <circle cx="-8.5" cy="-15.5" r="1.1" fill="#fff" />
      <circle cx="11.5" cy="-15.5" r="1.1" fill="#fff" />
      {/* blush */}
      <ellipse cx="-16" cy="-6" rx="5" ry="3" fill="#D82B50" opacity="0.22" />
      <ellipse cx="16" cy="-6" rx="5" ry="3" fill="#D82B50" opacity="0.22" />
      {/* smile */}
      <path d="M-9 -2 Q0 6 9 -2" stroke="#2B2323" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* headphones-ish arc */}
      <path d="M-30 -20 Q0 -58 30 -20" stroke={hair} strokeWidth="3" fill="none" opacity="0.35" />
    </g>
  )
}

export function HeroDuo({ className = '' }) {
  return (
    <svg viewBox="0 0 360 260" className={className} role="img" aria-label="Ilustración Prisma Pop">
      <defs>
        <radialGradient id="blob1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F8DDE2" />
          <stop offset="100%" stopColor="#F8DDE2" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="blob2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#EDE2F7" />
          <stop offset="100%" stopColor="#EDE2F7" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="70" cy="130" rx="110" ry="100" fill="url(#blob1)" />
      <ellipse cx="290" cy="130" rx="110" ry="100" fill="url(#blob2)" />
      <path d="M40 60 Q180 -10 320 60" stroke="#D82B50" strokeWidth="2" fill="none" opacity="0.25" strokeDasharray="6 6" />
      <Character x={105} y={150} skin="#D9A97E" hair="#6B4F8F" shirt="#D82B50" />
      <Character x={250} y={155} skin="#BD8355" hair="#B7A6E8" shirt="#B7A6E8" flip />
      {/* sparkles */}
      <g fill="#C22543" opacity="0.7">
        <path d="M60 40 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" />
        <path d="M300 50 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5 z" fill="#B7A6E8" />
        <path d="M180 25 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z" fill="#F6DDA7" />
      </g>
      {/* floating prism */}
      <g transform="translate(180 210)">
        <polygon points="-18,0 18,0 0,30" fill="url(#prism)" opacity="0.85" />
      </g>
      <defs>
        <linearGradient id="prism" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#D82B50" />
          <stop offset="1" stopColor="#B7A6E8" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function HugDuo({ className = '' }) {
  return (
    <svg viewBox="0 0 360 260" className={className} role="img" aria-label="Ilustración abrazo">
      <ellipse cx="180" cy="140" rx="150" ry="110" fill="#F8E3E6" opacity="0.7" />
      <Character x={150} y={155} skin="#D9A97E" hair="#6B4F8F" shirt="#C22543" />
      <Character x={215} y={155} skin="#E9C6A5" hair="#B9D8F2" shirt="#B7A6E8" flip />
      <path d="M140 170 Q180 200 225 170" stroke="#C22543" strokeWidth="2" fill="none" opacity="0.4" />
      <g fill="#D82B50" opacity="0.7">
        <path d="M90 60 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" />
        <path d="M270 70 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" fill="#B7A6E8" />
      </g>
    </svg>
  )
}

export function ScanDuo({ className = '' }) {
  return (
    <svg viewBox="0 0 360 260" className={className} role="img" aria-label="Ilustración escaneo">
      <rect x="40" y="30" width="280" height="200" rx="28" fill="#fff" stroke="#EADCD6" strokeWidth="2" />
      <rect x="56" y="46" width="248" height="168" rx="20" fill="#F7ECE3" />
      <Character x={135} y={150} skin="#D9A97E" hair="#6B4F8F" shirt="#D82B50" scale={0.85} />
      <Character x={225} y={150} skin="#BD8355" hair="#B7A6E8" shirt="#B7A6E8" scale={0.85} flip />
      {/* camera frame guides */}
      <rect x="95" y="70" width="70" height="70" rx="12" fill="none" stroke="#C22543" strokeWidth="2" strokeDasharray="6 4" opacity="0.7" />
      <rect x="195" y="70" width="70" height="70" rx="12" fill="none" stroke="#C22543" strokeWidth="2" strokeDasharray="6 4" opacity="0.7" />
      <circle cx="130" cy="105" r="6" fill="#C22543" />
      <circle cx="230" cy="105" r="6" fill="#C22543" />
      {/* camera icon */}
      <g transform="translate(180 225)">
        <rect x="-16" y="-10" width="32" height="20" rx="6" fill="#C22543" />
        <circle cx="0" cy="0" r="6" fill="#fff" />
        <circle cx="0" cy="0" r="3" fill="#C22543" />
      </g>
    </svg>
  )
}

export function MatchDuo({ className = '' }) {
  return (
    <svg viewBox="0 0 360 260" className={className} role="img" aria-label="Ilustración match">
      <ellipse cx="180" cy="130" rx="150" ry="100" fill="#F8E3E6" opacity="0.6" />
      <Character x={120} y={160} skin="#D9A97E" hair="#6B4F8F" shirt="#D82B50" />
      <Character x={240} y={160} skin="#BD8355" hair="#B7A6E8" shirt="#B7A6E8" flip />
      {/* heart */}
      <g transform="translate(180 95)">
        <path
          d="M0 12 C-20 -10 -40 4 -20 26 L0 44 L20 26 C40 4 20 -10 0 12 Z"
          fill="#D82B50"
          opacity="0.9"
        />
      </g>
      <g fill="#F6DDA7" opacity="0.8">
        <path d="M70 50 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5 z" />
        <path d="M290 55 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5 z" fill="#B7A6E8" />
      </g>
    </svg>
  )
}

export function PrismMark({ className = '' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="pm" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#D82B50" />
          <stop offset="1" stopColor="#B7A6E8" />
        </linearGradient>
      </defs>
      <polygon points="24,8 40,8 32,40" fill="url(#pm)" />
      <path d="M8 52 Q32 20 56 52" stroke="url(#pm)" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  )
}