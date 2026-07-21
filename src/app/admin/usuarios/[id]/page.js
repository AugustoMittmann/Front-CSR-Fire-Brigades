"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import Input from "../../../components/input";
import Select from "../../../components/select";
import FormShell from "../../components/formShell";

const ROLES = [
  { key: "user", value: "Usuário" },
  { key: "admin", value: "Admin" },
  { key: "super_admin", value: "Super Admin" },
];

// Editing an existing user updates display_name, role, and is_validated. The
// backend has no endpoint to change email or password from here — those are
// handled by the user themselves via Auth0's password reset.
export default function AdminUserEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [state, setState] = useState({ kind: "loading" });
  const [form, setForm] = useState({
    display_name: "",
    role: "user",
    is_validated: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await api.profiles.get(id);
        if (cancelled) return;
        const profile = res?.data ?? {};
        setForm({
          display_name: profile.displayName ?? "",
          role: profile.role ?? "user",
          is_validated: !!profile.isValidated,
        });
        setState({ kind: "ready", email: profile.email });
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof ApiError
            ? err.message
            : err?.message || "Falha ao carregar usuário.";
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
        <button type="button" onClick={() => router.push("/admin/usuarios")}>
          Voltar
        </button>
      </div>
    );
  }

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await api.profiles.update(id, {
        display_name: form.display_name || null,
        role: form.role,
        is_validated: form.is_validated,
      });
      router.push("/admin/usuarios");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err?.message || "Falha ao salvar usuário.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormShell
      title={`Editar usuário — ${state.email}`}
      onSubmit={submit}
      onCancel={() => router.push("/admin/usuarios")}
      submitting={submitting}
      error={error}
    >
      <div>
        <Input
          label="Nome de exibição"
          name="display_name"
          value={form.display_name}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, display_name: e.target.value }))
          }
        />
      </div>
      <div>
        <Select
          label="Papel"
          name="role"
          items={ROLES}
          setSelectedKey={(k) => setForm((prev) => ({ ...prev, role: k }))}
        />
      </div>
      <div>
        <label style={{ display: "flex", gap: 8, alignItems: "center", color: "#39542D" }}>
          <input
            type="checkbox"
            checked={form.is_validated}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, is_validated: e.target.checked }))
            }
          />
          Validado
        </label>
      </div>
    </FormShell>
  );
}
