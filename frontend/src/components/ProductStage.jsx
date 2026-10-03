import { AnimatePresence, motion, useTransform } from "framer-motion";
import { useShoeTilt, ShoeFloat, ShoeTiltLayer } from "./ShoeMotion";

const EASE = [0.65, 0, 0.35, 1]; // accélération puis décélération
const FLOAT = { duration: 7, repeat: Infinity, ease: "easeInOut" };

/*
 * Immersive vertical carousel: on every variant switch the current sneaker
 * travels DOWN out of the viewport (slight scale-down, fades near the end)
 * while the next one descends from ABOVE into the center (scale 0.94 -> 1).
 * Both are visible mid-flight; images are never crossfaded or recolored.
 * ~800ms with a natural ease-in-out glide.
 *
 * Présentation premium 2.5D (ShoeMotion) : lévitation idle avec micro-rotation
 * et respiration d'échelle, inclinaison perspective qui suit le curseur au
 *-dessus de la scène, retour amorti par ressorts, ombre détachée réactive.
 */
export default function ProductStage({ products, active, shoeX, shoeY }) {
  const p = products[active];
  const tilt = useShoeTilt({ maxYaw: 10, maxPitch: 8 });
  const shadowX = useTransform(tilt.rotateY, (v) => v * -2.4);
  const shadowScale = useTransform(tilt.rotateY, (v) => 1 - Math.abs(v) * 0.008);

  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden"
      data-testid="product-viewport"
    >
      {/* neutral ambient spotlight — crossfades on switch */}
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
        {...tilt.bind}
      >
        {/* carousel viewport — overflow hidden, sneakers travel through it */}
        <motion.div
          className="relative w-[88vw] max-w-[860px] aspect-[3/2] overflow-hidden"
          data-testid="product-stage"
          style={{ perspective: 1100 }}
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
                  y: { duration: 0.8, ease: EASE },
                  scale: { duration: 0.8, ease: EASE },
                  opacity: { duration: 0.3, ease: "easeOut" },
                },
              }}
              exit={{
                y: "135%",
                scale: 0.96,
                opacity: 0,
                transition: {
                  y: { duration: 0.8, ease: EASE },
                  scale: { duration: 0.8, ease: EASE },
                  opacity: { duration: 0.3, delay: 0.5, ease: "easeIn" },
                },
              }}
              data-testid="sneaker-carousel-item"
            >
              {/* idle levitation premium (flottement + micro-rotation + respiration) */}
              <ShoeFloat amplitude={9} rotate={0.8} breathe={0.012} duration={7} className="w-full h-full">
                {/* inclinaison perspective suivant le curseur — retour amorti */}
                <ShoeTiltLayer tilt={tilt} hoverScale={0.015} className="w-full h-full">
                  <img
                    src={p.image}
                    alt={`ZEV SHOP — ${p.name}`}
                    draggable="false"
                    className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none will-change-transform"
                    style={{
                      transform: `scale(${p.scale}) translateY(${p.shiftY})`,
                      filter: `drop-shadow(0 32px 30px ${p.glow})`,
                    }}
                  />
                </ShoeTiltLayer>
              </ShoeFloat>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* detached soft shadow — reacts to float, color transitions AND tilt */}
        <motion.div
          className="relative w-[42%] h-8 sm:h-9 -mt-5 sm:-mt-6"
          style={{ x: shadowX, scaleX: shadowScale }}
        >
          <AnimatePresence>
            <motion.div
              key={p.id}
              className="absolute inset-0"
              initial={{ opacity: 0, scaleX: 0.8 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 0.8, ease: "easeInOut" },
                scaleX: { duration: 0.8, ease: EASE },
              }}
              style={{ background: p.shadowTint, borderRadius: "100%" }}
            />
          </AnimatePresence>
          <motion.div
            className="absolute inset-0 rounded-[100%] bg-black/50 blur-2xl"
            animate={{
              scaleX: [1.05, 0.85, 1.05],
              opacity: [0.4, 0.2, 0.4],
            }}
            transition={FLOAT}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
