import black from "../assets/sneaker-black.png";
import white from "../assets/sneaker-white.png";
import aqua from "../assets/sneaker-aqua.png";
import burgundy from "../assets/sneaker-burgundy.png";

/*
 * Shopify-shaped product schema.
 * One product, four color variants — each variant keeps its OWN image asset
 * (never combined). Field names mirror the Shopify Storefront API so the
 * catalog can be swapped for a live Shopify fetch without touching the UI:
 *
 *  PRODUCT.title / description / vendor / availableForSale / priceRange
 *  PRODUCT.variants[] -> id, title, selectedOptions, image, price, available
 *
 * PRICE: intentionally left null — it renders as "PRICE TBD" everywhere and
 * is meant to be filled from Shopify (or by editing `price` here). Do NOT
 * hardcode a price.
 *
 * `scale` / `shiftY` only compensate the baked-in glow halos (white/aqua) so
 * all four variants render perfectly aligned at identical size/position.
 */
export const PRODUCT = {
  handle: "nike-air-max-plus-tn",
  title: "AIR MAX PLUS TN",
  vendor: "NIKE",
  productType: "SNEAKERS",
  description: "The archival waveform, retuned for the night.",
  availableForSale: true,
  currencyCode: null, // set when Shopify connects
  priceRange: { min: null, max: null }, // set when Shopify connects
  options: [{ name: "Color", values: ["Black", "White", "Aqua", "Burgundy"] }],
  variants: [
    {
      id: "black",
      title: "TRIPLE BLACK CYBER",
      selectedOptions: { Color: "Black" },
      image: black,
      price: null, // EDIT VIA SHOPIFY
      available: true,
      swatch: "radial-gradient(circle at 35% 35%, #2E2E2E, #050505)",
      glow: "rgba(0, 240, 255, 0.30)",
      spotlight: "rgba(0, 240, 255, 0.16)",
      shadowTint: "rgba(110, 190, 210, 0.30)",
      scale: 1.0,
      shiftY: "0%",
    },
    {
      id: "white",
      title: "HYPER WHITE GLACIER",
      selectedOptions: { Color: "White" },
      image: white,
      price: null, // EDIT VIA SHOPIFY
      available: true,
      swatch: "radial-gradient(circle at 35% 35%, #FFFFFF, #D8DEE6)",
      glow: "rgba(180, 220, 255, 0.22)",
      spotlight: "rgba(180, 220, 255, 0.13)",
      shadowTint: "rgba(190, 215, 240, 0.30)",
      scale: 0.955,
      shiftY: "0%",
    },
    {
      id: "aqua",
      title: "AQUA WAVEFORM",
      selectedOptions: { Color: "Aqua" },
      image: aqua,
      price: null, // EDIT VIA SHOPIFY
      available: true,
      swatch: "linear-gradient(160deg, #F4F4F4 45%, #19C8DC 100%)",
      glow: "rgba(0, 229, 255, 0.30)",
      spotlight: "rgba(0, 229, 255, 0.16)",
      shadowTint: "rgba(0, 220, 250, 0.30)",
      scale: 0.965,
      shiftY: "0%",
    },
    {
      id: "burgundy",
      title: "BURGUNDY VOLT",
      selectedOptions: { Color: "Burgundy" },
      image: burgundy,
      price: null, // EDIT VIA SHOPIFY
      available: true,
      swatch: "linear-gradient(160deg, #7A1230 55%, #0A0A0A 100%)",
      glow: "rgba(128, 0, 32, 0.35)",
      spotlight: "rgba(128, 0, 32, 0.22)",
      shadowTint: "rgba(200, 70, 100, 0.26)",
      scale: 1.0,
      shiftY: "0%",
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

export const SPECS = [
  "TUNED AIR HEMISPHERIC DAMPERS",
  "DUAL-DENSITY TPU ARCH SPINE",
  "MOLDED RIBBED EXOSKELETON CAGE",
  "GRADIENT HEX-MESH UPPER",
];

/*
 * Price rendering. Accepts:
 *   null / undefined            -> "PRICE TBD" (editable placeholder)
 *   { amount, currencyCode }    -> Shopify price object, formatted
 *   string / number             -> rendered as given
 */
export function priceLabel(variant) {
  const price = variant && variant.price;
  if (price === null || price === undefined || price === "") return "PRICE TBD";
  if (typeof price === "object" && price.amount !== undefined && price.amount !== null) {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: price.currencyCode || "USD",
        minimumFractionDigits: Number(price.amount) % 1 === 0 ? 0 : 2,
      }).format(Number(price.amount));
    } catch (e) {
      return `${price.currencyCode || ""} ${price.amount}`.trim();
    }
  }
  return String(price);
}
