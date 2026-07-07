"use client";

import { withAuthenticationRequired, useAuth0 } from "@auth0/auth0-react";
import Loading from "../../components/loading";
import Button from "../../components/button";

// Namespaced custom claim set by an Auth0 Action. The backend must be updated
// to read the same claim (or fall back to a DB profile lookup). We match on
// admin OR super_admin; user tier bounces out with a 403 screen.
const ROLES_CLAIM = "https://conexaobrigada.com/roles";

const readRoles = (user) => {
  if (!user) return [];
  const roles = user[ROLES_CLAIM];
  if (Array.isArray(roles)) return roles;
  if (typeof roles === "string") return [roles];
  return [];
};

function ForbiddenPage() {
  const { logout } = useAuth0();
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        padding: "1.5rem",
        color: "#39542D",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Acesso restrito</h1>
      <p style={{ maxWidth: 420, lineHeight: 1.4 }}>
        Sua conta não tem permissão para acessar o painel administrativo. Se
        você acredita que isto é um erro, entre em contato com um administrador.
      </p>
      <Button
        placeholder="Sair"
        onPress={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
      />
    </div>
  );
}

// Renders `children` only when the authenticated user has an admin role in
// the ID token's custom claim. Non-admins see a 403 page with a logout CTA.
//
// Escape hatch for local development: setting NEXT_PUBLIC_ADMIN_BYPASS_AUTH=true
// in .env.local skips the role check so you can click around the panel before
// the Auth0 Action that emits the role claim is wired up. Never set this in
// production — the backend still enforces admin on writes, but the UI shell
// would otherwise leak.
function RequireAdminInner({ children }) {
  const { user, isLoading } = useAuth0();
  if (isLoading) return <Loading />;
  if (process.env.NEXT_PUBLIC_ADMIN_BYPASS_AUTH === "true") return children;
  const roles = readRoles(user);
  const isAdmin = roles.includes("admin") || roles.includes("super_admin");
  if (!isAdmin) return <ForbiddenPage />;
  return children;
}

// Two-stage guard: Auth0 redirects unauthenticated users to login; only after
// they authenticate do we check the role claim. `returnTo` preserves the
// admin URL they were trying to reach.
const RequireAdmin = withAuthenticationRequired(RequireAdminInner, {
  onRedirecting: () => <Loading />,
  returnTo: () =>
    typeof window !== "undefined"
      ? `${window.location.pathname}${window.location.search}`
      : "/admin",
});

export default RequireAdmin;
export { ROLES_CLAIM, readRoles };
