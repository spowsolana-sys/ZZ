# PRD — TUNED AIR (Nike Air Max Plus TN) Hero

## Original Problem Statement
Create the main hero section of a premium futuristic sneaker website using four uploaded sneaker images (black, white, white/aqua, burgundy/black) as individual product assets — never combined/collaged. Large centered sneaker, premium minimal futuristic design, plenty of empty space, dedicated product viewport with overflow hidden, product info around the sneaker, four circular color selectors, clean premium typography, responsive desktop + mobile. All four sneakers normalized to identical size/position/scale/rotation/alignment. Sneaker appears large, floating, no hard ground contact, soft shadow underneath for hover effect. NO transition animation yet — layout, assets, viewport, typography, selectors and visual design only.

## User Choices (asked at start)
- Theme: Dark futuristic (near-black canvas, glowing accents)
- Accent: Cyan / electric aqua
- Color selectors: Static visuals only (no swap logic yet)
- Product copy: "Nike Air Max Plus (TN)"

## Architecture
- Frontend-only React app (CRA + Tailwind + framer-motion + lenis). No backend endpoints needed for this scope.
- Assets: 4 uploaded PNGs downloaded to /app/frontend/src/assets/ (all exactly 1200x800 RGBA).
- Normalization strategy: all 4 images stacked in one identical container (same size/position/rotation since photos share the same frame/angle); per-product `scale` compensation only offsets baked-in glow halos (white 0.955, aqua 0.965, black/burgundy 1.0).
- Components: Hero.js (composition, mouse parallax, masked line reveals), SneakerStage.jsx (spotlight, float loop, counter-phased elliptical shadow), ColorSelectors.jsx (4 static circular swatches), Marquee.jsx (60s slow editorial loop), LogoMark.jsx (original SVG hexagon-wave mark, also used as favicon /logo.svg).
- Fonts: Unbounded (display) + Space Mono (technical HUD labels).

## Implemented (2026-10-01)
- Full-viewport dark hero (#05070A) with giant outlined "TN" background typography (parallax, entrance scale reveal)
- Masked line-by-line headline reveal (AIR MAX PLUS TN in cyan glow)
- Floating black TN sneaker (default colorway) with cyan spotlight, drop-shadow rim glow, levitation loop + counter-phased soft hovering shadow
- Product info around the viewport: index code TN-98 // 01/04, colorway name, description, engineered spec list (right), price + IN STOCK status LED (bottom-left), coordinates + scroll cue (bottom-right), HUD corner brackets
- 4 circular color selectors (static, first active with cyan ring glow)
- Slow editorial marquee strip (AIR MAX PLUS TN / TUNED AIR / 1998 ARCHIVE…)
- Lenis smooth scrolling, framer-motion reveals, subtle mouse parallax (shoe vs background counter-motion)
- Responsive 1440px + 390px verified, no horizontal overflow
- data-testids on all interactive/critical elements (hero section, product viewport, image, title, colorway, price, selectors, specs, marquee, status badge, reserve button)

## Placeholders (user gave no values)
- Prices $180/$185/$190/$195, spec list wording, colorway names (TRIPLE BLACK CYBER / HYPER WHITE GLACIER / AQUA WAVEFORM / BURGUNDY VOLT), coordinates ticker — all placeholder copy.

## Backlog
- P0: Wire color selectors to swap active colorway with the (deferred) product transition animation
- P1: Reserve Air CTA → checkout/waitlist flow; nav links → real routes
- P2: Scroll sections below hero (archive/story/tech), mobile menu overlay
