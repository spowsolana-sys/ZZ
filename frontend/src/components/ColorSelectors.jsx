import { Link } from "react-router-dom";

/*
 * Pastilles de coloris.
 * - variante desktop (défaut) : bandeau absolu centré en bas de la scène
 * - variante inline (idPrefix non vide) : flux simple, utilisée dans le
 *   panneau d'achat mobile ; les testids sont préfixés pour rester uniques.
 */
export default function ColorSelectors({ products, active, idPrefix = "" }) {
  const inline = idPrefix !== "";
  return (
    <div
      className={
        inline
          ? "flex items-center gap-3"
          : "absolute z-30 inset-x-0 bottom-7 sm:bottom-9 flex justify-center pointer-events-none"
      }
    >
      <div className={`flex items-center gap-4 sm:gap-5 ${inline ? "" : "pointer-events-auto"}`}>
        {products.map((p, i) => (
          <Link
            key={p.id}
            to={`/produit/${p.id}`}
            aria-label={`Coloris ${p.name}`}
            data-testid={`color-selector-${idPrefix}${p.id}`}
            className={`relative w-9 h-9 sm:w-11 sm:h-11 rounded-full transition-transform duration-300 hover:scale-115 ${
              i === active ? "scale-110" : "opacity-90 hover:opacity-100"
            }`}
            style={{
              background: p.swatch,
              boxShadow:
                i === active
                  ? "0 0 0 2px #0A0A0A"
                  : "0 0 0 1px rgba(0,0,0,0.18)",
            }}
          >
            {i === active && (
              <span className="absolute -inset-2 rounded-full border border-black/20 pointer-events-none" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
