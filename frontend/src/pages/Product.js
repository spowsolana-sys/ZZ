import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { toast } from "sonner";
import { Images, Heart, Share2, X } from "lucide-react";
import { PRODUCTS, SIZES, priceLabel } from "@/data/products";
import ProductStage from "@/components/ProductStage";
import ProductGallery from "@/components/ProductGallery";
import ColorSelectors from "@/components/ColorSelectors";
import Accordion from "@/components/Accordion";
import Reviews from "@/components/Reviews";
import QA from "@/components/QA";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const EASE = [0.65, 0, 0.35, 1];

function SizeGuide({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] bg-white/95 backdrop-blur-xl flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          data-testid="size-guide-modal"
        >
          <motion.div
            className="w-full max-w-md bg-white border border-black/10 rounded-3xl p-8"
            initial={{ scale: 0.95, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 12 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div className="flex items-center justify-between mb-6">
              <p className="font-display text-sm font-extrabold tracking-[0.25em] text-black">
                GUIDE&nbsp;DES&nbsp;TAILLES
              </p>
              <button
                type="button"
                onClick={onClose}
                data-testid="size-guide-close"
                aria-label="Fermer le guide"
                className="flex items-center justify-center w-9 h-9 rounded-full border border-black/15 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {SIZES.map((s) => (
                <div key={s} className="border border-black/10 rounded-xl py-3 text-center font-tech text-[11px] text-black/70">
                  EU&nbsp;{s}
                </div>
              ))}
            </div>
            <p className="font-tech text-[10px] tracking-[0.2em] text-black/40 mt-6 leading-relaxed">
              Correspondances détaillées : à définir.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Product() {
  const { id } = useParams();
  const idx = PRODUCTS.findIndex((p) => p.id === id);
  const [size, setSize] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const { add } = useCart();
  const { user, wishlist, toggleWishlist } = useAuth();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 18 });
  const sy = useSpring(my, { stiffness: 55, damping: 18 });
  const shoeX = useTransform(sx, (v) => v * 16);
  const shoeY = useTransform(sy, (v) => v * 10);

  // Le logo Z pulse très légèrement à chaque changement de coloris
  const zControls = useAnimation();
  useEffect(() => {
    zControls.start({
      scale: [1, 0.985, 1],
      opacity: [1, 0.8, 1],
      transition: { duration: 0.8, ease: EASE },
    });
  }, [idx]);

  if (idx < 0) return <Navigate to="/catalogue" replace />;
  const p = PRODUCTS[idx];
  const siblings = PRODUCTS.filter((v) => v.productHandle === p.productHandle);
  const activeIdx = siblings.findIndex((v) => v.id === p.id);
  const wished = wishlist.includes(p.id);

  const onMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };

  const requireSize = () => {
    if (!size) {
      toast.error("Choisissez d'abord une taille");
      return false;
    }
    return true;
  };

  const onAdd = () => {
    if (!requireSize()) return;
    add(p.id, size);
    toast.success(`${p.name} — EU ${size} ajouté au panier`);
  };

  const onWish = () => {
    if (!user) {
      toast("Créez un compte pour sauvegarder vos produits favoris.");
      return;
    }
    toggleWishlist(p.id).catch(() => toast.error("Erreur — réessayez"));
  };

  const onShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié — partagez-le où vous voulez");
    } catch (e) {
      toast.error("Copie impossible sur ce navigateur");
    }
  };

  return (
    <main className="relative bg-white" data-testid="product-page" onMouseMove={onMouseMove}>
      {/* ---------- scène immersive (100svh) ---------- */}
      <div className="relative h-[100svh] overflow-hidden">
        {/* teinte ambiante neutre, fondu au changement */}
        <AnimatePresence>
          <motion.div
            key={p.id}
            aria-hidden="true"
            className="absolute inset-0 z-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{
              background: `radial-gradient(65% 55% at 50% 52%, ${p.spotlight} 0%, transparent 100%)`,
            }}
          />
        </AnimatePresence>

        {/* Z logo watermark — conteneur fixe parfaitement centré, indépendant
            de la sneaker ; la couleur change progressivement */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div animate={zControls}>
              <motion.div
                className="z-watermark w-[64vmin] h-[64vmin]"
                initial={false}
                animate={{ backgroundColor: p.zTint }}
                transition={{ duration: 0.8, ease: EASE }}
                data-testid="z-watermark"
              />
            </motion.div>
          </div>
        </div>

        {/* breadcrumb */}
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="absolute z-30 top-[7.5rem] left-6 sm:left-10 font-tech text-[10px] tracking-[0.4em] text-black/40"
        >
          <Link to="/catalogue" className="hover:text-black transition-colors">
            CATALOGUE
          </Link>
          <span className="mx-2">/</span>
          <span className="text-black/70">{p.title}</span>
        </motion.p>

        {/* scène carrousel — uniquement les variantes du même produit */}
        <ProductStage products={siblings} active={activeIdx} shoeX={shoeX} shoeY={shoeY} />

        {/* identité + actions secondaires — desktop (mobile : panneau bas) */}
        <div className="hidden sm:block absolute z-30 left-10 top-[58%] max-w-[240px]">
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
          >
            <h1
              className="font-display text-lg sm:text-2xl font-bold text-black leading-snug"
              data-testid="product-variant-name"
            >
              {p.name}
            </h1>
            <button
              type="button"
              onClick={() => setGalleryOpen(true)}
              data-testid="gallery-open-button"
              className="inline-flex items-center gap-2 mt-5 font-tech text-[10px] tracking-[0.3em] text-black/70 border border-black/20 rounded-full px-5 py-2.5 hover:border-black hover:text-black transition-colors duration-300 cursor-pointer"
            >
              <Images className="w-3.5 h-3.5" />
              Plus de photos
            </button>
          </motion.div>
        </div>

        {/* tailles — colonne droite (desktop) / panneau bas (mobile) */}
        <div className="hidden sm:block absolute z-30 sm:right-10 sm:top-[42%]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
          >
            <div className="flex items-center justify-between sm:justify-end gap-4 mb-3">
              <p className="font-tech text-[10px] tracking-[0.4em] text-black/40">TAILLE</p>
              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                data-testid="size-guide-open"
                className="font-tech text-[9px] tracking-[0.25em] text-black/45 underline underline-offset-4 hover:text-black cursor-pointer"
              >
                Guide des tailles
              </button>
            </div>
            <div className="flex sm:flex-col flex-nowrap gap-1.5 sm:gap-2 sm:items-end">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  data-testid={`size-chip-${s}`}
                  className={`shrink-0 sm:shrink w-10 h-9 sm:w-12 sm:h-10 font-tech text-[10px] sm:text-[11px] tracking-[0.1em] border transition-all duration-300 cursor-pointer ${
                    size === s
                      ? "border-black bg-black text-white"
                      : "border-black/20 text-black/60 hover:border-black/60 hover:text-black"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* prix + disponibilité — desktop (mobile : panneau bas) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
          className="hidden sm:block absolute z-30 left-10 bottom-9"
        >
          <div className="flex items-baseline gap-3">
            <p
              className="font-display font-bold text-base sm:text-2xl text-black"
              data-testid="product-price"
            >
              {priceLabel(p)}
            </p>
            {p.oldPrice && (
              <p className="font-tech text-[11px] text-black/40 line-through" data-testid="product-old-price">
                {priceLabel(p.oldPrice)}
              </p>
            )}
            {p.discountPercent && (
              <p className="font-tech text-[10px] text-black bg-black/[0.06] rounded-full px-2.5 py-1" data-testid="product-discount">
                -{p.discountPercent}%
              </p>
            )}
          </div>
          <p
            className={`flex items-center gap-2 font-tech text-[10px] tracking-[0.3em] mt-2 ${
              p.available ? "text-black/60" : "text-black/35"
            }`}
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
        </motion.div>

        {/* actions principales — desktop (mobile : panneau bas) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65, ease: EASE }}
          className="hidden sm:flex absolute z-30 sm:right-10 sm:bottom-28 items-center gap-3"
        >
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onWish}
              data-testid="wishlist-button"
              aria-label="Ajouter à la wishlist"
              className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full border border-black/20 hover:border-black transition-colors cursor-pointer"
            >
              <Heart className={`w-4.5 h-4.5 ${wished ? "fill-black text-black" : "text-black/60"}`} />
            </button>
            <button
              type="button"
              onClick={onShare}
              data-testid="share-button"
              aria-label="Partager"
              className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full border border-black/20 hover:border-black transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-black/60" />
            </button>
          </div>
          <button
            type="button"
            onClick={onAdd}
            data-testid="add-to-cart-button"
            className="flex-1 font-tech text-[12px] tracking-[0.2em] text-white bg-black rounded-full px-8 py-3.5 hover:bg-black/85 transition-colors duration-300 cursor-pointer"
          >
            Ajouter au panier
          </button>
        </motion.div>

        {/* sélecteurs de coloris — variantes du même produit uniquement (desktop) */}
        <div className="hidden sm:block">
          <ColorSelectors products={siblings} active={activeIdx} />
        </div>

        {/* ---------- panneau d'achat mobile — flux empilé ---------- */}
        <div
          className="sm:hidden absolute z-30 inset-x-0 bottom-0 bg-white/90 backdrop-blur-md border-t border-black/10 px-5 pt-4 pb-4 flex flex-col gap-3"
          data-testid="mobile-buy-panel"
        >
          <h1
            className="font-display text-lg font-bold text-black leading-snug"
            data-testid="product-variant-name-mobile"
          >
            {p.name}
          </h1>
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setGalleryOpen(true)}
              data-testid="gallery-open-button-mobile"
              className="inline-flex items-center gap-2 font-tech text-[10px] tracking-[0.25em] text-black/70 border border-black/20 rounded-full px-4 py-2 hover:border-black hover:text-black transition-colors duration-300 cursor-pointer"
            >
              <Images className="w-3.5 h-3.5" />
              Plus de photos
            </button>
            <ColorSelectors products={siblings} active={activeIdx} idPrefix="mobile-" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-tech text-[10px] tracking-[0.4em] text-black/40">TAILLE</p>
              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                data-testid="size-guide-open-mobile"
                className="font-tech text-[9px] tracking-[0.25em] text-black/45 underline underline-offset-4 hover:text-black cursor-pointer"
              >
                Guide des tailles
              </button>
            </div>
            <div className="flex flex-nowrap gap-1.5">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  data-testid={`size-chip-mobile-${s}`}
                  className={`shrink-0 w-10 h-9 font-tech text-[10px] tracking-[0.1em] border transition-all duration-300 cursor-pointer ${
                    size === s
                      ? "border-black bg-black text-white"
                      : "border-black/20 text-black/60 hover:border-black/60 hover:text-black"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-display font-bold text-base text-black" data-testid="product-price-mobile">
              {priceLabel(p)}
            </p>
            <p className="flex items-center gap-2 font-tech text-[10px] tracking-[0.3em] text-black/60">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full bg-black/30 opacity-60 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-black" />
              </span>
              EN&nbsp;STOCK
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onWish}
              data-testid="wishlist-button-mobile"
              aria-label="Ajouter à la wishlist"
              className="shrink-0 flex items-center justify-center w-11 h-11 rounded-full border border-black/20 hover:border-black transition-colors cursor-pointer"
            >
              <Heart className={`w-4 h-4 ${wished ? "fill-black text-black" : "text-black/60"}`} />
            </button>
            <button
              type="button"
              onClick={onShare}
              data-testid="share-button-mobile"
              aria-label="Partager"
              className="shrink-0 flex items-center justify-center w-11 h-11 rounded-full border border-black/20 hover:border-black transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-black/60" />
            </button>
            <button
              type="button"
              onClick={onAdd}
              data-testid="add-to-cart-button-mobile"
              className="flex-1 font-tech text-[12px] tracking-[0.2em] text-white bg-black rounded-full px-6 py-3 hover:bg-black/85 transition-colors duration-300 cursor-pointer"
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>

      {/* ---------- sections détailles (accordéons) ---------- */}
      <div className="relative z-20 bg-white border-t border-black/10">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <Accordion title="Description" defaultOpen>
            <p>À définir.</p>
          </Accordion>
          <Accordion title="Détails">
            <p>À définir.</p>
          </Accordion>
          <Accordion title="Matières & composition">
            <p>À définir.</p>
          </Accordion>
          <Accordion title="Entretien">
            <p>À définir.</p>
          </Accordion>
          <Accordion title="Livraison">
            <p>
              Délai standard estimé : 7 à 12 jours. Frais : à définir.{" "}
              <Link to="/livraison" className="underline underline-offset-4">
                Page livraison
              </Link>
            </p>
          </Accordion>
          <Accordion title="Retours">
            <p>
              À définir.{" "}
              <Link to="/retours" className="underline underline-offset-4">
                Page retours
              </Link>
            </p>
          </Accordion>
          <div className="pt-12">
            <Reviews productId={p.id} />
          </div>
          <div className="pt-12">
            <QA productId={p.id} />
          </div>
        </div>
      </div>

      {/* galerie + guide des tailles */}
      <ProductGallery open={galleryOpen} onClose={() => setGalleryOpen(false)} variant={p} />
      <SizeGuide open={guideOpen} onClose={() => setGuideOpen(false)} />
    </main>
  );
}
