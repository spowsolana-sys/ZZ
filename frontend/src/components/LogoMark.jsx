import zlogo from "@/assets/zlogo.png";
import zlogoWhite from "@/assets/zlogo-white.png";

/*
 * Logo Z — variant : "dark" (noir, pour fonds clairs) | "light" (blanc, pour
 * fonds sombres — mode immersif du header / écran d'introduction campagne).
 */
export default function LogoMark({ className = "w-8 h-8", variant = "dark" }) {
  return (
    <img
      src={variant === "light" ? zlogoWhite : zlogo}
      alt="ZEV SHOP"
      draggable="false"
      className={`${className} object-contain select-none`}
    />
  );
}
