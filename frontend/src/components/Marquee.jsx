const ITEMS = [
  "AIR MAX PLUS TN",
  "TUNED AIR",
  "1998 ARCHIVE",
  "WAVEFORM ENGINEERED",
  "HEMISPHERIC DAMPERS",
  "OBSIDIAN LAB",
];

function Sequence() {
  return (
    <div className="flex items-center shrink-0">
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="font-tech text-[10px] tracking-[0.35em] text-cyan-200/60 px-7">
            {item}
          </span>
          <span className="w-1.5 h-1.5 rotate-45 bg-cyan-400/50" />
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div
      className="relative z-40 border-t border-white/10 bg-[#070A10] py-3 overflow-hidden"
      data-testid="editorial-marquee"
    >
      <div className="marquee-track flex w-max">
        <Sequence />
        <Sequence />
      </div>
    </div>
  );
}
