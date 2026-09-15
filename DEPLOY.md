# Guia de Implanta&ccedil;&atilde;o - Gest&atilde;o Financeira

## Pr&eacute;-requisitos

- Node.js 18+
- npm ou yarn
- Projeto Supabase configurado

## Configura&ccedil;&atilde;o do Supabase

### 1. Criar Projeto

1. Acesse [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Anote o **Project Ref** (ex: `imcosrapbcnlzjkmwcfp`)

### 2. Configurar Autentica&ccedil;&atilde;o (Opcional para acesso p&uacute;blico)

Se quiser login:

1. V&aacute; em **Authentication** &gt; **Providers**
2. Ative **Email**
3. Em **URL Configuration**:
   - Site URL: `https://lucasouqueiroz.github.io/gestao-financeira-app/`
   - Redirect URLs: `https://lucasouqueiroz.github.io/gestao-financeira-app/**`

### 3. Executar Migrations

No SQL Editor do Supabase, execute as migrations para criar as tabelas:

```sql
-- Tabela categorias
create table public.categorias (
  id uuid primary key default gen_random_uuid(),
  nome text unique not null,
  tipo text not null check (tipo in ('Despesa', 'Ganho')),
  cor text default '#64748b',
  created_at timestamptz default now()
);

-- Tabela transacoes
create table public.transacoes (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('Despesa', 'Ganho')),
  categoria_id uuid references public.categorias(id),
  descricao text not null,
  valor numeric not null check (valor >= 0),
  ano integer not null,
  mes integer not null check (mes between 1 and 12),
  vencimento date not null,
  pago boolean default false,
  status text default 'PENDENTE' check (status in ('PAGO', 'PENDENTE')),
  observacao text,
  usuario_id uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabela perfis
create table public.perfis (
  id uuid primary key references auth.users(id),
  nome text,
  papel text default 'owner' check (papel = 'owner'),
  created_at timestamptz default now()
);
```

### 4. Configurar RLS (Row Level Security)

Para **acesso p&uacute;blico tempor&aacute;rio** (sem login):

```sql
-- Habilitar RLS
alter table public.categorias enable row level security;
alter table public.transacoes enable row level security;
alter table public.perfis enable row level security;

-- Pol&iacute;ticas para categorias (anon)
create policy "Acesso temporario publico categorias" on public.categorias
  for select to anon using (true);

-- Pol&iacute;ticas para transacoes (anon)
create policy "Acesso temporario publico transacoes" on public.transacoes
  for select to anon using (true);
create policy "Insercao temporaria publica transacoes" on public.transacoes
  for insert to anon with check (true);
create policy "Atualizacao temporaria publica transacoes" on public.transacoes
  for update to anon using (true) with check (true);

-- Grant de permiss&atilde;o SQL
grant select on table public.categorias to anon;
grant select, insert, update on table public.transacoes to anon;
```

Para **acesso com autentica&ccedil;&atilde;o** (recomendado para produ&ccedil;&atilde;o):

```sql
-- Remover pol&iacute;ticas anon (se existirem)
drop policy if exists "Acesso temporario publico categorias" on public.categorias;
drop policy if exists "Acesso temporario publico transacoes" on public.transacoes;
drop policy if exists "Insercao temporaria publica transacoes" on public.transacoes;
drop policy if exists "Atualizacao temporaria publica transacoes" on public.transacoes;

-- Pol&iacute;ticas para autenticados
create policy "Categorias somente para autenticados" on public.categorias
  for select to authenticated using (true);

create policy "Usuarios veem apenas suas transacoes" on public.transacoes
  for select to authenticated using (auth.uid() = usuario_id);
create policy "Usuarios inserem apenas suas transacoes" on public.transacoes
  for insert to authenticated with check (auth.uid() = usuario_id);
create policy "Usuarios atualizam apenas suas transacoes" on public.transacoes
  for update to authenticated using (auth.uid() = usuario_id) with check (auth.uid() = usuario_id);
create policy "Usuarios excluem apenas suas transacoes" on public.transacoes
  for delete to authenticated using (auth.uid() = usuario_id);

create policy "Owner ve o proprio perfil" on public.perfis
  for select to authenticated using (auth.uid() = id);

-- Remover grants anon
revoke select on table public.categorias from anon;
revoke select, insert, update on table public.transacoes from anon;
```

## Configura&ccedil;&atilde;o do Frontend

### 1. Instalar Depend&ecirc;ncias

```bash
npm install
```

### 2. Configurar Vari&aacute;veis de Ambiente

Copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite `.env` com suas credenciais do Supabase:

```env
VITE_SUPABASE_URL=https://SEU_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON
```

Obtenha essas chaves em: **Project Settings** &gt; **API**

### 3. Desenvolvimento Local

```bash
npm run dev
```

### 4. Build para Produ&ccedil;&atilde;o

```bash
npm run build
```

Os arquivos est&aacute;ticos ser&atilde;o gerados em `dist/`.

## Deploy no GitHub Pages

### 1. Configurar reposit&oacute;rio

No `package.json`, defina o `homepage`:

```json
{
  "homepage": "https://lucasouqueiroz.github.io/gestao-financeira-app/"
}
```

### 2. Instalar gh-pages

```bash
npm install --save-dev gh-pages
```

### 3. Adicionar scripts de deploy

No `package.json`:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### 4. Deploy

```bash
npm run deploy
```

### 5. Configurar GitHub Pages

1. V&aacute; em **Settings** &gt; **Pages**
2. Em **Source**, selecione `gh-pages` branch
3. Salve

## Seed de Dados Iniciais

Para popular o banco com dados de exemplo:

```sql
-- Categorias de Despesa
insert into public.categorias (nome, tipo, cor) values
  ('Alimenta&ccedil;&atilde;o', 'Despesa', '#ef4444'),
  ('Transporte', 'Despesa', '#f97316'),
  ('Moradia', 'Despesa', '#eab308'),
  ('Lazer', 'Despesa', '#84cc16'),
  ('Sa&uacute;de', 'Despesa', '#06b6d4');

-- Categorias de Ganho
insert into public.categorias (nome, tipo, cor) values
  ('Sal&aacute;rio', 'Ganho', '#22c55e'),
  ('Freelance', 'Ganho', '#3b82f6'),
  ('Investimentos', 'Ganho', '#a855f7');
```

## Troubleshooting

### Erro: "permission denied for table"

- Verifique se as pol&iacute;ticas de RLS est&atilde;o criadas
- Confirme os `GRANT` para o papel `anon` ou `authenticated`
- Veja os logs em **Logs** &gt; **Database** no Supabase

### Erro: "Invalid API key"

- Confirme se `VITE_SUPABASE_ANON_KEY` est&aacute; correta
- Verifique se a chave n&atilde;o foi desabilitada no dashboard

### App n&atilde;o carrega no GitHub Pages

- Limpe o cache: `Ctrl + Shift + R`
- Verifique se `homepage` no `package.json` est&aacute; correto
- Confira se o build foi feito com `npm run build`

## Links &Uacute;teis

- [Docs Supabase](https://supabase.com/docs)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [GitHub Pages](https://pages.github.com/)
