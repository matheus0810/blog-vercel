
## Variáveis de ambiente (Prisma/Vercel)

- `DATABASE_URL` (**obrigatória**): conexão principal do app.
- `DIRECT_URL` (**opcional**): conexão direta para operações de schema/migration.

No build da Vercel, se `DIRECT_URL` não estiver definida, o projeto usa fallback automático para `DATABASE_URL` ao executar `prisma db push`.
