let transactions = [];
let categories = [];

document.addEventListener('DOMContentLoaded', async () => {
    const user = await Auth.getUser();
    if (!user) return;

    await fetchCategories();
    await fetchTransactions();
    setupEventListeners();
});

async function fetchCategories() {
    const user = await Auth.getUser();
    if (!user) return;

    const { data, error } = await supabaseClient
        .from('categoria_trasacoes')
        .select('*');

    if (!error && data) {
        categories = data;
        renderCategoryOptions();
    }
}

function renderCategoryOptions() {
    const filterSelect = document.getElementById('filter-category');
    const formSelect = document.getElementById('transaction-category');
    
    if (filterSelect) {
        filterSelect.innerHTML = '<option value="all">Todas as Categorias</option>';
        categories.forEach(cat => {
            const opt = new Option(cat.descricao, cat.id);
            filterSelect.add(opt);
        });
    }

    if (formSelect) {
        formSelect.innerHTML = '<option value="">Selecione uma categoria</option>';
        categories.forEach(cat => {
            const opt = new Option(cat.descricao, cat.id);
            formSelect.add(opt);
        });
    }
}

async function fetchTransactions() {
    const user = await Auth.getUser();
    if (!user) return;

    const { data, error } = await supabaseClient
        .from('transacoes')
        .select('*, categoria_trasacoes(descricao)')
        .eq('usuario_id', user.id)
        .order('data', { ascending: false });

    if (error) {
        console.error('Erro ao buscar transações:', error);
        return;
    }

    transactions = data || [];
    renderTransactions();
}

function renderTransactions() {
    const tableBody = document.getElementById('transactions-table-body');
    if (!tableBody) return;

    const filterType = document.getElementById('filter-type').value;
    const filterCat = document.getElementById('filter-category').value;
    
    const filtered = transactions.filter(t => {
        const typeMatch = filterType === 'all' || t.tipo === filterType;
        const catMatch = filterCat === 'all' || (t.categoria_id && t.categoria_id.toString() === filterCat);
        return typeMatch && catMatch;
    });

    tableBody.innerHTML = '';
    
    let totalIn = 0;
    let totalOut = 0;

    filtered.forEach(t => {
        const valor = parseFloat(t.valor);
        if (t.tipo === 'entrada') totalIn += valor;
        else totalOut += valor;

        const catDesc = t.categoria_trasacoes ? t.categoria_trasacoes.descricao : 'Sem Categoria';
        const descricaoExibicao = t.descricao || t.recebedor || t.pagador || '-';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(t.data).toLocaleDateString('pt-BR')}</td>
            <td>${descricaoExibicao}</td>
            <td><span class="badge badge-secondary">${catDesc}</span></td>
            <td style="text-align: right; font-weight: bold;" class="${t.tipo === 'entrada' ? 'text-green' : 'text-red'}">
                ${t.tipo === 'entrada' ? '+' : '-'} R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </td>
            <td style="text-align: center;"><span class="badge badge-success">${t.tipo === 'entrada' ? 'Recebido' : 'Pago'}</span></td>
            <td style="text-align: center;">
                <div style="display: flex; gap: 0.5rem; justify-content: center;">
                    <button class="btn btn-ghost" onclick="editTransaction('${t.id}')" title="Editar">✏️</button>
                    <button class="btn btn-ghost" onclick="deleteTransaction('${t.id}')" title="Excluir">🗑️</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });

    if (document.getElementById('total-income')) document.getElementById('total-income').textContent = `R$ ${totalIn.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    if (document.getElementById('total-expense')) document.getElementById('total-expense').textContent = `R$ ${totalOut.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    if (document.getElementById('total-balance')) document.getElementById('total-balance').textContent = `R$ ${(totalIn - totalOut).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    
    const noTransactionsEl = document.getElementById('no-transactions');
    if (noTransactionsEl) noTransactionsEl.style.display = filtered.length === 0 ? 'block' : 'none';
}

function setupEventListeners() {
    const filterType = document.getElementById('filter-type');
    const filterCat = document.getElementById('filter-category');
    const btnNew = document.getElementById('btn-new-transaction');
    const btnCancel = document.getElementById('btn-cancel-transaction');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const form = document.getElementById('form-transaction');

    if (filterType) filterType.addEventListener('change', renderTransactions);
    if (filterCat) filterCat.addEventListener('change', renderTransactions);
    if (btnNew) btnNew.addEventListener('click', () => openModal());
    if (btnCancel) btnCancel.addEventListener('click', closeModal);
    if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveTransaction();
        });
    }
}

function openModal(transaction = null) {
    const modal = document.getElementById('modal-transaction');
    const title = document.getElementById('modal-title');
    if (!modal) return;
    
    if (transaction) {
        title.textContent = 'Editar Transação';
        document.getElementById('transaction-id').value = transaction.id;
        document.getElementById('transaction-amount').value = transaction.valor;
        document.getElementById('transaction-type').value = transaction.tipo;
        document.getElementById('transaction-category').value = transaction.categoria_id || '';
        document.getElementById('transaction-date').value = transaction.data.split('T')[0];
        document.getElementById('transaction-payee').value = transaction.descricao || transaction.recebedor || transaction.pagador || '';
    } else {
        title.textContent = 'Nova Transação';
        document.getElementById('form-transaction').reset();
        document.getElementById('transaction-id').value = '';
        document.getElementById('transaction-date').value = new Date().toISOString().split('T')[0];
    }
    
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('modal-transaction');
    if (modal) modal.style.display = 'none';
}

async function saveTransaction() {
    const user = await Auth.getUser();
    if (!user) {
        alert('Sessão expirada. Por favor, faça login novamente.');
        window.location.href = 'login.html';
        return;
    }

    const id = document.getElementById('transaction-id').value;
    const tipo = document.getElementById('transaction-type').value;
    const data_str = document.getElementById('transaction-date').value;
    const mes = new Date(data_str).toLocaleString('pt-BR', { month: 'long' });
    const payee = document.getElementById('transaction-payee').value;

    const payload = {
        valor: parseFloat(document.getElementById('transaction-amount').value),
        tipo: tipo,
        categoria_id: document.getElementById('transaction-category').value ? parseInt(document.getElementById('transaction-category').value) : null,
        data: data_str,
        mes: mes,
        usuario_id: user.id,
        descricao: payee, // Preenchendo a coluna obrigatória 'descricao'
        recebedor: payee  // Mantendo recebedor para compatibilidade
    };

    let result;
    if (id) {
        result = await supabaseClient.from('transacoes').update(payload).eq('id', id);
    } else {
        result = await supabaseClient.from('transacoes').insert([payload]);
    }

    if (result.error) {
        console.error('Erro Supabase:', result.error);
        alert('Erro ao salvar: ' + result.error.message);
    } else {
        await fetchTransactions();
        closeModal();
        if (window.updateUserLevelDisplay) window.updateUserLevelDisplay();
    }
}

window.editTransaction = function(id) {
    // Garantindo que o ID seja tratado como string para comparação
    const t = transactions.find(t => String(t.id) === String(id));
    if (t) {
        openModal(t);
    } else {
        console.error('Transação não encontrada para o ID:', id);
    }
}

window.deleteTransaction = async function(id) {
    if (confirm('Excluir esta transação?')) {
        const { error } = await supabaseClient.from('transacoes').delete().eq('id', id);
        if (error) {
            console.error('Erro ao excluir:', error);
            alert('Erro: ' + error.message);
        } else {
            await fetchTransactions();
            if (window.updateUserLevelDisplay) window.updateUserLevelDisplay();
        }
    }
}
