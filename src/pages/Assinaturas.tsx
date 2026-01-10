import { Repeat, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Assinaturas() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Assinaturas
          </h2>
          <p className="text-muted-foreground">
            Controle suas assinaturas e serviços recorrentes
          </p>
        </div>
        <Button className="btn-primary">
          <Plus className="h-5 w-5 mr-2" />
          Nova Assinatura
        </Button>
      </div>

      {/* Empty State */}
      <div className="glass-card rounded-2xl p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-6">
            <Repeat className="h-8 w-8 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">
            Nenhuma assinatura cadastrada
          </h3>
          <p className="text-muted-foreground mb-6">
            Adicione suas assinaturas como Netflix, Spotify, academias e outros serviços recorrentes.
          </p>
          <Button className="btn-primary">
            <Plus className="h-5 w-5 mr-2" />
            Adicionar Primeira Assinatura
          </Button>
        </div>
      </div>
    </div>
  );
}
