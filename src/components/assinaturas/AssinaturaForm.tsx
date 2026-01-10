import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Assinatura } from '@/hooks/useAssinaturas';
import { useCategorias } from '@/hooks/useCategorias';

const formSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(100, 'Máximo de 100 caracteres'),
  valor: z.coerce.number().min(0.01, 'Valor deve ser maior que zero'),
  frequencia: z.string().min(1, 'Frequência é obrigatória'),
  diaCobranca: z.coerce.number().min(1).max(31),
  dataInicio: z.date({ required_error: 'Data de início é obrigatória' }),
  categoriaId: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AssinaturaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assinatura?: Assinatura | null;
  onSubmit: (data: FormData) => void;
  loading?: boolean;
}

const frequenciaOptions = [
  { value: 'mensal', label: 'Mensal' },
  { value: 'trimestral', label: 'Trimestral' },
  { value: 'semestral', label: 'Semestral' },
  { value: 'anual', label: 'Anual' },
];

const calcularCustoMensal = (valor: number, frequencia: string) => {
  switch (frequencia) {
    case 'mensal':
      return valor;
    case 'trimestral':
      return valor / 3;
    case 'semestral':
      return valor / 6;
    case 'anual':
      return valor / 12;
    default:
      return valor;
  }
};

export function AssinaturaForm({
  open,
  onOpenChange,
  assinatura,
  onSubmit,
  loading,
}: AssinaturaFormProps) {
  const { data: categorias } = useCategorias();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      valor: 0,
      frequencia: 'mensal',
      diaCobranca: 1,
      dataInicio: new Date(),
      categoriaId: '',
    },
  });

  const valor = form.watch('valor');
  const frequencia = form.watch('frequencia');

  const custoMensal = useMemo(() => {
    if (!valor || valor <= 0) return 0;
    return calcularCustoMensal(valor, frequencia);
  }, [valor, frequencia]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  useEffect(() => {
    if (assinatura) {
      form.reset({
        nome: assinatura.nome,
        valor: assinatura.valor,
        frequencia: assinatura.frequencia,
        diaCobranca: assinatura.dia_cobranca,
        dataInicio: new Date(assinatura.data_inicio),
        categoriaId: assinatura.categoria_id || '',
      });
    } else {
      form.reset({
        nome: '',
        valor: 0,
        frequencia: 'mensal',
        diaCobranca: 1,
        dataInicio: new Date(),
        categoriaId: '',
      });
    }
  }, [assinatura, form, open]);

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {assinatura ? 'Editar Assinatura' : 'Nova Assinatura'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Netflix, Spotify..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
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
                name="frequencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequência</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {frequenciaOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Monthly cost preview */}
            {frequencia !== 'mensal' && valor > 0 && (
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <p className="text-sm text-muted-foreground">
                  Equivale a{' '}
                  <span className="font-semibold text-purple-400">
                    {formatCurrency(custoMensal)}
                  </span>{' '}
                  por mês
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="diaCobranca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia da Cobrança</FormLabel>
                    <Select
                      onValueChange={(v) => field.onChange(parseInt(v))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Dia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                          <SelectItem key={day} value={day.toString()}>
                            Dia {day}
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
                name="dataInicio"
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
              name="categoriaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sem categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Sem categoria</SelectItem>
                      {categorias?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: cat.cor }}
                            />
                            {cat.nome}
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
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
