import { CATALOG } from '../data/catalog'
import { hexToRgb, rgbToLab, labToRgb, deltaE2000, luminance, sampleConsistency } from './color'
import { UNDERTONE_TONE } from '../data/quiz'

export function preferredLine(skin, coverage) {
  if (skin === 'seca') return 'Glow'
  if (skin === 'grasa') return 'Matte'
  if (skin === 'mixta') return coverage === 'alta' ? 'Matte' : 'Glow'
  return 'Matte'
}

// Combine both samples in Lab space (perceptually correct blending), falling
// back to a plain RGB average when Lab medians are not available.
const W_FOREHEAD = 0.4
const W_CHEEK = 0.6

export function blendSamples(forehead, cheek) {
  if (!forehead && !cheek) return null
  if (!forehead) return cheek
  if (!cheek) return forehead

  if (forehead.lab && cheek.lab) {
    const blendedLab = {
      L: forehead.lab.L * W_FOREHEAD + cheek.lab.L * W_CHEEK,
      a: forehead.lab.a * W_FOREHEAD + cheek.lab.a * W_CHEEK,
      b: forehead.lab.b * W_FOREHEAD + cheek.lab.b * W_CHEEK,
    }
    return { ...labToRgb(blendedLab), lab: blendedLab }
  }

  return {
    r: Math.round(forehead.r * W_FOREHEAD + cheek.r * W_CHEEK),
    g: Math.round(forehead.g * W_FOREHEAD + cheek.g * W_CHEEK),
    b: Math.round(forehead.b * W_FOREHEAD + cheek.b * W_CHEEK),
  }
}

// Undertone estimated from the sample itself: warm skin shows higher b*
// (yellow) relative to a* (red); cool skin is the opposite.
export function measuredUndertone(sampleRgb) {
  if (!sampleRgb) return null
  const lab = sampleRgb.lab || rgbToLab(sampleRgb)
  const absA = Math.abs(lab.a)
  const absB = Math.abs(lab.b)
  if (absA + absB < 4) return null // near-neutral chroma: no signal
  const ratio = absB / Math.max(absA, 0.5)
  if (ratio > 1.35) return 'warm'
  if (ratio < 1.05) return 'cool'
  return 'neutral'
}

// The quiz answer is more reliable than chroma heuristics, but when they
// agree we boost confidence; when the quiz is neutral we accept the reading.
export function reconcileUndertone(quizTone, measuredTone) {
  if (!measuredTone) return quizTone
  if (quizTone === measuredTone) return quizTone
  if (quizTone === 'neutral') return measuredTone
  if (measuredTone === 'neutral') return quizTone
  return quizTone // disagree on warm/cool: trust the quiz, flag low confidence
}

export function recommend({ quiz, samples }) {
  const quizTone = UNDERTONE_TONE[quiz.veins] || 'neutral'
  const line = preferredLine(quiz.skin, quiz.coverage)
  const sampleRgb = blendSamples(samples.forehead, samples.cheek)
  if (!sampleRgb) return null

  const sampleLab = sampleRgb.lab || rgbToLab(sampleRgb)
  const consistency = sampleConsistency(samples.forehead, samples.cheek)

  const measured = measuredUndertone(sampleRgb)
  const undertoneTone = reconcileUndertone(quizTone, measured)
  const undertoneAgrees = !measured || measured === quizTone

  // Color perception: CIEDE2000 distance + subtle undertone/line preference.
  const scored = CATALOG.map((product) => {
    const shadeRgb = hexToRgb(product.hex)
    let distance = deltaE2000(sampleRgb, shadeRgb)
    if (
      product.undertone !== 'neutral' &&
      undertoneTone !== 'neutral' &&
      product.undertone !== undertoneTone
    ) {
      distance += 4
    }
    if (product.line !== line) distance += 6
    return { product, distance }
  }).sort((a, b) => a.distance - b.distance)

  const primary = scored[0].product
  const alternates = scored.slice(1, 4).map((s) => s.product)
  const closeness = Math.max(0, Math.min(100, Math.round(100 - scored[0].distance * 2)))
  const lum = luminance(sampleRgb)
  const confidence = Math.round(consistency * (undertoneAgrees ? 100 : 80))

  return {
    undertone: undertoneTone,
    measuredUndertone: measured,
    undertoneAgrees,
    tone: primary.depth,
    line,
    primary,
    alternates,
    all: CATALOG,
    sampleRgb,
    sampleLab,
    consistency,
    confidence,
    closeness,
    lum,
    lowLight: lum < 95 || lum > 225,
  }
}
