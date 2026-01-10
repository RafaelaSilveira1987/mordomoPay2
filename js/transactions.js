let transactions = [];
const categories = ['Alimentação', 'Moradia', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Espiritual', 'Renda', 'Renda Extra'];

document.addEventListener('DOMContentLoaded', async () => {
    renderCategories();
    await fetchTransactions();
    setupEventListeners();
});

async function fetchTransactions() {
    const user = await Auth.getUser();
    if (!user) return;

    const { data, error } = await supabaseClient
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

    if (error) {
        console.error('Erro ao buscar transações:', error);
        return;
    }

    transactions = data || [];
    renderTransactions();
}

function renderCategories() {
    const filterSelect = document.getElementById('filter-category');
    const formSelect = document.getElementById('transaction-category');
    
    categories.forEach(cat => {
        const opt1 = new Option(cat, cat);
        const opt2 = new Option(cat, cat);
        filterSelect.add(opt1);
        formSelect.add(opt2);
    });
}

function renderTransactions() {
    const tableBody = document.getElementById('transactions-table-body');
    const filterType = document.getElementById('filter-type').value;
    const filterCat = document.getElementById('filter-category').value;
    
    const filtered = transactions.filter(t => {
        const typeMatch = filterType === 'all' || t.type === filterType;
        const catMatch = filterCat === 'all' || t.category === filterCat;
        return typeMatch && catMatch;
    });

    tableBody.innerHTML = '';
    
    let totalIn = 0;
    let totalOut = 0;

    filtered.forEach(t => {
        if (t.type === 'entrada') totalIn += t.amount;
        else totalOut += t.amount;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${t.description}</td>
            <td><span class="badge badge-secondary">${t.category}</span></td>
            <td>${t.payee || '-'}</td>
            <td>${new Date(t.date).toLocaleDateString('pt-BR')}</td>
            <td style="text-align: right; font-weight: bold;" class="${t.type === 'entrada' ? 'text-green' : 'text-red'}">
                ${t.type === 'entrada' ? '+' : '-'} R$ ${t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </td>
            <td style="text-align: center;">
                <button class="btn btn-ghost" onclick="editTransaction('${t.id}')">✏️</button>
                <button class="btn btn-ghost" onclick="deleteTransaction('${t.id}')">🗑️</button>
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
    
    document.getElementById('btn-new-transaction').addEventListener('click', () => {
        openModal();
    });

    document.getElementById('btn-cancel-transaction').addEventListener('click', closeModal);

    document.getElementById('form-transaction').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveTransaction();
    });
}

function openModal(transaction = null) {
    const modal = document.getElementById('modal-transaction');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('form-transaction');
    
    if (transaction) {
        title.textContent = 'Editar Transação';
        document.getElementById('transaction-id').value = transaction.id;
        document.getElementById('transaction-description').value = transaction.description;
        document.getElementById('transaction-amount').value = transaction.amount;
        document.getElementById('transaction-type').value = transaction.type;
        document.getElementById('transaction-category').value = transaction.category;
        document.getElementById('transaction-date').value = transaction.date;
        document.getElementById('transaction-payee').value = transaction.payee;
    } else {
        title.textContent = 'Nova Transação';
        form.reset();
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
    const data = {
        description: document.getElementById('transaction-description').value,
        amount: parseFloat(document.getElementById('transaction-amount').value),
        type: document.getElementById('transaction-type').value,
        category: document.getElementById('transaction-category').value,
        date: document.getElementById('transaction-date').value,
        payee: document.getElementById('transaction-payee').value,
        user_id: user.id
    };

    let result;
    if (id) {
        result = await supabaseClient
            .from('transactions')
            .update(data)
            .eq('id', id);
    } else {
        result = await supabaseClient
            .from('transactions')
            .insert([data]);
    }

    if (result.error) {
        alert('Erro ao salvar transação: ' + result.error.message);
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
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
        const { error } = await supabaseClient
            .from('transactions')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Erro ao excluir: ' + error.message);
        } else {
            await fetchTransactions();
        }
    }
}
