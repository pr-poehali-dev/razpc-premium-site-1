import { useState, useEffect, useCallback } from "react";
import { adminApi } from "@/lib/api";
import {
  Field, Input, Textarea, Select,
  Toast, PageTitle, EditForm,
  RowItem, EditBtn, HideBtn, Badge,
} from "./adminUi";

// ── PRODUCTS ──────────────────────────────────────────────────────
interface Product {
  id: number; name: string; slug: string; short_description: string; description: string;
  price: number; old_price: number | null; status: string; image_url: string | null;
  is_featured: boolean; is_active: boolean; cat_name: string; category_id: number | null;
  specs: Record<string, string> | string; fps_data: Record<string, string> | string; sort_order: number;
}

export function ProductsTab({ token }: { token: string }) {
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
            <button
              onClick={() => { setEditing(-1); setForm({ name: "", slug: "", short_description: "", price: 0, status: "in_stock", is_featured: false, is_active: true, specs: "{}", fps_data: "{}", sort_order: 0 }); }}
              className="btn-primary text-xs px-5 py-2.5"
            >
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

// ── PORTFOLIO ─────────────────────────────────────────────────────
interface PortfolioItem {
  id: number; title: string; client_task: string; specs: string;
  image_url: string | null; category: string; is_active: boolean; sort_order: number;
}

export function PortfolioTab({ token }: { token: string }) {
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
            <button
              onClick={() => { setEditing(-1); setForm({ title: "", client_task: "", specs: "", image_url: "", category: "", is_active: true, sort_order: 0 }); }}
              className="btn-primary text-xs px-5 py-2.5"
            >
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
