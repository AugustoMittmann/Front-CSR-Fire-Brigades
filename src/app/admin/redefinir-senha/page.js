"use client";

import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "../../components/button";

// The wireframe shows old-password + new-password fields, but the Auth0 SPA
// SDK cannot change a password directly — Auth0's supported flow is a reset
// email. We surface that expectation clearly in the copy so admins don't
// hunt for a "confirm" button that doesn't exist.
//
// Future work: expose a backend endpoint that calls Auth0 Management API's
// changePassword, and replace this with a proper old/new form.
export default function RedefinirSenhaPage() {
  const { user } = useAuth0();
  const [status, setStatus] = useState({ kind: "idle" });

  const sendResetEmail = async () => {
    if (!user?.email) {
      setStatus({
        kind: "error",
        message: "Não foi possível ler seu e-mail da sessão atual.",
      });
      return;
    }
    setStatus({ kind: "loading" });
    try {
      const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
      const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
      if (!domain || !clientId) throw new Error("Auth0 não está configurado.");
      const res = await fetch(`https://${domain}/dbconnections/change_password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: clientId,
          email: user.email,
          connection: "Username-Password-Authentication",
        }),
      });
      if (!res.ok) throw new Error(`Erro ${res.status} ao solicitar a redefinição.`);
      setStatus({
        kind: "success",
        message: `Enviamos um e-mail para ${user.email}. Siga as instruções para trocar a senha.`,
      });
    } catch (err) {
      setStatus({ kind: "error", message: err?.message || "Falha inesperada." });
    }
  };

  return (
    <section style={{ maxWidth: 520 }}>
      <h1 style={{ color: "#263A1E", fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Redefinir senha
      </h1>
      <p style={{ color: "#39542D", marginBottom: "1.25rem", lineHeight: 1.4 }}>
        Enviaremos um e-mail para <strong>{user?.email ?? "sua conta"}</strong> com um link para
        cadastrar uma nova senha. O link expira em algumas horas.
      </p>
      <Button
        placeholder={status.kind === "loading" ? "Enviando…" : "Enviar e-mail de redefinição"}
        onPress={sendResetEmail}
        disabled={status.kind === "loading"}
        style="emphasized"
      />
      {status.kind === "success" && (
        <p
          role="status"
          style={{ marginTop: "1rem", color: "#39542D", background: "#e0f1d9", padding: "0.75rem", borderRadius: 8 }}
        >
          {status.message}
        </p>
      )}
      {status.kind === "error" && (
        <p
          role="alert"
          style={{ marginTop: "1rem", color: "#D92D20", background: "#FEE4E2", padding: "0.75rem", borderRadius: 8 }}
        >
          {status.message}
        </p>
      )}
    </section>
  );
}
