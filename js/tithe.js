let tithes = [];

document.addEventListener('DOMContentLoaded', async () => {
    const user = await Auth.getUser();
    if (!user) return;

    await fetchTithes();
    setupEventListeners();
    setupCalculator();
});

async function fetchTithes() {
    const user = await Auth.getUser();
    if (!user) return;

    const { data, error } = await supabaseClient
        .from('dizimos_ofertas')
        .select('*')
        .eq('usuario_id', user.id)
        .order('data', { ascending: false });

    if (error) {
        console.error('Erro ao buscar dízimos:', error);
        return;
    }

    tithes = data || [];
    renderTithes();
}

function renderTithes() {
    const historyList = document.getElementById('tithe-history');
    if (!historyList) return;
    historyList.innerHTML = '';

    let totalT = 0;
    let totalO = 0;

    if (tithes.length === 0) {
        historyList.innerHTML = '<div class="card" style="text-align: center; padding: 2rem; color: var(--muted-foreground);">Nenhum registro encontrado.</div>';
    }

    tithes.forEach(t => {
        const valor = parseFloat(t.valor) || 0;
        if (t.tipo === 'dizimo') totalT += valor;
        else totalO += valor;

        const card = document.createElement('div');
        card.className = 'card';
        card.style.padding = '1rem';
        card.style.marginBottom = '1rem';
        
        card.innerHTML = `
            <div class="flex-between">
                <div>
                    <p style="font-weight: 600;">${t.tipo === 'dizimo' ? 'Dízimo' : 'Oferta'}</p>
                    <p style="font-size: 0.75rem; color: var(--muted-foreground);">${new Date(t.data).toLocaleDateString('pt-BR')}</p>
                </div>
                <div style="text-align: right;">
                    <p style="font-weight: bold; color: var(--primary);">R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <span style="font-size: 0.75rem; font-weight: 600; color: var(--primary)">
                        Status: ${t.status || 'Concluído'}
                    </span>
                </div>
            </div>
            <div style="margin-top: 0.5rem; display: flex; justify-content: flex-end; gap: 0.5rem;">
                <button class="btn btn-ghost" style="padding: 0.25rem;" onclick="editTithe('${t.id}')" title="Editar">✏️</button>
                <button class="btn btn-ghost" style="padding: 0.25rem;" onclick="deleteTithe('${t.id}')" title="Excluir">🗑️</button>
            </div>
        `;
        historyList.appendChild(card);
    });

    const tT = document.getElementById('total-tithes');
    const tO = document.getElementById('total-offerings');
    const tG = document.getElementById('total-given');
    
    if (tT) tT.textContent = `R$ ${totalT.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    if (tO) tO.textContent = `R$ ${totalO.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    if (tG) tG.textContent = `R$ ${(totalT + totalO).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

function setupEventListeners() {
    const btnNew = document.getElementById('btn-new-tithe');
    const btnCancel = document.getElementById('btn-cancel-tithe');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const form = document.getElementById('form-tithe');

    if (btnNew) btnNew.addEventListener('click', () => openModal());
    if (btnCancel) btnCancel.addEventListener('click', closeModal);
    if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
    if (form) form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveTithe();
    });
}

function setupCalculator() {
    const incomeInput = document.getElementById('calc-income');
    const percentInput = document.getElementById('calc-percent');
    const resultDisplay = document.getElementById('calc-result');

    if (incomeInput && percentInput && resultDisplay) {
        const calculate = () => {
            const income = parseFloat(incomeInput.value) || 0;
            const percent = parseFloat(percentInput.value) || 0;
            const result = (income * percent) / 100;
            resultDisplay.textContent = `R$ ${result.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        };

        incomeInput.addEventListener('input', calculate);
        percentInput.addEventListener('input', calculate);
    }
}

function openModal(tithe = null) {
    const modal = document.getElementById('modal-tithe');
    if (!modal) return;
    
    if (tithe) {
        document.getElementById('tithe-modal-title').textContent = 'Editar Registro';
        document.getElementById('tithe-id').value = tithe.id;
        document.getElementById('tithe-amount').value = tithe.valor;
        document.getElementById('tithe-type').value = tithe.tipo;
        document.getElementById('tithe-date').value = tithe.data ? tithe.data.split('T')[0] : '';
        document.getElementById('tithe-status').value = tithe.status || 'concluido';
    } else {
        document.getElementById('tithe-modal-title').textContent = 'Registrar Dízimo/Oferta';
        document.getElementById('form-tithe').reset();
        document.getElementById('tithe-id').value = '';
        document.getElementById('tithe-date').value = new Date().toISOString().split('T')[0];
    }
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('modal-tithe');
    if (modal) modal.style.display = 'none';
}

async function saveTithe() {
    const user = await Auth.getUser();
    if (!user) return;

    const id = document.getElementById('tithe-id').value;
    const payload = {
        valor: parseFloat(document.getElementById('tithe-amount').value),
        tipo: document.getElementById('tithe-type').value,
        data: document.getElementById('tithe-date').value,
        status: document.getElementById('tithe-status').value,
        usuario_id: user.id
    };

    let result;
    if (id) {
        result = await supabaseClient.from('dizimos_ofertas').update(payload).eq('id', id);
    } else {
        result = await supabaseClient.from('dizimos_ofertas').insert([payload]);
    }

    if (result.error) {
        console.error('Erro Supabase:', result.error);
        alert('Erro: ' + result.error.message);
    } else {
        await fetchTithes();
        closeModal();
        if (window.updateUserLevelDisplay) window.updateUserLevelDisplay();
    }
}

window.editTithe = function(id) {
    const t = tithes.find(t => String(t.id) === String(id));
    if (t) openModal(t);
}

window.deleteTithe = async function(id) {
    if (confirm('Excluir registro?')) {
        const { error } = await supabaseClient.from('dizimos_ofertas').delete().eq('id', id);
        if (error) {
            console.error('Erro ao excluir:', error);
            alert('Erro: ' + error.message);
        } else {
            await fetchTithes();
            if (window.updateUserLevelDisplay) window.updateUserLevelDisplay();
        }
    }
}
