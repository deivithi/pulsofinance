import { useState, useEffect } from 'react';
import { X, ArrowRight, CreditCard, Repeat, Target, BarChart3, Sparkles, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ONBOARDING_KEY = 'pulso_onboarding_completed';

interface OnboardingStep {
    titulo: string;
    descricao: string;
    icon: typeof CreditCard;
    iconBg: string;
    iconColor: string;
}

const steps: OnboardingStep[] = [
    {
        titulo: 'Adicione Parcelamentos',
        descricao: 'Cadastre compras parceladas como eletrônicos, eletrodomésticos e outros. Veja quanto falta pagar e quando vence.',
        icon: CreditCard,
        iconBg: 'bg-indigo-500/10',
        iconColor: 'text-indigo-500',
    },
    {
        titulo: 'Controle Assinaturas',
        descricao: 'Registre serviços recorrentes como Netflix, Spotify, academia. Descubra quanto gasta por mês com assinaturas.',
        icon: Repeat,
        iconBg: 'bg-purple-500/10',
        iconColor: 'text-purple-500',
    },
    {
        titulo: 'Defina Metas',
        descricao: 'Crie limites de gastos para não perder o controle. O sistema avisa quando você está perto do limite.',
        icon: Target,
        iconBg: 'bg-emerald-500/10',
        iconColor: 'text-emerald-500',
    },
    {
        titulo: 'Acompanhe a Evolução',
        descricao: 'Veja gráficos de como seus gastos evoluem mês a mês. Identifique padrões e economize.',
        icon: BarChart3,
        iconBg: 'bg-blue-500/10',
        iconColor: 'text-blue-500',
    },
    {
        titulo: 'Exporte Relatórios',
        descricao: 'Baixe seus dados em CSV para análise no Excel ou Google Planilhas. Tenha controle total.',
        icon: Download,
        iconBg: 'bg-amber-500/10',
        iconColor: 'text-amber-500',
    },
];

export function OnboardingGuiado() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const completed = localStorage.getItem(ONBOARDING_KEY);
        if (!completed) {
            // Small delay for a smooth entrance
            const timer = setTimeout(() => setIsVisible(true), 800);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        setIsExiting(true);
        setTimeout(() => {
            localStorage.setItem(ONBOARDING_KEY, 'true');
            setIsVisible(false);
        }, 300);
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            handleDismiss();
        }
    };

    const handleSkip = () => {
        handleDismiss();
    };

    if (!isVisible) return null;

    const step = steps[currentStep];
    const Icon = step.icon;
    const isLast = currentStep === steps.length - 1;

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300',
                    isExiting ? 'opacity-0' : 'opacity-100'
                )}
                onClick={handleSkip}
            />

            {/* Modal */}
            <div
                className={cn(
                    'fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300',
                    isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                )}
            >
                <div
                    className="relative w-full max-w-md glass-card rounded-2xl border border-border shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button */}
                    <button
                        onClick={handleSkip}
                        className="absolute top-4 right-4 z-10 p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                        <X className="h-4 w-4 text-muted-foreground" />
                    </button>

                    {/* Progress dots */}
                    <div className="flex items-center justify-center gap-1.5 pt-5">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    'h-1.5 rounded-full transition-all duration-300',
                                    i === currentStep ? 'w-6 bg-primary' : i < currentStep ? 'w-1.5 bg-primary/50' : 'w-1.5 bg-muted-foreground/20'
                                )}
                            />
                        ))}
                    </div>

                    {/* Content */}
                    <div className="p-6 pt-4 text-center">
                        {/* Step number */}
                        <span className="text-xs text-muted-foreground font-medium">
                            {currentStep + 1} de {steps.length}
                        </span>

                        {/* Icon */}
                        <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center mx-auto my-5', step.iconBg)}>
                            <Icon className={cn('h-8 w-8', step.iconColor)} />
                        </div>

                        {/* Text */}
                        <h3 className="text-xl font-bold text-foreground mb-2">{step.titulo}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs mx-auto">
                            {step.descricao}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                onClick={handleSkip}
                                className="flex-1 text-muted-foreground hover:text-foreground"
                            >
                                Pular
                            </Button>
                            <Button
                                onClick={handleNext}
                                className="flex-1 bg-primary hover:bg-primary/90 gap-2"
                            >
                                {isLast ? (
                                    <>
                                        <Sparkles className="h-4 w-4" />
                                        Começar!
                                    </>
                                ) : (
                                    <>
                                        Próximo
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// Utility to reset onboarding (for testing)
export function resetOnboarding() {
    localStorage.removeItem(ONBOARDING_KEY);
}
