# 💜 Pulso — Controle de Parcelamentos e Assinaturas

> **Parcelamentos e assinaturas em um só lugar. Clareza total, zero surpresas.**

Pulso é um app web de finanças pessoais que ajuda você a gerenciar todos os seus parcelamentos de cartão de crédito e assinaturas recorrentes (Netflix, Spotify, etc.) em um único dashboard visual e intuitivo.

## ✨ Funcionalidades

- 📊 **Dashboard interativo** com gráficos de gastos por categoria, evolução mensal e projeção futura
- 💳 **Gestão de parcelamentos** — adicione, edite e acompanhe todas as suas parcelas
- 🔄 **Gestão de assinaturas** — controle assinaturas mensais, trimestrais, semestrais e anuais
- 🏷️ **Categorias personalizadas** — organize seus gastos com cores e ícones
- 📅 **Próximos vencimentos** — saiba exatamente o que vence nos próximos dias
- 🔐 **Autenticação segura** — login com e-mail/senha ou Google
- 🌙 **Dark mode** — interface moderna com glassmorphism

## 🛠️ Tech Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + TypeScript |
| Build | Vite 5 |
| Estilização | Tailwind CSS 3 |
| Componentes | shadcn/ui (Radix) |
| Backend/BD | Supabase (PostgreSQL) |
| Roteamento | React Router DOM 6 |
| Estado | TanStack React Query 5 |
| Gráficos | Recharts |
| Formulários | React Hook Form + Zod |

## 🚀 Como rodar localmente

```bash
# 1. Clone o repositório
git clone https://github.com/deivithi/pulsofinance.git
cd pulsofinance

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do Supabase

# 4. Rode o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:8080`.

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── landing/        # Landing page (Header, Hero, Features, Footer)
│   ├── dashboard/      # Dashboard (charts, cards, filtros)
│   ├── parcelamentos/  # CRUD de parcelamentos
│   ├── assinaturas/    # CRUD de assinaturas
│   ├── categorias/     # CRUD de categorias
│   ├── configuracoes/  # Perfil e configurações
│   ├── layout/         # Layout (sidebar, header)
│   └── ui/             # Componentes base (shadcn/ui)
├── contexts/           # AuthContext (autenticação)
├── hooks/              # Hooks customizados (queries + mutations)
├── integrations/       # Cliente Supabase + tipos
├── pages/              # Páginas da aplicação
└── lib/                # Utilitários
```

## 📝 Scripts

| Script | Comando | Descrição |
|--------|---------|-----------|
| Dev | `npm run dev` | Servidor de desenvolvimento |
| Build | `npm run build` | Build de produção |
| Lint | `npm run lint` | Verificação de código |
| Test | `npm test` | Testes automatizados |
| Preview | `npm run preview` | Preview do build |

## 📄 Licença

Projeto privado. Todos os direitos reservados.
