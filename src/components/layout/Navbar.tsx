import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";

const NAV = [
  { label: "Главная", href: "/" },
  { label: "О нас", href: "/about" },
  { label: "Услуги", href: "/services" },
  { label: "Каталог", href: "/catalog" },
  { label: "Портфолио", href: "/portfolio" },
  { label: "Статьи", href: "/blog" },
  { label: "Контакты", href: "/contacts" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(13,13,13,0.96)"
          : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      <div className="container mx-auto px-6 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span
            className="font-orbitron font-black text-xl tracking-widest"
            style={{ color: "var(--razpc-yellow)" }}
          >
            RAZ
          </span>
          <span className="font-orbitron font-black text-xl tracking-widest text-white">PC</span>
          <span
            className="hidden sm:block text-[10px] font-montserrat uppercase tracking-[0.3em] ml-1 opacity-50 mt-1"
            style={{ color: "var(--razpc-white)" }}
          >
            Краснодар
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="px-4 py-2 text-xs font-montserrat font-medium uppercase tracking-widest transition-colors duration-200"
              style={{
                color: location.pathname === item.href ? "var(--razpc-yellow)" : "rgba(245,245,245,0.65)",
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== item.href)
                  (e.currentTarget as HTMLElement).style.color = "var(--razpc-white)";
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.href)
                  (e.currentTarget as HTMLElement).style.color = "rgba(245,245,245,0.65)";
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link to="/contacts" className="btn-primary text-xs px-5 py-2.5">
            Оставить заявку
          </Link>
        </div>

        {/* Burger */}
        <button
          className="lg:hidden p-2 text-white"
          onClick={() => setOpen(!open)}
          aria-label="Меню"
        >
          <Icon name={open ? "X" : "Menu"} size={22} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="lg:hidden"
          style={{
            background: "rgba(13,13,13,0.98)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid var(--razpc-border)",
          }}
        >
          <nav className="container mx-auto px-6 py-6 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="py-3 text-sm font-montserrat font-medium uppercase tracking-widest border-b"
                style={{
                  color: location.pathname === item.href ? "var(--razpc-yellow)" : "var(--razpc-white)",
                  borderColor: "var(--razpc-border)",
                }}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/contacts" className="btn-primary mt-4 text-xs py-3">
              Оставить заявку
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
