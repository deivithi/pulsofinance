import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { User } from '@supabase/supabase-js';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DashboardHeaderProps {
  user: User | null;
  avatarUrl?: string | null;
}

export function DashboardHeader({ user, avatarUrl }: DashboardHeaderProps) {
  const getUserName = () => {
    if (!user) return null;
    if (user.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user.email) {
      const namePart = user.email.split('@')[0];
      return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }
    return null;
  };

  const getUserInitials = () => {
    const name = getUserName();
    if (!name) return '?';
    return name.substring(0, 2).toUpperCase();
  };

  const formatCurrentDate = () => {
    const date = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
    return date.charAt(0).toUpperCase() + date.slice(1);
  };

  const name = getUserName();

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-14 w-14 border-2 border-primary/20">
        <AvatarImage src={avatarUrl || undefined} alt={name || 'Avatar'} />
        <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
          {getUserInitials()}
        </AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Olá{name ? `, ${name}` : ''}! 👋
        </h1>
        <p className="text-muted-foreground">
          {formatCurrentDate()}
        </p>
      </div>
    </div>
  );
}
