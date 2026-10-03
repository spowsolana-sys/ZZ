import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-black/10">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-5 text-left cursor-pointer"
        data-testid={`accordion-${title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
      >
        <span className="font-display text-xs sm:text-sm font-bold tracking-[0.15em] text-black uppercase">
          {title}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-black/50 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 pb-5" : "max-h-0"}`}
      >
        <div className="font-tech text-[11px] leading-relaxed tracking-[0.1em] text-black/55">
          {children}
        </div>
      </div>
    </div>
  );
}
