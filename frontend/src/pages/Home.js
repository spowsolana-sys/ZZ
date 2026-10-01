import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Marquee from "@/components/Marquee";
import { PRODUCTS } from "@/data/products";

const EASE = [0.16, 1, 0.3, 1];
const BENTO_ORDER = ["black", "white", "aqua", "burgundy"];
const FEATURED = { black: true, burgundy: true };

function CollectionBento() {
  return (
    <section className="relative px-6 sm:px-10 py-24 sm:py-32 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-10 sm:mb-14">
        <div>
          <p className="font-tech text-[10px] tracking-[0.45em] text-cyan-300">
            THE&nbsp;SPECTRUM&nbsp;—&nbsp;04
          </p>
          <h2 className="font-display font-extrabold uppercase text-2xl sm:text-4xl mt-3 text-white">
            Four shades. One waveform.
          </h2>
        </div>
        <Link
          to="/shop"
          data-testid="bento-view-all"
          className="hidden sm:flex items-center gap-2 font-tech text-[11px] tracking-[0.3em] text-white/50 hover:text-cyan-300 transition-colors"
        >
          VIEW&nbsp;ALL&nbsp;<ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
        {BENTO_ORDER.map((id) => {
          const p = PRODUCTS.find((pr) => pr.id === id);
          return (
            <ProductCard key={id} product={p} feature={FEATURED[id]} />
          );
        })}
      </div>
    </section>
  );
}

function Statement() {
  return (
    <section className="relative px-6 py-28 sm:py-40 text-center overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vmin] h-[80vmin] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,240,255,0.07) 0%, transparent 70%)",
        }}
      />
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="font-tech text-[10px] tracking-[0.5em] text-cyan-300"
      >
        TUNED&nbsp;AIR&nbsp;SYSTEMS
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1, delay: 0.1, ease: EASE }}
        className="font-display font-extrabold uppercase text-4xl sm:text-6xl lg:text-7xl mt-6 leading-[1.08] text-white"
      >
        <span className="block">Four shades.</span>
        <span className="block text-outline">One waveform.</span>
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
      >
        <Link
          to="/shop"
          data-testid="statement-shop-cta"
          className="inline-flex items-center gap-3 mt-12 font-tech text-[11px] tracking-[0.3em] text-[#05070A] bg-cyan-300 rounded-full px-8 py-4 hover:shadow-[0_0_36px_rgba(0,240,255,0.5)] transition-shadow duration-300"
        >
          ENTER&nbsp;THE&nbsp;SHOP
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <CollectionBento />
      <Statement />
    </>
  );
}
