/**
 * PAYMORDOMO - FORMATADORES
 * Funções para formatar dados para exibição
 */

class Formatter {
    /**
     * Formata valor monetário em Real
     */
    static currency(value, showSymbol = true) {
        const formatted = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);

        return showSymbol ? formatted : formatted.replace('R$', '').trim();
    }

    /**
     * Formata data para formato brasileiro
     */
    static date(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    /**
     * Formata data e hora
     */
    static dateTime(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR');
    }

    /**
     * Formata hora
     */
    static time(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('pt-BR');
    }

    /**
     * Formata percentual
     */
    static percentage(value, decimals = 0) {
        return `${value.toFixed(decimals)}%`;
    }

    /**
     * Formata número com separadores
     */
    static number(value, decimals = 2) {
        return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(value);
    }

    /**
     * Formata telefone
     */
    static phone(phone) {
        if (!phone) return '';
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
        }
        return phone;
    }

    /**
     * Formata CPF
     */
    static cpf(cpf) {
        if (!cpf) return '';
        const cleaned = cpf.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return `${cleaned.substring(0, 3)}.${cleaned.substring(3, 6)}.${cleaned.substring(6, 9)}-${cleaned.substring(9)}`;
        }
        return cpf;
    }

    /**
     * Formata CNPJ
     */
    static cnpj(cnpj) {
        if (!cnpj) return '';
        const cleaned = cnpj.replace(/\D/g, '');
        if (cleaned.length === 14) {
            return `${cleaned.substring(0, 2)}.${cleaned.substring(2, 5)}.${cleaned.substring(5, 8)}/${cleaned.substring(8, 12)}-${cleaned.substring(12)}`;
        }
        return cnpj;
    }

    /**
     * Formata texto para maiúsculas
     */
    static uppercase(text) {
        return text ? text.toUpperCase() : '';
    }

    /**
     * Formata texto para minúsculas
     */
    static lowercase(text) {
        return text ? text.toLowerCase() : '';
    }

    /**
     * Capitaliza primeira letra
     */
    static capitalize(text) {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }

    /**
     * Capitaliza cada palavra
     */
    static titleCase(text) {
        if (!text) return '';
        return text.split(' ').map(word => this.capitalize(word)).join(' ');
    }

    /**
     * Trunca texto
     */
    static truncate(text, length = 50, suffix = '...') {
        if (!text || text.length <= length) return text;
        return text.substring(0, length) + suffix;
    }

    /**
     * Formata tipo de transação
     */
    static transactionType(type) {
        const types = {
            'entrada': '➕ Entrada',
            'saida': '➖ Saída'
        };
        return types[type] || type;
    }

    /**
     * Formata status
     */
    static status(status) {
        const statuses = {
            'ativo': '🟢 Ativo',
            'inativo': '⚪ Inativo',
            'pendente': '🟡 Pendente',
            'concluído': '✅ Concluído',
            'cancelado': '❌ Cancelado'
        };
        return statuses[status] || status;
    }

    /**
     * Formata duração em dias
     */
    static daysRemaining(targetDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const target = new Date(targetDate);
        target.setHours(0, 0, 0, 0);
        
        const diff = target - today;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        
        if (days < 0) return 'Vencido';
        if (days === 0) return 'Hoje';
        if (days === 1) return 'Amanhã';
        return `${days} dias`;
    }

    /**
     * Formata tamanho de arquivo
     */
    static fileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Formata duração em minutos para HH:MM
     */
    static duration(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    /**
     * Formata valor para exibição de progresso
     */
    static progress(current, target) {
        const percentage = (current / target) * 100;
        return {
            percentage: Math.min(percentage, 100),
            text: `${this.currency(current)} de ${this.currency(target)}`
        };
    }

    /**
     * Formata cor baseado em valor
     */
    static colorByValue(value, thresholds = { good: 70, warning: 40 }) {
        if (value >= thresholds.good) return 'var(--success)';
        if (value >= thresholds.warning) return 'var(--warning)';
        return 'var(--danger)';
    }

    /**
     * Formata iniciais de nome
     */
    static initials(name) {
        if (!name) return '';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }

    /**
     * Formata URL segura
     */
    static sanitizeUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.href;
        } catch {
            return '';
        }
    }

    /**
     * Formata JSON para exibição
     */
    static json(obj, indent = 2) {
        return JSON.stringify(obj, null, indent);
    }

    /**
     * Formata diferença de tempo relativa
     */
    static timeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + ' anos atrás';

        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + ' meses atrás';

        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + ' dias atrás';

        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + ' horas atrás';

        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + ' minutos atrás';

        return Math.floor(seconds) + ' segundos atrás';
    }
}
