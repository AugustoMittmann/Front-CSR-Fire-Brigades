/**
 * Keep-alive do Supabase.
 *
 * O projeto Supabase no plano free pausa após ~7 dias sem atividade. Qualquer
 * query real ao banco conta como atividade e reinicia esse contador. Esta rota
 * faz um SELECT mínimo numa tabela e é chamada diariamente pelo Vercel Cron
 * (ver "crons" em vercel.json) — 1x/dia dá bastante margem sobre o limite.
 *
 * Roda no servidor de propósito: usa SUPABASE_SERVICE_ROLE_KEY (server-only,
 * NUNCA prefixada com NEXT_PUBLIC_), que também dispensa políticas de RLS para
 * o ping. Sem as variáveis, responde 503 com mensagem clara em vez de quebrar.
 *
 * Segurança: se CRON_SECRET estiver definida, exige o header
 * `Authorization: Bearer <CRON_SECRET>` que o Vercel Cron envia automaticamente.
 * Sem CRON_SECRET, a rota fica aberta (baixo risco: só faz um SELECT limit 1).
 */

// Nunca cachear: cada chamada precisa realmente ir ao Supabase.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Tabela pequena e estável usada só para tocar o banco.
const PING_TABLE = "faqs";

export async function GET(request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return Response.json(
        { error: { code: "unauthorized", message: "Cron secret inválido." } },
        { status: 401 },
      );
    }
  }

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return Response.json(
      {
        error: {
          code: "not_configured",
          message:
            "Keep-alive não configurado. Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente.",
        },
      },
      { status: 503 },
    );
  }

  try {
    // SELECT id LIMIT 1 via PostgREST — query real, payload mínimo.
    const res = await fetch(
      `${url}/rest/v1/${PING_TABLE}?select=id&limit=1`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      const body = await res.text();
      // eslint-disable-next-line no-console
      console.error("[keep-alive] Supabase respondeu", res.status, body);
      return Response.json(
        { error: { code: "supabase_error", message: `Supabase respondeu ${res.status}.` } },
        { status: 502 },
      );
    }

    return Response.json({ ok: true, pingedAt: new Date().toISOString() });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[keep-alive] falhou", err);
    return Response.json(
      { error: { code: "keep_alive_failed", message: "Falha ao pingar o Supabase." } },
      { status: 502 },
    );
  }
}
