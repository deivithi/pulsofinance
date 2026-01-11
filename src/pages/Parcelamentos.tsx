import { useState, useMemo } from 'react';
import { CreditCard, Plus, DollarSign, Calendar, Clock, Search } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ParcelamentoCard } from '@/components/parcelamentos/ParcelamentoCard';
import { ParcelamentosTable } from '@/components/parcelamentos/ParcelamentosTable';
import { ParcelamentoForm } from '@/components/parcelamentos/ParcelamentoForm';
import { DeleteParcelamentoDialog } from '@/components/parcelamentos/DeleteParcelamentoDialog';
import { useParcelamentos, Parcelamento } from '@/hooks/useParcelamentos';
import { useCategorias } from '@/hooks/useCategorias';
import { useParcelamentoMutations } from '@/hooks/useParcelamentoMutations';
import { GastosPorCategoriaChart } from '@/components/shared/GastosPorCategoriaChart';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

export default function Parcelamentos() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [categoriaFilter, setCategoriaFilter] = useState('todas');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedParcelamento, setSelectedParcelamento] = useState<Parcelamento | null>(null);

  const { data: parcelamentos = [], isLoading } = useParcelamentos({
    status: statusFilter,
    categoriaId: categoriaFilter,
  });
  const { data: categorias = [] } = useCategorias();
  const { createParcelamento, updateParcelamento, deleteParcelamento, markAsPaid } =
    useParcelamentoMutations();

  // Filtro de busca local
  const filteredParcelamentos = useMemo(() => {
    if (!search.trim()) return parcelamentos;
    const searchLower = search.toLowerCase();
    return parcelamentos.filter((p) =>
      p.descricao.toLowerCase().includes(searchLower)
    );
  }, [parcelamentos, search]);

  // Cálculos para os cards
  const summary = useMemo(() => {
    const ativos = parcelamentos.filter((p) => p.status === 'ativo');
    
    const totalAtivo = ativos.reduce(
      (sum, p) => sum + p.valor_parcela * (p.total_parcelas - p.parcelas_pagas),
      0
    );
    
    const parcelaMes = ativos.reduce((sum, p) => sum + p.valor_parcela, 0);
    
    const parcelamentosAtivos = ativos.length;
    
    // Próximo vencimento
    const today = new Date();
    const currentDay = today.getDate();
    
    let proximoVencimento: Date | null = null;
    
    for (const p of ativos) {
      const dia = p.dia_vencimento;
      let nextDate: Date;
      
      if (dia >= currentDay) {
        nextDate = new Date(today.getFullYear(), today.getMonth(), dia);
      } else {
        nextDate = new Date(today.getFullYear(), today.getMonth() + 1, dia);
      }
      
      if (!proximoVencimento || nextDate < proximoVencimento) {
        proximoVencimento = nextDate;
      }
    }

    return {
      totalAtivo,
      parcelaMes,
      parcelamentosAtivos,
      proximoVencimento,
    };
  }, [parcelamentos]);

  // Gastos por categoria para o gráfico
  const gastosPorCategoria = useMemo(() => {
    const ativos = parcelamentos.filter((p) => p.status === 'ativo');
    const porCategoria = new Map<string, { categoria: string; valor: number; cor: string }>();

    ativos.forEach((parcelamento) => {
      const categoriaId = parcelamento.categoria_id || 'sem-categoria';
      const categoriaNome = parcelamento.categoria?.nome || 'Sem categoria';
      const categoriaCor = parcelamento.categoria?.cor || '#6B7280';

      const atual = porCategoria.get(categoriaId) || { categoria: categoriaNome, valor: 0, cor: categoriaCor };
      porCategoria.set(categoriaId, {
        categoria: categoriaNome,
        valor: atual.valor + parcelamento.valor_parcela,
        cor: categoriaCor,
      });
    });

    return Array.from(porCategoria.values()).sort((a, b) => b.valor - a.valor);
  }, [parcelamentos]);

  const handleOpenCreate = () => {
    setSelectedParcelamento(null);
    setFormOpen(true);
  };

  const handleEdit = (parcelamento: Parcelamento) => {
    setSelectedParcelamento(parcelamento);
    setFormOpen(true);
  };

  const handleDelete = (parcelamento: Parcelamento) => {
    setSelectedParcelamento(parcelamento);
    setDeleteOpen(true);
  };

  const handleMarkAsPaid = (parcelamento: Parcelamento) => {
    markAsPaid.mutate({
      id: parcelamento.id,
      parcelasPagas: parcelamento.parcelas_pagas,
      totalParcelas: parcelamento.total_parcelas,
    });
  };

  const handleFormSubmit = (data: {
    descricao: string;
    valor_total: number;
    total_parcelas: number;
    parcelas_pagas?: number;
    dia_vencimento: number;
    data_inicio: Date;
    categoria_id: string | null;
  }) => {
    const formattedData = {
      ...data,
      data_inicio: format(data.data_inicio, 'yyyy-MM-dd'),
    };

    if (selectedParcelamento) {
      updateParcelamento.mutate(
        { id: selectedParcelamento.id, data: formattedData },
        { onSuccess: () => setFormOpen(false) }
      );
    } else {
      createParcelamento.mutate(formattedData, {
        onSuccess: () => setFormOpen(false),
      });
    }
  };

  const handleConfirmDelete = () => {
    if (selectedParcelamento) {
      deleteParcelamento.mutate(selectedParcelamento.id, {
        onSuccess: () => {
          setDeleteOpen(false);
          setSelectedParcelamento(null);
        },
      });
    }
  };

  const isEmpty = !isLoading && filteredParcelamentos.length === 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Parcelamentos</h2>
          <p className="text-muted-foreground">
            Gerencie todos os seus parcelamentos em um só lugar
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-indigo-500 hover:bg-indigo-600"
        >
          <Plus className="h-5 w-5 mr-2" />
          Novo Parcelamento
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ParcelamentoCard
          title="Total Ativo"
          value={formatCurrency(summary.totalAtivo)}
          icon={DollarSign}
          loading={isLoading}
        />
        <ParcelamentoCard
          title="Parcela do Mês"
          value={formatCurrency(summary.parcelaMes)}
          icon={Calendar}
          loading={isLoading}
        />
        <ParcelamentoCard
          title="Parcelamentos Ativos"
          value={summary.parcelamentosAtivos.toString()}
          icon={CreditCard}
          loading={isLoading}
        />
        <ParcelamentoCard
          title="Próximo Vencimento"
          value={
            summary.proximoVencimento
              ? format(summary.proximoVencimento, 'dd/MM')
              : '—'
          }
          icon={Clock}
          loading={isLoading}
        />
      </div>

      {/* Gráfico de Gastos por Categoria */}
      <GastosPorCategoriaChart
        dados={gastosPorCategoria}
        isLoading={isLoading}
        titulo="Gastos Mensais por Categoria"
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar parcelamento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas categorias</SelectItem>
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="ativo">Ativos</SelectItem>
            <SelectItem value="quitado">Quitados</SelectItem>
            <SelectItem value="cancelado">Cancelados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table or Empty State */}
      {isEmpty ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mx-auto mb-6">
              <CreditCard className="h-8 w-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Nenhum parcelamento encontrado
            </h3>
            <p className="text-muted-foreground mb-6">
              {search || statusFilter !== 'todos' || categoriaFilter !== 'todas'
                ? 'Tente ajustar os filtros para ver mais resultados.'
                : 'Adicione seus parcelamentos para acompanhar as parcelas restantes e valores mensais.'}
            </p>
            {!search && statusFilter === 'todos' && categoriaFilter === 'todas' && (
              <Button
                onClick={handleOpenCreate}
                className="bg-indigo-500 hover:bg-indigo-600"
              >
                <Plus className="h-5 w-5 mr-2" />
                Adicionar Primeiro Parcelamento
              </Button>
            )}
          </div>
        </div>
      ) : (
        <ParcelamentosTable
          parcelamentos={filteredParcelamentos}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMarkAsPaid={handleMarkAsPaid}
        />
      )}

      {/* Form Modal */}
      <ParcelamentoForm
        open={formOpen}
        onOpenChange={setFormOpen}
        categorias={categorias}
        parcelamento={selectedParcelamento}
        onSubmit={handleFormSubmit}
        loading={createParcelamento.isPending || updateParcelamento.isPending}
      />

      {/* Delete Confirmation */}
      <DeleteParcelamentoDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        parcelamentoNome={selectedParcelamento?.descricao}
        loading={deleteParcelamento.isPending}
      />
    </div>
  );
}
