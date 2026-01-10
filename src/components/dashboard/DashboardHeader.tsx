import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { User } from '@supabase/supabase-js';

interface DashboardHeaderProps {
  user: User | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const getUserName = () => {
    if (!user) return null;
    if (user.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user.email) {
      const namePart = user.email.split('@')[0];
      return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }
    return null;
  };

  const formatCurrentDate = () => {
    const date = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });
    return date.charAt(0).toUpperCase() + date.slice(1);
  };

  const name = getUserName();

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Olá{name ? `, ${name}` : ''}! 👋
      </h1>
      <p className="text-muted-foreground">
        {formatCurrentDate()}
      </p>
    </div>
  );
}
