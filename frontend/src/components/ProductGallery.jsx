import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ImageOff } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];

export default function ProductGallery({ open, onClose, variant }) {
  const [sel, setSel] = useState(0);

  useEffect(() => {
    if (open) setSel(0);
  }, [open, variant.id]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const current = variant.gallery[sel];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] bg-white/95 backdrop-blur-xl flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          data-testid="product-gallery"
        >
          <div className="h-20 flex items-center justify-between px-6 sm:px-10 border-b border-black/10">
            <p className="font-tech text-[11px] tracking-[0.35em] text-black/70">
              GALERIE&nbsp;—&nbsp;{variant.name}
            </p>
            <button
              type="button"
              onClick={onClose}
              data-testid="gallery-close-button"
              aria-label="Fermer la galerie"
              className="flex items-center justify-center w-11 h-11 rounded-full border border-black/15 text-black/70 hover:border-black transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center px-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${variant.id}-${sel}`}
                className="relative flex items-center justify-center w-full h-full max-h-full"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                {current.src ? (
                  <img
                    src={current.src}
                    alt={`${variant.name} — ${current.label}`}
                    draggable="false"
                    className="max-h-[58vh] w-auto max-w-full object-contain select-none"
                    style={{ filter: "drop-shadow(0 30px 30px rgba(0,0,0,0.18))" }}
                    data-testid="gallery-main-view"
                  />
                ) : (
                  <div
                    className="flex flex-col items-center justify-center gap-4 w-full max-w-2xl aspect-[16/9] border border-dashed border-black/15 rounded-3xl text-center px-6"
                    data-testid="gallery-placeholder"
                  >
                    <ImageOff className="w-8 h-8 text-black/25" strokeWidth={1.5} />
                    <p className="font-tech text-[11px] tracking-[0.35em] text-black/45">
                      {current.label}
                    </p>
                    <p className="font-tech text-[9px] tracking-[0.3em] text-black/30">
                      IMAGE&nbsp;BIENTÔT&nbsp;DISPONIBLE&nbsp;—&nbsp;VIA&nbsp;SHOPIFY
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="pb-10 pt-2 flex items-center justify-center gap-3 px-6 overflow-x-auto no-scrollbar">
            {variant.gallery.map((g, i) => (
              <button
                key={g.type}
                type="button"
                onClick={() => setSel(i)}
                data-testid={`gallery-thumb-${g.type}`}
                aria-label={g.label}
                className={`shrink-0 w-20 h-14 rounded-xl border flex items-center justify-center overflow-hidden transition-all duration-300 cursor-pointer ${
                  i === sel
                    ? "border-black bg-black/[0.04]"
                    : "border-black/15 opacity-70 hover:opacity-100 hover:border-black/40"
                }`}
              >
                {g.src ? (
                  <img
                    src={g.src}
                    alt={g.label}
                    className="w-full h-full object-contain"
                    style={{ transform: `scale(${variant.scale})` }}
                  />
                ) : (
                  <span className="font-tech text-[8px] tracking-[0.2em] text-black/40">
                    {g.label}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
