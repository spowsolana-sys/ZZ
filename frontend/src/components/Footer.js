import { Link } from "react-router-dom";
import LogoMark from "@/components/LogoMark";

export default function Footer() {
  return (
    <footer className="relative border-t border-black/10 bg-white overflow-hidden">
      <div className="px-6 sm:px-10 pt-16 pb-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <Link to="/" className="flex items-center gap-3">
            <LogoMark className="w-10 h-10" />
            <div>
              <p className="font-display text-sm font-extrabold tracking-[0.3em] text-black">
                ZEV&nbsp;SHOP
              </p>
              <p className="font-tech text-[9px] tracking-[0.3em] text-black/40 mt-1">
                SNEAKERS&nbsp;—&nbsp;PRÊT&nbsp;POUR&nbsp;SHOPIFY
              </p>
            </div>
          </Link>
          <nav className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link
              to="/catalogue"
              className="font-tech text-[11px] tracking-[0.25em] text-black/55 hover:text-black transition-colors"
            >
              CATALOGUE
            </Link>
            <Link
              to="/categorie/chaussures"
              className="font-tech text-[11px] tracking-[0.25em] text-black/55 hover:text-black transition-colors"
            >
              CHAUSSURES
            </Link>
            <Link
              to="/suivi"
              className="font-tech text-[11px] tracking-[0.25em] text-black/55 hover:text-black transition-colors"
            >
              SUIVI&nbsp;DE&nbsp;COMMANDE
            </Link>
          </nav>
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
            E-COMMERCE&nbsp;PRÊT&nbsp;POUR&nbsp;SHOPIFY
          </p>
        </div>
      </div>
    </footer>
  );
}
