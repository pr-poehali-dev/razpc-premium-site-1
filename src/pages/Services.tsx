import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { api, IMAGES } from "@/lib/api";
import { useReveal } from "@/hooks/useReveal";
import ContactForm from "@/components/sections/ContactForm";
import Steps from "@/components/sections/Steps";
import Icon from "@/components/ui/icon";

const SERVICE_IMAGES: Record<string, string> = {
  "sborka-pk": IMAGES.gaming,
  "apgrejd-pk": IMAGES.workstation,
  "kastom-cooling": IMAGES.cooling,
  "diagnostika": IMAGES.workstation,
  "nastrojka": IMAGES.gaming,
};

interface Service {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  icon: string;
  price_from: number | null;
  image_url: string | null;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const ref = useReveal();

  useEffect(() => {
    api.getServices().then(setServices).catch(() => {});
  }, []);

  return (
    <Layout>
      <div className="pt-20">
        <section className="py-24 hero-grid" style={{ background: "var(--razpc-black)" }}>
          <div className="container mx-auto px-6">
            <div ref={ref} className="reveal max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px" style={{ background: "var(--razpc-yellow)" }} />
                <span className="section-label">Услуги</span>
              </div>
              <h1 className="font-orbitron font-black text-4xl sm:text-5xl text-white mb-4">
                Что мы делаем<br />
                <span style={{ color: "var(--razpc-yellow)" }}>лучше всего</span>
              </h1>
              <p className="font-montserrat text-lg leading-relaxed" style={{ color: "rgba(245,245,245,0.65)" }}>
                Сборка, апгрейд, диагностика, кастомное охлаждение и тонкая настройка — полный цикл работы с вашим ПК в Краснодаре.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20" style={{ background: "var(--razpc-dark)" }}>
          <div className="container mx-auto px-6">
            <div className="space-y-6">
              {services.map((svc, i) => (
                <ServiceRow key={svc.id} svc={svc} idx={i} />
              ))}
            </div>
          </div>
        </section>

        <Steps />

        <section className="py-24" style={{ background: "var(--razpc-black)" }}>
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="font-orbitron font-black text-3xl text-white mb-4">
                  Записаться на услугу
                </h2>
                <p className="font-montserrat text-base leading-relaxed" style={{ color: "rgba(245,245,245,0.6)" }}>
                  Опишите задачу — рассчитаем стоимость и сроки. Первая консультация бесплатно.
                </p>
              </div>
              <ContactForm title="Заявка на услугу" />
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

function ServiceRow({ svc, idx }: { svc: Service; idx: number }) {
  const ref = useReveal();
  const img = svc.image_url || SERVICE_IMAGES[svc.slug] || IMAGES.gaming;
  const even = idx % 2 === 0;

  return (
    <div
      ref={ref}
      className={`reveal border grid lg:grid-cols-2 overflow-hidden ${even ? "" : "lg:grid-flow-col-dense"}`}
      style={{ background: "var(--razpc-card)", borderColor: "var(--razpc-border)", transitionDelay: `${idx * 0.1}s` }}
    >
      <div className={`relative h-56 lg:h-auto overflow-hidden ${!even ? "lg:col-start-2" : ""}`}>
        <img
          src={img}
          alt={`${svc.name} — RazPC Краснодар`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ background: even ? "linear-gradient(to right, var(--razpc-card) 0%, transparent 80%)" : "linear-gradient(to left, var(--razpc-card) 0%, transparent 80%)" }} />
      </div>
      <div className={`p-8 lg:p-10 flex flex-col justify-center ${!even ? "lg:col-start-1" : ""}`}>
        <div
          className="w-10 h-10 flex items-center justify-center mb-4"
          style={{ background: "rgba(255,214,0,0.08)", border: "1px solid rgba(255,214,0,0.15)" }}
        >
          <Icon name={svc.icon || "Cpu"} size={18} style={{ color: "var(--razpc-yellow)" }} />
        </div>
        <h2 className="font-orbitron font-bold text-xl text-white mb-3">{svc.name}</h2>
        <p className="font-montserrat text-sm leading-relaxed mb-6" style={{ color: "rgba(245,245,245,0.65)" }}>
          {svc.description || svc.short_description}
        </p>
        {svc.price_from && (
          <div className="flex items-center gap-4">
            <span className="font-montserrat text-sm" style={{ color: "var(--razpc-muted)" }}>
              от <span className="font-orbitron font-bold text-lg text-white">{Number(svc.price_from).toLocaleString("ru-RU")} ₽</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
