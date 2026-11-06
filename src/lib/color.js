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

export function deltaE(rgbA, rgbB) {
  const a = rgbToLab(rgbA)
  const b = rgbToLab(rgbB)
  return Math.sqrt(
    (a.L - b.L) ** 2 + (a.a - b.a) ** 2 + (a.b - b.b) ** 2,
  )
}

export function luminance({ r, g, b }) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function isSkinLike({ r, g, b }) {
  // Loose skin-like filter for sample averaging.
  if (r < 30 || g < 20 || b < 15) return false
  if (r < g + 5) return false // skin is generally redder than green
  const lum = luminance({ r, g, b })
  if (lum > 248) return false
  return true
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
  let sum = { r: 0, g: 0, b: 0 }
  let count = 0
  for (let i = 0; i < data.length; i += 4) {
    const px = { r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] }
    if (px.a < 120) continue
    // soft circular mask
    const dx = (x0 + (i / 4) % w) - x
    const dy = (y0 + Math.floor((i / 4) / w)) - y
    if (Math.sqrt(dx * dx + dy * dy) > r) continue
    if (!isSkinLike(px)) continue
    sum.r += px.r
    sum.g += px.g
    sum.b += px.b
    count++
  }
  if (count === 0) {
    // fallback: average all pixels in region
    for (let i = 0; i < data.length; i += 4) {
      const px = { r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] }
      if (px.a < 120) continue
      sum.r += px.r
      sum.g += px.g
      sum.b += px.b
      count++
    }
  }
  if (count === 0) return null
  return {
    r: Math.round(sum.r / count),
    g: Math.round(sum.g / count),
    b: Math.round(sum.b / count),
    count,
  }
}

export function depthLabelFromLuminance(lum) {
  if (lum < 118) return 'Profundo'
  if (lum < 152) return 'Medio profundo'
  if (lum < 188) return 'Medio'
  return 'Claro'
}

export function sampleConsistency(rgbA, rgbB) {
  if (!rgbA || !rgbB) return 0
  const d = deltaE(rgbA, rgbB)
  // lower distance => higher consistency (0..1)
  return Math.max(0, Math.min(1, 1 - d / 40))
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