import Icon from "@/components/ui/icon";

// ── Shared UI primitives for Admin panel ──────────────────────────

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="border p-6 mb-4" style={{ background: "var(--razpc-card)", borderColor: "var(--razpc-border)" }}>
      {children}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-orbitron uppercase tracking-widest mb-1.5" style={{ color: "var(--razpc-muted)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function Input({ value, onChange, type = "text", placeholder = "" }: {
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

export function Textarea({ value, onChange, rows = 3, placeholder = "" }: {
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

export function Select({ value, onChange, options }: {
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

export function SaveBtn({ onClick, loading, label = "Сохранить" }: { onClick: () => void; loading?: boolean; label?: string }) {
  return (
    <button onClick={onClick} disabled={loading} className="btn-primary text-xs px-6 py-2.5">
      {loading ? (
        <span className="flex items-center gap-2"><Icon name="Loader2" size={13} className="animate-spin" /> Сохранение...</span>
      ) : label}
    </button>
  );
}

export function CancelBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="btn-outline text-xs px-5 py-2.5">Отмена</button>
  );
}

export function Toast({ msg }: { msg: string }) {
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

export function PageTitle({ title, count, action }: { title: string; count?: number; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
      <h2 className="font-orbitron font-bold text-xl text-white">
        {title}{count !== undefined ? <span className="text-base ml-2 font-normal" style={{ color: "var(--razpc-muted)" }}>({count})</span> : null}
      </h2>
      {action}
    </div>
  );
}

export function EditForm({ title, onSave, onCancel, saving, children }: {
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

export function RowItem({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
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

export function EditBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="btn-outline text-xs px-3 py-1.5">Изменить</button>
  );
}

export function HideBtn({ onClick }: { onClick: () => void }) {
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

export function Badge({ label, color = "yellow" }: { label: string; color?: "yellow" | "green" | "red" | "gray" }) {
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
