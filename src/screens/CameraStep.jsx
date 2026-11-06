import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context/AppContext'
import StepHeader from '../components/StepHeader'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { ScanDuo } from '../components/illustrations/PopIllustrations'
import { Camera, Upload, RefreshCw, AlertTriangle, Sparkles, ShieldCheck } from 'lucide-react'
import { captureVideoFrame, resizeDataUrl, fileToDataUrl, loadImage } from '../lib/image'
import { demoPortraitDataUrl } from '../lib/demoPhoto'

export default function CameraStep() {
  const { dispatch, goTo } = useApp()
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const fileInputRef = useRef(null)
  const [mode, setMode] = useState('intro') // intro | live | error
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
      setError('Tu navegador no permite usar la cámara. Podés subir una foto.')
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
        setError('Necesitamos permiso para usar la cámara. Podés subir una foto en su lugar.')
      } else if (e?.name === 'NotFoundError') {
        setError('No encontramos una cámara disponible.')
      } else if (e?.name === 'NotReadableError') {
        setError('La cámara está en uso por otra aplicación.')
      } else {
        setError('No pudimos activar la cámara. Podés subir una foto.')
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

  async function handleFile(file) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('El archivo debe ser una imagen (JPG, PNG o WebP).')
      return
    }
    if (file.size > 15 * 1024 * 1024) {
      setError('La imagen es muy pesada. Probá con una de menos de 15 MB.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const raw = await fileToDataUrl(file)
      const resized = await resizeDataUrl(raw, 1400)
      const img = await loadImage(resized)
      dispatch({
        type: 'SET_PHOTO',
        photo: { src: resized, width: img.width, height: img.height, source: 'upload' },
      })
      goTo(4)
    } catch {
      setError('No pudimos cargar la imagen. Probá con otra.')
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
      setError('No pudimos cargar la foto de demostración.')
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
    <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6 lg:gap-10 items-start">
      <div>
        <StepHeader
          eyebrow="Una foto"
          title="Escaneamos mejilla y frente."
          subtitle="La cámara es la forma más rápida. Si preferís, subí una foto de tu galería."
        />

        {mode === 'intro' && (
          <div className="space-y-4">
            <Card tone="soft" className="p-5">
              <p className="text-[13px] font-semibold text-ink mb-3">Para una buena lectura:</p>
              <ul className="space-y-2.5">
                {[
                  'Luz natural, de frente (cerca de una ventana).',
                  'Sin filtros, sin modo belleza.',
                  'Sin maquillaje y con el rostro limpio.',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-[14px] text-ink-soft">
                    <span className="mt-0.5 h-5 w-5 rounded-full bg-rose text-white grid place-items-center text-[11px] font-bold shrink-0">
                      ✓
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" loading={busy} onClick={() => startCamera()}>
                <Camera className="h-4 w-4" /> Activar cámara
              </Button>
              <Button
                size="lg"
                variant="secondary"
                loading={busy}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" /> Subir una foto
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <Button variant="ghost" size="sm" onClick={handleDemo} loading={busy}>
                <Sparkles className="h-4 w-4" /> Probar con foto de demostración
              </Button>
              <p className="text-xs text-muted flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-rose" /> Tu foto no sale de tu dispositivo.
              </p>
            </div>
          </div>
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
              {/* guides */}
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

        {mode === 'error' && (
          <Card tone="blush" className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-rose shrink-0 mt-0.5" />
              <p className="text-[14px] text-ink">{error}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4" /> Subir una foto
              </Button>
              <Button variant="ghost" onClick={() => setMode('intro')}>
                Volver
              </Button>
            </div>
          </Card>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      <div className="hidden lg:block">
        <div className="rounded-[2rem] overflow-hidden bg-gradient-to-br from-cream to-blush border border-line/60 shadow-card">
          <ScanDuo className="w-full h-auto" />
        </div>
        <Card tone="soft" className="mt-4 p-4">
          <p className="text-xs font-semibold text-rose mb-1">Privacidad</p>
          <p className="text-[13px] text-ink-soft leading-relaxed">
            Tu foto se procesa en este dispositivo. No se sube a ningún servidor.
          </p>
        </Card>
      </div>
    </div>
  )
}
