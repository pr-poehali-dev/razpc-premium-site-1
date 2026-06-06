import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, IMAGES } from "@/lib/api";
import { useReveal } from "@/hooks/useReveal";

const FALLBACK_IMGS = [IMAGES.gaming, IMAGES.hero, IMAGES.workstation, IMAGES.cooling];

interface Product {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  specs: Record<string, string>;
  fps_data: Record<string, string>;
  price: number;
  old_price: number | null;
  status: string;
  image_url: string | null;
  cat_name: string;
}

export default function CatalogPreview() {
  const [products, setProducts] = useState<Product[]>([]);
  const ref = useReveal();

  useEffect(() => {
    api.getProducts(undefined, true).then(setProducts).catch(() => {});
  }, []);

  return (
    <section className="py-24" style={{ background: "var(--razpc-surface)" }}>
      <div className="container mx-auto px-6">
        <div ref={ref} className="reveal mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px" style={{ background: "var(--razpc-yellow)" }} />
              <span className="section-label">Каталог</span>
            </div>
            <h2 className="font-orbitron font-black text-3xl sm:text-4xl text-white">
              Готовые конфигурации<br />
              <span style={{ color: "var(--razpc-yellow)" }}>к выдаче</span>
            </h2>
          </div>
          <Link to="/catalog" className="btn-outline text-xs shrink-0">
            Весь каталог
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product: p, idx }: { product: Product; idx: number }) {
  const ref = useReveal();
  const img = p.image_url || FALLBACK_IMGS[idx % FALLBACK_IMGS.length];
  const specs = p.specs || {};
  const fps = p.fps_data || {};
  const fpsKeys = Object.keys(fps).slice(0, 2);

  return (
    <div
      ref={ref}
      className="reveal card-hover border group flex flex-col overflow-hidden"
      style={{
        background: "var(--razpc-card)",
        borderColor: "var(--razpc-border)",
        transitionDelay: `${idx * 0.08}s`,
      }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={img}
          alt={`${p.name} — купить ПК Краснодар`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--razpc-card) 0%, transparent 60%)" }} />

        {/* Status */}
        <div className="absolute top-3 left-3">
          <span
            className="px-2 py-1 text-[10px] font-orbitron font-bold uppercase tracking-widest"
            style={{
              background: p.status === "in_stock" ? "rgba(255,214,0,0.15)" : "rgba(255,255,255,0.08)",
              color: p.status === "in_stock" ? "var(--razpc-yellow)" : "var(--razpc-muted)",
              border: `1px solid ${p.status === "in_stock" ? "rgba(255,214,0,0.3)" : "rgba(255,255,255,0.1)"}`,
            }}
          >
            {p.status === "in_stock" ? "В наличии" : "Под заказ"}
          </span>
        </div>

        {p.cat_name && (
          <div className="absolute top-3 right-3">
            <span
              className="px-2 py-1 text-[10px] font-montserrat uppercase tracking-widest"
              style={{ background: "rgba(13,13,13,0.8)", color: "rgba(245,245,245,0.5)" }}
            >
              {p.cat_name}
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-orbitron font-bold text-sm text-white mb-1">{p.name}</h3>
        <p className="font-montserrat text-xs mb-4 line-clamp-2" style={{ color: "var(--razpc-muted)" }}>
          {p.short_description}
        </p>

        {/* Key specs */}
        {specs.gpu && (
          <div className="space-y-1 mb-4">
            {specs.gpu && <SpecRow label="GPU" val={specs.gpu} />}
            {specs.cpu && <SpecRow label="CPU" val={specs.cpu} />}
            {specs.ram && <SpecRow label="RAM" val={specs.ram} />}
          </div>
        )}

        {/* FPS */}
        {fpsKeys.length > 0 && (
          <div className="mb-4 flex gap-2 flex-wrap">
            {fpsKeys.map((game) => (
              <div
                key={game}
                className="px-2 py-1 text-[10px] font-orbitron"
                style={{ background: "rgba(255,214,0,0.06)", border: "1px solid rgba(255,214,0,0.12)", color: "var(--razpc-yellow)" }}
              >
                {fps[game]} · {game.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto">
          <div className="flex items-end justify-between mb-4">
            <div>
              {p.old_price && (
                <div className="font-montserrat text-xs line-through" style={{ color: "var(--razpc-muted)" }}>
                  {Number(p.old_price).toLocaleString("ru-RU")} ₽
                </div>
              )}
              <div className="font-orbitron font-black text-xl text-white">
                {Number(p.price).toLocaleString("ru-RU")} ₽
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Link to="/contacts" className="btn-primary flex-1 text-[11px] py-2.5">
              Купить
            </Link>
            <Link
              to="/contacts"
              className="btn-outline flex-1 text-[11px] py-2.5"
            >
              Консультация
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecRow({ label, val }: { label: string; val: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="font-orbitron text-[10px] uppercase tracking-widest" style={{ color: "var(--razpc-muted)" }}>{label}</span>
      <span className="font-montserrat text-[11px] text-white font-medium text-right max-w-[65%] truncate">{val}</span>
    </div>
  );
}
