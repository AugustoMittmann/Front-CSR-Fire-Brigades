"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import FaqForm from "../FaqForm";

// Backend has no GET /api/faqs/:id, so we load the full list and filter.
export default function AdminFaqEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [state, setState] = useState({ kind: "loading" });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await api.faqs.list();
        const match = (res?.data ?? []).find((f) => f.id === id);
        if (cancelled) return;
        if (!match) {
          setState({ kind: "error", message: "FAQ não encontrada." });
          return;
        }
        setState({ kind: "ready", initial: match });
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof ApiError
            ? err.message
            : err?.message || "Falha ao carregar FAQ.";
        setState({ kind: "error", message });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (state.kind === "loading") return <p>Carregando…</p>;
  if (state.kind === "error") {
    return (
      <div>
        <p style={{ color: "#D92D20" }}>{state.message}</p>
        <button type="button" onClick={() => router.push("/admin/faqs")}>
          Voltar
        </button>
      </div>
    );
  }
  return <FaqForm mode="edit" id={id} initial={state.initial} />;
}
