export default function ColorSelectors({ products, active }) {
  return (
    <div className="absolute z-30 inset-x-0 bottom-7 sm:bottom-9 flex flex-col items-center gap-3">
      <p className="font-tech text-[10px] tracking-[0.45em] text-white/40">
        COLORWAY — 04
      </p>
      <div className="flex items-center gap-4 sm:gap-5">
        {products.map((p, i) => (
          <button
            key={p.id}
            type="button"
            aria-label={`Colorway ${p.name}`}
            data-testid={`color-selector-${p.id}`}
            className={`relative w-9 h-9 sm:w-11 sm:h-11 rounded-full transition-transform duration-300 hover:scale-115 cursor-pointer ${
              i === active ? "scale-110" : "opacity-80 hover:opacity-100"
            }`}
            style={{
              background: p.swatch,
              boxShadow:
                i === active
                  ? "0 0 0 2px rgba(0,240,255,0.9), 0 0 18px rgba(0,240,255,0.45)"
                  : "0 0 0 1px rgba(255,255,255,0.18)",
            }}
          >
            {i === active && (
              <span className="absolute -inset-2 rounded-full border border-cyan-300/40 pointer-events-none" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
