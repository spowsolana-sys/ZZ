import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

/*
 * Système d'animation premium 2.5D pour les images produits — ZEV SHOP.
 * Aucun modèle 3D : uniquement des transforms GPU (translate/rotate/scale)
 * sur les images 2D existantes, avec une perspective CSS pour l'illusion
 * de profondeur. Réutilisable par TOUTES les chaussures du catalogue
 * (étape produit, hero, cartes) sans code dédié par produit.
 *
 * - useShoeTilt : inclinaison (rotateX/rotateY) + micro-lift pilotés par le
 *   curseur. Valeurs → ressorts amortis : le suivi est fluide ET le retour
 *   au repos se fait naturellement (aucun snap). Actif uniquement au
 *   pointeur fin (desktop) ; tactile = version allégée (idle seul).
 * - ShoeFloat : boucle de lévitation idle (flottement Y + micro-rotation Z
 *   + respiration d'échelle) avec easing naturel.
 * - Performance : aucun calcul de layout par frame (rect mis en cache à
 *   l'entrée du pointeur), ressorts partagés framer-motion (rAF unique),
 *   `prefers-reduced-motion` respecté partout.
 */

const FINE_POINTER =
  typeof window !== "undefined" &&
  window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;

export function useShoeTilt({ maxYaw = 10, maxPitch = 8 } = {}) {
  const reduce = useReducedMotion();
  const enabled = FINE_POINTER && !reduce;
  const rect = useRef(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawHover = useMotionValue(0);
  const rotateX = useSpring(rawX, { stiffness: 55, damping: 15, mass: 0.7 });
  const rotateY = useSpring(rawY, { stiffness: 55, damping: 15, mass: 0.7 });
  const hover = useSpring(rawHover, { stiffness: 55, damping: 15, mass: 0.7 });

  const bind = {
    onPointerEnter: (e) => {
      if (!enabled) return;
      rect.current = e.currentTarget.getBoundingClientRect();
    },
    onPointerMove: (e) => {
      if (!enabled || !rect.current) return;
      const r = rect.current;
      const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) - 0.5;
      const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)) - 0.5;
      rawY.set(px * 2 * maxYaw);
      rawX.set(-py * 2 * maxPitch);
      rawHover.set(1);
    },
    onPointerLeave: () => {
      rect.current = null;
      if (!enabled) return;
      rawX.set(0);
      rawY.set(0);
      rawHover.set(0); // les ressorts ramènent en douceur vers l'anim idle
    },
  };

  return { bind, rotateX, rotateY, hover, enabled };
}

/* Couche d'inclinaison : à placer DANS un parent porteur de `perspective`. */
export function ShoeTiltLayer({ tilt, hoverScale = 0.015, className = "", children }) {
  const scale = useTransform(tilt.hover, (v) => 1 + v * hoverScale);
  return (
    <motion.div
      className={className}
      style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, scale }}
    >
      {children}
    </motion.div>
  );
}

export function ShoeFloat({
  children,
  amplitude = 8,
  rotate = 0.8,
  breathe = 0.012,
  duration = 7,
  className = "",
  style,
}) {
  const reduce = useReducedMotion();
  const on = !reduce;
  return (
    <motion.div
      className={className}
      style={style}
      animate={
        on
          ? {
              y: [-amplitude, amplitude, -amplitude],
              rotate: [-rotate, rotate, -rotate],
              scale: [1, 1 + breathe, 1],
            }
          : { y: 0, rotate: 0, scale: 1 }
      }
      transition={
        on
          ? { duration, repeat: Infinity, ease: "easeInOut" }
          : { duration: 0.3 }
      }
    >
      {children}
    </motion.div>
  );
}
