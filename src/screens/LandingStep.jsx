import { ArrowRight, ShieldCheck, Sparkles, Heart } from 'lucide-react'
import { useApp } from '../context/AppContext'
import StepHeader from '../components/StepHeader'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import frenteMejilla from '../assets/frente-mejilla.jpeg'

const steps = [
  { n: '01', title: 'Nos cuentas', text: 'Respondé 3 preguntas rápidas sobre tu piel.' },
  { n: '02', title: 'Una foto', text: 'Muestro mejilla y frente con luz natural.' },
  { n: '03', title: 'Tu selección', text: 'Te doy referencias y una consulta por WhatsApp.' },
]

export default function LandingStep() {
  const { goTo } = useApp()
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <StepHeader
        eyebrow="Un match más tuyo"
        title="Miremos tu tono de piel."
        subtitle="Encuentra una guía de base, corrector y contorno que se acerque a ti. Sin adivinar entre mil tonos."
      />

      <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-blush via-white to-cream border border-line/60 shadow-card">
        <img
          src={frenteMejilla}
          alt="Zonas de escaneo en mejilla y frente"
          className="w-full h-auto rounded-[2rem] mix-blend-multiply"
        />
        <div className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-rose shadow-sm">
          SCANEA AQUÍ · FRENTE
        </div>
        <div className="absolute top-16 left-4 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-rose shadow-sm">
          SCANEA AQUÍ · MEJILLA
        </div>
        <div className="absolute bottom-4 left-4 rounded-full bg-blush px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ink/80">
          MENOS DUDA. MÁS TÚ.
        </div>
        <div className="absolute bottom-4 right-4 h-11 w-11 rounded-full bg-white/90 backdrop-blur grid place-items-center shadow-sm">
          <Heart className="h-5 w-5 text-rose" fill="none" />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {steps.map((s) => (
          <Card key={s.n} tone="soft" className="p-4">
            <p className="text-xs font-bold text-rose mb-1">{s.n}</p>
            <p className="font-semibold text-ink text-[15px]">{s.title}</p>
            <p className="text-[13px] text-muted mt-1 leading-snug">{s.text}</p>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <Button size="lg" onClick={() => goTo(2)}>
          Encontrar mi tono
          <ArrowRight className="h-4 w-4" />
        </Button>
        <p className="text-xs text-muted flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-rose" />
          Tu foto se queda en tu dispositivo.
        </p>
      </div>

      <p className="text-center text-[13px] text-ink-soft flex items-center justify-center gap-2">
        <Sparkles className="h-4 w-4 text-rose" /> Sin prisa. Vamos contigo.
      </p>
    </div>
  )
}