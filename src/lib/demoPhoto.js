export function demoPortraitDataUrl() {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="900" viewBox="0 0 720 900">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#F7ECE3"/>
      <stop offset="1" stop-color="#F8DDE2"/>
    </linearGradient>
    <radialGradient id="skin" cx="50%" cy="45%" r="60%">
      <stop offset="0" stop-color="#D9A97E"/>
      <stop offset="1" stop-color="#BD8355"/>
    </radialGradient>
  </defs>
  <rect width="720" height="900" fill="url(#bg)"/>
  <ellipse cx="360" cy="470" rx="230" ry="300" fill="url(#skin)"/>
  <ellipse cx="360" cy="300" rx="150" ry="180" fill="url(#skin)"/>
  <!-- hair -->
  <path d="M210 260 Q230 120 360 110 Q490 120 510 260 Q470 180 360 175 Q250 180 210 260 Z" fill="#6B4F8F"/>
  <path d="M210 260 Q195 330 205 410" stroke="#6B4F8F" stroke-width="26" fill="none" stroke-linecap="round"/>
  <path d="M510 260 Q525 330 515 410" stroke="#6B4F8F" stroke-width="26" fill="none" stroke-linecap="round"/>
  <!-- eyes -->
  <ellipse cx="305" cy="300" rx="16" ry="10" fill="#fff"/>
  <ellipse cx="415" cy="300" rx="16" ry="10" fill="#fff"/>
  <circle cx="305" cy="300" r="6" fill="#2B2323"/>
  <circle cx="415" cy="300" r="6" fill="#2B2323"/>
  <!-- brows -->
  <path d="M285 278 Q305 270 325 278" stroke="#4A3F3F" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M395 278 Q415 270 435 278" stroke="#4A3F3F" stroke-width="3" fill="none" stroke-linecap="round"/>
  <!-- nose -->
  <path d="M360 320 Q352 360 346 372 Q360 378 374 372 Q368 360 360 320" fill="#BD8355" opacity="0.6"/>
  <!-- mouth -->
  <path d="M330 400 Q360 418 390 400" stroke="#9E1A33" stroke-width="3" fill="none" stroke-linecap="round"/>
  <!-- blush -->
  <ellipse cx="270" cy="360" rx="26" ry="14" fill="#D82B50" opacity="0.18"/>
  <ellipse cx="450" cy="360" rx="26" ry="14" fill="#D82B50" opacity="0.18"/>
  <!-- shirt -->
  <path d="M200 620 Q360 560 520 620 L560 900 L160 900 Z" fill="#B7A6E8"/>
</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}