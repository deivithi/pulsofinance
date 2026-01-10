import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CategoriaInput {
  nome: string;
  cor: string;
  icone?: string;
}

const DEFAULT_CATEGORIAS = [
  { nome: 'Casa', cor: '#22C55E', icone: 'home' },
  { nome: 'Transporte', cor: '#3B82F6', icone: 'car' },
  { nome: 'Lazer', cor: '#A855F7', icone: 'gamepad' },
  { nome: 'Saúde', cor: '#EF4444', icone: 'heart' },
  { nome: 'Educação', cor: '#F59E0B', icone: 'graduation-cap' },
  { nome: 'Outros', cor: '#6366F1', icone: 'tag' },
];

export function useCategoriaMutations() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createCategoria = useMutation({
    mutationFn: async (data: CategoriaInput) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { error } = await supabase.from('categorias').insert({
        user_id: user.id,
        nome: data.nome,
        cor: data.cor,
        icone: data.icone || 'tag',
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      toast({
        title: 'Categoria criada',
        description: 'Sua categoria foi criada com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar categoria',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateCategoria = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CategoriaInput }) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { error } = await supabase
        .from('categorias')
        .update({
          nome: data.nome,
          cor: data.cor,
          icone: data.icone,
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      toast({
        title: 'Categoria atualizada',
        description: 'Sua categoria foi atualizada com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar categoria',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteCategoria = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { error } = await supabase
        .from('categorias')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      toast({
        title: 'Categoria excluída',
        description: 'Sua categoria foi excluída com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao excluir categoria',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const createDefaultCategorias = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Usuário não autenticado');
      
      const categoriasToInsert = DEFAULT_CATEGORIAS.map(cat => ({
        user_id: user.id,
        nome: cat.nome,
        cor: cat.cor,
        icone: cat.icone,
      }));

      const { error } = await supabase.from('categorias').insert(categoriasToInsert);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      toast({
        title: 'Categorias criadas',
        description: 'As categorias padrão foram criadas com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar categorias',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    createCategoria,
    updateCategoria,
    deleteCategoria,
    createDefaultCategorias,
  };
}
