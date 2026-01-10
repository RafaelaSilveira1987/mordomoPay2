/**
 * PAYMORDOMO - GERENCIADOR DE ARMAZENAMENTO
 * Gerencia dados locais com localStorage e sessionStorage
 */

class StorageManager {
    constructor() {
        this.prefix = 'paymordomo_';
        logger.info('StorageManager: Inicializado');
    }

    /**
     * Salva dados no localStorage
     */
    set(key, value) {
        try {
            const fullKey = this.prefix + key;
            const serialized = JSON.stringify(value);
            localStorage.setItem(fullKey, serialized);
            logger.debug(`StorageManager.set(${key})`, { size: serialized.length });
            return true;
        } catch (error) {
            logger.error(`StorageManager.set(${key})`, { error: error.message });
            return false;
        }
    }

    /**
     * Obtém dados do localStorage
     */
    get(key) {
        try {
            const fullKey = this.prefix + key;
            const item = localStorage.getItem(fullKey);
            if (item === null) return null;
            return JSON.parse(item);
        } catch (error) {
            logger.error(`StorageManager.get(${key})`, { error: error.message });
            return null;
        }
    }

    /**
     * Remove dados do localStorage
     */
    remove(key) {
        try {
            const fullKey = this.prefix + key;
            localStorage.removeItem(fullKey);
            logger.debug(`StorageManager.remove(${key})`);
            return true;
        } catch (error) {
            logger.error(`StorageManager.remove(${key})`, { error: error.message });
            return false;
        }
    }

    /**
     * Limpa todos os dados do localStorage
     */
    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            logger.info('StorageManager: Armazenamento limpo');
            return true;
        } catch (error) {
            logger.error('StorageManager.clear', { error: error.message });
            return false;
        }
    }

    /**
     * Verifica se uma chave existe
     */
    has(key) {
        const fullKey = this.prefix + key;
        return localStorage.getItem(fullKey) !== null;
    }

    /**
     * Obtém todas as chaves
     */
    keys() {
        const keys = Object.keys(localStorage);
        return keys
            .filter(key => key.startsWith(this.prefix))
            .map(key => key.replace(this.prefix, ''));
    }

    /**
     * Obtém tamanho do armazenamento
     */
    size() {
        let size = 0;
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                size += localStorage.getItem(key).length;
            }
        });
        return size;
    }

    /**
     * Salva dados de sessão
     */
    setSession(key, value) {
        try {
            const fullKey = this.prefix + key;
            const serialized = JSON.stringify(value);
            sessionStorage.setItem(fullKey, serialized);
            logger.debug(`StorageManager.setSession(${key})`);
            return true;
        } catch (error) {
            logger.error(`StorageManager.setSession(${key})`, { error: error.message });
            return false;
        }
    }

    /**
     * Obtém dados de sessão
     */
    getSession(key) {
        try {
            const fullKey = this.prefix + key;
            const item = sessionStorage.getItem(fullKey);
            if (item === null) return null;
            return JSON.parse(item);
        } catch (error) {
            logger.error(`StorageManager.getSession(${key})`, { error: error.message });
            return null;
        }
    }

    /**
     * Remove dados de sessão
     */
    removeSession(key) {
        try {
            const fullKey = this.prefix + key;
            sessionStorage.removeItem(fullKey);
            logger.debug(`StorageManager.removeSession(${key})`);
            return true;
        } catch (error) {
            logger.error(`StorageManager.removeSession(${key})`, { error: error.message });
            return false;
        }
    }

    /**
     * Limpa dados de sessão
     */
    clearSession() {
        try {
            const keys = Object.keys(sessionStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    sessionStorage.removeItem(key);
                }
            });
            logger.info('StorageManager: Sessão limpa');
            return true;
        } catch (error) {
            logger.error('StorageManager.clearSession', { error: error.message });
            return false;
        }
    }

    /**
     * Salva usuário autenticado
     */
    setUser(user) {
        return this.set('user', user);
    }

    /**
     * Obtém usuário autenticado
     */
    getUser() {
        return this.get('user');
    }

    /**
     * Remove usuário autenticado
     */
    removeUser() {
        return this.remove('user');
    }

    /**
     * Salva token de autenticação
     */
    setToken(token) {
        return this.setSession('token', token);
    }

    /**
     * Obtém token de autenticação
     */
    getToken() {
        return this.getSession('token');
    }

    /**
     * Remove token de autenticação
     */
    removeToken() {
        return this.removeSession('token');
    }

    /**
     * Salva transações
     */
    setTransactions(transactions) {
        return this.set('transactions', transactions);
    }

    /**
     * Obtém transações
     */
    getTransactions() {
        return this.get('transactions') || [];
    }

    /**
     * Salva metas
     */
    setGoals(goals) {
        return this.set('goals', goals);
    }

    /**
     * Obtém metas
     */
    getGoals() {
        return this.get('goals') || [];
    }

    /**
     * Salva dízimos
     */
    setTithes(tithes) {
        return this.set('tithes', tithes);
    }

    /**
     * Obtém dízimos
     */
    getTithes() {
        return this.get('tithes') || [];
    }

    /**
     * Salva configurações
     */
    setSettings(settings) {
        return this.set('settings', settings);
    }

    /**
     * Obtém configurações
     */
    getSettings() {
        return this.get('settings') || {};
    }

    /**
     * Salva último versículo
     */
    setLastVerse(verse) {
        return this.set('lastVerse', verse);
    }

    /**
     * Obtém último versículo
     */
    getLastVerse() {
        return this.get('lastVerse');
    }

    /**
     * Salva última dica
     */
    setLastTip(tip) {
        return this.set('lastTip', tip);
    }

    /**
     * Obtém última dica
     */
    getLastTip() {
        return this.get('lastTip');
    }

    /**
     * Exporta dados
     */
    export() {
        const data = {};
        this.keys().forEach(key => {
            data[key] = this.get(key);
        });
        return data;
    }

    /**
     * Importa dados
     */
    import(data) {
        try {
            for (const [key, value] of Object.entries(data)) {
                this.set(key, value);
            }
            logger.info('StorageManager: Dados importados');
            return true;
        } catch (error) {
            logger.error('StorageManager.import', { error: error.message });
            return false;
        }
    }

    /**
     * Exibe informações de debug
     */
    debug() {
        const info = {
            prefix: this.prefix,
            keys: this.keys(),
            size: this.size(),
            items: {}
        };

        this.keys().forEach(key => {
            info.items[key] = this.get(key);
        });

        console.table(info);
        return info;
    }
}

// Instância global
const storage = new StorageManager();
