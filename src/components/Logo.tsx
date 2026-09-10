import { Link } from "react-router-dom";

export function LogoMark({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect width="32" height="32" rx="7" className="fill-fg" />
      <g className="fill-canvas">
        <rect x="9" y="11" width="5" height="12" rx="1" />
        <rect x="11" y="7" width="1" height="19" />
        <rect x="18" y="8" width="5" height="9" rx="1" />
        <rect x="20" y="5" width="1" height="15" />
      </g>
    </svg>
  );
}

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight text-fg">
      <LogoMark />
      <span className="text-[17px]">Coinpad</span>
    </Link>
  );
}
