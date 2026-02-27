import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CreditCard, Repeat, Tag, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
    { title: 'Parcelas', url: '/parcelamentos', icon: CreditCard },
    { title: 'Assinaturas', url: '/assinaturas', icon: Repeat },
    { title: 'Categorias', url: '/categorias', icon: Tag },
    { title: 'Config', url: '/configuracoes', icon: Settings },
];

export function BottomNav() {
    const location = useLocation();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            {/* Glassmorphism background - Apple Style */}
            <div className="bg-background/70 backdrop-blur-2xl border-t border-border/30 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-around px-2 py-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.url;
                        return (
                            <Link
                                key={item.url}
                                to={item.url}
                                className={cn(
                                    'flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl transition-all duration-300 min-w-[56px]',
                                    isActive
                                        ? 'text-primary'
                                        : 'text-muted-foreground'
                                )}
                            >
                                <div
                                    className={cn(
                                        'flex items-center justify-center w-10 h-7 rounded-full transition-all duration-300',
                                        isActive
                                            ? 'bg-primary/15 scale-110'
                                            : 'bg-transparent hover:bg-muted/50'
                                    )}
                                >
                                    <item.icon className={cn('h-5 w-5 transition-all duration-300', isActive && 'scale-105')} />
                                </div>
                                <span
                                    className={cn(
                                        'text-[10px] font-medium transition-all duration-300 leading-tight',
                                        isActive ? 'text-primary' : 'text-muted-foreground'
                                    )}
                                >
                                    {item.title}
                                </span>
                            </Link>
                        );
                    })}
                </div>
                {/* Safe area for notch devices */}
                <div className="h-[env(safe-area-inset-bottom)]" />
            </div>
        </nav>
    );
}
