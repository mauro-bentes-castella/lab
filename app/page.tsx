import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest opacity-50">
        Ambiente pessoal
      </p>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Lab</h1>
      <p className="mt-4 max-w-md text-lg opacity-70">
        Next.js na Vercel, Postgres e login no Supabase. Base para qualquer
        projeto novo.
      </p>

      <div className="mt-8">
        {user ? (
          <Link
            href="/dashboard"
            className="inline-block rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background"
          >
            Ir para o painel
          </Link>
        ) : (
          <Link
            href="/login"
            className="inline-block rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background"
          >
            Entrar
          </Link>
        )}
      </div>
    </main>
  );
}
