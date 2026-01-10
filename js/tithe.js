let tithes = [];

document.addEventListener('DOMContentLoaded', async () => {
    await fetchTithes();
    setupEventListeners();
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
    historyList.innerHTML = '';

    let totalT = 0;
    let totalO = 0;

    tithes.forEach(t => {
        const valor = parseFloat(t.valor);
        if (t.tipo === 'dizimo') totalT += valor;
        else totalO += valor;

        const card = document.createElement('div');
        card.className = 'card';
        card.style.padding = '1rem';
        
        card.innerHTML = `
            <div class="flex-between">
                <div>
                    <p style="font-weight: 600;">${t.tipo === 'dizimo' ? 'Dízimo' : 'Oferta'}</p>
                    <p style="font-size: 0.75rem; color: var(--muted-foreground);">${new Date(t.data).toLocaleDateString('pt-BR')}</p>
                </div>
                <div style="text-align: right;">
                    <p style="font-weight: bold; color: var(--primary);">R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <span style="font-size: 0.75rem; font-weight: 600; color: var(--primary)">
                        Status: ${t.status}
                    </span>
                </div>
            </div>
            <div style="margin-top: 0.5rem; display: flex; justify-content: flex-end; gap: 0.5rem;">
                <button class="btn btn-ghost" style="padding: 0.25rem;" onclick="editTithe(${t.id})">✏️</button>
                <button class="btn btn-ghost" style="padding: 0.25rem;" onclick="deleteTithe(${t.id})">🗑️</button>
            </div>
        `;
        historyList.appendChild(card);
    });

    document.getElementById('total-tithes').textContent = `R$ ${totalT.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById('total-offerings').textContent = `R$ ${totalO.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById('total-given').textContent = `R$ ${(totalT + totalO).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

function setupEventListeners() {
    document.getElementById('btn-new-tithe').addEventListener('click', () => openModal());
    document.getElementById('btn-cancel-tithe').addEventListener('click', closeModal);
    document.getElementById('form-tithe').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveTithe();
    });
}

function openModal(tithe = null) {
    const modal = document.getElementById('modal-tithe');
    if (tithe) {
        document.getElementById('tithe-modal-title').textContent = 'Editar Registro';
        document.getElementById('tithe-id').value = tithe.id;
        document.getElementById('tithe-amount').value = tithe.valor;
        document.getElementById('tithe-type').value = tithe.tipo;
        document.getElementById('tithe-date').value = tithe.data;
        document.getElementById('tithe-status').value = tithe.status;
    } else {
        document.getElementById('tithe-modal-title').textContent = 'Registrar Dízimo/Oferta';
        document.getElementById('form-tithe').reset();
        document.getElementById('tithe-id').value = '';
        document.getElementById('tithe-date').value = new Date().toISOString().split('T')[0];
    }
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-tithe').style.display = 'none';
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

    if (result.error) alert('Erro: ' + result.error.message);
    else {
        await fetchTithes();
        closeModal();
    }
}

function editTithe(id) {
    const t = tithes.find(t => t.id === id);
    if (t) openModal(t);
}

async function deleteTithe(id) {
    if (confirm('Excluir registro?')) {
        const { error } = await supabaseClient.from('dizimos_ofertas').delete().eq('id', id);
        if (error) alert('Erro: ' + error.message);
        else await fetchTithes();
    }
}
