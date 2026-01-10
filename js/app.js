/**
 * PAYMORDOMO - APLICAÇÃO PRINCIPAL
 * Inicializa e gerencia o aplicativo
 */

class App {
    constructor() {
        this.currentPage = null;
        logger.info('App: Inicializada');
    }

    /**
     * Inicializa a aplicação
     */
    async init() {
        try {
            logger.function('App.init', 'Iniciando aplicação');

            // Inicializa Supabase
            const supabaseReady = await supabaseClient.init();
            if (!supabaseReady) {
                logger.warn('App.init', 'Supabase não inicializado, usando modo offline');
            }

            // Inicializa autenticação
            const isAuthenticated = await auth.init();

            if (isAuthenticated) {
                // Usuário autenticado - exibe dashboard
                this.showDashboard();
            } else {
                // Usuário não autenticado - exibe login
                this.showLogin();
            }

            // Configura event listeners globais
            this.setupGlobalListeners();

            logger.success('App.init', 'Aplicação inicializada');
        } catch (error) {
            logger.error('App.init', { error: error.message });
            UI.showToast('Erro ao inicializar aplicação', 'error');
        }
    }

    /**
     * Exibe página de login
     */
    showLogin() {
        logger.function('App.showLogin', 'Exibindo login');

        UI.changePage('login');

        // Configura formulário de login
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        logger.info('App: Página de login exibida');
    }

    /**
     * Exibe dashboard
     */
    async showDashboard() {
        logger.function('App.showDashboard', 'Exibindo dashboard');

        UI.changePage('dashboard');

        // Atualiza informações do usuário
        const user = auth.getCurrentUser();
        if (user) {
            UI.updateUserInfo(user);
        }

        // Inicializa páginas
        await dashboardPage.init();
        await transactionsPage.init();
        await goalsPage.init();
        await tithePage.init();
        await tipsPage.init();
        await reportsPage.init();

        // Configura navegação
        this.setupNavigation();

        logger.info('App: Dashboard exibido');
    }

    /**
     * Configura navegação
     */
    setupNavigation() {
        // Itens de navegação
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.getAttribute('data-page');
                this.navigateTo(page);
            });
        });

        // Menu toggle mobile
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => UI.toggleSidebar());
        }

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        logger.debug('App: Navegação configurada');
    }

    /**
     * Navega para página
     */
    navigateTo(page) {
        try {
            logger.function('App.navigateTo', `Navegando para ${page}`);

            // Atualiza conteúdo
            UI.changeContent(page);

            // Atualiza navegação
            UI.setActiveNav(page);

            // Atualiza título
            const titles = {
                'dashboard': 'Dashboard',
                'transactions': 'Transações',
                'goals': 'Metas',
                'tithe': 'Dízimos',
                'tips': 'Dicas',
                'reports': 'Relatórios'
            };

            UI.setValue('page-title', titles[page] || page);

            // Fecha sidebar em mobile
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.classList.remove('active');
            }

            const menuToggle = document.getElementById('menu-toggle');
            if (menuToggle) {
                menuToggle.classList.remove('active');
            }

            this.currentPage = page;
            logger.info(`App: Página ${page} ativada`);
        } catch (error) {
            logger.error('App.navigateTo', { error: error.message });
        }
    }

    /**
     * Trata login
     */
    async handleLogin(e) {
        try {
            e.preventDefault();

            const phone = UI.getValue('phone');
            const password = UI.getValue('password');

            logger.function('App.handleLogin', 'Processando login');

            const result = await auth.login(phone, password);

            if (result.success) {
                this.showDashboard();
            }
        } catch (error) {
            logger.error('App.handleLogin', { error: error.message });
            UI.showToast('Erro ao fazer login', 'error');
        }
    }

    /**
     * Trata logout
     */
    async handleLogout() {
        try {
            if (!UI.confirm('Tem certeza que deseja sair?')) return;

            logger.function('App.handleLogout', 'Processando logout');

            const result = await auth.logout();

            if (result.success) {
                this.showLogin();
            }
        } catch (error) {
            logger.error('App.handleLogout', { error: error.message });
        }
    }

    /**
     * Configura event listeners globais
     */
    setupGlobalListeners() {
        // Fecha modais ao clicar fora
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                    modal.classList.remove('active');
                }
            });
        });

        // Tecla Escape fecha modais
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => {
                    modal.classList.add('hidden');
                    modal.classList.remove('active');
                });
            }
        });

        logger.debug('App: Event listeners globais configurados');
    }

    /**
     * Exibe informações de debug
     */
    debug() {
        console.log('=== App Debug ===');
        console.log('Página atual:', this.currentPage);
        console.log('Autenticado:', auth.isLoggedIn());
        console.log('Usuário:', auth.getCurrentUser());
        console.log('Logs:', logger.getLogs());
        console.log('Storage:', storage.export());
    }
}

// Instância global
const app = new App();

// Inicializa quando o DOM está pronto
document.addEventListener('DOMContentLoaded', () => {
    logger.info('DOMContentLoaded: Iniciando aplicação');
    app.init();
});

// Trata erros não capturados
window.addEventListener('error', (e) => {
    logger.error('Erro global', { error: e.message, stack: e.stack });
    UI.showToast('Erro na aplicação', 'error');
});

// Trata rejeições de Promise não tratadas
window.addEventListener('unhandledrejection', (e) => {
    logger.error('Promise rejeitada', { error: e.reason });
    UI.showToast('Erro na aplicação', 'error');
});
