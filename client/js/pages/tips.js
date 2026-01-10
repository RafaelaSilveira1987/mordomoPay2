/**
 * PAYMORDOMO - PÁGINA DICAS
 */

class TipsPage {
    constructor() {
        this.tips = [
            { id: '1', title: 'Registre suas transações', description: 'Registre todas as suas transações para manter controle total do seu dinheiro.' },
            { id: '2', title: 'Estabeleça metas', description: 'Estabeleça metas realistas e acompanhe seu progresso regularmente.' },
            { id: '3', title: 'Dízimo e ofertas', description: 'Separe uma porcentagem para dízimo e ofertas conforme sua fé.' },
            { id: '4', title: 'Fundo de emergência', description: 'Crie um fundo de emergência para situações inesperadas.' },
            { id: '5', title: 'Revise seus gastos', description: 'Revise seus gastos mensalmente e ajuste seu orçamento conforme necessário.' },
            { id: '6', title: 'Educação financeira', description: 'Invista em educação financeira para melhorar suas decisões.' },
            { id: '7', title: 'Evite dívidas', description: 'Evite dívidas desnecessárias e viva dentro de suas possibilidades.' },
            { id: '8', title: 'Pratique gratidão', description: 'Pratique a gratidão pelos recursos que você tem.' }
        ];
        logger.info('TipsPage: Inicializada');
    }

    async init() {
        this.render();
    }

    render() {
        UI.setValue('page-title', 'Dicas de Saúde Financeira');
        const html = this.tips.map(tip => `
            <div class="tip-card">
                <h3>💡 ${tip.title}</h3>
                <p>${tip.description}</p>
            </div>
        `).join('');
        UI.setHTML('tips-grid', html);
    }
}

const tipsPage = new TipsPage();
