export default function Swatch({ hex, size = 'md', selected = false, label, onClick }) {
  const sizes = { sm: 'h-8 w-8', md: 'h-11 w-11', lg: 'h-14 w-14' }
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      aria-pressed={onClick ? selected : undefined}
      className={`relative rounded-full border-2 transition-all duration-200 ${sizes[size]} ${
        selected ? 'border-rose scale-110 shadow-soft' : 'border-white shadow-sm'
      } ${onClick ? 'cursor-pointer hover:scale-105' : ''}`}
      style={{ backgroundColor: hex }}
      title={label}
    >
      {selected && (
        <span className="absolute inset-0 grid place-items-center text-white text-xs font-bold drop-shadow">
          ✓
        </span>
      )}
    </Tag>
  )
}