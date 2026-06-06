import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { api } from "@/lib/api";
import { useReveal } from "@/hooks/useReveal";
import ContactForm from "@/components/sections/ContactForm";
import Icon from "@/components/ui/icon";

export default function Contacts() {
  const [content, setContent] = useState<Record<string, string>>({});
  const ref = useReveal();

  useEffect(() => {
    api.getContent().then(setContent).catch(() => {});
  }, []);

  const phone = content.phone || "+7 (988) 000-00-00";
  const email = content.email || "info@razpc.ru";
  const address = content.address || "Краснодар, ул. Красная, 1";
  const hours = content.work_hours || "Пн-Вс: 09:00–21:00";
  const tg = content.telegram || "#";
  const wa = content.whatsapp || "#";
  const vk = content.vk || "#";

  return (
    <Layout>
      <div className="pt-20">
        <section className="py-24 hero-grid" style={{ background: "var(--razpc-black)" }}>
          <div className="container mx-auto px-6">
            <div ref={ref} className="reveal max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px" style={{ background: "var(--razpc-yellow)" }} />
                <span className="section-label">Контакты</span>
              </div>
              <h1 className="font-orbitron font-black text-4xl sm:text-5xl text-white mb-4">
                Свяжитесь<br />
                <span style={{ color: "var(--razpc-yellow)" }}>с нами</span>
              </h1>
              <p className="font-montserrat text-lg leading-relaxed" style={{ color: "rgba(245,245,245,0.65)" }}>
                Ответим в течение 15 минут в рабочее время. Работаем с клиентами по всему Краснодару.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20" style={{ background: "var(--razpc-dark)" }}>
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contacts info */}
              <div>
                <h2 className="font-orbitron font-bold text-2xl text-white mb-8">Контактная информация</h2>

                <div className="space-y-4 mb-10">
                  {[
                    { icon: "Phone", label: "Телефон", val: phone, href: `tel:${phone.replace(/\s/g, "")}` },
                    { icon: "Mail", label: "Email", val: email, href: `mailto:${email}` },
                    { icon: "MapPin", label: "Адрес", val: address, href: null },
                    { icon: "Clock", label: "Режим работы", val: hours, href: null },
                  ].map((c) => (
                    <ContactRow key={c.label} icon={c.icon} label={c.label} val={c.val} href={c.href} />
                  ))}
                </div>

                {/* Social */}
                <h3 className="font-orbitron text-xs uppercase tracking-widest mb-4 text-white">Мессенджеры</h3>
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
                      className="flex items-center gap-2 px-4 py-3 text-sm font-montserrat transition-all duration-200 border"
                      style={{ background: "var(--razpc-card)", borderColor: "var(--razpc-border)", color: "var(--razpc-muted)" }}
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
                      <span>{s.label}</span>
                    </a>
                  ))}
                </div>

                {/* SEO block */}
                <div
                  className="mt-10 p-6 border"
                  style={{ background: "var(--razpc-card)", borderColor: "var(--razpc-border)" }}
                >
                  <h3 className="font-orbitron font-bold text-sm text-white mb-3">Сборка ПК в Краснодаре</h3>
                  <p className="font-montserrat text-sm leading-relaxed" style={{ color: "var(--razpc-muted)" }}>
                    Принимаем заявки на сборку, апгрейд и диагностику. Работаем по Краснодару
                    и Краснодарскому краю. Звоните или пишите — ответим быстро.
                  </p>
                </div>
              </div>

              {/* Form */}
              <ContactForm
                title="Оставить заявку"
                subtitle="Опишите задачу — подберём решение бесплатно."
              />
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

function ContactRow({ icon, label, val, href }: { icon: string; label: string; val: string; href: string | null }) {
  const ref = useReveal();
  const content = (
    <div className="flex items-start gap-4 p-4 border card-hover" style={{ background: "var(--razpc-card)", borderColor: "var(--razpc-border)" }}>
      <div className="w-10 h-10 flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,214,0,0.08)", border: "1px solid rgba(255,214,0,0.15)" }}>
        <Icon name={icon} size={18} style={{ color: "var(--razpc-yellow)" }} />
      </div>
      <div>
        <div className="font-orbitron text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--razpc-muted)" }}>{label}</div>
        <div className="font-montserrat text-sm text-white">{val}</div>
      </div>
    </div>
  );

  return (
    <div ref={ref} className="reveal">
      {href ? <a href={href}>{content}</a> : content}
    </div>
  );
}
