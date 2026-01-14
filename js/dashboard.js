document.addEventListener('DOMContentLoaded', async () => {
    await updateDashboardStats();
    await renderMiniGoals();
    await checkAndAwardBadges();
    await renderAchievements();
    await renderFavorites();
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

    if (tError) return;

    let income = 0, expense = 0;
    (transactions || []).forEach(t => {
        const valor = parseFloat(t.valor);
        if (t.tipo === 'entrada') income += valor;
        else expense += valor;
    });

    const balance = income - expense;
    const health = income > 0 ? Math.min(Math.round((balance / income) * 100), 100) : 0;

    const incEl = document.getElementById('hero-income');
    const expEl = document.getElementById('hero-expense');
    const balEl = document.getElementById('hero-balance');
    const healthPct = document.getElementById('health-percentage');
    const healthBar = document.getElementById('health-bar');
    const monthSav = document.getElementById('month-savings');

    if (incEl) incEl.textContent = `R$ ${income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    if (expEl) expEl.textContent = `R$ ${expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    if (balEl) balEl.textContent = `R$ ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    if (healthPct) healthPct.textContent = `${health}%`;
    if (healthBar) healthBar.style.width = `${health}%`;
    if (monthSav) monthSav.textContent = `R$ ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    
    const { data: goals } = await supabaseClient.from('metas_financeiras').select('id, valor_atual, valor_alvo').eq('usuario_id', user.id);
    const activeGoals = (goals || []).length;
    const completedGoals = (goals || []).filter(g => parseFloat(g.valor_atual) >= parseFloat(g.valor_alvo)).length;

    const activeGoalsCount = document.getElementById('active-goals-count');
    const goalsSummary = document.getElementById('goals-summary');
    if (activeGoalsCount) activeGoalsCount.textContent = activeGoals;
    if (goalsSummary) goalsSummary.textContent = completedGoals > 0 ? `${completedGoals} meta(s) alcançada(s)!` : 'Nenhuma meta alcançada ainda.';
}

async function renderMiniGoals() {
    const user = await Auth.getUser();
    if (!user) return;
    const container = document.getElementById('goals-list-mini');
    if (!container) return;
    const { data: goals } = await supabaseClient.from('metas_financeiras').select('titulo, valor_atual, valor_alvo').eq('usuario_id', user.id).limit(3);
    if (!goals || goals.length === 0) {
        container.innerHTML = '<p style="font-size: 0.875rem; color: #71717a;">Nenhuma meta definida.</p>';
        return;
    }
    container.innerHTML = goals.map(goal => {
        const progress = Math.min(Math.round((parseFloat(goal.valor_atual) / parseFloat(goal.valor_alvo)) * 100), 100);
        return `<div class="mb-4"><div class="flex-between mb-1"><span style="font-size: 0.875rem; font-weight: 500;">${goal.titulo}</span><span style="font-size: 0.75rem; color: #71717a;">${progress}%</span></div><div class="progress-container" style="height: 6px;"><div class="progress-bar" style="width: ${progress}%; background-color: ${progress === 100 ? '#10b981' : 'var(--primary)'}"></div></div></div>`;
    }).join('');
}

async function checkAndAwardBadges() {
    const user = await Auth.getUser();
    if (!user) return;

    const { data: transactions } = await supabaseClient.from('transacoes').select('tipo, valor').eq('usuario_id', user.id);
    const { data: tithes } = await supabaseClient.from('dizimos_ofertas').select('tipo').eq('usuario_id', user.id);
    const { data: goals } = await supabaseClient.from('metas_financeiras').select('valor_atual, valor_alvo').eq('usuario_id', user.id);
    const { data: existingBadges } = await supabaseClient.from('badges').select('id, nome').eq('usuario_id', user.id);

    const badgeNames = (existingBadges || []).map(b => b.nome);
    const newBadges = [], badgesToRemove = [];

    const stats = {
        transacoes: transactions?.length || 0,
        dizimos: tithes?.filter(t => t.tipo === 'dizimo').length || 0,
        ofertas: tithes?.filter(t => t.tipo === 'oferta').length || 0,
        metas: goals?.filter(g => parseFloat(g.valor_atual) >= parseFloat(g.valor_alvo)).length || 0,
        entradas: transactions?.filter(t => t.tipo === 'entrada').length || 0,
        economia: (transactions || []).reduce((acc, t) => t.tipo === 'entrada' ? acc + parseFloat(t.valor) : acc - parseFloat(t.valor), 0)
    };

    const rules = [
        { nome: 'Primeiro Passo', meta: 1, val: stats.transacoes, desc: 'Registre sua primeira movimentação.', icone: '🌱' },
        { nome: 'Primícias', meta: 1, val: stats.dizimos, desc: 'Honre a Deus com seu primeiro dízimo.', icone: '🙏' },
        { nome: 'Diligente', meta: 3, val: stats.metas, desc: 'Alcance 3 metas financeiras concluídas.', icone: '🎯' },
        { nome: 'Semeador', meta: 10, val: stats.entradas, desc: 'Registre 10 fontes de entrada diferentes.', icone: '🌾' },
        { nome: 'Coração Generoso', meta: 12, val: stats.ofertas, desc: 'Realize 12 ofertas voluntárias.', icone: '❤️' },
        { nome: 'Mestre Poupador', meta: 10000, val: stats.economia, desc: 'Economize um total de R$ 10.000,00.', icone: '💰' }
    ];

    rules.forEach(r => {
        if (r.val >= r.meta && !badgeNames.includes(r.nome)) {
            newBadges.push({ nome: r.nome, descricao: r.desc, icone: r.icone, usuario_id: user.id });
        } else if (r.val < r.meta && badgeNames.includes(r.nome)) {
            const b = existingBadges.find(x => x.nome === r.nome);
            if (b) badgesToRemove.push(b.id);
        }
    });

    if (newBadges.length > 0) await supabaseClient.from('badges').insert(newBadges);
    if (badgesToRemove.length > 0) await supabaseClient.from('badges').delete().in('id', badgesToRemove);

    const finalCount = (existingBadges?.length || 0) + newBadges.length - badgesToRemove.length;
    const levelIndex = Math.min(Math.floor(finalCount / 1.5), MORDOMIA_LEVELS.length - 1);
    const currentLevel = MORDOMIA_LEVELS[levelIndex];
    const progressInLevel = ((finalCount % 1.5) / 1.5) * 100;

    const levelDisplay = document.getElementById('user-status-display');
    const progressBar = document.getElementById('level-progress-bar');
    if (levelDisplay) levelDisplay.textContent = currentLevel;
    if (progressBar) progressBar.style.width = `${progressInLevel}%`;
}

async function renderAchievements() {
    const user = await Auth.getUser();
    if (!user) return;
    const container = document.getElementById('achievements-list');
    if (!container) return;
    const { data: badges } = await supabaseClient.from('badges').select('*').eq('usuario_id', user.id).order('data_conquista', { ascending: false }).limit(3);
    if (!badges || badges.length === 0) {
        container.innerHTML = '<p style="font-size: 0.875rem; color: #71717a;">Nenhuma conquista ainda.</p>';
        return;
    }
    container.innerHTML = badges.map(b => `<div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;"><div style="font-size: 1.5rem; background: #f1f1f5; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">${b.icone || '🏆'}</div><div><p style="font-weight: 600; font-size: 0.875rem;">${b.nome}</p><p style="font-size: 0.75rem; color: #71717a;">${b.descricao}</p></div></div>`).join('');
}

async function renderFavorites() {
    const container = document.getElementById('favorites-container');
    if (!container) return;

    const favVerses = JSON.parse(localStorage.getItem('fav_verses') || '[]');
    const favTips = JSON.parse(localStorage.getItem('fav_tips') || '[]');

    if (favVerses.length === 0 && favTips.length === 0) {
        container.innerHTML = '<p style="font-size: 0.875rem; color: #71717a;">Nenhum favorito salvo ainda.</p>';
        return;
    }

    let html = '';
    favVerses.forEach(v => {
        html += `<div class="card" style="padding: 1rem; border-left: 4px solid var(--accent); margin-bottom: 1rem;">
            <p style="font-style: italic; font-size: 0.875rem;">"${v.text}"</p>
            <p style="font-weight: 600; font-size: 0.75rem; margin-top: 0.5rem;">— ${v.ref}</p>
        </div>`;
    });
    favTips.forEach(t => {
        html += `<div class="card" style="padding: 1rem; border-left: 4px solid var(--primary); margin-bottom: 1rem;">
            <p style="font-weight: 600; font-size: 0.875rem;">${t.title}</p>
            <p style="font-size: 0.75rem; margin-top: 0.25rem;">${t.text}</p>
        </div>`;
    });
    container.innerHTML = html;
}
