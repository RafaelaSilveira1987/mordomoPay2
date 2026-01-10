let transactions = [];
let categories = [];

document.addEventListener('DOMContentLoaded', async () => {
    await fetchCategories();
    await fetchTransactions();
    setupEventListeners();
});

async function fetchCategories() {
    const user = await Auth.getUser();
    if (!user) return;

    const { data, error } = await supabaseClient
        .from('categoria_trasacoes')
        .select('*')
        .eq('usuario_id', user.id);

    if (!error && data) {
        categories = data;
        renderCategoryOptions();
    }
}

function renderCategoryOptions() {
    const filterSelect = document.getElementById('filter-category');
    const formSelect = document.getElementById('transaction-category');
    
    filterSelect.innerHTML = '<option value="all">Todas as Categorias</option>';
    formSelect.innerHTML = '';

    categories.forEach(cat => {
        const opt1 = new Option(cat.descricao, cat.id);
        const opt2 = new Option(cat.descricao, cat.id);
        filterSelect.add(opt1);
        formSelect.add(opt2);
    });
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
    const filterType = document.getElementById('filter-type').value;
    const filterCat = document.getElementById('filter-category').value;
    
    const filtered = transactions.filter(t => {
        const typeMatch = filterType === 'all' || t.tipo === filterType;
        const catMatch = filterCat === 'all' || t.categoria_id.toString() === filterCat;
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

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${t.descricao}</td>
            <td><span class="badge badge-secondary">${catDesc}</span></td>
            <td>${t.recebedor || t.pagador || '-'}</td>
            <td>${new Date(t.data).toLocaleDateString('pt-BR')}</td>
            <td style="text-align: right; font-weight: bold;" class="${t.tipo === 'entrada' ? 'text-green' : 'text-red'}">
                ${t.tipo === 'entrada' ? '+' : '-'} R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </td>
            <td style="text-align: center;">
                <button class="btn btn-ghost" onclick="editTransaction(${t.id})">✏️</button>
                <button class="btn btn-ghost" onclick="deleteTransaction(${t.id})">🗑️</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById('total-income').textContent = `R$ ${totalIn.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById('total-expense').textContent = `R$ ${totalOut.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById('total-balance').textContent = `R$ ${(totalIn - totalOut).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    
    document.getElementById('no-transactions').style.display = filtered.length === 0 ? 'block' : 'none';
}

function setupEventListeners() {
    document.getElementById('filter-type').addEventListener('change', renderTransactions);
    document.getElementById('filter-category').addEventListener('change', renderTransactions);
    document.getElementById('btn-new-transaction').addEventListener('click', () => openModal());
    document.getElementById('btn-cancel-transaction').addEventListener('click', closeModal);
    document.getElementById('form-transaction').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveTransaction();
    });
}

function openModal(transaction = null) {
    const modal = document.getElementById('modal-transaction');
    const title = document.getElementById('modal-title');
    
    if (transaction) {
        title.textContent = 'Editar Transação';
        document.getElementById('transaction-id').value = transaction.id;
        document.getElementById('transaction-description').value = transaction.descricao;
        document.getElementById('transaction-amount').value = transaction.valor;
        document.getElementById('transaction-type').value = transaction.tipo;
        document.getElementById('transaction-category').value = transaction.categoria_id;
        document.getElementById('transaction-date').value = transaction.data;
        document.getElementById('transaction-payee').value = transaction.recebedor || transaction.pagador || '';
    } else {
        title.textContent = 'Nova Transação';
        document.getElementById('form-transaction').reset();
        document.getElementById('transaction-id').value = '';
        document.getElementById('transaction-date').value = new Date().toISOString().split('T')[0];
    }
    
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-transaction').style.display = 'none';
}

async function saveTransaction() {
    const user = await Auth.getUser();
    if (!user) return;

    const id = document.getElementById('transaction-id').value;
    const tipo = document.getElementById('transaction-type').value;
    const data_str = document.getElementById('transaction-date').value;
    const mes = new Date(data_str).toLocaleString('pt-BR', { month: 'long' });

    const payload = {
        descricao: document.getElementById('transaction-description').value,
        valor: parseFloat(document.getElementById('transaction-amount').value),
        tipo: tipo,
        categoria_id: parseInt(document.getElementById('transaction-category').value),
        data: data_str,
        mes: mes,
        usuario_id: user.id,
        recebedor: tipo === 'saida' ? document.getElementById('transaction-payee').value : null,
        pagador: tipo === 'entrada' ? document.getElementById('transaction-payee').value : null
    };

    let result;
    if (id) {
        result = await supabaseClient.from('transacoes').update(payload).eq('id', id);
    } else {
        result = await supabaseClient.from('transacoes').insert([payload]);
    }

    if (result.error) {
        alert('Erro ao salvar: ' + result.error.message);
    } else {
        await fetchTransactions();
        closeModal();
    }
}

function editTransaction(id) {
    const t = transactions.find(t => t.id === id);
    if (t) openModal(t);
}

async function deleteTransaction(id) {
    if (confirm('Excluir esta transação?')) {
        const { error } = await supabaseClient.from('transacoes').delete().eq('id', id);
        if (error) alert('Erro: ' + error.message);
        else await fetchTransactions();
    }
}
