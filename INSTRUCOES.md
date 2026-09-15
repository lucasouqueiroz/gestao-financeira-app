# 🚀 Como Colocar o Site no Ar

## Problema

O site est&aacute; mostrando vers&atilde;o antiga porque o c&oacute;digo novo precisa ser buildado.

## Solu&ccedil;&atilde;o (3 passos)

### 1️⃣ Configure o Segredo no GitHub

1. V&aacute; em **Settings** > **Secrets and variables** > **Actions**
2. Clique em **New repository secret**
3. Preencha:
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltY29zcmFwYmNubHpqa213Y2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0MjM2ODcsImV4cCI6MjEwNDk5OTY4N30.5veLxqoT7j7ecTGYnKvtgKO_XO4vdXfMxqKEv_V7rf4`
4. Clique em **Add secret**

### 2️⃣ Configure o GitHub Pages

1. V&aacute; em **Settings** > **Pages**
2. Em **Build and deployment**:
   - **Source**: GitHub Actions (recomendado)
3. O deploy autom&aacute;tico j&aacute; est&aacute; configurado!

### 3️⃣ Aguarde o Deploy

- O GitHub Actions vai buildar automaticamente
- Leva 2-3 minutos
- Veja o progresso em **Actions** > **Deploy to GitHub Pages**

## ✅ Pronto!

Acesse: https://lucasouqueiroz.github.io/gestao-financeira-app/

## 🔄 Deploy Manual (Alternativa)

```bash
git clone https://github.com/lucasouqueiroz/gestao-financeira-app.git
cd gestao-financeira-app
npm install
npm run deploy
```

## 🔐 Supabase (Opcional)

Para autentica&ccedil;&atilde;o funcionar 100%:

1. **Authentication** > **URL Configuration**
2. Adicione:
   - Site URL: `https://lucasouqueiroz.github.io/gestao-financeira-app/`
   - Redirect URLs: `https://lucasouqueiroz.github.io/gestao-financeira-app/**`

## 🆘 Problemas?

- **Site em branco**: Limpe cache (Ctrl+Shift+R)
- **Erro de API**: Verifique se o segredo foi adicionado
- **404**: Aguarde mais 2 minutos
