import { motion, useTransform } from "framer-motion";
import { useShoeTilt, ShoeFloat, ShoeTiltLayer } from "./ShoeMotion";

const EASE = [0.16, 1, 0.3, 1];
const FLOAT = { duration: 7, repeat: Infinity, ease: "easeInOut" };

/*
 * Hero stage — même système premium 2.5D que l'étape produit (ShoeMotion) :
 * lévitation idle (flottement + micro-rotation + respiration), inclinaison
 * perspective suivant le curseur avec retour amorti, ombre détachée réactive.
 */
export default function SneakerStage({ products, active, shoeX, shoeY }) {
  const tilt = useShoeTilt({ maxYaw: 10, maxPitch: 8 });
  const shadowX = useTransform(tilt.rotateY, (v) => v * -2.4);
  const shadowScale = useTransform(tilt.rotateY, (v) => 1 - Math.abs(v) * 0.008);

  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden"
      data-testid="product-viewport"
    >
      {/* soft neutral spotlight behind the shoe */}
      <motion.div
        className="absolute w-[95vmin] h-[95vmin] rounded-full pointer-events-none"
        style={{
          x: shoeX,
          y: shoeY,
          background:
            "radial-gradient(circle, rgba(0,0,0,0.045) 0%, rgba(0,0,0,0.015) 42%, transparent 70%)",
        }}
      />

      <motion.div
        className="relative flex flex-col items-center"
        style={{ x: shoeX, y: shoeY }}
        {...tilt.bind}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.88, filter: "blur(28px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.5, delay: 0.35, ease: EASE }}
        >
          <ShoeFloat amplitude={10} rotate={0.9} breathe={0.012} duration={7}>
            <div
              className="relative w-[88vw] max-w-[860px] aspect-[3/2]"
              data-testid="sneaker-hero-image"
              style={{ perspective: 1100 }}
            >
              <ShoeTiltLayer tilt={tilt} hoverScale={0.015} className="w-full h-full">
                {products.map((p, i) => (
                  <img
                    key={p.id}
                    src={p.image}
                    alt={`ZEV SHOP — ${p.name}`}
                    draggable="false"
                    className={`absolute inset-0 w-full h-full object-contain select-none pointer-events-none transition-opacity duration-500 will-change-transform ${
                      i === active ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      transform: `scale(${p.scale}) translateY(${p.shiftY})`,
                      filter: `drop-shadow(0 32px 30px ${p.glow})`,
                    }}
                  />
                ))}
              </ShoeTiltLayer>
            </div>
          </ShoeFloat>
        </motion.div>

        {/* detached soft shadow, counter-phased with the float + reactive to tilt */}
        <motion.div
          className="-mt-4 sm:-mt-6 h-7 sm:h-9 w-[42%]"
          style={{ x: shadowX, scaleX: shadowScale }}
        >
          <motion.div
            className="w-full h-full rounded-[100%] bg-black/40 blur-2xl"
            animate={{ scaleX: [1.05, 0.85, 1.05], opacity: [0.4, 0.2, 0.4] }}
            transition={FLOAT}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
