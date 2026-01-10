import { CreditCard, Repeat, TrendingUp, Calendar } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Olá! 👋
        </h2>
        <p className="text-muted-foreground">
          Aqui está o resumo das suas finanças
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">Este mês</span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Parcelamentos</p>
          <p className="text-2xl font-bold text-foreground">R$ 0,00</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Repeat className="h-6 w-6 text-purple-400" />
            </div>
            <span className="text-xs text-muted-foreground">Mensal</span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Assinaturas</p>
          <p className="text-2xl font-bold text-foreground">R$ 0,00</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
            <span className="text-xs text-muted-foreground">Total</span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Gasto Mensal</p>
          <p className="text-2xl font-bold text-foreground">R$ 0,00</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-orange-400" />
            </div>
            <span className="text-xs text-muted-foreground">Próximo</span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Vencimentos</p>
          <p className="text-2xl font-bold text-foreground">0</p>
        </div>
      </div>

      {/* Empty State */}
      <div className="glass-card rounded-2xl p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CreditCard className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">
            Comece a organizar suas finanças
          </h3>
          <p className="text-muted-foreground mb-6">
            Adicione seus parcelamentos e assinaturas para ter uma visão completa dos seus gastos mensais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">
              Adicionar Parcelamento
            </button>
            <button className="btn-secondary">
              Adicionar Assinatura
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
