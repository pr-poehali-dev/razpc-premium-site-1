import Layout from "@/components/layout/Layout";
import Hero from "@/components/sections/Hero";
import Benefits from "@/components/sections/Benefits";
import ServicesSection from "@/components/sections/ServicesSection";
import CatalogPreview from "@/components/sections/CatalogPreview";
import PortfolioSection from "@/components/sections/PortfolioSection";
import Steps from "@/components/sections/Steps";
import ReviewsSection from "@/components/sections/ReviewsSection";
import SeoText from "@/components/sections/SeoText";
import ContactForm from "@/components/sections/ContactForm";

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Benefits />
      <ServicesSection />
      <CatalogPreview />
      <PortfolioSection />
      <Steps />
      <ReviewsSection />
      <SeoText />

      {/* CTA Section */}
      <section className="py-24" style={{ background: "var(--razpc-black)" }}>
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px" style={{ background: "var(--razpc-yellow)" }} />
                <span className="section-label">Заявка</span>
              </div>
              <h2 className="font-orbitron font-black text-3xl sm:text-4xl text-white mb-4">
                Готовы начать?
              </h2>
              <p className="font-montserrat text-base leading-relaxed mb-8" style={{ color: "rgba(245,245,245,0.6)" }}>
                Расскажите о задаче — подберём конфигурацию и рассчитаем стоимость. Бесплатная консультация.
              </p>
              <div className="space-y-4">
                {[
                  "Бесплатная консультация",
                  "Подбор под бюджет",
                  "Гарантия на сборку",
                  "Выдача с отчётом о тестировании",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 flex-shrink-0" style={{ background: "var(--razpc-yellow)" }} />
                    <span className="font-montserrat text-sm" style={{ color: "rgba(245,245,245,0.7)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </Layout>
  );
}
