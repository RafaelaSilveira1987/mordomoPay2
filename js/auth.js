// Configuração do Supabase
// Nota: Em um ambiente real, essas chaves viriam de variáveis de ambiente
const SUPABASE_URL = 'https://ktjpphfxulkymobkjvqo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0anBwaGZ4dWxreW1vYmtqdnFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NjE0NTcsImV4cCI6MjA3MzAzNzQ1N30.KxrzIALYjCApoD7Br4BMeNgmtcL89XCqEKbxfmbxPEk'; // O usuário deve fornecer ou eu deduzo se possível

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Gerenciamento de Sessão
const Auth = {
    async login(phone, password) {
        // Implementação de login via Supabase Auth ou tabela customizada
        // Como o usuário pediu login com celular e senha, geralmente usa-se a tabela de perfis
        const { data, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('phone', phone)
            .eq('password', password) // Nota: Senhas devem ser hasheadas na vida real
            .single();

        if (error) throw error;
        
        localStorage.setItem('mordomopay_user', JSON.stringify(data));
        return data;
    },

    logout() {
        localStorage.removeItem('mordomopay_user');
        window.location.href = 'login.html';
    },

    getUser() {
        const user = localStorage.getItem('mordomopay_user');
        return user ? JSON.parse(user) : null;
    },

    checkAuth() {
        if (!this.getUser() && !window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    }
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Auth.checkAuth(); // Desativado para permitir visualização inicial
    
    const user = Auth.getUser();
    if (user) {
        const userDisplays = document.querySelectorAll('.user-name');
        userDisplays.forEach(el => el.textContent = user.full_name || 'Usuário');
        
        const userAvatars = document.querySelectorAll('.user-avatar');
        userAvatars.forEach(el => el.textContent = (user.full_name || 'U').charAt(0).toUpperCase());
    }

    // Toggle Sidebar Mobile
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
});
