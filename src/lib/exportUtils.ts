import { Parcelamento } from '@/hooks/useParcelamentos';
import { Assinatura } from '@/hooks/useAssinaturas';

// Format currency for export
const fmtCurrency = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const fmtDate = (d: string) => {
    try {
        return new Date(d).toLocaleDateString('pt-BR');
    } catch {
        return d;
    }
};

// Escape CSV field (handle commas, quotes, newlines)
function csvField(value: string | number | null | undefined): string {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

// Generate CSV from parcelamentos
export function exportParcelamentosCSV(parcelamentos: Parcelamento[]): string {
    const headers = [
        'Descrição',
        'Valor Total',
        'Valor Parcela',
        'Parcelas Pagas',
        'Total Parcelas',
        'Dia Vencimento',
        'Data Início',
        'Categoria',
        'Status',
    ];

    const rows = parcelamentos.map((p) => [
        csvField(p.descricao),
        csvField(fmtCurrency(p.valor_total)),
        csvField(fmtCurrency(p.valor_parcela)),
        csvField(p.parcelas_pagas),
        csvField(p.total_parcelas),
        csvField(p.dia_vencimento),
        csvField(fmtDate(p.data_inicio)),
        csvField(p.categoria?.nome || 'Sem categoria'),
        csvField(p.status),
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

// Generate CSV from assinaturas
export function exportAssinaturasCSV(assinaturas: Assinatura[]): string {
    const headers = [
        'Nome',
        'Valor',
        'Frequência',
        'Dia Cobrança',
        'Data Início',
        'Categoria',
        'Status',
    ];

    const freqLabel: Record<string, string> = {
        mensal: 'Mensal',
        trimestral: 'Trimestral',
        semestral: 'Semestral',
        anual: 'Anual',
    };

    const rows = assinaturas.map((a) => [
        csvField(a.nome),
        csvField(fmtCurrency(a.valor)),
        csvField(freqLabel[a.frequencia] || a.frequencia),
        csvField(a.dia_cobranca),
        csvField(fmtDate(a.data_inicio)),
        csvField(a.categoria?.nome || 'Sem categoria'),
        csvField(a.status),
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

// Download helper
export function downloadCSV(csv: string, filename: string) {
    // BOM for Excel UTF-8 compatibility
    const bom = '\uFEFF';
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Combined report CSV
export function exportRelatoMensalCSV(
    parcelamentos: Parcelamento[],
    assinaturas: Assinatura[]
): string {
    const totalParcelas = parcelamentos
        .filter((p) => p.status === 'ativo')
        .reduce((sum, p) => sum + p.valor_parcela, 0);

    const totalAssinaturas = assinaturas
        .filter((a) => a.status === 'ativa')
        .reduce((sum, a) => sum + a.valor, 0);

    const resumo = [
        '=== RELATÓRIO MENSAL PULSOFINANCE ===',
        `Data: ${new Date().toLocaleDateString('pt-BR')}`,
        '',
        'RESUMO',
        `Total em Parcelas (mês): ${fmtCurrency(totalParcelas)}`,
        `Total em Assinaturas (mês): ${fmtCurrency(totalAssinaturas)}`,
        `Total Geral (mês): ${fmtCurrency(totalParcelas + totalAssinaturas)}`,
        '',
        '=== PARCELAMENTOS ===',
        '',
    ];

    const parcelamentoCSV = exportParcelamentosCSV(
        parcelamentos.filter((p) => p.status === 'ativo')
    );

    const assinaturaCSV = exportAssinaturasCSV(
        assinaturas.filter((a) => a.status === 'ativa')
    );

    return [
        resumo.join('\n'),
        parcelamentoCSV,
        '',
        '=== ASSINATURAS ===',
        '',
        assinaturaCSV,
    ].join('\n');
}
