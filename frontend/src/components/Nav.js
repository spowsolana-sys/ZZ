import { Link, NavLink } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import LogoMark from "@/components/LogoMark";
import { useCart } from "@/context/CartContext";

const LINKS = [
  { to: "/", label: "HOME", end: true },
  { to: "/shop", label: "SHOP", end: false },
];

export default function Nav() {
  const { count, setOpen } = useCart();
  return (
    <header className="fixed top-0 inset-x-0 z-50 h-20 flex items-center justify-between px-6 sm:px-10 bg-[#05070A]/70 backdrop-blur-xl border-b border-white/5">
      <Link to="/" data-testid="brand-logo" className="flex items-center gap-3">
        <LogoMark className="w-8 h-8" />
        <span className="font-tech text-xs tracking-[0.4em] text-white">
          TUNED&nbsp;AIR
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-10">
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            data-testid={`nav-link-${l.label.toLowerCase()}`}
            className={({ isActive }) =>
              `font-tech text-[11px] tracking-[0.3em] transition-colors duration-300 ${
                isActive ? "text-cyan-300" : "text-white/50 hover:text-cyan-300"
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-3 sm:gap-5">
        <Link
          to="/shop"
          data-testid="nav-reserve-button"
          className="hidden sm:block font-tech text-[11px] tracking-[0.25em] text-cyan-300 border border-cyan-400/40 rounded-full px-5 py-2.5 hover:bg-cyan-400/10 hover:shadow-[0_0_24px_rgba(0,240,255,0.25)] transition-all duration-300"
        >
          RESERVE&nbsp;AIR
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          data-testid="cart-open-button"
          aria-label="Open cart"
          className="relative flex items-center justify-center w-11 h-11 rounded-full border border-white/15 text-white/80 hover:text-cyan-300 hover:border-cyan-300/50 transition-colors duration-300 cursor-pointer"
        >
          <ShoppingBag className="w-[18px] h-[18px]" />
          {count > 0 && (
            <span
              data-testid="cart-count"
              className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-cyan-300 text-[#05070A] font-tech text-[10px] font-bold"
            >
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
