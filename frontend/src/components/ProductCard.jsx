import { Link } from "react-router-dom";
import { priceLabel } from "@/data/products";

export default function ProductCard({ product: p, feature = false }) {
  return (
    <Link
      to={`/product/${p.id}`}
      data-testid={`product-card-${p.id}`}
      className={`group relative block overflow-hidden border border-white/10 bg-[#0A0E17] transition-all duration-500 hover:border-cyan-300/40 hover:shadow-[0_0_50px_rgba(0,240,255,0.12)] ${
        feature ? "md:col-span-2" : ""
      }`}
    >
      <div
        className={`relative flex items-center justify-center overflow-hidden ${
          feature ? "aspect-[16/9]" : "aspect-[4/3]"
        }`}
      >
        <div
          className="absolute w-[75%] h-[75%] rounded-full transition-transform duration-700 group-hover:scale-110"
          style={{
            background: `radial-gradient(circle, ${p.spotlight} 0%, transparent 70%)`,
          }}
        />
        <img
          src={p.image}
          alt={`Nike Air Max Plus TN — ${p.name}`}
          draggable="false"
          className="relative w-[78%] select-none pointer-events-none transition-transform duration-700 ease-out group-hover:scale-[1.06] group-hover:-translate-y-2"
          style={{
            filter: `drop-shadow(0 20px 30px rgba(0,0,0,0.5)) drop-shadow(0 0 35px ${p.glow})`,
          }}
        />
        <span className="absolute top-4 left-5 font-tech text-[10px] tracking-[0.35em] text-white/40">
          TN-98&nbsp;//&nbsp;{p.index}
        </span>
        <span className="absolute top-4 right-5 font-tech text-[10px] tracking-[0.35em] text-cyan-300/80 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
          VIEW&nbsp;→
        </span>
      </div>
      <div className="flex items-end justify-between px-5 py-5 border-t border-white/10">
        <h3 className="font-display text-sm sm:text-base font-bold text-white leading-snug">
          {p.name}
        </h3>
        <p
          className="font-tech text-[11px] tracking-[0.25em] text-cyan-300/90 shrink-0 pl-4"
          data-testid={`product-card-price-${p.id}`}
        >
          {priceLabel(p)}
        </p>
      </div>
    </Link>
  );
}
