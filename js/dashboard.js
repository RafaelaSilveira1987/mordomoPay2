document.addEventListener('DOMContentLoaded', () => {
    updateDashboardStats();
    renderMiniGoals();
    renderAchievements();
});

function updateDashboardStats() {
    // Em um cenário real, buscaria do Supabase
    const income = 5200;
    const expense = 3850;
    const balance = income - expense;
    const health = 72;

    document.getElementById('hero-income').textContent = `R$ ${income.toLocaleString('pt-BR')}`;
    document.getElementById('hero-expense').textContent = `R$ ${expense.toLocaleString('pt-BR')}`;
    document.getElementById('hero-balance').textContent = `R$ ${balance.toLocaleString('pt-BR')}`;
    
    document.getElementById('health-percentage').textContent = `${health}%`;
    document.getElementById('health-bar').style.width = `${health}%`;
    
    document.getElementById('month-savings').textContent = `R$ ${balance.toLocaleString('pt-BR')}`;
    
    document.getElementById('active-goals-count').textContent = '3';
    document.getElementById('goals-summary').textContent = '1 meta já alcançada!';
}

function renderMiniGoals() {
    const container = document.getElementById('goals-list-mini');
    const miniGoals = [
        { name: 'Reserva de Emergência', progress: 35 },
        { name: 'Viagem de Férias', progress: 100 },
        { name: 'Novo Notebook', progress: 26 }
    ];

    container.innerHTML = miniGoals.map(goal => `
        <div class="mb-4">
            <div class="flex-between mb-1">
                <span style="font-size: 0.875rem; font-weight: 500;">${goal.name}</span>
                <span style="font-size: 0.75rem; color: var(--muted-foreground);">${goal.progress}%</span>
            </div>
            <div class="progress-container" style="height: 6px; margin: 0;">
                <div class="progress-bar" style="width: ${goal.progress}%; background-color: ${goal.progress === 100 ? '#10b981' : 'var(--primary)'}"></div>
            </div>
        </div>
    `).join('');
}

function renderAchievements() {
    const container = document.getElementById('achievements-list');
    const achievements = [
        { icon: '🌱', title: 'Primeiro Passo', desc: 'Registrou sua primeira transação' },
        { icon: '🎯', title: 'Foco Total', desc: 'Completou sua primeira meta' },
        { icon: '🙏', title: 'Fiel no Pouco', desc: 'Dizimista por 3 meses seguidos' }
    ];

    container.innerHTML = achievements.map(a => `
        <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
            <div style="font-size: 1.5rem; background: var(--muted); width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">${a.icon}</div>
            <div>
                <p style="font-weight: 600; font-size: 0.875rem;">${a.title}</p>
                <p style="font-size: 0.75rem; color: var(--muted-foreground);">${a.desc}</p>
            </div>
        </div>
    `).join('');
}
