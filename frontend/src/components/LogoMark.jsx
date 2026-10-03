import zlogo from "@/assets/zlogo.png";

export default function LogoMark({ className = "w-8 h-8" }) {
  return (
    <img
      src={zlogo}
      alt="ZEV SHOP"
      draggable="false"
      className={`${className} object-contain select-none`}
    />
  );
}
