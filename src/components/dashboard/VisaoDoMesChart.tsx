import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface VisaoDoMesChartProps {
  parcelamentosTotal: number;
  assinaturasTotal: number;
  isLoading?: boolean;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-800 border border-border rounded-lg px-3 py-2 shadow-xl">
        <p className="text-sm font-medium text-foreground">
          {payload[0].payload.name}: {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export function VisaoDoMesChart({ parcelamentosTotal, assinaturasTotal, isLoading }: VisaoDoMesChartProps) {
  const chartData = [
    { name: 'Parcelamentos', valor: parcelamentosTotal, color: 'hsl(239, 84%, 67%)' },
    { name: 'Assinaturas', valor: assinaturasTotal, color: 'hsl(271, 91%, 65%)' },
  ];

  const total = parcelamentosTotal + assinaturasTotal;

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Visão do Mês</h2>
        </div>
        <Skeleton className="h-[120px] w-full rounded-lg" />
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Visão do Mês</h2>
        </div>
        <div className="text-center py-8">
          <TrendingUp className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">Sem dados para exibir este mês</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Visão do Mês</h2>
      </div>

      <div className="h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={chartData} margin={{ left: 0, right: 20 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={100}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar dataKey="valor" radius={[0, 8, 8, 0]} barSize={24}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-muted-foreground">Parcelamentos</span>
          <span className="font-medium text-foreground">{formatCurrency(parcelamentosTotal)}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-muted-foreground">Assinaturas</span>
          <span className="font-medium text-foreground">{formatCurrency(assinaturasTotal)}</span>
        </div>
      </div>
    </div>
  );
}
