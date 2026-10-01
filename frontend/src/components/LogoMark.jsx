export default function LogoMark({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path
        d="M32 5 55 18.5v27L32 59 9 45.5v-27L32 5Z"
        stroke="#00F0FF"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M17 26.5c5-4.5 9-4.5 15 0s10 4.5 15 0"
        stroke="#00F0FF"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M17 37.5c5-4.5 9-4.5 15 0s10 4.5 15 0"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
