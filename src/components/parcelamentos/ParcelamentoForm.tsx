import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Categoria } from '@/hooks/useCategorias';
import { Parcelamento } from '@/hooks/useParcelamentos';

const formSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória').max(100, 'Máximo 100 caracteres'),
  valor_total: z.coerce.number().min(0.01, 'Valor deve ser maior que zero'),
  total_parcelas: z.coerce.number().int().min(1, 'Mínimo 1 parcela').max(120, 'Máximo 120 parcelas'),
  parcelas_pagas: z.coerce.number().int().min(0, 'Valor inválido').optional(),
  dia_vencimento: z.coerce.number().int().min(1).max(31),
  data_inicio: z.date({ required_error: 'Data de início é obrigatória' }),
  categoria_id: z.string().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface ParcelamentoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categorias: Categoria[];
  parcelamento?: Parcelamento | null;
  onSubmit: (data: FormValues) => void;
  loading?: boolean;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

export function ParcelamentoForm({
  open,
  onOpenChange,
  categorias,
  parcelamento,
  onSubmit,
  loading,
}: ParcelamentoFormProps) {
  const isEditing = !!parcelamento;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      descricao: '',
      valor_total: 0,
      total_parcelas: 1,
      parcelas_pagas: 0,
      dia_vencimento: 1,
      data_inicio: new Date(),
      categoria_id: null,
    },
  });

  useEffect(() => {
    if (parcelamento) {
      form.reset({
        descricao: parcelamento.descricao,
        valor_total: parcelamento.valor_total,
        total_parcelas: parcelamento.total_parcelas,
        parcelas_pagas: parcelamento.parcelas_pagas,
        dia_vencimento: parcelamento.dia_vencimento,
        data_inicio: new Date(parcelamento.data_inicio),
        categoria_id: parcelamento.categoria_id,
      });
    } else {
      form.reset({
        descricao: '',
        valor_total: 0,
        total_parcelas: 1,
        parcelas_pagas: 0,
        dia_vencimento: 1,
        data_inicio: new Date(),
        categoria_id: null,
      });
    }
  }, [parcelamento, form, open]);

  const watchValues = form.watch(['valor_total', 'total_parcelas']);
  const valorParcela = useMemo(() => {
    const [valorTotal, totalParcelas] = watchValues;
    if (valorTotal && totalParcelas && totalParcelas > 0) {
      return valorTotal / totalParcelas;
    }
    return 0;
  }, [watchValues]);

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  const dias = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {isEditing ? 'Editar Parcelamento' : 'Novo Parcelamento'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Celular novo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="valor_total"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Total (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0,00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="total_parcelas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total de Parcelas</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="120"
                        placeholder="12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {valorParcela > 0 && (
              <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <p className="text-sm text-muted-foreground">
                  Parcela de{' '}
                  <span className="font-semibold text-indigo-400">
                    {formatCurrency(valorParcela)}
                  </span>
                </p>
              </div>
            )}

            {isEditing && (
              <FormField
                control={form.control}
                name="parcelas_pagas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parcelas Já Pagas</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max={form.getValues('total_parcelas')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dia_vencimento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia de Vencimento</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o dia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dias.map((dia) => (
                          <SelectItem key={dia} value={dia.toString()}>
                            Dia {dia}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="data_inicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'dd/MM/yyyy', { locale: ptBR })
                            ) : (
                              <span>Selecione</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="categoria_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === 'none' ? null : value)}
                    value={field.value || 'none'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Sem categoria</SelectItem>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria.id} value={categoria.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: categoria.cor }}
                            />
                            {categoria.nome}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-600"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
