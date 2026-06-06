import { useReveal } from "@/hooks/useReveal";

const STEPS = [
  { num: "01", title: "Консультация", desc: "Обсуждаем задачи, бюджет и предпочтения. Отвечаем на все вопросы." },
  { num: "02", title: "Подбор", desc: "Формируем оптимальную конфигурацию под ваши цели. Согласовываем с вами." },
  { num: "03", title: "Сборка", desc: "Собираем аккуратно и профессионально. Кабель-менеджмент, термопаста, компоновка." },
  { num: "04", title: "Тестирование", desc: "Стресс-тест под нагрузкой, проверка температур, синтетика и реальные игры." },
  { num: "05", title: "Выдача + Гарантия", desc: "Передаём ПК с полным отчётом о тестировании. Гарантия на сборку." },
];

export default function Steps() {
  const ref = useReveal();

  return (
    <section className="py-24" style={{ background: "var(--razpc-dark)" }}>
      <div className="container mx-auto px-6">
        <div ref={ref} className="reveal mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ background: "var(--razpc-yellow)" }} />
            <span className="section-label">Процесс</span>
          </div>
          <h2 className="font-orbitron font-black text-3xl sm:text-4xl text-white">
            Как мы работаем
          </h2>
        </div>

        <div className="relative">
          {/* Line */}
          <div
            className="hidden lg:block absolute top-8 left-0 right-0 h-px"
            style={{ background: "linear-gradient(to right, transparent, var(--razpc-border), transparent)" }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {STEPS.map((step, i) => (
              <StepCard key={step.num} step={step} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({ step, delay }: { step: typeof STEPS[0]; delay: number }) {
  const ref = useReveal();

  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: `${delay}s` }}>
      <div className="relative">
        {/* Number circle */}
        <div
          className="w-16 h-16 flex items-center justify-center mb-6 relative z-10"
          style={{
            background: "var(--razpc-card)",
            border: "1px solid rgba(255,214,0,0.2)",
            boxShadow: "0 0 20px rgba(255,214,0,0.08)",
          }}
        >
          <span className="font-orbitron font-black text-lg" style={{ color: "var(--razpc-yellow)" }}>
            {step.num}
          </span>
        </div>
      </div>
      <h3 className="font-orbitron font-bold text-sm text-white mb-2">{step.title}</h3>
      <p className="font-montserrat text-sm leading-relaxed" style={{ color: "var(--razpc-muted)" }}>
        {step.desc}
      </p>
    </div>
  );
}
