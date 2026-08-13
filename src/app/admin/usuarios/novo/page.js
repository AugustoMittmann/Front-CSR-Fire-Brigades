"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import Input from "../../../components/input";
import FormShell, { formStyles } from "../../components/formShell";

// Creating a user provisions a Supabase Auth account server-side via the
// admin API and returns a validated profile row. Password minimum length is
// enforced by the backend (12 chars) — we mirror that hint in the label.
export default function AdminUserNovoPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    display_name: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ kind: "idle" });

  const setField = (key) => (event) => {
    const value = event?.target ? event.target.value : event;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async () => {
    if (!form.email || !form.password) {
      setStatus({ kind: "error", message: "E-mail e senha são obrigatórios." });
      return;
    }
    if (form.password.length < 12) {
      setStatus({
        kind: "error",
        message: "A senha deve ter pelo menos 12 caracteres.",
      });
      return;
    }
    setSubmitting(true);
    setStatus({ kind: "idle" });
    try {
      const body = {
        email: form.email.trim(),
        password: form.password,
      };
      if (form.display_name.trim()) body.display_name = form.display_name.trim();
      await api.profiles.create(body);
      router.push("/admin/usuarios");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err?.message || "Falha ao criar usuário.";
      setStatus({ kind: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormShell
      title="Novo usuário"
      onSubmit={submit}
      onCancel={() => router.push("/admin/usuarios")}
      submitting={submitting}
      error={status.kind === "error" ? status.message : null}
    >
      <div>
        <Input
          label="E-mail"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={setField("email")}
        />
      </div>
      <div>
        <Input
          label="Nome de exibição"
          name="display_name"
          value={form.display_name}
          onChange={setField("display_name")}
        />
      </div>
      <div>
        <Input
          label="Senha (mín. 12 caracteres)"
          name="password"
          type="password"
          required
          value={form.password}
          onChange={setField("password")}
        />
      </div>
    </FormShell>
  );
}
