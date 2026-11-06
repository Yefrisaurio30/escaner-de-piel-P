export const BRAND = {
  name: 'PRISMA POP',
  tagline: 'Tu piel, en sus propios tonos.',
  catalogBrand: 'Kevin y Coco',
}

// Default destination for the WhatsApp consultation button (digits only,
// country code included). Override locally or per-deployment with
// VITE_WHATSAPP_NUMBER in your .env file.
const DEFAULT_WHATSAPP_NUMBER = '573138636590'

export const WHATSAPP_NUMBER =
  (import.meta.env.VITE_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER)
    .toString()
    .replace(/\D/g, '')

export const DEMO_PHOTO_ENABLED = true