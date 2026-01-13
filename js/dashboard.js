document.addEventListener('DOMContentLoaded', async () => {
    await updateDashboardStats();
    await renderMiniGoals();
    await checkAndAwardBadges();
    await renderAchievements();
});

const MORDOMIA_LEVELS = [
    "Aprendiz de Mordomo",
    "Buscador de Sabedoria",
    "Praticante da Diligência",
    "Gestor Prudente",
    "Sentinela das Finanças",
    "Administrador Fiel",
    "Semeador Generoso",
    "Mestre da Provisão",
    "Exemplo de Mordomia",
    "Mordomo Fiel e Prudente"
];

async function updateDashboardStats() {
    const user = await Auth.getUser();
    if (!user) return;

    const { data: transactions, error: tError } = await supabaseClient
        .from('transacoes')
        .select('valor, tipo')
        .eq('usuario_id', user.id);

    if (tError) {
        console.error('Erro ao buscar estatísticas:', tError);
        return;
    }

    let income = 0;
    let expense = 0;

    (transactions || []).forEach(t => {
        const valor = parseFloat(t.valor);
        if (t.tipo === 'entrada') income += valor;
        else expense += valor;
    });

    const balance = income - expense;
    const health = income > 0 ? Math.min(Math.round((balance / income) * 100), 100) : 0;

    document.getElementById('hero-income').textContent = `R$ ${income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById('hero-expense').textContent = `R$ ${expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById('hero-balance').textContent = `R$ ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    
    document.getElementById('health-percentage').textContent = `${health}%`;
    document.getElementById('health-bar').style.width = `${health}%`;
    
    document.getElementById('month-savings').textContent = `R$ ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    
    const { data: goals } = await supabaseClient
        .from('metas_financeiras')
        .select('id, valor_atual, valor_alvo')
        .eq('usuario_id', user.id);

    const activeGoals = (goals || []).length;
    const completedGoals = (goals || []).filter(g => parseFloat(g.valor_atual) >= parseFloat(g.valor_alvo)).length;

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
        .from('metas_financeiras')
        .select('titulo, valor_atual, valor_alvo')
        .eq('usuario_id', user.id)
        .limit(3);

    if (!goals || goals.length === 0) {
        container.innerHTML = '<p class="text-muted-foreground">Nenhuma meta definida.</p>';
        return;
    }

    container.innerHTML = goals.map(goal => {
        const progress = Math.min(Math.round((parseFloat(goal.valor_atual) / parseFloat(goal.valor_alvo)) * 100), 100);
        return `
            <div class="mb-4">
                <div class="flex-between mb-1">
                    <span style="font-size: 0.875rem; font-weight: 500;">${goal.titulo}</span>
                    <span style="font-size: 0.75rem; color: var(--muted-foreground);">${progress}%</span>
                </div>
                <div class="progress-container" style="height: 6px; margin: 0;">
                    <div class="progress-bar" style="width: ${progress}%; background-color: ${progress === 100 ? '#10b981' : 'var(--primary)'}"></div>
                </div>
            </div>
        `;
    }).join('');
}

async function checkAndAwardBadges() {
    const user = await Auth.getUser();
    if (!user) return;

    // Buscar dados necessários
    const { data: transactions } = await supabaseClient.from('transacoes').select('tipo').eq('usuario_id', user.id);
    const { data: tithes } = await supabaseClient.from('dizimos_ofertas').select('id').eq('usuario_id', user.id);
    const { data: goals } = await supabaseClient.from('metas_financeiras').select('valor_atual, valor_alvo').eq('usuario_id', user.id);
    const { data: existingBadges } = await supabaseClient.from('badges').select('id, nome').eq('usuario_id', user.id);

    const badgeNames = (existingBadges || []).map(b => b.nome);
    const badgesToRemove = [];
    const newBadges = [];

    // Lógica de Conquistas (Adição)
    if (transactions?.length > 0 && !badgeNames.includes('Primeiro Passo')) {
        newBadges.push({ nome: 'Primeiro Passo', descricao: 'Registrou sua primeira movimentação.', icone: '🌱', usuario_id: user.id });
    }
    if (tithes?.length > 0 && !badgeNames.includes('Primícias')) {
        newBadges.push({ nome: 'Primícias', descricao: 'Honrou a Deus com sua primeira contribuição.', icone: '🙏', usuario_id: user.id });
    }
    if (goals?.some(g => parseFloat(g.valor_atual) >= parseFloat(g.valor_alvo)) && !badgeNames.includes('Diligente')) {
        newBadges.push({ nome: 'Diligente', descricao: 'Alcançou sua primeira meta financeira.', icone: '🎯', usuario_id: user.id });
    }
    if (transactions?.filter(t => t.tipo === 'entrada').length >= 5 && !badgeNames.includes('Semeador')) {
        newBadges.push({ nome: 'Semeador', descricao: 'Registrou 5 fontes de entrada diferentes.', icone: '🌾', usuario_id: user.id });
    }

    // Lógica de Rebaixamento (Remoção)
    if (transactions?.length === 0 && badgeNames.includes('Primeiro Passo')) {
        const b = existingBadges.find(x => x.nome === 'Primeiro Passo');
        if (b) badgesToRemove.push(b.id);
    }
    if (tithes?.length === 0 && badgeNames.includes('Primícias')) {
        const b = existingBadges.find(x => x.nome === 'Primícias');
        if (b) badgesToRemove.push(b.id);
    }
    if (!goals?.some(g => parseFloat(g.valor_atual) >= parseFloat(g.valor_alvo)) && badgeNames.includes('Diligente')) {
        const b = existingBadges.find(x => x.nome === 'Diligente');
        if (b) badgesToRemove.push(b.id);
    }
    if (transactions?.filter(t => t.tipo === 'entrada').length < 5 && badgeNames.includes('Semeador')) {
        const b = existingBadges.find(x => x.nome === 'Semeador');
        if (b) badgesToRemove.push(b.id);
    }

    // Executar alterações no banco
    if (newBadges.length > 0) await supabaseClient.from('badges').insert(newBadges);
    if (badgesToRemove.length > 0) await supabaseClient.from('badges').delete().in('id', badgesToRemove);

    // Recalcular Nível
    const finalBadgeCount = (existingBadges?.length || 0) + newBadges.length - badgesToRemove.length;
    const levelIndex = Math.min(Math.floor(finalBadgeCount / 2), MORDOMIA_LEVELS.length - 1);
    const currentLevel = MORDOMIA_LEVELS[levelIndex];

    // Barra de Progresso de Nível
    const badgesForNextLevel = 2;
    const progressInLevel = (finalBadgeCount % badgesForNextLevel) / badgesForNextLevel * 100;

    const levelDisplay = document.getElementById('user-status-display');
    const progressBar = document.getElementById('level-progress-bar');
    
    if (levelDisplay) levelDisplay.textContent = currentLevel;
    if (progressBar) progressBar.style.width = `${progressInLevel}%`;
}

async function renderAchievements() {
    const user = await Auth.getUser();
    if (!user) return;

    const container = document.getElementById('achievements-list');
    const { data: badges, error } = await supabaseClient
        .from('badges')
        .select('*')
        .eq('usuario_id', user.id)
        .order('data_conquista', { ascending: false });

    if (error || !badges || badges.length === 0) {
        container.innerHTML = '<p class="text-muted-foreground" style="font-size: 0.875rem;">Nenhuma conquista ainda. Continue sua jornada!</p>';
        return;
    }

    container.innerHTML = badges.map(b => `
        <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
            <div style="font-size: 1.5rem; background: var(--muted); width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">${b.icone || '🏆'}</div>
            <div>
                <p style="font-weight: 600; font-size: 0.875rem;">${b.nome}</p>
                <p style="font-size: 0.75rem; color: var(--muted-foreground);">${b.descricao}</p>
            </div>
        </div>
    `).join('');
}
