import { useState, useEffect } from 'react';
import { Target, TrendingDown, Check, AlertTriangle, Plus, X, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Meta salva no localStorage
interface Meta {
    id: string;
    nome: string;
    valorMeta: number;
    valorAtual: number;
    tipo: 'reducao' | 'limite';
}

const STORAGE_KEY = 'pulso_metas_financeiras';

function loadMetas(): Meta[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : getDefaultMetas();
    } catch {
        return getDefaultMetas();
    }
}

function saveMetas(metas: Meta[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(metas));
}

function getDefaultMetas(): Meta[] {
    return [
        {
            id: '1',
            nome: 'Limite mensal de parcelas',
            valorMeta: 3000,
            valorAtual: 0,
            tipo: 'limite',
        },
        {
            id: '2',
            nome: 'Limite de assinaturas',
            valorMeta: 500,
            valorAtual: 0,
            tipo: 'limite',
        },
        {
            id: '3',
            nome: 'Reduzir gastos totais',
            valorMeta: 2500,
            valorAtual: 0,
            tipo: 'reducao',
        },
    ];
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);

interface MetasFinanceirasProps {
    totalParcelas?: number;
    totalAssinaturas?: number;
}

export function MetasFinanceiras({ totalParcelas = 0, totalAssinaturas = 0 }: MetasFinanceirasProps) {
    const [metas, setMetas] = useState<Meta[]>(() => loadMetas());
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [newMeta, setNewMeta] = useState({ nome: '', valorMeta: '' });

    // Update metas with real values
    useEffect(() => {
        setMetas((prev) => {
            const updated = prev.map((meta) => {
                if (meta.nome.toLowerCase().includes('parcela')) {
                    return { ...meta, valorAtual: totalParcelas };
                }
                if (meta.nome.toLowerCase().includes('assinatura')) {
                    return { ...meta, valorAtual: totalAssinaturas };
                }
                if (meta.nome.toLowerCase().includes('total') || meta.nome.toLowerCase().includes('gasto')) {
                    return { ...meta, valorAtual: totalParcelas + totalAssinaturas };
                }
                return meta;
            });
            saveMetas(updated);
            return updated;
        });
    }, [totalParcelas, totalAssinaturas]);

    const handleUpdateMeta = (id: string) => {
        const value = parseFloat(editValue);
        if (isNaN(value) || value <= 0) return;

        setMetas((prev) => {
            const updated = prev.map((m) =>
                m.id === id ? { ...m, valorMeta: value } : m
            );
            saveMetas(updated);
            return updated;
        });
        setEditingId(null);
        setEditValue('');
    };

    const handleAddMeta = () => {
        const valor = parseFloat(newMeta.valorMeta);
        if (!newMeta.nome.trim() || isNaN(valor) || valor <= 0) return;

        const nova: Meta = {
            id: Date.now().toString(),
            nome: newMeta.nome,
            valorMeta: valor,
            valorAtual: 0,
            tipo: 'limite',
        };

        setMetas((prev) => {
            const updated = [...prev, nova];
            saveMetas(updated);
            return updated;
        });
        setNewMeta({ nome: '', valorMeta: '' });
        setShowAdd(false);
    };

    const handleRemoveMeta = (id: string) => {
        setMetas((prev) => {
            const updated = prev.filter((m) => m.id !== id);
            saveMetas(updated);
            return updated;
        });
    };

    const getStatus = (meta: Meta) => {
        const percent = meta.valorMeta > 0 ? (meta.valorAtual / meta.valorMeta) * 100 : 0;

        if (percent <= 70) return { color: 'text-emerald-500', bg: 'bg-emerald-500', label: 'No caminho', icon: Check };
        if (percent <= 100) return { color: 'text-amber-500', bg: 'bg-amber-500', label: 'Atenção', icon: AlertTriangle };
        return { color: 'text-red-500', bg: 'bg-red-500', label: 'Acima do limite', icon: AlertTriangle };
    };

    return (
        <div className="glass-card rounded-2xl p-5 md:p-6">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <Target className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">Metas Financeiras</h3>
                        <p className="text-xs text-muted-foreground">Defina limites para seus gastos</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdd(!showAdd)}
                    className="text-muted-foreground hover:text-foreground"
                >
                    {showAdd ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </Button>
            </div>

            {/* Add new meta form */}
            {showAdd && (
                <div className="mb-4 p-3 rounded-xl border border-border bg-muted/20 space-y-2">
                    <Input
                        placeholder="Nome da meta (ex: Limite de delivery)"
                        value={newMeta.nome}
                        onChange={(e) => setNewMeta((prev) => ({ ...prev, nome: e.target.value }))}
                        className="text-sm"
                    />
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            placeholder="Valor limite (R$)"
                            value={newMeta.valorMeta}
                            onChange={(e) => setNewMeta((prev) => ({ ...prev, valorMeta: e.target.value }))}
                            className="text-sm"
                        />
                        <Button size="sm" onClick={handleAddMeta} className="bg-emerald-500 hover:bg-emerald-600">
                            Adicionar
                        </Button>
                    </div>
                </div>
            )}

            {/* Metas list */}
            <div className="space-y-4">
                {metas.map((meta) => {
                    const status = getStatus(meta);
                    const percent = meta.valorMeta > 0 ? Math.min((meta.valorAtual / meta.valorMeta) * 100, 100) : 0;
                    const StatusIcon = status.icon;

                    return (
                        <div key={meta.id} className="group">
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                    <StatusIcon className={cn('h-4 w-4', status.color)} />
                                    <span className="text-sm font-medium text-foreground">{meta.nome}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className={cn('text-xs font-medium', status.color)}>{status.label}</span>
                                    <button
                                        onClick={() => handleRemoveMeta(meta.id)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted/50 rounded"
                                    >
                                        <X className="h-3 w-3 text-muted-foreground" />
                                    </button>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="h-2.5 rounded-full bg-muted/50 overflow-hidden mb-1.5">
                                <div
                                    className={cn('h-full rounded-full transition-all duration-700 ease-out', status.bg)}
                                    style={{ width: `${percent}%` }}
                                />
                            </div>

                            {/* Values */}
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>
                                    {formatCurrency(meta.valorAtual)} de{' '}
                                    {editingId === meta.id ? (
                                        <span className="inline-flex items-center gap-1">
                                            <input
                                                type="number"
                                                className="w-20 bg-muted/30 border border-border rounded px-1.5 py-0.5 text-xs text-foreground"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleUpdateMeta(meta.id)}
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => handleUpdateMeta(meta.id)}
                                                className="text-emerald-500 hover:text-emerald-400"
                                            >
                                                <Check className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setEditingId(meta.id);
                                                setEditValue(meta.valorMeta.toString());
                                            }}
                                            className="inline-flex items-center gap-0.5 hover:text-foreground transition-colors"
                                        >
                                            {formatCurrency(meta.valorMeta)}
                                            <Pencil className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100" />
                                        </button>
                                    )}
                                </span>
                                <span className="font-medium">{percent.toFixed(0)}%</span>
                            </div>
                        </div>
                    );
                })}

                {metas.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground text-sm">
                        <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Nenhuma meta definida</p>
                        <p className="text-xs mt-1">Clique no + para criar uma meta</p>
                    </div>
                )}
            </div>
        </div>
    );
}
