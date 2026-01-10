/**
 * PAYMORDOMO - SISTEMA DE LOGGING
 * Gerencia logs estruturados sem expor dados sensíveis
 */

class Logger {
    constructor() {
        this.isDev = true; // Mude para false em produção
        this.logs = [];
        this.maxLogs = 100;
    }

    /**
     * Log de informação
     */
    info(message, data = null) {
        this._log('INFO', message, data);
    }

    /**
     * Log de sucesso
     */
    success(message, data = null) {
        this._log('SUCCESS', message, data);
    }

    /**
     * Log de aviso
     */
    warn(message, data = null) {
        this._log('WARN', message, data);
    }

    /**
     * Log de erro
     */
    error(message, data = null) {
        this._log('ERROR', message, data);
    }

    /**
     * Log de debug
     */
    debug(message, data = null) {
        if (this.isDev) {
            this._log('DEBUG', message, data);
        }
    }

    /**
     * Log de função
     */
    function(functionName, action, data = null) {
        const message = `[${functionName}] ${action}`;
        this._log('FUNCTION', message, data);
    }

    /**
     * Log de API
     */
    api(endpoint, method, status, data = null) {
        const message = `[API] ${method} ${endpoint} - Status: ${status}`;
        this._log('API', message, data);
    }

    /**
     * Log de autenticação (sem expor dados sensíveis)
     */
    auth(action, success = true, details = null) {
        const message = `[AUTH] ${action} - ${success ? 'Sucesso' : 'Falha'}`;
        this._log(success ? 'SUCCESS' : 'ERROR', message, details);
    }

    /**
     * Log de transação
     */
    transaction(action, transactionId, amount, type, details = null) {
        const message = `[TRANSACTION] ${action} - ID: ${transactionId}, Valor: R$ ${amount}, Tipo: ${type}`;
        this._log('INFO', message, details);
    }

    /**
     * Log de validação
     */
    validation(field, valid, error = null) {
        const message = `[VALIDATION] Campo: ${field} - ${valid ? 'Válido' : 'Inválido'}`;
        this._log(valid ? 'SUCCESS' : 'WARN', message, error ? { error } : null);
    }

    /**
     * Limpa dados sensíveis de um objeto
     */
    sanitize(obj) {
        if (!obj) return obj;

        const sensitiveFields = [
            'password',
            'token',
            'apiKey',
            'secret',
            'key',
            'authorization',
            'phone',
            'email',
            'cpf',
            'cnpj'
        ];

        const sanitized = { ...obj };

        for (const field of sensitiveFields) {
            if (field in sanitized) {
                sanitized[field] = '***REDACTED***';
            }
        }

        return sanitized;
    }

    /**
     * Log interno
     */
    _log(level, message, data = null) {
        const timestamp = new Date().toLocaleTimeString('pt-BR');
        const logEntry = {
            timestamp,
            level,
            message,
            data: data ? this.sanitize(data) : null
        };

        // Adiciona ao array de logs
        this.logs.push(logEntry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        // Exibe no console em desenvolvimento
        if (this.isDev) {
            const style = this._getConsoleStyle(level);
            console.log(
                `%c[${timestamp}] ${level}: ${message}`,
                style,
                data ? this.sanitize(data) : ''
            );
        }
    }

    /**
     * Retorna estilo para console
     */
    _getConsoleStyle(level) {
        const styles = {
            'INFO': 'color: #2563eb; font-weight: bold;',
            'SUCCESS': 'color: #10b981; font-weight: bold;',
            'WARN': 'color: #f59e0b; font-weight: bold;',
            'ERROR': 'color: #ef4444; font-weight: bold;',
            'DEBUG': 'color: #8b5cf6; font-weight: bold;',
            'FUNCTION': 'color: #06b6d4; font-weight: bold;',
            'API': 'color: #ec4899; font-weight: bold;'
        };
        return styles[level] || 'color: #6b7280; font-weight: bold;';
    }

    /**
     * Retorna todos os logs
     */
    getLogs() {
        return this.logs;
    }

    /**
     * Retorna logs filtrados por nível
     */
    getLogsByLevel(level) {
        return this.logs.filter(log => log.level === level);
    }

    /**
     * Limpa todos os logs
     */
    clearLogs() {
        this.logs = [];
    }

    /**
     * Exporta logs como JSON
     */
    exportLogs() {
        return JSON.stringify(this.logs, null, 2);
    }

    /**
     * Exibe resumo dos logs
     */
    summary() {
        const counts = {};
        this.logs.forEach(log => {
            counts[log.level] = (counts[log.level] || 0) + 1;
        });
        console.table(counts);
    }
}

// Instância global
const logger = new Logger();
