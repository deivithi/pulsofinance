import { useState, useMemo } from 'react';
import { Plus, Search, DollarSign, Repeat, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useAssinaturas, Assinatura } from '@/hooks/useAssinaturas';
import { useAssinaturaMutations, AssinaturaFormData } from '@/hooks/useAssinaturaMutations';
import { useCategorias } from '@/hooks/useCategorias';
import { AssinaturaSummaryCard } from '@/components/assinaturas/AssinaturaSummaryCard';
import { AssinaturaCard } from '@/components/assinaturas/AssinaturaCard';
import { AssinaturaForm } from '@/components/assinaturas/AssinaturaForm';
import { CancelAssinaturaDialog } from '@/components/assinaturas/CancelAssinaturaDialog';
import { GastosPorCategoriaChart } from '@/components/shared/GastosPorCategoriaChart';

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

export default function Assinaturas() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todas');
  const [categoriaFilter, setCategoriaFilter] = useState('todas');
  const [formOpen, setFormOpen] = useState(false);
  const [editingAssinatura, setEditingAssinatura] = useState<Assinatura | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelingAssinatura, setCancelingAssinatura] = useState<Assinatura | null>(null);

  // Include cancelled only when filtering for them specifically
  const includesCancelled = statusFilter === 'cancelada' || statusFilter === 'todas_incluindo_canceladas';
  
  const { data: assinaturas = [], isLoading } = useAssinaturas({
    status: includesCancelled ? statusFilter : statusFilter,
    categoriaId: categoriaFilter,
  });
  
  const { data: categorias = [] } = useCategorias();
  const { createAssinatura, updateAssinatura, toggleStatus, cancelAssinatura } = useAssinaturaMutations();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  // Filter by search
  const filteredAssinaturas = useMemo(() => {
    let result = assinaturas;

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter((a) =>
        a.nome.toLowerCase().includes(searchLower)
      );
    }

    // Filter by status
    if (statusFilter && statusFilter !== 'todas' && statusFilter !== 'todas_incluindo_canceladas') {
      result = result.filter((a) => a.status === statusFilter);
    }

    return result;
  }, [assinaturas, search, statusFilter]);

  // Summary calculations
  const summary = useMemo(() => {
    const ativas = assinaturas.filter((a) => a.status === 'ativa');
    
    // Calculate total monthly cost
    const custoMensal = ativas.reduce((sum, a) => {
      return sum + calcularCustoMensal(a.valor, a.frequencia);
    }, 0);

    // Find next charge
    const today = new Date();
    const currentDay = today.getDate();
    
    let proximaCobranca: { data: Date; nome: string } | null = null;

    for (const a of ativas) {
      let nextDate: Date;
      if (a.dia_cobranca >= currentDay) {
        nextDate = new Date(today.getFullYear(), today.getMonth(), a.dia_cobranca);
      } else {
        nextDate = new Date(today.getFullYear(), today.getMonth() + 1, a.dia_cobranca);
      }

      if (!proximaCobranca || nextDate < proximaCobranca.data) {
        proximaCobranca = { data: nextDate, nome: a.nome };
      }
    }

    return {
      custoMensal,
      ativasCount: ativas.length,
      proximaCobranca,
    };
  }, [assinaturas]);

  // Gastos por categoria para o gráfico
  const gastosPorCategoria = useMemo(() => {
    const ativas = assinaturas.filter((a) => a.status === 'ativa');
    const porCategoria = new Map<string, { categoria: string; valor: number; cor: string }>();

    ativas.forEach((assinatura) => {
      const categoriaId = assinatura.categoria_id || 'sem-categoria';
      const categoriaNome = assinatura.categoria?.nome || 'Sem categoria';
      const categoriaCor = assinatura.categoria?.cor || '#6B7280';
      const custoMensal = calcularCustoMensal(assinatura.valor, assinatura.frequencia);

      const atual = porCategoria.get(categoriaId) || { categoria: categoriaNome, valor: 0, cor: categoriaCor };
      porCategoria.set(categoriaId, {
        categoria: categoriaNome,
        valor: atual.valor + custoMensal,
        cor: categoriaCor,
      });
    });

    return Array.from(porCategoria.values()).sort((a, b) => b.valor - a.valor);
  }, [assinaturas]);

  const handleSubmit = (data: AssinaturaFormData) => {
    if (editingAssinatura) {
      updateAssinatura.mutate(
        { id: editingAssinatura.id, data },
        {
          onSuccess: () => {
            setFormOpen(false);
            setEditingAssinatura(null);
          },
        }
      );
    } else {
      createAssinatura.mutate(data, {
        onSuccess: () => {
          setFormOpen(false);
        },
      });
    }
  };

  const handleEdit = (assinatura: Assinatura) => {
    setEditingAssinatura(assinatura);
    setFormOpen(true);
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    toggleStatus.mutate({ id, currentStatus });
  };

  const handleCancelClick = (assinatura: Assinatura) => {
    setCancelingAssinatura(assinatura);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    if (cancelingAssinatura) {
      cancelAssinatura.mutate(cancelingAssinatura.id, {
        onSuccess: () => {
          setCancelDialogOpen(false);
          setCancelingAssinatura(null);
        },
      });
    }
  };

  const handleFormClose = (open: boolean) => {
    setFormOpen(open);
    if (!open) {
      setEditingAssinatura(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Assinaturas</h2>
          <p className="text-muted-foreground">
            Controle suas assinaturas e serviços recorrentes
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="bg-indigo-500 hover:bg-indigo-600">
          <Plus className="h-5 w-5 mr-2" />
          Nova Assinatura
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AssinaturaSummaryCard
          title="Custo Mensal"
          value={formatCurrency(summary.custoMensal)}
          icon={DollarSign}
          loading={isLoading}
        />
        <AssinaturaSummaryCard
          title="Assinaturas Ativas"
          value={summary.ativasCount.toString()}
          icon={Repeat}
          loading={isLoading}
        />
        <AssinaturaSummaryCard
          title="Próxima Cobrança"
          value={
            summary.proximaCobranca
              ? format(summary.proximaCobranca.data, "dd 'de' MMMM", { locale: ptBR })
              : 'Nenhuma'
          }
          subtitle={summary.proximaCobranca?.nome}
          icon={Calendar}
          loading={isLoading}
        />
      </div>

      {/* Gráfico de Gastos por Categoria */}
      <GastosPorCategoriaChart
        dados={gastosPorCategoria}
        isLoading={isLoading}
        titulo="Custo Mensal por Categoria"
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar assinatura..."
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
            <SelectItem value="todas">Todas as categorias</SelectItem>
            {categorias.map((cat) => (
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas (exceto canceladas)</SelectItem>
            <SelectItem value="ativa">Ativas</SelectItem>
            <SelectItem value="pausada">Pausadas</SelectItem>
            <SelectItem value="cancelada">Canceladas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-5">
              <div className="flex justify-between mb-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-8 w-24 mb-4" />
              <Skeleton className="h-5 w-20 mb-3" />
              <Skeleton className="h-4 w-36 mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 w-9" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredAssinaturas.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-6">
              <Repeat className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              {search || statusFilter !== 'todas'
                ? 'Nenhuma assinatura encontrada'
                : 'Nenhuma assinatura cadastrada'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {search || statusFilter !== 'todas'
                ? 'Tente ajustar os filtros de busca.'
                : 'Adicione suas assinaturas como Netflix, Spotify, academias e outros serviços recorrentes.'}
            </p>
            {!search && statusFilter === 'todas' && (
              <Button onClick={() => setFormOpen(true)} className="bg-indigo-500 hover:bg-indigo-600">
                <Plus className="h-5 w-5 mr-2" />
                Adicionar Primeira Assinatura
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssinaturas.map((assinatura) => (
            <AssinaturaCard
              key={assinatura.id}
              assinatura={assinatura}
              onEdit={handleEdit}
              onToggleStatus={handleToggleStatus}
              onCancel={handleCancelClick}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      <AssinaturaForm
        open={formOpen}
        onOpenChange={handleFormClose}
        assinatura={editingAssinatura}
        onSubmit={handleSubmit}
        loading={createAssinatura.isPending || updateAssinatura.isPending}
      />

      {/* Cancel Dialog */}
      <CancelAssinaturaDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        assinatura={cancelingAssinatura}
        onConfirm={handleConfirmCancel}
        loading={cancelAssinatura.isPending}
      />
    </div>
  );
}
