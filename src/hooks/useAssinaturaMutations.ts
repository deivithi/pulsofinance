import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface AssinaturaFormData {
  nome: string;
  valor: number;
  frequencia: string;
  diaCobranca: number;
  dataInicio: Date;
  categoriaId?: string;
}

export function useAssinaturaMutations() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createAssinatura = useMutation({
    mutationFn: async (data: AssinaturaFormData) => {
      if (!user) throw new Error('User not authenticated');

      const { data: result, error } = await supabase
        .from('assinaturas')
        .insert({
          user_id: user.id,
          nome: data.nome,
          valor: data.valor,
          frequencia: data.frequencia,
          dia_cobranca: data.diaCobranca,
          data_inicio: data.dataInicio.toISOString().split('T')[0],
          categoria_id: data.categoriaId || null,
          status: 'ativa',
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assinaturas'] });
      toast({
        title: 'Assinatura criada!',
        description: 'Sua assinatura foi adicionada com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar assinatura',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateAssinatura = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AssinaturaFormData }) => {
      if (!user) throw new Error('User not authenticated');

      const { data: result, error } = await supabase
        .from('assinaturas')
        .update({
          nome: data.nome,
          valor: data.valor,
          frequencia: data.frequencia,
          dia_cobranca: data.diaCobranca,
          data_inicio: data.dataInicio.toISOString().split('T')[0],
          categoria_id: data.categoriaId || null,
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assinaturas'] });
      toast({
        title: 'Assinatura atualizada!',
        description: 'Suas alterações foram salvas.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar assinatura',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const toggleStatus = useMutation({
    mutationFn: async ({ id, currentStatus }: { id: string; currentStatus: string }) => {
      if (!user) throw new Error('User not authenticated');

      const newStatus = currentStatus === 'ativa' ? 'pausada' : 'ativa';

      const { error } = await supabase
        .from('assinaturas')
        .update({ status: newStatus })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return newStatus;
    },
    onSuccess: (newStatus) => {
      queryClient.invalidateQueries({ queryKey: ['assinaturas'] });
      toast({
        title: newStatus === 'ativa' ? 'Assinatura reativada!' : 'Assinatura pausada!',
        description: newStatus === 'ativa' 
          ? 'Sua assinatura está ativa novamente.' 
          : 'Sua assinatura foi pausada temporariamente.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao alterar status',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const cancelAssinatura = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('assinaturas')
        .update({ status: 'cancelada' })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assinaturas'] });
      toast({
        title: 'Assinatura cancelada',
        description: 'A assinatura foi cancelada com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao cancelar assinatura',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    createAssinatura,
    updateAssinatura,
    toggleStatus,
    cancelAssinatura,
  };
}
