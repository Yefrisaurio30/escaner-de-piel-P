// Regression test for the TDZ bug in sampleRegion fallback loop
// (inner `const y` shadowed the `y` parameter before initialization).
import { sampleRegion } from '../src/lib/color.js'

// Fake 2D context: a 30x30 region with uniform non-skin pixels (dark bluish,
// fails isSkinLike -> forces the fallback loop to run).
function makeFakeCtx() {
  const w = 30, h = 30
  const rgba = new Uint8ClampedArray(w * h * 4)
  for (let i = 0; i < w * h; i++) {
    // dark blue-ish pixel: not skin-like, but luminance > 40 so fallback keeps it
    rgba[i * 4] = 40
    rgba[i * 4 + 1] = 60
    rgba[i * 4 + 2] = 90
    rgba[i * 4 + 3] = 255
  }
  return {
    width: w,
    height: h,
    getImageData(x, y, dw, dh) {
      const out = new Uint8ClampedArray(dw * dh * 4)
      for (let j = 0; j < dh; j++) {
        for (let i = 0; i < dw; i++) {
          const sx = x + i, sy = y + j
          if (sx < 0 || sx >= w || sy < 0 || sy >= h) continue
          const s = (sy * w + sx) * 4
          const d = (j * dw + i) * 4
          out[d] = rgba[s]; out[d + 1] = rgba[s + 1]; out[d + 2] = rgba[s + 2]; out[d + 3] = rgba[s + 3]
        }
      }
      return { data: out, width: dw, height: dh }
    },
  }
}

const ctx = makeFakeCtx()
let threw = false
let result = null
try {
  result = sampleRegion(ctx, 15, 15, 8, 30, 30)
} catch (e) {
  threw = true
  console.log('THREW:', e.message)
}
if (threw) {
  console.log('FAIL — sampleRegion fallback crashes')
  process.exit(1)
}
console.log('fallback result:', JSON.stringify(result))
console.log(result && result.r === 40 && result.g === 60 && result.b === 90
  ? 'PASS — fallback path works without TDZ error'
  : 'FAIL — unexpected sample result')
