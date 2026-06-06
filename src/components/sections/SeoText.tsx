import { useReveal } from "@/hooks/useReveal";

export default function SeoText() {
  const ref = useReveal();

  return (
    <section className="py-20" style={{ background: "var(--razpc-dark)" }}>
      <div className="container mx-auto px-6">
        <div ref={ref} className="reveal max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px" style={{ background: "var(--razpc-yellow)" }} />
            <span className="section-label">О мастерской</span>
          </div>

          <h2 className="font-orbitron font-black text-2xl sm:text-3xl text-white mb-6">
            Сборка ПК в Краснодаре —<br />
            <span style={{ color: "var(--razpc-yellow)" }}>инженерный подход без компромиссов</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4 font-montserrat text-sm leading-relaxed" style={{ color: "rgba(245,245,245,0.65)" }}>
              <p>
                <strong className="text-white">RazPC</strong> — мастерская по сборке, модернизации и обслуживанию
                компьютеров в Краснодаре. Мы специализируемся на{" "}
                <strong className="text-white">игровых ПК</strong>,{" "}
                <strong className="text-white">рабочих станциях</strong> и{" "}
                <strong className="text-white">кастомных сборках</strong> с водяным охлаждением.
              </p>
              <p>
                Каждый компьютер собирается вручную с применением проверенных компонентов.
                Мы не используем «маркетинговые» конфигурации — только то, что реально
                нужно для ваших задач. <strong className="text-white">Сборка игрового ПК в Краснодаре</strong> — это наш основной профиль.
              </p>
            </div>
            <div className="space-y-4 font-montserrat text-sm leading-relaxed" style={{ color: "rgba(245,245,245,0.65)" }}>
              <p>
                Ищете <strong className="text-white">мощный ПК в Краснодаре</strong> или хотите сделать{" "}
                <strong className="text-white">апгрейд компьютера</strong>? Мы подберём оптимальное решение
                под любой бюджет — от бюджетных до премиальных конфигураций.
              </p>
              <p>
                Гарантия на все сборки. Полный стресс-тест перед выдачей.
                Работаем с клиентами из Краснодара и Краснодарского края.{" "}
                <strong className="text-white">Компьютер на заказ в Краснодаре</strong> — от консультации до выдачи за 3–7 дней.
              </p>
            </div>
          </div>

          {/* Keywords cloud — subtle */}
          <div className="mt-10 flex flex-wrap gap-2" aria-hidden="true">
            {[
              "Сборка ПК Краснодар",
              "Игровой ПК Краснодар",
              "Апгрейд ПК",
              "Кастомный компьютер",
              "Ремонт ПК Краснодар",
              "Купить ПК Краснодар",
              "Рабочая станция",
              "Водяное охлаждение",
            ].map((kw) => (
              <span
                key={kw}
                className="px-3 py-1 font-montserrat text-xs"
                style={{
                  background: "var(--razpc-card)",
                  border: "1px solid var(--razpc-border)",
                  color: "var(--razpc-muted)",
                }}
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
