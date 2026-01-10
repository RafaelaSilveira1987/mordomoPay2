/**
 * PAYMORDOMO - PÁGINA DASHBOARD
 * Exibe resumo financeiro e informações principais
 */

class DashboardPage {
    constructor() {
        this.verses = [
            { text: 'Na casa do sábio há comida escolhida e azeite, mas o tolo tudo desperdiça.', ref: 'Provérbios 21:20' },
            { text: 'Quem ama o dinheiro nunca terá dinheiro suficiente.', ref: 'Eclesiastes 5:10' },
            { text: 'O que o sábio acumula com a mão é melhor que o que o tolo desperdiça.', ref: 'Provérbios 10:14' },
            { text: 'O amor ao dinheiro é a raiz de todos os males.', ref: '1 Timóteo 6:10' },
            { text: 'Mais bem-aventurado é dar do que receber.', ref: 'Atos 20:35' }
        ];

        this.tips = [
            'Registre todas as suas transações para manter controle total do seu dinheiro.',
            'Estabeleça metas realistas e acompanhe seu progresso regularmente.',
            'Separe uma porcentagem para dízimo e ofertas conforme sua fé.',
            'Crie um fundo de emergência para situações inesperadas.',
            'Revise seus gastos mensalmente e ajuste seu orçamento conforme necessário.',
            'Invista em educação financeira para melhorar suas decisões.',
            'Evite dívidas desnecessárias e viva dentro de suas possibilidades.',
            'Pratique a gratidão pelos recursos que você tem.'
        ];

        this.currentVerseIndex = 0;
        this.currentTipIndex = 0;

        this.mockGoals = [
            { id: '1', name: 'Fundo de Emergência', target: 5000, current: 3200, category: 'Segurança', deadline: '2025-12-31' },
            { id: '2', name: 'Viagem em Família', target: 2000, current: 850, category: 'Lazer', deadline: '2025-07-15' },
            { id: '3', name: 'Investimento em Educação', target: 1500, current: 1500, category: 'Educação', deadline: '2025-03-30' }
        ];

        this.mockAchievements = [
            { id: '1', name: 'Dizimista Fiel', description: '3 meses consecutivos de dízimo', icon: '🙏', unlocked: true },
            { id: '2', name: 'Mordomo Sábio', description: '30 dias sem gastos supérfluos', icon: '💎', unlocked: true },
            { id: '3', name: 'Gestor Diligente', description: '6 meses de economia positiva', icon: '🏆', unlocked: false },
            { id: '4', name: 'Provedor Organizado', description: 'Todas as categorias com limite definido', icon: '⭐', unlocked: false }
        ];

        logger.info('DashboardPage: Inicializada');
    }

    /**
     * Inicializa a página
     */
    async init() {
        try {
            logger.function('DashboardPage.init', 'Inicializando');

            // Carrega dados
            await this.loadData();

            // Configura event listeners
            this.setupEventListeners();

            // Renderiza conteúdo
            this.render();

            logger.success('DashboardPage.init', 'Página inicializada');
        } catch (error) {
            logger.error('DashboardPage.init', { error: error.message });
        }
    }

    /**
     * Carrega dados
     */
    async loadData() {
        try {
            logger.function('DashboardPage.loadData', 'Carregando dados');

            // Aqui você buscaria dados do Supabase
            // Por enquanto, usa dados mock

            logger.success('DashboardPage.loadData', 'Dados carregados');
        } catch (error) {
            logger.error('DashboardPage.loadData', { error: error.message });
        }
    }

    /**
     * Configura event listeners
     */
    setupEventListeners() {
        // Versículos
        document.getElementById('prev-verse')?.addEventListener('click', () => this.previousVerse());
        document.getElementById('next-verse')?.addEventListener('click', () => this.nextVerse());

        // Dicas
        document.getElementById('prev-tip')?.addEventListener('click', () => this.previousTip());
        document.getElementById('next-tip')?.addEventListener('click', () => this.nextTip());

        logger.debug('DashboardPage: Event listeners configurados');
    }

    /**
     * Renderiza a página
     */
    render() {
        try {
            logger.function('DashboardPage.render', 'Renderizando');

            // Atualiza título
            UI.setValue('page-title', 'Dashboard');

            // Renderiza estatísticas
            this.renderStats();

            // Renderiza metas
            this.renderGoals();

            // Renderiza conquistas
            this.renderAchievements();

            // Renderiza versículo
            this.renderVerse();

            // Renderiza dica
            this.renderTip();

            logger.success('DashboardPage.render', 'Página renderizada');
        } catch (error) {
            logger.error('DashboardPage.render', { error: error.message });
        }
    }

    /**
     * Renderiza estatísticas
     */
    renderStats() {
        const totalIncome = 5200;
        const totalExpenses = 3850;
        const balance = totalIncome - totalExpenses;
        const healthScore = 72;

        UI.setValue('total-income', Formatter.currency(totalIncome));
        UI.setValue('total-expenses', Formatter.currency(totalExpenses));
        UI.setValue('total-balance', Formatter.currency(balance));
        UI.setValue('health-score', Formatter.percentage(healthScore));
        UI.setValue('health-progress', healthScore);
        UI.setValue('monthly-savings', Formatter.currency(balance));
        UI.setValue('active-goals', this.mockGoals.length);

        // Atualiza barra de progresso
        const progressBar = document.getElementById('health-progress');
        if (progressBar) {
            progressBar.style.width = healthScore + '%';
        }
    }

    /**
     * Renderiza metas
     */
    renderGoals() {
        const goalsHtml = this.mockGoals.map(goal => {
            const percentage = (goal.current / goal.target) * 100;
            return `
                <div class="goal-item">
                    <div class="goal-header">
                        <div>
                            <div class="goal-name">${goal.name}</div>
                            <div class="goal-category">${goal.category}</div>
                        </div>
                        <div class="goal-percentage">${Formatter.percentage(percentage)}</div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="goal-footer">
                        <span>${Formatter.currency(goal.current)}</span>
                        <span>Meta: ${Formatter.currency(goal.target)}</span>
                    </div>
                </div>
            `;
        }).join('');

        UI.setHTML('goals-list', goalsHtml);
    }

    /**
     * Renderiza conquistas
     */
    renderAchievements() {
        const achievementsHtml = this.mockAchievements.map(achievement => `
            <div class="achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
                ${achievement.unlocked ? '<div class="achievement-status">✓ Desbloqueado</div>' : ''}
            </div>
        `).join('');

        UI.setHTML('achievements-grid', achievementsHtml);
    }

    /**
     * Renderiza versículo
     */
    renderVerse() {
        const verse = this.verses[this.currentVerseIndex];
        UI.setValue('daily-verse', verse.text);
        UI.setValue('verse-ref', verse.ref);

        // Salva versículo atual
        storage.setLastVerse({ index: this.currentVerseIndex, verse });
    }

    /**
     * Renderiza dica
     */
    renderTip() {
        const tip = this.tips[this.currentTipIndex];
        UI.setValue('daily-tip', tip);

        // Salva dica atual
        storage.setLastTip({ index: this.currentTipIndex, tip });
    }

    /**
     * Próximo versículo
     */
    nextVerse() {
        this.currentVerseIndex = (this.currentVerseIndex + 1) % this.verses.length;
        this.renderVerse();
        logger.info('DashboardPage: Próximo versículo');
    }

    /**
     * Versículo anterior
     */
    previousVerse() {
        this.currentVerseIndex = (this.currentVerseIndex - 1 + this.verses.length) % this.verses.length;
        this.renderVerse();
        logger.info('DashboardPage: Versículo anterior');
    }

    /**
     * Próxima dica
     */
    nextTip() {
        this.currentTipIndex = (this.currentTipIndex + 1) % this.tips.length;
        this.renderTip();
        logger.info('DashboardPage: Próxima dica');
    }

    /**
     * Dica anterior
     */
    previousTip() {
        this.currentTipIndex = (this.currentTipIndex - 1 + this.tips.length) % this.tips.length;
        this.renderTip();
        logger.info('DashboardPage: Dica anterior');
    }
}

// Instância global
const dashboardPage = new DashboardPage();
