import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Parcelamento {
  id: string;
  descricao: string;
  valor_total: number;
  valor_parcela: number;
  total_parcelas: number;
  parcelas_pagas: number;
  dia_vencimento: number;
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

interface UseParcelamentosOptions {
  status?: string;
  categoriaId?: string;
}

export function useParcelamentos(options: UseParcelamentosOptions = {}) {
  const { user } = useAuth();
  const { status, categoriaId } = options;

  return useQuery({
    queryKey: ['parcelamentos', user?.id, status, categoriaId],
    queryFn: async () => {
      if (!user) return [];

      let query = supabase
        .from('parcelamentos')
        .select(`
          *,
          categoria:categorias(id, nome, cor)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (status && status !== 'todos') {
        query = query.eq('status', status);
      }

      if (categoriaId && categoriaId !== 'todas') {
        query = query.eq('categoria_id', categoriaId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Parcelamento[];
    },
    enabled: !!user,
  });
}
