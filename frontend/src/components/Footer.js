import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import LogoMark from "@/components/LogoMark";
import { useCart } from "@/context/CartContext";

export default function Footer() {
  const { setOpen } = useCart();

  return (
    <footer className="relative border-t border-black/10 bg-white overflow-hidden">
      <div className="px-6 sm:px-10 pt-16 pb-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-start justify-between gap-10">
          <Link to="/" className="flex items-center gap-3">
            <LogoMark className="w-10 h-10" />
            <div>
              <p className="font-display text-sm font-extrabold tracking-[0.3em] text-black">
                ZEV&nbsp;SHOP
              </p>
              <p className="font-tech text-[9px] tracking-[0.3em] text-black/40 mt-1">
                MOVE&nbsp;DIFFERENT.
              </p>
            </div>
          </Link>

          <nav className="flex flex-col gap-3">
            <p className="font-tech text-[9px] tracking-[0.4em] text-black/35">
              BOUTIQUE
            </p>
            <Link
              to="/catalogue"
              data-testid="footer-link-catalogue"
              className="font-tech text-[11px] tracking-[0.25em] text-black/55 hover:text-black transition-colors"
            >
              CATALOGUE
            </Link>
            <Link
              to="/categorie/vetements"
              data-testid="footer-link-vetements"
              className="font-tech text-[11px] tracking-[0.25em] text-black/55 hover:text-black transition-colors"
            >
              VÊTEMENTS
            </Link>
            <Link
              to="/categorie/accessoires"
              data-testid="footer-link-accessoires"
              className="font-tech text-[11px] tracking-[0.25em] text-black/55 hover:text-black transition-colors"
            >
              ACCESSOIRES
            </Link>
          </nav>

          <nav className="flex flex-col gap-3">
            <p className="font-tech text-[9px] tracking-[0.4em] text-black/35">
              SERVICES
            </p>
            <Link
              to="/suivi"
              data-testid="footer-link-suivi"
              className="font-tech text-[11px] tracking-[0.25em] text-black/55 hover:text-black transition-colors"
            >
              SUIVI&nbsp;DE&nbsp;COMMANDE
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              data-testid="footer-link-panier"
              className="flex items-center gap-2 font-tech text-[11px] tracking-[0.25em] text-black/55 hover:text-black transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              PANIER
            </button>
          </nav>

          <div className="flex flex-col gap-3">
            <p className="font-tech text-[9px] tracking-[0.4em] text-black/35">
              RÉSEAUX&nbsp;SOCIAUX
            </p>
            <div className="flex items-center gap-3">
              {[
                { id: "instagram", label: "Instagram", d: "M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5.25-2.75a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" },
                { id: "tiktok", label: "TikTok", d: "M16.6 3c.4 2.2 1.8 3.6 4 3.9v2.6c-1.5 0-2.9-.5-4-1.3v5.9c0 3.8-2.7 6.4-6.2 6.4A5.9 5.9 0 0 1 4.5 14c0-3.4 2.6-5.9 6.1-5.9.3 0 .7 0 1 .1v2.8a3 3 0 0 0-1-.2 3 3 0 0 0-3.1 3.1 3 3 0 0 0 3.1 3.1c1.9 0 3.1-1.3 3.1-3.4V3h2.9Z" },
                { id: "youtube", label: "YouTube", d: "M21.6 7.2a2.8 2.8 0 0 0-2-2C17.9 4.8 12 4.8 12 4.8s-5.9 0-7.6.4a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12c0 1.6.1 3.2.4 4.8a2.8 2.8 0 0 0 2 2c1.7.4 7.6.4 7.6.4s5.9 0 7.6-.4a2.8 2.8 0 0 0 2-2c.3-1.6.4-3.2.4-4.8s-.1-3.2-.4-4.8ZM10 15.2V8.8L15.2 12 10 15.2Z" },
              ].map(({ id, label, d }) => (
                <a
                  key={id}
                  href="#"
                  aria-label={label}
                  data-testid={`social-${id}`}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-black/15 text-black/60 hover:text-black hover:border-black transition-colors duration-300"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d={d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 select-none pointer-events-none" aria-hidden="true">
          <p className="font-display font-extrabold uppercase text-outline text-[12vw] leading-none whitespace-nowrap">
            ZEV&nbsp;SHOP
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 flex flex-col sm:flex-row justify-between gap-3">
          <p className="font-tech text-[9px] tracking-[0.3em] text-black/35">
            © 2025 ZEV SHOP — TOUS DROITS RÉSERVÉS
          </p>
          <p className="font-tech text-[9px] tracking-[0.3em] text-black/35">
            MOVE&nbsp;DIFFERENT.
          </p>
        </div>
      </div>
    </footer>
  );
}
