import { useReveal } from "@/hooks/useReveal";
import Icon from "@/components/ui/icon";

const ITEMS = [
  {
    icon: "Target",
    title: "Точность",
    desc: "Каждая сборка проходит многоэтапный контроль. Мы не выдаём ПК без стресс-тестов и полного отчёта.",
  },
  {
    icon: "Zap",
    title: "Производительность",
    desc: "Подбираем комплектующие под реальные задачи. Никаких маркетинговых конфигураций — только результат.",
  },
  {
    icon: "Shield",
    title: "Надёжность",
    desc: "Гарантия на сборку. Все компоненты — только от официальных поставщиков с чеками.",
  },
  {
    icon: "Sparkles",
    title: "Эстетика",
    desc: "Кабель-менеджмент, термопаста, компоновка — мы думаем о каждой детали внутри корпуса.",
  },
];

export default function Benefits() {
  const ref = useReveal();

  return (
    <section className="py-24" style={{ background: "var(--razpc-dark)" }}>
      <div className="container mx-auto px-6">
        <div ref={ref} className="reveal">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ background: "var(--razpc-yellow)" }} />
            <span className="section-label">Почему RazPC</span>
          </div>
          <h2 className="font-orbitron font-black text-3xl sm:text-4xl text-white mb-12">
            Инженерный подход<br />
            <span style={{ color: "var(--razpc-yellow)" }}>к каждой сборке</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ITEMS.map((item, i) => (
            <BenefitCard key={item.title} item={item} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitCard({ item, delay }: { item: typeof ITEMS[0]; delay: number }) {
  const ref = useReveal();

  return (
    <div
      ref={ref}
      className="reveal card-hover p-6 border group cursor-default"
      style={{
        background: "var(--razpc-card)",
        borderColor: "var(--razpc-border)",
        transitionDelay: `${delay}s`,
      }}
    >
      <div
        className="w-12 h-12 flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
        style={{
          background: "rgba(255,214,0,0.08)",
          border: "1px solid rgba(255,214,0,0.15)",
        }}
      >
        <Icon name={item.icon} size={22} style={{ color: "var(--razpc-yellow)" }} />
      </div>
      <h3 className="font-orbitron font-bold text-base text-white mb-3">{item.title}</h3>
      <p className="font-montserrat text-sm leading-relaxed" style={{ color: "var(--razpc-muted)" }}>
        {item.desc}
      </p>
      <div
        className="mt-5 h-px w-0 group-hover:w-full transition-all duration-500"
        style={{ background: "var(--razpc-yellow)" }}
      />
    </div>
  );
}
