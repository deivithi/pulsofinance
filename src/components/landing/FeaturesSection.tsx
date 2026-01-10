import { forwardRef } from "react";
import { CreditCard, Repeat, Calendar, Bell, LayoutDashboard } from "lucide-react";

const features = [
  {
    icon: CreditCard,
    title: "Controle Total de Parcelas",
    description: "Acompanhe cada parcela de compras no cartão, financiamentos e empréstimos. Saiba exatamente quanto falta pagar e quando cada compromisso termina.",
    large: true,
  },
  {
    icon: Repeat,
    title: "Assinaturas Mapeadas",
    description: "Visualize todos os seus serviços recorrentes em um só lugar. Netflix, Spotify, academia — tudo organizado.",
    large: false,
  },
  {
    icon: Calendar,
    title: "Visão do Mês",
    description: "Calendário financeiro mostrando todos os vencimentos. Nunca mais seja pego de surpresa.",
    large: false,
  },
  {
    icon: Bell,
    title: "Alertas Inteligentes",
    description: "Receba lembretes antes dos vencimentos e notificações sobre mudanças importantes.",
    large: false,
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard Unificado",
    description: "Uma visão completa e intuitiva de todos os seus compromissos financeiros. Gráficos claros, números que fazem sentido, decisões mais inteligentes.",
    large: true,
  },
];

const FeaturesSection = forwardRef<HTMLElement>((props, ref) => {
  return (
    <section ref={ref} id="recursos" className="py-24 sm:py-32 relative">
      {/* Background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Tudo que você precisa para{" "}
            <span className="gradient-text">organizar suas finanças</span>
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Ferramentas simples e poderosas para você finalmente entender para onde vai seu dinheiro.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isLarge = feature.large;
            
            return (
              <div
                key={index}
                className={`feature-card ${
                  isLarge ? "md:col-span-2 lg:col-span-2" : ""
                }`}
              >
                <div className={`flex ${isLarge ? "flex-col sm:flex-row sm:items-start gap-6" : "flex-col gap-4"}`}>
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

FeaturesSection.displayName = 'FeaturesSection';

export default FeaturesSection;