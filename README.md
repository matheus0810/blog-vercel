# Blog Vercel (Next.js + Prisma)

Blog simples com área administrativa para criar/editar posts, pronto para deploy na Vercel.

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Prisma ORM
- NextAuth (Credentials)
- SQLite (dev) / Postgres (produção)

## Rodando localmente
1. Instale dependências:

```bash
npm install
```

2. Configure variáveis de ambiente:

```bash
cp .env.example .env
```

3. Gere o cliente Prisma e rode migration:

```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Crie usuário admin inicial:

```bash
npm run seed
```

5. Rode o projeto:

```bash
npm run dev
```

Acesse:
- Site: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`
- Login: `http://localhost:3000/login`

## Credenciais admin padrão (seed)
- Email: `admin@admin.com`
- Senha: `123456`

> Altere imediatamente em produção.

## Deploy na Vercel
1. Suba o repo no GitHub (já feito).
2. Importe na Vercel.
3. Configure variáveis:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
4. Em produção, use Postgres (Neon/Supabase) no `DATABASE_URL`.
5. Rode migrations no banco de produção.

---

## Guia prático: Supabase + Vercel (produção)

> Este projeto usa `DATABASE_URL` (Postgres) + variáveis do NextAuth.  
> As chaves `Publishable` e `Secret` do Supabase **não substituem** a `DATABASE_URL`.

### 1) Onde pegar o `DATABASE_URL` no Supabase
1. Abra seu projeto no Supabase.
2. Vá em **Project Settings** → **Database**.
3. Procure **Connection string**.
4. Selecione a opção de **URI** (Postgres).
5. Copie a string completa.

Exemplo de formato:

```bash
postgresql://user:password@host:5432/dbname?sslmode=require
```

---

### 2) Como adicionar variáveis na Vercel
1. Abra seu projeto na Vercel.
2. Vá em **Settings** → **Environment Variables**.
3. Adicione as variáveis:

- `DATABASE_URL` = *connection string do Supabase*
- `NEXTAUTH_SECRET` = valor forte e aleatório
- `NEXTAUTH_URL` = `https://SEU-PROJETO.vercel.app`

Gerando `NEXTAUTH_SECRET` localmente:

```bash
openssl rand -base64 32
```

> Dica: adicione em `Production` (e também em `Preview/Development` se necessário).

---

### 3) Exemplo visual (passo a passo rápido)
Fluxo:
1. **Supabase** → Project Settings → Database → Connection string (URI)
2. **Copiar** `postgresql://...`
3. **Vercel** → Settings → Environment Variables
4. **Criar** `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
5. **Redeploy** do projeto na Vercel

Checklist visual:
- [ ] Copiei a URI do Postgres no Supabase
- [ ] Cadastrei `DATABASE_URL` na Vercel
- [ ] Cadastrei `NEXTAUTH_SECRET` na Vercel
- [ ] Cadastrei `NEXTAUTH_URL` com domínio final da Vercel
- [ ] Fiz novo deploy após salvar variáveis

---

### 4) Como rodar migrations em produção
Opção A (CLI):

```bash
vercel env pull
npx prisma migrate deploy
```

Opção B (via fluxo de deploy):
- Garanta que `DATABASE_URL` de produção está correta.
- Execute o deploy na Vercel.
- Rode `prisma migrate deploy` no ambiente de execução/deploy do projeto.

---

### 5) Como criar usuário admin inicial
Você pode fazer de duas formas:

1. **Script seed** (recomendado):
   - Execute o seed apontando para o banco de produção.
   - Exemplo já existente no projeto: `npm run seed`.

2. **Rota temporária protegida**:
   - Criar uma rota de bootstrap para gerar o admin inicial.
   - Usar apenas uma vez e remover em seguida.

---

### 6) Checklist final de validação
- [ ] `DATABASE_URL` está apontando para o banco de produção do Supabase
- [ ] `NEXTAUTH_SECRET` foi gerado com valor forte
- [ ] `NEXTAUTH_URL` está com a URL pública correta da Vercel
- [ ] Migrations aplicadas com `prisma migrate deploy`
- [ ] Usuário admin inicial criado e login testado
- [ ] Área `/admin` acessível após autenticação

---

## Segurança (importante)
- Nunca exponha `Secret keys` do Supabase no frontend.
- Se uma chave secreta foi compartilhada publicamente, gere/rotacione uma nova no Supabase.
