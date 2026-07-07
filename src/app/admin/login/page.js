"use client";

import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "../../components/loading";
import styles from "./login.module.css";

// Admin login uses Auth0 Universal Login — we don't collect credentials on
// our own page. Landing here immediately redirects to Auth0 (or, if the user
// is already authenticated, forwards them to /admin). This keeps the SPA off
// the password path and matches the wireframe's "Manda email para redefinir"
// note for the forgot-password link.
export default function AdminLoginPage() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      window.location.replace("/admin");
      return;
    }
    loginWithRedirect({
      appState: { returnTo: "/admin" },
    });
  }, [isAuthenticated, isLoading, loginWithRedirect]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.title}>Entrando no painel administrativo…</div>
        <Loading />
      </div>
    </div>
  );
}
