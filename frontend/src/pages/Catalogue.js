import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS } from "@/data/products";

const EASE = [0.16, 1, 0.3, 1];

export default function Catalogue() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 sm:px-10 max-w-[1400px] mx-auto">
      <header className="text-center">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="font-tech text-[10px] tracking-[0.45em] text-black/45"
        >
          04&nbsp;SNEAKERS
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: EASE }}
          className="font-display font-extrabold uppercase text-4xl sm:text-6xl mt-4 text-black leading-none"
          data-testid="catalogue-title"
        >
          CATALOGUE
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-tech text-[10px] tracking-[0.35em] text-black/35 mt-5"
        >
          COLLECTION&nbsp;TN&nbsp;//&nbsp;QUATRE&nbsp;COLORIS
        </motion.p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mt-14">
        {PRODUCTS.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 + i * 0.08, ease: EASE }}
          >
            <ProductCard product={p} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
