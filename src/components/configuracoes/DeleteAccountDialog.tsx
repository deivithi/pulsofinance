import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAccountDialog({ open, onOpenChange }: DeleteAccountDialogProps) {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const isConfirmValid = confirmText === 'EXCLUIR';

  const handleDelete = async () => {
    if (!isConfirmValid || !user) return;

    setIsDeleting(true);
    try {
      // Delete user data from all tables
      await supabase.from('parcelamentos').delete().eq('user_id', user.id);
      await supabase.from('assinaturas').delete().eq('user_id', user.id);
      await supabase.from('categorias').delete().eq('user_id', user.id);

      // Sign out the user
      await signOut();
      
      toast({
        title: 'Conta excluída',
        description: 'Sua conta e todos os dados foram removidos.',
      });

      navigate('/');
    } catch (error) {
      toast({
        title: 'Erro ao excluir conta',
        description: 'Ocorreu um erro ao excluir sua conta. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setConfirmText('');
      onOpenChange(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setConfirmText('');
    }
    onOpenChange(newOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="glass-card border-border">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-foreground text-xl">
              Excluir conta permanentemente
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-muted-foreground">
            Esta ação é <span className="text-destructive font-semibold">irreversível</span>. 
            Todos os seus dados serão permanentemente excluídos, incluindo:
          </AlertDialogDescription>
          <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1">
            <li>Todos os parcelamentos</li>
            <li>Todas as assinaturas</li>
            <li>Todas as categorias</li>
          </ul>
        </AlertDialogHeader>

        <div className="py-4">
          <Label htmlFor="confirm-delete" className="text-sm text-muted-foreground">
            Digite <span className="text-foreground font-mono font-semibold">EXCLUIR</span> para confirmar:
          </Label>
          <Input
            id="confirm-delete"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="EXCLUIR"
            className="mt-2 bg-muted/50 border-border"
            autoComplete="off"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="border-border hover:bg-muted/50">
            Cancelar
          </AlertDialogCancel>
          <Button
            onClick={handleDelete}
            disabled={!isConfirmValid || isDeleting}
            variant="destructive"
          >
            {isDeleting ? 'Excluindo...' : 'Excluir Conta'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
