/**
 * PAYMORDOMO - SISTEMA DE AUTENTICAÇÃO
 * Gerencia login, logout e sessão do usuário
 */

class Auth {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        logger.info('Auth: Inicializado');
    }

    /**
     * Inicializa autenticação
     */
    async init() {
        try {
            // Verifica se há usuário na sessão
            const storedUser = storage.getUser();
            if (storedUser) {
                this.currentUser = storedUser;
                this.isAuthenticated = true;
                logger.auth('Init', true, { userId: storedUser.id });
                return true;
            }

            // Tenta obter sessão do Supabase
            const result = await supabaseClient.getSession();
            if (result.success && result.session) {
                const userResult = await supabaseClient.getUser();
                if (userResult.success) {
                    this.currentUser = userResult.user;
                    this.isAuthenticated = true;
                    storage.setUser(userResult.user);
                    logger.auth('Init', true, { userId: userResult.user.id });
                    return true;
                }
            }

            logger.info('Auth: Nenhuma sessão ativa');
            return false;
        } catch (error) {
            logger.error('Auth.init', { error: error.message });
            return false;
        }
    }

    /**
     * Faz login com email e senha
     */
    async login(phone, password) {
        try {
            UI.showLoader();

            // Valida entrada
            if (!Validators.notEmpty(phone) || !Validators.notEmpty(password)) {
                throw new Error('Celular e senha são obrigatórios');
            }

            // Converte telefone para email (formato: +55XXXXXXXXXXX@paymordomo.local)
            const email = this._phoneToEmail(phone);

            logger.function('Auth.login', 'Iniciando login', { email });

            // Faz login no Supabase
            const result = await supabaseClient.login(email, password);

            if (!result.success) {
                throw new Error(result.error || 'Erro ao fazer login');
            }

            // Salva usuário
            this.currentUser = result.user;
            this.isAuthenticated = true;
            storage.setUser(result.user);

            logger.success('Auth.login', 'Login realizado com sucesso');
            UI.hideLoader();
            UI.showToast('Login realizado com sucesso!', 'success');

            return { success: true, user: result.user };
        } catch (error) {
            logger.error('Auth.login', { error: error.message });
            UI.hideLoader();
            UI.showToast(error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    /**
     * Faz logout
     */
    async logout() {
        try {
            UI.showLoader();

            logger.function('Auth.logout', 'Iniciando logout');

            // Faz logout no Supabase
            const result = await supabaseClient.logout();

            if (!result.success) {
                throw new Error(result.error || 'Erro ao fazer logout');
            }

            // Limpa dados locais
            this.currentUser = null;
            this.isAuthenticated = false;
            storage.removeUser();
            storage.clearSession();

            logger.success('Auth.logout', 'Logout realizado com sucesso');
            UI.hideLoader();
            UI.showToast('Logout realizado com sucesso!', 'success');

            return { success: true };
        } catch (error) {
            logger.error('Auth.logout', { error: error.message });
            UI.hideLoader();
            UI.showToast(error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    /**
     * Obtém usuário atual
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Verifica se está autenticado
     */
    isLoggedIn() {
        return this.isAuthenticated && this.currentUser !== null;
    }

    /**
     * Obtém ID do usuário
     */
    getUserId() {
        return this.currentUser?.id || null;
    }

    /**
     * Obtém email do usuário
     */
    getUserEmail() {
        return this.currentUser?.email || null;
    }

    /**
     * Obtém nome do usuário
     */
    getUserName() {
        return this.currentUser?.user_metadata?.name || 'Usuário';
    }

    /**
     * Atualiza perfil do usuário
     */
    async updateProfile(metadata) {
        try {
            if (!this.isLoggedIn()) {
                throw new Error('Usuário não autenticado');
            }

            logger.function('Auth.updateProfile', 'Atualizando perfil');

            // Aqui você implementaria a atualização via Supabase
            // Por enquanto, apenas atualiza o metadata local
            this.currentUser.user_metadata = {
                ...this.currentUser.user_metadata,
                ...metadata
            };

            storage.setUser(this.currentUser);

            logger.success('Auth.updateProfile', 'Perfil atualizado');
            return { success: true };
        } catch (error) {
            logger.error('Auth.updateProfile', { error: error.message });
            return { success: false, error: error.message };
        }
    }

    /**
     * Verifica permissão
     */
    hasPermission(permission) {
        if (!this.isLoggedIn()) return false;

        const permissions = this.currentUser.user_metadata?.permissions || [];
        return permissions.includes(permission);
    }

    /**
     * Converte telefone para email
     */
    _phoneToEmail(phone) {
        const cleaned = phone.replace(/\D/g, '');
        return `${cleaned}@paymordomo.local`;
    }

    /**
     * Converte email para telefone
     */
    _emailToPhone(email) {
        const match = email.match(/^(\d+)@/);
        if (match) {
            const cleaned = match[1];
            return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
        }
        return email;
    }

    /**
     * Exibe informações de debug
     */
    debug() {
        console.log('=== Auth Debug ===');
        console.log('Autenticado:', this.isAuthenticated);
        console.log('Usuário:', this.currentUser);
        console.log('ID:', this.getUserId());
        console.log('Email:', this.getUserEmail());
        console.log('Nome:', this.getUserName());
    }
}

// Instância global
const auth = new Auth();
