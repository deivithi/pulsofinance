import { CreditCard, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickActionsProps {
  onAddParcelamento: () => void;
  onAddAssinatura: () => void;
}

export function QuickActions({ onAddParcelamento, onAddAssinatura }: QuickActionsProps) {
  return (
    <div className="fixed bottom-20 right-4 flex gap-2 z-50 md:bottom-6 md:right-6 md:gap-3">
      <Button
        onClick={onAddParcelamento}
        size="sm"
        className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300 md:size-default"
      >
        <CreditCard className="h-4 w-4 md:mr-2" />
        <span className="hidden md:inline">Parcelamento</span>
      </Button>
      <Button
        onClick={onAddAssinatura}
        size="sm"
        className="bg-purple-500 hover:bg-purple-600 shadow-lg shadow-purple-500/20 transition-all duration-300 md:size-default"
      >
        <Repeat className="h-4 w-4 md:mr-2" />
        <span className="hidden md:inline">Assinatura</span>
      </Button>
    </div>
  );
}