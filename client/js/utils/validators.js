/**
 * PAYMORDOMO - VALIDADORES
 * Funções para validar dados de entrada
 */

class Validators {
    /**
     * Valida email
     */
    static email(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**
     * Valida telefone brasileiro
     */
    static phone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length === 11 && cleaned[0] === '1';
    }

    /**
     * Valida CPF
     */
    static cpf(cpf) {
        const cleaned = cpf.replace(/\D/g, '');
        
        if (cleaned.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(cleaned)) return false;

        let sum = 0;
        let remainder;

        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i);
        }

        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cleaned.substring(9, 10))) return false;

        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i);
        }

        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cleaned.substring(10, 11))) return false;

        return true;
    }

    /**
     * Valida CNPJ
     */
    static cnpj(cnpj) {
        const cleaned = cnpj.replace(/\D/g, '');
        
        if (cleaned.length !== 14) return false;
        if (/^(\d)\1{13}$/.test(cleaned)) return false;

        let size = cleaned.length - 2;
        let numbers = cleaned.substring(0, size);
        let digits = cleaned.substring(size);
        let sum = 0;
        let pos = size - 7;

        for (let i = size; i >= 1; i--) {
            sum += numbers.charAt(size - i) * pos--;
            if (pos < 2) pos = 9;
        }

        let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
        if (result !== parseInt(digits.charAt(0))) return false;

        size = size + 1;
        numbers = cleaned.substring(0, size);
        sum = 0;
        pos = size - 7;

        for (let i = size; i >= 1; i--) {
            sum += numbers.charAt(size - i) * pos--;
            if (pos < 2) pos = 9;
        }

        result = sum % 11 < 2 ? 0 : 11 - sum % 11;
        if (result !== parseInt(digits.charAt(1))) return false;

        return true;
    }

    /**
     * Valida senha
     */
    static password(password) {
        // Mínimo 8 caracteres, pelo menos 1 maiúscula, 1 minúscula, 1 número
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return regex.test(password);
    }

    /**
     * Valida URL
     */
    static url(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Valida data
     */
    static date(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    /**
     * Valida data no futuro
     */
    static futureDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date > today;
    }

    /**
     * Valida número
     */
    static number(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    /**
     * Valida número positivo
     */
    static positiveNumber(value) {
        return this.number(value) && parseFloat(value) > 0;
    }

    /**
     * Valida número inteiro
     */
    static integer(value) {
        return Number.isInteger(parseFloat(value));
    }

    /**
     * Valida texto não vazio
     */
    static notEmpty(text) {
        return text && text.trim().length > 0;
    }

    /**
     * Valida comprimento mínimo
     */
    static minLength(text, min) {
        return text && text.length >= min;
    }

    /**
     * Valida comprimento máximo
     */
    static maxLength(text, max) {
        return !text || text.length <= max;
    }

    /**
     * Valida comprimento exato
     */
    static exactLength(text, length) {
        return text && text.length === length;
    }

    /**
     * Valida padrão regex
     */
    static pattern(text, regex) {
        return regex.test(text);
    }

    /**
     * Valida se é array
     */
    static array(value) {
        return Array.isArray(value);
    }

    /**
     * Valida se array não está vazio
     */
    static notEmptyArray(value) {
        return Array.isArray(value) && value.length > 0;
    }

    /**
     * Valida se é objeto
     */
    static object(value) {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }

    /**
     * Valida se valor está em lista
     */
    static inList(value, list) {
        return list.includes(value);
    }

    /**
     * Valida se valores são iguais
     */
    static equal(value1, value2) {
        return value1 === value2;
    }

    /**
     * Valida se valores são diferentes
     */
    static notEqual(value1, value2) {
        return value1 !== value2;
    }

    /**
     * Valida se valor é maior que
     */
    static greaterThan(value, min) {
        return parseFloat(value) > parseFloat(min);
    }

    /**
     * Valida se valor é menor que
     */
    static lessThan(value, max) {
        return parseFloat(value) < parseFloat(max);
    }

    /**
     * Valida se valor está entre
     */
    static between(value, min, max) {
        const num = parseFloat(value);
        return num >= parseFloat(min) && num <= parseFloat(max);
    }

    /**
     * Valida se é booleano
     */
    static boolean(value) {
        return typeof value === 'boolean';
    }

    /**
     * Valida se é string
     */
    static string(value) {
        return typeof value === 'string';
    }

    /**
     * Valida categoria de transação
     */
    static transactionCategory(category) {
        const validCategories = [
            'Alimentação', 'Moradia', 'Transporte', 'Saúde', 
            'Educação', 'Lazer', 'Espiritual', 'Renda', 'Renda Extra'
        ];
        return validCategories.includes(category);
    }

    /**
     * Valida tipo de transação
     */
    static transactionType(type) {
        return ['entrada', 'saida'].includes(type);
    }

    /**
     * Valida formulário inteiro
     */
    static validateForm(formData, rules) {
        const errors = {};

        for (const field in rules) {
            const value = formData[field];
            const fieldRules = rules[field];

            for (const rule of fieldRules) {
                const [validator, ...args] = rule.split(':');

                if (!this[validator] || !this[validator](value, ...args)) {
                    errors[field] = `Campo ${field} é inválido`;
                    break;
                }
            }
        }

        return {
            valid: Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Retorna mensagem de erro customizada
     */
    static getErrorMessage(field, validator) {
        const messages = {
            'email': 'Email inválido',
            'phone': 'Telefone deve ter 11 dígitos',
            'cpf': 'CPF inválido',
            'cnpj': 'CNPJ inválido',
            'password': 'Senha deve ter mínimo 8 caracteres, 1 maiúscula, 1 minúscula e 1 número',
            'url': 'URL inválida',
            'date': 'Data inválida',
            'futureDate': 'Data deve ser no futuro',
            'number': 'Deve ser um número',
            'positiveNumber': 'Deve ser um número positivo',
            'notEmpty': 'Campo obrigatório',
            'minLength': 'Campo muito curto',
            'maxLength': 'Campo muito longo'
        };

        return messages[validator] || `Campo ${field} é inválido`;
    }
}
