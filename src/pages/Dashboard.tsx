import { useMemo, useState } from 'react';
import { addDays, differenceInDays } from 'date-fns';
import { Wallet, CreditCard, Repeat, Calendar, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useParcelamentos } from '@/hooks/useParcelamentos';
import { useAssinaturas } from '@/hooks/useAssinaturas';
import { useCategorias } from '@/hooks/useCategorias';
import { useParcelamentoMutations } from '@/hooks/useParcelamentoMutations';
import { useAssinaturaMutations } from '@/hooks/useAssinaturaMutations';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { BentoCard } from '@/components/dashboard/BentoCard';
import { ProximosVencimentos, VencimentoItem } from '@/components/dashboard/ProximosVencimentos';
import { VisaoDoMesChart } from '@/components/dashboard/VisaoDoMesChart';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { ParcelamentoForm } from '@/components/parcelamentos/ParcelamentoForm';
import { AssinaturaForm } from '@/components/assinaturas/AssinaturaForm';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

const calcularCustoMensal = (valor: number, frequencia: string) => {
  switch (frequencia) {
    case 'mensal': return valor;
    case 'trimestral': return valor / 3;
    case 'semestral': return valor / 6;
    case 'anual': return valor / 12;
    default: return valor;
  }
};

const getNextDueDate = (diaVencimento: number): Date => {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  if (diaVencimento >= currentDay) {
    return new Date(currentYear, currentMonth, diaVencimento);
  } else {
    return new Date(currentYear, currentMonth + 1, diaVencimento);
  }
};

export default function Dashboard() {
  const { user } = useAuth();
  const { data: parcelamentos = [], isLoading: loadingParcelamentos } = useParcelamentos();
  const { data: assinaturas = [], isLoading: loadingAssinaturas } = useAssinaturas({});
  const { data: categorias = [] } = useCategorias();
  const { createParcelamento } = useParcelamentoMutations();
  const { createAssinatura } = useAssinaturaMutations();

  const [showParcelamentoModal, setShowParcelamentoModal] = useState(false);
  const [showAssinaturaModal, setShowAssinaturaModal] = useState(false);

  const isLoading = loadingParcelamentos || loadingAssinaturas;
  const isEmpty = parcelamentos.length === 0 && assinaturas.length === 0;

  // Calculate monthly commitments
  const compromissosDoMes = useMemo(() => {
    const parcelamentosAtivos = parcelamentos.filter((p) => p.status === 'ativo');
    const assinaturasAtivas = assinaturas.filter((a) => a.status === 'ativa');

    const parcelasMes = parcelamentosAtivos.reduce((sum, p) => sum + p.valor_parcela, 0);
    const assinaturasMes = assinaturasAtivas.reduce(
      (sum, a) => sum + calcularCustoMensal(a.valor, a.frequencia),
      0
    );

    return { parcelasMes, assinaturasMes, total: parcelasMes + assinaturasMes };
  }, [parcelamentos, assinaturas]);

  // Calculate active counts and totals
  const parcelamentosAtivos = useMemo(() => {
    const ativos = parcelamentos.filter((p) => p.status === 'ativo');
    const totalParcelas = ativos.reduce(
      (sum, p) => sum + (p.total_parcelas - p.parcelas_pagas),
      0
    );
    return { count: ativos.length, totalParcelas };
  }, [parcelamentos]);

  const assinaturasAtivas = useMemo(() => {
    const ativas = assinaturas.filter((a) => a.status === 'ativa');
    const custoMensal = ativas.reduce(
      (sum, a) => sum + calcularCustoMensal(a.valor, a.frequencia),
      0
    );
    return { count: ativas.length, custoMensal };
  }, [assinaturas]);

  // Get next due item
  const proximoVencimento = useMemo(() => {
    const items: { nome: string; data: Date; valor: number; isUrgent: boolean }[] = [];
    const today = new Date();

    parcelamentos
      .filter((p) => p.status === 'ativo')
      .forEach((p) => {
        const nextDate = getNextDueDate(p.dia_vencimento);
        const daysUntil = differenceInDays(nextDate, today);
        items.push({
          nome: p.descricao,
          data: nextDate,
          valor: p.valor_parcela,
          isUrgent: daysUntil <= 3 && daysUntil >= 0,
        });
      });

    assinaturas
      .filter((a) => a.status === 'ativa')
      .forEach((a) => {
        const nextDate = getNextDueDate(a.dia_cobranca);
        const daysUntil = differenceInDays(nextDate, today);
        items.push({
          nome: a.nome,
          data: nextDate,
          valor: a.valor,
          isUrgent: daysUntil <= 3 && daysUntil >= 0,
        });
      });

    return items.sort((a, b) => a.data.getTime() - b.data.getTime())[0] || null;
  }, [parcelamentos, assinaturas]);

  // Get upcoming due items (next 7 days)
  const proximosVencimentos = useMemo(() => {
    const today = new Date();
    const in7Days = addDays(today, 7);
    const items: VencimentoItem[] = [];

    parcelamentos
      .filter((p) => p.status === 'ativo')
      .forEach((p) => {
        const nextDate = getNextDueDate(p.dia_vencimento);
        const daysUntil = differenceInDays(nextDate, today);
        if (nextDate <= in7Days) {
          items.push({
            id: p.id,
            tipo: 'parcela',
            nome: p.descricao,
            data: nextDate,
            valor: p.valor_parcela,
            isUrgent: daysUntil <= 3 && daysUntil >= 0,
          });
        }
      });

    assinaturas
      .filter((a) => a.status === 'ativa')
      .forEach((a) => {
        const nextDate = getNextDueDate(a.dia_cobranca);
        const daysUntil = differenceInDays(nextDate, today);
        if (nextDate <= in7Days) {
          items.push({
            id: a.id,
            tipo: 'assinatura',
            nome: a.nome,
            data: nextDate,
            valor: a.valor,
            isUrgent: daysUntil <= 3 && daysUntil >= 0,
          });
        }
      });

    return items.sort((a, b) => a.data.getTime() - b.data.getTime());
  }, [parcelamentos, assinaturas]);

  const handleCreateParcelamento = (data: any) => {
    createParcelamento.mutate(data, {
      onSuccess: () => setShowParcelamentoModal(false),
    });
  };

  const handleCreateAssinatura = (data: any) => {
    createAssinatura.mutate(data, {
      onSuccess: () => setShowAssinaturaModal(false),
    });
  };

  // Empty state for new users
  if (!isLoading && isEmpty) {
    return (
      <div className="space-y-8">
        <DashboardHeader user={user} />

        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Wallet className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">
              Bem-vindo ao Financify!
            </h3>
            <p className="text-muted-foreground mb-8">
              Comece adicionando seu primeiro parcelamento ou assinatura para ter uma
              visão completa dos seus gastos mensais.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setShowParcelamentoModal(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Parcelamento
              </Button>
              <Button
                onClick={() => setShowAssinaturaModal(true)}
                variant="outline"
                className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Assinatura
              </Button>
            </div>
          </div>
        </div>

        {/* Modals */}
        <ParcelamentoForm
          open={showParcelamentoModal}
          onOpenChange={setShowParcelamentoModal}
          categorias={categorias}
          onSubmit={handleCreateParcelamento}
          loading={createParcelamento.isPending}
        />

        <AssinaturaForm
          open={showAssinaturaModal}
          onOpenChange={setShowAssinaturaModal}
          onSubmit={handleCreateAssinatura}
          loading={createAssinatura.isPending}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardHeader user={user} />

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card Grande - Compromissos do Mês */}
        <BentoCard
          title="Compromissos do Mês"
          icon={Wallet}
          iconColor="text-primary"
          className="md:col-span-2"
          isLoading={isLoading}
        >
          <p className="text-sm text-muted-foreground mb-1">Total do mês</p>
          <p className="text-3xl font-bold text-foreground mb-3">
            {formatCurrency(compromissosDoMes.total)}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-primary">{formatCurrency(compromissosDoMes.parcelasMes)}</span>
            <span>em parcelas</span>
            <span>+</span>
            <span className="text-purple-400">{formatCurrency(compromissosDoMes.assinaturasMes)}</span>
            <span>em assinaturas</span>
          </div>
        </BentoCard>

        {/* Card Médio - Parcelamentos Ativos */}
        <BentoCard
          title="Parcelamentos"
          icon={CreditCard}
          iconColor="text-primary"
          link={{ to: '/parcelamentos', label: 'Ver todos' }}
          isLoading={isLoading}
        >
          <p className="text-sm text-muted-foreground mb-1">Ativos</p>
          <p className="text-3xl font-bold text-foreground">{parcelamentosAtivos.count}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {parcelamentosAtivos.totalParcelas} parcelas restantes
          </p>
        </BentoCard>

        {/* Card Médio - Assinaturas Ativas */}
        <BentoCard
          title="Assinaturas"
          icon={Repeat}
          iconColor="text-purple-400"
          link={{ to: '/assinaturas', label: 'Ver todas' }}
          isLoading={isLoading}
        >
          <p className="text-sm text-muted-foreground mb-1">Ativas</p>
          <p className="text-3xl font-bold text-foreground">{assinaturasAtivas.count}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {formatCurrency(assinaturasAtivas.custoMensal)}/mês
          </p>
        </BentoCard>

        {/* Card Pequeno - Próximo Vencimento */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-1">
          {isLoading ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-20" />
            </>
          ) : proximoVencimento ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    proximoVencimento.isUrgent ? 'bg-amber-500/10' : 'bg-orange-500/10'
                  }`}
                >
                  <Calendar
                    className={`h-5 w-5 ${
                      proximoVencimento.isUrgent ? 'text-amber-400' : 'text-orange-400'
                    }`}
                  />
                </div>
                <span className="text-sm text-muted-foreground">Próximo Vencimento</span>
              </div>
              <p
                className={`font-semibold truncate ${
                  proximoVencimento.isUrgent ? 'text-amber-400' : 'text-foreground'
                }`}
              >
                {proximoVencimento.nome}
              </p>
              <p className="text-sm text-muted-foreground">
                Dia {proximoVencimento.data.getDate()}
              </p>
              <p
                className={`text-lg font-bold mt-2 ${
                  proximoVencimento.isUrgent ? 'text-amber-400' : 'text-foreground'
                }`}
              >
                {formatCurrency(proximoVencimento.valor)}
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-400" />
                </div>
                <span className="text-sm text-muted-foreground">Próximo Vencimento</span>
              </div>
              <p className="text-muted-foreground">Nenhum vencimento</p>
            </>
          )}
        </div>
      </div>

      {/* Próximos Vencimentos */}
      <ProximosVencimentos items={proximosVencimentos} isLoading={isLoading} />

      {/* Visão do Mês - Gráfico */}
      <VisaoDoMesChart
        parcelamentosTotal={compromissosDoMes.parcelasMes}
        assinaturasTotal={compromissosDoMes.assinaturasMes}
        isLoading={isLoading}
      />

      {/* Quick Actions */}
      <QuickActions
        onAddParcelamento={() => setShowParcelamentoModal(true)}
        onAddAssinatura={() => setShowAssinaturaModal(true)}
      />

      {/* Modals */}
      <ParcelamentoForm
        open={showParcelamentoModal}
        onOpenChange={setShowParcelamentoModal}
        categorias={categorias}
        onSubmit={handleCreateParcelamento}
        loading={createParcelamento.isPending}
      />

      <AssinaturaForm
        open={showAssinaturaModal}
        onOpenChange={setShowAssinaturaModal}
        onSubmit={handleCreateAssinatura}
        loading={createAssinatura.isPending}
      />
    </div>
  );
}
