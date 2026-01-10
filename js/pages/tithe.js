/**
 * PAYMORDOMO - PÁGINA DÍZIMOS
 */

class TithePage {
    constructor() {
        this.tithes = [];
        logger.info('TithePage: Inicializada');
    }

    async init() {
        this.tithes = storage.getTithes() || [];
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        document.getElementById('add-tithe-btn')?.addEventListener('click', () => this.openModal());
        document.getElementById('tithe-form')?.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    render() {
        UI.setValue('page-title', 'Dízimos');
        const totalTithe = this.tithes.reduce((sum, t) => sum + t.amount, 0);
        const monthTithe = this.tithes.filter(t => new Date(t.date).getMonth() === new Date().getMonth()).reduce((sum, t) => sum + t.amount, 0);
        
        UI.setValue('total-tithe', Formatter.currency(totalTithe));
        UI.setValue('month-tithe', Formatter.currency(monthTithe));
        UI.setValue('consecutive-months', Math.floor(this.tithes.length / 4));

        const html = this.tithes.map(t => `
            <div class="tithe-item">
                <div class="tithe-info">
                    <p>${t.description || 'Dízimo'}</p>
                    <p class="tithe-date">${Formatter.date(t.date)}</p>
                </div>
                <p class="tithe-amount">${Formatter.currency(t.amount)}</p>
                <div class="tithe-actions">
                    <button class="btn btn-danger btn-small" onclick="tithePage.deleteItem('${t.id}')">🗑️</button>
                </div>
            </div>
        `).join('');
        UI.setHTML('tithe-list', html);
    }

    openModal() {
        UI.clearForm('tithe-form');
        UI.setValue('tithe-date', new Date().toISOString().split('T')[0]);
        UI.showModal('tithe-modal');
    }

    handleSubmit(e) {
        e.preventDefault();
        const amount = parseFloat(UI.getValue('tithe-amount'));
        const date = UI.getValue('tithe-date');
        const description = UI.getValue('tithe-description');

        if (!Validators.positiveNumber(amount)) {
            UI.showToast('Valor inválido', 'error');
            return;
        }

        this.tithes.push({
            id: Date.now().toString(),
            amount, date, description
        });

        storage.setTithes(this.tithes);
        this.render();
        UI.hideModal('tithe-modal');
        UI.showToast('Dízimo registrado', 'success');
    }

    deleteItem(id) {
        if (!UI.confirm('Deletar?')) return;
        this.tithes = this.tithes.filter(t => t.id !== id);
        storage.setTithes(this.tithes);
        this.render();
        UI.showToast('Dízimo deletado', 'success');
    }
}

const tithePage = new TithePage();
