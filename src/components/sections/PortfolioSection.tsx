import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, IMAGES } from "@/lib/api";
import { useReveal } from "@/hooks/useReveal";

const FALLBACK_IMGS = [IMAGES.hero, IMAGES.cooling, IMAGES.gaming, IMAGES.workstation];

interface PortfolioItem {
  id: number;
  title: string;
  client_task: string;
  specs: string;
  image_url: string | null;
  category: string;
}

export default function PortfolioSection() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const ref = useReveal();

  useEffect(() => {
    api.getPortfolio().then(setItems).catch(() => {});
  }, []);

  return (
    <section className="py-24" style={{ background: "var(--razpc-black)" }}>
      <div className="container mx-auto px-6">
        <div ref={ref} className="reveal mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px" style={{ background: "var(--razpc-yellow)" }} />
              <span className="section-label">Портфолио</span>
            </div>
            <h2 className="font-orbitron font-black text-3xl sm:text-4xl text-white">
              Работы<br />
              <span style={{ color: "var(--razpc-yellow)" }}>которыми мы гордимся</span>
            </h2>
          </div>
          <Link to="/portfolio" className="btn-outline text-xs shrink-0">
            Все работы
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {items.map((item, i) => (
            <PortfolioCard key={item.id} item={item} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PortfolioCard({ item, idx }: { item: PortfolioItem; idx: number }) {
  const ref = useReveal();
  const img = item.image_url || FALLBACK_IMGS[idx % FALLBACK_IMGS.length];

  return (
    <div
      ref={ref}
      className="reveal group relative overflow-hidden cursor-pointer border"
      style={{
        background: "var(--razpc-card)",
        borderColor: "var(--razpc-border)",
        aspectRatio: "3/4",
        transitionDelay: `${idx * 0.1}s`,
        transition: "border-color 0.3s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,214,0,0.3)"}
      onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.borderColor = "var(--razpc-border)"}
    >
      <img
        src={img}
        alt={`${item.title} — портфолио RazPC`}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ background: "linear-gradient(to top, rgba(13,13,13,0.95) 30%, rgba(13,13,13,0.3) 100%)" }}
      />

      {/* Hover overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "rgba(255,214,0,0.05)" }}
      />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        {item.category && (
          <div className="text-[10px] font-orbitron uppercase tracking-widest mb-2" style={{ color: "var(--razpc-yellow)" }}>
            {item.category}
          </div>
        )}
        <h3 className="font-orbitron font-bold text-sm text-white mb-1">{item.title}</h3>
        {item.specs && (
          <p className="font-montserrat text-xs leading-relaxed" style={{ color: "rgba(245,245,245,0.6)" }}>
            {item.specs}
          </p>
        )}
        <p
          className="font-montserrat text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2"
          style={{ color: "rgba(245,245,245,0.5)" }}
        >
          {item.client_task}
        </p>
      </div>
    </div>
  );
}
