import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { api, formatApiError } from "@/api";
import { Truck, PackageCheck } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];

function PageHero({ eyebrow, title, children }) {
  return (
    <header className="text-center mb-14">
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="font-tech text-[10px] tracking-[0.45em] text-black/45"
      >
        {eyebrow}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.1, ease: EASE }}
        className="font-display font-extrabold uppercase text-3xl sm:text-5xl mt-4 text-black"
        data-testid="page-title"
      >
        {title}
      </motion.h1>
      {children}
    </header>
  );
}

export function Livraison() {
  return (
    <div className="min-h-screen pt-40 pb-24 px-6 max-w-3xl mx-auto">
      <PageHero eyebrow="ZEV SHOP — SERVICES" title="Livraison">
        <p className="font-tech text-[10px] tracking-[0.35em] text-black/40 mt-5">
          TOUTES&nbsp;LES&nbsp;INFORMATIONS&nbsp;DE&nbsp;LIVRAISON
        </p>
      </PageHero>

      <div className="flex flex-col items-center border border-black/10 rounded-3xl py-12 px-8 text-center" data-testid="delivery-delay">
        <Truck className="w-8 h-8 text-black/60" strokeWidth={1.5} />
        <p className="font-display font-extrabold text-2xl mt-6 text-black">7 à 12 jours</p>
        <p className="font-tech text-[10px] tracking-[0.3em] text-black/45 mt-3">
          DÉLAI&nbsp;STANDARD&nbsp;INDICATIF
        </p>
      </div>

      <div className="mt-10 border border-dashed border-black/15 rounded-3xl py-12 px-8 text-center" data-testid="delivery-structure">
        <p className="font-tech text-[10px] tracking-[0.35em] text-black/45">
          STRUCTURE&nbsp;PRÊTE&nbsp;À&nbsp;ÊTRE&nbsp;COMPLÉTÉE
        </p>
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4 mt-8 text-left">
          {["Pays desservis", "Frais de livraison", "Livraison express", "Transporteur", "Numéro de suivi", "Options par pays"].map((k) => (
            <div key={k} className="flex items-center justify-between border-b border-black/10 pb-3">
              <span className="font-tech text-[10px] tracking-[0.2em] text-black/55">{k}</span>
              <span className="font-tech text-[10px] tracking-[0.2em] text-black/35">À définir</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center mt-10">
        <Link to="/suivi" className="font-tech text-[10px] tracking-[0.3em] text-black border-b border-black pb-1 hover:opacity-60 transition-opacity">
          SUIVRE&nbsp;MA&nbsp;COMMANDE
        </Link>
      </p>
    </div>
  );
}

export function Retours() {
  const SECTIONS = [
    "Délai de retour",
    "Conditions",
    "Procédure",
    "Remboursement",
    "Échange",
    "Produit défectueux",
    "Frais de retour",
    "Adresse de retour",
  ];
  return (
    <div className="min-h-screen pt-40 pb-24 px-6 max-w-3xl mx-auto">
      <PageHero eyebrow="ZEV SHOP — SERVICES" title="Retours">
        <p className="font-tech text-[10px] tracking-[0.35em] text-black/40 mt-5">
          STRUCTURE&nbsp;PRÊTE&nbsp;—&nbsp;RÈGLES&nbsp;À&nbsp;DÉFINIR
        </p>
      </PageHero>
      <div className="flex flex-col gap-4" data-testid="returns-sections">
        {SECTIONS.map((s, i) => (
          <motion.div
            key={s}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
            className="flex items-center justify-between border border-black/10 rounded-2xl px-6 py-5"
            data-testid={`return-item-${i}`}
          >
            <span className="font-display text-xs font-bold tracking-[0.15em] text-black">{s.toUpperCase()}</span>
            <span className="font-tech text-[10px] tracking-[0.25em] text-black/35">À définir</span>
          </motion.div>
        ))}
      </div>
      <p className="text-center mt-10 font-tech text-[10px] tracking-[0.25em] text-black/40">
        Une question ?{" "}
        <Link to="/contact" className="underline underline-offset-4 hover:text-black">
          Contactez-nous
        </Link>
      </p>
    </div>
  );
}

export function APropos() {
  return (
    <div className="min-h-screen pt-40 pb-24 px-6 max-w-3xl mx-auto">
      <PageHero eyebrow="ZEV SHOP" title="À propos de nous" />
      <div className="relative flex flex-col items-center text-center">
        <div className="z-watermark w-40 h-40 bg-black/[0.05] mb-12" aria-hidden="true" />
        <div className="flex flex-col gap-8 font-tech text-[12px] leading-loose tracking-[0.08em] text-black/65">
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.9, ease: EASE }}>
            C'est seulement le début de l'aventure ZEV SHOP.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.9, delay: 0.1, ease: EASE }}>
            Nous voulons constamment améliorer la qualité de nos produits, qui sont déjà conçus
            avec l'objectif de proposer une excellente expérience. Mais nous voulons surtout
            améliorer au maximum nos délais de livraison et rendre l'expérience toujours plus
            rapide et agréable.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.9, delay: 0.2, ease: EASE }}>
            Notre objectif est également de proposer progressivement un maximum de moyens de
            paiement afin de rendre les achats plus simples et accessibles.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.9, delay: 0.3, ease: EASE }} className="font-bold text-black">
            ZEV SHOP est au début de son aventure, et nous avons encore beaucoup de choses à
            construire.
          </motion.p>
        </div>
        <p className="font-tech text-[10px] tracking-[0.5em] text-black/40 mt-14">MOVE&nbsp;DIFFERENT.</p>
      </div>
    </div>
  );
}

export function Faq() {
  const ITEMS = [
    { q: "Quels sont les délais de livraison ?", a: "Délai standard estimé : 7 à 12 jours." },
    { q: "Quels sont les frais de livraison ?", a: "À définir." },
    { q: "Comment retourner un article ?", a: "À définir — voir la page Retours." },
    { q: "Comment suivre ma commande ?", a: "Depuis la page Suivi de commande, avec votre numéro de commande." },
    { q: "Puis-je commander sans compte ?", a: "Oui. Avec un compte : historique, wishlist, suivi simplifié et programme de récompense (1 000 € d'achats → coupon de 100 €)." },
  ];
  const [open, setOpen] = useState(null);
  return (
    <div className="min-h-screen pt-40 pb-24 px-6 max-w-3xl mx-auto">
      <PageHero eyebrow="ZEV SHOP — AIDE" title="FAQ">
        <p className="font-tech text-[10px] tracking-[0.35em] text-black/40 mt-5">
          QUESTIONS&nbsp;FRÉQUENTES
        </p>
      </PageHero>
      <div className="border-t border-black/10">
        {ITEMS.map((item, i) => (
          <div key={i} className="border-b border-black/10" data-testid={`faq-item-${i}`}>
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between py-5 text-left cursor-pointer"
            >
              <span className="font-tech text-[11px] tracking-[0.15em] text-black">{item.q}</span>
              <span className="font-tech text-black/40">{open === i ? "−" : "+"}</span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${open === i ? "max-h-40 pb-5" : "max-h-0"}`}>
              <p className="font-tech text-[11px] leading-relaxed tracking-[0.1em] text-black/55">
                {item.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api("/contact", { method: "POST", body: form });
      setDone(true);
    } catch (err) {
      toast.error(formatApiError(err));
    }
  };

  return (
    <div className="min-h-screen pt-40 pb-24 px-6 max-w-2xl mx-auto">
      <PageHero eyebrow="ZEV SHOP — AIDE" title="Contact">
        <p className="font-tech text-[10px] tracking-[0.35em] text-black/40 mt-5">
          ÉCRIVEZ-NOUS
        </p>
      </PageHero>
      {done ? (
        <p className="border border-black/10 rounded-3xl py-14 text-center font-tech text-[11px] tracking-[0.25em] text-black/60" data-testid="contact-success">
          Message reçu. Nous vous répondrons à l'adresse indiquée.
        </p>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4" data-testid="contact-form">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nom / prénom"
            required
            data-testid="contact-name"
            className="h-14 px-6 font-tech text-[11px] tracking-[0.15em] border border-black/15 rounded-full text-black placeholder:text-black/35 focus:outline-none focus:border-black transition-colors"
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            required
            data-testid="contact-email"
            className="h-14 px-6 font-tech text-[11px] tracking-[0.15em] border border-black/15 rounded-full text-black placeholder:text-black/35 focus:outline-none focus:border-black transition-colors"
          />
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Votre message"
            required
            minLength={4}
            data-testid="contact-message"
            className="min-h-36 p-6 font-tech text-[11px] tracking-[0.1em] border border-black/15 rounded-3xl text-black placeholder:text-black/35 focus:outline-none focus:border-black transition-colors"
          />
          <button
            type="submit"
            data-testid="contact-submit"
            className="h-14 font-tech text-[11px] tracking-[0.3em] text-white bg-black rounded-full hover:bg-black/85 transition-colors cursor-pointer"
          >
            ENVOYER
          </button>
        </form>
      )}
    </div>
  );
}
