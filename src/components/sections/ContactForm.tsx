import { useState } from "react";
import { api } from "@/lib/api";
import { useReveal } from "@/hooks/useReveal";
import Icon from "@/components/ui/icon";

interface ContactFormProps {
  productName?: string;
  productId?: number;
  service?: string;
  title?: string;
  subtitle?: string;
}

export default function ContactForm({
  productName,
  productId,
  service,
  title = "Оставить заявку",
  subtitle = "Свяжемся в течение 15 минут. Без навязчивых звонков.",
}: ContactFormProps) {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const ref = useReveal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Укажите имя и телефон");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.submitOrder({
        name: form.name,
        phone: form.phone,
        message: form.message,
        service,
        product_id: productId,
        product_name: productName,
        source: "website",
      });
      setSent(true);
    } catch {
      setError("Ошибка отправки. Попробуйте позвонить нам напрямую.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={ref} className="reveal">
      {sent ? (
        <div
          className="p-8 border text-center"
          style={{ background: "var(--razpc-card)", borderColor: "rgba(255,214,0,0.2)" }}
        >
          <div
            className="w-16 h-16 mx-auto flex items-center justify-center mb-4"
            style={{ background: "rgba(255,214,0,0.1)", border: "1px solid rgba(255,214,0,0.2)" }}
          >
            <Icon name="Check" size={28} style={{ color: "var(--razpc-yellow)" }} />
          </div>
          <h3 className="font-orbitron font-bold text-lg text-white mb-2">Заявка принята</h3>
          <p className="font-montserrat text-sm" style={{ color: "var(--razpc-muted)" }}>
            Свяжемся с вами в течение 15 минут.
          </p>
        </div>
      ) : (
        <div className="border p-8" style={{ background: "var(--razpc-card)", borderColor: "var(--razpc-border)" }}>
          <h3 className="font-orbitron font-bold text-xl text-white mb-1">{title}</h3>
          <p className="font-montserrat text-sm mb-6" style={{ color: "var(--razpc-muted)" }}>{subtitle}</p>

          {productName && (
            <div
              className="mb-6 px-4 py-3 text-sm font-montserrat"
              style={{ background: "rgba(255,214,0,0.06)", border: "1px solid rgba(255,214,0,0.15)", color: "var(--razpc-yellow)" }}
            >
              Запрос по: <span className="font-bold">{productName}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-montserrat text-xs uppercase tracking-widest mb-1.5" style={{ color: "var(--razpc-muted)" }}>
                Имя *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ваше имя"
                className="w-full px-4 py-3 font-montserrat text-sm text-white outline-none transition-colors duration-200"
                style={{
                  background: "var(--razpc-surface)",
                  border: "1px solid var(--razpc-border)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,214,0,0.4)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--razpc-border)")}
              />
            </div>

            <div>
              <label className="block font-montserrat text-xs uppercase tracking-widest mb-1.5" style={{ color: "var(--razpc-muted)" }}>
                Телефон *
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+7 (___) ___-__-__"
                className="w-full px-4 py-3 font-montserrat text-sm text-white outline-none transition-colors duration-200"
                style={{
                  background: "var(--razpc-surface)",
                  border: "1px solid var(--razpc-border)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,214,0,0.4)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--razpc-border)")}
              />
            </div>

            <div>
              <label className="block font-montserrat text-xs uppercase tracking-widest mb-1.5" style={{ color: "var(--razpc-muted)" }}>
                Сообщение
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Расскажите о задаче, бюджете, предпочтениях..."
                rows={4}
                className="w-full px-4 py-3 font-montserrat text-sm text-white outline-none transition-colors duration-200 resize-none"
                style={{
                  background: "var(--razpc-surface)",
                  border: "1px solid var(--razpc-border)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,214,0,0.4)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--razpc-border)")}
              />
            </div>

            {error && (
              <p className="font-montserrat text-sm" style={{ color: "#ff5555" }}>{error}</p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  Отправка...
                </span>
              ) : (
                "Отправить заявку"
              )}
            </button>

            <p className="font-montserrat text-[11px] text-center" style={{ color: "var(--razpc-muted)" }}>
              Нажимая кнопку, вы соглашаетесь на обработку персональных данных
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
