/**
 * PAYMORDOMO - PÁGINA TRANSAÇÕES
 * Gerencia transações financeiras (CRUD)
 */

class TransactionsPage {
    constructor() {
        this.transactions = [];
        this.categories = ['Alimentação', 'Moradia', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Espiritual', 'Renda', 'Renda Extra'];
        this.filterType = 'all';
        this.filterCategory = 'all';
        this.editingId = null;

        logger.info('TransactionsPage: Inicializada');
    }

    /**
     * Inicializa a página
     */
    async init() {
        try {
            logger.function('TransactionsPage.init', 'Inicializando');

            // Carrega dados
            await this.loadTransactions();

            // Configura categorias
            this.setupCategories();

            // Configura event listeners
            this.setupEventListeners();

            // Renderiza
            this.render();

            logger.success('TransactionsPage.init', 'Página inicializada');
        } catch (error) {
            logger.error('TransactionsPage.init', { error: error.message });
        }
    }

    /**
     * Carrega transações
     */
    async loadTransactions() {
        try {
            logger.function('TransactionsPage.loadTransactions', 'Carregando');

            // Carrega do localStorage
            this.transactions = storage.getTransactions();

            // Se vazio, usa dados mock
            if (this.transactions.length === 0) {
                this.transactions = [
                    { id: '1', description: 'Salário', amount: 5200, type: 'entrada', category: 'Renda', date: '2025-01-05', payee: 'Empresa XYZ' },
                    { id: '2', description: 'Aluguel', amount: 1500, type: 'saida', category: 'Moradia', date: '2025-01-01', payee: 'Proprietário' },
                    { id: '3', description: 'Supermercado', amount: 320, type: 'saida', category: 'Alimentação', date: '2025-01-03', payee: 'Mercado Central' },
                    { id: '4', description: 'Dízimo', amount: 520, type: 'saida', category: 'Espiritual', date: '2025-01-07', payee: 'Igreja' },
                    { id: '5', description: 'Freelance', amount: 800, type: 'entrada', category: 'Renda Extra', date: '2025-01-06', payee: 'Cliente' }
                ];
                this.saveTransactions();
            }

            logger.success('TransactionsPage.loadTransactions', `${this.transactions.length} transações carregadas`);
        } catch (error) {
            logger.error('TransactionsPage.loadTransactions', { error: error.message });
        }
    }

    /**
     * Salva transações
     */
    saveTransactions() {
        storage.setTransactions(this.transactions);
        logger.debug('TransactionsPage: Transações salvas');
    }

    /**
     * Configura categorias
     */
    setupCategories() {
        const select = document.getElementById('trans-category');
        const filterSelect = document.getElementById('filter-category');

        if (select) {
            select.innerHTML = this.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
        }

        if (filterSelect) {
            filterSelect.innerHTML = '<option value="all">Todas</option>' + 
                this.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
        }
    }

    /**
     * Configura event listeners
     */
    setupEventListeners() {
        // Botões
        document.getElementById('add-transaction-btn')?.addEventListener('click', () => this.openModal());
        document.getElementById('export-btn')?.addEventListener('click', () => this.exportTransactions());

        // Filtros
        document.getElementById('filter-type')?.addEventListener('change', (e) => {
            this.filterType = e.target.value;
            this.render();
        });

        document.getElementById('filter-category')?.addEventListener('change', (e) => {
            this.filterCategory = e.target.value;
            this.render();
        });

        // Modal
        document.getElementById('transaction-form')?.addEventListener('submit', (e) => this.handleSubmit(e));
        document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });

        logger.debug('TransactionsPage: Event listeners configurados');
    }

    /**
     * Renderiza a página
     */
    render() {
        try {
            logger.function('TransactionsPage.render', 'Renderizando');

            // Atualiza título
            UI.setValue('page-title', 'Transações');

            // Filtra transações
            const filtered = this.getFilteredTransactions();

            // Calcula totais
            const totalIncome = filtered.filter(t => t.type === 'entrada').reduce((sum, t) => sum + t.amount, 0);
            const totalExpenses = filtered.filter(t => t.type === 'saida').reduce((sum, t) => sum + t.amount, 0);
            const balance = totalIncome - totalExpenses;

            // Atualiza cards
            UI.setValue('trans-income', Formatter.currency(totalIncome));
            UI.setValue('trans-expenses', Formatter.currency(totalExpenses));
            UI.setValue('trans-balance', Formatter.currency(balance));

            // Renderiza tabela
            this.renderTable(filtered);

            logger.success('TransactionsPage.render', 'Página renderizada');
        } catch (error) {
            logger.error('TransactionsPage.render', { error: error.message });
        }
    }

    /**
     * Obtém transações filtradas
     */
    getFilteredTransactions() {
        return this.transactions.filter(t => {
            const typeMatch = this.filterType === 'all' || t.type === this.filterType;
            const categoryMatch = this.filterCategory === 'all' || t.category === this.filterCategory;
            return typeMatch && categoryMatch;
        });
    }

    /**
     * Renderiza tabela
     */
    renderTable(transactions) {
        const tbody = document.getElementById('transactions-tbody');
        if (!tbody) return;

        tbody.innerHTML = transactions.map(t => `
            <tr>
                <td>${t.description}</td>
                <td><span class="category-badge">${t.category}</span></td>
                <td>${t.payee}</td>
                <td>${Formatter.date(t.date)}</td>
                <td class="transaction-amount ${t.type}">${Formatter.currency(t.amount)}</td>
                <td class="action-cell">
                    <button class="btn btn-primary btn-small" onclick="transactionsPage.editTransaction('${t.id}')">✏️</button>
                    <button class="btn btn-danger btn-small" onclick="transactionsPage.deleteTransaction('${t.id}')">🗑️</button>
                </td>
            </tr>
        `).join('');

        logger.debug(`TransactionsPage: ${transactions.length} transações renderizadas`);
    }

    /**
     * Abre modal
     */
    openModal() {
        this.editingId = null;
        UI.clearForm('transaction-form');
        UI.setValue('modal-title', 'Nova Transação');
        UI.setValue('trans-date', new Date().toISOString().split('T')[0]);
        UI.showModal('transaction-modal');
        logger.debug('TransactionsPage: Modal aberto');
    }

    /**
     * Fecha modal
     */
    closeModal() {
        UI.hideModal('transaction-modal');
        logger.debug('TransactionsPage: Modal fechado');
    }

    /**
     * Edita transação
     */
    editTransaction(id) {
        const transaction = this.transactions.find(t => t.id === id);
        if (!transaction) return;

        this.editingId = id;
        UI.setValue('trans-description', transaction.description);
        UI.setValue('trans-amount', transaction.amount);
        UI.setValue('trans-type', transaction.type);
        UI.setValue('trans-category', transaction.category);
        UI.setValue('trans-payee', transaction.payee);
        UI.setValue('trans-date', transaction.date);
        UI.setValue('modal-title', 'Editar Transação');
        UI.showModal('transaction-modal');

        logger.transaction('Edit', id, transaction.amount, transaction.type);
    }

    /**
     * Deleta transação
     */
    deleteTransaction(id) {
        if (!UI.confirm('Tem certeza que deseja deletar esta transação?')) return;

        const index = this.transactions.findIndex(t => t.id === id);
        if (index !== -1) {
            const transaction = this.transactions[index];
            this.transactions.splice(index, 1);
            this.saveTransactions();
            this.render();

            logger.transaction('Delete', id, transaction.amount, transaction.type);
            UI.showToast('Transação deletada com sucesso', 'success');
        }
    }

    /**
     * Submete formulário
     */
    handleSubmit(e) {
        e.preventDefault();

        const description = UI.getValue('trans-description');
        const amount = parseFloat(UI.getValue('trans-amount'));
        const type = UI.getValue('trans-type');
        const category = UI.getValue('trans-category');
        const payee = UI.getValue('trans-payee');
        const date = UI.getValue('trans-date');

        // Valida
        if (!Validators.notEmpty(description) || !Validators.positiveNumber(amount)) {
            UI.showToast('Preencha todos os campos corretamente', 'error');
            return;
        }

        if (this.editingId) {
            // Atualiza
            const transaction = this.transactions.find(t => t.id === this.editingId);
            if (transaction) {
                transaction.description = description;
                transaction.amount = amount;
                transaction.type = type;
                transaction.category = category;
                transaction.payee = payee;
                transaction.date = date;

                logger.transaction('Update', this.editingId, amount, type);
                UI.showToast('Transação atualizada com sucesso', 'success');
            }
        } else {
            // Cria nova
            const newTransaction = {
                id: Date.now().toString(),
                description,
                amount,
                type,
                category,
                payee,
                date
            };

            this.transactions.push(newTransaction);
            logger.transaction('Create', newTransaction.id, amount, type);
            UI.showToast('Transação criada com sucesso', 'success');
        }

        this.saveTransactions();
        this.render();
        this.closeModal();
    }

    /**
     * Exporta transações
     */
    exportTransactions() {
        const data = this.getFilteredTransactions();
        const csv = this.convertToCSV(data);
        this.downloadCSV(csv, 'transacoes.csv');
        logger.info('TransactionsPage: Transações exportadas');
    }

    /**
     * Converte para CSV
     */
    convertToCSV(data) {
        const headers = ['Descrição', 'Valor', 'Tipo', 'Categoria', 'Pagador/Recebedor', 'Data'];
        const rows = data.map(t => [
            t.description,
            t.amount,
            t.type,
            t.category,
            t.payee,
            Formatter.date(t.date)
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    /**
     * Faz download de CSV
     */
    downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}

// Instância global
const transactionsPage = new TransactionsPage();
