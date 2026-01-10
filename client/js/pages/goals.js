/**
 * PAYMORDOMO - PÁGINA METAS
 * Gerencia metas financeiras
 */

class GoalsPage {
    constructor() {
        this.goals = [];
        this.editingId = null;
        logger.info('GoalsPage: Inicializada');
    }

    async init() {
        try {
            logger.function('GoalsPage.init', 'Inicializando');
            await this.loadGoals();
            this.setupEventListeners();
            this.render();
            logger.success('GoalsPage.init', 'Página inicializada');
        } catch (error) {
            logger.error('GoalsPage.init', { error: error.message });
        }
    }

    async loadGoals() {
        this.goals = storage.getGoals();
        if (this.goals.length === 0) {
            this.goals = [
                { id: '1', name: 'Fundo de Emergência', target: 5000, current: 3200, category: 'Segurança', deadline: '2025-12-31' },
                { id: '2', name: 'Viagem em Família', target: 2000, current: 850, category: 'Lazer', deadline: '2025-07-15' },
                { id: '3', name: 'Investimento em Educação', target: 1500, current: 1500, category: 'Educação', deadline: '2025-03-30' }
            ];
            this.saveGoals();
        }
    }

    saveGoals() {
        storage.setGoals(this.goals);
    }

    setupEventListeners() {
        document.getElementById('add-goal-btn')?.addEventListener('click', () => this.openModal());
        document.getElementById('goal-form')?.addEventListener('submit', (e) => this.handleSubmit(e));
        document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
    }

    render() {
        UI.setValue('page-title', 'Metas Financeiras');
        const html = this.goals.map(goal => {
            const percentage = (goal.current / goal.target) * 100;
            return `
                <div class="goal-full-item">
                    <div class="goal-full-info">
                        <h4>${goal.name}</h4>
                        <p class="text-muted">${goal.category} - Prazo: ${Formatter.date(goal.deadline)}</p>
                        <div class="progress-bar" style="margin-top: 10px;">
                            <div class="progress-fill" style="width: ${percentage}%"></div>
                        </div>
                        <p class="text-muted" style="margin-top: 8px; font-size: 0.9rem;">
                            ${Formatter.currency(goal.current)} de ${Formatter.currency(goal.target)} (${Formatter.percentage(percentage)})
                        </p>
                    </div>
                    <div class="goal-full-actions">
                        <button class="btn btn-primary btn-small" onclick="goalsPage.editGoal('${goal.id}')">✏️ Editar</button>
                        <button class="btn btn-danger btn-small" onclick="goalsPage.deleteGoal('${goal.id}')">🗑️ Deletar</button>
                    </div>
                </div>
            `;
        }).join('');
        UI.setHTML('goals-full-list', html);
    }

    openModal() {
        this.editingId = null;
        UI.clearForm('goal-form');
        UI.setValue('goal-modal-title', 'Nova Meta');
        UI.setValue('goal-deadline', new Date().toISOString().split('T')[0]);
        UI.showModal('goal-modal');
    }

    closeModal() {
        UI.hideModal('goal-modal');
    }

    editGoal(id) {
        const goal = this.goals.find(g => g.id === id);
        if (!goal) return;
        this.editingId = id;
        UI.setValue('goal-name', goal.name);
        UI.setValue('goal-target', goal.target);
        UI.setValue('goal-current', goal.current);
        UI.setValue('goal-category', goal.category);
        UI.setValue('goal-deadline', goal.deadline);
        UI.setValue('goal-modal-title', 'Editar Meta');
        UI.showModal('goal-modal');
    }

    deleteGoal(id) {
        if (!UI.confirm('Tem certeza?')) return;
        const index = this.goals.findIndex(g => g.id === id);
        if (index !== -1) {
            this.goals.splice(index, 1);
            this.saveGoals();
            this.render();
            UI.showToast('Meta deletada', 'success');
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const name = UI.getValue('goal-name');
        const target = parseFloat(UI.getValue('goal-target'));
        const current = parseFloat(UI.getValue('goal-current'));
        const category = UI.getValue('goal-category');
        const deadline = UI.getValue('goal-deadline');

        if (!Validators.notEmpty(name) || !Validators.positiveNumber(target)) {
            UI.showToast('Preencha todos os campos', 'error');
            return;
        }

        if (this.editingId) {
            const goal = this.goals.find(g => g.id === this.editingId);
            if (goal) {
                goal.name = name;
                goal.target = target;
                goal.current = current;
                goal.category = category;
                goal.deadline = deadline;
                UI.showToast('Meta atualizada', 'success');
            }
        } else {
            this.goals.push({
                id: Date.now().toString(),
                name, target, current, category, deadline
            });
            UI.showToast('Meta criada', 'success');
        }

        this.saveGoals();
        this.render();
        this.closeModal();
    }
}

const goalsPage = new GoalsPage();
