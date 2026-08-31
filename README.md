# lab

Modelo base: Next.js 15 (App Router) + Supabase (Postgres e autenticação) + Tailwind 4.
Login por link mágico, sessão renovada no middleware e uma rota protegida de exemplo.

## Rodar localmente

```bash
npm install
cp .env.example .env.local   # preencha as duas chaves do Supabase
npm run dev
```

As chaves ficam no painel do Supabase em **Project Settings → API**:

| Variável | Onde encontrar |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública `anon` |

`.env.local` está no `.gitignore` — nunca versione as chaves.

## Estrutura

```
app/
  page.tsx               landing pública
  login/page.tsx         formulário de link mágico
  dashboard/page.tsx     rota protegida
  auth/confirm/route.ts  valida o token do e-mail e cria a sessão
  auth/signout/route.ts  encerra a sessão
lib/supabase/
  client.ts              cliente de browser
  server.ts              cliente de Server Component
  middleware.ts          renovação de sessão e guarda de rotas
proxy.ts                 liga o guarda a todas as rotas (Next 16 substituiu middleware.ts)
```

Rotas públicas são declaradas em `PUBLIC_ROUTES` dentro de `lib/supabase/middleware.ts`.
Qualquer rota fora dessa lista exige sessão.

## Publicar na Vercel

1. `git push` para o GitHub
2. Import do repositório na Vercel
3. Copiar as três variáveis de ambiente do `.env.example` no painel da Vercel
4. Em produção, `NEXT_PUBLIC_SITE_URL` recebe a URL real do app

No Supabase, em **Authentication → URL Configuration**, adicione a URL de produção
e `https://*.vercel.app/**` em *Redirect URLs*, senão o link mágico não volta para o app.

## Notas

- O `getUser()` do middleware revalida o token a cada requisição. Não remova.
- Enquanto o e-mail sair pelo servidor do Supabase, há limite baixo de envios.
  Ao ligar o Resend em **Authentication → Emails → SMTP**, o limite sobe e a
  entrega melhora.
