import black from "../assets/sneaker-black.png";
import white from "../assets/sneaker-white.png";
import aqua from "../assets/sneaker-aqua.png";
import burgundy from "../assets/sneaker-burgundy.png";

/*
 * All four photos share the identical 1200x800 frame, camera angle and
 * rotation. Rendering them stacked in the same container with identical
 * size/position normalizes them; `scale`/`shiftY` only compensate for the
 * baked-in glow halos (white/aqua) so every colorway reads the same size.
 */
export const PRODUCTS = [
  {
    id: "black",
    index: "01",
    name: "TRIPLE BLACK CYBER",
    hex: "#0D0D0D",
    swatch: "radial-gradient(circle at 35% 35%, #2E2E2E, #050505)",
    glow: "rgba(0, 240, 255, 0.30)",
    image: black,
    scale: 1.0,
    shiftY: "0%",
    price: "$180",
    desc: "Stealth matte finish with an integrated TPU exoskeleton and hyper-cyan shock-absorbing air cells.",
  },
  {
    id: "white",
    index: "02",
    name: "HYPER WHITE GLACIER",
    hex: "#F8FAFC",
    swatch: "radial-gradient(circle at 35% 35%, #FFFFFF, #D8DEE6)",
    glow: "rgba(180, 220, 255, 0.22)",
    image: white,
    scale: 0.955,
    shiftY: "0%",
    price: "$185",
    desc: "Pure frost mesh upper paired with an icy translucent shank plate for maximum light reflection.",
  },
  {
    id: "aqua",
    index: "03",
    name: "AQUA WAVEFORM",
    hex: "#00E5FF",
    swatch: "linear-gradient(160deg, #F4F4F4 45%, #19C8DC 100%)",
    glow: "rgba(0, 229, 255, 0.30)",
    image: aqua,
    scale: 0.965,
    shiftY: "0%",
    price: "$190",
    desc: "Electric cyan gradient fade mimicking Pacific swell dynamics with high-vis reflective ribbing.",
  },
  {
    id: "burgundy",
    index: "04",
    name: "BURGUNDY VOLT",
    hex: "#800020",
    swatch: "linear-gradient(160deg, #7A1230 55%, #0A0A0A 100%)",
    glow: "rgba(128, 0, 32, 0.35)",
    image: burgundy,
    scale: 1.0,
    shiftY: "0%",
    price: "$195",
    desc: "Deep wine gradient mesh surrounded by jet-black mudguards and high-tension lacing.",
  },
];

export const DEFAULT_INDEX = 0;

export const SPECS = [
  "TUNED AIR HEMISPHERIC DAMPERS",
  "DUAL-DENSITY TPU ARCH SPINE",
  "MOLDED RIBBED EXOSKELETON CAGE",
  "GRADIENT HEX-MESH UPPER",
];
