import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Marquee from "@/components/Marquee";
import { PRODUCTS } from "@/data/products";

const EASE = [0.16, 1, 0.3, 1];

function CataloguePreview() {
  return (
    <section className="relative px-6 sm:px-10 py-24 sm:py-32 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-10 sm:mb-14">
        <div>
          <p className="font-tech text-[10px] tracking-[0.45em] text-black/45">
            04&nbsp;SNEAKERS
          </p>
          <h2 className="font-display font-extrabold uppercase text-2xl sm:text-4xl mt-3 text-black">
            Catalogue
          </h2>
        </div>
        <Link
          to="/catalogue"
          data-testid="bento-view-all"
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

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <CataloguePreview />
    </>
  );
}
