"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import PostForm from "../../PostForm";

// Route: /admin/artigos/[kind]/[id] where kind is 'article' or 'news'. Fetches
// the target record from the matching backend endpoint and prefills the form.
export default function AdminPostEditPage() {
  const params = useParams();
  const router = useRouter();
  const kind = params?.kind === "news" ? "news" : "article";
  const id = params?.id;
  const [state, setState] = useState({ kind: "loading" });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = kind === "news"
          ? await api.news.get(id)
          : await api.articles.get(id);
        if (cancelled) return;
        setState({ kind: "ready", initial: adapt(res?.data ?? {}) });
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof ApiError
            ? err.message
            : err?.message || "Falha ao carregar publicação.";
        setState({ kind: "error", message });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [kind, id]);

  if (state.kind === "loading") return <p>Carregando…</p>;
  if (state.kind === "error") {
    return (
      <div>
        <p style={{ color: "#D92D20" }}>{state.message}</p>
        <button type="button" onClick={() => router.push("/admin/artigos")}>
          Voltar
        </button>
      </div>
    );
  }
  return (
    <PostForm mode="edit" initialKind={kind} id={id} initial={state.initial} />
  );
}

// Backend returns camelCase; form uses snake_case.
const adapt = (r) => ({
  slug: r.slug ?? "",
  title: r.title ?? "",
  subtitle: r.subtitle ?? "",
  summary: r.summary ?? "",
  body: r.body ?? "",
  author: r.author ?? "",
  image_url: r.imageUrl ?? "",
  // Backend gives us ISO; date-only input needs YYYY-MM-DD.
  published_at: r.publishedAt ? r.publishedAt.slice(0, 10) : "",
  category: r.category ?? "Artigo",
  source_url: r.sourceUrl ?? "",
});
