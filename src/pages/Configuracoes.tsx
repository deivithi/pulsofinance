import { Settings, User, Bell, Shield, Palette } from 'lucide-react';

export default function Configuracoes() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Configurações
        </h2>
        <p className="text-muted-foreground">
          Personalize sua experiência no Financify
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Perfil</h3>
              <p className="text-sm text-muted-foreground">Gerencie suas informações pessoais</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Bell className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Notificações</h3>
              <p className="text-sm text-muted-foreground">Configure alertas e lembretes</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Segurança</h3>
              <p className="text-sm text-muted-foreground">Altere sua senha e configurações de segurança</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Palette className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Aparência</h3>
              <p className="text-sm text-muted-foreground">Personalize o visual do aplicativo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Version Info */}
      <div className="text-center pt-8">
        <p className="text-sm text-muted-foreground">
          Financify v1.0.0
        </p>
      </div>
    </div>
  );
}
