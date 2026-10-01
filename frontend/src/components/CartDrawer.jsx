import { AnimatePresence, motion } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { PRODUCTS, priceLabel } from "@/data/products";

const EASE = [0.16, 1, 0.3, 1];

export default function CartDrawer() {
  const { items, open, setOpen, remove, count } = useCart();

  const onCheckout = () => {
    toast("CHECKOUT OPENS WITH SHOPIFY — PRICES TBD");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            data-testid="cart-backdrop"
          />
          <motion.aside
            key="drawer"
            data-testid="cart-drawer"
            className="fixed right-0 top-0 z-[80] h-full w-full max-w-md bg-[#080B12] border-l border-white/10 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <div className="flex items-center justify-between h-20 px-6 border-b border-white/10">
              <p className="font-tech text-xs tracking-[0.4em] text-white">
                CART&nbsp;({count})
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                data-testid="cart-close-button"
                aria-label="Close cart"
                className="flex items-center justify-center w-10 h-10 rounded-full border border-white/15 text-white/70 hover:text-cyan-300 hover:border-cyan-300/50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                  <p className="font-tech text-[11px] tracking-[0.35em] text-white/40">
                    YOUR CART IS FLOATING EMPTY
                  </p>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpen(false);
                    }}
                    className="font-tech text-[11px] tracking-[0.3em] text-cyan-300"
                  >
                    STAY &amp; EXPLORE
                  </a>
                </div>
              ) : (
                items.map((item) => {
                  const p = PRODUCTS.find((pr) => pr.id === item.variantId);
                  return (
                    <div
                      key={item.key}
                      data-testid="cart-item"
                      className="flex items-center gap-4 py-4 border-b border-white/10"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-20 h-14 object-contain"
                      />
                      <div className="flex-1">
                        <p className="font-display text-xs font-bold text-white">
                          AIR MAX PLUS TN
                        </p>
                        <p className="font-tech text-[10px] tracking-[0.2em] text-white/45 mt-1">
                          {p.name}&nbsp;//&nbsp;EU&nbsp;{item.size}
                        </p>
                        <p className="font-tech text-[10px] tracking-[0.2em] text-cyan-300/90 mt-1">
                          {priceLabel(p)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(item.key)}
                        data-testid="cart-item-remove"
                        aria-label="Remove item"
                        className="text-white/40 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {items.length > 0 && (
              <div className="px-6 py-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={onCheckout}
                  data-testid="cart-checkout-button"
                  className="w-full font-tech text-[11px] tracking-[0.3em] text-[#05070A] bg-cyan-300 rounded-full py-4 hover:shadow-[0_0_36px_rgba(0,240,255,0.5)] transition-shadow duration-300 cursor-pointer"
                >
                  CHECKOUT
                </button>
                <p className="font-tech text-[9px] tracking-[0.3em] text-white/30 text-center mt-4">
                  PRICES SET IN SHOPIFY — PENDING
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
