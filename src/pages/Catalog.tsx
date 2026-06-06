import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { api, IMAGES } from "@/lib/api";
import { useReveal } from "@/hooks/useReveal";
import ContactForm from "@/components/sections/ContactForm";

const FALLBACK_IMGS = [IMAGES.gaming, IMAGES.hero, IMAGES.workstation, IMAGES.cooling];

interface Category { id: number; name: string; slug: string; }
interface Product {
  id: number; name: string; slug: string; short_description: string;
  specs: Record<string, string>; fps_data: Record<string, string>;
  price: number; old_price: number | null; status: string;
  image_url: string | null; cat_name: string; cat_slug: string;
}

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [active, setActive] = useState("all");
  const [selected, setSelected] = useState<Product | null>(null);
  const ref = useReveal();

  useEffect(() => {
    Promise.all([api.getCategories(), api.getProducts()]).then(([cats, prods]) => {
      setCategories(cats);
      setProducts(prods);
    }).catch(() => {});
  }, []);

  const filtered = active === "all" ? products : products.filter(p => p.cat_slug === active);

  return (
    <Layout>
      <div className="pt-20">
        <section className="py-24 hero-grid" style={{ background: "var(--razpc-black)" }}>
          <div className="container mx-auto px-6">
            <div ref={ref} className="reveal">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px" style={{ background: "var(--razpc-yellow)" }} />
                <span className="section-label">Каталог</span>
              </div>
              <h1 className="font-orbitron font-black text-4xl sm:text-5xl text-white mb-4">
                Готовые конфигурации<br />
                <span style={{ color: "var(--razpc-yellow)" }}>к выдаче</span>
              </h1>
              <p className="font-montserrat text-lg leading-relaxed" style={{ color: "rgba(245,245,245,0.65)", maxWidth: 540 }}>
                Проверенные сборки с гарантией. Каждый ПК прошёл стресс-тест.
                Доступны под заказ с любыми модификациями.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16" style={{ background: "var(--razpc-dark)" }}>
          <div className="container mx-auto px-6">
            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2 mb-10">
              <FilterBtn label="Все" slug="all" active={active} onClick={setActive} />
              {categories.map(c => (
                <FilterBtn key={c.id} label={c.name} slug={c.slug} active={active} onClick={setActive} />
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  idx={i}
                  onConsult={() => setSelected(p)}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <p className="font-montserrat text-sm" style={{ color: "var(--razpc-muted)" }}>
                  Товары в этой категории скоро появятся
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Modal for consultation */}
        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
            onClick={() => setSelected(null)}
          >
            <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
              <ContactForm
                productName={selected.name}
                productId={selected.id}
                title="Консультация по товару"
                subtitle={`${selected.name} · ${Number(selected.price).toLocaleString("ru-RU")} ₽`}
              />
            </div>
          </div>
        )}

        <section className="py-24" style={{ background: "var(--razpc-black)" }}>
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="font-orbitron font-black text-3xl text-white mb-4">
                  Нужна другая конфигурация?
                </h2>
                <p className="font-montserrat text-base leading-relaxed" style={{ color: "rgba(245,245,245,0.6)" }}>
                  Соберём под ваши задачи и бюджет. Любые пожелания по железу, корпусу, охлаждению.
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

function FilterBtn({ label, slug, active, onClick }: { label: string; slug: string; active: string; onClick: (s: string) => void }) {
  const isActive = active === slug;
  return (
    <button
      onClick={() => onClick(slug)}
      className="px-4 py-2 font-orbitron text-xs uppercase tracking-widest transition-all duration-200 border"
      style={{
        background: isActive ? "var(--razpc-yellow)" : "transparent",
        color: isActive ? "var(--razpc-black)" : "var(--razpc-muted)",
        borderColor: isActive ? "var(--razpc-yellow)" : "var(--razpc-border)",
      }}
    >
      {label}
    </button>
  );
}

function ProductCard({ product: p, idx, onConsult }: { product: Product; idx: number; onConsult: () => void }) {
  const ref = useReveal();
  const img = p.image_url || FALLBACK_IMGS[idx % FALLBACK_IMGS.length];
  const specs = p.specs || {};
  const fps = p.fps_data || {};
  const fpsKeys = Object.keys(fps).slice(0, 3);

  return (
    <div
      ref={ref}
      className="reveal card-hover border group flex flex-col overflow-hidden"
      style={{ background: "var(--razpc-card)", borderColor: "var(--razpc-border)", transitionDelay: `${idx * 0.06}s` }}
    >
      <div className="relative h-44 overflow-hidden">
        <img src={img} alt={`${p.name} — купить ПК Краснодар`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--razpc-card) 0%, transparent 60%)" }} />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 text-[10px] font-orbitron uppercase tracking-widest"
            style={{ background: p.status === "in_stock" ? "rgba(255,214,0,0.15)" : "rgba(255,255,255,0.08)", color: p.status === "in_stock" ? "var(--razpc-yellow)" : "var(--razpc-muted)", border: `1px solid ${p.status === "in_stock" ? "rgba(255,214,0,0.3)" : "var(--razpc-border)"}` }}>
            {p.status === "in_stock" ? "В наличии" : "Под заказ"}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h2 className="font-orbitron font-bold text-sm text-white mb-1">{p.name}</h2>
        <p className="font-montserrat text-xs mb-4 line-clamp-2" style={{ color: "var(--razpc-muted)" }}>{p.short_description}</p>

        {specs.gpu && (
          <div className="space-y-1 mb-3">
            {[["GPU", specs.gpu], ["CPU", specs.cpu], ["RAM", specs.ram]].filter(([, v]) => v).map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="font-orbitron text-[10px] uppercase tracking-widest" style={{ color: "var(--razpc-muted)" }}>{k}</span>
                <span className="font-montserrat text-[11px] text-white font-medium max-w-[65%] truncate text-right">{v}</span>
              </div>
            ))}
          </div>
        )}

        {fpsKeys.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {fpsKeys.map(game => (
              <span key={game} className="px-2 py-0.5 text-[10px] font-orbitron"
                style={{ background: "rgba(255,214,0,0.06)", border: "1px solid rgba(255,214,0,0.12)", color: "var(--razpc-yellow)" }}>
                {fps[game]} · {game.split("_")[0].replace(/\b\w/g, c => c.toUpperCase())}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto">
          <div className="mb-4">
            {p.old_price && (
              <div className="font-montserrat text-xs line-through" style={{ color: "var(--razpc-muted)" }}>
                {Number(p.old_price).toLocaleString("ru-RU")} ₽
              </div>
            )}
            <div className="font-orbitron font-black text-2xl text-white">
              {Number(p.price).toLocaleString("ru-RU")} ₽
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={onConsult} className="btn-primary flex-1 text-[11px] py-2.5">Купить</button>
            <button onClick={onConsult} className="btn-outline flex-1 text-[11px] py-2.5">Консультация</button>
          </div>
        </div>
      </div>
    </div>
  );
}
