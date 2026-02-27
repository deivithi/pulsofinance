import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp } from 'lucide-react';

interface EvolucaoMensalChartProps {
  dados: Array<{
    mes: string;
    mesCompleto: string;
    parcelamentos: number;
    assinaturas: number;
  }>;
  isLoading?: boolean;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
    return (
      <div className="glass-card rounded-lg p-3 border border-border">
        <p className="text-sm font-medium text-foreground mb-2 capitalize">
          {payload[0]?.payload?.mesCompleto || label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">
                {entry.name === 'parcelamentos' ? 'Parcelas' : 'Assinaturas'}
              </span>
            </div>
            <span className="font-medium text-foreground">{formatCurrency(entry.value)}</span>
          </div>
        ))}
        <div className="border-t border-border mt-2 pt-2 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-sm font-bold text-foreground">{formatCurrency(total)}</span>
        </div>
      </div>
    );
  }
  return null;
};

export function EvolucaoMensalChart({ dados, isLoading }: EvolucaoMensalChartProps) {
  const hasData = dados.some(d => d.parcelamentos > 0 || d.assinaturas > 0);

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="h-5 w-5 text-primary" />
          <Skeleton className="h-5 w-40" />
        </div>
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Evolução Mensal</h2>
        <span className="text-sm text-muted-foreground">(últimos 6 meses)</span>
      </div>

      {!hasData ? (
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Sem dados para exibir</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={dados} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorParcelamentos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(234 89% 74%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(234 89% 74%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAssinaturas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(271 81% 56%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(271 81% 56%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <XAxis
              dataKey="mes"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              style={{ textTransform: 'capitalize' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value) => `R$${value / 1000}k`}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => (
                <span className="text-sm text-muted-foreground">
                  {value === 'parcelamentos' ? 'Parcelas' : 'Assinaturas'}
                </span>
              )}
            />
            <Area
              type="monotone"
              dataKey="parcelamentos"
              stroke="hsl(234 89% 74%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorParcelamentos)"
              animationBegin={0}
              animationDuration={1000}
              animationEasing="ease-out"
            />
            <Area
              type="monotone"
              dataKey="assinaturas"
              stroke="hsl(271 81% 56%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAssinaturas)"
              animationBegin={200}
              animationDuration={1000}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
