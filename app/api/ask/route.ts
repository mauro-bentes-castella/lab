import { NextResponse, type NextRequest } from "next/server";
import { anthropic, MODEL } from "@/lib/anthropic";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  // Sem esta checagem a rota vira um proxy aberto para a sua chave.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  let prompt: unknown;
  try {
    ({ prompt } = await request.json());
  } catch {
    return NextResponse.json({ error: "JSON invalido" }, { status: 400 });
  }

  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    return NextResponse.json({ error: "Prompt vazio" }, { status: 400 });
  }

  if (prompt.length > 4000) {
    return NextResponse.json({ error: "Prompt muito longo" }, { status: 400 });
  }

  try {
    const message = await anthropic().messages.create({
      model: MODEL,
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Falha na chamada a Anthropic:", error);
    return NextResponse.json(
      { error: "Falha ao consultar o modelo" },
      { status: 502 },
    );
  }
}
