import { Plus, CreditCard, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickActionsProps {
  onAddParcelamento: () => void;
  onAddAssinatura: () => void;
}

export function QuickActions({ onAddParcelamento, onAddAssinatura }: QuickActionsProps) {
  return (
    <div className="fixed bottom-6 right-6 flex gap-3 z-50">
      <Button
        onClick={onAddParcelamento}
        className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300"
      >
        <CreditCard className="h-4 w-4 mr-2" />
        Parcelamento
      </Button>
      <Button
        onClick={onAddAssinatura}
        className="bg-purple-500 hover:bg-purple-600 shadow-lg shadow-purple-500/20 transition-all duration-300"
      >
        <Repeat className="h-4 w-4 mr-2" />
        Assinatura
      </Button>
    </div>
  );
}
