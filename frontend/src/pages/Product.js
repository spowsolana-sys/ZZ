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
import { PRODUCTS, SIZES, priceLabel } from "@/data/products";
import ProductStage from "@/components/ProductStage";
import ColorSelectors from "@/components/ColorSelectors";
import { useCart } from "@/context/CartContext";

const EASE = [0.16, 1, 0.3, 1];

export default function Product() {
  const { id } = useParams();
  const idx = PRODUCTS.findIndex((p) => p.id === id);
  const [size, setSize] = useState(null);
  const { add } = useCart();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 18 });
  const sy = useSpring(my, { stiffness: 55, damping: 18 });
  const shoeX = useTransform(sx, (v) => v * 16);
  const shoeY = useTransform(sy, (v) => v * 10);
  const bgX = useTransform(sx, (v) => v * -22);
  const bgY = useTransform(sy, (v) => v * -14);

  if (idx < 0) return <Navigate to="/shop" replace />;
  const p = PRODUCTS[idx];

  const onMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };

  const onAdd = () => {
    if (!size) {
      toast.error("SELECT A SIZE FIRST");
      return;
    }
    add(p.id, size);
    toast.success(`${p.name} — EU ${size} ADDED TO CART`);
  };

  return (
    <main
      className="relative min-h-[100svh] overflow-hidden"
      data-testid="product-page"
      onMouseMove={onMouseMove}
    >
      {/* per-variant ambient background tint */}
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

      {/* giant variant index behind the shoe */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 z-0 flex items-center justify-center select-none pointer-events-none"
        style={{ x: bgX, y: bgY }}
      >
        <motion.span
          key={p.id}
          className="font-display font-extrabold text-outline text-[60vw] lg:text-[30vw] leading-none"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
        >
          {p.index}
        </motion.span>
      </motion.div>

      {/* breadcrumb */}
      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        className="absolute z-30 top-24 left-6 sm:left-10 font-tech text-[10px] tracking-[0.4em] text-white/40"
      >
        <Link to="/shop" className="hover:text-cyan-300 transition-colors">
          SHOP
        </Link>
        <span className="mx-2">/</span>
        <span className="text-cyan-300/80">AIR&nbsp;MAX&nbsp;PLUS&nbsp;TN</span>
      </motion.p>

      {/* immersive carousel stage */}
      <ProductStage
        products={PRODUCTS}
        active={idx}
        shoeX={shoeX}
        shoeY={shoeY}
      />

      {/* left — variant identity */}
      <div className="absolute z-30 left-6 sm:left-10 top-[56%] sm:top-[58%] max-w-[220px]">
        <motion.div
          key={p.id}
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
        >
          <p className="font-tech text-[10px] tracking-[0.4em] text-white/40">
            TN-98&nbsp;//&nbsp;{p.index}&nbsp;/&nbsp;04
          </p>
          <h1
            className="font-display text-lg sm:text-2xl font-bold mt-3 text-white leading-snug"
            data-testid="product-variant-name"
          >
            {p.name}
          </h1>
          <p className="font-tech text-[10px] tracking-[0.3em] text-cyan-300/80 mt-3 hidden sm:block">
            AIR&nbsp;MAX&nbsp;PLUS&nbsp;—&nbsp;VARIANT&nbsp;{p.index}
          </p>
        </motion.div>
      </div>

      {/* sizes — right column on desktop, scrollable row on mobile */}
      <div className="absolute z-30 left-6 right-6 sm:left-auto sm:right-10 bottom-44 sm:bottom-auto sm:top-[42%]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
        >
          <p className="font-tech text-[10px] tracking-[0.4em] text-white/40 mb-3 sm:text-right">
            SELECT&nbsp;SIZE&nbsp;—&nbsp;EU
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
                    ? "border-cyan-300 text-cyan-300 shadow-[0_0_16px_rgba(0,240,255,0.35)]"
                    : "border-white/15 text-white/60 hover:border-white/40 hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* bottom-left — price + status */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
        className="absolute z-30 left-6 sm:left-10 bottom-24 sm:bottom-9"
      >
        <p className="font-tech text-[10px] tracking-[0.4em] text-white/40">
          DROP&nbsp;001
        </p>
        <p
          className="font-display font-bold text-lg sm:text-3xl mt-2 text-white"
          data-testid="product-price"
        >
          {priceLabel(p)}
        </p>
        <p className="flex items-center gap-2 font-tech text-[10px] tracking-[0.3em] text-cyan-300/90 mt-2 sm:mt-3">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full bg-cyan-400 opacity-60 animate-ping" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-cyan-300" />
          </span>
          IN&nbsp;STOCK
        </p>
      </motion.div>

      {/* bottom-right — add to cart */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.65, ease: EASE }}
        className="absolute z-30 right-6 sm:right-10 bottom-24 sm:bottom-9"
      >
        <button
          type="button"
          onClick={onAdd}
          data-testid="add-to-cart-button"
          className="font-tech text-[11px] tracking-[0.3em] text-[#05070A] bg-cyan-300 rounded-full px-8 py-4 hover:shadow-[0_0_36px_rgba(0,240,255,0.5)] transition-shadow duration-300 cursor-pointer"
        >
          ADD&nbsp;TO&nbsp;CART
        </button>
      </motion.div>

      {/* variant selectors */}
      <ColorSelectors products={PRODUCTS} active={idx} />
    </main>
  );
}
