import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

export default function AdminFloatButton() {
  return (
    <Link
      to="/admin"
      aria-label="Панель управления"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 16px",
        background: "rgba(13,13,13,0.95)",
        border: "1px solid rgba(255,214,0,0.25)",
        backdropFilter: "blur(12px)",
        color: "rgba(245,245,245,0.6)",
        fontFamily: "Montserrat, sans-serif",
        fontSize: "11px",
        fontWeight: 600,
        textDecoration: "none",
        letterSpacing: "0.05em",
        transition: "all 0.25s ease",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(255,214,0,0.6)";
        el.style.color = "var(--razpc-yellow)";
        el.style.boxShadow = "0 4px 30px rgba(255,214,0,0.15)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(255,214,0,0.25)";
        el.style.color = "rgba(245,245,245,0.6)";
        el.style.boxShadow = "0 4px 24px rgba(0,0,0,0.4)";
      }}
    >
      <Icon name="Settings" size={14} />
      <span>Управление сайтом</span>
    </Link>
  );
}
