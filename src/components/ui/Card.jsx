export default function Card({ children, className = '', tone = 'white', as: Tag = 'div', ...props }) {
  const tones = {
    white: 'bg-white/90 backdrop-blur border border-line/70',
    blush: 'bg-blush/60 border border-rose/10',
    paper: 'bg-paper-2 border border-line/60',
    soft: 'bg-gradient-to-br from-white to-blush/40 border border-line/60',
  }
  return (
    <Tag
      className={`rounded-[var(--radius-card)] shadow-card ${tones[tone]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}