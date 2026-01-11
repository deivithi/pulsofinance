import { Check, ChevronDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { PeriodoFiltro } from '@/hooks/useDashboardData';

interface Categoria {
  id: string;
  nome: string;
  cor: string;
}

interface DashboardFiltersProps {
  periodo: PeriodoFiltro;
  setPeriodo: (p: PeriodoFiltro) => void;
  categoriasSelecionadas: string[];
  setCategoriasSelecionadas: (c: string[]) => void;
  categorias: Categoria[];
}

const periodoOptions: { value: PeriodoFiltro; label: string }[] = [
  { value: 'este-mes', label: 'Este mês' },
  { value: 'ultimos-3-meses', label: 'Últimos 3 meses' },
  { value: 'ultimos-6-meses', label: 'Últimos 6 meses' },
  { value: 'este-ano', label: 'Este ano' },
];

export function DashboardFilters({
  periodo,
  setPeriodo,
  categoriasSelecionadas,
  setCategoriasSelecionadas,
  categorias,
}: DashboardFiltersProps) {
  const selectedPeriodoLabel = periodoOptions.find(p => p.value === periodo)?.label || 'Este mês';

  const toggleCategoria = (id: string) => {
    if (categoriasSelecionadas.includes(id)) {
      setCategoriasSelecionadas(categoriasSelecionadas.filter(c => c !== id));
    } else {
      setCategoriasSelecionadas([...categoriasSelecionadas, id]);
    }
  };

  const clearCategorias = () => {
    setCategoriasSelecionadas([]);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Period Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 bg-card/60 border-white/10 hover:bg-card/80">
            {selectedPeriodoLabel}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {periodoOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setPeriodo(option.value)}
              className="flex items-center justify-between"
            >
              {option.label}
              {periodo === option.value && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Category Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2 bg-card/60 border-white/10 hover:bg-card/80">
            <Filter className="h-4 w-4" />
            Categorias
            {categoriasSelecionadas.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {categoriasSelecionadas.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64 p-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Filtrar por categoria</span>
              {categoriasSelecionadas.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCategorias}
                  className="h-auto py-1 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  Limpar
                </Button>
              )}
            </div>
            
            {categorias.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">Nenhuma categoria criada</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categorias.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                  >
                    <Checkbox
                      checked={categoriasSelecionadas.includes(cat.id)}
                      onCheckedChange={() => toggleCategoria(cat.id)}
                    />
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.cor }}
                    />
                    <span className="text-sm flex-1 truncate">{cat.nome}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
