import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import LogoMark from "@/components/LogoMark";
import SneakerStage from "@/components/SneakerStage";
import ProductCard from "@/components/ProductCard";
import Marquee from "@/components/Marquee";
import { PRODUCTS } from "@/data/products";
import zlogo from "@/assets/zlogo.png";
import { useCart } from "@/context/CartContext";

const EASE = [0.16, 1, 0.3, 1];

/* 1 — Écran d'introduction : logo, phrase, bouton */
function Intro() {
  const onDiscover = () => {
    const el = document.getElementById("zev-hero");
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { duration: 1.2 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-[92svh] flex flex-col items-center justify-center bg-white overflow-hidden px-6 text-center"
      data-testid="intro-section"
    >
      <motion.img
        src={zlogo}
        alt="ZEV SHOP"
        draggable="false"
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.1, ease: EASE }}
        className="w-[38vmin] max-w-[300px] select-none"
        data-testid="intro-logo"
      />
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
        className="font-display font-extrabold tracking-[0.35em] text-xl sm:text-2xl mt-8 text-black"
      >
        ZEV&nbsp;SHOP
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
        className="font-tech text-[10px] sm:text-[11px] tracking-[0.55em] text-black/45 mt-4"
      >
        MOVE&nbsp;DIFFERENT.
      </motion.p>
      <motion.button
        type="button"
        onClick={onDiscover}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.65, ease: EASE }}
        data-testid="intro-discover-button"
        className="mt-12 font-tech text-[11px] tracking-[0.35em] text-black border border-black/25 rounded-full px-10 py-3.5 hover:bg-black hover:text-white transition-colors duration-300 cursor-pointer"
      >
        DÉCOUVRIR
      </motion.button>
    </section>
  );
}

/* 2 — Hero de marque : produit, espace blanc, NEW ARRIVALS */
function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 18 });
  const sy = useSpring(my, { stiffness: 55, damping: 18 });
  const shoeX = useTransform(sx, (v) => v * 16);
  const shoeY = useTransform(sy, (v) => v * 10);

  const onMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };

  return (
    <section
      id="zev-hero"
      className="relative min-h-[100svh] overflow-hidden bg-white flex items-center justify-center"
      data-testid="zev-hero"
      onMouseMove={onMouseMove}
    >
      <div className="absolute top-[13vh] inset-x-0 z-30 text-center px-6">
        <span className="block overflow-hidden">
          <motion.span
            className="block font-display font-extrabold uppercase text-3xl sm:text-5xl lg:text-6xl tracking-tight text-black leading-none"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1, delay: 0.15, ease: EASE }}
            data-testid="hero-title"
          >
            NEW&nbsp;ARRIVALS
          </motion.span>
        </span>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
        >
          <Link
            to="/catalogue"
            data-testid="hero-discover-button"
            className="inline-flex items-center gap-2 mt-6 font-tech text-[11px] tracking-[0.35em] text-black border-b border-black pb-1 hover:opacity-60 transition-opacity duration-300"
          >
            DÉCOUVRIR
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      <SneakerStage
        products={PRODUCTS}
        active={0}
        shoeX={shoeX}
        shoeY={shoeY}
      />
    </section>
  );
}

/* 3 — NOUVEAUTÉS : grille évolutive (chaussures, vêtements, accessoires) */
function Nouveautes() {
  return (
    <section className="relative px-6 sm:px-10 py-24 sm:py-32 max-w-[1400px] mx-auto" data-testid="nouveautes-section">
      <div className="flex items-end justify-between mb-10 sm:mb-14">
        <div>
          <p className="font-tech text-[10px] tracking-[0.45em] text-black/45">
            DERNIERS&nbsp;PRODUITS
          </p>
          <h2 className="font-display font-extrabold uppercase text-2xl sm:text-4xl mt-3 text-black">
            Nouveautés
          </h2>
        </div>
        <Link
          to="/catalogue"
          data-testid="nouveautes-view-all"
          className="hidden sm:flex items-center gap-2 font-tech text-[11px] tracking-[0.25em] text-black/55 hover:text-black transition-colors"
        >
          VOIR&nbsp;TOUT
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {PRODUCTS.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

/* 4 — CATÉGORIES : chaussures, vêtements, accessoires */
const CATEGORIES = [
  { slug: "chaussures", label: "CHAUSSURES", img: true },
  { slug: "vetements", label: "VÊTEMENTS", img: false },
  { slug: "accessoires", label: "ACCESSOIRES", img: false },
];

function Categories() {
  return (
    <section className="relative px-6 sm:px-10 pb-24 sm:pb-32 max-w-[1400px] mx-auto" data-testid="categories-section">
      <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
        {CATEGORIES.map((c, i) => (
          <motion.div
            key={c.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.9, delay: i * 0.1, ease: EASE }}
          >
            <Link to={`/categorie/${c.slug}`} className="group block" data-testid={`category-card-${c.slug}`}>
              <div className="relative aspect-[4/5] bg-[#F6F6F5] border border-black/5 overflow-hidden flex items-center justify-center">
                {c.img ? (
                  <img
                    src={PRODUCTS[2].image}
                    alt={`ZEV SHOP — ${c.label}`}
                    draggable="false"
                    className="w-[78%] object-contain select-none transition-transform duration-700 group-hover:scale-105"
                    style={{ filter: "drop-shadow(0 26px 24px rgba(0,0,0,0.18))" }}
                  />
                ) : (
                  <div className="z-watermark w-[58%] aspect-square bg-black/[0.055] transition-colors duration-500 group-hover:bg-black/[0.09]" />
                )}
              </div>
              <div className="flex items-center justify-between pt-5">
                <h3 className="font-display font-bold text-base sm:text-lg text-black tracking-wide">
                  {c.label}
                </h3>
                <span className="font-tech text-[10px] tracking-[0.3em] border border-black/20 rounded-full px-4 py-2 text-black/70 group-hover:bg-black group-hover:text-white group-hover:border-black transition-colors duration-300">
                  VOIR
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* 5 — Image de marque : logo + phrase, beaucoup de blanc */
function BrandSection() {
  return (
    <section className="py-32 sm:py-44 flex flex-col items-center text-center px-6" data-testid="brand-section">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: EASE }}
        className="flex flex-col items-center"
      >
        <LogoMark className="w-16 h-16" />
        <p className="font-display font-extrabold tracking-[0.35em] text-2xl sm:text-3xl mt-8 text-black">
          ZEV&nbsp;SHOP
        </p>
        <p className="font-tech text-[10px] sm:text-[11px] tracking-[0.55em] text-black/45 mt-5">
          MOVE&nbsp;DIFFERENT.
        </p>
      </motion.div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Intro />
      <Hero />
      <Marquee />
      <Nouveautes />
      <Categories />
      <BrandSection />
    </>
  );
}
