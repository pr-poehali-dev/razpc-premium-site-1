import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api, IMAGES } from "@/lib/api";

export default function Hero() {
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    api.getContent().then(setContent).catch(() => {});
  }, []);

  const title = content.hero_title || "RAZPC МАСТЕРСКАЯ";
  const slogan = content.hero_slogan || "Собрано с точностью.";
  const subtitle = content.hero_subtitle || "Профессиональная сборка, модернизация и обслуживание ПК без компромиссов.";

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden hero-grid"
      style={{ background: "var(--razpc-black)" }}
      aria-label="Главный экран RazPC"
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 30% 50%, rgba(255,214,0,0.04) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 100% at 80% 50%, rgba(255,214,0,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-6 pt-20 pb-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-6 items-center min-h-[85vh]">
          {/* Left: content */}
          <div className="flex flex-col justify-center">
            {/* Label */}
            <div className="flex items-center gap-3 mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="w-8 h-px" style={{ background: "var(--razpc-yellow)" }} />
              <span className="section-label">Краснодар · Мастерская</span>
            </div>

            {/* H1 */}
            <h1
              className="font-orbitron font-black text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-none mb-4 animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              <span className="gradient-text">{title.split(" ")[0]}</span>
              <br />
              <span className="text-white">{title.split(" ").slice(1).join(" ")}</span>
            </h1>

            {/* Slogan */}
            <p
              className="font-orbitron text-xl sm:text-2xl lg:text-3xl font-light mb-6 animate-fade-up"
              style={{ color: "var(--razpc-yellow)", animationDelay: "0.3s" }}
            >
              «{slogan}»
            </p>

            {/* Subtitle */}
            <p
              className="font-montserrat text-base sm:text-lg leading-relaxed mb-10 animate-fade-up"
              style={{ color: "rgba(245,245,245,0.65)", maxWidth: 480, animationDelay: "0.4s" }}
            >
              {subtitle}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "0.5s" }}>
              <Link to="/contacts" className="btn-primary">
                Оставить заявку
              </Link>
              <Link to="/portfolio" className="btn-outline">
                Смотреть работы
              </Link>
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-3 gap-6 mt-14 pt-8 animate-fade-up"
              style={{ borderTop: "1px solid var(--razpc-border)", animationDelay: "0.6s" }}
            >
              {[
                { num: "200+", label: "Сборок" },
                { num: "5 лет", label: "Опыта" },
                { num: "100%", label: "Гарантия" },
              ].map((s) => (
                <div key={s.num}>
                  <div className="font-orbitron font-black text-2xl sm:text-3xl" style={{ color: "var(--razpc-yellow)" }}>
                    {s.num}
                  </div>
                  <div className="font-montserrat text-xs uppercase tracking-widest mt-1" style={{ color: "var(--razpc-muted)" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: PC image */}
          <div className="relative flex items-center justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="relative w-full max-w-lg mx-auto">
              {/* Glow behind image */}
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: "radial-gradient(ellipse 80% 60% at 50% 60%, rgba(255,214,0,0.15) 0%, transparent 70%)",
                  filter: "blur(30px)",
                  transform: "scale(1.1)",
                }}
              />

              <img
                src={IMAGES.hero}
                alt="Премиальная сборка ПК RazPC с водяным охлаждением, Краснодар"
                className="relative z-10 w-full object-cover rounded-2xl"
                style={{
                  aspectRatio: "4/5",
                  border: "1px solid rgba(255,214,0,0.12)",
                  boxShadow: "0 0 60px rgba(255,214,0,0.08), 0 40px 80px rgba(0,0,0,0.6)",
                }}
                loading="eager"
              />

              {/* Badge */}
              <div
                className="absolute bottom-6 left-6 z-20 px-4 py-3"
                style={{
                  background: "rgba(13,13,13,0.9)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,214,0,0.2)",
                }}
              >
                <div className="font-orbitron text-xs font-bold tracking-widest" style={{ color: "var(--razpc-yellow)" }}>
                  CUSTOM BUILD
                </div>
                <div className="font-montserrat text-xs mt-0.5" style={{ color: "var(--razpc-muted)" }}>
                  RTX 4090 · Custom Loop
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: "1s" }}>
        <span className="text-[10px] font-montserrat uppercase tracking-widest" style={{ color: "var(--razpc-muted)" }}>Scroll</span>
        <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, var(--razpc-yellow), transparent)" }} />
      </div>
    </section>
  );
}
