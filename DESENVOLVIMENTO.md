# Guia de Desenvolvimento - PayMordomo

## 🛠️ Configuração do Ambiente

### Requisitos

- Node.js 14+
- npm ou pnpm
- Navegador moderno (Chrome, Firefox, Safari, Edge)

### Instalação

```bash
# Clonar repositório
git clone <repo-url>
cd paymordomo-pure-js

# Instalar dependências (se houver)
npm install
# ou
pnpm install
```

### Executar em Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev
# ou
pnpm dev

# Acessar em http://localhost:3000
```

---

## 📁 Estrutura de Arquivos

### HTML (`client/index.html`)

Arquivo principal contém:
- Página de Login
- Página de Dashboard com Sidebar
- Todas as páginas e modais

### CSS (`client/css/`)

- **style.css**: Estilos globais, variáveis CSS, componentes base
- **dashboard.css**: Estilos específicos do dashboard
- **transactions.css**: Estilos de transações
- **responsive.css**: Media queries para responsividade

### JavaScript (`client/js/`)

#### Utilitários (`utils/`)

- **logger.js**: Sistema de logging seguro
- **formatter.js**: Formatadores de dados
- **validators.js**: Validadores de entrada

#### Core

- **app.js**: Aplicação principal, roteamento
- **auth.js**: Sistema de autenticação
- **storage.js**: Gerenciador de localStorage
- **supabase-client.js**: Cliente Supabase
- **ui.js**: Funções de UI

#### Páginas (`pages/`)

- **dashboard.js**: Dashboard com versículos/dicas
- **transactions.js**: Gerenciamento de transações
- **goals.js**: Gerenciamento de metas
- **tithe.js**: Gerenciamento de dízimos
- **tips.js**: Página de dicas
- **reports.js**: Relatórios

---

## 🔧 Adicionando Nova Funcionalidade

### 1. Criar Nova Página

**Arquivo**: `client/js/pages/novapage.js`

```javascript
class NovaPage {
    constructor() {
        this.data = [];
        logger.info('NovaPage: Inicializada');
    }

    async init() {
        try {
            logger.function('NovaPage.init', 'Inicializando');
            await this.loadData();
            this.setupEventListeners();
            this.render();
            logger.success('NovaPage.init', 'Página inicializada');
        } catch (error) {
            logger.error('NovaPage.init', { error: error.message });
        }
    }

    async loadData() {
        // Carregar dados
    }

    setupEventListeners() {
        // Configurar listeners
    }

    render() {
        UI.setValue('page-title', 'Nova Página');
        // Renderizar conteúdo
    }
}

const novaPage = new NovaPage();
```

### 2. Adicionar Rota

**Arquivo**: `client/index.html`

```html
<!-- Adicionar botão na sidebar -->
<button class="nav-item" data-page="novapage">
    <span class="nav-icon">📌</span>
    <span class="nav-label">Nova Página</span>
</button>

<!-- Adicionar conteúdo -->
<div id="novapage-content" class="page-content">
    <!-- Conteúdo aqui -->
</div>
```

### 3. Registrar Página

**Arquivo**: `client/js/app.js`

```javascript
async showDashboard() {
    // ... código existente ...
    
    // Adicionar inicialização
    await novaPage.init();
}
```

### 4. Importar Script

**Arquivo**: `client/index.html`

```html
<script src="js/pages/novapage.js"></script>
```

---

## 🗄️ Trabalhando com Supabase

### Criar Tabela

1. Acessar console Supabase
2. Criar tabela com colunas necessárias
3. Configurar permissões

### Usar no Código

```javascript
// Selecionar dados
const result = await supabaseClient.select('tabela', { user_id: userId });

// Inserir dados
const result = await supabaseClient.insert('tabela', {
    user_id: userId,
    descricao: 'Teste'
});

// Atualizar dados
const result = await supabaseClient.update('tabela', id, {
    descricao: 'Atualizado'
});

// Deletar dados
const result = await supabaseClient.delete('tabela', id);
```

---

## 🎨 Adicionando Estilos

### Variáveis CSS

Definidas em `client/css/style.css`:

```css
:root {
    --primary: #2563eb;
    --primary-light: #3b82f6;
    --primary-dark: #1d4ed8;
    --success: #10b981;
    --danger: #ef4444;
    --warning: #f59e0b;
    --background: #ffffff;
    --surface: #f9fafb;
    --border: #e5e7eb;
    --text-primary: #111827;
    --text-secondary: #6b7280;
    --text-muted: #9ca3af;
    --radius-sm: 0.375rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    --transition-fast: 150ms ease-out;
    --transition-normal: 300ms ease-out;
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 3rem;
}
```

### Usar Variáveis

```css
.elemento {
    background-color: var(--primary);
    color: var(--text-primary);
    padding: var(--spacing-md);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    transition: all var(--transition-normal);
}
```

---

## 🧪 Testando

### Teste Manual

1. Abrir DevTools (F12)
2. Verificar console para erros
3. Testar cada funcionalidade

### Teste de Logging

```javascript
// No console
logger.debug('Teste');
logger.getLogs();
logger.summary();
```

### Teste de Storage

```javascript
// No console
storage.set('teste', { dados: 'teste' });
storage.get('teste');
storage.debug();
```

### Teste de Validação

```javascript
// No console
Validators.email('test@example.com');
Validators.phone('11987654321');
Validators.cpf('12345678901');
```

---

## 📦 Build para Produção

```bash
# Build
npm run build
# ou
pnpm build

# Preview
npm run preview
# ou
pnpm preview
```

---

## 🚀 Deploy

### Opção 1: Manus Platform

```bash
# Publicar via Manus UI
# Clique em "Publish" após criar checkpoint
```

### Opção 2: Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Opção 3: Netlify

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

---

## 🐛 Debug

### Ativar Modo Debug

```javascript
// No console
logger.isDev = true;
app.debug();
auth.debug();
storage.debug();
```

### Inspecionar Dados

```javascript
// Transações
console.log(storage.getTransactions());

// Metas
console.log(storage.getGoals());

// Dízimos
console.log(storage.getTithes());

// Usuário
console.log(auth.getCurrentUser());
```

### Limpar Dados

```javascript
// Limpar tudo
storage.clear();

// Limpar sessão
storage.clearSession();

// Logout
auth.logout();
```

---

## 📝 Convenções de Código

### Nomes de Variáveis

```javascript
// Bom
const userEmail = 'user@example.com';
const isAuthenticated = true;
const transactionList = [];

// Ruim
const ue = 'user@example.com';
const auth = true;
const list = [];
```

### Nomes de Funções

```javascript
// Bom
function getUserById(id) { }
function validateEmail(email) { }
function renderTransactionList(data) { }

// Ruim
function get(id) { }
function validate(email) { }
function render(data) { }
```

### Comentários

```javascript
// Bom - Explica o porquê
// Converte telefone para email para compatibilidade com Supabase
const email = this._phoneToEmail(phone);

// Ruim - Óbvio
// Converte telefone
const email = this._phoneToEmail(phone);
```

### Async/Await

```javascript
// Bom
async function loadData() {
    try {
        const data = await fetchData();
        return data;
    } catch (error) {
        logger.error('loadData', { error });
        return null;
    }
}

// Ruim
function loadData() {
    return fetchData()
        .then(data => data)
        .catch(error => null);
}
```

---

## 🔐 Segurança

### Validar Entrada

```javascript
// Sempre validar
const email = UI.getValue('email');
if (!Validators.email(email)) {
    UI.showToast('Email inválido', 'error');
    return;
}
```

### Sanitizar Dados

```javascript
// Usar logger.sanitize() automaticamente
logger.info('Dados', { sensitive: data });
// Dados sensíveis são redatados automaticamente
```

### Nunca Expor Chaves

```javascript
// Bom - Usar variáveis de ambiente
const apiKey = process.env.API_KEY;

// Ruim - Hardcoded
const apiKey = 'abc123xyz';
```

---

## 📚 Recursos Úteis

- [MDN Web Docs](https://developer.mozilla.org/)
- [Supabase Docs](https://supabase.com/docs)
- [CSS Tricks](https://css-tricks.com/)
- [JavaScript.info](https://javascript.info/)

---

## 🤝 Contribuindo

1. Criar branch: `git checkout -b feature/nova-funcionalidade`
2. Fazer commits: `git commit -m 'Adicionar nova funcionalidade'`
3. Push: `git push origin feature/nova-funcionalidade`
4. Abrir Pull Request

---

## 📞 Suporte

Para dúvidas sobre desenvolvimento, entre em contato via WhatsApp.

---

**Última atualização**: 10 de Janeiro de 2026
