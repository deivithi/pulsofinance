import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart as PieChartIcon } from 'lucide-react';

interface DistribuicaoCategoriaChartProps {
  dados: Array<{
    id: string;
    categoria: string;
    valor: number;
    cor: string;
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

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-card rounded-lg p-3 border border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: data.cor }}
          />
          <span className="text-sm font-medium text-foreground">{data.categoria}</span>
        </div>
        <p className="text-lg font-bold text-foreground">{formatCurrency(data.valor)}</p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
      {payload?.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export function DistribuicaoCategoriaChart({ dados, isLoading }: DistribuicaoCategoriaChartProps) {
  const total = dados.reduce((sum, d) => sum + d.valor, 0);
  const hasData = dados.length > 0 && total > 0;

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <PieChartIcon className="h-5 w-5 text-primary" />
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="flex items-center justify-center">
          <Skeleton className="h-[250px] w-[250px] rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <PieChartIcon className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Por Categoria</h2>
      </div>

      {!hasData ? (
        <div className="h-[250px] flex items-center justify-center">
          <p className="text-muted-foreground text-center">
            Sem dados para exibir.<br />
            <span className="text-sm">Adicione categorias aos seus gastos.</span>
          </p>
        </div>
      ) : (
        <div className="relative">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={dados}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="valor"
                nameKey="categoria"
              >
                {dados.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.cor} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center total */}
          <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-bold text-foreground">{formatCurrency(total)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
