import black from "../assets/sneaker-black.png";
import white from "../assets/sneaker-white.png";
import aqua from "../assets/sneaker-aqua.png";
import burgundy from "../assets/sneaker-burgundy.png";

/*
 * ZEV SHOP — Shopify-shaped product schema.
 * One product (TN), four color variants — each variant keeps its OWN image
 * asset (transparent PNG, never combined). Field names mirror the Shopify
 * Storefront API so the catalog can later be swapped for a live Shopify
 * fetch without touching the UI:
 *
 *  PRODUCT.title / description / vendor / availableForSale / priceRange
 *  PRODUCT.variants[] -> id, title, selectedOptions, image, price, available
 *
 * PRICE: intentionally left null — it renders as "PRIX BIENTÔT" everywhere
 * and is meant to be filled from Shopify. Do NOT hardcode a price.
 *
 * `scale` / `shiftY` only compensate the baked-in glow halos / tighter crops
 * so all four variants render perfectly aligned at identical size/position.
 * Glow/spotlight/shadow/Z-tint stay very subtle and neutral-leaning.
 *
 * gallery: presentation slots (main view, profil, arrière, détails,
 * lifestyle, portée). Only 'main' has an image today — map the remaining
 * slots to Shopify product images when connecting the store.
 */
export const PRODUCT = {
  handle: "tn-sneaker",
  title: "TN",
  vendor: "ZEV SHOP",
  productType: "SNEAKERS",
  description: "TN — sneaker ZEV SHOP, quatre coloris.",
  availableForSale: true,
  currencyCode: null, // set when Shopify connects
  priceRange: { min: null, max: null }, // set when Shopify connects
  options: [{ name: "Color", values: ["Noir", "Blanche", "Cyan", "Rouge"] }],
  variants: [
    {
      id: "noir",
      title: "TN NOIR",
      selectedOptions: { Color: "Noir" },
      image: black,
      price: null, // DÉFINI VIA SHOPIFY
      oldPrice: null, // ancien prix (affiché barré si défini)
      discountPercent: null, // % promotion (affiché si défini)
      available: true,
      swatch: "radial-gradient(circle at 35% 35%, #2E2E2E, #050505)",
      glow: "rgba(0, 0, 0, 0.30)",
      spotlight: "rgba(0, 0, 0, 0.05)",
      shadowTint: "rgba(10, 10, 10, 0.28)",
      zTint: "rgba(0, 0, 0, 0.16)",
      scale: 1.0,
      shiftY: "0%",
      gallery: [
        { type: "main", label: "VUE PRINCIPALE", src: black },
        { type: "profil", label: "PROFIL", src: null },
        { type: "arriere", label: "ARRIÈRE", src: null },
        { type: "details", label: "DÉTAILS", src: null },
        { type: "lifestyle", label: "LIFESTYLE", src: null },
        { type: "portee", label: "PORTÉE", src: null },
      ],
    },
    {
      id: "blanche",
      title: "TN BLANCHE",
      selectedOptions: { Color: "Blanche" },
      image: white,
      price: null, // DÉFINI VIA SHOPIFY
      oldPrice: null, // ancien prix (affiché barré si défini)
      discountPercent: null, // % promotion (affiché si défini)
      available: true,
      swatch: "radial-gradient(circle at 35% 35%, #FFFFFF, #D8DEE6)",
      glow: "rgba(0, 0, 0, 0.14)",
      spotlight: "rgba(0, 0, 0, 0.04)",
      shadowTint: "rgba(10, 10, 10, 0.20)",
      zTint: "rgba(0, 0, 0, 0.055)",
      scale: 0.955,
      shiftY: "0%",
      gallery: [
        { type: "main", label: "VUE PRINCIPALE", src: white },
        { type: "profil", label: "PROFIL", src: null },
        { type: "arriere", label: "ARRIÈRE", src: null },
        { type: "details", label: "DÉTAILS", src: null },
        { type: "lifestyle", label: "LIFESTYLE", src: null },
        { type: "portee", label: "PORTÉE", src: null },
      ],
    },
    {
      id: "cyan",
      title: "TN CYAN",
      selectedOptions: { Color: "Cyan" },
      image: aqua,
      price: null, // DÉFINI VIA SHOPIFY
      oldPrice: null, // ancien prix (affiché barré si défini)
      discountPercent: null, // % promotion (affiché si défini)
      available: true,
      swatch: "linear-gradient(160deg, #F4F4F4 45%, #19C8DC 100%)",
      glow: "rgba(0, 0, 0, 0.24)",
      spotlight: "rgba(0, 0, 0, 0.05)",
      shadowTint: "rgba(10, 10, 10, 0.26)",
      zTint: "rgba(0, 145, 185, 0.19)",
      scale: 0.601,
      shiftY: "2%",
      gallery: [
        { type: "main", label: "VUE PRINCIPALE", src: aqua },
        { type: "profil", label: "PROFIL", src: null },
        { type: "arriere", label: "ARRIÈRE", src: null },
        { type: "details", label: "DÉTAILS", src: null },
        { type: "lifestyle", label: "LIFESTYLE", src: null },
        { type: "portee", label: "PORTÉE", src: null },
      ],
    },
    {
      id: "rouge",
      title: "TN ROUGE",
      selectedOptions: { Color: "Rouge" },
      image: burgundy,
      price: null, // DÉFINI VIA SHOPIFY
      oldPrice: null, // ancien prix (affiché barré si défini)
      discountPercent: null, // % promotion (affiché si défini)
      available: true,
      swatch: "linear-gradient(160deg, #7A1230 55%, #0A0A0A 100%)",
      glow: "rgba(0, 0, 0, 0.28)",
      spotlight: "rgba(0, 0, 0, 0.05)",
      shadowTint: "rgba(10, 10, 10, 0.27)",
      zTint: "rgba(165, 25, 50, 0.18)",
      scale: 0.557,
      shiftY: "6%",
      gallery: [
        { type: "main", label: "VUE PRINCIPALE", src: burgundy },
        { type: "profil", label: "PROFIL", src: null },
        { type: "arriere", label: "ARRIÈRE", src: null },
        { type: "details", label: "DÉTAILS", src: null },
        { type: "lifestyle", label: "LIFESTYLE", src: null },
        { type: "portee", label: "PORTÉE", src: null },
      ],
    },
  ],
};

/* Flat variant list used across pages — with UI aliases (name/index). */
export const PRODUCTS = PRODUCT.variants.map((v, i) => ({
  ...v,
  name: v.title,
  index: String(i + 1).padStart(2, "0"),
}));
export const DEFAULT_INDEX = 0;

export const SIZES = ["40", "41", "42", "43", "44", "45", "46"];

/*
 * Price rendering. Accepts:
 *   null / undefined            -> "PRIX BIENTÔT" (editable placeholder)
 *   { amount, currencyCode }    -> Shopify price object, formatted
 *   string / number             -> rendered as given
 */
export function priceLabel(variant) {
  const price = variant && variant.price;
  if (price === null || price === undefined || price === "") return "Prix à définir";
  if (typeof price === "object" && price.amount !== undefined && price.amount !== null) {
    try {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: price.currencyCode || "EUR",
        minimumFractionDigits: Number(price.amount) % 1 === 0 ? 0 : 2,
      }).format(Number(price.amount));
    } catch (e) {
      return `${price.currencyCode || ""} ${price.amount}`.trim();
    }
  }
  return String(price);
}
