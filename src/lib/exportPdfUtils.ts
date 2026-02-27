import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Parcelamento } from '@/hooks/useParcelamentos';
import { Assinatura } from '@/hooks/useAssinaturas';

// ============================================================
// PulsoFinance — Gerador de PDF Premium
// Design: Gradientes indigo, tipografia limpa, tabelas modernas
// ============================================================

// Cores do Design System PulsoFinance
const COLORS = {
    primary: [79, 70, 229] as [number, number, number],      // Indigo-600
    primaryLight: [99, 102, 241] as [number, number, number], // Indigo-500
    dark: [17, 24, 39] as [number, number, number],           // Gray-900
    text: [55, 65, 81] as [number, number, number],           // Gray-700
    textLight: [107, 114, 128] as [number, number, number],   // Gray-500
    white: [255, 255, 255] as [number, number, number],
    bg: [249, 250, 251] as [number, number, number],          // Gray-50
    border: [229, 231, 235] as [number, number, number],      // Gray-200
    success: [16, 185, 129] as [number, number, number],      // Emerald-500
    warning: [245, 158, 11] as [number, number, number],      // Amber-500
};

const fmtCurrency = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const fmtDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('pt-BR'); }
    catch { return d; }
};

// Cabeçalho premium com gradiente
function drawHeader(doc: jsPDF, title: string, subtitle: string) {
    const pageWidth = doc.internal.pageSize.getWidth();

    // Gradiente de fundo (simulado com retângulo)
    doc.setFillColor(...COLORS.primary);
    doc.rect(0, 0, pageWidth, 52, 'F');

    // Barra sutil mais clara
    doc.setFillColor(...COLORS.primaryLight);
    doc.rect(0, 48, pageWidth, 4, 'F');

    // Logo/Marca
    doc.setTextColor(...COLORS.white);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('PulsoFinance', 16, 22);

    // Tagline
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 255, 255);
    doc.text('controle financeiro inteligente', 16, 30);

    // Título do relatório
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 16, 44);

    // Data e subtítulo (lado direito)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const dataStr = `Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    doc.text(dataStr, pageWidth - 16, 22, { align: 'right' });
    doc.setFontSize(10);
    doc.text(subtitle, pageWidth - 16, 44, { align: 'right' });
}

// Rodapé com paginação
function drawFooter(doc: jsPDF) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageCount = doc.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        // Linha separadora
        doc.setDrawColor(...COLORS.border);
        doc.setLineWidth(0.5);
        doc.line(16, pageHeight - 18, pageWidth - 16, pageHeight - 18);

        // Texto do rodapé
        doc.setTextColor(...COLORS.textLight);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('PulsoFinance — Relatório Financeiro', 16, pageHeight - 10);
        doc.text(`Página ${i} de ${pageCount}`, pageWidth - 16, pageHeight - 10, { align: 'right' });
    }
}

// Card de resumo (KPI)
function drawSummaryCard(
    doc: jsPDF,
    x: number,
    y: number,
    width: number,
    label: string,
    value: string,
    accentColor: [number, number, number] = COLORS.primary
) {
    // Fundo branco com bordas arredondadas (simulado)
    doc.setFillColor(...COLORS.white);
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, width, 30, 3, 3, 'FD');

    // Barra de acento lateral
    doc.setFillColor(...accentColor);
    doc.rect(x, y + 4, 3, 22, 'F');

    // Label
    doc.setTextColor(...COLORS.textLight);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(label, x + 10, y + 12);

    // Valor
    doc.setTextColor(...COLORS.dark);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(value, x + 10, y + 24);
}

// ============================================================
// EXPORTAÇÃO: Parcelamentos
// ============================================================
export function exportParcelamentosPDF(parcelamentos: Parcelamento[]) {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    // Calcular totais
    const ativos = parcelamentos.filter(p => p.status === 'ativo');
    const quitados = parcelamentos.filter(p => p.status === 'quitado');
    const totalMensal = ativos.reduce((sum, p) => sum + p.valor_parcela, 0);
    const totalGeral = parcelamentos.reduce((sum, p) => sum + p.valor_total, 0);

    // Cabeçalho
    drawHeader(doc, 'Relatório de Parcelamentos', `${parcelamentos.length} parcelamento(s)`);

    // Cards de resumo
    const cardWidth = (pageWidth - 48) / 3;
    drawSummaryCard(doc, 16, 60, cardWidth, 'Custo Mensal', fmtCurrency(totalMensal), COLORS.primary);
    drawSummaryCard(doc, 24 + cardWidth, 60, cardWidth, 'Ativos', `${ativos.length} parcelamento(s)`, COLORS.success);
    drawSummaryCard(doc, 32 + cardWidth * 2, 60, cardWidth, 'Total Investido', fmtCurrency(totalGeral), COLORS.warning);

    // Tabela de dados
    const tableData = parcelamentos.map(p => [
        p.descricao,
        fmtCurrency(p.valor_total),
        fmtCurrency(p.valor_parcela),
        `${p.parcelas_pagas}/${p.total_parcelas}`,
        `Dia ${p.dia_vencimento}`,
        fmtDate(p.data_inicio),
        p.categoria?.nome || 'Sem categoria',
        p.status === 'ativo' ? 'Ativo' : 'Quitado',
    ]);

    autoTable(doc, {
        startY: 98,
        head: [['Descrição', 'Valor Total', 'Parcela', 'Progresso', 'Vencimento', 'Início', 'Categoria', 'Status']],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: COLORS.primary,
            textColor: COLORS.white,
            fontStyle: 'bold',
            fontSize: 9,
            cellPadding: 5,
            halign: 'left',
        },
        bodyStyles: {
            fontSize: 8.5,
            cellPadding: 4,
            textColor: COLORS.text,
            lineColor: COLORS.border,
            lineWidth: 0.2,
        },
        alternateRowStyles: {
            fillColor: [245, 247, 250],
        },
        columnStyles: {
            0: { cellWidth: 50, fontStyle: 'bold' },
            1: { halign: 'right' },
            2: { halign: 'right' },
            3: { halign: 'center' },
            4: { halign: 'center' },
            5: { halign: 'center' },
            7: { halign: 'center' },
        },
        didParseCell: (data) => {
            // Colorir status
            if (data.section === 'body' && data.column.index === 7) {
                const val = data.cell.raw as string;
                if (val === 'Ativo') {
                    data.cell.styles.textColor = COLORS.success;
                    data.cell.styles.fontStyle = 'bold';
                } else if (val === 'Quitado') {
                    data.cell.styles.textColor = COLORS.textLight;
                }
            }
        },
        margin: { left: 16, right: 16 },
    });

    drawFooter(doc);
    doc.save(`parcelamentos_pulsofinance_${new Date().toISOString().slice(0, 10)}.pdf`);
}

// ============================================================
// EXPORTAÇÃO: Assinaturas
// ============================================================
export function exportAssinaturasPDF(assinaturas: Assinatura[]) {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    const freqLabel: Record<string, string> = {
        mensal: 'Mensal', trimestral: 'Trimestral',
        semestral: 'Semestral', anual: 'Anual',
    };

    // Calcular totais
    const ativas = assinaturas.filter(a => a.status === 'ativa');
    const custoMensal = ativas.reduce((sum, a) => sum + a.valor, 0);
    const custoAnual = custoMensal * 12;

    // Cabeçalho
    drawHeader(doc, 'Relatório de Assinaturas', `${assinaturas.length} assinatura(s)`);

    // Cards de resumo
    const cardWidth = (pageWidth - 48) / 3;
    drawSummaryCard(doc, 16, 60, cardWidth, 'Custo Mensal', fmtCurrency(custoMensal), COLORS.primary);
    drawSummaryCard(doc, 24 + cardWidth, 60, cardWidth, 'Custo Anual (est.)', fmtCurrency(custoAnual), COLORS.warning);
    drawSummaryCard(doc, 32 + cardWidth * 2, 60, cardWidth, 'Ativas', `${ativas.length} assinatura(s)`, COLORS.success);

    // Tabela
    const tableData = assinaturas.map(a => [
        a.nome,
        fmtCurrency(a.valor),
        freqLabel[a.frequencia] || a.frequencia,
        `Dia ${a.dia_cobranca}`,
        fmtDate(a.data_inicio),
        a.categoria?.nome || 'Sem categoria',
        a.status === 'ativa' ? 'Ativa' : 'Cancelada',
    ]);

    autoTable(doc, {
        startY: 98,
        head: [['Nome', 'Valor', 'Frequência', 'Cobrança', 'Início', 'Categoria', 'Status']],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: COLORS.primary,
            textColor: COLORS.white,
            fontStyle: 'bold',
            fontSize: 9,
            cellPadding: 5,
            halign: 'left',
        },
        bodyStyles: {
            fontSize: 8.5,
            cellPadding: 4,
            textColor: COLORS.text,
            lineColor: COLORS.border,
            lineWidth: 0.2,
        },
        alternateRowStyles: {
            fillColor: [245, 247, 250],
        },
        columnStyles: {
            0: { cellWidth: 60, fontStyle: 'bold' },
            1: { halign: 'right' },
            2: { halign: 'center' },
            3: { halign: 'center' },
            4: { halign: 'center' },
            6: { halign: 'center' },
        },
        didParseCell: (data) => {
            if (data.section === 'body' && data.column.index === 6) {
                const val = data.cell.raw as string;
                if (val === 'Ativa') {
                    data.cell.styles.textColor = COLORS.success;
                    data.cell.styles.fontStyle = 'bold';
                } else {
                    data.cell.styles.textColor = COLORS.textLight;
                }
            }
        },
        margin: { left: 16, right: 16 },
    });

    drawFooter(doc);
    doc.save(`assinaturas_pulsofinance_${new Date().toISOString().slice(0, 10)}.pdf`);
}

// ============================================================
// EXPORTAÇÃO: Relatório Mensal Completo
// ============================================================
export function exportRelatorioMensalPDF(
    parcelamentos: Parcelamento[],
    assinaturas: Assinatura[]
) {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    const ativosParc = parcelamentos.filter(p => p.status === 'ativo');
    const ativasAssin = assinaturas.filter(a => a.status === 'ativa');
    const totalParc = ativosParc.reduce((sum, p) => sum + p.valor_parcela, 0);
    const totalAssin = ativasAssin.reduce((sum, a) => sum + a.valor, 0);
    const totalGeral = totalParc + totalAssin;

    // Cabeçalho
    drawHeader(doc, 'Relatório Financeiro Mensal', new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }));

    // Cards de resumo (3 colunas no retrato)
    const cardWidth = (pageWidth - 40) / 3;
    drawSummaryCard(doc, 16, 60, cardWidth, 'Parcelas', fmtCurrency(totalParc), COLORS.primary);
    drawSummaryCard(doc, 20 + cardWidth, 60, cardWidth, 'Assinaturas', fmtCurrency(totalAssin), COLORS.primaryLight);
    drawSummaryCard(doc, 24 + cardWidth * 2, 60, cardWidth, 'Total Mensal', fmtCurrency(totalGeral), COLORS.warning);

    // Seção: Parcelamentos Ativos
    let currentY = 100;
    doc.setTextColor(...COLORS.dark);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Parcelamentos Ativos', 16, currentY);

    // Linha decorativa
    doc.setFillColor(...COLORS.primary);
    doc.rect(16, currentY + 2, 40, 1.5, 'F');
    currentY += 8;

    if (ativosParc.length > 0) {
        autoTable(doc, {
            startY: currentY,
            head: [['Descrição', 'Parcela', 'Progresso', 'Vencimento', 'Categoria']],
            body: ativosParc.map(p => [
                p.descricao,
                fmtCurrency(p.valor_parcela),
                `${p.parcelas_pagas}/${p.total_parcelas}`,
                `Dia ${p.dia_vencimento}`,
                p.categoria?.nome || '—',
            ]),
            theme: 'grid',
            headStyles: {
                fillColor: COLORS.primary,
                textColor: COLORS.white,
                fontStyle: 'bold',
                fontSize: 8.5,
                cellPadding: 4,
            },
            bodyStyles: {
                fontSize: 8,
                cellPadding: 3.5,
                textColor: COLORS.text,
                lineColor: COLORS.border,
                lineWidth: 0.2,
            },
            alternateRowStyles: { fillColor: [245, 247, 250] },
            columnStyles: {
                0: { fontStyle: 'bold' },
                1: { halign: 'right' },
                2: { halign: 'center' },
                3: { halign: 'center' },
            },
            margin: { left: 16, right: 16 },
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        currentY = (doc as any).lastAutoTable.finalY + 12;
    } else {
        doc.setTextColor(...COLORS.textLight);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.text('Nenhum parcelamento ativo no momento.', 16, currentY + 5);
        currentY += 15;
    }

    // Seção: Assinaturas Ativas
    doc.setTextColor(...COLORS.dark);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Assinaturas Ativas', 16, currentY);

    doc.setFillColor(...COLORS.primaryLight);
    doc.rect(16, currentY + 2, 40, 1.5, 'F');
    currentY += 8;

    if (ativasAssin.length > 0) {
        autoTable(doc, {
            startY: currentY,
            head: [['Nome', 'Valor', 'Frequência', 'Cobrança', 'Categoria']],
            body: ativasAssin.map(a => [
                a.nome,
                fmtCurrency(a.valor),
                a.frequencia.charAt(0).toUpperCase() + a.frequencia.slice(1),
                `Dia ${a.dia_cobranca}`,
                a.categoria?.nome || '—',
            ]),
            theme: 'grid',
            headStyles: {
                fillColor: COLORS.primaryLight,
                textColor: COLORS.white,
                fontStyle: 'bold',
                fontSize: 8.5,
                cellPadding: 4,
            },
            bodyStyles: {
                fontSize: 8,
                cellPadding: 3.5,
                textColor: COLORS.text,
                lineColor: COLORS.border,
                lineWidth: 0.2,
            },
            alternateRowStyles: { fillColor: [245, 247, 250] },
            columnStyles: {
                0: { fontStyle: 'bold' },
                1: { halign: 'right' },
                2: { halign: 'center' },
                3: { halign: 'center' },
            },
            margin: { left: 16, right: 16 },
        });
    } else {
        doc.setTextColor(...COLORS.textLight);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.text('Nenhuma assinatura ativa no momento.', 16, currentY + 5);
    }

    drawFooter(doc);
    doc.save(`relatorio_mensal_pulsofinance_${new Date().toISOString().slice(0, 10)}.pdf`);
}
