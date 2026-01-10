let goals = [
    { id: '1', name: 'Reserva de Emergência', target: 10000, current: 3500, deadline: '2026-12-31', icon: '🛡️', category: 'Segurança', priority: 'high', description: 'Fundo para imprevistos' },
    { id: '2', name: 'Viagem de Férias', target: 5000, current: 5000, deadline: '2026-07-15', icon: '✈️', category: 'Lazer', priority: 'medium', description: 'Viagem para o Nordeste' },
    { id: '3', name: 'Novo Notebook', target: 4500, current: 1200, deadline: '2026-05-20', icon: '💻', category: 'Trabalho', priority: 'medium', description: 'Upgrade de equipamento' }
];

document.addEventListener('DOMContentLoaded', () => {
    renderGoals();
    setupEventListeners();
});

function renderGoals() {
    const goalsList = document.getElementById('goals-list');
    goalsList.innerHTML = '';

    let completed = 0;
    let totalProgress = 0;

    goals.forEach(goal => {
        const percentage = Math.min((goal.current / goal.target) * 100, 100);
        if (percentage >= 100) completed++;
        totalProgress += percentage;

        const card = document.createElement('div');
        card.className = `card goal-card priority-${goal.priority}`;
        card.innerHTML = `
            <div class="goal-header">
                <div class="goal-info">
                    <div class="goal-icon-large">${goal.icon}</div>
                    <div>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <h3 class="serif">${goal.name}</h3>
                            ${percentage >= 100 ? '<span class="text-green">✅</span>' : ''}
                        </div>
                        <p class="text-muted-foreground" style="font-size: 0.875rem;">${goal.description}</p>
                        <div style="display: flex; gap: 1rem; font-size: 0.75rem; color: var(--muted-foreground); margin-top: 0.5rem;">
                            <span>Categoria: ${goal.category}</span>
                            <span>Prioridade: ${getPriorityLabel(goal.priority)}</span>
                            <span>Prazo: ${formatDate(goal.deadline)}</span>
                        </div>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button class="btn btn-ghost" onclick="editGoal('${goal.id}')">✏️</button>
                    <button class="btn btn-ghost" onclick="deleteGoal('${goal.id}')">🗑️</button>
                </div>
            </div>
            <div class="progress-section">
                <div class="flex-between" style="font-size: 0.875rem; margin-bottom: 0.5rem;">
                    <span style="font-weight: 600;">Progresso: ${percentage.toFixed(0)}%</span>
                    <span class="text-muted-foreground">R$ ${goal.current.toLocaleString('pt-BR')} de R$ ${goal.target.toLocaleString('pt-BR')}</span>
                </div>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${percentage}%"></div>
                </div>
            </div>
            ${percentage >= 100 ? `
                <div style="background: #dcfce7; border: 1px solid #86efac; padding: 0.75rem; border-radius: 8px; color: #166534; font-size: 0.875rem; font-weight: 500;">
                    🎉 Parabéns! Você atingiu sua meta!
                </div>
            ` : ''}
        `;
        goalsList.appendChild(card);
    });

    document.getElementById('active-goals').textContent = goals.length;
    document.getElementById('completed-goals').textContent = completed;
    document.getElementById('overall-progress').textContent = goals.length > 0 ? `${(totalProgress / goals.length).toFixed(0)}%` : '0%';
}

function getPriorityLabel(p) {
    const labels = { high: 'Alta', medium: 'Média', low: 'Baixa' };
    return labels[p] || p;
}

function formatDate(d) {
    return new Date(d).toLocaleDateString('pt-BR');
}

function setupEventListeners() {
    document.getElementById('btn-new-goal').addEventListener('click', () => openModal());
    document.getElementById('btn-cancel-goal').addEventListener('click', closeModal);
    document.getElementById('form-goal').addEventListener('submit', (e) => {
        e.preventDefault();
        saveGoal();
    });
}

function openModal(goal = null) {
    const modal = document.getElementById('modal-goal');
    const title = document.getElementById('goal-modal-title');
    const form = document.getElementById('form-goal');
    
    if (goal) {
        title.textContent = 'Editar Meta';
        document.getElementById('goal-id').value = goal.id;
        document.getElementById('goal-name').value = goal.name;
        document.getElementById('goal-description').value = goal.description;
        document.getElementById('goal-target').value = goal.target;
        document.getElementById('goal-current').value = goal.current;
        document.getElementById('goal-deadline').value = goal.deadline;
        document.getElementById('goal-icon').value = goal.icon;
        document.getElementById('goal-category').value = goal.category;
        document.getElementById('goal-priority').value = goal.priority;
    } else {
        title.textContent = 'Nova Meta';
        form.reset();
        document.getElementById('goal-id').value = '';
        document.getElementById('goal-icon').value = '🎯';
    }
    
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-goal').style.display = 'none';
}

function saveGoal() {
    const id = document.getElementById('goal-id').value;
    const data = {
        id: id || Date.now().toString(),
        name: document.getElementById('goal-name').value,
        description: document.getElementById('goal-description').value,
        target: parseFloat(document.getElementById('goal-target').value),
        current: parseFloat(document.getElementById('goal-current').value),
        deadline: document.getElementById('goal-deadline').value,
        icon: document.getElementById('goal-icon').value || '🎯',
        category: document.getElementById('goal-category').value,
        priority: document.getElementById('goal-priority').value
    };

    if (id) {
        const index = goals.findIndex(g => g.id === id);
        goals[index] = data;
    } else {
        goals.push(data);
    }

    renderGoals();
    closeModal();
}

function editGoal(id) {
    const g = goals.find(g => g.id === id);
    if (g) openModal(g);
}

function deleteGoal(id) {
    if (confirm('Deseja excluir esta meta?')) {
        goals = goals.filter(g => g.id !== id);
        renderGoals();
    }
}
