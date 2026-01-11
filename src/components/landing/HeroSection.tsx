import { forwardRef } from "react";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = forwardRef<HTMLElement>((props, ref) => {
  const scrollToFeatures = () => {
    document.getElementById('recursos')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={ref} className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Sinta o pulso das suas{" "}
              <span className="gradient-text">finanças.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mt-6 max-w-xl mx-auto lg:mx-0">
              Parcelamentos e assinaturas em um só lugar. Clareza total, zero surpresas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center lg:justify-start">
              <Link 
                to="/cadastro" 
                className="btn-primary flex items-center justify-center gap-2 group"
              >
                Começar Agora — É Grátis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <button 
                onClick={scrollToFeatures}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Ver como funciona
              </button>
            </div>
          </div>

          {/* Visual/Mockup */}
          <div className="relative">
            <div className="glass-card rounded-3xl p-6 sm:p-8">
              {/* Mock Dashboard Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Resumo do Mês</span>
                  <span className="text-xs text-primary">Janeiro 2025</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card/80 rounded-xl p-4 border border-white/5">
                    <p className="text-xs text-muted-foreground">Parcelas</p>
                    <p className="text-2xl font-bold text-foreground mt-1">R$ 2.450</p>
                    <p className="text-xs text-primary mt-1">8 parcelas ativas</p>
                  </div>
                  <div className="bg-card/80 rounded-xl p-4 border border-white/5">
                    <p className="text-xs text-muted-foreground">Assinaturas</p>
                    <p className="text-2xl font-bold text-foreground mt-1">R$ 387</p>
                    <p className="text-xs text-purple-400 mt-1">5 serviços</p>
                  </div>
                </div>

                <div className="bg-card/80 rounded-xl p-4 border border-white/5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-muted-foreground">Total Comprometido</span>
                    <span className="text-lg font-bold gradient-text">R$ 2.837</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-primary to-purple-500 rounded-full" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">75% do orçamento mensal</p>
                </div>

                {/* Mini timeline */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Próximos vencimentos</p>
                  {[
                    { name: "Netflix", date: "05 Jan", value: "R$ 55,90" },
                    { name: "Celular (3/12)", date: "10 Jan", value: "R$ 299,00" },
                    { name: "Spotify", date: "15 Jan", value: "R$ 21,90" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm text-foreground">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{item.value}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating elements for depth */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/30 rounded-2xl blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-500/30 rounded-2xl blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
