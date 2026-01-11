import { forwardRef } from "react";
import { CreditCard, Repeat, Calendar, Bell, LayoutDashboard } from "lucide-react";

const features = [
  {
    icon: CreditCard,
    title: "Monitore cada parcela",
    description: "Acompanhe o progresso em tempo real. Saiba exatamente onde você está.",
    large: true,
  },
  {
    icon: Repeat,
    title: "Assinaturas mapeadas",
    description: "Netflix, Spotify, academia... Tudo visível em um só lugar.",
    large: false,
  },
  {
    icon: Calendar,
    title: "Visão do mês",
    description: "Quanto sai da conta este mês? Resposta instantânea.",
    large: false,
  },
  {
    icon: Bell,
    title: "Sem sustos",
    description: "Veja os próximos vencimentos antes que eles cheguem.",
    large: false,
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard unificado",
    description: "O pulso completo das suas finanças em uma tela.",
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