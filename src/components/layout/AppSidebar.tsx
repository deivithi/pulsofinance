import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CreditCard, Repeat, Tag, Settings, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Parcelamentos', url: '/parcelamentos', icon: CreditCard },
  { title: 'Assinaturas', url: '/assinaturas', icon: Repeat },
  { title: 'Categorias', url: '/categorias', icon: Tag },
  { title: 'Configurações', url: '/configuracoes', icon: Settings },
];

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const location = useLocation();

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">F</span>
          </div>
          <span className="text-xl font-bold gradient-text">Financify</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <li key={item.url}>
                <Link
                  to={item.url}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-out',
                    isActive
                      ? 'bg-primary/10 text-primary border-l-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-background border-r border-white/5 h-screen sticky top-0">
        <NavContent />
      </aside>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 w-64 bg-background border-r border-white/5 z-50 transform transition-transform duration-300 ease-out md:hidden',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <NavContent />
      </aside>
    </>
  );
}
