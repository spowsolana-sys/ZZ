import { AnimatePresence, motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];
const FLOAT = { duration: 7, repeat: Infinity, ease: "easeInOut" };

/*
 * Immersive vertical carousel: on every variant switch the current sneaker
 * travels DOWN out of the viewport (slight scale-down, fades near the end)
 * while the next one descends from ABOVE into the center (scale 0.94 -> 1).
 * Both are visible mid-flight; images are never crossfaded or recolored.
 */
export default function ProductStage({ products, active, shoeX, shoeY }) {
  const p = products[active];

  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden"
      data-testid="product-viewport"
    >
      {/* per-variant ambient spotlight — crossfades with the colorway */}
      <AnimatePresence>
        <motion.div
          key={p.id}
          className="absolute w-[105vmin] h-[105vmin] rounded-full pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          style={{
            x: shoeX,
            y: shoeY,
            background: `radial-gradient(circle, ${p.spotlight} 0%, transparent 70%)`,
          }}
        />
      </AnimatePresence>

      <motion.div
        className="relative flex flex-col items-center"
        style={{ x: shoeX, y: shoeY }}
      >
        {/* carousel viewport — overflow hidden, sneakers travel through it */}
        <motion.div
          className="relative w-[88vw] max-w-[860px] aspect-[3/2] overflow-hidden"
          data-testid="product-stage"
        >
          <AnimatePresence>
            <motion.div
              key={p.id}
              className="absolute inset-0"
              initial={{ y: "-135%", scale: 0.94, opacity: 0 }}
              animate={{
                y: "0%",
                scale: 1,
                opacity: 1,
                transition: {
                  y: { duration: 1.05, ease: EASE },
                  scale: { duration: 1.05, ease: EASE },
                  opacity: { duration: 0.45, ease: "easeOut" },
                },
              }}
              exit={{
                y: "135%",
                scale: 0.94,
                opacity: 0,
                transition: {
                  y: { duration: 0.95, ease: [0.5, 0, 0.75, 0] },
                  scale: { duration: 0.95, ease: [0.5, 0, 0.75, 0] },
                  opacity: { duration: 0.4, delay: 0.55, ease: "easeIn" },
                },
              }}
              data-testid="sneaker-carousel-item"
            >
              {/* idle levitation */}
              <motion.div
                className="w-full h-full"
                animate={{ y: [-10, 10, -10] }}
                transition={FLOAT}
              >
                <img
                  src={p.image}
                  alt={`Nike Air Max Plus TN — ${p.name}`}
                  draggable="false"
                  className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
                  style={{
                    transform: `scale(${p.scale}) translateY(${p.shiftY})`,
                    filter: `drop-shadow(0 0 55px ${p.glow})`,
                  }}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* detached soft shadow — crossfades tint with the colorway */}
        <div className="relative w-[42%] h-8 sm:h-9 -mt-5 sm:-mt-6">
          <AnimatePresence>
            <motion.div
              key={p.id}
              className="absolute inset-0 rounded-[100%] blur-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ background: p.shadowTint }}
            />
          </AnimatePresence>
          <motion.div
            className="absolute inset-0 rounded-[100%] bg-black/60 blur-2xl"
            animate={{
              scaleX: [1.05, 0.85, 1.05],
              opacity: [0.5, 0.25, 0.5],
            }}
            transition={FLOAT}
          />
        </div>
      </motion.div>
    </div>
  );
}
