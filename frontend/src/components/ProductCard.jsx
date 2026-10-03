import { Link } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";
import { motion, useTransform } from "framer-motion";
import { priceLabel, PRODUCT_COUNT } from "@/data/products";
import { useShoeTilt, ShoeFloat, ShoeTiltLayer } from "./ShoeMotion";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function ProductCard({ product: p, feature = false }) {
  const { user, wishlist, toggleWishlist } = useAuth();
  const wished = wishlist.includes(p.id);
  const tilt = useShoeTilt({ maxYaw: 8, maxPitch: 6 });
  const hoverScale = useTransform(tilt.hover, (v) => 1 + v * 0.04);
  const hoverY = useTransform(tilt.hover, (v) => v * -8);

  const onWish = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast("Créez un compte pour sauvegarder vos produits favoris.");
      return;
    }
    toggleWishlist(p.id).catch(() => toast.error("Erreur — réessayez"));
  };

  return (
    <Link
      to={`/produit/${p.id}`}
      data-testid={`product-card-${p.id}`}
      className="group relative block overflow-hidden border border-black/10 bg-white transition-all duration-500 hover:border-black/40 hover:shadow-[0_24px_48px_rgba(0,0,0,0.07)]"
    >
      <button
        type="button"
        onClick={onWish}
        data-testid={`wishlist-heart-${p.id}`}
        aria-label="Ajouter à la wishlist"
        className="absolute top-3 right-3 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white/90 border border-black/10 hover:border-black/40 transition-all duration-300 cursor-pointer"
      >
        <Heart className={`w-4 h-4 transition-colors ${wished ? "fill-black text-black" : "text-black/50"}`} />
      </button>
      <div
        className={`relative flex items-center justify-center overflow-hidden ${
          feature ? "aspect-[16/9]" : "aspect-[3/2]"
        }`}
      >
        <div
          className="absolute w-[75%] h-[75%] rounded-full transition-transform duration-700 group-hover:scale-110"
          style={{
            background:
              "radial-gradient(circle, rgba(0,0,0,0.05) 0%, transparent 70%)",
          }}
        />
        {/* présentation premium 2.5D : lévitation idle subtile + inclinaison curseur */}
        <div
          className="relative w-full h-full"
          {...tilt.bind}
          style={{ perspective: 900 }}
        >
          <ShoeFloat
            amplitude={4}
            rotate={0.5}
            breathe={0.006}
            duration={6.5}
            className="absolute inset-0"
          >
            <ShoeTiltLayer tilt={tilt} hoverScale={0} className="w-full h-full" >
              <motion.div className="w-full h-full" style={{ scale: hoverScale, y: hoverY }}>
                <div
                  className="w-full h-full"
                  style={{ transform: `scale(${p.scale}) translateY(${p.shiftY})` }}
                >
                  <img
                    src={p.image}
                    alt={`ZEV SHOP — ${p.name}`}
                    draggable="false"
                    loading="lazy"
                    decoding="async"
                    className="relative w-full h-full object-contain select-none pointer-events-none will-change-transform"
                    style={{ filter: `drop-shadow(0 24px 22px ${p.glow})` }}
                  />
                </div>
              </motion.div>
            </ShoeTiltLayer>
          </ShoeFloat>
        </div>
        <span className="absolute top-4 left-5 font-tech text-[10px] tracking-[0.35em] text-black/35">
          {p.index}&nbsp;/&nbsp;{String(PRODUCT_COUNT).padStart(2, "0")}
        </span>
        <span className="absolute top-4 right-5 flex items-center gap-1.5 font-tech text-[10px] tracking-[0.35em] text-black/70 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
          VOIR
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
      <div className="px-5 py-4 border-t border-black/10">
        <h3 className="font-display text-sm sm:text-base font-bold text-black leading-snug truncate">
          {p.productTitle}
        </h3>
        <div className="flex items-center justify-between mt-1.5">
          <p className="font-tech text-[10px] tracking-[0.25em] text-black/45 uppercase truncate">
            {p.selectedOptions.Color}
          </p>
          <p
            className="font-tech text-[11px] tracking-[0.2em] text-black/55 shrink-0 pl-4"
            data-testid={`product-card-price-${p.id}`}
          >
            {priceLabel(p)}
          </p>
        </div>
      </div>
    </Link>
  );
}
