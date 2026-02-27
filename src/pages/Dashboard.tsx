import { useState } from 'react';
import { differenceInDays } from 'date-fns';
import { Wallet, CreditCard, Repeat, Calendar, Plus, FileSpreadsheet, FileText, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useDashboardData, PeriodoFiltro } from '@/hooks/useDashboardData';
import { useParcelamentoMutations } from '@/hooks/useParcelamentoMutations';
import { useAssinaturaMutations } from '@/hooks/useAssinaturaMutations';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { ProximosVencimentos } from '@/components/dashboard/ProximosVencimentos';
import { EvolucaoMensalChart } from '@/components/dashboard/EvolucaoMensalChart';
import { DistribuicaoCategoriaChart } from '@/components/dashboard/DistribuicaoCategoriaChart';
import { ProjecaoFutura } from '@/components/dashboard/ProjecaoFutura';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { NotificationBell } from '@/components/dashboard/NotificationBell';
import { MetasFinanceiras } from '@/components/dashboard/MetasFinanceiras';
import { ExportButton } from '@/components/shared/ExportButton';
import { exportRelatoMensalCSV, downloadCSV } from '@/lib/exportUtils';
import { exportRelatorioMensalPDF } from '@/lib/exportPdfUtils';
import { useParcelamentos } from '@/hooks/useParcelamentos';
import { useAssinaturas } from '@/hooks/useAssinaturas';
import { InsightsInteligentes } from '@/components/dashboard/InsightsInteligentes';
import { OnboardingGuiado } from '@/components/dashboard/OnboardingGuiado';
import { ParcelamentoForm } from '@/components/parcelamentos/ParcelamentoForm';
import { AssinaturaForm } from '@/components/assinaturas/AssinaturaForm';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { createParcelamento } = useParcelamentoMutations();
  const { createAssinatura } = useAssinaturaMutations();
  const { data: parcelamentos = [] } = useParcelamentos();
  const { data: assinaturas = [] } = useAssinaturas();

  // Filter states
  const [periodo, setPeriodo] = useState<PeriodoFiltro>('este-mes');
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([]);

  // Modal states
  const [showParcelamentoModal, setShowParcelamentoModal] = useState(false);
  const [showAssinaturaModal, setShowAssinaturaModal] = useState(false);

  // Dashboard data
  const dashboardData = useDashboardData({
    periodo,
    categoriaIds: categoriasSelecionadas,
  });

  const {
    totalDoPeriodo,
    comparativoMesAnterior,
    parcelamentosAtivos,
    assinaturasAtivas,
    proximoVencimento,
    evolucaoMensal,
    distribuicaoCategoria,
    proximosVencimentos,
    projecaoFutura,
    categorias,
    isLoading,
    isEmpty,
  } = dashboardData;

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

  // Format next due date info
  const getProximoVencimentoInfo = () => {
    if (!proximoVencimento) return { subInfo: 'Nenhum vencimento', isUrgent: false };

    const today = new Date();
    const daysUntil = differenceInDays(proximoVencimento.data, today);

    if (daysUntil === 0) {
      return { subInfo: 'HOJE', isUrgent: true };
    } else if (daysUntil === 1) {
      return { subInfo: 'Amanhã', isUrgent: true };
    } else if (daysUntil < 0) {
      return { subInfo: `${Math.abs(daysUntil)} dias atrás`, isUrgent: true };
    } else {
      return { subInfo: `em ${daysUntil} dias`, isUrgent: daysUntil <= 3 };
    }
  };

  const proximoVencimentoInfo = getProximoVencimentoInfo();

  // Empty state for new users
  if (!isLoading && isEmpty) {
    return (
      <div className="space-y-8">
        <DashboardHeader user={user} avatarUrl={profile?.avatar_url} />

        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Wallet className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">
              Bem-vindo ao Pulso!
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
    <div className="space-y-6">
      {/* Header with Avatar + Notifications */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <DashboardHeader user={user} avatarUrl={profile?.avatar_url} />
          <NotificationBell items={proximosVencimentos.map(v => ({
            id: v.id,
            tipo: v.tipo,
            nome: v.nome,
            data: v.data,
            valor: v.valor,
          }))} />
        </div>
        <div className="flex items-center gap-2">
          <ExportButton
            options={[
              {
                label: 'Relatório Mensal (PDF)',
                description: 'Relatório visual premium completo',
                icon: FileText,
                onClick: () => exportRelatorioMensalPDF(parcelamentos, assinaturas),
              },
              {
                label: 'Relatório Mensal (CSV)',
                description: 'Dados tabelados para planilha',
                icon: FileSpreadsheet,
                onClick: () => downloadCSV(exportRelatoMensalCSV(parcelamentos, assinaturas), 'relatorio_mensal'),
              },
            ]}
          />
          <DashboardFilters
            periodo={periodo}
            setPeriodo={setPeriodo}
            categoriasSelecionadas={categoriasSelecionadas}
            setCategoriasSelecionadas={setCategoriasSelecionadas}
            categorias={categorias}
          />
        </div>
      </div>

      {/* Summary Cards - Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 - Total do Mês */}
        <SummaryCard
          title="Total do Período"
          value={formatCurrency(totalDoPeriodo.total)}
          subInfo={`${formatCurrency(totalDoPeriodo.parcelas)} em parcelas + ${formatCurrency(totalDoPeriodo.assinaturas)} em assinaturas`}
          icon={Wallet}
          iconColor="text-primary"
          iconBgColor="bg-primary/10"
          trend={comparativoMesAnterior.percentual !== 0 ? {
            value: comparativoMesAnterior.percentual,
            isPositive: comparativoMesAnterior.isPositive,
          } : undefined}
          isLoading={isLoading}
          className="md:col-span-2 lg:col-span-1"
        />

        {/* Card 2 - Parcelamentos Ativos */}
        <SummaryCard
          title="Parcelamentos Ativos"
          value={parcelamentosAtivos.count}
          subInfo={`${formatCurrency(parcelamentosAtivos.valorRestante)} restante`}
          icon={CreditCard}
          iconColor="text-primary"
          iconBgColor="bg-primary/10"
          link="/parcelamentos"
          isLoading={isLoading}
        />

        {/* Card 3 - Assinaturas Ativas */}
        <SummaryCard
          title="Assinaturas Ativas"
          value={assinaturasAtivas.count}
          subInfo={`${formatCurrency(assinaturasAtivas.custoMensal)}/mês`}
          icon={Repeat}
          iconColor="text-purple-400"
          iconBgColor="bg-purple-500/10"
          link="/assinaturas"
          isLoading={isLoading}
        />

        {/* Card 4 - Próximo Vencimento */}
        <SummaryCard
          title="Próximo Vencimento"
          value={proximoVencimento?.nome || 'Nenhum'}
          subInfo={proximoVencimentoInfo.subInfo}
          icon={Calendar}
          iconColor={proximoVencimentoInfo.isUrgent ? 'text-amber-400' : 'text-orange-400'}
          iconBgColor={proximoVencimentoInfo.isUrgent ? 'bg-amber-500/10' : 'bg-orange-500/10'}
          urgent={proximoVencimentoInfo.isUrgent}
          isLoading={isLoading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <EvolucaoMensalChart dados={evolucaoMensal} isLoading={isLoading} />
        </div>
        <DistribuicaoCategoriaChart dados={distribuicaoCategoria} isLoading={isLoading} />
      </div>

      {/* Insights Inteligentes */}
      <InsightsInteligentes
        totalParcelas={parcelamentosAtivos.valorRestante || 0}
        totalAssinaturas={assinaturasAtivas.custoMensal || 0}
        parcelamentosAtivos={parcelamentosAtivos.count || 0}
        assinaturasAtivas={assinaturasAtivas.count || 0}
        proximoVencimentoDias={
          proximoVencimento
            ? differenceInDays(proximoVencimento.data, new Date())
            : undefined
        }
        evolucaoMensal={evolucaoMensal}
      />

      {/* Upcoming Due Dates */}
      <ProximosVencimentos
        items={proximosVencimentos}
        isLoading={isLoading}
        limit={5}
        showViewAll={true}
      />

      {/* Future Projection */}
      <ProjecaoFutura projecao={projecaoFutura} isLoading={isLoading} />

      {/* Metas Financeiras */}
      <MetasFinanceiras
        totalParcelas={parcelamentosAtivos.valorRestante || 0}
        totalAssinaturas={assinaturasAtivas.custoMensal || 0}
      />

      {/* Quick Actions */}
      <QuickActions
        onAddParcelamento={() => setShowParcelamentoModal(true)}
        onAddAssinatura={() => setShowAssinaturaModal(true)}
      />

      {/* Onboarding para novos usuários */}
      <OnboardingGuiado />

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
