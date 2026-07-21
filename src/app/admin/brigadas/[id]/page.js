"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import BrigadeForm from "../BrigadeForm";

// Wraps the shared form with a fetch of the target brigade. Snake_case fields
// coming from the backend map directly onto the form scaffold, so we just
// spread the response into the initial state.
export default function AdminBrigadaEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [state, setState] = useState({ kind: "loading" });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await api.brigades.get(id);
        if (cancelled) return;
        setState({ kind: "ready", initial: adaptForForm(res?.data ?? {}) });
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof ApiError
            ? err.message
            : err?.message || "Falha ao carregar brigada.";
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
        <button type="button" onClick={() => router.push("/admin/brigadas")}>
          Voltar
        </button>
      </div>
    );
  }
  return <BrigadeForm mode="edit" id={id} initial={state.initial} />;
}

// Backend returns camelCase; form uses snake_case (backend accepts snake_case
// on write). Translate incoming keys so the form can round-trip cleanly.
const adaptForForm = (b) => ({
  slug: b.slug ?? "",
  name: b.name ?? "",
  description: b.description ?? "",
  presentation: b.presentation ?? "",
  email: b.email ?? "",
  phone_number: b.phoneNumber ?? "",
  instagram: b.instagram ?? "",
  pix: b.pix ?? "",
  acting_area: b.actingArea ?? "",
  volunteers: b.volunteers ?? "",
  foundation: b.foundation ?? "",
  address: b.address ?? "",
  state: b.state ?? "",
  city: b.city ?? "",
  latitude: b.latitude ?? "",
  longitude: b.longitude ?? "",
  image_url: b.imageUrl ?? "",
  external_code: b.externalCode ?? "",
});
