// Detects import cycles in src/**/*.{js,jsx} using static import/export-from parsing.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'

const root = resolve('src')
const files = []
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) walk(full)
    else if (/\.(js|jsx)$/.test(name)) files.push(full)
  }
}
walk(root)

const graph = new Map()
for (const file of files) {
  const src = readFileSync(file, 'utf8')
  const specifiers = []
  const re = /(?:^|\n)\s*import\s+(?:[\w*\s{},]*\s+from\s+)?['"]([^'"]+)['"]|export\s+[\w*\s{},]*\s+from\s+['"]([^'"]+)['"]/g
  let m
  while ((m = re.exec(src))) specifiers.push(m[1] || m[2])
  const deps = specifiers
    .filter((s) => s.startsWith('.') || s.startsWith('@/'))
    .map((s) => {
      let base = resolve(dirname(file), s)
      // avoid Windows drive-letter path edge cases
      base = base.replace(/\\/g, '/')
      return base
    })
  graph.set(file.replace(/\\/g, '/'), deps)
}

// resolve dependency path -> actual file trying extensions & index
const known = new Set(graph.keys())
function resolveDep(from, dep) {
  const dir = dirname(from)
  const base = (dir + '/' + dep).replace(/\\/g, '/')
  const candidates = [base, base + '.js', base + '.jsx', base + '/index.js', base + '/index.jsx']
  for (const c of candidates) if (known.has(c)) return c
  return null
}

const resolved = new Map()
for (const [file, deps] of graph) {
  resolved.set(file, deps.map((d) => resolveDep(file, d)).filter(Boolean))
}

const cycles = []
const visiting = []
const visited = new Set()

function dfs(node) {
  if (visited.has(node)) return
  visiting.push(node)
  visited.add(node)
  for (const dep of resolved.get(node) || []) {
    const idx = visiting.indexOf(dep)
    if (idx !== -1) cycles.push([...visiting.slice(idx), dep])
    else dfs(dep)
  }
  visiting.pop()
}

for (const f of graph.keys()) dfs(f)

if (cycles.length === 0) console.log('No import cycles found.')
else {
  const seen = new Set()
  for (const c of cycles) {
    const key = [...c].sort().join('|')
    if (seen.has(key)) continue
    seen.add(key)
    console.log('CYCLE:\n  ' + c.map((f) => f.replace(/^.*\/src\//, 'src/')).join('\n  -> '))
  }
}
