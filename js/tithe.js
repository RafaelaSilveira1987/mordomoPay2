let tithes = [
    { id: '1', description: 'Dízimo Dezembro', amount: 520, type: 'dizimo', date: '2025-12-10', status: 'pago', paidAmount: 520 },
    { id: '2', description: 'Oferta de Natal', amount: 100, type: 'oferta', date: '2025-12-25', status: 'pago', paidAmount: 100 },
    { id: '3', description: 'Dízimo Janeiro', amount: 520, type: 'dizimo', date: '2026-01-05', status: 'parcial', paidAmount: 260 }
];

const verses = [
    { text: "Trazei todos os dízimos à casa do tesouro, para que haja mantimento na minha casa...", reference: "Malaquias 3:10" },
    { text: "Cada um contribua segundo propôs no seu coração; não com tristeza, ou por necessidade; porque Deus ama ao que dá com alegria.", reference: "2 Coríntios 9:7" },
    { text: "Honra ao Senhor com os teus bens, e com as primícias de toda a tua renda.", reference: "Provérbios 3:9" }
];

document.addEventListener('DOMContentLoaded', () => {
    renderTithes();
    renderVerses();
    setupEventListeners();
});

function renderTithes() {
    const historyList = document.getElementById('tithe-history');
    historyList.innerHTML = '';

    let totalT = 0;
    let totalO = 0;

    tithes.forEach(t => {
        if (t.type === 'dizimo') totalT += t.paidAmount;
        else totalO += t.paidAmount;

        const card = document.createElement('div');
        card.className = 'card';
        card.style.padding = '1rem';
        
        const isParcial = t.status === 'parcial';
        const remaining = t.amount - t.paidAmount;

        card.innerHTML = `
            <div class="flex-between">
                <div>
                    <p style="font-weight: 600;">${t.description}</p>
                    <p style="font-size: 0.75rem; color: var(--muted-foreground);">${new Date(t.date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div style="text-align: right;">
                    <p style="font-weight: bold; color: var(--primary);">R$ ${t.paidAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <span style="font-size: 0.75rem; font-weight: 600; color: ${t.type === 'dizimo' ? 'var(--primary)' : 'var(--secondary)'}">
                        ${t.type === 'dizimo' ? 'Dízimo' : 'Oferta'} ${isParcial ? '(Parcial)' : ''}
                    </span>
                </div>
            </div>
            ${isParcial ? `
                <div style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--muted-foreground);">
                    Faltam R$ ${remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} para completar R$ ${t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
            ` : ''}
            <div style="margin-top: 0.5rem; display: flex; justify-content: flex-end; gap: 0.5rem;">
                <button class="btn btn-ghost" style="padding: 0.25rem;" onclick="editTithe('${t.id}')">✏️</button>
                <button class="btn btn-ghost" style="padding: 0.25rem;" onclick="deleteTithe('${t.id}')">🗑️</button>
            </div>
        `;
        historyList.appendChild(card);
    });

    document.getElementById('total-tithes').textContent = `R$ ${totalT.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById('total-offerings').textContent = `R$ ${totalO.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById('total-given').textContent = `R$ ${(totalT + totalO).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

function renderVerses() {
    const list = document.getElementById('verses-list');
    list.innerHTML = '';
    verses.forEach(v => {
        const div = document.createElement('div');
        div.className = 'verse-card';
        div.innerHTML = `
            <p class="verse-text">"${v.text}"</p>
            <p class="verse-ref">${v.reference}</p>
        `;
        list.appendChild(div);
    });
}

function setupEventListeners() {
    const incomeInput = document.getElementById('monthly-income');
    const percentInput = document.getElementById('tithe-percentage');
    
    const calculate = () => {
        const income = parseFloat(incomeInput.value) || 0;
        const percent = parseFloat(percentInput.value) || 0;
        const result = (income * percent) / 100;
        document.getElementById('calculated-tithe').textContent = `R$ ${result.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    };

    incomeInput.addEventListener('input', calculate);
    percentInput.addEventListener('input', calculate);

    document.getElementById('btn-new-tithe').addEventListener('click', () => openModal());
    document.getElementById('btn-cancel-tithe').addEventListener('click', closeModal);
    
    document.getElementById('tithe-status').addEventListener('change', (e) => {
        document.getElementById('partial-amount-group').style.display = e.target.value === 'parcial' ? 'block' : 'none';
    });

    document.getElementById('form-tithe').addEventListener('submit', (e) => {
        e.preventDefault();
        saveTithe();
    });
}

function openModal(tithe = null) {
    const modal = document.getElementById('modal-tithe');
    const title = document.getElementById('tithe-modal-title');
    const form = document.getElementById('form-tithe');
    
    if (tithe) {
        title.textContent = 'Editar Registro';
        document.getElementById('tithe-id').value = tithe.id;
        document.getElementById('tithe-description').value = tithe.description;
        document.getElementById('tithe-amount').value = tithe.amount;
        document.getElementById('tithe-type').value = tithe.type;
        document.getElementById('tithe-date').value = tithe.date;
        document.getElementById('tithe-status').value = tithe.status;
        document.getElementById('tithe-paid-amount').value = tithe.paidAmount;
        document.getElementById('partial-amount-group').style.display = tithe.status === 'parcial' ? 'block' : 'none';
    } else {
        title.textContent = 'Registrar Dízimo/Oferta';
        form.reset();
        document.getElementById('tithe-id').value = '';
        document.getElementById('tithe-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('partial-amount-group').style.display = 'none';
    }
    
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-tithe').style.display = 'none';
}

function saveTithe() {
    const id = document.getElementById('tithe-id').value;
    const status = document.getElementById('tithe-status').value;
    const amount = parseFloat(document.getElementById('tithe-amount').value);
    let paidAmount = amount;
    
    if (status === 'parcial') {
        paidAmount = parseFloat(document.getElementById('tithe-paid-amount').value);
    } else if (status === 'pendente') {
        paidAmount = 0;
    }

    const data = {
        id: id || Date.now().toString(),
        description: document.getElementById('tithe-description').value,
        amount: amount,
        type: document.getElementById('tithe-type').value,
        date: document.getElementById('tithe-date').value,
        status: status,
        paidAmount: paidAmount
    };

    if (id) {
        const index = tithes.findIndex(t => t.id === id);
        tithes[index] = data;
    } else {
        tithes.push(data);
    }

    renderTithes();
    closeModal();
}

function editTithe(id) {
    const t = tithes.find(t => t.id === id);
    if (t) openModal(t);
}

function deleteTithe(id) {
    if (confirm('Deseja excluir este registro?')) {
        tithes = tithes.filter(t => t.id !== id);
        renderTithes();
    }
}
