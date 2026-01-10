import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ParcelamentoFormData {
  descricao: string;
  valor_total: number;
  total_parcelas: number;
  parcelas_pagas?: number;
  dia_vencimento: number;
  data_inicio: string;
  categoria_id: string | null;
}

export function useParcelamentoMutations() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createParcelamento = useMutation({
    mutationFn: async (data: ParcelamentoFormData) => {
      if (!user) throw new Error('Usuário não autenticado');

      const valorParcela = data.valor_total / data.total_parcelas;

      const { data: result, error } = await supabase
        .from('parcelamentos')
        .insert({
          user_id: user.id,
          descricao: data.descricao,
          valor_total: data.valor_total,
          valor_parcela: valorParcela,
          total_parcelas: data.total_parcelas,
          parcelas_pagas: 0,
          dia_vencimento: data.dia_vencimento,
          data_inicio: data.data_inicio,
          categoria_id: data.categoria_id || null,
          status: 'ativo',
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcelamentos'] });
      toast({
        title: 'Sucesso!',
        description: 'Parcelamento criado com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao criar parcelamento.',
        variant: 'destructive',
      });
    },
  });

  const updateParcelamento = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ParcelamentoFormData> }) => {
      if (!user) throw new Error('Usuário não autenticado');

      const updateData: Record<string, unknown> = { ...data };
      
      if (data.valor_total && data.total_parcelas) {
        updateData.valor_parcela = data.valor_total / data.total_parcelas;
      }

      const { data: result, error } = await supabase
        .from('parcelamentos')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcelamentos'] });
      toast({
        title: 'Sucesso!',
        description: 'Parcelamento atualizado com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao atualizar parcelamento.',
        variant: 'destructive',
      });
    },
  });

  const deleteParcelamento = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('parcelamentos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcelamentos'] });
      toast({
        title: 'Sucesso!',
        description: 'Parcelamento excluído com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao excluir parcelamento.',
        variant: 'destructive',
      });
    },
  });

  const markAsPaid = useMutation({
    mutationFn: async ({ id, parcelasPagas, totalParcelas }: { id: string; parcelasPagas: number; totalParcelas: number }) => {
      if (!user) throw new Error('Usuário não autenticado');

      const newParcelasPagas = parcelasPagas + 1;
      const newStatus = newParcelasPagas >= totalParcelas ? 'quitado' : 'ativo';

      const { data: result, error } = await supabase
        .from('parcelamentos')
        .update({
          parcelas_pagas: newParcelasPagas,
          status: newStatus,
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['parcelamentos'] });
      const message = data.status === 'quitado' 
        ? 'Parcelamento quitado! 🎉' 
        : 'Parcela marcada como paga!';
      toast({
        title: 'Sucesso!',
        description: message,
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao marcar parcela como paga.',
        variant: 'destructive',
      });
    },
  });

  return {
    createParcelamento,
    updateParcelamento,
    deleteParcelamento,
    markAsPaid,
  };
}
