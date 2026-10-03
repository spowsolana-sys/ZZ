import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { X, Trash2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { PRODUCTS, priceLabel } from "@/data/products";

const EASE = [0.16, 1, 0.3, 1];

export default function CartDrawer() {
  const { items, open, setOpen, setQty, remove, count } = useCart();

  // Total automatique : si un seul prix manque (non défini Shopify),
  // le total reste en placeholder — aucun prix inventé.
  let total = 0;
  let allPriced = items.length > 0;
  for (const item of items) {
    const p = PRODUCTS.find((pr) => pr.id === item.variantId);
    const price = p && p.price;
    if (
      price &&
      typeof price === "object" &&
      price.amount !== undefined &&
      price.amount !== null
    ) {
      total += Number(price.amount) * item.qty;
    } else {
      allPriced = false;
    }
  }
  const totalLabel = allPriced
    ? new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: total % 1 === 0 ? 0 : 2,
      }).format(total)
    : "Prix à définir";

  const onCheckout = () => {
    toast("PAIEMENT DISPONIBLE À LA CONNEXION DE SHOPIFY");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[70] bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            data-testid="cart-backdrop"
          />
          <motion.aside
            key="drawer"
            data-testid="cart-drawer"
            className="fixed right-0 top-0 z-[80] h-full w-full max-w-md bg-white border-l border-black/10 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <div className="flex items-center justify-between h-20 px-6 border-b border-black/10">
              <p className="font-display text-sm font-extrabold tracking-[0.3em] text-black">
                PANIER&nbsp;({count})
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                data-testid="cart-close-button"
                aria-label="Fermer le panier"
                className="flex items-center justify-center w-10 h-10 rounded-full border border-black/15 text-black/70 hover:border-black/40 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                  <p className="font-tech text-[11px] tracking-[0.35em] text-black/40">
                    VOTRE&nbsp;PANIER&nbsp;EST&nbsp;VIDE
                  </p>
                  <Link
                    to="/catalogue"
                    onClick={() => setOpen(false)}
                    className="font-tech text-[11px] tracking-[0.3em] text-black border-b border-black pb-0.5"
                  >
                    VOIR&nbsp;LE&nbsp;CATALOGUE
                  </Link>
                </div>
              ) : (
                items.map((item) => {
                  const p = PRODUCTS.find((pr) => pr.id === item.variantId);
                  return (
                    <div
                      key={item.key}
                      data-testid="cart-item"
                      className="flex gap-4 py-4 border-b border-black/10"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-20 h-14 object-contain shrink-0"
                        style={{ transform: `scale(${p.scale})` }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-display text-xs font-bold text-black">
                              {p.name}
                            </p>
                            <p
                              className="font-tech text-[10px] tracking-[0.2em] text-black/45 mt-1"
                              data-testid="cart-item-color"
                            >
                              COLORIS&nbsp;:&nbsp;
                              {p.selectedOptions.Color}&nbsp;—&nbsp;EU&nbsp;
                              {item.size}
                            </p>
                            <p className="font-tech text-[10px] tracking-[0.2em] text-black/70 mt-1">
                              {priceLabel(p)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(item.key)}
                            data-testid="cart-item-remove"
                            aria-label="Retirer l'article"
                            className="text-black/40 hover:text-black transition-colors cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div
                          className="inline-flex items-center border border-black/15 rounded-full mt-3"
                          data-testid="cart-item-qty"
                        >
                          <button
                            type="button"
                            onClick={() => setQty(item.key, item.qty - 1)}
                            data-testid="cart-qty-minus"
                            aria-label="Diminuer la quantité"
                            className="flex items-center justify-center w-8 h-8 text-black/60 hover:text-black transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center font-tech text-[11px] text-black">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQty(item.key, item.qty + 1)}
                            data-testid="cart-qty-plus"
                            aria-label="Augmenter la quantité"
                            className="flex items-center justify-center w-8 h-8 text-black/60 hover:text-black transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {items.length > 0 && (
              <div className="px-6 py-6 border-t border-black/10">
                <div
                  className="flex items-center justify-between mb-4"
                  data-testid="cart-total-row"
                >
                  <p className="font-tech text-[10px] tracking-[0.35em] text-black/45">
                    TOTAL
                  </p>
                  <p
                    className="font-display text-sm font-bold text-black"
                    data-testid="cart-total"
                  >
                    {totalLabel}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onCheckout}
                  data-testid="cart-checkout-button"
                  className="w-full font-tech text-[11px] tracking-[0.3em] text-white bg-black rounded-full py-4 hover:bg-black/85 active:scale-[0.99] transition-all duration-300 cursor-pointer"
                >
                  COMMANDER
                </button>
                <p className="font-tech text-[9px] tracking-[0.3em] text-black/35 text-center mt-4">
                  PRIX&nbsp;&amp;&nbsp;STOCKS&nbsp;SYNCHRONISÉS&nbsp;VIA&nbsp;SHOPIFY
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
