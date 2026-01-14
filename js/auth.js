// Configuração do Supabase
const SUPABASE_URL = 'https://ktjpphfxulkymobkjvqo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0anBwaGZ4dWxreW1vYmtqdnFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NjE0NTcsImV4cCI6MjA3MzAzNzQ1N30.KxrzIALYjCApoD7Br4BMeNgmtcL89XCqEKbxfmbxPEk'; 

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const Auth = {
    async login(phone, password) {
        const { data, error } = await supabaseClient
            .from('usuarios')
            .select('*')
            .eq('celular', phone)
            .eq('senha', password)
            .single();

        if (error || !data) {
            throw new Error('Celular ou senha incorretos.');
        }

        localStorage.setItem('mordomopay_user', JSON.stringify(data));
        return data;
    },

    logout() {
        localStorage.removeItem('mordomopay_user');
        window.location.href = 'login.html';
    },

    async getUser() {
        const localUser = localStorage.getItem('mordomopay_user');
        if (localUser) return JSON.parse(localUser);
        return null;
    },

    checkAuth() {
        const user = localStorage.getItem('mordomopay_user');
        if (!user && !window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    }
};

// Função global para atualizar o nível e a barra de progresso em qualquer página
window.updateUserLevelDisplay = async function() {
    const user = await Auth.getUser();
    if (!user) return;

    // Buscar badges do usuário
    const { data: badges } = await supabaseClient
        .from('badges')
        .select('*')
        .eq('usuario_id', user.id);

    const badgeCount = badges ? badges.length : 0;
    
    // Lógica de Níveis (10 níveis)
    const levels = [
        "Aprendiz de Mordomo", "Buscador de Sabedoria", "Praticante da Diligência",
        "Gestor Prudente", "Sentinela das Finanças", "Administrador Fiel",
        "Semeador Generoso", "Mestre da Provisão", "Exemplo de Mordomia",
        "Mordomo Fiel e Prudente"
    ];

    const currentLevelIndex = Math.min(badgeCount, levels.length - 1);
    const currentLevel = levels[currentLevelIndex];
    
    // Buscar contagens para barra de progresso fluida
    const { count: transCount } = await supabaseClient.from('transacoes').select('*', { count: 'exact', head: true }).eq('usuario_id', user.id);
    const { count: goalsCount } = await supabaseClient.from('metas_financeiras').select('*', { count: 'exact', head: true }).eq('usuario_id', user.id);
    
    const points = (badgeCount * 100) + (transCount * 5) + (goalsCount * 20);
    const pointsPerLevel = 150;
    const progress = (points % pointsPerLevel) / pointsPerLevel * 100;

    // Atualizar elementos na tela
    const nameEl = document.getElementById('user-display-name');
    const statusEl = document.getElementById('user-status-display');
    const progressEl = document.getElementById('level-progress-bar');
    const avatarEl = document.querySelector('.user-avatar');

    if (nameEl) nameEl.textContent = user.nome || 'Usuário';
    if (statusEl) statusEl.textContent = currentLevel;
    if (progressEl) progressEl.style.width = `${progress}%`;
    if (avatarEl) avatarEl.textContent = (user.nome || 'U').charAt(0).toUpperCase();
};

// Inicialização global
window.Auth = Auth;
window.supabaseClient = supabaseClient;

document.addEventListener('DOMContentLoaded', async () => {
    if (!window.location.pathname.includes('login.html')) {
        Auth.checkAuth();
        window.updateUserLevelDisplay();
    }

    // Toggle Sidebar Mobile
    const menuToggle = document.getElementById('menu-toggle');
    const closeMenu = document.getElementById('close-menu');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.add('open');
        });
    }

    if (closeMenu && sidebar) {
        closeMenu.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
    }

    document.addEventListener('click', (e) => {
        if (sidebar && sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== menuToggle) {
            sidebar.classList.remove('open');
        }
    });

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            Auth.logout();
        });
    }
});
