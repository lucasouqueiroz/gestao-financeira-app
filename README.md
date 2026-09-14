# Gestão Financeira App

App pessoal de controle financeiro, criado a partir da planilha `Gestao-Financeira.xlsx` do Lucas, com backend real em **Supabase (PostgreSQL)** e frontend em **React + Vite**.

## Arquitetura

- **Banco de dados:** Supabase (projeto `gestao-financeira`, região `sa-east-1`)
  - Tabela `categorias`: 10 categorias padrão (Cartão de Crédito, Moradia/Utilidades, Educação, Dívidas/Empréstimos, etc.)
  - Tabela `transacoes`: lançamentos de despesas e ganhos, com ano, mês, vencimento, status pago/pendente
  - View `resumo_mensal`: totais agregados por ano/mês
  - View `despesas_por_categoria`: totais agregados por categoria
- **Frontend:** React 18 + Vite + Recharts (gráficos) + lucide-react (ícones)
- **Fluxo de uso:** você conversa com a IA (texto ou voz) sobre um gasto/ganho → ela classifica e confirma com você → grava direto no Supabase → o app reflete o dado em tempo real, em qualquer sessão ou dispositivo.

## Configuração local

1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Copie `.env.example` para `.env` e preencha com as credenciais do seu projeto Supabase:
   ```
   VITE_SUPABASE_URL=https://imcosrapbcnlzjkmwcfp.supabase.co
   VITE_SUPABASE_ANON_KEY=sua_chave_publishable_aqui
   ```
   A chave publishable (formato `sb_publishable_...`) pode ser obtida em **Project Settings → API Keys** no painel do Supabase. Nunca use a Service Role Key ou o Personal Access Token no frontend.
4. Rode o app:
   ```bash
   npm run dev
   ```

## Deploy gratuito

Recomendado usar **Vercel** ou **Netlify** (ambos com tier free):

1. Conecte o repositório GitHub à plataforma escolhida.
2. Configure as mesmas variáveis de ambiente (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) no painel do serviço de deploy — nunca commitando o `.env` real no Git.
3. Build command: `npm run build` — Output directory: `dist`.

## Segurança

- O arquivo `.env` está no `.gitignore` e nunca deve ser commitado.
- A tabela usa Row Level Security (RLS) habilitada. As políticas atuais são permissivas (uso pessoal single-user); para múltiplos usuários, ajuste as políticas para usar `auth.uid()`.
- Use somente a chave **anon/publishable** no frontend — nunca a Service Role Key.

## Categorias mapeadas

| Categoria | Cor |
|---|---|
| Cartão de Crédito | `#ef4444` |
| Moradia/Utilidades | `#f59e0b` |
| Telefonia/Internet Móvel | `#3b82f6` |
| Educação | `#8b5cf6` |
| Dívidas/Empréstimos | `#ec4899` |
| Compras Parceladas | `#14b8a6` |
| Transporte | `#f97316` |
| Cuidados Pessoais | `#a3a3a3` |
| Receita | `#22c55e` |
| Outros | `#64748b` |

## Roadmap

- [ ] Autenticação de usuário (Supabase Auth) caso o app seja usado por mais de uma pessoa.
- [ ] Edge Function para importação automática de extratos via OFX/CSV.
- [ ] Deploy automático via GitHub Actions ao Vercel/Netlify.
