import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Assinatura } from '@/hooks/useAssinaturas';

interface CancelAssinaturaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assinatura: Assinatura | null;
  onConfirm: () => void;
  loading?: boolean;
}

export function CancelAssinaturaDialog({
  open,
  onOpenChange,
  assinatura,
  onConfirm,
  loading,
}: CancelAssinaturaDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancelar assinatura?</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja cancelar a assinatura{' '}
            <span className="font-semibold text-foreground">
              {assinatura?.nome}
            </span>
            ? Esta ação pode ser revertida posteriormente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Voltar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? 'Cancelando...' : 'Cancelar Assinatura'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
