# Gest&atilde;o Financeira

![Status](https://img.shields.io/badge/status-functional-success)

Aplicativo web moderno para controle financeiro pessoal com dashboard interativo, autentica&ccedil;&atilde;o segura e design premium.

## ✨ Funcionalidades

- 📊 Dashboard com vis&atilde;o geral de ganhos, despesas, saldo e pend&ecirc;ncias
- 💰 Lan&ccedil;amento de receitas e despesas
- 🏷️ Categorias personaliz&aacute;veis com cores
- 📅 Filtros por per&iacute;odo (ano/m&ecirc;s)
- ✅ Status de pagamento (Pago/Pendente)
- 🔐 Autentica&ccedil;&atilde;o segura com Supabase
- 🎨 Design moderno com glassmorphism e anima&ccedil;&otilde;es fluidas
- 🌙 Dark mode autom&aacute;tico

## 🚀 Colocar no Ar (GitHub Pages)

### Op&ccedil;&atilde;o Autom&aacute;tica (Recomendada)

O deploy autom&aacute;tico est&aacute; configurado via GitHub Actions. A cada push na branch `main`, o site &eacute; buildado e deployado.

**Configure o segredo no GitHub**:
1. V&aacute; em **Settings** > **Secrets and variables** > **Actions**
2. **New repository secret**
3. Nome: `VITE_SUPABASE_ANON_KEY`
4. Valor: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltY29zcmFwYmNubHpqa213Y2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0MjM2ODcsImV4cCI6MjEwNDk5OTY4N30.5veLxqoT7j7ecTGYnKvtgKO_XO4vdXfMxqKEv_V7rf4`
5. **Add secret**

**Configure o GitHub Pages**:
1. **Settings** > **Pages**
2. **Build and deployment**
3. Source: **GitHub Actions**
4. Aguarde o primeiro deploy (2-3 min)

### Op&ccedil;&atilde;o Manual

```bash
# Clone
git clone https://github.com/lucasouqueiroz/gestao-financeira-app.git
cd gestao-financeira-app

# Instale
npm install

# Crie .env
echo "VITE_SUPABASE_URL=https://imcosrapbcnlzjkmwcfp.supabase.co" > .env
echo "VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." >> .env

# Build e deploy
npm run deploy
```

## 🛠️ Desenvolvimento Local

```bash
npm install
npm run dev
```

## 📁 Estrutura

```
gestao-financeira-app/
├── src/
│   ├── lib/
│   │   ├── auth.js         # Autentica&ccedil;&atilde;o
│   │   ├── supabaseClient.js
│   │   └── classificador.js
│   ├── hooks/
│   │   └── useTransacoes.js
│   └── main.jsx
├── app.js                  # L&oacute;gica do app
├── styles.css              # Design system
├── index.html              # Estrutura
└── vite.config.js          # Config Vite
```

## 🔐 Supabase

### Configurar Autentica&ccedil;&atilde;o

1. **Authentication** > **URL Configuration**
2. Site URL: `https://lucasouqueiroz.github.io/gestao-financeira-app/`
3. Redirect URLs: `https://lucasouqueiroz.github.io/gestao-financeira-app/**`

### Tabelas e RLS

Consulte [`DEPLOY.md`](./DEPLOY.md) para SQL completo das tabelas e pol&iacute;ticas de seguran&ccedil;a.

## 📚 Documenta&ccedil;&atilde;o

- [`DEPLOY.md`](./DEPLOY.md) - Guia completo de implanta&ccedil;&atilde;o
- [`INSTRUCOES.md`](./INSTRUCOES.md) - Passo a passo r&aacute;pido

## 🎨 Design

- **Font**: Inter (Google Fonts)
- **Cores**: Indigo primary, Emerald success, Red danger
- **Efeitos**: Glassmorphism, gradientes animados, sombras suaves
- **Anima&ccedil;&otilde;es**: Fade-in, slide-up, stagger lists

## 📄 Licen&ccedil;a

MIT
