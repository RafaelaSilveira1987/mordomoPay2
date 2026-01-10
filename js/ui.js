/**
 * PAYMORDOMO - FUNÇÕES DE UI
 * Gerencia interações com a interface
 */

class UI {
    /**
     * Exibe notificação toast
     */
    static showToast(message, type = 'info', duration = 3000) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.remove('hidden');

        setTimeout(() => {
            toast.classList.add('hidden');
        }, duration);

        logger.info(`Toast: ${type} - ${message}`);
    }

    /**
     * Exibe loader
     */
    static showLoader() {
        const loader = document.getElementById('loader');
        loader.classList.remove('hidden');
        logger.debug('Loader: Mostrado');
    }

    /**
     * Esconde loader
     */
    static hideLoader() {
        const loader = document.getElementById('loader');
        loader.classList.add('hidden');
        logger.debug('Loader: Escondido');
    }

    /**
     * Exibe modal
     */
    static showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('hidden');
        modal.classList.add('active');
        logger.debug(`Modal ${modalId}: Aberto`);
    }

    /**
     * Esconde modal
     */
    static hideModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('hidden');
        modal.classList.remove('active');
        logger.debug(`Modal ${modalId}: Fechado`);
    }

    /**
     * Limpa formulário
     */
    static clearForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
            logger.debug(`Formulário ${formId}: Limpo`);
        }
    }

    /**
     * Define valor de elemento
     */
    static setValue(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
                element.value = value;
            } else {
                element.textContent = value;
            }
        }
    }

    /**
     * Obtém valor de elemento
     */
    static getValue(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
                return element.value;
            } else {
                return element.textContent;
            }
        }
        return '';
    }

    /**
     * Adiciona classe a elemento
     */
    static addClass(elementId, className) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add(className);
        }
    }

    /**
     * Remove classe de elemento
     */
    static removeClass(elementId, className) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove(className);
        }
    }

    /**
     * Alterna classe de elemento
     */
    static toggleClass(elementId, className) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.toggle(className);
        }
    }

    /**
     * Habilita elemento
     */
    static enable(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.disabled = false;
        }
    }

    /**
     * Desabilita elemento
     */
    static disable(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.disabled = true;
        }
    }

    /**
     * Mostra elemento
     */
    static show(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove('hidden');
        }
    }

    /**
     * Esconde elemento
     */
    static hide(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('hidden');
        }
    }

    /**
     * Define HTML de elemento
     */
    static setHTML(elementId, html) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        }
    }

    /**
     * Adiciona HTML a elemento
     */
    static appendHTML(elementId, html) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML += html;
        }
    }

    /**
     * Limpa conteúdo de elemento
     */
    static clear(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = '';
        }
    }

    /**
     * Muda página ativa
     */
    static changePage(pageName) {
        // Esconde todas as páginas
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Mostra página selecionada
        const page = document.getElementById(`${pageName}-page`);
        if (page) {
            page.classList.add('active');
            logger.info(`Página: ${pageName} - Ativada`);
        }

        // Esconde sidebar em mobile
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.remove('active');
        }

        // Desativa menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
            menuToggle.classList.remove('active');
        }
    }

    /**
     * Muda conteúdo ativo
     */
    static changeContent(contentName) {
        // Esconde todos os conteúdos
        document.querySelectorAll('.page-content').forEach(content => {
            content.classList.remove('active');
        });

        // Mostra conteúdo selecionado
        const content = document.getElementById(`${contentName}-content`);
        if (content) {
            content.classList.add('active');
            logger.info(`Conteúdo: ${contentName} - Ativado`);
        }
    }

    /**
     * Ativa item de navegação
     */
    static setActiveNav(navId) {
        // Remove classe active de todos os itens
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Adiciona classe active ao item selecionado
        const navItem = document.querySelector(`[data-page="${navId}"]`);
        if (navItem) {
            navItem.classList.add('active');
            logger.debug(`Nav: ${navId} - Ativado`);
        }
    }

    /**
     * Atualiza informações do usuário
     */
    static updateUserInfo(user) {
        if (user) {
            const name = user.user_metadata?.name || 'Usuário';
            const initial = Formatter.initials(name);
            
            UI.setValue('user-name', name);
            UI.setValue('user-initial', initial);
            logger.info('UI: Informações do usuário atualizadas');
        }
    }

    /**
     * Alterna sidebar em mobile
     */
    static toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const menuToggle = document.getElementById('menu-toggle');
        
        if (sidebar) {
            sidebar.classList.toggle('active');
        }
        if (menuToggle) {
            menuToggle.classList.toggle('active');
        }
    }

    /**
     * Renderiza tabela
     */
    static renderTable(tableId, data, columns) {
        const tbody = document.querySelector(`#${tableId} tbody`);
        if (!tbody) return;

        tbody.innerHTML = '';

        data.forEach(row => {
            const tr = document.createElement('tr');
            columns.forEach(col => {
                const td = document.createElement('td');
                td.textContent = row[col.key] || '';
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        logger.debug(`Tabela ${tableId}: ${data.length} linhas renderizadas`);
    }

    /**
     * Renderiza lista
     */
    static renderList(listId, items, template) {
        const list = document.getElementById(listId);
        if (!list) return;

        list.innerHTML = '';

        items.forEach(item => {
            const html = template(item);
            list.innerHTML += html;
        });

        logger.debug(`Lista ${listId}: ${items.length} itens renderizados`);
    }

    /**
     * Renderiza grid
     */
    static renderGrid(gridId, items, template) {
        return this.renderList(gridId, items, template);
    }

    /**
     * Exibe confirmação
     */
    static confirm(message) {
        return window.confirm(message);
    }

    /**
     * Exibe alerta
     */
    static alert(message) {
        window.alert(message);
    }

    /**
     * Copia texto para clipboard
     */
    static copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            UI.showToast('Copiado para a área de transferência', 'success');
            logger.info('Texto copiado para clipboard');
        }).catch(error => {
            logger.error('Erro ao copiar para clipboard', { error: error.message });
        });
    }

    /**
     * Foca em elemento
     */
    static focus(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.focus();
        }
    }

    /**
     * Scroll para elemento
     */
    static scrollTo(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * Desabilita scroll
     */
    static disableScroll() {
        document.body.style.overflow = 'hidden';
    }

    /**
     * Habilita scroll
     */
    static enableScroll() {
        document.body.style.overflow = 'auto';
    }

    /**
     * Exibe elemento em tela cheia
     */
    static fullscreen(elementId) {
        const element = document.getElementById(elementId);
        if (element && element.requestFullscreen) {
            element.requestFullscreen();
        }
    }

    /**
     * Sai do modo tela cheia
     */
    static exitFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }

    /**
     * Imprime elemento
     */
    static print(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            const printWindow = window.open('', '', 'height=400,width=600');
            printWindow.document.write(element.innerHTML);
            printWindow.document.close();
            printWindow.print();
        }
    }

    /**
     * Valida formulário
     */
    static validateForm(formId) {
        const form = document.getElementById(formId);
        if (!form) return false;

        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let valid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = 'var(--danger)';
                valid = false;
            } else {
                input.style.borderColor = 'var(--border)';
            }
        });

        return valid;
    }

    /**
     * Reseta estilos de validação
     */
    static resetValidation(formId) {
        const form = document.getElementById(formId);
        if (!form) return;

        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.style.borderColor = 'var(--border)';
        });
    }
}
