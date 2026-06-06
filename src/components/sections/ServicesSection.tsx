import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, IMAGES } from "@/lib/api";
import { useReveal } from "@/hooks/useReveal";
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
  icon: string;
  price_from: number | null;
  image_url: string | null;
}

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const ref = useReveal();

  useEffect(() => {
    api.getServices().then(setServices).catch(() => {});
  }, []);

  return (
    <section className="py-24" style={{ background: "var(--razpc-black)" }}>
      <div className="container mx-auto px-6">
        <div ref={ref} className="reveal mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px" style={{ background: "var(--razpc-yellow)" }} />
              <span className="section-label">Услуги</span>
            </div>
            <h2 className="font-orbitron font-black text-3xl sm:text-4xl text-white">
              Что мы делаем<br />
              <span style={{ color: "var(--razpc-yellow)" }}>лучше всего</span>
            </h2>
          </div>
          <Link to="/services" className="btn-outline text-xs shrink-0">
            Все услуги
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.slice(0, 6).map((svc, i) => (
            <ServiceCard key={svc.id} svc={svc} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ svc, delay }: { svc: Service; delay: number }) {
  const ref = useReveal();
  const img = svc.image_url || SERVICE_IMAGES[svc.slug] || IMAGES.gaming;

  return (
    <div
      ref={ref}
      className="reveal card-hover group border overflow-hidden"
      style={{
        background: "var(--razpc-card)",
        borderColor: "var(--razpc-border)",
        transitionDelay: `${delay}s`,
      }}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={img}
          alt={`${svc.name} — RazPC Краснодар`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--razpc-card) 0%, transparent 60%)" }} />
        <div
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center"
          style={{ background: "rgba(255,214,0,0.1)", border: "1px solid rgba(255,214,0,0.2)" }}
        >
          <Icon name={svc.icon || "Cpu"} size={16} style={{ color: "var(--razpc-yellow)" }} />
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-orbitron font-bold text-base text-white mb-2">{svc.name}</h3>
        <p className="font-montserrat text-sm leading-relaxed mb-4" style={{ color: "var(--razpc-muted)" }}>
          {svc.short_description}
        </p>
        {svc.price_from && (
          <div className="flex items-center justify-between">
            <span className="font-montserrat text-xs" style={{ color: "var(--razpc-muted)" }}>
              от <span className="font-bold text-white">{svc.price_from.toLocaleString("ru-RU")} ₽</span>
            </span>
            <Link
              to="/contacts"
              className="text-xs font-orbitron font-semibold uppercase tracking-widest transition-colors duration-200"
              style={{ color: "var(--razpc-yellow)" }}
            >
              Заказать →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
