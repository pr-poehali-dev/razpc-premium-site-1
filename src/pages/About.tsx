import Layout from "@/components/layout/Layout";
import { useReveal } from "@/hooks/useReveal";
import { IMAGES } from "@/lib/api";
import ContactForm from "@/components/sections/ContactForm";

export default function About() {
  const ref1 = useReveal();
  const ref2 = useReveal();

  return (
    <Layout>
      <div className="pt-20">
        {/* Hero */}
        <section className="py-24 hero-grid" style={{ background: "var(--razpc-black)" }}>
          <div className="container mx-auto px-6">
            <div ref={ref1} className="reveal max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px" style={{ background: "var(--razpc-yellow)" }} />
                <span className="section-label">О мастерской</span>
              </div>
              <h1 className="font-orbitron font-black text-4xl sm:text-5xl text-white mb-4">
                RazPC —<br />
                <span style={{ color: "var(--razpc-yellow)" }}>не просто ремонт</span>
              </h1>
              <p className="font-montserrat text-lg leading-relaxed" style={{ color: "rgba(245,245,245,0.65)" }}>
                Мы — инженерная мастерская в Краснодаре, которая собирает компьютеры
                с вниманием к каждой детали. Наш подход — как у Porsche: точность,
                производительность и эстетика в каждой сборке.
              </p>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-24" style={{ background: "var(--razpc-dark)" }}>
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div ref={ref2} className="reveal">
                <h2 className="font-orbitron font-black text-3xl text-white mb-6">
                  История и ценности
                </h2>
                <div className="space-y-4 font-montserrat text-sm leading-relaxed" style={{ color: "rgba(245,245,245,0.65)" }}>
                  <p>
                    RazPC начался с простого убеждения: хороший компьютер — это не просто набор
                    железа. Это инструмент, который должен работать идеально, выглядеть
                    достойно и служить долго.
                  </p>
                  <p>
                    За годы работы мы собрали более 200 систем для геймеров, профессионалов,
                    стримеров и дизайнеров. Каждая сборка — это отдельный проект,
                    под конкретного человека с конкретными задачами.
                  </p>
                  <p>
                    Мы не работаем с дешевыми компонентами и не делаем «как придётся».
                    Каждый кабель проложен правильно, каждый болт затянут нужным моментом,
                    каждый тест пройден до выдачи клиенту.
                  </p>
                </div>
              </div>
              <div className="relative">
                <img
                  src={IMAGES.hero}
                  alt="Мастерская RazPC — сборка ПК в Краснодаре"
                  className="w-full object-cover"
                  style={{
                    aspectRatio: "4/3",
                    border: "1px solid var(--razpc-border)",
                  }}
                  loading="lazy"
                />
                <div
                  className="absolute -bottom-4 -right-4 w-full h-full -z-10"
                  style={{ border: "1px solid rgba(255,214,0,0.15)" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24" style={{ background: "var(--razpc-black)" }}>
          <div className="container mx-auto px-6">
            <h2 className="font-orbitron font-black text-3xl text-white mb-12 text-center">
              Наши принципы
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { num: "01", title: "Честность", desc: "Не продаём лишнее. Говорим прямо, что нужно для ваших задач, а что — маркетинг." },
                { num: "02", title: "Качество", desc: "Только проверенные компоненты. Только официальные поставщики. Только с гарантией." },
                { num: "03", title: "Точность", desc: "Тесты, замеры, отчёты. Мы не выдаём ПК без стресс-теста под полной нагрузкой." },
                { num: "04", title: "Эстетика", desc: "Внутри должно быть красиво. Кабель-менеджмент — часть нашей работы, а не опция." },
                { num: "05", title: "Скорость", desc: "Средний срок сборки — 3–5 дней. Без ожидания «когда дойдут руки»." },
                { num: "06", title: "Поддержка", desc: "После выдачи мы не пропадаем. Вопросы? Всегда на связи в Telegram." },
              ].map((v) => (
                <ValueCard key={v.num} v={v} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24" style={{ background: "var(--razpc-surface)" }}>
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="font-orbitron font-black text-3xl text-white mb-4">
                  Доверьте сборку профессионалам
                </h2>
                <p className="font-montserrat text-base leading-relaxed" style={{ color: "rgba(245,245,245,0.6)" }}>
                  Бесплатная консультация, точный подбор комплектующих, гарантия на сборку.
                </p>
              </div>
              <ContactForm title="Получить консультацию" />
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

function ValueCard({ v }: { v: { num: string; title: string; desc: string } }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="reveal card-hover border p-6"
      style={{ background: "var(--razpc-card)", borderColor: "var(--razpc-border)" }}
    >
      <div className="font-orbitron text-xs font-bold mb-3" style={{ color: "var(--razpc-yellow)" }}>
        {v.num}
      </div>
      <h3 className="font-orbitron font-bold text-base text-white mb-2">{v.title}</h3>
      <p className="font-montserrat text-sm leading-relaxed" style={{ color: "var(--razpc-muted)" }}>{v.desc}</p>
    </div>
  );
}
