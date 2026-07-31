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
