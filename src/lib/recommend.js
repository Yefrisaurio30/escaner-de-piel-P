import { CATALOG } from '../data/catalog'
import { hexToRgb, deltaE, luminance, sampleConsistency } from './color'
import { UNDERTONE_TONE } from '../data/quiz'

export function preferredLine(skin, coverage) {
  if (skin === 'seca') return 'Glow'
  if (skin === 'grasa') return 'Matte'
  if (skin === 'mixta') return coverage === 'alta' ? 'Matte' : 'Glow'
  return 'Matte'
}

export function blendSamples(forehead, cheek) {
  if (!forehead && !cheek) return null
  if (!forehead) return cheek
  if (!cheek) return forehead
  return {
    r: Math.round(forehead.r * 0.4 + cheek.r * 0.6),
    g: Math.round(forehead.g * 0.4 + cheek.g * 0.6),
    b: Math.round(forehead.b * 0.4 + cheek.b * 0.6),
  }
}

export function recommend({ quiz, samples }) {
  const undertoneTone = UNDERTONE_TONE[quiz.veins] || 'neutral'
  const line = preferredLine(quiz.skin, quiz.coverage)
  const sampleRgb = blendSamples(samples.forehead, samples.cheek)
  if (!sampleRgb) return null

  const consistency = sampleConsistency(samples.forehead, samples.cheek)

  const scored = CATALOG.map((product) => {
    const shadeRgb = hexToRgb(product.hex)
    let distance = deltaE(sampleRgb, shadeRgb)
    if (product.undertone !== 'neutral' && undertoneTone !== 'neutral' && product.undertone !== undertoneTone) {
      distance += 9
    }
    if (product.line !== line) distance += 13
    return { product, distance }
  }).sort((a, b) => a.distance - b.distance)

  const primary = scored[0].product
  const alternates = scored.slice(1, 4).map((s) => s.product)
  const closeness = Math.max(0, Math.min(100, Math.round(100 - scored[0].distance * 1.35)))
  const lum = luminance(sampleRgb)

  return {
    undertone: undertoneTone,
    tone: primary.depth,
    line,
    primary,
    alternates,
    all: CATALOG,
    sampleRgb,
    consistency,
    confidence: Math.round(consistency * 100),
    closeness,
    lum,
    lowLight: lum < 95 || lum > 225,
  }
}