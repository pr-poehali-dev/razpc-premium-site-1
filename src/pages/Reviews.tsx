import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { api } from "@/lib/api";
import { useReveal } from "@/hooks/useReveal";
import ContactForm from "@/components/sections/ContactForm";

interface Review {
  id: number; author_name: string; author_city: string;
  text: string; product_name: string | null;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const ref = useReveal();

  useEffect(() => {
    api.getReviews().then(setReviews).catch(() => {});
  }, []);

  return (
    <Layout>
      <div className="pt-20">
        <section className="py-24 hero-grid" style={{ background: "var(--razpc-black)" }}>
          <div className="container mx-auto px-6">
            <div ref={ref} className="reveal max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px" style={{ background: "var(--razpc-yellow)" }} />
                <span className="section-label">Отзывы</span>
              </div>
              <h1 className="font-orbitron font-black text-4xl sm:text-5xl text-white mb-4">
                Что говорят<br />
                <span style={{ color: "var(--razpc-yellow)" }}>наши клиенты</span>
              </h1>
              <p className="font-montserrat text-lg leading-relaxed" style={{ color: "rgba(245,245,245,0.65)" }}>
                Настоящие отзывы от людей, которым мы собрали компьютеры.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16" style={{ background: "var(--razpc-dark)" }}>
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((r, i) => (
                <ReviewCard key={r.id} review={r} delay={i * 0.08} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-24" style={{ background: "var(--razpc-black)" }}>
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="font-orbitron font-black text-3xl text-white mb-4">Стать следующим?</h2>
                <p className="font-montserrat text-base leading-relaxed" style={{ color: "rgba(245,245,245,0.6)" }}>
                  Оставьте заявку и мы соберём вам идеальный ПК.
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

function ReviewCard({ review: r, delay }: { review: Review; delay: number }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="reveal card-hover border p-6"
      style={{ background: "var(--razpc-card)", borderColor: "var(--razpc-border)", transitionDelay: `${delay}s` }}
    >
      <div className="font-orbitron text-5xl font-black leading-none mb-4" style={{ color: "rgba(255,214,0,0.15)" }}>"</div>
      <p className="font-montserrat text-sm leading-relaxed mb-6" style={{ color: "rgba(245,245,245,0.75)" }}>{r.text}</p>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-orbitron font-bold text-xs text-white">{r.author_name}</div>
          {r.author_city && <div className="font-montserrat text-[11px] mt-0.5" style={{ color: "var(--razpc-muted)" }}>{r.author_city}</div>}
        </div>
        {r.product_name && (
          <span className="px-2 py-1 text-[10px] font-orbitron uppercase tracking-widest"
            style={{ background: "rgba(255,214,0,0.06)", border: "1px solid rgba(255,214,0,0.12)", color: "var(--razpc-yellow)" }}>
            {r.product_name}
          </span>
        )}
      </div>
    </div>
  );
}
