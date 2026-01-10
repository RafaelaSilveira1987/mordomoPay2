let goals = [];

document.addEventListener('DOMContentLoaded', async () => {
    await fetchGoals();
    setupEventListeners();
});

async function fetchGoals() {
    const user = await Auth.getUser();
    if (!user) return;

    const { data, error } = await supabaseClient
        .from('metas_financeiras')
        .select('*')
        .eq('usuario_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao buscar metas:', error);
        return;
    }

    goals = data || [];
    renderGoals();
}

function renderGoals() {
    const goalsList = document.getElementById('goals-list');
    goalsList.innerHTML = '';

    let completed = 0;
    let totalProgress = 0;

    goals.forEach(goal => {
        const target = parseFloat(goal.valor_alvo);
        const current = parseFloat(goal.valor_atual);
        const percentage = Math.min((current / target) * 100, 100);
        if (percentage >= 100) completed++;
        totalProgress += percentage;

        const card = document.createElement('div');
        card.className = `card goal-card`;
        card.innerHTML = `
            <div class="goal-header">
                <div class="goal-info">
                    <div class="goal-icon-large">🎯</div>
                    <div>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <h3 class="serif">${goal.titulo}</h3>
                            ${percentage >= 100 ? '<span class="text-green">✅</span>' : ''}
                        </div>
                        <p class="text-muted-foreground" style="font-size: 0.875rem;">${goal.versiculo || ''}</p>
                        <div style="display: flex; gap: 1rem; font-size: 0.75rem; color: var(--muted-foreground); margin-top: 0.5rem;">
                            <span>Categoria: ${goal.categoria || 'Geral'}</span>
                            <span>Status: ${goal.status}</span>
                            <span>Prazo: ${goal.prazo ? new Date(goal.prazo).toLocaleDateString('pt-BR') : '-'}</span>
                        </div>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button class="btn btn-ghost" onclick="editGoal(${goal.id})">✏️</button>
                    <button class="btn btn-ghost" onclick="deleteGoal(${goal.id})">🗑️</button>
                </div>
            </div>
            <div class="progress-section">
                <div class="flex-between" style="font-size: 0.875rem; margin-bottom: 0.5rem;">
                    <span style="font-weight: 600;">Progresso: ${percentage.toFixed(0)}%</span>
                    <span class="text-muted-foreground">R$ ${current.toLocaleString('pt-BR')} de R$ ${target.toLocaleString('pt-BR')}</span>
                </div>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
        goalsList.appendChild(card);
    });

    document.getElementById('active-goals').textContent = goals.length;
    document.getElementById('completed-goals').textContent = completed;
    document.getElementById('overall-progress').textContent = goals.length > 0 ? `${(totalProgress / goals.length).toFixed(0)}%` : '0%';
}

function setupEventListeners() {
    document.getElementById('btn-new-goal').addEventListener('click', () => openModal());
    document.getElementById('btn-cancel-goal').addEventListener('click', closeModal);
    document.getElementById('form-goal').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveGoal();
    });
}

function openModal(goal = null) {
    const modal = document.getElementById('modal-goal');
    if (goal) {
        document.getElementById('goal-modal-title').textContent = 'Editar Meta';
        document.getElementById('goal-id').value = goal.id;
        document.getElementById('goal-name').value = goal.titulo;
        document.getElementById('goal-target').value = goal.valor_alvo;
        document.getElementById('goal-current').value = goal.valor_atual;
        document.getElementById('goal-deadline').value = goal.prazo;
        document.getElementById('goal-category').value = goal.categoria;
        document.getElementById('goal-description').value = goal.versiculo;
    } else {
        document.getElementById('goal-modal-title').textContent = 'Nova Meta';
        document.getElementById('form-goal').reset();
        document.getElementById('goal-id').value = '';
    }
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-goal').style.display = 'none';
}

async function saveGoal() {
    const user = await Auth.getUser();
    if (!user) return;

    const id = document.getElementById('goal-id').value;
    const payload = {
        titulo: document.getElementById('goal-name').value,
        valor_alvo: parseFloat(document.getElementById('goal-target').value),
        valor_atual: parseFloat(document.getElementById('goal-current').value),
        prazo: document.getElementById('goal-deadline').value,
        categoria: document.getElementById('goal-category').value,
        versiculo: document.getElementById('goal-description').value,
        usuario_id: user.id
    };

    let result;
    if (id) {
        result = await supabaseClient.from('metas_financeiras').update(payload).eq('id', id);
    } else {
        result = await supabaseClient.from('metas_financeiras').insert([payload]);
    }

    if (result.error) alert('Erro: ' + result.error.message);
    else {
        await fetchGoals();
        closeModal();
    }
}

function editGoal(id) {
    const g = goals.find(g => g.id === id);
    if (g) openModal(g);
}

async function deleteGoal(id) {
    if (confirm('Excluir meta?')) {
        const { error } = await supabaseClient.from('metas_financeiras').delete().eq('id', id);
        if (error) alert('Erro: ' + error.message);
        else await fetchGoals();
    }
}
