import { Link } from "react-router-dom";
import LogoMark from "@/components/LogoMark";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#04060A] overflow-hidden">
      <div className="px-6 sm:px-10 pt-16 pb-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <LogoMark className="w-9 h-9" />
            <div>
              <p className="font-tech text-xs tracking-[0.4em] text-white">
                TUNED&nbsp;AIR
              </p>
              <p className="font-tech text-[9px] tracking-[0.3em] text-white/35 mt-1">
                AIR&nbsp;MAX&nbsp;PLUS&nbsp;TN&nbsp;—&nbsp;CONCEPT&nbsp;STORE
              </p>
            </div>
          </div>
          <nav className="flex items-center gap-8">
            <Link
              to="/"
              className="font-tech text-[11px] tracking-[0.3em] text-white/50 hover:text-cyan-300 transition-colors"
            >
              HOME
            </Link>
            <Link
              to="/shop"
              className="font-tech text-[11px] tracking-[0.3em] text-white/50 hover:text-cyan-300 transition-colors"
            >
              SHOP
            </Link>
          </nav>
        </div>

        <div className="mt-14 select-none pointer-events-none" aria-hidden="true">
          <p className="font-display font-extrabold uppercase text-outline text-[13vw] leading-none whitespace-nowrap">
            TUNED&nbsp;AIR
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3">
          <p className="font-tech text-[9px] tracking-[0.3em] text-white/30">
            © 2025 TUNED AIR — ALL WAVES RESERVED
          </p>
          <p className="font-tech text-[9px] tracking-[0.3em] text-white/30">
            SHOPIFY-READY STOREFRONT
          </p>
        </div>
      </div>
    </footer>
  );
}
