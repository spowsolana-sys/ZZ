# PRD — ZEV SHOP (Sneakers TN)

## Original Problem Statement (latest)
Simplify the existing site into a professional fashion ecommerce store called ZEV SHOP. Replace the brand with ZEV SHOP and use the uploaded Z logo as the main logo. White main background — no large colorful gradients or futuristic backgrounds. Keep the existing sneaker animations (floating idle, detached shadow, vertical carousel) exactly as they are. Catalogue = sneakers only, four variants: TN NOIR, TN BLANCHE, TN CYAN, TN ROUGE — clean, spacious, image-focused, no long descriptions. Simple French header: ZEV SHOP, Catalogue, Vêtements (dropdown: T-shirts, Pantalons, Sweats à capuche, Ensembles, Pulls, Shorts, Shorts de bain), Accessoires (dropdown: Chaussures, Sacoches, Claquettes, Bonnets, Casquettes, Lunettes, Bracelets), Suivi de commande, Cart. Only Chaussures contains the TN products; other categories stay empty — no fake products. Clicking a sneaker opens its product page with the immersive animation. Prices stay editable/undefined (PRIX BIENTÔT) for Shopify.

## Prior Heritage (kept)
- Four uploaded transparent sneaker PNGs — separate per-variant assets, never combined.
- Assets: TN CYAN + TN ROUGE images replaced (2026-10-03) with the newly uploaded photos (682x490 / 675x455, transparent, tighter framing); saved under the same filenames (sneaker-aqua.png / sneaker-burgundy.png). Normalization recomputed against the noir/blanche reference: cyan scale 0.601 shiftY 2%, rouge scale 0.557 shiftY 6% — verified identical on-screen shoe size/position in stage (3/2), catalogue cards (3/2, normalization on a wrapper div so hover transforms still work) and cart thumbnails. Carousel re-verified mid-flight with both new images.
- Immersive vertical-carousel product stage: current sneaker exits DOWN through the overflow-hidden viewport (scale -> 0.94, fades near the end) while the next descends from ABOVE (scale 0.94 -> 1); both visible mid-flight; entrance replays the descent.
- Idle levitation loop, detached counter-phased soft shadow, mouse parallax, lenis smooth scroll, masked line reveals, framer-motion throughout, sonner toasts, cart context + drawer.

## Current Architecture
- React SPA: routes `/` (accueil), `/catalogue`, `/categorie/:slug` (chaussures -> 4 TN grid; other slugs -> "bientôt disponible" empty state, no fake products), `/produit/:id` (immersive page), `/suivi` (order tracking form -> "aucune commande trouvée"; no fake orders).
- Theme: white background, black text, neutral gray shadows/spotlights (no colorful gradients); accent = black. Fonts kept: Unbounded (display) + Space Mono (technical). Favicon = uploaded Z logo (/public/logo.png), title "ZEV SHOP — Sneakers TN", lang fr.
- Data: /app/frontend/src/data/products.js — Shopify-shaped schema (PRODUCT + variants with id/title/selectedOptions/image/price:null/available); French variant names & ids (noir, blanche, cyan, rouge); priceLabel() -> "PRIX BIENTÔT" until Shopify fills price (accepts Shopify {amount, currencyCode} objects too). shopifyAdapter.js ready for Storefront API.
- UI strings in French: CATALOGUE, VÊTEMENTS, ACCESSOIRES, SUIVI DE COMMANDE, PANIER, AJOUTER AU PANIER, COMMANDER, EN STOCK / ÉPUISÉ, COLORIS — 04, TAILLE — EU, PRIX BIENTÔT.
- Nav: fixed white blur header — Z logo + ZEV SHOP | CATALOGUE, VÊTEMENTS (hover dropdown), ACCESSOIRES (hover dropdown), SUIVI DE COMMANDE | CART button with count badge. Mobile: hamburger -> full white menu panel with both category groups.
- Home: hero (eyebrow ZEV SHOP — SNEAKERS, h1 = variant name, VOIR LE PRODUIT link, floating sneaker, giant TN watermark, price + stock, DÉFILER cue, COLORIS selectors) → marquee (TN NOIR — TN BLANCHE — TN CYAN — TN ROUGE — ZEV SHOP) → catalogue preview grid (4 cards) → footer (Z logo, links, giant ZEV SHOP watermark, © 2025 ZEV SHOP).
- Product card (white minimal): index "0X / 04", neutral spotlight, hover lift + VOIR arrow, name + PRIX BIENTÔT.
- Product page (simplified 2026-10-03): breadcrumb CATALOGUE / variant, ProductStage (all animations intact), variant name only (TN NOIR / TN BLANCHE / TN CYAN / TN ROUGE), TAILLE size chips (right column on desktop, row above the button on mobile), price + availability, "Ajouter au panier" (black pill, full-width on mobile), COLORIS selectors. Giant index watermark, index/vendor lines and COLORIS label removed for simplicity. Cart correctness verified: selected variant + selected size land in the drawer (e.g. TN NOIR — EU 42, TN CYAN — EU 43).
- Z watermark (2026-10-03): large ZEV SHOP Z logo (alpha mask generated from the uploaded logo -> src/assets/zmask.png, masked via .z-watermark utility in index.css) centered BEHIND the floating sneaker; tint per variant via zTint field (noir: subtle dark gray, blanche: light gray, cyan: soft cyan, rouge: soft burgundy), crossfades on color switch; background stays white.
- Gallery (2026-10-03): "Plus de photos" button under the variant name opens a clean full-screen gallery (ProductGallery.jsx) with 6 slots per variant — VUE PRINCIPALE (main photo), PROFIL, ARRIÈRE, DÉTAILS, LIFESTYLE, PORTÉE. Only 'main' has an image today; empty slots show an elegant "image bientôt disponible — via Shopify" placeholder (no fake photos). Slots are ready to be filled from Shopify product images. ESC/backdrop-free minimal UI, thumbnail strip, testids throughout.
- Cart drawer: white, PANIER (n) with quantity-based badge, empty state, items showing variant name + color line (COLORIS : Cyan — EU 42) + editable price label, quantity stepper (−/+, decrements to 0 = auto-remove), trash remove, COMMANDER (toast: paiement à la connexion de Shopify). Verified: add → qty 1, plus → 2, minus ×2 → removed, badge syncs.
- Order tracking: /suivi minimal page — order number input + SUIVRE button; returns "aucune commande trouvée" (no fake orders); ready to wire to Shopify orders API.

## Verified (2026-10-03)
- Desktop 1440 + mobile 390 screenshots: home, catalogue, product (cyan/blanche/rouge), suivi; no horizontal overflow.
- Journey e2e: catalogue card TN CYAN -> /produit/cyan correct variant; selector -> rouge carousel switch (mid-flight both sneakers visible); tracking form returns "AUCUNE COMMANDE TROUVÉE"; dropdowns render all specified items; cart add/remove flow works.
- Fixed during verification: Categories.js stub overwrite (restored), mobile product-page price/button overlap (stacked bottom-sheet layout).

## Backlog
- P0: Live Shopify connection (Storefront API -> mapShopifyProduct: real prices, availability, checkout)
- P1: Persistent cart (localStorage); fill Vêtements/Accessoires categories from Shopify collections
- P2: Real order tracking via Shopify orders API; search
