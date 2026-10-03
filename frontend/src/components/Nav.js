import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import LogoMark from "@/components/LogoMark";
import { useCart } from "@/context/CartContext";

const EASE = [0.16, 1, 0.3, 1];

export const VETEMENTS = [
  { slug: "t-shirts", label: "T-shirts" },
  { slug: "pantalons", label: "Pantalons" },
  { slug: "sweats-a-capuche", label: "Sweats à capuche" },
  { slug: "ensembles", label: "Ensembles" },
  { slug: "pulls", label: "Pulls" },
  { slug: "shorts", label: "Shorts" },
  { slug: "shorts-de-bain", label: "Shorts de bain" },
];

export const ACCESSOIRES = [
  { slug: "chaussures", label: "Chaussures" },
  { slug: "sacoches", label: "Sacoches" },
  { slug: "claquettes", label: "Claquettes" },
  { slug: "bonnets", label: "Bonnets" },
  { slug: "casquettes", label: "Casquettes" },
  { slug: "lunettes", label: "Lunettes" },
  { slug: "bracelets", label: "Bracelets" },
];

function Dropdown({ label, items }) {
  return (
    <div className="relative group">
      <button
        type="button"
        className="flex items-center gap-1.5 font-tech text-[11px] tracking-[0.25em] text-black/60 group-hover:text-black transition-colors duration-200 py-2 cursor-pointer"
      >
        {label}
        <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
      </button>
      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
        <div className="bg-white border border-black/10 shadow-[0_24px_48px_rgba(0,0,0,0.08)] py-3 min-w-[210px]">
          {items.map((item) => (
            <Link
              key={item.slug}
              to={`/categorie/${item.slug}`}
              data-testid={`nav-sub-${item.slug}`}
              className="block px-6 py-2.5 font-tech text-[11px] tracking-[0.2em] text-black/55 hover:text-black hover:bg-black/[0.03] transition-colors duration-150"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Nav() {
  const { count, setOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 h-20 flex items-center justify-between px-6 sm:px-10 bg-white/85 backdrop-blur-xl border-b border-black/5">
        <Link to="/" data-testid="brand-logo" className="flex items-center gap-3">
          <LogoMark className="w-9 h-9" />
          <span className="font-display text-sm font-extrabold tracking-[0.25em] text-black">
            ZEV&nbsp;SHOP
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          <NavLink
            to="/catalogue"
            data-testid="nav-link-catalogue"
            className={({ isActive }) =>
              `font-tech text-[11px] tracking-[0.25em] py-2 transition-colors duration-200 ${
                isActive ? "text-black" : "text-black/60 hover:text-black"
              }`
            }
          >
            CATALOGUE
          </NavLink>
          <Dropdown label="VÊTEMENTS" items={VETEMENTS} />
          <Dropdown label="ACCESSOIRES" items={ACCESSOIRES} />
          <NavLink
            to="/suivi"
            data-testid="nav-link-suivi"
            className={({ isActive }) =>
              `font-tech text-[11px] tracking-[0.25em] py-2 transition-colors duration-200 ${
                isActive ? "text-black" : "text-black/60 hover:text-black"
              }`
            }
          >
            SUIVI&nbsp;DE&nbsp;COMMANDE
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            data-testid="cart-open-button"
            aria-label="Ouvrir le panier"
            className="relative flex items-center gap-2 h-11 px-4 rounded-full border border-black/15 text-black/80 hover:border-black/40 transition-colors duration-300 cursor-pointer font-tech text-[11px] tracking-[0.2em]"
          >
            <ShoppingBag className="w-[16px] h-[16px]" />
            <span className="hidden sm:inline">CART</span>
            {count > 0 && (
              <span
                data-testid="cart-count"
                className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-5 h-5 rounded-full bg-black text-white font-tech text-[10px] font-bold"
              >
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            data-testid="mobile-menu-open"
            aria-label="Ouvrir le menu"
            className="md:hidden flex items-center justify-center w-11 h-11 rounded-full border border-black/15 text-black/80 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-[60] bg-white flex flex-col overflow-y-auto"
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35, ease: EASE }}
            data-testid="mobile-menu"
          >
            <div className="h-20 flex items-center justify-between px-6 border-b border-black/5">
              <div className="flex items-center gap-3">
                <LogoMark className="w-9 h-9" />
                <span className="font-display text-sm font-extrabold tracking-[0.25em]">
                  ZEV&nbsp;SHOP
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                data-testid="mobile-menu-close"
                aria-label="Fermer le menu"
                className="flex items-center justify-center w-11 h-11 rounded-full border border-black/15 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-8 flex flex-col gap-8">
              <Link
                to="/catalogue"
                onClick={() => setMenuOpen(false)}
                className="font-display text-2xl font-extrabold tracking-wide"
              >
                CATALOGUE
              </Link>
              <div>
                <p className="font-tech text-[10px] tracking-[0.35em] text-black/40 mb-3">
                  VÊTEMENTS
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {VETEMENTS.map((i) => (
                    <Link
                      key={i.slug}
                      to={`/categorie/${i.slug}`}
                      onClick={() => setMenuOpen(false)}
                      className="font-tech text-[12px] text-black/60"
                    >
                      {i.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-tech text-[10px] tracking-[0.35em] text-black/40 mb-3">
                  ACCESSOIRES
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {ACCESSOIRES.map((i) => (
                    <Link
                      key={i.slug}
                      to={`/categorie/${i.slug}`}
                      onClick={() => setMenuOpen(false)}
                      className="font-tech text-[12px] text-black/60"
                    >
                      {i.label}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                to="/suivi"
                onClick={() => setMenuOpen(false)}
                className="font-display text-2xl font-extrabold tracking-wide"
              >
                SUIVI&nbsp;DE&nbsp;COMMANDE
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
