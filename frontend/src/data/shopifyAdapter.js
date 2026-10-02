import { PRODUCT } from "./products";

/*
 * Shopify Storefront API adapter (ready-to-connect).
 *
 * When the store goes live, fetch the product from the Storefront API and
 * pass the GraphQL JSON here; it returns the SAME shape as PRODUCT in
 * products.js, so every page, the immersive carousel and the cart keep
 * working untouched. Prices/availability then come from Shopify — nothing
 * is hardcoded in the UI.
 *
 * Example future call:
 *   const data = await storefront(query, { handle: "nike-air-max-plus-tn" });
 *   const product = mapShopifyProduct(data.product);
 */
export function mapShopifyProduct(raw) {
  const fallback = PRODUCT;
  const priceRangeMin = raw?.priceRange?.minVariantPrice;
  const priceRangeMax = raw?.priceRange?.maxVariantPrice;

  return {
    handle: raw?.handle ?? fallback.handle,
    title: raw?.title ?? fallback.title,
    vendor: raw?.vendor ?? fallback.vendor,
    productType: raw?.productType ?? fallback.productType,
    description: raw?.description ?? fallback.description,
    availableForSale: raw?.availableForSale ?? fallback.availableForSale,
    currencyCode: priceRangeMin?.currencyCode ?? null,
    priceRange: {
      min: priceRangeMin?.amount ?? null,
      max: priceRangeMax?.amount ?? null,
    },
    options: raw?.options?.map((o) => ({
      name: o.name,
      values: o.values,
    })) ?? fallback.options,
    variants: (raw?.variants?.edges ?? []).map((edge, i) => {
      const v = edge.node;
      const colorValue =
        v.selectedOptions?.find((o) => o.name === "Color")?.value ?? "";
      const key = colorValue.toLowerCase();
      // presentation-only fields (swatch/glow/scale) fall back to the local
      // variant with the same color; they are never fetched from Shopify
      const local =
        fallback.variants.find((pv) => pv.selectedOptions.Color.toLowerCase() === key) ??
        fallback.variants[i] ??
        null;
      const amount = v.price?.amount ?? null;
      return {
        id: v.id ?? key,
        title: v.title ?? local?.title ?? "",
        name: v.title ?? local?.title ?? "",
        index: String(i + 1).padStart(2, "0"),
        selectedOptions: Object.fromEntries(
          (v.selectedOptions ?? []).map((o) => [o.name, o.value]),
        ),
        image: local?.image ?? null,
        price:
          amount !== null
            ? { amount, currencyCode: v.price?.currencyCode ?? "USD" }
            : null, // stays "PRICE TBD" until Shopify supplies it
        available: v.availableForSale ?? false,
        swatch: local?.swatch ?? "radial-gradient(circle at 35% 35%, #2E2E2E, #050505)",
        glow: local?.glow ?? "rgba(0, 240, 255, 0.30)",
        spotlight: local?.spotlight ?? "rgba(0, 240, 255, 0.16)",
        shadowTint: local?.shadowTint ?? "rgba(110, 190, 210, 0.30)",
        scale: local?.scale ?? 1.0,
        shiftY: local?.shiftY ?? "0%",
      };
    }),
  };
}
