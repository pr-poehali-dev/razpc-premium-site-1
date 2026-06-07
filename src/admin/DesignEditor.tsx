import { useState, useRef, useCallback, useEffect } from "react";
import { adminApi } from "@/lib/api";
import Icon from "@/components/ui/icon";

// ── Types ─────────────────────────────────────────────────────────
type SectionId =
  | "hero" | "benefits" | "services" | "catalog"
  | "portfolio" | "steps" | "reviews" | "seo" | "footer";

interface DesignSettings {
  // Colors
  accentColor: string;
  bgColor: string;
  surfaceColor: string;
  cardColor: string;
  textColor: string;
  // Hero
  hero_title: string;
  hero_slogan: string;
  hero_subtitle: string;
  hero_bg_image: string;
  hero_pc_image: string;
  // Sections visibility
  show_benefits: boolean;
  show_services: boolean;
  show_catalog: boolean;
  show_portfolio: boolean;
  show_steps: boolean;
  show_reviews: boolean;
  // Section order (array of SectionId)
  section_order: SectionId[];
  // Contacts
  phone: string;
  email: string;
  address: string;
  work_hours: string;
  telegram: string;
  whatsapp: string;
  vk: string;
}

const DEFAULT_SETTINGS: DesignSettings = {
  accentColor: "#FFD600",
  bgColor: "#0d0d0d",
  surfaceColor: "#161616",
  cardColor: "#1a1a1a",
  textColor: "#f5f5f5",
  hero_title: "RAZPC МАСТЕРСКАЯ",
  hero_slogan: "Собрано с точностью.",
  hero_subtitle: "Профессиональная сборка, модернизация и обслуживание ПК без компромиссов.",
  hero_bg_image: "",
  hero_pc_image: "",
  show_benefits: true,
  show_services: true,
  show_catalog: true,
  show_portfolio: true,
  show_steps: true,
  show_reviews: true,
  section_order: ["hero", "benefits", "services", "catalog", "portfolio", "steps", "reviews", "seo", "footer"],
  phone: "+7 (988) 000-00-00",
  email: "info@razpc.ru",
  address: "Краснодар, ул. Красная, 1",
  work_hours: "Пн-Вс: 09:00-21:00",
  telegram: "https://t.me/razpc",
  whatsapp: "https://wa.me/79880000000",
  vk: "https://vk.com/razpc",
};

const SECTION_LABELS: Record<SectionId, string> = {
  hero: "🏠 Hero — первый экран",
  benefits: "✦ Преимущества",
  services: "🔧 Услуги",
  catalog: "🖥️ Каталог ПК",
  portfolio: "📷 Портфолио",
  steps: "📋 Этапы работы",
  reviews: "💬 Отзывы",
  seo: "📝 SEO-текст",
  footer: "📌 Футер",
};

type EditorPanel = "sections" | "colors" | "hero" | "contacts" | "typography";

// ── Main Component ────────────────────────────────────────────────
export default function DesignEditor({ token }: { token: string }) {
  const [settings, setSettings] = useState<DesignSettings>(DEFAULT_SETTINGS);
  const [panel, setPanel] = useState<EditorPanel>("hero");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dragging, setDragging] = useState<SectionId | null>(null);
  const [dragOver, setDragOver] = useState<SectionId | null>(null);
  const previewRef = useRef<HTMLIFrameElement>(null);

  // Load current content from DB
  useEffect(() => {
    adminApi.getContent(token).then((data: { key: string; value: string }[]) => {
      const m: Record<string, string> = {};
      data.forEach((c) => { m[c.key] = c.value || ""; });
      setSettings(prev => ({
        ...prev,
        hero_title: m.hero_title || prev.hero_title,
        hero_slogan: m.hero_slogan || prev.hero_slogan,
        hero_subtitle: m.hero_subtitle || prev.hero_subtitle,
        hero_bg_image: m.hero_bg_image || prev.hero_bg_image,
        hero_pc_image: m.hero_pc_image || prev.hero_pc_image,
        phone: m.phone || prev.phone,
        email: m.email || prev.email,
        address: m.address || prev.address,
        work_hours: m.work_hours || prev.work_hours,
        telegram: m.telegram || prev.telegram,
        whatsapp: m.whatsapp || prev.whatsapp,
        vk: m.vk || prev.vk,
        accentColor: m.accent_color || prev.accentColor,
        bgColor: m.bg_color || prev.bgColor,
        surfaceColor: m.surface_color || prev.surfaceColor,
        cardColor: m.card_color || prev.cardColor,
      }));
    }).catch(() => {});
  }, [token]);

  const S = useCallback(<K extends keyof DesignSettings>(key: K, val: DesignSettings[K]) => {
    setSettings(p => ({ ...p, [key]: val }));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await adminApi.updateContent(token, {
        hero_title: settings.hero_title,
        hero_slogan: settings.hero_slogan,
        hero_subtitle: settings.hero_subtitle,
        hero_bg_image: settings.hero_bg_image,
        hero_pc_image: settings.hero_pc_image,
        phone: settings.phone,
        email: settings.email,
        address: settings.address,
        work_hours: settings.work_hours,
        telegram: settings.telegram,
        whatsapp: settings.whatsapp,
        vk: settings.vk,
        accent_color: settings.accentColor,
        bg_color: settings.bgColor,
        surface_color: settings.surfaceColor,
        card_color: settings.cardColor,
      });
      // Apply CSS vars live to preview
      applyColorsToPreview();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  };

  const applyColorsToPreview = useCallback(() => {
    const root = document.documentElement;
    root.style.setProperty("--razpc-yellow", settings.accentColor);
    root.style.setProperty("--razpc-black", settings.bgColor);
    root.style.setProperty("--razpc-surface", settings.surfaceColor);
    root.style.setProperty("--razpc-card", settings.cardColor);
  }, [settings]);

  // Live preview CSS vars
  useEffect(() => { applyColorsToPreview(); }, [applyColorsToPreview]);

  // Drag & drop for sections
  const onDragStart = (id: SectionId) => setDragging(id);
  const onDragOver = (e: React.DragEvent, id: SectionId) => { e.preventDefault(); setDragOver(id); };
  const onDrop = (targetId: SectionId) => {
    if (!dragging || dragging === targetId) { setDragging(null); setDragOver(null); return; }
    const order = [...settings.section_order];
    const fromIdx = order.indexOf(dragging);
    const toIdx = order.indexOf(targetId);
    order.splice(fromIdx, 1);
    order.splice(toIdx, 0, dragging);
    S("section_order", order);
    setDragging(null);
    setDragOver(null);
  };

  const PANELS: { id: EditorPanel; label: string; icon: string }[] = [
    { id: "hero",       label: "Hero",       icon: "Layout" },
    { id: "colors",     label: "Цвета",      icon: "Palette" },
    { id: "sections",   label: "Секции",     icon: "Layers" },
    { id: "contacts",   label: "Контакты",   icon: "Phone" },
    { id: "typography", label: "Шрифты",     icon: "Type" },
  ];

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "Montserrat, sans-serif" }}>
      {/* Constructor header */}
      <div
        className="flex items-center justify-between px-5 py-3 flex-shrink-0"
        style={{ background: "var(--razpc-surface)", borderBottom: "1px solid var(--razpc-border)" }}
      >
        <div className="flex items-center gap-2">
          <Icon name="Wand2" size={16} style={{ color: "var(--razpc-yellow)" }} />
          <span className="font-orbitron font-bold text-sm text-white">Конструктор сайта</span>
          <span className="text-[10px] font-montserrat px-2 py-0.5 ml-1" style={{ background: "rgba(255,214,0,0.1)", color: "var(--razpc-yellow)", border: "1px solid rgba(255,214,0,0.2)" }}>
            BETA
          </span>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-xs font-montserrat px-3 py-1.5" style={{ background: "rgba(76,175,80,0.1)", color: "#4CAF50", border: "1px solid rgba(76,175,80,0.2)" }}>
              ✓ Сохранено
            </span>
          )}
          <button onClick={save} disabled={saving} className="btn-primary text-xs px-5 py-2">
            {saving ? "Сохранение..." : "Опубликовать"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: panel tabs */}
        <div
          className="w-36 flex-shrink-0 flex flex-col border-r py-3"
          style={{ background: "var(--razpc-dark)", borderColor: "var(--razpc-border)" }}
        >
          {PANELS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPanel(p.id)}
              className="flex flex-col items-center gap-1.5 py-4 px-2 text-center transition-all duration-150"
              style={{
                background: panel === p.id ? "rgba(255,214,0,0.08)" : "transparent",
                color: panel === p.id ? "var(--razpc-yellow)" : "var(--razpc-muted)",
                borderLeft: panel === p.id ? "2px solid var(--razpc-yellow)" : "2px solid transparent",
              }}
            >
              <Icon name={p.icon} size={18} />
              <span className="text-[10px] font-orbitron uppercase tracking-wide">{p.label}</span>
            </button>
          ))}
        </div>

        {/* Center: settings panel */}
        <div
          className="w-80 flex-shrink-0 overflow-y-auto border-r"
          style={{ background: "var(--razpc-dark)", borderColor: "var(--razpc-border)" }}
        >
          <div className="p-4">
            {panel === "hero" && <HeroPanel s={settings} S={S} />}
            {panel === "colors" && <ColorsPanel s={settings} S={S} />}
            {panel === "sections" && <SectionsPanel s={settings} S={S} dragging={dragging} dragOver={dragOver} onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop} />}
            {panel === "contacts" && <ContactsPanel s={settings} S={S} />}
            {panel === "typography" && <TypographyPanel />}
          </div>
        </div>

        {/* Right: live preview */}
        <div className="flex-1 overflow-auto" style={{ background: "#080808" }}>
          <LivePreview settings={settings} ref={previewRef} />
        </div>
      </div>
    </div>
  );
}

// ── PANEL: Hero ───────────────────────────────────────────────────
function HeroPanel({ s, S }: { s: DesignSettings; S: <K extends keyof DesignSettings>(k: K, v: DesignSettings[K]) => void }) {
  return (
    <div className="space-y-4">
      <PanelTitle title="Первый экран (Hero)" />
      <PField label="Главный заголовок">
        <PInput value={s.hero_title} onChange={(v) => S("hero_title", v)} />
      </PField>
      <PField label="Слоган">
        <PInput value={s.hero_slogan} onChange={(v) => S("hero_slogan", v)} />
      </PField>
      <PField label="Подзаголовок">
        <PTextarea value={s.hero_subtitle} onChange={(v) => S("hero_subtitle", v)} rows={3} />
      </PField>
      <PField label="Фото ПК справа (URL)">
        <PInput value={s.hero_pc_image} onChange={(v) => S("hero_pc_image", v)} placeholder="https://..." />
        {s.hero_pc_image && (
          <div className="mt-2 relative overflow-hidden" style={{ height: 100, border: "1px solid var(--razpc-border)" }}>
            <img src={s.hero_pc_image} alt="" className="w-full h-full object-cover" />
            <button
              onClick={() => S("hero_pc_image", "")}
              className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center text-xs"
              style={{ background: "rgba(255,85,85,0.8)", color: "#fff" }}
            >×</button>
          </div>
        )}
      </PField>
      <PField label="Фоновое изображение (URL)">
        <PInput value={s.hero_bg_image} onChange={(v) => S("hero_bg_image", v)} placeholder="https://... (необязательно)" />
      </PField>
    </div>
  );
}

// ── PANEL: Colors ─────────────────────────────────────────────────
function ColorsPanel({ s, S }: { s: DesignSettings; S: <K extends keyof DesignSettings>(k: K, v: DesignSettings[K]) => void }) {
  const colors: { key: keyof DesignSettings; label: string; hint: string }[] = [
    { key: "accentColor",  label: "Акцентный цвет",  hint: "Жёлтый, кнопки, линии" },
    { key: "bgColor",      label: "Фон страницы",    hint: "Основной фоновый цвет" },
    { key: "surfaceColor", label: "Поверхности",     hint: "Фон секций, карточек" },
    { key: "cardColor",    label: "Карточки",        hint: "Фон товаров, блоков" },
    { key: "textColor",    label: "Текст",           hint: "Основной цвет текста" },
  ];

  return (
    <div className="space-y-5">
      <PanelTitle title="Цвета и стиль" />
      <p className="text-xs font-montserrat" style={{ color: "var(--razpc-muted)" }}>
        Изменения видны в превью справа сразу после выбора.
      </p>
      {colors.map((c) => (
        <div key={c.key} className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-orbitron uppercase tracking-wide text-white">{c.label}</div>
            <div className="text-[10px] font-montserrat mt-0.5" style={{ color: "var(--razpc-muted)" }}>{c.hint}</div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 border-2 cursor-pointer"
              style={{ background: String(s[c.key]), borderColor: "var(--razpc-border)" }}
              onClick={() => document.getElementById(`clr-${c.key}`)?.click()}
            />
            <input
              id={`clr-${c.key}`}
              type="color"
              value={String(s[c.key])}
              onChange={(e) => S(c.key, e.target.value as DesignSettings[typeof c.key])}
              className="w-0 h-0 opacity-0 absolute"
            />
            <input
              type="text"
              value={String(s[c.key])}
              onChange={(e) => S(c.key, e.target.value as DesignSettings[typeof c.key])}
              className="w-24 px-2 py-1.5 text-xs font-montserrat text-white outline-none"
              style={{ background: "var(--razpc-surface)", border: "1px solid var(--razpc-border)" }}
            />
          </div>
        </div>
      ))}

      {/* Presets */}
      <div className="pt-2">
        <div className="text-[10px] font-orbitron uppercase tracking-widest mb-3" style={{ color: "var(--razpc-muted)" }}>
          Готовые темы
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "RazPC Dark", accent: "#FFD600", bg: "#0d0d0d", surface: "#161616", card: "#1a1a1a" },
            { label: "Синяя тема", accent: "#4A9EFF", bg: "#090b12", surface: "#111620", card: "#161b28" },
            { label: "Красная тема", accent: "#FF4444", bg: "#0d0909", surface: "#180e0e", card: "#1e1010" },
            { label: "Зелёная тема", accent: "#4CAF50", bg: "#090d0a", surface: "#101810", card: "#141e14" },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                S("accentColor", preset.accent);
                S("bgColor", preset.bg);
                S("surfaceColor", preset.surface);
                S("cardColor", preset.card);
              }}
              className="flex items-center gap-2 px-3 py-2 text-left transition-all"
              style={{ background: "var(--razpc-card)", border: "1px solid var(--razpc-border)" }}
            >
              <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: preset.accent }} />
              <span className="text-[11px] font-montserrat text-white truncate">{preset.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── PANEL: Sections order & visibility ───────────────────────────
function SectionsPanel({ s, S, dragging, dragOver, onDragStart, onDragOver, onDrop }: {
  s: DesignSettings;
  S: <K extends keyof DesignSettings>(k: K, v: DesignSettings[K]) => void;
  dragging: SectionId | null; dragOver: SectionId | null;
  onDragStart: (id: SectionId) => void;
  onDragOver: (e: React.DragEvent, id: SectionId) => void;
  onDrop: (id: SectionId) => void;
}) {
  const visibilityKey: Partial<Record<SectionId, keyof DesignSettings>> = {
    benefits: "show_benefits",
    services: "show_services",
    catalog: "show_catalog",
    portfolio: "show_portfolio",
    steps: "show_steps",
    reviews: "show_reviews",
  };

  return (
    <div className="space-y-4">
      <PanelTitle title="Секции сайта" />
      <p className="text-xs font-montserrat" style={{ color: "var(--razpc-muted)" }}>
        Перетащите секции чтобы изменить их порядок. Включайте и выключайте видимость.
      </p>
      <div className="space-y-1.5">
        {s.section_order.map((id) => {
          const vKey = visibilityKey[id];
          const isVisible = vKey ? Boolean(s[vKey]) : true;
          const isFixed = !vKey;
          return (
            <div
              key={id}
              draggable={!isFixed}
              onDragStart={() => !isFixed && onDragStart(id)}
              onDragOver={(e) => onDragOver(e, id)}
              onDrop={() => onDrop(id)}
              className="flex items-center gap-3 px-3 py-3 transition-all"
              style={{
                background: dragOver === id ? "rgba(255,214,0,0.08)" : "var(--razpc-card)",
                border: `1px solid ${dragOver === id ? "rgba(255,214,0,0.3)" : "var(--razpc-border)"}`,
                cursor: isFixed ? "default" : "grab",
                opacity: !isVisible ? 0.4 : 1,
              }}
            >
              <Icon name={isFixed ? "Lock" : "GripVertical"} size={14} style={{ color: "var(--razpc-muted)", flexShrink: 0 }} />
              <span className="flex-1 text-sm font-montserrat text-white">{SECTION_LABELS[id]}</span>
              {!isFixed && vKey && (
                <button
                  onClick={() => S(vKey, !s[vKey] as DesignSettings[typeof vKey])}
                  className="flex items-center gap-1 text-[10px] font-orbitron uppercase tracking-wide px-2 py-1 transition-all"
                  style={{
                    background: isVisible ? "rgba(76,175,80,0.1)" : "rgba(255,85,85,0.1)",
                    color: isVisible ? "#4CAF50" : "#ff6b6b",
                    border: `1px solid ${isVisible ? "rgba(76,175,80,0.2)" : "rgba(255,85,85,0.2)"}`,
                  }}
                >
                  <Icon name={isVisible ? "Eye" : "EyeOff"} size={11} />
                  {isVisible ? "Вкл" : "Выкл"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── PANEL: Contacts ───────────────────────────────────────────────
function ContactsPanel({ s, S }: { s: DesignSettings; S: <K extends keyof DesignSettings>(k: K, v: DesignSettings[K]) => void }) {
  return (
    <div className="space-y-4">
      <PanelTitle title="Контакты" />
      {([
        ["phone",      "Телефон",        "+7 (___) ___-__-__"],
        ["email",      "Email",          "info@razpc.ru"],
        ["address",    "Адрес",          "Краснодар, ул. ..."],
        ["work_hours", "Часы работы",    "Пн-Вс: 09:00-21:00"],
        ["telegram",   "Telegram (URL)", "https://t.me/..."],
        ["whatsapp",   "WhatsApp (URL)", "https://wa.me/..."],
        ["vk",         "ВКонтакте (URL)", "https://vk.com/..."],
      ] as [keyof DesignSettings, string, string][]).map(([key, label, placeholder]) => (
        <PField key={key} label={label}>
          <PInput value={String(s[key] || "")} onChange={(v) => S(key, v as DesignSettings[typeof key])} placeholder={placeholder} />
        </PField>
      ))}
    </div>
  );
}

// ── PANEL: Typography ─────────────────────────────────────────────
function TypographyPanel() {
  return (
    <div className="space-y-4">
      <PanelTitle title="Типографика" />
      <div
        className="p-4 text-sm font-montserrat"
        style={{ background: "var(--razpc-card)", border: "1px solid var(--razpc-border)", color: "var(--razpc-muted)" }}
      >
        <p className="mb-3">Текущие шрифты сайта:</p>
        <div className="space-y-3">
          <div>
            <div className="font-orbitron text-white text-base">Orbitron</div>
            <div className="text-[11px] mt-0.5">Заголовки, кнопки, лейблы</div>
          </div>
          <div>
            <div className="font-montserrat text-white text-base">Montserrat</div>
            <div className="text-[11px] mt-0.5">Основной текст, описания</div>
          </div>
        </div>
        <p className="mt-4 text-[11px]">Смена шрифтов доступна в следующей версии конструктора.</p>
      </div>
    </div>
  );
}

// ── Live Preview ──────────────────────────────────────────────────
import { forwardRef } from "react";

const LivePreview = forwardRef<HTMLIFrameElement, { settings: DesignSettings }>(({ settings }, ref) => {
  const accent = settings.accentColor;
  const bg = settings.bgColor;
  const surface = settings.surfaceColor;
  const card = settings.cardColor;
  const text = settings.textColor;

  return (
    <div
      className="w-full h-full overflow-auto"
      style={{ background: bg, color: text, fontFamily: "Montserrat, sans-serif", minHeight: "100%" }}
    >
      {/* Mini preview of site */}
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        {/* Preview label */}
        <div
          className="text-center py-2 text-[10px] font-orbitron uppercase tracking-widest"
          style={{ background: "rgba(255,214,0,0.05)", color: accent, border: `1px solid ${accent}20` }}
        >
          Превью сайта — изменения применяются мгновенно
        </div>

        {/* Hero preview */}
        {settings.section_order.includes("hero") && (
          <PreviewSection bg={bg} label="Hero" accent={accent}>
            <div
              className="rounded-lg p-6 relative overflow-hidden"
              style={{
                background: settings.hero_bg_image
                  ? `url(${settings.hero_bg_image}) center/cover`
                  : `linear-gradient(135deg, ${bg} 0%, ${surface} 100%)`,
                border: `1px solid ${accent}15`,
              }}
            >
              <div className="grid grid-cols-2 gap-4 items-center">
                <div>
                  <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: accent }}>
                    Краснодар · Мастерская
                  </div>
                  <div
                    className="font-orbitron font-black text-xl leading-tight mb-2"
                    style={{ color: text }}
                  >
                    <span style={{ color: accent }}>{settings.hero_title.split(" ")[0]}</span>
                    {" "}{settings.hero_title.split(" ").slice(1).join(" ")}
                  </div>
                  <div className="text-sm font-light mb-2" style={{ color: accent }}>
                    «{settings.hero_slogan}»
                  </div>
                  <div className="text-[11px] mb-4 opacity-70" style={{ color: text }}>
                    {settings.hero_subtitle}
                  </div>
                  <div className="flex gap-2">
                    <div className="px-3 py-1.5 text-[10px] font-orbitron uppercase tracking-wide" style={{ background: accent, color: bg }}>
                      Оставить заявку
                    </div>
                    <div className="px-3 py-1.5 text-[10px] font-orbitron uppercase tracking-wide" style={{ border: `1px solid ${text}30`, color: text }}>
                      Смотреть работы
                    </div>
                  </div>
                </div>
                <div
                  className="rounded-lg overflow-hidden flex items-center justify-center"
                  style={{ background: `${accent}08`, border: `1px solid ${accent}15`, aspectRatio: "4/5" }}
                >
                  {settings.hero_pc_image ? (
                    <img src={settings.hero_pc_image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center opacity-30">
                      <div className="text-3xl mb-2">🖥️</div>
                      <div className="text-[10px]" style={{ color: accent }}>Фото ПК</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </PreviewSection>
        )}

        {/* Benefits preview */}
        {settings.section_order.includes("benefits") && settings.show_benefits && (
          <PreviewSection bg={surface} label="Преимущества" accent={accent}>
            <div className="grid grid-cols-4 gap-2">
              {["Точность", "Производительность", "Надёжность", "Эстетика"].map((b) => (
                <div key={b} className="p-3 text-center rounded" style={{ background: card, border: `1px solid ${accent}10` }}>
                  <div className="text-lg mb-1" style={{ color: accent }}>◆</div>
                  <div className="text-[10px] font-orbitron" style={{ color: text }}>{b}</div>
                </div>
              ))}
            </div>
          </PreviewSection>
        )}

        {/* Catalog preview */}
        {settings.section_order.includes("catalog") && settings.show_catalog && (
          <PreviewSection bg={bg} label="Каталог" accent={accent}>
            <div className="grid grid-cols-2 gap-2">
              {["RAZPC STRIKER\n149 900 ₽", "RAZPC APEX PRO\n349 900 ₽"].map((item) => (
                <div key={item} className="p-3 rounded" style={{ background: card, border: `1px solid ${accent}10` }}>
                  <div className="h-16 rounded mb-2 flex items-center justify-center" style={{ background: `${accent}06` }}>
                    <span className="text-2xl">🖥️</span>
                  </div>
                  <div className="text-[10px] font-orbitron text-white whitespace-pre-line">{item}</div>
                  <div className="mt-2 flex gap-1">
                    <div className="flex-1 py-1 text-[9px] font-orbitron text-center" style={{ background: accent, color: bg }}>Купить</div>
                    <div className="flex-1 py-1 text-[9px] font-orbitron text-center" style={{ border: `1px solid ${text}20`, color: text }}>Консультация</div>
                  </div>
                </div>
              ))}
            </div>
          </PreviewSection>
        )}

        {/* Reviews preview */}
        {settings.section_order.includes("reviews") && settings.show_reviews && (
          <PreviewSection bg={surface} label="Отзывы" accent={accent}>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "Александр К.", text: "Кабель-менеджмент — произведение искусства. Гарантия, тесты, полный отчёт." },
                { name: "Михаил Т.", text: "Производительность превзошла ожидания. Это не просто компьютер — это инструмент." },
              ].map((r) => (
                <div key={r.name} className="p-3 rounded" style={{ background: card, border: `1px solid ${accent}10` }}>
                  <div className="text-2xl font-black leading-none mb-2" style={{ color: `${accent}25` }}>"</div>
                  <div className="text-[10px] mb-2 opacity-70" style={{ color: text }}>{r.text}</div>
                  <div className="text-[10px] font-orbitron" style={{ color: accent }}>{r.name}</div>
                </div>
              ))}
            </div>
          </PreviewSection>
        )}

        {/* Footer preview */}
        <PreviewSection bg={surface} label="Контакты / Футер" accent={accent}>
          <div className="grid grid-cols-2 gap-4 text-[11px]">
            <div>
              <div className="font-orbitron font-black mb-2" style={{ color: accent }}>RAZ<span style={{ color: text }}>PC</span></div>
              <div style={{ color: `${text}50` }}>Профессиональная мастерская</div>
            </div>
            <div className="space-y-1" style={{ color: `${text}60` }}>
              <div>📞 {settings.phone}</div>
              <div>✉️ {settings.email}</div>
              <div>📍 {settings.address}</div>
            </div>
          </div>
        </PreviewSection>

        <div className="pb-6" />
      </div>
    </div>
  );
});
LivePreview.displayName = "LivePreview";

function PreviewSection({ children, bg, label, accent }: { children: React.ReactNode; bg: string; label: string; accent: string }) {
  return (
    <div className="rounded" style={{ background: bg, border: `1px solid rgba(255,255,255,0.04)` }}>
      <div
        className="px-3 py-1.5 text-[9px] font-orbitron uppercase tracking-widest border-b flex items-center gap-1.5"
        style={{ color: accent, borderColor: `${accent}15` }}
      >
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent }} />
        {label}
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

// ── Mini primitives for panels ────────────────────────────────────
function PanelTitle({ title }: { title: string }) {
  return (
    <h3 className="font-orbitron font-bold text-sm text-white pb-2" style={{ borderBottom: "1px solid var(--razpc-border)" }}>
      {title}
    </h3>
  );
}

function PField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-orbitron uppercase tracking-widest mb-1" style={{ color: "var(--razpc-muted)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function PInput({ value, onChange, placeholder = "" }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 text-xs text-white outline-none font-montserrat"
      style={{ background: "var(--razpc-surface)", border: "1px solid var(--razpc-border)" }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,214,0,0.4)")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--razpc-border)")}
    />
  );
}

function PTextarea({ value, onChange, rows = 2, placeholder = "" }: { value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 text-xs text-white outline-none font-montserrat resize-none"
      style={{ background: "var(--razpc-surface)", border: "1px solid var(--razpc-border)" }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,214,0,0.4)")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--razpc-border)")}
    />
  );
}
