import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Star, Truck, ShieldCheck, CreditCard, Gift } from "lucide-react";
import { api } from "@/api";
import LogoMark from "@/components/LogoMark";
import SneakerStage from "@/components/SneakerStage";
import ProductCard from "@/components/ProductCard";
import Marquee from "@/components/Marquee";
import { PRODUCTS } from "@/data/products";
import zlogo from "@/assets/zlogo.png";

const EASE = [0.16, 1, 0.3, 1];

/* 1 — Écran d'introduction */
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

/* 2 — Hero de marque */
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
      <div className="absolute top-[15vh] inset-x-0 z-30 text-center px-6">
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
            DÉCOUVRIR&nbsp;LA&nbsp;COLLECTION
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      <SneakerStage products={PRODUCTS} active={0} shoeX={shoeX} shoeY={shoeY} />
    </section>
  );
}

/* Sections produit génériques — fonctionnent automatiquement avec de vraies données */
function ProductSection({ id, eyebrow, title, products, emptyNote, testid }) {
  return (
    <section id={id} className="relative px-6 sm:px-10 py-20 sm:py-28 max-w-[1400px] mx-auto" data-testid={testid}>
      <div className="flex items-end justify-between mb-10 sm:mb-14">
        <div>
          <p className="font-tech text-[10px] tracking-[0.45em] text-black/45">{eyebrow}</p>
          <h2 className="font-display font-extrabold uppercase text-2xl sm:text-4xl mt-3 text-black">
            {title}
          </h2>
        </div>
        <Link
          to="/catalogue"
          className="hidden sm:flex items-center gap-2 font-tech text-[11px] tracking-[0.25em] text-black/55 hover:text-black transition-colors"
        >
          VOIR&nbsp;TOUT
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      {products.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-black/15 rounded-3xl py-16 px-8 text-center">
          <p className="font-tech text-[11px] tracking-[0.25em] text-black/45">
            {emptyNote}
          </p>
        </div>
      )}
    </section>
  );
}

/* 4 — Catégories */
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
                    loading="lazy"
                    decoding="async"
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

/* 5 — Notre histoire + arguments de marque */
function Story() {
  const args = [
    { icon: ShieldCheck, title: "QUALITÉ", text: "Des produits conçus pour une excellente expérience." },
    { icon: Truck, title: "LIVRAISON", text: "Délai standard estimé : 7 à 12 jours." },
    { icon: CreditCard, title: "PAIEMENTS", text: "De nouveaux moyens de paiement ajoutés progressivement." },
    { icon: Gift, title: "RÉCOMPENSE", text: "1 000 € d'achats → coupon de 100 €." },
  ];
  return (
    <section className="relative px-6 sm:px-10 py-24 sm:py-32 max-w-[1400px] mx-auto" data-testid="story-section">
      <div className="grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <p className="font-tech text-[10px] tracking-[0.45em] text-black/45">NOTRE&nbsp;HISTOIRE</p>
          <h2 className="font-display font-extrabold uppercase text-2xl sm:text-4xl mt-4 text-black leading-snug">
            C'est seulement le début de l'aventure ZEV SHOP.
          </h2>
          <p className="font-tech text-[11px] leading-loose tracking-[0.1em] text-black/55 mt-6 max-w-xl">
            Nous voulons constamment améliorer la qualité de nos produits — déjà conçus
            pour offrir une excellente expérience — mais surtout nos délais de livraison,
            pour rendre chaque commande plus rapide et plus agréable.
          </p>
          <Link
            to="/a-propos"
            data-testid="story-about-link"
            className="inline-flex items-center gap-2 mt-8 font-tech text-[11px] tracking-[0.3em] text-black border-b border-black pb-1 hover:opacity-60 transition-opacity"
          >
            À&nbsp;PROPOS&nbsp;DE&nbsp;NOUS
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {args.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
              className="border border-black/10 rounded-3xl p-6 bg-white"
            >
              <Icon className="w-5 h-5 text-black/70" strokeWidth={1.5} />
              <p className="font-display text-[11px] font-bold tracking-[0.25em] text-black mt-4">
                {title}
              </p>
              <p className="font-tech text-[10px] leading-relaxed tracking-[0.08em] text-black/50 mt-2">
                {text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Avis clients — vrais avis uniquement */
function HomeReviews() {
  const [summary, setSummary] = useState(null);
  useEffect(() => {
    api("/reviews-summary").then(setSummary).catch(() => setSummary({ count: 0, average: null, latest: [] }));
  }, []);

  return (
    <section className="relative px-6 sm:px-10 py-20 sm:py-28 max-w-[1400px] mx-auto border-t border-black/10" data-testid="home-reviews">
      <p className="font-tech text-[10px] tracking-[0.45em] text-black/45">AVIS&nbsp;CLIENTS</p>
      <h2 className="font-display font-extrabold uppercase text-2xl sm:text-4xl mt-3 text-black">
        Ce qu'ils en disent
      </h2>
      {summary && summary.count > 0 ? (
        <>
          <div className="flex items-center gap-3 mt-6" data-testid="home-reviews-average">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`w-4 h-4 ${summary.average && s <= Math.round(summary.average) ? "fill-black text-black" : "text-black/20"}`} />
              ))}
            </div>
            <p className="font-tech text-[11px] tracking-[0.25em] text-black/55">
              {summary.average}/5 — {summary.count} AVIS
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            {summary.latest.map((r) => (
              <div key={r.id} className="border border-black/10 rounded-3xl p-6">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? "fill-black text-black" : "text-black/20"}`} />
                  ))}
                </div>
                <p className="font-tech text-[11px] leading-relaxed tracking-[0.08em] text-black/65 mt-4">
                  {r.text}
                </p>
                <p className="font-tech text-[9px] tracking-[0.25em] text-black/35 mt-4">
                  {r.author} — {new Date(r.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="font-tech text-[11px] tracking-[0.15em] text-black/45 mt-8 border border-dashed border-black/15 rounded-3xl py-14 text-center">
          Aucun avis pour le moment. Les avis clients s'afficheront ici automatiquement.
        </p>
      )}
    </section>
  );
}

/* UGC — emplacements Instagram / TikTok à remplir */
function UGC() {
  return (
    <section className="relative px-6 sm:px-10 py-20 sm:py-28 max-w-[1400px] mx-auto border-t border-black/10" data-testid="ugc-section">
      <p className="font-tech text-[10px] tracking-[0.45em] text-black/45">COMMUNAUTÉ</p>
      <h2 className="font-display font-extrabold uppercase text-2xl sm:text-4xl mt-3 text-black">
        Portez&nbsp;ZEV,&nbsp;taguez-nous
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
        {["Instagram", "TikTok", "Instagram", "TikTok"].map((label, i) => (
          <a
            key={i}
            href="#"
            title={`Ajouter le lien ${label}`}
            className="relative aspect-square bg-[#F6F6F5] border border-black/5 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-black/20 transition-colors duration-300"
            data-testid={`ugc-slot-${i}`}
          >
            <div className="z-watermark w-14 h-14 bg-black/[0.07]" />
            <p className="font-tech text-[9px] tracking-[0.25em] text-black/40 px-4">
              AJOUTER&nbsp;LE&nbsp;LIEN&nbsp;{label.toUpperCase()}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}

/* Newsletter */
function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api("/newsletter", { method: "POST", body: { email } });
      setDone(true);
    } catch (error) {
      setErr(error.message || "Erreur — réessayez");
    }
  };

  return (
    <section id="newsletter" className="relative px-6 py-24 sm:py-32 border-t border-black/10 text-center" data-testid="newsletter-section">
      <p className="font-tech text-[10px] tracking-[0.45em] text-black/45">NEWSLETTER</p>
      <h2 className="font-display font-extrabold uppercase text-2xl sm:text-4xl mt-3 text-black">
        Rejoignez&nbsp;ZEV&nbsp;SHOP
      </h2>
      {done ? (
        <p className="font-tech text-[11px] tracking-[0.25em] text-black/60 mt-8" data-testid="newsletter-success">
          Inscription enregistrée. Merci.
        </p>
      ) : (
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-10" data-testid="newsletter-form">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse email"
            data-testid="newsletter-email-input"
            className="flex-1 h-14 px-6 font-tech text-[11px] tracking-[0.15em] border border-black/15 rounded-full text-black placeholder:text-black/35 focus:outline-none focus:border-black transition-colors"
          />
          <button
            type="submit"
            data-testid="newsletter-submit-button"
            className="h-14 px-9 font-tech text-[10px] tracking-[0.3em] text-white bg-black rounded-full hover:bg-black/85 transition-colors cursor-pointer"
          >
            S'INSCRIRE
          </button>
        </form>
      )}
      {err && <p className="font-tech text-[10px] text-red-600 mt-4">{err}</p>}
    </section>
  );
}

export default function Home() {
  const bestsellers = PRODUCTS.filter((p) => p.badge === "bestseller");
  const recommended = PRODUCTS.filter((p) => p.badge === "recommended");

  return (
    <>
      <Intro />
      <Hero />
      <Marquee />
      <ProductSection
        testid="nouveautes-section"
        eyebrow="DERNIERS PRODUITS"
        title="Nouveautés"
        products={PRODUCTS}
        emptyNote="Les nouveautés s'afficheront automatiquement."
      />
      <ProductSection
        testid="bestsellers-section"
        eyebrow="LES PLUS DEMANDÉS"
        title="Meilleures ventes"
        products={bestsellers}
        emptyNote="Cette sélection s'affichera automatiquement dès que les données de ventes seront disponibles."
      />
      <ProductSection
        testid="recommendations-section"
        eyebrow="SÉLECTION POUR VOUS"
        title="Recommandations"
        products={recommended}
        emptyNote="Les recommandations s'afficheront automatiquement dès que les données seront disponibles."
      />
      <Categories />
      <Story />
      <HomeReviews />
      <UGC />
      <Newsletter />
    </>
  );
}
