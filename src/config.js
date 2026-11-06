export const BRAND = {
  name: 'PRISMA POP',
  tagline: 'Tu piel, en sus propios tonos.',
  catalogBrand: 'Kevin y Coco',
}

// Use VITE_WHATSAPP_NUMBER in your .env file (digits only, country code included).
// Fallback is a clearly placeholder number.
export const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER
    ? import.meta.env.VITE_WHATSAPP_NUMBER.toString().replace(/\D/g, '')
    : ''

export const DEMO_PHOTO_ENABLED = true