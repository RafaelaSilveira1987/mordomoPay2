# Análise do Projeto PayMordomo - Recriação em HTML/CSS/JS Puro

## Estrutura do Projeto Original (React + TypeScript)

### Páginas Principais
1. **Dashboard** - Página inicial com resumo financeiro
2. **Transações** - Gerenciamento de entradas e saídas
3. **Metas** - Definição e acompanhamento de metas financeiras
4. **Dízimos** - Registro e controle de dízimos
5. **Dicas** - Dicas de saúde financeira com versículos
6. **Relatórios** - Análise e relatórios financeiros

### Componentes Principais
- **DashboardLayout** - Layout com sidebar e header
- **Cards** - Componentes de exibição de dados
- **Progress Bars** - Barras de progresso para metas
- **Tables** - Tabelas para listar transações

### Design Visual
- **Cores Principais**: Azul (Primary), Verde (Sucesso), Vermelho (Erro), Laranja (Destaque)
- **Tipografia**: Merriweather (títulos), Poppins (subtítulos), Sans-serif (corpo)
- **Layout**: Sidebar fixa + conteúdo fluido
- **Tema**: Claro com acentos coloridos

### Dados Principais
- Transações (entrada/saída)
- Metas financeiras
- Dízimos
- Conquistas/Achievements
- Versículos do dia
- Dicas de saúde financeira

## Requisitos de Implementação

### 1. Integração Supabase
- URL: https://fetimotrijqyswrfoyzz.supabase.co
- ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
- Dados sensíveis NÃO devem ser expostos no console

### 2. Sistema de Autenticação
- Login com celular e senha
- Página de cadastro redireciona para WhatsApp: 553287073537
- Verificação de credenciais via Supabase

### 3. Funcionalidades CRUD
- Incluir transações
- Editar transações
- Excluir transações
- Mesmo para metas, dízimos, etc.

### 4. Atualização Automática
- Versículos se atualizam (diários ou por navegação)
- Dicas se atualizam (diárias ou por navegação)
- Logs para análise de funcionamento

### 5. Segurança
- Chaves sensíveis não expostas no console
- Logs estruturados para debug
- Validação de dados

## Estrutura de Arquivos Proposta (HTML/CSS/JS Puro)

```
paymordomo-pure-js/
├── client/
│   ├── index.html
│   ├── css/
│   │   ├── style.css
│   │   ├── dashboard.css
│   │   ├── transactions.css
│   │   └── responsive.css
│   ├── js/
│   │   ├── app.js
│   │   ├── supabase-client.js
│   │   ├── auth.js
│   │   ├── storage.js
│   │   ├── ui.js
│   │   ├── pages/
│   │   │   ├── dashboard.js
│   │   │   ├── transactions.js
│   │   │   ├── goals.js
│   │   │   ├── tithe.js
│   │   │   ├── tips.js
│   │   │   └── reports.js
│   │   └── utils/
│   │       ├── logger.js
│   │       ├── formatter.js
│   │       └── validators.js
│   └── public/
│       ├── images/
│       └── icons/
└── server/
    └── index.ts (placeholder)
```

## Próximos Passos

1. Criar estrutura HTML base com layout responsivo
2. Implementar CSS com design similar ao original
3. Criar sistema de roteamento SPA (Single Page Application)
4. Implementar integração com Supabase
5. Desenvolver funcionalidades CRUD
6. Implementar sistema de autenticação
7. Adicionar atualização automática de versículos e dicas
8. Testes e validação
