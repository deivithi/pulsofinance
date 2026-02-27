import { useState } from 'react';
import { User, Bell, LogOut, Trash2, Mail, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { DeleteAccountDialog } from '@/components/configuracoes/DeleteAccountDialog';
import { AvatarUpload } from '@/components/configuracoes/AvatarUpload';
import { useProfile } from '@/hooks/useProfile';

export default function Configuracoes() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { profile, updateProfile } = useProfile();

  const userName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário';
  const userEmail = user?.email || '';

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Até logo!',
      description: 'Você foi desconectado com sucesso.',
    });
    navigate('/');
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Configurações</h2>
        <p className="text-muted-foreground">Gerencie sua conta e preferências</p>
      </div>

      {/* Perfil Section */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Perfil</h3>
        </div>

        <div className="flex items-center gap-4">
          <AvatarUpload
            currentAvatarUrl={profile?.avatar_url}
            userName={userName}
            onAvatarChange={(url) => updateProfile({ avatar_url: url })}
          />
          <div className="flex-1 min-w-0">
            <p className="text-lg font-medium text-foreground truncate">{userName}</p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm truncate">{userEmail}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preferências Section */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="h-5 w-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-foreground">Preferências</h3>
        </div>

        <div className="text-center py-6">
          <p className="text-muted-foreground text-sm">
            Em breve: notificações, tema e outras preferências.
          </p>
        </div>
      </div>

      {/* Conta Section */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-foreground">Conta</h3>
        </div>

        <div className="space-y-4">
          {/* Logout */}
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-foreground">Sair da conta</p>
              <p className="text-sm text-muted-foreground">
                Você será desconectado desta sessão
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="border-border hover:bg-muted/50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>

          <Separator className="bg-white/10" />

          {/* Delete Account */}
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-destructive">Excluir conta</p>
              <p className="text-sm text-muted-foreground">
                Esta ação é permanente e irreversível
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </div>
        </div>
      </div>

      {/* Version Info */}
      <div className="text-center pt-4">
        <p className="text-sm text-muted-foreground">Pulso v1.0.0</p>
      </div>

      {/* Delete Account Dialog */}
      <DeleteAccountDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </div>
  );
}
