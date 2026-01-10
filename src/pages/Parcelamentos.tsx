import { CreditCard, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Parcelamentos() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Parcelamentos
          </h2>
          <p className="text-muted-foreground">
            Gerencie todos os seus parcelamentos em um só lugar
          </p>
        </div>
        <Button className="btn-primary">
          <Plus className="h-5 w-5 mr-2" />
          Novo Parcelamento
        </Button>
      </div>

      {/* Empty State */}
      <div className="glass-card rounded-2xl p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CreditCard className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">
            Nenhum parcelamento cadastrado
          </h3>
          <p className="text-muted-foreground mb-6">
            Adicione seus parcelamentos para acompanhar as parcelas restantes e valores mensais.
          </p>
          <Button className="btn-primary">
            <Plus className="h-5 w-5 mr-2" />
            Adicionar Primeiro Parcelamento
          </Button>
        </div>
      </div>
    </div>
  );
}
