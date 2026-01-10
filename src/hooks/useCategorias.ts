import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Categoria {
  id: string;
  nome: string;
  cor: string;
  icone: string;
}

export function useCategorias() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['categorias', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('user_id', user.id)
        .order('nome');

      if (error) throw error;
      return data as Categoria[];
    },
    enabled: !!user,
  });
}
