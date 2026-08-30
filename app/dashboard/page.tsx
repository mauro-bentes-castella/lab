import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6">
      <h1 className="text-3xl font-bold tracking-tight">Painel</h1>
      <p className="mt-3 opacity-70">
        Sessao ativa como <strong>{user.email}</strong>.
      </p>
      <p className="mt-1 text-sm opacity-50">
        Rota protegida pelo middleware. Sem sessao, redireciona para /login.
      </p>

      <form action="/auth/signout" method="post" className="mt-8">
        <button
          type="submit"
          className="rounded-lg border border-current/20 px-5 py-2.5 text-sm font-medium opacity-80 hover:opacity-100"
        >
          Sair
        </button>
      </form>
    </main>
  );
}
