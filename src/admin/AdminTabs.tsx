import { useState, useEffect, useCallback } from "react";
import { adminApi } from "@/lib/api";
import Icon from "@/components/ui/icon";
import {
  Card, Field, Input, Textarea, Select,
  SaveBtn, Toast, PageTitle, EditForm,
  RowItem, EditBtn, HideBtn, Badge,
} from "./adminUi";

// ── ORDERS ────────────────────────────────────────────────────────
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

export function OrdersTab({ token }: { token: string }) {
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
              <Select value={statuses[o.id] || o.status} onChange={(v) => setStatuses({ ...statuses, [o.id]: v })} options={ORDER_STATUSES} />
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

// ── SERVICES ──────────────────────────────────────────────────────
interface ServiceItem {
  id: number; name: string; slug: string; short_description: string;
  description: string; icon: string; image_url?: string; price_from: number | null; is_active: boolean; sort_order: number;
}

export function ServicesTab({ token }: { token: string }) {
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

// ── REVIEWS ───────────────────────────────────────────────────────
interface ReviewItem {
  id: number; author_name: string; author_city: string;
  text: string; product_name: string | null; is_active: boolean; is_featured: boolean; sort_order: number;
}

export function ReviewsTab({ token }: { token: string }) {
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

// ── CONTENT ───────────────────────────────────────────────────────
interface ContentItem { id: number; key: string; value: string; description: string; }

const CONTENT_GROUPS: { label: string; keys: string[] }[] = [
  { label: "Главная страница (Hero)", keys: ["hero_title", "hero_slogan", "hero_subtitle"] },
  { label: "Контакты", keys: ["phone", "email", "address", "work_hours", "telegram", "whatsapp", "vk"] },
];

export function ContentTab({ token }: { token: string }) {
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

// ── ARTICLES ──────────────────────────────────────────────────────
interface ArticleItem {
  id: number; title: string; slug: string; excerpt: string; content: string;
  image_url: string | null; seo_title: string; seo_description: string; is_published: boolean; sort_order: number;
}

export function ArticlesTab({ token }: { token: string }) {
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
