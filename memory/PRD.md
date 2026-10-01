# PRD — TUNED AIR (Nike Air Max Plus TN) Premium Sneaker Store

## Original Problem Statement
Build out the hero into a complete premium futuristic sneaker ecommerce store: premium homepage, product catalog/shop page, product cards, clean navigation, immersive product pages, responsive desktop + mobile. The four uploaded sneaker images are four color variants of ONE product. No hardcoded prices — leave as flexible placeholder/editable field for Shopify. No detailed technical descriptions; priority is visual result, layout, navigation and interactive experience. Keep the four uploaded assets and dark futuristic cyan visual style.

## User Choices
- Dark futuristic theme, cyan/electric aqua accent (from first build)
- Color selectors on hero: static visuals (now double as links to product pages)
- Product copy: "Nike Air Max Plus (TN)"
- Price: NEVER hardcoded — `price: null` in /app/frontend/src/data/products.js renders "PRICE TBD"; map this field to Shopify price later

## Architecture
- React SPA (CRA + Tailwind + framer-motion + lenis + sonner). React Router routes: `/` home, `/shop` catalog, `/product/:id` immersive product page (unknown id redirects to /shop).
- Cart: client-side CartContext + slide-over CartDrawer (add from product page with size, remove, count badge, checkout button is visual with "prices set in Shopify — pending" note). No backend needed for this scope.
- Data: single source /app/frontend/src/data/products.js — 4 variants, shared normalization (identical 1200x800 frames stacked; per-variant scale compensates glow halos), priceLabel() helper, SIZES 40-46.
- Shared components: Nav (fixed, blur, HOME/SHOP links, Reserve pill, cart button + count), Footer (outline wordmark), ProductCard (used in shop grid + home bento), SneakerStage (spotlight, float loop, counter-phased hover shadow, mouse parallax), ColorSelectors (variant circles linking to product pages), LogoMark (SVG hexagon-wave, favicon too).
- Fonts: Unbounded (display) + Space Mono (technical).

## Pages
- Home: hero (headline masked reveal, floating black TN, giant outlined TN, HUD brackets, PRICE TBD + IN STOCK) → marquee → asymmetric bento of the 4 variants (black/burgundy featured wide) → statement section with ENTER THE SHOP CTA → footer.
- Shop: "THE INDEX" header + 2x2 product card grid (spotlight, hover lift/glow, VIEW arrow, PRICE TBD).
- Product: immersive full-viewport stage — giant variant index number behind shoe, breadcrumb SHOP / AIR MAX PLUS TN, variant identity, EU size chips (right column desktop / single row mobile), PRICE TBD + IN STOCK, ADD TO CART, variant selector circles, per-variant spotlight tint.

## Implemented (2026-10-01)
- First build: hero section, assets, normalization, selectors, typography, marquee, lenis, parallax.
- Store expansion: router + shared nav/footer, home bento + statement, shop catalog, immersive product pages, cart context + drawer + toasts, price placeholder system, responsive fixes (mobile product stack, shop headline wrap), click-through fix on selectors strip.
- data-testids across nav, cards, sizes, add-to-cart, cart drawer, selectors, titles.

## Verified
- Routes 200; card click → product page; size → add to cart → drawer with item + count; desktop 1440 + mobile 390 screenshots on home/shop/product; no horizontal overflow.

## Backlog
- P0: Shopify connection (real prices, checkout) — price field already isolated in products.js
- P1: Persistent cart (localStorage), real checkout handoff
- P2: Archive/story sections, mobile menu overlay, variant transition animation on product page
