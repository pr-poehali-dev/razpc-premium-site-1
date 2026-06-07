import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Footer() {
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    api.getContent().then(setContent).catch(() => {});
  }, []);

  const phone = content.phone || "+7 (988) 000-00-00";
  const email = content.email || "info@razpc.ru";
  const address = content.address || "Краснодар";
  const tg = content.telegram || "#";
  const wa = content.whatsapp || "#";
  const vk = content.vk || "#";

  return (
    <footer
      style={{ background: "var(--razpc-dark)", borderTop: "1px solid var(--razpc-border)" }}
      itemScope
      itemType="https://schema.org/LocalBusiness"
    >
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-1 mb-4">
              <span className="font-orbitron font-black text-2xl" style={{ color: "var(--razpc-yellow)" }}>RAZ</span>
              <span className="font-orbitron font-black text-2xl text-white">PC</span>
            </Link>
            <p className="text-sm font-montserrat leading-relaxed mb-6" style={{ color: "var(--razpc-muted)", maxWidth: 320 }}>
              Профессиональная мастерская по сборке, апгрейду и обслуживанию компьютеров в Краснодаре. Без компромиссов.
            </p>
            <div className="flex gap-3">
              {[
                { href: tg, icon: "Send", label: "Telegram" },
                { href: wa, icon: "MessageCircle", label: "WhatsApp" },
                { href: vk, icon: "Users", label: "ВКонтакте" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 flex items-center justify-center transition-all duration-200"
                  style={{
                    background: "var(--razpc-surface)",
                    border: "1px solid var(--razpc-border)",
                    color: "var(--razpc-muted)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--razpc-yellow)";
                    (e.currentTarget as HTMLElement).style.color = "var(--razpc-yellow)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--razpc-border)";
                    (e.currentTarget as HTMLElement).style.color = "var(--razpc-muted)";
                  }}
                >
                  <Icon name={s.icon} size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-orbitron text-xs uppercase tracking-widest mb-5 text-white">Навигация</h4>
            <ul className="space-y-2.5">
              {[
                ["Главная", "/"],
                ["О мастерской", "/about"],
                ["Услуги", "/services"],
                ["Каталог ПК", "/catalog"],
                ["Портфолио", "/portfolio"],
                ["Отзывы", "/reviews"],
                ["Статьи", "/blog"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="text-sm font-montserrat transition-colors duration-200"
                    style={{ color: "var(--razpc-muted)" }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = "var(--razpc-yellow)"}
                    onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = "var(--razpc-muted)"}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-orbitron text-xs uppercase tracking-widest mb-5 text-white">Контакты</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-sm font-montserrat transition-colors duration-200"
                  style={{ color: "var(--razpc-muted)" }}
                  itemProp="telephone"
                >
                  <Icon name="Phone" size={14} />
                  <span>{phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 text-sm font-montserrat transition-colors duration-200"
                  style={{ color: "var(--razpc-muted)" }}
                  itemProp="email"
                >
                  <Icon name="Mail" size={14} />
                  <span>{email}</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm font-montserrat" style={{ color: "var(--razpc-muted)" }}>
                <Icon name="MapPin" size={14} className="mt-0.5 flex-shrink-0" />
                <span itemProp="address">{address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid var(--razpc-border)" }}
        >
          <p className="text-xs font-montserrat" style={{ color: "var(--razpc-muted)" }}>
            © {new Date().getFullYear()} RazPC. Профессиональная сборка ПК в Краснодаре.
          </p>
          <div className="flex items-center gap-5">
            <p className="text-xs font-montserrat" style={{ color: "var(--razpc-muted)" }}>
              Сборка ПК · Апгрейд · Диагностика · Краснодар
            </p>
            <Link
              to="/admin"
              className="text-[10px] font-montserrat transition-all duration-300"
              style={{ color: "var(--razpc-muted)", opacity: 0.3 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.color = "var(--razpc-yellow)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.3"; (e.currentTarget as HTMLElement).style.color = "var(--razpc-muted)"; }}
            >
              Управление сайтом
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}