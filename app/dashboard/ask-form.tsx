"use client";

import { useState } from "react";

export default function AskForm() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Erro inesperado");
        return;
      }
      setAnswer(data.text);
    } catch {
      setError("Nao foi possivel falar com o servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-10 border-t border-current/10 pt-8">
      <h2 className="text-sm font-semibold uppercase tracking-widest opacity-50">
        Teste da IA
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
          rows={3}
          placeholder="Pergunte alguma coisa..."
          className="resize-y rounded-lg border border-current/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-current/50"
        />
        <button
          type="submit"
          disabled={loading}
          className="self-start rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background disabled:opacity-50"
        >
          {loading ? "Pensando..." : "Perguntar"}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      {answer && (
        <p className="mt-4 whitespace-pre-wrap rounded-lg border border-current/15 px-4 py-3 text-sm leading-relaxed">
          {answer}
        </p>
      )}
    </div>
  );
}
