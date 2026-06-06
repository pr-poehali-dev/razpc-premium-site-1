import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "@/lib/api";
import Icon from "@/components/ui/icon";

type Tab = "orders" | "products" | "services" | "portfolio" | "reviews" | "content" | "articles";

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

  // ── LOGIN SCREEN ──────────────────────────────────────────────────────────
  if (!token) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-4"
        style={{ background: "var(--razpc-black)", fontFamily: "Montserrat, sans-serif" }}
      >
        {/* Back */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xs mb-10"
          style={{ color: "var(--razpc-muted)" }}
        >
          <Icon name="ArrowLeft" size={14} />
          Вернуться на сайт
        </Link>

        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="font-orbitron font-black text-3xl mb-1">
              <span style={{ color: "var(--razpc-yellow)" }}>RAZ</span>
              <span className="text-white">PC</span>
            </div>
            <div
              className="text-[11px] font-orbitron uppercase tracking-[0.4em] mt-1"
              style={{ color: "var(--razpc-muted)" }}
            >
              Панель управления
            </div>
          </div>

          <div
            className="border p-8"
            style={{ background: "var(--razpc-card)", borderColor: "var(--razpc-border)" }}
          >
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
              <div
                className="mb-4 px-4 py-3 text-sm font-montserrat"
                style={{ background: "rgba(255,85,85,0.08)", border: "1px solid rgba(255,85,85,0.2)", color: "#ff6b6b" }}
              >
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

  // ── TABS CONFIG ───────────────────────────────────────────────────────────
  const TABS: { id: Tab; label: string; icon: string; desc: string }[] = [
    { id: "orders",    label: "Заявки",     icon: "Inbox",       desc: "Входящие обращения клиентов" },
    { id: "products",  label: "Каталог",    icon: "Monitor",     desc: "Товары, цены, характеристики" },
    { id: "services",  label: "Услуги",     icon: "Wrench",      desc: "Виды работ и цены" },
    { id: "portfolio", label: "Портфолио",  icon: "Image",       desc: "Выполненные сборки" },
    { id: "reviews",   label: "Отзывы",     icon: "MessageSquare", desc: "Отзывы клиентов" },
    { id: "content",   label: "Контент",    icon: "FileText",    desc: "Тексты, контакты, Hero" },
    { id: "articles",  label: "Статьи",     icon: "BookOpen",    desc: "Блог и SEO-статьи" },
  ];

  // ── MAIN LAYOUT ───────────────────────────────────────────────────────────
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
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs font-montserrat px-3 py-1.5"
            style={{ color: "var(--razpc-muted)" }}
          >
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
            </button>
          ))}
        </aside>

        {/* Mobile tabs */}
        <div
          className="md:hidden flex overflow-x-auto gap-1 px-4 py-2"
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

        {/* Content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {tab === "orders"    && <OrdersTab token={token} />}
            {tab === "products"  && <ProductsTab token={token} />}
            {tab === "services"  && <ServicesTab token={token} />}
            {tab === "portfolio" && <PortfolioTab token={token} />}
            {tab === "reviews"   && <ReviewsTab token={token} />}
            {tab === "content"   && <ContentTab token={token} />}
            {tab === "articles"  && <ArticlesTab token={token} />}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SHARED UI
══════════════════════════════════════════════════════════════════ */
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="border p-6 mb-4" style={{ background: "var(--razpc-card)", borderColor: "var(--razpc-border)" }}>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-orbitron uppercase tracking-widest mb-1.5" style={{ color: "var(--razpc-muted)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, type = "text", placeholder = "" }: {
  value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 text-sm text-white outline-none font-montserrat"
      style={{ background: "var(--razpc-surface)", border: "1px solid var(--razpc-border)" }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,214,0,0.4)")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--razpc-border)")}
    />
  );
}

function Textarea({ value, onChange, rows = 3, placeholder = "" }: {
  value: string; onChange: (v: string) => void; rows?: number; placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2.5 text-sm text-white outline-none font-montserrat resize-none"
      style={{ background: "var(--razpc-surface)", border: "1px solid var(--razpc-border)" }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,214,0,0.4)")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--razpc-border)")}
    />
  );
}

function Select({ value, onChange, options }: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 text-sm text-white outline-none font-montserrat"
      style={{ background: "var(--razpc-surface)", border: "1px solid var(--razpc-border)" }}
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function SaveBtn({ onClick, loading, label = "Сохранить" }: { onClick: () => void; loading?: boolean; label?: string }) {
  return (
    <button onClick={onClick} disabled={loading} className="btn-primary text-xs px-6 py-2.5">
      {loading ? (
        <span className="flex items-center gap-2"><Icon name="Loader2" size={13} className="animate-spin" /> Сохранение...</span>
      ) : label}
    </button>
  );
}

function CancelBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="btn-outline text-xs px-5 py-2.5">Отмена</button>
  );
}

function Toast({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <span
      className="text-xs font-montserrat px-3 py-1.5"
      style={{ background: "rgba(255,214,0,0.1)", color: "var(--razpc-yellow)", border: "1px solid rgba(255,214,0,0.2)" }}
    >
      ✓ {msg}
    </span>
  );
}

function PageTitle({ title, count, action }: { title: string; count?: number; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
      <h2 className="font-orbitron font-bold text-xl text-white">
        {title}{count !== undefined ? <span className="text-base ml-2 font-normal" style={{ color: "var(--razpc-muted)" }}>({count})</span> : null}
      </h2>
      {action}
    </div>
  );
}

function EditForm({ title, onSave, onCancel, saving, children }: {
  title: string; onSave: () => void; onCancel: () => void; saving: boolean; children: React.ReactNode;
}) {
  return (
    <Card>
      <h3 className="font-orbitron font-bold text-base text-white mb-5">{title}</h3>
      <div className="grid sm:grid-cols-2 gap-4">{children}</div>
      <div className="flex items-center gap-3 mt-5">
        <SaveBtn onClick={onSave} loading={saving} />
        <CancelBtn onClick={onCancel} />
      </div>
    </Card>
  );
}

function RowItem({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div
      className="flex items-center justify-between gap-4 px-5 py-4 border mb-1.5"
      style={{ background: "var(--razpc-card)", borderColor: "var(--razpc-border)" }}
    >
      <div className="flex-1 min-w-0">{left}</div>
      <div className="flex gap-2 shrink-0">{right}</div>
    </div>
  );
}

function EditBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="btn-outline text-xs px-3 py-1.5">Изменить</button>
  );
}

function HideBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 text-xs font-orbitron uppercase border transition-colors"
      style={{ borderColor: "rgba(255,85,85,0.25)", color: "rgba(255,85,85,0.6)" }}
    >
      Скрыть
    </button>
  );
}

function Badge({ label, color = "yellow" }: { label: string; color?: "yellow" | "green" | "red" | "gray" }) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    yellow: { bg: "rgba(255,214,0,0.08)", text: "var(--razpc-yellow)", border: "rgba(255,214,0,0.2)" },
    green:  { bg: "rgba(76,175,80,0.08)", text: "#4CAF50", border: "rgba(76,175,80,0.2)" },
    red:    { bg: "rgba(255,85,85,0.08)", text: "#ff6b6b", border: "rgba(255,85,85,0.2)" },
    gray:   { bg: "rgba(255,255,255,0.04)", text: "var(--razpc-muted)", border: "var(--razpc-border)" },
  };
  const c = colors[color];
  return (
    <span
      className="text-[10px] font-orbitron uppercase tracking-widest px-2 py-0.5"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      {label}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ORDERS
══════════════════════════════════════════════════════════════════ */
interface Order {
  id: number; name: string; phone: string; email: string;
  message: string; service: string; product_name: string;
  status: string; manager_note: string; created_at: string;
}
const ORDER_STATUSES = [
  { value: "new", label: "🟡 Новая" },
  { value: "in_progress", label: "🔵 В работе" },
  { value: "done", label: "🟢 Выполнена" },
  { value: "cancelled", label: "⚫ Отменена" },
];
const STATUS_COLOR: Record<string, "yellow" | "green" | "red" | "gray"> = {
  new: "yellow", in_progress: "yellow", done: "green", cancelled: "gray",
};

function OrdersTab({ token }: { token: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [saving, setSaving] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [statuses, setStatuses] = useState<Record<number, string>>({});
  const [msg, setMsg] = useState("");

  const load = useCallback(() => {
    adminApi.getOrders(token).then((data: Order[]) => {
      setOrders(data);
      const n: Record<number, string> = {};
      const s: Record<number, string> = {};
      data.forEach((o) => { n[o.id] = o.manager_note || ""; s[o.id] = o.status; });
      setNotes(n); setStatuses(s);
    }).catch(() => {});
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const save = async (id: number) => {
    setSaving(id);
    try {
      await adminApi.updateOrder(token, id, { status: statuses[id], manager_note: notes[id] });
      setMsg("Сохранено"); setTimeout(() => setMsg(""), 2500);
    } finally { setSaving(null); }
  };

  return (
    <div>
      <PageTitle
        title="Заявки клиентов"
        count={orders.length}
        action={
          <div className="flex items-center gap-3">
            <Toast msg={msg} />
            <button onClick={load} className="btn-outline text-xs px-4 py-2">
              <Icon name="RefreshCw" size={12} className="mr-1.5 inline" />Обновить
            </button>
          </div>
        }
      />

      {orders.length === 0 && (
        <div className="text-center py-16 font-montserrat text-sm" style={{ color: "var(--razpc-muted)" }}>
          Заявок пока нет
        </div>
      )}

      {orders.map((o) => (
        <Card key={o.id}>
          <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-orbitron font-bold text-sm text-white">#{o.id} — {o.name}</span>
                <Badge label={ORDER_STATUSES.find(s => s.value === o.status)?.label.replace(/^\S+\s/, "") || o.status} color={STATUS_COLOR[o.status] || "gray"} />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-montserrat" style={{ color: "var(--razpc-muted)" }}>
                {o.phone && <span>📞 {o.phone}</span>}
                {o.email && <span>✉️ {o.email}</span>}
                {o.service && <span>🔧 {o.service}</span>}
                {o.product_name && <span>🖥️ {o.product_name}</span>}
                <span>🕐 {new Date(o.created_at).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              {o.message && (
                <p className="mt-2 text-sm font-montserrat p-3" style={{ background: "var(--razpc-surface)", color: "rgba(245,245,245,0.65)" }}>
                  {o.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Статус">
              <Select
                value={statuses[o.id] || o.status}
                onChange={(v) => setStatuses({ ...statuses, [o.id]: v })}
                options={ORDER_STATUSES}
              />
            </Field>
            <Field label="Заметка менеджера">
              <Input value={notes[o.id] || ""} onChange={(v) => setNotes({ ...notes, [o.id]: v })} placeholder="Внутренняя заметка..." />
            </Field>
          </div>
          <div className="mt-3 flex justify-end">
            <SaveBtn onClick={() => save(o.id)} loading={saving === o.id} />
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PRODUCTS
══════════════════════════════════════════════════════════════════ */
interface Product {
  id: number; name: string; slug: string; short_description: string; description: string;
  price: number; old_price: number | null; status: string; image_url: string | null;
  is_featured: boolean; is_active: boolean; cat_name: string; category_id: number | null;
  specs: Record<string, string> | string; fps_data: Record<string, string> | string; sort_order: number;
}

function ProductsTab({ token }: { token: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Product>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(() => adminApi.getProducts(token).then(setProducts).catch(() => {}), [token]);
  useEffect(() => { load(); }, [load]);

  const F = (key: keyof Product) => (v: string) => setForm(f => ({ ...f, [key]: v }));
  const isNew = editing === -1;

  const save = async () => {
    setSaving(true);
    try {
      const data = {
        ...form,
        specs: (() => { try { return typeof form.specs === "string" ? JSON.parse(form.specs || "{}") : form.specs; } catch { return {}; } })(),
        fps_data: (() => { try { return typeof form.fps_data === "string" ? JSON.parse(form.fps_data || "{}") : form.fps_data; } catch { return {}; } })(),
      };
      if (isNew) await adminApi.createProduct(token, data);
      else await adminApi.updateProduct(token, editing!, data);
      setMsg("Сохранено"); setTimeout(() => setMsg(""), 2500);
      setEditing(null); load();
    } catch (e) { setMsg("Ошибка: " + String(e)); }
    finally { setSaving(false); }
  };

  const startEdit = (p: Product) => {
    setEditing(p.id);
    setForm({
      ...p,
      specs: typeof p.specs === "object" ? JSON.stringify(p.specs || {}, null, 2) : p.specs,
      fps_data: typeof p.fps_data === "object" ? JSON.stringify(p.fps_data || {}, null, 2) : p.fps_data,
    });
  };

  return (
    <div>
      <PageTitle
        title="Каталог товаров"
        count={products.length}
        action={
          <div className="flex items-center gap-3">
            <Toast msg={msg} />
            <button onClick={() => { setEditing(-1); setForm({ name: "", slug: "", short_description: "", price: 0, status: "in_stock", is_featured: false, is_active: true, specs: "{}", fps_data: "{}", sort_order: 0 }); }} className="btn-primary text-xs px-5 py-2.5">
              + Добавить товар
            </button>
          </div>
        }
      />

      {editing !== null && (
        <EditForm title={isNew ? "Новый товар" : "Редактировать товар"} onSave={save} onCancel={() => setEditing(null)} saving={saving}>
          <Field label="Название"><Input value={String(form.name || "")} onChange={F("name")} /></Field>
          <Field label="Slug (URL-адрес)"><Input value={String(form.slug || "")} onChange={F("slug")} placeholder="razpc-striker" /></Field>
          <Field label="Цена (₽)"><Input type="number" value={String(form.price || "")} onChange={(v) => setForm(f => ({ ...f, price: Number(v) }))} /></Field>
          <Field label="Старая цена (₽)"><Input type="number" value={String(form.old_price || "")} onChange={(v) => setForm(f => ({ ...f, old_price: Number(v) || null }))} /></Field>
          <Field label="URL фотографии"><Input value={String(form.image_url || "")} onChange={F("image_url")} placeholder="https://..." /></Field>
          <Field label="Статус">
            <Select value={String(form.status || "in_stock")} onChange={F("status")} options={[
              { value: "in_stock", label: "В наличии" },
              { value: "order", label: "Под заказ" },
              { value: "sold", label: "Продан" },
            ]} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Краткое описание"><Textarea value={String(form.short_description || "")} onChange={F("short_description")} rows={2} /></Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Полное описание"><Textarea value={String(form.description || "")} onChange={F("description")} rows={3} /></Field>
          </div>
          <div className="sm:col-span-2">
            <Field label='Характеристики JSON ({"cpu":"...", "gpu":"...", "ram":"...", "storage":"...", "cooling":"...", "psu":"...", "case":"..."})'>
              <Textarea value={String(form.specs || "{}")} onChange={F("specs")} rows={5} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label='FPS данные JSON ({"cs2":"350+ FPS", "cyberpunk_2077":"165 FPS"})'>
              <Textarea value={String(form.fps_data || "{}")} onChange={F("fps_data")} rows={3} />
            </Field>
          </div>
          <div className="flex items-center gap-5 sm:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-montserrat text-white">
              <input type="checkbox" checked={!!form.is_featured} onChange={(e) => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="w-4 h-4 accent-yellow-400" />
              Показывать на главной
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm font-montserrat text-white">
              <input type="checkbox" checked={form.is_active !== false} onChange={(e) => setForm(f => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-yellow-400" />
              Активен (виден на сайте)
            </label>
          </div>
        </EditForm>
      )}

      {products.map((p) => (
        <RowItem key={p.id}
          left={
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="font-orbitron font-bold text-sm text-white">{p.name}</span>
                {!p.is_active && <Badge label="Скрыт" color="red" />}
                {p.is_featured && <Badge label="На главной" color="yellow" />}
                {p.cat_name && <Badge label={p.cat_name} color="gray" />}
              </div>
              <div className="text-xs font-montserrat" style={{ color: "var(--razpc-muted)" }}>
                {Number(p.price).toLocaleString("ru-RU")} ₽ · {p.status === "in_stock" ? "В наличии" : "Под заказ"}
              </div>
            </div>
          }
          right={
            <>
              <EditBtn onClick={() => startEdit(p)} />
              <HideBtn onClick={async () => { await adminApi.deleteProduct(token, p.id); load(); }} />
            </>
          }
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SERVICES
══════════════════════════════════════════════════════════════════ */
interface ServiceItem {
  id: number; name: string; slug: string; short_description: string;
  description: string; icon: string; image_url?: string; price_from: number | null; is_active: boolean; sort_order: number;
}

function ServicesTab({ token }: { token: string }) {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<ServiceItem>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(() => adminApi.getServices(token).then(setServices).catch(() => {}), [token]);
  useEffect(() => { load(); }, [load]);

  const F = (key: keyof ServiceItem) => (v: string) => setForm(f => ({ ...f, [key]: v }));

  const save = async () => {
    setSaving(true);
    try {
      await adminApi.updateService(token, editing!, form);
      setMsg("Сохранено"); setTimeout(() => setMsg(""), 2500);
      setEditing(null); load();
    } finally { setSaving(false); }
  };

  return (
    <div>
      <PageTitle title="Услуги" count={services.length} action={<Toast msg={msg} />} />

      {editing !== null && (
        <EditForm title="Редактировать услугу" onSave={save} onCancel={() => setEditing(null)} saving={saving}>
          <Field label="Название"><Input value={String(form.name || "")} onChange={F("name")} /></Field>
          <Field label="Slug"><Input value={String(form.slug || "")} onChange={F("slug")} /></Field>
          <Field label="Иконка (lucide-react)"><Input value={String(form.icon || "")} onChange={F("icon")} placeholder="Cpu, Zap, Search, Droplets, Settings..." /></Field>
          <Field label="Цена от (₽)"><Input type="number" value={String(form.price_from || "")} onChange={(v) => setForm(f => ({ ...f, price_from: Number(v) || null }))} /></Field>
          <div className="sm:col-span-2">
            <Field label="Краткое описание (для карточки)"><Textarea value={String(form.short_description || "")} onChange={F("short_description")} /></Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Полное описание (для страницы услуг)"><Textarea value={String(form.description || "")} onChange={F("description")} rows={5} /></Field>
          </div>
          <Field label="URL изображения"><Input value={String(form.image_url || "")} onChange={F("image_url")} placeholder="https://..." /></Field>
        </EditForm>
      )}

      {services.map((s) => (
        <RowItem key={s.id}
          left={
            <div>
              <span className="font-orbitron font-bold text-sm text-white">{s.name}</span>
              {s.price_from && <span className="ml-3 text-xs font-montserrat" style={{ color: "var(--razpc-muted)" }}>от {Number(s.price_from).toLocaleString("ru-RU")} ₽</span>}
            </div>
          }
          right={<EditBtn onClick={() => { setEditing(s.id); setForm({ ...s }); }} />}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PORTFOLIO
══════════════════════════════════════════════════════════════════ */
interface PortfolioItem {
  id: number; title: string; client_task: string; specs: string;
  image_url: string | null; category: string; is_active: boolean; sort_order: number;
}

function PortfolioTab({ token }: { token: string }) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<PortfolioItem>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(() => adminApi.getPortfolio(token).then(setItems).catch(() => {}), [token]);
  useEffect(() => { load(); }, [load]);

  const F = (key: keyof PortfolioItem) => (v: string) => setForm(f => ({ ...f, [key]: v }));
  const isNew = editing === -1;

  const save = async () => {
    setSaving(true);
    try {
      if (isNew) await adminApi.createPortfolio(token, form);
      else await adminApi.updatePortfolio(token, editing!, form);
      setMsg("Сохранено"); setTimeout(() => setMsg(""), 2500);
      setEditing(null); load();
    } finally { setSaving(false); }
  };

  return (
    <div>
      <PageTitle
        title="Портфолио"
        count={items.length}
        action={
          <div className="flex items-center gap-3">
            <Toast msg={msg} />
            <button onClick={() => { setEditing(-1); setForm({ title: "", client_task: "", specs: "", image_url: "", category: "", is_active: true, sort_order: 0 }); }} className="btn-primary text-xs px-5 py-2.5">
              + Добавить работу
            </button>
          </div>
        }
      />

      {editing !== null && (
        <EditForm title={isNew ? "Новая работа" : "Редактировать работу"} onSave={save} onCancel={() => setEditing(null)} saving={saving}>
          <Field label="Название проекта"><Input value={String(form.title || "")} onChange={F("title")} placeholder="RAZPC OBSIDIAN" /></Field>
          <Field label="Категория"><Input value={String(form.category || "")} onChange={F("category")} placeholder="Gaming, Premium, Workstation..." /></Field>
          <Field label="URL фотографии"><Input value={String(form.image_url || "")} onChange={F("image_url")} placeholder="https://..." /></Field>
          <Field label="Характеристики (строка)"><Input value={String(form.specs || "")} onChange={F("specs")} placeholder="RTX 4090 / i9-14900K / 64GB / Custom Loop" /></Field>
          <div className="sm:col-span-2">
            <Field label="Задача клиента"><Textarea value={String(form.client_task || "")} onChange={F("client_task")} placeholder="Описание задачи клиента..." /></Field>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-montserrat text-white">
            <input type="checkbox" checked={form.is_active !== false} onChange={(e) => setForm(f => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-yellow-400" />
            Показывать на сайте
          </label>
        </EditForm>
      )}

      {items.map((item) => (
        <RowItem key={item.id}
          left={
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-orbitron font-bold text-sm text-white">{item.title}</span>
                {item.category && <Badge label={item.category} color="gray" />}
                {!item.is_active && <Badge label="Скрыт" color="red" />}
              </div>
              <p className="text-xs font-montserrat mt-0.5" style={{ color: "var(--razpc-muted)" }}>{item.specs}</p>
            </div>
          }
          right={
            <>
              <EditBtn onClick={() => { setEditing(item.id); setForm({ ...item }); }} />
              <HideBtn onClick={async () => { await adminApi.deletePortfolio(token, item.id); load(); }} />
            </>
          }
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   REVIEWS
══════════════════════════════════════════════════════════════════ */
interface ReviewItem {
  id: number; author_name: string; author_city: string;
  text: string; product_name: string | null; is_active: boolean; is_featured: boolean; sort_order: number;
}

function ReviewsTab({ token }: { token: string }) {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<ReviewItem>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(() => adminApi.getReviews(token).then(setItems).catch(() => {}), [token]);
  useEffect(() => { load(); }, [load]);

  const F = (key: keyof ReviewItem) => (v: string) => setForm(f => ({ ...f, [key]: v }));
  const isNew = editing === -1;

  const save = async () => {
    setSaving(true);
    try {
      if (isNew) await adminApi.createReview(token, form);
      else await adminApi.updateReview(token, editing!, form);
      setMsg("Сохранено"); setTimeout(() => setMsg(""), 2500);
      setEditing(null); load();
    } finally { setSaving(false); }
  };

  return (
    <div>
      <PageTitle
        title="Отзывы"
        count={items.length}
        action={
          <div className="flex items-center gap-3">
            <Toast msg={msg} />
            <button onClick={() => { setEditing(-1); setForm({ author_name: "", author_city: "", text: "", product_name: "", is_active: true, is_featured: false, sort_order: 0 }); }} className="btn-primary text-xs px-5 py-2.5">
              + Добавить отзыв
            </button>
          </div>
        }
      />

      {editing !== null && (
        <EditForm title={isNew ? "Новый отзыв" : "Редактировать отзыв"} onSave={save} onCancel={() => setEditing(null)} saving={saving}>
          <Field label="Имя клиента"><Input value={String(form.author_name || "")} onChange={F("author_name")} /></Field>
          <Field label="Город"><Input value={String(form.author_city || "")} onChange={F("author_city")} placeholder="Краснодар" /></Field>
          <Field label="Товар (опционально)"><Input value={String(form.product_name || "")} onChange={F("product_name")} placeholder="RAZPC STRIKER" /></Field>
          <div className="sm:col-span-2">
            <Field label="Текст отзыва"><Textarea value={String(form.text || "")} onChange={F("text")} rows={4} /></Field>
          </div>
          <div className="flex items-center gap-5 sm:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-montserrat text-white">
              <input type="checkbox" checked={!!form.is_featured} onChange={(e) => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="w-4 h-4 accent-yellow-400" />
              Показывать на главной
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm font-montserrat text-white">
              <input type="checkbox" checked={form.is_active !== false} onChange={(e) => setForm(f => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-yellow-400" />
              Активен
            </label>
          </div>
        </EditForm>
      )}

      {items.map((r) => (
        <RowItem key={r.id}
          left={
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="font-orbitron font-bold text-sm text-white">{r.author_name}</span>
                {r.author_city && <span className="text-xs font-montserrat" style={{ color: "var(--razpc-muted)" }}>{r.author_city}</span>}
                {r.is_featured && <Badge label="На главной" color="yellow" />}
                {!r.is_active && <Badge label="Скрыт" color="red" />}
              </div>
              <p className="text-xs font-montserrat line-clamp-1" style={{ color: "rgba(245,245,245,0.5)" }}>{r.text}</p>
            </div>
          }
          right={
            <>
              <EditBtn onClick={() => { setEditing(r.id); setForm({ ...r }); }} />
              <HideBtn onClick={async () => { await adminApi.deleteReview(token, r.id); load(); }} />
            </>
          }
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CONTENT (тексты, контакты, Hero)
══════════════════════════════════════════════════════════════════ */
interface ContentItem { id: number; key: string; value: string; description: string; }

const CONTENT_GROUPS: { label: string; keys: string[] }[] = [
  { label: "Главная страница (Hero)", keys: ["hero_title", "hero_slogan", "hero_subtitle"] },
  { label: "Контакты", keys: ["phone", "email", "address", "work_hours", "telegram", "whatsapp", "vk"] },
];

function ContentTab({ token }: { token: string }) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [vals, setVals] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(() => {
    adminApi.getContent(token).then((data: ContentItem[]) => {
      setItems(data);
      const v: Record<string, string> = {};
      data.forEach((c) => { v[c.key] = c.value || ""; });
      setVals(v);
    }).catch(() => {});
  }, [token]);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    try {
      await adminApi.updateContent(token, vals);
      setMsg("Сохранено"); setTimeout(() => setMsg(""), 2500);
    } finally { setSaving(false); }
  };

  const otherItems = items.filter(c => !CONTENT_GROUPS.flatMap(g => g.keys).includes(c.key));

  return (
    <div>
      <PageTitle title="Контент сайта" action={<div className="flex items-center gap-3"><Toast msg={msg} /><SaveBtn onClick={save} loading={saving} label="Сохранить всё" /></div>} />

      {CONTENT_GROUPS.map((group) => (
        <Card key={group.label}>
          <h3 className="font-orbitron font-bold text-sm text-white mb-4">{group.label}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {group.keys.map((key) => {
              const item = items.find(c => c.key === key);
              const label = item?.description || key;
              const isLong = ["hero_subtitle", "hero_slogan"].includes(key);
              return (
                <div key={key} className={isLong ? "sm:col-span-2" : ""}>
                  <Field label={label}>
                    {isLong
                      ? <Textarea value={vals[key] || ""} onChange={(v) => setVals(prev => ({ ...prev, [key]: v }))} rows={2} />
                      : <Input value={vals[key] || ""} onChange={(v) => setVals(prev => ({ ...prev, [key]: v }))} />
                    }
                  </Field>
                </div>
              );
            })}
          </div>
        </Card>
      ))}

      {otherItems.length > 0 && (
        <Card>
          <h3 className="font-orbitron font-bold text-sm text-white mb-4">Прочее</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {otherItems.map((c) => (
              <Field key={c.key} label={`${c.description || c.key}`}>
                <Input value={vals[c.key] || ""} onChange={(v) => setVals(prev => ({ ...prev, [c.key]: v }))} />
              </Field>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ARTICLES
══════════════════════════════════════════════════════════════════ */
interface ArticleItem {
  id: number; title: string; slug: string; excerpt: string; content: string;
  image_url: string | null; seo_title: string; seo_description: string; is_published: boolean; sort_order: number;
}

function ArticlesTab({ token }: { token: string }) {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<ArticleItem>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(() => adminApi.getArticles(token).then(setArticles).catch(() => {}), [token]);
  useEffect(() => { load(); }, [load]);

  const F = (key: keyof ArticleItem) => (v: string) => setForm(f => ({ ...f, [key]: v }));
  const isNew = editing === -1;

  const save = async () => {
    setSaving(true);
    try {
      if (isNew) await adminApi.createArticle(token, form);
      else await adminApi.updateArticle(token, editing!, form);
      setMsg("Сохранено"); setTimeout(() => setMsg(""), 2500);
      setEditing(null); load();
    } finally { setSaving(false); }
  };

  return (
    <div>
      <PageTitle
        title="Статьи блога"
        count={articles.length}
        action={
          <div className="flex items-center gap-3">
            <Toast msg={msg} />
            <button onClick={() => { setEditing(-1); setForm({ title: "", slug: "", excerpt: "", content: "", image_url: "", seo_title: "", seo_description: "", is_published: false, sort_order: 0 }); }} className="btn-primary text-xs px-5 py-2.5">
              + Новая статья
            </button>
          </div>
        }
      />

      {editing !== null && (
        <EditForm title={isNew ? "Новая статья" : "Редактировать статью"} onSave={save} onCancel={() => setEditing(null)} saving={saving}>
          <Field label="Заголовок"><Input value={String(form.title || "")} onChange={F("title")} /></Field>
          <Field label="Slug (URL)"><Input value={String(form.slug || "")} onChange={F("slug")} placeholder="kak-vybrat-videokartu" /></Field>
          <Field label="URL обложки"><Input value={String(form.image_url || "")} onChange={F("image_url")} placeholder="https://..." /></Field>
          <Field label="SEO заголовок"><Input value={String(form.seo_title || "")} onChange={F("seo_title")} /></Field>
          <div className="sm:col-span-2">
            <Field label="SEO описание"><Textarea value={String(form.seo_description || "")} onChange={F("seo_description")} rows={2} /></Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Анонс статьи"><Textarea value={String(form.excerpt || "")} onChange={F("excerpt")} rows={2} /></Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Текст статьи (HTML или Markdown)"><Textarea value={String(form.content || "")} onChange={F("content")} rows={10} /></Field>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-montserrat text-white">
            <input type="checkbox" checked={!!form.is_published} onChange={(e) => setForm(f => ({ ...f, is_published: e.target.checked }))} className="w-4 h-4 accent-yellow-400" />
            Опубликована (видна на сайте)
          </label>
        </EditForm>
      )}

      {articles.length === 0 && (
        <div className="text-center py-12 font-montserrat text-sm" style={{ color: "var(--razpc-muted)" }}>Статей пока нет</div>
      )}

      {articles.map((a) => (
        <RowItem key={a.id}
          left={
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-orbitron font-bold text-sm text-white">{a.title}</span>
                <Badge label={a.is_published ? "Опубликована" : "Черновик"} color={a.is_published ? "green" : "gray"} />
              </div>
              <span className="text-xs font-montserrat" style={{ color: "var(--razpc-muted)" }}>{a.slug}</span>
            </div>
          }
          right={<EditBtn onClick={() => { setEditing(a.id); setForm({ ...a }); }} />}
        />
      ))}
    </div>
  );
}