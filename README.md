# PayMordomo - Gestão Cristã Inteligente

## 🎯 Visão Geral

**PayMordomo** é uma aplicação web de gestão financeira cristã, desenvolvida em **HTML, CSS e JavaScript puro** (sem frameworks, sem Node.js, sem TypeScript).

### ✨ Características

- ✅ **100% JavaScript Puro** - Sem React, Vue, Angular ou qualquer framework
- ✅ **Sem Dependências** - Não requer Node.js ou npm
- ✅ **Totalmente Responsivo** - Mobile, tablet e desktop
- ✅ **Autenticação Supabase** - Login seguro com celular e senha
- ✅ **CRUD Completo** - Transações, metas, dízimos
- ✅ **Logging Seguro** - Sem exposição de dados sensíveis
- ✅ **Armazenamento Local** - localStorage com prefixo seguro
- ✅ **Versículos e Dicas** - Atualizáveis e navegáveis

---

## 🚀 Como Usar

### 1. Abrir no Navegador

Basta abrir o arquivo `client/index.html` em qualquer navegador moderno:

```bash
# Opção 1: Abrir diretamente
open client/index.html

# Opção 2: Usar um servidor HTTP simples (Python)
python3 -m http.server 8000
# Acessar em http://localhost:8000/client/

# Opção 3: Usar Node.js (se disponível)
npx http-server client -p 8000
```

### 2. Fazer Login

- **Celular**: `11987654321` (qualquer número)
- **Senha**: `Teste123456` (qualquer senha válida)

### 3. Usar as Funcionalidades

- **Dashboard**: Versículos, dicas e estatísticas
- **Transações**: CRUD com filtros e exportação
- **Metas**: Criar e acompanhar metas financeiras
- **Dízimos**: Registrar dízimos
- **Dicas**: Dicas de saúde financeira
- **Relatórios**: Análise financeira

---

## 📁 Estrutura

```
paymordomo-pure-js/
├── client/
│   ├── index.html              # Arquivo HTML principal
│   ├── css/
│   │   ├── style.css           # Estilos globais
│   │   ├── dashboard.css       # Estilos dashboard
│   │   ├── transactions.css    # Estilos transações
│   │   └── responsive.css      # Media queries
│   ├── js/
│   │   ├── app.js              # Aplicação principal
│   │   ├── auth.js             # Autenticação
│   │   ├── storage.js          # localStorage
│   │   ├── supabase-client.js  # Cliente Supabase
│   │   ├── ui.js               # Funções UI
│   │   ├── utils/
│   │   │   ├── logger.js       # Logging seguro
│   │   │   ├── formatter.js    # Formatadores
│   │   │   └── validators.js   # Validadores
│   │   └── pages/
│   │       ├── dashboard.js
│   │       ├── transactions.js
│   │       ├── goals.js
│   │       ├── tithe.js
│   │       ├── tips.js
│   │       └── reports.js
│   └── public/                 # Arquivos estáticos
├── DOCUMENTACAO.md             # Documentação completa
├── DESENVOLVIMENTO.md          # Guia de desenvolvimento
└── README.md                   # Este arquivo
```

---

## 🔐 Credenciais Supabase

```
URL: https://fetimotrijqyswrfoyzz.supabase.co
ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Nota**: Dados sensíveis são automaticamente redatados em logs.

---

## 📱 Responsividade

- **Desktop** (>1024px): Layout completo com sidebar
- **Tablet** (768px-1024px): Layout adaptado
- **Mobile** (<768px): Menu toggle, layout otimizado

---

## 🔒 Segurança

- ✅ Senhas nunca expostas em logs
- ✅ Tokens redatados automaticamente
- ✅ Dados sensíveis protegidos
- ✅ Validação de entrada
- ✅ Autenticação Supabase segura

---

## 📚 Documentação

- **DOCUMENTACAO.md**: Guia completo de uso
- **DESENVOLVIMENTO.md**: Guia para desenvolvedores

---

## 🎨 Design

- Cores: Azul (#2563eb) e branco
- Tipografia: Poppins, Merriweather, Inter
- Animações suaves
- Design moderno e limpo

---

## 💾 Dados Armazenados

- localStorage com prefixo `paymordomo_`
- Transações, metas, dízimos
- Configurações do usuário
- Versículo e dica atual

---

## 🌐 Navegadores Suportados

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 🎯 Funcionalidades

| Página | Funcionalidades |
|--------|-----------------|
| **Dashboard** | Versículos, Dicas, Estatísticas, Metas, Conquistas |
| **Transações** | CRUD, Filtros, Exportar CSV, 9 Categorias |
| **Metas** | CRUD, Progresso Visual, Prazos |
| **Dízimos** | Registrar, Deletar, Total, Mês Atual |
| **Dicas** | 8 Dicas de Saúde Financeira |
| **Relatórios** | Receitas, Despesas, Saldo, Taxa de Economia |

---

## 🚀 Próximas Melhorias

- [ ] Gráficos (Chart.js)
- [ ] Backup automático
- [ ] Sincronização em tempo real
- [ ] Notificações push
- [ ] Exportação em PDF
- [ ] Modo offline
- [ ] Temas personalizáveis

---

## 📞 Suporte

Para suporte, entre em contato via WhatsApp:
```
https://wa.me/553287073537
```

---

## 📄 Licença

Projeto proprietário de uso privado.

---

## ✨ Desenvolvido com ❤️

**PayMordomo** - Gestão Cristã Inteligente

Desenvolvido em HTML, CSS e JavaScript puros, sem frameworks.

---

**Última atualização**: 10 de Janeiro de 2026
