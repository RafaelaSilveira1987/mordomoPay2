document.addEventListener('DOMContentLoaded', async () => {
    await updateDashboardStats();
    await renderMiniGoals();
    renderAchievements();
});

async function updateDashboardStats() {
    const user = await Auth.getUser();
    if (!user) return;

    // Buscar transações para calcular totais
    const { data: transactions, error: tError } = await supabaseClient
        .from('transactions')
        .select('amount, type')
        .eq('user_id', user.id);

    if (tError) {
        console.error('Erro ao buscar estatísticas:', tError);
        return;
    }

    let income = 0;
    let expense = 0;

    (transactions || []).forEach(t => {
        if (t.type === 'entrada') income += t.amount;
        else expense += t.amount;
    });

    const balance = income - expense;
    const health = income > 0 ? Math.min(Math.round((balance / income) * 100), 100) : 0;

    document.getElementById('hero-income').textContent = `R$ ${income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById('hero-expense').textContent = `R$ ${expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById('hero-balance').textContent = `R$ ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    
    document.getElementById('health-percentage').textContent = `${health}%`;
    document.getElementById('health-bar').style.width = `${health}%`;
    
    document.getElementById('month-savings').textContent = `R$ ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    
    // Buscar metas ativas
    const { data: goals } = await supabaseClient
        .from('goals')
        .select('id, current, target')
        .eq('user_id', user.id);

    const activeGoals = (goals || []).length;
    const completedGoals = (goals || []).filter(g => g.current >= g.target).length;

    document.getElementById('active-goals-count').textContent = activeGoals;
    document.getElementById('goals-summary').textContent = completedGoals > 0 
        ? `${completedGoals} meta(s) já alcançada(s)!` 
        : 'Nenhuma meta alcançada ainda.';
}

async function renderMiniGoals() {
    const user = await Auth.getUser();
    if (!user) return;

    const container = document.getElementById('goals-list-mini');
    const { data: goals } = await supabaseClient
        .from('goals')
        .select('name, current, target')
        .eq('user_id', user.id)
        .limit(3);

    if (!goals || goals.length === 0) {
        container.innerHTML = '<p class="text-muted-foreground">Nenhuma meta definida.</p>';
        return;
    }

    container.innerHTML = goals.map(goal => {
        const progress = Math.min(Math.round((goal.current / goal.target) * 100), 100);
        return `
            <div class="mb-4">
                <div class="flex-between mb-1">
                    <span style="font-size: 0.875rem; font-weight: 500;">${goal.name}</span>
                    <span style="font-size: 0.75rem; color: var(--muted-foreground);">${progress}%</span>
                </div>
                <div class="progress-container" style="height: 6px; margin: 0;">
                    <div class="progress-bar" style="width: ${progress}%; background-color: ${progress === 100 ? '#10b981' : 'var(--primary)'}"></div>
                </div>
            </div>
        `;
    }).join('');
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
