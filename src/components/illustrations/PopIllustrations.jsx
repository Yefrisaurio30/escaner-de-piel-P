function Character({
  x,
  y,
  skin = '#E9C6A5',
  hair = '#6B4F8F',
  shirt = '#D82B50',
  scale = 1,
  flip = false,
  headphones = false,
  glasses = false,
}) {
  const t = `translate(${x} ${y}) scale(${flip ? -1 : 1} ${scale})`
  return (
    <g transform={t}>
      {/* body */}
      <path d="M-34 96 Q0 58 34 96 L34 120 L-34 120 Z" fill={shirt} opacity="0.95" />
      <ellipse cx="0" cy="70" rx="22" ry="14" fill={shirt} opacity="0.9" />
      {/* neck */}
      <rect x="-8" y="36" width="16" height="22" rx="8" fill={skin} />
      {/* head */}
      <path d="M-32 8 Q-38 -26 -22 -42 Q0 -54 22 -42 Q38 -26 32 8 Q20 34 0 34 Q-20 34 -32 8 Z" fill={skin} />
      {/* hair */}
      <path d="M-34 -20 Q-40 -52 0 -60 Q40 -52 34 -20 Q28 -46 0 -46 Q-28 -46 -34 -20 Z" fill={hair} />
      <path d="M-34 -18 Q-32 12 -30 18 L-38 18 Q-40 -4 -34 -18 Z" fill={hair} />
      <path d="M34 -18 Q32 12 30 18 L38 18 Q40 -4 34 -18 Z" fill={hair} />
      {headphones && (
        <g stroke={hair} strokeWidth="5" fill="none">
          <path d="M-34 -22 Q-40 4 -34 22" />
          <path d="M34 -22 Q40 4 34 22" />
        </g>
      )}
      {/* ears */}
      <ellipse cx="-33" cy="6" rx="4" ry="6" fill={skin} />
      <ellipse cx="33" cy="6" rx="4" ry="6" fill={skin} />
      {/* eyes */}
      <ellipse cx="-11" cy="4" rx="4" ry="4.5" fill="#2B2323" />
      <ellipse cx="11" cy="4" rx="4" ry="4.5" fill="#2B2323" />
      <circle cx="-9.5" cy="2.5" r="1.3" fill="#fff" />
      <circle cx="12.5" cy="2.5" r="1.3" fill="#fff" />
      {glasses && (
        <g stroke="#2B2323" strokeWidth="1.8" fill="none">
          <circle cx="-11" cy="4" r="8" />
          <circle cx="11" cy="4" r="8" />
          <path d="M-3 4 L3 4" />
        </g>
      )}
      {/* brows */}
      <path d="M-17 -6 Q-11 -9 -5 -6" stroke="#2B2323" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M5 -6 Q11 -9 17 -6" stroke="#2B2323" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* blush */}
      <ellipse cx="-18" cy="14" rx="5" ry="3" fill="#D82B50" opacity="0.22" />
      <ellipse cx="18" cy="14" rx="5" ry="3" fill="#D82B50" opacity="0.22" />
      {/* smile */}
      <path d="M-7 22 Q0 30 7 22" stroke="#2B2323" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  )
}

function Rainbow({ x = 200, y = 110, scale = 1 }) {
  const t = `translate(${x} ${y}) scale(${scale})`
  return (
    <g transform={t} opacity="0.28">
      <path d="M-110 0 A110 110 0 0 1 110 0" stroke="#D82B50" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M-88 0 A88 88 0 0 1 88 0" stroke="#B7A6E8" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M-66 0 A66 66 0 0 1 66 0" stroke="#B9D8F2" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M-44 0 A44 44 0 0 1 44 0" stroke="#F6DDA7" strokeWidth="10" fill="none" strokeLinecap="round" />
    </g>
  )
}

function Sparkles({ points = [[40, 40], [340, 60], [60, 250], [330, 220]] }) {
  return (
    <g fill="#C22543" opacity="0.7">
      {points.map(([x, y], i) => (
        <path
          key={i}
          d={`M${x} ${y} l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z`}
          opacity={0.5 + (i % 3) * 0.15}
        />
      ))}
    </g>
  )
}

export function HeroDuo({ className = '' }) {
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label="Ilustración Prisma Pop">
      <defs>
        <linearGradient id="hd-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FDEDF0" />
          <stop offset="1" stopColor="#FBF3EE" />
        </linearGradient>
        <radialGradient id="hd-blob1" cx="30%" cy="40%" r="40%">
          <stop offset="0" stopColor="#F8DDE2" />
          <stop offset="1" stopColor="#F8DDE2" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hd-blob2" cx="70%" cy="40%" r="40%">
          <stop offset="0" stopColor="#EDE2F7" />
          <stop offset="1" stopColor="#EDE2F7" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" rx="32" fill="url(#hd-bg)" />
      <ellipse cx="120" cy="150" rx="130" ry="110" fill="url(#hd-blob1)" />
      <ellipse cx="300" cy="150" rx="130" ry="110" fill="url(#hd-blob2)" />
      <Rainbow x={200} y={120} scale={1.1} />
      <Character x={135} y={205} skin="#E9C6A5" hair="#6B4F8F" shirt="#D82B50" headphones glasses />
      <Character x={265} y={205} skin="#BD8355" hair="#B9D8F2" shirt="#B7A6E8" flip />
      <Sparkles />
    </svg>
  )
}

export function HugDuo({ className = '' }) {
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label="Ilustración abraza">
      <defs>
        <linearGradient id="hug-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FDEDF0" />
          <stop offset="1" stopColor="#FBF3EE" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" rx="32" fill="url(#hug-bg)" />
      <path d="M0 300 Q200 160 400 300 Z" fill="#F8DDE2" opacity="0.6" />
      <Character x={160} y={210} skin="#E9C6A5" hair="#6B4F8F" shirt="#C22543" />
      <Character x={240} y={210} skin="#D9A97E" hair="#B9D8F2" shirt="#B7A6E8" flip />
      <path d="M150 265 Q200 285 260 265" stroke="#C22543" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.35" />
      <Sparkles points={[[70,60],[340,80],[120,240],[280,240]]} />
    </svg>
  )
}

export function ScanDuo({ className = '' }) {
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label="Ilustración escaneo">
      <defs>
        <linearGradient id="scan-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FDEDF0" />
          <stop offset="1" stopColor="#FBF3EE" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" rx="32" fill="url(#scan-bg)" />
      <Character x={150} y={220} skin="#E9C6A5" hair="#6B4F8F" shirt="#D82B50" headphones scale={0.9} glasses />
      <Character x={250} y={220} skin="#BD8355" hair="#B9D8F2" shirt="#B7A6E8" scale={0.9} flip />
      <g transform="translate(0 0)">
        <rect x="110" y="120" width="80" height="80" rx="18" fill="none" stroke="#C22543" strokeWidth="2" strokeDasharray="6 4" opacity="0.65" />
        <rect x="222" y="120" width="80" height="80" rx="18" fill="none" stroke="#C22543" strokeWidth="2" strokeDasharray="6 4" opacity="0.65" />
        <circle cx="150" cy="160" r="5" fill="#C22543" />
        <circle cx="262" cy="160" r="5" fill="#C22543" />
      </g>
      <g transform="translate(200 280)">
        <rect x="-22" y="-10" width="44" height="20" rx="8" fill="#C22543" />
        <circle cx="0" cy="0" r="6" fill="#fff" />
        <circle cx="0" cy="0" r="3" fill="#C22543" />
      </g>
      <Sparkles points={[[50,60],[350,70],[70,260],[340,250]]} />
    </svg>
  )
}

export function MatchDuo({ className = '' }) {
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label="Ilustración match">
      <defs>
        <linearGradient id="match-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FDEDF0" />
          <stop offset="1" stopColor="#FBF3EE" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" rx="32" fill="url(#match-bg)" />
      <Rainbow x={200} y={130} scale={1.2} />
      <Character x={140} y={210} skin="#E9C6A5" hair="#6B4F8F" shirt="#D82B50" />
      <Character x={260} y={210} skin="#BD8355" hair="#B9D8F2" shirt="#B7A6E8" flip />
      <path
        d="M200 130 C180 110 160 125 190 150 L200 162 L210 150 C240 125 220 110 200 130 Z"
        fill="#D82B50"
        opacity="0.9"
      />
      <Sparkles points={[[70,50],[330,60],[90,250],[320,240]]} />
    </svg>
  )
}
