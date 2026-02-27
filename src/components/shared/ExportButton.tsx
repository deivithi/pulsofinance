import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExportOption {
    label: string;
    description: string;
    icon: typeof FileSpreadsheet;
    onClick: () => void;
}

interface ExportButtonProps {
    options: ExportOption[];
    label?: string;
}

export function ExportButton({ options, label = 'Exportar' }: ExportButtonProps) {
    const [open, setOpen] = useState(false);

    // Quick export (first option) if only one option
    if (options.length === 1) {
        return (
            <Button
                variant="outline"
                size="sm"
                onClick={options[0].onClick}
                className="gap-2 border-border hover:bg-muted/50"
            >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
            </Button>
        );
    }

    return (
        <div className="relative">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(!open)}
                className="gap-2 border-border hover:bg-muted/50"
            >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
                <ChevronDown className={cn('h-3 w-3 transition-transform duration-200', open && 'rotate-180')} />
            </Button>

            {open && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-64 z-50 glass-card rounded-xl border border-border shadow-xl p-1 animate-in fade-in slide-in-from-top-2 duration-200">
                        {options.map((option, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    option.onClick();
                                    setOpen(false);
                                }}
                                className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                            >
                                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                                    <option.icon className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-foreground block">{option.label}</span>
                                    <span className="text-xs text-muted-foreground">{option.description}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
