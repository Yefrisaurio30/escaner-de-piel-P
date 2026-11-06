# PRISMA POP — Guía de tono de piel

SPA en React + Vite + Tailwind CSS para recomendar bases según el tono de piel.

## Desarrollo

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
npm run preview
```

## Variables de entorno

Copiá `.env.example` a `.env` y ajustá el número de WhatsApp Business:

```bash
VITE_WHATSAPP_NUMBER=5491122334455
```

## Deploy en Vercel

1. Importá el repositorio en Vercel.
2. Framework preset: **Vite** (se detecta automáticamente).
3. Agregá la variable de entorno `VITE_WHATSAPP_NUMBER`.
4. Deploy.

La app funciona 100% en el navegador: la foto no se sube a ningún servidor.