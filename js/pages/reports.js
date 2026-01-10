/**
 * PAYMORDOMO - PÁGINA RELATÓRIOS
 */

class ReportsPage {
    constructor() {
        logger.info('ReportsPage: Inicializada');
    }

    async init() {
        this.render();
    }

    render() {
        UI.setValue('page-title', 'Relatórios');
        
        const transactions = storage.getTransactions() || [];
        const totalIncome = transactions.filter(t => t.type === 'entrada').reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = transactions.filter(t => t.type === 'saida').reduce((sum, t) => sum + t.amount, 0);
        const balance = totalIncome - totalExpenses;

        const html = `
            <div class="report-item">
                <p class="report-label">Total de Receitas</p>
                <p class="report-value">${Formatter.currency(totalIncome)}</p>
            </div>
            <div class="report-item">
                <p class="report-label">Total de Despesas</p>
                <p class="report-value">${Formatter.currency(totalExpenses)}</p>
            </div>
            <div class="report-item">
                <p class="report-label">Saldo</p>
                <p class="report-value">${Formatter.currency(balance)}</p>
            </div>
            <div class="report-item">
                <p class="report-label">Taxa de Economia</p>
                <p class="report-value">${Formatter.percentage((balance / totalIncome) * 100)}</p>
            </div>
        `;
        UI.setHTML('reports-summary', html);
    }
}

const reportsPage = new ReportsPage();
