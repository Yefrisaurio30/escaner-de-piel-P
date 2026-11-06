import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context/AppContext'
import StepHeader from '../components/StepHeader'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { Camera, RefreshCw, ShieldCheck, Sun, Sparkles, Droplet } from 'lucide-react'
import frenteMejilla from '../assets/frente-mejilla.jpeg'
import { captureVideoFrame, resizeDataUrl, loadImage } from '../lib/image'
import { demoPortraitDataUrl } from '../lib/demoPhoto'

const TIPS = [
  { icon: Sun, title: 'Luz natural', text: 'Frente a una ventana, sin sol directo.' },
  { icon: Sparkles, title: 'Sin filtros', text: 'Tu tono real, sin efectos de color.' },
  { icon: Droplet, title: 'Sin maquillaje', text: 'Sobre todo en mejilla y frente.' },
]

export default function CameraStep() {
  const { dispatch, goTo } = useApp()
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [mode, setMode] = useState('intro') // intro | live | error | error-fallback
  const [error, setError] = useState('')
  const [facing, setFacing] = useState('user')
  const [busy, setBusy] = useState(false)

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) videoRef.current.srcObject = null
  }

  useEffect(() => {
    return () => stopStream()
  }, [])

  async function startCamera(nextFacing = facing) {
    setError('')
    setBusy(true)
    stopStream()
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMode('error')
      setError('Tu navegador no permite usar la cámara.')
      setBusy(false)
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: nextFacing,
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => {})
      }
      setMode('live')
    } catch (e) {
      setMode('error')
      if (e?.name === 'NotAllowedError') {
        setError('Necesitamos permiso para usar la cámara.')
      } else if (e?.name === 'NotFoundError') {
        setError('No encontramos una cámara disponible.')
      } else if (e?.name === 'NotReadableError') {
        setError('La cámara está en uso por otra aplicación.')
      } else {
        setError('No pudimos activar la cámara.')
      }
    } finally {
      setBusy(false)
    }
  }

  async function handleCapture() {
    if (!videoRef.current) return
    setBusy(true)
    try {
      const dataUrl = captureVideoFrame(videoRef.current, facing === 'user')
      const resized = await resizeDataUrl(dataUrl, 1400)
      dispatch({ type: 'SET_PHOTO', photo: { src: resized, width: 0, height: 0, source: 'camera' } })
      stopStream()
      goTo(4)
    } catch {
      setError('No pudimos capturar la foto. Intentá de nuevo.')
    } finally {
      setBusy(false)
    }
  }

  async function handleDemo() {
    setBusy(true)
    setError('')
    try {
      const src = demoPortraitDataUrl()
      const resized = await resizeDataUrl(src, 1400)
      const img = await loadImage(resized)
      dispatch({
        type: 'SET_PHOTO',
        photo: { src: resized, width: img.width, height: img.height, source: 'demo' },
      })
      goTo(4)
    } catch {
      setError('No pudimos cargar la foto de ejemplo.')
    } finally {
      setBusy(false)
    }
  }

  function switchCamera() {
    const next = facing === 'user' ? 'environment' : 'user'
    setFacing(next)
    startCamera(next)
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <StepHeader
        eyebrow="Tu mejor luz, sin filtros"
        title="Escaneamos mejilla y frente."
        subtitle="Nuestros personajes te muestran las zonas de piel que debes escanear."
      />

      {mode === 'intro' && (
        <>
          <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-blush to-cream border border-line/60 shadow-card">
            <img
              src={frenteMejilla}
              alt="Personajes mostrando mejilla y frente"
              className="w-full h-auto mix-blend-multiply"
            />
            <div className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-rose shadow-sm">
              FRENTE
            </div>
            <div className="absolute top-16 left-4 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-rose shadow-sm">
              MEJILLA
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-rose text-white px-3.5 py-1.5 text-[12px] font-semibold">Frente</span>
            <span className="rounded-full bg-rose text-white px-3.5 py-1.5 text-[12px] font-semibold">Mejilla</span>
            <span className="rounded-full bg-cream text-ink/80 px-3.5 py-1.5 text-[12px] font-semibold">Ojera (opcional)</span>
          </div>

          <Card tone="soft" className="p-5">
            <ul className="space-y-3">
              {TIPS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="mt-0.5 h-8 w-8 rounded-full bg-rose-light grid place-items-center shrink-0">
                    <Icon className="h-4 w-4 text-rose" />
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-ink">{title}</p>
                    <p className="text-[13px] text-muted leading-snug">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <div className="flex flex-col gap-3">
            <Button size="lg" className="w-full" loading={busy} onClick={() => startCamera()}>
              <Camera className="h-4 w-4" /> Activar cámara
            </Button>
            <p className="text-[12px] text-muted flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-rose" /> Tú decides cuándo dar permiso. La foto no sale de tu dispositivo.
            </p>
          </div>
        </>
      )}

      {mode === 'live' && (
        <div className="space-y-4">
          <div className="relative rounded-[2rem] overflow-hidden bg-ink shadow-card aspect-[3/4] max-h-[62vh]">
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className={`w-full h-full object-cover ${facing === 'user' ? 'scale-x-[-1]' : ''}`}
            />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-1/2 top-[26%] -translate-x-1/2 h-24 w-20 rounded-[40%] border-2 border-white/80 border-dashed" />
              <div className="absolute left-[62%] top-[52%] -translate-x-1/2 h-20 w-16 rounded-[45%] border-2 border-white/80 border-dashed" />
              <div className="absolute top-4 left-4 bg-black/45 text-white text-xs font-semibold rounded-full px-3 py-1.5 backdrop-blur">
                Frente
              </div>
              <div className="absolute top-[46%] right-4 bg-black/45 text-white text-xs font-semibold rounded-full px-3 py-1.5 backdrop-blur">
                Mejilla
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={switchCamera}>
                <RefreshCw className="h-4 w-4" /> Cambiar cámara
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { stopStream(); setMode('intro') }}>
                Cancelar
              </Button>
            </div>
            <Button size="lg" loading={busy} onClick={handleCapture}>
              Capturar foto
            </Button>
          </div>
          <p className="text-xs text-muted text-center">
            Alineá tu rostro dentro de las guías y tocá “Capturar foto”.
          </p>
        </div>
      )}

      {(mode === 'error') && (
        <Card tone="blush" className="p-5 space-y-4">
          <p className="text-[14px] text-ink">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="secondary" onClick={() => startCamera()}>
              Reintentar
            </Button>
            <Button variant="ghost" onClick={handleDemo} loading={busy}>
              <Sparkles className="h-4 w-4" /> Usar foto de ejemplo
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}