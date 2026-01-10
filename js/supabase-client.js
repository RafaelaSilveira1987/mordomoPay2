/**
 * PAYMORDOMO - CLIENTE SUPABASE
 * Gerencia integração com Supabase de forma segura
 */

class SupabaseClient {
    constructor() {
        // Credenciais do Supabase (não expor em console)
        this.SUPABASE_URL = 'https://fetimotrijqyswrfoyzz.supabase.co';
        this.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZldGltb3RyaWpxeXN3cmZveXp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MTk5MTksImV4cCI6MjA3NTA5NTkxOX0.Wkiu887LiK1l3k4vHpoRB-ODsrxeUF_mJINJmJ2Xz4I';
        
        this.client = null;
        this.initialized = false;

        logger.info('SupabaseClient: Inicializado');
    }

    /**
     * Inicializa o cliente Supabase
     */
    async init() {
        try {
            if (typeof supabase === 'undefined') {
                throw new Error('Biblioteca Supabase não carregada');
            }

            this.client = supabase.createClient(this.SUPABASE_URL, this.SUPABASE_ANON_KEY);
            this.initialized = true;

            logger.success('SupabaseClient: Conectado com sucesso');
            return true;
        } catch (error) {
            logger.error('SupabaseClient: Erro ao inicializar', { error: error.message });
            return false;
        }
    }

    /**
     * Verifica se está inicializado
     */
    isInitialized() {
        return this.initialized && this.client !== null;
    }

    /**
     * Autentica usuário com email e senha
     */
    async login(email, password) {
        try {
            if (!this.isInitialized()) {
                throw new Error('Cliente Supabase não inicializado');
            }

            const { data, error } = await this.client.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                logger.auth('Login', false, { error: error.message });
                throw error;
            }

            logger.auth('Login', true, { userId: data.user?.id });
            return { success: true, user: data.user, session: data.session };
        } catch (error) {
            logger.error('SupabaseClient.login', { error: error.message });
            return { success: false, error: error.message };
        }
    }

    /**
     * Registra novo usuário
     */
    async signup(email, password, metadata = {}) {
        try {
            if (!this.isInitialized()) {
                throw new Error('Cliente Supabase não inicializado');
            }

            const { data, error } = await this.client.auth.signUp({
                email,
                password,
                options: {
                    data: metadata
                }
            });

            if (error) {
                logger.auth('Signup', false, { error: error.message });
                throw error;
            }

            logger.auth('Signup', true, { userId: data.user?.id });
            return { success: true, user: data.user };
        } catch (error) {
            logger.error('SupabaseClient.signup', { error: error.message });
            return { success: false, error: error.message };
        }
    }

    /**
     * Faz logout
     */
    async logout() {
        try {
            if (!this.isInitialized()) {
                throw new Error('Cliente Supabase não inicializado');
            }

            const { error } = await this.client.auth.signOut();

            if (error) {
                logger.auth('Logout', false, { error: error.message });
                throw error;
            }

            logger.auth('Logout', true);
            return { success: true };
        } catch (error) {
            logger.error('SupabaseClient.logout', { error: error.message });
            return { success: false, error: error.message };
        }
    }

    /**
     * Obtém sessão atual
     */
    async getSession() {
        try {
            if (!this.isInitialized()) {
                throw new Error('Cliente Supabase não inicializado');
            }

            const { data, error } = await this.client.auth.getSession();

            if (error) throw error;

            return { success: true, session: data.session };
        } catch (error) {
            logger.error('SupabaseClient.getSession', { error: error.message });
            return { success: false, error: error.message };
        }
    }

    /**
     * Obtém usuário atual
     */
    async getUser() {
        try {
            if (!this.isInitialized()) {
                throw new Error('Cliente Supabase não inicializado');
            }

            const { data, error } = await this.client.auth.getUser();

            if (error) throw error;

            return { success: true, user: data.user };
        } catch (error) {
            logger.error('SupabaseClient.getUser', { error: error.message });
            return { success: false, error: error.message };
        }
    }

    /**
     * Insere dados em uma tabela
     */
    async insert(table, data) {
        try {
            if (!this.isInitialized()) {
                throw new Error('Cliente Supabase não inicializado');
            }

            const { data: result, error } = await this.client
                .from(table)
                .insert([data])
                .select();

            if (error) throw error;

            logger.transaction('Insert', result[0]?.id, data.amount || 0, data.type || 'unknown');
            return { success: true, data: result[0] };
        } catch (error) {
            logger.error(`SupabaseClient.insert(${table})`, { error: error.message });
            return { success: false, error: error.message };
        }
    }

    /**
     * Atualiza dados em uma tabela
     */
    async update(table, id, data) {
        try {
            if (!this.isInitialized()) {
                throw new Error('Cliente Supabase não inicializado');
            }

            const { data: result, error } = await this.client
                .from(table)
                .update(data)
                .eq('id', id)
                .select();

            if (error) throw error;

            logger.transaction('Update', id, data.amount || 0, data.type || 'unknown');
            return { success: true, data: result[0] };
        } catch (error) {
            logger.error(`SupabaseClient.update(${table})`, { error: error.message });
            return { success: false, error: error.message };
        }
    }

    /**
     * Deleta dados de uma tabela
     */
    async delete(table, id) {
        try {
            if (!this.isInitialized()) {
                throw new Error('Cliente Supabase não inicializado');
            }

            const { error } = await this.client
                .from(table)
                .delete()
                .eq('id', id);

            if (error) throw error;

            logger.transaction('Delete', id, 0, 'delete');
            return { success: true };
        } catch (error) {
            logger.error(`SupabaseClient.delete(${table})`, { error: error.message });
            return { success: false, error: error.message };
        }
    }

    /**
     * Seleciona dados de uma tabela
     */
    async select(table, filters = {}) {
        try {
            if (!this.isInitialized()) {
                throw new Error('Cliente Supabase não inicializado');
            }

            let query = this.client.from(table).select();

            // Aplica filtros
            for (const [key, value] of Object.entries(filters)) {
                if (value !== undefined && value !== null) {
                    query = query.eq(key, value);
                }
            }

            const { data, error } = await query;

            if (error) throw error;

            logger.api(table, 'SELECT', 200, { count: data?.length || 0 });
            return { success: true, data };
        } catch (error) {
            logger.error(`SupabaseClient.select(${table})`, { error: error.message });
            return { success: false, error: error.message };
        }
    }

    /**
     * Seleciona um registro
     */
    async selectOne(table, id) {
        try {
            if (!this.isInitialized()) {
                throw new Error('Cliente Supabase não inicializado');
            }

            const { data, error } = await this.client
                .from(table)
                .select()
                .eq('id', id)
                .single();

            if (error) throw error;

            logger.api(table, 'SELECT_ONE', 200);
            return { success: true, data };
        } catch (error) {
            logger.error(`SupabaseClient.selectOne(${table})`, { error: error.message });
            return { success: false, error: error.message };
        }
    }

    /**
     * Conta registros
     */
    async count(table, filters = {}) {
        try {
            if (!this.isInitialized()) {
                throw new Error('Cliente Supabase não inicializado');
            }

            let query = this.client.from(table).select('*', { count: 'exact', head: true });

            for (const [key, value] of Object.entries(filters)) {
                if (value !== undefined && value !== null) {
                    query = query.eq(key, value);
                }
            }

            const { count, error } = await query;

            if (error) throw error;

            logger.api(table, 'COUNT', 200, { count });
            return { success: true, count };
        } catch (error) {
            logger.error(`SupabaseClient.count(${table})`, { error: error.message });
            return { success: false, error: error.message };
        }
    }

    /**
     * Faz upload de arquivo
     */
    async uploadFile(bucket, path, file) {
        try {
            if (!this.isInitialized()) {
                throw new Error('Cliente Supabase não inicializado');
            }

            const { data, error } = await this.client.storage
                .from(bucket)
                .upload(path, file);

            if (error) throw error;

            logger.api(`storage/${bucket}`, 'UPLOAD', 200);
            return { success: true, data };
        } catch (error) {
            logger.error('SupabaseClient.uploadFile', { error: error.message });
            return { success: false, error: error.message };
        }
    }

    /**
     * Faz download de arquivo
     */
    async downloadFile(bucket, path) {
        try {
            if (!this.isInitialized()) {
                throw new Error('Cliente Supabase não inicializado');
            }

            const { data, error } = await this.client.storage
                .from(bucket)
                .download(path);

            if (error) throw error;

            logger.api(`storage/${bucket}`, 'DOWNLOAD', 200);
            return { success: true, data };
        } catch (error) {
            logger.error('SupabaseClient.downloadFile', { error: error.message });
            return { success: false, error: error.message };
        }
    }

    /**
     * Deleta arquivo
     */
    async deleteFile(bucket, path) {
        try {
            if (!this.isInitialized()) {
                throw new Error('Cliente Supabase não inicializado');
            }

            const { error } = await this.client.storage
                .from(bucket)
                .remove([path]);

            if (error) throw error;

            logger.api(`storage/${bucket}`, 'DELETE', 200);
            return { success: true };
        } catch (error) {
            logger.error('SupabaseClient.deleteFile', { error: error.message });
            return { success: false, error: error.message };
        }
    }

    /**
     * Obtém URL pública de arquivo
     */
    getPublicUrl(bucket, path) {
        try {
            if (!this.isInitialized()) {
                throw new Error('Cliente Supabase não inicializado');
            }

            const { data } = this.client.storage
                .from(bucket)
                .getPublicUrl(path);

            return { success: true, url: data.publicUrl };
        } catch (error) {
            logger.error('SupabaseClient.getPublicUrl', { error: error.message });
            return { success: false, error: error.message };
        }
    }

    /**
     * Escuta mudanças em tempo real
     */
    onRealtimeChange(table, callback) {
        try {
            if (!this.isInitialized()) {
                throw new Error('Cliente Supabase não inicializado');
            }

            const subscription = this.client
                .channel(`public:${table}`)
                .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
                .subscribe();

            logger.info(`SupabaseClient: Escutando mudanças em ${table}`);
            return subscription;
        } catch (error) {
            logger.error('SupabaseClient.onRealtimeChange', { error: error.message });
            return null;
        }
    }
}

// Instância global
const supabaseClient = new SupabaseClient();
