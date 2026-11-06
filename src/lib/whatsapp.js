import { BRAND, WHATSAPP_NUMBER } from '../config'
import { CATALOG } from '../data/catalog'

export function undertoneLabel(tone) {
  return tone === 'cool' ? 'Frío' : tone === 'warm' ? 'Cálido' : 'Neutro'
}

export function buildMessage({ quiz, result, SKIN_LABEL, COVERAGE_LABEL }) {
  const skin = SKIN_LABEL[quiz.skin]?.toLowerCase()
  const coverage = COVERAGE_LABEL[quiz.coverage]?.toLowerCase()
  const undertone = undertoneLabel(result.undertone).toLowerCase()
  const tone = result.tone?.toLowerCase()
  const primary = result.primary
    ? `${result.primary.line} ${result.primary.reference}`
    : 'Matte B2'
  const refs = [
    ...CATALOG.filter((p) => p.line === 'Matte').map((p) => p.reference),
    ...CATALOG.filter((p) => p.line === 'Glow').map((p) => p.reference),
  ]
    .map((r, i) => (i === 0 ? r : r))
    .join(', ')

  return [
    `¡Hola, ${BRAND.name}! Quisiera orientación sobre las bases ${BRAND.catalogBrand}.`,
    '',
    `Mi guía estimada: tono ${tone}, subtono ${undertone}; piel ${skin} y cobertura ${coverage}.`,
    '',
    `Vi ${primary} como referencia de ejemplo, pendiente de confirmar en mi piel.`,
    '',
    `También quiero conocer las opciones Matte y Glow: ${refs}.`,
    '',
    '¿Qué tono podría probar y qué referencias tienen disponibles?',
  ].join('\n')
}

export function buildWhatsAppUrl(message) {
  const text = encodeURIComponent(message)
  if (WHATSAPP_NUMBER) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
  }
  // Sin número configurado: WhatsApp permite elegir el contacto al abrir.
  return `https://api.whatsapp.com/send?text=${text}`
}