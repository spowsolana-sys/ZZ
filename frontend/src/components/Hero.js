import { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { PRODUCTS, DEFAULT_INDEX, SPECS, priceLabel } from "@/data/products";
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

function Bracket({ className }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute z-30 w-5 h-5 border-cyan-300/40 pointer-events-none ${className}`}
    />
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
      className="relative flex flex-col min-h-[100svh] overflow-hidden"
      data-testid="tuned-air-hero-section"
      onMouseMove={onMouseMove}
    >
      {/* giant background typography */}
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

      {/* HUD corner brackets framing the product viewport */}
      <Bracket className="top-24 left-5 sm:left-9 border-t border-l" />
      <Bracket className="top-24 right-5 sm:right-9 border-t border-r" />
      <Bracket className="bottom-24 left-5 sm:left-9 border-b border-l" />
      <Bracket className="bottom-24 right-5 sm:right-9 border-b border-r" />

      {/* headline */}
      <div className="absolute top-[13vh] inset-x-0 z-30 text-center px-6">
        <Reveal delay={0.15}>
          <p className="font-tech text-[10px] sm:text-[11px] tracking-[0.45em] text-cyan-300">
            NIKE — TUNED AIR ARCHIVAL EDITION
          </p>
        </Reveal>
        <Reveal delay={0.28}>
          <h1
            className="font-display font-extrabold uppercase leading-none mt-4 text-3xl sm:text-5xl lg:text-6xl tracking-tight"
            data-testid="product-title"
          >
            AIR&nbsp;MAX&nbsp;PLUS{" "}
            <span className="text-cyan-300 drop-shadow-[0_0_18px_rgba(0,240,255,0.6)]">
              TN
            </span>
          </h1>
        </Reveal>
      </div>

      {/* sneaker */}
      <SneakerStage
        products={PRODUCTS}
        active={active}
        shoeX={shoeX}
        shoeY={shoeY}
      />

      {/* left — colorway info */}
      <FadeUp
        delay={0.7}
        className="absolute z-30 left-6 sm:left-10 top-[56%] sm:top-[63%] -translate-y-1/2 max-w-[210px] sm:max-w-[240px]"
      >
        <p className="font-tech text-[10px] tracking-[0.4em] text-white/40">
          TN-98&nbsp;//&nbsp;{p.index}&nbsp;/&nbsp;04
        </p>
        <h2
          className="font-display text-base sm:text-xl font-bold mt-3 text-white leading-snug"
          data-testid="product-colorway"
        >
          {p.name}
        </h2>
        <p className="font-tech text-[10px] sm:text-[11px] leading-relaxed text-white/45 mt-3 hidden sm:block">
          The archival waveform, retuned for the night.
        </p>
      </FadeUp>

      {/* right — engineered specs */}
      <FadeUp
        delay={0.85}
        className="absolute z-30 right-6 sm:right-10 top-[63%] -translate-y-1/2 hidden md:block"
      >
        <p className="font-tech text-[10px] tracking-[0.4em] text-white/40 mb-3">
          ENGINEERED&nbsp;SPEC
        </p>
        {SPECS.map((s, i) => (
          <div
            key={i}
            data-testid={`spec-item-${i}`}
            className="flex items-center gap-4 py-3 border-b border-white/10 w-60"
          >
            <span className="font-tech text-[10px] text-cyan-300">
              0{i + 1}
            </span>
            <span className="font-tech text-[11px] tracking-[0.15em] text-white/70">
              {s}
            </span>
          </div>
        ))}
      </FadeUp>

      {/* bottom-left — price + status */}
      <FadeUp
        delay={1}
        className="absolute z-30 left-6 sm:left-10 bottom-28 sm:bottom-9"
      >
        <p className="font-tech text-[10px] tracking-[0.4em] text-white/40">
          DROP&nbsp;001
        </p>
        <p
          className="font-display font-bold text-xl sm:text-3xl mt-2 text-white"
          data-testid="product-price"
        >
          {priceLabel(p)}
        </p>
        <p
          className={`flex items-center gap-2 font-tech text-[10px] tracking-[0.3em] mt-3 ${
            p.available ? "text-cyan-300/90" : "text-white/40"
          }`}
          data-testid="hud-status-badge"
        >
          {p.available ? (
            <>
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full bg-cyan-400 opacity-60 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-cyan-300" />
              </span>
              IN&nbsp;STOCK
            </>
          ) : (
            <>SOLD&nbsp;OUT</>
          )}
        </p>
      </FadeUp>

      {/* bottom-right — coordinates / scroll cue */}
      <FadeUp
        delay={1.1}
        className="absolute z-30 right-6 sm:right-10 bottom-7 sm:bottom-9 hidden sm:block text-right"
      >
        <p className="font-tech text-[10px] tracking-[0.3em] text-white/35">
          45.5152°&nbsp;N&nbsp;/&nbsp;122.6784°&nbsp;W
        </p>
        <p className="font-tech text-[10px] tracking-[0.4em] text-cyan-300/80 mt-3">
          SCROLL&nbsp;↓
        </p>
      </FadeUp>

      {/* colorway selectors — link to each product page */}
      <ColorSelectors products={PRODUCTS} active={active} />
    </section>
  );
}
