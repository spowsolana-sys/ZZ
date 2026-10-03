import { useState } from "react";
import { motion } from "framer-motion";
import { PackageSearch } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];

export default function Suivi() {
  const [value, setValue] = useState("");
  const [searched, setSearched] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    setSearched(value.trim());
  };

  return (
    <div className="min-h-screen pt-40 pb-32 px-6 max-w-2xl mx-auto">
      <header className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="flex justify-center"
        >
          <PackageSearch className="w-10 h-10 text-black/70" strokeWidth={1.25} />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          className="font-display font-extrabold uppercase text-3xl sm:text-5xl mt-6 text-black"
          data-testid="suivi-title"
        >
          SUIVI&nbsp;DE&nbsp;COMMANDE
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.25 }}
          className="font-tech text-[10px] tracking-[0.35em] text-black/40 mt-4"
        >
          ENTREZ&nbsp;VOTRE&nbsp;NUMÉRO&nbsp;DE&nbsp;COMMANDE
        </motion.p>
      </header>

      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
        className="mt-12 flex flex-col sm:flex-row gap-3"
        data-testid="tracking-form"
      >
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Numéro de commande"
          data-testid="tracking-input"
          className="flex-1 h-14 px-6 font-tech text-[12px] tracking-[0.15em] border border-black/15 rounded-full bg-white text-black placeholder:text-black/35 focus:outline-none focus:border-black transition-colors"
        />
        <button
          type="submit"
          data-testid="tracking-submit"
          className="h-14 px-10 font-tech text-[11px] tracking-[0.3em] text-white bg-black rounded-full hover:bg-black/85 transition-colors duration-300 cursor-pointer"
        >
          SUIVRE
        </button>
      </motion.form>

      {searched !== null && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-10 text-center font-tech text-[11px] tracking-[0.25em] text-black/50 border border-black/10 rounded-2xl py-6 px-6"
          data-testid="tracking-result"
        >
          {searched === ""
            ? "VEUILLEZ ENTRER UN NUMÉRO DE COMMANDE."
            : `AUCUNE COMMANDE TROUVÉE POUR « ${searched} ».`}
        </motion.p>
      )}
    </div>
  );
}
