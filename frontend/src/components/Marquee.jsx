const ITEMS = ["ZEV SHOP", "MOVE DIFFERENT", "NEW ARRIVALS"];

function Sequence() {
  return (
    <div className="flex items-center shrink-0">
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="font-tech text-[10px] tracking-[0.35em] text-black/50 px-7">
            {item}
          </span>
          <span className="w-1.5 h-1.5 rotate-45 bg-black/30" />
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div
      className="relative z-40 border-y border-black/10 bg-white py-3 overflow-hidden"
      data-testid="editorial-marquee"
    >
      <div className="marquee-track flex w-max">
        <Sequence />
        <Sequence />
      </div>
    </div>
  );
}
