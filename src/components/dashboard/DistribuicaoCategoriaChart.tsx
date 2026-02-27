import { useState, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
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

/**
 * Renderiza o segmento ativo com expansão visual quando o usuário
 * passa o mouse por cima.
 */
const renderActiveShape = (props: any) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 14}
        fill={fill}
      />
      {/* Label da categoria ativa */}
      <text x={cx} y={cy - 14} textAnchor="middle" className="fill-foreground text-xs font-medium">
        {payload.categoria}
      </text>
      <text x={cx} y={cy + 6} textAnchor="middle" className="fill-foreground text-sm font-bold">
        {formatCurrency(value)}
      </text>
      <text x={cx} y={cy + 22} textAnchor="middle" className="fill-muted-foreground text-[10px]">
        {(percent * 100).toFixed(1)}%
      </text>
    </g>
  );
};

export function DistribuicaoCategoriaChart({ dados, isLoading }: DistribuicaoCategoriaChartProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const total = dados.reduce((sum, d) => sum + d.valor, 0);
  const hasData = dados.length > 0 && total > 0;

  const onPieEnter = useCallback((_: any, index: number) => {
    setActiveIndex(index);
  }, []);

  const onPieLeave = useCallback(() => {
    setActiveIndex(-1);
  }, []);

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <PieChartIcon className="h-5 w-5 text-primary" />
          <Skeleton className="h-5 w-40 skeleton-shimmer" />
        </div>
        <div className="flex items-center justify-center">
          <Skeleton className="h-[250px] w-[250px] rounded-full skeleton-shimmer" />
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
                activeIndex={activeIndex >= 0 ? activeIndex : undefined}
                activeShape={renderActiveShape}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                animationBegin={0}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {dados.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.cor}
                    opacity={activeIndex >= 0 && activeIndex !== index ? 0.4 : 1}
                    style={{ transition: 'opacity 0.3s ease', cursor: 'pointer' }}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="glass-card rounded-lg p-3 border border-border">
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: data.cor }}
                          />
                          <span className="text-sm font-medium text-foreground">{data.categoria}</span>
                        </div>
                        <p className="text-lg font-bold text-foreground">{formatCurrency(data.valor)}</p>
                        <p className="text-xs text-muted-foreground">
                          {((data.valor / total) * 100).toFixed(1)}% do total
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Centro: total (somente se nenhum segmento está ativo) */}
          {activeIndex < 0 && (
            <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-bold text-foreground">{formatCurrency(total)}</p>
            </div>
          )}

          {/* Legenda customizada com barras de proporção */}
          <div className="flex flex-col gap-2 mt-2">
            {dados.map((entry, index) => {
              const percent = total > 0 ? (entry.valor / total) * 100 : 0;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 px-2 py-1 rounded-lg cursor-pointer hover:bg-muted/30 transition-colors"
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(-1)}
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: entry.cor }}
                  />
                  <span className="text-xs text-muted-foreground flex-1 truncate">{entry.categoria}</span>
                  <div className="w-16 h-1.5 bg-muted/50 rounded-full overflow-hidden flex-shrink-0">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: entry.cor,
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-foreground tabular-nums w-10 text-right">
                    {percent.toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
