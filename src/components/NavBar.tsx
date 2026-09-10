import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const links = [
  { label: "Markets", to: "/" },
  { label: "Charts", to: "/analytics" },
  { label: "Glossary", to: "/terms" },
];

const EASE = "ease-[cubic-bezier(0.2,0.8,0.2,1)]";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const headerRef = useRef<HTMLElement>(null);

  // Close the mobile menu after navigating.
  useEffect(() => setOpen(false), [pathname]);

  // Escape or a tap outside the header closes it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onPointer = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur supports-[backdrop-filter]:bg-canvas/80"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-8 px-4 sm:px-6">
        <Logo />

        <nav className="hidden h-full items-stretch gap-6 md:flex" aria-label="Main">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) =>
                `-mb-px flex items-center border-b-2 text-sm transition-colors ${
                  isActive ? "border-fg text-fg" : "border-transparent text-muted hover:text-fg"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            className="grid size-8 place-items-center rounded-md text-muted hover:bg-sunken hover:text-fg md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {/* Both icons stay mounted so one can rotate out as the other rotates in. */}
            <span className="relative size-[18px]">
              <Menu
                size={18}
                className={`absolute inset-0 transition duration-200 ${EASE} motion-reduce:transition-none ${
                  open ? "scale-50 rotate-90 opacity-0" : ""
                }`}
              />
              <X
                size={18}
                className={`absolute inset-0 transition duration-200 ${EASE} motion-reduce:transition-none ${
                  open ? "" : "scale-50 -rotate-90 opacity-0"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Always mounted so it can animate closed. Transitioning grid rows from
          0fr to 1fr animates to the content's natural height without measuring it;
          `inert` keeps the collapsed links out of the tab order and away from screen readers. */}
      <div
        id="mobile-nav"
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-300 ${EASE} motion-reduce:transition-none md:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <nav className="border-t border-line px-4 py-2" aria-label="Main">
            {links.map((link, i) => (
              <NavLink
                key={link.to}
                to={link.to}
                end
                // Stagger the links in on open; drop them together on close.
                style={{ transitionDelay: open ? `${80 + i * 40}ms` : "0ms" }}
                className={({ isActive }) =>
                  `block rounded-md px-2 py-2.5 text-sm transition duration-300 ${EASE} motion-reduce:transition-none ${
                    open ? "translate-y-0 opacity-100" : "-translate-y-1.5 opacity-0"
                  } ${isActive ? "bg-sunken font-medium text-fg" : "text-muted hover:text-fg"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
