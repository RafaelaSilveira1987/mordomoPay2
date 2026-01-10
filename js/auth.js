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

// Inicialização global
window.Auth = Auth;
window.supabaseClient = supabaseClient;

document.addEventListener('DOMContentLoaded', async () => {
    // Verifica autenticação exceto na página de login
    if (!window.location.pathname.includes('login.html')) {
        Auth.checkAuth();
    }

    const user = await Auth.getUser();
    if (user) {
        const userDisplays = document.querySelectorAll('.user-name');
        userDisplays.forEach(el => el.textContent = user.nome || 'Usuário');
        
        const userAvatars = document.querySelectorAll('.user-avatar');
        userAvatars.forEach(el => el.textContent = (user.nome || 'U').charAt(0).toUpperCase());
    }

    // Toggle Sidebar Mobile
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Configurar botão de logout se existir
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            Auth.logout();
        });
    }
});
