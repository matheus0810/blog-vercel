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

## Guia prático: Supabase + Vercel (produção)

### 1) Criar projeto no Supabase
1. Acesse: https://supabase.com
2. Clique em **New project**.
3. Escolha a organização, nome do projeto e senha do banco.
4. Em **Region**, escolha a mais próxima dos seus usuários e da Vercel:
   - Público no Brasil: prefira **South America (São Paulo)**.
   - Público nos EUA: prefira uma região dos EUA (ex.: us-east-1).
5. Após criar, vá em **Project Settings → Database**.
6. Copie a connection string Postgres (URI) para uso no `DATABASE_URL`.

Exemplo de formato esperado (sem secret real):
```bash
postgresql://postgres:[SUA_SENHA]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### 2) Configurar variáveis no Vercel
No projeto da Vercel, abra **Settings → Environment Variables** e cadastre:

- `DATABASE_URL`  
  Exemplo:
  ```bash
  postgresql://postgres:[SUA_SENHA]@db.[PROJECT-REF].supabase.co:5432/postgres
  ```

- `NEXTAUTH_SECRET`  
  Exemplo de valor esperado (string longa/aleatória):
  ```bash
  a9f2c4e1b7d84f0b9a6e2d3c5f7a1b8e9c0d2f4a6b8c1d3e5f7a9b1c2d4e6f8
  ```

- `NEXTAUTH_URL`  
  Exemplo:
  ```bash
  https://blog-vercel-matheus0810.vercel.app
  ```

Depois, faça um novo deploy.

### 3) Rodar migrations em produção
Use um dos caminhos abaixo:

**Opção A — Vercel CLI**
```bash
vercel env pull .env.production.local
npx prisma migrate deploy
```

**Opção B — Dashboard da Vercel (Build Command)**
Defina o build command para executar migration antes do build:
```bash
npx prisma migrate deploy && next build
```

### 4) Seed do usuário admin
Você pode criar o admin de duas formas:

**Opção A — Script (recomendado)**
```bash
vercel env pull .env.production.local
npm run seed
```

**Opção B — Endpoint temporário**
- Criar endpoint protegido por token (ex.: `BOOTSTRAP_TOKEN`) que cria o admin.
- Chamar 1 vez em produção.
- Remover o endpoint logo após uso.

Credencial padrão criada pelo seed atual:
- Email: `admin@admin.com`
- Senha: `123456`

Troque a senha imediatamente após o primeiro login.

### 5) Testar login e admin em produção
1. Acesse `https://SEU-PROJETO.vercel.app/login`.
2. Faça login com o admin.
3. Abra `https://SEU-PROJETO.vercel.app/admin`.
4. Crie um post de teste.
5. Publique o post e valide na home.
6. Edite o post e confirme persistência no banco.

## Checklist final de validação
- [ ] Projeto criado no Supabase e região correta selecionada
- [ ] `DATABASE_URL` configurada na Vercel com URI do Supabase
- [ ] `NEXTAUTH_SECRET` configurado com valor forte e aleatório
- [ ] `NEXTAUTH_URL` configurado com URL pública da Vercel
- [ ] Migrations executadas em produção (`prisma migrate deploy`)
- [ ] Admin criado (script ou endpoint temporário)
- [ ] Login funcionando em `/login`
- [ ] Área admin acessível em `/admin`
- [ ] Criação/edição/publicação de post funcionando
