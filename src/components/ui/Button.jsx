import { Loader2 } from 'lucide-react'

const variants = {
  primary:
    'bg-rose text-white hover:bg-rose-dark shadow-soft active:scale-[0.98]',
  secondary:
    'bg-white text-ink border border-line hover:border-rose/40 hover:bg-blush/40',
  ghost: 'bg-transparent text-ink hover:bg-blush/50',
  outline: 'bg-transparent text-rose border border-rose/40 hover:bg-rose-light',
}

const sizes = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-5 text-[15px]',
  lg: 'h-14 px-6 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}