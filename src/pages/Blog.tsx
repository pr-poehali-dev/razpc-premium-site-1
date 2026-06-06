import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { api } from "@/lib/api";
import { useReveal } from "@/hooks/useReveal";
import { IMAGES } from "@/lib/api";

interface Article {
  id: number; title: string; slug: string;
  excerpt: string; image_url: string | null;
  published_at: string | null;
}

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>([]);
  const ref = useReveal();

  useEffect(() => {
    api.getArticles().then(setArticles).catch(() => {});
  }, []);

  return (
    <Layout>
      <div className="pt-20">
        <section className="py-24 hero-grid" style={{ background: "var(--razpc-black)" }}>
          <div className="container mx-auto px-6">
            <div ref={ref} className="reveal max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px" style={{ background: "var(--razpc-yellow)" }} />
                <span className="section-label">Статьи</span>
              </div>
              <h1 className="font-orbitron font-black text-4xl sm:text-5xl text-white mb-4">
                Блог о ПК<br />
                <span style={{ color: "var(--razpc-yellow)" }}>и технологиях</span>
              </h1>
              <p className="font-montserrat text-lg leading-relaxed" style={{ color: "rgba(245,245,245,0.65)" }}>
                Полезные материалы о сборке, выборе комплектующих, разгоне и оптимизации.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16" style={{ background: "var(--razpc-dark)" }}>
          <div className="container mx-auto px-6">
            {articles.length === 0 ? (
              <div
                className="border p-16 text-center"
                style={{ background: "var(--razpc-card)", borderColor: "var(--razpc-border)" }}
              >
                <div className="font-orbitron font-bold text-xl text-white mb-3">Статьи скоро появятся</div>
                <p className="font-montserrat text-sm" style={{ color: "var(--razpc-muted)" }}>
                  Готовим полезные материалы о сборке ПК, выборе комплектующих и оптимизации.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((a, i) => (
                  <ArticleCard key={a.id} article={a} idx={i} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}

function ArticleCard({ article: a, idx }: { article: Article; idx: number }) {
  const ref = useReveal();
  const img = a.image_url || [IMAGES.gaming, IMAGES.hero, IMAGES.cooling][idx % 3];

  return (
    <div
      ref={ref}
      className="reveal card-hover border overflow-hidden group"
      style={{ background: "var(--razpc-card)", borderColor: "var(--razpc-border)", transitionDelay: `${idx * 0.08}s` }}
    >
      <div className="relative h-48 overflow-hidden">
        <img src={img} alt={a.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--razpc-card) 0%, transparent 60%)" }} />
      </div>
      <div className="p-5">
        {a.published_at && (
          <div className="font-orbitron text-[10px] uppercase tracking-widest mb-2" style={{ color: "var(--razpc-muted)" }}>
            {new Date(a.published_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
          </div>
        )}
        <h2 className="font-orbitron font-bold text-sm text-white mb-2 line-clamp-2">{a.title}</h2>
        {a.excerpt && (
          <p className="font-montserrat text-xs leading-relaxed line-clamp-3" style={{ color: "var(--razpc-muted)" }}>{a.excerpt}</p>
        )}
        <div className="mt-4">
          <span className="font-orbitron text-xs uppercase tracking-widest transition-colors duration-200" style={{ color: "var(--razpc-yellow)" }}>
            Читать →
          </span>
        </div>
      </div>
    </div>
  );
}
