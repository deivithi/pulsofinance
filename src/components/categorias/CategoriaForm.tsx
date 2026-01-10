import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCategoriaMutations } from '@/hooks/useCategoriaMutations';
import { Categoria } from '@/hooks/useCategorias';

const CORES_PREDEFINIDAS = [
  { nome: 'Indigo', valor: '#6366F1' },
  { nome: 'Roxo', valor: '#A855F7' },
  { nome: 'Rosa', valor: '#EC4899' },
  { nome: 'Vermelho', valor: '#EF4444' },
  { nome: 'Laranja', valor: '#F97316' },
  { nome: 'Âmbar', valor: '#F59E0B' },
  { nome: 'Verde', valor: '#22C55E' },
  { nome: 'Teal', valor: '#14B8A6' },
  { nome: 'Ciano', valor: '#06B6D4' },
  { nome: 'Azul', valor: '#3B82F6' },
];

const formSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(50, 'Máximo 50 caracteres'),
  cor: z.string().min(1, 'Cor é obrigatória'),
});

type FormData = z.infer<typeof formSchema>;

interface CategoriaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoria?: Categoria | null;
}

export function CategoriaForm({ open, onOpenChange, categoria }: CategoriaFormProps) {
  const { createCategoria, updateCategoria } = useCategoriaMutations();
  const isEditing = !!categoria;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      cor: '#6366F1',
    },
  });

  useEffect(() => {
    if (open) {
      if (categoria) {
        form.reset({
          nome: categoria.nome,
          cor: categoria.cor || '#6366F1',
        });
      } else {
        form.reset({
          nome: '',
          cor: '#6366F1',
        });
      }
    }
  }, [categoria, open]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset({
        nome: '',
        cor: '#6366F1',
      });
    }
    onOpenChange(newOpen);
  };

  const onSubmit = async (values: FormData) => {
    const data = {
      nome: values.nome,
      cor: values.cor,
    };
    
    if (isEditing && categoria) {
      await updateCategoria.mutateAsync({ id: categoria.id, data });
    } else {
      await createCategoria.mutateAsync(data);
    }
    onOpenChange(false);
    form.reset();
  };

  const isLoading = createCategoria.isPending || updateCategoria.isPending;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="glass-card border-white/10 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Alimentação"
                      className="bg-muted/50 border-white/10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-muted/50 border-white/10">
                        <SelectValue placeholder="Selecione uma cor">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: field.value }}
                            />
                            <span>
                              {CORES_PREDEFINIDAS.find(c => c.valor === field.value)?.nome || 'Cor'}
                            </span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="glass-card border-white/10">
                      {CORES_PREDEFINIDAS.map((cor) => (
                        <SelectItem key={cor.valor} value={cor.valor}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: cor.valor }}
                            />
                            <span>{cor.nome}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-white/10 hover:bg-muted/50"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? 'Salvando...' : isEditing ? 'Salvar' : 'Criar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
