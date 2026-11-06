import { BRAND, WHATSAPP_NUMBER } from '../config'

export function undertoneLabel(tone) {
  return tone === 'cool' ? 'Frío' : tone === 'warm' ? 'Cálido' : 'Neutro'
}

export function buildMessage({ quiz, result, SKIN_LABEL, COVERAGE_LABEL }) {
  const skin = SKIN_LABEL[quiz.skin]
  const coverage = COVERAGE_LABEL[quiz.coverage]
  const undertone = undertoneLabel(result.undertone)
  const refs = result.all
    ? result.all.map((p) => p.reference).join(', ')
    : 'Matte B1–B4 y Glow 03–05'

  return [
    `¡Hola, ${BRAND.name}! Quisiera orientación sobre las bases ${BRAND.catalogBrand}.`,
    '',
    `Mi guía estimada: tono ${result.tone.toLowerCase()}, subtomo ${undertone.toLowerCase()}; piel ${skin.toLowerCase()} y cobertura ${coverage.toLowerCase()}.`,
    '',
    `Referencia de partida sugerida: ${result.primary.line} · ${result.primary.reference}.`,
    `Otras referencias para comparar: ${refs}.`,
    '',
    '¿Qué tono podría probar primero y qué disponibilidad tienen?',
    '',
    '— Enviado desde Prisma Pop (orientación visual, a confirmar sobre mi piel).',
  ].join('\n')
}

export function buildWhatsAppUrl(message) {
  const text = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
}