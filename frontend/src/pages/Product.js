import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { toast } from "sonner";
import { Images } from "lucide-react";
import { PRODUCTS, SIZES, priceLabel } from "@/data/products";
import ProductStage from "@/components/ProductStage";
import ProductGallery from "@/components/ProductGallery";
import ColorSelectors from "@/components/ColorSelectors";
import { useCart } from "@/context/CartContext";

const EASE = [0.16, 1, 0.3, 1];

export default function Product() {
  const { id } = useParams();
  const idx = PRODUCTS.findIndex((p) => p.id === id);
  const [size, setSize] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const { add } = useCart();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 18 });
  const sy = useSpring(my, { stiffness: 55, damping: 18 });
  const shoeX = useTransform(sx, (v) => v * 16);
  const shoeY = useTransform(sy, (v) => v * 10);

  if (idx < 0) return <Navigate to="/catalogue" replace />;
  const p = PRODUCTS[idx];

  const onMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };

  const onAdd = () => {
    if (!size) {
      toast.error("CHOISISSEZ D'ABORD UNE TAILLE");
      return;
    }
    add(p.id, size);
    toast.success(`${p.name} — EU ${size} AJOUTÉ AU PANIER`);
  };

  return (
    <main
      className="relative min-h-[100svh] overflow-hidden bg-white"
      data-testid="product-page"
      onMouseMove={onMouseMove}
    >
      {/* neutral ambient tint, crossfades with the variant */}
      <AnimatePresence>
        <motion.div
          key={p.id}
          aria-hidden="true"
          className="absolute inset-0 z-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{
            background: `radial-gradient(65% 55% at 50% 52%, ${p.spotlight} 0%, transparent 100%)`,
          }}
        />
      </AnimatePresence>

      {/* Z logo watermark behind the sneaker — tint follows the variant */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <AnimatePresence>
          <motion.div
            key={p.id}
            className="z-watermark w-[64vmin] h-[64vmin]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            style={{ backgroundColor: p.zTint }}
            data-testid="z-watermark"
          />
        </AnimatePresence>
      </div>

      {/* breadcrumb */}
      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        className="absolute z-30 top-24 left-6 sm:left-10 font-tech text-[10px] tracking-[0.4em] text-black/40"
      >
        <Link to="/catalogue" className="hover:text-black transition-colors">
          CATALOGUE
        </Link>
        <span className="mx-2">/</span>
        <span className="text-black/70">{p.title}</span>
      </motion.p>

      {/* immersive carousel stage */}
      <ProductStage
        products={PRODUCTS}
        active={idx}
        shoeX={shoeX}
        shoeY={shoeY}
      />

      {/* left — variant identity */}
      <div className="absolute z-30 left-6 sm:left-10 top-[52%] sm:top-[58%] max-w-[220px]">
        <motion.div
          key={p.id}
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
        >
          <h1
            className="font-display text-lg sm:text-2xl font-bold text-black leading-snug"
            data-testid="product-variant-name"
          >
            {p.name}
          </h1>
          <button
            type="button"
            onClick={() => setGalleryOpen(true)}
            data-testid="gallery-open-button"
            className="inline-flex items-center gap-2 mt-5 font-tech text-[10px] tracking-[0.3em] text-black/70 border border-black/20 rounded-full px-5 py-2.5 hover:border-black hover:text-black transition-colors duration-300 cursor-pointer"
          >
            <Images className="w-3.5 h-3.5" />
            Plus de photos
          </button>
        </motion.div>
      </div>

      {/* sizes — right column on desktop, row on mobile */}
      <div className="absolute z-30 left-6 right-6 sm:left-auto sm:right-10 bottom-[232px] sm:bottom-auto sm:top-[42%]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
        >
          <p className="font-tech text-[10px] tracking-[0.4em] text-black/40 mb-3 sm:text-right">
            TAILLE
          </p>
          <div className="flex sm:flex-col flex-nowrap gap-1.5 sm:gap-2 sm:items-end">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                data-testid={`size-chip-${s}`}
                className={`shrink-0 sm:shrink w-10 h-9 sm:w-12 sm:h-10 font-tech text-[10px] sm:text-[11px] tracking-[0.1em] border transition-all duration-300 cursor-pointer ${
                  size === s
                    ? "border-black bg-black text-white"
                    : "border-black/20 text-black/60 hover:border-black/60 hover:text-black"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* bottom-left — price + availability */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
        className="absolute z-30 left-6 sm:left-10 bottom-[152px] sm:bottom-9"
      >
        <p
          className="font-display font-bold text-base sm:text-2xl text-black"
          data-testid="product-price"
        >
          {priceLabel(p)}
        </p>
        <p
          className={`flex items-center gap-2 font-tech text-[10px] tracking-[0.3em] mt-2 ${
            p.available ? "text-black/60" : "text-black/35"
          }`}
        >
          {p.available ? (
            <>
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full bg-black/30 opacity-60 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-black" />
              </span>
              EN&nbsp;STOCK
            </>
          ) : (
            <>ÉPUISÉ</>
          )}
        </p>
      </motion.div>

      {/* bottom-right — add to cart */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.65, ease: EASE }}
        className="absolute z-30 left-6 right-6 sm:left-auto sm:right-10 bottom-24 sm:bottom-9"
      >
        <button
          type="button"
          onClick={onAdd}
          data-testid="add-to-cart-button"
          className="w-full sm:w-auto font-tech text-[12px] tracking-[0.2em] text-white bg-black rounded-full px-8 py-4 hover:bg-black/85 transition-colors duration-300 cursor-pointer"
        >
          Ajouter au panier
        </button>
      </motion.div>

      {/* variant selectors */}
      <ColorSelectors products={PRODUCTS} active={idx} />

      {/* gallery modal */}
      <ProductGallery
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        variant={p}
      />
    </main>
  );
}
