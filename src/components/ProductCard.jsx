import Swatch from './ui/Swatch'
import { Sparkles } from 'lucide-react'

export default function ProductCard({ product, recommended = false }) {
  return (
    <article
      className={`group rounded-[1.5rem] border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card ${
        recommended
          ? 'border-rose bg-gradient-to-br from-rose-light/60 to-white shadow-soft'
          : 'border-line bg-white'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <Swatch hex={product.hex} size="lg" selected={recommended} />
          {recommended && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose text-white grid place-items-center text-[10px] font-bold shadow-soft">
              ★
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-ink text-[15px]">{product.name || `${product.line} · ${product.reference}`}</h4>
            {recommended && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose bg-rose-light rounded-full px-2 py-0.5">
                Recomendada
              </span>
            )}
          </div>
          <p className="text-[12px] text-muted mt-0.5">
            {product.line} · Ref. {product.reference} · {product.depth}
          </p>
          <p className="text-[13px] text-ink-soft mt-2 leading-snug">{product.description}</p>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-muted">
            <Sparkles className="h-3.5 w-3.5 text-rose" />
            <span>Acabado {product.line === 'Matte' ? 'mate' : 'luminoso'}</span>
          </div>
        </div>
      </div>
    </article>
  )
}