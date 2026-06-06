import { useState, useEffect, useCallback } from "react";
import { adminApi } from "@/lib/api";
import Icon from "@/components/ui/icon";

const DEFAULT_TOKEN = "razpc-admin-2024";

type Tab = "orders" | "products" | "services" | "portfolio" | "reviews" | "content" | "articles";

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("razpc_admin_token") || "");
  const [tokenInput, setTokenInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<Tab>("orders");

  const login = async () => {
    try {
      await adminApi.getOrders(tokenInput);
      localStorage.setItem("razpc_admin_token", tokenInput);
      setToken(tokenInput);
      setAuthError("");
    } catch {
      setAuthError("Неверный токен");
    }
  };

  const logout = () => {
    localStorage.removeItem("razpc_admin_token");
    setToken("");
    setTokenInput("");
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--razpc-black)" }}>
        <div className="w-full max-w-sm">
          <div className="font-orbitron font-black text-2xl text-center mb-8">
            <span style={{ color: "var(--razpc-yellow)" }}>RAZ</span>
            <span className="text-white">PC</span>
            <span className="block text-xs text-white tracking-widest mt-1">ADMIN</span>
          </div>
          <div className="border p-8" style={{ background: "var(--razpc-card)", borderColor: "var(--razpc-border)" }}>
            <h1 className="font-orbitron font-bold text-lg text-white mb-6">Вход в панель</h1>
            <input
              type="password"
              placeholder="Admin token"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              className="w-full px-4 py-3 mb-4 font-montserrat text-sm text-white outline-none"
              style={{ background: "var(--razpc-surface)", border: "1px solid var(--razpc-border)" }}
            />
            {authError && <p className="text-sm mb-4" style={{ color: "#ff5555" }}>{authError}</p>}
            <button onClick={login} className="btn-primary w-full py-3">Войти</button>
          </div>
        </div>
      </div>
    );
  }

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "orders", label: "Заявки", icon: "Inbox" },
    { id: "products", label: "Товары", icon: "Monitor" },
    { id: "services", label: "Услуги", icon: "Wrench" },
    { id: "portfolio", label: "Портфолио", icon: "Image" },
    { id: "reviews", label: "Отзывы", icon: "MessageSquare" },
    { id: "content", label: "Контент", icon: "FileText" },
    { id: "articles", label: "Статьи", icon: "BookOpen" },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "var(--razpc-black)", fontFamily: "Montserrat, sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col" style={{ background: "var(--razpc-dark)", borderRight: "1px solid var(--razpc-border)" }}>
        <div className="p-6 border-b" style={{ borderColor: "var(--razpc-border)" }}>
          <div className="font-orbitron font-black text-lg">
            <span style={{ color: "var(--razpc-yellow)" }}>RAZ</span>
            <span className="text-white">PC</span>
          </div>
          <div className="text-[10px] font-orbitron uppercase tracking-widest mt-0.5" style={{ color: "var(--razpc-muted)" }}>Admin Panel</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-left transition-all duration-150"
              style={{
                background: tab === t.id ? "rgba(255,214,0,0.1)" : "transparent",
                color: tab === t.id ? "var(--razpc-yellow)" : "var(--razpc-muted)",
                borderLeft: tab === t.id ? "2px solid var(--razpc-yellow)" : "2px solid transparent",
              }}
            >
              <Icon name={t.icon} size={15} />
              {t.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t" style={{ borderColor: "var(--razpc-border)" }}>
          <button onClick={logout} className="w-full flex items-center gap-2 text-xs py-2 px-3" style={{ color: "var(--razpc-muted)" }}>
            <Icon name="LogOut" size={13} />
            Выйти
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto p-8">
        {tab === "orders" && <OrdersTab token={token} />}
        {tab === "products" && <ProductsTab token={token} />}
        {tab === "services" && <ServicesTab token={token} />}
        {tab === "portfolio" && <PortfolioTab token={token} />}
        {tab === "reviews" && <ReviewsTab token={token} />}
        {tab === "content" && <ContentTab token={token} />}
        {tab === "articles" && <ArticlesTab token={token} />}
      </main>
    </div>
  );
}

/* ── Shared ───────────────────────────────────────────────────── */
function AdminCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="border p-6" style={{ background: "var(--razpc-card)", borderColor: "var(--razpc-border)" }}>
      {children}
    </div>
  );
}

function AdminInput({ label, value, onChange, type = "text", placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest mb-1.5 font-orbitron" style={{ color: "var(--razpc-muted)" }}>{label}</label>
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
    </div>
  );
}

function AdminTextarea({ label, value, onChange, rows = 3, placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest mb-1.5 font-orbitron" style={{ color: "var(--razpc-muted)" }}>{label}</label>
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
    </div>
  );
}

function SaveBtn({ onClick, loading }: { onClick: () => void; loading?: boolean }) {
  return (
    <button onClick={onClick} disabled={loading} className="btn-primary text-xs px-5 py-2.5">
      {loading ? "Сохранение..." : "Сохранить"}
    </button>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="font-orbitron font-bold text-xl text-white mb-6">{title}</h2>;
}

/* ── ORDERS ───────────────────────────────────────────────────── */
interface Order {
  id: number; name: string; phone: string; email: string;
  message: string; service: string; product_name: string;
  status: string; source: string; manager_note: string;
  created_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  new: "Новая", in_progress: "В работе", done: "Выполнена", cancelled: "Отменена",
};
const STATUS_COLORS: Record<string, string> = {
  new: "#FFD600", in_progress: "#4A9EFF", done: "#4CAF50", cancelled: "#888",
};

function OrdersTab({ token }: { token: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [saving, setSaving] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [statuses, setStatuses] = useState<Record<number, string>>({});
  const [msg, setMsg] = useState("");

  const load = useCallback(() => {
    adminApi.getOrders(token).then((data) => {
      setOrders(data);
      const n: Record<number, string> = {};
      const s: Record<number, string> = {};
      data.forEach((o: Order) => { n[o.id] = o.manager_note || ""; s[o.id] = o.status; });
      setNotes(n); setStatuses(s);
    }).catch(() => {});
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const save = async (id: number) => {
    setSaving(id);
    try {
      await adminApi.updateOrder(token, id, { status: statuses[id], manager_note: notes[id] });
      setMsg("Сохранено");
      setTimeout(() => setMsg(""), 2000);
    } finally { setSaving(null); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionTitle title={`Заявки (${orders.length})`} />
        {msg && <span className="text-sm font-montserrat" style={{ color: "var(--razpc-yellow)" }}>{msg}</span>}
        <button onClick={load} className="btn-outline text-xs px-4 py-2">Обновить</button>
      </div>

      <div className="space-y-4">
        {orders.map((o) => (
          <AdminCard key={o.id}>
            <div className="flex items-start justify-between mb-4 gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-orbitron font-bold text-sm text-white">#{o.id} — {o.name}</span>
                  <span
                    className="px-2 py-0.5 text-[10px] font-orbitron uppercase tracking-widest"
                    style={{ color: STATUS_COLORS[o.status] || "#888", border: `1px solid ${STATUS_COLORS[o.status] || "#888"}40`, background: `${STATUS_COLORS[o.status] || "#888"}10` }}
                  >
                    {STATUS_LABELS[o.status] || o.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs font-montserrat" style={{ color: "var(--razpc-muted)" }}>
                  {o.phone && <span>📞 {o.phone}</span>}
                  {o.email && <span>✉️ {o.email}</span>}
                  {o.service && <span>🔧 {o.service}</span>}
                  {o.product_name && <span>🖥️ {o.product_name}</span>}
                  <span>🕐 {new Date(o.created_at).toLocaleString("ru-RU")}</span>
                </div>
                {o.message && (
                  <p className="mt-2 text-sm font-montserrat" style={{ color: "rgba(245,245,245,0.6)" }}>{o.message}</p>
                )}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-widest mb-1.5 font-orbitron" style={{ color: "var(--razpc-muted)" }}>Статус</label>
                <select
                  value={statuses[o.id] || o.status}
                  onChange={(e) => setStatuses({ ...statuses, [o.id]: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm text-white outline-none font-montserrat"
                  style={{ background: "var(--razpc-surface)", border: "1px solid var(--razpc-border)" }}
                >
                  {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <AdminInput
                label="Заметка менеджера"
                value={notes[o.id] || ""}
                onChange={(v) => setNotes({ ...notes, [o.id]: v })}
                placeholder="Внутренняя заметка..."
              />
            </div>
            <div className="mt-3 flex justify-end">
              <SaveBtn onClick={() => save(o.id)} loading={saving === o.id} />
            </div>
          </AdminCard>
        ))}
        {orders.length === 0 && (
          <p className="text-center py-10 font-montserrat text-sm" style={{ color: "var(--razpc-muted)" }}>Заявок пока нет</p>
        )}
      </div>
    </div>
  );
}

/* ── PRODUCTS ─────────────────────────────────────────────────── */
interface Product {
  id: number; name: string; slug: string; short_description: string;
  price: number; old_price: number | null; status: string;
  image_url: string | null; is_featured: boolean; is_active: boolean;
  cat_name: string; specs: Record<string, string>; fps_data: Record<string, string>;
  sort_order: number; category_id: number | null;
}

function ProductsTab({ token }: { token: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Product>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(() => adminApi.getProducts(token).then(setProducts).catch(() => {}), [token]);
  useEffect(() => { load(); }, [load]);

  const startEdit = (p: Product) => { setEditing(p.id); setForm({ ...p }); };
  const startNew = () => { setEditing(-1); setForm({ name: "", slug: "", short_description: "", price: 0, status: "in_stock", is_featured: false, is_active: true, specs: {}, fps_data: {}, sort_order: 0 }); };

  const save = async () => {
    setSaving(true);
    try {
      const data = {
        ...form,
        specs: typeof form.specs === "string" ? JSON.parse(form.specs || "{}") : form.specs,
        fps_data: typeof form.fps_data === "string" ? JSON.parse(form.fps_data || "{}") : form.fps_data,
      };
      if (editing === -1) await adminApi.createProduct(token, data);
      else await adminApi.updateProduct(token, editing!, data);
      setMsg("Сохранено"); setTimeout(() => setMsg(""), 2000);
      setEditing(null); load();
    } catch (e: unknown) {
      setMsg("Ошибка: " + String(e));
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionTitle title={`Товары (${products.length})`} />
        <div className="flex gap-2 items-center">
          {msg && <span className="text-sm font-montserrat" style={{ color: "var(--razpc-yellow)" }}>{msg}</span>}
          <button onClick={startNew} className="btn-primary text-xs px-5 py-2.5">+ Добавить</button>
        </div>
      </div>

      {editing !== null && (
        <AdminCard>
          <h3 className="font-orbitron font-bold text-base text-white mb-5">{editing === -1 ? "Новый товар" : "Редактировать"}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <AdminInput label="Название" value={form.name || ""} onChange={(v) => setForm({ ...form, name: v })} />
            <AdminInput label="Slug (URL)" value={form.slug || ""} onChange={(v) => setForm({ ...form, slug: v })} />
            <AdminInput label="Цена (₽)" type="number" value={String(form.price || "")} onChange={(v) => setForm({ ...form, price: Number(v) })} />
            <AdminInput label="Старая цена (₽)" type="number" value={String(form.old_price || "")} onChange={(v) => setForm({ ...form, old_price: Number(v) || null })} />
            <AdminInput label="URL изображения" value={form.image_url || ""} onChange={(v) => setForm({ ...form, image_url: v })} />
            <div>
              <label className="block text-xs uppercase tracking-widest mb-1.5 font-orbitron" style={{ color: "var(--razpc-muted)" }}>Статус</label>
              <select value={form.status || "in_stock"} onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2.5 text-sm text-white outline-none font-montserrat"
                style={{ background: "var(--razpc-surface)", border: "1px solid var(--razpc-border)" }}>
                <option value="in_stock">В наличии</option>
                <option value="order">Под заказ</option>
                <option value="sold">Продан</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <AdminTextarea label="Краткое описание" value={form.short_description || ""} onChange={(v) => setForm({ ...form, short_description: v })} />
            </div>
            <div className="sm:col-span-2">
              <AdminTextarea label='Характеристики (JSON) — {"cpu":"...", "gpu":"..."}' value={typeof form.specs === "object" ? JSON.stringify(form.specs, null, 2) : (form.specs || "")} onChange={(v) => setForm({ ...form, specs: v as unknown as Record<string, string> })} rows={4} />
            </div>
            <div className="sm:col-span-2">
              <AdminTextarea label='FPS данные (JSON) — {"cs2":"350+ FPS"}' value={typeof form.fps_data === "object" ? JSON.stringify(form.fps_data, null, 2) : (form.fps_data || "")} onChange={(v) => setForm({ ...form, fps_data: v as unknown as Record<string, string> })} rows={3} />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-montserrat text-white">
                <input type="checkbox" checked={!!form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4" />
                Показывать на главной
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-montserrat text-white">
                <input type="checkbox" checked={!!form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4" />
                Активен
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <SaveBtn onClick={save} loading={saving} />
            <button onClick={() => setEditing(null)} className="btn-outline text-xs px-5 py-2.5">Отмена</button>
          </div>
        </AdminCard>
      )}

      <div className="mt-4 space-y-2">
        {products.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-4 px-5 py-4 border"
            style={{ background: "var(--razpc-card)", borderColor: "var(--razpc-border)" }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-orbitron font-bold text-sm text-white">{p.name}</span>
                {!p.is_active && <span className="text-[10px] font-orbitron px-1.5 py-0.5" style={{ background: "rgba(255,85,85,0.1)", color: "#ff5555", border: "1px solid rgba(255,85,85,0.2)" }}>Скрыт</span>}
                {p.is_featured && <span className="text-[10px] font-orbitron px-1.5 py-0.5" style={{ background: "rgba(255,214,0,0.1)", color: "var(--razpc-yellow)", border: "1px solid rgba(255,214,0,0.2)" }}>На главной</span>}
              </div>
              <div className="text-xs font-montserrat mt-0.5" style={{ color: "var(--razpc-muted)" }}>
                {Number(p.price).toLocaleString("ru-RU")} ₽ · {p.status} · {p.cat_name || "Без категории"}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => startEdit(p)} className="btn-outline text-xs px-3 py-1.5">Изменить</button>
              <button onClick={async () => { await adminApi.deleteProduct(token, p.id); load(); }}
                className="px-3 py-1.5 text-xs font-orbitron uppercase tracking-widest border transition-colors duration-200"
                style={{ borderColor: "rgba(255,85,85,0.3)", color: "rgba(255,85,85,0.7)" }}>
                Скрыть
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── SERVICES ─────────────────────────────────────────────────── */
interface ServiceItem {
  id: number; name: string; slug: string; short_description: string;
  description: string; icon: string; price_from: number | null; is_active: boolean; sort_order: number;
}

function ServicesTab({ token }: { token: string }) {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<ServiceItem>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(() => adminApi.getServices(token).then(setServices).catch(() => {}), [token]);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    try {
      await adminApi.updateService(token, editing!, form);
      setMsg("Сохранено"); setTimeout(() => setMsg(""), 2000);
      setEditing(null); load();
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionTitle title="Услуги" />
        {msg && <span className="text-sm font-montserrat" style={{ color: "var(--razpc-yellow)" }}>{msg}</span>}
      </div>

      {editing !== null && (
        <AdminCard>
          <h3 className="font-orbitron font-bold text-base text-white mb-5">Редактировать услугу</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <AdminInput label="Название" value={form.name || ""} onChange={(v) => setForm({ ...form, name: v })} />
            <AdminInput label="Slug" value={form.slug || ""} onChange={(v) => setForm({ ...form, slug: v })} />
            <AdminInput label="Иконка (lucide)" value={form.icon || ""} onChange={(v) => setForm({ ...form, icon: v })} placeholder="Cpu, Zap, Search..." />
            <AdminInput label="Цена от (₽)" type="number" value={String(form.price_from || "")} onChange={(v) => setForm({ ...form, price_from: Number(v) || null })} />
            <div className="sm:col-span-2">
              <AdminTextarea label="Краткое описание" value={form.short_description || ""} onChange={(v) => setForm({ ...form, short_description: v })} />
            </div>
            <div className="sm:col-span-2">
              <AdminTextarea label="Полное описание" value={form.description || ""} onChange={(v) => setForm({ ...form, description: v })} rows={4} />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <SaveBtn onClick={save} loading={saving} />
            <button onClick={() => setEditing(null)} className="btn-outline text-xs px-5 py-2.5">Отмена</button>
          </div>
        </AdminCard>
      )}

      <div className="mt-4 space-y-2">
        {services.map((s) => (
          <div key={s.id} className="flex items-center justify-between gap-4 px-5 py-4 border"
            style={{ background: "var(--razpc-card)", borderColor: "var(--razpc-border)" }}>
            <div>
              <span className="font-orbitron font-bold text-sm text-white">{s.name}</span>
              {s.price_from && <span className="ml-3 text-xs font-montserrat" style={{ color: "var(--razpc-muted)" }}>от {Number(s.price_from).toLocaleString("ru-RU")} ₽</span>}
            </div>
            <button onClick={() => { setEditing(s.id); setForm({ ...s }); }} className="btn-outline text-xs px-3 py-1.5">Изменить</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── PORTFOLIO ────────────────────────────────────────────────── */
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

  const startNew = () => { setEditing(-1); setForm({ title: "", client_task: "", specs: "", image_url: "", category: "", is_active: true, sort_order: 0 }); };

  const save = async () => {
    setSaving(true);
    try {
      if (editing === -1) await adminApi.createPortfolio(token, form);
      else await adminApi.updatePortfolio(token, editing!, form);
      setMsg("Сохранено"); setTimeout(() => setMsg(""), 2000);
      setEditing(null); load();
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionTitle title={`Портфолио (${items.length})`} />
        <div className="flex gap-2 items-center">
          {msg && <span className="text-sm font-montserrat" style={{ color: "var(--razpc-yellow)" }}>{msg}</span>}
          <button onClick={startNew} className="btn-primary text-xs px-5 py-2.5">+ Добавить</button>
        </div>
      </div>

      {editing !== null && (
        <AdminCard>
          <h3 className="font-orbitron font-bold text-base text-white mb-5">{editing === -1 ? "Новая работа" : "Редактировать"}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <AdminInput label="Название" value={form.title || ""} onChange={(v) => setForm({ ...form, title: v })} />
            <AdminInput label="Категория" value={form.category || ""} onChange={(v) => setForm({ ...form, category: v })} placeholder="Gaming, Premium..." />
            <AdminInput label="URL изображения" value={form.image_url || ""} onChange={(v) => setForm({ ...form, image_url: v })} />
            <AdminInput label="Характеристики" value={form.specs || ""} onChange={(v) => setForm({ ...form, specs: v })} placeholder="RTX 4090 / i9 / 64GB" />
            <div className="sm:col-span-2">
              <AdminTextarea label="Задача клиента" value={form.client_task || ""} onChange={(v) => setForm({ ...form, client_task: v })} />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <SaveBtn onClick={save} loading={saving} />
            <button onClick={() => setEditing(null)} className="btn-outline text-xs px-5 py-2.5">Отмена</button>
          </div>
        </AdminCard>
      )}

      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-4 px-5 py-4 border"
            style={{ background: "var(--razpc-card)", borderColor: "var(--razpc-border)" }}>
            <div>
              <span className="font-orbitron font-bold text-sm text-white">{item.title}</span>
              <span className="ml-3 text-xs font-montserrat" style={{ color: "var(--razpc-muted)" }}>{item.category} · {item.specs}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditing(item.id); setForm({ ...item }); }} className="btn-outline text-xs px-3 py-1.5">Изменить</button>
              <button onClick={async () => { await adminApi.deletePortfolio(token, item.id); load(); }}
                className="px-3 py-1.5 text-xs font-orbitron uppercase border"
                style={{ borderColor: "rgba(255,85,85,0.3)", color: "rgba(255,85,85,0.7)" }}>
                Скрыть
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── REVIEWS ──────────────────────────────────────────────────── */
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

  const startNew = () => { setEditing(-1); setForm({ author_name: "", author_city: "", text: "", product_name: "", is_active: true, is_featured: false, sort_order: 0 }); };

  const save = async () => {
    setSaving(true);
    try {
      if (editing === -1) await adminApi.createReview(token, form);
      else await adminApi.updateReview(token, editing!, form);
      setMsg("Сохранено"); setTimeout(() => setMsg(""), 2000);
      setEditing(null); load();
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionTitle title={`Отзывы (${items.length})`} />
        <div className="flex gap-2 items-center">
          {msg && <span className="text-sm font-montserrat" style={{ color: "var(--razpc-yellow)" }}>{msg}</span>}
          <button onClick={startNew} className="btn-primary text-xs px-5 py-2.5">+ Добавить</button>
        </div>
      </div>

      {editing !== null && (
        <AdminCard>
          <h3 className="font-orbitron font-bold text-base text-white mb-5">{editing === -1 ? "Новый отзыв" : "Редактировать"}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <AdminInput label="Имя" value={form.author_name || ""} onChange={(v) => setForm({ ...form, author_name: v })} />
            <AdminInput label="Город" value={form.author_city || ""} onChange={(v) => setForm({ ...form, author_city: v })} />
            <AdminInput label="Товар (опционально)" value={form.product_name || ""} onChange={(v) => setForm({ ...form, product_name: v })} />
            <div className="sm:col-span-2">
              <AdminTextarea label="Текст отзыва" value={form.text || ""} onChange={(v) => setForm({ ...form, text: v })} rows={4} />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-montserrat text-white">
                <input type="checkbox" checked={!!form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4" />
                На главной
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-montserrat text-white">
                <input type="checkbox" checked={!!form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4" />
                Активен
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <SaveBtn onClick={save} loading={saving} />
            <button onClick={() => setEditing(null)} className="btn-outline text-xs px-5 py-2.5">Отмена</button>
          </div>
        </AdminCard>
      )}

      <div className="mt-4 space-y-2">
        {items.map((r) => (
          <div key={r.id} className="flex items-start justify-between gap-4 px-5 py-4 border"
            style={{ background: "var(--razpc-card)", borderColor: "var(--razpc-border)" }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-orbitron font-bold text-sm text-white">{r.author_name}</span>
                {r.author_city && <span className="text-xs font-montserrat" style={{ color: "var(--razpc-muted)" }}>{r.author_city}</span>}
                {r.is_featured && <span className="text-[10px] font-orbitron px-1.5 py-0.5" style={{ background: "rgba(255,214,0,0.1)", color: "var(--razpc-yellow)", border: "1px solid rgba(255,214,0,0.2)" }}>На главной</span>}
                {!r.is_active && <span className="text-[10px] font-orbitron px-1.5 py-0.5" style={{ background: "rgba(255,85,85,0.1)", color: "#ff5555", border: "1px solid rgba(255,85,85,0.2)" }}>Скрыт</span>}
              </div>
              <p className="text-xs font-montserrat mt-1 line-clamp-2" style={{ color: "rgba(245,245,245,0.55)" }}>{r.text}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => { setEditing(r.id); setForm({ ...r }); }} className="btn-outline text-xs px-3 py-1.5">Изменить</button>
              <button onClick={async () => { await adminApi.deleteReview(token, r.id); load(); }}
                className="px-3 py-1.5 text-xs font-orbitron uppercase border"
                style={{ borderColor: "rgba(255,85,85,0.3)", color: "rgba(255,85,85,0.7)" }}>
                Скрыть
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── CONTENT ──────────────────────────────────────────────────── */
interface ContentItem { id: number; key: string; value: string; description: string; }

function ContentTab({ token }: { token: string }) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [vals, setVals] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(() => {
    adminApi.getContent(token).then((data: ContentItem[]) => {
      setItems(data);
      const v: Record<string, string> = {};
      data.forEach((c: ContentItem) => { v[c.key] = c.value || ""; });
      setVals(v);
    }).catch(() => {});
  }, [token]);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    try {
      await adminApi.updateContent(token, vals);
      setMsg("Сохранено"); setTimeout(() => setMsg(""), 2000);
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionTitle title="Контент и контакты" />
        <div className="flex gap-2 items-center">
          {msg && <span className="text-sm font-montserrat" style={{ color: "var(--razpc-yellow)" }}>{msg}</span>}
          <SaveBtn onClick={save} loading={saving} />
        </div>
      </div>

      <AdminCard>
        <div className="space-y-4">
          {items.map((c) => (
            <div key={c.key}>
              <AdminInput
                label={`${c.description || c.key} (${c.key})`}
                value={vals[c.key] || ""}
                onChange={(v) => setVals({ ...vals, [c.key]: v })}
              />
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}

/* ── ARTICLES ─────────────────────────────────────────────────── */
interface ArticleItem {
  id: number; title: string; slug: string; excerpt: string;
  content: string; image_url: string | null; seo_title: string;
  seo_description: string; is_published: boolean; sort_order: number;
}

function ArticlesTab({ token }: { token: string }) {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<ArticleItem>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(() => adminApi.getArticles(token).then(setArticles).catch(() => {}), [token]);
  useEffect(() => { load(); }, [load]);

  const startNew = () => {
    setEditing(-1);
    setForm({ title: "", slug: "", excerpt: "", content: "", image_url: "", seo_title: "", seo_description: "", is_published: false, sort_order: 0 });
  };

  const save = async () => {
    setSaving(true);
    try {
      if (editing === -1) await adminApi.createArticle(token, form);
      else await adminApi.updateArticle(token, editing!, form);
      setMsg("Сохранено"); setTimeout(() => setMsg(""), 2000);
      setEditing(null); load();
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionTitle title={`Статьи (${articles.length})`} />
        <div className="flex gap-2 items-center">
          {msg && <span className="text-sm font-montserrat" style={{ color: "var(--razpc-yellow)" }}>{msg}</span>}
          <button onClick={startNew} className="btn-primary text-xs px-5 py-2.5">+ Добавить</button>
        </div>
      </div>

      {editing !== null && (
        <AdminCard>
          <h3 className="font-orbitron font-bold text-base text-white mb-5">{editing === -1 ? "Новая статья" : "Редактировать"}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <AdminInput label="Заголовок" value={form.title || ""} onChange={(v) => setForm({ ...form, title: v })} />
            <AdminInput label="Slug (URL)" value={form.slug || ""} onChange={(v) => setForm({ ...form, slug: v })} />
            <AdminInput label="URL изображения" value={form.image_url || ""} onChange={(v) => setForm({ ...form, image_url: v })} />
            <AdminInput label="SEO заголовок" value={form.seo_title || ""} onChange={(v) => setForm({ ...form, seo_title: v })} />
            <div className="sm:col-span-2">
              <AdminTextarea label="Краткое описание (для SEO)" value={form.seo_description || ""} onChange={(v) => setForm({ ...form, seo_description: v })} rows={2} />
            </div>
            <div className="sm:col-span-2">
              <AdminTextarea label="Анонс" value={form.excerpt || ""} onChange={(v) => setForm({ ...form, excerpt: v })} />
            </div>
            <div className="sm:col-span-2">
              <AdminTextarea label="Текст статьи" value={form.content || ""} onChange={(v) => setForm({ ...form, content: v })} rows={8} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-sm font-montserrat text-white">
              <input type="checkbox" checked={!!form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="w-4 h-4" />
              Опубликована
            </label>
          </div>
          <div className="flex gap-3 mt-5">
            <SaveBtn onClick={save} loading={saving} />
            <button onClick={() => setEditing(null)} className="btn-outline text-xs px-5 py-2.5">Отмена</button>
          </div>
        </AdminCard>
      )}

      <div className="mt-4 space-y-2">
        {articles.map((a) => (
          <div key={a.id} className="flex items-center justify-between gap-4 px-5 py-4 border"
            style={{ background: "var(--razpc-card)", borderColor: "var(--razpc-border)" }}>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-orbitron font-bold text-sm text-white">{a.title}</span>
                <span className="text-[10px] font-orbitron px-1.5 py-0.5"
                  style={{ background: a.is_published ? "rgba(76,175,80,0.1)" : "rgba(255,255,255,0.05)", color: a.is_published ? "#4CAF50" : "var(--razpc-muted)", border: `1px solid ${a.is_published ? "rgba(76,175,80,0.2)" : "var(--razpc-border)"}` }}>
                  {a.is_published ? "Опубликована" : "Черновик"}
                </span>
              </div>
              <span className="text-xs font-montserrat" style={{ color: "var(--razpc-muted)" }}>{a.slug}</span>
            </div>
            <button onClick={() => { setEditing(a.id); setForm({ ...a }); }} className="btn-outline text-xs px-3 py-1.5">Изменить</button>
          </div>
        ))}
      </div>
    </div>
  );
}
