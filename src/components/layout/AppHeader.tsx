import { useLocation, Link } from 'react-router-dom';
import { Menu, ChevronRight, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

interface AppHeaderProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/parcelamentos': 'Parcelamentos',
  '/assinaturas': 'Assinaturas',
  '/configuracoes': 'Configurações',
};

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const currentTitle = pageTitles[location.pathname] || 'Dashboard';
  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <header className="h-16 glass-header sticky top-0 z-30 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-muted-foreground hover:text-foreground"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            Financify
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground font-medium">{currentTitle}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Page Title (Desktop) */}
        <h1 className="hidden lg:block text-2xl font-bold text-foreground">
          {currentTitle}
        </h1>
      </div>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {userInitial}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 glass-card border-white/10" align="end">
          <div className="flex items-center gap-3 p-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">Minha Conta</span>
              <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                {user?.email}
              </span>
            </div>
          </div>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem asChild>
            <Link to="/configuracoes" className="flex items-center gap-2 cursor-pointer">
              <User className="h-4 w-4" />
              <span>Configurações</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
