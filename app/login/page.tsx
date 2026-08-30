"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function signInWithGoogle() {
    setStatus("sending");
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${siteUrl()}/auth/callback?next=/dashboard` },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
    }
  }

  async function sendMagicLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${siteUrl()}/auth/confirm?next=/dashboard` },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("sent");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="text-2xl font-bold tracking-tight">Entrar</h1>
      <p className="mt-2 text-sm opacity-60">
        Use sua conta Google ou receba um link por e-mail.
      </p>

      <button
        onClick={signInWithGoogle}
        disabled={status === "sending"}
        className="mt-6 flex items-center justify-center gap-2.5 rounded-lg border border-current/20 px-4 py-2.5 text-sm font-medium hover:bg-current/5 disabled:opacity-50"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1 .7-2.3 1.1-4 1.1-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.4 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.4a12 12 0 0 0 0 10.8l4-3.1z"
          />
          <path
            fill="#EA4335"
            d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0A12 12 0 0 0 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8z"
          />
        </svg>
        Continuar com Google
      </button>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest opacity-40">
        <span className="h-px flex-1 bg-current" />
        ou
        <span className="h-px flex-1 bg-current" />
      </div>

      {status === "sent" ? (
        <p className="rounded-lg border border-current/15 px-4 py-3 text-sm">
          Link enviado para <strong>{email}</strong>. Abra o e-mail para
          continuar.
        </p>
      ) : (
        <form onSubmit={sendMagicLink} className="flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@exemplo.com"
            className="rounded-lg border border-current/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-current/50"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background disabled:opacity-50"
          >
            {status === "sending" ? "Enviando..." : "Enviar link"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="mt-3 text-sm text-red-500">{message}</p>
      )}
    </main>
  );
}
