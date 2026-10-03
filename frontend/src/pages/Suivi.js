import { useState } from "react";
import { motion } from "framer-motion";
import { PackageSearch } from "lucide-react";
import { api, formatApiError } from "@/api";
import { toast } from "sonner";

const EASE = [0.16, 1, 0.3, 1];

const STATUS_STEPS = ["Préparation", "Expédition", "Transport", "Livraison"];

export default function Suivi() {
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await api(`/orders/${encodeURIComponent(number)}?email=${encodeURIComponent(email)}`);
      setResult(r);
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen pt-44 pb-32 px-6 max-w-2xl mx-auto">
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
          NUMÉRO&nbsp;DE&nbsp;COMMANDE&nbsp;+&nbsp;EMAIL
        </motion.p>
      </header>

      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
        className="mt-12 flex flex-col gap-3"
        data-testid="tracking-form"
      >
        <input
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Numéro de commande"
          required
          data-testid="tracking-input"
          className="h-14 px-6 font-tech text-[11px] tracking-[0.15em] border border-black/15 rounded-full text-black placeholder:text-black/35 focus:outline-none focus:border-black transition-colors"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email utilisé pour la commande"
          required
          data-testid="tracking-email-input"
          className="h-14 px-6 font-tech text-[11px] tracking-[0.15em] border border-black/15 rounded-full text-black placeholder:text-black/35 focus:outline-none focus:border-black transition-colors"
        />
        <button
          type="submit"
          disabled={busy}
          data-testid="tracking-submit"
          className="h-14 font-tech text-[11px] tracking-[0.3em] text-white bg-black rounded-full hover:bg-black/85 transition-colors cursor-pointer disabled:opacity-50"
        >
          SUIVRE
        </button>
      </motion.form>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-10 border border-black/10 rounded-3xl py-10 px-6"
          data-testid="tracking-result"
        >
          {result.found ? (
            <div className="flex flex-col gap-4">
              {STATUS_STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-4">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${i === 0 ? "bg-black" : "bg-black/20"}`}
                  />
                  <span className="font-tech text-[11px] tracking-[0.2em] text-black/70">{s}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center font-tech text-[11px] tracking-[0.2em] text-black/50">
              {result.message}
            </p>
          )}
        </motion.div>
      )}

      <p className="text-center font-tech text-[9px] tracking-[0.3em] text-black/30 mt-10">
        SUIVI&nbsp;TEMPS&nbsp;RÉEL&nbsp;—&nbsp;STRUCTURE&nbsp;PRÊTE&nbsp;POUR&nbsp;CONNEXION
      </p>
    </div>
  );
}
