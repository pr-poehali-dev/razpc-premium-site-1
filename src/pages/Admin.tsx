import { useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "@/lib/api";
import Icon from "@/components/ui/icon";
import { OrdersTab, ServicesTab, ReviewsTab, ContentTab, ArticlesTab } from "@/admin/AdminTabs";
import { ProductsTab, PortfolioTab } from "@/admin/AdminProducts";
import DesignEditor from "@/admin/DesignEditor";

type Tab = "orders" | "products" | "services" | "portfolio" | "reviews" | "content" | "articles" | "design";

const TABS: { id: Tab; label: string; icon: string; desc: string }[] = [
  { id: "design",    label: "Конструктор", icon: "Wand2",         desc: "Визуальный редактор" },
  { id: "orders",    label: "Заявки",      icon: "Inbox",         desc: "Входящие обращения" },
  { id: "products",  label: "Каталог",     icon: "Monitor",       desc: "Товары и цены" },
  { id: "services",  label: "Услуги",      icon: "Wrench",        desc: "Виды работ" },
  { id: "portfolio", label: "Портфолио",   icon: "Image",         desc: "Выполненные сборки" },
  { id: "reviews",   label: "Отзывы",      icon: "MessageSquare", desc: "Отзывы клиентов" },
  { id: "content",   label: "Контент",     icon: "FileText",      desc: "Тексты, контакты" },
  { id: "articles",  label: "Статьи",      icon: "BookOpen",      desc: "Блог и SEO" },
];

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("razpc_admin_token") || "");
  const [tokenInput, setTokenInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<Tab>("orders");

  const login = async () => {
    if (!tokenInput.trim()) { setAuthError("Введите токен доступа"); return; }
    try {
      await adminApi.getOrders(tokenInput.trim());
      localStorage.setItem("razpc_admin_token", tokenInput.trim());
      setToken(tokenInput.trim());
      setAuthError("");
    } catch {
      setAuthError("Неверный токен. Проверьте и попробуйте снова.");
    }
  };

  const logout = () => {
    localStorage.removeItem("razpc_admin_token");
    setToken("");
    setTokenInput("");
  };

  // ── LOGIN ──────────────────────────────────────────────────────
  if (!token) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-4"
        style={{ background: "var(--razpc-black)", fontFamily: "Montserrat, sans-serif" }}
      >
        <Link to="/" className="flex items-center gap-2 text-xs mb-10" style={{ color: "var(--razpc-muted)" }}>
          <Icon name="ArrowLeft" size={14} />
          Вернуться на сайт
        </Link>

        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="font-orbitron font-black text-3xl mb-1">
              <span style={{ color: "var(--razpc-yellow)" }}>RAZ</span>
              <span className="text-white">PC</span>
            </div>
            <div className="text-[11px] font-orbitron uppercase tracking-[0.4em] mt-1" style={{ color: "var(--razpc-muted)" }}>
              Панель управления
            </div>
          </div>

          <div className="border p-8" style={{ background: "var(--razpc-card)", borderColor: "var(--razpc-border)" }}>
            <h1 className="font-orbitron font-bold text-lg text-white mb-2">Вход</h1>
            <p className="font-montserrat text-sm mb-6" style={{ color: "var(--razpc-muted)" }}>
              Введите токен для доступа к управлению сайтом
            </p>
            <div className="mb-4">
              <label className="block text-[10px] font-orbitron uppercase tracking-widest mb-2" style={{ color: "var(--razpc-muted)" }}>
                Токен доступа
              </label>
              <input
                type="password"
                placeholder="Введите токен..."
                value={tokenInput}
                onChange={(e) => { setTokenInput(e.target.value); setAuthError(""); }}
                onKeyDown={(e) => e.key === "Enter" && login()}
                autoFocus
                className="w-full px-4 py-3 text-sm text-white outline-none font-montserrat"
                style={{ background: "var(--razpc-surface)", border: "1px solid var(--razpc-border)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,214,0,0.4)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--razpc-border)")}
              />
            </div>
            {authError && (
              <div className="mb-4 px-4 py-3 text-sm font-montserrat" style={{ background: "rgba(255,85,85,0.08)", border: "1px solid rgba(255,85,85,0.2)", color: "#ff6b6b" }}>
                {authError}
              </div>
            )}
            <button onClick={login} className="btn-primary w-full py-3.5 text-sm">
              Войти в панель
            </button>
            <p className="text-[11px] text-center mt-4 font-montserrat" style={{ color: "var(--razpc-muted)" }}>
              Токен по умолчанию: <span className="text-white">razpc-admin-2024</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN LAYOUT ────────────────────────────────────────────────
  const isDesign = tab === "design";

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--razpc-black)", fontFamily: "Montserrat, sans-serif" }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-6 h-14 flex-shrink-0"
        style={{ background: "var(--razpc-dark)", borderBottom: "1px solid var(--razpc-border)" }}
      >
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-1">
            <span className="font-orbitron font-black text-lg" style={{ color: "var(--razpc-yellow)" }}>RAZ</span>
            <span className="font-orbitron font-black text-lg text-white">PC</span>
          </Link>
          <div className="w-px h-5" style={{ background: "var(--razpc-border)" }} />
          <span className="text-xs font-orbitron uppercase tracking-widest" style={{ color: "var(--razpc-muted)" }}>
            Панель управления
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-montserrat px-3 py-1.5 transition-colors"
            style={{ color: "var(--razpc-muted)", border: "1px solid var(--razpc-border)" }}
          >
            <Icon name="ExternalLink" size={12} />
            Открыть сайт
          </Link>
          <button onClick={logout} className="flex items-center gap-1.5 text-xs font-montserrat px-3 py-1.5" style={{ color: "var(--razpc-muted)" }}>
            <Icon name="LogOut" size={12} />
            Выйти
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className="w-52 flex-shrink-0 hidden md:flex flex-col py-4"
          style={{ background: "var(--razpc-dark)", borderRight: "1px solid var(--razpc-border)" }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-left transition-all duration-150 mx-2 mb-0.5"
              style={{
                background: tab === t.id ? "rgba(255,214,0,0.08)" : "transparent",
                color: tab === t.id ? "var(--razpc-yellow)" : "var(--razpc-muted)",
                borderLeft: tab === t.id ? "2px solid var(--razpc-yellow)" : "2px solid transparent",
                borderRadius: "2px",
              }}
            >
              <Icon name={t.icon} size={15} />
              <span className="font-medium">{t.label}</span>
              {t.id === "design" && (
                <span
                  className="ml-auto text-[9px] font-orbitron px-1.5 py-0.5"
                  style={{ background: "rgba(255,214,0,0.15)", color: "var(--razpc-yellow)" }}
                >
                  NEW
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* Mobile tabs */}
        <div
          className="md:hidden absolute top-14 left-0 right-0 z-20 flex overflow-x-auto gap-1 px-4 py-2"
          style={{ background: "var(--razpc-dark)", borderBottom: "1px solid var(--razpc-border)" }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 text-xs font-medium"
              style={{
                background: tab === t.id ? "rgba(255,214,0,0.1)" : "transparent",
                color: tab === t.id ? "var(--razpc-yellow)" : "var(--razpc-muted)",
                border: `1px solid ${tab === t.id ? "rgba(255,214,0,0.3)" : "transparent"}`,
              }}
            >
              <Icon name={t.icon} size={13} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content area */}
        {isDesign ? (
          // Design editor takes full remaining space
          <div className="flex-1 overflow-hidden flex flex-col">
            <DesignEditor token={token} />
          </div>
        ) : (
          <main className="flex-1 overflow-auto p-6 lg:p-8">
            <div className="max-w-5xl mx-auto">
              {tab === "orders"    && <OrdersTab    token={token} />}
              {tab === "products"  && <ProductsTab  token={token} />}
              {tab === "services"  && <ServicesTab  token={token} />}
              {tab === "portfolio" && <PortfolioTab token={token} />}
              {tab === "reviews"   && <ReviewsTab   token={token} />}
              {tab === "content"   && <ContentTab   token={token} />}
              {tab === "articles"  && <ArticlesTab  token={token} />}
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
