import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { priceLabel } from "@/data/products";

export default function ProductCard({ product: p, feature = false }) {
  return (
    <Link
      to={`/produit/${p.id}`}
      data-testid={`product-card-${p.id}`}
      className="group relative block overflow-hidden border border-black/10 bg-white transition-all duration-500 hover:border-black/40 hover:shadow-[0_24px_48px_rgba(0,0,0,0.07)]"
    >
      <div
        className={`relative flex items-center justify-center overflow-hidden ${
          feature ? "aspect-[16/9]" : "aspect-[4/3]"
        }`}
      >
        <div
          className="absolute w-[75%] h-[75%] rounded-full transition-transform duration-700 group-hover:scale-110"
          style={{
            background:
              "radial-gradient(circle, rgba(0,0,0,0.05) 0%, transparent 70%)",
          }}
        />
        <img
          src={p.image}
          alt={`ZEV SHOP — ${p.name}`}
          draggable="false"
          className="relative w-[78%] select-none pointer-events-none transition-transform duration-700 ease-out group-hover:scale-[1.06] group-hover:-translate-y-2"
          style={{ filter: `drop-shadow(0 28px 26px ${p.glow})` }}
        />
        <span className="absolute top-4 left-5 font-tech text-[10px] tracking-[0.35em] text-black/35">
          {p.index}&nbsp;/&nbsp;04
        </span>
        <span className="absolute top-4 right-5 flex items-center gap-1.5 font-tech text-[10px] tracking-[0.35em] text-black/70 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
          VOIR
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
      <div className="flex items-end justify-between px-5 py-5 border-t border-black/10">
        <h3 className="font-display text-sm sm:text-base font-bold text-black leading-snug">
          {p.name}
        </h3>
        <p
          className="font-tech text-[11px] tracking-[0.2em] text-black/55 shrink-0 pl-4"
          data-testid={`product-card-price-${p.id}`}
        >
          {priceLabel(p)}
        </p>
      </div>
    </Link>
  );
}
