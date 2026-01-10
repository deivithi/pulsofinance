import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Assinatura {
  id: string;
  user_id: string;
  nome: string;
  valor: number;
  frequencia: string;
  dia_cobranca: number;
  data_inicio: string;
  categoria_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  categoria?: {
    id: string;
    nome: string;
    cor: string;
  } | null;
}

interface UseAssinaturasOptions {
  status?: string;
  categoriaId?: string;
}

export function useAssinaturas(options: UseAssinaturasOptions = {}) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['assinaturas', user?.id, options.status, options.categoriaId],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('assinaturas')
        .select(`*, categoria:categorias(id, nome, cor)`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Filter by status - by default hide cancelled
      if (options.status && options.status !== 'todas') {
        query = query.eq('status', options.status);
      } else if (!options.status || options.status === 'todas') {
        // Show all except cancelled by default, unless specifically filtering
        query = query.neq('status', 'cancelada');
      }

      if (options.categoriaId && options.categoriaId !== 'todas') {
        query = query.eq('categoria_id', options.categoriaId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Assinatura[];
    },
    enabled: !!user,
  });
}
