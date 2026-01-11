import { useMemo } from 'react';
import { addMonths, subMonths, startOfMonth, endOfMonth, addDays, differenceInDays, format, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useParcelamentos } from './useParcelamentos';
import { useAssinaturas } from './useAssinaturas';
import { useCategorias } from './useCategorias';

export type PeriodoFiltro = 'este-mes' | 'ultimos-3-meses' | 'ultimos-6-meses' | 'este-ano';

export interface VencimentoItem {
  id: string;
  tipo: 'parcela' | 'assinatura';
  nome: string;
  data: Date;
  valor: number;
  isUrgent: boolean;
}

interface UseDashboardDataOptions {
  periodo: PeriodoFiltro;
  categoriaIds: string[];
}

const calcularCustoMensal = (valor: number, frequencia: string) => {
  switch (frequencia) {
    case 'mensal': return valor;
    case 'trimestral': return valor / 3;
    case 'semestral': return valor / 6;
    case 'anual': return valor / 12;
    default: return valor;
  }
};

const getNextDueDate = (diaVencimento: number, referenceDate: Date = new Date()): Date => {
  const currentDay = referenceDate.getDate();
  const currentMonth = referenceDate.getMonth();
  const currentYear = referenceDate.getFullYear();

  if (diaVencimento >= currentDay) {
    return new Date(currentYear, currentMonth, diaVencimento);
  } else {
    return new Date(currentYear, currentMonth + 1, diaVencimento);
  }
};

const getDueDateForMonth = (diaVencimento: number, month: Date): Date => {
  const lastDayOfMonth = endOfMonth(month).getDate();
  const actualDay = Math.min(diaVencimento, lastDayOfMonth);
  return new Date(month.getFullYear(), month.getMonth(), actualDay);
};

export function useDashboardData({ periodo, categoriaIds }: UseDashboardDataOptions) {
  const { data: parcelamentos = [], isLoading: loadingParcelamentos } = useParcelamentos();
  const { data: assinaturas = [], isLoading: loadingAssinaturas } = useAssinaturas({});
  const { data: categorias = [], isLoading: loadingCategorias } = useCategorias();

  const isLoading = loadingParcelamentos || loadingAssinaturas || loadingCategorias;

  // Filter data by categories
  const filteredParcelamentos = useMemo(() => {
    if (categoriaIds.length === 0) return parcelamentos;
    return parcelamentos.filter(p => p.categoria_id && categoriaIds.includes(p.categoria_id));
  }, [parcelamentos, categoriaIds]);

  const filteredAssinaturas = useMemo(() => {
    if (categoriaIds.length === 0) return assinaturas;
    return assinaturas.filter(a => a.categoria_id && categoriaIds.includes(a.categoria_id));
  }, [assinaturas, categoriaIds]);

  // Get date range for periodo
  const dateRange = useMemo(() => {
    const today = new Date();
    const currentMonthStart = startOfMonth(today);
    const currentMonthEnd = endOfMonth(today);

    switch (periodo) {
      case 'este-mes':
        return { start: currentMonthStart, end: currentMonthEnd, months: 1 };
      case 'ultimos-3-meses':
        return { start: startOfMonth(subMonths(today, 2)), end: currentMonthEnd, months: 3 };
      case 'ultimos-6-meses':
        return { start: startOfMonth(subMonths(today, 5)), end: currentMonthEnd, months: 6 };
      case 'este-ano':
        return { start: new Date(today.getFullYear(), 0, 1), end: currentMonthEnd, months: today.getMonth() + 1 };
      default:
        return { start: currentMonthStart, end: currentMonthEnd, months: 1 };
    }
  }, [periodo]);

  // Calculate total for period
  const totalDoPeriodo = useMemo(() => {
    const parcelamentosAtivos = filteredParcelamentos.filter(p => p.status === 'ativo');
    const assinaturasAtivas = filteredAssinaturas.filter(a => a.status === 'ativa');

    const parcelasTotalPeriodo = parcelamentosAtivos.reduce((sum, p) => sum + (p.valor_parcela * dateRange.months), 0);
    const assinaturasTotalPeriodo = assinaturasAtivas.reduce(
      (sum, a) => sum + (calcularCustoMensal(a.valor, a.frequencia) * dateRange.months),
      0
    );

    return {
      parcelas: parcelasTotalPeriodo,
      assinaturas: assinaturasTotalPeriodo,
      total: parcelasTotalPeriodo + assinaturasTotalPeriodo
    };
  }, [filteredParcelamentos, filteredAssinaturas, dateRange]);

  // Calculate previous period for comparison
  const comparativoMesAnterior = useMemo(() => {
    const today = new Date();
    const lastMonth = subMonths(today, 1);
    const lastMonthStart = startOfMonth(lastMonth);
    const lastMonthEnd = endOfMonth(lastMonth);

    const parcelamentosAtivos = filteredParcelamentos.filter(p => p.status === 'ativo');
    const assinaturasAtivas = filteredAssinaturas.filter(a => a.status === 'ativa');

    // For current month
    const currentMonthTotal = parcelamentosAtivos.reduce((sum, p) => sum + p.valor_parcela, 0) +
      assinaturasAtivas.reduce((sum, a) => sum + calcularCustoMensal(a.valor, a.frequencia), 0);

    // For last month (approximate - same subscriptions, same installments)
    const lastMonthTotal = currentMonthTotal; // Simplified comparison
    
    const diferenca = currentMonthTotal - lastMonthTotal;
    const percentual = lastMonthTotal > 0 ? ((diferenca / lastMonthTotal) * 100) : 0;

    return {
      valor: diferenca,
      percentual: Math.round(percentual),
      isPositive: diferenca >= 0
    };
  }, [filteredParcelamentos, filteredAssinaturas]);

  // Active counts
  const parcelamentosAtivos = useMemo(() => {
    const ativos = filteredParcelamentos.filter(p => p.status === 'ativo');
    const valorRestante = ativos.reduce(
      (sum, p) => sum + ((p.total_parcelas - p.parcelas_pagas) * p.valor_parcela),
      0
    );
    return { count: ativos.length, valorRestante };
  }, [filteredParcelamentos]);

  const assinaturasAtivas = useMemo(() => {
    const ativas = filteredAssinaturas.filter(a => a.status === 'ativa');
    const custoMensal = ativas.reduce(
      (sum, a) => sum + calcularCustoMensal(a.valor, a.frequencia),
      0
    );
    return { count: ativas.length, custoMensal };
  }, [filteredAssinaturas]);

  // Next due item
  const proximoVencimento = useMemo(() => {
    const items: { id: string; tipo: 'parcela' | 'assinatura'; nome: string; data: Date; valor: number; daysUntil: number }[] = [];
    const today = new Date();

    filteredParcelamentos
      .filter(p => p.status === 'ativo')
      .forEach(p => {
        const nextDate = getNextDueDate(p.dia_vencimento);
        const daysUntil = differenceInDays(nextDate, today);
        items.push({
          id: p.id,
          tipo: 'parcela',
          nome: p.descricao,
          data: nextDate,
          valor: p.valor_parcela,
          daysUntil
        });
      });

    filteredAssinaturas
      .filter(a => a.status === 'ativa')
      .forEach(a => {
        const nextDate = getNextDueDate(a.dia_cobranca);
        const daysUntil = differenceInDays(nextDate, today);
        items.push({
          id: a.id,
          tipo: 'assinatura',
          nome: a.nome,
          data: nextDate,
          valor: a.valor,
          daysUntil
        });
      });

    const sorted = items.sort((a, b) => a.data.getTime() - b.data.getTime());
    return sorted[0] || null;
  }, [filteredParcelamentos, filteredAssinaturas]);

  // Upcoming due items (next 7 days)
  const proximosVencimentos = useMemo(() => {
    const today = new Date();
    const in7Days = addDays(today, 7);
    const items: VencimentoItem[] = [];

    filteredParcelamentos
      .filter(p => p.status === 'ativo')
      .forEach(p => {
        const nextDate = getNextDueDate(p.dia_vencimento);
        const daysUntil = differenceInDays(nextDate, today);
        if (nextDate <= in7Days) {
          items.push({
            id: p.id,
            tipo: 'parcela',
            nome: p.descricao,
            data: nextDate,
            valor: p.valor_parcela,
            isUrgent: daysUntil <= 1 && daysUntil >= 0,
          });
        }
      });

    filteredAssinaturas
      .filter(a => a.status === 'ativa')
      .forEach(a => {
        const nextDate = getNextDueDate(a.dia_cobranca);
        const daysUntil = differenceInDays(nextDate, today);
        if (nextDate <= in7Days) {
          items.push({
            id: a.id,
            tipo: 'assinatura',
            nome: a.nome,
            data: nextDate,
            valor: a.valor,
            isUrgent: daysUntil <= 1 && daysUntil >= 0,
          });
        }
      });

    return items.sort((a, b) => a.data.getTime() - b.data.getTime());
  }, [filteredParcelamentos, filteredAssinaturas]);

  // Monthly evolution data (last 6 months)
  const evolucaoMensal = useMemo(() => {
    const today = new Date();
    const months: { mes: string; mesCompleto: string; parcelamentos: number; assinaturas: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const month = subMonths(today, i);
      const monthStart = startOfMonth(month);
      
      const parcelamentosAtivos = filteredParcelamentos.filter(p => p.status === 'ativo');
      const assinaturasAtivas = filteredAssinaturas.filter(a => a.status === 'ativa');

      const parcelasDoMes = parcelamentosAtivos.reduce((sum, p) => sum + p.valor_parcela, 0);
      const assinaturasDoMes = assinaturasAtivas.reduce(
        (sum, a) => sum + calcularCustoMensal(a.valor, a.frequencia),
        0
      );

      months.push({
        mes: format(month, 'MMM', { locale: ptBR }),
        mesCompleto: format(month, 'MMMM yyyy', { locale: ptBR }),
        parcelamentos: parcelasDoMes,
        assinaturas: assinaturasDoMes,
      });
    }

    return months;
  }, [filteredParcelamentos, filteredAssinaturas]);

  // Category distribution
  const distribuicaoCategoria = useMemo(() => {
    const categoryTotals: Record<string, { nome: string; valor: number; cor: string }> = {};
    
    // Add "Sem categoria" as default
    categoryTotals['sem-categoria'] = { nome: 'Sem categoria', valor: 0, cor: '#6b7280' };

    categorias.forEach(cat => {
      categoryTotals[cat.id] = { nome: cat.nome, valor: 0, cor: cat.cor || '#6366f1' };
    });

    filteredParcelamentos.filter(p => p.status === 'ativo').forEach(p => {
      const catId = p.categoria_id || 'sem-categoria';
      if (categoryTotals[catId]) {
        categoryTotals[catId].valor += p.valor_parcela;
      } else {
        categoryTotals['sem-categoria'].valor += p.valor_parcela;
      }
    });

    filteredAssinaturas.filter(a => a.status === 'ativa').forEach(a => {
      const catId = a.categoria_id || 'sem-categoria';
      if (categoryTotals[catId]) {
        categoryTotals[catId].valor += calcularCustoMensal(a.valor, a.frequencia);
      } else {
        categoryTotals['sem-categoria'].valor += calcularCustoMensal(a.valor, a.frequencia);
      }
    });

    return Object.entries(categoryTotals)
      .filter(([_, data]) => data.valor > 0)
      .map(([id, data]) => ({
        id,
        categoria: data.nome,
        valor: data.valor,
        cor: data.cor,
      }));
  }, [filteredParcelamentos, filteredAssinaturas, categorias]);

  // 3-month projection
  const projecaoFutura = useMemo(() => {
    const today = new Date();
    const projection: { mes: string; mesCompleto: string; total: number; parcelas: number; assinaturas: number }[] = [];

    for (let i = 1; i <= 3; i++) {
      const futureMonth = addMonths(today, i);
      
      const parcelamentosAtivos = filteredParcelamentos.filter(p => {
        if (p.status !== 'ativo') return false;
        const parcelasRestantes = p.total_parcelas - p.parcelas_pagas;
        return parcelasRestantes >= i;
      });

      const assinaturasAtivas = filteredAssinaturas.filter(a => a.status === 'ativa');

      const parcelasDoMes = parcelamentosAtivos.reduce((sum, p) => sum + p.valor_parcela, 0);
      const assinaturasDoMes = assinaturasAtivas.reduce(
        (sum, a) => sum + calcularCustoMensal(a.valor, a.frequencia),
        0
      );

      projection.push({
        mes: format(futureMonth, 'MMM', { locale: ptBR }),
        mesCompleto: format(futureMonth, 'MMMM', { locale: ptBR }),
        total: parcelasDoMes + assinaturasDoMes,
        parcelas: parcelasDoMes,
        assinaturas: assinaturasDoMes,
      });
    }

    return projection;
  }, [filteredParcelamentos, filteredAssinaturas]);

  const isEmpty = parcelamentos.length === 0 && assinaturas.length === 0;

  return {
    // Raw data
    parcelamentos: filteredParcelamentos,
    assinaturas: filteredAssinaturas,
    categorias,

    // Summary cards
    totalDoPeriodo,
    comparativoMesAnterior,
    parcelamentosAtivos,
    assinaturasAtivas,
    proximoVencimento,

    // Charts
    evolucaoMensal,
    distribuicaoCategoria,

    // Lists
    proximosVencimentos,

    // Projection
    projecaoFutura,

    // States
    isLoading,
    isEmpty,
  };
}
