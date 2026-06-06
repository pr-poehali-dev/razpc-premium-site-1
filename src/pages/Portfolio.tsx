import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { api, IMAGES } from "@/lib/api";
import { useReveal } from "@/hooks/useReveal";
import ContactForm from "@/components/sections/ContactForm";

const FALLBACK_IMGS = [IMAGES.hero, IMAGES.cooling, IMAGES.gaming, IMAGES.workstation];

interface PortfolioItem {
  id: number; title: string; client_task: string;
  specs: string; image_url: string | null; category: string;
}

export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [filter, setFilter] = useState("all");
  const ref = useReveal();

  useEffect(() => {
    api.getPortfolio().then(setItems).catch(() => {});
  }, []);

  const cats = ["all", ...Array.from(new Set(items.map(i => i.category).filter(Boolean)))];
  const filtered = filter === "all" ? items : items.filter(i => i.category === filter);

  return (
    <Layout>
      <div className="pt-20">
        <section className="py-24 hero-grid" style={{ background: "var(--razpc-black)" }}>
          <div className="container mx-auto px-6">
            <div ref={ref} className="reveal max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px" style={{ background: "var(--razpc-yellow)" }} />
                <span className="section-label">Портфолио</span>
              </div>
              <h1 className="font-orbitron font-black text-4xl sm:text-5xl text-white mb-4">
                Работы,<br />
                <span style={{ color: "var(--razpc-yellow)" }}>которыми гордимся</span>
              </h1>
              <p className="font-montserrat text-lg leading-relaxed" style={{ color: "rgba(245,245,245,0.65)" }}>
                Каждая сборка — отдельный проект. Смотрите детали, характеристики и задачи клиентов.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16" style={{ background: "var(--razpc-dark)" }}>
          <div className="container mx-auto px-6">
            {/* Filter */}
            <div className="flex flex-wrap gap-2 mb-10">
              {cats.map(c => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className="px-4 py-2 font-orbitron text-xs uppercase tracking-widest transition-all duration-200 border"
                  style={{
                    background: filter === c ? "var(--razpc-yellow)" : "transparent",
                    color: filter === c ? "var(--razpc-black)" : "var(--razpc-muted)",
                    borderColor: filter === c ? "var(--razpc-yellow)" : "var(--razpc-border)",
                  }}
                >
                  {c === "all" ? "Все" : c}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((item, i) => (
                <PortfolioCard key={item.id} item={item} idx={i} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-24" style={{ background: "var(--razpc-black)" }}>
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="font-orbitron font-black text-3xl text-white mb-4">
                  Хотите такую же сборку?
                </h2>
                <p className="font-montserrat text-base leading-relaxed" style={{ color: "rgba(245,245,245,0.6)" }}>
                  Опишите задачу — создадим уникальный ПК под ваш стиль и требования.
                </p>
              </div>
              <ContactForm title="Заказать сборку" service="Сборка ПК" />
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

function PortfolioCard({ item, idx }: { item: PortfolioItem; idx: number }) {
  const ref = useReveal();
  const img = item.image_url || FALLBACK_IMGS[idx % FALLBACK_IMGS.length];
  return (
    <div
      ref={ref}
      className="reveal group relative overflow-hidden border cursor-pointer"
      style={{ background: "var(--razpc-card)", borderColor: "var(--razpc-border)", aspectRatio: "4/3", transitionDelay: `${idx * 0.08}s`, transition: "border-color 0.3s" }}
      onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,214,0,0.3)"}
      onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.borderColor = "var(--razpc-border)"}
    >
      <img src={img} alt={`${item.title} — портфолио RazPC`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,13,13,0.95) 30%, rgba(13,13,13,0.2) 100%)" }} />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "rgba(255,214,0,0.04)" }} />

      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        {item.category && (
          <div className="text-[10px] font-orbitron uppercase tracking-widest mb-1.5" style={{ color: "var(--razpc-yellow)" }}>{item.category}</div>
        )}
        <h3 className="font-orbitron font-bold text-sm text-white mb-1">{item.title}</h3>
        {item.specs && <p className="font-montserrat text-xs" style={{ color: "rgba(245,245,245,0.6)" }}>{item.specs}</p>}
        <p className="font-montserrat text-xs mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: "rgba(245,245,245,0.5)" }}>
          {item.client_task}
        </p>
      </div>
    </div>
  );
}
