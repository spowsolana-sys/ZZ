import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Minus, Plus, Trash2, Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { PRODUCTS, priceLabel } from "@/data/products";

const EASE = [0.16, 1, 0.3, 1];

const STEPS = ["CONTACT", "ADRESSE", "LIVRAISON", "PAIEMENT", "RÉSUMÉ"];

const PAYMENTS = [
  { id: "card", label: "Carte bancaire", status: "Bientôt — via Shopify" },
  { id: "applepay", label: "Apple Pay", status: "À connecter" },
  { id: "googlepay", label: "Google Pay", status: "À connecter" },
  { id: "paypal", label: "PayPal", status: "À connecter" },
];

export default function Checkout() {
  const { items, setQty, remove, count } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [contact, setContact] = useState({ email: user?.email || "", firstName: user?.name || "", lastName: "" });
  const [address, setAddress] = useState({ line1: "", line2: "", city: "", zip: "", country: "France", phone: "" });
  const [promo, setPromo] = useState("");

  // Total : calculé automatiquement dès que les prix existent — aucun prix fictif
  let total = 0;
  let allPriced = items.length > 0;
  for (const item of items) {
    const p = PRODUCTS.find((pr) => pr.id === item.variantId);
    const price = p && p.price;
    if (price && typeof price === "object" && price.amount !== undefined) total += Number(price.amount) * item.qty;
    else allPriced = false;
  }
  const totalLabel = allPriced
    ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: total % 1 === 0 ? 0 : 2 }).format(total)
    : "Prix à définir";

  const onPay = () => {
    toast("Le paiement sera disponible à la connexion de Shopify.");
  };

  if (count === 0) {
    return (
      <div className="min-h-screen pt-52 pb-32 px-6 text-center">
        <h1 className="font-display font-extrabold uppercase text-3xl text-black">Panier vide</h1>
        <p className="font-tech text-[11px] tracking-[0.2em] text-black/45 mt-4">
          Ajoutez un produit avant de passer au paiement.
        </p>
        <Link
          to="/catalogue"
          data-testid="checkout-empty-cta"
          className="inline-block mt-10 font-tech text-[11px] tracking-[0.3em] text-black border-b border-black pb-1 hover:opacity-60 transition-opacity"
        >
          VOIR&nbsp;LE&nbsp;CATALOGUE
        </Link>
      </div>
    );
  }

  const field = (k, ph, required = true) => (
    <input
      key={k}
      type="text"
      value={contact[k] !== undefined ? contact[k] : address[k] || ""}
      onChange={(e) =>
        step === 1
          ? setContact({ ...contact, [k]: e.target.value })
          : setAddress({ ...address, [k]: e.target.value })
      }
      placeholder={ph}
      required={required}
      data-testid={`checkout-${k}-input`}
      className="h-13 py-3.5 px-5 font-tech text-[11px] tracking-[0.1em] border border-black/15 rounded-full text-black placeholder:text-black/35 focus:outline-none focus:border-black transition-colors"
    />
  );

  return (
    <div className="min-h-screen pt-40 pb-24 px-6 max-w-3xl mx-auto">
      <header className="text-center mb-10">
        <p className="font-tech text-[10px] tracking-[0.45em] text-black/45">COMMANDE</p>
        <h1 className="font-display font-extrabold uppercase text-3xl sm:text-4xl mt-4 text-black" data-testid="checkout-title">
          PAIEMENT
        </h1>
      </header>

      {/* invité vs compte */}
      {!user && (
        <div className="border border-black/10 rounded-3xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" data-testid="checkout-guest-note">
          <p className="font-tech text-[10px] tracking-[0.15em] text-black/55 leading-relaxed">
            Vous commandez en invité. Avec un compte : historique, wishlist, suivi simplifié,
            informations sauvegardées et programme de récompense (1 000 € → coupon 100 €).
          </p>
          <Link to="/compte" data-testid="checkout-login-link" className="shrink-0 font-tech text-[10px] tracking-[0.3em] text-black border-b border-black pb-0.5 hover:opacity-60">
            SE&nbsp;CONNECTER
          </Link>
        </div>
      )}

      {/* étapes */}
      <div className="flex items-center justify-between mb-12" data-testid="checkout-steps">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1 flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-tech text-[10px] border transition-colors ${
                i + 1 <= step ? "bg-black text-white border-black" : "border-black/20 text-black/40"
              }`}
            >
              {i + 1}
            </div>
            <span className="font-tech text-[8px] tracking-[0.25em] text-black/45 mt-2">{s}</span>
          </div>
        ))}
      </div>

      {/* étapes 1-4 : formulaires */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} className="grid gap-4" data-testid="checkout-step-contact">
          {["email", "firstName", "lastName"].map((k) => (
            <input
              key={k}
              type={k === "email" ? "email" : "text"}
              value={contact[k] || ""}
              onChange={(e) => setContact({ ...contact, [k]: e.target.value })}
              placeholder={k === "email" ? "Email" : k === "firstName" ? "Prénom" : "Nom"}
              required
              data-testid={`checkout-contact-${k}`}
              className="h-14 px-6 font-tech text-[11px] tracking-[0.15em] border border-black/15 rounded-full text-black placeholder:text-black/35 focus:outline-none focus:border-black transition-colors"
            />
          ))}
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} className="grid gap-4" data-testid="checkout-step-adresse">
          {[
            { k: "line1", ph: "Adresse" },
            { k: "line2", ph: "Complément (optionnel)" },
            { k: "city", ph: "Ville" },
            { k: "zip", ph: "Code postal" },
            { k: "country", ph: "Pays" },
            { k: "phone", ph: "Téléphone (optionnel)" },
          ].map(({ k, ph }) => (
            <input
              key={k}
              type="text"
              value={address[k] || ""}
              onChange={(e) => setAddress({ ...address, [k]: e.target.value })}
              placeholder={ph}
              required={!k.includes("2") && k !== "phone"}
              data-testid={`checkout-address-${k}`}
              className="h-14 px-6 font-tech text-[11px] tracking-[0.15em] border border-black/15 rounded-full text-black placeholder:text-black/35 focus:outline-none focus:border-black transition-colors"
            />
          ))}
        </motion.div>
      )}

      {step === 3 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} className="flex flex-col gap-3" data-testid="checkout-step-livraison">
          <div className="flex items-center justify-between border border-black bg-black/[0.03] rounded-2xl p-5">
            <div>
              <p className="font-display text-xs font-bold text-black">LIVRAISON STANDARD</p>
              <p className="font-tech text-[10px] tracking-[0.2em] text-black/50 mt-1">
                Délai estimé : 7 à 12 jours
              </p>
            </div>
            <p className="font-tech text-[10px] tracking-[0.2em] text-black/50">Frais : à définir</p>
          </div>
          <div className="flex items-center justify-between border border-black/10 rounded-2xl p-5 opacity-50">
            <div>
              <p className="font-display text-xs font-bold text-black">LIVRAISON EXPRESS</p>
              <p className="font-tech text-[10px] tracking-[0.2em] text-black/45 mt-1">À définir</p>
            </div>
            <p className="font-tech text-[9px] tracking-[0.25em] text-black/35">INDISPONIBLE</p>
          </div>
        </motion.div>
      )}

      {step === 4 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} className="flex flex-col gap-3" data-testid="checkout-step-paiement">
          {PAYMENTS.map((m) => (
            <div key={m.id} className="flex items-center justify-between border border-black/10 rounded-2xl p-5" data-testid={`payment-${m.id}`}>
              <p className="font-display text-xs font-bold text-black">{m.label}</p>
              <p className="font-tech text-[9px] tracking-[0.25em] text-black/40">{m.status}</p>
            </div>
          ))}
          <p className="font-tech text-[9px] tracking-[0.2em] text-black/35 mt-2">
            Aucun moyen de paiement n'est encore actif — la structure est prête pour Shopify / Stripe.
          </p>
        </motion.div>
      )}

      {/* navigation étapes */}
      {step < 5 && (
        <div className="flex justify-between mt-10">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            data-testid="checkout-back"
            className="font-tech text-[10px] tracking-[0.3em] text-black/50 hover:text-black underline underline-offset-4 cursor-pointer"
          >
            RETOUR
          </button>
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            data-testid="checkout-next"
            className="font-tech text-[11px] tracking-[0.3em] text-white bg-black rounded-full px-10 py-4 hover:bg-black/85 transition-colors cursor-pointer"
          >
            CONTINUER
          </button>
        </div>
      )}

      {/* étape 5 : résumé */}
      {step === 5 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} data-testid="checkout-step-resume">
          <div className="flex flex-col gap-4">
            {items.map((item) => {
              const p = PRODUCTS.find((pr) => pr.id === item.variantId);
              return (
                <div key={item.key} className="flex items-center gap-4 border border-black/10 rounded-2xl p-4">
                  <img src={p.image} alt={p.name} className="w-16 h-11 object-contain" style={{ transform: `scale(${p.scale})` }} />
                  <div className="flex-1">
                    <p className="font-display text-xs font-bold text-black">{p.name}</p>
                    <p className="font-tech text-[10px] tracking-[0.15em] text-black/45 mt-1">
                      {p.selectedOptions.Color} — EU {item.size} — x{item.qty}
                    </p>
                  </div>
                  <p className="font-tech text-[10px] text-black/60">{priceLabel(p)}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex gap-3">
            <input
              type="text"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder="Code promo"
              data-testid="checkout-promo-input"
              className="flex-1 h-13 py-3 px-5 font-tech text-[11px] tracking-[0.15em] border border-black/15 rounded-full text-black placeholder:text-black/35 focus:outline-none focus:border-black"
            />
            <button
              type="button"
              onClick={() => toast("Codes promo — à définir.")}
              data-testid="checkout-promo-apply"
              className="h-13 px-7 font-tech text-[10px] tracking-[0.3em] border border-black/25 rounded-full hover:bg-black hover:text-white transition-colors cursor-pointer"
            >
              APPLIQUER
            </button>
          </div>

          <div className="mt-8 border-t border-black/10 pt-6 flex flex-col gap-2 font-tech text-[11px] tracking-[0.2em] text-black/60">
            <div className="flex justify-between" data-testid="checkout-subtotal">
              <span>SOUS-TOTAL</span>
              <span>{totalLabel}</span>
            </div>
            <div className="flex justify-between" data-testid="checkout-shipping">
              <span>LIVRAISON</span>
              <span>À définir</span>
            </div>
            <div className="flex justify-between font-bold text-black text-sm pt-3 border-t border-black/10" data-testid="checkout-total">
              <span>TOTAL</span>
              <span>{totalLabel}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onPay}
            data-testid="checkout-pay-button"
            className="mt-8 w-full inline-flex items-center justify-center gap-3 font-tech text-[11px] tracking-[0.3em] text-white bg-black rounded-full py-5 hover:bg-black/85 transition-colors cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            PASSER&nbsp;AU&nbsp;PAIEMENT
          </button>
        </motion.div>
      )}

      {/* récap latéral léger pendant les étapes 1-4 */}
      {step < 5 && (
        <p className="mt-8 text-center font-tech text-[10px] tracking-[0.25em] text-black/40" data-testid="checkout-mini-total">
          {count} ARTICLE{count > 1 ? "S" : ""} — TOTAL : {totalLabel}
        </p>
      )}
    </div>
  );
}
