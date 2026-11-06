// Dump all sourcemap mappings in a generated line/column range.
import { readFileSync } from 'node:fs'

const [bundle, line, colStart, colEnd] = process.argv.slice(2)
const map = JSON.parse(readFileSync(bundle + '.map', 'utf8'))
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const vlqDecode = (str) => {
  const values = []
  let shift = 0, value = 0
  for (const ch of str) {
    const digit = B64.indexOf(ch)
    const cont = digit & 32
    value += (digit & 31) << shift
    if (cont) { shift += 5; continue }
    const shouldNegate = value & 1
    value >>= 1
    values.push(shouldNegate ? -value : value)
    value = 0; shift = 0
  }
  return values
}

let srcIdx = 0, srcLine = 0, srcCol = 0
let genLine = 0
const out = []
for (const segGroup of map.mappings.split(';')) {
  let genCol = 0
  for (const segment of segGroup.split(',')) {
    if (!segment) continue
    const vals = vlqDecode(segment)
    genCol += vals[0]
    if (vals.length >= 4) {
      srcIdx += vals[1]; srcLine += vals[2]; srcCol += vals[3]
      if (genLine === Number(line) && genCol >= Number(colStart) - 200 && genCol <= Number(colEnd) + 200) {
        out.push(`${genCol} -> ${map.sources[srcIdx]}:${srcLine + 1}:${srcCol}`)
      }
    }
  }
  genLine++
}
console.log(out.join('\n'))
