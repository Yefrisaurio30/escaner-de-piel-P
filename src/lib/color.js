export function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean
  const n = parseInt(full, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

export function rgbToHex({ r, g, b }) {
  return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
}

export function rgbToLab({ r, g, b }) {
  let rr = r / 255, gg = g / 255, bb = b / 255
  rr = rr > 0.04045 ? Math.pow((rr + 0.055) / 1.055, 2.4) : rr / 12.92
  gg = gg > 0.04045 ? Math.pow((gg + 0.055) / 1.055, 2.4) : gg / 12.92
  bb = bb > 0.04045 ? Math.pow((bb + 0.055) / 1.055, 2.4) : bb / 12.92

  let x = (rr * 0.4124 + gg * 0.3576 + bb * 0.1805) / 0.95047
  let y = (rr * 0.2126 + gg * 0.7352 + bb * 0.0722) / 1.0
  let z = (rr * 0.0193 + gg * 0.1192 + bb * 0.9505) / 1.08883

  x = x > 0.008856 ? Math.cbrt(x) : 7.787 * x + 16 / 116
  y = y > 0.008856 ? Math.cbrt(y) : 7.787 * y + 16 / 116
  z = z > 0.008856 ? Math.cbrt(z) : 7.787 * z + 16 / 116

  return { L: 116 * y - 16, a: 500 * (x - y), b: 200 * (y - z) }
}

export function median(values) {
  if (!values.length) return null
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid]
}

const DEG = Math.PI / 180

// Core CIEDE2000 operating directly on Lab values (Sharma et al. 2005 spec).
export function deltaE2000Lab(lab1, lab2) {
  const C1 = Math.hypot(lab1.a, lab1.b)
  const C2 = Math.hypot(lab2.a, lab2.b)
  const Cmean = (C1 + C2) / 2
  const c7 = Cmean ** 7
  const G = 0.5 * (1 - Math.sqrt(c7 / (c7 + 25 ** 7)))

  const a1 = (1 + G) * lab1.a
  const a2 = (1 + G) * lab2.a
  const C1p = Math.hypot(a1, lab1.b)
  const C2p = Math.hypot(a2, lab2.b)

  // Hue angles in [0, 2π)
  const h1 = (Math.atan2(lab1.b, a1) + 2 * Math.PI) % (2 * Math.PI)
  const h2 = (Math.atan2(lab2.b, a2) + 2 * Math.PI) % (2 * Math.PI)

  const dLp = lab2.L - lab1.L
  const dCp = C2p - C1p

  let dhp = 0
  if (C1p * C2p !== 0) {
    if (Math.abs(h2 - h1) <= Math.PI) dhp = h2 - h1
    else if (h2 < h1) dhp = h2 - h1 + 2 * Math.PI
    else dhp = h2 - h1 - 2 * Math.PI
  }
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(dhp / 2)

  const Lbar = (lab1.L + lab2.L) / 2
  const Cpbar = (C1p + C2p) / 2

  let hbar = h1 + h2
  if (C1p * C2p !== 0) {
    if (Math.abs(h1 - h2) > Math.PI) {
      hbar = h1 + h2 < 2 * Math.PI ? hbar + 2 * Math.PI : hbar - 2 * Math.PI
    }
    hbar /= 2
  } else {
    hbar /= 2
  }

  const T =
    1 -
    0.17 * Math.cos(hbar - 30 * DEG) +
    0.24 * Math.cos(2 * hbar) +
    0.32 * Math.cos(3 * hbar + 6 * DEG) -
    0.2 * Math.cos(4 * hbar - 63 * DEG)

  const dTheta = 30 * DEG * Math.exp(-(((hbar - 275 * DEG) / (25 * DEG)) ** 2))
  const Rc = 2 * Math.sqrt(Cpbar ** 7 / (Cpbar ** 7 + 25 ** 7))
  const RT = -Rc * Math.sin(2 * dTheta)

  const Lm50 = Lbar - 50
  const SL = 1 + (0.015 * Lm50 ** 2) / Math.sqrt(20 + Lm50 ** 2)
  const SC = 1 + 0.045 * Cpbar
  const SH = 1 + 0.015 * Cpbar * T

  const tL = (dLp / SL) ** 2
  const tC = (dCp / SC) ** 2
  const tH = (dHp / SH) ** 2
  const tRT = RT * (dCp / SC) * (dHp / SH)

  return Math.sqrt(Math.max(0, tL + tC + tH + tRT))
}

export function deltaE2000(rgbA, rgbB) {
  return deltaE2000Lab(rgbToLab(rgbA), rgbToLab(rgbB))
}

export function labToRgb({ L, a, b }) {
  const fy = (L + 16) / 116
  const fx = fy + a / 500
  const fz = fy - b / 200
  const inv = (t) => {
    const t3 = t * t * t
    return t3 > 0.008856 ? t3 : (t - 16 / 116) / 7.787
  }
  const x = inv(fx) * 0.95047
  const y = inv(fy) * 1.0
  const z = inv(fz) * 1.08883

  const linR = 3.2406 * x - 1.5372 * y - 0.4986 * z
  const linG = -0.9689 * x + 1.8758 * y + 0.0415 * z
  const linB = 0.0557 * x - 0.204 * y + 1.057 * z

  const encode = (v) => {
    const c = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(Math.max(0, v), 1 / 2.4) - 0.055
    return Math.round(Math.min(255, Math.max(0, c * 255)))
  }
  return { r: encode(linR), g: encode(linG), b: encode(linB) }
}

export function luminance({ r, g, b }) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function isSkinLike({ r, g, b }) {
  const y = 0.299 * r + 0.587 * g + 0.114 * b
  const cb = (b - y) * 0.564 + 128
  const cr = (r - y) * 0.713 + 128
  // Broad skin chroma window (YCbCr) with luminance guard
  return (
    y > 70 &&
    y < 250 &&
    cb >= 70 && cb <= 130 &&
    cr >= 130 && cr <= 180
  )
}

export function sampleRegion(ctx, x, y, radius, width, height) {
  const r = Math.max(2, Math.round(radius))
  const x0 = Math.max(0, Math.round(x) - r)
  const y0 = Math.max(0, Math.round(y) - r)
  const x1 = Math.min(width, Math.round(x) + r + 1)
  const y1 = Math.min(height, Math.round(y) + r + 1)
  const w = x1 - x0
  const h = y1 - y0
  if (w <= 0 || h <= 0) return null
  const data = ctx.getImageData(x0, y0, w, h).data
  const rs = []
  const gs = []
  const bs = []
  const Ls = []
  const As = []
  const Bs = []
  for (let i = 0; i < data.length; i += 4) {
    const px = { r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] }
    if (px.a < 120) continue
    // soft circular mask
    const dx = (x0 + (i / 4) % w) - x
    const dy = (y0 + Math.floor((i / 4) / w)) - y
    if (Math.sqrt(dx * dx + dy * dy) > r) continue
    if (!isSkinLike(px)) continue
    rs.push(px.r)
    gs.push(px.g)
    bs.push(px.b)
    const lab = rgbToLab(px)
    Ls.push(lab.L)
    As.push(lab.a)
    Bs.push(lab.b)
  }
  if (rs.length === 0) {
    // fallback: include all pixels in mask, keep skin-friendly filter to avoid shadows/noise
    for (let i = 0; i < data.length; i += 4) {
      const px = { r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] }
      if (px.a < 120) continue
      const dx = (x0 + (i / 4) % w) - x
      const dy = (y0 + Math.floor((i / 4) / w)) - y
      if (Math.sqrt(dx * dx + dy * dy) > r) continue
      const lum = 0.299 * px.r + 0.587 * px.g + 0.114 * px.b
      if (lum <= 40) continue
      rs.push(px.r)
      gs.push(px.g)
      bs.push(px.b)
      const lab = rgbToLab(px)
      Ls.push(lab.L)
      As.push(lab.a)
      Bs.push(lab.b)
    }
  }
  if (rs.length === 0) return null
  const rOut = Math.round(median(rs))
  const gOut = Math.round(median(gs))
  const bOut = Math.round(median(bs))
  const lab = {
    L: median(Ls),
    a: median(As),
    b: median(Bs),
  }
  const spread = medAbsDeviation(Ls)
  return { r: rOut, g: gOut, b: bOut, lab, spread, count: rs.length }
}

function medAbsDeviation(values) {
  if (!values.length) return 0
  const m = median(values)
  const devs = values.map((v) => Math.abs(v - m))
  return median(devs)
}

export function depthLabelFromLuminance(lum) {
  if (lum < 118) return 'Profundo'
  if (lum < 152) return 'Medio profundo'
  if (lum < 188) return 'Medio'
  return 'Claro'
}

export function sampleConsistency(rgbA, rgbB) {
  if (!rgbA || !rgbB) return 0
  const d = deltaE2000(rgbA, rgbB)
  // lower distance => higher consistency (0..1)
  return Math.max(0, Math.min(1, 1 - d / 20))
}

export function lightQuality(rgb) {
  if (!rgb) return 'sin muestra'
  const l = luminance(rgb)
  if (l < 70) return 'Muy oscura'
  if (l < 115) return 'Oscura'
  if (l < 195) return 'Buena'
  if (l < 230) return 'Brillante'
  return 'Muy brillante'
}