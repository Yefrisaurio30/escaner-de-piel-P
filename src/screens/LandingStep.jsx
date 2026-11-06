import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'
import StepHeader from '../components/StepHeader'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { HeroDuo } from '../components/illustrations/PopIllustrations'

const steps = [
  { n: '01', title: 'Nos cuentas', text: 'Respondé 3 preguntas rápidas sobre tu piel.' },
  { n: '02', title: 'Una foto', text: 'Muestro mejilla y frente con luz natural.' },
  { n: '03', title: 'Tu selección', text: 'Te doy referencias y una consulta por WhatsApp.' },
]

export default function LandingStep() {
  const { goTo } = useApp()
  return (
    <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6 lg:gap-10 items-center">
      <div className="order-2 lg:order-1">
        <StepHeader
          eyebrow="Hola, soy Prisma Pop"
          title="Miremos tu tono de piel."
          subtitle="En tres pasos te guío a una base que te acompañe de verdad. Sin registro, sin filtros, sin vueltas."
        />

        <div className="grid sm:grid-cols-3 gap-3 mb-6">
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
      </div>

      <div className="order-1 lg:order-2">
        <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-blush via-white to-cream border border-line/60 shadow-card">
          <HeroDuo className="w-full h-auto" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-ink/70 bg-white/80 backdrop-blur rounded-full px-3 py-1.5">
              Luz natural · Sin filtros
            </span>
            <span className="text-xs font-semibold text-rose bg-white/80 backdrop-blur rounded-full px-3 py-1.5 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> Prisma Pop
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}