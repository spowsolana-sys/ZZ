import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PRODUCTS, DEFAULT_INDEX, priceLabel } from "@/data/products";
import SneakerStage from "@/components/SneakerStage";
import ColorSelectors from "@/components/ColorSelectors";

const EASE = [0.16, 1, 0.3, 1];

function Reveal({ children, delay = 0, className = "" }) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function FadeUp({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const [active] = useState(DEFAULT_INDEX);
  const p = PRODUCTS[active];

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 18 });
  const sy = useSpring(my, { stiffness: 55, damping: 18 });
  const shoeX = useTransform(sx, (v) => v * 16);
  const shoeY = useTransform(sy, (v) => v * 10);
  const bgX = useTransform(sx, (v) => v * -26);
  const bgY = useTransform(sy, (v) => v * -16);

  const onMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };

  return (
    <section
      className="relative flex flex-col min-h-[100svh] overflow-hidden bg-white"
      data-testid="zev-hero-section"
      onMouseMove={onMouseMove}
    >
      {/* giant background watermark */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 z-0 flex items-center justify-center select-none pointer-events-none"
        style={{ x: bgX, y: bgY }}
      >
        <motion.span
          className="font-display font-extrabold uppercase text-outline text-[44vw] lg:text-[34vw] leading-none"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 0.2, ease: EASE }}
        >
          TN
        </motion.span>
      </motion.div>

      {/* headline */}
      <div className="absolute top-[14vh] inset-x-0 z-30 text-center px-6">
        <Reveal delay={0.15}>
          <p className="font-tech text-[10px] sm:text-[11px] tracking-[0.45em] text-black/45">
            ZEV&nbsp;SHOP&nbsp;—&nbsp;SNEAKERS
          </p>
        </Reveal>
        <Reveal delay={0.28}>
          <h1
            className="font-display font-extrabold uppercase leading-none mt-4 text-3xl sm:text-5xl lg:text-6xl tracking-tight text-black"
            data-testid="product-title"
          >
            {p.name}
          </h1>
        </Reveal>
        <Reveal delay={0.42}>
          <Link
            to={`/produit/${p.id}`}
            data-testid="hero-product-link"
            className="inline-flex items-center gap-2 mt-6 font-tech text-[11px] tracking-[0.3em] text-black border-b border-black pb-1 hover:opacity-60 transition-opacity duration-300"
          >
            VOIR&nbsp;LE&nbsp;PRODUIT
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </div>

      {/* floating sneaker */}
      <SneakerStage
        products={PRODUCTS}
        active={active}
        shoeX={shoeX}
        shoeY={shoeY}
      />

      {/* bottom-left — price + availability */}
      <FadeUp
        delay={0.9}
        className="absolute z-30 left-6 sm:left-10 bottom-28 sm:bottom-9"
      >
        <p
          className="font-display font-bold text-lg sm:text-2xl text-black"
          data-testid="product-price"
        >
          {priceLabel(p)}
        </p>
        <p
          className={`flex items-center gap-2 font-tech text-[10px] tracking-[0.3em] mt-2 ${
            p.available ? "text-black/60" : "text-black/35"
          }`}
          data-testid="hud-status-badge"
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
      </FadeUp>

      {/* bottom-right — scroll cue */}
      <FadeUp
        delay={1.05}
        className="absolute z-30 right-6 sm:right-10 bottom-7 sm:bottom-9 hidden sm:block"
      >
        <p className="font-tech text-[10px] tracking-[0.4em] text-black/40">
          DÉFILER&nbsp;↓
        </p>
      </FadeUp>

      {/* colorway selectors */}
      <ColorSelectors products={PRODUCTS} active={active} />
    </section>
  );
}
