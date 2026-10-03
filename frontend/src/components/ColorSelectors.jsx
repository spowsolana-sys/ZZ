import { Link } from "react-router-dom";

export default function ColorSelectors({ products, active }) {
  return (
    <div className="absolute z-30 inset-x-0 bottom-7 sm:bottom-9 flex justify-center pointer-events-none">
      <div className="flex items-center gap-4 sm:gap-5 pointer-events-auto">
        {products.map((p, i) => (
          <Link
            key={p.id}
            to={`/produit/${p.id}`}
            aria-label={`Coloris ${p.name}`}
            data-testid={`color-selector-${p.id}`}
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
